// Agent C scratch: inspect shapes of the 4 API JSON research files.
const fs = require("fs");
const dir = "docs/research/aioenglish/data/";
const files = [
  "api-course-crs_b60adbaa933635b8d0.json",
  "api-tu-vung-oxford-3000.json",
  "api-ngu-phap-catalog.json",
  "api-path.json",
];

function describe(val, depth, maxDepth, path) {
  const pad = "  ".repeat(depth);
  if (Array.isArray(val)) {
    console.log(pad + path + ": Array[" + val.length + "]");
    if (val.length && depth < maxDepth) describe(val[0], depth + 1, maxDepth, "[0]");
    return;
  }
  if (val && typeof val === "object") {
    console.log(pad + path + ": Object{" + Object.keys(val).join(", ") + "}");
    if (depth < maxDepth) {
      for (const k of Object.keys(val).slice(0, 14)) {
        describe(val[k], depth + 1, maxDepth, k);
      }
    }
    return;
  }
  const t = typeof val;
  const preview = t === "string" ? JSON.stringify(val.length > 60 ? val.slice(0, 60) + "…" : val) : String(val);
  console.log(pad + path + ": " + t + " = " + preview);
}

for (const f of files) {
  const raw = fs.readFileSync(dir + f, "utf8");
  console.log("==== " + f + " (bytes=" + raw.length + ") ====");
  const json = JSON.parse(raw);
  describe(json, 0, 3, "root");
  console.log();
}
