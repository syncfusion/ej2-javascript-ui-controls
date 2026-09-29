import { RevocationStatus } from "../src/pdf/core/enumerator";
import { _PdfDictionary, _PdfName } from "../src/pdf/core/pdf-primitives";
import { _ConstructionType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfOcspResponseHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response";
import { _PdfRevocationResponse } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model";
import { _PdfOcspHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
import { _PdfCryptographicMessageSyntaxSigner } from "../src/pdf/core/security/digital-signature/signature/cryptographic-signer";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _PdfSignerUtilities } from "../src/pdf/core/security/digital-signature/signature/signature-utilities";
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";
import { _Sha256 } from "../src/pdf/core/security/encryptors/secureHash-algorithm256";
import { _Sha384, _Sha512 } from "../src/pdf/core/security/encryptors/secureHash-algorithm512";
import { _parseTimestampToken } from "../src/pdf/core/utils";
function makeInitializeInternalsHarness(): {signature: any; dictionary: _PdfDictionary; field: any; signatureDictionary: any;} {
    const dictionary: _PdfDictionary = new _PdfDictionary();
    dictionary.update('Contents', 'content');
    dictionary.update('ByteRange', [0, 5, 10, 5]);
    const catalogDictionary: _PdfDictionary = new _PdfDictionary();
    const document: any = {
        _rawBytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        _catalog: { _catalogDictionary: catalogDictionary },
        _isLoaded: false
    };
    const crossReference: any = { _document: document, _cacheMap: new Map()};
    const field: any = { _crossReference: crossReference, _dictionary: new _PdfDictionary()};
    const signature: any = new PdfSignature();
    const cmsSigner: any = { _signedData: undefined, _rsaData: undefined };
    const signatureDictionary: any = {
        _cmsSigner: cmsSigner,
        _certificate: undefined,
        _parseDigestAlgorithm: (): any => 0,
        _parseSignedDate: (): Date => new Date(),
        _parseDirect: (_key: string): string => ''
    };
    signature._signatureDictionary = signatureDictionary;
    signature._toNumberArray = (value: any): number[] => value as number[];
    return { signature, dictionary, field, signatureDictionary };
}
function makePermissionInitializeHarness(): {signature: any; dictionary: _PdfDictionary; field: any; transformParams: _PdfDictionary;} {
    const dictionary: _PdfDictionary = new _PdfDictionary();
    dictionary.update('ByteRange', [0, 10, 20, 30]);
    const transformParams: _PdfDictionary = new _PdfDictionary();
    transformParams.update('P', 2);
    const referenceDictionary: _PdfDictionary = new _PdfDictionary();
    referenceDictionary.update('TransformParams', transformParams);
    dictionary.update('Reference', [referenceDictionary]);
    const docPermission: _PdfDictionary = new _PdfDictionary();
    docPermission.update('ByteRange', [0, 10, 20, 30]);
    const perms: _PdfDictionary = new _PdfDictionary();
    perms.update('DocMDP', docPermission);
    const catalogDictionary: _PdfDictionary = new _PdfDictionary();
    catalogDictionary.update('Perms', perms);
    const document: any = { _rawBytes: new Uint8Array([1, 2, 3]), _catalog: { _catalogDictionary: catalogDictionary }, _isLoaded: false};
    const crossReference: any = { _document: document, _cacheMap: new Map()};
    const field: any = { _crossReference: crossReference, _dictionary: new _PdfDictionary()};
    const signature: any = new PdfSignature();
    signature._signatureDictionary = {
        _cmsSigner: undefined,
        _certificate: undefined,
        _parseDigestAlgorithm: (): any => 0,
        _parseSignedDate: (): Date => new Date(),
        _parseDirect: (_key: string): string => ''
    };
    signature._toNumberArray = (value: any): number[] => value as number[];
    return { signature, dictionary, field, transformParams };
}
function makeVerifyTimestampHarness(): {signature: any; tsaCertificate: any; originalParser: any;} {
    const tsaCertificate: any = { _extractProperties(): any { return { subject: 'TSA' }; } };
    const signature: any = { _crossReference: { _document: { _rawBytes: new Uint8Array([1, 2, 3]) } },
        _signatureField: {
            _extractTimestampToken(): Uint8Array { return new Uint8Array([10]); },
            _isDocumentTimestamp(): boolean { return true; },
            _extractTimestampTime(): Date { return new Date('2024-01-01'); },
            _cmsSigner: { _signedData: new Uint8Array([9, 9, 9]),
                _extractTsaCertificates(): any[] { return [tsaCertificate]; },
                _verifyTsaSignature(): boolean { return true; } }
        },
        _validateTsaCertificateChain(): boolean { return true; }
    };
    return { signature, tsaCertificate, originalParser: _parseTimestampToken };
}
function makeVerifyTsaSignerHarness(): any {
    const signer: any = new _PdfCryptographicMessageSyntaxSigner(
        new Uint8Array(0),
        undefined as any
    );
    return signer;
}
function makeVerifyTsaHarness(): _PdfCryptographicMessageSyntaxSigner {
    const signer: _PdfCryptographicMessageSyntaxSigner =
        new _PdfCryptographicMessageSyntaxSigner(
            new Uint8Array([]),
            'ETSI.RFC3161'
        ) as any;
    return signer;
}
function createVerifyTimestampHarness(): any {
    const tsaCertificate: any = { _extractProperties: (): any => ({subjectName: 'Test TSA'})};
    const signature: any = { _crossReference: { _document: {_rawBytes: new Uint8Array([1, 2, 3, 4])}}};
    signature._validateTsaCertificateChain = ( _tsaCerts: any[], _timestamp: Date): boolean => true;
    signature._signatureField = {
        _extractTimestampToken: (): Uint8Array => new Uint8Array([1]),
        _isDocumentTimestamp: (): boolean => true,
        _extractTimestampTime: (): Date => new Date('2024-01-01'),
        _cmsSigner: {
            _signedData: new Uint8Array([1, 2, 3, 4]),
            _extractTsaCertificates: (): any[] => [tsaCertificate],
            _verifyTsaSignature: (): boolean => true
        }
    };
    signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore
    return signature;
}
describe('1038509 _initializeInternals signature dictionary guard', () => {
    it('1038509 reuses existing signature dictionary instance', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        expect(signature._ranges.length).toBe(0);
        expect(() => signature._initializeInternals(dictionary, field)).not.toThrow();
    });
    it('1038509 empty ranges do not update signer content', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        signature._toNumberArray = (_value: any): number[] => [];
        let buildCalled: boolean = false;
        signature._buildFromByteRange = ( _bytes: Uint8Array, _ranges: number[]): Uint8Array => {
            buildCalled = true;
            return new Uint8Array([9]);
        };
        signature._initializeInternals(dictionary, field);
        expect(buildCalled).toBe(false);
        expect(signatureDictionary._cmsSigner._signedData).toBeUndefined();
        expect(signatureDictionary._cmsSigner._rsaData).toBeUndefined();
    });
    it('1038509 undefined cms signer skips content generation', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        signatureDictionary._cmsSigner = undefined;
        let buildCalled: boolean = false;
        signature._buildFromByteRange = ( _bytes: Uint8Array, _ranges: number[]): Uint8Array => {
            buildCalled = true;
            return new Uint8Array([1]);
        };
        signature._initializeInternals(dictionary, field);
        expect(buildCalled).toBe(false);
    });
    it('1038509 valid ranges populate cms signer content', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        const expected: Uint8Array = new Uint8Array([10, 20, 30]);
        signature._buildFromByteRange = ( _bytes: Uint8Array, _ranges: number[]): Uint8Array => expected;
        signature._initializeInternals(dictionary, field);
        expect(signatureDictionary._cmsSigner._signedData).toBe(expected);
        expect(signatureDictionary._cmsSigner._rsaData).toBe(expected);
    });
    it('1038509 empty pdf bytes do not build content', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        field._crossReference._document._rawBytes = new Uint8Array(0);
        let buildCalled: boolean = false;
        signature._buildFromByteRange = ( _bytes: Uint8Array, _ranges: number[]): Uint8Array => {
            buildCalled = true;
            return new Uint8Array([1]);
        };
        signature._initializeInternals(dictionary, field);
        expect(buildCalled).toBe(false);
        expect(signatureDictionary._cmsSigner._signedData).toBeUndefined();
        expect(signatureDictionary._cmsSigner._rsaData).toBeUndefined();
    });
    it('1038509 undefined pdf bytes do not build content', () => {
        const { signature, dictionary, field, signatureDictionary } = makeInitializeInternalsHarness();
        field._crossReference._document._rawBytes = undefined;
        let buildCalled: boolean = false;
        signature._buildFromByteRange = ( _bytes: Uint8Array, _ranges: number[]): Uint8Array => {
            buildCalled = true;
            return new Uint8Array([1]);
        };
        signature._initializeInternals(dictionary, field);
        expect(buildCalled).toBe(false);
        expect(signatureDictionary._cmsSigner._signedData).toBeUndefined();
        expect(signatureDictionary._cmsSigner._rsaData).toBeUndefined();
    });
});
describe('1038509 _initializeInternals permission branch guards', () => {
    it('1038509 no ByteRange does not update document permissions', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        delete dictionary._map['ByteRange'];
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 empty ranges skip permission processing', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        signature._documentPermissions = 0;
        signature._toNumberArray = (_value: any): number[] => [];
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 catalog without Perms skips permission update', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        const catalogDictionary: _PdfDictionary = field._crossReference._document._catalog._catalogDictionary;
        delete catalogDictionary._map['Perms'];
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 permissions without DocMDP skips update', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        const catalogDictionary: _PdfDictionary = field._crossReference._document._catalog._catalogDictionary;
        const permissions: _PdfDictionary = catalogDictionary.get('Perms') as _PdfDictionary;
        delete permissions._map['DocMDP'];
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 DocMDP without ByteRange skips update', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        const catalogDictionary: _PdfDictionary = field._crossReference._document._catalog._catalogDictionary;
        const permissions: _PdfDictionary = catalogDictionary.get('Perms') as _PdfDictionary;
        const docPermission: _PdfDictionary = permissions.get('DocMDP') as _PdfDictionary;
        delete docPermission._map['ByteRange'];
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 mismatched range length does not set permissions', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        const catalogDictionary: _PdfDictionary = field._crossReference._document._catalog._catalogDictionary;
        const permissions: _PdfDictionary = catalogDictionary.get('Perms') as _PdfDictionary;
        const docPermission: _PdfDictionary = permissions.get('DocMDP') as _PdfDictionary;
        docPermission.update('ByteRange', [0, 10]);
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(0);
    });
    it('1038509 matching byte ranges update document permissions', () => {
        const { signature, dictionary, field } = makePermissionInitializeHarness();
        signature._documentPermissions = 0;
        signature._initializeInternals(dictionary, field);
        expect(signature._documentPermissions).toBe(2);
    });
});
describe('1038509 _validateTsaCertificateChain mutations', () => {
    function createSignatureHarness(): any {
        const signature: any = Object.create(PdfSignature.prototype);
        signature._signatureField = { _trustedRoots: [], _buildAndValidateCertificateChain: ( _leaf: any, _intermediates: any[], _roots: any[], _time: Date) => { return { trusted: true };}};
        return signature;
    }
    it('1038509 returns false when tsa certificates are empty', () => {
        const signature: any = createSignatureHarness();
        const result: boolean = signature._validateTsaCertificateChain([], new Date());
        expect(result).toBe(false);
    });
    it('1038509 returns false when tsa certificates are undefined', () => {
        const signature: any = createSignatureHarness();
        const result: boolean = signature._validateTsaCertificateChain(undefined, new Date());
        expect(result).toBe(false);
    });
    it('1038509 ignores certificates without structure', () => {
        const signature: any = createSignatureHarness();
        const certificates: any[] = [{}, { value: 10 }];
        const result: boolean = signature._validateTsaCertificateChain( certificates, new Date());
        expect(result).toBe(false);
    });
    it('1038509 extracts only certificates having structure', () => {
        const signature: any = createSignatureHarness();
        let receivedLeaf: any;
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain =
            (leaf: any): any => {
                receivedLeaf = leaf;
                return { trusted: true };
            };
        const validCertificate: any = { _structure: { id: 1 }};
        const result: boolean = signature._validateTsaCertificateChain([validCertificate], new Date());
        expect(result).toBe(true);
        expect(receivedLeaf).toBe(validCertificate);
    });
    it('1038509 does not include undefined entry as intermediate certificate', () => {
        const signature: any = createSignatureHarness();
        let intermediateCount: number = -1;
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain =
            (
                _leaf: any,
                intermediates: any[]
            ): any => {intermediateCount = intermediates.length; return { trusted: true }; };
        const leaf: any = { _structure: { id: 1 } };
        const result: boolean = signature._validateTsaCertificateChain([leaf], new Date());
        expect(result).toBe(true);
        expect(intermediateCount).toBe(0);
    });
    it('1038509 passes remaining certificates as intermediates', () => {
        const signature: any = createSignatureHarness();
        const leaf: any = { _structure: { id: 1 } };
        const intermediate: any = { _structure: { id: 2 } };
        let capturedIntermediates: any[] = [];
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain =
            (
                _leaf: any,
                intermediates: any[]
            ): any => { capturedIntermediates = intermediates; return { trusted: true }; };
        const result: boolean = signature._validateTsaCertificateChain([leaf, intermediate], new Date());
        expect(result).toBe(true);
        expect(capturedIntermediates.length).toBe(1);
        expect(capturedIntermediates[0]).toBe(intermediate);
    });
    it('1038509 uses provided timestamp when valid date is supplied', () => {
        const signature: any = createSignatureHarness();
        const certificate: any = { _structure: { id: 1 }};
        const timestamp: Date = new Date('2024-01-01T00:00:00Z');
        let receivedTime: Date;
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain =
            (
                _leaf: any,
                _intermediates: any[],
                _roots: any[],
                time: Date
            ): any => {receivedTime = time; return { trusted: true }; };
        signature._validateTsaCertificateChain( [certificate], timestamp);
        expect(receivedTime).toBe(timestamp);
    });
    it('1038509 falls back to current date when timestamp is invalid', () => {
        const signature: any = createSignatureHarness();
        const certificate: any = { _structure: { id: 1 }};
        let receivedTime: Date;
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain =
            (
                _leaf: any,
                _intermediates: any[],
                _roots: any[],
                time: Date
            ): any => { receivedTime = time; return { trusted: true }; };
        const invalidDate: Date = new Date('invalid');
        signature._validateTsaCertificateChain([certificate], invalidDate);
        expect(receivedTime instanceof Date).toBe(true);
        expect(isNaN(receivedTime.getTime())).toBe(false);
    });
    it('1038509 returns true when trusted roots collection is empty', () => {
        const signature: any = createSignatureHarness();
        signature._signatureField._trustedRoots = [];
        const result: boolean = signature._validateTsaCertificateChain([{ _structure: { id: 1 } }], new Date());
        expect(result).toBe(true);
    });
    it('1038509 returns false when certificate chain is not trusted', () => {
        const signature: any = createSignatureHarness();
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain = (): any => {return { trusted: false };};
        const result: boolean = signature._validateTsaCertificateChain( [{ _structure: { id: 1 } }], new Date());
        expect(result).toBe(false);
    });
    it('1038509 validates timestamp extended key usage', () => {
        const signature: any = createSignatureHarness();
        const certificate: any = { _structure: { id: 1 } };
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain = (): any => { return { trusted: true }; };
        signature._signatureField._cmsSigner = { _hasTimestampExtendedKeyUsage: (_cert: any): boolean => false };
        const result: boolean = signature._validateTsaCertificateChain([certificate], new Date());
        expect(result).toBe(false);
    });
    it('1038509 returns true when timestamp extended key usage is valid', () => {
        const signature: any = createSignatureHarness();
        const certificate: any = { _structure: { id: 1 }};
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain = (): any => { return { trusted: true }; };
        signature._signatureField._cmsSigner = { _hasTimestampExtendedKeyUsage: (_cert: any): boolean => true};
        const result: boolean = signature._validateTsaCertificateChain([certificate], new Date());
        expect(result).toBe(true);
    });
    it('1038509 calls key usage check with leaf certificate', () => {
        const signature: any = createSignatureHarness();
        const leaf: any = { _structure: { id: 1 }};
        let receivedCertificate: any;
        signature._signatureField._trustedRoots = [{}];
        signature._signatureField._buildAndValidateCertificateChain = (): any => { return { trusted: true }; };
        signature._signatureField._cmsSigner = {
            _hasTimestampExtendedKeyUsage: (cert: any): boolean => {
                receivedCertificate = cert;
                return true;
            }
        };
        const result: boolean = signature._validateTsaCertificateChain([leaf], new Date());
        expect(result).toBe(true);
        expect(receivedCertificate).toBe(leaf);
    });
});
describe('1038509 _validateLtvOcsp response collection checks', () => {
    it('1038509 verifyTimeStampCore uses SHA512 branch for oid 2.16.840.1.101.3.4.2.3', () => {
        const digest: Uint8Array = new Uint8Array([10]);
        const tsaCertificate: any = { _extractProperties: (): any => ({ subject: 'tsa' })};
        const signature: any = { _crossReference: { _document: { _rawBytes: new Uint8Array([1, 2, 3]) } }};
        signature._validateTsaCertificateChain = (): boolean => true;
        signature._signatureField = {
            _extractTimestampToken: (): Uint8Array => new Uint8Array([1]),
            _isDocumentTimestamp: (): boolean => true,
            _extractTimestampTime: (): Date => new Date('2024-01-01'),
            _cmsSigner: {
                _extractTsaCertificates: (): any[] => [tsaCertificate],
                _verifyTsaSignature: (): boolean => true
            }
        };
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        const originalParse: any = _parseTimestampToken;
        (_parseTimestampToken as any) = (): any => ({
            messageImprint: { hashAlgorithm: '2.16.840.1.101.3.4.2.3', hashedMessage: digest },
            policy: 'policy'
        });
        const originalSha512: any = (_Sha512 as any).prototype._hash;
        const originalSha384: any = (_Sha384 as any).prototype._hash;
        (_Sha512 as any).prototype._hash = (): Uint8Array => digest;
        (_Sha384 as any).prototype._hash = (): Uint8Array => new Uint8Array([99]);
        const result: any = signature._verifyTimeStampCore();
        expect(result.isValid).toBe(true);
        (_parseTimestampToken as any) = originalParse;
        (_Sha512 as any).prototype._hash = originalSha512;
        (_Sha384 as any).prototype._hash = originalSha384;
    });
    it('1038509 verifyTimeStampCore uses SHA384 branch for oid 2.16.840.1.101.3.4.2.2', () => {
        const expectedDigest: Uint8Array = new Uint8Array([20]);
        const signature: any = createVerifyTimestampHarness();
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        const originalParse: any = _parseTimestampToken;
        (_parseTimestampToken as any) = (): any => ({
            messageImprint: {
                hashAlgorithm: '2.16.840.1.101.3.4.2.2',
                hashedMessage: expectedDigest
            },
            policy: 'policy'
        });
        const originalSha384: any = (_Sha384 as any).prototype._hash;
        (_Sha384 as any).prototype._hash = (): Uint8Array => expectedDigest;
        const result: any = signature._verifyTimeStampCore();
        expect(result.isValid).toBe(true);
        (_parseTimestampToken as any) = originalParse;
        (_Sha384 as any).prototype._hash = originalSha384;
    });
    it('1038509 verifyTimeStampCore validates matching digest', () => {
        const digest: Uint8Array = new Uint8Array([1, 2, 3]);
        const signature: any = createVerifyTimestampHarness();
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        const originalParse: any = _parseTimestampToken;
        (_parseTimestampToken as any) = (): any => ({
            messageImprint: {
                hashAlgorithm: '1.3.14.3.2.26',
                hashedMessage: digest
            },
            policy: 'policy'
        });
        const originalHash: any = (_Sha1 as any).prototype._hash;
        (_Sha1 as any).prototype._hash = (): Uint8Array => digest;
        const result: any = signature._verifyTimeStampCore();
        expect(result.isValid).toBe(true);
        (_parseTimestampToken as any) = originalParse;
        (_Sha1 as any).prototype._hash = originalHash;
    });
    it('1038509 verifyTimeStampCore marks matching imprint as valid', () => {
        const digest: Uint8Array = new Uint8Array([5]);
        const signature: any = createVerifyTimestampHarness();
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        const originalParse: any = _parseTimestampToken;
        (_parseTimestampToken as any) = (): any => ({
            messageImprint: {
                hashAlgorithm: '1.3.14.3.2.26',
                hashedMessage: digest
            },
            policy: 'policy'
        });
        const originalHash: any = (_Sha1 as any).prototype._hash;
        (_Sha1 as any).prototype._hash = (): Uint8Array => digest;
        const result: any = signature._verifyTimeStampCore();
        expect(result.isValid).toBe(true);
        (_parseTimestampToken as any) = originalParse;
        (_Sha1 as any).prototype._hash = originalHash;
    });
    it('1038509 verifyTimeStampCore accepts identical digest bytes', () => {
        const digest: Uint8Array = new Uint8Array([7, 8, 9]);
        const signature: any = createVerifyTimestampHarness();
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        const originalParse: any = _parseTimestampToken;
        (_parseTimestampToken as any) = (): any => ({
            messageImprint: {
                hashAlgorithm: '1.3.14.3.2.26',
                hashedMessage: digest
            },
            policy: 'policy'
        });
        const originalHash: any = (_Sha1 as any).prototype._hash;
        (_Sha1 as any).prototype._hash = (): Uint8Array => digest;
        const result: any = signature._verifyTimeStampCore();
        expect(result.isValid).toBe(true);
        (_parseTimestampToken as any) = originalParse;
        (_Sha1 as any).prototype._hash = originalHash;
    });
    it('1038509 verifyTimeStampCore returns undefined certificate when tsa certificate missing', () => {
        const signature: any = createVerifyTimestampHarness();
        signature._verifyTimeStampCore = PdfSignature.prototype._verifyTimeStampCore;
        signature._signatureField._cmsSigner._extractTsaCertificates =(): any[] => [undefined];
        const result: any = signature._verifyTimeStampCore();
        expect(result.certificate).toBeUndefined();
    });
});
describe('1038509 _validateLtvOcsp mutations', () => {
    function createSignature(): any { return new PdfSignature(); }
    it('1038509 returns good when helper status is zero and cert status tag is 0', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void {this._status = 0; this._getResponseObject = (): any => {return { _responses: [{ _certStatus: { _tag: 0} }]}; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.good);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns revoked when helper status is zero and cert status tag is 1', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 0; this._getResponseObject = (): any => {return { _responses: [{ _certStatus: { _tag: 1 } } ]  }; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.revoked);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns unknown when response object is undefined', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void {
            this._status = 0;
            this._getResponseObject = (): any => undefined;
        };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns unknown when response collection is empty', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void {this._status = 0; this._getResponseObject = (): any => { return { _responses: []}; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns unknown when first response is undefined', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 0; this._getResponseObject = (): any => { return { _responses: [undefined]}; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 uses certificateStatus when certStatus is undefined', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void {this._status = 0; this._getResponseObject = (): any => {return { _responses: [ { _certStatus: undefined, _certificateStatus: { _tag: 1 } } ] }; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.revoked);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns unknown when status object is missing', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 0; this._getResponseObject = (): any => { return { _responses: [ { _certStatus: undefined, _certificateStatus: undefined } ] }; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 uses tagNumber when tag is not numeric', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 0; this._getResponseObject = (): any => { return { _responses: [{ _certStatus: { _tag: undefined, _tagNumber: 0 }} ] }; }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.good);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 returns unknown when tag and tagNumber are invalid', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 0; this._getResponseObject = (): any => { return { _responses: [ { _certStatus: {} } ] }; };};
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
        (_PdfOcspResponseHelper as any) = originalHelper;
    });
    it('1038509 uses fallback parsing path when helper status is non zero', () => {
        const signature: any = createSignature();
        const originalHelper: any = (_PdfOcspResponseHelper as any);
        const originalElement: any = (_PdfUniqueEncodingElement as any);
        const originalOcspHelper: any = (_PdfOcspHelper as any);
        const originalResponse: any = (_PdfRevocationResponse as any);
        (_PdfOcspResponseHelper as any) = function (_bytes: Uint8Array): void { this._status = 1; };
        (_PdfUniqueEncodingElement as any) = function (): void { this._fromBytes = (_bytes: Uint8Array): void => { }; };
        (_PdfOcspHelper as any) = function (): void { this._getOcspStructure = (_element: any): any => { return {}; }; };
        (_PdfRevocationResponse as any) = function (_value: any): any { return { _responses: [{ _certStatus: { _tag: 0 } } ] }; };
        const result: RevocationStatus = signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.good);
        (_PdfOcspResponseHelper as any) = originalHelper;
        (_PdfUniqueEncodingElement as any) = originalElement;
        (_PdfOcspHelper as any) = originalOcspHelper;
        (_PdfRevocationResponse as any) = originalResponse;
    });
});
describe('1038509 _verifyTimeStampCore hash algorithm branches', () => {
    it('1038509 _verifyTimeStampCore uses document bytes for document timestamp', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        const expectedDigest: Uint8Array = new Uint8Array([11]);
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: '1', messageImprint: { hashAlgorithm: '1.3.14.3.2.26', hashedMessage: expectedDigest } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = function(data: Uint8Array): Uint8Array {
            expect(data).toEqual(signature._crossReference._document._rawBytes);
            return expectedDigest;
        };
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.isDocumentTimestamp).toBe(true);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore uses signed data for signature timestamp', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        signature._signatureField._isDocumentTimestamp = (): boolean => false;
        const signedData: Uint8Array = new Uint8Array([77]);
        signature._signatureField._cmsSigner._signedData = signedData;
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([5]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = function(data: Uint8Array): Uint8Array {
            expect(data).toBe(signedData);
            return new Uint8Array([5]);
        };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore creates signer certificate collection', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.signerCertificates.length).toBe(1);
        expect(result.signerCertificates[0].certificate).toBeDefined();
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore does not hash when document bytes empty', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        signature._crossReference._document._rawBytes = new Uint8Array(0);
        let hashInvoked: boolean = false;
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => {hashInvoked = true;return new Uint8Array([1]);};
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1]) } }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(hashInvoked).toBe(false);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore rejects mismatched document timestamp imprint', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([9]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.isValid).toBe(false);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore detects digest length mismatch', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1, 2]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.isValid).toBe(false);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore validates every digest byte', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1, 9]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1, 2]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.isValid).toBe(false);
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore returns certificate properties', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.certificate).toBeDefined();
        expect(result.certificate.subject).toBe('TSA');
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore returns invalid when no tsa certificates', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        signature._signatureField._cmsSigner._extractTsaCertificates = (): any[] => [];
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1]) } }; };
        const originalHash: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = (): Uint8Array => new Uint8Array([1]);
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result.isValid).toBe(false);
        expect(result.certificate).toBeUndefined();
        _Sha1.prototype._hash = originalHash;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore returns fallback object on failure', () => {
        const { signature } = makeVerifyTimestampHarness();
        signature._signatureField._extractTimestampToken = (): any => { throw new Error('failure'); };
        const result: any = PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(result).toBeDefined();
        expect(result.isDocumentTimestamp).toBe(false);
        expect(result.isValid).toBe(false);
        expect(result.timestampPolicyId).toBe('');
        expect(result.timestampTime instanceof Date).toBe(true);
    });
    it('1038509 _verifyTimeStampCore uses SHA1 for oid 1.3.14.3.2.26', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        let sha1Called: boolean = false;
        const originalSha1: any = _Sha1.prototype._hash;
        _Sha1.prototype._hash = function ( _data: Uint8Array, _offset: number, _length: number): Uint8Array {
            sha1Called = true;
            return new Uint8Array([1, 2, 3]);
        };
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '1.3.14.3.2.26', hashedMessage: new Uint8Array([1, 2, 3]) } }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(sha1Called).toBe(true);
        _Sha1.prototype._hash = originalSha1;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore uses SHA256 for oid 2.16.840.1.101.3.4.2.1', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        let sha256Called: boolean = false;
        const originalSha256: any = _Sha256.prototype._hash;
        _Sha256.prototype._hash = function ( _data: Uint8Array, _offset: number, _length: number): Uint8Array { sha256Called = true; return new Uint8Array([1, 2, 3]); };
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '2.16.840.1.101.3.4.2.1', hashedMessage: new Uint8Array([1, 2, 3]) } }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(sha256Called).toBe(true);
        _Sha256.prototype._hash = originalSha256;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore uses SHA384 for oid 2.16.840.1.101.3.4.2.2', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        let sha384Called: boolean = false;
        const originalSha384: any = _Sha384.prototype._hash;
        _Sha384.prototype._hash = function ( _data: Uint8Array, _offset: number,  _length: number ): Uint8Array { sha384Called = true; return new Uint8Array([1, 2, 3]); };
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: {hashAlgorithm: '2.16.840.1.101.3.4.2.2', hashedMessage: new Uint8Array([1, 2, 3]) } }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(sha384Called).toBe(true);
        _Sha384.prototype._hash = originalSha384;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore uses SHA512 for oid 2.16.840.1.101.3.4.2.3', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        let sha512Called: boolean = false;
        const originalSha512: any = _Sha512.prototype._hash;
        _Sha512.prototype._hash = function ( _data: Uint8Array, _offset: number, _length: number ): Uint8Array { sha512Called = true; return new Uint8Array([1, 2, 3]);};
        (_parseTimestampToken as any) = (_token: Uint8Array): any => { return { policy: 'policy', messageImprint: { hashAlgorithm: '2.16.840.1.101.3.4.2.3', hashedMessage: new Uint8Array([1, 2, 3]) } }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(sha512Called).toBe(true);
        _Sha512.prototype._hash = originalSha512;
        (_parseTimestampToken as any) = originalParser;
    });
    it('1038509 _verifyTimeStampCore does not invoke SHA1 for SHA256 oid', () => {
        const { signature, originalParser } = makeVerifyTimestampHarness();
        let sha1Called: boolean = false;
        let sha256Called: boolean = false;
        const originalSha1: any = _Sha1.prototype._hash;
        const originalSha256: any = _Sha256.prototype._hash;
        _Sha1.prototype._hash = function (): Uint8Array { sha1Called = true; return new Uint8Array([1]); };
        _Sha256.prototype._hash = function (): Uint8Array {sha256Called = true; return new Uint8Array([1]); };
        (_parseTimestampToken as any) = (): any => { return { policy: 'policy', messageImprint: { hashAlgorithm: '2.16.840.1.101.3.4.2.1', hashedMessage: new Uint8Array([1])} }; };
        PdfSignature.prototype._verifyTimeStampCore.call(signature);
        expect(sha1Called).toBe(false);
        expect(sha256Called).toBe(true);
        _Sha1.prototype._hash = originalSha1;
        _Sha256.prototype._hash = originalSha256;
        (_parseTimestampToken as any) = originalParser;
    });
});
describe('1038509 _getEncryptionAlgorithm null encryption algorithm', () => {
    it('1038509 _getEncryptionAlgorithm resolves algorithm when encryption algorithm is null', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any, undefined as any, undefined as any);
        signer._encryptionAlgorithm = null;
        signer._encryptionAlgorithmObjectIdentifier = '1.2.840.113549.1.1.1';
        const result: string = signer._getEncryptionAlgorithm();
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
    });
    it('1038509 uses signedData ahead of rsaData and documentBytes', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        const signedData: Uint8Array = new Uint8Array([1, 2, 3]);
        const rsaData: Uint8Array = new Uint8Array([4, 5, 6]);
        const documentBytes: Uint8Array = new Uint8Array([7, 8, 9]);
        let hashedInput: Uint8Array;
        signer._signedData = signedData;
        signer._rsaData = rsaData;
        signer._documentBytes = documentBytes;
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: (data: Uint8Array) => { hashedInput = data; return new Uint8Array([11]); } }) };
        signer._getHashAlgorithm = () => 'SHA256';
        signer._messageDigestAttribute = new Uint8Array([11]);
        signer._bytesEqual = (a: Uint8Array, b: Uint8Array) => a[0] === b[0];
        signer._validateAttributes = () => true;
        const result: boolean = signer._validateCheckSum();
        expect(result).toBe(true);
        expect(hashedInput).toBe(signedData);
    });
    it('1038509 uses rsaData when signedData is empty', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        const rsaData: Uint8Array = new Uint8Array([21]);
        let hashedInput: Uint8Array;
        signer._signedData = new Uint8Array(0);
        signer._rsaData = rsaData;
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: (data: Uint8Array) => { hashedInput = data; return new Uint8Array([9]); } }) };
        signer._getHashAlgorithm = () => 'SHA256';
        signer._messageDigestAttribute = new Uint8Array([9]);
        signer._bytesEqual = () => true;
        signer._validateAttributes = () => true;
        signer._validateCheckSum();
        expect(hashedInput).toBe(rsaData);
    });
    it('1038509 uses documentBytes when signedData and rsaData are empty', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        const documentBytes: Uint8Array = new Uint8Array([33]);
        let hashedInput: Uint8Array;
        signer._signedData = new Uint8Array(0);
        signer._rsaData = new Uint8Array(0);
        signer._documentBytes = documentBytes;
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: (data: Uint8Array) => { hashedInput = data; return new Uint8Array([5]); } }) };
        signer._getHashAlgorithm = () => 'SHA256';
        signer._messageDigestAttribute = new Uint8Array([5]);
        signer._bytesEqual = () => true;
        signer._validateAttributes = () => true;
        signer._validateCheckSum();
        expect(hashedInput).toBe(documentBytes);
    });
    it('1038509 rehashes rsaData when first digest result is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        let hashCount: number = 0;
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([1]);
        signer._rsaData = new Uint8Array([2]);
        signer._messageDigestAttribute = new Uint8Array([22]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: () => { hashCount++; if (hashCount === 1) {return undefined; } return new Uint8Array([22]); } }) };
        signer._bytesEqual = () => true;
        signer._validateAttributes = () => true;
        signer._getHashAlgorithm = () => 'SHA256';
        const result: boolean = signer._validateCheckSum();
        expect(result).toBe(true);
        expect(hashCount).toBe(2);
    });
    it('1038509 returns false when digest attribute is absent', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([1]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: () => new Uint8Array([10])})};
        signer._getHashAlgorithm = () => 'SHA256';
        const result: boolean = signer._validateCheckSum();
        expect(result).toBe(false);
    });
    it('1038509 does not compare when digestFromAttribute returns undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([1]);
        let equalCalls: number = 0;
        signer._digestAlgorithm = { _getMessageDigest: () => ({_hash: () => new Uint8Array([10])}) };
        signer._messageDigestAttribute = new Uint8Array([10]);
        signer._extractDigestFromAttribute = (): Uint8Array | undefined => undefined;
        signer._bytesEqual = () => { equalCalls++; return true;};
        signer._getHashAlgorithm = () => 'SHA256';
        signer._validateCheckSum();
        expect(equalCalls).toBe(1);
    });
    it('1038509 enters encoded digest branch only when content mismatch exists', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([1]);
        signer._digestAlgorithmOidBytes = new Uint8Array([1, 2, 3]);
        signer._messageDigestAttribute = new Uint8Array([99]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: () => new Uint8Array([10])}) };
        signer._extractDigestFromAttribute = () => new Uint8Array([20]);
        let compareCount: number = 0;
        signer._bytesEqual = () => { compareCount++;  return false; };
        signer._encodeLength = (value: number) => [value];
        signer._getHashAlgorithm = () => 'SHA256';
        const result: boolean = signer._validateCheckSum();
        expect(result).toBe(false);
        expect(compareCount).toBeGreaterThan(1);
    });
    it('1038509 performs final digest comparison when extracted digest does not match', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([1]);
        signer._messageDigestAttribute = new Uint8Array([55]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: () => new Uint8Array([55])})};
        signer._extractDigestFromAttribute = (): Uint8Array | undefined => undefined;
        signer._bytesEqual = () => true;
        signer._validateAttributes = () => true;
        signer._getHashAlgorithm = () => 'SHA256';
        expect(signer._validateCheckSum()).toBe(true);
    });
    it('1038509 validates second attribute when first attribute validation fails', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedAttributesDerBytes = new Uint8Array([2]);
        signer._signedData = new Uint8Array([1]);
        signer._messageDigestAttribute = new Uint8Array([10]);
        signer._digestAlgorithm = { _getMessageDigest: () => ({ _hash: () => new Uint8Array([10]) }) };
        signer._extractDigestFromAttribute = () => new Uint8Array([10]);
        signer._bytesEqual = () => true;
        let count: number = 0;
        signer._validateAttributes = () => { count++; return count === 2;};
        signer._getHashAlgorithm = () => 'SHA256';
        expect(signer._validateCheckSum()).toBe(true);
        expect(count).toBe(2);
    });
    it('1038509 returns false when signature bytes are missing', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signer = { _blockUpdate: (): Uint8Array | undefined => undefined, _validateSignature: () => true};
        signer._signatureBytes = undefined;
        expect(signer._validateCheckSum()).toBe(false);
    });
    it('1038509 returns false for zero length source bytes', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, undefined as any);
        signer._signer = { _blockUpdate: (): Uint8Array | undefined => undefined, _validateSignature: () => true};
        signer._signatureBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array(0);
        const result: boolean = signer._validateCheckSum();
        expect(result).toBe(false);
    });
});
describe('1038509 _verifyTsaSignature top children guard', () => {
    it('1038509 returns false when top children count less than two', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        const root: any = {
            _fromBytes: (_v: Uint8Array | undefined): any => undefined,
            _getComponents: () => [ {} ]
        };
        (signer as any)._extractTsaCertificate = (_v: Uint8Array) => new Uint8Array([1]);
        const original: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): _PdfUniqueEncodingElement { return root; };
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any) = original;
    });
    it('1038509 signed children length four enters verification path', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        let extractCalled: boolean = false;
        signer._extractTsaCertificate = (_v: Uint8Array): any => {extractCalled = true; return undefined; };
        const signedData: any = { _getComponents: () => [{}, {}, {}, {}] };
        const root: any = {
            _fromBytes: (_v: Uint8Array | undefined): any => undefined,
            _getComponents: () => [{}, { _getComponents: () => [signedData] }]
        };
        const original: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): _PdfUniqueEncodingElement { return root; };
        signer._verifyTsaSignature(new Uint8Array([1]));
        expect(extractCalled).toBe(true);
        (_PdfUniqueEncodingElement as any) = original;
    });
    it('1038509 returns false when tsa certificate extraction fails', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        signer._extractTsaCertificate = (_v: Uint8Array): any => undefined;
        const signedData: any = { _getComponents: () => [{}, {}, {}, {}]};
        const root: any = {
            _fromBytes: (_v: Uint8Array | undefined): any => undefined,
            _getComponents: () => [ {}, { _getComponents: () => [signedData] }]
        };
        const original: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): _PdfUniqueEncodingElement { return root; };
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any) = original;
    });
    it('1038509 returns false when encapsulated content children length less than two', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        signer._extractTsaCertificate = (_v: Uint8Array): any => new Uint8Array([1]);
        const encap: any = {_getComponents: () => [{}]};
        const signedData: any = { _getComponents: () => [{}, {}, encap, {}] };
        const root: any = { _fromBytes: (_v: Uint8Array | undefined): any => undefined, _getComponents: () => [ {}, { _getComponents: () => [signedData] } ] };
        const original: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): _PdfUniqueEncodingElement { return root; };
        expect( signer._verifyTsaSignature(new Uint8Array([1]))).toBe(false);
        (_PdfUniqueEncodingElement as any) = original;
    });
    it('1038509 returns false when signer infos collection empty', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        signer._extractTsaCertificate = (_v: Uint8Array) => new Uint8Array([1]);
        const signerInfos: any = {_getComponents: (): any => []};
        const encap: any = {
            _getComponents: () => [{}, { _getComponents: () => [ { _toBytes: () => new Uint8Array([1]) } ] } ]
        };
        const signedData: any = { _getComponents: () => [{}, {}, encap, signerInfos] };
        const root: any = { _fromBytes: (_v: Uint8Array | undefined): any => undefined, _getComponents: () => [{}, { _getComponents: () => [signedData]} ]};
        const original: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): _PdfUniqueEncodingElement { return root; };
        expect( signer._verifyTsaSignature(new Uint8Array([1]))).toBe(false);
        (_PdfUniqueEncodingElement as any) = original;
    });
    it('1038509 verifyTsaSignature uses five element signer info branch', () => {
        const signer: any = makeVerifyTsaSignerHarness();
        const token: Uint8Array = new Uint8Array([1]);
        let validateCalled: boolean = false;
        const fakeSigner: any = {
            _initialize: (_flag: boolean, _key: any): any => undefined,
            _blockUpdate: (_data: Uint8Array, _offset: number, _length: number): any => undefined,
            _validateSignature: (_signature: Uint8Array): any => {
                validateCalled = true;
                return true;
            }
        };
        const result: boolean = signer._verifyTsaSignature(token);
        expect(result).toBe(false);
        expect(validateCalled).toBe(false);
    });
    it('1038509 verifyTsaSignature uses modulus length when modulus exists', () => {
        const signer: any = makeVerifyTsaHarness();
        const publicKey: any = {modulus: new Uint8Array(8)};
        signer._publicKeyForTest = publicKey;
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 verifyTsaSignature returns false when modulus information missing', () => {
        const signer: any = makeVerifyTsaHarness();
        signer._publicKeyForTest = {};
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 verifyTsaSignature returns false when signer cannot be created', () => {
        const signer: any = makeVerifyTsaHarness();
        signer._getSignerForTest = (): any => undefined;
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 verifyTsaSignature returns false when certificate extraction fails', () => {
        const signer: any = makeVerifyTsaHarness();
        signer._extractTsaCertificate = (_token: Uint8Array): Uint8Array => {throw new Error('forced failure');};
        const result: boolean = signer._verifyTsaSignature(new Uint8Array([1]));
        expect(result).toBe(false);
    });
});
describe('1038509 _checkCertificateSerialInCrl mutations', () => {
    it('1038509 returns false when CRL sequence children count is less than two', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const crlSequence: any = { _getComponents: (): any[] => [ {} ] };
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl(new Uint8Array([1]), '100');
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns false when tbs certificate list is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const crlSequence: any = { _getComponents: (): any[] => [undefined, {}]};
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl(new Uint8Array([1]), '100');
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns true only for matching serial inside sequence entry', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const serialElement: any = { _getInteger: (): number => 12345 };
        const revokedEntry: any = { _getComponents: (): any[] => [serialElement]};
        const revokedEntriesSequence: any = {
            _getTagNumber: (): number => _UniversalType.sequence,
            _getComponents: (): any[] => [revokedEntry]
        };
        const nonSequenceNode: any = {
            _getTagNumber: (): number => _UniversalType.integer,
            _getComponents: (): any[] => []
        };
        const tbsCertList: any = { _getComponents: (): any[] => [nonSequenceNode, revokedEntriesSequence]};
        const crlSequence: any = { _getComponents: (): any[] => [tbsCertList, {}] };
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl(new Uint8Array([1]), '12345' );
        expect(result).toBe(true);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 ignores child when tag is not sequence', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const child: any = { _getTagNumber: (): number => _UniversalType.integer, _getComponents: (): any[] => [{ _getComponents: (): any[] => [{ _getInteger: (): number => 999 }]}] };
        const tbsCertList: any = { _getComponents: (): any[] => [child]};
        const crlSequence: any = { _getComponents: (): any[] => [tbsCertList, {}] };
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl( new Uint8Array([1]), '999');
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 skips revoked entry when entry is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const sequenceChild: any = {
            _getTagNumber: (): number => _UniversalType.sequence,
            _getComponents: (): any[] => [undefined]
        };
        const tbsCertList: any = {
            _getComponents: (): any[] => [sequenceChild]
        };
        const crlSequence: any = {
            _getComponents: (): any[] => [tbsCertList, {}]
        };
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl(new Uint8Array([1]), '1');
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 skips entry when serial element is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const entry: any = { _getComponents: (): any[] => [undefined]};
        const sequenceChild: any = {
            _getTagNumber: (): number => _UniversalType.sequence,
            _getComponents: (): any[] => [entry]
        };
        const tbsCertList: any = {
            _getComponents: (): any[] => [sequenceChild]
        };
        const crlSequence: any = {
            _getComponents: (): any[] => [tbsCertList, {}]
        };
        const rootElement: any = {
            _fromBytes: (_bytes: Uint8Array): void => {},
            _getComponents: (): any[] => [crlSequence]
        };
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        const originalGetComponents: any = original.prototype._getComponents;
        original.prototype._fromBytes = rootElement._fromBytes;
        original.prototype._getComponents = rootElement._getComponents;
        const result: boolean = signer._checkCertificateSerialInCrl(new Uint8Array([1]), '10' );
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
        original.prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns false when unique element parsing throws exception', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const original: any = (_PdfUniqueEncodingElement as any);
        const originalFromBytes: any = original.prototype._fromBytes;
        original.prototype._fromBytes = (): void => { throw new Error('parse-error');};
        const result: boolean = signer._checkCertificateSerialInCrl( new Uint8Array([10]), '100' );
        expect(result).toBe(false);
        original.prototype._fromBytes = originalFromBytes;
    });
});
describe('1038509 _hasTimestampExtendedKeyUsage mutations', () => {
    it('1038509 returns false when extension is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const certificate: any = {
            _getExtension: (_oid: any): any => undefined
        };
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(false);
    });
    it('1038509 returns false when sequence children collection is undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const certificate: any = {
            _getExtension: (_oid: any): any => { return {_getValue: (): Uint8Array => new Uint8Array([1])};}
        };
        const originalFromBytes: any = (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        const originalGetComponents: any =  (_PdfUniqueEncodingElement as any).prototype._getComponents;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => {};
        (_PdfUniqueEncodingElement as any).prototype._getComponents = (): any => undefined;
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement as any).prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns false when sequence children collection is empty', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const certificate: any = {
            _getExtension: (_oid: any): any => { return {_getValue: (): Uint8Array => new Uint8Array([1]) }; }
        };
        const originalFromBytes: any = (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        const originalGetComponents: any = (_PdfUniqueEncodingElement as any).prototype._getComponents;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => {};
        (_PdfUniqueEncodingElement as any).prototype._getComponents = (): any[] => [];
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement as any).prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns true only when timestamp EKU oid is present', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const timestampOid: string = '1.3.6.1.5.5.7.3.8';
        const matchingOidElement: any = {
            _getTagNumber: (): number => _UniversalType.objectIdentifier,
            _getObjectIdentifier: (): any => { return { toString: (): string => timestampOid }; }
        };
        const certificate: any = {
            _getExtension: (_oid: any): any => { return { _getValue: (): Uint8Array => new Uint8Array([1]) }; }
        };
        const originalFromBytes: any = (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        const originalGetComponents: any = (_PdfUniqueEncodingElement as any).prototype._getComponents;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => {};
        (_PdfUniqueEncodingElement as any).prototype._getComponents = (): any[] => [matchingOidElement];
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(true);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement as any).prototype._getComponents = originalGetComponents;
    });
    it('1038509 ignores elements that are not object identifier tags', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const nonOidElement: any = {
            _getTagNumber: (): number => _UniversalType.integer,
            _getObjectIdentifier: (): any => { return { toString: (): string => '1.3.6.1.5.5.7.3.8' }; }
        };
        const certificate: any = {
            _getExtension: (_oid: any): any => {
                return { _getValue: (): Uint8Array => new Uint8Array([1]) };
            }
        };
        const originalFromBytes: any =  (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        const originalGetComponents: any =  (_PdfUniqueEncodingElement as any).prototype._getComponents;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => {};
        (_PdfUniqueEncodingElement as any).prototype._getComponents = (): any[] => [nonOidElement];
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement as any).prototype._getComponents = originalGetComponents;
    });
    it('1038509 evaluates all sequence children until matching oid is found', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const firstOidElement: any = {
            _getTagNumber: (): number => _UniversalType.objectIdentifier,
            _getObjectIdentifier: (): any => { return { toString: (): string => '1.2.3.4.5' }; }
        };
        const secondOidElement: any = { _getTagNumber: (): number => _UniversalType.objectIdentifier, _getObjectIdentifier: (): any => { return { toString: (): string => '1.3.6.1.5.5.7.3.8' };} };
        const certificate: any = {
            _getExtension: (_oid: any): any => { return { _getValue: (): Uint8Array => new Uint8Array([1]) }; }
        };
        const originalFromBytes: any = (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        const originalGetComponents: any =  (_PdfUniqueEncodingElement as any).prototype._getComponents;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => {};
        (_PdfUniqueEncodingElement as any).prototype._getComponents = (): any[] => [firstOidElement, secondOidElement];
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(true);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement as any).prototype._getComponents = originalGetComponents;
    });
    it('1038509 returns false when ASN parsing throws exception', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [], 'SHA256', undefined as any);
        const certificate: any = { _getExtension: (_oid: any): any => { return { _getValue: (): Uint8Array => new Uint8Array([1]) };}};
        const originalFromBytes: any = (_PdfUniqueEncodingElement as any).prototype._fromBytes;
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = (): void => { throw new Error('invalid-eku'); };
        const result: boolean = signer._hasTimestampExtendedKeyUsage(certificate);
        expect(result).toBe(false);
        (_PdfUniqueEncodingElement as any).prototype._fromBytes = originalFromBytes;
    });
});
describe('1038509 _extractTsaCertificate mutations', () => {
    function createSigner(): any {
        return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), null as any);
    }
    it('1038509 _extractTsaCertificate throws when top children count less than two', () => {
        const signer: any = createSigner();
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [ {} ]
        };
        signer._extractTsaCertificate = Object.getPrototypeOf(signer)._extractTsaCertificate;
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        expect((): void => {signer._extractTsaCertificate(new Uint8Array([1]));}).toThrow();
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate throws when signed children count less than four', () => {
        const signer: any = createSigner();
        const signedData: any = {_getComponents: () => [{}, {}, {}]};
        const contentWrapper: any = {_getComponents: () => [signedData]};
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        expect((): void => {signer._extractTsaCertificate(new Uint8Array([1])); }).toThrow();
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate throws when certificates wrapper missing', () => {
        const signer: any = createSigner();
        const signedData: any = {_getComponents: () => [{}, {}, {}, undefined]};
        const contentWrapper: any = {_getComponents: () => [signedData]};
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {
            return root;
        };
        expect((): void => {signer._extractTsaCertificate(new Uint8Array([1]));}).toThrow();
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate unwraps constructed certificate wrapper', () => {
        const signer: any = createSigner();
        const certificateBytes: Uint8Array = new Uint8Array([11, 22, 33]);
        const certificateNode: any = {
            _toBytes: () => certificateBytes
        };
        const actualContainer: any = {
            _getComponents: () => [certificateNode]
        };
        const certificatesWrapper: any = {
            _construction: _ConstructionType.constructed,
            _getComponents: () => [actualContainer]
        };
        const signedData: any = {
            _getComponents: () => [{}, {}, {}, certificatesWrapper]
        };
        const contentWrapper: any = {
            _getComponents: () => [signedData]
        };
        const root: any = {_fromBytes: (_token: Uint8Array): any => undefined, _getComponents: () => [{}, contentWrapper]};
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        const result: Uint8Array = signer._extractTsaCertificate(new Uint8Array([1]));
        expect(result).toEqual(certificateBytes);
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate keeps wrapper when constructed wrapper contains multiple children', () => {
        const signer: any = createSigner();
        const firstCertificate: any = {_toBytes: () => new Uint8Array([1, 2, 3])};
        const secondCertificate: any = { _toBytes: () => new Uint8Array([4, 5, 6])};
        const certificatesWrapper: any = {
            _construction: _ConstructionType.constructed,
            _getComponents: () => [firstCertificate, secondCertificate]
        };
        const signedData: any = { _getComponents: () => [{}, {}, {}, certificatesWrapper]};
        const contentWrapper: any = { _getComponents: () => [signedData]};
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any { return root;};
        const result: Uint8Array = signer._extractTsaCertificate(new Uint8Array([1]));
        expect(result).toEqual(new Uint8Array([1, 2, 3]));
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate throws when certificate collection empty', () => {
        const signer: any = createSigner();
        const certificatesWrapper: any = { _construction: _ConstructionType.primitive, _getComponents: (): any => []};
        const signedData: any = { _getComponents: () => [{}, {}, {}, certificatesWrapper]};
        const contentWrapper: any = {_getComponents: () => [signedData]};
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        expect((): void => {signer._extractTsaCertificate(new Uint8Array([1]));}).toThrow();
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate throws when first certificate missing', () => {
        const signer: any = createSigner();
        const certificatesWrapper: any = {
            _construction: _ConstructionType.primitive,
            _getComponents: (): any => [undefined]
        };
        const signedData: any = {_getComponents: () => [{}, {}, {}, certificatesWrapper]};
        const contentWrapper: any = {_getComponents: () => [signedData]};
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        expect((): void => {signer._extractTsaCertificate(new Uint8Array([1]));}).toThrow();
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _extractTsaCertificate returns first certificate bytes', () => {
        const signer: any = createSigner();
        const certificateBytes: Uint8Array = new Uint8Array([10, 20, 30]);
        const certificateNode: any = {_toBytes: () => certificateBytes};
        const certificatesWrapper: any = {
            _construction: _ConstructionType.primitive,
            _getComponents: () => [certificateNode]
        };
        const signedData: any = { _getComponents: () => [{}, {}, {}, certificatesWrapper]};
        const contentWrapper: any = { _getComponents: () => [signedData] };
        const root: any = {
            _fromBytes: (_token: Uint8Array): any => undefined,
            _getComponents: () => [{}, contentWrapper]
        };
        const originalElement: any = _PdfUniqueEncodingElement;
        (_PdfUniqueEncodingElement as any) = function (): any {return root;};
        const result: Uint8Array = signer._extractTsaCertificate(new Uint8Array([1]));
        expect(result).toEqual(certificateBytes);
        (_PdfUniqueEncodingElement as any) = originalElement;
    });
    it('1038509 _verifyRsaPkcs1Signature returns true when signer validates signature', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const fakeVerifier: any = {
            _initialize: (_flag: boolean, _key: any): any => undefined,
            _blockUpdate: (_data: Uint8Array, _offset: number, _length: number): any => undefined,
            _validateSignature: (_signature: Uint8Array): any => true
        };
        signer._PdfSignerUtilities = undefined;
        const originalGetSigner: any = _PdfSignerUtilities.prototype._getSigner;
        _PdfSignerUtilities.prototype._getSigner = (_mode: string): any => fakeVerifier;
        const result: boolean = signer._verifyRsaPkcs1Signature('SHA256', new Uint8Array([1]), new Uint8Array([2]), {});
        expect(result).toBe(true);
        _PdfSignerUtilities.prototype._getSigner = originalGetSigner;
    });
    it('1038509 _verifyRsaPkcs1Signature uses SHA algorithm with RSA suffix', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        let receivedMode: string;
        const fakeVerifier: any = {
            _initialize: (_flag: boolean, _key: any): any => undefined,
            _blockUpdate: (_data: Uint8Array, _offset: number, _length: number): any => undefined,
            _validateSignature: (_signature: Uint8Array): any => true
        };
        const originalGetSigner: any = _PdfSignerUtilities.prototype._getSigner;
        _PdfSignerUtilities.prototype._getSigner = (mode: string): any => { receivedMode = mode; return fakeVerifier;};
        signer._verifyRsaPkcs1Signature('SHA256', new Uint8Array([1]), new Uint8Array([2]), {});
        expect(receivedMode).toBe('SHA256withRSA');
        _PdfSignerUtilities.prototype._getSigner = originalGetSigner;
    });
    it('1038509 _verifyRsaPkcs1Signature initializes verifier for validation mode', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        let initializeFlag: boolean;
        const fakeVerifier: any = {
            _initialize: (flag: boolean, _key: any): any => {
                initializeFlag = flag;
            },
            _blockUpdate: (_data: Uint8Array, _offset: number, _length: number): any => undefined,
            _validateSignature: (_signature: Uint8Array): any => true
        };
        const originalGetSigner: any = _PdfSignerUtilities.prototype._getSigner;
        _PdfSignerUtilities.prototype._getSigner = (_mode: string): any => fakeVerifier;
        signer._verifyRsaPkcs1Signature('SHA256', new Uint8Array([1]), new Uint8Array([2]), {});
        expect(initializeFlag).toBe(false);
        _PdfSignerUtilities.prototype._getSigner = originalGetSigner;
    });
    it('1038509 _verifyRsaPkcs1Signature returns false when signature validation fails', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const fakeVerifier: any = {
            _initialize: (_flag: boolean, _key: any): any => undefined,
            _blockUpdate: (_data: Uint8Array, _offset: number, _length: number): any => undefined,
            _validateSignature: (_signature: Uint8Array): any => false
        };
        const originalGetSigner: any = _PdfSignerUtilities.prototype._getSigner;
        _PdfSignerUtilities.prototype._getSigner = (_mode: string): any => fakeVerifier;
        const result: boolean = signer._verifyRsaPkcs1Signature('SHA256', new Uint8Array([1]), new Uint8Array([2]), {});
        expect(result).toBe(false);
        _PdfSignerUtilities.prototype._getSigner = originalGetSigner;
    });
    it('1038509 _verifyRsaPkcs1Signature returns false when signer retrieval throws', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const originalGetSigner: any = _PdfSignerUtilities.prototype._getSigner;
        _PdfSignerUtilities.prototype._getSigner = (_mode: string): any => {throw new Error('failure');};
        const result: boolean = signer._verifyRsaPkcs1Signature('SHA256', new Uint8Array([1]), new Uint8Array([2]), {});
        expect(result).toBe(false);
        _PdfSignerUtilities.prototype._getSigner = originalGetSigner;
    });
});
describe('1038509 _bytesEqual mutations', () => {
    it('1038509 _bytesEqual returns false when first array undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);;
        const result: boolean = signer._bytesEqual(undefined, new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 _bytesEqual returns false when second array undefined', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const result: boolean = signer._bytesEqual(new Uint8Array([1]), undefined);
        expect(result).toBe(false);
    });
    it('1038509 _bytesEqual returns false when lengths differ', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const result: boolean = signer._bytesEqual(new Uint8Array([1, 2]), new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 _bytesEqual returns false when bytes differ', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const result: boolean = signer._bytesEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 9, 3]));
        expect(result).toBe(false);
    });
    it('1038509 _bytesEqual returns true when all bytes match', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const left: Uint8Array = new Uint8Array([10, 20, 30]);
        const right: Uint8Array = new Uint8Array([10, 20, 30]);
        const result: boolean = signer._bytesEqual(left, right);
        expect(result).toBe(true);
    });
    it('1038509 _bytesEqual compares final element of array', () => {
        const signer: any = new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);
        const result: boolean = signer._bytesEqual(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 4])
        );
        expect(result).toBe(false);
    });
});
describe('1038509 _validateAttributes mutations', () => {
    function createSigner(): any { return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), undefined as any);}
    it('1038509 _validateAttributes returns false when attribute undefined', () => {
        const signer: any = createSigner();
        signer._signatureBytes = new Uint8Array([1]);
        const result: boolean = signer._validateAttributes(undefined);
        expect(result).toBe(false);
    });
    it('1038509 _validateAttributes returns false when attribute length zero', () => {
        const signer: any = createSigner();
        signer._signatureBytes = new Uint8Array([1]);
        const result: boolean = signer._validateAttributes(new Uint8Array(0));
        expect(result).toBe(false);
    });
    it('1038509 _validateAttributes returns false when signature bytes missing', () => {
        const signer: any = createSigner();
        const result: boolean = signer._validateAttributes(new Uint8Array([10, 20]));
        expect(result).toBe(false);
    });
    it('1038509 _validateAttributes passes attribute bytes to verifier', () => {
        const signer: any = createSigner();
        const attributeBytes: Uint8Array = new Uint8Array([10, 20, 30]);
        signer._signatureBytes = new Uint8Array([40]);
        let updatedLength: number = -1;
        const verifier: any = {
            _blockUpdate: (
                data: Uint8Array,
                offset: number,
                length: number
            ): void => {
                expect(data).toBe(attributeBytes);
                expect(offset).toBe(0);
                updatedLength = length;
            },
            _validateSignature: (_signature: Uint8Array): boolean => true
        };
        signer._signatureCertificate = {_getPublicKey: (): any => {return {}; } };
        signer._initializeSigner = (_key: any): any => verifier;
        const result: boolean = signer._validateAttributes(attributeBytes);
        expect(result).toBe(true);
        expect(updatedLength).toBe(attributeBytes.length);
    });
    it('1038509 _validateAttributes returns true when signature validation succeeds', () => {
        const signer: any = createSigner();
        signer._signatureBytes = new Uint8Array([1]);
        signer._signatureCertificate = { _getPublicKey: (): any => { return {}; } };
        const verifier: any = {
            _blockUpdate: (
                _data: Uint8Array,
                _offset: number,
                _length: number
            ): void => undefined,
            _validateSignature: (_signature: Uint8Array): boolean => true
        };
        signer._initializeSigner = (_key: any): any => verifier;
        const result: boolean = signer._validateAttributes( new Uint8Array([5, 6, 7]));
        expect(result).toBe(true);
    });
    it('1038509 _validateAttributes returns false when signature validation fails', () => {
        const signer: any = createSigner();
        signer._signatureBytes = new Uint8Array([1]);
        signer._signatureCertificate = {_getPublicKey: (): any => { return {}; }};
        const verifier: any = {
            _blockUpdate: (
                _data: Uint8Array,
                _offset: number,
                _length: number
            ): void => undefined,
            _validateSignature: (_signature: Uint8Array): boolean => false
        };
        signer._initializeSigner = (_key: any): any => verifier;
        const result: boolean = signer._validateAttributes(new Uint8Array([1, 2, 3]) );
        expect(result).toBe(false);
    });
    it('1038509 _validateAttributes uses public key from signature certificate', () => {
        const signer: any = createSigner();
        signer._signatureBytes = new Uint8Array([1]);
        const publicKey: any = {
            modulus: new Uint8Array([1]),
            exponent: new Uint8Array([1])
        };
        let receivedPublicKey: any;
        signer._signatureCertificate = { _getPublicKey: (): any => {return publicKey;}};
        signer._initializeSigner = (key: any): any => {
            receivedPublicKey = key;
            return {
                _blockUpdate: (
                    _data: Uint8Array,
                    _offset: number,
                    _length: number
                ): void => {},
                _validateSignature: (
                    _signature: Uint8Array
                ): boolean => {
                    return true;
                }
            };
        };
        const attributeBytes: Uint8Array = new Uint8Array([10, 20, 30]);
        const result: boolean = signer._validateAttributes(attributeBytes);
        expect(result).toBe(true);
        expect(receivedPublicKey).toBe(publicKey);
        signer._initializeSigner = undefined;
        signer._signatureCertificate = undefined;
        signer._signatureBytes = undefined;
    });
});
describe('1038509 _extractDigestFromAttribute mutation coverage', () => {
    let signer: any;
    beforeEach(() => {
        signer = new _PdfCryptographicMessageSyntaxSigner(undefined as any, [] as any,'SHA256', false);
    });
    afterEach(() => {
        signer = undefined;
    });
    it('1038509 returns undefined for undefined attribute', () => {
        const result: Uint8Array = signer._extractDigestFromAttribute(undefined);
        expect(result).toBeUndefined();
    });
    it('1038509 returns undefined for empty attribute', () => {
        const attribute: Uint8Array = new Uint8Array(0);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
    it('1038509 returns raw digest when length is 32', () => {
        const digest: Uint8Array = new Uint8Array(32);
        digest[0] = 11;
        digest[31] = 99;
        const result: Uint8Array = signer._extractDigestFromAttribute(digest);
        expect(result).toBe(digest);
        expect(result[0]).toBe(11);
        expect(result[31]).toBe(99);
    });
    it('1038509 parses octet string with short form length', () => {
        const attribute: Uint8Array = new Uint8Array([0x04, 0x03, 10, 20, 30 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([10, 20, 30]);
    });
    it('1038509 parses octet string with long form length', () => {
        const attribute: Uint8Array = new Uint8Array([ 0x04, 0x81, 0x03, 1, 2, 3 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1038509 returns undefined when octet length exceeds available bytes', () => {
        const attribute: Uint8Array = new Uint8Array([ 0x04, 0x05, 1, 2]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
    it('1038509 sequence branch returns undefined when length is one byte only', () => {
        const attribute: Uint8Array = new Uint8Array([ 0x30 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
    it('1038509 sequence branch parses embedded octet string', () => {
        const attribute: Uint8Array = new Uint8Array([ 0x30, 0x05, 0x04, 0x03, 21, 22, 23 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([21, 22, 23]);
    });
    it('1038509 sequence branch parses long form sequence length', () => {
        const attribute: Uint8Array = new Uint8Array([0x30, 0x81, 0x05, 0x04, 0x02, 55, 66]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([55, 66]);
    });
    it('1038509 sequence branch skips non octet bytes before locating digest', () => {
        const attribute: Uint8Array = new Uint8Array([0x30, 0x07, 0x01, 0x01, 0xff, 0x04, 0x02, 7, 8]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([7, 8]);
    });
    it('1038509 sequence branch returns undefined when octet tag appears at last index', () => {
        const attribute: Uint8Array = new Uint8Array([ 0x30, 0x01, 0x04 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
    it('1038509 sequence branch parses long form octet length', () => {
        const attribute: Uint8Array = new Uint8Array([0x30, 0x08, 0x04, 0x81, 0x03, 101, 102, 103]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeDefined();
        expect(Array.from(result)).toEqual([101, 102, 103]);
    });
    it('1038509 sequence branch returns undefined when parsed octet length exceeds data', () => {
        const attribute: Uint8Array = new Uint8Array([0x30, 0x04, 0x04, 0x05, 1, 2]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
    it('1038509 sequence branch returns undefined when no octet string exists', () => {
        const attribute: Uint8Array = new Uint8Array([0x30, 0x04, 0x01, 0x01, 0xff, 0x02 ]);
        const result: Uint8Array = signer._extractDigestFromAttribute(attribute);
        expect(result).toBeUndefined();
    });
});
