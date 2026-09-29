import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
import { _PdfSignedCertificate } from './x509-signed-certificate';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
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
    _signatureBytes: Uint8Array;
    constructor(seq?: _PdfAbstractSyntaxElement[]) {
        if (seq) {
            this._applySequence(seq);
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
    /**
     * Gets the object identifier (OID) of the certificate signature algorithm.
     *
     * @returns {string} The signature algorithm OID; otherwise, an empty string if the OID is unavailable.
     * @private
     */
    _getSignatureAlgorithmOid(): string {
        const oid: _PdfObjectIdentifier = (this._signatureAlgorithmIdentifier as any)._objectID; //eslint-disable-line
        return (oid && typeof oid.toString === 'function') ? oid.toString() : '';
    }
    /**
     * Gets the certificate signature value.
     *
     * @returns {Uint8Array} The certificate signature bytes.
     * @private
     */
    _getSignatureValue(): Uint8Array {
        return new Uint8Array(this._signatureBytes ? this._signatureBytes : []);
    }
    /**
     * Initializes the certificate structure from the specified ASN.1 certificate sequence.
     *
     * @param {_PdfAbstractSyntaxElement[]} seq The ASN.1 sequence representing the X.509 certificate.
     * @returns {void}
     * @throws {Error} Thrown when the certificate sequence is invalid.
     * @private
     */
    private _applySequence(seq: _PdfAbstractSyntaxElement[]): void {
        if (!Array.isArray(seq) || seq.length !== 3) {
            throw new Error(`Invalid certificate sequence length: ${seq.length}`);
        }
        this._sequence = seq;
        this._toBeSignedCertificate = new _PdfSignedCertificate(seq[0]);
        this._signatureAlgorithmIdentifier = new _PdfAlgorithms(seq[1]);
        const rawBitString: Uint8Array = seq[2]._getValue();
        let signatureBytes: Uint8Array = new Uint8Array(0);
        if (rawBitString && rawBitString.length >= 1) {
            signatureBytes = rawBitString.subarray(1);
        }
        this._signatureBytes = signatureBytes;
        this._signature = new _PdfUniqueBitString(rawBitString);
    }
    /**
     * Loads the certificate structure from DER-encoded X.509 certificate data.
     *
     * @param {Uint8Array} der The DER-encoded certificate bytes.
     * @returns {_PdfX509CertificateStructure} The current certificate structure instance.
     * @throws {Error} Thrown when the DER data is invalid or the certificate format is malformed.
     * @private
     */
    _fromDer(der: Uint8Array): _PdfX509CertificateStructure {
        if (!(der instanceof Uint8Array) || der.length === 0) {
            throw new Error('Invalid DER input for X.509 certificate.');
        }
        const top: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        top._fromBytes(der);
        const seq: _PdfAbstractSyntaxElement[] | null = top._getSequence();
        if (!seq || seq.length !== 3) {
            throw new Error('Malformed X.509 certificate: top-level is not a 3-element SEQUENCE.');
        }
        this._applySequence(seq);
        return this;
    }
}
