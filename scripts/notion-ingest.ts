#!/usr/bin/env bun
/**
 * Ingests Notion "Blog Queue" pages into colocated markdown posts.
 *
 *   bun run notion:ingest              # write posts for every Ready page
 *   bun run notion:ingest --dry-run    # report only, write nothing
 *   bun run notion:ingest --force      # overwrite an existing post directory
 *
 * Deliberately contains no LLM step. Conversion, media download and frontmatter
 * are all deterministic, so that media fidelity can be trusted before any
 * generated prose is added on top.
 *
 * Notion-hosted assets are signed URLs that expire one hour after they are
 * fetched, so every asset is downloaded during this run and rewritten to a
 * relative path. A Notion URL must never reach a committed markdown file.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { entrySchema } from '../src/lib/content-schema';

// --------------------------------------------------------------------- config

/** Blog Queue property names. Renaming a property in Notion only changes this. */
const PROPS = {
  title: 'Name',
  status: 'Status',
  collection: 'Collection',
  topics: 'Topics',
  slug: 'Slug',
  publishDate: 'Publish Date',
} as const;

const READY_STATUS = 'Ready';
const DEFAULT_COLLECTION = 'blog';

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID =
  process.env.NOTION_DATABASE_ID ?? '3df0586d-b72a-8009-b166-f9420ef8e06e';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

if (!TOKEN) {
  console.error('NOTION_TOKEN is not set. Add it to a gitignored .env file.');
  process.exit(1);
}

const notion = new Client({ auth: TOKEN });
const warnings: string[] = [];

const HAS_FFMPEG = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;

// ---------------------------------------------------------------- utilities

const plain = (rich: any[] | undefined): string =>
  (rich ?? []).map((t: any) => t.plain_text).join('');

/** Must satisfy SLUG_PATTERN in content-schema.ts. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Strips characters that would need URL escaping. */
function safeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = name.slice(0, name.length - ext.length);
  const clean = base
    .replace(/[[(]/g, '-')
    .replace(/[\])]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return (clean || 'asset') + ext;
}

