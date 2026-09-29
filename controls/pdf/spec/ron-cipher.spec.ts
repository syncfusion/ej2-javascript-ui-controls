import { _PdfRsaPublicKeyParam } from '../src/pdf/core/security/digital-signature/signature/ron-cipher';
import { _PdfX509Certificate } from '../src/pdf/core/security/digital-signature/x509/x509-certificate';
import { _PdfX509Name } from '../src/pdf/core/security/digital-signature/x509/x509-name';
import { _PdfSignedCertificate } from '../src/pdf/core/security/digital-signature/x509/x509-signed-certificate';
import { _PdfObjectIdentifier } from '../src/pdf/core/security/digital-signature/asn1/identifier-mapping';
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import { _PdfX509ExtensionBase } from '../src/pdf/core/security/digital-signature/x509/x509-extensions';
import { _PdfX509CertificateStructure } from '../src/pdf/core/security/digital-signature/x509/x509-certificate-structure';
import {_PdfCipherParameter,_PdfRonCipherParameter} from '../src/pdf/core/security/digital-signature/x509/x509-cipher-handler';
import {_PdfPublicKeyInformation} from '../src/pdf/core/security/digital-signature/x509/x509-certificate-key';
import {_PdfSignerUtilities} from '../src/pdf/core/security/digital-signature/signature/signature-utilities';
import {_ISigner} from '../src/pdf/core/security/digital-signature/signature/pdf-interfaces';
import { PdfX509CertificateProperties } from '../src/pdf/core/pdf-type';
describe('_PdfRsaPublicKeyParam mutation coverage', () => {
    it('should disable certification verification by default', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        // Act
        const publicKeyParameter: _PdfRsaPublicKeyParam =
            new _PdfRsaPublicKeyParam(modulus, exponent);
        // Assert
        expect(publicKeyParameter._enableCertificationVerification).toBeFalsy();
    });
    it('should return true when a matching key has no exponent property', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const emptyExponent: Uint8Array = new Uint8Array(0);
        const publicKeyParameter: _PdfRsaPublicKeyParam =
            new _PdfRsaPublicKeyParam(modulus, emptyExponent);
        const comparedKey: { modulus: Uint8Array } = {
            modulus: new Uint8Array([1, 2, 3])
        };
        // Act
        const isEqual: boolean = publicKeyParameter._equals(comparedKey);
        // Assert
        expect(isEqual).toBeTruthy();
    });
    it('should return false when only the exponent is different', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        const publicKeyParameter: _PdfRsaPublicKeyParam =
            new _PdfRsaPublicKeyParam(modulus, exponent);
        const comparedKey: {
            modulus: Uint8Array;
            exponent: Uint8Array;
        } = {
            modulus: new Uint8Array([1, 2, 3]),
            exponent: new Uint8Array([3])
        };
        // Act
        const isEqual: boolean = publicKeyParameter._equals(comparedKey);
        // Assert
        expect(isEqual).toBeFalsy();
    });
    it('should return false when only the modulus is different', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        const publicKeyParameter: _PdfRsaPublicKeyParam =
            new _PdfRsaPublicKeyParam(modulus, exponent);
        const comparedKey: {
            modulus: Uint8Array;
            exponent: Uint8Array;
        } = {
            modulus: new Uint8Array([1, 2, 4]),
            exponent: new Uint8Array([1, 0, 1])
        };
        // Act
        const isEqual: boolean = publicKeyParameter._equals(comparedKey);
        // Assert
        expect(isEqual).toBeFalsy();
    });
});
describe('_PdfX509Certificate mutation coverage', () => {
    interface CertificatePrivateAccess {
        _extractCommonName(name: _PdfX509Name): string;
        _formatDistinguishedName(name: _PdfX509Name): string;
    }
    const originalGetExtension:
        (identifier: _PdfObjectIdentifier) => _PdfAbstractSyntaxElement =
        _PdfX509ExtensionBase.prototype._getExtension;
    afterEach(() => {
        _PdfX509ExtensionBase.prototype._getExtension =
            originalGetExtension;
    });
    function createIdentifier(value: string): _PdfObjectIdentifier {
    const identifier: {
        toString: () => string;
        _getDotDelimitedNotation: () => string;
    } = {
        toString: (): string => value,
        _getDotDelimitedNotation: (): string => value
    };
    return identifier as unknown as _PdfObjectIdentifier;
}
    function createName(
        identifiers: string[],
        values: string[]
    ): _PdfX509Name {
        const name: _PdfX509Name = {
            _ordering: identifiers.map((value: string) => {
                return createIdentifier(value);
            }),
            _values: values
        } as _PdfX509Name;
        return name;
    }
    function createCertificate(
        signedCertificate?: _PdfSignedCertificate
    ): _PdfX509Certificate {
        _PdfX509ExtensionBase.prototype._getExtension =
            function (
                identifier: _PdfObjectIdentifier
            ): _PdfAbstractSyntaxElement {
                expect(identifier.toString()).toBe('0.2.5.29.15');
                return undefined;
            };
        const structure: _PdfX509CertificateStructure = {
            _getSignedCertificate: (): _PdfSignedCertificate => {
                return signedCertificate;
            }
        } as _PdfX509CertificateStructure;
        return new _PdfX509Certificate(structure);
    }
    it('should set the structure and null key usage when the extension is absent', () => {
        // Arrange
        _PdfX509ExtensionBase.prototype._getExtension =
            function (
                identifier: _PdfObjectIdentifier
            ): _PdfAbstractSyntaxElement {
                expect(identifier.toString()).toBe('0.2.5.29.15');
                return undefined;
            };
        const structure: _PdfX509CertificateStructure = {
            _getSignedCertificate: (): _PdfSignedCertificate => {
                return undefined;
            }
        } as _PdfX509CertificateStructure;
        // Act
        const certificate: _PdfX509Certificate =
            new _PdfX509Certificate(structure);
        // Assert
        expect(certificate._structure).toBe(structure);
        expect(certificate._keyUsage).toBeNull();
        expect(certificate._publicKeyBytes).toBeUndefined();
    });
    it('should return empty extracted properties when the structure is undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        certificate._structure = undefined;
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.subject).toBe('');
        expect(properties.issuer).toBe('');
        expect(properties.serialNumber).toBe('');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(0);
        expect(properties.signatureAlgorithm).toBe('');
        expect(properties.issuerUniqueId).toBeUndefined();
        expect(properties.subjectUniqueId).toBeUndefined();
    });
    it('should return empty extracted properties when signed certificate is undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate(undefined);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.subject).toBe('');
        expect(properties.issuer).toBe('');
        expect(properties.serialNumber).toBe('');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(0);
        expect(properties.signatureAlgorithm).toBe('');
        expect(properties.issuerUniqueId).toBeUndefined();
        expect(properties.subjectUniqueId).toBeUndefined();
    });
    it('should return every exact extracted certificate property', () => {
        // Arrange
        const startDate: Date =
            new Date(Date.UTC(2025, 0, 1));
        const endDate: Date =
            new Date(Date.UTC(2030, 0, 1));
        const issuerUniqueId: Uint8Array =
            new Uint8Array([1, 2, 3]);
        const subjectUniqueId: Uint8Array =
            new Uint8Array([4, 5, 6]);
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3', '2.5.4.10'],
                ['Document Signer', 'Syncfusion']
            ),
            _issuer: createName(
                ['2.5.4.3', '2.5.4.10'],
                ['Certificate Authority', 'Syncfusion']
            ),
            _serialNumber: new Uint8Array([
                0,
                1,
                10,
                255
            ]),
            _startDate: {
                _toDate: (): Date => startDate
            },
            _endDate: {
                _toDate: (): Date => endDate
            },
            _getVersion: (): number => 3,
            _signature: {
                _objectID:
                    createIdentifier('1.2.840.113549.1.1.11')
            },
            _issuerID: {
                _data: issuerUniqueId
            },
            _subjectID: {
                _data: subjectUniqueId
            }
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.subjectSimpleName)
            .toBe('Document Signer');
        expect(properties.issuerSimpleName)
            .toBe('Certificate Authority');
        expect(properties.serialNumber).toBe('00010aff');
        expect(properties.validFrom).toBe(startDate);
        expect(properties.validTo).toBe(endDate);
        expect(properties.version).toBe(3);
        expect(properties.signatureAlgorithm)
            .toBe('1.2.840.113549.1.1.11');
        expect(properties.issuerUniqueId).toBe(issuerUniqueId);
        expect(properties.subjectUniqueId).toBe(subjectUniqueId);
    });
    it('should return an empty serial number for an empty serial array', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3'],
                ['Document Signer']
            ),
            _issuer: createName(
                ['2.5.4.3'],
                ['Certificate Authority']
            ),
            _serialNumber: new Uint8Array(0),
            _getVersion: (): number => 3
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const serialNumber: string =
            certificate._extractProperties().serialNumber;
        // Assert
        expect(serialNumber).toBe('');
    });
    it('should preserve leading zero bytes in a serial number', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3'],
                ['Document Signer']
            ),
            _issuer: createName(
                ['2.5.4.3'],
                ['Certificate Authority']
            ),
            _serialNumber: new Uint8Array([
                0,
                5,
                15,
                16,
                255
            ]),
            _getVersion: (): number => 3
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const serialNumber: string =
            certificate._extractProperties().serialNumber;
        // Assert
        expect(serialNumber).toBe('00050f10ff');
    });
    it('should return undefined dates when start and end dates are absent', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3'],
                ['Document Signer']
            ),
            _issuer: createName(
                ['2.5.4.3'],
                ['Certificate Authority']
            ),
            _serialNumber: new Uint8Array([1]),
            _startDate: undefined,
            _endDate: undefined,
            _getVersion: (): number => 3
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
    });
    it('should return exact start and end dates', () => {
        // Arrange
        const startDate: Date =
            new Date(Date.UTC(2025, 0, 1));
        const endDate: Date =
            new Date(Date.UTC(2030, 0, 1));
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3'],
                ['Document Signer']
            ),
            _issuer: createName(
                ['2.5.4.3'],
                ['Certificate Authority']
            ),
            _serialNumber: new Uint8Array([1]),
            _startDate: {
                _toDate: (): Date => startDate
            },
            _endDate: {
                _toDate: (): Date => endDate
            },
            _getVersion: (): number => 3
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.validFrom).toBe(startDate);
        expect(properties.validTo).toBe(endDate);
    });
    it('should return default optional metadata when optional values are absent', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: createName(
                ['2.5.4.3'],
                ['Document Signer']
            ),
            _issuer: createName(
                ['2.5.4.3'],
                ['Certificate Authority']
            ),
            _serialNumber: undefined,
            _startDate: undefined,
            _endDate: undefined,
            _getVersion: undefined,
            _signature: undefined,
            _issuerID: undefined,
            _subjectID: undefined
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.serialNumber).toBe('');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(0);
        expect(properties.signatureAlgorithm).toBe('');
        expect(properties.issuerUniqueId).toBeUndefined();
        expect(properties.subjectUniqueId).toBeUndefined();
    });
    it('should return an empty common name for an undefined name', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(undefined);
        // Assert
        expect(commonName).toBe('');
    });
    it('should return an empty common name when ordering is undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = {
            _ordering: undefined,
            _values: ['Document Signer']
        } as _PdfX509Name;
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(name);
        // Assert
        expect(commonName).toBe('');
    });
    it('should return an empty common name when values are undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = {
            _ordering: [
                createIdentifier('2.5.4.3')
            ],
            _values: undefined
        } as _PdfX509Name;
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(name);
        // Assert
        expect(commonName).toBe('');
    });
    it('should return the first exact common name', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            [
                '2.5.4.10',
                '2.5.4.3',
                '2.5.4.3'
            ],
            [
                'Syncfusion',
                'Primary Signer',
                'Secondary Signer'
            ]
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(name);
        // Assert
        expect(commonName).toBe('Primary Signer');
    });
    it('should return an empty common name when the matched value is empty', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            ['2.5.4.3'],
            ['']
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(name);
        // Assert
        expect(commonName).toBe('');
    });
    it('should return the formatted name when common name is unavailable', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            [
                '2.5.4.10',
                '2.5.4.6'
            ],
            [
                'Syncfusion',
                'IN'
            ]
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const commonName: string =
            certificateAccess._extractCommonName(name);
        // Assert
        expect(commonName).toBe('O=Syncfusion, C=IN');
    });
    it('should return an empty formatted name for an undefined input', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(undefined);
        // Assert
        expect(formattedName).toBe('');
    });
    it('should return an empty formatted name when ordering is undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = {
            _ordering: undefined,
            _values: ['Document Signer']
        } as _PdfX509Name;
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName).toBe('');
    });
    it('should return an empty formatted name when values are undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = {
            _ordering: [
                createIdentifier('2.5.4.3')
            ],
            _values: undefined
        } as _PdfX509Name;
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName).toBe('');
    });
    it('should format every supported distinguished name identifier', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            [
                '2.5.4.3',
                '2.5.4.6',
                '2.5.4.7',
                '2.5.4.8',
                '2.5.4.10',
                '2.5.4.11',
                '1.2.840.113549.1.9.1',
                '2.5.4.12',
                '2.5.4.5'
            ],
            [
                'Document Signer',
                'IN',
                'Chennai',
                'Tamil Nadu',
                'Syncfusion',
                'PDF',
                'signer@syncfusion.com',
                'Engineer',
                '123456'
            ]
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName).toBe(
            'CN=Document Signer, C=IN, L=Chennai, ST=Tamil Nadu, ' +
            'O=Syncfusion, OU=PDF, E=signer@syncfusion.com, ' +
            'T=Engineer, SN=123456'
        );
    });
    it('should use an unsupported object identifier as its label', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            ['1.2.3.4.5'],
            ['Custom Value']
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName)
            .toBe('1.2.3.4.5=Custom Value');
    });
    it('should preserve an empty distinguished name value', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            ['2.5.4.3'],
            ['']
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName).toBe('CN=');
    });
    it('should preserve distinguished name ordering and separators', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            [
                '2.5.4.6',
                '2.5.4.10',
                '2.5.4.3'
            ],
            [
                'IN',
                'Syncfusion',
                'Document Signer'
            ]
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName)
            .toBe('C=IN, O=Syncfusion, CN=Document Signer');
    });
    it('should preserve repeated distinguished name entries', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name = createName(
            [
                '2.5.4.3',
                '2.5.4.3'
            ],
            [
                'Primary Signer',
                'Secondary Signer'
            ]
        );
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName)
            .toBe('CN=Primary Signer, CN=Secondary Signer');
    });
    it('should return an empty formatted name for empty ordering and values', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const name: _PdfX509Name =
            createName([], []);
        const certificateAccess: CertificatePrivateAccess =
            certificate as unknown as CertificatePrivateAccess;
        // Act
        const formattedName: string =
            certificateAccess._formatDistinguishedName(name);
        // Assert
        expect(formattedName).toBe('');
    });
    it('should retain an assigned key usage array', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const keyUsage: boolean[] = [
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false
        ];
        // Act
        certificate._keyUsage = keyUsage;
        // Assert
        expect(certificate._keyUsage).toBe(keyUsage);
        expect(certificate._keyUsage.length).toBe(9);
        expect(certificate._keyUsage[0]).toBeTruthy();
        expect(certificate._keyUsage[1]).toBeFalsy();
        expect(certificate._keyUsage[2]).toBeTruthy();
    });
    it('should retain assigned public key bytes', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const publicKeyBytes: Uint8Array =
            new Uint8Array([1, 2, 3, 4]);
        // Act
        certificate._publicKeyBytes =
            publicKeyBytes;
        // Assert
        expect(certificate._publicKeyBytes)
            .toBe(publicKeyBytes);
        expect(certificate._publicKeyBytes)
            .toEqual(new Uint8Array([1, 2, 3, 4]));
    });
});
describe('_PdfX509Certificate survived mutation coverage', () => {
    const originalGetExtension: (
        identifier: _PdfObjectIdentifier
    ) => _PdfAbstractSyntaxElement =
        _PdfX509ExtensionBase.prototype._getExtension;
    const originalGetSigner: (
        algorithm: string
    ) => _ISigner =
        _PdfSignerUtilities.prototype._getSigner;
    afterEach(() => {
        _PdfX509ExtensionBase.prototype._getExtension =
            originalGetExtension;
        _PdfSignerUtilities.prototype._getSigner =
            originalGetSigner;
    });
    function createIdentifier(
        value: string
    ): _PdfObjectIdentifier {
        const identifier: {
            toString: () => string;
            _getDotDelimitedNotation: () => string;
        } = {
            toString: (): string => value,
            _getDotDelimitedNotation: (): string => value
        };
        return identifier as unknown as
            _PdfObjectIdentifier;
    }
    function createCertificate(
        signedCertificate?: _PdfSignedCertificate
    ): _PdfX509Certificate {
        _PdfX509ExtensionBase.prototype._getExtension =
            function (
                identifier: _PdfObjectIdentifier
            ): _PdfAbstractSyntaxElement {
                expect(identifier.toString()).toBe('0.2.5.29.15');
                return undefined;
            };
        const structure: _PdfX509CertificateStructure = {
            _getSignedCertificate: (): _PdfSignedCertificate => {
                return signedCertificate;
            }
        } as _PdfX509CertificateStructure;
        return new _PdfX509Certificate(structure);
    }
    it('should parse the exact key usage length and bit positions', () => {
        // Arrange
        const encodedKeyUsage: Uint8Array =
            new Uint8Array([
                0x03,
                0x03,
                0x03,
                0x40,
                0x01
            ]);
        const keyUsageExtension: _PdfAbstractSyntaxElement = {
            _getValue: (): Uint8Array => encodedKeyUsage
        } as _PdfAbstractSyntaxElement;
        _PdfX509ExtensionBase.prototype._getExtension =
            function (
                identifier: _PdfObjectIdentifier
            ): _PdfAbstractSyntaxElement {
                expect(identifier.toString()).toBe('0.2.5.29.15');
                return keyUsageExtension;
            };
        const structure: _PdfX509CertificateStructure = {
            _getSignedCertificate: (): _PdfSignedCertificate => {
                return undefined;
            }
        } as _PdfX509CertificateStructure;
        // Act
        const certificate: _PdfX509Certificate =
            new _PdfX509Certificate(structure);
        // Assert
        expect(certificate._keyUsage).toEqual([
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ]);
        expect(certificate._keyUsage.length).toBe(13);
        expect(certificate._keyUsage[0]).toBeFalsy();
        expect(certificate._keyUsage[1]).toBeTruthy();
        expect(certificate._keyUsage[2]).toBeFalsy();
        expect(certificate._keyUsage[8]).toBeFalsy();
        expect(certificate._keyUsage[12]).toBeFalsy();
    });
    it('should return default properties when getSignedCertificate is not a function', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const structureWithoutFunction: {
            _getSignedCertificate: undefined;
        } = {
            _getSignedCertificate: undefined
        };
        certificate._structure =
            structureWithoutFunction as unknown as
            _PdfX509CertificateStructure;
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.subject).toBe('');
        expect(properties.issuer).toBe('');
        expect(properties.serialNumber).toBe('');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(0);
        expect(properties.signatureAlgorithm).toBe('');
        expect(properties.issuerUniqueId).toBeUndefined();
        expect(properties.subjectUniqueId).toBeUndefined();
    });
    it('should return undefined validFrom when start date conversion is not a function', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: undefined,
            _issuer: undefined,
            _serialNumber: new Uint8Array([1]),
            _startDate: {
                _toDate: undefined
            },
            _endDate: undefined,
            _getVersion: (): number => 3,
            _signature: undefined,
            _issuerID: undefined,
            _subjectID: undefined
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.serialNumber).toBe('01');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(3);
    });
    it('should return undefined validTo when end date conversion is not a function', () => {
        // Arrange
        const signedCertificate: _PdfSignedCertificate = {
            _subject: undefined,
            _issuer: undefined,
            _serialNumber: new Uint8Array([2]),
            _startDate: undefined,
            _endDate: {
                _toDate: undefined
            },
            _getVersion: (): number => 3,
            _signature: undefined,
            _issuerID: undefined,
            _subjectID: undefined
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        // Act
        const properties: PdfX509CertificateProperties =
            certificate._extractProperties();
        // Assert
        expect(properties.serialNumber).toBe('02');
        expect(properties.validFrom).toBeUndefined();
        expect(properties.validTo).toBeUndefined();
        expect(properties.version).toBe(3);
    });
    it('should use a private key state when getPublicKey is called without an argument', () => {
        // Arrange
        const publicKeyInformation: _PdfPublicKeyInformation =
            {} as _PdfPublicKeyInformation;
        const signedCertificate: _PdfSignedCertificate = {
            _publicKeyInformation: publicKeyInformation
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        const originalCreateKey: (
            isPrivate: boolean,
            publicKeyInfo: _PdfPublicKeyInformation
        ) => _PdfCipherParameter = certificate._createKey;
        let receivedPrivateState: boolean = false;
        let receivedPublicKeyInformation:
            _PdfPublicKeyInformation = undefined;
        certificate._createKey = (
            isPrivate: boolean,
            publicKeyInfo: _PdfPublicKeyInformation
        ): _PdfCipherParameter => {
            receivedPrivateState = isPrivate;
            receivedPublicKeyInformation = publicKeyInfo;
            return new _PdfRonCipherParameter(
                isPrivate,
                new Uint8Array([1, 2, 3]),
                new Uint8Array([1, 0, 1])
            );
        };
        // Act
        const result: _PdfCipherParameter =
            certificate._getPublicKey();
        certificate._createKey = originalCreateKey;
        // Assert
        expect(receivedPrivateState).toBeTruthy();
        expect(receivedPublicKeyInformation)
            .toBe(publicKeyInformation);
        expect(result).toBeDefined();
    });
    it('should preserve false when getPublicKey requests a public key', () => {
        // Arrange
        const publicKeyInformation: _PdfPublicKeyInformation =
            {} as _PdfPublicKeyInformation;
        const signedCertificate: _PdfSignedCertificate = {
            _publicKeyInformation: publicKeyInformation
        } as _PdfSignedCertificate;
        const certificate: _PdfX509Certificate =
            createCertificate(signedCertificate);
        const originalCreateKey: (
            isPrivate: boolean,
            publicKeyInfo: _PdfPublicKeyInformation
        ) => _PdfCipherParameter = certificate._createKey;
        let receivedPrivateState: boolean = true;
        let receivedPublicKeyInformation:
            _PdfPublicKeyInformation = undefined;
        certificate._createKey = (
            isPrivate: boolean,
            publicKeyInfo: _PdfPublicKeyInformation
        ): _PdfCipherParameter => {
            receivedPrivateState = isPrivate;
            receivedPublicKeyInformation = publicKeyInfo;
            return new _PdfRonCipherParameter(
                isPrivate,
                new Uint8Array([1, 2, 3]),
                new Uint8Array([1, 0, 1])
            );
        };
        // Act
        const result: _PdfCipherParameter =
            certificate._getPublicKey(false);
        certificate._createKey = originalCreateKey;
        // Assert
        expect(receivedPrivateState).toBeFalsy();
        expect(receivedPublicKeyInformation)
            .toBe(publicKeyInformation);
        expect(result).toBeDefined();
    });
    it('should throw the exact error for an unsupported public key algorithm', () => {
        // Arrange
        const certificate: _PdfX509Certificate =
            createCertificate();
        const publicKeyInformation: _PdfPublicKeyInformation = {
            _algorithms: {
                _objectID: createIdentifier(
                    '1.2.840.10045.2.1'
                )
            },
            _publicKey: {
                _getBytes: (): Uint8Array => {
                    return new Uint8Array([
                        0x30,
                        0x00
                    ]);
                },
                _data: new Uint8Array([
                    0x30,
                    0x00
                ])
            }
        } as _PdfPublicKeyInformation;
        // Act
        const action: () => _PdfCipherParameter =
            (): _PdfCipherParameter => {
                return certificate._createKey(
                    false,
                    publicKeyInformation
                );
            };
        // Assert
        expect(action).toThrowError(
            Error,
            'Unsupported Algorithm'
        );
    });
    it('should initialize and execute the signer during certificate verification', () => {
        // Arrange
        const algorithmIdentifier: _PdfObjectIdentifier =
            createIdentifier('1.2.840.113549.1.1.11');
        const toBeSignedBytes: Uint8Array =
            new Uint8Array([10, 20, 30]);
        const signatureBytes: Uint8Array =
            new Uint8Array([40, 50, 60]);
        const signedCertificate: _PdfSignedCertificate = {
            _getDistinguishEncoded: (): Uint8Array => {
                return toBeSignedBytes;
            }
        } as _PdfSignedCertificate;
        const structure: _PdfX509CertificateStructure = {
            _signatureAlgorithmIdentifier: {
                _objectID: algorithmIdentifier
            },
            _toBeSignedCertificate: {
                _signature: {
                    _objectID: algorithmIdentifier
                }
            },
            _signature: {
                _getBytes: (): Uint8Array => {
                    return signatureBytes;
                }
            },
            _getSignedCertificate: (): _PdfSignedCertificate => {
                return signedCertificate;
            }
        } as _PdfX509CertificateStructure;
        const certificate: _PdfX509Certificate =
            createCertificate();
        certificate._structure = structure;
        const publicKey: _PdfCipherParameter =
            new _PdfRonCipherParameter(
                false,
                new Uint8Array([1, 2, 3]),
                new Uint8Array([1, 0, 1])
            );
        let initialized: boolean = false;
        let receivedVerificationState: boolean = true;
        let receivedPublicKey: _PdfCipherParameter = undefined;
        let blockUpdated: boolean = false;
        let receivedInput: Uint8Array = undefined;
        let receivedOffset: number = -1;
        let receivedLength: number = -1;
        let signatureValidated: boolean = false;
        let receivedSignature: Uint8Array = undefined;
        let receivedAlgorithm: string = '';
        const signer: _ISigner = {
            _initialize: (
                forSigning: boolean,
                key: _PdfCipherParameter
            ): void => {
                initialized = true;
                receivedVerificationState = forSigning;
                receivedPublicKey = key;
            },
            _blockUpdate: (
                input: Uint8Array,
                offset: number,
                length: number
            ): void => {
                blockUpdated = true;
                receivedInput = input;
                receivedOffset = offset;
                receivedLength = length;
            },
            _validateSignature: (
                signature: Uint8Array
            ): boolean => {
                signatureValidated = true;
                receivedSignature = signature;
                return true;
            }
        } as _ISigner;
        _PdfSignerUtilities.prototype._getSigner =
            function (
                algorithm: string
            ): _ISigner {
                receivedAlgorithm = algorithm;
                return signer;
            };
        // Act
        certificate._verify(publicKey);
        _PdfSignerUtilities.prototype._getSigner =
            originalGetSigner;
        // Assert
        expect(receivedAlgorithm)
            .toBe('1.2.840.113549.1.1.11');
        expect(initialized).toBeTruthy();
        expect(receivedVerificationState).toBeFalsy();
        expect(receivedPublicKey).toBe(publicKey);
        expect(blockUpdated).toBeTruthy();
        expect(receivedInput).toBe(toBeSignedBytes);
        expect(receivedOffset).toBe(0);
        expect(receivedLength).toBe(3);
        expect(signatureValidated).toBeTruthy();
        expect(receivedSignature).toBe(signatureBytes);
    });
});
