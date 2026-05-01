import type { ReactNode } from 'react';
import { AlertTriangle, ExternalLink, Info, Lightbulb, Play, ShieldAlert, TerminalSquare } from 'lucide-react';

import type { LessonBlockContent } from '../types';

function pickText(content: Record<string, unknown>): string {
  const value = content.text ?? content.title ?? content.body ?? content.value ?? content.code ?? '';

  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';

  return JSON.stringify(value, null, 2);
}

function pickUrl(content: Record<string, unknown>): string {
  const value = content.url ?? content.href ?? content.link ?? content.src ?? '';
  return typeof value === 'string' ? value : '';
}

function pickLanguage(content: Record<string, unknown>): string {
  const value = content.language ?? content.lang ?? '';
  return typeof value === 'string' ? value : '';
}

function normalizeVideoUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
}

function Callout({
  title,
  text,
  tone,
  icon,
}: {
  title: string;
  text: string;
  tone: 'primary' | 'warning' | 'danger' | 'muted';
  icon: ReactNode;
}) {
  const toneClasses: Record<'primary' | 'warning' | 'danger' | 'muted', string> = {
    primary: 'border-primary/35 bg-primary/10 text-primary',
    warning: 'border-amber-300/35 bg-amber-300/10 text-amber-200',
    danger: 'border-destructive/40 bg-destructive/10 text-destructive',
    muted: 'border-border bg-muted/25 text-muted-foreground',
  };

  return (
    <div className={`border p-4 ${toneClasses[tone]}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{text}</p>
    </div>
  );
}

export function ContentRenderer({ item }: { item: LessonBlockContent }) {
  const text = pickText(item.content);
  const url = pickUrl(item.content);
  const language = pickLanguage(item.content);

  if (item.type === 'heading') {
    return (
      <div className="space-y-2 border-l-2 border-primary pl-4">
        <p className="vector-kicker">Раздел</p>
        <h2 className="font-heading text-2xl font-semibold tracking-wide md:text-3xl">
          {text}
        </h2>
      </div>
    );
  }

  if (item.type === 'warning') {
    return (
      <Callout
        title="Внимание"
        text={text}
        tone="warning"
        icon={<AlertTriangle className="size-4" />}
      />
    );
  }

  if (item.type === 'danger') {
    return (
      <Callout
        title="Критически важно"
        text={text}
        tone="danger"
        icon={<ShieldAlert className="size-4" />}
      />
    );
  }

  if (item.type === 'important') {
    return (
      <Callout
        title="Важно"
        text={text}
        tone="primary"
        icon={<Info className="size-4" />}
      />
    );
  }

  if (item.type === 'clue') {
    return (
      <Callout
        title="Подсказка"
        text={text}
        tone="muted"
        icon={<Lightbulb className="size-4" />}
      />
    );
  }

  if (item.type === 'example') {
    return (
      <div className="overflow-hidden border border-border bg-background/70">
        <div className="flex items-center justify-between border-b border-border bg-muted/25 px-4 py-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.18em]">
            <TerminalSquare className="size-3.5 text-primary" />
            Пример
          </span>
          {language ? <span>{language}</span> : null}
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-7 text-foreground">
          <code>{text}</code>
        </pre>
      </div>
    );
  }

  if (item.type === 'link') {
    const href = url || text;

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex max-w-full items-center gap-2 border border-primary/35 bg-primary/10 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <span className="truncate">{text || url}</span>
        <ExternalLink className="size-4 shrink-0" />
      </a>
    );
  }

  if (item.type === 'video') {
    const embedUrl = normalizeVideoUrl(url);

    return (
      <div className="overflow-hidden border border-border bg-background/70">
        <div className="flex items-center gap-2 border-b border-border bg-muted/25 px-4 py-3 text-sm font-medium">
          <Play className="size-4 text-primary" />
          {text || 'Видео урока'}
        </div>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={text || 'Видео урока'}
            className="aspect-video w-full bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <p className="p-4 text-sm leading-6 text-muted-foreground">
            Для видео не указан корректный адрес.
          </p>
        )}
      </div>
    );
  }

  if (item.type === 'text') {
    return (
      <div className="max-w-none whitespace-pre-wrap text-base leading-8 text-foreground/88">
        {text}
      </div>
    );
  }

  return (
    <div className="border border-border bg-muted/20 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {item.type}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
