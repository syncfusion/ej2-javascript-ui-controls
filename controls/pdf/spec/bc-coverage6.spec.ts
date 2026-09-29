import { _PdfStream } from "../src/pdf/core/base-stream";
import { PdfCrossReferenceType, PdfDestinationMode } from "../src/pdf/core/enumerator";
import { _PdfCrossReference } from "../src/pdf/core/pdf-cross-reference";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { _PdfDestinationHelper } from "../src/pdf/core/pdf-page";
import { _PdfLexicalOperator, _PdfParser } from "../src/pdf/core/pdf-parser";
import { _PdfCommand, _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _PdfSignatureDictionary } from "../src/pdf/core/security/digital-signature/signature/signature-dictionary";
import { _CipherTransform } from "../src/pdf/core/security/encryptors/cipher-tranform";
import * as certificateUtils from '../src/pdf/core/utils';
import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _PdfX509Certificate } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfPublicKeyCryptographyCertificate } from "../src/pdf/core/security/digital-signature/pdf-cryptography-certificate";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfRonCipherParameter } from "../src/pdf/core/security/digital-signature/x509/x509-cipher-handler";
describe('_PdfDestinationHelper', () => {
    function _createDocument(pageCount: number): PdfDocument {
        return {
            pageCount,
            getPage: (_index: number) => undefined as any
        } as unknown as PdfDocument;
    }

    function _createDictionary(
        destinationArray: Array<number | _PdfName | undefined>,
        document: PdfDocument
    ): _PdfDictionary {
        return {
            has: (key: string): boolean => key === 'Dest',
            getArray: (_key: string): Array<number | _PdfName | undefined> => destinationArray,
            _crossReference: {
                _document: document
            }
        } as unknown as _PdfDictionary;
    }

    it('should set destination as invalid when fallback XYZ destination misses left, top, and zoom', () => {
        const document: PdfDocument = _createDocument(1);
        const dictionary: _PdfDictionary = _createDictionary(
            [
                5, // invalid index so page is not resolved
                _PdfName.get('XYZ'),
                undefined, // left missing
                undefined, // topValue missing
                undefined  // zoom missing
            ],
            document
        );

        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(dictionary, 'Dest');
        const destination = helper._obtainDestination();

        expect(destination).toBeDefined();
        expect(destination.isValid).toBe(false); // covers destination._setValidation(false)
        expect(destination.mode).toBe(PdfDestinationMode.location);
        expect(destination.pageIndex).toBeUndefined();
    });
});
describe('_PdfCrossReference async highlighted coverage', () => {
    function _createDocument(isIncrementalUpdate: boolean, type: PdfCrossReferenceType): PdfDocument {
        const fileStructure: {
            isIncrementalUpdate: boolean;
            crossReferenceType: PdfCrossReferenceType;
            _crossReferenceType: PdfCrossReferenceType;
        } = {
            isIncrementalUpdate,
            crossReferenceType: type,
            _crossReferenceType: type
        };
        const document: {
            _stream: _PdfStream;
            fileStructure: typeof fileStructure;
            _fileStructure: typeof fileStructure;
        } = {
            _stream: new _PdfStream(new Uint8Array(0)),
            fileStructure,
            _fileStructure: fileStructure
        };
        return document as unknown as PdfDocument;
    }

    function _waitForTick(): Promise<void> {
        return new Promise((resolve: Function): void => {
            setTimeout((): void => {
                resolve();
            }, 0);
        }) as Promise<void>;
    }

    it('should cover highlighted _saveAsync branches for signature loop and buffer flush', async () => {
        const document: PdfDocument = _createDocument(false, PdfCrossReferenceType.table);
        const crossReference: _PdfCrossReference = new _PdfCrossReference(document);
        crossReference._version = '1.7';
        crossReference._isCrossReferenceStream = true;

        const catalogBeginSaveSpy: jasmine.Spy = jasmine.createSpy('_catalogBeginSave');
        const documentSavedAsyncSpy: jasmine.Spy = jasmine.createSpy('_documentSavedAsync')
            .and.returnValue(Promise.resolve<void>(undefined));

        const signatureDictionary: _PdfSignatureDictionary = {
            _documentSavedAsync: documentSavedAsyncSpy
        } as unknown as _PdfSignatureDictionary;

        const signature: PdfSignature = {
            _catalogBeginSave: catalogBeginSaveSpy,
            _signatureDictionary: signatureDictionary
        } as unknown as PdfSignature;

        crossReference._signatureCollection = [signature];

        const writeObjectCollectionAsyncSpy: jasmine.Spy = spyOn(crossReference, '_writeObjectCollectionAsync')
            .and.callFake(async (_collection: Map<_PdfReference, object>, buffer: number[]): Promise<void> => {
                // Make buffer non-empty so _saveAsync hits:
                // if (buffer.length > 0) { await this._flushBufferAsync(buffer); }
                buffer.push(65, 66, 67);
            });

        const flushBufferAsyncSpy: jasmine.Spy = spyOn(crossReference, '_flushBufferAsync')
            .and.callFake(async (data: number[]): Promise<void> => {
                await _PdfCrossReference.prototype._flushBufferAsync.call(crossReference, data);
            });

        const result: Uint8Array = await crossReference._saveAsync();

        expect(result instanceof Uint8Array).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // Covers highlighted line: if (i % 50 === 0)
        expect(catalogBeginSaveSpy).toHaveBeenCalledTimes(1);

        // Covers highlighted line: if (buffer.length > 0)
        expect(writeObjectCollectionAsyncSpy).toHaveBeenCalled();
        expect(flushBufferAsyncSpy).toHaveBeenCalled();

        expect(documentSavedAsyncSpy).toHaveBeenCalledTimes(1);
        expect(document.fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.stream);
    });

    it('should cover highlighted _saveAsStreamAsync allowCatalog and non-_PdfBaseStream paths', async () => {
        const document: PdfDocument = _createDocument(true, PdfCrossReferenceType.stream);
        const crossReference: _PdfCrossReference = new _PdfCrossReference(document);
        crossReference._allowCatalog = true;
        crossReference._nextReferenceNumber = 100;

        const buffer: number[] = [];
        const streamReference: _PdfReference = _PdfReference.get(1, 0);
        const plainReference: _PdfReference = _PdfReference.get(2, 0);

        // IMPORTANT:
        // first highlighted branch is only inside:
        // if (value instanceof _PdfBaseStream)
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        (dictionary as { _updated: boolean })._updated = true;
        (dictionary as { _isProcessed: boolean })._isProcessed = false;
        (dictionary as { isCatalog: boolean }).isCatalog = true; // force this._allowCatalog side
        const streamValue: _PdfStream = new _PdfStream(new Uint8Array(0), dictionary, 0, 0);

        crossReference._cacheMap.set(streamReference, streamValue);

        // This hits the second highlighted branch:
        // if (!(value instanceof _PdfBaseStream)) return ...
        crossReference._cacheMap.set(plainReference, 25 as unknown);

        const updatedDictionarySpy: jasmine.Spy = spyOn(crossReference, '_updatedDictionary')
            .and.callFake((
                _currentLength: number,
                _key: _PdfReference,
                targetBuffer: number[],
                _value: _PdfStream
            ): void => {
                targetBuffer.push(1);
            });

        const writeXrefStreamAsyncSpy: jasmine.Spy = spyOn(crossReference, '_writeXrefStreamAsync')
            .and.returnValue(Promise.resolve<void>(undefined));

        await crossReference._saveAsStreamAsync(0, buffer);

        // Safety tick because source uses async callbacks inside forEach.
        await _waitForTick();
        await _waitForTick();

        // Covers highlighted this._allowCatalog condition
        expect(updatedDictionarySpy).toHaveBeenCalledTimes(1);
        expect(updatedDictionarySpy.calls.argsFor(0)[1]).toBe(streamReference);
        expect(updatedDictionarySpy.calls.argsFor(0)[3]).toBe(streamValue);

        // Method completed and reached tail write
        expect(writeXrefStreamAsyncSpy).toHaveBeenCalledTimes(1);
    });
});
describe('_PdfParser.makeInlineImage', () => {
    it('should use the passed _CipherTransform instance when arguement3 is true', () => {
        const imageSubStream: { dictionary?: _PdfDictionary } = {};

        const stream: {
            position: number;
            makeSubStream: jasmine.Spy;
        } = {
            position: 0,
            makeSubStream: jasmine.createSpy('makeSubStream').and.callFake(
                (_start: number, _length: number, dictionary: _PdfDictionary): { dictionary?: _PdfDictionary } => {
                    imageSubStream.dictionary = dictionary;
                    return imageSubStream;
                }
            )
        };

        const getObjectSpy: jasmine.Spy = jasmine.createSpy('getObject');
        getObjectSpy.and.returnValues(
            _PdfCommand.get('ID'), // parser.first after refill()
            null,                  // parser.second after refill()
            null                   // parser.shift() at end of makeInlineImage()
        );

        const lexicalOperator: _PdfLexicalOperator = {
            stream,
            beginInlineImagePosition: -1,
            getObject: getObjectSpy
        } as unknown as _PdfLexicalOperator;

        const parser: _PdfParser = new _PdfParser(
            lexicalOperator,
            null as any
        );

        const cipherTransform: _CipherTransform = Object.create(_CipherTransform.prototype) as _CipherTransform;
        const createStreamSpy: jasmine.Spy = jasmine.createSpy('createStream').and.callFake(
            (value: object): object => value
        );
        (cipherTransform as any).createStream = createStreamSpy;

        const encryptor: {
            _createCipherTransform: jasmine.Spy;
        } = {
            _createCipherTransform: jasmine.createSpy('_createCipherTransform')
        };
        (parser as any)._encryptor = encryptor;

        spyOn(parser, 'findDefaultInlineStreamEnd').and.returnValue(0);
        spyOn(parser, 'filter').and.callFake((value: object): object => value);
        const result: object = (parser as any).makeInlineImage(cipherTransform, 10, true);
        expect(encryptor._createCipherTransform).not.toHaveBeenCalled();
        expect(createStreamSpy).toHaveBeenCalledTimes(1);
        expect(createStreamSpy.calls.argsFor(0)[0]).toBe(imageSubStream);
        expect(result).toBe(imageSubStream);

        expect(stream.makeSubStream).toHaveBeenCalledTimes(1);
        expect(imageSubStream.dictionary instanceof _PdfDictionary).toBe(true);
        expect(parser.first).toBe(_PdfCommand.get('EI'));
    });
});
describe('_PdfPublicKeyCryptographyCertificate._processCertificateCollection', () => {
    function _createObjectIdentifierElement(value: string): _PdfAbstractSyntaxElement {
        return {
            _getObjectIdentifier(): { toString(): string } {
                return {
                    toString(): string {
                        return value;
                    }
                };
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createAttributeValueElement(marker: string): _PdfAbstractSyntaxElement {
        return {
            _marker: marker,
            _getBmpString(): string {
                return marker;
            },
            _getUtf8String(): string {
                return marker;
            },
            _getOctetString(): Uint8Array {
                return new Uint8Array([1, 2, 3]);
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createAttributeContainerWithAbstractSet(values: _PdfAbstractSyntaxElement[]): _PdfAbstractSyntaxElement {
        return {
            _getAbstractSetValue(): _PdfAbstractSyntaxElement[] {
                return values;
            },
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return values;
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createInvalidAttributeSequence(): _PdfAbstractSyntaxElement {
        return {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [_createObjectIdentifierElement('1.2.3.4')];
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createEmptyAttributeSetSequence(attributeOid: string): _PdfAbstractSyntaxElement {
        return {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [
                    _createObjectIdentifierElement(attributeOid),
                    {
                        _getAbstractSetValue(): _PdfAbstractSyntaxElement[] {
                            return [];
                        },
                        _getSequence(): _PdfAbstractSyntaxElement[] {
                            return [];
                        }
                    } as unknown as _PdfAbstractSyntaxElement
                ];
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createValidAttributeSequence(
        attributeOid: string,
        value: _PdfAbstractSyntaxElement
    ): _PdfAbstractSyntaxElement {
        return {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [
                    _createObjectIdentifierElement(attributeOid),
                    _createAttributeContainerWithAbstractSet([value])
                ];
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createTempAttributesFallbackSequence(
        attributes: _PdfAbstractSyntaxElement[]
    ): _PdfAbstractSyntaxElement {
        return {
            _getAbstractSetValue(): _PdfAbstractSyntaxElement[] {
                throw new Error('force catch fallback');
            },
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return attributes;
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    function _createCertificateChainElement(certOctets: Uint8Array): _PdfAbstractSyntaxElement {
        const octetValueElement: _PdfAbstractSyntaxElement = {
            _getValue(): Uint8Array {
                return certOctets;
            }
        } as unknown as _PdfAbstractSyntaxElement;

        const certSequenceZero: _PdfAbstractSyntaxElement = {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [
                    {} as _PdfAbstractSyntaxElement,
                    {
                        _getSequence(): _PdfAbstractSyntaxElement[] {
                            return [octetValueElement];
                        }
                    } as unknown as _PdfAbstractSyntaxElement
                ];
            }
        } as unknown as _PdfAbstractSyntaxElement;

        const certValue: _PdfAbstractSyntaxElement = {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [certSequenceZero];
            }
        } as unknown as _PdfAbstractSyntaxElement;

        return {
            _getSequence(): _PdfAbstractSyntaxElement[] {
                return [
                    {} as _PdfAbstractSyntaxElement,
                    certValue
                ];
            }
        } as unknown as _PdfAbstractSyntaxElement;
    }

    // ✅ FIXED: return a runtime-valid _PdfRonCipherParameter instance-like object
    function _createFakeCertificate(): _PdfX509Certificate {
        const publicKey: _PdfRonCipherParameter =
            Object.create(_PdfRonCipherParameter.prototype) as _PdfRonCipherParameter;

        return {
            _publicKeyBytes: new Uint8Array([10, 20, 30]),
            _getPublicKey(): _PdfRonCipherParameter {
                return publicKey;
            }
        } as unknown as _PdfX509Certificate;
    }

    it('should use tempAttributes._getSequence() in catch and continue for invalid and empty attribute sets', () => {
        const certificate: _PdfPublicKeyCryptographyCertificate = new _PdfPublicKeyCryptographyCertificate();
        const chainElement: _PdfAbstractSyntaxElement = _createCertificateChainElement(new Uint8Array([1, 2, 3]));

        const tempAttributes: _PdfAbstractSyntaxElement = _createTempAttributesFallbackSequence([
            _createInvalidAttributeSequence(), // covers: if (!items || items.length < 2) { continue; }
            _createEmptyAttributeSetSequence('1.2.840.113549.1.9.20') // covers: if (!attrSet || attrSet.length === 0) { continue; }
        ]);

        spyOn(certificateUtils, '_extractAttributes').and.returnValue(tempAttributes);
        spyOn(_PdfX509CertificateParser.prototype, '_readCertificate').and.returnValue(_createFakeCertificate());

        certificate._processCertificateCollection([chainElement]);

        expect(certificate._chainCertificates).toBeDefined();
        expect(certificate._chainCertificates.size).toBe(1);
        expect(certificate._keyCertificates).toBeDefined();
        expect(certificate._keyCertificates.size).toBe(0);
    });

    it('should throw when the same attribute oid is added with a different value', () => {
        const certificate: _PdfPublicKeyCryptographyCertificate = new _PdfPublicKeyCryptographyCertificate();
        const chainElement: _PdfAbstractSyntaxElement = _createCertificateChainElement(new Uint8Array([9, 8, 7]));

        const duplicateOid: string = '1.2.840.113549.1.9.20';
        const valueOne: _PdfAbstractSyntaxElement = _createAttributeValueElement('first');
        const valueTwo: _PdfAbstractSyntaxElement = _createAttributeValueElement('second');

        const tempAttributes: _PdfAbstractSyntaxElement = _createTempAttributesFallbackSequence([
            _createValidAttributeSequence(duplicateOid, valueOne),
            _createValidAttributeSequence(duplicateOid, valueTwo)
        ]);

        spyOn(certificateUtils, '_extractAttributes').and.returnValue(tempAttributes);
        spyOn(_PdfX509CertificateParser.prototype, '_readCertificate').and.returnValue(_createFakeCertificate());

        expect((): void => {
            certificate._processCertificateCollection([chainElement]);
        }).toThrowError('attempt to add existing attribute with different value');
    });
});
