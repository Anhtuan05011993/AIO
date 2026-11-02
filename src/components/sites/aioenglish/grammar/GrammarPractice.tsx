"use client";

/**
 * GrammarPractice — phòng luyện tập 4 chế độ của 1 node ngữ pháp
 * (/ngu-phap/[node]/luyen-tap), chạy trên BÀI TẬP THẬT trích từ
 * /api/ngu-phap/nodes/{id} (realLessons).
 *
 * Chế độ:
 *  - "guided": trình tự bài giảng gốc (teach card → bài tập xen kẽ) từ guided[].
 *  - 4 chế độ rời: transform (biến đổi câu) / fix (sửa lỗi) / gap (điền chỗ
 *    trống) / choice (trắc nghiệm) — chạy từng item trong pool.
 *  - "Phiên trộn 20 câu": itemIds từ sets.n20 (nếu node có).
 *
 * Chấm: normAnswer (bỏ dấu câu/hoa/thOwnProperty) khớp target hoặc accepted[];
 * gap nhận thêm từ khuyết; choice so key đáp án. Sau mỗi câu hiện explain gốc.
 * Hoàn thành → ghi XP vào progress demo + POST /api/progress/lesson (mode
 * "grammar") im lặng khi có session.
 *
 * Class: nbx-* gốc + lp-gp-* (grammar.css).
 */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import type { NguPhapNode } from "@/lib/demo-data/nguPhapCatalog";
// CHỈ import TYPE từ realLessons (import thường sẽ kéo JSON 8.2MB vào bundle
// client — đã từng làm route nặng 1.52MB). Data thật của node được server page
// resolve rồi truyền qua props.
import type {
  RealGuidedStep,
  RealLesson,
  RealPoolItem,
} from "@/lib/demo-data/grammar/realLessons";
import { addLessonRecord } from "@/lib/store/progress";
import { hasServerSession } from "@/lib/store/auth";
import { normAnswer } from "../lesson/pos";
import { IconArrowRight, IconCheck, IconClock, IconPencil } from "../app/icons";
import "../../../../styles/custom/grammar.css";

type Mode = "guided" | "transform" | "fix" | "gap" | "choice" | "mix20";

/** Thẻ dạy gộp (start + rules) cho chế độ guided — id khớp cardId trong guided[]. */
type TeachCardT = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  formula: string[];
  examples: { en: string; vi: string; focus: string | null }[];
};

type SessionItem = { item: RealPoolItem };
type TeachStep = { card: TeachCardT };

type Step =
  | { kind: "teach"; card: TeachCardT }
  | { kind: "exercise"; item: RealPoolItem };

type Props = {
  node: NguPhapNode;
  /** Nội dung thật của node — server page resolve từ realLessons rồi truyền xuống. */
  real: RealLesson | null;
  backHref: string;
};

const XP_PER_CORRECT = 2;

const MODE_LABEL: Record<Exclude<Mode, "guided" | "mix20">, string> = {
  transform: "Biến đổi câu",
  fix: "Sửa lỗi",
  gap: "Điền chỗ trống",
  choice: "Trắc nghiệm",
};

/** Chấp nhận: khớp target hoặc 1 accepted (normalized); gap thêm từ khuyết. */
function isCorrect(item: RealPoolItem, said: string): boolean {
  const a = normAnswer(said);
  if (!a) return false;
  if (a === normAnswer(item.target)) return true;
  for (const acc of item.accepted ?? []) {
    if (a === normAnswer(acc)) return true;
  }
  if (item.kind === "gap" && item.gaps?.length) {
    const gapWords = item.gaps.map((g) => g.word).join(" ");
    if (a === normAnswer(gapWords)) return true;
  }
  return false;
}

/** Đáp án gap: từ khuyết theo thứ tự (gap word chính là phần điền). */
function gapAnswer(item: RealPoolItem): string {
  return (item.gaps ?? []).map((g) => g.word).join(" ");
}

