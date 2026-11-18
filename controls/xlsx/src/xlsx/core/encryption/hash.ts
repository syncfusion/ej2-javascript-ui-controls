/**
 * Synchronous SHA-1 / SHA-256 / SHA-384 / SHA-512 and HMAC in pure TypeScript.
 *
 * Offline and dependency-free so encryption works in browsers and Node.js alike
 * (see `.agent/policies/offline.md`). Constants are the FIPS 180-4
 * values (fractional parts of square and cube roots of the first primes).
 *
 * @private
 */

/** Hash algorithms named by ECMA-376 Part 1 §18.2 / MS-OFFCRYPTO. */
export type HashAlgorithm = 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512';

const K256: number[] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
const IV256: number[] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];
const K512: number[] = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817,
];
const IV512: number[] = [
    0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
];
const IV384: number[] = [
    0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17, 0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4,
];

const TWO32: number = 4294967296;

/**
 * Digest length in bytes.
 *
 * @param {HashAlgorithm} algorithm - Hash algorithm.
 * @returns {number} Output size in bytes.
 */
export function hashSize(algorithm: HashAlgorithm): number {
    switch (algorithm) {
    case 'SHA1': return 20;
    case 'SHA256': return 32;
    case 'SHA384': return 48;
    default: return 64;
    }
}

/**
 * Hash block length in bytes (used by HMAC).
 *
 * @param {HashAlgorithm} algorithm - Hash algorithm.
 * @returns {number} Block size in bytes.
 */
function blockSize(algorithm: HashAlgorithm): number {
    return algorithm === 'SHA384' || algorithm === 'SHA512' ? 128 : 64;
}

/**
 * Computes a message digest.
 *
 * @param {HashAlgorithm} algorithm - Hash algorithm.
 * @param {Uint8Array} data - Message bytes.
 * @returns {Uint8Array} Digest bytes.
 */
export function computeHash(algorithm: HashAlgorithm, data: Uint8Array): Uint8Array {
    switch (algorithm) {
    case 'SHA1': return sha1(data);
    case 'SHA256': return sha256(data);
    case 'SHA384': return sha512Core(data, IV384, 48);
    default: return sha512Core(data, IV512, 64);
    }
}

/**
 * Computes HMAC (RFC 2104).
 *
 * @param {HashAlgorithm} algorithm - Hash algorithm.
 * @param {Uint8Array} key - Secret key.
 * @param {Uint8Array} data - Message bytes.
 * @returns {Uint8Array} MAC bytes.
 */
export function computeHmac(algorithm: HashAlgorithm, key: Uint8Array, data: Uint8Array): Uint8Array {
    const bs: number = blockSize(algorithm);
    const k: Uint8Array = new Uint8Array(bs);
    k.set(key.length > bs ? computeHash(algorithm, key) : key);
    const inner: Uint8Array = new Uint8Array(bs + data.length);
    const outerPad: Uint8Array = new Uint8Array(bs);
    for (let i: number = 0; i < bs; i++) {
        inner[i] = k[i] ^ 0x36;
        outerPad[i] = k[i] ^ 0x5c;
    }
    inner.set(data, bs);
    const innerHash: Uint8Array = computeHash(algorithm, inner);
    const outer: Uint8Array = new Uint8Array(bs + innerHash.length);
    outer.set(outerPad);
    outer.set(innerHash, bs);
    return computeHash(algorithm, outer);
}

/**
 * Pads a message with the Merkle–Damgård suffix (0x80, zeros, big-endian bit length).
 *
 * @param {Uint8Array} data - Message bytes.
 * @param {number} block - Block size (64 or 128).
 * @returns {Uint8Array} Padded copy.
 */
function padMessage(data: Uint8Array, block: number): Uint8Array {
    const lenBytes: number = block === 128 ? 16 : 8;
    const total: number = Math.ceil((data.length + 1 + lenBytes) / block) * block;
    const out: Uint8Array = new Uint8Array(total);
    out.set(data);
    out[data.length] = 0x80;
    const bitsHigh: number = Math.floor(data.length / 0x20000000);
    const bitsLow: number = (data.length << 3) >>> 0;
    const end: number = total - 8;
    out[end] = (bitsHigh >>> 24) & 0xff;
    out[end + 1] = (bitsHigh >>> 16) & 0xff;
    out[end + 2] = (bitsHigh >>> 8) & 0xff;
    out[end + 3] = bitsHigh & 0xff;
    out[end + 4] = (bitsLow >>> 24) & 0xff;
    out[end + 5] = (bitsLow >>> 16) & 0xff;
    out[end + 6] = (bitsLow >>> 8) & 0xff;
    out[end + 7] = bitsLow & 0xff;
    return out;
}

