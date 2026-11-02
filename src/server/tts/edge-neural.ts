// Neural TTS server-side (nodejs runtime only).
// Backend 1: package `edge-tts-universal` (API chính thức của project).
// Backend 2: WebSocket client tự viết trên node:tls với token Sec-MS-GEC v2 —
// cần thiết vì Microsoft từ 10/2026 ép token v2, edge-tts-universal@1.4.0
// (token v1) bị 403 và treo vô hạn (rany2/edge-tts#490, fix ở edge-tts 7.3.0).
// Thuật toán token port từ drm.py của edge-tts, đã đối chiếu đúng test vector
// chính thức. Dùng node:tls thay vì package `ws` vì ws bị Next bundle làm hỏng
// luồng event ('open' có nhưng 'message' không bao giờ fire).
// Chiến lược: request đầu chạy direct (nhanh, chắc chắn được) + probe package
// ngầm; package còn hoạt động thì các request sau dùng package, không thì bám direct.

import { randomUUID, randomBytes, createHash } from "crypto";
import { connect as tlsConnect, type TLSSocket } from "tls";
import { EdgeTTS } from "edge-tts-universal";

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WSS_HOST = "speech.platform.bing.com";
const WSS_PATH = "/consumer/speech/synthesize/readaloud/edge/v1";
const SEC_MS_GEC_VERSION = "2-143.0.3650.75";
const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
const DIRECT_TIMEOUT_MS = 10000;
const PACKAGE_TIMEOUT_MS = 12000;
// Dịch vụ Edge TTS thỉnh thoảng tự ngắt kết nối theo từng đợt (throttle IP) —
// retry có backoff; hết retry thì route trả 502 và speech.ts fallback Web Speech.
const DIRECT_ATTEMPTS = 4;
const DIRECT_BACKOFF_MS = [300, 900, 2000];

// ---------------------------------------------------------------------------
// Sec-MS-GEC v2 (port từ drm.py — edge-tts, đã đối chiếu test vector)
// ---------------------------------------------------------------------------

const rotr = (x: number, n: number): number => ((x >>> n) | (x << (32 - n))) >>> 0;
const rol16 = (v: number): number => (((v & 0xffff) << 16) | (v >>> 16)) >>> 0;
const sigma0 = (v: number): number => (rotr(v, 7) ^ rotr(v, 18) ^ (v >>> 3)) >>> 0;
const sigma1 = (v: number): number => (rotr(v, 17) ^ rotr(v, 19) ^ (v >>> 10)) >>> 0;

const SHA256_INITIAL = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const SHA256_STATE = [0xfd9fbea2, 0x91243ce7, 0xbe499094, 0xcd2e1e0a, 0x6c006f49, 0x04bd35ab, 0xfeb0a7e4, 0x03effbd2];
const SHA256_SCHEDULE = [
  0xeb24bf9e, 0x1558691f, 0xa0c09ee2, 0x0cfa32ba, 0xa622ee8c, 0xd1dd9491, 0xc0dd25a0, 0xf9e70ab6,
  0xf0c31573, 0x7058ce4e, 0x7188e606, 0x00e5ab33, 0xd258b060, 0x72766564,
];
const SHA256_ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
const SHA256_ADJUSTMENT = 0xc9dc06a7;
// Hằng số vòng 14 bị thay trong block đầu (first_round = 14).
const SHA256_BLOCK_CONSTANTS = [...SHA256_ROUND_CONSTANTS.slice(0, 14), SHA256_ADJUSTMENT, ...SHA256_ROUND_CONSTANTS.slice(15)];
const SIGMA0_ADJ = 0x059c0b80;
const SIGMA1_ADJ = 0x000b92c0;

const CS64_COEFFICIENTS: Array<[number, number]> = [
  [0xe82e91b1, 0xb32700d0], [0x44de24c6, 0x88dff51d], [0x3beb65bc, 0x29514038],
  [0xc89c5933, 0xb328cbdf], [0x8d1ec211, 0xd405b4d5], [0x314ef5d5, 0x26e55f3c],
  [0xe92491b1, 0x607801c6], [0xf0a5b9d5, 0x82b2c1fb], [0x06064cf3, 0xfa51a3da],
  [0xda79fa60, 0x207cc464], [0xbed20560, 0x3c3c74f3], [0x89f9c9f8, 0xd2d14b61],
  [0x35fa38c6, 0xbb04a2c1], [0xcb49e3c6, 0xc5626167],
];
const CS64_FACTOR = 0x82893933;
const CS64_ADJ0 = 0xf2f90b1a;
const CS64_ADJ1 = 0x0b1a0000;

