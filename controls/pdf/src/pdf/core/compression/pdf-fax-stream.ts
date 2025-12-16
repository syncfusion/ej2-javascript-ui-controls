import { _PdfDecodeStream } from '../decode-stream';
import { _PdfFaxDecoder } from '../graphics/images/pdf-fax-decoder';
import { _PdfDictionary } from '../pdf-primitives';
export class _PdfFaxStream extends _PdfDecodeStream {
    stream: any; // eslint-disable-line
    ccittFaxDecoder: _PdfFaxDecoder;
    constructor(str: any, maybeLength?: number, params?: _PdfDictionary) { // eslint-disable-line
        super(maybeLength);
        this.stream = str;
        if (!(params instanceof _PdfDictionary)) {
            params = new _PdfDictionary(null);
        }
        const source: any = { // eslint-disable-line
            next: () => {
                return str.getByte();
            }
        };
        this.ccittFaxDecoder = new _PdfFaxDecoder(source, {
            K: params.get('K'),
            EndOfLine: params.get('EndOfLine'),
            EncodedByteAlign: params.get('EncodedByteAlign'),
            Columns: params.get('Columns'),
            Rows: params.get('Rows'),
            EndOfBlock: params.get('EndOfBlock'),
            BlackIs1: params.get('BlackIs1')
        });
    }
    readBlock(): void {
        while (!this.eof) {
            const c: number = this.ccittFaxDecoder.readNextChar();
            if (c === -1) {
                this.eof = true;
                return;
            }
            this.ensureBuffer(this.bufferLength + 1);
            this.buffer[this.bufferLength++] = c;
        }
    }
}
