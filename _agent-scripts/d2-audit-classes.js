const fs = require("fs");
const path = require("path");

// Class audit for Agent D2's files (same logic as audit-classes2.js, own file list).
const compDir = "D:/Clone web/src/components/sites/aioenglish/app2";
const pages = [
  "D:/Clone web/src/app/ban-be/page.tsx",
  "D:/Clone web/src/app/cai-dat/page.tsx",
  "D:/Clone web/src/app/luyen-thi/page.tsx",
  "D:/Clone web/src/app/yeu-cau-tinh-nang/page.tsx",
  "D:/Clone web/src/app/chao-mung/page.tsx",
];
const files = fs
  .readdirSync(compDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join(compDir, f))
  .concat(pages);

const used = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((c) => {
      if (c && !c.startsWith("lp-")) used.add(c);
    });
  }
  // template literals: className={`...${cond ? " x" : ""}...`} — strip interpolations first
  for (const m of src.matchAll(/className=\{`([^`]*)`\}/g)) {
    const tpl = m[1].replace(/\$\{[^}]*\}/g, " ");
    tpl.split(/\s+/).forEach((c) => {
      if (c && !c.startsWith("lp-")) used.add(c);
    });
  }
}

let css = "";
for (const d of ["D:/Clone web/src/styles/source", "D:/Clone web/src/styles/custom"]) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith(".css")) css += fs.readFileSync(path.join(d, f), "utf8");
  }
}

function available(cls) {
  if (css.includes("." + cls)) return true;
  const escaped = cls.replace(/([.:!\/\[\]()$%&#])/g, "\\$1");
  if (css.includes("." + escaped)) return true;
  return false;
}

const missing = [];
for (const c of [...used].sort()) {
  if (/["'{}?]/.test(c) || c === ":" || c.length < 2) continue;
  if (/[.=(]/.test(c)) continue; // template-literal artifacts, never real class names
  if (!available(c)) missing.push(c);
}
console.log("files:", files.length, "| total used:", used.size, "| MISSING:", missing.length);
missing.forEach((m) => console.log("  ", m));
