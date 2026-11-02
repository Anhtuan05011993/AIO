const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE = "https://aioenglish.com";
const ROOT = "D:\\Clone web";

const jobs = [
  // css research files
  ...["entry.DtqCLz7R", "landing.BQxTH4Ip", "RaccoonMascot.Clm3A2Ar", "AuthDialog.xtmBw_xX", "UiDialog.BeNdNHy5", "AuthPanel.DbOe98W7", "UiToast.Cxj4e58f", "pages.D6zOBC8q", "NbButton.DfneVsfp", "CritterAvatar.CmFJMZdd", "AppBrandLogo.DD3DkVl6", "NbPageHeader.CRkE5X_e", "NbDecoStamp.ByqvlPGq", "NbDecoTick.B_G_VoSc", "NbDecoNote.BdF3aQlu", "FeatureCritter.Czt7z3uC", "UiPopover.C3O7mxLV"].map(n => [`/_nuxt/${n}.css`, `docs/research/aioenglish/css/${n}.css`]),
  // fonts
  ...["quicksand-300-700-latin", "quicksand-300-700-latin-ext", "quicksand-300-700-vietnamese", "lexend-500-800-vietnamese", "lexend-500-800-latin", "bricolage-600-800-latin", "bricolage-600-800-vietnamese", "nunito-400-800-latin", "nunito-400-800-vietnamese"].map(n => [`/fonts/${n}.woff2`, `public/sites/aioenglish/fonts/${n}.woff2`]),
  // badges + brand
  ["/badges/app-store-vi.svg", "public/sites/aioenglish/badges/app-store-vi.svg"],
  ["/badges/google-play-vi.png", "public/sites/aioenglish/badges/google-play-vi.png"],
  ["/brand/tienganh/favicon.svg", "public/sites/aioenglish/brand/favicon.svg"],
  ["/brand/tienganh/apple-touch-icon-180.png", "public/sites/aioenglish/brand/apple-touch-icon-180.png"],
];

let ok = 0, fail = 0;
for (const [src, dest] of jobs) {
  const out = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const url = BASE + src;
  try {
    execFileSync("curl", ["-sf", "--max-time", "60", "-o", out, url], { stdio: "pipe" });
    const size = fs.statSync(out).size;
    console.log(`OK   ${src} -> ${dest} (${size} bytes)`);
    ok++;
  } catch (e) {
    console.log(`FAIL ${src} (${e.status || e.message})`);
    try { fs.unlinkSync(out); } catch (_) {}
    fail++;
  }
}
console.log(`\nDONE ok=${ok} fail=${fail}`);
