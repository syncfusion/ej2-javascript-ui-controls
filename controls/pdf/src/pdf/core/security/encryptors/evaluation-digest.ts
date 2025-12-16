import { _PdfNativeAccumulatorSink, _PdfNativeHashInput } from '../digital-signature/signature/pdf-accumulator';
export class _RaceEvaluationMessageDigest {
    _startChunkedConversion(outputSink: _PdfNativeAccumulatorSink): _PdfNativeHashInput {
        return new _PdfNativeHashInput(this, outputSink);
    }
    private _block: Uint8Array = new Uint8Array(64);
    private _a: number = 0x67452301;
    private _b: number = 0xefcdab89;
    private _c: number = 0x98badcfe;
    private _d: number = 0x10325476;
    private _e: number = 0xc3d2e1f0;
    _rotateLeft(x: number, n: number): number {
        return (x << n) | (x >>> (32 - n));
    }
    _fn1(
        a: number, b: number, c: number, d: number, e: number, m: number, k: number, s: number
    ): number {
        return (this._rotateLeft((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0;
    }
    _fn2(
        a: number, b: number, c: number, d: number, e: number, m: number, k: number, s: number
    ): number {
        return (this._rotateLeft((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0;
    }
    _fn3(
        a: number, b: number, c: number, d: number, e: number, m: number, k: number, s: number
    ): number {
        return (this._rotateLeft((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0;
    }
    _fn4(
        a: number, b: number, c: number, d: number, e: number, m: number, k: number, s: number
    ): number {
        return (this._rotateLeft((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0;
    }
    _fn5(
        a: number, b: number, c: number, d: number, e: number, m: number, k: number, s: number
    ): number {
        return (this._rotateLeft((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0;
    }
    _readInt32LE(buffer: Uint8Array, offset: number): number {
        offset >>>= 0;
        return (buffer[<number>offset])
            | (buffer[offset + 1] << 8)
            | (buffer[offset + 2] << 16)
            | (buffer[offset + 3] << 24);
    }
    _writeUInt32LE(buffer: Uint8Array, value: number, offset: number): number {
        value = +value;
        offset >>>= 0;
        buffer[offset + 3] = (value >>> 24);
        buffer[offset + 2] = (value >>> 16);
        buffer[offset + 1] = (value >>> 8);
        buffer[<number>offset] = (value & 0xff);
        return offset + 4;
    }
    _writeInt32LE(buffer: Uint8Array, value: number, offset: number): number {
        value = +value;
        offset >>>= 0;
        buffer[<number>offset] = (value & 0xff);
        buffer[offset + 1] = (value >>> 8);
        buffer[offset + 2] = (value >>> 16);
        buffer[offset + 3] = (value >>> 24);
        return offset + 4;
    }
    private _update(): void {
        const _zl: Uint8Array = new Uint8Array([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
            3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
            1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
            4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
        ]);
        const _zr: Uint8Array = new Uint8Array([
            5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
            6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
            15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
            8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
            12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
        ]);
        const _sl: Uint8Array = new Uint8Array([
            11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
            7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
            11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
            11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
            9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
        ]);
        const _sr: Uint8Array = new Uint8Array([
            8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
            9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
            9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
            15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
            8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
        ]);
        const _hl: Uint32Array = new Uint32Array([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
        const _hr: Uint32Array = new Uint32Array([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);
        const words: any[] = new Array(16);// eslint-disable-line
        for (let j: number = 0; j < 16; ++j) {
            words[<number>j] = this._readInt32LE(this._block, j * 4);
        }
        let al: number = this._a | 0;
        let bl: number = this._b | 0;
        let cl: number = this._c | 0;
        let dl: number = this._d | 0;
        let el: number = this._e | 0;
        let ar: number = this._a | 0;
        let br: number = this._b | 0;
        let cr: number = this._c | 0;
        let dr: number = this._d | 0;
        let er: number = this._e | 0;
        for (let i: number = 0; i < 80; i += 1) {
            let tl: number;
            let tr: number;
            if (i < 16) {
                tl = this._fn1(al, bl, cl, dl, el, words[_zl[<number>i]], _hl[0], _sl[<number>i]);
                tr = this._fn5(ar, br, cr, dr, er, words[_zr[<number>i]], _hr[0], _sr[<number>i]);
            } else if (i < 32) {
                tl = this._fn2(al, bl, cl, dl, el, words[_zl[<number>i]], _hl[1], _sl[<number>i]);
                tr = this._fn4(ar, br, cr, dr, er, words[_zr[<number>i]], _hr[1], _sr[<number>i]);
            } else if (i < 48) {
                tl = this._fn3(al, bl, cl, dl, el, words[_zl[<number>i]], _hl[2], _sl[<number>i]);
                tr = this._fn3(ar, br, cr, dr, er, words[_zr[<number>i]], _hr[2], _sr[<number>i]);
            } else if (i < 64) {
                tl = this._fn4(al, bl, cl, dl, el, words[_zl[<number>i]], _hl[3], _sl[<number>i]);
                tr = this._fn2(ar, br, cr, dr, er, words[_zr[<number>i]], _hr[3], _sr[<number>i]);
            } else {
                tl = this._fn5(al, bl, cl, dl, el, words[_zl[<number>i]], _hl[4], _sl[<number>i]);
                tr = this._fn1(ar, br, cr, dr, er, words[_zr[<number>i]], _hr[4], _sr[<number>i]);
            }
            al = el;
            el = dl;
            dl = this._rotateLeft(cl, 10);
            cl = bl;
            bl = tl;
            ar = er;
            er = dr;
            dr = this._rotateLeft(cr, 10);
            cr = br;
            br = tr;
        }
        const t: number = (this._b + cl + dr) | 0;
        this._b = (this._c + dl + er) | 0;
        this._c = (this._d + el + ar) | 0;
        this._d = (this._e + al + br) | 0;
        this._e = (this._a + bl + cr) | 0;
        this._a = t;
    }
    _hash(data: Uint8Array, offset: number, length: number): Uint8Array {
        const _blockSize: number = 64;
        let _blockOffset: number = 0;
        const _length: number[] = [0, 0, 0, 0];
        const block: Uint8Array = this._block;
        while (_blockOffset + length - offset >= _blockSize) {
            for (let i: number = _blockOffset; i < _blockSize;) {
                block[i++] = data[offset++];
            }
            this._update();
            _blockOffset = 0;
        }
        while (offset < length) {
            block[_blockOffset++] = data[offset++];
        }
        for (let j: number = 0, carry: number = length * 8; carry > 0; ++j) {
            _length[<number>j] += carry;
            carry = (_length[<number>j] / 0x0100000000) | 0;
            if (carry > 0) {
                _length[<number>j] -= 0x0100000000 * carry;
            }
        }
        this._block[_blockOffset++] = 0x80;
        if (_blockOffset > 56) {
            this._block.fill(0, _blockOffset, 64);
            this._update();
            _blockOffset = 0;
        }
        this._block.fill(0, _blockOffset, 56);
        this._writeUInt32LE(this._block, _length[0], 56);
        this._writeUInt32LE(this._block, _length[1], 60);
        this._update();
        const buffer: Uint8Array = new Uint8Array(20);
        this._writeInt32LE(buffer, this._a, 0);
        this._writeInt32LE(buffer, this._b, 4);
        this._writeInt32LE(buffer, this._c, 8);
        this._writeInt32LE(buffer, this._d, 12);
        this._writeInt32LE(buffer, this._e, 16);
        this._block.fill(0);
        _blockOffset = 0;
        for (let i: number = 0; i < 4; ++i) {
            _length[<number>i] = 0;
        }
        return buffer;
    }
}
