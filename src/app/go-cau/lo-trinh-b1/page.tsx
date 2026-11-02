import type { Metadata } from "next";
import Link from "next/link";
import { PACK_B1 } from "@/lib/demo-data/go-cau";
import { AVAILABLE_COURSE_IDS } from "@/lib/demo-data/go-cau";

export const metadata: Metadata = {
  title: "Tiếng Anh trung cấp (B1) · Gõ câu · AIO English",
};

// Pack index — list of courses in the B1 typing pack.
// Courses with extracted data (40/80) are marked "có data" and playable; the rest were rate-limited.
export default function GoCauPackPage() {
  const courses = PACK_B1.courses;
  const withData = new Set<string>(AVAILABLE_COURSE_IDS);

  return (
    <div data-lesson-player className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col" data-feature="go-cau">
      <main id="main-content" className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-fg-muted" aria-label="Gõ câu / Tiếng Anh trung cấp (B1)">
          <Link href="/go-cau" className="hover:text-fg">Gõ câu</Link>
          <span aria-hidden="true">/</span>
          <span className="text-fg">Tiếng Anh trung cấp (B1)</span>
        </div>
        <h1 className="font-hero mt-2 text-2xl font-extrabold leading-tight text-fg">Tiếng Anh trung cấp (B1).</h1>
        <p className="mt-1 max-w-2xl text-sm font-semibold text-fg-muted">
          {courses.length} bài gõ câu theo lộ trình — mỗi bài là một chủ điểm ngữ pháp. Cả {withData.size} bài đều có data đầy đủ (EN · VN · IPA · các cách gõ chấp nhận).
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {courses.map((c) => {
            const has = withData.has(c.id);
            const inner = (
              <>
                <span className="flex items-center gap-2">
                  <span className="font-hero text-md font-extrabold text-fg">{c.title}</span>
                  {has ? (
                    <span className="rounded-pill lp-feat-soft px-2 py-0.5 text-2xs font-extrabold text-primary">Có data</span>
                  ) : null}
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-fg-muted">
                  <span className="rounded-pill border-bw border-border px-2 py-0.5">{c.total} câu</span>
                  <span className="truncate">{c.slug}</span>
                </span>
              </>
            );
            return has ? (
              <Link key={c.id} href={`/go-cau/lo-trinh-b1/${c.id}`} className="lp-packitem isle nbx-r-ivory block rounded-card border-bw border-border-strong bg-surface px-4 py-3.5 shadow-sh-1">
                {inner}
              </Link>
            ) : (
              <div key={c.id} className="isle nbx-r-ivory block rounded-card border-bw border-border lp-surface-70 px-4 py-3.5 opacity-80" aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
