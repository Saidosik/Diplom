import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email."),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
