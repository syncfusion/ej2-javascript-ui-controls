/**
 * Minimal ZIP reader for OPC packages (store + deflate).
 *
 * @remarks
 * Implements enough of APPNOTE.TXT to open OOXML packages: end of central
 * directory, central directory file headers, local file headers, method 0
 * (store) and method 8 (deflate-raw via DecompressionStream).
 * Encryption, Zip64, and multi-disk archives are rejected fail-closed.
 */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- ambient DOM shims required when compiled by the gulp pipeline without tsconfig include
/// <reference path="../../../../types/ts33-dom-extras.d.ts" />
import { EncryptedPackageError, InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { OLE_CFB_SIGNATURE } from './constants';
import { zipEntryToPartName } from './paths';
import { arrayAt } from '../util/es5-compat';
import { CompressedStreamReader, Stream } from '@syncfusion/ej2-compression';
/**
 * Synchronous raw-deflate inflate used by chart embedding reads.
 *
 * @remarks Sibling of the async `DecompressionStream` path in
 * {@link readZipEntries}. `Presentation.open` must keep using the async reader.
 * This uses vendored `@syncfusion/ej2-compression` `CompressedStreamReader`
 * with `noWrap` (deflate-raw), matching ZIP method 8.
 * @internal
 * @param {Uint8Array} compressed - Deflate-raw payload.
 * @param {number} expectedSize - Uncompressed size from the central directory.
 * @param {SecurityLimits} limits - Resolved limits.
 * @param {string} entryName - Entry name for error context.
 * @returns {Uint8Array} Inflated bytes.
 */
export function inflateRawSync(compressed: Uint8Array, expectedSize: number, limits: SecurityLimits, entryName: string): Uint8Array {
    if (expectedSize > limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', {
            partName: entryName,
            actual: expectedSize
        });
    }
    try {
        // CompressedStreamReader's Stream reads from buffer position 0, ignoring
        // a view's byteOffset; hand it a copy so subarray slices inflate right.
        const payload: Uint8Array = compressed.byteOffset === 0 && compressed.byteLength === compressed.buffer.byteLength
            ? compressed
            : compressed.slice();
        const reader: CompressedStreamReader = new CompressedStreamReader(payload, true);
        const out: Uint8Array = new Uint8Array(expectedSize);
        const sink: Stream = new Stream(out);
        const chunk: Uint8Array = new Uint8Array(8192);
        let written: number = 0;
        let n: number = reader.read(chunk, 0, chunk.byteLength);
        while (n > 0) {
            if (written + n > expectedSize) {
                throw new PackageLimitError('singlePartUncompressedBytes', {
                    partName: entryName,
                    actual: written + n
                });
            }
            sink.write(chunk.subarray(0, n), 0, n);
            written += n;
            n = reader.read(chunk, 0, chunk.byteLength);
        }
        if (written !== expectedSize) {
            throw new InvalidPackageError(`ZIP entry "${entryName}" inflated to ${written} bytes, expected ${expectedSize}`,
                                          { partName: entryName });
        }
        return out;
    }
    catch (err) {
        if (err instanceof PackageLimitError || err instanceof EncryptedPackageError || err instanceof InvalidPackageError) {
            throw err;
        }
        throw new InvalidPackageError(`Failed to inflate ZIP entry: ${err instanceof Error ? err.message : String(err)}`);
    }
}
const SIG_EOCD: number = 0x06054b50;
const SIG_CEN: number = 0x02014b50;
const SIG_LOC: number = 0x04034b50;
const METHOD_STORE: number = 0;
const METHOD_DEFLATE: number = 8;
/** General purpose bit 0: entry is encrypted. */
const GP_ENCRYPTED: number = 0x0001;
/**
 * Reads all file entries from a ZIP package under security limits.
 *
 * @throws EncryptedPackageError for CFB / bit-flag encryption.
 * @throws PackageLimitError when entry count, sizes, or ratio exceed limits.
 * @throws InvalidPackageError for malformed ZIP or path traversal.
 * @param {Uint8Array} input - Entire package bytes (ZIP or encrypted CFB).
 * @param {SecurityLimits} limits - Resolved SecurityLimits.
 * @returns {*} Map of absolute part name to uncompressed bytes (directories omitted).
 */
