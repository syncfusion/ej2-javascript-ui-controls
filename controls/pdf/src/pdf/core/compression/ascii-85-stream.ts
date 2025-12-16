import { _PdfDecodeStream } from '../decode-stream';
import { _isWhiteSpace } from '../utils';
export class _PdfAscii85Stream extends _PdfDecodeStream {
    stream: any; // eslint-disable-line
    input: Uint8Array;
    constructor(str: any, maybeLength?: number) { // eslint-disable-line
        if (maybeLength) {
            maybeLength *= 0.8;
        }
        super(maybeLength);
        this.stream = str;
        this.input = new Uint8Array(5);
    }
    readBlock(): void {
        const tildaCharacter: number = 0x7e;
        const lowerCharacter: number = 0x7a;
        const eof: number = -1;
        const str: any = this.stream; // eslint-disable-line
        let c: any = str.getByte(); // eslint-disable-line
        while (_isWhiteSpace(c)) {
            c = str.getByte();
        }
        if (c === eof || c === tildaCharacter) {
            this.eof = true;
            return;
        }
        const bufferLength: number = this.bufferLength;
        let buffer: any // eslint-disable-line
        let i: number;
        if (c === lowerCharacter) {
            buffer = this.ensureBuffer(bufferLength + 4);
            for (i = 0; i < 4; ++i) {
                buffer[bufferLength + i] = 0;
            }
            this.bufferLength += 4;
        } else {
            const input: any = this.input; // eslint-disable-line
            input[0] = c;
            for (i = 1; i < 5; ++i) {
                c = str.getByte();
                while (_isWhiteSpace(c)) {
                    c = str.getByte();
                }
                input[Number.parseInt(i.toString(), 10)] = c;
                if (c === eof || c === tildaCharacter) {
                    break;
                }
            }
            buffer = this.ensureBuffer(bufferLength + i - 1);
            this.bufferLength += i - 1;
            if (i < 5) {
                for (; i < 5; ++i) {
                    input[Number.parseInt(i.toString(), 10)] = 0x21 + 84;
                }
                this.eof = true;
            }
            let t: number = 0;
            for (i = 0; i < 5; ++i) {
                t = t * 85 + (input[Number.parseInt(i.toString(), 10)] - 0x21);
            }
            for (i = 3; i >= 0; --i) {
                buffer[bufferLength + i] = t & 0xff;
                t >>= 8;
            }
        }
    }
}
