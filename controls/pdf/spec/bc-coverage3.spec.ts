import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _ConstructionType, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";

describe('_PdfBasicEncodingElement - _fromBytes coverage', () => {
    function _createLengthShimForInitialLongTagTruncation(): Uint8Array {
        let lengthReadCount: number = 0;
        const fakeBytes: {
            0: number;
            1: number;
            length?: number;
        } = {
            0: 0x1f, // universal primitive + long-form tag number
            1: 0x00
        };

        Object.defineProperty(fakeBytes, 'length', {
            configurable: true,
            enumerable: false,
            get: (): number => {
                lengthReadCount++;
                return (lengthReadCount === 1) ? 2 : 1;
            }
        });

        return fakeBytes as unknown as Uint8Array;
    }

    it('should cover the initially-unreachable truncated long-tag branch using a safe length shim', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        expect((): number => element._fromBytes(_createLengthShimForInitialLongTagTruncation()))
            .toThrowError('ASN1 tag number appears to have been truncated.');
    });

    it('should throw for a leading padding byte on long tag number encoding', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x1f => long-form tag number indicator
        // 0x80 => illegal leading padding byte for long tag number
        const bytes: Uint8Array = new Uint8Array([0x1f, 0x80]);

        expect((): number => element._fromBytes(bytes))
            .toThrowError('Leading padding byte on long tag number encoding.');
    });

    it('should throw when a long tag number is truncated inside the continuation loop', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x81 keeps the continuation bit set, but there is no following byte.
        const bytes: Uint8Array = new Uint8Array([0x1f, 0x81]);

        expect((): number => element._fromBytes(bytes))
            .toThrowError('ASN1 tag number appears to have been truncated.');
    });

    it('should throw when a long-form tag encodes a value that should have used short form', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // long-form tag decodes to 30, which should have been encoded in short form
        // third byte is a valid zero length so execution reaches the specific branch
        const bytes: Uint8Array = new Uint8Array([0x1f, 0x1e, 0x00]);

        expect((): number => element._fromBytes(bytes))
            .toThrowError('ASN1 tag number could have been encoded in short form.');
    });

    it('should decode a valid long-form tag number successfully', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x1f => universal primitive long tag
        // 0x20 => tag number 32 (valid long-form tag > 30)
        // 0x00 => length 0
        const bytes: Uint8Array = new Uint8Array([0x1f, 0x20, 0x00]);
        const consumed: number = element._fromBytes(bytes);

        expect(consumed).toBe(3);
        expect(element._getTagNumber()).toBe(32);
    });

    it('should cover application tag class in _fromBytes switch', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x40 => application class, primitive, tag 0
        const bytes: Uint8Array = new Uint8Array([0x40, 0x00]);
        const consumed: number = element._fromBytes(bytes);

        expect(consumed).toBe(2);
        expect((element as any)._tagClass).toBe(_TagClassType.application);
        expect((element as any)._construction).toBe(_ConstructionType.primitive);
        expect(element._getTagNumber()).toBe(0);
    });

    it('should cover context tag class in _fromBytes switch', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x80 => context class, primitive, tag 0
        const bytes: Uint8Array = new Uint8Array([0x80, 0x00]);
        const consumed: number = element._fromBytes(bytes);

        expect(consumed).toBe(2);
        expect((element as any)._tagClass).toBe(_TagClassType.context);
        expect((element as any)._construction).toBe(_ConstructionType.primitive);
        expect(element._getTagNumber()).toBe(0);
    });

    it('should cover private tag class in _fromBytes switch', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0xC0 => private class, primitive, tag 0
        const bytes: Uint8Array = new Uint8Array([0xC0, 0x00]);
        const consumed: number = element._fromBytes(bytes);

        expect(consumed).toBe(2);
        expect((element as any)._tagClass).toBe(_TagClassType.abstractSyntaxPrivate);
        expect((element as any)._construction).toBe(_ConstructionType.primitive);
        expect(element._getTagNumber()).toBe(0);
    });

    it('should cover constructed decoding path together with non-universal tag class', () => {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x7f => application class + constructed + long-form tag
        // 0x20 => tag number 32
        // 0x00 => length 0
        const bytes: Uint8Array = new Uint8Array([0x7f, 0x20, 0x00]);
        const consumed: number = element._fromBytes(bytes);

        expect(consumed).toBe(3);
        expect((element as any)._tagClass).toBe(_TagClassType.application);
        expect((element as any)._construction).toBe(_ConstructionType.constructed);
        expect(element._getTagNumber()).toBe(32);
    });

    it('should safely use _PdfAbstractSyntaxElement import without leaving it unused', () => {
        const child: _PdfAbstractSyntaxElement = new _PdfBasicEncodingElement();
        const parent: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        parent._setInner(child);
        const inner: _PdfAbstractSyntaxElement = parent._getInner();

        expect(inner).toBe(child);
    });
});

import { PdfSignature } from '../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { CryptographicStandard, DigestAlgorithm } from '../src/pdf/core/enumerator';

// Import dependency modules as namespaces so constructor/function spies can be attached safely.
import * as pdfDocumentModule from '../src/pdf/core/pdf-document';
import * as x509ParserModule from '../src/pdf/core/security/digital-signature/x509/x509-certificate-parser';
import { Save } from '@syncfusion/ej2-file-utils'
import * as privateKeyModule  from '../src/pdf/core/security/digital-signature/signature/signature-privatekey';``
import * as signerModule from '../src/pdf/core/security/digital-signature/signature/cryptographic-signer';

