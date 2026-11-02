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
function head(r) { return r.slice(0, r.indexOf("{")); }
const out = { kv2: [], blk: [], card: [], row: [], isle: [], sp: [], rowflex: [], nbxg: [] };
for (const r of rules) {
  const h = head(r);
  if (/\b.n?bx-kv2\b/.test(h)) out.kv2.push(r.trim());
  if (/^\.nbx-blk$/.test(h.trim()) || /^:root.*\.nbx-blk$/.test(h.trim()) || h.trim() === ".nbx-blk,.nbx-g,.nbx-g>*") out.blk.push(r.trim());
  if (/^\.nbx-card$/.test(h.trim())) out.card.push(r.trim());
  if (/^\.nbx-row(,|$|\.)?.*$/.test(h) && h.length < 80) out.row.push(r.trim());
  if (/(^|[^a-z-])isle([^a-z-]|$)/.test(h) && h.length < 120) out.isle.push(r.trim());
  if (/^\.nbx-sp$/.test(h.trim())) out.sp.push(r.trim());
  if (/^\.nbx-row-flex$/.test(h.trim())) out.rowflex.push(r.trim());
  if (/^\.nbx-g(,|$)/.test(h.trim())) out.nbxg.push(r.trim());
}
for (const k of Object.keys(out)) {
  console.log("=== " + k + " (" + out[k].length + ") ===");
  for (const r of out[k].slice(0, 14)) console.log(r.slice(0, 420));
}
