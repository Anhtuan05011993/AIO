const fs = require("fs");
const css = fs.readFileSync("docs/research/aioenglish/css/entry.DtqCLz7R.css", "utf8");

const varNames = [...new Set([...css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map(m => m[1]))];
console.log("total var names:", varNames.length);
console.log(varNames.slice(0, 100).join("\n"));

// theme blocks: [data-theme=...] { ... }
for (const theme of ["light", "dark"]) {
  const re = new RegExp(`[^{}]*data-theme[^{}]*=['"]?${theme}['"]?[^{}]*\\{[^{}]{0,6000}\\}`, "m");
  const m = css.match(re);
  if (m) {
    console.log(`\n===== ${theme.toUpperCase()} THEME BLOCK =====`);
    console.log(m[0].slice(0, 3500));
    break;
  }
}

// skin blocks
const skin = css.match(/[^{}]*data-skin[^{}]*\{[^{}]{0,3000}\}/);
if (skin) console.log("\n===== SKIN BLOCK (first) =====\n" + skin[0].slice(0, 2000));

// @font-face declarations
const faces = [...css.matchAll(/@font-face\s*\{[^{}]+\}/g)].map(m => m[0]);
console.log("\n===== @font-face count:", faces.length, "=====");
faces.slice(0, 12).forEach(f => {
  const fam = f.match(/font-family:\s*([^;]+);/);
  const w = f.match(/font-weight:\s*([^;]+);/);
  const src = f.match(/url\(([^)]+)\)/);
  console.log(`${fam ? fam[1].trim() : "?"} | w=${w ? w[1].trim() : "?"} | ${src ? src[1] : "?"}`);
});