/**
 * Reads store-method (compression 0) ZIP entries synchronously.
 *
 * @remarks Used by `Presentation.create` for the embedded default-content
 * template, which is stored uncompressed so create can stay synchronous.
 * Deflate, encryption, and Zip64 are rejected.
 * @internal
 * @param {Uint8Array} input - Entire ZIP bytes.
 * @param {SecurityLimits} limits - Resolved SecurityLimits.
 * @returns {Map<string, Uint8Array>} Absolute part name → bytes.
 */
export function readStoredZipEntries(input: Uint8Array, limits: SecurityLimits): Map<string, Uint8Array> {
    if (input.byteLength < 22) {
        throw new InvalidPackageError('Package is too small to be a valid ZIP or OOXML package');
    }
    if (input[0] !== 0x50 || input[1] !== 0x4b) {
        throw new InvalidPackageError('Package does not start with a ZIP signature');
    }
    const view: DataView = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const eocdOffset: number = findEocdOffset(input, view);
    const totalEntries: number = view.getUint16(eocdOffset + 10, true);
    const cdSize: number = view.getUint32(eocdOffset + 12, true);
    const cdOffset: number = view.getUint32(eocdOffset + 16, true);
    if (view.getUint16(eocdOffset + 4, true) !== 0 || view.getUint16(eocdOffset + 6, true) !== 0) {
        throw new InvalidPackageError('Multi-disk ZIP archives are not supported');
    }
    if (totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
        throw new InvalidPackageError('Zip64 packages are not supported in this phase');
    }
    if (totalEntries > limits.entryCount) {
        throw new PackageLimitError('entryCount', { actual: totalEntries });
    }
    if (cdOffset + cdSize > input.byteLength) {
        throw new InvalidPackageError('ZIP central directory extends past the end of the package');
    }
    const parts: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    let totalUncompressed: number = 0;
    let offset: number = cdOffset;
    const cdEnd: number = cdOffset + cdSize;
    for (let i: number = 0; i < totalEntries; i++) {
        if (offset + 46 > cdEnd || view.getUint32(offset, true) !== SIG_CEN) {
            throw new InvalidPackageError('ZIP central directory is truncated');
        }
        const gpFlags: number = view.getUint16(offset + 8, true);
        const method: number = view.getUint16(offset + 10, true);
        const compressedSize: number = view.getUint32(offset + 20, true);
        const uncompressedSize: number = view.getUint32(offset + 24, true);
        const nameLen: number = view.getUint16(offset + 28, true);
        const extraLen: number = view.getUint16(offset + 30, true);
        const commentLen: number = view.getUint16(offset + 32, true);
        const localHeaderOffset: number = view.getUint32(offset + 42, true);
        const nameStart: number = offset + 46;
        const nameEnd: number = nameStart + nameLen;
        if (nameEnd + extraLen + commentLen > cdEnd) {
            throw new InvalidPackageError('ZIP central directory file header is truncated');
        }
        const entryName: string = decodeZipName(input.subarray(nameStart, nameEnd));
        offset = nameEnd + extraLen + commentLen;
        if (entryName.endsWith('/')) {
            continue;
        }
        if ((gpFlags & GP_ENCRYPTED) !== 0) {
            throw new EncryptedPackageError(`ZIP entry "${entryName}" is encrypted; encrypted packages are not opened`);
        }
        if (method !== METHOD_STORE) {
            throw new InvalidPackageError(`ZIP compression method ${method} is not supported for synchronous read of "${entryName}"`);
        }
        if (uncompressedSize > limits.singlePartUncompressedBytes) {
            throw new PackageLimitError('singlePartUncompressedBytes', { partName: entryName, actual: uncompressedSize });
        }
        const partName: string = zipEntryToPartName(entryName);
        if (parts.has(partName)) {
            throw new InvalidPackageError(`Duplicate ZIP entry for part "${partName}"`, { partName });
        }
        if (localHeaderOffset + 30 > input.byteLength || view.getUint32(localHeaderOffset, true) !== SIG_LOC) {
            throw new InvalidPackageError(`ZIP local header for "${entryName}" is truncated`);
        }
        const localNameLen: number = view.getUint16(localHeaderOffset + 26, true);
        const localExtraLen: number = view.getUint16(localHeaderOffset + 28, true);
        const dataStart: number = localHeaderOffset + 30 + localNameLen + localExtraLen;
        const dataEnd: number = dataStart + compressedSize;
        if (dataEnd > input.byteLength || compressedSize !== uncompressedSize) {
            throw new InvalidPackageError(`ZIP local file data for "${entryName}" is out of range`);
        }
        const data: Uint8Array = input.slice(dataStart, dataEnd);
        totalUncompressed += data.byteLength;
        if (totalUncompressed > limits.totalUncompressedBytes) {
            throw new PackageLimitError('totalUncompressedBytes', { actual: totalUncompressed });
        }
        parts.set(partName, data);
    }
    if (parts.size === 0) {
        throw new InvalidPackageError('ZIP package contains no file parts');
    }
    return parts;
}