export default function GrammarPractice({ node, real, backHref }: Props): ReactElement {
  const pools = useMemo(() => {
    const p = real?.exercises;
    return {
      transform: p?.transform ?? [],
      fix: p?.fix ?? [],
      gap: p?.gap ?? [],
      choice: p?.choice ?? [],
    };
  }, [real]);

  /** item id → item (tra cho guided + sets). */
  const itemMap = useMemo(() => {
    const m = new Map<string, RealPoolItem>();
    for (const it of [...pools.transform, ...pools.fix, ...pools.gap, ...pools.choice]) {
      m.set(it.id, it);
    }
    return m;
  }, [pools]);

  const cardMap = useMemo(() => {
    const m = new Map<string, TeachCardT>();
    for (const c of cardsOf(real)) m.set(c.id, c);
    return m;
  }, [real]);

  const hasGuided = (real?.guided?.length ?? 0) > 0 && (real?.start ?? real?.rules?.length);
  const mixSet = real?.sets?.n20 ?? null;
  const totalPool = pools.transform.length + pools.fix.length + pools.gap.length + pools.choice.length;

  const [mode, setMode] = useState<Mode>(hasGuided ? "guided" : "transform");
  const [session, setSession] = useState<Step[]>([]);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<string | null>(null); // choice: key đã chọn
  const [verdict, setVerdict] = useState<"ok" | "miss" | "reveal" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [tally, setTally] = useState({ right: 0, tries: 0, revealed: 0 });
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());
  const postedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** Bật 1 phiên theo mode (danh sách bước). */
  const startMode = useCallback(
    (m: Mode) => {
      setMode(m);
      let steps: Step[] = [];
      if (m === "guided" && real) {
        steps = guidedSteps(real, cardMap, itemMap);
      } else if (m === "mix20" && mixSet) {
        steps = mixSet.map((id) => itemMap.get(id)).filter((x): x is RealPoolItem => Boolean(x)).map((item) => ({ kind: "exercise" as const, item }));
      } else if (m !== "guided" && m !== "mix20") {
        steps = pools[m].map((item) => ({ kind: "exercise" as const, item }));
      }
      setSession(steps);
      setIdx(0);
      setValue("");
      setPicked(null);
      setVerdict(null);
      setShowHint(false);
      setTally({ right: 0, tries: 0, revealed: 0 });
      setDone(false);
      startedAt.current = Date.now();
      postedRef.current = false;
      window.setTimeout(() => inputRef.current?.focus(), 60);
    },
    // cardMap/itemMap/pools/mixSet đều memo từ real — ổn định theo node.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [real, cardMap, itemMap, pools, mixSet],
  );

  // Bật phiên đầu khi mount / đổi node.
  useEffect(() => {
    startMode(hasGuided ? "guided" : "transform");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  const step: Step | undefined = session[idx];
  const finished = done || idx >= session.length;

  const advance = useCallback(() => {
    setValue("");
    setPicked(null);
    setVerdict(null);
    setShowHint(false);
    setIdx((i) => i + 1);
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const submit = useCallback(() => {
    if (!step || step.kind !== "exercise" || verdict) return;
    const ok = isCorrect(step.item, value);
    setTally((t) => ({ ...t, tries: t.tries + 1, right: t.right + (ok ? 1 : 0) }));
    setVerdict(ok ? "ok" : "miss");
  }, [step, value, verdict]);

  const pickChoice = useCallback(
    (key: string) => {
      if (!step || step.kind !== "exercise" || verdict) return;
      setPicked(key);
      const ok = key === step.item.answer;
      setTally((t) => ({ ...t, tries: t.tries + 1, right: t.right + (ok ? 1 : 0) }));
      setVerdict(ok ? "ok" : "miss");
    },
    [step, verdict],
  );

  const reveal = useCallback(() => {
    if (!step || step.kind !== "exercise" || verdict) return;
    setTally((t) => ({ ...t, revealed: t.revealed + 1 }));
    setVerdict("reveal");
  }, [step, verdict]);

  const skip = useCallback(() => {
    setTally((t) => ({ ...t, tries: t.tries + 1 }));
    advance();
  }, [advance]);

  /** Thử lại sau khi sai — xoá verdict, giữ nguyên câu. */
  const retry = useCallback(() => {
    setVerdict(null);
    setPicked(null);
    setValue("");
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  /* Ghi XP 1 lần khi hết phiên. */
  useEffect(() => {
    if (!finished || session.length === 0 || postedRef.current) return;
    postedRef.current = true;
    const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const accuracy = tally.tries === 0 ? 0 : Math.round((100 * tally.right) / tally.tries);
    const payload = {
      courseId: `grammar:${node.id}`,
      mode: "grammar" as const,
      difficulty: (node.level === "A1" || node.level === "A2" ? "basic" : node.level === "B2" || node.level === "C1" || node.level === "C2" ? "advanced" : "intermediate") as "basic" | "intermediate" | "advanced",
      seconds,
      accuracy,
      xp: tally.right * XP_PER_CORRECT,
    };
    try {
      addLessonRecord(payload);
    } catch {
      // progress demo unavailable — bỏ qua
    }
    void (async () => {
      try {
        if (await hasServerSession()) {
          await fetch("/api/progress/lesson", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } catch {
        // offline / chưa đăng nhập — im lặng
      }
    })();
  }, [finished, session.length, tally, node.id, node.level]);

  const pct = session.length === 0 ? 0 : Math.round((100 * Math.min(idx, session.length)) / session.length);

  const modeChip = (m: Mode, label: string, count: number | null): ReactElement => (
    <button
      key={m}
      type="button"
      className={`nbx-chip nbx-plain lp-gp-mode${mode === m ? " nbx-on" : ""}`}
      aria-pressed={mode === m}
      onClick={() => startMode(m)}
    >
      {label}
      {count !== null ? <small>{count}</small> : null}
    </button>
  );

  return (
    <div className="nbx-hc nbx-hb lp-gram-r lp-gp">
      <div className="lp-backrow">
        <Link href={backHref} className="lp-back">
          <span className="lp-back-ic" aria-hidden="true">
            <IconArrowRight size={15} style={{ transform: "rotate(180deg)" }} />
          </span>
          Về bài học
        </Link>
      </div>

      {/* header + chọn chế độ */}
      <section className="nbx-blk nbx-r-info nbx-dots" aria-labelledby="gp-h">
        <div className="nbx-row-flex">
          <span className="nbx-tile nbx-f-gram" aria-hidden="true">
            <IconPencil size={17} />
          </span>
          <h1 id="gp-h" className="nbx-disp">
            Luyện tập · {node.title}
          </h1>
          <span className="nbx-sp" />
          <span className={`nbx-chip nbx-lvl nbx-lv-${node.level.toLowerCase()}`}>{node.level}</span>
        </div>
        <div className="lp-gp-modes" role="group" aria-label="Chọn chế độ luyện tập">
          {hasGuided ? modeChip("guided", "Bài giảng có hướng dẫn", real?.guided.length ?? null) : null}
          {modeChip("transform", MODE_LABEL.transform, pools.transform.length)}
          {modeChip("fix", MODE_LABEL.fix, pools.fix.length)}
          {modeChip("gap", MODE_LABEL.gap, pools.gap.length)}
          {modeChip("choice", MODE_LABEL.choice, pools.choice.length)}
          {mixSet ? modeChip("mix20", "Phiên trộn 20 câu", mixSet.length) : null}
        </div>
        {!finished ? (
          <div className="nbx-d-meter">
            <span>{`${Math.min(idx + (verdict ? 1 : 0), session.length)}/${session.length} câu`}</span>
            <span className="nbx-bar">
              <i style={{ width: `${pct}%` }} />
            </span>
            <span className="lp-gp-tally">
              <b className="nbx-num">{tally.right}</b> đúng
            </span>
          </div>
        ) : null}
      </section>

      {/* thân phiên */}
      {!finished && step ? (
        step.kind === "teach" ? (
          <TeachCard card={step.card} onNext={advance} pos={`${idx + 1}/${session.length}`} />
        ) : (
          <ExerciseCard
            item={step.item}
            value={value}
            onValue={setValue}
            picked={picked}
            onPick={pickChoice}
            verdict={verdict}
            showHint={showHint}
            onHint={() => setShowHint(true)}
            onSubmit={submit}
            onReveal={reveal}
            onSkip={skip}
            onRetry={retry}
            onNext={advance}
            inputRef={inputRef}
            pos={`${idx + 1}/${session.length}`}
          />
        )
      ) : null}

      {/* tổng kết phiên */}
      {finished ? (
        <section className="nbx-blk nbx-r-ok lp-gp-done" aria-labelledby="gp-done-h">
          <div className="nbx-bh lp-sec-h">
            <h2 id="gp-done-h" className="nbx-disp">
              Hoàn thành phiên luyện tập!
            </h2>
            <span className="nbx-chip">+{tally.right * XP_PER_CORRECT} XP</span>
          </div>
          <div className="nbx-d-tally">
            <span>
              <b className="nbx-num">{tally.right}</b>
              <small>Đúng</small>
            </span>
            <span>
              <b className="nbx-num">{tally.tries}</b>
              <small>Lượt trả lời</small>
            </span>
            <span>
              <b className="nbx-num">{tally.revealed}</b>
              <small>Xem đáp án</small>
            </span>
            <span>
              <b className="nbx-num">{tally.tries === 0 ? 0 : Math.round((100 * tally.right) / tally.tries)}%</b>
              <small>Chính xác</small>
            </span>
          </div>
          <p className="lp-gp-note">
            XP đã ghi vào tiến độ {node.title.toLowerCase()} (chế độ grammar). Lỗi đồng bộ server được bỏ
            qua im lặng.
          </p>
          <div className="nbx-d-bar">
            <button type="button" className="nbx-btn nbx-b-pri" onClick={() => startMode(mode)}>
              Làm lại
            </button>
            <button type="button" className="nbx-btn" onClick={() => startMode(hasGuided ? "transform" : "guided")}>
              {hasGuided ? "Sang chế độ Biến đổi câu" : "Sang Bài giảng có hướng dẫn"}
            </button>
            <Link className="nbx-btn" href={backHref}>
              Về bài học
            </Link>
          </div>
        </section>
      ) : null}

      {totalPool === 0 && !hasGuided ? (
        <section className="nbx-blk nbx-r-ivory">
          <p className="lp-gp-note">Node này chưa có dữ liệu bài tập thật.</p>
        </section>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thẻ dạy (guided)                                                    */
/* ------------------------------------------------------------------ */

function TeachCard({ card, onNext, pos }: { card: TeachCardT; onNext: () => void; pos: string }): ReactElement {
  return (
    <section className="nbx-blk nbx-r-ivory" aria-label="Thẻ bài giảng">
      <div className="nbx-bh lp-sec-h">
        <h2 className="nbx-disp">{card.title || card.kicker}</h2>
        <span className="nbx-chip nbx-plain">{card.kicker || "Bài giảng"} · {pos}</span>
      </div>
      {card.body ? <p className="lp-gp-body">{card.body}</p> : null}
      {card.formula?.length ? (
        <div className="lp-gp-formula">
          {card.formula.map((f, i) => (
            <span key={i} className="nbx-chip nbx-plain">
              {f}
            </span>
          ))}
        </div>
      ) : null}
      {card.examples?.length ? (
        <div className="lp-examples">
          {card.examples.map((e, i) => (
            <div key={i} className="nbx-row nbx-exm lp-exm">
              <span className="nbx-tt">
                <b>{e.en}</b>
                <small>{e.vi}</small>
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="nbx-d-bar">
        <button type="button" className="nbx-btn nbx-b-pri" onClick={onNext}>
          Tiếp tục
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Thẻ bài tập (4 chế độ)                                              */
/* ------------------------------------------------------------------ */

function ExerciseCard({
  item,
  value,
  onValue,
  picked,
  onPick,
  verdict,
  showHint,
  onHint,
  onSubmit,
  onReveal,
  onSkip,
  onRetry,
  onNext,
  inputRef,
  pos,
}: {
  item: RealPoolItem;
  value: string;
  onValue: (v: string) => void;
  picked: string | null;
  onPick: (key: string) => void;
  verdict: "ok" | "miss" | "reveal" | null;
  showHint: boolean;
  onHint: () => void;
  onSubmit: () => void;
  onReveal: () => void;
  onSkip: () => void;
  onRetry: () => void;
  onNext: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  pos: string;
}): ReactElement {
  const isChoice = item.kind === "choice";
  const answered = verdict !== null;
  const srcWithBlank = item.source;

  return (
    <section
      className={`nbx-blk nbx-r-ivory lp-gp-card${verdict === "ok" ? " lp-gp-ok" : verdict === "miss" ? " lp-gp-miss" : ""}`}
      aria-label="Bài tập"
    >
      <div className="nbx-bh lp-sec-h">
        <h2 className="nbx-disp">{MODE_LABEL[(item.kind as keyof typeof MODE_LABEL) ?? "transform"] ?? item.kind}</h2>
        <span className="nbx-chip nbx-plain">{pos}</span>
      </div>

      <p className="lp-gp-source">
        {srcWithBlank}
      </p>
      <p className="lp-gp-sourcevi">{item.sourceVi}</p>

      {isChoice ? (
        <div className="lp-gp-options" role="group" aria-label="Chọn đáp án">
          {(item.options ?? []).map((o) => {
            const state =
              answered && o.key === item.answer
                ? "is-answer"
                : answered && o.key === picked
                  ? "is-wrong"
                  : o.key === picked
                    ? "is-picked"
                    : "";
            return (
              <button
                key={o.key}
                type="button"
                className={`lp-gp-opt ${state}`}
                disabled={answered}
                onClick={() => onPick(o.key)}
              >
                <b>{o.key}</b>
                <span>{o.text}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="lp-gp-inputrow">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (answered) onNext();
                else onSubmit();
              }
            }}
            disabled={answered}
            aria-label="Câu trả lời"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="lp-gp-input h-11 w-full rounded-card border-bw border-border-strong bg-surface px-4 text-lg font-bold text-fg outline-none focus:border-primary"
            placeholder={item.kind === "gap" ? "Điền từ còn thiếu…" : "Gõ câu hoàn chỉnh…"}
          />
        </div>
      )}

      {showHint && item.hint ? <p className="lp-gp-hint">Gợi ý: {item.hint}</p> : null}

      {answered ? (
        <div className={`lp-gp-feedback ${verdict === "ok" ? "" : "lp-gp-feedback-miss"}`} role="status">
          <p className="lp-gp-verdict">
            {verdict === "ok" ? (
              <>
                <IconCheck className="nbx-ic" size={16} /> Chính xác!
              </>
            ) : verdict === "reveal" ? (
              <>
                <IconClock className="nbx-ic" size={16} /> Đáp án: <b>{item.kind === "gap" ? gapAnswer(item) : item.target}</b>
              </>
            ) : (
              <>Chưa đúng — đáp án: <b>{item.kind === "gap" ? gapAnswer(item) : item.target}</b></>
            )}
          </p>
          {item.explain ? <p className="lp-gp-explain">{item.explain}</p> : null}
        </div>
      ) : null}

      <div className="nbx-d-bar">
        {answered ? (
          <>
            {verdict === "ok" || verdict === "reveal" ? (
              <button type="button" className="nbx-btn nbx-b-pri" onClick={onNext}>
                Câu tiếp theo
              </button>
            ) : (
              <button type="button" className="nbx-btn nbx-b-pri" onClick={onRetry}>
                Thử lại
              </button>
            )}
            <button type="button" className="nbx-btn" onClick={onNext}>
              {verdict === "ok" ? "Câu tiếp theo" : "Chấp nhận & qua câu mới"}
            </button>
          </>
        ) : (
          <>
            {!isChoice ? (
              <button type="button" className="nbx-btn nbx-b-pri" onClick={onSubmit}>
                Kiểm tra
              </button>
            ) : null}
            {item.hint ? (
              <button type="button" className="nbx-btn" onClick={onHint}>
                Gợi ý
              </button>
            ) : null}
            <button type="button" className="nbx-btn" onClick={onReveal}>
              Xem đáp án
            </button>
            <button type="button" className="nbx-btn nbx-sm" onClick={onSkip}>
              Bỏ qua
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function cardsOf(real: RealLesson | null | undefined): TeachCardT[] {
  if (!real) return [];
  const out: TeachCardT[] = [];
  if (real.start) {
    out.push({ id: `${real.nodeId}-start`, kicker: "Bắt đầu", title: real.start.title, body: real.start.body, formula: [], examples: real.start.examples.map((e) => ({ en: e.en, vi: e.vi, focus: e.focus ?? null })) });
  }
  for (const r of real.rules) {
    out.push({ id: r.id, kicker: "Quy tắc", title: r.title, body: r.body, formula: r.formula, examples: r.examples.map((e) => ({ en: e.en, vi: e.vi, focus: null })) });
  }
  return out;
}

function guidedSteps(real: RealLesson, cardMap: Map<string, TeachCardT>, itemMap: Map<string, RealPoolItem>): Step[] {
  const steps: Step[] = [];
  for (const g of real.guided as RealGuidedStep[]) {
    if (g.t === "teach" && g.cardId) {
      const card = cardMap.get(g.cardId);
      if (card) steps.push({ kind: "teach", card });
    } else if (g.t === "item" && g.itemId) {
      const item = itemMap.get(g.itemId);
      if (item) steps.push({ kind: "exercise", item });
    }
  }
  return steps;
}
