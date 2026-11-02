import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVocabCourse } from "@/lib/demo-data/vocab";
import AppShell from "@/components/sites/aioenglish/app/AppShell";

// Vocab course overview — mirrors the source course page (levels/topics grid collapsed to
// a single overview + start button because the demo ships one full deck per course).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const c = getVocabCourse(course === "oxford-3000" ? "oxford-3000-a1" : course === "toeic-band-550-784" ? "toeic-600" : course);
  return {
    title: c ? `${c.title} · Từ vựng · AIO English` : "Từ vựng · AIO English",
  };
}

export default async function VocabCoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const c = getVocabCourse(course === "oxford-3000" ? "oxford-3000-a1" : course === "toeic-band-550-784" ? "toeic-600" : course);
  if (!c)
    return (
      <AppShell active="/tu-vung">
        <section className="ui-sheet">
          <h1>Nội dung chưa được bổ sung</h1>
          <p>Bạn có thể chọn một bộ từ vựng khác.</p>
          <Link href="/tu-vung" className="nbc-btn">
            Về Từ vựng
          </Link>
        </section>
      </AppShell>
    );

  const topics = [
    ...new Set(c.cards.map((x) => x.topic).filter(Boolean)),
  ].slice(0, 12);

  return (
    <AppShell active="/tu-vung">
      <div className="lp-vroot">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-fg-muted">
          <Link href="/tong-quan" className="hover:text-fg">
            Trang chủ
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tu-vung" className="hover:text-fg">
            Từ vựng
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-fg">{c.title}</span>
        </div>
        <h1 className="font-hero mt-2 text-2xl font-extrabold leading-tight text-fg">
          {c.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm font-semibold text-fg-muted">
          {c.subtitle}
        </p>

        <section className="nbx-r-info isle mt-5 rounded-card-lg border-bw border-border-strong bg-surface p-6 shadow-sh-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-fg-muted">
                Số thẻ trong bộ
              </p>
              <p className="font-hero mt-1 text-3xl font-extrabold text-fg">
                {c.cards.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/tu-vung/${c.key}/hoc-sau`}
                className="flex h-12 items-center rounded-[var(--r-pill)] border-bw border-border-strong bg-surface px-5 text-sm font-bold text-fg hover:bg-surface-2"
              >
                Nạp sâu ghi nhớ
              </Link>
              <Link
                href={`/tu-vung/${c.key}/hoc`}
                className="btn-ink btn-ink-cta flex h-12 items-center rounded-[var(--r-pill)] px-6 text-sm font-bold"
              >
                Flashcard
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-fg-muted">
            Hai cách học: <b>Nạp sâu ghi nhớ</b> (4 bước mỗi từ: làm quen → chọn
            nghĩa → chọn từ → gõ) và <b>Nạp nhanh với Flashcard</b> (lật thẻ, tự
            chấm Lại / Khó / Tốt / Dễ — thẻ "Lại" quay lại trong phiên, lịch ôn
            giãn cách (SRS) lưu cục bộ).
          </p>
          {topics.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <span
                  key={t}
                  className="rounded-pill border-bw border-border bg-surface-2 px-2.5 py-1 text-2xs font-bold text-fg-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
