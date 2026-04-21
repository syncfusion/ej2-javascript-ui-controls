import { _PdfStream } from './../../base-stream';
import { _ImageFormat } from './../../enumerator';
/**
 * Base class for image decoders that read bytes from an underlying stream,
 * parse headers/metadata, and expose decoded image data and properties for PDF embedding.
 * Concrete implementations must provide header parsing and dictionary creation.
 *
 * @private
 */
export abstract class _ImageDecoder {
    /**
     * Source byte stream of the encoded image.
     *
     * @private
     */
    _stream: Uint8Array;
    /**
     * Detected or assigned image format.
     *
     * @private
     */
    _format: _ImageFormat = _ImageFormat.unknown;
    /**
     * Image height in pixels.
     *
     * @private
     */
    _height: number = 0;
    /**
     * Image width in pixels.
     *
     * @private
     */
    _width: number = 0;
    /**
     * Number of bits per color component.
     *
     * @private
     */
    _bitsPerComponent: number = 8;
    /**
     * Decoded raw image data buffer.
     *
     * @private
     */
    _imageData: Uint8Array;
    /**
     * PDF stream holding the image XObject.
     *
     * @private
     */
    _imageStream: _PdfStream;
    /**
     * Optional soft mask stream.
     *
     * @private
     */
    _maskStream: _PdfStream;
    /**
     * Current read position within the source stream.
     *
     * @private
     */
    _position: number = 0;
    /**
     * Number of color components in the decoded image.
     *
     * @private
     */
    _noOfComponents: number = -1;
    /**
     * Resets the stream read position to the beginning.
     *
     * @private
     * @returns {void}
     */
    _reset(): void {
        this._position = 0;
    }
    /**
     * Reads a single byte from the underlying stream at the specified index without moving the cursor.
     *
     * @private
     * @param {number} index The zero based position in the stream to read from.
     * @returns {number} The byte value at the given index.
     */
    _getBuffer(index: number): number {
        return this._stream[<number>index];
    }
    /**
     * Reads a sequence of bytes either from the internal stream into a `Uint8Array` buffer,
     * or from a provided `stream` array into a numeric buffer, honoring the specified offset and count.
     *
     * @private
     * @param {Uint8Array | number[]} buffer The destination buffer to receive the read bytes.
     * @param {number} offset The starting offset in `buffer` at which to begin writing.
     * @param {number} count The number of bytes to read.
     * @param {number[]} [stream] Optional source byte array; when provided, bytes are copied from this array instead of the internal stream.
     * @returns {void | {outputBuffer: number[], offset: number, length: number}} Returns nothing when reading from the internal stream; when `stream` is provided, returns an object containing the written buffer, updated offset, and number of bytes written.
     */
    _read(buffer: Uint8Array, offset: number, count: number): void
    _read(buffer: number[], offset: number, count: number, stream: number[]): {outputBuffer: number[], offset: number, length: number}
    _read(buffer: Uint8Array | number[],
          offset: number,
          count: number,
          stream?: number[]): void | {outputBuffer: number[], offset: number, length: number} {
        if (stream && Array.isArray(stream)) {
            let result: number = 0;
            if (count <= stream.length && stream.length - offset >= count) {
                for (let i: number = 0; i < count; i++) {
                    buffer[<number>i] = stream[<number>offset];
                    offset++;
                    result++;
                }
            }
            return {'outputBuffer': buffer as number[], 'offset': offset, 'length': result};
        } else {
            for (let index: number = offset; index < count; index++) {
                const position: number = this._position;
                buffer[<number>index] = this._getBuffer(position);
                this._position++;
            }
        }
    }
    /**
     * Reads a string of the specified length from the current stream position using 8 bit char codes.
     *
     * @private
     * @param {number} length The number of characters to read.
     * @returns {string} The decoded string.
     */
    _readString(length: number): string {
        let result: string = '';
        for (let i: number = 0; i < length; i++) {
            result += String.fromCharCode(this._readByte());
        }
        return result;
    }
    /**
     * Advances the current read position by the specified number of bytes.
     *
     * @private
     * @param {number} length The number of bytes to skip forward.
     * @returns {void}
     */
    _seek(length: number): void {
        this._position += length;
    }
    /**
     * Reads a single byte from the current stream position and advances the cursor.
     *
     * @private
     * @returns {number} The next byte value.
     * @throws {Error} Throws if attempting to read beyond the end of the stream.
     */
    _readByte(): number {
        if (this._position < this._stream.byteLength) {
            const value: number = this._getBuffer(this._position);
            this._position += 1;
            return value;
        } else {
            throw new Error('Error decoding JPEG image. Invalid offset.');
        }
    }
    /**
     * Converts a number to an unsigned 16 bit value.
     *
     * @private
     * @param {number} value The input value to convert.
     * @returns {number} The unsigned 16 bit representation.
     */
    _toUnsigned16(value: number): number {
        value = value & 0xFFFF;
        return value < 0 ? (value + 0x10000) : value;
    }
    /**
     * Reads a 32 bit unsigned integer from the stream at the specified offset.
     *
     * @private
     * @param {number} offset The byte offset at which to read the 32 bit value.
     * @returns {number} The 32 bit unsigned integer.
     */
    _readUnsigned32(offset: number): number {
        const i1: number = this._getBuffer(offset + 3);
        const i2: number = this._getBuffer(offset + 2);
        const i3: number = this._getBuffer(offset + 1);
        const i4: number = this._getBuffer(offset);
        return i1 | (i2 << 8) | (i3 << 16) | (i4 << 24);
    }
    /**
     * Gets the image stream/dictionary that represents the decoded image data and metadata.
     *
     * @private
     * @returns {_PdfStream} The image dictionary/stream for embedding into the PDF.
     */
    abstract _getImageDictionary(): _PdfStream;
    /**
     * Initializes the decoder state from the source stream (e.g., header parsing, buffers).
     *
     * @private
     * @returns {void}
     */
    abstract _initialize(): void;
    /**
     * Parses and validates the image header, populating format, dimensions, and component info.
     *
     * @private
     * @returns {void}
     */
    abstract _readHeader(): void;
}
