const fs = require("fs");
for (const f of ["zs7yYscu.js", "B2Iai264.js", "D8jcsTEh.js"]) {
  const s = fs.readFileSync("D:/Clone web/docs/research/aioenglish/chunks/" + f, "utf8");
  console.log("=====", f, "=====");
  console.log(s.slice(0, 4200));
  console.log();
}
