const fs = require("fs");
let css = "";
for (const d of ["src/styles/source", "src/styles/custom"]) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith(".css")) css += fs.readFileSync(d + "/" + f, "utf8");
  }
}
const classes = process.argv.slice(2);
function available(cls) {
  if (css.includes("." + cls)) return true;
  const escaped = cls.replace(/([.:!\/\[\]()$%&#])/g, "\\$1");
  if (css.includes("." + escaped)) return true;
  return false;
}
for (const c of classes) console.log(available(c) ? "OK   " + c : "MISS " + c);
