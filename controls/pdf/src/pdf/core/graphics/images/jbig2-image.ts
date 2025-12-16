import { _PdfArithmeticDecoder } from '../../compression/arithmaric-decoder';
import { _readInteger8, _readUnsignedInteger16, _readUnsignedInteger32, _log2, _defineLazyProperty } from '../../utils';
import { _PdfFaxDecoder } from './pdf-fax-decoder';
export class _PdfBitReader {
    private prev: number = 1;
    _readBits(length: number, decoder: any, contexts: any): number { //eslint-disable-line
        let v: number = 0;
        for (let i: number = 0; i < length; i++) {
            const bit: number = decoder._readBit(contexts, this.prev);
            this.prev = this.prev < 256 ? (this.prev << 1) | bit : (((this.prev << 1) | bit) & 511) | 256;
            v = (v << 1) | bit;
        }
        return v >>> 0;
    }
}
export class _PdfContextCache {
    private cache: { [key: string]: Int8Array } = {};
    getContexts(id: string | number): Int8Array {
        const key: string = id.toString();
        if (!(key in this.cache)) {
            this.cache[key] = new Int8Array(1 << 16); //eslint-disable-line
        }
        return this.cache[key]; //eslint-disable-line
    }
}
export class _PdfDecodingContext {
    _data: Uint8Array;
    _start: number;
    _end: number;
    constructor(data: Uint8Array, start: number, end: number) {
        this._data = data;
        this._start = start;
        this._end = end;
    }
    get decoder(): any { //eslint-disable-line
        const decoder: _PdfArithmeticDecoder = new _PdfArithmeticDecoder(this._data, this._start, this._end);
        return _defineLazyProperty(this, 'decoder', decoder);
    }
    get contextCache(): any { //eslint-disable-line
        const cache: _PdfContextCache = new _PdfContextCache();
        return _defineLazyProperty(this, 'contextCache', cache);
    }
}
export class _PdfSimpleSegmentVisitor {
    _currentPageInfo: any; //eslint-disable-line
    _buffer: Uint8ClampedArray;
    _customTables: any; //eslint-disable-line
    _symbols: any; //eslint-disable-line
    _patterns: any; //eslint-disable-line
    _standardTablesCache: { [key: number]: _PdfHuffmanTable } = {};
    _codingTemplates: { x: number; y: number }[][] = [
        [
            { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 }, { x: -2, y: -1 }, { x: -1, y: -1 }, { x: 0, y: -1 },
            { x: 1, y: -1 }, { x: 2, y: -1 }, { x: -4, y: 0 }, { x: -3, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 0 }
        ],
        [
            { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 }, { x: 2, y: -2 }, { x: -2, y: -1 }, { x: -1, y: -1 },
            { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 }, { x: -3, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 0 }
        ],
        [
            { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 }, { x: -2, y: -1 }, { x: -1, y: -1 },
            { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -2, y: 0 }, { x: -1, y: 0 }],
        [
            { x: -3, y: -1 }, { x: -2, y: -1 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -4, y: 0 }, { x: -3, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 0 }
        ]];
    _refinementTemplates: {coding: { x: number; y: number }[], reference: { x: number; y: number }[]}[] = [
        {
            coding: [
                { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }],
            reference: [
                { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
                { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
        },
        {
            coding: [
                { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }],
            reference: [
                { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
        }];
    _reusedContexts: number[] = [0x9b25, 0x0795, 0x00e5, 0x0195];
    _refinementReusedContexts: number[] = [0x0020, 0x0008];
    _onPageInformation(info: any): void { //eslint-disable-line
        this._currentPageInfo = info;
        const rowSize: number = (info[0].width + 7) >> 3;
        const buffer: Uint8ClampedArray = new Uint8ClampedArray(rowSize * info[0].height);
        if (info.defaultPixelValue) {
            buffer.fill(0xff);
        }
        this._buffer = buffer;
    }
    _drawBitmap(regionInfo: any, bitmap: any): void { //eslint-disable-line
        const pageInfo: any = this._currentPageInfo; //eslint-disable-line
        const width: number = regionInfo.width;
        const height: number = regionInfo.height;
        const rowSize: number = (pageInfo[0].width + 7) >> 3;
        const combinationOperator: any = pageInfo[0].combinationOperatorOverride //eslint-disable-line
            ? regionInfo.combinationOperator
            : pageInfo[0].combinationOperator;
        const buffer: any = this._buffer; //eslint-disable-line
        const mask0: number = 128 >> (regionInfo.x & 7);
        let offset0: number = regionInfo.y * rowSize + (regionInfo.x >> 3);
        let i: number;
        let j: number;
        let mask: number;
        let offset: number;
        switch (combinationOperator) {
        case 0:
            for (i = 0; i < height; i++) {
                mask = mask0;
                offset = offset0;
                for (j = 0; j < width; j++) {
                    if (bitmap[<number>i][<number>j]) {
                        buffer[<number>offset] |= mask;
                    }
                    mask >>= 1;
                    if (!mask) {
                        mask = 128;
                        offset++;
                    }
                }
                offset0 += rowSize;
            }
            break;
        case 2:
            for (i = 0; i < height; i++) {
                mask = mask0;
                offset = offset0;
                for (j = 0; j < width; j++) {
                    if (bitmap[<number>i][<number>j]) {
                        buffer[<number>offset] ^= mask;
                    }
                    mask >>= 1;
                    if (!mask) {
                        mask = 128;
                        offset++;
                    }
                }
                offset0 += rowSize;
            }
            break;
        default:
            throw new Error(`The combination operator ${combinationOperator} is not supported`);
        }
    }
    _onImmediateGenericRegion(region: any, data: Uint8Array, start: number, end: number): void { //eslint-disable-line
        const regionInfo: any = region.info; //eslint-disable-line
        const decodingContext: _PdfDecodingContext = new _PdfDecodingContext(data, start, end);
        const bitmap: any = this._decodeBitmap(region.mmr, regionInfo.width, regionInfo.height, region.template, //eslint-disable-line
                                               region.prediction, null, region.at, decodingContext);
        this._drawBitmap(regionInfo, bitmap);
    }
    _getCustomHuffmanTable(index: number, referredTo: number[], customTables: any): any { //eslint-disable-line
        let currentIndex: number = 0;
        for (let i: number = 0, ii: number = referredTo.length; i < ii; i++) {
            const table: any = customTables[referredTo[i]]; //eslint-disable-line
            if (table) {
                if (index === currentIndex) {
                    return table;
                }
                currentIndex++;
            }
        }
        throw new Error("Custom Huffman table not found in the input data."); //eslint-disable-line
    }
    _getTextRegionHuffmanTables(
        textRegion: any, //eslint-disable-line
        referredTo: any, //eslint-disable-line
        customTables: any, //eslint-disable-line
        numberOfSymbols: number,
        reader: _PdfReader
    ): any { //eslint-disable-line
        const codes: any[] = []; //eslint-disable-line
        for (let i: number = 0; i <= 34; i++) {
            const codeLength: number = reader._readBits(4);
            codes.push(new _PdfHuffmanLine([i, codeLength, 0, 0]));
        }
        const runCodesTable: _PdfHuffmanTable = new _PdfHuffmanTable(codes, false);
        codes.length = 0;
        for (let i: number = 0; i < numberOfSymbols;) {
            const codeLength: number = runCodesTable.decode(reader);
            if (codeLength >= 32) {
                let repeatedLength: number;
                let numberOfRepeats: number;
                let j: number;
                switch (codeLength) {
                case 32:
                    if (i === 0) {
                        throw new Error('No previous value found in the symbol ID table');
                    }
                    numberOfRepeats = reader._readBits(2) + 3;
                    repeatedLength = codes[i - 1].prefixLength;
                    break;
                case 33:
                    numberOfRepeats = reader._readBits(3) + 3;
                    repeatedLength = 0;
                    break;
                case 34:
                    numberOfRepeats = reader._readBits(7) + 11;
                    repeatedLength = 0;
                    break;
                default:
                    throw new Error('JBIG2 decoding error: Invalid code length found in the symbol ID table');
                }
                for (j = 0; j < numberOfRepeats; j++) {
                    codes.push(new _PdfHuffmanLine([i, repeatedLength, 0, 0]));
                    i++;
                }
            } else {
                codes.push(new _PdfHuffmanLine([i, codeLength, 0, 0]));
                i++;
            }
        }
        reader.byteAlign();
        const symbolIDTable: _PdfHuffmanTable = new _PdfHuffmanTable(codes, false);
        let customIndex: number = 0;
        let tableFirstS: any; //eslint-disable-line
        let tableDeltaS: any; //eslint-disable-line
        let tableDeltaT: any; //eslint-disable-line
        switch (textRegion.huffmanFS) {
        case 0:
        case 1:
            tableFirstS = this._getStandardTable(textRegion.huffmanFS + 6);
            break;
        case 3:
            tableFirstS = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
            break;
        default:
            throw new Error('Invalid Huffman File Segment Selector: Selector does not match any recognized Huffman-coded segment.');
        }
        switch (textRegion.huffmanDS) {
        case 0:
        case 1:
        case 2:
            tableDeltaS = this._getStandardTable(textRegion.huffmanDS + 8);
            break;
        case 3:
            tableDeltaS = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
            break;
        default:
            throw new Error('Jbig2 decode error: Detected invalid Huffman Data Stream selector.');
        }
        switch (textRegion.huffmanDT) {
        case 0:
        case 1:
        case 2:
            tableDeltaT = this._getStandardTable(textRegion.huffmanDT + 11);
            break;
        case 3:
            tableDeltaT = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
            break;
        default:
            throw new Error('Invalid Huffman Decoding Table (DT) selector encountered.');
        }
        if (textRegion.refinement) {
            throw new Error('Refinement with Huffman encoding is not supported.');
        }
        return {
            symbolIDTable,
            tableFirstS,
            tableDeltaS,
            tableDeltaT
        };
    }
    _getStandardTable(number: number): _PdfHuffmanTable {
        let table: _PdfHuffmanTable | undefined = this._standardTablesCache[<number>number];
        if (table) {
            return table;
        }
        let lines: any; // eslint-disable-line
        switch (number) {
        case 1:
            lines = [[0, 1, 4, 0x0], [16, 2, 8, 0x2], [272, 3, 16, 0x6], [65808, 3, 32, 0x7]];
            break;
        case 2:
            lines = [[0, 1, 0, 0x0], [1, 2, 0, 0x2], [2, 3, 0, 0x6], [3, 4, 3, 0xe],
                [11, 5, 6, 0x1e], [75, 6, 32, 0x3e], [6, 0x3f]];
            break;
        case 3:
            lines = [[-256, 8, 8, 0xfe], [0, 1, 0, 0x0], [1, 2, 0, 0x2], [2, 3, 0, 0x6],
                [3, 4, 3, 0xe], [11, 5, 6, 0x1e], [-257, 8, 32, 0xff, 'lower'],
                [75, 7, 32, 0x7e], [6, 0x3e]];
            break;
        case 4:
            lines = [[1, 1, 0, 0x0], [2, 2, 0, 0x2], [3, 3, 0, 0x6], [4, 4, 3, 0xe],
                [12, 5, 6, 0x1e], [76, 5, 32, 0x1f]];
            break;
        case 5:
            lines = [[-255, 7, 8, 0x7e], [1, 1, 0, 0x0], [2, 2, 0, 0x2],
                [3, 3, 0, 0x6], [4, 4, 3, 0xe], [12, 5, 6, 0x1e],
                [-256, 7, 32, 0x7f, 'lower'], [76, 6, 32, 0x3e]];
            break;
        case 6:
            lines = [[-2048, 5, 10, 0x1c], [-1024, 4, 9, 0x8], [-512, 4, 8, 0x9],
                [-256, 4, 7, 0xa], [-128, 5, 6, 0x1d], [-64, 5, 5, 0x1e],
                [-32, 4, 5, 0xb], [0, 2, 7, 0x0], [128, 3, 7, 0x2],
                [256, 3, 8, 0x3], [512, 4, 9, 0xc], [1024, 4, 10, 0xd],
                [-2049, 6, 32, 0x3e, 'lower'], [2048, 6, 32, 0x3f]];
            break;
        case 7:
            lines = [[-1024, 4, 9, 0x8], [-512, 3, 8, 0x0], [-256, 4, 7, 0x9],
                [-128, 5, 6, 0x1a], [-64, 5, 5, 0x1b], [-32, 4, 5, 0xa],
                [0, 4, 5, 0xb], [32, 5, 5, 0x1c], [64, 5, 6, 0x1d],
                [128, 4, 7, 0xc], [256, 3, 8, 0x1], [512, 3, 9, 0x2],
                [1024, 3, 10, 0x3], [-1025, 5, 32, 0x1e, 'lower'],
                [2048, 5, 32, 0x1f]];
            break;
        case 8:
            lines = [[-15, 8, 3, 0xfc], [-7, 9, 1, 0x1fc], [-5, 8, 1, 0xfd],
                [-3, 9, 0, 0x1fd], [-2, 7, 0, 0x7c], [-1, 4, 0, 0xa],
                [0, 2, 1, 0x0], [2, 5, 0, 0x1a], [3, 6, 0, 0x3a],
                [4, 3, 4, 0x4], [20, 6, 1, 0x3b], [22, 4, 4, 0xb],
                [38, 4, 5, 0xc], [70, 5, 6, 0x1b], [134, 5, 7, 0x1c],
                [262, 6, 7, 0x3c], [390, 7, 8, 0x7d], [646, 6, 10, 0x3d],
                [-16, 9, 32, 0x1fe, 'lower'], [1670, 9, 32, 0x1ff]];
            break;
        case 9:
            lines = [[-31, 8, 4, 0xfc], [-15, 9, 2, 0x1fc], [-11, 8, 2, 0xfd],
                [-7, 9, 1, 0x1fd], [-5, 7, 1, 0x7c], [-3, 4, 1, 0xa],
                [-1, 3, 1, 0x2], [1, 3, 1, 0x3], [3, 5, 1, 0x1a],
                [5, 6, 1, 0x3a], [7, 3, 5, 0x4], [39, 6, 2, 0x3b],
                [43, 4, 5, 0xb], [75, 4, 6, 0xc], [139, 5, 7, 0x1b],
                [267, 5, 8, 0x1c], [523, 6, 8, 0x3c], [779, 7, 9, 0x7d],
                [1291, 6, 11, 0x3d], [-32, 9, 32, 0x1fe, 'lower'],
                [3339, 9, 32, 0x1ff]];
            break;
        case 10:
            lines = [[-21, 7, 4, 0x7a], [-5, 8, 0, 0xfc], [-4, 7, 0, 0x7b],
                [-3, 5, 0, 0x18], [-2, 2, 2, 0x0], [2, 5, 0, 0x19],
                [3, 6, 0, 0x36], [4, 7, 0, 0x7c], [5, 8, 0, 0xfd],
                [6, 2, 6, 0x1], [70, 5, 5, 0x1a], [102, 6, 5, 0x37],
                [134, 6, 6, 0x38], [198, 6, 7, 0x39], [326, 6, 8, 0x3a],
                [582, 6, 9, 0x3b], [1094, 6, 10, 0x3c], [2118, 7, 11, 0x7d],
                [-22, 8, 32, 0xfe, 'lower'], [4166, 8, 32, 0xff]];
            break;
        case 11:
            lines = [[1, 1, 0, 0x0], [2, 2, 1, 0x2], [4, 4, 0, 0xc],
                [5, 4, 1, 0xd], [7, 5, 1, 0x1c], [9, 5, 2, 0x1d],
                [13, 6, 2, 0x3c], [17, 7, 2, 0x7a], [21, 7, 3, 0x7b],
                [29, 7, 4, 0x7c], [45, 7, 5, 0x7d], [77, 7, 6, 0x7e],
                [141, 7, 32, 0x7f]];
            break;
        case 12:
            lines = [[1, 1, 0, 0x0], [2, 2, 0, 0x2], [3, 3, 1, 0x6],
                [5, 5, 0, 0x1c], [6, 5, 1, 0x1d], [8, 6, 1, 0x3c],
                [10, 7, 0, 0x7a], [11, 7, 1, 0x7b], [13, 7, 2, 0x7c],
                [17, 7, 3, 0x7d], [25, 7, 4, 0x7e], [41, 8, 5, 0xfe],
                [73, 8, 32, 0xff]];
            break;
        case 13:
            lines = [[1, 1, 0, 0x0], [2, 3, 0, 0x4], [3, 4, 0, 0xc],
                [4, 5, 0, 0x1c], [5, 4, 1, 0xd], [7, 3, 3, 0x5],
                [15, 6, 1, 0x3a], [17, 6, 2, 0x3b], [21, 6, 3, 0x3c],
                [29, 6, 4, 0x3d], [45, 6, 5, 0x3e], [77, 7, 6, 0x7e],
                [141, 7, 32, 0x7f]];
            break;
        case 14:
            lines = [[-2, 3, 0, 0x4], [-1, 3, 0, 0x5], [0, 1, 0, 0x0],
                [1, 3, 0, 0x6], [2, 3, 0, 0x7]];
            break;
        case 15:
            lines = [[-24, 7, 4, 0x7c], [-8, 6, 2, 0x3c], [-4, 5, 1, 0x1c],
                [-2, 4, 0, 0xc], [-1, 3, 0, 0x4], [0, 1, 0, 0x0],
                [1, 3, 0, 0x5], [2, 4, 0, 0xd], [3, 5, 1, 0x1d],
                [5, 6, 2, 0x3d], [9, 7, 4, 0x7d], [-25, 7, 32, 0x7e, 'lower'],
                [25, 7, 32, 0x7f]];
            break;
        default:
            throw new Error(`Standard table B.${number} does not exist`);
        }
        for (let i: number = 0, ii: number = lines.length; i < ii; i++) {
            lines[<number>i] = new _PdfHuffmanLine(lines[<number>i]);
        }
        table = new _PdfHuffmanTable(lines, true);
        this._standardTablesCache[<number>number] = table;
        return table;
    }
    _getSymbolDictionaryHuffmanTables(
        dictionary: {
            huffmanDHSelector: number;
            huffmanDWSelector: number;
            bitmapSizeSelector: boolean;
            aggregationInstancesSelector: boolean;
        },
        referredTo: any, // eslint-disable-line
        customTables: any // eslint-disable-line
    ): {
            tableDeltaHeight: number;
            tableDeltaWidth: number;
            tableBitmapSize: number;
            tableAggregateInstances: any; //eslint-disable-line
        } {
        let customIndex: number = 0;
        let tableDeltaHeight: any; // eslint-disable-line
        let tableDeltaWidth: any; // eslint-disable-line
        switch (dictionary.huffmanDHSelector) {
        case 0:
        case 1:
            tableDeltaHeight = this._getStandardTable(dictionary.huffmanDHSelector + 4);
            break;
        case 3:
            tableDeltaHeight = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
            break;
        default:
            throw new Error('Invalid Huffman DH selector: the provided selector value is not recognized or supported.');
        }
        switch (dictionary.huffmanDWSelector) {
        case 0:
        case 1:
            tableDeltaWidth = this._getStandardTable(dictionary.huffmanDWSelector + 2);
            break;
        case 3:
            tableDeltaWidth = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
            break;
        default:
            throw new Error('Invalid Huffman Dictionary Word selector: failed during decoding process.');
        }
        let tableBitmapSize: any; // eslint-disable-line
        let tableAggregateInstances: any; // eslint-disable-line
        if (dictionary.bitmapSizeSelector) {
            tableBitmapSize = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
            customIndex++;
        } else {
            tableBitmapSize = this._getStandardTable(1);
        }
        if (dictionary.aggregationInstancesSelector) {
            tableAggregateInstances = this._getCustomHuffmanTable(customIndex, referredTo, customTables);
        } else {
            tableAggregateInstances = this._getStandardTable(1);
        }
        return {
            tableDeltaHeight,
            tableDeltaWidth,
            tableBitmapSize,
            tableAggregateInstances
        };
    }
    _readUncompressedBitmap(reader: any, width: number, height: number): Uint8Array[] { // eslint-disable-line
        const bitmap: Uint8Array[] = [];
        for (let y: number = 0; y < height; y++) {
            const row: Uint8Array = new Uint8Array(width);
            bitmap.push(row);
            for (let x: number = 0; x < width; x++) {
                row[<number>x] = reader._readBit();
            }
            reader.byteAlign();
        }
        return bitmap;
    }
    _decodeMmrBitmap(input: any, width: number, height: number, endOfBlock: boolean): Uint8Array[] { // eslint-disable-line
        const params: any = { // eslint-disable-line
            K: -1,
            Columns: width,
            Rows: height,
            BlackIs1: true,
            EndOfBlock: endOfBlock
        };
        const decoder: _PdfFaxDecoder = new _PdfFaxDecoder(input, params);
        const bitmap: Uint8Array[] = [];
        let currentByte: number;
        let eof: boolean = false;
        for (let y: number = 0; y < height; y++) {
            const row: Uint8Array = new Uint8Array(width);
            bitmap.push(row);
            let shift: number = -1;
            for (let x: number = 0; x < width; x++) {
                if (shift < 0) {
                    currentByte = decoder.readNextChar();
                    if (currentByte === -1) {
                        currentByte = 0;
                        eof = true;
                    }
                    shift = 7;
                }
                row[<number>x] = (currentByte >> shift) & 1;
                shift--;
            }
        }
        if (endOfBlock && !eof) {
            const lookForEOFLimit: number = 5;
            for (let i: number = 0; i < lookForEOFLimit; i++) {
                if (decoder.readNextChar() === -1) {
                    break;
                }
            }
        }
        return bitmap;
    }
    _onSymbolDictionary(
        dictionary: any, currentSegment: any, referredSegments: any, // eslint-disable-line
        data: Uint8Array, start: number, end: number
    ): void {
        let huffmanTables: any; // eslint-disable-line
        let  huffmanInput: any; // eslint-disable-line
        if (dictionary.huffman) {
            huffmanTables = this._getSymbolDictionaryHuffmanTables(dictionary, referredSegments, this._customTables);
            huffmanInput = new _PdfReader(data, start, end);
        }
        let symbols: any = this._symbols; // eslint-disable-line
        if (!symbols) {
            this._symbols = symbols = {};
        }
        const inputSymbols: any[] = []; // eslint-disable-line
        for (const referredSegment of referredSegments) {
            const referredSymbols: any = symbols[<number>referredSegment]; // eslint-disable-line
            if (referredSymbols) {
                inputSymbols.push(...referredSymbols);
            }
        }
        const decodingContext: _PdfDecodingContext = new _PdfDecodingContext(data, start, end);
        symbols[<number>currentSegment] = this._decodeSymbolDictionary(
            dictionary.huffman, dictionary.refinement, inputSymbols,
            dictionary.numberOfNewSymbols, dictionary.numberOfExportedSymbols,
            huffmanTables, dictionary.template, dictionary.at,
            dictionary.refinementTemplate, dictionary.refinementAt, decodingContext,
            huffmanInput
        );
    }
    _onImmediateTextRegion(
        region: any, referredSegments: string[], data: Uint8Array, start: number, end: number // eslint-disable-line
    ): void {
        const regionInfo: any = region.info; // eslint-disable-line
        let huffmanTables: any; //eslint-disable-line
        let huffmanInput: any; // eslint-disable-line
        const symbols: any = this._symbols; // eslint-disable-line
        const inputSymbols: any[] = []; // eslint-disable-line
        for (const referredSegment of referredSegments) {
            const referredSymbols: any = symbols[Number.parseInt(referredSegment.toString(), 10)]; //eslint-disable-line
            if (referredSymbols) {
                inputSymbols.push(...referredSymbols);
            }
        }
        const symbolCodeLength: number = _log2(inputSymbols.length);
        if (region.huffman) {
            huffmanInput = new _PdfReader(data, start, end);
            huffmanTables = this._getTextRegionHuffmanTables(region, referredSegments, this._customTables, inputSymbols.length,
                                                             huffmanInput);
        }
        const decodingContext: _PdfDecodingContext = new _PdfDecodingContext(data, start, end);
        const bitmap: any = this._decodeTextRegion(region.huffman, region.refinement, regionInfo.width, // eslint-disable-line
                                                   regionInfo.height, region.defaultPixelValue, region.numberOfSymbolInstances,
                                                   region.stripSize, inputSymbols, symbolCodeLength, region.transposed, region.dsOffset,
                                                   region.referenceCorner, region.combinationOperator, huffmanTables,
                                                   region.refinementTemplate, region.refinementAt, decodingContext, region.logStripSize,
                                                   huffmanInput);
        this._drawBitmap(regionInfo, bitmap);
    }
    _onPatternDictionary(dictionary: any, currentSegment: string, data: Uint8Array, start: number, end: number): // eslint-disable-line
    void {
        let patterns: { [key: string]: any } = this._patterns; // eslint-disable-line
        if (!patterns) {
            this._patterns = patterns = {};
        }
        const decodingContext: _PdfDecodingContext = new _PdfDecodingContext(data, start, end);
        patterns[Number.parseInt(currentSegment.toString(), 10)] = this._decodePatternDictionary( dictionary.mmr, dictionary.patternWidth,
                                                                                                  dictionary.patternHeight,
                                                                                                  dictionary.maxPatternIndex,
                                                                                                  dictionary.template, decodingContext);
    }
    _onImmediateHalftoneRegion(region: any, referredSegments: string[], data: Uint8Array, start: number, end: number): void { // eslint-disable-line
        const patterns: any = this._patterns[referredSegments[0]]; // eslint-disable-line
        const regionInfo: any = region.info; // eslint-disable-line
        const decodingContext: _PdfDecodingContext = new _PdfDecodingContext(data, start, end);
        const bitmap: any = this._decodeHalftoneRegion(region.mmr, patterns, region.template, regionInfo.width, // eslint-disable-line
                                                       regionInfo.height, region.defaultPixelValue, region.enableSkip,
                                                       region.combinationOperator, region.gridWidth, region.gridHeight,
                                                       region.gridOffsetX, region.gridOffsetY, region.gridVectorX,
                                                       region.gridVectorY, decodingContext);
        this._drawBitmap(regionInfo, bitmap);
    }
    _onTables(currentSegment: string, data: Uint8Array, start: number, end: number): void {
        let customTables: { [key: string]: any } = this._customTables; // eslint-disable-line
        if (!customTables) {
            this._customTables = customTables = {};
        }
        customTables[Number.parseInt(currentSegment.toString(), 10)] = this._decodeTablesSegment(data, start, end);
    }
    _decodeTablesSegment(data: Uint8Array, start: number, end: number): _PdfHuffmanTable {
        const flags: number = data[<number>start];
        const lowestValue: number = _readUnsignedInteger32(data, start + 1) & 0xffffffff;
        const highestValue: number = _readUnsignedInteger32(data, start + 5) & 0xffffffff;
        const reader: _PdfReader = new _PdfReader(data, start + 9, end);
        const prefixSizeBits: number = ((flags >> 1) & 7) + 1;
        const rangeSizeBits: number = ((flags >> 4) & 7) + 1;
        const lines: _PdfHuffmanLine[] = [];
        let prefixLength: number;
        let rangeLength: number;
        let currentRangeLow: number = lowestValue;
        do {
            prefixLength = reader._readBits(prefixSizeBits);
            rangeLength = reader._readBits(rangeSizeBits);
            lines.push(new _PdfHuffmanLine([currentRangeLow, prefixLength, rangeLength, 0]));
            currentRangeLow += 1 << rangeLength;
        } while (currentRangeLow < highestValue);
        prefixLength = reader._readBits(prefixSizeBits);
        lines.push(new _PdfHuffmanLine([lowestValue - 1, prefixLength, 32, 0, 'lower']));
        prefixLength = reader._readBits(prefixSizeBits);
        lines.push(new _PdfHuffmanLine([highestValue, prefixLength, 32, 0]));
        if (flags & 1) {
            prefixLength = reader._readBits(prefixSizeBits);
            lines.push(new _PdfHuffmanLine([prefixLength, 0]));
        }
        return new _PdfHuffmanTable(lines, false);
    }
    _decodeBitmapTemplate0(width: number, height: number, decodingContext: _PdfDecodingContext): Uint8Array[] {
        const decoder: any = decodingContext.decoder; // eslint-disable-line
        const contexts: any = decodingContext.contextCache.getContexts('GB'); // eslint-disable-line
        const bitmap: Uint8Array[] = [];
        let contextLabel: number;
        let i: number;
        let j: number;
        let pixel: number;
        let row: Uint8Array;
        let row1: Uint8Array;
        let row2: Uint8Array;
        const OLD_PIXEL_MASK: number = 0x7bf7;
        for (i = 0; i < height; i++) {
            row = bitmap[<number>i] = new Uint8Array(width);
            row1 = i < 1 ? row : bitmap[i - 1];
            row2 = i < 2 ? row : bitmap[i - 2];
            contextLabel =
                (row2[0] << 13) |
                (row2[1] << 12) |
                (row2[2] << 11) |
                (row1[0] << 7) |
                (row1[1] << 6) |
                (row1[2] << 5) |
                (row1[3] << 4);
            for (j = 0; j < width; j++) {
                row[<number>j] = pixel = decoder._readBit(contexts, contextLabel);
                contextLabel =
                    ((contextLabel & OLD_PIXEL_MASK) << 1) |
                    (j + 3 < width ? row2[j + 3] << 11 : 0) |
                    (j + 4 < width ? row1[j + 4] << 4 : 0) |
                    pixel;
            }
        }
        return bitmap;
    }
    _decodeBitmap(mmr: boolean, width: number, height: number, templateIndex: number, prediction: boolean, skip: boolean[][],
                  at: { x: number; y: number }[], decodingContext: _PdfDecodingContext): Uint8Array[] {
        if (mmr) {
            const input: _PdfReader = new _PdfReader(
                decodingContext._data,
                decodingContext._start,
                decodingContext._end
            );
            return this._decodeMmrBitmap(input, width, height, false);
        }
        if (
            templateIndex === 0 &&
            !skip &&
            !prediction &&
            at.length === 4 &&
            at[0].x === 3 &&
            at[0].y === -1 &&
            at[1].x === -3 &&
            at[1].y === -1 &&
            at[2].x === 2 &&
            at[2].y === -2 &&
            at[3].x === -2 &&
            at[3].y === -2
        ) {
            return this._decodeBitmapTemplate0(width, height, decodingContext);
        }
        const useskip: boolean = !!skip;
        const template:  {x: number; y: number}[] = this._codingTemplates[templateIndex].concat(at); // eslint-disable-line
        template.sort((a, b) => a.y - b.y || a.x - b.x); // eslint-disable-line
        const templateLength: number = template.length;
        const templateX: Int8Array = new Int8Array(templateLength);
        const templateY: Int8Array = new Int8Array(templateLength);
        const changingTemplateEntries: number[] = [];
        let reuseMask: number = 0;
        let minX: number = 0;
        let maxX: number = 0;
        let minY: number = 0;
        let c: number;
        let k: number;
        for (k = 0; k < templateLength; k++) {
            templateX[<number>k] = template[<number>k].x;
            templateY[<number>k] = template[<number>k].y;
            minX = Math.min(minX, template[<number>k].x);
            maxX = Math.max(maxX, template[<number>k].x);
            minY = Math.min(minY, template[<number>k].y);
            if (
                k < templateLength - 1 &&
                template[<number>k].y === template[k + 1].y &&
                template[<number>k].x === template[k + 1].x - 1
            ) {
                reuseMask |= 1 << (templateLength - 1 - k);
            } else {
                changingTemplateEntries.push(k);
            }
        }
        const changingEntriesLength: number = changingTemplateEntries.length;
        const changingTemplateX: Int8Array = new Int8Array(changingEntriesLength);
        const changingTemplateY: Int8Array = new Int8Array(changingEntriesLength);
        const changingTemplateBit: Uint16Array = new Uint16Array(changingEntriesLength);
        for (c = 0; c < changingEntriesLength; c++) {
            k = changingTemplateEntries[<number>c];
            changingTemplateX[<number>c] = template[<number>k].x;
            changingTemplateY[<number>c] = template[<number>k].y;
            changingTemplateBit[<number>c] = 1 << (templateLength - 1 - k);
        }
        const sbbLeft: number = -minX;
        const sbbTop: number = -minY;
        const sbbRight: number = width - maxX;
        const pseudoPixelContext: number = this._reusedContexts[<number>templateIndex];
        let row: Uint8Array = new Uint8Array(width);
        const bitmap: Uint8Array[] = [];
        const decoder: any = decodingContext.decoder; // eslint-disable-line
        const contexts: any = decodingContext.contextCache.getContexts('GB'); // eslint-disable-line
        let ltp: number = 0;
        let j: number;
        let i0: number;
        let j0: number;
        let contextLabel: number = 0;
        let bit: number;
        let shift: number;
        for (let i: number = 0; i < height; i++) {
            if (prediction) {
                const sltp: number = decoder._readBit(contexts, pseudoPixelContext);
                ltp ^= sltp;
                if (ltp) {
                    bitmap.push(row);
                    continue;
                }
            }
            row = new Uint8Array(row);
            bitmap.push(row);
            for (j = 0; j < width; j++) {
                if (useskip && skip[<number>i][<number>j]) {
                    row[<number>j] = 0;
                    continue;
                }
                if (j >= sbbLeft && j < sbbRight && i >= sbbTop) {
                    contextLabel = (contextLabel << 1) & reuseMask;
                    for (k = 0; k < changingEntriesLength; k++) {
                        i0 = i + changingTemplateY[<number>k];
                        j0 = j + changingTemplateX[<number>k];
                        bit = bitmap[<number>i0][<number>j0];
                        if (bit) {
                            bit = changingTemplateBit[<number>k];
                            contextLabel |= bit;
                        }
                    }
                } else {
                    contextLabel = 0;
                    shift = templateLength - 1;
                    for (k = 0; k < templateLength; k++, shift--) {
                        j0 = j + templateX[<number>k];
                        if (j0 >= 0 && j0 < width) {
                            i0 = i + templateY[<number>k];
                            if (i0 >= 0) {
                                bit = bitmap[<number>i0][<number>j0];
                                if (bit) {
                                    contextLabel |= bit << shift;
                                }
                            }
                        }
                    }
                }
                const pixel: any = decoder._readBit(contexts, contextLabel); // eslint-disable-line
                row[<number>j] = pixel;
            }
        }
        return bitmap;
    }
    _decodeRefinement(width: number, height: number, templateIndex: number, referenceBitmap: any, // eslint-disable-line
        offsetX: number, offsetY: number, prediction: any, at: any, decodingContext: _PdfDecodingContext // eslint-disable-line
    ): Uint8Array[] {
        let codingTemplate: { x: number; y: number }[] = this._refinementTemplates[<number>templateIndex].coding;
        if (templateIndex === 0) {
            codingTemplate = codingTemplate.concat([at[0]]);
        }
        const codingTemplateLength: number = codingTemplate.length;
        const codingTemplateX: Int32Array = new Int32Array(codingTemplateLength);
        const codingTemplateY: Int32Array = new Int32Array(codingTemplateLength);
        for (let k: number = 0; k < codingTemplateLength; k++) {
            codingTemplateX[<number>k] = codingTemplate[<number>k].x;
            codingTemplateY[<number>k] = codingTemplate[<number>k].y;
        }
        let referenceTemplate: { x: number; y: number }[] = this._refinementTemplates[<number>templateIndex].
            reference;
        if (templateIndex === 0) {
            referenceTemplate = referenceTemplate.concat([at[1]]);
        }
        const referenceTemplateLength: number = referenceTemplate.length;
        const referenceTemplateX: Int32Array = new Int32Array(referenceTemplateLength);
        const referenceTemplateY: Int32Array = new Int32Array(referenceTemplateLength);
        for (let k: number = 0; k < referenceTemplateLength; k++) {
            referenceTemplateX[<number>k] = referenceTemplate[<number>k].x;
            referenceTemplateY[<number>k] = referenceTemplate[<number>k].y;
        }
        const referenceWidth: number = referenceBitmap[0].length;
        const referenceHeight: number = referenceBitmap.length;
        const pseudoPixelContext: number = this._refinementReusedContexts[<number>templateIndex];
        const bitmap: Uint8Array[] = [];
        const decoder: any = decodingContext.decoder; // eslint-disable-line
        const contexts: any = decodingContext.contextCache.getContexts('GR'); // eslint-disable-line
        let ltp: number = 0;
        for (let i: number = 0; i < height; i++) {
            if (prediction) {
                const sltp: number = decoder._readBit(contexts, pseudoPixelContext);
                ltp ^= sltp;
                if (ltp) {
                    throw new Error('Prediction functionality is not supported.');
                }
            }
            const row: Uint8Array = new Uint8Array(width);
            bitmap.push(row);
            for (let j: number = 0; j < width; j++) {
                let i0: number;
                let j0: number;
                let contextLabel: number = 0;
                for (let k: number = 0; k < codingTemplateLength; k++) {
                    i0 = i + codingTemplateY[<number>k];
                    j0 = j + codingTemplateX[<number>k];
                    if (i0 < 0 || j0 < 0 || j0 >= width) {
                        contextLabel <<= 1;
                    } else {
                        contextLabel = (contextLabel << 1) | bitmap[<number>i0][<number>j0];
                    }
                }
                for (let k: number = 0; k < referenceTemplateLength; k++) {
                    i0 = i + referenceTemplateY[<number>k] - offsetY;
                    j0 = j + referenceTemplateX[<number>k] - offsetX;
                    if (i0 < 0 || i0 >= referenceHeight || j0 < 0 || j0 >= referenceWidth) {
                        contextLabel <<= 1;
                    } else {
                        contextLabel = (contextLabel << 1) |
                            referenceBitmap[<number>i0][<number>j0];
                    }
                }
                const pixel: number = decoder._readBit(contexts, contextLabel);
                row[<number>j] = pixel;
            }
        }
        return bitmap;
    }
    _decodeSymbolDictionary(huffman: any, refinement: any, symbols: any, numberOfNewSymbols: number, // eslint-disable-line
        numberOfExportedSymbols: number, huffmanTables: any, templateIndex: number, // eslint-disable-line
        at: { x: number; y: number }[], refinementTemplateIndex: number, refinementAt: any, // eslint-disable-line
        decodingContext: _PdfDecodingContext, huffmanInput: any): any[] { // eslint-disable-line
        if (huffman && refinement) {
            throw new Error('Huffman coding with symbol refinement is not supported.');
        }
        const newSymbols: any[] = []; // eslint-disable-line
        let currentHeight: number = 0;
        let symbolCodeLength: number = _log2(symbols.length + numberOfNewSymbols);
        const decoder: any = decodingContext.decoder; // eslint-disable-line
        const contextCache:any = decodingContext.contextCache; // eslint-disable-line
        let tableB1: any; // eslint-disable-line
        let symbolWidths: any[] = []; // eslint-disable-line
        if (huffman) {
            tableB1 = this._getStandardTable(1);
            symbolCodeLength = Math.max(symbolCodeLength, 1);
        }
        while (newSymbols.length < numberOfNewSymbols) {
            const deltaHeight: number = huffman
                ? huffmanTables.tableDeltaHeight.decode(huffmanInput)
                : this._decodeInteger(contextCache, 'IADH', decoder);
            currentHeight += deltaHeight;
            let currentWidth: number = 0;
            let totalWidth: number = 0;
            const firstSymbol: number = huffman ? symbolWidths.length : 0;
            while (true) { // eslint-disable-line
                const deltaWidth: number = huffman
                    ? huffmanTables.tableDeltaWidth.decode(huffmanInput)
                    : this._decodeInteger(contextCache, 'IADW', decoder);
                if (typeof(deltaWidth) === 'undefined') {
                    break;
                }
                currentWidth += deltaWidth;
                totalWidth += currentWidth;
                let bitmap: any; // eslint-disable-line
                if (refinement) {
                    const numberOfInstances: number = this._decodeInteger(contextCache, 'IAAI', decoder);
                    if (numberOfInstances > 1) {
                        bitmap = this._decodeTextRegion(huffman, refinement, currentWidth, currentHeight, 0, numberOfInstances,
                                                        1, symbols.concat(newSymbols), symbolCodeLength, 0, 0, 1, 0, huffmanTables,
                                                        refinementTemplateIndex, refinementAt, decodingContext, 0, huffmanInput);
                    } else {
                        const symbolId: number = this._decodeImageData(contextCache, decoder, symbolCodeLength);
                        const rdx: number = this._decodeInteger(contextCache, 'IARDX', decoder);
                        const rdy: number = this._decodeInteger(contextCache, 'IARDY', decoder);
                        const symbol: any = symbolId < symbols.length // eslint-disable-line
                            ? symbols[<number>symbolId]
                            : newSymbols[symbolId - symbols.length];
                        bitmap = this._decodeRefinement(currentWidth, currentHeight, refinementTemplateIndex, symbol, rdx,
                                                        rdy, false, refinementAt, decodingContext);
                    }
                    newSymbols.push(bitmap);
                } else if (huffman) {
                    symbolWidths.push(currentWidth);
                } else {
                    bitmap = this._decodeBitmap(false, currentWidth, currentHeight, templateIndex, false,
                                                null, at, decodingContext);
                    newSymbols.push(bitmap);
                }
            }
            if (huffman && !refinement) {
                const bitmapSize: number = huffmanTables.tableBitmapSize.decode(huffmanInput);
                huffmanInput.byteAlign();
                let collectiveBitmap: any; // eslint-disable-line
                if (bitmapSize === 0) {
                    collectiveBitmap = this._readUncompressedBitmap(huffmanInput, totalWidth, currentHeight);
                } else {
                    const originalEnd: number = huffmanInput.end;
                    const bitmapEnd: number = huffmanInput.position + bitmapSize;
                    huffmanInput.end = bitmapEnd;
                    collectiveBitmap = this._decodeMmrBitmap(huffmanInput, totalWidth, currentHeight, false);
                    huffmanInput.end = originalEnd;
                    huffmanInput.position = bitmapEnd;
                }
                const numberOfSymbolsDecoded: number = symbolWidths.length;
                if (firstSymbol === numberOfSymbolsDecoded - 1) {
                    newSymbols.push(collectiveBitmap);
                } else {
                    let xMin: number = 0;
                    let xMax: number;
                    let bitmapWidth: number;
                    let symbolBitmap: any; // eslint-disable-line
                    for (let i: number = firstSymbol; i < numberOfSymbolsDecoded; i++) {
                        bitmapWidth = symbolWidths[<number>i];
                        xMax = xMin + bitmapWidth;
                        symbolBitmap = [];
                        for (let y: number = 0; y < currentHeight; y++) {
                            symbolBitmap.push(collectiveBitmap[<number>y].subarray(xMin, xMax));
                        }
                        newSymbols.push(symbolBitmap);
                        xMin = xMax;
                    }
                }
            }
        }
        const exportedSymbols: any[] = []; // eslint-disable-line
        const flags: boolean[] = [];
        let currentFlag: boolean = false;
        let i: number = 0;
        const totalSymbolsLength: number = symbols.length + numberOfNewSymbols;
        while (flags.length < totalSymbolsLength) {
            let runLength: number = huffman
                ? tableB1.decode(huffmanInput)
                : this._decodeInteger(contextCache, 'IAEX', decoder);
            while (runLength--) {
                flags.push(currentFlag);
            }
            currentFlag = !currentFlag;
        }
        for (let i: number = 0; i < symbols.length; i++) {
            if (flags[<number>i]) {
                exportedSymbols.push(symbols[<number>i]);
            }
        }
        for (let j: number = 0; j < numberOfNewSymbols; j++, i++) {
            if (flags[<number>i]) {
                exportedSymbols.push(newSymbols[<number>j]);
            }
        }
        return exportedSymbols;
    }
    _decodeInteger(contextCache: any, procedure: any, decoder: any): number { // eslint-disable-line
        let result: any; // eslint-disable-line
        const contexts: any = contextCache.getContexts(procedure); // eslint-disable-line
        const reader: _PdfBitReader = new _PdfBitReader();
        const sign: number = reader._readBits(1, decoder, contexts);
        const value: number = reader._readBits(1, decoder, contexts) ?
            (reader._readBits(1, decoder, contexts) ?
                (reader._readBits(1, decoder, contexts) ?
                    (reader._readBits(1, decoder, contexts) ?
                        (reader._readBits(1, decoder, contexts) ?
                            (reader._readBits(32, decoder, contexts) + 4436) :
                            reader._readBits(12, decoder, contexts) + 340) :
                        reader._readBits(8, decoder, contexts) + 84) :
                    reader._readBits(6, decoder, contexts) + 20) :
                reader._readBits(4, decoder, contexts) + 4) :
            reader._readBits(2, decoder, contexts);
        let signedValue: number;
        if (sign === 0) {
            signedValue = value;
        } else if (value > 0) {
            signedValue = -value;
        }
        if (signedValue >= -(2 ** 31) && signedValue <= (2 ** 31 - 1)) {
            return signedValue;
        }
        return result;
    }
    _decodeImageData(contextCache: any, decoder: any, codeLength: any): number {  // eslint-disable-line
        const contexts: any = contextCache.getContexts('IAID'); // eslint-disable-line
        let prev: number = 1;
        for (let i: number = 0; i < codeLength; i++) {
            const bit: number = decoder._readBit(contexts, prev);
            prev = (prev << 1) | bit;
        }
        if (codeLength < 31) {
            return prev & ((1 << codeLength) - 1);
        }
        return prev & 0x7fffffff;
    }
    _decodeTextRegion(huffman: any, refinement: any, width: number, height: number, defaultPixelValue: any, // eslint-disable-line
        numberOfSymbolInstances: any, stripSize: any, inputSymbols: any, symbolCodeLength: any, // eslint-disable-line
        transposed: any, dsOffset: any, referenceCorner: any, combinationOperator: any, huffmanTables: any, // eslint-disable-line
        refinementTemplateIndex: any, refinementAt: any, decodingContext: any, logStripSize: any, // eslint-disable-line
        huffmanInput: any): any { // eslint-disable-line
        if (huffman && refinement) {
            throw new Error('Huffman encoding with refinement is currently not supported.');
        }
        const bitmap: Uint8Array[] = [];
        for (let i: number = 0; i < height; i++) {
            const row: Uint8Array = new Uint8Array(width);
            if (defaultPixelValue) {
                row.fill(defaultPixelValue);
            }
            bitmap.push(row);
        }
        const decoder: any = decodingContext.decoder; // eslint-disable-line
        const contextCache: any = decodingContext.contextCache; // eslint-disable-line
        let stripT: number = huffman
            ? -huffmanTables.tableDeltaT.decode(huffmanInput)
            : -this._decodeInteger(contextCache, 'IADT', decoder);
        let firstS: number = 0;
        let i: number = 0;
        while (i < numberOfSymbolInstances) {
            const deltaT: any = huffman // eslint-disable-line
                ? huffmanTables.tableDeltaT.decode(huffmanInput)
                : this._decodeInteger(contextCache, 'IADT', decoder);
            stripT += deltaT;
            const deltaFirstS: any = huffman // eslint-disable-line
                ? huffmanTables.tableFirstS.decode(huffmanInput)
                : this._decodeInteger(contextCache, 'IAFS', decoder);
            firstS += deltaFirstS;
            let currentS: any = firstS; // eslint-disable-line
            do {
                let currentT: number = 0;
                if (stripSize > 1) {
                    currentT = huffman
                        ? huffmanInput._readBits(logStripSize)
                        : this._decodeInteger(contextCache, 'IAIT', decoder);
                }
                const t: number = stripSize * stripT + currentT;
                const symbolId: any = huffman // eslint-disable-line
                    ? huffmanTables.symbolIDTable.decode(huffmanInput)
                    : this._decodeImageData(contextCache, decoder, symbolCodeLength);
                const applyRefinement: any = refinement && (huffman // eslint-disable-line
                    ? huffmanInput._readBit()
                    : this._decodeInteger(contextCache, 'IARI', decoder));
                let symbolBitmap: any = inputSymbols[symbolId]; // eslint-disable-line
                let symbolWidth: number = symbolBitmap[0].length;
                let symbolHeight: number = symbolBitmap.length;
                if (applyRefinement) {
                    const rdw: number = this._decodeInteger(contextCache, 'IARDW', decoder);
                    const rdh: number = this._decodeInteger(contextCache, 'IARDH', decoder);
                    const rdx: number = this._decodeInteger(contextCache, 'IARDX', decoder);
                    const rdy: number = this._decodeInteger(contextCache, 'IARDY', decoder);
                    symbolWidth += rdw;
                    symbolHeight += rdh;
                    symbolBitmap = this._decodeRefinement(symbolWidth, symbolHeight, refinementTemplateIndex, symbolBitmap,
                                                          (rdw >> 1) + rdx, (rdh >> 1) + rdy, false, refinementAt, decodingContext);
                }
                let increment: number = 0;
                if (!transposed) {
                    if (referenceCorner > 1) {
                        currentS += symbolWidth - 1;
                    } else {
                        increment = symbolWidth - 1;
                    }
                } else if (!(referenceCorner & 1)) {
                    currentS += symbolHeight - 1;
                } else {
                    increment = symbolHeight - 1;
                }
                const offsetT: number = t - (referenceCorner & 1 ? 0 : symbolHeight - 1);
                const offsetS: number = currentS - (referenceCorner & 2 ? symbolWidth - 1 : 0);
                let s2: number;
                let t2: number;
                let symbolRow: any; // eslint-disable-line
                if (transposed) {
                    for (s2 = 0; s2 < symbolHeight; s2++) {
                        const row: any = bitmap[offsetS + s2]; // eslint-disable-line
                        if (!row) {
                            continue;
                        }
                        symbolRow = symbolBitmap[<number>s2];
                        const maxWidth: number = Math.min(width - offsetT, symbolWidth);
                        switch (combinationOperator) {
                        case 0:
                            for (t2 = 0; t2 < maxWidth; t2++) {
                                row[offsetT + t2] |= symbolRow[<number>t2];
                            }
                            break;
                        case 2:
                            for (t2 = 0; t2 < maxWidth; t2++) {
                                row[offsetT + t2] ^= symbolRow[<number>t2];
                            }
                            break;
                        default:
                            throw new Error(`The combination operator ${combinationOperator} is not supported.`);
                        }
                    }
                } else {
                    for (t2 = 0; t2 < symbolHeight; t2++) {
                        const row: any = bitmap[offsetT + t2]; // eslint-disable-line
                        if (!row) {
                            continue;
                        }
                        symbolRow = symbolBitmap[<number>t2];
                        switch (combinationOperator) {
                        case 0:
                            for (s2 = 0; s2 < symbolWidth; s2++) {
                                row[offsetS + s2] |= symbolRow[<number>s2];
                            }
                            break;
                        case 2:
                            for (s2 = 0; s2 < symbolWidth; s2++) {
                                row[offsetS + s2] ^= symbolRow[<number>s2];
                            }
                            break;
                        default:
                            throw new Error(`The combination operator ${combinationOperator} is not supported.`);
                        }
                    }
                }
                i++;
                const deltaS: any = huffman // eslint-disable-line
                    ? huffmanTables.tableDeltaS.decode(huffmanInput)
                    : this._decodeInteger(contextCache, 'IADS', decoder);
                if (deltaS === null || typeof(deltaS) === 'undefined') {
                    break;
                }
                currentS += increment + deltaS + dsOffset;
            } while (true); // eslint-disable-line
        }
        return bitmap;
    }
    _decodePatternDictionary(mmr: any, patternWidth: number, patternHeight: number, maxPatternIndex: any, // eslint-disable-line
        template: any, decodingContext: any): any { // eslint-disable-line
        const at: any = []; // eslint-disable-line
        if (!mmr) {
            at.push({
                x: -patternWidth,
                y: 0
            });
            if (template === 0) {
                at.push(
                    { x: -3, y: -1 },
                    { x: 2, y: -2 },
                    { x: -2, y: -2 }
                );
            }
        }
        const collectiveWidth: number = (maxPatternIndex + 1) * patternWidth;
        const collectiveBitmap: any = this._decodeBitmap(mmr, collectiveWidth, patternHeight, // eslint-disable-line
                                                         template, false, null, at, decodingContext);
        const patterns: any = []; // eslint-disable-line
        for (let i: number = 0; i <= maxPatternIndex; i++) {
            const patternBitmap: any = []; // eslint-disable-line
            const xMin: number = patternWidth * i;
            const xMax: number = xMin + patternWidth;
            for (let y: number = 0; y < patternHeight; y++) {
                patternBitmap.push(collectiveBitmap[<number>y].subarray(xMin, xMax));
            }
            patterns.push(patternBitmap);
        }
        return patterns;
    }
    _decodeHalftoneRegion(mmr: any, patterns: any, template: any, regionWidth: any, regionHeight: any, // eslint-disable-line
                          defaultPixelValue: any, enableSkip: any, combinationOperator: any, gridWidth: number, // eslint-disable-line
                          gridHeight: number, gridOffsetX: number, gridOffsetY: number,  gridVectorX: number,
                          gridVectorY: any, decodingContext: any): any { // eslint-disable-line
        const skip: any = null; // eslint-disable-line
        if (enableSkip) {
            throw new Error('Operation failed: skip is not implemented or allowed here.');
        }
        if (combinationOperator !== 0) {
            throw new Error(
                `The operator '${combinationOperator}' is not supported in halftone region`
            );
        }
        const regionBitmap: any = []; // eslint-disable-line
        for (let i: number = 0; i < regionHeight; i++) {
            const row: Uint8Array = new Uint8Array(regionWidth);
            if (defaultPixelValue) {
                row.fill(defaultPixelValue);
            }
            regionBitmap.push(row);
        }
        const numberOfPatterns: number = patterns.length;
        const pattern0: any = patterns[0]; // eslint-disable-line
        const patternWidth: number = pattern0[0].length;
        const patternHeight: number = pattern0.length;
        const bitsPerValue: number = _log2(numberOfPatterns);
        const at: any = []; // eslint-disable-line
        if (!mmr) {
            at.push({
                x: template <= 1 ? 3 : 2,
                y: -1
            });
            if (template === 0) {
                at.push(
                    { x: -3, y: -1 },
                    { x: 2, y: -2 },
                    { x: -2, y: -2 }
                );
            }
        }
        const grayScaleBitPlanes: any = []; // eslint-disable-line
        let mmrInput: any; //eslint-disable-line
        let bitmap: any; //eslint-disable-line
        if (mmr) {
            mmrInput = new _PdfReader(decodingContext.data, decodingContext.start, decodingContext.end);
        }
        for (let i: number = bitsPerValue - 1; i >= 0; i--) {
            if (mmr) {
                bitmap = this._decodeMmrBitmap(mmrInput, gridWidth, gridHeight, true);
            } else {
                bitmap = this._decodeBitmap(false, gridWidth, gridHeight, template, false,
                                            skip, at, decodingContext);
            }
            grayScaleBitPlanes[<number>i] = bitmap;
        }
        for (let mg: number = 0; mg < gridHeight; mg++) {
            for (let ng: number = 0; ng < gridWidth; ng++) {
                let bit: number = 0;
                let patternIndex: number = 0;
                for (let j: number = bitsPerValue - 1; j >= 0; j--) {
                    bit ^= grayScaleBitPlanes[<number>j][<number>mg][<number>ng];
                    patternIndex |= bit << j;
                }
                const patternBitmap: any = patterns[<number>patternIndex]; // eslint-disable-line
                const x: number = (gridOffsetX + mg * gridVectorY + ng * gridVectorX) >> 8;
                const y: number = (gridOffsetY + mg * gridVectorX - ng * gridVectorY) >> 8;
                if (
                    x >= 0 &&
                    x + patternWidth <= regionWidth &&
                    y >= 0 &&
                    y + patternHeight <= regionHeight
                ) {
                    for (let i: number = 0; i < patternHeight; i++) {
                        const regionRow: any = regionBitmap[y + i]; // eslint-disable-line
                        const patternRow: any = patternBitmap[<number>i]; // eslint-disable-line
                        for (let j: number = 0; j < patternWidth; j++) {
                            regionRow[x + j] |= patternRow[<number>j];
                        }
                    }
                } else {
                    let regionX: number;
                    let regionY: number;
                    for (let i: number = 0; i < patternHeight; i++) {
                        regionY = y + i;
                        if (regionY < 0 || regionY >= regionHeight) {
                            continue;
                        }
                        const regionRow: any = regionBitmap[<number>regionY];  // eslint-disable-line
                        const patternRow : any = patternBitmap[<number>i]; // eslint-disable-line
                        for (let j: number = 0; j < patternWidth; j++) {
                            regionX = x + j;
                            if (regionX >= 0 && regionX < regionWidth) {
                                regionRow[<number>regionX] |= patternRow[<number>j];
                            }
                        }
                    }
                }
            }
        }
        return regionBitmap;
    }
}
export class _PdfHuffmanLine {
    isoob: boolean;
    rangeLow: number;
    prefixLength: number;
    rangeLength: number;
    prefixCode: number;
    isLowerRange: boolean;
    constructor(lineData: any) {  // eslint-disable-line
        if (lineData.length === 2) {
            this.isoob = true;
            this.rangeLow = 0;
            this.prefixLength = lineData[0] as number;
            this.rangeLength = 0;
            this.prefixCode = lineData[1] as number;
            this.isLowerRange = false;
        } else {
            this.isoob = false;
            this.rangeLow = lineData[0] as number;
            this.prefixLength = lineData[1] as number;
            this.rangeLength = lineData[2] as number;
            this.prefixCode = lineData[3] as number;
            this.isLowerRange = lineData[4] === 'lower';
        }
    }
}
export class _PdfHuffmanTreeNode {
    children: _PdfHuffmanTreeNode[];
    isLeaf: boolean;
    rangeLength: number;
    rangeLow: number;
    isLowerRange: boolean;
    isoob: boolean;
    constructor(line: _PdfHuffmanLine) {
        this.children = [];
        if (line) {
            this.isLeaf = true;
            this.rangeLength = line.rangeLength;
            this.rangeLow = line.rangeLow;
            this.isLowerRange = line.isLowerRange;
            this.isoob = line.isoob;
        } else {
            this.isLeaf = false;
        }
    }
    _buildTree(line: _PdfHuffmanLine, shift: number): void {
        const bit: number = (line.prefixCode >> shift) & 1;
        if (shift <= 0) {
            this.children[<number>bit] = new _PdfHuffmanTreeNode(line);
        } else {
            let node: any = this.children[<number>bit]; // eslint-disable-line
            if (!node) {
                this.children[<number>bit] = node = new _PdfHuffmanTreeNode(null);
            }
            node._buildTree(line, shift - 1);
        }
    }
    _decodeNode(reader: any): number | null { // eslint-disable-line
        if (this.isLeaf) {
            if (this.isoob) {
                return null;
            }
            const htOffset: number = reader._readBits(this.rangeLength);
            return this.rangeLow + (this.isLowerRange ? -htOffset : htOffset);
        }
        const node: any = this.children[reader._readBit()]; // eslint-disable-line
        if (!node) {
            throw new Error('Failed to decode: Huffman data is invalid or corrupted.');
        }
        return node._decodeNode(reader);
    }
}
export class _PdfHuffmanTable {
    rootNode: _PdfHuffmanTreeNode;
    constructor(lines: _PdfHuffmanLine[], prefixCodesDone: boolean) {
        if (!prefixCodesDone) {
            this.assignPrefixCodes(lines);
        }
        this.rootNode = new _PdfHuffmanTreeNode(null);
        for (let i: number = 0, ii: number = lines.length; i < ii; i++) {
            const line:any = lines[<number>i]; // eslint-disable-line
            if (line.prefixLength > 0) {
                this.rootNode._buildTree(line, line.prefixLength - 1);
            }
        }
    }
    decode(reader: any): number | null { // eslint-disable-line
        return this.rootNode._decodeNode(reader);
    }
    assignPrefixCodes(lines: _PdfHuffmanLine[]): void {
        const linesLength: number = lines.length;
        let prefixLengthMax: number = 0;
        for (let i: number = 0; i < linesLength; i++) {
            prefixLengthMax = Math.max(prefixLengthMax, lines[<number>i].prefixLength);
        }
        const histogram: Uint32Array = new Uint32Array(prefixLengthMax + 1);
        for (let i: number = 0; i < linesLength; i++) {
            histogram[lines[<number>i].prefixLength]++;
        }
        let currentLength: number = 1;
        let firstCode: number = 0;
        let currentCode: number;
        let currentTemp: number;
        let line: _PdfHuffmanLine;
        histogram[0] = 0;
        while (currentLength <= prefixLengthMax) {
            firstCode = (firstCode + histogram[currentLength - 1]) << 1;
            currentCode = firstCode;
            currentTemp = 0;
            while (currentTemp < linesLength) {
                line = lines[<number>currentTemp];
                if (line.prefixLength === currentLength) {
                    line.prefixCode = currentCode;
                    currentCode++;
                }
                currentTemp++;
            }
            currentLength++;
        }
    }
}
export class _PdfReader {
    data: Uint8Array;
    start: number;
    end: number;
    position: number;
    shift: number;
    currentByte: number;
    constructor(data: Uint8Array, start: number, end: number) {
        this.data = data;
        this.start = start;
        this.end = end;
        this.position = start;
        this.shift = -1;
        this.currentByte = 0;
    }
    _readBit(): number {
        if (this.shift < 0) {
            if (this.position >= this.end) {
                throw new Error('Unexpected end of input: No more data available while attempting to read a bit.');
            }
            this.currentByte = this.data[this.position++];
            this.shift = 7;
        }
        const bit: number = (this.currentByte >> this.shift) & 1;
        this.shift--;
        return bit;
    }
    _readBits(numBits: number): number {
        let result: number = 0;
        for (let i: number = numBits - 1; i >= 0; i--) {
            result |= this._readBit() << i;
        }
        return result;
    }
    byteAlign(): void {
        this.shift = -1;
    }
    next(): number {
        if (this.position >= this.end) {
            return -1;
        }
        return this.data[this.position++];
    }
}
export class _PdfJbig2Image {
    width: number;
    height: number;
    _regionSegmentInformationFieldLength: number = 17;
    _segmentTypes: (string | null)[] = [
        'SymbolDictionary', null, null, null, 'IntermediateTextRegion', null, 'ImmediateTextRegion', 'ImmediateLosslessTextRegion',
        null, null, null, null, null, null, null, null, 'PatternDictionary', null, null, null, 'IntermediateHalftoneRegion',
        null, 'ImmediateHalftoneRegion', 'ImmediateLosslessHalftoneRegion', null, null, null, null, null, null, null, null, null,
        null, null, null, 'IntermediateGenericRegion', null, 'ImmediateGenericRegion', 'ImmediateLosslessGenericRegion',
        'IntermediateGenericRefinementRegion', null, 'ImmediateGenericRefinementRegion', 'ImmediateLosslessGenericRefinementRegion', null,
        null, null, null, 'PageInformation', 'EndOfPage', 'EndOfStripe', 'EndOfFile', 'Profiles', 'Tables', null,
        null, null, null, null, null, null, null, 'Extension'];
    _parseChunks(chunks: any): any { // eslint-disable-line
        return this._parseJbig2Chunks(chunks);
    }
    _parse(data: any): any { // eslint-disable-line
        const { imgData, width, height } = this._parseJbig2(data);
        this.width = width;
        this.height = height;
        return imgData;
    }
    _processSegments(segments: any, visitor: _PdfSimpleSegmentVisitor): any { // eslint-disable-line
        for (let i: number = 0, ii: number = segments.length; i < ii; i++) {
            this._processSegment(segments[<number>i], visitor);
        }
    }
    _parseJbig2(data: Uint8Array): { imgData: Uint8ClampedArray; width: number; height: number } {
        const end: number = data.length;
        let position: number = 0;
        if (data[<number>position] !== 0x97 || data[position + 1] !== 0x4a || data[position + 2] !== 0x42 ||
            data[position + 3] !== 0x32 || data[position + 4] !== 0x0d || data[position + 5] !== 0x0a ||
            data[position + 6] !== 0x1a || data[position + 7] !== 0x0a) {
            throw new Error('JBIG2 parsing error: The image header is invalid or malformed.');
        }
        const header: { randomAccess: boolean; numberOfPages?: number } = Object.create(null);
        position += 8;
        const flags: number = data[position++];
        header.randomAccess = !(flags & 1);
        if (!(flags & 2)) {
            header.numberOfPages = _readUnsignedInteger32(data, position);
            position += 4;
        }
        const segments: any = this._readSegments(header, data, position, end); // eslint-disable-line
        const visitor: _PdfSimpleSegmentVisitor = new _PdfSimpleSegmentVisitor();
        this._processSegments(segments, visitor);
        const { width, height } = visitor._currentPageInfo;
        const bitPacked: any = visitor._buffer; // eslint-disable-line
        const imgData: Uint8ClampedArray = new Uint8ClampedArray(width * height);
        let q: number = 0;
        let k: number = 0;
        for (let i: number = 0; i < height; i++) {
            let mask: number = 0;
            let buffer: number;
            for (let j: number = 0; j < width; j++) {
                if (!mask) {
                    mask = 128;
                    buffer = bitPacked[k++];
                }
                imgData[q++] = buffer & mask ? 0 : 255;
                mask >>= 1;
            }
        }
        return { imgData, width, height };
    }
    _parseJbig2Chunks(chunks: any): any { // eslint-disable-line
        const visitor: _PdfSimpleSegmentVisitor = new _PdfSimpleSegmentVisitor();
        for (let i: number = 0, ii: number = chunks.length; i < ii; i++) {
            const chunk: any = chunks[<number>i]; // eslint-disable-line
            const segments: any = this._readSegments({}, chunk.data, chunk.start, chunk.end); // eslint-disable-line
            this._processSegments(segments, visitor);
        }
        return visitor._buffer;
    }
    _readSegmentHeader(data: Uint8Array, start: number): {
        number: number; type: number; typeName: string | null; deferredNonRetain: boolean;
        retainBits: number[]; pageAssociation: number; length: number; referredTo: number[];
        headerEnd: number; } {
        const segmentHeader: {
            number: number; type: number; typeName: string | null; deferredNonRetain: boolean;
            retainBits: number[]; pageAssociation: number; length: number; referredTo: number[]; headerEnd: number;
        } = {
            number: _readUnsignedInteger32(data, start), type: 0, typeName: null, deferredNonRetain: false, retainBits: [],
            pageAssociation: 0, length: 0, referredTo: [], headerEnd: start};
        const flags: number = data[start + 4];
        const segmentType: number = flags & 0x3f;
        if (!this._segmentTypes[<number>segmentType]) {
            throw new Error('JBIG2 decoding error: Encountered an unknown or unsupported segment type' + segmentType);
        }
        segmentHeader.type = segmentType;
        segmentHeader.typeName = this._segmentTypes[<number>segmentType];
        segmentHeader.deferredNonRetain = !!(flags & 0x80);
        const pageAssociationFieldSize: boolean = !!(flags & 0x40);
        const referredFlags: number = data[start + 5];
        let referredToCount: number = (referredFlags >> 5) & 7;
        const retainBits: number[] = [referredFlags & 31];
        let position: number = start + 6;
        if (referredFlags === 7) {
            referredToCount = _readUnsignedInteger32(data, position - 1) & 0x1fffffff;
            position += 3;
            let bytes: number = (referredToCount + 7) >> 3;
            retainBits[0] = data[position++];
            while (--bytes > 0) {
                retainBits.push(data[position++]);
            }
        } else if (referredFlags === 5 || referredFlags === 6) {
            throw new Error('JBIG2 decoding error: Encountered invalid or malformed referred-to flags in the segment header.');
        }
        segmentHeader.retainBits = retainBits;
        let referredToSegmentNumberSize: number = 4;
        if (segmentHeader.number <= 256) {
            referredToSegmentNumberSize = 1;
        } else if (segmentHeader.number <= 65536) {
            referredToSegmentNumberSize = 2;
        }
        const referredTo: number[] = [];
        for (let i: number = 0; i < referredToCount; i++) {
            let number: number;
            if (referredToSegmentNumberSize === 1) {
                number = data[<number>position];
            } else if (referredToSegmentNumberSize === 2) {
                number = _readUnsignedInteger16(data, position);
            } else {
                number = _readUnsignedInteger32(data, position);
            }
            referredTo.push(number);
            position += referredToSegmentNumberSize;
        }
        segmentHeader.referredTo = referredTo;
        if (!pageAssociationFieldSize) {
            segmentHeader.pageAssociation = data[position++];
        } else {
            segmentHeader.pageAssociation = _readUnsignedInteger32(data, position);
            position += 4;
        }
        segmentHeader.length = _readUnsignedInteger32(data, position);
        position += 4;
        if (segmentHeader.length === 0xffffffff) {
            if (segmentType === 38) {
                const genericRegionInfo: any = this._readRegionSegmentInformation(data, position); // eslint-disable-line
                const genericRegionSegmentFlags: any = data[position + this._regionSegmentInformationFieldLength]; // eslint-disable-line
                const genericRegionMmr: boolean = !!(genericRegionSegmentFlags & 1);
                const searchPatternLength: number = 6;
                const searchPattern: Uint8Array = new Uint8Array(searchPatternLength);
                if (!genericRegionMmr) {
                    searchPattern[0] = 0xff;
                    searchPattern[1] = 0xac;
                }
                searchPattern[2] = (genericRegionInfo.height >>> 24) & 0xff;
                searchPattern[3] = (genericRegionInfo.height >> 16) & 0xff;
                searchPattern[4] = (genericRegionInfo.height >> 8) & 0xff;
                searchPattern[5] = genericRegionInfo.height & 0xff;
                for (let i: number = position, ii: number = data.length; i < ii; i++) {
                    let j: number = 0;
                    while (j < searchPatternLength && searchPattern[<number>j] === data[i + j]) {
                        j++;
                    }
                    if (j === searchPatternLength) {
                        segmentHeader.length = i + searchPatternLength;
                        break;
                    }
                }
                if (segmentHeader.length === 0xffffffff) {
                    throw new Error('Decoding error: Unable to find the end of the segment');
                }
            } else {
                throw new Error('Segment length is unknown or invalid');
            }
        }
        segmentHeader.headerEnd = position;
        return segmentHeader;
    }
    _readSegments(header: any, data: any, start: number, end: number): any { // eslint-disable-line
        const segments: { header: any; data: Uint8Array; start?: number; end?: number; }[] = []; // eslint-disable-line
        let position: number = start;
        while (position < end) {
            const segmentHeader: any = this._readSegmentHeader(data, position); // eslint-disable-line
            position = segmentHeader.headerEnd;
            const segment: { header: any; data: Uint8Array; start?: number; end?: number; } = { // eslint-disable-line
                header: segmentHeader,
                data
            };
            if (!header.randomAccess) {
                segment.start = position;
                position += segmentHeader.length;
                segment.end = position;
            }
            segments.push(segment);
            if (segmentHeader.type === 51) {
                break;
            }
        }
        if (header.randomAccess) {
            for (let i: number = 0, ii: number = segments.length; i < ii; i++) {
                segments[<number>i].start = position;
                position += segments[<number>i].header.length;
                segments[<number>i].end = position;
            }
        }
        return segments;
    }
    _processSegment(segment: { header: { type: number; number: number; referredTo: number }; data: Uint8Array; start: number; end: number }, visitor: any) { // eslint-disable-line
        const header: any = segment.header; // eslint-disable-line
        const data: any = segment.data; // eslint-disable-line
        const end: number = segment.end;
        let position: number = segment.start;
        let dictionary: { [key: string]: any}; // eslint-disable-line
        let dictionaryFlags: number;
        let textRegion: { [key: string]: any};//eslint-disable-line
        let patternDictionary: { [key: string]: any }; // eslint-disable-line
        let patternDictionaryFlags: number;
        let halftoneRegion: { [key: string]: any }; // eslint-disable-line
        let halftoneRegionFlags: number;
        let genericRegion: { [key: string]: any }; // eslint-disable-line
        let genericRegionSegmentFlags: number;
        let pageInfo: { [key: string]: any }; // eslint-disable-line
        let pageSegmentFlags: number;
        let textRegionSegmentFlags: number;
        let args: any[], at: { x: number; y: number }[], i: number, atLength: number;  // eslint-disable-line
        switch (header.type) {
        case 0:
            dictionary = {};
            dictionaryFlags = _readUnsignedInteger16(data, position);
            dictionary.huffman = !!(dictionaryFlags & 1);
            dictionary.refinement = !!(dictionaryFlags & 2);
            dictionary.huffmanDHSelector = (dictionaryFlags >> 2) & 3;
            dictionary.huffmanDWSelector = (dictionaryFlags >> 4) & 3;
            dictionary.bitmapSizeSelector = (dictionaryFlags >> 6) & 1;
            dictionary.aggregationInstancesSelector = (dictionaryFlags >> 7) & 1;
            dictionary.bitmapCodingContextUsed = !!(dictionaryFlags & 256);
            dictionary.bitmapCodingContextRetained = !!(dictionaryFlags & 512);
            dictionary.template = (dictionaryFlags >> 10) & 3;
            dictionary.refinementTemplate = (dictionaryFlags >> 12) & 1;
            position += 2;
            if (!dictionary.huffman) {
                atLength = dictionary.template === 0 ? 4 : 1;
                at = [];
                for (i = 0; i < atLength; i++) {
                    at.push({
                        x: _readInteger8(data, position),
                        y: _readInteger8(data, position + 1)
                    });
                    position += 2;
                }
                dictionary.at = at;
            }
            if (dictionary.refinement && !dictionary.refinementTemplate) {
                at = [];
                for (i = 0; i < 2; i++) {
                    at.push({
                        x: _readInteger8(data, position),
                        y: _readInteger8(data, position + 1)
                    });
                    position += 2;
                }
                dictionary.refinementAt = at;
            }
            dictionary.numberOfExportedSymbols = _readUnsignedInteger32(data, position);
            position += 4;
            dictionary.numberOfNewSymbols = _readUnsignedInteger32(data, position);
            position += 4;
            args = [dictionary, header.number, header.referredTo, data, position, end];
            break;
        case 6:
        case 7:
            textRegion = {};
            textRegion.info = this._readRegionSegmentInformation(data, position);
            position += this._regionSegmentInformationFieldLength;
            textRegionSegmentFlags = _readUnsignedInteger16(data, position);
            position += 2;
            textRegion.huffman = !!(textRegionSegmentFlags & 1);
            textRegion.refinement = !!(textRegionSegmentFlags & 2);
            textRegion.logStripSize = (textRegionSegmentFlags >> 2) & 3;
            textRegion.stripSize = 1 << textRegion.logStripSize;
            textRegion.referenceCorner = (textRegionSegmentFlags >> 4) & 3;
            textRegion.transposed = !!(textRegionSegmentFlags & 64);
            textRegion.combinationOperator = (textRegionSegmentFlags >> 7) & 3;
            textRegion.defaultPixelValue = (textRegionSegmentFlags >> 9) & 1;
            textRegion.dsOffset = (textRegionSegmentFlags << 17) >> 27;
            textRegion.refinementTemplate = (textRegionSegmentFlags >> 15) & 1;
            if (textRegion.huffman) {
                const textRegionHuffmanFlags: number = _readUnsignedInteger16(data, position);
                position += 2;
                textRegion.huffmanFS = textRegionHuffmanFlags & 3;
                textRegion.huffmanDS = (textRegionHuffmanFlags >> 2) & 3;
                textRegion.huffmanDT = (textRegionHuffmanFlags >> 4) & 3;
                textRegion.huffmanRefinementDW = (textRegionHuffmanFlags >> 6) & 3;
                textRegion.huffmanRefinementDH = (textRegionHuffmanFlags >> 8) & 3;
                textRegion.huffmanRefinementDX = (textRegionHuffmanFlags >> 10) & 3;
                textRegion.huffmanRefinementDY = (textRegionHuffmanFlags >> 12) & 3;
                textRegion.huffmanRefinementSizeSelector = !!(textRegionHuffmanFlags & 0x4000);
            }
            if (textRegion.refinement && !textRegion.refinementTemplate) {
                at = [];
                for (i = 0; i < 2; i++) {
                    at.push({
                        x: _readInteger8(data, position),
                        y: _readInteger8(data, position + 1)
                    });
                    position += 2;
                }
                textRegion.refinementAt = at;
            }
            textRegion.numberOfSymbolInstances = _readUnsignedInteger32(data, position);
            position += 4;
            args = [textRegion, header.referredTo, data, position, end];
            break;
        case 16:
            patternDictionary = {};
            patternDictionaryFlags = data[position++];
            patternDictionary.mmr = !!(patternDictionaryFlags & 1);
            patternDictionary.template = (patternDictionaryFlags >> 1) & 3;
            patternDictionary.patternWidth = data[position++];
            patternDictionary.patternHeight = data[position++];
            patternDictionary.maxPatternIndex = _readUnsignedInteger32(data, position);
            position += 4;
            args = [patternDictionary, header.number, data, position, end];
            break;
        case 22:
        case 23:
            halftoneRegion = {};
            halftoneRegion.info = this._readRegionSegmentInformation(data, position);
            position += this._regionSegmentInformationFieldLength;
            halftoneRegionFlags = data[position++];
            halftoneRegion.mmr = !!(halftoneRegionFlags & 1);
            halftoneRegion.template = (halftoneRegionFlags >> 1) & 3;
            halftoneRegion.enableSkip = !!(halftoneRegionFlags & 8);
            halftoneRegion.combinationOperator = (halftoneRegionFlags >> 4) & 7;
            halftoneRegion.defaultPixelValue = (halftoneRegionFlags >> 7) & 1;
            halftoneRegion.gridWidth = _readUnsignedInteger32(data, position);
            position += 4;
            halftoneRegion.gridHeight = _readUnsignedInteger32(data, position);
            position += 4;
            halftoneRegion.gridOffsetX = _readUnsignedInteger32(data, position) & 0xffffffff;
            position += 4;
            halftoneRegion.gridOffsetY = _readUnsignedInteger32(data, position) & 0xffffffff;
            position += 4;
            halftoneRegion.gridVectorX = _readUnsignedInteger16(data, position);
            position += 2;
            halftoneRegion.gridVectorY = _readUnsignedInteger16(data, position);
            position += 2;
            args = [halftoneRegion, header.referredTo, data, position, end];
            break;
        case 38:
        case 39:
            genericRegion = {};
            genericRegion.info = this._readRegionSegmentInformation(data, position);
            position += this._regionSegmentInformationFieldLength;
            genericRegionSegmentFlags = data[position++];
            genericRegion.mmr = !!(genericRegionSegmentFlags & 1);
            genericRegion.template = (genericRegionSegmentFlags >> 1) & 3;
            genericRegion.prediction = !!(genericRegionSegmentFlags & 8);
            if (!genericRegion.mmr) {
                atLength = genericRegion.template === 0 ? 4 : 1;
                at = [];
                for (i = 0; i < atLength; i++) {
                    at.push({
                        x: _readInteger8(data, position),
                        y: _readInteger8(data, position + 1)
                    });
                    position += 2;
                }
                genericRegion.at = at;
            }
            args = [genericRegion, data, position, end];
            break;
        case 48:
            pageInfo = {
                width: _readUnsignedInteger32(data, position),
                height: _readUnsignedInteger32(data, position + 4),
                resolutionX: _readUnsignedInteger32(data, position + 8),
                resolutionY: _readUnsignedInteger32(data, position + 12)
            };
            if (pageInfo.height === 0xffffffff) {
                delete pageInfo.height;
            }
            pageSegmentFlags = data[position + 16];
            _readUnsignedInteger16(data, position + 17);
            pageInfo.lossless = !!(pageSegmentFlags & 1);
            pageInfo.refinement = !!(pageSegmentFlags & 2);
            pageInfo.defaultPixelValue = (pageSegmentFlags >> 2) & 1;
            pageInfo.combinationOperator = (pageSegmentFlags >> 3) & 3;
            pageInfo.requiresBuffer = !!(pageSegmentFlags & 32);
            pageInfo.combinationOperatorOverride = !!(pageSegmentFlags & 64);
            args = [pageInfo];
            break;
        case 49:
            break;
        case 50:
            break;
        case 51:
            break;
        case 53:
            args = [header.number, data, position, end];
            break;
        case 62:
            break;
        default:
            throw new Error(`Segment type ${header.typeName}(${header.type}) is not implemented`);
        }
        const callbackName: string = '_on' + header.typeName;
        if (callbackName === '_onImmediateLosslessGenericRegion') {
            visitor._onImmediateGenericRegion(args[0], args[1], args[2], args[3], args[4]);
        } else if (callbackName === '_onImmediateLosslessTextRegion') {
            visitor._onImmediateTextRegion(args[0], args[1], args[2], args[3], args[4]);
        } else if (callbackName === '_onImmediateLosslessHalftoneRegion') {
            visitor._onImmediateHalftoneRegion(args[0], args[1], args[2], args[3], args[4]);
        } else if (callbackName === '_onPageInformation') {
            visitor._onPageInformation(args);
        } else if (callbackName === '_onSymbolDictionary') {
            visitor._onSymbolDictionary(args[0], args[1], args[2], args[3], args[4], args[5]);
        }
    }
    _readRegionSegmentInformation(data: Uint8Array, start: number): {
        width: number; height: number; x: number; y: number; combinationOperator: number; } {
        return {
            width: _readUnsignedInteger32(data, start), height: _readUnsignedInteger32(data, start + 4),
            x: _readUnsignedInteger32(data, start + 8),  y: _readUnsignedInteger32(data, start + 12),
            combinationOperator: data[start + 16] & 7
        };
    }
}
