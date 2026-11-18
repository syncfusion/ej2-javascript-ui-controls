/**
 * Minimal OLE Compound File Binary (CFB) reader and writer.
 *
 * Encrypted OOXML packages are stored in a CFB container that holds the
 * `EncryptionInfo` and `EncryptedPackage` streams (MS-OFFCRYPTO §2.3). This module
 * reads and writes version 3 (512-byte sector) files and reads version 4
 * (4096-byte sector) files as defined by MS-CFB. It is deliberately small: no
 * storage CLSIDs, timestamps, or transactions are produced.
 *
 * Reading treats the input as untrusted: sector chains are bounded and checked for
 * cycles, and every offset is range-checked.
 *
 * @private
 */

import { InvalidPackageError } from '../errors';

const SIGNATURE: number[] = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const FREESECT: number = 0xffffffff;
const ENDOFCHAIN: number = 0xfffffffe;
const FATSECT: number = 0xfffffffd;
const DIFSECT: number = 0xfffffffc;
const NOSTREAM: number = 0xffffffff;
const DIR_ENTRY_SIZE: number = 128;
const MINI_SECTOR_SIZE: number = 64;
const MINI_CUTOFF: number = 4096;
const TYPE_STORAGE: number = 1;
const TYPE_STREAM: number = 2;
const TYPE_ROOT: number = 5;

/**
 * One stream to place in a CFB container.
 *
 * @private
 */
export interface CfbStream {
    /** Slash-separated path from the root storage, for example `\u0006DataSpaces/Version`. */
    readonly path: string;
    /** Stream payload. */
    readonly data: Uint8Array;
}

/**
 * Returns `true` when `data` starts with the CFB signature.
 *
 * @param {Uint8Array} data - Candidate file bytes.
 * @returns {boolean} Whether the bytes look like a CFB file.
 */
export function isCfb(data: Uint8Array): boolean {
    if (data.length < SIGNATURE.length) {
        return false;
    }
    for (let i: number = 0; i < SIGNATURE.length; i++) {
        if (data[i] !== SIGNATURE[i]) {
            return false;
        }
    }
    return true;
}

function readU16(b: Uint8Array, o: number): number {
    return b[o] | (b[o + 1] << 8);
}

function readU32(b: Uint8Array, o: number): number {
    return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}

function writeU16(b: Uint8Array, o: number, v: number): void {
    b[o] = v & 0xff;
    b[o + 1] = (v >>> 8) & 0xff;
}

function writeU32(b: Uint8Array, o: number, v: number): void {
    b[o] = v & 0xff;
    b[o + 1] = (v >>> 8) & 0xff;
    b[o + 2] = (v >>> 16) & 0xff;
    b[o + 3] = (v >>> 24) & 0xff;
}

function fail(message: string): InvalidPackageError {
    return new InvalidPackageError('Invalid compound file: ' + message);
}

interface DirEntry {
    readonly name: string;
    readonly type: number;
    readonly left: number;
    readonly right: number;
    readonly child: number;
    readonly start: number;
    readonly size: number;
}

/**
 * Reads every stream from a CFB container.
 *
 * @param {Uint8Array} data - CFB file bytes.
 * @returns {Object} Map of slash-separated stream path to payload.
 * @throws InvalidPackageError when the container is malformed.
 */
