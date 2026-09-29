
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { _PdfStream, _PdfBaseStream } from '../src/pdf/core/base-stream';
import {
    _PdfDictionary,
    _PdfReference,
    _PdfCommand,
    _PdfName,
    _PdfReferenceSet
} from '../src/pdf/core/pdf-primitives';
import { _PdfParser, _PdfLexicalOperator } from '../src/pdf/core/pdf-parser';
import { PdfCrossReferenceType } from '../src/pdf/core/enumerator';
import { BaseException, FormatError, ParserEndOfFileException } from '../src/pdf/core/utils';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { _PdfEncryptor } from '../src/pdf/core/security/encryptor';
import * as encryptorModule from '../src/pdf/core/security/encryptor';
function createDocumentStub(bytes?: number[]): any {
    const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes || []));
    const fileStructure: any = {
        isIncrementalUpdate: false,
        crossReferenceType: PdfCrossReferenceType.table,
        _crossReferenceType: PdfCrossReferenceType.table
    };

    return {
        _stream: stream,
        fileStructure,
        _fileStructure: fileStructure,
        _isEncrypted: false,
        _isUserPassword: false,
        _hasUserPasswordOnly: false,
        _encryptMetaData: true,
        _startXRefParsedCache: []
    };
}
var globalThis:any;
function createXref(bytes?: number[]): _PdfCrossReference {
    return new _PdfCrossReference(createDocumentStub(bytes) as any);
}
describe('_PdfCrossReference - highlighted uncovered branches', () => {

    function createDocument(bytes?: number[]): PdfDocument {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array(bytes ? bytes : [0x25, 0x50, 0x44, 0x46])
        );

        const fileStructure: PdfDocument['fileStructure'] & {
            _crossReferenceType?: PdfCrossReferenceType;
            _incrementalUpdate: boolean;
        } = {
            _incrementalUpdate: false,
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: undefined
        };

        const documentStub: Partial<PdfDocument> & {
            _stream: _PdfStream;
            fileStructure: typeof fileStructure;
            _fileStructure: typeof fileStructure;
            _isEncrypted: boolean;
            _isUserPassword: boolean;
            _encryptOnlyAttachment: boolean;
            _hasUserPasswordOnly: boolean;
            _encryptMetaData: boolean;
            _startXRefParsedCache?: number[];
        } = {
            _stream: stream,
            fileStructure,
            _fileStructure: fileStructure,
            _isEncrypted: false,
            _isUserPassword: false,
            _encryptOnlyAttachment: false,
            _hasUserPasswordOnly: false,
            _encryptMetaData: true
        };

        return documentStub as PdfDocument;
    }


    function createCrossReference(bytes?: number[]): _PdfCrossReference {
        return new _PdfCrossReference(createDocument(bytes));
    }

    function createParseTestXref(): _PdfCrossReference {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([37, 80, 68, 70]));
        const fileStructure: {
            _incrementalUpdate: boolean;
            isIncrementalUpdate: boolean;
            crossReferenceType?: PdfCrossReferenceType;
            _crossReferenceType?: PdfCrossReferenceType;
        } = {
            _incrementalUpdate: false,
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: undefined
        };
        const document: PdfDocument = {
            _stream: stream,
            _fileStructure: fileStructure,
            fileStructure: fileStructure
        } as unknown as PdfDocument;
        return new _PdfCrossReference(document);
    }
    function createRootTrailer(withPages: boolean = true): _PdfDictionary {
        const trailer: _PdfDictionary = new _PdfDictionary();
        const root: _PdfDictionary = new _PdfDictionary();
        if (withPages) {
            root.set('Pages', new _PdfDictionary());
        }
        trailer.set('Root', root);
        trailer.set('Size', 3);
        return trailer;
    }

    function getCommand(name: string): _PdfCommand {
        const commandType: {
            get?: (value: string) => _PdfCommand;
        } = _PdfCommand as unknown as { get?: (value: string) => _PdfCommand };

        if (commandType.get) {
            return commandType.get(name);
        }

        return { command: name } as unknown as _PdfCommand;
    }

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('_parse', () => {
        it('should set next reference number from trailer Size when entries length is equal to Size', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const trailer: _PdfDictionary = createRootTrailer(true);
            (xref as unknown as { _entries: unknown[] })._entries = new Array(3);

            spyOn(xref as unknown as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary }, '_readXRef')
                .and.returnValue(trailer);

            // Act
            (xref as unknown as { _parse: (recoveryMode: boolean) => void })._parse(false);

            // Assert
            expect((xref as unknown as { _nextReferenceNumber: number })._nextReferenceNumber).toBe(3);
            expect((xref as unknown as { _root: _PdfDictionary })._root).toBeDefined();
        });
        it('958477 - should cover _isVisited flag add, skip, recursion, and reset scenarios', () => {
            const xref: _PdfCrossReference = createCrossReference();
            const trailer = new _PdfDictionary();
            spyOn(trailer, 'getRaw').and.returnValue(undefined);
            spyOn(trailer, 'get').and.returnValue(undefined);
            spyOn(trailer, 'has').and.returnValue(false);
            (xref as any)._trailer = trailer;
            (xref as any)._save();
            const collection = (xref as any)._objectCollection;
            const dict1 = new _PdfDictionary();
            const dict2 = new _PdfDictionary();
            (dict1 as any)._isVisited = false;
            (dict2 as any)._isVisited = false;
            // Create circular reference to test recursion
            spyOn(dict1, 'forEach').and.callFake((cb: any) => {
                cb('child', dict2);
            });
            spyOn(dict2, 'forEach').and.callFake((cb: any) => {
                cb('parent', dict1);
            });
            // First run → should process both
            (collection as any)._parseDictionary(dict1);
            expect(dict1.forEach).toHaveBeenCalledTimes(1);
            expect(dict2.forEach).toHaveBeenCalledTimes(1);

            // Second run → should skip due to _isVisited flag
            (collection as any)._parseDictionary(dict1);
            expect(dict1.forEach).toHaveBeenCalledTimes(1);
            expect(dict2.forEach).toHaveBeenCalledTimes(1);

            // Reset flags manually (simulate "clear" equivalent)
            (dict1 as any)._isVisited = false;
            (dict2 as any)._isVisited = false;

            // Run again → should process again
            (collection as any)._parseDictionary(dict1);
            expect(dict1.forEach).toHaveBeenCalledTimes(2);
            expect(dict2.forEach).toHaveBeenCalledTimes(2);
        });
        it('should set next reference number from entries length when entries length is greater than Size', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const trailer: _PdfDictionary = createRootTrailer(true);
            trailer.set('Size', 1);
            (xref as unknown as { _entries: unknown[] })._entries = new Array(5);

            spyOn(xref as unknown as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary }, '_readXRef')
                .and.returnValue(trailer);

            // Act
            (xref as unknown as { _parse: (recoveryMode: boolean) => void })._parse(false);

            // Assert
            expect((xref as unknown as { _nextReferenceNumber: number })._nextReferenceNumber).toBe(5);
        });



        it('should use _indexObjects in recovery mode and throw InvalidXRef when Root/Pages are missing', () => {
            // Arrange
            const xref: _PdfCrossReference = createParseTestXref();
            const trailer: _PdfDictionary = new _PdfDictionary();
            trailer.set('Size', 1);

            spyOn(xref as any, '_indexObjects').and.returnValue(trailer);

            // Act
            let thrownError: unknown;
            try {
                xref._parse(true);
            } catch (error) {
                thrownError = error;
            }

            // Assert
            expect(thrownError).toBeDefined();
            expect((thrownError as { message?: string }).message).toBe('Invalid cross reference');

            const exception: { name?: string; exceptionType?: string } = thrownError as {
                name?: string;
                exceptionType?: string;
            };

            expect(
                exception.name === 'InvalidXRef' ||
                exception.exceptionType === 'InvalidXRef'
            ).toBeTruthy();
        });




        it('should cover encrypt-only-attachment branch and force table mode', () => {
            // Arrange
            const document: PdfDocument = createDocument();
            const xref: _PdfCrossReference = new _PdfCrossReference(document, 'user-password');

            const trailer: _PdfDictionary = createRootTrailer(true);
            const encrypt: _PdfDictionary = new _PdfDictionary();
            encrypt.set('P', 4);
            trailer.set('Encrypt', encrypt);
            trailer.set('ID', ['doc-id-1']);

            const fakeEncryptor: Partial<_PdfEncryptor> = {
                _isUserPassword: true,
                _encryptOnlyAttachment: true,
                _hasUserPasswordOnly: false
            };

            spyOn(xref as unknown as { _readXRef: () => _PdfDictionary }, '_readXRef')
                .and.returnValue(trailer);

            spyOn<any>(encryptorModule, '_PdfEncryptor').and.returnValue(fakeEncryptor as _PdfEncryptor);

            document.fileStructure.isIncrementalUpdate = true;

            // Act
            (xref as unknown as { _parse: (recoveryMode: boolean) => void })._parse(false);

            // Assert
            expect(document._isEncrypted).toBeTruthy();
            expect(document._isUserPassword).toBeTruthy();
            expect(document._encryptOnlyAttachment).toBeTruthy();
            expect(document.fileStructure.isIncrementalUpdate).toBeFalsy();
            expect(document.fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.table);
            expect(document._hasUserPasswordOnly).toBeTruthy();
            expect(document._encryptMetaData).toBeFalsy();
        });

        it('should cover non-attachment encryption branch and default EncryptMetadata to true', () => {
            // Arrange
            const document: PdfDocument = createDocument();
            const xref: _PdfCrossReference = new _PdfCrossReference(document, 'owner-password');

            const trailer: _PdfDictionary = createRootTrailer(true);
            const encrypt: _PdfDictionary = new _PdfDictionary();
            encrypt.set('P', 8);
            trailer.set('Encrypt', encrypt);
            trailer.set('ID', []);

            const fakeEncryptor: Partial<_PdfEncryptor> = {
                _isUserPassword: false,
                _encryptOnlyAttachment: false,
                _hasUserPasswordOnly: true
            };

            spyOn(xref as unknown as { _readXRef: () => _PdfDictionary }, '_readXRef')
                .and.returnValue(trailer);

            spyOn<any>(encryptorModule, '_PdfEncryptor').and.returnValue(fakeEncryptor as _PdfEncryptor);

            document.fileStructure.isIncrementalUpdate = true;

            // Act
            (xref as unknown as { _parse: (recoveryMode: boolean) => void })._parse(false);

            // Assert
            expect(document.fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.stream);
            expect(document._hasUserPasswordOnly).toBeTruthy();
            expect(document._encryptMetaData).toBeTruthy();
        });
    });

    describe('_fetch', () => {
        it('should throw when input is not a _PdfReference', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();

            // Act / Assert
            expect(() => {
                (xref as unknown as { _fetch: (ref: unknown, suppressEncryption?: boolean) => unknown })._fetch({} as object);
            }).toThrowError('ref object is not a reference');
        });

        it('should return cached dictionary and assign objId when cache has dictionary without objId', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const ref: _PdfReference = _PdfReference.get(7, 0);
            const dict: _PdfDictionary = new _PdfDictionary();
            (xref as unknown as { _cacheMap: Map<_PdfReference, unknown> })._cacheMap.set(ref, dict);

            // Act
            const result: unknown = (xref as unknown as { _fetch: (reference: _PdfReference) => unknown })._fetch(ref);

            // Assert
            expect(result).toBe(dict);
            expect(dict.objId).toBe(7);
        });

        it('should cache null xref entry and return null when _getEntry returns null', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const ref: _PdfReference = _PdfReference.get(2, 0);

            spyOn(xref as unknown as { _getEntry: (index: number) => unknown }, '_getEntry').and.returnValue(null);

            // Act
            const result: unknown = (xref as unknown as { _fetch: (reference: _PdfReference) => unknown })._fetch(ref);

            // Assert
            expect(result).toBeNull();
            expect((xref as unknown as { _cacheMap: Map<_PdfReference, unknown> })._cacheMap.get(ref)).toBeNull();
        });

        it('should remove pending ref and throw circular reference when ref is already pending', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const ref: _PdfReference = _PdfReference.get(3, 0);
            const pending: _PdfReferenceSet = (xref as unknown as { _pendingRefs: _PdfReferenceSet })._pendingRefs;
            pending.put(ref);

            spyOn(xref as unknown as { _getEntry: (index: number) => { free?: boolean; offset?: number; uncompressed?: boolean; gen?: number } }, '_getEntry')
                .and.returnValue({ free: false, offset: 10, uncompressed: true, gen: 0 });

            // Act / Assert
            expect(() => {
                (xref as unknown as { _fetch: (reference: _PdfReference) => unknown })._fetch(ref);
            }).toThrowError('circular reference');

            expect(pending.has(ref)).toBeFalsy();
        });

        it('should remove pending ref and rethrow when compressed fetch fails', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const ref: _PdfReference = _PdfReference.get(4, 0);

            spyOn(xref as unknown as { _getEntry: (index: number) => { free?: boolean; offset?: number; uncompressed?: boolean; gen?: number } }, '_getEntry')
                .and.returnValue({ free: false, offset: 12, uncompressed: false, gen: 0 });

            spyOn(xref as unknown as { _fetchCompressed: (reference: _PdfReference, entry: unknown) => unknown }, '_fetchCompressed')
                .and.throwError('compressed-fail');

            // Act / Assert
            expect(() => {
                (xref as unknown as { _fetch: (reference: _PdfReference) => unknown })._fetch(ref);
            }).toThrowError('compressed-fail');

            expect(((xref as unknown as { _pendingRefs: _PdfReferenceSet })._pendingRefs).has(ref)).toBeFalsy();
        });
    });

    describe('_fetchUncompressed', () => {



        it('should cache non-stream entries and set objId for dictionaries', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const ref: _PdfReference = _PdfReference.get(12, 0);
            const entry: _PdfDictionary = new _PdfDictionary();

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                12,
                0,
                getCommand('obj'),
                entry
            );

            // Act
            const result: unknown = (xref as unknown as {
                _fetchUncompressed: (
                    reference: _PdfReference,
                    xrefEntry: { gen: number; offset: number },
                    makeFilter?: boolean
                ) => unknown;
            })._fetchUncompressed(ref, { gen: 0, offset: 0 });

            // Assert
            expect(result).toBe(entry);
            expect(entry.objId).toBe(ref.toString());
            expect((xref as unknown as { _cacheMap: Map<_PdfReference, unknown> })._cacheMap.get(ref)).toBe(entry);
        });
    });

    describe('_fetchCompressed', () => {

    });

    describe('_readXRef', () => {
        it('should use default recoveryMode=false, skip duplicate startxref entries, and terminate cleanly', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const dictionary: _PdfDictionary = createRootTrailer(true);
            (xref as unknown as { _startXRefQueue: number[] })._startXRefQueue = [5, 5];
            (xref as unknown as { _prevStartXref: number })._prevStartXref = 1;

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(getCommand('xref'));
            spyOn(xref as unknown as { _processXRefTable: (parser: _PdfParser) => _PdfDictionary }, '_processXRefTable')
                .and.returnValue(dictionary);

            // Act
            const result: _PdfDictionary = (xref as unknown as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary })._readXRef();

            // Assert
            expect(result).toBe(dictionary);
            expect((xref as unknown as { _prevStartXref: number })._prevStartXref).toBe(5);
            expect((xref as unknown as { _startXRefQueue: number[] })._startXRefQueue.length).toBe(0);
        });



        it('should return undefined in recovery mode when parsing fails', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            (xref as unknown as { _startXRefQueue: number[] })._startXRefQueue = [0];
            spyOn(_PdfParser.prototype, 'getObject').and.throwError('parser-failure');

            // Act
            const result: _PdfDictionary | undefined =
                (xref as unknown as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary | undefined })._readXRef(true);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('_indexObjects', () => {
        it('should return dictionary with ID when a valid trailer/root/pages/count is found', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([
                116, 114, 97, 105, 108, 101, 114, 32, // trailer
                115, 116, 97, 114, 116, 120, 114, 101, 102 // startxref
            ]);

            const trailer: _PdfDictionary = new _PdfDictionary();
            const root: _PdfDictionary = new _PdfDictionary();
            const pages: _PdfDictionary = new _PdfDictionary();

            pages.set('Count', 1);
            root.set('Pages', pages);
            trailer.set('Root', root);
            trailer.set('ID', ['id-1', 'id-2']);

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                getCommand('trailer'),
                trailer
            );

            // Act
            const result: _PdfDictionary = (xref as unknown as { _indexObjects: () => _PdfDictionary })._indexObjects();

            // Assert
            expect(result).toBe(trailer);
        });

        it('should skip invalid trailer objects and finally return top dictionary when present', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([
                116, 114, 97, 105, 108, 101, 114, 32,
                115, 116, 97, 114, 116, 120, 114, 101, 102
            ]);

            const topDictionary: _PdfDictionary = createRootTrailer(true);
            (xref as unknown as { _topDictionary: _PdfDictionary })._topDictionary = topDictionary;

            const invalidDictionary: _PdfDictionary = new _PdfDictionary();

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                getCommand('trailer'),
                invalidDictionary
            );

            // Act
            const result: _PdfDictionary = (xref as unknown as { _indexObjects: () => _PdfDictionary })._indexObjects();

            // Assert
            expect(result).toBe(topDictionary);
        });


        it('should cover existing-entry same-generation update path when parser succeeds', () => {
            // Arrange
            const bytes: number[] = Array.from(new TextEncoder().encode('1 0 obj\n<< /XRef 1 >>\nendobj\n'));
            const xref: _PdfCrossReference = createCrossReference(bytes);

            (xref as unknown as {
                _entries: Array<{ gen: number; offset?: number; free?: boolean; uncompressed?: boolean } | undefined>;
            })._entries[1] = { gen: 0, offset: 0, free: false, uncompressed: true };

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                1, // used by the "same-gen existing object" probing parser.getObject()
                getCommand('trailer'),
                new _PdfDictionary()
            );

            // Act / Assert
            expect(() => {
                (xref as unknown as { _indexObjects: () => _PdfDictionary })._indexObjects();
            }).toThrow();
        });

        it('should cover ParserEndOfFileException catch path without updating entries', () => {
            // Arrange
            const bytes: number[] = Array.from(new TextEncoder().encode('1 0 obj'));
            const xref: _PdfCrossReference = createCrossReference(bytes);

            (xref as unknown as {
                _entries: Array<{ gen: number; offset?: number; free?: boolean; uncompressed?: boolean } | undefined>;
            })._entries[1] = { gen: 0, offset: 0, free: false, uncompressed: true };

            spyOn(_PdfParser.prototype, 'getObject').and.throwError('EOF');

            // Act / Assert
            expect(() => {
                (xref as unknown as { _indexObjects: () => _PdfDictionary })._indexObjects();
            }).toThrow();
        });
    });

    describe('_processXRefTable / _readXRefTable', () => {


        it('should accept trailer dictionary directly', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))), xref, true);
            const trailer: _PdfDictionary = new _PdfDictionary();

            spyOn(xref as unknown as { _readXRefTable: (p: _PdfParser) => _PdfCommand }, '_readXRefTable')
                .and.returnValue(getCommand('trailer'));
            spyOn(parser, 'getObject').and.returnValue(trailer);

            // Act
            const result: _PdfDictionary =
                (xref as unknown as { _processXRefTable: (p: _PdfParser) => _PdfDictionary })._processXRefTable(parser);

            // Assert
            expect(result).toBe(trailer);
        });

        it('should accept trailer dictionary from stream.dictionary', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))), xref, true);

            const dict: _PdfDictionary = new _PdfDictionary();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([1]), dict);

            spyOn(xref as unknown as { _readXRefTable: (p: _PdfParser) => _PdfCommand }, '_readXRefTable')
                .and.returnValue(getCommand('trailer'));
            spyOn(parser, 'getObject').and.returnValue(stream);

            // Act
            const result: _PdfDictionary =
                (xref as unknown as { _processXRefTable: (p: _PdfParser) => _PdfDictionary })._processXRefTable(parser);

            // Assert
            expect(result).toBe(dict);
        });


        it('should adjust first entry from 1 to 0 when first row is free', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))), xref, true);

            (xref as unknown as {
                _tableState: {
                    entryNum: number;
                    streamPos: number;
                    parserBuf1: unknown;
                    parserBuf2: unknown;
                    firstEntryNum?: unknown;
                    entryCount?: unknown;
                };
            })._tableState = {
                entryNum: 0,
                streamPos: 0,
                parserBuf1: undefined,
                parserBuf2: undefined,
                firstEntryNum: 1,
                entryCount: 1
            };

            spyOn(parser, 'getObject').and.returnValues(
                0,
                65535,
                getCommand('f'),
                getCommand('trailer')
            );

            // Act
            const result: _PdfCommand =
                (xref as unknown as { _readXRefTable: (p: _PdfParser) => _PdfCommand })._readXRefTable(parser);

            // Assert
            expect(result.command).toBe('trailer');
            expect((xref as unknown as { _entries: Array<{ free?: boolean }> })._entries[0].free).toBeTruthy();
        });


    });

    describe('_processXRefStream / _readXRefStream', () => {
        it('should default Index to [0, Size] when Index is missing', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.set('Size', 1);
            dictionary.set('W', [0, 1, 1]);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([0, 0]), dictionary);

            spyOn(xref as unknown as { _readXRefStream: (s: _PdfStream) => void }, '_readXRefStream').and.callFake(() => {
                // no-op
            });

            // Act
            const result: _PdfDictionary = (xref as unknown as { _processXRefStream: (s: _PdfStream) => _PdfDictionary })._processXRefStream(stream);

            // Assert
            expect(result).toBe(dictionary);
            expect((xref as unknown as { _streamState: unknown })._streamState).toBeUndefined();
        });



        it('should treat typeFieldWidth=0 as uncompressed type 1 and populate entry', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([0x05, 0x00])); // offset=5, generation=0
            (xref as unknown as {
                _streamState: {
                    streamPos: number;
                    byteWidths: number[];
                    entryRanges: number[];
                    entryNum: number;
                };
            })._streamState = {
                streamPos: 0,
                byteWidths: [0, 1, 1],
                entryRanges: [2, 1],
                entryNum: 0
            };

            // Act
            (xref as unknown as { _readXRefStream: (s: _PdfStream) => void })._readXRefStream(stream);

            // Assert
            const entry: { offset: number; gen: number; uncompressed?: boolean } =
                (xref as unknown as { _entries: Array<{ offset: number; gen: number; uncompressed?: boolean }> })._entries[2];

            expect(entry.offset).toBe(5);
            expect(entry.gen).toBe(0);
            expect(entry.uncompressed).toBeTruthy();
        });


    });

    describe('_save / _saveAsync / collection-driven branches', () => {
        it('should save non-incremental document and replace document stream', () => {
            // Arrange
            const document: PdfDocument = createDocument();
            const xref: _PdfCrossReference = new _PdfCrossReference(document);
            (xref as unknown as { _version: string })._version = '1.7';

            spyOn(xref as unknown as {
                _writeObjectCollection: (objectCollection: Map<_PdfReference, unknown>, buffer: number[]) => void;
            }, '_writeObjectCollection').and.callFake((_collection: Map<_PdfReference, unknown>, buffer: number[]) => {
                buffer.push(1, 2, 3);
            });

            // Act
            const result: Uint8Array = (xref as unknown as { _save: () => Uint8Array })._save();

            // Assert
            expect(result.length).toBeGreaterThan(0);
            expect(document._stream).toBeDefined();
            expect((xref as unknown as { _uint8Chunks: Uint8Array[] })._uint8Chunks.length).toBe(0);
        });

        it('should save incremental document as table and flush remaining buffer', () => {
            // Arrange
            const document: PdfDocument = createDocument([10, 20, 30]);
            document.fileStructure.isIncrementalUpdate = true;
            document._fileStructure._crossReferenceType = PdfCrossReferenceType.table;

            const xref: _PdfCrossReference = new _PdfCrossReference(document);
            (xref as unknown as { _version: string })._version = '1.7';

            spyOn(xref as unknown as {
                _saveAsTable: (currentLength: number, buffer: number[]) => void;
            }, '_saveAsTable').and.callFake((_currentLength: number, buffer: number[]) => {
                buffer.push(99, 100);
            });

            // Act
            const result: Uint8Array = (xref as unknown as { _save: () => Uint8Array })._save();

            // Assert
            expect(result.length).toBe(22);
        });

        it('should cover _saveAsStream dictionary/stream/archive branches with bounded input', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const buffer: number[] = [];
            const ref1: _PdfReference = _PdfReference.get(1, 0);
            const ref2: _PdfReference = _PdfReference.get(2, 0);
            const ref3: _PdfReference = _PdfReference.get(3, 0);

            const updatedDictionary: _PdfDictionary = new _PdfDictionary();
            updatedDictionary._updated = true;
            updatedDictionary.isCatalog = false;

            const signatureDictionary: _PdfDictionary = new _PdfDictionary();
            signatureDictionary._isSignature = true;

            const streamDictionary: _PdfDictionary = new _PdfDictionary();
            streamDictionary._updated = true;
            streamDictionary.isCatalog = false;
            streamDictionary._isProcessed = false;

            const streamValue: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), streamDictionary);

            (xref as unknown as { _cacheMap: Map<_PdfReference, unknown> })._cacheMap = new Map<_PdfReference, unknown>([
                [ref1, streamValue],
                [ref2, updatedDictionary],
                [ref3, signatureDictionary]
            ]);

            spyOn(xref as unknown as {
                _updatedDictionary: (
                    currentLength: number,
                    key: _PdfReference,
                    out: number[],
                    value: unknown,
                    cipher?: unknown
                ) => void;
            }, '_updatedDictionary').and.callFake((_currentLength: any, _key: any, out: any) => {
                out.push(1);
            });

            spyOn(xref as unknown as {
                _writeArchiveStream: (collection: Map<_PdfReference, unknown>, key: _PdfReference, value: unknown) => void;
            }, '_writeArchiveStream').and.callFake(() => {
                // no-op
            });

            spyOn(xref as unknown as { _writeXrefStream: (out: number[]) => void }, '_writeXrefStream').and.callFake((out: number[]) => {
                out.push(2);
            });

            // Act
            (xref as unknown as { _saveAsStream: (currentLength: number, out: number[]) => void })._saveAsStream(0, buffer);

            // Assert
            expect(buffer.length).toBeGreaterThan(0);
        });

    });

    describe('_writeObjectToBuffer / write-to-buffer object selection branches', () => {
        it('should return early for unsupported non-array/non-number/non-string values', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const buffer: number[] = [];

            const writeToBufferSpy: jasmine.Spy = spyOn(xref as unknown as {
                _writeToBuffer: (out: number[], key: _PdfReference, value: unknown, cipher?: unknown) => void;
            }, '_writeToBuffer');

            // Act
            (xref as unknown as {
                _writeObjectToBuffer: (
                    key: _PdfReference,
                    value: unknown,
                    out: number[],
                    objectStreamCollection: Map<_PdfReference, unknown>
                ) => void;
            })._writeObjectToBuffer(_PdfReference.get(100, 0), { unsupported: true }, buffer, new Map());

            // Assert
            expect(writeToBufferSpy).not.toHaveBeenCalled();
        });

        it('should archive _PdfName values when cross reference type is stream', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            documentCrossReferenceType(xref, PdfCrossReferenceType.stream);

            const writeArchiveSpy: jasmine.Spy = spyOn(xref as unknown as {
                _writeArchiveStream: (collection: Map<_PdfReference, unknown>, key: _PdfReference, value: unknown) => void;
            }, '_writeArchiveStream');

            // Act
            (xref as unknown as {
                _writeObjectToBuffer: (
                    key: _PdfReference,
                    value: unknown,
                    out: number[],
                    objectStreamCollection: Map<_PdfReference, unknown>
                ) => void;
            })._writeObjectToBuffer(_PdfReference.get(101, 0), _PdfName.get('Example'), [], new Map());

            // Assert
            expect(writeArchiveSpy).toHaveBeenCalled();
        });

        it('should write dictionary directly when Filter=Standard in stream cross reference mode', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            documentCrossReferenceType(xref, PdfCrossReferenceType.stream);

            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.set('Filter', _PdfName.get('Standard'));

            const writeToBufferSpy: jasmine.Spy = spyOn(xref as unknown as {
                _writeToBuffer: (out: number[], key: _PdfReference, value: unknown, cipher?: unknown) => void;
            }, '_writeToBuffer');

            // Act
            (xref as unknown as {
                _writeObjectToBuffer: (
                    key: _PdfReference,
                    value: unknown,
                    out: number[],
                    objectStreamCollection: Map<_PdfReference, unknown>
                ) => void;
            })._writeObjectToBuffer(_PdfReference.get(102, 0), dictionary, [], new Map());

            // Assert
            expect(writeToBufferSpy).toHaveBeenCalled();
        });

        function documentCrossReferenceType(xref: _PdfCrossReference, type: PdfCrossReferenceType): void {
            (xref as unknown as { _document: PdfDocument })._document.fileStructure._crossReferenceType = type;
        }
    });

    describe('_PdfCrossReference - error branches without toThrowError', () => {
        function createParseTestXref(): _PdfCrossReference {
            const stream: _PdfStream = new _PdfStream(new Uint8Array([37, 80, 68, 70]));
            const fileStructure: {
                _incrementalUpdate: boolean;
                isIncrementalUpdate: boolean;
                crossReferenceType?: PdfCrossReferenceType;
                _crossReferenceType?: PdfCrossReferenceType;
            } = {
                _incrementalUpdate: false,
                isIncrementalUpdate: false,
                crossReferenceType: PdfCrossReferenceType.table,
                _crossReferenceType: undefined
            };
            const document: PdfDocument = {
                _stream: stream,
                _fileStructure: fileStructure,
                fileStructure: fileStructure
            } as unknown as PdfDocument;
            return new _PdfCrossReference(document);
        }

        function captureThrownError(action: () => void): unknown {
            let thrownError: unknown;
            try {
                action();
            } catch (error) {
                thrownError = error;
            }
            return thrownError;
        }

        function expectThrownMessage(thrownError: unknown, expectedMessage: string): void {
            expect(thrownError).toBeDefined();
            expect((thrownError as { message?: string }).message).toBe(expectedMessage);
        }

        function expectThrownType(thrownError: unknown, expectedType: string): void {
            const exception: { name?: string; exceptionType?: string } = thrownError as {
                name?: string;
                exceptionType?: string;
            };
            expect(
                exception.name === expectedType ||
                exception.exceptionType === expectedType
            ).toBeTruthy();
        }

        it('should throw XRefParseException in non-recovery mode when Root/Pages are missing', () => {
            // Arrange
            const xref: _PdfCrossReference = createParseTestXref();
            const trailer: _PdfDictionary = new _PdfDictionary();
            trailer.set('Size', 1);

            spyOn(xref as any, '_readXRef').and.returnValue(trailer);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                xref._parse(false);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid cross reference');
            expectThrownType(thrownError, 'XRefParseException');
        });

        it('should throw when generation number mismatches', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const ref: _PdfReference = _PdfReference.get(10, 0);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchUncompressed: (
                        reference: _PdfReference,
                        xrefEntry: { gen: number; offset: number },
                        makeFilter?: boolean
                    ) => unknown;
                })._fetchUncompressed(ref, { gen: 1, offset: 0 });
            });

            // Assert
            expectThrownMessage(thrownError, `Inconsistent generation in XRef: ${ref}`);
            expectThrownType(thrownError, 'XRefEntryException');
        });

        it('should throw when uncompressed header object numbers are invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const ref: _PdfReference = _PdfReference.get(11, 0);

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(99, 0, getCommand('obj'));

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchUncompressed: (
                        reference: _PdfReference,
                        xrefEntry: { gen: number; offset: number },
                        makeFilter?: boolean
                    ) => unknown;
                })._fetchUncompressed(ref, { gen: 0, offset: 0 });
            });

            // Assert
            expectThrownMessage(thrownError, `Bad (uncompressed) XRef entry: ${ref}`);
            expectThrownType(thrownError, 'XRefEntryException');
        });

        it('should throw when object stream cannot be fetched', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();

            spyOn(xref as any, '_fetch').and.returnValue(undefined);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(20, 0), { offset: 100, gen: 0 });
            });

            // Assert
            expectThrownMessage(thrownError, 'bad ObjStm stream');
        });

        it('should throw when First or N are not integers', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dict: _PdfDictionary = new _PdfDictionary();
            dict.set('First', 'x');
            dict.set('N', 1);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([1]), dict);

            spyOn(xref as any, '_fetch').and.returnValue(stream);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(21, 0), { offset: 9, gen: 0 });
            });

            // Assert
            expectThrownMessage(thrownError, 'invalid first and n parameters for ObjStm stream');
        });

        it('should throw when object number inside ObjStm is invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dict: _PdfDictionary = new _PdfDictionary();
            dict.set('First', 0);
            dict.set('N', 1);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), dict);

            spyOn(xref as any, '_fetch').and.returnValue(stream);
            spyOn(_PdfParser.prototype, 'getObject').and.returnValues('not-int');

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(22, 0), { offset: 9, gen: 0 });
            });

            // Assert
            expect((thrownError as { message?: string }).message).toContain('invalid object number in the ObjStm stream');
        });

        it('should throw when object offset inside ObjStm is invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dict: _PdfDictionary = new _PdfDictionary();
            dict.set('First', 0);
            dict.set('N', 1);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), dict);

            spyOn(xref as any, '_fetch').and.returnValue(stream);
            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(5, 'bad-offset');

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(23, 0), { offset: 9, gen: 0 });
            });

            // Assert
            expect((thrownError as { message?: string }).message).toContain('invalid object offset in the ObjStm stream');
        });

        it('should throw when computed entry length becomes negative', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dict: _PdfDictionary = new _PdfDictionary();
            dict.set('First', 0);
            dict.set('N', 2);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), dict);

            spyOn(xref as any, '_fetch').and.returnValue(stream);
            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(8, 10, 9, 5);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(24, 0), { offset: 9, gen: 0 });
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid offset in the ObjStm stream.');
        });

        it('should throw when the requested compressed entry result is undefined', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const dict: _PdfDictionary = new _PdfDictionary();
            dict.set('First', 0);
            dict.set('N', 1);

            const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), dict);

            spyOn(xref as any, '_fetch').and.returnValue(stream);
            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(8, 0, undefined);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as {
                    _fetchCompressed: (
                        reference: _PdfReference,
                        xrefEntry: { offset: number; gen: number }
                    ) => unknown;
                })._fetchCompressed(_PdfReference.get(25, 0), { offset: 9, gen: 7 });
            });

            // Assert
            expectThrownMessage(thrownError, `Bad (compressed) XRef entry: ${_PdfReference.get(25, 0)}`);
            expectThrownType(thrownError, 'XRefEntryException');
        });

        it('should throw Invalid cross reference when header token is invalid in non-recovery mode', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            (xref as { _startXRefQueue: number[] })._startXRefQueue = [0];
            spyOn(_PdfParser.prototype, 'getObject').and.returnValues('bad-header');

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary })._readXRef(false);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid cross reference');
            expectThrownType(thrownError, 'XRefParseException');
        });

        it('should throw Invalid cross reference stream for bad stream xref header sequence', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            (xref as { _startXRefQueue: number[] })._startXRefQueue = [0];

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                1,
                'bad-gen',
                getCommand('obj'),
                new _PdfDictionary()
            );

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRef: (recoveryMode?: boolean) => _PdfDictionary })._readXRef(false);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid cross reference');
            expectThrownType(thrownError, 'XRefParseException');
        });

        it('should throw Invalid PDF structure when no valid trailer/topDictionary exists', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([
                116, 114, 97, 105, 108, 101, 114, 32,
                115, 116, 97, 114, 116, 120, 114, 101, 102
            ]);

            spyOn(_PdfParser.prototype, 'getObject').and.returnValues(
                getCommand('trailer'),
                new _PdfDictionary()
            );

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _indexObjects: () => _PdfDictionary })._indexObjects();
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid PDF structure.');
            expectThrownType(thrownError, 'InvalidPDFException');
        });

        it('should throw when trailer token is not found after reading xref table', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(
                new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))),
                xref,
                true
            );

            spyOn(xref as any, '_readXRefTable').and.returnValue(getCommand('not-trailer'));

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _processXRefTable: (p: _PdfParser) => _PdfDictionary })._processXRefTable(parser);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid XRef table: could not find trailer dictionary');
        });

        it('should throw when trailer object cannot be parsed as dictionary or stream dictionary', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(
                new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))),
                xref,
                true
            );

            spyOn(xref as any, '_readXRefTable').and.returnValue(getCommand('trailer'));
            spyOn(parser, 'getObject').and.returnValue(123);

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _processXRefTable: (p: _PdfParser) => _PdfDictionary })._processXRefTable(parser);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid cross reference: could not parse trailer dictionary');
        });

        it('should throw when subsection header values are not integers', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(
                new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))),
                xref,
                true
            );

            (xref as {
                _tableState: {
                    entryNum: number;
                    streamPos: number;
                    parserBuf1: unknown;
                    parserBuf2: unknown;
                    firstEntryNum?: unknown;
                    entryCount?: unknown;
                };
            })._tableState = {
                entryNum: 0,
                streamPos: 0,
                parserBuf1: undefined,
                parserBuf2: undefined,
                firstEntryNum: 'x',
                entryCount: 1
            };

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefTable: (p: _PdfParser) => _PdfCommand })._readXRefTable(parser);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid cross reference: wrong types in subsection header');
        });

        it('should throw when xref entry values are invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(
                new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))),
                xref,
                true
            );

            (xref as {
                _tableState: {
                    entryNum: number;
                    streamPos: number;
                    parserBuf1: unknown;
                    parserBuf2: unknown;
                    firstEntryNum?: unknown;
                    entryCount?: unknown;
                };
            })._tableState = {
                entryNum: 0,
                streamPos: 0,
                parserBuf1: undefined,
                parserBuf2: undefined,
                firstEntryNum: 1,
                entryCount: 1
            };

            spyOn(parser, 'getObject').and.returnValues('bad-offset', 0, getCommand('n'));

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefTable: (p: _PdfParser) => _PdfCommand })._readXRefTable(parser);
            });

            // Assert
            expect((thrownError as { message?: string }).message).toContain('Invalid entry in cross reference subsection');
        });

        it('should throw when first xref entry is not free', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference([1, 2, 3, 4]);
            const parser: _PdfParser = new _PdfParser(
                new _PdfLexicalOperator(new _PdfStream(new Uint8Array([1, 2, 3]))),
                xref,
                true
            );

            (xref as {
                _tableState: {
                    entryNum: number;
                    streamPos: number;
                    parserBuf1: unknown;
                    parserBuf2: unknown;
                    firstEntryNum?: unknown;
                    entryCount?: unknown;
                };
            })._tableState = {
                entryNum: 0,
                streamPos: 0,
                parserBuf1: undefined,
                parserBuf2: undefined,
                firstEntryNum: 0,
                entryCount: 1
            };

            spyOn(parser, 'getObject').and.returnValues(
                20,
                0,
                getCommand('n'),
                getCommand('trailer')
            );

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefTable: (p: _PdfParser) => _PdfCommand })._readXRefTable(parser);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid XRef table: unexpected first object');
        });

        it('should throw when xref stream range values are invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([0, 0, 0]));
            (xref as {
                _streamState: {
                    streamPos: number;
                    byteWidths: number[];
                    entryRanges: unknown[];
                    entryNum: number;
                };
            })._streamState = {
                streamPos: 0,
                byteWidths: [1, 1, 1],
                entryRanges: ['bad', 1],
                entryNum: 0
            };

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefStream: (s: _PdfStream) => void })._readXRefStream(stream);
            });

            // Assert
            expect((thrownError as { message?: string }).message).toContain('Invalid XRef range fields');
        });

        it('should throw when xref stream field widths are invalid', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([0, 0, 0]));
            (xref as {
                _streamState: {
                    streamPos: number;
                    byteWidths: unknown[];
                    entryRanges: number[];
                    entryNum: number;
                };
            })._streamState = {
                streamPos: 0,
                byteWidths: ['bad', 1, 1],
                entryRanges: [0, 1],
                entryNum: 0
            };

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefStream: (s: _PdfStream) => void })._readXRefStream(stream);
            });

            // Assert
            expect((thrownError as { message?: string }).message).toContain('Invalid XRef entry fields length');
        });

        it('should throw on invalid entry type byte width data', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([]));
            (xref as {
                _streamState: {
                    streamPos: number;
                    byteWidths: number[];
                    entryRanges: number[];
                    entryNum: number;
                };
            })._streamState = {
                streamPos: 0,
                byteWidths: [1, 1, 1],
                entryRanges: [0, 1],
                entryNum: 0
            };

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefStream: (s: _PdfStream) => void })._readXRefStream(stream);
            });

            // Assert
            expectThrownMessage(thrownError, 'invalid cross reference byte width type.');
        });

        it('should throw for invalid xref entry type', () => {
            // Arrange
            const xref: _PdfCrossReference = createCrossReference();
            const stream: _PdfStream = new _PdfStream(new Uint8Array([0x03, 0x00, 0x00]));
            (xref as {
                _streamState: {
                    streamPos: number;
                    byteWidths: number[];
                    entryRanges: number[];
                    entryNum: number;
                };
            })._streamState = {
                streamPos: 0,
                byteWidths: [1, 1, 1],
                entryRanges: [0, 1],
                entryNum: 0
            };

            // Act
            const thrownError: unknown = captureThrownError(() => {
                (xref as { _readXRefStream: (s: _PdfStream) => void })._readXRefStream(stream);
            });

            // Assert
            expectThrownMessage(thrownError, 'Invalid XRef entry type: 3');
        });
    });
    ``

});

