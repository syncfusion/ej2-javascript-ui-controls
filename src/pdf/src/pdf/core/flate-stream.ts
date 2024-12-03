import { _PdfBaseStream } from './base-stream';
import { _PdfDecodeStream } from './decode-stream';
import { _PdfDictionary } from './pdf-primitives';
import { FormatError } from './utils';
const codeLenCodeMap: Int32Array = new Int32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
]);
const lengthDecode: Int32Array = new Int32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
]);
const distDecode: Int32Array = new Int32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
]);
const fixedLitCodeTab: (number | Int32Array)[] = [
    new Int32Array([
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
        0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
        0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
        0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
        0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
        0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
        0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
        0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
        0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
        0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
        0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
        0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
        0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
        0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
        0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
        0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
        0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
        0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
        0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
        0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
        0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
        0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
        0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
        0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
        0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
        0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
        0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
        0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
        0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
        0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
        0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
        0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
        0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
        0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
        0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
        0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
        0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
        0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
        0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
        0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
        0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
        0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
        0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
        0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
        0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
        0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
        0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
        0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
        0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
    ]),
    9
];
const fixedDistCodeTab: (number | Int32Array)[] = [
    new Int32Array([
        0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
        0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
        0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
        0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
    ]),
    5
];
export class _PdfFlateStream extends _PdfDecodeStream {
    constructor(stream: _PdfBaseStream, maybeLength: number) {
        super(maybeLength);
        this.stream = stream;
        this.dictionary = stream.dictionary;
        const cmf: number = stream.getByte();
        const flg: number = stream.getByte();
        if ((cmf & 0x0f) !== 0x08) {
            throw new FormatError(`Unknown compression method in flate stream: ${cmf}, ${flg}`);
        }
        if (((cmf << 8) + flg) % 31 !== 0) {
            throw new FormatError(`Bad flag check in flate stream: ${cmf}, ${flg}`);
        }
        if (flg & 0x20) {
            throw new FormatError(`Bad flag bit set in flate stream: ${cmf}, ${flg}`);
        }
        this.codeSize = 0;
        this.codeBuffer = 0;
    }
    dictionary: _PdfDictionary;
    codeSize: number;
    codeBuffer: number;
    getBits(bits: number): number {
        const stream: _PdfBaseStream = this.stream;
        let codeSize: number = this.codeSize;
        let codeBuffer: number = this.codeBuffer;
        let b: number;
        while (codeSize < bits) {
            b = stream.getByte();
            codeBuffer |= b << codeSize;
            codeSize += 8;
        }
        b = codeBuffer & ((1 << bits) - 1);
        this.codeBuffer = codeBuffer >> bits;
        this.codeSize = codeSize -= bits;
        return b;
    }
    getCode(table: Array<number | Int32Array>): number {
        const stream: _PdfBaseStream = this.stream;
        const codes: Int32Array = table[0] as Int32Array;
        const maxLen: number = table[1] as number;
        let codeSize: number = this.codeSize;
        let codeBuffer: number = this.codeBuffer;
        let b: number;
        while (codeSize < maxLen) {
            b = stream.getByte();
            codeBuffer |= b << codeSize;
            codeSize += 8;
        }
        const code: number = codes[codeBuffer & ((1 << maxLen) - 1)];
        const codeLen: number = code >> 16;
        const codeVal: number = code & 0xffff;
        if (!(codeLen < 1 || codeSize < codeLen)) {
            this.codeBuffer = codeBuffer >> codeLen;
            this.codeSize = codeSize - codeLen;
        }
        return codeVal;
    }
    generateHuffmanTable(lengths: Uint8Array): (number | Int32Array)[] {
        const n: number = lengths.length;
        let maximumLength: number = 0;
        let i: number;
        for (i = 0; i < n; ++i) {
            if (lengths[i] > maximumLength) { // eslint-disable-line
                maximumLength = lengths[i]; // eslint-disable-line
            }
        }
        const size: number = 1 << maximumLength;
        const codes: Int32Array = new Int32Array(size);
        for (let len: number = 1, code: number = 0, skip: number = 2; len <= maximumLength; ++len, code <<= 1, skip <<= 1) {
            for (let val: number = 0; val < n; ++val) {
                if (lengths[val] === len) { // eslint-disable-line
                    let code2: number = 0;
                    let t: number = code;
                    for (i = 0; i < len; ++i) {
                        code2 = (code2 << 1) | (t & 1);
                        t >>= 1;
                    }
                    for (i = code2; i < size; i += skip) {
                        codes[i] = (len << 16) | val; // eslint-disable-line
                    }
                    ++code;
                }
            }
        }
        return [codes, maximumLength];
    }
    readBlock(): void {
        let buffer: Uint8Array;
        let length: number;
        const stream: _PdfBaseStream = this.stream;
        let hdr: number = this.getBits(3);
        if (hdr & 1) {
            this.eof = true;
        }
        hdr >>= 1;
        if (hdr === 0) {
            let b: number = stream.getByte();
            let blockLen: number = b;
            b = stream.getByte();
            blockLen |= b << 8;
            b = stream.getByte();
            let check: number = b;
            b = stream.getByte();
            check |= b << 8;
            if (!(check !== (~blockLen & 0xffff) && (blockLen !== 0 || check !== 0))) {
                this.codeBuffer = 0;
                this.codeSize = 0;
                const bufferLength: number = this.bufferLength;
                const end: number = bufferLength + blockLen;
                buffer = this.ensureBuffer(end);
                this.bufferLength = end;
                if (blockLen === 0) {
                    if (stream.peekByte() === -1) {
                        this.eof = true;
                    }
                } else {
                    const block: Uint8Array = stream.getBytes(blockLen);
                    buffer.set(block, bufferLength);
                    if (block.length < blockLen) {
                        this.eof = true;
                    }
                }
                return;
            }
        }
        let litCodeTable: (number | Int32Array)[];
        let distCodeTable: (number | Int32Array)[];
        if (hdr === 1) {
            litCodeTable = fixedLitCodeTab;
            distCodeTable = fixedDistCodeTab;
        } else if (hdr === 2) {
            const numLitCodes: number = this.getBits(5) + 257;
            const numDistCodes: number = this.getBits(5) + 1;
            const numCodeLenCodes: number = this.getBits(4) + 4;
            const codeLenCodeLengths: Uint8Array = new Uint8Array(codeLenCodeMap.length);
            let i: number;
            for (i = 0; i < numCodeLenCodes; ++i) {
                codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3); // eslint-disable-line
            }
            const codeLenCodeTab: (number | Int32Array)[] = this.generateHuffmanTable(codeLenCodeLengths);
            length = 0;
            i = 0;
            const codes: number = numLitCodes + numDistCodes;
            const codeLengths: Uint8Array = new Uint8Array(codes);
            let bitsLength: number;
            let bitsOffset: number;
            let what: number;
            while (i < codes) {
                const code: number = this.getCode(codeLenCodeTab);
                if (code === 16) {
                    bitsLength = 2;
                    bitsOffset = 3;
                    what = length;
                } else if (code === 17) {
                    bitsLength = 3;
                    bitsOffset = 3;
                    what = length = 0;
                } else if (code === 18) {
                    bitsLength = 7;
                    bitsOffset = 11;
                    what = length = 0;
                } else {
                    codeLengths[i++] = length = code;
                    continue;
                }
                let repeatLength: number = this.getBits(bitsLength) + bitsOffset;
                while (repeatLength-- > 0) {
                    codeLengths[i++] = what;
                }
            }
            litCodeTable = this.generateHuffmanTable(
                codeLengths.subarray(0, numLitCodes)
            );
            distCodeTable = this.generateHuffmanTable(
                codeLengths.subarray(numLitCodes, codes)
            );
        }
        buffer = this.buffer;
        let limit: number = buffer ? buffer.length : 0;
        let position: number = this.bufferLength;
        while (true) { // eslint-disable-line
            let code1: number = this.getCode(litCodeTable);
            if (code1 < 256) {
                if (position + 1 >= limit) {
                    buffer = this.ensureBuffer(position + 1);
                    limit = buffer.length;
                }
                buffer[position++] = code1;
                continue;
            }
            if (code1 === 256) {
                this.bufferLength = position;
                return;
            }
            code1 -= 257;
            code1 = lengthDecode[code1]; // eslint-disable-line
            let code2: number = code1 >> 16;
            if (code2 > 0) {
                code2 = this.getBits(code2);
            }
            length = (code1 & 0xffff) + code2;
            code1 = this.getCode(distCodeTable);
            code1 = distDecode[code1]; // eslint-disable-line
            code2 = code1 >> 16;
            if (code2 > 0) {
                code2 = this.getBits(code2);
            }
            const dist: number = (code1 & 0xffff) + code2;
            if (position + length >= limit) {
                buffer = this.ensureBuffer(position + length);
                limit = buffer.length;
            }
            for (let k: number = 0; k < length; ++k, ++position) {
                buffer[position] = buffer[position - dist]; // eslint-disable-line
            }
        }
    }
}