export function readCfb(data: Uint8Array): { [path: string]: Uint8Array } {
    if (!isCfb(data) || data.length < 512) {
        throw fail('missing signature');
    }
    if (readU16(data, 28) !== 0xfffe) {
        throw fail('unsupported byte order');
    }
    const sectorShift: number = readU16(data, 30);
    if (sectorShift !== 9 && sectorShift !== 12) {
        throw fail('unsupported sector size');
    }
    const sectorSize: number = 1 << sectorShift;
    if (readU16(data, 32) !== 6) {
        throw fail('unsupported mini sector size');
    }
    if (data.length < sectorSize) {
        throw fail('truncated header');
    }
    const sectorCount: number = Math.floor((data.length - sectorSize) / sectorSize) + 1;
    const numFat: number = readU32(data, 44);
    const firstDir: number = readU32(data, 48);
    const miniCutoff: number = readU32(data, 56);
    const firstMiniFat: number = readU32(data, 60);
    const numMiniFat: number = readU32(data, 64);
    const firstDifat: number = readU32(data, 68);
    const numDifat: number = readU32(data, 72);
    if (numFat > sectorCount || numDifat > sectorCount || numMiniFat > sectorCount) {
        throw fail('sector counts exceed file size');
    }

    const sectorOffset: (id: number) => number = (id: number): number => {
        if (id >= sectorCount) {
            throw fail('sector index out of range');
        }
        return (id + 1) * sectorSize;
    };
    const perSector: number = sectorSize / 4;

    // FAT sector list: header DIFAT, then the DIFAT chain.
    const fatSectors: number[] = [];
    for (let i: number = 0; i < 109 && fatSectors.length < numFat; i++) {
        const id: number = readU32(data, 76 + i * 4);
        if (id !== FREESECT) {
            fatSectors.push(id);
        }
    }
    let difat: number = firstDifat;
    for (let n: number = 0; n < numDifat && difat !== ENDOFCHAIN && difat !== FREESECT; n++) {
        const off: number = sectorOffset(difat);
        for (let i: number = 0; i < perSector - 1 && fatSectors.length < numFat; i++) {
            const id: number = readU32(data, off + i * 4);
            if (id !== FREESECT) {
                fatSectors.push(id);
            }
        }
        difat = readU32(data, off + (perSector - 1) * 4);
    }
    const fat: Uint32Array = new Uint32Array(fatSectors.length * perSector);
    for (let s: number = 0; s < fatSectors.length; s++) {
        const off: number = sectorOffset(fatSectors[s]);
        for (let i: number = 0; i < perSector; i++) {
            fat[s * perSector + i] = readU32(data, off + i * 4);
        }
    }

    const chainOf: (start: number, table: Uint32Array) => number[] = (start: number, table: Uint32Array): number[] => {
        const chain: number[] = [];
        let id: number = start;
        while (id !== ENDOFCHAIN && id !== FREESECT) {
            if (id >= table.length || chain.length > table.length) {
                throw fail('broken sector chain');
            }
            chain.push(id);
            id = table[id];
        }
        return chain;
    };
    const readSectors: (chain: number[]) => Uint8Array = (chain: number[]): Uint8Array => {
        const out: Uint8Array = new Uint8Array(chain.length * sectorSize);
        for (let i: number = 0; i < chain.length; i++) {
            const off: number = sectorOffset(chain[i]);
            out.set(data.subarray(off, off + sectorSize), i * sectorSize);
        }
        return out;
    };

    // Directory.
    const dirBytes: Uint8Array = readSectors(chainOf(firstDir, fat));
    const entries: DirEntry[] = [];
    for (let o: number = 0; o + DIR_ENTRY_SIZE <= dirBytes.length; o += DIR_ENTRY_SIZE) {
        const nameLen: number = Math.min(readU16(dirBytes, o + 64), 64);
        let name: string = '';
        for (let i: number = 0; i + 2 <= nameLen - 2; i += 2) {
            name += String.fromCharCode(readU16(dirBytes, o + i));
        }
        entries.push({
            name,
            type: dirBytes[o + 66],
            left: readU32(dirBytes, o + 68),
            right: readU32(dirBytes, o + 72),
            child: readU32(dirBytes, o + 76),
            start: readU32(dirBytes, o + 116),
            size: readU32(dirBytes, o + 120) + readU32(dirBytes, o + 124) * 4294967296,
        });
    }
    if (entries.length === 0 || entries[0].type !== TYPE_ROOT) {
        throw fail('missing root entry');
    }

    // Mini stream.
    const root: DirEntry = entries[0];
    let miniStream: Uint8Array = new Uint8Array(0);
    let miniFat: Uint32Array = new Uint32Array(0);
    if (numMiniFat > 0 && firstMiniFat !== ENDOFCHAIN) {
        const mfBytes: Uint8Array = readSectors(chainOf(firstMiniFat, fat));
        miniFat = new Uint32Array(mfBytes.length / 4);
        for (let i: number = 0; i < miniFat.length; i++) {
            miniFat[i] = readU32(mfBytes, i * 4);
        }
        miniStream = readSectors(chainOf(root.start, fat)).subarray(0, root.size);
    }

    const readEntry: (e: DirEntry) => Uint8Array = (e: DirEntry): Uint8Array => {
        if (e.size === 0) {
            return new Uint8Array(0);
        }
        if (e.size < miniCutoff) {
            const chain: number[] = chainOf(e.start, miniFat);
            const out: Uint8Array = new Uint8Array(chain.length * MINI_SECTOR_SIZE);
            for (let i: number = 0; i < chain.length; i++) {
                const off: number = chain[i] * MINI_SECTOR_SIZE;
                if (off + MINI_SECTOR_SIZE > miniStream.length) {
                    throw fail('mini stream sector out of range');
                }
                out.set(miniStream.subarray(off, off + MINI_SECTOR_SIZE), i * MINI_SECTOR_SIZE);
            }
            if (out.length < e.size) {
                throw fail('stream shorter than declared size');
            }
            return out.subarray(0, e.size);
        }
        if (e.size > data.length) {
            throw fail('stream larger than file');
        }
        const bytes: Uint8Array = readSectors(chainOf(e.start, fat));
        if (bytes.length < e.size) {
            throw fail('stream shorter than declared size');
        }
        return bytes.subarray(0, e.size);
    };

    // Walk the sibling trees (iteratively, with cycle protection).
    const result: { [path: string]: Uint8Array } = {};
    const visited: boolean[] = [];
    const stack: Array<{ index: number; prefix: string }> = [{ index: root.child, prefix: '' }];
    for (let top: number = stack.length - 1; top >= 0; top = stack.length - 1) {
        const item: { index: number; prefix: string } = stack[top];
        stack.length = top;
        if (item.index === NOSTREAM) {
            continue;
        }
        if (item.index >= entries.length || visited[item.index] === true) {
            throw fail('bad directory tree');
        }
        visited[item.index] = true;
        const e: DirEntry = entries[item.index];
        stack.push({ index: e.left, prefix: item.prefix });
        stack.push({ index: e.right, prefix: item.prefix });
        const path: string = item.prefix + e.name;
        if (e.type === TYPE_STORAGE) {
            stack.push({ index: e.child, prefix: path + '/' });
        } else if (e.type === TYPE_STREAM) {
            result[path] = readEntry(e);
        }
    }
    return result;
}

