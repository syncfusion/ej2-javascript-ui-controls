import { Encoding } from '@syncfusion/ej2-file-utils';
/**
 * array literal codes
 */
const ARR_LITERAL_CODES: Int16Array = new Int16Array(286);
const ARR_LITERAL_LENGTHS: Uint8Array = new Uint8Array(286);
const ARR_DISTANCE_CODES: Int16Array = new Int16Array(30);
const ARR_DISTANCE_LENGTHS: Uint8Array = new Uint8Array(30);

/**
 * represent compression stream writer
 * ```typescript
 * let compressedWriter = new CompressedStreamWriter();
 * let text: string = 'Hello world!!!';
 * compressedWriter.write(text, 0, text.length);
 * compressedWriter.close();
 * ```
 */
export class CompressedStreamWriter {
    private static isHuffmanTreeInitiated: boolean = false;
    private stream: Uint8Array[];
    private pendingBuffer: Uint8Array = new Uint8Array(1 << 16);
    private pendingBufLength: number = 0;
    private pendingBufCache: number = 0;
    private pendingBufBitsInCache: number = 0;
    private treeLiteral: CompressorHuffmanTree;
    private treeDistances: CompressorHuffmanTree;
    private treeCodeLengths: CompressorHuffmanTree;
    private bufferPosition: number = 0;
    private arrLiterals: Uint8Array;
    private arrDistances: Uint16Array;
    private extraBits: number = 0;
    private currentHash: number = 0;
    private hashHead: Int16Array;
    private hashPrevious: Int16Array;
    private matchStart: number = 0;
    private matchLength: number = 0;
    private matchPrevAvail: boolean = false;
    private blockStart: number = 0;
    private stringStart: number = 0;
    private lookAhead: number = 0;
    private dataWindow: Uint8Array;
    private inputBuffer: Uint8Array;
    private totalBytesIn: number = 0;
    private inputOffset: number = 0;
    private inputEnd: number = 0;
    private windowSize: number = 1 << 15;
    private windowMask: number = this.windowSize - 1;
    private hashSize: number = 1 << 15;
    private hashMask: number = this.hashSize - 1;
    private hashShift: number = Math.floor((15 + 3 - 1) / 3);
    private maxDist: number = this.windowSize - 262;
    private checkSum: number = 1;
    private noWrap: Boolean = false;
    /**
     * get compressed data
     */
    get compressedData(): Uint8Array[] {
        return this.stream;
    }