function sha1(data: Uint8Array): Uint8Array {
    const msg: Uint8Array = padMessage(data, 64);
    const w: Int32Array = new Int32Array(80);
    let h0: number = 0x67452301;
    let h1: number = 0xefcdab89 | 0;
    let h2: number = 0x98badcfe | 0;
    let h3: number = 0x10325476;
    let h4: number = 0xc3d2e1f0 | 0;
    for (let off: number = 0; off < msg.length; off += 64) {
        for (let t: number = 0; t < 16; t++) {
            const p: number = off + t * 4;
            w[t] = (msg[p] << 24) | (msg[p + 1] << 16) | (msg[p + 2] << 8) | msg[p + 3];
        }
        for (let t: number = 16; t < 80; t++) {
            const x: number = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
            w[t] = (x << 1) | (x >>> 31);
        }
        let a: number = h0;
        let b: number = h1;
        let c: number = h2;
        let d: number = h3;
        let e: number = h4;
        for (let t: number = 0; t < 80; t++) {
            let f: number;
            let k: number;
            if (t < 20) {
                f = (b & c) | (~b & d);
                k = 0x5a827999;
            } else if (t < 40) {
                f = b ^ c ^ d;
                k = 0x6ed9eba1;
            } else if (t < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8f1bbcdc | 0;
            } else {
                f = b ^ c ^ d;
                k = 0xca62c1d6 | 0;
            }
            const tmp: number = (((a << 5) | (a >>> 27)) + f + e + k + w[t]) | 0;
            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = tmp;
        }
        h0 = (h0 + a) | 0;
        h1 = (h1 + b) | 0;
        h2 = (h2 + c) | 0;
        h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0;
    }
    return wordsToBytes([h0, h1, h2, h3, h4], 20);
}

