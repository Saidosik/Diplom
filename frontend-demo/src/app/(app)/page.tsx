import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { PageTitle } from "@/components/ui/page-title";

const featureCards = [
  {
    title: "Архитектура App Router",
    description: "Layout, route groups, loading, error, динамические маршруты.",
  },
  {
    title: "Axios API layer",
    description: "Отдельный клиент, интерсепторы, нормализация ошибок.",
  },
  {
    title: "Framer Motion",
    description: "Анимации, которые можно перенести в дипломный интерфейс.",
  },
  {
    title: "Формы и валидация",
    description: "React Hook Form + Zod с понятной структурой.",
  },
];

export default function HomePage() {
  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Главная"
        title="Учебный фронтенд-шаблон для диплома"
        description="Это не просто Hello World, а маленькая архитектурная база, на которой удобно учиться и переносить идеи в реальный LMS-проект."
      />

      <div className="hero-grid">
        <FadeIn>
          <Card>
            <div className="stack-md">
              <h2>Что здесь тренировать</h2>
              <div className="feature-list">
                <div className="feature-item">Как делить код на server/client компоненты.</div>
                <div className="feature-item">Как строить API-слой так, чтобы потом легко подключить Laravel backend.</div>
                <div className="feature-item">Как делать формы, фильтры и списки без хаоса.</div>
                <div className="feature-item">Как использовать анимации там, где они реально улучшают UX.</div>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <div className="stack-sm">
              <h3>Куда смотреть дальше</h3>
              <Link className="text-link" href="/demo/forms">Открыть формы →</Link>
              <Link className="text-link" href="/demo/requests">Открыть запросы →</Link>
              <Link className="text-link" href="/demo/animations">Открыть анимации →</Link>
              <Link className="text-link" href="/lessons">Открыть уроки →</Link>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="grid-2">
        {featureCards.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.06}>
            <Card>
              <div className="stack-sm">
                <span className="badge">блок {index + 1}</span>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
