import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVocabCourse } from "@/lib/demo-data/vocab";
import VocabSession from "@/components/sites/aioenglish/vocab/VocabSession";

// Vocab flashcard session route — mirrors the source learn flow (/tu-vung/<course>/hoc).
// Courses: oxford-3000 (Oxford 3000 · B1) and toeic-600 (TOEIC 600 essential words),
// both assembled from public GitHub datasets.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const c = getVocabCourse(course);
  return { title: c ? `${c.title} · Từ vựng · AIO English` : "Từ vựng · AIO English" };
}

export default async function VocabLearnPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const c = getVocabCourse(course);
  if (!c) notFound();

  return (
    <div data-vocab-session className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col" data-feature="tu-vung">
      <main id="main-content" className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <VocabSession courseKey={c.key} title={c.title} subtitle={c.subtitle} cards={c.cards} />
      </main>
    </div>
  );
}