describe('PdfSignature - replaceEmptySignature branch coverage', () => {

    let originalPdfDocument: any;
    let originalParser: any;
    let originalPrivateKey: any;
    let originalSigner: any;

    beforeAll(() => {
        // Preserve originals in case the environment keeps state between suites.
        originalPdfDocument = (pdfDocumentModule as any).PdfDocument;
        originalParser = (x509ParserModule as any)._PdfX509CertificateParser;
        originalPrivateKey = (privateKeyModule as any)._PdfSignaturePrivateKey;
        originalSigner = (signerModule as any)._PdfCryptographicMessageSyntaxSigner;
    });

    afterEach(() => {
        // Restore all spies after each test to avoid cross-test pollution.
        jasmine.getEnv().allowRespy(true);
    });

    afterAll(() => {
        // Restore original references if needed by later suites.
        (pdfDocumentModule as any).PdfDocument = originalPdfDocument;
        (x509ParserModule as any)._PdfX509CertificateParser = originalParser;
        (privateKeyModule as any)._PdfSignaturePrivateKey = originalPrivateKey;
        (signerModule as any)._PdfCryptographicMessageSyntaxSigner = originalSigner;
    });

    function createDictionaryStore(initial?: Record<string, any>): any {
        const store: Record<string, any> = initial ? { ...initial } : {};
        return {
            _updated: false,
            objId: store.objId,
            has(key: string): boolean {
                return Object.prototype.hasOwnProperty.call(store, key);
            },
            get(key: string): any { // eslint-disable-line
                return store[key];
            },
            getArray(key: string): any { // eslint-disable-line
                return store[key];
            },
            update(key: string, value: any): void { // eslint-disable-line
                store[key] = value;
            },
            set(key: string, value: any): void { // eslint-disable-line
                store[key] = value;
            }
        };
    }

    function wireConstructorSpies(fakeDocument: any, signedContent: Uint8Array): void { // eslint-disable-line
        (pdfDocumentModule as any).PdfDocument = jasmine.createSpy('PdfDocument').and.callFake(function(): any {
            return fakeDocument;
        });

        (x509ParserModule as any)._PdfX509CertificateParser = jasmine.createSpy('_PdfX509CertificateParser')
            .and.callFake(function(): any {
                return {
                    _readCertificate: jasmine.createSpy('_readCertificate').and.callFake((data: Uint8Array): any => {
                        return { raw: data, subjectName: 'CN=Test' };
                    })
                };
            });

        (privateKeyModule as any)._PdfSignaturePrivateKey = jasmine.createSpy('_PdfSignaturePrivateKey')
            .and.callFake(function(hashAlgorithm: string): any {
                return {
                    _hashAlgorithm: hashAlgorithm,
                    _getEncryptionAlgorithm: jasmine.createSpy('_getEncryptionAlgorithm').and.returnValue('rsa')
                };
            });

        (signerModule as any)._PdfCryptographicMessageSyntaxSigner =
            jasmine.createSpy('_PdfCryptographicMessageSyntaxSigner')
                .and.callFake(function(): any {
                    return {
                        _getDigestAlgorithm: jasmine.createSpy('_getDigestAlgorithm').and.returnValue({
                            _digest: jasmine.createSpy('_digest').and.callFake((combined: Uint8Array): Uint8Array => {
                                return new Uint8Array([combined.length & 0xff, 0xaa, 0xbb, 0xcc]);
                            })
                        }),
                        _setSignedData: jasmine.createSpy('_setSignedData').and.stub(),
                        _sign: jasmine.createSpy('_sign').and.returnValue(signedContent)
                    };
                });
    }

    function createFakeEnvironment(
        signatureNameToFind: string,
        innerSignatureDictionary: any,
        includeSecondField: boolean = true
    ): any { // eslint-disable-line
        const nonMatchingField: any = {
            name: 'OtherSignature',
            _dictionary: createDictionaryStore()
        };

        const matchingField: any = {
            name: signatureNameToFind,
            _dictionary: createDictionaryStore({
                V: innerSignatureDictionary
            })
        };

        const fields: any[] = includeSecondField ? [nonMatchingField, matchingField] : [matchingField];

        const form: any = {
            count: fields.length,
            fieldAt: jasmine.createSpy('fieldAt').and.callFake((index: number): any => fields[index])
        };

        const fakeDocument: any = {
            form,
            destroy: jasmine.createSpy('destroy').and.stub()
        };

        return {
            form,
            field: matchingField,
            fakeDocument
        };
    }

    it('should replace empty signature and return modified PDF data for options object path, CAdES path, and padding branch', () => {
        const inputPdfData: Uint8Array = new Uint8Array(200);
        const signedData: Uint8Array = new Uint8Array([1, 2, 3, 4]);

        const innerSignatureDictionary: any = createDictionaryStore({
            ByteRange: [0, 10, 40, 160],
            SubFilter: { name: 'ETSI.CAdES.detached' }
        });

        const env: any = createFakeEnvironment('Signature1', innerSignatureDictionary, true);

        wireConstructorSpies(env.fakeDocument, new Uint8Array([0xde, 0xad, 0xbe, 0xef]));

        const saveSpy: jasmine.Spy = spyOn(Save, 'save').and.stub();

        let result: Uint8Array;
        expect((): void => {
            result = PdfSignature.replaceEmptySignature(
                inputPdfData,
                'Signature1',
                signedData,
                DigestAlgorithm.sha256,
                [
                    new Uint8Array(0),         // covers the false branch of inner certificate-length condition
                    new Uint8Array([10, 20])   // covers the true branch
                ],
                {
                    password: '123',
                    skipSignatureEncoding: false
                }
            ) as Uint8Array;
        }).not.toThrow();

        expect(result).toBeDefined();
        expect(result instanceof Uint8Array).toBe(true);
        expect(result.length).toBe(200);

        // Return branch should be taken, not Save.save branch.
        expect(saveSpy).not.toHaveBeenCalled();

        // Signature delimiters should be written.
        expect(result[10]).toBe('<'.charCodeAt(0) & 0xff);
        expect(result[39]).toBe('>'.charCodeAt(0) & 0xff);

        // Padding branch should execute because there is remaining allocated space.
        expect(result[19]).toBe('0'.charCodeAt(0) & 0xff);

        expect(env.fakeDocument.destroy).toHaveBeenCalled();
        expect(env.form.fieldAt).toHaveBeenCalled();
    });

    it('should save the PDF when output file name is provided and should cover the arg6 string branch', () => {
        const inputPdfData: Uint8Array = new Uint8Array(220);
        const signedData: Uint8Array = new Uint8Array([9, 8, 7]);

        const innerSignatureDictionary: any = createDictionaryStore({
            ByteRange: [0, 20, 60, 160],
            SubFilter: { name: 'adbe.pkcs7.detached' }
        });

        const env: any = createFakeEnvironment('MySignature', innerSignatureDictionary, false);

        wireConstructorSpies(env.fakeDocument, new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]));

        const saveSpy: jasmine.Spy = spyOn(Save, 'save').and.stub();

        expect((): void => {
            PdfSignature.replaceEmptySignature(
                inputPdfData,
                'MySignature',
                signedData,
                DigestAlgorithm.sha256,
                [new Uint8Array([1, 1, 1])],
                'signed_output.pdf',
                {
                    password: 'owner-password',
                    skipSignatureEncoding: false
                }
            );
        }).not.toThrow();

        expect(saveSpy).toHaveBeenCalled();
        expect(saveSpy.calls.argsFor(0)[0]).toBe('signed_output.pdf');
        expect(env.fakeDocument.destroy).toHaveBeenCalled();
    });

    it('should return original bytes unchanged when signature dictionary does not contain V', () => {
        const inputPdfData: Uint8Array = new Uint8Array(90);
        inputPdfData[0] = 25;
        const signedData: Uint8Array = new Uint8Array([5, 5]);

        const fieldWithoutV: any = {
            name: 'SigNoV',
            _dictionary: createDictionaryStore()
        };

        const form: any = {
            count: 1,
            fieldAt: jasmine.createSpy('fieldAt').and.returnValue(fieldWithoutV)
        };

        const fakeDocument: any = {
            form,
            destroy: jasmine.createSpy('destroy').and.stub()
        };

        wireConstructorSpies(fakeDocument, new Uint8Array([1, 2, 3, 4]));
        const saveSpy: jasmine.Spy = spyOn(Save, 'save').and.stub();

        let result: Uint8Array;
        expect((): void => {
            result = PdfSignature.replaceEmptySignature(
                inputPdfData,
                'SigNoV',
                signedData,
                DigestAlgorithm.sha256,
                [new Uint8Array([2, 2])]
            ) as Uint8Array;
        }).not.toThrow();

        expect(result).toBe(inputPdfData);
        expect(result[0]).toBe(25);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(fakeDocument.destroy).toHaveBeenCalled();
    });

    it('should return original bytes unchanged when ByteRange has fewer than 4 values', () => {
        const inputPdfData: Uint8Array = new Uint8Array(100);
        inputPdfData[5] = 77;
        const signedData: Uint8Array = new Uint8Array([8, 8, 8]);

        const innerSignatureDictionary: any = createDictionaryStore({
            ByteRange: [0, 10, 20]
        });

        const env: any = createFakeEnvironment('ShortRangeSignature', innerSignatureDictionary, false);

        wireConstructorSpies(env.fakeDocument, new Uint8Array([0x11, 0x22]));
        const saveSpy: jasmine.Spy = spyOn(Save, 'save').and.stub();

        let result: Uint8Array;
        expect((): void => {
            result = PdfSignature.replaceEmptySignature(
                inputPdfData,
                'ShortRangeSignature',
                signedData,
                DigestAlgorithm.sha256,
                [new Uint8Array([3, 3])]
            ) as Uint8Array;
        }).not.toThrow();

        expect(result).toBe(inputPdfData);
        expect(result[5]).toBe(77);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(env.fakeDocument.destroy).toHaveBeenCalled();
    });

    it('should use the no-options branch and still return modified bytes safely', () => {
        const inputPdfData: Uint8Array = new Uint8Array(180);
        const signedData: Uint8Array = new Uint8Array([6, 6, 6, 6]);

        const innerSignatureDictionary: any = createDictionaryStore({
            ByteRange: [0, 12, 36, 144]
            // No SubFilter here: covers the false path of signatureDict.has("SubFilter")
        });

        const env: any = createFakeEnvironment('NoOptionsSignature', innerSignatureDictionary, false);

        wireConstructorSpies(env.fakeDocument, new Uint8Array([0xfa, 0xfb, 0xfc, 0xfd]));
        const saveSpy: jasmine.Spy = spyOn(Save, 'save').and.stub();

        let result: Uint8Array;
        expect((): void => {
            result = PdfSignature.replaceEmptySignature(
                inputPdfData,
                'NoOptionsSignature',
                signedData,
                DigestAlgorithm.sha256,
                [new Uint8Array([4, 4, 4])]
            ) as Uint8Array;
        }).not.toThrow();

        expect(result).toBeDefined();
        expect(result instanceof Uint8Array).toBe(true);
        expect(result[12]).toBe('<'.charCodeAt(0) & 0xff);
        expect(result[35]).toBe('>'.charCodeAt(0) & 0xff);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(env.fakeDocument.destroy).toHaveBeenCalled();
    });
});


import * as signedCertificateModule from '../src/pdf/core/security/digital-signature/x509/x509-signed-certificate';
//src\pdf\core\security\digital-signature\x509\x509-signed-certificate.ts
import * as algorithmsModule from '../src/pdf/core/security/digital-signature/x509/x509-algorithm';
import * as bitStringModule from '../src/pdf/core/security/digital-signature/x509/x509-bit-string-handler';
import { _PdfX509CertificateStructure } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-structure";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";

