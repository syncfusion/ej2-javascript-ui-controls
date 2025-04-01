import { _PdfBaseStream, _PdfStream } from './base-stream';
import { _PdfDictionary } from './pdf-primitives';
export class _PdfDecodeStream extends _PdfBaseStream {
    constructor(maybeMinBufferLength: number) {
        super();
        this._rawMinBufferLength = maybeMinBufferLength || 0;
        this.offset = 0;
        this.bufferLength = 0;
        this.eof = false;
        this.buffer = new Uint8Array(0);
        this.minBufferLength = 512;
        if (maybeMinBufferLength) {
            while (this.minBufferLength < maybeMinBufferLength) {
                this.minBufferLength *= 2;
            }
        }
    }
    _rawMinBufferLength: number;
    bufferLength: number;
    eof: boolean;
    buffer: Uint8Array;
    minBufferLength: number;
    stream: _PdfBaseStream;
    get isEmpty(): boolean {
        while (!this.eof && this.bufferLength === 0) {
            this.readBlock();
        }
        return this.bufferLength === 0;
    }
    ensureBuffer(requested: number) : Uint8Array {
        const buffer: Uint8Array = this.buffer;
        if (requested <= buffer.byteLength) {
            return buffer;
        }
        let size: number = this.minBufferLength;
        while (size < requested) {
            size *= 2;
        }
        const buffer2: Uint8Array = new Uint8Array(size);
        buffer2.set(buffer);
        this.buffer = buffer2;
        return this.buffer;
    }
    getByte(): number {
        const position: number = this.offset;
        while (this.bufferLength <= position) {
            if (this.eof) {
                return -1;
            }
            this.readBlock();
        }
        return this.buffer[this.offset++];
    }
    getBytes(length: number): Uint8Array {
        const position: number = this.offset;
        let end: number;
        if (length) {
            this.ensureBuffer(position + length);
            end = position + length;
            while (!this.eof && this.bufferLength < end) {
                this.readBlock();
            }
            const bufEnd: number = this.bufferLength;
            if (end > bufEnd) {
                end = bufEnd;
            }
        } else {
            while (!this.eof) {
                this.readBlock();
            }
            end = this.bufferLength;
        }
        this.offset = end;
        return this.buffer.subarray(position, end);
    }
    reset(): void {
        this.offset = 0;
    }
    makeSubStream(start: number, length: number, dictionary: _PdfDictionary): _PdfBaseStream {
        if (length === undefined) {
            while (!this.eof) {
                this.readBlock();
            }
        } else {
            const end: number = start + length;
            while (this.bufferLength <= end && !this.eof) {
                this.readBlock();
            }
        }
        return new _PdfStream(this.buffer, dictionary, start, length);
    }
    getBaseStreams(): _PdfBaseStream[] {
        return this.stream ? this.stream.getBaseStreams() : null;
    }
    moveStart(): void {
        throw new Error('Invalid call from decode stream');
    }
    getByteRange(begin: number, end: number): Uint8Array {
        throw new Error('Invalid call from decode stream. begin: ' + begin + ', end: ' + end);
    }
    readBlock(): void {
        throw new Error('Invalid call from decode stream');
    }
}
