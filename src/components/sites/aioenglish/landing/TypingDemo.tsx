"use client";

// Bài chơi thử on the landing hero — rebuilt from the source SSR markup.
// Idle state mirrors the source DOM exactly; play behavior re-implemented.

import { useEffect, useRef, useState } from "react";

type Token = { w: string; ipa: string };

type DemoSentence = {
  groups: Token[][]; // token groups rendered side by side (matching source grouping)
  colors: string; // ling token color key set for groups
  vi: string;
  pills?: string[][];
};

const S1: DemoSentence = {
  groups: [
    [{ w: "I", ipa: "aɪ" }],
    [{ w: "like", ipa: "laɪk" }],
    [
      { w: "the", ipa: "ðə" },
      { w: "blue", ipa: "bluː" },
      { w: "sky.", ipa: "skaɪ" },
    ],
  ],
  colors: "blue,green,gold",
  vi: "Tôi thích bầu trời xanh.",
  pills: [["Đại"], ["Động"], ["Mạo", "Tính", "Danh"]],
};

// Remaining demo sentences use real course data from the site (B1 course).
const S2: DemoSentence = {
  groups: [
    [{ w: "I", ipa: "aɪ" }, { w: "have", ipa: "hæv" }, { w: "lived", ipa: "lɪvd" }],
    [{ w: "in", ipa: "ɪn" }, { w: "this", ipa: "ðɪs" }, { w: "city", ipa: "ˈsɪti" }],
    [{ w: "for", ipa: "fɔː(r)" }, { w: "five", ipa: "faɪv" }, { w: "years.", ipa: "jɪəz" }],
  ],
  colors: "blue,green,gold",
  vi: "Tôi đã sống ở thành phố này được năm năm rồi.",
};
const S3: DemoSentence = {
  groups: [
    [{ w: "I", ipa: "aɪ" }, { w: "have", ipa: "hæv" }, { w: "worked", ipa: "wɜːkt" }],
    [{ w: "at", ipa: "æt" }, { w: "a", ipa: "ə" }, { w: "cafe", ipa: "ˈkæfeɪ" }],
    [{ w: "for", ipa: "fɔː(r)" }, { w: "four", ipa: "fɔː(r)" }, { w: "months.", ipa: "mʌnθs" }],
  ],
  colors: "blue,green,gold",
  vi: "Tôi đã làm việc ở một quán cà phê được bốn tháng rồi.",
};
const S4: DemoSentence = {
  groups: [
    [{ w: "We", ipa: "wiː" }, { w: "have", ipa: "hæv" }, { w: "studied", ipa: "ˈstʌdid" }],
    [{ w: "together", ipa: "təˈɡeðə(r)" }],
    [{ w: "for", ipa: "fɔː(r)" }, { w: "three", ipa: "θriː" }, { w: "years.", ipa: "jɪəz" }],
  ],
  colors: "blue,green,gold",
  vi: "Chúng tôi đã học cùng nhau được ba năm rồi.",
};
const S5: DemoSentence = {
  groups: [
    [{ w: "She", ipa: "ʃiː" }, { w: "has", ipa: "hæz" }, { w: "worn", ipa: "wɔːn" }],
    [{ w: "glasses", ipa: "ˈɡlɑːsɪz" }],
    [{ w: "for", ipa: "fɔː(r)" }, { w: "ten", ipa: "ten" }, { w: "years.", ipa: "jɪəz" }],
  ],
  colors: "blue,green,gold",
  vi: "Cô ấy đã đeo kính được mười năm rồi.",
};
const S6: DemoSentence = {
  groups: [
    [{ w: "I", ipa: "aɪ" }, { w: "have", ipa: "hæv" }, { w: "had", ipa: "hæd" }],
    [{ w: "this", ipa: "ðɪs" }, { w: "phone", ipa: "fəʊn" }],
    [{ w: "for", ipa: "fɔː(r)" }, { w: "three", ipa: "θriː" }, { w: "months.", ipa: "mʌnθs" }],
  ],
  colors: "blue,green,gold",
  vi: "Tôi đã có chiếc điện thoại này được ba tháng rồi.",
};