interface Node {
    readonly name: string;
    readonly isStorage: boolean;
    readonly children: Node[];
    data: Uint8Array;
    index: number;
    left: number;
    right: number;
    child: number;
    start: number;
}

function newNode(name: string, isStorage: boolean): Node {
    return { name, isStorage, children: [], data: new Uint8Array(0), index: 0, left: NOSTREAM, right: NOSTREAM, child: NOSTREAM, start: ENDOFCHAIN };
}

/** CFB sibling ordering: shorter names first, then ordinal on upper-cased UTF-16. */
function compareNames(a: string, b: string): number {
    if (a.length !== b.length) {
        return a.length - b.length;
    }
    const ua: string = a.toUpperCase();
    const ub: string = b.toUpperCase();
    return ua < ub ? -1 : ua > ub ? 1 : 0;
}

/** Links siblings as a balanced binary tree; returns the root index. */
function linkSiblings(nodes: Node[], lo: number, hi: number): number {
    if (lo > hi) {
        return NOSTREAM;
    }
    const mid: number = (lo + hi) >> 1;
    const node: Node = nodes[mid];
    node.left = linkSiblings(nodes, lo, mid - 1);
    node.right = linkSiblings(nodes, mid + 1, hi);
    return node.index;
}

/**
 * Builds a version 3 CFB container (512-byte sectors) holding the given streams.
 *
 * @param {ReadonlyArray<CfbStream>} streams - Streams to store; storages are created from the paths.
 * @returns {Uint8Array} CFB file bytes.
 */
