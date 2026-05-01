import { LessonLearningClient } from '@/features/learning/components/lesson-learning-client';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LessonLearnPage({ params }: PageProps) {
  const { id } = await params;

  return <LessonLearningClient lessonId={Number(id)} />;
}
