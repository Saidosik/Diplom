'use client';

import { useMemo, useState } from 'react';
import type * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileQuestion,
  FileText,
  GripVertical,
  Layers3,
  Loader2,
  MoreHorizontal,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils/utils';
import {
  createAnswerOption,
  createLesson,
  createLessonBlock,
  createLessonBlockContent,
  createModule,
  createQuestion,
  createTest,
  deleteAnswerOption,
  deleteLesson,
  deleteLessonBlock,
  deleteLessonBlockContent,
  deleteModule,
  deleteQuestion,
  deleteTest,
  updateAnswerOption,
  updateCourse,
  updateLesson,
  updateLessonBlock,
  updateLessonBlockContent,
  updateModule,
  updateQuestion,
  updateTest,
  upsertAnswer,
} from '@/features/courses/api';
import type {
  AnswerOption,
  Course,
  CourseModule,
  CoursePayload,
  Lesson,
  LessonBlock,
  LessonBlockContent,
  LessonBlockContentType,
  LessonBlockType,
  Question,
  QuestionType,
  Test,
  VisibilityStatus,
} from '@/features/courses/types';
import { CourseForm, getApiErrorText } from './course-form';

const visibilityOptions: Array<{ value: VisibilityStatus; label: string }> = [
  { value: 'off', label: 'Скрыт' },
  { value: 'visible', label: 'Виден' },
];

const blockTypeOptions: Array<{ value: LessonBlockType; label: string; description: string }> = [
  { value: 'theory', label: 'Теория', description: 'Текст, видео, примеры, подсказки.' },
  { value: 'test', label: 'Тест', description: 'Вопросы с одним или несколькими ответами.' },
  { value: 'coding_task', label: 'Код', description: 'Заготовка под будущие задачи с проверкой кода.' },
];

const contentTypeOptions: Array<{ value: LessonBlockContentType; label: string }> = [
  { value: 'heading', label: 'Заголовок' },
  { value: 'text', label: 'Текст' },
  { value: 'important', label: 'Важно' },
  { value: 'warning', label: 'Предупреждение' },
  { value: 'danger', label: 'Опасность' },
  { value: 'clue', label: 'Подсказка' },
  { value: 'example', label: 'Пример / код' },
  { value: 'video', label: 'Видео' },
  { value: 'link', label: 'Ссылка' },
];

const questionTypeOptions: Array<{ value: QuestionType; label: string }> = [
  { value: 'single', label: 'Один правильный ответ' },
  { value: 'multiple', label: 'Несколько правильных ответов' },
];

type BuilderTarget =
  | { mode: 'edit'; kind: 'course' }
  | { mode: 'edit'; kind: 'module' | 'lesson' | 'block' | 'content' | 'test' | 'question' | 'option'; id: number }
  | { mode: 'create'; kind: 'module'; parentId: number | string }
  | { mode: 'create'; kind: 'lesson' | 'block' | 'content' | 'test' | 'question' | 'option'; parentId: number };

type DragKind = 'module' | 'lesson' | 'block' | 'content' | 'question' | 'option';

type DragPayload = {
  kind: DragKind;
  parentId: number | string;
  id: number;
};

type CourseBuilderProps = {
  course: Course;
  courseId: string;
};

