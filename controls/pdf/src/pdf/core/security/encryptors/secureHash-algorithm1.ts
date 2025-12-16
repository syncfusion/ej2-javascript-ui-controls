import { _PdfNativeAccumulatorSink, _PdfNativeHashInput } from '../digital-signature/signature/pdf-accumulator';
export class _Sha1 {
    _startChunkedConversion(outputSink: _PdfNativeAccumulatorSink): _PdfNativeHashInput {
        return new _PdfNativeHashInput(this, outputSink);
    }
    _rotateLeft(x: number, n: number): number {
        return (x << n) | (x >>> (32 - n));
    }
    _hash(data: Uint8Array, offset: number, length: number): Uint8Array {
        const paddedLength: number = ((length + 9 + 63) >> 6) << 6;
        const padded: Uint8Array = new Uint8Array(paddedLength);
        let i: number = 0;
        for (; i < length; ++i) {
            padded[<number>i] = data[<number>offset++];
        }
        padded[<number>i++] = 0x80;
        const bitLength: number = length * 8;
        padded[paddedLength - 4] = (bitLength >>> 24) & 0xff;
        padded[paddedLength - 3] = (bitLength >>> 16) & 0xff;
        padded[paddedLength - 2] = (bitLength >>> 8) & 0xff;
        padded[paddedLength - 1] = bitLength & 0xff;
        let h0: number = 0x67452301;
        let h1: number = 0xefcdab89;
        let h2: number = 0x98badcfe;
        let h3: number = 0x10325476;
        let h4: number = 0xc3d2e1f0;
        const w: Uint32Array = new Uint32Array(80);
        for (let j: number = 0; j < paddedLength; j += 64) {
            for (let k: number = 0; k < 16; ++k) {
                const idx: number = j + k * 4;
                w[<number>k] = (padded[<number>idx] << 24) | (padded[idx + 1] << 16) | (padded[idx + 2] << 8) | padded[idx + 3];
            }
            for (let k: number = 16; k < 80; ++k) {
                w[<number>k] = this._rotateLeft(w[k - 3] ^ w[k - 8] ^ w[k - 14] ^ w[k - 16], 1);
            }
            let a: number = h0;
            let b: number = h1;
            let c: number = h2;
            let d: number = h3;
            let e: number = h4;
            for (let k: number = 0; k < 80; ++k) {
                let f: number;
                let kConst: number;
                if (k < 20) {
                    f = (b & c) | (~b & d);
                    kConst = 0x5a827999;
                } else if (k < 40) {
                    f = b ^ c ^ d;
                    kConst = 0x6ed9eba1;
                } else if (k < 60) {
                    f = (b & c) | (b & d) | (c & d);
                    kConst = 0x8f1bbcdc;
                } else {
                    f = b ^ c ^ d;
                    kConst = 0xca62c1d6;
                }
                const temp: number = (this._rotateLeft(a, 5) + f + e + kConst + w[<number>k]) >>> 0;
                e = d;
                d = c;
                c = this._rotateLeft(b, 30);
                b = a;
                a = temp;
            }
            h0 = (h0 + a) >>> 0;
            h1 = (h1 + b) >>> 0;
            h2 = (h2 + c) >>> 0;
            h3 = (h3 + d) >>> 0;
            h4 = (h4 + e) >>> 0;
        }
        return new Uint8Array([
            (h0 >>> 24) & 0xff, (h0 >>> 16) & 0xff, (h0 >>> 8) & 0xff, h0 & 0xff,
            (h1 >>> 24) & 0xff, (h1 >>> 16) & 0xff, (h1 >>> 8) & 0xff, h1 & 0xff,
            (h2 >>> 24) & 0xff, (h2 >>> 16) & 0xff, (h2 >>> 8) & 0xff, h2 & 0xff,
            (h3 >>> 24) & 0xff, (h3 >>> 16) & 0xff, (h3 >>> 8) & 0xff, h3 & 0xff,
            (h4 >>> 24) & 0xff, (h4 >>> 16) & 0xff, (h4 >>> 8) & 0xff, h4 & 0xff
        ]);
    }
}
