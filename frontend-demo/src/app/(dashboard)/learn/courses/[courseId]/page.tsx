import { LearningCourseOverviewClient } from '@/features/learning/components/learning-course-overview-client';

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function LearnCourseOverviewPage({ params }: PageProps) {
  const { courseId } = await params;

  return <LearningCourseOverviewClient courseId={Number(courseId)} />;
}
