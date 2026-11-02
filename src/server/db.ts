// Server store — JSON file DB for the real backend (BRIEFS-4, Agent F1).
//
// data/server/db.json holds users, sessions, per-user progress, a seeded
// weekly leaderboard and a seeded activity feed. The file is created lazily
// on first access; every mutation rewrites it atomically (tmp + rename).
// Passwords use node:crypto scrypt with a per-user random salt; session
// tokens are two concatenated randomUUID()s and live for 30 days.

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

export const COOKIE_NAME = "aio_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 ngày
const SESSION_TTL_MS = SESSION_MAX_AGE_SECONDS * 1000;

export type DbUser = {
  id: string;
  email: string;
  passwordHash: string; // "<salt hex>:<hash hex>" (scrypt)
  name: string;
  level: string;
  goal: string;
  accent: "uk" | "us";
  minutesPerDay: number;
  createdAt: number;
  handle: string;
};

export type PublicUser = Omit<DbUser, "passwordHash">;

export type DbSession = {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
};

export type ServerLessonRecord = {
  courseId: string;
  mode: string; // LessonMode trên client: "default" | "listening" | "listening-speaking"
  difficulty: string; // LessonDifficulty: "basic" | "intermediate" | "advanced"
  seconds: number;
  accuracy: number; // 0-100
  xp: number;
  completedAt: number;
};

export type ServerSrsCard = {
  word: string;
  course: string;
  ease: number;
  intervalDays: number;
  dueAt: number;
  lapses: number;
  reps: number;
  lastGrade: string | null; // "again" | "hard" | "good" | "easy"
};

/** Bản progress phía server — trùng shape với ProgressState của client + updatedAt. */
export type ServerProgressState = {
  xp: number;
  weeklyXp: number;
  streakDays: number;
  lastCheckIn: string | null; // ISO date (yyyy-mm-dd)
  checkInDays: string[];
  minutesToday: { date: string; minutes: number };
  lessons: ServerLessonRecord[];
  srs: Record<string, ServerSrsCard>;
  vocabSeen: number;
  updatedAt: number;
};

export type FeedItem = {
  id: string;
  actorName: string;
  actorHandle?: string;
  kind: "lesson" | "streak";
  text: string;
  at: number;
};

export type LeaderboardRow = {
  name: string;
  weeklyXp: number;
  level: string;
  streakDays: number;
  /** Chỉ có ở hàng user thật (dùng để đánh dấu "Bạn" ở /api/xep-hang). */
  userId?: string;
};

type Db = {
  users: DbUser[];
  sessions: DbSession[];
  progress: Record<string, ServerProgressState>;
  leaderboard: LeaderboardRow[];
  feed: FeedItem[];
};

const DB_DIR = path.join(process.cwd(), "data", "server");
const DB_FILE = path.join(DB_DIR, "db.json");
const TMP_FILE = path.join(DB_DIR, "db.json.tmp");
const FEED_MAX = 100;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Seeds — leaderboard 8 học viên demo + 10 sự kiện bảng tin (tiếng Việt).
// ---------------------------------------------------------------------------

const LEADERBOARD_SEED: LeaderboardRow[] = [
  { name: "Minh Anh", weeklyXp: 2460, level: "TOEIC 785+", streakDays: 46 },
  { name: "Quang Huy", weeklyXp: 2380, level: "TOEIC 785+", streakDays: 38 },
  { name: "Thu Hà", weeklyXp: 2150, level: "IELTS 6.5", streakDays: 29 },
  { name: "Đức Anh", weeklyXp: 1890, level: "TOEIC 550–784", streakDays: 21 },
  { name: "Lan Chi", weeklyXp: 1675, level: "IELTS 5.5", streakDays: 17 },
  { name: "Bảo Nam", weeklyXp: 1520, level: "TOEIC 785+", streakDays: 12 },
  { name: "Ngọc Mai", weeklyXp: 1340, level: "Giao tiếp cơ bản", streakDays: 9 },
  { name: "Hoàng Long", weeklyXp: 1180, level: "TOEIC 550–784", streakDays: 6 },
];

function seedFeed(): FeedItem[] {
  const hour = 3600000;
  const base = Date.now();
  const items: Array<{ actorName: string; kind: FeedItem["kind"]; text: string; agoMs: number }> = [
    { actorName: "Thu Hà", kind: "lesson", text: "Thu Hà vừa hoàn thành một bài ôn từ vựng TOEIC (+12 XP).", agoMs: 0.4 * hour },
    { actorName: "Minh Anh", kind: "streak", text: "Minh Anh giữ chuỗi 46 ngày học liên tiếp.", agoMs: 2 * hour },
    { actorName: "Đức Anh", kind: "lesson", text: "Đức Anh dịch xong một bài báo chủ đề Kinh doanh.", agoMs: 5 * hour },
    { actorName: "Lan Chi", kind: "lesson", text: "Lan Chi học xong 10 từ mới hôm nay.", agoMs: 9 * hour },
    { actorName: "Quang Huy", kind: "streak", text: "Quang Huy đạt chuỗi 38 ngày học liên tiếp.", agoMs: 14 * hour },
    { actorName: "Bảo Nam", kind: "lesson", text: "Bảo Nam hoàn thành một buổi luyện nghe — nói.", agoMs: 20 * hour },
    { actorName: "Ngọc Mai", kind: "lesson", text: "Ngọc Mai ghi điểm 92% trong một bài Gõ câu.", agoMs: 26 * hour },
    { actorName: "Hoàng Long", kind: "streak", text: "Hoàng Long bắt đầu chuỗi 6 ngày học liên tiếp.", agoMs: 33 * hour },
    { actorName: "Thu Hà", kind: "lesson", text: "Thu Hà thêm 15 phút luyện Dictation & Shadowing.", agoMs: 40 * hour },
    { actorName: "Minh Anh", kind: "lesson", text: "Minh Anh hoàn thành một bài học Gõ câu (+20 XP).", agoMs: 47 * hour },
  ];
  return items.map((it) => ({
    id: randomUUID(),
    actorName: it.actorName,
    kind: it.kind,
    text: it.text,
    at: base - it.agoMs,
  }));
}

