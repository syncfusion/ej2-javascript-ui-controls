import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfX509Extensions } from '../x509/x509-extensions';
import { _PdfCertificateIdentity, _PdfCertificateIdentityHelper } from './certificate-identity';
import { _PdfOcspTag } from './ocsp-client';
/**
 * Creates OCSP requests for certificate status validation.
 *
 * @private
 */
export class _PdfOcspRequestCreator {
    /**
     * Collection of request creator helpers.
     *
     * @private
     */
    private _list: _PdfRequestCreatorHelper[] = [];
    /**
     * Requestor name associated with the OCSP request.
     *
     * @private
     */
    private _requestorName: _PdfOcspTag;
    /**
     * Extensions applied to the OCSP request.
     *
     * @private
     */
    private _requestExtensions: _PdfX509Extensions;
    /**
     * Adds a certificate identity to the OCSP request.
     *
     * @private
     * @param {_PdfCertificateIdentity} id Certificate identity to be added.
     * @returns {void}
     */
    _addRequest(id: _PdfCertificateIdentity): void {
        this._list.push(new _PdfRequestCreatorHelper(id));
    }
    /**
     * Sets the extensions for the OCSP request.
     *
     * @private
     * @param {_PdfX509Extensions} extensions OCSP request extensions.
     * @returns {void}
     */
    _setRequestExtensions(extensions: _PdfX509Extensions): void {
        this._requestExtensions = extensions;
    }
    /**
     * Creates the OCSP request using the collected requests and extensions.
     *
     * @private
     * @returns {_PdfOcspRequestHelper} Generated OCSP request helper.
     * @throws {Error} Throws an error if request creation fails.
     */
    _createRequest(): _PdfOcspRequestHelper {
        const requests: _PdfAbstractSyntaxElement[] = [];
        for (const requestObject of this._list) {
            try {
                const request: _PdfRevocationRequest = requestObject._toRequest();
                requests.push(request._getAsn1());
            } catch {
                throw new Error('Invalid request creation');
            }
        }
        const requestList: _PdfOcspRequestCollection = new _PdfOcspRequestCollection(
            this._requestorName,
            requests,
            this._requestExtensions
        );
        return new _PdfOcspRequestHelper(new _PdfRevocationListRequest(requestList));
    }
    /**
     * Generates the OCSP request.
     *
     * @private
     * @returns {_PdfOcspRequestHelper} Generated OCSP request helper.
     */
    _generate(): _PdfOcspRequestHelper {
        return this._createRequest();
    }
}
/**
 * Helper class for creating individual OCSP revocation requests.
 *
 * @private
 */
export class _PdfRequestCreatorHelper {
    /**
     * Certificate identity associated with the request.
     *
     * @private
     * @type {_PdfCertificateIdentity}
     */
    private _id: _PdfCertificateIdentity;
    /**
     * Extensions applied to the revocation request.
     *
     * @private
     * @type {_PdfX509Extensions}
     */
    private _extensions: _PdfX509Extensions;
    /**
     * Initializes a new instance of the `_PdfRequestCreatorHelper` class.
     *
     * @private
     * @param {_PdfCertificateIdentity} id Certificate identity for the request.
     * @param {_PdfX509Extensions} [extensions] Optional request extensions.
     */
    constructor(id: _PdfCertificateIdentity, extensions?: _PdfX509Extensions) {
        this._id = id;
        if (extensions) {
            this._extensions = extensions;
        }
    }
    /**
     * Converts the stored certificate identity into a revocation request.
     *
     * @private
     * @returns {_PdfRevocationRequest} Generated revocation request.
     */
    _toRequest(): _PdfRevocationRequest {
        return new _PdfRevocationRequest(this._id._id, this._extensions);
    }
}
/**
 * Represents a single OCSP revocation request.
 *
 * @private
 */
