import { browserApi } from '@/lib/http/browser';
import type {
  ApiCollection,
  ApiResource,
  Course,
  CourseComment,
  CourseEnrollment,
  CourseProgress,
  CourseQuery,
  CoursePayload,
  Lesson,
  CourseModule,
  LessonBlock,
  LessonBlockContent,
  Test,
  Question,
  AnswerOption,
  Answer,
  ModulePayload,
  LessonPayload,
  LessonBlockPayload,
  LessonBlockContentPayload,
  TestPayload,
  QuestionPayload,
  AnswerOptionPayload,
  AnswerPayload,
  SubmitTestPayload,
  TestAttempt,
} from './types';

const unwrapResource = <T>(payload: ApiResource<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResource<T>).data;
  }

  return payload as T;
};

export async function getCourses(query: CourseQuery = {}): Promise<Course[]> {
  const response = await browserApi.get<ApiCollection<Course>>('/laravel/courses', {
    params: query,
  });

  return response.data.data;
}

export async function getCourse(slug: string): Promise<Course> {
  const response = await browserApi.get<ApiResource<Course>>(`/laravel/courses/${slug}`);

  return response.data.data;
}

export async function getCourseStructure(slug: string): Promise<Course> {
  const response = await browserApi.get<ApiResource<Course>>(
    `/laravel/courses/${slug}/structure`,
  );

  return response.data.data;
}

export async function getLessonLearning(lessonId: number | string): Promise<Lesson> {
  const response = await browserApi.get<ApiResource<Lesson>>(
    `/laravel/lessons/${lessonId}/learn`,
  );

  return response.data.data;
}

export async function getMyCourses(): Promise<Course[]> {
  const response = await browserApi.get<ApiCollection<Course>>('/laravel/my/courses');

  return response.data.data;
}

export async function getCourseProgress(courseId: number): Promise<CourseProgress> {
  const response = await browserApi.get<ApiResource<CourseProgress>>(
    `/laravel/my/progress/courses/${courseId}`,
  );

  return response.data.data;
}

export async function openLessonBlock(blockId: number) {
  const response = await browserApi.post(`/laravel/lesson-blocks/${blockId}/open`);

  return response.data;
}

export async function submitTest(
  testId: number,
  payload: SubmitTestPayload,
): Promise<TestAttempt> {
  const response = await browserApi.post<ApiResource<TestAttempt>>(
    `/laravel/tests/${testId}/submit`,
    payload,
  );

  return unwrapResource(response.data);
}

export async function getCourseComments(slug: string): Promise<CourseComment[]> {
  const response = await browserApi.get<ApiCollection<CourseComment>>(
    `/laravel/courses/${slug}/comments`,
  );

  return response.data.data;
}

export async function createCourseComment(
  slug: string,
  text: string,
): Promise<CourseComment> {
  const response = await browserApi.post<ApiResource<CourseComment>>(
    `/laravel/courses/${slug}/comments`,
    { content: { text } },
  );

  return response.data.data;
}

export async function getLessonBlockComments(blockId: number): Promise<CourseComment[]> {
  const response = await browserApi.get<ApiCollection<CourseComment>>(
    `/laravel/lesson-blocks/${blockId}/comments`,
  );

  return response.data.data;
}

export async function createLessonBlockComment(
  blockId: number,
  text: string,
): Promise<CourseComment> {
  const response = await browserApi.post<ApiResource<CourseComment>>(
    `/laravel/lesson-blocks/${blockId}/comments`,
    { content: { text } },
  );

  return response.data.data;
}

export async function replyToComment(
  commentId: number,
  text: string,
): Promise<CourseComment> {
  const response = await browserApi.post<ApiResource<CourseComment>>(
    `/laravel/comments/${commentId}/replies`,
    { content: { text } },
  );

  return response.data.data;
}

export async function getMyLearning(): Promise<CourseEnrollment[]> {
  const response = await browserApi.get<ApiCollection<CourseEnrollment>>(
    '/laravel/my/learning',
  );

  return response.data.data;
}

export async function getCourseEnrollment(
  slug: string,
): Promise<CourseEnrollment | null> {
  const response = await browserApi.get<ApiResource<CourseEnrollment | null>>(
    `/laravel/courses/${slug}/enrollment`,
  );

  return response.data.data;
}

export async function enrollCourse(slug: string): Promise<CourseEnrollment> {
  const response = await browserApi.post<ApiResource<CourseEnrollment>>(
    `/laravel/courses/${slug}/enroll`,
  );

  return response.data.data;
}

export async function archiveCourseEnrollment(slug: string): Promise<{ message: string }> {
  const response = await browserApi.delete<{ message: string }>(
    `/laravel/courses/${slug}/enrollment`,
  );

  return response.data;
}

export async function createCourse(payload: CoursePayload): Promise<Course> {
  const response = await browserApi.post<ApiResource<Course>>('/laravel/my/courses', payload);

  return response.data.data;
}

export async function getMyCourse(courseId: number | string): Promise<Course> {
  const response = await browserApi.get<ApiResource<Course>>(`/laravel/my/courses/${courseId}`);

  return response.data.data;
}

export async function getMyCourseStructure(courseId: number | string): Promise<Course> {
  const response = await browserApi.get<ApiResource<Course>>(
    `/laravel/my/courses/${courseId}/structure`,
  );

  return response.data.data;
}

