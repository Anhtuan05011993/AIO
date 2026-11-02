const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const cssDir = "D:/Clone web/docs/research/aioenglish/css";
const outRoot = "D:/Clone web/public/sites/aioenglish";
const BASE = "https://aioenglish.com";

const urls = new Set();
for (const f of fs.readdirSync(cssDir)) {
  if (!f.endsWith(".css")) continue;
  const css = fs.readFileSync(path.join(cssDir, f), "utf8");
  for (const m of css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
    let u = m[2].trim();
    if (!u || u.startsWith("data:") || u.startsWith("#")) continue;
    if (u.startsWith("./")) u = "/_nuxt/" + u.slice(2);
    if (u.startsWith("/")) urls.add(u);
  }
}
console.log("unique asset urls:", urls.size);
let ok = 0, fail = 0;
for (const u of urls) {
  const rel = u.replace(/^\/_nuxt\//, "assets/").replace(/^\//, "");
  const dest = path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    execFileSync("curl", ["-sf", "--max-time", "60", "-o", dest, BASE + u]);
    ok++;
  } catch (e) {
    fail++;
    console.log("FAIL", u);
    try { fs.unlinkSync(dest); } catch (_) {}
  }
}
console.log(`done ok=${ok} fail=${fail}`);
fs.writeFileSync("D:/Clone web/docs/research/aioenglish/css-assets-map.txt",
  [...urls].map(u => u + " -> " + u.replace(/^\/_nuxt\//, "assets/").replace(/^\//, "")).join("\n"));
