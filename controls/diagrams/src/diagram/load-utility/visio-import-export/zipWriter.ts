/**
 * A minimal ZIP archive writer for creating VSDX (Visio) files.
 * Implements the ZIP file format specification (RFC 1952) to package XML files and binary data.
 *
 * Features:
 * - Adds files (text or binary) to an in-memory ZIP archive
 * - Generates complete ZIP file structure with proper headers
 * - Supports uncompressed (stored) files only
 * - Compatible with standard ZIP readers and VSDX format
 *
 * ZIP Structure Created:
 * 1. Local file headers + file data (one per file)
 * 2. Central directory entries (one per file)
 * 3. End of Central Directory (EOCD) record
 *
 * Limitations:
 * - Only supports stored (uncompressed) files (compression method 0)
 * - Does not calculate CRC-32 checksums
 * - Single-disk archive only (no multi-disk support)
 * - No encryption or digital signatures
 * - Files are not actually compressed
 *
 * @example
 * const writer = new MinimalZipWriter();
 * writer.addFile('document.xml', '<root>content</root>');
 * writer.addFile('styles.xml', xmlData);
 * const zipBuffer = writer.generate();
 * const blob = new Blob([zipBuffer], { type: 'application/zip' });
 *
 * @see {@link MinimalZipReader} for reading ZIP files
 */
export class MinimalZipWriter {
    /**
     * Array of files to be included in the ZIP archive.
     * Each entry contains filename and uncompressed binary data.
     *
     * @private
     * @type {Array<{name: string, data: Uint8Array}>}
     */
    private files: Array<{name: string, data: Uint8Array}> = [];

    /**
     * Byte offset where the central directory starts in the final ZIP file.
     * Calculated after all local headers and file data are written.
     * This value is stored in the EOCD record so readers can locate the central directory.
     *
     * @private
     * @type {number}
     */
    private centralDirOffset: number = 0;

    /**
     * The date/time to use for all files in the archive.
     * Stored in DOS date/time format in file headers.
     * All files share the same timestamp (file creation time).
     *
     * @private
     * @type {Date}
     */
    private date: Date = new Date();

    /**
     * Creates a new MinimalZipWriter instance.
     * Initializes an empty archive that is ready to accept files.
     *
     * @constructor
     *
     * @example
     * const writer = new MinimalZipWriter();
     */
    constructor() {
        // Constructor body is implicit - initialization happens via field declarations above
    }

    /**
     * Adds a file to the ZIP archive.
     * Accepts either text (string) or binary (Uint8Array) data.
     * Text data is automatically converted to UTF-8 bytes.
     *
     * Algorithm:
     * 1. Convert string data to Uint8Array using TextEncoder (UTF-8)
     * 2. Create file entry object with name and data
     * 3. Store in files array for later processing during generate()
     *
     * Notes:
     * - Files are stored in order they are added
     * - Filenames can include path separators (/) for directory structure
     * - No duplicate checking - same filename can be added multiple times
     * - Data is copied into Uint8Array so original can be garbage collected
     *
     * @private
     * @param {string} filename - The path/name of the file in the archive
     *                            Can include path separators for nested files
     *                            Example: "folder/document.xml", "xl/sheets/sheet1.xml"
     * @param {Uint8Array | string} data - The file content as either:
     *                                      - Uint8Array: Binary data (no conversion)
     *                                      - string: Text data (converted to UTF-8 bytes)
     * @returns {void}
     *
     * @example
     * const writer = new MinimalZipWriter();
     * writer.addFile('document.xml', '<root>Hello</root>');
     * writer.addFile('image.bin', imageBuffer);
     * writer.addFile('folder/nested.txt', 'nested content');
     *
     * @throws Does not throw - silently handles any encoding issues
     */
    public addFile(filename: string, data: Uint8Array | string): void {
        // Convert string data to Uint8Array using UTF-8 encoding
        // TextEncoder always uses UTF-8, no encoding parameter needed
        // If already Uint8Array, use as-is
        const dataArray: Uint8Array = typeof data === 'string'
            ? new TextEncoder().encode(data)
            : data;

        // Add file entry to internal array
        // File will be included in ZIP when generate() is called
        this.files.push({name: filename, data: dataArray});
    }

