import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/line-icon';

/**
 * The Swiss layout's shared parts. Every redesigned page is a 12-column grid
 * whose sections open with a heavy rule, and whose only label style is the
 * small grotesk caps below.
 */

/** Small grotesk caps. The only label style on the site. */
export const label =
  'font-display text-[11px] font-bold uppercase tracking-[0.12em]';

/**
 * The poster scale: the size the name is set at on /about, reused for the
 * index page titles so every masthead reads as one system. "Siddharth" sets
 * at ~4.28em, so width / 4.35 runs it the full measure; the cap is the 992px
 * desktop measure over the same. Any tighter and "Wr" in Writing collides.
 */
export const posterTitle =
  'font-display font-extrabold leading-[0.8] tracking-[-0.045em] text-[calc((100vw-2rem)/4.35)] md:text-[clamp(3.25rem,calc((100vw-3rem)/4.35),14.25rem)]';

/** A page opens with the heaviest rule, a row of labels, then the title. */
export function Masthead({
  meta,
  children,
}: {
  meta: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <header className="border-t-[6px] border-foreground pt-4">
      {meta}
      <div className="mt-10 md:mt-14">{children}</div>
    </header>
  );
}

/**
 * Every section is the same shape: a heavy rule across all twelve columns,
 * the heading in columns 1-4, the content in 5-12. On a phone the heading
 * simply sits on top.
 */
export function Section({
  title,
  icon,
  className,
  children,
}: {
  title: React.ReactNode;
  icon?: IconName;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'mt-20 grid grid-cols-1 gap-x-6 gap-y-6 border-t-[3px] border-foreground pt-5 md:mt-28 md:grid-cols-12',
        className,
      )}
    >
      <h2 className="flex items-start gap-3 font-display text-[2rem] font-extrabold leading-none tracking-[-0.035em] md:col-span-4 md:text-[2.5rem]">
        {icon && (
          <Icon name={icon} className="mt-1 size-6 shrink-0 md:mt-1.5 md:size-7" />
        )}
        {title}
      </h2>
      <div className="min-w-0 md:col-span-8">{children}</div>
    </section>
  );
}

/** A plain text link in label caps, for "All writing" and the like. */
export function LabelLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    label,
    'inline-flex items-center gap-2 underline decoration-1 underline-offset-[5px] hover:decoration-2',
    className,
  );

  // Other sites and static files (the résumé PDF) are not routes, so they
  // get a plain anchor rather than the client-side router.
  if (/^https?:/.test(href) || /\.\w+$/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
