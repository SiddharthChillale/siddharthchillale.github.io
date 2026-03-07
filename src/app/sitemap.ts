import { MetadataRoute } from 'next';
import { getPosts, getProjects } from '@/lib/content';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return new Date();
  }
  return date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const projects = getProjects();

  const postUrls = posts
    .filter(post => post.date)
    .map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: parseDate(post.date),
    }));

  const projectUrls = projects
    .filter(project => project.date)
    .map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: parseDate(project.date),
    }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/resume`,
      lastModified: new Date(),
    },
    ...postUrls,
    ...projectUrls,
  ];
}
