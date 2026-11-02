const fs = require("fs");
const p = "D:/Clone web/src/components/sites/aioenglish/app/AppShell.tsx";
let s = fs.readFileSync(p, "utf8");
if (s.includes("aio-demo-theme")) { console.log("already present"); process.exit(0); }
const anchor = "export default function AppShell";
const boot = `// Theme + skin bootstrap (persisted by /cai-dat) — applied on every app page load.
if (typeof document !== "undefined") {
  try {
    const theme = window.localStorage.getItem("aio-demo-theme");
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    }
    const skin = window.localStorage.getItem("aio-demo-skin");
    if (skin === "sotay" || skin === "neo") document.documentElement.dataset.skin = skin;
  } catch {
    // storage unavailable
  }
}

`;
if (!s.includes(anchor)) { console.log("anchor missing!"); process.exit(1); }
s = s.replace(anchor, boot + anchor);
fs.writeFileSync(p, s);
console.log("bootstrap added");
