#!/usr/bin/env bun
/**
 * Clears the draft flag on one or more content entries.
 *
 *   bun run scripts/publish-entry.ts src/content/blog/<slug>/index.md
 *
 * Deliberately a targeted line edit rather than a parse-and-reserialise of the
 * frontmatter: round-tripping through a YAML writer reflows quoting and key
 * order, which would bury a one-word change in a noisy diff.
 *
 * Idempotent. An entry that is already published is reported and left alone,
 * so re-running over a merged pull request is safe.
 */

import fs from 'node:fs';

const paths = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

if (paths.length === 0) {
  console.error('Usage: bun run scripts/publish-entry.ts <path>...');
  process.exit(1);
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

let changed = 0;
const failures: string[] = [];

for (const filePath of paths) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${filePath}: no such file`);
    continue;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const match = original.match(FRONTMATTER);

  if (!match) {
    failures.push(`${filePath}: no frontmatter block`);
    continue;
  }

  const block = match[1];

  if (/^draft:\s*false\s*$/m.test(block)) {
    console.log(`already published  ${filePath}`);
    continue;
  }

  if (!/^draft:\s*true\s*$/m.test(block)) {
    // No draft key at all means published, since the schema defaults to false.
    console.log(`already published  ${filePath}`);
    continue;
  }

  const updated = block.replace(/^draft:\s*true\s*$/m, 'draft: false');
  fs.writeFileSync(filePath, original.replace(block, updated));

  console.log(`published          ${filePath}`);
  changed += 1;
}

if (failures.length > 0) {
  console.error(`\n${failures.length} failure(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`\n${changed} entr${changed === 1 ? 'y' : 'ies'} published`);
