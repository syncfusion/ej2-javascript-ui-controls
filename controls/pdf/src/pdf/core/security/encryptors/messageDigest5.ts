export class _MD5 {
    _r: Uint8Array = new Uint8Array([7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9,
        14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]);
    _k: Int32Array = new Int32Array([-680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983,
        1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632,
        643717713, -373897302, -701558691, 38016083, -660478335, -405537848, 568446438, -1019803690, -187363961, 1163531501,
        -1444681467, -51403784, 1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353,
        -155497632, -1094730640, 681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
        -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799, 1873313359, -30611744,
        -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551]);
    hash(data: Uint8Array, offset?: number, length?: number): Uint8Array {
        let h0: number = 1732584193;
        let h1: number = -271733879;
        let h2: number = -1732584194;
        let h3: number = 271733878;
        const paddedLength: number = (length + 72) & ~63;
        const padded: Uint8Array = new Uint8Array(paddedLength);
        let i: number = 0;
        let j: number = 0;
        for (; i < length; ++i) {
            padded[<number>i] = data[offset++];
        }
        padded[i++] = 0x80;
        const n: number = paddedLength - 8;
        while (i < n) {
            padded[i++] = 0;
        }
        padded[i++] = (length << 3) & 0xff;
        padded[i++] = (length >> 5) & 0xff;
        padded[i++] = (length >> 13) & 0xff;
        padded[i++] = (length >> 21) & 0xff;
        padded[i++] = (length >>> 29) & 0xff;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        const w: Int32Array = new Int32Array(16);
        for (i = 0; i < paddedLength;) {
            for (j = 0; j < 16; ++j, i += 4) {
                w[<number>j] = padded[<number>i] |
                    (padded[i + 1] << 8) |
                    (padded[i + 2] << 16) |
                    (padded[i + 3] << 24);
            }
            let a: number = h0;
            let b: number = h1;
            let c: number = h2;
            let d: number = h3;
            let e: number;
            let f: number;
            for (j = 0; j < 64; ++j) {
                if (j < 16) {
                    e = (b & c) | (~b & d);
                    f = j;
                } else if (j < 32) {
                    e = (d & b) | (~d & c);
                    f = (5 * j + 1) & 15;
                } else if (j < 48) {
                    e = b ^ c ^ d;
                    f = (3 * j + 5) & 15;
                } else {
                    e = c ^ (b | ~d);
                    f = (7 * j) & 15;
                }
                const previous: number = d;
                const current: number = (a + e + this._k[<number>j] + w[<number>f]) | 0;
                const rotate: number = this._r[<number>j];
                d = c;
                c = b;
                b = (b + ((current << rotate) | (current >>> (32 - rotate)))) | 0;
                a = previous;
            }
            h0 = (h0 + a) | 0;
            h1 = (h1 + b) | 0;
            h2 = (h2 + c) | 0;
            h3 = (h3 + d) | 0;
        }
        return new Uint8Array([h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >>> 24) & 0xFF, h1 & 0xFF,
            (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >>> 24) & 0xFF, h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF,
            (h2 >>> 24) & 0xFF, h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >>> 24) & 0xFF
        ]);
    }
}
