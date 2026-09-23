import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { Icon, type IconName } from '@/components/ui/line-icon';
import { Section, label, posterTitle } from '@/components/ui/swiss';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Siddharth Chillale - AI engineering, full-stack development, and cloud infrastructure.',
};

const disciplines: { name: string; icon: IconName }[] = [
  { name: 'AI Engineering', icon: 'bot' },
  { name: 'Full-Stack', icon: 'server' },
  { name: 'Cloud Infrastructure', icon: 'cloud' },
];

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
      handle: 'Say hello',
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

const tools = [
  'Python',
  'TypeScript',
  'C#',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Azure',
];

const domains: { name: string; icon: IconName }[] = [
  { name: 'AI engineering & agents', icon: 'bot' },
  { name: 'Full-stack development', icon: 'server' },
  { name: 'Cloud infrastructure', icon: 'cloud' },
  { name: 'Agentic RAG & retrieval', icon: 'search' },
];

const timeline: {
  org: string;
  period: string;
  rows: { title: string; detail: string }[];
}[] = [
  {
    org: 'IncubXperts',
    period: 'Now',
    rows: [
      {
        title: 'Senior Software Engineer, AI & Full-Stack',
        detail: 'Pune, Maharashtra',
      },
      {
        title: 'Gamma · Notisphere · CRIA',
        detail: 'Proposal automation, medical recalls, impact analysis',
      },
    ],
  },
  {
    org: 'CodersData LLC',
    period: '2023–24',
    rows: [
      {
        title: 'Data Management Analyst',
        detail: 'Remote — Python, Power BI',
      },
      {
        title: 'Dashboards and ETL automation',
        detail: 'Cut manual reporting by 40%',
      },
    ],
  },
  {
    org: 'University at Buffalo',
    period: '2022–23',
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
    period: '2021–23',
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
      { title: 'Teaching Assistant', detail: 'Learning to Py — Texas A&M' },
    ],
  },
  {
    org: 'B.Tech, Computer Science',
    period: '2017–21',
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
  stack: string[];
}[] = [
  {
    title: 'Gamma',
    when: '2026',
    blurb:
      'AI proposal engine that ranks prospects and drafts personalised outreach, cutting manual release effort by ~80%.',
    icon: 'bot',
    stack: ['Next.js', 'Openrouter', 'AWS'],
  },
  {
    title: 'Notisphere',
    when: '2025–26',
    blurb:
      'Medical recall platform moving supplier-to-provider notices off paper, with AI document parsing and entity resolution.',
    icon: 'server',
    stack: ['Vue', 'ASP.NET Core', 'AWS Bedrock'],
  },
  {
    title: 'CRIA',
    when: '2025',
    blurb:
      'Change-request impact analyzer over Jira, Confluence and code — 2nd place, IncubXperts AI Hackathon 2025.',
    icon: 'search',
    stack: ['FastAPI', 'CrewAI', 'Pinecone'],
  },
  {
    title: 'TeamAssign',
    when: '2023',
    blurb:
      'JWT auth and role-based access, containerised, CI/CD into ECR and EC2.',
    icon: 'db',
    stack: ['Node', 'PostgreSQL', 'AWS'],
  },
];

