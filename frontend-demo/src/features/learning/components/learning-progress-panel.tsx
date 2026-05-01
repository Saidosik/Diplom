import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Flag,
  GraduationCap,
  ListChecks,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressLine } from '@/components/ui/progress-line';
import { StatusBadge } from '@/components/ui/status-badge';
import type { CourseProgress, LessonBlock, ProgressStatus } from '@/features/courses/types';
import type { LearningStep } from '@/features/learning/utils';
import {
  getBlockProgressStatus,
  getLessonProgressSummary,
  getProgressLabel,
} from '@/features/learning/utils';

function statusTone(status: ProgressStatus): 'neutral' | 'primary' | 'success' | 'danger' | 'warning' {
  if (status === 'passed') return 'success';
  if (status === 'failed') return 'danger';
  if (status === 'opened') return 'primary';

  return 'neutral';
}

function StatusIcon({ status }: { status: ProgressStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-4 text-emerald-300" />;
  if (status === 'failed') return <XCircle className="size-4 text-destructive" />;
  if (status === 'opened') return <CircleDot className="size-4 text-primary" />;

  return <CircleDot className="size-4 text-muted-foreground" />;
}

export function LearningProgressPanel({
  progress,
  blocks,
  activeBlock,
  previousStep,
  nextStep,
}: {
  progress?: CourseProgress | null;
  blocks: LessonBlock[];
  activeBlock: LessonBlock;
  previousStep?: LearningStep | null;
  nextStep?: LearningStep | null;
}) {
  const lessonProgress = getLessonProgressSummary(blocks, progress);
  const activeStatus = getBlockProgressStatus(progress, activeBlock.id);

  return (
    <Card className="bg-card/80">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-5 text-primary" />
          Прогресс урока
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Урок</span>
            <span>{lessonProgress.passed}/{lessonProgress.total}</span>
          </div>
          <ProgressLine value={lessonProgress.percent} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {lessonProgress.percent}% обязательных блоков пройдено.
          </p>
        </div>

        {progress ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Курс</span>
              <span>{progress.passed_blocks}/{progress.total_blocks}</span>
            </div>
            <ProgressLine value={progress.percent} className="h-2" />
          </div>
        ) : (
          <div className="border border-border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
            Войдите в аккаунт, чтобы сохранять прогресс по курсу.
          </div>
        )}

        <div className="border border-border bg-background/35 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Текущий блок
            </span>
            <StatusBadge tone={statusTone(activeStatus)}>{getProgressLabel(activeStatus)}</StatusBadge>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <StatusIcon status={activeStatus} />
            <div>
              <p className="font-medium leading-snug">{activeBlock.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Теория засчитывается при открытии. Тест засчитывается после правильной отправки.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {previousStep ? (
            <Button asChild variant="outline">
              <Link href={previousStep.href}>
                <ArrowLeft className="size-4" />
                Назад
              </Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              <ArrowLeft className="size-4" />
              Назад
            </Button>
          )}

          {nextStep ? (
            <Button asChild>
              <Link href={nextStep.href}>
                Далее
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              <Flag className="size-4" />
              Финиш
            </Button>
          )}
        </div>

        {nextStep ? (
          <div className="border border-primary/30 bg-primary/10 p-3 text-xs leading-5 text-primary">
            Следующий шаг: <span className="font-medium">{nextStep.lessonName}</span> · {nextStep.blockName}
          </div>
        ) : (
          <div className="border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-200">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <GraduationCap className="size-4" />
              Это последний блок курса
            </div>
            После прохождения всех блоков курс можно считать завершённым. Сертификаты лучше добавить отдельным этапом.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
