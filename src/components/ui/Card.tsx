import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentTop?: boolean;
  padded?: boolean;
}

export function Card({ className, accentTop, padded = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl shadow-card border border-border-soft/40 relative',
        padded && 'p-5',
        accentTop && 'overflow-hidden',
        className,
      )}
      {...props}
    >
      {accentTop && <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />}
      {children}
    </div>
  );
}
