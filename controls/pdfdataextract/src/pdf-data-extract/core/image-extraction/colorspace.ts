import { _isLittleEndian, _mathClamp, _PdfBaseStream, _unreachable, FormatError } from '@syncfusion/ej2-pdf';
/**
 * Base palette for PDF color spaces, exposing helpers to convert to RGB buffers.
 *
 * @private
 */
export class _PdfColorPalette {
    name: string;
    numComps: number;
    base: any; // eslint-disable-line
    bytes: any; // eslint-disable-line
    /**
     * Initializes a new instance of the `_PdfColorPalette` class.
     *
     * @private
     * @param {string} name Color space name.
     * @param {number} numComps Number of color components.
     * @returns {void} nothing.
     */
    constructor(name: string, numComps: number) {
        this.name = name;
        this.numComps = numComps;
    }
    /**
     * Resamples (nearest-neighbor) an RGB image buffer, with optional alpha interleave control.
     *
     * @private
     * @param {Uint8Array} src Source RGB bytes.
     * @param {Uint8Array} dest Destination buffer to write into.
     * @param {number} w1 Source width.
     * @param {number} h1 Source height.
     * @param {number} w2 Target width.
     * @param {number} h2 Target height.
     * @param {number} alpha01 0 for no alpha slot in dest, 1 to skip alpha slot per pixel.
     * @returns {void} nothing.
     */
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
    /**
     * Determines whether the provided decode array represents the default decode for this space.
     *
     * @private
     * @param {any} decode The decode array or value.
     * @param {number} numComps The number of components.
     * @returns {boolean} `true` if decode is default; otherwise, `false`.
     */
    _isDefaultDecode(decode: any, numComps: number): boolean { // eslint-disable-line
        numComps = this.numComps;
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
    /**
     * Gets a single RGB triplet from source data at the given offset.
     *
     * @private
     * @param {Uint8Array} src Source buffer.
     * @param {number} srcOffset Byte offset in source.
     * @returns {Uint8ClampedArray} A 3 byte clamped array [r,g,b].
     */
    _getRgb(src: Uint8Array, srcOffset: number): Uint8ClampedArray {
        const rgb: Uint8ClampedArray = new Uint8ClampedArray(3);
        this._getRgbItem(src, srcOffset, rgb, 0);
        return rgb;
    }
    /**
     * Reads one color sample and writes a single RGB triplet into destination.
     * Must be implemented by concrete color spaces.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Start offset in source.
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} destOffset Start offset in destination.
     * @returns {void} nothing.
     */
    _getRgbItem(src: any, srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        _unreachable('Should not call _PdfColorPalette._getRgbItem');
    }
    /* eslint-disable */
    /**
     * Converts a sequence of samples into RGB and writes to destination buffer.
     * Must be implemented by concrete color spaces.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Start offset in source.
     * @param {number} count Number of samples to process.
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} destOffset Start offset in destination.
     * @param {number} bits Bits per component in source samples.
     * @param {number} alpha01 0 for no alpha slot, 1 to skip alpha slot per pixel.
     * @returns {any} nothing.
     */
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: any, destOffset: number, bits: number,
                  alpha01: number): any {
        _unreachable('Should not call _PdfColorPalette._getRgbBuffer');
    }
    /* eslint-enable */
    /**
     * Computes the required output length in bytes for a given input length.
     * Must be implemented by concrete color spaces.
     *
     * @private
     * @param {number} inputLength Number of input scalar values.
     * @param {number} alpha01 0 or 1 indicating extra alpha slot in output.
     * @returns {void} nothing.
     */
    _getOutputLength(inputLength: number, alpha01: number): void { // eslint-disable-line
        _unreachable('Should not call _PdfColorPalette._getOutputLength');
    }
    /**
     * Indicates whether the color space path can be passed through unchanged for given bpc.
     *
     * @private
     * @param {any} bits Bits per component.
     * @returns {boolean} `true` if passthrough is allowed otherwise, `false`.
     */
    _isPass(bits: any): boolean { // eslint-disable-line
        return false;
    }
    /**
     * Fills an RGB destination buffer from component data, handling optional resize and alpha.
     *
     * @private
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} originalWidth Source width.
     * @param {number} originalHeight Source height.
     * @param {number} width Target width.
     * @param {number} height Target height.
     * @param {number} actualHeight Actual rendered height.
     * @param {number} bpc Bits per component.
     * @param {Uint8Array | Uint16Array} comps Component data buffer.
     * @param {number} alpha01 0 or 1 to control alpha slot.
     * @returns {Promise<any>} Resolves to the destination buffer.
     */
    async _fillRgb(dest: any, originalWidth: number, originalHeight: number, width: number, height: number, // eslint-disable-line
                   actualHeight: number, bpc: number, comps: Uint8Array | Uint16Array, alpha01: number):
                   Promise<any> { // eslint-disable-line
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
            await this._getRgbBuffer(allColors, 0, numComponentColors, colorMap, 0, bpc, 0);
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
            await this._getRgbBuffer(comps, 0, width * actualHeight, dest, 0, bpc, alpha01);
        } else {
            rgbBuf = new Uint8ClampedArray(count * 3);
            await this._getRgbBuffer(comps, 0, count, rgbBuf, 0, bpc, 0);
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
        return dest;
    }
}
/**
 * Alternate/tint color space mapping to a base color space.
 *
 * @private
 */
