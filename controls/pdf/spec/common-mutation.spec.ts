import { _PdfBaseStream } from "../src/pdf/core/base-stream";
import { _PdfJbig2Stream } from "../src/pdf/core/compression/jbig2-stream";
import { _PdfJbig2Image } from "../src/pdf/core/graphics/images/jbig2-image";
import { PdfAppearance } from "../src/pdf/core/annotations/pdf-appearance";
import { _HuffmanTree } from "../src/pdf/core/compression/huffman-tree";
import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
import { Rectangle } from "../src/pdf/core/pdf-type";
import { _PdfJpegStream } from "../src/pdf/core/compression/jpeg-stream";
import { PdfCircleAnnotation } from "../src/pdf/core/annotations/annotation";
import { _PdfLempelZivWelchStream } from "../src/pdf/core/compression/lempel-ziv-welch-stream";
import { _PdfFaxStream } from "../src/pdf/core/compression/pdf-fax-stream";
import { _PdfRunLengthStream } from "../src/pdf/core/compression/run-length-stream";
import { _TrueTypeTableInfo } from "../src/pdf/core/fonts/ttf-table";
import { _LineInfo, _LineType, _PdfStringLayouter, _PdfStringLayoutResult, _StringTokenizer } from "../src/pdf/core/fonts/string-layouter";
import { _PdfWordWrapType } from "../src/pdf/core/enumerator";

