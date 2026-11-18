import { _isLittleEndian } from '@syncfusion/ej2-pdf';
export const imageKind: any = {grayScale1Bpp: 1, rgb24BPP: 2, rgba32BPP: 3}; // eslint-disable-line
export const maximumCount: number = 2 ** 31 - 1;
/**
 * Converts a source buffer into RGBA destination buffer based on the image kind.
 *
 * @private
 * @param {any} kind Image format kind.
 * @param {any} src Source pixel buffer .
 * @param {Uint32Array} dest Destination buffer.
 * @param {number} width Image width in pixels.
 * @param {number} height Image height in pixels.
 * @param {boolean} inverseDecode For 1bpp grayscale: whether to invert decode mapping.
 * @returns {Promise<any>} A promise resolving to conversion result or `null` if not handled here.
 */
export function _convertToRGBA(kind: any, src: any, dest: Uint32Array, width: number, height: number, inverseDecode: boolean): Promise<any> { // eslint-disable-line
    switch (kind) {
    case imageKind.grayScale1Bpp:
        return _convertBlackAndWhiteToRGBA(src, 0, dest, width, height, 0xffffffff, inverseDecode);
    case imageKind.rgb24BPP:
        return  _convertRGBToRGBA(src, 0, dest, 0, width, height);
    }
    return null;
}
/**
 * Converts a 1-bit grayscale source into RGBA.
 *
 * @private
 * @param {Uint8Array} src Source buffer.
 * @param {any} srcPos Start bit/byte position index in `src`.
 * @param {any} dest Destination buffer to write RGBA pixels into.
 * @param {number} width Image width in pixels.
 * @param {number} height Image height in pixels.
 * @param {number} [nonBlackColor=0xffffffff] Color used for '1' bits.
 * @param {boolean} [inverseDecode=false] If `true`, swaps mapping of 0/1 bits.
 * @returns {any} Object with updated srcPos, destPos.
 */
export function _convertBlackAndWhiteToRGBA(src: Uint8Array, srcPos: any, dest: any, width: number,  // eslint-disable-line
                                            height: number, nonBlackColor: number = 0xffffffff, inverseDecode: boolean = false):
                                           any { // eslint-disable-line
    const black: number = _isLittleEndian() ? 0xff000000 : 0x000000ff;
    const [zeroMapping, oneMapping]: [number, number] = inverseDecode
        ? [nonBlackColor, black]
        : [black, nonBlackColor];
    const widthInSource: number = width >> 3;
    const widthRemainder: number = width & 7;
    const srcLength: number = src.length;
    dest = new Uint32Array(dest.buffer);
    let destPos: number = 0;
    for (let i: number = 0; i < height; i++) {
        for (const max: number = srcPos + widthInSource; srcPos < max; srcPos++) {
            const elem: number = srcPos < srcLength ? src[<number>srcPos] : 255;
            dest[destPos++] = elem & 0b10000000 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b1000000 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b100000 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b10000 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b1000 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b100 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b10 ? oneMapping : zeroMapping;
            dest[destPos++] = elem & 0b1 ? oneMapping : zeroMapping;
        }
        if (widthRemainder === 0) {
            continue;
        }
        const elem: number = srcPos < srcLength ? src[srcPos++] : 255;
        for (let j: number = 0; j < widthRemainder; j++) {
            dest[destPos++] = elem & (1 << (7 - j)) ? oneMapping : zeroMapping;
        }
    }
    return { srcPos, destPos };
}
/**
 * Converts an RGB source buffer into an RGBA destination buffer .
 *
 * @private
 * @param {any} src Source buffer containing RGB bytes.
 * @param {number} [srcPos=0] Start offset in the source buffer.
 * @param {Uint32Array} dest Destination buffer to receive packed RGBA pixels.
 * @param {number} [destPos=0] Start index in the destination buffer (in 32-bit words).
 * @param {number} width Image width in pixels.
 * @param {number} height Image height in pixels.
 * @returns {any} Object with updated srcPos, destPos.
 */
export function _convertRGBToRGBA(src: any, srcPos = 0, dest: Uint32Array, destPos = 0, width: number, // eslint-disable-line
                                  height: number): any { // eslint-disable-line
    let i: number = 0;
    const len: number = width * height * 3;
    const len32: number = len >> 2;
    const src32 : Uint32Array = new Uint32Array(src.buffer, srcPos, len32);
    if (_isLittleEndian()) {
        for (; i < len32 - 2; i += 3, destPos += 4) {
            const s1: number = src32[<number>i];
            const s2: number = src32[i + 1];
            const s3: number = src32[i + 2];
            dest[<number>destPos] = s1 | 0xff000000;
            dest[destPos + 1] = (s1 >>> 24) | (s2 << 8) | 0xff000000;
            dest[destPos + 2] = (s2 >>> 16) | (s3 << 16) | 0xff000000;
            dest[destPos + 3] = (s3 >>> 8) | 0xff000000;
        }
        for (let j: number = i * 4, jj: number = srcPos + len; j < jj; j += 3) {
            dest[destPos++] =
                src[<number>j] | (src[j + 1] << 8) | (src[j + 2] << 16) | 0xff000000;
        }
    } else {
        for (; i < len32 - 2; i += 3, destPos += 4) {
            const s1: number = src32[<number>i];
            const s2: number = src32[i + 1];
            const s3: number = src32[i + 2];
            dest[<number>destPos] = s1 | 0xff;
            dest[destPos + 1] = (s1 << 24) | (s2 >>> 8) | 0xff;
            dest[destPos + 2] = (s2 << 16) | (s3 >>> 16) | 0xff;
            dest[destPos + 3] = (s3 << 8) | 0xff;
        }
        for (let j: number = i * 4, jj: number = srcPos + len; j < jj; j += 3) {
            dest[destPos++] =
                (src[<number>j] << 24) | (src[j + 1] << 16) | (src[j + 2] << 8) | 0xff;
        }
    }
    return { srcPos: srcPos + len, destPos };
}
/**
 * Converts a grayscale image represented by a Uint8Array into an RGBA format stored in a Uint32Array.
 *
 * @private
 * @param {Uint8Array} src - The source array containing grayscale pixel values (0 to 255).
 * @param {Uint32Array} dest - The destination array where converted RGBA values will be stored.
 * @returns {void} This function does not return a value.
 */
export function _grayToRGBA(src: Uint8Array, dest: Uint32Array): void {
    if (_isLittleEndian()) {
        for (let i: number = 0, ii: number = src.length; i < ii; i++) {
            dest[<number>i] = (src[<number>i] * 0x10101) | 0xff000000;
        }
    } else {
        for (let i: number = 0, ii: number = src.length; i < ii; i++) {
            dest[<number>i] = (src[<number>i] * 0x1010100) | 0x000000ff;
        }
    }
}
