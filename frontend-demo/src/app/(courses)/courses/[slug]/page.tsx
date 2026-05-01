import { CourseDetailClient } from '@/features/courses/components/course-detail-client';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;

  return <CourseDetailClient slug={slug} />;
}
