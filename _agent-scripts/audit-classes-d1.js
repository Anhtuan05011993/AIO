// D1 class audit — scan AppShell + dashboard + /tong-quan files, check every
// literal class against entry.css + custom css (escaped forms included).
const fs = require("fs");
const path = require("path");

const files = [
  "D:/Clone web/src/components/sites/aioenglish/app/AppShell.tsx",
  "D:/Clone web/src/components/sites/aioenglish/app/icons.tsx",
  ...fs
    .readdirSync("D:/Clone web/src/components/sites/aioenglish/app/dashboard")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => "D:/Clone web/src/components/sites/aioenglish/app/dashboard/" + f),
  "D:/Clone web/src/app/tong-quan/page.tsx",
];

const used = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((c) => { if (c && !c.startsWith("lp-")) used.add(c); });
  }
  for (const m of src.matchAll(/className=\{?`([^`]+)`/g)) {
    m[1].split(/\s+/).forEach((c) => {
      if (c && !c.startsWith("lp-") && !c.includes("$")) used.add(c);
    });
  }
  // classes referenced inside constant maps (TILE_ACCENT / accent fields)
  for (const m of src.matchAll(/"(nbx-[a-z0-9-]+)"/g)) used.add(m[1]);
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
console.log("files:", files.length, "| total used:", used.size, "| MISSING:", missing.length);
missing.forEach((m) => console.log("  ", m));
