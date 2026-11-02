"use client";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { searchDictionary, levelChipClass } from "@/lib/demo-data/dictionary";
import samples from "@/lib/ui-fixtures/dictionary-samples.json";
import artwork from "@/lib/ui-fixtures/dictionary-art.json";
import { speak } from "../lesson/speech";
import UiDialog from "../app/UiDialog";
import DictionaryTranslation from "./DictionaryTranslation";
import "@/styles/custom/dictionary-reference.css";
import "@/styles/custom/dictionary-parity.css";
const rootScope = { "data-v-fd13aa08": "" },
  s = { "data-v-3cc8a693": "" },
  pron = { "data-v-8cc1a309": "" },
  findScope = { "data-v-c9f559e9": "" };
type Sample = {
  word: string;
  level: string;
  meaning: string;
  synopsis: string;
  example: string;
  exampleVi: string;
  note: string;
  ipa: string;
  groups: {
    pos: string;
    gist: string;
    senses: {
      meaning: string;
      definition: string;
      example: string;
      exampleVi: string;
    }[];
  }[];
  sections: Record<string, { word: string; meaning: string; pos: string }[]>;
};
const posNames: Record<string, string> = {
  noun: "Danh từ",
  verb: "Động từ",
  adjective: "Tính từ",
  adverb: "Trạng từ",
  conjunction: "Liên từ",
  preposition: "Giới từ",
  pronoun: "Đại từ",
  determiner: "Từ hạn định",
  interjection: "Thán từ",
};
const art = (html: string | undefined) => (
  <span
    aria-hidden="true"
    style={{ display: "contents" }}
    dangerouslySetInnerHTML={{ __html: html ?? "" }}
  />
);
function Icon({ kind = "arrow", size = 18, className }: { kind?: string; size?: number; className?: string }) {
  return (
    <svg
      {...(className === "td-cta-arr" ? rootScope : {})}
      className={className}
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
          kind === "speaker"
            ? "M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"
            : kind === "save"
              ? "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
              : kind === "close"
                ? "m6 6 12 12M6 18 18 6"
                : kind === "search"
                  ? "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0"
                  : kind === "back"
                    ? "m12 19-7-7 7-7m-7 7h14"
                    : kind === "down"
                      ? "m6 9 6 6 6-6"
                      : kind === "up"
                        ? "m6 15 6-6 6 6"
                        : kind === "chevron"
                          ? "m9 5 7 7-7 7"
                          : "M5 12h14m-6-6 6 6-6 6"
        }
      />
    </svg>
  );
}
function resolveWord(query: string): Sample | null {
  const key = query.trim().toLowerCase();
  if ((samples as Record<string, Sample>)[key])
    return (samples as Record<string, Sample>)[key];
  const entries = searchDictionary(key, 30).items.filter(
    (e) => e.word.toLowerCase() === key,
  );
  if (!entries.length) return null;
  const first = entries[0];
  const groups = Object.entries(Object.groupBy(entries, (e) => e.pos)).map(
    ([pos, items]) => ({
      pos: posNames[pos] ?? pos,
      gist: items?.[0]?.vi ?? first.word,
      senses: (items ?? []).map((e) => ({
        meaning: e.vi ?? e.word,
        definition: e.def ?? "",
        example: e.example ?? "",
        exampleVi: e.exampleVi ?? "",
      })),
    }),
  );
  return {
    word: first.word,
    level: first.level ?? "",
    meaning: first.vi ?? first.word,
    synopsis: first.def ?? "",
    example: first.example ?? "",
    exampleVi: first.exampleVi ?? "",
    note: "",
    ipa: first.ipa ?? "",
    groups,
    sections: {},
  };
}
function Example({
  text,
  vi,
  word,
}: {
  text: string;
  vi: string;
  word: string;
}) {
  const index = text.toLowerCase().indexOf(word.toLowerCase());
  return text || vi ? (
    <div {...s} className="den-ex">
      <p {...s} className="den-ex-en" lang="en">
        {index < 0 ? (
          text
        ) : (
          <>
            {text.slice(0, index)}
            <u {...s}>{text.slice(index, index + word.length)}</u>
            {text.slice(index + word.length)}
          </>
        )}
      </p>
      {vi && (
        <p {...s} className="den-ex-vi">
          {vi}
        </p>
      )}
    </div>
  ) : null;
}
function Entry({
  entry,
  onPick,
  onSave,
}: {
  entry: Sample;
  onPick: (word: string) => void;
  onSave: () => void;
}) {
  const [closed, setClosed] = useState<string[]>([]);
  const id = useId();
  const jump = (e: MouseEvent<HTMLAnchorElement>, word: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onPick(word);
  };
  const sections = entry.sections;
  const layout = useRef<HTMLDivElement>(null);
  const [synAt, setSynAt] = useState("band");
  useLayoutEffect(() => {
    const root = layout.current;
    if (!root || !sections.synant?.length) return;
    const left = root.querySelector<HTMLElement>(".den-pl");
    const right = root.querySelector<HTMLElement>(".den-pr");
    if (!left || !right) return;
    const measure = () => {
      const columns = getComputedStyle(root)
        .gridTemplateColumns.trim()
        .split(/\s+/);
      const difference =
        right.getBoundingClientRect().height -
        left.getBoundingClientRect().height;
      setSynAt(
        columns.length < 2
          ? "band"
          : difference > 32
            ? "main"
            : difference < -32
              ? "side"
              : "band",
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(left);
    observer.observe(right);
    measure();
    return () => observer.disconnect();
  }, [entry.word, sections]);
  return (
    <div {...s} {...rootScope} className="den-c" data-dict-entry-nb="">
      <div ref={layout} {...s} className="den is-hub" data-syn-at={synAt}>
        <div
          {...s}
          className="den-pl nbx-blk nbx-r-ivory nbx-ruled nbx-pile"
          data-bm="lp"
        >
          <i {...s} className="nbx-tape nbx-k" aria-hidden="true" />
          <div {...s} className="den-head" data-dict-head-rows="">
            <div {...s} className="den-meta">
              <div {...s} className="den-pos scrollbar-hide" data-dict-pos="">
                {entry.level && (
                  <span {...s} className={levelChipClass(entry.level)}>
                    {entry.level}
                  </span>
                )}
                {entry.groups.map((g) => (
                  <span key={g.pos} {...s}
                    
                    className="nbx-chip nbx-plain"
                    data-testid="pos-badge"
                  >
                    {g.pos}
                  </span>
                ))}
              </div>
              <div {...s} className="den-tools">
                <button
                  {...s}
                  type="button"
                  className="nbc-btn is-sm is-ico is-soft"
                  aria-label="Lưu vào danh sách từ"
                  data-dict-save=""
                  onClick={onSave}
                >
                  <Icon kind="save" />
                </button>
              </div>
            </div>
            <h2 {...s} className="den-word" lang="en" data-dict-headword="">
              <span {...s} className="den-word-t">
                {entry.word}
              </span>
            </h2>
          </div>
          <div {...s} className="den-pron" data-dict-pron="">
            <div {...pron} {...s} className="nbc-lv3 dipn" data-ipa-rows="">
              {(["uk", "us"] as const).map((accent, index) => (
                <div key={accent} {...pron}
                  
                  className={`dipn-row${index === 0 ? " is-main" : ""}`}
                  role="group"
                  aria-label={`Phiên âm ${index ? "Anh-Mỹ" : "Anh-Anh"} ${entry.ipa}`}
                  data-ipa-row={accent}
                >
                  <span
                    {...pron}
                    className={`dipn-tag ${index ? "nbc-chip" : "is-ink"}`}
                    aria-hidden="true"
                  >
                    {accent.toUpperCase()}
                  </span>
                  <span {...pron} className="dipn-text" aria-hidden="true">
                    <span
                      {...pron}
                      className="font-ipa ipa-tone"
                      data-ipa=""
                      data-ipa-text=""
                    >
                      {entry.ipa || "—"}
                    </span>
                  </span>
                  <button
                    {...pron}
                    type="button"
                    className={`nbc-btn is-sm is-ico dipn-spk ${index ? "is-soft" : "is-ink"}`}
                    aria-label={`Nghe giọng ${index ? "Anh-Mỹ" : "Anh-Anh"}`}
                    data-ipa-speak={accent}
                    onClick={() => speak(entry.word, index ? "en-US" : "en-GB")}
                  >
                    <Icon kind="speaker" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div {...s} className="den-main" data-dict-primary="">
            <p {...s} className="den-cap">
              Nghĩa hay dùng nhất
            </p>
            <h3 {...s} className="den-main-t">
              {entry.meaning}
            </h3>
            {entry.synopsis && (
              <p {...s} className="den-main-o">
                {entry.synopsis}
              </p>
            )}
            <Example
              word={entry.word}
              text={entry.example}
              vi={entry.exampleVi}
            />
          </div>
          <div {...s} className="den-grps">
            {entry.groups.map((g, index) => {
              const open = !closed.includes(g.pos);
              return (
                <section key={g.pos} {...s}
                  
                  className={`nbc-lv3 is-w den-grp${open ? " is-open" : ""}`}
                >
                  <button
                    {...s}
                    type="button"
                    className="den-grp-h"
                    aria-expanded={open}
                    aria-controls={`${id}-${index}`}
                    data-dict-pos-head=""
                    onClick={() =>
                      setClosed(
                        open
                          ? [...closed, g.pos]
                          : closed.filter((x) => x !== g.pos),
                      )
                    }
                  >
                    <span {...s} className="nbc-chip is-sm">
                      {g.pos}
                    </span>
                    <span {...s} className="den-grp-n">
                      {g.senses.length} nghĩa
                    </span>
                    <span {...s} className="den-grp-pv" data-dict-pos-gist="">
                      {g.gist}
                    </span>
                    <Icon kind={open ? "up" : "down"} />
                  </button>
                  <div
                    {...s}
                    id={`${id}-${index}`}
                    className="den-fold"
                    inert={!open || undefined}
                    aria-hidden={!open}
                  >
                    <div {...s} className="den-fold-in">
                      <ol {...s} className="den-senses">
                        {g.senses.map((sense, i) => (
                          <li key={i} {...s}  className="den-sense">
                            <span {...s} className="den-sn" aria-hidden="true">
                              {i + 1}
                            </span>
                            <div {...s} className="den-sense-b">
                              <h4 {...s} className="den-sense-t">
                                <span {...s}>{sense.meaning}</span>
                              </h4>
                              {sense.definition && (
                                <p {...s} className="den-gloss" lang="en">
                                  {sense.definition}
                                </p>
                              )}
                              <Example
                                word={entry.word}
                                text={sense.example}
                                vi={sense.exampleVi}
                              />
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
          {entry.note && (
            <p {...s} className="nbc-lv3 den-usage">
              <b {...s}>Ghi chú</b>
              <span {...s}>{entry.note}</span>
            </p>
          )}
        </div>
        {sections.collocations?.length || sections.wordFamily?.length ? (
          <div {...s} className="den-pr" data-bm="rp">
            {["collocations", "wordFamily"].map((key, index) =>
              sections[key]?.length ? (
                <section key={key} {...s}
                  
                  className={`den-box nbx-blk ${index ? "nbx-r-ref nbx-fibre" : "nbx-r-info nbx-grid"}`}
                  data-dict-section={key}
                  data-bm={index ? "fam" : "col"}
                >
                  <div {...s} className="nbx-bh">
                    {art(artwork[key as keyof typeof artwork])}
                    <h2 {...s}>{index ? "Họ từ." : "Cụm từ kết hợp."}</h2>
                  </div>
                  <div {...s} className="den-list">
                    <div {...s} className={index ? "den-fam" : "den-cols"}>
                      {sections[key].map((row) => (
                        <Link key={row.word} {...s}
                          
                          href={`/tu-dien?q=${encodeURIComponent(row.word)}`}
                          className={
                            index ? "den-fam-i nbx-row" : "den-col nbx-row"
                          }
                          onClick={(e) => jump(e, row.word)}
                        >
                          {index ? (
                            <>
                              <b {...s} lang="en">
                                {row.word}
                              </b>
                              <span
                                {...s}
                                className="den-fam-pos nbx-chip nbx-plain"
                              >
                                {row.pos}
                              </span>
                              <small {...s}>{row.meaning}</small>
                            </>
                          ) : (
                            <>
                              <span {...s} className="den-col-t">
                                <b {...s} lang="en">
                                  {row.word}
                                </b>
                                <small {...s}>{row.meaning}</small>
                              </span>
                              <Icon kind="chevron" />
                            </>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null,
            )}
          </div>
        ) : null}
        {sections.synant?.length ? (
          <div {...s} className="den-hs">
            <section
              {...s}
              className="den-box nbx-blk nbx-r-ok nbx-ruled nbx-synb"
              data-dict-section="synant"
              data-bm="syn"
            >
              <div {...s} className="nbx-bh">
                {art(artwork.synant)}
                <h2 {...s}>Đồng nghĩa &amp; Trái nghĩa.</h2>
              </div>
              <div {...s} className="den-syns">
                <div {...s} className="den-syn-g">
                  <p {...s} className="den-cap">
                    Đồng nghĩa
                  </p>
                  <div {...s} className="den-syn-l">
                    {sections.synant.map((row) => (
                      <Link key={row.word} {...s}
                        
                        href={`/tu-dien?q=${encodeURIComponent(row.word)}`}
                        className="den-syn nbx-chip nbx-plain"
                        onClick={(e) => jump(e, row.word)}
                      >
                        <b {...s} lang="en">
                          {row.word}
                        </b>
                        <small {...s}>{row.meaning}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default function DictionaryHub({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery),
    [selected, setSelected] = useState(initialQuery),
    [debounced, setDebounced] = useState(initialQuery),
    [suggest, setSuggest] = useState(false),
    [active, setActive] = useState(-1);
  const [save, setSave] = useState(false),
    [saveStatus, setSaveStatus] = useState("");
  const input = useRef<HTMLInputElement>(null),
    form = useRef<HTMLFormElement>(null);
  const listId = useId();
  const composing = useRef(false);
  const result = useMemo(
    () => resolveWord(selected || "adrenaline"),
    [selected],
  );
  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    return searchDictionary(debounced, 30)
      .items.filter((item) => {
        const key = item.word.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }, [debounced]);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const sync = () => {
      const value = (new URLSearchParams(window.location.search).get("q") ?? "")
        .trim()
        .slice(0, 400);
      setSelected(value);
      setQuery(value);
      setSuggest(false);
      setActive(-1);
      setSave(false);
      setSaveStatus("");
    };
    const outside = (e: PointerEvent) => {
      if (!form.current?.contains(e.target as Node)) setSuggest(false);
    };
    window.addEventListener("popstate", sync);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("popstate", sync);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  function pick(word: string) {
    const value = word.trim().slice(0, 400);
    setSelected(value);
    setQuery(value);
    setSuggest(false);
    setActive(-1);
    setSave(false);
    setSaveStatus("");
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    const next = url.pathname + url.search + url.hash;
    if (
      next !==
      window.location.pathname + window.location.search + window.location.hash
    )
      window.history.pushState(null, "", next);
    input.current?.closest("main")?.scrollTo({ top: 0, behavior: "instant" });
    input.current?.focus({ preventScroll: true });
  }
  const show =
    suggest && query === debounced && !!query.trim() && suggestions.length > 0;
  return (
    <>
      <div
        {...rootScope}
        className="nb-skin nbx-main nbx-hc td ui-dictionary-hub"
        data-testid="tu-dien-hub"
        data-nb-accent="kraft"
      >
        <p className="sr-only" role="status">
          {show ? `${suggestions.length} gợi ý` : ""}
        </p>
        <header
          {...rootScope}
          className={`nbc-hd nbx-f-dict td-hd${selected ? " is-entry" : ""}`}
          data-nb-feature="dict"
          data-nb-header=""
          data-bm="hdr"
        >
          {art(artwork.decoration)}
          <div className="has-find nbc-hd-row is-top">
            <div className="nbc-hd-head">
              <div className="nbc-hd-tt">
                {selected && (
                  <Link
                    {...rootScope}
                    href="/tu-dien"
                    className="td-bk"
                    data-nb-back=""
                    data-testid="td-back"
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
                        return;
                      e.preventDefault();
                      pick("");
                    }}
                  >
                    <Icon kind="back" />
                    <span className="sr-only">Quay lại </span>Từ điển
                  </Link>
                )}
                {art(artwork.header)}
                <h1>{selected ? "Từ điển." : "Từ điển chuyên sâu."}</h1>
              </div>
            </div>
            <div className="nbc-hd-find">
              <div
                {...rootScope}
                {...findScope}
                className="td-hero-search"
                data-nb-primary=""
              >
                <form
                  {...findScope}
                  ref={form}
                  className="ds-form relative"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!composing.current)
                      pick(
                        show && active >= 0
                          ? (suggestions[active]?.word ?? query)
                          : query,
                      );
                  }}
                >
                  <span
                    {...findScope}
                    className="ds-lens pointer-events-none absolute inset-y-0 grid place-items-center text-fg"
                  >
                    <Icon kind="search" size={22} />
                  </span>
                  <input
                    {...findScope}
                    ref={input}
                    onCompositionStart={() => {
                      composing.current = true;
                    }}
                    onCompositionEnd={() => {
                      composing.current = false;
                    }}
                    value={query}
                    type="search"
                    placeholder="Tìm kiếm từ tiếng Anh..."
                    maxLength={400}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="ds-input h-14 w-full rounded-pill border-bw border-border-strong bg-surface text-lg font-semibold text-fg shadow-sh-2 outline-none placeholder:text-fg-subtle focus:ring-2 focus:ring-primary-ring"
                    aria-label="Tìm kiếm từ"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={show}
                    aria-controls={show ? listId : undefined}
                    aria-activedescendant={
                      show && active >= 0 && active < suggestions.length
                        ? `${listId}-${active}`
                        : undefined
                    }
                    onFocus={() => setSuggest(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSuggest(true);
                      setActive(-1);
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.nativeEvent.isComposing ||
                        e.nativeEvent.keyCode === 229
                      ) {
                        if (e.key === "Enter") e.preventDefault();
                        return;
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setSuggest(false);
                        setActive(-1);
                      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        if (!suggestions.length || query !== debounced) return;
                        e.preventDefault();
                        setSuggest(true);
                        setActive(
                          e.key === "ArrowDown"
                            ? (active + 1) % suggestions.length
                            : active <= 0
                              ? suggestions.length - 1
                              : active - 1,
                        );
                      }
                    }}
                  />
                  <div
                    {...findScope}
                    className="absolute inset-x-0 top-full z-30 mt-2"
                  >
                    {show && (
                      <div
                        {...findScope}
                        id={listId}
                        role="listbox"
                        data-dict-suggest=""
                        className="overflow-hidden rounded-card border-bw border-border-strong bg-surface shadow-sh-2"
                      >
                        {suggestions.map((item, i) => (
                          <button
                            key={`${item.word}-${item.pos}`}
                            type="button"
                            role="option"
                            tabIndex={-1}
                            id={`${listId}-${i}`}
                            aria-selected={active === i}
                            data-dict-suggest-row=""
                            className={`flex min-h-10 w-full items-center gap-2 px-3 text-left py-2${active === i ? " bg-surface-2" : ""}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onPointerMove={() => setActive(i)}
                            onClick={() => pick(item.word)}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm">
                                {item.word}
                              </span>
                              <span className="block truncate text-xs text-fg-muted">
                                {item.vi ?? ""}
                              </span>
                            </span>
                            <span
                              className="shrink-0 text-xs text-fg-subtle"
                              aria-hidden="true"
                            >
                              ↵
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {query && (
                    <button
                      {...findScope}
                      type="button"
                      className="ds-clear tap-40-box absolute inset-y-0 grid h-full w-8 place-items-center text-fg-subtle"
                      aria-label="Xoá"
                      onClick={() => {
                        setQuery("");
                        setSuggest(false);
                        setActive(-1);
                        input.current?.focus();
                      }}
                    >
                      <Icon kind="close" size={16} />
                    </button>
                  )}
                  <kbd
                    {...findScope}
                    className="ds-kbd pointer-events-none absolute top-1/2 hidden -translate-y-1/2 md:inline-flex"
                    aria-hidden="true"
                  >
                    Enter
                  </kbd>
                </form>
              </div>
            </div>
            <div className="nbc-hd-cta">
              <button
                {...rootScope}
                type="button"
                className="nbc-btn is-ink"
                data-testid="td-search-btn"
                onClick={() => pick(query)}
              >
                Tra từ
                <Icon className="td-cta-arr" />
              </button>
            </div>
          </div>
        </header>
        <div {...rootScope} className="td-panes">
          <div {...rootScope} className="td-pane" data-dict-pane="a">
            <div className="min-w-0">
              <section
                {...rootScope}
                className={result ? "td-entry" : "nbc-lv1 nbc-blk td-frame-in"}
                data-hub-block={result ? "entry" : "state"}
                aria-label={
                  result
                    ? selected
                      ? "Mục từ"
                      : "Một từ trong kho"
                    : "Bản dịch"
                }
              >
                {result ? (
                  <Entry
                    key={result.word}
                    entry={result}
                    onPick={pick}
                    onSave={() => setSave(true)}
                  />
                ) : (
                  <DictionaryTranslation key={selected} term={selected} />
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
      {save && result && (
        <UiDialog
          title="Lưu vào danh sách từ"
          onClose={() => {
            setSave(false);
            setSaveStatus("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaveStatus(
                "Chưa kết nối danh sách từ. Thao tác này chỉ hiển thị trong bản local.",
              );
            }}
          >
            <p>
              <b>{result.word}</b> · {result.meaning}
            </p>
            <label htmlFor="dict-save-list">Danh sách từ</label>
            <select id="dict-save-list" className="ui-search">
              <option>Từ vựng của tôi</option>
            </select>
            <div className="ui-actions">
              <button
                type="button"
                className="nbc-btn"
                onClick={() => setSave(false)}
              >
                Huỷ
              </button>
              <button type="submit" className="nbc-btn is-ink">
                Lưu từ
              </button>
            </div>
            {saveStatus && <p role="status">{saveStatus}</p>}
          </form>
        </UiDialog>
      )}
    </>
  );
}
