// Agent C scratch: convert critters-out.json -> TSX module (JSX-ready React nodes).
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("_agent-scripts/critters-out.json", "utf8"));

function toJsx(svg) {
  let s = svg;
  s = s.replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/style="overflow:visible;"/g, 'style={{ overflow: "visible" }}')
    .replace(/class="blink"/g, 'className="blink"')
    .replace(/\sclass="([^"]*)"/g, ' className="$1"');
  return s;
}

const keyOrder = ["go-cau", "tu-vung", "ngu-phap", "doc-dich", "video", "tu-dien", "lo-trinh"];
const exportNames = {
  "go-cau": "GoCauCritter",
  "tu-vung": "TuVungCritter",
  "ngu-phap": "NguPhapCritter",
  "doc-dich": "DocDichCritter",
  video: "VideoCritter",
  "tu-dien": "TuDienCritter",
  "lo-trinh": "LoTrinhCritter",
};

let out = `/**
 * Linh vật (critter) của từng tính năng — SVG inline lấy NGUYÊN VĂN từ markup SSR
 * của aioenglish.com (trang chủ, khối tính năng, component data-critter).
 * Chỉ đổi thuộc tính sang cú pháp JSX (strokeWidth, strokeLinecap, strokeLinejoin).
 * CSS: src/styles/source/FeatureCritter.css (.fc-wrap / .fc-peek), biến --feat-* trong entry.css.
 */
import type { ReactElement } from "react";

`;

for (const k of keyOrder) {
  const item = data[k];
  if (!item) { console.error("MISSING " + k); continue; }
  const svg = toJsx(item.svg);
  out += `export function ${exportNames[k]}(): ReactElement {\n  return (\n    ${svg}\n  );\n}\n\n`;
}

out += `export const critters: Record<string, () => ReactElement> = {
`;
for (const k of keyOrder) out += `  "${k}": ${exportNames[k]},\n`;
out += `};\n`;

fs.mkdirSync("src/components/sites/aioenglish/gate", { recursive: true });
fs.writeFileSync("src/components/sites/aioenglish/gate/critters.tsx", out);
console.log("written src/components/sites/aioenglish/gate/critters.tsx, bytes=" + out.length);
