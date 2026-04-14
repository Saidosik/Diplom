"use client";

// Этот компонент должен выполняться на клиенте,
// потому что здесь используются:
// - useState
// - useRouter
// - useSearchParams
// - useForm
// То есть всё, что связано с интерактивностью браузера.

import { zodResolver } from "@hookform/resolvers/zod";
// Позволяет связать Zod-схему с react-hook-form.
// Благодаря этому валидация формы будет идти через loginSchema.

import { useRouter, useSearchParams } from "next/navigation";
// useRouter — для программного перехода на другую страницу после логина.
// useSearchParams — чтобы прочитать query-параметры из URL, например redirect=/profile.

import { useState } from "react";
// useState здесь нужен для хранения сообщения об ошибке с сервера.

import { useForm } from "react-hook-form";
// Главный хук для работы с формой:
// регистрация полей, обработка submit, ошибки, loading-состояние и т.д.

import { motion } from "framer-motion";
// motion нужен для анимации формы при появлении.

import { Button } from "@/components/ui/button";
// Переиспользуемая UI-кнопка.
// Хорошая практика — не писать стили кнопки прямо в форме,
// а вынести кнопку в отдельный компонент.

import { login } from "@/lib/api/demo";
// Отдельная функция для HTTP-запроса на логин.
// Хорошая практика — не писать fetch/axios прямо внутри компонента,
// а выносить API-логику отдельно.

import { saveAccessToken } from "@/lib/storage/auth";
// Функция для сохранения токена авторизации.
// Например, в localStorage, sessionStorage или cookie — зависит от реализации.

import { loginSchema, type LoginSchema } from "@/lib/validators/auth";
// loginSchema — схема валидации формы.
// LoginSchema — TypeScript-тип, который выводится из схемы.
// Это удобно: форма и валидация используют одну и ту же структуру данных.

export function LoginForm() {
  // Хук для навигации между страницами.
  const router = useRouter();

  // Получаем query-параметры из адресной строки.
  const searchParams = useSearchParams();

  // Если в URL есть ?redirect=/somewhere — после логина перейдём туда.
  // Если параметра нет, отправляем пользователя на главную страницу.
  const redirectTo = searchParams.get("redirect") || "/";

  // Локальное состояние для ошибок, которые пришли не от валидации формы,
  // а, например, от сервера: "неверный пароль", "пользователь не найден" и т.д.
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  // Инициализация формы.
  const {
    register, // связывает input с react-hook-form
    handleSubmit, // обёртка для корректной отправки формы
    formState: { errors, isSubmitting }, // ошибки валидации и состояние отправки
  } = useForm<LoginSchema>({
    // Подключаем Zod-схему как механизм валидации.
    resolver: zodResolver(loginSchema),

    // Значения по умолчанию.
    // Для демо удобно, для реального продакшн-логина обычно не заполняют.
    defaultValues: {
      email: "student@example.com",
      password: "password123",
    },
  });

  // handleSubmit сам:
  // 1. запускает валидацию
  // 2. если всё ок — вызывает async callback
  // 3. если нет — кладёт ошибки в formState.errors
  const onSubmit = handleSubmit(async (values) => {
    // Перед новой попыткой входа очищаем старое серверное сообщение.
    setServerMessage(null);

    try {
      // Вызываем API-функцию логина.
      // values уже типизированы как LoginSchema.
      const data = await login(values);

      // Сохраняем токен после успешного входа.
      saveAccessToken(data.token);

      // Перенаправляем пользователя туда, куда он хотел попасть.
      router.push(redirectTo);

      // Просим Next.js обновить текущие данные/дерево маршрута.
      // Это полезно, если UI зависит от факта авторизации.
      router.refresh();
    } catch (error) {
      // Если сервер вернул ошибку — показываем её пользователю.
      // Проверяем, что это действительно объект Error.
      setServerMessage(
        error instanceof Error ? error.message : "Не удалось выполнить вход."
      );
    }
  });

  return (
    <motion.form
      className="stack-md"
      onSubmit={onSubmit}
      // Стартовое состояние анимации:
      // форма чуть ниже и прозрачная
      initial={{ opacity: 0, y: 16 }}
      // Конечное состояние:
      // форма на месте и полностью видима
      animate={{ opacity: 1, y: 0 }}
      // Длительность анимации
      transition={{ duration: 0.35 }}
    >
      <div className="field">
        <label htmlFor="email">Email</label>

        {/* 
          register("email") связывает этот input с react-hook-form.
          Теперь библиотека знает:
          - значение поля
          - когда оно изменилось
          - как его валидировать
        */}
        <input id="email" type="email" {...register("email")} />

        {/* 
          Если для email есть ошибка валидации —
          показываем текст ошибки.
        */}
        {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="password">Пароль</label>

        {/* Поле пароля тоже регистрируем в форме */}
        <input id="password" type="password" {...register("password")} />

        {/* Показываем ошибку валидации пароля, если она есть */}
        {errors.password ? (
          <p className="field-error">{errors.password.message}</p>
        ) : null}
      </div>

      {/* 
        Это уже не ошибка схемы, а ошибка уровня сервера/API.
        Например: неправильные учётные данные.
      */}
      {serverMessage ? <p className="field-error">{serverMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {/* 
          isSubmitting автоматически становится true,
          пока async submit не завершился.
          Это удобно для блокировки повторной отправки.
        */}
        {isSubmitting ? "Входим..." : "Войти в демо"}
      </Button>

      <div className="helper-box">
        <p><strong>Тестовый пользователь:</strong> student@example.com</p>
        <p><strong>Пароль:</strong> password123</p>
        <p>
          Обрати внимание: здесь форма типизирована, валидируется через Zod и
          не знает деталей HTTP-клиента.
        </p>
      </div>
    </motion.form>
  );
}