function textFromContent(content: Record<string, unknown> | undefined): string {
  const value = content?.text ?? content?.title ?? content?.body ?? content?.value ?? content?.code ?? '';
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function urlFromContent(content: Record<string, unknown> | undefined): string {
  const value = content?.url ?? content?.href ?? content?.link ?? '';
  return typeof value === 'string' ? value : '';
}

function sortByOrder<T extends { sort_order: number | null; id: number }>(items: T[] = []) {
  return [...items].sort((a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id));
}

function moveItem<T extends { id: number }>(items: T[], sourceId: number, targetId: number): T[] {
  const sourceIndex = items.findIndex((item) => item.id === sourceId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [removed] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, removed);
  return next;
}

function statusTone(status: VisibilityStatus) {
  return status === 'visible' ? 'primary' : 'neutral';
}

function blockTypeLabel(type: LessonBlockType) {
  return blockTypeOptions.find((option) => option.value === type)?.label ?? type;
}

function contentTypeLabel(type: LessonBlockContentType) {
  return contentTypeOptions.find((option) => option.value === type)?.label ?? type;
}

function singleCorrectOptionId(question: Question): number {
  return Number(question.answer?.content?.answer_option_id ?? 0);
}

function multipleCorrectOptionIds(question: Question): number[] {
  const value = question.answer?.content?.answer_option_ids;
  return Array.isArray(value) ? value.map(Number) : [];
}

function isCorrectOption(question: Question, optionId: number): boolean {
  if (question.type === 'single') {
    return singleCorrectOptionId(question) === optionId;
  }

  return multipleCorrectOptionIds(question).includes(optionId);
}

export function CourseBuilder({ course, courseId }: CourseBuilderProps) {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<BuilderTarget>({ mode: 'edit', kind: 'course' });
  const [savingLabel, setSavingLabel] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const modules = useMemo(() => sortByOrder(course.modules ?? []), [course.modules]);
  const lookup = useMemo(() => buildLookup(modules), [modules]);

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['my-course-structure', courseId] }),
      queryClient.invalidateQueries({ queryKey: ['my-courses'] }),
    ]);
  }

  async function run(label: string, action: () => Promise<unknown>, successMessage: string) {
    setSavingLabel(label);
    try {
      await action();
      await refresh();
      toast.success(successMessage);
    } catch (error) {
      toast.error(getApiErrorText(error));
    } finally {
      setSavingLabel(null);
    }
  }

  async function handleDrop(payload: DragPayload, targetPayload: DragPayload) {
    setDragOverKey(null);

    if (payload.kind !== targetPayload.kind || String(payload.parentId) !== String(targetPayload.parentId)) {
      toast.error('Перетаскивать можно только внутри одного уровня структуры');
      return;
    }

    const ordered = getOrderedSiblings(payload.kind, targetPayload.parentId, modules);
    const next = moveItem(ordered, payload.id, targetPayload.id);

    if (next === ordered) return;

    await run('reorder', async () => {
      if (payload.kind === 'module') {
        await Promise.all(next.map((item, index) => updateModule(item.id, { sort_order: index + 1 })));
      }

      if (payload.kind === 'lesson') {
        await Promise.all(next.map((item, index) => updateLesson(item.id, { sort_order: index + 1 })));
      }

      if (payload.kind === 'block') {
        await Promise.all(next.map((item, index) => updateLessonBlock(item.id, { sort_order: index + 1 })));
      }

      if (payload.kind === 'content') {
        await Promise.all(next.map((item, index) => updateLessonBlockContent(item.id, { sort_order: index + 1 })));
      }

      if (payload.kind === 'question') {
        await Promise.all(next.map((item, index) => updateQuestion(item.id, { sort_order: index + 1 })));
      }

      if (payload.kind === 'option') {
        await Promise.all(next.map((item, index) => updateAnswerOption(item.id, { sort_order: index + 1 })));
      }
    }, 'Порядок сохранён');
  }

  const isSaving = savingLabel !== null;
  const selectedTitle = getSelectedTitle(target, course, lookup);

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)_360px]">
      <Card className="min-h-[720px]">
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers3 className="size-5 text-primary" />
                Конструктор курса
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag-and-drop внутри уровней: модули, уроки, блоки, контент, вопросы, ответы.
              </p>
            </div>
            <Button size="sm" onClick={() => setTarget({ mode: 'create', kind: 'module', parentId: course.id })}>
              <Plus className="size-4" />
              Модуль
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {modules.length ? (
            <div className="space-y-3">
              <TreeCourseButton active={target.mode === 'edit' && target.kind === 'course'} onClick={() => setTarget({ mode: 'edit', kind: 'course' })} course={course} />

              {modules.map((module) => (
                <ModuleNode
                  key={module.id}
                  module={module}
                  courseId={course.id}
                  activeTarget={target}
                  dragOverKey={dragOverKey}
                  onDragOverKey={setDragOverKey}
                  onDrop={handleDrop}
                  onSelect={setTarget}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Курс пока пустой"
              description="Начни с первого модуля. Затем добавь урок, блок теории и тест. Конструктор будет вести тебя по структуре сверху вниз."
              action={(
                <Button onClick={() => setTarget({ mode: 'create', kind: 'module', parentId: course.id })}>
                  <Plus className="size-4" />
                  Создать первый модуль
                </Button>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Card className="min-h-[720px]">
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{selectedTitle}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Правая форма всегда относится к выбранному элементу структуры.
              </p>
            </div>
            {isSaving ? <Loader2 className="size-5 animate-spin text-primary" /> : <Settings2 className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <Inspector
            course={course}
            courseId={courseId}
            modules={modules}
            lookup={lookup}
            target={target}
            savingLabel={savingLabel}
            onTargetChange={setTarget}
            onRun={run}
          />
        </CardContent>
      </Card>

      <aside className="space-y-5">
        <ReadinessPanel course={course} modules={modules} />
        <AiAuthorPanel />
        <BuilderHints />
      </aside>
    </div>
  );
}

function buildLookup(modules: CourseModule[]) {
  const moduleById = new Map<number, CourseModule>();
  const lessonById = new Map<number, Lesson>();
  const blockById = new Map<number, LessonBlock>();
  const contentById = new Map<number, LessonBlockContent>();
  const testById = new Map<number, Test>();
  const questionById = new Map<number, Question>();
  const optionById = new Map<number, AnswerOption>();

  for (const module of modules) {
    moduleById.set(module.id, module);
    for (const lesson of sortByOrder(module.lessons ?? [])) {
      lessonById.set(lesson.id, lesson);
      for (const block of sortByOrder(lesson.lesson_blocks ?? [])) {
        blockById.set(block.id, block);
        for (const content of sortByOrder(block.contents ?? [])) {
          contentById.set(content.id, content);
        }
        if (block.test) {
          testById.set(block.test.id, block.test);
          for (const question of sortByOrder(block.test.questions ?? [])) {
            questionById.set(question.id, question);
            for (const option of sortByOrder(question.answer_options ?? [])) {
              optionById.set(option.id, option);
            }
          }
        }
      }
    }
  }

  return { moduleById, lessonById, blockById, contentById, testById, questionById, optionById };
}

function getOrderedSiblings(kind: DragKind, parentId: number | string, modules: CourseModule[]) {
  if (kind === 'module') return sortByOrder(modules);

  if (kind === 'lesson') {
    const module = modules.find((item) => item.id === Number(parentId));
    return sortByOrder(module?.lessons ?? []);
  }

  if (kind === 'block') {
    const lesson = modules.flatMap((module) => module.lessons ?? []).find((item) => item.id === Number(parentId));
    return sortByOrder(lesson?.lesson_blocks ?? []);
  }

  if (kind === 'content') {
    const block = modules.flatMap((module) => module.lessons ?? []).flatMap((lesson) => lesson.lesson_blocks ?? []).find((item) => item.id === Number(parentId));
    return sortByOrder(block?.contents ?? []);
  }

  if (kind === 'question') {
    const test = modules
      .flatMap((module) => module.lessons ?? [])
      .flatMap((lesson) => lesson.lesson_blocks ?? [])
      .map((block) => block.test)
      .find((item) => item?.id === Number(parentId));
    return sortByOrder(test?.questions ?? []);
  }

  const question = modules
    .flatMap((module) => module.lessons ?? [])
    .flatMap((lesson) => lesson.lesson_blocks ?? [])
    .map((block) => block.test)
    .flatMap((test) => test?.questions ?? [])
    .find((item) => item.id === Number(parentId));
  return sortByOrder(question?.answer_options ?? []);
}

function readDrag(event: React.DragEvent): DragPayload | null {
  const value = event.dataTransfer.getData('application/json');
  if (!value) return null;

  try {
    return JSON.parse(value) as DragPayload;
  } catch {
    return null;
  }
}

function writeDrag(event: React.DragEvent, payload: DragPayload) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('application/json', JSON.stringify(payload));
}

function getSelectedTitle(target: BuilderTarget, course: Course, lookup: ReturnType<typeof buildLookup>) {
  if (target.mode === 'create') {
    const labels: Record<string, string> = {
      course: 'Курс',
      module: 'Новый модуль',
      lesson: 'Новый урок',
      block: 'Новый блок урока',
      content: 'Новый элемент теории',
      test: 'Новый тест',
      question: 'Новый вопрос',
      option: 'Новый вариант ответа',
    };
    return labels[target.kind] ?? 'Новый элемент';
  }

  if (target.kind === 'course') return course.name;
  if (target.kind === 'module') return lookup.moduleById.get(target.id)?.name ?? 'Модуль';
  if (target.kind === 'lesson') return lookup.lessonById.get(target.id)?.name ?? 'Урок';
  if (target.kind === 'block') return lookup.blockById.get(target.id)?.name ?? 'Блок урока';
  if (target.kind === 'content') return contentTypeLabel(lookup.contentById.get(target.id)?.type ?? 'text');
  if (target.kind === 'test') return lookup.testById.get(target.id)?.name ?? 'Тест';
  if (target.kind === 'question') return textFromContent(lookup.questionById.get(target.id)?.content) || 'Вопрос';
  return textFromContent(lookup.optionById.get(target.id)?.content) || 'Вариант ответа';
}

function TreeCourseButton({ course, active, onClick }: { course: Course; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between border px-3 py-3 text-left transition-colors',
        active ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border bg-card/50 text-foreground hover:border-primary/35 hover:bg-primary/5',
      )}
    >
      <span className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wide">
        <BookOpen className="size-4" />
        {course.name}
      </span>
      <StatusBadge tone={course.status === 'published' ? 'primary' : 'neutral'}>{course.status}</StatusBadge>
    </button>
  );
}

function ModuleNode({
  module,
  courseId,
  activeTarget,
  dragOverKey,
  onDragOverKey,
  onDrop,
  onSelect,
}: {
  module: CourseModule;
  courseId: number;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const lessons = sortByOrder(module.lessons ?? []);
  const payload: DragPayload = { kind: 'module', parentId: courseId, id: module.id };
  const key = `module-${module.id}`;

  return (
    <div
      draggable
      onDragStart={(event) => writeDrag(event, payload)}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverKey(key);
      }}
      onDragLeave={() => onDragOverKey(null)}
      onDrop={async (event) => {
        event.preventDefault();
        const source = readDrag(event);
        if (source) await onDrop(source, payload);
      }}
      className={cn('border bg-background/35 transition-colors', dragOverKey === key ? 'border-primary bg-primary/10' : 'border-border')}
    >
      <TreeRow
        active={activeTarget.mode === 'edit' && activeTarget.kind === 'module' && activeTarget.id === module.id}
        icon={<Layers3 className="size-4" />}
        title={module.name}
        meta={`${lessons.length} уроков`}
        status={module.status}
        onClick={() => onSelect({ mode: 'edit', kind: 'module', id: module.id })}
        actions={(
          <>
            <Button size="icon-xs" variant="ghost" title="Добавить урок" onClick={(event) => { event.stopPropagation(); onSelect({ mode: 'create', kind: 'lesson', parentId: module.id }); }}>
              <Plus className="size-3" />
            </Button>
          </>
        )}
      />
      <div className="space-y-2 border-l border-border/80 py-2 pl-4 pr-2">
        {lessons.map((lesson) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            moduleId={module.id}
            activeTarget={activeTarget}
            dragOverKey={dragOverKey}
            onDragOverKey={onDragOverKey}
            onDrop={onDrop}
            onSelect={onSelect}
          />
        ))}
        {!lessons.length ? <InlineEmpty text="В модуле ещё нет уроков" /> : null}
      </div>
    </div>
  );
}

function LessonNode({ lesson, moduleId, activeTarget, dragOverKey, onDragOverKey, onDrop, onSelect }: {
  lesson: Lesson;
  moduleId: number;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const blocks = sortByOrder(lesson.lesson_blocks ?? []);
  const payload: DragPayload = { kind: 'lesson', parentId: moduleId, id: lesson.id };
  const key = `lesson-${lesson.id}`;

  return (
    <div
      draggable
      onDragStart={(event) => writeDrag(event, payload)}
      onDragOver={(event) => { event.preventDefault(); onDragOverKey(key); }}
      onDragLeave={() => onDragOverKey(null)}
      onDrop={async (event) => { event.preventDefault(); const source = readDrag(event); if (source) await onDrop(source, payload); }}
      className={cn('border bg-card/50 transition-colors', dragOverKey === key ? 'border-primary bg-primary/10' : 'border-border')}
    >
      <TreeRow
        active={activeTarget.mode === 'edit' && activeTarget.kind === 'lesson' && activeTarget.id === lesson.id}
        icon={<BookOpen className="size-4" />}
        title={lesson.name}
        meta={`${blocks.length} блоков`}
        status={lesson.status}
        onClick={() => onSelect({ mode: 'edit', kind: 'lesson', id: lesson.id })}
        actions={(
          <Button size="icon-xs" variant="ghost" title="Добавить блок" onClick={(event) => { event.stopPropagation(); onSelect({ mode: 'create', kind: 'block', parentId: lesson.id }); }}>
            <Plus className="size-3" />
          </Button>
        )}
      />
      <div className="space-y-2 border-l border-border/70 py-2 pl-4 pr-2">
        {blocks.map((block) => (
          <BlockNode
            key={block.id}
            block={block}
            lessonId={lesson.id}
            activeTarget={activeTarget}
            dragOverKey={dragOverKey}
            onDragOverKey={onDragOverKey}
            onDrop={onDrop}
            onSelect={onSelect}
          />
        ))}
        {!blocks.length ? <InlineEmpty text="В уроке ещё нет блоков" /> : null}
      </div>
    </div>
  );
}

function BlockNode({ block, lessonId, activeTarget, dragOverKey, onDragOverKey, onDrop, onSelect }: {
  block: LessonBlock;
  lessonId: number;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const contents = sortByOrder(block.contents ?? []);
  const questions = sortByOrder(block.test?.questions ?? []);
  const payload: DragPayload = { kind: 'block', parentId: lessonId, id: block.id };
  const key = `block-${block.id}`;

  return (
    <div
      draggable
      onDragStart={(event) => writeDrag(event, payload)}
      onDragOver={(event) => { event.preventDefault(); onDragOverKey(key); }}
      onDragLeave={() => onDragOverKey(null)}
      onDrop={async (event) => { event.preventDefault(); const source = readDrag(event); if (source) await onDrop(source, payload); }}
      className={cn('border bg-background/40 transition-colors', dragOverKey === key ? 'border-primary bg-primary/10' : 'border-border')}
    >
      <TreeRow
        active={activeTarget.mode === 'edit' && activeTarget.kind === 'block' && activeTarget.id === block.id}
        icon={block.type === 'test' ? <FileQuestion className="size-4" /> : block.type === 'coding_task' ? <Code2 className="size-4" /> : <FileText className="size-4" />}
        title={block.name}
        meta={blockTypeLabel(block.type)}
        status={block.status}
        onClick={() => onSelect({ mode: 'edit', kind: 'block', id: block.id })}
        actions={(
          <>
            {block.type === 'theory' ? (
              <Button size="icon-xs" variant="ghost" title="Добавить контент" onClick={(event) => { event.stopPropagation(); onSelect({ mode: 'create', kind: 'content', parentId: block.id }); }}>
                <Plus className="size-3" />
              </Button>
            ) : null}
            {block.type === 'test' && !block.test ? (
              <Button size="icon-xs" variant="ghost" title="Создать тест" onClick={(event) => { event.stopPropagation(); onSelect({ mode: 'create', kind: 'test', parentId: block.id }); }}>
                <Plus className="size-3" />
              </Button>
            ) : null}
          </>
        )}
      />

      {block.type === 'theory' ? (
        <div className="space-y-1 border-l border-border/60 py-2 pl-4 pr-2">
          {contents.map((content) => (
            <ContentNode
              key={content.id}
              content={content}
              blockId={block.id}
              activeTarget={activeTarget}
              dragOverKey={dragOverKey}
              onDragOverKey={onDragOverKey}
              onDrop={onDrop}
              onSelect={onSelect}
            />
          ))}
          {!contents.length ? <InlineEmpty text="Добавь текст, заголовок, пример или видео" /> : null}
        </div>
      ) : null}

      {block.type === 'test' && block.test ? (
        <div className="space-y-1 border-l border-border/60 py-2 pl-4 pr-2">
          <button
            type="button"
            onClick={() => onSelect({ mode: 'edit', kind: 'test', id: block.test!.id })}
            className={cn(
              'flex w-full items-center justify-between border px-2 py-2 text-left text-sm transition-colors',
              activeTarget.mode === 'edit' && activeTarget.kind === 'test' && activeTarget.id === block.test.id
                ? 'border-primary/60 bg-primary/10 text-primary'
                : 'border-border bg-muted/10 hover:border-primary/35 hover:bg-primary/5',
            )}
          >
            <span className="flex items-center gap-2"><FileQuestion className="size-3.5" /> {block.test.name}</span>
            <span className="text-xs text-muted-foreground">{questions.length} вопросов</span>
          </button>
          {questions.map((question) => (
            <QuestionNode
              key={question.id}
              question={question}
              testId={block.test!.id}
              activeTarget={activeTarget}
              dragOverKey={dragOverKey}
              onDragOverKey={onDragOverKey}
              onDrop={onDrop}
              onSelect={onSelect}
            />
          ))}
          {!questions.length ? <InlineEmpty text="Добавь первый вопрос теста" /> : null}
        </div>
      ) : null}
    </div>
  );
}

function ContentNode({ content, blockId, activeTarget, dragOverKey, onDragOverKey, onDrop, onSelect }: {
  content: LessonBlockContent;
  blockId: number;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const payload: DragPayload = { kind: 'content', parentId: blockId, id: content.id };
  const key = `content-${content.id}`;

  return (
    <TinyTreeButton
      draggable
      payload={payload}
      active={activeTarget.mode === 'edit' && activeTarget.kind === 'content' && activeTarget.id === content.id}
      dragOver={dragOverKey === key}
      icon={<FileText className="size-3.5" />}
      title={`${contentTypeLabel(content.type)} · ${textFromContent(content.content).slice(0, 42) || 'пусто'}`}
      onDragOverKey={() => onDragOverKey(key)}
      onDragLeave={() => onDragOverKey(null)}
      onDrop={onDrop}
      onClick={() => onSelect({ mode: 'edit', kind: 'content', id: content.id })}
    />
  );
}

function QuestionNode({ question, testId, activeTarget, dragOverKey, onDragOverKey, onDrop, onSelect }: {
  question: Question;
  testId: number;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const options = sortByOrder(question.answer_options ?? []);
  const payload: DragPayload = { kind: 'question', parentId: testId, id: question.id };
  const key = `question-${question.id}`;

  return (
    <div className={cn('border bg-background/40', dragOverKey === key ? 'border-primary bg-primary/10' : 'border-border')}>
      <TinyTreeButton
        draggable
        payload={payload}
        active={activeTarget.mode === 'edit' && activeTarget.kind === 'question' && activeTarget.id === question.id}
        dragOver={dragOverKey === key}
        icon={<FileQuestion className="size-3.5" />}
        title={textFromContent(question.content) || 'Без текста вопроса'}
        onDragOverKey={() => onDragOverKey(key)}
        onDragLeave={() => onDragOverKey(null)}
        onDrop={onDrop}
        onClick={() => onSelect({ mode: 'edit', kind: 'question', id: question.id })}
      />
      <div className="space-y-1 border-l border-border/60 py-1 pl-4 pr-1">
        {options.map((option) => (
          <OptionNode
            key={option.id}
            option={option}
            question={question}
            activeTarget={activeTarget}
            dragOverKey={dragOverKey}
            onDragOverKey={onDragOverKey}
            onDrop={onDrop}
            onSelect={onSelect}
          />
        ))}
        {!options.length ? <InlineEmpty text="Добавь варианты ответа" /> : null}
      </div>
    </div>
  );
}

function OptionNode({ option, question, activeTarget, dragOverKey, onDragOverKey, onDrop, onSelect }: {
  option: AnswerOption;
  question: Question;
  activeTarget: BuilderTarget;
  dragOverKey: string | null;
  onDragOverKey: (key: string | null) => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onSelect: (target: BuilderTarget) => void;
}) {
  const payload: DragPayload = { kind: 'option', parentId: question.id, id: option.id };
  const key = `option-${option.id}`;
  const isCorrect = isCorrectOption(question, option.id);

  return (
    <TinyTreeButton
      draggable
      payload={payload}
      active={activeTarget.mode === 'edit' && activeTarget.kind === 'option' && activeTarget.id === option.id}
      dragOver={dragOverKey === key}
      icon={isCorrect ? <CheckCircle2 className="size-3.5 text-primary" /> : <MoreHorizontal className="size-3.5" />}
      title={textFromContent(option.content) || 'Пустой вариант'}
      onDragOverKey={() => onDragOverKey(key)}
      onDragLeave={() => onDragOverKey(null)}
      onDrop={onDrop}
      onClick={() => onSelect({ mode: 'edit', kind: 'option', id: option.id })}
    />
  );
}

function TreeRow({ active, icon, title, meta, status, actions, onClick }: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  meta: string;
  status: VisibilityStatus;
  actions?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors',
        active ? 'bg-primary/10 text-primary' : 'hover:bg-muted/30',
      )}
    >
      <GripVertical className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{meta}</span>
          <StatusBadge tone={statusTone(status)}>{status === 'visible' ? 'виден' : 'скрыт'}</StatusBadge>
        </span>
      </span>
      <span className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>{actions}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function TinyTreeButton({ draggable, payload, active, dragOver, icon, title, onClick, onDrop, onDragOverKey, onDragLeave }: {
  draggable: boolean;
  payload: DragPayload;
  active: boolean;
  dragOver: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  onDrop: (payload: DragPayload, targetPayload: DragPayload) => Promise<void>;
  onDragOverKey: () => void;
  onDragLeave: () => void;
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(event) => writeDrag(event, payload)}
      onDragOver={(event) => { event.preventDefault(); onDragOverKey(); }}
      onDragLeave={onDragLeave}
      onDrop={async (event) => { event.preventDefault(); const source = readDrag(event); if (source) await onDrop(source, payload); }}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 border px-2 py-1.5 text-left text-xs transition-colors',
        active ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border bg-muted/10 hover:border-primary/35 hover:bg-primary/5',
        dragOver && 'border-primary bg-primary/10',
      )}
    >
      <GripVertical className="size-3 text-muted-foreground" />
      {icon}
      <span className="truncate">{title}</span>
    </button>
  );
}

function InlineEmpty({ text }: { text: string }) {
  return <p className="border border-dashed border-border bg-muted/10 px-2 py-2 text-xs text-muted-foreground">{text}</p>;
}

function Inspector({
  course,
  courseId,
  modules,
  lookup,
  target,
  savingLabel,
  onTargetChange,
  onRun,
}: {
  course: Course;
  courseId: string;
  modules: CourseModule[];
  lookup: ReturnType<typeof buildLookup>;
  target: BuilderTarget;
  savingLabel: string | null;
  onTargetChange: (target: BuilderTarget) => void;
  onRun: (label: string, action: () => Promise<unknown>, successMessage: string) => Promise<void>;
}) {
  const isSaving = savingLabel !== null;

  if (target.mode === 'edit' && target.kind === 'course') {
    return (
      <CourseForm
        key={course.id}
        course={course}
        mode="edit"
        isPending={isSaving}
        serverError={null}
        onSubmit={(payload: CoursePayload) => onRun('course', () => updateCourse(courseId, payload), 'Курс обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'module') {
    return (
      <ModuleForm
        mode="create"
        isSaving={isSaving}
        onCancel={() => onTargetChange({ mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('module', () => createModule(courseId, payload), 'Модуль создан')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'module') {
    const module = lookup.moduleById.get(target.id);
    if (!module) return <MissingEntity />;
    return (
      <ModuleForm
        mode="edit"
        module={module}
        isSaving={isSaving}
        onDelete={() => onRun('delete-module', () => deleteModule(module.id), 'Модуль удалён')}
        onCreateLesson={() => onTargetChange({ mode: 'create', kind: 'lesson', parentId: module.id })}
        onSubmit={(payload) => onRun('module', () => updateModule(module.id, payload), 'Модуль обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'lesson') {
    const module = lookup.moduleById.get(Number(target.parentId));
    return (
      <LessonForm
        mode="create"
        parentName={module?.name}
        isSaving={isSaving}
        onCancel={() => onTargetChange(module ? { mode: 'edit', kind: 'module', id: module.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('lesson', () => createLesson(target.parentId, payload), 'Урок создан')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'lesson') {
    const lesson = lookup.lessonById.get(target.id);
    if (!lesson) return <MissingEntity />;
    return (
      <LessonForm
        mode="edit"
        lesson={lesson}
        isSaving={isSaving}
        onDelete={() => onRun('delete-lesson', () => deleteLesson(lesson.id), 'Урок удалён')}
        onCreateBlock={() => onTargetChange({ mode: 'create', kind: 'block', parentId: lesson.id })}
        onSubmit={(payload) => onRun('lesson', () => updateLesson(lesson.id, payload), 'Урок обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'block') {
    const lesson = lookup.lessonById.get(Number(target.parentId));
    return (
      <LessonBlockForm
        mode="create"
        parentName={lesson?.name}
        isSaving={isSaving}
        onCancel={() => onTargetChange(lesson ? { mode: 'edit', kind: 'lesson', id: lesson.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('block', () => createLessonBlock(target.parentId, payload), 'Блок урока создан')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'block') {
    const block = lookup.blockById.get(target.id);
    if (!block) return <MissingEntity />;
    return (
      <LessonBlockForm
        mode="edit"
        block={block}
        isSaving={isSaving}
        onDelete={() => onRun('delete-block', () => deleteLessonBlock(block.id), 'Блок удалён')}
        onCreateContent={() => onTargetChange({ mode: 'create', kind: 'content', parentId: block.id })}
        onCreateTest={() => onTargetChange({ mode: 'create', kind: 'test', parentId: block.id })}
        onEditTest={() => block.test ? onTargetChange({ mode: 'edit', kind: 'test', id: block.test.id }) : undefined}
        onSubmit={(payload) => onRun('block', () => updateLessonBlock(block.id, payload), 'Блок обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'content') {
    const block = lookup.blockById.get(Number(target.parentId));
    return (
      <ContentForm
        mode="create"
        parentName={block?.name}
        isSaving={isSaving}
        onCancel={() => onTargetChange(block ? { mode: 'edit', kind: 'block', id: block.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('content', () => createLessonBlockContent(target.parentId, payload), 'Контент добавлен')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'content') {
    const content = lookup.contentById.get(target.id);
    if (!content) return <MissingEntity />;
    return (
      <ContentForm
        mode="edit"
        content={content}
        isSaving={isSaving}
        onDelete={() => onRun('delete-content', () => deleteLessonBlockContent(content.id), 'Контент удалён')}
        onSubmit={(payload) => onRun('content', () => updateLessonBlockContent(content.id, payload), 'Контент обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'test') {
    const block = lookup.blockById.get(Number(target.parentId));
    return (
      <TestForm
        mode="create"
        parentName={block?.name}
        isSaving={isSaving}
        onCancel={() => onTargetChange(block ? { mode: 'edit', kind: 'block', id: block.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('test', () => createTest(target.parentId, payload), 'Тест создан')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'test') {
    const test = lookup.testById.get(target.id);
    if (!test) return <MissingEntity />;
    return (
      <TestForm
        mode="edit"
        test={test}
        isSaving={isSaving}
        onDelete={() => onRun('delete-test', () => deleteTest(test.id), 'Тест удалён')}
        onCreateQuestion={() => onTargetChange({ mode: 'create', kind: 'question', parentId: test.id })}
        onSubmit={(payload) => onRun('test', () => updateTest(test.id, payload), 'Тест обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'question') {
    const test = lookup.testById.get(Number(target.parentId));
    return (
      <QuestionForm
        mode="create"
        parentName={test?.name}
        isSaving={isSaving}
        onCancel={() => onTargetChange(test ? { mode: 'edit', kind: 'test', id: test.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('question', () => createQuestion(target.parentId, payload), 'Вопрос создан')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'question') {
    const question = lookup.questionById.get(target.id);
    if (!question) return <MissingEntity />;
    return (
      <QuestionForm
        mode="edit"
        question={question}
        isSaving={isSaving}
        onDelete={() => onRun('delete-question', () => deleteQuestion(question.id), 'Вопрос удалён')}
        onCreateOption={() => onTargetChange({ mode: 'create', kind: 'option', parentId: question.id })}
        onSubmit={(payload) => onRun('question', () => updateQuestion(question.id, payload), 'Вопрос обновлён')}
      />
    );
  }

  if (target.mode === 'create' && target.kind === 'option') {
    const question = lookup.questionById.get(Number(target.parentId));
    return (
      <AnswerOptionForm
        mode="create"
        parentName={question ? textFromContent(question.content) : undefined}
        isSaving={isSaving}
        onCancel={() => onTargetChange(question ? { mode: 'edit', kind: 'question', id: question.id } : { mode: 'edit', kind: 'course' })}
        onSubmit={(payload) => onRun('option', () => createAnswerOption(target.parentId, payload), 'Вариант ответа добавлен')}
      />
    );
  }

  if (target.mode === 'edit' && target.kind === 'option') {
    const option = lookup.optionById.get(target.id);
    const question = modules
      .flatMap((module) => module.lessons ?? [])
      .flatMap((lesson) => lesson.lesson_blocks ?? [])
      .flatMap((block) => block.test?.questions ?? [])
      .find((item) => item.answer_options?.some((candidate) => candidate.id === target.id));
    if (!option || !question) return <MissingEntity />;
    return (
      <AnswerOptionForm
        mode="edit"
        option={option}
        question={question}
        isSaving={isSaving}
        onMarkCorrect={() => onRun('answer', () => markOptionAsCorrect(question, option), 'Правильный ответ сохранён')}
        onDelete={() => onRun('delete-option', () => deleteAnswerOption(option.id), 'Вариант ответа удалён')}
        onSubmit={(payload) => onRun('option', () => updateAnswerOption(option.id, payload), 'Вариант ответа обновлён')}
      />
    );
  }

  return <MissingEntity />;
}

async function markOptionAsCorrect(question: Question, option: AnswerOption) {
  if (question.type === 'multiple') {
    const current = multipleCorrectOptionIds(question);
    const next = current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id];
    await upsertAnswer(question.id, { content: { answer_option_ids: next } });
    return;
  }

  await upsertAnswer(question.id, { content: { answer_option_id: option.id } });
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-28 w-full resize-y border border-input bg-background/45 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/35 disabled:opacity-50',
        props.className,
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'h-9 w-full border border-input bg-background/45 px-3 text-sm outline-none transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/35 disabled:opacity-50',
        props.className,
      )}
    />
  );
}

function FormActions({ isSaving, submitLabel = 'Сохранить', onCancel, onDelete, children }: {
  isSaving: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <div className="flex flex-wrap gap-2">
        {children}
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {onDelete ? (
          <Button type="button" variant="destructive" onClick={() => window.confirm('Удалить элемент?') && onDelete()} disabled={isSaving}>
            <Trash2 className="size-4" />
            Удалить
          </Button>
        ) : null}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

function ModuleForm({ mode, module, isSaving, onSubmit, onCancel, onDelete, onCreateLesson }: {
  mode: 'create' | 'edit';
  module?: CourseModule;
  isSaving: boolean;
  onSubmit: (payload: { name: string; slug?: string | null; description?: string | null; status?: VisibilityStatus }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onCreateLesson?: () => void;
}) {
  const [name, setName] = useState(module?.name ?? '');
  const [slug, setSlug] = useState(module?.slug ?? '');
  const [description, setDescription] = useState(module?.description ?? '');
  const [status, setStatus] = useState<VisibilityStatus>(module?.status ?? 'off');

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ name, slug: slug || null, description: description || null, status }); }}>
      <FormIntro title={mode === 'create' ? 'Новый модуль' : 'Редактирование модуля'} description="Модуль — крупный раздел курса. Внутри него будут уроки." />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Название" /><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например: Основы Laravel" required minLength={3} /></div>
        <div className="space-y-1.5"><FieldLabel label="Slug" hint="Можно оставить пустым" /><Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="laravel-basics" /></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      <div className="space-y-1.5"><FieldLabel label="Описание" /><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Коротко объясни, чему посвящён модуль." /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Создать модуль' : 'Сохранить модуль'} onCancel={onCancel} onDelete={onDelete}>{onCreateLesson ? <Button type="button" variant="outline" onClick={onCreateLesson}><Plus className="size-4" />Урок</Button> : null}</FormActions>
    </form>
  );
}

function LessonForm({ mode, lesson, parentName, isSaving, onSubmit, onCancel, onDelete, onCreateBlock }: {
  mode: 'create' | 'edit';
  lesson?: Lesson;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { name: string; slug?: string | null; description?: string | null; status?: VisibilityStatus }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onCreateBlock?: () => void;
}) {
  const [name, setName] = useState(lesson?.name ?? '');
  const [slug, setSlug] = useState(lesson?.slug ?? '');
  const [description, setDescription] = useState(lesson?.description ?? '');
  const [status, setStatus] = useState<VisibilityStatus>(lesson?.status ?? 'off');

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ name, slug: slug || null, description: description || null, status }); }}>
      <FormIntro title={mode === 'create' ? 'Новый урок' : 'Редактирование урока'} description={parentName ? `Модуль: ${parentName}` : 'Урок содержит блоки теории, тесты и практику.'} />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Название" /><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например: Маршруты и контроллеры" required minLength={3} /></div>
        <div className="space-y-1.5"><FieldLabel label="Slug" hint="Можно оставить пустым" /><Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="routes-controllers" /></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      <div className="space-y-1.5"><FieldLabel label="Описание" /><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Что пользователь поймёт после урока?" /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Создать урок' : 'Сохранить урок'} onCancel={onCancel} onDelete={onDelete}>{onCreateBlock ? <Button type="button" variant="outline" onClick={onCreateBlock}><Plus className="size-4" />Блок</Button> : null}</FormActions>
    </form>
  );
}

function LessonBlockForm({ mode, block, parentName, isSaving, onSubmit, onCancel, onDelete, onCreateContent, onCreateTest, onEditTest }: {
  mode: 'create' | 'edit';
  block?: LessonBlock;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { name: string; slug?: string | null; description?: string | null; status?: VisibilityStatus; type?: LessonBlockType }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onCreateContent?: () => void;
  onCreateTest?: () => void;
  onEditTest?: () => void;
}) {
  const [name, setName] = useState(block?.name ?? '');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState(block?.description ?? '');
  const [status, setStatus] = useState<VisibilityStatus>(block?.status ?? 'off');
  const [type, setType] = useState<LessonBlockType>(block?.type ?? 'theory');

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ name, slug: slug || null, description: description || null, status, ...(mode === 'create' ? { type } : {}) }); }}>
      <FormIntro title={mode === 'create' ? 'Новый блок урока' : 'Редактирование блока'} description={parentName ? `Урок: ${parentName}` : 'Блок — минимальная единица прогресса ученика.'} />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Название" /><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например: Что такое middleware" required minLength={3} /></div>
        <div className="space-y-1.5"><FieldLabel label="Slug" hint="Только при создании" /><Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="middleware" disabled={mode === 'edit'} /></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      <div className="space-y-1.5"><FieldLabel label="Тип блока" hint={mode === 'edit' ? 'Backend запрещает менять тип после создания.' : undefined} /><Select value={type} disabled={mode === 'edit'} onChange={(event) => setType(event.target.value as LessonBlockType)}>{blockTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label} — {option.description}</option>)}</Select></div>
      <div className="space-y-1.5"><FieldLabel label="Описание" /><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Коротко опиши назначение блока." /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Создать блок' : 'Сохранить блок'} onCancel={onCancel} onDelete={onDelete}>
        {block?.type === 'theory' && onCreateContent ? <Button type="button" variant="outline" onClick={onCreateContent}><Plus className="size-4" />Контент</Button> : null}
        {block?.type === 'test' && !block.test && onCreateTest ? <Button type="button" variant="outline" onClick={onCreateTest}><Plus className="size-4" />Тест</Button> : null}
        {block?.type === 'test' && block.test && onEditTest ? <Button type="button" variant="outline" onClick={onEditTest}><FileQuestion className="size-4" />Открыть тест</Button> : null}
      </FormActions>
    </form>
  );
}

function ContentForm({ mode, content, parentName, isSaving, onSubmit, onCancel, onDelete }: {
  mode: 'create' | 'edit';
  content?: LessonBlockContent;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { type: LessonBlockContentType; status: VisibilityStatus; content: Record<string, unknown> }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [type, setType] = useState<LessonBlockContentType>(content?.type ?? 'text');
  const [status, setStatus] = useState<VisibilityStatus>(content?.status ?? 'off');
  const [text, setText] = useState(textFromContent(content?.content));
  const [url, setUrl] = useState(urlFromContent(content?.content));

  function buildContent() {
    if (type === 'heading') return { title: text };
    if (type === 'video' || type === 'link') return { text, url };
    if (type === 'example') return { code: text };
    return { text };
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ type, status, content: buildContent() }); }}>
      <FormIntro title={mode === 'create' ? 'Новый элемент теории' : 'Редактирование контента'} description={parentName ? `Блок: ${parentName}` : 'Собирай теорию из небольших понятных элементов.'} />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Тип" /><Select value={type} onChange={(event) => setType(event.target.value as LessonBlockContentType)}>{contentTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      {(type === 'video' || type === 'link') ? <div className="space-y-1.5"><FieldLabel label="URL" /><Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." /></div> : null}
      <div className="space-y-1.5"><FieldLabel label={type === 'heading' ? 'Заголовок' : type === 'example' ? 'Код / пример' : 'Текст'} /><Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Напиши содержимое блока..." /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Добавить контент' : 'Сохранить контент'} onCancel={onCancel} onDelete={onDelete} />
    </form>
  );
}

function TestForm({ mode, test, parentName, isSaving, onSubmit, onCancel, onDelete, onCreateQuestion }: {
  mode: 'create' | 'edit';
  test?: Test;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { name: string; description?: string | null; status?: VisibilityStatus }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onCreateQuestion?: () => void;
}) {
  const [name, setName] = useState(test?.name ?? '');
  const [description, setDescription] = useState(test?.description ?? '');
  const [status, setStatus] = useState<VisibilityStatus>(test?.status ?? 'off');

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ name, description: description || null, status }); }}>
      <FormIntro title={mode === 'create' ? 'Новый тест' : 'Редактирование теста'} description={parentName ? `Блок: ${parentName}` : 'Тест проверяет понимание текущего блока.'} />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Название" /><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Проверка понимания" required minLength={3} /></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      <div className="space-y-1.5"><FieldLabel label="Описание" /><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Что проверяет этот тест?" /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Создать тест' : 'Сохранить тест'} onCancel={onCancel} onDelete={onDelete}>{onCreateQuestion ? <Button type="button" variant="outline" onClick={onCreateQuestion}><Plus className="size-4" />Вопрос</Button> : null}</FormActions>
    </form>
  );
}

function QuestionForm({ mode, question, parentName, isSaving, onSubmit, onCancel, onDelete, onCreateOption }: {
  mode: 'create' | 'edit';
  question?: Question;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { type: QuestionType; status: VisibilityStatus; content: Record<string, unknown> }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onCreateOption?: () => void;
}) {
  const [type, setType] = useState<QuestionType>(question?.type ?? 'single');
  const [status, setStatus] = useState<VisibilityStatus>(question?.status ?? 'off');
  const [text, setText] = useState(textFromContent(question?.content));

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ type, status, content: { text } }); }}>
      <FormIntro title={mode === 'create' ? 'Новый вопрос' : 'Редактирование вопроса'} description={parentName ? `Тест: ${parentName}` : 'Вопрос должен быть однозначным и проверять одну мысль.'} />
      <FormGrid>
        <div className="space-y-1.5"><FieldLabel label="Тип" /><Select value={type} onChange={(event) => setType(event.target.value as QuestionType)}>{questionTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
        <div className="space-y-1.5"><FieldLabel label="Статус" /><Select value={status} onChange={(event) => setStatus(event.target.value as VisibilityStatus)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      </FormGrid>
      <div className="space-y-1.5"><FieldLabel label="Текст вопроса" /><Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Например: Что делает middleware в Laravel?" required /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Создать вопрос' : 'Сохранить вопрос'} onCancel={onCancel} onDelete={onDelete}>{onCreateOption ? <Button type="button" variant="outline" onClick={onCreateOption}><Plus className="size-4" />Вариант ответа</Button> : null}</FormActions>
    </form>
  );
}

function AnswerOptionForm({ mode, option, question, parentName, isSaving, onSubmit, onCancel, onDelete, onMarkCorrect }: {
  mode: 'create' | 'edit';
  option?: AnswerOption;
  question?: Question;
  parentName?: string;
  isSaving: boolean;
  onSubmit: (payload: { content: Record<string, unknown> }) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  onMarkCorrect?: () => void;
}) {
  const [text, setText] = useState(textFromContent(option?.content));
  const isCorrect = option && question ? isCorrectOption(question, option.id) : false;

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ content: { text } }); }}>
      <FormIntro title={mode === 'create' ? 'Новый вариант ответа' : 'Редактирование варианта'} description={parentName ? `Вопрос: ${parentName}` : 'Для single нужно отметить один правильный вариант, для multiple — несколько.'} />
      {isCorrect ? <div className="border border-primary/40 bg-primary/10 p-3 text-sm text-primary">Этот вариант сейчас отмечен как правильный.</div> : null}
      <div className="space-y-1.5"><FieldLabel label="Текст варианта" /><Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Текст ответа..." required /></div>
      <FormActions isSaving={isSaving} submitLabel={mode === 'create' ? 'Добавить вариант' : 'Сохранить вариант'} onCancel={onCancel} onDelete={onDelete}>
        {onMarkCorrect ? <Button type="button" variant={isCorrect ? 'secondary' : 'outline'} onClick={onMarkCorrect}><CheckCircle2 className="size-4" />{question?.type === 'multiple' && isCorrect ? 'Убрать из правильных' : 'Отметить правильным'}</Button> : null}
      </FormActions>
    </form>
  );
}

function FormIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-border bg-muted/20 p-4">
      <h3 className="font-heading text-lg font-semibold tracking-wide">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-3">{children}</div>;
}

function MissingEntity() {
  return <EmptyState title="Элемент не найден" description="Возможно, он был удалён или структура курса обновилась. Выбери другой элемент слева." />;
}

function ReadinessPanel({ course, modules }: { course: Course; modules: CourseModule[] }) {
  const lessons = modules.flatMap((module) => module.lessons ?? []);
  const blocks = lessons.flatMap((lesson) => lesson.lesson_blocks ?? []);
  const visibleBlocks = blocks.filter((block) => block.status === 'visible');
  const tests = blocks.map((block) => block.test).filter(Boolean) as Test[];
  const questions = tests.flatMap((test) => test.questions ?? []);

  return (
    <Card>
      <CardHeader className="border-b border-border"><CardTitle>Готовность курса</CardTitle></CardHeader>
      <CardContent className="grid gap-3 pt-4 text-sm">
        <ReadinessItem done={Boolean(course.name && course.slug)} label="Название и slug заполнены" />
        <ReadinessItem done={Boolean(course.description)} label="Есть описание курса" />
        <ReadinessItem done={modules.length > 0} label="Есть хотя бы один модуль" />
        <ReadinessItem done={lessons.length > 0} label="Есть хотя бы один урок" />
        <ReadinessItem done={blocks.length > 0} label="Есть учебные блоки" />
        <ReadinessItem done={visibleBlocks.length > 0} label="Есть видимые блоки" />
        <ReadinessItem done={questions.length > 0} label="Есть тестовые вопросы" />
      </CardContent>
    </Card>
  );
}

function ReadinessItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className={cn('size-4', done ? 'text-primary' : 'text-muted-foreground')} />
      <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}

function AiAuthorPanel() {
  return (
    <Card>
      <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2"><Bot className="size-5 text-primary" />ИИ для автора</CardTitle></CardHeader>
      <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
        <p>Здесь подготовлена UX-зона для будущих ИИ-действий: улучшить теорию, придумать вопрос, проверить формулировку, сгенерировать подсказку.</p>
        <div className="grid gap-2">
          {['Улучшить текст блока', 'Придумать варианты ответа', 'Проверить качество вопроса'].map((item) => (
            <button key={item} type="button" className="flex items-center gap-2 border border-border bg-muted/20 px-3 py-2 text-left text-xs hover:border-primary/40 hover:bg-primary/10">
              <Sparkles className="size-3.5 text-primary" /> {item}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BuilderHints() {
  return (
    <Card>
      <CardHeader className="border-b border-border"><CardTitle>Правила UX</CardTitle></CardHeader>
      <CardContent className="space-y-3 pt-4 text-sm leading-6 text-muted-foreground">
        <p>1. Создавай курс сверху вниз: модуль → урок → блок → контент или тест.</p>
        <p>2. Скрывай черновики через статус <span className="font-mono text-foreground">off</span>, публикуй только готовые элементы.</p>
        <p>3. Drag-and-drop сохраняет порядок через <span className="font-mono text-foreground">sort_order</span>.</p>
      </CardContent>
    </Card>
  );
}
