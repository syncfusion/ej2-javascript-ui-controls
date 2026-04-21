import { _PdfBaseStream } from '../base-stream';
import { _PdfDecodeStream } from '../decode-stream';
/**
 * Provides a JPEG stream wrapper that reads JPEG bytes from the underlying base stream.
 *
 * @private
 */
export class _PdfJpegStream extends _PdfDecodeStream {
    stream: _PdfBaseStream;
    maybeLength: number;
    params: any; // eslint-disable-line
    /**
     * Byte offset at which the JPEG stream data begins.
     *
     * @private
     */
    _jpegStreamStart: number = 0;
    /**
     * Indicates whether the stream requires reprocessing due to parameters.
     *
     * @private
     */
    _needsReprocessing: boolean = false;
    buffer: any; // eslint-disable-line
    bytes: Uint8Array;
    drawWidth: number;
    drawHeight: number;
    constructor(stream: _PdfBaseStream, maybeLength: number, params: any) { // eslint-disable-line
        super(maybeLength);
        this.stream = stream;
        this.params = params;
        this.maybeLength = maybeLength;
    }
    readBlock(): void {
        this.decodeImage();
    }
    decodeImage(bytes?: Uint8Array): Uint8ClampedArray {
        if (this.eof) {
            return this.buffer;
        }
        bytes = this.skipUselessBytes(bytes || this.stream.getBytes(this.maybeLength));
        this.buffer = bytes;
        this.bufferLength = bytes.length;
        this.eof = true;
        return this.buffer;
    }
    skipUselessBytes(data: Uint8Array): Uint8Array {
        for (let i: number = 0, ii: number = data.length - 1; i < ii; i++) {
            if (data[<number>i] === 0xff && data[i + 1] === 0xd8) {
                if (i > 0) {
                    data = data.subarray(i);
                }
                break;
            }
        }
        return data;
    }
}