function expandSchedule(words: number[], firstWord = 16): void {
  for (let index = firstWord; index < 64; index++) {
    const x = words[index - 2];
    const y = words[index - 15];
    const s1 = (rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10)) >>> 0;
    const s0 = (rotr(y, 7) ^ rotr(y, 18) ^ (y >>> 3)) >>> 0;
    words.push((s1 + words[index - 7] + s0 + words[index - 16]) >>> 0);
  }
}

function sha256Rounds(state: number[], words: number[], firstRound = 0): number[] {
  let [a, b, c, d, e, f, g, h] = state;
  const K = firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
  for (let index = firstRound; index < 64; index++) {
    const t1 =
      (h +
        ((rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0) +
        ((g ^ (e & (f ^ g))) >>> 0) +
        K[index] +
        words[index]) >>>
      0;
    const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0) + (((a & b) | (c & (a | b))) >>> 0);
    h = g;
    g = f;
    f = e;
    e = (d + t1) >>> 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) >>> 0;
  }
  return [a, b, c, d, e, f, g, h];
}

/** SHA-256 biến thể (block đầu 7 byte salt) — port `_sha256_init` + `_sha256_digest`. */
function sha256Digest(data: Uint8Array): Uint8Array {
  if (data.length < 7) throw new Error("Token salt must contain at least seven bytes");
  const length = 57 + data.length;
  const padded = [...data.slice(7), 0x80];
  const zeros = ((((55 - length) % 64) + 64) % 64);
  for (let i = 0; i < zeros; i++) padded.push(0);
  const bits = BigInt(length) * 8n;
  for (let i = 7; i >= 0; i--) padded.push(Number((bits >> BigInt(i * 8)) & 0xffn));

  // Block đầu: 14 word 0 + data[:3] (số 24-bit cuối word) + data[3:7] (32-bit BE).
  const init = (prefix: Uint8Array): number[] => {
    const words: number[] = new Array<number>(14).fill(0);
    words.push(((prefix[0] << 16) | (prefix[1] << 8) | prefix[2]) >>> 0);
    words.push(((prefix[3] << 24) | (prefix[4] << 16) | (prefix[5] << 8) | prefix[6]) >>> 0);
    for (let index = 16; index <= 29; index++) {
      let value = SHA256_SCHEDULE[index - 16];
      if (index - 2 >= 14) {
        value += index === 16 ? ((sigma1(words[index - 2]) ^ SIGMA1_ADJ) >>> 0) : sigma1(words[index - 2]);
      }
      if (index - 7 >= 14) value += words[index - 7];
      if (index - 15 >= 14) {
        value += index === 29 ? ((sigma0(words[index - 15]) ^ SIGMA0_ADJ) >>> 0) : sigma0(words[index - 15]);
      }
      words.push(value >>> 0);
    }
    words.push(
      (sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + SHA256_ADJUSTMENT - SHA256_ROUND_CONSTANTS[14]) >>> 0,
    );
    expandSchedule(words, 31);
    const working = sha256Rounds(SHA256_STATE, words, 14);
    return SHA256_INITIAL.map((v, i) => (v + working[i]) >>> 0);
  };

  let state = init(data.slice(0, 7));
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words: number[] = [];
    for (let j = 0; j < 16; j++) {
      const o = offset + j * 4;
      words.push(((padded[o] << 24) | (padded[o + 1] << 16) | (padded[o + 2] << 8) | padded[o + 3]) >>> 0);
    }
    expandSchedule(words, 16);
    const working = sha256Rounds(state, words, 0);
    state = state.map((v, i) => (v + working[i]) >>> 0);
  }
  const out = new Uint8Array(32);
  state.forEach((w, i) => {
    out[i * 4] = w >>> 24;
    out[i * 4 + 1] = (w >>> 16) & 0xff;
    out[i * 4 + 2] = (w >>> 8) & 0xff;
    out[i * 4 + 3] = w & 0xff;
  });
  return out;
}

/** Tách data thành word LE 32-bit, đệm 0 đến chẵn, đủ chẵn số word. */
function wordsLE4Even(data: Uint8Array): number[] {
  const paddedLen = data.length + ((((-data.length) % 4) + 4) % 4);
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  const words: number[] = [];
  for (let i = 0; i < paddedLen; i += 4) {
    words.push((padded[i] | (padded[i + 1] << 8) | (padded[i + 2] << 16) | (padded[i + 3] << 24)) >>> 0);
  }
  if (words.length % 2) words.push(0);
  return words;
}