describe('_PdfX509CertificateStructure', () => {

    let originalSignedCertificate: typeof signedCertificateModule._PdfSignedCertificate;
    let originalAlgorithms: typeof algorithmsModule._PdfAlgorithms;
    let originalUniqueBitString: typeof bitStringModule._PdfUniqueBitString;

    beforeAll(() => {
        originalSignedCertificate = signedCertificateModule._PdfSignedCertificate;
        originalAlgorithms = algorithmsModule._PdfAlgorithms;
        originalUniqueBitString = bitStringModule._PdfUniqueBitString;
    });

    afterEach(() => {
        // Restore constructor replacements after each test.
        Object.defineProperty(signedCertificateModule, '_PdfSignedCertificate', {
            value: originalSignedCertificate,
            configurable: true
        });
        Object.defineProperty(algorithmsModule, '_PdfAlgorithms', {
            value: originalAlgorithms,
            configurable: true
        });
        Object.defineProperty(bitStringModule, '_PdfUniqueBitString', {
            value: originalUniqueBitString,
            configurable: true
        });
    });

    /**
     * Creates a lightweight object that still satisfies
     * `instanceof _PdfAbstractSyntaxElement`.
     */
    function createAbstractSyntaxElement(value?: Uint8Array): _PdfAbstractSyntaxElement {
        const element: _PdfAbstractSyntaxElement = Object.create(_PdfAbstractSyntaxElement.prototype) as _PdfAbstractSyntaxElement;
        const data: Uint8Array = value ? value : new Uint8Array([1, 2, 3]);
        (element as { _getValue: () => Uint8Array })._getValue = (): Uint8Array => data;
        return element;
    }

    it('should construct successfully with a valid three-element sequence and return signed certificate', () => {
        const signedCertificateSpy: jasmine.Spy = jasmine.createSpy('_PdfSignedCertificate')
            .and.callFake(function(this: { source: _PdfAbstractSyntaxElement }, source: _PdfAbstractSyntaxElement): void {
                this.source = source;
            });
        const algorithmSpy: jasmine.Spy = jasmine.createSpy('_PdfAlgorithms')
            .and.callFake(function(this: { source: _PdfAbstractSyntaxElement }, source: _PdfAbstractSyntaxElement): void {
                this.source = source;
            });
        const uniqueBitStringSpy: jasmine.Spy = jasmine.createSpy('_PdfUniqueBitString')
            .and.callFake(function(this: { bytes: Uint8Array }, bytes: Uint8Array): void {
                this.bytes = bytes;
            });

        Object.defineProperty(signedCertificateModule, '_PdfSignedCertificate', {
            value: signedCertificateSpy,
            configurable: true
        });
        Object.defineProperty(algorithmsModule, '_PdfAlgorithms', {
            value: algorithmSpy,
            configurable: true
        });
        Object.defineProperty(bitStringModule, '_PdfUniqueBitString', {
            value: uniqueBitStringSpy,
            configurable: true
        });

        const first: _PdfAbstractSyntaxElement = createAbstractSyntaxElement(new Uint8Array([10]));
        const second: _PdfAbstractSyntaxElement = createAbstractSyntaxElement(new Uint8Array([20]));
        const third: _PdfAbstractSyntaxElement = createAbstractSyntaxElement(new Uint8Array([30, 31]));

        const sequence: _PdfAbstractSyntaxElement[] = [first, second, third];
        const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure(sequence);

        expect(structure).toBeDefined();
        expect(structure._sequence).toBe(sequence);

        expect(signedCertificateSpy).toHaveBeenCalledWith(first);
        expect(algorithmSpy).toHaveBeenCalledWith(second);
        expect(uniqueBitStringSpy).toHaveBeenCalledWith(new Uint8Array([30, 31]));

        expect(structure._getSignedCertificate()).toBe(structure._toBeSignedCertificate);
    });

    it('should throw the correct error for invalid certificate sequence length', () => {
        const invalidSequence: _PdfAbstractSyntaxElement[] = [
            createAbstractSyntaxElement(new Uint8Array([1])),
            createAbstractSyntaxElement(new Uint8Array([2]))
        ];

        expect((): _PdfX509CertificateStructure => new _PdfX509CertificateStructure(invalidSequence))
            .toThrowError('Invalid certificate sequence length: 2');
    });

    it('should return a new instance from _getInstance when every item is a _PdfAbstractSyntaxElement', () => {
        const signedCertificateSpy: jasmine.Spy = jasmine.createSpy('_PdfSignedCertificate')
            .and.callFake(function(this: { source: _PdfAbstractSyntaxElement }, source: _PdfAbstractSyntaxElement): void {
                this.source = source;
            });
        const algorithmSpy: jasmine.Spy = jasmine.createSpy('_PdfAlgorithms')
            .and.callFake(function(this: { source: _PdfAbstractSyntaxElement }, source: _PdfAbstractSyntaxElement): void {
                this.source = source;
            });
        const uniqueBitStringSpy: jasmine.Spy = jasmine.createSpy('_PdfUniqueBitString')
            .and.callFake(function(this: { bytes: Uint8Array }, bytes: Uint8Array): void {
                this.bytes = bytes;
            });

        Object.defineProperty(signedCertificateModule, '_PdfSignedCertificate', {
            value: signedCertificateSpy,
            configurable: true
        });
        Object.defineProperty(algorithmsModule, '_PdfAlgorithms', {
            value: algorithmSpy,
            configurable: true
        });
        Object.defineProperty(bitStringModule, '_PdfUniqueBitString', {
            value: uniqueBitStringSpy,
            configurable: true
        });

        const sequence: _PdfAbstractSyntaxElement[] = [
            createAbstractSyntaxElement(new Uint8Array([1])),
            createAbstractSyntaxElement(new Uint8Array([2])),
            createAbstractSyntaxElement(new Uint8Array([3]))
        ];

        const helper: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();
        const instance: _PdfX509CertificateStructure = helper._getInstance(sequence);

        expect(instance).toBeDefined();
        expect(instance instanceof _PdfX509CertificateStructure).toBe(true);
        expect(instance._sequence.length).toBe(3);
    });

    it('should return null from _getInstance for a non-matching object', () => {
        const helper: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();

        const invalidObject: unknown[] = [
            createAbstractSyntaxElement(new Uint8Array([1])),
            {},
            createAbstractSyntaxElement(new Uint8Array([3]))
        ];

        const result: _PdfX509CertificateStructure = helper._getInstance(invalidObject);

        expect(result).toBeNull();
    });

    it('should build DER encoding using universal constructed sequence settings', () => {
        const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();

        const sequence: _PdfAbstractSyntaxElement[] = [
            createAbstractSyntaxElement(new Uint8Array([1])),
            createAbstractSyntaxElement(new Uint8Array([2])),
            createAbstractSyntaxElement(new Uint8Array([3]))
        ];
        structure._sequence = sequence;

        const setTagNumberSpy: jasmine.Spy = spyOn(_PdfUniqueEncodingElement.prototype, '_setTagNumber').and.stub();
        const setSequenceSpy: jasmine.Spy = spyOn(_PdfUniqueEncodingElement.prototype, '_setSequence').and.stub();
        const toBytesSpy: jasmine.Spy = spyOn(_PdfUniqueEncodingElement.prototype, '_toBytes')
            .and.returnValue(new Uint8Array([48, 3, 1, 2, 3]));

        const result: Uint8Array = structure._getDerEncoded();

        expect(result).toEqual(new Uint8Array([48, 3, 1, 2, 3]));
        expect(setTagNumberSpy).toHaveBeenCalledWith(_UniversalType.sequence);
        expect(setSequenceSpy).toHaveBeenCalledWith(sequence);
        expect(toBytesSpy).toHaveBeenCalled();

        // Ensure the element configuration lines are covered.
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        expect(_TagClassType.universal).toBe(der._tagClass);
        expect(_ConstructionType.constructed).toBe(der._construction);
    });
});

import { _PdfX509Certificate, _PdfX509Certificates } from '../src/pdf/core/security/digital-signature/x509/x509-certificate';
import { _PdfX509ExtensionBase, _PdfX509Extensions } from '../src/pdf/core/security/digital-signature/x509/x509-extensions';
import * as cipherHandlerModule from '../src/pdf/core/security/digital-signature/x509/x509-cipher-handler';
import { _AdvancedEncryptionBaseCipher, _Cipher } from "../src/pdf/core/security/encryptors/cipher";
import { _CipherTransform, _DataEncryptionStandardCipher } from "../src/pdf/core/security/encryptors/cipher-tranform";
import { PdfForm } from "../src/pdf/core/form/form";
import { _TripleDataEncryptionStandardCipher } from "../src/pdf/core/security/encryptors/encryption-cipher";
import { _RaceEvaluationMessageDigest } from "../src/pdf/core/security/encryptors/evaluation-digest";
import { _CipherTwo, _NormalCipherFour, _NullCipher } from "../src/pdf/core/security/encryptors/normal-cipher";

