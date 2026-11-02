import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import GrammarPractice from "@/components/sites/aioenglish/grammar/GrammarPractice";
import { buildGrammarLesson, grammarNodeIds } from "@/lib/demo-data/grammar/lesson";
import { getRealLesson } from "@/lib/demo-data/grammar/realLessons";

/**
 * /ngu-phap/[node]/luyen-tap — phòng luyện tập 4 chế độ trên bài tập thật
 * (pools trong realLessons). SSG đủ 167 node như trang đọc.
 * realLessons chỉ được import ở SERVER (8.2MB JSON) — client nhận data
 * của node qua props để bundle route gọn.
 */
export async function generateStaticParams(): Promise<{ node: string }[]> {
  return grammarNodeIds().map((node) => ({ node }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ node: string }>;
}): Promise<Metadata> {
  const { node: nodeId } = await params;
  const lesson = await buildGrammarLesson(nodeId);
  return {
    title: lesson ? `Luyện tập · ${lesson.node.title} · Ngữ pháp · AIO English` : "Luyện tập · Ngữ pháp · AIO English",
  };
}

export default async function GrammarPracticePage({
  params,
}: {
  params: Promise<{ node: string }>;
}) {
  const { node: nodeId } = await params;
  const lesson = await buildGrammarLesson(nodeId);
  if (!lesson) notFound();
  const real = getRealLesson(nodeId) ?? null;

  return (
    <AppShell active="/ngu-phap">
      <GrammarPractice node={lesson.node} real={real} backHref={`/ngu-phap/${lesson.node.id}`} />
    </AppShell>
  );
}
