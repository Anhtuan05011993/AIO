// gen-reading-articles.mjs — Mục 4a: sinh 258 bài "Đọc & dịch" từ corpus 270k cặp câu
// EN–VI (Tatoeba CC-BY 2.0 FR, lấy qua repo tienhapt/generalcorpus).
// Đầu ra: src/lib/demo-data/reading/articles-generated.json
// (articles.ts ghép 8 bài tự soạn + 258 bài sinh = 266 như site thật).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TMP = path.join(ROOT, "_dict-tmp");

// ---- 1. Nạp + làm sạch câu
const en = fs.readFileSync(path.join(TMP, "corpus270.en"), "utf8").split("\n");
const vn = fs.readFileSync(path.join(TMP, "corpus270.vn"), "utf8").split("\n");

function tidy(s) {
  return s
    .trim()
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/\s'/g, "'")
    .replace(/\s+/g, " ");
}
function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
const BAD = /<>_@#=[\]{}|~^*\\]|https?:|&\w+;|\bi\.e\..*e\.g\./;

const pairs = [];
const seen = new Set();
for (let i = 0; i < en.length; i++) {
  const e = tidy(en[i]);
  const v = tidy(vn[i] || "");
  if (!e || !v || e !== v && seen.has(e.toLowerCase())) continue;
  const ew = e.split(" ");
  if (ew.length < 4 || ew.length > 22) continue;
  if (/[A-Z]{4,}/.test(e)) continue; // hết từ viết hoa loạn (viết tắt, code)
  if (BAD.test(e) || BAD.test(v)) continue;
  if (!/[a-z]/.test(e) || !/[a-zA-Zà-ỹ]/.test(v)) continue;
  seen.add(e.toLowerCase());
  pairs.push({ en: cap(e), vi: cap(v), words: ew.length });
}
console.log("clean pairs:", pairs.length);

// ---- 2. Bỏ câu theo chủ đề (keyword EN)
const TOPICS = [
  { key: "tin-tuc", topic: "Tin tức", kw: ["news","government","president","election","police","court","city hall","minister","protest","reporter","newspaper","parliament","law","officer","crime","war","peace","country","nation","public"] },
  { key: "kinh-doanh", topic: "Kinh doanh", kw: ["business","money","market","company","price","sell","buy","bank","shop","store","customer","salary","job","work","pay","cost","trade","profit","economy","employee","manager","factory","product"] },
  { key: "khoa-hoc", topic: "Khoa học", kw: ["science","scientist","water","light","energy","planet","research","experiment","study","earth","star","space","body","brain","blood","animal","plant","chemical","theory","discover","medicine","doctor","disease","cell"] },
  { key: "doi-song", topic: "Đời sống", kw: ["family","life","friend","love","home","food","mother","father","child","children","school","house","sleep","happy","health","eat","cook","dinner","morning","weekend","brother","sister","baby"] },
  { key: "van-hoa", topic: "Văn hóa", kw: ["music","art","book","film","movie","festival","language","culture","museum","painting","writer","poem","song","dance","concert","tradition","history","story","novel","guitar","piano","theater"] },
  { key: "the-thao", topic: "Thể thao", kw: ["game","team","play","win","football","sport","soccer","match","player","ball","run","race","swim","tennis","basketball","goal","score","coach","training","stadium","championship"] },
  { key: "du-lich", topic: "Du lịch", kw: ["travel","hotel","trip","flight","beach","country","visit","tourist","journey","airport","train","ticket","map","luggage","vacation","tour","city","island","mountain","sea","abroad"] },
  { key: "cong-nghe", topic: "Công nghệ", kw: ["computer","internet","phone","software","robot","machine","website","email","online","data","program","technology","digital","screen","battery","device","app","camera","network","code"] },
];
// mỗi câu chỉ vào chủ đề đầu tiên khớp để tránh trùng lặp giữa các bài
const buckets = new Map(TOPICS.map((t) => [t.key, []]));
for (const p of pairs) {
  const low = " " + p.en.toLowerCase() + " ";
  for (const t of TOPICS) {
    if (t.kw.some((k) => low.includes(" " + k + " ") || low.includes(" " + k + "s ") || low.includes(" " + k + "."))) {
      buckets.get(t.key).push(p);
      break;
    }
  }
}
for (const [k, v] of buckets) console.log(k, v.length);

