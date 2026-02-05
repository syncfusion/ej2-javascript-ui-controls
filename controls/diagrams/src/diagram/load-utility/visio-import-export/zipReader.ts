/**
 * Represents a file entry within a ZIP archive.
 * Contains metadata about a single file stored in the ZIP container.
 *
 * @typedef {Object} ZipEntry
 * @property {string} name - The file path/name within the ZIP archive
 * @property {number} uncompressedSize - Size of the file when decompressed (in bytes)
 * @property {number} compressedSize - Size of the file as stored in the ZIP (in bytes)
 * @property {number} compression - Compression method used (0=stored, 8=deflate)
 * @property {number} offset - Byte offset of the local file header in the ZIP archive
 */
export type ZipEntry = {
    readonly name: string;
    readonly uncompressedSize: number;
    readonly compressedSize: number;
    readonly compression: number;
    readonly offset: number;
};

/**
 * Configuration constants for ZIP format parsing.
 * Defines all magic numbers and sizes used in ZIP file structure according to RFC 1952.
 * These values are standardized by the ZIP specification and must not be changed.
 *
 * @const {Object} ZIP_CONSTANTS
 * @property {number} LOCAL_FILE_HEADER_SIG - Signature for local file headers (0x04034b50 = "PK\x03\x04")
 * @property {number} CENTRAL_DIR_SIG - Signature for central directory records (0x02014b50 = "PK\x01\x02")
 * @property {number} EOCD_SIG - Signature for End of Central Directory record (0x06054b50 = "PK\x05\x06")
 * @property {number} EOCD_MIN_SIZE - Minimum size of EOCD record without comment (22 bytes)
 * @property {number} LOCAL_HEADER_SIZE - Fixed size of local file header before variable fields (30 bytes)
 * @property {number} CENTRAL_DIR_SIZE - Fixed size of central directory header before variable fields (46 bytes)
 * @property {number} COMPRESSION_STORED - Compression method: no compression (0)
 * @property {number} COMPRESSION_DEFLATE - Compression method: DEFLATE compression (8)
 */
const ZIP_CONSTANTS: Readonly<{
    LOCAL_FILE_HEADER_SIG: number;
    CENTRAL_DIR_SIG: number;
    EOCD_SIG: number;
    EOCD_MIN_SIZE: number;
    LOCAL_HEADER_SIZE: number;
    CENTRAL_DIR_SIZE: number;
    COMPRESSION_STORED: number;
    COMPRESSION_DEFLATE: number;
}> = {
    LOCAL_FILE_HEADER_SIG: 0x04034b50,
    CENTRAL_DIR_SIG: 0x02014b50,
    EOCD_SIG: 0x06054b50,
    EOCD_MIN_SIZE: 22,
    LOCAL_HEADER_SIZE: 30,
    CENTRAL_DIR_SIZE: 46,
    COMPRESSION_STORED: 0,
    COMPRESSION_DEFLATE: 8
};

/**
 * Deflate decompression constants.
 * Defines all constants used in DEFLATE (RFC 1951) compression/decompression algorithm.
 * These values are specified in RFC 1951 and RFC 1952 and must not be changed.
 *
 * @const {Object} DEFLATE_CONSTANTS
 * @property {number} BLOCK_TYPE_STORED - Block type: uncompressed data (0)
 * @property {number} BLOCK_TYPE_FIXED - Block type: Huffman codes are fixed (1)
 * @property {number} BLOCK_TYPE_DYNAMIC - Block type: Huffman codes are provided in the stream (2)
 * @property {number} LITERAL_END_OF_BLOCK - Special symbol indicating end of literal/length sequence (256)
 * @property {number} LENGTH_BASE_INDEX - Base symbol value for length codes (257)
 * @property {number} MAX_BIT_READ - Maximum bits that can be read in one operation (32)
 * @property {number} HUFFMAN_REPEAT_CODE_16 - Special code for repeating previous code length (16)
 * @property {number} HUFFMAN_REPEAT_CODE_17 - Special code for repeating zero 3-10 times (17)
 * @property {number} HUFFMAN_REPEAT_CODE_18 - Special code for repeating zero 11-138 times (18)
 * @property {number} REPEAT_16_BITS - Number of extra bits to read for repeat code 16 (2 bits)
 * @property {number} REPEAT_17_BITS - Number of extra bits to read for repeat code 17 (3 bits)
 * @property {number} REPEAT_18_BITS - Number of extra bits to read for repeat code 18 (7 bits)
 * @property {number} REPEAT_16_MIN - Minimum repetitions for repeat code 16 (3)
 * @property {number} REPEAT_17_MIN - Minimum repetitions for repeat code 17 (3)
 * @property {number} REPEAT_18_MIN - Minimum repetitions for repeat code 18 (11)
 * @property {number} CODE_LEN_ORDER_SIZE - Size of code length order array (19 elements)
 * @property {number} FIXED_LIT_LEN_TABLE_SIZE - Size of fixed literal/length Huffman table (288 symbols)
 * @property {number} FIXED_DIST_TABLE_SIZE - Size of fixed distance Huffman table (32 symbols)
 * @property {number} FIXED_LIT_LEN_144_END - End index for 8-bit codes in fixed table (144)
 * @property {number} FIXED_LIT_LEN_256_END - End index for 9-bit codes in fixed table (256)
 * @property {number} FIXED_LIT_LEN_280_END - End index for 7-bit codes in fixed table (280)
 */
const DEFLATE_CONSTANTS: Readonly<{
    BLOCK_TYPE_STORED: number;
    BLOCK_TYPE_FIXED: number;
    BLOCK_TYPE_DYNAMIC: number;
    LITERAL_END_OF_BLOCK: number;
    LENGTH_BASE_INDEX: number;
    MAX_BIT_READ: number;
    HUFFMAN_REPEAT_CODE_16: number;
    HUFFMAN_REPEAT_CODE_17: number;
    HUFFMAN_REPEAT_CODE_18: number;
    REPEAT_16_BITS: number;
    REPEAT_17_BITS: number;
    REPEAT_18_BITS: number;
    REPEAT_16_MIN: number;
    REPEAT_17_MIN: number;
    REPEAT_18_MIN: number;
    CODE_LEN_ORDER_SIZE: number;
    FIXED_LIT_LEN_TABLE_SIZE: number;
    FIXED_DIST_TABLE_SIZE: number;
    FIXED_LIT_LEN_144_END: number;
    FIXED_LIT_LEN_256_END: number;
    FIXED_LIT_LEN_280_END: number;
}> = {
    BLOCK_TYPE_STORED: 0,
    BLOCK_TYPE_FIXED: 1,
    BLOCK_TYPE_DYNAMIC: 2,
    LITERAL_END_OF_BLOCK: 256,
    LENGTH_BASE_INDEX: 257,
    MAX_BIT_READ: 32,
    HUFFMAN_REPEAT_CODE_16: 16,
    HUFFMAN_REPEAT_CODE_17: 17,
    HUFFMAN_REPEAT_CODE_18: 18,
    REPEAT_16_BITS: 2,
    REPEAT_17_BITS: 3,
    REPEAT_18_BITS: 7,
    REPEAT_16_MIN: 3,
    REPEAT_17_MIN: 3,
    REPEAT_18_MIN: 11,
    CODE_LEN_ORDER_SIZE: 19,
    FIXED_LIT_LEN_TABLE_SIZE: 288,
    FIXED_DIST_TABLE_SIZE: 32,
    FIXED_LIT_LEN_144_END: 144,
    FIXED_LIT_LEN_256_END: 256,
    FIXED_LIT_LEN_280_END: 280
};

/**
 * Minimal ZIP reader for extracting VSDX files (which are ZIP archives).
 * Handles both stored (uncompressed) and deflate-compressed entries.
 *
 * This class provides core functionality to:
 * - Parse ZIP file structure and locate the central directory
 * - Extract metadata about all files in the archive
 * - Decompress file entries using DEFLATE algorithm or retrieve stored data
 *
 * The implementation follows the ZIP file format specification (RFC 1952) and
 * is optimized for parsing VSDX (Visio) files which are ZIP containers.
 *
 * @example
 * const zipData = await fetch('document.vsdx').then(r => r.arrayBuffer());
 * const reader = new MinimalZipReader(zipData);
 * const entries = reader.getEntries();
 * const xmlContent = await reader.extract(entries[0]);
 */
