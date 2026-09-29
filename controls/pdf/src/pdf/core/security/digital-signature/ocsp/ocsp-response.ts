import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfX509Extensions } from '../x509/x509-extensions';
import { _PdfX509Name } from '../x509/x509-name';
import { _PdfRevocationResponse } from './ocsp-response-model';
import { _PdfOcspHelper } from './ocsp-response-utils';
/**
 * Represents an OCSP response structure.
 *
 * @private
 */
export class _PdfOcspResponse {
    /**
     * OCSP response status value.
     *
     * @private
     */
    private responseStatus: Uint8Array;
    /**
     * Optional response bytes containing the encoded OCSP response data.
     *
     * @private
     */
    private responseBytes: _PdfRevocationResponseBytes;
    /**
     * Initializes a new instance of the `_PdfOcspResponse` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing an OCSPResponse.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
            this.responseStatus = elements[0]._getValue();
            if (elements.length === 2) {
                const responseBytes: _PdfRevocationResponseBytes = new _PdfRevocationResponseBytes();
                this.responseBytes = responseBytes._getResponseBytes(elements[1]);
            }
        }
    }
    /**
     * Gets the OCSP response status value.
     *
     * @returns {Uint8Array} Response status encoded as a byte array.
     */
    get _responseStatus(): Uint8Array {
        return this.responseStatus;
    }
    /**
     * Gets the OCSP response bytes containing revocation information.
     *
     * @returns {_PdfRevocationResponseBytes} Parsed response bytes.
     */
    get _responseBytes(): _PdfRevocationResponseBytes {
        return this.responseBytes;
    }
}
/**
 * Provides a high-level helper for parsing and interpreting an OCSP response.
 *
 * @private
 */
export class _PdfOcspResponseHelper {
    /**
     * Parsed OCSP response object.
     *
     * @private
     */
    private _response: _PdfOcspResponse;
    /**
     * Initializes a new instance of the `_PdfOcspResponseHelper` class.
     *
     * @private
     * @param {Uint8Array} input Raw OCSP response bytes.
     */
    constructor(input: Uint8Array) {
        const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        el._fromBytes(input);
        this._response = new _PdfOcspResponse(el);
    }
    /**
     * Gets the numeric OCSP response status.
     *
     * @returns {number} OCSP response status code.
     */
    get _status(): number {
        if (this._response && this._response._responseStatus && this._response._responseStatus.length === 1) {
            return this._response._responseStatus[0];
        } else {
            return -1;
        }
    }
    /**
     * Resolves the embedded OCSP response object.
     *
     * @private
     * @returns {*} Parsed revocation response object, raw response data, or null.
     */
    _getResponseObject(): any { // eslint-disable-line
        const bytes: _PdfRevocationResponseBytes = this._response._responseBytes;
        if (!bytes) {
            return null;
        }
        if (bytes._responseType._getDotDelimitedNotation() === '1.3.6.1.5.5.7.48.1.1') {
            const structure: _PdfOcspHelper = new _PdfOcspHelper();
            const tbsElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            tbsElement._fromBytes(bytes._response._getValue());
            return new _PdfRevocationResponse(structure._getOcspStructure(tbsElement));
        }
        return bytes._response;
    }
}
/**
 * Represents the ResponseBytes structure within an OCSP response.
 *
 * @private
 */
export class _PdfRevocationResponseBytes {
    /**
     * Object identifier specifying the type of the OCSP response.
     *
     * @private
     */
    private responseType: _PdfObjectIdentifier;
    /**
     * ASN.1 element containing the encoded response data.
     *
     * @private
     */
    private response: _PdfAbstractSyntaxElement;
    /**
     * Initializes a new instance of the `_PdfRevocationResponseBytes` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 element representing ResponseBytes.
     * @throws {Error} Throws an error if the sequence does not contain exactly two elements.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement = sequence._getInner();
            const elements1: _PdfAbstractSyntaxElement[] = elements._getSequence();
            if (elements1.length !== 2) {
                throw new Error('Invalid length in sequence');
            }
            this.responseType = new _PdfObjectIdentifier()._fromBytes(elements1[0]._getValue());
            this.response = elements1[1];
        }
    }
    /**
     * Gets the object identifier of the response type.
     *
     * @returns {_PdfObjectIdentifier} Response type object identifier.
     */
    get _responseType(): _PdfObjectIdentifier {
        return this.responseType;
    }
    /**
     * Gets the ASN.1 encoded response payload.
     *
     * @returns {_PdfAbstractSyntaxElement} Encoded response element.
     */
    get _response(): _PdfAbstractSyntaxElement {
        return this.response;
    }
    /**
     * Resolves a `_PdfRevocationResponseBytes` instance from the given object.
     *
     * @private
     * @param {*} object Object to resolve as ResponseBytes.
     * @returns {_PdfRevocationResponseBytes} Parsed response bytes instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getResponseBytes(object: any): _PdfRevocationResponseBytes { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfRevocationResponseBytes) {
            return object as _PdfRevocationResponseBytes;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationResponseBytes(object as _PdfAbstractSyntaxElement);
        }
        throw new Error('Invalid entry in sequence');
    }
}
/**
 * Represents the responder identifier used in an OCSP revocation response.
 *
 * @private
 */
export class _PdfRevocationResponseIdentifier {
    /**
     * ASN.1 element representing the responder identifier.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement}
     */
    private _id: _PdfAbstractSyntaxElement;
    /**
     * Initializes a new instance of the `_PdfRevocationResponseIdentifier` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement | _PdfX509Name} [id] Responder identifier value.
     */
    constructor(id?: _PdfAbstractSyntaxElement | _PdfX509Name) {
        if (id instanceof _PdfAbstractSyntaxElement) {
            this._id = id;
        }
    }
    /**
     * Resolves a `_PdfRevocationResponseIdentifier` instance from the given object.
     *
     * @private
     * @param {*} object Object representing a responder identifier.
     * @returns {_PdfRevocationResponseIdentifier} Resolved responder identifier instance.
     */
    _getResponseID(object: any): _PdfRevocationResponseIdentifier { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfRevocationResponseIdentifier) {
            return object as _PdfRevocationResponseIdentifier;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationResponseIdentifier(object as _PdfAbstractSyntaxElement);
        }
        return new _PdfRevocationResponseIdentifier(new _PdfX509Name(object));
    }
    /**
     * Gets the ASN.1 representation of the responder identifier.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded responder identifier.
     */
    _getasn1(): _PdfAbstractSyntaxElement {
        return this._id;
    }
}
/**
 * Represents the ResponseData (tbsResponseData) structure of an OCSP response.
 *
 * @private
 */
