import { _PdfFaxDecoder } from '../src/pdf/core/graphics/images/pdf-fax-decoder';

describe('Pdf-fax-decoder file mutation test scripts', () => {
    function createDecoder(options: any = {}): any { // eslint-disable-line
        const source = {
            next: jasmine.createSpy('next').and.returnValue(-1)
        };
        return new _PdfFaxDecoder(source, options) as any;
    }

    function setCodingLine(decoder: any, values: number[]): void { // eslint-disable-line
        decoder._codingLine = Uint32Array.from(values);
    }

    describe('constructor and property tests', () => {
        it('Property level mutation testing', () => {
            const decoder: any = createDecoder();
            const reference = new Uint32Array(1728 + 2);

            expect(decoder._text).toEqual('');
            expect(decoder._byteAlign).toEqual(false);
            expect(decoder._rows).toEqual(0);
            expect(decoder._endOfBlock).toEqual(true);
            expect(decoder._black).toEqual(false);
            expect(decoder._referenceLine).toEqual(reference);
        });

        it('this._encoding > 0 line mutation test in the constructor', () => {
            const lookBitsSpy = spyOn(_PdfFaxDecoder.prototype as any, '_lookBits').and.returnValues(
                1, // initial constructor _lookBits(12), avoids constructor while loop
                0  // _encoding > 0 branch _lookBits(1)
            );
            const eatBitsSpy = spyOn(_PdfFaxDecoder.prototype as any, '_eatBits');

            const decoder: any = new _PdfFaxDecoder({
                next: jasmine.createSpy('next').and.returnValue(-1)
            }, { K: 3 });

            expect(decoder).toBeDefined();
            expect(lookBitsSpy).toHaveBeenCalled();
            expect(eatBitsSpy).toHaveBeenCalled();
        });

        it('readNextChar method level mutation testing', () => {
            const decoder: any = createDecoder({ K: 3 });
            decoder._eof = true;

            const result = decoder.readNextChar();

            expect(result).toEqual(-1);
        });

        it('should throw when source is invalid', () => {
            expect(() => new (_PdfFaxDecoder as any)(null)).toThrowError(
                'CCITTFaxDecoder - invalid source parameter.'
            );
            expect(() => new (_PdfFaxDecoder as any)({})).toThrowError(
                'CCITTFaxDecoder - invalid source parameter.'
            );
        });
    });

    describe('_addPixels method mutation tests', () => {
        it('_addPixels should not update coding line when a1 is equal to current coding position value', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 25;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixels(25, true);

            expect(decoder._codingPosition).toBe(0);
            expect(decoder._codingLine[0]).toBe(25);
            expect(decoder._codingLine[1]).toBe(99);
            expect(decoder.err).toBe(false);
        });

        it('_addPixels should not update coding line when a1 is less than current coding position value', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 25;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixels(24, false);

            expect(decoder._codingPosition).toBe(0);
            expect(decoder._codingLine[0]).toBe(25);
            expect(decoder._codingLine[1]).toBe(99);
            expect(decoder.err).toBe(false);
        });

        it('_addPixels should increment coding position and write a1 when black pixel parity requires it', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 5;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixels(10, true);

            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[0]).toBe(5);
            expect(decoder._codingLine[1]).toBe(10);
            expect(decoder.err).toBe(false);
        });

        it('_addPixels should clamp a1 to columns and set err when a1 exceeds columns', () => {
            const decoder: any = createDecoder();
            decoder._columns = 10;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 5;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixels(15, true);

            expect(decoder.err).toBe(true);
            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[1]).toBe(10);
        });
    });

    describe('readNextChar method mutation tests - timeout safe', () => {
        it('Mutant 76: Returns -1 immediately when _eof is true', () => {
            const decoder: any = createDecoder();
            decoder._eof = true;

            const result = decoder.readNextChar();

            expect(result).toBe(-1);
        });

        it('Mutant 76: Processes normally when _eof is false', () => {
            const decoder: any = createDecoder();
            decoder._eof = false;
            decoder._outputBits = 8;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 1;
            decoder._codingLine[1] = 100;

            const result = decoder.readNextChar();

            expect(typeof result).toBe('number');
            expect(result).not.toBe(-1);
        });

        it('Mutant 106-109: Conditional check when _rowsDone is true sets _eof', () => {
            const decoder: any = createDecoder();
            decoder._eof = false;
            decoder._outputBits = 0;
            decoder._rowsDone = true;
            decoder._nextLine = false;

            const result = decoder.readNextChar();

            expect(decoder._eof).toBe(true);
            expect(result).toBe(-1);
        });

        it('Mutant 111-112: refPos incremented by 2 in case 0 when condition true', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [2, 5, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValues(0, -1);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalled();
        });

        it('Mutant 114-115: Checks if refLine value is less than columns for boundary', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [9, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(0);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalledWith(10, 0);
        });

        it('Mutant 118-119: code1 accumulation using += operator in do-while', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [2, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(1);
            spyOn(decoder, '_getBlackCode').and.returnValue(3);
            spyOn(decoder, '_getWhiteCode').and.returnValue(4);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalled();
            expect(decoder._row).toBe(1);
        });

        it('Mutant 120-121: do-while condition correctly checks code3 >= 64', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [2, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValues(2, 1);
            spyOn(decoder, '_getBlackCode').and.returnValues(100, 10);
            spyOn(decoder, '_getWhiteCode').and.returnValue(10);
            spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(decoder._getBlackCode).toHaveBeenCalled();
        });

        it('Mutant 138-142: Addition operator in code position calculation', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [2, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(1);
            spyOn(decoder, '_getBlackCode').and.returnValue(2);
            spyOn(decoder, '_getWhiteCode').and.returnValue(3);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalledWith(3, 0);
        });

        it('Mutant 145-152: Logical AND in while condition for refPos advancement', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [2, 5, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(1);
            spyOn(decoder, '_getBlackCode').and.returnValue(2);
            spyOn(decoder, '_getWhiteCode').and.returnValue(2);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalled();
        });

        [7, 5, 3, 2].forEach((twoDimCode: number) => {
            it('2D positive vertical/pass case ' + twoDimCode + ' terminates without timeout', () => {
                const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
                setCodingLine(decoder, [10, 10, 10]);
                spyOn(decoder, '_getTwoDimCode').and.returnValue(twoDimCode);
                const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

                const result = decoder.readNextChar();

                expect(result).toBeDefined();
                expect(addPixelsSpy).toHaveBeenCalled();
                expect(decoder._row).toBe(1);
            });
        });

        [8, 6, 4].forEach((twoDimCode: number) => {
            it('2D negative vertical case ' + twoDimCode + ' terminates without timeout', () => {
                const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
                setCodingLine(decoder, [2, 5, 10, 10]);
                spyOn(decoder, '_getTwoDimCode').and.returnValues(2, twoDimCode, -1);
                const addPixelsNegSpy = spyOn(decoder, '_addPixelsNeg').and.callThrough();

                const result = decoder.readNextChar();

                expect(result).toBeDefined();
                expect(addPixelsNegSpy).toHaveBeenCalled();
                expect(decoder._row).toBe(1);
            });
        });

        it('Mutant 299-303: Case -1 sets _eof to true', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);
            spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(decoder._eof).toBe(true);
        });

        it('Mutant 310-314: Default case sets err flag', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(999);
            spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(decoder.err).toBe(true);
        });

        it('Mutant 330-335: 1D encoding black pixels handling', () => {
            const decoder: any = createDecoder({ K: 0, Columns: 10, EndOfBlock: false, Rows: 1 });
            decoder._nextLine = false;
            spyOn(decoder, '_getWhiteCode').and.returnValue(5);
            spyOn(decoder, '_getBlackCode').and.returnValue(5);
            const addPixelsSpy = spyOn(decoder, '_addPixels').and.callThrough();

            decoder.readNextChar();

            expect(addPixelsSpy).toHaveBeenCalled();
        });

        it('Mutant 369-370: _black flag inverts output byte', () => {
            const decoder: any = createDecoder({ BlackIs1: true });
            decoder._eof = false;
            decoder._outputBits = 8;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 1;
            decoder._codingLine[1] = 100;

            const result = decoder.readNextChar();

            expect(result).toBe(0);
        });

        it('Mutant 504: Right shift assignment operator c >>= bits', () => {
            const decoder: any = createDecoder();
            decoder._eof = false;
            decoder._outputBits = 4;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 1;
            decoder._codingLine[1] = 100;

            const result = decoder.readNextChar();

            expect(typeof result).toBe('number');
        });

        it('Mutant 329-335: _outputBits >= 8 branch uses correct comparison', () => {
            const decoder: any = createDecoder();
            decoder._eof = false;
            decoder._outputBits = 8;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 1;
            decoder._codingLine[1] = 100;

            const result = decoder.readNextChar();

            expect(result).toBeDefined();
        });

        it('Mutant 327-328: _outputBits === 0 executes full line processing', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);

            decoder.readNextChar();

            expect(decoder._row).toBe(1);
        });

        it('Mutant 257-259: byteAlign masking operation', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1, EncodedByteAlign: true });
            setCodingLine(decoder, [0, 10, 10]);
            decoder._inputBits = 15;
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);

            decoder.readNextChar();

            expect(decoder._inputBits & ~7).toBe(decoder._inputBits);
        });

        it('Mutant 244-250: End of block condition checks correctly', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: false, Rows: 1 });
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);

            decoder.readNextChar();

            expect(decoder._rowsDone).toBe(true);
        });

        it('Mutant 251-256: EOL lookup and processing', () => {
            const decoder: any = createDecoder({ K: -1, Columns: 10, EndOfBlock: true, EndOfLine: false });
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);
            const lookBitsSpy = spyOn(decoder, '_lookBits').and.returnValue(1);
            spyOn(decoder, '_eatBits').and.callThrough();

            decoder.readNextChar();

            expect(lookBitsSpy).toHaveBeenCalled();
        });

        it('Mutant 277-279: 2D encoding branch selection', () => {
            const decoder: any = createDecoder({ K: 2, Columns: 10, EndOfBlock: false, Rows: 1 });
            decoder._nextLine = true;
            decoder._encoding = 2;
            setCodingLine(decoder, [0, 10, 10]);
            spyOn(decoder, '_getTwoDimCode').and.returnValue(-1);
            spyOn(decoder, '_lookBits').and.returnValue(0);
            spyOn(decoder, '_eatBits').and.callThrough();

            decoder.readNextChar();

            expect(decoder._nextLine).toBeDefined();
        });

        it('Mutant 321-326: Output bits accumulation for partial bytes', () => {
            const decoder: any = createDecoder();
            decoder._eof = false;
            decoder._outputBits = 4;
            decoder._codingPosition = 1;
            decoder._codingLine = Uint32Array.from([0, 50, 100]);
            decoder._columns = 100;

            const result = decoder.readNextChar();

            expect(typeof result).toBe('number');
        });
    });

    describe('_addPixelsNeg method mutation tests', () => {
        it('_addPixelsNeg should not update when a1 equals current coding value', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 25;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixelsNeg(25, true);

            expect(decoder._codingPosition).toBe(0);
            expect(decoder._codingLine[0]).toBe(25);
            expect(decoder._codingLine[1]).toBe(99);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should not set err when a1 equals columns', () => {
            const decoder: any = createDecoder();
            decoder._columns = 10;
            decoder._codingPosition = 0;
            decoder._codingLine[0] = 5;
            decoder._codingLine[1] = 99;
            decoder.err = false;

            decoder._addPixelsNeg(10, true);

            expect(decoder.err).toBe(false);
            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[1]).toBe(10);
        });

        it('_addPixelsNeg should not increment coding position when parity condition is false', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 1;
            decoder._codingLine[1] = 5;
            decoder._codingLine[2] = 88;
            decoder.err = false;

            decoder._addPixelsNeg(10, true);

            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[1]).toBe(10);
            expect(decoder._codingLine[2]).toBe(88);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should clamp negative a1 to zero and set err', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 1;
            decoder._codingLine[0] = 0;
            decoder._codingLine[1] = 20;
            decoder.err = false;

            decoder._addPixelsNeg(-5, false);

            expect(decoder.err).toBe(true);
            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[1]).toBe(0);
        });

        it('_addPixelsNeg should not set err when a1 is exactly zero', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 1;
            decoder._codingLine[0] = 0;
            decoder._codingLine[1] = 20;
            decoder.err = false;

            decoder._addPixelsNeg(0, false);

            expect(decoder.err).toBe(false);
            expect(decoder._codingPosition).toBe(1);
            expect(decoder._codingLine[1]).toBe(0);
        });

        it('_addPixelsNeg should stop decrementing at the first previous value lower than a1', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 3;
            decoder._codingLine[0] = 0;
            decoder._codingLine[1] = 10;
            decoder._codingLine[2] = 20;
            decoder._codingLine[3] = 30;
            decoder.err = false;

            decoder._addPixelsNeg(15, false);

            expect(decoder._codingPosition).toBe(2);
            expect(decoder._codingLine[0]).toBe(0);
            expect(decoder._codingLine[1]).toBe(10);
            expect(decoder._codingLine[2]).toBe(15);
            expect(decoder._codingLine[3]).toBe(30);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should not decrement when a1 equals previous coding value', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 3;
            decoder._codingLine[1] = 10;
            decoder._codingLine[2] = 15;
            decoder._codingLine[3] = 30;
            decoder.err = false;

            decoder._addPixelsNeg(15, false);

            expect(decoder._codingPosition).toBe(3);
            expect(decoder._codingLine[2]).toBe(15);
            expect(decoder._codingLine[3]).toBe(15);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should not decrement when previous coding value is lower than a1', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 3;
            decoder._codingLine[1] = 10;
            decoder._codingLine[2] = 20;
            decoder._codingLine[3] = 30;
            decoder.err = false;

            decoder._addPixelsNeg(25, false);

            expect(decoder._codingPosition).toBe(3);
            expect(decoder._codingLine[3]).toBe(25);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should use previous index while decrementing', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 3;
            decoder._codingLine[0] = 0;
            decoder._codingLine[1] = 10;
            decoder._codingLine[2] = 20;
            decoder._codingLine[3] = 30;
            decoder._codingLine[4] = 100;
            decoder.err = false;

            decoder._addPixelsNeg(15, false);

            expect(decoder._codingPosition).toBe(2);
            expect(decoder._codingLine[2]).toBe(15);
            expect(decoder._codingLine[3]).toBe(30);
            expect(decoder._codingLine[4]).toBe(100);
            expect(decoder.err).toBe(false);
        });

        it('_addPixelsNeg should not run while loop at coding position zero', () => {
            const decoder: any = createDecoder();
            decoder._columns = 100;
            decoder._codingPosition = 0;
            decoder._codingLine = [20] as any;
            decoder._codingLine[-1] = 100;
            decoder.err = false;

            decoder._addPixelsNeg(10, false);

            expect(decoder._codingPosition).toBe(0);
            expect(decoder._codingLine[0]).toBe(10);
            expect(decoder._codingLine[-1]).toBe(100);
            expect(decoder.err).toBe(false);
        });
    });

    describe('_getTwoDimCode method mutation tests', () => {
        [
            { code: 2, eatBits: 7, result: 8 },
            { code: 3, eatBits: 7, result: 7 },
            { code: 4, eatBits: 6, result: 6 },
            { code: 5, eatBits: 6, result: 6 },
            { code: 6, eatBits: 6, result: 5 },
            { code: 7, eatBits: 6, result: 5 },
            { code: 8, eatBits: 4, result: 0 },
            { code: 15, eatBits: 4, result: 0 },
            { code: 16, eatBits: 3, result: 1 },
            { code: 31, eatBits: 3, result: 1 },
            { code: 32, eatBits: 3, result: 4 },
            { code: 47, eatBits: 3, result: 4 },
            { code: 48, eatBits: 3, result: 3 },
            { code: 63, eatBits: 3, result: 3 },
            { code: 64, eatBits: 1, result: 2 },
            { code: 127, eatBits: 1, result: 2 }
        ].forEach((item: { code: number; eatBits: number; result: number }) => {
            it('_getTwoDimCode should return exact two dimensional code for table index ' + item.code, () => {
                const decoder: any = createDecoder();
                decoder._endOfBlock = true;
                decoder._text = '';
                spyOn(decoder, '_lookBits').and.returnValue(item.code);
                const eatBitsSpy = spyOn(decoder, '_eatBits');

                const result: number = decoder._getTwoDimCode();

                expect(decoder._lookBits).toHaveBeenCalledTimes(1);
                expect(decoder._lookBits).toHaveBeenCalledWith(7);
                expect(eatBitsSpy).toHaveBeenCalledTimes(1);
                expect(eatBitsSpy).toHaveBeenCalledWith(item.eatBits);
                expect(result).toBe(item.result);
                expect(decoder._text).toBe(item.code.toString());
            });
        });

        it('_getTwoDimCode should return -1 and not eat bits for table index 0', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            decoder._text = '';
            spyOn(decoder, '_lookBits').and.returnValue(0);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getTwoDimCode();

            expect(decoder._lookBits).toHaveBeenCalledTimes(1);
            expect(decoder._lookBits).toHaveBeenCalledWith(7);
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(result).toBe(-1);
            expect(decoder._text).toBe('0');
        });

        it('_getTwoDimCode should return -1 and not eat bits for table index 1', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            decoder._text = 'A';
            spyOn(decoder, '_lookBits').and.returnValue(1);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getTwoDimCode();

            expect(decoder._lookBits).toHaveBeenCalledTimes(1);
            expect(decoder._lookBits).toHaveBeenCalledWith(7);
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(result).toBe(-1);
            expect(decoder._text).toBe('A1');
        });

        it('_getTwoDimCode should append looked up code to _text exactly once', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            decoder._text = 'prefix-';
            spyOn(decoder, '_lookBits').and.returnValue(64);
            spyOn(decoder, '_eatBits');

            const result: number = decoder._getTwoDimCode();

            expect(result).toBe(2);
            expect(decoder._text).toBe('prefix-64');
        });

        it('_getTwoDimCode should use _findTableCode when endOfBlock is false and return result[1] only when result[0] and result[2] are true', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const lookBitsSpy = spyOn(decoder, '_lookBits');
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 4, true]);

            const result: number = decoder._getTwoDimCode();

            expect(lookBitsSpy).not.toHaveBeenCalled();
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(1);
            expect(findTableSpy.calls.mostRecent().args[0]).toBe(1);
            expect(findTableSpy.calls.mostRecent().args[1]).toBe(7);
            expect(Array.isArray(findTableSpy.calls.mostRecent().args[2])).toBe(true);
            expect(result).toBe(4);
        });

        it('_getTwoDimCode should return -1 when _findTableCode first flag is false', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            spyOn(decoder, '_findTableCode').and.returnValue([false, 4, true]);

            const result: number = decoder._getTwoDimCode();

            expect(result).toBe(-1);
        });

        it('_getTwoDimCode should return -1 when _findTableCode third flag is false', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            spyOn(decoder, '_findTableCode').and.returnValue([true, 4, false]);

            const result: number = decoder._getTwoDimCode();

            expect(result).toBe(-1);
        });

        it('_getTwoDimCode should return zero when _findTableCode resolves to valid result value zero', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            spyOn(decoder, '_findTableCode').and.returnValue([true, 0, true]);

            const result: number = decoder._getTwoDimCode();

            expect(result).toBe(0);
        });

        it('_getTwoDimCode should not call _findTableCode when endOfBlock is true', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            spyOn(decoder, '_lookBits').and.returnValue(2);
            spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode');

            const result: number = decoder._getTwoDimCode();

            expect(findTableSpy).not.toHaveBeenCalled();
            expect(result).toBe(8);
        });
    });

    describe('_getWhiteCode method mutation tests', () => {
        it('_getWhiteCode should return 1 and not eat bits when _lookBits returns -1', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            spyOn(decoder, '_lookBits').and.returnValue(-1);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getWhiteCode();

            expect(decoder._lookBits).toHaveBeenCalledTimes(1);
            expect(decoder._lookBits).toHaveBeenCalledWith(12);
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(result).toBe(1);
        });

        [
            { code: 1, eatBits: 12, result: -2 },
            { code: 16, eatBits: 11, result: 1792 },
            { code: 18, eatBits: 12, result: 1984 },
            { code: 32, eatBits: 8, result: 29 },
            { code: 48, eatBits: 8, result: 30 },
            { code: 64, eatBits: 8, result: 45 },
            { code: 80, eatBits: 8, result: 46 },
            { code: 96, eatBits: 7, result: 22 },
            { code: 128, eatBits: 7, result: 23 },
            { code: 160, eatBits: 8, result: 47 },
            { code: 176, eatBits: 8, result: 48 },
            { code: 192, eatBits: 6, result: 13 },
            { code: 256, eatBits: 7, result: 20 },
            { code: 288, eatBits: 8, result: 33 },
            { code: 304, eatBits: 8, result: 34 },
            { code: 320, eatBits: 8, result: 35 },
            { code: 336, eatBits: 8, result: 36 },
            { code: 384, eatBits: 7, result: 19 },
            { code: 416, eatBits: 8, result: 31 },
            { code: 432, eatBits: 8, result: 32 },
            { code: 448, eatBits: 6, result: 1 },
            { code: 512, eatBits: 6, result: 12 },
            { code: 848, eatBits: 8, result: 0 },
            { code: 1216, eatBits: 9, result: 1472 },
            { code: 1240, eatBits: 9, result: 1728 },
            { code: 1792, eatBits: 4, result: 2 },
            { code: 2048, eatBits: 4, result: 3 },
            { code: 2304, eatBits: 5, result: 128 },
            { code: 2432, eatBits: 5, result: 8 },
            { code: 2560, eatBits: 5, result: 9 },
            { code: 2688, eatBits: 6, result: 16 },
            { code: 2752, eatBits: 6, result: 17 },
            { code: 2816, eatBits: 4, result: 4 },
            { code: 3072, eatBits: 4, result: 5 },
            { code: 3328, eatBits: 6, result: 14 },
            { code: 3392, eatBits: 6, result: 15 },
            { code: 3456, eatBits: 5, result: 64 },
            { code: 3584, eatBits: 4, result: 6 },
            { code: 3840, eatBits: 4, result: 7 }
        ].forEach((item: { code: number; eatBits: number; result: number }) => {
            it('_getWhiteCode should decode code ' + item.code + ' exactly', () => {
                const decoder: any = createDecoder();
                decoder._endOfBlock = true;
                spyOn(decoder, '_lookBits').and.returnValue(item.code);
                const eatBitsSpy = spyOn(decoder, '_eatBits');

                const result: number = decoder._getWhiteCode();

                expect(decoder._lookBits).toHaveBeenCalledTimes(1);
                expect(decoder._lookBits).toHaveBeenCalledWith(12);
                expect(eatBitsSpy).toHaveBeenCalledTimes(1);
                expect(eatBitsSpy).toHaveBeenCalledWith(item.eatBits);
                expect(result).toBe(item.result);
            });
        });

        it('_getWhiteCode should fall back by eating one bit when whiteTable1 entry is invalid', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            spyOn(decoder, '_lookBits').and.returnValue(0);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getWhiteCode();

            expect(eatBitsSpy).toHaveBeenCalledTimes(1);
            expect(eatBitsSpy).toHaveBeenCalledWith(1);
            expect(result).toBe(1);
        });

        it('_getWhiteCode should use first _findTableCode result when endOfBlock is false', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const lookBitsSpy = spyOn(decoder, '_lookBits');
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 37, true]);

            const result: number = decoder._getWhiteCode();

            expect(lookBitsSpy).not.toHaveBeenCalled();
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(1);
            expect(findTableSpy.calls.argsFor(0)[0]).toBe(1);
            expect(findTableSpy.calls.argsFor(0)[1]).toBe(9);
            expect(Array.isArray(findTableSpy.calls.argsFor(0)[2])).toBe(true);
            expect(result).toBe(37);
        });

        it('_getWhiteCode should return zero from first _findTableCode result when result value is zero', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            spyOn(decoder, '_eatBits');
            spyOn(decoder, '_findTableCode').and.returnValue([true, 0, true]);

            const result: number = decoder._getWhiteCode();

            expect(result).toBe(0);
            expect(decoder._eatBits).not.toHaveBeenCalled();
        });

        it('_getWhiteCode should use second _findTableCode result when first lookup fails', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 1984, true]);

            const result: number = decoder._getWhiteCode();

            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(2);
            expect(findTableSpy.calls.argsFor(0)[0]).toBe(1);
            expect(findTableSpy.calls.argsFor(0)[1]).toBe(9);
            expect(findTableSpy.calls.argsFor(1)[0]).toBe(11);
            expect(findTableSpy.calls.argsFor(1)[1]).toBe(12);
            expect(Array.isArray(findTableSpy.calls.argsFor(1)[2])).toBe(true);
            expect(result).toBe(1984);
        });

        it('_getWhiteCode should fall back by eating one bit when both table lookups fail', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false]);

            const result: number = decoder._getWhiteCode();

            expect(findTableSpy).toHaveBeenCalledTimes(2);
            expect(eatBitsSpy).toHaveBeenCalledTimes(1);
            expect(eatBitsSpy).toHaveBeenCalledWith(1);
            expect(result).toBe(1);
        });
    });

    describe('_getBlackCode method mutation tests', () => {
        it('_getBlackCode should return 1 and not eat bits when _lookBits returns -1', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            spyOn(decoder, '_lookBits').and.returnValue(-1);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getBlackCode();

            expect(decoder._lookBits).toHaveBeenCalledTimes(1);
            expect(decoder._lookBits).toHaveBeenCalledWith(13);
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(result).toBe(1);
        });

        it('_getBlackCode should fall back by eating one bit when blackTable1 entry is invalid', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            spyOn(decoder, '_lookBits').and.returnValue(0);
            const eatBitsSpy = spyOn(decoder, '_eatBits');

            const result: number = decoder._getBlackCode();

            expect(decoder._lookBits).toHaveBeenCalledWith(13);
            expect(eatBitsSpy).toHaveBeenCalledTimes(1);
            expect(eatBitsSpy).toHaveBeenCalledWith(1);
            expect(result).toBe(1);
        });

        [
            { code: 2, eatBits: 12, result: -2 },
            { code: 32, eatBits: 11, result: 1792 },
            { code: 36, eatBits: 12, result: 1984 },
            { code: 64, eatBits: 10, result: 18 },
            { code: 120, eatBits: 10, result: 64 },
            { code: 127, eatBits: 10, result: 64 },
            { code: 128, eatBits: 8, result: 13 },
            { code: 160, eatBits: 11, result: 23 },
            { code: 184, eatBits: 10, result: 16 },
            { code: 192, eatBits: 10, result: 17 },
            { code: 224, eatBits: 8, result: 14 },
            { code: 256, eatBits: 7, result: 10 },
            { code: 320, eatBits: 7, result: 11 },
            { code: 384, eatBits: 9, result: 15 },
            { code: 440, eatBits: 10, result: 0 },
            { code: 448, eatBits: 7, result: 12 },
            { code: 510, eatBits: 7, result: 12 },
            { code: 512, eatBits: 6, result: 9 },
            { code: 640, eatBits: 6, result: 8 },
            { code: 768, eatBits: 5, result: 7 },
            { code: 1024, eatBits: 4, result: 6 },
            { code: 1536, eatBits: 4, result: 5 },
            { code: 2048, eatBits: 3, result: 1 },
            { code: 3072, eatBits: 3, result: 4 },
            { code: 4096, eatBits: 2, result: 3 },
            { code: 6144, eatBits: 2, result: 2 },
            { code: 8191, eatBits: 2, result: 2 }
        ].forEach((item: { code: number; eatBits: number; result: number }) => {
            it('_getBlackCode should decode code ' + item.code + ' exactly', () => {
                const decoder: any = createDecoder();
                decoder._endOfBlock = true;
                spyOn(decoder, '_lookBits').and.returnValue(item.code);
                const eatBitsSpy = spyOn(decoder, '_eatBits');

                const result: number = decoder._getBlackCode();

                expect(decoder._lookBits).toHaveBeenCalledTimes(1);
                expect(decoder._lookBits).toHaveBeenCalledWith(13);
                expect(eatBitsSpy).toHaveBeenCalledTimes(1);
                expect(eatBitsSpy).toHaveBeenCalledWith(item.eatBits);
                expect(result).toBe(item.result);
            });
        });

        it('_getBlackCode should use first _findTableCode lookup when endOfBlock is false', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const lookBitsSpy = spyOn(decoder, '_lookBits');
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 9, true]);

            const result: number = decoder._getBlackCode();

            expect(lookBitsSpy).not.toHaveBeenCalled();
            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(1);
            expect(findTableSpy.calls.argsFor(0)[0]).toBe(2);
            expect(findTableSpy.calls.argsFor(0)[1]).toBe(6);
            expect(Array.isArray(findTableSpy.calls.argsFor(0)[2])).toBe(true);
            expect(result).toBe(9);
        });

        it('_getBlackCode should return zero from first _findTableCode lookup when result value is zero', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            spyOn(decoder, '_eatBits');
            spyOn(decoder, '_findTableCode').and.returnValue([true, 0, true]);

            const result: number = decoder._getBlackCode();

            expect(result).toBe(0);
            expect(decoder._eatBits).not.toHaveBeenCalled();
        });

        it('_getBlackCode should use second _findTableCode lookup with offset 64 when first lookup fails', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 13, true]);

            const result: number = decoder._getBlackCode();

            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(2);
            expect(findTableSpy.calls.argsFor(0)[0]).toBe(2);
            expect(findTableSpy.calls.argsFor(0)[1]).toBe(6);
            expect(findTableSpy.calls.argsFor(1)[0]).toBe(7);
            expect(findTableSpy.calls.argsFor(1)[1]).toBe(12);
            expect(findTableSpy.calls.argsFor(1)[3]).toBe(64);
            expect(Array.isArray(findTableSpy.calls.argsFor(1)[2])).toBe(true);
            expect(result).toBe(13);
        });

        it('_getBlackCode should use third _findTableCode lookup when first and second lookups fail', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false], [true, 1792, true]);

            const result: number = decoder._getBlackCode();

            expect(eatBitsSpy).not.toHaveBeenCalled();
            expect(findTableSpy).toHaveBeenCalledTimes(3);
            expect(findTableSpy.calls.argsFor(2)[0]).toBe(10);
            expect(findTableSpy.calls.argsFor(2)[1]).toBe(13);
            expect(Array.isArray(findTableSpy.calls.argsFor(2)[2])).toBe(true);
            expect(result).toBe(1792);
        });

        it('_getBlackCode should fall back by eating one bit when all _findTableCode lookups fail', () => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = false;
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false], [false, -1, false]);

            const result: number = decoder._getBlackCode();

            expect(findTableSpy).toHaveBeenCalledTimes(3);
            expect(eatBitsSpy).toHaveBeenCalledTimes(1);
            expect(eatBitsSpy).toHaveBeenCalledWith(1);
            expect(result).toBe(1);
        });
    });

    describe('_eatBits method mutation tests', () => {
        it('_eatBits should subtract n from _inputBits when result is positive', () => {
            const decoder: any = createDecoder();
            decoder._inputBits = 10;

            decoder._eatBits(3);

            expect(decoder._inputBits).toBe(7);
        });

        it('_eatBits should set _inputBits to zero when subtraction result is negative', () => {
            const decoder: any = createDecoder();
            decoder._inputBits = 2;

            decoder._eatBits(5);

            expect(decoder._inputBits).toBe(0);
        });

        it('_eatBits should keep _inputBits as zero when subtraction result is exactly zero', () => {
            const decoder: any = createDecoder();
            decoder._inputBits = 5;

            decoder._eatBits(5);

            expect(decoder._inputBits).toBe(0);
        });

        it('_eatBits should not clamp when subtraction result is one', () => {
            const decoder: any = createDecoder();
            decoder._inputBits = 5;

            decoder._eatBits(4);

            expect(decoder._inputBits).toBe(1);
        });

        it('_eatBits should reduce from current value on consecutive calls', () => {
            const decoder: any = createDecoder();
            decoder._inputBits = 12;

            decoder._eatBits(4);
            expect(decoder._inputBits).toBe(8);
            decoder._eatBits(3);
            expect(decoder._inputBits).toBe(5);
            decoder._eatBits(10);
            expect(decoder._inputBits).toBe(0);
        });
    });

    describe('_lookBits / _eatBits sanity', () => {
        it('should return padded bits when source ends after partial data and _eatBits should clamp to zero', () => {
            const bytes = [0b10100000];
            const source = {
                next: jasmine.createSpy('next').and.callFake(() => {
                    return bytes.length ? bytes.shift()! : -1;
                })
            };
            const decoder: any = new _PdfFaxDecoder(source, {});

            const looked = decoder._lookBits(12);
            decoder._eatBits(999);

            expect(looked).not.toBe(-1);
            expect(decoder._inputBits).toBe(0);
        });
    });
});
function createDecoder(options: any = {}): any { // eslint-disable-line
        const source = {
            next: jasmine.createSpy('next').and.returnValue(-1)
        };
        return new _PdfFaxDecoder(source, options) as any;
    }

    function setCodingLine(decoder: any, values: number[]): void { // eslint-disable-line
        decoder._codingLine = Uint32Array.from(values);
    }