describe('_PdfX509Certificate', () => {

    let originalRonCipherParameter: typeof cipherHandlerModule._PdfRonCipherParameter;

    beforeAll(() => {
        originalRonCipherParameter = cipherHandlerModule._PdfRonCipherParameter;
    });

    afterEach(() => {
        // Restore constructor replacements and spies after each test.
        Object.defineProperty(cipherHandlerModule, '_PdfRonCipherParameter', {
            value: originalRonCipherParameter,
            configurable: true
        });
    });

    function _createFakeStructure(signed?: any, derEncoded?: Uint8Array): _PdfX509CertificateStructure { // eslint-disable-line
        const structure: _PdfX509CertificateStructure = Object.create(_PdfX509CertificateStructure.prototype) as _PdfX509CertificateStructure;
        (structure as any)._getSignedCertificate = jasmine.createSpy('_getSignedCertificate').and.returnValue(signed);
        (structure as any)._getDerEncoded = jasmine.createSpy('_getDerEncoded').and.returnValue(
            derEncoded ? derEncoded : new Uint8Array([48, 1, 0])
        );
        return structure;
    }

    function _createFakeElement(value?: Uint8Array, sequence?: _PdfAbstractSyntaxElement[]): _PdfAbstractSyntaxElement {
        const element: _PdfAbstractSyntaxElement = Object.create(_PdfAbstractSyntaxElement.prototype) as _PdfAbstractSyntaxElement;
        const bytes: Uint8Array = value ? value : new Uint8Array([1, 2, 3]);

        (element as any)._getValue = jasmine.createSpy('_getValue').and.returnValue(bytes);
        (element as any)._getSequence = jasmine.createSpy('_getSequence').and.returnValue(
            sequence ? sequence : []
        );

        return element;
    }

    function _createCertificateWithNoExtension(structure: _PdfX509CertificateStructure): _PdfX509Certificate {
        const extensionSpy: jasmine.Spy = spyOn(_PdfX509ExtensionBase.prototype as any, '_getExtension').and.returnValue(undefined);
        const certificate: _PdfX509Certificate = new _PdfX509Certificate(structure);
        expect(extensionSpy).toHaveBeenCalled();
        return certificate;
    }

    it('should set key usage to null when key usage extension is not present', () => {
        const signed: any = {
            _getVersion: jasmine.createSpy('_getVersion').and.returnValue(3),
            _extensions: new _PdfX509Extensions()
        };
        const structure: _PdfX509CertificateStructure = _createFakeStructure(signed);
        const certificate: _PdfX509Certificate = _createCertificateWithNoExtension(structure);

        expect(certificate).toBeDefined();
        expect(certificate._structure).toBe(structure);
        expect(certificate._keyUsage).toBeNull();
    });

    it('should return signed certificate extensions for version 3', () => {
        const extensions: _PdfX509Extensions = new _PdfX509Extensions();
        const signed: any = {
            _getVersion: jasmine.createSpy('_getVersion').and.returnValue(3),
            _extensions: extensions
        };
        const structure: _PdfX509CertificateStructure = _createFakeStructure(signed);
        const certificate: _PdfX509Certificate = _createCertificateWithNoExtension(structure);

        const result: _PdfX509Extensions = certificate._getExtensions();

        expect(result).toBe(extensions);
    });

    it('should return a new empty extensions container when version is not 3', () => {
        const extensions: _PdfX509Extensions = new _PdfX509Extensions();
        const signed: any = {
            _getVersion: jasmine.createSpy('_getVersion').and.returnValue(2),
            _extensions: extensions
        };
        const structure: _PdfX509CertificateStructure = _createFakeStructure(signed);
        const certificate: _PdfX509Certificate = _createCertificateWithNoExtension(structure);

        const result: _PdfX509Extensions = certificate._getExtensions();

        expect(result).toBeDefined();
        expect(result instanceof _PdfX509Extensions).toBe(true);
        expect(result).not.toBe(extensions);
    });

    it('should return distinguish encoded bytes from the signed certificate', () => {
        const distinguishBytes: Uint8Array = new Uint8Array([48, 130, 1, 10]);
        const signed: any = {
            _getVersion: jasmine.createSpy('_getVersion').and.returnValue(3),
            _extensions: new _PdfX509Extensions(),
            _getDistinguishEncoded: jasmine.createSpy('_getDistinguishEncoded').and.returnValue(distinguishBytes)
        };
        const structure: _PdfX509CertificateStructure = _createFakeStructure(signed);
        const certificate: _PdfX509Certificate = _createCertificateWithNoExtension(structure);

        const result: Uint8Array = certificate._getTobeSignedCertificate();

        expect(result).toBe(distinguishBytes);
        expect(signed._getDistinguishEncoded).toHaveBeenCalled();
    });

    it('should return DER encoded bytes from structure via _getEncoded and _getEncodedString', () => {
        const encoded: Uint8Array = new Uint8Array([48, 3, 1, 2, 3]);
        const signed: any = {
            _getVersion: jasmine.createSpy('_getVersion').and.returnValue(3),
            _extensions: new _PdfX509Extensions()
        };
        const structure: _PdfX509CertificateStructure = _createFakeStructure(signed, encoded);
        const certificate: _PdfX509Certificate = _createCertificateWithNoExtension(structure);

        const result1: Uint8Array = certificate._getEncoded();
        const result2: Uint8Array = certificate._getEncodedString();

        expect(result1).toBe(encoded);
        expect(result2).toBe(encoded);
        expect((structure as any)._getDerEncoded).toHaveBeenCalledTimes(2);
    });
});

describe('_PdfX509Certificates', () => {
    it('should store the certificate and keep hashValueSet default as false', () => {
        const structure: _PdfX509CertificateStructure = Object.create(_PdfX509CertificateStructure.prototype) as _PdfX509CertificateStructure;
        spyOn(_PdfX509ExtensionBase.prototype as any, '_getExtension').and.returnValue(undefined);

        const certificate: _PdfX509Certificate = new _PdfX509Certificate(structure);
        const container: _PdfX509Certificates = new _PdfX509Certificates(certificate);

        expect(container._certificate).toBe(certificate);
        expect(container._hashValueSet).toBe(false);
    });
});

describe('_CipherTransform', () => {

    /**
     * Small concrete advanced cipher used only for _CipherTransform coverage.
     */
    class _TestAdvancedCipher extends _AdvancedEncryptionBaseCipher {
        constructor() {
            super();
            this._keySize = 16;
            this._cyclesOfRepetition = 1;
            this._key = new Uint8Array(32);
            this._iv = new Uint8Array(16);
            this._buffer = new Uint8Array(16);
            this._position = 0;
            this._bufferLength = 0;
        }

        _expandKey(cipherKey: Uint8Array): Uint8Array {
            const result: Uint8Array = new Uint8Array(32);
            result.set(cipherKey.subarray(0, Math.min(cipherKey.length, 32)));
            return result;
        }
    }

    /**
     * Small simple cipher used for the non-advanced branch.
     */
    class _TestSimpleCipher extends _Cipher {
        _decryptBlock(data: Uint8Array): Uint8Array {
            return new Uint8Array(data);
        }
        _encrypt(data: Uint8Array): Uint8Array {
            return new Uint8Array(data);
        }
    }

    it('should use Math.random fallback when crypto is unavailable in encryptString for advanced cipher', () => {
        const stringCipher: _TestAdvancedCipher = new _TestAdvancedCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        // In Karma/Chrome, use window instead of globalThis.
        const cryptoGetSpy: jasmine.Spy = spyOnProperty(window as any, 'crypto', 'get').and.returnValue(undefined);

        const randomSpy: jasmine.Spy = spyOn(Math, 'random').and.returnValues(
            0.00, 0.01, 0.02, 0.03,
            0.04, 0.05, 0.06, 0.07,
            0.08, 0.09, 0.10, 0.11,
            0.12, 0.13, 0.14, 0.15
        );

        let capturedIv: Uint8Array;
        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callFake(
            (data: Uint8Array, iv?: Uint8Array): Uint8Array => {
                capturedIv = new Uint8Array(iv);
                return new Uint8Array([100, 101, 102, 103]);
            }
        );

        const result: string = transform.encryptString('ABC');

        expect(cryptoGetSpy).toHaveBeenCalled();
        expect(randomSpy).toHaveBeenCalled();
        expect(encryptSpy).toHaveBeenCalled();
        expect(capturedIv).toBeDefined();
        expect(capturedIv.length).toBe(16);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use crypto.getRandomValues when crypto is available in encryptString for advanced cipher', () => {
        const stringCipher: _TestAdvancedCipher = new _TestAdvancedCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const getRandomValuesSpy: jasmine.Spy = jasmine.createSpy('getRandomValues').and.callFake(
            (target: Uint8Array): Uint8Array => {
                for (let i: number = 0; i < target.length; i++) {
                    target[i] = 200 + i;
                }
                return target;
            }
        );

        const cryptoGetSpy: jasmine.Spy = spyOnProperty(window as any, 'crypto', 'get').and.returnValue({
            getRandomValues: getRandomValuesSpy
        });

        let capturedIv: Uint8Array;
        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callFake(
            (data: Uint8Array, iv?: Uint8Array): Uint8Array => {
                capturedIv = new Uint8Array(iv);
                return new Uint8Array([1, 2, 3, 4]);
            }
        );

        const result: string = transform.encryptString('XYZ');

        expect(cryptoGetSpy).toHaveBeenCalled();
        expect(getRandomValuesSpy).toHaveBeenCalled();
        expect(encryptSpy).toHaveBeenCalled();
        expect(capturedIv).toEqual(new Uint8Array([
            200, 201, 202, 203,
            204, 205, 206, 207,
            208, 209, 210, 211,
            212, 213, 214, 215
        ]));
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use non-advanced encryptString branch for simple cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callThrough();

        const result: string = transform.encryptString('PlainText');

        expect(encryptSpy).toHaveBeenCalled();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should decrypt string using the string cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const decryptSpy: jasmine.Spy = spyOn(stringCipher, '_decryptBlock').and.callFake((data: Uint8Array): Uint8Array => {
            return new Uint8Array(data);
        });

        const result: string = transform.decryptString('hello');

        expect(decryptSpy).toHaveBeenCalled();
        expect(typeof result).toBe('string');
    });

    it('should create a decrypt stream using the stream cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const streamCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, streamCipher as any); // eslint-disable-line

        const dummyStream: any = { name: 'stream' }; // eslint-disable-line
        const stream: any = transform.createStream(dummyStream, 32); // eslint-disable-line

        expect(stream).toBeDefined();
    });
});

