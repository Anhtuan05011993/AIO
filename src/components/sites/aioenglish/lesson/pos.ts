// Part-of-speech → site ling-* palette mapping (same visual language as the landing demo).
export type PosKey =
  | "pronoun" | "verb" | "article" | "adjective" | "noun" | "preposition"
  | "adverb" | "conjunction" | "number" | "auxiliary" | "other";

export const POS_COLOR: Record<PosKey, { bg: string; ink: string; bar: string }> = {
  pronoun: { bg: "ling-blue-bg", ink: "ling-blue", bar: "ling-teal" },
  auxiliary: { bg: "ling-blue-bg", ink: "ling-blue", bar: "ling-teal" },
  verb: { bg: "ling-green-bg", ink: "ling-green", bar: "ling-green" },
  article: { bg: "ling-gold-bg", ink: "ling-gold", bar: "ling-slate" },
  preposition: { bg: "ling-gold-bg", ink: "ling-gold", bar: "ling-gold" },
  adjective: { bg: "ling-gold-bg", ink: "ling-gold", bar: "ling-violet" },
  noun: { bg: "ling-gold-bg", ink: "ling-gold", bar: "ling-blue" },
  adverb: { bg: "ling-orange-bg", ink: "ling-orange", bar: "ling-orange" },
  conjunction: { bg: "ling-rose-bg", ink: "ling-rose", bar: "ling-rose" },
  number: { bg: "ling-leaf-bg", ink: "ling-leaf", bar: "ling-leaf" },
  other: { bg: "ling-slate-bg", ink: "ling-slate", bar: "ling-slate" },
};

const VN_TO_KEY: Record<string, PosKey> = {
  "đại": "pronoun", "đại từ": "pronoun",
  "động": "verb", "động từ": "verb",
  "mạo": "article", "mạo từ": "article", "mạo tính": "article",
  "tính": "adjective", "tính từ": "adjective",
  "danh": "noun", "danh từ": "noun",
  "giới": "preposition", "giới từ": "preposition",
  "trạng": "adverb", "trạng từ": "adverb",
  "liên": "conjunction", "liên từ": "conjunction",
  "số": "number", "số từ": "number",
  "trợ": "auxiliary", "trợ động từ": "auxiliary",
};

export function normalizePos(p?: string | null): PosKey {
  if (!p) return "other";
  const k = p.toLowerCase().trim();
  if (VN_TO_KEY[k]) return VN_TO_KEY[k];
  if (/^(pronoun|pron)$/i.test(k)) return "pronoun";
  if (/^(verb|v)$/i.test(k)) return "verb";
  if (/^(article|det)$/i.test(k)) return "article";
  if (/^(adjective|adj)$/i.test(k)) return "adjective";
  if (/^(noun|n)$/i.test(k)) return "noun";
  if (/^(preposition|prep)$/i.test(k)) return "preposition";
  if (/^(adverb|adv)$/i.test(k)) return "adverb";
  if (/^(conjunction|conj)$/i.test(k)) return "conjunction";
  if (/^(number|num)$/i.test(k)) return "number";
  if (/^(auxiliary|aux)$/i.test(k)) return "auxiliary";
  return "other";
}

export function posFromUnit(unitPart?: string | null, grammarTags?: string[]): PosKey {
  const key = normalizePos(unitPart);
  if (key !== "other") return key;
  for (const t of grammarTags ?? []) {
    const k = normalizePos(t);
    if (k !== "other") return k;
  }
  return "other";
}

// Vietnamese pill labels (the source UI shows "Đại", "Động từ", "Mạo từ"...).
const POS_VN: Record<PosKey, string> = {
  pronoun: "Đại",
  auxiliary: "Trợ Đ.từ",
  verb: "Động",
  article: "Mạo",
  adjective: "Tính",
  noun: "Danh",
  preposition: "Giới",
  adverb: "Trạng",
  conjunction: "Liên",
  number: "Số",
  other: "Khác",
};

export function posLabelVn(p?: string | null, tags?: string[]): string {
  return POS_VN[posFromUnit(p, tags)];
}

export const hsl = (v: string) => `hsl(var(--${v}))`;
export const hslA = (v: string, a: number) => `hsl(var(--${v}) / ${a})`;

// Normalize typed answers the same way the source does (case, punctuation, curly quotes).
export function normAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
