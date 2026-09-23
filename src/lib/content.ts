import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type Collection, entrySchema } from './content-schema';

const contentDirectory = path.join(process.cwd(), 'src/content');

/**
 * Drafts are hidden in production but built in preview deployments, so a draft
 * pull request has a real rendered page to review. CI sets this for
 * `pull_request` builds only — it must never be set on the production branch.
 */
const INCLUDE_DRAFTS = process.env.INCLUDE_DRAFTS === '1';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  categories: string[];
  tags: string[];
  cover?: {
    image: string;
    alt: string;
    caption?: string;
  };
  draft?: boolean;
  showToc?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export type ProjectMeta = PostMeta;
export type Project = Post;

/**
 * The markdown file is located by extension rather than by name, so a post
 * directory can hold either `<slug>.md` or `index.md`.
 */
function findMarkdownFile(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const file = fs.readdirSync(dir).find((f) => f.endsWith('.md'));
  return file ? path.join(dir, file) : null;
}

/**
 * Parses one entry against the shared schema. Invalid frontmatter throws rather
 * than falling back to empty strings — a blank title should fail the build, not
 * ship silently.
 */
function readEntry(collection: Collection, slug: string): Post | null {
  const file = findMarkdownFile(path.join(contentDirectory, collection, slug));
  if (!file) return null;

  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const parsed = entrySchema.safeParse(data);

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(
      `Invalid frontmatter in ${collection}/${slug} — ${detail}. ` +
        'Run `bun run validate:content` for the full report.',
    );
  }

  const entry = parsed.data;

  return {
    slug,
    title: entry.title,
    date: entry.date.toISOString(),
    summary: entry.summary,
    categories: entry.categories,
    tags: entry.tags,
    cover: resolveCover(collection, slug, entry.cover),
    draft: entry.draft,
    showToc: entry.showToc,
    content,
  };
}

/**
 * Covers are written relative to the post (`./images/foo.png`), which only
 * resolves on the post's own page. Listings render them too, so rewrite them
 * to the path `sync:assets` publishes them under.
 */
function resolveCover(
  collection: Collection,
  slug: string,
  cover: PostMeta['cover'],
): PostMeta['cover'] {
  if (!cover || !cover.image.startsWith('./')) return cover;
  return { ...cover, image: `/${collection}/${slug}/${cover.image.slice(2)}` };
}

function toMeta({ content: _content, ...meta }: Post): PostMeta {
  return meta;
}

/** Published entries in a collection, newest first. */
function readCollection(collection: Collection): PostMeta[] {
  const dir = path.join(contentDirectory, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((slug) => fs.statSync(path.join(dir, slug)).isDirectory())
    .map((slug) => readEntry(collection, slug))
    .filter((entry): entry is Post => entry !== null && (INCLUDE_DRAFTS || !entry.draft))
    .map(toMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPosts(): PostMeta[] {
  return readCollection('blog');
}

export function getPost(slug: string): Post | null {
  return readEntry('blog', slug);
}

export function getProjects(): ProjectMeta[] {
  return readCollection('projects');
}

export function getProject(slug: string): Project | null {
  return readEntry('projects', slug);
}

function collectField(field: 'tags' | 'categories'): string[] {
  const values = new Set<string>();
  for (const entry of [...getPosts(), ...getProjects()]) {
    for (const value of entry[field]) values.add(value);
  }
  return [...values].sort();
}

export function getAllTags(): string[] {
  return collectField('tags');
}

export function getAllCategories(): string[] {
  return collectField('categories');
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getPosts().filter((post) => post.tags.includes(tag));
}

export function getProjectsByTag(tag: string): ProjectMeta[] {
  return getProjects().filter((project) => project.tags.includes(tag));
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getPosts().filter((post) => post.categories.includes(category));
}

export function getProjectsByCategory(category: string): ProjectMeta[] {
  return getProjects().filter((project) => project.categories.includes(category));
}
