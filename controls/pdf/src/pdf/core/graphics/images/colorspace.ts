import { _PdfBaseStream } from '../../base-stream';
import { FormatError, _isLittleEndian, _mathClamp, _unreachable } from '../../utils';
export class _PdfColorPalette {
    name: string;
    numComps: number;
    base: any; // eslint-disable-line
    constructor(name: string, numComps: number) {
        this.name = name;
        this.numComps = numComps;
    }
    _resizeRgbImage(src: Uint8Array, dest: Uint8Array, w1: number, h1: number, w2: number, h2: number, alpha01: number): void {
        const components: number = 3;
        alpha01 = alpha01 !== 1 ? 0 : alpha01;
        const xRatio: number = w1 / w2;
        const yRatio: number = h1 / h2;
        let newIndex: number = 0;
        let oldIndex: number;
        const xScaled: Uint16Array = new Uint16Array(w2);
        const w1Scanline: number = w1 * components;
        for (let i: number = 0; i < w2; i++) {
            xScaled[<number>i] = Math.floor(i * xRatio) * components;
        }
        for (let i: number = 0; i < h2; i++) {
            const py: number = Math.floor(i * yRatio) * w1Scanline;
            for (let j: number = 0; j < w2; j++) {
                oldIndex = py + xScaled[<number>j];
                dest[newIndex++] = src[oldIndex++];
                dest[newIndex++] = src[oldIndex++];
                dest[newIndex++] = src[oldIndex++];
                newIndex += alpha01;
            }
        }
    }
    _isDefaultDecode(decode: any, numComps: any): boolean { // eslint-disable-line
        if (!Array.isArray(decode)) {
            return true;
        }
        if (numComps * 2 !== decode.length) {
            return true;
        }
        for (let i: number = 0, ii: number = decode.length; i < ii; i += 2) {
            if (decode[<number>i] !== 0 || decode[i + 1] !== 1) {
                return false;
            }
        }
        return true;
    }
    _getRgb(src: Uint8Array, srcOffset: number): Uint8ClampedArray {
        const rgb: Uint8ClampedArray = new Uint8ClampedArray(3);
        this._getRgbItem(src, srcOffset, rgb, 0);
        return rgb;
    }
    _getRgbItem(src: any, srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        _unreachable('Should not call _PdfColorPalette._getRgbItem');
    }
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: any, destOffset: number, bits: number, // eslint-disable-line
                  alpha01: number): void { // eslint-disable-line
        _unreachable('Should not call _PdfColorPalette._getRgbBuffer');
    }
    _getOutputLength(inputLength: number, alpha01: number): void { // eslint-disable-line
        _unreachable('Should not call _PdfColorPalette._getOutputLength');
    }
    _isPass(bits: any): boolean { // eslint-disable-line
        return false;
    }
    _fillRgb(dest: any, originalWidth: number, originalHeight: number, width: number, height: number, // eslint-disable-line
             actualHeight: number, bpc: number, comps: Uint8Array | Uint16Array, alpha01: number): void {
        const count: number = originalWidth * originalHeight;
        const numComponentColors: number = 1 << bpc;
        const needsResizing: boolean = originalHeight !== height || originalWidth !== width;
        let rgbBuf: any = null;  // eslint-disable-line
        if (this._isPass(bpc)) {
            rgbBuf = comps as Uint8Array;
        } else if (this.numComps === 1 && count > numComponentColors &&  this.name !== 'DeviceGray' && this.name !== 'DeviceRGB') {
            const allColors: Uint8Array | Uint16Array =
                bpc <= 8 ? new Uint8Array(numComponentColors) : new Uint16Array(numComponentColors);
            for (let i: number = 0; i < numComponentColors; i++) {
                allColors[<number>i] = i;
            }
            const colorMap: Uint8ClampedArray = new Uint8ClampedArray(numComponentColors * 3);
            this._getRgbBuffer(allColors, 0, numComponentColors, colorMap, 0, bpc, 0);
            if (!needsResizing) {
                let destPos: number = 0;
                for (let i: number = 0; i < count; ++i) {
                    const key: number = comps[<number>i] * 3;
                    dest[destPos++] = colorMap[<number>key];
                    dest[destPos++] = colorMap[key + 1];
                    dest[destPos++] = colorMap[key + 2];
                    destPos += alpha01;
                }
            } else {
                rgbBuf = new Uint8Array(count * 3);
                let rgbPos: number = 0;
                for (let i: number = 0; i < count; ++i) {
                    const key: number = comps[<number>i] * 3;
                    rgbBuf[rgbPos++] = colorMap[<number>key];
                    rgbBuf[rgbPos++] = colorMap[key + 1];
                    rgbBuf[rgbPos++] = colorMap[key + 2];
                }
            }
        } else if (!needsResizing) {
            this._getRgbBuffer(comps, 0, width * actualHeight, dest, 0, bpc, alpha01);
        } else {
            rgbBuf = new Uint8ClampedArray(count * 3);
            this._getRgbBuffer(comps, 0, count, rgbBuf, 0, bpc, 0);
        }
        if (rgbBuf) {
            if (needsResizing) {
                this._resizeRgbImage(rgbBuf, dest, originalWidth, originalHeight, width, height, alpha01);
            } else {
                let destPos: number = 0;
                let rgbPos: number = 0;
                for (let i: number = 0, ii: number = width * actualHeight; i < ii; i++) {
                    dest[destPos++] = rgbBuf[rgbPos++];
                    dest[destPos++] = rgbBuf[rgbPos++];
                    dest[destPos++] = rgbBuf[rgbPos++];
                    destPos += alpha01;
                }
            }
        }
    }
}
export class _PdfAlternateCS extends _PdfColorPalette {
    base: _PdfColorPalette;
    private tintFn: any; // eslint-disable-line
    private tmpBuf: Float32Array;
    constructor(numComps: number, base: _PdfColorPalette, tintFn: Function) {
        super('Alternate', numComps);
        this.base = base;
        this.tintFn = tintFn;
        this.tmpBuf = new Float32Array(base.numComps);
    }
    _getRgbItem(src: Uint8Array, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void {
        const tmpBuf: any = this.tmpBuf; // eslint-disable-line
        this.tintFn(src, srcOffset, tmpBuf, 0);
        this.base._getRgbItem(tmpBuf, 0, dest, destOffset);
    }
    _getRgbBuffer(src: Uint8Array, srcOffset: number, count: number, dest: Uint8Array, destOffset: number,
                  bits: number, alpha01: number): void {
        const tintFn: any = this.tintFn; // eslint-disable-line
        const base: any = this.base; // eslint-disable-line
        const scale: number = 1 / ((1 << bits) - 1);
        const baseNumComps: any = base.numComps; // eslint-disable-line
        const usesZeroToOneRange: any = base.usesZeroToOneRange; // eslint-disable-line
        const isPass: boolean =
            (base.isPass(8) || !usesZeroToOneRange) && alpha01 === 0;
        let pos: number = isPass ? destOffset : 0;
        const baseBuf: any = // eslint-disable-line
            isPass ? dest : new Uint8ClampedArray(baseNumComps * count); // eslint-disable-line;
        const numComps: number = this.numComps;
        const scaled: Float32Array = new Float32Array(numComps);
        const tinted: Float32Array = new Float32Array(baseNumComps);
        for (let i: number = 0; i < count; i++) {
            for (let j: number = 0; j < numComps; j++) {
                scaled[<number>j] = src[srcOffset++] * scale;
            }
            tintFn(scaled, 0, tinted, 0);
            if (usesZeroToOneRange) {
                for (let j: number = 0; j < baseNumComps; j++) {
                    baseBuf[pos++] = tinted[<number>j] * 255;
                }
            } else {
                base._getRgbItem(tinted, 0, baseBuf, pos);
                pos += baseNumComps;
            }
        }
        if (!isPass) {
            base._getRgbBuffer(baseBuf, 0, count, dest, destOffset, 8, alpha01);
        }
    }
}
export class _PdfPatternCS extends _PdfColorPalette {
    base: any; // eslint-disable-line 
    constructor(baseCS: any) { // eslint-disable-line
        super('Pattern', null);
        this.base = baseCS;
    }
    _isDefaultDecode(decodeMap: any, bpc: any): boolean { // eslint-disable-line
        throw new Error('PatternCS._isDefaultDecode should not be called.');
    }
}
export class _PdfIndexedCS extends _PdfColorPalette {
    base: any; // eslint-disable-line
    private highVal: number;
    private lookup: Uint8Array;
    constructor(base: any, highVal: number, lookup: any) { // eslint-disable-line
        super('Indexed', 1);
        this.base = base;
        this.highVal = highVal;
        const length: number = base.numComps * (highVal + 1);
        this.lookup = new Uint8Array(length);
        if (lookup instanceof _PdfBaseStream) {
            const bytes: Uint8Array = lookup.getBytes(length);
            this.lookup.set(bytes);
        } else if (typeof lookup === 'string') {
            for (let i: number = 0; i < length; ++i) {
                this.lookup[<number>i] = lookup.charCodeAt(i) & 0xff;
            }
        } else {
            throw new FormatError(`IndexedCS - unrecognized lookup table: ${lookup}`);
        }
    }
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        const { base, highVal, lookup } = this;
        const start: number = _mathClamp(Math.round(src[<number>srcOffset]), 0, highVal) * base.numComps;
        base._getRgbBuffer(lookup, start, 1, dest, destOffset, 8, 0);
    }
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const { base, highVal, lookup } = this;
        const { numComps } = base;
        const outputDelta: any = base._getOutputLength(numComps, alpha01); // eslint-disable-line
        for (let i: number = 0; i < count; ++i) {
            const lookupPos: number = _mathClamp(Math.round(src[srcOffset++]), 0, highVal) * numComps;
            base._getRgbBuffer(lookup, lookupPos, 1, dest, destOffset, 8, alpha01);
            destOffset += outputDelta;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return this.base._getOutputLength(inputLength * this.base.numComps, alpha01);
    }
    _isDefaultDecode(decodeMap: any[], bpc: number): boolean { // eslint-disable-line
        if (!Array.isArray(decodeMap)) {
            return true;
        }
        if (decodeMap.length !== 2) {
            return true;
        }
        if (!Number.isInteger(bpc) || bpc < 1) {
            return true;
        }
        return decodeMap[0] === 0 && decodeMap[1] === (1 << bpc) - 1;
    }
}
export class _PdfDeviceGrayCS extends _PdfColorPalette {
    constructor() {
        super('DeviceGray', 1);
    }
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        const c: number = src[<number>srcOffset] * 255;
        dest[<number>destOffset] = dest[destOffset + 1] = dest[destOffset + 2] = c;
    }
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const scale: number = 255 / ((1 << bits) - 1);
        let j: number = srcOffset;
        let q: number = destOffset;
        for (let i: number = 0; i < count; ++i) {
            const c: number = scale * src[j++];
            dest[q++] = c;
            dest[q++] = c;
            dest[q++] = c;
            q += alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return inputLength * (3 + alpha01);
    }
}
export class _PdfDeviceRgbCS extends _PdfColorPalette {
    constructor() {
        super('DeviceRGB', 3);
    }
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        dest[<number>destOffset] = src[<number>srcOffset] * 255;
        dest[destOffset + 1] = src[srcOffset + 1] * 255;
        dest[destOffset + 2] = src[srcOffset + 2] * 255;
    }
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        if (bits === 8 && alpha01 === 0) {
            dest.set(src.subarray(srcOffset, srcOffset + count * 3), destOffset);
            return;
        }
        const scale: number = 255 / ((1 << bits) - 1);
        let j: number = srcOffset;
        let q: number = destOffset;
        for (let i: number = 0; i < count; ++i) {
            dest[q++] = scale * src[j++];
            dest[q++] = scale * src[j++];
            dest[q++] = scale * src[j++];
            q += alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
    _isPass(bits: number): boolean {
        return bits === 8;
    }
}
export class _PdfDeviceRgbaCS extends _PdfColorPalette {
    constructor() {
        super('DeviceRGBA', 4);
    }
    _resizeRgbaImage(src: Uint8Array, dest: Uint8Array, w1: number, h1: number, w2: number, h2: number, alpha01: number): void {
        const xRatio: number = w1 / w2;
        const yRatio: number = h1 / h2;
        let newIndex: number = 0;
        const xScaled: Uint16Array = new Uint16Array(w2);
        if (alpha01 === 1) {
            for (let i: number = 0; i < w2; i++) {
                xScaled[<number>i] = Math.floor(i * xRatio);
            }
            const src32: Uint32Array = new Uint32Array(src.buffer);
            const dest32: Uint32Array = new Uint32Array(dest.buffer);
            const rgbMask: any = _isLittleEndian() ? 0x00ffffff : 0xffffff00; // eslint-disable-line
            for (let i: number = 0; i < h2; i++) {
                const buf: any = src32.subarray(Math.floor(i * yRatio) * w1); // eslint-disable-line
                for (let j: number = 0; j < w2; j++) {
                    dest32[newIndex++] |= buf[xScaled[<number>j]] & rgbMask;
                }
            }
        } else {
            const components: number = 4;
            const w1Scanline: number = w1 * components;
            for (let i: number = 0; i < w2; i++) {
                xScaled[<number>i] = Math.floor(i * xRatio) * components;
            }
            for (let i: number = 0; i < h2; i++) {
                const buf: any = src.subarray(Math.floor(i * yRatio) * w1Scanline); // eslint-disable-line
                for (let j: number = 0; j < w2; j++) {
                    const oldIndex: number = xScaled[<number>j];
                    dest[newIndex++] = buf[<number>oldIndex];
                    dest[newIndex++] = buf[oldIndex + 1];
                    dest[newIndex++] = buf[oldIndex + 2];
                }
            }
        }
    }
    _copyRgbaImage(src: Uint8Array, dest: Uint8Array, alpha01: number): void {
        if (alpha01 === 1) {
            const src32: Uint32Array = new Uint32Array(src.buffer);
            const dest32: Uint32Array = new Uint32Array(dest.buffer);
            const rgbMask: any = _isLittleEndian() ? 0x00ffffff : 0xffffff00; // eslint-disable-line
            for (let i: number = 0, ii: number = src32.length; i < ii; i++) {
                dest32[<number>i] |= src32[<number>i] & rgbMask;
            }
        } else {
            let j: number = 0;
            for (let i: number = 0, ii: number = src.length; i < ii; i += 4) {
                dest[j++] = src[<number>i];
                dest[j++] = src[i + 1];
                dest[j++] = src[i + 2];
            }
        }
    }
    _getOutputLength(inputLength: number, _alpha01: number): number { // eslint-disable-line
        return inputLength * 4;
    }
    _isPass(bits: number): boolean {
        return bits === 8;
    }
    _fillRgb(dest: any, originalWidth: number, originalHeight: number, width: number, height: number, // eslint-disable-line
            actualHeight: number, bpc: number, comps: any, alpha01: number): void { // eslint-disable-line
        if (originalHeight !== height || originalWidth !== width) {
            this._resizeRgbaImage(comps, dest, originalWidth, originalHeight, width, height, alpha01);
        } else {
            this._copyRgbaImage(comps, dest, alpha01);
        }
    }
}
export class _PdfDeviceCmykCS extends _PdfColorPalette {
    constructor() {
        super('DeviceCMYK', 4);
    }
    _toRgb(src: any, srcOffset: number, srcScale: number, dest: any, destOffset: number): void { // eslint-disable-line
        const c: number = src[<number>srcOffset] * srcScale;
        const m: number = src[srcOffset + 1] * srcScale;
        const y: number = src[srcOffset + 2] * srcScale;
        const k: number = src[srcOffset + 3] * srcScale;
        dest[<number>destOffset] = 255 + c * (-4.387332384609988 * c + 54.48615194189176 * m + 18.82290502165302 *
            y + 212.25662451639585 * k - 285.2331026137004) +
            m * (1.7149763477362134 * m - 5.6096736904047315 * y - 17.873870861415444 * k - 5.497006427196366) +
            y * (-2.5217340131683033 * y - 21.248923337353073 * k + 17.5119270841813) +
            k * (-21.86122147463605 * k - 189.48180835922747);
        dest[destOffset + 1] = 255 + c * (8.841041422036149 * c + 60.118027045597366 * m + 6.871425592049007 * y + 31.159100130055922 *
            k - 79.2970844816548) +
            m * (-15.310361306967817 * m + 17.575251261109482 * y + 131.35250912493976 * k - 190.9453302588951) +
            y * (4.444339102852739 * y + 9.8632861493405 * k - 24.86741582555878) +
            k * (-20.737325471181034 * k - 187.80453709719578);
        dest[destOffset + 2] = 255 + c * (0.8842522430003296 * c + 8.078677503112928 * m + 30.89978309703729 * y - 0.23883238689178934 *
            k - 14.183576799673286) +
            m * (10.49593273432072 * m + 63.02378494754052 * y + 50.606957656360734 * k - 112.23884253719248) +
            y * (0.03296041114873217 * y + 115.60384449646641 * k - 193.58209356861505) +
            k * (-22.33816807309886 * k - 180.12613974708367);
    }
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, 1, dest, destOffset);
    }
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; i++) {
            this._toRgb(src, srcOffset, scale, dest, destOffset);
            srcOffset += 4;
            destOffset += 3 + alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength / 4) * (3 + alpha01)) | 0;
    }
}
export class _PdfLabCS extends _PdfColorPalette {
    private _xw: number;
    private _yw: number;
    private _zw: number;
    private _xb: number;
    private _yb: number;
    private _zb: number;
    private _amin: number;
    private _amax: number;
    private _bmin: number;
    private _bmax: number;
    constructor(whitePoint?: number[], blackPoint?: number[], range?: number[]) {
        super('Lab', 3);
        if (!whitePoint) {
            throw new FormatError('WhitePoint missing - required for color space Lab');
        }
        [this._xw, this._yw, this._zw] = whitePoint;
        [this._amin, this._amax, this._bmin, this._bmax] = range || [-100, 100, -100, 100];
        [this._xb, this._yb, this._zb] = blackPoint || [0, 0, 0];
        if (this._xw < 0 || this._zw < 0 || this._yw !== 1) {
            throw new FormatError('Invalid WhitePoint components, no fallback available');
        }
        if (this._xb < 0 || this._yb < 0 || this._zb < 0) {
            this._xb = this._yb = this._zb = 0;
        }
        if (this._amin > this._amax || this._bmin > this._bmax) {
            this._amin = -100;
            this._amax = 100;
            this._bmin = -100;
            this._bmax = 100;
        }
    }
    private _fng(x: number): number {
        return x >= 6 / 29 ? x ** 3 : (108 / 841) * (x - 4 / 29);
    }
    private _decode(value: number, high1: number, low2: number, high2: number): number {
        return low2 + (value * (high2 - low2)) / high1;
    }
    private _toRgb(src: Uint8Array, srcOffset: number, maxVal: boolean | number, dest: Uint8Array, destOffset: number): void {
        let ls: number = src[<number>srcOffset];
        let as: number = src[srcOffset + 1];
        let bs: number = src[srcOffset + 2];
        if (maxVal !== false) {
            ls = this._decode(ls, maxVal as number, 0, 100);
            as = this._decode(as, maxVal as number, this._amin, this._amax);
            bs = this._decode(bs, maxVal as number, this._bmin, this._bmax);
        }
        if (as > this._amax) {
            as = this._amax;
        } else if (as < this._amin) {
            as = this._amin;
        }
        if (bs > this._bmax) {
            bs = this._bmax;
        } else if (bs < this._bmin) {
            bs = this._bmin;
        }
        const m: number = (ls + 16) / 116;
        const l: number = m + as / 500;
        const n: number = m - bs / 200;
        const x: number = this._xw * this._fng(l);
        const y: number = this._yw * this._fng(m);
        const z: number = this._zw * this._fng(n);
        let r: number;
        let g: number;
        let b: number;
        if (this._zw < 1) {
            r = x * 3.1339 + y * -1.617 + z * -0.4906;
            g = x * -0.9785 + y * 1.916 + z * 0.0333;
            b = x * 0.072 + y * -0.229 + z * 1.4057;
        } else {
            r = x * 3.2406 + y * -1.5372 + z * -0.4986;
            g = x * -0.9689 + y * 1.8758 + z * 0.0415;
            b = x * 0.0557 + y * -0.204 + z * 1.057;
        }
        dest[<number>destOffset] = Math.sqrt(r) * 255;
        dest[destOffset + 1] = Math.sqrt(g) * 255;
        dest[destOffset + 2] = Math.sqrt(b) * 255;
    }
    _getRgbItem(src: Uint8Array, srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, false, dest, destOffset);
    }
    _getRgbBuffer(src: Uint8Array, srcOffset: number, count: number, dest: any, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const maxVal: number = (1 << bits) - 1;
        for (let i: number = 0; i < count; i++) {
            this._toRgb(src, srcOffset, maxVal, dest, destOffset);
            srcOffset += 3;
            destOffset += 3 + alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
    _isDefaultDecode(decodeMap: any, bpc: number): boolean { // eslint-disable-line
        return true;
    }
    get usesZeroToOneRange(): boolean {
        return false;
    }
}
export class _PdfCalGrayCS extends _PdfColorPalette {
    _xw: number;
    _yw: number;
    _zw: number;
    _xb: number;
    _yb: number;
    _zb: number;
    _g: number;
    constructor(whitePoint: number[], blackPoint?: number[], gamma?: number) {
        super('CalGray', 1);
        if (!whitePoint) {
            throw new FormatError(
                'WhitePoint missing - required for color space CalGray'
            );
        }
        [this._xw, this._yw, this._zw] = whitePoint;
        [this._xb, this._yb, this._zb] = blackPoint || [0, 0, 0];
        this._g = gamma || 1;
        if (this._xw < 0 || this._zw < 0 || this._yw !== 1) {
            throw new FormatError(
                `Invalid WhitePoint components for ${this.name}, no fallback available`
            );
        }
        if (this._xb < 0 || this._yb < 0 || this._zb < 0) {
            this._xb = this._yb = this._zb = 0;
        }
        if (this._g < 1) {
            this._g = 1;
        }
    }
    _toRgb(src: number[], srcOffset: number, dest: number[], destOffset: number, scale: number): void {
        const a: number = src[<number>srcOffset] * scale;
        const ag: number = a ** this._g;
        const l: number = this._yw * ag;
        const val: number = Math.max(295.8 * l ** 0.3333333333333333 - 40.8, 0);
        dest[<number>destOffset] = val;
        dest[destOffset + 1] = val;
        dest[destOffset + 2] = val;
    }
    _getRgbItem(src: number[], srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, dest, destOffset, 1);
    }
    _getRgbBuffer(src: number[], srcOffset: number, count: number, dest: any, destOffset: number, bits: number, alpha01: number): void { // eslint-disable-line
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; ++i) {
            this._toRgb(src, srcOffset, dest, destOffset, scale);
            srcOffset += 1;
            destOffset += 3 + alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return inputLength * (3 + alpha01);
    }
}
export class _PdfColorRgbConverter extends _PdfColorPalette {
    scaleMatrix: Float32Array = new Float32Array([
        0.8951, 0.2664, -0.1614,
        -0.7502, 1.7135, 0.0367,
        0.0389, -0.0685, 1.0296
    ]);
    inverseMatrix: Float32Array = new Float32Array([
        0.9869929, -0.1470543, 0.1599627,
        0.4323053, 0.5183603, 0.0492912,
        -0.0085287, 0.0400428, 0.9684867
    ]);
    rgbMatrix: Float32Array = new Float32Array([
        3.2404542, -1.5371385, -0.4985314,
        -0.9692660, 1.8760108, 0.0415560,
        0.0556434, -0.2040259, 1.0572252
    ]);
    whitePointMatrix: Float32Array = new Float32Array([1, 1, 1]);
    tempNormalizeMatrix: Float32Array = new Float32Array(3);
    tempConvertMatrix1: Float32Array = new Float32Array(3);
    tempConvertMatrix2: Float32Array = new Float32Array(3);
    decodeConstant: number = ((8 + 16) / 116) ** 3 / 8.0;
    _whitePoint: Float32Array;
    _blackPoint: Float32Array;
    gr: number;
    gg: number;
    gb: number;
    mxa: number;
    mya: number;
    mza: number;
    mxb: number;
    myb: number;
    mzb: number;
    mxc: number;
    myc: number;
    mzc: number;
    constructor(whitePoint: any, blackPoint?: any, gamma?: any, matrix?: any) { // eslint-disable-line
        super('CalRGB', 3);
        if (!whitePoint) {
            throw new FormatError('WhitePoint missing - required for color space CalRGB');
        }
        const [xw, yw, zw] = (this._whitePoint = whitePoint);
        const [xb, yb, zb] = (this._blackPoint = blackPoint || new Float32Array(3));
        [this.gr, this.gg, this.gb] = gamma || new Float32Array([1, 1, 1]);
        [
            this.mxa, this.mya, this.mza,
            this.mxb, this.myb, this.mzb,
            this.mxc, this.myc, this.mzc
        ] = matrix || new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        if (xw < 0 || zw < 0 || yw !== 1) {
            throw new FormatError(`Invalid WhitePoint components for ${this.name}, no fallback available`);
        }
        if (xb < 0 || yb < 0 || zb < 0) {
            this._blackPoint = new Float32Array(3);
        }
        if (this.gr < 0 || this.gg < 0 || this.gb < 0) {
            this.gr = this.gg = this.gb = 1;
        }
    }
    _matrixProduct(a: Float32Array, b: Float32Array, result: Float32Array): void {
        result[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        result[1] = a[3] * b[0] + a[4] * b[1] + a[5] * b[2];
        result[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];
    }
    _toFlat(sourceWhitePoint: Float32Array, lms: Float32Array, result: Float32Array): void {
        result[0] = (lms[0] * 1) / sourceWhitePoint[0];
        result[1] = (lms[1] * 1) / sourceWhitePoint[1];
        result[2] = (lms[2] * 1) / sourceWhitePoint[2];
    }
    _toD65(sourceWhitePoint: Float32Array, lms: Float32Array, result: Float32Array): void {
        const d65X: number = 0.95047;
        const d65Y: number = 1;
        const d65Z: number = 1.08883;
        result[0] = (lms[0] * d65X) / sourceWhitePoint[0];
        result[1] = (lms[1] * d65Y) / sourceWhitePoint[1];
        result[2] = (lms[2] * d65Z) / sourceWhitePoint[2];
    }
    _srgbTransferFunction(color: number): number {
        if (color <= 0.0031308) {
            return _mathClamp(12.92 * color, 0, 1);
        }
        if (color >= 0.99554525) {
            return 1;
        }
        return _mathClamp((1 + 0.055) * color ** (1 / 2.4) - 0.055, 0, 1);
    }
    _decodeL(L: number): number {
        if (L < 0) {
            return -this._decodeL(-L);
        }
        if (L > 8.0) {
            return ((L + 16) / 116) ** 3;
        }
        return L * this.decodeConstant;
    }
    _compensateBlackPoint(sourceBlackPoint: Float32Array, xyzFlat: Float32Array, result: Float32Array): void {
        if (sourceBlackPoint[0] === 0 && sourceBlackPoint[1] === 0 && sourceBlackPoint[2] === 0) {
            result[0] = xyzFlat[0];
            result[1] = xyzFlat[1];
            result[2] = xyzFlat[2];
            return;
        }
        const zeroDecodeL: number = this._decodeL(0);
        const xdST: number = zeroDecodeL;
        const xsRC: number = this._decodeL(sourceBlackPoint[0]);
        const ydST: number = zeroDecodeL;
        const ysRC: number = this._decodeL(sourceBlackPoint[1]);
        const zdST: number = zeroDecodeL;
        const zsRC: number = this._decodeL(sourceBlackPoint[2]);
        const xScale: number = (1 - xdST) / (1 - xsRC);
        const xOffset: number = 1 - xScale;
        const yScale: number = (1 - ydST) / (1 - ysRC);
        const yOffset: number = 1 - yScale;
        const zScale: number = (1 - zdST) / (1 - zsRC);
        const zOffset: number = 1 - zScale;
        result[0] = xyzFlat[0] * xScale + xOffset;
        result[1] = xyzFlat[1] * yScale + yOffset;
        result[2] = xyzFlat[2] * zScale + zOffset;
    }
    _normalizeWhitePointToFlat(sourceWhitePoint: Float32Array, xyzIn: Float32Array, result: Float32Array): void {
        if (sourceWhitePoint[0] === 1 && sourceWhitePoint[2] === 1) {
            result[0] = xyzIn[0];
            result[1] = xyzIn[1];
            result[2] = xyzIn[2];
            return;
        }
        const lms: any = result; // eslint-disable-line
        this._matrixProduct(this.scaleMatrix, xyzIn, lms);
        const lmsFlat: any = this.tempNormalizeMatrix; // eslint-disable-line
        this._toFlat(sourceWhitePoint, lms, lmsFlat);
        this._matrixProduct(this.inverseMatrix, lmsFlat, result);
    }
    _normalizeWhitePointToD65(sourceWhitePoint: Float32Array, xyzIn: Float32Array, result: Float32Array): void {
        const lms: any = result; // eslint-disable-line
        this._matrixProduct(this.scaleMatrix, xyzIn, lms);
        const lmsD65: any = this.tempNormalizeMatrix; // eslint-disable-line
        this._toD65(sourceWhitePoint, lms, lmsD65);
        this._matrixProduct(this.inverseMatrix, lmsD65, result);
    }
    _toRgb(src: number[], srcOffset: number, dest: Uint8ClampedArray, destOffset: number, scale: number): void {
        const a: number = _mathClamp(src[<number>srcOffset] * scale, 0, 1);
        const b: number = _mathClamp(src[srcOffset + 1] * scale, 0, 1);
        const c: number = _mathClamp(src[srcOffset + 2] * scale, 0, 1);
        const agr: number = a === 1 ? 1 : a ** this.gr;
        const bgg: number = b === 1 ? 1 : b ** this.gg;
        const cgb: number = c === 1 ? 1 : c ** this.gb;
        const x: number = this.mxa * agr + this.mxb * bgg + this.mxc * cgb;
        const y: number = this.mya * agr + this.myb * bgg + this.myc * cgb;
        const z: number = this.mza * agr + this.mzb * bgg + this.mzc * cgb;
        const xyz: Float32Array = this.tempConvertMatrix1;
        xyz[0] = x;
        xyz[1] = y;
        xyz[2] = z;
        const xyzFlat: Float32Array = this.tempConvertMatrix2;
        this._normalizeWhitePointToFlat(this._whitePoint, xyz, xyzFlat);
        const xyzBlack: Float32Array = this.tempConvertMatrix1;
        this._compensateBlackPoint(this._blackPoint, xyzFlat, xyzFlat);
        const xyzD65: Float32Array = this.tempConvertMatrix2;
        this._normalizeWhitePointToD65(this.whitePointMatrix, xyzBlack, xyzD65);
        const srgb: any = this.tempConvertMatrix1; // eslint-disable-line
        this._matrixProduct(this.rgbMatrix, xyzD65, srgb);
        dest[<number>destOffset] = this._srgbTransferFunction(srgb[0]) * 255;
        dest[destOffset + 1] = this._srgbTransferFunction(srgb[1]) * 255;
        dest[destOffset + 2] = this._srgbTransferFunction(srgb[2]) * 255;
    }
    _getRgbItem(src: number[], srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void {
        this._toRgb(src, srcOffset, dest, destOffset, 1);
    }
    _getRgbBuffer(src: number[], srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, bits: number,
                  alpha01: number): void {
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; ++i) {
            this._toRgb(src, srcOffset, dest, destOffset, scale);
            srcOffset += 3;
            destOffset += 3 + alpha01;
        }
    }
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
}

