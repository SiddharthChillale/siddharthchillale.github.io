import { z } from 'zod';

/**
 * Single source of truth for content frontmatter.
 *
 * Deliberately framework-agnostic: this file has no Next.js or Astro imports so
 * it survives a framework migration unchanged, and can be imported by CI, by the
 * Notion ingest pipeline, and by an authoring agent's validation tool.
 *
 * The schema is strict on purpose. A human filling in a form finds required
 * fields annoying; an agent does not. Completeness is cheap for the thing that
 * writes most of this content, so we make incompleteness a hard failure rather
 * than a silent empty string.
 */

export const COLLECTIONS = ['blog', 'projects'] as const;
export type Collection = (typeof COLLECTIONS)[number];

/**
 * Existing slugs use both `-` and `_` separators. Enforcing kebab-case would
 * change published URLs, so both are permitted. New content should prefer `-`.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

const coverSchema = z.strictObject({
  image: z.string().min(1, 'cover.image must not be an empty string'),
  alt: z.string().min(1, 'cover.alt is required (screen readers need it)'),
  caption: z.string().optional(),
});

const toDate = (v: Date | string): Date => new Date(v as string);

/**
 * Accepts a YAML date (js-yaml gives us a real Date) or an ISO 8601 string, and
 * always yields a Date. Kept as a union rather than `z.coerce.date()` so that a
 * missing key reports as missing instead of as an invalid Date.
 */
const dateSchema = z
  .union([z.date(), z.string().min(1)])
  .refine(
    (v) => !Number.isNaN(toDate(v).getTime()),
    'must be a valid date (YYYY-MM-DD or ISO 8601)',
  )
  .transform(toDate);

export const entrySchema = z.object({
  title: z.string().min(1, 'title is required').max(120),
  date: dateSchema,
  summary: z
    .string()
    .min(20, 'summary must be at least 20 characters to be useful in listings')
    .max(300),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  showToc: z.boolean().default(false),
  cover: coverSchema.optional(),
});

export type Entry = z.infer<typeof entrySchema>;

/** Top-level keys the schema knows about, used to report stray frontmatter. */
export const KNOWN_KEYS = Object.keys(entrySchema.shape);
