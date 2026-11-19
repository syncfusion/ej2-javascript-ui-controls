import { arrayAt } from '../util/es5-compat';
/**
 * Minimal ZIP writer for OPC packages (store method only).
 *
 * @remarks
 * Save uses compression method 0 (store) for determinism and to avoid depending
 * on CompressionStream availability. Semantic preservation does not require
 * byte-identical ZIP layout or deflate.
 */
import { crc32 } from './crc32';
import { partNameToZipEntry } from './paths';
const SIG_LOC: number = 0x04034b50;
const SIG_CEN: number = 0x02014b50;
const SIG_EOCD: number = 0x06054b50;
const METHOD_STORE: number = 0;
interface PendingEntry {
    nameBytes: Uint8Array;
    data: Uint8Array;
    crc: number;
    localOffset: number;
}
/**
 * Builds a ZIP archive from absolute OPC part name → bytes.
 *
 * @param {ReadonlyMap<string, Uint8Array>} parts - Map of absolute part URIs to uncompressed content.
 * @returns {Uint8Array} Complete ZIP package octets.
 */
export function writeZip(parts: ReadonlyMap<string, Uint8Array>): Uint8Array {
    const encoder: TextEncoder = new TextEncoder();
    const entries: PendingEntry[] = [];
    // Deterministic order: sorted part names.
    const names: Array<string> = [...parts.keys()].sort((a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0));
    let localSize: number = 0;
    for (let i: number = 0; i < names.length; i++) {
        const partName: string = arrayAt(names, i);
        const data: Uint8Array = parts.get(partName);
        if (data === undefined) {
            continue;
        }
        const entryName: string = partNameToZipEntry(partName);
        const nameBytes: Uint8Array = encoder.encode(entryName);
        const crc: number = crc32(data);
        const localOffset: number = localSize;
        // local header 30 + name + data (store, no extra)
        localSize += 30 + nameBytes.byteLength + data.byteLength;
        entries.push({ nameBytes, data, crc, localOffset });

    }
    let cenSize: number = 0;
    for (let i: number = 0; i < entries.length; i++) {
        const cenEntry: PendingEntry = arrayAt(entries, i);
        cenSize += 46 + cenEntry.nameBytes.byteLength;

    }
    const eocdSize: number = 22;
    const out: Uint8Array = new Uint8Array(localSize + cenSize + eocdSize);
    const view: DataView = new DataView(out.buffer, out.byteOffset, out.byteLength);
    // Local files
    let offset: number = 0;
    for (let i: number = 0; i < entries.length; i++) {
        const localEntry: PendingEntry = arrayAt(entries, i);
        view.setUint32(offset, SIG_LOC, true);
        view.setUint16(offset + 4, 20, true); // version needed
        view.setUint16(offset + 6, 0, true); // flags
        view.setUint16(offset + 8, METHOD_STORE, true);
        view.setUint16(offset + 10, 0, true); // time
        view.setUint16(offset + 12, 0, true); // date
        view.setUint32(offset + 14, localEntry.crc, true);
        view.setUint32(offset + 18, localEntry.data.byteLength, true);
        view.setUint32(offset + 22, localEntry.data.byteLength, true);
        view.setUint16(offset + 26, localEntry.nameBytes.byteLength, true);
        view.setUint16(offset + 28, 0, true); // extra
        offset += 30;
        out.set(localEntry.nameBytes, offset);
        offset += localEntry.nameBytes.byteLength;
        out.set(localEntry.data, offset);
        offset += localEntry.data.byteLength;

    }
    const cdOffset: number = offset;
    for (let i: number = 0; i < entries.length; i++) {
        const outEntry: PendingEntry = arrayAt(entries, i);
        view.setUint32(offset, SIG_CEN, true);
        view.setUint16(offset + 4, 20, true); // version made by
        view.setUint16(offset + 6, 20, true); // version needed
        view.setUint16(offset + 8, 0, true); // flags
        view.setUint16(offset + 10, METHOD_STORE, true);
        view.setUint16(offset + 12, 0, true); // time
        view.setUint16(offset + 14, 0, true); // date
        view.setUint32(offset + 16, outEntry.crc, true);
        view.setUint32(offset + 20, outEntry.data.byteLength, true);
        view.setUint32(offset + 24, outEntry.data.byteLength, true);
        view.setUint16(offset + 28, outEntry.nameBytes.byteLength, true);
        view.setUint16(offset + 30, 0, true); // extra
        view.setUint16(offset + 32, 0, true); // comment
        view.setUint16(offset + 34, 0, true); // disk start
        view.setUint16(offset + 36, 0, true); // int attrs
        view.setUint32(offset + 38, 0, true); // ext attrs
        view.setUint32(offset + 42, outEntry.localOffset, true);
        offset += 46;
        out.set(outEntry.nameBytes, offset);
        offset += outEntry.nameBytes.byteLength;

    }
    const cdSize: number = offset - cdOffset;
    view.setUint32(offset, SIG_EOCD, true);
    view.setUint16(offset + 4, 0, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, entries.length, true);
    view.setUint16(offset + 10, entries.length, true);
    view.setUint32(offset + 12, cdSize, true);
    view.setUint32(offset + 16, cdOffset, true);
    view.setUint16(offset + 20, 0, true); // comment length
    return out;
}
