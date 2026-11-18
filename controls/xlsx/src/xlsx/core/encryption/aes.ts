/**
 * Synchronous AES (FIPS 197) with CBC and ECB helpers in pure TypeScript.
 *
 * Used by ECMA-376 Agile encryption (AES-CBC) and Standard encryption (AES-ECB).
 * Table-driven; tables are built once on first use.
 *
 * @private
 */

import { InvalidArgumentError } from '../errors';

/** AES block size in bytes. */
export const AES_BLOCK_SIZE: number = 16;

interface AesTables {
    readonly sbox: Uint8Array;
    readonly inv: Uint8Array;
    readonly te: Uint32Array[];
    readonly td: Uint32Array[];
}

let TABLES: AesTables | undefined;

function xtime(x: number): number {
    return ((x << 1) ^ ((x & 0x80) !== 0 ? 0x11b : 0)) & 0xff;
}

function gmul(a: number, b: number): number {
    let result: number = 0;
    let x: number = a;
    let y: number = b;
    while (y > 0) {
        if ((y & 1) !== 0) {
            result ^= x;
        }
        x = xtime(x);
        y >>= 1;
    }
    return result;
}

function rotr8(x: number): number {
    return ((x >>> 8) | (x << 24)) >>> 0;
}

/**
 * Builds (once) the S-box, inverse S-box and round tables.
 *
 * @returns {AesTables} Shared tables.
 */
function getTables(): AesTables {
    if (TABLES !== undefined) {
        return TABLES;
    }
    const sbox: Uint8Array = new Uint8Array(256);
    const inv: Uint8Array = new Uint8Array(256);
    let p: number = 1;
    let q: number = 1;
    do {
        p = p ^ xtime(p);
        q ^= q << 1;
        q ^= q << 2;
        q ^= q << 4;
        q &= 0xff;
        if ((q & 0x80) !== 0) {
            q ^= 0x09;
        }
        const rot: (v: number, n: number) => number = (v: number, n: number): number => ((v << n) | (v >> (8 - n))) & 0xff;
        const x: number = q ^ rot(q, 1) ^ rot(q, 2) ^ rot(q, 3) ^ rot(q, 4);
        sbox[p] = x ^ 0x63;
    } while (p !== 1);
    sbox[0] = 0x63;
    for (let i: number = 0; i < 256; i++) {
        inv[sbox[i]] = i;
    }
    const te: Uint32Array[] = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    const td: Uint32Array[] = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    for (let i: number = 0; i < 256; i++) {
        const s: number = sbox[i];
        const e: number = ((gmul(s, 2) << 24) | (s << 16) | (s << 8) | gmul(s, 3)) >>> 0;
        const si: number = inv[i];
        const d: number = ((gmul(si, 14) << 24) | (gmul(si, 9) << 16) | (gmul(si, 13) << 8) | gmul(si, 11)) >>> 0;
        te[0][i] = e;
        te[1][i] = rotr8(e);
        te[2][i] = rotr8(te[1][i]);
        te[3][i] = rotr8(te[2][i]);
        td[0][i] = d;
        td[1][i] = rotr8(d);
        td[2][i] = rotr8(td[1][i]);
        td[3][i] = rotr8(td[2][i]);
    }
    TABLES = { sbox, inv, te, td };
    return TABLES;
}

/**
 * AES block cipher keyed with a 128-, 192- or 256-bit key.
 *
 * @private
 */
export class AesCipher {
    private readonly rounds: number;
    private readonly encKeys: Uint32Array;
    private readonly decKeys: Uint32Array;

