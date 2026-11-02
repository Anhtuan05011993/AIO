// Agent C scratch: deep-inspect nested item shapes.
const fs = require("fs");
const dir = "docs/research/aioenglish/data/";

const course = JSON.parse(fs.readFileSync(dir + "api-course-crs_b60adbaa933635b8d0.json", "utf8"));
const st = course.statements[0];
console.log("== statement 0 (full, minus learningUnits) ==");
const { learningUnits, ...rest } = st;
console.log(JSON.stringify(rest, null, 1));
console.log("== learningUnits[0..1] ==");
console.log(JSON.stringify(learningUnits.slice(0, 2), null, 1));
console.log("== statement[1] acceptedAnswers + units count ==");
console.log(JSON.stringify(course.statements[1].acceptedAnswers), course.statements[1].learningUnits.length);
console.log("availableTiers:", JSON.stringify(course.course.availableTiers));
console.log("tier of stmt0:", st.tier, "| stmt1 tier:", course.statements[1].tier, "| guessable:", st.guessable);

const tv = JSON.parse(fs.readFileSync(dir + "api-tu-vung-oxford-3000.json", "utf8"));
console.log("\n== tu-vung group A1 sets[0..1] ==");
console.log(JSON.stringify(tv.groups[0].sets.slice(0, 2), null, 1));
console.log("== group labels ==");
console.log(tv.groups.map((g) => `${g.key}:${g.label} sets=${g.sets.length}`).join(" | "));

const np = JSON.parse(fs.readFileSync(dir + "api-ngu-phap-catalog.json", "utf8"));
console.log("\n== ngu-phap groups ==");
console.log(JSON.stringify(np.groups));
console.log("== node.counts sample ==", JSON.stringify(np.nodes[0].counts));
console.log("== nodes[1] ==", JSON.stringify(np.nodes[1]));
console.log("== topic[0] ==", JSON.stringify(np.topics[0]));
console.log("== curriculum.levels[0] ==", JSON.stringify(np.curriculum.levels[0]).slice(0, 700));

const path = JSON.parse(fs.readFileSync(dir + "api-path.json", "utf8"));
console.log("\n== path chapters[0].rows[0..1] ==");
console.log(JSON.stringify(path.chapters[0].rows.slice(0, 2), null, 1));
console.log("== chapters labels ==");
console.log(path.chapters.map((c) => `#${c.index} ${c.label} (${c.done}/${c.total})`).join(" | "));
console.log("== levels ==", JSON.stringify(path.levels));
console.log("== chapter[0] keys ==", Object.keys(path.chapters[0]).join(","));
