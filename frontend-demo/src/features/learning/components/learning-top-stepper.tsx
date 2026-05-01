import { BookOpen, CheckCircle2, Code2, HelpCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import { getLessonLearningHref } from '@/features/courses/utils';
import { cn } from '@/lib/utils/utils';
import type { CourseProgress, LessonBlock, ProgressStatus } from '@/features/courses/types';

function getProgressStatus(
  progress: CourseProgress | null | undefined,
  blockId: number,
): ProgressStatus {
  return progress?.blocks.find((item) => item.lesson_block_id === blockId)?.status ?? null;
}

function BlockIcon({ block }: { block: LessonBlock }) {
  if (block.type === 'test') return <HelpCircle className="size-3.5" />;
  if (block.type === 'coding_task') return <Code2 className="size-3.5" />;
  return <BookOpen className="size-3.5" />;
}

function StatusIcon({ status }: { status: ProgressStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-3.5" />;
  if (status === 'failed') return <XCircle className="size-3.5" />;
  return null;
}

export function LearningTopStepper({
  lessonId,
  courseId,
  blocks,
  activeBlockId,
  progress,
}: {
  lessonId: number;
  courseId?: number | null;
  blocks: LessonBlock[];
  activeBlockId: number | null;
  progress?: CourseProgress | null;
}) {
  return (
    <div className="border-b border-border bg-background/92 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
        {blocks.map((block, index) => {
          const status = getProgressStatus(progress, block.id);
          const isActive = activeBlockId === block.id;

          return (
            <Link
              key={block.id}
              href={getLessonLearningHref({ courseId, lessonId, blockId: block.id })}
              title={`${index + 1}. ${block.name}`}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex size-9 shrink-0 items-center justify-center border text-xs transition-colors',
                'hover:border-primary hover:text-primary',
                isActive && 'border-primary bg-primary text-primary-foreground',
                !isActive && status === 'passed' && 'border-primary/60 bg-primary/10 text-primary',
                !isActive && status === 'failed' && 'border-destructive/60 bg-destructive/10 text-destructive',
                !isActive && status === 'opened' && 'border-muted-foreground/50 bg-muted/20 text-muted-foreground',
                !isActive && !status && 'border-border bg-card text-muted-foreground',
              )}
            >
              {status === 'passed' || status === 'failed' ? (
                <StatusIcon status={status} />
              ) : (
                <BlockIcon block={block} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
