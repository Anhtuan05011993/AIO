"use client";

// Top HUD of the playing session — mirrors the source lesson header:
// breadcrumb, "Câu X / N", progressbar, timer, Tạm dừng / Cài đặt / Toàn màn hình.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course } from "@/lib/demo-data/go-cau";

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PlayerHud({
  course,
  statementIdx,
  totalSentences,
  elapsed,
  backHref,
  onToc,
  onQuit,
}: {
  course: Course;
  statementIdx: number;
  totalSentences: number;
  elapsed: number;
  backHref: string;
  onToc: () => void;
  onQuit: () => void;
}) {
  const [fs, setFs] = useState(false);
  useEffect(() => {
    const h = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const pct = Math.round(((statementIdx + 1) / totalSentences) * 100);

  return (
    <header data-lesson-hud className="lp-hud relative z-20 shrink-0 border-b-bw border-border-strong ">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2.5 md:px-6">
        <Link href={backHref} className="tap-40 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg" aria-label="Về danh sách bài học">
          <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h1 className="font-hero truncate text-md font-extrabold leading-tight text-fg">{course.course.title}</h1>
            <span className="hidden shrink-0 text-xs font-semibold text-fg-muted sm:inline">
              Câu {statementIdx + 1} / {totalSentences}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="lp-hud-bar h-2 w-full overflow-hidden rounded-pill border-bw border-border bg-surface-2">
              <div className="h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="shrink-0 text-2xs font-bold tabular-nums text-fg-muted sm:hidden">{statementIdx + 1}/{totalSentences}</span>
          </div>
        </div>
        <span className="lp-timer shrink-0 text-sm font-bold tabular-nums text-fg-muted" aria-label="Thời gian">{fmt(elapsed)}</span>
        <button type="button" onClick={onToc} className="tap-40 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg" aria-label="Mục lục bài học">
          <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" />
          </svg>
        </button>
        <button type="button" onClick={onQuit} className="tap-40 hidden h-9 items-center rounded-[var(--r-pill)] px-3 text-xs font-bold text-fg-muted hover:bg-surface-2 hover:text-fg sm:flex" aria-label="Tạm dừng và quay lại cài đặt">
          Tạm dừng
        </button>
        <button
          type="button"
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else void document.documentElement.requestFullscreen().catch(() => undefined);
          }}
          className="tap-40 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg"
          aria-label={fs ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {fs ? (
            <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
