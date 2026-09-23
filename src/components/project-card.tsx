import Link from 'next/link';
import type { ProjectMeta } from '@/lib/content';
import { Icon } from '@/components/ui/line-icon';
import { label } from '@/components/ui/swiss';
import { cn } from '@/lib/utils';

/**
 * A project in a listing: the cover first, since the work is visual, then
 * the year and tags on one label line and the title below. Projects without
 * a cover get a flat panel with the line icon, so the grid keeps its rhythm.
 */
export function ProjectCard({
  project,
  heading: Heading = 'h2',
  eager = false,
}: {
  project: ProjectMeta;
  heading?: 'h2' | 'h3';
  /** Load the image straight away, for cards in the first screenful. */
  eager?: boolean;
}) {
  const year = new Date(project.date).getFullYear();

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover.image}
            alt={project.cover.alt}
            loading={eager ? 'eager' : 'lazy'}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Icon name="cube" className="size-12" />
          </div>
        )}
      </div>

      <div
        className={cn(
          label,
          'mt-4 flex items-center justify-between gap-4 border-t border-foreground pt-2',
        )}
      >
        <span className="tabular-nums">{year}</span>
        {project.tags.length > 0 && (
          <span className="truncate text-right font-semibold tracking-[0.08em]">
            {project.tags.slice(0, 3).join(' / ')}
          </span>
        )}
      </div>

      <Heading className="mt-4 font-display text-[1.75rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-balance underline decoration-transparent decoration-2 underline-offset-[5px] transition-colors group-hover:decoration-foreground">
        {project.title}
      </Heading>
      <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
        {project.summary}
      </p>
    </Link>
  );
}
