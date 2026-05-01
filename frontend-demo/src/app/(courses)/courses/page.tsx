'use client';

import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { CourseCard } from '@/components/ui/course/CourseCard';
import { Input } from '@/components/ui/input';
import { getCourses } from '@/features/courses/api';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'created_at' | 'price'>('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      sort,
      direction,
      per_page: 24,
    }),
    [direction, search, sort],
  );

  const query = useQuery({
    queryKey: ['courses', queryParams],
    queryFn: () => getCourses(queryParams),
  });

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Каталог"
          title="Курсы платформы"
          description="Выберите курс, изучите структуру, запишитесь и продолжайте обучение в рабочем пространстве с прогрессом, тестами, комментариями и ИИ-помощником."
        />

        <section className="vector-panel mb-8 grid gap-3 p-4 lg:grid-cols-[1fr_170px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по названию курса"
              className="pl-9"
            />
          </div>

          <label className="relative">
            <span className="sr-only">Сортировка</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as 'name' | 'created_at' | 'price')}
              className="h-9 w-full border border-input bg-background/45 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/35"
            >
              <option value="name">По названию</option>
              <option value="created_at">По дате</option>
              <option value="price">По цене</option>
            </select>
          </label>

          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value as 'asc' | 'desc')}
            className="h-9 border border-input bg-background/45 px-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/35"
          >
            <option value="asc">Возрастание</option>
            <option value="desc">Убывание</option>
          </select>
        </section>

        {query.isLoading ? <LoadingState label="Загрузка курсов..." /> : null}

        {query.isError ? (
          <ErrorState description="Проверьте, что Laravel API запущен и адрес указан в .env.local." />
        ) : null}

        {!query.isLoading && !query.data?.length ? (
          <EmptyState title="Курсы не найдены" description="Попробуйте изменить поисковый запрос или параметры сортировки." />
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((course) => <CourseCard key={course.slug} course={course} />)}
        </div>
      </PageShell>
    </AppShell>
  );
}
