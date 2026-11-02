const fs = require("fs");

let raw;
for (const p of ["D:/Clone web/aio-courses-missing-3.json", "C:/Users/anhtu/Downloads/aio-courses-missing-3.json"]) {
  try { raw = fs.readFileSync(p, "utf8"); console.log("found at:", p); break; } catch {}
}
if (!raw) { console.log("FILE NOT FOUND"); process.exit(1); }

const d = JSON.parse(raw);
const ids = Object.keys(d);
let ok = 0, fail = 0;
const okIds = [], failIds = [];
for (const [id, v] of Object.entries(d)) {
  if (v && v.statements) { ok++; okIds.push(id); }
  else { fail++; failIds.push(id + ":" + (v ? v.__error : "null")); }
}
console.log("total:", ids.length, "| ok:", ok, "| fail:", fail, failIds.length ? JSON.stringify(failIds) : "");

// integrate
const bulk = "D:/Clone web/docs/research/aioenglish/data/bulk";
const manifestPath = bulk + "/_manifest-ok.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const have = new Set(manifest.ids);
let added = 0;
for (const id of okIds) {
  if (have.has(id)) continue;
  fs.writeFileSync(`${bulk}/course-${id}.json`, JSON.stringify(d[id]));
  manifest.ids.push(id);
  have.add(id);
  added++;
}
manifest.count = manifest.ids.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log("newly saved:", added, "| manifest total:", manifest.ids.length);

// final coverage
const pack = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/api-pack-lo-trinh-b1.json", "utf8"));
const all = pack.courses.map(c => c.id);
const covered = all.filter(id => have.has(id));
console.log(`coverage: ${covered.length}/${all.length} courses`);

// rebuild app
const out = "D:/Clone web/src/lib/demo-data/go-cau/courses";
fs.mkdirSync(out, { recursive: true });
const appManifest = [];
for (const f of fs.readdirSync(bulk)) {
  if (!f.startsWith("course-") || !f.endsWith(".json")) continue;
  const id = f.replace("course-", "").replace(".json", "");
  const j = JSON.parse(fs.readFileSync(path.join(bulk, f), "utf8"));
  if (!j.statements) continue;
  fs.writeFileSync(path.join(out, f), JSON.stringify(j));
  appManifest.push({ id, title: j.course.title, slug: j.course.slug, statements: j.statements.length });
}
appManifest.sort((a, b) => a.slug.localeCompare(b.slug));
fs.writeFileSync("D:/Clone web/src/lib/demo-data/go-cau/bulk-manifest.json", JSON.stringify(appManifest, null, 1));
console.log("app courses:", appManifest.length, "| statements:", appManifest.reduce((n, m) => n + m.statements, 0));
