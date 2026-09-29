import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfGeneralizedTime, _PdfOcspHelper } from './ocsp-response-utils';
/**
 * Represents an OCSP revocation response.
 *
 * @private
 */
export declare class _PdfRevocationResponse {
    /**
     * OCSP helper used to process the response.
     *
     * @private
     */
    private _helper;
    /**
     * Parsed response information.
     *
     * @private
     */
    private _data;
    /**
     * Initializes a new instance of the `_PdfRevocationResponse` class.
     *
     * @private
     * @param {_PdfOcspHelper} helper OCSP helper containing response data.
     */
    constructor(helper: _PdfOcspHelper);
    /**
     * Gets the encoded OCSP response bytes.
     *
     * @private
     * @returns {Uint8Array} ASN.1 encoded OCSP response.
     */
    readonly _encodedBytes: Uint8Array;
    /**
     * Gets the collection of one‑time OCSP responses.
     *
     * @private
     * @returns {_PdfOneTimeResponse[]} Collection of one‑time responses.
     */
    readonly _responses: _PdfOneTimeResponse[];
}
/**
 * Represents the status of a certificate in an OCSP response.
 *
 * @private
 */
export declare class _PdfOcspStatus {
    /**
     * ASN.1 tag number representing the OCSP status choice.
     *
     * @private
     */
    private tagNumber;
    /**
     * Internal status value.
     *
     * @private
     */
    private _value;
    /**
     * Initializes a new instance of the `_PdfOcspStatus` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [choice] ASN.1 choice element
     * representing the certificate status.
     */
    constructor(choice?: _PdfAbstractSyntaxElement);
    /**
     * Gets the ASN.1 tag number of the OCSP status.
     *
     * @private
     * @returns {number} OCSP status tag number.
     */
    readonly _tagNumber: number;
    /**
     * Gets an OCSP status instance from the specified object.
     *
     * @private
     * @param {*} object Object to be converted into an OCSP status.
     * @returns {_PdfOcspStatus} OCSP status instance.
     * @throws {Error} Throws an error if the object type is invalid.
     */
    _getStatus(object: any): _PdfOcspStatus;
}
/**
 * Represents a single one‑time OCSP response.
 *
 * @private
 */
export declare class _PdfOneTimeResponse {
    /**
     * Helper used to process the one‑time response.
     *
     * @private
     * @type {_PdfOneTimeResponseHelper}
     */
    private _helper;
    /**
     * Initializes a new instance of the `_PdfOneTimeResponse` class.
     *
     * @private
     * @param {_PdfOneTimeResponseHelper} helper One‑time response helper.
     */
    constructor(helper: _PdfOneTimeResponseHelper);
    /**
     * Gets the certificate status from the OCSP response.
     *
     * @private
     * @returns {_PdfOcspStatus} Certificate revocation status.
     */
    readonly _certificateStatus: _PdfOcspStatus;
}
/**
 * Represents an OCSP OneTimeResponse structure used to validate the revocation
 * status of a certificate at a specific point in time.
 *
 * @private
 */
export declare class _PdfOneTimeResponseHelper {
    /**
     * Certificate identifier containing issuer and serial number information.
     *
     * @private
     */
    private _id;
    /**
     * Status of the certificate (good, revoked, or unknown).
     *
     * @private
     */
    private _certificateStatus;
    /**
     * Time at which the certificate status was known to be correct.
     *
     * @private
     */
    private _currentUpdate;
    /**
     * Optional time indicating when newer status information will be available.
     *
     * @private
     */
    private _nextUpdate;
    /**
     * Optional X.509 extensions associated with the OCSP response.
     *
     * @private
     */
    private _extensions;
    /**
     * Initializes a new instance of the `_PdfOneTimeResponseHelper` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing the OneTimeResponse.
     * @throws {Error} Throws an error if the sequence does not contain the minimum required elements.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement);
    /**
     * Gets the OCSP status of the certificate.
     *
     * @private
     * @returns {_PdfOcspStatus} The parsed certificate OCSP status.
     */
    readonly _status: _PdfOcspStatus;
    /**
     * Gets the thisUpdate time element (UTCTime/GeneralizedTime ASN.1 element).
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} Raw ASN.1 element for thisUpdate.
     */
    readonly _thisUpdate: _PdfAbstractSyntaxElement;
    /**
     * Gets the nextUpdate GeneralizedTime helper.
     *
     * @private
     * @returns {_PdfGeneralizedTime} Parsed nextUpdate time.
     */
    readonly _nextUpdateTime: _PdfGeneralizedTime;
    /**
     * Creates or resolves a `_PdfOneTimeResponseHelper` instance from the given object.
     *
     * @private
     * @param {*} object The object to resolve as a one-time OCSP response.
     * @returns {_PdfOneTimeResponseHelper} The resolved one-time response helper instance.
     * @throws {Error} Throws an error if the object is not a valid response entry.
     */
    _getResponse(object: any): _PdfOneTimeResponseHelper;
}
