import { _stringToBytes } from '../../../utils';
import { _Sha1 } from '../../encryptors/secureHash-algorithm1';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfMessageDigestAlgorithms } from '../signature/pdf-digest-algorithms';
import { _PdfAlgorithms } from '../x509/x509-algorithm';
import { _PdfUniqueBitString } from '../x509/x509-bit-string-handler';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfPublicKeyInformation } from '../x509/x509-certificate-key';
import { _PdfCipherParameter, _PdfRonCipherParameter } from '../x509/x509-cipher-handler';
import { _PdfOcspTag } from './ocsp-client';
import { _PdfRevocationDistribution, _PdfRevocationDistributionType, _PdfRevocationName, _PdfRevocationPointList } from './revocation';
/**
 * Provides utility methods for working with X.509 certificates in PDF processing.
 *
 * @private
 */
export class _PdfCertificateUtility {
    /**
     * Gets the OCSP responder URL from the specified X.509 certificate.
     *
     * @private
     * @param {_PdfX509Certificate} certificate X.509 certificate from which the
     * OCSP responder URL is retrieved.
     * @returns {string} OCSP responder URL if present; otherwise, `null`.
     * @throws {Error} Throws an error if the extension value parsing fails.
     */
    _getOcspUrl(certificate: _PdfX509Certificate): string {
        try {
            const asn1Element: _PdfAbstractSyntaxElement = this._getExtensionValue(certificate, '1.3.6.1.5.5.7.1.1');
            if (!asn1Element) {
                return null;
            }
            const sequence: _PdfAbstractSyntaxElement[] = asn1Element._getSequence();
            for (const item of sequence) {
                const innerSequence: _PdfAbstractSyntaxElement[] = item._getSequence();
                if (innerSequence.length !== 2) {
                    continue;
                }
                const oidElement: _PdfAbstractSyntaxElement = innerSequence[0];
                if (oidElement._getObjectIdentifier()._getDotDelimitedNotation() === '1.3.6.1.5.5.7.48.1') {
                    const accessLocationElement: _PdfAbstractSyntaxElement = innerSequence[1];
                    const accessLocation: string = this._getStringFromGeneralName(accessLocationElement);
                    return accessLocation || '';
                }
            }
        } catch (err) {
            throw new Error(err.message);
        }
        return null;
    }
    /**
     * Gets a string value from the specified GeneralName ASN.1 element.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element ASN.1 GeneralName element.
     * @returns {string} Extracted string value, or `null` if parsing fails.
     */
    _getStringFromGeneralName(element: _PdfAbstractSyntaxElement): string {
        try {
            return element._getUtf8String() || element._getInternationalAlphabetString();
        } catch {
            return null;
        }
    }
    /**
     * Gets the decoded ASN.1 value of the specified certificate extension.
     *
     * @private
     * @param {_PdfX509Certificate} certificate X.509 certificate.
     * @param {string} id Object identifier (OID) of the extension.
     * @returns {_PdfAbstractSyntaxElement} Decoded ASN.1 extension value,
     * or `null` if the extension is not present.
     */
    _getExtensionValue(certificate: _PdfX509Certificate, id: string): _PdfAbstractSyntaxElement {
        const extension: _PdfAbstractSyntaxElement = certificate._getExtension(new _PdfObjectIdentifier()._fromString(id));
        if (!extension) {
            return null;
        }
        const bytes: Uint8Array = extension._toEncodedBytes();
        if (!bytes) {
            return null;
        }
        const outerElement: _PdfAbstractSyntaxElement = this._createAsn1ElementFromBytes(bytes);
        const innerBytes: Uint8Array = outerElement._getOctetString();
        const innerElement: _PdfAbstractSyntaxElement = this._createAsn1ElementFromBytes(innerBytes);
        return innerElement;
    }
    /**
     * Creates an ASN.1 element from the specified encoded byte array.
     *
     * @private
     * @param {Uint8Array} bytes Encoded ASN.1 byte array.
     * @returns {_PdfAbstractSyntaxElement} Parsed ASN.1 element.
     */
    _createAsn1ElementFromBytes(bytes: Uint8Array): _PdfAbstractSyntaxElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._fromBytes(bytes);
        return element;
    }
    /**
     * Gets the list of CRL distribution point URLs from the specified X.509 certificate.
     *
     * @private
     * @param {_PdfX509Certificate} certificate X.509 certificate from which the
     * CRL distribution point URLs are retrieved.
     * @returns {Promise<string[]>} A promise that resolves to an array of CRL URLs,
     * or `null` if the extension is not present.
     */
    async _getCrlUrls(certificate: _PdfX509Certificate): Promise<string[]> {
        const urls: string[] = [];
        const object: _PdfAbstractSyntaxElement = this._getExtensionValue(certificate, '2.5.29.31');
        if (!object) {
            return null;
        }
        const list: _PdfRevocationPointList = new _PdfRevocationPointList();
        const distributionList: _PdfRevocationPointList = list._getCrlPointList(object);
        const distributionLists: _PdfRevocationDistribution[] = distributionList._getDistributionPoints();
        for (const entry of distributionLists) {
            const distributionPointName: _PdfRevocationDistributionType = entry._distributionPointName;
            if (distributionPointName._pointType !== distributionPointName._fullName) {
                continue;
            }
            const generalNames: _PdfRevocationName = distributionPointName._name;
            const names: _PdfOcspTag[] = generalNames._names;
            for (const name of names) {
                if (name._tagNumber !== 6) {
                    continue;
                }
                const url: string = name._encode._getObjectIdResourceIdentifier();
                if (this._isValidUrl(url)) {
                    if (url.toLowerCase().endsWith('.crl')) {
                        urls.push(url);
                    }
                }
            }
        }
        return urls;
    }
    /**
     * Determines whether the specified string is a valid HTTP or HTTPS URL.
     *
     * @private
     * @param {string} url URL string to validate.
     * @returns {boolean} `true` if the URL is valid and uses HTTP or HTTPS;
     * otherwise, `false`.
     */
    _isValidUrl(url: string): boolean {
        try {
            const uri: URL = new URL(url);
            return uri.protocol === 'http:' || uri.protocol === 'https:';
        } catch {
            return false;
        }
    }
}
/**
 * Represents the Subject Key Identifier (SKI) used in X.509 certificates.
 *
 * @private
 */
