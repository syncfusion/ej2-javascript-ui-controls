import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfX509Extensions } from '../x509/x509-extensions';
import { _PdfCertificateIdentityHelper } from './certificate-identity';
import { _PdfResponseInformation } from './ocsp-response';
import { _PdfGeneralizedTime, _PdfOcspHelper } from './ocsp-response-utils';
/**
 * Represents an OCSP revocation response.
 *
 * @private
 */
export class _PdfRevocationResponse {
    /**
     * OCSP helper used to process the response.
     *
     * @private
     */
    private _helper: _PdfOcspHelper;
    /**
     * Parsed response information.
     *
     * @private
     */
    private _data: _PdfResponseInformation;
    /**
     * Initializes a new instance of the `_PdfRevocationResponse` class.
     *
     * @private
     * @param {_PdfOcspHelper} helper OCSP helper containing response data.
     */
    constructor(helper: _PdfOcspHelper) {
        this._helper = helper;
        this._data = helper._responseInformation;
    }
    /**
     * Gets the encoded OCSP response bytes.
     *
     * @private
     * @returns {Uint8Array} ASN.1 encoded OCSP response.
     */
    get _encodedBytes(): Uint8Array {
        return this._helper._getAsn1()._toEncodedBytes();
    }
    /**
     * Gets the collection of one‑time OCSP responses.
     *
     * @private
     * @returns {_PdfOneTimeResponse[]} Collection of one‑time responses.
     */
    get _responses(): _PdfOneTimeResponse[] {
        const sequence: _PdfAbstractSyntaxElement = this._data._sequence;
        const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
        const list: _PdfOneTimeResponse[] = new Array(elements.length);
        for (let i: number = 0; i < list.length; i++) {
            const responseHelper: _PdfOneTimeResponseHelper = new _PdfOneTimeResponseHelper();
            list[<number>i] = new _PdfOneTimeResponse(responseHelper._getResponse(elements[<number>i]));
        }
        return list;
    }
}
/**
 * Represents the status of a certificate in an OCSP response.
 *
 * @private
 */
export class _PdfOcspStatus {
    /**
     * ASN.1 tag number representing the OCSP status choice.
     *
     * @private
     */
    private tagNumber: number;
    /**
     * Internal status value.
     *
     * @private
     */
    private _value: number;
    /**
     * Initializes a new instance of the `_PdfOcspStatus` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [choice] ASN.1 choice element
     * representing the certificate status.
     */
    constructor(choice?: _PdfAbstractSyntaxElement) {
        if (choice) {
            this.tagNumber = choice._getTagNumber();
            switch (this.tagNumber) {
            case 0:
            case 2:
                this._value = 0;
                break;
            }
        }
    }
    /**
     * Gets the ASN.1 tag number of the OCSP status.
     *
     * @private
     * @returns {number} OCSP status tag number.
     */
    get _tagNumber(): number {
        return this.tagNumber;
    }
    /**
     * Gets an OCSP status instance from the specified object.
     *
     * @private
     * @param {*} object Object to be converted into an OCSP status.
     * @returns {_PdfOcspStatus} OCSP status instance.
     * @throws {Error} Throws an error if the object type is invalid.
     */
    _getStatus(object: any): _PdfOcspStatus { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfOcspStatus) {
            return object as _PdfOcspStatus;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfOcspStatus(object);
        }
        throw new Error('Invalid entry in sequence');
    }
}
/**
 * Represents a single one‑time OCSP response.
 *
 * @private
 */
export class _PdfOneTimeResponse {
    /**
     * Helper used to process the one‑time response.
     *
     * @private
     * @type {_PdfOneTimeResponseHelper}
     */
    private _helper: _PdfOneTimeResponseHelper;
    /**
     * Initializes a new instance of the `_PdfOneTimeResponse` class.
     *
     * @private
     * @param {_PdfOneTimeResponseHelper} helper One‑time response helper.
     */
    constructor(helper: _PdfOneTimeResponseHelper) {
        this._helper = helper;
    }
    /**
     * Gets the certificate status from the OCSP response.
     *
     * @private
     * @returns {_PdfOcspStatus} Certificate revocation status.
     */
    get _certificateStatus(): _PdfOcspStatus {
        return this._helper._status;
    }
}
/**
 * Represents an OCSP OneTimeResponse structure used to validate the revocation
 * status of a certificate at a specific point in time.
 *
 * @private
 */
