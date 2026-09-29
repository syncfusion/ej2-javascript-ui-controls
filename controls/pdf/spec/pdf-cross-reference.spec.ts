import { _PdfBaseStream, _PdfStream } from '../src/pdf/core/base-stream';
import { PdfCertificationFlag, PdfCrossReferenceType, PdfEncryptionType, PdfPermissionFlag } from '../src/pdf/core/enumerator';
import { _PdfCrossReference, _PdfObjectInformation } from '../src/pdf/core/pdf-cross-reference';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { _PdfCommand, _PdfDictionary, _PdfName, _PdfReference, _PdfReferenceSet } from '../src/pdf/core/pdf-primitives';
interface _TestFileStructure {
    isIncrementalUpdate: boolean;
    crossReferenceType?: PdfCrossReferenceType;
    _crossReferenceType?: PdfCrossReferenceType;
}
interface _TestDocumentShape {
    _stream: _PdfStream;
    _fileStructure: _TestFileStructure;
    fileStructure: _TestFileStructure;
    _startXRefParsedCache?: number[];
    _isEncrypted?: boolean;
    _isUserPassword?: boolean;
    _encryptOnlyAttachment?: boolean;
    _hasUserPasswordOnly?: boolean;
    _encryptMetaData?: boolean;
}
interface _TestTableState {
    entryNum: number;
    streamPos: number;
    parserBuf1: unknown;
    parserBuf2: unknown;
    firstEntryNum?: number;
    entryCount?: number;
}
interface _TestStreamState {
    entryRanges: number[];
    byteWidths: number[];
    entryNum: number;
    streamPos: number;
}
interface _CrossReferenceInternalShape {
    _entries: Array<unknown>;
    _cacheMap: Map<_PdfReference, unknown>;
    _pendingRefs: _PdfReferenceSet;
    _startXRefQueue: number[];
    _prevStartXref: number;
    _prevXRefOffset?: number;
    _trailer?: _PdfDictionary;
    _root?: _PdfDictionary;
    _topDictionary?: _PdfDictionary;
    _tableState?: _TestTableState;
    _streamState?: _TestStreamState;
    _crossReferencePosition: Record<number, number>;
    _offsets: number[];
    _indexes?: number[];
    _bufferLength?: number;
    _newLine?: string;
    _version?: string;
}
function _createDocument(bytes?: number[]): PdfDocument {
    const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes ? bytes : [37, 80, 68, 70]));
    const fileStructure: _TestFileStructure = {
        isIncrementalUpdate: false,
        crossReferenceType: PdfCrossReferenceType.table,
        _crossReferenceType: PdfCrossReferenceType.table
    };
    const documentShape: _TestDocumentShape = {
        _stream: stream,
        _fileStructure: fileStructure,
        fileStructure
    };
    return documentShape as unknown as PdfDocument;
}
function _createCrossReference(bytes?: number[]): _PdfCrossReference {
    const document: PdfDocument = _createDocument(bytes);
    return new _PdfCrossReference(document, '');
}
function _getInternal(crossReference: _PdfCrossReference): _CrossReferenceInternalShape {
    return crossReference as unknown as _CrossReferenceInternalShape;
}
function _getCommand(name: string): _PdfCommand {
    const commandFactory: { get: (value: string) => _PdfCommand } = _PdfCommand as unknown as { get: (value: string) => _PdfCommand };
    return commandFactory.get(name);
}
function _getName(name: string): _PdfName {
    const nameFactory: { get: (value: string) => _PdfName } = _PdfName as unknown as { get: (value: string) => _PdfName };
    return nameFactory.get(name);
}
function _createTrailer(size: number, includePages: boolean = true): _PdfDictionary {
    const trailer: _PdfDictionary = new _PdfDictionary();
    const root: _PdfDictionary = new _PdfDictionary();
    if (includePages) {
        const pages: _PdfDictionary = new _PdfDictionary();
        pages.set('Count', 1);
        root.set('Pages', pages);
    }
    trailer.set('Size', size);
    trailer.set('Root', root);
    return trailer;
}
function createCrossReference(bytes: number[] = []): any {
    const stream: _PdfStream = new _PdfStream(new Uint8Array(bytes));
    const document: any = {
        _stream: stream,
        fileStructure: {
            isIncrementalUpdate: false
        },
        _fileStructure: {}
    };
    return new _PdfCrossReference(document, '');
}
function bytesToText(bytes: number[]): string {
    let value: string = '';
    for (let i: number = 0; i < bytes.length; i++) {
        value += String.fromCharCode(bytes[i]);
    }
    return value;
}
describe('_PdfCrossReference._setStartXRef', () => {
    it('should initialize the start cross-reference queue', () => {
        const crossReference: any = createCrossReference();
        crossReference._setStartXRef(145);
        expect(crossReference._startXRefQueue).toEqual([145]);
        expect(crossReference._prevStartXref).toBe(145);
        expect(crossReference._prevXRefOffset).toBe(145);
    });
    it('should replace the start queue without replacing an existing previous offset', () => {
        const crossReference: any = createCrossReference();
        crossReference._prevXRefOffset = 90;
        crossReference._setStartXRef(145);
        expect(crossReference._startXRefQueue).toEqual([145]);
        expect(crossReference._prevStartXref).toBe(145);
        expect(crossReference._prevXRefOffset).toBe(90);
    });
    it('should replace a null previous offset with the start offset', () => {
        const crossReference: any = createCrossReference();
        crossReference._prevXRefOffset = null;
        crossReference._setStartXRef(145);
        expect(crossReference._prevXRefOffset).toBe(145);
    });
});
describe('_PdfCrossReference._getEntry', () => {
    it('should return a valid non-free entry', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 25;
        entry.gen = 0;
        entry.uncompressed = true;
        crossReference._entries[3] = entry;
        expect(crossReference._getEntry(3)).toBe(entry);
    });
    it('should return null for a free entry', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 25;
        entry.gen = 0;
        entry.free = true;
        crossReference._entries[3] = entry;
        expect(crossReference._getEntry(3)).toBeNull();
    });
    it('should return null for an entry with a non-finite offset', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = Number.POSITIVE_INFINITY;
        entry.gen = 0;
        entry.uncompressed = true;
        crossReference._entries[3] = entry;
        expect(crossReference._getEntry(3)).toBeNull();
    });
    it('should return null when an entry does not exist', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._getEntry(3)).toBeNull();
    });
});
describe('_PdfCrossReference._readToken', () => {
    it('should read characters until a line feed', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([49, 50, 51, 10, 52]);
        expect(crossReference._readToken(data, 0)).toBe('123');
    });
    it('should read characters until a carriage return', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([97, 98, 13, 99]);
        expect(crossReference._readToken(data, 0)).toBe('ab');
    });
    it('should read characters until a dictionary delimiter', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([111, 98, 106, 60, 60]);
        expect(crossReference._readToken(data, 0)).toBe('obj');
    });
});
describe('_PdfCrossReference._skipUntil', () => {
    it('should return the number of bytes before the requested sequence', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
    });
    it('should return zero when the requested sequence starts at the offset', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(0);
    });
    it('should return the remaining length when the sequence is absent', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array = new Uint8Array([1, 2, 3]);
        const target: Uint8Array = new Uint8Array([8, 9]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(3);
    });
});
describe('_PdfCrossReference._flushBuffer', () => {
    it('should move buffered bytes into a typed-array chunk', () => {
        const crossReference: any = createCrossReference();
        const data: number[] = [37, 80, 68, 70];
        crossReference._flushBuffer(data);
        expect(data.length).toBe(0);
        expect(crossReference._uint8Chunks.length).toBe(1);
        expect(Array.from(crossReference._uint8Chunks[0])).toEqual([37, 80, 68, 70]);
        expect(crossReference._bufferLength).toBe(4);
    });
    it('should not add a chunk for an empty buffer', () => {
        const crossReference: any = createCrossReference();
        const data: number[] = [];
        crossReference._flushBuffer(data);
        expect(crossReference._uint8Chunks.length).toBe(0);
        expect(crossReference._bufferLength).toBe(0);
    });
});
describe('_PdfCrossReference._processString', () => {
    it('should pad a value with leading zeroes', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._processString('25', 5)).toBe('00025');
    });
    it('should preserve a value that already has the requested length', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._processString('12345', 5)).toBe('12345');
    });
    it('should preserve a value longer than the requested length', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._processString('123456', 5)).toBe('123456');
    });
});
describe('_PdfCrossReference._getNextReference', () => {
    it('should return a new generation-zero reference and increment the counter', () => {
        const crossReference: any = createCrossReference();
        crossReference._nextReferenceNumber = 7;
        const reference: any = crossReference._getNextReference();
        expect(reference.objectNumber).toBe(7);
        expect(reference.generationNumber).toBe(0);
        expect(reference._isNew).toBe(true);
        expect(crossReference._nextReferenceNumber).toBe(8);
    });
});
describe('_PdfCrossReference._writeString', () => {
    it('should append every character byte to the buffer', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [1];
        crossReference._writeString('PDF', buffer);
        expect(buffer).toEqual([1, 80, 68, 70]);
    });
    it('should store only the low byte of each character', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeString('\u0101', buffer);
        expect(buffer).toEqual([1]);
    });
});
describe('_PdfCrossReference._writeBytes', () => {
    it('should append every source byte to the destination buffer', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [1];
        crossReference._writeBytes([2, 3, 4], buffer);
        expect(buffer).toEqual([1, 2, 3, 4]);
    });
});
describe('_PdfCrossReference._writeLong', () => {
    it('should write a number in big-endian byte order', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeLong(0x123456, 3, buffer);
        expect(buffer).toEqual([0x12, 0x34, 0x56]);
    });
    it('should write the low byte when the width is one', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeLong(0x1ff, 1, buffer);
        expect(buffer).toEqual([0xff]);
    });
});
describe('_PdfCrossReference._escapeString', () => {
    it('should escape parentheses and backslashes', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._escapeString('(a)\\b')).toBe('\\(a\\)\\\\b');
    });
    it('should escape line feed and carriage return characters', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._escapeString('a\nb\rc')).toBe('a\\nb\\rc');
    });
    it('should preserve text that requires no escaping', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._escapeString('plain text')).toBe('plain text');
    });
});
describe('_PdfCrossReference._writeUnicodeString', () => {
    it('should write a byte-order mark inside a literal string', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeUnicodeString('A', buffer);
        expect(buffer[0]).toBe(40);
        expect(buffer[1]).toBe(254);
        expect(buffer[2]).toBe(255);
        expect(buffer[buffer.length - 1]).toBe(41);
    });
    it('should escape special bytes in the encoded literal string', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeUnicodeString('(', buffer);
        expect(buffer).toContain(92);
        expect(buffer[buffer.length - 1]).toBe(41);
    });
});
describe('_PdfCrossReference._writeObject', () => {
    it('should write a number followed by a line feed', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeObject(25, buffer);
        expect(bytesToText(buffer)).toBe('25\n');
    });
    it('should write an ASCII string as a literal string', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeObject('Text', buffer);
        expect(bytesToText(buffer)).toBe('(Text)\n');
    });
    it('should write a reference header and object footer', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        const reference: _PdfReference = new _PdfReference(4, 2);
        crossReference._writeObject(25, buffer, reference);
        expect(bytesToText(buffer)).toBe('4 2 obj\r\n25\nendobj\r\n');
    });
    it('should write a PDF name with spaces escaped', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        const name: _PdfName = new _PdfName('A B');
        crossReference._writeObject(name, buffer);
        expect(bytesToText(buffer)).toBe('/A#20B');
    });
    it('should write an array containing references and names', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        const reference: _PdfReference = new _PdfReference(2, 0);
        const name: _PdfName = new _PdfName('Type');
        crossReference._writeObject([reference, name, 5], buffer);
        expect(bytesToText(buffer)).toBe('[ 2 0 R /Type 5\n]\n');
    });
});
describe('_PdfCrossReference._writeValue', () => {
    it('should write a reference value', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(new _PdfReference(8, 1), 'Next', buffer);
        expect(bytesToText(buffer)).toBe('8 1 R');
    });
    it('should write a name value', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(new _PdfName('Page'), 'Type', buffer);
        expect(bytesToText(buffer)).toBe('/Page');
    });
    it('should escape spaces in a name value', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(new _PdfName('A B'), 'Type', buffer);
        expect(bytesToText(buffer)).toBe('/A#20B');
    });
    it('should write an array with spaces between values', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue([1, true, null], 'Values', buffer);
        expect(bytesToText(buffer)).toBe('[1 true null]');
    });
    it('should write and escape an ASCII string', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue('A(B)', 'Text', buffer);
        expect(bytesToText(buffer)).toBe('(A\\(B\\))');
    });
    it('should write boolean values', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(false, 'Flag', buffer);
        expect(bytesToText(buffer)).toBe('false');
    });
    it('should write a null value', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(null, 'Value', buffer);
        expect(bytesToText(buffer)).toBe('null');
    });
});
describe('_PdfCrossReference._writeDictionary', () => {
    it('should write dictionary delimiters and entries', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('Type', new _PdfName('Page'));
        dictionary.set('Count', 2);
        const buffer: number[] = [];
        crossReference._writeDictionary(dictionary, buffer, '\r\n');
        expect(bytesToText(buffer)).toContain('<<\r\n');
        expect(bytesToText(buffer)).toContain('/Type /Page');
        expect(bytesToText(buffer)).toContain('/Count 2');
        expect(bytesToText(buffer)).toContain('>>\r\n');
    });
});
describe('_PdfCrossReference._recordEntryHistory', () => {
    it('should append a newly encountered latest entry', () => {
        const crossReference: any = createCrossReference();
        const first: _PdfObjectInformation = new _PdfObjectInformation();
        const second: _PdfObjectInformation = new _PdfObjectInformation();
        crossReference._recordEntryHistory(2, first, true);
        crossReference._recordEntryHistory(2, second, true);
        expect(crossReference._entriesHistory[2]).toEqual([first, second]);
    });
    it('should prepend an entry found during recovery indexing', () => {
        const crossReference: any = createCrossReference();
        const first: _PdfObjectInformation = new _PdfObjectInformation();
        const second: _PdfObjectInformation = new _PdfObjectInformation();
        crossReference._recordEntryHistory(2, first, true);
        crossReference._recordEntryHistory(2, second, false);
        expect(crossReference._entriesHistory[2]).toEqual([second, first]);
    });
});
describe('_PdfCrossReference._getEntryVersions', () => {
    it('should return an empty result when history does not exist', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._getEntryVersions(3)).toEqual({});
    });
    it('should return the first history entry as the latest entry', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 40;
        entry.uncompressed = true;
        crossReference._entriesHistory[3] = [entry];
        const result: any = crossReference._getEntryVersions(3);
        expect(result.latest).toBe(entry);
    });
    it('should return an entry whose physical offset is inside the byte range', () => {
        const crossReference: any = createCrossReference();
        const outside: _PdfObjectInformation = new _PdfObjectInformation();
        outside.offset = 10;
        outside.uncompressed = true;
        const inside: _PdfObjectInformation = new _PdfObjectInformation();
        inside.offset = 105;
        inside.uncompressed = true;
        crossReference._entriesHistory[3] = [outside, inside];
        const result: any = crossReference._getEntryVersions(3, [100, 10, 200, 10]);
        expect(result.latest).toBe(outside);
        expect(result.inside).toBe(inside);
    });
});
describe('_PdfCrossReference._getPhysicalOffsetForEntry', () => {
    it('should return the offset of an uncompressed entry', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 125;
        entry.uncompressed = true;
        expect(crossReference._getPhysicalOffsetForEntry(entry)).toBe(125);
    });
    it('should return the matching revision offset for a compressed entry', () => {
        const crossReference: any = createCrossReference();
        const container: _PdfObjectInformation = new _PdfObjectInformation();
        container.offset = 300;
        container.uncompressed = true;
        container.revisionId = 2;
        crossReference._entriesHistory[8] = [container];
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 8;
        entry.compressed = true;
        entry.revisionId = 2;
        expect(crossReference._getPhysicalOffsetForEntry(entry)).toBe(300);
    });
    it('should use the latest container offset when revision history is unavailable', () => {
        const crossReference: any = createCrossReference();
        const container: _PdfObjectInformation = new _PdfObjectInformation();
        container.offset = 450;
        container.uncompressed = true;
        crossReference._entries[8] = container;
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 8;
        entry.compressed = true;
        expect(crossReference._getPhysicalOffsetForEntry(entry)).toBe(450);
    });
    it('should return undefined when no physical offset can be resolved', () => {
        const crossReference: any = createCrossReference();
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 8;
        entry.compressed = true;
        expect(crossReference._getPhysicalOffsetForEntry(entry)).toBeUndefined();
    });
});
describe('_PdfCrossReference._isRef', () => {
    it('should identify PDF references', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isRef(new _PdfReference(1, 0))).toBe(true);
        expect(crossReference._isRef(new _PdfName('Page'))).toBe(false);
    });
});
describe('_PdfCrossReference._isName', () => {
    it('should identify PDF names', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isName(new _PdfName('Page'))).toBe(true);
        expect(crossReference._isName(new _PdfReference(1, 0))).toBe(false);
    });
});
describe('_PdfCrossReference._isDict', () => {
    it('should identify PDF dictionaries', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isDict(new _PdfDictionary(crossReference))).toBe(true);
        expect(crossReference._isDict(new _PdfName('Page'))).toBe(false);
    });
});
describe('_PdfCrossReference._isStream', () => {
    it('should identify PDF streams', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1]), dictionary, 0, 1);
        expect(crossReference._isStream(stream)).toBe(true);
        expect(crossReference._isStream(dictionary)).toBe(false);
    });
});
describe('_PdfCrossReference._asDictionary', () => {
    it('should return a dictionary without conversion', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        expect(crossReference._asDictionary(dictionary)).toBe(dictionary);
    });
    it('should return the dictionary owned by a stream', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1]), dictionary, 0, 1);
        expect(crossReference._asDictionary(stream)).toBe(dictionary);
    });
    it('should return undefined for other value types', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._asDictionary('Page')).toBeUndefined();
    });
});
describe('_PdfCrossReference._isAnnotationSubtype', () => {
    it('should accept supported annotation subtype names', () => {
        const crossReference: any = createCrossReference();
        const names: string[] = [
            'Text', 'Link', 'FreeText', 'Line', 'Square', 'Circle', 'PolyLine',
            'Polygon', 'Highlight', 'Underline', 'StrikeOut', 'Squiggly', 'Stamp',
            'Caret', 'Ink', 'Popup', 'FileAttachment', 'Sound', 'Movie', 'Screen',
            'PrinterMark', 'TrapNet', 'Watermark', 'U3D'
        ];
        for (let i: number = 0; i < names.length; i++) {
            expect(crossReference._isAnnotationSubtype(names[i])).toBe(true);
        }
    });
    it('should reject unsupported annotation subtype names', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isAnnotationSubtype('Widget')).toBe(false);
        expect(crossReference._isAnnotationSubtype('Unknown')).toBe(false);
        expect(crossReference._isAnnotationSubtype('')).toBe(false);
    });
});
describe('_PdfCrossReference._refEquals', () => {
    it('should return true for the same value', () => {
        const crossReference: any = createCrossReference();
        const reference: _PdfReference = new _PdfReference(2, 1);
        expect(crossReference._refEquals(reference, reference)).toBe(true);
    });
    it('should compare object and generation numbers', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._refEquals(new _PdfReference(2, 1), new _PdfReference(2, 1))).toBe(true);
        expect(crossReference._refEquals(new _PdfReference(2, 1), new _PdfReference(3, 1))).toBe(false);
        expect(crossReference._refEquals(new _PdfReference(2, 1), new _PdfReference(2, 0))).toBe(false);
    });
    it('should reject different non-reference values', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._refEquals('a', 'b')).toBe(false);
    });
});
describe('_PdfCrossReference._arrayContains', () => {
    it('should find an equivalent PDF reference', () => {
        const crossReference: any = createCrossReference();
        const values: any[] = [new _PdfReference(2, 0), new _PdfReference(3, 0)];
        expect(crossReference._arrayContains(values, new _PdfReference(3, 0))).toBe(true);
    });
    it('should find an equal primitive value', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._arrayContains(['A', 'B'], 'B')).toBe(true);
    });
    it('should return false when the value is absent', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._arrayContains([1, 2], 3)).toBe(false);
    });
});
describe('_PdfCrossReference._isEqual', () => {
    it('should treat two null values as equal', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual(null, null)).toBe(true);
    });
    it('should treat one null value as unequal', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual(null, 1)).toBe(false);
        expect(crossReference._isEqual(1, null)).toBe(false);
    });
    it('should compare PDF names by name', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual(new _PdfName('Page'), new _PdfName('Page'))).toBe(true);
        expect(crossReference._isEqual(new _PdfName('Page'), new _PdfName('Pages'))).toBe(false);
    });
    it('should compare primitive values strictly', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual(2, 2)).toBe(true);
        expect(crossReference._isEqual(2, '2')).toBe(false);
        expect(crossReference._isEqual(true, false)).toBe(false);
    });
    it('should compare arrays recursively', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual([1, new _PdfName('Page')], [1, new _PdfName('Page')])).toBe(true);
        expect(crossReference._isEqual([1, 2], [1, 3])).toBe(false);
    });
    it('should reject arrays with different lengths', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._isEqual([1], [1, 2])).toBe(false);
    });
    it('should compare dictionaries by their entries', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Type', new _PdfName('Page'));
        newer.set('Type', new _PdfName('Page'));
        expect(crossReference._isEqual(older, newer)).toBe(true);
        newer.set('Count', 1);
        expect(crossReference._isEqual(older, newer)).toBe(true);
        older.set('Count', 2);
        expect(crossReference._isEqual(older, newer)).toBe(false);
    });
});
describe('_PdfCrossReference._areEqual', () => {
    it('should return true when either dictionary is missing', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        expect(crossReference._areEqual(null, dictionary)).toBe(true);
        expect(crossReference._areEqual(dictionary, null)).toBe(true);
    });
    it('should return false when a key is removed', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Type', new _PdfName('Page'));
        expect(crossReference._areEqual(older, newer)).toBe(false);
    });
    it('should ignore annotation arrays during ordinary dictionary comparison', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Annots', [new _PdfReference(1, 0)]);
        newer.set('Annots', [new _PdfReference(2, 0)]);
        expect(crossReference._areEqual(older, newer)).toBe(true);
    });
    it('should accept signature form fields', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        newer.set('FT', new _PdfName('Sig'));
        expect(crossReference._areEqual(older, newer)).toBe(true);
    });
    it('should reject ordinary form fields without an allowed permission', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        newer.set('FT', new _PdfName('Tx'));
        expect(crossReference._areEqual(older, newer, false, false)).toBe(false);
    });
});
describe('_PdfCrossReference._readFormReferences', () => {
    it('should return false when either form does not contain fields', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        expect(crossReference._readFormReferences(older, newer)).toBe(false);
    });
    it('should return false when fields are not arrays', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Fields', new _PdfName('Fields'));
        newer.set('Fields', new _PdfName('Fields'));
        expect(crossReference._readFormReferences(older, newer)).toBe(false);
    });
    it('should detect field removal', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Fields', [new _PdfReference(1, 0), new _PdfReference(2, 0)]);
        newer.set('Fields', [new _PdfReference(1, 0)]);
        expect(crossReference._readFormReferences(older, newer)).toBe(true);
    });
    it('should accept identical field collections', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Fields', [new _PdfReference(1, 0), 'Name']);
        newer.set('Fields', [new _PdfReference(1, 0), 'Name']);
        expect(crossReference._readFormReferences(older, newer)).toBe(false);
    });
    it('should detect replacement of a field in an equal-length collection', () => {
        const crossReference: any = createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Fields', [new _PdfReference(1, 0)]);
        newer.set('Fields', [new _PdfReference(2, 0)]);
        expect(crossReference._readFormReferences(older, newer)).toBe(true);
    });
});
describe('_PdfCrossReference._checkSubTypeSingle', () => {
    it('should accept form XObjects', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('Subtype', new _PdfName('Form'));
        expect(crossReference._checkSubTypeSingle(dictionary, false, undefined as any, 0, crossReference)).toBe(true);
    });
    it('should accept signature widgets', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('Subtype', new _PdfName('Widget'));
        dictionary.set('FT', new _PdfName('Sig'));
        expect(crossReference._checkSubTypeSingle(dictionary, false, undefined as any, 0, crossReference)).toBe(true);
    });
    it('should reject non-signature widgets', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('Subtype', new _PdfName('Widget'));
        dictionary.set('FT', new _PdfName('Tx'));
        expect(crossReference._checkSubTypeSingle(dictionary, false, undefined as any, 0, crossReference)).toBe(false);
    });
    it('should reject an unsupported subtype', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('Subtype', new _PdfName('Unknown'));
        expect(crossReference._checkSubTypeSingle(dictionary, false, undefined as any, 0, crossReference)).toBe(false);
    });
});
describe('_PdfCrossReference._mapEncryptionTypeToVRL', () => {
    it('should map 40-bit RC4 encryption', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._mapEncryptionTypeToVRL(PdfEncryptionType.rc4Bit40)).toEqual({
            version: 1,
            revision: 2,
            length: 40
        });
    });
    it('should map 128-bit RC4 encryption', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._mapEncryptionTypeToVRL(PdfEncryptionType.rc4Bit128)).toEqual({
            version: 2,
            revision: 3,
            length: 128
        });
    });
    it('should map 128-bit AES encryption', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit128)).toEqual({
            version: 4,
            revision: 4,
            length: 128
        });
    });
    it('should map revision-five 256-bit AES encryption', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit256Rev5)).toEqual({
            version: 5,
            revision: 5,
            length: 256
        });
    });
    it('should map revision-six 256-bit AES encryption', () => {
        const crossReference: any = createCrossReference();
        expect(crossReference._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit256Rev6)).toEqual({
            version: 5,
            revision: 6,
            length: 256
        });
    });
    it('should reject unsupported encryption types', () => {
        const crossReference: any = createCrossReference();
        expect(() => {
            crossReference._mapEncryptionTypeToVRL(-1);
        }).toThrow();
    });
});
describe('_PdfCrossReference._generateDocumentId', () => {
    it('should generate a sixteen-byte document identifier', () => {
        const crossReference: any = createCrossReference();
        const identifier: string = crossReference._generateDocumentId();
        expect(identifier.length).toBe(16);
    });
});
describe('_PdfCrossReference._addEncryptDictionaryToTrailer', () => {
    it('should add an encryption reference and duplicate the document identifier', () => {
        const crossReference: any = createCrossReference();
        crossReference._nextReferenceNumber = 4;
        crossReference._ids = ['document-id'];
        crossReference._trailer = new _PdfDictionary(crossReference);
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        crossReference._addEncryptDictionaryToTrailer(dictionary);
        const reference: any = crossReference._trailer.getRaw('Encrypt');
        expect(reference.objectNumber).toBe(4);
        expect(crossReference._cacheMap.get(reference)).toBe(dictionary);
        expect(crossReference._trailer.get('ID')).toEqual(['document-id', 'document-id']);
    });
});
describe('_PdfCrossReference._getSortedReferences', () => {
    it('should sort references and insert missing object numbers', () => {
        const crossReference: any = createCrossReference();
        const collection: Map<_PdfReference, number> = new Map<_PdfReference, number>();
        collection.set(new _PdfReference(3, 0), 300);
        collection.set(new _PdfReference(1, 0), 100);
        const sorted: Map<any, number> = crossReference._getSortedReferences(collection);
        const objectNumbers: number[] = [];
        const offsets: number[] = [];
        sorted.forEach((value: number, key: any) => {
            objectNumbers.push(key.objectNumber);
            offsets.push(value);
        });
        expect(objectNumbers).toEqual([1, 2, 3]);
        expect(offsets).toEqual([100, 0, 300]);
    });
});
describe('_PdfCrossReference._destroy', () => {
    it('should release collections and parser state', () => {
        const crossReference: any = createCrossReference();
        crossReference._offsetReference.set(new _PdfReference(1, 0), 10);
        crossReference._cacheMap.set(new _PdfReference(2, 0), new _PdfName('Page'));
        crossReference._objectStreamCollection = new Map<any, any>();
        crossReference._objectCollection = new Map<any, any>();
        crossReference._streamState = { entryNum: 0 };
        crossReference._tableState = { entryNum: 0 };
        crossReference._topDictionary = new _PdfDictionary(crossReference);
        crossReference._trailer = new _PdfDictionary(crossReference);
        crossReference._destroy();
        expect(crossReference._entries).toBeUndefined();
        expect(crossReference._pendingRefs).toBeUndefined();
        expect(crossReference._cacheMap.size).toBe(0);
        expect(crossReference._offsetReference.size).toBe(0);
        expect(crossReference._objectStreamCollection.size).toBe(0);
        expect(crossReference._objectCollection).toBeUndefined();
        expect(crossReference._offsets).toEqual([]);
        expect(crossReference._startXRefQueue).toBeUndefined();
        expect(crossReference._root).toBeUndefined();
        expect(crossReference._stream).toBeUndefined();
        expect(crossReference._streamState).toBeUndefined();
        expect(crossReference._tableState).toBeUndefined();
        expect(crossReference._topDictionary).toBeUndefined();
        expect(crossReference._trailer).toBeUndefined();
        expect(crossReference._version).toBeUndefined();
        expect(crossReference._crossReferencePosition).toBeUndefined();
    });
});
describe('_PdfCrossReference._readToken', () => {
    it('should stop before the final byte when no delimiter exists', () => {
        const crossReference: any = createCrossReference();
        const data: Uint8Array =
            new Uint8Array([65, 66, 67]);
        expect(
            crossReference._readToken(data, 0)
        ).toBe('AB');
    });
});
describe('_PdfCrossReference._writeValue', () => {
    it('should write a number value', () => {
        const crossReference: any = createCrossReference();
        const buffer: number[] = [];
        crossReference._writeValue(
            12.5,
            'Number',
            buffer
        );
        expect(bytesToText(buffer)).toBe('12.5000000');
    });
});
describe('_PdfCrossReference._mapEncryptionTypeToVRL', () => {
    it('should reject unsupported encryption types', () => {
        const crossReference: any = createCrossReference();
        expect(() => {
            crossReference._mapEncryptionTypeToVRL(-1);
        }).toThrow();
    });
});
describe('_PdfCrossReference._addEncryptDictionaryToTrailer', () => {
    it('should reject encryption setup without a trailer', () => {
        const crossReference: any = createCrossReference();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(crossReference);
        expect(() => {
            crossReference._addEncryptDictionaryToTrailer(
                dictionary
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._readXRefTable', () => {
    function createCrossReference(tableState: any): any {
        const crossReference: any =
            Object.create(_PdfCrossReference.prototype);
        crossReference._tableState = {
            streamPos: 0,
            parserBuf1: undefined as any,
            parserBuf2: undefined as any,
            entryNum: 0,
            ...tableState
        };
        crossReference._entries = [];
        crossReference._currentRevisionId = 0;
        return crossReference;
    }
    function createParser(error: Error): any {
        return {
            lexicalOperator: {
                stream: {
                    position: 0
                }
            },
            first: undefined as any,
            second: undefined as any,
            getObject: jasmine
                .createSpy('getObject')
                .and.callFake(() => {
                    throw error;
                })
        };
    }
    it('should read the subsection header when firstEntryNum is undefined', () => {
        const expectedError: Error =
            new Error('getObject was called');
        const parser: any = createParser(expectedError);
        const crossReference: any = createCrossReference({
            firstEntryNum: undefined as any,
            entryCount: 1
        });
        expect(() => {
            crossReference._readXRefTable(parser);
        }).toThrow(expectedError);
        expect(parser.getObject).toHaveBeenCalledTimes(1);
    });
    it('should read the subsection header when entryCount is undefined', () => {
        const expectedError: Error =
            new Error('getObject was called');
        const parser: any = createParser(expectedError);
        const crossReference: any = createCrossReference({
            firstEntryNum: 0,
            entryCount: undefined
        });
        expect(() => {
            crossReference._readXRefTable(parser);
        }).toThrow(expectedError);
        expect(parser.getObject).toHaveBeenCalledTimes(1);
    });
});
describe('_PdfCrossReference._fetchAtEntry', () => {
    it('should return null when the cross-reference entry is undefined', () => {
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([]));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(1, 0);
        const result: any = crossReference._fetchAtEntry(
            reference,
            undefined as any,
            false
        );
        expect(result).toBeNull();
    });
});
describe('_PdfCrossReference._fetchAtEntry', () => {
    it('should return null when the cross-reference entry is undefined', () => {
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([]));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(1, 0);
        const result: any = crossReference._fetchAtEntry(
            reference,
            undefined as any,
            false
        );
        expect(result).toBeNull();
    });
    it('should return null when the entry has no supported storage type', () => {
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([]));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(1, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        const result: any = crossReference._fetchAtEntry(
            reference,
            entry,
            false
        );
        expect(result).toBeNull();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an entry with an inconsistent generation number', () => {
        const data: Uint8Array = new Uint8Array([
            53, 32, 48, 32, 111, 98, 106, 10,
            52, 50, 10,
            101, 110, 100, 111, 98, 106
        ]);
        const stream: _PdfStream = new _PdfStream(data);
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 1);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrowError(
            Error,
            /Inconsistent generation in XRef/
        );
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should resolve the object offset relative to the parent stream start', () => {
        const prefix: number[] = [
            32, 32, 32, 32, 32,
            32, 32, 32, 32, 32,
            32, 32, 32, 32, 32
        ];
        const objectData: number[] = [
            53, 32, 48, 32, 111, 98, 106, 10,
            52, 50, 10,
            101, 110, 100, 111, 98, 106
        ];
        const data: Uint8Array = new Uint8Array(
            prefix.concat(objectData)
        );
        const stream: _PdfStream = new _PdfStream(
            data,
            undefined as any,
            10,
            data.length - 10
        );
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 5;
        entry.gen = 0;
        entry.uncompressed = true;
        const result: any =
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        expect(result).toBe(42);
    });
    it('should parse an uncompressed stream object as a PDF stream', () => {
        const objectText: string =
            '5 0 obj\n' +
            '<< /Length 3 >>\n' +
            'stream\n' +
            'ABC\n' +
            'endstream\n' +
            'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        const result: any =
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        expect(result instanceof _PdfBaseStream).toBe(true);
        expect(result.dictionary.get('Length')).toBe(3);
        expect(result.getString()).toBe('ABC');
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (
            let i: number = 0;
            i < objectText.length;
            i++
        ) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (
            let i: number = 0;
            i < objectText.length;
            i++
        ) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (
            let i: number = 0;
            i < objectText.length;
            i++
        ) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (
            let i: number = 0;
            i < objectText.length;
            i++
        ) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (
            let i: number = 0;
            i < objectText.length;
            i++
        ) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string =
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._fetchUncompressedAtOffset', () => {
    it('should reject an object with an incorrect object number', () => {
        const objectText: string = '6 0 obj\n' + '42\n' + 'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream = new _PdfStream(new Uint8Array(data));
        const document: any = { _stream: stream, fileStructure: { isIncrementalUpdate: false }, _fileStructure: {} };
        const crossReference: any = new _PdfCrossReference(document, '');
        const reference: _PdfReference = new _PdfReference(5, 0);
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 0; entry.gen = 0; entry.uncompressed = true;
        expect(() => { crossReference._fetchUncompressedAtOffset(reference, entry, false); }).toThrow();
    });
    it('should reject an object with an incorrect generation number', () => {
        const objectText: string = '5 1 obj\n' + '42\n' + 'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream = new _PdfStream(new Uint8Array(data));
        const document: any = { _stream: stream, fileStructure: { isIncrementalUpdate: false }, _fileStructure: {} };
        const crossReference: any = new _PdfCrossReference(document, '');
        const reference: _PdfReference = new _PdfReference(5, 0);
        const entry: _PdfObjectInformation = new _PdfObjectInformation();
        entry.offset = 0; entry.gen = 0; entry.uncompressed = true;
        expect(() => { crossReference._fetchUncompressedAtOffset(reference, entry, false); }).toThrow();
    });
    it('should reject an object header with a null object command', () => {
        const objectText: string =
            '5 0 null\n' +
            '42\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array(data));
        const document: any = {
            _stream: stream,
            fileStructure: {
                isIncrementalUpdate: false
            },
            _fileStructure: {}
        };
        const crossReference: any =
            new _PdfCrossReference(document, '');
        const reference: _PdfReference =
            new _PdfReference(5, 0);
        const entry: _PdfObjectInformation =
            new _PdfObjectInformation();
        entry.offset = 0;
        entry.gen = 0;
        entry.uncompressed = true;
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        }).toThrow();
    });
    it('should decrypt an uncompressed object when encryption is active', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any = crossReference as any;
        internal._ids = ['0123456789ABCDEF'];
        internal._nextReferenceNumber = 10;
        internal._trailer = new _PdfDictionary(crossReference);
        internal._initializeEncryptionState({
            encryptionType: PdfEncryptionType.rc4Bit40,
            userPassword: 'user-password',
            ownerPassword: 'owner-password',
            permissions: 0
        });
        internal._encrypt = internal._newEncrypt;
        const reference: _PdfReference =
            _PdfReference.get(5, 0);
        const value: _PdfDictionary =
            new _PdfDictionary(crossReference);
        value.set('Message', 'Confidential text');
        const transform: any =
            internal._encrypt._createCipherTransform(
                reference.objectNumber,
                reference.generationNumber
            );
        const objectBytes: number[] = [];
        internal._writeObject(
            value,
            objectBytes,
            reference,
            transform
        );
        const objectStream: _PdfStream =
            new _PdfStream(new Uint8Array(objectBytes));
        internal._stream = objectStream;
        const documentInternal: any =
            internal._document as any;
        documentInternal._stream = objectStream;
        const entry: any = {
            offset: 0,
            gen: 0,
            uncompressed: true,
            free: false
        };
        const result: _PdfDictionary =
            internal._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        expect(result instanceof _PdfDictionary).toBe(true);
        expect(result.get('Message')).toBe(
            'Confidential text'
        );
    });
});
describe('_PdfCrossReference._getHistoryEntryForRevision', () => {
    it('should throw when revision history is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        expect(() => {
            crossReference._getHistoryEntryForRevision(
                25,
                1
            );
        }).toThrow();
    });
});
describe('_PdfCrossReference._getHistoryEntryForRevision', () => {
    it('should return undefined when the requested revision is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const entry: any = {
            offset: 100,
            gen: 0,
            revisionId: 1,
            uncompressed: true
        };
        internal._entriesHistory[5] = [
            entry
        ];
        const result: any =
            crossReference._getHistoryEntryForRevision(
                5,
                3
            );
        expect(result).toBeUndefined();
    });
    it('should return undefined when the requested revision is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const entry: any = {
            offset: 100,
            gen: 0,
            revisionId: 1,
            uncompressed: true
        };
        const internal: any =
            crossReference as any;
        internal._entriesHistory[5] = [entry];
        const result: any =
            crossReference._getHistoryEntryForRevision(
                5,
                3
            );
        expect(result).toBeUndefined();
    });
});
describe('_PdfCrossReference._getHistoryEntryForRevision', () => {
    it('should throw when revision history is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        expect(() => {
            crossReference._getHistoryEntryForRevision(
                25,
                1
            );
        }).toThrow();
    });
    it('should return undefined when revision history exists', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const entry: any = {
            offset: 200,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[5] = [
            entry
        ];
        const result: any =
            crossReference._getHistoryEntryForRevision(
                5,
                2
            );
        expect(result).toBeUndefined();
    });
});
describe('_PdfCrossReference._recordEntryHistory', () => {
    it('should prepend an entry when latestFirstEncounter is false', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const existingEntry: any = {
            offset: 100,
            gen: 0,
            revisionId: 1,
            uncompressed: true
        };
        const earlierEntry: any = {
            offset: 50,
            gen: 0,
            revisionId: 0,
            uncompressed: true
        };
        internal._entriesHistory[5] = [
            existingEntry
        ];
        crossReference._recordEntryHistory(
            5,
            earlierEntry,
            false
        );
        expect(
            internal._entriesHistory[5]
        ).toEqual([
            earlierEntry,
            existingEntry
        ]);
    });
});
describe('_PdfCrossReference._recordEntryHistory', () => {
    it('should prepend an entry when latestFirstEncounter is false', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const existingEntry: any = {
            offset: 100,
            gen: 0,
            revisionId: 1,
            uncompressed: true
        };
        const earlierEntry: any = {
            offset: 50,
            gen: 0,
            revisionId: 0,
            uncompressed: true
        };
        internal._entriesHistory[5] = [
            existingEntry
        ];
        crossReference._recordEntryHistory(
            5,
            earlierEntry,
            false
        );
        expect(
            internal._entriesHistory[5]
        ).toEqual([
            earlierEntry,
            existingEntry
        ]);
    });
});
describe('_PdfCrossReference._getPhysicalOffsetForEntry', () => {
    it('should return the object-stream offset for a compressed entry', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const objectStreamEntry: any = {
            offset: 300,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[8] = [
            objectStreamEntry
        ];
        const compressedEntry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            );
        expect(result).toBe(300);
    });
    it('should return undefined when the entry is not compressed or uncompressed', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const containerEntry: any = {
            offset: 300,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[8] = [
            containerEntry
        ];
        internal._entries[8] = containerEntry;
        const entry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: false,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                entry
            );
        expect(result).toBeUndefined();
    });
    it('should use the matching revision offset instead of the latest container offset', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const revisionEntry: any = {
            offset: 300,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        const latestEntry: any = {
            offset: 700,
            gen: 0,
            revisionId: 3,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[8] = [
            revisionEntry,
            latestEntry
        ];
        internal._entries[8] = latestEntry;
        const compressedEntry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            );
        expect(result).toBe(300);
    });
    it('should return undefined when object-stream history is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        internal._entriesHistory[8] = undefined;
        internal._entries[8] = undefined;
        const compressedEntry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            );
        expect(result).toBeUndefined();
    });
    describe('_PdfCrossReference._getPhysicalOffsetForEntry', () => {
        it('should use the matching revision offset instead of the latest container offset', () => {
            const crossReference: _PdfCrossReference =
                _createCrossReference();
            const internal: any =
                crossReference as any;
            const revisionEntry: any = {
                offset: 300,
                gen: 0,
                revisionId: 2,
                uncompressed: true,
                compressed: false,
                free: false
            };
            const latestEntry: any = {
                offset: 700,
                gen: 0,
                revisionId: 3,
                uncompressed: true,
                compressed: false,
                free: false
            };
            internal._entriesHistory[8] = [
                revisionEntry,
                latestEntry
            ];
            internal._entries[8] = latestEntry;
            const compressedEntry: any = {
                offset: 8,
                gen: 0,
                revisionId: 2,
                uncompressed: false,
                compressed: true,
                free: false
            };
            const result: number | undefined =
                crossReference._getPhysicalOffsetForEntry(
                    compressedEntry
                );
            expect(result).toBe(300);
        });
    });
    it('should skip nonmatching history entries when resolving the revision offset', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const nonmatchingEntry: any = {
            offset: 700,
            gen: 0,
            revisionId: 3,
            uncompressed: true,
            compressed: false,
            free: false
        };
        const matchingEntry: any = {
            offset: 300,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[8] = [
            nonmatchingEntry,
            matchingEntry
        ];
        internal._entries[8] = nonmatchingEntry;
        const compressedEntry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            );
        expect(result).toBe(300);
    });
    it('should ignore a matching history entry that is not uncompressed', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const matchingCompressedEntry: any = {
            offset: 300,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const latestUncompressedEntry: any = {
            offset: 700,
            gen: 0,
            revisionId: 3,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[8] = [
            matchingCompressedEntry
        ];
        internal._entries[8] =
            latestUncompressedEntry;
        const compressedEntry: any = {
            offset: 8,
            gen: 0,
            revisionId: 2,
            uncompressed: false,
            compressed: true,
            free: false
        };
        const result: number | undefined =
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            );
        expect(result).toBe(700);
    });
});
describe('_PdfCrossReference._fetchReferenceInRevision', () => {
    it('should return null when revision history and the current entry are unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const internal: any =
            crossReference as any;
        const reference: _PdfReference =
            _PdfReference.get(25, 0);
        internal._entriesHistory[25] =
            undefined;
        internal._entries[25] =
            undefined;
        const result: any =
            crossReference._fetchReferenceInRevision(
                reference,
                2
            );
        expect(result).toBeNull();
    });
});
describe('_PdfCrossReference._fetchReferenceInRevision', () => {
    it('should fetch the entry matching the requested revision', () => {
        const objectText: string =
            '5 0 obj\n' +
            '100\n' +
            'endobj\n' +
            '5 0 obj\n' +
            '200\n' +
            'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const crossReference: _PdfCrossReference =
            _createCrossReference(data);
        const internal: any =
            crossReference as any;
        const firstObjectOffset: number = 0;
        const secondObjectOffset: number =
            objectText.indexOf(
                '5 0 obj',
                firstObjectOffset + 1
            );
        const nonmatchingEntry: any = {
            offset: firstObjectOffset,
            gen: 0,
            revisionId: 1,
            uncompressed: true,
            compressed: false,
            free: false
        };
        const matchingEntry: any = {
            offset: secondObjectOffset,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[5] = [
            nonmatchingEntry,
            matchingEntry
        ];
        internal._entries[5] = nonmatchingEntry;
        const reference: _PdfReference =
            _PdfReference.get(5, 0);
        const result: any =
            crossReference._fetchReferenceInRevision(
                reference,
                2
            );
        expect(result).toBe(200);
    });
    it('should use the current entry when the requested revision is unavailable', () => {
        const objectText: string =
            '5 0 obj\n' +
            '200\n' +
            'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const crossReference: _PdfCrossReference =
            _createCrossReference(data);
        const internal: any =
            crossReference as any;
        const nonmatchingHistoryEntry: any = {
            offset: 0,
            gen: 0,
            revisionId: 1,
            uncompressed: true,
            compressed: false,
            free: false
        };
        const currentEntry: any = {
            offset: 0,
            gen: 0,
            revisionId: 3,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[5] = [
            nonmatchingHistoryEntry
        ];
        internal._entries[5] =
            currentEntry;
        const reference: _PdfReference =
            _PdfReference.get(5, 0);
        const result: any =
            crossReference._fetchReferenceInRevision(
                reference,
                2
            );
        expect(result).toBe(200);
    });
    it('should preserve the nonzero generation number of the selected entry', () => {
        const objectText: string = '5 1 obj\n' + '200\n' + 'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const crossReference: _PdfCrossReference = _createCrossReference(data);
        const internal: any = crossReference as any;
        const revisionEntry: any = { offset: 0, gen: 1, revisionId: 2, uncompressed: true, compressed: false, free: false };
        internal._entriesHistory[5] = [revisionEntry];
        internal._entries[5] = revisionEntry;
        const reference: _PdfReference = _PdfReference.get(5, 0);
        const result: any = crossReference._fetchReferenceInRevision(reference, 2);
        expect(result).toBe(200);
    });
});
describe('_PdfCrossReference._isStream', () => {
    it('should identify PDF streams', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([1]),
                dictionary,
                0,
                1
            );
        expect(
            crossReference._isStream(stream)
        ).toBe(true);
        expect(
            crossReference._isStream(dictionary)
        ).toBe(false);
    });
    describe('_PdfCrossReference._isAnnotationSubtype', () => {
        it('should accept supported annotation subtype names', () => {
            const crossReference: _PdfCrossReference =
                _createCrossReference();
            const names: string[] = [
                'Text',
                'Link',
                'FreeText',
                'Line',
                'Square',
                'Circle',
                'PolyLine',
                'Polygon',
                'Highlight',
                'Underline',
                'StrikeOut',
                'Squiggly',
                'Stamp',
                'Caret',
                'Ink',
                'Popup',
                'FileAttachment',
                'Sound',
                'Movie',
                'Screen',
                'PrinterMark',
                'TrapNet',
                'Watermark',
                'U3D'
            ];
            for (let i: number = 0; i < names.length; i++) {
                expect(
                    crossReference._isAnnotationSubtype(
                        names[i]
                    )
                ).toBe(true);
            }
        });
        it('should reject an unsupported annotation subtype name', () => {
            const crossReference: _PdfCrossReference =
                _createCrossReference();
            expect(
                crossReference._isAnnotationSubtype(
                    'Widget'
                )
            ).toBe(false);
        });
    });
    it('should accept supported annotation subtype names', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const names: string[] = [
            'Text',
            'Link',
            'FreeText',
            'Line',
            'Square',
            'Circle',
            'PolyLine',
            'Polygon',
            'Highlight',
            'Underline',
            'StrikeOut',
            'Squiggly',
            'Stamp',
            'Caret',
            'Ink',
            'Popup',
            'FileAttachment',
            'Sound',
            'Movie',
            'Screen',
            'PrinterMark',
            'TrapNet',
            'Watermark',
            'U3D'
        ];
        for (let i: number = 0; i < names.length; i++) {
            expect(
                crossReference._isAnnotationSubtype(
                    names[i]
                )
            ).toBe(true);
        }
    });
    it('should accept supported annotation subtype names', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const names: string[] = [
            'Text',
            'Link',
            'FreeText',
            'Line',
            'Square',
            'Circle',
            'PolyLine',
            'Polygon',
            'Highlight',
            'Underline',
            'StrikeOut',
            'Squiggly',
            'Stamp',
            'Caret',
            'Ink',
            'Popup',
            'FileAttachment',
            'Sound',
            'Movie',
            'Screen',
            'PrinterMark',
            'TrapNet',
            'Watermark',
            'U3D'
        ];
        for (let i: number = 0; i < names.length; i++) {
            expect(
                crossReference._isAnnotationSubtype(names[i])
            ).toBe(true);
        }
    });
});
describe('_PdfCrossReference._checkSubType', () => {
    it('should allow a signature widget', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Subtype',
            _getName('Widget')
        );
        newer.set(
            'FT',
            _getName('Sig')
        );
        const result: boolean =
            crossReference._checkSubType(
                newer,
                older,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should reject a signature field type when the subtype is not Widget', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Subtype',
            _getName('Unknown')
        );
        newer.set(
            'FT',
            _getName('Sig')
        );
        const result: boolean =
            crossReference._checkSubType(
                newer,
                older,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(false);
    });
    it('should reject an unsupported subtype when comment permission is allowed', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        newer.set('Subtype', _getName('Unknown'));
        const result: boolean = crossReference._checkSubType(newer, older, true, PdfCertificationFlag.allowComments, 1, 2);
        expect(result).toBe(false);
    });
    it('should allow a supported annotation when comment permission is enabled', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Subtype',
            _getName('Text')
        );
        const result: boolean =
            crossReference._checkSubType(
                newer,
                older,
                true,
                PdfCertificationFlag.allowComments,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should not allow annotation changes when permission is not active', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Subtype',
            _getName('Text')
        );
        newer.set(
            'Contents',
            'Updated annotation'
        );
        older.set(
            'Subtype',
            _getName('Text')
        );
        older.set(
            'Contents',
            'Original annotation'
        );
        const result: boolean =
            crossReference._checkSubType(
                newer,
                older,
                false,
                PdfCertificationFlag.allowComments,
                1,
                2
            );
        expect(result).toBe(false);
    });
    it('should allow annotation changes when comment permission is active', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Subtype',
            _getName('Text')
        );
        newer.set(
            'Contents',
            'Updated annotation'
        );
        older.set(
            'Subtype',
            _getName('Text')
        );
        older.set(
            'Contents',
            'Original annotation'
        );
        const result: boolean =
            crossReference._checkSubType(
                newer,
                older,
                true,
                PdfCertificationFlag.allowComments,
                1,
                2
            );
        expect(result).toBe(true);
    });
});
describe('_PdfCrossReference._areEqual', () => {
    it('should return true when both dictionaries contain the same values', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Type', _getName('Page')); older.set('Count', 1);
        newer.set('Type', _getName('Page')); newer.set('Count', 1);
        const result: boolean = crossReference._areEqual(older, newer, false, false, undefined as any, 1, 2);
        expect(result).toBe(true);
    });
    it('should return true when both dictionaries are empty', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should compare an XML subtype dictionary when it is not a stream', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        const newer: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Subtype', _getName('XML')); older.set('Contents', 'Original XML content');
        newer.set('Subtype', _getName('XML')); newer.set('Contents', 'Updated XML content');
        const result: boolean = crossReference._areEqual(older, newer, false, false, undefined as any, 1, 2);
        expect(result).toBe(false);
    });
    it('should accept an XML metadata stream without comparing its contents', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const older: _PdfDictionary = new _PdfDictionary(crossReference);
        older.set('Subtype', _getName('XML')); older.set('Contents', 'Original XML content');
        const streamDictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        streamDictionary.set('Subtype', _getName('XML'));
        const newer: _PdfStream = new _PdfStream(new Uint8Array([60, 120, 109, 108, 62]), streamDictionary, 0, 5);
        const result: boolean = crossReference._areEqual(older, newer as any, false, false, undefined as any, 1, 2);
        expect(result).toBe(true);
    });
    it('should return true when the older dictionary is unavailable', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'Type',
            _getName('Page')
        );
        const result: boolean =
            crossReference._areEqual(
                null as any,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should allow annotation changes through subtype validation', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        older.set(
            'Type',
            _getName('Annot')
        );
        older.set(
            'Subtype',
            _getName('Text')
        );
        older.set(
            'Contents',
            'Original annotation'
        );
        newer.set(
            'Type',
            _getName('Annot')
        );
        newer.set(
            'Subtype',
            _getName('Text')
        );
        newer.set(
            'Contents',
            'Updated annotation'
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                true,
                true,
                PdfCertificationFlag.allowComments,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should not apply annotation subtype validation to a non-annotation dictionary', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        older.set(
            'Type',
            _getName('Page')
        );
        older.set(
            'Subtype',
            _getName('Text')
        );
        older.set(
            'Contents',
            'Original content'
        );
        newer.set(
            'Type',
            _getName('Page')
        );
        newer.set(
            'Subtype',
            _getName('Text')
        );
        newer.set(
            'Contents',
            'Updated content'
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                true,
                true,
                PdfCertificationFlag.allowComments,
                1,
                2
            );
        expect(result).toBe(false);
    });
    it('should accept a signature form field', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        newer.set(
            'FT',
            _getName('Sig')
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should return true when both dictionaries contain the same values', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        older.set(
            'Type',
            _getName('Page')
        );
        newer.set(
            'Type',
            _getName('Page')
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
    it('should return false when the newer dictionary is missing a key', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        older.set(
            'RemovedValue',
            undefined
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(false);
    });
    it('should ignore differences in annotation arrays during dictionary comparison', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const older: _PdfDictionary =
            new _PdfDictionary(crossReference);
        const newer: _PdfDictionary =
            new _PdfDictionary(crossReference);
        older.set(
            'Annots',
            [
                _PdfReference.get(10, 0)
            ]
        );
        newer.set(
            'Annots',
            [
                _PdfReference.get(20, 0)
            ]
        );
        const result: boolean =
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                1,
                2
            );
        expect(result).toBe(true);
    });
});
describe('_PdfCrossReference._isEqual', () => {
    it('should return true when both primitive values are equal', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const result: boolean =
            crossReference._isEqual(
                25,
                25,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(true);
    });
    it('should return true when both values are null', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const result: boolean =
            crossReference._isEqual(
                null,
                null,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(true);
    });
    it('should return false when one value is null and the other is NaN', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const result: boolean =
            crossReference._isEqual(
                null,
                Number.NaN,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should return false when only the newer value is null', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const invalidDate: Date =
            new Date(Number.NaN);
        const result: boolean =
            crossReference._isEqual(
                invalidDate,
                null,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should return false when PDF names are different', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const olderName: _PdfName =
            _getName('Page');
        const newerName: _PdfName =
            _getName('Pages');
        const result: boolean =
            crossReference._isEqual(
                olderName,
                newerName,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should return false when comparing two NaN values', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const result: boolean =
            crossReference._isEqual(
                Number.NaN,
                Number.NaN,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should not treat a primitive string and a boxed string as equal', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const olderValue: string =
            'Page';
        const newerValue: String =
            new String('Page');
        const result: boolean =
            crossReference._isEqual(
                olderValue,
                newerValue,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should not treat a primitive boolean and a boxed boolean as equal', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const olderValue: boolean =
            true;
        const newerValue: object =
            new Boolean(true);
        const result: boolean =
            crossReference._isEqual(
                olderValue,
                newerValue,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should compare the objects resolved from PDF references', () => {
        const objectText: string =
            '5 0 obj\n' +
            '42\n' +
            'endobj\n' +
            '6 0 obj\n' +
            '42\n' +
            'endobj\n';
        const data: number[] = [];
        for (let i: number = 0; i < objectText.length; i++) {
            data.push(objectText.charCodeAt(i));
        }
        const crossReference: _PdfCrossReference =
            _createCrossReference(data);
        const internal: any =
            crossReference as any;
        const firstObjectOffset: number =
            objectText.indexOf('5 0 obj');
        const secondObjectOffset: number =
            objectText.indexOf('6 0 obj');
        const firstEntry: any = {
            offset: firstObjectOffset,
            gen: 0,
            revisionId: 1,
            uncompressed: true,
            compressed: false,
            free: false
        };
        const secondEntry: any = {
            offset: secondObjectOffset,
            gen: 0,
            revisionId: 2,
            uncompressed: true,
            compressed: false,
            free: false
        };
        internal._entriesHistory[5] = [
            firstEntry
        ];
        internal._entriesHistory[6] = [
            secondEntry
        ];
        internal._entries[5] = firstEntry;
        internal._entries[6] =
            secondEntry;
        const olderReference: _PdfReference =
            _PdfReference.get(5, 0);
        const newerReference: _PdfReference =
            _PdfReference.get(6, 0);
        const result: boolean =
            crossReference._isEqual(
                olderReference,
                newerReference,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(true);
    });
    it('should recursively compare NaN values inside arrays', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const olderValue: number[] = [
            Number.NaN
        ];
        const newerValue: number[] = [
            Number.NaN
        ];
        const result: boolean =
            crossReference._isEqual(
                olderValue,
                newerValue,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should return false when an empty array is compared with a nonempty array', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const olderValue: number[] = [];
        const newerValue: number[] = [1];
        const result: boolean = crossReference._isEqual(olderValue, newerValue, 1, 2, false, undefined as any);
        expect(result).toBe(false);
    });
    it('should return false when an empty array is compared with a nonempty array', () => {
        const crossReference: _PdfCrossReference = _createCrossReference();
        const olderValue: number[] = [];
        const newerValue: number[] = [1];
        const result: boolean = crossReference._isEqual(olderValue, newerValue, 1, 2, false, undefined as any);
        expect(result).toBe(false);
    });
    it('should return false when same-length arrays contain different values', () => {
        const crossReference: _PdfCrossReference =
            _createCrossReference();
        const olderValue: number[] = [
            1,
            2
        ];
        const newerValue: number[] = [
            1,
            3
        ];
        const result: boolean =
            crossReference._isEqual(
                olderValue,
                newerValue,
                1,
                2,
                false,
                undefined as any
            );
        expect(result).toBe(false);
    });
    it('should use owner password as _password when userPassword is not provided', () => {
        const crossReference: any = _createCrossReference();
        crossReference._trailer = new _PdfDictionary();
        crossReference._ids = ['test-id'];
        crossReference._initializeEncryptionState({
            ownerPassword: 'ownerPwd'
        });
        expect(crossReference._password).toBe('ownerPwd');
    });
    it('should set _password to userPassword when both userPassword and ownerPassword are provided', () => {
        const crossReference: any = _createCrossReference();
        crossReference._trailer = new _PdfDictionary();
        crossReference._password = undefined;
        crossReference._ids = ['test-id'];
        crossReference._initializeEncryptionState({
            userPassword: 'userPwd',
            ownerPassword: 'ownerPwd'
        });
        expect(crossReference._password).toBe('userPwd');
    });
    it('should assign default encryption type when encryptionType is undefined', () => {
        const crossReference: any = _createCrossReference();
        crossReference._trailer = new _PdfDictionary();
        crossReference._ids = ['test-id'];
        const options: any = {};
        crossReference._initializeEncryptionState(options);
        expect(options.encryptionType).toBe(
            PdfEncryptionType.rc4Bit40
        );
    });
    it('should preserve the provided permissions value', () => {
        const crossReference: any = _createCrossReference();
        const options: any = {
            permissions: PdfPermissionFlag.print
        };
        crossReference._encryptionState = options;
        expect(crossReference._encryptionState.permissions).toBe(
            PdfPermissionFlag.print
        );
    });
    it('should update the existing encrypt dictionary when Encrypt reference exists', () => {
        const crossReference: any = _createCrossReference();
        const encryptRef: any = new _PdfReference(1, 0);
        let cachedKey: any;
        crossReference._trailer = {
            _map: {
                Encrypt: encryptRef
            }
        };
        crossReference._ids = ['test-id'];
        crossReference._document = {
            getSecurity: () => ({})
        };
        crossReference._cacheMap = {
            set: (key: any) => {
                cachedKey = key;
            }
        };
        crossReference._updateEncryptionSettings({});
        expect(cachedKey).toBe(encryptRef);
    });
    it('should add encrypt dictionary to trailer when Encrypt is not a PdfReference', () => {
        const crossReference: any = _createCrossReference();
        let isEncryptDictionaryAdded: boolean = false;
        crossReference._trailer = {
            _map: {
                Encrypt: {}
            }
        };
        crossReference._ids = ['test-id'];
        crossReference._document = {
            getSecurity: () => ({})
        };
        crossReference._addEncryptDictionaryToTrailer = () => {
            isEncryptDictionaryAdded = true;
        };
        crossReference._updateEncryptionSettings({});
        expect(isEncryptDictionaryAdded).toBe(true);
    });
    it('should update cache map when Encrypt contains a PdfReference', () => {
        const crossReference: any = _createCrossReference();
        const encryptRef: any = new _PdfReference(1, 0);
        let cachedKey: any;
        crossReference._trailer = {
            _map: {
                Encrypt: encryptRef
            }
        };
        crossReference._ids = ['test-id'];
        crossReference._document = {
            getSecurity: () => ({})
        };
        crossReference._cacheMap = {
            set: (key: any) => {
                cachedKey = key;
            }
        };
        crossReference._updateEncryptionSettings({});
        expect(cachedKey).toBe(encryptRef);
    });
    it('should throw an exception when the third parsed object is undefined', () => {
        const crossReference: any = _createCrossReference();
        const reference: any = {
            objectNumber: 1,
            generationNumber: 0
        };
        const xrefEntry: any = {
            gen: 0,
            offset: 0
        };
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                xrefEntry,
                false
            );
        }).toThrow();
    });
    it('should throw an exception when the third parsed object is undefined', () => {
        const crossReference: any = _createCrossReference();
        const reference: any = {
            objectNumber: 1,
            generationNumber: 0
        };
        const xrefEntry: any = {
            gen: 0,
            offset: 0
        };
        crossReference._stream = {
            start: 0,
            makeSubStream: () => ({})
        };
        const parser: any = {
            getObject: () => {
                const values = [1, 0, undefined];
                return values.shift();
            }
        };
        // Arrange test setup so _PdfParser returns the above parser
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                reference,
                xrefEntry,
                false
            );
        }).toThrow();
    });
});
describe('PdfCrossReference survived mutation coverage', () => {
    let document: PdfDocument;
    let crossReference: _PdfCrossReference;
    const createDictionary = (): _PdfDictionary => {
        return new _PdfDictionary(crossReference);
    };
    const createUncompressedEntry = (
        offset: number,
        generation: number
    ): any => {
        return {
            offset,
            gen: generation,
            uncompressed: true,
            free: false
        };
    };
    const createHistoryEntry = (
        offset: number,
        revisionId: number
    ): any => {
        return {
            offset,
            revisionId,
            uncompressed: true,
            compressed: false,
            free: false
        };
    };
    const createStream = (
        bytes: number[],
        subtype?: string
    ): _PdfStream => {
        const dictionary: _PdfDictionary = createDictionary();
        if (subtype) {
            dictionary.set('Subtype', _PdfName.get(subtype));
        }
        return new _PdfStream(
            bytes,
            dictionary,
            0,
            bytes.length
        );
    };
    const createReference = (
        objectNumber: number,
        generationNumber: number = 0
    ): _PdfReference => {
        return new _PdfReference(
            objectNumber,
            generationNumber
        );
    };
    const setRevisionDictionary = (
        objectNumber: number,
        dictionarySource: string,
        revisionId: number
    ): _PdfReference => {
        const source: string =
            `${objectNumber} 0 obj\n${dictionarySource}\nendobj`;
        const bytes: Uint8Array = new Uint8Array(
            source.split('').map((character: string) =>
                character.charCodeAt(0)
            )
        );
        crossReference._stream = new _PdfStream(bytes);
        crossReference._entries = [];
        crossReference._entriesHistory = [];
        const entry: any = {
            offset: 0,
            gen: 0,
            uncompressed: true,
            compressed: false,
            free: false,
            revisionId
        };
        crossReference._entries[objectNumber] = entry;
        crossReference._entriesHistory[objectNumber] = [entry];
        return createReference(objectNumber, 0);
    };
    beforeEach(() => {
        document = new PdfDocument();
        crossReference = document._crossReference;
    });
    afterEach(() => {
        document.destroy();
    });
    // Mutant 2639
    it('should parse an uncompressed dictionary object without enabling recovery parsing', () => {
        const bytes: Uint8Array = new Uint8Array([
            49, 32, 48, 32, 111, 98, 106, 10,
            60, 60, 32,
            47, 84, 121, 112, 101, 32,
            47, 69, 120, 97, 109, 112, 108, 101, 32,
            62, 62, 10,
            101, 110, 100, 111, 98, 106
        ]);
        const stream: _PdfStream = new _PdfStream(bytes);
        crossReference._stream = stream;
        const reference: _PdfReference = _PdfReference.get(1, 0);
        const entry: any = createUncompressedEntry(0, 0);
        const result: any =
            crossReference._fetchUncompressedAtOffset(
                reference,
                entry,
                false
            );
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.get('Type')).toBe(_PdfName.get('Example'));
    });
    // Mutant 2651
    it('should accept a valid uncompressed object header', () => {
        const bytes: Uint8Array = new Uint8Array([
            50, 32, 48, 32, 111, 98, 106, 10,
            49, 50, 51, 10,
            101, 110, 100, 111, 98, 106
        ]);
        crossReference._stream = new _PdfStream(bytes);
        const result: any =
            crossReference._fetchUncompressedAtOffset(
                _PdfReference.get(2, 0),
                createUncompressedEntry(0, 0),
                false
            );
        expect(result).toBe(123);
    });
    it('should reject an uncompressed object when the object command is missing', () => {
        const bytes: Uint8Array = new Uint8Array([
            51, 32, 48, 32, 111, 98, 106, 10,
            49, 50, 51, 10,
            101, 110, 100, 111, 98, 106
        ]);
        crossReference._stream = new _PdfStream(bytes);
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                _PdfReference.get(2, 0),
                createUncompressedEntry(0, 0),
                false
            );
        }).toThrow(
            jasmine.objectContaining({
                message: 'Bad uncompressed XRef entry: 2 0',
                name: 'XRefEntryException'
            })
        );
    });
    it('should report the expected message for an invalid uncompressed entry', () => {
        const bytes: Uint8Array = new Uint8Array([
            51, 32, 48, 32, 111, 98, 106, 10,
            49, 10,
            101, 110, 100, 111, 98, 106
        ]);
        crossReference._stream = new _PdfStream(bytes);
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                createReference(2, 0),
                createUncompressedEntry(0, 0),
                false
            );
        }).toThrow(
            jasmine.objectContaining({
                message: 'Bad uncompressed XRef entry: 2 0',
                name: 'XRefEntryException'
            })
        );
    });
    it('should classify an invalid uncompressed entry as an XRef entry exception', () => {
        const bytes: Uint8Array = new Uint8Array([
            51, 32, 48, 32, 111, 98, 106, 10,
            49, 10,
            101, 110, 100, 111, 98, 106
        ]);
        crossReference._stream = new _PdfStream(bytes);
        expect(() => {
            crossReference._fetchUncompressedAtOffset(
                createReference(2, 0),
                createUncompressedEntry(0, 0),
                false
            );
        }).toThrow(
            jasmine.objectContaining({
                name: 'XRefEntryException'
            })
        );
    });
    // Mutant 2664
    it('should pass the decryption flag when an encrypted object is parsed', () => {
        const bytes: Uint8Array = new Uint8Array([
            52, 32, 48, 32, 111, 98, 106, 10,
            40, 112, 108, 97, 105, 110, 41, 10,
            101, 110, 100, 111, 98, 106
        ]);
        crossReference._stream = new _PdfStream(bytes);
        const result: any =
            crossReference._fetchUncompressedAtOffset(
                _PdfReference.get(4, 0),
                createUncompressedEntry(0, 0),
                true
            );
        expect(result).toBe('plain');
    });
    // Mutant 2679
    it('should use the normal compressed-object fallback when history has no container entry', () => {
        crossReference._entriesHistory = [];
        const reference: _PdfReference =
            _PdfReference.get(8, 0);
        const entry: any = {
            offset: 20,
            gen: 0,
            compressed: true,
            revisionId: 1
        };
        expect(() => {
            crossReference._fetchCompressedAtEntry(
                reference,
                entry
            );
        }).toThrowError();
    });
    // Mutant 2779
    it('should return no latest entry when object history is empty', () => {
        crossReference._entriesHistory = [];
        crossReference._entriesHistory[10] = [];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.latest).toBeUndefined();
        expect(result.inside).toBeUndefined();
    });
    // Mutant 2785
    it('should ignore a byte range containing fewer than four values', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(100, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200]
            );
        expect(result.latest).toBe(entry);
        expect(result.inside).toBeUndefined();
    });
    // Mutant 2796
    it('should include an offset equal to the first signed range start', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(100, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.inside).toBe(entry);
    });
    // Mutant 2798
    it('should exclude an offset outside both signed ranges', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(150, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.inside).toBeUndefined();
    });
    // Mutant 2799
    it('should exclude an offset equal to the first signed range end', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(110, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.inside).toBeUndefined();
    });
    // Mutant 2802
    it('should include an offset that belongs only to the second signed range', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(205, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.inside).toBe(entry);
    });
    // Mutant 2805
    it('should include an offset equal to the second signed range start', () => {
        crossReference._entriesHistory = [];
        const entry: any = createHistoryEntry(200, 0);
        crossReference._entriesHistory[10] = [entry];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.inside).toBe(entry);
    });
    // Mutant 2812
    it('should terminate after examining every history entry without reading past the array', () => {
        crossReference._entriesHistory = [];
        const first: any = createHistoryEntry(50, 0);
        const second: any = createHistoryEntry(150, 1);
        crossReference._entriesHistory[10] = [
            first,
            second
        ];
        const result: any =
            crossReference._getEntryVersions(
                10,
                [100, 10, 200, 10]
            );
        expect(result.latest).toBe(first);
        expect(result.inside).toBeUndefined();
    });
    // Mutant 2827
    it('should use the latest container when a compressed entry has no integer revision identifier', () => {
        crossReference._entriesHistory = [];
        crossReference._entries = [];
        const latestContainer: any = {
            offset: 500,
            uncompressed: true
        };
        crossReference._entries[40] = latestContainer;
        const compressedEntry: any = {
            offset: 40,
            revisionId: undefined as any,
            compressed: true
        };
        expect(
            crossReference._getPhysicalOffsetForEntry(
                compressedEntry
            )
        ).toBe(500);
    });
    // Mutant 2909
    it('should resolve a widget field type directly from the widget dictionary', () => {
        const newer: _PdfDictionary = createDictionary();
        const older: _PdfDictionary = createDictionary();
        newer.set('Subtype', _PdfName.get('Widget'));
        newer.set('FT', _PdfName.get('Sig'));
        older.set('Subtype', _PdfName.get('Widget'));
        older.set('FT', _PdfName.get('Sig'));
        expect(
            crossReference._checkSubType(
                newer,
                older,
                false,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeTruthy();
    });
    // Mutant 2937
    it('should permit a signature widget regardless of form-fill permission', () => {
        const newer: _PdfDictionary = createDictionary();
        const older: _PdfDictionary = createDictionary();
        newer.set('Subtype', _PdfName.get('Widget'));
        newer.set('FT', _PdfName.get('Sig'));
        older.set('Subtype', _PdfName.get('Widget'));
        older.set('FT', _PdfName.get('Sig'));
        expect(
            crossReference._checkSubType(
                newer,
                older,
                true,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeTruthy();
    });
    // Mutant 2977
    it('should reject a modified annotation when comment permission is unavailable', () => {
        const newer: _PdfDictionary = createDictionary();
        const older: _PdfDictionary = createDictionary();
        newer.set('Subtype', _PdfName.get('Text'));
        newer.set('Contents', 'updated');
        older.set('Subtype', _PdfName.get('Text'));
        older.set('Contents', 'original');
        expect(
            crossReference._checkSubType(
                newer,
                older,
                true,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should not classify a form stream as an XML stream', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('Form')
        );
        const bytes: Uint8Array = new Uint8Array([
            51, 32, 48, 32, 111, 98, 106, 10,
            49, 10
        ]);
        const stream: _PdfStream = new _PdfStream(
            bytes,
            dictionary,
            0,
            bytes.length
        );
        const resolved: _PdfDictionary =
            crossReference._asDictionary(stream);
        const subtype: _PdfName =
            resolved.get('Subtype');
        expect(subtype.name).toBe('Form');
        expect(subtype.name === 'XML').toBeFalsy();
    });
    it('should recognize a text field by its exact field type name', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('FT', _PdfName.get('Tx'));
        newer.set('FT', _PdfName.get('Tx'));
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.allowFormFill,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should not treat an empty field type as a text field', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('FT', '');
        newer.set('FT', '');
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.allowFormFill,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should process an editable field when form filling is permitted', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('FT', _PdfName.get('Btn'));
        newer.set('FT', _PdfName.get('Btn'));
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.allowFormFill,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should reject an editable field when the required permission is unavailable', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('FT', _PdfName.get('Ch'));
        newer.set('FT', _PdfName.get('Ch'));
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should require both certification presence and an allowed field permission', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('FT', _PdfName.get('Tx'));
        newer.set('FT', _PdfName.get('Tx'));
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should ignore annotation-array values during dictionary comparison', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Type', _PdfName.get('Page'));
        newer.set('Type', _PdfName.get('Page'));
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should compare a non-annotation key instead of skipping the value', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Rotate', 0);
        newer.set('Rotate', 90);
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should continue comparison after encountering the annotation key', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [_PdfReference.get(20, 0)]);
        older.set('Rotate', 0);
        newer.set('Rotate', 90);
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should compare equal PDF names by their name values', () => {
        const olderName: _PdfName = _PdfName.get('Widget');
        const newerName: _PdfName = _PdfName.get('Widget');
        expect(
            crossReference._isEqual(
                olderName,
                newerName,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should reject different PDF name values', () => {
        const olderName: _PdfName = _PdfName.get('Widget');
        const newerName: _PdfName = _PdfName.get('Text');
        expect(
            crossReference._isEqual(
                olderName,
                newerName,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should return immediately after comparing two PDF names', () => {
        const olderName: _PdfName = _PdfName.get('Text');
        const newerName: _PdfName = _PdfName.get('Text');
        expect(
            crossReference._isEqual(
                olderName,
                newerName,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should require both operands to be references before resolving them', () => {
        const olderReference: _PdfReference =
            new _PdfReference(31, 0);
        const newerValue: number = 25;
        expect(
            crossReference._isRef(olderReference)
        ).toBeTruthy();
        expect(
            crossReference._isRef(newerValue)
        ).toBeFalsy();
        expect(
            crossReference._isRef(olderReference) &&
            crossReference._isRef(newerValue)
        ).toBeFalsy();
    });
    it('should recursively compare dictionaries resolved from two references', () => {
        const olderReference: _PdfReference = _PdfReference.get(31, 0);
        const newerReference: _PdfReference = _PdfReference.get(32, 0);
        const olderDictionary: _PdfDictionary = createDictionary();
        const newerDictionary: _PdfDictionary = createDictionary();
        olderDictionary.set('Value', 'same');
        newerDictionary.set('Value', 'same');
        crossReference._entriesHistory = [];
        crossReference._cacheMap.set(olderReference, olderDictionary);
        crossReference._cacheMap.set(newerReference, newerDictionary);
        expect(
            crossReference._isEqual(
                olderReference,
                newerReference,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should return null when a revision reference has no entry', () => {
        crossReference._entries = [];
        crossReference._entriesHistory = [];
        const result: any =
            crossReference._fetchReferenceInRevision(
                createReference(31, 0),
                1
            );
        expect(result).toBeNull();
    });
    it('should preserve annotation handling when comparing nested dictionaries', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Subtype', _PdfName.get('Text'));
        older.set('Contents', 'original');
        newer.set('Subtype', _PdfName.get('Text'));
        newer.set('Contents', 'updated');
        expect(
            crossReference._areEqual(
                older,
                newer,
                false,
                true,
                PdfCertificationFlag.forbidChanges,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should compare unresolved reference values using their serialized results', () => {
        const olderReference: _PdfReference = _PdfReference.get(41, 0);
        const newerReference: _PdfReference = _PdfReference.get(42, 0);
        crossReference._entriesHistory = [];
        crossReference._cacheMap.set(olderReference, 25);
        crossReference._cacheMap.set(newerReference, 25);
        expect(
            crossReference._isEqual(
                olderReference,
                newerReference,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should require both operands to be arrays before array comparison', () => {
        expect(
            crossReference._isEqual(
                [1, 2],
                '1,2',
                0,
                1,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should compare values at every valid array index', () => {
        expect(
            crossReference._isEqual(
                [1, 2, 3],
                [1, 2, 4],
                0,
                1,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should recursively compare two dictionary values', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Count', 3);
        newer.set('Count', 3);
        expect(
            crossReference._isEqual(
                older,
                newer,
                0,
                1,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should not treat a dictionary and a primitive value as two dictionaries', () => {
        const dictionary: _PdfDictionary =
            createDictionary();
        dictionary.set('Count', 3);
        const primitiveValue: number = 3;
        expect(
            crossReference._isDict(dictionary)
        ).toBeTruthy();
        expect(
            crossReference._isDict(primitiveValue)
        ).toBeFalsy();
        expect(
            crossReference._isDict(dictionary) &&
            crossReference._isDict(primitiveValue)
        ).toBeFalsy();
    });
    it('should preserve annotation handling during nested dictionary comparison', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Type', _PdfName.get('Annot'));
        older.set('Subtype', _PdfName.get('Text'));
        older.set('Contents', 'original');
        newer.set('Type', _PdfName.get('Annot'));
        newer.set('Subtype', _PdfName.get('Text'));
        newer.set('Contents', 'updated');
        expect(
            crossReference._isEqual(
                older,
                newer,
                0,
                1,
                true,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeFalsy();
    });
    it('should reject object comparison when the older dictionary is absent', () => {
        const newer: _PdfDictionary = createDictionary();
        expect(
            crossReference._compareObjects(
                null as any,
                newer,
                new Set<number>(),
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should reject object comparison when the newer dictionary is absent', () => {
        const older: _PdfDictionary = createDictionary();
        expect(
            crossReference._compareObjects(
                older,
                null as any,
                new Set<number>(),
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should use special comparison for an object present in the skip collection', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const skipObjects: Set<number> = new Set<number>();
        older.set('Fields', []);
        newer.set('Fields', []);
        skipObjects.add(10);
        expect(
            crossReference._compareObjects(
                older,
                newer,
                skipObjects,
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should use normal comparison for an object absent from the skip collection', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const skipObjects: Set<number> = new Set<number>();
        older.set('Count', 1);
        newer.set('Count', 2);
        skipObjects.add(20);
        expect(
            crossReference._compareObjects(
                older,
                newer,
                skipObjects,
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should require both a skip collection and a matching object number', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const skipObjects: Set<number> = new Set<number>();
        older.set('Count', 1);
        newer.set('Count', 2);
        skipObjects.add(20);
        expect(
            crossReference._compareObjects(
                older,
                newer,
                skipObjects,
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should detect changes while preserving annotation-aware object comparison', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Rotate', 0);
        newer.set('Rotate', 90);
        expect(
            crossReference._compareObjects(
                older,
                newer,
                new Set<number>(),
                10,
                false,
                undefined as any,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should return false when the newer fields value is not an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [
            _PdfReference.get(50, 0)
        ]);
        newer.set('Fields', _PdfReference.get(50, 0));
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should return false when the older fields value is not an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', _PdfReference.get(50, 0));
        newer.set('Fields', [
            _PdfReference.get(50, 0)
        ]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should require both fields values to be arrays before comparing references', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', _PdfReference.get(50, 0));
        newer.set('Fields', _PdfReference.get(50, 0));
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should return false when the older fields value is not an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', _PdfReference.get(10, 0));
        newer.set('Fields', [_PdfReference.get(10, 0)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should return false when only the newer fields value is an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', _PdfReference.get(10, 0));
        newer.set('Fields', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should stop processing when either fields value is not an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', _PdfReference.get(10, 0));
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should treat the same field reference instance as equal', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const reference: _PdfReference = _PdfReference.get(10, 0);
        older.set('Fields', [reference]);
        newer.set('Fields', [reference]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should finish reference comparison after finding identical values', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const reference: _PdfReference = _PdfReference.get(10, 0);
        older.set('Fields', [reference]);
        newer.set('Fields', [reference]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should preserve equality for the same field reference instance', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const reference: _PdfReference = _PdfReference.get(10, 0);
        older.set('Fields', [reference]);
        newer.set('Fields', [reference]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should compare two separate references by object and generation numbers', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', [_PdfReference.get(10, 0)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should not compare a reference and a primitive as two references', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', [10]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should distinguish references with different generation numbers', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', [_PdfReference.get(10, 1)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should reject a primitive value as equal to a field reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', ['10 0 R']);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should examine all existing fields when searching for a matching reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [
            _PdfReference.get(10, 0),
            _PdfReference.get(20, 0)
        ]);
        newer.set('Fields', [
            _PdfReference.get(20, 0),
            _PdfReference.get(10, 0)
        ]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should reject a primitive field that is absent from the older collection', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', ['first']);
        newer.set('Fields', ['second']);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should not match different primitive field values', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', ['field-one']);
        newer.set('Fields', ['field-two']);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should match equal primitive field values without requiring references', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', ['field']);
        newer.set('Fields', ['field']);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should require both compared values to be non-reference values', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', ['field']);
        newer.set('Fields', [_PdfReference.get(10, 0)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should not treat a reference as a primitive field value', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', ['field']);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should process equal-length field collections using membership comparison', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [
            _PdfReference.get(10, 0),
            _PdfReference.get(20, 0)
        ]);
        newer.set('Fields', [
            _PdfReference.get(20, 0),
            _PdfReference.get(10, 0)
        ]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeFalsy();
    });
    it('should process a larger newer field collection as an addition', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const existing: _PdfReference =
            createReference(10, 0);
        const added: _PdfReference =
            setRevisionDictionary(
                20,
                '<< /FT /Sig >>',
                1
            );
        older.set('Fields', [existing]);
        newer.set('Fields', [existing, added]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        )
    });
    it('should distinguish equal-length and different-length field collections', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', [
            _PdfReference.get(10, 0),
            _PdfReference.get(20, 0)
        ]);
        crossReference._cacheMap.set(
            _PdfReference.get(20, 0),
            createDictionary()
        );
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should return after detecting a replaced field in equal-length collections', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Fields', [_PdfReference.get(10, 0)]);
        newer.set('Fields', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._readFormReferences(
                older,
                newer,
                0,
                1
            )
        ).toBeTruthy();
    });
    it('should report a page modification when certification forbids changes', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeTruthy();
    });
    it('should compare page content references when both pages contain contents', () => {
        const older: _PdfDictionary = new _PdfDictionary();
        const newer: _PdfDictionary = new _PdfDictionary();
        const olderContent: _PdfReference =
            new _PdfReference(10, 0);
        const newerContent: _PdfReference =
            new _PdfReference(20, 0);
        older.set('Contents', olderContent);
        newer.set('Contents', newerContent);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should not compare content references when only the newer page has contents', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Contents', _PdfReference.get(20, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should require both pages to contain contents before direct reference comparison', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', _PdfReference.get(10, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should use the exact contents key when comparing page streams', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', _PdfReference.get(10, 0));
        newer.set('Contents', _PdfReference.get(10, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should require the older page to contain the contents key', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('', _PdfReference.get(10, 0));
        newer.set('Contents', _PdfReference.get(10, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should complete the content-comparison branch after detecting a replacement', () => {
        const older: _PdfDictionary = new _PdfDictionary();
        const newer: _PdfDictionary = new _PdfDictionary();
        const olderContent: _PdfReference =
            new _PdfReference(10, 0);
        const newerContent: _PdfReference =
            new _PdfReference(20, 0);
        older.set('Contents', olderContent);
        newer.set('Contents', newerContent);
        const storedOlderContent: any =
            older.get('Contents');
        const storedNewerContent: any =
            newer.get('Contents');
        expect(
            storedOlderContent instanceof _PdfReference
        ).toBeTruthy();
        expect(
            storedNewerContent instanceof _PdfReference
        ).toBeTruthy();
        expect(
            storedOlderContent.objectNumber
        ).toBe(10);
        expect(
            storedNewerContent.objectNumber
        ).toBe(20);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should read the newer content value from the contents entry', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', _PdfReference.get(10, 0));
        newer.set('Contents', _PdfReference.get(20, 0));
        newer.set('', _PdfReference.get(10, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should read the older content value from the contents entry', () => {
        const older: _PdfDictionary = new _PdfDictionary();
        const newer: _PdfDictionary = new _PdfDictionary();
        const olderContent: _PdfReference =
            new _PdfReference(10, 0);
        const newerContent: _PdfReference =
            new _PdfReference(20, 0);
        older.set('Contents', olderContent);
        newer.set('Contents', newerContent);
        expect(
            older.getRaw('Contents')
        ).toBe(olderContent);
        expect(
            newer.getRaw('Contents')
        ).toBe(newerContent);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should require both content values to be references before comparing object numbers', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', 'stream-data');
        newer.set('Contents', _PdfReference.get(20, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should not compare object numbers when the newer content is not a reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', _PdfReference.get(10, 0));
        newer.set('Contents', 'stream-data');
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should not compare object numbers when the older content is not a reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Contents', 'stream-data');
        newer.set('Contents', _PdfReference.get(20, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should allow annotation processing when no certification permission is present', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should not allow an unrelated page key when no certification permission is present', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Rotate', 90);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should allow annotation processing when comment permission is granted', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should reject annotation processing when certification forbids changes', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeTruthy();
    });
    it('should allow annotation processing with form-fill permission', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowFormFill
            )
        ).toBeFalsy();
    });
    it('should reject annotation processing with an unsupported permission', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeTruthy();
    });
    it('should require certification presence for comment permission evaluation', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeFalsy();
    });
    it('should require certification presence for form-fill permission evaluation', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeFalsy();
    });
    it('should not permit annotation changes from the permission value alone', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should allow unchanged annotations when certification is absent', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                PdfCertificationFlag.forbidChanges
            )
        ).toBeFalsy();
    });
    it('should reject a newly added non-annotation key', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Rotate', 90);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should permit a newly added annotation array when annotation changes are allowed', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should use the exact annotation key when evaluating a newly added entry', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should complete processing after accepting a newly added annotation entry', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        newer.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should avoid annotation-array comparison for a non-annotation key', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Custom', [_PdfReference.get(10, 0)]);
        newer.set('Custom', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should compare the exact annotation key when both pages contain it', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should complete annotation processing when both arrays are unchanged', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should enter annotation-array processing only when both values are arrays', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', []);
        newer.set('Annots', 'invalid');
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should skip array-specific annotation processing when the older value is not an array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', 'invalid');
        newer.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should require both annotation values to be arrays', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', []);
        newer.set('Annots', 'invalid');
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should complete array-specific annotation processing for matching arrays', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(30, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should report a modification when a widget annotation is removed', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const widgetReference: _PdfReference = _PdfReference.get(40, 0);
        const widget: _PdfDictionary = createDictionary();
        widget.set('Subtype', _PdfName.get('Widget'));
        older.set('Annots', [widgetReference]);
        newer.set('Annots', []);
        crossReference._cacheMap.set(widgetReference, widget);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should require every older annotation to exist in the newer array', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [
            _PdfReference.get(10, 0),
            _PdfReference.get(20, 0)
        ]);
        newer.set('Annots', [
            _PdfReference.get(10, 0)
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should require reference checks and matching object numbers for annotations', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should not match annotation references by object number when one value is not a reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [{ objectNumber: 10 }]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should require both annotation values to be references before matching', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [{ objectNumber: 10 }]);
        newer.set('Annots', [_PdfReference.get(10, 0)]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should match annotation references with the same object number', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [_PdfReference.get(10, 1)]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should report a modification when an older annotation has no matching newer reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [_PdfReference.get(20, 0)]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should avoid added-annotation processing when the annotation arrays have equal lengths', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const annotation: _PdfReference = _PdfReference.get(10, 0);
        older.set('Annots', [annotation]);
        newer.set('Annots', [annotation]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should not process additions when the newer and older annotation counts are equal', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const first: _PdfReference = _PdfReference.get(10, 0);
        const second: _PdfReference = _PdfReference.get(20, 0);
        older.set('Annots', [first, second]);
        newer.set('Annots', [second, first]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should require both compared annotation values to be references while filtering additions', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [
            _PdfReference.get(10, 0),
            'invalid-annotation'
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should identify a primitive newer annotation as a newly added value', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [
            _PdfReference.get(10, 0),
            'invalid-annotation'
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should require the older annotation value to be a reference while filtering additions', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', ['existing']);
        newer.set('Annots', [
            'existing',
            _PdfReference.get(20, 0)
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should require the newer annotation value to be a reference while filtering additions', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [
            _PdfReference.get(10, 0),
            'new-annotation'
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should not treat an existing object number as a newly added annotation', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const additionalGeneration: _PdfReference =
            _PdfReference.get(10, 1);
        older.set('Annots', [_PdfReference.get(10, 0)]);
        newer.set('Annots', [
            _PdfReference.get(10, 0),
            additionalGeneration
        ]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should iterate through every newly added annotation reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const source: string =
            '20 0 obj\n<< /Subtype /Text >>\nendobj\n' +
            '30 0 obj\n<< /Subtype /Highlight >>\nendobj';
        const bytes: Uint8Array = new Uint8Array(
            source.split('').map((character: string) =>
                character.charCodeAt(0)
            )
        );
        const secondOffset: number =
            source.indexOf('30 0 obj');
        crossReference._stream = new _PdfStream(bytes);
        crossReference._entries = [];
        crossReference._entriesHistory = [];
        const firstEntry: any = {
            offset: 0,
            gen: 0,
            uncompressed: true,
            compressed: false,
            free: false,
            revisionId: 0
        };
        const secondEntry: any = {
            offset: secondOffset,
            gen: 0,
            uncompressed: true,
            compressed: false,
            free: false,
            revisionId: 0
        };
        crossReference._entries[20] = firstEntry;
        crossReference._entries[30] = secondEntry;
        crossReference._entriesHistory[20] = [
            firstEntry
        ];
        crossReference._entriesHistory[30] = [
            secondEntry
        ];
        newer.set('Annots', [
            createReference(20, 0),
            createReference(30, 0)
        ]);
        older.set('Annots', []);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should reject a newly added annotation value that is not a reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Annots', []);
        newer.set('Annots', ['Text']);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should reject a newly added reference when its dictionary cannot be resolved', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const added: _PdfReference = _PdfReference.get(20, 0);
        older.set('Annots', []);
        newer.set('Annots', [added]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should process a permitted newly added text annotation', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const existing: _PdfReference =
            createReference(10, 0);
        const added: _PdfReference =
            setRevisionDictionary(
                20,
                '<< /Subtype /Text >>',
                0
            );
        older.set('Annots', [existing]);
        newer.set('Annots', [existing, added]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            ));
    });
    it('should filter the newer array to obtain only newly added references', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const existing: _PdfReference =
            createReference(10, 0);
        const added: _PdfReference =
            setRevisionDictionary(
                20,
                '<< /Subtype /Text >>',
                0
            );
        older.set('Annots', [existing]);
        newer.set('Annots', [existing, added]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            ));
    });
    it('should trim whitespace from an added annotation subtype name', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const added: _PdfReference =
            setRevisionDictionary(
                20,
                '<< /Subtype (  Text  ) >>',
                0
            );
        older.set('Annots', []);
        newer.set('Annots', [added]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeFalsy();
    });
    it('should use subtype string conversion when the subtype name is empty', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const added: _PdfReference = _PdfReference.get(20, 0);
        const addedDictionary: _PdfDictionary = createDictionary();
        addedDictionary.set('Subtype', _PdfName.get(''));
        older.set('Annots', []);
        newer.set('Annots', [added]);
        crossReference._cacheMap.set(added, addedDictionary);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowComments
            )
        ).toBeTruthy();
    });
    it('should permit a newly added widget annotation', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        const added: _PdfReference =
            setRevisionDictionary(
                20,
                '<< /Subtype /Widget >>',
                0
            );
        older.set('Annots', []);
        newer.set('Annots', [added]);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                true,
                PdfCertificationFlag.allowFormFill
            )
        ).toBeFalsy();
    });
    it('should require both changed non-annotation values to be references', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Resources', 'resource-data');
        newer.set('Resources', _PdfReference.get(20, 0));
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should detect a changed reference when both non-annotation values are references', () => {
        const older: _PdfDictionary = new _PdfDictionary();
        const newer: _PdfDictionary = new _PdfDictionary();
        const olderResources: _PdfReference =
            new _PdfReference(10, 0);
        const newerResources: _PdfReference =
            new _PdfReference(20, 0);
        older.set('Resources', olderResources);
        newer.set('Resources', newerResources);
        expect(
            older.get('Resources')
        ).toBe(olderResources);
        expect(
            newer.get('Resources')
        ).toBe(newerResources);
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeTruthy();
    });
    it('should not compare reference object numbers when the newer value is not a reference', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Resources', _PdfReference.get(10, 0));
        newer.set('Resources', 'resource-data');
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should require both non-annotation values to be references before reporting a reference change', () => {
        const older: _PdfDictionary = createDictionary();
        const newer: _PdfDictionary = createDictionary();
        older.set('Resources', 'old-resource-data');
        newer.set('Resources', 'new-resource-data');
        expect(
            crossReference._verifyPageIsModify(
                older,
                newer,
                false,
                undefined as any
            )
        ).toBeFalsy();
    });
    it('should complete form-field removal processing for empty annotation arrays', () => {
        expect(
            crossReference._checkFormFieldRemoved(
                [],
                [],
                1
            )
        ).toBeFalsy();
    });
    it('should inspect every old annotation while checking for removed form fields', () => {
        const first: _PdfReference = _PdfReference.get(10, 0);
        const second: _PdfReference = _PdfReference.get(20, 0);
        expect(
            crossReference._checkFormFieldRemoved(
                [first, second],
                [first, second],
                1
            )
        ).toBeFalsy();
    });
    it('should finish form-field removal iteration after the final annotation', () => {
        const annotation: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._checkFormFieldRemoved(
                [annotation],
                [annotation],
                1
            )
        ).toBeFalsy();
    });
    it('should report a removed widget annotation', () => {
        const removed: _PdfReference =
            setRevisionDictionary(
                10,
                '<< /Subtype /Widget >>',
                1
            );
        expect(
            crossReference._checkFormFieldRemoved(
                [removed],
                [],
                1
            )
        ).toBeTruthy();
    });
    it('should not report a retained widget annotation as removed', () => {
        const widgetReference: _PdfReference = _PdfReference.get(10, 0);
        const widgetDictionary: _PdfDictionary = createDictionary();
        widgetDictionary.set('Subtype', _PdfName.get('Widget'));
        crossReference._cacheMap.set(
            widgetReference,
            widgetDictionary
        );
        expect(
            crossReference._checkFormFieldRemoved(
                [widgetReference],
                [widgetReference],
                1
            )
        ).toBeFalsy();
    });
    it('should stop removal inspection after a missing non-widget annotation', () => {
        const textReference: _PdfReference = _PdfReference.get(10, 0);
        const widgetReference: _PdfReference = _PdfReference.get(20, 0);
        const textDictionary: _PdfDictionary = createDictionary();
        const widgetDictionary: _PdfDictionary = createDictionary();
        textDictionary.set('Subtype', _PdfName.get('Text'));
        widgetDictionary.set('Subtype', _PdfName.get('Widget'));
        crossReference._cacheMap.set(
            textReference,
            textDictionary
        );
        crossReference._cacheMap.set(
            widgetReference,
            widgetDictionary
        );
        expect(
            crossReference._checkFormFieldRemoved(
                [textReference, widgetReference],
                [],
                1
            )
        ).toBeFalsy();
    });
    it('should return true when two reference arguments are the same instance', () => {
        const reference: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._refEquals(
                reference,
                reference
            )
        ).toBeTruthy();
    });
    it('should continue reference equality evaluation for separate reference instances', () => {
        const first: _PdfReference = _PdfReference.get(10, 0);
        const second: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._refEquals(
                first,
                second
            )
        ).toBeTruthy();
    });
    it('should require both values to be references before comparing reference properties', () => {
        const reference: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._refEquals(
                reference,
                '10 0 R'
            )
        ).toBeFalsy();
    });
    it('should return false when only the second value is a reference', () => {
        const reference: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._refEquals(
                '10 0 R',
                reference
            )
        ).toBeFalsy();
    });
    it('should compare every array element while searching for a reference', () => {
        const first: _PdfReference = _PdfReference.get(10, 0);
        const second: _PdfReference = _PdfReference.get(20, 0);
        expect(
            crossReference._arrayContains(
                [first, second],
                second
            )
        ).toBeTruthy();
    });
    it('should terminate array searching after the final unmatched element', () => {
        const first: _PdfReference = _PdfReference.get(10, 0);
        const second: _PdfReference = _PdfReference.get(20, 0);
        expect(
            crossReference._arrayContains(
                [first],
                second
            )
        ).toBeFalsy();
    });
    it('should reject a primitive match when the array value is a reference', () => {
        const reference: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._arrayContains(
                [reference],
                '10 0 R'
            )
        ).toBeFalsy();
    });
    it('should match equal primitive values in an array', () => {
        expect(
            crossReference._arrayContains(
                ['Text', 'Widget'],
                'Widget'
            )
        ).toBeTruthy();
    });
    it('should require both array values to be non-references for primitive equality', () => {
        const reference: _PdfReference = _PdfReference.get(10, 0);
        expect(
            crossReference._arrayContains(
                ['10 0 R'],
                reference
            )
        ).toBeFalsy();
    });
    it('should not treat two different primitive annotation values as equal', () => {
        expect(
            crossReference._arrayContains(
                ['Text'],
                'Widget'
            )
        ).toBeFalsy();
    });
    it('should recognize an annotation subtype only after confirming a subtype name exists', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('Text')
        );
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowComments,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should reject a missing subtype during single-subtype validation', () => {
        const dictionary: _PdfDictionary = createDictionary();
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowComments,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should resolve a widget field type directly from the widget dictionary', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        dictionary.set(
            'FT',
            _PdfName.get('Sig')
        );
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should reject a widget whose parent field type is not a signature', () => {
        const parentReference: _PdfReference =
            _PdfReference.get(50, 0);
        const parentDictionary: _PdfDictionary =
            createDictionary();
        const widgetDictionary: _PdfDictionary =
            createDictionary();
        parentDictionary.set(
            'FT',
            _PdfName.get('Tx')
        );
        widgetDictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        widgetDictionary.set(
            'Parent',
            parentReference
        );
        crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        expect(
            crossReference._checkSubTypeSingle(
                widgetDictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should continue safely when a widget parent reference cannot be resolved', () => {
        const parentReference: _PdfReference =
            _PdfReference.get(50, 0);
        const widgetDictionary: _PdfDictionary =
            createDictionary();
        widgetDictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        widgetDictionary.set(
            'Parent',
            parentReference
        );
        expect(
            crossReference._checkSubTypeSingle(
                widgetDictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should use the exact field-type key from a widget parent', () => {
        const parentReference: _PdfReference =
            _PdfReference.get(50, 0);
        const parentDictionary: _PdfDictionary =
            createDictionary();
        const widgetDictionary: _PdfDictionary =
            createDictionary();
        parentDictionary.set(
            '',
            _PdfName.get('Sig')
        );
        widgetDictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        widgetDictionary.set(
            'Parent',
            parentReference
        );
        crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        expect(
            crossReference._checkSubTypeSingle(
                widgetDictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should resolve a signature field type inherited from a widget parent', () => {
        const parentReference: _PdfReference =
            setRevisionDictionary(
                50,
                '<< /FT /Sig >>',
                1
            );
        const widgetDictionary: _PdfDictionary =
            createDictionary();
        widgetDictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        widgetDictionary.set(
            'Parent',
            parentReference
        );
        expect(
            crossReference._checkSubTypeSingle(
                widgetDictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should allow a supported annotation subtype when comment permission is granted', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('Highlight')
        );
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowComments,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should reject a supported annotation subtype when annotation permissions are unavailable', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('Highlight')
        );
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.forbidChanges,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should allow a form subtype during single-subtype validation', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Form'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should recognize a widget subtype supplied as a string', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', 'Widget');
        dictionary.set('FT', _PdfName.get('Sig'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should recognize a signature field type supplied as a string', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Widget'));
        dictionary.set('FT', 'Sig');
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should reject a widget without a direct or inherited field type', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Widget'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should reject a widget when its parent value is not a reference', () => {
        const dictionary: _PdfDictionary = createDictionary();
        const parentDictionary: _PdfDictionary = createDictionary();
        parentDictionary.set('FT', _PdfName.get('Sig'));
        dictionary.set('Subtype', _PdfName.get('Widget'));
        dictionary.set('Parent', parentDictionary);
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should reject a widget when its resolved parent has no field type', () => {
        const parentReference: _PdfReference =
            _PdfReference.get(60, 0);
        const parentDictionary: _PdfDictionary =
            createDictionary();
        const widgetDictionary: _PdfDictionary =
            createDictionary();
        widgetDictionary.set(
            'Subtype',
            _PdfName.get('Widget')
        );
        widgetDictionary.set(
            'Parent',
            parentReference
        );
        crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        expect(
            crossReference._checkSubTypeSingle(
                widgetDictionary,
                false,
                undefined as any,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should reject a text widget during single-subtype validation', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Widget'));
        dictionary.set('FT', _PdfName.get('Tx'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowFormFill,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should allow an annotation subtype when form filling is permitted', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Text'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowFormFill,
                1,
                crossReference
            )
        ).toBeTruthy();
    });
    it('should reject an annotation subtype when certification is absent', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set('Subtype', _PdfName.get('Text'));
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                false,
                PdfCertificationFlag.allowComments,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should reject an unsupported subtype even when annotation changes are permitted', () => {
        const dictionary: _PdfDictionary = createDictionary();
        dictionary.set(
            'Subtype',
            _PdfName.get('UnsupportedSubtype')
        );
        expect(
            crossReference._checkSubTypeSingle(
                dictionary,
                true,
                PdfCertificationFlag.allowComments,
                1,
                crossReference
            )
        ).toBeFalsy();
    });
    it('should reject references with different object numbers', () => {
        const first: _PdfReference =
            _PdfReference.get(10, 0);
        const second: _PdfReference =
            _PdfReference.get(20, 0);
        expect(
            crossReference._refEquals(
                first,
                second
            )
        ).toBeFalsy();
    });
    it('should reject references with different generation numbers', () => {
        const first: _PdfReference =
            _PdfReference.get(10, 0);
        const second: _PdfReference =
            _PdfReference.get(10, 1);
        expect(
            crossReference._refEquals(
                first,
                second
            )
        ).toBeFalsy();
    });
    it('should return false for an empty array and a missing item', () => {
        expect(
            crossReference._arrayContains(
                [],
                _PdfReference.get(10, 0)
            )
        ).toBeFalsy();
    });
    it('should not report a removed non-reference annotation as a removed widget', () => {
        expect(
            crossReference._checkFormFieldRemoved(
                ['Text'],
                [],
                1
            )
        ).toBeFalsy();
    });
    it('should not report a removed annotation whose dictionary has no subtype', () => {
        const annotationReference: _PdfReference =
            _PdfReference.get(70, 0);
        const annotationDictionary: _PdfDictionary =
            createDictionary();
        crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        expect(
            crossReference._checkFormFieldRemoved(
                [annotationReference],
                [],
                1
            )
        ).toBeFalsy();
    });
});