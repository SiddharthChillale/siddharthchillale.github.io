#!/usr/bin/env bun
/**
 * Validates every content entry against the shared schema and checks that every
 * asset referenced from a post actually exists on disk.
 *
 * Run: bun run validate:content
 *
 * Exits non-zero on any error, so this doubles as the CI gate on agent output.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  COLLECTIONS,
  KNOWN_KEYS,
  SLUG_PATTERN,
  entrySchema,
} from '../src/lib/content-schema';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/content');
const PUBLIC_DIR = path.join(ROOT, 'public');

type Level = 'error' | 'warn';
interface Issue {
  level: Level;
  file: string;
  message: string;
}

const issues: Issue[] = [];
const add = (level: Level, file: string, message: string) =>
  issues.push({ level, file, message });

/** Pull every asset path referenced from markdown body or frontmatter cover. */
function collectAssetRefs(body: string, cover?: { image?: string }): string[] {
  const refs = new Set<string>();

  for (const m of body.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)) refs.add(m[1]);
  for (const m of body.matchAll(/<img[^>]+src=["']([^"']+)["']/g)) refs.add(m[1]);
  for (const m of body.matchAll(/<(?:video|source)[^>]+src=["']([^"']+)["']/g)) {
    refs.add(m[1]);
  }
  if (cover?.image) refs.add(cover.image);

  return [...refs];
}

/**
 * Absolute refs (`/images/...`) resolve against public/; relative refs resolve
 * against the post directory. Handling both now means this keeps working after
 * assets are colocated with their posts.
 */
function resolveAssetRef(ref: string, postDir: string): string | null {
  if (/^(?:https?:)?\/\//.test(ref) || ref.startsWith('data:')) return null;
  const clean = decodeURI(ref.split('#')[0].split('?')[0]);
  if (!clean) return null;
  return clean.startsWith('/')
    ? path.join(PUBLIC_DIR, clean)
    : path.join(postDir, clean);
}

function validateEntry(collection: string, slug: string, postDir: string) {
  const files = fs.readdirSync(postDir).filter((f) => f.endsWith('.md'));
  const rel = path.posix.join('src/content', collection, slug);

  if (files.length === 0) {
    add('error', rel, 'no markdown file found in this directory');
    return;
  }
  if (files.length > 1) {
    add('error', rel, `expected one markdown file, found ${files.length}`);
    return;
  }

  const mdPath = path.join(postDir, files[0]);
  const fileLabel = path.posix.join(rel, files[0]);

  if (!SLUG_PATTERN.test(slug)) {
    add('error', fileLabel, `slug "${slug}" must be lowercase alphanumeric with - or _`);
  }

  const raw = fs.readFileSync(mdPath, 'utf8');
  const { data, content } = matter(raw);

  // Stray keys are how Hugo-era `Title:` / `ShowToc:` silently become empty
  // strings in the loader, so surface them with a concrete hint.
  for (const key of Object.keys(data)) {
    if (KNOWN_KEYS.includes(key)) continue;
    const match = KNOWN_KEYS.find((k) => k.toLowerCase() === key.toLowerCase());
    add(
      match ? 'error' : 'warn',
      fileLabel,
      match
        ? `frontmatter key "${key}" should be "${match}" (wrong case is silently ignored by the loader)`
        : `unknown frontmatter key "${key}"`,
    );
  }

  const parsed = entrySchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const where = issue.path.length ? issue.path.join('.') : '(root)';
      add('error', fileLabel, `${where}: ${issue.message}`);
    }
  }

  const cover = typeof data.cover === 'object' && data.cover ? data.cover : undefined;
  for (const ref of collectAssetRefs(content, cover)) {
    const resolved = resolveAssetRef(ref, postDir);
    if (!resolved) continue;
    if (!fs.existsSync(resolved)) {
      add('error', fileLabel, `asset not found: ${ref}`);
    } else if (/[\[\]()\s]/.test(path.basename(ref))) {
      add('warn', fileLabel, `asset filename is not URL-safe: ${path.basename(ref)}`);
    }
  }
}

function main() {
  const seen = new Map<string, string>();

  for (const collection of COLLECTIONS) {
    const dir = path.join(CONTENT_DIR, collection);
    if (!fs.existsSync(dir)) {
      add('warn', `src/content/${collection}`, 'collection directory does not exist');
      continue;
    }

    for (const slug of fs.readdirSync(dir)) {
      const postDir = path.join(dir, slug);
      if (!fs.statSync(postDir).isDirectory()) continue;

      const prior = seen.get(slug);
      if (prior) {
        add('error', `src/content/${collection}/${slug}`, `duplicate slug, also in ${prior}`);
      }
      seen.set(slug, collection);

      validateEntry(collection, slug, postDir);
    }
  }

  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warn');

  const byFile = new Map<string, Issue[]>();
  for (const issue of issues) {
    if (!byFile.has(issue.file)) byFile.set(issue.file, []);
    byFile.get(issue.file)!.push(issue);
  }

  for (const [file, list] of [...byFile].sort()) {
    console.log(`\n${file}`);
    for (const i of list) {
      console.log(`  ${i.level === 'error' ? 'ERROR' : ' warn'}  ${i.message}`);
    }
  }

  console.log(
    `\n${seen.size} entries checked — ${errors.length} error(s), ${warnings.length} warning(s)\n`,
  );

  if (errors.length > 0) process.exit(1);
}

main();
