"use client";

/**
 * ArticleReader — trình đọc bài demo /luyen-dich-thuat/[bai] (Agent F2).
 *
 * Hai chế độ (đúng spec BRIEFS-4):
 *  - "Đọc": hiện câu EN + nút "Hiện nghĩa" từng câu (Hiện/Ẩn tất cả).
 *  - "Dịch có chấm điểm": hiện câu VI → gõ bản dịch EN → scorer token overlap
 *    (./scorer.ts): ≥0.75 "Chính xác" (+6 XP), 0.4–0.75 "Gần đúng" (+3 XP, hiện
 *    bản mẫu), <0.4 "Sai" (thử lại hoặc xem đáp án — không XP). Hết bài: điểm
 *    tổng + XP, ghi vào progress demo (addLessonRecord) và POST
 *    /api/progress/lesson với try/catch im lặng (API do Agent F1 dựng song song).
 *
 * Class gốc trong entry.css (scope .nbx-dc của trang dictation nguồn):
 * nbx-d-prac/nbx-d-stage/nbx-d-top/nbx-d-tag/nbx-d-vi/nbx-d-ctx/nbx-d-ans/
 * nbx-d-hint/nbx-d-res/nbx-d-rh/nbx-d-bar/nbx-d-tok(s)/nbx-d-legend/nbx-d-note/
 * nbx-d-steps/nbx-d-n/nbx-d-meter/nbx-d-tally/nbx-d-xp/nbx-d-done-h/nbx-d-pass,
 * cùng nbx-blk/nbx-r-info/nbx-seg/nbx-chip/nbx-btn/nbx-b-pri/nbx-num/nbx-ic.
 * Phần còn lại là lp-* trong src/styles/custom/reading.css.
 */
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import type { DemoArticle } from "@/lib/demo-data/reading/articles";
import { ARTICLES } from "@/lib/demo-data/reading/articles";
import { addLessonRecord } from "@/lib/store/progress";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconFlame,
  IconLanguages,
  IconNotebook,
  IconPencil,
} from "../app/icons";
import { scoreTranslation, VERDICT_LABEL, wordCountHint, type ScoreResult } from "./scorer";
import "../../../../styles/custom/reading.css";

type Mode = "doc" | "dich";

type Props = {
  article: DemoArticle;
  backHref: string;
};

const XP_EXACT = 6;
const XP_CLOSE = 3;

