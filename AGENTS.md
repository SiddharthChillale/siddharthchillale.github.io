# Project Documentation for Agents

## Technology Stack

- **Runtime**: Bun (not npm or yarn)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: MDX files with gray-matter for frontmatter parsing

## Package Manager

This project uses **Bun** as the package manager. All commands should use `bun` instead of `npm` or `yarn`.

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Lint code
bun run lint
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components
- `src/content/` - MDX content (blog posts, projects)
- `src/lib/` - Utility functions and content fetching logic

## Key Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production (static export) |
| `bun run lint` | Run ESLint |
| `bun run sync:assets` | Copy colocated post assets into `public/` |
| `bun run validate:content` | Validate all content frontmatter and asset references |
| `bun run notion:probe` | Dump one Notion page's converted markdown, for debugging |
| `bun run notion:ingest` | Convert `Ready` Blog Queue pages into posts |

## Content Model

Each entry is a self-contained directory: one folder is one post.

```
src/content/<collection>/<slug>/
  index.md          # the post; always named index.md
  images/           # assets belonging to this post only
```

Collections are `blog` and `projects`. The directory name is the URL slug.

Posts reference their own assets **relatively**: `![alt](./images/foo.png)`, and
the same for `cover.image`. Never write `/images/...` — that layout is gone.
Adding or deleting a post is therefore a single atomic directory change, which
is what makes the content tree safe for an agent to edit.

Shared assets that are not owned by one post (the profile photo, the resume PDF)
stay in `public/` and are referenced absolutely.

`bun run sync:assets` copies `src/content/<collection>/<slug>/images/` into
`public/<collection>/<slug>/images/` so the static export can serve them. It
runs automatically before `dev` and `build`, and the generated directories are
gitignored. This step goes away under Astro, which handles colocated assets
natively.

Asset filenames must be URL-safe: no spaces, brackets or parentheses.

### Frontmatter contract

`src/lib/content-schema.ts` is the **single source of truth** for frontmatter. It
is plain Zod with no framework imports, and it is enforced in three places: the
validator, the site loader (`src/lib/content.ts`), and CI.

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | 1-120 chars |
| `date` | yes | `YYYY-MM-DD` or ISO 8601 |
| `summary` | yes | 20-300 chars, shown in listings |
| `draft` | no | defaults `false`; `true` hides the entry |
| `tags` | no | array of strings |
| `categories` | no | array of strings |
| `showToc` | no | defaults `false` |
| `cover` | no | object with `image`, `alt`, and optional `caption` |

Rules that are easy to get wrong:

- Keys are **case-sensitive**. `Title`, `Date` and `ShowToc` are Hugo-era spellings
  and are rejected, because the loader would otherwise ignore them silently.
- `cover` accepts no other keys. `relative: true` is a Hugo leftover and is rejected.
- `cover.alt` must describe the image. A filename is not alt text.
- There is no `author` field. The single author is set in `src/lib/config.ts`.

The schema is deliberately strict. Required fields are cheap for an agent to
supply, so incompleteness is a hard failure rather than a silent empty string.

**Always run `bun run validate:content` before opening a pull request.** It also
verifies that every image referenced from a post exists on disk.

## Notion ingest

Capture happens in the Notion **Blog Queue** database; Git is authoritative for
content. Notion holds a pointer — `Status` and `PR` — and never the post itself.
The flow is one-way and the only write Notion receives is that pointer update.

```
Notion page (Status: Ready)
  -> notion-ingest.yml  (cron, or workflow_dispatch)
  -> src/content/<collection>/<slug>/  on branch cms/<collection>/<slug>
  -> pull request  ->  Cloudflare preview deployment
  -> Notion page (Status: Drafted, PR: <url>)
```

`scripts/notion-schema.ts` holds the property names and status values. Renaming
a column in Notion is a change there and nowhere else.

```bash
bun run notion:ingest --dry-run            # report only, write nothing
bun run notion:ingest --limit 3            # oldest N Ready pages
bun run notion:ingest --manifest f.json    # record what was written, for CI
bun run notion:ingest --force              # overwrite an existing post dir

bun run scripts/notion-set-status.ts --page <id> --status Drafted --pr <url>
```

The ingest contains **no LLM step**. Conversion, media download and frontmatter
are deterministic so that media fidelity can be trusted before any model is
involved. Editing is a separate, later pass over the already-converted markdown.

Ingest is **polled, not webhook-driven**. `Status` is a queue that the workflow
drains, and a page is flipped to `Drafted` only once its pull request exists, so
a run that dies halfway leaves the page `Ready` for the next run. A dropped
webhook would lose a post silently. To publish immediately, run the workflow by
hand rather than waiting for the cron.

Posts land with `draft: true`: visible on the preview deployment (CI sets
`INCLUDE_DRAFTS=1` for pull requests) and invisible in production. Clearing the
flag is what publishes.

### Required secrets

| Secret | Used by | Notes |
|--------|---------|-------|
| `NOTION_TOKEN` | `notion-ingest.yml` | Integration must be shared with the Blog Queue database |
| `CLOUDFLARE_API_TOKEN` | `ci.yml` | |
| `CLOUDFLARE_ACCOUNT_ID` | `ci.yml` | |
| `AGENT_GITHUB_TOKEN` | `notion-ingest.yml` | Fine-grained PAT: contents write, pull requests write |

`AGENT_GITHUB_TOKEN` is not optional in practice. A pull request opened with the
default `GITHUB_TOKEN` does not trigger other workflows — GitHub's loop guard —
so `ci.yml` would never run and there would be no preview deployment to review,
which is the entire point of the loop. The workflow falls back to `GITHUB_TOKEN`
so it still opens a pull request without the PAT, just a preview-less one.

Scheduled workflows are disabled automatically after 60 days without repository
activity. If ingest silently stops, check that first.

## Deployment

The site deploys to Cloudflare Pages from `.github/workflows/ci.yml`. Project
config lives in `wrangler.toml`, so `bunx wrangler pages deploy` works with no
arguments after a build. Pull requests get a preview deployment, and the URL is
posted as a comment on the PR.

## Static Export

The project is configured for static export (`output: "export"` in next.config.mjs). This means:
- Dynamic routes with `searchParams` require client-side handling
- Use client components with `useEffect` or `URLSearchParams` for query parameter handling