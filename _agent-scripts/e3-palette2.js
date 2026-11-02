// e3-palette2.js — find rules that DEFINE palettes for lv classes / r-* classes
const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");

// naive top-level rule splitter
const rules = [];
let depth = 0, buf = "", media = null;
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  buf += ch;
  if (ch === "{") {
    depth++;
    if (depth === 2 && media === null && buf.trim().startsWith("@media")) { media = buf.trim(); buf = ""; }
  } else if (ch === "}") {
    depth--;
    if (depth === 0 && media) { media = null; buf = ""; continue; }
    if (depth === 0) { rules.push({ media: null, text: buf }); buf = ""; }
    if (depth === 1 && media) { rules.push({ media, text: buf }); buf = ""; }
  }
}

for (const needle of ["--nb-x-fa:var(--nb-x-ok)", "--nb-x-fa:var(--nb-x-goal)", "--nb-x-fa:var(--nb-x-do)", "--nb-x-fa:var(--nb-x-heat)", "--nb-x-fa:var(--nb-x-info)"]) {
  for (const r of rules) {
    if (r.text.includes(needle) && /nbx-lv-|nbx-r-/.test(r.text)) {
      console.log(r.text.trim().slice(0, 300));
      console.log("---");
    }
  }
}