    /**
     * Creates a cipher.
     *
     * @param {Uint8Array} key - 16, 24 or 32 key bytes.
     * @throws InvalidArgumentError when the key length is not valid.
     */
    public constructor(key: Uint8Array) {
        if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
            throw new InvalidArgumentError('AES key must be 16, 24, or 32 bytes');
        }
        const sbox: Uint8Array = getTables().sbox;
        const nk: number = key.length / 4;
        this.rounds = nk + 6;
        const total: number = 4 * (this.rounds + 1);
        const w: Uint32Array = new Uint32Array(total);
        for (let i: number = 0; i < nk; i++) {
            w[i] = ((key[4 * i] << 24) | (key[4 * i + 1] << 16) | (key[4 * i + 2] << 8) | key[4 * i + 3]) >>> 0;
        }
        let rcon: number = 1;
        for (let i: number = nk; i < total; i++) {
            let t: number = w[i - 1];
            if (i % nk === 0) {
                t = ((t << 8) | (t >>> 24)) >>> 0;
                t = subWord(t, sbox);
                t = (t ^ (rcon << 24)) >>> 0;
                rcon = xtime(rcon);
            } else if (nk > 6 && i % nk === 4) {
                t = subWord(t, sbox);
            }
            w[i] = (w[i - nk] ^ t) >>> 0;
        }
        this.encKeys = w;
        // Equivalent inverse cipher: reverse round order, InvMixColumns on middle rounds.
        const td: Uint32Array[] = getTables().td;
        const dk: Uint32Array = new Uint32Array(total);
        for (let r: number = 0; r <= this.rounds; r++) {
            for (let c: number = 0; c < 4; c++) {
                const word: number = w[(this.rounds - r) * 4 + c];
                dk[r * 4 + c] = r === 0 || r === this.rounds ? word :
                    (td[0][sbox[word >>> 24]] ^ td[1][sbox[(word >>> 16) & 255]] ^
                        td[2][sbox[(word >>> 8) & 255]] ^ td[3][sbox[word & 255]]) >>> 0;
            }
        }
        this.decKeys = dk;
    }

    /**
     * Encrypts one 16-byte block.
     *
     * @param {Uint8Array} src - Source buffer.
     * @param {number} so - Source offset.
     * @param {Uint8Array} dst - Destination buffer (may equal `src`).
     * @param {number} d0 - Destination offset.
     * @returns {void}
     */
    public encryptBlock(src: Uint8Array, so: number, dst: Uint8Array, d0: number): void {
        const tables: AesTables = getTables();
        const te: Uint32Array[] = tables.te;
        const sbox: Uint8Array = tables.sbox;
        const k: Uint32Array = this.encKeys;
        let s0: number = (((src[so] << 24) | (src[so + 1] << 16) | (src[so + 2] << 8) | src[so + 3]) ^ k[0]) >>> 0;
        let s1: number = (((src[so + 4] << 24) | (src[so + 5] << 16) | (src[so + 6] << 8) | src[so + 7]) ^ k[1]) >>> 0;
        let s2: number = (((src[so + 8] << 24) | (src[so + 9] << 16) | (src[so + 10] << 8) | src[so + 11]) ^ k[2]) >>> 0;
        let s3: number = (((src[so + 12] << 24) | (src[so + 13] << 16) | (src[so + 14] << 8) | src[so + 15]) ^ k[3]) >>> 0;
        const t0: Uint32Array = te[0];
        const t1: Uint32Array = te[1];
        const t2: Uint32Array = te[2];
        const t3: Uint32Array = te[3];
        let ki: number = 4;
        for (let r: number = 1; r < this.rounds; r++) {
            const a: number = t0[s0 >>> 24] ^ t1[(s1 >>> 16) & 255] ^ t2[(s2 >>> 8) & 255] ^ t3[s3 & 255] ^ k[ki];
            const b: number = t0[s1 >>> 24] ^ t1[(s2 >>> 16) & 255] ^ t2[(s3 >>> 8) & 255] ^ t3[s0 & 255] ^ k[ki + 1];
            const c: number = t0[s2 >>> 24] ^ t1[(s3 >>> 16) & 255] ^ t2[(s0 >>> 8) & 255] ^ t3[s1 & 255] ^ k[ki + 2];
            const d: number = t0[s3 >>> 24] ^ t1[(s0 >>> 16) & 255] ^ t2[(s1 >>> 8) & 255] ^ t3[s2 & 255] ^ k[ki + 3];
            s0 = a >>> 0; s1 = b >>> 0; s2 = c >>> 0; s3 = d >>> 0;
            ki += 4;
        }
        const o0: number = ((sbox[s0 >>> 24] << 24) | (sbox[(s1 >>> 16) & 255] << 16) | (sbox[(s2 >>> 8) & 255] << 8) | sbox[s3 & 255]) ^ k[ki];
        const o1: number = ((sbox[s1 >>> 24] << 24) | (sbox[(s2 >>> 16) & 255] << 16) | (sbox[(s3 >>> 8) & 255] << 8) | sbox[s0 & 255]) ^ k[ki + 1];
        const o2: number = ((sbox[s2 >>> 24] << 24) | (sbox[(s3 >>> 16) & 255] << 16) | (sbox[(s0 >>> 8) & 255] << 8) | sbox[s1 & 255]) ^ k[ki + 2];
        const o3: number = ((sbox[s3 >>> 24] << 24) | (sbox[(s0 >>> 16) & 255] << 16) | (sbox[(s1 >>> 8) & 255] << 8) | sbox[s2 & 255]) ^ k[ki + 3];
        storeWord(dst, d0, o0);
        storeWord(dst, d0 + 4, o1);
        storeWord(dst, d0 + 8, o2);
        storeWord(dst, d0 + 12, o3);
    }

    /**
     * Decrypts one 16-byte block.
     *
     * @param {Uint8Array} src - Source buffer.
     * @param {number} so - Source offset.
     * @param {Uint8Array} dst - Destination buffer (may equal `src`).
     * @param {number} d0 - Destination offset.
     * @returns {void}
     */
    public decryptBlock(src: Uint8Array, so: number, dst: Uint8Array, d0: number): void {
        const tables: AesTables = getTables();
        const td: Uint32Array[] = tables.td;
        const isb: Uint8Array = tables.inv;
        const k: Uint32Array = this.decKeys;
        let s0: number = (((src[so] << 24) | (src[so + 1] << 16) | (src[so + 2] << 8) | src[so + 3]) ^ k[0]) >>> 0;
        let s1: number = (((src[so + 4] << 24) | (src[so + 5] << 16) | (src[so + 6] << 8) | src[so + 7]) ^ k[1]) >>> 0;
        let s2: number = (((src[so + 8] << 24) | (src[so + 9] << 16) | (src[so + 10] << 8) | src[so + 11]) ^ k[2]) >>> 0;
        let s3: number = (((src[so + 12] << 24) | (src[so + 13] << 16) | (src[so + 14] << 8) | src[so + 15]) ^ k[3]) >>> 0;
        const t0: Uint32Array = td[0];
        const t1: Uint32Array = td[1];
        const t2: Uint32Array = td[2];
        const t3: Uint32Array = td[3];
        let ki: number = 4;
        for (let r: number = 1; r < this.rounds; r++) {
            const a: number = t0[s0 >>> 24] ^ t1[(s3 >>> 16) & 255] ^ t2[(s2 >>> 8) & 255] ^ t3[s1 & 255] ^ k[ki];
            const b: number = t0[s1 >>> 24] ^ t1[(s0 >>> 16) & 255] ^ t2[(s3 >>> 8) & 255] ^ t3[s2 & 255] ^ k[ki + 1];
            const c: number = t0[s2 >>> 24] ^ t1[(s1 >>> 16) & 255] ^ t2[(s0 >>> 8) & 255] ^ t3[s3 & 255] ^ k[ki + 2];
            const d: number = t0[s3 >>> 24] ^ t1[(s2 >>> 16) & 255] ^ t2[(s1 >>> 8) & 255] ^ t3[s0 & 255] ^ k[ki + 3];
            s0 = a >>> 0; s1 = b >>> 0; s2 = c >>> 0; s3 = d >>> 0;
            ki += 4;
        }
        const o0: number = ((isb[s0 >>> 24] << 24) | (isb[(s3 >>> 16) & 255] << 16) | (isb[(s2 >>> 8) & 255] << 8) | isb[s1 & 255]) ^ k[ki];
        const o1: number = ((isb[s1 >>> 24] << 24) | (isb[(s0 >>> 16) & 255] << 16) | (isb[(s3 >>> 8) & 255] << 8) | isb[s2 & 255]) ^ k[ki + 1];
        const o2: number = ((isb[s2 >>> 24] << 24) | (isb[(s1 >>> 16) & 255] << 16) | (isb[(s0 >>> 8) & 255] << 8) | isb[s3 & 255]) ^ k[ki + 2];
        const o3: number = ((isb[s3 >>> 24] << 24) | (isb[(s2 >>> 16) & 255] << 16) | (isb[(s1 >>> 8) & 255] << 8) | isb[s0 & 255]) ^ k[ki + 3];
        storeWord(dst, d0, o0);
        storeWord(dst, d0 + 4, o1);
        storeWord(dst, d0 + 8, o2);
        storeWord(dst, d0 + 12, o3);
    }
    /**
     * CBC encrypt without padding (callers pad to a block multiple).
     *
     * @param {Uint8Array} iv - 16-byte initialisation vector.
     * @param {Uint8Array} data - Plain bytes; length must be a multiple of 16.
     * @returns {Uint8Array} Cipher bytes.
     */
    public cbcEncrypt(iv: Uint8Array, data: Uint8Array): Uint8Array {
        requireBlocks(data);
        const out: Uint8Array = new Uint8Array(data.length);
        const chain: Uint8Array = new Uint8Array(16);
        chain.set(iv.subarray(0, 16));
        for (let o: number = 0; o < data.length; o += 16) {
            for (let i: number = 0; i < 16; i++) {
                chain[i] ^= data[o + i];
            }
            this.encryptBlock(chain, 0, out, o);
            chain.set(out.subarray(o, o + 16));
        }
        return out;
    }

    /**
     * CBC decrypt without padding removal.
     *
     * @param {Uint8Array} iv - 16-byte initialisation vector.
     * @param {Uint8Array} data - Cipher bytes; length must be a multiple of 16.
     * @returns {Uint8Array} Plain bytes.
     */
    public cbcDecrypt(iv: Uint8Array, data: Uint8Array): Uint8Array {
        requireBlocks(data);
        const out: Uint8Array = new Uint8Array(data.length);
        for (let o: number = 0; o < data.length; o += 16) {
            this.decryptBlock(data, o, out, o);
            for (let i: number = 0; i < 16; i++) {
                out[o + i] ^= o === 0 ? iv[i] : data[o - 16 + i];
            }
        }
        return out;
    }

    /**
     * ECB decrypt (Standard encryption only).
     *
     * @param {Uint8Array} data - Cipher bytes; length must be a multiple of 16.
     * @returns {Uint8Array} Plain bytes.
     */
    public ecbDecrypt(data: Uint8Array): Uint8Array {
        requireBlocks(data);
        const out: Uint8Array = new Uint8Array(data.length);
        for (let o: number = 0; o < data.length; o += 16) {
            this.decryptBlock(data, o, out, o);
        }
        return out;
    }
}

