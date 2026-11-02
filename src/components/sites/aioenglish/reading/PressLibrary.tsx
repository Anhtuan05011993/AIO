"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import papers from "@/lib/ui-fixtures/press-papers.json";
import paperTopics from "@/lib/ui-fixtures/press-paper-topics.json";
import topicArt from "@/lib/ui-fixtures/press-topic-art.json";
import VocabPopover from "../vocab/VocabPopover";
import ReadingCreateDialog from "./ReadingCreateDialog";
import UiDialog from "../app/UiDialog";
import "@/styles/custom/press-reference.css";
import "@/styles/custom/press-parity.css";
const s = { "data-v-1f8a33ba": "" },
  c = { "data-v-99761fb4": "" },
  t = { "data-v-fde13450": "" },
  searchScope = { "data-v-373ef635": "" };
const slugify = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const Icon = ({ kind = "arrow" }: { kind?: string }) => (
  <svg
    className="nbx-ic"
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
    <path
      d={
        kind === "search"
          ? "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0"
          : kind === "filter"
            ? "M4 5h16l-6 7v6l-4 2v-8z"
            : kind === "link"
              ? "M12 5v14M5 12h14"
              : kind === "down"
                ? "m6 9 6 6 6-6"
              : kind === "back"
                ? "m12 19-7-7 7-7m-7 7h14"
                : kind === "left"
                  ? "m15 5-7 7 7 7"
                : "m9 5 7 7-7 7"
      }
    />
  </svg>
);
export default function PressLibrary({
  paper,
  initialQuery = "",
  initialTopic = "",
  initialPage = 1,
}: {
  paper: keyof typeof papers;
  initialQuery?: string;
  initialTopic?: string;
  initialPage?: number;
}) {
  const data = papers[paper];
  const topics = paperTopics[paper];
  const [query, setQuery] = useState(initialQuery),
    [topic, setTopic] = useState(initialTopic),
    [page, setPage] = useState(initialPage);
  const [filter, setFilter] = useState<HTMLElement | null>(null),
    [create, setCreate] = useState(false),
    [notice, setNotice] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const historyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHistory = useRef<string | null>(null);
  const entries = [
    { ...data.hero, class: "", author: data.hero.author ?? "" },
    ...data.cards,
  ];
  const filtered = entries.filter(
    (a) =>
      (!topic || slugify(a.topic ?? "") === topic) &&
      (!query.trim() ||
        [a.title, a.vi, a.author]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(query.trim().toLocaleLowerCase("vi"))),
  );
  const last =
    query.trim() || topic
      ? Math.max(1, Math.ceil(filtered.length / 13))
      : paper === "the-atlantic"
        ? 19
        : 27;
  const current = Math.max(1, Math.min(page, last));
  const hero = filtered[0];
  const cards = filtered.slice(1);
  function href(next = current, q = query, cat = topic) {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cat) p.set("topic", cat);
    if (next > 1) p.set("page", String(next));
    return `/luyen-dich-thuat/bao/${paper}${p.size ? "?" + p.toString() : ""}`;
  }
  function update(q: string, cat: string, next = 1, push = false) {
    setQuery(q);
    setTopic(cat);
    setPage(next);
    if (historyTimer.current) clearTimeout(historyTimer.current);
    if (push && pendingHistory.current) window.history.replaceState(null, "", pendingHistory.current);
    pendingHistory.current = null;
    const url = href(next, q, cat) + window.location.hash;
    if (push) window.history.pushState(null, "", url);
    else {
      pendingHistory.current = url;
      historyTimer.current = setTimeout(() => { window.history.replaceState(null, "", url); pendingHistory.current = null; historyTimer.current = null; }, 250);
    }
  }
  useEffect(() => {
    const sync = () => {
      if (historyTimer.current) clearTimeout(historyTimer.current);
      pendingHistory.current = null;
      const p = new URLSearchParams(window.location.search);
      setQuery(p.get("q") ?? "");
      setTopic(p.get("topic") ?? "");
      setPage(Math.max(1, Number(p.get("page")) || 1));
      setFilter(null);
    };
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("popstate", sync); if (historyTimer.current) clearTimeout(historyTimer.current); };
  }, []);
  function openLesson(e: MouseEvent<HTMLAnchorElement>) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setNotice(true);
  }
  const articleHref = (id: string | undefined) =>
    `/luyen-dich-thuat/bao/${paper}/${id}`;
  const image = (id: string | undefined) =>
    `/assets/aioenglish/press/${id}.jpg`;
  const pager = (n: number, label: string | number = n) => (
    <Link key={String(label)} {...s}
      
      href={href(n)}
      aria-current={n === current ? "page" : undefined}
      className={`nbc-btn is-sm pp-num ${n === current ? "is-ink" : "is-soft"}`}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        update(query, topic, n, true);
        document
          .querySelector("main")
          ?.scrollTo({ top: 0, behavior: "instant" });
      }}
    >
      {label === "Trước" && <Icon kind="left"/>}{label}{label === "Tiếp" && <Icon/>}
    </Link>
  );
  const firstNumber = Math.max(1, Math.min(current - 2, last - 4));
  const lastNumber = Math.min(last, firstNumber + 4);
  return (
    <>
      <div
        {...s}
        className="nb-skin pp-root ui-press-library"
        data-nb-accent="bacha"
      >
        <div {...s} className="nbc-page">
          <header
            {...s}
            className="nbc-hd nbx-f-read"
            data-nb-feature="read"
            data-nb-header=""
            data-testid="press-paper-masthead"
            data-bm="hdr"
          >
            <span
              aria-hidden="true"
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: data.decoration ?? "" }}
            />
            <div className="nbc-hd-row is-top">
              <div className="nbc-hd-head">
                <div className="nbc-hd-tt">
                  <Link
                    href="/luyen-dich-thuat"
                    className="nbc-back"
                    aria-label="Quay lại Luyện đọc & dịch"
                    data-nb-back=""
                  >
                    <Icon kind="back" />
                    <span className="nbc-hd-wide">Luyện đọc &amp; dịch</span>
                    <span className="nbc-hd-narrow">Đọc &amp; dịch</span>
                  </Link>
                  <h1>
                    <span {...s} className="font-news pp-h1">
                      {data.title}
                    </span>
                  </h1>
                  <div className="nbc-hd-chips">
                    <span {...s} className="nbc-chip">
                      Báo song ngữ
                    </span>
                  </div>
                </div>
              </div>
              <div className="nbc-hd-cta">
                <button
                  {...s}
                  type="button"
                  className="nbc-btn is-ink"
                  data-testid="press-import-open"
                  onClick={() => setCreate(true)}
                >
                  <Icon kind="link" />
                  <span className="nbc-hd-wide">Thêm bài viết bằng link</span>
                  <span className="nbc-hd-narrow">Thêm từ link</span>
                </button>
              </div>
            </div>
            <div className="nbc-hd-tools">
              <div {...s} className="pp-filter" data-testid="press-filter-row">
                <div
                  {...searchScope}
                  {...s}
                  className="search-box relative min-w-0 flex-1 md:w-64 md:flex-none"
                  data-search-grow=""
                  data-active={query ? "1" : "0"}
                >
                  <span
                    {...searchScope}
                    className="vsb-ic pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-fg-subtle"
                  >
                    <Icon kind="search" />
                  </span>
                  {!query && (
                    <span
                      {...searchScope}
                      className="vsb-ph pointer-events-none absolute inset-y-0 left-9 right-0 flex items-center overflow-hidden text-sm text-fg-subtle"
                      aria-hidden="true"
                    >
                      <span {...searchScope} className="ph-short truncate">
                        Tìm…
                      </span>
                      <span {...searchScope} className="ph-long truncate">
                        Tìm bài báo, tác giả…
                      </span>
                    </span>
                  )}
                  <input
                    ref={input}
                    {...searchScope}
                    type="search"
                    data-testid="press-search"
                    aria-label="Tìm bài báo"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-10 w-full min-w-0 rounded-pill border-bw border-border-strong bg-surface pl-9 pr-8 text-sm font-semibold text-fg shadow-sh-1 outline-none placeholder:text-fg-subtle focus:ring-2 focus:ring-primary-ring"
                    value={query}
                    onChange={(e) => update(e.target.value, topic)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && query) {
                        e.preventDefault();
                        update("", topic);
                      }
                    }}
                  />
                </div>
                <span className="inline-flex shrink-0">
                  <button
                    {...t}
                    type="button"
                    data-testid="press-topic-trigger"
                    aria-expanded={!!filter}
                    aria-haspopup="dialog"
                    aria-pressed={!!topic}
                    className="nbc-btn is-soft is-sm pt-trig relative inline-flex min-h-10 shrink-0 items-center max-md:w-10 max-md:justify-center max-md:px-0"
                    aria-label={`Bộ lọc chủ đề: ${topics.find((x) => slugify(x.label ?? "") === topic)?.label ?? "Tất cả"}`}
                    onClick={(e) => setFilter(filter ? null : e.currentTarget)}
                  >
                    <Icon kind="filter" />
                    <span {...t} className="pt-lbl hidden md:inline">
                      Chủ đề:{" "}
                      {topics.find((x) => slugify(x.label ?? "") === topic)
                        ?.label ?? "Tất cả"}
                    </span>
                    <span className="hidden md:inline-flex" aria-hidden="true"><Icon kind="down"/></span>
                  </button>
                </span>
              </div>
            </div>
          </header>
          <div className="min-w-0">
            <p className="sr-only" role="status">{query.trim() || topic ? `${filtered.length} kết quả` : ""}</p>
            <div {...s} className="pp-body">
              {hero ? (
                <>
                  <a
                    {...s}
                    href={articleHref(hero.id)}
                    onClick={openLesson}
                    className="nbc-pile pp-hero-pile group"
                    data-testid="press-hero"
                    data-bm="hero"
                  >
                    <span
                      {...s}
                      className="nbc-under pp-under"
                      aria-hidden="true"
                    />
                    <span
                      {...s}
                      className="nbc-tape pp-tape-l"
                      aria-hidden="true"
                      style={{ "--nb-tape-r": "-3deg" } as React.CSSProperties}
                    />
                    <span
                      {...s}
                      className="nbc-tape is-cor pp-tape-r"
                      aria-hidden="true"
                      style={{ "--nb-tape-r": "4deg" } as React.CSSProperties}
                    />
                    <div {...s} className="nbc-lv1 pp-hero">
                      <div {...s} data-fx="zoom" className="pp-media">
                        <img
                          {...s}
                          src={image(hero.id)}
                        alt=""
                          className="pp-img"
                        />
                      </div>
                      <div {...s} className="pr-hero-text">
                        <span {...s} className="nbc-chip pp-topic">
                          {hero.topic}
                        </span>
                        <h2 {...s} className="pr-hero-h font-news" lang="en">
                          {hero.title}
                        </h2>
                        <p {...s} className="pr-hero-vi font-news" lang="vi">
                          {hero.vi}
                        </p>
                        <p {...s} className="pr-hero-meta">
                          <span {...s}>
                            {hero.author?.replace(/^Bởi /, "")}
                          </span>
                          <span {...s}>{hero.minutes}</span>
                        </p>
                      </div>
                    </div>
                  </a>
                  <div
                    {...s}
                    className="pp-grid"
                    data-testid="press-list"
                    data-bm="grid"
                  >
                    {cards.map((a, i) => (
                      <a key={a.id} {...c}
                        {...s}
                        
                        href={articleHref(a.id)}
                        onClick={openLesson}
                        className="pac-link group is-link"
                      >
                        <article
                          {...c}
                          className={`pac nbc-lv1 is-sheet${i % 2 === 0 ? " is-s-kraft" : ""}`}
                          data-testid="press-card"
                        >
                          <div {...c} data-fx="zoom" className="pac-media">
                            <img
                              {...c}
                              src={image(a.id)}
                              alt=""
                              loading="lazy"
                              className="pac-img"
                            />
                          </div>
                          <div {...c} className="pac-body">
                            <p {...c} className="pac-topic">
                              {a.topic}
                            </p>
                            <h3 {...c} className="pac-h font-news">
                              {a.title}
                            </h3>
                            <p {...c} className="pac-vi font-news" lang="vi">
                              {a.vi}
                            </p>
                            <div {...c} className="pac-foot">
                              <span {...c} className="pac-by">
                                {a.author}
                              </span>
                              <span {...c} className="pac-min">
                                {a.minutes}
                              </span>
                            </div>
                          </div>
                        </article>
                      </a>
                    ))}
                  </div>
                  <nav
                    {...s}
                    className="pp-pager"
                    aria-label="Phân trang"
                    data-testid="press-pager"
                    data-bm="pager"
                  >
                    {current > 1 ? (
                      pager(current - 1, "Trước")
                    ) : (
                      <button type="button" disabled
                        {...s}
                        className="nbc-btn is-soft is-sm pp-off"
                      >
                        <Icon kind="left"/>Trước
                      </button>
                    )}
                    {firstNumber>1&&<>{pager(1)}{firstNumber>2&&<span className="pp-dots">…</span>}</>}
                    {Array.from({ length: lastNumber-firstNumber+1 }, (_, i) =>
                      pager(i + firstNumber),
                    )}
                    {lastNumber < last && (
                      <>
                        {lastNumber<last-1&&<span {...s} className="pp-dots">…</span>}
                        {pager(last)}
                      </>
                    )}
                    {current < last ? (
                      pager(current + 1, "Tiếp")
                    ) : (
                      <button type="button" disabled
                        {...s}
                        className="nbc-btn is-soft is-sm pp-off"
                      >
                        Tiếp<Icon/>
                      </button>
                    )}
                  </nav>
                </>
              ) : (
                <div className="hnst" data-hub-state="empty" role="status">
                  <p className="hnst-t">Không tìm thấy bài báo</p>
                  <p className="hnst-p">Thử từ khoá hoặc chủ đề khác.</p>
                  <button
                    type="button"
                    className="nbc-btn"
                    onClick={() => {
                      update("", "");
                      input.current?.focus();
                    }}
                  >
                    Xoá bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {filter && (
        <VocabPopover
          anchor={filter}
          title="Chọn chủ đề bài báo"
          width={480}
          gap={12}
          accent="bacha"
          className="ui-press-pop"
          onClose={() => setFilter(null)}
        >
          <div {...t} className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <p className="text-2xs font-semibold uppercase leading-5 tracking-[0.08em] text-fg-muted">
                Chủ đề
              </p>
              <button
                type="button"
                disabled={!topic}
                className="tap-40 rounded-lg px-2 py-1 text-xs font-medium"
                onClick={() => update(query, "", 1, true)}
              >
                Đặt lại
              </button>
            </div>
            <div
              {...t}
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Thể loại"
            >
              {topics.map((x, i) => (
                <button key={x.label} {...t}
                  
                  type="button"
                  disabled={!x.count}
                  aria-pressed={topic === slugify(x.label ?? "")}
                  className={`pt-chip dis-ink inline-flex min-h-10 items-center gap-1.5 px-3 text-sm${topic === slugify(x.label ?? "") ? " pt-chip-on" : ""}`}
                  onClick={() =>
                    update(
                      query,
                      topic === slugify(x.label ?? "")
                        ? ""
                        : slugify(x.label ?? ""),
                      1, true,
                    )
                  }
                >
                  <span
                    aria-hidden="true"
                    style={{ display: "contents" }}
                    dangerouslySetInnerHTML={{
                      __html: Object.values(topicArt)[i] ?? "",
                    }}
                  />
                  <span>{x.label}</span>
                  <span className="opacity-70">{x.count}</span>
                </button>
              ))}
            </div>
          </div>
        </VocabPopover>
      )}
      {create && (
        <ReadingCreateDialog kind="press" onClose={() => setCreate(false)} />
      )}
      {notice && (
        <UiDialog
          title="Đọc & dịch báo song ngữ"
          onClose={() => setNotice(false)}
        >
          <p>Nội dung chưa được bổ sung.</p>
        </UiDialog>
      )}
    </>
  );
}
