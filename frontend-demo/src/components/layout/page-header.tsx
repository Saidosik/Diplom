import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  className,
}: {
  kicker?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between mx-auto', className)}>
      <div className="max-w-3xl">
        {kicker ? <p className="vector-kicker mb-3">{kicker}</p> : null}
        <h1 className="font-heading text-3xl font-semibold tracking-wide md:text-5xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