    get getCompressedString(): string {
        let compressedString: string = '';
        if (this.stream !== undefined) {
            for (let i: number = 0; i < this.stream.length; i++) {
                compressedString += String.fromCharCode.apply(null, this.stream[i]);
            }
        }
        return compressedString;
    }
    /**
     * Initializes compressor and writes ZLib header if needed.
     * @param {boolean} noWrap - optional if true, ZLib header and checksum will not be written.
     */
    constructor(noWrap?: boolean) {
        if (!CompressedStreamWriter.isHuffmanTreeInitiated) {
            CompressedStreamWriter.initHuffmanTree();
            CompressedStreamWriter.isHuffmanTreeInitiated = true;
        }
        this.treeLiteral = new CompressorHuffmanTree(this, 286, 257, 15);
        this.treeDistances = new CompressorHuffmanTree(this, 30, 1, 15);
        this.treeCodeLengths = new CompressorHuffmanTree(this, 19, 4, 7);
        this.arrDistances = new Uint16Array((1 << 14));
        this.arrLiterals = new Uint8Array((1 << 14));
        this.stream = [];
        this.dataWindow = new Uint8Array(2 * this.windowSize);
        this.hashHead = new Int16Array(this.hashSize);
        this.hashPrevious = new Int16Array(this.windowSize);
        this.blockStart = this.stringStart = 1;
        this.noWrap = noWrap;
        if (!noWrap) {
            this.writeZLibHeader();
        }
    }
    /**
     * Compresses data and writes it to the stream.
     * @param {Uint8Array} data - data to compress
     * @param {number} offset - offset in data
     * @param {number} length - length of the data
     * @returns {void}
     */
    public write(data: Uint8Array | string, offset: number, length: number): void {
        if (data === undefined || data === null) {
            throw new Error('ArgumentException: data cannot null or undefined');
        }
        let end: number = offset + length;
        if (0 > offset || offset > end || end > data.length) {
            throw new Error('ArgumentOutOfRangeException: Offset or length is incorrect');
        }
        if (typeof data === 'string') {
            let encode: Encoding = new Encoding(false);
            encode.type = 'Utf8';
            data = new Uint8Array(encode.getBytes(data, 0, data.length));
            end = offset + data.length;
        }
        this.inputBuffer = data as Uint8Array;
        this.inputOffset = offset;
        this.inputEnd = end;
        if (!this.noWrap) {
            this.checkSum = ChecksumCalculator.checksumUpdate(this.checkSum, this.inputBuffer, this.inputOffset, end);
        }
        while (!(this.inputEnd === this.inputOffset) || !(this.pendingBufLength === 0)) {
            this.pendingBufferFlush();
            this.compressData(false);
        }
    }
    /**
     * write ZLib header to the compressed data
     * @return {void}
     */
    public writeZLibHeader(): void {
        /* Initialize header.*/
        let headerDate: number = (8 + (7 << 4)) << 8;
        /* Save compression level.*/
        headerDate |= ((5 >> 2) & 3) << 6;
        /* Align header.*/
        headerDate += 31 - (headerDate % 31);
        /* Write header to stream.*/
        this.pendingBufferWriteShortBytes(headerDate);
    }
    /**
     *  Write Most Significant Bytes in to stream
     * @param {number} s - check sum value
     */
    public pendingBufferWriteShortBytes(s: number): void {
        this.pendingBuffer[this.pendingBufLength++] = s >> 8;
        this.pendingBuffer[this.pendingBufLength++] = s;
    }
    private compressData(finish: boolean): boolean {
        let success: boolean;
        do {
            this.fillWindow();
            let canFlush: boolean = (finish && this.inputEnd === this.inputOffset);
            success = this.compressSlow(canFlush, finish);
        }
        while (this.pendingBufLength === 0 && success);
        return success;
    }
    private compressSlow(flush: boolean, finish: boolean): boolean {
        if (this.lookAhead < 262 && !flush) {
            return false;
        }
        while (this.lookAhead >= 262 || flush) {
            if (this.lookAhead === 0) {
                return this.lookAheadCompleted(finish);
            }
            if (this.stringStart >= 2 * this.windowSize - 262) {
                this.slideWindow();
            }
            let prevMatch: number = this.matchStart;
            let prevLen: number = this.matchLength;
            if (this.lookAhead >= 3) {
                this.discardMatch();
            }
            if (prevLen >= 3 && this.matchLength <= prevLen) {
                prevLen = this.matchPreviousBest(prevMatch, prevLen);
            } else {
                this.matchPreviousAvailable();
            }
            if (this.bufferPosition >= (1 << 14)) {
                return this.huffmanIsFull(finish);
            }
        }
        return true;
    }
    private discardMatch(): void {
        let hashHead: number = this.insertString();
        if (hashHead !== 0 && this.stringStart - hashHead <= this.maxDist && this.findLongestMatch(hashHead)) {
            if (this.matchLength <= 5 && (this.matchLength === 3 && this.stringStart - this.matchStart > 4096)) {
                this.matchLength = 3 - 1;
            }
        }
    }
    private matchPreviousAvailable(): void {
        if (this.matchPrevAvail) {
            this.huffmanTallyLit(this.dataWindow[this.stringStart - 1] & 0xff);
        }
        this.matchPrevAvail = true;
        this.stringStart++;
        this.lookAhead--;
    }
    private matchPreviousBest(prevMatch: number, prevLen: number): number {
        this.huffmanTallyDist(this.stringStart - 1 - prevMatch, prevLen);
        prevLen -= 2;
        do {
            this.stringStart++;
            this.lookAhead--;
            if (this.lookAhead >= 3) {
                this.insertString();
            }
        } while (--prevLen > 0);
        this.stringStart++;
        this.lookAhead--;
        this.matchPrevAvail = false;
        this.matchLength = 3 - 1;
        return prevLen;
    }
    private lookAheadCompleted(finish: boolean): boolean {
        if (this.matchPrevAvail) {
            this.huffmanTallyLit(this.dataWindow[this.stringStart - 1] & 0xff);
        }
        this.matchPrevAvail = false;
        this.huffmanFlushBlock(this.dataWindow, this.blockStart, this.stringStart - this.blockStart, finish);
        this.blockStart = this.stringStart;
        return false;
    }
    private huffmanIsFull(finish: boolean): boolean {
        let len: number = this.stringStart - this.blockStart;
        if (this.matchPrevAvail) {
            len--;
        }
        let lastBlock: boolean = (finish && this.lookAhead === 0 && !this.matchPrevAvail);
        this.huffmanFlushBlock(this.dataWindow, this.blockStart, len, lastBlock);
        this.blockStart += len;
        return !lastBlock;
    }
    private fillWindow(): void {
        if (this.stringStart >= this.windowSize + this.maxDist) {
            this.slideWindow();
        }
        while (this.lookAhead < 262 && this.inputOffset < this.inputEnd) {
            let more: number = 2 * this.windowSize - this.lookAhead - this.stringStart;
            if (more > this.inputEnd - this.inputOffset) {
                more = this.inputEnd - this.inputOffset;
            }
            this.dataWindow.set(this.inputBuffer.subarray(this.inputOffset, this.inputOffset + more), this.stringStart + this.lookAhead);
            this.inputOffset += more;
            this.totalBytesIn += more;
            this.lookAhead += more;
        }
        if (this.lookAhead >= 3) {
            this.updateHash();
        }
    }
    private slideWindow(): void {
        this.dataWindow.set(this.dataWindow.subarray(this.windowSize, this.windowSize + this.windowSize), 0);
        this.matchStart -= this.windowSize;
        this.stringStart -= this.windowSize;
        this.blockStart -= this.windowSize;
        for (let i: number = 0; i < this.hashSize; ++i) {
            let m: number = this.hashHead[i] & 0xffff;
            this.hashHead[i] = (((m >= this.windowSize) ? (m - this.windowSize) : 0));
        }
        for (let i: number = 0; i < this.windowSize; i++) {
            let m: number = this.hashPrevious[i] & 0xffff;
            this.hashPrevious[i] = ((m >= this.windowSize) ? (m - this.windowSize) : 0);
        }
    }
    private insertString(): number {
        let match: number;
        let hash: number = ((this.currentHash << this.hashShift) ^ this.dataWindow[this.stringStart + (3 - 1)]) & this.hashMask;
        this.hashPrevious[this.stringStart & this.windowMask] = match = this.hashHead[hash];
        this.hashHead[hash] = this.stringStart;
        this.currentHash = hash;
        return match & 0xffff;
    }
    private findLongestMatch(curMatch: number): boolean {
        let chainLen: number = 4096;
        let niceLen: number = 258;
        let scan: number = this.stringStart;
        let match: number;
        let bestEnd: number = this.stringStart + this.matchLength;
        let bestLength: number = Math.max(this.matchLength, 3 - 1);
        let limit: number = Math.max(this.stringStart - this.maxDist, 0);
        let stringEnd: number = this.stringStart + 258 - 1;
        let scanEnd1: number = this.dataWindow[bestEnd - 1];
        let scanEnd: number = this.dataWindow[bestEnd];
        let data: Uint8Array = this.dataWindow;
        if (bestLength >= 32) {
            chainLen >>= 2;
        }
        if (niceLen > this.lookAhead) {
            niceLen = this.lookAhead;
        }
        do {
            if (data[curMatch + bestLength] !== scanEnd ||
                data[curMatch + bestLength - 1] !== scanEnd1 ||
                data[curMatch] !== data[scan] ||
                data[curMatch + 1] !== data[scan + 1]) {
                continue;
            }
            match = curMatch + 2;
            scan += 2;
            /* tslint:disable */
            while (data[++scan] === data[++match] && data[++scan] === data[++match] &&
                data[++scan] === data[++match] && data[++scan] === data[++match] &&
                data[++scan] === data[++match] && data[++scan] === data[++match] &&
                data[++scan] === data[++match] && data[++scan] === data[++match] && scan < stringEnd) {
                /* tslint:disable */
            }
            if (scan > bestEnd) {
                this.matchStart = curMatch;
                bestEnd = scan;
                bestLength = scan - this.stringStart;
                if (bestLength >= niceLen) {
                    break;
                }
                scanEnd1 = data[bestEnd - 1];
                scanEnd = data[bestEnd];
            }
            scan = this.stringStart;
        }
        while ((curMatch = (this.hashPrevious[curMatch & this.windowMask] & 0xffff)) > limit && --chainLen !== 0);
        this.matchLength = Math.min(bestLength, this.lookAhead);
        return this.matchLength >= 3;
    }
    private updateHash(): void {
        this.currentHash = (this.dataWindow[this.stringStart] << this.hashShift) ^ this.dataWindow[this.stringStart + 1];
    }
    private huffmanTallyLit(literal: number): boolean {
        this.arrDistances[this.bufferPosition] = 0;
        this.arrLiterals[this.bufferPosition++] = literal;
        this.treeLiteral.codeFrequencies[literal]++;
        return this.bufferPosition >= (1 << 14);
    }
    private huffmanTallyDist(dist: number, len: number): boolean {
        this.arrDistances[this.bufferPosition] = dist;
        this.arrLiterals[this.bufferPosition++] = (len - 3);
        let lc: number = this.huffmanLengthCode(len - 3);
        this.treeLiteral.codeFrequencies[lc]++;
        if (lc >= 265 && lc < 285) {
            this.extraBits += Math.floor((lc - 261) / 4);
        }
        let dc: number = this.huffmanDistanceCode(dist - 1);
        this.treeDistances.codeFrequencies[dc]++;
        if (dc >= 4) {
            this.extraBits += Math.floor((dc / 2 - 1));
        }
        return this.bufferPosition >= (1 << 14);
    }
    private huffmanFlushBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void {
        this.treeLiteral.codeFrequencies[256]++;
        this.treeLiteral.buildTree();
        this.treeDistances.buildTree();
        this.treeLiteral.calculateBLFreq(this.treeCodeLengths);
        this.treeDistances.calculateBLFreq(this.treeCodeLengths);
        this.treeCodeLengths.buildTree();
        let blTreeCodes: number = 4;
        for (let i: number = 18; i > blTreeCodes; i--) {
            if (this.treeCodeLengths.codeLengths[CompressorHuffmanTree.huffCodeLengthOrders[i]] > 0) {
                blTreeCodes = i + 1;
            }
        }
        let opt_len: number = 14 + blTreeCodes * 3 + this.treeCodeLengths.getEncodedLength() +
            this.treeLiteral.getEncodedLength() + this.treeDistances.getEncodedLength() + this.extraBits;
        let static_len: number = this.extraBits;
        for (let i: number = 0; i < 286; i++) {
            static_len += this.treeLiteral.codeFrequencies[i] * ARR_LITERAL_LENGTHS[i];
        }
        for (let i = 0; i < 30; i++) {
            static_len += this.treeDistances.codeFrequencies[i] * ARR_DISTANCE_LENGTHS[i];
        }
        if (opt_len >= static_len) {
            // Force static trees.
            opt_len = static_len;
        }
        if (storedOffset >= 0 && storedLength + 4 < opt_len >> 3) {
            this.huffmanFlushStoredBlock(stored, storedOffset, storedLength, lastBlock);
        } else if (opt_len == static_len) {
            // Encode with static tree.
            this.pendingBufferWriteBits((1 << 1) + (lastBlock ? 1 : 0), 3);
            this.treeLiteral.setStaticCodes(ARR_LITERAL_CODES, ARR_LITERAL_LENGTHS);
            this.treeDistances.setStaticCodes(ARR_DISTANCE_CODES, ARR_DISTANCE_LENGTHS);
            this.huffmanCompressBlock();
            this.huffmanReset();
        } else {
            this.pendingBufferWriteBits((2 << 1) + (lastBlock ? 1 : 0), 3);
            this.huffmanSendAllTrees(blTreeCodes);
            this.huffmanCompressBlock();
            this.huffmanReset();
        }
    }
    private huffmanFlushStoredBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void {
        this.pendingBufferWriteBits((0 << 1) + (lastBlock ? 1 : 0), 3);
        this.pendingBufferAlignToByte();
        this.pendingBufferWriteShort(storedLength);
        this.pendingBufferWriteShort(~storedLength);
        this.pendingBufferWriteByteBlock(stored, storedOffset, storedLength);
        this.huffmanReset();
    }
    private huffmanLengthCode(len: number): number {
        if (len === 255) {
            return 285;
        }
        let code: number = 257;
        while (len >= 8) {
            code += 4;
            len >>= 1;
        }
        return code + len;
    }
    private huffmanDistanceCode(distance: number): number {
        let code: number = 0;
        while (distance >= 4) {
            code += 2;
            distance >>= 1;
        }
        return code + distance;
    }
    private huffmanSendAllTrees(blTreeCodes: number): void {
        this.treeCodeLengths.buildCodes();
        this.treeLiteral.buildCodes();
        this.treeDistances.buildCodes();
        this.pendingBufferWriteBits(this.treeLiteral.treeLength - 257, 5);
        this.pendingBufferWriteBits(this.treeDistances.treeLength - 1, 5);
        this.pendingBufferWriteBits(blTreeCodes - 4, 4);
        for (let rank: number = 0; rank < blTreeCodes; rank++) {
            this.pendingBufferWriteBits(
                this.treeCodeLengths.codeLengths[CompressorHuffmanTree.huffCodeLengthOrders[rank]]
                , 3);
        }
        this.treeLiteral.writeTree(this.treeCodeLengths);
        this.treeDistances.writeTree(this.treeCodeLengths);
    }
    private huffmanReset(): void {
        this.bufferPosition = 0;
        this.extraBits = 0;
        this.treeLiteral.reset();
        this.treeDistances.reset();
        this.treeCodeLengths.reset();
    }
    private huffmanCompressBlock(): void {
        for (let i: number = 0; i < this.bufferPosition; i++) {
            let literalLen: number = this.arrLiterals[i] & 255;
            let dist: number = this.arrDistances[i];
            if (dist-- !== 0) {
                let lc: number = this.huffmanLengthCode(literalLen);
                this.treeLiteral.writeCodeToStream(lc);
                let bits: number = Math.floor((lc - 261) / 4);
                if (bits > 0 && bits <= 5) {
                    this.pendingBufferWriteBits(literalLen & ((1 << bits) - 1), bits);
                }
                let dc: number = this.huffmanDistanceCode(dist);
                this.treeDistances.writeCodeToStream(dc);
                bits = Math.floor(dc / 2 - 1);
                if (bits > 0) {
                    this.pendingBufferWriteBits(dist & ((1 << bits) - 1), bits);
                }
            } else {
                this.treeLiteral.writeCodeToStream(literalLen);
            }
        }
        this.treeLiteral.writeCodeToStream(256);
    }
    /**
     * write bits in to internal buffer
     * @param {number} b - source of bits
     * @param {number} count - count of bits to write
     */
    public pendingBufferWriteBits(b: number, count: number): void {
        let uint: Uint32Array = new Uint32Array(1);
        uint[0] = this.pendingBufCache | (b << this.pendingBufBitsInCache);
        this.pendingBufCache = uint[0];
        this.pendingBufBitsInCache += count;
        this.pendingBufferFlushBits();
    }
    private pendingBufferFlush(isClose?: boolean): void {
        this.pendingBufferFlushBits();
        if (this.pendingBufLength > 0) {
            let array: Uint8Array = new Uint8Array(this.pendingBufLength);
            array.set(this.pendingBuffer.subarray(0, this.pendingBufLength), 0);
            this.stream.push(array);
        }
        this.pendingBufLength = 0;
    }
    private pendingBufferFlushBits(): number {
        let result: number = 0;
        while (this.pendingBufBitsInCache >= 8 && this.pendingBufLength < (1 << 16)) {
            this.pendingBuffer[this.pendingBufLength++] = this.pendingBufCache;
            this.pendingBufCache >>= 8;
            this.pendingBufBitsInCache -= 8;
            result++;
        }
        return result;
    }
    private pendingBufferWriteByteBlock(data: Uint8Array, offset: number, length: number): void {
        let array: Uint8Array = data.subarray(offset, offset + length);
        this.pendingBuffer.set(array, this.pendingBufLength);
        this.pendingBufLength += length;
    }
    private pendingBufferWriteShort(s: number): void {
        this.pendingBuffer[this.pendingBufLength++] = s;
        this.pendingBuffer[this.pendingBufLength++] = (s >> 8);
    }
    private pendingBufferAlignToByte(): void {
        if (this.pendingBufBitsInCache > 0) {
            this.pendingBuffer[this.pendingBufLength++] = this.pendingBufCache;
        }
        this.pendingBufCache = 0;
        this.pendingBufBitsInCache = 0;
    }
    /**
     * Huffman Tree literal calculation
     * @private
     */
    public static initHuffmanTree(): void {
        let i: number = 0;
        while (i < 144) {
            ARR_LITERAL_CODES[i] = CompressorHuffmanTree.bitReverse((0x030 + i) << 8);
            ARR_LITERAL_LENGTHS[i++] = 8;
        }
        while (i < 256) {
            ARR_LITERAL_CODES[i] = CompressorHuffmanTree.bitReverse((0x190 - 144 + i) << 7);
            ARR_LITERAL_LENGTHS[i++] = 9;
        }
        while (i < 280) {
            ARR_LITERAL_CODES[i] = CompressorHuffmanTree.bitReverse((0x000 - 256 + i) << 9);
            ARR_LITERAL_LENGTHS[i++] = 7;
        }
        while (i < 286) {
            ARR_LITERAL_CODES[i] = CompressorHuffmanTree.bitReverse((0x0c0 - 280 + i) << 8);
            ARR_LITERAL_LENGTHS[i++] = 8;
        }
        for (i = 0; i < 30; i++) {
            ARR_DISTANCE_CODES[i] = CompressorHuffmanTree.bitReverse(i << 11);
            ARR_DISTANCE_LENGTHS[i] = 5;
        }
    }
    /**
     * close the stream and write all pending buffer in to stream
     * @returns {void}
     */
    public close(): void {
        do {
            this.pendingBufferFlush(true);
            if (!this.compressData(true)) {
                this.pendingBufferFlush(true);
                this.pendingBufferAlignToByte();
                if (!this.noWrap) {
                    this.pendingBufferWriteShortBytes(this.checkSum >> 16);
                    this.pendingBufferWriteShortBytes(this.checkSum & 0xffff);
                }
                this.pendingBufferFlush(true);
            }
        }
        while (!(this.inputEnd === this.inputOffset) ||
            !(this.pendingBufLength === 0));
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    public destroy(): void {
        this.stream = [];
        this.stream = undefined;
        this.pendingBuffer = undefined;
        this.treeLiteral = undefined;
        this.treeDistances = undefined;
        this.treeCodeLengths = undefined;
        this.arrLiterals = undefined;
        this.arrDistances = undefined;
        this.hashHead = undefined;
        this.hashPrevious = undefined;
        this.dataWindow = undefined;
        this.inputBuffer = undefined;
        this.pendingBufLength = undefined;
        this.pendingBufCache = undefined;
        this.pendingBufBitsInCache = undefined;
        this.bufferPosition = undefined;
        this.extraBits = undefined;
        this.currentHash = undefined;
        this.matchStart = undefined;
        this.matchLength = undefined;
        this.matchPrevAvail = undefined;
        this.blockStart = undefined;
        this.stringStart = undefined;
        this.lookAhead = undefined;
        this.totalBytesIn = undefined;
        this.inputOffset = undefined;
        this.inputEnd = undefined;
        this.windowSize = undefined;
        this.windowMask = undefined;
        this.hashSize = undefined;
        this.hashMask = undefined;
        this.hashShift = undefined;
        this.maxDist = undefined;
        this.checkSum = undefined;
        this.noWrap = undefined;
    }
}
/**
 * represent the Huffman Tree
 */
export class CompressorHuffmanTree {
    private codeFrequency: Uint16Array;
    private codes: Int16Array;
    private codeLength: Uint8Array;
    private lengthCount: Int32Array;
    private codeMinCount: number;
    private codeCount: number;
    private maxLength: number;
    private writer: CompressedStreamWriter;
    private static reverseBits: number[] = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
    public static huffCodeLengthOrders: number[] = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    public get treeLength(): number {
        return this.codeCount;
    }
    public get codeLengths(): Uint8Array {
        return this.codeLength;
    }
    public get codeFrequencies(): Uint16Array {
        return this.codeFrequency;
    }
    /**
     * Create new Huffman Tree
     * @param {CompressedStreamWriter} writer instance
     * @param {number} elementCount - element count
     * @param {number} minCodes - minimum count
     * @param {number} maxLength - maximum count
     */
    constructor(writer: CompressedStreamWriter, elementCount: number, minCodes: number, maxLength: number) {
        this.writer = writer;
        this.codeMinCount = minCodes;
        this.maxLength = maxLength;
        this.codeFrequency = new Uint16Array(elementCount);
        this.lengthCount = new Int32Array(maxLength);
    }
    public setStaticCodes(codes: Int16Array, lengths: Uint8Array): void {
        let temp: Int16Array = new Int16Array(codes.length);
        temp.set(codes, 0);
        this.codes = temp;
        let lengthTemp: Uint8Array = new Uint8Array(lengths.length);
        lengthTemp.set(lengths, 0);
        this.codeLength = lengthTemp;
    }
    /**
     * reset all code data in tree
     * @returns {void}
     */
    public reset(): void {
        for (let i: number = 0; i < this.codeFrequency.length; i++) {
            this.codeFrequency[i] = 0;
        }
        this.codes = undefined;
        this.codeLength = undefined;
    }
    /**
     * write code to the compressor output stream
     * @param {number} code - code to be written
     * @returns {void}
     */
    public writeCodeToStream(code: number): void {
        this.writer.pendingBufferWriteBits(this.codes[code] & 0xffff, this.codeLength[code]);
    }
    /**
     * calculate code from their frequencies
     * @returns {void}
     */
    public buildCodes(): void {
        let nextCode: Int32Array = new Int32Array(this.maxLength);
        this.codes = new Int16Array(this.codeCount);
        let code: number = 0;
        for (let bitsCount: number = 0; bitsCount < this.maxLength; bitsCount++) {
            nextCode[bitsCount] = code;
            code += this.lengthCount[bitsCount] << (15 - bitsCount);
        }
        for (let i: number = 0; i < this.codeCount; i++) {
            let bits = this.codeLength[i];
            if (bits > 0) {
                this.codes[i] = CompressorHuffmanTree.bitReverse(nextCode[bits - 1]);
                nextCode[bits - 1] += 1 << (16 - bits);
            }
        }
    }
    public static bitReverse(value: number): number {
        return (CompressorHuffmanTree.reverseBits[value & 15] << 12
            | CompressorHuffmanTree.reverseBits[(value >> 4) & 15] << 8
            | CompressorHuffmanTree.reverseBits[(value >> 8) & 15] << 4
            | CompressorHuffmanTree.reverseBits[value >> 12]);
    }
    /**
     * calculate length of compressed data
     * @returns {number}
     */
    public getEncodedLength(): number {
        let len: number = 0;
        for (let i: number = 0; i < this.codeFrequency.length; i++) {
            len += this.codeFrequency[i] * this.codeLength[i];
        }
        return len;
    }
    /**
     * calculate code frequencies
     * @param {CompressorHuffmanTree} blTree
     * @returns {void}
     */
    public calculateBLFreq(blTree: CompressorHuffmanTree): void {
        let maxCount: number;
        let minCount: number;
        let count: number;
        let curLen: number = -1;
        let i: number = 0;
        while (i < this.codeCount) {
            count = 1;
            let nextLen: number = this.codeLength[i];
            if (nextLen === 0) {
                maxCount = 138;
                minCount = 3;
            } else {
                maxCount = 6;
                minCount = 3;
                if (curLen !== nextLen) {
                    blTree.codeFrequency[nextLen]++;
                    count = 0;
                }
            }
            curLen = nextLen;
            i++;
            while (i < this.codeCount && curLen === this.codeLength[i]) {
                i++;
                if (++count >= maxCount) {
                    break;
                }
            }
            if (count < minCount) {
                blTree.codeFrequency[curLen] += count;
            } else if (curLen !== 0) {
                blTree.codeFrequency[16]++;
            } else if (count <= 10) {
                blTree.codeFrequency[17]++;
            } else {
                blTree.codeFrequency[18]++;
            }
        }
    }
    /**
     * @param {CompressorHuffmanTree} blTree - write tree to output stream
     * @returns {void}
     */
    public writeTree(blTree: CompressorHuffmanTree): void {
        let maxRepeatCount: number;
        let minRepeatCount: number;
        let currentRepeatCount: number;
        let currentCodeLength: number = -1;
        let i: number = 0;
        while (i < this.codeCount) {
            currentRepeatCount = 1;
            let nextLen: number = this.codeLength[i];
            if (nextLen === 0) {
                maxRepeatCount = 138;
                minRepeatCount = 3;
            } else {
                maxRepeatCount = 6;
                minRepeatCount = 3;
                if (currentCodeLength !== nextLen) {
                    blTree.writeCodeToStream(nextLen);
                    currentRepeatCount = 0;
                }
            }
            currentCodeLength = nextLen;
            i++;
            while (i < this.codeCount && currentCodeLength === this.codeLength[i]) {
                i++;
                if (++currentRepeatCount >= maxRepeatCount) {
                    break;
                }
            }
            if (currentRepeatCount < minRepeatCount) {
                while (currentRepeatCount-- > 0) {
                    blTree.writeCodeToStream(currentCodeLength);
                }
            } else if (currentCodeLength !== 0) {
                blTree.writeCodeToStream(16);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 3, 2);
            } else if (currentRepeatCount <= 10) {
                blTree.writeCodeToStream(17);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 3, 3);
            } else {
                blTree.writeCodeToStream(18);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 11, 7);
            }
        }
    }
    /**
     * Build huffman tree
     * @returns {void}
     */
    public buildTree(): void {
        let codesCount: number = this.codeFrequency.length;
        let arrTree: Int32Array = new Int32Array(codesCount);
        let treeLength: number = 0;
        let maxCount: number = 0;
        for (let n = 0; n < codesCount; n++) {
            let freq: number = this.codeFrequency[n];
            if (freq !== 0) {
                let pos: number = treeLength++;
                let pPos: number = 0;
                while (pos > 0 && this.codeFrequency[arrTree[pPos = Math.floor((pos - 1) / 2)]] > freq) {
                    arrTree[pos] = arrTree[pPos];
                    pos = pPos;
                }
                arrTree[pos] = n;
                maxCount = n;
            }
        }
        while (treeLength < 2) {
            arrTree[treeLength++] =
                (maxCount < 2) ? ++maxCount : 0;
        }
        this.codeCount = Math.max(maxCount + 1, this.codeMinCount);
        let leafsCount: number = treeLength;
        let nodesCount: number = leafsCount;
        let child: Int32Array = new Int32Array(4 * treeLength - 2);
        let values: Int32Array = new Int32Array(2 * treeLength - 1);
        for (let i: number = 0; i < treeLength; i++) {
            let node: number = arrTree[i];
            let iIndex: number = 2 * i;
            child[iIndex] = node;
            child[iIndex + 1] = -1;
            values[i] = (this.codeFrequency[node] << 8);
            arrTree[i] = i;
        }
        this.constructHuffmanTree(arrTree, treeLength, values, nodesCount, child);
        this.buildLength(child);
    }
    private constructHuffmanTree(arrTree: Int32Array, treeLength: number, values: Int32Array, nodesCount: number, child: Int32Array): void {
        do {
            let first: number = arrTree[0];
            let last: number = arrTree[--treeLength];
            let lastVal: number = values[last];
            let pPos: number = 0;
            let path: number = 1;
            while (path < treeLength) {
                if (path + 1 < treeLength && values[arrTree[path]] > values[arrTree[path + 1]]) {
                    path++;
                }
                arrTree[pPos] = arrTree[path];
                pPos = path; path = pPos * 2 + 1;
            }
            while ((path = pPos) > 0 && values[arrTree[pPos = Math.floor((path - 1) / 2)]] > lastVal) {
                arrTree[path] = arrTree[pPos];
            }
            arrTree[path] = last;
            let second: number = arrTree[0];
            last = nodesCount++;
            child[2 * last] = first;
            child[2 * last + 1] = second;
            let minDepth: number = Math.min(values[first] & 0xff, values[second] & 0xff);
            values[last] = lastVal = values[first] + values[second] - minDepth + 1;
            pPos = 0;
            path = 1;
            /* tslint:disable */
            while (path < treeLength) {
                if (path + 1 < treeLength && values[arrTree[path]] > values[arrTree[path + 1]]) {
                    path++;
                }
                arrTree[pPos] = arrTree[path];
                pPos = path;
                path = pPos * 2 + 1;
            }            /* tslint:disable */
            while ((path = pPos) > 0 && values[arrTree[pPos = Math.floor((path - 1) / 2)]] > lastVal) {
                arrTree[path] = arrTree[pPos];
            }
            arrTree[path] = last;
        }
        while (treeLength > 1);
    }
    private buildLength(child: Int32Array): void {
        this.codeLength = new Uint8Array(this.codeFrequency.length);
        let numNodes: number = Math.floor(child.length / 2);
        let numLeafs: number = Math.floor((numNodes + 1) / 2);
        let overflow: number = 0;
        for (let i = 0; i < this.maxLength; i++) {
            this.lengthCount[i] = 0;
        }
        overflow = this.calculateOptimalCodeLength(child, overflow, numNodes);
        if (overflow === 0) {
            return;
        }
        let iIncreasableLength: number = this.maxLength - 1;
        do {
            while (this.lengthCount[--iIncreasableLength] === 0) {
                /* tslint:disable */
            }
            do {
                this.lengthCount[iIncreasableLength]--;
                this.lengthCount[++iIncreasableLength]++;
                overflow -= (1 << (this.maxLength - 1 - iIncreasableLength));
            }
            while (overflow > 0 && iIncreasableLength < this.maxLength - 1);
        }
        while (overflow > 0);
        this.recreateTree(child, overflow, numLeafs);
    }
    private recreateTree(child: Int32Array, overflow: number, numLeafs: number): void {
        this.lengthCount[this.maxLength - 1] += overflow;
        this.lengthCount[this.maxLength - 2] -= overflow;
        let nodePtr: number = 2 * numLeafs;
        for (let bits: number = this.maxLength; bits !== 0; bits--) {
            let n = this.lengthCount[bits - 1];
            while (n > 0) {
                let childPtr: number = 2 * child[nodePtr++];
                if (child[childPtr + 1] === -1) {
                    this.codeLength[child[childPtr]] = bits;
                    n--;
                }
            }
        }
    }
    private calculateOptimalCodeLength(child: Int32Array, overflow: number, numNodes: number): number {
        let lengths: Int32Array = new Int32Array(numNodes);
        lengths[numNodes - 1] = 0;
        for (let i: number = numNodes - 1; i >= 0; i--) {
            let childIndex: number = 2 * i + 1;
            if (child[childIndex] !== -1) {
                let bitLength: number = lengths[i] + 1;
                if (bitLength > this.maxLength) {
                    bitLength = this.maxLength;
                    overflow++;
                }
                lengths[child[childIndex - 1]] = lengths[child[childIndex]] = bitLength;
            } else {
                let bitLength = lengths[i];
                this.lengthCount[bitLength - 1]++;
                this.codeLength[child[childIndex - 1]] = lengths[i];
            }
        }
        return overflow
    }
}

