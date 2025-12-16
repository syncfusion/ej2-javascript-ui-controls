import { DigestAlgorithm, CryptographicStandard } from './enumerator';
/**
 * Represents a bounding rectangle with an origin (x, y) and size (width, height).
 *
 * @property {number} x - The horizontal coordinate of the rectangle's origin.
 * @property {number} y - The vertical coordinate of the rectangle's origin.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */
export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Represents the size.
 *
 * @property {number} width - The width.
 * @property {number} height - The height.
 */
export type Size = {
    width: number;
    height: number;
};
/**
 * Represents a point in a two-dimensional coordinate system.
 *
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */
export type Point = {
    x: number;
    y: number;
};
/**
 * Represents a color using RGB components and an optional transparency flag.
 *
 * @property {number} r - Red component of the color (0 to 255).
 * @property {number} g - Green component of the color (0 to 255).
 * @property {number} b - Blue component of the color (0 to 255).
 * @property {boolean} isTransparent - Optional flag indicating whether the color is transparent.
 */
export type PdfColor = {
    r: number;
    g: number;
    b: number;
    isTransparent?: boolean;
};

/**
 * A callback function used for external signing of a PDF document with extended options.
 *
 * If public certificates are provided before signing, `data` will be a 256-byte hash
 * that should be signed using the certificate's private key.
 * If no public certificates are provided, `data` will be the full PDF content,
 * and the function should compute the hash using the given algorithm and standard.
 *
 * @param {Uint8Array} data - Either a 256-byte hash or the full PDF data, depending on the signing setup.
 * @param {Object} options - Signing options.
 * @param {DigestAlgorithm} options.algorithm - The digest algorithm to use.
 * @param {CryptographicStandard} options.cryptographicStandard - The cryptographic standard.
 * @returns {{ signedData: Uint8Array, timestampData?: Uint8Array } | void}
 */
export type ExternalSignatureCallback = (
    data: Uint8Array,
    options: {
        algorithm: DigestAlgorithm,
        cryptographicStandard: CryptographicStandard
    }
) => {signedData: Uint8Array, timestampData?: Uint8Array} | void;
