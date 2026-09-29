import { _PdfStream } from "../src/pdf/core/base-stream";
import { _PdfFlateStream } from "../src/pdf/core/flate-stream";
import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
describe('1041589 _PdfFlateStream mutation coverage', () => {
    function createFlateStream(bytes: number[]): _PdfFlateStream {
        const data: Uint8Array = new Uint8Array(bytes);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const source: _PdfStream = new _PdfStream(
            data,
            dictionary,
            0,
            data.length
        );
        return new _PdfFlateStream(source, data.length);
    }
    it('1041589 getBits does not read when buffered size equals requested size', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c
        ]);
        flateStream.codeBuffer = 5;
        flateStream.codeSize = 3;
        const result: number = flateStream.getBits(3);
        expect(result).toBe(5);
        expect(flateStream.codeBuffer).toBe(0);
        expect(flateStream.codeSize).toBe(0);
    });
    it('1041589 getCode does not read when buffered size equals maximum code length', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c
        ]);
        const codes: Int32Array = new Int32Array([
            0x10000,
            0x10000
        ]);
        const table: (number | Int32Array)[] = [
            codes,
            1
        ];
        flateStream.codeBuffer = 0;
        flateStream.codeSize = 1;
        const result: number = flateStream.getCode(table);
        expect(result).toBe(0);
        expect(flateStream.codeBuffer).toBe(0);
        expect(flateStream.codeSize).toBe(0);
    });
    it('1041589 readBlock accepts a valid empty stored block', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x01,
            0x00, 0x00,
            0xff, 0xff
        ]);
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(0);
        expect(flateStream.codeBuffer).toBe(0);
        expect(flateStream.codeSize).toBe(0);
        expect(flateStream.eof).toBeTruthy();
    });
    it('1041589 readBlock rejects stored block with nonzero length and zero check', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x01,
            0x01, 0x00,
            0x00, 0x00,
            0x41
        ]);
        expect((): void => {
            flateStream.readBlock();
        }).toThrow();
        expect(flateStream.bufferLength).toBe(0);
    });
    it('1041589 readBlock rejects zero length stored block with nonzero check', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x01,
            0x00, 0x00,
            0x01, 0x00
        ]);
        expect((): void => {
            flateStream.readBlock();
        }).toThrow();
        expect(flateStream.bufferLength).toBe(0);
    });
    it('1041589 readBlock does not set eof when complete nonfinal stored block is read', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x00,
            0x01, 0x00,
            0xfe, 0xff,
            0x41
        ]);
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(1);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(flateStream.eof).toBeFalsy();
    });
    it('1041589 readBlock sets eof when stored block data is shorter than declared length', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x00,
            0x02, 0x00,
            0xfd, 0xff,
            0x41
        ]);
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(2);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(flateStream.eof).toBeTruthy();
    });
    it('1041589 readBlock grows buffer when literal reaches exact buffer limit', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x73, 0x04, 0x00
        ]);
        const originalEnsureBuffer:
            (requested: number) => Uint8Array =
            flateStream.ensureBuffer.bind(flateStream);
        let ensureBufferCalls: number = 0;
        flateStream.buffer = new Uint8Array(1);
        flateStream.bufferLength = 0;
        flateStream.ensureBuffer = (requested: number): Uint8Array => {
            ensureBufferCalls++;
            return originalEnsureBuffer(requested);
        };
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(1);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(ensureBufferCalls).toBe(1);
        flateStream.ensureBuffer = originalEnsureBuffer;
    });
    it('1041589 readBlock does not grow buffer when literal has available capacity', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x73, 0x04, 0x00
        ]);
        const originalEnsureBuffer:
            (requested: number) => Uint8Array =
            flateStream.ensureBuffer.bind(flateStream);
        let ensureBufferCalls: number = 0;
        flateStream.buffer = new Uint8Array(10);
        flateStream.bufferLength = 0;
        flateStream.ensureBuffer = (requested: number): Uint8Array => {
            ensureBufferCalls++;
            return originalEnsureBuffer(requested);
        };
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(1);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(ensureBufferCalls).toBe(0);
        flateStream.ensureBuffer = originalEnsureBuffer;
    });
    it('1041589 readBlock does not request zero extra bits for length or distance', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x73, 0x74, 0x04, 0x01, 0x00
        ]);
        const originalGetBits: (bits: number) => number =
            flateStream.getBits.bind(flateStream);
        const requestedBitLengths: number[] = [];
        flateStream.getBits = (bits: number): number => {
            requestedBitLengths.push(bits);
            return originalGetBits(bits);
        };
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(6);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(flateStream.buffer[1]).toBe(0x41);
        expect(flateStream.buffer[2]).toBe(0x41);
        expect(flateStream.buffer[3]).toBe(0x41);
        expect(flateStream.buffer[4]).toBe(0x41);
        expect(flateStream.buffer[5]).toBe(0x41);
        expect(requestedBitLengths.length).toBe(1);
        expect(requestedBitLengths[0]).toBe(3);
        expect(requestedBitLengths).not.toContain(0);
        flateStream.getBits = originalGetBits;
    });
    it('1041589 readBlock grows buffer when repeated length reaches exact limit', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x73, 0x74, 0x04, 0x01, 0x00
        ]);
        const originalEnsureBuffer: (requested: number) => Uint8Array =
            flateStream.ensureBuffer.bind(flateStream);
        let ensureBufferCalls: number = 0;
        flateStream.buffer = new Uint8Array(6);
        flateStream.bufferLength = 0;
        flateStream.ensureBuffer = (requested: number): Uint8Array => {
            ensureBufferCalls++;
            return originalEnsureBuffer(requested);
        };
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(6);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(flateStream.buffer[1]).toBe(0x41);
        expect(flateStream.buffer[2]).toBe(0x41);
        expect(flateStream.buffer[3]).toBe(0x41);
        expect(flateStream.buffer[4]).toBe(0x41);
        expect(flateStream.buffer[5]).toBe(0x41);
        expect(ensureBufferCalls).toBe(1);
        flateStream.ensureBuffer = originalEnsureBuffer;
    });
    it('1041589 readBlock does not grow buffer when repeated length has available capacity', () => {
        const flateStream: _PdfFlateStream = createFlateStream([
            0x78, 0x9c,
            0x73, 0x74, 0x04, 0x01, 0x00
        ]);
        const originalEnsureBuffer: (requested: number) => Uint8Array =
            flateStream.ensureBuffer.bind(flateStream);
        let ensureBufferCalls: number = 0;
        flateStream.buffer = new Uint8Array(20);
        flateStream.bufferLength = 0;
        flateStream.ensureBuffer = (requested: number): Uint8Array => {
            ensureBufferCalls++;
            return originalEnsureBuffer(requested);
        };
        flateStream.readBlock();
        expect(flateStream.bufferLength).toBe(6);
        expect(flateStream.buffer[0]).toBe(0x41);
        expect(flateStream.buffer[1]).toBe(0x41);
        expect(flateStream.buffer[2]).toBe(0x41);
        expect(flateStream.buffer[3]).toBe(0x41);
        expect(flateStream.buffer[4]).toBe(0x41);
        expect(flateStream.buffer[5]).toBe(0x41);
        expect(ensureBufferCalls).toBe(0);
        flateStream.ensureBuffer = originalEnsureBuffer;
    });
});
describe('_PdfFlateStream mutation coverage', () => {
    it('getCode preserves the bit state when the available bits are fewer than the decoded code length', () => {
        // Arrange
        const compressedData: Uint8Array = new Uint8Array([
            0x78, 0x9c
        ]);
        const sourceStream: _PdfStream = new _PdfStream(compressedData);
        const flateStream: _PdfFlateStream = new _PdfFlateStream(
            sourceStream,
            compressedData.length
        );
        const expectedCodeValue: number = 42;
        const decodedCodeLength: number = 2;
        const tableMaximumLength: number = 1;
        const initialCodeSize: number = 1;
        const initialCodeBuffer: number = 1;
        const codes: Int32Array = new Int32Array(2);
        codes[initialCodeBuffer] =
            (decodedCodeLength << 16) | expectedCodeValue;
        const huffmanTable: (number | Int32Array)[] = [
            codes,
            tableMaximumLength
        ];
        flateStream.codeSize = initialCodeSize;
        flateStream.codeBuffer = initialCodeBuffer;
        // Act
        const actualCodeValue: number =
            flateStream.getCode(huffmanTable);
        // Assert
        expect(actualCodeValue).toBe(expectedCodeValue);
        expect(decodedCodeLength).toBeGreaterThan(flateStream.codeSize);
        expect(flateStream.codeSize).toBe(initialCodeSize);
        expect(flateStream.codeBuffer).toBe(initialCodeBuffer);
    });
    it('generateHuffmanTable retains the maximum length when another code has the same length', () => {
        // Arrange
        const codeLengths: Uint8Array = new Uint8Array([
            1, 1
        ]);
        const expectedMaximumLength: number = 1;
        const expectedTableSize: number = 2;
        // Act
        const huffmanTable: (number | Int32Array)[] =
            _PdfFlateStream.prototype.generateHuffmanTable.call(
                {} as _PdfFlateStream,
                codeLengths
            );
        const generatedCodes: Int32Array =
            huffmanTable[0] as Int32Array;
        const actualMaximumLength: number =
            huffmanTable[1] as number;
        // Assert
        expect(codeLengths[0]).toBe(expectedMaximumLength);
        expect(codeLengths[1]).toBe(expectedMaximumLength);
        expect(actualMaximumLength).toBe(expectedMaximumLength);
        expect(generatedCodes.length).toBe(expectedTableSize);
        expect(generatedCodes[0]).toBe((1 << 16) | 0);
        expect(generatedCodes[1]).toBe((1 << 16) | 1);
    });
    it('generateHuffmanTable uses the greatest code length rather than the last smaller length', () => {
        // Arrange
        const codeLengths: Uint8Array = new Uint8Array([
            3, 1, 3, 2
        ]);
        const expectedMaximumLength: number = 3;
        const expectedTableSize: number = 8;
        // Act
        const huffmanTable: (number | Int32Array)[] =
            _PdfFlateStream.prototype.generateHuffmanTable.call(
                {} as _PdfFlateStream,
                codeLengths
            );
        const generatedCodes: Int32Array =
            huffmanTable[0] as Int32Array;
        const actualMaximumLength: number =
            huffmanTable[1] as number;
        // Assert
        expect(codeLengths[0]).toBe(expectedMaximumLength);
        expect(codeLengths[1]).toBeLessThan(expectedMaximumLength);
        expect(codeLengths[2]).toBe(expectedMaximumLength);
        expect(codeLengths[3]).toBeLessThan(expectedMaximumLength);
        expect(actualMaximumLength).toBe(expectedMaximumLength);
        expect(generatedCodes.length).toBe(expectedTableSize);
    });
    it('generateHuffmanTable produces an empty lookup table when every code length is zero', () => {
        // Arrange
        const codeLengths: Uint8Array = new Uint8Array([
            0, 0, 0
        ]);
        const expectedMaximumLength: number = 0;
        const expectedTableSize: number = 1;
        // Act
        const huffmanTable: (number | Int32Array)[] =
            _PdfFlateStream.prototype.generateHuffmanTable.call(
                {} as _PdfFlateStream,
                codeLengths
            );
        const generatedCodes: Int32Array =
            huffmanTable[0] as Int32Array;
        const actualMaximumLength: number =
            huffmanTable[1] as number;
        // Assert
        expect(codeLengths[0]).toBe(expectedMaximumLength);
        expect(codeLengths[1]).toBe(expectedMaximumLength);
        expect(codeLengths[2]).toBe(expectedMaximumLength);
        expect(actualMaximumLength).toBe(expectedMaximumLength);
        expect(generatedCodes.length).toBe(expectedTableSize);
        expect(generatedCodes[0]).toBe(0);
    });
});
describe('_PdfFlateStream constructor error messages', () => {
    it('returns the compression method values in the unknown compression error message', () => {
        // Arrange
        const compressionMethod: number = 0x79;
        const compressionFlag: number = 0x00;
        const compressedData: Uint8Array = new Uint8Array([
            compressionMethod,
            compressionFlag
        ]);
        const stream: _PdfStream = new _PdfStream(compressedData);
        const expectedMessage: string =
            'Unknown compression method in flate stream: 121, 0';
        // Act
        const createFlateStream: () => _PdfFlateStream = () => {
            return new _PdfFlateStream(stream, compressedData.length);
        };
        // Assert
        expect(createFlateStream).toThrow(
            jasmine.objectContaining({
                name: 'FormatError',
                message: expectedMessage
            })
        );
    });
    it('returns the header values in the bad flag check error message', () => {
        // Arrange
        const compressionMethod: number = 0x78;
        const compressionFlag: number = 0x00;
        const compressedData: Uint8Array = new Uint8Array([
            compressionMethod,
            compressionFlag
        ]);
        const stream: _PdfStream = new _PdfStream(compressedData);
        const expectedMessage: string =
            'Bad flag check in flate stream: 120, 0';
        // Act
        const createFlateStream: () => _PdfFlateStream = () => {
            return new _PdfFlateStream(stream, compressedData.length);
        };
        // Assert
        expect(createFlateStream).toThrow(
            jasmine.objectContaining({
                name: 'FormatError',
                message: expectedMessage
            })
        );
    });
    it('returns the header values in the bad flag bit error message', () => {
        // Arrange
        const compressionMethod: number = 0x78;
        const compressionFlag: number = 0x20;
        const compressedData: Uint8Array = new Uint8Array([
            compressionMethod,
            compressionFlag
        ]);
        const stream: _PdfStream = new _PdfStream(compressedData);
        const expectedMessage: string =
            'Bad flag bit set in flate stream: 120, 32';
        // Act
        const createFlateStream: () => _PdfFlateStream = () => {
            return new _PdfFlateStream(stream, compressedData.length);
        };
        // Assert
        expect(createFlateStream).toThrow(
            jasmine.objectContaining({
                name: 'FormatError',
                message: expectedMessage
            })
        );
    });
    it('generateHuffmanTable handles repeated maximum code lengths', () => {
        // Arrange
        const compressedData: Uint8Array = new Uint8Array([0x78, 0x9c]);
        const sourceStream: _PdfStream = new _PdfStream(compressedData);
        const flateStream: _PdfFlateStream = new _PdfFlateStream(
            sourceStream,
            compressedData.length
        );
        const codeLengths: Uint8Array = new Uint8Array([3, 1, 3, 2]);
        // Act
        const huffmanTable: (number | Int32Array)[] =
            flateStream.generateHuffmanTable(codeLengths);
        const generatedCodes: Int32Array =
            huffmanTable[0] as Int32Array;
        const maximumLength: number =
            huffmanTable[1] as number;
        // Assert
        expect(codeLengths[0]).toBe(3);
        expect(codeLengths[2]).toBe(codeLengths[0]);
        expect(maximumLength).toBe(3);
        expect(generatedCodes.length).toBe(8);
    });
});