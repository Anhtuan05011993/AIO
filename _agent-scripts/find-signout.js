const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const pats = [/signout/gi, /sign-out/gi, /auth\/logout/gi];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  for (const p of pats) {
    let m;
    while ((m = p.exec(src))) {
      const i = m.index;
      console.log(`${f} @${i}: ...${src.slice(Math.max(0, i - 60), i + 80).replace(/\n/g, " ")}...`);
    }
  }
}
console.log("done");
