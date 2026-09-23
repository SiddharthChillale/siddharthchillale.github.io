import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';
import { siteConfig } from '@/lib/config';
import { ProjectCard } from '@/components/project-card';
import { Masthead, Section, LabelLink, label } from '@/components/ui/swiss';
import { cn } from '@/lib/utils';

export default function Home() {
  const recentPosts = getPosts().slice(0, 5);
  const recentProjects = getProjects().slice(0, 2);

  return (
    <div data-wide className="container-custom pb-24 pt-4">
      <Masthead
        meta={
          <div className="grid grid-cols-2 gap-x-6 md:grid-cols-12">
            {/* The page's h1, set small: the photo and title below carry it. */}
            <h1 className={cn(label, 'md:col-span-4')}>{siteConfig.author}</h1>
            <p className={cn(label, 'text-right md:col-span-8 md:text-left')}>
              Pune, Maharashtra
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-12">
          <div className="relative aspect-square w-full max-w-[320px] overflow-hidden bg-muted md:col-span-4 md:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile/SiddharthChillale_square.jpg"
              alt="Siddharth Chillale"
              className="absolute inset-0 size-full object-cover object-[50%_20%]"
            />
          </div>

          <div className="flex flex-col md:col-span-8">
            <p className="font-display text-[2.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance md:text-[4rem]">
              Senior Software Engineer
            </p>
            <p className="mt-3 font-display text-[1.375rem] font-bold leading-tight tracking-[-0.02em] md:text-[1.75rem]">
              AI/LLM Systems &amp; Cloud Architecture
            </p>
            <p className="mb-8 mt-6 max-w-[58ch] text-[17px] leading-relaxed text-muted-foreground">
              I specialise in AI-powered and agentic systems &mdash; entity
              resolution, LLM evaluation pipelines and document intelligence
              &mdash; built on secure, scalable cloud infrastructure. I work
              across the whole path from prompt and agent design to IaC-driven
              deployment, and mentor the engineers alongside me.
            </p>
            <nav
              aria-label="Elsewhere"
              className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-foreground pt-3"
            >
              <LabelLink href="/about">About me</LabelLink>
              <LabelLink href="/docs/siddharth-chillale-resume.pdf">Résumé</LabelLink>
              <LabelLink href={siteConfig.github}>GitHub</LabelLink>
              <LabelLink href={siteConfig.linkedin}>LinkedIn</LabelLink>
            </nav>
          </div>
        </div>
      </Masthead>

      <Section title="Writing" icon="pen">
        <ol>
          {recentPosts.map((post) => (
            <li
              key={post.slug}
              className="border-t border-border first:border-t-0 first:[&>a]:pt-0"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-x-6 py-4 sm:grid-cols-[6rem_1fr]"
              >
                <time
                  dateTime={post.date}
                  className={cn(label, 'tabular-nums text-muted-foreground')}
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
                <span className="font-display text-[1.25rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance underline decoration-transparent decoration-2 underline-offset-[4px] transition-colors group-hover:decoration-foreground">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <LabelLink href="/blog" className="mt-8">
          All writing &rarr;
        </LabelLink>
      </Section>

      <Section title="Projects" icon="cube">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
          {recentProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} heading="h3" />
          ))}
        </div>
        <LabelLink href="/projects" className="mt-10">
          All projects &rarr;
        </LabelLink>
      </Section>
    </div>
  );
}