export class MinimalZipReader {
    /** @private @type {Uint8Array} The raw ZIP file data as a byte array */
    private readonly data: Uint8Array;

    /**
     * Creates a new MinimalZipReader instance.
     * Accepts either an ArrayBuffer or Uint8Array containing ZIP file data.
     *
     * @constructor
     * @param {ArrayBuffer | Uint8Array} data - The ZIP file data to read
     * @throws Does not throw, but subsequent operations may fail if data is invalid
     *
     * @example
     * const reader1 = new MinimalZipReader(arrayBuffer);
     * const reader2 = new MinimalZipReader(uint8Array);
     */
    constructor(data: ArrayBuffer | Uint8Array) {
        this.data = data instanceof Uint8Array ? data : new Uint8Array(data);
    }

    /**
     * Retrieves all file entries from the ZIP archive.
     * Parses the central directory to extract metadata about each file.
     *
     * Algorithm:
     * 1. Locate the End of Central Directory (EOCD) record at the end of the file
     * 2. Read the central directory offset and number of entries from EOCD
     * 3. Iterate through each central directory record and extract file metadata
     * 4. Build ZipEntry objects with name, sizes, compression method, and offset
     *
     * Security checks:
     * - Validates EOCD signature and structure
     * - Checks all offsets are within file bounds
     * - Validates central directory signatures
     * - Checks filename lengths don't exceed available data
     * - Detects infinite loops from malformed data
     *
     * @private
     * @returns {ZipEntry[]} Array of ZipEntry objects describing each file in the archive
     *                       Returns empty array if EOCD not found or file is invalid
     *
     * @example
     * const reader = new MinimalZipReader(zipData);
     * const entries = reader.getEntries();
     * console.log(`Archive contains ${entries.length} files`);
     * entries.forEach(entry => {
     *     console.log(`${entry.name}: ${entry.uncompressedSize} bytes`);
     * });
     */
    public getEntries(): ZipEntry[] {
        const entries: ZipEntry[] = [];
        const eocdOffset: number = this.findEndOfCentralDirectory();

        // EOCD not found - file is not a valid ZIP
        if (eocdOffset < 0) {
            console.warn('End of Central Directory (EOCD) not found in ZIP file');
            return [];
        }

        // Create DataView for efficient reading of multi-byte values in little-endian format
        const view: DataView = new DataView(
            this.data.buffer,
            this.data.byteOffset,
            this.data.byteLength
        );

        // Validate EOCD structure has minimum required size (22 bytes)
        if (eocdOffset + ZIP_CONSTANTS.EOCD_MIN_SIZE > this.data.byteLength) {
            console.warn('Invalid EOCD: insufficient data');
            return [];
        }

        // Extract central directory metadata from EOCD record
        // Offset 10 (from EOCD start): total number of central directory records (uint16)
        // Offset 16 (from EOCD start): offset of central directory start (uint32)
        const cdRecords: number = view.getUint16(eocdOffset + 10, true);
        const cdOffset: number = view.getUint32(eocdOffset + 16, true);

        // Validate central directory offset is within file bounds
        if (cdOffset >= this.data.byteLength) {
            console.warn('Invalid central directory offset');
            return [];
        }

        let ptr: number = cdOffset;

        // Process each central directory record
        for (let i: number = 0; i < cdRecords; i++) {
            // Validate bounds: ensure entire central directory header is available
            // Central directory fixed size is 46 bytes before variable fields
            if (ptr + ZIP_CONSTANTS.CENTRAL_DIR_SIZE > this.data.byteLength) {
                console.warn(`Central directory record ${i} exceeds file bounds`);
                break;
            }

            // Validate central directory signature (0x50 0x4B 0x01 0x02 = "PK\x01\x02")
            // Each central directory record MUST start with this 4-byte signature
            if (!this.validateSignature(ptr, [0x50, 0x4b, 0x01, 0x02])) {
                console.warn(`Central directory signature not found at offset ${ptr}`);
                break;
            }

            // Extract fields from central directory record header
            // All offsets are relative to the start of the central directory record
            const compression: number = view.getUint16(ptr + 10, true);           // Compression method
            const compressedSize: number = view.getUint32(ptr + 20, true);        // Compressed size
            const uncompressedSize: number = view.getUint32(ptr + 24, true);      // Uncompressed size
            const nameLen: number = view.getUint16(ptr + 28, true);               // Filename length
            const extraLen: number = view.getUint16(ptr + 30, true);              // Extra field length
            const commentLen: number = view.getUint16(ptr + 32, true);            // File comment length
            const localHeaderOffset: number = view.getUint32(ptr + 42, true);     // Local header offset

            // Validate filename length and ensure it doesn't exceed available data
            // The filename immediately follows the central directory header
            if (
                ptr + ZIP_CONSTANTS.CENTRAL_DIR_SIZE + nameLen >
                this.data.byteLength
            ) {
                console.warn(`Invalid filename length at offset ${ptr}`);
                break;
            }

            // Extract and decode the filename from the archive
            // Filename is stored as UTF-8 encoded bytes immediately after the header
            const nameBytes: Uint8Array = this.data.subarray(
                ptr + ZIP_CONSTANTS.CENTRAL_DIR_SIZE,
                ptr + ZIP_CONSTANTS.CENTRAL_DIR_SIZE + nameLen
            );

            const name: string = this.decodeUtf8(nameBytes);

            // Create ZipEntry object with extracted metadata
            entries.push({
                name,
                uncompressedSize,
                compressedSize,
                compression,
                offset: localHeaderOffset
            });

            // Calculate offset of next central directory record
            // Records are variable-length: header (46) + filename + extra field + comment
            const nextPtr: number =
                ptr + ZIP_CONSTANTS.CENTRAL_DIR_SIZE + nameLen + extraLen + commentLen;

            // Prevent infinite loop if record size is invalid (zero or negative)
            if (nextPtr <= ptr) {
                console.warn(`Invalid record size at offset ${ptr}, stopping parse`);
                break;
            }

            ptr = nextPtr;
        }

        return entries;
    }

