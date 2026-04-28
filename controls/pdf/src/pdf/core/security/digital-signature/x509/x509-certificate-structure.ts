import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
import { _PdfSignedCertificate } from './x509-signed-certificate';
/**
 * Representation of the top-level X.509 certificate structure (tbsCertificate + signature).
 *
 * @private
 */
export class _PdfX509CertificateStructure {
    /**
     * The parsed ToBeSigned certificate component.
     *
     * @private
     * @type {_PdfSignedCertificate}
     */
    _toBeSignedCertificate: _PdfSignedCertificate;
    /**
     * Algorithm identifier used for the certificate signature.
     *
     * @private
     * @type {_PdfAlgorithms}
     */
    _signatureAlgorithmIdentifier: _PdfAlgorithms;
    /**
     * Raw signature BIT STRING for the certificate.
     *
     * @private
     * @type {_PdfUniqueBitString}
     */
    _signature: _PdfUniqueBitString;
    /**
     * Underlying ASN.1 sequence elements representing the certificate.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement[]}
     */
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
    /**
     * Return the parsed `ToBeSigned` certificate wrapper.
     *
     * @private
     * @returns {_PdfSignedCertificate} The signed certificate component.
     */
    _getSignedCertificate(): _PdfSignedCertificate {
        return this._toBeSignedCertificate;
    }
    /**
     * Construct an instance from an ASN.1 sequence array if valid.
     *
     * @private
     * @param {any} obj - Candidate sequence array.
     * @returns {_PdfX509CertificateStructure} New structure instance or null.
     */
    _getInstance(obj: any): _PdfX509CertificateStructure{ // eslint-disable-line
        if (Array.isArray(obj) && obj.every((e: _PdfAbstractSyntaxElement) => e instanceof _PdfAbstractSyntaxElement)) {
            const seq: _PdfAbstractSyntaxElement[] = obj;
            return new _PdfX509CertificateStructure(seq);
        }
        return null;
    }
    /**
     * Produce DER encoded bytes for the entire certificate structure.
     *
     * @private
     * @returns {Uint8Array} DER-encoded certificate bytes.
     */
    _getDerEncoded(): Uint8Array {
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        der._setTagNumber(_UniversalType.sequence);
        der._setSequence(this._sequence);
        return der._toBytes();
    }
}
