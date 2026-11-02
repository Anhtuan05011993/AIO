// Agent C scratch: last field checks before generation.
const fs = require("fs");
const dir = "docs/research/aioenglish/data/";
const tv = JSON.parse(fs.readFileSync(dir + "api-tu-vung-oxford-3000.json", "utf8"));
console.log("tv course meta:", JSON.stringify(tv.course, (k, v) => (k === "groups" ? undefined : v), 1));
const p = JSON.parse(fs.readFileSync(dir + "api-path.json", "utf8"));
console.log("path skipped:", JSON.stringify(p.skipped), "| here:", JSON.stringify(p.here), "| goalNames:", JSON.stringify(p.goalNames));
const np = JSON.parse(fs.readFileSync(dir + "api-ngu-phap-catalog.json", "utf8"));
const stageIds = new Set();
const moduleKeySets = new Set();
np.curriculum.levels.forEach((l) => l.stages.forEach((s) => { stageIds.add(s.id); s.modules.forEach((m) => moduleKeySets.add(Object.keys(m).sort().join("|"))); }));
console.log("stage ids:", [...stageIds].join(" | "));
console.log("module key shapes:", [...moduleKeySets].join(" || "));
const typingCount = np.curriculum.levels.reduce((a, l) => a + l.stages.reduce((b, s) => b + s.modules.filter((m) => m.typing).length, 0), 0);
const modCount = np.curriculum.levels.reduce((a, l) => a + l.stages.reduce((b, s) => b + s.modules.length, 0), 0);
console.log("modules with typing:", typingCount + "/" + modCount);
// topic levels variance
const topicLv = new Set(); np.topics.forEach((t) => topicLv.add(t.levels.join("/")));
console.log("topic levels combos:", [...topicLv].join(" | "));
// node rev — string? order unique?
console.log("node sample rev type:", typeof np.nodes[0].rev, "| orders unique:", new Set(np.nodes.map((n) => n.order)).size === np.nodes.length);
