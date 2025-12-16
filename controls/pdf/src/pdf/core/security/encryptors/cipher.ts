export abstract class _Cipher {
    abstract _decryptBlock(data: Uint8Array, finalize?: boolean, iv?: Uint8Array): Uint8Array;
    abstract _encrypt(data: Uint8Array): Uint8Array;
}
export abstract class _AdvancedEncryptionBaseCipher extends _Cipher {
    _mixC: Uint8Array;
    _buffer: Uint8Array = new Uint8Array(16);
    _position: number = 0;
    _keySize: number;
    _cyclesOfRepetition: number;
    _iv: Uint8Array;
    _key: Uint8Array;
    _bufferLength: number;
    _s: Uint8Array = new Uint8Array([
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
        0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
        0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
        0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
        0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
        0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
        0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
        0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
        0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
        0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
        0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
        0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
        0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
        0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
        0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
        0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
        0xb0, 0x54, 0xbb, 0x16
    ]);
    _inverseS: Uint8Array = new Uint8Array([
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
        0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
        0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
        0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
        0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
        0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
        0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
        0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
        0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
        0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
        0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
        0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
        0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
        0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
        0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
        0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
        0x55, 0x21, 0x0c, 0x7d
    ]);
    _mix: Uint32Array = new Uint32Array([
        0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927,
        0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45,
        0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb,
        0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381,
        0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf,
        0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66,
        0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28,
        0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012,
        0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec,
        0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e,
        0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd,
        0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7,
        0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89,
        0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b,
        0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815,
        0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f,
        0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa,
        0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8,
        0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36,
        0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c,
        0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742,
        0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea,
        0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4,
        0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e,
        0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360,
        0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502,
        0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87,
        0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd,
        0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3,
        0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621,
        0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f,
        0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55,
        0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26,
        0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844,
        0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba,
        0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480,
        0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce,
        0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67,
        0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929,
        0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713,
        0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed,
        0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f,
        0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3
    ]);
    get _mixCol(): Uint8Array {
        if (typeof this._mixC === 'undefined' || this._mixC === null) {
            this._mixC = new Uint8Array(256);
            for (let i: number = 0; i < 256; i++) {
                if (i < 128) {
                    this._mixC[<number>i] = i << 1;
                } else {
                    this._mixC[<number>i] = (i << 1) ^ 0x1b;
                }
            }
        }
        return this._mixC;
    }
    abstract _expandKey(cipherKey: Uint8Array): Uint8Array;
    _decrypt(input: Uint8Array, key: Uint8Array): Uint8Array {
        let t: number;
        let u: number;
        let v: number;
        const state: Uint8Array = new Uint8Array(16);
        state.set(input);
        for (let j: number = 0, k: number = this._keySize; j < 16; ++j, ++k) {
            state[<number>j] ^= key[<number>k];
        }
        for (let i: number = this._cyclesOfRepetition - 1; i >= 1; --i) {
            t = state[13];
            state[13] = state[9];
            state[9] = state[5];
            state[5] = state[1];
            state[1] = t;
            t = state[14];
            u = state[10];
            state[14] = state[6];
            state[10] = state[2];
            state[6] = t;
            state[2] = u;
            t = state[15];
            u = state[11];
            v = state[7];
            state[15] = state[3];
            state[11] = t;
            state[7] = u;
            state[3] = v;
            for (let j: number = 0; j < 16; ++j) {
                state[<number>j] = this._inverseS[state[<number>j]];
            }
            for (let j: number = 0, k: number = i * 16; j < 16; ++j, ++k) {
                state[<number>j] ^= key[<number>k];
            }
            for (let j: number = 0; j < 16; j += 4) {
                const s0: number = this._mix[state[<number>j]];
                const s1: number = this._mix[state[j + 1]];
                const s2: number = this._mix[state[j + 2]];
                const s3: number = this._mix[state[j + 3]];
                t = s0 ^ (s1 >>> 8) ^ (s1 << 24) ^ (s2 >>> 16) ^ (s2 << 16) ^ (s3 >>> 24) ^ (s3 << 8);
                state[<number>j] = (t >>> 24) & 0xff;
                state[j + 1] = (t >> 16) & 0xff;
                state[j + 2] = (t >> 8) & 0xff;
                state[j + 3] = t & 0xff;
            }
        }
        t = state[13];
        state[13] = state[9];
        state[9] = state[5];
        state[5] = state[1];
        state[1] = t;
        t = state[14];
        u = state[10];
        state[14] = state[6];
        state[10] = state[2];
        state[6] = t;
        state[2] = u;
        t = state[15];
        u = state[11];
        v = state[7];
        state[15] = state[3];
        state[11] = t;
        state[7] = u;
        state[3] = v;
        for (let j: number = 0; j < 16; ++j) {
            state[<number>j] = this._inverseS[state[<number>j]];
            state[<number>j] ^= key[<number>j];
        }
        return state;
    }
    _encryptBlock(input: Uint8Array, key: Uint8Array): Uint8Array {
        const s: Uint8Array = this._s;
        let t: number;
        let u: number;
        let v: number;
        const state: Uint8Array = new Uint8Array(16);
        state.set(input);
        for (let j: number = 0; j < 16; ++j) {
            state[<number>j] ^= key[<number>j];
        }
        for (let i: number = 1; i < this._cyclesOfRepetition; i++) {
            for (let j: number = 0; j < 16; ++j) {
                state[<number>j] = s[state[<number>j]];
            }
            v = state[1];
            state[1] = state[5];
            state[5] = state[9];
            state[9] = state[13];
            state[13] = v;
            v = state[2];
            u = state[6];
            state[2] = state[10];
            state[6] = state[14];
            state[10] = v;
            state[14] = u;
            v = state[3];
            u = state[7];
            t = state[11];
            state[3] = state[15];
            state[7] = v;
            state[11] = u;
            state[15] = t;
            for (let j: number = 0; j < 16; j += 4) {
                const s0: number = state[j + 0];
                const s1: number = state[j + 1];
                const s2: number = state[j + 2];
                const s3: number = state[j + 3];
                t = s0 ^ s1 ^ s2 ^ s3;
                state[j + 0] ^= t ^ this._mixCol[s0 ^ s1];
                state[j + 1] ^= t ^ this._mixCol[s1 ^ s2];
                state[j + 2] ^= t ^ this._mixCol[s2 ^ s3];
                state[j + 3] ^= t ^ this._mixCol[s3 ^ s0];
            }
            for (let j: number = 0, k: number = i * 16; j < 16; ++j, ++k) {
                state[<number>j] ^= key[<number>k];
            }
        }
        for (let j: number = 0; j < 16; ++j) {
            state[<number>j] = s[state[<number>j]];
        }
        v = state[1];
        state[1] = state[5];
        state[5] = state[9];
        state[9] = state[13];
        state[13] = v;
        v = state[2];
        u = state[6];
        state[2] = state[10];
        state[6] = state[14];
        state[10] = v;
        state[14] = u;
        v = state[3];
        u = state[7];
        t = state[11];
        state[3] = state[15];
        state[7] = v;
        state[11] = u;
        state[15] = t;
        for (let j: number = 0, k: number = this._keySize; j < 16; ++j, ++k) {
            state[<number>j] ^= key[<number>k];
        }
        return state;
    }
    _decryptBlockHelper(data: Uint8Array, finalize: boolean): Uint8Array {
        const sourceLength: number = data.length;
        let buffer: Uint8Array = this._buffer;
        let bufferLength: number = this._position;
        const result: Array<Uint8Array> = [];
        let iv: Uint8Array = this._iv;
        for (let i: number = 0; i < sourceLength; ++i) {
            buffer[<number>bufferLength] = data[<number>i];
            ++bufferLength;
            if (bufferLength < 16) {
                continue;
            }
            const plain: Uint8Array = this._decrypt(buffer, this._key);
            for (let j: number = 0; j < 16; ++j) {
                plain[<number>j] ^= iv[<number>j];
            }
            iv = buffer;
            result.push(plain);
            buffer = new Uint8Array(16);
            bufferLength = 0;
        }
        this._buffer = buffer;
        this._bufferLength = bufferLength;
        this._iv = iv;
        if (result.length === 0) {
            return new Uint8Array(0);
        }
        let outputLength: number = 16 * result.length;
        if (finalize) {
            const lastBlock: Uint8Array = result[result.length - 1];
            let length: number = lastBlock[15];
            if (length <= 16) {
                for (let i: number = 15, ii: number = 16 - length; i >= ii; --i) {
                    if (lastBlock[<number>i] !== length) {
                        length = 0;
                        break;
                    }
                }
                outputLength -= length;
                result[result.length - 1] = lastBlock.subarray(0, 16 - length);
            }
        }
        const output: Uint8Array = new Uint8Array(outputLength);
        for (let i: number = 0, j: number = 0; i < result.length; ++i, j += 16) {
            output.set(result[<number>i], j);
        }
        return output;
    }
    _decryptBlock(data: Uint8Array, finalize: boolean, iv?: Uint8Array): Uint8Array {
        const sourceLength: number = data.length;
        const buffer: Uint8Array = this._buffer;
        let bufferLength: number = this._position;
        if (iv) {
            this._iv = iv;
        } else {
            for (let i: number = 0; bufferLength < 16 && i < sourceLength; ++i, ++bufferLength) {
                buffer[<number>bufferLength] = data[<number>i];
            }
            if (bufferLength < 16) {
                this._bufferLength = bufferLength;
                return new Uint8Array(0);
            }
            this._iv = buffer;
            data = data.subarray(16);
        }
        this._buffer = new Uint8Array(16);
        this._bufferLength = 0;
        this._decryptBlock = this._decryptBlockHelper;
        return this._decryptBlock(data, finalize);
    }
    _encrypt(data: Uint8Array, iv?: Uint8Array): Uint8Array {
        const sourceLength: number = data.length;
        let buffer: Uint8Array = this._buffer;
        let bufferLength: number = this._position;
        const result: Array<Uint8Array> = [];
        if (!iv) {
            iv = new Uint8Array(16);
        }
        for (let i: number = 0; i < sourceLength; ++i) {
            buffer[<number>bufferLength] = data[<number>i];
            ++bufferLength;
            if (bufferLength < 16) {
                continue;
            }
            for (let j: number = 0; j < 16; ++j) {
                buffer[<number>j] ^= iv[<number>j];
            }
            const cipher: Uint8Array = this._encryptBlock(buffer, this._key);
            iv = cipher;
            result.push(cipher);
            buffer = new Uint8Array(16);
            bufferLength = 0;
        }
        this._buffer = buffer;
        this._bufferLength = bufferLength;
        this._iv = iv;
        if (result.length === 0) {
            return new Uint8Array(0);
        }
        const outputLength: number = 16 * result.length;
        const output: Uint8Array = new Uint8Array(outputLength);
        for (let i: number = 0, j: number = 0; i < result.length; ++i, j += 16) {
            output.set(result[<number>i], j);
        }
        return output;
    }
}
