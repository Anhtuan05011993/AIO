const fs = require("fs");
const path = require("path");

const research = "D:/Clone web/docs/research/aioenglish";
const html = fs.readFileSync(research + "/home.html", "utf8");

// ---- extract body inner ----
const bi = html.indexOf("<body");
const bEnd = html.indexOf(">", bi);
let body = html.slice(bEnd + 1);
const bci = body.lastIndexOf("</body>");
if (bci >= 0) body = body.slice(0, bci);

// ---- locate regions by marker, with balanced tag extraction ----
function extractRegion(src, startMarker) {
  const i = src.indexOf(startMarker);
  if (i < 0) return null;
  // walk back to the opening '<' of that tag
  const tagStart = src.lastIndexOf("<", i);
  // depth-walk to find matching close
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  tagRe.lastIndex = tagStart;
  const open = tagRe.exec(src);
  const tag = open[2];
  let depth = 1, m, end = tagStart;
  while ((m = tagRe.exec(src))) {
    if (m[2].toLowerCase() !== tag.toLowerCase()) continue;
    if (m[1] === "/") { depth--; if (depth === 0) { end = tagRe.lastIndex; break; } }
    else if (m[4] !== "/" && !/^(br|img|input|meta|link|hr|source|path|circle|rect|line|polyline|polygon|ellipse|use|stop|col|area|base|wbr)$/i.test(tag)) depth++;
  }
  return { start: tagStart, end, html: src.slice(tagStart, end) };
}

const demo = extractRegion(body, "data-hero-demo");
// FAQ section marker is the section element itself
const faq = extractRegion(body, "data-landing-faq");
console.log("demo region:", demo ? (demo.end - demo.start) + " bytes" : "MISS");
console.log("faq region:", faq ? (faq.end - faq.start) + " bytes" : "MISS");
fs.mkdirSync(research + "/converted", { recursive: true });
if (demo) fs.writeFileSync(research + "/converted/demo-region.html", demo.html);
if (faq) fs.writeFileSync(research + "/converted/faq-region.html", faq.html);

// remove those regions from body for the static remainder
let rest = body;
if (demo) rest = rest.slice(0, demo.start) + `<div data-aio-slot="demo"></div>` + rest.slice(demo.end);
// re-extract faq from modified rest
const faq2 = extractRegion(rest, "data-landing-faq");
if (faq2) rest = rest.slice(0, faq2.start) + `<div data-aio-slot="faq"></div>` + rest.slice(faq2.end);

// ---- clean ----
function clean(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // KEEP data-v-* attrs — Vue scoped CSS (.hero-pair[data-v-xxx]) depends on them.
    .replace(/\s(?:nuxt-ssr-component-uid)="[^"]*"/g, "")
    .replace(/\snuxt-ssr-component-uid=""/g, "");
}
rest = clean(rest);
const demoHtml = demo ? clean(demo.html) : "";
const faqHtml = faq2 ? clean(faq2.html) : "";
fs.writeFileSync(research + "/converted/demo-clean.html", demoHtml);
fs.writeFileSync(research + "/converted/faq-clean.html", faqHtml);
fs.writeFileSync(research + "/converted/static-rest.html", rest);
console.log("clean sizes — rest:", rest.length, "demo:", demoHtml.length, "faq:", faqHtml.length);

// ---- HTML -> JSX conversion ----
const svgCamel = {
  "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit", "stroke-opacity": "strokeOpacity",
  "fill-rule": "fillRule", "fill-opacity": "fillOpacity", "clip-rule": "clipRule", "clip-path": "clipPath",
  "stop-color": "stopColor", "stop-opacity": "stopOpacity", "font-family": "fontFamily", "font-size": "fontSize",
  "font-weight": "fontWeight", "text-anchor": "textAnchor", "vector-effect": "vectorEffect",
  "gradient-transform": "gradientTransform", "gradient-units": "gradientUnits", "spread-method": "spreadMethod",
  "pattern-units": "patternUnits", "pattern-content-units": "patternContentUnits", "marker-width": "markerWidth",
  "marker-height": "markerHeight", "ref-x": "refX", "ref-y": "refY", "view-box": "viewBox",
  "stroke-linejoinmiter": "strokeLinejoin",
};
const htmlCamel = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength",
  minlength: "minLength", autocomplete: "autoComplete", srcset: "srcSet", colspan: "colSpan", rowspan: "rowSpan",
  cellpadding: "cellPadding", cellspacing: "cellSpacing", contenteditable: "contentEditable", spellcheck: "spellCheck",
  accesskey: "accessKey", allowfullscreen: "allowFullScreen", autoplay: "autoPlay", colspan2: "colSpan",
  datetime: "dateTime", enctype: "encType", formaction: "formAction", novalidate: "noValidate",
  playsinline: "playsInline", poster: "poster", crossorigin: "crossOrigin", referrerpolicy: "referrerPolicy",
  fetchpriority: "fetchPriority", enterkeyhint: "enterKeyHint", inputmode: "inputMode", nonce: "nonce",
};

