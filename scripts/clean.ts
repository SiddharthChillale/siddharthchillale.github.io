#!/usr/bin/env bun
/**
 * Removes the static export directory before a build.
 *
 * `next build` with `output: 'export'` writes into out/ without clearing it
 * first, so files from a previous build survive — a deleted post or a renamed
 * asset would keep being deployed. Uses fs rather than `rm -rf` so it behaves
 * the same on Windows and on CI.
 */

import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'out');
fs.rmSync(target, { recursive: true, force: true });
console.log('cleaned out/');
