// build-reading-real.mjs — gộp mọi aio-reading-articles*.json (part + full) ở root
// + metadata từ aio-translation-probe3.json (wordCount/excerpt/level) →
// src/lib/demo-data/reading/articles-real.json (bài đọc THẬT của site).
// Bài thiếu câu/chưa xong (từ phiên chưa chạy hết) bị loại — chỉ nhận bài hoàn chỉnh.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src/lib/demo-data/reading/articles-real.json");

// ---- 1. gộp các file trích được
const raw = {};
for (const f of fs.readdirSync(ROOT).filter((x) => /^aio-reading-articles.*\.json$/.test(x)).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
  let ok = 0;
  for (const [id, a] of Object.entries(data)) {
    if (a._error || !a.sentences?.length || a.sentences.some((s) => !s.en)) continue;
    raw[id] = a;
    ok++;
  }
  console.log(`${f}: +${ok} bài hợp lệ`);
}

// ---- 2. metadata bổ sung từ probe3 (wordCount, excerpt)
let metaCount = 0;
const meta = {};
try {
  const probe = JSON.parse(fs.readFileSync(path.join(ROOT, "aio-translation-probe3.json"), "utf8"));
  for (const v of Object.values(probe.topics)) {
    for (const it of v.json?.items ?? []) meta[it.exerciseId] = it;
  }
} catch (e) {
  console.log("(probe3 không có — bỏ qua wordCount/excerpt)");
}

// ---- 3. map sang shape DemoArticle
const TOPIC_VN = {
  "du-lich": "Du lịch",
  "van-phong": "Văn phòng",
  "hop-thuyet-trinh": "Hội thuyết trình",
  "email-cong-viec": "Email công việc",
  "giao-thong": "Giao thông",
  "mua-sam": "Mua sắm",
  "nha-cua-gia-dinh": "Nhà cửa gia đình",
  "phong-van": "Phỏng vấn",
  "nha-hang-am-thuc": "Nhà hàng ẩm thực",
  "su-kien-le-hoi": "Sự kiện lễ hội",
  "y-te-suc-khoe": "Y tế sức khỏe",
  "thoi-tiet": "Thời tiết",
};

const out = [];
for (const [id, a] of Object.entries(raw)) {
  const m = meta[id] ?? {};
  const words = m.wordCount ?? a.sentences.reduce((s, x) => s + x.en.split(" ").length, 0);
  out.push({
    id,
    slug: "doc-" + id.replace(/^tex_cat_tienganh_/, "").replace(/_/g, "-"),
    title: a.title ?? m.title ?? id,
    titleVi: a.titleVi ?? m.titleVi ?? null,
    topic: TOPIC_VN[a.topic] ?? a.topic ?? "Du lịch",
    level: a.level ?? m.level ?? "A1",
    minutes: Math.max(2, Math.round(words / 110) + 1),
    intro: m.excerpt ?? (a.sentences[0]?.en ?? ""),
    wordCount: words,
    sentences: a.sentences.map((s) => ({ en: s.en, vi: s.vi, noteVi: s.noteVi ?? null, paragraph: s.paragraph ?? 0 })),
  });
}
out.sort((a, b) => (a.slug < b.slug ? -1 : 1));

// thống kê
const byTopic = {};
for (const a of out) byTopic[a.topic] = (byTopic[a.topic] || 0) + 1;
const byLevel = {};
for (const a of out) byLevel[a.level] = (byLevel[a.level] || 0) + 1;
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`articles-real.json: ${out.length} bài, ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
console.log("theo chủ đề:", JSON.stringify(byTopic));
console.log("theo level:", JSON.stringify(byLevel));
console.log("câu có chú thích:", out.reduce((s, a) => s + a.sentences.filter((x) => x.noteVi).length, 0));
