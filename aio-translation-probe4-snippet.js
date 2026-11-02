// PROBE 4 — BẮT TRỰC TIẾP call chi tiết 1 bài đọc (thay vì đoán path)
// Chạy: https://aioenglish.com → Luyện đọc & dịch → F12 Console → dán → Enter.
// Sau khi chạy: HÃY BẤM VÀO 1 BÀI BẤT KỲ, đợi nội dung bài hiện hết (~10 giây).
// Sau 60 giây snippet tự tải aio-translation-probe4.json về — gửi lại cho ZCode.
// (Snippet chỉ GHI LẠI request/response của chính bạn, không gọi thêm gì.)
(async () => {
  if (window.__aioCap) { console.log("Đã patch từ lần trước — cứ bấm 1 bài rồi chờ dump."); }
  window.__aioCap = window.__aioCap || [];
  const cap = window.__aioCap;

  const want = (u) => u && (u.includes("/api/translation") || u.includes("/api/press"));

  // patch fetch
  if (!window.__aioFetchPatched) {
    window.__aioFetchPatched = true;
    const orig = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const res = await orig(...args);
      try {
        const url = typeof args[0] === "string" ? args[0] : args[0]?.url || "";
        if (want(url) && !url.includes("catalog") && !url.includes("topic/") && !url.includes("/mine") && !url.includes("progress")) {
          const clone = res.clone();
          const body = await clone.text();
          const req = args[1] || {};
          cap.push({ url: url.split("?")[0] + (url.includes("?") ? "?" + url.split("?")[1] : ""), method: req.method || "GET", reqBody: req.body ? String(req.body).slice(0, 500) : null, status: res.status, resp: body.slice(0, 120000) });
          console.log("ĐÃ BẮT:", req.method || "GET", url.split("?")[0], res.status, Math.round(body.length / 1024) + "KB");
        }
      } catch (e) {}
      return res;
    };
  }

  // patch XHR (dự phòng)
  if (!window.__aioXhrPatched) {
    window.__aioXhrPatched = true;
    const XOpen = XMLHttpRequest.prototype.open;
    const XSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; this.__m = m; return XOpen.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function (b) {
      if (want(this.__u || "")) {
        this.addEventListener("load", () => {
          try {
            cap.push({ url: String(this.__u), method: this.__m, reqBody: b ? String(b).slice(0, 500) : null, status: this.status, resp: String(this.responseText).slice(0, 120000) });
            console.log("ĐÃ BẮT (xhr):", this.__m, this.__u, this.status);
          } catch (e) {}
        });
      }
      return XSend.apply(this, arguments);
    };
  }

  console.log("ĐANG NGHE network… BÂY GIỜ HÃY BẤM VÀO 1 BÀI BẤT KỲ trong Luyện đọc & dịch, đợi nội dung hiện hết. File tự tải sau 60 giây.");
  setTimeout(() => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ captured: cap })], { type: "application/json" }));
    a.download = "aio-translation-probe4.json";
    a.click();
    console.log("Đã tải probe4 —", cap.length, "call bắt được. Gửi file lại cho ZCode.");
  }, 60000);
})();
