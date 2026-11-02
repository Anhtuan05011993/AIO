import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseAsync } from "@/lib/demo-data/go-cau";
import LessonExperience from "@/components/sites/aioenglish/lesson/LessonExperience";

// Lesson route — mirrors the source URL shape /go-cau/lo-trinh-b1/crs_...
// Unknown ids fall back to 404 (source redirects anonymous users to a login gate).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourseAsync(courseId);
  return {
    title: course ? `${course.course.title} · Gõ câu · AIO English` : "Gõ câu · AIO English",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseAsync(courseId);
  if (!course) notFound();

  const partNum = course.course.slug.split("-").pop() ?? "1";
  const chapterTitle = `Chương 1, bài ${partNum}`;
  return (
    <LessonExperience
      course={course}
      backHref="/go-cau/lo-trinh-b1"
      breadcrumb={["Gõ câu", course.course.packTitle, chapterTitle]}
    />
  );
}
