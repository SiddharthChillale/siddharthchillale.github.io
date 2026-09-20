import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/line-icon';

/**
 * Bento primitives. Tiles are pure layout: a span goes in, nothing else.
 * The grid is six columns of 140px rows; tiles snap to it and never rotate,
 * which is what lets the whole board collapse to two columns on a phone.
 */

export function Bento({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 md:grid-cols-6 md:auto-rows-[140px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tile({
  span,
  muted,
  className,
  children,
}: {
  /**
   * Desktop placement as longhand utilities, e.g.
   * "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-4".
   * Longhand on purpose: the `col-[1/3]` shorthand reads the slash as an
   * opacity modifier, and a shorthand would also clobber the mobile default
   * below rather than layering on top of it.
   */
  span?: string;
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        'relative flex min-h-[140px] flex-col overflow-hidden rounded-lg border px-5 py-4',
        'transition-shadow hover:shadow-[0_1px_2px_rgb(26_26_46/0.04),0_6px_18px_-10px_rgb(26_26_46/0.2)]',
        // full width on the 2-column mobile grid; `span` overrides at md
        'col-start-1 col-end-3',
        muted ? 'bg-muted' : 'bg-card',
        span,
        className,
      )}
    >
      {children}
    </article>
  );
}

export function TileLabel({
  icon,
  children,
  className,
}: {
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'mb-3 flex shrink-0 items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.07em]',
        'text-[var(--muted-foreground-2)]',
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-3.5 shrink-0" />}
      {children}
    </p>
  );
}

export function Tag({
  tone = 'sand',
  children,
}: {
  tone?: 'coral' | 'sand' | 'lilac';
  children: React.ReactNode;
}) {
  return <span className={cn('tag', `tag-${tone}`)}>{children}</span>;
}