function zeroProgress(): ServerProgressState {
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

function freshDb(): Db {
  return {
    users: [],
    sessions: [],
    progress: {},
    leaderboard: LEADERBOARD_SEED.map((row) => ({ ...row })),
    feed: seedFeed(),
  };
}

// ---------------------------------------------------------------------------
// Lazy singleton + atomic persistence
// ---------------------------------------------------------------------------

let cached: Db | null = null;

function readDbFromDisk(): Db | null {
  try {
    const raw = readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Db>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {},
      leaderboard: Array.isArray(parsed.leaderboard) && parsed.leaderboard.length ? parsed.leaderboard : LEADERBOARD_SEED.map((r) => ({ ...r })),
      feed: Array.isArray(parsed.feed) ? parsed.feed : seedFeed(),
    };
  } catch {
    return null; // chưa có file hoặc JSON hỏng → seed lại
  }
}

function persist(): void {
  if (!cached) return;
  try {
    mkdirSync(DB_DIR, { recursive: true });
    writeFileSync(TMP_FILE, JSON.stringify(cached, null, 2), "utf8");
    renameSync(TMP_FILE, DB_FILE);
  } catch {
    // Không có quyền ghi đĩa — app vẫn chạy với DB trong bộ nhớ (demo).
  }
}

function getDb(): Db {
  if (!cached) {
    cached = readDbFromDisk() ?? freshDb();
    persist(); // tạo file + seed nếu chưa có
  }
  return cached;
}

// ---------------------------------------------------------------------------
// Password hashing (scrypt, per-user salt)
// ---------------------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(stored: string, password: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Users + sessions
// ---------------------------------------------------------------------------

export function toPublicUser(user: DbUser): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export function findUserByEmail(email: string): DbUser | null {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  return getDb().users.find((u) => u.email.toLowerCase() === needle) ?? null;
}

function slugifyHandle(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "hoc-vien";
}

