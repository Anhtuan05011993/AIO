// F1 smoke test for src/server/db.ts — run with Node 22 type stripping.
// Exercises: lazy seed, register/login/verify, session, lesson/checkin/grade,
// leaderboard merge + feed. Deletes the db file afterwards to restore pristine state.

import { rmSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DB_FILE = path.join(process.cwd(), "data", "server", "db.json");
rmSync(DB_FILE, { force: true });

const db = await import("../src/server/db.ts");

const assert = (cond, label) => {
  if (!cond) {
    console.error("FAIL:", label);
    process.exitCode = 1;
  } else {
    console.log("ok:", label);
  }
};

// 1. Lazy init + seed (file tạo ở lần dùng đầu tiên, không phải lúc import)
assert(!existsSync(DB_FILE), "db.json not created before first use");
db.findUserByEmail("probe@x.com"); // first store call → lazy init
assert(existsSync(DB_FILE), "db.json created lazily on first use");
const raw = JSON.parse(readFileSync(DB_FILE, "utf8"));
assert(raw.leaderboard.length === 8, "leaderboard seeded with 8 rows");
assert(raw.feed.length === 10, "feed seeded with 10 events");
assert(raw.users.length === 0, "no users initially");

// 2. Register
const created = db.createUser({ email: "Test@Example.com", password: "matkhau-123", name: "An Nguyễn" });
assert(created.handle.length > 0, "handle generated");
assert(db.findUserByEmail("test@example.com") !== null, "email lowercased + findable");
assert(db.findUserByEmail("nobody@x.com") === null, "unknown email not found");
assert(db.verifyPassword(created.passwordHash, "matkhau-123"), "scrypt verify ok");
assert(!db.verifyPassword(created.passwordHash, "wrong-pass"), "scrypt rejects wrong password");

// 3. Session
const s = db.createSession(created.id);
assert(typeof s.token === "string" && s.token.length === 72, "token = 2 randomUUID (72 chars)");
assert(db.getUserByToken(s.token)?.id === created.id, "getUserByToken resolves user");
assert(db.getUserByToken("garbage") === null, "bad token rejected");
db.deleteSession(s.token);
assert(db.getUserByToken(s.token) === null, "deleteSession works");

// 4. Progress mirror
const p1 = db.recordLesson(created.id, { courseId: "go-cau-demo", mode: "default", difficulty: "basic", seconds: 300, accuracy: 90, xp: 20 });
assert(p1.xp === 20 && p1.weeklyXp === 20, "lesson adds xp + weeklyXp");
assert(p1.lessons.length === 1 && p1.minutesToday.minutes === 5, "lesson record + minutes");
const p2 = db.recordCheckIn(created.id);
assert(p2.streakDays === 1 && p2.xp === 25, "check-in streak + 5 xp");
const p2b = db.recordCheckIn(created.id);
assert(p2b.xp === 25, "second same-day check-in is a no-op");
const p3 = db.recordGrade(created.id, { course: "toeic-600", word: "diligent", grade: "good" });
assert(p3.srs["toeic-600:diligent"].intervalDays === 1, "SM-2-lite good → 1 day");
assert(p3.xp === 27, "grade good adds 2 xp");

// 5. Leaderboard + feed
const rows = db.getLeaderboardRows();
assert(rows.length === 9, "leaderboard = 8 seeds + 1 real user");
assert(rows[0].weeklyXp >= rows[rows.length - 1].weeklyXp, "sorted desc");
assert(rows.some((r) => r.userId === created.id && r.weeklyXp === 27), "real user row present");
const feed = db.getFeedItems();
assert(feed.length === 12, "feed = 10 seeds + lesson + streak events");
assert(feed[0].at >= feed[feed.length - 1].at, "feed newest first");
assert(feed.some((i) => i.actorHandle === created.handle), "feed item carries actorHandle");
assert(feed.length <= 100, "feed capped at 100");

// 6. Atomic write check: file parses after all mutations
const raw2 = JSON.parse(readFileSync(DB_FILE, "utf8"));
assert(raw2.progress[created.id].xp === 27, "progress persisted to disk");

// restore pristine state
rmSync(DB_FILE, { force: true });
console.log(process.exitCode ? "SMOKE FAILED" : "SMOKE PASSED");
