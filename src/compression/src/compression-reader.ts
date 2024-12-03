/* eslint-disable */
import { DecompressorHuffmanTree } from './decompressor-huffman-tree';
import { Utils } from './utils';
import { ChecksumCalculator } from './checksum-calculator';
export class CompressedStreamReader {
    private static readonly DEF_REVERSE_BITS: Uint8Array = new Uint8Array([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]);

    /// <summary>
    /// Code lengths for the code length alphabet.
    /// </summary>
    public defaultHuffmanDynamicTree: number[] = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    /// <summary>
    /// Mask for compression method to be decoded from 16-bit header.
    /// </summary>
    private DEF_HEADER_METHOD_MASK: number = 15 << 8;
    /// <summary>
    /// Mask for compression info to be decoded from 16-bit header.
    /// </summary>
    private DEF_HEADER_INFO_MASK: number = 240 << 8;
    /// <summary>
    /// Mask for check bits to be decoded from 16-bit header.
    /// </summary>
    private DEF_HEADER_FLAGS_FCHECK: number = 31;
    /// <summary>
    /// Mask for dictionary presence to be decoded from 16-bit header.
    /// </summary>
    private DEF_HEADER_FLAGS_FDICT: number = 32;
    /// <summary>
    /// Mask for compression level to be decoded from 16-bit header.
    /// </summary>
    private DEF_HEADER_FLAGS_FLEVEL: number = 192;

    /// <summary>
    /// Minimum count of repetions.
    /// </summary>
    private static readonly DEF_HUFFMAN_DYNTREE_REPEAT_MINIMUMS: number[] = [3, 3, 11];

    /// <summary>
    /// Bits, that responds for different repetion modes.
    /// </summary>
    private static readonly DEF_HUFFMAN_DYNTREE_REPEAT_BITS: number[] = [2, 3, 7];

    /// <summary>
    /// Maximum size of the data window.
    /// </summary>
    private DEF_MAX_WINDOW_SIZE: number = 65535;

    /// <summary>
    /// Length bases.
    /// </summary>
    private static readonly DEF_HUFFMAN_REPEAT_LENGTH_BASE: number[] =
    [
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
        35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258
    ];

    /// <summary>
    /// Length extended bits count.
    /// </summary>
    private static readonly DEF_HUFFMAN_REPEAT_LENGTH_EXTENSION: number[] =
    [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
        3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0
    ];

    /// <summary>
    /// Distance bases.
    /// </summary>
    private static readonly DEF_HUFFMAN_REPEAT_DISTANCE_BASE: number[] =
    [
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
        257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
        8193, 12289, 16385, 24577
    ];

    /// <summary>
    /// Distance extanded bits count.
    /// </summary>
    private static readonly DEF_HUFFMAN_REPEAT_DISTANCE_EXTENSION: number[] =
    [
        0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
        7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
        12, 12, 13, 13
    ];

    /// <summary>
    /// Maximum length of the repeatable block.
    /// </summary>
    private DEF_HUFFMAN_REPEATE_MAX: number = 258;
    /// <summary>
    /// End of the block sign.
    /// </summary>
    private DEF_HUFFMAN_END_BLOCK: number = 256;
    /// <summary>
    /// Minimal length code.
    /// </summary>
    private DEF_HUFFMAN_LENGTH_MINIMUMCODE: number = 257;
    /// <summary>
    /// Maximal length code.
    /// </summary>
    private DEF_HUFFMAN_LENGTH_MAXIMUMCODE: number = 285;
    /// <summary>
    /// Maximal distance code.
    /// </summary>
    private DEF_HUFFMAN_DISTANCE_MAXIMUMCODE: number = 29;

    /// <summary>
    /// Input stream.
    /// </summary>
    private mInputStream: Stream;

    /// <summary>
    /// Currently calculated checksum,
    /// based on Adler32 algorithm.
    /// </summary>
    private mCheckSum: number = 1;

    /// <summary>
    /// Currently read 4 bytes.
    /// </summary>
    private tBuffer: number = 0;
    public get mBuffer(): number {
        return this.tBuffer;
    }
    public set mBuffer(value: number) {
        this.tBuffer = value;
    }

    /// <summary>
    /// Count of bits that are in buffer.
    /// </summary>
    private mBufferedBits: number = 0;

