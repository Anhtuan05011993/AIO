const fs = require("fs");
const path = require("path");

const conv = "D:/Clone web/docs/research/aioenglish/converted";
const compDir = "D:/Clone web/src/components/sites/aioenglish/landing";
fs.mkdirSync(compDir, { recursive: true });

let rest = fs.readFileSync(conv + "/static-rest.jsx", "utf8");
const faq = fs.readFileSync(conv + "/faq-clean.jsx", "utf8").trim();

// replace slots with component tags
rest = rest.replace(/<div data-aio-slot="demo"><\/div>/g, "<TypingDemo />");
rest = rest.replace(/<div data-aio-slot="faq"><\/div>/g, "<LandingFaq />");
if (rest.includes("data-aio-slot")) console.log("WARNING: slot leftover:", rest.match(/<div data-aio-slot="[^"]+">[^<]*<\/div>/g));

// anchor hrefs: "#go-thu" etc stay; keep as-is.

const header = `// AUTO-CONVERTED from aioenglish.com SSR HTML (landing). Classes kept for source CSS.
import TypingDemo from "./TypingDemo";
import LandingFaq from "./LandingFaq";

export default function LandingStatic() {
  return (
    <>
${rest}
    </>
  );
}
`;
fs.writeFileSync(path.join(compDir, "LandingStatic.tsx"), header);

const faqComp = `// AUTO-CONVERTED FAQ section (native <details> accordion — no JS needed).
export default function LandingFaq() {
  return (
    <>
${faq}
    </>
  );
}
`;
fs.writeFileSync(path.join(compDir, "LandingFaq.tsx"), faqComp);
console.log("wrote LandingStatic.tsx (rest " + rest.length + " chars) and LandingFaq.tsx (faq " + faq.length + " chars)");