function sha256(data: Uint8Array): Uint8Array {
    const msg: Uint8Array = padMessage(data, 64);
    const w: Int32Array = new Int32Array(64);
    const h: Int32Array = new Int32Array(IV256);
    for (let off: number = 0; off < msg.length; off += 64) {
        for (let t: number = 0; t < 16; t++) {
            const p: number = off + t * 4;
            w[t] = (msg[p] << 24) | (msg[p + 1] << 16) | (msg[p + 2] << 8) | msg[p + 3];
        }
        for (let t: number = 16; t < 64; t++) {
            const x: number = w[t - 15];
            const y: number = w[t - 2];
            const s0: number = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
            const s1: number = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
            w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
        }
        let a: number = h[0];
        let b: number = h[1];
        let c: number = h[2];
        let d: number = h[3];
        let e: number = h[4];
        let f: number = h[5];
        let g: number = h[6];
        let hh: number = h[7];
        for (let t: number = 0; t < 64; t++) {
            const S1: number = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
            const ch: number = (e & f) ^ (~e & g);
            const t1: number = (hh + S1 + ch + K256[t] + w[t]) | 0;
            const S0: number = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            const maj: number = (a & b) ^ (a & c) ^ (b & c);
            const t2: number = (S0 + maj) | 0;
            hh = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        h[0] = (h[0] + a) | 0;
        h[1] = (h[1] + b) | 0;
        h[2] = (h[2] + c) | 0;
        h[3] = (h[3] + d) | 0;
        h[4] = (h[4] + e) | 0;
        h[5] = (h[5] + f) | 0;
        h[6] = (h[6] + g) | 0;
        h[7] = (h[7] + hh) | 0;
    }
    return wordsToBytes(Array.prototype.slice.call(h), 32);
}

/** 64-bit values are kept as (high, low) 32-bit pairs in interleaved arrays. */
function sha512Core(data: Uint8Array, iv: number[], outLen: number): Uint8Array {
    const msg: Uint8Array = padMessage(data, 128);
    const w: Int32Array = new Int32Array(160);
    const h: Int32Array = new Int32Array(iv);
    for (let off: number = 0; off < msg.length; off += 128) {
        for (let t: number = 0; t < 32; t++) {
            const p: number = off + t * 4;
            w[t] = (msg[p] << 24) | (msg[p + 1] << 16) | (msg[p + 2] << 8) | msg[p + 3];
        }
        for (let t: number = 16; t < 80; t++) {
            const xh: number = w[(t - 15) * 2];
            const xl: number = w[(t - 15) * 2 + 1];
            const yh: number = w[(t - 2) * 2];
            const yl: number = w[(t - 2) * 2 + 1];
            // sigma0 = rotr1 ^ rotr8 ^ shr7
            const s0h: number = ((xh >>> 1) | (xl << 31)) ^ ((xh >>> 8) | (xl << 24)) ^ (xh >>> 7);
            const s0l: number = ((xl >>> 1) | (xh << 31)) ^ ((xl >>> 8) | (xh << 24)) ^ ((xl >>> 7) | (xh << 25));
            // sigma1 = rotr19 ^ rotr61 ^ shr6
            const s1h: number = ((yh >>> 19) | (yl << 13)) ^ ((yl >>> 29) | (yh << 3)) ^ (yh >>> 6);
            const s1l: number = ((yl >>> 19) | (yh << 13)) ^ ((yh >>> 29) | (yl << 3)) ^ ((yl >>> 6) | (yh << 26));
            const lo: number = (w[(t - 16) * 2 + 1] >>> 0) + (s0l >>> 0) + (w[(t - 7) * 2 + 1] >>> 0) + (s1l >>> 0);
            const hi: number = w[(t - 16) * 2] + s0h + w[(t - 7) * 2] + s1h + Math.floor(lo / TWO32);
            w[t * 2] = hi | 0;
            w[t * 2 + 1] = lo | 0;
        }
        let ah: number = h[0];
        let al: number = h[1];
        let bh: number = h[2];
        let bl: number = h[3];
        let ch: number = h[4];
        let cl: number = h[5];
        let dh: number = h[6];
        let dl: number = h[7];
        let eh: number = h[8];
        let el: number = h[9];
        let fh: number = h[10];
        let fl: number = h[11];
        let gh: number = h[12];
        let gl: number = h[13];
        let hh: number = h[14];
        let hl: number = h[15];
        for (let t: number = 0; t < 80; t++) {
            // Sigma1(e) = rotr14 ^ rotr18 ^ rotr41
            const S1h: number = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
            const S1l: number = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));
            const chh: number = (eh & fh) ^ (~eh & gh);
            const chl: number = (el & fl) ^ (~el & gl);
            const t1lo: number = (hl >>> 0) + (S1l >>> 0) + (chl >>> 0) + (K512[t * 2 + 1] >>> 0) + (w[t * 2 + 1] >>> 0);
            const t1hi: number = (hh + S1h + chh + K512[t * 2] + w[t * 2] + Math.floor(t1lo / TWO32)) | 0;
            const t1l: number = t1lo | 0;
            // Sigma0(a) = rotr28 ^ rotr34 ^ rotr39
            const S0h: number = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
            const S0l: number = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));
            const mjh: number = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            const mjl: number = (al & bl) ^ (al & cl) ^ (bl & cl);
            const t2lo: number = (S0l >>> 0) + (mjl >>> 0);
            const t2hi: number = (S0h + mjh + Math.floor(t2lo / TWO32)) | 0;
            const t2l: number = t2lo | 0;
            hh = gh; hl = gl;
            gh = fh; gl = fl;
            fh = eh; fl = el;
            const elo: number = (dl >>> 0) + (t1l >>> 0);
            eh = (dh + t1hi + Math.floor(elo / TWO32)) | 0;
            el = elo | 0;
            dh = ch; dl = cl;
            ch = bh; cl = bl;
            bh = ah; bl = al;
            const alo: number = (t1l >>> 0) + (t2l >>> 0);
            ah = (t1hi + t2hi + Math.floor(alo / TWO32)) | 0;
            al = alo | 0;
        }
        const vars: number[] = [ah, al, bh, bl, ch, cl, dh, dl, eh, el, fh, fl, gh, gl, hh, hl];
        for (let i: number = 0; i < 16; i += 2) {
            const lo: number = (h[i + 1] >>> 0) + (vars[i + 1] >>> 0);
            h[i] = (h[i] + vars[i] + Math.floor(lo / TWO32)) | 0;
            h[i + 1] = lo | 0;
        }
    }
    return wordsToBytes(Array.prototype.slice.call(h), outLen);
}

/**
 * Serialises big-endian 32-bit words and truncates to `length` bytes.
 *
 * @param {number[]} words - Words.
 * @param {number} length - Output length.
 * @returns {Uint8Array} Bytes.
 */
function wordsToBytes(words: number[], length: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(words.length * 4);
    for (let i: number = 0; i < words.length; i++) {
        out[i * 4] = (words[i] >>> 24) & 0xff;
        out[i * 4 + 1] = (words[i] >>> 16) & 0xff;
        out[i * 4 + 2] = (words[i] >>> 8) & 0xff;
        out[i * 4 + 3] = words[i] & 0xff;
    }
    return out.subarray(0, length);
}
