#!/usr/bin/env bun
/**
 * Copies colocated post assets into public/ so the Next.js static export can
 * serve them.
 *
 *   src/content/<collection>/<slug>/images/*  ->  public/<collection>/<slug>/images/*
 *
 * Posts reference their assets relatively (`./images/foo.png`). With
 * `trailingSlash: true` a post renders at `/blog/<slug>/`, so that resolves to
 * `/blog/<slug>/images/foo.png` — which is where this script puts them.
 *
 * The generated directories are gitignored; `src/content/` stays the only
 * source of truth. This step disappears when the site moves to Astro, which
 * handles colocated content assets natively.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const COLLECTIONS = ['blog', 'projects'];

let copied = 0;

for (const collection of COLLECTIONS) {
  const collectionDir = path.join(CONTENT_DIR, collection);
  const generatedDir = path.join(PUBLIC_DIR, collection);

  // Rebuild from scratch so a deleted or renamed asset does not linger.
  fs.rmSync(generatedDir, { recursive: true, force: true });
  if (!fs.existsSync(collectionDir)) continue;

  for (const slug of fs.readdirSync(collectionDir)) {
    const source = path.join(collectionDir, slug, 'images');
    if (!fs.existsSync(source)) continue;

    const target = path.join(generatedDir, slug, 'images');
    fs.cpSync(source, target, { recursive: true });
    copied += fs.readdirSync(source).length;
  }
}

console.log(`synced ${copied} content asset(s) into public/`);
