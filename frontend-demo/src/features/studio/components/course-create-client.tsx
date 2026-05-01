'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCourse } from '@/features/courses/api';
import type { CoursePayload } from '@/features/courses/types';
import { CourseForm, getApiErrorText } from './course-form';

export function CourseCreateClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CoursePayload) => createCourse(payload),
    onSuccess: async (course) => {
      await queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      router.push(`/studio/courses/${course.id}`);
    },
  });

  return (
    <AppShell>
      <PageShell>
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/studio/courses">
            <ArrowLeft className="size-4" />
            Назад в Studio
          </Link>
        </Button>

        <PageHeader
          kicker="Studio / создание"
          title="Создание курса"
          description="Сначала создаётся скрытый курс. Затем в редакторе добавляются модули, уроки, теория и тесты. Такой порядок защищает каталог от пустых материалов."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <CourseForm
                mode="create"
                isPending={mutation.isPending}
                serverError={mutation.isError ? getApiErrorText(mutation.error) : null}
                onSubmit={(payload) => mutation.mutate(payload)}
              />
            </CardContent>
          </Card>

          <aside className="grid content-start gap-4">
            <div className="vector-panel p-4">
              <p className="font-heading text-sm uppercase tracking-[0.18em] text-primary">Правильный сценарий</p>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
                <li><span className="text-foreground">1.</span> Создать скрытый курс.</li>
                <li><span className="text-foreground">2.</span> Добавить структуру: модули и уроки.</li>
                <li><span className="text-foreground">3.</span> Наполнить блоки теорией и тестами.</li>
                <li><span className="text-foreground">4.</span> Проверить UX прохождения.</li>
                <li><span className="text-foreground">5.</span> Опубликовать курс.</li>
              </ol>
            </div>

            <div className="border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-primary">
              ИИ-функции для автора позже будут помогать улучшать описание, генерировать черновики теории и проверять качество вопросов.
            </div>
          </aside>
        </div>
      </PageShell>
    </AppShell>
  );
}
