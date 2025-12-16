export class _TripleDataEncryptionStandardCipher {
    readonly _blockSize: number = 8;
    private _key1: Int32Array;
    private _key2: Int32Array;
    private _key3: Int32Array;
    private _isEncryption: boolean = true;
    _sp1: number[] = [0x01010400, 0x00000000, 0x00010000, 0x01010404, 0x01010004, 0x00010404,
        0x00000004, 0x00010000, 0x00000400, 0x01010400, 0x01010404, 0x00000400, 0x01000404,
        0x01010004, 0x01000000, 0x00000004, 0x00000404, 0x01000400, 0x01000400, 0x00010400,
        0x00010400, 0x01010000, 0x01010000, 0x01000404, 0x00010004, 0x01000004, 0x01000004,
        0x00010004, 0x00000000, 0x00000404, 0x00010404, 0x01000000, 0x00010000, 0x01010404,
        0x00000004, 0x01010000, 0x01010400, 0x01000000, 0x01000000, 0x00000400, 0x01010004,
        0x00010000, 0x00010400, 0x01000004, 0x00000400, 0x00000004, 0x01000404, 0x00010404,
        0x01010404, 0x00010004, 0x01010000, 0x01000404, 0x01000004, 0x00000404, 0x00010404,
        0x01010400, 0x00000404, 0x01000400, 0x01000400, 0x00000000, 0x00010004, 0x00010400,
        0x00000000, 0x01010004];
    _sp2: number[] = [0x80108020, 0x80008000, 0x00008000, 0x00108020, 0x00100000, 0x00000020,
        0x80100020, 0x80008020, 0x80000020, 0x80108020, 0x80108000, 0x80000000, 0x80008000,
        0x00100000, 0x00000020, 0x80100020, 0x00108000, 0x00100020, 0x80008020, 0x00000000,
        0x80000000, 0x00008000, 0x00108020, 0x80100000, 0x00100020, 0x80000020, 0x00000000,
        0x00108000, 0x00008020, 0x80108000, 0x80100000, 0x00008020, 0x00000000, 0x00108020,
        0x80100020, 0x00100000, 0x80008020, 0x80100000, 0x80108000, 0x00008000, 0x80100000,
        0x80008000, 0x00000020, 0x80108020, 0x00108020, 0x00000020, 0x00008000, 0x80000000,
        0x00008020, 0x80108000, 0x00100000, 0x80000020, 0x00100020, 0x80008020, 0x80000020,
        0x00100020, 0x00108000, 0x00000000, 0x80008000, 0x00008020, 0x80000000, 0x80100020,
        0x80108020, 0x00108000];
    _sp3: number[] = [0x00000208, 0x08020200, 0x00000000, 0x08020008, 0x08000200, 0x00000000,
        0x00020208, 0x08000200, 0x00020008, 0x08000008, 0x08000008, 0x00020000, 0x08020208,
        0x00020008, 0x08020000, 0x00000208, 0x08000000, 0x00000008, 0x08020200, 0x00000200,
        0x00020200, 0x08020000, 0x08020008, 0x00020208, 0x08000208, 0x00020200, 0x00020000,
        0x08000208, 0x00000008, 0x08020208, 0x00000200, 0x08000000, 0x08020200, 0x08000000,
        0x00020008, 0x00000208, 0x00020000, 0x08020200, 0x08000200, 0x00000000, 0x00000200,
        0x00020008, 0x08020208, 0x08000200, 0x08000008, 0x00000200, 0x00000000, 0x08020008,
        0x08000208, 0x00020000, 0x08000000, 0x08020208, 0x00000008, 0x00020208, 0x00020200,
        0x08000008, 0x08020000, 0x08000208, 0x00000208, 0x08020000, 0x00020208, 0x00000008,
        0x08020008, 0x00020200];
    _sp4: number[] = [0x00802001, 0x00002081, 0x00002081, 0x00000080, 0x00802080, 0x00800081,
        0x00800001, 0x00002001, 0x00000000, 0x00802000, 0x00802000, 0x00802081, 0x00000081,
        0x00000000, 0x00800080, 0x00800001, 0x00000001, 0x00002000, 0x00800000, 0x00802001,
        0x00000080, 0x00800000, 0x00002001, 0x00002080, 0x00800081, 0x00000001, 0x00002080,
        0x00800080, 0x00002000, 0x00802080, 0x00802081, 0x00000081, 0x00800080, 0x00800001,
        0x00802000, 0x00802081, 0x00000081, 0x00000000, 0x00000000, 0x00802000, 0x00002080,
        0x00800080, 0x00800081, 0x00000001, 0x00802001, 0x00002081, 0x00002081, 0x00000080,
        0x00802081, 0x00000081, 0x00000001, 0x00002000, 0x00800001, 0x00002001, 0x00802080,
        0x00800081, 0x00002001, 0x00002080, 0x00800000, 0x00802001, 0x00000080, 0x00800000,
        0x00002000, 0x00802080];
    _sp5: number[] = [0x00000100, 0x02080100, 0x02080000, 0x42000100, 0x00080000, 0x00000100,
        0x40000000, 0x02080000, 0x40080100, 0x00080000, 0x02000100, 0x40080100, 0x42000100,
        0x42080000, 0x00080100, 0x40000000, 0x02000000, 0x40080000, 0x40080000, 0x00000000,
        0x40000100, 0x42080100, 0x42080100, 0x02000100, 0x42080000, 0x40000100, 0x00000000,
        0x42000000, 0x02080100, 0x02000000, 0x42000000, 0x00080100, 0x00080000, 0x42000100,
        0x00000100, 0x02000000, 0x40000000, 0x02080000, 0x42000100, 0x40080100, 0x02000100,
        0x40000000, 0x42080000, 0x02080100, 0x40080100, 0x00000100, 0x02000000, 0x42080000,
        0x42080100, 0x00080100, 0x42000000, 0x42080100, 0x02080000, 0x00000000, 0x40080000,
        0x42000000, 0x00080100, 0x02000100, 0x40000100, 0x00080000, 0x00000000, 0x40080000,
        0x02080100, 0x40000100];
    _sp6: number[] = [0x20000010, 0x20400000, 0x00004000, 0x20404010, 0x20400000, 0x00000010,
        0x20404010, 0x00400000, 0x20004000, 0x00404010, 0x00400000, 0x20000010, 0x00400010,
        0x20004000, 0x20000000, 0x00004010, 0x00000000, 0x00400010, 0x20004010, 0x00004000,
        0x00404000, 0x20004010, 0x00000010, 0x20400010, 0x20400010, 0x00000000, 0x00404010,
        0x20404000, 0x00004010, 0x00404000, 0x20404000, 0x20000000, 0x20004000, 0x00000010,
        0x20400010, 0x00404000, 0x20404010, 0x00400000, 0x00004010, 0x20000010, 0x00400000,
        0x20004000, 0x20000000, 0x00004010, 0x20000010, 0x20404010, 0x00404000, 0x20400000,
        0x00404010, 0x20404000, 0x00000000, 0x20400010, 0x00000010, 0x00004000, 0x20400000,
        0x00404010, 0x00004000, 0x00400010, 0x20004010, 0x00000000, 0x20404000, 0x20000000,
        0x00400010, 0x20004010];
    _sp7: number[] = [0x00200000, 0x04200002, 0x04000802, 0x00000000, 0x00000800, 0x04000802,
        0x00200802, 0x04200800, 0x04200802, 0x00200000, 0x00000000, 0x04000002, 0x00000002,
        0x04000000, 0x04200002, 0x00000802, 0x04000800, 0x00200802, 0x00200002, 0x04000800,
        0x04000002, 0x04200000, 0x04200800, 0x00200002, 0x04200000, 0x00000800, 0x00000802,
        0x04200802, 0x00200800, 0x00000002, 0x04000000, 0x00200800, 0x04000000, 0x00200800,
        0x00200000, 0x04000802, 0x04000802, 0x04200002, 0x04200002, 0x00000002, 0x00200002,
        0x04000000, 0x04000800, 0x00200000, 0x04200800, 0x00000802, 0x00200802, 0x04200800,
        0x00000802, 0x04000002, 0x04200802, 0x04200000, 0x00200800, 0x00000000, 0x00000002,
        0x04200802, 0x00000000, 0x00200802, 0x04200000, 0x00000800, 0x04000002, 0x04000800,
        0x00000800, 0x00200002];
    _sp8: number[] = [0x10001040, 0x00001000, 0x00040000, 0x10041040, 0x10000000, 0x10001040,
        0x00000040, 0x10000000, 0x00040040, 0x10040000, 0x10041040, 0x00041000, 0x10041000,
        0x00041040, 0x00001000, 0x00000040, 0x10040000, 0x10000040, 0x10001000, 0x00001040,
        0x00041000, 0x00040040, 0x10040040, 0x10041000, 0x00001040, 0x00000000, 0x00000000,
        0x10040040, 0x10000040, 0x10001000, 0x00041040, 0x00040000, 0x00041040, 0x00040000,
        0x10041000, 0x00001000, 0x00000040, 0x10040040, 0x00001000, 0x00041040, 0x10001000,
        0x00000040, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x00040000, 0x10001040,
        0x00000000, 0x10041040, 0x00040040, 0x10000040, 0x10040000, 0x10001000, 0x10001040,
        0x00000000, 0x10041040, 0x00041000, 0x00041000, 0x00001040, 0x00001040, 0x00040040,
        0x10000000, 0x10041000 ];
    constructor(key: Uint8Array, isEncryption: boolean = true) {
        if (!(key instanceof Uint8Array) || (key.length !== 16 && key.length !== 24)) {
            throw new Error('Triple DES key must be 16 or 24 bytes.');
        }
        this._isEncryption = isEncryption;
        const key1: Uint8Array = key.subarray(0, 8);
        const key2: Uint8Array = key.subarray(8, 16);
        const key3: Uint8Array = (key.length === 24) ? key.subarray(16, 24) : key1;
        this._key1 = this._generateWorkingKey(isEncryption, key1);
        this._key2 = this._generateWorkingKey(!isEncryption, key2);
        this._key3 = this._generateWorkingKey(isEncryption, key3);
    }
    _beToUint32(b: Uint8Array, off: number): number {
        return ((b[<number>off] << 24) | (b[off + 1] << 16) | (b[off + 2] << 8) | b[off + 3]) >>> 0;
    }
    _uint32ToBe(v: number, b: Uint8Array, off: number): void {
        b[<number>off] = (v >>> 24) & 0xff;
        b[off + 1] = (v >>> 16) & 0xff;
        b[off + 2] = (v >>> 8) & 0xff;
        b[off + 3] = v & 0xff;
    }
    _generateWorkingKey(isEncrypt: boolean, keyBytes: Uint8Array): Int32Array {
        const ByteBit: number[] = [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01];
        const BigByte: number[] = [
            0x800000, 0x400000, 0x200000, 0x100000, 0x80000, 0x40000, 0x20000, 0x10000,
            0x8000, 0x4000, 0x2000, 0x1000, 0x800, 0x400, 0x200, 0x100,
            0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01
        ];
        const Pc1: number[] = [56, 48, 40, 32, 24, 16, 8, 0, 57, 49, 41, 33, 25, 17,
            9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 62, 54, 46, 38, 30,
            22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 60, 52, 44, 36, 28, 20, 12, 4,
            27, 19, 11, 3];
        const Totrot: number[] = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
        const Pc2: number[] = [13, 16, 10, 23, 0, 4, 2, 27, 14, 5, 20, 9, 22, 18, 11, 3, 25,
            7, 15, 6, 26, 19, 12, 1, 40, 51, 30, 36, 46, 54, 29, 39, 50, 44, 32, 47, 43, 48,
            38, 55, 33, 52, 45, 41, 49, 35, 28, 31];
        const newKeys: Int32Array = new Int32Array(32);
        const bytes1: any = new Array(56).fill(false); //eslint-disable-line
        const bytes2: any = new Array(56).fill(false); //eslint-disable-line
        for (let j: number = 0; j < 56; j++) {
            const length: number = Pc1[<number>j];
            bytes1[<number>j] = ((keyBytes[length >> 3] & ByteBit[length & 7]) !== 0);
        }
        for (let i: number = 0; i < 16; i++) {
            const b: number = isEncrypt ? i << 1 : (15 - i) << 1;
            const c: number = b + 1;
            newKeys[<number>b] = newKeys[<number>c] = 0;
            for (let j: number = 0; j < 28; j++) {
                const a: number = j + Totrot[<number>i];
                bytes2[<number>j] = (a < 28) ? bytes1[<number>a] : bytes1[a - 28];
            }
            for (let j: number = 28; j < 56; j++) {
                const a: number = j + Totrot[<number>i];
                bytes2[<number>j] = (a < 56) ? bytes1[<number>a] : bytes1[a - 28];
            }
            for (let j: number = 0; j < 24; j++) {
                if (bytes2[Pc2[<number>j]]) {
                    newKeys[<number>b] |= BigByte[<number>j];
                }
                if (bytes2[Pc2[j + 24]]) {
                    newKeys[<number>c] |= BigByte[<number>j];
                }
            }
        }
        for (let i: number = 0; i !== 32; i += 2) {
            const value1: number = newKeys[<number>i];
            const value2: number = newKeys[i + 1];
            newKeys[<number>i] = ((value1 & 0x00fc0000) << 6) | ((value1 & 0x00000fc0) << 10) |
                ((value2 & 0x00fc0000) >>> 10) | ((value2 & 0x00000fc0) >>> 6);
            newKeys[i + 1] = ((value1 & 0x0003f000) << 12) | ((value1 & 0x0000003f) << 16) |
                ((value2 & 0x0003f000) >>> 4) | (value2 & 0x0000003f);
        }
        return newKeys;
    }
    _processEncryptionBlock(keys: Int32Array, inBytes: Uint8Array, inOffset: number, outBytes: Uint8Array, outOffset: number): void {
        let left: number = this._beToUint32(inBytes, inOffset) >>> 0;
        let right: number = this._beToUint32(inBytes, inOffset + 4) >>> 0;
        let data: number = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= data; left ^= (data << 4);
        data = ((left >>> 16) ^ right) & 0x0000ffff; right ^= data; left ^= (data << 16);
        data = ((right >>> 2) ^ left) & 0x33333333; left ^= data; right ^= (data << 2);
        data = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= data; right ^= (data << 8);
        right = ((right << 1) | (right >>> 31)) >>> 0;
        data = (left ^ right) & 0xaaaaaaaa; left ^= data; right ^= data;
        left = ((left << 1) | (left >>> 31)) >>> 0;
        for (let round: number = 0; round < 8; round++) {
            data = ((right << 28) | (right >>> 4)) >>> 0;
            data = data ^ keys[round * 4 + 0];
            let value: number = this._sp7[data & 0x3f] | this._sp5[(data >>> 8) & 0x3f] |
                this._sp3[(data >>> 16) & 0x3f] | this._sp1[(data >>> 24) & 0x3f];
            data = (right ^ keys[round * 4 + 1]) >>> 0;
            value |= this._sp8[data & 0x3f] | this._sp6[(data >>> 8) & 0x3f] |
                this._sp4[(data >>> 16) & 0x3f] | this._sp2[(data >>> 24) & 0x3f];
            left ^= value;
            data = ((left << 28) | (left >>> 4)) >>> 0;
            data = data ^ keys[round * 4 + 2];
            value = this._sp7[data & 0x3f] | this._sp5[(data >>> 8) & 0x3f] |
                this._sp3[(data >>> 16) & 0x3f] | this._sp1[(data >>> 24) & 0x3f];
            data = (left ^ keys[round * 4 + 3]) >>> 0;
            value |= this._sp8[data & 0x3f] | this._sp6[(data >>> 8) & 0x3f] |
                this._sp4[(data >>> 16) & 0x3f] | this._sp2[(data >>> 24) & 0x3f];
            right ^= value;
        }
        right = ((right << 31) | (right >>> 1)) >>> 0;
        data = (left ^ right) & 0xaaaaaaaa; left ^= data; right ^= data;
        left = ((left << 31) | (left >>> 1)) >>> 0;
        data = ((left >>> 8) ^ right) & 0x00ff00ff; right ^= data; left ^= (data << 8);
        data = ((left >>> 2) ^ right) & 0x33333333; right ^= data; left ^= (data << 2);
        data = ((right >>> 16) ^ left) & 0x0000ffff; left ^= data; right ^= (data << 16);
        data = ((right >>> 4) ^ left) & 0x0f0f0f0f; left ^= data; right ^= (data << 4);
        this._uint32ToBe(right, outBytes, outOffset);
        this._uint32ToBe(left, outBytes, outOffset + 4);
    }
    _processBlock(input: Uint8Array, inOffset: number, output: Uint8Array, outOffset: number): number {
        const blockSize: number = this._blockSize;
        const tempBytes: Uint8Array = new Uint8Array(blockSize);
        if (this._isEncryption) {
            this._processEncryptionBlock(this._key1, input, inOffset, tempBytes, 0);
            this._processEncryptionBlock(this._key2, tempBytes, 0, tempBytes, 0);
            this._processEncryptionBlock(this._key3, tempBytes, 0, output, outOffset);
        } else {
            this._processEncryptionBlock(this._key3, input, inOffset, tempBytes, 0);
            this._processEncryptionBlock(this._key2, tempBytes, 0, tempBytes, 0);
            this._processEncryptionBlock(this._key1, tempBytes, 0, output, outOffset);
        }
        return blockSize;
    }
}