export class _PdfRevocationRequest {
    /**
     * Certificate identifier for the revocation request.
     *
     * @private
     */
    private _certificateID: _PdfCertificateIdentityHelper;
    /**
     * Extensions applied to the single revocation request.
     *
     * @private
     */
    private _singleRequestExtensions: _PdfX509Extensions;
    /**
     * Initializes a new instance of the `_PdfRevocationRequest` class.
     *
     * @private
     * @param {_PdfCertificateIdentityHelper} certificateID Certificate identifier.
     * @param {_PdfX509Extensions} singleRequestExtensions Request‑specific extensions.
     * @throws {Error} Throws an error if the certificate identifier is null.
     */
    constructor(certificateID: _PdfCertificateIdentityHelper, singleRequestExtensions: _PdfX509Extensions) {
        if (!certificateID) {
            throw new Error('certificateID cannot be null');
        }
        this._certificateID = certificateID;
        this._singleRequestExtensions = singleRequestExtensions;
    }
    /**
     * Gets the ASN.1 representation of the revocation request.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded revocation request.
     */
    _getAsn1(): _PdfAbstractSyntaxElement {
        const sequences: _PdfAbstractSyntaxElement[] = [];
        sequences.push(this._certificateID._getASN1());
        if (this._singleRequestExtensions) {
            const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
                _TagClassType.context,
                _ConstructionType.constructed,
                0
            );
            outerSequence._setSequence([this._singleRequestExtensions._getAsn1()]);
            sequences.push(outerSequence);
        }
        const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence(sequences);
        return outerSequence;
    }
}
/**
 * Helper class for handling OCSP request encoding.
 *
 * @private
 */
export class _PdfOcspRequestHelper {
    /**
     * Underlying revocation list request.
     *
     * @private
     * @type {_PdfRevocationListRequest}
     */
    private _request: _PdfRevocationListRequest;
    /**
     * Initializes a new instance of the `_PdfOcspRequestHelper` class.
     *
     * @private
     * @param {_PdfRevocationListRequest} request Revocation list request.
     */
    constructor(request: _PdfRevocationListRequest) {
        this._request = request;
    }
    /**
     * Gets the encoded OCSP request bytes.
     *
     * @private
     * @returns {Uint8Array} ASN.1 encoded OCSP request.
     */
    _getEncoded(): Uint8Array {
        return this._request._getAsn1()._toEncodedBytes();
    }
}
/**
 * Represents a collection of OCSP requests.
 *
 * @private
 */
export class _PdfOcspRequestCollection {
    /**
     * Default version value.
     *
     * @private
     */
    _integer: number = 0;
    /**
     * OCSP request version.
     *
     * @private
     */
    private _version: number;
    /**
     * Requestor name associated with the OCSP request.
     *
     * @private
     */
    private _requestorName: _PdfOcspTag;
    /**
     * Collection of individual OCSP request ASN.1 elements.
     *
     * @private
     */
    private _requestList: _PdfAbstractSyntaxElement[];
    /**
     * Extensions applied to the OCSP request.
     *
     * @private
     */
    private _requestExtensions: _PdfX509Extensions;
    /**
     * Initializes a new instance of the `_PdfOcspRequestCollection` class.
     *
     * @private
     * @param {_PdfOcspTag} requestorName Requestor name.
     * @param {_PdfAbstractSyntaxElement[]} requestList Collection of OCSP requests.
     * @param {_PdfX509Extensions} requestExtensions Request extensions.
     */
    constructor(requestorName: _PdfOcspTag, requestList: _PdfAbstractSyntaxElement[], requestExtensions: _PdfX509Extensions) {
        this._version = this._integer;
        this._requestorName = requestorName;
        this._requestList = requestList;
        this._requestExtensions = requestExtensions;
    }
    /**
     * Gets the ASN.1 representation of the OCSP request collection.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded OCSP request collection.
     */
    _getAsn1(): _PdfAbstractSyntaxElement  {
        const sequences: _PdfAbstractSyntaxElement[] = [];
        sequences.push(...this._requestList);
        if (this._requestExtensions) {
            sequences.push(this._requestExtensions._getAsn1());
        }
        const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence(sequences);
        return outerSequence;
    }
}
/**
 * Represents an OCSP revocation list request.
 *
 * @private
 */
export class _PdfRevocationListRequest {
    /**
     * OCSP request collection.
     *
     * @private
     */
    requests: _PdfOcspRequestCollection;
    /**
     * Initializes a new instance of the `_PdfRevocationListRequest` class.
     *
     * @private
     * @param {_PdfOcspRequestCollection} requests OCSP request collection.
     * @throws {Error} Throws an error if the request collection is null.
     */
    constructor(requests: _PdfOcspRequestCollection) {
        if (!requests) {
            throw new Error('requests cannot be null');
        }
        this.requests = requests;
    }
    /**
     * Gets the ASN.1 representation of the revocation list request.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded revocation list request.
     */
    _getAsn1(): _PdfAbstractSyntaxElement  {
        const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence([this.requests._getAsn1()]);
        return outerSequence;
    }
}