export function createUser(input: {
  email: string;
  password: string;
  name?: string;
  level?: string;
  goal?: string;
  accent?: "uk" | "us";
  minutesPerDay?: number;
}): DbUser {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const name = (input.name ?? "").trim() || email.split("@")[0] || "Học viên AIO";
  const slug = slugifyHandle(name);
  let handle = slug;
  while (db.users.some((u) => u.handle === handle)) {
    handle = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  const user: DbUser = {
    id: randomUUID(),
    email,
    passwordHash: hashPassword(input.password),
    name,
    level: input.level ?? "Chưa rõ",
    goal: input.goal ?? "TOEIC 785",
    accent: input.accent ?? "uk",
    minutesPerDay: input.minutesPerDay ?? 30,
    createdAt: Date.now(),
    handle,
  };
  db.users.push(user);
  db.progress[user.id] = zeroProgress();
  persist();
  return user;
}

export function createSession(userId: string): DbSession {
  const db = getDb();
  const now = Date.now();
  // Dọn session hết hạn khi tạo session mới (rẻ, giữ file gọn).
  db.sessions = db.sessions.filter((s) => s.expiresAt > now);
  const session: DbSession = {
    token: `${randomUUID()}${randomUUID()}`,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  db.sessions.push(session);
  persist();
  return session;
}

export function deleteSession(token: string): void {
  const db = getDb();
  const before = db.sessions.length;
  db.sessions = db.sessions.filter((s) => s.token !== token);
  if (db.sessions.length !== before) persist();
}

export function getUserByToken(token: string | undefined | null): DbUser | null {
  if (!token) return null;
  const db = getDb();
  const session = db.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

// ---------------------------------------------------------------------------
// Progress (mirror của src/lib/store/progress.ts phía client)
// ---------------------------------------------------------------------------

export function getProgressOf(userId: string): ServerProgressState {
  const db = getDb();
  const state = db.progress[userId];
  if (!state) {
    const fresh = zeroProgress();
    db.progress[userId] = fresh;
    persist();
    return fresh;
  }
  // Đổi ngày → reset phút hôm nay (giống loadProgress phía client).
  if (state.minutesToday?.date !== today()) state.minutesToday = { date: today(), minutes: 0 };
  return state;
}

function pushFeed(db: Db, item: { actorName: string; actorHandle?: string; kind: FeedItem["kind"]; text: string }): void {
  db.feed.push({ id: randomUUID(), at: Date.now(), ...item });
  if (db.feed.length > FEED_MAX) db.feed = db.feed.slice(-FEED_MAX);
}

function userOf(db: Db, userId: string): DbUser | null {
  return db.users.find((u) => u.id === userId) ?? null;
}

export function recordLesson(
  userId: string,
  input: { courseId: string; mode: string; difficulty: string; seconds: number; accuracy: number; xp: number },
): ServerProgressState {
  const db = getDb();
  const p = getProgressOf(userId);
  const xp = Math.max(0, Math.round(input.xp || 0));
  const seconds = Math.max(0, Math.round(input.seconds || 0));
  const accuracy = Math.min(100, Math.max(0, Math.round(input.accuracy || 0)));
  p.lessons.push({ courseId: input.courseId, mode: input.mode, difficulty: input.difficulty, seconds, accuracy, xp, completedAt: Date.now() });
  p.xp += xp;
  p.weeklyXp += xp;
  const minutes = Math.max(1, Math.round(seconds / 60));
  p.minutesToday = p.minutesToday.date === today() ? { date: p.minutesToday.date, minutes: p.minutesToday.minutes + minutes } : { date: today(), minutes };
  p.updatedAt = Date.now();
  const user = userOf(db, userId);
  if (user) {
    pushFeed(db, {
      actorName: user.name,
      actorHandle: user.handle,
      kind: "lesson",
      text: `${user.name} vừa hoàn thành một bài học (+${xp} XP).`,
    });
  }
  persist();
  return p;
}

export function recordCheckIn(userId: string): ServerProgressState {
  const db = getDb();
  const p = getProgressOf(userId);
  const d = today();
  if (p.lastCheckIn === d) return p; // đã điểm danh hôm nay — không cộng gì
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  p.streakDays = p.lastCheckIn === yesterday ? p.streakDays + 1 : 1;
  p.lastCheckIn = d;
  if (!p.checkInDays.includes(d)) p.checkInDays.push(d);
  p.xp += 5;
  p.weeklyXp += 5;
  p.updatedAt = Date.now();
  const user = userOf(db, userId);
  if (user) {
    pushFeed(db, {
      actorName: user.name,
      actorHandle: user.handle,
      kind: "streak",
      text: `${user.name} giữ chuỗi ${p.streakDays} ngày học liên tiếp.`,
    });
  }
  persist();
  return p;
}

/** SM-2-lite — mirror của gradeCard() phía client. */
export function recordGrade(userId: string, input: { course: string; word: string; grade: "again" | "hard" | "good" | "easy" }): ServerProgressState {
  const db = getDb();
  const p = getProgressOf(userId);
  const key = `${input.course}:${input.word}`;
  const card: ServerSrsCard =
    p.srs[key] ?? { word: input.word, course: input.course, ease: 2.5, intervalDays: 0, dueAt: Date.now(), lapses: 0, reps: 0, lastGrade: null };
  card.reps += 1;
  card.lastGrade = input.grade;
  if (input.grade === "again") {
    card.lapses += 1;
    card.ease = Math.max(1.3, card.ease - 0.2);
    card.intervalDays = 0;
    card.dueAt = Date.now() + 10 * 60 * 1000; // 10 phút
  } else {
    const mult = input.grade === "hard" ? 1.2 : input.grade === "good" ? card.ease : card.ease + 0.15;
    card.ease = Math.min(3, card.ease + (input.grade === "easy" ? 0.1 : 0));
    card.intervalDays =
      card.intervalDays === 0 ? (input.grade === "hard" ? 1 : input.grade === "good" ? 1 : 3) : Math.round(card.intervalDays * mult);
    card.dueAt = Date.now() + card.intervalDays * 86400000;
    p.xp += input.grade === "easy" ? 3 : 2;
    p.weeklyXp += input.grade === "easy" ? 3 : 2;
  }
  p.srs[key] = card;
  if (!p.vocabSeen) p.vocabSeen = 0;
  p.updatedAt = Date.now();
  persist();
  return p;
}

// ---------------------------------------------------------------------------
// Leaderboard + feed
// ---------------------------------------------------------------------------

/** Seed 8 học viên demo + user thật, sắp theo weeklyXp giảm dần. */
export function getLeaderboardRows(): LeaderboardRow[] {
  const db = getDb();
  const realRows: LeaderboardRow[] = db.users.map((u) => {
    const p = db.progress[u.id];
    return {
      name: u.name,
      weeklyXp: p?.weeklyXp ?? 0,
      level: u.level,
      streakDays: p?.streakDays ?? 0,
      userId: u.id,
    };
  });
  return [...LEADERBOARD_SEED.map((r) => ({ ...r })), ...realRows].sort((a, b) => b.weeklyXp - a.weeklyXp);
}

export function getFeedItems(): FeedItem[] {
  const db = getDb();
  return [...db.feed].reverse().slice(0, FEED_MAX); // mới nhất trước, tối đa 100
}
