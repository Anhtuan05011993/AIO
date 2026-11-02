// E2 — sanity: chạy đúng logic searchDictionary/popularWords trên entries.json thật
// (mirror của src/lib/demo-data/dictionary/index.ts — không import TS, chỉ dán logic)
const fs = require("fs");
const entries = JSON.parse(fs.readFileSync("D:/Clone web/src/lib/demo-data/dictionary/entries.json", "utf8"));
console.log("entries:", entries.length);

function foldVi(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function search(needle, limit = 30) {
  const q = needle.trim().toLowerCase();
  if (!q) return { items: [], total: 0 };
  const qVi = foldVi(q);
  const prefix = [], within = [], meaning = [];
  for (const e of entries) {
    const w = e.word.toLowerCase();
    if (w.startsWith(q)) prefix.push(e);
    else if (w.includes(q)) within.push(e);
    else if ((e.vi !== null && foldVi(e.vi).includes(qVi)) || (e.def !== null && foldVi(e.def).includes(qVi))) meaning.push(e);
  }
  const total = prefix.length + within.length + meaning.length;
  return { items: [...prefix, ...within, ...meaning].slice(0, limit), total };
}

for (const q of ["benefit", "comp", "xyzzy", "loi ich", "tuân theo", "a", "Improve"]) {
  const r = search(q);
  console.log(`\nq="${q}" total=${r.total} shown=${r.items.length}`);
  for (const e of r.items.slice(0, 3)) console.log(`   ${e.word} [${e.pos}|${e.level}] ipa=${e.ipa} vi=${e.vi ? e.vi.slice(0, 40) : null} ex=${e.example ? e.example.slice(0, 50) : null}`);
}

// popular pool + seeded shuffle (mulberry32)
const POOL = entries.filter((e) => e.vi !== null && e.example !== null && e.level !== null && e.level !== "TOEIC");
console.log("\npopular pool:", POOL.length);
function popular(n, seed = 20261031) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const idx = POOL.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((i) => POOL[i]);
}
console.log("popular(8):", popular(8).map((e) => `${e.word} (${e.level})`).join(", "));
console.log("popular(8) again (same seed → same list):", popular(8).map((e) => e.word).join(", ") === popular(8).map((e) => e.word).join(", "));

// key uniqueness check (React key = word + "/" + pos)
const keys = new Set(entries.map((e) => `${e.word}/${e.pos}`));
console.log("unique word/pos keys:", keys.size === entries.length);
