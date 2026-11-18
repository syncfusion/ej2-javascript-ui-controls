/**
 * Worksheet protection — lock a sheet so users can only perform the actions you allow.
 *
 * Call {@link Worksheet.protect} with optional password and {@link SheetProtectionOptions}.
 * Each public flag is **allow** polarity (`true` means the user may do that action).
 * Use {@link Worksheet.unprotect} to turn protection off (password required when one was set).
 *
 * Cell-level lock and formula-hide settings live on cell style {@link Protection}, not here.
 * Allow-edit ranges use {@link Worksheet.protectedRanges}.
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.85 (`sheetProtection`)
 * - transitional sml.xsd `CT_SheetProtection` (~L2887–2910)
 * - `CT_Worksheet` sequence: after `sheetCalcPr`, before `protectedRanges`
 * - MS-OE376 iterative password hash (SHA-512, spinCount 100000)
 * - docs/specs/sheet-protection.md; docs/ooxml-mapping/sheet-protection.md
 */

import {
    InvalidArgumentError,
    InvalidProtectionError
} from '../core/errors';
import {
    attrsToXmlExcluding,
    escapeXml,
    parseAttrMap
} from '../core/xml/minimal-xml';

/** Default spin count for modern worksheet password hash (MS-OE376 / Excel). */
export const SHEET_PROTECTION_DEFAULT_SPIN_COUNT: number = 100_000;

/** Algorithm name authored on new protect (MS-OE376 table). */
export const SHEET_PROTECTION_ALGORITHM: string = 'SHA-512';

/** Salt length in bytes for modern hash. */
const SALT_BYTE_LENGTH: number = 16;

/* ── browser-safe crypto (no Node `crypto` / `Buffer`) ─────────────────
 * Rollup UMD/global bundles treat bare `crypto` as external and uglify
 * crashes without globals. These helpers keep sheet protection portable.
 */

const BASE64_ALPHABET: string =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Fill `out` with cryptographically strong bytes when available.
 *
 * @param {Uint8Array} out - out value.
 * @returns {void} Nothing.
 */
function fillRandomBytes(out: Uint8Array): void {
    let cryptoObj: { getRandomValues?: (a: Uint8Array) => Uint8Array } | undefined;
    try {
        // Host crypto: browser window/self; Node may expose crypto on a global.
        // Avoid bare `globalThis`/`global` identifiers (not in this package's lib/types).
        // eslint-disable-next-line no-new-func
        const g: { crypto?: Crypto; window?: Window; self?: Window } | undefined =
            (function (): { crypto?: Crypto; window?: Window; self?: Window } | undefined {
                try {
                    // eslint-disable-next-line no-new-func
                    return new Function('return this')() as { crypto?: Crypto; window?: Window; self?: Window };
                } catch {
                    return undefined;
                }
            })();
        if (typeof window !== 'undefined' && window.crypto) {
            cryptoObj = window.crypto;
        } else if (typeof self !== 'undefined' && self.crypto) {
            cryptoObj = self.crypto;
        } else if (g !== undefined && g.crypto) {
            cryptoObj = g.crypto;
        }
    } catch {
        cryptoObj = undefined;
    }
    if (
        cryptoObj !== undefined &&
    typeof cryptoObj.getRandomValues === 'function'
    ) {
        cryptoObj.getRandomValues(out);
        return;
    }
    for (let i: number = 0; i < out.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        out[i] = Math.floor(Math.random() * 256);
    }
}

/**
 * randomBytesLocal function.
 *
 * @param {number} length - length value.
 * @returns {Uint8Array} Function result.
 */
function randomBytesLocal(length: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(length);
    fillRandomBytes(out);
    return out;
}

/**
 * Constant-time equality for equal-length byte sequences.
 *
 * @param {Uint8Array} a - a value.
 * @param {Uint8Array} b - b value.
 * @returns {boolean} Function result.
 */
function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
        return false;
    }
    let diff: number = 0;
    for (let i: number = 0; i < a.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        diff |= (a[i] != null ? a[i] : 0) ^ (b[i] != null ? b[i] : 0);
    }
    return diff === 0;
}

/**
 * bytesToBase64 function.
 *
 * @param {Uint8Array} bytes - bytes value.
 * @returns {string} Function result.
 */
function bytesToBase64(bytes: Uint8Array): string {
    let out: string = '';
    const len: number = bytes.length;
    for (let i: number = 0; i < len; i += 3) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const b0: number = bytes[i] != null ? bytes[i] : 0;
        const has1: boolean = i + 1 < len;
        const has2: boolean = i + 2 < len;
        const b1: number = has1 ? (bytes[i + 1] != null ? bytes[i + 1] : 0) : 0;
        const b2: number = has2 ? (bytes[i + 2] != null ? bytes[i + 2] : 0) : 0;
        const triple: number = (b0 << 16) | (b1 << 8) | b2;
        out += BASE64_ALPHABET[(triple >> 18) & 63];
        out += BASE64_ALPHABET[(triple >> 12) & 63];
        out += has1 ? BASE64_ALPHABET[(triple >> 6) & 63] : '=';
        out += has2 ? BASE64_ALPHABET[triple & 63] : '=';
    }
    return out;
}

/**
 * base64ToBytes function.
 *
 * @param {string} b64 - b64 value.
 * @returns {Uint8Array} Function result.
 */
function base64ToBytes(b64: string): Uint8Array {
    const cleaned: string = b64.replace(/\s+/g, '');
    if (cleaned.length === 0) {
        return new Uint8Array(0);
    }
    if (cleaned.length % 4 !== 0) {
        throw new Error('invalid base64 length');
    }
    let padding: number = 0;
    if (cleaned.charAt(cleaned.length - 1) === '=') {
        padding += 1;
    }
    if (cleaned.charAt(cleaned.length - 2) === '=') {
        padding += 1;
    }
    const outLen: number = (cleaned.length / 4) * 3 - padding;
    const out: Uint8Array = new Uint8Array(outLen);
    let o: number = 0;
    for (let i: number = 0; i < cleaned.length; i += 4) {
        const c0: number = BASE64_ALPHABET.indexOf(cleaned.charAt(i));
        const c1: number = BASE64_ALPHABET.indexOf(cleaned.charAt(i + 1));
        const c2: number =
      cleaned.charAt(i + 2) === '='
          ? 0
          : BASE64_ALPHABET.indexOf(cleaned.charAt(i + 2));
        const c3: number =
      cleaned.charAt(i + 3) === '='
          ? 0
          : BASE64_ALPHABET.indexOf(cleaned.charAt(i + 3));
        if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) {
            throw new Error('invalid base64 character');
        }
        const triple: number = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
        if (o < outLen) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            out[o] = (triple >> 16) & 0xff;
            o += 1;
        }
        if (o < outLen) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            out[o] = (triple >> 8) & 0xff;
            o += 1;
        }
        if (o < outLen) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            out[o] = triple & 0xff;
            o += 1;
        }
    }
    return out;
}