export async function readZipEntries(input: Uint8Array, limits: SecurityLimits): Promise<Map<string, Uint8Array>> {
    if (input.byteLength < 22) {
        throw new InvalidPackageError('Package is too small to be a valid ZIP or OOXML package');
    }
    if (looksLikeOleCompoundFile(input)) {
        // Defense in depth: {@link open} intercepts CFB first when a
        // usable password is supplied (Phase 6 decrypt seam). Direct readers still
        // refuse without attempting decrypt.
        throw new EncryptedPackageError('Package uses the OLE compound-file format (often OFFCRYPTO encryption); encrypted packages require a password to open');
    }
    // ZIP local header / EOCD signature family starts with 'PK'.
    if (input[0] !== 0x50 || input[1] !== 0x4b) {
        throw new InvalidPackageError('Package does not start with a ZIP signature');
    }
    const view: DataView = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const eocdOffset: number = findEocdOffset(input, view);
    const diskNumber: number = view.getUint16(eocdOffset + 4, true);
    const cdDisk: number = view.getUint16(eocdOffset + 6, true);
    const entriesOnDisk: number = view.getUint16(eocdOffset + 8, true);
    const totalEntries: number = view.getUint16(eocdOffset + 10, true);
    const cdSize: number = view.getUint32(eocdOffset + 12, true);
    const cdOffset: number = view.getUint32(eocdOffset + 16, true);
    if (diskNumber !== 0 || cdDisk !== 0) {
        throw new InvalidPackageError('Multi-disk ZIP archives are not supported');
    }
    if (entriesOnDisk !== totalEntries) {
        throw new InvalidPackageError('ZIP end-of-central-directory entry counts are inconsistent');
    }
    if (totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
        throw new InvalidPackageError('Zip64 packages are not supported in this phase');
    }
    if (totalEntries > limits.entryCount) {
        throw new PackageLimitError('entryCount', {
            actual: totalEntries
        });
    }
    if (cdOffset + cdSize > input.byteLength) {
        throw new InvalidPackageError('ZIP central directory extends past the end of the package');
    }
    const parts: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    let totalUncompressed: number = 0;
    let offset: number = cdOffset;
    const cdEnd: number = cdOffset + cdSize;
    for (let i: number = 0; i < totalEntries; i++) {
        if (offset + 46 > cdEnd) {
            throw new InvalidPackageError('ZIP central directory is truncated');
        }
        if (view.getUint32(offset, true) !== SIG_CEN) {
            throw new InvalidPackageError('ZIP central directory signature mismatch');
        }
        const gpFlags: number = view.getUint16(offset + 8, true);
        const method: number = view.getUint16(offset + 10, true);
        const compressedSize: number = view.getUint32(offset + 20, true);
        const uncompressedSize: number = view.getUint32(offset + 24, true);
        const nameLen: number = view.getUint16(offset + 28, true);
        const extraLen: number = view.getUint16(offset + 30, true);
        const commentLen: number = view.getUint16(offset + 32, true);
        const localHeaderOffset: number = view.getUint32(offset + 42, true);
        const nameStart: number = offset + 46;
        const nameEnd: number = nameStart + nameLen;
        if (nameEnd + extraLen + commentLen > cdEnd) {
            throw new InvalidPackageError('ZIP central directory file header is truncated');
        }
        const nameBytes: Uint8Array = input.subarray(nameStart, nameEnd);
        const entryName: string = decodeZipName(nameBytes);
        offset = nameEnd + extraLen + commentLen;
        // Directory entries end with `/` — skip (OPC uses file parts only).
        if (entryName.endsWith('/')) {
            continue;
        }
        if ((gpFlags & GP_ENCRYPTED) !== 0) {
            throw new EncryptedPackageError(`ZIP entry "${entryName}" is encrypted; encrypted packages are not opened`);
        }
        if (uncompressedSize > limits.singlePartUncompressedBytes) {
            throw new PackageLimitError('singlePartUncompressedBytes', {
                partName: entryName,
                actual: uncompressedSize
            });
        }
        if (method === METHOD_DEFLATE &&
            compressedSize > 0 &&
            uncompressedSize / compressedSize > limits.compressionRatio) {
            throw new PackageLimitError('compressionRatio', {
                partName: entryName,
                actual: uncompressedSize / compressedSize
            });
        }
        const partName: string = zipEntryToPartName(entryName);
        if (parts.has(partName)) {
            throw new InvalidPackageError(`Duplicate ZIP entry for part "${partName}"`, { partName });
        }
        const data: Uint8Array = await readLocalFileData(input, view, localHeaderOffset, {
            method,
            compressedSize,
            uncompressedSize,
            entryName,
            limits
        });
        if (data.byteLength !== uncompressedSize) {
            throw new InvalidPackageError(`ZIP entry "${entryName}" inflated to ${data.byteLength} bytes, expected ${uncompressedSize}`,
                                          { partName });
        }
        totalUncompressed += data.byteLength;
        if (totalUncompressed > limits.totalUncompressedBytes) {
            throw new PackageLimitError('totalUncompressedBytes', {
                actual: totalUncompressed
            });
        }
        parts.set(partName, data);
    }
    if (parts.size === 0) {
        throw new InvalidPackageError('ZIP package contains no file parts');
    }
    return parts;
}
/**
 * Reads ZIP entries synchronously (store + deflate-raw).
 *
 * @remarks Same scanning, offsets, and {@link SecurityLimits} checks as
 * {@link readZipEntries}. Deflate uses {@link inflateRawSync} (vendored
 * `@syncfusion/ej2-compression`) instead of `DecompressionStream`. Does not
 * replace the async reader used by `Presentation.open`.
 * @throws EncryptedPackageError for CFB / bit-flag encryption.
 * @throws PackageLimitError when entry count, sizes, or ratio exceed limits.
 * @throws InvalidPackageError for malformed ZIP or path traversal.
 * @internal
 * @param {Uint8Array} input - Entire package bytes.
 * @param {SecurityLimits} limits - Resolved SecurityLimits.
 * @returns {Map<string, Uint8Array>} Absolute part name → uncompressed bytes.
 */