/** Turns markdown into something usable as a plain-text summary. */
function stripMarkdown(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * First real paragraph of the body, used as the summary. The schema requires
 * 20-300 characters; a page whose opening paragraph is too thin is reported
 * rather than padded, because a bad summary is worse than a failed ingest.
 */
function deriveSummary(markdown: string): string | null {
  for (const block of markdown.split(/\n{2,}/)) {
    const line = block.trim();
    if (!line) continue;
    if (/^(#|>|```|---|<|!\[|\||[-*+]\s|\d+\.\s)/.test(line)) continue;

    const text = stripMarkdown(line);
    if (text.length < 20) continue;
    return text.length > 300 ? `${text.slice(0, 297).trimEnd()}...` : text;
  }
  return null;
}

async function downloadAsset(
  url: string,
  targetDir: string,
  used: Set<string>,
): Promise<string> {
  const fromUrl = path.basename(new URL(url).pathname);
  let name = safeFileName(decodeURIComponent(fromUrl));

  if (used.has(name)) {
    const ext = path.extname(name);
    const base = name.slice(0, name.length - ext.length);
    let n = 2;
    while (used.has(`${base}-${n}${ext}`)) n += 1;
    name = `${base}-${n}${ext}`;
  }
  used.add(name);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`download failed (${response.status}) for ${url.split('?')[0]}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(
    path.join(targetDir, name),
    Buffer.from(await response.arrayBuffer()),
  );

  return name;
}

/**
 * A screen-recording GIF is typically an order of magnitude larger than the
 * equivalent H.264 clip, so GIFs are transcoded and rendered as a looping
 * muted video. Attribute names are React-style because the markdown is
 * compiled as MDX, where raw HTML is parsed as JSX.
 */
function transcodeGif(dir: string, gif: string): string | null {
  if (!HAS_FFMPEG) {
    warnings.push(`ffmpeg not found — kept ${gif} as a GIF`);
    return null;
  }

  const mp4 = `${gif.slice(0, -path.extname(gif).length)}.mp4`;
  const result = spawnSync(
    'ffmpeg',
    [
      '-y', '-i', path.join(dir, gif),
      '-movflags', 'faststart',
      '-pix_fmt', 'yuv420p',
      // H.264 requires even dimensions.
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-an', path.join(dir, mp4),
    ],
    { stdio: 'ignore' },
  );

  if (result.status !== 0) {
    warnings.push(`ffmpeg failed on ${gif} — kept the GIF`);
    return null;
  }

  const before = fs.statSync(path.join(dir, gif)).size;
  const after = fs.statSync(path.join(dir, mp4)).size;
  fs.rmSync(path.join(dir, gif));

  console.log(
    `    transcoded ${gif} -> ${mp4} ` +
      `(${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB)`,
  );
  return mp4;
}

function frontmatter(values: Record<string, unknown>): string {
  const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const lines: string[] = ['---'];

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}: [${value.map((v) => quote(String(v))).join(', ')}]`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${quote(String(value))}`);
    }
  }

  lines.push('---', '');
  return lines.join('\n');
}

// ------------------------------------------------------------------- ingest

const database: any = await notion.databases.retrieve({ database_id: DATABASE_ID });
const dataSourceId = database.data_sources?.[0]?.id;

if (!dataSourceId) {
  console.error('No data source found. Is the integration shared with the database?');
  process.exit(1);
}

const query: any = await notion.dataSources.query({
  data_source_id: dataSourceId,
  filter: { property: PROPS.status, status: { equals: READY_STATUS } },
});

console.log(
  `${query.results.length} page(s) with status "${READY_STATUS}"` +
    `${DRY_RUN ? '  [dry run]' : ''}${HAS_FFMPEG ? '' : '  [no ffmpeg]'}\n`,
);

const written: string[] = [];
const failures: string[] = [];

for (const page of query.results) {
  const props = page.properties;

  const title = plain(props[PROPS.title]?.title).trim();
  const explicitSlug = plain(props[PROPS.slug]?.rich_text).trim();
  const slug = slugify(explicitSlug || title);
  const collection = props[PROPS.collection]?.select?.name ?? DEFAULT_COLLECTION;
  const topics = (props[PROPS.topics]?.multi_select ?? []).map((o: any) => o.name);
  const date = props[PROPS.publishDate]?.date?.start ?? page.created_time;

  console.log(`  ${title}  ->  ${collection}/${slug}`);

  if (!title || !slug) {
    failures.push(`${page.id}: page has no usable title`);
    continue;
  }

  const postDir = path.join(CONTENT_DIR, collection, slug);
  if (fs.existsSync(postDir) && !FORCE && !DRY_RUN) {
    failures.push(`${collection}/${slug}: already exists (use --force to overwrite)`);
    continue;
  }

  const imagesDir = path.join(postDir, 'images');
  const used = new Set<string>();
  const pendingGifs: string[] = [];

  const n2m = new NotionToMarkdown({
    notionClient: notion as any,
    config: { parseChildPages: false },
  });

  /** Downloads the asset immediately — the Notion URL expires in an hour. */
  const mediaTransformer = (type: 'image' | 'video' | 'file') => async (block: any) => {
    const media = block[type];
    const url = media?.type === 'file' ? media.file?.url : media?.external?.url;
    if (!url) return '';

    const caption = plain(media.caption).trim();

    if (DRY_RUN) return `![${caption || '(asset)'}](./images/…)`;

    const name = await downloadAsset(url, imagesDir, used);
    console.log(`    downloaded ${name}`);

    if (path.extname(name).toLowerCase() === '.gif') {
      pendingGifs.push(name);
      return `@@GIF:${name}:${caption}@@`;
    }

    if (!caption) {
      warnings.push(
        `${collection}/${slug}: "${name}" has no caption, so alt text falls back to the filename`,
      );
    }

    const alt = caption || path.basename(name, path.extname(name)).replace(/[-_]+/g, ' ');
    return `![${alt}](./images/${name})`;
  };

  n2m.setCustomTransformer('image', mediaTransformer('image'));
  n2m.setCustomTransformer('video', mediaTransformer('video'));
  n2m.setCustomTransformer('file', mediaTransformer('file'));

  let body: string;
  try {
    const blocks = await n2m.pageToMarkdown(page.id);
    body = n2m.toMarkdownString(blocks).parent ?? '';
  } catch (error: any) {
    failures.push(`${collection}/${slug}: conversion failed — ${error?.message ?? error}`);
    continue;
  }

  // Resolve GIF placeholders once the files are on disk.
  for (const gif of pendingGifs) {
    const mp4 = transcodeGif(imagesDir, gif);
    const pattern = new RegExp(`@@GIF:${gif.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:([^@]*)@@`, 'g');

    body = body.replace(pattern, (_m, caption: string) =>
      mp4
        ? `<video autoPlay loop muted playsInline>\n  <source src="./images/${mp4}" type="video/mp4" />\n</video>`
        : `![${caption || path.basename(gif, '.gif').replace(/[-_]+/g, ' ')}](./images/${gif})`,
    );
  }

  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const summary = deriveSummary(body);
  if (!summary) {
    failures.push(
      `${collection}/${slug}: no paragraph of 20+ characters to use as a summary`,
    );
    continue;
  }

  const meta = {
    title,
    date: new Date(date).toISOString(),
    summary,
    draft: true,
    tags: topics,
  };

  const parsed = entrySchema.safeParse({ ...meta, categories: [], showToc: false });
  if (!parsed.success) {
    failures.push(
      `${collection}/${slug}: ${parsed.error.issues
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; ')}`,
    );
    continue;
  }

  if (DRY_RUN) {
    console.log(`    would write ${collection}/${slug}/index.md\n`);
    written.push(`${collection}/${slug}`);
    continue;
  }

  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(path.join(postDir, 'index.md'), frontmatter(meta) + body + '\n');
  console.log(`    wrote ${collection}/${slug}/index.md\n`);
  written.push(`${collection}/${slug}`);
}

// ------------------------------------------------------------------- report

console.log('─'.repeat(60));
console.log(`ingested : ${written.length}`);
for (const w of written) console.log(`  + ${w}`);

if (warnings.length > 0) {
  console.log(`\nwarnings : ${warnings.length}`);
  for (const w of warnings) console.log(`  ! ${w}`);
}

if (failures.length > 0) {
  console.log(`\nfailed   : ${failures.length}`);
  for (const f of failures) console.log(`  x ${f}`);
}

console.log(
  '\nPosts are written with `draft: true`. Review, then flip the flag to publish.\n',
);

if (failures.length > 0) process.exit(1);
