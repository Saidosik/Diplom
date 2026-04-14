"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createComment } from "@/lib/api/demo";
import { formatRelativeTime } from "@/lib/utils/format";
import type { CommentItem } from "@/lib/types";

interface CommentComposerProps {
  initialComments: CommentItem[];
}

export function CommentComposer({ initialComments }: CommentComposerProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setError(null);
    setSubmitting(true);

    // Optimistic UI:
    // сначала показываем комментарий мгновенно,
    // а уже потом ждём подтверждение сервера.
    const optimisticComment: CommentItem = {
      id: Date.now(),
      author: "You",
      message: trimmed,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setMessage("");

    try {
      const savedComment = await createComment(trimmed);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === optimisticComment.id ? savedComment : comment
        )
      );
    } catch (error) {
      setComments((prev) => prev.filter((item) => item.id !== optimisticComment.id));
      setError(error instanceof Error ? error.message : "Не удалось отправить комментарий.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="stack-md">
        <div className="stack-sm">
          <h3>Optimistic UI: комментарии</h3>
          <p className="muted">
            Этот пример полезен для диплома: так можно мгновенно показывать сообщения,
            ответы AI-помощника или результаты действий пользователя.
          </p>
        </div>

        <textarea
          placeholder="Напиши комментарий или идею по дипломному интерфейсу..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
        />

        <div className="row gap-sm">
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Отправляем..." : "Отправить"}
          </Button>
          {error ? <p className="field-error">{error}</p> : null}
        </div>

        <div className="stack-sm">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="comment-box">
                  <div className="row between gap-sm wrap">
                    <strong>{comment.author}</strong>
                    <span className="muted">
                      {formatRelativeTime(comment.createdAt)}
                      {comment.optimistic ? " • локально" : ""}
                    </span>
                  </div>
                  <p>{comment.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
