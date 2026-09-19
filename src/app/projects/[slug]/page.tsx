import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, getProjects } from '@/lib/content';
import { MDXContent } from '@/components/mdx-content';
import { FadeIn } from '@/components/ui/animations';

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="container-custom py-20">
      <FadeIn direction="up" distance={10}>
        <header className="mb-12">
          <Link 
            href="/projects" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← back to projects
          </Link>
          
          <h1 className="text-3xl font-semibold mb-4 tracking-tight leading-tight text-balance">
            {project.title}
          </h1>
          
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/60 mb-8">
            <time>
              {new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </time>
            {project.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="lowercase">#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {project.cover && (
            <figure className="mb-10">
              <img 
                src={project.cover.image} 
                alt={project.cover.alt || project.title}
                className="w-full h-auto rounded-lg border"
              />
              {project.cover.caption && (
                <figcaption className="mt-3 text-xs text-muted-foreground/60 text-center">
                  {project.cover.caption}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        <div className="relative prose prose-sm prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
          <MDXContent source={project.content} />
        </div>
        
        <footer className="mt-20 pt-8 border-t border-neutral-100 dark:border-neutral-900">
          <Link 
            href="/projects" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← back to projects
          </Link>
        </footer>
      </FadeIn>
    </article>
  );
}
