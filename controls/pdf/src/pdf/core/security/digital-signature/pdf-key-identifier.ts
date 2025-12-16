import { _Sha1 } from '../encryptors/secureHash-algorithm1';
import { _PdfPublicKeyInformation } from './x509/x509-certificate-key';
export class _PdfSubjectKeyIdentifier {
    _bytes: Uint8Array;
    constructor(info: _PdfPublicKeyInformation) {
        this._bytes = this._generateKeyID(info);
    }
    _generateKeyID(info: _PdfPublicKeyInformation): Uint8Array {
        const sha1: _Sha1 = new _Sha1();
        const publicKeyBytes: Uint8Array = info._publicKey._data;
        return sha1._hash(publicKeyBytes, 0, publicKeyBytes.length);
    }
}
