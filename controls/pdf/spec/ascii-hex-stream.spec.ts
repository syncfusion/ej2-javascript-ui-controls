import { _PdfAsciiHexStream } from '../src/pdf/core/compression/ascii-hex-stream';
function makeByteStream(bytes: number[]): { getBytes: (n: number) => Uint8Array } {
    let index: number = 0;
    return {
        getBytes: (n: number): Uint8Array => {
            if (index >= bytes.length) {
                return new Uint8Array(0);
            }
            const remaining: number = bytes.length - index;
            const count: number = n < remaining ? n : remaining;
            const result: Uint8Array = new Uint8Array(count);
            for (let i: number = 0; i < count; i++) {
                result[i] = bytes[index + i];
            }
            index += count;
            return result;
        }
    };
}
describe('1041663 - _PdfAsciiHexStream mutation coverage', () => {
    it('1041663 should scale maybeLength by 0.5 when it is truthy', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream([]);
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream, 250);
        expect(asciiHex._rawMinBufferLength).toBe(125);
    });

    it('1041663 should not scale maybeLength when it is 0', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream([]);
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream, 0);
        expect(asciiHex._rawMinBufferLength).toBe(0);
        expect(asciiHex.minBufferLength).toBe(512);
    });

    it('1041663 should not scale maybeLength when it is undefined', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream([]);
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        expect(Number.isNaN(asciiHex._rawMinBufferLength)).toBe(false);
        expect(asciiHex._rawMinBufferLength).toBe(0);
    });

    it('1041663 should set eof when the stream has no bytes', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream([]);
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.eof).toBe(true);
        expect(asciiHex.bufferLength).toBe(0);
    });

    it('1041663 should decode pairs of hex digits into single bytes', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31, 0x34, 0x32]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.buffer[1]).toBe(0x42);
        expect(asciiHex.bufferLength).toBe(2);
        expect(asciiHex.eof).toBe(false);
    });

    it('1041663 should decode uppercase A-F as 10-15', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x41, 0x42, 0x43, 0x44]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0xAB);
        expect(asciiHex.buffer[1]).toBe(0xCD);
        expect(asciiHex.bufferLength).toBe(2);
    });

    it('1041663 should decode lowercase a-f as 10-15', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x61, 0x62, 0x63, 0x64]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0xAB);
        expect(asciiHex.buffer[1]).toBe(0xCD);
        expect(asciiHex.bufferLength).toBe(2);
    });

    it('1041663 should treat 0x3e (>) as eof terminator', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31, 0x3e, 0x34, 0x32]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.eof).toBe(true);
        expect(asciiHex.buffer[0]).toBe(0x41);
    });

    it('1041663 should skip non-hex characters', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x20, 0x34, 0x31, 0x0a, 0x34, 0x32]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.buffer[1]).toBe(0x42);
        expect(asciiHex.bufferLength).toBe(2);
    });

    it('1041663 should accept digit 9 (0x39)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x39, 0x39, 0x39, 0x38]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x99);
        expect(asciiHex.buffer[1]).toBe(0x98);
        expect(asciiHex.bufferLength).toBe(2);
    });

    it('1041663 should preserve a single leading nibble across readBlock calls', () => {
        const stream1: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream1);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.bufferLength).toBe(0);
        expect(asciiHex.firstDigit).toBe(4);
        expect(asciiHex.eof).toBe(false);
    });

    it('1041663 should combine a pending nibble with new data in the next readBlock', () => {
        const stream1: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream1);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        const stream2: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x31]
        );
        asciiHex.stream = stream2;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.bufferLength).toBe(1);
        expect(asciiHex.firstDigit).toBe(-1);
    });

    it('1041663 should reset firstDigit to -1 after a complete pair', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.firstDigit).toBe(-1);
    });

    it('1041663 should write a trailing nibble when eof follows an odd number of hex digits', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31, 0x3e]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.bufferLength).toBe(1);
        expect(asciiHex.eof).toBe(true);
    });

    it('1041663 should not write a trailing nibble when eof is not set', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31, 0x34]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.bufferLength).toBe(1);
        expect(asciiHex.eof).toBe(false);
        expect(asciiHex.firstDigit).toBe(4);
    });

    it('1041663 should write a trailing nibble of 0 when the pending digit is 0 and eof is set', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x30, 0x3e]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x00);
        expect(asciiHex.bufferLength).toBe(1);
        expect(asciiHex.eof).toBe(true);
    });

    it('1041663 should decode uppercase A (0x41) correctly', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x41, 0x46]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0xAF);
    });

    it('1041663 should reset firstDigit to -1 after writing a trailing nibble at eof', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x30, 0x3e, 0x34, 0x31]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.firstDigit).toBe(-1);
        expect(asciiHex.buffer[0]).toBe(0x00);
    });
    it('1041663 should reset firstDigit to -1 after writing a trailing nibble1', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x66, 0x66]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0xFF);
    });

    it('1041663 should leave firstDigit at -1 after processing complete pairs (loop bound)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x34, 0x31, 0x34, 0x32]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.firstDigit).toBe(-1);
        expect(asciiHex.buffer[0]).toBe(0x41);
        expect(asciiHex.buffer[1]).toBe(0x42);
        expect(asciiHex.bufferLength).toBe(2);
    });

    it('1041663 should not decode uppercase 0x47 as a hex digit (upper bound check)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x41, 0x47]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.bufferLength).toBe(0);
        expect(asciiHex.firstDigit).toBe(10);
    });

    it('1041663 should not decode uppercase 0x5A as a hex digit (upper bound check)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x41, 0x5A]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.bufferLength).toBe(0);
        expect(asciiHex.firstDigit).toBe(10);
    });

    it('1041663 should not decode lowercase 0x67 as a hex digit (lower bound check)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x61, 0x67]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.bufferLength).toBe(0);
        expect(asciiHex.firstDigit).toBe(10);
    });

    it('1041663 should not decode lowercase 0x7A as a hex digit (lower bound check)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x61, 0x7A]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.bufferLength).toBe(0);
        expect(asciiHex.firstDigit).toBe(10);
    });

    it('1041663 should combine 0x30 then 0x31 as 0x01 even when more digits follow (firstDigit strict <)', () => {
        const stream: { getBytes: (n: number) => Uint8Array } = makeByteStream(
            [0x30, 0x31, 0x32]
        );
        const asciiHex: _PdfAsciiHexStream = new _PdfAsciiHexStream(stream);
        asciiHex.bufferLength = 0;
        asciiHex.readBlock();
        expect(asciiHex.buffer[0]).toBe(0x01);
        expect(asciiHex.bufferLength).toBe(1);
        expect(asciiHex.firstDigit).toBe(2);
    });
});

