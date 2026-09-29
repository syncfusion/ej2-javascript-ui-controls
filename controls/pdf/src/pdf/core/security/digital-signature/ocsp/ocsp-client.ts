import { LongTermValidationCallback } from '../../../pdf-type';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfX509Extension, _PdfX509Extensions } from '../x509/x509-extensions';
import { _PdfCertificateIdentity } from './certificate-identity';
import { _PdfCertificateUtility, _PdfEncryption } from './certificate-utils';
import { _PdfOcspRequestCreator, _PdfOcspRequestHelper } from './ocsp-request';
import { _PdfOcspResponseHelper } from './ocsp-response';
import { _PdfOneTimeResponse, _PdfRevocationResponse } from './ocsp-response-model';
/**
 * Represents OCSP (Online Certificate Status Protocol) processing support
 * for PDF certificate validation.
 *
 * @private
 */
export class _PdfOcsp {
    /**
     * Callback used for long‑term validation processing.
     *
     * @private
     */
    _ltvCallback: LongTermValidationCallback;
    /**
     * Initializes a new instance of the `_PdfOcsp` class.
     *
     * @private
     */
    constructor() { } // eslint-disable-line
    /**
     * Gets the encoded OCSP response for the specified certificate.
     *
     * @private
     * @param {_PdfX509Certificate} checkCert Certificate to be checked.
     * @param {_PdfX509Certificate} rootCert Issuer or root certificate.
     * @param {string} [url] Optional OCSP responder URL.
     * @returns {Promise<Uint8Array>} A promise that resolves to the encoded
     * OCSP response bytes, or `null` if the response is invalid or unavailable.
     */
    async _getEncodedOcspResponse(checkCert: _PdfX509Certificate, rootCert: _PdfX509Certificate, url?: string): Promise<Uint8Array> {
        try {
            const basicResponse: _PdfRevocationResponse = await this._getBasicOCSPResponse(checkCert, rootCert, url);
            if (basicResponse) {
                const responses: _PdfOneTimeResponse[] = basicResponse._responses;
                if (responses.length === 1) {
                    const resp: _PdfOneTimeResponse = basicResponse._responses[0];
                    if (resp._certificateStatus && resp._certificateStatus._tagNumber === 0) {
                        return basicResponse._encodedBytes;
                    }
                }
            }
        } catch (err) { } // eslint-disable-line
        return null;
    }
    /**
     * Gets the basic OCSP response object for the specified certificate.
     *
     * @private
     * @param {_PdfX509Certificate} checkCertificate Certificate to be checked.
     * @param {_PdfX509Certificate} rootCertificate Issuer or root certificate.
     * @param {string} [url] Optional OCSP responder URL.
     * @returns {Promise<_PdfRevocationResponse>} A promise that resolves to the
     * basic OCSP response object, or `null` if the response is invalid.
     */
    async _getBasicOCSPResponse(checkCertificate: _PdfX509Certificate,
                                rootCertificate: _PdfX509Certificate,
                                url?: string): Promise<_PdfRevocationResponse> {
        try {
            const ocspResponse: _PdfOcspResponseHelper = await this._getOcspResponse(checkCertificate, rootCertificate, url);
            if (ocspResponse) {
                if (ocspResponse._status !== 0) {
                    return null;
                }
                return ocspResponse._getResponseObject();
            }
        } catch (err) { } // eslint-disable-line
        return null;
    }
    /**
     * Gets the OCSP response helper for the specified certificate.
     *
     * @private
     * @param {_PdfX509Certificate} checkCertificate Certificate to be checked.
     * @param {_PdfX509Certificate} rootCertificate Issuer or root certificate.
     * @param {string} [url] Optional OCSP responder URL.
     * @returns {Promise<_PdfOcspResponseHelper>} A promise that resolves to the
     * OCSP response helper, or `null` if the request cannot be completed.
     */
    async _getOcspResponse(checkCertificate: _PdfX509Certificate,
                           rootCertificate: _PdfX509Certificate,
                           url?: string): Promise<_PdfOcspResponseHelper> {
        if (!checkCertificate || !rootCertificate) {
            return null;
        }
        if (!url) {
            const utility: _PdfCertificateUtility = new _PdfCertificateUtility();
            url = utility._getOcspUrl(checkCertificate);
        }
        if (!url) {
            return null;
        }
        const serialNumber: Uint8Array = checkCertificate._structure._toBeSignedCertificate._serialNumber;
        const request: _PdfOcspRequestHelper = await this._generateOCSPRequest(rootCertificate, serialNumber);
        const array: Uint8Array = request._getEncoded();
        const module: {response: Uint8Array} = await this._ltvCallback(url, array);
        return new _PdfOcspResponseHelper(await module.response);
    }
    /**
     * Generates an OCSP request for a given certificate using its issuer
     * and serial number.
     *
     * @private
     * @param {_PdfX509Certificate} issuerCertificate - The certificate of the issuer
     * @param {Uint8Array} serialNumber - The serial number of the certificate
     * @returns {Promise<_PdfOcspRequestHelper>} A promise that resolves to
     * the generated OCSP request helper object.
     */
    async _generateOCSPRequest(issuerCertificate: _PdfX509Certificate, serialNumber: Uint8Array): Promise<_PdfOcspRequestHelper> {
        const id: _PdfCertificateIdentity = new _PdfCertificateIdentity('1.3.14.3.2.26', issuerCertificate, serialNumber);
        const requestCreator: _PdfOcspRequestCreator = new _PdfOcspRequestCreator();
        requestCreator._addRequest(id);
        const certHashOctet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        certHashOctet._tagClass = _TagClassType.universal;
        certHashOctet._construction = _ConstructionType.primitive;
        certHashOctet._setTagNumber(_UniversalType.octetString);
        certHashOctet._setValue(await new _PdfEncryption()._createDocumentId());
        const certHashOctet1: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        certHashOctet1._tagClass = _TagClassType.universal;
        certHashOctet1._construction = _ConstructionType.primitive;
        certHashOctet1._setTagNumber(_UniversalType.octetString);
        certHashOctet1._setValue(certHashOctet._toEncodedBytes());
        const extensions: Map<string, _PdfX509Extension> = new Map<string, _PdfX509Extension>();
        extensions.set('1.3.6.1.5.5.7.48.1.2', new _PdfX509Extension(false, certHashOctet1));
        requestCreator._setRequestExtensions(new _PdfX509Extensions(extensions));
        return requestCreator._generate();
    }
}
/**
 * Represents an OCSP tag used in GeneralName and revocation structures.
 *
 * @private
 */
