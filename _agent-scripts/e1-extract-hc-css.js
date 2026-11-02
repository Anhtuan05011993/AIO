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
const out = [];
for (const r of rules) {
  if (r.includes(".nbx-hc") || r.includes(".nbx-hb")) out.push(r.trim());
}
fs.writeFileSync("D:/Clone web/_agent-scripts/e1-hc-css.txt", out.join("\n\n"));
console.log("rules:", out.length, "bytes:", out.join("").length);
