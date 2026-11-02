const fs = require("fs");
const path = require("path");

const out = "D:/Clone web/src/lib/demo-data/vocab";
fs.mkdirSync(out, { recursive: true });

const full = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/datasets/oxford-5000-full-word.json", "utf8"));
const counts = {};
for (const level of ["A1", "A2", "B2"]) {
  const words = [];
  const seen = new Set();
  for (const item of full) {
    const v = item.value || item;
    if (String(v.level).toUpperCase() === level && v.word && !seen.has(v.word)) {
      seen.add(v.word);
      words.push({ word: v.word, pos: v.type || "", level });
    }
  }
  fs.writeFileSync(path.join(out, `oxford-3000-${level.toLowerCase()}.json`), JSON.stringify(words, null, 1));
  counts[level] = words.length;
  console.log(`oxford-3000-${level.toLowerCase()}.json:`, words.length, "words");
}
console.log(JSON.stringify(counts));
