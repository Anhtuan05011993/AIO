"use client";

/**
 * DictionarySearch — nội dung trang /tu-dien "Từ điển chuyên sâu" (BRIEFS-3):
 *   - ô tra lớn (client): lọc prefix + includes trên toàn bộ mục từ, debounce
 *     150ms, tối đa 30 kết quả; gõ được cả theo nghĩa tiếng Việt (bỏ dấu);
 *   - khi chưa gõ: gợi ý "Từ phổ biến" (chọn ngẫu nhiên seed-cố định — an toàn
 *     hydration), chạm để tra ngay;
 *   - card từ: word + IPA + loại từ + cấp + nghĩa tiếng Việt + định nghĩa EN
 *     + ví dụ (kèm nghĩa ví dụ khi có) + nút phát âm (speech.ts của lesson);
 *   - trạng thái rỗng "Không tìm thấy…" kèm gợi ý phục hồi.
 * Data: entries.json chỉ được import qua src/lib/demo-data/dictionary (JSON
 * module) ở đây — client component duy nhất; page.tsx là server component mỏng.
 * Style: các class gốc nbx-* + utility của entry.css; phần thiếu nằm ở
 * src/styles/custom/dictionary.css với tiền tố lp-*.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  DICTIONARY_SIZE,
  levelChipClass,
  popularWords,
  searchDictionary,
  type DictEntry,
} from "@/lib/demo-data/dictionary";
import { speak } from "../lesson/speech";
import "../../../../styles/custom/dictionary.css";

const fmtNum = new Intl.NumberFormat("vi-VN");

function IconSearch(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lp-d-icon"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function IconVolume(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={17}
      height={17}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.8 5.2a9.4 9.4 0 0 1 0 13.6" />
    </svg>
  );
}

function IconClose(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={14}
      height={14}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function WordCard({ entry }: { entry: DictEntry }): ReactElement {
  return (
    <li className="lp-d-card rounded-card border-bw border-border bg-surface p-4 shadow-sh-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-hero truncate text-xl font-extrabold text-fg">
            {entry.word}
          </p>
          {entry.ipa ? (
            <p className="font-ipa ipa-tone mt-1 text-sm text-fg-muted">
              {entry.ipa}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="lp-d-say"
          onClick={() => speak(entry.word)}
          aria-label={`Phát âm từ ${entry.word}`}
          title="Phát âm"
        >
          <IconVolume />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="nbx-chip nbx-plain">{entry.pos}</span>
        {entry.level ? (
          <span className={levelChipClass(entry.level)}>{entry.level}</span>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-extrabold text-fg">
        {entry.vi ?? (
          <span className="font-semibold text-fg-muted">
            — (chưa có nghĩa tiếng Việt trong dữ liệu demo)
          </span>
        )}
      </p>
      {entry.def ? (
        <p className="mt-1 text-xs leading-relaxed text-fg-muted">
          {entry.def}
        </p>
      ) : null}

      {entry.example ? (
        <div className="mt-3 rounded-card bg-surface-2 px-3 py-2">
          <p className="nbx-ex">{entry.example}</p>
          {entry.exampleVi ? (
            <p className="mt-1 text-xs font-semibold text-fg-muted">
              {entry.exampleVi}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function PopularChips({
  words,
  onPick,
}: {
  words: DictEntry[];
  onPick: (word: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((w) => (
        <button
          key={`${w.word}/${w.pos}`}
          type="button"
          className="nbx-chip nbx-plain lp-d-pop"
          onClick={() => onPick(w.word)}
        >
          {w.word}
        </button>
      ))}
    </div>
  );
}

export default function DictionarySearch(): ReactElement {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 150ms theo spec — huỷ timeout khi gõ tiếp.
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), 150);
    return () => window.clearTimeout(t);
  }, [query]);

  const needle = debounced.trim();
  const { items, total } = useMemo(() => searchDictionary(needle), [needle]);
  const popular = useMemo(() => popularWords(8), []);
  const sizeLabel = fmtNum.format(DICTIONARY_SIZE);

  const countLabel =
    total === 0
      ? "0 từ khớp"
      : total <= items.length
        ? `${fmtNum.format(total)} từ khớp`
        : `${fmtNum.format(items.length)}/${fmtNum.format(total)} từ khớp · hiển thị tối đa 30`;

  const pick = (word: string): void => {
    setQuery(word);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col">
      {/* Hero + ô tra lớn */}
      <section className="ui-dictionary-head">
        <span className="ui-dictionary-mark" aria-hidden="true">
          Aa
        </span>
        <h1 className="font-hero mt-3 text-3xl font-extrabold text-fg">
          Từ điển chuyên sâu.
        </h1>
        <div className="lp-d-search mt-4">
          <IconSearch />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="lp-d-input"
            type="text"
            placeholder="Nhập từ tiếng Anh, hoặc nghĩa tiếng Việt…"
            aria-label="Tra từ điển"
            aria-describedby="dict-hint"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          {query !== "" ? (
            <button
              type="button"
              className="lp-d-clear"
              onClick={() => setQuery("")}
              aria-label="Xoá ô tra"
            >
              <IconClose />
            </button>
          ) : null}
        </div>
        <p id="dict-hint" className="mt-2 text-2xs font-semibold text-fg-muted">
          Ví dụ: benefit · improve · compensate · “lợi ích” · “tuân theo”
        </p>
      </section>

      {needle === "" ? (
        /* Chưa gõ — gợi ý từ phổ biến */
        <section className="nbx-today" aria-labelledby="dict-pop-h">
          <div className="nbx-today-h">
            <h2 id="dict-pop-h">Từ phổ biến.</h2>
            <span className="nbx-mnote" aria-hidden="true">
              Chạm một từ để tra ngay.
            </span>
          </div>
          <PopularChips words={popular} onPick={pick} />
        </section>
      ) : (
        /* Kết quả tra */
        <section className="nbx-today" aria-labelledby="dict-res-h">
          <div className="nbx-today-h">
            <h2 id="dict-res-h">Kết quả.</h2>
            <span className="nbx-mnote" aria-hidden="true">
              {countLabel}
            </span>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {countLabel}
          </p>
          {items.length === 0 ? (
            <div className="rounded-card border-bw border-border bg-surface p-5">
              <p className="text-sm font-extrabold text-fg">
                Không tìm thấy từ nào cho “{needle}”.
              </p>
              <p className="mt-1 text-xs font-semibold text-fg-muted">
                Kiểm tra chính tả, hoặc thử tra theo nghĩa tiếng Việt. Dưới đây
                là vài từ phổ biến:
              </p>
              <div className="mt-3">
                <PopularChips words={popular} onPick={pick} />
              </div>
            </div>
          ) : (
            <ul className="lp-d-grid">
              {items.map((e) => (
                <WordCard key={`${e.word}/${e.pos}`} entry={e} />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
