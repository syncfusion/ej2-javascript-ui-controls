import { _PdfMessageDigestAlgorithms } from './pdf-digest-algorithms';
import { _ICipherParam, _ISigner } from './pdf-interfaces';
import { _PdfSignerUtilities } from './signature-utilities';
/**
 * Provides internal utilities for performing hash selection, key validation,
 * and RSA-based signing operations using supported digest algorithms.
 *
 * @private
 */
export class _PdfSignaturePrivateKey {
    private _key: _ICipherParam;
    private _hashAlgorithm: string;
    private _encryptionAlgorithm: string;
    constructor(hashAlgorithm: string, key?: _ICipherParam) {
        this._key = key;
        const alg: _PdfMessageDigestAlgorithms = new _PdfMessageDigestAlgorithms();
        const allowedDigest: string = alg._getAllowedDigests(hashAlgorithm);
        this._hashAlgorithm = alg._getDigest(allowedDigest);
        if (!key || this._isRonCipherKey(key)) {
            this._encryptionAlgorithm = 'RSA';
        } else {
            throw new Error('Invalid key type');
        }
    }
    /**
     * Determines whether the provided key is a valid RSA (Ron cipher) private key.
     *
     * @private
     * @param {_ICipherParam} key The key to inspect for RSA-compatible fields.
     * @returns {boolean} True if the key includes both 'modulus' and 'privateExponent'; otherwise, false.
     */
    _isRonCipherKey(key: _ICipherParam): boolean {
        return 'modulus' in key && 'privateExponent' in key;
    }
    /**
     * Generates a digital signature for the given byte data using the selected
     * digest and RSA encryption algorithm.
     *
     * @private
     * @param {Uint8Array} bytes The input byte sequence to sign.
     * @returns {Uint8Array} The generated signature, or null if an error occurs.
     */
    _sign(bytes: Uint8Array): Uint8Array {
        try {
            const signMode: string = `${this._hashAlgorithm}with${this._encryptionAlgorithm}`;
            const util: _PdfSignerUtilities = new _PdfSignerUtilities();
            const signer: _ISigner = util._getSigner(signMode);
            signer._initialize(true, this._key);
            signer._blockUpdate(bytes, 0, bytes.length);
            return signer._generateSignature();
        } catch (error) {
            return null;
        }
    }
    /**
     * Gets the internal hash algorithm associated with this signing key.
     *
     * @private
     * @returns {string} The normalized hash algorithm name (e.g., "SHA1", "SHA256").
     */
    _getHashAlgorithm(): string {
        return this._hashAlgorithm;
    }
    /**
     * Gets the internal encryption algorithm used for signature generation.
     *
     * @private
     * @returns {string} The encryption algorithm name (e.g., "RSA").
     */
    _getEncryptionAlgorithm(): string {
        return this._encryptionAlgorithm;
    }
}
