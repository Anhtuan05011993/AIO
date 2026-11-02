import type { Metadata } from "next";
import Link from "next/link";
import ContentNotice from "@/components/sites/aioenglish/app/ContentNotice";
import { PACK_A1 } from "@/lib/demo-data/go-cau";

export const metadata: Metadata = {
  title: "Tiếng Anh cho người mới (A1) · Gõ câu · AIO English",
};

// Pack index A1 — 96 khóa / 8 chương (cấu trúc trích từ site, chụp 01/11).
// CHƯA có nội dung statements — thẻ hiển thị "Chưa trích" và chưa link vào player.
export default function GoCauPackA1Page() {
  const courses = PACK_A1.courses;
  const chapters = [...new Set(courses.map((c) => c.chapter ?? ""))];
  const total = courses.reduce((s, c) => s + c.total, 0);

  return (
    <div
      data-lesson-player
      className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col"
      data-feature="go-cau"
    >
      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6"
      >
        <div
          className="flex flex-wrap items-center gap-2 text-xs font-semibold text-fg-muted"
          aria-label="Gõ câu / Tiếng Anh cho người mới (A1)"
        >
          <Link href="/go-cau" className="hover:text-fg">
            Gõ câu
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-fg">Tiếng Anh cho người mới (A1)</span>
        </div>
        <h1 className="font-hero mt-2 text-2xl font-extrabold leading-tight text-fg">
          Tiếng Anh cho người mới (A1).
        </h1>
        <p className="mt-1 max-w-2xl text-sm font-semibold text-fg-muted">
          {courses.length} bài gõ câu theo lộ trình,{" "}
          {total.toLocaleString("vi-VN")} câu theo 8 chương.
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {courses.map((c) => (
            <div
              key={c.id}
              className="isle nbx-r-ivory block rounded-card border-bw border-border lp-surface-70 px-4 py-3.5 "
            >
              <span className="flex items-center gap-2">
                <span className="font-hero text-md font-extrabold text-fg">
                  {c.title}
                </span>
                <ContentNotice>Bắt đầu</ContentNotice>
              </span>
              <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-fg-muted">
                <span className="rounded-pill border-bw border-border px-2 py-0.5">
                  {c.total} câu
                </span>
                <span className="truncate">{c.chapter}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs font-semibold text-fg-muted">
          Chương: {chapters.filter(Boolean).join(" · ")}
        </p>
      </main>
    </div>
  );
}
