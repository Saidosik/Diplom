'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Reply } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMeQuery } from '@/features/auth/hooks';
import {
  createCourseComment,
  createLessonBlockComment,
  getCourseComments,
  getLessonBlockComments,
  replyToComment,
} from '../api';
import type { CourseComment } from '../types';

type CommentTarget =
  | { type: 'course'; slug: string }
  | { type: 'lesson-block'; blockId: number };

function commentsQueryKey(target: CommentTarget) {
  return target.type === 'course'
    ? ['comments', 'course', target.slug]
    : ['comments', 'lesson-block', target.blockId];
}

function CommentForm({
  label,
  placeholder,
  isPending,
  onSubmit,
}: {
  label: string;
  placeholder: string;
  isPending: boolean;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        className="min-h-24 w-full border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      <Button type="submit" disabled={isPending || !text.trim()}>
        Отправить
      </Button>
    </form>
  );
}

function CommentItem({
  comment,
  depth = 0,
  canReply,
}: {
  comment: CourseComment;
  depth?: number;
  canReply: boolean;
}) {
  const [isReplyOpen, setReplyOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (text: string) => replyToComment(comment.id, text),
    onSuccess: async () => {
      toast.success('Ответ добавлен');
      setReplyOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => toast.error('Не удалось отправить ответ'),
  });

  return (
    <div className="border border-border bg-background/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{comment.user?.name ?? 'Пользователь'}</p>
        <p className="text-xs text-muted-foreground">
          {comment.created_at ? new Date(comment.created_at).toLocaleString('ru-RU') : ''}
        </p>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {comment.content?.text}
      </p>

      {depth === 0 && canReply ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 px-0"
          onClick={() => setReplyOpen((value) => !value)}
        >
          <Reply className="size-4" />
          Ответить
        </Button>
      ) : null}

      {isReplyOpen ? (
        <div className="mt-3 border-l border-border pl-3">
          <CommentForm
            label="Ответ"
            placeholder="Напишите ответ..."
            isPending={mutation.isPending}
            onSubmit={async (text) => {
              await mutation.mutateAsync(text);
            }}
          />
        </div>
      ) : null}

      {comment.replies?.length ? (
        <div className="mt-4 space-y-3 border-l border-border pl-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} canReply={canReply} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Comments({ target }: { target: CommentTarget }) {
  const queryClient = useQueryClient();
  const { data: user } = useMeQuery();
  const key = commentsQueryKey(target);

  const query = useQuery({
    queryKey: key,
    queryFn: () =>
      target.type === 'course'
        ? getCourseComments(target.slug)
        : getLessonBlockComments(target.blockId),
  });

  const createMutation = useMutation({
    mutationFn: (text: string) =>
      target.type === 'course'
        ? createCourseComment(target.slug, text)
        : createLessonBlockComment(target.blockId, text),
    onSuccess: async () => {
      toast.success('Комментарий добавлен');
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: () => toast.error('Не удалось добавить комментарий'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Комментарии
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {user ? (
          <CommentForm
            label="Новый комментарий"
            placeholder="Напишите комментарий..."
            isPending={createMutation.isPending}
            onSubmit={async (text) => {
              await createMutation.mutateAsync(text);
            }}
          />
        ) : (
          <div className="border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Чтобы оставить комментарий, нужно войти в аккаунт.
          </div>
        )}

        {query.isLoading ? <p className="text-sm text-muted-foreground">Загрузка комментариев...</p> : null}
        {query.isError ? <p className="text-sm text-destructive">Не удалось загрузить комментарии.</p> : null}
        {!query.isLoading && !query.data?.length ? (
          <p className="text-sm text-muted-foreground">Комментариев пока нет.</p>
        ) : null}

        <div className="space-y-3">
          {query.data?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} canReply={Boolean(user)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
