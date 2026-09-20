import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { Icon, type IconName } from '@/components/ui/line-icon';
import { Bento, Tile, TileLabel, Tag } from '@/components/ui/tile';
import { FadeScroll } from '@/components/ui/fade-scroll';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Siddharth Chillale - backend systems, cloud, and AI architecture.',
};

type Tone = 'coral' | 'blue' | 'sand' | 'lilac';

const socials: { label: string; handle: string; href: string; icon: IconName }[] =
  [
    {
      label: 'GitHub',
      handle: 'SiddharthChillale',
      href: siteConfig.github,
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: 'schillal',
      href: siteConfig.linkedin,
      icon: 'linkedin',
    },
    {
      label: 'X',
      handle: 'TheLongRaven',
      href: siteConfig.twitter,
      icon: 'x',
    },
    {
      label: 'Email',
      handle: 'say hello',
      href: `mailto:${siteConfig.email}`,
      icon: 'mail',
    },
    {
      label: 'Résumé',
      handle: 'PDF',
      href: '/docs/siddharth-chillale-resume.pdf',
      icon: 'doc',
    },
  ];

const tools: { name: string; tone: Tone }[] = [
  { name: 'Node.js', tone: 'coral' },
  { name: 'Python', tone: 'coral' },
  { name: 'Go', tone: 'coral' },
  { name: 'C / C++', tone: 'coral' },
  { name: 'PostgreSQL', tone: 'blue' },
  { name: 'Docker', tone: 'blue' },
  { name: 'AWS', tone: 'blue' },
  { name: 'Linux', tone: 'sand' },
];

const domains: { name: string; icon: IconName }[] = [
  { name: 'Backend architecture', icon: 'server' },
  { name: 'Distributed systems', icon: 'flow' },
  { name: 'Agent workflows & MCP', icon: 'bot' },
  { name: 'Retrieval & extraction', icon: 'search' },
];

const timeline: {
  org: string;
  period: string;
  open?: boolean;
  rows: { title: string; detail: string }[];
}[] = [
  {
    org: 'IncubXperts',
    period: 'Now',
    open: true,
    rows: [
      {
        title: 'Backend systems & AI architecture',
        detail: 'Pune, Maharashtra',
      },
    ],
  },
  {
    org: 'CodersData LLC',
    period: '2023-24',
    rows: [
      {
        title: 'Data Management Analyst',
        detail: 'Remote - Python, Power BI',
      },
      {
        title: 'Dashboards and ETL automation',
        detail: 'Cut manual reporting by 40%',
      },
    ],
  },
  {
    org: 'University at Buffalo',
    period: '2022-23',
    rows: [
      { title: 'Backend Developer', detail: 'Node.js, Express, MySQL' },
      {
        title: '20+ REST APIs, led a team of four',
        detail: '25+ code reviews, 20+ PR merges',
      },
    ],
  },
  {
    org: 'MS Computer Science',
    period: '2021-23',
    rows: [
      {
        title: 'University at Buffalo, SUNY',
        detail: 'OS, distributed systems, databases',
      },
    ],
  },
  {
    org: 'ShiP.py',
    period: '2020',
    rows: [
      { title: 'Teaching Assistant', detail: 'Learning to Py - Texas A&M' },
    ],
  },
  {
    org: 'B.Tech, Computer Science',
    period: '2017-21',
    rows: [
      {
        title: 'IIIT Tiruchirappalli',
        detail: 'Databases, parallel algorithms, compilers',
      },
    ],
  },
];

const projects: {
  title: string;
  when: string;
  blurb: string;
  icon: IconName;
  stack: { name: string; tone: Tone }[];
}[] = [
  {
    title: 'Agent workflows on MCP',
    when: 'IncubXperts',
    blurb: 'Agents wired to internal tools through MCP servers.',
    icon: 'bot',
    stack: [
      { name: 'MCP', tone: 'lilac' },
      { name: 'Agents', tone: 'lilac' },
    ],
  },
  {
    title: 'RAG & extraction pipelines',
    when: 'IncubXperts',
    blurb:
      'Retrieval and document extraction built for production reliability rather than demo accuracy.',
    icon: 'search',
    stack: [
      { name: 'RAG', tone: 'lilac' },
      { name: 'Python', tone: 'coral' },
    ],
  },
  {
    title: 'Team Assignment Platform',
    when: '2024',
    blurb:
      'JWT auth and role-based access, containerised, CI/CD into ECR and EC2.',
    icon: 'server',
    stack: [
      { name: 'Node', tone: 'coral' },
      { name: 'PostgreSQL', tone: 'blue' },
      { name: 'AWS', tone: 'blue' },
    ],
  },
  {
    title: 'Taco-DB',
    when: '2022',
    blurb:
      'A relational engine - joins, aggregations, B-tree indexing and query optimisation.',
    icon: 'db',
    stack: [
      { name: 'C++', tone: 'coral' },
      { name: 'Linux', tone: 'sand' },
    ],
  },
];

