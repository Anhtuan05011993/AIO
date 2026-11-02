const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE = "https://aioenglish.com";
const OUT = "D:/Clone web/docs/research/aioenglish/pages";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot",
  "/go-cau",
  "/tu-vung",
  "/ngu-phap",
  "/luyen-dich-thuat",
  "/video",
  "/tu-dien",
  "/lo-trinh",
  "/phap-ly",
  "/phap-ly/dieu-khoan",
  "/phap-ly/quyen-rieng-tu",
];

const cssSet = new Set();
for (const p of pages) {
  const name = p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__");
  const out = path.join(OUT, name + ".html");
  try {
    execFileSync("curl", ["-sf", "--max-time", "60", "-o", out, BASE + p]);
    const html = fs.readFileSync(out, "utf8");
    for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) cssSet.add(m[1]);
    console.log(`OK   ${p} (${html.length} bytes)`);
  } catch (e) {
    console.log(`FAIL ${p}: ${e.status || e.message}`);
  }
}
fs.writeFileSync(path.join(OUT, "all-css-urls.txt"), [...cssSet].join("\n"));
console.log("\nCSS files referenced:");
[...cssSet].forEach(c => console.log(" ", c));