    /**
     * Extracts and decompresses the content of a ZIP entry.
     * Handles both stored (uncompressed) and DEFLATE-compressed data.
     *
     * Algorithm:
     * 1. Validate entry offset and bounds
     * 2. Verify local file header signature and structure
     * 3. Skip over filename and extra fields to reach compressed data
     * 4. Validate compressed data bounds within archive
     * 5. Route to appropriate decompression based on compression method:
     *    - Stored: return data as-is (no decompression needed)
     *    - DEFLATE: decompress using inflateRaw() function
     * 6. Return decompressed data as Uint8Array
     *
     * @private
     * @async
     * @param {ZipEntry} entry - The ZipEntry object describing the file to extract
     * @returns {Promise<Uint8Array>} Promise resolving to decompressed file data
     * @throws {Error} if entry offset is invalid
     * @throws {Error} if local file header is missing or corrupt
     * @throws {Error} if compressed data bounds are invalid
     * @throws {Error} if compression method is not supported
     * @throws {Error} if DEFLATE decompression fails
     *
     * @example
     * const entry = entries.find(e => e.name === 'document.xml');
     * const data = await reader.extract(entry);
     * const text = new TextDecoder().decode(data);
     */
    public async extract(entry: ZipEntry): Promise<Uint8Array> {
        // Validate entry offset is within file bounds
        if (entry.offset >= this.data.byteLength || entry.offset < 0) {
            throw new Error(
                `Invalid entry offset ${entry.offset} for entry ${entry.name}`
            );
        }

        // Create DataView for efficient multi-byte reading in little-endian format
        const view: DataView = new DataView(
            this.data.buffer,
            this.data.byteOffset,
            this.data.byteLength
        );

        const ptr: number = entry.offset;

        // Validate local file header exists and has minimum required size (30 bytes)
        // Local file header is the fixed-size portion before variable fields
        if (ptr + ZIP_CONSTANTS.LOCAL_HEADER_SIZE > this.data.byteLength) {
            throw new Error(
                `Insufficient data for local file header at offset ${ptr} for entry ${entry.name}`
            );
        }

        // Validate local file header signature (0x50 0x4B 0x03 0x04 = "PK\x03\x04")
        // Each local file header MUST start with this 4-byte signature
        if (!this.validateSignature(ptr, [0x50, 0x4b, 0x03, 0x04])) {
            throw new Error(
                `Invalid local file header signature at offset ${ptr} for entry ${entry.name}`
            );
        }

        // Extract variable field lengths from local file header
        // These fields come after the fixed 30-byte header
        const nameLen: number = view.getUint16(ptr + 26, true);     // Filename length
        const extraLen: number = view.getUint16(ptr + 28, true);    // Extra field length

        // Calculate where compressed file data starts in the archive
        // Data starts after: local header (30) + filename + extra field
        const dataStart: number =
            ptr + ZIP_CONSTANTS.LOCAL_HEADER_SIZE + nameLen + extraLen;

        // Validate compressed data bounds to prevent integer overflow and out-of-bounds access
        // This check ensures: start >= 0 AND (start + size) <= fileSize
        if (dataStart < 0 || dataStart + entry.compressedSize > this.data.byteLength) {
            throw new Error(
                `Invalid compressed data bounds for entry ${entry.name}: ` +
                `start=${dataStart}, size=${entry.compressedSize}, fileSize=${this.data.byteLength}`
            );
        }

        // Extract compressed file data as a subarray (no copy)
        // This creates a view into the same underlying ArrayBuffer
        const fileData: Uint8Array = this.data.subarray(
            dataStart,
            dataStart + entry.compressedSize
        );

        // Decompress based on compression method specified in entry metadata
        switch (entry.compression) {
        case ZIP_CONSTANTS.COMPRESSION_DEFLATE: {
            // DEFLATE compression method (value 8)
            // Implements RFC 1951 DEFLATE format without zlib wrapper
            return inflateRaw(fileData);
        }

        case ZIP_CONSTANTS.COMPRESSION_STORED: {
            // Stored method: no compression applied (value 0)
            // Data is stored raw and uncompressed - return as-is
            return fileData;
        }

        default: {
            throw new Error(
                `Unsupported compression method ${entry.compression} for entry ${entry.name}`
            );
        }
        }
    }

    /**
     * Finds the End of Central Directory (EOCD) record within the ZIP file.
     * Searches backwards from the end of file since EOCD must be at the end.
     *
     * Algorithm:
     * 1. Calculate search range: last 65535+22 bytes (max ZIP comment size + min EOCD size)
     * 2. Search backwards byte-by-byte for EOCD signature
     * 3. Return offset of first EOCD signature found
     *
     * ZIP Specification Details:
     * - EOCD signature is 4 bytes: 0x50 0x4B 0x05 0x06 ("PK\x05\x06")
     * - EOCD must appear within last 65535+22 bytes due to max comment length
     * - Only the first EOCD found (searching backwards) is considered valid
     *
     * @private
     * @returns {number} Byte offset of EOCD in the file, or -1 if not found
     *
     * @example
     * const offset = this.findEndOfCentralDirectory();
     * if (offset >= 0) {
     *     console.log(`EOCD found at byte ${offset}`);
     * }
     */
    private findEndOfCentralDirectory(): number {
        // EOCD signature is 4 bytes: 0x50 0x4B 0x05 0x06 ("PK\x05\x06")
        // EOCD must be within last 65535 + 22 bytes of file
        // (65535 = maximum ZIP comment length, 22 = minimum EOCD record size)
        const startPos: number = Math.max(
            0,
            this.data.length - ZIP_CONSTANTS.EOCD_MIN_SIZE - 65535
        );

        // Search backwards from near the end of file
        // We search backwards because EOCD is always at the end of a valid ZIP
        for (let i: number = this.data.length - ZIP_CONSTANTS.EOCD_MIN_SIZE; i >= startPos; i--) {
            // Check if EOCD signature is found at this position
            if (this.validateSignature(i, [0x50, 0x4b, 0x05, 0x06])) {
                return i;
            }
        }

        // EOCD not found - file is not a valid ZIP archive
        return -1;
    }

    /**
     * Validates a signature (magic bytes) at a given offset in the data.
     * Used to verify ZIP structural markers throughout the file.
     *
     * Purpose:
     * - Verify ZIP signatures: local headers, central directory, EOCD
     * - Detect file corruption or invalid ZIP structures
     * - Ensure we're reading valid ZIP records at expected locations
     *
     * @private
     * @param {number} offset - The byte offset to check in the data array
     * @param {number[]} expectedBytes - The expected signature bytes to match
     * @returns {boolean} True if signature matches exactly, false otherwise
     *
     * @example
     * const isValid = this.validateSignature(0, [0x50, 0x4b, 0x03, 0x04]);
     * // Returns true if file starts with "PK\x03\x04" (local file header)
     */
    private validateSignature(offset: number, expectedBytes: number[]): boolean {
        // Bounds check: offset must be non-negative and have enough bytes for signature
        if (offset < 0 || offset + expectedBytes.length > this.data.length) {
            return false;
        }

        // Check if every byte at the offset matches the expected signature
        // Uses every() for short-circuit evaluation - stops on first mismatch
        return expectedBytes.every((byte: number, index: number) =>
            this.data[offset + index] === byte
        );
    }

