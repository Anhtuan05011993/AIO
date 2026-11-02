/**
 * check-demo-lessons.js — kiểm tra DEMO_LESSONS phủ đủ catalog:
 *  - Số entry trong demoLessons.ts.
 *  - Node nào thiếu entry, entry nào thừa (không thuộc catalog).
 *  - Với 102 node mới (A2/B2/C1/C2, không map khóa): bắt buộc có examples
 *    (2-3 cặp) và intro >= 2, points >= 3.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const cat = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs/research/aioenglish/data/api-ngu-phap-catalog.json"), "utf8"),
);
const ts = fs.readFileSync(path.join(ROOT, "src/lib/demo-data/grammar/demoLessons.ts"), "utf8");

// 65 node gốc (A1 + B1) có trong demo trước khi mở rộng.
const ORIGINAL = [
  "a1-to-be", "a1-plural-nouns", "a1-articles", "a1-adjectives", "a1-to-be-negative",
  "a1-to-be-questions", "a1-demonstratives", "a1-possessive-object-pronouns", "a1-have-got",
  "a1-there-is-are", "a1-it-weather-time", "a1-sentence-pattern", "a1-present-simple",
  "a1-wh-questions", "a1-v-ing", "a1-present-third-person", "a1-adverbs-frequency",
  "a1-can-ability", "a1-can-request", "a1-imperative", "a1-prepositions", "a1-present-continuous",
  "a1-some-any-no", "a1-how-adj-adv", "a1-past-was-were", "a1-past-simple-verbs",
  "a1-be-going-to", "a1-comparative-superlative", "a1-conjunctions-clauses", "a1-past-participle",
  "b1-present-perfect", "b1-present-perfect-continuous", "b1-past-perfect", "b1-future-continuous",
  "b1-modal-ability-permission", "b1-modal-obligation", "b1-modal-ought-should",
  "b1-conditionals-1-2", "b1-third-conditional", "b1-modal-perfect", "a2-reported-speech-intro",
  "b1-to-infinitive-advanced", "b1-reported-speech", "b1-clauses-wh-as-soon-as", "a2-passive-basic",
  "b1-passive-voice", "b1-it-clauses", "b1-there-here", "a2-relative-what-where", "b1-participial",
  "b1-adjectives-ing-ed", "c2-adjective-order", "b1-tag-questions", "b1-functional-questions",
  "b2-inversion-so-neither", "b1-negatives-review", "b1-emphasis-do", "b1-pronouns-advanced",
  "b1-articles-names", "c1-determiners-quantity", "b1-adverbs-attitude", "c2-adverb-position",
  "b1-comma-splice", "b1-degree-too-so-how", "b1-comparatives-advanced",
];
const originalSet = new Set(ORIGINAL);

// Tách block của từng entry: từ đầu key đến "\n  }," tiếp theo.
const blocks = new Map();
for (const m of ts.matchAll(/^  "([a-z0-9-]+)": \{/gm)) {
  const start = m.index;
  const end = ts.indexOf("\n  },", start);
  blocks.set(m[1], ts.slice(start, end));
}

console.log("Tổng entry demoLessons:", blocks.size);
const catIds = cat.nodes.map((n) => n.id);
const missing = catIds.filter((id) => !blocks.has(id));
const extra = [...blocks.keys()].filter((id) => !catIds.includes(id));
console.log("Node thiếu entry:", missing.length ? missing.join(", ") : "NONE");
console.log("Entry thừa:", extra.length ? extra.join(", ") : "NONE");

const newIds = catIds.filter((id) => !originalSet.has(id));
const problems = [];
for (const id of newIds) {
  const b = blocks.get(id);
  if (!b) continue;
  const ex = (b.match(/\{ en: /g) || []).length;
  const introN = (b.match(/^ {6}".*",$/gm) || []).length; // dòng string của intro + points
  if (!b.includes("examples:")) problems.push(`${id}: thiếu examples`);
  else if (ex < 2 || ex > 3) problems.push(`${id}: examples=${ex}`);
  if (introN < 5) problems.push(`${id}: intro+points=${introN} dòng`);
}
console.log("Node mới:", newIds.length, "— lỗi nội dung:", problems.length ? "" : "NONE");
for (const p of problems) console.log("  -", p);
