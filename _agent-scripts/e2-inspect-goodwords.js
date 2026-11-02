// E2 — inspect schema of _agent-scripts/tmp-dict/goodWords.json (untrusted data, read-only)
const fs = require("fs");
const p = "D:/Clone web/_agent-scripts/tmp-dict/goodWords.json";
const raw = fs.readFileSync(p, "utf8");
console.log("bytes:", raw.length, "| first 400 chars:");
console.log(raw.slice(0, 400));

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.log("NOT single JSON:", e.message);
  // try JSON lines
  const lines = raw.split("\n").filter(Boolean);
  console.log("lines:", lines.length);
  try {
    data = lines.map((l) => JSON.parse(l));
    console.log("PARSED AS JSON LINES");
  } catch (e2) {
    console.log("not json lines either:", e2.message);
    process.exit(1);
  }
}

console.log("top-level type:", Array.isArray(data) ? `array(${data.length})` : typeof data);
if (!Array.isArray(data)) {
  console.log("keys:", Object.keys(data).slice(0, 20).join(", "));
  process.exit(0);
}
console.log("\nfirst 3 entries fully:");
for (let i = 0; i < 3; i++) console.log(JSON.stringify(data[i], null, 2).slice(0, 1200));

// key-frequency analysis
const keyCount = new Map();
const keyTypes = new Map();
for (const it of data) {
  if (!it || typeof it !== "object") continue;
  for (const k of Object.keys(it)) {
    keyCount.set(k, (keyCount.get(k) || 0) + 1);
    const t = Array.isArray(it[k]) ? "array" : it[k] === null ? "null" : typeof it[k];
    if (!keyTypes.has(k)) keyTypes.set(k, new Map());
    keyTypes.get(k).set(t, (keyTypes.get(k).get(t) || 0) + 1);
  }
}
console.log("\nkey frequency (of " + data.length + "):");
for (const [k, n] of [...keyCount.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${n} (${[...keyTypes.get(k).entries()].map(([t, c]) => t + ":" + c).join(", ")})`);
}

// sample distinct values for key candidates
for (const k of ["type", "wordType", "pos", "wordtype", "class"]) {
  if (keyCount.has(k)) {
    const vals = new Map();
    for (const it of data) {
      const v = it[k];
      const s = Array.isArray(v) ? v.join("|") : String(v);
      vals.set(s.slice(0, 60), (vals.get(s.slice(0, 60)) || 0) + 1);
    }
    console.log(`\ndistinct ${k}:`, [...vals.entries()].slice(0, 20).map(([v, c]) => `${v}(${c})`).join(" · "));
  }
}
