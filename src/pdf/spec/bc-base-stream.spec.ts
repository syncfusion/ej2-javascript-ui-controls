import { _PdfBaseStream, _PdfStream, _PdfNullStream, _PdfContentStream } from '../src/pdf/core/base-stream';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';

describe('_PdfBaseStream - core behaviors', () => {
    class TestPdfBaseStream extends _PdfBaseStream {
        constructor() {
            super();
        }
    }
    describe('_PdfBaseStream.getString', () => {
        class TestPdfBaseStream extends _PdfBaseStream {
            private testBytes: Uint8Array;
            end: number;
            constructor(bytes: number[]) {
                super();
                this.testBytes = new Uint8Array(bytes);
            }

            getBytes(): Uint8Array {
                return this.testBytes;
            }
        }
        it('should use provided bytes when bytes argument is NOT undefined (implicit else)', () => {
            const stream = new TestPdfBaseStream([65, 66]);
            const bytes = new Uint8Array([67, 68]); // "CD"

            const result = stream.getString(false, bytes);
            expect(result).toBe('CD');
        });
        it('should call getBytes when bytes argument is undefined', () => {
            const stream = new TestPdfBaseStream([65, 66, 67]); // "ABC"

            const result = stream.getString();

            expect(result).toBe('ABC');
        });
        it('should return hex string when isHex is true', () => {
            const stream = new TestPdfBaseStream([65, 66, 67]); // ABC

            const result = stream.getString(true);

            expect(result).toBe('414243');
        });
    });
    it('should return null/undefined for base methods and throw for abstract getters', () => {
        // Arrange
        const stream = new TestPdfBaseStream();

        // Act
        const isDataLoaded = stream.isDataLoaded;
        const byteRange = stream.getByteRange(0, 10);
        const subStream = stream.makeSubStream(0, 10, new _PdfDictionary());
        const readBlock = stream.readBlock();
        const reset = stream.reset();
        const moveStart = stream.moveStart();
        const getBaseStreams = stream.getBaseStreams();
        // Assert: default method behavior
        expect(stream.getByte()).toBeNull();
        expect(isDataLoaded).toBeTruthy();
        expect(getBaseStreams).toBeNull();
        expect(byteRange).toBeNull();
        expect(subStream).toBeNull();
        expect(readBlock).toBeNull();
        expect(reset).toBeNull();
        expect(moveStart).toBeNull();

        // Assert: abstract getters throw errors
        expect(() => {
            const length = stream.length;
        }).toThrowError('Abstract getter `length` accessed');
        expect(() => {
            const isEmpty = stream.isEmpty;
        }).toThrowError('Abstract getter `isEmpty` accessed');
    });
    /* ============================
     * Lines 24-26
     * ============================ */
    it('should initialize compression and image flags correctly', () => {
        // Arrange
        const stream = new (_PdfBaseStream as any)();

        // Assert
        expect(stream._isCompress).toBeTruthy();
        expect(stream._isImage).toBeFalsy();
    });

    /* ============================
     * Lines 51-90
     * ============================ */
    it('peekByte should return byte without advancing offset', () => {
        // Arrange
        const data = new Uint8Array([10, 20]);
        const stream = new _PdfStream(data);

        // Act
        const peeked = stream.peekByte();
        const actual = stream.getByte();

        // Assert
        expect(peeked).toBe(10);
        expect(actual).toBe(10);
    });

    it('peekBytes should return bytes without changing stream position', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([1, 2, 3, 4]));

        // Act
        const peeked = stream.peekBytes(2);
        const next = stream.getBytes(2);

        // Assert
        expect(Array.from(peeked)).toEqual([1, 2]);
        expect(Array.from(next)).toEqual([1, 2]);
    });

    it('getUnsignedInteger16 should read two bytes correctly', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([0x01, 0x02]));

        // Act
        const value = stream.getUnsignedInteger16();

        // Assert
        expect(value).toBe(258);
    });

    it('getInt32 should read four bytes correctly', () => {
        // Arrange
        const stream = new _PdfStream(
            new Uint8Array([0x00, 0x00, 0x01, 0x00])
        );

        // Act
        const value = stream.getInt32();

        // Assert
        expect(value).toBe(256);
    });

    it('peekByte should return -1 at end and not modify offset', () => {
        // Arrange
        const data = new Uint8Array([7]);
        const stream = new _PdfStream(data);

        // move to end
        stream.position = stream.end;
        const posAtEnd = stream.position;
        expect(posAtEnd).toBe(stream.end);

        // Act
        const peeked = stream.peekByte();

        // Assert
        expect(peeked).toBe(-1);
        expect(stream.position).toBe(posAtEnd);
    });

    it('getUnsignedInteger16 returns -1 when insufficient bytes remain', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([0xAA]));
        const beforePos = stream.position;
        expect(beforePos).toBe(0);

        // Act
        const value = stream.getUnsignedInteger16();

        // Assert
        expect(value).toBe(-1);
        // two getByte calls attempted, position advanced accordingly
        expect(stream.position).toBe(beforePos + 1);
    });

});