describe('_CipherTransform', () => {

    /**
     * Small concrete advanced cipher used only for _CipherTransform coverage.
     */
    class _TestAdvancedCipher extends _AdvancedEncryptionBaseCipher {
        constructor() {
            super();
            this._keySize = 16;
            this._cyclesOfRepetition = 1;
            this._key = new Uint8Array(32);
            this._iv = new Uint8Array(16);
            this._buffer = new Uint8Array(16);
            this._position = 0;
            this._bufferLength = 0;
        }

        _expandKey(cipherKey: Uint8Array): Uint8Array {
            const result: Uint8Array = new Uint8Array(32);
            result.set(cipherKey.subarray(0, Math.min(cipherKey.length, 32)));
            return result;
        }
    }

    /**
     * Small simple cipher used for the non-advanced branch.
     */
    class _TestSimpleCipher extends _Cipher {
        _decryptBlock(data: Uint8Array): Uint8Array {
            return new Uint8Array(data);
        }
        _encrypt(data: Uint8Array): Uint8Array {
            return new Uint8Array(data);
        }
    }

    it('should use Math.random fallback when crypto is unavailable in encryptString for advanced cipher', () => {
        const stringCipher: _TestAdvancedCipher = new _TestAdvancedCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        // In Karma/Chrome, use window instead of globalThis.
        const cryptoGetSpy: jasmine.Spy = spyOnProperty(window as any, 'crypto', 'get').and.returnValue(undefined);

        const randomSpy: jasmine.Spy = spyOn(Math, 'random').and.returnValues(
            0.00, 0.01, 0.02, 0.03,
            0.04, 0.05, 0.06, 0.07,
            0.08, 0.09, 0.10, 0.11,
            0.12, 0.13, 0.14, 0.15
        );

        let capturedIv: Uint8Array;
        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callFake(
            (data: Uint8Array, iv?: Uint8Array): Uint8Array => {
                capturedIv = new Uint8Array(iv);
                return new Uint8Array([100, 101, 102, 103]);
            }
        );

        const result: string = transform.encryptString('ABC');

        expect(cryptoGetSpy).toHaveBeenCalled();
        expect(randomSpy).toHaveBeenCalled();
        expect(encryptSpy).toHaveBeenCalled();
        expect(capturedIv).toBeDefined();
        expect(capturedIv.length).toBe(16);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use crypto.getRandomValues when crypto is available in encryptString for advanced cipher', () => {
        const stringCipher: _TestAdvancedCipher = new _TestAdvancedCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const getRandomValuesSpy: jasmine.Spy = jasmine.createSpy('getRandomValues').and.callFake(
            (target: Uint8Array): Uint8Array => {
                for (let i: number = 0; i < target.length; i++) {
                    target[i] = 200 + i;
                }
                return target;
            }
        );

        const cryptoGetSpy: jasmine.Spy = spyOnProperty(window as any, 'crypto', 'get').and.returnValue({
            getRandomValues: getRandomValuesSpy
        });

        let capturedIv: Uint8Array;
        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callFake(
            (data: Uint8Array, iv?: Uint8Array): Uint8Array => {
                capturedIv = new Uint8Array(iv);
                return new Uint8Array([1, 2, 3, 4]);
            }
        );

        const result: string = transform.encryptString('XYZ');

        expect(cryptoGetSpy).toHaveBeenCalled();
        expect(getRandomValuesSpy).toHaveBeenCalled();
        expect(encryptSpy).toHaveBeenCalled();
        expect(capturedIv).toEqual(new Uint8Array([
            200, 201, 202, 203,
            204, 205, 206, 207,
            208, 209, 210, 211,
            212, 213, 214, 215
        ]));
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use non-advanced encryptString branch for simple cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const encryptSpy: jasmine.Spy = spyOn(stringCipher, '_encrypt').and.callThrough();

        const result: string = transform.encryptString('PlainText');

        expect(encryptSpy).toHaveBeenCalled();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should decrypt string using the string cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, stringCipher as any); // eslint-disable-line

        const decryptSpy: jasmine.Spy = spyOn(stringCipher, '_decryptBlock').and.callFake((data: Uint8Array): Uint8Array => {
            return new Uint8Array(data);
        });

        const result: string = transform.decryptString('hello');

        expect(decryptSpy).toHaveBeenCalled();
        expect(typeof result).toBe('string');
    });

    it('should create a decrypt stream using the stream cipher', () => {
        const stringCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const streamCipher: _TestSimpleCipher = new _TestSimpleCipher();
        const transform: _CipherTransform = new _CipherTransform(stringCipher as any, streamCipher as any); // eslint-disable-line

        const dummyStream: any = { name: 'stream' }; // eslint-disable-line
        const stream: any = transform.createStream(dummyStream, 32); // eslint-disable-line

        expect(stream).toBeDefined();
    });
});

