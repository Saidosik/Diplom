'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, BookOpen, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { AiAssistantPanel } from '@/features/ai/components/ai-assistant-panel';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useMeQuery } from '@/features/auth/hooks';
import {
  getCourseProgress,
  getCourseStructure,
  getLessonLearning,
  openLessonBlock,
} from '@/features/courses/api';
import type { LessonBlock } from '@/features/courses/types';
import { getLessonLearningHref } from '@/features/courses/utils';
import { LearningBlockView } from './learning-block-view';
import { LearningProgressPanel } from './learning-progress-panel';
import { LearningSidebar } from './learning-sidebar';
import { LearningTopStepper } from './learning-top-stepper';
import { getLearningNeighbors, type LearningStep } from '../utils';

function blockTypeLabel(block: LessonBlock): string {
  if (block.type === 'theory') return 'Теория';
  if (block.type === 'test') return 'Тест';
  if (block.type === 'coding_task') return 'Практика';

  return block.type;
}

function buildLocalStep({
  courseId,
  lessonId,
  lessonName,
  block,
}: {
  courseId?: number | null;
  lessonId: number;
  lessonName: string;
  block: LessonBlock | null | undefined;
}): LearningStep | null {
  if (!block) return null;

  return {
    courseId,
    moduleId: 0,
    moduleName: 'Текущий урок',
    lessonId,
    lessonName,
    blockId: block.id,
    blockName: block.name,
    blockType: block.type,
    href: getLessonLearningHref({ courseId, lessonId, blockId: block.id }),
  };
}

