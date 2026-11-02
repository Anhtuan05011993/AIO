const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const needles = ["Chương", "Kiểm tra lên cấp", "nbx-chap", "nbx-lv", "lộ trình", "Lộ trình"];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const hits = needles.filter((n) => src.includes(n));
  if (hits.length) console.log(f, "=>", hits.join(" | "), `(${src.length}b)`);
}
