const fs = require("fs");
const path = require("path");

const out = "D:/Clone web/src/lib/demo-data/vocab";
fs.mkdirSync(out, { recursive: true });

// --- TOEIC 600 (repo: tranngocminhhieu/toeic-600-words-dataset, wordlist công khai từ tienganhtflat.com) ---
const csv = fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/datasets/toeic-600/toeic-600-words-dataset-main/data/toeic_600_words.csv", "utf8");
const lines = csv.split(/\r?\n/).filter(l => l.trim());
function parseCsvLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
const header = parseCsvLine(lines[0]).map(h => h.replace(/^\uFEFF/, "").trim());
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const words = [];
for (let i = 1; i < lines.length; i++) {
  const c = parseCsvLine(lines[i]);
  if (!c[idx.english]) continue;
  words.push({
    word: c[idx.english].trim(),
    pos: (c[idx.type] || "").trim(),
    vi: (c[idx.vietnamese] || "").trim(),
    ipa: (c[idx.pronounce] || "").trim(),
    explain: (c[idx.explain] || "").trim(),
    example: (c[idx.example] || "").trim(),
    exampleVi: (c[idx.example_vietnamese] || "").trim(),
    topic: (c[idx.topic] || "").trim(),
    audio: (c[idx.audio_url] || "").trim(),
  });
}
fs.writeFileSync(path.join(out, "toeic-600.json"), JSON.stringify(words, null, 1));
console.log("toeic-600.json:", words.length, "words");

// --- Oxford 3000 · B1 (repo: tyypgzl/Oxford-5000-words, wordlist công khai Oxford) ---
const full = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/datasets/oxford-5000-full-word.json", "utf8"));
const b1 = [];
for (const item of full) {
  const v = item.value || item;
  if (String(v.level).toUpperCase() === "B1" && v.word) {
    b1.push({ word: v.word, pos: v.type || "", level: "B1" });
  }
}
fs.writeFileSync(path.join(out, "oxford-3000-b1.json"), JSON.stringify(b1, null, 1));
console.log("oxford-3000-b1.json:", b1.length, "words");
