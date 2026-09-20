import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { siteConfig } from '@/lib/config';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export default function Home() {
  const recentPosts = getPosts().slice(0, 5);

  return (
    <div className="container-custom py-20 overflow-hidden">
      <section className="mb-20">
        <FadeIn direction="up" distance={10} delay={0.1}>
          <h1 className="text-3xl font-semibold mb-6 tracking-tight">
            Siddharth Chillale
          </h1>
        </FadeIn>
        <FadeIn direction="up" distance={10} delay={0.2}>
          <p className="text-sm font-medium text-secondary-ink mb-8 max-w-[600px] leading-relaxed">
            {siteConfig.description}
          </p>
        </FadeIn>
        <FadeIn direction="up" distance={10} delay={0.3}>
          <div className="flex flex-wrap gap-4 text-xs font-medium lowercase">
            <a 
              href={siteConfig.github} 
              target="_blank" 
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border"
            >
              github
            </a>
            <a 
              href={siteConfig.linkedin} 
              target="_blank" 
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border"
            >
              linkedin
            </a>
            <Link 
              href="/blog" 
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border"
            >
              writing
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="mt-20">
        <FadeIn direction="up" distance={10} delay={0.4}>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">Recent Writing</h2>
        </FadeIn>

        <StaggerContainer
          staggerChildren={0.05}
          delayChildren={0.5}
          className="flex flex-col gap-6"
        >
          {recentPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between py-1"
              >
                <span className="text-sm font-medium group-hover:text-secondary-ink transition-colors truncate pr-4">
                  {post.title}
                </span>
                <time className="text-xs font-medium text-muted-foreground/60 tabular-nums shrink-0">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
              </Link>
            </StaggerItem>
          ))}
          
          <StaggerItem>
            <Link 
              href="/blog" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-4 inline-block"
            >
              view all →
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
}

