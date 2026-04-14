# С чего начать разбор

## 1. Открой проект и посмотри архитектуру

Сначала просто походи по папкам:
- `src/app`
- `src/components`
- `src/lib`

Смысл такой:
- `app` — маршруты;
- `components` — переиспользуемые части интерфейса;
- `lib` — утилиты, API, валидация, типы;
- `app/api` — моковые серверные обработчики.

## 2. Разбери логин

Файлы:
- `src/app/login/page.tsx`
- `src/components/demo/login-form.tsx`
- `src/app/api/demo/login/route.ts`
- `src/lib/api/client.ts`
- `src/lib/storage/auth.ts`

Тут ты увидишь связку:
форма -> axios -> route handler -> cookie/token -> redirect.

## 3. Разбери страницу запросов

Файлы:
- `src/app/(app)/demo/requests/page.tsx`
- `src/components/demo/lesson-explorer.tsx`
- `src/components/demo/profile-panel.tsx`
- `src/components/demo/comment-composer.tsx`
- `src/app/api/demo/lessons/route.ts`
- `src/app/api/demo/comments/route.ts`

Тут есть уже более близкий к боевому код:
- фильтрация;
- пагинация;
- отмена запроса;
- типизация ответа;
- optimistic UI.

## 4. Разбери анимации

Файл:
- `src/components/demo/animation-showcase.tsx`

Посмотри отдельно:
- stagger animation;
- `AnimatePresence`;
- `layoutId`;
- анимацию модалки.

## 5. Попробуй сам переделать

Минимальные упражнения:
1. Добавь новый пункт меню.
2. Добавь новый фильтр в уроки.
3. Сделай отдельную страницу профиля.
4. Замени mock lessons на данные из Laravel позже.

## Главное

Не пытайся сразу запомнить всё.
Сначала пойми, **зачем файл существует** и **какую ответственность несёт**.