const certifications: { name: string; issued: string; icon: IconName }[] = [
  {
    name: 'Claude Certified Architect — Professional',
    issued: 'Aug 2026',
    icon: 'award',
  },
  { name: 'Certified SAFe® Practitioner', issued: 'Jan 2026', icon: 'award' },
  { name: 'AWS Cloud Practitioner', issued: 'Jul 2023', icon: 'award' },
  { name: 'Deep Learning Specialization', issued: '2020', icon: 'doc' },
  { name: 'Machine Learning — Stanford', issued: '2020', icon: 'doc' },
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
    <div data-wide className="container-custom pb-24 pt-4">
      {/* Masthead: the three disciplines sit on the grid above the name. */}
      <header className="border-t-[6px] border-foreground pt-4">
        <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-12">
          {disciplines.map((d) => (
            <li
              key={d.name}
              className={cn('flex items-center gap-2.5 md:col-span-4', label)}
            >
              <Icon name={d.icon} className="size-4 shrink-0" />
              {d.name}
            </li>
          ))}
        </ul>

        <h1 className={cn(posterTitle, 'mt-10 md:mt-14')}>
          Siddharth
          <br />
          Chillale
        </h1>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-foreground pt-6 md:mt-16 md:grid-cols-12">
        <div className="relative aspect-square w-full max-w-[320px] overflow-hidden bg-muted md:col-span-4 md:max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile/SiddharthChillale_square.jpg"
            alt="Siddharth Chillale"
            className="absolute inset-0 size-full object-cover object-[50%_20%]"
          />
        </div>

        <div className="flex flex-col md:col-span-8">
          <p className="font-display text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] md:text-[2rem]">
            I build AI-powered applications that hold up past the demo &mdash;
            human-in-the-loop workflows, evaluation frameworks, and the
            full-stack, cloud infrastructure underneath them.
          </p>
          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
            I also read books, and read books about writing programs.
          </p>

          <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 pt-10">
            <div className="border-t border-foreground pt-2">
              <dt className={label}>Currently</dt>
              <dd className="mt-1 text-[14px] leading-snug">
                Senior Software Engineer, IncubXperts
              </dd>
            </div>
            <div className="border-t border-foreground pt-2">
              <dt className={label}>Based in</dt>
              <dd className="mt-1 text-[14px] leading-snug">
                Pune, Maharashtra
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Section title="Experience" icon="clock">
        <ol>
          {timeline.map((era) => (
            <li
              key={era.org}
              className="grid grid-cols-[5.5rem_1fr] gap-x-6 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-8"
            >
              <span className="font-display text-lg font-bold tabular-nums leading-tight tracking-[-0.02em] sm:col-span-2">
                {era.period}
              </span>
              <div className="sm:col-span-6">
                <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em]">
                  {era.org}
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  {era.rows.map((r) => (
                    <div key={r.title}>
                      <div className="text-[14.5px] leading-snug">{r.title}</div>
                      <div className="text-[13px] leading-snug text-muted-foreground">
                        {r.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Selected work" icon="cube">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.title}
              // The section rule already sits above the first row.
              className="border-t border-foreground pt-3 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
            >
              <div className="flex items-center justify-between">
                <Icon name={p.icon} className="size-6" />
                <span className={cn(label, 'tabular-nums')}>{p.when}</span>
              </div>
              <h3 className="mt-6 font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.035em]">
                {p.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {p.blurb}
              </p>
              <p className={cn(label, 'mt-4 font-semibold tracking-[0.08em]')}>
                {p.stack.join(' / ')}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Stack" icon="chip">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          <div>
            <h3 className={cn(label, 'border-b border-foreground pb-2')}>
              Domains
            </h3>
            <ul>
              {domains.map((d) => (
                <li
                  key={d.name}
                  className="flex items-center gap-3 border-b border-border py-3 text-[15px]"
                >
                  <Icon name={d.icon} className="size-[18px] shrink-0" />
                  {d.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={cn(label, 'border-b border-foreground pb-2')}>
              Languages &amp; tools
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-3">
              {tools.map((t) => (
                <li
                  key={t}
                  className="border-b border-border py-3 font-display text-[15px] font-bold tracking-[-0.01em]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Certifications" icon="award">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-foreground">
              <th scope="col" className={cn(label, 'pb-2 font-bold')}>
                Name
              </th>
              <th scope="col" className={cn(label, 'w-24 pb-2 text-right font-bold')}>
                Issued
              </th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((c) => (
              <tr key={c.name} className="border-b border-border">
                <td className="py-3 pr-4 text-[15px]">
                  <span className="flex items-center gap-3">
                    <Icon name={c.icon} className="size-[18px] shrink-0" />
                    {c.name}
                  </span>
                </td>
                <td className="py-3 text-right text-[14px] tabular-nums text-muted-foreground">
                  {c.issued}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Off the clock" icon="books">
        <blockquote className="font-display text-[1.5rem] font-bold leading-[1.15] tracking-[-0.025em] md:text-[2rem]">
          Curious, tenacious and persistent &mdash; still going looking for
          experiences I haven&rsquo;t had yet.
        </blockquote>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          <div>
            <h3 className={cn(label, 'border-b border-foreground pb-2')}>
              Reading
            </h3>
            <ul>
              {reading.map((b) => (
                <li
                  key={b.title}
                  className="flex items-start gap-3 border-b border-border py-3"
                >
                  <Icon
                    name={b.done ? 'check' : 'box'}
                    className="mt-0.5 size-[18px] shrink-0"
                  />
                  <div>
                    <div
                      className={cn(
                        'text-[15px] leading-snug',
                        b.done && 'text-muted-foreground line-through',
                      )}
                    >
                      {b.title}
                    </div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      {b.author}
                      {b.done ? ' · finished' : ' · in progress'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={cn(label, 'border-b border-foreground pb-2')}>
              Sport
            </h3>
            <div className="flex items-start gap-3 py-3">
              <Icon name="paddle" className="mt-0.5 size-[18px] shrink-0" />
              <p className="text-[15px] leading-snug">
                Table tennis and badminton &mdash; and I like to think I&rsquo;m
                good at it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Contact" icon="mail">
        <ul>
          {socials.map((s) => (
            <li key={s.label} className="border-b border-foreground first:[&>a]:pt-0">
              <a
                href={s.href}
                target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <Icon name={s.icon} className="size-6 shrink-0" />
                <span className="font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.035em] md:text-[2.25rem]">
                  {s.label}
                </span>
                <span className="ml-auto text-[14px] text-muted-foreground transition-colors group-hover:text-foreground">
                  {s.handle}
                </span>
                <Icon
                  name="chevron"
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
