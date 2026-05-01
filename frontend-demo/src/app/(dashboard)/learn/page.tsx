'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { getMyLearning } from '@/features/courses/api';
import type { CourseEnrollment } from '@/features/courses/types';
import { getContinueLearningHref } from '@/features/courses/utils';

function formatDate(value: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function enrollmentStatusLabel(status: CourseEnrollment['status']) {
  if (status === 'active') return 'В процессе';
  if (status === 'completed') return 'Завершён';
  if (status === 'archived') return 'В архиве';

  return status;
}

export default function LearnPage() {
  const query = useQuery({
    queryKey: ['my-learning'],
    queryFn: getMyLearning,
    retry: false,
  });

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Моё обучение"
          title="Курсы, которые я прохожу"
          description="Личный учебный кабинет: продолжайте курс с последнего урока, смотрите статусы и возвращайтесь к материалам."
          actions={(
            <Button asChild variant="outline">
              <Link href="/courses">Каталог курсов</Link>
            </Button>
          )}
        />

        {query.isLoading ? <LoadingState label="Загрузка обучения..." /> : null}

        {query.isError ? (
          <ErrorState description="Возможно, нужно войти в аккаунт заново." />
        ) : null}

        {!query.isLoading && !query.data?.length ? (
          <EmptyState
            title="Вы пока не записались ни на один курс"
            description="Откройте каталог, выберите курс и нажмите «Поступить на курс»."
            action={(
              <Button asChild>
                <Link href="/courses">Перейти к курсам</Link>
              </Button>
            )}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((enrollment) => {
            const course = enrollment.course;
            const continueHref = getContinueLearningHref(enrollment);

            return (
              <Card key={enrollment.id} className="h-full justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl leading-tight">
                      {course ? (
                        <Link href={`/courses/${course.slug}`} className="hover:text-primary">
                          {course.name}
                        </Link>
                      ) : (
                        'Курс недоступен'
                      )}
                    </CardTitle>

                    <StatusBadge tone={enrollment.status === 'completed' ? 'success' : 'primary'}>
                      {enrollmentStatusLabel(enrollment.status)}
                    </StatusBadge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {course?.description ?? 'Описание курса недоступно.'}
                  </p>

                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      <span>{course?.modules_count ?? course?.modules?.length ?? 0} модулей</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      <span>Начат: {formatDate(enrollment.started_at)}</span>
                    </div>

                    {enrollment.last_lesson ? (
                      <div className="border border-border bg-muted/20 p-3 text-xs leading-5">
                        Последний урок: {enrollment.last_lesson.name}
                        {enrollment.last_lesson_block ? (
                          <span className="block text-muted-foreground">
                            Блок: {enrollment.last_lesson_block.name}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={continueHref ?? '/courses'}>
                      Продолжить
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageShell>
    </AppShell>
  );
}
