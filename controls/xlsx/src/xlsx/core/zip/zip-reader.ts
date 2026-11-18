/**
 * ZIP reader for OPC packages, backed by `@syncfusion/ej2-compression`.
 *
 * Central-directory records are read with `ZipArchiveItemHelper` and inflated by the
 * library's `CompressedStreamReader`. Safety limits and OLE/CFB detection stay here.
 *
 * @private
 */

import { Stream, ZipArchive, ZipArchiveItemHelper } from '@syncfusion/ej2-compression';
import { InvalidPackageError, PackageLimitError, UnsupportedEncryptionError } from '../errors';
import { resolveZipLimits, ZipReadOptions } from './limits';

const SIG_CENTRAL: number = 0x02014b50;
const SIG_EOCD: number = 0x06054b50;
const EOCD_SEARCH_BYTES: number = 65557;
const EOCD_MIN_BYTES: number = 22;

/** CFB / OLE compound document magic (`D0 CF 11 E0 A1 B1 1A E1`). */
const CFB_MAGIC: number[] = [0xd0, 0xcf, 0x11, 0xe0];

const METHOD_STORED: number = 0;
const METHOD_DEFLATED: number = 8;

/**
 * Uncompressed ZIP entry.
 */
export interface ZipEntry {
    /** Entry path using forward slashes (ZIP name as stored). */
    readonly name: string;
    /** Uncompressed payload. */
    readonly data: Uint8Array;
    /** Compression method used on disk (informational). */
    readonly compressionMethod: number;
}

/**
 * Read all uncompressed entries from a ZIP buffer.
 *
 * @param {Uint8Array} input - The input parameter.
 * @param {ZipReadOptions} options - The options parameter.
 * @returns {Promise} - Returns the result.
 */
export function readZipEntries(input: Uint8Array, options?: ZipReadOptions): Promise<ReadonlyArray<ZipEntry>> {
    try {
        return Promise.resolve(readEntries(input, options));
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * readEntries function.
 *
 * @param {Uint8Array} input - The input parameter.
 * @param {ZipReadOptions} options - The options parameter.
 * @returns {ZipEntry[]} - Returns the result.
 */
function readEntries(input: Uint8Array, options?: ZipReadOptions): ZipEntry[] {
    if (input.byteLength === 0) {
        throw new InvalidPackageError('Package buffer is empty');
    }
    if (looksLikeCfb(input)) {
        throw new UnsupportedEncryptionError(
            'Package is an OLE compound document (CFB); encrypted or legacy Office packages are not supported'
        );
    }
    if (input.byteLength < EOCD_MIN_BYTES) {
        throw new InvalidPackageError('Buffer too small to be a ZIP package');
    }

    const limits: any = resolveZipLimits(options);
    // The library's Stream wraps `input.buffer`, so it needs a standalone, exactly-sized buffer.
    const stream: Stream = new Stream(new Uint8Array(input));
    const entries: ZipEntry[] = [];

    try {
        const eocd: number = ZipArchive.findValueFromEnd(stream, SIG_EOCD, EOCD_SEARCH_BYTES);
        if (eocd < 0) {
            throw new InvalidPackageError('ZIP end of central directory signature not found');
        }
        const view: DataView = new DataView(stream.inputStream.buffer);
        const entryCount: number = view.getUint16(eocd + 10, true);
        const cdSize: number = view.getUint32(eocd + 12, true);
        const cdOffset: number = view.getUint32(eocd + 16, true);
        if (entryCount === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
            throw new InvalidPackageError('ZIP64 packages are not supported');
        }
        if (view.getUint16(eocd + 4, true) !== 0 || view.getUint16(eocd + 6, true) !== 0) {
            throw new InvalidPackageError('Multi-disk ZIP packages are not supported');
        }
        if (entryCount > limits.maxEntryCount) {
            throw new PackageLimitError(`ZIP entry count ${entryCount} exceeds limit ${limits.maxEntryCount}`);
        }
        if (cdOffset + cdSize > input.byteLength) {
            throw new InvalidPackageError('Central directory extends past end of package');
        }

        const helpers: ZipArchiveItemHelper[] = [];
        stream.position = cdOffset;
        for (let i: number = 0; i < entryCount; i += 1) {
            if (ZipArchive.ReadInt32(stream) !== SIG_CENTRAL) {
                throw new InvalidPackageError('Invalid central directory signature');
            }
            const helper: ZipArchiveItemHelper = new ZipArchiveItemHelper();
            helper.readCentralDirectoryData(stream);
            helpers.push(helper);
        }

        let total: number = 0;
        for (const helper of helpers) {
            const name: string = helper.name;
            const method: number = helper['compressionMethod'];
            const compressed: number = helper['compressedSize'];
            const original: number = helper['originalSize'];
            if (compressed < 0 || original < 0) {
                throw new InvalidPackageError(`Invalid size for entry "${name}"`, { partName: name });
            }
            if (compressed > limits.maxEntryCompressedBytes) {
                throw new PackageLimitError(
                    `Compressed entry "${name}" size ${compressed} exceeds limit ${limits.maxEntryCompressedBytes}`,
                    { partName: name }
                );
            }
            if (original > limits.maxEntryUncompressedBytes) {
                throw new PackageLimitError(
                    `Uncompressed entry "${name}" size ${original} exceeds limit ${limits.maxEntryUncompressedBytes}`,
                    { partName: name }
                );
            }
            total += original;
            if (total > limits.maxUncompressedBytes) {
                throw new PackageLimitError(`Total uncompressed size exceeds limit ${limits.maxUncompressedBytes}`);
            }
            if (method !== METHOD_STORED && method !== METHOD_DEFLATED) {
                throw new InvalidPackageError(`Unsupported ZIP compression method ${method} for entry "${name}"`, { partName: name });
            }

            let data: Uint8Array = new Uint8Array(0);
            if (compressed > 0 || original > 0) {
                helper.readData(stream, false);
                helper.decompressData();
                const raw: Uint8Array = method === METHOD_STORED ? helper.compressedStream : helper.unCompressedStream;
                data = raw === undefined ? data : raw;
            }
            if (method === METHOD_DEFLATED && data.byteLength !== original) {
                throw new InvalidPackageError(`Inflated size ${data.byteLength} does not match expected ${original}`, { partName: name });
            }
            if (!(name.endsWith('/') && data.byteLength === 0)) {
                entries.push({ name, data, compressionMethod: method });
            }
        }
    } catch (error) {
        if (error instanceof InvalidPackageError || error instanceof PackageLimitError) {
            throw error;
        }
        throw new InvalidPackageError('Failed to read ZIP package', { cause: error });
    }
    return entries;
}

/**
 * looksLikeCfb function.
 *
 * @param {Uint8Array} input - The input parameter.
 * @returns {boolean} - Returns the result.
 */
function looksLikeCfb(input: Uint8Array): boolean {
    if (input.byteLength < 8) {
        return false;
    }
    return input[0] === CFB_MAGIC[0] && input[1] === CFB_MAGIC[1] && input[2] === CFB_MAGIC[2] && input[3] === CFB_MAGIC[3];
}