export function readZipEntriesSync(input: Uint8Array, limits: SecurityLimits): Map<string, Uint8Array> {
    if (input.byteLength < 22) {
        throw new InvalidPackageError('Package is too small to be a valid ZIP or OOXML package');
    }
    if (looksLikeOleCompoundFile(input)) {
        throw new EncryptedPackageError('Package uses the OLE compound-file format (often OFFCRYPTO encryption); encrypted packages require a password to open');
    }
    if (input[0] !== 0x50 || input[1] !== 0x4b) {
        throw new InvalidPackageError('Package does not start with a ZIP signature');
    }
    const view: DataView = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const eocdOffset: number = findEocdOffset(input, view);
    const diskNumber: number = view.getUint16(eocdOffset + 4, true);
    const cdDisk: number = view.getUint16(eocdOffset + 6, true);
    const entriesOnDisk: number = view.getUint16(eocdOffset + 8, true);
    const totalEntries: number = view.getUint16(eocdOffset + 10, true);
    const cdSize: number = view.getUint32(eocdOffset + 12, true);
    const cdOffset: number = view.getUint32(eocdOffset + 16, true);
    if (diskNumber !== 0 || cdDisk !== 0) {
        throw new InvalidPackageError('Multi-disk ZIP archives are not supported');
    }
    if (entriesOnDisk !== totalEntries) {
        throw new InvalidPackageError('ZIP end-of-central-directory entry counts are inconsistent');
    }
    if (totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
        throw new InvalidPackageError('Zip64 packages are not supported in this phase');
    }
    if (totalEntries > limits.entryCount) {
        throw new PackageLimitError('entryCount', {
            actual: totalEntries
        });
    }
    if (cdOffset + cdSize > input.byteLength) {
        throw new InvalidPackageError('ZIP central directory extends past the end of the package');
    }
    const parts: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    let totalUncompressed: number = 0;
    let offset: number = cdOffset;
    const cdEnd: number = cdOffset + cdSize;
    for (let i: number = 0; i < totalEntries; i++) {
        if (offset + 46 > cdEnd) {
            throw new InvalidPackageError('ZIP central directory is truncated');
        }
        if (view.getUint32(offset, true) !== SIG_CEN) {
            throw new InvalidPackageError('ZIP central directory signature mismatch');
        }
        const gpFlags: number = view.getUint16(offset + 8, true);
        const method: number = view.getUint16(offset + 10, true);
        const compressedSize: number = view.getUint32(offset + 20, true);
        const uncompressedSize: number = view.getUint32(offset + 24, true);
        const nameLen: number = view.getUint16(offset + 28, true);
        const extraLen: number = view.getUint16(offset + 30, true);
        const commentLen: number = view.getUint16(offset + 32, true);
        const localHeaderOffset: number = view.getUint32(offset + 42, true);
        const nameStart: number = offset + 46;
        const nameEnd: number = nameStart + nameLen;
        if (nameEnd + extraLen + commentLen > cdEnd) {
            throw new InvalidPackageError('ZIP central directory file header is truncated');
        }
        const nameBytes: Uint8Array = input.subarray(nameStart, nameEnd);
        const entryName: string = decodeZipName(nameBytes);
        offset = nameEnd + extraLen + commentLen;
        if (entryName.endsWith('/')) {
            continue;
        }
        if ((gpFlags & GP_ENCRYPTED) !== 0) {
            throw new EncryptedPackageError(`ZIP entry "${entryName}" is encrypted; encrypted packages are not opened`);
        }
        if (uncompressedSize > limits.singlePartUncompressedBytes) {
            throw new PackageLimitError('singlePartUncompressedBytes', {
                partName: entryName,
                actual: uncompressedSize
            });
        }
        if (method === METHOD_DEFLATE &&
            compressedSize > 0 &&
            uncompressedSize / compressedSize > limits.compressionRatio) {
            throw new PackageLimitError('compressionRatio', {
                partName: entryName,
                actual: uncompressedSize / compressedSize
            });
        }
        const partName: string = zipEntryToPartName(entryName);
        if (parts.has(partName)) {
            throw new InvalidPackageError(`Duplicate ZIP entry for part "${partName}"`, { partName });
        }
        const data: Uint8Array = readLocalFileDataSync(input, view, localHeaderOffset, {
            method,
            compressedSize,
            uncompressedSize,
            entryName,
            limits
        });
        if (data.byteLength !== uncompressedSize) {
            throw new InvalidPackageError(`ZIP entry "${entryName}" inflated to ${data.byteLength} bytes, expected ${uncompressedSize}`,
                                          { partName });
        }
        totalUncompressed += data.byteLength;
        if (totalUncompressed > limits.totalUncompressedBytes) {
            throw new PackageLimitError('totalUncompressedBytes', {
                actual: totalUncompressed
            });
        }
        parts.set(partName, data);
    }
    if (parts.size === 0) {
        throw new InvalidPackageError('ZIP package contains no file parts');
    }
    return parts;
}
/**
 * Returns whether `input` begins with the OLE compound-file (CFB) signature.
 *
 * @remarks Encrypted ECMA-376 packages are typically entire OLE compound files containing `\EncryptionInfo` and `\EncryptedPackage` streams
 * ([MS-OFFCRYPTO] §1.3.3.4, §2.3.4.4), not ZIP local headers. Used by {@link open} before ZIP parse so a consumer-supplied password can
 * take the decrypt path. Citation: [MS-CFB] header signature; `OLE_CFB_SIGNATURE` in package constants.
 * @internal
 * @param {Uint8Array} input - Entire package bytes.
 * @returns {boolean} `true` when the first eight bytes match the CFB signature.
 */