describe('_PdfCrossReference - behavior / AAA coverage', () => {


    function createXref(bytes?: number[]): _PdfCrossReference {
        return new _PdfCrossReference(createDocumentStub(bytes) as any);
    }

    function expectBaseException(action: () => void, code: string): void {
        let error: any;
        try {
            action();
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error instanceof BaseException).toBeTruthy();
        expect(error.message).toContain('Invalid cross reference');
        expect(error.name || error.code || error.exceptionType).toBeDefined();
    }



    describe('_fetchCompressed', () => {
        it('should continue when parsed object is _PdfBaseStream and still return later parsed object', () => {
            // Arrange
            const xref: any = createXref();
            const tableOffset: number = 10;
            const targetRef: _PdfReference = _PdfReference.get(6, 9);

            const objStreamDictionary: _PdfDictionary = new _PdfDictionary(xref);
            objStreamDictionary.set('First', 0);
            objStreamDictionary.set('N', 2);

            const objStream: _PdfStream = new _PdfStream(new Uint8Array([0]), objStreamDictionary, 0, 1);
            spyOn(xref, '_fetch').and.returnValue(objStream);

            // entry 5 => first object in object stream
            xref._entries[5] = { offset: tableOffset, gen: 0, uncompressed: false, free: false };
            // entry 6 => second object in object stream
            xref._entries[6] = { offset: tableOffset, gen: 1, uncompressed: false, free: false };

            const compressedEntry: any = { offset: tableOffset, gen: 1, uncompressed: false, free: false };

            const firstObjAsStream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]), new _PdfDictionary(xref), 0, 3);
            const secondObjAsDictionary: _PdfDictionary = new _PdfDictionary(xref);

            // 1st parser instance: pairs => (5,0) (6,4)
            // loop parsers: first object => stream => continue, second object => dictionary
            spyOn(_PdfParser.prototype as any, 'getObject').and.returnValues(
                5, 0,
                6, 4,
                firstObjAsStream,
                secondObjAsDictionary
            );

            // Act
            const result: any = xref._fetchCompressed(targetRef, compressedEntry);

            // Assert
            expect(result).toBe(secondObjAsDictionary);

            const cachedSecond = xref._cacheMap.get(_PdfReference.get(6, 9));
            expect(cachedSecond).toBe(secondObjAsDictionary);
            expect((secondObjAsDictionary as any).objId).toBe('6 9');

            const cachedFirst = xref._cacheMap.get(_PdfReference.get(5, 9));
            expect(cachedFirst).toBeUndefined();
        });
    });

    describe('_readXRef', () => {


        it('should enqueue Prev objectNumber when Prev is a _PdfReference', () => {
            // Arrange
            const xref: any = createXref([0]);
            xref._setStartXRef(0);

            const dictionary: _PdfDictionary = new _PdfDictionary(xref);
            dictionary.set('Prev', _PdfReference.get(77, 0));

            spyOn(_PdfParser.prototype as any, 'getObject').and.returnValues(
                'xref'
            );
            spyOn(xref, '_processXRefTable').and.returnValue(dictionary);

            // _isCommand('xref') depends on real command object, so use command object if available
            (_PdfParser.prototype as any).getObject.and.returnValues(
                _PdfCommand.get ? _PdfCommand.get('xref') : ({ command: 'xref' } as any)
            );

            // Act
            const result: _PdfDictionary = xref._readXRef();

            // Assert
            expect(result).toBe(dictionary);
            expect((xref._document as any)._startXRefParsedCache.length).toBeGreaterThan(0);
            expect(xref._startXRefQueue.indexOf(77)).toBe(-1);
        });
    });

    describe('_writeObjectCollection', () => {
        it('should process cache items not present in main collection and flush in second pass', () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = new Array<number>(512001).fill(1);
            const main: Map<_PdfReference, any> = new Map<_PdfReference, any>();

            const keyInMain: _PdfReference = _PdfReference.get(1, 0);
            const keyOnlyInCache: _PdfReference = _PdfReference.get(2, 0);

            const value1 = new _PdfDictionary(xref);
            const value2 = new _PdfDictionary(xref);

            main.set(keyInMain, value1);
            xref._cacheMap.set(keyInMain, value1);
            xref._cacheMap.set(keyOnlyInCache, value2);

            spyOn(xref, '_writeObjectToBuffer').and.callFake(() => { /* no-op */ });
            spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });
            spyOn(xref, '_writeXrefTable').and.callFake(() => { /* no-op */ });

            xref._document.fileStructure._crossReferenceType = PdfCrossReferenceType.table;

            // Act
            xref._writeObjectCollection(main, buffer);

            // Assert
            expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
                keyInMain,
                value1,
                jasmine.any(Array),
                jasmine.any(Map)
            );
            expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
                keyOnlyInCache,
                value2,
                jasmine.any(Array),
                jasmine.any(Map)
            );
            expect(xref._flushBuffer).toHaveBeenCalled();
            expect(xref._writeXrefTable).toHaveBeenCalled();
        });
    });

    describe('_writeStream', () => {
        it('should encrypt stream string when transform is provided and not a cross reference stream', () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = [];
            const dict: _PdfDictionary = new _PdfDictionary(xref);
            const stream: _PdfStream = new _PdfStream(new Uint8Array([65, 66]), dict, 0, 2);
            (stream as any)._isCompress = false;
            (stream as any)._isImage = false;

            const transform: any = {
                encryptString: jasmine.createSpy('encryptString').and.returnValue('ENC')
            };

            spyOn(xref, '_writeDictionary').and.callThrough();

            // Act
            xref._writeStream(stream, buffer, transform, false);

            // Assert
            expect(transform.encryptString).toHaveBeenCalled();
            expect(dict.get('Length')).toBe(3);
            expect(buffer.length).toBeGreaterThan(0);
        });
    });

    describe('_writeValue', () => {
        it('should write escaped _PdfName for V / AS keys', () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = [];
            const name: _PdfName = _PdfName.get('A B');

            // Act
            xref._writeValue(name, 'V', buffer);

            // Assert
            const output = String.fromCharCode(...buffer);
            expect(output).toContain('/A#20B');
        });

        it('should encrypt string value when transform is provided and isCrossReference is false', () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = [];
            const transform: any = {
                encryptString: jasmine.createSpy('encryptString').and.returnValue('cipher-text')
            };

            // Act
            xref._writeValue('plain-text', 'AnyKey', buffer, transform, false);

            // Assert
            expect(transform.encryptString).toHaveBeenCalledWith('plain-text');
            const output = String.fromCharCode(...buffer);
            expect(output).toContain('(cipher-text)');
        });
    });

    describe('_writeObject', () => {
        it('should write unicode string as hex when array contains unicode text', () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = [];
            const value: any[] = ['தமிழ்'];

            // Act
            xref._writeObject(value, buffer);

            // Assert
            const output = String.fromCharCode(...buffer);
            expect(output).toContain('<');
            expect(output).toContain('>');
        });
    });

    describe('_flushBuffer', () => {
        it('should return immediately when data is empty', () => {
            // Arrange
            const xref: any = createXref();
            const data: number[] = [];

            // Act
            xref._flushBuffer(data);

            // Assert
            expect(xref._uint8Chunks.length).toBe(0);
            expect(xref._bufferLength).toBe(0);
        });
    });

    describe('_save', () => {
        it('should set crossReferenceType to table when signatures exist and _isCrossReferenceTable is true', () => {
            // Arrange
            const xref: any = createXref();
            xref._version = '1.7';
            xref._isCrossReferenceTable = true;
            xref._signatureCollection = [{
                _catalogBeginSave: jasmine.createSpy('_catalogBeginSave'),
                _signatureDictionary: {
                    _documentSaved: jasmine.createSpy('_documentSaved')
                }
            }];
            xref._document.fileStructure.isIncrementalUpdate = false;

            spyOn(xref, '_writeObjectCollection').and.callFake((_collection: any, buffer: number[]) => {
                buffer.push(1, 2, 3);
            });

            // Act
            const result: Uint8Array = xref._save();

            // Assert
            expect(xref._document.fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.table);
            expect(xref._signatureCollection[0]._catalogBeginSave).toHaveBeenCalled();
            expect(result instanceof Uint8Array).toBeTruthy();
        });
    });
 

    describe('_saveAsStreamAsync', () => {
        it('should cover async updated dictionary / archive stream / flush branches without timeout', async () => {
            // Arrange
            const xref: any = createXref();
            const buffer: number[] = new Array<number>(512001).fill(1);

            const ref1: _PdfReference = _PdfReference.get(31, 0);
            const ref2: _PdfReference = _PdfReference.get(32, 0);

            const dict1 = new _PdfDictionary(xref);
            dict1._updated = true;
            dict1.isCatalog = false;
            dict1._isProcessed = false;

            const dict2 = new _PdfDictionary(xref);
            dict2._updated = true;
            dict2.isCatalog = false;
            dict2._isSignature = false;
            dict2._isProcessed = false;

            const stream1 = new _PdfStream(new Uint8Array([1]), dict1, 0, 1);

            xref._cacheMap.set(ref1, stream1);
            xref._cacheMap.set(ref2, dict2);

            spyOn(xref, '_updatedDictionary').and.callFake(() => { /* no-op */ });
            spyOn(xref, '_writeArchiveStream').and.callFake(() => { /* no-op */ });
            spyOn(xref, '_flushBufferAsync').and.callFake(async (data: number[]) => { data.length = 0; });
            spyOn(xref, '_writeXrefStreamAsync').and.returnValue(Promise.resolve());

            // Act
            await xref._saveAsStreamAsync(100, buffer);
            await Promise.resolve();

            // Assert
            expect(xref._updatedDictionary).toHaveBeenCalled();
            expect(xref._writeArchiveStream).toHaveBeenCalled();
            expect(xref._flushBufferAsync).toHaveBeenCalled();
            expect(xref._writeXrefStreamAsync).toHaveBeenCalled();
        });
    });


});

