'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMeQuery } from '@/features/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Comments } from './comments';
import { ContentRenderer } from './content-renderer';
import { TestBlock } from './test-block';
import { getLessonLearning, openLessonBlock } from '../api';
import type { LessonBlock } from '../types';

function LessonBlockCard({ block, lessonId, canTrackProgress }: { block: LessonBlock; lessonId: number; canTrackProgress: boolean }) {
  const queryClient = useQueryClient();
  const openMutation = useMutation({
    mutationFn: () => openLessonBlock(block.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      await queryClient.invalidateQueries({ queryKey: ['course-progress'] });
    },
  });

  useEffect(() => {
    if (canTrackProgress) {
      openMutation.mutate();
    }
    // Открытие нужно выполнить один раз на конкретный блок.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id, canTrackProgress]);

  return (
    <Card id={`block-${block.id}`}>
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{block.name}</CardTitle>
            {block.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
            ) : null}
          </div>
          <span className="border border-border bg-muted/20 px-2 py-1 text-xs text-muted-foreground">
            {block.type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {block.type === 'theory' ? (
          block.contents?.length ? (
            block.contents.map((item) => <ContentRenderer key={item.id} item={item} />)
          ) : (
            <p className="text-sm text-muted-foreground">В этом блоке пока нет теоретического контента.</p>
          )
        ) : null}

        {block.type === 'test' ? (
          block.test ? (
            <TestBlock test={block.test} lessonId={lessonId} canSubmit={canTrackProgress} />
          ) : (
            <p className="text-sm text-muted-foreground">Тест для этого блока пока не настроен.</p>
          )
        ) : null}

        {block.type === 'coding_task' ? (
          <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Практические задачи с проверкой кода backend уже предусматривает, но пользовательский интерфейс для них лучше добавить отдельным этапом.
          </div>
        ) : null}

        <Comments target={{ type: 'lesson-block', blockId: block.id }} />
      </CardContent>
    </Card>
  );
}

export function LessonLearningClient({ lessonId }: { lessonId: number }) {
  const { data: user } = useMeQuery();
  const query = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonLearning(lessonId),
  });

  if (query.isLoading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-10">
        <p className="text-sm text-muted-foreground">Загрузка урока...</p>
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-10">
        <div className="border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Не удалось загрузить урок.
        </div>
      </main>
    );
  }

  const lesson = query.data;
  const blocks = lesson.lesson_blocks ?? [];

  return (
    <main className="container mx-auto min-h-screen px-4 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Обучение</p>
          <h1 className="font-heading text-3xl font-semibold tracking-wide md:text-5xl">{lesson.name}</h1>
          {lesson.description ? <p className="mt-3 max-w-3xl text-muted-foreground">{lesson.description}</p> : null}
        </div>
        <Button asChild variant="outline">
          <Link href="/courses">К каталогу</Link>
        </Button>
      </div>

      {!blocks.length ? (
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">В уроке пока нет открытых блоков.</CardContent>
        </Card>
      ) : null}

      <div className="space-y-6">
        {blocks.map((block) => (
          <LessonBlockCard key={block.id} block={block} lessonId={lesson.id} canTrackProgress={Boolean(user)} />
        ))}
      </div>
    </main>
  );
}
