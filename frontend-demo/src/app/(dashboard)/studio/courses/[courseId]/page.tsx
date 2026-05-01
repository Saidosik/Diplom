import { CourseEditorClient } from '@/features/studio/components/course-editor-client';

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function StudioCoursePage({ params }: PageProps) {
  const { courseId } = await params;

  return <CourseEditorClient courseId={courseId} />;
}
