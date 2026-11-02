const fs = require("fs");
const c2 = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/api-course-crs_d5d9f4cb9dcf760b9e.json", "utf8"));
const s0 = c2.statements[0];
console.log("course:", c2.course.title, "| statements:", c2.statements.length);
console.log("statement keys:", Object.keys(s0).join(", "));
console.log("text:", s0.text);
console.log("translation:", s0.translation);
console.log("learningUnits count:", s0.learningUnits.length);
s0.learningUnits.forEach((u, i) => {
  console.log(`  [${i}] type=${u.unitType} text="${u.unitText}" ${u.explanationVi ? "exp=✓" : ""} keys=${Object.keys(u).join(",")}`);
});
// check unitTypes distribution across statements
const types = {};
for (const st of c2.statements) for (const u of st.learningUnits) types[u.unitType] = (types[u.unitType] || 0) + 1;
console.log("unitType distribution:", JSON.stringify(types));