export class _PdfOcspTag {
    /**
     * ASN.1 encoded value associated with the OCSP tag.
     *
     * @private
     */
    _encode: _PdfAbstractSyntaxElement;
    /**
     * Numeric tag identifier.
     *
     * @private
     */
    private tagNumber: number;
    /**
     * Initializes a new instance of the `_PdfOcspTag` class.
     *
     * @private
     * @param {number} [tag] Tag number.
     * @param {_PdfAbstractSyntaxElement} [encode] ASN.1 encoded value.
     */
    constructor(tag?: number, encode?: _PdfAbstractSyntaxElement) {
        if (encode) {
            this._encode = encode;
        }
        this.tagNumber = (tag !== null && typeof tag !== 'undefined') ? tag : 0;
    }
    /**
     * Gets the tag number.
     *
     * @private
     * @returns {number} Tag number.
     */
    get _tagNumber(): number {
        return this.tagNumber;
    }
    /**
     * Gets an OCSP tag instance from the specified object.
     *
     * @private
     * @param {*} object Object to be converted into an OCSP tag.
     * @returns {_PdfOcspTag} OCSP tag instance.
     * @throws {Error} Throws an error if the tag number or object type is invalid.
     */
    _getOcspName(object: any): _PdfOcspTag { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfOcspTag) {
            return object as _PdfOcspTag;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            const tagNumber: number = object._getTagNumber();
            switch (tagNumber) {
            case 1:
            case 2:
            case 6:
                return new _PdfOcspTag(tagNumber, object);
            case 3:
                throw new Error('Invalid tag number specified ' + tagNumber);
            }
        }
        throw new Error('Invalid entry in sequence');
    }
}
