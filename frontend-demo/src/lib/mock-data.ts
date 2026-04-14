import { LESSONS } from "@/lib/constants";
import type { CommentItem, UserProfile } from "@/lib/types";

export const demoUser: UserProfile = {
  id: 1,
  name: "Said Student",
  email: "student@example.com",
  role: "student",
  bio: "Строит дипломный LMS-проект и изучает архитектуру Next.js frontend.",
};

export const demoComments: CommentItem[] = [
  {
    id: 1,
    author: "Mentor Bot",
    message: "Хорошая практика — не вызывать axios прямо в JSX, а выносить в отдельный API-слой.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 2,
    author: "Said Student",
    message: "Надо отдельно потренироваться на фильтрах и пагинации, это пригодится в дипломе.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

export function getLessonBySlug(slug: string) {
  return LESSONS.find((lesson) => lesson.slug === slug) ?? null;
}

export function getLessons() {
  return LESSONS;
}
