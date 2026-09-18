/**
 * The Blog Queue contract.
 *
 * Notion property names are data, not code, and they are referenced from more
 * than one script. Keeping them here means renaming a column in Notion is a
 * one-line change rather than a search across the repo.
 */

/** Property names exactly as they appear in the Blog Queue database. */
export const PROPS = {
  title: 'Name',
  status: 'Status',
  collection: 'Collection',
  topics: 'Topics',
  slug: 'Slug',
  publishDate: 'Publish Date',
  pr: 'PR',
} as const;

/**
 * Options of the `Status` property, which is a Notion *status* property rather
 * than a select — the API filter shape differs between the two.
 */
export const STATUS = {
  idea: 'Idea',
  drafted: 'Drafted',
  ready: 'Ready',
  published: 'Published',
} as const;

export type StatusValue = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_VALUES = Object.values(STATUS) as StatusValue[];

/** Used when a queue page leaves `Collection` empty. */
export const DEFAULT_COLLECTION = 'blog';

export const DATABASE_ID =
  process.env.NOTION_DATABASE_ID ?? '3df0586d-b72a-8009-b166-f9420ef8e06e';

/** Shared `--flag value` reader for the Notion scripts. */
export function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;

  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : undefined;
}
