// e3-css-dump.js — dump rule blocks matching class names from a css file
const fs = require("fs");

const cssPath = process.argv[2] || "D:/Clone web/src/styles/source/entry.css";
const css = fs.readFileSync(cssPath, "utf8");

const wanted = process.argv.slice(3);
if (wanted.length === 0) {
  console.log("usage: node e3-css-dump.js <css> class1 class2 ...");
  process.exit(0);
}

for (const cls of wanted) {
  // match ".cls" followed by non-class-name char, then capture to end of rule block
  const esc = cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("\\." + esc + "(?![a-zA-Z0-9_-])", "g");
  let m;
  let n = 0;
  while ((m = re.exec(css))) {
    // walk forward to closing brace
    let i = css.indexOf("{", m.index);
    if (i === -1) break;
    // walk back to selector start
    let s = m.index;
    const braceOpen = i;
    let depth = 1;
    let j = braceOpen + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const selStart = Math.max(css.lastIndexOf("}", braceOpen) + 1, css.lastIndexOf("{", braceOpen) + 1);
    const sel = css.slice(selStart, braceOpen).trim();
    const body = css.slice(braceOpen + 1, j - 1);
    // context: preceding @media?
    const pre = css.slice(Math.max(0, selStart - 200), selStart);
    const media = /@media[^{]*\{[^{}]*$/.test(pre) ? "  [in @media]" : "";
    console.log(`--- .${cls} (#${++n}) ${media}`);
    console.log("SEL:", sel.slice(0, 220));
    console.log("BODY:", body.slice(0, 600));
    re.lastIndex = j; // continue after this rule
    if (n > 25) { console.log("  ...more"); break; }
  }
  if (n === 0) console.log(`--- .${cls}: NONE`);
}
