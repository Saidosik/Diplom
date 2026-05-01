import { CheckCircle2, Circle, CircleDot, FileText, HelpCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import { ProgressLine } from '@/components/ui/progress-line';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils/utils';
import type {
  Course,
  CourseProgress,
  Lesson,
  LessonBlock,
  ProgressStatus,
} from '@/features/courses/types';
import { getLessonFirstBlockId, getLessonLearningHref } from '@/features/courses/utils';
import { getBlockProgressStatus } from '@/features/learning/utils';

function lessonHref(courseId: number, lesson: Lesson): string {
  return getLessonLearningHref({
    courseId,
    lessonId: lesson.id,
    blockId: getLessonFirstBlockId(lesson),
  });
}

function blockHref(courseId: number, lessonId: number, blockId: number): string {
  return getLessonLearningHref({ courseId, lessonId, blockId });
}

function StatusDot({ status }: { status: ProgressStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-3.5 text-emerald-300" />;
  if (status === 'failed') return <XCircle className="size-3.5 text-destructive" />;
  if (status === 'opened') return <CircleDot className="size-3.5 text-primary" />;
  return <Circle className="size-3.5 text-muted-foreground" />;
}

function BlockTypeIcon({ block }: { block: LessonBlock }) {
  if (block.type === 'test') return <HelpCircle className="size-3.5" />;
  return <FileText className="size-3.5" />;
}

function blockTypeLabel(block: LessonBlock): string {
  if (block.type === 'theory') return 'Теория';
  if (block.type === 'test') return 'Тест';
  if (block.type === 'coding_task') return 'Код';
  return block.type;
}

function getLessonSummary(lesson: Lesson, progress?: CourseProgress | null) {
  const blocks = lesson.lesson_blocks ?? [];
  const total = blocks.length;
  const passed = blocks.filter((block) => getBlockProgressStatus(progress, block.id) === 'passed').length;
  const hasFailed = blocks.some((block) => getBlockProgressStatus(progress, block.id) === 'failed');

  return { total, passed, hasFailed };
}

export function LearningSidebar({
  course,
  progress,
  activeLessonId,
  activeBlockId,
  compact = false,
}: {
  course: Course;
  progress?: CourseProgress | null;
  activeLessonId: number;
  activeBlockId: number | null;
  compact?: boolean;
}) {
  return (
    <aside
      className={cn(
        'overflow-y-auto border-r border-border bg-card/70',
        compact ? 'max-h-[70vh] border-r-0' : 'h-[calc(100vh-122px)]',
      )}
    >
      <div className="border-b border-border p-4">
        <Link
          href={`/courses/${course.slug}`}
          className="font-heading text-base font-semibold tracking-wide hover:text-primary"
        >
          {course.name}
        </Link>

        {progress ? (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Прогресс курса</span>
              <span>{progress.passed_blocks}/{progress.total_blocks}</span>
            </div>
            <ProgressLine value={progress.percent} className="h-1.5" />
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-3">
        {course.modules?.map((module, moduleIndex) => (
          <section key={module.id}>
            <div className="mb-2 flex items-center justify-between gap-2 px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {moduleIndex + 1}. {module.name}
              </p>
              <StatusBadge tone="neutral" className="px-1.5 py-0.5">
                {module.lessons?.length ?? 0}
              </StatusBadge>
            </div>

            <div className="space-y-1">
              {module.lessons?.map((lesson) => {
                const isActiveLesson = lesson.id === activeLessonId;
                const summary = getLessonSummary(lesson, progress);

                return (
                  <div key={lesson.id}>
                    <Link
                      href={lessonHref(course.id, lesson)}
                      className={cn(
                        'block border px-2 py-2 text-sm transition-colors',
                        isActiveLesson
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/20 hover:text-foreground',
                      )}
                    >
                      <span className="line-clamp-2">{lesson.name}</span>
                      {summary.total ? (
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {summary.passed}/{summary.total} блоков
                          {summary.hasFailed ? ' · есть ошибка' : ''}
                        </span>
                      ) : null}
                    </Link>

                    {isActiveLesson && lesson.lesson_blocks?.length ? (
                      <div className="mt-1 space-y-1 pl-3">
                        {lesson.lesson_blocks.map((block) => {
                          const status = getBlockProgressStatus(progress, block.id);
                          const isActiveBlock = activeBlockId === block.id;

                          return (
                            <Link
                              key={block.id}
                              href={blockHref(course.id, lesson.id, block.id)}
                              className={cn(
                                'flex items-center gap-2 border px-2 py-1.5 text-xs transition-colors',
                                isActiveBlock
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/20 hover:text-foreground',
                              )}
                            >
                              <StatusDot status={status} />
                              <span className="truncate">{block.name}</span>
                              <span className="ml-auto inline-flex shrink-0 items-center gap-1 opacity-70">
                                <BlockTypeIcon block={block} />
                                {blockTypeLabel(block)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