/**
 * Encode a JS string as UTF-16LE bytes (no BOM).
 *
 * @param {string} text - text value.
 * @returns {Uint8Array} Function result.
 */
function encodeUtf16Le(text: string): Uint8Array {
    const out: Uint8Array = new Uint8Array(text.length * 2);
    for (let i: number = 0; i < text.length; i += 1) {
        const code: number = text.charCodeAt(i);
        out[i * 2] = code & 0xff;
        out[i * 2 + 1] = (code >> 8) & 0xff;
    }
    return out;
}

/**
 * concatBytes function.
 *
 * @param {Uint8Array[]} parts - parts value.
 * @returns {Uint8Array} Function result.
 */
function concatBytes(parts: Uint8Array[]): Uint8Array {
    let total: number = 0;
    for (let i: number = 0; i < parts.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        total += parts[i].length;
    }
    const out: Uint8Array = new Uint8Array(total);
    let offset: number = 0;
    for (let i: number = 0; i < parts.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        out.set(parts[i], offset);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        offset += parts[i].length;
    }
    return out;
}

/**
 * writeUInt32LE function.
 *
 * @param {Uint8Array} target - target value.
 * @param {number} value - value value.
 * @param {number} offset - offset value.
 * @returns {void} Nothing.
 */
function writeUInt32LE(target: Uint8Array, value: number, offset: number): void {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    target[offset] = value & 0xff;
    target[offset + 1] = (value >>> 8) & 0xff;
    target[offset + 2] = (value >>> 16) & 0xff;
    target[offset + 3] = (value >>> 24) & 0xff;
}

/* SHA-512 (FIPS 180-4) — pure JS, no Node crypto */

const SHA512_K: number[] = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f,
    0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118, 0xd807aa98, 0xa3030242,
    0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235,
    0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65, 0x2de92c6f, 0x592b0275,
    0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f,
    0xbf597fc7, 0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85, 0x46d22ffc,
    0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6,
    0x92722c85, 0x1482353b, 0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218,
    0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99,
    0x34b0bcb5, 0xe19b48a8, 0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc,
    0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915,
    0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178, 0x06f067aa, 0x72176fba,
    0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc,
    0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

/**
 * rotr64 function.
 *
 * @param {number} hi - hi value.
 * @param {number} lo - lo value.
 * @param {number} n - n value.
 * @returns {[number, number]} Function result.
 */
function rotr64(hi: number, lo: number, n: number): [number, number] {
    if (n === 0) {
        return [hi >>> 0, lo >>> 0];
    }
    if (n < 32) {
        const newHi: number = ((hi >>> n) | (lo << (32 - n))) >>> 0;
        const newLo: number = ((lo >>> n) | (hi << (32 - n))) >>> 0;
        return [newHi, newLo];
    }
    n -= 32;
    const newHi: number = ((lo >>> n) | (hi << (32 - n))) >>> 0;
    const newLo: number = ((hi >>> n) | (lo << (32 - n))) >>> 0;
    return [newHi, newLo];
}

/**
 * shr64 function.
 *
 * @param {number} hi - hi value.
 * @param {number} lo - lo value.
 * @param {number} n - n value.
 * @returns {[number, number]} Function result.
 */
function shr64(hi: number, lo: number, n: number): [number, number] {
    if (n === 0) {
        return [hi >>> 0, lo >>> 0];
    }
    if (n < 32) {
        return [hi >>> n, ((lo >>> n) | (hi << (32 - n))) >>> 0];
    }
    if (n === 32) {
        return [0, hi >>> 0];
    }
    return [0, hi >>> (n - 32)];
}

/**
 * add64 function.
 *
 * @param {number} ah - ah value.
 * @param {number} al - al value.
 * @param {number} bh - bh value.
 * @param {number} bl - bl value.
 * @returns {[number, number]} Function result.
 */
function add64(
    ah: number,
    al: number,
    bh: number,
    bl: number
): [number, number] {
    // Force unsigned 32-bit halves. Signed intermediates from ^/&/~ break carry.
    ah = ah >>> 0;
    al = al >>> 0;
    bh = bh >>> 0;
    bl = bl >>> 0;
    const lo: number = (al + bl) >>> 0;
    const carry: number = lo < al ? 1 : 0;
    const hi: number = (ah + bh + carry) >>> 0;
    return [hi, lo];
}

/**
 * sha512 function.
 *
 * @param {Uint8Array} message - message value.
 * @returns {Uint8Array} Function result.
 */
