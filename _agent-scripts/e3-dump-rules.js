// e3-dump-rules.js — dump full rule blocks (selector + body) for given classes
const fs = require("fs");

const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const classes = process.argv.slice(2);

// split top-level rules incl. @media blocks
const rules = [];
let depth = 0;
let buf = "";
let media = null;
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  buf += ch;
  if (ch === "{") {
    depth++;
    if (depth === 2 && media === null && buf.trim().startsWith("@media")) {
      media = buf.trim();
      buf = "";
    }
  } else if (ch === "}") {
    depth--;
    if (depth === 0 && media) { media = null; buf = ""; continue; }
    if (depth === 0) { rules.push({ media: null, text: buf }); buf = ""; }
    if (depth === 1 && media) { rules.push({ media, text: buf }); buf = ""; }
  }
}

for (const cls of classes) {
  const esc = cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("\\." + esc + "(?![a-zA-Z0-9_-])");
  let n = 0;
  for (const r of rules) {
    const m = re.exec(r.text);
    if (!m) continue;
    re.lastIndex = 0;
    n++;
    console.log(`\n### .${cls} #${n}${r.media ? "  [" + r.media.slice(0, 80) + "]" : ""}`);
    console.log(r.text.trim().slice(0, 700));
  }
  if (n === 0) console.log(`\n### .${cls}: NONE`);
}
