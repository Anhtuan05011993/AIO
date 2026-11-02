/**
 * Từ điển demo — /tu-dien "Từ điển chuyên sâu" (Agent E2).
 *
 * NGUỒN DỮ LIỆU (BRIEFS-3, bước 1):
 *  1. open-vn-en-dict (github.com/samuraitruong/open-vn-en-dict) — nguồn chỉ định:
 *     `goodWords.json` lẫn `words.json` đều chỉ là map dáng `{ "<word>": 1 }`
 *     (danh sách từ trần, ~63k/200k từ) — KHÔNG có IPA, loại từ, nghĩa hay ví dụ
 *     nào cả → schema không dùng được cho trang từ điển.
 *  2. Fallback theo đúng spec BRIEFS-3 (nguồn thắng cuộc, disclose):
 *     - Oxford 5000 full-word (`docs/research/aioenglish/data/datasets/
 *       oxford-5000-full-word.json`): 5.946 mục từ — word + type + level CEFR
 *       + phonetics (uk/us) + ví dụ tiếng Anh.
 *     - TOEIC 600 (`datasets/toeic-600/toeic-600-words-dataset-main/data/
 *       toeic_600_words.csv`, 615 dòng): nghĩa tiếng Việt + phiên âm + giải
 *       thích EN + ví dụ EN/VI — ghép vào các từ trùng; 171 từ chỉ có trong
 *       TOEIC 600 được giữ lại làm mục từ riêng (level "TOEIC").
 *     - Enrichment: định nghĩa EN ngắn khớp thêm từ cefr-vocabulary-dataset
 *       (en-A1..C1, 1.287 lemma) cho các mục từ chưa có `def`.
 *     Tổng: 6.117 mục từ — 731 có nghĩa tiếng Việt, 6.111 có IPA, 6.078 có ví dụ.
 *
 * Script chuyển đổi: `_agent-scripts/e2-convert-dictionary.js` (dữ liệu thô
 * được tải về `_agent-scripts/tmp-dict/`, không bao giờ import thẳng vào app).
 * `entries.json` chỉ được import bởi client component của trang /tu-dien.
 */
import rawEntries from "./entries.json";

export type DictEntry = {
  /** Headword — giữ nguyên chữ của nguồn (Oxford/TOEIC). */
  word: string;
  /** Phiên âm IPA có sẵn trong nguồn (ưu tiên TOEIC > Oxford uk > us), hoặc null. */
  ipa: string | null;
  /** Loại từ ("noun", "verb", "indefinite article"…) — theo nguồn. */
  pos: string;
  /** Cấp CEFR (A1..C2) hoặc "TOEIC" với từ chỉ có trong bộ TOEIC 600. */
  level: string | null;
  /** Nghĩa tiếng Việt (TOEIC 600) hoặc null. */
  vi: string | null;
  /** Định nghĩa tiếng Anh ngắn (TOEIC 600 / cefr-vocabulary) hoặc null. */
  def: string | null;
  /** Câu ví dụ tiếng Anh hoặc null. */
  example: string | null;
  /** Dịch tiếng Việt của câu ví dụ (TOEIC 600) hoặc null. */
  exampleVi: string | null;
};

/** Toàn bộ mục từ của từ điển demo (đã sort theo word asc, pos asc). */
export const DICTIONARY_ENTRIES: DictEntry[] = rawEntries as unknown as DictEntry[];

/** Tổng số mục từ (hiển thị ở header/footer trang). */
export const DICTIONARY_SIZE = DICTIONARY_ENTRIES.length;

const LV_CHIPS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Class chip cấp độ — dùng chip `nbx-lv-*` gốc cho A1..C2, chip trung tính cho TOEIC/khác. */
export function levelChipClass(level: string): string {
  const lv = level.toUpperCase();
  return LV_CHIPS.has(lv) ? `nbx-chip nbx-lvl nbx-lv-${lv.toLowerCase()}` : "nbx-chip nbx-plain";
}

/** Bỏ dấu tiếng Việt + lowercase — cho lọc theo nghĩa VN không phụ thuộc dấu. */
function foldVi(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Lọc client-side theo prefix + includes:
 *   rank 0 — word bắt đầu bằng cụm gõ;
 *   rank 1 — word chứa cụm gõ;
 *   rank 2 — nghĩa tiếng Việt / định nghĩa EN chứa cụm gõ (không phân biệt dấu).
 * Danh sách nguồn đã sort alphabet nên kết quả trong mỗi rank giữ thứ tự từ điển.
 */
export function searchDictionary(
  needle: string,
  limit = 30,
): { items: DictEntry[]; total: number } {
  const q = needle.trim().toLowerCase();
  if (!q) return { items: [], total: 0 };
  const qVi = foldVi(q);
  const prefix: DictEntry[] = [];
  const within: DictEntry[] = [];
  const meaning: DictEntry[] = [];
  for (const e of DICTIONARY_ENTRIES) {
    const w = e.word.toLowerCase();
    if (w.startsWith(q)) prefix.push(e);
    else if (w.includes(q)) within.push(e);
    else if (
      (e.vi !== null && foldVi(e.vi).includes(qVi)) ||
      (e.def !== null && foldVi(e.def).includes(qVi))
    ) {
      meaning.push(e);
    }
  }
  const total = prefix.length + within.length + meaning.length;
  return { items: [...prefix, ...within, ...meaning].slice(0, limit), total };
}

/**
 * "Từ phổ biến" khi chưa gõ: chọn ngẫu nhiên từ các mục có đủ nghĩa VN + ví dụ,
 * ưu tiên cấp A1–B1 (từ thông dụng trước). Dùng PRNG seed cố định (mulberry32)
 * để server render và client render ra cùng một danh sách — an toàn hydration,
 * vẫn ngẫu nhiên theo nghĩa hiển thị.
 */
const POPULAR_POOL = DICTIONARY_ENTRIES.filter(
  (e) => e.vi !== null && e.example !== null && e.level !== null && e.level !== "TOEIC",
);
const POPULAR_POOL_COMMON = POPULAR_POOL.filter((e) => e.level !== null && ["A1", "A2", "B1"].includes(e.level));

export function popularWords(n: number, seed = 20261031): DictEntry[] {
  let a = seed >>> 0;
  const rand = (): number => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pool = POPULAR_POOL_COMMON.length >= n ? POPULAR_POOL_COMMON : POPULAR_POOL;
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((i) => pool[i]);
}
