import Link from 'next/link';
import { ArrowRight, Bot, Braces, ChartNoAxesColumnIncreasing, GraduationCap, ShieldCheck } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Структурированное обучение',
    description: 'Курсы разбиты на модули, уроки и блоки: теория, тесты, практика и обсуждения.',
    icon: GraduationCap,
  },
  {
    title: 'Практика и прогресс',
    description: 'Каждый блок имеет состояние: открыт, пройден или требует повторной попытки.',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: 'ИИ-наставник',
    description: 'Помощник объясняет материал проще, даёт подсказки и разбирает ошибки без прямой выдачи ответа.',
    icon: Bot,
  },
  {
    title: 'Кабинет автора',
    description: 'Studio готовится как единый конструктор курсов, уроков, теории, тестов и заданий.',
    icon: Braces,
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mx-auto">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="vector-kicker">Образовательная платформа нового типа</p>
            <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-wide md:text-7xl">
              Вектор — курсы, практика и ИИ-наставник в одной среде
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Платформа для изучения программирования: каталог курсов, учебное пространство,
              проверочные задания, прогресс, комментарии и помощь искусственного интеллекта.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/courses">
                Смотреть курсы
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/studio">Открыть Studio</Link>
            </Button>
          </div>

          <div className="grid max-w-2xl grid-cols-3 border border-border bg-card/70 text-center text-sm">
            <div className="border-r border-border p-4">
              <p className="font-heading text-2xl text-primary">01</p>
              <p className="mt-1 text-muted-foreground">Каталог</p>
            </div>
            <div className="border-r border-border p-4">
              <p className="font-heading text-2xl text-primary">02</p>
              <p className="mt-1 text-muted-foreground">Уроки</p>
            </div>
            <div className="p-4">
              <p className="font-heading text-2xl text-primary">03</p>
              <p className="mt-1 text-muted-foreground">ИИ</p>
            </div>
          </div>
        </div>

        <div className="vector-panel p-5">
          <div className="border border-border bg-background/50 p-5">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary">Lesson workspace</p>
                <p className="mt-2 font-heading text-2xl font-semibold">Основы Laravel</p>
              </div>
              <ShieldCheck className="size-8 text-primary" />
            </div>

            <div className="grid gap-3">
              {['Теория: маршруты и контроллеры', 'Тест: HTTP-методы', 'ИИ: объясни проще'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 border border-border bg-card/80 p-3 text-sm">
                  <span className="grid size-7 place-items-center border border-primary/30 bg-primary/10 font-mono text-xs text-primary">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-16 mx-auto">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-3 grid size-10 place-items-center border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