    /// <summary>
    /// Temporary buffer.
    /// </summary>
    private mTempBuffer: Uint8Array = new Uint8Array(4);

    /// <summary>
    /// 32k buffer for unpacked data.
    /// </summary>
    private mBlockBuffer: Uint8Array = new Uint8Array(this.DEF_MAX_WINDOW_SIZE);

    /// <summary>
    /// No wrap mode.
    /// </summary>
    private mbNoWrap: boolean = false;

    /// <summary>
    /// Window size, can not be larger than 32k.
    /// </summary>
    private mWindowSize: number = 0;

    /// <summary>
    /// Current position in output stream.
    /// Current in-block position can be extracted by applying Int16.MaxValue mask.
    /// </summary>
    private mCurrentPosition: number = 0;

    /// <summary>
    /// Data length.
    /// Current in-block position can be extracted by applying Int16.MaxValue mask.
    /// </summary>
    private mDataLength: number = 0;

    /// <summary>
    /// Sign of uncompressed data reading.
    /// </summary>
    private mbReadingUncompressed: boolean;

    /// <summary>
    /// Size of the block with uncompressed data.
    /// </summary>
    private mUncompressedDataLength: number;

    /// <summary>
    /// Specifies wheather next block can to be read.
    /// Reading can be denied because the header of the last block have been read.
    /// </summary>
    private mbCanReadNextBlock: boolean = true;

    /// <summary>
    /// Specifies wheather user can read more data from stream.
    /// </summary>
    private mbCanReadMoreData: boolean = true;

    /// <summary>
    /// Current lengths huffman tree.
    /// </summary>
    private mCurrentLengthTree: DecompressorHuffmanTree;

    /// <summary>
    /// Current distances huffman tree.
    /// </summary>
    private mCurrentDistanceTree: DecompressorHuffmanTree;

    /// <summary>
    /// Specifies wheather checksum has been read.
    /// </summary>
    private mbCheckSumRead: boolean = false;
    /**
     * Initializes compressor and writes ZLib header if needed.
     * @param {boolean} noWrap - optional if true, ZLib header and checksum will not be written.
     */



