'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'none',
  distance = 20,
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  delayChildren = 0,
  staggerChildren = 0.1,
  ...props
}: HTMLMotionProps<'div'> & { delayChildren?: number; staggerChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  distance = 20,
  ...props
}: HTMLMotionProps<'div'> & { distance?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
