const fs = require("fs");
const path = require("path");
const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const needles = [
  "nbx-chap",
  "nbx-ladder",
  "nbx-lvseg",
  "Vào học",
  "vào học",
  "chặng đường",
  "mỗi ngày",
  "Bản đồ thì",
  "đang học",
  "hp-",
  "path-ready",
  "đã hoàn thành",
  "Bài tiếp theo",
  "Chưa có",
];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const hits = needles.filter((n) => src.includes(n));
  if (hits.length) console.log(f, "=>", hits.join(" | "), `(${src.length}b)`);
}
