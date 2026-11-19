const CRC_TABLE: Uint32Array = new Uint32Array(256);

for (let i: number = 0; i < 256; i += 1) {
    let c: number = i;
    for (let k: number = 0; k < 8; k += 1) {
        c = (c & 1) === 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
    CRC_TABLE[i] = c >>> 0;
}

/**
 *  IEEE CRC-32 used by ZIP local/central headers.
 *
 * @param {Uint8Array} data - The data.
 * @returns {number} The result.
 * @private
 */
export function crc32(data: Uint8Array): number {
    let crc: number = 0xffffffff;
    for (let i: number = 0; i < data.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        const byte: number = data[i];
        if (byte === undefined) {
            break;
        }
        const index: number = (crc ^ byte) & 0xff;
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        const tableValue: number = CRC_TABLE[index];
        if (tableValue === undefined) {
            break;
        }
        crc = tableValue ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}
