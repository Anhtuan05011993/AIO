// DUMP ĐỌC — tải ngay toàn bộ bài đọc đã trích trong localStorage (không dừng vòng chạy).
// Chạy bất cứ lúc nào trong tab đang trích: F12 → Console → dán → Enter.
// File aio-reading-articles.json tải về chứa mọi bài hoàn chỉnh hiện có.
(async () => {
  const all = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("aio-tr:")) {
      try {
        const v = JSON.parse(localStorage.getItem(k));
        const id = k.slice(7);
        if (v && !v._error && v.sentences?.length) all[id] = v;
      } catch (e) {}
    }
  }
  const n = Object.keys(all).length;
  console.log("Bài đọc hoàn chỉnh trong localStorage:", n);
  if (!n) {
    console.log("Chưa có gì — snippet trích chưa xong bài nào.");
    return;
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(all)], { type: "application/json" }));
  a.download = "aio-reading-articles.json";
  a.click();
  console.log("Đã tải aio-reading-articles.json (" + n + " bài) — gửi file lại cho ZCode.");
})();
