import { _PdfBaseStream } from './base-stream';
import { _PdfDecodeStream } from './decode-stream';
import { _Cipher } from './security/encryptor';
export class _PdfDecryptStream extends _PdfDecodeStream {
    readonly _chunkSize: number = 512;
    _initialized: boolean;
    _nextChunk: Uint8Array;
    _cipher: _Cipher;
    constructor(stream: _PdfBaseStream, maybeLength: number, cipher: _Cipher) {
        super(maybeLength);
        this.stream = stream;
        this.dictionary = stream.dictionary;
        this._cipher = cipher;
        this._nextChunk = null;
        this._initialized = false;
    }
    readBlock(): void {
        let chunk: Uint8Array;
        if (this._initialized) {
            chunk = this._nextChunk;
        } else {
            chunk = this.stream.getBytes(this._chunkSize);
            this._initialized = true;
        }
        if (!chunk || chunk.length === 0) {
            this.eof = true;
            return;
        }
        this._nextChunk = this.stream.getBytes(this._chunkSize);
        const hasMoreData: boolean = this._nextChunk && this._nextChunk.length > 0;
        chunk = this._cipher._decryptBlock(chunk, !hasMoreData);
        let bufferLength: number = this.bufferLength;
        const n: number = chunk.length;
        const buffer: Uint8Array = this.ensureBuffer(bufferLength + n);
        for (let i: number = 0; i < n; i++) {
            buffer[bufferLength++] = chunk[Number.parseInt(i.toString(), 10)];
        }
        this.bufferLength = bufferLength;
    }
}
