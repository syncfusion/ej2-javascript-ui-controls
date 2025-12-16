import { _PdfDecodeStream } from '../decode-stream';
import { _PdfDictionary } from '../pdf-primitives';
export class _PdfRunLengthStream extends _PdfDecodeStream {
    dict: _PdfDictionary;
    constructor(str: any, maybeLength?: number) { // eslint-disable-line
        super(maybeLength);
        this.stream = str;
        this.dict = str.dict;
    }
    readBlock(): void {
        const repeatHeader: any = this.stream.getBytes(2); // eslint-disable-line
        if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] === 128) {
            this.eof = true;
            return;
        }
        let buffer: any; // eslint-disable-line
        let bufferLength: number = this.bufferLength;
        let n: number = repeatHeader[0];
        if (n < 128) {
            buffer = this.ensureBuffer(bufferLength + n + 1);
            buffer[bufferLength++] = repeatHeader[1];
            if (n > 0) {
                const source: any = this.stream.getBytes(n); // eslint-disable-line
                buffer.set(source, bufferLength);
                bufferLength += n;
            }
        } else {
            n = 257 - n;
            buffer = this.ensureBuffer(bufferLength + n + 1);
            buffer.fill(repeatHeader[1], bufferLength, bufferLength + n);
            bufferLength += n;
        }
        this.bufferLength = bufferLength;
    }
}