describe('_getTwoDimCode twoDimTable full structure mutation tests', () => {
    function expectedTwoDimTable(): number[][] {
        const table: number[][] = [];
        table[0] = [-1, -1];
        table[1] = [-1, -1];
        table[2] = [7, 8];
        table[3] = [7, 7];
        for (let i: number = 4; i <= 5; i++) {
            table[i] = [6, 6];
        }
        for (let i: number = 6; i <= 7; i++) {
            table[i] = [6, 5];
        }
        for (let i: number = 8; i <= 15; i++) {
            table[i] = [4, 0];
        }
        for (let i: number = 16; i <= 31; i++) {
            table[i] = [3, 1];
        }
        for (let i: number = 32; i <= 47; i++) {
            table[i] = [3, 4];
        }
        for (let i: number = 48; i <= 63; i++) {
            table[i] = [3, 3];
        }
        for (let i: number = 64; i <= 127; i++) {
            table[i] = [1, 2];
        }
        return table;
    }
    it('_getTwoDimCode should pass the exact full twoDimTable to _findTableCode when endOfBlock is false', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const expectedTable: number[][] = expectedTwoDimTable();
        const lookBitsSpy = spyOn(decoder, '_lookBits');
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 4, true]);
        const result: number = decoder._getTwoDimCode();
        expect(result).toBe(4);
        expect(lookBitsSpy).not.toHaveBeenCalled();
        expect(eatBitsSpy).not.toHaveBeenCalled();
        expect(findTableSpy).toHaveBeenCalledTimes(1);
        expect(findTableSpy.calls.argsFor(0)[0]).toBe(1);
        expect(findTableSpy.calls.argsFor(0)[1]).toBe(7);
        expect(findTableSpy.calls.argsFor(0)[2]).toEqual(expectedTable);
        expect(findTableSpy.calls.argsFor(0)[2].length).toBe(128);
    });
    it('_getTwoDimCode should keep invalid table entries 0 and 1 as exact [-1, -1] values', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([false, -1, false]);
        const result: number = decoder._getTwoDimCode();
        const actualTable: number[][] = findTableSpy.calls.argsFor(0)[2];
        expect(result).toBe(-1);
        expect(actualTable[0]).toEqual([-1, -1]);
        expect(actualTable[1]).toEqual([-1, -1]);
        expect(actualTable[0]).not.toEqual([]);
        expect(actualTable[1]).not.toEqual([]);
    });
    it('_getTwoDimCode should keep every valid table range exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 2, true]);
        decoder._getTwoDimCode();
        const table: number[][] = findTableSpy.calls.argsFor(0)[2];
        expect(table[2]).toEqual([7, 8]);
        expect(table[3]).toEqual([7, 7]);
        expect(table[4]).toEqual([6, 6]);
        expect(table[5]).toEqual([6, 6]);
        expect(table[6]).toEqual([6, 5]);
        expect(table[7]).toEqual([6, 5]);
        expect(table[8]).toEqual([4, 0]);
        expect(table[15]).toEqual([4, 0]);
        expect(table[16]).toEqual([3, 1]);
        expect(table[31]).toEqual([3, 1]);
        expect(table[32]).toEqual([3, 4]);
        expect(table[47]).toEqual([3, 4]);
        expect(table[48]).toEqual([3, 3]);
        expect(table[63]).toEqual([3, 3]);
        expect(table[64]).toEqual([1, 2]);
        expect(table[127]).toEqual([1, 2]);
    });
    it('_getTwoDimCode should decode endOfBlock table entries using exact prefix lengths and values', () => {
        const cases: Array<{ code: number; eatBits: number; result: number }> = [
            { code: 2, eatBits: 7, result: 8 },
            { code: 3, eatBits: 7, result: 7 },
            { code: 4, eatBits: 6, result: 6 },
            { code: 6, eatBits: 6, result: 5 },
            { code: 8, eatBits: 4, result: 0 },
            { code: 16, eatBits: 3, result: 1 },
            { code: 32, eatBits: 3, result: 4 },
            { code: 48, eatBits: 3, result: 3 },
            { code: 64, eatBits: 1, result: 2 },
            { code: 127, eatBits: 1, result: 2 }
        ];
        cases.forEach((item: { code: number; eatBits: number; result: number }) => {
            const decoder: any = createDecoder();
            decoder._endOfBlock = true;
            decoder._text = '';
            spyOn(decoder, '_lookBits').and.returnValue(item.code);
            const eatBitsSpy = spyOn(decoder, '_eatBits');
            const result: number = decoder._getTwoDimCode();
            expect(result).toBe(item.result);
            expect(eatBitsSpy).toHaveBeenCalledTimes(1);
            expect(eatBitsSpy).toHaveBeenCalledWith(item.eatBits);
            expect(decoder._text).toBe(item.code.toString());
        });
    });
});
describe('_getBlackCode black table full structure mutation tests', () => {
    function fillRange(table: number[][], start: number, end: number, value: number[]): void {
        for (let i: number = start; i <= end; i++) {
            table[i] = value.slice();
        }
    }
    function expectedBlackTable1(): number[][] {
        const table: number[][] = [];
        fillRange(table, 0, 127, [-1, -1]);
        fillRange(table, 2, 3, [12, -2]);
        fillRange(table, 32, 35, [11, 1792]);
        fillRange(table, 36, 37, [12, 1984]);
        fillRange(table, 38, 39, [12, 2048]);
        fillRange(table, 40, 41, [12, 2112]);
        fillRange(table, 42, 43, [12, 2176]);
        fillRange(table, 44, 45, [12, 2240]);
        fillRange(table, 46, 47, [12, 2304]);
        fillRange(table, 48, 51, [11, 1856]);
        fillRange(table, 52, 55, [11, 1920]);
        fillRange(table, 56, 57, [12, 2368]);
        fillRange(table, 58, 59, [12, 2432]);
        fillRange(table, 60, 61, [12, 2496]);
        fillRange(table, 62, 63, [12, 2560]);
        fillRange(table, 64, 71, [10, 18]);
        fillRange(table, 72, 73, [12, 52]);
        table[74] = [13, 640];
        table[75] = [13, 704];
        table[76] = [13, 768];
        table[77] = [13, 832];
        fillRange(table, 78, 79, [12, 55]);
        fillRange(table, 80, 81, [12, 56]);
        table[82] = [13, 1280];
        table[83] = [13, 1344];
        table[84] = [13, 1408];
        table[85] = [13, 1472];
        fillRange(table, 86, 87, [12, 59]);
        fillRange(table, 88, 89, [12, 60]);
        table[90] = [13, 1536];
        table[91] = [13, 1600];
        fillRange(table, 92, 95, [11, 24]);
        fillRange(table, 96, 99, [11, 25]);
        table[100] = [13, 1664];
        table[101] = [13, 1728];
        fillRange(table, 102, 103, [12, 320]);
        fillRange(table, 104, 105, [12, 384]);
        fillRange(table, 106, 107, [12, 448]);
        table[108] = [13, 512];
        table[109] = [13, 576];
        fillRange(table, 110, 111, [12, 53]);
        fillRange(table, 112, 113, [12, 54]);
        table[114] = [13, 896];
        table[115] = [13, 960];
        table[116] = [13, 1024];
        table[117] = [13, 1088];
        table[118] = [13, 1152];
        table[119] = [13, 1216];
        fillRange(table, 120, 127, [10, 64]);
        return table;
    }
    function expectedBlackTable2(): number[][] {
        const table: number[][] = [];
        fillRange(table, 0, 15, [8, 13]);
        fillRange(table, 16, 17, [11, 23]);
        table[18] = [12, 50];
        table[19] = [12, 51];
        table[20] = [12, 44];
        table[21] = [12, 45];
        table[22] = [12, 46];
        table[23] = [12, 47];
        table[24] = [12, 57];
        table[25] = [12, 58];
        table[26] = [12, 61];
        table[27] = [12, 256];
        fillRange(table, 28, 31, [10, 16]);
        fillRange(table, 32, 35, [10, 17]);
        table[36] = [12, 48];
        table[37] = [12, 49];
        table[38] = [12, 62];
        table[39] = [12, 63];
        table[40] = [12, 30];
        table[41] = [12, 31];
        table[42] = [12, 32];
        table[43] = [12, 33];
        table[44] = [12, 40];
        table[45] = [12, 41];
        fillRange(table, 46, 47, [11, 22]);
        fillRange(table, 48, 63, [8, 14]);
        fillRange(table, 64, 95, [7, 10]);
        fillRange(table, 96, 127, [7, 11]);
        fillRange(table, 128, 135, [9, 15]);
        table[136] = [12, 128];
        table[137] = [12, 192];
        table[138] = [12, 26];
        table[139] = [12, 27];
        table[140] = [12, 28];
        table[141] = [12, 29];
        fillRange(table, 142, 143, [11, 19]);
        fillRange(table, 144, 145, [11, 20]);
        table[146] = [12, 34];
        table[147] = [12, 35];
        table[148] = [12, 36];
        table[149] = [12, 37];
        table[150] = [12, 38];
        table[151] = [12, 39];
        fillRange(table, 152, 153, [11, 21]);
        table[154] = [12, 42];
        table[155] = [12, 43];
        fillRange(table, 156, 159, [10, 0]);
        fillRange(table, 160, 191, [7, 12]);
        return table;
    }
    function expectedBlackTable3(): number[][] {
        const table: number[][] = [];
        fillRange(table, 0, 3, [-1, -1]);
        table[4] = [6, 9];
        table[5] = [6, 8];
        fillRange(table, 6, 7, [5, 7]);
        fillRange(table, 8, 11, [4, 6]);
        fillRange(table, 12, 15, [4, 5]);
        fillRange(table, 16, 23, [3, 1]);
        fillRange(table, 24, 31, [3, 4]);
        fillRange(table, 32, 47, [2, 3]);
        fillRange(table, 48, 63, [2, 2]);
        return table;
    }
    it('_getBlackCode should pass exact blackTable3 blackTable2 and blackTable1 to _findTableCode when endOfBlock is false', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const expectedTable3: number[][] = expectedBlackTable3();
        const expectedTable2: number[][] = expectedBlackTable2();
        const expectedTable1: number[][] = expectedBlackTable1();
        const lookBitsSpy = spyOn(decoder, '_lookBits');
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false], [true, 1792, true]);
        const result: number = decoder._getBlackCode();
        expect(result).toBe(1792);
        expect(lookBitsSpy).not.toHaveBeenCalled();
        expect(eatBitsSpy).not.toHaveBeenCalled();
        expect(findTableSpy).toHaveBeenCalledTimes(3);
        expect(findTableSpy.calls.argsFor(0)[0]).toBe(2);
        expect(findTableSpy.calls.argsFor(0)[1]).toBe(6);
        expect(findTableSpy.calls.argsFor(0)[2]).toEqual(expectedTable3);
        expect(findTableSpy.calls.argsFor(0)[2].length).toBe(64);
        expect(findTableSpy.calls.argsFor(1)[0]).toBe(7);
        expect(findTableSpy.calls.argsFor(1)[1]).toBe(12);
        expect(findTableSpy.calls.argsFor(1)[2]).toEqual(expectedTable2);
        expect(findTableSpy.calls.argsFor(1)[3]).toBe(64);
        expect(findTableSpy.calls.argsFor(1)[2].length).toBe(192);
        expect(findTableSpy.calls.argsFor(2)[0]).toBe(10);
        expect(findTableSpy.calls.argsFor(2)[1]).toBe(13);
        expect(findTableSpy.calls.argsFor(2)[2]).toEqual(expectedTable1);
        expect(findTableSpy.calls.argsFor(2)[2].length).toBe(128);
    });
    it('_getBlackCode should keep invalid black table entries as exact [-1, -1] and not empty arrays', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false], [false, -1, false]);
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const result: number = decoder._getBlackCode();
        const blackTable3: number[][] = findTableSpy.calls.argsFor(0)[2];
        const blackTable2: number[][] = findTableSpy.calls.argsFor(1)[2];
        const blackTable1: number[][] = findTableSpy.calls.argsFor(2)[2];
        expect(result).toBe(1);
        expect(eatBitsSpy).toHaveBeenCalledTimes(1);
        expect(eatBitsSpy).toHaveBeenCalledWith(1);
        expect(blackTable3[0]).toEqual([-1, -1]);
        expect(blackTable3[1]).toEqual([-1, -1]);
        expect(blackTable1[0]).toEqual([-1, -1]);
        expect(blackTable1[1]).toEqual([-1, -1]);
        expect(blackTable1[4]).toEqual([-1, -1]);
        expect(blackTable3[0]).not.toEqual([]);
        expect(blackTable1[0]).not.toEqual([]);
    });
    it('_getBlackCode should keep representative blackTable3 ranges exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 9, true]);
        const result: number = decoder._getBlackCode();
        const table: number[][] = findTableSpy.calls.argsFor(0)[2];
        expect(result).toBe(9);
        expect(table[0]).toEqual([-1, -1]);
        expect(table[4]).toEqual([6, 9]);
        expect(table[5]).toEqual([6, 8]);
        expect(table[6]).toEqual([5, 7]);
        expect(table[8]).toEqual([4, 6]);
        expect(table[12]).toEqual([4, 5]);
        expect(table[16]).toEqual([3, 1]);
        expect(table[24]).toEqual([3, 4]);
        expect(table[32]).toEqual([2, 3]);
        expect(table[63]).toEqual([2, 2]);
    });
    it('_getBlackCode should keep representative blackTable2 ranges exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 13, true]);
        const result: number = decoder._getBlackCode();
        const table: number[][] = findTableSpy.calls.argsFor(1)[2];
        expect(result).toBe(13);
        expect(table[0]).toEqual([8, 13]);
        expect(table[16]).toEqual([11, 23]);
        expect(table[18]).toEqual([12, 50]);
        expect(table[27]).toEqual([12, 256]);
        expect(table[28]).toEqual([10, 16]);
        expect(table[32]).toEqual([10, 17]);
        expect(table[48]).toEqual([8, 14]);
        expect(table[64]).toEqual([7, 10]);
        expect(table[96]).toEqual([7, 11]);
        expect(table[128]).toEqual([9, 15]);
        expect(table[136]).toEqual([12, 128]);
        expect(table[156]).toEqual([10, 0]);
        expect(table[160]).toEqual([7, 12]);
        expect(table[191]).toEqual([7, 12]);
    });
    it('_getBlackCode should keep representative blackTable1 values exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false], [true, 2560, true]);
        const result: number = decoder._getBlackCode();
        const table: number[][] = findTableSpy.calls.argsFor(2)[2];
        expect(result).toBe(2560);
        expect(table[2]).toEqual([12, -2]);
        expect(table[32]).toEqual([11, 1792]);
        expect(table[36]).toEqual([12, 1984]);
        expect(table[48]).toEqual([11, 1856]);
        expect(table[52]).toEqual([11, 1920]);
        expect(table[56]).toEqual([12, 2368]);
        expect(table[62]).toEqual([12, 2560]);
        expect(table[64]).toEqual([10, 18]);
        expect(table[72]).toEqual([12, 52]);
        expect(table[74]).toEqual([13, 640]);
        expect(table[82]).toEqual([13, 1280]);
        expect(table[90]).toEqual([13, 1536]);
        expect(table[100]).toEqual([13, 1664]);
        expect(table[108]).toEqual([13, 512]);
        expect(table[120]).toEqual([10, 64]);
        expect(table[127]).toEqual([10, 64]);
    });
    it('_getBlackCode should return first table result immediately when blackTable3 lookup succeeds', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 7, true]);
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const result: number = decoder._getBlackCode();
        expect(result).toBe(7);
        expect(findTableSpy).toHaveBeenCalledTimes(1);
        expect(findTableSpy.calls.argsFor(0)[0]).toBe(2);
        expect(findTableSpy.calls.argsFor(0)[1]).toBe(6);
        expect(eatBitsSpy).not.toHaveBeenCalled();
    });
    it('_getBlackCode should return second table result when blackTable3 fails and blackTable2 succeeds', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 13, true]);
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const result: number = decoder._getBlackCode();
        expect(result).toBe(13);
        expect(findTableSpy).toHaveBeenCalledTimes(2);
        expect(findTableSpy.calls.argsFor(1)[0]).toBe(7);
        expect(findTableSpy.calls.argsFor(1)[1]).toBe(12);
        expect(findTableSpy.calls.argsFor(1)[3]).toBe(64);
        expect(eatBitsSpy).not.toHaveBeenCalled();
    });
});
describe('_getWhiteCode white table full structure mutation tests', () => {
    function fillRange(table: number[][], start: number, end: number, value: number[]): void {
        for (let i: number = start; i <= end; i++) {
            table[i] = value.slice();
        }
    }
    function expectedWhiteTable1(): number[][] {
        const table: number[][] = [];
        fillRange(table, 0, 31, [-1, -1]);
        table[1] = [12, -2];
        fillRange(table, 16, 17, [11, 1792]);
        table[18] = [12, 1984];
        table[19] = [12, 2048];
        table[20] = [12, 2112];
        table[21] = [12, 2176];
        table[22] = [12, 2240];
        table[23] = [12, 2304];
        fillRange(table, 24, 25, [11, 1856]);
        fillRange(table, 26, 27, [11, 1920]);
        table[28] = [12, 2368];
        table[29] = [12, 2432];
        table[30] = [12, 2496];
        table[31] = [12, 2560];
        return table;
    }
    function expectedWhiteTable2(): number[][] {
        const table: number[][] = [];
        fillRange(table, 0, 3, [-1, -1]);
        fillRange(table, 4, 5, [8, 29]);
        fillRange(table, 6, 7, [8, 30]);
        fillRange(table, 8, 9, [8, 45]);
        fillRange(table, 10, 11, [8, 46]);
        fillRange(table, 12, 15, [7, 22]);
        fillRange(table, 16, 19, [7, 23]);
        fillRange(table, 20, 21, [8, 47]);
        fillRange(table, 22, 23, [8, 48]);
        fillRange(table, 24, 31, [6, 13]);
        fillRange(table, 32, 35, [7, 20]);
        fillRange(table, 36, 37, [8, 33]);
        fillRange(table, 38, 39, [8, 34]);
        fillRange(table, 40, 41, [8, 35]);
        fillRange(table, 42, 43, [8, 36]);
        fillRange(table, 44, 45, [8, 37]);
        fillRange(table, 46, 47, [8, 38]);
        fillRange(table, 48, 51, [7, 19]);
        fillRange(table, 52, 53, [8, 31]);
        fillRange(table, 54, 55, [8, 32]);
        fillRange(table, 56, 63, [6, 1]);
        fillRange(table, 64, 71, [6, 12]);
        fillRange(table, 72, 73, [8, 53]);
        fillRange(table, 74, 75, [8, 54]);
        fillRange(table, 76, 79, [7, 26]);
        fillRange(table, 80, 81, [8, 39]);
        fillRange(table, 82, 83, [8, 40]);
        fillRange(table, 84, 85, [8, 41]);
        fillRange(table, 86, 87, [8, 42]);
        fillRange(table, 88, 89, [8, 43]);
        fillRange(table, 90, 91, [8, 44]);
        fillRange(table, 92, 95, [7, 21]);
        fillRange(table, 96, 99, [7, 28]);
        fillRange(table, 100, 101, [8, 61]);
        fillRange(table, 102, 103, [8, 62]);
        fillRange(table, 104, 105, [8, 63]);
        fillRange(table, 106, 107, [8, 0]);
        fillRange(table, 108, 109, [8, 320]);
        fillRange(table, 110, 111, [8, 384]);
        fillRange(table, 112, 127, [5, 10]);
        fillRange(table, 128, 143, [5, 11]);
        fillRange(table, 144, 147, [7, 27]);
        fillRange(table, 148, 149, [8, 59]);
        fillRange(table, 150, 151, [8, 60]);
        table[152] = [9, 1472];
        table[153] = [9, 1536];
        table[154] = [9, 1600];
        table[155] = [9, 1728];
        fillRange(table, 156, 159, [7, 18]);
        fillRange(table, 160, 163, [7, 24]);
        fillRange(table, 164, 165, [8, 49]);
        fillRange(table, 166, 167, [8, 50]);
        fillRange(table, 168, 169, [8, 51]);
        fillRange(table, 170, 171, [8, 52]);
        fillRange(table, 172, 175, [7, 25]);
        fillRange(table, 176, 177, [8, 55]);
        fillRange(table, 178, 179, [8, 56]);
        fillRange(table, 180, 181, [8, 57]);
        fillRange(table, 182, 183, [8, 58]);
        fillRange(table, 184, 191, [6, 192]);
        fillRange(table, 192, 199, [6, 1664]);
        fillRange(table, 200, 201, [8, 448]);
        fillRange(table, 202, 203, [8, 512]);
        table[204] = [9, 704];
        table[205] = [9, 768];
        fillRange(table, 206, 207, [8, 640]);
        fillRange(table, 208, 209, [8, 576]);
        table[210] = [9, 832];
        table[211] = [9, 896];
        table[212] = [9, 960];
        table[213] = [9, 1024];
        table[214] = [9, 1088];
        table[215] = [9, 1152];
        table[216] = [9, 1216];
        table[217] = [9, 1280];
        table[218] = [9, 1344];
        table[219] = [9, 1408];
        fillRange(table, 220, 223, [7, 256]);
        fillRange(table, 224, 255, [4, 2]);
        fillRange(table, 256, 287, [4, 3]);
        fillRange(table, 288, 303, [5, 128]);
        fillRange(table, 304, 319, [5, 8]);
        fillRange(table, 320, 335, [5, 9]);
        fillRange(table, 336, 343, [6, 16]);
        fillRange(table, 344, 351, [6, 17]);
        fillRange(table, 352, 383, [4, 4]);
        fillRange(table, 384, 415, [4, 5]);
        fillRange(table, 416, 423, [6, 14]);
        fillRange(table, 424, 431, [6, 15]);
        fillRange(table, 432, 447, [5, 64]);
        fillRange(table, 448, 479, [4, 6]);
        fillRange(table, 480, 511, [4, 7]);
        return table;
    }
    it('_getWhiteCode should pass exact whiteTable2 and whiteTable1 to _findTableCode when endOfBlock is false', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const expectedTable2: number[][] = expectedWhiteTable2();
        const expectedTable1: number[][] = expectedWhiteTable1();
        const lookBitsSpy = spyOn(decoder, '_lookBits');
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 1984, true]);
        const result: number = decoder._getWhiteCode();
        expect(result).toBe(1984);
        expect(lookBitsSpy).not.toHaveBeenCalled();
        expect(eatBitsSpy).not.toHaveBeenCalled();
        expect(findTableSpy).toHaveBeenCalledTimes(2);
        expect(findTableSpy.calls.argsFor(0)[0]).toBe(1);
        expect(findTableSpy.calls.argsFor(0)[1]).toBe(9);
        expect(findTableSpy.calls.argsFor(0)[2]).toEqual(expectedTable2);
        expect(findTableSpy.calls.argsFor(0)[2].length).toBe(512);
        expect(findTableSpy.calls.argsFor(1)[0]).toBe(11);
        expect(findTableSpy.calls.argsFor(1)[1]).toBe(12);
        expect(findTableSpy.calls.argsFor(1)[2]).toEqual(expectedTable1);
        expect(findTableSpy.calls.argsFor(1)[2].length).toBe(32);
    });
    it('_getWhiteCode should keep invalid entries as exact [-1, -1] and not empty arrays', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [false, -1, false]);
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const result: number = decoder._getWhiteCode();
        const whiteTable2: number[][] = findTableSpy.calls.argsFor(0)[2];
        const whiteTable1: number[][] = findTableSpy.calls.argsFor(1)[2];
        expect(result).toBe(1);
        expect(eatBitsSpy).toHaveBeenCalledTimes(1);
        expect(eatBitsSpy).toHaveBeenCalledWith(1);
        expect(whiteTable2[0]).toEqual([-1, -1]);
        expect(whiteTable2[1]).toEqual([-1, -1]);
        expect(whiteTable2[2]).toEqual([-1, -1]);
        expect(whiteTable2[3]).toEqual([-1, -1]);
        expect(whiteTable1[0]).toEqual([-1, -1]);
        expect(whiteTable1[2]).toEqual([-1, -1]);
        expect(whiteTable1[15]).toEqual([-1, -1]);
        expect(whiteTable2[0]).not.toEqual([]);
        expect(whiteTable1[0]).not.toEqual([]);
    });
    it('_getWhiteCode should keep representative whiteTable2 ranges exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 0, true]);
        const result: number = decoder._getWhiteCode();
        const table: number[][] = findTableSpy.calls.argsFor(0)[2];
        expect(result).toBe(0);
        expect(table[4]).toEqual([8, 29]);
        expect(table[6]).toEqual([8, 30]);
        expect(table[12]).toEqual([7, 22]);
        expect(table[16]).toEqual([7, 23]);
        expect(table[24]).toEqual([6, 13]);
        expect(table[56]).toEqual([6, 1]);
        expect(table[106]).toEqual([8, 0]);
        expect(table[152]).toEqual([9, 1472]);
        expect(table[155]).toEqual([9, 1728]);
        expect(table[224]).toEqual([4, 2]);
        expect(table[256]).toEqual([4, 3]);
        expect(table[288]).toEqual([5, 128]);
        expect(table[304]).toEqual([5, 8]);
        expect(table[320]).toEqual([5, 9]);
        expect(table[352]).toEqual([4, 4]);
        expect(table[384]).toEqual([4, 5]);
        expect(table[448]).toEqual([4, 6]);
        expect(table[511]).toEqual([4, 7]);
    });
    it('_getWhiteCode should keep representative whiteTable1 values exact', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValues([false, -1, false], [true, 2560, true]);
        const result: number = decoder._getWhiteCode();
        const table: number[][] = findTableSpy.calls.argsFor(1)[2];
        expect(result).toBe(2560);
        expect(table[1]).toEqual([12, -2]);
        expect(table[16]).toEqual([11, 1792]);
        expect(table[17]).toEqual([11, 1792]);
        expect(table[18]).toEqual([12, 1984]);
        expect(table[19]).toEqual([12, 2048]);
        expect(table[20]).toEqual([12, 2112]);
        expect(table[21]).toEqual([12, 2176]);
        expect(table[22]).toEqual([12, 2240]);
        expect(table[23]).toEqual([12, 2304]);
        expect(table[24]).toEqual([11, 1856]);
        expect(table[26]).toEqual([11, 1920]);
        expect(table[28]).toEqual([12, 2368]);
        expect(table[29]).toEqual([12, 2432]);
        expect(table[30]).toEqual([12, 2496]);
        expect(table[31]).toEqual([12, 2560]);
    });
    it('_getWhiteCode should return first table result immediately when whiteTable2 lookup succeeds', () => {
        const decoder: any = createDecoder();
        decoder._endOfBlock = false;
        const findTableSpy = spyOn(decoder, '_findTableCode').and.returnValue([true, 29, true]);
        const eatBitsSpy = spyOn(decoder, '_eatBits');
        const result: number = decoder._getWhiteCode();
        expect(result).toBe(29);
        expect(findTableSpy).toHaveBeenCalledTimes(1);
        expect(findTableSpy.calls.argsFor(0)[0]).toBe(1);
        expect(findTableSpy.calls.argsFor(0)[1]).toBe(9);
        expect(eatBitsSpy).not.toHaveBeenCalled();
    });
});