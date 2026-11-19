import { _ConstructionType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _isBasicEncodingElement } from '../asn1/utils';
import { PdfCertificatePolicy, PdfCertificatePolicyNotice } from '../signature/signature-properties';
import { _PdfPublicKeyInformation } from './x509-certificate-key';
import { _PdfX509CertificateStructure } from './x509-certificate-structure';
import { _PdfCipherParameter, _PdfRonCipherParameter } from './x509-cipher-handler';
import { _PdfX509ExtensionBase, _PdfX509Extensions } from './x509-extensions';
import { _PdfSignedCertificate } from './x509-signed-certificate';
import { _PdfSignerUtilities } from '../signature/signature-utilities';
import { _ISigner } from '../signature/pdf-interfaces';
import { _padStart } from '../../../utils';
import { _PdfX509Name } from './x509-name';
import { PdfAuthorityInformationAccess, PdfCrlDistributionPoint, PdfSubjectAlternativeName } from '../../../pdf-document-helper';
import { PdfSubjectAlternativeNameType } from '../../../enumerator';
import { _MD5 } from '../../encryptors/messageDigest5';
/**
 * Wrapper around X.509 certificate data and helpers to extract keys and extensions.
 *
 * @private
 */
export class _PdfX509Certificate extends _PdfX509ExtensionBase {
    /**
     * Parsed certificate structure backing this certificate.
     *
     * @private
     * @type {_PdfX509CertificateStructure}
     */
    _structure: _PdfX509CertificateStructure;
    /**
     * Raw public key bytes extracted from the certificate (if available).
     *
     * @private
     * @type {Uint8Array}
     */
    _publicKeyBytes: Uint8Array;
    /**
     * Key usage bits parsed from the certificate extensions.
     *
     * @private
     * @type {boolean[]}
     */
    _keyUsage: boolean[] = [];
    /**
     * Extended key usage OIDs parsed from the certificate extensions.
     *
     * @private
     * @type {string[]}
     */
    _extendedKeyUsage: string[] = [];
    /**
     * Certificate policies parsed from the certificate extensions.
     *
     * @private
     * @type {PdfCertificatePolicy[]}
     */
    _certificatePolicies: PdfCertificatePolicy[] = [];
    /**
     * Complete DER-encoded certificate in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _x509Data: string = '';
    /**
     * Subject Key Identifier in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _subjectKeyIdentifier: string = '';
    /**
     * Authority Key Identifier in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _authorityKeyIdentifier: string = '';
    /**
     * Subject Alternative Name entries defined by the certificate.
     *
     * @private
     * @type {PdfSubjectAlternativeName[]}
     */
    _subjectAlternativeNames: PdfSubjectAlternativeName[] = [];
    /**
     * RFC822 email addresses defined in the Subject Alternative Name extension.
     *
     * @private
     * @type {string[]}
     */
    _rfc822EmailAddresses: string[] = [];
    /**
     * CRL Distribution Point locations defined by the certificate.
     *
     * @private
     * @type {PdfCrlDistributionPoint[]}
     */
    _crlDistributionPoints: PdfCrlDistributionPoint[] = [];
    /**
     * Authority Information Access entries defined by the certificate.
     *
     * @private
     * @type {PdfAuthorityInformationAccess[]}
     */
    _authorityInformationAccess: PdfAuthorityInformationAccess[] = [];
    /**
     * Certificate public key in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _publicKey: string = '';
    /**
     * SHA-1 digest of the certificate public key in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _sha1PublicKeyHash: string = '';
    /**
     * MD5 digest of the DER-encoded certificate in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _md5Thumbprint: string = '';
    constructor(certificate: _PdfX509CertificateStructure) {
        super();
        this._structure = certificate;
        const encodedCertificate: Uint8Array = this._getEncoded();
        if (encodedCertificate.length > 0) {
            this._x509Data = this._toAdobeHex(encodedCertificate);
            const md5Digest: Uint8Array = new _MD5().hash(
                encodedCertificate,
                0,
                encodedCertificate.length
            );
            this._md5Thumbprint = this._toAdobeHex(md5Digest);
        }
        const signedCertificate: _PdfSignedCertificate = this._structure &&
                typeof this._structure._getSignedCertificate === 'function' ? this._structure._getSignedCertificate()
            : undefined;
        if (signedCertificate && signedCertificate._publicKeyData) {
            const publicKeyData: Uint8Array =
                signedCertificate._publicKeyData;
            this._publicKey = this._toAdobeHex(publicKeyData);
        }
        const subjectKeyIdentifierOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.14');
        const subjectKeyIdentifierExt: _PdfAbstractSyntaxElement = this._getExtension(subjectKeyIdentifierOid);
        if (subjectKeyIdentifierExt) {
            try {
                const rawBytes: Uint8Array = subjectKeyIdentifierExt._getValue();
                const element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(rawBytes)
                    ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
                element._fromBytes(rawBytes);
                this._subjectKeyIdentifier = this._toAdobeHex(element._getValue());
            } catch {
                this._subjectKeyIdentifier = '';
            }
        }
        const authorityKeyIdentifierOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.35');
        const authorityKeyIdentifierExt: _PdfAbstractSyntaxElement = this._getExtension(authorityKeyIdentifierOid);
        if (authorityKeyIdentifierExt) {
            try {
                const rawBytes: Uint8Array = authorityKeyIdentifierExt._getValue();
                const element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(rawBytes)
                    ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
                element._fromBytes(rawBytes);
                const elements: _PdfAbstractSyntaxElement[] = element._getSequence();
                for (const item of elements) {
                    if (item._isTagged() && item._getTagNumber() === 0) {
                        this._authorityKeyIdentifier = this._toAdobeHex(item._getValue());
                        break;
                    }
                }
            } catch {
                this._authorityKeyIdentifier = '';
            }
        }
        const subjectAlternativeNameOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.17');
        const subjectAlternativeNameExt: _PdfAbstractSyntaxElement = this._getExtension(subjectAlternativeNameOid);
        if (subjectAlternativeNameExt) {
            try {
                const rawBytes: Uint8Array =
                    subjectAlternativeNameExt._getValue();
                this._subjectAlternativeNames =
                    this._parseSubjectAlternativeNames(rawBytes);
            } catch {
                this._subjectAlternativeNames = [];
            }
        }
        this._rfc822EmailAddresses = this._subjectAlternativeNames
            .filter((item: PdfSubjectAlternativeName): boolean => {
                return item.type ===
                    PdfSubjectAlternativeNameType.rfc822Name;
            })
            .map((item: PdfSubjectAlternativeName): string => {
                return item.value;
            });
        const crlDistributionPointsOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.31');
        const crlDistributionPointsExt: _PdfAbstractSyntaxElement = this._getExtension(crlDistributionPointsOid);
        if (crlDistributionPointsExt) {
            try {
                const rawBytes: Uint8Array = crlDistributionPointsExt._getValue();
                this._crlDistributionPoints = this._parseCrlDistributionPoints(rawBytes);
            } catch {
                this._crlDistributionPoints = [];
            }
        }
        const authorityInformationAccessOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('1.3.6.1.5.5.7.1.1');
        const authorityInformationAccessExt: _PdfAbstractSyntaxElement = this._getExtension(authorityInformationAccessOid);
        if (authorityInformationAccessExt) {
            try {
                const rawBytes: Uint8Array = authorityInformationAccessExt._getValue();
                this._authorityInformationAccess = this._parseAuthorityInformationAccess(rawBytes);
            } catch {
                this._authorityInformationAccess = [];
            }
        }
        const keyUsageOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.15');
        const keyUsageExt: _PdfAbstractSyntaxElement = this._getExtension(keyUsageOid);
        if (keyUsageExt) {
            const rawBytes: Uint8Array = keyUsageExt._getValue();
            const asn1Element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(rawBytes)
                ? new _PdfBasicEncodingElement()
                : new _PdfUniqueEncodingElement();
            asn1Element._fromBytes(rawBytes);
            const bitStringElement: _PdfAbstractSyntaxElement = asn1Element._construction === _ConstructionType.constructed
                ? asn1Element._getInner()
                : asn1Element;
            const bitBytes: Uint8Array = bitStringElement._getValue();
            const unusedBits: number = bitBytes[0];
            const bits: Uint8Array = bitBytes.slice(1);
            const length: number = (bits.length * 8) - unusedBits;
            this._keyUsage = Array.from({ length: Math.max(9, length) }, (value: any, i: number) => { // eslint-disable-line
                return (bits[Math.floor(i / 8)] & (0x80 >> (i % 8))) !== 0;
            });
        } else {
            this._keyUsage = null;
        }
        const extendedKeyUsageOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.37');
        const extendedKeyUsageExt: _PdfAbstractSyntaxElement = this._getExtension(extendedKeyUsageOid);
        if (extendedKeyUsageExt) {
            try {
                const rawBytes: Uint8Array = extendedKeyUsageExt._getValue();
                const element: _PdfAbstractSyntaxElement =
                    _isBasicEncodingElement(rawBytes) ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
                element._fromBytes(rawBytes);
                const sequence: _PdfAbstractSyntaxElement[] = element._getSequence();
                for (const item of sequence) {
                    const identifier: _PdfObjectIdentifier = item._getObjectIdentifier();
                    if (identifier) {
                        this._extendedKeyUsage.push(identifier._getDotDelimitedNotation());
                    }
                }
            } catch {
                this._extendedKeyUsage = [];
            }
        }
        const certificatePoliciesOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.32');
        const certificatePoliciesExt: _PdfAbstractSyntaxElement = this._getExtension(certificatePoliciesOid);
        if (certificatePoliciesExt) {
            try {
                const policyBytes: Uint8Array = certificatePoliciesExt._getValue();
                this._certificatePolicies = this._parseCertificatePolicies(policyBytes);
            } catch {
                this._certificatePolicies = [];
            }
        }
    }
    /**
     * Gets the readable Authority Information Access method name.
     *
     * @private
     * @param {string} oid The access-method object identifier.
     * @returns {string} The readable method name or original OID.
     */
    private _getAuthorityAccessMethod(oid: string): string {
        switch (oid) {
        case '1.3.6.1.5.5.7.48.1':
            return 'OCSP';
        case '1.3.6.1.5.5.7.48.2':
            return 'Certification Authority Issuer';
        default:
            return oid;
        }
    }
    /**
     * Parses the Authority Information Access extension.
     *
     * @private
     * @param {Uint8Array} value The encoded extension value.
     * @returns {PdfAuthorityInformationAccess[]} The parsed access entries.
     */
    private _parseAuthorityInformationAccess(value: Uint8Array): PdfAuthorityInformationAccess[] {
        const entries: PdfAuthorityInformationAccess[] = [];
        if (!value || value.length === 0) {
            return entries;
        }
        const element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(value)
            ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        element._fromBytes(value);
        const sequence: _PdfAbstractSyntaxElement[] = element._getSequence();
        for (const item of sequence) {
            const parts: _PdfAbstractSyntaxElement[] = item._getSequence();
            if (!parts || parts.length < 2) {
                continue;
            }
            const identifier: _PdfObjectIdentifier = parts[0]._getObjectIdentifier();
            const location: _PdfAbstractSyntaxElement = parts[1];
            if (!identifier || !location._isTagged || !location._isTagged() ||
                location._getTagNumber() !== 6) {
                continue;
            }
            const oid: string = identifier._getDotDelimitedNotation();
            const uri: string = this._decodeAscii(location._getValue());
            if (uri) {
                entries.push({method: this._getAuthorityAccessMethod(oid), uri: uri});
            }
        }
        return entries;
    }
    /**
     * Parses CRL Distribution Point locations from a certificate extension.
     *
     * @private
     * @param {Uint8Array} value The encoded extension value.
     * @returns {PdfCrlDistributionPoint[]} The parsed CRL locations.
     */
    private _parseCrlDistributionPoints(value: Uint8Array): PdfCrlDistributionPoint[] {
        if (!value || value.length === 0) {
            return [];
        }
        const element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(value) ?
            new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        element._fromBytes(value);
        const points: PdfCrlDistributionPoint[] = [];
        this._collectCrlDistributionPoints(element, points);
        return points;
    }
    /**
     * Collects URI values from CRL Distribution Point general names.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element The ASN.1 element to inspect.
     * @param {PdfCrlDistributionPoint[]} points The parsed CRL locations.
     * @returns {void}
     */
    private _collectCrlDistributionPoints(element: _PdfAbstractSyntaxElement, points: PdfCrlDistributionPoint[]): void {
        if (!element) {
            return;
        }
        if (element._isTagged && element._isTagged() &&
            element._getTagNumber() === 6) {
            const uri: string = this._decodeAscii(element._getValue());
            if (uri) {
                points.push({type: 'URI', value: uri});
            }
            return;
        }
        const children: _PdfAbstractSyntaxElement[] = this._getChildElements(element);
        for (const child of children) {
            this._collectCrlDistributionPoints(child, points);
        }
    }
    /**
     * Parses the Subject Alternative Name extension.
     *
     * @private
     * @param {Uint8Array} value The encoded extension value.
     * @returns {PdfSubjectAlternativeName[]} The parsed alternative names.
     */
    private _parseSubjectAlternativeNames(value: Uint8Array): PdfSubjectAlternativeName[] {
        const names: PdfSubjectAlternativeName[] = [];
        if (!value || value.length === 0) {
            return names;
        }
        const element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(value)
            ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        element._fromBytes(value);
        const sequence: _PdfAbstractSyntaxElement[] = element._getSequence();
        for (const item of sequence) {
            const name: PdfSubjectAlternativeName = this._parseSubjectAlternativeName(item);
            if (name) {
                names.push(name);
            }
        }
        return names;
    }
    /**
     * Parses a Subject Alternative Name entry.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element The encoded general name.
     * @returns {PdfSubjectAlternativeName} The parsed alternative name, or `undefined` when unsupported.
     */
    private _parseSubjectAlternativeName(element: _PdfAbstractSyntaxElement): PdfSubjectAlternativeName {
        if (!element || !element._isTagged || !element._isTagged()) {
            return undefined;
        }
        const tagNumber: number = element._getTagNumber();
        const value: Uint8Array = element._getValue();
        switch (tagNumber) {
        case 1:
            return {
                type: PdfSubjectAlternativeNameType.rfc822Name,
                value: this._decodeAscii(value)
            };
        case 2:
            return {
                type: PdfSubjectAlternativeNameType.dnsName,
                value: this._decodeAscii(value)
            };
        case 6:
            return {
                type: PdfSubjectAlternativeNameType.uniformResourceIdentifier,
                value: this._decodeAscii(value)
            };
        case 7:
            return {
                type: PdfSubjectAlternativeNameType.ipAddress,
                value: this._formatIpAddress(value)
            };
        case 8:
            return {
                type: PdfSubjectAlternativeNameType.registeredIdentifier,
                value: this._decodeObjectIdentifier(value)
            };
        default:
            return undefined;
        }
    }
    /**
     * Decodes ASCII bytes into text.
     *
     * @private
     * @param {Uint8Array} value The bytes to decode.
     * @returns {string} The decoded text.
     */
    private _decodeAscii(value: Uint8Array): string {
        if (!value || value.length === 0) {
            return '';
        }
        let result: string = '';
        for (let i: number = 0; i < value.length; i++) {
            result += String.fromCharCode(value[<number>i]);
        }
        return result;
    }
    /**
     * Formats an encoded IP address.
     *
     * @private
     * @param {Uint8Array} value The encoded IP address.
     * @returns {string} The formatted IP address.
     */
    private _formatIpAddress(value: Uint8Array): string {
        if (!value) {
            return '';
        }
        if (value.length === 4) {
            return Array.from(value).join('.');
        }
        if (value.length === 16) {
            const parts: string[] = [];
            for (let i: number = 0; i < value.length; i += 2) {
                const part: number =
                    (value[<number>i] << 8) | value[i + 1];
                parts.push(part.toString(16));
            }
            return parts.join(':');
        }
        return this._toAdobeHex(value);
    }
    /**
     * Decodes DER object-identifier bytes.
     *
     * @private
     * @param {Uint8Array} value The encoded object identifier.
     * @returns {string} The dotted object identifier.
     */
    private _decodeObjectIdentifier(value: Uint8Array): string {
        if (!value || value.length === 0) {
            return '';
        }
        const values: number[] = [
            Math.floor(value[0] / 40),
            value[0] % 40
        ];
        let current: number = 0;
        for (let i: number = 1; i < value.length; i++) {
            current = (current << 7) | (value[<number>i] & 0x7F);
            if ((value[<number>i] & 0x80) === 0) {
                values.push(current);
                current = 0;
            }
        }
        return values.join('.');
    }
    /**
     * Parses the Certificate Policies extension value into structured policy information.
     *
     * @private
     * @param {Uint8Array} policyBytes The raw extension value bytes.
     * @returns {PdfCertificatePolicy[]} The parsed certificate policies.
     */
    private _parseCertificatePolicies(policyBytes: Uint8Array): PdfCertificatePolicy[] {
        const policies: PdfCertificatePolicy[] = [];
        if (!policyBytes || policyBytes.length === 0) {
            return policies;
        }
        const rootElement: _PdfAbstractSyntaxElement = _isBasicEncodingElement(policyBytes)
            ? new _PdfBasicEncodingElement()
            : new _PdfUniqueEncodingElement();
        rootElement._fromBytes(policyBytes);
        const policySequence: _PdfAbstractSyntaxElement[] = rootElement._construction === _ConstructionType.constructed
            ? rootElement._getSequence()
            : [rootElement];
        if (!policySequence || policySequence.length === 0) {
            return policies;
        }
        for (const policyInfoElement of policySequence) {
            try {
                const policy: PdfCertificatePolicy = this._parsePolicyInformation(policyInfoElement);
                if (policy) {
                    policies.push(policy);
                }
            } catch {
                /* Preserve policies that can be parsed and skip malformed entries. */
            }
        }
        return policies;
    }
    /**
     * Parses a single PolicyInformation ASN.1 element into the public policy shape.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} policyInfoElement The PolicyInformation element.
     * @returns {PdfCertificatePolicy} The parsed policy or undefined when malformed.
     */
    private _parsePolicyInformation(policyInfoElement: _PdfAbstractSyntaxElement): PdfCertificatePolicy {
        const parts: _PdfAbstractSyntaxElement[] = policyInfoElement._construction === _ConstructionType.constructed
            ? policyInfoElement._getSequence()
            : [];
        if (!parts || parts.length === 0) {
            return undefined;
        }
        const policyIdentifier: string = parts[0]._getObjectIdentifier()._getDotDelimitedNotation();
        const policy: PdfCertificatePolicy = {
            policyIdentifier: policyIdentifier,
            cpsUrls: [],
            userNotices: []
        };
        if (parts.length > 1) {
            const qualifierContainer: _PdfAbstractSyntaxElement = parts[1];
            const qualifierElements: _PdfAbstractSyntaxElement[] = this._getChildElements(qualifierContainer);
            for (const qualifierInfoElement of (qualifierElements || [])) {
                try {
                    this._parsePolicyQualifierInfo(qualifierInfoElement, policy);
                } catch {
                    /* Preserve qualifiers that can be parsed and skip malformed entries. */
                }
            }
        }
        return policy;
    }
    /**
     * Parses a PolicyQualifierInfo element and appends supported qualifiers to the policy
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} qualifierInfoElement The PolicyQualifierInfo element.
     * @param {PdfCertificatePolicy} policy The policy collecting the parsed qualifiers.
     * @returns {void} nothing.
     */
    private _parsePolicyQualifierInfo(qualifierInfoElement: _PdfAbstractSyntaxElement,
                                      policy: PdfCertificatePolicy): void {
        const parts: _PdfAbstractSyntaxElement[] = qualifierInfoElement._construction === _ConstructionType.constructed
            ? qualifierInfoElement._getSequence()
            : [];
        if (!parts || parts.length < 2) {
            return;
        }
        const qualifierOid: string = parts[0]._getObjectIdentifier()._getDotDelimitedNotation();
        const qualifierValue: _PdfAbstractSyntaxElement = parts[1];
        if (qualifierOid === '1.3.6.1.5.5.7.2.1') {
            const url: string = this._decodePolicyString(qualifierValue);
            if (url !== '') {
                policy.cpsUrls.push(url);
            }
        } else if (qualifierOid === '1.3.6.1.5.5.7.2.2') {
            const notice: PdfCertificatePolicyNotice = this._parseUserNotice(qualifierValue);
            if (notice) {
                policy.userNotices.push(notice);
            }
        }
    }
    /**
     * Parses a UserNotice qualifier value into explicit text and notice reference parts.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} noticeElement The UserNotice element.
     * @returns {PdfCertificatePolicyNotice} The parsed notice or undefined when malformed.
     */
    private _parseUserNotice(noticeElement: _PdfAbstractSyntaxElement): PdfCertificatePolicyNotice {
        if (!noticeElement) {
            return undefined;
        }
        const notice: PdfCertificatePolicyNotice = {};
        const innerParts: _PdfAbstractSyntaxElement[] = this._getChildElements(noticeElement);
        for (const innerElement of (innerParts || [])) {
            let isNoticeRef: boolean = false;
            try {
                isNoticeRef = innerElement._isTagged && innerElement._isTagged()
                    && innerElement._getTagNumber() === 0;
            } catch {
                isNoticeRef = false;
            }
            if (isNoticeRef) {
                const noticeRefElement: _PdfAbstractSyntaxElement = innerElement._getInner
                    ? innerElement._getInner()
                    : innerElement;
                const noticeRefParts: _PdfAbstractSyntaxElement[] = this._getChildElements(noticeRefElement);
                let organization: string;
                const noticeNumbers: number[] = [];
                for (const noticeRefPart of (noticeRefParts || [])) {
                    try {
                        const tagNumber: number = noticeRefPart._getTagNumber();
                        if (tagNumber === 16) {
                            organization = this._decodePolicyString(noticeRefPart);
                        } else {
                            const numbers: _PdfAbstractSyntaxElement[] = this._getChildElements(noticeRefPart);
                            for (const numberElement of (numbers || [])) {
                                try {
                                    noticeNumbers.push(numberElement._getInteger());
                                } catch {
                                    /* Ignore malformed notice numbers. */
                                }
                            }
                        }
                    } catch {
                        /* Ignore malformed notice reference parts. */
                    }
                }
                if (organization !== undefined && organization !== '') {
                    notice.organization = organization;
                }
                if (noticeNumbers.length > 0) {
                    notice.noticeNumbers = noticeNumbers.slice();
                }
            } else {
                const text: string = this._decodePolicyString(innerElement);
                if (text !== '') {
                    notice.explicitText = text;
                }
            }
        }
        return Object.keys(notice).length > 0 ? notice : undefined;
    }
    /**
     * Retrieves the child elements of a constructed ASN.1 container using the
     * sequence, set or components decoders in that order of preference.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element The container element.
     * @returns {_PdfAbstractSyntaxElement[]} The child elements or an empty array.
     */
    private _getChildElements(element: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement[] {
        if (!element) {
            return [];
        }
        if (element._construction !== _ConstructionType.constructed) {
            return [];
        }
        try {
            const sequence: _PdfAbstractSyntaxElement[] = element._getSequence();
            if (sequence && sequence.length > 0) {
                return sequence;
            }
        } catch {
            /* Fall back to components. */
        }
        try {
            return element._getComponents() || [];
        } catch {
            return [];
        }
    }
    /**
     * Decodes a policy string value supporting IA5String, UTF8String, BMPString,
     * VisibleString, PrintableString and NumericString encodings. Uses the raw
     * byte text as fallback so unsupported encodings do not discard the policy text.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element The string element to decode.
     * @returns {string} The decoded string or empty string when decoding fails.
     */
    private _decodePolicyString(element: _PdfAbstractSyntaxElement): string {
        if (!element) {
            return '';
        }
        try {
            return element._getInternationalAlphabetString();
        } catch { /* Fall back to UTF-8. */ }
        try {
            return element._getUtf8String();
        } catch { /* Fall back to BMP. */ }
        try {
            return element._getBmpString();
        } catch { /* Fall back to visible string. */ }
        try {
            return element._getVisibleString();
        } catch { /* Fall back to printable string. */ }
        try {
            return element._getPrintableString();
        } catch { /* Fall back to decoded display text. */ }
        try {
            const bytes: Uint8Array = element._getValue();
            let text: string = '';
            for (let i: number = 0; i < bytes.length; i++) {
                text += String.fromCharCode(bytes[<number>i]);
            }
            return text.trim();
        } catch {
            return '';
        }
    }
    /**
     * Extracts all certificate properties into a single plain object.
     *
     * @returns {Object} An object containing all certificate property values.
     */
    _extractProperties(): {
        subject: string;
        issuer: string;
        subjectSimpleName: string;
        issuerSimpleName: string;
        serialNumber: string;
        validFrom: Date;
        validTo: Date;
        version: number;
        signatureAlgorithm: string;
        issuerUniqueId: Uint8Array;
        subjectUniqueId: Uint8Array; } {
        const signed: _PdfSignedCertificate = this._structure && typeof this._structure._getSignedCertificate === 'function'
            ? this._structure._getSignedCertificate() : undefined;
        const serialBytes: Uint8Array = signed ? signed._serialNumber : undefined;
        return {
            subject: signed ? this._formatDistinguishedName(signed._subject) : '',
            issuer: signed ? this._formatDistinguishedName(signed._issuer) : '',
            subjectSimpleName: signed ? this._extractCommonName(signed._subject) : '',
            issuerSimpleName: signed ? this._extractCommonName(signed._issuer) : '',
            serialNumber: (serialBytes && serialBytes.length > 0)
                ? Array.from(serialBytes).map((b: number) => _padStart(b.toString(16), 2, '0')).join('') : '',
            validFrom: (signed && signed._startDate && typeof signed._startDate._toDate === 'function')
                ? signed._startDate._toDate() : undefined,
            validTo: (signed && signed._endDate && typeof signed._endDate._toDate === 'function')
                ? signed._endDate._toDate() : undefined,
            version: (signed && typeof signed._getVersion === 'function') ? signed._getVersion() : 0,
            signatureAlgorithm: (signed && signed._signature && signed._signature._objectID)
                ? signed._signature._objectID.toString() : '',
            issuerUniqueId: (signed && signed._issuerID && signed._issuerID._data)
                ? signed._issuerID._data : undefined,
            subjectUniqueId: (signed && signed._subjectID && signed._subjectID._data)
                ? signed._subjectID._data : undefined
        };
    }
    /**
     * Converts bytes to Adobe-compatible uppercase hexadecimal text.
     *
     * @private
     * @param {Uint8Array} value The bytes to format.
     * @returns {string} Space-separated uppercase hexadecimal octets.
     */
    private _toAdobeHex(value: Uint8Array): string {
        if (!value || value.length === 0) {
            return '';
        }
        return Array.from(value)
            .map((item: number): string => {
                return _padStart(item.toString(16), 2, '0').toUpperCase();
            })
            .join(' ');
    }
    /**
     * Extracts the CN (Common Name) value from a distinguished name object.
     *
     * @private
     * @param {any} dn The distinguished name to extract CN from.
     * @returns {string} The CN value, or full formatted DN as fallback.
     */
    private _extractCommonName(dn: any): string { //eslint-disable-line
        if (!dn || !dn._ordering || !dn._values) {
            return '';
        }
        const cnOid: string = '2.5.4.3';
        for (let i: number = 0; i < dn._ordering.length; i++) {
            const oid: string = dn._ordering[<number>i] ? dn._ordering[<number>i].toString() : '';
            if (oid === cnOid) {
                return dn._values[<number>i] || '';
            }
        }
        return this._formatDistinguishedName(dn);
    }
    /**
     * Formats an X.509 distinguished name into a readable string.
     *
     * @private
     * @param {_PdfX509Name} input The distinguished name to format.
     * @returns {string} Formatted DN string such as `"CN=Test, O=Org, C=US"`.
     */
    private _formatDistinguishedName(input: _PdfX509Name): string {
        if (!input || !input._ordering || !input._values) {
            return '';
        }
        const symbolMap: { [key: string]: string } = {
            '2.5.4.3': 'CN',
            '2.5.4.6': 'C',
            '2.5.4.7': 'L',
            '2.5.4.8': 'ST',
            '2.5.4.10': 'O',
            '2.5.4.11': 'OU',
            '1.2.840.113549.1.9.1': 'E',
            '2.5.4.12': 'T',
            '2.5.4.5': 'SN'
        };
        const parts: string[] = [];
        for (let i: number = 0; i < input._ordering.length; i++) {
            const oid: string = input._ordering[<number>i] ? input._ordering[<number>i].toString() : '';
            const label: string = symbolMap[<string>oid] || oid;
            const value: string = input._values[<number>i] || '';
            parts.push(`${label}=${value}`);
        }
        return parts.join(', ');
    }
    /**
     * Retrieve the certificate extensions wrapper when present.
     *
     * @private
     * @returns {_PdfX509Extensions} Certificate extensions container.
     */
    _getExtensions(): _PdfX509Extensions {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getVersion() === 3 ? signed._extensions : new _PdfX509Extensions();
    }
    /**
     * Retrieves the certificate public key and converts it into a cipher parameter instance.
     *
     * @private
     * @param {boolean} [isPrivate=true] - Indicates whether the returned key parameter represents a private key. When false, a public key parameter is created.
     * @returns {_PdfCipherParameter} The generated key parameter object.
     */
    _getPublicKey(isPrivate: boolean = true): _PdfCipherParameter {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return this._createKey(isPrivate, signed._publicKeyInformation);
    }
    /**
     * Create a cipher parameter object from SubjectPublicKeyInfo.
     *
     * @private
     * @param {boolean} isPrivate - Indicates whether the resulting parameter should9 * be created as a private or public key representation
     * @param {_PdfPublicKeyInformation} publicKeyInfo - The SubjectPublicKeyInfo11 * containing the algorithm identifier and encoded public key data.
     * @returns {_PdfCipherParameter} The generated cipher parameter object.
     * @throws {Error} Thrown if the public key algorithm is not supported.
     */
    _createKey(isPrivate: boolean, publicKeyInfo: _PdfPublicKeyInformation): _PdfCipherParameter {
        const algOID: string = publicKeyInfo._algorithms._objectID.toString();
        const publicKeyElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        publicKeyElement._fromBytes(publicKeyInfo._publicKey._getBytes());
        this._publicKeyBytes = publicKeyInfo._publicKey._data;
        if (algOID === '1.2.840.113549.1.1.1') {
            return this._parsePublicKey(isPrivate, publicKeyElement);
        }
        throw new Error('Unsupported Algorithm');
    }
    /**
     * Parse an ASN.1 public key element (e.g., RSA modulus/exponent) into parameters.
     *
     * @private
     * @param {boolean} isPrivate - Indicates whether the resulting parameter should9 * be marked as a private or public key representation.
     * @param {_PdfAbstractSyntaxElement} publicKey - The ASN.1 encoded RSA public key11 * structure containing the modulus and public exponent values.
     * @returns {_PdfCipherParameter} The parsed RSA key parameters.
     * @throws {Error} Thrown if the RSA public key structure is invalid or incomplete.
     */
    _parsePublicKey(isPrivate: boolean, publicKey: _PdfAbstractSyntaxElement): _PdfCipherParameter {
        const seq: _PdfAbstractSyntaxElement[] = publicKey._getSequence();
        if (!seq || seq.length < 2) {
            throw new Error('Invalid RSA public key structure');
        }
        const modulus: Uint8Array = seq[0]._getValue();
        const exponent: Uint8Array = seq[1]._getValue();
        return new _PdfRonCipherParameter(isPrivate, modulus, exponent);
    }
    /**
     * Return the DER bytes for the tbsCertificate (to-be-signed certificate).
     *
     * @private
     * @returns {Uint8Array} DER-encoded tbsCertificate bytes.
     */
    _getTobeSignedCertificate(): Uint8Array {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getDistinguishEncoded();
    }
    /**
     * Returns the DER encoding of the complete certificate structure.
     *
     * @private
     * @returns {Uint8Array} The DER-encoded certificate bytes.
     */
    _getEncoded(): Uint8Array {
        if (!this._structure || typeof this._structure._getDerEncoded !== 'function') {
            return new Uint8Array(0);
        }
        return this._structure._getDerEncoded();
    }
    /**
     * Alias for `_getEncoded` returning the encoded certificate bytes.
     *
     * @private
     * @returns {Uint8Array} DER-encoded certificate bytes.
     */
    _getEncodedString(): Uint8Array {
        return this._getEncoded();
    }
    /**
     * Verifies the certificate signature using the provided public key.
     *
     * @private
     * @param {_PdfCipherParameter} key The public key parameters used to verify the signature.
     * @returns {void} This method does not return a value. Throws an error if validation fails.
     */
    _verify(key: _PdfCipherParameter): void {
        const sigName: string = this._structure._signatureAlgorithmIdentifier._objectID.toString();
        const su: _PdfSignerUtilities = new _PdfSignerUtilities();
        const signature: _ISigner = su._getSigner(sigName);
        this._checkSignature(key, signature);
    }
    /**
     * Validates the certificate signature against the given public key and signer.
     *
     * @private
     * @param {_PdfCipherParameter} publicKey The public key used for signature verification.
     * @param {_ISigner} signature The initialized signer corresponding to the certificate algorithm.
     * @returns {void} This method does not return a value. Throws an error if validation fails.
     */
    private _checkSignature(publicKey: _PdfCipherParameter, signature: _ISigner): void {
        const IssuerName: string = this._structure._signatureAlgorithmIdentifier._objectID._getDotDelimitedNotation();
        const SubjectName: string = this._structure._toBeSignedCertificate._signature._objectID._getDotDelimitedNotation();
        if (!(IssuerName === SubjectName)) {
            throw new Error('signature algorithm in TBS certificate not same as outer certificate');
        }
        signature._initialize(false, publicKey);
        const b: Uint8Array = this._getTobeSignedCertificate();
        signature._blockUpdate(b, 0, b.length);
        const sig: Uint8Array = this._structure._signature._getBytes();
        const ok: boolean = signature._validateSignature(sig);
        if (!ok) {
            throw new Error('Public key presented not for certificate signature');
        }
    }
}
/**
 * Simple container for a certificate and cached hash state.
 *
 * @private
 */
export class _PdfX509Certificates {
    /**
     * The contained X.509 certificate.
     *
     * @private
     * @type {_PdfX509Certificate}
     */
    _certificate: _PdfX509Certificate;
    /**
     * Cached hash value for this certificate (implementation specific).
     *
     * @private
     * @type {number}
     */
    _hashValue: number;
    /**
     * True when `_hashValue` has been computed and stored.
     *
     * @private
     * @type {boolean}
     */
    _hashValueSet: boolean = false;
    constructor(certificates: _PdfX509Certificate) {
        this._certificate = certificates;
    }
}
