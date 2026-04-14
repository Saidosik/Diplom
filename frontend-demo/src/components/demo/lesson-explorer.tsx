"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLessons } from "@/lib/api/demo";
import { formatDuration } from "@/lib/utils/format";
import type { LessonItem, LessonListResponse } from "@/lib/types";

const emptyResponse: LessonListResponse = {
  items: [],
  meta: {
    page: 1,
    pageSize: 4,
    total: 0,
    totalPages: 1,
  },
};

export function LessonExplorer() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [track, setTrack] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LessonListResponse>(emptyResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    // Хорошая практика:
    // каждый новый запрос должен иметь возможность отменить старый,
    // иначе можно словить race condition.
    void (async () => {
      try {
        const response = await getLessons({
          page,
          pageSize: 4,
          search,
          level: level === "all" ? undefined : level,
          track: track === "all" ? undefined : track,
          signal: controller.signal,
        });
        setData(response);
      } catch (error) {
        if ((error as { name?: string }).name === "CanceledError") return;
        setError(error instanceof Error ? error.message : "Ошибка загрузки уроков.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [page, search, level, track]);

  useEffect(() => {
    setPage(1);
  }, [search, level, track]);

  const stats = useMemo(() => {
    const hardCount = data.items.filter((item) => item.level === "hard").length;
    const aiCount = data.items.filter((item) => item.track === "ai").length;
    return { hardCount, aiCount };
  }, [data.items]);

  return (
    <div className="stack-lg">
      <Card>
        <div className="filters-grid">
          <div className="field">
            <label htmlFor="search">Поиск по урокам</label>
            <input
              id="search"
              placeholder="Например: axios или ai"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="level">Сложность</label>
            <select id="level" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">Все</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="track">Направление</label>
            <select id="track" value={track} onChange={(event) => setTrack(event.target.value)}>
              <option value="all">Все</option>
              <option value="frontend">frontend</option>
              <option value="backend">backend</option>
              <option value="ai">ai</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="stats-grid">
        <Card>
          <p className="muted">Всего на странице</p>
          <h3>{data.items.length}</h3>
        </Card>
        <Card>
          <p className="muted">Сложных уроков</p>
          <h3>{stats.hardCount}</h3>
        </Card>
        <Card>
          <p className="muted">AI-уроков</p>
          <h3>{stats.aiCount}</h3>
        </Card>
      </div>

      {loading ? <p>Загрузка уроков...</p> : null}
      {error ? <p className="field-error">{error}</p> : null}

      <AnimatePresence mode="popLayout">
        <div className="lessons-grid">
          {data.items.map((lesson: LessonItem, index) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
            >
              <Card className="lesson-card">
                <div className="stack-sm">
                  <div className="row between gap-sm wrap">
                    <span className="badge">{lesson.track}</span>
                    <span className="badge">{lesson.level}</span>
                  </div>

                  <div className="stack-xs">
                    <h3>{lesson.title}</h3>
                    <p className="muted">{lesson.excerpt}</p>
                  </div>

                  <div className="row between gap-sm wrap">
                    <span>{formatDuration(lesson.durationMinutes)}</span>
                    <span>Прогресс: {lesson.progressPercent}%</span>
                  </div>

                  <div className="tag-row">
                    {lesson.tags.map((tag) => (
                      <span key={tag} className="tag-chip">#{tag}</span>
                    ))}
                  </div>

                  <Link href={`/lessons/${lesson.slug}`} className="text-link">
                    Открыть урок →
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="row between gap-sm wrap">
        <p className="muted">
          Страница {data.meta.page} из {data.meta.totalPages} • всего {data.meta.total}
        </p>

        <div className="row gap-sm">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || loading}
          >
            Назад
          </Button>
          <Button
            type="button"
            onClick={() => setPage((prev) => Math.min(data.meta.totalPages, prev + 1))}
            disabled={page >= data.meta.totalPages || loading}
          >
            Дальше
          </Button>
        </div>
      </div>
    </div>
  );
}