describe('_DataEncryptionStandardCipher - exact uncovered line coverage', () => {

    it('should execute `newKeys[b] |= this._bigByte[j]` in _generateWorkingKey', () => {
        const cipher: any = Object.create(_DataEncryptionStandardCipher.prototype); // eslint-disable-line

        // ---- Prepare internal DES tables ----
        cipher._pc1 = new Array(56).fill(0);
        cipher._pc2 = new Array(48).fill(0);
        cipher._rotationTable = new Array(16).fill(0);
        cipher._bigByte = new Array(24).fill(0);
        cipher._byteBit = [128, 64, 32, 16, 8, 4, 2, 1];

        // Force the very first body execution:
        // bytes1[0] => true
        // bytes2[0] => true
        // this._pc2[0] => 0
        // this._bigByte[0] => non-zero
        cipher._pc1[0] = 0;
        cipher._pc2[0] = 0;
        cipher._rotationTable[0] = 0;
        cipher._bigByte[0] = 0x800000;

        // ---- Intercept `new Array(32).fill(0)` so we can detect assignment to newKeys[0] ----
        const originalFill: (value: number) => number[] = Array.prototype.fill;
        let assignedValue: number = 0;
        let branchBodyExecuted: boolean = false;

        const fillSpy: jasmine.Spy = spyOn(Array.prototype, 'fill').and.callFake(function(this: number[], value: number): number[] {
            // Intercept only the `newKeys = new Array(32).fill(0)` call
            if (this.length === 32 && value === 0) {
                const special: number[] = new Array(32);
                special.length = 32;

                Object.defineProperty(special, '0', {
                    configurable: true,
                    enumerable: true,
                    get: (): number => assignedValue,
                    set: (v: number): void => {
                        assignedValue = v;
                        branchBodyExecuted = true;
                    }
                });

                for (let i: number = 1; i < 32; i++) {
                    special[i] = 0;
                }

                return special;
            }

            return originalFill.call(this, value);
        });

        // bytes[0] = 0x80 makes:
        // ((bytes[0] & 128) !== 0) => true
        const keyBytes: Uint8Array = new Uint8Array(8);
        keyBytes[0] = 0x80;

        const workingKey: number[] = cipher._generateWorkingKey(true, keyBytes);

        expect(fillSpy).toHaveBeenCalled();
        expect(branchBodyExecuted).toBe(true);
        expect(assignedValue).toBe(536879104);
        expect(workingKey).toBeDefined();
        expect(workingKey.length).toBe(32);
    });

});
describe('PdfForm coverage - _validateField and _compareWidgets', () => {

    function _createDictionary(
        values: Record<string, any> = {}, // eslint-disable-line
        rawValues?: Record<string, any>, // eslint-disable-line
        sizeOverride?: number
    ): any { // eslint-disable-line
        const store: Record<string, any> = { ...values }; // eslint-disable-line
        const rawStore: Record<string, any> = rawValues ? { ...rawValues } : {}; // eslint-disable-line
        const dictionary: any = { // eslint-disable-line
            _map: store,
            _updated: false,
            _reference: undefined,
            _crossReference: undefined,
            get size(): number {
                return typeof sizeOverride === 'number' ? sizeOverride : Object.keys(store).length;
            },
            has(key: string): boolean {
                return Object.prototype.hasOwnProperty.call(store, key);
            },
            get(key: string): any { // eslint-disable-line
                return store[key];
            },
            getRaw(key: string): any { // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(rawStore, key)) {
                    return rawStore[key];
                }
                return store[key];
            },
            getArray(key: string): any { // eslint-disable-line
                return store[key];
            },
            update(key: string, value: any): void { // eslint-disable-line
                store[key] = value;
                dictionary._updated = true;
            },
            set(key: string, value: any): void { // eslint-disable-line
                store[key] = value;
                dictionary._updated = true;
            }
        };
        return dictionary;
    }

    function _createForm(): PdfForm {
        const form: PdfForm = Object.create(PdfForm.prototype) as PdfForm;
        (form as any)._fields = []; // eslint-disable-line
        (form as any)._parsedFields = new Map();
        (form as any)._crossReference = {
            _document: {
                getPage: jasmine.createSpy('getPage').and.callFake((pageIndex: number): any => { // eslint-disable-line
                    return { _ref: { id: `page-${pageIndex}` } };
                })
            }
        };
        (form as any)._isValidKids = false; // eslint-disable-line
        return form;
    }

    it('should mark field valid and update field /P when _isValidKids is true and both field/widget have no /P', () => {
        const form: PdfForm = _createForm();
        (form as any)._isValidKids = true; // eslint-disable-line

        const pageRef: any = { id: 'page-ref-1' }; // eslint-disable-line
        const pageDocument: any = { // eslint-disable-line
            getPage: jasmine.createSpy('getPage').and.returnValue({ _ref: pageRef })
        };

        const widget: any = _createDictionary({}, undefined, 5); // eslint-disable-line
        widget._reference = { id: 'widget-ref-1' };
        widget._crossReference = {
            _document: pageDocument
        };

        const fieldDictionary: any = _createDictionary({ FT: { name: 'Tx' }, T: 'FieldA' }, undefined, 5); // eslint-disable-line
        const pageWidgets: Map<number, any[]> = new Map<number, any[]>([[2, [widget]]]); // eslint-disable-line
        const ref: any = { id: 'field-ref-1' }; // eslint-disable-line
        const widgetCollection: any[] = []; // eslint-disable-line

        const compareSpy: jasmine.Spy = spyOn(form as any, '_compareWidgets').and.returnValue(true); // eslint-disable-line

        const result: boolean = (form as any)._validateField(fieldDictionary, pageWidgets, ref, widgetCollection); // eslint-disable-line

        expect(compareSpy).toHaveBeenCalledWith(widget, fieldDictionary);
        expect(result).toBe(true);
        expect(fieldDictionary.has('P')).toBe(true);
        expect(fieldDictionary.get('P')).toBe(pageRef);
        expect((form as any)._fields.length).toBe(0); // eslint-disable-line
        expect(pageDocument.getPage).toHaveBeenCalledWith(2);
    });

    it('should update widget /P and push widget reference when _isValidKids is false and widget is a page widget without /P', () => {
        const form: PdfForm = _createForm();

        const pageRef: any = { id: 'page-ref-2' }; // eslint-disable-line
        const pageDocument: any = { // eslint-disable-line
            getPage: jasmine.createSpy('getPage').and.returnValue({ _ref: pageRef })
        };

        const widgetReference: any = { id: 'widget-ref-2' }; // eslint-disable-line
        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Tx' },
            Type: { name: 'Annot' },
            Subtype: { name: 'Widget' },
            T: 'FieldB'
        }, undefined, 6);
        widget._reference = widgetReference;
        widget._crossReference = {
            _document: pageDocument
        };

        const fieldDictionary: any = _createDictionary({ FT: { name: 'Tx' }, T: 'FieldB' }, undefined, 5); // eslint-disable-line
        const pageWidgets: Map<number, any[]> = new Map<number, any[]>([[1, [widget]]]); // eslint-disable-line
        const ref: any = { id: 'field-ref-2' }; // eslint-disable-line
        const widgetCollection: any[] = []; // eslint-disable-line

        const compareSpy: jasmine.Spy = spyOn(form as any, '_compareWidgets').and.returnValue(true); // eslint-disable-line

        const result: boolean = (form as any)._validateField(fieldDictionary, pageWidgets, ref, widgetCollection); // eslint-disable-line

        expect(compareSpy).toHaveBeenCalledWith(widget, fieldDictionary);
        expect(result).toBe(false);
        expect(widget.has('P')).toBe(true);
        expect(widget.get('P')).toBe(pageRef);
        expect((form as any)._fields.length).toBe(1); // eslint-disable-line
        expect((form as any)._fields[0]).toBe(widgetReference); // eslint-disable-line
        expect(pageDocument.getPage).toHaveBeenCalledWith(1);
    });

    it('should match widgets by FT, T and V equality', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Tx' },
            T: 'NameField',
            V: 'Nancy'
        }, undefined, 4);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Tx' },
            T: 'NameField',
            V: 'Nancy'
        }, undefined, 4);

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should match widgets by shared Parent when FT/T match and V does not match', () => {
        const form: PdfForm = _createForm();
        const parentRef: any = { id: 'same-parent' }; // eslint-disable-line

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Btn' },
            T: 'GroupA',
            Parent: parentRef
        }, { Parent: parentRef }, 5);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Btn' },
            T: 'GroupA',
            Parent: parentRef
        }, { Parent: parentRef }, 4); // wCount === aCount + 1 branch

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should match widgets by TU when FT/T match and Parent is absent', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Ch' },
            T: 'ChoiceA',
            TU: 'Tooltip same'
        }, undefined, 4);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Ch' },
            T: 'ChoiceA',
            TU: 'Tooltip same'
        }, undefined, 5); // wCount + 1 === aCount branch

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should match widgets by Rect when FT/T match and neither V nor Parent nor TU is usable', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Sig' },
            T: 'SignatureA',
            Rect: [10, 20, 110, 60]
        }, undefined, 4);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Sig' },
            T: 'SignatureA',
            Rect: [10, 20, 999, 999]
        }, undefined, 4);

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should match widgets without FT by TU equality', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            TU: 'Same tooltip'
        }, undefined, 2);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            TU: 'Same tooltip'
        }, undefined, 2);

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should match widgets without FT by Rect equality on first two coordinates', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            Rect: [5, 15, 25, 35]
        }, undefined, 2);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            Rect: [5, 15, 100, 200]
        }, undefined, 2);

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(true);
    });

    it('should not push duplicate widget references when widget reference is already present', () => {
        const form: PdfForm = _createForm();

        const widgetReference: any = { id: 'widget-ref-duplicate' }; // eslint-disable-line
        (form as any)._fields.push(widgetReference); // eslint-disable-line

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Tx' },
            Type: { name: 'Annot' },
            Subtype: { name: 'Widget' },
            T: 'DuplicateField'
        }, undefined, 4);
        widget._reference = widgetReference;
        widget._crossReference = {
            _document: {
                getPage: jasmine.createSpy('getPage').and.returnValue({ _ref: { id: 'page-dup' } })
            }
        };

        const fieldDictionary: any = _createDictionary({ FT: { name: 'Tx' }, T: 'DuplicateField' }, undefined, 4); // eslint-disable-line
        const pageWidgets: Map<number, any[]> = new Map<number, any[]>([[0, [widget]]]); // eslint-disable-line

        spyOn(form as any, '_compareWidgets').and.returnValue(true); // eslint-disable-line

        const result: boolean = (form as any)._validateField(fieldDictionary, pageWidgets, { id: 'field-ref-dup' }, []); // eslint-disable-line

        expect(result).toBe(false);
        expect((form as any)._fields.length).toBe(1); // eslint-disable-line
    });

    it('should return false from _compareWidgets when widget and annotation do not match', () => {
        const form: PdfForm = _createForm();

        const widget: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Tx' },
            T: 'FieldX',
            V: 'One'
        }, undefined, 3);

        const annotDictionary: any = _createDictionary({ // eslint-disable-line
            FT: { name: 'Btn' },
            T: 'FieldY',
            V: 'Two'
        }, undefined, 3);

        const result: boolean = (form as any)._compareWidgets(widget, annotDictionary); // eslint-disable-line

        expect(result).toBe(false);
    });

});


