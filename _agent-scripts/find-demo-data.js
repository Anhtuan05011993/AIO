const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const research = "D:/Clone web/docs/research/aioenglish";
const html = fs.readFileSync(research + "/home.html", "utf8");
const chunks = [...new Set([...html.matchAll(/\/_nuxt\/([A-Za-z0-9_-]+\.js)/g)].map(m => m[1]))];
console.log("chunks referenced:", chunks.length);
const dir = research + "/chunks";
fs.mkdirSync(dir, { recursive: true });

let found = false;
for (const c of chunks) {
  const p = path.join(dir, c);
  if (!fs.existsSync(p)) {
    try {
      execFileSync("curl", ["-sf", "--max-time", "40", "-o", p, "https://aioenglish.com/_nuxt/" + c]);
    } catch (e) { console.log("fetch fail", c); continue; }
  }
  const j = fs.readFileSync(p, "utf8");
  if (j.includes("blue sky") || j.includes("ble sky")) {
    console.log("FOUND in", c, j.length);
    const i = j.indexOf("blue sky");
    console.log(JSON.stringify(j.slice(Math.max(0, i - 1500), i + 2000)));
    found = true;
    break;
  }
}
if (!found) console.log("not found in any chunk");
