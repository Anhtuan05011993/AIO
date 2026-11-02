"use client";

/**
 * VideoWorkspace — workspace /video/[bai] (Agent F2).
 *
 * Tính năng chính: người dùng DÁN LINK YouTube bất kỳ → parse videoId → embed
 * qua https://www.youtube-nocookie.com/embed/<id> (KHÔNG hardcode video ID để
 * tránh embed chết). Ba tab trong workspace:
 *  - Dictation: nghe video, gõ lại từng câu; chấm bằng scorer token overlap
 *    (../../reading/scorer.ts) so với transcript demo; nút "Xem transcript"
 *    hiện bản mẫu (không XP). Hoàn thành → +XP vào progress demo và POST
 *    /api/progress/lesson im lặng (try/catch — API của Agent F1).
 *  - Transcript: bản ghi demo song ngữ, đánh dấu "Nội dung demo".
 *  - Shadowing: bộ đếm lặp câu 5/8/12 giây + danh sách câu để nói theo.
 *
 * Class gốc (scope .nbx-dc trang dictation nguồn): nbx-d-*, nbx-blk, nbx-seg,
 * nbx-inp, nbx-chip, nbx-btn/nbx-b-pri, nbx-num, nbx-ic. Bổ sung lp-* trong
 * src/styles/custom/video.css.
 */
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import type { DemoVideoLesson } from "@/lib/demo-data/reading/videos";
import { VIDEO_LESSONS } from "@/lib/demo-data/reading/videos";
import { addLessonRecord } from "@/lib/store/progress";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconPencil,
  IconPlay,
  IconPlayCircle,
} from "../app/icons";
import {
  scoreTranslation,
  VERDICT_LABEL,
  wordCountHint,
  type ScoreResult,
} from "../reading/scorer";
import { isSpeechRecognitionSupported, listenOnce } from "../lesson/speech";
import "../../../../styles/custom/video.css";

type Tab = "dictation" | "transcript" | "shadowing";

type Sentence = { en: string; vi: string | null };

type Props = {
  lesson: DemoVideoLesson;
  backHref: string;
};

const XP_EXACT = 6;
const XP_CLOSE = 3;
const LOOP_SECONDS = [5, 8, 12];

/** Parse videoId từ mọi dạng link YouTube phổ biến (hoặc ID trần 11 ký tự). */
export function parseYouTubeId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

