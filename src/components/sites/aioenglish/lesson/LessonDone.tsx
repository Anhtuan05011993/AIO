"use client";

// Lesson completion screen — stats + actions (mirrors the source's post-lesson summary intent).
import Link from "next/link";
import type { Course } from "@/lib/demo-data/go-cau";
import type { LessonDifficulty, LessonMode } from "./LessonExperience";

export default function LessonDone({
  course,
  elapsed,
  mode,
  difficulty,
  accuracy,
  xp,
  backHref,
  onRestart,
  onSetup,
}: {
  course: Course;
  elapsed: number;
  mode: LessonMode;
  difficulty: LessonDifficulty;
  accuracy: number;
  xp: number;
  backHref: string;
  onRestart: () => void;
  onSetup: () => void;
}) {
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const modeLabel = mode === "default" ? "Mặc định" : mode === "listening" ? "Luyện nghe" : "Luyện nghe & nói";
  const diffLabel = difficulty === "basic" ? "Cơ bản" : difficulty === "intermediate" ? "Trung cấp" : "Nâng cao";

  return (
    <div data-lesson-done className="lp-root nb-lesson relative isolate flex h-dscreen flex-col" data-feature="go-cau">
      <main id="main-content" className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-md rounded-card-lg border-bw border-border-strong bg-surface p-6 text-center shadow-sh-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full lp-feat-soft text-3xl">🎉</div>
          <h1 className="font-hero mt-4 text-xl font-extrabold text-fg">Hoàn thành bài học!</h1>
          <p className="mt-1 text-sm font-semibold text-fg-muted">
            {course.course.title} · {course.statements.length} câu
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-card border-bw border-border lp-surface-60 px-2 py-3">
              <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Thời gian</dt>
              <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">{m}p {s}s</dd>
            </div>
            <div className="rounded-card border-bw border-border lp-surface-60 px-2 py-3">
              <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Chế độ</dt>
              <dd className="font-hero mt-1 text-sm font-extrabold text-fg">{modeLabel}</dd>
              <dd className="text-2xs font-semibold text-fg-muted">{diffLabel}</dd>
            </div>
            <div className="rounded-card border-bw border-border lp-surface-60 px-2 py-3">
              <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">XP (demo)</dt>
              <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">+{xp}</dd>
            </div>
          </dl>

          <p className="mt-3 text-xs text-fg-muted">
            Tiến độ là demo cục bộ — bản gốc lưu theo tài khoản trên server.
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={onRestart} className="btn-ink btn-ink-cta flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold">
              Học lại từ đầu
            </button>
            <button type="button" onClick={onSetup} className="tap-40 flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold text-fg hover:bg-surface-2">
              Đổi cách học
            </button>
            <Link href={backHref} className="tap-40 flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg">
              Về danh sách bài học
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
