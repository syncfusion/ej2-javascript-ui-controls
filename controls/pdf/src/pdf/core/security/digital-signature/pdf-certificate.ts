import { _PdfObjectIdentifier } from './asn1/identifier-mapping';
import { _PdfPublicKeyCryptographyCertificate } from './pdf-cryptography-certificate';
import { _PdfSignedCertificate } from './x509/x509-signed-certificate';
import { _PdfX509Certificate, _PdfX509Certificates } from './x509/x509-certificate';
import { _PdfX509CertificateStructure } from './x509/x509-certificate-structure';
import { _PdfX509Name } from './x509/x509-name';
import { _PdfSignerUtilities } from './signature/signature-utilities';
import { _Sha1 } from '../encryptors/secureHash-algorithm1';
import { _Sha256 } from '../encryptors/secureHash-algorithm256';
import { _bytesToHex } from '../../utils';
import { PdfCertificatePolicy, PdfCertificatePolicyNotice } from './signature/signature-properties';
import { PdfAuthorityInformationAccess, PdfCrlDistributionPoint, PdfSubjectAlternativeName } from '../../pdf-document-helper';
/**
 * High-level certificate wrapper providing convenient accessors and loaders.
 *
 * @private
 */
export class _PdfCertificate {
    /**
     * Certificate version number.
     *
     * @private
     * @type {number}
     */
    _version: number;
    /**
     * Certificate serial number bytes.
     *
     * @private
     * @type {Uint8Array}
     */
    _serialNumber: Uint8Array;
    /**
     * Issuer distinguished name string.
     *
     * @private
     * @type {string}
     */
    _issuerName: string;
    /**
     * Complete issuer distinguished name.
     *
     * @private
     * @type {string}
     */
    _issuer: string;
    /**
     * Subject distinguished name string.
     *
     * @private
     * @type {string}
     */
    _subjectName: string;
    /**
     * Complete subject distinguished name.
     *
     * @private
     * @type {string}
     */
    _subject: string;
    /**
     * Length in bytes of the signature (if known).
     *
     * @private
     * @type {number}
     */
    _signatureLength: number;
    /**
     * Certificate validity end date.
     *
     * @private
     * @type {Date}
     */
    _validTo: Date;
    /**
     * Certificate validity start date.
     *
     * @private
     * @type {Date}
     */
    _validFrom: Date;
    /**
     * Optional PKCS#12 / PKCS#7 wrapper when loaded from such formats.
     *
     * @private
     * @type {_PdfPublicKeyCryptographyCertificate}
     */
    _publicKeyCryptographyCertificate: _PdfPublicKeyCryptographyCertificate;
    /**
     * True when this instance was initialized from a PKCS container.
     *
     * @private
     * @type {boolean}
     */
    _isPublicKeyCryptographyCertificate: boolean;
    /**
     * Chain of parsed X.509 certificate objects.
     *
     * @private
     * @type {_PdfX509Certificate[]}
     */
    _chains: _PdfX509Certificate[] = [];
    /**
     * Certificate signature algorithm name.
     *
     * @private
     */
    _signatureAlgorithm: string;
    /**
     * Certificate signature algorithm object identifier.
     *
     * @private
     */
    _signatureAlgorithmOid: string;
    /**
     * Certificate key usage bits.
     *
     * @private
     */
    _keyUsage: boolean[];
    /**
     * SHA-1 thumbprint of the certificate.
     *
     * @private
     */
    _sha1Thumbprint: string;
    /**
     * SHA-256 thumbprint of the certificate.
     *
     * @private
     */
    _sha256Thumbprint: string;
    /**
     * Maps X.509 attribute OIDs to distinguished-name labels.
     *
     * @private
     * @type {Record<string, string>}
     */
    _objectIdentifierToAttributeMap: Record<string, string> = {
        '2.5.4.3': 'CN',
        '2.5.4.6': 'C',
        '2.5.4.7': 'L',
        '2.5.4.8': 'ST',
        '2.5.4.10': 'O',
        '2.5.4.11': 'OU',
        '1.2.840.113549.1.9.1': 'E'
    };
    /**
     * Individual subject distinguished-name attributes.
     *
     * @private
     * @type {Object}
     */
    _subjectAttributes: {
        commonName: string;
        organization: string;
        organizationalUnit: string;
        emailAddress: string;
        country: string;
        state: string;
        locality: string;
    };
    /**
     * Individual issuer distinguished-name attributes.
     *
     * @private
     * @type {Object}
     */
    _issuerAttributes: {
        commonName: string;
        organization: string;
        organizationalUnit: string;
        emailAddress: string;
        country: string;
        state: string;
        locality: string;
    };
    /**
     * Extended key usage names defined by the certificate.
     *
     * @private
     * @type {string[]}
     */
    _extendedKeyUsage: string[];
    /**
     * Key usage display names defined by the certificate.
     *
     * @private
     */
    _keyUsageNames: string[];
    /**
     * Maps X.509 key usage bits.
     */
    private _keyUsageDisplayNames: string[] = ['Digital Signature', 'Non-Repudiation', 'Key Encipherment',
        'Data Encipherment', 'Key Agreement', 'Sign Certificate (CA)', 'Sign CRL', 'Encipher Only', 'Decipher Only'];
    /**
     * Certificate policies defined by the certificate.
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
    _x509Data: string;
    /**
     * Subject Key Identifier in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _subjectKeyIdentifier: string;
    /**
     * Authority Key Identifier in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _authorityKeyIdentifier: string;
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
    _publicKey: string;
    /**
     * SHA-1 digest of the certificate public key in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _sha1PublicKeyHash: string;
    /**
     * MD5 digest of the DER-encoded certificate in Adobe-compatible hexadecimal format.
     *
     * @private
     * @type {string}
     */
    _md5Thumbprint: string;
    /**
     * Initializes a certificate from PFX data or a parsed X.509 certificate.
     *
     * @private
     * @param {Uint8Array | _PdfX509Certificate} certificate Certificate data or parsed certificate.
     * @param {string} [password] Password used to open the PFX certificate.
     */
    constructor(certificate: Uint8Array | _PdfX509Certificate, password?: string) {
        if (certificate instanceof Uint8Array && password !== null && typeof password !== 'undefined') {
            this._initializePublicKeyCryptographyCertificate(certificate, password);
        } else if (certificate instanceof _PdfX509Certificate) {
            this._loadDetailsFromCertificate(certificate as _PdfX509Certificate);
        }
    }
    /**
     * Initialize from PKCS#12/PKCS#7 container bytes using the provided password.
     *
     * @private
     * @param {Uint8Array} certificateBytes - PKCS container bytes.
     * @param {string} password - Password used to decrypt the container.
     * @returns {void}
     */
    _initializePublicKeyCryptographyCertificate(certificateBytes: Uint8Array, password: string): void {
        const pkcsCertificate: _PdfPublicKeyCryptographyCertificate = new _PdfPublicKeyCryptographyCertificate(certificateBytes, password);
        if (pkcsCertificate) {
            this._publicKeyCryptographyCertificate = pkcsCertificate;
            let certificateAlias: string = '';
            pkcsCertificate._keys.forEach((keyEntry: any, alias: string) => { // eslint-disable-line
                if (keyEntry && certificateAlias === '') {
                    certificateAlias = alias;
                }
            });
            const certificates: _PdfX509Certificates = pkcsCertificate._getCertificate(certificateAlias);
            if (certificates) {
                this._loadDetailsFromCertificate(certificates._certificate);
            }
        }
    }
    /**
     * Populate wrapper fields from a parsed `_PdfX509Certificate` instance.
     *
     * @private
     * @param {_PdfX509Certificate} certificate - Parsed X.509 certificate.
     * @returns {void}
     */
    _loadDetailsFromCertificate(certificate: _PdfX509Certificate): void {
        const structure: _PdfX509CertificateStructure = certificate._structure;
        const signature: _PdfSignedCertificate = structure._getSignedCertificate();
        const certificateProperties: ReturnType<_PdfX509Certificate['_extractProperties']> =
            certificate._extractProperties();
        this._issuerName = this._getUniqueAttributes(signature._issuer, 'CN');
        if (this._issuerName === '') {
            this._issuerName = this._getUniqueAttributes(signature._issuer, 'OU');
        }
        this._issuer = certificateProperties.issuer;
        this._issuerAttributes = {
            commonName: this._getUniqueAttributes(signature._issuer, 'CN'),
            organization: this._getUniqueAttributes(signature._issuer, 'O'),
            organizationalUnit: this._getUniqueAttributes(signature._issuer, 'OU'),
            emailAddress: this._getUniqueAttributes(signature._issuer, 'E'),
            country: this._getUniqueAttributes(signature._issuer, 'C'),
            state: this._getUniqueAttributes(signature._issuer, 'ST'),
            locality: this._getUniqueAttributes(signature._issuer, 'L')
        };
        this._subjectName = this._getUniqueAttributes(signature._subject, 'CN');
        this._subject = certificateProperties.subject;
        this._subjectAttributes = {
            commonName: this._getUniqueAttributes(signature._subject, 'CN'),
            organization: this._getUniqueAttributes(signature._subject, 'O'),
            organizationalUnit: this._getUniqueAttributes(signature._subject, 'OU'),
            emailAddress: this._getUniqueAttributes(signature._subject, 'E'),
            country: this._getUniqueAttributes(signature._subject, 'C'),
            state: this._getUniqueAttributes(signature._subject, 'ST'),
            locality: this._getUniqueAttributes(signature._subject, 'L')
        };
        this._validFrom = signature._startDate._toDate();
        this._validTo = signature._endDate._toDate();
        this._version = signature._getVersion();
        const serialNumberBytes: Uint8Array = signature._serialNumber;
        this._serialNumber = serialNumberBytes;
        const signerUtilities: _PdfSignerUtilities = new _PdfSignerUtilities();
        this._signatureAlgorithmOid = certificateProperties.signatureAlgorithm;
        this._signatureAlgorithm = signerUtilities._getCanonicalAlgorithmName(this._signatureAlgorithmOid);
        this._extendedKeyUsage = certificate._extendedKeyUsage
            ? certificate._extendedKeyUsage.map((oid: string): string => this._getExtendedKeyUsageName(oid)) : [];
        this._keyUsage = certificate._keyUsage ? certificate._keyUsage.slice() : null;
        this._keyUsageNames = certificate._keyUsage ? this._getKeyUsageNames(certificate._keyUsage) : null;
        this._certificatePolicies = certificate._certificatePolicies
            ? this._cloneCertificatePolicies(certificate._certificatePolicies) : [];
        this._x509Data = certificate._x509Data;
        const encodedCertificate: Uint8Array = certificate._getEncoded();
        this._sha1Thumbprint = this._getThumbprint(encodedCertificate, 'SHA-1');
        this._sha256Thumbprint = this._getThumbprint(encodedCertificate, 'SHA-256');
        this._subjectKeyIdentifier = certificate._subjectKeyIdentifier;
        this._authorityKeyIdentifier = certificate._authorityKeyIdentifier;
        this._subjectAlternativeNames = certificate._subjectAlternativeNames
            ? certificate._subjectAlternativeNames.map((item: PdfSubjectAlternativeName):
            PdfSubjectAlternativeName => {
                return {type: item.type, value: item.value};
            }) : [];
        this._rfc822EmailAddresses = certificate._rfc822EmailAddresses
            ? certificate._rfc822EmailAddresses.slice() : [];
        this._crlDistributionPoints = certificate._crlDistributionPoints
            ? certificate._crlDistributionPoints.map(
                (item: PdfCrlDistributionPoint):
                PdfCrlDistributionPoint => {
                    return {type: item.type, value: item.value};
                })
            : [];
        this._authorityInformationAccess =
            certificate._authorityInformationAccess
                ? certificate._authorityInformationAccess.map(
                    (item: PdfAuthorityInformationAccess):
                    PdfAuthorityInformationAccess => {
                        return {method: item.method, uri: item.uri};
                    })
                : [];
        this._publicKey = certificate._publicKey;
        this._sha1PublicKeyHash = certificate._sha1PublicKeyHash;
        this._md5Thumbprint = certificate._md5Thumbprint;
        this._isPublicKeyCryptographyCertificate = true;
    }
    /**
     * Extract a single attribute value (e.g., CN) from an `_PdfX509Name` instance.
     *
     * @private
     * @param {_PdfX509Name} x509Name - Parsed distinguished name.
     * @param {string} attribute - Attribute short name or OID to look up.
     * @returns {string} The attribute value or empty string when not present.
     */
    _getUniqueAttributes(x509Name: _PdfX509Name, attribute: string): string {
        const targetOid: string = Object.keys(this._objectIdentifierToAttributeMap).find(
            (oid: string) => this._objectIdentifierToAttributeMap[<string>oid] === attribute || oid === attribute
        ) || attribute;
        for (let i: number = 0; i < x509Name._ordering.length; i++) {
            const oid: _PdfObjectIdentifier = x509Name._ordering[<number>i];
            if (oid.toString() === targetOid) {
                const val: string = x509Name._values[<number>i];
                return val ? val.trim() : '';
            }
        }
        return '';
    }
    /**
     * Computes the certificate thumbprint using the specified algorithm.
     *
     * @private
     * @param {Uint8Array} data DER-encoded certificate data.
     * @param {'SHA-1' | 'SHA-256'} algorithm Hash algorithm.
     * @returns {string} Uppercase hexadecimal certificate thumbprint.
     */
    _getThumbprint(data: Uint8Array, algorithm: 'SHA-1' | 'SHA-256'): string {
        if (!data || data.length === 0) {
            return '';
        }
        let hash: Uint8Array;
        if (algorithm === 'SHA-1') {
            hash = new _Sha1()._hash(data, 0, data.length);
        } else {
            hash = new _Sha256()._hash(data, 0, data.length);
        }
        return _bytesToHex(hash).toUpperCase();
    }
    /**
     * Converts the parsed key usage bits into readable display names intended usage.
     *
     * @private
     * @param {boolean[]} keyUsage The parsed key usage bits.
     * @returns {string[]} The index-aligned key usage display names.
     */
    private _getKeyUsageNames(keyUsage: boolean[]): string[] {
        if (!keyUsage || keyUsage.length === 0) {
            return [];
        }
        const names: string[] = [];
        for (let i: number = 0; i < this._keyUsageDisplayNames.length; i++) {
            names.push(keyUsage[<number>i] ? this._keyUsageDisplayNames[<number>i] : '');
        }
        return names;
    }
    /**
     * Maps an extended key usage object identifier to a readable name.
     * Known usages return Adobe-style display names and unknown object
     * identifiers are preserved using the object identifier itself as the name.
     *
     * @private
     * @param {string} oid The extended key usage object identifier.
     * @returns {string} The readable extended key usage name.
     */
    _getExtendedKeyUsageName(oid: string): string {
        switch (oid) {
        case '1.3.6.1.5.5.7.3.1':
            return 'Server Authentication';
        case '1.3.6.1.5.5.7.3.2':
            return 'Client Authentication';
        case '1.3.6.1.5.5.7.3.3':
            return 'Code Signing';
        case '1.3.6.1.5.5.7.3.4':
            return 'Email Protection';
        case '1.3.6.1.5.5.7.3.8':
            return 'Time Stamping';
        case '1.3.6.1.5.5.7.3.9':
            return 'OCSP Signing';
        case '1.3.6.1.4.1.311.10.3.12':
            return 'Document Signing';
        case '1.3.6.1.4.1.311.20.2.2':
            return 'Smart Card Logon';
        default:
            return oid;
        }
    }
    /**
     * Creates a deep copy of the parsed certificate policies so that the internal
     * certificate data stays independent from public array mutation.
     *
     * @private
     * @param {PdfCertificatePolicy[]} policies The parsed certificate policies.
     * @returns {PdfCertificatePolicy[]} The cloned certificate policies.
     */
    _cloneCertificatePolicies(policies: PdfCertificatePolicy[]): PdfCertificatePolicy[] {
        if (!policies) {
            return [];
        }
        return policies.map((policy: PdfCertificatePolicy): PdfCertificatePolicy => {
            const notices: PdfCertificatePolicyNotice[] = (policy.userNotices || []).map((notice: PdfCertificatePolicyNotice)
            : PdfCertificatePolicyNotice => {
                return {
                    explicitText: notice.explicitText,
                    organization: notice.organization,
                    noticeNumbers: notice.noticeNumbers ? notice.noticeNumbers.slice() : undefined
                };
            });
            return {
                policyIdentifier: policy.policyIdentifier,
                description: policy.description,
                cpsUrls: policy.cpsUrls ? policy.cpsUrls.slice() : [],
                userNotices: notices
            };
        });
    }
}