export async function updateCourse(
  courseId: number | string,
  payload: Partial<CoursePayload>,
): Promise<Course> {
  const response = await browserApi.patch<ApiResource<Course>>(
    `/laravel/my/courses/${courseId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteCourse(courseId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/courses/${courseId}`);
}

export async function publishCourse(courseId: number | string): Promise<Course> {
  const response = await browserApi.post<ApiResource<Course>>(
    `/laravel/my/courses/${courseId}/publish`,
  );

  return response.data.data;
}

export async function hideCourse(courseId: number | string): Promise<Course> {
  const response = await browserApi.post<ApiResource<Course>>(
    `/laravel/my/courses/${courseId}/hide`,
  );

  return response.data.data;
}

export async function createModule(
  courseId: number | string,
  payload: ModulePayload,
): Promise<CourseModule> {
  const response = await browserApi.post<ApiResource<CourseModule>>(
    `/laravel/my/courses/${courseId}/modules`,
    payload,
  );

  return response.data.data;
}

export async function updateModule(
  moduleId: number | string,
  payload: ModulePayload,
): Promise<CourseModule> {
  const response = await browserApi.patch<ApiResource<CourseModule>>(
    `/laravel/my/modules/${moduleId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteModule(moduleId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/modules/${moduleId}`);
}

export async function createLesson(
  moduleId: number | string,
  payload: LessonPayload,
): Promise<Lesson> {
  const response = await browserApi.post<ApiResource<Lesson>>(
    `/laravel/my/modules/${moduleId}/lessons`,
    payload,
  );

  return response.data.data;
}

export async function updateLesson(
  lessonId: number | string,
  payload: LessonPayload,
): Promise<Lesson> {
  const response = await browserApi.patch<ApiResource<Lesson>>(
    `/laravel/my/lessons/${lessonId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteLesson(lessonId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/lessons/${lessonId}`);
}

export async function createLessonBlock(
  lessonId: number | string,
  payload: LessonBlockPayload,
): Promise<LessonBlock> {
  const response = await browserApi.post<ApiResource<LessonBlock>>(
    `/laravel/my/lessons/${lessonId}/blocks`,
    payload,
  );

  return response.data.data;
}

export async function updateLessonBlock(
  lessonBlockId: number | string,
  payload: LessonBlockPayload,
): Promise<LessonBlock> {
  const response = await browserApi.patch<ApiResource<LessonBlock>>(
    `/laravel/my/lesson-blocks/${lessonBlockId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteLessonBlock(lessonBlockId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/lesson-blocks/${lessonBlockId}`);
}

export async function createLessonBlockContent(
  lessonBlockId: number | string,
  payload: LessonBlockContentPayload,
): Promise<LessonBlockContent> {
  const response = await browserApi.post<ApiResource<LessonBlockContent>>(
    `/laravel/my/lesson-blocks/${lessonBlockId}/contents`,
    payload,
  );

  return response.data.data;
}

export async function updateLessonBlockContent(
  contentId: number | string,
  payload: LessonBlockContentPayload,
): Promise<LessonBlockContent> {
  const response = await browserApi.patch<ApiResource<LessonBlockContent>>(
    `/laravel/my/lesson-block-contents/${contentId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteLessonBlockContent(contentId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/lesson-block-contents/${contentId}`);
}

export async function createTest(
  lessonBlockId: number | string,
  payload: TestPayload,
): Promise<Test> {
  const response = await browserApi.post<ApiResource<Test>>(
    `/laravel/my/lesson-blocks/${lessonBlockId}/test`,
    payload,
  );

  return response.data.data;
}

export async function updateTest(
  testId: number | string,
  payload: TestPayload,
): Promise<Test> {
  const response = await browserApi.patch<ApiResource<Test>>(
    `/laravel/my/tests/${testId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteTest(testId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/tests/${testId}`);
}

export async function createQuestion(
  testId: number | string,
  payload: QuestionPayload,
): Promise<Question> {
  const response = await browserApi.post<ApiResource<Question>>(
    `/laravel/my/tests/${testId}/questions`,
    payload,
  );

  return response.data.data;
}

export async function updateQuestion(
  questionId: number | string,
  payload: QuestionPayload,
): Promise<Question> {
  const response = await browserApi.patch<ApiResource<Question>>(
    `/laravel/my/questions/${questionId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteQuestion(questionId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/questions/${questionId}`);
}

export async function createAnswerOption(
  questionId: number | string,
  payload: AnswerOptionPayload,
): Promise<AnswerOption> {
  const response = await browserApi.post<ApiResource<AnswerOption>>(
    `/laravel/my/questions/${questionId}/answer-options`,
    payload,
  );

  return response.data.data;
}

export async function updateAnswerOption(
  answerOptionId: number | string,
  payload: AnswerOptionPayload,
): Promise<AnswerOption> {
  const response = await browserApi.patch<ApiResource<AnswerOption>>(
    `/laravel/my/answer-options/${answerOptionId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteAnswerOption(answerOptionId: number | string): Promise<void> {
  await browserApi.delete(`/laravel/my/answer-options/${answerOptionId}`);
}

export async function upsertAnswer(
  questionId: number | string,
  payload: AnswerPayload,
): Promise<Answer> {
  const response = await browserApi.put<ApiResource<Answer>>(
    `/laravel/my/questions/${questionId}/answer`,
    payload,
  );

  return response.data.data;
}
