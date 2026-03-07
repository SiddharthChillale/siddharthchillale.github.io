import Link from 'next/link';
import { getPostsByTag, getProjectsByTag, getAllTags } from '@/lib/content';

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const projects = getProjectsByTag(decodedTag);

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/tags"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← All Tags
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">
          Tag: <span className="text-primary">{decodedTag}</span>
        </h1>
      </div>

      {posts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Blog Posts</h2>
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4">{post.summary}</p>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">{project.summary}</p>
                <time className="text-sm text-muted-foreground">
                  {new Date(project.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && projects.length === 0 && (
        <p className="text-muted-foreground">No posts or projects found with this tag.</p>
      )}
    </div>
  );
}
