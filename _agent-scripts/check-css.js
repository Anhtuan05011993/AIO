const fs = require("fs");
const path = require("path");

const dirs = ["D:/Clone web/src/styles/custom", "D:/Clone web/src/styles/source"];
for (const d of dirs) {
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith(".css")) continue;
    const css = fs.readFileSync(path.join(d, f), "utf8");
    let stripped = css.replace(/\/\*[\s\S]*?\*\//g, " ");
    if (/\/\*/.test(stripped)) console.log(`${f}: UNTERMINATED COMMENT`);
    const braces = (stripped.match(/\{/g) || []).length - (stripped.match(/\}/g) || []).length;
    if (braces !== 0) console.log(`${f}: BRACE IMBALANCE ${braces}`);
    // find '/' outside url(...) — cssnano chokes on raw slashes in selectors/values
    const noUrls = stripped.replace(/url\([^)]*\)/g, "url(X)");
    noUrls.split("\n").forEach((line, i) => {
      const slashIdx = line.indexOf("/");
      if (slashIdx !== -1) {
        console.log(`${f}:${i + 1}: slash in: ${line.trim().slice(0, 120)}`);
      }
    });
  }
}
console.log("scan done");
