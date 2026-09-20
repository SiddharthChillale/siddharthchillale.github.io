'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * A scroll area with no scrollbar and a mask that dissolves the last 44px,
 * so a half-faded row signals "more below" without a label. The fade lifts
 * once you actually reach the bottom, so it never lies about there being more.
 *
 * Focusable and arrow-scrollable on purpose - without tabindex the hidden
 * rows would be mouse-only.
 */
export function FadeScroll({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const sync = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    if (atEnd) el.setAttribute('data-end', '');
    else el.removeAttribute('data-end');
  }, []);

  React.useEffect(() => {
    sync();
  }, [sync]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={label}
      onScroll={sync}
      className={cn('fade-scroll min-h-0 flex-1 pb-6', className)}
    >
      {children}
    </div>
  );
}
