import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVocabCourse } from "@/lib/demo-data/vocab";
import DeepSession from "@/components/sites/aioenglish/vocab/DeepSession";

// Nạp sâu ghi nhớ — the source's deep-learning vocab mode (multi-stage per word).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const c = getVocabCourse(course);
  return { title: c ? `Nạp sâu · ${c.title} · AIO English` : "Nạp sâu · AIO English" };
}

export default async function VocabDeepPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const c = getVocabCourse(course);
  if (!c) notFound();

  return (
    <div data-vocab-deep className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col" data-feature="tu-vung">
      <main id="main-content" className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <DeepSession courseKey={c.key} title={c.title} subtitle={c.subtitle} cards={c.cards} />
      </main>
    </div>
  );
}
