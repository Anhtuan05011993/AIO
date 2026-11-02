const fs = require("fs");
const path = require("path");

const cssDir = "D:/Clone web/docs/research/aioenglish/css";
const outDir = "D:/Clone web/src/styles/source";
fs.mkdirSync(outDir, { recursive: true });

// import order matters: entry (tokens/tailwind) first, then components
const order = [
  "entry.DtqCLz7R.css",
  "landing.BQxTH4Ip.css",
  "RaccoonMascot.Clm3A2Ar.css",
  "AuthDialog.xtmBw_xX.css",
  "UiDialog.BeNdNHy5.css",
  "AuthPanel.DbOe98W7.css",
  "UiToast.Cxj4e58f.css",
  "pages.D6zOBC8q.css",
  "NbButton.DfneVsfp.css",
  "CritterAvatar.CmFJMZdd.css",
  "AppBrandLogo.DD3DkVl6.css",
  "NbPageHeader.CRkE5X_e.css",
  "NbDecoStamp.ByqvlPGq.css",
  "NbDecoTick.B_G_VoSc.css",
  "NbDecoNote.BdF3aQlu.css",
  "FeatureCritter.Czt7z3uC.css",
  "UiPopover.C3O7mxLV.css",
  "auth.BP4oa356.css",
  "login.aj6jk4ij.css",
  "register.CgU4C3mo.css",
  "forgot.DqHE2XNF.css",
  "phap-ly.QUmc0L4y.css",
  "legal.Do1ZIj_i.css",
];

for (const name of order) {
  const p = path.join(cssDir, name);
  if (!fs.existsSync(p)) { console.log("MISS", name); continue; }
  let css = fs.readFileSync(p, "utf8");
  css = css
    .replace(/url\((['"]?)\/_nuxt\//g, "url($1/sites/aioenglish/assets/")
    .replace(/url\((['"]?)\.\/paper-/g, "url($1/sites/aioenglish/assets/paper-")
    .replace(/url\((['"]?)\/fonts\//g, "url($1/sites/aioenglish/fonts/");
  const outName = name.replace(/\.[^.]+\.css$/, "") + ".css";
  fs.writeFileSync(path.join(outDir, outName), css);
  console.log("WROTE", outName, css.length);
}
console.log("done");