const certifications: { name: string; issued: string; icon: IconName }[] = [
  { name: 'Claude Certified Architect', issued: 'Aug 2026', icon: 'award' },
  { name: 'Certified SAFe® Practitioner', issued: 'Jan 2026', icon: 'award' },
  { name: 'Graph Data Modeling - Neo4j', issued: 'Feb 2025', icon: 'doc' },
  { name: 'AWS Cloud Practitioner', issued: 'Jul 2023', icon: 'award' },
  { name: 'Deep Learning Specialization', issued: '2020', icon: 'doc' },
  { name: 'Machine Learning - Stanford', issued: '2020', icon: 'doc' },
  { name: 'Probability & Statistics', issued: '2020', icon: 'doc' },
];

const reading: { title: string; author: string; done: boolean }[] = [
  {
    title: 'The Software Developer’s Life Manual',
    author: 'John Sonmez',
    done: false,
  },
  { title: 'Architecture of Consoles', author: 'copetti.org', done: true },
];

export default function AboutPage() {
  return (
    <div data-wide className="container-custom py-8">
      <Bento>
        {/* Portrait - the only tonal thing on a page made of line */}
        <Tile span="md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-4" className="items-center gap-0.5">
          <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-sm bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile/SiddharthChillale_square.jpg"
              alt="Siddharth Chillale"
              className="absolute inset-0 size-full object-cover object-[50%_20%]"
            />
          </div>
          <h1 className="mt-2.5 text-center text-2xl font-normal leading-tight">
            Siddharth Chillale
          </h1>
          <p className="text-center text-[12.5px] text-muted-foreground">
            Backend Systems &middot; Cloud &middot; AI Architecture
          </p>
        </Tile>

        {/* Callout - the only tile allowed a fill */}
        <Tile span="md:col-start-3 md:col-end-7 md:row-start-1 md:row-end-2" muted className="flex-row items-center gap-3.5">
          <Icon name="server" className="size-6 shrink-0 text-primary" />
          <p className="text-[15px] leading-relaxed">
            I build scalable, efficient backend systems &mdash; lately the kind
            that carry AI workloads past the demo and into production: RAG
            pipelines, agent workflows, extraction. I also read books, and read
            books about writing programs.
          </p>
        </Tile>

        {/* Education + socials */}
        <Tile span="md:col-start-3 md:col-end-5 md:row-start-2 md:row-end-4" className="gap-px">
          <div className="flex items-start gap-3 px-1.5 pb-3">
            <Icon name="cap" className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground-2)]" />
            <div>
              <div className="text-sm font-semibold leading-snug">
                MS Computer Science
              </div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                University at Buffalo, SUNY &middot; 2023
              </div>
            </div>
          </div>
          <div className="mx-1.5 mb-1.5 h-px bg-border" aria-hidden="true" />
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xs px-2 py-[5px] text-[13.5px] transition-colors hover:bg-[var(--hover)] hover:text-primary"
            >
              <Icon
                name={s.icon}
                className="size-[15px] shrink-0 text-[var(--muted-foreground-2)]"
              />
              {s.label}
              <span className="ml-auto text-[11.5px] text-[var(--muted-foreground-2)]">
                {s.handle}
              </span>
            </a>
          ))}
        </Tile>

        {/* Stack: things you install get tags, things you do get line icons */}
        <Tile span="md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-4">
          <TileLabel icon="chip" className="mb-2">
            Stack
          </TileLabel>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted-foreground-2)]">
            Languages &amp; tools
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((t) => (
              <Tag key={t.name} tone={t.tone}>
                {t.name}
              </Tag>
            ))}
          </div>
          <p className="mb-1.5 mt-3 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted-foreground-2)]">
            Domains
          </p>
          <div className="flex flex-col gap-1.5">
            {domains.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-2.5 text-[12.5px] leading-tight"
              >
                <Icon
                  name={d.icon}
                  className="size-[15px] shrink-0 text-[var(--muted-foreground-2)]"
                />
                {d.name}
              </div>
            ))}
          </div>
        </Tile>

        {/* Timeline - real <details>, so six entries fit in one tile */}
        <Tile span="md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-6">
          <TileLabel icon="clock">Timeline</TileLabel>
          <FadeScroll label="Timeline">
            {timeline.map((era) => (
            <details
              key={era.org}
              open={era.open}
              className="group border-b border-border last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-xs px-1.5 py-2 text-[13.5px] font-medium hover:bg-[var(--hover)] [&::-webkit-details-marker]:hidden">
                <Icon
                  name="chevron"
                  className="size-3 shrink-0 text-[var(--muted-foreground-2)] transition-transform group-open:rotate-90"
                />
                {era.org}
                <span className="ml-auto shrink-0 text-[11.5px] tabular-nums text-[var(--muted-foreground-2)]">
                  {era.period}
                </span>
              </summary>
              <div className="flex flex-col gap-2 py-0.5 pb-3 pl-7 pr-1.5">
                {era.rows.map((r) => (
                  <div key={r.title}>
                    <div className="text-[13px] leading-snug">{r.title}</div>
                    <div className="text-xs leading-snug text-muted-foreground">
                      {r.detail}
                    </div>
                  </div>
                ))}
                </div>
              </details>
            ))}
          </FadeScroll>
        </Tile>

        {/* Selected work */}
        <Tile span="md:col-start-3 md:col-end-7 md:row-start-4 md:row-end-6">
          <TileLabel icon="cube">Selected work</TileLabel>
          <div className="grid min-h-0 flex-1 content-start gap-x-3.5 gap-y-1.5 md:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-2.5 rounded-xs px-1.5 py-[7px] hover:bg-[var(--hover)]"
              >
                <Icon
                  name={p.icon}
                  className="mt-0.5 size-[19px] shrink-0 text-[var(--muted-foreground-2)]"
                />
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[13px] font-semibold leading-tight">
                      {p.title}
                    </span>
                    <span className="text-[11px] tabular-nums text-[var(--muted-foreground-2)]">
                      {p.when}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.stack.map((s) => (
                      <Tag key={s.name} tone={s.tone}>
                        {s.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tile>

        {/* Certifications - scrolls, fades, never says "scroll" */}
        <Tile span="md:col-start-1 md:col-end-3 md:row-start-6 md:row-end-8" className="px-0 pb-0">
          <TileLabel icon="table" className="px-5">
            Certifications
          </TileLabel>
          <FadeScroll label="Certifications">
            <div className="grid grid-cols-[1fr_74px] items-center gap-2.5 border-b border-border px-5 py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-foreground-2)]">
              <span>Name</span>
              <span>Issued</span>
            </div>
            {certifications.map((c) => (
              <div
                key={c.name}
                className="grid grid-cols-[1fr_74px] items-center gap-2.5 border-b border-border px-5 py-[7px] text-[12.5px] last:border-b-0 hover:bg-[var(--hover)]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon
                    name={c.icon}
                    className="size-3.5 shrink-0 text-[var(--muted-foreground-2)]"
                  />
                  <span className="truncate">{c.name}</span>
                </span>
                <span className="text-[11.5px] tabular-nums text-muted-foreground">
                  {c.issued}
                </span>
              </div>
            ))}
          </FadeScroll>
        </Tile>

        {/* Reading */}
        <Tile span="md:col-start-3 md:col-end-5 md:row-start-6 md:row-end-8" className="justify-center">
          <TileLabel icon="books">Reading</TileLabel>
          {reading.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-2.5 rounded-xs px-1.5 py-[7px] hover:bg-[var(--hover)]"
            >
              <Icon
                name={b.done ? 'check' : 'box'}
                className={
                  b.done
                    ? 'mt-0.5 size-[15px] shrink-0 text-primary'
                    : 'mt-0.5 size-[15px] shrink-0 text-[var(--muted-foreground-2)]'
                }
              />
              <div>
                <div
                  className={
                    b.done
                      ? 'text-[13px] leading-snug text-[var(--muted-foreground-2)] line-through'
                      : 'text-[13px] leading-snug'
                  }
                >
                  {b.title}
                </div>
                <div className="mt-px text-[11.5px] text-[var(--muted-foreground-2)]">
                  {b.author}
                </div>
              </div>
            </div>
          ))}
        </Tile>

        {/* Quote */}
        <Tile span="md:col-start-5 md:col-end-7 md:row-start-7 md:row-end-8" className="justify-center">
          <blockquote className="border-l-2 border-primary pl-4">
            <p className="text-lg italic leading-snug">
              Curious, tenacious and persistent &mdash; still going looking for
              experiences I haven&rsquo;t had yet.
            </p>
          </blockquote>
        </Tile>

        {/* Away from the keyboard */}
        <Tile
          span="md:col-start-5 md:col-end-7 md:row-start-6 md:row-end-7"
          muted
          className="flex-row items-center gap-3.5"
        >
          <Icon name="paddle" className="size-10 shrink-0 text-muted-foreground" />
          <p className="text-[13.5px] leading-normal">
            Table tennis and badminton &mdash; and I like to think I&rsquo;m
            good at it.
          </p>
        </Tile>
      </Bento>
    </div>
  );
}
