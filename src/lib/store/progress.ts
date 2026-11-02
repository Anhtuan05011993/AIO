// Demo progress store — localStorage-backed XP / streak / lesson completion / SRS card states.
// Mirrors what the real site persists server-side per account.
// Server sync (BRIEFS-4): mutations also POST to /api/progress/* (fire-and-forget,
// chỉ khi có session máy chủ); lần load đầu tiên kéo progress từ server về nếu
// server mới hơn (so `updatedAt`). localStorage vẫn là nguồn UI đọc — mọi export
// giữ nguyên signature, fail im lặng, không block UI.

import { createEmptyCard, fsrs, generatorParameters, Rating, type Card as FsrsCard, type RecordLog } from "ts-fsrs";
import type { LessonDifficulty, LessonMode } from "@/components/sites/aioenglish/lesson/LessonExperience";
import { hasServerSession } from "@/lib/store/auth";

const KEY = "aio-demo-progress";

/** Trạng thái bộ nhớ FSRS tuần hoàn hoá (Date → epoch ms) để lưu localStorage. */
export type FsrsState = {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_review: number;
  reps: number;
  lapses: number;
  state: number;
};

export type SrsCard = {
  word: string;
  course: string; // vocab course slug, e.g. "toeic-600"
  ease: number; // 2.5 default (SM-2 style)
  intervalDays: number;
  dueAt: number; // epoch ms
  lapses: number;
  reps: number;
  lastGrade: Grade | null;
  /** FSRS (ts-fsrs) — card cũ trước nâng cấp không có trường này. */
  fsrs?: FsrsState;
};

export type Grade = "again" | "hard" | "good" | "easy";

export type LessonRecord = {
  courseId: string;
  mode: LessonMode;
  difficulty: LessonDifficulty;
  seconds: number;
  accuracy: number; // 0-100
  xp: number;
  completedAt: number;
};

export type ProgressState = {
  xp: number;
  weeklyXp: number;
  streakDays: number;
  lastCheckIn: string | null; // ISO date (yyyy-mm-dd)
  checkInDays: string[]; // ISO dates checked in
  minutesToday: { date: string; minutes: number };
  lessons: LessonRecord[];
  srs: Record<string, SrsCard>; // key = course + ":" + word
  vocabSeen: number;
  /** epoch ms — mốc so tuổi giữa local và server; old local states mặc định 0. */
  updatedAt?: number;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaults(): ProgressState {
  return {
    xp: 0,
    weeklyXp: 0,
    streakDays: 0,
    lastCheckIn: null,
    checkInDays: [],
    minutesToday: { date: today(), minutes: 0 },
    lessons: [],
    srs: {},
    vocabSeen: 0,
    updatedAt: 0,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaults();
  syncFromServerOnce();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = { ...defaults(), ...(JSON.parse(raw) as Partial<ProgressState>) };
    if (parsed.minutesToday.date !== today()) parsed.minutesToday = { date: today(), minutes: 0 };
    return parsed;
  } catch {
    return defaults();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("aio:progress-changed"));
  } catch {
    // storage unavailable
  }
}

export function addLessonRecord(rec: Omit<LessonRecord, "completedAt">): ProgressState {
  const s = loadProgress();
  s.lessons.push({ ...rec, completedAt: Date.now() });
  s.xp += rec.xp;
  s.weeklyXp += rec.xp;
  s.minutesToday.minutes += Math.max(1, Math.round(rec.seconds / 60));
  s.updatedAt = Date.now();
  saveProgress(s);
  postToServer("/api/progress/lesson", {
    courseId: rec.courseId,
    mode: rec.mode,
    difficulty: rec.difficulty,
    seconds: rec.seconds,
    accuracy: rec.accuracy,
    xp: rec.xp,
  });
  return s;
}

/** Điểm danh — keep the streak. Returns the new state. */
export function checkIn(): ProgressState {
  const s = loadProgress();
  const d = today();
  if (s.lastCheckIn === d) return s;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.streakDays = s.lastCheckIn === yesterday ? s.streakDays + 1 : 1;
  s.lastCheckIn = d;
  if (!s.checkInDays.includes(d)) s.checkInDays.push(d);
  s.xp += 5;
  s.weeklyXp += 5;
  s.updatedAt = Date.now();
  saveProgress(s);
  postToServer("/api/progress/checkin", {});
  return s;
}

// ---------------------------------------------------------------------------
// SRS — FSRS (ts-fsrs, cùng thuật toán với Anki). Các trường ease/intervalDays/
// dueAt... là bản ánh xạ để UI cũ vẫn đọc đúng.
// ---------------------------------------------------------------------------

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

const RATING_BY_GRADE = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy } as const;

