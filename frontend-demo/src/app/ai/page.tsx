import { Bot, BrainCircuit, MessageSquareText, ShieldCheck } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const items = [
  {
    title: 'ИИ-наставник в уроке',
    description: 'Правая панель получает контекст курса, урока и текущего блока.',
    icon: Bot,
  },
  {
    title: 'Подсказки без списывания',
    description: 'После неверного ответа ИИ должен объяснять ошибку, но не отдавать готовый ответ.',
    icon: ShieldCheck,
  },
  {
    title: 'RAG по материалам курса',
    description: 'Следующий backend-этап: pgvector и извлечение контекста из lesson block content.',
    icon: BrainCircuit,
  },
  {
    title: 'Помощь автору',
    description: 'Генерация черновиков теории, вопросов, вариантов ответа и описаний курса.',
    icon: MessageSquareText,
  },
];

export default function AiPage() {
  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="AI"
          title="ИИ-функции платформы"
          description="Раздел фиксирует продуктовую идею ИИ в проекте. Рабочая интеграция будет подключаться к Laravel AI SDK и контексту уроков."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-3 grid size-10 place-items-center border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageShell>
    </AppShell>
  );
}
