const fs = require("fs");

// 1) Inspect the user's downloaded file
const raw = fs.readFileSync("D:/Clone web/aio-courses-missing.json", "utf8");
const data = JSON.parse(raw);
const ids = Object.keys(data);
let ok = 0, fail = 0;
const okIds = [];
for (const [id, v] of Object.entries(data)) {
  if (v && v.statements) { ok++; okIds.push(id); } else fail++;
}
console.log(`downloaded: ${ids.length} entries — ok: ${ok}, fail: ${fail}`);

// 2) Save the successful ones into the bulk folder
const bulk = "D:/Clone web/docs/research/aioenglish/data/bulk";
fs.mkdirSync(bulk, { recursive: true });
const manifestPath = bulk + "/_manifest-ok.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const have = new Set(manifest.ids);
let added = 0;
for (const id of okIds) {
  if (have.has(id)) continue;
  fs.writeFileSync(`${bulk}/course-${id}.json`, JSON.stringify(data[id]));
  manifest.ids.push(id);
  have.add(id);
  added++;
}
manifest.count = manifest.ids.length;
manifest.extractedAt = new Date().toISOString() + " (2nd batch via user browser)";
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log("newly saved:", added, "| manifest total:", manifest.ids.length);

// 3) Which are still missing?
const pack = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/api-pack-lo-trinh-b1.json", "utf8"));
const originals = new Set(["crs_b60adbaa933635b8d0", "crs_d5d9f4cb9dcf760b9e", "crs_0008c8bbf528537cfd"]);
const stillMissing = pack.courses.map(c => c.id).filter(id => !have.has(id) && !originals.has(id));
console.log("still missing:", stillMissing.length);

// 4) Corrected console snippet for the remaining ones
const snippet = `/* AIO course data export — ĐỢT 2 (ID đã sửa đúng từ pack thật) */
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
    await new Promise(res => setTimeout(res, 3500));
  }
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aio-courses-missing-2.json';
  a.click();
  console.log('XONG! ok=' + done + ' fail=' + fail + ' — file aio-courses-missing-2.json đã tải về Downloads');
})();`;

fs.writeFileSync("D:/Clone web/docs/research/aioenglish/console-export-snippet-2.js", snippet);
fs.writeFileSync("D:/Clone web/docs/research/aioenglish/data/missing-ids-2.json", JSON.stringify(stillMissing, null, 1));
console.log("corrected snippet saved: docs/research/aioenglish/console-export-snippet-2.js");
console.log("--- still missing ids:");
console.log(JSON.stringify(stillMissing));
