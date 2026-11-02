const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const set = new Set();
for (const m of css.matchAll(/\.((?:nbx|nbc|nb|lp|hck|hm|path|pth)-[a-z0-9_-]+)/g)) set.add(m[1]);
const arr = [...set].sort();
fs.writeFileSync("D:/Clone web/_agent-scripts/e1-nbx-classes.txt", arr.join("\n"));
console.log("total", arr.length);
