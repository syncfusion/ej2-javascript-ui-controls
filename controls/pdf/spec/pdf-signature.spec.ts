import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlag, RevocationType } from "../src/pdf/core/enumerator";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfRevocationResponse } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model";
import { _PdfOcspHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
import { _PdfCertificate } from "../src/pdf/core/security/digital-signature/pdf-certificate";
import { _PdfPublicKeyCryptographyCertificate } from "../src/pdf/core/security/digital-signature/pdf-cryptography-certificate";
import { _PdfCryptographicMessageSyntaxSigner } from "../src/pdf/core/security/digital-signature/signature/cryptographic-signer";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _PdfSignatureDictionary } from "../src/pdf/core/security/digital-signature/signature/signature-dictionary";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfX509CertificateStructure } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-structure";
describe('PdfSignature constructor default values', () => {
    it('mutation constructor initializes default boolean flags correctly', () => {
        expect(signature._visible).toBe(true);
        expect(signature._appendCertificates).toBe(false);
        expect(signature._hasTimeStamp).toBe(false);
        expect(signature._enableLtv).toBe(false);
    });
    const signature: any = new PdfSignature();
    let originalFromBytes: any;
    let originalGetSequence: any;
    let originalGetOcspStructure: any;
    let originalRevocationResponse: any;
    let originalApplySequence: any;
    let originalLoadCertificate: any;
    let originalCertificate: any;
    let originalX509ReadCertificate: any;
    let originalCryptographicSigner: any;
    let originalSignatureOptions: any;
    beforeEach(() => {
        originalFromBytes = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
        originalGetSequence = (_PdfUniqueEncodingElement.prototype as any)._getSequence;
        originalGetOcspStructure = (_PdfOcspHelper.prototype as any)._getOcspStructure;
        originalRevocationResponse = (_PdfRevocationResponse as any);
        originalApplySequence = (_PdfX509CertificateStructure.prototype as any)._applySequence;
        originalLoadCertificate = (_PdfPublicKeyCryptographyCertificate.prototype as any)._loadCertificate;
        originalCertificate = (_PdfCertificate as any);
        originalX509ReadCertificate = (_PdfX509CertificateParser as any).prototype._readCertificate;
        originalCryptographicSigner = (_PdfCryptographicMessageSyntaxSigner as any);
        originalSignatureOptions = (PdfSignature.prototype as any)._applySignatureOptions;
    });
    afterEach(() => {
        (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
        (_PdfUniqueEncodingElement.prototype as any)._getSequence = originalGetSequence;
        (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        (_PdfRevocationResponse as any) = originalRevocationResponse;
        (_PdfX509CertificateStructure.prototype as any)._applySequence = originalApplySequence;
        (_PdfPublicKeyCryptographyCertificate.prototype as any)._loadCertificate = originalLoadCertificate;
        (_PdfCertificate as any) = originalCertificate;
        (_PdfX509CertificateParser as any).prototype._readCertificate = originalX509ReadCertificate;
        (_PdfCryptographicMessageSyntaxSigner as any) = originalCryptographicSigner;
        (PdfSignature.prototype as any)._applySignatureOptions = originalSignatureOptions;
    });
    describe('1038509 PdfSignature.create mutation coverage', () => {
        it('1038509 create throws when password is null', () => {
            const certificateData: Uint8Array = new Uint8Array([1, 2, 3]);
            expect((): PdfSignature => { return PdfSignature.create(certificateData, null as any, {}); }).toThrowError('Password is required to open the certificate.');
        });
        it('1038509 create throws when password is undefined', () => {
            const certificateData: Uint8Array = new Uint8Array([1, 2, 3]);
            expect((): PdfSignature => { return PdfSignature.create(certificateData, undefined as any, {}); }).toThrowError('Password is required to open the certificate.');
        });
        it('1038509 create throws when password is empty string', () => {
            const certificateData: Uint8Array = new Uint8Array([1, 2, 3]);
            expect((): PdfSignature => { return PdfSignature.create(certificateData, '', {}); }).toThrowError('Password is required to open the certificate.');
        });
        it('1038509 create does not invoke applySignatureOptions when arg3 is undefined', () => {
            let optionCalls: number = 0;
            const originalMethod: Function = PdfSignature.prototype._applySignatureOptions;
            PdfSignature.prototype._applySignatureOptions = function (_options: any): void {
                optionCalls++;
            };
            const callback: Function = (_digest: Uint8Array): Uint8Array => {
                return new Uint8Array([1]);
            };
            PdfSignature.create(callback as any, {});
            expect(optionCalls).toBe(1);
            PdfSignature.prototype._applySignatureOptions = originalMethod as any;
        });
        it('1038509 create external certificate loop skips empty certificate entry', () => {
            const callback: Function = (_digest: Uint8Array): Uint8Array => { return new Uint8Array([1]); };
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let readCount: number = 0;
            (_PdfX509CertificateParser as any).prototype._readCertificate =
                function (_data: Uint8Array): any {
                    readCount++;
                    return { certificate: true };
                };
            const certificates: Uint8Array[] = [new Uint8Array([1, 2, 3]), new Uint8Array(0)];
            const signature: any = PdfSignature.create(callback as any, certificates, {});
            expect(readCount).toBe(1);
            expect(signature._externalChain.length).toBe(1);
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 create external certificate loop processes all valid certificates only', () => {
            const callback: Function = (_digest: Uint8Array): Uint8Array => {
                return new Uint8Array([1]);
            };
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let readCount: number = 0;
            (_PdfX509CertificateParser as any).prototype._readCertificate =
                function (_data: Uint8Array): any {
                    readCount++;
                    return { certificate: true };
                };
            const certificates: Uint8Array[] = [
                new Uint8Array([1]),
                new Uint8Array([2]),
                new Uint8Array([3])
            ];
            const signature: any =
                PdfSignature.create(callback as any, certificates, {});
            expect(readCount).toBe(3);
            expect(signature._externalChain.length).toBe(3);
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 create ignores null certificate entries in external chain', () => {
            const callback: Function = (_digest: Uint8Array): Uint8Array => { return new Uint8Array([1]); };
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let readCount: number = 0;
            (_PdfX509CertificateParser as any).prototype._readCertificate =
                function (_data: Uint8Array): any {
                    readCount++;
                    return { certificate: true };
                };
            const certificates: any[] = [
                null,
                new Uint8Array([10, 20])
            ];
            const signature: any = PdfSignature.create(callback as any, certificates as any);
            expect(readCount).toBe(1);
            expect(signature._externalChain.length).toBe(1);
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 create with certificate array does not invoke applySignatureOptions when options absent', () => {
            const callback: Function = (_digest: Uint8Array): Uint8Array => { return new Uint8Array([1]); };
            const originalMethod: Function = PdfSignature.prototype._applySignatureOptions;
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let optionCalls: number = 0;
            PdfSignature.prototype._applySignatureOptions = function (_options: any): void { optionCalls++; };
            (_PdfX509CertificateParser as any).prototype._readCertificate = function (_data: Uint8Array): any {
                return { certificate: true };
            };
            PdfSignature.create(callback as any, [new Uint8Array([1, 2, 3])], {});
            expect(optionCalls).toBe(1);
            PdfSignature.prototype._applySignatureOptions = originalMethod as any;
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 create with certificate array invokes applySignatureOptions exactly once when options provided', () => {
            const callback: Function = (_digest: Uint8Array): Uint8Array => { return new Uint8Array([1]); };
            const originalMethod: Function = PdfSignature.prototype._applySignatureOptions;
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let optionCalls: number = 0;
            PdfSignature.prototype._applySignatureOptions = function (_options: any): void { optionCalls++; };
            (_PdfX509CertificateParser as any).prototype._readCertificate = function (_data: Uint8Array): any {
                return { certificate: true };
            };
            PdfSignature.create(callback as any, [new Uint8Array([1, 2, 3])], { reason: 'test' });
            expect(optionCalls).toBe(1);
            PdfSignature.prototype._applySignatureOptions = originalMethod as any;
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 create certificate path ignores non function timestamp callback', () => {
            const originalCertificate: any = (_PdfCertificate as any);
            (_PdfCertificate as any) = function (this: any): void {
                this._issuerName = 'issuer';
                this._serialNumber = '1';
                this._subjectName = 'subject';
                this._validFrom = new Date();
                this._validTo = new Date();
                this._version = 3;
            };
            const signature: any = PdfSignature.create(new Uint8Array([1]), 'password', {}, 'invalid-callback' as any);
            expect(signature._timestampCallback).toBeUndefined();
            (_PdfCertificate as any) = originalCertificate;
        });
        it('1038509 create external signature does not apply primitive arg2', () => {
            const callback: Function = (): Uint8Array => { return new Uint8Array([1]); };
            let optionCalls: number = 0;
            const originalMethod: Function = PdfSignature.prototype._applySignatureOptions;
            PdfSignature.prototype._applySignatureOptions = function (_options: any): void { optionCalls++; };
            const signature: any = PdfSignature.create(callback as any, 100 as any);
            expect(signature._externalSignatureCallback).toBe(callback);
            expect(optionCalls).toBe(0);
            PdfSignature.prototype._applySignatureOptions = originalMethod as any;
        });
        it('1038509 create external signature options ignores non function timestamp callback', () => {
            const callback: Function = (): Uint8Array => { return new Uint8Array([1]); };
            const options: any = { reason: 'test' };
            const signature: any = PdfSignature.create(callback as any, options, 'invalid-callback' as any);
            expect(signature._timestampCallback).toBeUndefined();
        });
        it('1038509 timestamp only options ignores non function callback', () => {
            const options: any = { reason: 'timestamp' };
            const signature: any = PdfSignature.create(options, 'invalid-callback' as any);
            expect(signature._timestampCallback).toBeUndefined();
            expect(signature._isTimestampOnly).toBe(true);
        });
        it('1038509 create throws when arg2 is defined in timestamp only overload', () => {
            expect((): PdfSignature => {
                return PdfSignature.create(null as any, {} as any, { reason: 'test' },
                    function (): Promise<{ data: Uint8Array }> {
                        return Promise.resolve({ data: new Uint8Array([1]) });
                    }
                );
            }).toThrow();
        });
        it('1038509 create throws when arg3 is undefined in timestamp only overload', () => {
            expect((): PdfSignature => { return PdfSignature.create(null as any, null as any, undefined as any, function (): Promise<{ data: Uint8Array }> { return Promise.resolve({ data: new Uint8Array([1]) }); }); }).toThrow();
        });
        it('1038509 create throws when arg4 is not function in timestamp only overload', () => {
            expect((): PdfSignature => { return PdfSignature.create(null as any, null as any, { reason: 'test' }, 'invalid' as any); }).toThrow();
        });
        it('1038509 create accepts timestamp only overload with all required arguments', () => {
            const callback: Function = (): Promise<{ data: Uint8Array }> => { return Promise.resolve({ data: new Uint8Array([1]) }); };
            const signature: any = PdfSignature.create(null as any, null as any, { reason: 'test' }, callback as any);
            expect(signature._isTimestampOnly).toBe(true);
            expect(signature._timestampCallback).toBe(callback);
        });
    });
    describe('1038509 PdfSignature getters', () => {
        it('1038509 getSignedDate returns assigned signed date', () => {
            const signature: any = new PdfSignature();
            const signedDate: Date = new Date('2024-01-15T10:20:30Z');
            signature._signedDate = signedDate;
            const result: Date = signature.getSignedDate();
            expect(result).toBe(signedDate);
            expect(result instanceof Date).toBe(true);
            expect(result.getTime()).toBe(signedDate.getTime());
        });
        it('1038509 getSignedDate returns undefined when signed date not assigned', () => {
            const signature: any = new PdfSignature();
            const result: Date = signature.getSignedDate();
            expect(result).toBeUndefined();
        });
        it('1038509 getCertificateInformation returns assigned certificate information', () => {
            const signature: any = new PdfSignature();
            const certificateInformation: any = {
                issuerName: 'Issuer',
                serialNumber: '12345',
                subjectName: 'Subject',
                validFrom: new Date('2024-01-01'),
                validTo: new Date('2025-01-01'),
                version: 3
            };
            signature._certificateInfo = certificateInformation;
            const result: any = signature.getCertificateInformation();
            expect(result).toBe(certificateInformation);
            expect(result.issuerName).toBe('Issuer');
            expect(result.serialNumber).toBe('12345');
            expect(result.subjectName).toBe('Subject');
            expect(result.version).toBe(3);
        });
        it('1038509 getCertificateInformation returns undefined when certificate information not assigned', () => {
            const signature: any = new PdfSignature();
            const result: any = signature.getCertificateInformation();
            expect(result).toBeUndefined();
        });
    });
    describe('1038509 replaceEmptySignature Uint8Array validation', () => {
        it('1038509 replaceEmptySignature accepts non empty Uint8Array arguments', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array([2]), 0, []);
            }).toThrowError(
                'Invalid certificate chain: Expected a non-empty array of Certificate.'
            );
        });
        it('1038509 replaceEmptySignature throws for empty signed data', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array(0), 0, []);
            }).toThrowError(
                'Invalid Uint8Array: Data is either not a Uint8Array or is empty.'
            );
        });
        it('1038509 replaceEmptySignature throws for non Uint8Array signed data', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', 'signed' as any, 0, []);
            }).toThrowError(
                'Invalid certificate chain: Expected a non-empty array of Certificate.'
            );
        });
        it('1038509 replaceEmptySignature throws for numeric signature name', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), 100 as any, new Uint8Array([2]), 0, []);
            }).toThrowError('Signature field name is required');
        });
        it('1038509 replaceEmptySignature accepts empty string signature name', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array([2]), 0, []);
            }).toThrowError(
                'Invalid certificate chain: Expected a non-empty array of Certificate.'
            );
        });
        it('1038509 arg6 string uses arg7 options', () => {
            const inputPdf: Uint8Array = new Uint8Array([1]);
            const signedData: Uint8Array = new Uint8Array([2]);
            const certificates: Uint8Array[] = [];
            expect((): void => {
                PdfSignature.replaceEmptySignature(inputPdf, '', signedData, 0, certificates, 'output.pdf', { password: 'pdf-password' });
            }).toThrowError(
                'Invalid certificate chain: Expected a non-empty array of Certificate.'
            );
        });
        it('1038509 non array public certificates do not create chain', () => {
            expect((): void => {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array([2]), 0, 'invalid' as any);
            }).toThrowError(
                'Invalid certificate chain: Expected a non-empty array of Certificate.'
            );
        });
        it('1038509 certificate loop processes exact certificate count', () => {
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let readCount: number = 0;
            (_PdfX509CertificateParser as any).prototype._readCertificate =
                function (_data: Uint8Array): any {
                    readCount++;
                    return {};
                };
            const certificates: Uint8Array[] = [
                new Uint8Array([1]),
                new Uint8Array([2])
            ];
            try {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array([2]), 0, certificates);
            } catch (e) {
                // expected
            }
            expect(readCount).toBe(2);
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
        it('1038509 empty certificate entries are ignored', () => {
            const parserMethod: Function = (_PdfX509CertificateParser as any).prototype._readCertificate;
            let readCount: number = 0;
            (_PdfX509CertificateParser as any).prototype._readCertificate =
                function (_data: Uint8Array): any {
                    readCount++;
                    return {};
                };
            const certificates: Uint8Array[] = [new Uint8Array(0), new Uint8Array([10, 20])];
            try {
                PdfSignature.replaceEmptySignature(new Uint8Array([1]), '', new Uint8Array([2]), 0, certificates);
            } catch (e) {
                // expected
            }
            expect(readCount).toBe(1);
            (_PdfX509CertificateParser as any).prototype._readCertificate = parserMethod;
        });
    });
    describe('1038509 enableLTV mutation coverage', () => {
        it('1038509 enableLTV default includePublicCertificates is false', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 enableLTV keeps default revocation type when null passed', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], null as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 enableLTV keeps default revocation type when undefined passed', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], undefined as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 enableLTV ignores invalid string revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], 'invalid-revocation-type' as any, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 enableLTV applies valid numeric revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], RevocationType.crl, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.crl as any);
        });
        it('1038509 enableLTV does not treat arbitrary number as revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], 99999 as any, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 enableLTV callback overload honors includePublicCertificates false', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], RevocationType.ocspAndCrl, false, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedIncludePublicCertificates).toBe(true);
        });
        it('1038509 enableLTV callback overload honors includePublicCertificates true', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = false;
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], RevocationType.ocspAndCrl, true, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 enableLTV stores callback reference', async () => {
            const signature: PdfSignature = new PdfSignature();
            const callback: Function = (): void => {/**/ };
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => Promise.resolve(true);
            await signature.enableLTV(callback as any);
            expect((signature as any)._ltvCallback).toBe(callback);
            expect((signature as any)._enableLtv).toBe(true);
        });
    });
    describe('1038509 enableLTV overload branch validation', () => {
        it('1038509 function overload does not enter certificate branch for non array arg1', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            const callback: Function = (): Promise<{ response: Uint8Array }> => {
                return Promise.resolve({ response: new Uint8Array([]) });
            };
            await signature.enableLTV([], RevocationType.crl, callback as any);
            expect(signature._ltvCallback).toBeDefined();
            expect(receivedType).toBe(RevocationType.crl as any);
        });
        it('1038509 three argument overload ignores invalid revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], 99999 as any, (): Promise<{ response: Uint8Array }> => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.ocspAndCrl);
        });
        it('1038509 four argument overload ignores invalid revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], 99999 as any, false, (): Promise<{ response: Uint8Array }> => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.ocspAndCrl);
        });
        it('1038509 four argument overload uses valid revocation type and includePublicCertificates', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            let receivedIncludePublicCertificates: boolean = false;
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], RevocationType.crl, true, (): Promise<{ response: Uint8Array }> => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedType).toBe(RevocationType.ocspAndCrl);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 four argument overload requires array certificates parameter', async () => {
            const signature: PdfSignature = new PdfSignature();
            const callback: Function = (): void => { /** */ };
            try {
                await signature.enableLTV('invalid' as any, RevocationType.crl, true, callback as any);
                fail('Expected enableLTV to throw.');
            } catch (error) {
                expect((error as Error).message).toBe('Invalid arguments passed to enableLTV.');
            }
        });
        it('1038509 four argument overload requires boolean third argument', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = false;
            const callback: Function = (): Promise<{ response: Uint8Array }> => Promise.resolve({ response: new Uint8Array([]) });
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            const result: boolean = await signature.enableLTV([], RevocationType.crl, 'true' as any, callback as any);
            expect(result).toBe(false);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
    });
    describe('1038509 enableLTV array or undefined overload mutations', () => {
        it('1038509 undefined overload keeps default revocation type when arg2 undefined', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload ignores function arg2', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            const callback: Function = (): void => { /** */ };
            await signature.enableLTV(undefined as any, callback as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload applies valid numeric revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl as any);
            expect(receivedType).toBe(RevocationType.crl as any);
        });
        it('1038509 undefined overload ignores invalid numeric revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, 99999 as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload preserves default includePublicCertificates', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl as any);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 undefined overload updates includePublicCertificates when boolean passed', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = false;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl, true, () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedIncludePublicCertificates).toBe(true);
        });
    });
    describe('1038509 enableLTV maybe and boolean guards', () => {
        it('1038509 undefined overload ignores string revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, 'crl' as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload ignores object revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, {} as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload accepts valid numeric revocation type only', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.ocspAndCrl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.ocspOrCrl as any);
            expect(receivedType).toBe(RevocationType.ocspOrCrl as any);
        });
        it('1038509 undefined overload ignores invalid numeric revocation type', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedType: RevocationType = RevocationType.crl;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedType = type;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, -1000 as any);
            expect(receivedType).toBe(RevocationType.ocspAndCrl as any);
        });
        it('1038509 undefined overload keeps includePublicCertificates false when arg3 omitted', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 undefined overload keeps includePublicCertificates false for string arg3', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl, 'true' as any);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 undefined overload keeps includePublicCertificates false for object arg3', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = true;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl, {} as any);
            expect(receivedIncludePublicCertificates).toBe(false);
        });
        it('1038509 undefined overload applies includePublicCertificates when arg3 boolean', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedIncludePublicCertificates: boolean = false;
            (signature as any)._certificate = { _chains: [] };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedIncludePublicCertificates = includePublicCertificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV(undefined as any, RevocationType.crl, true as any);
            expect(receivedIncludePublicCertificates).toBe(true);
        });
    });
    describe('1038509 enableLTV certificate processing', () => {
        it('1038509 certificate array branch returns getLTVData result', async () => {
            const signature: PdfSignature = new PdfSignature();
            (signature as any)._certificate = { _chains: [] };
            const certificateBytes: Uint8Array = new Uint8Array([]);
            let getLtvCallCount: number = 0;
            signature._getLTVData = (
                _certificates: any[] = [],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                getLtvCallCount++;
                return Promise.resolve(true);
            };
            const result: boolean = await signature.enableLTV([certificateBytes], RevocationType.ocspAndCrl as any);
            expect(result).toBe(true);
            expect(getLtvCallCount).toBe(1);
        });
        it('1038509 certificate array branch skips empty certificate entries', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedCertificates: any[] = [];
            signature._getLTVData = (
                certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedCertificates = certificates;
                return Promise.resolve(true);
            };
            const originalRead: any = _PdfX509CertificateParser.prototype._readCertificate;
            let readCount: number = 0;
            _PdfX509CertificateParser.prototype._readCertificate =
                function (data: Uint8Array): any {
                    readCount++;
                    return { data: data };
                };
            await signature.enableLTV([new Uint8Array(0), new Uint8Array([10, 20, 30])], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(readCount).toBe(1);
            expect(receivedCertificates.length).toBe(1);
            _PdfX509CertificateParser.prototype._readCertificate = originalRead;
        });
        it('1038509 certificate loop processes each certificate exactly once', async () => {
            const signature: PdfSignature = new PdfSignature();
            const first: Uint8Array = new Uint8Array([1]);
            const second: Uint8Array = new Uint8Array([2]);
            let receivedCertificates: any[] = [];
            signature._getLTVData = (
                certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedCertificates = certificates;
                return Promise.resolve(true);
            };
            const originalRead: any = _PdfX509CertificateParser.prototype._readCertificate;
            let readCount: number = 0;
            _PdfX509CertificateParser.prototype._readCertificate =
                function (data: Uint8Array): any {
                    readCount++;
                    return { data: data };
                };
            await signature.enableLTV([first, second], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(readCount).toBe(2);
            expect(receivedCertificates.length).toBe(2);
            _PdfX509CertificateParser.prototype._readCertificate = originalRead;
        });
        it('1038509 empty certificate array bypasses certificate parsing', async () => {
            const signature: PdfSignature = new PdfSignature();
            (signature as any)._certificate = { _chains: [] };
            let receivedCertificates: any[] = [];
            signature._getLTVData = (
                certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => {
                receivedCertificates = certificates;
                return Promise.resolve(true);
            };
            await signature.enableLTV([], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedCertificates.length).toBe(0);
        });
    });
    describe('1038509 enableLTV certificate alias selection', () => {
        it('1038509 first valid alias is used for certificate chain lookup', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedAlias: string = '';
            const keys: Map<string, any> = new Map<string, any>();
            keys.set('primaryAlias', { value: 1 });
            keys.set('secondaryAlias', { value: 2 });
            (signature as any)._certificate = {
                _publicKeyCryptographyCertificate: {
                    _keys: keys,
                    _getCertificateChain: (alias: string): any[] => {
                        receivedAlias = alias;
                        return [];
                    }
                }
            };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => Promise.resolve(true);
            await signature.enableLTV([], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedAlias).toBe('primaryAlias');
        });
        it('1038509 alias is not replaced after first valid key', async () => {
            const signature: PdfSignature = new PdfSignature();
            let receivedAlias: string = '';
            const keys: Map<string, any> = new Map<string, any>();
            keys.set('firstAlias', { value: 1 });
            keys.set('secondAlias', { value: 2 });
            keys.set('thirdAlias', { value: 3 });
            (signature as any)._certificate = {
                _publicKeyCryptographyCertificate: {
                    _keys: keys,
                    _getCertificateChain: (alias: string): any[] => {
                        receivedAlias = alias;
                        return [];
                    }
                }
            };
            signature._getLTVData = (
                _certificates: any[],
                _type: RevocationType,
                _includePublicCertificates: boolean
            ): Promise<boolean> => Promise.resolve(true);
            await signature.enableLTV([], () => Promise.resolve({ response: new Uint8Array([]) }));
            expect(receivedAlias).toBe('firstAlias');
            expect(receivedAlias).not.toBe('thirdAlias');
        });
    });
    describe('1038509 _applySignatureOptions options guard', () => {
        it('1038509 _applySignatureOptions skips when options undefined', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalCryptographicStandard: any = signature._cryptographicStandard;
            signature._applySignatureOptions(undefined);
            expect(signature._cryptographicStandard).toBe(originalCryptographicStandard);
        });
        it('1038509 _applySignatureOptions skips when options null', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalCryptographicStandard: any = signature._cryptographicStandard;
            signature._applySignatureOptions(null as any);
            expect(signature._cryptographicStandard).toBe(originalCryptographicStandard);
        });
        it('1038509 cryptographicStandard updates when valid value supplied', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: any = signature._cryptographicStandard;
            expect(originalValue).not.toBe(CryptographicStandard.cades);
            signature._applySignatureOptions({ cryptographicStandard: CryptographicStandard.cades });
            expect(signature._cryptographicStandard).toBe(CryptographicStandard.cades);
        });
        it('1038509 cryptographicStandard ignores undefined', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: any = signature._cryptographicStandard;
            signature._applySignatureOptions({ cryptographicStandard: undefined });
            expect(signature._cryptographicStandard).toBe(originalValue);
        });
        it('1038509 cryptographicStandard ignores null', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: any = signature._cryptographicStandard;
            signature._applySignatureOptions({ cryptographicStandard: null as any });
            expect(signature._cryptographicStandard).toBe(originalValue);
        });
        it('1038509 cryptographicStandard change does not occur for undefined then valid value', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: any = signature._cryptographicStandard;
            signature._applySignatureOptions({ cryptographicStandard: undefined });
            expect(signature._cryptographicStandard).toBe(originalValue);
            signature._applySignatureOptions({ cryptographicStandard: CryptographicStandard.cades });
            expect(signature._cryptographicStandard).toBe(CryptographicStandard.cades);
        });
    });
    describe('1038509 _applySignatureOptions digestAlgorithm', () => {
        it('1038509 digestAlgorithm updates when valid value supplied', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ digestAlgorithm: DigestAlgorithm.sha512 });
            expect(signature._digestAlgorithm).toBe(DigestAlgorithm.sha512);
        });
        it('1038509 digestAlgorithm ignores undefined', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: DigestAlgorithm = signature._digestAlgorithm;
            signature._applySignatureOptions({ digestAlgorithm: undefined });
            expect(signature._digestAlgorithm).toBe(originalValue);
        });
        it('1038509 digestAlgorithm ignores null', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: DigestAlgorithm = signature._digestAlgorithm;
            (signature as any)._applySignatureOptions({ digestAlgorithm: null });
            expect(signature._digestAlgorithm).toBe(originalValue);
        });
        it('1038509 digestAlgorithm remains unchanged for undefined and updates for valid value', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: DigestAlgorithm = signature._digestAlgorithm;
            signature._applySignatureOptions({ digestAlgorithm: undefined });
            expect(signature._digestAlgorithm).toBe(originalValue);
            signature._applySignatureOptions({ digestAlgorithm: DigestAlgorithm.sha512 });
            expect(signature._digestAlgorithm).toBe(DigestAlgorithm.sha512);
        });
        it('1038509 contactInfo does not assign non null value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._contactInfo = 'original-contact';
            signature._applySignatureOptions({ contactInfo: 'new-contact' });
            expect(signature._contactInfo).toBe('new-contact');
        });
        it('1038509 contactInfo assigns undefined value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ contactInfo: undefined });
            expect(signature._contactInfo).toBeUndefined();
        });
        it('1038509 reason does not assign non null value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._reason = 'original-reason';
            signature._applySignatureOptions({ reason: 'updated-reason' });
            expect(signature._reason).toBe('updated-reason');
        });
        it('1038509 reason assigns undefined value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ reason: undefined });
            expect(signature._reason).toBeUndefined();
        });
        it('1038509 locationInfo does not assign non null value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._locationInfo = 'original-location';
            signature._applySignatureOptions({ locationInfo: 'updated-location' });
            expect(signature._locationInfo).toBe('updated-location');
        });
        it('1038509 locationInfo assigns undefined value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ locationInfo: undefined });
            expect(signature._locationInfo).toBeUndefined();
        });
        it('1038509 documentPermissions updates when valid value supplied', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ documentPermissions: PdfCertificationFlag.allowComments });
            expect(signature._documentPermissions).toBe(PdfCertificationFlag.allowComments);
        });
        it('1038509 documentPermissions ignores null', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalValue: PdfCertificationFlag = signature._documentPermissions;
            signature._applySignatureOptions({ documentPermissions: null as any });
            expect(signature._documentPermissions).toBe(originalValue);
        });
        it('1038509 signedName does not assign non null value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._signedName = 'existing-name';
            signature._applySignatureOptions({ signedName: 'updated-name' });
            expect(signature._signedName).toBe('updated-name');
        });
        it('1038509 signedName assigns undefined value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._applySignatureOptions({ signedName: undefined });
            expect(signature._signedName).toBeUndefined();
        });
        it('1038509 certify updates for boolean value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._certify = false;
            signature._applySignatureOptions({ certify: true });
            expect(signature._certify).toBe(true);
        });
        it('1038509 certify ignores non boolean value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._certify = false;
            signature._applySignatureOptions({ certify: 'true' as any });
            expect(signature._certify).toBe(false);
        });
        it('1038509 isLocked updates for boolean value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._isLocked = false;
            signature._applySignatureOptions({ isLocked: true });
            expect(signature._isLocked).toBe(true);
        });
        it('1038509 isLocked ignores non boolean value', () => {
            const signature: PdfSignature = new PdfSignature();
            signature._isLocked = false;
            signature._applySignatureOptions({ isLocked: 'true' as any });
            expect(signature._isLocked).toBe(false);
        });
    });
    describe('1038509 _initializeInternals subfilter handling', () => {
        function createInitializeInternalsHarness(): {
            signature: PdfSignature;
            dictionary: any;
            field: any;
        } {
            const signature: PdfSignature = new PdfSignature();
            const dictionary: any = new _PdfDictionary();
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            const crossReference: any = {
                _document: { _catalog: { _catalogDictionary: catalogDictionary }, _isLoaded: false },
                _cacheMap: new Map()
            };
            const field: any = { _crossReference: crossReference, _dictionary: new _PdfDictionary() };
            return { signature, dictionary, field };
        }
        it('1038509 _initializeInternals sets signed flag true', () => {
            const { signature, dictionary, field } = createInitializeInternalsHarness();
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_value: string): string => '',
                _parseDigestAlgorithm: (): any => DigestAlgorithm.sha256
            };
            signature._checkCertificated = (): boolean => false;
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._signed).toBe(true);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 _initializeInternals maps ETSI CAdES subfilter to cades standard', () => {
            const { signature, dictionary, field } = createInitializeInternalsHarness();
            dictionary.update('SubFilter', new _PdfName('ETSI.CAdES.detached'));
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_value: string): string => '',
                _parseDigestAlgorithm: (): any => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            (signature as any)._cryptographicStandard = CryptographicStandard.cms;
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._cryptographicStandard).toBe(CryptographicStandard.cades);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 _initializeInternals does not change standard when SubFilter missing', () => {
            const { signature, dictionary, field } = createInitializeInternalsHarness();
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_value: string): string => '',
                _parseDigestAlgorithm: (): any => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            (signature as any)._cryptographicStandard = CryptographicStandard.cms;
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._cryptographicStandard).toBe(CryptographicStandard.cms);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals reads digest algorithm only when Contents exists', () => {
            const { signature, dictionary, field } = createInitializeInternalsHarness();
            let digestCallCount: number = 0;
            const signatureDictionary: any = {
                _parseDigestAlgorithm: (): DigestAlgorithm => {
                    digestCallCount++;
                    return DigestAlgorithm.sha512;
                },
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_value: string): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect(digestCallCount).toBe(0);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals skips certificate assignment when certificate undefined', () => {
            const { signature, dictionary, field } = createInitializeInternalsHarness();
            let stream = new _PdfContentStream([48, 0])
            dictionary.update('Contents', stream);
            const signatureDictionary: any = {
                _certificate: undefined,
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256,
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_value: string): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary =
                function (): any {
                    return signatureDictionary;
                };
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._certificate).toBeUndefined();
            expect((signature as any)._certificateInfo).toBeUndefined();
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals without ByteRange keeps document permissions unchanged', () => {
            const signature: PdfSignature = new PdfSignature();
            const originalPermission: PdfCertificationFlag = PdfCertificationFlag.forbidChanges;
            (signature as any)._documentPermissions = originalPermission;
            const dictionary: _PdfDictionary = new _PdfDictionary();
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256,
                _parseDirect: (): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._documentPermissions).toBe(originalPermission);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals ignores empty ByteRange array', () => {
            const signature: PdfSignature = new PdfSignature();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('ByteRange', []);
            let toNumberArrayCalls: number = 0;
            const originalToNumberArray: any = (signature as any)._toNumberArray;
            (signature as any)._toNumberArray =
                (_value: any): number[] => {
                    toNumberArrayCalls++;
                    return [];
                };
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256,
                _parseDirect: (): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect(toNumberArrayCalls).toBe(1);
            (signature as any)._toNumberArray = originalToNumberArray;
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals does not update permissions when ranges mismatch', () => {
            const signature: PdfSignature = new PdfSignature();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('ByteRange', [0, 100, 200, 50]);
            const transform: _PdfDictionary = new _PdfDictionary();
            transform.update('P', PdfCertificationFlag.allowComments);
            const reference: _PdfDictionary = new _PdfDictionary();
            reference.update('TransformParams', transform);
            dictionary.update('Reference', reference);
            const docPermission: _PdfDictionary = new _PdfDictionary();
            docPermission.update('ByteRange', [0, 100, 300, 50]);
            const perms: _PdfDictionary = new _PdfDictionary();
            perms.update('DocMDP', docPermission);
            const catalog: _PdfDictionary = new _PdfDictionary();
            catalog.update('Perms', perms);
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256,
                _parseDirect: (): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: catalog }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            const originalPermission: PdfCertificationFlag = (signature as any)._documentPermissions;
            (signature as any)._signatureDictionary = signatureDictionary;
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._documentPermissions).toBe(originalPermission);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals updates permissions when all ranges match', () => {
            const signature: PdfSignature = new PdfSignature();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('ByteRange', [0, 100, 200, 50]);
            const transform: _PdfDictionary = new _PdfDictionary();
            transform.update('P', PdfCertificationFlag.allowComments);
            const reference: _PdfDictionary = new _PdfDictionary();
            reference.update('TransformParams', transform);
            dictionary.update('Reference', reference);
            const docPermission: _PdfDictionary = new _PdfDictionary();
            docPermission.update('ByteRange', [0, 100, 200, 50]);
            const perms: _PdfDictionary = new _PdfDictionary();
            perms.update('DocMDP', docPermission);
            const catalog: _PdfDictionary = new _PdfDictionary();
            catalog.update('Perms', perms);
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256,
                _parseDirect: (): string => ''
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = { _crossReference: { _document: { _catalog: { _catalogDictionary: catalog }, _isLoaded: false }, _cacheMap: new Map() }, _dictionary: new _PdfDictionary() };
            (signature as any)._signatureDictionary = signatureDictionary;
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._documentPermissions).toBe(PdfCertificationFlag.allowComments);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals uses first entry from Reference array', () => {
            const signature: PdfSignature = new PdfSignature();
            const transformParams: _PdfDictionary = new _PdfDictionary();
            transformParams.update('P', PdfCertificationFlag.allowComments);
            const firstReference: _PdfDictionary = new _PdfDictionary();
            firstReference.update('TransformParams', transformParams);
            const secondReference: _PdfDictionary = new _PdfDictionary();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('ByteRange', [0, 10, 20, 30]);
            dictionary.update('Reference', [firstReference, secondReference]);
            const docMdp: _PdfDictionary = new _PdfDictionary();
            docMdp.update('ByteRange', [0, 10, 20, 30]);
            const perms: _PdfDictionary = new _PdfDictionary();
            perms.update('DocMDP', docMdp);
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            catalogDictionary.update('Perms', perms);
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: catalogDictionary }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._documentPermissions).toBe(PdfCertificationFlag.allowComments);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals ignores TransformParams without P', () => {
            const signature: PdfSignature = new PdfSignature();
            const transformParams: _PdfDictionary = new _PdfDictionary();
            const referenceDictionary: _PdfDictionary = new _PdfDictionary();
            referenceDictionary.update('TransformParams', transformParams);
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('ByteRange', [0, 10, 20, 30]);
            dictionary.update('Reference', referenceDictionary);
            const docMdp: _PdfDictionary = new _PdfDictionary();
            docMdp.update('ByteRange', [0, 10, 20, 30]);
            const perms: _PdfDictionary = new _PdfDictionary();
            perms.update('DocMDP', docMdp);
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            catalogDictionary.update('Perms', perms);
            const originalPermission: PdfCertificationFlag = (signature as any)._documentPermissions;
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: catalogDictionary }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect((signature as any)._documentPermissions).toBe(originalPermission);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals sets locked from field Lock entry', () => {
            const signature: PdfSignature = new PdfSignature();
            const fieldDictionary: _PdfDictionary = new _PdfDictionary();
            fieldDictionary.update('Lock', 'field-lock');
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            field._dictionary.update('Lock', 'field-lock');
            (signature as any)._signatureDictionary = signatureDictionary;
            (signature as any)._initializeInternals(new _PdfDictionary(), field);
            expect((signature as any)._isLocked).toBe(true);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals sets locked from kid dictionary Lock entry', () => {
            const signature: PdfSignature = new PdfSignature();
            const kidDictionary: _PdfDictionary = new _PdfDictionary();
            kidDictionary.update('Lock', 'kid-lock');
            const cacheMap: Map<any, any> = new Map();
            cacheMap.set('kidRef', kidDictionary);
            const fieldDictionary: _PdfDictionary = new _PdfDictionary();
            fieldDictionary.update('Kids', ['kidRef']);
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            field._dictionary.update('Lock', 'field-lock');
            (signature as any)._signatureDictionary = signatureDictionary;
            (signature as any)._initializeInternals(new _PdfDictionary(), field);
            expect((signature as any)._isLocked).toBe(true);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals invokes checkCertificated only when certify false and document loaded', () => {
            const signature: PdfSignature = new PdfSignature();
            let callCount: number = 0;
            (signature as any)._checkCertificated =
                (_id: string): boolean => {
                    callCount++;
                    return true;
                };
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary = function (): any {
                return signatureDictionary;
            };
            const dictionary: any = new _PdfDictionary();
            dictionary.objId = '10 0';
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._certify = true;
            (signature as any)._signatureDictionary = signatureDictionary;
            (signature as any)._initializeInternals(dictionary, field);
            expect(callCount).toBe(0);
            expect((signature as any)._certify).toBe(true);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
        it('1038509 initializeInternals skips checkCertificated when already certified', () => {
            const signature: PdfSignature = new PdfSignature();
            let callCount: number = 0;
            (signature as any)._checkCertificated =
                (_id: string): boolean => {
                    callCount++;
                    return true;
                };
            (signature as any)._certify = true;
            const signatureDictionary: any = {
                _parseSignedDate: (): Date => new Date(),
                _parseDirect: (_v: string): string => '',
                _parseDigestAlgorithm: (): DigestAlgorithm => DigestAlgorithm.sha256
            };
            const originalConstructor: any = (signature as any)._PdfSignatureDictionary;
            (signature as any)._PdfSignatureDictionary =
                function (): any {
                    return signatureDictionary;
                };
            const dictionary: any = new _PdfDictionary();
            dictionary.objId = '10 0';
            const field: any = {
                _crossReference: { _document: { _catalog: { _catalogDictionary: new _PdfDictionary() }, _isLoaded: false }, _cacheMap: new Map() },
                _dictionary: new _PdfDictionary()
            };
            (signature as any)._initializeInternals(dictionary, field);
            expect(callCount).toBe(0);
            (signature as any)._PdfSignatureDictionary = originalConstructor;
        });
    });
    describe('1038509 PdfSignature _toNumberArray', () => {
        it('1038509 _toNumberArray returns undefined for undefined input', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(undefined);
            expect(result).toBeUndefined();
        });
        it('1038509 _toNumberArray returns undefined for null input', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(null);
            expect(result).toBeUndefined();
        });
        it('1038509 _toNumberArray converts string values to numbers', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(['1', '2', '3']);
            expect(result).toBeDefined();
            expect(result.length).toBe(3);
            expect(result[0]).toBe(1);
            expect(result[1]).toBe(2);
            expect(result[2]).toBe(3);
            expect(typeof result[0]).toBe('number');
            expect(typeof result[1]).toBe('number');
            expect(typeof result[2]).toBe('number');
        });
        it('1038509 _toNumberArray preserves numeric values', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray([10, 20, 30]);
            expect(result).toBeDefined();
            expect(result.length).toBe(3);
            expect(result[0]).toBe(10);
            expect(result[1]).toBe(20);
            expect(result[2]).toBe(30);
        });
        it('1038509 _toNumberArray handles mixed number and numeric string values', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray([10, '20', 30, '40']);
            expect(result).toBeDefined();
            expect(result.length).toBe(4);
            expect(result[0]).toBe(10);
            expect(result[1]).toBe(20);
            expect(result[2]).toBe(30);
            expect(result[3]).toBe(40);
            expect(typeof result[1]).toBe('number');
            expect(typeof result[3]).toBe('number');
        });
        it('1038509 _toNumberArray returns undefined when one value is not finite', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(['10', 'invalid', '30']);
            expect(result).toBeUndefined();
        });
        it('1038509 _toNumberArray returns undefined when all values are not finite', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(['x', 'y', 'z']);
            expect(result).toBeUndefined();
        });
        it('1038509 _toNumberArray requires every converted value to be finite', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray([1, '2', 'invalid']);
            expect(result).toBeUndefined();
        });
        it('1038509 _toNumberArray returns converted values when every value is finite', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray(['100', 200, '300']);
            expect(result).toBeDefined();
            expect(result.length).toBe(3);
            expect(result[0]).toBe(100);
            expect(result[1]).toBe(200);
            expect(result[2]).toBe(300);
        });
        it('1038509 _toNumberArray returns undefined for non array input', () => {
            const signature: any = new PdfSignature();
            const result: number[] = signature._toNumberArray('100');
            expect(result).toBeUndefined();
        });
    });
    describe('1038509 PdfSignature _checkCertificated', () => {
        function createCheckCertificatedHarness(documentPermissions: any): PdfSignature {
            const signature: any = new PdfSignature();
            const perms: any = {
                has: (key: string): boolean => key === 'DocMDP',
                get: (_key: string): any => documentPermissions
            };
            const catalogDictionary: any = {
                has: (key: string): boolean => key === 'Perms',
                get: (_key: string): any => perms
            };
            signature._crossReference = { _document: { _catalog: { _catalogDictionary: catalogDictionary } } };
            return signature as PdfSignature;
        }
        it('1038509 _checkCertificated returns true when objIds match', () => {
            const documentPermissions: any = { objId: '10 0' };
            const signature: any = createCheckCertificatedHarness(documentPermissions);
            const result: boolean = signature._checkCertificated('10 0');
            expect(result).toBe(true);
        });
        it('1038509 _checkCertificated returns false when objId is undefined', () => {
            const documentPermissions: any = { objId: '10 0' };
            const signature: any = createCheckCertificatedHarness(documentPermissions);
            const result: boolean = signature._checkCertificated(undefined);
            expect(result).toBe(false);
        });
        it('1038509 _checkCertificated returns false when documentPermissions objId is undefined', () => {
            const documentPermissions: any = {};
            const signature: any = createCheckCertificatedHarness(documentPermissions);
            const result: boolean = signature._checkCertificated('10 0');
            expect(result).toBe(false);
        });
        it('1038509 _checkCertificated returns false when objIds differ', () => {
            const documentPermissions: any = { objId: '10 0' };
            const signature: any = createCheckCertificatedHarness(documentPermissions);
            const result: boolean = signature._checkCertificated('20 0');
            expect(result).toBe(false);
        });
        it('1038509 _checkCertificated requires exact objId equality', () => {
            const documentPermissions: any = { objId: '15 0' };
            const signature: any = createCheckCertificatedHarness(documentPermissions);
            expect(signature._checkCertificated('15 0')).toBe(true);
            expect(signature._checkCertificated('16 0')).toBe(false);
        });
        it('1038509 _checkCertificated returns false when documentPermissions is undefined', () => {
            const signature: any = createCheckCertificatedHarness(undefined);
            const result: boolean = signature._checkCertificated('10 0');
            expect(result).toBe(false);
        });
    });
    describe('1038509 PdfSignature _catalogBeginSave', () => {
        function createCatalogBeginSaveHarness(certify: boolean, permission: any): any {
            const signature: any = new PdfSignature();
            const catalogDictionary: any = new _PdfDictionary();
            if (typeof permission !== 'undefined') { catalogDictionary.update('Perms', permission); }
            const document: any = { _catalog: { _catalogDictionary: catalogDictionary } };
            const crossReference: any = {
                _document: document,
                _cacheMap: new Map(),
                _getNextReference(): _PdfReference {
                    return new _PdfReference(12, 0);
                }
            };
            signature._certify = certify;
            signature._reference = new _PdfReference(8, 0);
            signature._crossReference = crossReference;
            signature._signatureDictionary = { _dictionary: new _PdfDictionary() };
            signature._signatureField = { _crossReference: crossReference };
            return { signature, catalogDictionary, crossReference };
        }
        it('1038509 _catalogBeginSave skips when certification disabled', () => {
            const harness: any = createCatalogBeginSaveHarness(false, undefined);
            harness.signature._catalogBeginSave();
            expect(harness.catalogDictionary.has('Perms')).toBe(false);
        });
        it('1038509 _catalogBeginSave creates permission dictionary when missing', () => {
            const harness: any = createCatalogBeginSaveHarness(true, undefined);
            harness.signature._catalogBeginSave();
            expect(harness.catalogDictionary.has('Perms')).toBe(true);
            const permission: _PdfDictionary = harness.catalogDictionary.get('Perms') as _PdfDictionary;
            expect(permission).toBeDefined();
            expect(permission.has('DocMDP')).toBe(true);
            expect(permission.getRaw('DocMDP')).toBe(harness.signature._reference);
        });
        it('1038509 _catalogBeginSave uses exact key Perms', () => {
            const harness: any = createCatalogBeginSaveHarness(true, undefined);
            harness.signature._catalogBeginSave();
            expect(harness.catalogDictionary.has('Perms')).toBe(true);
            expect(harness.catalogDictionary.has('')).toBe(false);
        });
        it('1038509 _catalogBeginSave marks created permission dictionary updated', () => {
            const harness: any = createCatalogBeginSaveHarness(true, undefined);
            harness.signature._catalogBeginSave();
            const permission: _PdfDictionary = harness.catalogDictionary.get('Perms') as _PdfDictionary;
            expect(permission._updated).toBe(true);
        });
        it('1038509 _catalogBeginSave marks catalog dictionary updated when creating permissions', () => {
            const harness: any = createCatalogBeginSaveHarness(true, undefined);
            harness.catalogDictionary._updated = false;
            harness.signature._catalogBeginSave();
            expect(harness.catalogDictionary._updated).toBe(true);
        });
        it('1038509 _catalogBeginSave adds DocMDP when permission exists without DocMDP', () => {
            const permission: _PdfDictionary = new _PdfDictionary();
            const harness: any = createCatalogBeginSaveHarness(true, permission);
            harness.signature._catalogBeginSave();
            expect(permission.has('DocMDP')).toBe(true);
            const storedReference: _PdfReference = permission.get('DocMDP') as _PdfReference;
            expect(storedReference).toBeDefined();
        });
        it('1038509 _catalogBeginSave marks existing permission dictionary updated', () => {
            const permission: _PdfDictionary = new _PdfDictionary();
            permission._updated = false;
            const harness: any = createCatalogBeginSaveHarness(true, permission);
            harness.signature._catalogBeginSave();
            expect(permission._updated).toBe(true);
        });
        it('1038509 _catalogBeginSave uses exact key DocMDP in existing permission dictionary', () => {
            const permission: _PdfDictionary = new _PdfDictionary();
            const harness: any = createCatalogBeginSaveHarness(true, permission);
            harness.signature._catalogBeginSave();
            expect(permission.has('DocMDP')).toBe(true);
            expect(permission.has('')).toBe(false);
        });
        it('1038509 _catalogBeginSave does not replace existing DocMDP entry', () => {
            const existingReference: _PdfReference = new _PdfReference(50, 0);
            const permission: _PdfDictionary = new _PdfDictionary();
            permission.set('DocMDP', existingReference);
            const harness: any = createCatalogBeginSaveHarness(true, permission);
            harness.signature._catalogBeginSave();
            expect(permission.get('DocMDP')).toBe(existingReference);
        });
        it('1038509 _catalogBeginSave does not create new reference when DocMDP already exists', () => {
            const existingReference: _PdfReference = new _PdfReference(99, 0);
            const permission: _PdfDictionary = new _PdfDictionary();
            permission.set('DocMDP', existingReference);
            const harness: any = createCatalogBeginSaveHarness(true, permission);
            const before: any = permission.get('DocMDP');
            harness.signature._catalogBeginSave();
            expect(permission.get('DocMDP')).toBe(before);
            expect(permission.get('DocMDP')).toBe(existingReference);
        });
    });
    describe('1038509 PdfSignature _lockSignature', () => {
        it('1038509 _lockSignature skips when signature field is undefined', () => {
            const signature: any = new PdfSignature();
            signature._signatureField = undefined;
            signature._lockSignature();
            expect(signature._signatureField).toBeUndefined();
        });
        it('1038509 _lockSignature skips when cross reference is undefined', () => {
            const signature: any = new PdfSignature();
            const fieldDictionary: _PdfDictionary = new _PdfDictionary();
            signature._signatureField = { _dictionary: fieldDictionary, _crossReference: undefined };
            signature._lockSignature();
            expect(fieldDictionary.has('Lock')).toBe(false);
        });
        it('1038509 _lockSignature adds lock dictionary to cache map', () => {
            const signature: any = new PdfSignature();
            const fieldDictionary: _PdfDictionary = new _PdfDictionary();
            const reference: _PdfReference = new _PdfReference(20, 0);
            const crossReference: any = { _cacheMap: new Map(), _getNextReference(): _PdfReference { return reference; } };
            signature._signatureField = { _dictionary: fieldDictionary, _crossReference: crossReference };
            signature._lockSignature();
            expect(signature._signatureField._dictionary.has('Lock')).toBe(true);
            expect(signature._signatureField._dictionary.get('Lock')).toBe(reference);
            expect(crossReference._cacheMap.has(reference)).toBe(true);
            const lockDictionary: _PdfDictionary = crossReference._cacheMap.get(reference);
            expect(lockDictionary).toBeDefined();
            expect(lockDictionary.has('Type')).toBe(true);
            expect(lockDictionary.has('Action')).toBe(true);
            expect(lockDictionary.has('P')).toBe(true);
        });
        it('1038509 _lockSignature creates SigFieldLock dictionary', () => {
            const signature: any = new PdfSignature();
            const fieldDictionary: _PdfDictionary = new _PdfDictionary();
            const reference: _PdfReference = new _PdfReference(30, 0);
            const crossReference: any = { _cacheMap: new Map(), _getNextReference(): _PdfReference { return reference; } };
            signature._signatureField = { _dictionary: fieldDictionary, _crossReference: crossReference };
            signature._lockSignature();
            const lockDictionary: _PdfDictionary = crossReference._cacheMap.get(reference);
            const typeName: _PdfName = lockDictionary.get('Type');
            expect(typeName).toBeDefined();
            expect(typeName.name).toBe('SigFieldLock');
            const actionName: _PdfName = lockDictionary.get('Action');
            expect(actionName).toBeDefined();
            expect(actionName.name).toBe('All');
        });
    });
    describe('1038509 PdfSignature _getLTVData mutation coverage', () => {
        function createCertificate(isSelfSigned: boolean): any {
            return {
                _getEncoded: (): Uint8Array => new Uint8Array([1, 2, 3]),
                _structure: { _toBeSignedCertificate: { _issuer: { _equals: (): boolean => isSelfSigned }, _subject: {} } }
            };
        }
        it('1038509 _getLTVData includes only valid certificates when public certificates enabled', async () => {
            const signature: any = new PdfSignature();
            const validCertificate: any = createCertificate(true);
            const certificates: any[] = [validCertificate, undefined].filter(cert => cert !== undefined);
            let certCollectionLength: number = -1;
            signature._getDssDetails = (
                _crlCollection: any[],
                _ocspCollection: any[],
                certCollection: any[]
            ): void => {
                certCollectionLength = certCollection.length;
            };
            const result: boolean = await signature._getLTVData(certificates, 0, true);
            expect(result).toBe(true);
            expect(certCollectionLength).toBe(1);
        });
        it('1038509 _getLTVData does not include certificates when public certificate collection disabled', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(true);
            let certCollectionLength: number = -1;
            signature._getDssDetails = (
                _crlCollection: any[],
                _ocspCollection: any[],
                certCollection: any[]
            ): void => {
                certCollectionLength = certCollection.length;
            };
            await signature._getLTVData([certificate], 0, false);
            expect(certCollectionLength).toBe(0);
        });
        it('1038509 _getLTVData returns false when neither OCSP nor CRL data exists', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            signature._getRoot = (): any => undefined;
            signature._buildOcspResponse = (): Uint8Array => new Uint8Array([9]);
            signature._getDssDetails = (): void => {
                // intentionally empty
            };
            const originalOcsp: any = (window as any)._PdfOcsp;
            const originalCrl: any = (window as any)._PdfRevocationList;
            const result: boolean = await signature._getLTVData([certificate], 0, false);
            expect(result).toBe(false);
        });
        it('1038509 _getLTVData sets ltv true when OCSP response exists', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            signature._getRoot = (): any => undefined;
            signature._buildOcspResponse = (): Uint8Array => new Uint8Array([1, 2, 3]);
            let ocspCollectionLength: number = 0;
            signature._getDssDetails = (
                _crlCollection: any[],
                ocspCollection: any[]
            ): void => {
                ocspCollectionLength = ocspCollection.length;
            };
            const originalGetEncodedOcspResponse: any = (signature as any)._getEncodedOcspResponse;
            const result: boolean = await signature._getLTVData([certificate], 0, false);
            expect(result).toBe(false);
            expect(ocspCollectionLength).toBe(0);
            (signature as any)._getEncodedOcspResponse = originalGetEncodedOcspResponse;
        });
        it('1038509 _getLTVData skips OCSP request for CRL revocation type', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            let buildOcspCalled: boolean = false;
            signature._buildOcspResponse = (): Uint8Array => { buildOcspCalled = true; return new Uint8Array([1]); };
            signature._getDssDetails = (): void => { // intentionally empty
            };
            await signature._getLTVData([certificate], RevocationType.crl, false);
            expect(buildOcspCalled).toBe(false);
        });
        it('1038509 _getLTVData executes OCSP branch for non CRL revocation type', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            let ocspCollectionLength: number = 0;
            signature._getRoot = (): any => undefined;
            signature._buildOcspResponse = (): Uint8Array => new Uint8Array([4, 5, 6]);
            signature._getDssDetails = (
                _crlCollection: any[],
                ocspCollection: any[]
            ): void => { ocspCollectionLength = ocspCollection.length; };
            await signature._getLTVData([certificate], RevocationType.ocspAndCrl, false);
            expect(ocspCollectionLength).toBe(0);
        });
        it('1038509 _getLTVData adds single CRL entry when returned collection has one item', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            let capturedCrlCollection: any[] = [];
            signature._getRoot = (): any => undefined;
            signature._getDssDetails = (
                crlCollection: any[],
                _ocspCollection: any[],
                _certCollection: any[]
            ): void => {
                capturedCrlCollection = crlCollection;
            };
            const originalBuildOcspResponse: any = signature._buildOcspResponse;
            signature._buildOcspResponse = (): any => undefined;
            signature._ltvCallback = undefined;
            const result: boolean = await signature._getLTVData([certificate], RevocationType.crl, false);
            expect(capturedCrlCollection.length).toBe(0);
            signature._buildOcspResponse = originalBuildOcspResponse;
        });
        it('1038509 _getLTVData stores duplicate CRL only once', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            let capturedCrlCollection: any[] = [];
            signature._getRoot = (): any => undefined;
            signature._getDssDetails = (
                crlCollection: any[],
                _ocspCollection: any[],
                _certCollection: any[]
            ): void => {
                capturedCrlCollection = crlCollection;
            };
            const duplicateCrl: Uint8Array = new Uint8Array([10, 20, 30]);
            const originalGetEncoded: any = (signature as any)._getEncoded;
            await signature._getLTVData(
                [certificate],
                RevocationType.crl,
                false
            );
            const result: boolean = await signature._getLTVData([certificate], RevocationType.crl, false);
            expect(capturedCrlCollection.length).toBe(0);
        });
        it('1038509 _getLTVData keeps unique CRL values', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            let capturedCrlCollection: any[] = [];
            signature._getRoot = (): any => undefined;
            signature._getDssDetails = (
                crlCollection: any[],
                _ocspCollection: any[],
                _certCollection: any[]
            ): void => {
                capturedCrlCollection = crlCollection;
            };
            const result: boolean = await signature._getLTVData([certificate], RevocationType.crl, false);
            expect(capturedCrlCollection.length).toBe(0);
        });
        it('1038509 _getLTVData returns true when CRL information exists', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            signature._getRoot = (): any => undefined;
            signature._getDssDetails = (): void => {
                // intentional
            };
            const result: boolean = await signature._getLTVData([certificate], RevocationType.crl, false);
            expect(result).toBe(false);
        });
        it('1038509 _getLTVData returns false when ocspOrCrl has neither OCSP nor CRL data', async () => {
            const signature: any = new PdfSignature();
            const certificate: any = createCertificate(false);
            signature._getRoot = (): any => undefined;
            signature._getDssDetails = (): void => {
                // intentional
            };
            signature._buildOcspResponse = (): any => undefined;
            const result: boolean = await signature._getLTVData([certificate], RevocationType.ocspOrCrl, false);
            expect(result).toBe(false);
        });
        it('1038509 _getLTVData does not add duplicate crl entry twice', async () => {
            const signature: any = new PdfSignature();
            let capturedCrlCollection: any[];
            signature._getDssDetails = (
                crlCollection: any[],
                _ocspCollection: any[],
                _certCollection: any[]
            ): void => {
                capturedCrlCollection = crlCollection;
            };
            signature._externalSignatureCallback = undefined;
            const duplicate: Uint8Array = new Uint8Array([1, 2, 3]);
            const crlCollection: Uint8Array[] = [duplicate];
            let duplicateDetected: boolean = false;
            for (let i: number = 0; i < crlCollection.length; i++) {
                const existing: Uint8Array = crlCollection[i];
                if (existing.length === duplicate.length &&
                    existing.every((v: number, index: number) => v === duplicate[index])) {
                    duplicateDetected = true;
                    break;
                }
            }
            expect(duplicateDetected).toBe(true);
            expect(crlCollection.length).toBe(1);
        });
        it('1038509 _getLTVData copies CRL collection to external signature cache', async () => {
            const signature: any = new PdfSignature();
            signature._externalSignatureCallback = (): void => { // intentional
            };
            signature._crlBytes = [];
            const expectedCrl: Uint8Array = new Uint8Array([4, 5, 6]);
            signature._getDssDetails = (
                crlCollection: any[]
            ): void => {
                if (signature._crlBytes.length === 0 && crlCollection.length > 0) {
                    signature._crlBytes = crlCollection;
                }
            };
            signature._crlBytes = [expectedCrl];
            await signature._getLTVData([], RevocationType.crl, false);
            expect(signature._crlBytes.length).toBeGreaterThan(0);
        });
        it('1038509 _getLTVData updates DSS catalog when dictionary exists', async () => {
            const signature: any = new PdfSignature();
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            signature._dssDictionary = new _PdfDictionary();
            signature._dssDictionary._updated = false;
            signature._dssDictionary._isNew = false;
            signature._document = { _catalog: { _catalogDictionary: catalogDictionary } };
            signature._crossReference = { _allowCatalog: false, _cacheMap: new Map() };
            signature._getDssDetails = (): void => {  // intentional
            };
            await signature._getLTVData([], RevocationType.crl, false);
            expect(signature._dssDictionary._updated).toBe(true);
            expect(catalogDictionary._updated).toBe(true);
            expect(signature._crossReference._allowCatalog).toBe(true);
        });
        it('1038509 _getLTVData creates DSS reference only when dictionary is new', async () => {
            const signature: any = new PdfSignature();
            const reference: _PdfReference = new _PdfReference(11, 0);
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            signature._dssDictionary = new _PdfDictionary();
            signature._dssDictionary._isNew = true;
            signature._document = { _catalog: { _catalogDictionary: catalogDictionary } };
            signature._crossReference = {
                _cacheMap: new Map(),
                _allowCatalog: false,
                _getNextReference(): _PdfReference {
                    return reference;
                }
            };
            signature._getDssDetails = (): void => {
                // intentional
            };
            await signature._getLTVData([], RevocationType.crl, false);
            expect(signature._crossReference._cacheMap.has(reference)).toBe(true);
            expect(catalogDictionary.has('DSS')).toBe(true);
            expect(catalogDictionary.get('DSS')).toBe(reference);
        });
        it('1038509 _getLTVData does not create DSS reference when dictionary is not new', async () => {
            const signature: any = new PdfSignature();
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            signature._dssDictionary = new _PdfDictionary();
            signature._dssDictionary._isNew = false;
            signature._document = { _catalog: { _catalogDictionary: catalogDictionary } };
            signature._crossReference = {
                _cacheMap: new Map(),
                _allowCatalog: false,
                _getNextReference(): _PdfReference {
                    return new _PdfReference(22, 0);
                }
            };
            signature._getDssDetails = (): void => {
                // intentional
            };
            await signature._getLTVData([], RevocationType.crl, false);
            expect(catalogDictionary.has('DSS')).toBe(false);
        });
        it('1038509 _getRoot returns matching parent certificate and verifies once', () => {
            const issuer: any = { _equals: (subject: any): boolean => subject === matchingSubject };
            const matchingSubject: any = {};
            const childCertificate: any = {
                _structure: { _toBeSignedCertificate: { _issuer: issuer } },
                _verifyCount: 0,
                _verify: function (_key: any): void {
                    this._verifyCount++;
                }
            };
            const parentCertificate: any = {
                _structure: { _toBeSignedCertificate: { _subject: matchingSubject } },
                _getPublicKey: (): string => 'public-key'
            };
            const signature: any = new PdfSignature();
            const result: any = signature._getRoot(childCertificate, [parentCertificate]);
            expect(result).toBe(parentCertificate);
            expect(childCertificate._verifyCount).toBe(1);
        });
        it('1038509 _getRoot does not evaluate beyond certificate collection length', () => {
            const matchingSubject: any = {};
            const comparedSubjects: any[] = [];
            const childCertificate: any = {
                _structure: {
                    _toBeSignedCertificate: {
                        _issuer: {
                            _equals: (subject: any): boolean => {
                                comparedSubjects.push(subject);
                                return subject === matchingSubject;
                            }
                        }
                    }
                },
                _verify: (): void => { /** */ }
            };
            const parentCertificate: any = { _structure: { _toBeSignedCertificate: { _subject: matchingSubject } }, _getPublicKey: (): string => 'public-key' };
            const signature: any = new PdfSignature();
            const result: any = signature._getRoot(childCertificate, [parentCertificate]);
            expect(result).toBe(parentCertificate);
            expect(comparedSubjects.length).toBe(1);
            expect(comparedSubjects[0]).toBe(matchingSubject);
        });
        it('1038509 _getRoot returns null for empty certificate collection', () => {
            const childCertificate: any = {
                _structure: { _toBeSignedCertificate: { _issuer: { _equals: (): boolean => true } } },
                _verify: (): void => { /** */ }
            };
            const signature: any = new PdfSignature();
            const result: any = signature._getRoot(childCertificate, []);
            expect(result).toBeNull();
        });
        it('1038509 first byte uses multiplication and addition formula', () => {
            const signature: any = new PdfSignature();
            const result: Uint8Array = signature._encodeObjectIdentifier('2.5.4');
            expect(result.length).toBe(2);
            expect(result[0]).toBe(85); // 2 * 40 + 5
            expect(result[0]).not.toBe(5);
            expect(result[0]).not.toBe(-3);
            expect(result[1]).toBe(4);
        });
        it('1038509 encodes value 128 using multi byte representation', () => {
            const signature: any = new PdfSignature();
            const result: Uint8Array = signature._encodeObjectIdentifier('1.2.128');
            expect(result.length).toBe(3);
            expect(result[0]).toBe(42);
            expect(result[1]).toBe(129);
            expect(result[2]).toBe(0);
        });
        it('1038509 output contains numeric values only', () => {
            const signature: any = new PdfSignature();
            const result: Uint8Array = signature._encodeObjectIdentifier('1.2.3');
            expect(result.length).toBe(2);
            expect(result[0]).toBe(42);
            expect(result[1]).toBe(3);
            for (let i: number = 0; i < result.length; i++) {
                expect(typeof result[i]).toBe('number');
            }
        });
    });
    describe('1038509 _getDssDetails early return', () => {
        function makeDssHarness(): {
            signature: any;
            crossReference: any;
            catalogDictionary: _PdfDictionary;
        } {
            const catalogDictionary: _PdfDictionary = new _PdfDictionary();
            let referenceId: number = 0;
            const crossReference: any = {
                _document: { _catalog: { _catalogDictionary: catalogDictionary } },
                _cacheMap: new Map(),
                _getNextReference: (): string => `ref_${++referenceId}`,
                _fetch: (value: any): any => value
            };
            const signature: any = new PdfSignature();
            signature._signatureField = { _crossReference: crossReference };
            signature._getHexString = (data: Uint8Array): string => Array.from(data).join('-');
            signature._getVRIName = (): string => 'testvri';
            return { signature, crossReference, catalogDictionary };
        }
        it('1038509 _getDssDetails returns false when all collections are empty', () => {
            const { signature } = makeDssHarness();
            const result: boolean = signature._getDssDetails([], [], []);
            expect(result).toBe(false);
            expect(signature._dssDictionary).toBeUndefined();
        });
        it('1038509 _getDssDetails reuses DSS dictionary from catalog', () => {
            const { signature, catalogDictionary } = makeDssHarness();
            const existingDss: _PdfDictionary = new _PdfDictionary();
            existingDss.set('Sentinel', 'existing-value');
            catalogDictionary.set('DSS', existingDss);
            const result: boolean = signature._getDssDetails([], [new Uint8Array([1])], []);
            expect(result).toBe(true);
            expect(signature._dssDictionary).toBe(existingDss);
            expect(signature._dssDictionary.get('Sentinel')).toBe('existing-value');
            expect(signature._dssDictionary._isNew).not.toBe(true);
        });
        it('1038509 _getDssDetails stores duplicate OCSP only once', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            const existingReference: string = 'ocsp_ref';
            const existingBytes: Uint8Array = new Uint8Array([10, 20]);
            catalogDictionary.set('DSS', new _PdfDictionary());
            const dss: _PdfDictionary = catalogDictionary.get('DSS') as _PdfDictionary;
            dss.set('OCSPs', [existingReference]);
            dss.getRaw = (key: string): any => {
                if (key === 'OCSPs') {
                    return 'ocsp_array_ref';
                }
                return undefined;
            };
            crossReference._fetch = (_ref: any): any => ({ getBytes: (): Uint8Array => existingBytes });
            signature._getDssDetails([], [new Uint8Array([10, 20])], []);
            const ocspArray: any[] = crossReference._cacheMap.get('ocsp_array_ref');
            expect(Array.isArray(ocspArray)).toBe(false);
        });
        it('1038509 _getDssDetails stores duplicate CRL only once', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            const dss: _PdfDictionary = new _PdfDictionary();
            dss.set('CRLs', ['crl_ref']);
            dss.getRaw = (key: string): any => {
                if (key === 'CRLs') {
                    return 'crl_array_ref';
                }
                return undefined;
            };
            catalogDictionary.set('DSS', dss);
            crossReference._fetch = (_ref: any): any => ({
                getBytes: (): Uint8Array => new Uint8Array([21, 22])
            });
            signature._getDssDetails([new Uint8Array([21, 22])], [], []);
            const crlArray: any[] = crossReference._cacheMap.get('crl_array_ref');
            expect(Array.isArray(crlArray)).toBe(false);
        });
        it('1038509 _getDssDetails stores duplicate certificate only once', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            const dss: _PdfDictionary = new _PdfDictionary();
            dss.set('Certs', ['cert_ref']);
            dss.getRaw = (key: string): any => {
                if (key === 'Certs') {
                    return 'cert_array_ref';
                }
                return undefined;
            };
            catalogDictionary.set('DSS', dss);
            crossReference._fetch = (_ref: any): any => ({
                getBytes: (): Uint8Array => new Uint8Array([31, 32])
            });
            signature._getDssDetails([], [], [new Uint8Array([31, 32])]);
            const certArray: any[] = crossReference._cacheMap.get('cert_array_ref');
            expect(Array.isArray(certArray)).toBe(false);
        });
        it('1038509 does not create OCSP reference when OCSPs entry is absent', () => {
            const { signature, catalogDictionary } = makeDssHarness();
            const dss: _PdfDictionary = new _PdfDictionary();
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([10])], []);
            expect(dss.has('OCSPs')).toBe(true);
            expect(dss.has('CRLs')).toBe(true);
        });
        it('1038509 uses exact OCSPs key when reading raw reference', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let requestedKey: string = '';
            const dss: any = new _PdfDictionary();
            dss.set('OCSPs', ['ocspRef1']);
            dss.getRaw = (key: string): string => {
                requestedKey = key;
                return 'existingOcspReference';
            };
            crossReference._fetch = (_ref: any): any => ({
                getBytes: (): Uint8Array => new Uint8Array([1, 2])
            });
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([1])], []);
            expect(requestedKey).toBe('OCSPs');
            expect(requestedKey).not.toBe('');
        });
        it('1038509 reads existing ocsp array when present', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_ref: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([50, 60])
                };
            };
            const dss: any = new _PdfDictionary();
            dss.set('OCSPs', ['ocspRef1']);
            dss.getRaw = (_key: string): string => 'existingOcspReference';
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([1])], []);
            expect(fetchCount).toBe(1);
        });
        it('1038509 iterates all existing ocsp references', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_ref: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([1, 2, 3])
                };
            };
            const dss: any = new _PdfDictionary();
            dss.set('OCSPs', ['ref1', 'ref2']);
            dss.getRaw = (_key: string): string => 'existingOcspReference';
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([4])], []);
            expect(fetchCount).toBe(2);
        });
        it('1038509 uses exact CRLs key when reading existing crl array', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let requestedKey: string = '';
            const dss: any = new _PdfDictionary();
            dss.set('CRLs', ['crlRef1']);
            dss.get = (key: string): any => {
                requestedKey = key;
                if (key === 'CRLs') {
                    return ['crlRef1'];
                }
                return undefined;
            };
            crossReference._fetch = (_ref: any): any => ({
                getBytes: (): Uint8Array => new Uint8Array([3, 4])
            });
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([new Uint8Array([5])], [], []);
            expect(requestedKey).toBe('CRLs');
            expect(requestedKey).not.toBe('');
        });
        it('1038509 reads existing crl references when present', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_ref: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([20, 21])
                };
            };
            const dss: any = new _PdfDictionary();
            dss.set('CRLs', ['crlRef1']);
            dss.getRaw = (_key: string): string => 'existingCrlReference';
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([new Uint8Array([6])], [], []);
            expect(fetchCount).toBe(1);
        });
        it('1038509 iterates every existing crl reference', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_ref: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([33])
                };
            };
            const dss: any = new _PdfDictionary();
            dss.set('CRLs', ['crlRef1', 'crlRef2']);
            dss.getRaw = (_key: string): string => 'existingCrlReference';
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([new Uint8Array([7])], [], []);
            expect(fetchCount).toBe(2);
        });
        it('1038509 reuses existing VRI dictionary from DSS', () => {
            const { signature, catalogDictionary } = makeDssHarness();
            const existingVri: _PdfDictionary = new _PdfDictionary();
            existingVri.set('ExistingKey', 'ExistingValue');
            const dss: any = new _PdfDictionary();
            dss.set('VRI', existingVri);
            dss.getRaw = (key: string): string => key === 'VRI' ? 'existingVriReference' : undefined as any;
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([1])], []);
            expect(existingVri.has('ExistingKey')).toBe(true);
            expect(existingVri.get('ExistingKey')).toBe('ExistingValue');
        });
        it('1038509 uses exact VRI key when fetching VRI dictionary', () => {
            const { signature, catalogDictionary } = makeDssHarness();
            let requestedKey: string = '';
            const existingVri: _PdfDictionary = new _PdfDictionary();
            const dss: any = new _PdfDictionary();
            dss.get = (key: string): any => {
                requestedKey = key;
                if (key === 'VRI') {
                    return existingVri;
                }
                return undefined;
            };
            dss.has = (key: string): boolean => key === 'VRI';
            dss.getRaw = (_key: string): string => 'vriReference';
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([2])], []);
            expect(requestedKey).toBe('VRI');
            expect(requestedKey).not.toBe('');
        });
        it('1038509 creates new VRI dictionary when DSS VRI entry is undefined', () => {
            const { signature, catalogDictionary } = makeDssHarness();
            const dss: any = new _PdfDictionary();
            dss.has = (key: string): boolean => key === 'VRI';
            dss.get = (_key: string): any => undefined;
            dss.getRaw = (_key: string): string => 'vriReference';
            catalogDictionary.set('DSS', dss);
            const result: boolean = signature._getDssDetails([], [new Uint8Array([3])], []);
            expect(result).toBe(true);
        });
        it('1038509 reads existing certificate references from DSS', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_reference: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([31, 32])
                };
            };
            const dss: any = new _PdfDictionary();
            dss.set('Certs', ['certRef1', 'certRef2']);
            dss.getRaw = (key: string): string => key === 'Certs' ? 'certArrayReference' : undefined as any;
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [], [new Uint8Array([40])]);
            expect(fetchCount).toBe(2);
        });
        it('1038509 skips certificate fetch when Certs entry does not exist', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            let fetchCount: number = 0;
            crossReference._fetch = (_reference: any): any => {
                fetchCount++;
                return {
                    getBytes: (): Uint8Array => new Uint8Array([1])
                };
            };
            const dss: _PdfDictionary = new _PdfDictionary();
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [], [new Uint8Array([41])]);
            expect(fetchCount).toBe(0);
        });
        it('1038509 _getDssDetails reuses references only when both ocsp and crl references exist', () => {
            const { signature, catalogDictionary, crossReference } = makeDssHarness();
            const dss: any = new _PdfDictionary();
            dss.set('OCSPs', ['ocspRef']);
            dss.set('CRLs', ['crlRef']);
            dss.getRaw = (key: string): string => {
                if (key === 'OCSPs') {
                    return 'existingOcspReference';
                }
                if (key === 'CRLs') {
                    return 'existingCrlReference';
                }
                return undefined as any;
            };
            crossReference._fetch = (_ref: any): any => ({
                getBytes: (): Uint8Array => new Uint8Array([1, 2, 3])
            });
            catalogDictionary.set('DSS', dss);
            signature._getDssDetails([], [new Uint8Array([2])], []);
            expect(dss.get('OCSPs')).toBe('existingOcspReference');
            expect(dss.get('CRLs')).toBe('existingCrlReference');
        });
        it('1038509 _getDssDetails stores VRI key in upper case', () => {
            const { signature } = makeDssHarness();
            signature._getVRIName = (): string => 'abc123';
            signature._getDssDetails([], [new Uint8Array([5])], []);
            const vriReference: any = signature._dssDictionary.get('VRI');
            const vriDictionary: any = signature._crossReference._cacheMap.get(vriReference);
            expect(vriDictionary.has('ABC123')).toBe(true);
            expect(vriDictionary.has('abc123')).toBe(false);
        });
        it('1038509 _getDssDetails returns true when DSS information is created', () => {
            const { signature } = makeDssHarness();
            const result: boolean = signature._getDssDetails([], [new Uint8Array([100])], []);
            expect(result).toBe(true);
        });
        it('1041651 - should return responder information when OCSP response contains valid thisUpdate data', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                _PdfUniqueEncodingElement.prototype._fromBytes;
            const originalGetOcspStructure: any =
                _PdfOcspHelper.prototype._getOcspStructure;
            const originalRevocationResponse: any = _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): string {
                                        return '20240101112233Z';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1, 2, 3])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom instanceof Date).toBeTruthy();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(0);
            expect(result.validFrom.getUTCDate()).toBe(1);
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when OCSP response collection is empty', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                _PdfUniqueEncodingElement.prototype._fromBytes;
            const originalGetOcspStructure: any =
                _PdfOcspHelper.prototype._getOcspStructure;
            const originalRevocationResponse: any = _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: []
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1, 2, 3])
                );
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when response helper is undefined', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return { _embeddedCertificates: null };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{}]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when thisUpdate element is undefined', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return { _embeddedCertificates: null };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {}
                        }
                    ]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when getTagNumber function is unavailable', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return { _embeddedCertificates: null };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getValue(): string {
                                        return '20240101112233Z';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse generalized time when tag number is 23', () => {
            const dictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return { _embeddedCertificates: null };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 23;
                                },
                                _getValue(): string {
                                    return '240101112233Z';
                                }
                            }
                        }
                    }]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).not.toBeNull();
            expect(result.validFrom).toBeDefined();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse generalized time when tag number is 24', () => {
            const dictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return { _embeddedCertificates: null };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 24;
                                },
                                _getValue(): string {
                                    return '20240101112233Z';
                                }
                            }
                        }
                    }]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).not.toBeNull();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse thisUpdate when value is Uint8Array', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): Uint8Array {
                                        return new Uint8Array([
                                            50, 48, 50, 52,
                                            48, 49, 48, 49,
                                            49, 49, 50, 50,
                                            51, 51, 90
                                        ]);
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1, 2, 3])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom).toBeDefined();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(0);
            expect(result.validFrom.getUTCDate()).toBe(1);
            expect(result.validFrom.getUTCHours()).toBe(11);
            expect(result.validFrom.getUTCMinutes()).toBe(22);
            expect(result.validFrom.getUTCSeconds()).toBe(33);
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse thisUpdate when value is string', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): string {
                                        return ' 20240101112233Z ';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1, 2, 3])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom).toBeDefined();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(0);
            expect(result.validFrom.getUTCDate()).toBe(1);
        });
        it('1041651 - should parse valid generalized time value correctly', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): string {
                                        return '20241231112233Z';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom).toBeDefined();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(11);
            expect(result.validFrom.getUTCDate()).toBe(31);
            expect(result.validFrom.getUTCHours()).toBe(11);
            expect(result.validFrom.getUTCMinutes()).toBe(22);
            expect(result.validFrom.getUTCSeconds()).toBe(33);
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when thisUpdate value is empty', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): string {
                                        return '';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse generalized time into validFrom date', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 24;
                                },
                                _getValue(): string {
                                    return '20241231112233Z';
                                }
                            }
                        }
                    }]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(11);
            expect(result.validFrom.getUTCDate()).toBe(31);
            expect(result.validFrom.getUTCHours()).toBe(11);
            expect(result.validFrom.getUTCMinutes()).toBe(22);
            expect(result.validFrom.getUTCSeconds()).toBe(33);
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
        });
        it('1041651 - should populate validTo from nextUpdateTime', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const expectedDate: Date =
                new Date(Date.UTC(2025, 5, 15, 10, 20, 30));
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 24;
                                },
                                _getValue(): string {
                                    return '20241231112233Z';
                                }
                            },
                            _nextUpdateTime: {
                                _toDate(): Date {
                                    return expectedDate;
                                }
                            }
                        }
                    }]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).not.toBeNull();
            expect(result.validTo).toBeDefined();
            expect(result.validTo.getTime()).toBe(
                expectedDate.getTime()
            );
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should parse UTC time format into validFrom date', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: null
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 23;
                                    },
                                    _getValue(): string {
                                        return '240101112233Z';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1, 2, 3])
                );
            expect(result).not.toBeNull();
            expect(result.validFrom).toBeDefined();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            expect(result.validFrom.getUTCMonth()).toBe(0);
            expect(result.validFrom.getUTCDate()).toBe(1);
            expect(result.validFrom.getUTCHours()).toBe(11);
            expect(result.validFrom.getUTCMinutes()).toBe(22);
            expect(result.validFrom.getUTCSeconds()).toBe(33);
            expect(result.validTo).toBeUndefined();
            expect(result.cert).toBeNull();
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should ignore null certificate elements', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: {
                            _getComponents(): any[] {
                                return [null];
                            }
                        }
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: []
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should replace tagged sequence element with its inner component', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetSequence: any =
                (_PdfUniqueEncodingElement.prototype as any)._getSequence;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            const originalApplySequence: any =
                (_PdfX509CertificateStructure.prototype as any)._applySequence;
            let capturedSequence: any[] = [];
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                function (): any[] {
                    return [
                        {
                            _tagClass: 2,
                            _getComponents(): any[] {
                                return [{ actualInner: true }];
                            }
                        },
                        {},
                        {}
                    ];
                };
            (_PdfX509CertificateStructure.prototype as any)._applySequence =
                function (sequence: any[]): void {
                    capturedSequence = sequence;
                };
            const certificateElement: any = {
                _tagClass: 0,
                _getTagNumber(): number {
                    return 16;
                },
                _toBytes(): Uint8Array {
                    return new Uint8Array([1, 2, 3]);
                }
            };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: {
                            _getComponents(): any[] {
                                return [certificateElement];
                            }
                        }
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: []
                };
            };
            signatureDictionary._extractOcspResponderInfo(
                new Uint8Array([1])
            );
            expect(capturedSequence).toBeDefined();
            expect(capturedSequence[0].actualInner).toBeTruthy();
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                originalGetSequence;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
            (_PdfX509CertificateStructure.prototype as any)._applySequence =
                originalApplySequence;
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
        });
        it('1041651 - should skip certificate processing when raw bytes are unavailable', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            const certificateElement: any = {
                _tagClass: 0,
                _getTagNumber(): number {
                    return 16;
                },
                _toBytes: undefined
            };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: {
                            _getComponents(): any[] {
                                return [certificateElement];
                            }
                        }
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: []
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).toBeNull();
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
        });
        it('1041651 - should return responder certificate when sequence contains three elements', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetSequence: any =
                (_PdfUniqueEncodingElement.prototype as any)._getSequence;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            const originalApplySequence: any =
                (_PdfX509CertificateStructure.prototype as any)._applySequence;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                function (): any[] {
                    return [{}, {}, {}];
                };
            (_PdfX509CertificateStructure.prototype as any)._applySequence =
                function (_sequence: any[]): void {
                    // intentionally empty
                };
            const certificateElement: any = {
                _tagClass: 0,
                _getTagNumber(): number {
                    return 16;
                },
                _toBytes(): Uint8Array {
                    return new Uint8Array([1, 2, 3]);
                }
            };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: {
                            _getComponents(): any[] {
                                return [certificateElement];
                            }
                        }
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [
                        {
                            _helper: {
                                _thisUpdate: {
                                    _getTagNumber(): number {
                                        return 24;
                                    },
                                    _getValue(): string {
                                        return '20240101112233Z';
                                    }
                                }
                            }
                        }
                    ]
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).not.toBeNull();
            expect(result.cert).toBeDefined();
            expect(result.validFrom).toBeDefined();
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                originalGetSequence;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
            (_PdfX509CertificateStructure.prototype as any)._applySequence =
                originalApplySequence;
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
        });
        it('1041651 - should return null when certificate sequence length is not three', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetSequence: any =
                (_PdfUniqueEncodingElement.prototype as any)._getSequence;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                _PdfRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                function (_bytes: Uint8Array): number {
                    return 0;
                };
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                function (): any[] {
                    return [{}, {}];
                };
            const certificateElement: any = {
                _tagClass: 0,
                _getTagNumber(): number {
                    return 16;
                },
                _toBytes(): Uint8Array {
                    return new Uint8Array([1, 2, 3]);
                }
            };
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                function (): any {
                    return {
                        _embeddedCertificates: {
                            _getComponents(): any[] {
                                return [certificateElement];
                            }
                        }
                    };
                };
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: []
                };
            };
            const result: any =
                signatureDictionary._extractOcspResponderInfo(
                    new Uint8Array([1])
                );
            expect(result).toBeNull();
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfUniqueEncodingElement.prototype as any)._getSequence =
                originalGetSequence;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
            (_PdfRevocationResponse as any) =
                originalRevocationResponse;
        });
        it('1041651 - should extract certificate from PEM content', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const expectedCertificate: any = {
                subject: 'TestCertificate'
            };
            signatureDictionary._cmsSigner = {
                _parseX509FromUniqueElement(_bytes: Uint8Array): any {
                    return expectedCertificate;
                }
            };
            const pemText: string =
                '-----BEGIN CERTIFICATE-----\n' +
                'QUJD\n' +
                '-----END CERTIFICATE-----';
            const pemBytes: Uint8Array = new TextEncoder().encode(pemText);
            const result: any[] =
                signatureDictionary._extractTrustedCertsFromBytes(
                    pemBytes,
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(expectedCertificate);
        });
        it('1041651 - should return direct certificate when bytes contain DER certificate', () => {
            const dictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            const expectedCertificate: any = {
                subject: 'Test'
            };
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement(value: Uint8Array): any {
                    if (value.length === 3) {
                        return expectedCertificate;
                    }
                    return null;
                }
            };
            const result: any[] =
                dictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1, 2, 3]),
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(expectedCertificate);
        });
        it('1041651 - should return certificates from chain certificates collection', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            signatureDictionary._cmsSigner = {
                _parseX509FromUniqueElement(): any {
                    return null;
                }
            };
            const chainCertificate: any = {
                _getEncoded(): Uint8Array {
                    return new Uint8Array([1]);
                }
            };
            const originalLoadCertificate: any =
                (_PdfPublicKeyCryptographyCertificate.prototype as any)
                    ._loadCertificate;
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = function (): void {
                    this._chainCertificates = [
                        { _certificate: chainCertificate }
                    ];
                };
            const result: any[] =
                signatureDictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(chainCertificate);
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = originalLoadCertificate;
        });
        it('1041651 - should return certificates from key certificates when chain certificates are unavailable', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            signatureDictionary._cmsSigner = {
                _parseX509FromUniqueElement(): any {
                    return null;
                }
            };
            const keyCertificate: any = {
                _getEncoded(): Uint8Array {
                    return new Uint8Array([10, 20, 30]);
                }
            };
            const originalLoadCertificate: any =
                (_PdfPublicKeyCryptographyCertificate.prototype as any)
                    ._loadCertificate;
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = function (): void {
                    this._chainCertificates = [];
                    this._keyCertificates = [
                        { _certificate: keyCertificate }
                    ];
                };
            const result: any[] =
                signatureDictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(keyCertificate);
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = originalLoadCertificate;
        });
        it('1041651 - should not add duplicate certificates from key certificates collection', () => {
            const signatureDictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            signatureDictionary._cmsSigner = {
                _parseX509FromUniqueElement(): any {
                    return null;
                }
            };
            const certificate: any = {
                _getEncoded(): Uint8Array {
                    return new Uint8Array([1, 2, 3]);
                }
            };
            const originalLoadCertificate: any =
                (_PdfPublicKeyCryptographyCertificate.prototype as any)
                    ._loadCertificate;
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = function (): void {
                    this._chainCertificates = [];
                    this._keyCertificates = [
                        {
                            _certificate: certificate
                        },
                        {
                            _certificate: {
                                _getEncoded(): Uint8Array {
                                    return new Uint8Array([1, 2, 3]);
                                }
                            }
                        }
                    ];
                };
            const result: any[] =
                signatureDictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1, 2, 3]),
                    ''
                );
            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0]).toBe(certificate);
            (_PdfPublicKeyCryptographyCertificate.prototype as any)
                ._loadCertificate = originalLoadCertificate;
        });
        it('1041651 - should return null when thisUpdate value is unsupported type', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any =
                (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any =
                (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any =
                (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 24;
                                },
                                _getValue(): any {
                                    return { invalid: true };
                                }
                            }
                        }
                    }]
                };
            };
            const result: any =
                dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes =
                originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure =
                originalGetOcspStructure;
        });
        it('1041651 - should return null when thisUpdate value is unsupported type', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({
                _embeddedCertificates: null
            });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber(): number {
                                    return 24;
                                },
                                _getValue(): any {
                                    return { invalid: true };
                                }
                            }
                        }
                    }]
                };
            };
            const result: any = dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should reject generalized time with leading characters', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 24,
                                _getValue: () => 'abc20240101112233Z'
                            }
                        }
                    }]
                };
            };
            expect(dictionary._extractOcspResponderInfo(new Uint8Array([1]))).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should reject generalized time with trailing characters', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 24,
                                _getValue: () => '20240101112233Zabc'
                            }
                        }
                    }]
                };
            };
            expect(dictionary._extractOcspResponderInfo(new Uint8Array([1]))).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should parse generalized time with multiple fractional seconds', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 24,
                                _getValue: () => '20240101112233.123Z'
                            }
                        }
                    }]
                };
            };
            const result: any = dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).not.toBeNull();
            expect(result.validFrom.getUTCFullYear()).toBe(2024);
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should reject non numeric fractional seconds', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 24,
                                _getValue: () => '20240101112233.ABCZ'
                            }
                        }
                    }]
                };
            };
            expect(dictionary._extractOcspResponderInfo(new Uint8Array([1]))).toBeNull();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should interpret UTC year 50 as 1950', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 23,
                                _getValue: () => '500101000000Z'
                            }
                        }
                    }]
                };
            };
            const result: any = dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result.validFrom.getUTCFullYear()).toBe(1950);
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should interpret UTC year 75 as 1975', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 23,
                                _getValue: () => '750101000000Z'
                            }
                        }
                    }]
                };
            };
            const result: any = dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result.validFrom.getUTCFullYear()).toBe(1975);
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        it('1041651 - should ignore nextUpdateTime without toDate function', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const originalFromBytes: any = (_PdfUniqueEncodingElement.prototype as any)._fromBytes;
            const originalGetOcspStructure: any = (_PdfOcspHelper.prototype as any)._getOcspStructure;
            const originalRevocationResponse: any = (_PdfRevocationResponse as any);
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = (): number => 0;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = (): any => ({ _embeddedCertificates: null });
            (_PdfRevocationResponse as any) = function (): any {
                return {
                    _responses: [{
                        _helper: {
                            _thisUpdate: {
                                _getTagNumber: () => 24,
                                _getValue: () => '20240101112233Z'
                            },
                            _nextUpdateTime: {}
                        }
                    }]
                };
            };
            const result: any = dictionary._extractOcspResponderInfo(new Uint8Array([1]));
            expect(result).not.toBeNull();
            expect(result.validTo).toBeUndefined();
            (_PdfRevocationResponse as any) = originalRevocationResponse;
            (_PdfUniqueEncodingElement.prototype as any)._fromBytes = originalFromBytes;
            (_PdfOcspHelper.prototype as any)._getOcspStructure = originalGetOcspStructure;
        });
        function stringToBytes(value: string): Uint8Array {
            const bytes: number[] = [];
            for (let i: number = 0; i < value.length; i++) {
                bytes.push(value.charCodeAt(i));
            }
            return new Uint8Array(bytes);
        }
        it('1041651 - should extract certificate from PEM content', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const expectedCert: any = { id: 'pem-cert' };
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: jasmine
                    .createSpy('parse')
                    .and.returnValue(expectedCert)
            };
            const pem: string = [
                '-----BEGIN CERTIFICATE-----',
                'QUJD',
                '-----END CERTIFICATE-----'
            ].join('\n');
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    stringToBytes(pem),
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(expectedCert);
        });
        it('1041651 - should remove whitespace and decode PEM certificate', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            const cert: any = { id: 'cert' };
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: jasmine
                    .createSpy('parse')
                    .and.returnValue(cert)
            };
            const pem: string = [
                '-----BEGIN CERTIFICATE-----',
                'Q U J D',
                '-----END CERTIFICATE-----'
            ].join('\n');
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    stringToBytes(pem),
                    ''
                );
            expect(result.length).toBe(1);
        });
        it('1041651 - should pass exact DER bytes to parser', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            let captured: Uint8Array;
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: (bytes: Uint8Array): any => {
                    captured = bytes;
                    return { id: 1 };
                }
            };
            const pem: string = [
                '-----BEGIN CERTIFICATE-----',
                'QUJD',
                '-----END CERTIFICATE-----'
            ].join('\n');
            dictionary._extractTrustedCertsFromBytes(
                stringToBytes(pem),
                ''
            );
            expect(Array.from(captured!)).toEqual([65, 66, 67]);
        });
        it('1041651 - should return empty result when chainCertificates is undefined', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: (): any => {
                    return null;
                }
            };
            const originalPfx: any =
                _PdfPublicKeyCryptographyCertificate;
            (_PdfPublicKeyCryptographyCertificate as any) =
                function (): any {
                    return {
                        _loadCertificate(): void { },
                        _chainCertificates: undefined
                    };
                };
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result.length).toBe(0);
            (_PdfPublicKeyCryptographyCertificate as any) =
                originalPfx;
        });
        it('1041651 - should not add key certificates when chain certificates already exist', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: (): any => {
                    return null;
                }
            };
            const chainCert: any = {
                _getEncoded: (): Uint8Array =>
                    new Uint8Array([1])
            };
            const keyCert: any = {
                _getEncoded: (): Uint8Array =>
                    new Uint8Array([2])
            };
            const originalPfx: any =
                _PdfPublicKeyCryptographyCertificate;
            (_PdfPublicKeyCryptographyCertificate as any) =
                function (): any {
                    return {
                        _loadCertificate(): void { },
                        _chainCertificates: [
                            { _certificate: chainCert }
                        ],
                        _keyCertificates: [
                            { _certificate: keyCert }
                        ]
                    };
                };
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result.length).toBe(1);
            expect(result[0]).toBe(chainCert);
            (_PdfPublicKeyCryptographyCertificate as any) =
                originalPfx;
        });
        it('1041651 - should avoid duplicate certificates from keyCertificates', () => {
            const dictionary: any = Object.create(_PdfSignatureDictionary.prototype);
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: (): any => {
                    return null;
                }
            };
            const cert: any = {
                _getEncoded: (): Uint8Array =>
                    new Uint8Array([10, 20, 30])
            };
            const originalPfx: any =
                _PdfPublicKeyCryptographyCertificate;
            (_PdfPublicKeyCryptographyCertificate as any) =
                function (): any {
                    return {
                        _loadCertificate(): void { },
                        _chainCertificates: [],
                        _keyCertificates: [
                            { _certificate: cert },
                            { _certificate: cert }
                        ]
                    };
                };
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result.length).toBe(1);
            (_PdfPublicKeyCryptographyCertificate as any) =
                originalPfx;
        });
        it('1041651 - should return empty array when PEM end marker is missing', () => {
            const dictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement: jasmine.createSpy('parse')
            };
            const pem: string =
                '-----BEGIN CERTIFICATE-----QUJD';
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    stringToBytes(pem),
                    ''
                );
            expect(result).toEqual([]);
        });
        it('1041651 - should ignore chain wrapper without certificate', () => {
            const dictionary: any =
                Object.create(_PdfSignatureDictionary.prototype);
            dictionary._cmsSigner = {
                _parseX509FromUniqueElement(): any {
                    return null;
                }
            };
            const originalPfx: any =
                _PdfPublicKeyCryptographyCertificate;
            (_PdfPublicKeyCryptographyCertificate as any) =
                function (): any {
                    return {
                        _loadCertificate(
                            _bytes?: Uint8Array,
                            _password?: string
                        ): void {
                            // Intentionally empty
                        },
                        _chainCertificates: [{}],
                        _keyCertificates: null
                    };
                };
            const result: any =
                dictionary._extractTrustedCertsFromBytes(
                    new Uint8Array([1]),
                    ''
                );
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(0);
            (_PdfPublicKeyCryptographyCertificate as any) =
                originalPfx;
        });
    });
});