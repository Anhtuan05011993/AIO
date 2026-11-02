// E2 — class audit cho các file thuộc ownership của Agent E2
// (theo mẫu _agent-scripts/audit-classes2.js): mọi class non-lp-* phải tồn tại
// trong entry.css / custom css (kể cả dạng escaped).
const fs = require("fs");
const path = require("path");

const files = [
  "D:/Clone web/src/app/tu-dien/page.tsx",
  "D:/Clone web/src/components/sites/aioenglish/dictionary/DictionarySearch.tsx",
  "D:/Clone web/src/styles/custom/dictionary.css",
];

const used = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((c) => { if (c && !c.startsWith("lp-")) used.add(c); });
  }
  for (const m of src.matchAll(/className=\{?`([^`]+)`/g)) {
    m[1].split(/\s+/).forEach((c) => { if (c && !c.startsWith("lp-") && !c.includes("$")) used.add(c); });
  }
  // lp-* classes defined in my own css — they're audited against the css itself below
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
console.log("files scanned:", files.length);
console.log("total used (non-lp-*):", used.size, "| MISSING:", missing.length);
missing.forEach((m) => console.log("  MISSING:", m));

// also verify my lp-* classes referenced in tsx exist in dictionary.css
const dictCss = fs.readFileSync("D:/Clone web/src/styles/custom/dictionary.css", "utf8");
const lpUsed = new Set();
for (const f of files.filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/className=\{?"?([^"}`]+)"?/g)) {
    m[1].split(/\s+/).forEach((c) => { if (c.startsWith("lp-d-")) lpUsed.add(c); });
  }
}
const lpMissing = [...lpUsed].filter((c) => !dictCss.includes("." + c));
console.log("lp-* used:", [...lpUsed].sort().join(" "));
console.log("lp-* missing in dictionary.css:", lpMissing.length ? lpMissing.join(" ") : "none");