    /**
     * Generates the complete ZIP archive as an ArrayBuffer.
     * Constructs the entire ZIP file structure including all headers and data.
     *
     * Algorithm:
     * 1. For each file:
     *    a. Create local file header (30 bytes fixed + filename)
     *    b. Add file data
     *    c. Create central directory entry
     * 2. Calculate offset where central directory starts
     * 3. Add all central directory entries
     * 4. Create and add End of Central Directory (EOCD) record
     * 5. Combine all byte arrays into single Uint8Array
     *
     * ZIP File Structure:
     * ```
     * [Local File Header 1][File Data 1][Local File Header 2][File Data 2]...
     * [Central Directory Entry 1][Central Directory Entry 2]...
     * [End of Central Directory Record]
     * ```
     *
     * Offsets:
     * - Local headers start at byte 0
     * - Central directory starts after all local headers and file data
     * - EOCD record appears at the very end
     *
     * @private
     * @returns {ArrayBuffer} The complete ZIP archive as an ArrayBuffer
     *                        Can be converted to Blob for download:
     *                        new Blob([buffer], {type: 'application/zip'})
     *
     * @example
     * const writer = new MinimalZipWriter();
     * writer.addFile('file1.txt', 'content1');
     * writer.addFile('file2.txt', 'content2');
     * const buffer = writer.generate();
     *
     * // Save to file (browser)
     * const blob = new Blob([buffer], {type: 'application/zip'});
     * const url = URL.createObjectURL(blob);
     * const a = document.createElement('a');
     * a.href = url;
     * a.download = 'archive.zip';
     * a.click();
     *
     * // Or send to server
     * fetch('/upload', {method: 'POST', body: blob});
     */
    public generate(): ArrayBuffer {
        // Array to accumulate all byte arrays in order
        // Will be combined into final ZIP file
        const fileData: Uint8Array[] = [];

        // Array to accumulate central directory entries
        // Added to fileData after all local headers and file data
        const centralDir: Uint8Array[] = [];

        // Track byte offset for calculating file positions
        // Each local header + file data changes the offset
        let offset: number = 0;

        // Step 1: Create local file headers and add file data
        // Process each file that was added via addFile()
        for (const file of this.files) {
            // Convert filename to UTF-8 bytes for storage in header
            const filenameBytes: Uint8Array = new TextEncoder().encode(file.name);

            // Create local file header (30 bytes + filename)
            // Contains file metadata needed by ZIP readers
            const header: Uint8Array = this.createLocalFileHeader(filenameBytes, file.data);

            // Add local file header to output
            fileData.push(header);

            // Add actual file data to output
            // Data is stored uncompressed (stored method)
            fileData.push(file.data);

            // Create central directory entry for this file
            // Central directory is needed by ZIP readers to locate files
            // The offset parameter tells readers where to find this file's local header
            const cdEntry: Uint8Array = this.createCentralDirEntry(filenameBytes, file.data, offset);

            // Store central directory entry for later
            centralDir.push(cdEntry);

            // Update offset for next file
            // Next file's local header will start at this new offset
            offset += header.length + file.data.length;
        }

        // Step 2: Record where central directory will start
        // This offset is written in the EOCD record
        this.centralDirOffset = offset;

        // Step 3: Add all central directory entries
        // Central directory is a contiguous block of entries after all files
        for (const entry of centralDir) {
            fileData.push(entry);
            // Update offset for EOCD record position
            offset += entry.length;
        }

        // Step 4: Create and add End of Central Directory (EOCD) record
        // EOCD tells ZIP readers where central directory is located
        // Must be the last record in the file
        const eocd: Uint8Array = this.createEndOfCentralDirRecord(
            centralDir.length,              // Number of files in archive
            this.centralDirOffset,          // Where central directory starts
            offset - this.centralDirOffset  // Size of central directory in bytes
        );
        fileData.push(eocd);

        // Step 5: Combine all byte arrays into single Uint8Array
        // Calculate total length needed for final array
        const totalLength: number = fileData.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);

