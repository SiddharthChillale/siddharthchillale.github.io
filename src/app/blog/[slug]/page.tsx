import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getPosts } from '@/lib/content';
import { MDXContent } from '@/components/mdx-content';
import { FadeIn } from '@/components/ui/animations';

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container-custom py-20">
      <FadeIn direction="up" distance={10}>
        <header className="mb-12">
          <Link 
            href="/blog" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← back to writing
          </Link>
          
          <h1 className="text-3xl font-semibold mb-4 tracking-tight leading-tight text-balance">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/60 mb-8">
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="lowercase">#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {post.cover && (
            <figure className="mb-10">
              <img 
                src={post.cover.image} 
                alt={post.cover.alt || post.title}
                className="w-full h-auto rounded-lg border"
              />
              {post.cover.caption && (
                <figcaption className="mt-3 text-xs text-muted-foreground/60 text-center">
                  {post.cover.caption}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        <div className="relative prose prose-sm prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
          <MDXContent source={post.content} />
        </div>
        
        <footer className="mt-20 pt-8 border-t border-neutral-100 dark:border-neutral-900">
          <Link 
            href="/blog" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← back to writing
          </Link>
        </footer>
      </FadeIn>
    </article>
  );
}
