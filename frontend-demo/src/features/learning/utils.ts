import type { Course, CourseProgress, LessonBlock, ProgressStatus } from '@/features/courses/types';
import { getLessonLearningHref } from '@/features/courses/utils';

export type LearningStep = {
  courseId?: number | null;
  moduleId: number;
  moduleName: string;
  lessonId: number;
  lessonName: string;
  blockId: number;
  blockName: string;
  blockType: LessonBlock['type'];
  href: string;
};

export type LearningNeighbors = {
  current: LearningStep | null;
  previous: LearningStep | null;
  next: LearningStep | null;
};

export function getBlockProgressStatus(
  progress: CourseProgress | null | undefined,
  blockId: number | null | undefined,
): ProgressStatus {
  if (!blockId) return null;

  return progress?.blocks.find((item) => item.lesson_block_id === blockId)?.status ?? null;
}

export function getProgressLabel(status: ProgressStatus): string {
  if (status === 'passed') return 'Пройдено';
  if (status === 'failed') return 'Есть ошибка';
  if (status === 'opened') return 'Открыто';

  return 'Не начато';
}

export function flattenCourseSteps(course: Course | null | undefined): LearningStep[] {
  if (!course) return [];

  const steps: LearningStep[] = [];

  for (const courseModule of course.modules ?? []) {
    for (const lesson of courseModule.lessons ?? []) {
      for (const block of lesson.lesson_blocks ?? []) {
        steps.push({
          courseId: course.id,
          moduleId: courseModule.id,
          moduleName: courseModule.name,
          lessonId: lesson.id,
          lessonName: lesson.name,
          blockId: block.id,
          blockName: block.name,
          blockType: block.type,
          href: getLessonLearningHref({
            courseId: course.id,
            lessonId: lesson.id,
            blockId: block.id,
          }),
        });
      }
    }
  }

  return steps;
}

export function getLearningNeighbors(
  course: Course | null | undefined,
  lessonId: number,
  activeBlock: LessonBlock | null | undefined,
): LearningNeighbors {
  const steps = flattenCourseSteps(course);
  const activeBlockId = activeBlock?.id ?? null;
  const currentIndex = steps.findIndex(
    (step) => step.lessonId === lessonId && step.blockId === activeBlockId,
  );

  if (currentIndex < 0) {
    return {
      current: null,
      previous: null,
      next: null,
    };
  }

  return {
    current: steps[currentIndex] ?? null,
    previous: steps[currentIndex - 1] ?? null,
    next: steps[currentIndex + 1] ?? null,
  };
}

export function getLessonProgressSummary(
  blocks: LessonBlock[],
  progress: CourseProgress | null | undefined,
) {
  const total = blocks.length;
  const passed = blocks.filter((block) => getBlockProgressStatus(progress, block.id) === 'passed').length;
  const failed = blocks.filter((block) => getBlockProgressStatus(progress, block.id) === 'failed').length;
  const opened = blocks.filter((block) => getBlockProgressStatus(progress, block.id) === 'opened').length;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

  return { total, passed, failed, opened, percent };
}
