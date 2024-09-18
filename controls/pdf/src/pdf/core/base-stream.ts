import { _PdfDictionary, _PdfReference } from './pdf-primitives';
import { _byteArrayToHexString, _bytesToString } from './utils';
export abstract class _PdfBaseStream {
    offset: number;
    dictionary: _PdfDictionary;
    reference: _PdfReference;
    _isCompress: boolean = true;
    _isImage: boolean = false;
    getByte(): number {
        return null;
    }
    getBytes(length?: number): Uint8Array { // eslint-disable-line
        return null;
    }
    get length(): number {
        throw new Error('Abstract getter `length` accessed');
    }
    get isEmpty(): boolean {
        throw new Error('Abstract getter `isEmpty` accessed');
    }
    get isDataLoaded(): boolean {
        return true;
    }
    peekByte(): number {
        const peekedByte: number = this.getByte();
        if (peekedByte !== -1) {
            this.offset--;
        }
        return peekedByte;
    }
    peekBytes(length: number): Uint8Array {
        const bytes: Uint8Array = this.getBytes(length) as Uint8Array;
        this.offset -= bytes.length;
        return bytes;
    }
    getUnsignedInteger16(): number {
        const b0: number = this.getByte();
        const b1: number = this.getByte();
        if (b0 === -1 || b1 === -1) {
            return -1;
        }
        return (b0 << 8) + b1;
    }
    getInt32(): number {
        const b0: number = this.getByte();
        const b1: number = this.getByte();
        const b2: number = this.getByte();
        const b3: number = this.getByte();
        return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    }
    getByteRange(begin: number, end: number): Uint8Array { // eslint-disable-line
        return null;
    }
    makeSubStream(start: number, length: number, dictionary: _PdfDictionary): _PdfBaseStream { // eslint-disable-line
        return null;
    }
    readBlock(): void {
        return null;
    }
    reset(): void {
        return null;
    }
    moveStart(): void {
        return null;
    }
    getString(isHex: boolean = false, bytes?: Uint8Array): string {
        if (typeof bytes === 'undefined' || bytes === null) {
            bytes = this.getBytes() as Uint8Array;
        }
        if (isHex) {
            return _byteArrayToHexString(bytes);
        } else {
            return _bytesToString(bytes);
        }
    }
    skip(n?: number): void {
        this.offset += n || 1;
    }
    getBaseStreams(): _PdfBaseStream[] {
        return null;
    }
}
export class _PdfStream extends _PdfBaseStream {
    constructor(arrayBuffer: number[] | Uint8Array | ArrayBuffer, dictionary?: _PdfDictionary, start?: number, length?: number) {
        super();
        this.bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
        if (typeof start !== 'undefined') {
            this.start = start;
        } else {
            this.start = 0;
        }
        this.position = this.start;
        this.end = start + length || this.bytes.length;
        this.dictionary = dictionary;
    }
    bytes: Uint8Array;
    start: number;
    isImageStream: boolean = false;
    end: number;
    dataStream2 : string[];
    /**
     * Gets the position of the stream.
     *
     * @returns {number} offset position.
     */
    get position(): number {
        return this.offset;
    }
    /**
     * Sets the position of the stream.
     *
     * @param {number} value offset position.
     */
    set position(value: number) {
        this.offset = value;
    }
    /**
     * Gets the length of the stream (Read only).
     *
     * @returns {number} length.
     */
    get length(): number {
        return this.end - this.start;
    }
    /**
     * Gets a value indicating whether the stream is empty (Read only).
     *
     * @returns {boolean} stream empty or not.
     */
    get isEmpty(): boolean {
        return this.length === 0;
    }
    /**
     * Gets the data of the stream.
     *
     * @returns {string[]} data of the stream.
     */
    get data(): string[] {
        return this.dataStream2;
    }
    /**
     * Sets the data of the stream.
     *
     * @param {string[]} value data.
     */
    set data(value: string[]) {
        this.dataStream2 = [];
        this.dataStream2 = value;
    }
    getByte(): number {
        if (this.position >= this.end) {
            return -1;
        }
        return this.bytes[this.position++];
    }
    getBytes(length?: number): Uint8Array {
        const bytes: Uint8Array = this.bytes;
        const position: number = this.position;
        const strEnd: number = this.end;
        if (!length) {
            return bytes.subarray(position, strEnd);
        }
        let end: number = position + length;
        if (end > strEnd) {
            end = strEnd;
        }
        this.position = end;
        return bytes.subarray(position, end);
    }
    getByteRange(begin: number, end: number): Uint8Array {
        if (begin < 0) {
            begin = 0;
        }
        if (end > this.end) {
            end = this.end;
        }
        return this.bytes.subarray(begin, end);
    }
    reset(): void {
        this.position = this.start;
    }
    moveStart(): void {
        this.start = this.position;
    }
    makeSubStream(start: number, length: number, dictionary: _PdfDictionary = null): _PdfStream {
        return new _PdfStream(this.bytes.buffer, dictionary, start, length);
    }
    readBlock(): void {
        throw new Error('Abstract method `readBlock` called');
    }
    _clearStream(): void {
        if (this.dictionary !== null && typeof this.dictionary !== 'undefined' && this.dictionary.has('Filter')) {
            delete this.dictionary._map.Filter;
        }
        this._isCompress = true;
        this.dictionary._updated = true;
    }
    _write(text: string): void {
        this.bytes = new Uint8Array(text.length);
        for (let i: number = 0; i < text.length; i++) {
            this.bytes[Number.parseInt(i.toString(), 10)] = text.charCodeAt(i);
        }
        this.end = this.bytes.length;
        this.dictionary._updated = true;
    }
    _writeBytes(data: number[]): void {
        let text: string = '';
        for (let i: number = 0; i < data.length; i++) {
            text = text + String.fromCharCode(data[Number.parseInt(i.toString(), 10)]);
        }
        this.bytes = new Uint8Array(data);
        this.end = this.bytes.length;
        this.dictionary._updated = true;
    }
}
export class _PdfContentStream extends _PdfBaseStream {
    _bytes: number[];
    _pendingResources: string;
    get length(): number {
        return this._bytes.length;
    }
    constructor(bytes: number[]) {
        super();
        this._bytes = bytes;
        this.dictionary = new _PdfDictionary();
        this.dictionary._updated = true;
    }
    write(data: string | number[]): void {
        if (typeof data === 'string') {
            for (let i: number = 0; i < data.length; i++) {
                this._bytes.push(data.charCodeAt(i));
            }
        } else {
            for (let i: number = 0; i < data.length; i++) {
                this._bytes.push(data[Number.parseInt(i.toString(), 10)]);
            }
        }
        this.dictionary._updated = true;
    }
    getString(isHex: boolean = false): string {
        const bytes: Uint8Array = new Uint8Array(this._bytes);
        if (typeof bytes === 'undefined' || bytes === null || typeof bytes.length === 'undefined') {
            throw new Error('Invalid argument for bytesToString');
        }
        if (isHex) {
            return _byteArrayToHexString(bytes);
        } else {
            const len: number = bytes.length;
            const max: number = 8192;
            if (len < max) {
                return String.fromCharCode.apply(null, bytes);
            }
            const stringBuffer: string[] = [];
            for (let i: number = 0; i < len; i += max) {
                stringBuffer.push(String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + max, len))));
            }
            return stringBuffer.join('');
        }
    }
}
export class _PdfNullStream extends _PdfStream {
    constructor() {
        super(new Uint8Array(0));
    }
}
