/**
 * ZIP writer for OPC packages, backed by `@syncfusion/ej2-compression` `ZipArchive`.
 *
 * @private
 */

import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { IoError } from '../errors';

/**
 * `ZipArchive` in `@syncfusion/ej2-compression` reads item data through the browser `FileReader`
 * API. Node.js has no `FileReader`, so in that environment the archive is written with the
 * dependency-free STORE writer below instead.
 *
 * @returns {boolean} True when the browser `Blob`/`FileReader` APIs are available.
 * @private
 */
function hasBrowserBlobApi(): boolean {
    return typeof FileReader !== 'undefined' && typeof Blob !== 'undefined';
}

const SIG_LFH: number = 0x04034b50;
const SIG_CFH: number = 0x02014b50;
const SIG_EOCD: number = 0x06054b50;
const ZIP_VERSION: number = 20;
const UTF8_FLAG: number = 0x0800;

let crcTable: Uint32Array | undefined;

/**
 * Computes the CRC-32 checksum of a byte array.
 *
 * @param {Uint8Array} data - The bytes.
 * @returns {number} The unsigned CRC-32.
 * @private
 */
function crc32(data: Uint8Array): number {
    if (!crcTable) {
        crcTable = new Uint32Array(256);
        for (let n: number = 0; n < 256; n++) {
            let c: number = n;
            for (let k: number = 0; k < 8; k++) {
                c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
            }
            crcTable[n as number] = c >>> 0;
        }
    }
    let crc: number = 0xffffffff;
    for (let i: number = 0; i < data.length; i++) {
        crc = crcTable[(crc ^ data[i as number]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Writes a ZIP archive using STORE (method 0) without any browser API.
 *
 * @param {ReadonlyArray<ZipWriteEntry>} entries - The entries to write.
 * @returns {Uint8Array} The ZIP bytes.
 * @private
 */
function writeStoredZip(entries: ReadonlyArray<ZipWriteEntry>): Uint8Array {
    const encoder: TextEncoder = new TextEncoder();
    const parts: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    let offset: number = 0;
    for (const entry of entries) {
        const name: Uint8Array = encoder.encode(entry.name);
        const crc: number = crc32(entry.data);
        const size: number = entry.data.byteLength;
        const local: Uint8Array = new Uint8Array(30 + name.length + size);
        const lv: DataView = new DataView(local.buffer);
        lv.setUint32(0, SIG_LFH, true);
        lv.setUint16(4, ZIP_VERSION, true);
        lv.setUint16(6, UTF8_FLAG, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, size, true);
        lv.setUint32(22, size, true);
        lv.setUint16(26, name.length, true);
        local.set(name, 30);
        local.set(entry.data, 30 + name.length);
        const cd: Uint8Array = new Uint8Array(46 + name.length);
        const cv: DataView = new DataView(cd.buffer);
        cv.setUint32(0, SIG_CFH, true);
        cv.setUint16(4, ZIP_VERSION, true);
        cv.setUint16(6, ZIP_VERSION, true);
        cv.setUint16(8, UTF8_FLAG, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, size, true);
        cv.setUint32(24, size, true);
        cv.setUint16(28, name.length, true);
        cv.setUint32(42, offset, true);
        cd.set(name, 46);
        parts.push(local);
        central.push(cd);
        offset += local.length;
    }
    let cdSize: number = 0;
    for (const c of central) {
        cdSize += c.length;
    }
    const eocd: Uint8Array = new Uint8Array(22);
    const ev: DataView = new DataView(eocd.buffer);
    ev.setUint32(0, SIG_EOCD, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    const all: Uint8Array[] = [...parts, ...central, eocd];
    let total: number = 0;
    for (const p of all) {
        total += p.length;
    }
    const out: Uint8Array = new Uint8Array(total);
    let pos: number = 0;
    for (const p of all) {
        out.set(p, pos);
        pos += p.length;
    }
    return out;
}

/**
 * Entry to include in a written archive.
 */
export interface ZipWriteEntry {
    /** Forward-slash path (no leading slash required; OPC names are mapped by caller). */
    readonly name: string;
    /** Uncompressed payload. */
    readonly data: Uint8Array;
    /**
     * Archive-level hint: when every entry sets this, the archive is written without compression.
     * `ZipArchive` applies one compression level per archive, so a mixed set is deflated.
     */
    readonly storeUncompressed?: boolean;
}

/**
 * Build a ZIP file buffer from entries.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function writeZip(entries: ReadonlyArray<ZipWriteEntry>): Promise<Uint8Array> {
    if (!hasBrowserBlobApi()) {
        // Node.js: no FileReader, so ZipArchive cannot be used. Entries are stored uncompressed.
        if (entries.length === 0) {
            return Promise.reject(new IoError('Cannot write a ZIP archive without entries'));
        }
        for (const entry of entries) {
            if (entry.name.length === 0) {
                return Promise.reject(new IoError('ZIP entry name must not be empty'));
            }
            if (entry.name.includes('\\')) {
                return Promise.reject(new IoError(`ZIP entry name must use forward slashes: "${entry.name}"`));
            }
        }
        return Promise.resolve(writeStoredZip(entries));
    }
    const archive: ZipArchive = new ZipArchive();
    try {
        for (const entry of entries) {
            if (entry.name.length === 0) {
                throw new IoError('ZIP entry name must not be empty');
            }
            if (entry.name.includes('\\')) {
                throw new IoError(`ZIP entry name must use forward slashes: "${entry.name}"`);
            }
            archive.addItem(new ZipArchiveItem(new Blob([entry.data]), entry.name));
        }
        const storeAll: boolean = entries.length > 0 && entries.every((e: ZipWriteEntry): boolean => e.storeUncompressed === true);
        archive.compressionLevel = storeAll ? 'NoCompression' : 'Normal';
        if (entries.length === 0) {
            return Promise.reject(new IoError('Cannot write a ZIP archive without entries'));
        }
    } catch (cause) {
        archive.destroy();
        return Promise.reject(cause instanceof IoError ? cause : new IoError('Failed to prepare ZIP archive', { cause }));
    }

    return archive.saveAsBlob().then(
        (blob: Blob): Promise<Uint8Array> =>
            new Promise<Uint8Array>((resolve: (value: Uint8Array) => void, reject: (reason: Error) => void): void => {
                const reader: FileReader = new FileReader();
                reader.onload = (): void => {
                    archive.destroy();
                    resolve(new Uint8Array(reader.result as ArrayBuffer));
                };
                reader.onerror = (): void => reject(new IoError('Failed to read ZIP archive output'));
                reader.readAsArrayBuffer(blob);
            }),
        (cause: Error): Promise<Uint8Array> => Promise.reject(new IoError('Failed to write ZIP archive', { cause }))
    );
}

/**
 * Build a ZIP using only store (method 0). Useful for deterministic tests.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function writeZipStored(entries: ReadonlyArray<ZipWriteEntry>): Promise<Uint8Array> {
    return writeZip(
        entries.map((e: ZipWriteEntry): { storeUncompressed: true; name: string; data: Uint8Array } => ({ ...e, storeUncompressed: true }))
    );
}
