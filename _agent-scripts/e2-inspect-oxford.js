// E2 — inspect oxford full-word + existing demo data + small VN dicts (read-only)
const fs = require("fs");
const path = require("path");
const base = "D:/Clone web/docs/research/aioenglish/data";

const ox = JSON.parse(fs.readFileSync(path.join(base, "datasets/oxford-5000-full-word.json"), "utf8"));
console.log("oxford entries:", ox.length);
console.log("oxford[0]:", JSON.stringify(ox[0], null, 1).slice(0, 1500));
console.log("oxford[100]:", JSON.stringify(ox[100], null, 1).slice(0, 900));

// existing demo data from Agent C
const files = ["api-tu-vung-oxford-3000.json"];
for (const f of files) {
  const fp = path.join(base, f);
  if (fs.existsSync(fp)) {
    const raw = fs.readFileSync(fp, "utf8");
    console.log("\n" + f, "bytes=", raw.length);
    const d = JSON.parse(raw);
    const s = JSON.stringify(d);
    console.log("head:", s.slice(0, 500));
    if (Array.isArray(d)) console.log("len:", d.length);
    else console.log("keys:", Object.keys(d).slice(0, 15).join(","));
  }
}

// demo-data dir
const dd = "D:/Clone web/src/lib/demo-data";
console.log("\ndemo-data dir:", fs.readdirSync(dd).join(", "));
const vocabDir = path.join(dd, "vocab");
if (fs.existsSync(vocabDir)) console.log("demo-data/vocab:", fs.readdirSync(vocabDir).join(", "));

// small VN dicts
for (const f of ["datasets/gh-english_vietnamese_dictionary_json.json", "datasets/carryword-en-vocab.json"]) {
  const fp = path.join(base, f);
  const raw = fs.readFileSync(fp, "utf8");
  console.log("\n" + f, "bytes=", raw.length);
  console.log("head:", raw.slice(0, 400).replace(/\s+/g, " "));
}
