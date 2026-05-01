'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AlertCircle, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Course, CoursePayload } from '@/features/courses/types';
import { cn } from '@/lib/utils/utils';

type CourseFormProps = {
  course?: Course;
  mode: 'create' | 'edit';
  isPending?: boolean;
  serverError?: string | null;
  onSubmit: (payload: CoursePayload) => void;
};

type FormErrors = Partial<Record<keyof CoursePayload, string>>;

const translitMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => translitMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function getApiErrorText(error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? 'Сервер вернул ошибку. Проверьте поля формы.';
  }

  return 'Не удалось сохранить курс. Проверьте данные и попробуйте ещё раз.';
}

function validate(payload: CoursePayload): FormErrors {
  const errors: FormErrors = {};

  if (payload.name.trim().length < 3) {
    errors.name = 'Название должно быть не короче 3 символов.';
  }

  if (!payload.slug.trim()) {
    errors.slug = 'Slug обязателен.';
  } else if (!/^[a-z0-9_-]+$/.test(payload.slug)) {
    errors.slug = 'Используйте латиницу, цифры, дефис или нижнее подчёркивание.';
  }

  if ((payload.description ?? '').length > 255) {
    errors.description = 'Описание должно быть не длиннее 255 символов.';
  }

  if (payload.price !== null && payload.price !== undefined && (!Number.isInteger(payload.price) || payload.price < 0)) {
    errors.price = 'Цена должна быть целым числом от 0.';
  }

  return errors;
}

export function CourseForm({ course, mode, isPending = false, serverError, onSubmit }: CourseFormProps) {
  const [name, setName] = useState(course?.name ?? '');
  const [slug, setSlug] = useState(course?.slug ?? '');
  const [description, setDescription] = useState(course?.description ?? '');
  const [price, setPrice] = useState(course?.price == null ? '' : String(course.price));
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  const payload = useMemo<CoursePayload>(() => ({
    name: name.trim(),
    slug: slug.trim(),
    description: description.trim() === '' ? null : description.trim(),
    price: price.trim() === '' ? null : Number(price),
  }), [description, name, price, slug]);

  const localServerError = serverError ?? null;

  function handleNameChange(value: string) {
    setName(value);

    if (!slugTouched && mode === 'create') {
      setSlug(slugify(value));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(payload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {localServerError ? (
        <div className="flex gap-3 border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{localServerError}</span>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="course-name">Название курса</Label>
        <Input
          id="course-name"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          placeholder="Например: Laravel для начинающих"
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError message={errors.name} />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="course-slug">Slug</Label>
          <button
            type="button"
            onClick={() => {
              setSlug(slugify(name));
              setSlugTouched(true);
            }}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Wand2 className="size-3" />
            Сгенерировать
          </button>
        </div>
        <Input
          id="course-slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(slugify(event.target.value));
          }}
          placeholder="laravel-dlya-nachinayushchih"
          aria-invalid={Boolean(errors.slug)}
        />
        <p className="text-xs text-muted-foreground">
          Используется в ссылках и должен быть уникальным. Лучше писать латиницей.
        </p>
        <FieldError message={errors.slug} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course-description">Краткое описание</Label>
        <textarea
          id="course-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Коротко объясните, чему научится студент. До 255 символов."
          rows={4}
          className={cn(
            'min-h-28 w-full border border-input bg-background/45 px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/35',
            errors.description ? 'border-destructive ring-2 ring-destructive/20' : null,
          )}
        />
        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
          <span>Описание видно в каталоге и на странице курса.</span>
          <span>{description.length}/255</span>
        </div>
        <FieldError message={errors.description} />
      </div>

      <div className="grid gap-2 sm:max-w-xs">
        <Label htmlFor="course-price">Цена, ₽</Label>
        <Input
          id="course-price"
          type="number"
          min={0}
          step={1}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="0"
          aria-invalid={Boolean(errors.price)}
        />
        <p className="text-xs text-muted-foreground">Оставьте пустым или укажите 0, если курс бесплатный.</p>
        <FieldError message={errors.price} />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          После создания курс будет скрыт. Опубликуйте его только когда структура, уроки и тесты готовы.
        </p>
        <Button type="submit" disabled={isPending} className="sm:min-w-40">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === 'create' ? 'Создать курс' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs text-destructive">{message}</p>;
}

export { getApiErrorText };
