// Agent C scratch: locate focus: variants and re-verify color utilities.
const fs = require("fs");
const path = require("path");
const dir = "docs/research/aioenglish/css";
const tokens = [
  "focus\\:not-sr-only", "focus\\:bg-primary", "focus\\:text-primary-fg", "focus\\:rounded-lg",
  "focus\\:left-4", "focus\\:top-4", "focus\\:z-\\[100\\]", "focus\\:px-4", "focus\\:py-2",
  ".text-fg{", ".text-primary{", ".underline{", ".py-10{", ".py-12{", ".px-4{",
];
for (const f of fs.readdirSync(dir)) {
  const css = fs.readFileSync(path.join(dir, f), "utf8");
  const hits = tokens.filter((t) => css.includes(t));
  if (hits.length) console.log(f + " => " + hits.join(", "));
}
console.log("---");
const entry = fs.readFileSync(path.join(dir, "entry.DtqCLz7R.css"), "utf8");
console.log("entry has .text-fg{:", entry.includes(".text-fg{"));
console.log("entry has .text-primary{:", entry.includes(".text-primary{"));
console.log("entry has .underline{:", entry.includes(".underline{"));
console.log("entry has .py-10{:", entry.includes(".py-10{"));
