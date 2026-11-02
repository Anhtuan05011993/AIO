// seed-test-account.js — tạo tài khoản local test@gmail.com / test trong
// data/server/db.json (hash scrypt đúng format db.ts, pass < 8 ký tự nên
// không qua được API register — seed trực tiếp là cách sạch nhất).
// CHẠY KHI DEV SERVER ĐÃ DỪNG (db.ts cache db.json trong bộ nhớ, persist()
// sẽ đè mất user seed nếu sửa file ngoài khi server đang chạy).
const fs = require("fs");
const path = require("path");
const { scryptSync, randomBytes, randomUUID } = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const DB = path.join(ROOT, "data/server/db.json");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function slugifyHandle(name) {
  // bám theo slugifyHandle của db.ts: ascii, thường, gạch nối
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "hv-aio"
  );
}

const db = JSON.parse(fs.readFileSync(DB, "utf8"));
const email = "test@gmail.com";
if (db.users.some((u) => u.email === email)) {
  console.log("Tài khoản đã tồn tại — không làm gì.");
  process.exit(0);
}
const name = "Học viên test";
let handle = slugifyHandle(name);
while (db.users.some((u) => u.handle === handle)) handle = `${handle}-${Math.floor(1000 + Math.random() * 9000)}`;

const user = {
  id: randomUUID(),
  email,
  passwordHash: hashPassword("test"),
  name,
  level: "TOEIC 550–784",
  goal: "TOEIC 785",
  accent: "uk",
  minutesPerDay: 30,
  createdAt: Date.now(),
  handle,
};
db.users.push(user);
db.progress[user.id] = {
  xp: 0,
  weeklyXp: 0,
  streakDays: 0,
  lastCheckIn: null,
  checkInDays: [],
  minutesToday: { date: new Date().toISOString().slice(0, 10), minutes: 0 },
  lessons: [],
  srs: {},
  vocabSeen: 0,
  updatedAt: 0,
};
// atomic write như db.ts: tmp + rename
const tmp = `${DB}.tmp`;
fs.writeFileSync(tmp, JSON.stringify(db));
fs.renameSync(tmp, DB);
console.log("Đã tạo:", user.email, "| pass: test | handle:", user.handle, "| id:", user.id);
