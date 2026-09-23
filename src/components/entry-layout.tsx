import Link from 'next/link';
import type { Post } from '@/lib/content';
import { MDXContent } from '@/components/mdx-content';
import { Masthead, label, LabelLink } from '@/components/ui/swiss';

/** Letters and digits only, so markdown and curly quotes don't matter. */
const fingerprint = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 80);

/**
 * One layout for a blog post and a project page. The title runs the full
 * measure; everything after it sits in columns 5-12, with the metadata in
 * the margin column to its left.
 */
export function EntryLayout({
  entry,
  back,
}: {
  entry: Post;
  back: { href: string; name: string };
}) {
  const words = entry.content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 230));
  // Many posts open with their own summary. Printing both repeats the first
  // paragraph, so in that case the paragraph itself is set as the lede.
  const summaryIsOpening =
    fingerprint(entry.content).startsWith(fingerprint(entry.summary));
  const published = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article data-wide className="container-custom pb-24 pt-4">
      <Masthead
        meta={
          <div className="flex items-center justify-between gap-4">
            <LabelLink href={back.href}>&larr; {back.name}</LabelLink>
            <span className={label}>{minutes} min read</span>
          </div>
        }
      >
        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-balance md:max-w-[11em]">
          {entry.title}
        </h1>
      </Masthead>

      {entry.cover && (
        <figure className="mt-10 md:mt-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.cover.image}
            alt={entry.cover.alt}
            className="h-auto w-full bg-muted"
          />
          {entry.cover.caption && (
            <figcaption className="mt-3 text-[13px] text-muted-foreground md:ml-[calc((100%+1.5rem)/3)]">
              {entry.cover.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-foreground pt-6 md:mt-14 md:grid-cols-12">
        <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-5 md:sticky md:top-8 md:col-span-4 md:grid-cols-1 md:self-start">
          <div>
            <dt className={label}>Published</dt>
            <dd className="mt-1 text-[14px]">
              <time dateTime={entry.date}>{published}</time>
            </dd>
          </div>
          <div>
            <dt className={label}>Reading time</dt>
            <dd className="mt-1 text-[14px]">
              {minutes} {minutes === 1 ? 'minute' : 'minutes'}
            </dd>
          </div>
          {entry.tags.length > 0 && (
            <div className="col-span-2 md:col-span-1">
              <dt className={label}>Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[14px]">
                {entry.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="lowercase underline decoration-border decoration-1 underline-offset-[3px] hover:decoration-foreground"
                  >
                    {tag}
                  </Link>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="min-w-0 md:col-span-8">
          {!summaryIsOpening && (
            <p className="mb-10 font-display text-[1.375rem] font-medium leading-[1.3] tracking-[-0.015em] md:text-[1.625rem]">
              {entry.summary}
            </p>
          )}
          <MDXContent source={entry.content} lead={summaryIsOpening} />
        </div>
      </div>

      <footer className="mt-24 border-t-[3px] border-foreground pt-5">
        <Link
          href={back.href}
          className="font-display text-[1.75rem] font-extrabold tracking-[-0.035em] underline decoration-2 underline-offset-[6px] hover:decoration-[3px] md:text-[2.5rem]"
        >
          &larr; All {back.name.toLowerCase()}
        </Link>
      </footer>
    </article>
  );
}
