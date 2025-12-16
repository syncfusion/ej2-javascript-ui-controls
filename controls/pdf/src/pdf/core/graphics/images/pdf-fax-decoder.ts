
export class _PdfFaxDecoder {
    private _source: { next: Function };
    private _eof: boolean;
    private _encoding: number;
    private _endOfLine: boolean;
    private _byteAlign: boolean;
    private _columns: number;
    private _rows: number;
    private _endOfBlock: boolean;
    private _black: boolean;
    private _codingLine: Uint32Array;
    private _referenceLine: Uint32Array;
    private _codingPosition: number;
    private _row: number;
    private _nextLine: boolean;
    private _inputBits: number;
    private _inputBuffer: number;
    private _outputBits: number;
    _text: string = '';
    private _rowsDone: boolean;
    err: boolean;
    constructor(source: { next: Function }, options: any = {}) { // eslint-disable-line
        if (!source || typeof source.next !== 'function') {
            throw new Error('CCITTFaxDecoder - invalid source parameter.');
        }
        this._source = source;
        this._eof = false;
        this._encoding = options.K || 0;
        this._endOfLine = options.EndOfLine || false;
        this._byteAlign = options.EncodedByteAlign || false;
        this._columns = options.Columns || 1728;
        this._rows = options.Rows || 0;
        this._endOfBlock = (options.EndOfBlock !== undefined && options.EndOfBlock !== null) ? options.EndOfBlock : true;
        this._black = options.BlackIs1 || false;
        this._codingLine = new Uint32Array(this._columns + 1);
        this._referenceLine = new Uint32Array(this._columns + 2);
        this._codingLine[0] = this._columns;
        this._codingPosition = 0;
        this._row = 0;
        this._nextLine = this._encoding < 0;
        this._inputBits = 0;
        this._inputBuffer = 0;
        this._outputBits = 0;
        this._rowsDone = false;
        const code1: number = this._lookBits(12);
        while ( code1 === 0) {
            this._eatBits(1);
        }
        if (code1 === 1) {
            this._eatBits(12);
        }
        if (this._encoding > 0) {
            this._nextLine = !this._lookBits(1);
            this._eatBits(1);
        }
    }
    readNextChar(): number {
        if (this._eof) {
            return -1;
        }
        const refLine: any = this._referenceLine; // eslint-disable-line
        const codingLine: any = this._codingLine; // eslint-disable-line
        const columns: any = this._columns; // eslint-disable-line
        let refPos: number;
        let blackPixels: number;
        let bits: number;
        let i: number;
        if (this._outputBits === 0) {
            if (this._rowsDone) {
                this._eof = true;
            }
            if (this._eof) {
                return -1;
            }
            this.err = false;
            let code1: number;
            let code2: number;
            let code3: number;
            if (this._nextLine) {
                for (i = 0; codingLine[Number.parseInt(i.toString(), 10)] < columns; ++i) {
                    refLine[Number.parseInt(i.toString(), 10)] = codingLine[Number.parseInt(i.toString(), 10)];
                }
                refLine[Number.parseInt(i.toString(), 10)] = columns;
                i++;
                refLine[Number.parseInt(i.toString(), 10)] = columns;
                codingLine[0] = 0;
                this._codingPosition = 0;
                refPos = 0;
                blackPixels = 0;
                while (codingLine[this._codingPosition] < columns) {
                    code1 = this._getTwoDimCode();
                    switch (code1) {
                    case 0:
                        this._addPixels(refLine[refPos + 1], blackPixels);
                        if (refLine[refPos + 1] < columns) {
                            refPos += 2;
                        }
                        break;
                    case 1:
                        code1 = code2 = 0;
                        if (blackPixels) {
                            do {
                                code1 += code3 = this._getBlackCode();
                            } while (code3 >= 64);
                            do {
                                code2 += code3 = this._getWhiteCode();
                            } while (code3 >= 64);
                        } else {
                            do {
                                code1 += code3 = this._getWhiteCode();
                            } while (code3 >= 64);
                            do {
                                code2 += code3 = this._getBlackCode();
                            } while (code3 >= 64);
                        }
                        this._addPixels(codingLine[this._codingPosition] + code1, blackPixels);
                        if (codingLine[this._codingPosition] < columns) {
                            this._addPixels(codingLine[this._codingPosition] + code2, blackPixels ^ 1);
                        }
                        while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[Number.parseInt(
                            this._codingPosition.toString(), 10)] && refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                            refPos += 2;
                        }
                        break;
                    case 7:
                        this._addPixels(refLine[Number.parseInt(refPos.toString(), 10)] + 3, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            ++refPos;
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 5:
                        this._addPixels(refLine[Number.parseInt(refPos.toString(), 10)] + 2, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            ++refPos;
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 3:
                        this._addPixels(refLine[Number.parseInt(refPos.toString(), 10)] + 1, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            ++refPos;
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 2:
                        this._addPixels(refLine[Number.parseInt(refPos.toString(), 10)], blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            ++refPos;
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 8:
                        this._addPixelsNeg(refLine[Number.parseInt(refPos.toString(), 10)] - 3, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            if (refPos > 0) {
                                --refPos;
                            } else {
                                ++refPos;
                            }
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 6:
                        this._addPixelsNeg(refLine[Number.parseInt(refPos.toString(), 10)] - 2, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            if (refPos > 0) {
                                --refPos;
                            } else {
                                ++refPos;
                            }
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case 4:
                        this._addPixelsNeg(refLine[Number.parseInt(refPos.toString(), 10)] - 1, blackPixels);
                        blackPixels ^= 1;
                        if (codingLine[this._codingPosition] < columns) {
                            if (refPos > 0) {
                                --refPos;
                            } else {
                                ++refPos;
                            }
                            while (refLine[Number.parseInt(refPos.toString(), 10)] <= codingLine[this._codingPosition] &&
                            refLine[Number.parseInt(refPos.toString(), 10)] < columns) {
                                refPos += 2;
                            }
                        }
                        break;
                    case -1:
                        this._addPixels(columns, 0);
                        this._eof = true;
                        break;
                    default:
                        this._addPixels(columns, 0);
                        this.err = true;
                    }
                }
            } else {
                codingLine[0] = 0;
                this._codingPosition = 0;
                blackPixels = 0;
                while (codingLine[this._codingPosition] < columns) {
                    code1 = 0;
                    if (blackPixels) {
                        do {
                            code1 += code3 = this._getBlackCode();
                        } while (code3 >= 64);
                    } else {
                        do {
                            code1 += code3 = this._getWhiteCode();
                        } while (code3 >= 64);
                    }
                    this._addPixels(codingLine[this._codingPosition] + code1, blackPixels);
                    blackPixels ^= 1;
                }
            }
            let gotEOL: boolean = false;
            if (this._byteAlign) {
                this._inputBits &= ~7;
            }
            if (!this._endOfBlock && this._row === this._rows - 1) {
                this._rowsDone = true;
            } else {
                code1 = this._lookBits(12);
                if (this._endOfLine) {
                    while (code1 !== -1 && code1 !== 1) {
                        this._eatBits(1);
                        code1 = this._lookBits(12);
                    }
                } else {
                    while (code1 === 0) {
                        this._eatBits(1);
                        code1 = this._lookBits(12);
                    }
                }
                if (code1 === 1) {
                    this._eatBits(12);
                    gotEOL = true;
                } else if (code1 === -1) {
                    this._eof = true;
                }
            }
            if (!this._eof && this._encoding > 0 && !this._rowsDone) {
                this._nextLine = !this._lookBits(1);
                this._eatBits(1);
            }
            if (this._endOfBlock && gotEOL && this._byteAlign) {
                code1 = this._lookBits(12);
                if (code1 === 1) {
                    this._eatBits(12);
                    if (this._encoding > 0) {
                        this._lookBits(1);
                        this._eatBits(1);
                    }
                    if (this._encoding >= 0) {
                        for (i = 0; i < 4; ++i) {
                            code1 = this._lookBits(12);
                            if (code1 !== 1) {
                                //info("bad rtc code: " + code1);
                            }
                            this._eatBits(12);
                            if (this._encoding > 0) {
                                this._lookBits(1);
                                this._eatBits(1);
                            }
                        }
                    }
                    this._eof = true;
                }
            } else if (this.err && this._endOfLine) {
                while (true) { // eslint-disable-line
                    code1 = this._lookBits(13);
                    if (code1 === -1) {
                        this._eof = true;
                        return -1;
                    }
                    if (code1 >> 1 === 1) {
                        break;
                    }
                    this._eatBits(1);
                }
                this._eatBits(12);
                if (this._encoding > 0) {
                    this._eatBits(1);
                    this._nextLine = !(code1 & 1);
                }
            }
            this._outputBits =
                codingLine[0] > 0
                    ? codingLine[(this._codingPosition = 0)]
                    : codingLine[(this._codingPosition = 1)];
            this._row++;
        }
        let c: number;
        if (this._outputBits >= 8) {
            c = this._codingPosition & 1 ? 0 : 0xff;
            this._outputBits -= 8;
            if (this._outputBits === 0 && codingLine[this._codingPosition] < columns) {
                this._codingPosition++;
                this._outputBits = codingLine[this._codingPosition] - codingLine[this._codingPosition - 1];
            }
        } else {
            bits = 8;
            c = 0;
            do {
                if (typeof this._outputBits !== 'number') {
                    throw new Error(
                        'Invalid /CCITTFaxDecode data, "outputBits" must be a number.'
                    );
                }
                if (this._outputBits > bits) {
                    c <<= bits;
                    if (!(this._codingPosition & 1)) {
                        c |= 0xff >> (8 - bits);
                    }
                    this._outputBits -= bits;
                    bits = 0;
                } else {
                    c <<= this._outputBits;
                    if (!(this._codingPosition & 1)) {
                        c |= 0xff >> (8 - this._outputBits);
                    }
                    bits -= this._outputBits;
                    this._outputBits = 0;
                    if (codingLine[this._codingPosition] < columns) {
                        this._codingPosition++;
                        this._outputBits = codingLine[this._codingPosition] - codingLine[this._codingPosition - 1];
                    } else if (bits > 0) {
                        c <<= bits;
                        bits = 0;
                    }
                }
            } while (bits);
        }
        if (this._black) {
            c ^= 0xff;
        }
        return c;
    }
    private _addPixels(a1: number, blackPixels: number): void {
        const codingLine: any = this._codingLine; // eslint-disable-line
        let codingPos: number = this._codingPosition;
        if (a1 > codingLine[Number.parseInt(codingPos.toString(), 10)]) {
            if (a1 > this._columns) {
                this.err = true;
                a1 = this._columns;
            }
            if ((codingPos & 1) ^ blackPixels) {
                ++codingPos;
            }
            codingLine[Number.parseInt(codingPos.toString(), 10)] = a1;
        }
        this._codingPosition = codingPos;
    }
    private _addPixelsNeg(a1: number, blackPixels: number): void {
        const codingLine: any = this._codingLine; // eslint-disable-line
        let codingPos: any = this._codingPosition; // eslint-disable-line
        if (a1 > codingLine[Number.parseInt(codingPos.toString(), 10)]) {
            if (a1 > this._columns) {
                this.err = true;
                a1 = this._columns;
            }
            if ((codingPos & 1) ^ blackPixels) {
                ++codingPos;
            }
            codingLine[Number.parseInt(codingPos.toString(), 10)] = a1;
        } else if (a1 < codingLine[Number.parseInt(codingPos.toString(), 10)]) {
            if (a1 < 0) {
                this.err = true;
                a1 = 0;
            }
            while (codingPos > 0 && a1 < codingLine[codingPos - 1]) {
                --codingPos;
            }
            codingLine[Number.parseInt(codingPos.toString(), 10)] = a1;
        }
        this._codingPosition = codingPos;
    }
    private _findTableCode(start: number, end: number, table: any, limit?: number): [boolean, number, boolean] {// eslint-disable-line
        const limitValue: number = (limit !== undefined && limit !== null) ? limit : 0;
        for (let i: number = start; i <= end; ++i) {
            let code: any = this._lookBits(i); // eslint-disable-line
            if (code === -1) {
                return [true, 1, false];
            }
            if (i < end) {
                code <<= end - i;
            }
            if (!limitValue || code >= limitValue) {
                const p: any = table[code - limitValue]; // eslint-disable-line
                if (p[0] === i) {
                    this._eatBits(i);
                    return [true, p[1], true];
                }
            }
        }
        return [false, 0, false];
    }
    private _getTwoDimCode(): number {
        let code: number = 0;
        let p: any; // eslint-disable-line
        const twoDimTable: number[][] = [[-1, -1], [-1, -1], [7, 8], [7, 7], [6, 6], [6, 6], [6, 5], [6, 5], [4, 0], [4, 0], [4, 0],
            [4, 0], [4, 0], [4, 0], [4, 0], [4, 0], [3, 1], [3, 1],
            [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1],
            [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4],  [3, 4], [3, 4],
            [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3],
            [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2],
            [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2],
            [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2],  [1, 2], [1, 2], [1, 2], [1, 2],
            [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2],
            [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2]];
        if (this._endOfBlock) {
            code = this._lookBits(7);
            this._text += code;
            p = twoDimTable[<number>code];
            if (p && p[0] > 0) {
                this._eatBits(p[0]);
                return p[1];
            }
        } else {
            const result: any = this._findTableCode(1, 7, twoDimTable); // eslint-disable-line
            if (result[0] && result[2]) {
                return result[1];
            }
        }
        return -1;
    }
    private _getWhiteCode(): number {
        let code: number = 0;
        let p: any; // eslint-disable-line
        const whiteTable1: number[][] = [[-1, -1], [12, -2], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1],
            [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [11, 1792], [11, 1792], [12, 1984], [12, 2048],
            [12, 2112], [12, 2176], [12, 2240], [12, 2304], [11, 1856], [11, 1856], [11, 1920], [11, 1920], [12, 2368],
            [12, 2432], [12, 2496], [12, 2560]];
        const whiteTable2: number[][] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [8, 29], [8, 29], [8, 30], [8, 30], [8, 45], [8, 45],
            [8, 46], [8, 46], [7, 22], [7, 22], [7, 22], [7, 22], [7, 23], [7, 23], [7, 23], [7, 23], [8, 47], [8, 47],
            [8, 48], [8, 48], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [7, 20], [7, 20],
            [7, 20], [7, 20], [8, 33], [8, 33], [8, 34], [8, 34], [8, 35], [8, 35], [8, 36], [8, 36], [8, 37], [8, 37],
            [8, 38], [8, 38], [7, 19], [7, 19], [7, 19], [7, 19], [8, 31], [8, 31], [8, 32], [8, 32], [6, 1], [6, 1],
            [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12],
            [6, 12], [6, 12], [8, 53], [8, 53], [8, 54], [8, 54],  [7, 26], [7, 26], [7, 26], [7, 26], [8, 39], [8, 39],
            [8, 40], [8, 40], [8, 41], [8, 41], [8, 42], [8, 42], [8, 43], [8, 43], [8, 44], [8, 44], [7, 21], [7, 21],
            [7, 21], [7, 21], [7, 28], [7, 28], [7, 28], [7, 28], [8, 61], [8, 61], [8, 62], [8, 62],  [8, 63], [8, 63],
            [8, 0], [8, 0], [8, 320], [8, 320], [8, 384], [8, 384], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10],
            [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 11], [5, 11],
            [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11],
            [5, 11], [5, 11], [7, 27], [7, 27], [7, 27], [7, 27], [8, 59], [8, 59], [8, 60], [8, 60], [9, 1472], [9, 1536],
            [9, 1600], [9, 1728], [7, 18], [7, 18], [7, 18], [7, 18], [7, 24], [7, 24], [7, 24], [7, 24], [8, 49], [8, 49],
            [8, 50], [8, 50], [8, 51], [8, 51], [8, 52], [8, 52], [7, 25], [7, 25], [7, 25], [7, 25], [8, 55], [8, 55],
            [8, 56], [8, 56],  [8, 57], [8, 57], [8, 58], [8, 58], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192],
            [6, 192], [6, 192], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664],
            [8, 448], [8, 448], [8, 512], [8, 512], [9, 704], [9, 768], [8, 640], [8, 640], [8, 576], [8, 576], [9, 832],
            [9, 896], [9, 960], [9, 1024], [9, 1088], [9, 1152], [9, 1216], [9, 1280], [9, 1344], [9, 1408], [7, 256],
            [7, 256], [7, 256], [7, 256], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2],
            [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2],
            [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3],
            [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3],
            [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [5, 128], [5, 128],
            [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128],
            [5, 128], [5, 128], [5, 128], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8],
            [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9],
            [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16],
            [6, 16], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [4, 4], [4, 4], [4, 4], [4, 4],
            [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4],
            [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 5],
            [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5],
            [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5],
            [4, 5], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 15], [6, 15], [6, 15], [6, 15],
            [6, 15], [6, 15], [6, 15], [6, 15], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64],
            [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6],
            [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6],
            [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7],
            [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7],
            [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7]];
        if (this._endOfBlock) {
            code = this._lookBits(12);
            if (code === -1) {
                return 1;
            }
            p = code >> 5 === 0 ? whiteTable1[Number.parseInt(code.toString(), 10)] : whiteTable2[code >> 3];
            if (p[0] > 0) {
                this._eatBits(p[0]);
                return p[1];
            }
        } else {
            let result: [boolean, number, boolean] = this._findTableCode(1, 9, whiteTable2);
            if (result[0]) {
                return result[1];
            }
            result = this._findTableCode(11, 12, whiteTable1);
            if (result[0]) {
                return result[1];
            }
        }
        this._eatBits(1);
        return 1;
    }
    private _getBlackCode(): number {
        let code: number;
        let p: any; // eslint-disable-line
        const blackTable1: number[][] = [[-1, -1], [-1, -1], [12, -2], [12, -2], [-1, -1], [-1, -1], [-1, -1], [-1, -1],
            [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1],  [-1, -1],
            [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1],
            [11, 1792], [11, 1792], [11, 1792], [11, 1792], [12, 1984], [12, 1984], [12, 2048], [12, 2048], [12, 2112], [12, 2112],
            [12, 2176], [12, 2176], [12, 2240], [12, 2240], [12, 2304], [12, 2304], [11, 1856], [11, 1856], [11, 1856], [11, 1856],
            [11, 1920], [11, 1920], [11, 1920], [11, 1920], [12, 2368], [12, 2368], [12, 2432], [12, 2432], [12, 2496], [12, 2496],
            [12, 2560], [12, 2560], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [12, 52], [12, 52],
            [13, 640], [13, 704], [13, 768], [13, 832], [12, 55], [12, 55], [12, 56], [12, 56], [13, 1280], [13, 1344], [13, 1408],
            [13, 1472], [12, 59], [12, 59], [12, 60], [12, 60], [13, 1536], [13, 1600], [11, 24], [11, 24], [11, 24], [11, 24],
            [11, 25], [11, 25], [11, 25], [11, 25], [13, 1664], [13, 1728], [12, 320], [12, 320], [12, 384], [12, 384], [12, 448],
            [12, 448], [13, 512], [13, 576], [12, 53], [12, 53], [12, 54], [12, 54], [13, 896], [13, 960], [13, 1024], [13, 1088],
            [13, 1152], [13, 1216], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64]];
        const blackTable2: number[][] = [[8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13],
            [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [11, 23], [11, 23], [12, 50], [12, 51], [12, 44], [12, 45], [12, 46],
            [12, 47], [12, 57], [12, 58], [12, 61], [12, 256], [10, 16], [10, 16], [10, 16], [10, 16], [10, 17], [10, 17], [10, 17],
            [10, 17], [12, 48], [12, 49], [12, 62], [12, 63], [12, 30], [12, 31], [12, 32], [12, 33], [12, 40], [12, 41], [11, 22],
            [11, 22], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14],
            [8, 14], [8, 14], [8, 14], [8, 14], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10],
            [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10],
            [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 11], [7, 11], [7, 11],
            [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11],
            [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11],
            [7, 11], [7, 11], [7, 11], [7, 11], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [12, 128],
            [12, 192], [12, 26], [12, 27], [12, 28], [12, 29], [11, 19], [11, 19], [11, 20], [11, 20], [12, 34], [12, 35],
            [12, 36], [12, 37], [12, 38], [12, 39], [11, 21], [11, 21], [12, 42], [12, 43], [10, 0], [10, 0], [10, 0], [10, 0],
            [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12],
            [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12],
            [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12]];
        const blackTable3: number[][] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [6, 9], [6, 8], [5, 7], [5, 7], [4, 6], [4, 6],
            [4, 6], [4, 6], [4, 5], [4, 5], [4, 5], [4, 5], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1],
            [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3],
            [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2],
            [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2]];
        if (this._endOfBlock) {
            code = this._lookBits(13);
            if (code === -1) {
                return 1;
            }
            if (code >> 7 === 0) {
                p = blackTable1[Number.parseInt(code.toString(), 10)];
            } else if (code >> 9 === 0 && code >> 7 !== 0) {
                p = blackTable2[(code >> 1) - 64];
            } else {
                p = blackTable3[code >> 7];
            }
            if (p[0] > 0) {
                this._eatBits(p[0]);
                return p[1];
            }
        } else {
            let result: any = this._findTableCode(2, 6, blackTable3); // eslint-disable-line
            if (result[0]) {
                return result[1];
            }
            result = this._findTableCode(7, 12, blackTable2, 64);
            if (result[0]) {
                return result[1];
            }
            result = this._findTableCode(10, 13, blackTable1);
            if (result[0]) {
                return result[1];
            }
        }
        this._eatBits(1);
        return 1;
    }
    _lookBits(n: number): number {
        while (this._inputBits < n) {
            let c: any = this._source.next(); // eslint-disable-line
            if (c === -1) {
                if (this._inputBits === 0) {
                    return -1;
                }
                return (this._inputBuffer << (n - this._inputBits)) & (0xffff >> (16 - n));
            }
            this._inputBuffer = (this._inputBuffer << 8) | c;
            this._inputBits += 8;
        }
        return (this._inputBuffer >> (this._inputBits - n)) & (0xffff >> (16 - n));
    }
    _eatBits(n: number): void {
        this._inputBits -= n;
        if (this._inputBits < 0) {
            this._inputBits = 0;
        }
    }
}
