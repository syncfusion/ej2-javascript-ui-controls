import { arrayAt } from '../util/es5-compat';

/**
 * CRC-32 (ISO 3309 / ZIP) for local-file and central-directory headers.
 */
const TABLE: Uint32Array = /* @__PURE__ */ ((): Uint32Array => {
    const table: Uint32Array = new Uint32Array(256);
    for (let i: number = 0; i < 256; i++) {
        let c: number = i;
        for (let k: number = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table.set([c >>> 0], i);
    }
    return table;
})();
/**
 * Computes the ZIP CRC-32 of a byte sequence.
 *
 * @param {Uint8Array} data - Octets to checksum.
 * @returns {number} Unsigned 32-bit CRC.
 */
export function crc32(data: Uint8Array): number {
    let c: number = 0xffffffff;
    for (let i: number = 0; i < data.length; i++) {
        const byteRaw: number | undefined = arrayAt(data, i);
        const byte: number = byteRaw !== undefined ? byteRaw : 0;
        const idx: number = (c ^ byte) & 0xff;
        const tableValRaw: number | undefined = arrayAt(TABLE, idx);
        const tableVal: number = tableValRaw !== undefined ? tableValRaw : 0;
        c = tableVal ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}
