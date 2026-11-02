"use client";

// Nạp sâu ghi nhớ — multi-stage word learning (the source's second vocab mode):
// flashcard present → MCQ EN→VN → MCQ VN→EN → typing. 10 words per session.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { VocabCard, VocabCourseKey } from "@/lib/demo-data/vocab";
import { dueCards, gradeCard, type Grade } from "@/lib/store/progress";
import { speak } from "../lesson/speech";

const SESSION_SIZE = 10;
const STAGES = ["present", "mcq-en-vi", "mcq-vi-en", "typing"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_LABEL: Record<Stage, string> = {
  present: "Làm quen",
  "mcq-en-vi": "Chọn nghĩa",
  "mcq-vi-en": "Chọn từ",
  typing: "Gõ từ",
};

type Tally = { good: number; hard: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();
}

export default function DeepSession({
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
  const [wi, setWi] = useState(0); // word index
  const [si, setSi] = useState(0); // stage index
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [wrongFlash, setWrongFlash] = useState(false);
  const [tally, setTally] = useState<Tally>({ good: 0, hard: 0 });
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    setDueCount(dueCards(courseKey).length);
  }, [courseKey]);

  const start = useCallback(() => {
    const dueWords = new Set(dueCards(courseKey).map((c) => c.word));
    const due = cards.filter((c) => dueWords.has(c.word));
    const fresh = cards.filter((c) => !dueWords.has(c.word));
    setQueue([...shuffle(due), ...shuffle(fresh)].slice(0, SESSION_SIZE));
    setWi(0);
    setSi(0);
    setPicked(null);
    setTyped("");
    setTally({ good: 0, hard: 0 });
    setPhase("playing");
  }, [cards, courseKey]);

  const word = queue[wi];
  const stage: Stage = STAGES[si];
  const allDone = phase === "playing" && wi >= queue.length;

  const options = useMemo(() => {
    if (!word || stage === "present" || stage === "typing") return [];
    const pool = cards.filter((c) => c.word !== word.word);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([word, ...distractors]);
  }, [word, stage, cards]);

  const finishWord = useCallback(
    (hadWrong: boolean) => {
      const g: Grade = hadWrong ? "hard" : "good";
      gradeCard(courseKey, word.word, g);
      setTally((t) => ({ good: t.good + (hadWrong ? 0 : 1), hard: t.hard + (hadWrong ? 1 : 0) }));
      if (wi + 1 < queue.length) {
        setWi(wi + 1);
        setSi(0);
        setPicked(null);
        setTyped("");
      } else {
        setPhase("done");
      }
    },
    [courseKey, word, wi, queue.length],
  );

  const advanceStage = useCallback(
    (hadWrong: boolean) => {
      if (si + 1 < STAGES.length) {
        setSi(si + 1);
        setPicked(null);
        setTyped("");
        if (hadWrong) setWrongFlash(true);
        window.setTimeout(() => setWrongFlash(false), 350);
      } else {
        finishWord(hadWrong);
      }
    },
    [si, finishWord],
  );

  useEffect(() => {
    if (phase === "playing" && word && stage === "present") speak(word.word);
  }, [phase, word, stage]);

  if (phase === "setup") {
    return (
      <div className="lp-dsroot mx-auto w-full max-w-xl px-4 py-8">
        <Link href={`/tu-vung/${courseKey}`} className="lp-vback tap-40 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg">
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          Về khóa học
        </Link>
        <h1 className="font-hero mt-3 text-2xl font-extrabold text-fg">Nạp sâu ghi nhớ.</h1>
        <p className="mt-1 text-sm font-semibold text-fg-muted">{title} — {subtitle}</p>
        <section className="nbx-r-info isle mt-5 rounded-card-lg border-bw border-border-strong bg-surface p-6 text-center shadow-sh-3">
          <p className="text-sm font-semibold text-fg-muted">Mỗi từ đi qua 4 bước</p>
          <ol className="mt-3 grid gap-2 text-left">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-card border-bw border-border bg-surface-2/60 px-4 py-2.5 lp-surface-60">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--feat))] text-2xs font-extrabold text-primary-fg lp-feat-soft">{i + 1}</span>
                <span className="text-sm font-bold text-fg">{STAGE_LABEL[s]}</span>
                <span className="ml-auto text-2xs font-semibold text-fg-muted">
                  {s === "present" ? "Gặp từ + nghĩa + phát âm" : s === "mcq-en-vi" ? "Chọn nghĩa tiếng Việt" : s === "mcq-vi-en" ? "Chọn từ tiếng Anh" : "Gõ lại từ"}
                </span>
              </li>
            ))}
          </ol>
          {dueCount > 0 ? (
            <p className="mt-3 rounded-card border-bw border-border bg-surface-2 px-3 py-2 text-xs font-bold text-fg">
              🔁 {dueCount} thẻ đến hạn ôn sẽ được ưu tiên
            </p>
          ) : null}
          <button type="button" onClick={start} className="btn-ink btn-ink-cta mt-5 flex h-12 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
            Bắt đầu nạp sâu ({SESSION_SIZE} từ)
          </button>
        </section>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="lp-dsroot mx-auto w-full max-w-xl px-4 py-10 text-center">
        <div className="lp-feat-soft mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl">🧠</div>
        <h1 className="font-hero mt-4 text-xl font-extrabold text-fg">Xong phiên nạp sâu!</h1>
        <p className="mt-1 text-sm font-semibold text-fg-muted">
          {queue.length} từ · {tally.good} thuộc ngay · {tally.hard} cần ôn thêm
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={start} className="btn-ink btn-ink-cta flex h-11 items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
            Nạp tiếp 10 từ
          </button>
          <Link href={`/tu-vung/${courseKey}`} className="tap-40 flex h-11 items-center justify-center rounded-[var(--r-pill)] px-6 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg">
            Về khóa học
          </Link>
        </div>
      </div>
    );
  }

  if (allDone || !word) return null;
  const stepNum = wi * STAGES.length + si + 1;
  const totalSteps = queue.length * STAGES.length;
  const pct = Math.round((stepNum / totalSteps) * 100);

  return (
    <div className="lp-dsroot mx-auto flex w-full max-w-xl flex-col px-4 py-6">
      <div className="flex items-center justify-between text-xs font-bold text-fg-muted">
        <span>Từ {wi + 1} / {queue.length} · {STAGE_LABEL[stage]}</span>
        <span>{stepNum}/{totalSteps} bước</span>
      </div>
      <div className="lp-vbar mt-2 h-2 w-full overflow-hidden rounded-pill border-bw border-border bg-surface-2">
        <div className="h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>

      <section className={"nbx-r-info isle mt-5 flex min-h-72 flex-col rounded-card-lg border-bw border-border-strong bg-surface p-6 text-center shadow-sh-3 " + (wrongFlash ? "lp-shake" : "")}>
        {stage === "present" ? (
          <>
            <p className="font-hero text-3xl font-extrabold text-fg">{word.word}</p>
            <p className="font-ipa ipa-tone mt-2 text-sm text-fg-muted">{word.ipa || word.pos}</p>
            <p className="mt-4 text-xl font-extrabold text-fg">{word.vi || "(demo)"}</p>
            {word.example ? (
              <div className="lp-surface-60 mt-4 rounded-card px-4 py-3 text-left">
                <p className="text-sm font-semibold text-fg">{word.example}</p>
                {word.exampleVi ? <p className="mt-1 text-xs text-fg-muted">{word.exampleVi}</p> : null}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => advanceStage(false)}
              className="btn-ink btn-ink-cta mt-auto flex h-11 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold"
            >
              Đã hiểu — tiếp
            </button>
          </>
        ) : null}

        {stage === "mcq-en-vi" && word ? (
          <>
            <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Nghĩa của từ này là gì?</p>
            <p className="font-hero mt-2 text-3xl font-extrabold text-fg">{word.word}</p>
            {word.ipa ? <p className="font-ipa ipa-tone mt-1 text-sm text-fg-muted">{word.ipa}</p> : null}
            <div className="mt-5 grid gap-2">
              {options.map((o) => {
                const isPicked = picked === o.word;
                const correct = o.word === word.word;
                return (
                  <button
                    key={o.word}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => { setPicked(o.word); if (correct) speak(word.word); }}
                    className={
                      "rounded-card border-bw px-4 py-3 text-left text-sm font-bold transition-colors " +
                      (picked
                        ? correct
                          ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.12)] text-fg"
                          : isPicked
                            ? "border-[hsl(var(--danger))] bg-[hsl(var(--danger)/0.12)] text-fg"
                            : "border-border bg-surface text-fg-muted"
                        : "border-border-strong bg-surface text-fg hover:bg-surface-2")
                    }
                  >
                    {o.vi || o.word}
                  </button>
                );
              })}
            </div>
            {picked ? (
              <button type="button" onClick={() => advanceStage(picked !== word.word)} className="btn-ink mt-5 flex h-11 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
                {picked === word.word ? "Đúng — tiếp" : "Xem đáp án — tiếp"}
              </button>
            ) : null}
          </>
        ) : null}

        {stage === "mcq-vi-en" && word ? (
          <>
            <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Từ tiếng Anh nào nghĩa là…</p>
            <p className="font-hero mt-2 text-2xl font-extrabold text-fg">{word.vi || "(demo)"}</p>
            <div className="mt-5 grid gap-2">
              {options.map((o) => {
                const isPicked = picked === o.word;
                const correct = o.word === word.word;
                return (
                  <button
                    key={o.word}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => setPicked(o.word)}
                    className={
                      "rounded-card border-bw px-4 py-3 text-left text-sm font-bold transition-colors " +
                      (picked
                        ? correct
                          ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.12)] text-fg"
                          : isPicked
                            ? "border-[hsl(var(--danger))] bg-[hsl(var(--danger)/0.12)] text-fg"
                            : "border-border bg-surface text-fg-muted"
                        : "border-border-strong bg-surface text-fg hover:bg-surface-2")
                    }
                  >
                    {o.word}
                  </button>
                );
              })}
            </div>
            {picked ? (
              <button type="button" onClick={() => advanceStage(picked !== word.word)} className="btn-ink mt-5 flex h-11 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold">
                {picked === word.word ? "Đúng — tiếp" : "Xem đáp án — tiếp"}
              </button>
            ) : null}
          </>
        ) : null}

        {stage === "typing" && word ? (
          <>
            <p className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Gõ lại từ này</p>
            <p className="font-hero mt-2 text-2xl font-extrabold text-fg">{word.vi || word.word}</p>
            {word.ipa ? <p className="font-ipa ipa-tone mt-1 text-sm text-fg-muted">{word.ipa}</p> : null}
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && norm(typed) === norm(word.word)) advanceStage(norm(typed) !== norm(word.word));
              }}
              aria-label="Ô gõ từ"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="lp-input mt-4 h-12 w-full rounded-card border-bw border-border-strong bg-surface px-4 text-center text-lg font-bold text-fg outline-none focus:border-primary"
              placeholder="Gõ từ tiếng Anh…"
            />
            <button
              type="button"
              onClick={() => advanceStage(norm(typed) !== norm(word.word))}
              className="btn-ink mt-4 flex h-11 w-full items-center justify-center rounded-[var(--r-pill)] text-sm font-bold"
            >
              Kiểm tra
            </button>
            {norm(typed) && norm(typed) !== norm(word.word) ? (
              <p className="mt-2 text-xs font-semibold text-fg-muted">Chưa đúng — thử lại hoặc bấm Kiểm tra để tiếp tục.</p>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}
