const fs = require("fs");
const path = require("path");
const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");

console.log("=== LINK TAGS (stylesheet/preload/icon) ===");
for (const m of html.matchAll(/<link[^>]+>/g)) {
  const t = m[0];
  if (/stylesheet|preload|icon|manifest|font/.test(t)) console.log(t.replace(/\s+/g, " ").slice(0, 400));
}
console.log("=== SCRIPT SRCS ===");
for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) console.log(m[1]);
console.log("=== MEDIA ASSETS ===");
const seen = new Set();
for (const m of html.matchAll(/(?:src|srcset|poster)="([^"]+)"/g)) {
  const u = m[1];
  if (/^https?:/.test(u) || /\.(webp|png|jpe?g|svg|avif|mp4|webm|ico|woff2?)($|\?| )/.test(u)) {
    for (const part of u.split(",")) {
      const p = part.trim().split(/\s+/)[0];
      if (p && !seen.has(p)) { seen.add(p); console.log(p.slice(0, 250)); }
    }
  }
}
console.log("=== FONT-FAMILY DECLARATIONS (inline styles) ===");
const fams = new Set();
for (const m of html.matchAll(/font-family\s*:\s*([^;"}]+)/g)) fams.add(m[1].trim().slice(0, 120));
fams.forEach(f => console.log(f));
console.log("=== HTML SIZE ===");
console.log(html.length + " bytes");
