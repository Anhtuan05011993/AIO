const fs = require("fs");
const path = require("path");

const compDir = "D:/Clone web/src/components/sites/aioenglish/lesson";
const pages = [
  "D:/Clone web/src/app/go-cau/lo-trinh-b1/page.tsx",
  "D:/Clone web/src/app/go-cau/lo-trinh-b1/[courseId]/page.tsx",
];
const files = fs.readdirSync(compDir).filter(f => f.endsWith(".tsx")).map(f => path.join(compDir, f)).concat(pages);

const used = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach(c => { if (c && !c.startsWith("lp-")) used.add(c); });
  }
  for (const m of src.matchAll(/className=\{?`([^`]+)`/g)) {
    m[1].split(/\s+/).forEach(c => { if (c && !c.startsWith("lp-") && !c.includes("$")) used.add(c); });
  }
}

let css = "";
for (const d of ["D:/Clone web/src/styles/source", "D:/Clone web/src/styles/custom"]) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith(".css")) css += fs.readFileSync(path.join(d, f), "utf8");
  }
}

function available(cls) {
  if (css.includes("." + cls)) return true; // plain
  const escaped = cls.replace(/([.:!\/\[\]()$%])/g, "\\$1"); // literal backslash forms
  if (css.includes("." + escaped)) return true;
  return false;
}

const missing = [];
for (const c of [...used].sort()) {
  if (/["'{}?]/.test(c) || c === ":" || c.length < 2) continue; // artifacts
  if (!available(c)) missing.push(c);
}
console.log("total used:", used.size, "| MISSING:", missing.length);
missing.forEach(m => console.log("  ", m));
