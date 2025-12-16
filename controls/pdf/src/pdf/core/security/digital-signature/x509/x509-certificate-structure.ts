import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
import { _PdfSignedCertificate } from './x509-signed-certificate';
export class _PdfX509CertificateStructure {
    _toBeSignedCertificate: _PdfSignedCertificate;
    _signatureAlgorithmIdentifier: _PdfAlgorithms;
    _signature: _PdfUniqueBitString;
    _sequence: _PdfAbstractSyntaxElement[];
    constructor(seq?: _PdfAbstractSyntaxElement[]) {
        if (seq) {
            if (!Array.isArray(seq) || seq.length !== 3) {
                throw new Error(`Invalid certificate sequence length: ${seq.length}`);
            }
            this._sequence = seq;
            this._toBeSignedCertificate = new _PdfSignedCertificate(seq[0]);
            this._signatureAlgorithmIdentifier = new _PdfAlgorithms(seq[1]);
            this._signature = new _PdfUniqueBitString(seq[2]._getValue());
        }
    }
    _getSignedCertificate(): _PdfSignedCertificate {
        return this._toBeSignedCertificate;
    }
    _getInstance(obj: any): _PdfX509CertificateStructure{ // eslint-disable-line
        if (Array.isArray(obj) && obj.every((e: _PdfAbstractSyntaxElement) => e instanceof _PdfAbstractSyntaxElement)) {
            const seq: _PdfAbstractSyntaxElement[] = obj;
            return new _PdfX509CertificateStructure(seq);
        }
        return null;
    }
    _getDerEncoded(): Uint8Array {
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        der._setTagNumber(_UniversalType.sequence);
        der._setSequence(this._sequence);
        return der._toBytes();
    }
}