        // Create result array with exact size needed
        const result: Uint8Array = new Uint8Array(totalLength);

        // Copy each byte array into result at correct position
        let pos: number = 0;
        for (const arr of fileData) {
            result.set(arr, pos);
            pos += arr.length;
        }

        // Return the underlying ArrayBuffer
        // Can be used directly or converted to Blob
        return result.buffer;
    }

    /**
     * Creates a local file header for a file in the ZIP archive.
     * Local file headers appear before each file's data and contain metadata.
     *
     * Local File Header Structure (30 bytes fixed + variable):
     * - Offset 0: Local file header signature (4 bytes) = 0x04034B50
     * - Offset 4: Version needed to extract (2 bytes)
     * - Offset 6: General purpose bit flag (2 bytes)
     * - Offset 8: Compression method (2 bytes) [0=stored, 8=deflate]
     * - Offset 10: Last mod file time (2 bytes) [DOS format]
     * - Offset 12: Last mod file date (2 bytes) [DOS format]
     * - Offset 14: CRC-32 (4 bytes)
     * - Offset 18: Compressed size (4 bytes)
     * - Offset 22: Uncompressed size (4 bytes)
     * - Offset 26: Filename length (2 bytes)
     * - Offset 28: Extra field length (2 bytes)
     * - Offset 30: Filename (variable)
     * - After: Extra field (variable)
     *
     * This implementation:
     * - Uses stored method (no compression)
     * - Sets CRC-32 to 0 (not calculated)
     * - Sets both compressed and uncompressed sizes to data.length
     * - Uses DOS date/time format
     *
     * @private
     * @param {Uint8Array} filenameBytes - The filename encoded as UTF-8 bytes
     * @param {Uint8Array} data - The uncompressed file data
     * @returns {Uint8Array} Complete local file header including filename
     *                       Total length = 30 + filenameBytes.length
     *
     * @example
     * const filename = new TextEncoder().encode('document.xml');
     * const fileData = new Uint8Array([...]);
     * const header = this.createLocalFileHeader(filename, fileData);
     * // header.length = 30 + filename.length
     *
     */
    private createLocalFileHeader(filenameBytes: Uint8Array, data: Uint8Array): Uint8Array {
        // Allocate buffer for fixed header (30 bytes) + filename
        const header: Uint8Array = new Uint8Array(30 + filenameBytes.length);

        // Create DataView for easy multi-byte value writing in little-endian format
        const view: DataView = new DataView(header.buffer);

        // Offset 0: Local file header signature
        // This magic number identifies the record as a local file header
        // Value 0x04034B50 = bytes [0x50, 0x4B, 0x03, 0x04] = "PK\x03\x04"
        view.setUint32(0, 0x04034b50, true);

        // Offset 4: Version needed to extract (2 bytes, little-endian)
        // 20 = version 2.0 (supports 32-bit file sizes and UTF-8 filenames)
        // Higher versions support more compression methods and features
        view.setUint16(4, 20, true);

        // Offset 6: General purpose bit flag (2 bytes, little-endian)
        // Controls how file is stored and interpreted
        // 0 = no special flags (no encryption, no data descriptor)
        view.setUint16(6, 0, true);

        // Offset 8: Compression method (2 bytes, little-endian)
        // 0 = stored (uncompressed) - data copied as-is
        // 8 = deflate (compressed) - RFC 1951 format
        // This implementation only supports stored (0)
        view.setUint16(8, 0, true);

        // Offset 10: Last modification time (2 bytes, little-endian, DOS format)
        // Format: HHHHHMMM MMMSSSS (5 bits hour, 6 bits minute, 5 bits seconds/2)
        // Calculated from current Date object
        const time: number = this.dosTime(this.date);
        view.setUint16(10, time, true);

        // Offset 12: Last modification date (2 bytes, little-endian, DOS format)
        // Format: YYYYYYY MMMDDDD (7 bits year-1980, 4 bits month, 5 bits day)
        // Calculated from current Date object
        const date: number = this.dosDate(this.date);
        view.setUint16(12, date, true);

        // Offset 14: CRC-32 checksum (4 bytes, little-endian)
        // CRC-32 of uncompressed data for corruption detection
        // Set to 0 as we're not calculating checksums
        // ZIP readers may still validate this if data descriptor has actual CRC
        view.setUint32(14, 0, true);

        // Offset 18: Compressed size (4 bytes, little-endian)
        // Size of file data as stored in the ZIP
        // For stored method, equals uncompressed size
        // For deflate method, would be smaller
        view.setUint32(18, data.length, true);

        // Offset 22: Uncompressed size (4 bytes, little-endian)
        // Original file size before compression
        // For stored method, same as compressed size
        view.setUint32(22, data.length, true);

        // Offset 26: Filename length (2 bytes, little-endian)
        // Number of bytes in the filename field
        // Used to skip over filename when reading
        view.setUint16(26, filenameBytes.length, true);

        // Offset 28: Extra field length (2 bytes, little-endian)
        // Size of extra field data (if any)
        // 0 = no extra field
        // Extra field can contain timestamps, OS info, or custom data
        view.setUint16(28, 0, true);

        // Offset 30: Filename (variable length)
        // UTF-8 encoded filename
        // Length is specified by filename length field at offset 26
        header.set(filenameBytes, 30);

        return header;
    }

    /**
     * Creates a central directory entry for a file in the ZIP archive.
     * Central directory entries are used by ZIP readers to locate and list files.
     * One entry exists for each file in the archive.
     *
     * Central Directory Header Structure (46 bytes fixed + variable):
     * - Offset 0: Central directory header signature (4 bytes) = 0x02014B50
     * - Offset 4: Version made by (2 bytes)
     * - Offset 6: Version needed to extract (2 bytes)
     * - Offset 8: General purpose bit flag (2 bytes)
     * - Offset 10: Compression method (2 bytes)
     * - Offset 12: Last mod file time (2 bytes) [DOS format]
     * - Offset 14: Last mod file date (2 bytes) [DOS format]
     * - Offset 16: CRC-32 (4 bytes)
     * - Offset 20: Compressed size (4 bytes)
     * - Offset 24: Uncompressed size (4 bytes)
     * - Offset 28: Filename length (2 bytes)
     * - Offset 30: Extra field length (2 bytes)
     * - Offset 32: File comment length (2 bytes)
     * - Offset 34: Disk number start (2 bytes)
     * - Offset 36: Internal file attributes (2 bytes)
     * - Offset 38: External file attributes (4 bytes)
     * - Offset 42: Relative offset of local header (4 bytes)
     * - Offset 46: Filename (variable)
     * - After: Extra field (variable)
     * - After: File comment (variable)
     *
     * The central directory allows ZIP readers to:
     * - List all files without scanning entire archive
     * - Jump directly to any file using local header offset
     * - Verify file integrity
     *
     * @private
     * @param {Uint8Array} filenameBytes - The filename encoded as UTF-8 bytes
     * @param {Uint8Array} data - The file data (used to calculate sizes)
     * @param {number} offset - Byte offset where this file's local header is located
     *                         This allows readers to jump directly to the file
     * @returns {Uint8Array} Complete central directory entry including filename
     *                       Total length = 46 + filenameBytes.length
     *
     * @example
     * const filename = new TextEncoder().encode('document.xml');
     * const fileData = new Uint8Array([...]);
     * const entry = this.createCentralDirEntry(filename, fileData, 1024);
     * // Creates entry pointing to local header at byte 1024
     *
     */
    private createCentralDirEntry(filenameBytes: Uint8Array, data: Uint8Array, offset: number): Uint8Array {
        // Allocate buffer for fixed header (46 bytes) + filename
        const entry: Uint8Array = new Uint8Array(46 + filenameBytes.length);

        // Create DataView for easy multi-byte value writing in little-endian format
        const view: DataView = new DataView(entry.buffer);

        // Offset 0: Central directory header signature
        // This magic number identifies the record as a central directory entry
        // Value 0x02014B50 = bytes [0x50, 0x4B, 0x01, 0x02] = "PK\x01\x02"
        view.setUint32(0, 0x02014b50, true);

        // Offset 4: Version made by (2 bytes, little-endian)
        // Upper byte: OS (0=MS-DOS, 3=Unix, etc.)
        // Lower byte: version number
        // 20 = version 2.0 on MS-DOS
        view.setUint16(4, 20, true);

        // Offset 6: Version needed to extract (2 bytes, little-endian)
        // Minimum ZIP reader version required to extract this file
        // 20 = version 2.0 (needed for 32-bit sizes and UTF-8)
        view.setUint16(6, 20, true);

        // Offset 8: General purpose bit flag (2 bytes, little-endian)
        // Controls file encoding and data format
        // 0 = no special flags
        // Bit 11 (0x800) would indicate UTF-8 filename encoding
        view.setUint16(8, 0, true);

        // Offset 10: Compression method (2 bytes, little-endian)
        // 0 = stored (uncompressed)
        // 8 = deflate (compressed)
        // Must match the method in the local file header
        view.setUint16(10, 0, true);

        // Offset 12: Last modification time (2 bytes, little-endian, DOS format)
        // Format: HHHHHMMM MMMSSSS (5 bits hour, 6 bits minute, 5 bits seconds/2)
        // Same timestamp used for all files
        const time: number = this.dosTime(this.date);
        view.setUint16(12, time, true);

        // Offset 14: Last modification date (2 bytes, little-endian, DOS format)
        // Format: YYYYYYY MMMDDDD (7 bits year-1980, 4 bits month, 5 bits day)
        // Same timestamp used for all files
        const date: number = this.dosDate(this.date);
        view.setUint16(14, date, true);

        // Offset 16: CRC-32 checksum (4 bytes, little-endian)
        // CRC-32 of uncompressed data
        // Set to 0 as we're not calculating checksums
        // ZIP readers may still validate this
        view.setUint32(16, 0, true);

        // Offset 20: Compressed size (4 bytes, little-endian)
        // Size of file data as stored (after compression if any)
        // For stored method, equals uncompressed size
        view.setUint32(20, data.length, true);

        // Offset 24: Uncompressed size (4 bytes, little-endian)
        // Original file size
        // For stored method, same as compressed size
        view.setUint32(24, data.length, true);

        // Offset 28: Filename length (2 bytes, little-endian)
        // Number of bytes in the filename field
        // Used to locate extra field and file comment
        view.setUint16(28, filenameBytes.length, true);

        // Offset 30: Extra field length (2 bytes, little-endian)
        // Size of extra field (if any)
        // 0 = no extra field
        view.setUint16(30, 0, true);

        // Offset 32: File comment length (2 bytes, little-endian)
        // Size of file comment (if any)
        // 0 = no comment
        view.setUint16(32, 0, true);

        // Offset 34: Disk number start (2 bytes, little-endian)
        // Which disk this file is on (for multi-disk archives)
        // 0 = first disk (single disk archive)
        view.setUint16(34, 0, true);

        // Offset 36: Internal file attributes (2 bytes, little-endian)
        // Bit 0: 0 = binary file, 1 = text file
        // Set to 0 for binary (safe for all file types)
        view.setUint16(36, 0, true);

        // Offset 38: External file attributes (4 bytes, little-endian)
        // OS-specific attributes (DOS/Unix permissions, etc.)
        // Set to 0 as we're not preserving OS attributes
        view.setUint32(38, 0, true);

        // Offset 42: Relative offset of local header (4 bytes, little-endian)
        // Byte offset where this file's local header is located
        // ZIP readers use this to jump directly to the file
        // Must be accurate for readers to find the file
        view.setUint32(42, offset, true);

        // Offset 46: Filename (variable length)
        // UTF-8 encoded filename
        // Length specified by filename length field at offset 28
        entry.set(filenameBytes, 46);

        return entry;
    }

    /**
     * Creates the End of Central Directory (EOCD) record for the ZIP archive.
     * This is the last record in a ZIP file and must be found by ZIP readers.
     * EOCD tells readers where the central directory is located.
     *
     * End of Central Directory Structure (22 bytes fixed + comment):
     * - Offset 0: EOCD signature (4 bytes) = 0x06054B50
     * - Offset 4: Number of this disk (2 bytes)
     * - Offset 6: Disk where central directory starts (2 bytes)
     * - Offset 8: Number of central dir records on this disk (2 bytes)
     * - Offset 10: Total number of central dir records (2 bytes)
     * - Offset 12: Size of central directory (4 bytes)
     * - Offset 16: Offset of start of central directory (4 bytes)
     * - Offset 20: Comment length (2 bytes)
     * - Offset 22: Comment (variable, 0 bytes in this implementation)
     *
     * The EOCD record is critical:
     * - ZIP readers search backwards from end of file to find this
     * - Must be within last 65557 bytes (65535 + 22) due to max comment length
     * - Provides all info needed to locate and read the archive
     *
     * @private
     * @param {number} entries - The total number of files in the archive
     *                          Must match count of central directory entries
     * @param {number} cdOffset - Byte offset where central directory starts
     *                           Allows ZIP readers to locate the directory
     * @param {number} cdSize - Total size of central directory in bytes
     *                         Sum of all central directory entry sizes
     * @returns {Uint8Array} The EOCD record (exactly 22 bytes, no comment)
     *
     * @example
     * const eocd = this.createEndOfCentralDirRecord(5, 10240, 250);
     * // Creates EOCD for archive with 5 files
     * // Central directory starts at byte 10240 and is 250 bytes long
     *
     */
    private createEndOfCentralDirRecord(entries: number, cdOffset: number, cdSize: number): Uint8Array {
        // Allocate buffer for EOCD record (exactly 22 bytes)
        // No variable fields (no comment)
        const eocd: Uint8Array = new Uint8Array(22);

        // Create DataView for easy multi-byte value writing in little-endian format
        const view: DataView = new DataView(eocd.buffer);

        // Offset 0: End of central directory signature
        // This magic number identifies the record as EOCD
        // Value 0x06054B50 = bytes [0x50, 0x4B, 0x05, 0x06] = "PK\x05\x06"
        // ZIP readers search backwards for this signature to find EOCD
        view.setUint32(0, 0x06054b50, true);

        // Offset 4: Number of this disk (2 bytes, little-endian)
        // Which disk this archive is on (for multi-disk archives)
        // 0 = first disk (this implementation only supports single-disk)
        view.setUint16(4, 0, true);

        // Offset 6: Disk where central directory starts (2 bytes, little-endian)
        // Which disk has the start of the central directory
        // 0 = first disk (single disk archive)
        view.setUint16(6, 0, true);

        // Offset 8: Number of central dir records on this disk (2 bytes, little-endian)
        // Count of central directory entries on current disk
        // For single-disk, same as total entries
        view.setUint16(8, entries, true);

        // Offset 10: Total number of central dir records (2 bytes, little-endian)
        // Total count of files/entries in the entire archive
        // Must match the actual number of central directory entries
        view.setUint16(10, entries, true);

        // Offset 12: Size of central directory (4 bytes, little-endian)
        // Total size in bytes of all central directory entries combined
        // Used by ZIP readers to validate central directory
        view.setUint32(12, cdSize, true);

        // Offset 16: Offset of start of central directory (4 bytes, little-endian)
        // Byte position where the central directory begins
        // ZIP readers use this to jump to the central directory
        // Must be accurate - zip readers will fail if incorrect
        view.setUint32(16, cdOffset, true);

        // Offset 20: Comment length (2 bytes, little-endian)
        // Size of optional comment at end of EOCD record
        // 0 = no comment
        // We always set to 0 (no archive comment)
        view.setUint16(20, 0, true);

        // No variable comment field (length is 0)

        return eocd;
    }

    /**
     * Converts a JavaScript Date object to DOS time format.
     * DOS time format encodes hours, minutes, and seconds in a 16-bit value.
     *
     * DOS Time Format:
     * - Bits 15-11: Hours (0-23) = 5 bits
     * - Bits 10-5: Minutes (0-59) = 6 bits
     * - Bits 4-0: Seconds/2 (0-29, represents 0-58 seconds) = 5 bits
     * Total: 16 bits
     *
     * Encoding Logic:
     * - Hours shifted left 11 positions (bits 15-11)
     * - Minutes shifted left 5 positions (bits 10-5)
     * - Seconds divided by 2 (DOS only has 2-second precision)
     *
     * Example:
     * - Time 14:30:45 (2:30:45 PM)
     * - Hours: 14 << 11 = 0xB800
     * - Minutes: 30 << 5 = 0x03C0
     * - Seconds: 45 >> 1 = 22 = 0x0016
     * - Result: 0xBBD6
     *
     * @private
     * @param {Date} date - The JavaScript Date object to convert
     * @returns {number} 16-bit DOS time value (little-endian format)
     *
     * @example
     * const date = new Date(2024, 0, 15, 14, 30, 45);
     * const dosTime = this.dosTime(date);
     * // Returns DOS time encoding 14:30:45
     *
     */
    private dosTime(date: Date): number {
        // Extract time components from Date object
        // getHours(): 0-23
        // getMinutes(): 0-59
        // getSeconds(): 0-59
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();
        const seconds: number = date.getSeconds();

        // Encode into DOS time format
        // Hours: bits 15-11 (shift left 11)
        // Minutes: bits 10-5 (shift left 5)
        // Seconds: bits 4-0 (divide by 2, DOS only supports 2-second precision)
        return (hours << 11) | (minutes << 5) | (seconds >> 1);
    }

    /**
     * Converts a JavaScript Date object to DOS date format.
     * DOS date format encodes year, month, and day in a 16-bit value.
     *
     * DOS Date Format:
     * - Bits 15-9: Year (0-127, relative to 1980) = 7 bits
     * - Bits 8-5: Month (1-12) = 4 bits
     * - Bits 4-0: Day (1-31) = 5 bits
     * Total: 16 bits
     *
     * Encoding Logic:
     * - Year: subtract 1980 from actual year, then shift left 9
     * - Month: no adjustment needed (1-12), shift left 5
     * - Day: no adjustment needed (1-31)
     *
     * Year Range:
     * - Supports years 1980 to 2107 (1980 + 127)
     * - Values 0-127 represent 1980-2107
     * - Cannot represent dates before 1980
     *
     * Example:
     * - Date: January 15, 2024
     * - Year: 2024 - 1980 = 44, 44 << 9 = 0x5600
     * - Month: 1 << 5 = 0x0020
     * - Day: 15 = 0x000F
     * - Result: 0x562F
     *
     * @private
     * @param {Date} date - The JavaScript Date object to convert
     * @returns {number} 16-bit DOS date value (little-endian format)
     *
     * @example
     * const date = new Date(2024, 0, 15);  // January 15, 2024
     * const dosDate = this.dosDate(date);
     * // Returns DOS date encoding 2024-01-15
     *
     */
    private dosDate(date: Date): number {
        // Extract date components from Date object
        // getFullYear(): 1900+
        // getMonth(): 0-11 (0=January, 11=December)
        // getDate(): 1-31
        const year: number = date.getFullYear() - 1980;      // Years since 1980
        const month: number = date.getMonth() + 1;           // Convert 0-11 to 1-12
        const day: number = date.getDate();

        // Encode into DOS date format
        // Year (bits 15-9): shift left 9
        // Month (bits 8-5): shift left 5
        // Day (bits 4-0): no shift needed
        return (year << 9) | (month << 5) | day;
    }
}
