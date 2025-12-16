export class _PdfArithmeticDecoder {
    _data: Uint8Array;
    _bitPosition: number;
    _dataEnd: number;
    _high: number;
    _low: number;
    _bitCount: number;
    _range: number;
    _quantizationTable: any = [ // eslint-disable-line
        { estimate: 0x5601, nextMostProbableState: 1, nextLeastProbableState: 1, switchFlag: 1 },
        { estimate: 0x3401, nextMostProbableState: 2, nextLeastProbableState: 6, switchFlag: 0 },
        { estimate: 0x1801, nextMostProbableState: 3, nextLeastProbableState: 9, switchFlag: 0 },
        { estimate: 0x0ac1, nextMostProbableState: 4, nextLeastProbableState: 12, switchFlag: 0 },
        { estimate: 0x0521, nextMostProbableState: 5, nextLeastProbableState: 29, switchFlag: 0 },
        { estimate: 0x0221, nextMostProbableState: 38, nextLeastProbableState: 33, switchFlag: 0 },
        { estimate: 0x5601, nextMostProbableState: 7, nextLeastProbableState: 6, switchFlag: 1 },
        { estimate: 0x5401, nextMostProbableState: 8, nextLeastProbableState: 14, switchFlag: 0 },
        { estimate: 0x4801, nextMostProbableState: 9, nextLeastProbableState: 14, switchFlag: 0 },
        { estimate: 0x3801, nextMostProbableState: 10, nextLeastProbableState: 14, switchFlag: 0 },
        { estimate: 0x3001, nextMostProbableState: 11, nextLeastProbableState: 17, switchFlag: 0 },
        { estimate: 0x2401, nextMostProbableState: 12, nextLeastProbableState: 18, switchFlag: 0 },
        { estimate: 0x1c01, nextMostProbableState: 13, nextLeastProbableState: 20, switchFlag: 0 },
        { estimate: 0x1601, nextMostProbableState: 29, nextLeastProbableState: 21, switchFlag: 0 },
        { estimate: 0x5601, nextMostProbableState: 15, nextLeastProbableState: 14, switchFlag: 1 },
        { estimate: 0x5401, nextMostProbableState: 16, nextLeastProbableState: 14, switchFlag: 0 },
        { estimate: 0x5101, nextMostProbableState: 17, nextLeastProbableState: 15, switchFlag: 0 },
        { estimate: 0x4801, nextMostProbableState: 18, nextLeastProbableState: 16, switchFlag: 0 },
        { estimate: 0x3801, nextMostProbableState: 19, nextLeastProbableState: 17, switchFlag: 0 },
        { estimate: 0x3401, nextMostProbableState: 20, nextLeastProbableState: 18, switchFlag: 0 },
        { estimate: 0x3001, nextMostProbableState: 21, nextLeastProbableState: 19, switchFlag: 0 },
        { estimate: 0x2801, nextMostProbableState: 22, nextLeastProbableState: 19, switchFlag: 0 },
        { estimate: 0x2401, nextMostProbableState: 23, nextLeastProbableState: 20, switchFlag: 0 },
        { estimate: 0x2201, nextMostProbableState: 24, nextLeastProbableState: 21, switchFlag: 0 },
        { estimate: 0x1c01, nextMostProbableState: 25, nextLeastProbableState: 22, switchFlag: 0 },
        { estimate: 0x1801, nextMostProbableState: 26, nextLeastProbableState: 23, switchFlag: 0 },
        { estimate: 0x1601, nextMostProbableState: 27, nextLeastProbableState: 24, switchFlag: 0 },
        { estimate: 0x1401, nextMostProbableState: 28, nextLeastProbableState: 25, switchFlag: 0 },
        { estimate: 0x1201, nextMostProbableState: 29, nextLeastProbableState: 26, switchFlag: 0 },
        { estimate: 0x1101, nextMostProbableState: 30, nextLeastProbableState: 27, switchFlag: 0 },
        { estimate: 0x0ac1, nextMostProbableState: 31, nextLeastProbableState: 28, switchFlag: 0 },
        { estimate: 0x09c1, nextMostProbableState: 32, nextLeastProbableState: 29, switchFlag: 0 },
        { estimate: 0x08a1, nextMostProbableState: 33, nextLeastProbableState: 30, switchFlag: 0 },
        { estimate: 0x0521, nextMostProbableState: 34, nextLeastProbableState: 31, switchFlag: 0 },
        { estimate: 0x0441, nextMostProbableState: 35, nextLeastProbableState: 32, switchFlag: 0 },
        { estimate: 0x02a1, nextMostProbableState: 36, nextLeastProbableState: 33, switchFlag: 0 },
        { estimate: 0x0221, nextMostProbableState: 37, nextLeastProbableState: 34, switchFlag: 0 },
        { estimate: 0x0141, nextMostProbableState: 38, nextLeastProbableState: 35, switchFlag: 0 },
        { estimate: 0x0111, nextMostProbableState: 39, nextLeastProbableState: 36, switchFlag: 0 },
        { estimate: 0x0085, nextMostProbableState: 40, nextLeastProbableState: 37, switchFlag: 0 },
        { estimate: 0x0049, nextMostProbableState: 41, nextLeastProbableState: 38, switchFlag: 0 },
        { estimate: 0x0025, nextMostProbableState: 42, nextLeastProbableState: 39, switchFlag: 0 },
        { estimate: 0x0015, nextMostProbableState: 43, nextLeastProbableState: 40, switchFlag: 0 },
        { estimate: 0x0009, nextMostProbableState: 44, nextLeastProbableState: 41, switchFlag: 0 },
        { estimate: 0x0005, nextMostProbableState: 45, nextLeastProbableState: 42, switchFlag: 0 },
        { estimate: 0x0001, nextMostProbableState: 45, nextLeastProbableState: 43, switchFlag: 0 },
        { estimate: 0x5601, nextMostProbableState: 46, nextLeastProbableState: 46, switchFlag: 0 }
    ];
    constructor(data: any, start: number, end: number) { // eslint-disable-line
        this._data = data;
        this._bitPosition = start;
        this._dataEnd = end;
        this._high = data[<number>start];
        this._low = 0;
        this._byteIn();
        this._high = ((this._high << 7) & 0xffff) | ((this._low >> 9) & 0x7f);
        this._low = (this._low << 7) & 0xffff;
        this._bitCount -= 7;
        this._range = 0x8000;
    }
    _byteIn(): void {
        const data: Uint8Array = this._data;
        let bp: number = this._bitPosition;
        if (data[<number>bp] === 0xff) {
            if (data[bp + 1] > 0x8f) {
                this._low += 0xff00;
                this._bitCount = 8;
            } else {
                bp++;
                this._low += data[<number>bp] << 9;
                this._bitCount = 7;
                this._bitPosition = bp;
            }
        } else {
            bp++;
            this._low += bp < this._dataEnd ? data[<number>bp] << 8 : 0xff00;
            this._bitCount = 8;
            this._bitPosition = bp;
        }
        if (this._low > 0xffff) {
            this._high += this._low >> 16;
            this._low &= 0xffff;
        }
    }
    _readBit(contexts: any, pos: number): number { // eslint-disable-line
        const data: number = contexts[<number>pos];
        let cxIndex: number = data >> 1;
        let cxMps: number = data & 1;
        const qeTableIcx: any = this._quantizationTable[<number>cxIndex]; // eslint-disable-line
        const qeIcx: any = qeTableIcx.estimate; // eslint-disable-line
        let d: number;
        let a: number = this._range - qeIcx;
        if (this._high < qeIcx) {
            if (a < qeIcx) {
                a = qeIcx;
                d = cxMps;
                cxIndex = qeTableIcx.nextMostProbableState;
            } else {
                a = qeIcx;
                d = 1 ^ cxMps;
                if (qeTableIcx.switchFlag === 1) {
                    cxMps = d;
                }
                cxIndex = qeTableIcx.nextLeastProbableState;
            }
        } else {
            this._high -= qeIcx;
            if ((a & 0x8000) !== 0) {
                this._range = a;
                return cxMps;
            }
            if (a < qeIcx) {
                d = 1 ^ cxMps;
                if (qeTableIcx.switchFlag === 1) {
                    cxMps = d;
                }
                cxIndex = qeTableIcx.nextLeastProbableState;
            } else {
                d = cxMps;
                cxIndex = qeTableIcx.nextMostProbableState;
            }
        }
        do {
            if (this._bitCount === 0) {
                this._byteIn();
            }
            a <<= 1;
            this._high = ((this._high << 1) & 0xffff) | ((this._low >> 15) & 1);
            this._low = (this._low << 1) & 0xffff;
            this._bitCount--;
        } while ((a & 0x8000) === 0);
        this._range = a;
        contexts[<number>pos] = (cxIndex << 1) | cxMps;
        return d;
    }
}
