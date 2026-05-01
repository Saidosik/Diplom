'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, HelpCircle, Loader2, RotateCcw, Send, XCircle } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ProgressLine } from '@/components/ui/progress-line';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils/utils';
import { submitTest } from '../api';
import type { Question, SubmitTestPayload, Test, TestAttempt } from '../types';

function getText(content: Record<string, unknown>): string {
  const value = content.text ?? content.title ?? content.body ?? content.value ?? '';
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

type SelectedAnswers = Record<number, number | number[]>;

function buildPayload(questions: Question[], selected: SelectedAnswers): SubmitTestPayload {
  return {
    answers: questions.map((question) => {
      const value = selected[question.id];

      if (question.type === 'multiple') {
        return {
          question_id: question.id,
          content: {
            answer_option_ids: Array.isArray(value) ? value : [],
          },
        };
      }

      return {
        question_id: question.id,
        content: {
          answer_option_id: typeof value === 'number' ? value : 0,
        },
      };
    }),
  };
}

function isQuestionAnswered(question: Question, selected: SelectedAnswers): boolean {
  const value = selected[question.id];

  if (question.type === 'multiple') {
    return Array.isArray(value) && value.length > 0;
  }

  return typeof value === 'number' && value > 0;
}

function questionTypeLabel(question: Question) {
  return question.type === 'multiple' ? 'Несколько ответов' : 'Один ответ';
}

export function TestBlock({
  test,
  lessonId,
  courseId,
  courseSlug,
  canSubmit,
}: {
  test: Test;
  lessonId: number;
  courseId?: number;
  courseSlug?: string;
  canSubmit: boolean;
}) {
  const [selected, setSelected] = useState<SelectedAnswers>({});
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const queryClient = useQueryClient();
  const questions = test.questions ?? [];

  const answeredCount = useMemo(
    () => questions.filter((question) => isQuestionAnswered(question, selected)).length,
    [questions, selected],
  );

  const resultByQuestionId = useMemo(() => {
    const map = new Map<number, NonNullable<TestAttempt['user_answers']>[number]>();

    for (const answer of attempt?.user_answers ?? []) {
      map.set(answer.question_id, answer);
    }

    return map;
  }, [attempt]);

  const allAnswered = questions.length > 0 && answeredCount === questions.length;
  const scorePercent = attempt?.max_score
    ? Math.round(((attempt.score ?? 0) / attempt.max_score) * 100)
    : 0;

  const mutation = useMutation({
    mutationFn: (payload: SubmitTestPayload) => submitTest(test.id, payload),
    onSuccess: async (data) => {
      setAttempt(data);

      if (data.status === 'passed') {
        toast.success('Тест пройден. Блок засчитан.');
      } else {
        toast.error('Есть ошибки. Исправьте ответы и попробуйте снова.');
      }

      await queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      await queryClient.invalidateQueries({ queryKey: ['my-learning'] });

      if (courseId) {
        await queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] });
      }

      if (courseSlug) {
        await queryClient.invalidateQueries({ queryKey: ['course-enrollment', courseSlug] });
      }
    },
    onError: () => toast.error('Не удалось отправить тест'),
  });

  function handleSingle(questionId: number, optionId: number) {
    setSelected((current) => ({ ...current, [questionId]: optionId }));
  }

  function handleMultiple(questionId: number, optionId: number, checked: boolean) {
    setSelected((current) => {
      const previous = current[questionId];
      const ids = Array.isArray(previous) ? previous : [];
      return {
        ...current,
        [questionId]: checked ? [...ids, optionId] : ids.filter((id) => id !== optionId),
      };
    });
  }

  function resetAttempt() {
    setAttempt(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      toast.error('Для прохождения теста нужно войти в аккаунт');
      return;
    }

    if (!allAnswered) {
      toast.error('Ответьте на все вопросы перед проверкой');
      return;
    }

    await mutation.mutateAsync(buildPayload(questions, selected));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border bg-background/45 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
              <HelpCircle className="size-4" />
              Проверочное задание
            </div>
            <p className="font-heading text-xl font-semibold tracking-wide">{test.name}</p>
            {test.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {test.description}
              </p>
            ) : null}
          </div>

          <StatusBadge tone={allAnswered ? 'success' : 'neutral'}>
            {answeredCount}/{questions.length} ответов
          </StatusBadge>
        </div>

        <div className="mt-4">
          <ProgressLine value={questions.length ? (answeredCount / questions.length) * 100 : 0} className="h-1.5" />
        </div>
      </div>

      {!questions.length ? (
        <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          В тесте пока нет вопросов. Автор курса должен настроить вопросы в Studio.
        </div>
      ) : null}

      {questions.map((question, index) => {
        const result = resultByQuestionId.get(question.id);
        const isCorrect = result?.status === 'correct';
        const isIncorrect = result?.status === 'not_correct';

        return (
          <section
            key={question.id}
            className={cn(
              'border bg-background/40 p-4 transition-colors',
              result ? 'border-border' : 'border-border',
              isCorrect && 'border-emerald-400/45 bg-emerald-400/5',
              isIncorrect && 'border-destructive/45 bg-destructive/5',
            )}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="border border-border bg-card px-2 py-1">Вопрос {index + 1}</span>
                  <span>{questionTypeLabel(question)}</span>
                </div>
                <p className="text-base font-medium leading-7">{getText(question.content)}</p>
              </div>

              {result ? (
                <StatusBadge tone={isCorrect ? 'success' : 'danger'}>
                  {isCorrect ? 'Верно' : 'Неверно'}
                </StatusBadge>
              ) : null}
            </div>

            <div className="space-y-2">
              {question.answer_options?.map((option) => {
                const optionText = getText(option.content);
                const name = `question-${question.id}`;

                if (question.type === 'multiple') {
                  const value = selected[question.id];
                  const checked = Array.isArray(value) && value.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 border border-border bg-muted/10 p-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5',
                        checked && 'border-primary/45 bg-primary/10 text-primary',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => handleMultiple(question.id, option.id, event.target.checked)}
                        className="mt-1 accent-current"
                      />
                      <span className="leading-6 text-foreground/90">{optionText}</span>
                    </label>
                  );
                }

                const checked = selected[question.id] === option.id;

                return (
                  <label
                    key={option.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 border border-border bg-muted/10 p-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5',
                      checked && 'border-primary/45 bg-primary/10 text-primary',
                    )}
                  >
                    <input
                      type="radio"
                      name={name}
                      checked={checked}
                      onChange={() => handleSingle(question.id, option.id)}
                      className="mt-1 accent-current"
                    />
                    <span className="leading-6 text-foreground/90">{optionText}</span>
                  </label>
                );
              })}
            </div>

            {result ? (
              <div className="mt-4 flex items-start gap-2 border border-border bg-background/45 p-3 text-sm">
                {isCorrect ? (
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-300" />
                ) : (
                  <XCircle className="mt-0.5 size-4 text-destructive" />
                )}
                <p className="leading-6 text-muted-foreground">
                  {isCorrect
                    ? 'Ответ засчитан. Продолжайте в том же темпе.'
                    : 'Ответ не совпал с эталоном. Пересмотрите материал выше и попробуйте снова.'}
                </p>
              </div>
            ) : null}
          </section>
        );
      })}

      {!canSubmit ? (
        <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          Чтобы отправить тест и записать прогресс, нужно войти в аккаунт.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card/60 p-4">
        <div className="text-sm text-muted-foreground">
          {attempt ? (
            <span>
              Результат: <span className="text-foreground">{attempt.score} из {attempt.max_score}</span>
            </span>
          ) : (
            <span>Проверьте ответы после выбора всех вариантов.</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {attempt && attempt.status !== 'passed' ? (
            <Button type="button" variant="outline" onClick={resetAttempt}>
              <RotateCcw className="size-4" />
              Исправить
            </Button>
          ) : null}

          <Button type="submit" disabled={mutation.isPending || !questions.length || !canSubmit || !allAnswered}>
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Проверить
          </Button>
        </div>
      </div>

      {attempt ? (
        <div className="border border-border bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-medium">
              {attempt.status === 'passed' ? 'Тест пройден' : 'Тест пока не пройден'}
            </p>
            <StatusBadge tone={attempt.status === 'passed' ? 'success' : 'danger'}>
              {scorePercent}%
            </StatusBadge>
          </div>
          <ProgressLine value={scorePercent} className="h-2" />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {attempt.status === 'passed'
              ? 'Все ответы верные. Блок автоматически засчитан как пройденный.'
              : 'Есть неверные ответы. Измените выбор и отправьте тест повторно.'}
          </p>
        </div>
      ) : null}
    </form>
  );
}
