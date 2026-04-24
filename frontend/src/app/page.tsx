export default function HomePage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-20">
      <section className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.35em] text-primary">
          Образовательная платформа
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Вектор
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Учебная платформа для прохождения курсов, практических заданий и
          проверки решений в реальном времени.
        </p>
      </section>
    </main>
  );
}