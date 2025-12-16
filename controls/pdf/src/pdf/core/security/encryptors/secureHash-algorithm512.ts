import { _PdfNativeAccumulatorSink, _PdfNativeHashInput } from '../digital-signature/signature/pdf-accumulator';
import { _Word64 } from '../encryptor';
export class _Sha512 {
    _startChunkedConversion(outputSink: _PdfNativeAccumulatorSink): _PdfNativeHashInput {
        return new _PdfNativeHashInput(this, outputSink);
    }
    _k: Array<_Word64> = [new _Word64(0x428a2f98, 0xd728ae22), new _Word64(0x71374491, 0x23ef65cd),
        new _Word64(0xb5c0fbcf, 0xec4d3b2f), new _Word64(0xe9b5dba5, 0x8189dbbc),
        new _Word64(0x3956c25b, 0xf348b538), new _Word64(0x59f111f1, 0xb605d019),
        new _Word64(0x923f82a4, 0xaf194f9b), new _Word64(0xab1c5ed5, 0xda6d8118),
        new _Word64(0xd807aa98, 0xa3030242), new _Word64(0x12835b01, 0x45706fbe),
        new _Word64(0x243185be, 0x4ee4b28c), new _Word64(0x550c7dc3, 0xd5ffb4e2),
        new _Word64(0x72be5d74, 0xf27b896f), new _Word64(0x80deb1fe, 0x3b1696b1),
        new _Word64(0x9bdc06a7, 0x25c71235), new _Word64(0xc19bf174, 0xcf692694),
        new _Word64(0xe49b69c1, 0x9ef14ad2), new _Word64(0xefbe4786, 0x384f25e3),
        new _Word64(0x0fc19dc6, 0x8b8cd5b5), new _Word64(0x240ca1cc, 0x77ac9c65),
        new _Word64(0x2de92c6f, 0x592b0275), new _Word64(0x4a7484aa, 0x6ea6e483),
        new _Word64(0x5cb0a9dc, 0xbd41fbd4), new _Word64(0x76f988da, 0x831153b5),
        new _Word64(0x983e5152, 0xee66dfab), new _Word64(0xa831c66d, 0x2db43210),
        new _Word64(0xb00327c8, 0x98fb213f), new _Word64(0xbf597fc7, 0xbeef0ee4),
        new _Word64(0xc6e00bf3, 0x3da88fc2), new _Word64(0xd5a79147, 0x930aa725),
        new _Word64(0x06ca6351, 0xe003826f), new _Word64(0x14292967, 0x0a0e6e70),
        new _Word64(0x27b70a85, 0x46d22ffc), new _Word64(0x2e1b2138, 0x5c26c926),
        new _Word64(0x4d2c6dfc, 0x5ac42aed), new _Word64(0x53380d13, 0x9d95b3df),
        new _Word64(0x650a7354, 0x8baf63de), new _Word64(0x766a0abb, 0x3c77b2a8),
        new _Word64(0x81c2c92e, 0x47edaee6), new _Word64(0x92722c85, 0x1482353b),
        new _Word64(0xa2bfe8a1, 0x4cf10364), new _Word64(0xa81a664b, 0xbc423001),
        new _Word64(0xc24b8b70, 0xd0f89791), new _Word64(0xc76c51a3, 0x0654be30),
        new _Word64(0xd192e819, 0xd6ef5218), new _Word64(0xd6990624, 0x5565a910),
        new _Word64(0xf40e3585, 0x5771202a), new _Word64(0x106aa070, 0x32bbd1b8),
        new _Word64(0x19a4c116, 0xb8d2d0c8), new _Word64(0x1e376c08, 0x5141ab53),
        new _Word64(0x2748774c, 0xdf8eeb99), new _Word64(0x34b0bcb5, 0xe19b48a8),
        new _Word64(0x391c0cb3, 0xc5c95a63), new _Word64(0x4ed8aa4a, 0xe3418acb),
        new _Word64(0x5b9cca4f, 0x7763e373), new _Word64(0x682e6ff3, 0xd6b2b8a3),
        new _Word64(0x748f82ee, 0x5defb2fc), new _Word64(0x78a5636f, 0x43172f60),
        new _Word64(0x84c87814, 0xa1f0ab72), new _Word64(0x8cc70208, 0x1a6439ec),
        new _Word64(0x90befffa, 0x23631e28), new _Word64(0xa4506ceb, 0xde82bde9),
        new _Word64(0xbef9a3f7, 0xb2c67915), new _Word64(0xc67178f2, 0xe372532b),
        new _Word64(0xca273ece, 0xea26619c), new _Word64(0xd186b8c7, 0x21c0c207),
        new _Word64(0xeada7dd6, 0xcde0eb1e), new _Word64(0xf57d4f7f, 0xee6ed178),
        new _Word64(0x06f067aa, 0x72176fba), new _Word64(0x0a637dc5, 0xa2c898a6),
        new _Word64(0x113f9804, 0xbef90dae), new _Word64(0x1b710b35, 0x131c471b),
        new _Word64(0x28db77f5, 0x23047d84), new _Word64(0x32caab7b, 0x40c72493),
        new _Word64(0x3c9ebe0a, 0x15c9bebc), new _Word64(0x431d67c4, 0x9c100d4c),
        new _Word64(0x4cc5d4be, 0xcb3e42b6), new _Word64(0x597f299c, 0xfc657e2a),
        new _Word64(0x5fcb6fab, 0x3ad6faec), new _Word64(0x6c44198c, 0x4a475817)];
    _sigma(result: _Word64, x: _Word64, buffer: _Word64): void {
        result.assign(x);
        result.rotateRight(28);
        buffer.assign(x);
        buffer.rotateRight(34);
        result.xor(buffer);
        buffer.assign(x);
        buffer.rotateRight(39);
        result.xor(buffer);
    }
    _sigmaPrime(result: _Word64, x: _Word64, buffer: _Word64): void {
        result.assign(x);
        result.rotateRight(14);
        buffer.assign(x);
        buffer.rotateRight(18);
        result.xor(buffer);
        buffer.assign(x);
        buffer.rotateRight(41);
        result.xor(buffer);
    }
    _littleSigma(result: _Word64, x: _Word64, buffer: _Word64): void {
        result.assign(x);
        result.rotateRight(1);
        buffer.assign(x);
        buffer.rotateRight(8);
        result.xor(buffer);
        buffer.assign(x);
        buffer.shiftRight(7);
        result.xor(buffer);
    }
    _littleSigmaPrime(result: _Word64, x: _Word64, buffer: _Word64): void {
        result.assign(x);
        result.rotateRight(19);
        buffer.assign(x);
        buffer.rotateRight(61);
        result.xor(buffer);
        buffer.assign(x);
        buffer.shiftRight(6);
        result.xor(buffer);
    }
    _hash(data: Uint8Array, offset: number, length: number, isMode384: boolean = false): Uint8Array {
        let h0: _Word64;
        let h1: _Word64;
        let h2: _Word64;
        let h3: _Word64;
        let h4: _Word64;
        let h5: _Word64;
        let h6: _Word64;
        let h7: _Word64;
        if (isMode384) {
            h0 = new _Word64(0xcbbb9d5d, 0xc1059ed8);
            h1 = new _Word64(0x629a292a, 0x367cd507);
            h2 = new _Word64(0x9159015a, 0x3070dd17);
            h3 = new _Word64(0x152fecd8, 0xf70e5939);
            h4 = new _Word64(0x67332667, 0xffc00b31);
            h5 = new _Word64(0x8eb44a87, 0x68581511);
            h6 = new _Word64(0xdb0c2e0d, 0x64f98fa7);
            h7 = new _Word64(0x47b5481d, 0xbefa4fa4);
        } else {
            h0 = new _Word64(0x6a09e667, 0xf3bcc908);
            h1 = new _Word64(0xbb67ae85, 0x84caa73b);
            h2 = new _Word64(0x3c6ef372, 0xfe94f82b);
            h3 = new _Word64(0xa54ff53a, 0x5f1d36f1);
            h4 = new _Word64(0x510e527f, 0xade682d1);
            h5 = new _Word64(0x9b05688c, 0x2b3e6c1f);
            h6 = new _Word64(0x1f83d9ab, 0xfb41bd6b);
            h7 = new _Word64(0x5be0cd19, 0x137e2179);
        }
        const paddedLength: number = Math.ceil((length + 17) / 128) * 128;
        const padded: Uint8Array = new Uint8Array(paddedLength);
        let i: number;
        for (i = 0; i < length; ++i) {
            padded[<number>i] = data[offset++];
        }
        padded[i++] = 0x80;
        const n: number = paddedLength - 16;
        while (i < n) {
            padded[i++] = 0;
        }
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = 0;
        padded[i++] = (length >>> 29) & 0xff;
        padded[i++] = (length >> 21) & 0xff;
        padded[i++] = (length >> 13) & 0xff;
        padded[i++] = (length >> 5) & 0xff;
        padded[i++] = (length << 3) & 0xff;
        const w: Array<_Word64> = new Array<_Word64>(80);
        for (i = 0; i < 80; i++) {
            w[<number>i] = new _Word64(0, 0);
        }
        let a: _Word64 = new _Word64(0, 0);
        let b: _Word64 = new _Word64(0, 0);
        let c: _Word64 = new _Word64(0, 0);
        let d: _Word64 = new _Word64(0, 0);
        let e: _Word64 = new _Word64(0, 0);
        let f: _Word64 = new _Word64(0, 0);
        let g: _Word64 = new _Word64(0, 0);
        let h: _Word64 = new _Word64(0, 0);
        const t1: _Word64 = new _Word64(0, 0);
        const t2: _Word64 = new _Word64(0, 0);
        const buffer1: _Word64 = new _Word64(0, 0);
        const buffer2: _Word64 = new _Word64(0, 0);
        let buffer3: _Word64;
        for (i = 0; i < paddedLength;) {
            let j: number;
            for (j = 0; j < 16; ++j) {
                w[<number>j].high =
                    (padded[<number>i] << 24) |
                    (padded[i + 1] << 16) |
                    (padded[i + 2] << 8) |
                    padded[i + 3];
                w[<number>j].low =
                    (padded[i + 4] << 24) |
                    (padded[i + 5] << 16) |
                    (padded[i + 6] << 8) |
                    padded[i + 7];
                i += 8;
            }
            for (j = 16; j < 80; ++j) {
                buffer3 = w[<number>j];
                this._littleSigmaPrime(buffer3, w[j - 2], buffer2);
                buffer3.add(w[j - 7]);
                this._littleSigma(buffer1, w[j - 15], buffer2);
                buffer3.add(buffer1);
                buffer3.add(w[j - 16]);
            }
            a.assign(h0);
            b.assign(h1);
            c.assign(h2);
            d.assign(h3);
            e.assign(h4);
            f.assign(h5);
            g.assign(h6);
            h.assign(h7);
            for (j = 0; j < 80; ++j) {
                t1.assign(h);
                this._sigmaPrime(buffer1, e, buffer2);
                t1.add(buffer1);
                buffer1.assign(e);
                buffer1.and(f);
                buffer2.assign(e);
                buffer2.not();
                buffer2.and(g);
                buffer1.xor(buffer2);
                t1.add(buffer1);
                t1.add(this._k[<number>j]);
                t1.add(w[<number>j]);
                this._sigma(t2, a, buffer2);
                buffer1.assign(a);
                buffer1.and(b);
                buffer2.assign(a);
                buffer2.and(c);
                buffer1.xor(buffer2);
                buffer2.assign(b);
                buffer2.and(c);
                buffer1.xor(buffer2);
                t2.add(buffer1);
                buffer3 = h;
                h = g;
                g = f;
                f = e;
                d.add(t1);
                e = d;
                d = c;
                c = b;
                b = a;
                buffer3.assign(t1);
                buffer3.add(t2);
                a = buffer3;
            }
            h0.add(a);
            h1.add(b);
            h2.add(c);
            h3.add(d);
            h4.add(e);
            h5.add(f);
            h6.add(g);
            h7.add(h);
        }
        let result: Uint8Array;
        if (!isMode384) {
            result = new Uint8Array(64);
            h0.copyTo(result, 0);
            h1.copyTo(result, 8);
            h2.copyTo(result, 16);
            h3.copyTo(result, 24);
            h4.copyTo(result, 32);
            h5.copyTo(result, 40);
            h6.copyTo(result, 48);
            h7.copyTo(result, 56);
        } else {
            result = new Uint8Array(48);
            h0.copyTo(result, 0);
            h1.copyTo(result, 8);
            h2.copyTo(result, 16);
            h3.copyTo(result, 24);
            h4.copyTo(result, 32);
            h5.copyTo(result, 40);
        }
        return result;
    }
}
export class _Sha384 {
    _startChunkedConversion(outputSink: _PdfNativeAccumulatorSink): _PdfNativeHashInput {
        return new _PdfNativeHashInput(this, outputSink);
    }
    _hash(data: Uint8Array, offset: number, length: number): Uint8Array {
        return new _Sha512()._hash(data, offset, length, true);
    }
}
