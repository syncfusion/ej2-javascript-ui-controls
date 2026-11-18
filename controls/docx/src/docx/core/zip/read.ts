import { PackageError, SecurityError } from '../errors/docx-error';
import { ResourceLimits, resolveResourceLimits, ResourceLimitOverrides } from '../security/limits';
import { crc32 } from './crc32';
import { CompressedStreamReader } from '@syncfusion/ej2-compression';
import { assertSafeZipItemName } from './names';
import { ZipEntry } from './zip-entry';
const SIG_EOCD: number = 0x06054b50;
const SIG_CFH: number = 0x02014b50;
const SIG_LFH: number = 0x04034b50;
const METHOD_STORE: number = 0;
const METHOD_DEFLATE: number = 8;
const FLAG_ENCRYPTED: number = 0x0001;
const FLAG_UTF8: number = 0x0800;
const OLE_MAGIC: Uint8Array = Uint8Array.of(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
/** Word binary FIB identifier (`wIdent`) per [MS-DOC] §2.5.1. */
const WORD_FIB_WIDENT: number = 0xa5ec;
function isOleCompound(bytes: Uint8Array): boolean {
    if (bytes.length < OLE_MAGIC.length) {
        return false;
    }
    for (let i: number = 0; i < OLE_MAGIC.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        if (bytes[i] !== OLE_MAGIC[i]) {
            return false;
        }
    }
    return true;
}
/**
 * UTF-16LE directory/stream name scan (null-terminated CFB names).
 * Used only to classify unsupported OLE containers — not a full CFB parser.
 *
 * @param {Uint8Array} bytes - The bytes.
 * @param {string} asciiName - The ascii name.
 * @returns {boolean} The result.
 */
function containsUtf16LeAsciiName(bytes: Uint8Array, asciiName: string): boolean {
    if (bytes.length < asciiName.length * 2) {
        return false;
    }
    for (let i: number = 0; i <= bytes.length - asciiName.length * 2; i += 1) {
        let matches: boolean = true;
        for (let j: number = 0; j < asciiName.length; j += 1) {
            const lo: number = bytes[i + j * 2];
            const hi: number = bytes[i + j * 2 + 1];
            if (lo !== asciiName.charCodeAt(j) || hi !== 0) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return true;
        }
    }
    return false;
}
/**
 * True when a Word binary File Information Block (`wIdent` = 0xA5EC) appears
 * at a typical CFB sector start (offset 512) or immediately after the header.
 * [MS-DOC] §2.5.1 FibBase; [MS-CFB] sector 0 layout.
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {boolean} The result.
 */
function hasWordBinaryFib(bytes: Uint8Array): boolean {
    const candidates: number[] = [512, OLE_MAGIC.length];
    for (const offset of candidates) {
        if (bytes.length < offset + 2) {
            continue;
        }
        const view: DataView = new DataView(bytes.buffer, bytes.byteOffset + offset, 2);
        if (view.getUint16(0, true) === WORD_FIB_WIDENT) {
            return true;
        }
    }
    return false;
}
/**
 * OLE compound files are never OPC ZIP. Distinguish common Office containers:
 * - legacy binary Word ([MS-DOC] `WordDocument` stream / FIB) → invalid-zip
 * - OFFCRYPTO encrypted package streams → encrypted
 * - other OLE → invalid-zip (unsupported container)
 *
 * Product scope excludes DOC binary load and OFFCRYPTO decrypt
 * (`docs/requirements/000-product-scope.md`, `opc-package.md`).
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {never} The result.
 */
function rejectOleCompound(bytes: Uint8Array): never {
    const hasWordDocumentStream: boolean = containsUtf16LeAsciiName(bytes, 'WordDocument');
    const hasWordFib: boolean = hasWordBinaryFib(bytes);
    const hasEncryptedPackage: boolean = containsUtf16LeAsciiName(bytes, 'EncryptedPackage');
    const hasEncryptionInfo: boolean = containsUtf16LeAsciiName(bytes, 'EncryptionInfo');
    if ((hasWordDocumentStream || hasWordFib) && !hasEncryptedPackage && !hasEncryptionInfo) {
        throw new PackageError('package/invalid-zip', 'Input is a legacy binary Word document (OLE compound / .doc), not an OPC ZIP (.docx). Binary DOC is out of scope.');
    }
    if (hasEncryptedPackage || hasEncryptionInfo) {
        throw new PackageError('package/encrypted', 'Input is an encrypted Office package (OLE compound / [MS-OFFCRYPTO]), not an OPC ZIP');
    }
    throw new PackageError('package/invalid-zip', 'Input is an OLE compound file, not an OPC ZIP (.docx)');
}
function findEocdOffset(view: DataView): number {
    const length: number = view.byteLength;
    if (length < 22) {
        throw new PackageError('package/invalid-zip', 'Buffer is too small to be a ZIP archive');
    }
    const minStart: number = Math.max(0, length - 22 - 65535);
    for (let i: number = length - 22; i >= minStart; i -= 1) {
        if (view.getUint32(i, true) !== SIG_EOCD) {
            continue;
        }
        const commentLength: number = view.getUint16(i + 20, true);
        if (i + 22 + commentLength === length) {
            return i;
        }
    }
    throw new PackageError('package/invalid-zip', 'ZIP end-of-central-directory signature not found');
}
function decodeItemName(bytes: Uint8Array, utf8: boolean): string {
    return new TextDecoder(utf8 ? 'utf-8' : 'latin1').decode(bytes);
}
function readSlice(bytes: Uint8Array, start: number, size: number, what: string): Uint8Array {
    const end: number = start + size;
    if (start < 0 || end > bytes.length) {
        throw new PackageError('package/invalid-zip', `Truncated ZIP ${what}`);
    }
    return bytes.subarray(start, end);
}
const INFLATE_CHUNK: number = 16384;
/**
 * `CompressedStreamReader` mishandles DEFLATE stored blocks: its `readPackedBytes` calls
 * `Stream.read(buffer, offset, length)`, which treats `offset` as an input offset and always writes at
 * output index 0. Stored blocks (incompressible media such as PNG/JPEG) therefore fail or corrupt.
 * This subclass reads those bytes through the library's own bit reader instead.
 */
class StoredBlockSafeReader extends CompressedStreamReader {
    protected readPackedBytes(buffer: Uint8Array, offset: number, length: number): number {
        let count: number = 0;
        while (count < length) {
            const value: number = this.readBits(8);
            if (value === -1) {
                break;
            }
            buffer[offset + count] = value;
            count += 1;
        }
        return count;
    }
}
/**
 * Inflates a raw DEFLATE stream with `@syncfusion/ej2-compression`, throwing
 * `RangeError` once output exceeds `maxOutput` so zip-bombs stay bounded.
 *
 * @param {Uint8Array} compressed - The compressed bytes.
 * @param {number} maxOutput - The output cap in bytes.
 * @returns {Uint8Array} The inflated bytes.
 */
function inflateWithLibrary(compressed: Uint8Array, maxOutput: number): Uint8Array {
    // The library reads the backing ArrayBuffer, so it needs a standalone copy. Uint8Array.from always
    // copies, whereas slice() on a Node Buffer returns a view over the same memory.
    const reader: StoredBlockSafeReader = new StoredBlockSafeReader(Uint8Array.from(compressed), true);
    const chunks: Uint8Array[] = [];
    const buffer: Uint8Array = new Uint8Array(INFLATE_CHUNK);
    let total: number = 0;
    let read: number = reader.read(buffer, 0, INFLATE_CHUNK);
    while (read > 0) {
        total += read;
        if (total > maxOutput) {
            throw new RangeError('Inflate output exceeds the allowed maximum');
        }
        chunks.push(buffer.slice(0, read));
        read = reader.read(buffer, 0, INFLATE_CHUNK);
    }
    const out: Uint8Array = new Uint8Array(total);
    let offset: number = 0;
    for (const chunk of chunks) {
        out.set(chunk, offset);
        offset += chunk.length;
    }
    return out;
}
function inflateEntry(compressed: Uint8Array, method: number, limits: ResourceLimits, remainingTotal: number, name: string): Uint8Array {
    const maxOutput: number = Math.min(limits.singlePartUncompressedSize, remainingTotal, compressed.length === 0
        ? limits.singlePartUncompressedSize
        : compressed.length * limits.compressionRatio);
    if (maxOutput <= 0) {
        throw new SecurityError('security/total-uncompressed', `Total uncompressed size limit hit at ${name}`);
    }
    if (method === METHOD_STORE) {
        if (compressed.length > limits.singlePartUncompressedSize) {
            throw new SecurityError('security/part-size', `Uncompressed entry ${name} exceeds the single-part limit`);
        }
        if (compressed.length > remainingTotal) {
            throw new SecurityError('security/total-uncompressed', `Total uncompressed size limit hit at ${name}`);
        }
        return compressed.slice();
    }
    if (method !== METHOD_DEFLATE) {
        throw new PackageError('package/invalid-zip', `ZIP item ${name} uses compression method ${String(method)}; OPC allows only STORE and DEFLATE (ECMA-376-2 §7.3.6)`);
    }
    try {
        const inflated: Uint8Array = inflateWithLibrary(compressed, maxOutput);
        if (inflated.length > limits.singlePartUncompressedSize) {
            throw new SecurityError('security/part-size', `Uncompressed entry ${name} exceeds the single-part limit`);
        }
        if (compressed.length > 0 && inflated.length / compressed.length > limits.compressionRatio) {
            throw new SecurityError('security/zip-bomb', `Inflate ratio exceeded for ${name}`);
        }
        return inflated;
    }
    catch (cause) {
        if (cause instanceof SecurityError || cause instanceof PackageError) {
            throw cause;
        }
        if (cause instanceof RangeError) {
            // zlib hit the maxOutputLength cap we passed. Name the limit that bound
            // it, so a legitimately huge document is not misreported as a bomb.
            if (maxOutput === remainingTotal && remainingTotal < limits.singlePartUncompressedSize) {
                throw new SecurityError('security/total-uncompressed', `Total uncompressed size limit hit at ${name}`, { cause });
            }
            if (maxOutput === compressed.length * limits.compressionRatio) {
                throw new SecurityError('security/zip-bomb', `Inflate ratio exceeded for ${name}`, { cause });
            }
            throw new SecurityError('security/part-size', `Uncompressed entry ${name} exceeds the single-part limit ` +
                '(raise ResourceLimits.singlePartUncompressedSize to load large documents)', { cause });
        }
        throw new PackageError('package/invalid-zip', `DEFLATE stream is invalid for ${name}`, { cause });
    }
}
/**
 * Reads a ZIP archive entirely in memory. Does not write to the filesystem.
 * ZIP item names are those stored in the archive (ECMA-376-2 §7.3.3), not OPC
 * logical part names (no leading slash in the ZIP item).
 *
 * @param {Uint8Array} bytes - The bytes.
 * @param {ResourceLimitOverrides} limitOverrides - The limit overrides.
 * @returns {ReadonlyArray<ZipEntry>} The result.
 * @private
 */
export function readZip(bytes: Uint8Array, limitOverrides?: ResourceLimitOverrides): ReadonlyArray<ZipEntry> {
    const limits: ResourceLimits = resolveResourceLimits(limitOverrides);
    if (isOleCompound(bytes)) {
        rejectOleCompound(bytes);
    }
    const view: DataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const eocd: number = findEocdOffset(view);
    const diskNumber: number = view.getUint16(eocd + 4, true);
    const cdDisk: number = view.getUint16(eocd + 6, true);
    const entriesOnDisk: number = view.getUint16(eocd + 8, true);
    const totalEntries: number = view.getUint16(eocd + 10, true);
    const cdSize: number = view.getUint32(eocd + 12, true);
    const cdOffset: number = view.getUint32(eocd + 16, true);
    if (diskNumber !== 0 || cdDisk !== 0 || entriesOnDisk !== totalEntries) {
        throw new PackageError('package/invalid-zip', 'Multi-disk ZIP archives are not supported');
    }
    if (totalEntries === 0xffff || cdOffset === 0xffffffff || cdSize === 0xffffffff) {
        throw new PackageError('package/invalid-zip', 'ZIP64 archives are not supported in this ZIP reader');
    }
    if (totalEntries > limits.entryCount) {
        throw new SecurityError('security/entry-count', `ZIP entry count ${String(totalEntries)} exceeds the limit`);
    }
    if (cdOffset + cdSize > bytes.length) {
        throw new PackageError('package/invalid-zip', 'Central directory is truncated');
    }
    const namesSeen: Map<string, string> = new Map<string, string>();
    const entries: ZipEntry[] = [];
    let cursor: number = cdOffset;
    let totalUncompressed: number = 0;
    for (let n: number = 0; n < totalEntries; n += 1) {
        if (view.getUint32(cursor, true) !== SIG_CFH) {
            throw new PackageError('package/invalid-zip', 'Central directory file header signature missing');
        }
        const flags: number = view.getUint16(cursor + 8, true);
        const method: number = view.getUint16(cursor + 10, true);
        const crcExpected: number = view.getUint32(cursor + 16, true);
        const compressedSize: number = view.getUint32(cursor + 20, true);
        view.getUint32(cursor + 24, true);
        const nameLength: number = view.getUint16(cursor + 28, true);
        const extraLength: number = view.getUint16(cursor + 30, true);
        const commentLength: number = view.getUint16(cursor + 32, true);
        const localHeaderOffset: number = view.getUint32(cursor + 42, true);
        const nameBytes: Uint8Array = readSlice(bytes, cursor + 46, nameLength, 'item name');
        const name: string = decodeItemName(nameBytes, (flags & FLAG_UTF8) !== 0);
        cursor += 46 + nameLength + extraLength + commentLength;
        if ((flags & FLAG_ENCRYPTED) !== 0) {
            throw new PackageError('package/encrypted', `ZIP item ${name} is encrypted; OPC ZIP encryption is forbidden (ECMA-376-2 §7.3.6)`);
        }
        assertSafeZipItemName(name);
        const lower: string = name.toLowerCase();
        const previous: string = namesSeen.get(lower);
        if (previous !== undefined) {
            throw new PackageError('package/duplicate-zip-entry', `Duplicate ZIP item name ${name} (conflicts with ${previous})`);
        }
        namesSeen.set(lower, name);
        if (view.getUint32(localHeaderOffset, true) !== SIG_LFH) {
            throw new PackageError('package/invalid-zip', `Local file header missing for ${name}`);
        }
        const localNameLength: number = view.getUint16(localHeaderOffset + 26, true);
        const localExtraLength: number = view.getUint16(localHeaderOffset + 28, true);
        const dataStart: number = localHeaderOffset + 30 + localNameLength + localExtraLength;
        const compressed: Uint8Array = readSlice(bytes, dataStart, compressedSize, `payload for ${name}`);
        const remaining: number = limits.totalUncompressedSize - totalUncompressed;
        const data: Uint8Array = inflateEntry(compressed, method, limits, remaining, name);
        if (crc32(data) !== crcExpected) {
            throw new PackageError('package/invalid-zip', `CRC-32 mismatch for ${name}`);
        }
        totalUncompressed += data.byteLength;
        if (totalUncompressed > limits.totalUncompressedSize) {
            throw new SecurityError('security/total-uncompressed', `Total uncompressed size limit hit at ${name}`);
        }
        entries.push({ name, data });
    }
    return entries;
}
