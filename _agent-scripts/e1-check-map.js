const fs = require("fs");
// Parse learningPath.ts without TS: crude JSON extraction between "export const learningPath" and the final "};"
const lpSrc = fs.readFileSync("D:/Clone web/src/lib/demo-data/learningPath.ts", "utf8");
const start = lpSrc.indexOf("export const learningPath");
const jsonStr = lpSrc.slice(lpSrc.indexOf("{", start)).replace(/;\s*$/, "");
const lp = JSON.parse(jsonStr);
const direct = ["crs_b60adbaa933635b8d0", "crs_d5d9f4cb9dcf760b9e", "crs_0008c8bbf528537cfd"];
const bulk = require("D:/Clone web/src/lib/demo-data/go-cau/bulk-manifest.json").map((m) => m.id);
const avail = new Set([...direct, ...bulk]);
const crsRows = [];
const gramSlugs = new Set();
let typingTotal = 0, typingAvail = 0;
for (const ch of lp.chapters) {
  for (const r of ch.rows) {
    if (r.kind === "typing") {
      typingTotal++;
      const m = /crs_[a-z0-9]+/i.exec(r.to);
      const id = m ? m[0] : "";
      const ok = avail.has(id);
      if (ok) typingAvail++;
      crsRows.push([ch.index, id, ok ? "OK" : "NO", r.title]);
    } else {
      gramSlugs.add(r.to.replace("/ngu-phap/", ""));
    }
  }
}
console.log("typing rows:", typingTotal, "with data:", typingAvail);
for (const c of crsRows) console.log(c.join("  "));
console.log("--- grammar slugs:", gramSlugs.size);
console.log([...gramSlugs].join("\n"));
// check against nguPhapCatalog nodes
const catSrc = fs.readFileSync("D:/Clone web/src/lib/demo-data/nguPhapCatalog.ts", "utf8");
const missing = [...gramSlugs].filter((s) => !catSrc.includes(`"${s}"`) && !catSrc.includes(`'${s}'`) && !catSrc.includes("`" + s + "`"));
console.log("--- grammar slugs NOT found in catalog source:", missing.length);
console.log(missing.join("\n"));
// totals
console.log("--- chapter totals:", lp.chapters.map((c) => `${c.index}:${c.rows.length}/${c.total}`).join(" "));
console.log("--- rows minutes sum:", lp.chapters.reduce((a, c) => a + c.rows.reduce((x, r) => x + r.minutes, 0), 0));
