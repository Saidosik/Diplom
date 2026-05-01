import { LessonLearningClient } from '@/features/learning/components/lesson-learning-client';

type PageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

export default async function LessonLearnPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;

  return <LessonLearningClient courseId={Number(courseId)} lessonId={Number(lessonId)} />;
}
