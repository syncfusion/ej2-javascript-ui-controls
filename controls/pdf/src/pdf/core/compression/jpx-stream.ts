import { _PdfDecodeStream } from '../decode-stream';
export class _PdfJpxStream extends _PdfDecodeStream {
    stream: any; // eslint-disable-line
    private maybeLength: number;
    private params: any; // eslint-disable-line
    constructor(stream: any, maybeLength?: number, params?: any) { // eslint-disable-line
        super(maybeLength);
        this.stream = stream;
        this.maybeLength = maybeLength;
        this.params = params;
    }
    get bytes(): Uint8Array {
        return this.stream.getBytes(this.maybeLength);
    }
    readBlock(): void {
        throw new Error('JpxStream.readBlock');
    }
    get isAsyncDecoder(): boolean {
        return true;
    }
    decodeImage(bytes?: Uint8Array): Uint8Array {
        if (this.eof) {
            return this.buffer;
        }
        bytes = bytes || this.bytes;
        this.eof = true;
        return bytes;
    }
    get canAsyncDecodeImageFromBuffer(): boolean {
        return this.stream.isAsync;
    }
}
