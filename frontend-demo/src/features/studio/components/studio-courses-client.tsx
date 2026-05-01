'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Settings2 } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/ui/course/CourseCard';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { getMyCourses } from '@/features/courses/api';

export function StudioCoursesClient() {
  const query = useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
    retry: false,
  });

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Studio"
          title="Кабинет автора"
          description="Создавайте и сопровождайте курсы: структура, уроки, блоки теории, тесты, публикация и будущая AI-помощь для автора."
          actions={(
            <Button asChild>
              <Link href="/studio/courses/create">
                <Plus className="size-4" />
                Создать курс
              </Link>
            </Button>
          )}
        />

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="vector-panel p-4">
            <p className="font-heading text-2xl text-primary">01</p>
            <p className="mt-2 font-medium">Структура</p>
            <p className="mt-1 text-sm text-muted-foreground">Модули, уроки, блоки и порядок прохождения.</p>
          </div>
          <div className="vector-panel p-4">
            <p className="font-heading text-2xl text-primary">02</p>
            <p className="mt-2 font-medium">Контент</p>
            <p className="mt-1 text-sm text-muted-foreground">Теория, видео, примеры, предупреждения, тесты.</p>
          </div>
          <div className="vector-panel p-4">
            <p className="font-heading text-2xl text-primary">03</p>
            <p className="mt-2 font-medium">Публикация</p>
            <p className="mt-1 text-sm text-muted-foreground">Проверка готовности и вывод курса в каталог.</p>
          </div>
        </div>

        {query.isLoading ? <LoadingState label="Загрузка авторских курсов..." /> : null}

        {query.isError ? (
          <ErrorState description="Не удалось загрузить ваши курсы. Возможно, нужно войти в аккаунт заново." />
        ) : null}

        {!query.isLoading && !query.data?.length ? (
          <EmptyState
            title="У вас пока нет созданных курсов"
            description="Создайте первый курс, затем добавьте структуру, уроки, теорию, тесты и опубликуйте его в каталоге."
            action={(
              <Button asChild variant="outline">
                <Link href="/studio/courses/create">
                  <Settings2 className="size-4" />
                  Создать курс
                </Link>
              </Button>
            )}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((course) => (
            <CourseCard key={course.id} course={course} hrefPrefix="/studio/courses" hrefField="id" actionLabel="Редактировать" />
          ))}
        </div>
      </PageShell>
    </AppShell>
  );
}
