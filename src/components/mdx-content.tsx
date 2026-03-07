import * as React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MDXContent({ source }: { source: string }) {
  const components: MDXRemoteProps['components'] = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          'mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <blockquote
        className={cn(
          'mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground',
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          className
        )}
        {...props}
      />
    ),
    Callout: ({ children, type = 'default' }: { children: React.ReactNode; type?: 'default' | 'warning' | 'danger' }) => {
      const styles = {
        default: 'bg-secondary/20 border-secondary',
        warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-900 dark:text-yellow-200',
        danger: 'bg-red-500/10 border-red-500/50 text-red-900 dark:text-red-200',
      };
      return (
        <div className={cn('my-6 flex items-start rounded-md border p-4', styles[type])}>
          <div className="flex-1 text-sm leading-relaxed">{children}</div>
        </div>
      );
    },
  };

  const options: MDXRemoteProps['options'] = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode as any,
          {
            theme: 'github-dark',
            onVisitLine(node: any) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
              }
            },
            onVisitHighlightedLine(node: any) {
              node.properties.className.push('line--highlighted');
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ['word--highlighted'];
            },
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            },
          },
        ],
      ],
    },
  };

  return (
    <div className="mdx-content prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20">
      <MDXRemote source={source} components={components} options={options} />
    </div>
  );
}
