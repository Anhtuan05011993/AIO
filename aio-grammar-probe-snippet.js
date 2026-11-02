// SNIPPET THĂM DÒ ENDPOINT NỘI DUNG NODE NGỮ PHÁP (chạy thử — không trích hàng loạt)
// Cách chạy: mở https://aioenglish.com trong trình duyệt (đã đăng nhập) → F12 → tab Console
// → dán toàn bộ file này → Enter. Chờ ~1 phút, file aio-grammar-probe.json tự tải về.
// Gửi file đó lại cho ZCode để xác định endpoint đúng, sau đó mới trích 102 node (delay 10s).
(async () => {
  const ids = [
    "a2-past-simple",
    "b2-inversion-so-neither",
    "c1-modality-obligation",
    "c2-adjective-order",
  ];
  const apiPaths = (id) => [
    `/api/ngu-phap/node/${id}`,
    `/api/ngu-phap/${id}`,
    `/api/ngu-phap/lesson/${id}`,
    `/api/ngu-phap/nodes/${id}`,
    `/api/ngu-phap/content/${id}`,
    `/api/grammar/node/${id}`,
  ];
  const report = { api: {}, html: {} };
  for (const id of ids) {
    report.api[id] = {};
    for (const p of apiPaths(id)) {
      try {
        const r = await fetch(p, { credentials: "include" });
        let preview = "";
        if (r.ok) {
          const t = await r.text();
          preview = t.slice(0, 300);
        }
        report.api[id][p] = { status: r.status, preview };
        console.log(r.status, p);
      } catch (e) {
        report.api[id][p] = { error: String(e) };
      }
      await new Promise((s) => setTimeout(s, 2500));
    }
    // dự phòng: trang node SSR trực tiếp — bóc độ dài + dấu hiệu dữ liệu
    try {
      const r = await fetch(`/ngu-phap/${id}`, { credentials: "include" });
      const t = r.ok ? await r.text() : "";
      report.html[id] = {
        status: r.status,
        length: t.length,
        hasNuxtData: t.includes("__NUXT_DATA__") || t.includes("__NUXT__"),
        // đoạn quanh tiêu đề để đoán cấu trúc
        marker: t.includes(id) ? "id xuất hiện trong HTML" : "id không thấy trong HTML",
      };
      console.log(r.status, `/ngu-phap/${id}`, t.length);
    } catch (e) {
      report.html[id] = { error: String(e) };
    }
    await new Promise((s) => setTimeout(s, 2500));
  }
  console.log("REPORT:", report);
  const blob = new Blob([JSON.stringify(report, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "aio-grammar-probe.json";
  a.click();
  console.log("Xong — kiểm tra file aio-grammar-probe.json trong Downloads.");
})();