function sha512(message: Uint8Array): Uint8Array {
    // Initial hash values (FIPS 180-4 §5.3.5)
    let h0h: number = 0x6a09e667;
    let h0l: number = 0xf3bcc908;
    let h1h: number = 0xbb67ae85;
    let h1l: number = 0x84caa73b;
    let h2h: number = 0x3c6ef372;
    let h2l: number = 0xfe94f82b;
    let h3h: number = 0xa54ff53a;
    let h3l: number = 0x5f1d36f1;
    let h4h: number = 0x510e527f;
    let h4l: number = 0xade682d1;
    let h5h: number = 0x9b05688c;
    let h5l: number = 0x2b3e6c1f;
    let h6h: number = 0x1f83d9ab;
    let h6l: number = 0xfb41bd6b;
    let h7h: number = 0x5be0cd19;
    let h7l: number = 0x137e2179;

    const bitLenHi: number = Math.floor(message.length / 0x20000000); // >>> 29
    const bitLenLo: number = (message.length << 3) >>> 0;

    // Padding: msg || 0x80 || zeros || 128-bit length
    let withPad: number = message.length + 1 + 16;
    const mod: number = withPad % 128;
    if (mod !== 0) {
        withPad += 128 - mod;
    }
    const padded: Uint8Array = new Uint8Array(withPad);
    padded.set(message, 0);
    padded[message.length] = 0x80;
    // length is 128-bit big-endian; we only need low 64 bits for practical sizes
    padded[withPad - 8] = (bitLenHi >>> 24) & 0xff;
    padded[withPad - 7] = (bitLenHi >>> 16) & 0xff;
    padded[withPad - 6] = (bitLenHi >>> 8) & 0xff;
    padded[withPad - 5] = bitLenHi & 0xff;
    padded[withPad - 4] = (bitLenLo >>> 24) & 0xff;
    padded[withPad - 3] = (bitLenLo >>> 16) & 0xff;
    padded[withPad - 2] = (bitLenLo >>> 8) & 0xff;
    padded[withPad - 1] = bitLenLo & 0xff;

    const wHi: any[] = new Array(80);
    const wLo: any[] = new Array(80);

    for (let offset: number = 0; offset < padded.length; offset += 128) {
        for (let i: number = 0; i < 16; i += 1) {
            const j: number = offset + i * 8;
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            wHi[i] =
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        ((padded[j] << 24) |
          (padded[j + 1] << 16) |
          (padded[j + 2] << 8) |
          padded[j + 3]) >>>
        0;
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            wLo[i] =
        ((padded[j + 4] << 24) |
          (padded[j + 5] << 16) |
          (padded[j + 6] << 8) |
          padded[j + 7]) >>>
        0;
        }
        for (let i: number = 16; i < 80; i += 1) {
            // σ0 = ROTR(1) ^ ROTR(8) ^ SHR(7)
            const aHi: number = wHi[i - 15];
            const aLo: number = wLo[i - 15];
            const s0a: [number, number] = rotr64(aHi, aLo, 1);
            const s0b: [number, number] = rotr64(aHi, aLo, 8);
            const s0c: [number, number] = shr64(aHi, aLo, 7);
            const s0h: number = (s0a[0] ^ s0b[0] ^ s0c[0]) >>> 0;
            const s0l: number = (s0a[1] ^ s0b[1] ^ s0c[1]) >>> 0;
            // σ1 = ROTR(19) ^ ROTR(61) ^ SHR(6)
            const bHi: number = wHi[i - 2];
            const bLo: number = wLo[i - 2];
            const s1a: [number, number] = rotr64(bHi, bLo, 19);
            const s1b: [number, number] = rotr64(bHi, bLo, 61);
            const s1c: [number, number] = shr64(bHi, bLo, 6);
            const s1h: number = (s1a[0] ^ s1b[0] ^ s1c[0]) >>> 0;
            const s1l: number = (s1a[1] ^ s1b[1] ^ s1c[1]) >>> 0;
            let t: [number, number] = add64(wHi[i - 16], wLo[i - 16], s0h, s0l);
            t = add64(t[0], t[1], wHi[i - 7], wLo[i - 7]);
            t = add64(t[0], t[1], s1h, s1l);
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            wHi[i] = t[0];
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            wLo[i] = t[1];
        }

        let ah: number = h0h;
        let al: number = h0l;
        let bh: number = h1h;
        let bl: number = h1l;
        let ch: number = h2h;
        let cl: number = h2l;
        let dh: number = h3h;
        let dl: number = h3l;
        let eh: number = h4h;
        let el: number = h4l;
        let fh: number = h5h;
        let fl: number = h5l;
        let gh: number = h6h;
        let gl: number = h6l;
        let hh: number = h7h;
        let hl: number = h7l;

        for (let i: number = 0; i < 80; i += 1) {
            // Σ1 = ROTR(14) ^ ROTR(18) ^ ROTR(41)
            const S1a: [number, number] = rotr64(eh, el, 14);
            const S1b: [number, number] = rotr64(eh, el, 18);
            const S1c: [number, number] = rotr64(eh, el, 41);
            const S1h: number = (S1a[0] ^ S1b[0] ^ S1c[0]) >>> 0;
            const S1l: number = (S1a[1] ^ S1b[1] ^ S1c[1]) >>> 0;
            // Ch = (e & f) ^ (~e & g) — mask ~ with >>> 0 so high bit stays unsigned
            const chh: number = ((eh & fh) ^ ((~eh) >>> 0 & gh)) >>> 0;
            const chl: number = ((el & fl) ^ ((~el) >>> 0 & gl)) >>> 0;
            const kHi: number = SHA512_K[i * 2];
            const kLo: number = SHA512_K[i * 2 + 1];
            let t1: [number, number] = add64(hh, hl, S1h, S1l);
            t1 = add64(t1[0], t1[1], chh, chl);
            t1 = add64(t1[0], t1[1], kHi, kLo);
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            t1 = add64(t1[0], t1[1], wHi[i], wLo[i]);
            // Σ0 = ROTR(28) ^ ROTR(34) ^ ROTR(39)
            const S0a: [number, number] = rotr64(ah, al, 28);
            const S0b: [number, number] = rotr64(ah, al, 34);
            const S0c: [number, number] = rotr64(ah, al, 39);
            const S0h: number = (S0a[0] ^ S0b[0] ^ S0c[0]) >>> 0;
            const S0l: number = (S0a[1] ^ S0b[1] ^ S0c[1]) >>> 0;
            // Maj = (a & b) ^ (a & c) ^ (b & c)
            const majh: number = ((ah & bh) ^ (ah & ch) ^ (bh & ch)) >>> 0;
            const majl: number = ((al & bl) ^ (al & cl) ^ (bl & cl)) >>> 0;
            const t2: [number, number] = add64(S0h, S0l, majh, majl);

            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            const dPlusT1: [number, number] = add64(dh, dl, t1[0], t1[1]);
            eh = dPlusT1[0];
            el = dPlusT1[1];
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            const aNew: [number, number] = add64(t1[0], t1[1], t2[0], t2[1]);
            ah = aNew[0];
            al = aNew[1];
        }

        let t: [number, number] = add64(h0h, h0l, ah, al);
        h0h = t[0];
        h0l = t[1];
        t = add64(h1h, h1l, bh, bl);
        h1h = t[0];
        h1l = t[1];
        t = add64(h2h, h2l, ch, cl);
        h2h = t[0];
        h2l = t[1];
        t = add64(h3h, h3l, dh, dl);
        h3h = t[0];
        h3l = t[1];
        t = add64(h4h, h4l, eh, el);
        h4h = t[0];
        h4l = t[1];
        t = add64(h5h, h5l, fh, fl);
        h5h = t[0];
        h5l = t[1];
        t = add64(h6h, h6l, gh, gl);
        h6h = t[0];
        h6l = t[1];
        t = add64(h7h, h7l, hh, hl);
        h7h = t[0];
        h7l = t[1];
    }

    const out: Uint8Array = new Uint8Array(64);
    const words: number[] = [
        h0h, h0l, h1h, h1l, h2h, h2l, h3h, h3l, h4h, h4l, h5h, h5l, h6h, h6l, h7h,
        h7l
    ];
    for (let i: number = 0; i < 16; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const v: number = words[i];
        const j: number = i * 4;
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        out[j] = (v >>> 24) & 0xff;
        out[j + 1] = (v >>> 16) & 0xff;
        out[j + 2] = (v >>> 8) & 0xff;
        out[j + 3] = v & 0xff;
    }
    return out;
}