describe('_TripleDataEncryptionStandardCipher coverage', () => {

    it('should use default isEncryption=true and reuse key1 as key3 for a 16-byte key', () => {
        const originalGenerateWorkingKey: (
            isEncrypt: boolean,
            keyBytes: Uint8Array
        ) => Int32Array = _TripleDataEncryptionStandardCipher.prototype._generateWorkingKey;

        const calls: { isEncrypt: boolean; keyBytes: Uint8Array }[] = [];

        const generateSpy: jasmine.Spy = spyOn(
            _TripleDataEncryptionStandardCipher.prototype,
            '_generateWorkingKey'
        ).and.callFake(function(
            this: _TripleDataEncryptionStandardCipher,
            isEncrypt: boolean,
            keyBytes: Uint8Array
        ): Int32Array {
            calls.push({
                isEncrypt,
                keyBytes: new Uint8Array(keyBytes)
            });
            return new Int32Array(32);
        });

        const key: Uint8Array = new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16
        ]);

        const cipher: _TripleDataEncryptionStandardCipher = new _TripleDataEncryptionStandardCipher(key);

        expect(generateSpy).toHaveBeenCalledTimes(3);

        // constructor default branch => isEncryption should be true
        expect((cipher as any)._isEncryption).toBe(true); // eslint-disable-line

        // key1
        expect(calls[0].isEncrypt).toBe(true);
        expect(calls[0].keyBytes).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

        // key2 uses !isEncryption => false
        expect(calls[1].isEncrypt).toBe(false);
        expect(calls[1].keyBytes).toEqual(new Uint8Array([9, 10, 11, 12, 13, 14, 15, 16]));

        // 16-byte key path => key3 should be key1 again
        expect(calls[2].isEncrypt).toBe(true);
        expect(calls[2].keyBytes).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

        // Restore original implementation explicitly in case suite order matters.
        _TripleDataEncryptionStandardCipher.prototype._generateWorkingKey = originalGenerateWorkingKey;
    });

    it('should throw controlled error for invalid key length', () => {
        const invalidKey: Uint8Array = new Uint8Array(8);

        expect((): _TripleDataEncryptionStandardCipher => {
            return new _TripleDataEncryptionStandardCipher(invalidKey, true);
        }).toThrowError('Triple DES key must be 16 or 24 bytes.');
    });

    it('should use the provided third key section for a 24-byte key and false encryption mode', () => {
        const calls: { isEncrypt: boolean; keyBytes: Uint8Array }[] = [];

        const generateSpy: jasmine.Spy = spyOn(
            _TripleDataEncryptionStandardCipher.prototype,
            '_generateWorkingKey'
        ).and.callFake(function(
            this: _TripleDataEncryptionStandardCipher,
            isEncrypt: boolean,
            keyBytes: Uint8Array
        ): Int32Array {
            calls.push({
                isEncrypt,
                keyBytes: new Uint8Array(keyBytes)
            });
            return new Int32Array(32);
        });

        const key: Uint8Array = new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24
        ]);

        const cipher: _TripleDataEncryptionStandardCipher = new _TripleDataEncryptionStandardCipher(key, false);

        expect(generateSpy).toHaveBeenCalledTimes(3);
        expect((cipher as any)._isEncryption).toBe(false); // eslint-disable-line

        expect(calls[0].isEncrypt).toBe(false);
        expect(calls[0].keyBytes).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

        expect(calls[1].isEncrypt).toBe(true);
        expect(calls[1].keyBytes).toEqual(new Uint8Array([9, 10, 11, 12, 13, 14, 15, 16]));

        expect(calls[2].isEncrypt).toBe(false);
        expect(calls[2].keyBytes).toEqual(new Uint8Array([17, 18, 19, 20, 21, 22, 23, 24]));
    });

    it('should convert uint32 values to big-endian bytes and back', () => {
        const key: Uint8Array = new Uint8Array(16);
        const cipher: _TripleDataEncryptionStandardCipher = new _TripleDataEncryptionStandardCipher(key, true);

        const bytes: Uint8Array = new Uint8Array(8);
        cipher._uint32ToBe(0x12345678, bytes, 0);
        cipher._uint32ToBe(0x90abcdef, bytes, 4);

        expect(bytes).toEqual(new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]));
        expect(cipher._beToUint32(bytes, 0)).toBe(0x12345678);
        expect(cipher._beToUint32(bytes, 4)).toBe(0x90abcdef >>> 0);
    });

    it('should execute all three encryption-branch calls in _processBlock', () => {
        const cipher: _TripleDataEncryptionStandardCipher = Object.create(
            _TripleDataEncryptionStandardCipher.prototype
        ) as _TripleDataEncryptionStandardCipher;

        (cipher as any)._blockSize = 8; // eslint-disable-line
        (cipher as any)._isEncryption = true; // eslint-disable-line
        (cipher as any)._key1 = new Int32Array([1, 1, 1, 1]); // eslint-disable-line
        (cipher as any)._key2 = new Int32Array([2, 2, 2, 2]); // eslint-disable-line
        (cipher as any)._key3 = new Int32Array([3, 3, 3, 3]); // eslint-disable-line

        const input: Uint8Array = new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17]);
        const output: Uint8Array = new Uint8Array(16);

        const processSpy: jasmine.Spy = spyOn(cipher, '_processEncryptionBlock').and.callFake((
            keys: Int32Array,
            inBytes: Uint8Array,
            inOffset: number,
            outBytes: Uint8Array,
            outOffset: number
        ): void => {
            // Write deterministic output so temp/output buffers are valid and no undefined access occurs.
            for (let i: number = 0; i < 8; i++) {
                outBytes[outOffset + i] = (keys[0] + i) & 0xff;
            }
        });

        const result: number = cipher._processBlock(input, 0, output, 4);

        expect(result).toBe(8);
        expect(processSpy).toHaveBeenCalledTimes(3);

        expect(processSpy.calls.argsFor(0)[0]).toEqual((cipher as any)._key1); // eslint-disable-line
        expect(processSpy.calls.argsFor(0)[1]).toEqual(input);
        expect(processSpy.calls.argsFor(0)[2]).toBe(0);
        expect(processSpy.calls.argsFor(0)[4]).toBe(0);

        expect(processSpy.calls.argsFor(1)[0]).toEqual((cipher as any)._key2); // eslint-disable-line
        expect(processSpy.calls.argsFor(1)[2]).toBe(0);
        expect(processSpy.calls.argsFor(1)[4]).toBe(0);

        expect(processSpy.calls.argsFor(2)[0]).toEqual((cipher as any)._key3); // eslint-disable-line
        expect(processSpy.calls.argsFor(2)[2]).toBe(0);
        expect(processSpy.calls.argsFor(2)[4]).toBe(4);

        // Ensure output got written at outOffset from the third call.
        expect(output[4]).toBe(3);
        expect(output[11]).toBe((3 + 7) & 0xff);
    });

    it('should execute the decryption branch in _processBlock safely', () => {
        const cipher: _TripleDataEncryptionStandardCipher = Object.create(
            _TripleDataEncryptionStandardCipher.prototype
        ) as _TripleDataEncryptionStandardCipher;

        (cipher as any)._blockSize = 8; // eslint-disable-line
        (cipher as any)._isEncryption = false; // eslint-disable-line
        (cipher as any)._key1 = new Int32Array([11, 11, 11, 11]); // eslint-disable-line
        (cipher as any)._key2 = new Int32Array([22, 22, 22, 22]); // eslint-disable-line
        (cipher as any)._key3 = new Int32Array([33, 33, 33, 33]); // eslint-disable-line

        const input: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const output: Uint8Array = new Uint8Array(8);

        const processSpy: jasmine.Spy = spyOn(cipher, '_processEncryptionBlock').and.callFake((
            keys: Int32Array,
            inBytes: Uint8Array,
            inOffset: number,
            outBytes: Uint8Array,
            outOffset: number
        ): void => {
            for (let i: number = 0; i < 8; i++) {
                outBytes[outOffset + i] = (keys[0] + i) & 0xff;
            }
        });

        const result: number = cipher._processBlock(input, 0, output, 0);

        expect(result).toBe(8);
        expect(processSpy).toHaveBeenCalledTimes(3);

        // Decrypt order: key3 -> key2 -> key1
        expect(processSpy.calls.argsFor(0)[0]).toEqual((cipher as any)._key3); // eslint-disable-line
        expect(processSpy.calls.argsFor(1)[0]).toEqual((cipher as any)._key2); // eslint-disable-line
        expect(processSpy.calls.argsFor(2)[0]).toEqual((cipher as any)._key1); // eslint-disable-line
    });

});


