const fs = require("fs");

const pack = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/api-pack-lo-trinh-b1.json", "utf8"));
const extracted = JSON.parse(fs.readFileSync("D:/Clone web/docs/research/aioenglish/data/bulk/_manifest-ok.json", "utf8"));
const have = new Set([...extracted.ids, "crs_b60adbaa933635b8d0", "crs_d5d9f4cb9dcf760b9e", "crs_0008c8bbf528537cfd"]);
const missing = pack.courses.map(c => c.id).filter(id => !have.has(id));
console.log("missing ids:", missing.length);

const snippet = `/* AIO course data export — chạy trong Console (F12) trên tab aioenglish.com */
(async () => {
  const ids = ${JSON.stringify(missing)};
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
  a.download = 'aio-courses-missing.json';
  a.click();
  console.log('XONG! ok=' + done + ' fail=' + fail + ' — file aio-courses-missing.json đã tải về Downloads');
})();`;

fs.writeFileSync("D:/Clone web/docs/research/aioenglish/console-export-snippet.js", snippet);
fs.writeFileSync("D:/Clone web/docs/research/aioenglish/data/missing-ids.json", JSON.stringify(missing, null, 1));
console.log("snippet saved: docs/research/aioenglish/console-export-snippet.js");
console.log("snippet size:", snippet.length, "chars");
