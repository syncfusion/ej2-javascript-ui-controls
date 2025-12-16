import { _PdfPublicKeyCryptographyCertificate } from './pdf-cryptography-certificate';
import { _PdfCipherParameter } from './x509/x509-cipher-handler';
export class _PdfCertificateIdentifier {
    _identifier: Uint8Array;
    constructor(params: { pubicKey?: _PdfCipherParameter; id?: Uint8Array }) {
        if (params.pubicKey && params.id) {
            this._identifier = new _PdfPublicKeyCryptographyCertificate()._createSubjectKeyID(params.pubicKey, params.id)._bytes;
        } else if (params.id) {
            this._identifier = params.id;
        }
    }
    equals(other: any): boolean { // eslint-disable-line
        if (!(other instanceof _PdfCertificateIdentifier)) {
            return false;
        }
        if (!this._identifier || !other._identifier || this._identifier.length !== other._identifier.length) {
            return false;
        }
        for (let i: number = 0; i < this._identifier.length; i++) {
            if (this._identifier[<number>i] !== other._identifier[<number>i]) {
                return false;
            }
        }
        return true;
    }
    _getHashCode(): number {
        if (!this._identifier) {
            return 0;
        }
        let hash: number = 0;
        for (let i: number = 0; i < this._identifier.length; i++) {
            const byte: number = this._identifier[<number>i];
            hash = ((hash << 5) - hash) + byte;
            hash |= 0;
        }
        return hash;
    }
}
