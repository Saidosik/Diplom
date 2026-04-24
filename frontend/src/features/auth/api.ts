import { browserApi } from "@/lib/http/browser";
import { AuthMeResponse, LoginDto, RegisterDto, User } from "./types";

export async function login(payload: LoginDto) {
    const response = await browserApi.post('/auth/login', payload)
    return response.data
}

export async function register(payload: RegisterDto) {
    const response = await browserApi.post('auth/register', payload)
    return response.data
}

export async function getMe(): Promise<User> {
    const response = await browserApi.get<AuthMeResponse>('/auth/me')
    return response.data.user
}

export async function logout() {
    const response = await browserApi.post('/auth/logout')
    return response.data
} 