// e3-check-bulk.js — sample 2 statements from selected bulk courses
const fs = require("fs");
const path = require("path");

const ids = process.argv.slice(2);
for (const id of ids) {
  const p = `src/lib/demo-data/go-cau/courses/course-${id}.json`;
  if (!fs.existsSync(p)) { console.log(id, "NOT FOUND"); continue; }
  const c = JSON.parse(fs.readFileSync(p, "utf8"));
  console.log("===", id, "|", c.course.title, "|", c.course.statementCount, "statements");
  for (const s of c.statements.slice(0, 2)) console.log("  -", s.text, "|", s.translation);
}
