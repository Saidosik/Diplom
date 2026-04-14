import { cookies } from "next/headers";
// Функция для работы с cookies на сервере в Next.js App Router.
// Здесь мы будем записывать cookie после успешного входа.

import { NextResponse } from "next/server";
// Специальный объект ответа Next.js.
// Удобен для возврата JSON, статусов и заголовков.

import { DEMO_TOKEN } from "@/lib/constants";
// Константа с демо-токеном.
// В учебном проекте это просто заранее заданное значение.

import { demoUser } from "@/lib/mock-data";
// Мок-данные пользователя.
// То есть не из базы данных, а из подготовленного файла.

export async function POST(request: Request) {
  // Это route handler для POST-запроса.
  // Когда клиент отправляет POST на этот endpoint,
  // Next.js вызывает эту функцию.

  const body = (await request.json()) as { email?: string; password?: string };
  // Читаем JSON-тело запроса.
  // Ожидаем объект с полями email и password.
  //
  // "as { ... }" здесь просто говорит TypeScript,
  // какую структуру мы ожидаем увидеть.
  //
  // Но важно понимать:
  // это не настоящая валидация, а только подсказка для TypeScript.
  // Если клиент пришлёт что угодно, runtime сам это не проверит.

  // Искусственная задержка полезна в учебных проектах:
  // так лучше видно состояния загрузки.
  await new Promise((resolve) => setTimeout(resolve, 700));
  // Здесь специально делаем паузу 700 мс.
  // Это помогает увидеть:
  // - состояние isSubmitting на фронте
  // - loading-индикаторы
  // - блокировку кнопки на время запроса
  //
  // В реальном проекте такую задержку обычно не делают.

  if (body.email !== "student@example.com" || body.password !== "password123") {
    // Простая учебная проверка логина/пароля.
    // Если email ИЛИ password не совпадают с ожидаемыми —
    // возвращаем ошибку авторизации.

    return NextResponse.json(
      { message: "Неверный email или пароль." },
      { status: 401 }
    );
    // Возвращаем JSON с сообщением об ошибке и HTTP-статус 401.
    //
    // 401 = Unauthorized
    // Это правильный статус, когда данные для входа неверные.
  }

  const cookieStore = await cookies();
  // Получаем объект для работы с cookies.
  // В актуальном App Router cookies() используется на сервере.

  cookieStore.set("demo_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  // Записываем cookie "demo_session=active".
  //
  // Разберём параметры:
  //
  // httpOnly: true
  // JavaScript на клиенте не сможет прочитать эту cookie.
  // Это хорошо для безопасности.
  //
  // sameSite: "lax"
  // Частичная защита от CSRF.
  // Для большинства обычных сценариев это хороший дефолт.
  //
  // secure: false
  // Cookie будет работать и по http.
  // Для локального демо это нормально.
  // В продакшене обычно должно быть true.
  //
  // path: "/"
  // Cookie доступна на всём сайте.
  //
  // maxAge: 60 * 60 * 8
  // Cookie живёт 8 часов.

  return NextResponse.json({
    token: DEMO_TOKEN,
    user: demoUser,
  });
  // Если логин успешный — возвращаем JSON-ответ.
  //
  // token: демо-токен
  // user: данные пользователя
  //
  // Фронтенд потом может:
  // - сохранить token
  // - положить пользователя в state
  // - обновить UI как "авторизованный"
}