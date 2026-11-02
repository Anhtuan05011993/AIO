// e3-audit-classes.js — audit className used in E3 files against entry.css + custom css
const fs = require("fs");
const path = require("path");

const files = [
  "D:/Clone web/src/app/ngu-phap/page.tsx",
  "D:/Clone web/src/app/ngu-phap/[node]/page.tsx",
  ...fs
    .readdirSync("D:/Clone web/src/components/sites/aioenglish/grammar")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => path.join("D:/Clone web/src/components/sites/aioenglish/grammar", f)),
];

const used = new Map(); // class -> file
const addFragments = (file, expr) => {
  const push = (c) => {
    if (c && !c.startsWith("lp-") && !c.includes("$") && !c.includes("${")) {
      if (!used.has(c)) used.set(c, path.basename(file));
    }
  };
  for (const m of expr.matchAll(/`([^`]*)`/g)) m[1].split(/\s+/).forEach(push);
  for (const m of expr.matchAll(/"([^"]*)"/g)) m[1].split(/\s+/).forEach(push);
};

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  // className="static"
  for (const m of src.matchAll(/className="([^"]+)"/g)) addFragments(f, `"${m[1]}"`);
  // className={...} — scan balanced braces and audit string/template fragments
  let idx = 0;
  while ((idx = src.indexOf("className={", idx)) !== -1) {
    let i = idx + "className={".length - 1; // at "{"
    let depth = 0;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    addFragments(f, src.slice(idx + "className={".length - 1, i + 1));
    idx = i + 1;
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
// Classes gắn qua map động (LV_CLASS) — kiểm tra tay
for (const c of ["nbx-lv-a1", "nbx-lv-a2", "nbx-lv-b1", "nbx-lv-b2", "nbx-lv-c1", "nbx-lv-c2"]) {
  used.set(c, "(LV_CLASS map)");
}
for (const [c, file] of [...used].sort()) {
  if (/["'{}?<>]/.test(c) || c === ":" || c.length < 2) continue; // artifacts
  if (!available(c)) missing.push(`${c}   (${file})`);
}
console.log("files:", files.length, "| classes used:", used.size, "| MISSING:", missing.length);
missing.forEach((m) => console.log("  ", m));
