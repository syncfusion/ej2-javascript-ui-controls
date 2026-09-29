import { _isByteArrayEqual, _hashBytes, _trimInteger } from '../../../utils';
import { _ICipherParam } from './pdf-interfaces';
/**
 * Represents an RSA public key parameter used for cryptographic operations.
 *
 * @private
 */
export class _PdfRsaPublicKeyParam implements _ICipherParam {
    /**
     * Gets the RSA modulus.
     */
    public readonly _modulus: Uint8Array;
    /**
     * Gets the RSA public exponent.
     */
    public readonly _exponent: Uint8Array;
    /**
     * Indicates whether the key represents a private key.
     *
     * @private
     */
    _isPrivate: boolean;
    /**
     * Indicates whether certification verification is enabled for the key.
     *
     * @private
     */
    _enableCertificationVerification: boolean = false;
    /**
     * Initializes a new instance of the _PdfRsaPublicKeyParam class.
     *
     * @param {Uint8Array} modulus The RSA modulus.
     * @param {Uint8Array} exponent The RSA public exponent.
     * @private
     */
    constructor(modulus: Uint8Array, exponent: Uint8Array) {
        this._modulus = _trimInteger(modulus ? modulus : new Uint8Array(0));
        this._exponent = _trimInteger(exponent ? exponent : new Uint8Array(0));
        this._isPrivate = true;
    }
    /**
     * Determines whether the specified key parameter is equal to the current instance.
     *
     * @param {any} other The object to compare with the current instance.
     * @returns {boolean} true if the key parameters are equal; otherwise, false.
     * @private
     */
    _equals(other: any): boolean { // eslint-disable-line
        const o: any = other; // eslint-disable-line
        let om: Uint8Array;
        if (o && o.modulus) {
            om = o.modulus;
        } else if (o && o._modulus) {
            om = o._modulus;
        } else {
            om = new Uint8Array(0);
        }
        let oe: Uint8Array;
        if (o && o.exponent) {
            oe = o.exponent;
        } else if (o && o._exponent) {
            oe = o._exponent;
        } else {
            oe = new Uint8Array(0);
        }
        return _isByteArrayEqual(this._modulus, om) && _isByteArrayEqual(this._exponent, oe);
    }
    /**
     * Computes a hash code for the current key parameter.
     *
     * @returns {number} The computed hash code.
     * @private
     */
    _getHashCode(): number {
        const combined: Uint8Array = new Uint8Array(this._modulus.length + this._exponent.length);
        combined.set(this._modulus, 0);
        combined.set(this._exponent, this._modulus.length);
        return _hashBytes(combined);
    }
}