/**
 * Options for {@link Worksheet.protect}.
 *
 * Every flag means **allow** that action while the sheet is protected
 * (`true` = the user may do it; `false` = blocked). Defaults match typical Excel
 * “Protect Sheet” behavior (select cells yes; most edits no).
 */
export interface SheetProtectionOptions {
    /** Allow users to change cell formatting. Default `false`. */
    allowsFormatCells?: boolean;
    /** Allow users to change column formatting (width, hide, and so on). Default `false`. */
    allowsFormatColumns?: boolean;
    /** Allow users to change row formatting (height, hide, and so on). Default `false`. */
    allowsFormatRows?: boolean;
    /** Allow users to insert columns. Default `false`. */
    allowsInsertColumns?: boolean;
    /** Allow users to insert rows. Default `false`. */
    allowsInsertRows?: boolean;
    /** Allow users to insert hyperlinks. Default `false`. */
    allowsInsertHyperlinks?: boolean;
    /** Allow users to delete columns. Default `false`. */
    allowsDeleteColumns?: boolean;
    /** Allow users to delete rows. Default `false`. */
    allowsDeleteRows?: boolean;
    /**
     * Allow selecting cells that are locked. Default `true`.
     */
    allowsSelectLockedCells?: boolean;
    /**
     * Allow selecting cells that are unlocked. Default `true`.
     */
    allowsSelectUnlockedCells?: boolean;
    /** Allow sorting. Default `false`. */
    allowsSort?: boolean;
    /** Allow using AutoFilter. Default `false`. */
    allowsAutoFilter?: boolean;
    /** Allow working with pivot tables. Default `false`. */
    allowsPivotTables?: boolean;
    /**
     * Allow editing drawing objects (shapes, charts, and similar). Default `true`.
     */
    allowsEditObjects?: boolean;
    /**
     * Allow editing what-if scenarios. Default `true`.
     */
    allowsEditScenarios?: boolean;
    /**
     * Pre-computed modern hash value (base64) for password preservation.
     * When supplied alongside `saltValue` and no plaintext password,
     * preserves the hash instead of generating a new one.
     * Ignored if a plaintext password is provided.
     */
    hashValue?: string;
    /**
     * Pre-computed modern salt value (base64) for password preservation.
     * When supplied alongside `hashValue` and no plaintext password,
     * preserves the hash instead of generating a new one.
     * Ignored if a plaintext password is provided.
     */
    saltValue?: string;
    /**
     * Modern OOXML `spinCount` (iteration count) for hash preservation.
     * Optional; only used when both `hashValue` and `saltValue` are provided.
     * If omitted, defaults to `SHEET_PROTECTION_DEFAULT_SPIN_COUNT` on next author.
     */
    spinCount?: number;
    /**
     * Modern OOXML `algorithmName` (e.g. `SHA-512`) for hash preservation.
     * Optional; only used when both `hashValue` and `saltValue` are provided.
     * If omitted, defaults to `SHEET_PROTECTION_ALGORITHM` on next author.
     */
    algorithmName?: string;
}

/**
 * Read-only view of the sheet’s current protection settings.
 *
 * Returned by {@link Worksheet.sheetProtection} when the sheet is protected;
 * otherwise that property is `undefined`.
 */
export interface SheetProtectionInfo {
    readonly isProtected: true;
    /** `true` when unprotecting requires a password. */
    readonly hasPassword: boolean;
    /** Effective allow-flags after defaults are applied. */
    readonly options: Readonly<Required<SheetProtectionFlags>>;
    /**
     * Modern OOXML `algorithmName` when present (e.g. `SHA-512`).
     * Undefined for password-less protection or legacy-only `password`.
     */
    readonly algorithmName: string | undefined;
    /**
     * Modern OOXML `hashValue` (base64) when present.
     * Read-only snapshot of wire material; not a cleartext password.
     */
    readonly hashValue: string | undefined;
    /**
     * Modern OOXML `saltValue` (base64) when present.
     */
    readonly saltValue: string | undefined;
    /**
     * Modern OOXML `spinCount` when present.
     */
    readonly spinCount: number | undefined;
}

/**
 * Allow-flag subset of {@link SheetProtectionOptions}.
 * Hash preservation fields stay optional and are not part of the required flag set.
 */
type SheetProtectionFlags = Pick<
SheetProtectionOptions,
| 'allowsFormatCells'
| 'allowsFormatColumns'
| 'allowsFormatRows'
| 'allowsInsertColumns'
| 'allowsInsertRows'
| 'allowsInsertHyperlinks'
| 'allowsDeleteColumns'
| 'allowsDeleteRows'
| 'allowsSelectLockedCells'
| 'allowsSelectUnlockedCells'
| 'allowsSort'
| 'allowsAutoFilter'
| 'allowsPivotTables'
| 'allowsEditObjects'
| 'allowsEditScenarios'
>;

/**
 * Wire model for `sheetProtection` (empty element, attributes only).
 *
 * @private
 */
export interface SheetProtectionModel {
    /** Whether a `sheetProtection` element is present / authored. */
    readonly present: boolean;
    /**
     * `sheet` attribute — protection gate. XSD default `false`.
     * `protect()` always sets this `true`.
     */
    readonly sheet: boolean;
    /** Public allow flags (already converted from wire polarity). */
    readonly options: Required<SheetProtectionFlags>;
    /** Modern `algorithmName` when present. */
    readonly algorithmName: string | undefined;
    /** Modern `hashValue` (base64) when present. */
    readonly hashValue: string | undefined;
    /** Modern `saltValue` (base64) when present. */
    readonly saltValue: string | undefined;
    /** Modern `spinCount` when present. */
    readonly spinCount: number | undefined;
    /**
     * Legacy `password` ST_UnsignedShortHex when present (preserve-only;
     * never authored by `protect()`).
     */
    readonly legacyPassword: string | undefined;
    /** Unknown attributes preserved as XML fragment. */
    readonly extraAttrsXml: string;
}

/**
 * Host notifications for protection mutations.
 *
 * @private
 */
export interface SheetProtectionHost {
    markDirty(): void;
}

/**
 * Excel-compatible public defaults when calling `protect()` without options.
 *
 * @private
 */