export class _PdfOneTimeResponseHelper {
    /**
     * Certificate identifier containing issuer and serial number information.
     *
     * @private
     */
    private _id: _PdfCertificateIdentityHelper;
    /**
     * Status of the certificate (good, revoked, or unknown).
     *
     * @private
     */
    private _certificateStatus: _PdfOcspStatus;
    /**
     * Time at which the certificate status was known to be correct.
     *
     * @private
     */
    private _currentUpdate: _PdfAbstractSyntaxElement;
    /**
     * Optional time indicating when newer status information will be available.
     *
     * @private
     */
    private _nextUpdate: _PdfGeneralizedTime;
    /**
     * Optional X.509 extensions associated with the OCSP response.
     *
     * @private
     */
    private _extensions: _PdfX509Extensions;
    /**
     * Initializes a new instance of the `_PdfOneTimeResponseHelper` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing the OneTimeResponse.
     * @throws {Error} Throws an error if the sequence does not contain the minimum required elements.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (!sequence) {
            return;
        }
        const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
        if (!elements || elements.length < 3) {
            throw new Error('OneTimeResponseHelper: SEQUENCE must contain at least 3 elements.');
        }
        const id: _PdfCertificateIdentityHelper = new _PdfCertificateIdentityHelper();
        const status: _PdfOcspStatus = new _PdfOcspStatus();
        this._id = id._getCertificateIdentity(elements[0]);
        this._certificateStatus = status._getStatus(elements[1]);
        this._currentUpdate = elements[2];
        if (elements.length > 4) {
            const nextTag: _PdfAbstractSyntaxElement = elements[3];
            const extTag: _PdfAbstractSyntaxElement = elements[4];
            this._nextUpdate = new _PdfGeneralizedTime()._getGeneralizedTimeFromTag(nextTag, true);
            this._extensions = new _PdfX509Extensions()._getInstance(extTag);
        } else if (elements.length > 3) {
            const tag: _PdfAbstractSyntaxElement = elements[3];
            const tagNo: number = tag._getTagNumber();
            if (tagNo === 0) {
                this._nextUpdate = new _PdfGeneralizedTime()._getGeneralizedTimeFromTag(tag, true);
            } else {
                this._extensions = new _PdfX509Extensions()._getInstance(tag);
            }
        }
    }
    /**
     * Gets the OCSP status of the certificate.
     *
     * @private
     * @returns {_PdfOcspStatus} The parsed certificate OCSP status.
     */
    get _status(): _PdfOcspStatus {
        return this._certificateStatus;
    }
    /**
     * Gets the thisUpdate time element (UTCTime/GeneralizedTime ASN.1 element).
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} Raw ASN.1 element for thisUpdate.
     */
    get _thisUpdate(): _PdfAbstractSyntaxElement {
        return this._currentUpdate;
    }
    /**
     * Gets the nextUpdate GeneralizedTime helper.
     *
     * @private
     * @returns {_PdfGeneralizedTime} Parsed nextUpdate time.
     */
    get _nextUpdateTime(): _PdfGeneralizedTime {
        return this._nextUpdate;
    }
    /**
     * Creates or resolves a `_PdfOneTimeResponseHelper` instance from the given object.
     *
     * @private
     * @param {*} object The object to resolve as a one-time OCSP response.
     * @returns {_PdfOneTimeResponseHelper} The resolved one-time response helper instance.
     * @throws {Error} Throws an error if the object is not a valid response entry.
     */
    _getResponse(object: any): _PdfOneTimeResponseHelper { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfOneTimeResponseHelper(object);
        }
        if (typeof object === 'undefined' || object === null || object instanceof _PdfOneTimeResponseHelper) {
            return object as _PdfOneTimeResponseHelper;
        }
        throw new Error('Invalid entry in sequence');
    }
}
