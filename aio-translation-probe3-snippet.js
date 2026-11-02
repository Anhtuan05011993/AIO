// PROBE 3 — ĐỌC & DỊCH: lấy đủ 12 topic (266 bài metadata) + dò endpoint chi tiết
// Chạy: https://aioenglish.com (đã đăng nhập) → F12 → Console → dán → Enter → chờ ~45s
// → gửi file aio-translation-probe3.json cho ZCode.
(async () => {
  const out = { topics: {}, detail: {} };
  const get = async (p) => {
    const r = await fetch(p, { credentials: "include" });
    const t = await r.text();
    let j = null;
    try { j = JSON.parse(t); } catch (e) {}
    console.log(r.status, p, j ? "JSON " + Math.round(t.length / 1024) + "KB" : "not-json");
    return { status: r.status, json: j };
  };

  const topics = ["du-lich", "hop-thuyet-trinh", "email-cong-viec", "giao-thong", "mua-sam", "nha-cua-gia-dinh", "phong-van", "nha-hang-am-thuc", "van-phong", "su-kien-le-hoi", "y-te-suc-khoe", "thoi-tiet"];
  let firstId = "";
  for (const t of topics) {
    const v = await get("/api/translation/topic/" + t);
    out.topics[t] = v;
    if (!firstId && v.json?.items?.length) firstId = v.json.items[0].exerciseId;
    await new Promise((s) => setTimeout(s, 2000));
  }
  console.log("exerciseId mẫu:", firstId);

  // dò endpoint chi tiết với exerciseId thật
  const cands = [
    "/api/translation/exercise/" + firstId,
    "/api/translation/paper/" + firstId,
    "/api/translation/" + firstId,
    "/api/translation/e/" + firstId,
    "/api/translation/item/" + firstId,
    "/api/press/paper/" + firstId,
  ];
  for (const p of cands) {
    out.detail[p] = await get(p);
    await new Promise((s) => setTimeout(s, 2500));
  }

  console.log("XONG — gửi file aio-translation-probe3.json cho ZCode.");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: "application/json" }));
  a.download = "aio-translation-probe3.json";
  a.click();
})();
