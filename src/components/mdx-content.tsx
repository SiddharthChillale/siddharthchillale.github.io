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

export function MDXContent({
  source,
  lead = false,
}: {
  source: string;
  /** Set the opening paragraph as the lede, for posts whose summary is it. */
  lead?: boolean;
}) {
  // Swiss body type: Inter for text, Inter Tight for headings, and a heavy
  // rule over every H2 so a long post reads as the same sections as /about.
  const components: MDXRemoteProps['components'] = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          'mt-16 scroll-m-20 font-display text-4xl font-extrabold tracking-[-0.04em]',
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          'mt-16 scroll-m-20 border-t-[3px] border-foreground pt-4 font-display text-[1.75rem] font-extrabold leading-[1.05] tracking-[-0.035em] first:mt-0 md:text-[2rem]',
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          'mt-10 scroll-m-20 font-display text-[1.25rem] font-bold leading-tight tracking-[-0.02em]',
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn(
          'mt-8 scroll-m-20 font-display text-[11px] font-bold uppercase tracking-[0.12em]',
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className={cn('text-[17px] leading-[1.7] [&:not(:first-child)]:mt-5', className)}
        {...props}
      />
    ),
    a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn(
          'underline decoration-1 underline-offset-[3px] hover:decoration-2',
          className
        )}
        {...props}
      />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn('font-semibold', className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={cn('my-5 ml-5 list-disc text-[17px] leading-[1.7] marker:text-foreground', className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn('my-5 ml-5 list-decimal text-[17px] leading-[1.7] marker:font-display marker:font-bold', className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn('mt-1.5 pl-1', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <blockquote
        className={cn(
          'my-8 border-l-[3px] border-foreground pl-5 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.015em] [&_p]:text-[inherit] [&_p]:leading-[inherit]',
          className
        )}
        {...props}
      />
    ),
    hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className={cn('my-12 border-t border-foreground', className)} {...props} />
    ),
    img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={cn('my-10 h-auto w-full bg-muted', className)}
        alt={alt ?? ''}
        loading="lazy"
        {...props}
      />
    ),
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-8 overflow-x-auto">
        <table className={cn('w-full border-collapse text-left text-[15px]', className)} {...props} />
      </div>
    ),
    th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          'border-b border-foreground pb-2 pr-4 font-display text-[11px] font-bold uppercase tracking-[0.12em]',
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td className={cn('border-b border-border py-2.5 pr-4 align-top', className)} {...props} />
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          // Inline code only: inside a highlighted block the <pre> owns the look.
          'relative bg-muted px-[0.3rem] py-[0.15rem] font-mono text-[0.875em] [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[inherit]',
          className
        )}
        {...props}
      />
    ),
    Callout: ({ children, type = 'default' }: { children: React.ReactNode; type?: 'default' | 'warning' | 'danger' }) => {
      const marks = { default: 'Note', warning: 'Warning', danger: 'Danger' };
      return (
        <aside className="my-8 border-t-[3px] border-foreground bg-muted px-5 py-4">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em]">
            {marks[type]}
          </p>
          <div className="mt-2 text-[15px] leading-relaxed">{children}</div>
        </aside>
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
    <div
      className={cn(
        // Long URLs would otherwise push a phone-width page sideways.
        'mdx-content break-words',
        lead &&
          '[&>p:first-child]:font-display [&>p:first-child]:text-[1.375rem] [&>p:first-child]:font-medium [&>p:first-child]:leading-[1.3] [&>p:first-child]:tracking-[-0.015em] md:[&>p:first-child]:text-[1.625rem]',
      )}
    >
      <MDXRemote source={source} components={components} options={options} />
    </div>
  );
}