export function LessonLearningClient({ lessonId, courseId: routeCourseId }: { lessonId: number; courseId?: number }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: user } = useMeQuery();

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonLearning(lessonId),
  });

  const lesson = lessonQuery.data;
  const blocks = lesson?.lesson_blocks ?? [];

  const blockParam = searchParams.get('block');
  const requestedBlockId = blockParam ? Number(blockParam) : null;

  const activeBlock =
    blocks.find((block) => block.id === requestedBlockId) ?? blocks[0] ?? null;

  const activeBlockId = activeBlock?.id ?? null;
  const activeBlockIndex = activeBlock
    ? blocks.findIndex((block) => block.id === activeBlock.id)
    : -1;

  const localPreviousBlock = activeBlockIndex > 0 ? blocks[activeBlockIndex - 1] ?? null : null;
  const localNextBlock = activeBlockIndex >= 0 ? blocks[activeBlockIndex + 1] ?? null : null;

  const courseId = routeCourseId ?? lesson?.module?.course?.id;
  const courseSlug = lesson?.module?.course?.slug;

  const courseQuery = useQuery({
    queryKey: ['course-structure', courseSlug],
    queryFn: () => getCourseStructure(courseSlug as string),
    enabled: Boolean(courseSlug),
  });

  const progressQuery = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => getCourseProgress(courseId as number),
    enabled: Boolean(user && courseId),
    retry: false,
  });

  const openMutation = useMutation({
    mutationFn: (blockId: number) => openLessonBlock(blockId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      await queryClient.invalidateQueries({ queryKey: ['my-learning'] });

      if (courseId) {
        await queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] });
      }

      if (courseSlug) {
        await queryClient.invalidateQueries({ queryKey: ['course-enrollment', courseSlug] });
      }
    },
  });

  useEffect(() => {
    if (user && activeBlock) {
      openMutation.mutate(activeBlock.id);
    }

    // Нужно срабатывать только при смене активного блока или пользователя.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeBlock?.id]);

  if (lessonQuery.isLoading) {
    return (
      <main className="min-h-[calc(100vh-65px)] p-4">
        <LoadingState label="Загрузка урока..." />
      </main>
    );
  }

  if (lessonQuery.isError || !lesson) {
    return (
      <main className="min-h-[calc(100vh-65px)] p-4">
        <ErrorState title="Не удалось загрузить урок" description="Проверьте, опубликован ли курс и доступен ли урок." />
      </main>
    );
  }

  if (!blocks.length || !activeBlock) {
    return (
      <main className="container min-h-[calc(100vh-65px)] py-10">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href={courseSlug ? `/courses/${courseSlug}` : '/courses'}>
            <ArrowLeft className="size-4" />
            Назад к курсу
          </Link>
        </Button>

        <div className="vector-panel p-6 text-sm text-muted-foreground">
          В этом уроке пока нет открытых блоков. Автору курса нужно добавить видимые блоки в Studio.
        </div>
      </main>
    );
  }

  const course = courseQuery.data ?? null;
  const progress = progressQuery.data ?? null;
  const neighbors = getLearningNeighbors(course, lesson.id, activeBlock);
  const previousStep = neighbors.previous ?? buildLocalStep({
    courseId,
    lessonId: lesson.id,
    lessonName: lesson.name,
    block: localPreviousBlock,
  });
  const nextStep = neighbors.next ?? buildLocalStep({
    courseId,
    lessonId: lesson.id,
    lessonName: lesson.name,
    block: localNextBlock,
  });

  return (
    <div className="min-h-[calc(100vh-65px)] bg-background/70">
      <LearningTopStepper
        lessonId={lesson.id}
        courseId={courseId}
        blocks={blocks}
        activeBlockId={activeBlockId}
        progress={progress}
      />

      <div className="grid min-h-[calc(100vh-122px)] xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="hidden xl:block">
          {course ? (
            <LearningSidebar
              course={course}
              progress={progress}
              activeLessonId={lesson.id}
              activeBlockId={activeBlockId}
            />
          ) : (
            <aside className="h-full border-r border-border bg-card p-4 text-sm text-muted-foreground">
              Загрузка структуры курса...
            </aside>
          )}
        </div>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="vector-kicker">Обучение</span>
                {lesson.module?.course?.name ? <span>/ {lesson.module.course.name}</span> : null}
                {lesson.module?.name ? <span>/ {lesson.module.name}</span> : null}
              </div>
              <h1 className="font-heading text-3xl font-semibold tracking-wide md:text-4xl">
                {lesson.name}
              </h1>
              {lesson.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {lesson.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {previousStep ? (
                <Button asChild variant="outline">
                  <Link href={previousStep.href}>
                    <ArrowLeft className="size-4" />
                    Назад
                  </Link>
                </Button>
              ) : null}

              {courseSlug ? (
                <Button asChild variant="outline">
                  <Link href={`/courses/${courseSlug}`}>К курсу</Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/courses">К каталогу</Link>
                </Button>
              )}
            </div>
          </div>

          {course ? (
            <details className="mb-6 border border-border bg-card/70 xl:hidden">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium">
                <PanelLeftOpen className="size-4 text-primary" />
                Структура курса
              </summary>
              <LearningSidebar
                course={course}
                progress={progress}
                activeLessonId={lesson.id}
                activeBlockId={activeBlockId}
                compact
              />
            </details>
          ) : null}

          <div className="mb-4 flex items-center justify-between gap-3 border border-border bg-card/50 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="size-4 text-primary" />
              <span>
                Блок {activeBlockIndex + 1} из {blocks.length}: {blockTypeLabel(activeBlock)}
              </span>
            </div>
            {nextStep ? (
              <Button asChild size="sm">
                <Link href={nextStep.href}>
                  Следующий шаг
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : null}
          </div>

          <LearningBlockView
            block={activeBlock}
            lessonId={lesson.id}
            courseId={courseId}
            courseSlug={courseSlug}
            previousStep={previousStep}
            nextStep={nextStep}
            canTrackProgress={Boolean(user)}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            <LearningProgressPanel
              progress={progress}
              blocks={blocks}
              activeBlock={activeBlock}
              previousStep={previousStep}
              nextStep={nextStep}
            />

            <AiAssistantPanel
              courseName={course?.name ?? lesson.module?.course?.name}
              lessonName={lesson.name}
              blockName={activeBlock.name}
              blockType={blockTypeLabel(activeBlock)}
            />
          </div>
        </main>

        <aside className="hidden border-l border-border bg-card/45 p-4 xl:block">
          <div className="sticky top-24 space-y-4">
            <LearningProgressPanel
              progress={progress}
              blocks={blocks}
              activeBlock={activeBlock}
              previousStep={previousStep}
              nextStep={nextStep}
            />

            <AiAssistantPanel
              courseName={course?.name ?? lesson.module?.course?.name}
              lessonName={lesson.name}
              blockName={activeBlock.name}
              blockType={blockTypeLabel(activeBlock)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