export default function ArticleReader({ article, backHref }: Props): ReactElement {
  const sentences = article.sentences;
  const n = sentences.length;

  const [mode, setMode] = useState<Mode>("doc");
  const [docShown, setDocShown] = useState<boolean[]>(() => sentences.map(() => false));

  const [idx, setIdx] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, ScoreResult>>({});
  const [best, setBest] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [accepted, setAccepted] = useState<Record<number, boolean>>({});
  const [donePhase, setDonePhase] = useState(false);

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const startedAt = useRef(Date.now());
  const postedRef = useRef(false);

  const resolvedAt = (i: number): boolean => accepted[i] === true || revealed[i] === true;
  const resolvedCount = sentences.filter((_, i) => resolvedAt(i)).length;
  const allResolved = resolvedCount === n;

  const xp = sentences.reduce((sum, _, i) => {
    if (revealed[i]) return sum;
    const v = results[i]?.verdict;
    if (v === "exact") return sum + XP_EXACT;
    if (v === "close") return sum + XP_CLOSE;
    return sum;
  }, 0);
  const accuracy = Math.round((100 * sentences.reduce((s, _, i) => s + (best[i] ?? 0), 0)) / n);
  const nExact = sentences.filter((_, i) => results[i]?.verdict === "exact" && !revealed[i]).length;
  const nClose = sentences.filter(
    (_, i) => !revealed[i] && results[i] && resolvedAt(i) && results[i].verdict === "close",
  ).length;
  const nMiss = n - nExact - nClose;

  const pct = Math.round((100 * resolvedCount) / Math.max(1, n));
  const cur = sentences[idx] ?? sentences[0];
  const result = results[idx];
  const resolvedNow = resolvedAt(idx);
  const nextArticle = ARTICLES[(ARTICLES.findIndex((a) => a.slug === article.slug) + 1) % ARTICLES.length];

  /* ---------------------------------------------------------------- */
  /* Đọc mode                                                          */
  /* ---------------------------------------------------------------- */

  const toggleDoc = (i: number): void => {
    setDocShown((prev) => prev.map((v, k) => (k === i ? !v : v)));
  };

  const setAllDoc = (v: boolean): void => {
    setDocShown(sentences.map(() => v));
  };

  /* ---------------------------------------------------------------- */
  /* Dịch mode                                                         */
  /* ---------------------------------------------------------------- */

  const check = (): void => {
    const r = scoreTranslation(cur.en, drafts[idx] ?? "");
    setResults((prev) => ({ ...prev, [idx]: r }));
    setBest((prev) => ({ ...prev, [idx]: Math.max(prev[idx] ?? 0, r.ratio) }));
    // ≥0.75 "Chính xác" tự động chốt câu (chuyển sang "Câu tiếp theo").
    if (r.verdict === "exact") setAccepted((prev) => ({ ...prev, [idx]: true }));
  };

  const retry = (): void => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
    requestAnimationFrame(() => taRef.current?.focus());
  };

  /** Sai → xem đáp án: hiện bản mẫu, câu này không có XP. */
  const revealAnswer = (): void => {
    setRevealed((prev) => ({ ...prev, [idx]: true }));
    setBest((prev) => ({ ...prev, [idx]: Math.max(prev[idx] ?? 0, results[idx]?.ratio ?? 0) }));
  };

  /** Gần đúng → chấp nhận bản dịch hiện tại, +XP giảm. */
  const acceptClose = (): void => {
    setAccepted((prev) => ({ ...prev, [idx]: true }));
  };

  const advance = (): void => {
    for (let step = 1; step <= n; step += 1) {
      const i = (idx + step) % n;
      if (!resolvedAt(i)) {
        setIdx(i);
        setDonePhase(false);
        return;
      }
    }
    setDonePhase(true);
  };

  const jumpTo = (i: number): void => {
    setIdx(i);
    setDonePhase(false);
  };

  const reset = (): void => {
    setDrafts({});
    setResults({});
    setBest({});
    setRevealed({});
    setAccepted({});
    setIdx(0);
    setDonePhase(false);
    startedAt.current = Date.now();
    postedRef.current = false;
  };

  /* ---------------------------------------------------------------- */
  /* Hoàn thành: ghi XP demo + đồng bộ server (F1) — fail im lặng       */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (mode !== "dich" || !donePhase || !allResolved || postedRef.current) return;
    postedRef.current = true;
    const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const difficulty = article.level === "A2" ? "basic" : article.level === "B2" ? "advanced" : "intermediate";
    const payload = {
      courseId: `doc-dich:${article.slug}`,
      mode: "default" as const,
      difficulty: difficulty as "basic" | "intermediate" | "advanced",
      seconds,
      accuracy,
      xp,
    };
    try {
      addLessonRecord(payload);
    } catch {
      // progress demo unavailable — ignore
    }
    // Sync tới backend thật của F1 (đang được dựng song song) — lỗi im lặng.
    void fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  }, [mode, donePhase, allResolved, accuracy, xp, article]);

  /* ---------------------------------------------------------------- */

  const stepState = (i: number): string => {
    if (resolvedAt(i)) return "nbx-ok";
    if (i === idx && !donePhase) return "nbx-now";
    return "nbx-wait";
  };

  const barButton = (label: string, onClick: () => void, primary = false, key?: string): ReactElement => (
    <button key={key ?? label} type="button" className={`nbx-btn${primary ? " nbx-b-pri" : ""}`} onClick={onClick}>
      {label}
    </button>
  );

  const barButtons = (): ReactElement[] => {
    if (resolvedNow) {
      return [barButton("Câu tiếp theo", advance, true)];
    }
    const out: ReactElement[] = [];
    if (result?.verdict === "close") {
      out.push(barButton("Tiếp tục (+3 XP)", acceptClose, true, "acc"));
      out.push(barButton("Thử lại", retry, false, "retry"));
    } else if (result?.verdict === "miss") {
      out.push(barButton("Thử lại", retry, true, "retry"));
      out.push(barButton("Xem đáp án", revealAnswer, false, "reveal"));
    } else {
      out.push(barButton("Kiểm tra", check, true, "check"));
      out.push(barButton("Xem đáp án", revealAnswer, false, "reveal"));
    }
    return out;
  };

  return (
    <div className="nbx-dc lp-reader">
      <div className="lp-backrow">
        <Link href={backHref} className="lp-back">
          <span className="lp-back-ic" aria-hidden="true">
            <IconArrowRight size={15} style={{ transform: "rotate(180deg)" }} />
          </span>
          Tất cả bài đọc
        </Link>
      </div>

      <section className="nbx-blk nbx-r-info nbx-dots" aria-labelledby="rd-art-h">
        <div className="nbx-row-flex">
          <span className="nbx-tile nbx-f-read" aria-hidden="true">
            <IconLanguages size={17} />
          </span>
          <h1 id="rd-art-h" className="nbx-disp">
            {article.title}
          </h1>
          <span className="nbx-sp" />
          {article.titleVi ? (
            <span className="nbx-chip nbx-plain" title="Tiêu đề tiếng Việt của bài gốc">
              {article.titleVi}
            </span>
          ) : null}
          <span className="nbx-chip nbx-plain lp-demo-chip">
            {article.titleVi ? "Nội dung thật" : "Nội dung demo"}
          </span>
        </div>
        <div className="nbx-row-flex lp-meta">
          <span className="nbx-chip nbx-plain">{article.topic}</span>
          <span className="nbx-chip nbx-plain">Cấp {article.level}</span>
          <span className="nbx-chip nbx-plain">
            <IconClock className="nbx-ic" size={14} /> ~{article.minutes} phút
          </span>
          <span className="nbx-chip nbx-plain">{n} câu</span>
        </div>
        <p className="nbx-lvd">{article.intro}</p>
      </section>

      <section className="nbx-blk lp-switch" aria-label="Chế độ học">
        <div className="nbx-seg" role="group" aria-label="Chọn chế độ">
          <button type="button" className={mode === "doc" ? "nbx-on" : ""} aria-pressed={mode === "doc"} onClick={() => setMode("doc")}>
            Đọc
          </button>
          <button
            type="button"
            className={mode === "dich" ? "nbx-on" : ""}
            aria-pressed={mode === "dich"}
            onClick={() => {
              setMode("dich");
              if (allResolved) setDonePhase(true);
            }}
          >
            Dịch có chấm điểm
          </button>
        </div>
        <div className="nbx-d-meter">
          <span>{mode === "doc" ? `${docShown.filter(Boolean).length}/${n} câu đã hiện nghĩa` : `${resolvedCount}/${n} câu đã dịch`}</span>
          <span className="nbx-bar">
            <i style={{ "--nb-x-p": `${pct}%` } as CSSProperties} />
          </span>
        </div>
      </section>

      {mode === "doc" ? (
        <section className="nbx-blk lp-doc" aria-label="Chế độ đọc">
          <div className="nbx-d-note">
            <IconNotebook className="nbx-ic" size={20} />
            <span>
              Đọc to từng câu tiếng Anh, đoán nghĩa, rồi bấm “Hiện nghĩa” để đối chiếu bản dịch.
              Chuyển sang “Dịch có chấm điểm” để luyện dịch ngược.
            </span>
          </div>
          <div className="nbx-row-flex lp-doc-tools">
            <button type="button" className="nbx-btn nbx-sm" onClick={() => setAllDoc(true)}>
              Hiện tất cả
            </button>
            <button type="button" className="nbx-btn nbx-sm" onClick={() => setAllDoc(false)}>
              Ẩn tất cả
            </button>
          </div>
          <div className="nbx-d-lines">
            {sentences.map((s, i) => (
              <div key={i} className={`nbx-d-line${i > 0 && (s.paragraph ?? 0) > (sentences[i - 1].paragraph ?? 0) ? " lp-newpara" : ""}`}>
                <span className="nbx-d-n" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="lp-line-body">
                  <p className="lp-line-en">{s.en}</p>
                  {docShown[i] ? (
                    <>
                      <p className="lp-line-vi">{s.vi}</p>
                      {s.noteVi ? <p className="lp-line-note">{s.noteVi}</p> : null}
                    </>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="nbx-btn nbx-sm lp-reveal"
                  aria-pressed={docShown[i]}
                  onClick={() => toggleDoc(i)}
                >
                  {docShown[i] ? "Ẩn nghĩa" : "Hiện nghĩa"}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="lp-practice" aria-label="Chế độ dịch có chấm điểm">
          <div className="nbx-d-prac">
            <div className="nbx-d-col">
              {donePhase && allResolved ? (
                <div className="nbx-blk nbx-r-ok lp-done">
                  <div className="nbx-d-done-h">
                    <h3 className="nbx-disp">Hoàn thành bài dịch!</h3>
                    <span className="nbx-d-xp">
                      <IconFlame className="nbx-ic" size={18} />+{xp} XP
                    </span>
                  </div>
                  <div className="nbx-d-tally">
                    <span>
                      <b className="nbx-num">{nExact}</b>
                      <small>Chính xác</small>
                    </span>
                    <span>
                      <b className="nbx-num">{nClose}</b>
                      <small>Gần đúng</small>
                    </span>
                    <span>
                      <b className="nbx-num">{nMiss}</b>
                      <small>Chưa đạt</small>
                    </span>
                    <span>
                      <b className="nbx-num">{accuracy}%</b>
                      <small>Điểm tổng</small>
                    </span>
                  </div>
                  <div className="nbx-d-verdict">
                    <p>
                      Bản dịch của bạn trùng {accuracy}% từ khóa so với bản mẫu. XP đã ghi vào tiến độ —
                      lỗi đồng bộ server sẽ được bỏ qua im lặng.
                    </p>
                  </div>
                  <div className="nbx-d-bar">
                    <button type="button" className="nbx-btn nbx-b-pri" onClick={reset}>
                      Làm lại
                    </button>
                    <Link className="nbx-btn" href={backHref}>
                      Về danh sách bài
                    </Link>
                    <Link className="nbx-btn" href={`/luyen-dich-thuat/${nextArticle.slug}`}>
                      Bài tiếp theo
                      <IconArrowRight className="nbx-ic" size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="nbx-blk nbx-d-stage">
                  <div className="nbx-d-top">
                    <span className="nbx-d-tag">
                      Câu {idx + 1} / {n}
                      {resolvedNow ? " — đã xong" : ""}
                    </span>
                    <span className="nbx-chip nbx-plain">{wordCountHint(cur.en)} từ (EN)</span>
                  </div>
                  <p className="nbx-d-ctx">
                    Dịch câu tiếng Việt dưới đây sang tiếng Anh rồi bấm “Kiểm tra”. Bản dịch được chấm
                    theo độ trùng từ khóa (bỏ qua mạo từ và dấu câu).
                  </p>
                  <p className="nbx-d-vi">{cur.vi}</p>
                  <textarea
                    ref={taRef}
                    className="nbx-d-ans lp-ans"
                    value={drafts[idx] ?? ""}
                    placeholder="Type your English translation…"
                    rows={3}
                    spellCheck={false}
                    aria-label="Bản dịch tiếng Anh của bạn"
                    disabled={resolvedNow}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [idx]: e.target.value }))}
                  />
                  {result ? (
                    <div className="nbx-d-res">
                      <div className="nbx-d-rh">
                        <h3>{VERDICT_LABEL[result.verdict]}</h3>
                        <span className="nbx-chip nbx-plain">{Math.round(result.ratio * 100)}% trùng từ khóa</span>
                        <span className="nbx-act">
                          {result.verdict === "exact" && !revealed[idx] ? (
                            <span className="nbx-chip">+{XP_EXACT} XP</span>
                          ) : result.verdict === "close" && !revealed[idx] ? (
                            <span className="nbx-chip">+{XP_CLOSE} XP</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="nbx-d-toks" aria-label="Đối chiếu từ khóa">
                        {result.refTokens.map((t, i) => (
                          <span key={i} className={`nbx-d-tok ${result.matchedRef[i] ? "nbx-y" : "nbx-n"}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="nbx-d-legend">
                        <span>
                          <i className="nbx-sw1" /> Có trong bản dịch
                        </span>
                        <span>
                          <i className="nbx-sw2" /> Còn thiếu hoặc sai
                        </span>
                      </div>
                      {result.verdict !== "miss" || revealed[idx] ? (
                        <div className="nbx-d-pass lp-sample">
                          <p>
                            <b>Bản mẫu: </b>
                            {cur.en}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="nbx-d-bar">{barButtons()}</div>
                </div>
              )}
            </div>

            <aside className="nbx-d-side lp-side">
              <div className="nbx-bh">
                <h2 className="nbx-disp">Tiến độ</h2>
              </div>
              <ol className="nbx-d-steps">
                {sentences.map((s, i) => (
                  <li key={i} className={stepState(i)} onClick={() => jumpTo(i)}>
                    {resolvedAt(i) ? (
                      <IconCheck className="nbx-ic" size={18} />
                    ) : i === idx && !donePhase ? (
                      <IconPencil className="nbx-ic" size={18} />
                    ) : (
                      <IconClock className="nbx-ic" size={18} />
                    )}
                    <span className="nbx-ell">{`Câu ${i + 1} — ${s.vi}`}</span>
                  </li>
                ))}
              </ol>
              <p className="nbx-d-para">Quy tắc chấm</p>
              <div className="nbx-d-note">
                <span>
                  Chấm theo token overlap: ≥75% từ khóa trùng → Chính xác (+6 XP); 40–75% → Gần đúng
                  (+3 XP, hiện bản mẫu); dưới 40% → Sai (thử lại hoặc xem đáp án, không XP). Mạo từ
                  a/an/the và dấu câu được bỏ qua.
                </span>
              </div>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
