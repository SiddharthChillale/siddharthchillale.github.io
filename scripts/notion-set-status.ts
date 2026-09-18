#!/usr/bin/env bun
/**
 * Writes the outcome of an ingest back to its Blog Queue page.
 *
 *   bun run scripts/notion-set-status.ts --page <id> --status Drafted --pr <url>
 *
 * This is the only write Notion ever receives. Git is authoritative for
 * content; the queue page keeps a pointer (where did this end up, and what
 * state is it in) and nothing else. Deliberately separate from the ingest
 * script, which cannot do this itself because the pull request does not exist
 * until after the ingest has finished.
 */

import { Client } from '@notionhq/client';
import { PROPS, STATUS_VALUES, argValue, type StatusValue } from './notion-schema';

const TOKEN = process.env.NOTION_TOKEN;
const pageId = argValue('--page');
const status = argValue('--status');
const pr = argValue('--pr');

if (!TOKEN) {
  console.error('NOTION_TOKEN is not set.');
  process.exit(1);
}

if (!pageId) {
  console.error('--page <notion page id> is required.');
  process.exit(1);
}

if (status && !STATUS_VALUES.includes(status as StatusValue)) {
  console.error(
    `--status must be one of: ${STATUS_VALUES.join(', ')} (received "${status}")`,
  );
  process.exit(1);
}

if (!status && !pr) {
  console.error('Nothing to do: pass --status, --pr, or both.');
  process.exit(1);
}

const properties: Record<string, unknown> = {};
if (status) properties[PROPS.status] = { status: { name: status } };
if (pr) properties[PROPS.pr] = { url: pr };

const notion = new Client({ auth: TOKEN });

try {
  await notion.pages.update({ page_id: pageId, properties: properties as any });
} catch (error: any) {
  console.error(`Failed to update ${pageId}: ${error?.message ?? error}`);
  process.exit(1);
}

console.log(
  `updated ${pageId}` +
    `${status ? ` — ${PROPS.status} = ${status}` : ''}` +
    `${pr ? ` — ${PROPS.pr} = ${pr}` : ''}`,
);
