import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export function ErrorState({
  title = 'Не удалось загрузить данные',
  description,
}: {
  title?: string;
  description?: ReactNode;
}) {
  return (
    <div className="border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          {description ? <div className="mt-1 leading-6 text-destructive/80">{description}</div> : null}
        </div>
      </div>
    </div>
  );
}