export function looksLikeOleCompoundFile(input: Uint8Array): boolean {
    if (input.byteLength < OLE_CFB_SIGNATURE.length) {
        return false;
    }
    for (let i: number = 0; i < OLE_CFB_SIGNATURE.length; i++) {
        if (arrayAt(input, i) !== arrayAt(OLE_CFB_SIGNATURE, i)) {
            return false;
        }
    }
    return true;
}
/**
 *
 * @param {Uint8Array} input - The input value.
 * @param {DataView} view - The view value.
 * @returns {number} The result.
 */
function findEocdOffset(input: Uint8Array, view: DataView): number {
    const minEocd: number = 22;
    const maxComment: number = 0xffff;
    const start: number = Math.max(0, input.byteLength - minEocd - maxComment);
    for (let i: number = input.byteLength - minEocd; i >= start; i--) {
        if (view.getUint32(i, true) === SIG_EOCD) {
            const commentLen: number = view.getUint16(i + 20, true);
            if (i + minEocd + commentLen === input.byteLength) {
                return i;
            }
        }
    }
    throw new InvalidPackageError('ZIP end-of-central-directory record not found');
}
/**
 *
 * @param {Uint8Array} nameBytes - The nameBytes value.
 * @returns {string} The result.
 */
function decodeZipName(nameBytes: Uint8Array): string {
    return new TextDecoder('utf-8', { fatal: false }).decode(nameBytes);
}
interface LocalExpect {
    method: number;
    compressedSize: number;
    uncompressedSize: number;
    entryName: string;
    limits: SecurityLimits;
}
/**
 *
 * @param {Uint8Array} input - The input value.
 * @param {DataView} view - The view value.
 * @param {number} localOffset - The localOffset value.
 * @param {LocalExpect} expect - The expect value.
 * @returns {*} The result.
 */
