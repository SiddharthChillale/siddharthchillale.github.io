import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { FadeIn } from '@/components/ui/animations';

export default function ResumePage() {
  return (
    <div className="container-custom py-20">
      <FadeIn direction="up" distance={10}>
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
          <a
            href="/docs/siddharth-chillale-resume.pdf"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border"
            target="_blank"
          >
            Download PDF
          </a>
        </div>

        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Experience</h2>
            <p className="text-secondary font-medium leading-relaxed italic">
              Software Developer with experience in backend development, cloud computing, and database management.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Skills</h2>
            <ul className="grid grid-cols-2 gap-2 list-none p-0 text-xs font-medium">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Backend Development
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Cloud Computing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Database Management
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Software Architecture
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Education</h2>
            <p className="text-xs font-medium">Computer Science degree from University at Buffalo</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Connect</h2>
            <div className="flex flex-wrap gap-4 text-xs font-medium lowercase">
              <a href={siteConfig.github} className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">github</a>
              <a href={siteConfig.linkedin} className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">linkedin</a>
              <a href={siteConfig.twitter} className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">twitter</a>
              <a href={`mailto:${siteConfig.email}`} className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">email</a>
            </div>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}
