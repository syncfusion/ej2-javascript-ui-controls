import { _PdfAscii85Stream } from '../src/pdf/core/compression/ascii-85-stream';
function makeByteStream(bytes: number[]): { getByte: () => number } {
    let index: number = 0;
    return {
        getByte: (): number => {
            return index < bytes.length ? bytes[index++] : -1;
        }
    };
}

describe('1041659', () => {
    it('1041659 should compute a fractional scaled length that is strictly less than the input', () => {
        const stream: { getByte: () => number } = makeByteStream([]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream, 250);
        expect(ascii85._rawMinBufferLength).toBe(200);
        expect(ascii85._rawMinBufferLength).toBeLessThan(250);
    });

    it('1041659 should forward 0 (not a non-zero scaled value) when maybeLength is exactly 0', () => {
        const stream: { getByte: () => number } = makeByteStream([]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream, 0);
        expect(ascii85._rawMinBufferLength).toBe(0);
        expect(ascii85.minBufferLength).toBe(512);
    });

    it('1041659 should forward undefined (not NaN) when maybeLength is omitted', () => {
        const stream: { getByte: () => number } = makeByteStream([]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        expect(Number.isNaN(ascii85._rawMinBufferLength)).toBe(false);
        expect(ascii85._rawMinBufferLength).toBe(0);
    });

    it('1041659 should produce identical state for maybeLength=0 and maybeLength=undefined', () => {
        const streamZero: { getByte: () => number } = makeByteStream([]);
        const ascii85Zero: _PdfAscii85Stream = new _PdfAscii85Stream(streamZero, 0);

        const streamUndef: { getByte: () => number } = makeByteStream([]);
        const ascii85Undef: _PdfAscii85Stream = new _PdfAscii85Stream(streamUndef);

        expect(ascii85Zero._rawMinBufferLength).toBe(ascii85Undef._rawMinBufferLength);
        expect(ascii85Zero._rawMinBufferLength).toBe(0);
        expect(ascii85Zero.minBufferLength).toBe(ascii85Undef.minBufferLength);
        expect(ascii85Zero.minBufferLength).toBe(512);
        expect(Number.isNaN(ascii85Undef._rawMinBufferLength)).toBe(false);
    });

    it('1041659 should skip a single leading space before decoding a five-character group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x20, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.buffer[0]).toBe(0);
        expect(ascii85.buffer[1]).toBe(0);
        expect(ascii85.buffer[2]).toBe(0);
        expect(ascii85.buffer[3]).toBe(0);
    });

    it('1041659 should skip a single leading tab before decoding a five-character group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x09, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.buffer[0]).toBe(0);
    });

    it('1041659 should set eof and not append any bytes when the first byte is tilde (~)', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x7e, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should set eof and not append any bytes when the first byte is EOF (-1)', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [-1, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should not append any decoded bytes when the first byte is tilde (~) and more data follows', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x7e, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should set eof=true when the first byte is tilde (~), even if the input has more data', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x7e, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
    });

    it('1041659 should set eof and not append bytes when input ends before a full 5-character group is available', () => {
        const stream: { getByte: () => number } = makeByteStream([0x21]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should append four zero bytes when the first byte is z (0x7a)', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.eof).toBe(false);
    });

    it('1041659 should overwrite pre-existing non-zero buffer bytes with zeros from a z-shorthand', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.buffer = new Uint8Array(8);
        ascii85.buffer[0] = 0xAA;
        ascii85.buffer[1] = 0xBB;
        ascii85.buffer[2] = 0xCC;
        ascii85.buffer[3] = 0xDD;
        ascii85.bufferLength = 0;
        ascii85.readBlock();
        expect(ascii85.buffer[0]).toBe(0);
        expect(ascii85.buffer[1]).toBe(0);
        expect(ascii85.buffer[2]).toBe(0);
        expect(ascii85.buffer[3]).toBe(0);
    });

    it('1041659 should not write past the four bytes of a z-shorthand into the output buffer', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.buffer = new Uint8Array(8);
        ascii85.buffer[4] = 0xEE;
        ascii85.bufferLength = 0;
        ascii85.readBlock();
        expect(ascii85.buffer[4]).toBe(0xEE);
    });

    it('1041659 should write forward, not backward, from the current bufferLength for a z-shorthand', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.buffer = new Uint8Array(8);
        ascii85.buffer[1] = 0xFF;
        ascii85.bufferLength = 0;
        ascii85.readBlock();
        expect(ascii85.buffer[1]).toBe(0);
    });

    it('1041659 should report a bufferLength of 4 after decoding a single z-shorthand from an empty buffer', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
    });

    it('1041659 should request bufferLength + 4 bytes from ensureBuffer for a z-shorthand', () => {
        const stream: { getByte: () => number } = makeByteStream([0x7a]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer.byteLength).toBe(512);
    });

    it('1041659 should consume exactly five bytes from the stream for a full 5-character group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x21, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
    });

    it('1041659 should skip whitespace between the five characters of a group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x21, 0x20, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer[0]).toBe(0);
        expect(ascii85.buffer[1]).toBe(0);
        expect(ascii85.buffer[2]).toBe(0);
        expect(ascii85.buffer[3]).toBe(0);
    });

    it('1041659 should treat tilde (~) as a terminator inside a 5-character group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x21, 0x7e, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
    });

    it('1041659 should not set eof after decoding a complete 5-character group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75, 0x75, 0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(false);
    });

    it('1041659 should pad a partial group with 0x75 (the ASCII85 padding sentinel)', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer[1]).toBe(0x78);
    });

    it('1041659 should pad a partial group with 0x75, not with 0x21 - 84', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer[1]).toBe(0x78);
    });

    it('1041659 should write the four decoded bytes at forward positions, not backward', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75, 0x75, 0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.buffer = new Uint8Array(8);
        ascii85.buffer[1] = 0xAA;
        ascii85.buffer[2] = 0xBB;
        ascii85.buffer[3] = 0xCC;
        ascii85.bufferLength = 0;
        ascii85.readBlock();
        expect(ascii85.buffer[1]).toBe(0x78);
        expect(ascii85.buffer[2]).toBe(0x0E);
        expect(ascii85.buffer[3]).toBe(0xC4);
    });

    it('1041659 should right-shift t by 8 bits for each byte extraction', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75, 0x75, 0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer[1]).toBe(0x78);
    });

    it('1041659 should extract the highest byte of t at the first buffer position', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75, 0x75, 0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.buffer[0]).toBe(0x08);
    });

    it('1041659 should not write past input[4] when padding a partial group', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x75, 0x75]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.input = new Uint8Array(6);
        ascii85.readBlock();
        expect(ascii85.input[5]).not.toBe(0x75);
    });

    it('1041659 should reserve only the bytes actually needed in the output buffer', () => {
        const stream: { getByte: () => number } = makeByteStream([0x21]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.buffer = new Uint8Array(512);
        ascii85.bufferLength = 511;
        ascii85.readBlock();
        expect(ascii85.buffer.byteLength).toBe(512);
    });

    it('1041659 should skip multiple consecutive leading whitespace characters', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x20, 0x09, 0x20, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.buffer[0]).toBe(0);
        expect(ascii85.buffer[1]).toBe(0);
        expect(ascii85.buffer[2]).toBe(0);
        expect(ascii85.buffer[3]).toBe(0);
    });

    it('1041659 should skip a leading carriage return before decoding', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x0d, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.buffer[0]).toBe(0);
    });

    it('1041659 should skip a leading line feed before decoding', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x0a, 0x21, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.bufferLength).toBe(4);
        expect(ascii85.buffer[0]).toBe(0);
    });

    it('1041659 should treat tilde as a terminator after leading whitespace', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x20, 0x7e, 0x21, 0x21, 0x21, 0x21]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should treat EOF as a terminator after leading whitespace', () => {
        const stream: { getByte: () => number } = makeByteStream(
            [0x20]
        );
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });

    it('1041659 should set eof immediately when the stream is empty', () => {
        const stream: { getByte: () => number } = makeByteStream([]);
        const ascii85: _PdfAscii85Stream = new _PdfAscii85Stream(stream);
        ascii85.readBlock();
        expect(ascii85.eof).toBe(true);
        expect(ascii85.bufferLength).toBe(0);
    });
});

