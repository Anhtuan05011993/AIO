const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const needles = [
  "nbx-chap",
  "chaplist",
  "lvseg",
  "lvk",
  "ladder",
  "Trạm",
  "trạm",
  "kiem-tra",
  "PathChapter",
  "PathPage",
  "path-page",
  "B1 ·",
  "lộ trình học",
  "Lộ trình học",
  "Chương 1",
  "chap",
];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const hits = needles.filter((n) => src.includes(n));
  if (hits.length) console.log(f, "=>", hits.join(" | "), `(${src.length}b)`);
}
