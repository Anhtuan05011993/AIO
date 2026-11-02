// D1 helper: print the enclosing @media (if any) for every occurrence of a selector token.
const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const tokens = process.argv.slice(2);
for (const tok of tokens) {
  console.log("\n==== " + tok);
  let idx = 0;
  while ((idx = css.indexOf(tok, idx + 1)) >= 0) {
    // walk back to find nearest "{" before idx; then determine if inside @media by
    // counting braces back to depth 1 and reading the block opener
    let depth = 0;
    let j = idx;
    for (j = idx; j >= 0; j--) {
      if (css[j] === "}") depth++;
      else if (css[j] === "{") {
        if (depth === 0) break;
        depth--;
      }
    }
    let k = j;
    let d2 = 0;
    let media = "(top-level)";
    for (k = j - 1; k >= 0; k--) {
      if (css[k] === "}") d2++;
      else if (css[k] === "{") {
        if (d2 === 0) {
          const open = css.lastIndexOf("}", k - 1);
          const sel = css.slice(open + 1, k).trim().replace(/\s+/g, " ");
          if (sel.startsWith("@media") || sel.startsWith("@supports")) media = sel.slice(0, 80);
          break;
        }
        d2--;
      }
    }
    const line = css.slice(Math.max(0, css.lastIndexOf("}", idx) + 1), idx).trim().replace(/\s+/g, " ").slice(-110);
    console.log((media === "(top-level)" ? "" : "[" + media + "] ") + line);
  }
}