export function writeCfb(streams: ReadonlyArray<CfbStream>): Uint8Array {
    const root: Node = newNode('Root Entry', true);
    for (let i: number = 0; i < streams.length; i++) {
        const parts: string[] = streams[i].path.split('/');
        let cur: Node = root;
        for (let p: number = 0; p < parts.length; p++) {
            const last: boolean = p === parts.length - 1;
            let next: Node | undefined;
            for (let c: number = 0; c < cur.children.length; c++) {
                if (cur.children[c].name === parts[p]) {
                    next = cur.children[c];
                }
            }
            if (next === undefined) {
                next = newNode(parts[p], !last);
                cur.children.push(next);
            }
            cur = next;
        }
        cur.data = streams[i].data;
    }

    // Number nodes (root = 0) and link sibling trees.
    const all: Node[] = [root];
    const assign: (node: Node) => void = (node: Node): void => {
        node.children.sort((a: Node, b: Node): number => compareNames(a.name, b.name));
        for (let i: number = 0; i < node.children.length; i++) {
            node.children[i].index = all.length;
            all.push(node.children[i]);
        }
        node.child = linkSiblings(node.children, 0, node.children.length - 1);
        for (let i: number = 0; i < node.children.length; i++) {
            assign(node.children[i]);
        }
    };
    assign(root);

    // Split streams between the regular and the mini stream.
    const sectorSize: number = 512;
    const perSector: number = 128;
    const big: Node[] = [];
    const small: Node[] = [];
    for (let i: number = 1; i < all.length; i++) {
        if (!all[i].isStorage && all[i].data.length > 0) {
            (all[i].data.length >= MINI_CUTOFF ? big : small).push(all[i]);
        }
    }
    let miniSectors: number = 0;
    for (let i: number = 0; i < small.length; i++) {
        miniSectors += Math.ceil(small[i].data.length / MINI_SECTOR_SIZE);
    }
    const miniStream: Uint8Array = new Uint8Array(miniSectors * MINI_SECTOR_SIZE);
    const miniFat: Uint32Array = new Uint32Array(Math.ceil(miniSectors / perSector) * perSector).fill(FREESECT);
    let mpos: number = 0;
    for (let i: number = 0; i < small.length; i++) {
        const n: number = Math.ceil(small[i].data.length / MINI_SECTOR_SIZE);
        small[i].start = mpos;
        miniStream.set(small[i].data, mpos * MINI_SECTOR_SIZE);
        for (let k: number = 0; k < n; k++) {
            miniFat[mpos + k] = k === n - 1 ? ENDOFCHAIN : mpos + k + 1;
        }
        mpos += n;
    }
    const containerSectors: number = Math.ceil(miniStream.length / sectorSize);
    const miniFatSectors: number = miniFat.length / perSector;
    const dirSectors: number = Math.ceil(all.length / 4);
    let others: number = containerSectors + miniFatSectors + dirSectors;
    for (let i: number = 0; i < big.length; i++) {
        others += Math.ceil(big[i].data.length / sectorSize);
    }
    let fatCount: number = Math.ceil(others / perSector);
    let difatCount: number = 0;
    for (;;) {
        difatCount = fatCount > 109 ? Math.ceil((fatCount - 109) / (perSector - 1)) : 0;
        if (fatCount * perSector >= others + fatCount + difatCount) {
            break;
        }
        fatCount++;
    }
    const total: number = others + fatCount + difatCount;
    const fat: Uint32Array = new Uint32Array(fatCount * perSector).fill(FREESECT);
    const out: Uint8Array = new Uint8Array((total + 1) * sectorSize);
    const chainRun: (start: number, count: number) => void = (start: number, count: number): void => {
        for (let k: number = 0; k < count; k++) {
            fat[start + k] = k === count - 1 ? ENDOFCHAIN : start + k + 1;
        }
    };
    let pos: number = 0;
    for (let i: number = 0; i < big.length; i++) {
        const n: number = Math.ceil(big[i].data.length / sectorSize);
        big[i].start = pos;
        chainRun(pos, n);
        out.set(big[i].data, (pos + 1) * sectorSize);
        pos += n;
    }
    const containerStart: number = containerSectors > 0 ? pos : ENDOFCHAIN;
    chainRun(pos, containerSectors);
    out.set(miniStream, (pos + 1) * sectorSize);
    pos += containerSectors;
    const miniFatStart: number = miniFatSectors > 0 ? pos : ENDOFCHAIN;
    chainRun(pos, miniFatSectors);
    for (let i: number = 0; i < miniFat.length; i++) {
        writeU32(out, (pos + 1) * sectorSize + i * 4, miniFat[i]);
    }
    pos += miniFatSectors;
    const dirStart: number = pos;
    chainRun(pos, dirSectors);
    for (let i: number = 0; i < dirSectors * 4; i++) {
        const o: number = (pos + 1) * sectorSize + i * DIR_ENTRY_SIZE;
        const node: Node | undefined = all[i];
        if (node === undefined) {
            writeU32(out, o + 68, NOSTREAM);
            writeU32(out, o + 72, NOSTREAM);
            writeU32(out, o + 76, NOSTREAM);
            continue;
        }
        const name: string = node.name;
        for (let c: number = 0; c < name.length; c++) {
            writeU16(out, o + c * 2, name.charCodeAt(c));
        }
        writeU16(out, o + 64, (name.length + 1) * 2);
        out[o + 66] = i === 0 ? TYPE_ROOT : node.isStorage ? TYPE_STORAGE : TYPE_STREAM;
        out[o + 67] = 1; // black
        writeU32(out, o + 68, node.left);
        writeU32(out, o + 72, node.right);
        writeU32(out, o + 76, node.child);
        if (i === 0) {
            writeU32(out, o + 116, containerStart);
            writeU32(out, o + 120, miniStream.length);
        } else if (node.isStorage) {
            writeU32(out, o + 116, 0);
        } else {
            writeU32(out, o + 116, node.data.length === 0 ? ENDOFCHAIN : node.start);
            writeU32(out, o + 120, node.data.length);
        }
    }
    pos += dirSectors;
    const fatStart: number = pos;
    for (let k: number = 0; k < fatCount; k++) {
        fat[fatStart + k] = FATSECT;
    }
    pos += fatCount;
    const difatStart: number = difatCount > 0 ? pos : ENDOFCHAIN;
    for (let k: number = 0; k < difatCount; k++) {
        fat[pos + k] = DIFSECT;
    }
    for (let i: number = 0; i < fat.length; i++) {
        writeU32(out, (fatStart + Math.floor(i / perSector) + 1) * sectorSize + (i % perSector) * 4, fat[i]);
    }
    // DIFAT sectors: 127 FAT sector ids then a link to the next DIFAT sector.
    for (let k: number = 0; k < difatCount; k++) {
        const o: number = (pos + k + 1) * sectorSize;
        for (let i: number = 0; i < perSector - 1; i++) {
            const idx: number = 109 + k * (perSector - 1) + i;
            writeU32(out, o + i * 4, idx < fatCount ? fatStart + idx : FREESECT);
        }
        writeU32(out, o + (perSector - 1) * 4, k === difatCount - 1 ? ENDOFCHAIN : pos + k + 1);
    }

    // Header.
    out.set(SIGNATURE, 0);
    writeU16(out, 24, 0x003e);
    writeU16(out, 26, 3);
    writeU16(out, 28, 0xfffe);
    writeU16(out, 30, 9);
    writeU16(out, 32, 6);
    writeU32(out, 44, fatCount);
    writeU32(out, 48, dirStart);
    writeU32(out, 56, MINI_CUTOFF);
    writeU32(out, 60, miniFatStart);
    writeU32(out, 64, miniFatSectors);
    writeU32(out, 68, difatStart);
    writeU32(out, 72, difatCount);
    for (let i: number = 0; i < 109; i++) {
        writeU32(out, 76 + i * 4, i < fatCount ? fatStart + i : FREESECT);
    }
    return out;
}
