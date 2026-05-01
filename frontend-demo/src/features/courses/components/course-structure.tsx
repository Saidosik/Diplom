import Link from 'next/link';
import { BookOpen, CheckCircle2, Circle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Course, CourseProgress, Lesson, ProgressStatus } from '../types';
import { getLessonFirstBlockId, getLessonLearningHref } from '../utils';

function blockStatusLabel(status: ProgressStatus) {
  if (status === 'passed') return 'пройден';
  if (status === 'opened') return 'открыт';
  if (status === 'failed') return 'ошибка';
  return 'не начат';
}

function BlockStatusIcon({ status }: { status: ProgressStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-4 text-primary" />;
  if (status === 'failed') return <XCircle className="size-4 text-destructive" />;
  return <Circle className="size-4 text-muted-foreground" />;
}

function lessonHref(courseId: number, lesson: Lesson) {
  return getLessonLearningHref({
    courseId,
    lessonId: lesson.id,
    blockId: getLessonFirstBlockId(lesson),
  });
}

export function CourseStructure({
  course,
  progress,
}: {
  course: Course;
  progress?: CourseProgress | null;
}) {
  const progressByBlock = new Map(
    progress?.blocks.map((item) => [item.lesson_block_id, item.status]) ?? [],
  );
  const firstLesson = course.modules?.flatMap((module) => module.lessons ?? [])[0];

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Структура курса
          </CardTitle>

          {firstLesson ? (
            <Button asChild>
              <Link href={lessonHref(course.id, firstLesson)}>Начать обучение</Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {!course.modules?.length ? (
          <EmptyState title="В курсе пока нет открытых модулей" />
        ) : null}

        {course.modules?.map((module, moduleIndex) => (
          <div key={module.id} className="border border-border bg-background/30">
            <div className="border-b border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge>{String(moduleIndex + 1).padStart(2, '0')}</StatusBadge>
                <p className="font-heading text-lg font-semibold tracking-wide">{module.name}</p>
              </div>
              {module.description ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
              ) : null}
            </div>

            <div className="divide-y divide-border">
              {module.lessons?.map((lesson) => (
                <div key={lesson.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={lessonHref(course.id, lesson)}
                        className="font-medium hover:text-primary"
                      >
                        {lesson.name}
                      </Link>
                      {lesson.description ? (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{lesson.description}</p>
                      ) : null}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={lessonHref(course.id, lesson)}>Открыть</Link>
                    </Button>
                  </div>

                  {lesson.lesson_blocks?.length ? (
                    <div className="mt-3 grid gap-2">
                      {lesson.lesson_blocks.map((block) => {
                        const status = progressByBlock.get(block.id) ?? null;

                        return (
                          <div
                            key={block.id}
                            className="flex flex-wrap items-center justify-between gap-2 border border-border bg-muted/10 px-3 py-2 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <BlockStatusIcon status={status} />
                              <span className="truncate">{block.name}</span>
                              <span className="text-xs text-muted-foreground">{block.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {blockStatusLabel(status)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
