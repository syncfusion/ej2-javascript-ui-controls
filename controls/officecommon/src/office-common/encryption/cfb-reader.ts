/*
 * Minimal OLE Compound File Binary (CFB) reader for OFFCRYPTO streams.
 *
 * @remarks
 * Reads only what is required to extract root storage streams named
 * `EncryptionInfo` and `EncryptedPackage` ([MS-OFFCRYPTO] §2.3.4.4,
 * §2.3.4.10). Layout fields follow the well-known CFB header / FAT /
 * directory structure used by ECMA-376 encrypted packages. This is **not** a
 * full [MS-CFB] implementation — no local MS-CFB corpus is present under
 * `specs/`; only the subset needed for named-stream extraction is coded.
 *
 * Fail closed on truncated headers, broken FAT chains, or missing streams.
 *
 * @private
 */

import { arrayItem } from '../core/array-item';
import { Literal } from '../core/literal-type';
import { EncryptedPackageError } from './errors';
import { STREAM_ENCRYPTED_PACKAGE, STREAM_ENCRYPTION_INFO } from './agile-constants';

/** OLE CFB header signature ([MS-CFB]). */
const OLE_CFB_SIGNATURE: ReadonlyArray<number> = Object.freeze([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);


/** Sector size shift for 512-byte sectors (common default). */
const SECTOR_SHIFT_512: Literal<9> = 9;
/** Sector size shift for 4096-byte sectors. */
const SECTOR_SHIFT_4096: Literal<12> = 12;

const ENDOFCHAIN: Literal<4294967294> = 0xfffffffe;
const FREESECT: Literal<4294967295> = 0xffffffff;
const FATSECT: Literal<4294967293> = 0xfffffffd;
const DIFSECT: Literal<4294967292> = 0xfffffffc;

const DIR_ENTRY_SIZE: Literal<128> = 128;
const MAX_DIR_ENTRIES: Literal<65536> = 65536;
const MAX_FAT_SECTORS: Literal<1048576> = 1048576;

export interface OffCryptoStreams {
    readonly encryptionInfo: Uint8Array;
    readonly encryptedPackage: Uint8Array;
}

/**
 * Extracts `\EncryptionInfo` and `\EncryptedPackage` from an OFFCRYPTO CFB.
 *
 * @param {Uint8Array} input - Entire OLE compound-file bytes.
 * @returns {OffCryptoStreams} The result.
 * @throws {EncryptedPackageError} When structure is incomplete or streams missing.
 */
export function readOffCryptoStreams(input: Uint8Array): OffCryptoStreams {
    if (input.byteLength < 512) {
        throw new EncryptedPackageError('OFFCRYPTO package is truncated (CFB header)');
    }
    const head: number[] = Array.prototype.slice.call(input, 0, OLE_CFB_SIGNATURE.length);
    if (head.join(',') !== OLE_CFB_SIGNATURE.join(',')) {
        throw new EncryptedPackageError('Package is not a valid OLE compound file');
    }

    const view: DataView = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const sectorShift: number = view.getUint16(30, true);
    if (sectorShift !== SECTOR_SHIFT_512 && sectorShift !== SECTOR_SHIFT_4096) {
        throw new EncryptedPackageError('Unsupported CFB sector size');
    }
    const sectorSize: number = 1 << sectorShift;
    const miniSectorShift: number = view.getUint16(32, true);
    if (miniSectorShift !== 6) {
    // Standard mini-sector is 64 bytes; refuse unknown layouts.
        throw new EncryptedPackageError('Unsupported CFB mini-sector size');
    }
    const miniSectorSize: number = 1 << miniSectorShift;
    const miniStreamCutoff: number = view.getUint32(56, true);
    const firstDirSector: number = view.getUint32(48, true);
    const firstMiniFatSector: number = view.getUint32(60, true);
    const miniFatSectorCount: number = view.getUint32(64, true);
    const fatSectorCount: number = view.getUint32(44, true);
    const firstDifatSector: number = view.getUint32(68, true);
    const difatSectorCount: number = view.getUint32(72, true);

    if (fatSectorCount > MAX_FAT_SECTORS) {
        throw new EncryptedPackageError('CFB FAT is unreasonably large');
    }

    const difat: number[] = [];
    for (let i: number = 0; i < 109; i++) {
        const sect: number = view.getUint32(76 + i * 4, true);
        if (sect !== FREESECT) {
            difat.push(sect);
        }
    }

    let difatSect: number = firstDifatSector;
    for (let n: number = 0; n < difatSectorCount; n++) {
        if (difatSect === ENDOFCHAIN || difatSect === FREESECT) {
            break;
        }
        const offset: number = sectorOffset(difatSect, sectorSize);
        ensureRange(input, offset, sectorSize);
        const entriesPerSector: number = sectorSize / 4 - 1;
        for (let i: number = 0; i < entriesPerSector; i++) {
            const sect: number = view.getUint32(offset + i * 4, true);
            if (sect !== FREESECT) {
                difat.push(sect);
            }
        }
        difatSect = view.getUint32(offset + entriesPerSector * 4, true);
    }

    if (difat.length < fatSectorCount) {
        throw new EncryptedPackageError('CFB DIFAT is truncated');
    }

    const fat: number[] = [];
    for (let i: number = 0; i < fatSectorCount; i++) {
        const fatSect: number = arrayItem(difat, i);
        if (fatSect === undefined) {
            throw new EncryptedPackageError('CFB DIFAT is truncated');
        }
        const offset: number = sectorOffset(fatSect, sectorSize);
        ensureRange(input, offset, sectorSize);
        const entries: number = sectorSize / 4;
        for (let j: number = 0; j < entries; j++) {
            fat.push(view.getUint32(offset + j * 4, true));
        }
    }

    const directoryBytes: Uint8Array = readChain(input, view, fat, firstDirSector, sectorSize, undefined);
    if (directoryBytes.byteLength < DIR_ENTRY_SIZE) {
        throw new EncryptedPackageError('CFB directory is empty');
    }
    const entryCount: number = Math.min(
        Math.floor(directoryBytes.byteLength / DIR_ENTRY_SIZE),
        MAX_DIR_ENTRIES
    );
    const dirView: DataView = new DataView(
        directoryBytes.buffer,
        directoryBytes.byteOffset,
        directoryBytes.byteLength
    );

    interface DirEntry {
        name: string;
        objectType: number;
        startSector: number;
        streamSize: number;
        childId: number;
    }

    const entries: DirEntry[] = [];
    for (let i: number = 0; i < entryCount; i++) {
        const base: number = i * DIR_ENTRY_SIZE;
        const nameLength: number = dirView.getUint16(base + 64, true);
        // nameLength includes the terminating null (2 bytes) when non-zero.
        const charCount: number = nameLength >= 2 ? Math.floor((nameLength - 2) / 2) : 0;
        let name: string = '';
        for (let c: number = 0; c < charCount && c < 32; c++) {
            name += String.fromCharCode(dirView.getUint16(base + c * 2, true));
        }
        const objectType: number = dirView.getUint8(base + 66);
        const childId: number = dirView.getUint32(base + 76, true);
        const startSector: number = dirView.getUint32(base + 116, true);
        // Stream size is 8 bytes LE; OFFCRYPTO streams fit in lower 32 bits for our limits.
        const streamSizeLow: number = dirView.getUint32(base + 120, true);
        const streamSizeHigh: number = dirView.getUint32(base + 124, true);
        if (streamSizeHigh !== 0) {
            throw new EncryptedPackageError('OFFCRYPTO stream exceeds supported size');
        }
        entries.push({
            name,
            objectType,
            startSector,
            streamSize: streamSizeLow,
            childId
        });
    }

    const root: DirEntry = entries[0];
    if (root === undefined || root.objectType !== 5) {
        throw new EncryptedPackageError('CFB root storage is missing');
    }

    // Collect names under root via sibling tree walk (left/right/child).
    const found: Map<string, DirEntry> = new Map<string, DirEntry>();
    const visited: Set<number> = new Set<number>();
    const walk: (id: number) => void = (id: number): void => {
        if (id > 0xfffffffa || id >= entries.length || visited.has(id)) {
            return;
        }
        visited.add(id);
        const e: DirEntry = arrayItem(entries, id);
        if (e === undefined) {
            return;
        }
        const left: number = dirView.getUint32(id * DIR_ENTRY_SIZE + 68, true);
        const right: number = dirView.getUint32(id * DIR_ENTRY_SIZE + 72, true);
        walk(left);
        if (e.objectType === 2 /* stream */) {
            found.set(e.name, e);
        }
        walk(right);
        if (e.objectType === 1 /* storage */ || e.objectType === 5 /* root */) {
            walk(e.childId);
        }
    };
    walk(root.childId);

    const infoEntry: DirEntry = found.get(STREAM_ENCRYPTION_INFO);
    const pkgEntry: DirEntry = found.get(STREAM_ENCRYPTED_PACKAGE);
    if (infoEntry === undefined || pkgEntry === undefined) {
        throw new EncryptedPackageError(
            'OFFCRYPTO streams EncryptionInfo and/or EncryptedPackage are missing'
        );
    }

    let miniFat: number[] | undefined;
    let miniStream: Uint8Array | undefined;

    const readStream: (entry: DirEntry) => Uint8Array = (entry: DirEntry): Uint8Array => {
        if (entry.streamSize === 0) {
            return new Uint8Array(0);
        }
        if (entry.streamSize < miniStreamCutoff && entry !== root) {
            if (miniFat === undefined) {
                miniFat = readMiniFat(input, view, fat, firstMiniFatSector, miniFatSectorCount, sectorSize);
                // Root stream size may be larger than mini data; chain until end.
                miniStream = readChain(input, view, fat, root.startSector, sectorSize, undefined);
            }
            if (miniStream === undefined) {
                throw new EncryptedPackageError('CFB mini-stream is unavailable');
            }
            return readMiniChain(
                miniStream,
                miniFat,
                entry.startSector,
                miniSectorSize,
                entry.streamSize
            );
        }
        return readChain(input, view, fat, entry.startSector, sectorSize, entry.streamSize);
    };

    return {
        encryptionInfo: readStream(infoEntry),
        encryptedPackage: readStream(pkgEntry)
    };
}

/**
 * The sector offset.
 *
 * @param {number} sectorIndex - The sector index.
 * @param {number} sectorSize - The sector size.
 * @returns {number} The result.
 */
function sectorOffset(sectorIndex: number, sectorSize: number): number {
    // Sector 0 starts after the 512-byte header for 512-byte sectors; for 4096,
    // header occupies the first sector region — offset is still (sector+1)*size
    // relative to file start for standard CFB.
    return (sectorIndex + 1) * sectorSize;
}

/**
 * The ensure range.
 *
 * @param {Uint8Array} input - The input.
 * @param {number} offset - The offset.
 * @param {number} length - The length.
 * @returns {void} Nothing is returned.
 */
function ensureRange(input: Uint8Array, offset: number, length: number): void {
    if (offset < 0 || length < 0 || offset + length > input.byteLength) {
        throw new EncryptedPackageError('OFFCRYPTO package is truncated (CFB sector)');
    }
}

/**
 * The read chain.
 *
 * @param {Uint8Array} input - The input.
 * @param {DataView} view - The view.
 * @param {number[]} fat - The fat.
 * @param {number} startSector - The start sector.
 * @param {number} sectorSize - The sector size.
 * @param {number | undefined} maxBytes - The max bytes.
 * @returns {Uint8Array} The result.
 */
function readChain(
    input: Uint8Array,
    view: DataView,
    fat: number[],
    startSector: number,
    sectorSize: number,
    maxBytes: number | undefined
): Uint8Array {
    if (startSector === ENDOFCHAIN || startSector === FREESECT) {
        return new Uint8Array(0);
    }
    const chunks: Uint8Array[] = [];
    let total: number = 0;
    let sector: number = startSector;
    let guard: number = 0;
    const maxGuard: number = fat.length + 2;
    while (sector !== ENDOFCHAIN && sector !== FREESECT) {
        if (guard++ > maxGuard) {
            throw new EncryptedPackageError('CFB FAT chain is cyclic or unbounded');
        }
        if (sector === FATSECT || sector === DIFSECT) {
            throw new EncryptedPackageError('CFB FAT chain contains reserved sector');
        }
        if (sector < 0 || sector >= fat.length) {
            // Allow reading last data sector without FAT entry for short files: still need bounds.
            const offsetTry: number = sectorOffset(sector, sectorSize);
            if (offsetTry + sectorSize > input.byteLength && offsetTry >= input.byteLength) {
                throw new EncryptedPackageError('CFB FAT chain sector out of range');
            }
        }
        const offset: number = sectorOffset(sector, sectorSize);
        ensureRange(input, offset, Math.min(sectorSize, input.byteLength - offset));
        const take: number = Math.min(sectorSize, input.byteLength - offset);
        const slice: Uint8Array = input.subarray(offset, offset + take);
        chunks.push(slice);
        total += slice.byteLength;
        if (maxBytes !== undefined && total >= maxBytes) {
            break;
        }
        if (sector >= fat.length) {
            throw new EncryptedPackageError('CFB FAT chain sector out of range');
        }
        const nextSector: number = arrayItem(fat, sector);
        if (nextSector === undefined) {
            throw new EncryptedPackageError('CFB FAT chain sector out of range');
        }
        sector = nextSector;
    }
    const out: Uint8Array = concat(chunks);
    if (maxBytes !== undefined) {
        if (out.byteLength < maxBytes) {
            throw new EncryptedPackageError('OFFCRYPTO stream data is truncated');
        }
        return out.subarray(0, maxBytes);
    }
    return out;
}

/**
 * The read mini fat.
 *
 * @param {Uint8Array} input - The input.
 * @param {DataView} view - The view.
 * @param {number[]} fat - The fat.
 * @param {number} firstMiniFatSector - The first mini fat sector.
 * @param {number} miniFatSectorCount - The mini fat sector count.
 * @param {number} sectorSize - The sector size.
 * @returns {number[]} The result.
 */
function readMiniFat(
    input: Uint8Array,
    view: DataView,
    fat: number[],
    firstMiniFatSector: number,
    miniFatSectorCount: number,
    sectorSize: number
): number[] {
    if (miniFatSectorCount === 0 || firstMiniFatSector === ENDOFCHAIN) {
        return [];
    }
    const bytes: Uint8Array = readChain(
        input,
        view,
        fat,
        firstMiniFatSector,
        sectorSize,
        miniFatSectorCount * sectorSize
    );
    const dv: DataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const entries: number[] = [];
    for (let i: number = 0; i + 4 <= bytes.byteLength; i += 4) {
        entries.push(dv.getUint32(i, true));
    }
    return entries;
}

/**
 * The read mini chain.
 *
 * @param {Uint8Array} miniStream - The mini stream.
 * @param {number[]} miniFat - The mini fat.
 * @param {number} startSector - The start sector.
 * @param {number} miniSectorSize - The mini sector size.
 * @param {number} streamSize - The stream size.
 * @returns {Uint8Array} The result.
 */
function readMiniChain(
    miniStream: Uint8Array,
    miniFat: number[],
    startSector: number,
    miniSectorSize: number,
    streamSize: number
): Uint8Array {
    const chunks: Uint8Array[] = [];
    let total: number = 0;
    let sector: number = startSector;
    let guard: number = 0;
    const maxGuard: number = miniFat.length + 2;
    while (sector !== ENDOFCHAIN && sector !== FREESECT && total < streamSize) {
        if (guard++ > maxGuard) {
            throw new EncryptedPackageError('CFB mini-FAT chain is cyclic or unbounded');
        }
        const offset: number = sector * miniSectorSize;
        if (offset >= miniStream.byteLength) {
            throw new EncryptedPackageError('CFB mini-stream is truncated');
        }
        const take: number = Math.min(miniSectorSize, miniStream.byteLength - offset, streamSize - total);
        chunks.push(miniStream.subarray(offset, offset + take));
        total += take;
        if (sector >= miniFat.length) {
            throw new EncryptedPackageError('CFB mini-FAT sector out of range');
        }
        const nextMini: number = arrayItem(miniFat, sector);
        if (nextMini === undefined) {
            throw new EncryptedPackageError('CFB mini-FAT sector out of range');
        }
        sector = nextMini;
    }
    const out: Uint8Array = concat(chunks);
    if (out.byteLength < streamSize) {
        throw new EncryptedPackageError('OFFCRYPTO mini-stream data is truncated');
    }
    return out.subarray(0, streamSize);
}

/**
 * The concat.
 *
 * @param {ReadonlyArray<Uint8Array>} chunks - The chunks.
 * @returns {Uint8Array} The result.
 */
function concat(chunks: ReadonlyArray<Uint8Array>): Uint8Array {
    let total: number = 0;
    for (const c of chunks) {
        total += c.byteLength;
    }
    const out: Uint8Array = new Uint8Array(total);
    let offset: number = 0;
    for (const c of chunks) {
        out.set(c, offset);
        offset += c.byteLength;
    }
    return out;
}