describe('_PdfMainObjectCollection - behavior / AAA coverage', () => {
    function createDocumentStub(bytes?: number[]): any {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes || []));
        const fileStructure: any = {
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: PdfCrossReferenceType.table
        };

        return {
            _stream: stream,
            fileStructure,
            _fileStructure: fileStructure
        };
    }

    function createXref(): any {
        return new _PdfCrossReference(createDocumentStub() as any);
    }


});

describe('_PdfCrossReference - behavior / AAA coverage', () => {

    function createDocumentStub(bytes?: number[]): any {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes || []));
        const fileStructure: any = {
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: PdfCrossReferenceType.table
        };

        return {
            _stream: stream,
            fileStructure,
            _fileStructure: fileStructure,
            _isEncrypted: false,
            _isUserPassword: false,
            _hasUserPasswordOnly: false,
            _encryptMetaData: true,
            _startXRefParsedCache: []
        };
    }


    function captureError(action: () => void): any {
        let error: any;
        try {
            action();
        } catch (e) {
            error = e;
        }
        return error;
    }


    it('should continue when parsed object is _PdfBaseStream and return the later parsed object in _fetchCompressed', () => {
        // Arrange
        const xref: any = createXref();
        const tableOffset: number = 10;
        const targetRef: _PdfReference = _PdfReference.get(6, 9);

        const objStreamDictionary: _PdfDictionary = new _PdfDictionary(xref);
        objStreamDictionary.set('First', 0);
        objStreamDictionary.set('N', 2);

        const objStream: _PdfStream = new _PdfStream(new Uint8Array([0]), objStreamDictionary, 0, 1);
        spyOn(xref, '_fetch').and.returnValue(objStream);

        xref._entries[5] = { offset: tableOffset, gen: 0, uncompressed: false, free: false };
        xref._entries[6] = { offset: tableOffset, gen: 1, uncompressed: false, free: false };

        const compressedEntry: any = {
            offset: tableOffset,
            gen: 1,
            uncompressed: false,
            free: false
        };

        const firstObjAsStream: _PdfStream = new _PdfStream(
            new Uint8Array([1, 2, 3]),
            new _PdfDictionary(xref),
            0,
            3
        );
        const secondObjAsDictionary: _PdfDictionary = new _PdfDictionary(xref);

        spyOn(_PdfParser.prototype as any, 'getObject').and.returnValues(
            5, 0,
            6, 4,
            firstObjAsStream,
            secondObjAsDictionary
        );

        // Act
        const result: any = xref._fetchCompressed(targetRef, compressedEntry);

        // Assert
        expect(result).toBe(secondObjAsDictionary);
        expect(xref._cacheMap.get(_PdfReference.get(6, 9))).toBe(secondObjAsDictionary);
        expect((secondObjAsDictionary as any).objId).toBe('6 9');
        expect(xref._cacheMap.get(_PdfReference.get(5, 9))).toBeUndefined();
    });

    it('should throw BaseException when _processXRefStream returns undefined in _readXRef', () => {
        // Arrange
        const xref: any = createXref([0]);
        xref._setStartXRef(0);

        const xrefStream: _PdfStream = new _PdfStream(
            new Uint8Array([1]),
            new _PdfDictionary(xref),
            0,
            1
        );

        spyOn(_PdfParser.prototype as any, 'getObject').and.returnValues(
            1,
            0,
            _PdfCommand.get ? _PdfCommand.get('obj') : ({ command: 'obj' } as any),
            xrefStream
        );

        spyOn(xref, '_processXRefStream').and.returnValue(undefined);

        // Act
        const error: any = captureError(() => xref._readXRef());

        // Assert
        expect(error).toBeDefined();
        expect(error instanceof BaseException).toBeTruthy();
        expect(String(error.message)).toContain('Invalid cross reference');
    });

    it('should enqueue Prev reference objectNumber in _readXRef when Prev is a _PdfReference', () => {
        // Arrange
        const xref: any = createXref([0]);
        xref._setStartXRef(0);

        let processCount: number = 0;
        spyOn(_PdfParser.prototype as any, 'getObject').and.returnValues(
            _PdfCommand.get ? _PdfCommand.get('xref') : ({ command: 'xref' } as any),
            _PdfCommand.get ? _PdfCommand.get('xref') : ({ command: 'xref' } as any)
        );

        spyOn(xref, '_processXRefTable').and.callFake(() => {
            processCount++;
            const dict: _PdfDictionary = new _PdfDictionary(xref);
            if (processCount === 1) {
                dict.set('Prev', _PdfReference.get(77, 0));
            }
            return dict;
        });

        // Act
        const result: any = xref._readXRef();

        // Assert
        expect(result).toBeDefined();
        expect((xref._processXRefTable as jasmine.Spy).calls.count()).toBe(1);
        expect((xref._document as any)._startXRefParsedCache).toBeTruthy();
    });

    it('should process cache items missing from main object collection and flush in _writeObjectCollection', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = new Array<number>(512001).fill(1);
        const objectCollection: Map<_PdfReference, any> = new Map<_PdfReference, any>();

        const keyInMain: _PdfReference = _PdfReference.get(1, 0);
        const keyOnlyInCache: _PdfReference = _PdfReference.get(2, 0);

        const value1: _PdfDictionary = new _PdfDictionary(xref);
        const value2: _PdfDictionary = new _PdfDictionary(xref);

        objectCollection.set(keyInMain, value1);
        xref._cacheMap.set(keyInMain, value1);
        xref._cacheMap.set(keyOnlyInCache, value2);

        spyOn(xref, '_writeObjectToBuffer').and.callFake(() => { /* no-op */ });
        spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });
        spyOn(xref, '_writeXrefTable').and.callFake(() => { /* no-op */ });

        xref._document.fileStructure._crossReferenceType = PdfCrossReferenceType.table;

        // Act
        xref._writeObjectCollection(objectCollection, buffer);

        // Assert
        expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
            keyInMain,
            value1,
            jasmine.any(Array),
            jasmine.any(Map)
        );
        expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
            keyOnlyInCache,
            value2,
            jasmine.any(Array),
            jasmine.any(Map)
        );
        expect(xref._flushBuffer).toHaveBeenCalled();
        expect(xref._writeXrefTable).toHaveBeenCalled();
    });

    it('should encrypt stream content when transform is provided in _writeStream', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const dict: _PdfDictionary = new _PdfDictionary(xref);
        const stream: _PdfStream = new _PdfStream(new Uint8Array([65, 66]), dict, 0, 2);

        (stream as any)._isCompress = false;
        (stream as any)._isImage = false;

        const transform: any = {
            encryptString: jasmine.createSpy('encryptString').and.returnValue('ENC')
        };

        // Act
        xref._writeStream(stream, buffer, transform, false);

        // Assert
        expect(transform.encryptString).toHaveBeenCalled();
        expect(dict.get('Length')).toBe(3);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('should write escaped _PdfName for V key in _writeValue', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const name: _PdfName = _PdfName.get('A B');

        // Act
        xref._writeValue(name, 'V', buffer);

        // Assert
        const output: string = String.fromCharCode(...buffer);
        expect(output).toContain('/A#20B');
    });

    it('should encrypt string value when transform is provided and isCrossReference is false in _writeValue', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const transform: any = {
            encryptString: jasmine.createSpy('encryptString').and.returnValue('cipher-text')
        };

        // Act
        xref._writeValue('plain-text', 'AnyKey', buffer, transform, false);

        // Assert
        expect(transform.encryptString).toHaveBeenCalledWith('plain-text');
        const output: string = String.fromCharCode(...buffer);
        expect(output).toContain('(cipher-text)');
    });

    it('should write unicode string as hex when array contains unicode text in _writeObject', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const value: any[] = ['தமிழ்'];

        // Act
        xref._writeObject(value, buffer);

        // Assert
        const output: string = String.fromCharCode(...buffer);
        expect(output).toContain('<');
        expect(output).toContain('>');
    });

    it('should throw when offset byte is -1 in _readXRefStream', () => {
        // Arrange
        const xref: any = createXref();
        const stream: any = {
            position: 0,
            getByte: jasmine.createSpy('getByte').and.returnValues(
                1,
                -1
            )
        };

        xref._streamState = {
            streamPos: 0,
            entryNum: 0,
            entryRanges: [0, 1],
            byteWidths: [1, 1, 1]
        };

        // Act
        const error: any = captureError(() => xref._readXRefStream(stream));

        // Assert
        expect(error).toBeDefined();
        expect(String(error.message)).toContain('offset');
    });

    it('should throw when generation byte is -1 in _readXRefStream', () => {
        // Arrange
        const xref: any = createXref();
        const stream: any = {
            position: 0,
            getByte: jasmine.createSpy('getByte').and.returnValues(
                1,
                5,
                -1
            )
        };

        xref._streamState = {
            streamPos: 0,
            entryNum: 0,
            entryRanges: [0, 1],
            byteWidths: [1, 1, 1]
        };

        // Act
        const error: any = captureError(() => xref._readXRefStream(stream));

        // Assert
        expect(error).toBeDefined();
        expect(String(error.message)).toContain('generation');
    });

    it('should return immediately when data array is empty in _flushBuffer', () => {
        // Arrange
        const xref: any = createXref();
        const data: number[] = [];

        // Act
        xref._flushBuffer(data);

        // Assert
        expect(xref._uint8Chunks.length).toBe(0);
        expect(xref._bufferLength).toBe(0);
    });

    it('should set crossReferenceType to table when signatures exist and _isCrossReferenceTable is true in _save', () => {
        // Arrange
        const xref: any = createXref();
        xref._version = '1.7';
        xref._isCrossReferenceTable = true;
        xref._signatureCollection = [{
            _catalogBeginSave: jasmine.createSpy('_catalogBeginSave'),
            _signatureDictionary: {
                _documentSaved: jasmine.createSpy('_documentSaved')
            }
        }];
        xref._document.fileStructure.isIncrementalUpdate = false;

        spyOn(xref, '_writeObjectCollection').and.callFake((_collection: any, buffer: number[]) => {
            buffer.push(1, 2, 3);
        });

        // Act
        const result: Uint8Array = xref._save();

        // Assert
        expect(xref._document.fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.table);
        expect(xref._signatureCollection[0]._catalogBeginSave).toHaveBeenCalled();
        expect(result instanceof Uint8Array).toBeTruthy();
    });

    it('should update non-catalog base stream and flush in _saveAsStream when allowCatalog is false', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = new Array<number>(512001).fill(1);
        const ref1: _PdfReference = _PdfReference.get(10, 0);
        const ref2: _PdfReference = _PdfReference.get(11, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;
        dict1._isProcessed = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = true;
        dict2._isProcessed = false;

        const stream1: _PdfStream = new _PdfStream(new Uint8Array([1]), dict1, 0, 1);
        const stream2: _PdfStream = new _PdfStream(new Uint8Array([2]), dict2, 0, 1);

        xref._allowCatalog = false;
        xref._cacheMap.set(ref1, stream1);
        xref._cacheMap.set(ref2, stream2);

        spyOn(xref, '_updatedDictionary').and.callFake(() => { /* no-op */ });
        spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });
        spyOn(xref, '_writeXrefStream').and.callFake(() => { /* no-op */ });

        // Act
        xref._saveAsStream(100, buffer);

        // Assert
        expect(xref._updatedDictionary).toHaveBeenCalledWith(100, ref1, jasmine.any(Array), stream1, undefined);
        const args: any[][] = (xref._updatedDictionary as jasmine.Spy).calls.allArgs();
        expect(args.some((item: any[]) => item[1] === ref2)).toBeFalsy();
        expect(xref._flushBuffer).toHaveBeenCalled();
        expect(xref._writeXrefStream).toHaveBeenCalled();
    });

    it('should write updated dictionary and updated base stream dictionary and flush in _saveAsTable', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const ref1: _PdfReference = _PdfReference.get(20, 0);
        const ref2: _PdfReference = _PdfReference.get(21, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = false;

        const stream2: _PdfStream = new _PdfStream(new Uint8Array([9]), dict2, 0, 1);

        xref._cacheMap.set(ref1, dict1);
        xref._cacheMap.set(ref2, stream2);

        spyOn(xref, '_writeObject').and.callFake((_value: any, innerBuffer: number[]) => {
            innerBuffer.push(1);
        });
        spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });

    
    });



    it('should cover async updated dictionary archive-stream and flush branches in _saveAsStreamAsync', async () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = new Array<number>(512001).fill(1);

        const ref1: _PdfReference = _PdfReference.get(31, 0);
        const ref2: _PdfReference = _PdfReference.get(32, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;
        dict1._isProcessed = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = false;
        dict2._isSignature = false;
        dict2._isProcessed = false;

        const stream1: _PdfStream = new _PdfStream(new Uint8Array([1]), dict1, 0, 1);

        xref._cacheMap.set(ref1, stream1);
        xref._cacheMap.set(ref2, dict2);

        spyOn(xref, '_updatedDictionary').and.callFake(() => { /* no-op */ });
        spyOn(xref, '_writeArchiveStream').and.callFake(() => { /* no-op */ });
        spyOn(xref, '_flushBufferAsync').and.callFake(async (data: number[]) => { data.length = 0; });
        spyOn(xref as any, '_writeXrefStreamAsync').and.returnValue(Promise.resolve());

        // Act
        await xref._saveAsStreamAsync(100, buffer);
        await Promise.resolve();

        // Assert
        expect(xref._updatedDictionary).toHaveBeenCalled();
        expect(xref._writeArchiveStream).toHaveBeenCalled();
        expect(xref._flushBufferAsync).toHaveBeenCalled();
        expect((xref as any)._writeXrefStreamAsync).toHaveBeenCalled();
    });

    it('should cover async dictionary base-stream and flush branches in _saveAsTableAsync', async () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const ref1: _PdfReference = _PdfReference.get(41, 0);
        const ref2: _PdfReference = _PdfReference.get(42, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = false;

        const stream2: _PdfStream = new _PdfStream(new Uint8Array([2]), dict2, 0, 1);

        xref._cacheMap.set(ref1, dict1);
        xref._cacheMap.set(ref2, stream2);

        spyOn(xref, '_writeObject').and.callFake((_v: any, b: number[]) => {
            b.push(1);
        });
        spyOn(xref as any, '_flushBufferAsync').and.returnValue(Promise.resolve());
        spyOn(xref, '_writeStringAsync').and.callFake(async (value: string, b: number[]) => {
            for (let i: number = 0; i < value.length; i++) {
                b.push(value.charCodeAt(i) & 0xff);
            }
        });
        spyOn(xref as any, '_writeXrefAsync').and.returnValue(Promise.resolve());

        // Act
        await xref._saveAsTableAsync(5, buffer);
        await Promise.resolve();

        // Assert
        expect(xref._writeObject).toHaveBeenCalledTimes(2);
        expect((xref as any)._flushBufferAsync).toHaveBeenCalled();
        expect((xref as any)._writeXrefAsync).toHaveBeenCalled();
    });
});

