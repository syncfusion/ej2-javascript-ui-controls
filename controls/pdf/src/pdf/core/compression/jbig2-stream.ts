import { _PdfBaseStream } from '../base-stream';
import { _PdfDecodeStream } from '../decode-stream';
import { _PdfJbig2Image } from '../graphics/images/jbig2-image';
import { _PdfDictionary } from '../pdf-primitives';
export class _PdfJbig2Stream extends _PdfDecodeStream {
    stream: _PdfBaseStream;
    private maybeLength: number;
    private params: _PdfDictionary;
    buffer: any; // eslint-disable-line
    bufferLength: number;
    constructor(stream: _PdfBaseStream, maybeLength: number, params: _PdfDictionary) {
        super(maybeLength);
        this.stream = stream;
        this.maybeLength = maybeLength;
        this.params = params;
    }
    get bytes(): Uint8Array {
        return this.stream.getBytes(this.maybeLength);
    }
    readBlock(): void {
        this.decodeImage();
    }
    decodeImage(bytes?: Uint8Array): Uint8Array {
        if (this.eof) {
            return this.buffer;
        }
        bytes = bytes || this.bytes;
        const jbig2Image: _PdfJbig2Image = new _PdfJbig2Image();
        const chunks: any = []; // eslint-disable-line
        if (this.params instanceof _PdfDictionary) {
            const globalsStream: any = this.params.get('JBIG2Globals'); // eslint-disable-line
            if (globalsStream instanceof _PdfBaseStream) {
                const globals: any = globalsStream.getBytes(); // eslint-disable-line
                chunks.push({ data: globals, start: 0, end: globals.length });
            }
        }
        chunks.push({ data: bytes, start: 0, end: bytes.length });
        const data: any = jbig2Image._parseChunks(chunks); // eslint-disable-line
        const dataLength: number = data.length;
        for (let i: number = 0; i < dataLength; i++) {
            data[<number>i] ^= 0xff;
        }
        this.buffer = data;
        this.bufferLength = dataLength;
        this.eof = true;
        return this.buffer;
    }
}
