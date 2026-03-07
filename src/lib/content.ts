import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

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

export interface ProjectMeta {
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
}

export interface Project extends ProjectMeta {
  content: string;
}

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

export function getPosts(): PostMeta[] {
  const blogDir = path.join(contentDirectory, 'blog');
  const subdirs = getFiles(blogDir);
  
  const posts: PostMeta[] = [];
  
  for (const subdir of subdirs) {
    const subdirPath = path.join(blogDir, subdir);
    if (!fs.statSync(subdirPath).isDirectory()) continue;
    
    const mdFile = getFiles(subdirPath).find(f => f.endsWith('.md'));
    if (!mdFile) continue;
    
    const slug = subdir;
    const fullPath = path.join(subdirPath, mdFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    posts.push({
      slug,
      title: data.title || '',
      date: data.date || '',
      summary: data.summary || '',
      categories: data.categories || [],
      tags: data.tags || [],
      cover: data.cover,
      draft: data.draft || false,
      showToc: data.ShowToc || false,
    });
  }
  
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const fullPath = path.join(contentDirectory, 'blog', slug, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    summary: data.summary || '',
    categories: data.categories || [],
    tags: data.tags || [],
    cover: data.cover,
    draft: data.draft || false,
    showToc: data.ShowToc || false,
    content,
  };
}

export function getProjects(): ProjectMeta[] {
  const projectsDir = path.join(contentDirectory, 'projects');
  const subdirs = getFiles(projectsDir);
  
  const projects: ProjectMeta[] = [];
  
  for (const subdir of subdirs) {
    const subdirPath = path.join(projectsDir, subdir);
    if (!fs.statSync(subdirPath).isDirectory()) continue;
    
    const mdFile = getFiles(subdirPath).find(f => f.endsWith('.md'));
    if (!mdFile) continue;
    
    const slug = subdir;
    const fullPath = path.join(subdirPath, mdFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    projects.push({
      slug,
      title: data.title || '',
      date: data.date || '',
      summary: data.summary || '',
      categories: data.categories || [],
      tags: data.tags || [],
      cover: data.cover,
      draft: data.draft || false,
    });
  }
  
  return projects
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProject(slug: string): Project | null {
  const fullPath = path.join(contentDirectory, 'projects', slug, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    summary: data.summary || '',
    categories: data.categories || [],
    tags: data.tags || [],
    cover: data.cover,
    draft: data.draft || false,
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getPosts();
  const projects = getProjects();
  
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  projects.forEach(project => {
    project.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

export function getAllCategories(): string[] {
  const posts = getPosts();
  const projects = getProjects();
  
  const categories = new Set<string>();
  
  posts.forEach(post => {
    post.categories.forEach(cat => categories.add(cat));
  });
  
  projects.forEach(project => {
    project.categories.forEach(cat => categories.add(cat));
  });
  
  return Array.from(categories).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getPosts();
  return posts.filter(post => post.tags.includes(tag));
}

export function getProjectsByTag(tag: string): ProjectMeta[] {
  const projects = getProjects();
  return projects.filter(project => project.tags.includes(tag));
}

export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getPosts();
  return posts.filter(post => post.categories.includes(category));
}

export function getProjectsByCategory(category: string): ProjectMeta[] {
  const projects = getProjects();
  return projects.filter(project => project.categories.includes(category));
}
