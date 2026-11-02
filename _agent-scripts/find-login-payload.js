const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const targets = ["DM3cPvMC.js", "BIMQwbYz.js"];
const pats = [/password[:=]/gi, /identifier/gi, /\bemail\b[^a-z]/gi];
for (const name of targets) {
  const p = path.join(dir, name);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, "utf8");
  for (const pat of pats) {
    let m, count = 0;
    while ((m = pat.exec(src)) && count < 6) {
      const i = m.index;
      const ctx = src.slice(Math.max(0, i - 100), i + 140).replace(/\n/g, " ");
      if (/login|register|auth|password/i.test(ctx)) {
        console.log(`${name} @${i}: ...${ctx}...`);
        count++;
      }
    }
  }
}
console.log("done");
