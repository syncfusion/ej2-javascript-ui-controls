/**
 * PNG media type (ECMA-376-1 §15.2.14).
 *
 * @public
 */
export const PNG_CONTENT_TYPE: string = 'image/png';
/**
 * JPEG media type (ECMA-376-1 §15.2.14).
 *
 * @public
 */
export const JPEG_CONTENT_TYPE: string = 'image/jpeg';
/** Supported image content types for create/replace.
 *
 * @public
 */
export type ImageType = typeof PNG_CONTENT_TYPE | typeof JPEG_CONTENT_TYPE;
function readUint32Be(bytes: Uint8Array, offset: number): number {
    let ts330: any; let ts331: any; let ts332: any;
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
    return (((bytes[offset] != null ? bytes[offset] : 0) << 24) |
        ((((ts330 = bytes[offset + 1]), ts330 != null ? ts330 : 0)) << 16) |
        ((((ts331 = bytes[offset + 2]), ts331 != null ? ts331 : 0)) << 8) |
        (((ts332 = bytes[offset + 3]), ts332 != null ? ts332 : 0))) >>> 0;
}
/**
 * @param {Uint8Array} bytes - The bytes.
 * @returns {Object} The result.
 * @private
 * Pixel dimensions when sniffable from PNG or JPEG bytes.
 */
export function sniffImagePixelDimensions(bytes: Uint8Array): {
    width: number;
    height: number;
} | undefined {
    let ts333: any; let ts334: any; let ts335: any; let ts336: any; let ts337: any; let ts338: any;
    if (bytes.length >= 24 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47) {
        return { width: readUint32Be(bytes, 16), height: readUint32Be(bytes, 20) };
    }
    if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
        let offset: number = 2;
        while (offset + 9 < bytes.length) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            if (bytes[offset] !== 0xff) {
                break;
            }
            const marker: number = bytes[offset + 1];
            if (marker === undefined) {
                break;
            }
            if (marker === 0xd9 || marker === 0xda) {
                break;
            }
            const segmentLength: number =
                (((ts333 = bytes[offset + 2]), ts333 != null ? ts333 : 0) << 8) | ((ts334 = bytes[offset + 3]), ts334 != null ? ts334 : 0);
            if (segmentLength < 2) {
                break;
            }
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                const height: number =
                    (((ts335 = bytes[offset + 5]), ts335 != null ? ts335 : 0) << 8) |
                    ((ts336 = bytes[offset + 6]), ts336 != null ? ts336 : 0);
                const width: number =
                    (((ts337 = bytes[offset + 7]), ts337 != null ? ts337 : 0) << 8) |
                    ((ts338 = bytes[offset + 8]), ts338 != null ? ts338 : 0);
                if (width > 0 && height > 0) {
                    return { width, height };
                }
                return undefined;
            }
            offset += 2 + segmentLength;
        }
    }
    return undefined;
}
/**
 * @param {Uint8Array} bytes - The bytes.
 * @returns {ImageType | undefined} The result.
 * @private
 * Sniff PNG/JPEG content type from magic bytes.
 */
export function sniffImageContentType(bytes: Uint8Array): ImageType | undefined {
    if (bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47) {
        return PNG_CONTENT_TYPE;
    }
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return JPEG_CONTENT_TYPE;
    }
    return undefined;
}
