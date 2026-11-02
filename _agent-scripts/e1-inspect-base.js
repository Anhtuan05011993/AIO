const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const rules = [];
let depth = 0, buf = "";
for (const ch of css) {
  buf += ch;
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) { rules.push(buf); buf = ""; }
  }
}
const pats = [
  /^\.nbx-blk[ ,{.:]/,
  /^\.nbx-card[ ,{.:]/,
  /\.isle/,
  /\.nbx-r-info/,
  /\.nbx-lv-a1/, /\.nbx-lv-b1/, /\.nbx-lv-c1/,
  /^\.nbx-row[ ,{.:]/,
  /\.nbx-tt/,
  /\.nbx-lvseg/,
  /\.nbx-lvls/,
  /\.nbx-chip[ ,{.:]/,
  /\.nbx-plain/,
  /\.nbx-num[ ,{.:]/,
  /\.nbx-disp/,
  /\.nbx-bh[ ,{.:]/,
  /\.nbx-btn[ ,{.:]/,
  /\.nbx-pct/,
  /\.nbx-lvbar/,
  /\.nbx-bar[ ,{.]/,
  /\.nbx-mut/,
  /\.nbx-ladder/,
  /\.nbx-done/,
  /\.nbx-on[ ,{.:]/,
  /\.nbx-gnext/,
  /\.nbx-gn-t/,
  /\.nbx-sp[ ,{.]/,
  /\.nbx-lnk/,
  /\.nbx-tile/,
  /\.nbx-f-path/,
  /\.nbx-pile/,
  /\.nbx-dots/,
  /\.nbx-tape/,
  /\.nbx-hatch/,
  /\.nbx-lvnext/,
  /\.nbx-lvn/,
  /\.nbx-lvd/,
  /\.nbx-lvs/,
  /\.nbx-lvh/,
  /\.nbx-lvg/,
  /\.nbx-steps/,
];
const out = [];
rules.forEach((r, i) => {
  const head = r.slice(0, r.indexOf("{"));
  for (const p of pats) {
    if (p.test(head) || (head.length < 200 && p.test(head.replace(/\s+/g, " ")))) { out.push(r.trim()); break; }
  }
});
fs.writeFileSync("D:/Clone web/_agent-scripts/e1-base-css.txt", out.join("\n\n"));
console.log("rules:", out.length, "bytes:", out.join("").length);
