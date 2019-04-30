import { Encoding, Save } from '@syncfusion/ej2-file-utils';

/**
 * array literal codes
 */
const ARR_LITERAL_CODES = new Int16Array(286);
const ARR_LITERAL_LENGTHS = new Uint8Array(286);
const ARR_DISTANCE_CODES = new Int16Array(30);
const ARR_DISTANCE_LENGTHS = new Uint8Array(30);
/**
 * represent compression stream writer
 * ```typescript
 * let compressedWriter = new CompressedStreamWriter();
 * let text: string = 'Hello world!!!';
 * compressedWriter.write(text, 0, text.length);
 * compressedWriter.close();
 * ```
 */
class CompressedStreamWriter {
    /**
     * Initializes compressor and writes ZLib header if needed.
     * @param {boolean} noWrap - optional if true, ZLib header and checksum will not be written.
     */
    constructor(noWrap) {
        this.pendingBuffer = new Uint8Array(1 << 16);
        this.pendingBufLength = 0;
        this.pendingBufCache = 0;
        this.pendingBufBitsInCache = 0;
        this.bufferPosition = 0;
        this.extraBits = 0;
        this.currentHash = 0;
        this.matchStart = 0;
        this.matchLength = 0;
        this.matchPrevAvail = false;
        this.blockStart = 0;
        this.stringStart = 0;
        this.lookAhead = 0;
        this.totalBytesIn = 0;
        this.inputOffset = 0;
        this.inputEnd = 0;
        this.windowSize = 1 << 15;
        this.windowMask = this.windowSize - 1;
        this.hashSize = 1 << 15;
        this.hashMask = this.hashSize - 1;
        this.hashShift = Math.floor((15 + 3 - 1) / 3);
        this.maxDist = this.windowSize - 262;
        this.checkSum = 1;
        this.noWrap = false;
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
     * get compressed data
     */
    get compressedData() {
        return this.stream;
    }
    get getCompressedString() {
        let compressedString = '';
        if (this.stream !== undefined) {
            for (let i = 0; i < this.stream.length; i++) {
                compressedString += String.fromCharCode.apply(null, this.stream[i]);
            }
        }
        return compressedString;
    }
    /**
     * Compresses data and writes it to the stream.
     * @param {Uint8Array} data - data to compress
     * @param {number} offset - offset in data
     * @param {number} length - length of the data
     * @returns {void}
     */
    write(data, offset, length) {
        if (data === undefined || data === null) {
            throw new Error('ArgumentException: data cannot null or undefined');
        }
        let end = offset + length;
        if (0 > offset || offset > end || end > data.length) {
            throw new Error('ArgumentOutOfRangeException: Offset or length is incorrect');
        }
        if (typeof data === 'string') {
            let encode = new Encoding(false);
            encode.type = 'Utf8';
            data = new Uint8Array(encode.getBytes(data, 0, data.length));
            end = offset + data.length;
        }
        this.inputBuffer = data;
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
    writeZLibHeader() {
        /* Initialize header.*/
        let headerDate = (8 + (7 << 4)) << 8;
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
    pendingBufferWriteShortBytes(s) {
        this.pendingBuffer[this.pendingBufLength++] = s >> 8;
        this.pendingBuffer[this.pendingBufLength++] = s;
    }
    compressData(finish) {
        let success;
        do {
            this.fillWindow();
            let canFlush = (finish && this.inputEnd === this.inputOffset);
            success = this.compressSlow(canFlush, finish);
        } while (this.pendingBufLength === 0 && success);
        return success;
    }
    compressSlow(flush, finish) {
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
            let prevMatch = this.matchStart;
            let prevLen = this.matchLength;
            if (this.lookAhead >= 3) {
                this.discardMatch();
            }
            if (prevLen >= 3 && this.matchLength <= prevLen) {
                prevLen = this.matchPreviousBest(prevMatch, prevLen);
            }
            else {
                this.matchPreviousAvailable();
            }
            if (this.bufferPosition >= (1 << 14)) {
                return this.huffmanIsFull(finish);
            }
        }
        return true;
    }
    discardMatch() {
        let hashHead = this.insertString();
        if (hashHead !== 0 && this.stringStart - hashHead <= this.maxDist && this.findLongestMatch(hashHead)) {
            if (this.matchLength <= 5 && (this.matchLength === 3 && this.stringStart - this.matchStart > 4096)) {
                this.matchLength = 3 - 1;
            }
        }
    }
    matchPreviousAvailable() {
        if (this.matchPrevAvail) {
            this.huffmanTallyLit(this.dataWindow[this.stringStart - 1] & 0xff);
        }
        this.matchPrevAvail = true;
        this.stringStart++;
        this.lookAhead--;
    }
    matchPreviousBest(prevMatch, prevLen) {
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
    lookAheadCompleted(finish) {
        if (this.matchPrevAvail) {
            this.huffmanTallyLit(this.dataWindow[this.stringStart - 1] & 0xff);
        }
        this.matchPrevAvail = false;
        this.huffmanFlushBlock(this.dataWindow, this.blockStart, this.stringStart - this.blockStart, finish);
        this.blockStart = this.stringStart;
        return false;
    }
    huffmanIsFull(finish) {
        let len = this.stringStart - this.blockStart;
        if (this.matchPrevAvail) {
            len--;
        }
        let lastBlock = (finish && this.lookAhead === 0 && !this.matchPrevAvail);
        this.huffmanFlushBlock(this.dataWindow, this.blockStart, len, lastBlock);
        this.blockStart += len;
        return !lastBlock;
    }
    fillWindow() {
        if (this.stringStart >= this.windowSize + this.maxDist) {
            this.slideWindow();
        }
        while (this.lookAhead < 262 && this.inputOffset < this.inputEnd) {
            let more = 2 * this.windowSize - this.lookAhead - this.stringStart;
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
    slideWindow() {
        this.dataWindow.set(this.dataWindow.subarray(this.windowSize, this.windowSize + this.windowSize), 0);
        this.matchStart -= this.windowSize;
        this.stringStart -= this.windowSize;
        this.blockStart -= this.windowSize;
        for (let i = 0; i < this.hashSize; ++i) {
            let m = this.hashHead[i] & 0xffff;
            this.hashHead[i] = (((m >= this.windowSize) ? (m - this.windowSize) : 0));
        }
        for (let i = 0; i < this.windowSize; i++) {
            let m = this.hashPrevious[i] & 0xffff;
            this.hashPrevious[i] = ((m >= this.windowSize) ? (m - this.windowSize) : 0);
        }
    }
    insertString() {
        let match;
        let hash = ((this.currentHash << this.hashShift) ^ this.dataWindow[this.stringStart + (3 - 1)]) & this.hashMask;
        this.hashPrevious[this.stringStart & this.windowMask] = match = this.hashHead[hash];
        this.hashHead[hash] = this.stringStart;
        this.currentHash = hash;
        return match & 0xffff;
    }
    findLongestMatch(curMatch) {
        let chainLen = 4096;
        let niceLen = 258;
        let scan = this.stringStart;
        let match;
        let bestEnd = this.stringStart + this.matchLength;
        let bestLength = Math.max(this.matchLength, 3 - 1);
        let limit = Math.max(this.stringStart - this.maxDist, 0);
        let stringEnd = this.stringStart + 258 - 1;
        let scanEnd1 = this.dataWindow[bestEnd - 1];
        let scanEnd = this.dataWindow[bestEnd];
        let data = this.dataWindow;
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
        } while ((curMatch = (this.hashPrevious[curMatch & this.windowMask] & 0xffff)) > limit && --chainLen !== 0);
        this.matchLength = Math.min(bestLength, this.lookAhead);
        return this.matchLength >= 3;
    }
    updateHash() {
        this.currentHash = (this.dataWindow[this.stringStart] << this.hashShift) ^ this.dataWindow[this.stringStart + 1];
    }
    huffmanTallyLit(literal) {
        this.arrDistances[this.bufferPosition] = 0;
        this.arrLiterals[this.bufferPosition++] = literal;
        this.treeLiteral.codeFrequencies[literal]++;
        return this.bufferPosition >= (1 << 14);
    }
    huffmanTallyDist(dist, len) {
        this.arrDistances[this.bufferPosition] = dist;
        this.arrLiterals[this.bufferPosition++] = (len - 3);
        let lc = this.huffmanLengthCode(len - 3);
        this.treeLiteral.codeFrequencies[lc]++;
        if (lc >= 265 && lc < 285) {
            this.extraBits += Math.floor((lc - 261) / 4);
        }
        let dc = this.huffmanDistanceCode(dist - 1);
        this.treeDistances.codeFrequencies[dc]++;
        if (dc >= 4) {
            this.extraBits += Math.floor((dc / 2 - 1));
        }
        return this.bufferPosition >= (1 << 14);
    }
    huffmanFlushBlock(stored, storedOffset, storedLength, lastBlock) {
        this.treeLiteral.codeFrequencies[256]++;
        this.treeLiteral.buildTree();
        this.treeDistances.buildTree();
        this.treeLiteral.calculateBLFreq(this.treeCodeLengths);
        this.treeDistances.calculateBLFreq(this.treeCodeLengths);
        this.treeCodeLengths.buildTree();
        let blTreeCodes = 4;
        for (let i = 18; i > blTreeCodes; i--) {
            if (this.treeCodeLengths.codeLengths[CompressorHuffmanTree.huffCodeLengthOrders[i]] > 0) {
                blTreeCodes = i + 1;
            }
        }
        let opt_len = 14 + blTreeCodes * 3 + this.treeCodeLengths.getEncodedLength() +
            this.treeLiteral.getEncodedLength() + this.treeDistances.getEncodedLength() + this.extraBits;
        let static_len = this.extraBits;
        for (let i = 0; i < 286; i++) {
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
        }
        else if (opt_len == static_len) {
            // Encode with static tree.
            this.pendingBufferWriteBits((1 << 1) + (lastBlock ? 1 : 0), 3);
            this.treeLiteral.setStaticCodes(ARR_LITERAL_CODES, ARR_LITERAL_LENGTHS);
            this.treeDistances.setStaticCodes(ARR_DISTANCE_CODES, ARR_DISTANCE_LENGTHS);
            this.huffmanCompressBlock();
            this.huffmanReset();
        }
        else {
            this.pendingBufferWriteBits((2 << 1) + (lastBlock ? 1 : 0), 3);
            this.huffmanSendAllTrees(blTreeCodes);
            this.huffmanCompressBlock();
            this.huffmanReset();
        }
    }
    huffmanFlushStoredBlock(stored, storedOffset, storedLength, lastBlock) {
        this.pendingBufferWriteBits((0 << 1) + (lastBlock ? 1 : 0), 3);
        this.pendingBufferAlignToByte();
        this.pendingBufferWriteShort(storedLength);
        this.pendingBufferWriteShort(~storedLength);
        this.pendingBufferWriteByteBlock(stored, storedOffset, storedLength);
        this.huffmanReset();
    }
    huffmanLengthCode(len) {
        if (len === 255) {
            return 285;
        }
        let code = 257;
        while (len >= 8) {
            code += 4;
            len >>= 1;
        }
        return code + len;
    }
    huffmanDistanceCode(distance) {
        let code = 0;
        while (distance >= 4) {
            code += 2;
            distance >>= 1;
        }
        return code + distance;
    }
    huffmanSendAllTrees(blTreeCodes) {
        this.treeCodeLengths.buildCodes();
        this.treeLiteral.buildCodes();
        this.treeDistances.buildCodes();
        this.pendingBufferWriteBits(this.treeLiteral.treeLength - 257, 5);
        this.pendingBufferWriteBits(this.treeDistances.treeLength - 1, 5);
        this.pendingBufferWriteBits(blTreeCodes - 4, 4);
        for (let rank = 0; rank < blTreeCodes; rank++) {
            this.pendingBufferWriteBits(this.treeCodeLengths.codeLengths[CompressorHuffmanTree.huffCodeLengthOrders[rank]], 3);
        }
        this.treeLiteral.writeTree(this.treeCodeLengths);
        this.treeDistances.writeTree(this.treeCodeLengths);
    }
    huffmanReset() {
        this.bufferPosition = 0;
        this.extraBits = 0;
        this.treeLiteral.reset();
        this.treeDistances.reset();
        this.treeCodeLengths.reset();
    }
    huffmanCompressBlock() {
        for (let i = 0; i < this.bufferPosition; i++) {
            let literalLen = this.arrLiterals[i] & 255;
            let dist = this.arrDistances[i];
            if (dist-- !== 0) {
                let lc = this.huffmanLengthCode(literalLen);
                this.treeLiteral.writeCodeToStream(lc);
                let bits = Math.floor((lc - 261) / 4);
                if (bits > 0 && bits <= 5) {
                    this.pendingBufferWriteBits(literalLen & ((1 << bits) - 1), bits);
                }
                let dc = this.huffmanDistanceCode(dist);
                this.treeDistances.writeCodeToStream(dc);
                bits = Math.floor(dc / 2 - 1);
                if (bits > 0) {
                    this.pendingBufferWriteBits(dist & ((1 << bits) - 1), bits);
                }
            }
            else {
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
    pendingBufferWriteBits(b, count) {
        let uint = new Uint32Array(1);
        uint[0] = this.pendingBufCache | (b << this.pendingBufBitsInCache);
        this.pendingBufCache = uint[0];
        this.pendingBufBitsInCache += count;
        this.pendingBufferFlushBits();
    }
    pendingBufferFlush(isClose) {
        this.pendingBufferFlushBits();
        if (this.pendingBufLength > 0) {
            let array = new Uint8Array(this.pendingBufLength);
            array.set(this.pendingBuffer.subarray(0, this.pendingBufLength), 0);
            this.stream.push(array);
        }
        this.pendingBufLength = 0;
    }
    pendingBufferFlushBits() {
        let result = 0;
        while (this.pendingBufBitsInCache >= 8 && this.pendingBufLength < (1 << 16)) {
            this.pendingBuffer[this.pendingBufLength++] = this.pendingBufCache;
            this.pendingBufCache >>= 8;
            this.pendingBufBitsInCache -= 8;
            result++;
        }
        return result;
    }
    pendingBufferWriteByteBlock(data, offset, length) {
        let array = data.subarray(offset, offset + length);
        this.pendingBuffer.set(array, this.pendingBufLength);
        this.pendingBufLength += length;
    }
    pendingBufferWriteShort(s) {
        this.pendingBuffer[this.pendingBufLength++] = s;
        this.pendingBuffer[this.pendingBufLength++] = (s >> 8);
    }
    pendingBufferAlignToByte() {
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
    static initHuffmanTree() {
        let i = 0;
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
    close() {
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
        } while (!(this.inputEnd === this.inputOffset) ||
            !(this.pendingBufLength === 0));
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    destroy() {
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
CompressedStreamWriter.isHuffmanTreeInitiated = false;
/**
 * represent the Huffman Tree
 */
class CompressorHuffmanTree {
    /**
     * Create new Huffman Tree
     * @param {CompressedStreamWriter} writer instance
     * @param {number} elementCount - element count
     * @param {number} minCodes - minimum count
     * @param {number} maxLength - maximum count
     */
    constructor(writer, elementCount, minCodes, maxLength) {
        this.writer = writer;
        this.codeMinCount = minCodes;
        this.maxLength = maxLength;
        this.codeFrequency = new Uint16Array(elementCount);
        this.lengthCount = new Int32Array(maxLength);
    }
    get treeLength() {
        return this.codeCount;
    }
    get codeLengths() {
        return this.codeLength;
    }
    get codeFrequencies() {
        return this.codeFrequency;
    }
    setStaticCodes(codes, lengths) {
        let temp = new Int16Array(codes.length);
        temp.set(codes, 0);
        this.codes = temp;
        let lengthTemp = new Uint8Array(lengths.length);
        lengthTemp.set(lengths, 0);
        this.codeLength = lengthTemp;
    }
    /**
     * reset all code data in tree
     * @returns {void}
     */
    reset() {
        for (let i = 0; i < this.codeFrequency.length; i++) {
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
    writeCodeToStream(code) {
        this.writer.pendingBufferWriteBits(this.codes[code] & 0xffff, this.codeLength[code]);
    }
    /**
     * calculate code from their frequencies
     * @returns {void}
     */
    buildCodes() {
        let nextCode = new Int32Array(this.maxLength);
        this.codes = new Int16Array(this.codeCount);
        let code = 0;
        for (let bitsCount = 0; bitsCount < this.maxLength; bitsCount++) {
            nextCode[bitsCount] = code;
            code += this.lengthCount[bitsCount] << (15 - bitsCount);
        }
        for (let i = 0; i < this.codeCount; i++) {
            let bits = this.codeLength[i];
            if (bits > 0) {
                this.codes[i] = CompressorHuffmanTree.bitReverse(nextCode[bits - 1]);
                nextCode[bits - 1] += 1 << (16 - bits);
            }
        }
    }
    static bitReverse(value) {
        return (CompressorHuffmanTree.reverseBits[value & 15] << 12
            | CompressorHuffmanTree.reverseBits[(value >> 4) & 15] << 8
            | CompressorHuffmanTree.reverseBits[(value >> 8) & 15] << 4
            | CompressorHuffmanTree.reverseBits[value >> 12]);
    }
    /**
     * calculate length of compressed data
     * @returns {number}
     */
    getEncodedLength() {
        let len = 0;
        for (let i = 0; i < this.codeFrequency.length; i++) {
            len += this.codeFrequency[i] * this.codeLength[i];
        }
        return len;
    }
    /**
     * calculate code frequencies
     * @param {CompressorHuffmanTree} blTree
     * @returns {void}
     */
    calculateBLFreq(blTree) {
        let maxCount;
        let minCount;
        let count;
        let curLen = -1;
        let i = 0;
        while (i < this.codeCount) {
            count = 1;
            let nextLen = this.codeLength[i];
            if (nextLen === 0) {
                maxCount = 138;
                minCount = 3;
            }
            else {
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
            }
            else if (curLen !== 0) {
                blTree.codeFrequency[16]++;
            }
            else if (count <= 10) {
                blTree.codeFrequency[17]++;
            }
            else {
                blTree.codeFrequency[18]++;
            }
        }
    }
    /**
     * @param {CompressorHuffmanTree} blTree - write tree to output stream
     * @returns {void}
     */
    writeTree(blTree) {
        let maxRepeatCount;
        let minRepeatCount;
        let currentRepeatCount;
        let currentCodeLength = -1;
        let i = 0;
        while (i < this.codeCount) {
            currentRepeatCount = 1;
            let nextLen = this.codeLength[i];
            if (nextLen === 0) {
                maxRepeatCount = 138;
                minRepeatCount = 3;
            }
            else {
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
            }
            else if (currentCodeLength !== 0) {
                blTree.writeCodeToStream(16);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 3, 2);
            }
            else if (currentRepeatCount <= 10) {
                blTree.writeCodeToStream(17);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 3, 3);
            }
            else {
                blTree.writeCodeToStream(18);
                this.writer.pendingBufferWriteBits(currentRepeatCount - 11, 7);
            }
        }
    }
    /**
     * Build huffman tree
     * @returns {void}
     */
    buildTree() {
        let codesCount = this.codeFrequency.length;
        let arrTree = new Int32Array(codesCount);
        let treeLength = 0;
        let maxCount = 0;
        for (let n = 0; n < codesCount; n++) {
            let freq = this.codeFrequency[n];
            if (freq !== 0) {
                let pos = treeLength++;
                let pPos = 0;
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
        let leafsCount = treeLength;
        let nodesCount = leafsCount;
        let child = new Int32Array(4 * treeLength - 2);
        let values = new Int32Array(2 * treeLength - 1);
        for (let i = 0; i < treeLength; i++) {
            let node = arrTree[i];
            let iIndex = 2 * i;
            child[iIndex] = node;
            child[iIndex + 1] = -1;
            values[i] = (this.codeFrequency[node] << 8);
            arrTree[i] = i;
        }
        this.constructHuffmanTree(arrTree, treeLength, values, nodesCount, child);
        this.buildLength(child);
    }
    constructHuffmanTree(arrTree, treeLength, values, nodesCount, child) {
        do {
            let first = arrTree[0];
            let last = arrTree[--treeLength];
            let lastVal = values[last];
            let pPos = 0;
            let path = 1;
            while (path < treeLength) {
                if (path + 1 < treeLength && values[arrTree[path]] > values[arrTree[path + 1]]) {
                    path++;
                }
                arrTree[pPos] = arrTree[path];
                pPos = path;
                path = pPos * 2 + 1;
            }
            while ((path = pPos) > 0 && values[arrTree[pPos = Math.floor((path - 1) / 2)]] > lastVal) {
                arrTree[path] = arrTree[pPos];
            }
            arrTree[path] = last;
            let second = arrTree[0];
            last = nodesCount++;
            child[2 * last] = first;
            child[2 * last + 1] = second;
            let minDepth = Math.min(values[first] & 0xff, values[second] & 0xff);
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
            } /* tslint:disable */
            while ((path = pPos) > 0 && values[arrTree[pPos = Math.floor((path - 1) / 2)]] > lastVal) {
                arrTree[path] = arrTree[pPos];
            }
            arrTree[path] = last;
        } while (treeLength > 1);
    }
    buildLength(child) {
        this.codeLength = new Uint8Array(this.codeFrequency.length);
        let numNodes = Math.floor(child.length / 2);
        let numLeafs = Math.floor((numNodes + 1) / 2);
        let overflow = 0;
        for (let i = 0; i < this.maxLength; i++) {
            this.lengthCount[i] = 0;
        }
        overflow = this.calculateOptimalCodeLength(child, overflow, numNodes);
        if (overflow === 0) {
            return;
        }
        let iIncreasableLength = this.maxLength - 1;
        do {
            while (this.lengthCount[--iIncreasableLength] === 0) {
                /* tslint:disable */
            }
            do {
                this.lengthCount[iIncreasableLength]--;
                this.lengthCount[++iIncreasableLength]++;
                overflow -= (1 << (this.maxLength - 1 - iIncreasableLength));
            } while (overflow > 0 && iIncreasableLength < this.maxLength - 1);
        } while (overflow > 0);
        this.recreateTree(child, overflow, numLeafs);
    }
    recreateTree(child, overflow, numLeafs) {
        this.lengthCount[this.maxLength - 1] += overflow;
        this.lengthCount[this.maxLength - 2] -= overflow;
        let nodePtr = 2 * numLeafs;
        for (let bits = this.maxLength; bits !== 0; bits--) {
            let n = this.lengthCount[bits - 1];
            while (n > 0) {
                let childPtr = 2 * child[nodePtr++];
                if (child[childPtr + 1] === -1) {
                    this.codeLength[child[childPtr]] = bits;
                    n--;
                }
            }
        }
    }
    calculateOptimalCodeLength(child, overflow, numNodes) {
        let lengths = new Int32Array(numNodes);
        lengths[numNodes - 1] = 0;
        for (let i = numNodes - 1; i >= 0; i--) {
            let childIndex = 2 * i + 1;
            if (child[childIndex] !== -1) {
                let bitLength = lengths[i] + 1;
                if (bitLength > this.maxLength) {
                    bitLength = this.maxLength;
                    overflow++;
                }
                lengths[child[childIndex - 1]] = lengths[child[childIndex]] = bitLength;
            }
            else {
                let bitLength = lengths[i];
                this.lengthCount[bitLength - 1]++;
                this.codeLength[child[childIndex - 1]] = lengths[i];
            }
        }
        return overflow;
    }
}
CompressorHuffmanTree.reverseBits = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
CompressorHuffmanTree.huffCodeLengthOrders = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
/**
 * Checksum calculator, based on Adler32 algorithm.
 */
class ChecksumCalculator {
    /**
     * Updates checksum by calculating checksum of the
     * given buffer and adding it to current value.
     * @param {number} checksum - current checksum.
     * @param {Uint8Array} buffer - data byte array.
     * @param {number} offset - offset in the buffer.
     * @param {number} length - length of data to be used from the stream.
     * @returns {number}
     */
    static checksumUpdate(checksum, buffer, offset, length) {
        let uint = new Uint32Array(1);
        uint[0] = checksum;
        let checksum_uint = uint[0];
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
ChecksumCalculator.checkSumBitOffset = 16;
ChecksumCalculator.checksumBase = 65521;
ChecksumCalculator.checksumIterationCount = 3800;

const CRC32TABLE = [];
/**
 * class provide compression library
 * ```typescript
 * let archive = new ZipArchive();
 * archive.compressionLevel = 'Normal';
 * let archiveItem = new ZipArchiveItem(archive, 'directoryName\fileName.txt');
 * archive.addItem(archiveItem);
 * archive.save(fileName.zip);
 * ```
 */
class ZipArchive {
    /**
     * gets compression level
     */
    get compressionLevel() {
        return this.level;
    }
    /**
     * sets compression level
     */
    set compressionLevel(level) {
        this.level = level;
    }
    /**
     * gets items count
     */
    get length() {
        if (this.files === undefined) {
            return 0;
        }
        return this.files.length;
    }
    /**
     * constructor for creating ZipArchive instance
     */
    constructor() {
        if (CRC32TABLE.length === 0) {
            ZipArchive.initCrc32Table();
        }
        this.files = [];
        this.level = 'Normal';
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }
    /**
     * add new item to archive
     * @param {ZipArchiveItem} item - item to be added
     * @returns {void}
     */
    addItem(item) {
        if (item === null || item === undefined) {
            throw new Error('ArgumentException: item cannot be null or undefined');
        }
        for (let i = 0; i < this.files.length; i++) {
            let file = this.files[i];
            if (file instanceof ZipArchiveItem) {
                if (file.name === item.name) {
                    throw new Error('item with same name already exist');
                }
            }
        }
        this.files.push(item);
    }
    /**
     * add new directory to archive
     * @param directoryName directoryName to be created
     * @returns {void}
     */
    addDirectory(directoryName) {
        if (directoryName === null || directoryName === undefined) {
            throw new Error('ArgumentException: string cannot be null or undefined');
        }
        if (directoryName.length === 0) {
            throw new Error('ArgumentException: string cannot be empty');
        }
        if (directoryName.slice(-1) !== '/') {
            directoryName += '/';
        }
        if (this.files.indexOf(directoryName) !== -1) {
            throw new Error('item with same name already exist');
        }
        this.files.push(directoryName);
    }
    /**
     * gets item at specified index
     * @param {number} index - item index
     * @returns {ZipArchiveItem}
     */
    getItem(index) {
        if (index >= 0 && index < this.files.length) {
            return this.files[index];
        }
        return undefined;
    }
    /**
     * determines whether an element is in the collection
     * @param {string | ZipArchiveItem} item - item to search
     * @returns {boolean}
     */
    contains(item) {
        return this.files.indexOf(item) !== -1 ? true : false;
    }
    /**
     * save archive with specified file name
     * @param {string} fileName save archive with specified file name
     * @returns {Promise<ZipArchive>}
     */
    save(fileName) {
        if (fileName === null || fileName === undefined || fileName.length === 0) {
            throw new Error('ArgumentException: fileName cannot be null or undefined');
        }
        if (this.files.length === 0) {
            throw new Error('InvalidOperation');
        }
        let zipArchive = this;
        let promise;
        return promise = new Promise((resolve, reject) => {
            zipArchive.saveInternal(fileName, false).then(() => {
                resolve(zipArchive);
            });
        });
    }
    /**
     * Save archive as blob
     * @return {Promise<Blob>}
     */
    saveAsBlob() {
        let zipArchive = this;
        let promise;
        return promise = new Promise((resolve, reject) => {
            zipArchive.saveInternal('', true).then((blob) => {
                resolve(blob);
            });
        });
    }
    saveInternal(fileName, skipFileSave) {
        let zipArchive = this;
        let promise;
        return promise = new Promise((resolve, reject) => {
            let zipData = [];
            let dirLength = 0;
            for (let i = 0; i < zipArchive.files.length; i++) {
                let compressedObject = this.getCompressedData(this.files[i]);
                compressedObject.then((data) => {
                    dirLength = zipArchive.constructZippedObject(zipData, data, dirLength, data.isDirectory);
                    if (zipData.length === zipArchive.files.length) {
                        let blob = zipArchive.writeZippedContent(fileName, zipData, dirLength, skipFileSave);
                        resolve(blob);
                    }
                });
            }
        });
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    destroy() {
        if (this.files !== undefined && this.files.length > 0) {
            for (let i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                if (file instanceof ZipArchiveItem) {
                    file.destroy();
                }
                file = undefined;
            }
            this.files = [];
        }
        this.files = undefined;
        this.level = undefined;
    }
    getCompressedData(item) {
        let zipArchive = this;
        let promise = new Promise((resolve, reject) => {
            if (item instanceof ZipArchiveItem) {
                let reader = new FileReader();
                reader.onload = () => {
                    let input = new Uint8Array(reader.result);
                    let data = {
                        fileName: item.name, crc32Value: 0, compressedData: [],
                        compressedSize: undefined, uncompressedDataSize: input.length, compressionType: undefined,
                        isDirectory: false
                    };
                    if (zipArchive.level === 'Normal') {
                        zipArchive.compressData(input, data, CRC32TABLE);
                        let length = 0;
                        for (let i = 0; i < data.compressedData.length; i++) {
                            length += data.compressedData[i].length;
                        }
                        data.compressedSize = length;
                        data.compressionType = '\x08\x00'; //Deflated = 8
                    }
                    else {
                        data.compressedSize = input.length;
                        data.crc32Value = zipArchive.calculateCrc32Value(0, input, CRC32TABLE);
                        data.compressionType = '\x00\x00'; // Stored = 0
                        data.compressedData.push(input);
                    }
                    resolve(data);
                };
                reader.readAsArrayBuffer(item.data);
            }
            else {
                let data = {
                    fileName: item, crc32Value: 0, compressedData: '', compressedSize: 0, uncompressedDataSize: 0,
                    compressionType: '\x00\x00', isDirectory: true
                };
                resolve(data);
            }
        });
        return promise;
    }
    compressData(input, data, crc32Table) {
        let compressor = new CompressedStreamWriter(true);
        let currentIndex = 0;
        let nextIndex = 0;
        do {
            if (currentIndex >= input.length) {
                compressor.close();
                break;
            }
            nextIndex = Math.min(input.length, currentIndex + 16384);
            let subArray = input.subarray(currentIndex, nextIndex);
            data.crc32Value = this.calculateCrc32Value(data.crc32Value, subArray, crc32Table);
            compressor.write(subArray, 0, nextIndex - currentIndex);
            currentIndex = nextIndex;
        } while (currentIndex <= input.length);
        data.compressedData = compressor.compressedData;
        compressor.destroy();
    }
    constructZippedObject(zipParts, data, dirLength, isDirectory) {
        let extFileAttr = 0;
        let date = new Date();
        if (isDirectory) {
            extFileAttr = extFileAttr | 0x00010; // directory flag
        }
        extFileAttr = extFileAttr | (0 & 0x3F);
        let header = this.writeHeader(data, date);
        let localHeader = 'PK\x03\x04' + header + data.fileName;
        let centralDir = this.writeCentralDirectory(data, header, dirLength, extFileAttr);
        zipParts.push({ localHeader: localHeader, centralDir: centralDir, compressedData: data });
        return dirLength + localHeader.length + data.compressedSize;
    }
    writeHeader(data, date) {
        let zipHeader = '';
        zipHeader += '\x0A\x00' + '\x00\x00'; // version needed to extract & general purpose bit flag
        zipHeader += data.compressionType; // compression method Deflate=8,Stored=0
        zipHeader += this.getBytes(this.getModifiedTime(date), 2); // last modified Time
        zipHeader += this.getBytes(this.getModifiedDate(date), 2); // last modified date
        zipHeader += this.getBytes(data.crc32Value, 4); // crc-32 value
        zipHeader += this.getBytes(data.compressedSize, 4); // compressed file size
        zipHeader += this.getBytes(data.uncompressedDataSize, 4); // uncompressed file size
        zipHeader += this.getBytes(data.fileName.length, 2); // file name length
        zipHeader += this.getBytes(0, 2); // extra field length
        return zipHeader;
    }
    writeZippedContent(fileName, zipData, localDirLen, skipFileSave) {
        let cenDirLen = 0;
        let buffer = [];
        for (let i = 0; i < zipData.length; i++) {
            let item = zipData[i];
            cenDirLen += item.centralDir.length;
            buffer.push(this.getArrayBuffer(item.localHeader));
            while (item.compressedData.compressedData.length) {
                buffer.push(item.compressedData.compressedData.shift().buffer);
            }
        }
        for (let i = 0; i < zipData.length; i++) {
            buffer.push(this.getArrayBuffer(zipData[i].centralDir));
        }
        buffer.push(this.getArrayBuffer(this.writeFooter(zipData, cenDirLen, localDirLen)));
        let blob = new Blob(buffer, { type: 'application/zip' });
        if (!skipFileSave) {
            Save.save(fileName, blob);
        }
        return blob;
    }
    writeCentralDirectory(data, localHeader, offset, externalFileAttribute) {
        let directoryHeader = 'PK\x01\x02' +
            this.getBytes(0x0014, 2) + localHeader + // inherit from file header
            this.getBytes(0, 2) + // comment length
            '\x00\x00' + '\x00\x00' + // internal file attributes 
            this.getBytes(externalFileAttribute, 4) + // external file attributes
            this.getBytes(offset, 4) + // local fileHeader relative offset
            data.fileName;
        return directoryHeader;
    }
    writeFooter(zipData, centralLength, localLength) {
        let dirEnd = 'PK\x05\x06' + '\x00\x00' + '\x00\x00' +
            this.getBytes(zipData.length, 2) + this.getBytes(zipData.length, 2) +
            this.getBytes(centralLength, 4) + this.getBytes(localLength, 4) +
            this.getBytes(0, 2);
        return dirEnd;
    }
    getArrayBuffer(input) {
        let a = new Uint8Array(input.length);
        for (let j = 0; j < input.length; ++j) {
            a[j] = input.charCodeAt(j) & 0xFF;
        }
        return a.buffer;
    }
    getBytes(value, offset) {
        let bytes = '';
        for (let i = 0; i < offset; i++) {
            bytes += String.fromCharCode(value & 0xff);
            value = value >>> 8;
        }
        return bytes;
    }
    getModifiedTime(date) {
        let modTime = date.getHours();
        modTime = modTime << 6;
        modTime = modTime | date.getMinutes();
        modTime = modTime << 5;
        return modTime = modTime | date.getSeconds() / 2;
    }
    getModifiedDate(date) {
        let modiDate = date.getFullYear() - 1980;
        modiDate = modiDate << 4;
        modiDate = modiDate | (date.getMonth() + 1);
        modiDate = modiDate << 5;
        return modiDate = modiDate | date.getDate();
    }
    calculateCrc32Value(crc32Value, input, crc32Table) {
        crc32Value ^= -1;
        for (let i = 0; i < input.length; i++) {
            crc32Value = (crc32Value >>> 8) ^ crc32Table[(crc32Value ^ input[i]) & 0xFF];
        }
        return (crc32Value ^ (-1));
    }
    /**
     * construct cyclic redundancy code table
     * @private
     */
    static initCrc32Table() {
        let i;
        for (let j = 0; j < 256; j++) {
            i = j;
            for (let k = 0; k < 8; k++) {
                i = ((i & 1) ? (0xEDB88320 ^ (i >>> 1)) : (i >>> 1));
            }
            CRC32TABLE[j] = i;
        }
    }
}
/**
 * Class represent unique ZipArchive item
 * ```typescript
 * let archiveItem = new ZipArchiveItem(archive, 'directoryName\fileName.txt');
 * ```
 */
class ZipArchiveItem {
    /**
     * Get the name of archive item
     * @returns string
     */
    get name() {
        return this.fileName;
    }
    /**
     * Set the name of archive item
     * @param  {string} value
     */
    set name(value) {
        this.fileName = value;
    }
    /**
     * constructor for creating {ZipArchiveItem} instance
     * @param {Blob|ArrayBuffer} data file data
     * @param {itemName} itemName absolute file path
     */
    constructor(data, itemName) {
        if (data === null || data === undefined) {
            throw new Error('ArgumentException: data cannot be null or undefined');
        }
        if (itemName === null || itemName === undefined) {
            throw new Error('ArgumentException: string cannot be null or undefined');
        }
        if (itemName.length === 0) {
            throw new Error('string cannot be empty');
        }
        this.data = data;
        this.name = itemName;
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    destroy() {
        this.fileName = undefined;
        this.data = undefined;
    }
}

/**
 * export ZipArchive class
 */

export { ZipArchive, ZipArchiveItem, CompressedStreamWriter, CompressorHuffmanTree, ChecksumCalculator };
//# sourceMappingURL=ej2-compression.es2015.js.map
