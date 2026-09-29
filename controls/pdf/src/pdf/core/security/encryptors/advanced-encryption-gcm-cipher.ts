import { _AdvancedEncryptionBaseCipher } from './cipher';
/**
 * Advanced AES-256-GCM encryption cipher helper used internally for PDF encryption.
 *
 * @private
 */
export class _AdvancedEncryptionGcmCipher extends _AdvancedEncryptionBaseCipher {
    private _expandedKey: Uint8Array;
    private _gcmState: { iv: Uint8Array; counter: number; hashKey: Uint8Array };
    constructor(key: Uint8Array) {
        super();
        if (key.length !== 32) {
            throw new Error('AES-GCM requires 256-bit (32-byte) key');
        }
        this._cyclesOfRepetition = 14;
        this._keySize = 240;
        this._key = this._expandKey(key);
    }
    /**
     * Expands the provided 256-bit cipher key into the full AES-256 key schedule for GCM mode.
     *
     * @private
     * @param {Uint8Array} cipherKey - The original 32-byte cipher key to expand.
     * @returns {Uint8Array} The expanded key schedule (240 bytes).
     */
    _expandKey(cipherKey: Uint8Array): Uint8Array {
        const count: number = 240;
        const s: Uint8Array = this._s;
        const result: Uint8Array = new Uint8Array(count);
        result.set(cipherKey);
        let r: number = 1;
        let t1: number;
        let t2: number;
        let t3: number;
        let t4: number;
        for (let j: number = 32, i: number = 1; j < count; ++i) {
            if (j % 32 === 16) {
                t1 = s[<number>t1];
                t2 = s[<number>t2];
                t3 = s[<number>t3];
                t4 = s[<number>t4];
            } else if (j % 32 === 0) {
                t1 = result[j - 3];
                t2 = result[j - 2];
                t3 = result[j - 1];
                t4 = result[j - 4];
                t1 = s[<number>t1];
                t2 = s[<number>t2];
                t3 = s[<number>t3];
                t4 = s[<number>t4];
                t1 ^= r;
                r = r << 1;
                if (r >= 256) {
                    r = (r ^ 0x1b) & 0xff;
                }
            }
            for (let n: number = 0; n < 4; ++n) {
                result[<number>j] = t1 ^= result[j - 32];
                result[j + 1] = t2 ^= result[j - 31];
                result[j + 2] = t3 ^= result[j - 30];
                result[j + 3] = t4 ^= result[j - 29];
                j += 4;
            }
        }
        this._expandedKey = result;
        this._key = result;
        return result;
    }
    /**
     * Initializes GCM mode with the provided initialization vector.
     *
     * @private
     * @param {Uint8Array} iv - The 12-byte initialization vector.
     * @returns {void} Nothing.
     */
    _initializeGCM(iv: Uint8Array): void {
        if (iv.length !== 12) {
            throw new Error('AES-GCM requires 12-byte IV');
        }
        const hashKey: Uint8Array = this._encryptBlock(new Uint8Array(16), this._key);
        this._gcmState = {
            iv: new Uint8Array(iv),
            counter: 1,
            hashKey: hashKey
        };
    }
    /**
     * Encrypts a single AES block using the expanded key.
     *
     * @private
     * @param {Uint8Array} input - The 16-byte input block.
     * @param {Uint8Array} key - The expanded key schedule.
     * @returns {Uint8Array} The encrypted 16-byte block.
     */
    _encryptBlock(input: Uint8Array, key: Uint8Array): Uint8Array {
        const rounds: number = this._cyclesOfRepetition;
        const s: Uint8Array = this._s;
        const state: Uint8Array = new Uint8Array(16);
        state.set(input);
        for (let i: number = 0; i < 16; i++) {
            state[<number>i] ^= key[<number>i];
        }
        for (let round: number = 1; round < rounds; round++) {
            const temp: Uint8Array = new Uint8Array(16);
            for (let i: number = 0; i < 16; i++) {
                temp[<number>i] = s[state[<number>i]];
            }
            this._shiftRows(temp);
            this._mixColumns(temp);
            for (let i: number = 0; i < 16; i++) {
                temp[<number>i] ^= key[round * 16 + i];
            }
            state.set(temp);
        }
        const output: Uint8Array = new Uint8Array(16);
        for (let i: number = 0; i < 16; i++) {
            output[<number>i] = s[state[<number>i]];
        }
        this._shiftRows(output);
        for (let i: number = 0; i < 16; i++) {
            output[<number>i] ^= key[rounds * 16 + i];
        }
        return output;
    }
    /**
     * Performs the ShiftRows transformation on the state.
     *
     * @private
     * @param {Uint8Array} state - The 16-byte state array.
     * @returns {void} Nothing.
     */
    _shiftRows(state: Uint8Array): void {
        let temp: number;
        temp = state[1];
        state[1] = state[5];
        state[5] = state[9];
        state[9] = state[13];
        state[13] = temp;
        temp = state[2];
        state[2] = state[10];
        state[10] = temp;
        temp = state[6];
        state[6] = state[14];
        state[14] = temp;
        temp = state[15];
        state[15] = state[11];
        state[11] = state[7];
        state[7] = state[3];
        state[3] = temp;
    }
    /**
     * Performs the MixColumns transformation on the state.
     *
     * @private
     * @param {Uint8Array} state - The 16-byte state array.
     * @returns {void} Nothing.
     */
    _mixColumns(state: Uint8Array): void {
        for (let i: number = 0; i < 16; i += 4) {
            const s0: number = state[<number>i];
            const s1: number = state[i + 1];
            const s2: number = state[i + 2];
            const s3: number = state[i + 3];
            state[<number>i] = this._mul2(s0) ^ this._mul3(s1) ^ s2 ^ s3;
            state[i + 1] = s0 ^ this._mul2(s1) ^ this._mul3(s2) ^ s3;
            state[i + 2] = s0 ^ s1 ^ this._mul2(s2) ^ this._mul3(s3);
            state[i + 3] = this._mul3(s0) ^ s1 ^ s2 ^ this._mul2(s3);
        }
    }
    /**
     * Multiplies a byte by 2 in GF(2^8).
     *
     * @private
     * @param {number} x - The byte to multiply.
     * @returns {number} The result.
     */
    _mul2(x: number): number {
        return ((x << 1) ^ (((x >> 7) & 1) * 0x1b)) & 0xff;
    }
    /**
     * Multiplies a byte by 3 in GF(2^8).
     *
     * @private
     * @param {number} x - The byte to multiply.
     * @returns {number} The result.
     */
    _mul3(x: number): number {
        return this._mul2(x) ^ x;
    }
    /**
     * Increments the GCM counter block.
     *
     * @private
     * @param {Uint8Array} counterBlock - The 16-byte counter block.
     * @returns {void} Nothing.
     */
    _incrementCounter(counterBlock: Uint8Array): void {
        for (let i: number = 15; i >= 12; i--) {
            counterBlock[<number>i]++;
            if (counterBlock[<number>i] !== 0) {
                break;
            }
        }
    }
    /**
     * Performs GCTR encryption on the input data.
     *
     * @private
     * @param {Uint8Array} data - The data to encrypt.
     * @returns {Uint8Array} The encrypted data.
     */
    _gctrEncrypt(data: Uint8Array): Uint8Array {
        if (!this._gcmState) {
            throw new Error('GCM state not initialized');
        }
        const output: Uint8Array = new Uint8Array(data.length);
        const counterBlock: Uint8Array = new Uint8Array(16);
        counterBlock.set(this._gcmState.iv, 0);
        counterBlock[12] = 0;
        counterBlock[13] = 0;
        counterBlock[14] = 0;
        counterBlock[15] = 2;
        const blockCount: number = Math.ceil(data.length / 16);
        for (let i: number = 0; i < blockCount; i++) {
            const keyStream: Uint8Array = this._encryptBlock(counterBlock, this._key);
            const blockStart: number = i * 16;
            const blockEnd: number = Math.min(blockStart + 16, data.length);
            for (let j: number = blockStart; j < blockEnd; j++) {
                output[<number>j] = data[<number>j] ^ keyStream[j - blockStart];
            }
            this._incrementCounter(counterBlock);
        }
        return output;
    }
    /**
     * Multiplies two blocks in GF(2^128) using the GCM field.
     *
     * @private
     * @param {Uint8Array} x - First 16-byte block.
     * @param {Uint8Array} y - Second 16-byte block.
     * @returns {Uint8Array} The product block.
     */
    _gfMult(x: Uint8Array, y: Uint8Array): Uint8Array {
        const z: Uint8Array = new Uint8Array(16);
        const v: Uint8Array = new Uint8Array(y);
        for (let i: number = 0; i < 128; i++) {
            const byteIndex: number = Math.floor(i / 8);
            const bitIndex: number = 7 - (i % 8);
            if ((x[<number>byteIndex] & (1 << bitIndex)) !== 0) {
                for (let j: number = 0; j < 16; j++) {
                    z[<number>j] ^= v[<number>j];
                }
            }
            const lsb: number = v[15] & 1;
            for (let j: number = 15; j > 0; j--) {
                v[<number>j] = (v[<number>j] >>> 1) | ((v[j - 1] & 1) << 7);
            }
            v[0] = v[0] >>> 1;
            if (lsb !== 0) {
                v[0] ^= 0xe1;
            }
        }
        return z;
    }
    /**
     * Computes the GHASH authentication tag.
     *
     * @private
     * @param {Uint8Array} aad - Additional authenticated data.
     * @param {Uint8Array} ciphertext - The encrypted data.
     * @returns {Uint8Array} The 16-byte authentication tag.
     */
    _ghash(aad: Uint8Array, ciphertext: Uint8Array): Uint8Array {
        if (!this._gcmState) {
            throw new Error('GCM state not initialized');
        }
        const h: Uint8Array = this._gcmState.hashKey;
        let y: Uint8Array = new Uint8Array(16);
        const processBlocks: (data: Uint8Array) => void = (data: Uint8Array): void => {
            const blockCount: number = Math.ceil(data.length / 16);
            for (let i: number = 0; i < blockCount; i++) {
                const block: Uint8Array = new Uint8Array(16);
                const start: number = i * 16;
                const end: number = Math.min(start + 16, data.length);
                for (let j: number = start; j < end; j++) {
                    block[j - start] = data[<number>j];
                }
                for (let j: number = 0; j < 16; j++) {
                    y[<number>j] ^= block[<number>j];
                }
                y = this._gfMult(y, h);
            }
        };
        processBlocks(aad);
        processBlocks(ciphertext);
        const lengths: Uint8Array = new Uint8Array(16);
        const aadBits: number = aad.length * 8;
        const ctBits: number = ciphertext.length * 8;
        const aadHigh: number = Math.floor(aadBits / 0x100000000);
        const aadLow: number = aadBits >>> 0;
        const ctHigh: number = Math.floor(ctBits / 0x100000000);
        const ctLow: number = ctBits >>> 0;
        lengths[0] = (aadHigh >>> 24) & 0xff;
        lengths[1] = (aadHigh >>> 16) & 0xff;
        lengths[2] = (aadHigh >>> 8) & 0xff;
        lengths[3] = aadHigh & 0xff;
        lengths[4] = (aadLow >>> 24) & 0xff;
        lengths[5] = (aadLow >>> 16) & 0xff;
        lengths[6] = (aadLow >>> 8) & 0xff;
        lengths[7] = aadLow & 0xff;
        lengths[8] = (ctHigh >>> 24) & 0xff;
        lengths[9] = (ctHigh >>> 16) & 0xff;
        lengths[10] = (ctHigh >>> 8) & 0xff;
        lengths[11] = ctHigh & 0xff;
        lengths[12] = (ctLow >>> 24) & 0xff;
        lengths[13] = (ctLow >>> 16) & 0xff;
        lengths[14] = (ctLow >>> 8) & 0xff;
        lengths[15] = ctLow & 0xff;
        for (let i: number = 0; i < 16; i++) {
            y[<number>i] ^= lengths[<number>i];
        }
        y = this._gfMult(y, h);
        return y;
    }
    /**
     * Computes the GCM authentication tag.
     *
     * @private
     * @param {Uint8Array} aad - Additional authenticated data.
     * @param {Uint8Array} ciphertext - The encrypted data.
     * @returns {Uint8Array} The 16-byte authentication tag.
     */
    _computeAuthTag(aad: Uint8Array, ciphertext: Uint8Array): Uint8Array {
        if (!this._gcmState) {
            throw new Error('GCM state not initialized');
        }
        const ghashResult: Uint8Array = this._ghash(aad, ciphertext);
        const j0: Uint8Array = new Uint8Array(16);
        j0.set(this._gcmState.iv, 0);
        j0[12] = 0;
        j0[13] = 0;
        j0[14] = 0;
        j0[15] = 1;
        const encryptedJ0: Uint8Array = this._encryptBlock(j0, this._key);
        const tag: Uint8Array = new Uint8Array(16);
        for (let i: number = 0; i < 16; i++) {
            tag[<number>i] = ghashResult[<number>i] ^ encryptedJ0[<number>i];
        }
        return tag;
    }
    /**
     * Encrypts data using AES-256-GCM and returns IV + encrypted data + authentication tag concatenated.
     *
     * @private
     * @param {Uint8Array} data - Data to encrypt.
     * @returns {Uint8Array} Concatenated IV (12 bytes) + encrypted data + authentication tag (16 bytes).
     */
    _encrypt(data: Uint8Array): Uint8Array {
        const iv: Uint8Array = new Uint8Array(12);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(iv);
        } else {
            for (let i: number = 0; i < 12; i++) {
                iv[<number>i] = Math.floor(Math.random() * 256);
            }
        }
        this._initializeGCM(iv);
        const ciphertext: Uint8Array = this._gctrEncrypt(data);
        const tag: Uint8Array = this._computeAuthTag(new Uint8Array(0), ciphertext);
        const result: Uint8Array = new Uint8Array(12 + ciphertext.length + 16);
        result.set(iv, 0);
        result.set(ciphertext, 12);
        result.set(tag, 12 + ciphertext.length);
        return result;
    }
    /**
     * Decrypts a block of data using AES-256-GCM with tag verification.
     *
     * @private
     * @param {Uint8Array} data - Data to decrypt (includes IV, ciphertext, and tag).
     * @param {boolean} [finalize] - Whether this is the final block.
     * @param {Uint8Array} [iv] - Optional initialization vector (12 bytes).
     * @returns {Uint8Array} Decrypted bytes.
     */
    _decryptBlock(data: Uint8Array, finalize?: boolean, iv?: Uint8Array): Uint8Array {
        if (data.length < 28) {
            throw new Error('GCM encrypted data must include IV (12 bytes) and tag (16 bytes)');
        }
        const ivBytes: Uint8Array = iv ? iv : data.subarray(0, 12);
        const tag: Uint8Array = data.subarray(data.length - 16);
        const ciphertext: Uint8Array = iv ? data : data.subarray(12, data.length - 16);
        this._initializeGCM(ivBytes);
        const computedTag: Uint8Array = this._computeAuthTag(new Uint8Array(0), ciphertext);
        let tagMatch: boolean = true;
        for (let i: number = 0; i < 16; i++) {
            if (tag[<number>i] !== computedTag[<number>i]) {
                tagMatch = false;
                break;
            }
        }
        if (!tagMatch) {
            throw new Error('GCM authentication tag verification failed');
        }
        return this._gctrEncrypt(ciphertext);
    }
}