/** Port `_cs64_digest` — digeste CS64 của token. */
function cs64Digest(data: Uint8Array, digest: Uint8Array): [number, number] {
  let keyA = ((digest[0] | (digest[1] << 8) | (digest[2] << 16) | (digest[3] << 24)) >>> 0) | 1;
  let keyB = ((digest[4] | (digest[5] << 8) | (digest[6] << 16) | (digest[7] << 24)) >>> 0) | 1;
  const factorA = Math.imul(keyA, CS64_FACTOR) >>> 0;
  const factorB = Math.imul(keyB, CS64_FACTOR) >>> 0;
  const terms = CS64_COEFFICIENTS.map(([coefficient], index) => Math.imul(coefficient, index % 2 === 0 ? factorA : factorB) >>> 0);
  const offsets = CS64_COEFFICIENTS.map(([, offset]) => offset);
  const words = wordsLE4Even(new Uint8Array([0, ...data]));
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    let term = Math.imul(word, index % 2 === 0 ? keyA : keyB) >>> 0;
    let offset = Math.imul(rol16(word), index % 2 === 0 ? 0xef0569fb : 0xc31713db) >>> 0;
    if (index === 0) {
      term = (term + Math.imul(CS64_ADJ0, factorA)) >>> 0;
      offset = (offset + CS64_ADJ1) >>> 0;
    }
    terms.push(term);
    offsets.push(offset);
  }
  let swapAcc = 0;
  let swapLast = 0;
  let state = 0;
  let acc = 0;
  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index];
    const y = terms[index + 1];
    let t = rol16((offsets[index] + x) >>> 0);
    let q = Math.imul(t, 0x76f50f34) >>> 0;
    swapAcc = (swapAcc + (((Math.imul(rol16(q), 0xc3efea97) >>> 0) + q) % 4294967296)) % 4294967296;
    t = rol16((offsets[index + 1] + y) >>> 0);
    q = Math.imul(t, 0x1881ce3c) >>> 0;
    swapLast = ((Math.imul(rol16(q), 0x35bd1ec9) >>> 0) + q) % 4294967296;
    swapAcc = (swapAcc + swapLast) % 4294967296;

    state = ((Math.imul(state, keyA) >>> 0) + x) % 4294967296;
    state = Math.imul(rol16(state), 0xcf98b111) % 4294967296;
    state = Math.imul(rol16(state), 0x87085b9f) % 4294967296;
    state = Math.imul(rol16(state), 0x12ceb96d) % 4294967296;
    state = Math.imul(rol16(state), 0x257e1d83) % 4294967296;
    acc = (acc + state) % 4294967296;
    t = ((Math.imul(state, keyB) >>> 0) + y) % 4294967296;
    t = Math.imul(rol16(t), 0xa27416f5) % 4294967296;
    t = Math.imul(rol16(t), 0xd38396ff) % 4294967296;
    state = Math.imul(rol16(Math.imul(rol16(t), 0x7c932b89) % 4294967296), 0xbfa49f69) % 4294967296;
    acc = (acc + state) % 4294967296;
  }
  return [(swapLast ^ state) >>> 0, (swapAcc ^ acc) >>> 0];
}

