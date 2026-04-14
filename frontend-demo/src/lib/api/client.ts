import axios from "axios";
import { normalizeApiError } from "@/lib/api/errors";
import { getAccessToken } from "@/lib/storage/auth";

// Один настроенный instance лучше, чем десятки axios.get(...) по всему проекту.
// Здесь удобно централизованно управлять:
// 1) baseURL
// 2) токеном
// 3) обработкой ошибок
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // В реальном проекте здесь обычно кладут JWT access token.
  // Для демо мы используем токен из localStorage.
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Очень полезно нормализовать ошибки в один формат.
    // Тогда UI не будет угадывать, что именно пришло из axios.
    return Promise.reject(normalizeApiError(error));
  }
);
