const fs = require("fs");
const html = fs.readFileSync("D:/Clone web/docs/research/aioenglish/home.html", "utf8");
const faces = [...html.matchAll(/@font-face\s*\{[^{}]+\}/g)].map(m => m[0]);
console.log("font faces found:", faces.length);
const fams = new Set();
for (const f of faces) {
  const fam = f.match(/font-family:\s*'([^']+)'/);
  if (fam) fams.add(fam[1]);
}
console.log("families:", [...fams].join(", "));
let css = faces.join("\n");
css = css.replace(/url\((['"]?)\/fonts\//g, "url($1/sites/aioenglish/fonts/");
fs.writeFileSync("D:/Clone web/src/styles/fonts.css", css);
console.log("wrote src/styles/fonts.css");