/**
 * Checksum calculator, based on Adler32 algorithm.
 */
export class ChecksumCalculator {
    private static checkSumBitOffset: number = 16;
    private static checksumBase: number = 65521;
    private static checksumIterationCount: number = 3800;

    /**
     * Updates checksum by calculating checksum of the 
     * given buffer and adding it to current value.
     * @param {number} checksum - current checksum.
     * @param {Uint8Array} buffer - data byte array.
     * @param {number} offset - offset in the buffer.
     * @param {number} length - length of data to be used from the stream.
     * @returns {number}
     */
    public static checksumUpdate(checksum: number, buffer: Uint8Array, offset: number, length: number): number {
        let uint = new Uint32Array(1);
        uint[0] = checksum;
        let checksum_uint: number = uint[0];
        let s1 = uint[0] = checksum_uint & 65535;
        let s2 = uint[0] = checksum_uint >> ChecksumCalculator.checkSumBitOffset;

        while (length > 0) {
            let steps = Math.min(length, ChecksumCalculator.checksumIterationCount);
            length -= steps;

            while (--steps >= 0) {
                s1 = s1 + (uint[0] = (buffer[offset++] & 255));
                s2 = s2 + s1;
            }

            s1 %= ChecksumCalculator.checksumBase;
            s2 %= ChecksumCalculator.checksumBase;
        }

        checksum_uint = (s2 << ChecksumCalculator.checkSumBitOffset) | s1;
        return checksum_uint;
    }
}