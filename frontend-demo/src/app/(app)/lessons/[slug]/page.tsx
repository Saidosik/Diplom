import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { getLessonBySlug } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils/format";

interface LessonDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Детали урока"
        title={lesson.title}
        description={lesson.excerpt}
      />

      <div className="grid-2">
        <Card>
          <div className="stack-sm">
            <h3>Метаданные</h3>
            <p><strong>Slug:</strong> {lesson.slug}</p>
            <p><strong>Сложность:</strong> {lesson.level}</p>
            <p><strong>Направление:</strong> {lesson.track}</p>
            <p><strong>Длительность:</strong> {formatDuration(lesson.durationMinutes)}</p>
          </div>
        </Card>

        <Card>
          <div className="stack-sm">
            <h3>Почему это полезно</h3>
            <p className="muted">
              Для диплома тебе почти наверняка понадобятся динамические страницы:
              курс, модуль, урок, задание, профиль пользователя.
            </p>
            <p className="muted">
              Этот пример показывает, как работает маршрут вида <code>/lessons/[slug]</code>.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="stack-sm">
          <h3>Идеи развития для диплома</h3>
          <ul>
            <li>добавить блоки урока;</li>
            <li>добавить прогресс пользователя;</li>
            <li>добавить AI-помощника справа;</li>
            <li>загрузку практического задания и результаты проверки.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
