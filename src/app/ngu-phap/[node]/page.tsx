import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import GrammarReader from "@/components/sites/aioenglish/grammar/GrammarReader";
import { buildGrammarLesson, grammarNodeIds } from "@/lib/demo-data/grammar/lesson";

/**
 * /ngu-phap/[node] — trang đọc bài ngữ pháp (reader tĩnh).
 *
 * - generateStaticParams từ 167 node của catalog (đủ 6 cấp A1→C2) → build tĩnh,
 *   không gặp node lạ khi build.
 * - Node không tồn tại (route lạ lúc runtime) → notFound().
 */
export function generateStaticParams(): Array<{ node: string }> {
  return grammarNodeIds().map((node) => ({ node }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ node: string }>;
}): Promise<Metadata> {
  const { node } = await params;
  const lesson = await buildGrammarLesson(node);
  if (!lesson) {
    return { title: "Luyện ngữ pháp — AIO English" };
  }
  return {
    title: `${lesson.node.title} · Ngữ pháp ${lesson.node.level} · AIO English`,
    description: `Bài hướng dẫn ngữ pháp cấp ${lesson.node.level}: ${lesson.node.title} (${lesson.node.titleEn}).`,
  };
}

export default async function GrammarNodePage({
  params,
}: {
  params: Promise<{ node: string }>;
}): Promise<ReactElement> {
  const { node } = await params;
  const lesson = await buildGrammarLesson(node);
  if (!lesson) notFound();
  return (
    <AppShell active="/ngu-phap">
      <GrammarReader lesson={lesson} />
    </AppShell>
  );
}
