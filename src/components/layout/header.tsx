"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'writing', href: '/blog' },
  { name: 'projects', href: '/projects' },
  { name: 'about', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="py-8">
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-1 font-medium text-sm">
          <span className="text-foreground tracking-tight">siddharth chillale</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-medium transition-colors lowercase",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <button
            className="text-muted-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="container-custom pt-4 pb-2 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs font-medium transition-all lowercase",
                    pathname?.startsWith(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
