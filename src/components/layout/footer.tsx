import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="mt-auto pb-16 pt-24">
      <div className="container-custom">
        <div className="flex items-center justify-between border-t border-foreground pt-4 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {siteConfig.author}
          </div>
          <div className="flex gap-4">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">github</a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">linkedin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
