import { _Sha1 } from '../encryptors/secureHash-algorithm1';
import { _PdfPublicKeyInformation } from './x509/x509-certificate-key';
/**
 * Helper that computes and stores a subject key identifier (SHA-1 of the public key).
 *
 * @private
 */
export class _PdfSubjectKeyIdentifier {
    /**
     * Raw key identifier bytes (SHA-1 digest of subject public key).
     *
     * @private
     * @type {Uint8Array}
     */
    _bytes: Uint8Array;
    constructor(info: _PdfPublicKeyInformation) {
        this._bytes = this._generateKeyID(info);
    }
    /**
     * Compute the key identifier as SHA-1 over the subject public key bytes.
     *
     * @private
     * @param {_PdfPublicKeyInformation} info - Subject public key information.
     * @returns {Uint8Array} SHA-1 digest bytes representing the key identifier.
     */
    _generateKeyID(info: _PdfPublicKeyInformation): Uint8Array {
        const sha1: _Sha1 = new _Sha1();
        const publicKeyBytes: Uint8Array = info._publicKey._data;
        return sha1._hash(publicKeyBytes, 0, publicKeyBytes.length);
    }
}
