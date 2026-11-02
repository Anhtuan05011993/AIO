// merge-dict-vi.mjs — Mục 1: đổ nghĩa tiếng Việt từ từ điển 109k từ
// (manhminno/English-Vietnamese-Dictionary, format FreeEV @/*/* * - =)
// vào: src/lib/demo-data/dictionary/entries.json + các deck oxford-3000-*.json.
// Không đè nghĩa đã có. Chạy: node _agent-scripts/merge-dict-vi.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_TXT = path.join(ROOT, "_dict-tmp/English-Vietnamese-Dictionary-master/data/english-vietnamese.txt");
const DICT_DIR = path.join(ROOT, "src/lib/demo-data/dictionary");
const VOCAB_DIR = path.join(ROOT, "src/lib/demo-data/vocab");

// ---- 1. Parse FreeEV txt -> map: word -> { ipa, meanings[], examples[] }
const raw = fs.readFileSync(SRC_TXT, "utf8").replace(/^\uFEFF/, "");
const lines = raw.split("\n");
const dict = new Map(); // key: word lowercase
let cur = null;
function pushEntry() {
  if (!cur) return;
  const key = cur.word.toLowerCase().trim();
  if (!key) return;
  const prev = dict.get(key);
  if (prev) {
    // trùng headword: gộp nghĩa, giữ IPA đầu
    prev.meanings.push(...cur.meanings.slice(0, 4));
    prev.examples.push(...cur.examples.slice(0, 2));
  } else {
    dict.set(key, cur);
  }
}
for (const line0 of lines) {
  const line = line0.replace(/\r$/, "");
  if (line.startsWith("@")) {
    pushEntry();
    // @word /ipa/ hoặc @word
    const m = line.slice(1).match(/^(.*?)\s*(\/.+\/)?\s*$/);
    cur = { word: m[1].trim(), ipa: m[2] ? m[2].replace(/\//g, "").trim() : "", meanings: [], examples: [] };
  } else if (!cur) {
    continue;
  } else if (line.startsWith("-") && cur.meanings.length < 6) {
    const t = line.slice(1).replace(/\s+/g, " ").trim();
    if (t) cur.meanings.push(t);
  } else if (line.startsWith("=") && cur.examples.length < 3) {
    const t = line.slice(1).trim();
    const plus = t.indexOf("+");
    if (plus > 0) cur.examples.push({ en: t.slice(0, plus).trim(), vi: t.slice(plus + 1).trim() });
  }
}
pushEntry();
console.log("dict entries parsed:", dict.size);

const capVi = (arr) => arr.slice(0, 3).join("; ").slice(0, 160);

// ---- 2. entries.json: lấp vi rỗng
const entriesPath = path.join(DICT_DIR, "entries.json");
const entries = JSON.parse(fs.readFileSync(entriesPath, "utf8"));
let filled = 0, hadVi = 0, missed = 0;
for (const e of entries) {
  if (e.vi && String(e.vi).trim()) { hadVi++; continue; }
  const hit = dict.get(String(e.word).toLowerCase().trim());
  if (hit && hit.meanings.length) {
    e.vi = capVi(hit.meanings);
    if (!e.ipa && hit.ipa) e.ipa = hit.ipa;
    if (!e.example && hit.examples.length) { e.example = hit.examples[0].en.slice(0, 140); e.exampleVi = hit.examples[0].vi.slice(0, 160); }
    filled++;
  } else missed++;
}
fs.writeFileSync(entriesPath, JSON.stringify(entries));
console.log(`entries.json: ${entries.length} từ | có vi trước: ${hadVi} | lấp mới: ${filled} | vẫn thiếu: ${missed}`);

// ---- 3. Oxford decks: lấp vi / example rỗng
for (const f of ["oxford-3000-a1.json", "oxford-3000-a2.json", "oxford-3000-b1.json", "oxford-3000-b2.json"]) {
  const p = path.join(VOCAB_DIR, f);
  const cards = JSON.parse(fs.readFileSync(p, "utf8"));
  let cFill = 0, cMiss = 0, cHad = 0, exFill = 0;
  for (const card of cards) {
    if (card.vi && String(card.vi).trim()) { cHad++; continue; }
    const hit = dict.get(String(card.word).toLowerCase().trim());
    if (hit && hit.meanings.length) {
      card.vi = capVi(hit.meanings);
      if (!card.ipa && hit.ipa) card.ipa = hit.ipa;
      if (!card.example && hit.examples.length) {
        card.example = hit.examples[0].en.slice(0, 140);
        if (hit.examples[0].vi) card.exampleVi = hit.examples[0].vi.slice(0, 160);
      }
      cFill++;
    } else cMiss++;
  }
  fs.writeFileSync(p, JSON.stringify(cards));
  console.log(`${f}: ${cards.length} thẻ | có vi trước: ${cHad} | lấp: ${cFill} | thiếu: ${cMiss} | ví dụ mới: ${exFill}`);
}
console.log("DONE");
