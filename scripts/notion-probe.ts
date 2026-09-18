#!/usr/bin/env bun
/**
 * Read-only probe of the Notion Blog Queue.
 *
 * Run: bun run notion:probe
 *
 * Writes nothing and mutates nothing. It exists to answer three questions
 * before the real ingest is written:
 *
 *   1. What shape are the Blog Queue properties actually returned in?
 *   2. Which block types appear, and how are media URLs represented?
 *   3. Is the first-party `pages.retrieveMarkdown` good enough to drop the
 *      third-party `notion-to-md` dependency?
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? '3df0586d-b72a-8009-b166-f9420ef8e06e';

if (!TOKEN) {
  console.error(
    'NOTION_TOKEN is not set.\n' +
      'Create a gitignored .env in the project root containing:\n\n' +
      '  NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx\n',
  );
  process.exit(1);
}

const notion = new Client({ auth: TOKEN });
const truncate = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n)}\n  ... [${s.length - n} more chars]` : s;

const rule = (label: string) => console.log(`\n${'='.repeat(70)}\n${label}\n${'='.repeat(70)}`);

// ------------------------------------------------- resolve the data source

rule('DATABASE');

const database: any = await notion.databases.retrieve({ database_id: DATABASE_ID });
const dataSources = database.data_sources ?? [];

console.log('title       :', database.title?.map((t: any) => t.plain_text).join('') || '(untitled)');
console.log('data sources:', JSON.stringify(dataSources));

if (dataSources.length === 0) {
  console.error('\nNo data sources on this database. Is the integration shared with it?');
  process.exit(1);
}

const dataSourceId = dataSources[0].id;

// ------------------------------------------------------------- schema shape

rule('PROPERTY SCHEMA');

const dataSource: any = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
for (const [name, prop] of Object.entries<any>(dataSource.properties)) {
  const options =
    prop[prop.type]?.options?.map((o: any) => o.name) ??
    prop[prop.type]?.groups?.flatMap((g: any) => g.option_ids ? [g.name] : []) ??
    null;
  console.log(`  ${name.padEnd(16)} ${prop.type}${options ? `  [${options.join(', ')}]` : ''}`);
}

// ------------------------------------------------------------------ entries

rule('ENTRIES');

const query: any = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 25 });
console.log(`${query.results.length} page(s) in the queue\n`);

for (const page of query.results) {
  const props = Object.entries<any>(page.properties)
    .map(([name, p]) => {
      const v =
        p.type === 'title' || p.type === 'rich_text'
          ? p[p.type].map((t: any) => t.plain_text).join('')
          : p.type === 'select'
            ? p.select?.name
            : p.type === 'status'
              ? p.status?.name
              : p.type === 'multi_select'
                ? p.multi_select.map((o: any) => o.name).join('|')
                : p.type === 'date'
                  ? p.date?.start
                  : p.type === 'url'
                    ? p.url
                    : p.type === 'created_time'
                      ? p.created_time
                      : '(…)';
      return `${name}=${v ?? '∅'}`;
    })
    .join('  ');
  console.log(`  ${page.id}\n    ${props}`);
}

const target = query.results[0];
if (!target) process.exit(0);

// ------------------------------------------------------------- block types

rule('BLOCK TYPES + MEDIA URL SHAPES');

const blocks: any = await notion.blocks.children.list({ block_id: target.id, page_size: 100 });
const counts = new Map<string, number>();

for (const block of blocks.results) {
  counts.set(block.type, (counts.get(block.type) ?? 0) + 1);

  if (['image', 'video', 'file', 'audio', 'pdf'].includes(block.type)) {
    const media = block[block.type];
    console.log(`\n  ${block.type}: source type = "${media.type}"`);
    if (media.type === 'file') {
      console.log(`    expiry_time : ${media.file.expiry_time}`);
      console.log(`    url         : ${media.file.url.split('?')[0]}`);
      console.log(`    query params: ${media.file.url.includes('?') ? 'yes (signed)' : 'no'}`);
    } else {
      console.log(`    url         : ${media.external?.url}`);
    }
    const caption = media.caption?.map((t: any) => t.plain_text).join('');
    console.log(`    caption     : ${caption || '(none)'}`);
  }
}

console.log('\n  counts:', [...counts].map(([t, n]) => `${t}×${n}`).join(', '));
console.log('  has_children blocks:', blocks.results.filter((b: any) => b.has_children).length);
console.log('  page cover:', (target as any).cover ? (target as any).cover.type : '(none)');

// --------------------------------------------- converter A: first-party API

rule('CONVERTER A — notion.pages.retrieveMarkdown (first-party)');

try {
  const md: any = await (notion.pages as any).retrieveMarkdown({ page_id: target.id });
  const text = typeof md === 'string' ? md : (md.markdown ?? JSON.stringify(md, null, 2));
  console.log(truncate(text, 2500));
} catch (error: any) {
  console.log(`FAILED: ${error?.code ?? ''} ${error?.message ?? error}`);
}

// ------------------------------------------- converter B: notion-to-md v3

rule('CONVERTER B — notion-to-md 3.1.9');

try {
  const n2m = new NotionToMarkdown({
    notionClient: notion as any,
    config: { parseChildPages: false },
  });
  const mdBlocks = await n2m.pageToMarkdown(target.id);
  console.log(truncate(n2m.toMarkdownString(mdBlocks).parent ?? '(empty)', 2500));
} catch (error: any) {
  console.log(`FAILED: ${error?.code ?? ''} ${error?.message ?? error}`);
}

console.log('\nProbe complete. Nothing was written or modified.\n');
