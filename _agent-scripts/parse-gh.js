const fs = require("fs");
const dir = "D:/Clone web/docs/research/aioenglish";
function tryJson(name) {
  try { return JSON.parse(fs.readFileSync(`${dir}/${name}`, "utf8")); } catch (e) { return null; }
}
const s1 = tryJson("gh-search-1.json");
if (s1) {
  console.log("=== search 'aio-english': total =", s1.total_count);
  (s1.items || []).slice(0, 10).forEach(r => console.log(" -", r.full_name, "|", String(r.description || "").slice(0, 90)));
}
const s2 = tryJson("gh-jcodesmore-repos.json");
if (Array.isArray(s2)) {
  console.log("=== JCodesMore repos:", s2.length);
  s2.forEach(r => console.log(" -", r.full_name, "|", String(r.description || "").slice(0, 90), "| lang:", r.language, "| pushed:", r.pushed_at));
} else if (s2) {
  console.log("JCodesMore:", s2.message || JSON.stringify(s2).slice(0, 200));
}
const s3 = tryJson("gh-code-search.json");
if (s3) {
  console.log("=== code search aioenglish:", s3.total_count !== undefined ? s3.total_count : (s3.message || ""));
  (s3.items || []).slice(0, 5).forEach(r => console.log(" -", r.repository.full_name, r.path));
}
