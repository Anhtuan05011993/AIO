"use client";

// The typing stage: per-step exercises over one statement.
// basic: word steps → phrase steps → full sentence; intermediate: words → sentence; advanced: sentence only.
// Mirrors the source lesson feel: hint (VN), IPA, token chips with POS colors, combo/accuracy, reveal/skip.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Statement } from "@/lib/demo-data/go-cau";
import type { LessonMode, Step } from "./LessonExperience";
import { hsl, hslA, normAnswer, POS_COLOR, posFromUnit, posLabelVn, type PosKey } from "./pos";
import { isSpeechRecognitionSupported, listenOnce, speak, stopSpeaking } from "./speech";
import { scoreTranslation, VERDICT_LABEL, type ScoreResult } from "../reading/scorer";

type Status = "pending" | "ok" | "revealed";

export default function TypingStage({
  statement,
  steps,
  mode,
  statementNumber,
  totalSentences,
  onStatementDone,
  onJumpRequest,
  onAttempt,
}: {
  statement: Statement;
  steps: Step[];
  mode: LessonMode;
  statementNumber: number;
  totalSentences: number;
  onStatementDone: () => void;
  onJumpRequest: (statementIndex: number) => void;
  onAttempt?: (ok: boolean) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [statuses, setStatuses] = useState<Status[]>(() => steps.map(() => "pending"));
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [right, setRight] = useState(0);
  const [tries, setTries] = useState(0);
  const [listening, setListening] = useState(false);
  /** Kết quả chấm nói (chỉ mode "listening-speaking") — null khi chưa dùng mic. */
  const [spk, setSpk] = useState<ScoreResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopListenRef = useRef<() => void>(() => undefined);

  const step: Step | undefined = steps[stepIdx];
  const allDone = stepIdx >= steps.length;

  // reset when steps change (new statement)
  useEffect(() => {
    setStepIdx(0);
    setStatuses(steps.map(() => "pending"));
    setValue("");
    setSpk(null);
  }, [steps]);

  // focus + auto-play listening prompt
  useEffect(() => {
    if (allDone) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    if (mode !== "default" && step) {
      speak(step.target);
    }
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, allDone]);

  useEffect(() => () => { stopListenRef.current(); stopSpeaking(); }, []);

  const accuracy = tries === 0 ? 100 : Math.round((right / tries) * 100);
  const doneCount = statuses.filter((s) => s !== "pending").length;
  const stepPct = Math.round((doneCount / Math.max(1, steps.length)) * 100);

  const finishStatement = useCallback(() => {
    stopSpeaking();
    setStatuses((prev) => {
      const next = [...prev, "ok" as Status];
      return next;
    });
    onStatementDone();
  }, [onStatementDone]);

  const advance = useCallback(() => {
    setValue("");
    if (stepIdx + 1 < steps.length) setStepIdx(stepIdx + 1);
    else finishStatement();
  }, [stepIdx, steps.length, finishStatement]);

  const submit = useCallback(() => {
    if (!step) return;
    const ok = step.accepted.some((a) => normAnswer(a) === normAnswer(value));
    onAttempt?.(ok);
    setTries((t) => t + 1);
    setSpk(null);
    if (ok) {
      setRight((r) => r + 1);
      setCombo((c) => {
        const n = c + 1;
        setBestCombo((b) => Math.max(b, n));
        return n;
      });
      setStatuses((prev) => prev.map((s, i) => (i === stepIdx ? "ok" : s)));
      // brief success flash then advance
      window.setTimeout(() => advance(), 320);
    } else {
      setCombo(0);
      setShake(true);
      window.setTimeout(() => setShake(false), 380);
    }
  }, [step, value, stepIdx, advance]);

  const reveal = useCallback(() => {
    if (!step) return;
    setCombo(0);
    setTries((t) => t + 1);
    onAttempt?.(false);
    setSpk(null);
    setStatuses((prev) => prev.map((s, i) => (i === stepIdx ? "revealed" : s)));
    setValue(step.target);
    window.setTimeout(() => advance(), 700);
  }, [step, stepIdx, advance]);

  /** Chấp nhận kết quả "Gần đúng" của mic — coi như đã qua bước. */
  const acceptSpoken = useCallback(() => {
    if (!spk || !step) return;
    setRight((r) => r + 1);
    setStatuses((prev) => prev.map((s, i) => (i === stepIdx ? "ok" : s)));
    setSpk(null);
    window.setTimeout(() => advance(), 260);
  }, [spk, step, stepIdx, advance]);

  const startListening = useCallback(() => {
    if (!step) return;
    if (!isSpeechRecognitionSupported()) {
      inputRef.current?.focus();
      return;
    }
    stopListenRef.current();
    setSpk(null);
    setListening(true);
    stopListenRef.current = listenOnce(
      (text) => {
        const said = text.replace(/\s*$/, "");
        setValue(said);
        // Chấm điểm ngay: đúng (≥75% token) tự pass; gần đúng cho chấp nhận/thử lại.
        const r = scoreTranslation(step.target, said);
        setTries((t) => t + 1);
        onAttempt?.(r.verdict === "exact");
        setSpk(r);
        if (r.verdict === "exact") {
          setRight((x) => x + 1);
          setCombo((c) => {
            const n = c + 1;
            setBestCombo((b) => Math.max(b, n));
            return n;
          });
          setStatuses((prev) => prev.map((s, i) => (i === stepIdx ? "ok" : s)));
          window.setTimeout(() => advance(), 480);
        }
      },
      () => setListening(false),
    );
  }, [step, stepIdx, advance]);

  // keyboard shortcuts (mirrors source: Ctrl = phát âm, Alt = hiện đáp án, Ctrl+Alt = làm lại)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (allDone) return;
      if (e.key === "Enter" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        submit();
        return;
      }
      if (e.ctrlKey && e.altKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        setCombo(0);
        setValue("");
        inputRef.current?.focus();
        return;
      }
      if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        if (step) speak(step.target);
        return;
      }
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        reveal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allDone, submit, reveal, step]);

  if (allDone) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <p className="font-hero text-xl font-extrabold text-fg">Hoàn thành câu!</p>
        <button type="button" onClick={() => onJumpRequest(statementNumber % totalSentences)} className="btn-ink flex h-11 items-center rounded-[var(--r-pill)] px-6 text-sm font-bold">
          Tiếp tục
        </button>
      </div>
    );
  }

  const hidden = mode !== "default"; // listening modes hide VN hint
  const currentPos: PosKey = step?.kind === "word" ? posFromUnit(step.unit?.partOfSpeech, step.unit?.grammarTags) : "other";
  const colors = POS_COLOR[currentPos];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 md:px-6">
      {/* stats row */}
      <div className="flex items-center justify-between" aria-label="Thành tích phiên này">
        <div className="flex items-center gap-1.5 rounded-pill border-bw border-border bg-surface px-3 py-1 shadow-sh-1">
          <span className="font-hero text-sm font-extrabold tabular-nums text-fg">{combo}</span>
          <span className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Combo</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-pill border-bw border-border bg-surface px-3 py-1 shadow-sh-1">
          <span className="font-hero text-sm font-extrabold tabular-nums text-fg">{accuracy}%</span>
          <span className="text-2xs font-bold uppercase tracking-wide text-fg-muted">Chính xác</span>
        </div>
      </div>

      {/* statement token row — what has been built so far */}
      <div className="lp-tokenrow mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2" aria-label="Câu đang ghép">
        {statement.text.split(/\s+/).map((w, i) => {
          const done = isWordDone(steps, statuses, stepIdx, w, i);
          const pos = posFromUnit(unitPosOf(statement, w), unitTagsOf(statement, w));
          const c = POS_COLOR[pos];
          return (
            <span
              key={i}
              className="lp-word rounded-lg px-1.5 py-0.5 font-bold leading-tight transition-opacity"
              style={{
                backgroundColor: hsl(c.bg),
                color: hsl("ling-on"),
                opacity: done ? 1 : 0.28,
                boxShadow: `0 1px 2px hsl(var(--nb-desk) / 0.12)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {/* current exercise card */}
      <section className="nbx-r-info isle mt-4 flex flex-1 flex-col rounded-card-lg border-bw border-border-strong bg-surface p-5 shadow-sh-3" aria-label={`Bước ${stepIdx + 1} trên ${steps.length}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-pill bg-surface-2 px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-fg-muted">
            {step?.kind === "word" ? "Từ vựng" : step?.kind === "phrase" ? "Mảnh câu" : "Câu hoàn chỉnh"} · {stepIdx + 1}/{steps.length}
          </span>
          <span className="text-2xs font-semibold text-fg-muted">Câu {statementNumber} / {totalSentences}</span>
        </div>
        <div className="lp-stepbar mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
          <div className="h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200" style={{ width: `${stepPct}%` }} />
        </div>

        {step ? (
          <>
            {/* IPA */}
            {step.ipa ? (
              <p className="font-ipa ipa-tone mt-4 text-center text-sm leading-relaxed text-fg-muted">{step.ipa}</p>
            ) : null}

            {/* VN hint or listening prompt */}
            {mode === "default" ? (
              <p className="mt-3 text-center text-lg font-extrabold text-fg">{step.hintVi || statement.translation}</p>
            ) : (
              <p className="mt-3 text-center text-sm font-semibold text-fg-muted">
                {mode === "listening" ? "Nghe rồi gõ lại câu." : "Nghe rồi nói lại (hoặc gõ nếu không có mic)."}
              </p>
            )}

            {/* full statement pill area for sentence steps */}
            {step.kind === "sentence" ? (
              <div className="lp-sentpill mt-4 rounded-card border-bw border-border lp-surface-60 px-4 py-3 text-center">
                <span className="lp-vi block break-words leading-snug text-fg-muted">{statement.translation}</span>
              </div>
            ) : null}

            {/* input row */}
            <div className={"mt-4 flex items-center gap-2 " + (shake ? "lp-shake" : "")}>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  aria-label="Ô nhập đáp án"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="lp-input h-11 w-full rounded-card border-bw border-border-strong bg-surface px-4 text-center text-lg font-bold text-fg outline-none focus:border-primary "
                  placeholder={listening ? "Đang nghe…" : "Gõ câu trả lời…"}
                />
              </div>
              {mode === "listening-speaking" ? (
                <button
                  type="button"
                  onClick={startListening}
                  className={"tap-40 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-bw " + (listening ? "lp-mic-on border-primary bg-primary text-primary-fg" : "border-border-strong bg-surface text-fg hover:bg-surface-2")}
                  aria-label="Nói lại bằng mic"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" />
                  </svg>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => speak(step.target)}
                className="tap-40 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-bw border-border-strong bg-surface text-fg hover:bg-surface-2"
                aria-label="Phát âm (Ctrl)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>
            </div>

            {/* speaking score panel (mic result) — đúng tự pass, gần đúng cho chấp nhận */}
            {mode === "listening-speaking" && spk ? (
              <div className={`lp-spk mt-4 rounded-card border-bw px-4 py-3 ${spk.verdict === "close" ? "lp-spk-close" : "lp-spk-miss"}`} role="status">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-fg">
                    {VERDICT_LABEL[spk.verdict]}
                    <span className="ml-2 text-2xs font-bold text-fg-muted">{Math.round(spk.ratio * 100)}% trùng từ khóa</span>
                  </p>
                  {spk.verdict === "close" ? (
                    <button type="button" onClick={acceptSpoken} className="btn-ink flex h-9 items-center rounded-[var(--r-pill)] px-4 text-xs font-bold whitespace-nowrap">
                      Chấp nhận
                    </button>
                  ) : null}
                </div>
                <div className="lp-spk-toks mt-2 flex flex-wrap gap-1.5" aria-label="Đối chiếu từ khóa">
                  {spk.refTokens.map((t, i) => (
                    <span key={i} className={`lp-spk-tok ${spk.matchedRef[i] ? "lp-spk-y" : "lp-spk-n"}`}>{t}</span>
                  ))}
                </div>
                <p className="mt-2 text-2xs leading-relaxed text-fg-muted">
                  {spk.verdict === "close"
                    ? "Bạn nói gần đúng — chấp nhận để qua bước, hoặc bấm mic thử lại / sửa trong ô nhập."
                    : "Máy nghe chưa khớp câu mẫu — bấm mic nói lại, hoặc gõ đáp án vào ô nhập rồi Enter."}
                </p>
              </div>
            ) : null}

            {/* POS chip for word steps */}
            {step.kind === "word" ? (
              <div className="mt-3 flex justify-center">
                <span
                  className="lp-pospill rounded-full border px-2 py-0.5 text-2xs font-bold"
                  style={{ color: hsl(colors.bar), borderColor: hslA(colors.bar, 0.45), backgroundColor: hslA(colors.bar, 0.14) }}
                >
                  {posLabelVn(step.unit?.partOfSpeech, step.unit?.grammarTags)}
                </span>
              </div>
            ) : null}

            {/* explanation for word/phrase steps */}
            {step.unit?.explanationVi && mode === "default" ? (
              <p className="mt-2 text-center text-xs leading-relaxed text-fg-muted">{step.unit.explanationVi}</p>
            ) : null}

            {/* action buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={reveal} className="tap-40 flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] border-bw border-border bg-surface px-3.5 text-xs font-bold text-fg hover:bg-surface-2">
                <kbd className="lp-kbd">Alt</kbd> Hiện đáp án
              </button>
              <button type="button" onClick={() => { setCombo(0); setValue(""); inputRef.current?.focus(); }} className="tap-40 flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] border-bw border-border bg-surface px-3.5 text-xs font-bold text-fg hover:bg-surface-2">
                <kbd className="lp-kbd">Ctrl</kbd><kbd className="lp-kbd">Alt</kbd> Làm lại
              </button>
              <button type="button" onClick={submit} className="btn-ink flex h-10 items-center gap-1.5 rounded-[var(--r-pill)] px-5 text-xs font-bold whitespace-nowrap">
                <kbd className="lp-kbd lp-kbd-dark">Enter</kbd> Tiếp tục
              </button>
              <button type="button" onClick={() => { setCombo(0); onAttempt?.(false); advance(); }} className="tap-40 flex h-10 items-center rounded-[var(--r-pill)] px-3.5 text-xs font-bold text-fg-muted hover:bg-surface-2 hover:text-fg">
                Câu tiếp
              </button>
            </div>
          </>
        ) : null}
      </section>

      {/* best combo note */}
      <p className="mt-3 text-center text-2xs font-semibold text-fg-muted">
        Combo tốt nhất: {bestCombo} · Tổ hợp phím: Ctrl = phát âm · Alt = hiện đáp án · Ctrl+Alt = làm lại
      </p>
    </div>
  );
}

// helpers: which words of the statement have been completed by earlier steps
function unitPosOf(statement: Statement, word: string): string | null {
  const u = statement.learningUnits.find((x) => x.unitType === "word" && x.unitText.toLowerCase() === word.toLowerCase().replace(/[^a-z']/g, ""));
  return u?.partOfSpeech ?? null;
}
function unitTagsOf(statement: Statement, word: string): string[] {
  const u = statement.learningUnits.find((x) => x.unitType === "word" && x.unitText.toLowerCase() === word.toLowerCase().replace(/[^a-z']/g, ""));
  return u?.grammarTags ?? [];
}
function isWordDone(steps: Step[], statuses: Status[], currentIdx: number, word: string, occurrence: number): boolean {
  // word chips light up once their step is passed (any word step whose target matches, before current)
  let seen = -1;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.kind === "word" && s.target.toLowerCase() === word.toLowerCase().replace(/[^a-z']/g, "")) {
      seen++;
      if (seen === occurrence) {
        return i < currentIdx || statuses[i] !== "pending";
      }
    }
  }
  return false;
}