async function readLocalFileData(input: Uint8Array, view: DataView, localOffset: number, expect: LocalExpect): Promise<Uint8Array> {
    if (localOffset + 30 > input.byteLength) {
        throw new InvalidPackageError(`ZIP local header for "${expect.entryName}" is truncated`);
    }
    if (view.getUint32(localOffset, true) !== SIG_LOC) {
        throw new InvalidPackageError(`ZIP local header signature mismatch for "${expect.entryName}"`);
    }
    const gpFlags: number = view.getUint16(localOffset + 6, true);
    const method: number = view.getUint16(localOffset + 8, true);
    const nameLen: number = view.getUint16(localOffset + 26, true);
    const extraLen: number = view.getUint16(localOffset + 28, true);
    const dataStart: number = localOffset + 30 + nameLen + extraLen;
    if (dataStart > input.byteLength) {
        throw new InvalidPackageError(`ZIP local file data for "${expect.entryName}" is out of range`);
    }
    if ((gpFlags & GP_ENCRYPTED) !== 0) {
        throw new EncryptedPackageError(`ZIP entry "${expect.entryName}" is encrypted; encrypted packages are not opened`);
    }
    if (method !== expect.method) {
        throw new InvalidPackageError(`ZIP local method does not match central directory for "${expect.entryName}"`);
    }
    const compressed: Uint8Array = input.subarray(dataStart, dataStart + expect.compressedSize);
    if (compressed.byteLength !== expect.compressedSize) {
        throw new InvalidPackageError(`ZIP compressed data truncated for "${expect.entryName}"`);
    }
    if (method === METHOD_STORE) {
        return compressed.slice();
    }
    if (method === METHOD_DEFLATE) {
        return inflateRaw(compressed, expect.uncompressedSize, expect.limits, expect.entryName);
    }
    throw new InvalidPackageError(`ZIP compression method ${method} is not supported for "${expect.entryName}"`);
}
/**
 *
 * @param {Uint8Array} compressed - The compressed value.
 * @param {number} expectedSize - The expectedSize value.
 * @param {SecurityLimits} limits - The limits value.
 * @param {string} entryName - The entryName value.
 * @returns {*} The result.
 */
