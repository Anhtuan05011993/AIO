// Login via API with Chrome-like TLS fingerprint, capture session cookie.
import http2 from "node:http2";

const CHROME_CIPHERS = [
  "TLS_AES_128_GCM_SHA256", "TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256",
  "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-CHACHA20-POLY1305", "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-RSA-AES128-SHA", "ECDHE-RSA-AES256-SHA", "AES128-GCM-SHA256",
  "AES256-GCM-SHA384", "AES128-SHA", "AES256-SHA",
].join(":");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36";

function connect() {
  return http2.connect("https://aioenglish.com", {
    ciphers: CHROME_CIPHERS,
    ecdhCurve: "X25519:P-256:P-384",
    sigalgs: "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512",
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.3",
    ALPNProtocols: ["h2", "http/1.1"],
  });
}

function req(client, headers, body) {
  return new Promise((resolve, reject) => {
    const r = client.request(headers);
    const chunks = [];
    const resH = {};
    r.on("response", (h) => Object.assign(resH, h));
    r.on("data", (c) => chunks.push(c));
    r.on("end", () => resolve({ status: resH[":status"], headers: resH, body: Buffer.concat(chunks).toString("utf8") }));
    r.on("error", (e) => reject(e));
    if (body) r.end(body); else r.end();
  });
}

const email = process.argv[2];
const password = process.argv[3];

const client = connect();
try {
  // warm-up homepage (some anti-abuse flows require a prior page hit)
  await req(client, {
    ":method": "GET", ":path": "/", ":scheme": "https", ":authority": "aioenglish.com",
    "user-agent": UA, "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7", "accept-encoding": "identity",
  });
  const payload = JSON.stringify({ email, password });
  const res = await req(client, {
    ":method": "POST", ":path": "/api/auth/login", ":scheme": "https", ":authority": "aioenglish.com",
    "user-agent": UA, "content-type": "application/json", "accept": "application/json",
    "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7", "accept-encoding": "identity",
    "origin": "https://aioenglish.com", "referer": "https://aioenglish.com/auth/login",
    "content-length": Buffer.byteLength(payload),
  }, payload);
  console.log("login status:", res.status);
  const setCookie = [];
  for (const [k, v] of Object.entries(res.headers)) if (k === "set-cookie") setCookie.push(v);
  console.log("set-cookie count:", setCookie.length);
  setCookie.forEach(c => console.log("  cookie:", String(c).split(";")[0].slice(0, 80)));
  console.log("body:", res.body.slice(0, 300));
} catch (e) {
  console.log("ERROR:", e.message);
} finally {
  client.close();
}
