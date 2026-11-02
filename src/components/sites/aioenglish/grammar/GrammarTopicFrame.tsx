"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { nguPhapCatalog as catalog } from "@/lib/demo-data/nguPhapCatalog";
import summaries from "@/lib/ui-fixtures/path-node-summaries.json";
import tocSamples from "@/lib/ui-fixtures/grammar-topic-toc-sample.json";
import samples from "@/lib/ui-fixtures/grammar-topic-overview-sample.json";
import { speak, stopSpeaking } from "../lesson/speech";
import GrammarWordTap from "./GrammarWordTap";
import UiDialog from "../app/UiDialog";
import LessonNavigationDrawer from "../lesson/LessonNavigationDrawer";
import { GrammarDocumentBody } from "./GrammarTopicDocument";
import "@/styles/custom/grammar-topic-reference.css";
import "@/styles/custom/grammar-topic-parity.css";
const s = { "data-v-898db0d9": "" },
  bar = { "data-v-969b182c": "" },
  teach = { "data-v-804e25e6": "" },
  outlineScope = { "data-v-f948927d": "" };
type Example = { en: string; vi: string; focus?: string | string[] };
type Row = { title: string; label: string; sub: boolean; current: boolean };
type Sample = { body: string; examples: Example[]; outline: Row[] };
function Icon({ kind = "back", size = 18 }: { kind?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={
          kind === "menu"
            ? "M4 6h16M4 12h16M4 18h16"
            : kind === "expand"
              ? "M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"
              : kind === "speaker"
                ? "M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"
                : "m12 19-7-7 7-7M19 12H5"
        }
      />
    </svg>
  );
}
export default function GrammarTopicFrame({ slug }: { slug: string }) {
  const router = useRouter();
  const mounted = useRef(false);
  const topic = catalog.topics.find((t) => t.slug === slug)!;
  const nodes = topic.nodeIds.flatMap(
    (id) => catalog.nodes.find((n) => n.id === id) ?? [],
  );
  const first = nodes[0];
  const existing = (
    summaries as Record<string, { intro: string; examples: Example[] }>
  )[first?.id];
  const sample = (samples as Record<string, Sample>)[slug];
  const examples = sample?.examples ?? existing?.examples ?? [];
  const rows: Row[] = sample?.outline ?? [
    { title: topic.title, label: "Tổng quan", sub: false, current: true },
    ...nodes.map((n, i) => ({
      title: n.title,
      label: `Chương ${i + 1}`,
      sub: false,
      current: false,
    })),
  ];
  const tocRows = (tocSamples as Record<string,{title:string;items:string[]}[]>)[slug] ?? [
    {title:`Tổng quan: ${topic.title}`,items:[]}, ...nodes.map((node,i)=>({title:`Chương ${i+1}: ${node.title}`,items:[]}))
  ];
  const [menu, setMenu] = useState(false),
    [toc, setToc] = useState(false),
    [documentOpen, setDocumentOpen] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [fullError, setFullError] = useState("");
  const nextHref = first ? `/ngu-phap/${first.id}/luyen-tap` : "/ngu-phap";
  useEffect(() => {
    mounted.current = true;
    const previousPage = document.documentElement.dataset.nbPage;
    document.documentElement.dataset.nbPage = "ngu-phap:chu-de-hoc";
    const update = () => setFullscreen(!!document.fullscreenElement);
    update();
    document.addEventListener("fullscreenchange", update);
    return () => {
      mounted.current = false;
      stopSpeaking();
      document.removeEventListener("fullscreenchange", update);
      if (previousPage === undefined)
        delete document.documentElement.dataset.nbPage;
      else document.documentElement.dataset.nbPage = previousPage;
    };
  }, []);
  useEffect(() => {
    const next = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.key !== "Enter" ||
        menu ||
        toc ||
        documentOpen ||
        (event.target as Element | null)?.closest?.(
          'a,button,input,textarea,select,[contenteditable="true"],[role="button"]',
        )
      )
        return;
      event.preventDefault();
      router.push(nextHref);
    };
    document.addEventListener("keydown", next);
    return () => document.removeEventListener("keydown", next);
  }, [router, nextHref, menu, toc, documentOpen]);
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Bỏ qua tới nội dung chính
      </a>
      <main
        id="main-content"
        className="fx-grid min-h-0 flex-1 overflow-y-auto safe-l safe-r ui-grammar-topic"
        style={{ height: "100dvh" }}
        tabIndex={-1}
      >
        <div
          className="nb-lesson np-lesson np-route"
          data-nb-accent="camdao"
          data-testid="ngu-phap-chu-de-hoc"
          data-v-c3d140c5=""
        >
          <div
            {...s}
            className="nbl-lx gr-lx"
            data-testid="grammar-runner"
            data-mode="guided"
            data-screen="def"
            data-stage="def"
            data-chapter="0"
          >
            <header
              {...bar}
              {...s}
              className="nbc-hd nbl-bar"
              data-nb-header=""
              data-lesson-bar=""
            >
              <span
                {...bar}
                className="nbc-tape is-msk nbl-tape"
                aria-hidden="true"
              />
              <div {...bar} className="nbl-lead">
                <Link
                  {...bar}
                  href="/ngu-phap"
                  className="nbl-bk is-long"
                  aria-label="Về Luyện ngữ pháp"
                >
                  <Icon size={19} />
                  <span>Luyện ngữ pháp</span>
                </Link>
                <button
                  {...bar}
                  type="button"
                  className="nb-btn nb-btn-soft nb-btn-icon nbl-ib"
                  aria-label="Menu điều hướng"
                  aria-haspopup="dialog"
                  aria-expanded={menu}
                  onClick={() => setMenu(true)}
                >
                  <Icon kind="menu" size={16} />
                </button>
              </div>
              <div {...bar} className="nbl-ttl" data-lesson-title="">
                <p {...s} className="nbl-k">
                  <span {...s} className="nbl-cut">
                    Bài A→Z · {topic.levels.join("-")}
                  </span>
                </p>
                <h1 {...s} className="nbl-t" data-testid="runner-title">
                  {topic.title}
                </h1>
              </div>
              <div {...bar} className="nbl-prog">
                <p {...s} className="nbl-prog-h">
                  <span {...s}>
                    Chương <b {...s}>0</b>/{nodes.length} · Tổng quan
                  </span>
                  <span {...s}>0%</span>
                </p>
                <div
                  {...s}
                  className="nbl-pbar"
                  role="progressbar"
                  aria-label={`Tiến độ bài: Chương 0/${nodes.length} · Tổng quan`}
                  aria-valuenow={0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <i {...s} style={{ width: "0%" }} />
                </div>
              </div>
              <div {...bar} className="nbl-tools">
                <button
                  {...s}
                  type="button"
                  className="nbc-btn is-soft is-sm is-ph-ico gr-docbtn"
                  aria-label="Xem lại tài liệu"
                  aria-haspopup="dialog"
                  aria-expanded={documentOpen}
                  onClick={() => setDocumentOpen(true)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 0 0 0-3-3z" />
                  </svg>
                  <span>Xem lại tài liệu</span>
                </button>
                <button
                  {...bar}
                  type="button"
                  className="nb-btn nb-btn-soft nb-btn-icon nbl-ib nbl-ph-hide nbl-fs"
                  aria-label={
                    fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"
                  }
                  aria-pressed={fullscreen}
                  onClick={() => {
                    setFullError("");
                    void (
                      document.fullscreenElement
                        ? document.exitFullscreen()
                        : document.documentElement.requestFullscreen()
                    ).catch(() => {
                      if (mounted.current)
                        setFullError(
                          "Không thể mở toàn màn hình trong cửa sổ này.",
                        );
                    });
                  }}
                >
                  <Icon kind="expand" size={16} />
                </button>
              </div>
            </header>
            <div {...s} className="gr-grid">
              <aside
                {...s}
                className="gr-aside nbc-lv1 is-s-kraft npc-ol"
                data-testid="runner-aside"
              >
                <section {...outlineScope} className="gr-outline min-w-0">
                  <div {...outlineScope} className="gr-head">
                    <p {...outlineScope} className="npc-oh">
                      <span>Bài A→Z</span>
                      <b>0%</b>
                    </p>
                    <div
                      {...outlineScope}
                      className="nbc-bar"
                      role="progressbar"
                      aria-label="Tiến độ"
                      aria-valuenow={0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <i style={{ width: "0%" }} />
                    </div>
                  </div>
                  <ol {...outlineScope} className="gr-ol">
                    {rows.map((row, i) => (
                      <li
                        key={i}
                        {...outlineScope}
                        className={`gr-li min-w-0 ${row.sub ? "is-l1" : "is-l0"}`}
                        data-state={row.current ? "current" : "todo"}
                        aria-current={row.current ? "step" : undefined}
                      >
                        <div
                          {...outlineScope}
                          className={`nbc-lv3 npc-orow ${row.current ? "is-cur" : "is-w is-todo"}${row.sub ? " is-l1" : ""}`}
                          title={row.title}
                        >
                          <span
                            {...outlineScope}
                            className={`npc-mk${row.current ? " is-cur" : ""}`}
                            aria-hidden="true"
                          />
                          <span {...outlineScope} className="min-w-0">
                            <small {...outlineScope}>{row.label}</small>
                            <b
                              {...outlineScope}
                              className={`gr-clamp${row.current ? " is-open" : ""}`}
                            >
                              {row.title}
                            </b>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </aside>
              <div {...s} className="gr-main" data-testid="runner-main">
                <nav {...s} className="gr-pills" aria-label="Các chặng của bài">
                  <span {...s} className="nbc-chip gr-pill animate-chip is-ink">
                    Tổng quan
                  </span>
                  <button
                    {...s}
                    type="button"
                    className="nbc-chip gr-pill animate-chip is-todo"
                    aria-haspopup="dialog" aria-expanded={toc} onClick={() => setToc(true)}
                  >
                    Chương 1/{nodes.length}
                  </button>
                  {rows.filter(row=>row.sub).map((row,i)=><span key={i} {...s} className="nbc-chip gr-pill animate-chip is-todo">{row.label}</span>)}
                </nav>
                <div {...s} className="nbc-pile gr-stage">
                  <span
                    {...s}
                    className="nbc-under gr-under"
                    aria-hidden="true"
                  />
                  <section
                    {...s}
                    className="gr-card nbc-lv1 npc-card"
                    data-testid="runner-card"
                  >
                    <div className="step-swap relative min-w-0 is-fwd flex flex-1 flex-col">
                      <div className="min-w-0" data-step-swap="">
                        <div
                          {...teach}
                          className="text-left flex flex-1 flex-col"
                          data-testid="teach-card"
                        >
                          <div {...teach} className="gr-pad">
                            <span {...teach} className="gr-kick">
                              Tổng quan
                            </span>
                            <h2
                              {...teach}
                              className="mt-3 text-balance font-display text-xl font-extrabold leading-tight text-fg sm:text-2xl lg:text-3xl"
                              data-testid="teach-title"
                            >
                              {topic.title}
                            </h2>
                            <div
                              {...teach}
                              className="text-fg text-base leading-relaxed lg:text-lg mt-3"
                              data-testid="teach-body"
                            >
                              <p>
                                {sample?.body ??
                                  existing?.intro ??
                                  topic.titleEn}
                              </p>
                            </div>
                            {!!examples.length && (
                              <>
                                <p
                                  {...teach}
                                  className="mt-6 text-sm font-extrabold text-fg-muted"
                                >
                                  Ví dụ
                                </p>
                                <ul
                                  {...teach}
                                  className="divide-y divide-border mt-1"
                                >
                                  {examples.map((example, i) => (
                                    <li
                                      key={i}
                                      {...teach}
                                      className="flex items-start gap-3 py-3"
                                    >
                                      <button
                                        {...teach}
                                        type="button"
                                        className="gr-spk shadow-sh-1 lift press"
                                        aria-label={`Nghe: ${example.en}`}
                                        onClick={() => speak(example.en)}
                                      >
                                        <Icon kind="speaker" />
                                      </button>
                                      <div
                                        {...teach}
                                        className="min-w-0 text-left flex-1 pt-1.5"
                                        data-testid="en-vi"
                                      >
                                          <div className="font-semibold leading-snug text-base lg:text-lg text-fg" data-testid="en-vi-en">
                                          <GrammarWordTap text={example.en} focus={Array.isArray(example.focus)?example.focus:example.focus?.split(/\s+/)} highlightClass="text-primary"/>
                                        </div>
                                          <p className="mt-0.5 text-fg-muted text-sm lg:text-base" data-testid="en-vi-vi">
                                          {example.vi}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                          <div {...teach} className="gr-actions">
                            <div {...teach} className="gr-nav">
                              <Link
                                href={nextHref}
                                className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium btn-ink bg-primary border-edge-primary text-primary-fg oc-fixed h-12 px-6 text-md"
                                data-testid="btn-next"
                              >
                                Tiếp tục
                                <span className="hidden lg:inline"> ↵</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={fullError ? undefined : "sr-only"}
        >
          {fullError}
        </p>
        {documentOpen && (
          <UiDialog
            title={`Tài liệu · ${topic.title}`}
            className="ui-grammar-doc-modal"
            sourceStyle
            onClose={() => setDocumentOpen(false)}
          >
            <div className="ui-grammar-doc-body"><div {...s} className="gr-doc-scroll -mx-1 px-1" data-testid="doc-popup-body"><GrammarDocumentBody slug={slug} embedded /></div></div>
          </UiDialog>
        )}
        {menu && (
          <LessonNavigationDrawer active="/ngu-phap" onClose={() => setMenu(false)} />
        )}
        {toc && (
          <UiDialog title="Mục lục" sourceStyle className="ui-grammar-toc-modal" onClose={() => setToc(false)}>
            <div className="ui-grammar-toc-body"><ol {...s} className="grid gap-3" data-testid="toc-list">
              {tocRows.map((chapter,i)=><li key={i} {...s}  data-testid={`toc-chapter-${i}`} data-state={i === 0 ? "current" : "todo"}>
                <p {...s} className={`flex items-center gap-2 text-sm font-semibold ${i === 0 ? "text-primary" : "text-fg-muted"}`}>
                  <span className={`ui-toc-mark${i === 0 ? " is-current" : ""}`} aria-hidden="true"/><span className="min-w-0">{chapter.title}</span>
                </p>
                {!!chapter.items.length && <ol {...s} className="ml-6 mt-1 grid gap-1">{chapter.items.map((item,j)=><li key={j} data-state="todo"><p {...s} className="flex min-h-10 items-center gap-2 px-2 text-sm text-fg-muted"><span className="ui-toc-mark is-small" aria-hidden="true"/>{item}</p></li>)}</ol>}
              </li>)}
            </ol></div>
            <div className="ui-grammar-toc-foot"><button className="btn-ink bg-primary border-edge-primary text-primary-fg oc-fixed ctl-md h-10 px-4" data-testid="toc-close" onClick={()=>setToc(false)}>Đóng</button></div>
          </UiDialog>
        )}
      </main>
    </>
  );
}
