import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function FormsPage() {
  return (
    <div className="container stack-lg">
      <PageTitle
        eyebrow="Формы"
        title="Что здесь изучать"
        description="Основной пример формы находится на странице логина. Это сделано специально: логин — самый понятный кейс, с которого легко начать."
      />

      <div className="grid-2">
        <Card>
          <div className="stack-sm">
            <h3>Что уже реализовано</h3>
            <ul>
              <li>react-hook-form</li>
              <li>zod schema</li>
              <li>разделение client UI и API-слоя</li>
              <li>понятная обработка ошибок</li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="stack-sm">
            <h3>Что тебе стоит добавить самому</h3>
            <ul>
              <li>форму создания курса;</li>
              <li>форму создания lesson block;</li>
              <li>форму профиля;</li>
              <li>многошаговую форму для AI-настроек курса.</li>
            </ul>
          </div>
        </Card>
      </div>

      <Card>
        <div className="stack-sm">
          <h3>Почему форма логина хороша как стартовый пример</h3>
          <p className="muted">
            Потому что ты сразу видишь полный цикл: поля, валидация, отправка,
            ответ сервера, сохранение токена, redirect и защита маршрутов.
          </p>
        </div>
      </Card>
    </div>
  );
}
