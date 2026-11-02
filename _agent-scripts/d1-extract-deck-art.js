// D1 helper: extract the 7 hda card-art SVGs from home.html into deckArt.tsx
const fs = require("fs");
const src = fs.readFileSync("D:/Clone web/docs/research/aioenglish/home.html", "utf8");

const re = /<svg class="hda" data-k="([^"]+)"([\s\S]*?)<\/svg>/g;
const ATTRS = [
  "viewBox",
  "preserveAspectRatio",
  "color-interpolation-filters",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "fill-opacity",
  "stroke-opacity",
  "flood-color",
  "clip-rule",
  "fill-rule",
];

function convert(block) {
  let out = block;
  // strip Vue hydration attrs + HTML comments (SSR artifacts)
  out = out.replace(/\s*data-v-[0-9a-f]+\s*(?=[a-z-]+=|>|\/>)/gi, " ");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  // lowercase attrs -> camelCase (case-insensitive)
  for (const a of ATTRS) {
    const camel = a.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const lower = a.toLowerCase();
    out = out.replace(new RegExp("\\b" + lower + "=", "g"), camel + "=");
    if (a !== lower) out = out.replace(new RegExp("\\b" + a + "=", "g"), camel + "=");
  }
  out = out.split('class="').join('className="');
  // tidy: collapse whitespace between tags
  out = out.replace(/>\s+</g, "><");
  return out;
}

const found = {};
let m;
while ((m = re.exec(src))) {
  found[m[1]] = convert(m[0]);
}
const keys = Object.keys(found);
console.log("found data-k:", keys.join(", "));

let out = `/**
 * deckArt.tsx — minh hoạ 7 card "Hôm nay học gì?" (hệ .hda của nguồn).
 * SVG lấy NGUYÊN VĂN từ docs/research/aioenglish/home.html (markup SSR,
 * <svg class="hda" data-k="...">); chỉ đổi class -> className, camelCase thuộc
 * tính svg, bỏ comment/data-v-* của SSR. Màu vẽ qua biến --hda-* theo data-k
 * (entry.css + landing.css — class .hda không scoped nên dùng lại nguyên xi).
 */
import type { ReactElement } from "react";

export const DECK_ART: Record<string, ReactElement> = {
`;

for (const k of keys) {
  out += `  "${k}": (\n    ${found[k]}\n  ),\n`;
}
out += `};

export function DeckArt({ k }: { k: string }): ReactElement | null {
  return DECK_ART[k] ?? null;
}
`;

fs.writeFileSync("D:/Clone web/src/components/sites/aioenglish/app/dashboard/deckArt.tsx", out);
console.log("written deckArt.tsx, bytes:", out.length);
const ids = [...out.matchAll(/id="(hda-[^"]+)"/g)].map((x) => x[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
console.log("filter ids:", ids.length, "duplicates:", dup.length ? dup : "none");
const bad = out.match(/viewbox|preserveaspectratio|data-v-|<!--/) || null;
console.log("leftovers:", bad ? bad.slice(0, 5) : "none");
