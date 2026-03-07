import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="py-20 border-t border-neutral-100 dark:border-neutral-900 mt-auto">
      <div className="container-custom flex items-center justify-between text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
        <div>
          © {new Date().getFullYear()} {siteConfig.author}
        </div>
        <div className="flex gap-4">
          <a href={siteConfig.github} target="_blank" className="hover:text-foreground transition-colors">github</a>
          <a href={siteConfig.linkedin} target="_blank" className="hover:text-foreground transition-colors">linkedin</a>
        </div>
      </div>
    </footer>
  );
}
