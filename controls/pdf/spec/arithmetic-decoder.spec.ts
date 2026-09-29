import { _PdfArithmeticDecoder } from '../src/pdf/core/compression/arithmaric-decoder';

describe('1041656 - arithmaric-decoder mutation coverage', () => {
    it('1041656 arithmaric-decoder quantization table contains 47 entries with required fields', () => {
        const data: Uint8Array = new Uint8Array([0x00, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const table: any[] = decoder._quantizationTable;
        expect(table.length).toBe(47);
        for (let i: number = 0; i < table.length; i++) {
            const entry: any = table[i];
            expect(typeof entry.estimate).toBe('number');
            expect(typeof entry.nextMostProbableState).toBe('number');
            expect(typeof entry.nextLeastProbableState).toBe('number');
            expect(typeof entry.switchFlag).toBe('number');
        }
    });

    it('1041656 arithmaric-decoder quantization table entry 0 has estimate 0x5601, nMPS 1, nLPS 1, switchFlag 1', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const entry0: any = decoder._quantizationTable[0];
        expect(entry0.estimate).toBe(0x5601);
        expect(entry0.nextMostProbableState).toBe(1);
        expect(entry0.nextLeastProbableState).toBe(1);
        expect(entry0.switchFlag).toBe(1);
    });

    it('1041656 arithmaric-decoder quantization table entry 2 (line 58) has estimate 0x1801, nMPS 3, nLPS 9, switchFlag 0', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const entry2: any = decoder._quantizationTable[2];
        expect(entry2.estimate).toBe(0x1801);
        expect(entry2.nextMostProbableState).toBe(3);
        expect(entry2.nextLeastProbableState).toBe(9);
        expect(entry2.switchFlag).toBe(0);
    });

    it('1041656 arithmaric-decoder quantization table entry 46 has estimate 0x5601, nMPS 46, nLPS 46, switchFlag 0', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const entry46: any = decoder._quantizationTable[46];
        expect(entry46.estimate).toBe(0x5601);
        expect(entry46.nextMostProbableState).toBe(46);
        expect(entry46.nextLeastProbableState).toBe(46);
        expect(entry46.switchFlag).toBe(0);
    });

    it('1041656 arithmaric-decoder _byteIn when 0xFF followed by byte > 0x8F adds 0xFF00 and sets bitCount=8', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x90, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._bitCount).toBe(8);
        expect(decoder._bitPosition).toBe(0);
    });

    it('1041656 arithmaric-decoder _byteIn when 0xFF followed by byte == 0x8F takes else branch (bitCount=7, position advances)', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x8F, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._bitCount).toBe(7);
        expect(decoder._bitPosition).toBe(1);
    });

    it('1041656 arithmaric-decoder _byteIn when 0xFF followed by byte < 0x8F takes else branch (bitCount=7, position advances)', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._bitCount).toBe(7);
        expect(decoder._bitPosition).toBe(1);
        expect(decoder._low & 0x3FFFF).toBe(0x10 << 9);
    });

    it('1041656 arithmaric-decoder _byteIn when non-0xFF byte advances position and appends (nextByte << 8)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x42, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._bitPosition).toBe(1);
        expect(decoder._bitCount).toBe(8);
        expect(decoder._low & 0xFFFF).toBe(0x42 << 8);
    });

    it('1041656 arithmaric-decoder _byteIn at end of data appends 0xFF00 instead of (nextByte<<8)', () => {
        const data: Uint8Array = new Uint8Array([0x10]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._bitPosition).toBe(1);
        expect(decoder._bitCount).toBe(8);
        expect(decoder._low & 0xFFFF).toBe(0xFF00);
    });

    it('1041656 arithmaric-decoder _byteIn folds overflow (>0xFFFF) into _high (line 141 strict >)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0x10000;
        decoder._high = 0x1234;
        decoder._bitCount = 0;
        decoder._bitPosition = 1;
        decoder._byteIn();
        expect(decoder._low).toBeLessThanOrEqual(0xFFFF);
        expect(decoder._high).toBe(0x1234 + 1);
    });

    it('1041656 arithmaric-decoder _readBit when _high < qe and a < qe uses nextMostProbableState (state 0)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0x8000;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(0);
        expect(contexts[0] >> 1).toBe(1);
    });

    it('1041656 arithmaric-decoder _readBit when _high < qe and a >= qe uses nextLeastProbableState (state 0)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0xFFFF;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(1);
        expect(contexts[0] >> 1).toBe(1);
    });

    it('1041656 arithmaric-decoder _readBit when _high == qeIcx takes MPS branch (line 162 strict <)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xAC02;
        decoder._high = qe;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(0);
        expect(contexts[0] >> 1).toBe(46);
    });

    it('1041656 arithmaric-decoder _readBit when a == qe in LPS branch takes else (nextLPS, d=1^cxMps)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xAC02;
        decoder._high = qe - 1;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(1);
        expect(contexts[0] >> 1).toBe(46);
    });

    it('1041656 arithmaric-decoder _readBit in MPS branch subtracts qe from _high (line 176 -=)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xAC02;
        decoder._high = qe + 0x1000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        decoder._readBit(contexts, 0);
        expect(decoder._high & 0xFFFF).toBe(0x2000);
    });

    it('1041656 arithmaric-decoder _readBit in MPS branch when a == qe uses nextMostProbableState (line 181 strict <)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xAC02;
        decoder._high = qe + 1;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(0);
        expect(contexts[0]).toBe(2);
    });

    it('1041656 arithmaric-decoder _readBit for state 0 (switchFlag=1) flips cxMps when LPS occurs (line 183 true branch)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0xFFFF;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        decoder._readBit(contexts, 0);
        expect(contexts[0]).toBe((1 << 1) | 1);
    });

    it('1041656 arithmaric-decoder _readBit for state 0 (switchFlag=1) does not flip when MPS path completes (line 183)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0xFFFF;
        decoder._high = 0x8000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        decoder._readBit(contexts, 0);
        const cxMps: number = contexts[0] & 1;
        expect(cxMps).toBe(0);
    });

    it('1041656 arithmaric-decoder _readBit decrements _bitCount by 1 per normalization step (line 199 --)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0x8000;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 4;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        decoder._readBit(contexts, 0);
        expect(decoder._bitCount).toBeLessThan(4);
    });

    it('1041656 arithmaric-decoder _readBit triggers _byteIn when _bitCount == 0 (line 193 strict ===)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x42, 0x00, 0x00, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0x8000;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        decoder._readBit(contexts, 0);
        expect(decoder._bitPosition).toBeGreaterThan(1);
    });

    it('1041656 arithmaric-decoder _readBit runs do-while multiple iterations until a has high bit (line 200 while condition)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0x8000;
        decoder._high = 0x0004;
        decoder._low = 0;
        decoder._bitCount = 16;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 44 * 2;
        decoder._readBit(contexts, 0);
        expect(decoder._range).toBe(0xA000);
        expect(decoder._bitPosition).toBe(1);
    });

    it('1041656 arithmaric-decoder constructor initializes _range to 0x8000', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        expect(decoder._range).toBe(0x8000);
    });

    it('1041656 arithmaric-decoder constructor sets _data, _bitPosition, _dataEnd correctly', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x20, 0x30, 0x40]);
        const decoder: any = new _PdfArithmeticDecoder(data, 1, 3);
        expect(decoder._data).toBe(data);
        expect(decoder._bitPosition).toBe(2);
        expect(decoder._dataEnd).toBe(3);
    });

    it('1041656 arithmaric-decoder _readBit for state 0 with switchFlag=1: cxMps not flipped in else (LPS+switch) returns d=1^cxMps and sets cxMps=d', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 0xFFFF;
        decoder._high = 0x1000;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 1;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(0);
        expect(contexts[0] & 1).toBe(0);
    });

    it('1041656 arithmaric-decoder constructor reduces _bitCount by 7 after _byteIn (line 113 -=)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        expect(decoder._bitCount).toBe(1);
    });

    it('1041656 arithmaric-decoder constructor reduces _bitCount by 7 when 0xFF marker (line 113 -=)', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        expect(decoder._bitCount).toBe(0);
    });

    it('1041656 arithmaric-decoder _byteIn adds 0xFF00 to _low in 0xFF marker branch (line 127 +=)', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x90, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0x1234;
        decoder._high = 0;
        decoder._bitCount = 0;
        decoder._bitPosition = 0;
        decoder._byteIn();
        expect(decoder._low & 0xFFFF).toBe(0x1134);
        expect(decoder._high & 0xFFFF).toBe(1);
    });

    it('1041656 arithmaric-decoder _byteIn overflow guard fires when _low > 0xFFFF (line 141 strict >)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0x18000;
        decoder._high = 0x0500;
        decoder._bitCount = 0;
        decoder._bitPosition = 1;
        decoder._byteIn();
        expect(decoder._low & 0xFFFF).toBe(0x8000);
        expect(decoder._high & 0xFFFF).toBe(0x0501);
    });

    it('1041656 arithmaric-decoder _readBit LPS branch (a>=qe) does not flip cxMps when switchFlag=0 (line 170 strict === 1)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xAC02;
        decoder._high = qe - 1;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        decoder._readBit(contexts, 0);
        expect(contexts[0] & 1).toBe(0);
    });

    it('1041656 arithmaric-decoder _readBit returns early with _range=a when a has high bit (line 177 strict !== 0)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0xFFFF;
        decoder._high = 0xFFFF;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        decoder._readBit(contexts, 0);
        expect(decoder._range).toBe(0xFFFF - qe);
    });

    it('1041656 arithmaric-decoder _readBit in MPS branch when a < qe uses nextLeastProbableState (line 181 strict <)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0x8000;
        decoder._high = qe;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 0;
        const bit: number = decoder._readBit(contexts, 0);
        expect(bit).toBe(1);
        expect(contexts[0]).toBe((1 << 1) | 1);
    });

    it('1041656 arithmaric-decoder _readBit in MPS-LPS sub-path does not flip cxMps when switchFlag=0 (line 183 strict === 1)', () => {
        const data: Uint8Array = new Uint8Array(4);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        const qe: number = 0x5601;
        decoder._range = 0x8000;
        decoder._high = qe + 0x29FF;
        decoder._low = 0;
        decoder._bitCount = 8;
        decoder._bitPosition = 1;
        const contexts: Int8Array = new Int8Array(8);
        contexts[0] = 46 * 2;
        decoder._readBit(contexts, 0);
        expect(contexts[0] & 1).toBe(0);
    });

    it('1041656 arithmaric-decoder constructor reduces _bitCount by 7 in 0xFF > 0x8F marker path (line 113 -=)', () => {
        const data: Uint8Array = new Uint8Array([0xFF, 0x90, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        expect(decoder._bitCount).toBe(1);
    });

    it('1041656 arithmaric-decoder _byteIn overflow guard does not fold when _low == 0xFFFF (line 141 strict > boundary)', () => {
        const data: Uint8Array = new Uint8Array([0x10, 0x00, 0x00]);
        const decoder: any = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._low = 0xFFFF;
        decoder._high = 0x1234;
        decoder._bitCount = 0;
        decoder._bitPosition = 1;
        decoder._byteIn();
        expect(decoder._low & 0xFFFF).toBe(0xFFFF);
        expect(decoder._high & 0xFFFF).toBe(0x1234);
    });
});
