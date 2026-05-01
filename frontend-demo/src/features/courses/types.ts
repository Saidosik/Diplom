export type CourseStatus = 'draft' | 'hidden' | 'on_moderation' | 'published' | 'banned';
export type VisibilityStatus = 'off' | 'visible';
export type LessonBlockType = 'theory' | 'test' | 'coding_task';
export type LessonBlockContentType =
    | 'text'
    | 'heading'
    | 'warning'
    | 'important'
    | 'clue'
    | 'video'
    | 'example'
    | 'link'
    | 'danger';
export type QuestionType = 'single' | 'multiple';
export type ProgressStatus = 'opened' | 'failed' | 'passed' | null;

export type ApiCollection<T> = {
    data: T[];
    links?: unknown;
    meta?: unknown;
};

export type ApiResource<T> = {
    data: T;
};

export type Author = {
    id: number;
    name: string;
};
export type LessonCourse = {
  id: number;
  name: string;
  slug: string;
};

export type LessonModule = {
  id: number;
  course_id: number;
  name: string;
  slug: string | null;
  description: string | null;
  sort_order: number | null;
  status: VisibilityStatus;
  course?: LessonCourse | null;
};
export type Course = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number | string | null;
    status: CourseStatus;
    author?: Author;
    modules_count?: number;
    modules?: CourseModule[];
    created_at: string | null;
    updated_at: string | null;
};

export type CourseModule = {
    id: number;
    course_id: number;
    name: string;
    slug: string | null;
    description: string | null;
    sort_order: number | null;
    status: VisibilityStatus;
    lessons_count?: number;
    lessons?: Lesson[];
    created_at: string | null;
    updated_at: string | null;
};

export type Lesson = {
  id: number;
  module_id: number;
  name: string;
  slug: string | null;
  description: string | null;
  sort_order: number | null;
  status: VisibilityStatus;
  module?: LessonModule | null;
  lesson_blocks_count?: number;
  lesson_blocks?: LessonBlock[];
  created_at: string | null;
  updated_at: string | null;
};

export type LessonBlock = {
    id: number;
    lesson_id: number;
    name: string;
    description: string | null;
    type: LessonBlockType;
    sort_order: number | null;
    status: VisibilityStatus;
    test?: Test | null;
    contents?: LessonBlockContent[];
    created_at: string | null;
    updated_at: string | null;
};

export type LessonBlockContent = {
    id: number;
    lesson_block_id: number;
    type: LessonBlockContentType;
    sort_order: number | null;
    status: VisibilityStatus;
    content: Record<string, unknown>;
    created_at: string | null;
    updated_at: string | null;
};

export type Test = {
    id: number;
    lesson_block_id: number;
    name: string;
    description: string | null;
    sort_order: number | null;
    status: VisibilityStatus;
    questions?: Question[];
    created_at: string | null;
    updated_at: string | null;
};

export type Question = {
    id: number;
    test_id: number;
    sort_order: number | null;
    type: QuestionType;
    status: VisibilityStatus;
    content: Record<string, unknown>;
    answer_options?: AnswerOption[];
    answer?: Answer | null;
};

export type AnswerOption = {
    id: number;
    question_id: number;
    sort_order: number | null;
    content: Record<string, unknown>;
};

export type Answer = {
    id: number;
    question_id: number;
    content: Record<string, unknown>;
};

export type CourseProgress = {
    course_id: number;
    total_blocks: number;
    passed_blocks: number;
    opened_blocks: number;
    failed_blocks: number;
    percent: number;
    blocks: Array<{
        lesson_block_id: number;
        status: ProgressStatus;
        updated_at: string | null;
    }>;
};

export type CourseEnrollmentStatus = 'active' | 'completed' | 'archived';

export type CourseEnrollment = {
  id: number;
  user_id: number;
  course_id: number;
  status: CourseEnrollmentStatus;
  course?: Course;
  last_lesson?: {
    id: number;
    name: string;
    slug: string | null;
  } | null;
  last_lesson_block?: {
    id: number;
    name: string;
    type: LessonBlockType;
  } | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CommentContent = {
    text: string;
};

export type CourseComment = {
    id: number;
    user?: {
        id: number;
        name: string;
        avatar?: string | null;
    };
    commentable: {
        type: string;
        id: number;
    };
    parent_comment_id: number | null;
    content: CommentContent;
    status: string;
    replies?: CourseComment[];
    created_at: string | null;
    updated_at: string | null;
};

export type SubmitTestPayload = {
    answers: Array<{
        question_id: number;
        content:
        | { answer_option_id: number }
        | { answer_option_ids: number[] };
    }>;
};

export type TestAttempt = {
    id: number;
    test_id: number;
    user_id: number;
    score: number | null;
    max_score: number | null;
    status: 'passed' | 'failed' | string | null;
    is_passed: boolean | null;
    user_answers?: Array<{
        id: number;
        question_id: number;
        status: 'correct' | 'not_correct' | string;
        content: Record<string, unknown>;
    }>;
    created_at: string | null;
    updated_at: string | null;
};

export type CourseQuery = {
    search?: string;
    sort?: 'name' | 'created_at' | 'price';
    direction?: 'asc' | 'desc';
    per_page?: number;
};

export type CoursePayload = {
    name: string;
    slug: string;
    description?: string | null;
    price?: number | null;
};


export type ModulePayload = {
  name?: string;
  slug?: string | null;
  description?: string | null;
  sort_order?: number | null;
  status?: VisibilityStatus;
};

export type LessonPayload = ModulePayload;

export type LessonBlockPayload = {
  name?: string;
  slug?: string | null;
  description?: string | null;
  sort_order?: number | null;
  status?: VisibilityStatus;
  type?: LessonBlockType;
};

export type LessonBlockContentPayload = {
  type?: LessonBlockContentType;
  sort_order?: number | null;
  status?: VisibilityStatus;
  content?: Record<string, unknown>;
};

export type TestPayload = {
  name?: string;
  description?: string | null;
  sort_order?: number | null;
  status?: VisibilityStatus;
};

export type QuestionPayload = {
  type?: QuestionType;
  sort_order?: number | null;
  status?: VisibilityStatus;
  content?: Record<string, unknown>;
};

export type AnswerOptionPayload = {
  sort_order?: number | null;
  content?: Record<string, unknown>;
};

export type AnswerPayload = {
  content: Record<string, unknown>;
};