export class _PdfResponseInformation {
    /**
     * Default OCSP response version value (v1).
     *
     * @private
     */
    private _version1: number = 0
    /**
     * Indicates whether the version field is explicitly present.
     *
     * @private
     */;
    private _versionPresent: boolean = false;
    /**
     * Parsed OCSP response version.
     *
     * @private
     */
    private _version: number;
    /**
     * Identifier of the OCSP responder (byName or byKey).
     *
     * @private
     */
    private _responderIdentifier: _PdfRevocationResponseIdentifier;
    /**
     * Time at which the OCSP response was produced.
     *
     * @private
     */
    private _producedTime: _PdfAbstractSyntaxElement;
    /**
     * ASN.1 sequence containing the individual certificate response entries.
     *
     * @private
     */
    private sequence: _PdfAbstractSyntaxElement;
    /**
     * Optional X.509 extensions associated with the OCSP response.
     *
     * @private
     */
    private _responseExtensions: _PdfX509Extensions;
    /**
     * Initializes a new instance of the `_PdfResponseInformation` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing ResponseData.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
            let index: number = 0;
            const encode: _PdfAbstractSyntaxElement = elements[0];
            if (encode instanceof _PdfUniqueEncodingElement) {
                const tag: _PdfAbstractSyntaxElement = encode as _PdfUniqueEncodingElement;
                if (tag._getTagNumber() === 0) {
                    this._versionPresent = true;
                    this._version = tag._getTagNumber();
                    index++;
                } else {
                    this._version = this._version1;
                }
            } else {
                this._version = this._version1;
            }
            const id: _PdfRevocationResponseIdentifier = new _PdfRevocationResponseIdentifier();
            this._responderIdentifier = id._getResponseID(elements[<number>index++]);
            this._producedTime = elements[<number>index++];
            this.sequence = elements[<number>index++];
            if (elements.length > index) {
                this._responseExtensions = new _PdfX509Extensions()._getInstance(elements[<number>index]);
            }
        }
    }
    /**
     * Gets the ASN.1 sequence containing the certificate response entries.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 sequence of response entries.
     */
    get _sequence(): _PdfAbstractSyntaxElement {
        return this.sequence;
    }
    /**
     * Resolves a `_PdfResponseInformation` instance from the given object.
     *
     * @private
     * @param {*} object Object representing ResponseData.
     * @returns {_PdfResponseInformation} Parsed response information instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getInformation(object: any): _PdfResponseInformation { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfResponseInformation) {
            return object as _PdfResponseInformation;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfResponseInformation(object as _PdfAbstractSyntaxElement);
        }
        throw new Error('Invalid entry in sequence');
    }
    /**
     * Serializes the response information into its ASN.1 representation.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded ResponseData element.
     */
    _getAsn1(): _PdfAbstractSyntaxElement {
        const sequences: _PdfAbstractSyntaxElement[] = [];
        if (this._versionPresent || !(this._version === this._version1)) {
            const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.integer
            );
            el._setInteger(this._version);
            const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
                _TagClassType.context,
                _ConstructionType.constructed,
                0
            );
            outerSequence._setSequence([el]);
            sequences.push(outerSequence);
        }
        sequences.push(this._responderIdentifier._getasn1());
        sequences.push(this._producedTime);
        sequences.push(this._sequence);
        if (this._responseExtensions) {
            sequences.push(this._responseExtensions._getAsn1());
        }
        const outerSequence: _PdfAbstractSyntaxElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence(sequences);
        return outerSequence;
    }
}
