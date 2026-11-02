// D1 helper: dump CSS rule blocks from entry.css (+ custom css) for given class names.
// Usage:
//   node d1-css-dump.js nbx-rail-in nbx-main ...      -> rules whose selector contains the token
//   node d1-css-dump.js re:<regex>                    -> rules whose selector matches regex
//   node d1-css-dump.js body:<regex>                  -> rules whose BODY matches regex
const fs = require("fs");
const path = require("path");

let css = "";
for (const d of ["D:/Clone web/src/styles/source", "D:/Clone web/src/styles/custom"]) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith(".css")) css += fs.readFileSync(path.join(d, f), "utf8") + "\n";
  }
}

const args = process.argv.slice(2);
for (const arg of args) {
  console.log("\n==== " + arg);
  let selTest = null;
  let bodyTest = null;
  if (arg.startsWith("re:")) selTest = new RegExp(arg.slice(3), "i");
  else if (arg.startsWith("body:")) bodyTest = new RegExp(arg.slice(5), "i");
  else selTest = new RegExp(arg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  let count = 0;
  while ((m = re.exec(css)) && count < 70) {
    const sel = m[1].trim().replace(/\s+/g, " ");
    const body = m[2].trim().replace(/\s+/g, " ");
    const ok = bodyTest ? bodyTest.test(body) : selTest.test(sel);
    if (ok) {
      console.log(sel + " { " + body.slice(0, 420) + (body.length > 420 ? " …" : "") + " }");
      count++;
    }
  }
  if (count === 0) console.log("  (no rules)");
}
