'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, CheckCircle2, EyeOff, Loader2, Trash2 } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  deleteCourse,
  getMyCourseStructure,
  hideCourse,
  publishCourse,
} from '@/features/courses/api';
import type { Course } from '@/features/courses/types';
import { CourseBuilder } from './course-builder';

function statusLabel(status: Course['status']) {
  if (status === 'published') return 'Опубликован';
  if (status === 'hidden') return 'Скрыт';
  if (status === 'draft') return 'Черновик';
  if (status === 'on_moderation') return 'На проверке';
  if (status === 'banned') return 'Заблокирован';
  return status;
}

type CourseEditorClientProps = {
  courseId: string;
};

export function CourseEditorClient({ courseId }: CourseEditorClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const courseQuery = useQuery({
    queryKey: ['my-course-structure', courseId],
    queryFn: () => getMyCourseStructure(courseId),
    retry: false,
  });

  async function refreshCourse() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['my-course-structure', courseId] }),
      queryClient.invalidateQueries({ queryKey: ['my-courses'] }),
    ]);
  }

  const publishMutation = useMutation({
    mutationFn: () => publishCourse(courseId),
    onSuccess: refreshCourse,
  });

  const hideMutation = useMutation({
    mutationFn: () => hideCourse(courseId),
    onSuccess: refreshCourse,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      router.push('/studio/courses');
    },
  });

  const course = courseQuery.data;
  const modules = course?.modules ?? [];

  return (
    <AppShell>
      <PageShell className="max-w-[1600px]">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/studio/courses">
            <ArrowLeft className="size-4" />
            Назад к курсам автора
          </Link>
        </Button>

        {courseQuery.isLoading ? <LoadingState label="Загрузка конструктора курса..." /> : null}

        {courseQuery.isError ? (
          <ErrorState description="Не удалось загрузить курс. Проверь, что курс существует и принадлежит твоему аккаунту." />
        ) : null}

        {course ? (
          <>
            <PageHeader
              kicker="Studio / конструктор"
              title={course.name}
              description="Собирай курс как дерево: модули, уроки, блоки, теория, тесты, вопросы и ответы. Порядок можно менять drag-and-drop внутри одного уровня."
              actions={(
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/courses/${course.slug}`}>
                      <BookOpen className="size-4" />
                      Страница курса
                    </Link>
                  </Button>
                  {course.status === 'published' ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => hideMutation.mutate()}
                      disabled={hideMutation.isPending}
                    >
                      {hideMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <EyeOff className="size-4" />}
                      Скрыть
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => publishMutation.mutate()}
                      disabled={publishMutation.isPending}
                    >
                      {publishMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      Опубликовать
                    </Button>
                  )}
                </div>
              )}
            />

            <div className="mb-6 flex flex-wrap items-center gap-3 border border-border bg-card/60 p-4 text-sm text-muted-foreground">
              <StatusBadge tone={course.status === 'published' ? 'primary' : 'neutral'}>
                {statusLabel(course.status)}
              </StatusBadge>
              <span className="font-mono">/{course.slug}</span>
              <span>{modules.length} модулей</span>
              <span>Обновлено: {course.updated_at ? new Date(course.updated_at).toLocaleString('ru-RU') : '—'}</span>
            </div>

            <CourseBuilder course={course} courseId={courseId} />

            <Card className="mt-6 border-destructive/30 bg-destructive/5">
              <CardHeader className="border-b border-destructive/20">
                <CardTitle className="text-destructive">Опасная зона</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  Удаление курса выполняется через soft delete на backend. Курс пропадёт из Studio и публичного каталога.
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const confirmed = window.confirm('Удалить курс? Это действие скроет курс из Studio и каталога.');
                    if (confirmed) deleteMutation.mutate();
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  Удалить курс
                </Button>
              </CardContent>
            </Card>
          </>
        ) : null}
      </PageShell>
    </AppShell>
  );
}