// ---- 3. Chunk thành bài: 258 bài (8 tự soạn + 258 = 266)
// Câu trong bucket thiên về dài → chia băng theo độ dài để ra đủ A2/B1/B2.
const TARGET = 258;
const PER = 8;
const quota = { "tin-tuc": 33, "kinh-doanh": 33, "khoa-hoc": 32, "doi-song": 33, "van-hoa": 32, "the-thao": 32, "du-lich": 32, "cong-nghe": 31 };
const articles = [];
const used = new Set();
function lvl(avg) { return avg <= 8.5 ? "A2" : avg <= 12.5 ? "B1" : "B2"; }
function chunkTitle(chunk) {
  const t = cap(chunk[0].en.replace(/[.!?]$/, ""));
  return t.length > 70 ? t.slice(0, t.slice(0, 70).lastIndexOf(" ")) + "…" : t;
}
function makeArticle(t, n, chunk, topic) {
  const avg = chunk.reduce((s, p) => s + p.words, 0) / chunk.length;
  return {
    id: `art_gen_${t.key}_${n + 1}`,
    slug: `doc-${t.key}-${n + 1}`,
    title: chunkTitle(chunk),
    topic: topic || t.topic,
    level: lvl(avg),
    minutes: Math.max(2, Math.round(chunk.reduce((s, p) => s + p.words, 0) / 110) + 1),
    intro: chunk[0].vi,
    sentences: chunk.map((p) => ({ en: p.en, vi: p.vi })),
  };
}
for (const t of TOPICS) {
  const q = quota[t.key] || 0;
  const pool = buckets.get(t.key).filter((p) => !used.has(p.en));
  // 3 băng độ dài: ngắn (≤8) → A2, vừa (9–12) → B1, dài (>12) → B2
  const bands = [
    pool.filter((p) => p.words <= 8),
    pool.filter((p) => p.words > 8 && p.words <= 12),
    pool.filter((p) => p.words > 12),
  ];
  const want = [Math.round(q * 0.3), Math.round(q * 0.4), q - Math.round(q * 0.3) - Math.round(q * 0.4)];
  let n = 0;
  bands.forEach((band, bi) => {
    let made = 0;
    for (let i = 0; i + PER <= band.length && made < want[bi] && n < q; i += PER, made++, n++) {
      const chunk = band.slice(i, i + PER);
      chunk.forEach((p) => used.add(p.en));
      articles.push(makeArticle(t, n, chunk));
    }
  });
  // thiếu quota → bù bằng phần dư của băng dài nhất
  if (n < q) {
    const rest = bands[2].filter((p) => !used.has(p.en));
    for (let i = 0; i + PER <= rest.length && n < q; i += PER, n++) {
      const chunk = rest.slice(i, i + PER);
      chunk.forEach((p) => used.add(p.en));
      articles.push(makeArticle(t, n, chunk));
    }
  }
}
// bù còn thiếu bằng pool chưa dùng (bất kể chủ đề, ưu tiên Đời sống)
let rest = pairs.filter((p) => !used.has(p.en)).sort((a, b) => a.words - b.words);
let di = 0;
while (articles.length < TARGET && di + PER <= rest.length) {
  const chunk = rest.slice(di, di + PER);
  di += PER;
  chunk.forEach((p) => used.add(p.en));
  const avg = chunk.reduce((s, p) => s + p.words, 0) / PER;
  const title = cap(chunk[0].en.replace(/[.!?]$/, ""));
  articles.push({
    id: `art_gen_extra_${articles.length}`,
    slug: `doc-extra-${articles.length}`,
    title: title.length > 70 ? title.slice(0, title.slice(0, 70).lastIndexOf(" ")) + "…" : title,
    topic: "Đời sống",
    level: lvl(avg),
    minutes: Math.max(2, Math.round(chunk.reduce((s, p) => s + p.words, 0) / 110) + 1),
    intro: chunk[0].vi,
    sentences: chunk.map((p) => ({ en: p.en, vi: p.vi })),
  });
}
const byTopic = {};
for (const a of articles) byTopic[a.topic] = (byTopic[a.topic] || 0) + 1;
const byLvl = {};
for (const a of articles) byLvl[a.level] = (byLvl[a.level] || 0) + 1;
console.log("articles:", articles.length, JSON.stringify(byTopic), JSON.stringify(byLvl));

fs.writeFileSync(path.join(ROOT, "src/lib/demo-data/reading/articles-generated.json"), JSON.stringify(articles));
console.log("DONE -> articles-generated.json");
