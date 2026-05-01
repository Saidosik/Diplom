import { loginSchema } from "@/features/auth/schemas";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";
import { buildAccessTokenCookieOptions } from "@/lib/auth/cookies";
import createLaravelApi from "@/lib/http/laravel";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
    const rawBody = await request.json().catch(() => null);

    const parsed = loginSchema.safeParse(rawBody);

    if (!parsed.success) {
        return NextResponse.json(
            {
                message: 'Ошибка валидации',
                errors: z.flattenError(parsed.error),
            },
            { status: 422 }
        );
    }

    const body = parsed.data;

    try {
        const laravel = createLaravelApi();
        const response = await laravel.post('/login', {
            email: body.email,
            password: body.password,
        })

        const token = response.data?.access_token ?? response.data?.token;
        const expiresIn = response.data?.expires_in

        if (!token) {
            return NextResponse.json(
                { message: 'Сервер не вернул токен' },
                { status: 500 }
            )
        }

        const result = NextResponse.json({ ok: true })

        result.cookies.set(
            ACCESS_TOKEN_COOKIE,
            token,
            buildAccessTokenCookieOptions(expiresIn),
        )
        return result
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { message: error.response?.data?.message ?? 'Не удалось выполнить вход' },
                { status: error.response?.status ?? 500 }
            )
        }

        return NextResponse.json(
            { message: 'Внутренняя ошибка сервера' },
            { status: 500 },
        );
    }
}
