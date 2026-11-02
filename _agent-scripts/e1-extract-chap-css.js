const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const keys = ["nbx-chap", "nbx-chaps", "nbx-chaplist", "nbx-lvseg", "nbx-ladder", "nbx-lvk", "nbx-lvp", "nbx-lvn", "nbx-lvh", "nbx-lvg", "nbx-lvd", "nbx-lvnext", "nbx-lvpick", "nbx-lvs", "nbx-lvbar", "nbx-mark", "nbx-road", "nbx-hatch", "nbx-dayline", "nbx-plan", "nbx-stamp", "nbx-pile", "nbx-dots"];
// crude split of css into rules
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
  if (keys.some((k) => r.includes(k))) out.push(r.trim());
}
fs.writeFileSync("D:/Clone web/_agent-scripts/e1-chap-css.txt", out.join("\n\n"));
console.log("rules:", out.length, "bytes:", out.join("").length);