const DEMO: DemoSentence[] = [S1, S2, S3, S4, S5, S6];

const GROUP_STYLES: Record<string, { bg: string; underline: string[]; pill: string[] }> = {
  blue: {
    bg: "ling-blue-bg",
    underline: ["ling-teal"],
    pill: ["ling-teal"],
  },
  green: {
    bg: "ling-green-bg",
    underline: ["ling-green"],
    pill: ["ling-green"],
  },
  gold: {
    bg: "ling-gold-bg",
    underline: ["ling-slate", "ling-violet", "ling-blue"],
    pill: ["ling-slate", "ling-violet", "ling-blue"],
  },
};

const hsl = (v: string) => `hsl(var(--${v}))`;
const hslA = (v: string, a: number) => `hsl(var(--${v}) / ${a})`;

const GROUP_PILL_LABELS: Record<string, string[][]> = {
  blue: [["Đại"]],
  green: [["Động"]],
  gold: [["Mạo", "Tính", "Danh"]],
};

export default function TypingDemo() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [si, setSi] = useState(0); // sentence index
  const [ti, setTi] = useState(0); // token index (flattened)
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sentence = DEMO[si];
  const flat: Token[] = sentence.groups.flat();
  const total = DEMO.reduce((n, s) => n + s.groups.flat().length, 0);
  const done = DEMO.slice(0, si).reduce((n, s) => n + s.groups.flat().length, 0) + ti;
  const progress = Math.round((done / total) * 100);

  // listen for Enter on the idle card (matches source: "Chạm hoặc nhấn Enter")
  useEffect(() => {
    if (phase !== "idle") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function start() {
    setPhase("playing");
    setSi(0);
    setTi(0);
    setValue("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submit() {
    const target = flat[ti];
    if (!target) return;
    const norm = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").trim();
    if (norm(value) === norm(target.w)) {
      setValue("");
      if (ti + 1 < flat.length) {
        setTi(ti + 1);
      } else if (si + 1 < DEMO.length) {
        setSi(si + 1);
        setTi(0);
      } else {
        setPhase("done");
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
  }

  // ---------- idle: exact source markup ----------
  if (phase === "idle") {
    return (
      <div id="go-thu" data-hero-demo data-v-899ba7f3="" className="hero-demo min-w-0 scroll-mt-24">
        <div>
          <div className="relative">
            <section
              data-v-a4dd9983="" data-v-d8aa9686="" className="dmf-win nbx-r-info lpa-blk relative overflow-hidden rounded-card-lg border-bw border-border-strong bg-surface shadow-sh-4 lift press"
              aria-label="Học qua gõ câu"
            >
              <div data-v-d8aa9686="" className="dmf-grid flex items-center gap-4 border-b-bw border-border-strong px-4 py-2.5 md:px-6">
                <span
                  data-demo-ico
                  aria-hidden="true"
                  className="dmf-ico hidden shrink-0 place-items-center rounded-[14px] border-bw border-border-strong bg-surface text-fg shadow-sh-1 sm:grid"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-list-icon"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M8 6h13"></path>
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <h2 className="font-hero truncate text-md font-extrabold leading-tight text-fg">
                    Bài chơi thử.
                  </h2>
                  <p className="truncate text-2xs font-semibold text-fg-muted sm:text-xs">
                    6 câu mẫu, không cần tài khoản
                  </p>
                </span>
              </div>
              <div data-v-a4dd9983="" className="dmf-grid relative" style={{ minHeight: "var(--landing-demo-h)" }}>
                <button
                  type="button"
                  data-testid="landing-demo-placeholder"
                  data-fx-cover
                  onClick={start}
                  data-v-a4dd9983=""
                  className="group demo-ph flex w-full flex-col bg-surface px-4 pb-6 text-center md:px-6"
                  style={{ minHeight: "var(--landing-demo-h)" }}
                >
                  <span data-v-a4dd9983="" className="mt-3 block h-3 w-full shrink-0 overflow-hidden rounded-pill border-bw border-border-strong bg-surface">
                    <span data-v-a4dd9983="" className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))]" />
                  </span>
                  <span className="flex min-h-0 flex-1 flex-col items-center justify-center py-6 max-md:pt-12">
                    <span data-v-a4dd9983="" className="rv-anchor grid w-full">
                      <span data-v-a4dd9983="" className="rv-mid w-full">
                        <span data-v-a4dd9983="" className="rv-scope block w-full" data-annot>
                          <span className="justify-center flex flex-wrap items-start gap-x-2 gap-y-5 md:gap-x-4 md:gap-y-8">
                            <TokenGroup tokens={S1.groups[0]} colorKey="blue" pillLabels={GROUP_PILL_LABELS.blue[0]} doneCount={0} />
                            <TokenGroup tokens={S1.groups[1]} colorKey="green" pillLabels={GROUP_PILL_LABELS.green[0]} doneCount={0} tooltip />
                            <TokenGroup tokens={S1.groups[2]} colorKey="gold" pillLabels={GROUP_PILL_LABELS.gold[0]} doneCount={0} />
                          </span>
                        </span>
                      </span>
                    </span>
                    <span data-v-a4dd9983="" className="rv-bot flex w-full flex-col items-center gap-3">
                      <span data-v-a4dd9983="" className="rv-vi block break-words leading-snug text-fg-muted">{S1.vi}</span>
                      <span data-v-a4dd9983="" className="demo-cta block text-md font-semibold text-primary sm:text-lg">
                        Chạm hoặc nhấn Enter để chơi thử
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ---------- done ----------
  if (phase === "done") {
    return (
      <div id="go-thu" data-hero-demo data-v-899ba7f3="" className="hero-demo min-w-0 scroll-mt-24">
        <div>
          <div className="relative">
            <section
              data-v-a4dd9983="" data-v-d8aa9686="" className="dmf-win nbx-r-info lpa-blk relative overflow-hidden rounded-card-lg border-bw border-border-strong bg-surface shadow-sh-4 lift press"
              aria-label="Học qua gõ câu"
            >
              <div data-v-d8aa9686="" className="dmf-grid flex items-center gap-4 border-b-bw border-border-strong px-4 py-2.5 md:px-6">
                <span
                  data-demo-ico
                  aria-hidden="true"
                  className="dmf-ico hidden shrink-0 place-items-center rounded-[14px] border-bw border-border-strong bg-surface text-fg shadow-sh-1 sm:grid"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-list-icon"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M8 6h13"></path>
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <h2 className="font-hero truncate text-md font-extrabold leading-tight text-fg">
                    Bài chơi thử.
                  </h2>
                  <p className="truncate text-2xs font-semibold text-fg-muted sm:text-xs">
                    6 câu mẫu, không cần tài khoản
                  </p>
                </span>
              </div>
              <div data-v-a4dd9983="" className="dmf-grid relative" style={{ minHeight: "var(--landing-demo-h)" }}>
                <div className="flex w-full flex-col items-center justify-center gap-4 px-4 pb-6 text-center" style={{ minHeight: "var(--landing-demo-h)" }}>
                  <span data-v-a4dd9983="" className="mt-3 block h-3 w-full shrink-0 overflow-hidden rounded-pill border-bw border-border-strong bg-surface">
                    <span className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))]" style={{ width: "100%" }} />
                  </span>
                  <p className="font-hero text-lg font-extrabold text-fg">Xong 6 câu mẫu!</p>
                  <p className="max-w-[40ch] text-sm leading-relaxed text-fg-muted">
                    Trong app, mỗi câu đều kèm phiên âm IPA, nghĩa tiếng Việt và lịch ôn giãn cách.
                  </p>
                  <a
                    href="/auth/register"
                    className="btn-ink btn-ink-cta flex h-11 items-center rounded-[var(--r-pill)] px-5 text-sm font-bold whitespace-nowrap"
                  >
                    Tạo tài khoản miễn phí
                  </a>
                  <button
                    type="button"
                    onClick={start}
                    className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Chơi lại từ đầu
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ---------- playing ----------
  return (
    <div id="go-thu" data-hero-demo data-v-899ba7f3="" className="hero-demo min-w-0 scroll-mt-24">
      <div>
        <div className="relative">
          <section
            data-v-a4dd9983="" data-v-d8aa9686="" className="dmf-win nbx-r-info lpa-blk relative overflow-hidden rounded-card-lg border-bw border-border-strong bg-surface shadow-sh-4 lift press"
            aria-label="Học qua gõ câu"
          >
            <div data-v-d8aa9686="" className="dmf-grid flex items-center gap-4 border-b-bw border-border-strong px-4 py-2.5 md:px-6">
              <span
                data-demo-ico
                aria-hidden="true"
                className="dmf-ico hidden shrink-0 place-items-center rounded-[14px] border-bw border-border-strong bg-surface text-fg shadow-sh-1 sm:grid"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list-icon"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M3 12h.01"></path>
                  <path d="M3 18h.01"></path>
                  <path d="M3 6h.01"></path>
                  <path d="M8 12h13"></path>
                  <path d="M8 18h13"></path>
                  <path d="M8 6h13"></path>
                </svg>
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <h2 className="font-hero truncate text-md font-extrabold leading-tight text-fg">
                  Bài chơi thử.
                </h2>
                <p className="truncate text-2xs font-semibold text-fg-muted sm:text-xs">
                  Câu {si + 1} / {DEMO.length} · gõ lại câu mẫu
                </p>
              </span>
            </div>
            <div data-v-a4dd9983="" className="dmf-grid relative" style={{ minHeight: "var(--landing-demo-h)" }}>
              <div className="flex w-full flex-col px-4 pb-6 md:px-6" style={{ minHeight: "var(--landing-demo-h)" }}>
                <span data-v-a4dd9983="" className="mt-3 block h-3 w-full shrink-0 overflow-hidden rounded-pill border-bw border-border-strong bg-surface">
                  <span
                    data-v-a4dd9983="" className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </span>
                <span className="flex min-h-0 flex-1 flex-col items-center justify-center py-6">
                  <span data-v-a4dd9983="" className="rv-scope block w-full" data-annot>
                    <span className="justify-center flex flex-wrap items-start gap-x-2 gap-y-5 md:gap-x-4 md:gap-y-8">
                      {sentence.groups.map((g, gi) => (
                        <TokenGroup
                          key={gi}
                          tokens={g}
                          colorKey={sentence.colors.split(",")[gi]}
                          doneCount={Math.max(0, Math.min(g.length, ti - offsetOfGroup(sentence, gi)))}
                          current={ti >= offsetOfGroup(sentence, gi) && ti < offsetOfGroup(sentence, gi) + g.length ? ti - offsetOfGroup(sentence, gi) : undefined}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="rv-bot flex w-full flex-col items-center gap-3 pt-6">
                    <span data-v-a4dd9983="" className="rv-vi block break-words leading-snug text-fg-muted">{sentence.vi}</span>
                    <span className={"flex w-full max-w-sm items-center gap-2 " + (shake ? "demo-shake" : "")}>
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
                        spellCheck={false}
                        className="h-11 w-full rounded-[var(--r-card)] border-bw border-border-strong bg-surface px-4 text-center text-lg font-bold text-fg outline-none focus:border-primary"
                        placeholder="Gõ từ đang thiếu…"
                      />
                      <button
                        type="button"
                        onClick={submit}
                        className="btn-ink flex h-11 shrink-0 items-center rounded-[var(--r-pill)] px-4 text-sm font-bold whitespace-nowrap"
                      >
                        Tiếp tục
                      </button>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function offsetOfGroup(sentence: DemoSentence, gi: number): number {
  let n = 0;
  for (let i = 0; i < gi; i++) n += sentence.groups[i].length;
  return n;
}

function TokenGroup({
  tokens,
  colorKey,
  pillLabels,
  doneCount,
  current,
  tooltip,
}: {
  tokens: Token[];
  colorKey: string;
  pillLabels?: string[];
  doneCount: number;
  current?: number;
  tooltip?: boolean;
}) {
  const st = GROUP_STYLES[colorKey] ?? GROUP_STYLES.blue;
  return (
    <span data-v-3f6e36d4="" className="relative flex max-w-full flex-col items-center">
      {tooltip && doneCount === 0 ? (
        <span data-v-3f6e36d4="" className="pointer-events-none absolute bottom-[calc(100%+1.25rem)] left-1/2 hidden w-[min(24rem,80vw)] -translate-x-1/2 rounded-card border-bw border-border-strong bg-surface px-4 py-3 text-left text-sm text-fg shadow-sh-2 md:block">
          <span className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--ling-green))" }} />
            <span className="font-semibold">Động từ</span>
          </span>
          <span className="block leading-relaxed text-fg-muted">
            Động từ chính của câu - nó cho biết chủ ngữ “I” đang làm gì hoặc cảm thấy thế nào.
          </span>
          <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-bw border-r-bw border-border-strong bg-surface" />
        </span>
      ) : null}
      <span data-v-3f6e36d4="" className="grid max-w-full justify-center gap-y-1" style={{ gridTemplateColumns: `repeat(${tokens.length}, max-content)` }}>
        {tokens.map((t, i) => (
          <span
            key={"ipa" + i}
            data-v-3f6e36d4="" className="font-ipa ipa-tone rv-ipa justify-self-center whitespace-nowrap px-1.5 py-0.5 text-center leading-none"
            style={{ gridColumn: i + 1, gridRow: 1 }}
          >
            {t.ipa}
          </span>
        ))}
        <span
          data-v-3f6e36d4="" className="rounded-lg shadow-sh-1 transition-[filter] duration-150 group-hover:brightness-110"
          style={{ gridColumn: `1 / -1`, gridRow: 2, backgroundColor: hsl(st.bg), color: "hsl(var(--ling-on))" }}
        />
        {tokens.map((t, i) => (
          <span
            key={"w" + i}
            className={
              "rv-word relative z-10 flex items-center justify-center whitespace-nowrap px-1.5 font-bold leading-tight transition-opacity" +
              (i < doneCount ? " opacity-45" : "") +
              (current === i ? " demo-current" : "")
            }
            style={{ gridColumn: i + 1, gridRow: 2, color: "hsl(var(--ling-on))" }}
          >
            {t.w}
          </span>
        ))}
        {tokens.map((t, i) => (
          <span key={"u" + i} className="flex min-w-0 px-1.5" style={{ gridColumn: i + 1, gridRow: 3 }}>
            <span className="h-1 w-full rounded-full" style={{ backgroundColor: hsl(st.underline[i % st.underline.length]) }} />
          </span>
        ))}
        {pillLabels &&
          pillLabels.map((p, i) => (
            <span key={"p" + i} className="flex min-w-0 justify-center px-0.5" style={{ gridColumn: i + 1, gridRow: 4 }}>
              <span
                className="rv-pill max-w-full whitespace-nowrap rounded-full border px-1.5 py-0.5 text-center font-medium leading-tight"
                style={{
                  color: hsl(st.pill[i % st.pill.length]),
                  borderColor: hslA(st.pill[i % st.pill.length], 0.45),
                  backgroundColor: hslA(st.pill[i % st.pill.length], 0.14),
                }}
              >
                {p}
              </span>
            </span>
          ))}
      </span>
    </span>
  );
}
