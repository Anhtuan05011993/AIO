"use client";

// Vocab flashcard session — "Nạp nhanh với Flashcard: lật thẻ, tự chấm, lặp lại trong phiên."
// SRS grading persists via the demo progress store (SM-2-lite).

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { VocabCard, VocabCourseKey } from "@/lib/demo-data/vocab";
import { dueCards, gradeCard, loadProgress, type Grade } from "@/lib/store/progress";
import { speak } from "../lesson/speech";

const SESSION_SIZE = 20;

const GRADES: Array<{ key: Grade; label: string; tone: string; hint: string }> = [
  { key: "again", label: "Lại", tone: "lp-g-again", hint: "<10 phút" },
  { key: "hard", label: "Khó", tone: "lp-g-hard", hint: "1 ngày" },
  { key: "good", label: "Tốt", tone: "lp-g-good", hint: "1 ngày" },
  { key: "easy", label: "Dễ", tone: "lp-g-easy", hint: "3 ngày" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabSession({
  courseKey,
  title,
  subtitle,
  cards,
}: {
  courseKey: VocabCourseKey;
  title: string;
  subtitle: string;
  cards: VocabCard[];
}) {
  const [phase, setPhase] = useState<"setup" | "playing" | "done">("setup");
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    setDueCount(dueCards(courseKey).length);
  }, [courseKey]);

  const start = useCallback(() => {
    const dueWords = new Set(dueCards(courseKey).map((c) => c.word));
    const due = cards.filter((c) => dueWords.has(c.word));
    const fresh = cards.filter((c) => !dueWords.has(c.word));
    const session = [...shuffle(due), ...shuffle(fresh)].slice(0, SESSION_SIZE);
    setQueue(session);
    setIdx(0);
    setFlipped(false);
    setTally({ again: 0, hard: 0, good: 0, easy: 0 });
    setPhase("playing");
  }, [cards, courseKey]);

  const card = queue[idx];

  const grade = useCallback(
    (g: Grade) => {
      if (!card) return;
      gradeCard(courseKey, card.word, g);
      setTally((t) => ({ ...t, [g]: t[g] + 1 }));
      if (idx + 1 < queue.length) {
        setIdx(idx + 1);
        setFlipped(false);
      } else {
        setPhase("done");
      }
    },
    [card, idx, queue.length, courseKey],
  );

  if (phase === "setup") {
    return (
      <div className="lp-vroot mx-auto w-full max-w-xl px-4 py-8">
        <Link href="/tong-quan" className="lp-vback tap-40 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg">
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          Về trang chủ
        </Link>
        <h1 className="font-hero mt-3 text-2xl font-extrabold text-fg">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-fg-muted">{subtitle}</p>
        <section className="nbx-r-info isle mt-5 rounded-card-lg border-bw border-border-strong bg-surface p-6 text-center shadow-sh-3">
          <p className="text-sm font-semibold text-fg-muted">Số thẻ trong bộ</p>
          <p className="font-hero mt-1 text-3xl font-extrabold text-fg">{cards.length}</p>
          {dueCount > 0 ? (
            <p className="mt-2 rounded-card border-bw border-border bg-surface-2 px-3 py-2 text-xs font-bold text-fg">
              🔁 {dueCount} thẻ đến hạn ôn (SRS) sẽ được ưu tiên
            </p>
          ) : null}
          <p className="mt-3 text-xs leading-relaxed text-fg-muted">
            Phiên học {SESSION_SIZE} thẻ: lật thẻ, tự chấm <b>Lại / Khó / Tốt / Dễ</b> — thẻ "Lại" quay lại trong phiên, lịch ôn giãn cách lưu cục bộ.
          </p>
          <button type="button" onClick={start} className="btn-ink btn-ink-cta mt-5 flex h-12 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
            Bắt đầu phiên học
          </button>
        </section>
      </div>
    );
  }

  if (phase === "done") {
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    return (
      <div className="lp-vroot mx-auto w-full max-w-xl px-4 py-10 text-center">
        <div className="lp-feat-soft mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl">🃏</div>
        <h1 className="font-hero mt-4 text-xl font-extrabold text-fg">Xong phiên học!</h1>
        <p className="mt-1 text-sm font-semibold text-fg-muted">{total} thẻ đã chấm · lịch ôn đã cập nhật</p>
        <dl className="mt-5 grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <div key={g.key} className="rounded-card border-bw border-border bg-surface px-2 py-3">
              <dt className={`text-xs font-extrabold ${g.tone}`}>{g.label}</dt>
              <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">{tally[g.key]}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={start} className="btn-ink btn-ink-cta flex h-11 items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
            Học tiếp 20 thẻ nữa
          </button>
          <Link href="/tong-quan" className="tap-40 flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!card) return null;
  const pct = Math.round(((idx + (flipped ? 0.5 : 0)) / queue.length) * 100);

  return (
    <div className="lp-vroot mx-auto flex w-full max-w-xl flex-col px-4 py-6">
      <div className="flex items-center justify-between text-xs font-bold text-fg-muted">
        <span>Thẻ {idx + 1} / {queue.length}</span>
        <span>{dueCount > 0 && idx < dueCount ? "Đang ôn thẻ đến hạn" : "Thẻ mới"}</span>
      </div>
      <div className="lp-vbar mt-2 h-2 w-full overflow-hidden rounded-pill border-bw border-border bg-surface-2">
        <div className="h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>

      <button
        type="button"
        onClick={() => { setFlipped(!flipped); if (!flipped) speak(card.word); }}
        className="lp-vcard isle mt-5 block w-full rounded-card-lg border-bw border-border-strong bg-surface p-6 text-center shadow-sh-3"
        aria-label={flipped ? "Ẩn nghĩa" : "Lật thẻ xem nghĩa"}
      >
        {card.topic && !flipped ? <span className="lp-vtopic rounded-pill border-bw border-border px-2 py-0.5 text-2xs font-bold text-fg-muted">{card.topic}</span> : null}
        <p className="font-hero mt-3 text-3xl font-extrabold text-fg">{card.word}</p>
        {card.ipa && !flipped ? <p className="font-ipa ipa-tone mt-2 text-sm text-fg-muted">{card.ipa}</p> : null}
        {card.pos && !flipped ? <p className="mt-1 text-xs font-bold text-fg-muted">{card.pos}</p> : null}

        {flipped ? (
          <div className="mt-4 border-t-bw border-border pt-4">
            <p className="text-xl font-extrabold text-fg">{card.vi || "—"}</p>
            {card.explain ? <p className="mt-2 text-sm leading-relaxed text-fg-muted">{card.explain}</p> : null}
            {card.example ? (
              <div className="lp-surface-60 mt-3 rounded-card bg-surface-2 px-4 py-3 text-left">
                <p className="text-sm font-semibold text-fg">{card.example}</p>
                {card.exampleVi ? <p className="mt-1 text-xs text-fg-muted">{card.exampleVi}</p> : null}
              </div>
            ) : null}
            {card.level ? <p className="mt-2 text-2xs font-bold uppercase tracking-wide text-fg-muted">CEFR {card.level}</p> : null}
          </div>
        ) : (
          <p className="mt-6 text-xs font-semibold text-fg-muted">Chạm để lật thẻ</p>
        )}
      </button>

      {flipped ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <button key={g.key} type="button" onClick={() => grade(g.key)} className={`lp-vgrade ${g.tone} flex flex-col items-center rounded-card border-bw border-border-strong bg-surface px-2 py-2.5 shadow-sh-1`}>
              <span className="text-sm font-extrabold">{g.label}</span>
              <span className="mt-0.5 text-2xs font-semibold text-fg-muted">{g.hint}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" onClick={() => speak(card.word)} className="tap-40 flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] border-bw border-border bg-surface px-4 text-xs font-bold text-fg hover:bg-surface-2">
            🔊 Phát âm
          </button>
          <button type="button" onClick={() => setFlipped(true)} className="btn-ink flex h-10 items-center rounded-[var(--r-pill)] px-5 text-xs font-bold">
            Hiện nghĩa
          </button>
        </div>
      )}
    </div>
  );
}
