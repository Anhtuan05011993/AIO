const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = "D:/Clone web/docs/research/aioenglish/data/datasets";
fs.mkdirSync(dir, { recursive: true });

function ghSearch(q, n = 6) {
  const out = path.join(dir, `gh-${q.replace(/[^a-z0-9]+/gi, "_")}.json`);
  try {
    execFileSync("curl", ["-sf", "--max-time", "30", "-o", out,
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=${n}`]);
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    console.log(`\n=== "${q}" total=${j.total_count}`);
    (j.items || []).forEach(r => console.log(`  ${r.full_name} ★${r.stargazers_count} | ${(r.description || "").slice(0, 95)}`));
    return j.items || [];
  } catch (e) { console.log(`"${q}" FAIL`); return []; }
}

// 1) TOEIC 600 words (already known candidate) — download it
try {
  execFileSync("curl", ["-sfL", "--max-time", "60", "-o", path.join(dir, "toeic-600-dataset.zip"),
    "https://github.com/tranngocminhhieu/toeic-600-words-dataset/archive/refs/heads/main.zip"]);
  console.log("\nTOEIC-600 dataset zip: OK");
} catch (e) { console.log("\nTOEIC-600 zip FAIL"); }

// 2) broader dataset searches
ghSearch("english vietnamese dictionary json");
ghSearch("tatoeba en-vi");
ghSearch("cefr vocabulary json");
ghSearch("english grammar topics json a1");
ghSearch("english ipa dictionary json");
ghSearch("graded english sentences cefr");
