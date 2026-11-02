const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const pats = [/\/api\/auth\/login/gi, /auth\/login/gi, /loginWithCredentials/gi, /loginWith/gi];
const seen = new Set();
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  for (const p of pats) {
    let m;
    while ((m = p.exec(src))) {
      const i = m.index;
      const ctx = src.slice(Math.max(0, i - 120), i + 160).replace(/\n/g, " ");
      const key = ctx.slice(0, 100);
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`${f} @${i}: ...${ctx}...`);
    }
  }
}
console.log("done");
