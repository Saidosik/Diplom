import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('min-h-[calc(100vh-65px)] vector-grid', className)}>
      {children}
    </main>
  );
}
