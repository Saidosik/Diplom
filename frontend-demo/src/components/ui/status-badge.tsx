import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

type Tone = 'neutral' | 'primary' | 'success' | 'danger' | 'warning';

const toneClasses: Record<Tone, string> = {
  neutral: 'border-border bg-muted/30 text-muted-foreground',
  primary: 'border-primary/40 bg-primary/10 text-primary',
  success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive',
  warning: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
};

export function StatusBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center border px-2 py-1 text-xs font-medium', toneClasses[tone], className)}>
      {children}
    </span>
  );
}
