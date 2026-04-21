/**
 * Base class representing cipher parameter metadata (e.g., whether key is private).
 *
 * @private
 */
export abstract class _PdfCipherParameter {
    /**
     * Indicates whether the underlying key material is private.
     *
     * @private
     * @type {boolean}
     */
    _isPrivate: boolean;
    constructor(isPrivate: boolean) {
        this._isPrivate = isPrivate;
    }
}
export class _PdfRonCipherParameter extends _PdfCipherParameter {
    /**
     * RSA modulus bytes.
     *
     * @private
     * @type {Uint8Array}
     */
    _modulus: Uint8Array;
    /**
     * RSA public exponent bytes.
     *
     * @private
     * @type {Uint8Array}
     */
    _exponent: Uint8Array;
    constructor(isPrivate: boolean, modulus: Uint8Array, exponent: Uint8Array) {
        super(isPrivate);
        this._modulus = modulus;
        this._exponent = exponent;
    }
}
