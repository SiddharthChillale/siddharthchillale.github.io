import Link from 'next/link';
import { getPosts, getProjects, getAllTags } from '@/lib/content';

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Tags</h1>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
