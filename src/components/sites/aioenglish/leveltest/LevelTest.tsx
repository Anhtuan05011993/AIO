"use client";

// Kiểm tra lên cấp — 36 câu (typing + MCQ xen kẽ), đồng hồ 40 phút, kết quả đề xuất cấp.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LevelQuestion } from "@/app/lo-trinh/kiem-tra/page";
import { speak } from "../lesson/speech";

const TOTAL_SECONDS = 40 * 60;

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
}

export default function LevelTest({ questions }: { questions: LevelQuestion[] }) {
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Array<{ en: string; given: string; correct: boolean }>>([]);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(TOTAL_SECONDS);
  const startedAt = useRef(0);

  const q: LevelQuestion | undefined = questions[qi];

  useEffect(() => {
    if (phase !== "running") return;
    const t = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(t);
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  const commit = useCallback(
    (given: string) => {
      if (!q) return;
      const correct = norm(given) === norm(q.en);
      setAnswers((prev) => [...prev, { en: q.en, given, correct }]);
      setTyped("");
      setPicked(null);
      if (qi + 1 < questions.length) setQi(qi + 1);
      else setPhase("done");
    },
    [q, qi, questions.length],
  );

  const finish = useCallback(() => setPhase("done"), []);

  const score = answers.filter((a) => a.correct).length;
  const pct = answers.length === 0 ? 0 : Math.round((score / answers.length) * 100);
  const suggestion =
    pct >= 90
      ? { label: "Sẵn sàng lên B2!", tone: "text-[hsl(var(--success))]", next: "Đổi mục tiêu lên TOEIC 945 trong Cài đặt." }
      : pct >= 70
        ? { label: "Nền tảng B1 vững — thử thách phần B1+", tone: "text-[hsl(var(--warning))]", next: "Tiếp tục hoàn thành chặng B1 rồi kiểm tra lại." }
        : { label: "Ôn lại chặng B1 nhé", tone: "text-[hsl(var(--danger))]", next: "Làm các bài trong Kế hoạch hôm nay để củng cố nền tảng." };

  if (phase === "intro") {
    return (
      <div className="lp-ltroot mx-auto w-full max-w-xl px-4 py-8">
        <Link href="/lo-trinh" className="lp-vback tap-40 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg">
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          Về Lộ trình
        </Link>
        <h1 className="font-hero mt-3 text-2xl font-extrabold text-fg">Kiểm tra lên cấp.</h1>
        <p className="mt-1 text-sm font-semibold text-fg-muted">
          {questions.length} câu · 40 phút — trộn gõ câu và trắc nghiệm từ các khóa thật.
        </p>
        <section className="nbx-r-info isle mt-5 rounded-card-lg border-bw border-border-strong bg-surface p-6 shadow-sh-3">
          <ul className="grid gap-2 text-sm text-fg">
            <li className="rounded-card border-bw border-border bg-surface-2/60 px-4 py-2.5 lp-surface-60">• Nửa đề: <b>gõ lại câu</b> từ nghĩa tiếng Việt.</li>
            <li className="rounded-card border-bw border-border bg-surface-2/60 px-4 py-2.5 lp-surface-60">• Nửa đề: <b>trắc nghiệm</b> chọn nghĩa đúng.</li>
            <li className="rounded-card border-bw border-border bg-surface-2/60 px-4 py-2.5 lp-surface-60">• Hết giờ tự nộp bài. Kết quả gợi ý cấp độ, không chấm điểm vào lộ trình (demo).</li>
          </ul>
          <button
            type="button"
            onClick={() => { setPhase("running"); startedAt.current = Date.now(); }}
            className="btn-ink btn-ink-cta mt-5 flex h-12 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold"
          >
            Bắt đầu bài kiểm tra
          </button>
        </section>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="lp-ltroot mx-auto w-full max-w-xl px-4 py-10 text-center">
        <div className="lp-feat-soft mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl">🎓</div>
        <h1 className="font-hero mt-4 text-xl font-extrabold text-fg">Kết quả kiểm tra</h1>
        <p className="font-hero mt-2 text-4xl font-extrabold tabular-nums text-fg">{pct}%</p>
        <p className="mt-1 text-sm font-semibold text-fg-muted">{score}/{answers.length} câu đúng · tổng thời gian {fmt(TOTAL_SECONDS - left)}</p>
        <p className={`font-hero mt-4 text-lg font-extrabold ${suggestion.tone}`}>{suggestion.label}</p>
        <p className="mt-1 text-sm text-fg-muted">{suggestion.next}</p>
        {answers.some((a) => !a.correct) ? (
          <details className="mt-5 rounded-card border-bw border-border bg-surface p-4 text-left">
            <summary className="cursor-pointer text-sm font-bold text-fg">Xem các câu sai ({answers.filter((a) => !a.correct).length})</summary>
            <ul className="mt-3 grid gap-2">
              {answers.filter((a) => !a.correct).map((a, i) => (
                <li key={i} className="rounded-card border-bw border-border bg-surface-2/60 px-3 py-2 text-xs lp-surface-60">
                  <p className="font-semibold text-fg">{a.en}</p>
                  <p className="text-fg-muted">Bạn trả lời: {a.given || "(bỏ trống)"}</p>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/lo-trinh" className="btn-ink btn-ink-cta flex h-11 items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
            Về Lộ trình
          </Link>
          <Link href="/tong-quan" className="tap-40 flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((qi) / questions.length) * 100);
  return (
    <div className="lp-ltroot mx-auto flex w-full max-w-xl flex-col px-4 py-6">
      <div className="flex items-center justify-between text-xs font-bold text-fg-muted">
        <span>Câu {qi + 1} / {questions.length} · {q?.kind === "typing" ? "Gõ câu" : "Trắc nghiệm"}</span>
        <span className={"lp-timer tabular-nums " + (left < 300 ? "text-[hsl(var(--danger))]" : "")}>{fmt(left)}</span>
      </div>
      <div className="lp-vbar mt-2 h-2 w-full overflow-hidden rounded-pill border-bw border-border bg-surface-2">
        <div className="h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200" style={{ width: `${progressPct}%` }} />
      </div>

      {q ? (
        <section className="nbx-r-info isle mt-5 flex flex-col rounded-card-lg border-bw border-border-strong bg-surface p-6 shadow-sh-3">
          {q.kind === "typing" ? (
            <>
              <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Gõ lại câu tiếng Anh</p>
              <p className="mt-3 text-xl font-extrabold leading-snug text-fg">{q.vi}</p>
              <input
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && typed.trim()) commit(typed); }}
                aria-label="Ô nhập câu"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="lp-input mt-5 h-12 w-full rounded-card border-bw border-border-strong bg-surface px-4 text-center text-base font-bold text-fg outline-none focus:border-primary"
                placeholder="Type the English sentence…"
              />
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => speak(q.en)} className="tap-40 flex h-10 flex-1 items-center justify-center rounded-[var(--r-pill)] border-bw border-border bg-surface text-xs font-bold text-fg hover:bg-surface-2">
                  🔊 Nghe
                </button>
                <button type="button" onClick={() => commit(typed)} className="btn-ink flex h-10 flex-[2] items-center justify-center rounded-[var(--r-pill)] text-xs font-bold">
                  Trả lời
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Câu tiếng Anh này nghĩa là gì?</p>
              <p className="mt-3 text-lg font-extrabold leading-snug text-fg">{q.en}</p>
              <div className="mt-5 grid gap-2">
                {q.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => { setPicked(o); commit(o); }}
                    className={"rounded-card border-bw px-4 py-3 text-left text-sm font-bold transition-colors " + (picked === o ? "border-primary bg-[hsl(var(--feat)/0.1)] text-fg" : "border-border-strong bg-surface text-fg hover:bg-surface-2")}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => commit("")} className="mt-4 text-xs font-semibold text-fg-muted hover:text-fg">
                Bỏ qua câu này
              </button>
            </>
          )}
          <button type="button" onClick={finish} className="mt-6 text-2xs font-semibold text-fg-muted hover:text-fg">
            Nộp bài sớm
          </button>
        </section>
      ) : null}
    </div>
  );
}
