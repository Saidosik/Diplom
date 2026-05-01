import type { Course, CourseEnrollment, Lesson } from './types';

export function getLessonLearningHref({
  courseId,
  lessonId,
  blockId,
}: {
  courseId?: number | null;
  lessonId: number;
  blockId?: number | null;
}) {
  const base = courseId
    ? `/learn/courses/${courseId}/lessons/${lessonId}`
    : `/lessons/${lessonId}/learn`;

  return blockId ? `${base}?block=${blockId}` : base;
}

export function getLessonFirstBlockId(lesson: Pick<Lesson, 'lesson_blocks'>): number | null {
  return lesson.lesson_blocks?.[0]?.id ?? null;
}

export function getFirstLessonHref(course: Course): string | null {
  for (const courseModule of course.modules ?? []) {
    for (const lesson of courseModule.lessons ?? []) {
      return getLessonLearningHref({
        courseId: course.id,
        lessonId: lesson.id,
        blockId: getLessonFirstBlockId(lesson),
      });
    }
  }

  return null;
}

export function getContinueLearningHref(enrollment: CourseEnrollment): string | null {
  if (enrollment.last_lesson?.id && enrollment.last_lesson_block?.id) {
    return getLessonLearningHref({
      courseId: enrollment.course_id,
      lessonId: enrollment.last_lesson.id,
      blockId: enrollment.last_lesson_block.id,
    });
  }

  if (enrollment.last_lesson?.id) {
    return getLessonLearningHref({
      courseId: enrollment.course_id,
      lessonId: enrollment.last_lesson.id,
    });
  }

  if (enrollment.course) {
    return getFirstLessonHref(enrollment.course);
  }

  return null;
}
