// TRÍCH NODE NGỮ PHÁP — v3: CHỈ 33 NODE CÒN THIẾU (đã có 134 node lưu file)
// Chạy: https://aioenglish.com (đã đăng nhập) → F12 → Console → dán → Enter.
//  - Lưu localStorage ngay khi fetch xong + tự tải part file mỗi 20 node.
//  - 3 node liên tiếp toàn 429 → DỪNG SỚM + tải phần đã có.
//  - Chạy lại tự resume (bỏ qua node đã có trong localStorage). Đổi server VPN rồi dán lại để lấy tiếp.
(async () => {
  const IDS = ["c1-hedging-modals","c1-negation-advanced","c1-inversion","c1-cleft-sentences","c1-conditionals-advanced","c1-clauses-subordinated","c1-noun-phrases","c1-present-advanced","c1-adverbs-stance","c1-imperatives-advanced","c1-pronouns-quantity","c1-pronouns-other","c1-adverb-phrases","c1-verb-patterns","c1-past-perfect-advanced","c1-future-perfect","c1-passive-modal","c1-future-alternatives","c1-subjunctive","c1-questions-advanced","c1-comparative-adjectives","c2-conditionals-formal","c2-absolute-clauses","c2-fronting-ellipsis","c2-negation-advanced","c2-modality-deduction","c2-modality-obligation","c2-modality-stance","c2-determiners-demonstratives","c2-information-structure","c2-register-rewrite","c2-prescriptive-rules","c2-uk-us"];
  const KEY = (id) => "aio-gn:" + id;
  const store = (id, obj) => { try { localStorage.setItem(KEY(id), JSON.stringify(obj)); } catch (e) {} };
  const load = (id) => { try { const s = localStorage.getItem(KEY(id)); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  const download = (name, obj) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: "application/json" }));
    a.download = name;
    a.click();
  };
  const cached = IDS.filter((id) => load(id) && !load(id)._error);
  console.log("BẮT ĐẦU v3 — cần fetch: " + (IDS.length - cached.length) + " node (cache có sẵn: " + cached.length + ")");
  let fresh = 0, consecutiveFail = 0, stoppedEarly = false;
  const partBucket = {};
  const flushPart = () => {
    const n = Object.keys(partBucket).length;
    if (!n) return;
    download("aio-grammar-nodes-part" + Math.ceil(fresh / 20) + ".json", partBucket);
    console.log("Đã tải phần lẻ: aio-grammar-nodes-part" + Math.ceil(fresh / 20) + ".json (" + n + " node)");
  };
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    if (load(id) && !load(id)._error) continue;
    let done = false, nodeOk = false;
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const r = await fetch("/api/ngu-phap/nodes/" + id, { credentials: "include" });
        const t = await r.text();
        if (r.status === 429) {
          console.warn("[" + (i + 1) + "/" + IDS.length + "] 429 — chờ 30s, thử lại lần " + (attempt + 1) + ":", id);
          await new Promise((s) => setTimeout(s, 30000));
          continue;
        }
        if (r.ok && t.trim().startsWith("{")) {
          const j = JSON.parse(t);
          store(id, j);
          partBucket[id] = j;
          fresh++;
          nodeOk = true;
          console.log("[" + (i + 1) + "/" + IDS.length + "] OK", id);
        } else {
          console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI HTTP " + r.status, id);
          store(id, { _error: "HTTP " + r.status });
        }
        done = true;
      } catch (e) {
        console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI mạng:", id, String(e));
        done = true;
      }
    }
    consecutiveFail = nodeOk ? 0 : consecutiveFail + 1;
    if (fresh > 0 && fresh % 20 === 0) flushPart();
    if (consecutiveFail >= 3) {
      console.warn("DỪNG SỚM: 3 node liên tiếp thất bại — khả năng block IP. Phần đã lấy được tải ngay.");
      stoppedEarly = true;
      break;
    }
    await new Promise((s) => setTimeout(s, 10000));
  }
  flushPart();
  const allOut = {};
  let nOk = 0;
  for (const id of IDS) { const v = load(id); if (v && !v._error) { allOut[id] = v; nOk++; } }
  download("aio-grammar-nodes-more.json", allOut);
  console.log((stoppedEarly ? "DỪNG SỚM" : "XONG") + " — node mới lấy được: " + nOk + "/" + IDS.length +
    ". Gửi file aio-grammar-nodes-more.json (cùng các part file nếu có) lại cho ZCode." +
    (nOk < IDS.length ? " Đổi server VPN rồi dán lại snippet này để lấy phần còn thiếu." : ""));
})();