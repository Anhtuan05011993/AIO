// TRÍCH NỘI DUNG 96 KHÓA A1 — /api/go-cau/course/{id}, delay 10s, retry 429 (30s×3), dừng sớm 3 fail liên tiếp + tải file.
// Chạy: https://aioenglish.com → F12 → Console → dán → Enter (~16 phút).
(async () => {
  const IDS = ["crs_c9ac3ba0d8ae726835","crs_491e2907413ba23b96","crs_75790d90022a81af54","crs_665d00bf6fc98ddd5a","crs_0bb4f0ff1e5bff4817","crs_eeefad2cbde7c0552e","crs_ee1841839d40cec7e7","crs_0d17a93ada29fd3a79","crs_ddbf325bb1ccda12c6","crs_500288099c5cb62c5f","crs_4eecd2f46e97fa634e","crs_5943ef947e647277b0","crs_922e2ad2259f0b128f","crs_941ba97b82f6c084a9","crs_e14598d5787e6e6056","crs_e57706edbad1f104ab","crs_dfe3a7b6ca11cc8377","crs_26bb36d624ff36b5fb","crs_41468f5624a4b9ecb6","crs_ce3ccc061908a38a3e","crs_5e74e7f18ebd7bdff5","crs_39bcd902963edfbf64","crs_952889cd075b2b9404","crs_7b51c0d3cfaea151e4","crs_aab596101c1e9b8a85","crs_ff87c9437eabf5c04f","crs_e3d88c054060c7ea6b","crs_ec21e0f024956c28c0","crs_6d5ad7d8ec5f877e33","crs_259348ba529536455a","crs_d7ddfa2672259ecc2c","crs_db9abb1d617ff10689","crs_5db4e1956750f32f00","crs_d02269f9f5011e943d","crs_99d294a8f6d1f0ab01","crs_fa1119f84ef166f7d3","crs_6a5a8b4aa1a6dbed28","crs_c956c4ec81f736c24f","crs_b81b533c354cc546cd","crs_496218943412de6fa5","crs_c7993b762804fba17c","crs_420c927cd3fbce554e","crs_4b23eb05726a338d40","crs_c675c25c88458640e3","crs_69a3c684f51d29dbfb","crs_f03086fde3aae62595","crs_29b46470f5c1416a23","crs_88f86036167060c23e","crs_0fa7de4e8244b858eb","crs_41522e327f15d58750","crs_626ef67e2a53ea83b4","crs_fff055c3cba4954732","crs_bc44e11bed69482874","crs_2f721f1ac96684bec4","crs_daa34237a0bb4ed605","crs_850f37b7b4bb462e4d","crs_e05b2968608c6943fd","crs_41743874c9820c42a4","crs_4040cf3d9a6e537af7","crs_cfcbd0d12ea4466041","crs_d01240da502bc28e77","crs_c4292192fc23690ccf","crs_5936ac20764212a925","crs_55fea91922f21d7942","crs_70b3acb1da62a04eee","crs_79e580ce439bc5238a","crs_48c2306095596c5771","crs_135d1f9013104b2e7c","crs_ed8910e710724fe391","crs_ab2b931cedbca45932","crs_f4f6dc9a4a27b00879","crs_2e92578ff42007c2fd","crs_d48ce36c916c56b46a","crs_bd2df604064391a430","crs_6d26ef03a7be514939","crs_a3c735b2232b852e27","crs_ee002a9f872fbdff14","crs_d859a0911c6516c7e2","crs_7a99ca8ef0764508f6","crs_4136d095862d01ed55","crs_fda26753d89e21c1a3","crs_cf9568c1b56585ed23","crs_a968feae20b573c13a","crs_360f5e2fa74e5d44fd","crs_3ed6eb4b37e4caf426","crs_5c5f296c8d97d9ed5f","crs_93d38b20cce3b5440c","crs_a9b8d9a8a623b2e055","crs_7c25b7d5cc14034e07","crs_06485aed732d76bca3","crs_0fcbcfedec98126598","crs_7edddc47c5c93ed74d","crs_0cb40fd185cd43414c","crs_52e2b0f3f55eb0661c","crs_ced5649d9cee6c0045","crs_46be39b84a69022944"];
  const out = {};
  let ok = 0, failStreak = 0;
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    let done = false;
    for (let att = 0; att < 3 && !done; att++) {
      try {
        const r = await fetch("/api/go-cau/course/" + id, { credentials: "include" });
        const t = await r.text();
        if (r.status === 429) { console.warn("[" + (i + 1) + "/" + IDS.length + "] 429 — chờ 30s, lần " + (att + 1), id); await new Promise((s) => setTimeout(s, 30000)); continue; }
        if (r.ok && t.trim().startsWith("{")) { out[id] = JSON.parse(t); ok++; console.log("[" + (i + 1) + "/" + IDS.length + "] OK", id); }
        else { console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI HTTP", r.status, id); done = true; }
        done = true;
      } catch (e) { console.warn("LỖI mạng", id); done = true; }
    }
    failStreak = done && out[id] ? 0 : failStreak + 1;
    if (failStreak >= 3) { console.warn("DỪNG SỚM: 3 khóa liên tiếp thất bại — khả năng bị block. Tải phần đã có."); break; }
    await new Promise((s) => setTimeout(s, 10000));
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: "application/json" }));
  a.download = "aio-courses-a1.json";
  a.click();
  console.log((failStreak >= 3 ? "DỪNG SỚM" : "XONG") + " — ok:", ok + "/" + IDS.length, "— gửi file aio-courses-a1.json cho ZCode.");
})();