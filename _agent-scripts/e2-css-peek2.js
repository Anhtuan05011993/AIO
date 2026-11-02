// E2 — check existence (as selector token) of utility classes in entry.css
const fs = require("fs");
const css = fs.readFileSync("D:/Clone web/src/styles/source/entry.css", "utf8");
const cands = [
  "font-hero", "font-ipa", "ipa-tone", "text-fg", "text-fg-muted", "rounded-card", "rounded-card-lg",
  "rounded-pill", "border-bw", "border-t-bw", "border-border", "border-border-strong", "bg-surface",
  "bg-surface-2", "shadow-sh-1", "shadow-sh-2", "shadow-sh-3", "btn-ink", "btn-ink-cta", "tap-40",
  "isle", "lp-vroot", "lp-surface-60", "lp-feat-soft", "text-2xs", "tabular-nums", "lp-suggest",
  "lp-g-again", "lp-vcard", "lp-vbar", "lp-vtopic", "lp-vgrade",
];
for (const c of cands) {
  const plain = css.includes("." + c);
  let esc = "";
  if (!plain) {
    const escaped = c.replace(/([.:!\/\[\]()$%])/g, "\\$1");
    esc = css.includes("." + escaped);
  }
  console.log(c.padEnd(22), plain ? "PLAIN" : esc ? "ESCAPED" : "MISSING");
}
