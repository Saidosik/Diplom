import { ProgressLine } from '@/components/ui/progress-line';
import type { CourseProgress } from '../types';

export function ProgressSummary({ progress }: { progress?: CourseProgress | null }) {
  if (!progress) {
    return (
      <div className="border border-border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
        Войдите в аккаунт, чтобы видеть личный прогресс по курсу.
      </div>
    );
  }

  return (
    <div className="border border-border bg-muted/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-medium">Прогресс курса</p>
        <p className="font-heading text-2xl font-semibold text-primary">{progress.percent}%</p>
      </div>
      <ProgressLine value={progress.percent} />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>Всего: {progress.total_blocks}</span>
        <span>Пройдено: {progress.passed_blocks}</span>
        <span>Открыто: {progress.opened_blocks}</span>
        <span>Ошибок: {progress.failed_blocks}</span>
      </div>
    </div>
  );
}
