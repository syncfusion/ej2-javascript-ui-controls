import { _PdfDecodeStream } from './decode-stream';
import { _PdfDictionary } from './pdf-primitives';
import { FormatError } from './utils';
export class PdfPredictorStream extends _PdfDecodeStream {
    predictor: number;
    dictionary: _PdfDictionary;
    pixBytes: number;
    rowBytes: number;
    colors: number;
    bits: number;
    columns: number;
    readBlock: any; // eslint-disable-line
    constructor(stream: any, maybeLength: number, params: _PdfDictionary) { // eslint-disable-line
        super(maybeLength);
        if (!(params instanceof _PdfDictionary)) {
            return stream;
        }
        const predictor: number = (this.predictor = params.get('Predictor') || 1);
        if (predictor <= 1) {
            return stream;
        }
        if (predictor !== 2 && (predictor < 10 || predictor > 15)) {
            throw new FormatError(`Unsupported predictor: ${predictor}`);
        }
        if (predictor === 2) {
            this.readBlock = this.readBlockTiff;
        } else {
            this.readBlock = this.readBlockPng;
        }
        this.stream = stream;
        this.dictionary = stream.dictionary;
        const colors: number = (this.colors = params.get('Colors') || 1);
        const bits: number = (this.bits = params.get('BPC', 'BitsPerComponent') || 8);
        const columns: number = (this.columns = params.get('Columns') || 1);
        this.pixBytes = (colors * bits + 7) >> 3;
        this.rowBytes = (columns * colors * bits + 7) >> 3;
        return this;
    }
    readBlockTiff(): void {
        const rowBytes: number = this.rowBytes;
        const bufferLength: number = this.bufferLength;
        const buffer: Uint8Array = this.ensureBuffer(bufferLength + rowBytes);
        const bits: number = this.bits;
        const colors: number = this.colors;
        const rawBytes: Uint8Array = this.stream.getBytes(rowBytes);
        this.eof = !rawBytes.length;
        if (this.eof) {
            return;
        }
        let inbuf: number = 0;
        let outbuf: number = 0;
        let inbits: number = 0;
        let outbits: number = 0;
        let position: number = bufferLength;
        let i: number;
        if (bits === 1 && colors === 1) {
            for (i = 0; i < rowBytes; ++i) {
                let c: number = rawBytes[i] ^ inbuf; // eslint-disable-line
                c ^= c >> 1;
                c ^= c >> 2;
                c ^= c >> 4;
                inbuf = (c & 1) << 7;
                buffer[position++] = c;
            }
        } else if (bits === 8) {
            for (i = 0; i < colors; ++i) {
                buffer[position++] = rawBytes[i]; // eslint-disable-line
            }
            for (; i < rowBytes; ++i) {
                buffer[position] = buffer[position - colors] + rawBytes[i]; // eslint-disable-line
                position++;
            }
        } else if (bits === 16) {
            const bytesPerPixel: number = colors * 2;
            for (i = 0; i < bytesPerPixel; ++i) {
                buffer[position++] = rawBytes[i]; // eslint-disable-line
            }
            for (; i < rowBytes; i += 2) {
                const sum: number = ((rawBytes[i] & 0xff) << 8) + // eslint-disable-line
                    (rawBytes[i + 1] & 0xff) +
                    ((buffer[position - bytesPerPixel] & 0xff) << 8) +
                    (buffer[position - bytesPerPixel + 1] & 0xff);
                buffer[position++] = (sum >> 8) & 0xff;
                buffer[position++] = sum & 0xff;
            }
        } else {
            const compArray: Uint8Array = new Uint8Array(colors + 1);
            const bitMask: number = (1 << bits) - 1;
            let j: number = 0;
            let k: number = bufferLength;
            const columns: number = this.columns;
            for (i = 0; i < columns; ++i) {
                for (let kk: number = 0; kk < colors; ++kk) {
                    if (inbits < bits) {
                        inbuf = (inbuf << 8) | (rawBytes[j++] & 0xff);
                        inbits += 8;
                    }
                    compArray[kk] = (compArray[kk] + (inbuf >> (inbits - bits))) & bitMask; // eslint-disable-line
                    inbits -= bits;
                    outbuf = (outbuf << bits) | compArray[kk]; // eslint-disable-line
                    outbits += bits;
                    if (outbits >= 8) {
                        buffer[k++] = (outbuf >> (outbits - 8)) & 0xff;
                        outbits -= 8;
                    }
                }
            }
            if (outbits > 0) {
                buffer[k++] = (outbuf << (8 - outbits)) + (inbuf & ((1 << (8 - outbits)) - 1));
            }
        }
        this.bufferLength += rowBytes;
    }
    readBlockPng(): void {
        const rowBytes: number = this.rowBytes;
        const pixBytes: number = this.pixBytes;
        const predictor: number = this.stream.getByte();
        const rawBytes: Uint8Array = this.stream.getBytes(rowBytes);
        this.eof = !rawBytes.length;
        if (this.eof) {
            return;
        }
        const bufferLength: number = this.bufferLength;
        const buffer: Uint8Array = this.ensureBuffer(bufferLength + rowBytes);
        let prevRow: Uint8Array = buffer.subarray(bufferLength - rowBytes, bufferLength);
        if (prevRow.length === 0) {
            prevRow = new Uint8Array(rowBytes);
        }
        let i: number;
        let j: number = bufferLength;
        let up: number;
        let c: number;
        switch (predictor) {
        case 0:
            for (i = 0; i < rowBytes; ++i) {
                buffer[j++] = rawBytes[i]; // eslint-disable-line
            }
            break;
        case 1:
            for (i = 0; i < pixBytes; ++i) {
                buffer[j++] = rawBytes[i]; // eslint-disable-line
            }
            for (; i < rowBytes; ++i) {
                buffer[j] = (buffer[j - pixBytes] + rawBytes[i]) & 0xff; // eslint-disable-line
                j++;
            }
            break;
        case 2:
            for (i = 0; i < rowBytes; ++i) {
                buffer[j++] = (prevRow[i] + rawBytes[i]) & 0xff; // eslint-disable-line
            }
            break;
        case 3:
            for (i = 0; i < pixBytes; ++i) {
                buffer[j++] = (prevRow[i] >> 1) + rawBytes[i]; // eslint-disable-line
            }
            for (; i < rowBytes; ++i) {
                buffer[j] = (((prevRow[i] + buffer[j - pixBytes]) >> 1) + rawBytes[i]) & 0xff; // eslint-disable-line
                j++;
            }
            break;
        case 4:
            for (i = 0; i < pixBytes; ++i) {
                up = prevRow[i]; // eslint-disable-line
                c = rawBytes[i]; // eslint-disable-line
                buffer[j++] = up + c;
            }
            for (; i < rowBytes; ++i) {
                up = prevRow[i]; // eslint-disable-line
                const upLeft: number = prevRow[i - pixBytes];
                const left: number = buffer[j - pixBytes];
                const p: number = left + up - upLeft;
                let pa: number = p - left;
                if (pa < 0) {
                    pa = -pa;
                }
                let pb: number = p - up;
                if (pb < 0) {
                    pb = -pb;
                }
                let pc: number = p - upLeft;
                if (pc < 0) {
                    pc = -pc;
                }
                c = rawBytes[i]; // eslint-disable-line
                if (pa <= pb && pa <= pc) {
                    buffer[j++] = left + c;
                } else if (pb <= pc) {
                    buffer[j++] = up + c;
                } else {
                    buffer[j++] = upLeft + c;
                }
            }
            break;
        default:
            throw new FormatError(`Unsupported predictor: ${predictor}`);
        }
        this.bufferLength += rowBytes;
    }
}