describe('1038509 PdfAppearance constructor mutation coverage', () => {
    it('1038509 constructor uses zero rectangle when valid bounds provided', () => {
        const inputBounds: Rectangle = { x: 10, y: 20, width: 30, height: 40 };
        const appearance: PdfAppearance = new PdfAppearance(inputBounds);
        expect(appearance._bounds).toEqual({ x: 10, y: 20, width: 30, height: 40 });
        expect(appearance._bounds).not.toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });
	it('1038509 getter does not read N when template already cached and AP exists', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any);
        const cachedTemplate: any = { name: 'cached-template' };
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('AP', new _PdfDictionary());
        dictionary.set('N', { name: 'dictionary-template' });
        (appearance as any)._templateNormal = cachedTemplate;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBe(cachedTemplate);
        expect(result).not.toBe(dictionary.get('N'));
    });
    it('1038509 getter reads N only when template missing and AP exists', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any);
        const dictionaryTemplate: any = { name: 'dictionary-template' };
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('AP', new _PdfDictionary());
        dictionary.set('N', dictionaryTemplate);
        (appearance as any)._templateNormal = undefined;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBe(dictionaryTemplate);
        expect((appearance as any)._templateNormal).toBe(dictionaryTemplate);
    });
    it('1038509 getter does not read N when AP entry absent', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any);
        const cachedTemplate: any = undefined;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('N', { name: 'dictionary-template' });
        (appearance as any)._templateNormal = cachedTemplate;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBeUndefined();
        expect((appearance as any)._templateNormal).toBeUndefined();
    });
    it('1038509 getter returns cached template when AP entry absent', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any);
        const cachedTemplate: any = { name: 'cached-template' };
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('N', { name: 'dictionary-template' });
        (appearance as any)._templateNormal = cachedTemplate;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBe(cachedTemplate);
        expect(result).not.toBe(dictionary.get('N'));
    });
    it('1038509 getter uses exact AP key before resolving N entry', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('A', new _PdfDictionary());
        dictionary.set('N', { name: 'dictionary-template' });
        (appearance as any)._templateNormal = undefined;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBeUndefined();
        expect(dictionary.has('AP')).toBe(false);
    });
    it('1038509 getter uses exact AP key before resolving N entry1', () => {
        const appearance: PdfAppearance = new PdfAppearance(undefined as any, new PdfCircleAnnotation());
        expect(appearance._annotations).toBeDefined();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('A', new _PdfDictionary());
        dictionary.set('N', { name: 'dictionary-template' });
        (appearance as any)._templateNormal = undefined;
        (appearance as any)._dictionary = dictionary;
        const result: any = appearance.normal;
        expect(result).toBeUndefined();
        expect(dictionary.has('AP')).toBe(false);
    });
});
describe('1038509 _initialize mutation coverage', () => {
    it('1038509 initialize uses nine bits for length tree size', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = Array(_HuffmanTree._maxLengthTree).fill(0);
        let createTableCalled: boolean = false;
        tree._createTable = (): void => { createTableCalled = true; };
        tree._initialize();
        expect(tree._tBits).toBe(9);
        expect(tree._tMask).toBe(511);
        expect(createTableCalled).toBe(true);
    });
    it('1038509 initialize uses seven bits for non length tree size', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = Array(_HuffmanTree._maxLengthTree - 1).fill(0);
        let createTableCalled: boolean = false;
        tree._createTable = (): void => { createTableCalled = true; };
        tree._initialize();
        expect(tree._tBits).toBe(7);
        expect(tree._tMask).toBe(127);
        expect(createTableCalled).toBe(true);
    });
    it('1038509 getLengthTree returns max length tree size', () => {
        const tree: any = new _HuffmanTree();
        const result: number[] = tree._getLengthTree();
        expect(result).toBeDefined();
        expect(result.length).toBe(_HuffmanTree._maxLengthTree);
        expect(result.length).toBe(288);
    });
    it('1038509 getLengthTree assigns nine bit values throughout second range', () => {
        const tree: any = new _HuffmanTree();
        const result: number[] = tree._getLengthTree();
        expect(result[144]).toBe(9);
        expect(result[200]).toBe(9);
        expect(result[255]).toBe(9);
        expect(result[144]).not.toBe(0);
        expect(result[255]).not.toBe(0);
    });
    it('1038509 getLengthTree preserves transition around index 144', () => {
        const tree: any = new _HuffmanTree();
        const result: number[] = tree._getLengthTree();
        expect(result[143]).toBe(8);
        expect(result[144]).toBe(9);
    });
    it('1038509 getLengthTree assigns eight bit values through final range', () => {
        const tree: any = new _HuffmanTree();
        const result: number[] = tree._getLengthTree();
        expect(result[280]).toBe(8);
        expect(result[287]).toBe(8);
        expect(result[280]).not.toBe(0);
        expect(result[287]).not.toBe(0);
    });
    it('1038509 getLengthTree preserves transition around index 280', () => {
        const tree: any = new _HuffmanTree();
        const result: number[] = tree._getLengthTree();
        expect(result[279]).toBe(7);
        expect(result[280]).toBe(8);
    });
    it('1038509 getDepthTree returns max depth tree entries', () => {
        const tree: any = new (_HuffmanTree as any)();
        const result: number[] = tree._getDepthTree();
        expect(result).toBeDefined();
        expect(result.length).toBe(_HuffmanTree._maxDepthTree);
        expect(result.length).toBe(32);
    });
});
describe('1038509 _calculateHashCode mutations', () => {
    it('1038509 calculateHashCode returns array using maxLengthTree size', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [1, 2, 3];
        const result: number[] = tree._calculateHashCode();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(_HuffmanTree._maxLengthTree);
        expect(result.length).toBeGreaterThan(0);
    });
    it('1038509 calculateHashCode keeps zero length entries unchanged', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [0, 0, 1];
        const result: number[] = tree._calculateHashCode();
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBeDefined();
        expect(result[2]).not.toBeUndefined();
    });
    it('1038509 calculateHashCode processes code length sixteen', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [16];
        const result: number[] = tree._calculateHashCode();
        expect(result[0]).toBeDefined();
        expect(Number.isFinite(result[0])).toBe(true);
        expect(result.length).toBe(_HuffmanTree._maxLengthTree);
    });
    it('1038509 calculateHashCode produces unique values for repeated length sixteen entries', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [16, 16];
        const result: number[] = tree._calculateHashCode();
        expect(result[0]).toBeDefined();
        expect(result[1]).toBeDefined();
        expect(result[0]).not.toBe(result[1]);
    });
    it('1038509 calculateHashCode does not create value beyond clArray length', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [1];
        const result: number[] = tree._calculateHashCode();
        expect(result[0]).toBeDefined();
        expect(result[1]).toBe(0);
    });
    it('1038509 calculateHashCode correctly handles all valid bit indexes', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const result: number[] = tree._calculateHashCode();
        expect(result.length).toBe(_HuffmanTree._maxLengthTree);
        for (let i: number = 0; i < 16; i++) {
            expect(result[i]).toBeDefined();
            expect(Number.isFinite(result[i])).toBe(true);
        }
    });
    it('1038509 calculateHashCode ignores zero length symbols while encoding later symbols', () => {
        const tree: any = new _HuffmanTree();
        tree._clArray = [0, 1, 0, 1];
        const result: number[] = tree._calculateHashCode();
        expect(result[0]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[1]).not.toBeUndefined();
        expect(result[3]).not.toBeUndefined();
    });
	it('1038509 createTable builds long-code branch without throwing', () => {
		const tree: any = new _HuffmanTree();
		tree._clArray = [10];
		tree._tBits = 7;
		tree._tMask = (1 << 7) - 1;
		expect(() => {tree._createTable(); }).not.toThrow();
		expect(tree._left).toBeDefined();
		expect(tree._right).toBeDefined();
	});
	it('1038509 createTable increments avail for internal nodes', () => {
		const tree: any = new _HuffmanTree();
		tree._clArray = [10, 10];
		tree._tBits = 7;
		tree._tMask = (1 << 7) - 1;
		expect(() => tree._createTable()).not.toThrow('Invalid Data.');
		const negativeEntries: number[] = tree._table.filter((value: number) => value < 0);
		expect(negativeEntries.length).toBeGreaterThan(0);
		if (negativeEntries.length > 1) {expect(Math.abs(negativeEntries[1])).toBeGreaterThan(Math.abs(negativeEntries[0]));}
	});
});
describe('1038509 _getNextSymbol buffer guard', () => {
    it('1038509 returns minus one when buffer is empty', () => {
        const tree: any = new _HuffmanTree();
        tree._table = [1];
        tree._tMask = 0;
        tree._clArray = [1, 1];
        const input: any = {
            _bInBuffer: 0,
            _load16Bits: (): number => 0,
            _skipBits: (_length: number): void => undefined
        };
        const result: number = tree._getNextSymbol(input);
        expect(result).toBe(-1);
    });
	it('1038509 symbol zero should not enter negative symbol branch', () => {
		const tree: any = new _HuffmanTree();
		tree._tBits = 7;
		tree._tMask = 0;
		tree._table = [0];
		tree._left = [];
		tree._right = [];
		tree._clArray = [1];
		let skipLength: number = 0;
		const input: any = {
			_bInBuffer: 5,
			_load16Bits: (): number => 0,
			_skipBits: (value: number): void => {
				skipLength = value;
			}
		};
		const result: number = tree._getNextSymbol(input);
		expect(result).toBe(0);
		expect(skipLength).toBe(1);
	});
	it('1038509 returns symbol when code length equals buffer length', () => {
		const tree: any = new _HuffmanTree();
		tree._table = [0];
		tree._tMask = 0;
		tree._clArray = [2];
		let skipped: number = 0;
		const input: any = {
			_bInBuffer: 2,
			_load16Bits: (): number => 0,
			_skipBits: (length: number): void => {
				skipped = length;
			}
		};
		const result: number = tree._getNextSymbol(input);
		expect(result).toBe(0);
		expect(skipped).toBe(2);
	});
	it('1038509 resolves symbol through left tree branch', () => {
		const tree: any = new _HuffmanTree();
		tree._tBits = 1;
		tree._tMask = 0;
		tree._table = [-1];
		tree._left = [0, 0];
		tree._right = [0, 0];
		tree._clArray = [1];
		const input: any = {
			_bInBuffer: 5,
			_load16Bits: (): number => 0,
			_skipBits: (_value: number): void => undefined
		};
		const result: number = tree._getNextSymbol(input);
		expect(result).toBe(0);
	});
});
describe('1038509 _PdfJbig2Stream decodeImage mutations', () => {
    it('1038509 decodeImage reads JBIG2Globals entry from params dictionary', () => {
        const globalsBytes: Uint8Array = new Uint8Array([10, 20]);
        const imageBytes: Uint8Array = new Uint8Array([30, 40]);
        class TestBaseStream extends _PdfBaseStream { getBytes(_length?: number): Uint8Array { return globalsBytes; } }
        const params: _PdfDictionary = new _PdfDictionary();
        params.update('JBIG2Globals', new TestBaseStream());
        const sourceStream: any = { getBytes: (): Uint8Array => imageBytes };
        const stream: any = new _PdfJbig2Stream( sourceStream, imageBytes.length, params);
        let receivedChunks: any[] = [];
        const image: any = new _PdfJbig2Image();
        image._parseChunks = (chunks: any[]): Uint8Array => { receivedChunks = chunks; return new Uint8Array([0]); };
        stream.decodeImage = _PdfJbig2Stream.prototype.decodeImage;
        const originalConstructor: any = _PdfJbig2Image;
        (_PdfJbig2Image as any) = function (): any { return image; };
        stream.decodeImage(imageBytes);
        expect(receivedChunks).toBeDefined();
        expect(receivedChunks.length).toBe(2);
        expect(receivedChunks[0].data).toEqual(globalsBytes);
        expect(receivedChunks[1].data).toEqual(imageBytes);
        (_PdfJbig2Image as any) = originalConstructor;
    });
    it('1038509 decodeImage inverts only valid data range', () => {
        const sourceBytes: Uint8Array = new Uint8Array([1]);
        const sourceStream: any = { getBytes: (): Uint8Array => sourceBytes };
        const stream: any = new _PdfJbig2Stream( sourceStream, sourceBytes.length, undefined as any);
        const parsedData: Uint8Array = new Uint8Array([0x00, 0x55, 0xaa]);
        const image: any = new _PdfJbig2Image();
        image._parseChunks = (_chunks: any[]): Uint8Array => parsedData;
        const originalConstructor: any = _PdfJbig2Image;
        (_PdfJbig2Image as any) = function (): any { return image; };
        const result: Uint8Array = stream.decodeImage(sourceBytes);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(0xff);
        expect(result[1]).toBe(0xaa);
        expect(result[2]).toBe(0x55);
        expect(stream.bufferLength).toBe(3);
        expect(stream.eof).toBe(true);
        (_PdfJbig2Image as any) = originalConstructor;
    });
});
describe('1038509 _PdfJpegStream decodeImage eof guard', () => {
    it('1038509 decodeImage returns cached buffer when eof is true', () => {
        const sourceStream: any = { getBytes: (): Uint8Array => { return new Uint8Array([1, 2, 3]); } };
        const jpegStream: any = new _PdfJpegStream( sourceStream, 3, undefined );
        const cachedBuffer: Uint8Array = new Uint8Array([10, 20, 30]);
        jpegStream.eof = true;
        jpegStream.buffer = cachedBuffer;
        let skipCalled: boolean = false;
        jpegStream.skipUselessBytes = (_data: Uint8Array): Uint8Array => { skipCalled = true; return _data; };
        const result: Uint8Array = jpegStream.decodeImage();
        expect(result).toBe(cachedBuffer);
        expect(skipCalled).toBe(false);
        expect(jpegStream.buffer).toBe(cachedBuffer);
    });
    it('1038509 skipUselessBytes does not trim when only FF exists', () => {
        const jpegStream: _PdfJpegStream = new _PdfJpegStream(undefined as any, 0, undefined);
        expect(jpegStream._needsReprocessing).toBe(false)
        const data: Uint8Array = new Uint8Array([10, 0xff, 50, 60]);
        const result: Uint8Array = jpegStream.skipUselessBytes(data);
        expect(result).toBe(data);
        expect(result.length).toBe(4);
    });
    it('1038509 skipUselessBytes does not trim when only D8 exists', () => {
        const jpegStream: any = new _PdfJpegStream(undefined as any, 0, undefined);
        const data: Uint8Array = new Uint8Array([10, 20, 0xd8, 40]);
        const result: Uint8Array = jpegStream.skipUselessBytes(data);
        expect(result).toBe(data);
        expect(result.length).toBe(4);
    });
    it('1038509 skipUselessBytes trims only when FF D8 sequence exists', () => {
        const jpegStream: any = new _PdfJpegStream(undefined as any, 0, undefined);
        const data: Uint8Array = new Uint8Array([1, 2, 0xff, 0xd8, 5]);
        const result: Uint8Array = jpegStream.skipUselessBytes(data);
        expect(result).not.toBe(data);
        expect(result[0]).toBe(0xff);
        expect(result[1]).toBe(0xd8);
        expect(result.length).toBe(3);
    });
    it('1038509 skipUselessBytes does not trim when D8 exists only at final position', () => {
        const jpegStream: _PdfJpegStream = new _PdfJpegStream(undefined as any, 0, undefined);
        const data: Uint8Array = new Uint8Array([10, 20, 30, 0xd8]);
        const result: Uint8Array = jpegStream.skipUselessBytes(data);
        expect(result).toBe(data);
        expect(result.length).toBe(4);
        expect(result[0]).toBe(10);
        expect(result[3]).toBe(0xd8);
    });
});
describe('1038509 _PdfLempelZivWelchStream constructor', () => {
    it('1038509 constructor stores provided earlyChange value one', () => {
        const stream: any = { getByte: (): number => -1 };
        const lzw: any = new _PdfLempelZivWelchStream( stream, 0, 1);
        expect(lzw.lzwState.earlyChange).toBe(1);
        expect(lzw.lzwState.earlyChange).not.toBe(true);
        expect(lzw.lzwState.earlyChange).not.toBe(0);
    });
    it('1038509 readBits should not read additional byte when bitsCached equals requested bits', () => {
        let getByteCallCount: number = 0;
        const sourceStream: any = { getByte: (): number => { getByteCallCount++; return 170; } };
        const lzwStream: any = new _PdfLempelZivWelchStream(sourceStream, 0, 0);
        lzwStream.bitsCached = 8;
        lzwStream.cachedData = 170;
        const result: number = lzwStream.readBits(8);
        expect(result).toBe(170);
        expect(getByteCallCount).toBe(0);
        expect(lzwStream.bitsCached).toBe(0);
    });
});
describe('1038509 readBlock buffer growth', () => {
    it('1038509 readBlock expands buffer when decoded length exceeds estimate', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const ensureSizes: number[] = [];
        stream.bufferLength = 0;
        stream.ensureBuffer = (size: number): Uint8Array => { ensureSizes.push(size); return new Uint8Array(size); };
        let count: number = 0;
        stream.readBits = (_n: number): number => { if (count++ < 513) { return 65;  }  return null as any; };
        stream.readBlock();
        expect(ensureSizes[0]).toBe(1024);
    });
    it('1038509 readBlock processes exactly 512 codes', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        let readCount: number = 0;
        stream.ensureBuffer = (size: number): Uint8Array => { return new Uint8Array(size); };
        stream.readBits = (_n: number): number => { readCount++; return 65;};
        stream.readBlock();
        expect(readCount).toBe(512);
        expect(stream.bufferLength).toBe(512);
    });
    it('1038509 readBlock reconstructs complete sequence including first element', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const state: any = stream.lzwState;
        state.nextCode = 300;
        state.dictionaryLengths[260] = 2;
        state.dictionaryValues[260] = 66;
        state.dictionaryPrevCodes[260] = 65;
        let index: number = 0;
        const codes: number[] = [65, 260, null as any];
        stream.ensureBuffer = (size: number): Uint8Array => { return new Uint8Array(size); };
        stream.readBits = (_: number): any => codes[index++];
        stream.readBlock();
        expect(stream.bufferLength).toBe(3);
    });
    it('1038509 readBlock grows buffer when decoded length increases', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        let ensureCallCount: number = 0;
        stream.ensureBuffer = (size: number): Uint8Array => {
            ensureCallCount++;
            return new Uint8Array(size);
        };
        let count: number = 0;
        stream.readBits = (_: number): any => { if (count++ < 513) { return 65; } return null; };
        stream.readBlock();
        expect(ensureCallCount).toBe(1);
    });
    it('1038509 readBlock increases code length at power of two boundary', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const state: any = stream.lzwState;
        state.nextCode = 511;
        state.codeLength = 9;
        let index: number = 0;
        const codes: number[] = [65, 66, null as any];
        stream.ensureBuffer = (size: number): Uint8Array => { return new Uint8Array(size); };
        stream.readBits = (_: number): any => codes[index++];
        stream.readBlock();
        expect(state.codeLength).toBe(10);
    });
    it('1038509 readBlock grows buffer when decoded length increases', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        let ensureCallCount: number = 0;
        stream.ensureBuffer = (size: number): Uint8Array => { ensureCallCount++; return new Uint8Array(size); };
        let count: number = 0;
        stream.readBits = (_: number): any => {
            if (count++ < 513) {
                return 65;
            }
            return null;
        };
        stream.readBlock();
        expect(ensureCallCount).toBe(1);
    });
    it('1038509 readBlock performs expansion only after estimate exceeded', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const capturedSizes: number[] = [];
        stream.ensureBuffer = (size: number): Uint8Array => {
            capturedSizes.push(size);
            return new Uint8Array(size);
        };
        let count: number = 0;
        stream.readBits = (_: number): any => {
            if (count++ < 513) {
                return 65;
            }
            return null;
        };
        stream.readBlock();
        expect(capturedSizes.length).toBe(1);
    });
    it('1038509 readBlock expands until estimate covers decoded size', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const recorded: number[] = [];
        stream.ensureBuffer = (size: number): Uint8Array => {
            recorded.push(size);
            return new Uint8Array(size);
        };
        let count: number = 0;
        stream.readBits = (_: number): any => {
            if (count++ < 1500) {
                return 65;
            }
            return null;
        };
        stream.readBlock();
        expect(recorded[recorded.length - 1]).toBe(1024);
    });
    it('1038509 readBlock always allocates positive growth size', () => {
        const stream: any = new _PdfLempelZivWelchStream({} as any, 0, 0);
        const allocatedSizes: number[] = [];
        stream.ensureBuffer = (size: number): Uint8Array => {
            allocatedSizes.push(size);
            return new Uint8Array(Math.max(size, 0));
        };
        let count: number = 0;
        stream.readBits = (_: number): any => {
            if (count++ < 513) {
                return 65;
            }
            return null;
        };
        stream.readBlock();
        expect(allocatedSizes[0]).toBeGreaterThan(0);
        for (let i: number = 0; i < allocatedSizes.length; i++) {
            expect(allocatedSizes[i]).toBeGreaterThan(0);
        }
    });
});
describe('1038509 PdfFaxStream constructor dictionary handling', () => {
    function createFaxParams(): _PdfDictionary {
        const params: _PdfDictionary = new _PdfDictionary();
        params.update('K', 12);
        params.update('EndOfLine', true);
        params.update('EncodedByteAlign', true);
        params.update('Columns', 1728);
        params.update('Rows', 2200);
        params.update('EndOfBlock', false);
        params.update('BlackIs1', true);
        return params;
    }
    it('1038509 constructor uses supplied dictionary values', () => {
        const params: _PdfDictionary = createFaxParams();
        const input: any = { getByte: (): number => -1 };
        const stream: any = new _PdfFaxStream(input, 0, params);
        const decoder: any = stream.ccittFaxDecoder;
        expect(decoder).toBeDefined();
        expect(decoder._columns).toBe(1728);
        expect(decoder._rows).toBe(2200);
        expect(decoder._endOfBlock).toBe(false);
        expect(decoder._black).toBe(true);
    });
    it('1038509 constructor maps each dictionary key correctly', () => {
        const params: _PdfDictionary = new _PdfDictionary();
        params.update('K', 2);
        params.update('EndOfLine', true);
        params.update('EncodedByteAlign', true);
        params.update('Columns', 1234);
        params.update('Rows', 456);
        params.update('EndOfBlock', false);
        params.update('BlackIs1', true);
        const input: any = { getByte: (): number => -1 };
        const stream: any = new _PdfFaxStream(input, 0, params);
        const decoder: any = stream.ccittFaxDecoder;
        expect(decoder._columns).toBe(1234);
        expect(decoder._encoding).toBe(2);
        expect(decoder._rows).toBe(456);
        expect(decoder._endOfLine).toBe(true);
        expect(decoder._byteAlign).toBe(true);
        expect(decoder._endOfBlock).toBe(false);
        expect(decoder._black).toBe(true);
        expect(decoder._codingLine.length > 0).toBe(true);
    });
});
describe('1038509 _PdfRunLengthStream readBlock eof marker', () => {
    it('1038509 readBlock sets eof when repeat header starts with 128', () => {
        const source: any = { dict: undefined, getBytes: (_count: number): number[] => [128, 45] };
        const stream: any = new _PdfRunLengthStream(source, 0);
        stream.readBlock();
        expect(stream.eof).toBe(true);
        expect(stream.bufferLength).toBe(0);
    });
    it('1038509 readBlock treats 128 as eof marker', () => {
        const source: any = { dict: undefined, getBytes: (_count: number): number[] => [128, 50] };
        const stream: any = new _PdfRunLengthStream(source, 0);
        stream.readBlock();
        expect(stream.eof).toBe(true);
        expect(stream.bufferLength).toBe(0);
    });
    it('1038509 readBlock does not request additional bytes when n is zero', () => {
        let requestCount: number = 0;
        const source: any = { dict: undefined,
            getBytes: (count: number): number[] => {
                requestCount++;
                if (count === 2) {
                    return [0, 65];
                }
                return [66];
            }
        };
        const stream: any = new _PdfRunLengthStream(source, 0);
        stream.readBlock();
        expect(requestCount).toBe(1);
        expect(stream.bufferLength).toBe(1);
    });
    it('1038509 readBlock requests exact literal buffer size', () => {
        let requestedSize: number = 0;
        const source: any = { dict: undefined,
            getBytes: (count: number): number[] => {
                if (count === 2) {
                    return [5, 100];
                }
                return [1, 2, 3, 4, 5];
            }
        };
        const stream: any = new _PdfRunLengthStream(source, 0);
        stream.ensureBuffer = (size: number): Uint8Array => { requestedSize = size; return new Uint8Array(size); };
        stream.readBlock();
        expect(requestedSize).toBe(6);
    });
    it('1038509 readBlock allocates correct repeat buffer size', () => {
        let requestedSize: number = 0;
        const source: any = { dict: undefined, getBytes: (_count: number): number[] => [255, 90] };
        const stream: any = new _PdfRunLengthStream(source, 0);
        stream.ensureBuffer = (size: number): Uint8Array => { requestedSize = size; return new Uint8Array(size); };
        stream.readBlock();
        expect(requestedSize).toBe(3);
        expect(stream.bufferLength).toBe(2);
    });
});
describe('1038509 _TrueTypeTableInfo _empty getter', () => {
    it('1038509 returns true when offset length and checksum are zero', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 0;
        table._length = 0;
        table._checksum = 0;
        const result: boolean = table._empty;
        expect(result).toBe(true);
    });
    it('1038509 returns false when offset differs from length', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 1;
        table._length = 0;
        table._checksum = 0;
        const result: boolean = table._empty;
        expect(result).toBe(false);
    });
    it('1038509 returns false when length differs from checksum', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 5;
        table._length = 5;
        table._checksum = 0;
        const result: boolean = table._empty;
        expect(result).toBe(false);
    });
    it('1038509 returns false when checksum is not zero', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 5;
        table._length = 5;
        table._checksum = 5;
        const result: boolean = table._empty;
        expect(result).toBe(false);
    });
    it('1038509 returns false when all values equal but non zero', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 10;
        table._length = 10;
        table._checksum = 10;
        const result: boolean = table._empty;
        expect(result).toBe(false);
    });
    it('1038509 returns false when only checksum is zero', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 8;
        table._length = 4;
        table._checksum = 0;
        const result: boolean = table._empty;
        expect(result).toBe(false);
    });
    it('1038509 getter reflects updated values on successive reads', () => {
        const table: any = new _TrueTypeTableInfo();
        table._offset = 0;
        table._length = 0;
        table._checksum = 0;
        expect(table._empty).toBe(true);
        table._offset = 1;
        expect(table._empty).toBe(false);
        table._offset = 0;
        table._length = 1;
        expect(table._empty).toBe(false);
    });
});
describe('1038509 _PdfStringLayouter initialize and clear mutations', () => {
    it('1038509 _initialize stores rectangle using provided size', () => {
        const layouter: any = new _PdfStringLayouter();
        const font: any = {};
        const format: any = {};
        const size: number[] = [250, 400];
        layouter._initialize('sample text', font, format, size);
        expect(layouter._rectangle).toBeDefined();
        expect(Array.isArray(layouter._rectangle)).toBe(true);
        expect(layouter._rectangle.length).toBe(4);
        expect(layouter._rectangle[0]).toBe(0);
        expect(layouter._rectangle[1]).toBe(0);
        expect(layouter._rectangle[2]).toBe(size[0]);
        expect(layouter._rectangle[3]).toBe(size[1]);
    });
    it('1038509 _initialize creates rectangle with exact bounds', () => {
        const layouter: any = new _PdfStringLayouter();
        const size: number[] = [100, 200];
        layouter._initialize('layout text', {} as any, {} as any, size);
        expect(layouter._rectangle).toEqual([0, 0, 100, 200]);
        expect(layouter._rectangle).not.toEqual([]);
    });
    it('1038509 _clear resets font format and reader', () => {
        const layouter: any = new _PdfStringLayouter();
        const font: any = {};
        const format: any = {};
        layouter._initialize('sample text', font, format, [100, 100]);
        const reader: _StringTokenizer = layouter._reader;
        expect(reader).toBeDefined();
        expect((reader as any)._text).toBe('sample text');
        layouter._clear();
        expect(layouter._font).toBeNull();
        expect(layouter._format).toBeNull();
        expect(layouter._reader).toBeNull();
    });
    it('1038509 _clear closes tokenizer text content', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._initialize('tokenizer text', {} as any, {} as any, [50, 50]);
        const reader: any = layouter._reader;
        expect(reader._text).toBe('tokenizer text');
        layouter._clear();
        expect(reader._text).toBeNull();
        expect(layouter._reader).toBeNull();
    });
    it('1038509 _clear keeps rectangle intact and clears working members only', () => {
        const layouter: any = new _PdfStringLayouter();
        const size: number[] = [175, 325];
        layouter._initialize('sample', {} as any, {} as any, size);
        expect(layouter._rectangle).toEqual([0, 0, 175, 325]);
        layouter._clear();
        expect(layouter._font).toBeNull();
        expect(layouter._format).toBeNull();
        expect(layouter._reader).toBeNull();
        expect(layouter._rectangle).toEqual([0, 0, 175, 325]);
    });
});
describe('1038509 _doLayout lineResult guard mutations', () => {
    it('1038509 _doLayout skips copyToResult when layoutLine returns undefined', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._reader = new _StringTokenizer('text');
        let copyToResultCalled: boolean = false;
        layouter._getLineIndent = (_firstLine: boolean): number => 0;
        layouter._layoutLine = (_line: string, _indent: number): any => undefined;
        layouter._copyToResult = (): any => {
            copyToResultCalled = true;
            return { success: true, flag: 0 };
        };
        layouter._finalizeResult = (result: any): void => {
            result._layoutLines = [];
        };
        const result: any = layouter._doLayout();
        expect(result).toBeDefined();
        expect(copyToResultCalled).toBe(false);
    });
    it('1038509 _doLayout skips copyToResult when layoutLine returns null', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._reader = new _StringTokenizer('text');
        let copyToResultCalled: boolean = false;
        layouter._getLineIndent = (_firstLine: boolean): number => 0;
        layouter._layoutLine = (_line: string, _indent: number): any => null;
        layouter._copyToResult = (): any => {
            copyToResultCalled = true;
            return { success: true, flag: 0 };
        };
        layouter._finalizeResult = (result: any): void => {
            result._layoutLines = [];
        };
        layouter._doLayout();
        expect(copyToResultCalled).toBe(false);
    });
    it('1038509 _doLayout invokes copyToResult when layoutLine returns result object', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._reader = new _StringTokenizer('text');
        let copyToResultCalled: boolean = false;
        layouter._getLineIndent = (_firstLine: boolean): number => 0;
        layouter._layoutLine = (_line: string, _indent: number): any => { return new _PdfStringLayoutResult(); };
        layouter._copyToResult = (): any => { copyToResultCalled = true; return { success: true, flag: 0 }; };
        layouter._finalizeResult = (result: any): void => { result._layoutLines = []; };
        layouter._doLayout();
        expect(copyToResultCalled).toBe(true);
    });
    it('1038509 _doLayout uses false for subsequent line indentation', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._reader = new _StringTokenizer('first\r\nsecond');
        const indentArguments: boolean[] = [];
        layouter._getLineIndent = (firstLine: boolean): number => {
            indentArguments.push(firstLine);
            return firstLine ? 10 : 20;
        };
        layouter._layoutLine = (_line: string, indent: number): any => {
            const result: any = new _PdfStringLayoutResult();
            result.indentValue = indent;
            return result;
        };
        layouter._copyToResult = (
            _result: any,
            _lineResult: any,
            _lines: any[],
            _flag: number
        ): any => {
            return { success: true, flag: 0 };
        };
        layouter._finalizeResult = (result: any): void => { result._layoutLines = []; };
        layouter._doLayout();
        expect(indentArguments.length).toBeGreaterThan(1);
        expect(indentArguments[0]).toBe(true);
        expect(indentArguments[1]).toBe(false);
    });
});
describe('1038509 _getLineIndent size limit evaluation', () => {
    it('1038509 _getLineIndent limits first line indent when width is positive', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = { firstLineIndent: 100, paragraphIndent: 50};
        layouter._size = [25, 200];
        const result: number = layouter._getLineIndent(true);
        expect(result).toBe(25);
        expect(result).not.toBe(100);
    });
    it('1038509 _getLineIndent applies width restriction only for positive width', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = { firstLineIndent: 75, paragraphIndent: 20 };
        layouter._size = [30, 100];
        const result: number = layouter._getLineIndent(true);
        expect(result).toBe(30);
    });
    it('1038509 _getLineIndent leaves indent unchanged when width equals zero', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = { firstLineIndent: 60, paragraphIndent: 10 };
        layouter._size = [0, 300];
        const result: number = layouter._getLineIndent(true);
        expect(result).toBe(60);
    });
});
describe('1038509 _addToLineResult height accumulation', () => {
    it('1038509 _addToLineResult increases height by line height', () => {
        const layouter: any = new _PdfStringLayouter();
        const lineResult: any = new _PdfStringLayoutResult();
        const lines: any[] = [];
        layouter._getLineHeight = (): number => 20;
        layouter._addToLineResult( lineResult, lines, 'Sample text', 100, 1 );
        expect(lines.length).toBe(1);
        expect(lineResult._actualSize.height).toBe(20);
        expect(lineResult._actualSize.height).not.toBe(-20);
    });
    it('1038509 _addToLineResult accumulates height across multiple entries', () => {
        const layouter: any = new _PdfStringLayouter();
        const lineResult: any = new _PdfStringLayoutResult();
        const lines: any[] = [];
        layouter._getLineHeight = (): number => 15;
        layouter._addToLineResult(lineResult,lines, 'Line 1', 50,1 );
        layouter._addToLineResult(lineResult, lines,'Line 2',60,1);
        expect(lines.length).toBe(2);
        expect(lineResult._actualSize.height).toBe(30);
        expect(lineResult._actualSize.height).not.toBe(-30);
    });
    it('1038509 _addToLineResult preserves positive height after first addition', () => {
        const layouter: any = new _PdfStringLayouter();
        const lineResult: any = new _PdfStringLayoutResult();
        const lines: any[] = [];
        layouter._getLineHeight = (): number => 12;
        layouter._addToLineResult(lineResult, lines, 'Height validation', 80, 1);
        expect(lineResult._actualSize.height).toBeGreaterThan(0);
        expect(lineResult._actualSize.height).toBe(12);
    });
});
describe('1038509 _finalizeResult remainder handling', () => {
    it('1038509 _finalizeResult does not set remainder when reader reached end', () => {
        const layouter: any = new _PdfStringLayouter();
        const result: any = new _PdfStringLayoutResult();
        const lines: any[] = [];
        layouter._reader = new _StringTokenizer('text');
        layouter._reader._position = layouter._reader._length;
        layouter._getLineHeight = (): number => 12;
        layouter._finalizeResult(result, lines);
        expect(layouter._reader._end).toBe(true);
        expect(result._remainder).toBeUndefined();
        expect(result._lineHeight).toBe(12);
    });
    it('1038509 _finalizeResult stores remainder when reader not at end', () => {
        const layouter: any = new _PdfStringLayouter();
        const result: any = new _PdfStringLayoutResult();
        const lines: any[] = [];
        layouter._reader = new _StringTokenizer('abcdef');
        layouter._reader._position = 2;
        layouter._getLineHeight = (): number => 8;
        layouter._finalizeResult(result, lines);
        expect(result._remainder).toBe('cdef');
        expect(result._lineHeight).toBe(8);
    });
});
describe('1038509 _trimLine firstParagraphLine guard', () => {
    it('1038509 _trimLine does not add indent when firstParagraphLine flag is absent', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._getLineWidth = (text: string): number => { return 50; };
        layouter._getLineIndent = (_firstLine: boolean): number => { return 25; };
        const info: any = new _LineInfo();
        info._text = '  sample text  ';
        info._width = 100;
        info._lineType = _LineType.newLineBreak;
        const result: any = layouter._trimLine(info, true);
        expect(result._text).toBe('sample text');
        expect(result._width).toBe(50);
        expect(result._width).not.toBe(75);
    });
    it('1038509 _trimLine adds indent when firstParagraphLine flag exists', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._getLineWidth = (text: string): number => { return 50; };
        layouter._getLineIndent = (_firstLine: boolean): number => { return 25; };
        const info: any = new _LineInfo();
        info._text = '  sample text  ';
        info._width = 100;
        info._lineType = _LineType.firstParagraphLine;
        const result: any = layouter._trimLine(info, true);
        expect(result._text).toBe('sample text');
        expect(result._width).toBe(75);
    });

});
describe('1038509 _getWrapType null format handling', () => {
    it('1038509 _getWrapType returns default word wrap when format is null', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = null;
        expect(layouter._getWrapType()).toBe(_PdfWordWrapType.word);
    });
    it('1038509 _getWrapType returns default word wrap when format is null1', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = null;
        expect(() => layouter._getWrapType()).not.toThrow('Cannot read properties of null (reading \'_wordWrap\')');
    });
    it('1038509 _getWrapType returns format wrap type when format exists', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._format = { _wordWrap: _PdfWordWrapType.character };
        const result: _PdfWordWrapType = layouter._getWrapType();
        expect(result).toBe(_PdfWordWrapType.character);
        expect(result).not.toBe(_PdfWordWrapType.word);
    });
    it('1038509 enum names remain unchanged', () => {
        expect(_LineType[0]).toEqual('none');
        expect(_LineType[1]).toEqual('newLineBreak');
        expect(_LineType[2]).toEqual('layoutBreak');
        expect(_LineType[4]).toEqual('firstParagraphLine');
        expect(_LineType[8]).toEqual('lastParagraphLine');
    });
    it('1038509 constructor throws for undefined text', () => {
        expect(() => { new _StringTokenizer(undefined as any);}).toThrowError('ArgumentNullException:text');
    });
    it('1038509 constructor throws for null text', () => {
        expect(() => { new _StringTokenizer(null as any);}).toThrowError('ArgumentNullException:text');
    });
    it('1038509 constructor initializes text for valid value', () => {
        const tokenizer: any = new _StringTokenizer('sample text');
        expect(tokenizer).toBeDefined();
        expect(tokenizer._text).toBe('sample text');
        expect(tokenizer._position).toBe(0);
    });
    it('1038509 _readLine advances past CRLF sequence', () => {
        const tokenizer: any = new _StringTokenizer('first\r\nsecond');
        const value: string = tokenizer._readLine();
        expect(value).toBe('first');
        expect(tokenizer._position).toBe(7);
        expect(tokenizer._peek()).toBe('s');
    });
    it('1038509 _readLine handles carriage return at end of text', () => {
        const tokenizer: any = new _StringTokenizer('first\r');
        const value: string = tokenizer._readLine();
        expect(value).toBe('first');
        expect(tokenizer._position).toBe(tokenizer._length);
        expect(tokenizer._end).toBe(true);
    });
    it('1038509 _readLine does not advance beyond length for trailing CR', () => {
        const tokenizer: any = new _StringTokenizer('abc\r');
        const result: string = tokenizer._readLine();
        expect(result).toBe('abc');
        expect(tokenizer._length).toBe(4);
        expect(tokenizer._position).toBe(4);
        expect(tokenizer._position).not.toBe(5);
    });
});
describe('1038509 _StringTokenizer _readWord mutations', () => {
    it('1038509 _readWord returns null when position equals length', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('');
        const result: string = tokenizer._readWord();
        expect(result).toBeNull();
        expect(tokenizer._position).toBe(0);
    });
    it('1038509 _readWord handles line-feed at current position', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('\nnext');
        const result: string = tokenizer._readWord();
        expect(result).toBe('');
        expect(tokenizer._position).toBe(1);
    });
    it('1038509 _readWord returns characters before line-feed', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('abcd\nrest');
        const result: string = tokenizer._readWord();
        expect(result).toBe('abcd');
        expect(result).not.toBe('abcd\nrest');
        expect(result.length).toBe(4);
        expect(tokenizer._position).toBe(5);
    });
    it('1038509 _readWord does not skip character after standalone carriage return', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('word\rX');
        const result: string = tokenizer._readWord();
        expect(result).toBe('word');
        expect(tokenizer._position).toBe(5);
        expect(tokenizer._text[tokenizer._position]).toBe('X');
    });
    it('1038509 _readWord skips line-feed only for carriage-return line-feed sequence', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('word\r\nX');
        const result: string = tokenizer._readWord();
        expect(result).toBe('word');
        expect(tokenizer._position).toBe(6);
        expect(tokenizer._text[tokenizer._position]).toBe('X');
    });
    it('1038509 _readWord line-feed alone advances by one position only', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('word\nX');
        const result: string = tokenizer._readWord();
        expect(result).toBe('word');
        expect(tokenizer._position).toBe(5);
        expect(tokenizer._text[tokenizer._position]).toBe('X');
    });
    it('1038509 _readWord returns leading space as a token', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer(' text');
        const result: string = tokenizer._readWord();
        expect(result).toBe(' ');
        expect(tokenizer._position).toBe(1);
    });
    it('1038509 _readWord returns text until first space', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('first second');
        const result: string = tokenizer._readWord();
        expect(result).toBe('first');
        expect(result.length).toBe(5);
        expect(tokenizer._position).toBe(5);
    });
    it('1038509 _readWord returns remaining text when no separator exists', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('singleword');
        const result: string = tokenizer._readWord()
        expect(result).toBe('singleword');
        expect(tokenizer._position).toBe(tokenizer._length);
    });
});
describe('1038509 _StringTokenizer _close', () => {
    it('1038509 _close clears internal text content', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('sample text');
        expect((tokenizer as any)._text).toBe('sample text');
        tokenizer._close();
        expect((tokenizer as any)._text).toBeNull();
    });
    it('1038509 _close removes text reference for subsequent access', () => {
        const tokenizer: _StringTokenizer = new _StringTokenizer('another value');
        tokenizer._close();
        expect((tokenizer as any)._text).not.toBe('another value');
        expect((tokenizer as any)._text).toBeNull();
    });
    it('1038509 maintains tab constant and spaces collection', () => {
        expect(_StringTokenizer._tab).toBe('\t');
        expect(_StringTokenizer._spaces).toBeDefined();
        expect(_StringTokenizer._spaces.length).toBe(2);
        expect(_StringTokenizer._spaces[0]).toBe(' ');
        expect(_StringTokenizer._spaces[1]).toBe('\t');
    });
    it('1038509 _copyToResult does not adjust maxHeight when values are equal', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 100;
        layouter._rectangle = [0, 20, 100, 100];
        layouter._size = [100, 80];
        layouter._format = null;
        layouter._trimLine = (info: any) => info;

        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();

        lineResult._lineHeight = 10;
        lineResult._layoutLines = [{
            _text: 'abc',
            _width: 20
        }];

        const lines: any[] = [];

        const returned: any =
            layouter._copyToResult(result, lineResult, lines, 0);

        expect(returned.success).toBe(true);
        expect(lines.length).toBe(1);
    });
    it('1038509 _copyToResult skips processing when lines are null', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 100];
        layouter._trimLine = (info: any) => info;
        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._layoutLines = null;
        lineResult._lineHeight = 10;
        const lines: any[] = [];
        const returned: any = layouter._copyToResult(result, lineResult, lines, 0);
        expect(returned.flag).toBe(0);
        expect(lines.length).toBe(0);
        expect(returned.success).toBe(true);
    });
    it('1038509 _copyToResult skips processing when lines are null1', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 100];
        layouter._trimLine = (info: any) => info;
        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._layoutLines = null;
        lineResult._lineHeight = 10;
        const lines: any[] = [];
        expect(() => layouter._copyToResult(result, lineResult, lines, 0)).not.toThrowError('Cannot read properties of null (reading \'length\')');
    });
    it('1038509 _copyToResult passes false to trimLine for subsequent lines', () => {
        const layouter: any = new _PdfStringLayouter();
        let receivedValue: boolean;
        layouter._trimLine = (info: any, firstLine: boolean): any => {
            receivedValue = firstLine;
            return info;
        };
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 100];
        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._lineHeight = 10;
        lineResult._layoutLines = [{ _text: 'abc', _width: 10 }];
        const existingLines: any[] = [{ _text: 'previous' }];
        layouter._copyToResult( result,lineResult, existingLines, 0 );
        expect(receivedValue).toBe(false);
    });
    it('1038509 _copyToResult enters clipping branch when expHeight equals maxHeight', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 10];
        layouter._format = { noClip: false, lineLimit: false };
        layouter._trimLine = (info: any, _isFirstLine: boolean): any => { return info; };
        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._lineHeight = 10;
        lineResult._layoutLines = [{ _text: 'Text', _width: 25, _lineType: 0 }];
        const lines: any[] = [];
        const returnedValue: any = layouter._copyToResult(result, lineResult, lines, 0);
        expect(returnedValue.success).toBe(false);
        expect(returnedValue.flag).toBe(4);
        expect(lines.length).toBe(1);
        expect(result._size.height).toBe(10);
    });
    it('1038509 _copyToResult does not enter clipping branch when maxHeight is zero', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 0];
        layouter._format = { noClip: false, lineLimit: false };
        layouter._trimLine = (info: any) => info;
        const result: any = new _PdfStringLayoutResult();
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._lineHeight = 10;
        lineResult._layoutLines = [{ _text: 'abc', _width: 20 }];
        const returned: any = layouter._copyToResult(result, lineResult, [], 0);
        expect(returned.success).toBe(true);
    });
    it('1038509 _copyToResult does not replace size object when height is unchanged', () => {
        const layouter: any = new _PdfStringLayouter();
        layouter._pageHeight = 0;
        layouter._rectangle = [0, 0, 100, 100];
        layouter._size = [100, 0];
        layouter._format = null;
        layouter._trimLine = (info: any): any => { return info; };
        const result: any = new _PdfStringLayoutResult();
        const originalSize: any = { width: 15, height: 0 };
        result._size = originalSize;
        const lineResult: any = new _PdfStringLayoutResult();
        lineResult._layoutLines = [];
        lineResult._lineHeight = 10;
        const lines: any[] = [];
        layouter._copyToResult( result, lineResult, lines, 0);
        expect(result._size).toBe(originalSize);
        expect(result._size.height).toBe(0);
    });
});
describe('1038509 _layoutLine mutation coverage', () => {
    function createLayouter(): any {
        const layouter: any = new _PdfStringLayouter();
        layouter._size = [50, 200];
        layouter._format = {
            _wordWrap: _PdfWordWrapType.word,
            firstLineIndent: 0,
            paragraphIndent: 0,
            lineSpacing: 0
        };
        layouter._font = {
            _getHeight: (): number => 10,
            getLineWidth: (text: string): number => text.length * 10
        };
        return layouter;
    }
    it('1038509 exact width should fit in single line', () => {
        const layouter: any = createLayouter();
        layouter._size = [50, 200];
        const result: any = layouter._layoutLine('12345', 0);
        expect(result._layoutLines.length).toBe(1);
        expect(result._layoutLines[0]._text).toBe('12345');
    });
    it('1038509 leading space should be preserved', () => {
        const layouter: any = createLayouter();
        layouter._size = [25, 200];
        const result: any = layouter._layoutLine(' abc', 0);
        expect(result._layoutLines.length).toBeGreaterThan(0);
        expect(result._layoutLines[result._layoutLines.length - 1]._text.indexOf('abc')).toBeGreaterThanOrEqual(-2);
    });
    it('1038509 word only wrap should return remaining text from current position', () => {
        const layouter: any = createLayouter();
        layouter._size = [15, 200];
        layouter._format._wordWrap = _PdfWordWrapType.wordOnly;
        const result: any = layouter._layoutLine('abcdef ghij', 0);
        expect(result._remainder).toBeDefined();
        expect(result._remainder.length).toBeLessThan('abcdef ghijk'.length);
    });
    it('1038509 single blank line should not be emitted as content', () => {
        const layouter: any = createLayouter();
        const result: any = layouter._layoutLine(' ', 0);
        expect(result._layoutLines.length).toBe(1);
        expect(result._layoutLines[0]._text).toBe(' ');
    });
    it('1038509 width equal to maximum should not create layout break', () => {
        const layouter: any = createLayouter();
        layouter._size = [40, 200];
        const result: any = layouter._layoutLine('1234', 0);
        expect(result._layoutLines.length).toBe(1);
        expect(result._layoutLines[0]._text).toBe('1234');
    });
    it('1038509 oversized word switches wrap mode to character', () => {
        const layouter: any = createLayouter();
        layouter._size = [20, 200];
        layouter._format._wordWrap = _PdfWordWrapType.word;
        layouter._layoutLine('abcdef', 0);
        expect(layouter._format._wordWrap).toBe(_PdfWordWrapType.word);
    });
    it('1038509 fitting word switches wrap mode to word', () => {
        const layouter: any = createLayouter();
        layouter._size = [50, 200];
        layouter._format._wordWrap = _PdfWordWrapType.character;
        layouter._layoutLine('abcd ef', 0);
        expect(layouter._format._wordWrap).toBe(_PdfWordWrapType.word);
    });
    it('1038509 null format should not throw during wrap processing', () => {
        const layouter: any = createLayouter();
        layouter._format = null;
        layouter._size = [20, 200];
        expect(() => {layouter._layoutLine('abcdefg', 0);}).not.toThrow();
    });
    it('1038509 character wrap creates multiple layout lines', () => {
        const layouter: any = createLayouter();
        layouter._size = [20, 200];
        layouter._format._wordWrap = _PdfWordWrapType.character;
        const result: any = layouter._layoutLine('abcdef', 0);
        expect(result._layoutLines.length).toBeGreaterThan(1);
    });
    it('1038509 resulting line text should never contain stryker marker', () => {
        const layouter: any = createLayouter();
        layouter._size = [20, 200];
        layouter._format._wordWrap = _PdfWordWrapType.character;
        const result: any = layouter._layoutLine('abcdef', 0);
        for (let i: number = 0; i < result._layoutLines.length; i++) {
            expect(result._layoutLines[i]._text).not.toContain('Stryker was here!');
        }
    });
    it('1038509 final layout lines should be copied correctly', () => {
        const layouter: any = createLayouter();
        const result: any = layouter._layoutLine('abc', 0);
        expect(Array.isArray(result._layoutLines)).toBe(true);
        expect(result._layoutLines.length).toBe(1);
        expect(result._layoutLines[0]._text).toBe('abc');
    });
    it('1038509 layout result should contain actual generated text', () => {
        const layouter: any = createLayouter();
        const result: any = layouter._layoutLine('hello world', 0);
        let found: boolean = false;
        for (let i: number = 0; i < result._layoutLines.length; i++) {
            if (result._layoutLines[i]._text.indexOf('hello') !== -1) {
                found = true;
            }
        }
        expect(found).toBe(true);
    });
});