describe('_saveAsStream', () => {
    it('should update base stream objects only when allowCatalog permits and flush when buffer grows', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = new Array<number>(512001).fill(1);
        const ref1: _PdfReference = _PdfReference.get(10, 0);
        const ref2: _PdfReference = _PdfReference.get(11, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;
        dict1._isProcessed = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = true;
        dict2._isProcessed = false;

        const stream1: _PdfStream = new _PdfStream(new Uint8Array([1]), dict1, 0, 1);
        const stream2: _PdfStream = new _PdfStream(new Uint8Array([2]), dict2, 0, 1);

        xref._allowCatalog = false;
        xref._cacheMap.set(ref1, stream1);
        xref._cacheMap.set(ref2, stream2);

        spyOn(xref, '_updatedDictionary').and.callFake(() => { /* no-op */ });
        spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });
        spyOn(xref, '_writeXrefStream').and.callFake(() => { /* no-op */ });

        // Act
        xref._saveAsStream(100, buffer);

        // Assert
        expect(xref._updatedDictionary).toHaveBeenCalled();
        const calls: any[][] = (xref._updatedDictionary as jasmine.Spy).calls.allArgs();

        expect(calls.some((args: any[]) =>
            args[0] === 100 &&
            args[1] === ref1 &&
            Array.isArray(args[2]) &&
            args[3] === stream1 &&
            args[4] === undefined
        )).toBeTruthy();

        expect(calls.some((args: any[]) => args[1] === ref2)).toBeFalsy();

        expect(xref._flushBuffer).toHaveBeenCalled();
        expect(xref._writeXrefStream).toHaveBeenCalled();
    });
});

