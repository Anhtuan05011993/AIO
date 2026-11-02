const fs = require("fs");
const path = require("path");

// Serve the ORIGINAL SSR HTML from the dev server as a pixel reference.
// Rewrites asset urls to locally served copies and strips scripts.

const research = "D:/Clone web/docs/research/aioenglish";
const outDir = "D:/Clone web/public/source-preview";
const cssOut = path.join(outDir, "css");
fs.mkdirSync(cssOut, { recursive: true });

// copy research css with original hashed names (paths in HTML point to /_nuxt/<name>.css)
const cssDir = path.join(research, "css");
for (const f of fs.readdirSync(cssDir)) {
  if (f.endsWith(".css")) fs.copyFileSync(path.join(cssDir, f), path.join(cssOut, f));
}

function rewrite(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/(href|src)=["']\/_nuxt\//g, '$1="/source-preview/css/')
    .replace(/(href|src)=["']\/fonts\//g, '$1="/sites/aioenglish/fonts/')
    .replace(/(href|src)=["']\/badges\//g, '$1="/sites/aioenglish/badges/')
    .replace(/(href|src)=["']\/brand\//g, '$1="/sites/aioenglish/brand/')
    .replace(/url\((['"]?)\/_nuxt\//g, "url($1/source-preview/css/")
    .replace(/url\((['"]?)\/fonts\//g, "url($1/sites/aioenglish/fonts/");
}

const pages = {
  "home.html": path.join(research, "home.html"),
  "auth__login.html": path.join(research, "pages", "auth__login.html"),
  "auth__register.html": path.join(research, "pages", "auth__register.html"),
  "go-cau.html": path.join(research, "pages", "go-cau.html"),
  "phap-ly.html": path.join(research, "pages", "phap-ly.html"),
};

for (const [name, src] of Object.entries(pages)) {
  if (!fs.existsSync(src)) { console.log("MISS", name); continue; }
  fs.writeFileSync(path.join(outDir, name), rewrite(fs.readFileSync(src, "utf8")));
  console.log("WROTE", name);
}
console.log("done — serve at /source-preview/home.html (dev server)");
