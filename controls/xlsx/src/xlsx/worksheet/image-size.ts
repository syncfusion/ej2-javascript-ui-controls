/**
 * Natural pixel size of PNG, JPEG, GIF and BMP image bytes.
 *
 * Used to size a picture placed in a cell, which carries no extent of its own.
 * Unreadable or unsupported data yields `undefined`; it never throws.
 *
 * @private
 */

/** Pixel width and height. */
/** @private */
export interface PixelSize {
    readonly width: number;
    readonly height: number;
}

function u16be(b: Uint8Array, at: number): number {
    return (b[at] << 8) | b[at + 1];
}

function u32be(b: Uint8Array, at: number): number {
    return ((b[at] * 0x1000000) + ((b[at + 1] << 16) | (b[at + 2] << 8) | b[at + 3]));
}

function u16le(b: Uint8Array, at: number): number {
    return b[at] | (b[at + 1] << 8);
}

function i32le(b: Uint8Array, at: number): number {
    return (b[at] | (b[at + 1] << 8) | (b[at + 2] << 16) | (b[at + 3] << 24));
}

function jpegSize(b: Uint8Array): PixelSize | undefined {
    let at: number = 2;
    while (at + 9 < b.length) {
        if (b[at] !== 0xff) {
            at += 1;
            continue;
        }
        const marker: number = b[at + 1];
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0xff) {
            at += marker === 0xff ? 1 : 2;
            continue;
        }
        const isFrame: boolean = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isFrame) {
            return { height: u16be(b, at + 5), width: u16be(b, at + 7) };
        }
        at += 2 + u16be(b, at + 2);
    }
    return undefined;
}

/**
 * Natural size in pixels, or `undefined` when the format is not recognised.
 *
 * @param {Uint8Array} bytes - Image file bytes.
 * @returns {PixelSize | undefined} The size.
 *
 * @private
 */
export function readImagePixelSize(bytes: Uint8Array): PixelSize | undefined {
    let size: PixelSize | undefined;
    if (bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
        size = { width: u32be(bytes, 16), height: u32be(bytes, 20) };
    } else if (bytes.length >= 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        size = { width: u16le(bytes, 6), height: u16le(bytes, 8) };
    } else if (bytes.length >= 26 && bytes[0] === 0x42 && bytes[1] === 0x4d) {
        size = { width: Math.abs(i32le(bytes, 18)), height: Math.abs(i32le(bytes, 22)) };
    } else if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
        size = jpegSize(bytes);
    }
    return size !== undefined && size.width > 0 && size.height > 0 ? size : undefined;
}
