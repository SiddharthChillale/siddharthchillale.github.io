import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import { ProjectCard } from '@/components/project-card';
import { Masthead, label, posterTitle } from '@/components/ui/swiss';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Graphics, rendering and data projects by Siddharth Chillale.',
};

export default function ProjectsPage() {
  const projects = getProjects();
  const years = projects.map((p) => new Date(p.date).getFullYear());

  return (
    <div data-wide className="container-custom pb-24 pt-4">
      <Masthead
        meta={
          <div className={`${label} flex justify-between gap-4`}>
            <span>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {years.length > 0 && (
              <span className="tabular-nums">
                {Math.min(...years)}&ndash;{Math.max(...years)}
              </span>
            )}
          </div>
        }
      >
        <h1 className={posterTitle}>Projects</h1>
      </Masthead>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} eager={i < 2} />
        ))}
      </div>
    </div>
  );
}
