'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Layers3, ListChecks } from 'lucide-react';
import Link from 'next/link';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProgressLine } from '@/components/ui/progress-line';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCourseProgress, getCourseStructure, getMyLearning } from '@/features/courses/api';
import type { CourseEnrollment } from '@/features/courses/types';
import { getContinueLearningHref, getFirstLessonHref } from '@/features/courses/utils';

function enrollmentStatusLabel(status: CourseEnrollment['status']) {
  if (status === 'active') return 'В процессе';
  if (status === 'completed') return 'Завершён';
  if (status === 'archived') return 'В архиве';

  return status;
}

export function LearningCourseOverviewClient({ courseId }: { courseId: number }) {
  const learningQuery = useQuery({
    queryKey: ['my-learning'],
    queryFn: getMyLearning,
    retry: false,
  });

  const enrollment = learningQuery.data?.find((item) => item.course_id === courseId) ?? null;
  const courseSlug = enrollment?.course?.slug ?? null;

  const structureQuery = useQuery({
    queryKey: ['course-structure', courseSlug],
    queryFn: () => getCourseStructure(courseSlug as string),
    enabled: Boolean(courseSlug),
  });

  const progressQuery = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => getCourseProgress(courseId),
    enabled: Boolean(enrollment),
    retry: false,
  });

  const course = structureQuery.data ?? enrollment?.course ?? null;
  const progress = progressQuery.data ?? null;
  const continueHref = enrollment ? getContinueLearningHref({ ...enrollment, course: course ?? enrollment.course }) : null;
  const firstLessonHref = course ? getFirstLessonHref(course) : null;

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Учебное пространство"
          title={course?.name ?? `Курс #${courseId}`}
          description="Обзор курса: структура, прогресс и быстрый переход к следующему учебному шагу."
          actions={(
            <Button asChild variant="outline">
              <Link href="/learn">Моё обучение</Link>
            </Button>
          )}
        />

        {learningQuery.isLoading ? <LoadingState label="Загрузка курса..." /> : null}

        {learningQuery.isError ? (
          <ErrorState description="Не удалось загрузить ваши курсы. Возможно, нужно войти в аккаунт заново." />
        ) : null}

        {!learningQuery.isLoading && !enrollment ? (
          <EmptyState
            title="Курс не найден в вашем обучении"
            description="Вы могли ещё не записаться на этот курс или запись была архивирована."
            action={(
              <Button asChild>
                <Link href="/courses">Перейти в каталог</Link>
              </Button>
            )}
          />
        ) : null}

        {enrollment && course ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <Card>
                <CardHeader className="border-b border-border">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl">Продолжить обучение</CardTitle>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {enrollment.last_lesson
                          ? `Последний урок: ${enrollment.last_lesson.name}`
                          : 'Начните курс с первого доступного урока.'}
                      </p>
                    </div>
                    <StatusBadge tone={enrollment.status === 'completed' ? 'success' : 'primary'}>
                      {enrollmentStatusLabel(enrollment.status)}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Button asChild size="lg">
                    <Link href={continueHref ?? firstLessonHref ?? '/courses'}>
                      Продолжить
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Layers3 className="size-5 text-primary" />
                    Структура курса
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {course.modules?.map((module, moduleIndex) => (
                    <section key={module.id} className="border border-border bg-background/35 p-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-heading text-lg font-semibold tracking-wide">
                          {moduleIndex + 1}. {module.name}
                        </h2>
                        <StatusBadge>{module.lessons?.length ?? 0} уроков</StatusBadge>
                      </div>

                      <div className="space-y-2">
                        {module.lessons?.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={getFirstLessonHref({ ...course, modules: [{ ...module, lessons: [lesson] }] }) ?? '#'}
                            className="flex items-center justify-between gap-3 border border-border bg-card/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                          >
                            <span>{lesson.name}</span>
                            <span className="text-xs">{lesson.lesson_blocks?.length ?? 0} блоков</span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-4">
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" />
                    Прогресс
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {progress ? (
                    <>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Пройдено</span>
                        <span>{progress.passed_blocks}/{progress.total_blocks}</span>
                      </div>
                      <ProgressLine value={progress.percent} className="h-2" />
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="border border-border bg-background/35 p-2">
                          <p className="text-lg font-semibold text-foreground">{progress.opened_blocks}</p>
                          <p className="text-muted-foreground">открыто</p>
                        </div>
                        <div className="border border-border bg-background/35 p-2">
                          <p className="text-lg font-semibold text-emerald-300">{progress.passed_blocks}</p>
                          <p className="text-muted-foreground">пройдено</p>
                        </div>
                        <div className="border border-border bg-background/35 p-2">
                          <p className="text-lg font-semibold text-destructive">{progress.failed_blocks}</p>
                          <p className="text-muted-foreground">ошибки</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Прогресс появится после открытия первого блока урока.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    О курсе
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {course.description ?? 'Описание курса пока не заполнено.'}
                </CardContent>
              </Card>
            </aside>
          </div>
        ) : null}
      </PageShell>
    </AppShell>
  );
}
