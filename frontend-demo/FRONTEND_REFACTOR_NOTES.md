# Frontend refactor notes — Вектор

## Что изменено

### 1. Новый визуальный фундамент

- Переписан `src/app/globals.css` под графитную тему.
- Убраны лишние скругления в базовых компонентах.
- Обновлены `Button`, `Card`, `Input` под строгий стиль: тонкие линии, тёмные панели, холодный акцент.
- Добавлены базовые системные компоненты:
  - `AppShell`
  - `PageShell`
  - `PageHeader`
  - `EmptyState`
  - `ErrorState`
  - `LoadingState`
  - `StatusBadge`
  - `ProgressLine`

### 2. Новая навигация

Обновлён `AppHeader`:

- `/courses` — публичный каталог
- `/learn` — моё обучение
- `/studio` — кабинет автора
- `/me/profile` — профиль
- `/admin` — админка для администратора
- `/ai` — описание ИИ-функций

Старые маршруты сохранены как редиректы:

- `/me` → `/me/profile`
- `/me/learning` → `/learn`
- `/me/courses` → `/studio/courses`

### 3. Новый student flow

Добавлены маршруты:

- `/learn`
- `/learn/courses/[courseId]`
- `/learn/courses/[courseId]/lessons/[lessonId]`

Обновлены ссылки продолжения обучения: теперь основной путь ведёт через `/learn/courses/...`.

### 4. Страница урока

Обновлена страница прохождения урока:

- слева структура курса;
- в центре текущий блок урока;
- справа заготовка `AiAssistantPanel`;
- верхний степпер блоков;
- переходы между блоками через новый learning route.

### 5. Каталог и страница курса

Обновлены:

- `/courses`
- `/courses/[slug]`
- `CourseCard`
- `CourseStructure`
- `ProgressSummary`

Страница курса теперь ближе к Stepik-логике: описание, стоимость, автор, структура, прогресс, действие «начать/продолжить обучение», комментарии.

### 6. Studio

Добавлены маршруты:

- `/studio`
- `/studio/courses`
- `/studio/courses/create`
- `/studio/courses/[courseId]`

Это заготовка кабинета автора. Она уже показывает авторские курсы через существующий endpoint `/api/my/courses`, но создание самого курса требует backend endpoint `POST /api/my/courses`.

### 7. Профиль и настройки

Добавлены:

- `/me/profile`
- `/me/settings`

Подключены frontend-функции для:

- отображения расширенного `UserResource`;
- обновления имени/email;
- загрузки аватара;
- удаления аватара;
- повторной отправки письма подтверждения email;
- удаления аккаунта.

### 8. ИИ-раздел

Добавлен `/ai` как продуктовая заготовка под будущие ИИ-функции:

- ИИ-наставник;
- подсказки без списывания;
- RAG по материалам курса;
- помощь автору.

### 9. Proxy улучшен под avatar upload

`src/app/api/laravel/[...path]/route.ts` обновлён для передачи `multipart/form-data` через Next proxy.

## Что осталось сделать дальше

### Backend

1. Добавить CRUD курса автора:
   - `POST /api/my/courses`
   - `PATCH /api/my/courses/{course}`
   - `DELETE /api/my/courses/{course}`
   - `POST /api/my/courses/{course}/publish`

2. Исправить backend-блокеры:
   - `StoreQuestionRequest::authorize()`;
   - миграция `course_tags.down()`;
   - индекс `user_answers`;
   - `answers.unique(question_id)`;
   - enum-синхронизация.

### Frontend

1. Реализовать полноценный `StudioCourseEditor`.
2. Добавить формы создания/редактирования модулей, уроков, блоков и тестов.
3. Подключить `admin/users`.
4. Реализовать настоящий ИИ-чат в `AiAssistantPanel`.
5. Добавить мобильную адаптацию learning workspace.

## Проверка

В этой среде не удалось выполнить полноценный `npm run lint`/`next build`, потому что архив не содержит `node_modules`, а установка зависимостей недоступна. После распаковки у себя нужно выполнить:

```bash
npm install
npm run lint
npm run build
```
