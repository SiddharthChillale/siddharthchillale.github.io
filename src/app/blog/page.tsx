import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, type PostMeta } from '@/lib/content';
import { Masthead, label, posterTitle } from '@/components/ui/swiss';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Posts by Siddharth Chillale on software, tools and rendering.',
};

/** Posts are already newest first, so years come out in order too. */
function byYear(posts: PostMeta[]) {
  const groups = new Map<number, PostMeta[]>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups];
}

export default function BlogPage() {
  const posts = getPosts();
  const years = byYear(posts);

  return (
    <div data-wide className="container-custom pb-24 pt-4">
      <Masthead
        meta={
          <div className={cn(label, 'flex justify-between gap-4')}>
            <span>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
            {years.length > 0 && (
              <span className="tabular-nums">
                {years[years.length - 1][0]}&ndash;{years[0][0]}
              </span>
            )}
          </div>
        }
      >
        <h1 className={posterTitle}>Writing</h1>
      </Masthead>

      {/* The year is the section: it sits in the margin, posts to its right. */}
      {years.map(([year, group]) => (
        <section
          key={year}
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-4 border-t-[3px] border-foreground pt-5 md:mt-20 md:grid-cols-12"
        >
          <h2 className="font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums md:col-span-4 md:text-[3.5rem]">
            {year}
          </h2>
          <ol className="md:col-span-8">
            {group.map((post) => (
              <li
                key={post.slug}
                className="border-t border-border first:border-t-0 first:[&>a]:pt-0"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-[1fr_auto] gap-x-6 py-5"
                >
                  <h3 className="font-display text-[1.375rem] font-bold leading-[1.15] tracking-[-0.025em] text-balance underline decoration-transparent decoration-2 underline-offset-[4px] transition-colors group-hover:decoration-foreground">
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.date}
                    className={cn(label, 'pt-1.5 tabular-nums text-muted-foreground')}
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <p className="col-span-2 mt-2 line-clamp-2 max-w-[62ch] text-[14px] leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
