// GET /api/video/transcript?id=<youtubeId> — bóc transcript thật từ phụ đề
// YouTube (npm youtube-transcript) cho workspace /video (Mục 4b).
// Ghép các đoạn caption ngắn thành câu hoàn chỉnh để dùng cho dictation/shadowing.
// Lỗi phổ biến: video không có phụ đề / video riêng tư → 404 JSON.
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Segment = { text: string; offset: number; duration: number };
type OutSentence = { en: string; vi: string | null };

const MAX_SENTENCES = 60;
const MAX_LEN = 240;
const GAP_MS = 1500;
/** Đoạn nhạc/hiệu ứng phụ đề — bỏ hẳn. */
const NOISE = /^[[(]?(♪+|\[?music\]?|\[?applause\]?|\[?laughter\]?|♫+)[\])]?$/i;

/** Ghép đoạn caption ngắn thành câu: cắt tại .!?, hoặc theo khoảng lặng
 *  giữa các cue (video nhạc thường không có dấu câu). */
function toSentences(segments: Segment[]): OutSentence[] {
  const out: OutSentence[] = [];
  let buf = "";
  let bufEnd = 0; // ms — cuối cue đang tích luỹ
  let start = true;
  const push = () => {
    const t = buf.replace(/\s+/g, " ").trim();
    if (t.length >= 4) {
      out.push({ en: start ? t[0].toUpperCase() + t.slice(1) : t, vi: null });
      start = true;
    }
    buf = "";
  };
  for (const seg of segments) {
    let text = seg.text.replace(/\s+/g, " ").trim();
    if (!text || NOISE.test(text)) continue;
    text = text.replace(/[♪♫]+/g, " ").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const gap = seg.offset - bufEnd;
    if (buf && (gap > GAP_MS || buf.length >= 200)) push();
    buf += (buf && !/\s$/.test(buf) ? " " : "") + text;
    bufEnd = seg.offset + (seg.duration ?? 0);
    // cắt câu: dấu chấm/hỏi/cảm theo sau dấu cách hoặc cuối chuỗi buffer
    const m = buf.match(/^(.*?[.!?])(\s.*)?$/s);
    if (m) {
      buf = m[1];
      push();
      buf = (m[2] ?? "").trim();
      start = false;
    }
    if (out.length >= MAX_SENTENCES) break;
  }
  if (buf.trim() && out.length < MAX_SENTENCES) {
    const t = buf.replace(/\s+/g, " ").trim();
    if (t.length >= 4) out.push({ en: start ? t[0].toUpperCase() + t.slice(1) : t, vi: null });
  }
  // gộp câu quá ngắn liên tiếp, cắt câu quá dài
  const merged: OutSentence[] = [];
  for (const s of out) {
    const prev = merged[merged.length - 1];
    if (s.en.length <= 18 && prev && prev.en.length + s.en.length <= MAX_LEN) {
      prev.en = `${prev.en} ${s.en}`;
    } else if (s.en.length > MAX_LEN) {
      merged.push({ en: `${s.en.slice(0, MAX_LEN - 1)}…`, vi: null });
    } else {
      merged.push(s);
    }
  }
  return merged.slice(0, MAX_SENTENCES);
}

export async function GET(req: Request): Promise<NextResponse> {
  const id = new URL(req.url).searchParams.get("id")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
    return NextResponse.json({ error: "videoId không hợp lệ (11 ký tự)." }, { status: 400 });
  }
  try {
    let segments: Segment[];
    try {
      segments = await YoutubeTranscript.fetchTranscript(id);
    } catch {
      // thử lại với transcript tiếng Anh (một số video mặc định ngôn ngữ khác)
      segments = await YoutubeTranscript.fetchTranscript(id, { lang: "en" });
    }
    if (!segments?.length) {
      return NextResponse.json({ error: "Video không có phụ đề." }, { status: 404 });
    }
    const sentences = toSentences(segments);
    if (!sentences.length) {
      return NextResponse.json({ error: "Phụ đề trống hoặc không đọc được." }, { status: 404 });
    }
    return NextResponse.json(
      { videoId: id, count: sentences.length, sentences },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found|không tồn tại|unavailable|private/i.test(msg) ? 404 : 502;
    return NextResponse.json({ error: `Không tải được transcript: ${msg}` }, { status });
  }
}
