// e3-find-chunk.js — search compiled chunks for class names / strings
const fs = require("fs");
const path = require("path");

const dir = "D:/Clone web/docs/research/aioenglish/chunks";
const needle = process.argv[2] || "nbx-lvls";

for (const f of fs.readdirSync(dir)) {
  const p = path.join(dir, f);
  const src = fs.readFileSync(p, "utf8");
  const hits = src.split(needle).length - 1;
  if (hits > 0) {
    console.log(f, hits, "hits,", Math.round(src.length / 1024) + "KB");
  }
}
