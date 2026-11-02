const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = "D:/Clone web/docs/research/aioenglish/data/datasets";

function ghSearch(q, n = 5) {
  const out = path.join(dir, `gh2-${q.replace(/[^a-z0-9]+/gi, "_")}.json`);
  try {
    execFileSync("curl", ["-sf", "--max-time", "30", "-o", out,
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=${n}`]);
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    console.log(`\n=== "${q}" total=${j.total_count}`);
    (j.items || []).forEach(r => console.log(`  ${r.full_name} ★${r.stargazers_count} | ${(r.description || "").slice(0, 95)}`));
  } catch (e) { console.log(`"${q}" FAIL`); }
}

ghSearch("bilingual english vietnamese news corpus");
ghSearch("english vietnamese translation dataset");
ghSearch("english dictionary json ipa examples vietnamese");
ghSearch("wordnet json english dictionary");

// check open-vn-en-dict repo structure
try {
  execFileSync("curl", ["-sf", "--max-time", "30", "-o", path.join(dir, "vn-en-dict-contents.json"),
    "https://api.github.com/repos/samuraitruong/open-vn-en-dict/contents/"]);
  const j = JSON.parse(fs.readFileSync(path.join(dir, "vn-en-dict-contents.json"), "utf8"));
  console.log("\nopen-vn-en-dict contents:");
  (Array.isArray(j) ? j : []).forEach(f => console.log(" ", f.type, f.name, f.size));
} catch (e) { console.log("vn-en listing FAIL"); }
