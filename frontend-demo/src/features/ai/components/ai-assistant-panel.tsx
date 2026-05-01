'use client';

import { Bot, Lightbulb, MessageSquareText, Send, Sparkles, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AiAssistantPanelProps = {
  courseName?: string | null;
  lessonName?: string | null;
  blockName?: string | null;
  blockType?: string | null;
};

const actions = [
  { key: 'simple', label: 'Объясни проще', icon: Lightbulb },
  { key: 'example', label: 'Дай пример', icon: Sparkles },
  { key: 'check', label: 'Проверь понимание', icon: MessageSquareText },
  { key: 'hint', label: 'Дай подсказку', icon: Wand2 },
] as const;

function buildDraftResponse(action: string, lessonName?: string | null, blockName?: string | null) {
  const target = blockName ? `блоку «${blockName}»` : lessonName ? `уроку «${lessonName}»` : 'текущему материалу';

  if (action === 'simple') {
    return `Черновик запроса к ИИ: объяснить проще по ${target}, без лишней теории и с пошаговым разбором.`;
  }

  if (action === 'example') {
    return `Черновик запроса к ИИ: подобрать практический пример по ${target}, желательно из веб-разработки.`;
  }

  if (action === 'check') {
    return `Черновик запроса к ИИ: задать 2-3 контрольных вопроса по ${target}, чтобы проверить понимание.`;
  }

  return `Черновик запроса к ИИ: дать аккуратную подсказку по ${target}, не раскрывая готовый ответ.`;
}

export function AiAssistantPanel({ courseName, lessonName, blockName, blockType }: AiAssistantPanelProps) {
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<string | null>(null);

  const contextLines = useMemo(
    () => [
      courseName ? `Курс: ${courseName}` : null,
      lessonName ? `Урок: ${lessonName}` : null,
      blockName ? `Блок: ${blockName}` : null,
      blockType ? `Тип: ${blockType}` : null,
    ].filter(Boolean),
    [blockName, blockType, courseName, lessonName],
  );

  function handleAction(action: string) {
    setDraft(buildDraftResponse(action, lessonName, blockName));
  }

  function handleSubmit() {
    const text = message.trim();

    if (!text) return;

    setDraft(`Черновик запроса к ИИ: «${text}». После подключения Laravel AI SDK этот текст уйдёт вместе с контекстом текущего урока.`);
    setMessage('');
  }

  return (
    <Card className="bg-card/80">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Bot className="size-5 text-primary" />
          ИИ-наставник
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="border border-primary/30 bg-primary/10 p-3 text-sm leading-6 text-primary">
          Интерфейс уже готов к подключению AI SDK/RAG. Сейчас панель показывает безопасные черновики запросов, чтобы сценарий был понятен до backend-интеграции.
        </div>

        {contextLines.length ? (
          <div className="space-y-1 border border-border bg-background/35 p-3 text-xs leading-5 text-muted-foreground">
            {contextLines.map((line) => <p key={line}>{line}</p>)}
          </div>
        ) : null}

        <div className="grid gap-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.key}
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => handleAction(action.key)}
              >
                <Icon className="size-4" />
                {action.label}
              </Button>
            );
          })}
        </div>

        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Спросите по текущему уроку..."
            className="min-h-24 w-full resize-none border border-input bg-background/45 px-3 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <Button type="button" variant="outline" className="w-full" onClick={handleSubmit}>
            <Send className="size-4" />
            Подготовить запрос
          </Button>
        </div>

        {draft ? (
          <div className="border border-border bg-muted/20 p-3 text-xs leading-6 text-muted-foreground">
            {draft}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
