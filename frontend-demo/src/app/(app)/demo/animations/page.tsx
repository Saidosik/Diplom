import { AnimationShowcase } from "@/components/demo/animation-showcase";
import { PageTitle } from "@/components/ui/page-title";

export default function AnimationsPage() {
  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Анимации"
        title="Framer Motion: полезные UX-сценарии"
        description="В дипломе анимации лучше использовать не ради красоты, а чтобы подчёркивать состояние интерфейса, смену режима, открытие панелей и результаты действий."
      />

      <AnimationShowcase />
    </div>
  );
}
