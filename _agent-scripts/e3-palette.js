// e3-palette.js — find palette rules for nbx-lv-* accent classes
const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
for (const cls of ["nbx-lv-a1", "nbx-lv-a2", "nbx-lv-b1", "nbx-lv-b2", "nbx-lv-c1", "nbx-lv-c2"]) {
  let i = 0, found = 0;
  while ((i = css.indexOf("." + cls, i)) !== -1 && found < 2) {
    const o = css.indexOf("{", i);
    const e = css.indexOf("}", o);
    const selStart = css.lastIndexOf("}", o) + 1;
    const sel = css.slice(selStart, o).trim();
    const body = css.slice(o + 1, e);
    if (body.includes("--nb-x-fa")) {
      console.log("CLS " + cls);
      console.log("SEL:", sel.slice(0, 200));
      console.log("BODY:", body.slice(0, 260));
      console.log("---");
      found++;
    }
    i += cls.length;
  }
  if (!found) console.log("CLS " + cls + ": no palette rule");
}
