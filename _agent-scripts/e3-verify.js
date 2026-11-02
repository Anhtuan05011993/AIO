// e3-verify.js — transpile + execute the grammar data modules (no Next needed)
// Checks: node ids valid, DEMO_LESSONS covers all nodes, course ids load,
// buildGrammarLesson returns content for every node.
const fs = require("fs");
const path = require("path");
const ts = require(path.join("D:/Clone web", "node_modules", "typescript"));

const ROOT = "D:/Clone web";
function load(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module_ = { exports: {} };
  const req = (spec) => {
    const map = {
      "../nguPhapCatalog": "ngu",
      "./nodeCourses": "nodeCourses",
      "./demoLessons": "demoLessons",
      "../go-cau": "gocau",
    };
    if (map[spec]) return registry[map[spec]];
    throw new Error("unexpected import: " + spec);
  };
  new Function("require", "module", "exports", js)(req, module_, module_.exports);
  return module_.exports;
}

// go-cau stub: same behaviour as getCourseAsync via direct fs read
const gocau = {
  async getCourseAsync(courseId) {
    const p1 = path.join(ROOT, "src/lib/demo-data/go-cau", `course-${courseId}.json`);
    const p2 = path.join(ROOT, "src/lib/demo-data/go-cau/courses", `course-${courseId}.json`);
    const file = fs.existsSync(p1) ? p1 : fs.existsSync(p2) ? p2 : null;
    if (!file) return undefined;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  },
};

const ngu = load("src/lib/demo-data/nguPhapCatalog.ts");
const nodeCourses = load("src/lib/demo-data/grammar/nodeCourses.ts");
load("src/lib/demo-data/grammar/demoLessons.ts"); // registers into registry? no — returns exports
const demoLessons = load("src/lib/demo-data/grammar/demoLessons.ts");

const registry = { ngu, nodeCourses, demoLessons, gocau };
const lessonMod = load("src/lib/demo-data/grammar/lesson.ts");

const nodes = ngu.nguPhapCatalog.nodes;
console.log("nodes:", nodes.length);
const byLevel = {};
for (const n of nodes) byLevel[n.level] = (byLevel[n.level] || 0) + 1;
console.log("by level:", byLevel);

let errors = 0;

// 1. DEMO_LESSONS keys ↔ node ids
const demoKeys = Object.keys(demoLessons.DEMO_LESSONS);
const nodeIds = new Set(nodes.map((n) => n.id));
for (const k of demoKeys) {
  if (!nodeIds.has(k)) { console.log("DEMO_LESSONS key not a node:", k); errors++; }
}
for (const n of nodes) {
  if (!demoLessons.DEMO_LESSONS[n.id]) { console.log("no DEMO_LESSONS for:", n.id); errors++; }
  else {
    const d = demoLessons.DEMO_LESSONS[n.id];
    if (!d.intro?.length || !d.points?.length) { console.log("thin demo content:", n.id); errors++; }
  }
}

// 2. course ids loadable
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/lib/demo-data/go-cau/bulk-manifest.json"), "utf8"),
);
const manifestIds = new Set(manifest.map((m) => m.id));
for (const [nid, cids] of Object.entries(nodeCourses.NODE_COURSE_IDS)) {
  if (!nodeIds.has(nid)) { console.log("NODE_COURSE_IDS key not a node:", nid); errors++; }
  if (cids.length === 0) { console.log("empty course list:", nid); errors++; }
  for (const cid of cids) {
    if (!manifestIds.has(cid)) { console.log("course id not in manifest:", nid, cid); errors++; }
  }
}

// 3. buildGrammarLesson for all nodes
(async () => {
  let withReal = 0;
  for (const n of nodes) {
    const l = await lessonMod.buildGrammarLesson(n.id);
    if (!l) { console.log("buildGrammarLesson null:", n.id); errors++; continue; }
    if (l.examples.length === 0) { console.log("no examples:", n.id); errors++; }
    if (l.examplesFromCourse) withReal++;
    if (!l.topic) { console.log("no topic:", n.id); errors++; }
  }
  console.log("nodes with real course examples:", withReal, "| demo examples:", nodes.length - withReal);

  // 4. unknown node → null
  const bad = await lessonMod.buildGrammarLesson("zzz-not-a-node");
  console.log("unknown node →", bad);

  // 5. topics per level sanity (hub view)
  for (const lv of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
    const t = ngu.nguPhapCatalog.topics.filter((x) => x.levels.includes(lv));
    const nds = nodes.filter((n) => n.level === lv);
    console.log(`level ${lv}: topics=${t.length} nodes=${nds.length}`);
  }
  console.log(errors === 0 ? "ALL OK" : `ERRORS: ${errors}`);
})();