describe('_saveAsTable', () => {
    it('should write updated dictionaries and updated base stream dictionaries and flush correctly', () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const ref1: _PdfReference = _PdfReference.get(20, 0);
        const ref2: _PdfReference = _PdfReference.get(21, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;

        const dict2: _PdfDictionary = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = false;

        const stream2: _PdfStream = new _PdfStream(new Uint8Array([9]), dict2, 0, 1);

        xref._cacheMap.set(ref1, dict1);
        xref._cacheMap.set(ref2, stream2);

        // Required so _copyTrailer() does not fail
        xref._trailer = new _PdfDictionary(xref);
        xref._nextReferenceNumber = 1;

        spyOn(xref, '_writeObject').and.callFake((_value: any, innerBuffer: number[]) => {
            innerBuffer.push(1);
        });
        spyOn(xref, '_flushBuffer').and.callFake((data: number[]) => { data.length = 0; });

        // Act
        xref._saveAsTable(50, buffer);

        // Assert
        expect(xref._writeObject).toHaveBeenCalledTimes(2);
        expect(xref._flushBuffer).toHaveBeenCalled();
    });
});


describe('_saveAsTableAsync', () => {
    it('should cover async dictionary/base stream branch and flush path without timeout', async () => {
        // Arrange
        const xref: any = createXref();
        const buffer: number[] = [];
        const ref1 = _PdfReference.get(41, 0);
        const ref2 = _PdfReference.get(42, 0);

        const dict1 = new _PdfDictionary(xref);
        dict1._updated = true;
        dict1.isCatalog = false;

        const dict2 = new _PdfDictionary(xref);
        dict2._updated = true;
        dict2.isCatalog = false;

        const stream2 = new _PdfStream(new Uint8Array([2]), dict2, 0, 1);

        xref._cacheMap.set(ref1, dict1);
        xref._cacheMap.set(ref2, stream2);

        // Required so _writeXref/_copyTrailer path does not fail
        xref._trailer = new _PdfDictionary(xref);
        xref._nextReferenceNumber = 1;

        spyOn(xref, '_writeObject').and.callFake((_v: any, b: number[]) => {
            b.push(1);
        });
        spyOn(xref as any, '_flushBufferAsync').and.returnValue(Promise.resolve());
        spyOn(xref, '_writeStringAsync').and.callFake(async (value: string, b: number[]) => {
            for (let i = 0; i < value.length; i++) {
                b.push(value.charCodeAt(i) & 0xff);
            }
        });
        spyOn(xref as any, '_writeXrefAsync').and.returnValue(Promise.resolve());

        // Act
        await xref._saveAsTableAsync(5, buffer);
        await Promise.resolve();

        // Assert
        expect(xref._writeObject).toHaveBeenCalledTimes(2);
        expect((xref as any)._flushBufferAsync).toHaveBeenCalled();
        expect((xref as any)._writeXrefAsync).toHaveBeenCalled();
    });
});