function convertStyle(v) {
  // style="color: red; margin-top: 4px" -> {{ color: "red", marginTop: "4px" }}
  const parts = v.split(";").map(s => s.trim()).filter(Boolean);
  const items = [];
  for (const p of parts) {
    const ci = p.indexOf(":");
    if (ci < 0) continue;
    let prop = p.slice(0, ci).trim();
    const val = p.slice(ci + 1).trim().replace(/"/g, '\\"');
    if (/^-/.test(prop)) continue; // skip vendor custom props in style attr (kept via classes)
    prop = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    items.push(`${prop}: "${val}"`);
  }
  return `style={{ ${items.join(", ")} }}`;
}

function convertAttrs(attrs) {
  let out = "";
  const re = /([a-zA-Z@:._-][a-zA-Z0-9@:._-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(attrs))) {
    let name = m[1];
    const val = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : "";
    if (/^(v-|@|:|nuxt-|aria-owns$)/.test(name)) continue;
    if (name === "is" || name.startsWith("nuxt")) continue;
    const lower = name.toLowerCase();
    if (lower === "style") { out += ` ${convertStyle(val)}`; continue; }
    let jname = svgCamel[lower] || htmlCamel[lower] || lower;
    if (/^aria-|^data-/.test(jname)) { out += ` ${jname}="${val}"`; continue; }
    if (val === "" && !["value", "alt", "title", "placeholder", "label", "href", "src", "id", "type", "name"].includes(jname)) {
      out += ` ${jname}={true}`; // bare boolean-ish attrs
      continue;
    }
    out += ` ${jname}="${val}"`;
  }
  return out;
}

const voidTags = /^(br|img|input|meta|link|hr|source|area|base|col|embed|track|wbr)$/i;
const svgSelf = /^(path|circle|rect|line|polyline|polygon|ellipse|use|stop|animate|animatetransform|set|feturbulence|fegaussianblur|feoffset|feblend|fecolormatrix|fecomposite|feflood|femerge|femergenode|fecomponenttransfer|fefuncr|fefuncg|fefuncb|fefunca|linearGradient|radialGradient|filter|mask|clipPath)$/i;

function toJsx(htmlSrc) {
  let s = htmlSrc;
  // tokenize tags
  let out = "";
  let pos = 0;
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  // text buffer: escape braces
  const escText = (t) => t.replace(/{/g, "&lbrace;").replace(/}/g, "&rbrace;");
  let m;
  while ((m = tagRe.exec(s))) {
    const before = s.slice(pos, m.index);
    out += escText(before);
    const [full, slash, tagRaw, attrs, selfSlash] = m;
    const tag = tagRaw;
    const lower = tag.toLowerCase();
    if (slash === "/") { out += `</${tag}>`; pos = tagRe.lastIndex; continue; }
    const a = convertAttrs(attrs);
    const isVoid = voidTags.test(lower) || (svgSelf.test(tag) && selfSlash === "/") || selfSlash === "/";
    if (isVoid) out += `<${tag}${a} />`;
    else out += `<${tag}${a}>`;
    pos = tagRe.lastIndex;
  }
  out += escText(s.slice(pos));
  // collapse dangerous stray '<' leftovers? leave as-is
  return out;
}

fs.writeFileSync(research + "/converted/static-rest.jsx", toJsx(rest));
fs.writeFileSync(research + "/converted/demo-clean.jsx", toJsx(demoHtml));
fs.writeFileSync(research + "/converted/faq-clean.jsx", toJsx(faqHtml));
console.log("JSX written.");
