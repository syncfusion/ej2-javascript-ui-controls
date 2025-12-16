import { _PdfDecodeStream } from '../decode-stream';
interface _PdfLempelZivWelchState {
    earlyChange: number;
    codeLength: number;
    nextCode: number;
    dictionaryValues: Uint8Array;
    dictionaryLengths: Uint16Array;
    dictionaryPrevCodes: Uint16Array;
    currentSequence: Uint8Array;
    currentSequenceLength: number;
    prevCode?: number;
}
export class _PdfLempelZivWelchStream extends _PdfDecodeStream {
    stream: any; // eslint-disable-line
    private cachedData: number;
    private bitsCached: number;
    private lzwState: _PdfLempelZivWelchState;
    private lastCode: number;
    constructor(str: any, maybeLength?: number, earlyChange?: number) { // eslint-disable-line
        super(maybeLength);
        this.stream = str;
        this.cachedData = 0;
        this.bitsCached = 0;
        const maxLzwDictionarySize: number = 4096;
        const lzwState: _PdfLempelZivWelchState = {
            earlyChange: earlyChange || 0,
            codeLength: 9,
            nextCode: 258,
            dictionaryValues: new Uint8Array(maxLzwDictionarySize),
            dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
            dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
            currentSequence: new Uint8Array(maxLzwDictionarySize),
            currentSequenceLength: 0
        };
        for (let i: number = 0; i < 256; ++i) {
            lzwState.dictionaryValues[<number>i] = i;
            lzwState.dictionaryLengths[<number>i] = 1;
        }
        this.lzwState = lzwState;
        this.lastCode = null;
    }
    readBits(n: number): number {
        let bitsCached: number = this.bitsCached;
        let cachedData: number = this.cachedData;
        while (bitsCached < n) {
            const c: any = this.stream.getByte(); // eslint-disable-line
            if (c === -1) {
                this.eof = true;
                return null;
            }
            cachedData = (cachedData << 8) | c;
            bitsCached += 8;
        }
        this.bitsCached = bitsCached -= n;
        this.cachedData = cachedData;
        this.lastCode = null;
        return (cachedData >>> bitsCached) & ((1 << n) - 1);
    }
    readBlock(): void {
        const blockSize: number = 512;
        const decodedSizeDelta: number = blockSize;
        let estimatedDecodedSize: number = blockSize * 2;
        let i: number;
        let j: number;
        let q: number;
        const lzwState: any = this.lzwState; // eslint-disable-line
        if (!lzwState) {
            return;
        }
        const earlyChange: any = lzwState.earlyChange; // eslint-disable-line
        let nextCode: any = lzwState.nextCode; // eslint-disable-line
        const dictionaryValues: any = lzwState.dictionaryValues; // eslint-disable-line
        const dictionaryLengths: any = lzwState.dictionaryLengths; // eslint-disable-line
        const dictionaryPrevCodes: any = lzwState.dictionaryPrevCodes; // eslint-disable-line
        let codeLength: any = lzwState.codeLength; // eslint-disable-line
        let prevCode: any = lzwState.prevCode; // eslint-disable-line
        const currentSequence: any = lzwState.currentSequence; // eslint-disable-line
        let currentSequenceLength: number = lzwState.currentSequenceLength;
        let decodedLength: number = 0;
        let currentBufferLength: number = this.bufferLength;
        let buffer: any = this.ensureBuffer(this.bufferLength + estimatedDecodedSize); // eslint-disable-line       
        for (i = 0; i < blockSize; i++) {
            const code: number = this.readBits(codeLength);
            const hasPrev: boolean = currentSequenceLength > 0;
            if (code === null) {
                break;
            }
            if (code < 256) {
                currentSequence[0] = code;
                currentSequenceLength = 1;
            } else if (code >= 258) {
                if (code < nextCode) {
                    currentSequenceLength = dictionaryLengths[<number>code];
                    for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
                        currentSequence[<number>j] = dictionaryValues[<number>q];
                        q = dictionaryPrevCodes[<number>q];
                    }
                } else {
                    currentSequence[currentSequenceLength++] = currentSequence[0];
                }
            } else if (code === 256) {
                codeLength = 9;
                nextCode = 258;
                currentSequenceLength = 0;
                continue;
            } else {
                this.eof = true;
                this.lzwState = null;
                break;
            }
            if (hasPrev) {
                dictionaryPrevCodes[<number>nextCode] = prevCode as number;
                dictionaryLengths[<number>nextCode] = dictionaryLengths[prevCode as number] + 1;
                dictionaryValues[<number>nextCode] = currentSequence[0];
                nextCode++;
                codeLength =
                    ((nextCode + earlyChange) & (nextCode + earlyChange - 1))
                        ? codeLength
                        : Math.min(
                            ((Math.log(nextCode + earlyChange) / 0.6931471805599453) + 1) | 0,
                            12
                        );
            }
            prevCode = code;
            decodedLength += currentSequenceLength;
            if (estimatedDecodedSize < decodedLength) {
                do {
                    estimatedDecodedSize += decodedSizeDelta;
                } while (estimatedDecodedSize < decodedLength);
                buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
            }
            for (j = 0; j < currentSequenceLength; j++) {
                buffer[<number>currentBufferLength] = currentSequence[<number>j];
                currentBufferLength++;
            }
        }
        lzwState.nextCode = nextCode;
        lzwState.codeLength = codeLength;
        lzwState.prevCode = prevCode;
        lzwState.currentSequenceLength = currentSequenceLength;
        this.bufferLength = currentBufferLength;
    }
}