export default function VideoWorkspace({
  lesson,
  backHref,
}: Props): ReactElement {
  /* Transcript thật (Mục 4b): nạp từ /api/video/transcript khi user dán video —
     nếu lỗi/không có phụ đề thì rơi về transcript demo của bài.
     Dịch VI (Mục 4c cũ / phần sau): /api/translate tự dịch từng câu, cache
     localStorage theo videoId để lần sau không gọi lại. */
  const [real, setReal] = useState<Sentence[] | null>(null);
  const [realState, setRealState] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [realErr, setRealErr] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [viMap, setViMap] = useState<Record<number, string>>({});

  const sentences: Sentence[] = real
    ? real.map((s, i) => ({ en: s.en, vi: viMap[i] ?? s.vi }))
    : lesson.transcript;
  const n = sentences.length;

  const [tab, setTab] = useState<Tab>("dictation");
  const [urlInput, setUrlInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  /* --- Dictation state ------------------------------------------------- */
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

  /* --- Shadowing state -------------------------------------------------- */
  const [shSecs, setShSecs] = useState(8);
  const [shLeft, setShLeft] = useState(8);
  const [shRun, setShRun] = useState(false);
  const [shLoop, setShLoop] = useState(true);
  const [shLaps, setShLaps] = useState(0);
  const [shIdx, setShIdx] = useState<number | null>(null);
  /* Mic nói lại + chấm (luyện nói): kết quả so với câu đang chọn. */
  const [shSpk, setShSpk] = useState<ScoreResult | null>(null);
  const [shListening, setShListening] = useState(false);
  const stopShListenRef = useRef<() => void>(() => undefined);

  const resolvedAt = (i: number): boolean =>
    accepted[i] === true || revealed[i] === true;
  const resolvedCount = sentences.filter((_, i) => resolvedAt(i)).length;
  const allResolved = resolvedCount === n;

  // dừng mic khi unmount
  useEffect(
    () => () => {
      stopShListenRef.current();
    },
    [],
  );

  const xp = sentences.reduce((sum, _, i) => {
    if (revealed[i]) return sum;
    const v = results[i]?.verdict;
    if (v === "exact") return sum + XP_EXACT;
    if (v === "close") return sum + XP_CLOSE;
    return sum;
  }, 0);
  const accuracy = Math.round(
    (100 * sentences.reduce((s, _, i) => s + (best[i] ?? 0), 0)) / n,
  );

  const pct = Math.round((100 * resolvedCount) / Math.max(1, n));
  const cur = sentences[idx] ?? sentences[0];
  const result = results[idx];
  const resolvedNow = resolvedAt(idx);
  const nextLesson =
    VIDEO_LESSONS[
      (VIDEO_LESSONS.findIndex((v) => v.slug === lesson.slug) + 1) %
        VIDEO_LESSONS.length
    ];

  /* --- URL --------------------------------------------------------------- */

  const loadVideo = (): void => {
    const id = parseYouTubeId(urlInput);
    if (!id) {
      setUrlError(
        "Không nhận ra video ID — hãy dán link YouTube dạng youtube.com/watch?v=… hoặc youtu.be/…",
      );
      return;
    }
    setUrlError(null);
    setVideoId(id);
    // Reset phiên dictation + bóc transcript thật cho video mới (Mục 4b).
    reset();
    setReal(null);
    setRealState("loading");
    setRealErr(null);
    setViMap({});
    setTranslating(false);
    setShSpk(null);
    fetch(`/api/video/transcript?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const j = (await r.json()) as {
          sentences?: Sentence[];
          error?: string;
        };
        if (!r.ok || !j.sentences?.length)
          throw new Error(j.error ?? `HTTP ${r.status}`);
        return j.sentences as Sentence[];
      })
      .then(async (s) => {
        setReal(s);
        setRealState("ok");
        // Dịch VI: thử cache localStorage trước, thiếu thì gọi /api/translate.
        const lsKey = `aio-trans-vi:${id}`;
        let vi: string[] | null = null;
        try {
          const raw = window.localStorage.getItem(lsKey);
          if (raw) {
            const arr = JSON.parse(raw) as unknown;
            if (Array.isArray(arr) && arr.length === s.length)
              vi = arr as string[];
          }
        } catch {
          // cache hỏng → dịch lại
        }
        if (!vi) {
          setTranslating(true);
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ texts: s.map((x) => x.en) }),
            });
            const j = (await res.json()) as { translations?: string[] };
            if (res.ok && j.translations?.length === s.length)
              vi = j.translations;
          } catch {
            // offline / lỗi dịch → giữ EN
          } finally {
            setTranslating(false);
          }
          if (vi) {
            try {
              window.localStorage.setItem(lsKey, JSON.stringify(vi));
            } catch {
              // lưu được thì tốt, không thì thôi
            }
          }
        }
        if (vi) {
          const m: Record<number, string> = {};
          vi.forEach((t, i) => {
            if (t) m[i] = t;
          });
          setViMap(m);
        }
      })
      .catch((e: unknown) => {
        setRealState("err");
        setTranslating(false);
        setRealErr(e instanceof Error ? e.message : String(e));
      });
  };

  /* --- Dictation handlers ------------------------------------------------ */

  const check = (): void => {
    const r = scoreTranslation(cur.en, drafts[idx] ?? "");
    setResults((prev) => ({ ...prev, [idx]: r }));
    setBest((prev) => ({ ...prev, [idx]: Math.max(prev[idx] ?? 0, r.ratio) }));
    // ≥0.75 "Chính xác" tự động chốt câu.
    if (r.verdict === "exact")
      setAccepted((prev) => ({ ...prev, [idx]: true }));
  };

  const retry = (): void => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
    requestAnimationFrame(() => taRef.current?.focus());
  };

  /** "Xem transcript" — hiện bản mẫu của câu hiện tại, câu này không có XP. */
  const revealSentence = (): void => {
    setRevealed((prev) => ({ ...prev, [idx]: true }));
    setBest((prev) => ({
      ...prev,
      [idx]: Math.max(prev[idx] ?? 0, results[idx]?.ratio ?? 0),
    }));
  };

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

  /* --- Shadowing timer ---------------------------------------------------- */

  useEffect(() => {
    if (!shRun) return;
    const t = window.setInterval(
      () => setShLeft((p) => Math.max(0, p - 1)),
      1000,
    );
    return () => window.clearInterval(t);
  }, [shRun]);

  useEffect(() => {
    if (!shRun || shLeft > 0) return;
    setShLaps((l) => l + 1);
    if (shLoop) {
      setShLeft(shSecs);
    } else {
      setShRun(false);
    }
  }, [shLeft, shRun, shLoop, shSecs]);

  const shadowStart = (i?: number): void => {
    if (typeof i === "number") setShIdx(i);
    setShLeft(shSecs);
    setShRun(true);
  };

  const shadowStop = (): void => setShRun(false);

  const shadowReset = (): void => {
    setShRun(false);
    setShLeft(shSecs);
    setShLaps(0);
    setShIdx(null);
  };

  const pickSecs = (s: number): void => {
    setShSecs(s);
    setShLeft(s);
    setShRun(false);
  };

  /** Nói lại câu đang chọn bằng mic + chấm token overlap (luyện nói). */
  const shadowSpeak = (): void => {
    const target = sentences[shIdx ?? 0];
    if (!target) return;
    if (!isSpeechRecognitionSupported()) return;
    stopShListenRef.current();
    setShSpk(null);
    setShListening(true);
    stopShListenRef.current = listenOnce(
      (text) => {
        setShSpk(scoreTranslation(target.en, text));
      },
      () => setShListening(false),
    );
  };

  /* --- Hoàn thành dictation: XP demo + sync server (fail im lặng) ---------- */

  useEffect(() => {
    if (tab !== "dictation" || !donePhase || !allResolved || postedRef.current)
      return;
    postedRef.current = true;
    const seconds = Math.max(
      1,
      Math.round((Date.now() - startedAt.current) / 1000),
    );
    const difficulty =
      lesson.level === "A2"
        ? "basic"
        : lesson.level === "B2"
          ? "advanced"
          : "intermediate";
    const payload = {
      courseId: `video:${lesson.slug}`,
      mode: "listening" as const,
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
    void fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  }, [tab, donePhase, allResolved, accuracy, xp, lesson]);

  /* --- Render -------------------------------------------------------------- */

  const stepState = (i: number): string => {
    if (resolvedAt(i)) return "nbx-ok";
    if (i === idx && !donePhase) return "nbx-now";
    return "nbx-wait";
  };

  const barButtons = (): ReactElement[] => {
    if (resolvedNow) {
      return [
        <button
          key="next"
          type="button"
          className="nbx-btn nbx-b-pri"
          onClick={advance}
        >
          Câu tiếp theo
        </button>,
      ];
    }
    if (result?.verdict === "close") {
      return [
        <button
          key="acc"
          type="button"
          className="nbx-btn nbx-b-pri"
          onClick={acceptClose}
        >
          Tiếp tục (+{XP_CLOSE} XP)
        </button>,
        <button key="retry" type="button" className="nbx-btn" onClick={retry}>
          Thử lại
        </button>,
      ];
    }
    if (result?.verdict === "miss") {
      return [
        <button
          key="retry"
          type="button"
          className="nbx-btn nbx-b-pri"
          onClick={retry}
        >
          Thử lại
        </button>,
        <button
          key="reveal"
          type="button"
          className="nbx-btn"
          onClick={revealSentence}
        >
          Xem transcript
        </button>,
      ];
    }
    return [
      <button
        key="check"
        type="button"
        className="nbx-btn nbx-b-pri"
        onClick={check}
      >
        Kiểm tra
      </button>,
      <button
        key="reveal"
        type="button"
        className="nbx-btn"
        onClick={revealSentence}
      >
        Xem transcript
      </button>,
    ];
  };

  const tabButton = (key: Tab, label: string): ReactElement => (
    <button
      type="button"
      className={tab === key ? "nbx-on" : ""}
      aria-pressed={tab === key}
      onClick={() => {
        setTab(key);
        if (key === "dictation" && allResolved) setDonePhase(true);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="nbx-dc lp-video-ws">
      <div className="lp-backrow">
        <Link href={backHref} className="lp-back">
          <span className="lp-back-ic" aria-hidden="true">
            <IconArrowRight size={15} style={{ transform: "rotate(180deg)" }} />
          </span>
          Tất cả video
        </Link>
      </div>

      <section className="nbx-blk nbx-r-do nbx-dots" aria-labelledby="vd-ws-h">
        <div className="nbx-row-flex">
          <span className="nbx-tile nbx-f-vid" aria-hidden="true">
            <IconPlay size={17} />
          </span>
          <h1 id="vd-ws-h" className="nbx-disp">
            {lesson.title}
          </h1>
          <span className="nbx-sp" />
          <span className="nbx-chip nbx-plain lp-demo-chip">
            {realState === "ok" ? "Transcript thật (YouTube)" : "Nội dung demo"}
          </span>
        </div>
        <div className="nbx-row-flex lp-meta">
          <span className="nbx-chip nbx-plain">Cấp {lesson.level}</span>
          <span className="nbx-chip nbx-plain">~{lesson.minutes} phút</span>
          <span className="nbx-chip nbx-plain">{n} câu transcript</span>
        </div>
        <p className="nbx-lvd">{lesson.hint}</p>
      </section>

      <section className="nbx-blk lp-urlcard" aria-label="Video của bạn">
        <div className="nbx-bh">
          <h2 className="nbx-disp">Video của bạn.</h2>
          <span className="nbx-bh-sub">dán link YouTube bất kỳ</span>
        </div>
        <form
          className="nbx-row-flex lp-urlrow"
          onSubmit={(e) => {
            e.preventDefault();
            loadVideo();
          }}
        >
          <span className="nbx-inp lp-url-inp">
            <IconPlayCircle className="nbx-ic" size={18} />
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              value={urlInput}
              placeholder="https://www.youtube.com/watch?v=… hoặc youtu.be/…"
              aria-label="Link YouTube"
              spellCheck={false}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </span>
          <button type="submit" className="nbx-btn nbx-b-pri">
            Nạp video
          </button>
        </form>
        {urlError ? (
          <p className="lp-url-err" role="alert">
            {urlError}
          </p>
        ) : null}
        {videoId ? (
          <div className="lp-frame">
            <iframe
              key={videoId}
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="Video YouTube của bạn"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="lp-frame lp-frame-empty">
            <IconPlayCircle className="nbx-ic" size={44} />
            <span>Chưa có video — dán link rồi bấm “Nạp video”.</span>
          </div>
        )}
        <p className="lp-url-note">
          Hỗ trợ link youtube.com/watch, youtu.be, /shorts, /embed hoặc ID trần
          11 ký tự. Video chỉ hiển thị trong phiên này, không được lưu lại. Khi
          nạp video, hệ thống tự bóc transcript thật từ phụ đề YouTube — không
          bóc được thì dùng transcript demo của bài.
        </p>
        {realState === "loading" ? (
          <p className="lp-url-note" role="status">
            Đang bóc transcript thật từ phụ đề YouTube…
          </p>
        ) : realState === "err" ? (
          <p className="lp-url-err" role="status">
            {`Không bóc được transcript thật (${realErr ?? "lỗi"}) — đang dùng transcript demo của bài.`}
          </p>
        ) : realState === "ok" ? (
          <p className="lp-url-note" role="status">
            {translating
              ? `Đã nạp ${real?.length ?? 0} câu transcript thật — đang dịch tiếng Việt…`
              : `Đã nạp ${real?.length ?? 0} câu transcript thật (kèm dịch tiếng Việt khi có) — cả 3 tab Dictation / Transcript / Nói theo đều dùng bản thật.`}
          </p>
        ) : null}
      </section>

      <section className="nbx-blk lp-switch" aria-label="Cách học">
        <div className="nbx-seg" role="group" aria-label="Chọn cách học">
          {tabButton("dictation", "Nghe & gõ lại")}
          {tabButton("transcript", "Transcript")}
          {tabButton("shadowing", "Nói theo")}
        </div>
        {tab === "dictation" ? (
          <div className="nbx-d-meter">
            <span>{`${resolvedCount}/${n} câu đã gõ`}</span>
            <span className="nbx-bar">
              <i style={{ "--nb-x-p": `${pct}%` } as CSSProperties} />
            </span>
          </div>
        ) : null}
      </section>

      {tab === "dictation" ? (
        <section className="lp-practice" aria-label="Dictation">
          <div className="nbx-d-prac">
            <div className="nbx-d-col">
              {donePhase && allResolved ? (
                <div className="nbx-blk nbx-r-ok lp-done">
                  <div className="nbx-d-done-h">
                    <h3 className="nbx-disp">Hoàn thành dictation!</h3>
                    <span className="nbx-d-xp">
                      <IconCheck className="nbx-ic" size={18} />+{xp} XP
                    </span>
                  </div>
                  <div className="nbx-d-tally">
                    <span>
                      <b className="nbx-num">
                        {
                          sentences.filter(
                            (_, i) => resolvedAt(i) && !revealed[i],
                          ).length
                        }
                      </b>
                      <small>Gõ đúng</small>
                    </span>
                    <span>
                      <b className="nbx-num">
                        {sentences.filter((_, i) => revealed[i]).length}
                      </b>
                      <small>Xem transcript</small>
                    </span>
                    <span>
                      <b className="nbx-num">{accuracy}%</b>
                      <small>Điểm tổng</small>
                    </span>
                    <span>
                      <b className="nbx-num">{n}</b>
                      <small>Số câu</small>
                    </span>
                  </div>
                  <div className="nbx-d-verdict">
                    <p>
                      Điểm tổng {accuracy}% trùng từ khóa với transcript demo
                      (Nội dung demo). XP đã ghi vào tiến độ — lỗi đồng bộ
                      server được bỏ qua im lặng.
                    </p>
                  </div>
                  <div className="nbx-d-bar">
                    <button
                      type="button"
                      className="nbx-btn nbx-b-pri"
                      onClick={reset}
                    >
                      Làm lại
                    </button>
                    <Link className="nbx-btn" href={backHref}>
                      Về danh sách video
                    </Link>
                    <Link
                      className="nbx-btn"
                      href={`/video/${nextLesson.slug}`}
                    >
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
                    <span className="nbx-chip nbx-plain">
                      {wordCountHint(cur.en)} từ
                    </span>
                  </div>
                  <p className="nbx-d-ctx">
                    Phát video và nghe kỹ, tạm dừng ở câu này rồi gõ lại những
                    gì bạn nghe được. Không rõ chữ nào thì bỏ trống — máy chấm
                    theo từ khớp (bỏ qua dấu câu, mạo từ).
                  </p>
                  <textarea
                    ref={taRef}
                    className="nbx-d-ans lp-ans"
                    value={drafts[idx] ?? ""}
                    placeholder="Type what you hear…"
                    rows={3}
                    spellCheck={false}
                    aria-label="Câu bạn nghe được"
                    disabled={resolvedNow}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                  />
                  {result ? (
                    <div className="nbx-d-res">
                      <div className="nbx-d-rh">
                        <h3>{VERDICT_LABEL[result.verdict]}</h3>
                        <span className="nbx-chip nbx-plain">
                          {Math.round(result.ratio * 100)}% trùng từ khóa
                        </span>
                        <span className="nbx-act">
                          {result.verdict === "exact" && !revealed[idx] ? (
                            <span className="nbx-chip">+{XP_EXACT} XP</span>
                          ) : result.verdict === "close" && !revealed[idx] ? (
                            <span className="nbx-chip">+{XP_CLOSE} XP</span>
                          ) : null}
                        </span>
                      </div>
                      <div
                        className="nbx-d-toks"
                        aria-label="Đối chiếu từ khóa"
                      >
                        {result.refTokens.map((t, i) => (
                          <span
                            key={i}
                            className={`nbx-d-tok ${result.matchedRef[i] ? "nbx-y" : "nbx-n"}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="nbx-d-legend">
                        <span>
                          <i className="nbx-sw1" /> Gõ đúng
                        </span>
                        <span>
                          <i className="nbx-sw2" /> Thiếu hoặc sai
                        </span>
                      </div>
                      {result.verdict !== "miss" || revealed[idx] ? (
                        <div className="nbx-d-pass lp-sample">
                          <p>
                            <b>Transcript: </b>
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
                  <li
                    key={i}
                    className={stepState(i)}
                    onClick={() => jumpTo(i)}
                  >
                    {resolvedAt(i) ? (
                      <IconCheck className="nbx-ic" size={18} />
                    ) : i === idx && !donePhase ? (
                      <IconPencil className="nbx-ic" size={18} />
                    ) : (
                      <IconClock className="nbx-ic" size={18} />
                    )}
                    <span className="nbx-ell">{`Câu ${i + 1}`}</span>
                  </li>
                ))}
              </ol>
              <p className="nbx-d-para">Quy tắc chấm</p>
              <div className="nbx-d-note">
                <span>
                  ≥75% từ khớp → Chính xác (+6 XP); 40–75% → Gần đúng (+3 XP);
                  dưới 40% → Sai (thử lại hoặc xem transcript, không XP).
                  Transcript là Nội dung demo.
                </span>
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {tab === "transcript" ? (
        <section className="nbx-blk lp-transcript" aria-label="Transcript demo">
          <div className="nbx-d-note">
            <IconPlayCircle className="nbx-ic" size={20} />
            <span>
              {realState === "ok"
                ? translating
                  ? "Bản ghi thật từ phụ đề YouTube — đang dịch tiếng Việt từng câu (dòng dịch sẽ hiện dần)."
                  : "Bản ghi thật từ phụ đề YouTube kèm dịch tiếng Việt — đọc theo từng câu, dò từ mới trước khi quay lại tab “Nghe & gõ lại”."
                : "Bản ghi demo song ngữ — đọc theo từng câu, dò từ mới trước khi quay lại tab “Nghe & gõ lại”. Nạp video của bạn để dùng transcript thật."}
            </span>
          </div>
          <div className="nbx-d-lines">
            {sentences.map((s, i) => (
              <div key={i} className="nbx-d-line">
                <span className="nbx-d-n" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="lp-line-body">
                  <p className="lp-line-en">{s.en}</p>
                  {s.vi ? <p className="lp-line-vi">{s.vi}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "shadowing" ? (
        <section className="nbx-blk lp-shadow" aria-label="Shadowing">
          <div className="nbx-d-note">
            <IconPlayCircle className="nbx-ic" size={20} />
            <span>
              Shadowing: nghe một câu trong video, tạm dừng, nói lại đúng ngữ
              điệu trong khoảng thời gian đếm được. Bấm “Lặp câu này” để bắt đầu
              vòng đếm cho câu đó.
            </span>
          </div>

          <div className="nbx-row-flex lp-sh-tools">
            <div
              className="nbx-seg"
              role="group"
              aria-label="Thời gian mỗi vòng"
            >
              {LOOP_SECONDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={shSecs === s ? "nbx-on" : ""}
                  aria-pressed={shSecs === s}
                  onClick={() => pickSecs(s)}
                >
                  {s} giây
                </button>
              ))}
            </div>
            <span className="nbx-sp" />
            <button
              type="button"
              className={`nbx-btn nbx-sm${shLoop ? " nbx-on" : ""}`}
              aria-pressed={shLoop}
              onClick={() => setShLoop((v) => !v)}
            >
              {shLoop ? "Lặp liên tục: bật" : "Lặp liên tục: tắt"}
            </button>
          </div>

          <div className="lp-sh-timerrow">
            <div className="lp-sh-timer" role="timer" aria-live="off">
              <b className="nbx-num">{shLeft}</b>
              <small>giây{shIdx !== null ? ` · câu ${shIdx + 1}` : ""}</small>
            </div>
            <div className="lp-sh-laps">
              <b className="nbx-num">{shLaps}</b>
              <small>vòng đã nói</small>
            </div>
            <div className="nbx-row-flex lp-sh-controls">
              {isSpeechRecognitionSupported() ? (
                <button
                  type="button"
                  onClick={shadowSpeak}
                  className={
                    "nbx-btn nbx-sm" + (shListening ? " lp-mic-on" : "")
                  }
                  aria-label="Nói lại bằng mic và chấm điểm"
                >
                  {shListening ? "Đang nghe…" : "🎤 Nói lại & chấm"}
                </button>
              ) : null}
              {shRun ? (
                <button
                  type="button"
                  className="nbx-btn nbx-b-pri"
                  onClick={shadowStop}
                >
                  Tạm dừng
                </button>
              ) : (
                <button
                  type="button"
                  className="nbx-btn nbx-b-pri"
                  onClick={() => shadowStart()}
                >
                  {shLeft > 0 && shLeft < shSecs ? "Tiếp tục" : "Bắt đầu"}
                </button>
              )}
              <button type="button" className="nbx-btn" onClick={shadowReset}>
                Đếm lại
              </button>
            </div>
          </div>

          {shSpk ? (
            <div
              className={`lp-spk nbx-d-note mt-3 ${shSpk.verdict === "close" ? "lp-spk-close" : "lp-spk-miss"}`}
              role="status"
            >
              <p className="text-sm font-extrabold">
                {VERDICT_LABEL[shSpk.verdict]}
                <span className="ml-2 text-2xs font-bold opacity-70">
                  {Math.round(shSpk.ratio * 100)}% trùng từ khóa
                </span>
              </p>
              <div
                className="lp-spk-toks mt-2 flex flex-wrap gap-1.5"
                aria-label="Đối chiếu từ khóa"
              >
                {shSpk.refTokens.map((t, i) => (
                  <span
                    key={i}
                    className={`lp-spk-tok ${shSpk.matchedRef[i] ? "lp-spk-y" : "lp-spk-n"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-2xs leading-relaxed opacity-80">
                {shSpk.verdict === "miss"
                  ? "Máy nghe chưa khớp — chọn câu cụ thể (bấm “Lặp câu này”), nghe lại rồi bấm mic nói lần nữa."
                  : "So với câu mẫu trong tab này — ngữ điệu quan trọng hơn độ chính xác từng từ."}
              </p>
            </div>
          ) : null}

          <div className="nbx-d-lines">
            {sentences.map((s, i) => (
              <div
                key={i}
                className={`nbx-d-line${shIdx === i && shRun ? " nbx-fix" : ""}`}
              >
                <span className="nbx-d-n" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="lp-line-body">
                  <p className="lp-line-en">{s.en}</p>
                  {s.vi ? <p className="lp-line-vi">{s.vi}</p> : null}
                </div>
                <button
                  type="button"
                  className="nbx-btn nbx-sm lp-reveal"
                  onClick={() => shadowStart(i)}
                >
                  Lặp câu này
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
