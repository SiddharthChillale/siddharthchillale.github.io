---
title: "Extracting Structured Data from Medical Recall PDFs"
date: "2026-11-14T03:50:00.000Z"
summary: "Pulling structured data out of documents sounds like a solved problem: OCR the PDF, hand the text to an LLM, get JSON back. Our first version of this pipeline followed that recipe, and it worked well enough to ship. It also hid several problems that only surfaced once real users and real document..."
draft: true
---
Pulling structured data out of documents sounds like a solved problem: OCR the PDF, hand the text to an LLM, get JSON back. Our first version of this pipeline followed that recipe, and it worked well enough to ship. It also hid several problems that only surfaced once real users and real documents arrived. This post covers the problem, our first architecture, what went wrong, and the changes that improved accuracy.

## The problem context

Our application was a crowd-sourced application that would provide an early notification of medical recalls issued by manufacturers as FDA recalls took around 3 months. This required that people provide the relevant recall information honestly. But the problem we found was that users would usually upload a PDF of the recall letter and then enter “Refer to the document” in the recall detail forms. Therefore, it was decided to have a simple llm-extraction step that would extract form-relevant details from recall letters and make it available as prefilled information in the form.

The task is **extraction, not summarization**. Every field has to come out as written in the source, and some fields need to be classified into fixed categories.

This was made difficult by a few things like:

- **No standard layout.** The FDA requires a few mandatory fields in a recall, but almost no two providers share a layout or naming convention. One provider says "batch number," another says "lot number" for the same thing, and a third uses a custom identifier like "<manuafacturer-name> ID."
- **Scanned documents.** Many PDFs are scans, so the content is collection of embedded images with no text layer. OCR was mandatory.
- **A complex output schema.** The target schema is deeply nested, and as we found, LLM structured output degrades quickly beyond two levels of nesting.

## Version one: OCR plus an LLM

The first design was a straightforward LLM-augmented pipeline: **AWS Textract** for OCR, then an LLM for structured extraction. We used the `aws-textractor` library to convert Textract's response into layout-aware markdown, which is much easier for an LLM to read than raw OCR output.

The system was fully serverless, built on Step Functions, Lambda, and queues.

**Triggering the workflow.** Documents arrive as a _packet_, a batch of PDFs. An S3 event trigger fires per file, but we wanted one workflow run per packet. So after the backend stores the packet's PDFs under an S3 prefix, it writes one more empty file named `.ready`. That sentinel file is the only thing that triggers the workflow, which then picks up every PDF under the prefix.

**Processing.**

1. Each PDF goes to Textract. The full response (with layout information) and the sanitized markdown are saved to S3, with metadata persisted in the database.
2. The next Lambda sends the markdown to an LLM, stores the raw response in S3, and runs some post-processing.
3. The extracted object is saved to the database and shown in a human review queue. After review, it is used to prefill forms downstream.

Notice one design flaw: **we never validated the LLM's output against the Textract response.** The OCR output was the ground truth we had, and we didn't use it to check anything.

## What went wrong

### Layout and confidence were lost at the LLM boundary

Textract gives you layout structure and per-word confidence scores, but converting to markdown discards both. Nested table cells often broke the layout before the text even reached the LLM, and table information was frequently mislabeled. In our experience, OCR output that was around 95% confident degraded to roughly 70% recall once it had passed through the LLM.

### Models stop to ask permission

Some models are tuned for conversation, Claude 3.5 Sonnet, for example, would extract 5 of around 150 list items and then ask whether we wanted the rest. That is reasonable in a chat but a failure in a single-call pipeline, where nobody is there to answer. Instruct-tuned models did server better than chat models in general.

### Flaky evaluation dataset

Nobody was assigned to build a proper evaluation set. The human review step produced corrections, but they were incomplete. If the LLM extracted 5 of 150 products, no reviewer was going to hand-enter the other 145, especially when each product is itself a nested object. So the only dataset I could assemble was whatever corrections happened to come in.

### Type safety made evaluation harder

We used **BAML** for llm-orchestration. Its type-safe structured output meant we could skip `JSON.parse()` and `isinstance()` checks and trust the response to have the right keys. The tradeoff is that the usual ways of building datasets and running evals no longer applied, and we needed our own ways to build evaluation harness.

## Solutions to the challenges

### Building evals from data we already had

Because the architecture stored both the raw LLM output and the human-corrected output, we could construct usable datasets from the review queue. Evaluation combined deterministic checks with LLM-as-judge.

**Code-based checks:**

- Classification fields match
- Product-list item count
- Fuzzy match on individual product names
- Fuzzy match on manufacturer name
- Date fields match

**LLM-based checks:**

- Attribute-level matching of individual products. Which items exist, and how they map to each other, varied too much for deterministic matching, so this needed an LLM.
- Recall description quality

### Splitting one LLM call into multiple

The hardest obstacle was the product list: getting the count right and mapping each item's attributes correctly. After testing a range of models on our evaluations, **Kimi K2.5** gave the best combination of latency, product count, and field mapping accuracy. But it often hallucinated other recall fields, such as the description and manufacturer name. 

So we split the single call in two. **Llama 4** extracts the recall-level details, **Kimi K2.5** extracts only the products, and the two outputs are merged into one object. This raised our product-list scores noticeably. On documents with 150 products, we were now extracting around 135, which left far less manual work for reviewers. 

The Kimi step was also subdivided into first finding the specific product attributes mentioned in the letter and then building the specific output schema for products and then extracting products alongwith the attributes.

### Flattening the schema and rebuilding the hierarchy in code

Initially, products were a simple array of flat objects. Then our Product Lead defined a more elaborate internal standard, with arrays of objects nested inside arrays of objects, up to five levels deep in the worst case.

Giving that schema directly to the LLM wrecked every evaluation. The fix was to **expose a flat schema to the LLM and let deterministic code rebuild the hierarchy.** The model does what it's good at, reading and extracting, and plain code handles structure. The eval harness had to be restructured to match the nesting as well.

## What I learned

1. **Don't throw away OCR signal.** Layout and confidence are valuable. Validating LLM output against the OCR response is something I'd build in from day one.
2. **Use the right model for each sub-task.** One model was best at products and worse at everything else. Two focused calls beat one general call.
3. **Keep LLM schemas shallow.** Flatten them and restructure in code.
4. **Plan on a custom eval harness.** For production work with schemas like this, off-the-shelf eval runners don't offer the freedom to customize that you need.

---

### Things I would improve

The first step is to use Textract's output as a check on the LLM's. Our schema is flat when the model returns it, so I'd verify at that stage, before the hierarchy is rebuilt. Each extracted value (product name, lot number, date) gets fuzzy-matched against the OCR words, and anything that can't be found in the document is flagged as a likely hallucination. Each value would carry its Textract confidence through the rebuild, so reviewers can check the shaky ones first and see the source region next to each field.

The recall description can't be matched verbatim, since it combines several pieces of information. For that field I'd check coverage instead: do the entities inside it (products, lot numbers, dates, manufacturer) actually appear in the OCR text?

I'd also compare the product count against the number of distinct identifiers found in the OCR text through table detection tools like counts RowIndex. A big gap catches truncation like the 5-of-150 case without a human looking.

Finally, grounding rate and confidence-weighted accuracy would go into the eval harness, so we can tell whether a change improves grounding and not just the match rate against human corrections.
