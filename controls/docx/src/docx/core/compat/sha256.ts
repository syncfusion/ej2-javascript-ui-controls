/**
 * Browser SHA-256 (FIPS 180-4) for content-addressable media dedupe.
 * Synchronous and dependency-free so classic AMD / gulp emit (TS 3.3, es5)
 * does not import Node `crypto`, which browsers cannot load.
 */

const K: ReadonlyArray<number> = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rotr(value: number, bits: number): number {
    return (value >>> bits) | (value << (32 - bits));
}

/**
 * Lowercase hex SHA-256 of `data`.
 *
 * @param {Uint8Array} data - The data.
 * @returns {string} The result.
 * @private
 */
export function sha256Hex(data: Uint8Array): string {
    const bitLength: number = data.length * 8;
    const withPadding: number = data.length + 1 + 8;
    const paddedLength: number = (withPadding + 63) & ~63;
    const padded: Uint8Array = new Uint8Array(paddedLength);
    padded.set(data);
    padded[data.length] = 0x80;
    const view: DataView = new DataView(padded.buffer);
    // High 32 bits stay 0: media payloads are far below 512 MiB.
    view.setUint32(paddedLength - 4, bitLength >>> 0, false);

    let h0: number = 0x6a09e667;
    let h1: number = 0xbb67ae85;
    let h2: number = 0x3c6ef372;
    let h3: number = 0xa54ff53a;
    let h4: number = 0x510e527f;
    let h5: number = 0x9b05688c;
    let h6: number = 0x1f83d9ab;
    let h7: number = 0x5be0cd19;
    const w: number[] = new Array<number>(64);

    for (let offset: number = 0; offset < paddedLength; offset += 64) {
        for (let i: number = 0; i < 16; i++) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            w[i] = view.getUint32(offset + i * 4, false);
        }
        for (let i: number = 16; i < 64; i++) {
            const s0: number = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1: number = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        }
        let a: number = h0;
        let b: number = h1;
        let c: number = h2;
        let d: number = h3;
        let e: number = h4;
        let f: number = h5;
        let g: number = h6;
        let h: number = h7;
        for (let i: number = 0; i < 64; i++) {
            const s1: number = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch: number = (e & f) ^ (~e & g);
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            const temp1: number = (h + s1 + ch + K[i] + w[i]) | 0;
            const s0: number = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj: number = (a & b) ^ (a & c) ^ (b & c);
            const temp2: number = (s0 + maj) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }
        h0 = (h0 + a) | 0;
        h1 = (h1 + b) | 0;
        h2 = (h2 + c) | 0;
        h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0;
        h5 = (h5 + f) | 0;
        h6 = (h6 + g) | 0;
        h7 = (h7 + h) | 0;
    }

    const out: Uint8Array = new Uint8Array(32);
    const outView: DataView = new DataView(out.buffer);
    outView.setUint32(0, h0, false);
    outView.setUint32(4, h1, false);
    outView.setUint32(8, h2, false);
    outView.setUint32(12, h3, false);
    outView.setUint32(16, h4, false);
    outView.setUint32(20, h5, false);
    outView.setUint32(24, h6, false);
    outView.setUint32(28, h7, false);
    let hex: string = '';
    for (let i: number = 0; i < out.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        hex += (out[i] < 16 ? '0' : '') + out[i].toString(16);
    }
    return hex;
}