/** Trạng thái lưu trong SrsCard → Card của ts-fsrs (để repeat tiếp). */
function toFsrsCard(m: FsrsState): FsrsCard {
  return {
    due: new Date(m.due),
    stability: m.stability,
    difficulty: m.difficulty,
    elapsed_days: m.elapsed_days,
    scheduled_days: 0,
    learning_steps: 0,
    reps: m.reps,
    lapses: m.lapses,
    state: m.state as FsrsCard["state"],
    last_review: new Date(m.last_review),
  };
}

/** Card sau repeat → trạng thái nhỏ gọn lưu localStorage. */
function toStoredFsrs(c: FsrsCard): FsrsState {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    last_review: c.last_review ? c.last_review.getTime() : Date.now(),
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
  };
}

/** Đánh giá flashcard bằng FSRS (demo fidelity, không phải scheduler chính xác của site). */
export function gradeCard(course: string, word: string, grade: Grade): ProgressState {
  const s = loadProgress();
  const key = `${course}:${word}`;
  const card: SrsCard =
    s.srs[key] ?? { word, course, ease: 2.5, intervalDays: 0, dueAt: Date.now(), lapses: 0, reps: 0, lastGrade: null };
  const now = new Date();
  // Card cũ chưa có fsrs (dữ liệu trước nâng cấp) → khởi tạo lại từ đầu.
  const prev: FsrsCard = card.fsrs ? toFsrsCard(card.fsrs) : createEmptyCard(now);
  const preview: RecordLog = scheduler.repeat(prev, now);
  const next = preview[RATING_BY_GRADE[grade]].card;
  card.fsrs = toStoredFsrs(next);

  card.reps += 1;
  card.lastGrade = grade;
  if (grade === "again") {
    card.lapses += 1;
    card.ease = Math.max(1.3, card.ease - 0.2);
    card.intervalDays = 0;
    card.dueAt = next.due.getTime();
  } else {
    card.ease = Math.min(3, card.ease + (grade === "easy" ? 0.1 : 0));
    card.intervalDays = Math.max(0, Math.round((next.due.getTime() - now.getTime()) / 86400000));
    card.dueAt = next.due.getTime();
    s.xp += grade === "easy" ? 3 : 2;
    s.weeklyXp += grade === "easy" ? 3 : 2;
  }
  s.srs[key] = card;
  if (!s.vocabSeen) s.vocabSeen = 0;
  s.updatedAt = Date.now();
  saveProgress(s);
  postToServer("/api/progress/grade", { course, word, grade });
  return s;
}

export function dueCards(course: string): SrsCard[] {
  const s = loadProgress();
  const now = Date.now();
  return Object.values(s.srs).filter(
    (c) => c.course === course && (c.fsrs ? c.fsrs.due <= now : c.dueAt <= now), // card legacy dùng dueAt cũ
  );
}

export function onProgressChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("aio:progress-changed", cb);
  return () => window.removeEventListener("aio:progress-changed", cb);
}

// ---------------------------------------------------------------------------
// Server sync (BRIEFS-4, Agent F1)
// ---------------------------------------------------------------------------

/** Fire-and-forget POST lên backend; im lặng nếu chưa có session hoặc lỗi mạng. */
function postToServer(path: string, payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  void hasServerSession()
    .then((authed) => {
      if (!authed) return undefined;
      return fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => undefined);
    })
    .catch(() => undefined);
}

type ServerProgressPayload = Partial<ProgressState> & { updatedAt?: number };

let syncStarted = false;

/** Chạy 1 lần mỗi trang: nếu có session máy chủ, kéo /api/progress và ghi đè
 *  localStorage khi server mới hơn (so updatedAt). Ghi xong dispatch
 *  "aio:progress-changed" (qua saveProgress) để dashboard tự cập nhật. */
function syncFromServerOnce(): void {
  if (syncStarted || typeof window === "undefined") return;
  syncStarted = true;
  void (async () => {
    try {
      if (!(await hasServerSession())) return;
      const res = await fetch("/api/progress", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { progress?: ServerProgressPayload | null };
      const server = data.progress;
      if (!server) return;
      const serverAt = typeof server.updatedAt === "number" ? server.updatedAt : 0;
      const local = loadProgress();
      const localAt = typeof local.updatedAt === "number" && Number.isFinite(local.updatedAt) ? local.updatedAt : 0;
      if (serverAt <= localAt) return;
      const merged: ProgressState = { ...defaults(), ...local, ...server } as ProgressState;
      if (merged.minutesToday.date !== today()) merged.minutesToday = { date: today(), minutes: 0 };
      saveProgress(merged);
    } catch {
      // offline / chưa đăng nhập / server lỗi — bỏ qua im lặng
    }
  })();
}
