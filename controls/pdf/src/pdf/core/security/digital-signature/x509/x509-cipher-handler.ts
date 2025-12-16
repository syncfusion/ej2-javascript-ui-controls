export abstract class _PdfCipherParameter {
    _isPrivate: boolean;
    constructor(isPrivate: boolean) {
        this._isPrivate = isPrivate;
    }
}
export class _PdfRonCipherParameter extends _PdfCipherParameter {
    _modulus: Uint8Array;
    _exponent: Uint8Array;
    constructor(isPrivate: boolean, modulus: Uint8Array, exponent: Uint8Array) {
        super(isPrivate);
        this._modulus = modulus;
        this._exponent = exponent;
    }
}
