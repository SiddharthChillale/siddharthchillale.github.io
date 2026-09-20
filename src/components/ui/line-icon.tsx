import { cn } from '@/lib/utils';

/**
 * One sprite, one stroke weight. Every drawing on the site is a <use> into
 * the symbols below, so a tile references an icon by id rather than shipping
 * its own copy of the paths.
 *
 * Mount <LineSprite /> once, in the root layout.
 */

export const iconNames = [
  'server', 'cloud', 'chip', 'cube', 'books', 'paddle', 'route', 'award',
  'mail', 'pen', 'cap', 'doc', 'grid', 'table', 'list', 'chevron', 'box',
  'check', 'bulb', 'github', 'linkedin', 'x', 'clock', 'scene', 'bot',
  'search', 'flow', 'db',
] as const;

export type IconName = (typeof iconNames)[number];

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg className={cn('ln', className)} viewBox="0 0 48 48" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function LineSprite() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id="i-server" viewBox="0 0 48 48">
          <rect x="8" y="9" width="32" height="10" rx="3" pathLength="1" />
          <rect x="8" y="19" width="32" height="10" rx="3" pathLength="1" />
          <rect x="8" y="29" width="32" height="10" rx="3" pathLength="1" />
          <path d="M14 14h.01M14 24h.01M14 34h.01" pathLength="1" />
          <path d="M22 14h12M22 24h12M22 34h12" pathLength="1" />
        </symbol>

        <symbol id="i-cloud" viewBox="0 0 48 48">
          <path
            d="M16.5 36h17a8 8 0 0 0 1-15.9A11 11 0 0 0 13 18.6 7.2 7.2 0 0 0 16.5 36Z"
            pathLength="1"
          />
        </symbol>

        <symbol id="i-chip" viewBox="0 0 48 48">
          <rect x="15" y="15" width="18" height="18" rx="3" pathLength="1" />
          <rect x="21" y="21" width="6" height="6" rx="1" pathLength="1" />
          <path
            d="M20 15V9M28 15V9M20 39v-6M28 39v-6M15 20H9M15 28H9M39 20h-6M39 28h-6"
            pathLength="1"
          />
        </symbol>

        <symbol id="i-cube" viewBox="0 0 48 48">
          <path d="M24 7 41 16v17l-17 9-17-9V16Z" pathLength="1" />
          <path d="M7 16l17 9 17-9M24 25v17" pathLength="1" />
        </symbol>

        <symbol id="i-books" viewBox="0 0 48 48">
          <rect x="10" y="14" width="8" height="26" rx="1.5" pathLength="1" />
          <rect x="20" y="10" width="8" height="30" rx="1.5" pathLength="1" />
          <path d="M30.5 18.5l7.5 2-5.5 20-7.5-2Z" pathLength="1" />
          <path d="M12 20h4M22 17h4" pathLength="1" />
        </symbol>

        <symbol id="i-paddle" viewBox="0 0 48 48">
          <circle cx="20" cy="19" r="11" pathLength="1" />
          <path d="M27 28l9 11" pathLength="1" />
          <circle cx="36" cy="14" r="4" pathLength="1" />
        </symbol>

        <symbol id="i-route" viewBox="0 0 48 48">
          <circle cx="12" cy="13" r="4" pathLength="1" />
          <circle cx="36" cy="35" r="4" pathLength="1" />
          <path
            d="M12 17v6a7 7 0 0 0 7 7h10a7 7 0 0 1 7 7v-2"
            pathLength="1"
            strokeDasharray="3 4"
          />
        </symbol>

        <symbol id="i-award" viewBox="0 0 48 48">
          <circle cx="24" cy="19" r="10" pathLength="1" />
          <path d="M18 27l-3 14 9-5 9 5-3-14" pathLength="1" />
          <path
            d="M24 14l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z"
            pathLength="1"
          />
        </symbol>

        <symbol id="i-mail" viewBox="0 0 48 48">
          <rect x="7" y="12" width="34" height="24" rx="3" pathLength="1" />
          <path d="M7.5 15l16.5 12 16.5-12" pathLength="1" />
        </symbol>

        <symbol id="i-pen" viewBox="0 0 48 48">
          <path d="M31 8l9 9-21 21-11 2 2-11Z" pathLength="1" />
          <path d="M27 12l9 9M9 39l4-4" pathLength="1" />
        </symbol>

        <symbol id="i-cap" viewBox="0 0 48 48">
          <path d="M4 18 24 9l20 9-20 9Z" pathLength="1" />
          <path d="M12 22v10c0 3 5.4 6 12 6s12-3 12-6V22" pathLength="1" />
          <path d="M41 20v9" pathLength="1" />
        </symbol>

        <symbol id="i-doc" viewBox="0 0 48 48">
          <path d="M12 6h16l10 10v26H12Z" pathLength="1" />
          <path d="M28 6v10h10" pathLength="1" />
          <path d="M18 26h12M18 32h12M18 20h6" pathLength="1" />
        </symbol>

        <symbol id="i-grid" viewBox="0 0 48 48">
          <rect x="7" y="7" width="15" height="15" rx="2.5" pathLength="1" />
          <rect x="26" y="7" width="15" height="15" rx="2.5" pathLength="1" />
          <rect x="7" y="26" width="15" height="15" rx="2.5" pathLength="1" />
          <rect x="26" y="26" width="15" height="15" rx="2.5" pathLength="1" />
        </symbol>

        <symbol id="i-table" viewBox="0 0 48 48">
          <rect x="6" y="9" width="36" height="30" rx="3" pathLength="1" />
          <path d="M6 19h36M18 19v20M30 19v20" pathLength="1" />
        </symbol>

        <symbol id="i-list" viewBox="0 0 48 48">
          <path d="M9 14h30M9 24h30M9 34h20" pathLength="1" />
        </symbol>

        <symbol id="i-chevron" viewBox="0 0 48 48">
          <path d="M17 9l14 15-14 15" pathLength="1" />
        </symbol>

        <symbol id="i-box" viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="32" rx="6" pathLength="1" />
        </symbol>

        <symbol id="i-check" viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="32" rx="6" pathLength="1" />
          <path d="M16 24.5l6 6 12-13" pathLength="1" />
        </symbol>

        <symbol id="i-bulb" viewBox="0 0 48 48">
          <path
            d="M24 6a13 13 0 0 0-7 24v5h14v-5A13 13 0 0 0 24 6Z"
            pathLength="1"
          />
          <path d="M19 40h10M21 44h6" pathLength="1" />
        </symbol>

        <symbol id="i-github" viewBox="0 0 48 48">
          <path
            d="M24 6a18 18 0 0 0-5.7 35.1c.9.2 1.2-.4 1.2-.9v-3.2c-5 1.1-6.1-2.4-6.1-2.4-.8-2.1-2-2.7-2-2.7-1.7-1.1.1-1.1.1-1.1 1.8.1 2.8 1.9 2.8 1.9 1.6 2.8 4.3 2 5.3 1.5.2-1.2.6-2 1.2-2.5-4-.4-8.2-2-8.2-8.9a7 7 0 0 1 1.9-4.8c-.2-.5-.8-2.4.2-5 0 0 1.5-.5 5 1.8a17.3 17.3 0 0 1 9.1 0c3.4-2.3 5-1.8 5-1.8 1 2.6.4 4.5.2 5a7 7 0 0 1 1.8 4.8c0 6.9-4.2 8.5-8.2 8.9.7.6 1.3 1.7 1.3 3.4v5c0 .5.3 1.1 1.2.9A18 18 0 0 0 24 6Z"
            pathLength="1"
          />
        </symbol>

        <symbol id="i-linkedin" viewBox="0 0 48 48">
          <rect x="7" y="7" width="34" height="34" rx="5" pathLength="1" />
          <path
            d="M15.5 21v11M15.5 15.5v.01M23 32V21M23 26a4.5 4.5 0 0 1 9 0v6"
            pathLength="1"
          />
        </symbol>

        <symbol id="i-x" viewBox="0 0 48 48">
          <path d="M10 9l28 30M38 9L10 39" pathLength="1" />
        </symbol>

        <symbol id="i-clock" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="17" pathLength="1" />
          <path d="M24 13v11l7 5" pathLength="1" />
        </symbol>

        <symbol id="i-scene" viewBox="0 0 48 48">
          <path d="M4 36h40" pathLength="1" />
          <path d="M10 36l9-14 6 9 5-7 8 12" pathLength="1" />
          <circle cx="34" cy="13" r="5" pathLength="1" />
        </symbol>

        <symbol id="i-bot" viewBox="0 0 48 48">
          <rect x="9" y="16" width="30" height="22" rx="6" pathLength="1" />
          <path d="M24 16V8M18 26v.01M30 26v.01M18 32h12" pathLength="1" />
          <path d="M9 24H5M43 24h-4" pathLength="1" />
        </symbol>

        <symbol id="i-search" viewBox="0 0 48 48">
          <circle cx="21" cy="21" r="13" pathLength="1" />
          <path d="M31 31l10 10" pathLength="1" />
        </symbol>

        <symbol id="i-flow" viewBox="0 0 48 48">
          <rect x="6" y="8" width="14" height="10" rx="2.5" pathLength="1" />
          <rect x="28" y="8" width="14" height="10" rx="2.5" pathLength="1" />
          <rect x="17" y="30" width="14" height="10" rx="2.5" pathLength="1" />
          <path d="M13 18v6h22v-6M24 24v6" pathLength="1" />
        </symbol>

        <symbol id="i-db" viewBox="0 0 48 48">
          <ellipse cx="24" cy="12" rx="15" ry="5.5" pathLength="1" />
          <path
            d="M9 12v24c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5V12"
            pathLength="1"
          />
          <path d="M9 24c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5" pathLength="1" />
        </symbol>
      </defs>
    </svg>
  );
}
