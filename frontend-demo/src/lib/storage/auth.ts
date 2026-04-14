import { DEMO_TOKEN } from "@/lib/constants";

const ACCESS_TOKEN_KEY = "demo_access_token";

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function hasDemoToken() {
  return getAccessToken() === DEMO_TOKEN;
}
