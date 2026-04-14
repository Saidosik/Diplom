import { apiClient } from "@/lib/api/client";
import type {
  CommentItem,
  LessonItem,
  LessonListResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/lib/types";

export async function login(payload: LoginRequest) {
  const response = await apiClient.post<LoginResponse>("/demo/login", payload);
  return response.data;
}

export async function logout() {
  await apiClient.post("/demo/logout");
}

export async function getProfile() {
  const response = await apiClient.get<UserProfile>("/demo/profile");
  return response.data;
}

export interface GetLessonsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: string;
  track?: string;
  signal?: AbortSignal;
}

export async function getLessons(params: GetLessonsParams) {
  const response = await apiClient.get<LessonListResponse>("/demo/lessons", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 4,
      search: params.search,
      level: params.level,
      track: params.track,
    },
    signal: params.signal,
  });

  return response.data;
}

export async function createComment(message: string) {
  const response = await apiClient.post<CommentItem>("/demo/comments", { message });
  return response.data;
}

export async function getLessonDetails(slug: string) {
  const response = await apiClient.get<LessonItem>(`/demo/lessons/${slug}`);
  return response.data;
}