/** Token Sec-MS-GEC v2 dạng "<16 hex>-<64 hex>" (đã đối chiếu test vector chính thức). */
function generateSecMsGecV2(unixTimestamp: number): string {
  let ticks = unixTimestamp + 11644473600; // WIN_EPOCH
  ticks -= ticks % 300;
  ticks *= 1e7; // 100ns ticks — giữ nguyên đường float như bản gốc
  const strToHash = `${ticks.toFixed(0)}${TRUSTED_CLIENT_TOKEN}`;
  const bytes = new Uint8Array(Buffer.from(strToHash, "ascii"));
  const digest = sha256Digest(bytes);
  const [w1, w2] = cs64Digest(bytes, digest);
  // struct.pack("<II") — mỗi word packed little-endian.
  const cs64 = [w1, w2]
    .flatMap((w) => [w & 0xff, (w >>> 8) & 0xff, (w >>> 16) & 0xff, (w >>> 24) & 0xff])
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const sha = [...digest].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${cs64}-${sha}`;
}

// ---------------------------------------------------------------------------
// Backend direct — WebSocket tự viết trên node:tls (token v2), cùng protocol
// với package (speech.config → ssml → binary audio / turn.end).
// ---------------------------------------------------------------------------

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function randomHex32(): string {
  return randomUUID().replace(/-/g, "");
}

/** Gửi 1 WebSocket frame từ client (bắt buộc mask). */
function sendWsFrame(socket: TLSSocket, opcode: number, payload: Buffer): void {
  const mask = randomBytes(4);
  let header: Buffer;
  if (payload.length < 126) {
    header = Buffer.from([0x80 | opcode, 0x80 | payload.length]);
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 0x80 | 127;
    header.writeUInt32BE(Math.floor(payload.length / 4294967296), 2);
    header.writeUInt32BE(payload.length >>> 0, 6);
  }
  const masked = Buffer.from(payload);
  for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
  socket.write(Buffer.concat([header, mask, masked]));
}

/** Tổng hợp 1 đoạn text thành mp3 qua WebSocket trực tiếp (token v2). Thử tối đa 2 lần. */
async function synthViaDirect(text: string, voice: string): Promise<ArrayBuffer> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < DIRECT_ATTEMPTS; attempt++) {
    try {
      return await synthViaDirectOnce(text, voice);
    } catch (err) {
      lastErr = err;
      if (attempt + 1 < DIRECT_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, DIRECT_BACKOFF_MS[attempt] ?? 1000));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

function synthViaDirectOnce(text: string, voice: string): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const secMsGec = generateSecMsGecV2(Date.now() / 1000);
    const path =
      `${WSS_PATH}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
      `&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${randomHex32()}`;
    const wsKey = randomBytes(16).toString("base64");
    const muid = randomHex32().toUpperCase();

    const chunks: Buffer[] = [];
    let total = 0;
    let finished = false;
    let handshakeDone = false;
    let headerBuf = Buffer.alloc(0);
    let frameBuf = Buffer.alloc(0);
    let msgOpcode = 0;
    let msgParts: Buffer[] = [];

    const socket: TLSSocket = tlsConnect({ host: WSS_HOST, port: 443, servername: WSS_HOST });

    const finish = (err: Error | null): void => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      socket.destroy();
      if (err) reject(err);
      else {
        const out = new ArrayBuffer(total);
        const view = new Uint8Array(out);
        let at = 0;
        for (const chunk of chunks) {
          view.set(chunk, at);
          at += chunk.length;
        }
        resolve(out);
      }
    };

    // Chống treo vô hạn.
    const watchdog = setTimeout(() => finish(new Error("Direct TTS timeout")), DIRECT_TIMEOUT_MS);

    const handleMessage = (opcode: number, data: Buffer): void => {
      if (opcode === 1) {
        // Text frame: Path:ssml response. turn.end = hết lượt.
        if (data.toString().includes("Path:turn.end")) {
          finish(total > 0 ? null : new Error("No audio received"));
        }
        return;
      }
      // Binary frame audio: 2 byte đầu = độ dài header.
      if (data.length > 2) {
        const headerLen = data.readUInt16BE(0);
        const audio = data.subarray(headerLen + 2);
        if (audio.length > 0) {
          chunks.push(Buffer.from(audio));
          total += audio.length;
        }
      }
    };

    const handleFrame = (opcode: number, fin: boolean, payload: Buffer): void => {
      if (opcode === 0x8) {
        finish(total > 0 ? null : new Error("Connection closed without audio"));
        return;
      }
      if (opcode === 0x9) {
        sendWsFrame(socket, 0xa, payload); // ping → pong
        return;
      }
      if (opcode === 0xa) return; // pong
      if (opcode === 0x1 || opcode === 0x2) {
        msgOpcode = opcode;
        msgParts = [payload];
      } else if (opcode === 0x0 && msgParts.length > 0) {
        msgParts.push(payload); // continuation frame
      } else {
        return;
      }
      if (fin) {
        const data = Buffer.concat(msgParts);
        msgParts = [];
        handleMessage(msgOpcode, data);
      }
    };

    const handleData = (buf: Buffer): void => {
      frameBuf = Buffer.concat([frameBuf, buf]);
      for (;;) {
        if (frameBuf.length < 2) return;
        const b0 = frameBuf[0];
        const b1 = frameBuf[1];
        const fin = (b0 & 0x80) !== 0;
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0; // server → client: luôn 0
        let len = b1 & 0x7f;
        let off = 2;
        if (len === 126) {
          if (frameBuf.length < off + 2) return;
          len = frameBuf.readUInt16BE(off);
          off += 2;
        } else if (len === 127) {
          if (frameBuf.length < off + 8) return;
          len = frameBuf.readUInt32BE(off) * 4294967296 + frameBuf.readUInt32BE(off + 4);
          off += 8;
        }
        const maskLen = masked ? 4 : 0;
        if (frameBuf.length < off + maskLen + len) return;
        const payload = frameBuf.subarray(off + maskLen, off + maskLen + len);
        frameBuf = frameBuf.subarray(off + maskLen + len);
        handleFrame(opcode, fin, payload);
        if (finished) return;
      }
    };

    socket.on("error", (err) => finish(err));
    socket.on("close", () => finish(total > 0 ? null : new Error("Connection closed without audio")));
    socket.on("data", (buf: Buffer) => {
      if (finished) return;
      if (!handshakeDone) {
        headerBuf = Buffer.concat([headerBuf, buf]);
        const idx = headerBuf.indexOf("\r\n\r\n");
        if (idx < 0) return;
        const head = headerBuf.subarray(0, idx).toString("latin1");
        const statusLine = head.split("\r\n")[0];
        if (!/^HTTP\/1\.1 101/i.test(statusLine)) {
          finish(new Error(`TTS handshake rejected (${statusLine})`));
          return;
        }
        // Kiểm tra Sec-WebSocket-Accept (RFC 6455).
        const expect = createHash("sha1").update(wsKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
        if (!head.includes(expect)) {
          finish(new Error("TTS handshake: Sec-WebSocket-Accept sai"));
          return;
        }
        handshakeDone = true;
        const rest = headerBuf.subarray(idx + 4);
        if (rest.length > 0) handleData(rest);
        if (finished || socket.destroyed) return;
        // Handshake xong → gửi speech.config + ssml.
        const config = {
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
                outputFormat: OUTPUT_FORMAT,
              },
            },
          },
        };
        sendWsFrame(
          socket,
          0x1,
          Buffer.from(
            `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${JSON.stringify(config)}`,
            "utf8",
          ),
        );
        const ssml =
          `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${voice.split("-").slice(0, 2).join("-")}'>` +
          `<voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
        sendWsFrame(
          socket,
          0x1,
          Buffer.from(
            `X-RequestId:${randomHex32()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n${ssml}`,
            "utf8",
          ),
        );
        return;
      }
      handleData(buf);
    });

    // Gửi HTTP Upgrade handshake.
    socket.on("connect", () => {
      socket.write(
        `GET ${path} HTTP/1.1\r\n` +
          `Host: ${WSS_HOST}\r\n` +
          `Upgrade: websocket\r\n` +
          `Connection: Upgrade\r\n` +
          `Sec-WebSocket-Key: ${wsKey}\r\n` +
          `Sec-WebSocket-Version: 13\r\n` +
          `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0\r\n` +
          `Accept-Encoding: gzip, deflate, br, zstd\r\n` +
          `Accept-Language: en-US,en;q=0.9\r\n` +
          `Pragma: no-cache\r\n` +
          `Cache-Control: no-cache\r\n` +
          `Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold\r\n` +
          `Cookie: muid=${muid};\r\n` +
          `\r\n`,
      );
    });
  });
}

// ---------------------------------------------------------------------------
// Backend package (edge-tts-universal) + chọn backend
// ---------------------------------------------------------------------------

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timeout (${ms}ms)`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Package edge-tts-universal (API chuẩn project) → mp3 bytes. */
async function synthViaPackage(text: string, voice: string): Promise<ArrayBuffer> {
  const { audio } = await new EdgeTTS(text, voice).synthesize();
  return audio.arrayBuffer();
}

let pkgState: "unknown" | "ok" | "broken" = "unknown";
let probeStarted = false;

/** Probe package 1 lần mỗi process (fire-and-forget) để biết có dùng được không. */
function probePackage(): void {
  if (probeStarted) return;
  probeStarted = true;
  void withTimeout(synthViaPackage("ok.", "en-US-AriaNeural"), 10000, "TTS probe")
    .then((bytes) => {
      pkgState = bytes.byteLength > 0 ? "ok" : "broken";
    })
    .catch(() => {
      pkgState = "broken";
    });
}

/** Chọn backend và tổng hợp mp3. Không bao giờ treo quá timeout. */
export async function synthesizeNeural(text: string, voice: string): Promise<ArrayBuffer> {
  if (pkgState === "unknown") {
    probePackage();
    // Package chưa rõ tình hình → direct ngay cho nhanh; probe quyết định các lần sau.
    return synthViaDirect(text, voice);
  }
  if (pkgState === "ok") {
    try {
      return await withTimeout(synthViaPackage(text, voice), PACKAGE_TIMEOUT_MS, "Package TTS");
    } catch {
      pkgState = "broken"; // package hỏng → chuyển hẳn sang direct
    }
  }
  return synthViaDirect(text, voice);
}
