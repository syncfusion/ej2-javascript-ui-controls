import { _createAsn1Constructed, _createPrimitive, _encodeObjectIdentifier } from '../../../utils';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from '../x509/x509-algorithm';
import { _PdfResponseInformation } from './ocsp-response';
/**
 * Represents an OCSP response helper that parses and exposes
 * core OCSP response components such as response information,
 * signature algorithms, signature value, and optional certificates.
 *
 * @private
 */
export class _PdfOcspHelper {
    /**
     * Parsed OCSP response information (ResponseData).
     *
     * @private
     */
    private responseInformation: _PdfResponseInformation;
    /**
     * Signature algorithm identifiers used to sign the OCSP response.
     *
     * @private
     */
    private algorithms: _PdfAlgorithms;
    /**
     * ASN.1 element representing the signature value.
     *
     * @private
     */
    private signature: _PdfAbstractSyntaxElement;
    /**
     * Optional ASN.1 sequence containing additional certificates
     * included with the OCSP response.
     *
     * @private
     */
    private sequence: _PdfAbstractSyntaxElement;
    /**
     * Initializes a new instance of the `_PdfOcspHelper` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing the OCSP response.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
            const information: _PdfResponseInformation = new _PdfResponseInformation();
            this.responseInformation = information._getInformation(elements[0]);
            this.algorithms = new _PdfAlgorithms()._getAlgorithms(elements[1]);
            this.signature = elements[2];
            if (elements.length > 3) {
                this.sequence = elements[3]._getInner();
            }
        } else {
            this.responseInformation = new _PdfResponseInformation();
            this.algorithms = new _PdfAlgorithms();
        }
    }
    /**
     * Gets the parsed OCSP response information.
     *
     * @private
     * @returns {_PdfResponseInformation} The OCSP response information.
     */
    get _responseInformation(): _PdfResponseInformation {
        return this.responseInformation;
    }
    /**
     * Gets the optional ASN.1 sequence of certificates embedded in the OCSP response.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} The embedded certificate sequence, or undefined.
     */
    get _embeddedCertificates(): _PdfAbstractSyntaxElement {
        return this.sequence;
    }
    /**
     * Resolves an OCSP helper instance from the given ASN.1 object.
     *
     * @private
     * @param {*} object ASN.1 object representing an OCSP response structure.
     * @returns {_PdfOcspHelper} Parsed OCSP helper instance.
     * @throws {Error} Throws an error if the object is not a valid ASN.1 entry.
     */
    _getOcspStructure(object: any): _PdfOcspHelper { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfOcspHelper(object);
        }
        throw new Error('Invalid entry in sequence');
    }
    /**
     * Serializes the OCSP response into its ASN.1 representation.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded OCSP response.
     */
    _getAsn1(): _PdfAbstractSyntaxElement {
        const digestAlgorithms: _PdfAbstractSyntaxElement[] = [];
        digestAlgorithms.push(this.responseInformation._getAsn1());
        const algorithmOid: string = this.algorithms._objectID._getDotDelimitedNotation();
        const oidEl: _PdfUniqueEncodingElement = _createPrimitive(_UniversalType.objectIdentifier,
                                                                  _encodeObjectIdentifier(algorithmOid));
        const nullEl: _PdfUniqueEncodingElement = _createPrimitive(_UniversalType.nullValue, new Uint8Array(0));
        digestAlgorithms.push(_createAsn1Constructed(_UniversalType.sequence, [oidEl, nullEl]));
        digestAlgorithms.push(this.signature);
        if (this.sequence) {
            const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
                _TagClassType.context,
                _ConstructionType.constructed,
                0
            );
            outerSequence._setSequence([this.sequence]);
            digestAlgorithms.push(outerSequence);
        }
        const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence(digestAlgorithms);
        return outerSequence;
    }
}
/**
 * Represents an ASN.1 GeneralizedTime value used in X.509 and OCSP structures.
 *
 * @private
 */
export class _PdfGeneralizedTime {
    /**
     * GeneralizedTime value represented as an ASCII string.
     *
     * @private
     * @type {string}
     */
    private _time: string;
    /**
     * Initializes a new instance of the `_PdfGeneralizedTime` class.
     *
     * @private
     * @param {Uint8Array} [bytes] Encoded GeneralizedTime value.
     */
    constructor(bytes?: Uint8Array) {
        if (bytes) {
            this._time = this._bytesToAscii(bytes);
        }
    }
    /**
     * Extracts and parses a GeneralizedTime value from an ASN.1 tag.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} tag ASN.1 element containing the time value.
     * @param {boolean} isExplicit Indicates whether the tag is explicitly encoded.
     * @returns {_PdfGeneralizedTime} Parsed GeneralizedTime helper instance.
     */
    _getGeneralizedTimeFromTag(tag: _PdfAbstractSyntaxElement, isExplicit: boolean): _PdfGeneralizedTime {
        const asn1: _PdfAbstractSyntaxElement = isExplicit ? tag._getInner() : tag;
        if (asn1 && asn1._getTagNumber && asn1._getTagNumber() === _UniversalType.dateTime) {
            return new _PdfGeneralizedTime(asn1._getValue());
        }
        try {
            const octets: Uint8Array = asn1._getOctetString();
            return new _PdfGeneralizedTime(octets);
        } catch {
            return new _PdfGeneralizedTime(asn1._getValue());
        }
    }
    /**
     * Converts a byte array into its ASCII string representation.
     *
     * @private
     * @param {Uint8Array} bytes Byte array to convert.
     * @returns {string} ASCII string representation.
     */
    private _bytesToAscii(bytes: Uint8Array): string {
        let s: string = '';
        for (let i: number = 0; i < bytes.length; i++) {
            s += String.fromCharCode(bytes[<number>i]);
        }
        return s;
    }
    /**
     * Gets the raw time string value.
     *
     * @private
     * @returns {string} GeneralizedTime ASCII string.
     */
    get _timeValue(): string {
        return this._time;
    }
    /**
     * Converts the GeneralizedTime string into a JavaScript Date object (UTC).
     *
     * @private
     * @returns {Date} Parsed Date or undefined if parsing fails.
     */
    _toDate(): Date {
        if (!this._time) {
            return undefined;
        }
        let m: any = this._time.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\.\d+)?Z$/); // eslint-disable-line
        if (m) {
            return new Date(Date.UTC(
                parseInt(m[1], 10),
                parseInt(m[2], 10) - 1,
                parseInt(m[3], 10),
                parseInt(m[4], 10),
                parseInt(m[5], 10),
                parseInt(m[6], 10)
            ));
        }
        m = this._time.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
        if (m) {
            let year: number = parseInt(m[1], 10);
            year += (year < 50) ? 2000 : 1900;
            return new Date(Date.UTC(
                year,
                parseInt(m[2], 10) - 1,
                parseInt(m[3], 10),
                parseInt(m[4], 10),
                parseInt(m[5], 10),
                parseInt(m[6], 10)
            ));
        }
        return undefined;
    }
}