function subWord(t: number, sbox: Uint8Array): number {
    return ((sbox[t >>> 24] << 24) | (sbox[(t >>> 16) & 255] << 16) | (sbox[(t >>> 8) & 255] << 8) | sbox[t & 255]) >>> 0;
}

function storeWord(dst: Uint8Array, o: number, v: number): void {
    dst[o] = (v >>> 24) & 0xff;
    dst[o + 1] = (v >>> 16) & 0xff;
    dst[o + 2] = (v >>> 8) & 0xff;
    dst[o + 3] = v & 0xff;
}

function requireBlocks(data: Uint8Array): void {
    if (data.length % AES_BLOCK_SIZE !== 0) {
        throw new InvalidArgumentError('AES input length must be a multiple of 16 bytes');
    }
}

/**
 * AES-CBC encrypt without padding (callers pad to a block multiple).
 *
 * @param {Uint8Array} key - AES key.
 * @param {Uint8Array} iv - 16-byte initialisation vector.
 * @param {Uint8Array} data - Plain bytes; length must be a multiple of 16.
 * @returns {Uint8Array} Cipher bytes.
 */
export function aesCbcEncrypt(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Uint8Array {
    return new AesCipher(key).cbcEncrypt(iv, data);
}

/**
 * AES-CBC decrypt without padding removal.
 *
 * @param {Uint8Array} key - AES key.
 * @param {Uint8Array} iv - 16-byte initialisation vector.
 * @param {Uint8Array} data - Cipher bytes; length must be a multiple of 16.
 * @returns {Uint8Array} Plain bytes.
 */
export function aesCbcDecrypt(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Uint8Array {
    return new AesCipher(key).cbcDecrypt(iv, data);
}

/**
 * AES-ECB decrypt (Standard encryption only).
 *
 * @param {Uint8Array} key - AES key.
 * @param {Uint8Array} data - Cipher bytes; length must be a multiple of 16.
 * @returns {Uint8Array} Plain bytes.
 */
export function aesEcbDecrypt(key: Uint8Array, data: Uint8Array): Uint8Array {
    return new AesCipher(key).ecbDecrypt(data);
}
