import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('container py-10 md:py-14 mx-auto', className)}>
      {children}
    </div>
  );
}
