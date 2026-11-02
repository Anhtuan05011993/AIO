const fs = require("fs");

const d = JSON.parse(fs.readFileSync("D:/Clone web/aio-courses-missing-2.json", "utf8"));
const ids = Object.keys(d);
let ok = 0, fail429 = 0, failOther = 0;
const okIds = [], failIds = [];
for (const [id, v] of Object.entries(d)) {
  if (v && v.statements) { ok++; okIds.push(id); }
  else if (v && v.__error === 429) { fail429++; failIds.push(id); }
  else { failOther++; failIds.push(id + ":" + (v ? v.__error : "null")); }
}
console.log("total:", ids.length, "| ok:", ok, "| 429:", fail429, "| other fail:", failOther);
const total = okIds.reduce((n, id) => n + d[id].statements.length, 0);
console.log("statements in ok:", total);

// integrate ok ones
const bulk = "D:/Clone web/docs/research/aioenglish/data/bulk";
const manifestPath = bulk + "/_manifest-ok.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const have = new Set(manifest.ids);
let added = 0;
for (const id of okIds) {
  if (have.has(id)) continue;
  fs.writeFileSync(`${bulk}/course-${id}.json`, JSON.stringify(d[id]));
  manifest.ids.push(id);
  have.add(id);
  added++;
}
manifest.count = manifest.ids.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log("newly saved:", added, "| manifest total:", manifest.ids.length);

// remaining missing for batch 3 (longer delay)
const pack = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/api-pack-lo-trinh-b1.json", "utf8"));
const originals = new Set(["crs_b60adbaa933635b8d0", "crs_d5d9f4cb9dcf760b9e", "crs_0008c8bbf528537cfd"]);
const stillMissing = pack.courses.map(c => c.id).filter(id => !have.has(id) && !originals.has(id));
console.log("still missing:", stillMissing.length);

const snippet = `/* AIO course data export — ĐỢT 3 (chỉ các khóa còn fail · delay 10s tránh 429) */
(async () => {
  const ids = ${JSON.stringify(stillMissing)};
  const out = {};
  let done = 0, fail = 0;
  for (const id of ids) {
    try {
      const r = await fetch('/api/go-cau/course/' + id);
      const j = await r.json();
      if (r.ok && j && j.statements) { out[id] = j; done++; }
      else { fail++; out[id] = { __error: r.status }; }
      console.log('[' + (done + fail) + '/' + ids.length + '] ' + id + (out[id].__error ? ' FAILED ' + r.status : ' ok'));
    } catch (e) { fail++; out[id] = { __error: 'network' }; }
    await new Promise(res => setTimeout(res, 10000));
  }
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aio-courses-missing-3.json';
  a.click();
  console.log('XONG! ok=' + done + ' fail=' + fail + ' — file aio-courses-missing-3.json đã tải về Downloads');
})();`;

fs.writeFileSync("D:/Clone web/docs/research/aioenglish/console-export-snippet-3.js", snippet);
console.log("snippet-3 saved with", stillMissing.length, "ids, 10s delay");
if (stillMissing.length <= 40) console.log("ids:", JSON.stringify(stillMissing));
