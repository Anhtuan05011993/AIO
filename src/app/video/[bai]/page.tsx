import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import VideoWorkspace from "@/components/sites/aioenglish/video/VideoWorkspace";
import { videoBySlug } from "@/lib/demo-data/reading/videos";

// Workspace route /video/[bai] — slug demo của videos.ts. Người dùng tự dán
// link YouTube trong workspace (không có video ID nào hardcode).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ bai: string }>;
}): Promise<Metadata> {
  const { bai } = await params;
  const lesson = videoBySlug(bai);
  return {
    title: lesson ? `${lesson.title} · Video · AIO English` : "Video · AIO English",
  };
}

export default async function VideoLessonPage({
  params,
}: {
  params: Promise<{ bai: string }>;
}): Promise<ReactElement> {
  const { bai } = await params;
  const lesson = videoBySlug(bai);
  if (!lesson) notFound();

  return (
    <AppShell active="/video">
      <VideoWorkspace lesson={lesson} backHref="/video" />
    </AppShell>
  );
}
