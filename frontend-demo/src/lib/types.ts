export type LessonLevel = "easy" | "medium" | "hard";
export type LessonTrack = "frontend" | "backend" | "ai";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "student" | "mentor";
  bio: string;
}

export interface LessonItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  level: LessonLevel;
  track: LessonTrack;
  durationMinutes: number;
  progressPercent: number;
  tags: string[];
}

export interface LessonListResponse {
  items: LessonItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CommentItem {
  id: number;
  author: string;
  message: string;
  createdAt: string;
  optimistic?: boolean;
}

export interface ApiErrorPayload {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}