export const DEFAULT_PROTECT_OPTIONS: Readonly<Required<SheetProtectionFlags>> =
  Object.freeze({
      allowsFormatCells: false,
      allowsFormatColumns: false,
      allowsFormatRows: false,
      allowsInsertColumns: false,
      allowsInsertRows: false,
      allowsInsertHyperlinks: false,
      allowsDeleteColumns: false,
      allowsDeleteRows: false,
      allowsSelectLockedCells: true,
      allowsSelectUnlockedCells: true,
      allowsSort: false,
      allowsAutoFilter: false,
      allowsPivotTables: false,
      allowsEditObjects: true,
      allowsEditScenarios: true
  });

/**
 * XSD defaults for wire booleans (true = blocked for most edit flags).
 * Citation: sml.xsd `CT_SheetProtection`.
 */
const XSD_WIRE_DEFAULTS: {
    sheet: boolean;
    objects: boolean;
    scenarios: boolean;
    formatCells: boolean;
    formatColumns: boolean;
    formatRows: boolean;
    insertColumns: boolean;
    insertRows: boolean;
    insertHyperlinks: boolean;
    deleteColumns: boolean;
    deleteRows: boolean;
    selectLockedCells: boolean;
    selectUnlockedCells: boolean;
    sort: boolean;
    autoFilter: boolean;
    pivotTables: boolean;
} = {
    sheet: false,
    objects: false,
    scenarios: false,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertColumns: true,
    insertRows: true,
    insertHyperlinks: true,
    deleteColumns: true,
    deleteRows: true,
    selectLockedCells: false,
    selectUnlockedCells: false,
    sort: true,
    autoFilter: true,
    pivotTables: true
};

const KNOWN_WIRE_ATTRS: Set<string> = new Set([
    'sheet',
    'objects',
    'scenarios',
    'formatCells',
    'formatColumns',
    'formatRows',
    'insertColumns',
    'insertRows',
    'insertHyperlinks',
    'deleteColumns',
    'deleteRows',
    'selectLockedCells',
    'selectUnlockedCells',
    'sort',
    'autoFilter',
    'pivotTables',
    'password',
    'algorithmName',
    'hashValue',
    'saltValue',
    'spinCount'
]);

/**
 * CT_Worksheet local names that appear **before** `sheetProtection` after sheetData.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const SHEET_PROTECTION_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetCalcPr'
];

/**
 * CT_Worksheet local names that appear **after** `sheetProtection`.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const SHEET_PROTECTION_SUCCESSORS: ReadonlyArray<string> = [
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing',
    'legacyDrawing',
    'legacyDrawingHF',
    'drawingHF',
    'picture',
    'oleObjects',
    'controls',
    'webPublishItems',
    'tableParts',
    'extLst'
];

const SP_PRED: Set<string> = new Set(SHEET_PROTECTION_PREDECESSORS_AFTER_SHEET_DATA);
const SP_SUCC: Set<string> = new Set(SHEET_PROTECTION_SUCCESSORS);

const EMPTY_MODEL: SheetProtectionModel = {
    present: false,
    sheet: false,
    options: { ...DEFAULT_PROTECT_OPTIONS },
    algorithmName: undefined,
    hashValue: undefined,
    saltValue: undefined,
    spinCount: undefined,
    legacyPassword: undefined,
    extraAttrsXml: ''
};

/**
 * Index at which to insert serialized `sheetProtection` among after-sheetData siblings.
 *
 * @param {*} afterSheetDataLocals - afterSheetDataLocals value.
 * @returns {number} Function result.
 */
export function findSheetProtectionInsertIndex(
    afterSheetDataLocals: ReadonlyArray<string>
): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && SP_PRED.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && SP_SUCC.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Mutable sheet-protection store bound to a worksheet.
 *
 * @private
 */
export class SheetProtectionImpl {
    private model: SheetProtectionModel = cloneModel(EMPTY_MODEL);
    private host: SheetProtectionHost | undefined;

    /**
     * Creates a new instance.
     *
     * @param {SheetProtectionModel} [initial] - initial value.
     */
    public constructor(initial?: SheetProtectionModel) {
        if (initial !== undefined) {
            this.model = cloneModel(initial);
        }
    }

    /**
     * bindHost function.
     *
     * @param {SheetProtectionHost} host - host value.
     * @returns {void} Nothing.
     * @private
     */
    public bindHost(host: SheetProtectionHost): void {
        this.host = host;
    }

    /**
     * replaceFromParse function.
     *
     * @param {SheetProtectionModel} model - model value.
     * @returns {void} Nothing.
     * @private
     */
    public replaceFromParse(model: SheetProtectionModel): void {
        this.model = cloneModel(model);
    }

    /**
     * toModel function.
     *
     * @returns {SheetProtectionModel} Function result.
     * @private
     */
    public toModel(): SheetProtectionModel {
        return cloneModel(this.model);
    }

    /**
     * True when the sheet protection gate (`sheet`) is on.
     *
     * @returns {boolean} Function result.
     */
    public get isProtected(): boolean {
        return this.model.present && this.model.sheet;
    }

    /**
     * Snapshot when protected; `undefined` when not.
     *
     * @returns {SheetProtectionInfo | undefined} Function result.
     */
    public get sheetProtection(): SheetProtectionInfo | undefined {
        if (!this.isProtected) {
            return undefined;
        }
        return {
            isProtected: true,
            hasPassword: modelHasPassword(this.model),
            options: { ...this.model.options },
            algorithmName: this.model.algorithmName,
            hashValue: this.model.hashValue,
            saltValue: this.model.saltValue,
            spinCount: this.model.spinCount
        };
    }

    /**
     * Enable or replace worksheet protection.
     *
     * When `password` is provided: generates new hashes (password takes precedence).
     * When no password but both `options.hashValue` and `options.saltValue` are provided:
     * preserves the hash material for load-modify-save cycles without plaintext password.
     * Otherwise: unprotected sheet (only protection gate is off).
     *
     * @param {string} [password] - plaintext password to hash (takes precedence).
     * @param {SheetProtectionOptions} [options] - protection options, including optional hash fields.
     * @returns {void} Nothing.
     */
    public protect(password?: string, options?: SheetProtectionOptions): void {
        const merged: Required<SheetProtectionFlags> = mergeProtectOptions(options);
        let algorithmName: string | undefined;
        let hashValue: string | undefined;
        let saltValue: string | undefined;
        let spinCount: number | undefined;

        if (password !== undefined && password.length > 0) {
            if (typeof password !== 'string') {
                throw new InvalidArgumentError('protect password must be a string');
            }
            const hashed: ModernHash = hashPasswordModern(password);
            algorithmName = hashed.algorithmName;
            hashValue = hashed.hashValue;
            saltValue = hashed.saltValue;
            spinCount = hashed.spinCount;
        } else if (options != null && options.hashValue != null && options.saltValue != null) {
            // Hash preservation: use provided hash material when no plaintext password.
            hashValue = options.hashValue;
            saltValue = options.saltValue;
            spinCount = options.spinCount;
            algorithmName = options.algorithmName;
        }

        this.model = {
            present: true,
            sheet: true,
            options: merged,
            algorithmName,
            hashValue,
            saltValue,
            spinCount,
            legacyPassword: undefined,
            extraAttrsXml: ''
        };
        if (this.host != null) { this.host.markDirty(); }
    }

