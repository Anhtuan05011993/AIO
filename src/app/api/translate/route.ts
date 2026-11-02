// POST /api/translate — dịch loạt câu EN→VI cho transcript video thật (Mục: dịch VI).
// Nguồn dịch: endpoint translate_a gtx miễn phí của Google (không cần key) —
// ghép các câu bằng \n thành 1 request, tách lại theo dòng; lệch số dòng thì
// dịch từng câu (song song 4). Lỗi mạng/lệch kết quả → trả null cho câu đó,
// UI giữ nguyên dòng EN.
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_MAX = 20;
const cache = new Map<string, string[]>(); // key = hash input → translations

function hashKey(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return String(h);
}

async function fetchWithTimeout(url: string, ms = 15000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/** 1 request Google gtx cho cụm câu ghép \n → mảng dịch (null khi lệch). */
async function googleBatch(joined: string): Promise<string[] | null> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=" +
    encodeURIComponent(joined);
  const res = await fetchWithTimeout(url);
  if (!res.ok) return null;
  const j = (await res.json()) as unknown;
  // response[0] = mảng segment [translated, original, ...]
  if (!Array.isArray(j) || !Array.isArray(j[0])) return null;
  const parts = (j[0] as unknown[])
    .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : ""))
    .join("");
  const lines = parts.split("\n").map((s) => s.trim());
  return lines;
}

/** MyMemory dự phòng cho 1 câu. */
async function myMemoryOne(text: string): Promise<string | null> {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text.slice(0, 480)) +
    "&langpair=en|vi";
  try {
    const res = await fetchWithTimeout(url, 10000);
    if (!res.ok) return null;
    const j = (await res.json()) as { responseData?: { translatedText?: string } };
    const t = j.responseData?.translatedText;
    return t && !/^MYMEMORY WARNING/i.test(t) ? t : null;
  } catch {
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: { texts?: unknown };
  try {
    body = (await req.json()) as { texts?: unknown };
  } catch {
    return NextResponse.json({ error: "Body không phải JSON." }, { status: 400 });
  }
  const texts = Array.isArray(body.texts)
    ? body.texts.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : null;
  if (!texts || texts.length === 0) {
    return NextResponse.json({ error: "texts phải là mảng chuỗi khác rỗng." }, { status: 400 });
  }
  if (texts.length > 80) {
    return NextResponse.json({ error: "Tối đa 80 câu mỗi request." }, { status: 400 });
  }

  const key = hashKey(texts.join("\u0001"));
  const hit = cache.get(key);
  if (hit) return NextResponse.json({ translations: hit, cached: true });

  // Bước 1: dịch cả loạt bằng 1 request (ghép \n)
  let translations: (string | null)[] = new Array(texts.length).fill(null);
  try {
    const lines = await googleBatch(texts.join("\n"));
    if (lines && lines.length === texts.length) translations = lines;
  } catch {
    // rơi xuống fallback
  }

  // Bước 2: những câu còn thiếu → dịch lẻ (song song 4)
  const missing = translations.map((t, i) => (t ? -1 : i)).filter((i) => i >= 0);
  if (missing.length > 0) {
    const done = await mapLimit(missing, 4, async (i) => myMemoryOne(texts[i]));
    missing.forEach((idx, k) => {
      translations[idx] = done[k];
    });
  }

  const clean = translations.map((t) => t ?? "");
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, clean);
  const okCount = clean.filter((t) => t.length > 0).length;
  return NextResponse.json({ translations: clean, okCount });
}
