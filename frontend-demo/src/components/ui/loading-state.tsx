import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Загрузка...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 border border-border bg-card/70 p-4 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}
