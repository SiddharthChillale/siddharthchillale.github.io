import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="container-custom py-20">
      <FadeIn direction="up" distance={10} delay={0.1}>
        <h1 className="text-3xl font-semibold mb-12 tracking-tight">Writing</h1>
      </FadeIn>

      <StaggerContainer 
        staggerChildren={0.05} 
        delayChildren={0.2} 
        className="flex flex-col gap-10"
      >
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold group-hover:text-secondary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <time className="text-xs font-medium text-muted-foreground/40 tabular-nums">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-70">
                  {post.summary}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