    /// <summary>
    /// Reads specified count of bits without adjusting position.
    /// </summary>
    /// <param name="count">Count of bits to be read.</param>
    /// <returns>Read value.</returns>
    public peekBits(count: number): number {
        if (count < 0) {
            throw new DOMException('count', 'Bits count can not be less than zero.');
        }

        if (count > 32) {
            throw new DOMException('count', 'Count of bits is too large.');
        }

        // If buffered data is not enough to give result,
        // fill buffer.
        if (this.mBufferedBits < count) {
            this.fillBuffer();
        }

        // If you want to read 4 bytes and there is partial data in
        // buffer, than you will fail.
        if (this.mBufferedBits < count) {
            return -1;
        }

        // Create bitmask for reading of count bits
        const bitMask: number = ~(4294967295 << count);

        const result: number = Utils.bitConverterUintToInt32(this.mBuffer & bitMask);

        //Debug.WriteLine( /*new string( ' ', 32 - mBufferedBits + (int)( ( 32 - mBufferedBits ) / 8 ) ) + BitsToString( (int)mBuffer, mBufferedBits ) + " " + BitsToString( result, count ) +*/ " " + result.ToString() );

        return result;
    }
    protected fillBuffer(): void {
        const length: number = 4 - (this.mBufferedBits >> 3) -
            (((this.mBufferedBits & 7) !== 0) ? 1 : 0);

        if (length === 0) {
            return;
        }
        //TODO: fix this
        const bytesRead: number = this.mInputStream.read(this.mTempBuffer, 0, length);
        for (let i: number = 0; i < bytesRead; i++) {
            this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer |
                (Utils.bitConverterInt32ToUint(this.mTempBuffer[i] << this.mBufferedBits)));
            this.mBufferedBits += 8;
        }
        //TODO: fix this
    }
    /// <summary>
    /// Skips specified count of bits.
    /// </summary>
    /// <param name="count">Count of bits to be skipped.</param>
    public skipBits(count: number): void {
        if (count < 0) {
            throw new DOMException('count', 'Bits count can not be less than zero.');
        }

        if (count === 0) {
            return;
        }

        if (count >= this.mBufferedBits) {
            count -= this.mBufferedBits;
            this.mBufferedBits = 0;
            this.mBuffer = 0;

            // if something left, skip it.
            if (count > 0) {
                // Skip entire bytes.
                this.mInputStream.position += (count >> 3); //TODO: fix this
                count &= 7;

                // Skip bits.
                if (count > 0) {
                    this.fillBuffer();
                    this.mBufferedBits -= count;
                    this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer >>> count);
                }
            }
        }
        else {
            this.mBufferedBits -= count;
            this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer >>> count);
        }
    }
    public get availableBits(): number {
        return this.mBufferedBits;

    }

    constructor(stream: Uint8Array, bNoWrap: boolean) {

        if (stream == null) {
            throw new DOMException('stream');
        }

        if (stream.length === 0) {
            throw new DOMException('stream - string can not be empty');
        }

        DecompressorHuffmanTree.init();

        this.mInputStream = new Stream(stream);
        this.mbNoWrap = bNoWrap;

        if (!this.mbNoWrap) {
            this.readZLibHeader();
        }

        this.decodeBlockHeader();
    }

    /// <summary>
    /// Reads ZLib header with compression method and flags.
    /// </summary>
    protected readZLibHeader(): void {
        // first 8 bits - compression Method and flags
        // 8 other - flags
        const header: number = this.readInt16();

        //Debug.WriteLine( BitsToString( header ) );

        if (header === -1) {
            throw new DOMException('Header of the stream can not be read.');
        }

        if (header % 31 !== 0) {
            throw new DOMException('Header checksum illegal');
        }

        if ((header & this.DEF_HEADER_METHOD_MASK) !== (8 << 8)) {
            throw new DOMException('Unsupported compression method.');
        }

        this.mWindowSize = Math.pow(2, ((header & this.DEF_HEADER_INFO_MASK) >> 12) + 8);

        if (this.mWindowSize > 65535) {
            throw new DOMException('Unsupported window size for deflate compression method.');
        }

        if ((header & this.DEF_HEADER_FLAGS_FDICT) >> 5 === 1) {
            // Get dictionary.
            throw new DOMException('Custom dictionary is not supported at the moment.');
        }

    }
    /// <summary>
    /// TODO: place correct comment here
    /// </summary>
    /// <returns>
    /// TODO: place correct comment here
    /// </returns>
    protected readInt16(): number {
        let result: number = (this.readBits(8) << 8);
        result |= this.readBits(8);
        return result;
    }
    /// <summary>
    /// Reads specified count of bits from stream.
    /// </summary>
    /// <param name="count">Count of bits to be read.</param>
    /// <returns>
    /// TODO: place correct comment here
    /// </returns>
    protected readBits(count: number): number {
        const result: number = this.peekBits(count);

        if (result === -1) {
            return -1;
        }

        this.mBufferedBits -= count;
        this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer >>> count);
        return result;
    }
    /// <summary>
    /// Reads and decodes block of data.
    /// </summary>
    /// <returns>True if buffer was empty and new data was read, otherwise - False.</returns>
    protected decodeBlockHeader(): boolean {
        if (!this.mbCanReadNextBlock) {
            return false;
        }

        const bFinalBlock: number = this.readBits(1);
        if (bFinalBlock === -1) {
            return false;
        }

        const blockType: number = this.readBits(2);
        if (blockType === -1) {
            return false;
        }

        this.mbCanReadNextBlock = (bFinalBlock === 0);
        //      ChecksumReset();

        switch (blockType) {
        case 0:
            // Uncompressed data
            this.mbReadingUncompressed = true;

            this.skipToBoundary();
            const length: number = this.readInt16Inverted();
            const lengthComplement: number = this.readInt16Inverted();

            if (length !== (lengthComplement ^ 0xffff)) {
                throw new DOMException('Wrong block length.');
            }

            if (length > 65535) {
                throw new DOMException('Uncompressed block length can not be more than 65535.');
            }

            this.mUncompressedDataLength = length;
            this.mCurrentLengthTree = null;
            this.mCurrentDistanceTree = null;
            break;

        case 1:
            // Compressed data with fixed huffman codes.
            this.mbReadingUncompressed = false;
            this.mUncompressedDataLength = -1;
            this.mCurrentLengthTree = DecompressorHuffmanTree.lengthTree;
            this.mCurrentDistanceTree = DecompressorHuffmanTree.distanceTree;
            break;

        case 2:
            // Compressed data with dynamic huffman codes.
            this.mbReadingUncompressed = false;
            this.mUncompressedDataLength = -1;
            const trees: any = this.decodeDynamicHeader(this.mCurrentLengthTree, this.mCurrentDistanceTree);
            this.mCurrentLengthTree = trees.lengthTree;
            this.mCurrentDistanceTree = trees.distanceTree;
            break;

        default:
            throw new DOMException('Wrong block type.');
        }

        return true;
    }
    /// <summary>
    /// Discards left-most partially used byte.
    /// </summary>
    protected skipToBoundary(): void {
        this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer >>> (this.mBufferedBits & 7));
        this.mBufferedBits &= ~7;
    }
    /// <summary>
    /// TODO: place correct comment here
    /// </summary>
    /// <returns>
    /// TODO: place correct comment here
    /// </returns>
    protected readInt16Inverted(): number {
        let result: number = (this.readBits(8));
        result |= this.readBits(8) << 8;
        return result;
    }
    /// <summary>
    /// Reades dynamic huffman codes from block header.
    /// </summary>
    /// <param name="lengthTree">Literals/Lengths tree.</param>
    /// <param name="distanceTree">Distances tree.</param>
    protected decodeDynamicHeader(lengthTree: DecompressorHuffmanTree, distanceTree: DecompressorHuffmanTree): any {
        let bLastSymbol: number = 0;
        let iLengthsCount: number = this.readBits(5);
        let iDistancesCount: number = this.readBits(5);
        let iCodeLengthsCount: number = this.readBits(4);

        if (iLengthsCount < 0 || iDistancesCount < 0 || iCodeLengthsCount < 0) {
            throw new DOMException('Wrong dynamic huffman codes.');
        }

        iLengthsCount += 257;
        iDistancesCount += 1;

        const iResultingCodeLengthsCount: number = iLengthsCount + iDistancesCount;
        const arrResultingCodeLengths: Uint8Array = new Uint8Array(iResultingCodeLengthsCount);
        const arrDecoderCodeLengths: Uint8Array = new Uint8Array(19);
        iCodeLengthsCount += 4;
        let iCurrentCode: number = 0;

        while (iCurrentCode < iCodeLengthsCount) {
            const len: number = this.readBits(3);

            if (len < 0) {
                throw new DOMException('Wrong dynamic huffman codes.');
            }

            arrDecoderCodeLengths[this.defaultHuffmanDynamicTree[iCurrentCode++]] = len;
        }

        const treeInternalDecoder: DecompressorHuffmanTree = new DecompressorHuffmanTree(arrDecoderCodeLengths);

        iCurrentCode = 0;

        for (; ;) {
            let symbol: number;
            let bNeedBreak: boolean = false;
            symbol = treeInternalDecoder.unpackSymbol(this);
            while ((symbol & ~15) === 0) {
                arrResultingCodeLengths[iCurrentCode++] = bLastSymbol = symbol;

                if (iCurrentCode === iResultingCodeLengthsCount) {
                    bNeedBreak = true;
                    break;
                }
                symbol = treeInternalDecoder.unpackSymbol(this);
            }

            if (bNeedBreak) {
                break;
            }

            if (symbol < 0) {
                throw new DOMException('Wrong dynamic huffman codes.');
            }

            if (symbol >= 17) {
                bLastSymbol = 0;
            }
            else if (iCurrentCode === 0) {
                throw new DOMException('Wrong dynamic huffman codes.');
            }

            const miRepSymbol: number = symbol - 16;
            const bits: number = CompressedStreamReader.DEF_HUFFMAN_DYNTREE_REPEAT_BITS[miRepSymbol];

            let count: number = this.readBits(bits);

            if (count < 0) {
                throw new DOMException('Wrong dynamic huffman codes.');
            }

            count += CompressedStreamReader.DEF_HUFFMAN_DYNTREE_REPEAT_MINIMUMS[miRepSymbol];

            if (iCurrentCode + count > iResultingCodeLengthsCount) {
                throw new DOMException('Wrong dynamic huffman codes.');
            }

            while (count-- > 0) {
                arrResultingCodeLengths[iCurrentCode++] = bLastSymbol;
            }

            if (iCurrentCode === iResultingCodeLengthsCount) {
                break;
            }
        }

        let tempArray: Uint8Array = new Uint8Array(iLengthsCount);

        tempArray.set(arrResultingCodeLengths.subarray(0, iLengthsCount), 0);
        //sourceArray, sourceIndex, destinationArray, destinationIndex, length
        //Array.copy( arrResultingCodeLengths, 0, tempArray, 0, iLengthsCount );
        lengthTree = new DecompressorHuffmanTree(tempArray);

        tempArray = arrResultingCodeLengths.slice(iLengthsCount, iLengthsCount + iDistancesCount);

        //Array.copy( arrResultingCodeLengths, iLengthsCount, tempArray, 0, iDistancesCount );
        distanceTree = new DecompressorHuffmanTree(tempArray);
        return { 'lengthTree': lengthTree, 'distanceTree': distanceTree };
    }
    /// <summary>
    /// Decodes huffman codes.
    /// </summary>
    /// <returns>True if some data was read.</returns>
    private readHuffman(): boolean {
        let free: number = this.DEF_MAX_WINDOW_SIZE - (this.mDataLength - this.mCurrentPosition);
        let dataRead: boolean = false;
        //long maxdistance = DEF_MAX_WINDOW_SIZE >> 1;
        const readdata: any = {};
        // DEF_HUFFMAN_REPEATE_MAX - longest repeatable block, we should always reserve space for it because
        // if we should not, we will have buffer overrun.
        while (free >= this.DEF_HUFFMAN_REPEATE_MAX) {
            let symbol: number;
            symbol = this.mCurrentLengthTree.unpackSymbol(this);
            // Only codes 0..255 are valid independent symbols.
            while (((symbol) & ~0xff) === 0) {
                readdata[(this.mDataLength + 1) % this.DEF_MAX_WINDOW_SIZE] = symbol;
                this.mBlockBuffer[this.mDataLength++ % this.DEF_MAX_WINDOW_SIZE] = symbol;
                dataRead = true;

                if (--free < this.DEF_HUFFMAN_REPEATE_MAX) {
                    return true;
                }

                //if( (mDataLength - mCurrentPosition ) < maxdistance ) return true;
                symbol = this.mCurrentLengthTree.unpackSymbol(this);
            }

            if (symbol < this.DEF_HUFFMAN_LENGTH_MINIMUMCODE) {
                if (symbol < this.DEF_HUFFMAN_END_BLOCK) {
                    throw new DOMException('Illegal code.');
                }
                const numDataRead: number = dataRead ? 1 : 0;
                this.mbCanReadMoreData = this.decodeBlockHeader();
                const numReadMore: number = (this.mbCanReadMoreData) ? 1 : 0;
                return (numDataRead | numReadMore) ? true : false;
            }

            if (symbol > this.DEF_HUFFMAN_LENGTH_MAXIMUMCODE) {
                throw new DOMException('Illegal repeat code length.');
            }

            let iRepeatLength: number = CompressedStreamReader.DEF_HUFFMAN_REPEAT_LENGTH_BASE[symbol -
                this.DEF_HUFFMAN_LENGTH_MINIMUMCODE];

            let iRepeatExtraBits: number = CompressedStreamReader.DEF_HUFFMAN_REPEAT_LENGTH_EXTENSION[symbol -
                this.DEF_HUFFMAN_LENGTH_MINIMUMCODE];

            if (iRepeatExtraBits > 0) {
                const extra: number = this.readBits(iRepeatExtraBits);

                if (extra < 0) {
                    throw new DOMException('Wrong data.');
                }

                iRepeatLength += extra;
            }

            // Unpack repeat distance.
            symbol = this.mCurrentDistanceTree.unpackSymbol(this);

            if (symbol < 0 || symbol > CompressedStreamReader.DEF_HUFFMAN_REPEAT_DISTANCE_BASE.length) {
                throw new DOMException('Wrong distance code.');
            }

            let iRepeatDistance: number = CompressedStreamReader.DEF_HUFFMAN_REPEAT_DISTANCE_BASE[symbol];
            iRepeatExtraBits = CompressedStreamReader.DEF_HUFFMAN_REPEAT_DISTANCE_EXTENSION[symbol];

            if (iRepeatExtraBits > 0) {
                const extra: number = this.readBits(iRepeatExtraBits);

                if (extra < 0) {
                    throw new DOMException('Wrong data.');
                }

                iRepeatDistance += extra;
            }

            // Copy data in slow repeat mode
            for (let i: number = 0; i < iRepeatLength; i++) {
                this.mBlockBuffer[this.mDataLength % this.DEF_MAX_WINDOW_SIZE] =
                    this.mBlockBuffer[(this.mDataLength - iRepeatDistance) % this.DEF_MAX_WINDOW_SIZE];
                this.mDataLength++;
                free--;
            }

            dataRead = true;

        }

        return dataRead;
    }
    /// <summary>
    /// Reads data to buffer.
    /// </summary>
    /// <param name="buffer">Output buffer for data.</param>
    /// <param name="offset">Offset in output data.</param>
    /// <param name="length">Length of the data to be read.</param>
    /// <returns>Count of bytes actually read.</returns>
    public read(buffer: Uint8Array, offset: number, length: number): number {
        if (buffer == null) {
            throw new DOMException('buffer');
        }

        if (offset < 0 || offset > buffer.length - 1) {
            throw new DOMException('offset', 'Offset does not belong to specified buffer.');
        }

        if (length < 0 || length > buffer.length - offset) {
            throw new DOMException('length', 'Length is illegal.');
        }

        const initialLength: number = length;

        while (length > 0) {
            // Read from internal buffer.
            if (this.mCurrentPosition < this.mDataLength) {
                // Position in buffer array.
                const inBlockPosition: number = (this.mCurrentPosition % this.DEF_MAX_WINDOW_SIZE);
                // We can not read more than we have in buffer at once,
                // and we not read more than till the array end.
                let dataToCopy: number = Math.min(this.DEF_MAX_WINDOW_SIZE - inBlockPosition, (this.mDataLength - this.mCurrentPosition));
                // Reading not more, than the rest of the buffer.
                dataToCopy = Math.min(dataToCopy, length);





                //sourceArray, sourceIndex, destinationArray, destinationIndex, length
                // Copy data.
                //Array.Copy( mBlockBuffer, inBlockPosition, buffer, offset, dataToCopy );
                //buffer.set(this.mBlockBuffer.slice(inBlockPosition, dataToCopy), offset);
Utils.arrayCopy(this.mBlockBuffer, inBlockPosition, buffer, offset, dataToCopy);
                // Correct position, length,
                this.mCurrentPosition += dataToCopy;
                offset += dataToCopy;
                length -= dataToCopy;
            }
            else {


                if (!this.mbCanReadMoreData) {
                    break;
                }

                const oldDataLength: number = this.mDataLength;

                if (!this.mbReadingUncompressed) {
                    if (!this.readHuffman()) {
                        break;
                    }
                }
                else {
                    if (this.mUncompressedDataLength === 0) {
                        // If there is no more data in stream, just exit.
                        this.mbCanReadMoreData = this.decodeBlockHeader();
                        if (!(this.mbCanReadMoreData)) {
                            break;
                        }
                    }
                    else {
                        // Position of the data end in block buffer.
                        const inBlockPosition: number = (this.mDataLength % this.DEF_MAX_WINDOW_SIZE);
                        const dataToRead: number = Math.min(this.mUncompressedDataLength, this.DEF_MAX_WINDOW_SIZE - inBlockPosition);
                        const dataRead: number = this.readPackedBytes(this.mBlockBuffer, inBlockPosition, dataToRead);

                        if (dataToRead !== dataRead) {
                            throw new DOMException('Not enough data in stream.');
                        }

                        this.mUncompressedDataLength -= dataRead;

                        this.mDataLength += dataRead;
                    }
                }


                if (oldDataLength < this.mDataLength) {
                    const start: number = (oldDataLength % this.DEF_MAX_WINDOW_SIZE);
                    const end: number = (this.mDataLength % this.DEF_MAX_WINDOW_SIZE);

                    if (start < end) {
                        this.checksumUpdate(this.mBlockBuffer, start, end - start);
                    }
                    else {
                        this.checksumUpdate(this.mBlockBuffer, start, this.DEF_MAX_WINDOW_SIZE - start);

                        if (end > 0) {
                            this.checksumUpdate(this.mBlockBuffer, 0, end);
                        }
                    }
                }
            }
        }

        if (!this.mbCanReadMoreData && !this.mbCheckSumRead && !this.mbNoWrap) {
            this.skipToBoundary();
            const checkSum: number = this.readInt32();

            //Debug.Assert( checkSum == mCheckSum, "" );
            if (checkSum !== this.mCheckSum) {
                throw new DOMException('Checksum check failed.');
            }

            this.mbCheckSumRead = true;
        }

        return initialLength - length;
    }
    /// <summary>
    /// Reads array of bytes.
    /// </summary>
    /// <param name="buffer">Output buffer.</param>
    /// <param name="offset">Offset in output buffer.</param>
    /// <param name="length">Length of the data to be read.</param>
    /// <returns>Count of bytes actually read to the buffer.</returns>
    protected readPackedBytes(buffer: Uint8Array, offset: number, length: number): number {
        if (buffer == null) {
            throw new DOMException('buffer');
        }

        if (offset < 0 || offset > buffer.length - 1) {
            throw new DOMException('offset", "Offset can not be less than zero or greater than buffer length - 1.');
        }

        if (length < 0) {
            throw new DOMException('length", "Length can not be less than zero.');
        }

        if (length > buffer.length - offset) {
            throw new DOMException('length", "Length is too large.');
        }

        if ((this.mBufferedBits & 7) !== 0) {
            throw new DOMException('Reading of unalligned data is not supported.');
        }

        if (length === 0) {
            return 0;
        }

        let result: number = 0;

        while (this.mBufferedBits > 0 && length > 0) {
            buffer[offset++] = (this.mBuffer);
            this.mBufferedBits -= 8;
            this.mBuffer = Utils.bitConverterInt32ToUint(this.mBuffer >>> 8);
            length--;
            result++;
        }

        if (length > 0) {
            //TODO: Fix this.
            result += this.mInputStream.read(buffer, offset, length);
        }

        return result;
    }
    /// <summary>
    /// TODO: place correct comment here
    /// </summary>
    /// <returns>
    /// TODO: place correct comment here
    /// </returns>
    protected readInt32(): number {
        let result: number = this.readBits(8) << 24;
        result |= this.readBits(8) << 16;
        result |= this.readBits(8) << 8;
        result |= this.readBits(8);
        return result;
    }
    /// <summary>
    /// Updates checksum by calculating checksum of the
    /// given buffer and adding it to current value.
    /// </summary>
    /// <param name="buffer">Data byte array.</param>
    /// <param name="offset">Offset in the buffer.</param>
    /// <param name="length">Length of data to be used from the stream.</param>
    protected checksumUpdate(buffer: Uint8Array, offset: number, length: number): void {
        ChecksumCalculator.ChecksumUpdate(this.mCheckSum, buffer, offset, length);
    }
}


export class Stream {
    public inputStream: Uint8Array;
    public get length(): number {
        return this.inputStream.buffer.byteLength;
    }
    public position: number = 0;

    constructor(input: Uint8Array) {
        this.inputStream = new Uint8Array(input.buffer);
    }

  public read(buffer: Uint8Array, start: number, length: number): number {
    let temp: Uint8Array = new Uint8Array(this.inputStream.buffer, this.position + start);
    let data: Uint8Array = temp.subarray(0, length);
    buffer.set(data, 0);
    this.position += data.byteLength;
    return data.byteLength;
  }
  public readByte(): number {
    return this.inputStream[this.position++];
  }
  public write(inputBuffer: Uint8Array, offset: number, count: number): void {
    Utils.arrayCopy(inputBuffer, 0, this.inputStream, this.position + offset, count)
    // this.inputStream = new Uint8Array(this.inputStream.buffer, this.position + offset);
    // this.inputStream.set(inputBuffer, offset);
    this.position += count;
  }
  public toByteArray(): Uint8Array {
    return new Uint8Array(this.inputStream.buffer);
  }
}
/* eslint-enable */