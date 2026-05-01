import axios from "axios";

const isServer = typeof window === 'undefined';

// На сервере Next.js можно сделать запрос к самому себе через внутренний хост или 127.0.0.1.
// Используем переменную окружения NEXT_PUBLIC_SITE_URL или http://localhost:3000 по умолчанию.
const serverBaseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const browserApi = axios.create({
    baseURL: isServer ? `${serverBaseURL}/api` : '/api',
    headers: {
        Accept: "application/json"
    }
});