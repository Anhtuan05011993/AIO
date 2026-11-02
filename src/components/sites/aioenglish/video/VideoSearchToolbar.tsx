import { VocabIcon } from "../vocab/VocabLibraryToolbar";
const s = { "data-v-373ef635": "" },
  f = { "data-v-97f2d612": "" };
export default function VideoSearchToolbar({
  query,
  onQuery,
  expanded,
  count,
  onFilter,
}: {
  query: string;
  onQuery: (v: string) => void;
  expanded: boolean;
  count: number;
  onFilter: (e: HTMLElement) => void;
}) {
  return (
    <>
      <div
        className="search-box relative min-w-0 flex-1 md:w-64 md:flex-none is-nb vdh-find"
        data-search-grow=""
        data-active={query ? "1" : "0"}
        {...s}
        data-v-ec44a65f=""
      >
        <span
          className="vsb-ic pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-fg-subtle"
          {...s}
        >
          <VocabIcon kind="search" size={15} />
        </span>
        {!query && (
          <span
            className="vsb-ph pointer-events-none absolute inset-y-0 left-9 right-0 flex items-center overflow-hidden text-sm text-fg-subtle"
            aria-hidden="true"
            {...s}
          >
            <span className="ph-short truncate" {...s}>
              Tìm…
            </span>
            <span className="ph-long truncate" {...s}>
              Tìm video, kênh…
            </span>
          </span>
        )}
        <input
          type="search"
          className="vsb-in"
          aria-label="Tìm video hoặc kênh"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onQuery("");
          }}
          {...s}
        />
      </div>
      <span className="inline-flex shrink-0">
        <button
          type="button"
          role="tab"
          aria-selected={expanded}
          aria-expanded={expanded}
          aria-haspopup="dialog"
          aria-label="Bộ lọc chủ đề và độ khó"
          className="relative inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm max-md:w-10 max-md:justify-center max-md:px-0 vtp-nb"
          onClick={(e) => onFilter(e.currentTarget)}
          {...f}
        >
          <VocabIcon kind="filter" size={15} />
          <span className="hidden md:inline" {...f}>
            Chọn chủ đề &amp; độ khó
          </span>
          <span
            className={`min-w-4 text-center text-xs font-bold tabular-nums max-md:hidden${count ? "" : " opacity-0"}`}
            {...f}
          >
            {count}
          </span>
          <span
            className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-current transition-opacity md:hidden${count ? "" : " opacity-0"}`}
            aria-hidden="true"
            {...f}
          />
          <VocabIcon kind="chevron" size={14} className="max-md:hidden" />
        </button>
      </span>
    </>
  );
}
