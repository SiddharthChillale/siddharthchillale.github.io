import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="container-custom py-20">
      <FadeIn direction="up" distance={10} delay={0.1}>
        <h1 className="text-3xl font-semibold mb-12 tracking-tight">Projects</h1>
      </FadeIn>

      <StaggerContainer 
        staggerChildren={0.05} 
        delayChildren={0.2} 
        className="flex flex-col gap-10"
      >
        {projects.map((project) => (
          <StaggerItem key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                    {project.title}
                  </h2>
                  <time className="text-xs font-medium text-muted-foreground/40 tabular-nums">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-70">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-secondary/30 text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
