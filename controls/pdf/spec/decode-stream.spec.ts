import { _PdfDecodeStream } from "../src/pdf/core/decode-stream";
import { _PdfDecryptStream } from "../src/pdf/core/decrypt-stream";
describe('1041665 Decode Stream Mutation', () => {
    it('1041651 - should not increase min buffer length when value equals default size', () => {
        const stream: any = new _PdfDecodeStream(512);
        expect(stream.minBufferLength).toBe(512);
    });
    it('1041651 - should expand buffer when requested length exceeds current buffer', () => {
        const stream: any = new _PdfDecodeStream(0);
        stream.buffer = new Uint8Array([1, 2]);
        stream.bufferLength = 2;
        stream.offset = 0;
        stream.eof = true;
        const result: Uint8Array = stream.getBytes(10);
        expect(result.length).toBe(2);
        expect(stream.buffer.byteLength).toBeGreaterThanOrEqual(10);
    });
    it('1041651 - should return requested bytes when end equals buffer length', () => {
        const stream: any = new _PdfDecodeStream(0);
        stream.buffer = new Uint8Array([1, 2, 3]);
        stream.bufferLength = 3;
        stream.offset = 0;
        stream.eof = true;
        const result: Uint8Array = stream.getBytes(3);
        expect(result.length).toBe(3);
    });
    it('1041651 - should read all blocks when length is undefined', () => {
        const stream: any = new _PdfDecodeStream(0);
        let readCount: number = 0;
        stream.readBlock = function (): void {
            readCount++;
            this.eof = true;
        };
        stream.makeSubStream(0, undefined, undefined);
        expect(readCount).toBe(1);
    });
    it('1041651 - should read when buffer length equals end position', () => {
        const stream: any = new _PdfDecodeStream(0);
        stream.bufferLength = 5;
        stream.eof = false;
        let readCount: number = 0;
        stream.readBlock = function (): void {
            readCount++;
            this.eof = true;
        };
        stream.makeSubStream(0, 5, undefined);
        expect(readCount).toBe(1);
    });
    it('1041651 - should throw expected error from getByteRange', () => {
        const stream: any = new _PdfDecodeStream(0);
        expect(() => {
            stream.getByteRange(10, 20);
        }).toThrowError(
            'Invalid call from decode stream. begin: 10, end: 20'
        );
    });
    it('1041651 - should throw expected error from readBlock', () => {
        const stream: any = new _PdfDecodeStream(0);
        expect(() => {
            stream.readBlock();
        }).toThrowError(
            'Invalid call from decode stream'
        );
    });
    it('1041651 - should throw expected error from moveStart', () => {
        const stream: any = new _PdfDecodeStream(0);
        expect(() => {
            stream.moveStart();
        }).toThrowError(
            'Invalid call from decode stream'
        );
    });
});
describe('1041683 Decrypt Stream Mutation', () => {
    it('1041683 - should initialize decrypt stream properties', () => {
        const stream: any = {
            dictionary: { key: 'value' }
        };
        const cipher: any = {};
        const decryptStream: any =
            new _PdfDecryptStream(
                stream,
                0,
                cipher
            );
        expect(decryptStream.stream).toBe(stream);
        expect(decryptStream.dictionary).toBe(
            stream.dictionary
        );
        expect(decryptStream._cipher).toBe(cipher);
        expect(decryptStream._initialized).toBe(false);
    });
    it('1041683 - should pass false to decryptBlock when additional data exists', () => {
        let finalBlockArgument: boolean = false;
        const cipher: any = {
            _decryptBlock(
                chunk: Uint8Array,
                isLastBlock: boolean
            ): Uint8Array {
                finalBlockArgument = isLastBlock;
                return chunk;
            }
        };
        let callCount: number = 0;
        const stream: any = {
            dictionary: {},
            getBytes(_size: number): Uint8Array {
                callCount++;
                if (callCount === 1) {
                    return new Uint8Array([1, 2, 3]);
                }
                return new Uint8Array([4]);
            }
        };
        const decryptStream: any =
            new _PdfDecryptStream(
                stream,
                0,
                cipher
            );
        decryptStream.readBlock();
        expect(finalBlockArgument).toBe(false);
    });
    it('1041683 - should pass true to decryptBlock for final block', () => {
        let finalBlockArgument: boolean = false;
        const cipher: any = {
            _decryptBlock(
                chunk: Uint8Array,
                isLastBlock: boolean
            ): Uint8Array {
                finalBlockArgument = isLastBlock;
                return chunk;
            }
        };
        let callCount: number = 0;
        const stream: any = {
            dictionary: {},
            getBytes(_size: number): Uint8Array {
                callCount++;
                if (callCount === 1) {
                    return new Uint8Array([1, 2, 3]);
                }
                return new Uint8Array(0);
            }
        };
        const decryptStream: any =
            new _PdfDecryptStream(
                stream,
                0,
                cipher
            );
        decryptStream.readBlock();
        expect(finalBlockArgument).toBe(true);
    });
    it('1041683 - should set eof when first chunk is empty', () => {
        const cipher: any = {
            _decryptBlock(
                chunk: Uint8Array,
                _isLastBlock: boolean
            ): Uint8Array {
                return chunk;
            }
        };
        const stream: any = {
            dictionary: {},
            getBytes(_size: number): Uint8Array {
                return new Uint8Array(0);
            }
        };
        const decryptStream: any =
            new _PdfDecryptStream(
                stream,
                0,
                cipher
            );
        decryptStream.readBlock();
        expect(decryptStream.eof).toBe(true);
    });
});