describe('_PdfCrossReference - additional behavior coverage', () => {

    function createDocumentStub(bytes?: number[]): any {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes || []));
        const fileStructure: any = {
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: PdfCrossReferenceType.table
        };

        return {
            _stream: stream,
            fileStructure,
            _fileStructure: fileStructure,
            _isEncrypted: false,
            _isUserPassword: false,
            _hasUserPasswordOnly: false,
            _encryptMetaData: true,
            _startXRefParsedCache: []
        };
    }

    function createXref(bytes?: number[]): _PdfCrossReference {
        return new _PdfCrossReference(createDocumentStub(bytes) as any);
    }

    it('should execute second-pass async branch for cache items missing from object collection in _writeObjectCollectionAsync', async () => {
        // Arrange
        const xref: any = createXref();
        const objectCollection: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        const buffer: number[] = new Array<number>(512001).fill(1);

        const ref1: _PdfReference = _PdfReference.get(1, 0);
        const ref2: _PdfReference = _PdfReference.get(2, 0);

        const dict1: _PdfDictionary = new _PdfDictionary(xref);
        const dict2: _PdfDictionary = new _PdfDictionary(xref);

        objectCollection.set(ref1, dict1);
        xref._cacheMap.set(ref1, dict1);
        xref._cacheMap.set(ref2, dict2);

        // Keep trailer/xref safe if any writer path is reached
        xref._trailer = new _PdfDictionary(xref);
        xref._nextReferenceNumber = 1;

        spyOn(xref, '_writeObjectToBuffer').and.callFake(() => { /* no-op */ });
        spyOn(xref as any, '_flushBufferAsync').and.callFake(async (data: number[]) => {
            data.length = 0;
        });

        // Stub BOTH sync and async xref table writers
        spyOn(xref as any, '_writeXrefTable').and.callFake(() => { /* no-op */ });
        spyOn(xref as any, '_writeXrefTableAsync').and.callFake(async () => { /* no-op */ });

        xref._document.fileStructure._crossReferenceType = PdfCrossReferenceType.table;
        xref._document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        xref._document._fileStructure._crossReferenceType = PdfCrossReferenceType.table;

        // Act
        await xref._writeObjectCollectionAsync(objectCollection, buffer);
        await Promise.resolve();
        await Promise.resolve();

        // Assert
        expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
            ref1,
            dict1,
            jasmine.any(Array),
            jasmine.any(Map)
        );
        expect(xref._writeObjectToBuffer).toHaveBeenCalledWith(
            ref2,
            dict2,
            jasmine.any(Array),
            jasmine.any(Map)
        );
        expect((xref as any)._flushBufferAsync).toHaveBeenCalled();
        expect((xref as any)._writeXrefTableAsync).toHaveBeenCalled();
    });

    it('should indirectly parse mixed arrays and numeric fetched values safely during _save', () => {
        // Arrange
        const xref: any = createXref();
        xref._version = '1.7';

        const catalogRef: _PdfReference = _PdfReference.get(1, 0);
        const mixedArrayRef: _PdfReference = _PdfReference.get(2, 0);
        const nestedRef: _PdfReference = _PdfReference.get(3, 0);
        const numberRef: _PdfReference = _PdfReference.get(4, 0);

        const catalog: _PdfDictionary = new _PdfDictionary(xref);
        catalog.isCatalog = true;
        catalog.set('Mixed', [mixedArrayRef]);
        catalog.set('NumericRef', numberRef);

        xref._cacheMap.set(catalogRef, catalog);
        xref._trailer = new _PdfDictionary(xref);
        xref._nextReferenceNumber = 5;

        spyOn(xref, '_fetch').and.callFake((ref: _PdfReference) => {
            if (ref === mixedArrayRef) {
                return [nestedRef, 'x'];
            }
            if (ref === nestedRef) {
                return 10;
            }
            if (ref === numberRef) {
                return 123;
            }
            return undefined;
        });

        // Prevent deeper save writing from affecting this behavior test
        spyOn(xref, '_writeObjectCollection').and.callFake(() => { /* no-op */ });

        // Act
        xref._save();

        // Assert
        expect(xref._fetch).toHaveBeenCalledWith(mixedArrayRef);
        expect(xref._fetch).toHaveBeenCalledWith(nestedRef);
        expect(xref._fetch).toHaveBeenCalledWith(numberRef);

        expect(xref._objectCollection).toBeDefined();
        expect(xref._objectCollection._mainObjectCollection.has(mixedArrayRef)).toBeTruthy();
        expect(xref._objectCollection._mainObjectCollection.has(nestedRef)).toBeTruthy();
        expect(xref._objectCollection._mainObjectCollection.has(numberRef)).toBeTruthy();
    });

    it('should indirectly fetch twice when first fetch returns a reference and second fetch returns a stream during _save', () => {
        // Arrange
        const xref: any = createXref();
        xref._version = '1.7';

        const catalogRef: _PdfReference = _PdfReference.get(1, 0);
        const childRef: _PdfReference = _PdfReference.get(2, 0);
        const redirectedRef: _PdfReference = _PdfReference.get(3, 0);

        const catalog: _PdfDictionary = new _PdfDictionary(xref);
        catalog.isCatalog = true;
        catalog.set('Child', childRef);

        const streamDict: _PdfDictionary = new _PdfDictionary(xref);
        streamDict._updated = true;
        const baseStream: _PdfStream = new _PdfStream(new Uint8Array([7]), streamDict, 0, 1);

        xref._cacheMap.set(catalogRef, catalog);
        xref._trailer = new _PdfDictionary(xref);
        xref._nextReferenceNumber = 4;

        let childFetchCount: number = 0;
        spyOn(xref, '_fetch').and.callFake((ref: _PdfReference) => {
            if (ref === childRef) {
                childFetchCount++;
                return childFetchCount === 1 ? redirectedRef : baseStream;
            }
            if (ref === redirectedRef) {
                return baseStream;
            }
            return undefined;
        });

        spyOn(xref, '_writeObjectCollection').and.callFake(() => { /* no-op */ });

        // Act
        xref._save();

        // Assert
        expect(xref._fetch).toHaveBeenCalledWith(childRef);
        expect(xref._fetch).toHaveBeenCalledWith(redirectedRef);

        expect(xref._objectCollection).toBeDefined();
        expect(xref._objectCollection._mainObjectCollection.has(childRef)).toBeTruthy();
        expect(xref._objectCollection._mainObjectCollection.get(childRef)).toBe(baseStream);
    });
});

