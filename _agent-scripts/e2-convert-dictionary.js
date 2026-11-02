// E2 — convert Oxford 5000 full-word.json + TOEIC-600 CSV (+ CEFR-vocab EN defs)
// into src/lib/demo-data/dictionary/entries.json
//
// Source decision (documented in src/lib/demo-data/dictionary/index.ts too):
// 1) open-vn-en-dict goodWords.json -> { word: 1 } bare map, no IPA/type/meaning/example -> UNUSABLE
// 2) open-vn-en-dict words.json     -> { word: 1 } bare map, same -> UNUSABLE
// 3) FALLBACK (per BRIEFS-3): Oxford 5000 full-word.json (word/type/level/phonetics/examples)
//    + Vietnamese meanings & example translations from TOEIC-600 dataset CSV
//    + short EN definitions matched from cefr-vocabulary-dataset en-A1..C1 (enrichment)
const fs = require("fs");
const path = require("path");

const DS = "D:/Clone web/docs/research/aioenglish/data/datasets";
const OUT_DIR = "D:/Clone web/src/lib/demo-data/dictionary";
const TMP = "D:/Clone web/_agent-scripts/tmp-dict";

// ---------- TOEIC-600 CSV (RFC-4180) ----------
function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inQ) {
      if (c === '"') {
        if (raw[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; if (row.some((x) => x !== "")) rows.push(row); row = []; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((x) => x !== "")) rows.push(row); }
  return rows;
}

const TOEIC_POS = {
  "n.": "noun", "v.": "verb", "adj.": "adjective", "adv.": "adverb",
  "prep.": "preposition", "perp.": "preposition", // "perp." là typo trong CSV gốc
  "conj.": "conjunction", "pron.": "pronoun",
  "phr.": "phrase", "phr. v.": "phrasal verb", "phr.v.": "phrasal verb",
  "n.ph.": "noun phrase", "idm.": "idiom", "abbr.": "abbreviation",
  "n,v.": "noun, verb", "n, v.": "noun, verb", "v, n.": "verb, noun",
};

const toeicCsv = fs.readFileSync(
  path.join(DS, "toeic-600/toeic-600-words-dataset-main/data/toeic_600_words.csv"), "utf8"
).replace(/^\uFEFF/, "");
const toeicRows = parseCsv(toeicCsv);
const toeicHeader = toeicRows[0];
const idx = Object.fromEntries(toeicHeader.map((h, i) => [h.trim(), i]));
const toeicByWord = new Map(); // lowercase word -> entry (may hold several POS; first wins per pos)
let toeicPosSeen = new Map();
for (const r of toeicRows.slice(1)) {
  const word = (r[idx.english] || "").trim();
  if (!word) continue;
  const posRaw = (r[idx.type] || "").trim();
  toeicPosSeen.set(posRaw, (toeicPosSeen.get(posRaw) || 0) + 1);
  const entry = {
    pos: TOEIC_POS[posRaw] || posRaw.replace(/\.$/, "") || "word",
    vi: (r[idx.vietnamese] || "").trim() || null,
    ipa: (r[idx.pronounce] || "").trim() || null,
    def: (r[idx.explain] || "").trim() || null,
    example: (r[idx.example] || "").trim() || null,
    exampleVi: (r[idx.example_vietnamese] || "").trim() || null,
    level: "TOEIC",
  };
  const key = word.toLowerCase();
  const prev = toeicByWord.get(key);
  if (!prev) toeicByWord.set(key, { __orig: word, list: [entry] });
  else if (!prev.list.some((p) => p.pos === entry.pos)) prev.list.push(entry);
}
console.log("toeic rows:", toeicRows.length - 1, "| distinct words:", toeicByWord.size);
console.log("toeic pos values:", [...toeicPosSeen.entries()].map(([v, c]) => `${v || "?"}(${c})`).join(" "));

// ---------- CEFR-vocab EN definitions ----------
const cefrDef = new Map();
for (const lvl of ["A1", "A2", "B1", "B2", "C1"]) {
  const fp = path.join(DS, `cefr-vocab/cefr-vocabulary-dataset-main/vocab_json/en-${lvl}.json`);
  const arr = JSON.parse(fs.readFileSync(fp, "utf8"));
  for (const it of arr) {
    const d = (it.definition_target || "").trim();
    const key = (it.lemma || "").toLowerCase();
    if (d && !cefrDef.has(key)) cefrDef.set(key, d);
  }
}
console.log("cefr defs:", cefrDef.size);

// ---------- Oxford 5000 full-word ----------
const ox = JSON.parse(fs.readFileSync(path.join(DS, "oxford-5000-full-word.json"), "utf8"));
console.log("oxford rows:", ox.length);
const cap = (s, n) => (s && s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

const entries = [];
const seen = new Map(); // key word/pos -> index
let noIpa = 0, noExample = 0;
for (const it of ox) {
  const v = it.value || {};
  const word = (v.word || "").trim();
  if (!word) continue;
  const pos = (v.type || "").trim() || "—";
  const key = word.toLowerCase() + "/" + pos.toLowerCase();
  if (seen.has(key)) continue;
  const t = toeicByWord.get(word.toLowerCase());
  const toeicEntry = t && t.list.find((x) => x.pos === pos.toLowerCase());
  const toeicAny = toeicEntry || (t ? t.list[0] : null);
  const ipa = (toeicAny && toeicAny.ipa) || (v.phonetics && (v.phonetics.uk || v.phonetics.us)) || null;
  const examples = Array.isArray(v.examples) ? v.examples.filter(Boolean) : [];
  const example = (toeicEntry && toeicEntry.example) || cap(examples[0], 150) || null;
  const def = cap((toeicEntry && toeicEntry.def) || cefrDef.get(word.toLowerCase()) || null, 200);
  if (!ipa) noIpa++;
  if (!example) noExample++;
  const e = {
    word,
    ipa,
    pos,
    level: v.level || (toeicEntry ? "TOEIC" : null),
    vi: (toeicAny && toeicAny.vi) || null,
    def,
    example,
    exampleVi: toeicEntry ? toeicEntry.exampleVi : null,
  };
  seen.set(key, entries.length);
  entries.push(e);
}
console.log("oxford deduped:", entries.length, "| no ipa:", noIpa, "| no example:", noExample);

// ---------- TOEIC-only extras ----------
let extra = 0;
for (const [key0, rec] of toeicByWord) {
  for (const t of rec.list) {
    const key = key0 + "/" + t.pos;
    if (seen.has(key)) continue;
    seen.set(key, entries.length);
    entries.push({
      word: rec.__orig,
      ipa: t.ipa,
      pos: t.pos,
      level: "TOEIC",
      vi: t.vi,
      def: cap(t.def, 200),
      example: t.example,
      exampleVi: t.exampleVi,
    });
    extra++;
  }
}
console.log("toeic-only extras:", extra, "| total:", entries.length);

// sanity: distinct pos + level
const posSet = new Map(), lvlSet = new Map();
for (const e of entries) {
  posSet.set(e.pos, (posSet.get(e.pos) || 0) + 1);
  const l = e.level || "(null)";
  lvlSet.set(l, (lvlSet.get(l) || 0) + 1);
}
console.log("pos distinct:", [...posSet.entries()].sort((a, b) => b[1] - a[1]).map(([v, c]) => `${v}(${c})`).join(" "));
console.log("levels:", [...lvlSet.entries()].sort((a, b) => b[1] - a[1]).map(([v, c]) => `${v}(${c})`).join(" "));

// sort: word asc (en), then pos
entries.sort((a, b) => {
  const w = a.word.toLowerCase().localeCompare(b.word.toLowerCase(), "en");
  return w !== 0 ? w : a.pos.localeCompare(b.pos, "en");
});

// stats
const withVi = entries.filter((e) => e.vi).length;
const withEx = entries.filter((e) => e.example).length;
const withDef = entries.filter((e) => e.def).length;
const withIpa = entries.filter((e) => e.ipa).length;
console.log(`stats: vi=${withVi} example=${withEx} def=${withDef} ipa=${withIpa} / ${entries.length}`);

// ---------- write ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const json = JSON.stringify(entries);
fs.writeFileSync(path.join(OUT_DIR, "entries.json"), json, "utf8");
console.log("written entries.json bytes:", json.length);
const top = entries.filter((e) => e.vi).slice(0, 3);
console.log("sample vi entries:", JSON.stringify(top).slice(0, 600));
