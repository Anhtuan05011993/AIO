const fs = require("fs");
const path = require("path");

const compDir = "D:/Clone web/src/components/sites/aioenglish/landing";
const lowerToCamel = {
  viewbox: "viewBox", basefrequency: "baseFrequency", numoctaves: "numOctaves",
  stitchtiles: "stitchTiles", gradientunits: "gradientUnits", pathlength: "pathLength",
  textlength: "textLength", spreadmethod: "spreadMethod", patternunits: "patternUnits",
  patterncontentunits: "patternContentUnits", markerwidth: "markerWidth",
  markerheight: "markerHeight", markerunits: "markerUnits", refx: "refX", refy: "refY",
  clippathunits: "clipPathUnits", filterunits: "filterUnits", primitiveunits: "primitiveUnits",
  preserveaspectratio: "preserveAspectRatio", dominantbaseline: "dominantBaseline",
  startoffset: "startOffset", stddeviation: "stdDeviation", strokewidth: "strokeWidth",
  strokelinecap: "strokeLinecap", strokelinejoin: "strokeLinejoin", strokedasharray: "strokeDasharray",
  strokedashoffset: "strokeDashoffset", strokemitLimit: "strokeMiterlimit", strokemitlerlimit: "strokeMiterlimit",
  strokemiterlimit: "strokeMiterlimit", strokopacity: "strokeOpacity", strokeopacity: "strokeOpacity",
  fillopacity: "fillOpacity", fillrule: "fillRule", cliprule: "clipRule", clippath: "clipPath",
  stopcolor: "stopColor", stopopacity: "stopOpacity", textanchor: "textAnchor",
  vectoreffect: "vectorEffect", gradienttransform: "gradientTransform", specularconstant: "specularConstant",
  specularexponent: "specularExponent", surfacScale: "surfaceScale", surfacescale: "surfaceScale",
  floodcolor: "floodColor", floodopacity: "floodOpacity", colorinterpolationfilters: "colorInterpolationFilters",
  enablebackground: "enableBackground", requirefeatures: "requireFeatures", systemlanguage: "systemLanguage",
  tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength", autocomplete: "autoComplete",
  crossorigin: "crossOrigin", referrerpolicy: "referrerPolicy", fetchpriority: "fetchPriority",
  contenteditable: "contentEditable", spellcheck: "spellCheck", srclang: "srcLang",
  playsinline: "playsInline", novalidate: "noValidate", formaction: "formAction",
  datetime: "dateTime", enctype: "encType", enterkeyhint: "enterKeyHint", inputmode: "inputMode",
  colspan: "colSpan", rowspan: "rowSpan", srcset: "srcSet", cellpadding: "cellPadding",
};

let total = 0;
for (const f of fs.readdirSync(compDir)) {
  if (!f.endsWith(".tsx")) continue;
  const p = path.join(compDir, f);
  let src = fs.readFileSync(p, "utf8");
  let count = 0;
  for (const [lo, cam] of Object.entries(lowerToCamel)) {
    const re = new RegExp(`(\\s|\\{)${lo}=`, "g");
    src = src.replace(re, (m, pre) => { count++; return `${pre}${cam}=`; });
  }
  if (count) { fs.writeFileSync(p, src); console.log(f, "fixed", count); total += count; }
}
console.log("total fixed:", total);
