import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { CommentComposer } from "@/components/demo/comment-composer";
import { LessonExplorer } from "@/components/demo/lesson-explorer";
import { ProfilePanel } from "@/components/demo/profile-panel";
import { demoComments } from "@/lib/mock-data";

export default function RequestsPage() {
  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Запросы"
        title="Axios, фильтры, пагинация и optimistic UI"
        description="Эта страница уже очень похожа на реальный рабочий модуль: тут есть несколько источников данных, клиентская логика и разделение ответственности."
      />

      <div className="grid-2">
        <ProfilePanel />
        <Card>
          <div className="stack-sm">
            <h3>На что смотри здесь</h3>
            <ul>
              <li>как отменяются запросы через AbortController;</li>
              <li>как фильтры и пагинация влияют на один endpoint;</li>
              <li>как optimistic UI даёт ощущение живого интерфейса;</li>
              <li>как типы ответа помогают не путаться в данных.</li>
            </ul>
          </div>
        </Card>
      </div>

      <LessonExplorer />
      <CommentComposer initialComments={demoComments} />
    </div>
  );
}
