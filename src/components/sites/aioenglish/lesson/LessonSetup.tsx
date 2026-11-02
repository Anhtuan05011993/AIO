"use client";

// "Chọn cách học" setup screen — mirrors the source lesson setup flow
// (mode: Mặc định / Luyện nghe / Luyện nghe & nói; difficulty: Cơ bản / Trung cấp / Nâng cao).
import Link from "next/link";
import type { Course } from "@/lib/demo-data/go-cau";
import type { LessonDifficulty, LessonMode } from "./LessonExperience";

const MODES: Array<{ key: LessonMode; title: string; desc: string }> = [
  { key: "default", title: "Mặc định", desc: "Hiện nghĩa tiếng Việt, gõ lại câu mẫu." },
  { key: "listening", title: "Luyện nghe", desc: "Ẩn nghĩa, nghe rồi viết lại." },
  { key: "listening-speaking", title: "Luyện nghe & nói", desc: "Ẩn nghĩa, nghe rồi nói lại." },
];

const DIFFS: Array<{ key: LessonDifficulty; title: string; desc: string }> = [
  { key: "basic", title: "Cơ bản", desc: "Từ vựng → Mảnh câu → Câu hoàn chỉnh" },
  { key: "intermediate", title: "Trung cấp", desc: "Từ vựng → Câu hoàn chỉnh" },
  { key: "advanced", title: "Nâng cao", desc: "Câu hoàn chỉnh" },
];

export default function LessonSetup({
  course,
  backHref,
  breadcrumb,
  mode,
  difficulty,
  onMode,
  onDifficulty,
  onStart,
}: {
  course: Course;
  backHref: string;
  breadcrumb: string[];
  mode: LessonMode;
  difficulty: LessonDifficulty;
  onMode: (m: LessonMode) => void;
  onDifficulty: (d: LessonDifficulty) => void;
  onStart: () => void;
}) {
  return (
    <div data-lesson-setup className="lp-root nb-lesson relative isolate flex h-dscreen flex-col" data-feature="go-cau">
      <main id="main-content" className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-6">
        <div className="w-full max-w-2xl">
          <Link href={backHref} className="lp-breadcrumb tap-40 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg">
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            {breadcrumb[breadcrumb.length - 1]}
          </Link>
          <div className="lp-breadcrumb-row mt-2 flex flex-wrap items-center gap-1 text-xs font-semibold text-fg-muted" aria-label={breadcrumb.join(" / ")}>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                <span className={i === breadcrumb.length - 1 ? "text-fg" : undefined}>{b}</span>
              </span>
            ))}
          </div>
          <h1 className="font-hero mt-3 text-2xl font-extrabold leading-tight text-fg">{course.course.title}</h1>
          <p className="mt-1 text-sm font-semibold text-fg-muted">
            Gõ câu · {course.course.packTitle} · {course.statements.length} câu
          </p>

          <section className="nbx-r-info isle mt-5 rounded-card border-bw border-border-strong bg-surface p-5 shadow-sh-2" aria-label="Chọn cách học">
            <h2 className="font-hero text-lg font-extrabold text-fg">Chọn cách học</h2>
            <p className="mt-1 text-sm text-fg-muted">{course.course.title}</p>

            <div className="mt-4 grid gap-2" role="group" aria-label="Chế độ học">
              <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Chế độ học</p>
              {MODES.map((m) => {
                const active = m.key === mode;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => onMode(m.key)}
                    aria-pressed={active}
                    className={`lp-choice flex items-start gap-3 rounded-card border-bw px-4 py-3 text-left transition-colors ${active ? "lp-choice-on border-border-strong bg-surface-2 shadow-sh-1" : "border-border bg-surface hover:bg-surface-2"}`}
                  >
                    <span className={`lp-radio mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-primary" : "border-border-strong"}`}>
                      {active ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-fg">{m.title}</span>
                      <span className="block text-xs text-fg-muted">{m.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-2" role="group" aria-label="Độ khó">
              <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Độ khó</p>
              {DIFFS.map((d) => {
                const active = d.key === difficulty;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => onDifficulty(d.key)}
                    aria-pressed={active}
                    className={`lp-choice flex items-start gap-3 rounded-card border-bw px-4 py-3 text-left transition-colors ${active ? "lp-choice-on border-border-strong bg-surface-2 shadow-sh-1" : "border-border bg-surface hover:bg-surface-2"}`}
                  >
                    <span className={`lp-radio mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-primary" : "border-border-strong"}`}>
                      {active ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-fg">{d.title}</span>
                      <span className="block text-xs text-fg-muted">{d.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link href={backHref} className="tap-40 flex h-11 items-center rounded-[var(--r-pill)] px-4 text-sm font-bold text-fg hover:bg-surface-2">
                Quay lại
              </Link>
              <button
                type="button"
                onClick={onStart}
                className="btn-ink btn-ink-cta flex h-11 items-center rounded-[var(--r-pill)] px-6 text-sm font-bold whitespace-nowrap"
              >
                Bắt đầu
              </button>
            </div>
          </section>

          <p className="mt-4 text-center text-xs text-fg-muted">
            Độ khó Cơ bản đi từ từ vựng → mảnh câu → câu hoàn chỉnh, đúng như ứng dụng gốc.
          </p>
        </div>
      </main>
    </div>
  );
}