export class _PdfAlternateCS extends _PdfColorPalette {
    base: _PdfColorPalette;
    private tmpBuf: Float32Array;
    /**
     * Initializes a new instance of the `_PdfAlternateCS` class.
     *
     * @private
     * @param {number} numComps Number of components in the tint space.
     * @param {_PdfColorPalette} base Base color palette to map into.
     * @returns {void} nothing.
     */
    constructor(numComps: number, base: _PdfColorPalette) {
        super('Alternate', numComps);
        this.base = base;
        this.tmpBuf = new Float32Array(base.numComps);
    }
    /**
     * Converts a single tinted sample to RGB via the base color space.
     *
     * @private
     * @param {Uint8Array} src Source buffer.
     * @param {number} srcOffset Offset in source.
     * @param {Uint8ClampedArray} dest Destination buffer for RGB output.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: Uint8Array, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void {
        const tmpBuf: any = this.tmpBuf; // eslint-disable-line
        this.base._getRgbItem(tmpBuf, 0, dest, destOffset);
    }
    /**
     * Converts a sequence of tinted samples to RGB via the base color space.
     *
     * @private
     * @param {Uint8Array} src Source buffer.
     * @param {number} srcOffset Offset in source.
     * @param {number} count Number of samples.
     * @param {Uint8Array} dest Destination buffer for RGB output.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {void} nothing.
     */
    _getRgbBuffer(src: Uint8Array, srcOffset: number, count: number, dest: Uint8Array, destOffset: number,
                  bits: number, alpha01: number): void {
        const base: any = this.base; // eslint-disable-line
        const scale: number = 1 / ((1 << bits) - 1);
        const baseNumComps: any = base.numComps; // eslint-disable-line
        const usesZeroToOneRange: any = base.usesZeroToOneRange; // eslint-disable-line
        const isPass: boolean =
            (base._isPass(8) || !usesZeroToOneRange) && alpha01 === 0;
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
/**
 * Pattern color space that may refer to a base color space for uncolored tiling patterns.
 *
 * @private
 */
export class _PdfPatternCS extends _PdfColorPalette {
    base: any; // eslint-disable-line 
    constructor(baseCS: any) { // eslint-disable-line
        super('Pattern', null);
        this.base = baseCS;
    }
    /**
     * Pattern color space does not use decode maps calling this is invalid.
     *
     * @private
     * @param {any} decodeMap Decode map.
     * @param {any} bpc Bits per component.
     * @throws {Error} Always thrown since not applicable to PatternCS.
     * @returns {boolean} true if it is default decode.
     */
    /* eslint-enable */
    _isDefaultDecode(decodeMap: any, bpc: any): boolean { // eslint-disable-line
        throw new Error('PatternCS._isDefaultDecode should not be called.');
    }
}
/**
 * Indexed color space using a lookup table to map indices to base-space colors.
 *
 * @private
 */
export class _PdfIndexedCS extends _PdfColorPalette {
    base: any; // eslint-disable-line
    private highVal: number;
    private lookup: Uint8Array;
    /**
     * Initializes a new instance of the `_PdfIndexedCS` class.
     *
     * @private
     * @param {any} base Base color space.
     * @param {number} highVal Highest index value.
     * @param {any} lookup Lookup source.
     * @returns {void} nothing.
     * @throws {FormatError} When lookup source is not recognized.
     */
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
    /**
     * Converts a single index to RGB using the lookup table.
     *
     * @private
     * @param {any} src Source buffer containing indices.
     * @param {number} srcOffset Offset in source.
     * @param {Uint8ClampedArray} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        const { base, highVal, lookup } = this;
        const start: number = _mathClamp(Math.round(src[<number>srcOffset]), 0, highVal) * base.numComps;
        base._getRgbBuffer(lookup, start, 1, dest, destOffset, 8, 0);
    }
    /**
     * Converts a sequence of indices to RGB using the lookup table.
     *
     * @private
     * @param {any} src Source indices.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of indices to process.
     * @param {Uint8ClampedArray} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component (ignored; indices are 8-bit after clamp).
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {void} nothing.
     */
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
    /**
     * Computes output byte length for the given input length, considering the base space.
     *
     * @private
     * @param {number} inputLength Number of input elements.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {number} Bytes required in output.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return this.base._getOutputLength(inputLength * this.base.numComps, alpha01);
    }
    /**
     * Determines if the provided decode map equals the default mapping for indexed space.
     *
     * @private
     * @param {any[]} decodeMap Decode array.
     * @param {number} bpc Bits per component.
     * @returns {boolean} `true` if default otherwise, `false`.
     */
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
    /**
     * Converts one gray sample to RGB.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {Uint8ClampedArray} dest Destination RGB.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        const c: number = src[<number>srcOffset] * 255;
        dest[<number>destOffset] = dest[destOffset + 1] = dest[destOffset + 2] = c;
    }
    /**
     * Converts multiple gray samples to RGB.
     *
     * @private
     * @param {any} src Source samples.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of samples.
     * @param {Uint8ClampedArray} dest Destination RGB.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {void} nothing.
     */
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
    /**
     * Computes the output byte length for a given input length.
     *
     * @private
     * @param {number} inputLength Number of gray samples.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {number} Number of bytes required in output.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return inputLength * (3 + alpha01);
    }
}
/**
 * DeviceRGB color space implementation.
 *
 * @private
 */
export class _PdfDeviceRgbCS extends _PdfColorPalette {
    /**
     * Initializes a new instance of the `_PdfDeviceRgbCS` class.
     *
     * @private
     * @returns {void} nothing.
     */
    constructor() {
        super('DeviceRGB', 3);
    }
    /**
     * Copies one RGB sample to destination .
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {Uint8ClampedArray} dest Destination RGB.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        dest[<number>destOffset] = src[<number>srcOffset] * 255;
        dest[destOffset + 1] = src[srcOffset + 1] * 255;
        dest[destOffset + 2] = src[srcOffset + 2] * 255;
    }
    /**
     * Copies many RGB samples, scaling by bits when needed.
     *
     * @private
     * @param {any} src Source samples.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of RGB pixels.
     * @param {Uint8ClampedArray} dest Destination RGB.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {void} nothing.
     */
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
    /**
     * Computes the output byte length for the given input RGB scalar count.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {number} Number of bytes required.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
    /**
     * Indicates passthrough is allowed for 8-bit components.
     *
     * @private
     * @param {number} bits Bits per component.
     * @returns {boolean} `true` if 8 bits; otherwise, `false`.
     */
    _isPass(bits: number): boolean {
        return bits === 8;
    }
}
/**
 * DeviceRGBA color space implementation with resize/copy helpers.
 *
 * @private
 */
export class _PdfDeviceRgbaCS extends _PdfColorPalette {
    /**
     * Initializes a new instance of the `_PdfDeviceRgbaCS` class.
     *
     * @private
     * @returns {void} nothing.
     */
    constructor() {
        super('DeviceRGBA', 4);
    }
    /**
     * Resizes an RGBA source image into a destination, optionally stripping alpha.
     *
     * @private
     * @param {Uint8Array} src Source RGBA buffer.
     * @param {Uint8Array} dest Destination buffer.
     * @param {number} w1 Source width.
     * @param {number} h1 Source height.
     * @param {number} w2 Target width.
     * @param {number} h2 Target height.
     * @param {number} alpha01 1 to keep alpha in layout (mask write), 0 to strip.
     * @returns {void} nothing.
     */
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
    /**
     * Copies an RGBA buffer into destination, optionally stripping alpha.
     *
     * @private
     * @param {Uint8Array} src Source RGBA buffer.
     * @param {Uint8Array} dest Destination buffer.
     * @param {number} alpha01 1 to keep alpha in layout, 0 to strip.
     * @returns {void} nothing.
     */
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
    /**
     * Computes the output byte length for RGBA.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} _alpha01 Alpha slot flag.
     * @returns {number} Number of output bytes.
     */
    _getOutputLength(inputLength: number, _alpha01: number): number { // eslint-disable-line
        return inputLength * 4;
    }
    /**
     * Indicates passthrough is allowed for 8-bit components.
     *
     * @private
     * @param {number} bits Bits per component.
     * @returns {boolean} `true` if 8 bits; otherwise, `false`.
     */
    _isPass(bits: number): boolean {
        return bits === 8;
    }
    /**
     * Fills RGB(A) destination buffer, resizing or copying RGBA as needed.
     *
     * @private
     * @param {any} dest Destination buffer.
     * @param {number} originalWidth Source width.
     * @param {number} originalHeight Source height.
     * @param {number} width Target width.
     * @param {number} height Target height.
     * @param {number} actualHeight Actual drawn height.
     * @param {number} bpc Bits per component.
     * @param {any} comps Component data (RGBA).
     * @param {number} alpha01 1 to keep alpha in layout, 0 to strip.
     * @returns {Promise<any>} Resolves when fill is complete.
     */
    async _fillRgb(dest: any, originalWidth: number, originalHeight: number, width: number, height: number, // eslint-disable-line
            actualHeight: number, bpc: number, comps: any, alpha01: number): Promise<any> { // eslint-disable-line
        if (originalHeight !== height || originalWidth !== width) {
            this._resizeRgbaImage(comps, dest, originalWidth, originalHeight, width, height, alpha01);
        } else {
            this._copyRgbaImage(comps, dest, alpha01);
        }
    }
}
/**
 * DeviceCMYK color space implementation with polynomial conversion to sRGB.
 *
 * @private
 */
export class _PdfDeviceCmykCS extends _PdfColorPalette {
    constructor() {
        super('DeviceCMYK', 4);
    }
    /**
     * Converts one CMYK sample to RGB using a polynomial approximation.
     *
     * @private
     * @param {any} src Source CMYK buffer.
     * @param {number} srcOffset Source offset.
     * @param {number} srcScale Scale factor for components.
     * @param {any} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
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
    /**
     * Converts one CMYK sample to RGB.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {Uint8ClampedArray} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: any, srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, 1, dest, destOffset);
    }
    /**
     * Converts multiple CMYK samples to RGB.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of pixels.
     * @param {Uint8ClampedArray} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {void} nothing.
     */
    _getRgbBuffer(src: any, srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; i++) {
            this._toRgb(src, srcOffset, scale, dest, destOffset);
            srcOffset += 4;
            destOffset += 3 + alpha01;
        }
    }
    /**
     * Computes output length for CMYK source scalars.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {number} Number of bytes required.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength / 4) * (3 + alpha01)) | 0;
    }
}
/**
 * CIE Lab color space implementation.
 *
 * @private
 */
export class _PdfLabCS extends _PdfColorPalette {
    /**
     * White point X.
     *
     * @private
     */
    private _xw: number;
    /**
     * White point Y.
     *
     * @private
     */
    private _yw: number;
    /**
     * White point Z.
     *
     * @private
     */
    private _zw: number;
    /**
     * Black point X.
     *
     * @private
     */
    private _xb: number;
    /**
     * Black point Y.
     *
     * @private
     */
    private _yb: number;
    /**
     * Black point Z.
     *
     * @private
     */
    private _zb: number;
    /**
     * 'a' minimum bound.
     *
     * @private
     */
    private _amin: number;
    /**
     * 'a' maximum bound.
     *
     * @private
     */
    private _amax: number;
    /**
     * 'b' minimum bound.
     *
     * @private
     */
    private _bmin: number;
    /**
     * 'b' maximum bound.
     *
     * @private
     */
    private _bmax: number;
    /**
     * Initializes a new instance of the `_PdfLabCS` class.
     *
     * @private
     * @param {number[]} [whitePoint] Required white point [X, Y, Z].
     * @param {number[]} [blackPoint] Optional black point [X, Y, Z].
     * @param {number[]} [range] Optional range [aMin, aMax, bMin, bMax].
     * @returns {void} nothing.
     * @throws {FormatError} When whitePoint is missing or invalid.
     */
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
    /**
     * Converts a single Lab sample to RGB.
     *
     * @private
     * @param {Uint8Array} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: Uint8Array, srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, false, dest, destOffset);
    }
    /**
     * Converts multiple Lab samples to RGB.
     *
     * @private
     * @param {Uint8Array} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of samples.
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {void} nothing.
     */
    _getRgbBuffer(src: Uint8Array, srcOffset: number, count: number, dest: any, destOffset: number, // eslint-disable-line
                  bits: number, alpha01: number): void {
        const maxVal: number = (1 << bits) - 1;
        for (let i: number = 0; i < count; i++) {
            this._toRgb(src, srcOffset, maxVal, dest, destOffset);
            srcOffset += 3;
            destOffset += 3 + alpha01;
        }
    }
    /**
     * Computes the output byte length for a set of Lab samples.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {number} Number of bytes required.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
    /**
     * Indicates whether the provided decode map equals the default mapping (always `true` for Lab).
     *
     * @private
     * @param {any} decodeMap Decode map.
     * @param {number} bpc Bits per component.
     * @returns {boolean} Always `true` for Lab.
     */
    _isDefaultDecode(decodeMap: any, bpc: number): boolean { // eslint-disable-line
        return true;
    }
    get usesZeroToOneRange(): boolean {
        return false;
    }
}
/**
 * CalGray color space implementation.
 *
 * @private
 */
export class _PdfCalGrayCS extends _PdfColorPalette {
    /**
     * White point X.
     *
     * @private
     */
    _xw: number;
    /**
     * White point Y.
     *
     * @private
     */
    _yw: number;
    /**
     * White point Z.
     *
     * @private
     */
    _zw: number;
    /**
     * Black point X.
     *
     * @private
     */
    _xb: number;
    /**
     * Black point Y.
     *
     * @private
     */
    _yb: number;
    /**
     * Black point Z.
     *
     * @private
     */
    _zb: number;
    /**
     * Gamma exponent.
     *
     * @private
     */
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
    /**
     * Converts one CalGray sample to RGB using gamma and white point.
     *
     * @private
     * @param {number[]} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {number[]} dest Destination buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} scale Scale factor for input sample.
     * @returns {void} nothing.
     */
    _toRgb(src: number[], srcOffset: number, dest: number[], destOffset: number, scale: number): void {
        const a: number = src[<number>srcOffset] * scale;
        const ag: number = a ** this._g;
        const l: number = this._yw * ag;
        const val: number = Math.max(295.8 * l ** 0.3333333333333333 - 40.8, 0);
        dest[<number>destOffset] = val;
        dest[destOffset + 1] = val;
        dest[destOffset + 2] = val;
    }
    /**
     * Converts a single CalGray sample to RGB.
     *
     * @private
     * @param {number[]} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {any} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: number[], srcOffset: number, dest: any, destOffset: number): void { // eslint-disable-line
        this._toRgb(src, srcOffset, dest, destOffset, 1);
    }
    /**
     * Converts multiple CalGray samples to RGB.
     *
     * @private
     * @param {number[]} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of samples.
     * @param {any} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag .
     * @returns {void} nothing.
     */
    _getRgbBuffer(src: number[], srcOffset: number, count: number, dest: any, destOffset: number, bits: number, alpha01: number): void { // eslint-disable-line
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; ++i) {
            this._toRgb(src, srcOffset, dest, destOffset, scale);
            srcOffset += 1;
            destOffset += 3 + alpha01;
        }
    }
    /**
     * Computes output byte length for CalGray input.
     *
     * @private
     * @param {number} inputLength Number of input samples.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {number} Output byte count.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return inputLength * (3 + alpha01);
    }
}
/**
 * CalRGB color space implementation with white/black point and gamma.
 *
 * @private
 */
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
    /**
     * Source white point [X, Y, Z].
     *
     * @private
     */
    _whitePoint: Float32Array;
    /**
     * Source black point [X, Y, Z].
     *
     * @private
     */
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
    /**
     * Multiplies a 3x3 matrix by a 3x1 vector.
     *
     * @private
     * @param {Float32Array} a 3x3 matrix.
     * @param {Float32Array} b 3x1 vector.
     * @param {Float32Array} result 3x1 output vector.
     * @returns {void} nothing.
     */
    _matrixProduct(a: Float32Array, b: Float32Array, result: Float32Array): void {
        result[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        result[1] = a[3] * b[0] + a[4] * b[1] + a[5] * b[2];
        result[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];
    }
    /**
     * Normalizes LMS values to a flat white point.
     *
     * @private
     * @param {Float32Array} sourceWhitePoint Source white point [L,M,S].
     * @param {Float32Array} lms Input LMS vector.
     * @param {Float32Array} result Output normalized LMS.
     * @returns {void} nothing.
     */
    _toFlat(sourceWhitePoint: Float32Array, lms: Float32Array, result: Float32Array): void {
        result[0] = (lms[0] * 1) / sourceWhitePoint[0];
        result[1] = (lms[1] * 1) / sourceWhitePoint[1];
        result[2] = (lms[2] * 1) / sourceWhitePoint[2];
    }
    /**
     * Normalizes LMS values to D65 white point.
     *
     * @private
     * @param {Float32Array} sourceWhitePoint Source white point [L,M,S].
     * @param {Float32Array} lms Input LMS vector.
     * @param {Float32Array} result Output normalized LMS for D65.
     * @returns {void} nothing.
     */
    _toD65(sourceWhitePoint: Float32Array, lms: Float32Array, result: Float32Array): void {
        const d65X: number = 0.95047;
        const d65Y: number = 1;
        const d65Z: number = 1.08883;
        result[0] = (lms[0] * d65X) / sourceWhitePoint[0];
        result[1] = (lms[1] * d65Y) / sourceWhitePoint[1];
        result[2] = (lms[2] * d65Z) / sourceWhitePoint[2];
    }
    /**
     * sRGB transfer function.
     *
     * @private
     * @param {number} color Linear color channel value.
     * @returns {number} Gamma-corrected channel .
     */
    _srgbTransferFunction(color: number): number {
        if (color <= 0.0031308) {
            return _mathClamp(12.92 * color, 0, 1);
        }
        if (color >= 0.99554525) {
            return 1;
        }
        return _mathClamp((1 + 0.055) * color ** (1 / 2.4) - 0.055, 0, 1);
    }
    /**
     * Decodes L* value to linear lightness.
     *
     * @private
     * @param {number} L L* value.
     * @returns {number} Linear value.
     */
    _decodeL(L: number): number {
        if (L < 0) {
            return -this._decodeL(-L);
        }
        if (L > 8.0) {
            return ((L + 16) / 116) ** 3;
        }
        return L * this.decodeConstant;
    }
    /**
     * Applies black point compensation.
     *
     * @private
     * @param {Float32Array} sourceBlackPoint Source black point XYZ.
     * @param {Float32Array} xyzFlat Flat-normalized XYZ.
     * @param {Float32Array} result Output compensated XYZ.
     * @returns {void} nothing.
     */
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
    /**
     * Normalizes XYZ to a flat white point from source white point.
     *
     * @private
     * @param {Float32Array} sourceWhitePoint Source white point (XYZ).
     * @param {Float32Array} xyzIn Input XYZ.
     * @param {Float32Array} result Output XYZ (flat).
     * @returns {void} nothing.
     */
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
    /**
     * Normalizes XYZ to D65 from source white point.
     *
     * @private
     * @param {Float32Array} sourceWhitePoint Source white point.
     * @param {Float32Array} xyzIn Input XYZ.
     * @param {Float32Array} result Output XYZ.
     * @returns {void} nothing.
     */
    _normalizeWhitePointToD65(sourceWhitePoint: Float32Array, xyzIn: Float32Array, result: Float32Array): void {
        const lms: any = result; // eslint-disable-line
        this._matrixProduct(this.scaleMatrix, xyzIn, lms);
        const lmsD65: any = this.tempNormalizeMatrix; // eslint-disable-line
        this._toD65(sourceWhitePoint, lms, lmsD65);
        this._matrixProduct(this.inverseMatrix, lmsD65, result);
    }
    /**
     * Converts one CalRGB sample to sRGB.
     *
     * @private
     * @param {number[]} src Source components.
     * @param {number} srcOffset Source offset.
     * @param {Uint8ClampedArray} dest Destination buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} scale Scale factor for input sample.
     * @returns {void} nothing.
     */
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
    /**
     * Converts one CalRGB sample to sRGB.
     *
     * @private
     * @param {number[]} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {Uint8ClampedArray} dest Destination buffer.
     * @param {number} destOffset Destination offset.
     * @returns {void} nothing.
     */
    _getRgbItem(src: number[], srcOffset: number, dest: Uint8ClampedArray, destOffset: number): void {
        this._toRgb(src, srcOffset, dest, destOffset, 1);
    }
    /**
     * Converts multiple CalRGB samples to sRGB.
     *
     * @private
     * @param {number[]} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of samples.
     * @param {Uint8ClampedArray} dest Destination buffer.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component.
     * @param {number} alpha01 Alpha slot flag .
     * @returns {void} nothing.
     */
    _getRgbBuffer(src: number[], srcOffset: number, count: number, dest: Uint8ClampedArray, destOffset: number, bits: number,
                  alpha01: number): void {
        const scale: number = 1 / ((1 << bits) - 1);
        for (let i: number = 0; i < count; ++i) {
            this._toRgb(src, srcOffset, dest, destOffset, scale);
            srcOffset += 3;
            destOffset += 3 + alpha01;
        }
    }
    /**
     * Computes output byte length for CalRGB source samples.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} alpha01 Alpha slot flag.
     * @returns {number} Output byte count.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength * (3 + alpha01)) / 3) | 0;
    }
}

