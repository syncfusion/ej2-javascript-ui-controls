import { _Cipher } from './cipher';
export class _NormalCipherFour extends _Cipher {
    _a: number;
    _b: number;
    _s: Uint8Array;
    constructor(key: Uint8Array) {
        super();
        this._a = 0;
        this._b = 0;
        const s: Uint8Array = new Uint8Array(256);
        for (let i: number = 0; i < 256; ++i) {
            s[<number>i] = i;
        }
        const keyLength: number = key.length;
        for (let i: number = 0, j: number = 0; i < 256; ++i) {
            const buffer: number = s[<number>i];
            j = (j + buffer + key[i % keyLength]) & 0xff;
            s[<number>i] = s[<number>j];
            s[<number>j] = buffer;
        }
        this._s = s;
    }
    _encryptBlock(data: Uint8Array): Uint8Array {
        let a: number = this._a;
        let b: number = this._b;
        const s: Uint8Array = this._s;
        const n: number = data.length;
        const output: Uint8Array = new Uint8Array(n);
        for (let i: number = 0; i < n; ++i) {
            a = (a + 1) & 0xff;
            const first: number = s[<number>a];
            b = (b + first) & 0xff;
            const second: number = s[<number>b];
            s[<number>a] = second;
            s[<number>b] = first;
            output[<number>i] = data[<number>i] ^ s[(first + second) & 0xff];
        }
        this._a = a;
        this._b = b;
        return output;
    }
    _decryptBlock(data: Uint8Array): Uint8Array {
        return this._encryptBlock(data);
    }
    _encrypt(data: Uint8Array): Uint8Array {
        return this._encryptBlock(data);
    }
}
export class _NullCipher extends _Cipher {
    _decryptBlock(data: Uint8Array): Uint8Array {
        return data;
    }
    _encrypt(data: Uint8Array): Uint8Array {
        return data;
    }
}
export class _CipherTwo extends _Cipher {
    _key: Uint8Array;
    _blockSize: number = 8;
    _effectiveKeyBits: number = 64;
    _expandedKey: Uint16Array;
    constructor(key: Uint8Array, effectiveKeyBits: number = 64) {
        super();
        if (!(key instanceof Uint8Array) || key.length < 5 || key.length > 128) {
            throw new Error('RC2 key must be between 5 and 128 bytes.');
        }
        this._key = key;
        this._effectiveKeyBits = effectiveKeyBits;
        this._expandedKey = this._expandKey(key, this._effectiveKeyBits);
    }
    _expandKey(key: Uint8Array, bits: number): Uint16Array {
        const piTable: number[] = [
            217, 120, 249, 196, 25, 221, 181, 237, 40, 233, 253, 121, 74, 160, 216, 157,
            198, 126, 55, 131, 43, 118, 83, 142, 98, 76, 100, 136, 68, 139, 251, 162,
            23, 154, 89, 245, 135, 179, 79, 19, 97, 69, 109, 141, 9, 129, 125, 50,
            189, 143, 64, 235, 134, 183, 123, 11, 240, 149, 33, 34, 92, 107, 78, 130,
            84, 214, 101, 147, 206, 96, 178, 28, 115, 86, 192, 20, 167, 140, 241, 220,
            18, 117, 202, 31, 59, 190, 228, 209, 66, 61, 212, 48, 163, 60, 182, 38,
            111, 191, 14, 218, 70, 105, 7, 87, 39, 242, 29, 155, 188, 148, 67, 3,
            248, 17, 199, 246, 144, 239, 62, 231, 6, 195, 213, 47, 200, 102, 30, 215,
            8, 232, 234, 222, 128, 82, 238, 247, 132, 170, 114, 172, 53, 77, 106, 42,
            150, 26, 210, 113, 90, 21, 73, 116, 75, 159, 208, 94, 4, 24, 164, 236,
            194, 224, 65, 110, 15, 81, 203, 204, 36, 145, 175, 80, 161, 244, 112, 57,
            153, 124, 58, 133, 35, 184, 180, 122, 252, 2, 54, 91, 37, 85, 151, 49,
            45, 93, 250, 152, 227, 138, 146, 174, 5, 223, 41, 16, 103, 108, 186, 201,
            211, 0, 230, 207, 225, 158, 168, 44, 99, 22, 1, 63, 88, 226, 137, 169,
            13, 56, 52, 27, 171, 51, 255, 176, 187, 72, 12, 95, 185, 177, 205, 46,
            197, 243, 219, 71, 229, 165, 156, 119, 10, 166, 32, 104, 254, 127, 193, 173
        ];
        const xKey: Uint8Array = new Uint8Array(128);
        xKey.set(key);
        let len: number = key.length;
        if (len < 128) {
            let index: number = 0;
            let x: number = xKey[len - 1];
            while (len < 128) {
                x = piTable[(x + xKey[index++]) & 0xFF] & 0xFF;
                xKey[len++] = x;
            }
        }
        const t: number = (bits + 7) >> 3;
        const mask: number = 0xFF >> (7 & -bits);
        let x: number = piTable[xKey[128 - t] & mask] & 0xFF;
        xKey[128 - t] = x;
        for (let i: number = 128 - t - 1; i >= 0; i--) {
            x = piTable[x ^ xKey[i + t]] & 0xFF;
            xKey[<number>i] = x;
        }
        const newKey: Uint16Array = new Uint16Array(64);
        for (let i: number = 0; i < 64; i++) {
            newKey[<number>i] = xKey[2 * i] + (xKey[2 * i + 1] << 8);
        }
        return newKey;
    }
    _rotateLeft(x: number, n: number): number {
        return ((x << n) | (x >>> (16 - n))) & 0xFFFF;
    }
    _rotateRight(x: number, n: number): number {
        return ((x >>> n) | (x << (16 - n))) & 0xFFFF;
    }
    _encryptBlock(block: Uint8Array): Uint8Array {
        const R: Uint16Array = new Uint16Array(4);
        for (let i: number = 0; i < 4; i++) {
            R[<number>i] = block[2 * i] + (block[2 * i + 1] << 8);
        }
        let j: number = 0;
        for (let round: number = 0; round < 16; round++) {
            R[0] = this._rotateLeft((R[0] + (R[1] & ~R[3]) + (R[2] & R[3]) + this._expandedKey[j++]) & 0xFFFF, 1);
            R[1] = this._rotateLeft((R[1] + (R[2] & ~R[0]) + (R[3] & R[0]) + this._expandedKey[j++]) & 0xFFFF, 2);
            R[2] = this._rotateLeft((R[2] + (R[3] & ~R[1]) + (R[0] & R[1]) + this._expandedKey[j++]) & 0xFFFF, 3);
            R[3] = this._rotateLeft((R[3] + (R[0] & ~R[2]) + (R[1] & R[2]) + this._expandedKey[j++]) & 0xFFFF, 5);
            if (round === 4 || round === 10) {
                R[0] = (R[0] + this._expandedKey[R[3] & 63]) & 0xFFFF;
                R[1] = (R[1] + this._expandedKey[R[0] & 63]) & 0xFFFF;
                R[2] = (R[2] + this._expandedKey[R[1] & 63]) & 0xFFFF;
                R[3] = (R[3] + this._expandedKey[R[2] & 63]) & 0xFFFF;
            }
        }
        const encrypted: Uint8Array = new Uint8Array(8);
        for (let i: number = 0; i < 4; i++) {
            encrypted[2 * i] = R[<number>i] & 0xFF;
            encrypted[2 * i + 1] = R[<number>i] >>> 8;
        }
        return encrypted;
    }
    _decryptBlock(block: Uint8Array): Uint8Array {
        const R: Uint16Array = new Uint16Array(4);
        for (let i: number = 0; i < 4; i++) {
            R[<number>i] = block[2 * i] + (block[2 * i + 1] << 8);
        }
        let j: number = 63;
        for (let round: number = 15; round >= 0; round--) {
            if (round === 4 || round === 10) {
                R[3] = (R[3] - this._expandedKey[R[2] & 63]) & 0xFFFF;
                R[2] = (R[2] - this._expandedKey[R[1] & 63]) & 0xFFFF;
                R[1] = (R[1] - this._expandedKey[R[0] & 63]) & 0xFFFF;
                R[0] = (R[0] - this._expandedKey[R[3] & 63]) & 0xFFFF;
            }
            R[3] = this._rotateRight(R[3], 5);
            R[3] = (R[3] - (R[0] & ~R[2]) - (R[1] & R[2]) - this._expandedKey[j--]) & 0xFFFF;
            R[2] = this._rotateRight(R[2], 3);
            R[2] = (R[2] - (R[3] & ~R[1]) - (R[0] & R[1]) - this._expandedKey[j--]) & 0xFFFF;
            R[1] = this._rotateRight(R[1], 2);
            R[1] = (R[1] - (R[2] & ~R[0]) - (R[3] & R[0]) - this._expandedKey[j--]) & 0xFFFF;
            R[0] = this._rotateRight(R[0], 1);
            R[0] = (R[0] - (R[1] & ~R[3]) - (R[2] & R[3]) - this._expandedKey[j--]) & 0xFFFF;
        }
        const decrypted: Uint8Array = new Uint8Array(8);
        for (let i: number = 0; i < 4; i++) {
            decrypted[2 * i] = R[<number>i] & 0xFF;
            decrypted[2 * i + 1] = R[<number>i] >>> 8;
        }
        return decrypted;
    }
    _encrypt(data: Uint8Array): Uint8Array {
        const padLength: number = this._blockSize - (data.length % this._blockSize);
        const padded: Uint8Array = new Uint8Array(data.length + padLength);
        padded.set(data);
        padded.fill(padLength, data.length);
        const result: Uint8Array[] = [];
        for (let i: number = 0; i < padded.length; i += this._blockSize) {
            const block: Uint8Array = padded.subarray(i, i + this._blockSize);
            result.push(this._encryptBlock(block));
        }
        const totalLength: number = result.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        const output: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const chunk of result) {
            output.set(chunk, offset);
            offset += chunk.length;
        }
        return output;
    }
    _decrypt(data: Uint8Array, iv?: Uint8Array): Uint8Array {
        const result: Uint8Array[] = [];
        let previousBlock: Uint8Array = iv;
        for (let i: number = 0; i < data.length; i += this._blockSize) {
            const block: Uint8Array = data.subarray(i, i + this._blockSize);
            const decryptedBlock: Uint8Array = this._decryptBlock(block);
            for (let j: number = 0; j < this._blockSize; j++) {
                decryptedBlock[<number>j] ^= previousBlock[<number>j];
            }
            result.push(decryptedBlock);
            previousBlock = block;
        }
        const totalLength: number = result.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        const decrypted: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const chunk of result) {
            decrypted.set(chunk, offset);
            offset += chunk.length;
        }
        const padLength: number = decrypted[decrypted.length - 1];
        if (padLength > 0 && padLength <= this._blockSize) {
            let isValidPadding: boolean = true;
            for (let i: number = decrypted.length - padLength; i < decrypted.length; i++) {
                if (decrypted[<number>i] !== padLength) {
                    isValidPadding = false;
                    break;
                }
            }
            if (isValidPadding) {
                return decrypted.subarray(0, decrypted.length - padLength);
            }
        }
        return decrypted;
    }
}
