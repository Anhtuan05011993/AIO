const fs = require("fs");
const { execFileSync } = require("child_process");
const dir = "D:/Clone web/docs/research/aioenglish/data";

const queries = [
  "oxford+3000",
  "oxford+3000+vietnamese",
  "english+vietnamese+sentences",
  "tatoeba+english+vietnamese",
  "toeic+vocabulary",
  "english+learning+app+nextjs",
];

for (const q of queries) {
  const out = `${dir}/gh-repo-search-${q.replace(/\+/g, "_")}.json`;
  try {
    execFileSync("curl", ["-sf", "--max-time", "30", `-o`, out,
      `https://api.github.com/search/repositories?q=${q}&sort=stars&per_page=8`]);
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    console.log(`\n=== "${q}" — total ${j.total_count}`);
    (j.items || []).forEach(r =>
      console.log(`  ${r.full_name} ★${r.stargazers_count} | ${(r.description || "").slice(0, 100)}`));
  } catch (e) {
    console.log(`\n=== "${q}" FAILED: ${e.message}`);
  }
}
