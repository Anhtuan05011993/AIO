// scorer.ts — bộ chấm bản dịch EN theo token overlap (dùng chung cho
// ArticleReader "/luyen-dich-thuat/[bai]" chế độ "Dịch có chấm điểm" và
// VideoWorkspace "/video/[bai]" chế độ Dictation).
//
// Thuật toán (đúng spec BRIEFS-4):
//   1. Normalize: lowercase, bỏ dấu câu (giữ chữ/số/apostrophe), gộp khoảng trắng.
//   2. Bỏ mạo từ (a/an/the) ở CẢ HAI phía để người dùng không bị trừ điểm vì
//      thiếu/sửa mạo từ; chuẩn hóa nhẹ đuôi từ ('s, số nhiều, -ed/-ing).
//   3. Token overlap = F1 giữa ref và user: matched = số token ref khớp token
//      user (đa tập, greedy theo stemmed key); r = matched/|ref|,
//      p = matched/|user|, ratio = 2rp/(r+p). Câu trống → 0.
//   4. Verdict: ratio ≥ 0.75 → "Chính xác"; 0.4–0.75 → "Gần đúng"; < 0.4 → "Sai".

export type ScoreVerdict = "exact" | "close" | "miss";

export type ScoreResult = {
  /** 0..1 — F1 token overlap sau normalize. */
  ratio: number;
  verdict: ScoreVerdict;
  /** Token của bản mẫu (sau normalize, đã bỏ mạo từ) — dùng vẽ chip đối chiếu. */
  refTokens: string[];
  /** Token người dùng gõ (sau normalize). */
  userTokens: string[];
  /** Token ref có khớp trong bản của người dùng (cùng thứ tự refTokens). */
  matchedRef: boolean[];
  /** Số token người dùng gõ thừa (không khớp token mẫu nào). */
  extraCount: number;
};

export const VERDICT_LABEL: Record<ScoreVerdict, string> = {
  exact: "Chính xác",
  close: "Gần đúng",
  miss: "Sai",
};

/** Ngưỡng điểm theo spec: ≥0.75 chính xác, 0.4–0.75 gần đúng, <0.4 sai. */
export const EXACT_THRESHOLD = 0.75;
export const CLOSE_THRESHOLD = 0.4;

const ARTICLES = new Set(["a", "an", "the"]);

/** Chuẩn hóa 1 token: bỏ 's, đuôi số nhiều/-ed/-ing cơ bản. */
function stem(token: string): string {
  let t = token;
  if (t.length > 2 && t.endsWith("'s")) t = t.slice(0, -2);
  if (t.length > 3 && t.endsWith("ies")) t = t.slice(0, -3) + "y";
  else if (t.length > 3 && t.endsWith("sses")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") && !t.endsWith("us") && !t.endsWith("is")) t = t.slice(0, -1);
  if (t.length > 4 && t.endsWith("ied")) t = t.slice(0, -3) + "y";
  else if (t.length > 4 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ed")) t = t.slice(0, -2);
  return t;
}

/** Lowercase + bỏ dấu câu + gộp khoảng trắng → mảng token (đã bỏ mạo từ). */
export function normalizeTokens(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    // Nới lỏng contraction phổ biến để "don't" ≈ "do not" (cả 2 phía như nhau).
    .replace(/n't\b/g, " not")
    .replace(/'ll\b/g, " will")
    .replace(/'re\b/g, " are")
    .replace(/'ve\b/g, " have")
    .replace(/'m\b/g, " am")
    .replace(/'d\b/g, " would")
    .replace(/[^\p{L}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return [];
  return cleaned
    .split(" ")
    .filter((t) => t.length > 0 && !ARTICLES.has(t));
}

export function scoreTranslation(reference: string, user: string): ScoreResult {
  const refTokens = normalizeTokens(reference);
  const userTokens = normalizeTokens(user);

  if (refTokens.length === 0 || userTokens.length === 0) {
    return {
      ratio: 0,
      verdict: "miss",
      refTokens,
      userTokens,
      matchedRef: refTokens.map(() => false),
      extraCount: userTokens.length,
    };
  }

  // Đa tập token user theo key stemmed.
  const pool = new Map<string, number>();
  for (const t of userTokens) {
    const k = stem(t);
    pool.set(k, (pool.get(k) ?? 0) + 1);
  }

  let matched = 0;
  const matchedRef: boolean[] = refTokens.map((t) => {
    const k = stem(t);
    const left = pool.get(k) ?? 0;
    if (left > 0) {
      pool.set(k, left - 1);
      matched += 1;
      return true;
    }
    return false;
  });

  const recall = matched / refTokens.length;
  const precision = matched / userTokens.length;
  const ratio = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const verdict: ScoreVerdict = ratio >= EXACT_THRESHOLD ? "exact" : ratio >= CLOSE_THRESHOLD ? "close" : "miss";

  return {
    ratio,
    verdict,
    refTokens,
    userTokens,
    matchedRef,
    extraCount: userTokens.length - matched,
  };
}

/** Số từ gợi ý hiển thị trên chip hint (đếm token chuẩn hóa của bản mẫu). */
export function wordCountHint(reference: string): number {
  return normalizeTokens(reference).length;
}
