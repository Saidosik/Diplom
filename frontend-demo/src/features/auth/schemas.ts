import z from "zod";

export const loginSchema = z.object({
    email: z.email({error: 'Введите корректную почту'}),
    password: z.string().min(8, 'Минимум 8 символов')
})

export const registerSchema = z.
object({
    name: z.string().min(2, 'Минимум 2 символа'),
    email: z.email({error: 'Введите корректную почту'}),
    password: z.string().min(8, 'Минимум 8 символов'),
    password_confirmation: z.string().min(8, 'Минимум 8 символов')
}).refine((data) => data.password === data.password_confirmation, {
    path:['password_confirmation'],
    message: "Пароли не совпадают"
})

export type loginSchema = z.infer<typeof loginSchema>
export type registerSchema = z.infer<typeof registerSchema>
