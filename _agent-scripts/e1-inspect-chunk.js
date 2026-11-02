const fs = require("fs");
const src = fs.readFileSync("D:/Clone web/docs/research/aioenglish/chunks/C_zBInCv.js", "utf8");
const needles = ["Chương", "Kiểm tra lên cấp", "nbx-chap", "nbx-lvbar", "nbx-lvseg", "nbx-ladder"];
for (const n of needles) {
  let i = -1;
  console.log("=== " + n + " ===");
  while ((i = src.indexOf(n, i + 1)) !== -1) {
    const a = Math.max(0, i - 300);
    console.log("@" + i + ": " + src.slice(a, i + 300).replace(/\n/g, "\\n"));
    console.log("---");
    if (i > 0) break; // first occurrence context only per needle
  }
}
