"use client";

// Mục lục bài học — drawer listing every statement (EN + VN) with jump + play audio.
import { useEffect } from "react";
import type { Course } from "@/lib/demo-data/go-cau";
import type { LessonDifficulty } from "./LessonExperience";
import { buildSteps } from "./LessonExperience";
import { speak } from "./speech";

export default function TocDrawer({
  open,
  onClose,
  course,
  difficulty,
  current,
  doneIds,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  course: Course;
  difficulty: LessonDifficulty;
  current: number;
  doneIds: Set<string>;
  onJump: (statementIndex: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lp-dlg" role="dialog" aria-modal="true" aria-label="Mục lục bài học">
      <button type="button" className="lp-dlg-overlay" onClick={onClose} aria-label="Đóng" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-bw border-border-strong bg-surface lp-sh-pop">
        <div className="flex items-center justify-between border-b-bw border-border px-4 py-3">
          <h2 className="font-hero text-md font-extrabold text-fg">Mục lục bài học</h2>
          <button type="button" onClick={onClose} className="tap-40 flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg" aria-label="Đóng">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {course.statements.map((st, i) => {
            const isDone = doneIds.has(st.id);
            const isCurrent = i === current;
            const stepCount = buildSteps(st, difficulty).length;
            return (
              <div key={st.id} className="mb-1 flex items-stretch gap-1">
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={
                    "lp-tocitem flex min-w-0 flex-1 items-center gap-3 rounded-card border-bw px-3 py-2.5 text-left transition-colors " +
                    (isCurrent ? "border-border-strong bg-surface-2 shadow-sh-1" : "border-transparent hover:bg-surface-2")
                  }
                >
                  <span className={"grid h-6 w-6 shrink-0 place-items-center rounded-full text-2xs font-extrabold " + (isDone ? "bg-[hsl(var(--feat))] text-primary-fg" : isCurrent ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg-muted")}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-fg">{st.text}</span>
                    <span className="block truncate text-xs text-fg-muted">{st.translation}</span>
                    <span className="mt-0.5 block text-2xs font-semibold text-fg-muted">{stepCount} bước</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => speak(st.text)}
                  className="tap-40 mt-1 mb-1 flex w-9 shrink-0 items-center justify-center rounded-card text-fg-muted hover:bg-surface-2 hover:text-fg"
                  aria-label={`Phát âm câu ${i + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
