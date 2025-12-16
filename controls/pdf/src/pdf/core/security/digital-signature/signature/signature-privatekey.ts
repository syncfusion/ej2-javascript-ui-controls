import { _PdfMessageDigestAlgorithms } from './pdf-digest-algorithms';
import { _ICipherParam, _ISigner } from './pdf-interfaces';
import { _PdfSignerUtilities } from './signature-utilities';
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
    _isRonCipherKey(key: _ICipherParam): boolean {
        return 'modulus' in key && 'privateExponent' in key;
    }
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
    _getHashAlgorithm(): string {
        return this._hashAlgorithm;
    }
    _getEncryptionAlgorithm(): string {
        return this._encryptionAlgorithm;
    }
}
