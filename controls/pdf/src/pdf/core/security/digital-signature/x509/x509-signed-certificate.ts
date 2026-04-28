import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
import { _PdfPublicKeyInformation } from './x509-certificate-key';
import { _PdfX509Extensions } from './x509-extensions';
import { _PdfX509Name } from './x509-name';
import { _PdfX509Time } from './x509-time';
/**
 * Parsed representation of an X.509 signed certificate (tbsCertificate + signature metadata).
 *
 * @private
 */
export class _PdfSignedCertificate {
    /**
     * Raw ASN.1 sequence elements composing the certificate.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement[]}
     */
    _sequence: _PdfAbstractSyntaxElement[];
    /**
     * Numeric certificate version (0-based internally, exposed via _getVersion).
     *
     * @private
     * @type {number}
     */
    _version: number;
    /**
     * Certificate serial number as raw bytes.
     *
     * @private
     * @type {Uint8Array}
     */
    _serialNumber: Uint8Array;
    /**
     * Signature algorithm identifier for this certificate.
     *
     * @private
     * @type {_PdfAlgorithms}
     */
    _signature: _PdfAlgorithms;
    /**
     * Issuer distinguished name.
     *
     * @private
     * @type {_PdfX509Name}
     */
    _issuer: _PdfX509Name;
    /**
     * Validity start time.
     *
     * @private
     * @type {_PdfX509Time}
     */
    _startDate: _PdfX509Time;
    /**
     * Validity end time.
     *
     * @private
     * @type {_PdfX509Time}
     */
    _endDate: _PdfX509Time;
    /**
     * Subject distinguished name.
     *
     * @private
     * @type {_PdfX509Name}
     */
    _subject: _PdfX509Name;
    /**
     * Subject public key information.
     *
     * @private
     * @type {_PdfPublicKeyInformation}
     */
    _publicKeyInformation: _PdfPublicKeyInformation;
    /**
     * Optional issuer unique ID bit string.
     *
     * @private
     * @type {_PdfUniqueBitString|undefined}
     */
    _issuerID?: _PdfUniqueBitString;
    /**
     * Optional subject unique ID bit string.
     *
     * @private
     * @type {_PdfUniqueBitString|undefined}
     */
    _subjectID?: _PdfUniqueBitString;
    /**
     * Optional certificate extensions container.
     *
     * @private
     * @type {_PdfX509Extensions|undefined}
     */
    _extensions?: _PdfX509Extensions;
    constructor(sequenceElement: _PdfAbstractSyntaxElement) {
        this._sequence = sequenceElement._getSequence();
        let seqStart: number = 0;
        if (this._sequence[0]._getTagNumber() === 0 && this._sequence[0]._tagClass === 2) {
            this._version = 2;
        } else {
            seqStart = -1;
            this._version = 0;
        }
        this._serialNumber = this._sequence[seqStart + 1]._getValue();
        this._signature = new _PdfAlgorithms(this._sequence[seqStart + 2]);
        this._issuer = new _PdfX509Name(this._sequence[seqStart + 3]._getSequence());
        const dates: _PdfAbstractSyntaxElement[] = this._sequence[seqStart + 4]._getSequence();
        this._startDate = new _PdfX509Time(dates[0]);
        this._endDate = new _PdfX509Time(dates[1]);
        this._subject = new _PdfX509Name(this._sequence[seqStart + 5]._getSequence());
        this._publicKeyInformation = new _PdfPublicKeyInformation()._getPublicKeyInformation(
            this._sequence[seqStart + 6]
        );
        const base: number = seqStart + 6;
        for (let i: number = this._sequence.length - 1; i > base; i--) {
            const extra: _PdfAbstractSyntaxElement = this._sequence[<number>i];
            const derString: _PdfUniqueBitString = new _PdfUniqueBitString();
            switch (extra._getTagNumber()) {
            case 1:
                this._issuerID = derString._getUniqueBitStringFromTag(extra, false);
                break;
            case 2:
                this._subjectID = derString._getUniqueBitStringFromTag(extra, false);
                break;
            case 3:
                this._extensions = new _PdfX509Extensions()._getInstance(extra);
                break;
            }
        }
    }
    /**
     * Get the human-readable certificate version (1,2,3...).
     *
     * @private
     * @returns {number} The certificate version number.
     */
    _getVersion(): number {
        return this._version + 1;
    }
    /**
     * Return the DER-encoded bytes that represent this entire certificate.
     *
     * @private
     * @returns {Uint8Array} DER-encoded certificate bytes.
     */
    _getDistinguishEncoded(): Uint8Array {
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        der._setTagNumber(_UniversalType.sequence);
        der._setSequence(this._sequence);
        return der._toBytes();
    }
}
