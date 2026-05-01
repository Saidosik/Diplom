'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bot, Layers3, User } from 'lucide-react';
import Link from 'next/link';

import { AppShell } from '@/components/layout/app-shell';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useMeQuery } from '@/features/auth/hooks';
import { getCourseProgress, getCourseStructure } from '../api';
import { Comments } from './comments';
import { CourseLearningAction } from './course-learning-action';
import { CourseStructure } from './course-structure';
import { ProgressSummary } from './progress-summary';

function formatPrice(value: unknown) {
  const price = Number(value ?? 0);
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
}

export function CourseDetailClient({ slug }: { slug: string }) {
  const { data: user } = useMeQuery();

  const courseQuery = useQuery({
    queryKey: ['course-structure', slug],
    queryFn: () => getCourseStructure(slug),
  });

  const progressQuery = useQuery({
    queryKey: ['course-progress', courseQuery.data?.id],
    queryFn: () => getCourseProgress(courseQuery.data?.id ?? 0),
    enabled: Boolean(user && courseQuery.data?.id),
    retry: false,
  });

  if (courseQuery.isLoading) {
    return (
      <AppShell>
        <PageShell>
          <LoadingState label="Загрузка курса..." />
        </PageShell>
      </AppShell>
    );
  }

  if (courseQuery.isError || !courseQuery.data) {
    return (
      <AppShell>
        <PageShell>
          <ErrorState title="Курс не найден" description="Курс не существует, скрыт или недоступен для просмотра." />
        </PageShell>
      </AppShell>
    );
  }

  const course = courseQuery.data;

  return (
    <AppShell>
      <PageShell>
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/courses">
            <ArrowLeft className="size-4" />
            Назад к каталогу
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="vector-panel p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <StatusBadge tone="primary">Курс</StatusBadge>
                <StatusBadge>{course.status}</StatusBadge>
                <StatusBadge>{course.modules_count ?? course.modules?.length ?? 0} модулей</StatusBadge>
              </div>

              <h1 className="font-heading text-3xl font-semibold tracking-wide md:text-6xl">
                {course.name}
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
                {course.description ?? 'Описание курса пока не заполнено.'}
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <div className="border border-border bg-background/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Стоимость</p>
                  <p className="mt-2 font-heading text-2xl text-primary">{formatPrice(course.price)}</p>
                </div>
                <div className="border border-border bg-background/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Автор</p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <User className="size-4 text-primary" />
                    {course.author?.name ?? 'Автор не указан'}
                  </p>
                </div>
                <div className="border border-border bg-background/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">ИИ</p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <Bot className="size-4 text-primary" />
                    Наставник в уроках
                  </p>
                </div>
              </div>
            </div>

            <CourseStructure course={course} progress={progressQuery.data ?? null} />
            <Comments target={{ type: 'course', slug }} />
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="space-y-5 pt-4">
                <div className="border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground">Начните с первого доступного урока или продолжите с места остановки.</p>
                </div>
                <CourseLearningAction course={course} />
                <ProgressSummary progress={progressQuery.data ?? null} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Layers3 className="size-4 text-primary" />
                  Что внутри
                </div>
                <p>Модули, уроки, теоретические блоки, тесты, комментарии и подготовленная область для ИИ-подсказок.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </PageShell>
    </AppShell>
  );
}
