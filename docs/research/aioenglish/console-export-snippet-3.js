/* AIO course data export — ĐỢT 3 (chỉ các khóa còn fail · delay 10s tránh 429) */
(async () => {
  const ids = ["crs_5621c62b19b3e86bbd","crs_31162644eab6c6bef1","crs_fa27972b1ce89ab77b","crs_4d8a4fc8491c7fc071","crs_d84dacd2504b8f2e1b","crs_9dc1fabbeb6cd0508f","crs_bc9c7f4c106aa57831","crs_ada2ed44bb784b7b56","crs_d1623f14aa1cbb93a6","crs_c219d37a21758c17b2","crs_5357e6660bd04a7252","crs_612c16ea28abd6b2e7","crs_1794190c6e977f6077","crs_44470da82a0d23a360","crs_ea425b180cca860b84"];
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
})();