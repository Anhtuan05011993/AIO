const fs = require("fs");
const path = require("path");

const bulk = "D:/Clone web/docs/research/aioenglish/data/bulk";
const out = "D:/Clone web/src/lib/demo-data/go-cau/courses";
fs.mkdirSync(out, { recursive: true });

const files = fs.readdirSync(bulk).filter(f => f.startsWith("course-") && f.endsWith(".json"));
const manifest = [];
for (const f of files) {
  const id = f.replace("course-", "").replace(".json", "");
  const j = JSON.parse(fs.readFileSync(path.join(bulk, f), "utf8"));
  if (!j.statements) continue;
  fs.writeFileSync(path.join(out, f), JSON.stringify(j));
  manifest.push({ id, title: j.course.title, slug: j.course.slug, statements: j.statements.length });
}
manifest.sort((a, b) => a.slug.localeCompare(b.slug));
fs.writeFileSync("D:/Clone web/src/lib/demo-data/go-cau/bulk-manifest.json", JSON.stringify(manifest, null, 1));
console.log("app courses:", manifest.length);
console.log("total statements:", manifest.reduce((n, m) => n + m.statements, 0));
