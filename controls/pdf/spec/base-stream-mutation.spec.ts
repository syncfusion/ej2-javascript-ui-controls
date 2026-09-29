import { _PdfBaseStream, _PdfContentStream, _PdfStream } from '../src/pdf/core/base-stream';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';
describe('1041643 - base stream mutation tests', () => {
    it('1041643 - should clamp getBytes length to available bytes and advance position', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([10, 20, 30, 40]));
        const bytes: Uint8Array = stream.getBytes(10);
        expect(bytes).toEqual(new Uint8Array([10, 20, 30, 40]));
        expect(stream.position).toBe(4);
    });
    it('1041643 - should clamp getBytes end when requested length reaches stream end exactly', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([10, 20, 30, 40]));
        const bytes: Uint8Array = stream.getBytes(4);
        expect(bytes).toEqual(new Uint8Array([10, 20, 30, 40]));
        expect(stream.position).toBe(4);
    });
    it('1041643 - should return remaining bytes when getBytes is called with zero length', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([10, 20, 30, 40]));
        const bytes: Uint8Array = stream.getBytes(0);
        expect(bytes).toEqual(new Uint8Array([10, 20, 30, 40]));
        expect(stream.position).toBe(0);
    });
    it('1041643 - should use getBytes result when getString is called without bytes', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([65, 66, 67]));
        const result: string = stream.getString();
        expect(result).toBe('ABC');
    });
    it('1041643 - should use getBytes when getString is called with undefined bytes', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([88, 89, 90]));
        const result: string = stream.getString(false, undefined);
        expect(result).toBe('XYZ');
    });
    it('1041643 - should convert provided bytes to hex string when getString is called with isHex true', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([0, 15, 255]));
        const result: string = stream.getString(true, new Uint8Array([0, 15, 255]));
        expect(result).toBe('000FFF');
    });
    it('1041643 - should return -1 from getUnsignedInteger16 when first byte is -1', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(0));
        stream.getByte = jasmine.createSpy().and.returnValues(-1, 10);
        const result: number = stream.getUnsignedInteger16();
        expect(result).toBe(-1);
    });
    it('1041643 - should return -1 from getUnsignedInteger16 when second byte is -1', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(0));
        stream.getByte = jasmine.createSpy().and.returnValues(10, -1);
        const result: number = stream.getUnsignedInteger16();
        expect(result).toBe(-1);
    });
    it('1041643 - should combine two bytes into an unsigned 16-bit integer', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(0));
        stream.getByte = jasmine.createSpy().and.returnValues(1, 2);
        const result: number = stream.getUnsignedInteger16();
        expect(result).toBe(258);
    });
    it('1041643 - should combine four bytes into a signed 32-bit integer', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(0));
        stream.getByte = jasmine.createSpy().and.returnValues(1, 2, 3, 4);
        const result: number = stream.getInt32();
        expect(result).toBe(16909060);
    });
    it('1041643 - should preserve the sign contribution of each byte in getInt32', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array(0));
        stream.getByte = jasmine.createSpy().and.returnValues(1, 2, 3, 4);
        const result: number = stream.getInt32();
        expect(result).not.toBe((1 << 24) + (2 << 16) + (3 << 8) - 4);
        expect(result).not.toBe((1 << 24) - (2 << 16) + (3 << 8) + 4);
    });
    it('1041643 - should return the full range when getByteRange begin is negative and end exceeds stream length', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([5, 6, 7, 8, 9]));
        const range: Uint8Array = stream.getByteRange(-2, 99);
        expect(range).toEqual(new Uint8Array([5, 6, 7, 8, 9]));
    });
    it('1041643 - should clamp getByteRange begin when it is zero or below', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([5, 6, 7, 8, 9]));
        const range: Uint8Array = stream.getByteRange(0, 3);
        expect(range).toEqual(new Uint8Array([5, 6, 7]));
    });
    it('1041643 - should clamp getByteRange end to stream end when it exceeds available bytes', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([5, 6, 7, 8, 9]));
        const range: Uint8Array = stream.getByteRange(2, 99);
        expect(range).toEqual(new Uint8Array([7, 8, 9]));
    });
    it('1041643 - should create sub stream with null dictionary when no dictionary is passed', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3, 4, 5]));
        const subStream: _PdfStream = stream.makeSubStream(0, 2, undefined);
        expect(subStream.dictionary).toBeNull();
        expect(subStream.start).toBe(0);
        expect(subStream.length).toBe(2);
    });
    it('1041643 - should preserve default dictionary when makeSubStream is called without dictionary', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3, 4, 5]));
        const subStream: _PdfStream = stream.makeSubStream(1, 3);
        expect(subStream).toBeTruthy();
        expect(subStream.start).toBe(1);
        expect(subStream.length).toBe(3);
        expect(subStream.getBytes()).toEqual(new Uint8Array([2, 3, 4]));
    });
    it('1041643 - should create a sub stream with the provided dictionary', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3, 4, 5]));
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const subStream: _PdfStream = stream.makeSubStream(2, 2, dictionary);
        expect(subStream.dictionary).toBe(dictionary);
        expect(subStream.start).toBe(2);
        expect(subStream.length).toBe(2);
    });
    it('1041643 - should clear Filter entry and mark dictionary updated in _clearStream', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]));
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary._map = { Filter: 'FlateDecode' } as any;
        dictionary._updated = false;
        stream.dictionary = dictionary;
        stream._clearStream();
        expect((stream.dictionary._map as any).Filter).toBeUndefined();
        expect(stream._isCompress).toBeTruthy();
        expect(stream.dictionary._updated).toBeTruthy();
    });
    it('1041643 - should write all provided characters in _write', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]));
        stream.dictionary = new _PdfDictionary();
        stream._write('ABCDE');
        expect(Array.from(stream.bytes)).toEqual([65, 66, 67, 68, 69]);
        expect(stream.end).toBe(5);
    });
    it('1041643 - should write all characters and set end correctly in _write', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]));
        stream.dictionary = new _PdfDictionary();
        stream._write('ABCD');
        expect(Array.from(stream.bytes)).toEqual([65, 66, 67, 68]);
        expect(stream.end).toBe(4);
        expect(stream.dictionary._updated).toBeTruthy();
    });
    it('1041643 - should write every character without reading past text length in _write', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([1, 2, 3]));
        stream.dictionary = new _PdfDictionary();
        stream._write('AB');
        expect(Array.from(stream.bytes)).toEqual([65, 66]);
        expect(stream.end).toBe(2);
    });
    it('1041643 - should read sub stream bytes correctly with getByteRange and getBytes from _PdfStream', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([10, 20, 30, 40, 50]));
        let range: Uint8Array = stream.getByteRange(1, 4);
        let bytes: Uint8Array = stream.getBytes(2);
        expect(range).toEqual(new Uint8Array([20, 30, 40]));
        expect(bytes).toEqual(new Uint8Array([10, 20]));
    });
    it('1041643 - should return empty string for empty byte array in getString', () => {
        const stream: _PdfStream = new _PdfStream(new Uint8Array([]));
        const result: string = stream.getString();
        expect(result).toBe('');
    });
    it('1041643 - should cover undefined bytes default branch in _PdfContentStream getString', () => {
        const contentStream: any = new _PdfContentStream([]);
        contentStream.write('AB');
        const result: string = contentStream.getString(undefined);
        expect(result).toBe('AB');
    });
    it('1041643 - should cover exact max length branch in _PdfContentStream getString', () => {
        const contentStream: any = new _PdfContentStream([]);
        const largeText: string = new Array(8192 + 1).join('B');
        contentStream.write(largeText);
        const result: string = contentStream.getString(false);
        expect(result.length).toBe(8192);
        expect(result).toBe(largeText);
    });
    it('1041643 - should keep short content stream output branch intact', () => {
        const contentStream: _PdfStream = new _PdfStream(new Uint8Array([70, 79, 79]));
        const result: string = contentStream.getString();
        expect(result).toBe('FOO');
    });
    it('1041643 - should create an empty content stream when bytes are null or undefined', () => {
        const ContentStream: any = _PdfContentStream;
        const nullContentStream: any = new ContentStream(null);
        const undefinedContentStream: any = new ContentStream(undefined);
        expect(nullContentStream.length).toBe(0);
        expect(undefinedContentStream.length).toBe(0);
    });
    it('1041643 - should return hex and chunked string content from _PdfContentStream', () => {
        const contentStream: any = new _PdfContentStream([]);
        const largeText: string = new Array(9000 + 1).join('A');
        contentStream.write(largeText);
        const hexResult: string = contentStream.getString(true);
        const stringResult: string = contentStream.getString(false);
        expect(hexResult.length).toBe(18000);
        expect(stringResult.length).toBe(9000);
        expect(stringResult).toBe(largeText);
    });
    it('1041643 - should preserve null stream behavior', () => {
        const nullStream: _PdfStream = new _PdfStream(new Uint8Array(0));
        const bytes: Uint8Array = nullStream.getBytes();
        expect(bytes.length).toBe(0);
        expect(nullStream.isEmpty).toBeTruthy();
    });
});
