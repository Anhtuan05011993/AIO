// E2 — peek CSS rules for given class names in entry.css (exact selector match)
const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");

// split top-level rules (no @media nesting awareness needed if I strip @media wrappers' inner rules via regex scan of selectors)
const names = process.argv.slice(2);
for (const name of names) {
  const re = new RegExp("\\." + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![a-zA-Z0-9_-])[^{}]*\\{[^{}]*\\}", "g");
  const ms = css.match(re);
  if (ms && ms.length) {
    console.log(ms.slice(0, 4).join("\n"));
    console.log("---");
  } else {
    console.log("// " + name + " NOT FOUND");
    console.log("---");
  }
}
