"use client";
import { useRef, useState, type SVGProps } from "react";
const scope = { "data-v-61a7f904": "" },
  bankScope = { "data-v-5f4a1792": "" };
export function VocabIcon({
  kind,
  size = 18,
  ...props
}: {
  kind:
    | "plus"
    | "search"
    | "close"
    | "sparkles"
    | "chevron"
    | "sort"
    | "filter"
    | "check";
  size?: number;
} & SVGProps<SVGSVGElement>) {
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
      {...props}
    >
      {kind === "plus" ? (
        <>
          <path d="M5 12h14M12 5v14" />
        </>
      ) : kind === "search" ? (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      ) : kind === "close" ? (
        <path d="m18 6-12 12M6 6l12 12" />
      ) : kind === "chevron" ? (
        <path d="m6 9 6 6 6-6" />
      ) : kind === "sort" ? (
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      ) : kind === "check" ? (
        <path d="M20 6 9 17l-5-5" />
      ) : kind === "filter" ? (
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      ) : (
        <>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
        </>
      )}
    </svg>
  );
}
export default function VocabLibraryToolbar({
  bank,
  search,
  query,
  filterOpen,
  onBank,
  onFilter,
  onCreateList,
  onCreate,
  onSearch,
  onQuery,
}: {
  bank: boolean;
  search: boolean;
  query: string;
  filterOpen: boolean;
  onBank: (value: boolean) => void;
  onFilter: (anchor: HTMLElement) => void;
  onCreateList: (name: string) => void;
  onCreate: () => void;
  onSearch: (value: boolean) => void;
  onQuery: (value: string) => void;
}) {
  const [creating, setCreating] = useState(false),
    [newName, setNewName] = useState("");
  const nameInput = useRef<HTMLInputElement>(null),
    createButton = useRef<HTMLButtonElement>(null);
  function cancelCreate() {
    setCreating(false);
    setNewName("");
    requestAnimationFrame(() => createButton.current?.focus());
  }
  function commitCreate() {
    if (!newName.trim()) {
      nameInput.current?.setCustomValidity("Nhập tên danh sách.");
      nameInput.current?.reportValidity();
      return;
    }
    onCreateList(newName.trim());
    cancelCreate();
  }
  const input = useRef<HTMLInputElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  function open() {
    onSearch(true);
    requestAnimationFrame(() => input.current?.focus());
  }
  function close() {
    onQuery("");
    onSearch(false);
    toggle.current?.focus();
  }
  return (
    <div className="lib-row flex flex-nowrap items-center gap-2" {...scope}>
      <div
        className="no-scrollbar flex overflow-x-auto -mx-1 -my-1 min-w-0 flex-1 gap-1.5 px-1 py-1 sm:gap-2 lane-fade"
        aria-label="Chọn kho từ vựng"
        {...scope}
      >
        <span className="lib-seg" {...scope}>
          <button
            type="button"
            className={`bank-chip${bank ? " is-on" : ""}`}
            data-bank={bank ? "on" : "off"}
            aria-pressed={bank}
            aria-haspopup="dialog"
            aria-expanded={filterOpen}
            aria-label="Kho từ vựng lặp lại ngắt quãng - chọn danh sách hiển thị"
            onClick={(e) => (bank ? onFilter(e.currentTarget) : onBank(true))}
            {...bankScope}
          >
            <span className="bank-name" {...bankScope}>
              <span className="bank-short" {...bankScope}>
                Kho ngắt quãng
              </span>
              <span className="bank-long" {...bankScope}>
                Kho từ vựng lặp lại ngắt quãng
              </span>
            </span>
            <span className="bank-dot" aria-hidden="true" {...bankScope}>
              ·
            </span>
            <span className="bank-more" {...bankScope}>
              Bộ lọc{" "}
              <VocabIcon
                kind="chevron"
                size={14}
                className="bank-chev"
                {...bankScope}
              />
            </span>
            <span
              className="bank-badge opacity-0"
              aria-hidden="true"
              {...bankScope}
            >
              0
            </span>
          </button>
          <button
            type="button"
            className={`bank-chip${!bank ? " is-on" : ""}`}
            aria-pressed={!bank}
            aria-label="Xem Bộ từ của bản thân"
            onClick={() => onBank(false)}
            {...bankScope}
          >
            <span className="bank-name" {...bankScope}>
              <span className="bank-short" {...bankScope}>
                Bộ từ bản thân
              </span>
              <span className="bank-long" {...bankScope}>
                Bộ từ của bản thân
              </span>
            </span>
          </button>
        </span>
        {creating ? (
          <span className="lib-new" {...scope}>
            <input
              ref={nameInput}
              autoFocus
              type="text"
              className="lib-new-in"
              aria-label="Tên danh sách mới"
              aria-required="true"
              placeholder="Tên danh sách…"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                e.target.setCustomValidity("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitCreate();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelCreate();
                }
              }}
              {...scope}
            />
            <button
              type="button"
              className="lib-ic-btn is-ok"
              aria-label="Tạo danh sách"
              onClick={commitCreate}
              {...scope}
            >
              <VocabIcon kind="check" size={16} />
            </button>
            <button
              type="button"
              className="lib-ic-btn"
              aria-label="Huỷ tạo danh sách"
              onClick={cancelCreate}
              {...scope}
            >
              <VocabIcon kind="close" size={16} />
            </button>
          </span>
        ) : (
          <button
            ref={createButton}
            type="button"
            className="nbc-btn is-soft is-sm lib-create"
            onClick={() => setCreating(true)}
            {...scope}
          >
            <VocabIcon kind="plus" />
            Tạo danh sách
          </button>
        )}
      </div>
      <div className="lib-tools" {...scope}>
        <div className="lib-search" data-open={search ? "1" : "0"} {...scope}>
          <button
            ref={toggle}
            type="button"
            className="lib-search-btn rounded-full"
            aria-label="Tìm từ"
            aria-expanded={search}
            onClick={() => (search ? close() : open())}
            {...scope}
          >
            <VocabIcon kind="search" size={16} />
          </button>
          <span className="lib-search-dot" aria-hidden="true" {...scope} />
          <span
            className={`lib-search-glass${search ? "" : " opacity-0"}`}
            {...scope}
          >
            <VocabIcon kind="search" size={15} />
          </span>
          <input
            ref={input}
            type="search"
            placeholder="Tìm từ hoặc nghĩa…"
            aria-label="Tìm trong thư viện"
            autoComplete="off"
            tabIndex={search ? 0 : -1}
            className={`lib-search-input${search ? "" : " invisible opacity-0"}`}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                close();
              }
            }}
            {...scope}
          />
          <button
            type="button"
            className={`lib-search-clear tap-40-box${search ? "" : " pointer-events-none opacity-0"}`}
            aria-label="Xoá tìm kiếm"
            tabIndex={search ? 0 : -1}
            aria-hidden={!search}
            onClick={() => {
              onQuery("");
              input.current?.focus();
            }}
            {...scope}
          >
            <VocabIcon kind="close" size={16} />
          </button>
        </div>
        <button
          type="button"
          className="nbc-btn is-soft is-sm lib-add"
          aria-label="Tạo từ vựng"
          onClick={onCreate}
          {...scope}
        >
          <VocabIcon kind="sparkles" />
          <span className="lib-add-l" {...scope}>
            Tạo từ vựng
          </span>
        </button>
      </div>
    </div>
  );
}
