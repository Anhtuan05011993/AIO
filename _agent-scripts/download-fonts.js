const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const fontsCss = fs.readFileSync("D:/Clone web/src/styles/fonts.css", "utf8");
const files = [...new Set([...fontsCss.matchAll(/\/sites\/aioenglish\/fonts\/([^')]+\.woff2)/g)].map(m => m[1]))];
console.log("font files referenced:", files.length);
for (const f of files) {
  const dest = path.join("D:/Clone web/public/sites/aioenglish/fonts", f);
  if (fs.existsSync(dest)) { console.log("HAVE", f); continue; }
  try {
    execFileSync("curl", ["-sf", "--max-time", "60", "-o", dest, "https://aioenglish.com/fonts/" + f]);
    console.log("OK  ", f);
  } catch (e) {
    console.log("FAIL", f);
    try { fs.unlinkSync(dest); } catch (_) {}
  }
}