describe('_RaceEvaluationMessageDigest coverage', () => {

    it('should execute the carry overflow correction path in _hash', () => {
        const digest: _RaceEvaluationMessageDigest = new _RaceEvaluationMessageDigest();

        // Keep hashing logic safe and deterministic.
        const updateSpy: jasmine.Spy = spyOn<any>(digest, '_update').and.stub();
        const writeUInt32LESpy: jasmine.Spy = spyOn(digest, '_writeUInt32LE').and.callThrough();

        // Important:
        // length * 8 must overflow 32 bits so that carry > 0,
        // but offset > length prevents any large loop from running.
        //
        // 536870912 * 8 = 4294967296 = 0x100000000
        const data: Uint8Array = new Uint8Array(0);
        const offset: number = 536870913; // offset > length, so no data copy loops
        const length: number = 536870912;

        const result: Uint8Array = digest._hash(data, offset, length);

        expect(result).toBeDefined();
        expect(result.length).toBe(20);

        // Final hash still performs the final update once.
        expect(updateSpy).toHaveBeenCalled();

        // These two calls prove the overflow-correction branch executed:
        // _length[0] becomes 0 after subtraction
        // _length[1] becomes 1 because carry propagated
        expect(writeUInt32LESpy.calls.argsFor(0)[1]).toBe(0);
        expect(writeUInt32LESpy.calls.argsFor(1)[1]).toBe(1);
    });

    it('should execute the _blockOffset > 56 padding branch in _hash', () => {
        const digest: _RaceEvaluationMessageDigest = new _RaceEvaluationMessageDigest();

        // Spy on the real block.fill so we can prove the highlighted fill call happened.
        const fillSpy: jasmine.Spy = spyOn(digest['_block'], 'fill').and.callThrough(); // eslint-disable-line
        const updateSpy: jasmine.Spy = spyOn<any>(digest, '_update').and.stub();

        // 57 bytes copied into the block means:
        // after adding 0x80 => _blockOffset becomes 58, so > 56 is true
        const data: Uint8Array = new Uint8Array(57);
        for (let i: number = 0; i < 57; i++) {
            data[i] = i & 0xff;
        }

        const result: Uint8Array = digest._hash(data, 0, 57);

        expect(result).toBeDefined();
        expect(result.length).toBe(20);

        // The branch update plus the final update.
        expect(updateSpy).toHaveBeenCalledTimes(2);

        // Proves this exact highlighted line ran:
        // this._block.fill(0, _blockOffset, 64);
        const fillCalls: any[][] = fillSpy.calls.allArgs(); // eslint-disable-line
        const hasBranchFill: boolean = fillCalls.some((args: any[]) => // eslint-disable-line
            args.length === 3 && args[0] === 0 && args[1] === 58 && args[2] === 64
        );
        expect(hasBranchFill).toBe(true);

        // Proves _blockOffset = 0 happened after the branch,
        // because the next padding fill starts from 0 to 56.
        const hasResetFill: boolean = fillCalls.some((args: any[]) => // eslint-disable-line
            args.length === 3 && args[0] === 0 && args[1] === 0 && args[2] === 56
        );
        expect(hasResetFill).toBe(true);
    });

});
``

describe('normal-cipher coverage', () => {

    describe('_NormalCipherFour', () => {

        it('should cover _encrypt by delegating to _encryptBlock', () => {
            const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
            const cipher: _NormalCipherFour = new _NormalCipherFour(key);
            const data: Uint8Array = new Uint8Array([10, 20, 30, 40]);

            const encryptBlockSpy: jasmine.Spy = spyOn(cipher, '_encryptBlock').and.callThrough();

            const result: Uint8Array = cipher._encrypt(data);

            expect(encryptBlockSpy).toHaveBeenCalledWith(data);
            expect(result).toBeDefined();
            expect(result.length).toBe(data.length);
        });

        it('should cover _decryptBlock by delegating to _encryptBlock', () => {
            const key: Uint8Array = new Uint8Array([11, 22, 33, 44, 55]);
            const cipher: _NormalCipherFour = new _NormalCipherFour(key);
            const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);

            const encryptBlockSpy: jasmine.Spy = spyOn(cipher, '_encryptBlock').and.callThrough();

            const result: Uint8Array = cipher._decryptBlock(data);

            expect(encryptBlockSpy).toHaveBeenCalledWith(data);
            expect(result).toBeDefined();
            expect(result.length).toBe(data.length);
        });

    });

    describe('_NullCipher', () => {

        it('should return the same input for _encrypt and _decryptBlock', () => {
            const cipher: _NullCipher = new _NullCipher();
            const data: Uint8Array = new Uint8Array([9, 8, 7, 6]);

            const encrypted: Uint8Array = cipher._encrypt(data);
            const decrypted: Uint8Array = cipher._decryptBlock(data);

            expect(encrypted).toBe(data);
            expect(decrypted).toBe(data);
        });

    });

    describe('_CipherTwo._decrypt padding branches', () => {

        it('should execute the invalid padding branch and return full decrypted data', () => {
            const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
            const cipher: _CipherTwo = new _CipherTwo(key, 64);

            // One encrypted block; IV is required so previousBlock[j] is always defined.
            const data: Uint8Array = new Uint8Array(8);
            const iv: Uint8Array = new Uint8Array(8);

            // Last byte = 2 => outer padLength condition is true.
            // But second-last byte != 2, so:
            // if (decrypted[i] !== padLength) {
            //     isValidPadding = false;
            //     break;
            // }
            const invalidPaddedPlain: Uint8Array = new Uint8Array([
                1, 2, 3, 4, 5, 6, 9, 2
            ]);

            const decryptBlockSpy: jasmine.Spy = spyOn(cipher, '_decryptBlock').and.returnValue(invalidPaddedPlain);

            const result: Uint8Array = cipher._decrypt(data, iv);

            expect(decryptBlockSpy).toHaveBeenCalled();
            // Because padding is invalid, full decrypted bytes should be returned.
            expect(result).toEqual(invalidPaddedPlain);
            expect(result.length).toBe(8);
        });

        it('should execute the valid padding branch and return decrypted data without padding', () => {
            const key: Uint8Array = new Uint8Array([6, 7, 8, 9, 10]);
            const cipher: _CipherTwo = new _CipherTwo(key, 64);

            const data: Uint8Array = new Uint8Array(8);
            const iv: Uint8Array = new Uint8Array(8);

            // Valid PKCS-style padding: last 3 bytes are all 3
            const validPaddedPlain: Uint8Array = new Uint8Array([
                11, 12, 13, 14, 15, 3, 3, 3
            ]);

            const decryptBlockSpy: jasmine.Spy = spyOn(cipher, '_decryptBlock').and.returnValue(validPaddedPlain);

            const result: Uint8Array = cipher._decrypt(data, iv);

            expect(decryptBlockSpy).toHaveBeenCalled();
            // Padding should be removed.
            expect(result).toEqual(new Uint8Array([11, 12, 13, 14, 15]));
            expect(result.length).toBe(5);
        });

        it('should execute the outer padding false path and return decrypted data unchanged', () => {
            const key: Uint8Array = new Uint8Array([21, 22, 23, 24, 25]);
            const cipher: _CipherTwo = new _CipherTwo(key, 64);

            const data: Uint8Array = new Uint8Array(8);
            const iv: Uint8Array = new Uint8Array(8);

            // Last byte = 0 => outer "if (padLength > 0 && padLength <= this._blockSize)" is false
            const noPaddingPlain: Uint8Array = new Uint8Array([
                31, 32, 33, 34, 35, 36, 37, 0
            ]);

            const decryptBlockSpy: jasmine.Spy = spyOn(cipher, '_decryptBlock').and.returnValue(noPaddingPlain);

            const result: Uint8Array = cipher._decrypt(data, iv);

            expect(decryptBlockSpy).toHaveBeenCalled();
            expect(result).toEqual(noPaddingPlain);
            expect(result.length).toBe(8);
        });

    });

});
