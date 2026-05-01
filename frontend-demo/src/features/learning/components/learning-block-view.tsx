import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Code2, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Comments } from '@/features/courses/components/comments';
import { ContentRenderer } from '@/features/courses/components/content-renderer';
import { TestBlock } from '@/features/courses/components/test-block';
import type { LessonBlock } from '@/features/courses/types';
import type { LearningStep } from '@/features/learning/utils';

function blockTypeLabel(block: LessonBlock): string {
  if (block.type === 'theory') return 'Теория';
  if (block.type === 'test') return 'Тест';
  if (block.type === 'coding_task') return 'Практика';
  return block.type;
}

function BlockTypeIcon({ block }: { block: LessonBlock }) {
  if (block.type === 'test') return <HelpCircle className="size-4" />;
  if (block.type === 'coding_task') return <Code2 className="size-4" />;

  return <FileText className="size-4" />;
}

export function LearningBlockView({
  block,
  lessonId,
  courseId,
  courseSlug,
  previousStep,
  nextStep,
  canTrackProgress,
}: {
  block: LessonBlock;
  lessonId: number;
  courseId?: number;
  courseSlug?: string;
  previousStep?: LearningStep | null;
  nextStep?: LearningStep | null;
  canTrackProgress: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card className="overflow-visible">
        <CardHeader className="border-b border-border bg-card/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge tone="primary" className="gap-1.5">
                  <BlockTypeIcon block={block} />
                  {blockTypeLabel(block)}
                </StatusBadge>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Учебный блок
                </span>
              </div>
              <CardTitle className="font-heading text-2xl tracking-wide md:text-3xl">
                {block.name}
              </CardTitle>
              {block.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {block.description}
                </p>
              ) : null}
            </div>

            <Button type="button" variant="outline" size="sm" disabled title="Будет подключено на AI backend этапе">
              <Bot className="size-4" />
              ИИ-помощь
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {block.type === 'theory' ? (
            block.contents?.length ? (
              <div className="space-y-6">
                {block.contents.map((item) => <ContentRenderer key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                В этом блоке пока нет теоретического контента.
              </div>
            )
          ) : null}

          {block.type === 'test' ? (
            block.test ? (
              <TestBlock
                test={block.test}
                lessonId={lessonId}
                courseId={courseId}
                courseSlug={courseSlug}
                canSubmit={canTrackProgress}
              />
            ) : (
              <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Тест для этого блока пока не настроен.
              </div>
            )
          ) : null}

          {block.type === 'coding_task' ? (
            <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <Code2 className="size-4 text-primary" />
                Практическая задача
              </div>
              Интерфейс для проверки кода лучше добавить отдельным этапом: редактор кода, запуск,
              отправка решения, история попыток и результаты тестов.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 border border-border bg-card/60 p-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          {previousStep ? (
            <Button asChild variant="outline">
              <Link href={previousStep.href}>
                <ArrowLeft className="size-4" />
                Предыдущий блок
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Это первый доступный блок.</p>
          )}
        </div>

        <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <CheckCircle2 className="size-4 text-primary" />
          Учебный маршрут
        </div>

        <div className="flex justify-start md:justify-end">
          {nextStep ? (
            <Button asChild>
              <Link href={nextStep.href}>
                Следующий блок
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <div className="border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              Это последний блок курса.
            </div>
          )}
        </div>
      </div>

      <Comments target={{ type: 'lesson-block', blockId: block.id }} />
    </div>
  );
}
