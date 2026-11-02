const fs = require("fs");
const path = require("path");

const src = "D:/Clone web/docs/research/aioenglish/data";
const out = "D:/Clone web/src/lib/demo-data/go-cau";
fs.mkdirSync(out, { recursive: true });

const files = [
  ["api-pack-lo-trinh-b1.json", "pack-lo-trinh-b1.json"],
  ["api-course-crs_b60adbaa933635b8d0.json", "course-crs_b60adbaa933635b8d0.json"],
  ["api-course-crs_d5d9f4cb9dcf760b9e.json", "course-crs_d5d9f4cb9dcf760b9e.json"],
  ["api-course-crs_0008c8bbf528537cfd.json", "course-crs_0008c8bbf528537cfd.json"],
];
for (const [s, d] of files) {
  fs.copyFileSync(path.join(src, s), path.join(out, d));
  console.log("copied", d, fs.statSync(path.join(out, d)).size);
}