function readLocalFileDataSync(input: Uint8Array, view: DataView, localOffset: number, expect: LocalExpect): Uint8Array {
    if (localOffset + 30 > input.byteLength) {
        throw new InvalidPackageError(`ZIP local header for "${expect.entryName}" is truncated`);
    }
    if (view.getUint32(localOffset, true) !== SIG_LOC) {
        throw new InvalidPackageError(`ZIP local header signature mismatch for "${expect.entryName}"`);
    }
    const gpFlags: number = view.getUint16(localOffset + 6, true);
    const method: number = view.getUint16(localOffset + 8, true);
    const nameLen: number = view.getUint16(localOffset + 26, true);
    const extraLen: number = view.getUint16(localOffset + 28, true);
    const dataStart: number = localOffset + 30 + nameLen + extraLen;
    if (dataStart > input.byteLength) {
        throw new InvalidPackageError(`ZIP local file data for "${expect.entryName}" is out of range`);
    }
    if ((gpFlags & GP_ENCRYPTED) !== 0) {
        throw new EncryptedPackageError(`ZIP entry "${expect.entryName}" is encrypted; encrypted packages are not opened`);
    }
    if (method !== expect.method) {
        throw new InvalidPackageError(`ZIP local method does not match central directory for "${expect.entryName}"`);
    }
    const compressed: Uint8Array = input.subarray(dataStart, dataStart + expect.compressedSize);
    if (compressed.byteLength !== expect.compressedSize) {
        throw new InvalidPackageError(`ZIP compressed data truncated for "${expect.entryName}"`);
    }
    if (method === METHOD_STORE) {
        return compressed.slice();
    }
    if (method === METHOD_DEFLATE) {
        return inflateRawSync(compressed, expect.uncompressedSize, expect.limits, expect.entryName);
    }
    throw new InvalidPackageError(`ZIP compression method ${method} is not supported for "${expect.entryName}"`);
}
async function inflateRaw(compressed: Uint8Array, expectedSize: number, limits: SecurityLimits, entryName: string): Promise<Uint8Array> {
    if (typeof DecompressionStream !== 'function') {
        throw new InvalidPackageError('DecompressionStream is not available; cannot inflate deflated ZIP entries');
    }
    try {
        const ds: DecompressionStream = new DecompressionStream('deflate-raw');
        const copy: Uint8Array = new Uint8Array(compressed.byteLength);
        copy.set(compressed);
        const stream: ReadableStream<Uint8Array> = new Blob([copy]).stream().pipeThrough(ds);
        const ab: ArrayBuffer = await new Response(stream).arrayBuffer();
        if (ab.byteLength > expectedSize) {
            throw new PackageLimitError('singlePartUncompressedBytes', {
                partName: entryName,
                actual: ab.byteLength
            });
        }
        if (ab.byteLength > limits.singlePartUncompressedBytes) {
            throw new PackageLimitError('singlePartUncompressedBytes', {
                partName: entryName,
                actual: ab.byteLength
            });
        }
        return new Uint8Array(ab);
    }
    catch (err) {
        if (err instanceof PackageLimitError || err instanceof EncryptedPackageError) {
            throw err;
        }
        throw new InvalidPackageError(`Failed to inflate ZIP entry: ${err instanceof Error ? err.message : String(err)}`);
    }
}
