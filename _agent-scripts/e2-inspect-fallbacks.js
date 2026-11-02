// E2 — inspect local fallback datasets (read-only, untrusted data)
const fs = require("fs");
const path = require("path");
const base = "D:/Clone web/docs/research/aioenglish/data/datasets";

function peek(name, raw, depth = 2) {
  console.log("\n==== " + name + " | bytes=" + raw.length);
  console.log("head:", raw.slice(0, 300).replace(/\s+/g, " "));
  let d;
  try {
    d = JSON.parse(raw);
  } catch (e) {
    console.log("parse fail:", e.message.slice(0, 100));
    return;
  }
  const shape = (v, lvl) => {
    if (lvl > depth) return typeof v;
    if (Array.isArray(v)) return `array(${v.length})[${v.length ? shape(v[0], lvl + 1) : ""}]`;
    if (v && typeof v === "object") return `obj{${Object.keys(v).slice(0, 12).join(",")}}`;
    return JSON.stringify(v);
  };
  console.log("shape:", shape(d, 0));
}

peek("oxford-5000-full-word.json", fs.readFileSync(path.join(base, "oxford-5000-full-word.json"), "utf8"));

const toeicDir = path.join(base, "toeic-600");
console.log("\ntoeic-600 dir:", fs.readdirSync(toeicDir).join(", "));
for (const f of fs.readdirSync(toeicDir).slice(0, 4)) {
  const fp = path.join(toeicDir, f);
  if (fs.statSync(fp).isFile()) peek("toeic-600/" + f, fs.readFileSync(fp, "utf8"));
}

const cefrDir = path.join(base, "cefr-vocab");
console.log("\ncefr-vocab dir:", fs.readdirSync(cefrDir).slice(0, 20).join(", "));
