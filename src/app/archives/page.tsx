import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';

export default function ArchivesPage() {
  const posts = getPosts();
  const projects = getProjects();
  const allContent = [...posts, ...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedByYear = allContent.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {} as Record<string, typeof allContent>);

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Archives</h1>

      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{year}</h2>
          <div className="space-y-4">
            {groupedByYear[year].map((item) => {
              const isProject = 'slug' in item && item.slug.includes('/');
              const href = isProject 
                ? `/projects/${item.slug}` 
                : `/blog/${item.slug}`;
              
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className="group flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <time className="text-sm text-muted-foreground whitespace-nowrap w-24">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
