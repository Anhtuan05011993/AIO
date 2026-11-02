const fs = require("fs");
const html = fs.readFileSync("D:/Clone web/docs/research/aioenglish/home.html", "utf8");

// body start
const bi = html.indexOf("<body");
console.log("body tag:", html.slice(bi, html.indexOf(">", bi) + 1));

// strip scripts/styles for structure analysis
let body = html.slice(bi);
body = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");

// top-level children of body via depth walk
let depth = 0, i = 0, tops = [];
const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
let m;
while ((m = tagRe.exec(body))) {
  const close = m[1] === "/";
  const tag = m[2].toLowerCase();
  const attrs = m[3] || "";
  const selfClosed = /\/>$/.test(attrs) || ["br", "img", "input", "meta", "link", "hr", "source", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "use", "stop"].includes(tag);
  if (!close) {
    if (depth === 1) {
      const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || "";
      const id = (attrs.match(/id="([^"]*)"/) || [])[1] || "";
      const dn = (attrs.match(/data-nb-page="([^"]*)"/) || [])[1] || "";
      tops.push({ tag, cls: cls.slice(0, 80), id, dn, start: m.index });
    }
    if (!selfClosed) depth++;
  } else {
    depth--;
  }
}
console.log("\nTOP-LEVEL CHILDREN OF BODY:");
tops.slice(0, 30).forEach((t, k) => console.log(`${k}: <${t.tag}> class="${t.cls}" ${t.id ? "id=" + t.id : ""} ${t.dn ? "data-nb-page=" + t.dn : ""}`));

// find demo data for typing play state
const demoIdx = body.indexOf("go-thu");
console.log("\n=== around #go-thu demo (first 500):");
console.log(body.slice(demoIdx - 200, demoIdx + 300).replace(/\s+/g, " "));
// look for demo sentences JSON in original html (scripts included)
const scriptData = html.match(/"statements"\s*:\s*\[[\s\S]{0,200}/);
console.log("\nstatements JSON in scripts:", scriptData ? scriptData[0].slice(0, 200) : "none");
const demoSent = html.match(/blue sky[\s\S]{0,100}/);
console.log("blue sky context:", demoSent ? demoSent[0].slice(0, 150).replace(/\s+/g, " ") : "none");