describe('_PdfStream - in‑memory stream implementation', () => {

    /* ============================
     * Lines 30-45
     * ============================ */
    it('should return correct length and empty state', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([1, 2, 3]));

        // Assert
        expect(stream.length).toBe(3);
        expect(stream.isEmpty).toBeFalsy();
    });

    it('should return -1 when reading beyond stream end', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([]));

        // Act
        const value = stream.getByte();

        // Assert
        expect(value).toBe(-1);
    });

    it('peekBytes handles partial reads without changing public position', () => {
        // Arrange
        const data = new Uint8Array([1, 2, 3]);
        const stream = new _PdfStream(data);

        // move to last byte
        stream.position = stream.end - 1;
        const posBefore = stream.position;

        // Act
        const peek = stream.peekBytes(5);

        // Assert
        expect(Array.from(peek)).toEqual([3]);
        expect(stream.position).toBe(posBefore);
    });

    /* ============================
     * Lines 172-180
     * ============================ */
    it('getByteRange should return correct byte slice', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([5, 6, 7, 8]));

        // Act
        const range = stream.getByteRange(1, 3);

        // Assert
        expect(Array.from(range)).toEqual([6, 7]);
    });

    /* ============================
     * Lines 190-192
     * ============================ */
    it('reset should restore stream position to start', () => {
        // Arrange
        const stream = new _PdfStream(new Uint8Array([9, 10, 11]));
        stream.getByte();

        // Act
        stream.reset();
        const value = stream.getByte();

        // Assert
        expect(value).toBe(9);
    });

    /* ============================
     * Line 260
     * ============================ */
    it('_clearStream should remove Filter and mark updated', () => {
        // Arrange
        const dict = new _PdfDictionary();
        dict._map.Filter = 'FlateDecode';
        const stream = new _PdfStream(new Uint8Array([1]), dict);

        // Act
        stream._clearStream();

        // Assert
        expect(dict.has('Filter')).toBeFalsy();
        expect(stream._isCompress).toBeTruthy();
        expect(dict._updated).toBeTruthy();
    });

    /* ============================
     * Line 271
     * ============================ */
    it('_write should replace stream contents with text', () => {
        // Arrange
        const dict = new _PdfDictionary();
        const stream = new _PdfStream(new Uint8Array([]), dict);

        // Act
        stream._write('AB');

        // Assert
        expect(Array.from(stream.bytes)).toEqual([65, 66]);
        expect(dict._updated).toBeTruthy();
    });

    /* ============================
     * Line 278
     * ============================ */
    it('_writeBytes should write byte array to stream', () => {
        // Arrange
        const dict = new _PdfDictionary();
        const stream = new _PdfStream(new Uint8Array([]), dict);

        // Act
        stream._writeBytes([3, 4, 5]);

        // Assert
        expect(Array.from(stream.bytes)).toEqual([3, 4, 5]);
        expect(dict._updated).toBeTruthy();
    });

    it('makeSubStream returns correct window and readBlock throws on substream', () => {
        // Arrange
        const data = new Uint8Array([0, 1, 2, 3, 4, 5]);
        const dict = new _PdfDictionary();
        const parent = new _PdfStream(data, dict, 0, data.length);

        // Act
        const sub = parent.makeSubStream(2, 3, dict);

        // Assert
        expect(sub.start).toBe(2);
        expect(sub.length).toBe(3);
        expect(sub.dictionary).toBe(dict);

        // Act & Assert for readBlock throwing
        let threw = false;
        try {
            sub.readBlock();
        } catch (e) {
            threw = true;
            expect((e as Error).message).toContain('readBlock');
        }
        expect(threw).toBeTruthy();
    });

});

