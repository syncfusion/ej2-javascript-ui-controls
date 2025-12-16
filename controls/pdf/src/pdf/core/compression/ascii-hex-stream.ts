import { _PdfDecodeStream } from '../decode-stream';
export class _PdfAsciiHexStream extends _PdfDecodeStream {
    stream: any; // eslint-disable-line
    firstDigit: number;
    constructor(str: any, maybeLength?: number) { // eslint-disable-line
        if (maybeLength) {
            maybeLength *= 0.5;
        }
        super(maybeLength);
        this.stream = str;
        this.firstDigit = -1;
    }
    readBlock(): void {
        const blockSize: number = 8000;
        const bytes: any = this.stream.getBytes(blockSize); // eslint-disable-line
        if (!bytes.length) {
            this.eof = true;
            return;
        }
        const maxDecodeLength: number = (bytes.length + 1) >> 1;
        const buffer: Uint8Array = this.ensureBuffer(this.bufferLength + maxDecodeLength);
        let bufferLength: number = this.bufferLength;
        let firstDigit: number = this.firstDigit;
        for (const ch of bytes) {
            let digit: any; // eslint-disable-line
            if (ch >= 0x30 && ch <= 0x39) {
                digit = ch & 0x0f;
            } else if (
                (ch >= 0x41 && ch <= 0x46) ||
                (ch >= 0x61 && ch <= 0x66)
            ) {
                digit = (ch & 0x0f) + 9;
            } else if (ch === 0x3e) {
                this.eof = true;
                break;
            } else {
                continue;
            }
            if (firstDigit < 0) {
                firstDigit = digit;
            } else {
                buffer[bufferLength++] = (firstDigit << 4) | digit;
                firstDigit = -1;
            }
        }
        if (firstDigit >= 0 && this.eof) {
            buffer[bufferLength++] = firstDigit << 4;
            firstDigit = -1;
        }
        this.firstDigit = firstDigit;
        this.bufferLength = bufferLength;
    }
}
