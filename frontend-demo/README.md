# Diploma Next.js Starter

Учебный проект для разбора **Next.js App Router** на практике.

Внутри есть:
- структура, похожая на реальный дипломный фронтенд;
- `axios`-слой с интерсепторами;
- `framer-motion` для анимаций;
- формы через `react-hook-form` + `zod`;
- mock backend через **Route Handlers** (`src/app/api/...`);
- примеры **server components** и **client components**;
- middleware для примитивной защиты маршрутов;
- много комментариев в коде.

## Что изучать по порядку

1. `src/app/layout.tsx` — корневой layout и глобальные стили.
2. `src/app/(app)/layout.tsx` — общий shell приложения.
3. `src/lib/api/client.ts` — как настраивать axios instance.
4. `src/app/api/demo/*` — как выглядят mock endpoint'ы в Next.js.
5. `src/components/demo/login-form.tsx` — форма логина.
6. `src/components/demo/lesson-explorer.tsx` — поисковая выдача, фильтры, пагинация, отмена запроса.
7. `src/components/demo/animation-showcase.tsx` — сложные примеры анимаций.
8. `src/middleware.ts` — базовая защита маршрутов.

## Что важно понять

### 1) Server Component vs Client Component
- **Server Component** хорош для начальной загрузки, SEO, прямого чтения данных на сервере.
- **Client Component** нужен, когда есть `useState`, `useEffect`, формы, анимации, работа с браузерным API.

### 2) Почему API-слой вынесен отдельно
Плохая практика — писать `axios.get(...)` прямо в компоненте в десяти местах.
Лучше держать всё в одном месте:
- единый `baseURL`;
- единая обработка ошибок;
- единые заголовки;
- единые типы.

### 3) Почему mock backend полезен
Для диплома ты сможешь сначала быстро собрать фронт без готового Laravel backend, а потом заменить route handlers на реальные API-эндпоинты.

## Маршруты
- `/login` — логин
- `/` — главная
- `/demo/forms` — формы и валидация
- `/demo/requests` — axios, фильтры, пагинация, optimistic UI
- `/demo/animations` — framer-motion
- `/lessons` — список уроков
- `/lessons/[slug]` — пример динамического маршрута

## Как запустить

```bash
npm install
npm run dev
```

Открой:

```bash
http://localhost:3000
```

## Тестовый вход

```txt
email: student@example.com
password: password123
```

## Что можно улучшить дальше
- добавить TanStack Query;
- подключить реальный backend Laravel;
- заменить mock auth на JWT / cookies;
- вынести UI-компоненты в отдельную дизайн-систему;
- добавить тесты на формы и API-слой;
- подключить editor для уроков диплома.
