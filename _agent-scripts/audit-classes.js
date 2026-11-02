const fs = require("fs");
const path = require("path");

// collect classes from lesson components
const compDir = "D:/Clone web/src/components/sites/aioenglish/lesson";
const pages = [
  "D:/Clone web/src/app/go-cau/lo-trinh-b1/page.tsx",
  "D:/Clone web/src/app/go-cau/lo-trinh-b1/[courseId]/page.tsx",
];
let files = fs.readdirSync(compDir).filter(f => f.endsWith(".tsx")).map(f => path.join(compDir, f)).concat(pages);

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

// load all available CSS
let css = "";
const cssDirs = [
  "D:/Clone web/src/styles/source",
  "D:/Clone web/src/styles/custom",
];
for (const d of cssDirs) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith(".css")) css += fs.readFileSync(path.join(d, f), "utf8");
  }
}

// a utility class is "available" if a selector mentions it.
// Compiled Tailwind CSS escapes special chars: . => \., : => \:, [ => \[, / => \/, % stays.
function available(cls) {
  const esc = cls.replace(/([.:!\/\[\]()$%])/g, "\\$1");
  const re = new RegExp("\\." + esc + "(?![a-zA-Z0-9_-])");
  return re.test(css);
}

const missing = [];
for (const c of [...used].sort()) {
  const skip = /^(is-|has-)/.test(c);
  if (!skip && !available(c)) missing.push(c);
}
console.log("total classes used:", used.size);
console.log("MISSING from compiled CSS (" + missing.length + "):");
missing.forEach(m => console.log("  ", m));
