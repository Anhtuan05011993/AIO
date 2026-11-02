// Phát âm hybrid: ưu tiên neural TTS qua /api/tts (edge-tts), lỗi mạng thì
// fallback về Web Speech API (offline). Mirrors the source app's "Phát âm" behavior.

const VOICE_BY_ACCENT = {
  "en-GB": "en-GB-SoniaNeural",
  "en-US": "en-US-AriaNeural",
} as const;

// Cache blob URL theo text+voice để không gọi lại network (giới hạn ~50 entry).
const blobUrlCache = new Map<string, string>();
const BLOB_CACHE_MAX = 50;

let currentAudio: HTMLAudioElement | null = null;

function blobCacheKey(text: string, voice: string): string {
  return `${voice}:${text}`;
}

/** POST /api/tts → blob URL mp3; null nếu lỗi (offline / 502). */
async function fetchNeuralAudio(text: string, voice: string): Promise<string | null> {
  const key = blobCacheKey(text, voice);
  const hit = blobUrlCache.get(key);
  if (hit) return hit;
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    // Giữ cache tối đa BLOB_CACHE_MAX entry — dư thì revoke entry cũ nhất.
    if (blobUrlCache.size >= BLOB_CACHE_MAX) {
      const oldest = blobUrlCache.keys().next().value;
      if (oldest) {
        const oldUrl = blobUrlCache.get(oldest);
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        blobUrlCache.delete(oldest);
      }
    }
    blobUrlCache.set(key, url);
    return url;
  } catch {
    return null;
  }
}

/** Fallback nguyên logic Web Speech cũ (offline). */
function speakWithWebSpeech(text: string, accent: "en-GB" | "en-US"): void {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accent === "en-GB" ? "en-GB" : "en-US";
    u.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const v =
      voices.find((x) => x.lang.replace("_", "-") === u.lang) ||
      voices.find((x) => x.lang.startsWith("en"));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    // no-op: speech unavailable
  }
}

export function speak(text: string, accent: "en-GB" | "en-US" = "en-GB"): void {
  if (typeof window === "undefined") return;
  const voice = VOICE_BY_ACCENT[accent];
  void fetchNeuralAudio(text, voice)
    .then((url) => {
      if (!url) {
        speakWithWebSpeech(text, accent); // offline / server lỗi
        return;
      }
      stopSpeaking(); // dừng thứ đang phát trước khi mở audio mới
      const audio = new Audio(url);
      currentAudio = audio;
      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
      };
      const fallback = () => {
        if (currentAudio === audio) currentAudio = null;
        speakWithWebSpeech(text, accent);
      };
      audio.onerror = fallback;
      audio.play().catch(fallback); // autoplay bị chặn v.v.
    })
    .catch(() => speakWithWebSpeech(text, accent));
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      // no-op
    }
    currentAudio = null;
  }
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // no-op
    }
  }
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => SpeechRecognitionLike;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function listenOnce(
  onText: (text: string) => void,
  onDone: () => void,
  accent: "en-GB" | "en-US" = "en-GB",
): () => void {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) {
    onDone();
    return () => undefined;
  }
  const rec = new Ctor();
  rec.lang = accent === "en-GB" ? "en-GB" : "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  rec.continuous = false;
  rec.onresult = (e) => {
    const last = e.results[e.results.length - 1];
    const alt = last && last[0];
    if (alt) onText(alt.transcript);
  };
  rec.onerror = () => onDone();
  rec.onend = () => onDone();
  try {
    rec.start();
  } catch {
    onDone();
  }
  return () => {
    try {
      rec.stop();
    } catch {
      // no-op
    }
  };
}