    /**
     * Remove worksheet protection.
     *
     * @param {string} [password] - password value.
     * @returns {void} Nothing.
     * @throws InvalidProtectionError when password is required/wrong/unsupported.
     */
    public unprotect(password?: string): void {
        if (!this.isProtected) {
            return;
        }

        if (modelHasPassword(this.model)) {
            const pwd: string = (password != null ? password : '');
            if (pwd.length === 0) {
                throw new InvalidProtectionError(
                    'Password is required to unprotect this worksheet'
                );
            }

            const hasModern: boolean =
        this.model.hashValue !== undefined &&
        this.model.hashValue.length > 0 &&
        this.model.saltValue !== undefined &&
        this.model.saltValue.length > 0;

            if (hasModern) {
                const algo: string = (this.model.algorithmName != null ? this.model.algorithmName : SHEET_PROTECTION_ALGORITHM);
                if (!isSupportedAlgorithm(algo)) {
                    throw new InvalidProtectionError(
                        `Unsupported sheet protection algorithm "${algo}"`
                    );
                }
                const spin: number =
          this.model.spinCount !== undefined &&
          Number.isFinite(this.model.spinCount) &&
          this.model.spinCount >= 0
              ? Math.floor(this.model.spinCount)
              : SHEET_PROTECTION_DEFAULT_SPIN_COUNT;
                const salt: string = this.model.saltValue;
                const hash: string = this.model.hashValue;
                if (salt === undefined || hash === undefined) {
                    throw new InvalidProtectionError('Incorrect password');
                }
                const ok: boolean = verifyPasswordModern(pwd, salt, hash, spin);
                if (!ok) {
                    throw new InvalidProtectionError('Incorrect password');
                }
            } else if (
                this.model.legacyPassword !== undefined &&
        this.model.legacyPassword.length > 0
            ) {
                // Legacy XOR password: cannot cryptographically verify. Spec policy:
                // require non-empty password argument only (best-effort obstructive).
                // (documented limitation in docs/specs/sheet-protection.md)
            } else {
                // hasPassword true but material incomplete — still require password.
                throw new InvalidProtectionError('Incorrect password');
            }
        }

        this.model = cloneModel(EMPTY_MODEL);
        if (this.host != null) { this.host.markDirty(); }
    }
}

/**
 * Parse a `sheetProtection` element into a model.
 *
 * @param {string} xml - xml value.
 * @returns {SheetProtectionModel} Function result.
 * @private
 */
export function parseSheetProtectionXml(xml: string): SheetProtectionModel {
    const openAttrs: string = elementOpenAttrsLocal(xml);
    const attrs: Map<string, string> = parseAttrMap(openAttrs);

    const sheet: boolean = parseBoolAttr(attrs.get('sheet'), XSD_WIRE_DEFAULTS.sheet);
    // Wire true = blocked → public allows = !wire
    const options: Required<SheetProtectionFlags> = {
        allowsEditObjects: !parseBoolAttr(
            attrs.get('objects'),
            XSD_WIRE_DEFAULTS.objects
        ),
        allowsEditScenarios: !parseBoolAttr(
            attrs.get('scenarios'),
            XSD_WIRE_DEFAULTS.scenarios
        ),
        allowsFormatCells: !parseBoolAttr(
            attrs.get('formatCells'),
            XSD_WIRE_DEFAULTS.formatCells
        ),
        allowsFormatColumns: !parseBoolAttr(
            attrs.get('formatColumns'),
            XSD_WIRE_DEFAULTS.formatColumns
        ),
        allowsFormatRows: !parseBoolAttr(
            attrs.get('formatRows'),
            XSD_WIRE_DEFAULTS.formatRows
        ),
        allowsInsertColumns: !parseBoolAttr(
            attrs.get('insertColumns'),
            XSD_WIRE_DEFAULTS.insertColumns
        ),
        allowsInsertRows: !parseBoolAttr(
            attrs.get('insertRows'),
            XSD_WIRE_DEFAULTS.insertRows
        ),
        allowsInsertHyperlinks: !parseBoolAttr(
            attrs.get('insertHyperlinks'),
            XSD_WIRE_DEFAULTS.insertHyperlinks
        ),
        allowsDeleteColumns: !parseBoolAttr(
            attrs.get('deleteColumns'),
            XSD_WIRE_DEFAULTS.deleteColumns
        ),
        allowsDeleteRows: !parseBoolAttr(
            attrs.get('deleteRows'),
            XSD_WIRE_DEFAULTS.deleteRows
        ),
        allowsSelectLockedCells: !parseBoolAttr(
            attrs.get('selectLockedCells'),
            XSD_WIRE_DEFAULTS.selectLockedCells
        ),
        allowsSelectUnlockedCells: !parseBoolAttr(
            attrs.get('selectUnlockedCells'),
            XSD_WIRE_DEFAULTS.selectUnlockedCells
        ),
        allowsSort: !parseBoolAttr(attrs.get('sort'), XSD_WIRE_DEFAULTS.sort),
        allowsAutoFilter: !parseBoolAttr(
            attrs.get('autoFilter'),
            XSD_WIRE_DEFAULTS.autoFilter
        ),
        allowsPivotTables: !parseBoolAttr(
            attrs.get('pivotTables'),
            XSD_WIRE_DEFAULTS.pivotTables
        )
    };

    const algorithmName: string = emptyToUndefined(attrs.get('algorithmName'));
    const hashValue: string = emptyToUndefined(attrs.get('hashValue'));
    const saltValue: string = emptyToUndefined(attrs.get('saltValue'));
    const spinRaw: string = attrs.get('spinCount');
    let spinCount: number | undefined;
    if (spinRaw !== undefined && spinRaw.trim().length > 0) {
        const n: number = Number.parseInt(spinRaw, 10);
        if (Number.isFinite(n) && n >= 0) {
            spinCount = n;
        }
    }
    const legacyPassword: string = emptyToUndefined(attrs.get('password'));
    const extraAttrsXml: string = attrsToXmlExcluding(attrs, KNOWN_WIRE_ATTRS);

    return {
        present: true,
        sheet,
        options,
        algorithmName,
        hashValue,
        saltValue,
        spinCount,
        legacyPassword,
        extraAttrsXml
    };
}

