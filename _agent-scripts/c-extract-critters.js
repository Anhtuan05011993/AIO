// Agent C scratch: extract per-feature critter SVGs from home.html.
const fs = require("fs");
const html = fs.readFileSync("docs/research/aioenglish/home.html", "utf8");
const keys = ["go-cau", "tu-vung", "ngu-phap", "doc-dich", "video", "tu-dien", "lo-trinh"];
const out = {};
for (const k of keys) {
  const marker = `data-critter data-feature="${k}"`;
  const i = html.indexOf(marker);
  if (i < 0) { console.log(k + " critter NOT FOUND"); continue; }
  // find the wrapping div start
  const divStart = html.lastIndexOf("<div", i);
  // find matching close: parse forward
  let depth = 0, j = divStart, end = -1;
  for (; j < html.length; j++) {
    if (html.startsWith("<div", j)) { depth++; j += 3; }
    else if (html.startsWith("</div>", j)) { depth--; if (depth === 0) { end = j + 6; break; } }
  }
  let div = html.slice(divStart, end);
  const svgStart = div.indexOf("<svg");
  const svgEnd = div.lastIndexOf("</svg>") + 6;
  let svg = div.slice(svgStart, svgEnd);
  // strip vue scoped attrs and the grain filter ids duplication guard
  svg = svg.replace(/\sdata-v-[a-f0-9]+=""/g, "").replace(/\sdata-v-[a-f0-9]+(?=[\s>])/g, "");
  const styleVar = (div.match(/style="([^"]*)"/) || [])[1] || "";
  out[k] = { style: styleVar, svg };
  console.log(k + ": svg len=" + svg.length + " style=" + styleVar + " opens=" + (svg.match(/<svg/g) || []).length + " closes=" + (svg.match(/<\/svg>/g) || []).length);
}
fs.writeFileSync("_agent-scripts/critters-out.json", JSON.stringify(out, null, 2));
console.log("written critters-out.json");