describe('_PdfContentStream', () => {

    it('getString returns hex and text and handles large buffers', () => {
        // Arrange
        const cs = new _PdfContentStream([]);
        cs.write('xyz');
        expect(cs.length).toBe(3);

        // Act (hex)
        const hex = cs.getString(true);

        // Assert
        expect(hex).toBe('78797A'); // 'x''y''z' -> 78 79 7a

        // Act (text)
        const txt = cs.getString(false);
        expect(txt).toBe('xyz');

        // Arrange large buffer
        const large = new Array(8200).fill(65);
        const largeCs = new _PdfContentStream([]);
        largeCs.write(large);
        expect(largeCs.length).toBe(8200);

        // Act
        const assembled = largeCs.getString(false);

        // Assert
        expect(assembled.length).toBe(8200);
        expect(assembled.charCodeAt(0)).toBe(65);
        expect(assembled.charCodeAt(8199)).toBe(65);
    });
    it('getString returns hex and text and handles large buffers', () => {
        // Arrange
        const cs = new _PdfContentStream([]);
        cs._bytes = null;

        // Act (hex)
        try {
            const hex = cs.getString(true);
        } catch (error) {
            expect(( error as Error).message).toContain('Invalid argument for bytesToString');
        }
    });
});

describe('misc base-stream behaviors', () => {

    it('skip advances offset by 1 when no arg and by n when provided', () => {
        // Arrange
        const s = new _PdfStream(new Uint8Array([1, 2, 3]));
        s.position = 0;

        // Act
        s.skip();

        // Assert
        expect(s.position).toBe(1);

        // Act
        s.skip(2);

        // Assert
        expect(s.position).toBe(3);
    });

    it('getByteRange clamps negative begin and end beyond stream end', () => {
        // Arrange
        const s = new _PdfStream(new Uint8Array([0, 1, 2, 3, 4]));

        // Act
        const range = s.getByteRange(-5, 100);

        // Assert
        expect(Array.from(range)).toEqual([0, 1, 2, 3, 4]);
    });

    it('constructor accepts undefined bytes for _PdfContentStream', () => {
        // Arrange & Act
        const cs = new _PdfContentStream(undefined as any);

        // Assert
        expect(cs.dictionary).toBeDefined();
        expect(cs.dictionary._updated).toBeTruthy();
        // internal _bytes may be undefined as per constructor branch
        expect((cs as any)._bytes === undefined || Array.isArray((cs as any)._bytes)).toBeTruthy();
    });

});

describe('_PdfNullStream', () => {

    /* ============================
     * Lines 303-307
     * ============================ */
    it('should initialize with empty byte array', () => {
        // Arrange & Act
        const stream = new _PdfNullStream();

        // Assert
        expect(stream.length).toBe(0);
        expect(stream.isEmpty).toBeTruthy();
        expect(stream.getByte()).toBe(-1);
    });

});