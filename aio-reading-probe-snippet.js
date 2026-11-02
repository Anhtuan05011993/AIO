// SNIPPET THĂM DÒ API "ĐỌC & DỊCH" (3 tầng — tìm endpoint thật trước khi trích 266 bài)
// Cách chạy:
//  1. Mở https://aioenglish.com (đã đăng nhập)
//  2. Click "Luyện đọc & dịch" trong app, chờ 3-5 giây để trang tải data
//  3. F12 → Console → dán toàn bộ file này → Enter, chờ ~30 giây
//  4. File aio-reading-probe.json tự tải về — gửi lại cho ZCode
(async () => {
  const report = { perf: [], js: [], probes: {} };

  // Tầng 1: XHR thật đã xảy ra trong tab (hiệu quả nhất nếu bạn đã mở trang đọc)
  try {
    for (const e of performance.getEntriesByType("resource")) {
      const url = e.name || "";
      if (url.includes("/api/") && !url.includes("cloudflareinsights") && !url.includes("challenges.cloudflare")) {
        report.perf.push(url.split("?")[0]);
      }
    }
    report.perf = [...new Set(report.perf)];
  } catch (e) {}

  // Tầng 2: quét JS bundle — các path /api/... trong mã nguồn frontend
  try {
    const srcs = [...document.querySelectorAll("script[src]")]
      .map((s) => s.getAttribute("src"))
      .filter(Boolean);
    const found = new Set();
    for (const src of srcs.slice(0, 6)) {
      try {
        const t = await (await fetch(src.startsWith("http") ? src : location.origin + src)).text();
        for (const m of t.match(/\/api\/[a-z0-9\-_\/]+/gi) || []) found.add(m);
      } catch (e) {}
    }
    report.js = [...found];
  } catch (e) {}

  // Tầng 3: dò các endpoint khả dĩ
  const candidates = [
    "/api/doc-dich/articles",
    "/api/doc-dich/list",
    "/api/doc-dich",
    "/api/reading/articles",
    "/api/reading/list",
    "/api/articles",
    "/api/luyen-dich-thuat/articles",
    "/api/doc-bai/articles",
  ];
  for (const p of candidates) {
    try {
      const r = await fetch(p, { credentials: "include" });
      const t = r.ok ? await r.text() : "";
      const isJson = t.trim().startsWith("{") || t.trim().startsWith("[");
      report.probes[p] = { status: r.status, json: isJson, preview: isJson ? t.slice(0, 260) : t.slice(0, 80) };
      console.log(r.status, p, isJson ? "JSON!" : "html");
    } catch (e) {
      report.probes[p] = { error: String(e) };
    }
    await new Promise((s) => setTimeout(s, 2500));
  }

  console.log("perf:", report.perf);
  console.log("js api paths:", report.js);
  console.log("REPORT:", report);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(report, null, 1)], { type: "application/json" }));
  a.download = "aio-reading-probe.json";
  a.click();
  console.log("Xong — gửi file aio-reading-probe.json lại cho ZCode.");
})();
