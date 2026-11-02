// TLS-fingerprint probe: Chrome-like ciphers/groups/sigalgs + h2 + browser headers.
import http2 from "node:http2";

const CHROME_CIPHERS = [
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_CHACHA20_POLY1305_SHA256",
  "ECDHE-ECDSA-AES128-GCM-SHA256",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-CHACHA20-POLY1305",
  "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-RSA-AES128-SHA",
  "ECDHE-RSA-AES256-SHA",
  "AES128-GCM-SHA256",
  "AES256-GCM-SHA384",
  "AES128-SHA",
  "AES256-SHA",
].join(":");

function chromeHeaders(authority, path, extra = {}) {
  return {
    ":method": "GET",
    ":path": path,
    ":scheme": "https",
    ":authority": authority,
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "accept": "application/json, text/plain, */*",
    "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "accept-encoding": "gzip, deflate, br",
    ...extra,
  };
}

function request(authority, path, headers = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    const client = http2.connect(`https://${authority}`, {
      ciphers: CHROME_CIPHERS,
      ecdhCurve: "X25519:P-256:P-384",
      sigalgs: "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512",
      minVersion: "TLSv1.2",
      maxVersion: "TLSv1.3",
      ALPNProtocols: ["h2", "http/1.1"],
      settings: { enablePush: false },
    });
    client.on("error", (err) => { client.close(); reject(err); });
    const req = client.request({ ...chromeHeaders(authority, path, headers), ":method": method });
    const chunks = [];
    const resHeaders = {};
    req.on("response", (h) => { Object.assign(resHeaders, h); });
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      client.close();
      resolve({ status: resHeaders[":status"], headers: resHeaders, body: Buffer.concat(chunks).toString("utf8") });
    });
    req.on("error", (err) => { client.close(); reject(err); });
    req.end();
  });
}

const target = process.argv[2] || "/api/go-cau/course/crs_854f922c7ae581c8c7";
try {
  const r = await request("aioenglish.com", target);
  console.log("status:", r.status);
  let body = r.body;
  try { const j = JSON.parse(body); console.log("json:", JSON.stringify(j).slice(0, 300)); }
  catch { console.log("body:", body.slice(0, 200)); }
} catch (e) {
  console.log("ERROR:", e.message);
}