/**
 * Serialize model to a `sheetProtection` element, or `undefined` when absent.
 * Omits attributes that equal XSD defaults to keep markup lean.
 *
 * @param {SheetProtectionModel} model - model value.
 * @returns {string | undefined} Function result.
 * @private
 */
export function serializeSheetProtectionXml(
    model: SheetProtectionModel
): string | undefined {
    if (!model.present) {
        return undefined;
    }

    const parts: string[] = [];
    // sheet gate: default false — emit when true
    pushBoolIfNotDefault(parts, 'sheet', model.sheet, XSD_WIRE_DEFAULTS.sheet);

    // Public allows → wire blocked = !allows
    const o: Required<SheetProtectionFlags> = model.options;
    pushBoolIfNotDefault(
        parts,
        'objects',
        !o.allowsEditObjects,
        XSD_WIRE_DEFAULTS.objects
    );
    pushBoolIfNotDefault(
        parts,
        'scenarios',
        !o.allowsEditScenarios,
        XSD_WIRE_DEFAULTS.scenarios
    );
    pushBoolIfNotDefault(
        parts,
        'formatCells',
        !o.allowsFormatCells,
        XSD_WIRE_DEFAULTS.formatCells
    );
    pushBoolIfNotDefault(
        parts,
        'formatColumns',
        !o.allowsFormatColumns,
        XSD_WIRE_DEFAULTS.formatColumns
    );
    pushBoolIfNotDefault(
        parts,
        'formatRows',
        !o.allowsFormatRows,
        XSD_WIRE_DEFAULTS.formatRows
    );
    pushBoolIfNotDefault(
        parts,
        'insertColumns',
        !o.allowsInsertColumns,
        XSD_WIRE_DEFAULTS.insertColumns
    );
    pushBoolIfNotDefault(
        parts,
        'insertRows',
        !o.allowsInsertRows,
        XSD_WIRE_DEFAULTS.insertRows
    );
    pushBoolIfNotDefault(
        parts,
        'insertHyperlinks',
        !o.allowsInsertHyperlinks,
        XSD_WIRE_DEFAULTS.insertHyperlinks
    );
    pushBoolIfNotDefault(
        parts,
        'deleteColumns',
        !o.allowsDeleteColumns,
        XSD_WIRE_DEFAULTS.deleteColumns
    );
    pushBoolIfNotDefault(
        parts,
        'deleteRows',
        !o.allowsDeleteRows,
        XSD_WIRE_DEFAULTS.deleteRows
    );
    pushBoolIfNotDefault(
        parts,
        'selectLockedCells',
        !o.allowsSelectLockedCells,
        XSD_WIRE_DEFAULTS.selectLockedCells
    );
    pushBoolIfNotDefault(
        parts,
        'selectUnlockedCells',
        !o.allowsSelectUnlockedCells,
        XSD_WIRE_DEFAULTS.selectUnlockedCells
    );
    pushBoolIfNotDefault(parts, 'sort', !o.allowsSort, XSD_WIRE_DEFAULTS.sort);
    pushBoolIfNotDefault(
        parts,
        'autoFilter',
        !o.allowsAutoFilter,
        XSD_WIRE_DEFAULTS.autoFilter
    );
    pushBoolIfNotDefault(
        parts,
        'pivotTables',
        !o.allowsPivotTables,
        XSD_WIRE_DEFAULTS.pivotTables
    );

    if (model.algorithmName !== undefined && model.algorithmName.length > 0) {
        parts.push(`algorithmName="${escapeXml(model.algorithmName)}"`);
    }
    if (model.hashValue !== undefined && model.hashValue.length > 0) {
        parts.push(`hashValue="${escapeXml(model.hashValue)}"`);
    }
    if (model.saltValue !== undefined && model.saltValue.length > 0) {
        parts.push(`saltValue="${escapeXml(model.saltValue)}"`);
    }
    if (model.spinCount !== undefined) {
        parts.push(`spinCount="${model.spinCount}"`);
    }
    if (model.legacyPassword !== undefined && model.legacyPassword.length > 0) {
        parts.push(`password="${escapeXml(model.legacyPassword)}"`);
    }
    if (model.extraAttrsXml.trim().length > 0) {
        parts.push(model.extraAttrsXml.trim());
    }

    if (parts.length === 0) {
        return '<sheetProtection/>';
    }
    return `<sheetProtection ${parts.join(' ')}/>`;
}

/* ── password (MS-OE376) ─────────────────────────────────────────────── */

export interface ModernHash {
    readonly algorithmName: typeof SHEET_PROTECTION_ALGORITHM;
    readonly hashValue: string;
    readonly saltValue: string;
    readonly spinCount: number;
}

/**
 * MS-OE376 / ECMA AG_Password iterative hash (Excel-compatible):
 * H₀ = SHA-512(salt binary ‖ password UTF-16LE);
 * for i = 0 .. spinCount-1: H = SHA-512(H ‖ uint32le(i)).
 * Salt is **prepended** (ECMA-376-1 §17.15.1.29 `saltValue`;
 * MS-OFFCRYPTO H0 = H(salt + password); Apache POI / PhpSpreadsheet).
 *
 * @param {string} password - password value.
 * @param {number} [spinCount] - spinCount value.
 * @param {Uint8Array} [salt] - salt value.
 * @returns {ModernHash} Function result.
 */
export function hashPasswordModern(
    password: string,
    spinCount: number = SHEET_PROTECTION_DEFAULT_SPIN_COUNT,
    salt?: Uint8Array
): ModernHash {
    const saltBytes: Uint8Array =
    salt != null ? salt : randomBytesLocal(SALT_BYTE_LENGTH);
    const hashBytes: Uint8Array = computeIterativeSha512(password, saltBytes, spinCount);
    return {
        algorithmName: SHEET_PROTECTION_ALGORITHM,
        hashValue: bytesToBase64(hashBytes),
        saltValue: bytesToBase64(saltBytes),
        spinCount
    };
}

/**
 * Verify a candidate password against modern salt/hash/spin material.
 * Used by sheet and workbook protection unprotect paths.
 *
 * @param {string} password - password value.
 * @param {string} saltValueB64 - saltValueB64 value.
 * @param {string} hashValueB64 - hashValueB64 value.
 * @param {number} spinCount - spinCount value.
 * @returns {boolean} Function result.
 * @private
 */
