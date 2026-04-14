import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { LESSONS } from "@/lib/constants";
import { formatDuration } from "@/lib/utils/format";
import Link from "next/link";

export default function LessonsPage() {
  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Уроки"
        title="Пример каталога уроков"
        description="Здесь данные получаются на сервере напрямую из mock-источника. Это хороший пример server component-страницы."
      />

      <div className="lessons-grid">
        {LESSONS.map((lesson) => (
          <Card key={lesson.id}>
            <div className="stack-sm">
              <div className="row between gap-sm wrap">
                <span className="badge">{lesson.track}</span>
                <span className="badge">{lesson.level}</span>
              </div>
              <h3>{lesson.title}</h3>
              <p className="muted">{lesson.excerpt}</p>
              <p>Длительность: {formatDuration(lesson.durationMinutes)}</p>
              <Link href={`/lessons/${lesson.slug}`} className="text-link">
                Открыть детально →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
