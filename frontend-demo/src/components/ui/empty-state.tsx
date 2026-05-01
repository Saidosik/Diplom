import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="vector-panel flex flex-col items-start gap-4 p-6 text-sm">
      <div className="border border-border bg-muted/30 p-3 text-muted-foreground">
        <Inbox className="size-5" />
      </div>
      <div>
        <p className="font-heading text-lg font-semibold tracking-wide text-foreground">{title}</p>
        {description ? <div className="mt-2 max-w-2xl leading-6 text-muted-foreground">{description}</div> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
