// e3-inspect-courses.js — inspect go-cau course data for grammar mapping
const fs = require("fs");

const ids = [
  "crs_b60adbaa933635b8d0",
  "crs_d5d9f4cb9dcf760b9e",
  "crs_0008c8bbf528537cfd",
];

for (const id of ids) {
  const c = JSON.parse(fs.readFileSync(`src/lib/demo-data/go-cau/course-${id}.json`, "utf8"));
  console.log("=== ", id, c.course.title, "| pack:", c.course.packSlug, "| statements:", c.course.statementCount);
  const st = c.statements;
  // collect grammar tags
  const tags = new Map();
  for (const s of st) {
    for (const t of s.learningUnits) {
      for (const g of t.grammarTags ?? []) {
        tags.set(g, (tags.get(g) || 0) + 1);
      }
    }
  }
  console.log("  grammarTags:", [...tags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20));
  console.log("  sample statements:");
  for (const s of st.slice(0, 3)) {
    console.log("   -", s.text, "|", s.translation);
  }
  console.log("  unitTexts (first 8):", [...new Set(st.map((s) => s.learningUnits.map((u) => u.unitText).join(" + ")))].slice(0, 8));
}
