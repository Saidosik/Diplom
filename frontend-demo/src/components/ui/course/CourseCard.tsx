import { ArrowRight, BookOpen, CalendarDays, User } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Course } from '@/features/courses/types';

interface CourseCardProps {
  course: Course;
  hrefPrefix?: string;
  actionLabel?: string;
  hrefField?: 'slug' | 'id';
}

function formatDate(value: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatPrice(value: Course['price']) {
  const price = Number(value ?? 0);

  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
}

function statusLabel(status: Course['status']) {
  if (status === 'published') return 'Опубликован';
  if (status === 'hidden') return 'Скрыт';
  if (status === 'draft') return 'Черновик';
  if (status === 'on_moderation') return 'На проверке';
  if (status === 'banned') return 'Заблокирован';
  return status;
}

export function CourseCard({
  course,
  hrefPrefix = '/courses',
  actionLabel = 'Открыть курс',
  hrefField = 'slug',
}: CourseCardProps) {
  const hrefValue = hrefField === 'id' ? course.id : course.slug;
  const href = `${hrefPrefix}/${hrefValue}`;

  return (
    <Card className="h-full justify-between transition-colors hover:border-primary/40 hover:bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl leading-tight">
            <Link href={href} className="hover:text-primary">
              {course.name}
            </Link>
          </CardTitle>
          <StatusBadge tone={course.status === 'published' ? 'primary' : 'neutral'}>
            {statusLabel(course.status)}
          </StatusBadge>
        </div>
        <CardDescription className="font-mono text-xs">/{course.slug}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {course.description ?? 'Описание курса пока не заполнено.'}
        </p>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <span>{course.modules_count ?? course.modules?.length ?? 0} модулей</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>{course.author?.name ?? 'Автор не указан'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <p className="font-heading text-2xl font-semibold text-primary">{formatPrice(course.price)}</p>
          <Button asChild size="sm">
            <Link href={href}>
              {actionLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="gap-2 text-xs text-muted-foreground">
        <CalendarDays className="size-3" />
        <span>Создано: {formatDate(course.created_at)}</span>
      </CardFooter>
    </Card>
  );
}
