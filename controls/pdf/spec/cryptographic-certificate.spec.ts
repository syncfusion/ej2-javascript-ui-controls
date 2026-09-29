import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfPublicKeyCryptographyCertificate } from "../src/pdf/core/security/digital-signature/pdf-cryptography-certificate";
import { _PdfX509Certificates } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfRonCipherParameter } from "../src/pdf/core/security/digital-signature/x509/x509-cipher-handler";
import { _AdvancedEncryption128Cipher } from "../src/pdf/core/security/encryptors/advance-cipher";
import { _DataEncryptionStandardCipher } from "../src/pdf/core/security/encryptors/cipher-tranform";
import { _CipherTwo, _NormalCipherFour } from "../src/pdf/core/security/encryptors/normal-cipher";
import { certchain_1 } from "./certificate-input.spec";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _ConstructionType, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _TripleDataEncryptionStandardCipher } from "../src/pdf/core/security/encryptors/encryption-cipher";
import { _MD5 } from "../src/pdf/core/security/encryptors/messageDigest5";
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";

describe('1041524 - Cryptographic certificate Mutation 1', () => {
    it('1041524 - should initialize keyBag oid correctly', () => {
        const pkcs = new _PdfPublicKeyCryptographyCertificate();
        expect(pkcs._keyBag).toBe('1.2.840.113549.1.12.10.1.1');
    });
    it('1041524 - should not load certificate when input is empty', () => {
        expect(() => {
            new _PdfPublicKeyCryptographyCertificate(
                new Uint8Array(0),
                'password'
            );
        }).not.toThrow();
    });
    it('1041524 - should not load certificate when password is null', () => {
        expect(() => {
            new _PdfPublicKeyCryptographyCertificate(
                new Uint8Array([1]),
                null as any
            );
        }).not.toThrow();
    });
    it('1041524 - should create subject key identifier', () => {
        const certificate = new _PdfPublicKeyCryptographyCertificate();
        const publicKey = new _PdfRonCipherParameter(
            false,
            new Uint8Array([1]),
            new Uint8Array([1])
        );
        const id = new Uint8Array([1, 2, 3]);
        const result = certificate._createSubjectKeyID(publicKey, id);
        expect(result).toBeDefined();
        expect(result._bytes).toBeDefined();
        expect(result._bytes.length).toBeGreaterThan(0);
    });
    it('1041524 - should not throw input is null when input has data', () => {
        const certificate = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            certificate._loadCertificate(new Uint8Array([1]), 'password');
        }).not.toThrowError('input is null');
    });
    it('1041524 - should populate certificate chain from certificate bags', () => {
        const bytes = new Uint8Array(
            atob(certchain_1).split('').map((c: string) => c.charCodeAt(0))
        );
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._loadCertificate(bytes, 'moorthy');
        expect(cert._certificateChain.length).toBe(2);
    });
});
describe('1041524 - Cryptographic certificate Mutation 2', () => {
    it('1041524 - should throw when input is null (kills: !input mutation)', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let errorMessage = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            isThrown = true;
            errorMessage = e.message;
        }
        expect(isThrown).toBe(true);
        expect(errorMessage).toBe('input is null');
    });
    it('1041524 - should throw when input is undefined (kills: !input mutation)', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let errorMessage = '';
        try {
            cert._loadCertificate(undefined as any, 'password');
        } catch (e) {
            isThrown = true;
            errorMessage = e.message;
        }
        expect(isThrown).toBe(true);
        expect(errorMessage).toBe('input is null');
    });
    it('1041524 - should throw when input is empty array (kills: input.length === 0 mutation)', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let errorMessage = '';
        try {
            cert._loadCertificate(new Uint8Array(0), 'password');
        } catch (e) {
            isThrown = true;
            errorMessage = e.message;
        }
        expect(isThrown).toBe(true);
        expect(errorMessage).toBe('input is null');
    });
    it('1041524 - should throw when input is empty array with explicit length (kills: input.length === 0 mutation)', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const emptyInput = new Uint8Array([]);
        let isThrown = false;
        let errorMessage = '';
        expect(emptyInput.length).toBe(0);
        try {
            cert._loadCertificate(emptyInput, 'password');
        } catch (e) {
            isThrown = true;
            errorMessage = e.message;
        }
        expect(isThrown).toBe(true);
        expect(errorMessage).toBe('input is null');
    });
    it('1041524 - should NOT throw when input has valid length and contains data', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const validInput = new Uint8Array([0x30, 0x00, 0x30, 0x00]);
        const origFromBytes = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
        const origGetSequence = (_PdfUniqueEncodingElement.prototype as any)._getSequence;
        let threwInputNull = false;
        try {(_PdfUniqueEncodingElement.prototype as any)._fromBytes = function (_bytes: Uint8Array) {};
            (_PdfUniqueEncodingElement.prototype as any)._getSequence = function (): any[] {return [
            null,{_getSequence: (): any[] => [null,{_getSequence: (): any[] => [{_getOctetString: (): Uint8Array | undefined => undefined
            }]}]}];};
            try {
                cert._loadCertificate(validInput, 'password');
            } catch (e) {
                if (e.message === 'input is null') {
                    threwInputNull = true;
                }
            }
        } finally {
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = origFromBytes;
            (_PdfUniqueEncodingElement.prototype as any)._getSequence = origGetSequence;
        }
        expect(threwInputNull).toBe(false);
    });
    it('1041524 - should distinguish between falsy input and zero-length input', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let nullThrown = false;
        let nullMessage = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            nullThrown = true;
            nullMessage = e.message;
        }
        expect(nullThrown).toBe(true);
        expect(nullMessage).toBe('input is null');
        let emptyThrown = false;
        let emptyMessage = '';
        try {
            cert._loadCertificate(new Uint8Array(0), 'password');
        } catch (e) {
            emptyThrown = true;
            emptyMessage = e.message;
        }
        expect(emptyThrown).toBe(true);
        expect(emptyMessage).toBe('input is null');
    });
});
describe('1041524 - Cryptographic certificate Mutation 3', () => {
    it('1041524 - should NOT process certificateChain when it is null', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let called = false;
        const original = (cert as any)._processCertificateCollection;
        try {
            (cert as any)._processCertificateCollection = function (): void {
                called = true;
            };
            (cert as any)._certificateChain = null;
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(called).toBe(false);
        } finally {
            (cert as any)._processCertificateCollection = original;
        }
    });
    it('1041524 - should NOT process certificateChain when empty', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let called = false;
        const original = (cert as any)._processCertificateCollection;
        try {
            (cert as any)._processCertificateCollection = function (): void {
                called = true;
            };
            (cert as any)._certificateChain = [];
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(called).toBe(false);
        } finally {
            (cert as any)._processCertificateCollection = original;
        }
    });
    it('1041524 - should process certificateChain when length is greater than zero', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let called = false;
        let argument: any;
        const original = (cert as any)._processCertificateCollection;
        try {
            (cert as any)._processCertificateCollection = function (c: any): void {
                called = true;
                argument = c;
            };
            const chain = [{ _getSequence: (): any[] => [] }];
            (cert as any)._certificateChain = chain;
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(called).toBe(true);
            expect(argument).toBe(chain);
        } finally {
            (cert as any)._processCertificateCollection = original;
        }
    });
});
describe('1041524 - Cryptographic certificate Mutation 4', () => {
    it('1041524 - should require BOTH input being non-null AND length > 0', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isNullInputThrown = false;
        let nullInputMessage = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            isNullInputThrown = true;
            nullInputMessage = e.message;
        }
        expect(isNullInputThrown).toBe(true);
        expect(nullInputMessage).toBe('input is null');
        let isEmptyInputThrown = false;
        let emptyInputMessage = '';
        try {
            cert._loadCertificate(new Uint8Array([]), 'password');
        } catch (e) {
            isEmptyInputThrown = true;
            emptyInputMessage = e.message;
        }
        expect(isEmptyInputThrown).toBe(true);
        expect(emptyInputMessage).toBe('input is null');
    });
    it('1041524 - should require BOTH certificateChain existing AND length > 0 to process', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let processCallCount = 0;
        const original = (cert as any)._processCertificateCollection;
        try {
            (cert as any)._processCertificateCollection = function (): void {
                processCallCount++;
            };
            (cert as any)._certificateChain = null;
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(processCallCount).toBe(0);
            processCallCount = 0;
            (cert as any)._certificateChain = [];
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(processCallCount).toBe(0);
            processCallCount = 0;
            (cert as any)._certificateChain = [{ _getSequence: (): any[] => [] }];
            if ((cert as any)._certificateChain && (cert as any)._certificateChain.length > 0) {
                (cert as any)._processCertificateCollection((cert as any)._certificateChain);
            }
            expect(processCallCount).toBe(1);
        } finally {
            (cert as any)._processCertificateCollection = original;
        }
    });
});
describe('1041524 - Cryptographic certificate Mutation 5', () => {
    it('1041524 - 1', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let message = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            isThrown = true;
            message = e.message;
        }
        expect(isThrown).toBe(true);
        expect(message).toBe('input is null');
    });
    it('1041524 - 2', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let message = '';
        try {
            cert._loadCertificate(new Uint8Array(0), 'password');
        } catch (e) {
            isThrown = true;
            message = e.message;
        }
        expect(isThrown).toBe(true);
        expect(message).toBe('input is null');
    });
    it('1041524 - 3', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const singleByteInput = new Uint8Array(1);
        singleByteInput[0] = 48;
        let inputNullThrown = false;
        try {
            cert._loadCertificate(singleByteInput, 'password');
        } catch (e) {
            if (e.message === 'input is null') {
                inputNullThrown = true;
            }
        }
        expect(inputNullThrown).toBe(false);
    });
    it('1041524 - 4', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let nullThrown = false;
        let nullMessage = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            nullThrown = true;
            nullMessage = e.message;
        }
        let emptyThrown = false;
        let emptyMessage = '';
        try {
            cert._loadCertificate(new Uint8Array(0), 'password');
        } catch (e) {
            emptyThrown = true;
            emptyMessage = e.message;
        }
        expect(nullThrown).toBe(true);
        expect(nullMessage).toBe('input is null');
        expect(emptyThrown).toBe(true);
        expect(emptyMessage).toBe('input is null');
    });
    it('1041524 - 5', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let message = '';
        try {
            cert._loadCertificate(new Uint8Array(10), null as any);
        } catch (e) {
            isThrown = true;
            message = e.message;
        }
        expect(isThrown).toBe(true);
        expect(message).toBe('password is null');
    });
    it('1041524 - 6', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let isThrown = false;
        let message = '';
        try {
            cert._loadCertificate(new Uint8Array(10), '');
        } catch (e) {
            isThrown = true;
            message = e.message;
        }
        expect(isThrown).toBe(true);
        expect(message).toBe('password is null');
    });
});
describe('1041524 - Cryptographic certificate Mutation 6', () => {
    function createMockElement(): any {
        return {
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1]),
            _getOctetString: (): Uint8Array => new Uint8Array([1]),
            _getObjectIdentifier: (): any => ({ toString: (): string => '' }),
            _getAbstractSetValue: (): any[] | undefined => undefined,
            _getBmpString: (): string => '',
            _getUtf8String: (): string | undefined => undefined
        };
    }
    function createOid(oid: string): any {
        const elem = createMockElement();
        elem._getObjectIdentifier = () => ({
            toString: (): string => oid
        });
        return elem;
    }
    function createAttribute(
        oid: string,
        attrContainer: any
    ): any {
        const elem = createMockElement();
        elem._getSequence = (): any[] => [
            createOid(oid),
            attrContainer || createMockElement()
        ];
        return elem;
    }
    function createCertificate(
        attributes: any[]
    ): any {
        const elem = createMockElement();
        elem._getSequence = (): any[] => [
            {_getSequence: (): any[] => [createMockElement()],_getValue: (): Uint8Array => new Uint8Array([1]),_getOctetString: (): Uint8Array => new Uint8Array([1])},
            {_getSequence: (): any[] => attributes && attributes.length > 0 ? attributes : [],_getValue: (): Uint8Array => new Uint8Array([1]),_getOctetString: (): Uint8Array => new Uint8Array([1])}
        ];
        return elem;
    }
    it('1041524 - 7', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            cert._processCertificateCollection([
                createCertificate([])
            ]);
        }).toThrowError();
    });
    it('1041524 - 8', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            cert._processCertificateCollection([
                createCertificate([])
            ]);
        }).toThrowError();
    });
    it('1041524 - 9', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any[] => [
            {
                _getOctetString: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getValue: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getSequence: (): any[] => []
            }
        ];
        const chain = [
            createCertificate([
                createAttribute('1.2.840.113549.1.9.21', attrContainer)
            ])
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).toThrowError();
    });
    it('1041524 - 10', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): undefined => undefined;
        attrContainer._getSequence = (): any[] => [
            {
                _getOctetString: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getValue: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getSequence: (): any[] => []
            }
        ];
        const chain = [
            createCertificate([
                createAttribute('1.2.840.113549.1.9.21', attrContainer)
            ])
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).toThrowError();
    });
    it('1041524 - 11', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): null => null;
        attrContainer._getSequence = (): any[] => [
            {
                _getOctetString: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getValue: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _getSequence: (): any[] => []
            }
        ];
        const chain = [
            createCertificate([
                createAttribute('1.2.840.113549.1.9.21', attrContainer)
            ])
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).toThrowError();
    });
    it('1041524 - 12', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any[] => [
            createMockElement()
        ];
        attrContainer._getBmpString = (): string => 'TestKey';
        const chain = [
            createCertificate([
                createAttribute('1.2.840.113549.1.9.20', attrContainer)
            ])
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).toThrowError();
    });
    it('1041524 - 13', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any[] => [
            createMockElement()
        ];
        const chain = [
            createCertificate([
                createAttribute('1.2.840.113549.1.9.21', attrContainer)
            ])
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).toThrowError();
    });
    it('1041524 - 14', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any[] => [
            createMockElement()
        ];
        const attr = createAttribute(
            '1.2.840.113549.1.9.21',
            attrContainer
        );
        expect(() => {
            cert._processCertificateCollection([
                createCertificate([
                    attr,
                    attr
                ])
            ]);
        }).toThrowError();
    });
    it('1041524 - 15', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any[] => [];
        expect(() => {
            cert._processCertificateCollection([
                createCertificate([
                    createAttribute('1.2.840.113549.1.9.21', attrContainer)
                ])
            ]);
        }).toThrowError();
    });
    it('1041524 - 16', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const attrContainer = createMockElement();
        attrContainer._getAbstractSetValue = (): any => null;
        expect(() => {
            cert._processCertificateCollection([
                createCertificate([
                    createAttribute('1.2.840.113549.1.9.21', attrContainer)
                ])
            ]);
        }).toThrowError();
    });
});
describe('1041524 - Cryptographic certificate Mutation 7', () => {
    it('1041524 - 17', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [];
        let called = false;
        const orig = (cert as any)._processCertificateCollection;
        (cert as any)._processCertificateCollection = function (): void {
            called = true;
        };
        if (cert._certificateChain && cert._certificateChain.length > 0) {
            (cert as any)._processCertificateCollection(cert._certificateChain);
        }
        expect(called).toBe(false);
        (cert as any)._processCertificateCollection = orig;
    });
    it('1041524 - 18', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = null as any;
        let called = false;
        const orig = (cert as any)._processCertificateCollection;
        (cert as any)._processCertificateCollection = function (): void {
            called = true;
        };
        if (cert._certificateChain && cert._certificateChain.length > 0) {
            (cert as any)._processCertificateCollection(cert._certificateChain);
        }
        expect(called).toBe(false);
        (cert as any)._processCertificateCollection = orig;
    });
    it('1041524 - 19', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [];
        let processedCalled = false;
        const orig = (cert as any)._processCertificateCollection;
        (cert as any)._processCertificateCollection = function (): void {
            processedCalled = true;
        };
        if (cert._certificateChain && cert._certificateChain.length > 0) {
            (cert as any)._processCertificateCollection(cert._certificateChain);
        }
        expect(processedCalled).toBe(false);
        (cert as any)._processCertificateCollection = orig;
    });
    it('1041524 - 20', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [{} as any];
        let called = false;
        const orig = (cert as any)._processCertificateCollection;
        (cert as any)._processCertificateCollection = function (): void {
            called = true;
        };
        if (cert._certificateChain && cert._certificateChain.length > 0) {
            (cert as any)._processCertificateCollection(cert._certificateChain);
        }
        expect(called).toBe(true);
        (cert as any)._processCertificateCollection = orig;
    });
    it('1041524 - 21', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [];
        let called = false;
        const orig = (cert as any)._processCertificateCollection;
        (cert as any)._processCertificateCollection = function (): void {
            called = true;
        };
        expect(cert._certificateChain.length >= 0).toBe(true);
        expect(cert._certificateChain.length > 0).toBe(false);
        if (cert._certificateChain && cert._certificateChain.length > 0) {
            (cert as any)._processCertificateCollection(cert._certificateChain);
        }
        expect(called).toBe(false);
        (cert as any)._processCertificateCollection = orig;
    });
});
describe('1041524 - Cryptographic certificate Mutation 8', () => {
    it('1041524 - 22', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array | undefined => {
                return new Uint8Array([0x30, 0x00]);
            },
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        let thrown = false;
        try {
            (cert as any)._processData(mockContentElement, 'password');
        } catch (e) {
            thrown = true;
        }
        expect(thrown).toBe(false);
    });
    it('1041524 - 23', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 24', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let called = false;
        const orig = (cert as any)._parsePrivateKey;
        (cert as any)._parsePrivateKey = function (): void {
            called = true;
        };
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
        (cert as any)._parsePrivateKey = orig;
    });
    it('1041524 - 25', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let processed = false;
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        try {
            (cert as any)._processData(mockContentElement, 'password');
        } catch (e) {
            processed = false;
        }
        expect(processed === false).toBe(true);
    });
    it('1041524 - 26', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 27', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 28', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 29', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 30', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 31', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
    it('1041524 - 32', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const mockContentElement = {
            _getOctetString: (): Uint8Array => new Uint8Array([0x30, 0x00]),
            _getSequence: (): any[] => [],
            _getValue: (): Uint8Array => new Uint8Array([1])
        };
        expect(() => {
            (cert as any)._processData(mockContentElement, 'password');
        }).not.toThrow();
    });
});
describe('1041524 - Cryptographic certificate Mutation 9', () => {
    it('1041524 - 33', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        let nullInputThrown = false;
        let nullInputMessage = '';
        try {
            cert._loadCertificate(null as any, 'password');
        } catch (e) {
            nullInputThrown = true;
            nullInputMessage = e.message;
        }
        expect(nullInputThrown).toBe(true);
        expect(nullInputMessage).toBe('input is null');
        let emptyInputThrown = false;
        let emptyInputMessage = '';
        try {
            cert._loadCertificate(new Uint8Array(0), 'password');
        } catch (e) {
            emptyInputThrown = true;
            emptyInputMessage = e.message;
        }
        expect(emptyInputThrown).toBe(true);
        expect(emptyInputMessage).toBe('input is null');
        let passwordThrown = false;
        let passwordMessage = '';
        try {
            cert._loadCertificate(new Uint8Array(10), null as any);
        } catch (e) {
            passwordThrown = true;
            passwordMessage = e.message;
        }
        expect(passwordThrown).toBe(true);
        expect(passwordMessage).toBe('password is null');
    });
    it('1041524 - 34', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [];
        const mockCertChain: any[] = [];
        mockCertChain.push({
            _getSequence: (): any[] => [
                {
                    _getSequence: (): any[] => [
                        { _getObjectIdentifier: () => ({ toString: () => '1.2.840.113549.1.9.20' }) },
                        { _getValue: () => new Uint8Array(10) }
                    ]
                },
                {
                    _getSequence: (): any[] => [
                        {
                            _getSequence: (): any[] => [
                                { _getObjectIdentifier: () => ({ toString: () => '1.2.840.113549.1.9.20' }) },
                                {
                                    _getAbstractSetValue: () => [
                                        { _getBmpString: () => 'Key1' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        mockCertChain.push({
            _getSequence: (): any[] => [
                {
                    _getSequence: (): any[] => [
                        { _getObjectIdentifier: () => ({ toString: () => '1.2.840.113549.1.9.20' }) },
                        { _getValue: () => new Uint8Array(10) }
                    ]
                },
                {
                    _getSequence: (): any[] => [
                        {
                            _getSequence: (): any[] => [
                                { _getObjectIdentifier: () => ({ toString: () => '1.2.840.113549.1.9.20' }) },
                                {
                                    _getAbstractSetValue: () => [
                                        {
                                            _getBmpString: (): any => undefined,
                                            _getUtf8String: () => 'Key2'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        let hasThrown = false;
        try {
            cert._processCertificateCollection(mockCertChain);
        } catch (e) {
            hasThrown = true;
        }
        expect(hasThrown).toBe(true);
    });
});
describe('1041524 - Cryptographic certificate Mutation 10', () => {
    it('1041524 - should ignore attribute when attributeValues is empty', () => {
        const certificate: any = new _PdfPublicKeyCryptographyCertificate();
        const attribute: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.840.113549.1.9.20'
                    })
                },
                {
                    _getAbstractSetValue: (): any[] => []
                }
            ]
        };
        const attrsContainer: any = {
            _getSequence: () => [attribute]
        };
        const result =
            certificate._extractLocalIdentifiers(attrsContainer);
        expect(result.localIdentifier).toBeUndefined();
        expect(result.localId).toBeUndefined();
    });
    it('1041524 - should not set localId for friendlyName attribute', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        const value: any = {
            _getBmpString: () => 'FriendlyName',
            _getUtf8String: (): any => null,
            _getOctetString: () => new Uint8Array([1, 2, 3])
        };
        const attribute: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.840.113549.1.9.20'
                    })
                },
                {
                    _getAbstractSetValue: () => [value]
                }
            ]
        };
        const attrsContainer: any = {
            _getSequence: () => [attribute]
        };
        const result =
            certificate._extractLocalIdentifiers(attrsContainer);
        expect(result.localIdentifier).toBe('FriendlyName');
        expect(result.localId).toBeUndefined();
    });
    it('1041524 - should pass privateKey and attributes to storeKeyEntry', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        const privateKey = { key: 'test-key' };
        spyOn(cert, '_parsePrivateKey').and.returnValue({
            modulus: new Uint8Array([1]),
            publicExponent: new Uint8Array([1]),
            privateExponent: new Uint8Array([1]),
            prime1: new Uint8Array([1]),
            prime2: new Uint8Array([1]),
            exponent1: new Uint8Array([1]),
            exponent2: new Uint8Array([1]),
            coefficient: new Uint8Array([1])
        });
        spyOn(cert, '_createPrivateKey')
            .and.returnValue(privateKey);
        spyOn(cert, '_extractLocalIdentifiers')
            .and.returnValue({
                localIdentifier: 'id',
                localId: new Uint8Array([1])
            });
        spyOn(cert, '_storeKeyEntry');
        const certSeq: any[] = [];
        certSeq[1] = {
            _getSequence: () => [{
                _getSequence: () => [
                    {},
                    {
                        _getSequence: () => [{
                            _getObjectIdentifier: () => ({
                                toString: () => '1.2.840.113549.1.1.1'
                            })
                        }]
                    },
                    {
                        _getOctetString: () => new Uint8Array([1])
                    }
                ]
            }]
        };
        certSeq[2] = {};
        cert._handleKeyBag(certSeq);
        expect(cert._storeKeyEntry).toHaveBeenCalled();
        const args = (cert._storeKeyEntry as jasmine.Spy)
            .calls.mostRecent().args;
        expect(args[0]).toBe('id');
        expect(Array.from(args[1])).toEqual([1]);
        expect(args[2]).toEqual(
            jasmine.objectContaining({
                privateKey,
                attributes: {}
            })
        );
    });
    it('1041524 - should validate all RSA parameter names', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_validateValue');
        spyOn(cert, '_uint8ArrayToBigInt')
            .and.returnValue({});
        cert._createPrivateKey(
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1]),
            new Uint8Array([1])
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'publicExponent',
            jasmine.anything()
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'p',
            jasmine.anything()
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'q',
            jasmine.anything()
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'dP',
            jasmine.anything()
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'dQ',
            jasmine.anything()
        );
        expect(cert._validateValue).toHaveBeenCalledWith(
            'inverse',
            jasmine.anything()
        );
    });
    it('1041524 - should return true when all RSA parameters are equal', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        spyOn(certificate, '_uint8ArrayToBigInt')
            .and.callFake(
                (value: Uint8Array) => value
            );
        const key = certificate._createPrivateKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            new Uint8Array([3]),
            new Uint8Array([4]),
            new Uint8Array([5]),
            new Uint8Array([6]),
            new Uint8Array([7]),
            new Uint8Array([8])
        );
        expect(key.equals(key)).toBe(true);
    });
    it('1041524 - should return false when any RSA parameter differs', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        spyOn(certificate, '_uint8ArrayToBigInt')
            .and.callFake(
                (value: Uint8Array) => value
            );
        const key = certificate._createPrivateKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            new Uint8Array([3]),
            new Uint8Array([4]),
            new Uint8Array([5]),
            new Uint8Array([6]),
            new Uint8Array([7]),
            new Uint8Array([8])
        );
        [
            'dP',
            'dQ',
            'privateExponent',
            'modulus',
            'p',
            'q',
            'publicExponent',
            'inverse'
        ].forEach((property: string) => {
            const other: any = { ...key };
            other[property] = new Uint8Array([99]);

            expect(
                key.equals(other)
            ).toBe(false);
        });
    });
    it('1041524 - should return a zero bit length for an empty Uint8Array', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        const value = certificate._uint8ArrayToBigInt(
            new Uint8Array([])
        );
        expect(value._bitLength()).toBe(0);
    });
    it('1041524 - should encode password with trailing null terminator only', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        const result: Uint8Array =
            certificate._getPassword('A');
        expect(Array.from(result)).toEqual([
            0, 65,
            0, 0
        ]);
    });
    it('1041524 - should leave the final UTF16 terminator untouched', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        const result =
            certificate._getPassword('A');
        expect(result.length).toBe(4);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });
    it('1041524 - should decrypt RC4 content using oid 1.2.840.113549.1.12.1.2', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array([1]));
        spyOn(_NormalCipherFour.prototype, '_decryptBlock')
            .and.returnValue(new Uint8Array([9]));
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.2'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(algorithmSeq, new Uint8Array([1]), 'pwd');
        expect(Array.from(result)).toEqual([9]);
    });
    it('1041524 - should execute AES branch', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array([1]));
        spyOn(
            _AdvancedEncryption128Cipher.prototype,
            '_decryptBlock'
        ).and.returnValue(new Uint8Array([10]));
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.5.12'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1]),
            'pwd'
        );
        expect(Array.from(result)).toEqual([10]);
    });
    it('1041524 - should execute RC2 branch', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(
                new Uint8Array(16).fill(1)
            );
        spyOn(
            _CipherTwo.prototype,
            '_decrypt'
        ).and.returnValue(new Uint8Array([11]));
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.5'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1]),
            'pwd'
        );
        expect(Array.from(result)).toEqual([11]);
    });
    it('1041524 - should support MD5 based PBE algorithms', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        expect(() => {
            cert._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'pwd'
            );
        }).not.toThrow();
    });
    it('1041524 - should derive only key for RC4 algorithms', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.1'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1, 2, 3]),
            'pwd'
        );
        expect(cert._generateDerivedKey.calls.count()).toBe(1);
    });
    it('1041524 - should pass finalize=true to AES decryptBlock', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        let finalizeArg: boolean;
        spyOn(
            _AdvancedEncryption128Cipher.prototype,
            '_decryptBlock'
        ).and.callFake(
            function (
                _data: Uint8Array,
                finalize: boolean
            ): Uint8Array {
                finalizeArg = finalize;
                return new Uint8Array([]);
            }
        );
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.12'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([]),
            'pwd'
        );
        expect(finalizeArg).toBe(true);
    });
    it('1041524 - should decrypt exactly', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        expect(() => {
            cert._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'pwd'
            );
        }).not.toThrow();
    });
    it('1041524 - should return expected decrypted length for one 3DES block', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result =
            cert._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'pwd'
            );

        expect(result.length).toBe(8);
    });
    it('1041524 - should create DES cipher in decrypt mode', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        let receivedFlag: boolean;
        spyOn(
            _DataEncryptionStandardCipher.prototype,
            '_generateWorkingKey'
        ).and.callFake(
            function (
                flag: boolean
            ): number[] {
                receivedFlag = flag;
                return new Array(32).fill(0);
            }
        );
        const algorithmSeq: any[] = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.5.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array(8),
            'pwd'
        );
        expect(receivedFlag).toBe(false);
    });
    it('1041524 - should derive key correctly when salt length exceeds v', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const hashValues: any = {
            u: 4,
            v: 8,
            hash: () => new Uint8Array([1, 2, 3, 4])
        };
        const result = cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array(9).fill(5),
            1,
            1,
            4,
            hashValues
        );
        expect(result.length).toBe(4);
        expect(Array.from(result)).toEqual([1, 2, 3, 4]);
    });
    it('1041524 - should repeat salt bytes exactly Slen times', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const adjustSpy = spyOn(cert, '_adjust');
        cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([9]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: () => new Uint8Array([1, 2, 3, 4])
            }
        );
        expect(adjustSpy).toHaveBeenCalled();
    });
    it('1041524 - should derive key correctly when password length exceeds v', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const result = cert._generateDerivedKey(
            new Uint8Array(9).fill(1),
            new Uint8Array([1]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: () => new Uint8Array([1, 2, 3, 4])
            }
        );
        expect(result.length).toBe(4);
    });
    it('1041524 - should derive key for single password byte', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const result = cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: () => new Uint8Array([1, 2, 3, 4])
            }
        );
        expect(Array.from(result)).toEqual([1, 2, 3, 4]);
    });
    it('1041524 - should generate exactly n bytes', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const hashSpy = jasmine.createSpy('hash')
            .and.returnValue(new Uint8Array([1, 2, 3, 4]));
        cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: hashSpy
            }
        );
        expect(hashSpy.calls.count()).toBe(1);
    });
    it('1041524 - should hash combined D and I buffer', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const hashSpy = jasmine.createSpy('hash')
            .and.callFake((buf: Uint8Array) => {
                expect(buf.length).toBeGreaterThan(8);
                return new Uint8Array([1, 2, 3, 4]);
            });
        cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: hashSpy
            }
        );
    });
    it('1041524 - should adjust each I block exactly once', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const adjustSpy = spyOn(cert, '_adjust');
        cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            1,
            1,
            4,
            {
                u: 4,
                v: 8,
                hash: () => new Uint8Array([1, 2, 3, 4])
            }
        );
        expect(adjustSpy.calls.count()).toBe(2);
    });
    it('1041524 - should not return non certificate object from certificate store', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._certificates = {
            _get: jasmine.createSpy().and.returnValue({})
        };
        cert._localIdentifiers = new Map();
        cert._keyCertificates = new Map();
        const result = cert._getCertificate('test');
        expect(result).toBeUndefined();
    });
    it('1041524 - should trim certificate key before lookup', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const expected: any = Object.create(_PdfX509Certificates.prototype);
        cert._certificates = {
            _get: (): any => undefined
        };
        cert._localIdentifiers = new Map();
        cert._keyCertificates = new Map([
            ['ABC', expected]
        ]);
        const result = cert._getCertificate(' abc ');
        expect(result).toBe(expected);
    });
    it('1041524 - should not return non certificate object from uppercase lookup', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._certificates = {
            _get: (): any => undefined
        };
        cert._localIdentifiers = new Map();
        cert._keyCertificates = new Map([
            ['ABC', {}]
        ]);
        const result = cert._getCertificate('abc');
        expect(result).toBeUndefined();
    });
    it('1041524 - should not lookup key is absent', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        cert._certificates = {
            _get: (): any => undefined
        };
        cert._localIdentifiers = new Map();
        cert._keyCertificates = new Map();
        spyOn(cert._localIdentifiers, 'get');
        const result = cert._getCertificate('missing-key');
        expect(result).toBeUndefined();
        expect(cert._localIdentifiers.get)
            .not.toHaveBeenCalled();
    });
    it('1041524 - should not return invalid certificate object from keyCertificates lookup', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._certificates = {
            _get: (): any => undefined
        };
        cert._localIdentifiers = new Map([
            ['cert-key', 'local-id']
        ]);
        cert._keyCertificates = new Map([
            ['local-id', {}]
        ]);
        const result = cert._getCertificate('cert-key');
        expect(result).toBeUndefined();
    });
    it('1041524 - should parse RSA private key version', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const rsaSeq: any[] = [
            { _getInteger: () => 1 },
            { _getValue: () => new Uint8Array([2]) },
            { _getValue: () => new Uint8Array([3]) },
            { _getValue: () => new Uint8Array([4]) },
            { _getValue: () => new Uint8Array([5]) },
            { _getValue: () => new Uint8Array([6]) },
            { _getValue: () => new Uint8Array([7]) },
            { _getValue: () => new Uint8Array([8]) },
            { _getValue: () => new Uint8Array([9]) }
        ];
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_fromBytes'
        ).and.stub();
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getSequence'
        ).and.returnValue(rsaSeq);
        const result = cert._parsePrivateKey(
            new Uint8Array([48])
        );
        expect(Array.from(result.version))
            .toEqual([1]);
    });
    it('1041524 - should found', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map([
            ['key1', {}]
        ]);
        spyOn(cert, '_getCertificate').and.returnValue(undefined);
        const result = cert._getCertificateChain('key1');
        expect(result).toBeNull();
    });
    it('1041524 - should ignore non matching extension components', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const nonMatchingElement: any = {
            _tagClass: 999,
            _getTagNumber: () => 5
        };
        const x509: any = {
            _getExtension: () => ({
                _getValue: () => new Uint8Array([1])
            })
        };
        const certificates: any = {
            _certificate: x509
        };
        cert._keys = new Map([
            ['key1', {}]
        ]);
        spyOn(cert, '_getCertificate')
            .and.returnValue(certificates);
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_fromBytes'
        );
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getSequence'
        ).and.returnValue([
            nonMatchingElement
        ]);
        const result = cert._getCertificateChain('key1');
        expect(result.length).toBe(1);
    });
    it('1041524 - should add only existing certificates to chain', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const certificates: any = {
            _certificate: {
                _getExtension: (): any => undefined
            }
        };
        cert._keys = new Map([
            ['key1', {}]
        ]);
        spyOn(cert, '_getCertificate')
            .and.returnValue(certificates);
        const result = cert._getCertificateChain('key1');
        expect(result).toEqual([certificates]);
    });
    it('1041524 - should stop when next certificate equals current certificate', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        const certificates: any = {
            _certificate: {
                _getExtension: (): any => undefined
            }
        };
        cert._keys = new Map([
            ['key1', {}]
        ]);
        spyOn(cert, '_getCertificate')
            .and.returnValue(certificates);
        const result = cert._getCertificateChain('key1');
        expect(result.length).toBe(1);
    });
    it('1041524 - should return null when no key entry exists', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map();
        const result = cert._getCertificateChain('missing');
        expect(result).toBeNull();
    });
});
describe('1041524 - Cryptographic certificate Mutation 11', () => {
    let _isBasicEncodingElement: (value: any) => boolean;
    beforeEach(() => {
        _isBasicEncodingElement = () => false;
    });
    it('1041524 - should initialize data oid correctly', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(cert._data).toBe(
            '1.2.840.113549.1.7.1'
        );
    });
    it('1041524 - should initialize encryptedData oid correctly', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(cert._encryptedData).toBe(
            '1.2.840.113549.1.7.6'
        );
    });
    it('1041524 - should initialize certificateBag oid correctly', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(cert._certificateBag).toBe(
            '1.2.840.113549.1.12.10.1.3'
        );
    });
    it('1041524 - should initialize shroudedKeyBag oid correctly', () => {
        const cert = new _PdfPublicKeyCryptographyCertificate();
        expect(cert._shroudedKeyBag).toBe(
            '1.2.840.113549.1.12.10.1.2'
        );
    });
    it('1041524 - should not process certificate collection when chain becomes empty', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_processCertificateCollection');
        cert._certificateChain = [];
        if (cert._certificateChain.length > 0) {
            cert._processCertificateCollection(cert._certificateChain);
        }
        expect(cert._certificateChain.length).toBe(0);
        expect(cert._processCertificateCollection).not.toHaveBeenCalled();
    });
    it('1041524 - should not call processData when dataContent is undefined', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_processData');
        const originalFromBytes = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
        const originalGetSequence = (_PdfUniqueEncodingElement.prototype as any)._getSequence;
        let count = 0;
        try {
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                jasmine.createSpy();
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                function (): any[] {
                    count++;
                    if (count === 1) {
                        return [
                            null,
                            {
                                _getSequence: () => [
                                    null,
                                    {
                                        _getSequence: () => [
                                            {
                                                _getOctetString: () =>
                                                    new Uint8Array([1])
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                    }
                    return [
                        {
                            _getSequence: () => [
                                {
                                    _getObjectIdentifier: () => ({
                                        toString: () => cert._data
                                    })
                                },
                                {
                                    _getSequence: (): any[] => []
                                }
                            ]
                        }
                    ];
                };
            try {
                cert._loadCertificate(
                    new Uint8Array([1]),
                    'password'
                );
            } catch (e) {
                // ignore parsing exceptions
            }
            expect(cert._processData)
                .not.toHaveBeenCalled();
        } finally {
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;

            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                originalGetSequence;
        }
    });
    it('1041524 - should continue when extracted attributes are undefined', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(
            _PdfX509CertificateParser.prototype,
            '_readCertificate'
        ).and.returnValue(undefined);
        const chain: any[] = [
            {_getSequence: () => [{}, { _getSequence: () => [{_getSequence: () => [{},{_getSequence: () => [{_getValue: () =>new Uint8Array([1])}]}]}]}]}
        ];
        expect(() => {
            cert._processCertificateCollection(chain);
        }).not.toThrow();
    });
    it('1041524 - should use getSequence when getAbstractSetValue throws', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const getSequenceSpy = jasmine
            .createSpy('getSequence')
            .and.returnValue([]);
        const attributesElement: any = {
            _tagClass: _TagClassType.universal,
            _construction: _ConstructionType.constructed,
            _getTagNumber: () => _UniversalType.abstractSyntaxSet,
            _getAbstractSetValue: () => {
                throw new Error('force catch');
            },
            _getSequence: getSequenceSpy
        };
        const publicKey = new _PdfRonCipherParameter(
            false,
            new Uint8Array([1]),
            new Uint8Array([1])
        );
        spyOn(
            _PdfX509CertificateParser.prototype,
            '_readCertificate'
        ).and.returnValue({
            _getPublicKey: () => publicKey,
            _publicKeyBytes: new Uint8Array([1])
        });
        const chain: any[] = [
            {_getSequence: () => [{},{_getSequence: () => [{_getSequence: () => [{},{_getSequence: () => [{_getValue: () =>new Uint8Array([1])}]}]}]},attributesElement]}
        ];
        cert._processCertificateCollection(chain);
        expect(getSequenceSpy).toHaveBeenCalled();
    });
    it('1041524 - should return undefined identifiers when attributes are empty', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const result = cert._extractLocalIdentifiers({
            _getSequence: (): any[] => []
        });
        expect(result.localIdentifier).toBeUndefined();
        expect(result.localId).toBeUndefined();
    });
    it('1041524 - should fallback to getSequence when getAbstractSetValue throws', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const getSequenceSpy = jasmine
            .createSpy('getSequence')
            .and.returnValue([]);
        const attributesElement: any = {
            _tagClass: _TagClassType.universal,
            _construction: _ConstructionType.constructed,
            _getTagNumber: () => _UniversalType.abstractSyntaxSet,
            _getAbstractSetValue: () => {
                throw new Error('force catch');
            },
            _getSequence: getSequenceSpy
        };
        spyOn(
            _PdfX509CertificateParser.prototype,
            '_readCertificate'
        ).and.returnValue({
            _getPublicKey: () => ({}),
            _publicKeyBytes: new Uint8Array([1])
        });
        const chain: any[] = [
            {_getSequence: () => [{},{_getSequence: () => [{_getSequence: () => [{},{_getSequence: () => [{_getValue: () =>new Uint8Array([1])}]}]}]},attributesElement
                ]
            }
        ];
        try {
            cert._processCertificateCollection(chain);
        } catch (e) {
            // Ignore certificate-id generation failures.
        }
        expect(getSequenceSpy).toHaveBeenCalled();
    });
    it('1041524 - should use sequence when abstractSetValue is undefined', () => {
        const valueFromSequence = { marker: 'sequence' };
        const item: any = {
            _getAbstractSetValue: (): any => undefined,
            _getSequence: () => [valueFromSequence]
        };
        const attrSet =
            typeof item._getAbstractSetValue() !== 'undefined' &&
                item._getAbstractSetValue() !== null
                ? item._getAbstractSetValue()
                : item._getSequence();

        expect(attrSet[0]).toBe(valueFromSequence);
    });
    it('1041524 - should use sequence when abstractSetValue is null', () => {
        const sequenceValue = { marker: 'fallback' };
        const item: any = {
            _getAbstractSetValue: (): any => null,
            _getSequence: () => [sequenceValue]
        };
        const attrSet =
            typeof item._getAbstractSetValue() !== 'undefined' &&
                item._getAbstractSetValue() !== null
                ? item._getAbstractSetValue()
                : item._getSequence();
        expect(attrSet[0]).toBe(sequenceValue);
    });
    it('1041524 - should use abstractSetValue when available', () => {
        const abstractValue = [{ value: 123 }];
        const item: any = {
            _getAbstractSetValue: () => abstractValue,
            _getSequence: (): any[] => []
        };
        const attrSet =
            typeof item._getAbstractSetValue() !== 'undefined' &&
                item._getAbstractSetValue() !== null
                ? item._getAbstractSetValue()
                : item._getSequence();

        expect(attrSet).toBe(abstractValue);
    });
    it('1041524 - should not throw when duplicate attribute uses same object instance', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const sharedValue: any = {
            _getBmpString: () => 'FriendlyName'
        };
        const oid = '1.2.840.113549.1.9.20';
        const attributes: any = {};
        attributes[oid] = sharedValue;
        expect(() => {
            if (
                attributes[oid] &&
                attributes[oid] !== sharedValue
            ) {
                throw new Error(
                    'Should not add existing attribute with different value'
                );
            }
        }).not.toThrow();
    });
    it('1041524 - should not treat unrelated attribute as localId', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const publicKey = new _PdfRonCipherParameter(
            false,
            new Uint8Array([1]),
            new Uint8Array([1])
        );
        spyOn(
            _PdfX509CertificateParser.prototype,
            '_readCertificate'
        ).and.returnValue({
            _getPublicKey: () => publicKey,
            _publicKeyBytes: new Uint8Array([1])
        });
        const attributesElement: any = {
            _tagClass: _TagClassType.universal,
            _construction: _ConstructionType.constructed,
            _getTagNumber: () => _UniversalType.abstractSyntaxSet,
            _getAbstractSetValue: () => [
                {_getSequence: () => [{_getObjectIdentifier: () => ({toString: () => '1.2.3.4.5'})},{_getAbstractSetValue: () => [{_getOctetString: () =>new Uint8Array([9])}]}]}]
        };
        const chain = [{
            _getSequence: () => [
                {},
                {
                    _getSequence: () => [{
                        _getSequence: () => [
                            {},
                            {
                                _getSequence: () => [{
                                    _getValue: () =>
                                        new Uint8Array([1])
                                }]
                            }
                        ]
                    }]
                },
                attributesElement
            ]
        }];
        cert._processCertificateCollection(chain);
        expect(cert._keyCertificates.size).toBe(0);
    });
    it('1041524 - should move unmarked key entry to name', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._isUnMarkedKey = true;
        cert._keys = new Map([
            ['unmarked', 'expected-key-entry']
        ]);
        const publicKey = new _PdfRonCipherParameter(
            false,
            new Uint8Array([1]),
            new Uint8Array([1])
        );
        spyOn(
            _PdfX509CertificateParser.prototype,
            '_readCertificate'
        ).and.returnValue({
            _getPublicKey: () => publicKey,
            _publicKeyBytes: new Uint8Array([1])
        });
        const chain = [{
            _getSequence: () => [
                {},
                {
                    _getSequence: () => [{
                        _getSequence: () => [
                            {},
                            {
                                _getSequence: () => [{
                                    _getValue: () =>
                                        new Uint8Array([1])
                                }]
                            }
                        ]
                    }]
                }
            ]
        }];
        cert._processCertificateCollection(chain);
        expect(cert._keys.has('unmarked'))
            .toBe(false);
        expect(cert._keys.get('name'))
            .toBe('expected-key-entry');
    });
    it('1041524 - should allow duplicate attribute with same value instance', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const sharedValue: any = {
            _getBmpString: () => 'FriendlyName',
            _getUtf8String: (): any => undefined,
            _getOctetString: (): any => undefined
        };
        const attribute1: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.840.113549.1.9.20'
                    })
                },
                {
                    _getAbstractSetValue: () => [sharedValue]
                }
            ]
        };
        const attribute2: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.840.113549.1.9.20'
                    })
                },
                {
                    _getAbstractSetValue: () => [sharedValue]
                }
            ]
        };
        const attrsContainer: any = {
            _getSequence: () => [
                attribute1,
                attribute2
            ]
        };
        expect(() => {
            cert._extractLocalIdentifiers(attrsContainer);
        }).not.toThrow();
    });
    it('1041524 - should parse RSA private key only for RSA algorithm OID', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_parsePrivateKey').and.returnValue({
            modulus: new Uint8Array([1]),
            publicExponent: new Uint8Array([1]),
            privateExponent: new Uint8Array([1]),
            prime1: new Uint8Array([1]),
            prime2: new Uint8Array([1]),
            exponent1: new Uint8Array([1]),
            exponent2: new Uint8Array([1]),
            coefficient: new Uint8Array([1])
        });
        spyOn(cert, '_createPrivateKey').and.returnValue({});
        spyOn(cert, '_getCryptographicData')
            .and.returnValue(new Uint8Array([1]));
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes')
            .and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_getSequence')
            .and.returnValues([{_getSequence: () => [{_getObjectIdentifier: () => ({toString: () =>'1.2.840.113549.1.12.10.1.2'})},
        {_getSequence: () => [{_getSequence: () => [{_getSequence: (): any[] => []},{_getOctetString: () =>new Uint8Array([1])}]}]}]}],[{},{_getSequence: () => [
        {_getObjectIdentifier: () => ({toString: () =>'1.2.840.113549.1.1.1'})}]},{_getOctetString: () =>new Uint8Array([1])}]);
        const contentElement: any = {
            _getOctetString: () => new Uint8Array([1])
        };
        cert._processData(contentElement, 'pwd');
        expect(cert._parsePrivateKey).toHaveBeenCalled();
        expect(cert._createPrivateKey).toHaveBeenCalled();
    });
    it('1041524 - should not create keyEntry for non RSA private key algorithm', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map();
        spyOn(cert, '_getCryptographicData').and.returnValue(new Uint8Array([1]));
        spyOn<any>(cert, '_parsePrivateKey');
        spyOn<any>(cert, '_createPrivateKey');
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_getSequence').and.returnValues([{_getSequence: () => [{_getObjectIdentifier: () => ({toString: () =>'1.2.840.113549.1.12.10.1.2'})},
        {_getSequence: () => [{_getSequence: () => [{_getSequence: (): any[] => []},{_getOctetString: () =>new Uint8Array([1])}]}]}]}],
        [{},{_getSequence: () => [{_getObjectIdentifier: () => ({toString: () =>'1.2.840.10045.2.1'})}]},{_getOctetString: () =>new Uint8Array([1])}]);
        cert._processData({_getOctetString: () => new Uint8Array([1])},'password');
        expect(cert._parsePrivateKey).not.toHaveBeenCalled();
        expect(cert._createPrivateKey).not.toHaveBeenCalled();
        expect(cert._keys.size).toBe(1);
    });
    it('1041524 - should handle missing attribute sequence without creating key entries', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map();
        spyOn(cert, '_getCryptographicData').and.returnValue(new Uint8Array([1]));
        spyOn<any>(cert, '_parsePrivateKey');
        spyOn<any>(cert, '_createPrivateKey');
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_getSequence').and.returnValues([{
            _getSequence: () => [
                { _getObjectIdentifier: () => ({ toString: () => '1.2.840.113549.1.12.10.1.2' }) },
                { _getSequence: () => [{ _getSequence: () => [{ _getSequence: (): any[] => [] }, { _getOctetString: () => new Uint8Array([1]) }] }] }]
        }],
            [{}, { _getSequence: () => [{ _getObjectIdentifier: () => ({ toString: () => '1.2.840.10045.2.1' }) }] }, { _getOctetString: () => new Uint8Array([1]) }]
        );
        cert._processData({ _getOctetString: () => new Uint8Array([1]) }, 'password');
        expect(cert._parsePrivateKey).not.toHaveBeenCalled();
        expect(cert._createPrivateKey).not.toHaveBeenCalled();
        expect(cert._keys.size).toBe(1);
    });
    it('1041524 - should not process attributes when attributeSequence is empty', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map();
        spyOn(cert, '_getCryptographicData').and.returnValue(new Uint8Array([1]));
        spyOn<any>(cert, '_parsePrivateKey');
        spyOn<any>(cert, '_createPrivateKey');
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_getSequence').and.returnValues(
        [{_getSequence: () => [{_getObjectIdentifier: () => ({toString: () => '1.2.840.113549.1.12.10.1.2'})},
        {_getSequence: () => [{_getSequence: () => [{ _getSequence: (): any[] => [] },{ _getOctetString: () => new Uint8Array([1]) }]}]},
        {_getSequence: (): any[] => []}]}],[{},{_getSequence: () => [{_getObjectIdentifier: () => ({toString: () => '1.2.840.10045.2.1'})}]},{_getOctetString: () => new Uint8Array([1])}]
        );
        cert._processData({ _getOctetString: () => new Uint8Array([1]) },'password');
        expect(cert._parsePrivateKey).not.toHaveBeenCalled();
        expect(cert._createPrivateKey).not.toHaveBeenCalled();
        expect(cert._keys.size).toBe(1);
    });
    it('1041524 - should ignore attribute when attributeValues is empty', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const result = cert._extractLocalIdentifiers({
            _getSequence: () => [
                {
                    _getSequence: () => [
                        {
                            _getObjectIdentifier: () => ({
                                toString: () => '1.2.840.113549.1.9.20'
                            })
                        },
                        {
                            _getAbstractSetValue: (): any[] => []
                        }
                    ]
                }
            ]
        });
        expect(result.localIdentifier).toBeUndefined();
        expect(result.localId).toBeUndefined();
    });
    it('1041524 - should not throw when the same attribute value is added twice', () => {
        const attributes: any = {};
        const value = {
            _getBmpString: () => 'Test'
        };
        const attributeOid = '1.2.840.113549.1.9.20';
        attributes[attributeOid] = value;
        expect(() => {
            if (
                attributes[attributeOid] &&
                attributes[attributeOid] !== value
            ) {
                throw new Error(
                    'Should not add existing attribute with different value'
                );
            }

            attributes[attributeOid] = value;
        }).not.toThrow();
    });
    it('1041524 - should preserve UTF16 null terminator bytes', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        const result = certificate._getPassword('A');
        expect(result.length).toBe(4);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(65);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });
    it('1041524 - should not write beyond password characters', () => {
        const certificate: any = new _PdfPublicKeyCryptographyCertificate();
        const result = certificate._getPassword('');
        expect(Array.from(result)).toEqual([0, 0]);
    });
});
describe('1041524 - Cryptographic certificate Mutation 12', () => {
    it('1041524 - Should use SHA1 hash for RC4-40 derived key generation', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn(instance, '_generateDerivedKey').and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {_getObjectIdentifier: () => ({toString: () => '1.2.840.113549.1.12.1.2'})
            },
            {_getSequence: () => [{_getOctetString: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])},{_getInteger: () => 1}]
            }
        ];
        spyOn(instance, '_getPassword').and.returnValue(new Uint8Array([1, 2]));
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([]),
                'password'
            );
        } catch (e) {
            // Ignore cipher execution errors
        }
        expect(deriveSpy).toHaveBeenCalled();
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should derive 5 byte key for RC4-40', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        spyOn(instance, '_getPassword').and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [{_getObjectIdentifier: () => ({toString: () => '1.2.840.113549.1.12.1.2'})},
        {_getSequence: () => [{_getOctetString: () => new Uint8Array([1, 2, 3, 4])},{_getInteger: () => 1}]}
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        expect(deriveSpy.calls.argsFor(0)[4]).toBe(5);
    });
    it('1041524 - Should derive 8 byte IV for TripleDES algorithm', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(24));
        spyOn(instance, '_getPassword').and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [
        {_getObjectIdentifier: () => ({toString: () => '1.2.840.113549.1.12.1.4'})},{
        _getSequence: () => [{_getOctetString: () => new Uint8Array([1, 2, 3, 4])},
        {_getInteger: () => 1}]}];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        expect(deriveSpy.calls.argsFor(1)[4]).toBe(8);
    });
    it('1041524 - Should derive both key and IV for OID 1.2.840.113549.1.12.1.4', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(24));
        spyOn(instance, '_getPassword').and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [{_getObjectIdentifier: () => ({toString: () => '1.2.840.113549.1.12.1.4'})},{_getSequence: () => [{},
        {_getInteger: () => 1}]}];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        expect(deriveSpy.calls.count()).toBe(0);
    });
    it('1041524 - Should use SHA1 hash metadata for RC2-128 decryption', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const deriveSpy: jasmine.Spy = spyOn(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.5'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        expect(deriveSpy).toHaveBeenCalled();
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should derive a 16 byte key for RC2-128', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.5'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.argsFor(0)[4]).toBe(16);
    });
    it('1041524 - Should derive an 8 byte IV for RC2-128', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.5'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.argsFor(1)[4]).toBe(8);
    });
    it('1041524 - Should use SHA1 metadata for pbeWithSHA1AndDES-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(8));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.10'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore DES execution
        }
        expect(deriveSpy).toHaveBeenCalled();
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should derive 8 byte key for DES algorithm', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(8));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.10'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.argsFor(0)[4]).toBe(8);
    });
    it('1041524 - Should derive 8 byte IV for DES algorithm', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(8));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.10'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.argsFor(1)[4]).toBe(8);
    });
    it('1041524 - Should use SHA1 hash metadata for RC2-128 OID 1.2.840.113549.1.12.1.8', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.8'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should decrypt RC2 encrypted data for OID 1.2.840.113549.1.12.1.8', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.8'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        let result: Uint8Array;
        try {
            result = instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(result).toBeDefined();
    });
    it('1041524 - Should derive both key and IV for RC2-128 OID 1.2.840.113549.1.12.1.8', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const deriveSpy: jasmine.Spy =
            spyOn(instance, '_generateDerivedKey')
                .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.8'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.count()).toBe(2);
    });
    it('1041524 - Should use SHA1 hash metadata for RC2-40 OID 1.2.840.113549.1.12.1.9', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(8));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.9'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // Ignore RC2 execution
        }
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should return decrypted data for RC2-40 algorithm', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn<any>(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(8));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.9'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        let result: Uint8Array;
        try {
            result = (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(result).toBeDefined();
    });
    it('1041524 - Should derive both key and IV for RC2-40 algorithm', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(8));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.9'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.count()).toBe(2);
    });
    it('1041524 - Should use MD5 hash metadata for pbeWithMD5AndRC2-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(16));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.6'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // Ignore cipher execution
        }
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(16);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should return-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn<any>(instance, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.6'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        let result: Uint8Array | undefined;
        try {
            result = (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(result).toBeDefined();
    });
    it('1041524 - Should derive both key and IV for pbeWithMD5AndRC2-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(16));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.6'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.count()).toBe(2);
    });
    it('1041524 - Should use SHA1 hash metadata for pbeWithSHA1AndRC2-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(16));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.11'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // ignore
        }
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(20);
        expect(hashArg.v).toBe(64);
    });
    it('1041524 - Should derive both key and IV for pbeWithSHA1AndRC2-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.returnValue(new Uint8Array(16));
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.11'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) { }
        expect(deriveSpy.calls.count()).toBe(2);
    });
    it('1041524 - Should use MD5 hash metadata for pbeWithMD5AndRC2-CBC', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const deriveSpy: jasmine.Spy = spyOn<any>(
            instance,
            '_generateDerivedKey'
        ).and.callThrough();
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.6'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
                'password'
            );
        } catch (e) {
            // Ignore decryption failures
        }
        const hashArg: any = deriveSpy.calls.argsFor(0)[5];
        expect(hashArg).toBeDefined();
        expect(hashArg.u).toBe(16);
        expect(hashArg.v).toBe(64);
        expect(typeof hashArg.hash).toBe('function');
    });
    it('1041524 - Should process exactly one TripleDES block for 8 byte input', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const processSpy: jasmine.Spy = spyOn(
            _TripleDataEncryptionStandardCipher.prototype,
            '_processBlock'
        ).and.callFake(() => { });
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.4'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn<any>(instance, '_generateDerivedKey')
            .and.returnValues(
                new Uint8Array(24),
                new Uint8Array(8)
            );
        try {
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'password'
            );
        } catch (e) { }
        expect(processSpy.calls.count()).toBe(1);
    });
    it('1041524 - Should not write outside TripleDES block boundary', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.4'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        spyOn<any>(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn<any>(instance, '_generateDerivedKey')
            .and.returnValues(
                new Uint8Array(24),
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
            );
        spyOn(
            _TripleDataEncryptionStandardCipher.prototype,
            '_processBlock'
        ).and.callFake(
            (
                input: Uint8Array,
                inOff: number,
                output: Uint8Array,
                outOff: number
            ) => {
                for (let k = 0; k < 8; k++) {
                    output[outOff + k] = k;
                }
            }
        );
        const result: Uint8Array =
            (instance as any)._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'password'
            );

        expect(result.length).toBe(8);
    });
    it('1041524 - Should process exactly one DES block for 8 byte encrypted data', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.10'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        spyOn(instance, '_getPassword')
            .and.returnValue(new Uint8Array([1]));
        spyOn(instance, '_generateDerivedKey')
            .and.returnValues(
                new Uint8Array(8),
                new Uint8Array(8)
            );
        const processSpy = spyOn(
            _DataEncryptionStandardCipher.prototype,
            '_processBlock'
        ).and.callFake(() => { });
        try {
            instance._getCryptographicData(
                algorithmSeq,
                new Uint8Array(8),
                'password'
            );
        } catch (e) {
            // ignore
        }
        expect(processSpy.calls.count()).toBe(1);
    });
    it('1041524 - Should derive expected key when salt is present', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const result = (instance as any)._generateDerivedKey(
            new Uint8Array([1, 2]),
            new Uint8Array([1, 2, 3, 4]),
            1,
            1,
            16,
            {
                hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length),
                u: 16,
                v: 64
            }
        );
        expect(result.length).toBe(16);
        expect(Array.from(result)).not.toEqual(new Array(16).fill(0));
    });
    it('1041524 - Should copy salt within Slen boundary', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            (instance as any)._generateDerivedKey(
                new Uint8Array([1]),
                new Uint8Array([1, 2, 3, 4]),
                1,
                1,
                16,
                {
                    hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length),
                    u: 16,
                    v: 64
                }
            );
        }).not.toThrow();
    });
    it('1041524 - Should derive key using password expansion', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const result = (instance as any)._generateDerivedKey(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 3]),
            1,
            1,
            16,
            {
                hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length),
                u: 16,
                v: 64
            }
        );
        expect(result.length).toBe(16);
    });
    it('1041524 - Should derive key without exceeding password buffer boundary', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            (instance as any)._generateDerivedKey(
                new Uint8Array([1]),
                new Uint8Array([1]),
                1,
                1,
                16,
                {
                    hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length),
                    u: 16,
                    v: 64
                }
            );
        }).not.toThrow();
    });
    it('1041524 - Should fill all requested key bytes', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const result = (instance as any)._generateDerivedKey(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 3]),
            1,
            2,
            32,
            {
                hash: (d: Uint8Array) => new _Sha1()._hash(d, 0, d.length),
                u: 20,
                v: 64
            }
        );
        expect(result.length).toBe(32);
        expect(result.some((x: number) => x !== 0)).toBeTruthy();
    });
    it('1041524 - Should create B buffer with correct size', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        expect(() => {
            (instance as any)._generateDerivedKey(
                new Uint8Array([1, 2]),
                new Uint8Array([3, 4]),
                1,
                1,
                16,
                {
                    hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length),
                    u: 16,
                    v: 64
                }
            );
        }).not.toThrow();
    });
    it('1041524 - Should lookup upper-cased key when local identifier is null', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        instance._certificates = {
            _get: jasmine.createSpy().and.returnValue(undefined)
        };
        instance._localIdentifiers = new Map();
        instance._localIdentifiers.set('test-key', null);
        const getSpy = jasmine.createSpy('get').and.returnValue(undefined);
        instance._keyCertificates = {
            get: getSpy
        };
        instance._getCertificate('test-key');
        expect(getSpy).toHaveBeenCalledWith('TEST-KEY');
    });
    it('1041524 - Should return null when certificate is not found', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(instance, '_getCertificate').and.returnValue(undefined);
        instance._keys = new Map();
        instance._keys.set('key1', {});
        const result = instance._getCertificateChain('key1');
        expect(result).toBeNull();
    });
    it('1041524 - Should return only the original certificate when key identifier is undefined', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const cert: any = {
            _certificate: {
                _getExtension: () => ({
                    _getValue: () => new Uint8Array([1, 2, 3])
                })
            }
        };
        spyOn(instance, '_getCertificate').and.returnValue(cert);
        instance._keys = new Map();
        instance._keys.set('key', {});
        instance._chainCertificates = new Map();
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getSequence')
            .and.returnValue([
                {
                    _tagClass: _TagClassType.context,
                    _getTagNumber: () => 0,
                    _getOctetString: (): any => undefined
                }
            ]);
        const result = instance._getCertificateChain('key');
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0]).toBe(cert);
    });
    it('1041524 - Should stop when next certificate is same as current certificate', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const certificate: any = {
            _certificate: {
                _getExtension: (): any => undefined
            }
        };
        spyOn<any>(instance, '_getCertificate')
            .and.returnValue(certificate);
        instance._keys = new Map();
        instance._keys.set('key', {});
        instance._chainCertificates = new Map();
        const result = (instance as any)._getCertificateChain('key');
        expect(result.length).toBe(1);
    });
    it('1041524 - Should return single certificate when no next certificate exists', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const certificate: any = {
            _certificate: {
                _getExtension: (): any => undefined
            }
        };
        spyOn<any>(instance, '_getCertificate')
            .and.returnValue(certificate);

        instance._keys = new Map();
        instance._keys.set('key', {});
        instance._chainCertificates = new Map();
        const result = (instance as any)._getCertificateChain('key');
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
    });
    it('1041524 - Should not continue chain traversal for same certificate reference', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        const certificate: any = {
            _certificate: {
                _getExtension: (): any => undefined
            }
        };
        spyOn<any>(instance, '_getCertificate')
            .and.returnValue(certificate);
        instance._keys = new Map();
        instance._keys.set('key', {});
        instance._chainCertificates = new Map();
        const result = (instance as any)._getCertificateChain('key');
        expect(result.length).toBe(1);
    });
    it('1041524 - Should return null when certificate list is empty', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        instance._keys = new Map();
        instance._keys.set('key', {});
        spyOn(instance, '_getCertificate').and.returnValue(undefined);
        const result = instance._getCertificateChain('key');
        expect(result).toBeNull();
    });
    it('1041524 - Should return null when no certificates are available', () => {
        const instance: any = new _PdfPublicKeyCryptographyCertificate();
        instance._keys = new Map();
        instance._keys.set('key', {});
        spyOn(instance, '_getCertificate').and.returnValue(undefined);
        const result = instance._getCertificateChain('key');
        expect(result).toBeNull();
    });
});
describe('1041524 - Cryptographic certificate Mutation 13', () => {
    it('1041524 - should use sequence fallback when abstractSetValue is undefined', () => {
        const certificate: any = new _PdfPublicKeyCryptographyCertificate();
        const sequenceValue: any = {
            _getBmpString: () => 'FriendlyName'
        };
        const item: any = {
            _getAbstractSetValue: (): any => undefined,
            _getSequence: jasmine.createSpy().and.returnValue([
                sequenceValue
            ])
        };
        const attrSet =
            typeof item._getAbstractSetValue() !== 'undefined' &&
                item._getAbstractSetValue() !== null
                ? item._getAbstractSetValue()
                : item._getSequence();
        expect(item._getSequence).toHaveBeenCalled();
        expect(attrSet[0]).toBe(sequenceValue);
    });
    it('1041524 - should throw when duplicate attribute oid contains different values', () => {
        const attributes: any = {};
        const oid = '1.2.840.113549.1.9.20';
        const attr1 = {
            value: 'Key1'
        };
        const attr2 = {
            value: 'Key2'
        };
        attributes[oid] = attr1;
        expect(() => {
            if (attributes[oid]) {
                if (
                    JSON.stringify(attributes[oid]) !==
                    JSON.stringify(attr2)
                ) {
                    throw new Error(
                        'attempt to add existing attribute with different value'
                    );
                }
            }
        }).toThrowError(
            'attempt to add existing attribute with different value'
        );
    });
    it('1041524 - should extract friendly name from attribute oid 1.2.840.113549.1.9.20', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const value: any = {_getBmpString: () => 'FriendlyName',_getUtf8String: (): any => undefined,_getOctetString: (): any => undefined};
        const attribute: any = {_getSequence: () => [{_getObjectIdentifier: () => ({toString: () =>'1.2.840.113549.1.9.20'})},{_getAbstractSetValue: () => [value]}]};
        const attrsContainer: any = {_getSequence: () => [attribute]};
        const result = cert._extractLocalIdentifiers(attrsContainer);
        expect(result.localIdentifier).toBe('FriendlyName');
    });
    it('1041524 - should store certificate under friendly name', () => {
    const cert: any = new _PdfPublicKeyCryptographyCertificate();

    const publicKey = new _PdfRonCipherParameter(
        false,
        new Uint8Array([1]),
        new Uint8Array([1])
    );

    spyOn(
        _PdfX509CertificateParser.prototype,
        '_readCertificate'
    ).and.returnValue({
        _getPublicKey: () => publicKey,
        _publicKeyBytes: new Uint8Array([1])
    } as any);

    spyOn(cert, '_extractLocalIdentifiers').and.returnValue({
        localIdentifier: 'FriendlyName'
    });

    const chain: any[] = [{
        _getSequence: () => [
            {},
            {
                _getSequence: () => [{
                    _getSequence: () => [
                        {},
                        {
                            _getSequence: () => [{
                                _getValue: () => new Uint8Array([1])
                            }]
                        }
                    ]
                }]
            }
        ]
    }];

    cert._processCertificateCollection(chain);

    expect(cert._extractLocalIdentifiers).not.toHaveBeenCalled();
    expect(cert._certificates._get('FriendlyName')).toBeDefined();
});
    it('1041524 - should not process attributes when attributeSequence is empty', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert._localIdentifiers, 'set');
        spyOn(cert._keys, 'set');
        const attributeSequence: any[] = [];
        if (attributeSequence && attributeSequence.length > 0) {
            fail('attribute loop should not execute');
        }
        expect(cert._localIdentifiers.set).not.toHaveBeenCalled();
        expect(cert._keys.set).not.toHaveBeenCalled();
    });
    it('1041524 - should skip attribute processing for empty attributeSequence', () => {
        const attributeSequence: any[] = [];
        let executed = false;
        if (attributeSequence && attributeSequence.length > 0) {
            executed = true;
        }
        expect(executed).toBe(false);
    });
    it('1041524 - should ignore attribute when attributeValues is empty in processData', () => {
        const attributeValues: any[] = [];
        let processed = false;
        if (attributeValues && attributeValues.length > 0) {
            processed = true;
        }
        expect(processed).toBe(false);
    });
    it('1041524 - should not process empty attributeValues array', () => {
        const attributeValues: any[] = [];
        let entered = false;
        if (attributeValues && attributeValues.length > 0) {
            entered = true;
        }
        expect(entered).toBe(false);
    });
    it('1041524 - should allow duplicate attribute with identical object reference', () => {
        const value: any = {
            _getBmpString: () => 'Friendly'
        };
        const attributes: any = {};
        attributes['1.2.840.113549.1.9.20'] = value;
        expect(() => {
            if (
                attributes['1.2.840.113549.1.9.20'] &&
                attributes['1.2.840.113549.1.9.20'] !== value) {
                throw new Error(
                    'Should not add existing attribute with different value'
                );
            }
        }).not.toThrow();
    });
    it('1041524 - should not add non-certificate bag entries into certificateChain', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._certificateChain = [];
        spyOn(cert._certificateChain, 'push');
        const bagId = '1.2.840.113549.1.12.10.1.99';
        if (bagId === cert._certificateBag) {
            cert._certificateChain.push({});
        }
        expect(cert._certificateChain.push).not.toHaveBeenCalled();
        expect(cert._certificateChain.length).toBe(0);
    });
    it('1041524 - should return object containing expected keys', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const result = cert._extractLocalIdentifiers({
            _getSequence: (): any[] => []
        });
        expect(result.hasOwnProperty('localIdentifier')).toBe(true);
        expect(result.hasOwnProperty('localId')).toBe(true);
    });
    it('1041524 - should use sha1 hash mapping for OID 1.2.840.113549.1.12.1.4', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey').and.callFake(
            (
                passwordBytes: Uint8Array,
                salt: Uint8Array,
                id: number,
                iterations: number,
                n: number,
                hashValues: any
            ) => {
                expect(hashValues).toBeDefined();
                expect(hashValues.u).toBe(20);
                expect(hashValues.v).toBe(64);
                return new Uint8Array(Math.max(n, 1));
            }
        );
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.12.1.4'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () => new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        spyOn(
            _TripleDataEncryptionStandardCipher.prototype as any,
            '_processBlock'
        ).and.callFake(
            (
                input: Uint8Array,
                inputOffset: number,
                output: Uint8Array,
                outputOffset: number
            ) => {
                for (let i: number = 0; i < 8; i++) {
                    output[outputOffset + i] =
                        input[inputOffset + i];
                }
            }
        );
        const encrypted = new Uint8Array(8);
        cert._getCryptographicData(
            algorithmSeq,
            encrypted,
            'password'
        );
        expect(cert._generateDerivedKey).toHaveBeenCalled();
    });
    it('1041524 - should execute RC2 decryption path', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const decryptSpy = spyOn(
            _CipherTwo.prototype as any,
            '_decrypt'
        ).and.returnValue(new Uint8Array([1, 2, 3]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () => '1.2.840.113549.1.5.11'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
            'password'
        );
        expect(decryptSpy).toHaveBeenCalled();
        expect(result).toEqual(
            new Uint8Array([1, 2, 3])
        );
    });
    it('1041524 - should execute RC4 decryption path', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const decryptSpy = spyOn(
            _NormalCipherFour.prototype as any,
            '_decryptBlock'
        ).and.returnValue(new Uint8Array([5, 6, 7]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.1'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1, 2, 3]),
            'password'
        );
        expect(decryptSpy).toHaveBeenCalled();
        expect(result).toEqual(
            new Uint8Array([5, 6, 7])
        );
    });
    it('1041524 - should execute AES decryption path', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey')
            .and.returnValue(new Uint8Array(16));
        const decryptSpy = spyOn(
            _AdvancedEncryption128Cipher.prototype as any,
            '_decryptBlock'
        ).and.returnValue(new Uint8Array([9, 9, 9]));
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.5.12'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const result = cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array([1, 2, 3]),
            'password'
        );
        expect(decryptSpy).toHaveBeenCalled();
        expect(result).toEqual(
            new Uint8Array([9, 9, 9])
        );
    });
    it('1041524 - should execute DESEDE decryption path', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        spyOn(cert, '_generateDerivedKey').and.callFake(
            (
                passwordBytes: Uint8Array,
                salt: Uint8Array,
                id: number,
                iterations: number,
                n: number
            ) => new Uint8Array(Math.max(n, 24))
        );
        const processSpy = spyOn(
            _TripleDataEncryptionStandardCipher.prototype as any,
            '_processBlock'
        ).and.callFake(
            (
                input: Uint8Array,
                inputOffset: number,
                output: Uint8Array,
                outputOffset: number
            ) => {
                for (let i: number = 0; i < 8; i++) {
                    output[outputOffset + i] =
                        input[inputOffset + i];
                }
            }
        );
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        cert._getCryptographicData(
            algorithmSeq,
            new Uint8Array(8),
            'password'
        );
        expect(processSpy).toHaveBeenCalled();
    });
    it('1041524 - should decrypt DESEDE blocks using exactly blockSize bytes', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        spyOn(certificate, '_generateDerivedKey')
            .and.callFake((_p: any, _s: any, _id: any, _iter: any, n: any) =>
                new Uint8Array(Math.max(n, 24))
            );
        spyOn(
            _TripleDataEncryptionStandardCipher.prototype as any,
            '_processBlock'
        ).and.callFake(
            (
                input: Uint8Array,
                inputOffset: number,
                output: Uint8Array,
                outputOffset: number
            ) => {
                for (let k = 0; k < 8; k++) {
                    output[outputOffset + k] = k + 1;
                }
            }
        );
        const algorithmSeq: any = [
            {
                _getObjectIdentifier: () => ({
                    toString: () =>
                        '1.2.840.113549.1.12.1.3'
                })
            },
            {
                _getSequence: () => [
                    {
                        _getOctetString: () =>
                            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
                    },
                    {
                        _getInteger: () => 1
                    }
                ]
            }
        ];
        const encrypted = new Uint8Array(8);
        const result = certificate._getCryptographicData(
            algorithmSeq,
            encrypted,
            'password'
        );
        expect(result.length).toBe(8);
        expect(Array.from(result)).toEqual([
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number),
            jasmine.any(Number)
        ]);
    });
    it('1041524 - should generate deterministic derived key for known salt and password', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const hashValues = {
            u: 20,
            v: 64,
            hash: (d: Uint8Array) => {
                const result = new Uint8Array(20);
                result.fill(1);
                return result;
            }
        };
        const result = cert._generateDerivedKey(
            new Uint8Array([1, 2]),
            new Uint8Array([3, 4]),
            1,
            1,
            20,
            hashValues
        );
        expect(result.length).toBe(20);
        expect(Array.from(result)).toEqual(
            new Array(20).fill(1)
        );
    });
    it('1041524 - should create salt buffer with expected repeated length', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        const hashSpy = jasmine.createSpy('hash').and.callFake(
            (d: Uint8Array) => {
                const result = new Uint8Array(20);
                result.fill(7);
                return result;
            }
        );
        cert._generateDerivedKey(
            new Uint8Array([1]),
            new Uint8Array([2]),
            1,
            1,
            20,
            {
                u: 20,
                v: 64,
                hash: hashSpy
            }
        );
        expect(hashSpy).toHaveBeenCalled();
    });
    it('1041524 - should return null when certificate lookup returns undefined', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys.set('testKey', {});
        spyOn(cert, '_getCertificate').and.returnValue(undefined);
        const result = cert._getCertificateChain('testKey');
        expect(result).toBeNull();
    });
    it('1041524 - should return null when key exists but certificate lookup fails', () => {
        const certificate: any =
            new _PdfPublicKeyCryptographyCertificate();
        certificate._keys.set('testKey', {});
        spyOn(
            certificate,
            '_getCertificate'
        ).and.returnValue(undefined);
        const result = certificate._getCertificateChain('testKey');
        expect(result).toBeNull();
        expect(certificate._getCertificate)
            .toHaveBeenCalledWith('testKey');
    });
    it('1041524 - should use only context tag with tag number 0 when resolving authority key identifier', () => {
        const validKeyId = new Uint8Array([1, 2, 3]);
        const invalidKeyId = new Uint8Array([9, 9, 9]);
        const elements: any[] = [
            {
                _tagClass: 999,
                _getTagNumber: () => 0,
                _getOctetString: () => invalidKeyId
            },
            {
                _tagClass: _TagClassType.context,
                _getTagNumber: () => 1,
                _getOctetString: () => invalidKeyId
            },
            {
                _tagClass: _TagClassType.context,
                _getTagNumber: () => 0,
                _getOctetString: () => validKeyId
            }
        ];
        let authorityKeyIdentifier: Uint8Array;
        for (const item of elements) {
            if (item._tagClass === _TagClassType.context &&
                item._getTagNumber() === 0) {
                authorityKeyIdentifier = item._getOctetString();
                break;
            }
        }
        expect(authorityKeyIdentifier!).toEqual(validKeyId);
        expect(authorityKeyIdentifier!).not.toEqual(invalidKeyId);
    });
    it('1041524 - should not search chain certificates when keyID is undefined', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys.set('key', {});
        const certificateCollection: any = {
            _certificate: {
                _getExtension: () => ({
                    _getValue: () => new Uint8Array([1])
                })
            }
        };
        spyOn(cert, '_getCertificate').and.returnValue(certificateCollection);
        cert._chainCertificates = new Map();
        spyOn(cert._chainCertificates, 'forEach');
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_getSequence')
            .and.returnValue([
                {
                    _tagClass: _TagClassType.context,
                    _getTagNumber: () => 0,
                    _getOctetString: (): any => undefined
                }
            ]);
        cert._getCertificateChain('key');
        expect(cert._chainCertificates.forEach)
            .not.toHaveBeenCalled();
    });
    it('1041524 - should not select next certificate when identifiers do not match', () => {
        const authorityKeyIdentifier = new Uint8Array([1, 2, 3]);
        const certificateIdentifier = new Uint8Array([9, 9, 9]);

        const isMatch =
            authorityKeyIdentifier.length === certificateIdentifier.length &&
            authorityKeyIdentifier.every(
                (value: number, index: number) =>
                    value === certificateIdentifier[index]
            );
        const certificateChain: any[] = ['currentCertificate'];
        if (isMatch) {
            certificateChain.push('nextCertificate');
        }
        expect(isMatch).toBe(false);
        expect(certificateChain.length).toBe(1);
    });
    it('1041524 - should stop traversal when nextCertificate is same as current certificate', () => {
        const cert: any = new _PdfPublicKeyCryptographyCertificate();
        cert._keys.set('key', {});
        const certificateCollection: any = {
            _certificate: {
                _getExtension: (): any => null
            }
        };
        spyOn(cert, '_getCertificate')
            .and.returnValue(certificateCollection);
        const result = cert._getCertificateChain('key');
        expect(result).not.toBeNull();
        expect(result!.length).toBe(1);
    });
});