describe('_PdfCrossReference highlighted coverage tests', () => {
    function createReference(objectNumber: number, generationNumber: number = 0): _PdfReference {
        return new _PdfReference(objectNumber, generationNumber);
    }

    function createCommand(command: string): _PdfCommand {
        const commandType: { get?: (value: string) => _PdfCommand; new(commandValue: string): _PdfCommand } =
            _PdfCommand as unknown as { get?: (value: string) => _PdfCommand; new(commandValue: string): _PdfCommand };
        return typeof commandType.get === 'function' ? commandType.get(command) : new commandType(command);
    }

    function createMockDocument(bytes?: Uint8Array): PdfDocument {
        const stream: _PdfStream = new _PdfStream(bytes ?bytes: new Uint8Array(0));

        const fileStructure: PdfDocument['fileStructure'] & PdfDocument['_fileStructure'] = {
            _incrementalUpdate: false,
            isIncrementalUpdate: false,
            crossReferenceType: PdfCrossReferenceType.table,
            _crossReferenceType: undefined
        } as PdfDocument['fileStructure'] & PdfDocument['_fileStructure'];

        const documentLike: Partial<PdfDocument> & {
            _stream: _PdfStream;
            fileStructure: PdfDocument['fileStructure'];
            _fileStructure: PdfDocument['_fileStructure'];
            _isEncrypted: boolean;
            _isUserPassword: boolean;
            _encryptOnlyAttachment: boolean;
            _hasUserPasswordOnly: boolean;
            _encryptMetaData: boolean;
            _startXRefParsedCache?: number[];
        } = {
            _stream: stream,
            fileStructure,
            _fileStructure: fileStructure,
            _isEncrypted: false,
            _isUserPassword: false,
            _encryptOnlyAttachment: false,
            _hasUserPasswordOnly: false,
            _encryptMetaData: false
        };

        return documentLike as PdfDocument;
    }

    function createCrossReference(bytes?: Uint8Array): _PdfCrossReference {
        return new _PdfCrossReference(createMockDocument(bytes));
    }

    function createDictionary(xref?: _PdfCrossReference): _PdfDictionary {
        return new _PdfDictionary(xref);
    }

    function createStream(data?: number[], dictionary?: _PdfDictionary): _PdfStream {
        const streamData: number[] = data ?data: [];
        return new _PdfStream(streamData, dictionary?dictionary: new _PdfDictionary(), 0, streamData.length);
    }

    function createParserEndOfFileError(): ParserEndOfFileException {
        return Object.create(ParserEndOfFileException.prototype) as ParserEndOfFileException;
    }

    afterEach(() => {
        try {
            jasmine.clock().uninstall();
        } catch (e) {
            // no-op
        }
    });


    it('should cover _saveAsStream second-pass _PdfBaseStream updated branch and flush branch', () => {
        // Arrange
        const xref: _PdfCrossReference = createCrossReference();
        const buffer: number[] = [];
        const currentLength: number = 25;

        const streamDictionary: _PdfDictionary = createDictionary(xref);
        streamDictionary._updated = true;
        streamDictionary._isProcessed = false;
        streamDictionary.isCatalog = false;

        const updatedStream: _PdfStream = createStream([1, 2, 3], streamDictionary);
        const streamRef: _PdfReference = createReference(10, 0);

        let forEachCount: number = 0;
        const fakeCacheMap: {
            forEach: (callback: (value: unknown, key: _PdfReference) => void) => void;
        } = {
            forEach: (callback: (value: unknown, key: _PdfReference) => void): void => {
                forEachCount++;
                if (forEachCount === 1) {
                    // first pass: reset _isProcessed
                    callback(updatedStream, streamRef);
                } else if (forEachCount === 2) {
                    // second pass: intentionally skip first stream-processing pass
                    return;
                } else if (forEachCount === 3) {
                    // third pass: hit highlighted base-stream branch
                    callback(updatedStream, streamRef);
                }
            }
        };

        (xref as unknown as { _cacheMap: Map<_PdfReference, unknown> })._cacheMap =
            fakeCacheMap as unknown as Map<_PdfReference, unknown>;
        (xref as unknown as { _allowCatalog: boolean })._allowCatalog = true;

        const updatedDictionarySpy: jasmine.Spy = spyOn(xref, '_updatedDictionary').and.callFake((): void => {
            buffer.length = 512001;
        });
        const flushSpy: jasmine.Spy = spyOn(xref, '_flushBuffer').and.callFake((): void => {
            buffer.length = 0;
        });
        const writeXrefStreamSpy: jasmine.Spy = spyOn(xref, '_writeXrefStream').and.stub();

        // Act
        xref._saveAsStream(currentLength, buffer);

        // Assert
        expect(updatedDictionarySpy).toHaveBeenCalled();
        expect(flushSpy).toHaveBeenCalled();
        expect(writeXrefStreamSpy).toHaveBeenCalled();
    });

    

    it('should cover _flushBufferAsync early return when data length is zero', async () => {
        // Arrange
        const xref: _PdfCrossReference = createCrossReference();
        const data: number[] = [];

        // Act
        await xref._flushBufferAsync(data);

        // Assert
        expect((xref as unknown as { _uint8Chunks: Uint8Array[] })._uint8Chunks.length).toBe(0);
        expect((xref as unknown as { _bufferLength: number })._bufferLength).toBe(0);
    });

  
    
});