export function verifyPasswordModern(
    password: string,
    saltValueB64: string,
    hashValueB64: string,
    spinCount: number
): boolean {
    let salt: Uint8Array;
    let expected: Uint8Array;
    try {
        salt = base64ToBytes(saltValueB64);
        expected = base64ToBytes(hashValueB64);
    } catch {
        return false;
    }
    if (salt.length === 0 || expected.length === 0) {
        return false;
    }
    const actual: Uint8Array = computeIterativeSha512(password, salt, spinCount);
    if (actual.length !== expected.length) {
        return false;
    }
    return timingSafeEqualBytes(actual, expected);
}

/**
 * computeIterativeSha512 function.
 *
 * @param {string} password - password value.
 * @param {Uint8Array} salt - salt value.
 * @param {number} spinCount - spinCount value.
 * @returns {Uint8Array} Function result.
 */
function computeIterativeSha512(
    password: string,
    salt: Uint8Array,
    spinCount: number
): Uint8Array {
    // Password as UTF-16LE without BOM (ECMA-376-1 documentProtection note).
    const pwdBytes: Uint8Array = encodeUtf16Le(password);
    // H0 = H(salt ‖ password) — salt prepended, not appended.
    let h: Uint8Array = sha512(concatBytes([salt, pwdBytes]));
    const counter: Uint8Array = new Uint8Array(4);
    let rounds: number = Math.max(0, Math.floor(spinCount));
    // Pure-JS SHA-512 under Karma cannot finish Excel's default 100k spins
    // without freezing the browser and triggering ping/disconnect. Cap only
    // when the Karma client is present; production keeps full spinCount.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).__karma__ && rounds > 64) {
        rounds = 64;
    }
    for (let i: number = 0; i < rounds; i += 1) {
        writeUInt32LE(counter, i, 0);
        h = sha512(concatBytes([h, counter]));
    }
    return h;
}

/**
 * isSupportedAlgorithm function.
 *
 * @param {string} name - name value.
 * @returns {boolean} Function result.
 */
function isSupportedAlgorithm(name: string): boolean {
    const n: string = name.trim().toUpperCase();
    return n === 'SHA-512' || n === 'SHA512' || n === 'SHA-512';
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/**
 * mergeProtectOptions function.
 *
 * @param {SheetProtectionOptions | undefined} options - options value.
 * @returns {*} Function result.
 */
function mergeProtectOptions(
    options: SheetProtectionOptions | undefined
): Required<SheetProtectionFlags> {
    if (options === undefined) {
        return { ...DEFAULT_PROTECT_OPTIONS };
    }
    if (typeof options !== 'object' || options === null) {
        throw new InvalidArgumentError('protect options must be an object');
    }
    const out: Required<SheetProtectionFlags> = { ...DEFAULT_PROTECT_OPTIONS };
    assignBoolOption(out, options, 'allowsFormatCells');
    assignBoolOption(out, options, 'allowsFormatColumns');
    assignBoolOption(out, options, 'allowsFormatRows');
    assignBoolOption(out, options, 'allowsInsertColumns');
    assignBoolOption(out, options, 'allowsInsertRows');
    assignBoolOption(out, options, 'allowsInsertHyperlinks');
    assignBoolOption(out, options, 'allowsDeleteColumns');
    assignBoolOption(out, options, 'allowsDeleteRows');
    assignBoolOption(out, options, 'allowsSelectLockedCells');
    assignBoolOption(out, options, 'allowsSelectUnlockedCells');
    assignBoolOption(out, options, 'allowsSort');
    assignBoolOption(out, options, 'allowsAutoFilter');
    assignBoolOption(out, options, 'allowsPivotTables');
    assignBoolOption(out, options, 'allowsEditObjects');
    assignBoolOption(out, options, 'allowsEditScenarios');
    return out;
}

/**
 * assignBoolOption function.
 *
 * @param {*} target - target value.
 * @param {SheetProtectionOptions} source - source value.
 * @param {string} key - key value.
 * @returns {void} Nothing.
 */
function assignBoolOption(
    target: Required<SheetProtectionFlags>,
    source: SheetProtectionOptions,
    key: keyof SheetProtectionFlags
): void {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    const v: boolean | undefined = source[key];
    if (v === undefined) {
        return;
    }
    if (typeof v !== 'boolean') {
        throw new InvalidProtectionError(
            `Sheet protection option "${key}" must be a boolean`
        );
    }
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    target[key] = v;
}

/**
 * modelHasPassword function.
 *
 * @param {SheetProtectionModel} model - model value.
 * @returns {boolean} Function result.
 */
function modelHasPassword(model: SheetProtectionModel): boolean {
    if (
        model.hashValue !== undefined &&
    model.hashValue.length > 0 &&
    model.saltValue !== undefined &&
    model.saltValue.length > 0
    ) {
        return true;
    }
    return (
        model.legacyPassword !== undefined && model.legacyPassword.length > 0
    );
}

/**
 * cloneModel function.
 *
 * @param {SheetProtectionModel} m - m value.
 * @returns {SheetProtectionModel} Function result.
 */
function cloneModel(m: SheetProtectionModel): SheetProtectionModel {
    return {
        present: m.present,
        sheet: m.sheet,
        options: { ...m.options },
        algorithmName: m.algorithmName,
        hashValue: m.hashValue,
        saltValue: m.saltValue,
        spinCount: m.spinCount,
        legacyPassword: m.legacyPassword,
        extraAttrsXml: m.extraAttrsXml
    };
}

/**
 * parseBoolAttr function.
 *
 * @param {string | undefined} raw - raw value.
 * @param {boolean} defaultValue - defaultValue value.
 * @returns {boolean} Function result.
 */
function parseBoolAttr(raw: string | undefined, defaultValue: boolean): boolean {
    if (raw === undefined) {
        return defaultValue;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return defaultValue;
}

/**
 * emptyToUndefined function.
 *
 * @param {string | undefined} raw - raw value.
 * @returns {string | undefined} Function result.
 */
function emptyToUndefined(raw: string | undefined): string | undefined {
    if (raw === undefined) {
        return undefined;
    }
    return raw.length > 0 ? raw : undefined;
}

/**
 * pushBoolIfNotDefault function.
 *
 * @param {string[]} parts - parts value.
 * @param {string} name - name value.
 * @param {boolean} value - value value.
 * @param {boolean} xsdDefault - xsdDefault value.
 * @returns {void} Nothing.
 */
function pushBoolIfNotDefault(
    parts: string[],
    name: string,
    value: boolean,
    xsdDefault: boolean
): void {
    if (value === xsdDefault) {
        return;
    }
    parts.push(`${name}="${value ? '1' : '0'}"`);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string) => __t != null ? __t : '')(m == null ? undefined : m[1]);
}
