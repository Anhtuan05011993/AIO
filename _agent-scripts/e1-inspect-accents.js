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
const pats = [/^\.nbx-r-do/, /^\.nbx-r-goal/, /^\.nbx-r-heat/, /^\.nbx-r-ok/, /^\.nbx-r-soc/, /^\.nbx-r-ref/, /^\.nbx-r-peach/, /^\.nbx-r-ivory/, /\.nbx-lv-a2/, /\.nbx-lv-b2/, /\.nbx-rail-in/, /^\.nbx-main/, /\.nbx-ell/, /\.nbx-seg[ ,{.:]/, /\.nbx-next[ ,{.:]/, /\.nbx-cur[ ,{.:]/, /\.nbx-steps[ ,{.:]/, /\.nbx-dots[ ,{.:]/, /\.nbx-pile[ ,{.:]/, /\.nbx-est/, /\.nbx-tgt/];
const out = [];
for (const r of rules) {
  const head = r.slice(0, r.indexOf("{"));
  if (pats.some((p) => p.test(head))) out.push(r.trim());
}
fs.writeFileSync("D:/Clone web/_agent-scripts/e1-accent-css.txt", out.join("\n\n"));
console.log("rules:", out.length, "bytes:", out.join("").length);