export class _PdfSubjectKeyID {
    /**
     * Raw subject key identifier bytes.
     *
     * @private
     * @type {Uint8Array}
     */
    private _bytes: Uint8Array;
    /**
     * Initializes a new instance of the `_PdfSubjectKeyID` class
     * using an ASN.1 encoded subject key identifier.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [keyID] ASN.1 element containing
     * the subject key identifier.
     */
    constructor(keyID?: _PdfAbstractSyntaxElement);
    /**
     * Initializes a new instance of the `_PdfSubjectKeyID` class
     * using public key information.
     *
     * @private
     * @param {_PdfPublicKeyInformation} [publicKey] Public key information
     * used to generate the subject key identifier.
     */
    constructor(publicKey?: _PdfPublicKeyInformation);
    /**
     * Initializes a new instance of the `_PdfSubjectKeyID` class.
     *
     * @private
     * @param {*} [param] ASN.1 element or public key information.
     * @throws {Error} Throws an error if the parameter type is invalid.
     */
    constructor(param?: any) { // eslint-disable-line
        if (param) {
            if (param instanceof _PdfAbstractSyntaxElement) {
                this._bytes = param._getOctetString();
            } else if (param instanceof _PdfPublicKeyInformation) {
                this._bytes = this._getDigest(param);
            } else {
                throw new Error('Invalid constructor argument');
            }
        }
    }
    /**
     * Creates public key information with the specified subject key identifier.
     *
     * @private
     * @param {_PdfCipherParameter} publicKey Cipher parameter representing
     * the public key.
     * @param {Uint8Array} id Subject key identifier bytes.
     * @returns {_PdfPublicKeyInformation} Public key information instance.
     * @throws {Error} Throws an error if the key type is invalid.
     */
    _createSubjectKeyID(publicKey: _PdfCipherParameter, id: Uint8Array): _PdfPublicKeyInformation {
        if (publicKey instanceof _PdfRonCipherParameter) {
            const algorithm: _PdfAlgorithms = new _PdfAlgorithms();
            algorithm._objectID = new _PdfObjectIdentifier()._fromString('1.2.840.113549.1.1.1');
            algorithm._parameters = algorithm._getUniqueEncoderNull();
            algorithm._parametersDefined = true;
            const bitString: _PdfUniqueBitString = new _PdfUniqueBitString(id, 0);
            const information: _PdfPublicKeyInformation = new _PdfPublicKeyInformation(algorithm, bitString);
            return information;
        }
        throw new Error('Invalid Key');
    }
    /**
     * Computes the digest of the specified public key information.
     *
     * @private
     * @param {_PdfPublicKeyInformation} publicKey Public key information.
     * @returns {Uint8Array} Computed subject key identifier bytes.
     */
    _getDigest(publicKey: _PdfPublicKeyInformation): Uint8Array {
        const digest: _Sha1 = new _Sha1();
        const bytes: Uint8Array = publicKey._publicKey._getBytes();
        return digest._hash(bytes, 0, bytes.length);
    }
}
/**
 * Provides encryption-related helper methods for PDF processing.
 *
 * @private
 */
export class _PdfEncryption {
    /**
     * Sequence value used to ensure uniqueness when generating document IDs.
     *
     * @private
     */
    sequence: number = this._getDotNetTicks() + performance.now();
    /**
     * Creates a unique document identifier.
     *
     * @private
     * @returns {Promise<Uint8Array>} A promise that resolves to the generated
     * document identifier as a byte array.
     */
    async _createDocumentId(): Promise<Uint8Array> {
        const time: number = this._getDotNetTicks() + performance.now();
        const rand: number = Math.floor(Math.random() * 1_000_000);
        const s: string = `${time}+${rand}+${this.sequence++}`;
        return new _PdfMessageDigestAlgorithms()._digest(_stringToBytes(s) as Uint8Array, 'ripemd160');
    }
    /**
     * Gets the current time expressed as .NET ticks.
     *
     * @private
     * @returns {number} Current time in .NET tick format.
     */
    _getDotNetTicks(): number {
        const epochTicks: number = 621355968000000000;
        const ticksPerMs: number = 10000;
        return epochTicks + Date.now() * ticksPerMs;
    }
}