    /**
     * Decodes UTF-8 encoded bytes to a JavaScript string.
     * Used to parse filenames and text data from the ZIP archive.
     *
     * Implementation:
     * - Uses TextDecoder API with UTF-8 encoding
     * - Provides proper error handling for invalid UTF-8 sequences
     * - Wraps platform-provided decoder with error context
     *
     * @private
     * @param {Uint8Array} bytes - The UTF-8 encoded byte sequence to decode
     * @returns {string} Decoded JavaScript string
     * @throws {Error} if UTF-8 decoding fails or bytes are malformed
     *
     * @example
     * const nameBytes = new Uint8Array([0x64, 0x6F, 0x63, 0x75, 0x6D, 0x65, 0x6E, 0x74, 0x2E, 0x78, 0x6D, 0x6C]);
     * const name = this.decodeUtf8(nameBytes);  // "document.xml"
     */
    private decodeUtf8(bytes: Uint8Array): string {
        try {
            // Use browser/Node.js TextDecoder API to convert UTF-8 bytes to string
            // The 'utf-8' encoding handles multi-byte UTF-8 sequences correctly
            return new TextDecoder('utf-8').decode(bytes);
        } catch (error) {
            throw new Error(
                `Failed to decode UTF-8: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

}

/**
 * Bit reader for reading DEFLATE compressed data bit-by-bit.
 * Maintains an internal bit buffer for efficient sub-byte level operations.
 *
 * Purpose:
 * - Read bits in arbitrary quantities (1 bit up to 32 bits)
 * - Handle little-endian bit order as specified in DEFLATE (RFC 1951)
 * - Efficiently buffer bytes from input stream to minimize lookups
 *
 * Internal State:
 * - `bits`: Current bit buffer containing accumulated bits
 * - `nbits`: Number of valid bits currently in the buffer
 * - `pos`: Current position in the input byte array
 *
 * Bit Order:
 * - DEFLATE uses LSB (least significant bit) first order
 * - First bit read is the lowest bit of the first byte
 *
 * @private
 *
 * @example
 * const reader = new BitReader(compressedData);
 * const finalBlock = reader.readBits(1);        // Read 1 bit
 * const blockType = reader.readBits(2);         // Read 2 bits
 * const symbolCode = reader.readBits(9);        // Read 9 bits
 */
class BitReader {
    /** @private @type {Uint8Array} The compressed data to read bits from */
    private readonly data: Uint8Array;

    /** @private @type {number} Current position (byte index) in the data array */
    private pos: number = 0;

    /** @private @type {number} Bit buffer holding accumulated bits from data */
    private bits: number = 0;

    /** @private @type {number} Number of valid bits currently in the bit buffer */
    private nbits: number = 0;

    /**
     * Creates a new BitReader instance.
     * Initializes reader to start reading from the beginning of the data.
     *
     * @constructor
     * @param {Uint8Array} data - The byte array containing compressed DEFLATE data
     *
     * @example
     * const reader = new BitReader(compressedData);
     */
    constructor(data: Uint8Array) {
        this.data = data;
    }

    /**
     * Reads a specified number of bits from the bit stream.
     * Automatically buffers additional bytes as needed to fulfill the read.
     *
     * Algorithm:
     * 1. Validate requested bit count is within valid range (0-32)
     * 2. Fill bit buffer by reading bytes from data until buffer has enough bits
     * 3. Extract the requested number of bits from the buffer
     * 4. Update buffer state for next read
     *
     * Bit ordering follows DEFLATE spec (RFC 1951):
     * - Bits are read LSB first from each byte
     * - Multiple bytes are combined with earlier bytes in lower-order positions
     *
     * @private
     * @param {number} n - Number of bits to read (must be 0-32)
     * @returns {number} The bits read as an unsigned integer (0 to 2^n - 1)
     * @throws {Error} if n is outside valid range (0-32)
     * @throws {Error} if insufficient data available to read requested bits
     *
     * @example
     * const byte = reader.readBits(8);       // Read 1 byte (8 bits)
     * const flags = reader.readBits(3);      // Read 3 bits
     * const code = reader.readBits(9);       // Read 9 bits
     */
    public readBits(n: number): number {
        // Validate bit count is in valid range (0-32)
        if (n < 0 || n > DEFLATE_CONSTANTS.MAX_BIT_READ) {
            throw new Error(`Invalid bit count: ${n}`);
        }

        // Accumulate bits from data stream into bit buffer until we have enough
        // Each byte from data provides 8 bits to the buffer
        while (this.nbits < n && this.pos < this.data.length) {
            // Read next byte from data and shift it into the bit buffer
            // The byte is placed in the upper positions of the buffer
            this.bits |= this.data[this.pos] << this.nbits;
            this.pos += 1;
            this.nbits += 8;
        }

        // Verify we now have enough bits to satisfy the request
        if (this.nbits < n) {
            throw new Error(
                `Insufficient bits available: need ${n}, have ${this.nbits}`
            );
        }

        // Extract n least significant bits from the buffer
        // Mask: (1 << n) - 1 creates a mask with n bits set to 1
        const val: number = this.bits & ((1 << n) - 1);

        // Shift the buffer right to remove the bits we just read
        // This prepares the buffer for the next read
        this.bits >>>= n;

        // Update bit count to reflect removed bits
        this.nbits -= n;

        return val;
    }

    /**
     * Checks if there are more bits to read from the stream.
     * Returns true if either:
     * - Unread bytes remain in the data array, OR
     * - The bit buffer contains buffered bits
     *
     * @private
     * @returns {boolean} True if more data is available to read, false if stream is exhausted
     *
     * @example
     * while (reader.hasMore()) {
     *     const bit = reader.readBits(1);
     *     // process bit
     * }
     */
    public hasMore(): boolean {
        return this.pos < this.data.length || this.nbits > 0;
    }

    /**
     * Aligns the bit reader to the next byte boundary.
     * Discards any remaining bits in the current byte that haven't been read.
     *
     * Usage:
     * - Used between DEFLATE blocks to reset bit alignment
     * - Required before reading stored block byte lengths
     * - Ensures proper alignment for byte-level operations
     *
     * Algorithm:
     * - If buffer has partial bits (1-7 bits), shift them out
     * - Reset bit count to zero for next byte read
     * - Does nothing if buffer is already byte-aligned (0 bits)
     *
     * @private
     * @returns {void}
     *
     * @example
     * reader.readBits(3);          // Read 3 bits
     * reader.alignToByte();        // Skip to next byte boundary
     * const byte = reader.readBits(8);  // Now reading from new byte
     */
    public alignToByte(): void {
        // If we have partial bits (less than a full byte), discard them
        if (this.nbits > 0 && this.nbits < 8) {
            // Shift out the partial bits by moving buffer pointer
            this.bits >>>= this.nbits;
            this.nbits = 0;
        }
    }
}

/**
 * Huffman tree node for decoding DEFLATE compressed data.
 * Contains lookup tables optimized for fast canonical Huffman decoding.
 *
 * Structure:
 * - `lengths`: Original code lengths array for reference
 * - `maxBits`: Maximum code length in bits
 * - `symbolsByLength`: Array of symbol arrays, grouped by code length
 * - `firstCodeByLength`: First valid code value for each bit length
 *
 * This structure enables O(maxBits) decoding time by allowing
 * bit-by-bit code matching without storing the full Huffman tree.
 *
 * @private
 * @interface HuffmanNode
 *
 * @example
 * const huffman = buildHuffman([8, 9, 7, 8, ...]);
 * const symbol = decodeSymbol(bitReader, huffman);
 */
interface HuffmanNode {
    /** @type {number[]} Original code lengths for each symbol */
    readonly lengths: number[];

    /** @type {number} Maximum code length in bits (1-15 for DEFLATE) */
    readonly maxBits: number;

    /** @type {number[][]} Symbols grouped by their code length for efficient lookup */
    readonly symbolsByLength: number[][];

    /** @type {number[]} First code value for each bit length */
    readonly firstCodeByLength: number[];
}

/**
 * Builds a canonical Huffman tree from an array of code lengths.
 * Uses the algorithm specified in RFC 1951 Section 3.2.2.
 *
 * Algorithm Overview:
 * 1. Count number of codes for each bit length
 * 2. Compute initial code value for each bit length using bit counts
 * 3. Group symbols by their code length for fast lookup during decoding
 *
 * This creates a canonical Huffman table where codes can be decoded
 * by reading bits and matching against code ranges, avoiding the need
 * to store a full binary tree structure.
 *
 * @private
 * @param {number[]} lengths - Array where lengths[i] = bit-length of code for symbol i
 *                             (0 means symbol is unused)
 * @returns {HuffmanNode} Optimized Huffman node structure for fast symbol decoding
 *
 * @example
 * // Build Huffman table from RFC 1951 example code lengths
 * const lengths = [3, 3, 3, 3, 3, 2, 4, 4];
 * const huffman = buildHuffman(lengths);
 * // Can now use huffman with decodeSymbol() to decode bit stream
 *
 */
function buildHuffman(lengths: number[]): HuffmanNode {
    let maxBits: number = 0;

    // Find the maximum code length in the input
    // This determines how deep we need to search during decoding
    for (const len of lengths) {
        if (len > maxBits) {
            maxBits = len;
        }
    }

    // Handle empty Huffman table (no symbols)
    if (maxBits === 0) {
        return {
            lengths: [],
            maxBits: 0,
            symbolsByLength: [],
            firstCodeByLength: []
        };
    }

    // Step 1: Count how many codes have each bit length
    // blCount[i] = number of codes with bit length i
    const blCount: number[] = new Array<number>(maxBits + 1).fill(0);
    for (const len of lengths) {
        if (len > 0) {
            blCount[parseInt(len.toString(), 10)] += 1;
        }
    }

    // Step 2: Generate the initial code value for each bit length
    // This implements the algorithm from RFC 1951 Section 3.2.2:
    // For each bit length, the first code is computed by:
    // 1. Summing the code counts for all smaller lengths
    // 2. Left-shifting by (current_length - smaller_length)
    const firstCodeByLength: number[] = new Array<number>(maxBits + 1).fill(0);
    let code: number = 0;

    for (let bitsLen: number = 1; bitsLen <= maxBits; bitsLen++) {
        // All codes with length (bitsLen-1) were used, shift for next length
        code = (code + blCount[bitsLen - 1]) << 1;
        firstCodeByLength[parseInt(bitsLen.toString(), 10)] = code;
    }

    // Step 3: Group symbols by their code length
    // This creates symbolsByLength[length] = [symbol1, symbol2, ...]
    // containing all symbols that have codes of this length
    const symbolsByLength: number[][] = Array.from(
        { length: maxBits + 1 },
        () => [] as number[]
    );

    for (let i: number = 0; i < lengths.length; i++) {
        if (lengths[parseInt(i.toString(), 10)] > 0) {
            symbolsByLength[lengths[parseInt(i.toString(), 10)]].push(i);
        }
    }

    return { lengths, maxBits, symbolsByLength, firstCodeByLength };
}

/**
 * Decodes a single symbol from a bit stream using a canonical Huffman table.
 * Implements efficient symbol decoding by reading bits and matching code ranges.
 *
 * Algorithm:
 * 1. For each possible bit length (1 to maxBits):
 *    a. Read one more bit and append to code
 *    b. Check if code falls within range of any symbols with this length
 *    c. If yes, use offset to index into symbols array and return
 * 2. If no match found after reading maxBits, raise error (corrupt data)
 *
 * This algorithm exploits the property that canonical Huffman codes
 * form contiguous ranges for each bit length, allowing us to match
 * codes without storing the full tree structure.
 *
 * Example:
 * - If symbols 'a', 'b', 'c' all have length 3, they get codes 000, 001, 010
 * - Reading bits 001 gives code=1, which is (1-0) from firstCode[3]=0, so returns symbols[1]
 *
 * @private
 * @param {BitReader} reader - BitReader instance positioned at start of code
 * @param {HuffmanNode} huff - Huffman node from buildHuffman()
 * @returns {number} Decoded symbol value
 * @throws {Error} if Huffman table is empty
 * @throws {Error} if code doesn't match any valid symbol (corrupt data)
 *
 * @example
 * const huffman = buildHuffman([3, 3, 3, 3, 3, 2, 4, 4]);
 * const symbol = decodeSymbol(reader, huffman);
 * // Returns a value 0-7 corresponding to a symbol
 */
function decodeSymbol(reader: BitReader, huff: HuffmanNode): number {
    // Verify Huffman table is not empty
    if (huff.maxBits === 0) {
        throw new Error('Empty Huffman table');
    }

    let code: number = 0;

    // Try each possible code length from 1 bit up to maximum
    // Canonical Huffman codes are uniquely determined by length
    for (let len: number = 1; len <= huff.maxBits; len++) {
        // Read one more bit and append to code
        // Bit is added as new high-order bit (left shift and OR)
        code = (code << 1) | reader.readBits(1);

        // Get list of symbols with this code length
        const count: number = huff.symbolsByLength[parseInt(len.toString(), 10)] ?
            huff.symbolsByLength[parseInt(len.toString(), 10)].length : 0;

        // If no symbols with this length, continue to next length
        if (count === 0) {
            continue;
        }

        // Get the first code value for this length
        const first: number = huff.firstCodeByLength[parseInt(len.toString(), 10)];

        // Check if current code is within range for this length
        // Since codes are canonical and contiguous, if our code is in range
        // we can directly index into the symbols array
        if (code - first < count) {
            // Code matches! Return the symbol at the computed index
            return huff.symbolsByLength[parseInt(len.toString(), 10)][code - first];
        }
    }

    // Code didn't match any valid symbol
    throw new Error(`Invalid Huffman code: ${code.toString(2)}`);
}

/**
 * Fixed literal/length code lengths for DEFLATE compression.
 * Defined in RFC 1951 Section 3.2.6 (Fixed Huffman Codes).
 *
 * Used when DEFLATE block uses fixed (predefined) Huffman codes.
 * Symbols 0-143 have length 8, 144-255 have length 9,
 * 256-279 have length 7, 280-287 have length 8.
 *
 * This array is computed once at module load and cached for performance.
 *
 * @const {number[]} fixedLitLenLengths
 * @private
 * @immutable
 */
const fixedLitLenLengths: number[] = (() => {
    const lengths: number[] = new Array<number>(
        DEFLATE_CONSTANTS.FIXED_LIT_LEN_TABLE_SIZE
    );

    // Symbols 0-143: 8-bit codes
    for (
        let i: number = 0;
        i < DEFLATE_CONSTANTS.FIXED_LIT_LEN_144_END;
        i++
    ) {
        lengths[parseInt(i.toString(), 10)] = 8;
    }

    // Symbols 144-255: 9-bit codes
    for (
        let i: number = DEFLATE_CONSTANTS.FIXED_LIT_LEN_144_END;
        i < DEFLATE_CONSTANTS.FIXED_LIT_LEN_256_END;
        i++
    ) {
        lengths[parseInt(i.toString(), 10)] = 9;
    }

    // Symbols 256-279: 7-bit codes
    for (
        let i: number = DEFLATE_CONSTANTS.FIXED_LIT_LEN_256_END;
        i < DEFLATE_CONSTANTS.FIXED_LIT_LEN_280_END;
        i++
    ) {
        lengths[parseInt(i.toString(), 10)] = 7;
    }

    // Symbols 280-287: 8-bit codes
    for (
        let i: number = DEFLATE_CONSTANTS.FIXED_LIT_LEN_280_END;
        i < DEFLATE_CONSTANTS.FIXED_LIT_LEN_TABLE_SIZE;
        i++
    ) {
        lengths[parseInt(i.toString(), 10)] = 8;
    }

    return lengths;
})();

/**
 * Fixed distance code lengths for DEFLATE compression.
 * Defined in RFC 1951 Section 3.2.6 (Fixed Huffman Codes).
 *
 * All 32 distance symbols use fixed 5-bit codes.
 * This array is immutable and cached for performance.
 *
 * @const {number[]} fixedDistLengths
 * @private
 * @immutable
 */
const fixedDistLengths: number[] = new Array<number>(
    DEFLATE_CONSTANTS.FIXED_DIST_TABLE_SIZE
).fill(5);

/**
 * Length code extra bits and base values for DEFLATE decompression.
 * Maps length codes 257-285 to (base_length, extra_bits) pairs.
 * Defined in RFC 1951 Section 3.2.5.
 *
 * Format: [base_length, extra_bits]
 * - base_length: Starting value for this length code
 * - extra_bits: Number of bits to read from stream to get final length
 * - actual_length = base_length + readBits(extra_bits)
 *
 * Example: Code 262 -> [11, 1] means read 1 bit, actual length is 11-12
 *
 * @const {Array<[number, number]>} lengthExtraTable
 * @private
 * @immutable
 */
const lengthExtraTable: Array<[number, number]> = [
    [3, 0],      // Length code 257
    [4, 0],      // Length code 258
    [5, 0],      // Length code 259
    [6, 0],      // Length code 260
    [7, 0],      // Length code 261
    [8, 0],      // Length code 262
    [9, 0],      // Length code 263
    [10, 0],     // Length code 264
    [11, 1],     // Length code 265
    [13, 1],     // Length code 266
    [15, 1],     // Length code 267
    [17, 1],     // Length code 268
    [19, 2],     // Length code 269
    [23, 2],     // Length code 270
    [27, 2],     // Length code 271
    [31, 2],     // Length code 272
    [35, 3],     // Length code 273
    [43, 3],     // Length code 274
    [51, 3],     // Length code 275
    [59, 3],     // Length code 276
    [67, 4],     // Length code 277
    [83, 4],     // Length code 278
    [99, 4],     // Length code 279
    [115, 4],    // Length code 280
    [131, 5],    // Length code 281
    [163, 5],    // Length code 282
    [195, 5],    // Length code 283
    [227, 5],    // Length code 284
    [258, 0]     // Length code 285
];

/**
 * Distance code extra bits and base values for DEFLATE decompression.
 * Maps distance codes 0-29 to (base_distance, extra_bits) pairs.
 * Defined in RFC 1951 Section 3.2.5.
 *
 * Format: [base_distance, extra_bits]
 * - base_distance: Starting value for this distance code
 * - extra_bits: Number of bits to read from stream to get final distance
 * - actual_distance = base_distance + readBits(extra_bits)
 *
 * Example: Code 4 -> [5, 1] means read 1 bit, distance is 5-6
 * Distance represents how many bytes back to reference in previous output
 *
 * @const {Array<[number, number]>} distExtraTable
 * @private
 * @immutable
 */
const distExtraTable: Array<[number, number]> = [
    [1, 0],      // Distance code 0
    [2, 0],      // Distance code 1
    [3, 0],      // Distance code 2
    [4, 0],      // Distance code 3
    [5, 1],      // Distance code 4
    [7, 1],      // Distance code 5
    [9, 2],      // Distance code 6
    [13, 2],     // Distance code 7
    [17, 3],     // Distance code 8
    [25, 3],     // Distance code 9
    [33, 4],     // Distance code 10
    [49, 4],     // Distance code 11
    [65, 5],     // Distance code 12
    [97, 5],     // Distance code 13
    [129, 6],    // Distance code 14
    [193, 6],    // Distance code 15
    [257, 7],    // Distance code 16
    [385, 7],    // Distance code 17
    [513, 8],    // Distance code 18
    [769, 8],    // Distance code 19
    [1025, 9],   // Distance code 20
    [1537, 9],   // Distance code 21
    [2049, 10],  // Distance code 22
    [3073, 10],  // Distance code 23
    [4097, 11],  // Distance code 24
    [6145, 11],  // Distance code 25
    [8193, 12],  // Distance code 26
    [12289, 12], // Distance code 27
    [16385, 13], // Distance code 28
    [24577, 13]  // Distance code 29
];

/**
 * DEFLATE decompression function.
 * Implements RFC 1951 (DEFLATE format without zlib wrapper).
 * Supports stored, fixed Huffman, and dynamic Huffman blocks.
 *
 * Algorithm Overview:
 * - Read and process blocks sequentially until final block encountered
 * - Each block has 1-bit final flag and 2-bit type field
 * - Three block types:
 *   1. Stored: raw uncompressed data
 *   2. Fixed: compressed with predefined Huffman codes
 *   3. Dynamic: compressed with Huffman codes in the stream
 * - Compressed blocks use Huffman codes for literals and length-distance pairs
 * - Length-distance pairs implement LZ77-style back-references
 *
 * Block Format:
 * - Final bit (1): 1 if this is last block, 0 otherwise
 * - Type (2): 00=stored, 01=fixed, 10=dynamic, 11=reserved
 * - Followed by data depending on type
 *
 * @private
 * @param {Uint8Array} data - The DEFLATE compressed data (RFC 1951 format)
 * @returns {Uint8Array} Decompressed data as Uint8Array
 * @throws {Error} if block type is invalid or reserved
 * @throws {Error} if stored block length validation fails (len != ~nlen)
 * @throws {Error} if Huffman decoding fails (insufficient data, invalid codes)
 * @throws {Error} if length/distance tables are invalid
 * @throws {Error} if back-reference distance is out of bounds
 *
 * @example
 * const compressed = new Uint8Array([...]);  // DEFLATE data
 * const decompressed = inflateRaw(compressed);
 * const text = new TextDecoder().decode(decompressed);
 *
 */
function inflateRaw(data: Uint8Array): Uint8Array {
    const reader: BitReader = new BitReader(data);
    const out: number[] = [];

    let done: boolean = false;

    // Process DEFLATE blocks until final block encountered
    while (!done && reader.hasMore()) {
        // Read block header (first 3 bits)
        // Bit 0: BFINAL (1=final block, 0=not final)
        // Bits 1-2: BTYPE (block type)
        const finalBlock: number = reader.readBits(1);
        const blockType: number = reader.readBits(2);

        switch (blockType) {
        case DEFLATE_CONSTANTS.BLOCK_TYPE_STORED: {
            // Stored (uncompressed) block
            // Contains raw data that is copied directly to output

            // Align to byte boundary before reading length
            reader.alignToByte();

            // Read block length (LEN) as 2 bytes, little-endian
            // Reading as uint16 would be cleaner but we use bit operations
            const len: number = reader.readBits(8) | (reader.readBits(8) << 8);

            // Read NLEN (one's complement of LEN) as 2 bytes, little-endian
            // NLEN should be bitwise NOT of LEN (~LEN = LEN ^ 0xFFFF)
            const nlen: number = reader.readBits(8) | (reader.readBits(8) << 8);

            // Validate NLEN is bitwise NOT of LEN
            // This is a checksum to detect corruption
            if (len !== (nlen ^ 0xffff)) {
                throw new Error(
                    `Invalid stored block length: len=${len}, nlen=${nlen}`
                );
            }

            // Copy raw bytes directly to output
            // No decompression needed for stored blocks
            for (let i: number = 0; i < len; i++) {
                out.push(reader.readBits(8));
            }

            break;
        }

        case DEFLATE_CONSTANTS.BLOCK_TYPE_FIXED:
        case DEFLATE_CONSTANTS.BLOCK_TYPE_DYNAMIC: {
            // Compressed block with Huffman codes
            // Can use fixed (predefined) or dynamic (stream-defined) codes
            let litLenTable: HuffmanNode;
            let distTable: HuffmanNode;

            if (blockType === DEFLATE_CONSTANTS.BLOCK_TYPE_FIXED) {
                // Fixed Huffman codes (RFC 1951 Section 3.2.6)
                // Use predefined tables for literal/length and distance codes
                litLenTable = buildHuffman(fixedLitLenLengths);
                distTable = buildHuffman(fixedDistLengths);
            } else {
                // Dynamic Huffman codes (RFC 1951 Section 3.2.7)
                // Huffman tables are included in the block data

                // Read header for dynamic block
                // HLIT: number of literal/length codes (257-286 actual codes)
                const hlit: number = reader.readBits(5) + 257;

                // HDIST: number of distance codes (1-32 actual codes)
                const hdist: number = reader.readBits(5) + 1;

                // HCLEN: number of code length codes (4-19 actual codes)
                const hclen: number = reader.readBits(4) + 4;

                // Code length code order (RFC 1951, Section 3.2.7)
                // This is the order in which code length codes are transmitted
                const codeLenOrder: ReadonlyArray<number> = [
                    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
                ];

                // Read code lengths for the code length alphabet
                // Initialize all to 0 (unused codes)
                const codeLenLengths: number[] = new Array<number>(19).fill(0);

                // Read HCLEN code lengths
                // These are transmitted in the order specified by codeLenOrder
                for (let i: number = 0; i < hclen; i++) {
                    const orderIdx: number = Math.min(i, codeLenOrder.length - 1);
                    codeLenLengths[codeLenOrder[parseInt(orderIdx.toString(), 10)]] = reader.readBits(3);
                }

                // Build Huffman table for decoding code lengths
                // This table is used to decode the literal/length and distance code lengths
                const codeLenTable: HuffmanNode = buildHuffman(codeLenLengths);

                // Decode literal/length and distance code lengths
                // This uses the code length Huffman table to decode the
                // lengths for the literal/length and distance Huffman tables
                const lengths: number[] = [];

                while (lengths.length < hlit + hdist) {
                    const sym: number = decodeSymbol(reader, codeLenTable);

                    if (sym <= 15) {
                        // Literal code length (0-15)
                        lengths.push(sym);
                    } else if (sym === DEFLATE_CONSTANTS.HUFFMAN_REPEAT_CODE_16) {
                        // Repeat code 16: repeat previous code length 3-6 times
                        // Read 2 bits to get repeat count
                        if (lengths.length === 0) {
                            throw new Error(
                                'Invalid DEFLATE: repeat without previous length'
                            );
                        }

                        const repeat: number =
                            reader.readBits(DEFLATE_CONSTANTS.REPEAT_16_BITS) +
                            DEFLATE_CONSTANTS.REPEAT_16_MIN;
                        const lastLen: number = lengths[lengths.length - 1];

                        // Push last length value repeat times
                        for (let i: number = 0; i < repeat; i++) {
                            lengths.push(lastLen);
                        }
                    } else if (sym === DEFLATE_CONSTANTS.HUFFMAN_REPEAT_CODE_17) {
                        // Repeat code 17: repeat zero 3-10 times
                        // Read 3 bits to get repeat count
                        const repeat: number =
                            reader.readBits(DEFLATE_CONSTANTS.REPEAT_17_BITS) +
                            DEFLATE_CONSTANTS.REPEAT_17_MIN;

                        // Push zero repeat times
                        for (let i: number = 0; i < repeat; i++) {
                            lengths.push(0);
                        }
                    } else if (sym === DEFLATE_CONSTANTS.HUFFMAN_REPEAT_CODE_18) {
                        // Repeat code 18: repeat zero 11-138 times
                        // Read 7 bits to get repeat count
                        const repeat: number =
                            reader.readBits(DEFLATE_CONSTANTS.REPEAT_18_BITS) +
                            DEFLATE_CONSTANTS.REPEAT_18_MIN;

                        // Push zero repeat times
                        for (let i: number = 0; i < repeat; i++) {
                            lengths.push(0);
                        }
                    } else {
                        throw new Error(`Invalid code length symbol: ${sym}`);
                    }
                }

                // Extract lengths for literal/length and distance tables
                // First HLIT values are for literal/length codes
                // Next HDIST values are for distance codes
                const litLenLengths: number[] = lengths.slice(0, hlit);
                const distLengths: number[] = lengths.slice(hlit, hlit + hdist);

                // Build Huffman tables from extracted code lengths
                litLenTable = buildHuffman(litLenLengths);
                distTable = buildHuffman(distLengths);
            }

            // Decode literals and length-distance pairs
            // Continues until END_OF_BLOCK symbol (256) is encountered
            let continueLoop: boolean = true;

            while (continueLoop) {
                const sym: number = decodeSymbol(reader, litLenTable);

                if (sym < 256) {
                    // Literal byte (symbol 0-255)
                    // Add byte directly to output
                    out.push(sym);
                } else if (sym === DEFLATE_CONSTANTS.LITERAL_END_OF_BLOCK) {
                    // End of block marker (symbol 256)
                    // Stop processing this block
                    continueLoop = false;
                } else {
                    // Length-distance pair (symbol 257-285)
                    // Represents LZ77 back-reference: copy from earlier in output
                    const lenIdx: number = sym - DEFLATE_CONSTANTS.LENGTH_BASE_INDEX;

                    // Validate length index is within table
                    if (lenIdx >= lengthExtraTable.length) {
                        throw new Error(`Invalid length index: ${lenIdx}`);
                    }

                    // Get base length and number of extra bits from table
                    const lengthEntry: [number, number] | undefined = lengthExtraTable[parseInt(lenIdx.toString(), 10)];

                    if (!lengthEntry) {
                        throw new Error(`Missing length table entry at index ${lenIdx}`);
                    }

                    // Extract base length and extra bits count
                    const [baseLength, lenBits] = lengthEntry;

                    // Compute final length
                    // If extra bits = 0, length = base length
                    // If extra bits > 0, read that many bits and add to base
                    const length: number =
                        baseLength + (lenBits > 0 ? reader.readBits(lenBits) : 0);

                    // Decode distance code
                    const distSym: number = decodeSymbol(reader, distTable);

                    // Validate distance index is within table
                    if (distSym >= distExtraTable.length) {
                        throw new Error(`Invalid distance index: ${distSym}`);
                    }

                    // Get base distance and number of extra bits from table
                    const distEntry: [number, number] | undefined = distExtraTable[parseInt(distSym.toString(), 10)];

                    if (!distEntry) {
                        throw new Error(`Missing distance table entry at index ${distSym}`);
                    }

                    // Extract base distance and extra bits count
                    const [baseDist, distBits] = distEntry;

                    // Compute final distance
                    // If extra bits = 0, distance = base distance
                    // If extra bits > 0, read that many bits and add to base
                    const dist: number =
                        baseDist + (distBits > 0 ? reader.readBits(distBits) : 0);

                    // Validate distance refers to valid output position
                    // Distance must be positive and not exceed current output size
                    if (dist === 0 || dist > out.length) {
                        throw new Error(
                            `Invalid distance ${dist}, output buffer size is ${out.length}`
                        );
                    }

                    // Copy 'length' bytes from 'dist' positions back
                    // Supports overlapping references (can copy same byte multiple times)
                    // Example: distance=1, length=3 repeats last byte 3 times
                    for (let i: number = 0; i < length; i++) {
                        out.push(out[out.length - dist]);
                    }
                }
            }

            break;
        }

        default: {
            throw new Error(`Unsupported DEFLATE block type: ${blockType}`);
        }
        }

        // Check if this was the final block
        // If finalBlock=1, stop processing after this block
        done = finalBlock === 1;
    }

    return new Uint8Array(out);
}

/**
 * Represents a parsed XML element structure with flexible value types.
 * Provides a JavaScript object representation of XML elements.
 *
 * Properties:
 * - `$`: Object containing element attributes (optional)
 * - `value`: Element text content or child element content (optional)
 * - Other properties: Child elements by name
 *
 * Security:
 * Properties are validated to prevent prototype pollution attacks.
 * Unsafe property names like __proto__, constructor, prototype are rejected.
 *
 * @typedef {Object} ParsedXmlObject
 * @property {Record<string, string>} [$] - Element attributes as key-value pairs
 * @property {string | ParsedXmlObject | Array<string | ParsedXmlObject>} [value] - Element content
 * @property {ParsedXmlObject} [key] - Child element or other dynamic properties
 *
 * @example
 * // XML: <root attr="value"><child>text</child></root>
 * // Result: {
 * //   $: { attr: "value" },
 * //   child: { value: "text" }
 * // }
 */
type ParsedXmlObject = {
    $?: Record<string, string>;
    value?: string | ParsedXmlObject | (string | ParsedXmlObject)[];
    [key: string]: any;
};

/**
 * Represents an ordered XML element for preserving insertion order.
 * Tracks the order in which child elements appear in the XML document.
 *
 * This is used to maintain element order in visio namespace elements
 * where order may have semantic meaning.
 *
 * @interface OrderedElement
 * @property {string} name - Element tag name
 * @property {ParsedXmlObject | string | undefined} value - Element value or content
 *
 * @private
 */
interface OrderedElement {
    /** @type {string} Element tag name */
    name: string;

    /** @type {ParsedXmlObject | string | undefined} Element value or parsed content */
    value: ParsedXmlObject | string | undefined;
}


/**
 * Preserve Visio <Text> formatting runs:
 * - Captures text segments tagged with current cp/pp/tp indices.
 * - Provides consolidated `value` for display, and `textRuns` for styling or downstream mapping.
 * - Handles mixed content (text + child elements).
 * - Tracks order of children (optional) including #text entries.
 */

export interface TextRun {
    text: string;
    cpIX: number | null;
    ppIX: number | null;
    tpIX: number | null;
}

/**
 * Set of property names that are unsafe to set in objects.
 * Prevents prototype pollution attacks by blocking dangerous properties.
 *
 * Includes:
 * - `__proto__`: Direct prototype mutation
 * - `constructor`: Constructor function modification
 * - `prototype`: Prototype object modification
 * - `__constructor__`: Alternative constructor reference
 * - `hasOwnProperty`: Method override
 * - `__defineGetter__`: Getter definition method
 * - `__defineSetter__`: Setter definition method
 * - `__lookupGetter__`: Getter lookup method
 * - `__lookupSetter__`: Setter lookup method
 *
 * @const {ReadonlySet<string>} UNSAFE_PROPERTY_NAMES
 * @private
 * @immutable
 */
const UNSAFE_PROPERTY_NAMES: ReadonlySet<string> = new Set<string>([
    '__proto__',
    'constructor',
    'prototype',
    '__constructor__',
    'hasOwnProperty',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__'
]);

/**
 * Converts an XML DOM Node to a JavaScript object recursively.
 * Handles text nodes, element nodes, and attributes with security validation
 * to prevent prototype pollution attacks.
 *
 * Algorithm:
 * 1. Handle text nodes: trim whitespace and return if non-empty
 * 2. For element nodes:
 *    a. Extract and store attributes in $ object
 *    b. Process each child node recursively
 *    c. Merge duplicate properties into arrays
 *    d. Store text node content in 'value' property
 * 3. Guard against non-element node types
 * 4. Validate property names to prevent prototype pollution
 * 5. Optionally track child order for visio elements
 *
 * Security Features:
 * - Validates property names against UNSAFE_PROPERTY_NAMES
 * - Uses Object.defineProperty for immutable order tracking
 * - Type-checks before attribute access
 *
 * @private
 * @param {Node} node - The XML DOM Node to convert
 * @param {boolean} [shouldTrackOrder=false] - Whether to preserve child element order
 * @returns {ParsedXmlObject | string | undefined} Parsed JavaScript object,
 *          string (for text nodes), or undefined (for empty text nodes)
 *
 * @example
 * // XML: <root attr="value"><child>text</child></root>
 * const node = xmlElement;
 * const obj = xmlToJsObject(node);
 * console.log(obj.$.attr);  // "value"
 * console.log(obj.child.value);  // "text"
 *
 * @throws {Error} if UTF-8 decoding fails for attribute or element text
 */
export function xmlToJsObject(
    node: Node,
    shouldTrackOrder?: boolean
): ParsedXmlObject | string | undefined {
    // Handle text nodes
    // Text nodes contain only text content, no child elements
    if (node.nodeType === Node.TEXT_NODE) {
        const rawText: string = node.nodeValue || '';
        const text: string = normalizeWhitespace(rawText);
        // Return text only if non-empty after trimming
        return text.length > 0 ? text : undefined;
    }

    // Guard against non-element nodes
    // Only Element nodes (nodeType=1) have attributes and structured content
    if (!(node instanceof Element)) {
        return undefined;
    }

    const obj: Record<string, unknown> = {};
    const element: Element = node;

    // Extract and store element attributes
    // Attributes are stored in the special $ property
    if (element.attributes && element.attributes.length > 0) {
        const attrs: Record<string, string> = {};

        // Iterate through each attribute of the element
        for (let i: number = 0; i < element.attributes.length; i++) {
            const attr: Attr | null = element.attributes.item(i);

            if (attr) {
                attrs[attr.name] = attr.value;
            }
        }
        const dollar: string = '$';
        obj[`${dollar}`] = attrs;
    }

    // Array to track child element order (if requested)
    const orderedChildren: OrderedElement[] = [];

    // Collect text nodes consistently (avoid string↔array flips)
    const textPieces: string[] = [];

    // If this is a Visio <Text> element, also track order of child elements
    const tagNameLower: string = getLowerTagName(element);
    if (tagNameLower === 'text') {
        shouldTrackOrder = true;
    }

    // Process child nodes recursively
    for (let i: number = 0; i < node.childNodes.length; i++) {
        const child: Node = node.childNodes[parseInt(i.toString(), 10)];

        // Recursively convert child node
        const childObj: ParsedXmlObject | string | undefined = xmlToJsObject(child, shouldTrackOrder);

        // Skip empty text nodes
        if (child.nodeType === Node.TEXT_NODE && childObj === undefined) {
            continue;
        }

        const childName: string = child.nodeName;

        // Security: Prevent prototype pollution attacks
        // Check if property name is in unsafe list
        if (!isValidPropertyName(childName)) {
            console.warn(`Skipping unsafe property name: ${childName}`);
            continue;
        }

        if (child.nodeType === Node.TEXT_NODE) {
            if (typeof childObj === 'string' && childObj.length > 0) {
                textPieces.push(childObj);
                if (shouldTrackOrder) {
                    orderedChildren.push({ name: '#text', value: childObj });
                }
            }
        } else {
            // Element node - set or merge property
            // If key already exists, merge into array
            setObjectProperty(obj, childName, childObj);

            // Track order of child elements if requested
            if (shouldTrackOrder) {
                orderedChildren.push({ name: childName, value: childObj });
            }
        }
    }

    // Finalize consolidated text content (join with single space)
    if (textPieces.length > 0) {
        // Text node content stored as 'value' property
        // This distinguishes element text from child elements
        const value: string = 'value';
        obj[`${value}`] = textPieces.join(' ');
    }

    // Add non-enumerable order tracking for visio namespace elements
    // Uses Object.defineProperty to make __order__ non-enumerable
    if (shouldTrackOrder && orderedChildren.length > 0) {
        Object.defineProperty(obj, '__order__', {
            value: orderedChildren,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }

    return obj as ParsedXmlObject;
}

/**
 * Validates if a property name is safe to use in an object.
 * Prevents prototype pollution attacks by filtering dangerous property names.
 *
 * Prototype pollution attacks exploit Object prototype to inject malicious code.
 * By restricting certain property names, we prevent:
 * - Direct prototype mutation (__proto__)
 * - Constructor function hijacking (constructor, __constructor__)
 * - Method override attacks (__defineGetter__, __defineSetter__, etc.)
 *
 * @private
 * @param {string} name - Property name to validate
 * @returns {boolean} True if name is safe to use, false if unsafe
 *
 * @example
 * isValidPropertyName('title');         // true
 * isValidPropertyName('description');   // true
 * isValidPropertyName('__proto__');     // false
 * isValidPropertyName('constructor');   // false
 */
function isValidPropertyName(name: string): boolean {
    return !UNSAFE_PROPERTY_NAMES.has(name);
}

/**
 * Safely sets a property on an object, handling array merging for duplicate keys.
 * Prevents prototype pollution by validating property names first.
 *
 * Algorithm:
 * - If key doesn't exist: set normally
 * - If key exists with single value: convert to array [oldValue, newValue]
 * - If key exists as array: append to array
 * - Wrapped in try-catch to handle any property assignment errors
 *
 * This approach allows multiple elements with same tag name
 * to be stored as arrays, while single elements remain as objects.
 *
 * @private
 * @param {Record<string, unknown>} obj - Target object to modify
 * @param {string} key - Property key to set or merge
 * @param {any} value - Value to set or append
 * @returns {void}
 *
 * @example
 * const obj = {};
 * setObjectProperty(obj, 'item', 'first');
 * // obj = { item: 'first' }
 * setObjectProperty(obj, 'item', 'second');
 * // obj = { item: ['first', 'second'] }
 * setObjectProperty(obj, 'item', 'third');
 * // obj = { item: ['first', 'second', 'third'] }
 */
function setObjectProperty(
    obj: Record<string, unknown>,
    key: string,
    value: any
): void {
    try {
        // Check if key already exists in object
        // Uses hasOwnProperty to exclude inherited properties
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            // Key doesn't exist - set it directly
            obj[`${key}`] = value;
        } else if (
            Array.isArray(obj[`${key}`])
        ) {
            // Key exists as array - append to it
            const arr: Array<unknown> = obj[`${key}`] as Array<unknown>;
            arr.push(value);
        } else {
            // Key exists as single value - convert to array with both values
            obj[`${key}`] = [obj[`${key}`], value];
        }
    } catch (error) {
        // Log error if property assignment fails
        // This can happen if object is sealed or frozen
        console.warn(
            `Failed to set property ${key}:`,
            error instanceof Error ? error.message : String(error)
        );
    }
}

/**
 * Normalize whitespace: collapse multiple whitespace into a single space and trim.
 * This function takes an input string and removes extra whitespace characters,
 * reducing consecutive whitespace (spaces, tabs, newlines, etc.) to a single space,
 * then removes leading and trailing whitespace from the result.
 *
 * @param {string} input - The input string to normalize
 * @returns {string} The normalized string with collapsed whitespace and trimmed edges
 *
 * @example
 * normalizeWhitespace("  hello   world  ") // Returns: "hello world"
 * normalizeWhitespace("foo\n\tbar") // Returns: "foo bar"
 */
function normalizeWhitespace(input: string): string {
    // Replace all consecutive whitespace characters with a single space
    // \s+ matches one or more whitespace characters, ' ' replaces with single space
    return input.replace(/\s+/g, ' ').trim();
    // trim() removes any leading/trailing spaces from the result
}

/**
 * Safe local/tag name access with lowercasing, handling namespace prefixes.
 * This function extracts the tag name from a DOM element in a namespace-aware manner.
 * It prioritizes the 'localName' property (which excludes namespace prefixes) over 'tagName',
 * providing better compatibility across different DOM implementations and XML namespaces.
 * The resulting tag name is converted to lowercase for consistent, case-insensitive comparisons.
 *
 * @param {Element} el - The DOM element whose tag name is to be retrieved
 * @returns {string} The lowercase tag name of the element (without namespace prefix if available)
 *
 * @example
 * getLowerTagName(xmlElement) // Returns: "div", "svg", "rect", etc.
 * // For namespaced elements like <svg:rect>, returns "rect" (not "svg:rect")
 */
function getLowerTagName(el: Element): string {
    let name: string = '';

    // Prefer localName if available; it excludes namespace prefixes (e.g., "svg:rect" → "rect")
    // localName is the standard property in XML/SVG contexts
    if (typeof el.localName === 'string' && el.localName.length > 0) {
        name = el.localName;
    } else {
        // Fallback to tagName for broader compatibility
        // tagName may include namespace prefix depending on the DOM implementation
        name = el.tagName;
    }

    // Convert to lowercase for consistent, case-insensitive tag name comparison
    return name.toLowerCase();
}
