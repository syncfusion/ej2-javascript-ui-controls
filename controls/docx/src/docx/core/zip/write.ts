import { CompressedStreamWriter } from '@syncfusion/ej2-compression';
import { PackageError } from '../errors/docx-error';
import { crc32 } from './crc32';
import { assertSafeZipItemName } from './names';
import { ZipEntry } from './zip-entry';
const SIG_LFH: number = 0x04034b50;
const SIG_CFH: number = 0x02014b50;
const SIG_EOCD: number = 0x06054b50;
const METHOD_STORE: number = 0;
const METHOD_DEFLATE: number = 8;
const DEFLATE_CHUNK: number = 16384;
const VERSION: number = 20;
function concat(parts: ReadonlyArray<Uint8Array>): Uint8Array {
    let total: number = 0;
    for (const part of parts) {
        total += part.byteLength;
    }
    const out: Uint8Array = new Uint8Array(total);
    let offset: number = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.byteLength;
    }
    return out;
}
function deflate(data: Uint8Array): Uint8Array {
    const writer: CompressedStreamWriter = new CompressedStreamWriter(true);
    for (let start: number = 0; start < data.byteLength; start += DEFLATE_CHUNK) {
        const end: number = Math.min(start + DEFLATE_CHUNK, data.byteLength);
        writer.write(data.subarray(start, end), 0, end - start);
    }
    writer.close();
    const packed: Uint8Array = concat(writer.compressedData);
    writer.destroy();
    return packed;
}
function u16(value: number): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(2);
    new DataView(bytes.buffer).setUint16(0, value, true);
    return bytes;
}
function u32(value: number): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value, true);
    return bytes;
}
/**
 * Writes a ZIP archive, deflating each entry with `@syncfusion/ej2-compression`
 * (method 8) and falling back to STORE (method 0) when deflate does not shrink it.
 * Inflated payload bytes are unchanged (the format specification).
 * OPC ZIP item names are ASCII (ECMA-376-2 §7.3.3).
 *
 * @param {ReadonlyArray<ZipEntry>} entries - The entries.
 * @returns {Uint8Array} The result.
 * @private
 */
export function writeZip(entries: ReadonlyArray<ZipEntry>): Uint8Array {
    const encoder: TextEncoder = new TextEncoder();
    const seen: Map<string, string> = new Map<string, string>();
    const prepared: {
        nameBytes: Uint8Array;
        name: string;
        data: Uint8Array;
        stored: Uint8Array;
        method: number;
        crc: number;
    }[] = [];
    for (const entry of entries) {
        assertSafeZipItemName(entry.name);
        if (!/^[\u0020-\u007e]+$/.test(entry.name)) {
            throw new PackageError('package/invalid-part-name', `ZIP item name is not ASCII as required by ECMA-376-2 §7.3.3: ${entry.name}`);
        }
        const lower: string = entry.name.toLowerCase();
        const previous: string = seen.get(lower);
        if (previous !== undefined) {
            throw new PackageError('package/duplicate-zip-entry', `Duplicate ZIP item name ${entry.name} (conflicts with ${previous})`);
        }
        seen.set(lower, entry.name);
        const packed: Uint8Array = deflate(entry.data);
        const useDeflate: boolean = packed.byteLength < entry.data.byteLength;
        prepared.push({
            stored: useDeflate ? packed : entry.data,
            method: useDeflate ? METHOD_DEFLATE : METHOD_STORE,
            nameBytes: encoder.encode(entry.name),
            name: entry.name,
            data: entry.data,
            crc: crc32(entry.data)
        });
    }
    if (prepared.length > 0xffff) {
        throw new PackageError('package/invalid-zip', 'Too many ZIP entries to encode in a non-ZIP64 archive');
    }
    const localParts: Uint8Array[] = [];
    const centralParts: Uint8Array[] = [];
    let offset: number = 0;
    for (const item of prepared) {
        const local: Uint8Array = concat([
            u32(SIG_LFH),
            u16(VERSION),
            u16(0),
            u16(item.method),
            u16(0),
            u16(0),
            u32(item.crc),
            u32(item.stored.byteLength),
            u32(item.data.byteLength),
            u16(item.nameBytes.byteLength),
            u16(0),
            item.nameBytes,
            item.stored
        ]);
        localParts.push(local);
        const central: Uint8Array = concat([
            u32(SIG_CFH),
            u16(VERSION),
            u16(VERSION),
            u16(0),
            u16(item.method),
            u16(0),
            u16(0),
            u32(item.crc),
            u32(item.stored.byteLength),
            u32(item.data.byteLength),
            u16(item.nameBytes.byteLength),
            u16(0),
            u16(0),
            u16(0),
            u16(0),
            u32(0),
            u32(offset),
            item.nameBytes
        ]);
        centralParts.push(central);
        offset += local.byteLength;
    }
    const centralDirectory: Uint8Array = concat(centralParts);
    const eocd: Uint8Array = concat([
        u32(SIG_EOCD),
        u16(0),
        u16(0),
        u16(prepared.length),
        u16(prepared.length),
        u32(centralDirectory.byteLength),
        u32(offset),
        u16(0)
    ]);
    return concat([...localParts, centralDirectory, eocd]);
}
