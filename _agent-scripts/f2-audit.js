// f2-audit.js — class audit cho các file của Agent F2 (reading + video).
// Chỉ soi các biểu thức className="..." và className={`...`} (kèm chuỗi con
// trong template), đối chiếu entry.css + custom css (dạng escaped như nguồn).
const fs = require("fs");
const path = require("path");

const files = [
  "src/app/luyen-dich-thuat/page.tsx",
  "src/app/luyen-dich-thuat/[bai]/page.tsx",
  "src/app/video/page.tsx",
  "src/app/video/[bai]/page.tsx",
  "src/components/sites/aioenglish/reading/ReadingHub.tsx",
  "src/components/sites/aioenglish/reading/ArticleReader.tsx",
  "src/components/sites/aioenglish/video/VideoHub.tsx",
  "src/components/sites/aioenglish/video/VideoWorkspace.tsx",
];

const used = new Set();
for (const f of files) {
  const src = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
  const chunks = [];
  for (const m of src.matchAll(/className="([^"]+)"/g)) chunks.push(m[1]);
  for (const m of src.matchAll(/className=\{`([^`]+)`\}/g)) {
    // template literal: giữ token tĩnh + chuỗi con trong ${... ? "x" : "y"}
    chunks.push(m[1].replace(/\$\{[^}]*\}/g, " "));
    for (const q of m[1].matchAll(/"([^"]*)"/g)) chunks.push(q[1]);
  }
  for (const chunk of chunks) {
    for (let c of chunk.split(/\s+/)) {
      c = c.replace(/["'`{}]/g, "");
      if (!c || c.startsWith("lp-") || c.includes("$") || c.length < 2) continue;
      if (/[^a-zA-Z0-9_-]/.test(c)) continue; // artifact
      used.add(c);
    }
  }
}

let css = "";
for (const d of ["src/styles/source", "src/styles/custom"]) {
  for (const f of fs.readdirSync(path.join(__dirname, "..", d))) {
    if (f.endsWith(".css")) css += fs.readFileSync(path.join(__dirname, "..", d, f), "utf8");
  }
}

function available(cls) {
  if (css.includes("." + cls)) return true;
  const escaped = cls.replace(/([.:!\/\[\]()$%])/g, "\\$1");
  if (css.includes("." + escaped)) return true;
  return false;
}

const missing = [...used].sort().filter((c) => !available(c));
console.log("files:", files.length, "| classes used:", used.size, "| MISSING:", missing.length);
missing.forEach((m) => console.log("  ", m));
