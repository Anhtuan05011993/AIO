const fs = require("fs");
const h = fs.readFileSync("D:/Clone web/login-served.html", "utf8");
const links = [...h.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m => m[0]);
console.log("stylesheet links in SSR HTML:", links.length);
links.slice(0, 30).forEach(l => console.log(l.slice(0, 160)));
console.log("--- css imports in B files:");
for (const p of ["AuthShell", "LoginForm", "RegisterForm", "ForgotForm", "AuthAside", "BrandLockup", "Raccoon", "SocialButtons", "EyeIcons"]) {
  const f = `D:/Clone web/src/components/sites/aioenglish/auth/${p}.tsx`;
  try {
    const s = fs.readFileSync(f, "utf8");
    const m = s.match(/import\s[^;]*\.css[^;]*;/g);
    if (m) console.log(p, "->", m.join(" | "));
  } catch (e) { console.log(p, "MISSING"); }
}
// also check the legal components
for (const p of ["LegalShell", "LegalToc", "LegalHub"]) {
  const f = `D:/Clone web/src/components/sites/aioenglish/legal/${p}.tsx`;
  try {
    const s = fs.readFileSync(f, "utf8");
    const m = s.match(/import\s[^;]*\.css[^;]*;/g);
    if (m) console.log("legal/" + p, "->", m.join(" | "));
  } catch (e) {}
}
