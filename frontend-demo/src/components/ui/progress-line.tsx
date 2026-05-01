import { cn } from '@/lib/utils/utils';

export function ProgressLine({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value || 0)));

  return (
    <div className={cn('h-2 border border-border bg-background/70', className)}>
      <div className="h-full bg-primary transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
