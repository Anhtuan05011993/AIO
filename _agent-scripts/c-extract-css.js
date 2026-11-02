// Agent C scratch: extract CSS rules containing any of the given tokens from a minified css file.
const fs = require("fs");
const path = require("path");
const [file, tokensArg] = process.argv.slice(2);
const tokens = tokensArg.split(",").map((s) => s.trim()).filter(Boolean);
const css = fs.readFileSync(file, "utf8");
// Split into top-level rules (handles @media blocks by keeping them whole via brace counting).
const rules = [];
let buf = "";
let depth = 0;
let inStr = null;
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  buf += ch;
  if (inStr) {
    if (ch === inStr && css[i - 1] !== "\\") inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'") inStr = ch;
  else if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) {
      rules.push(buf.trim());
      buf = "";
    }
  }
}
if (buf.trim()) rules.push(buf.trim());
for (const rule of rules) {
  if (tokens.some((t) => rule.includes(t))) {
    console.log(rule);
    console.log("--------");
  }
}
