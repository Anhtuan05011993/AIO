// POST /api/tts — neural TTS (Microsoft Edge). Body: { text, voice? } → mp3.
// Backend: edge-tts-universal, tự động fallback WS direct token v2 khi bị
// Microsoft 403 (chi tiết ở src/server/tts/edge-neural.ts). Lỗi → 502 JSON.

import { NextResponse } from "next/server";
import { synthesizeNeural } from "@/server/tts/edge-neural";

export const runtime = "nodejs";

const DEFAULT_VOICE = "en-US-AriaNeural";
const VOICES = new Set([
  DEFAULT_VOICE,
  "en-US-GuyNeural",
  "en-GB-SoniaNeural",
  "vi-VN-HoaiMyNeural",
]);
const MAX_CHARS = 500;

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => ({}))) as { text?: unknown; voice?: unknown };
    // Bỏ control characters như edge-tts gốc làm.
    const text = typeof body.text === "string" ? body.text.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ") : "";
    const voice = typeof body.voice === "string" && VOICES.has(body.voice) ? body.voice : DEFAULT_VOICE;

    if (!text) return NextResponse.json({ error: "Thiếu text cần đọc." }, { status: 400 });
    if (text.length > MAX_CHARS) {
      return NextResponse.json({ error: "Text tối đa 500 ký tự." }, { status: 400 });
    }

    const audio = await synthesizeNeural(text, voice);
    if (audio.byteLength === 0) {
      return NextResponse.json({ error: "Dịch vụ TTS không trả âm thanh." }, { status: 502 });
    }
    return new Response(audio, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "TTS lỗi.", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
