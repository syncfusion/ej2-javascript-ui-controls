import { _TrueTypeCmapEncoding, _TrueTypeMacintoshEncodingID, _TrueTypeMicrosoftEncodingID, _TrueTypePlatformID } from "../src/pdf/core/enumerator";
import { _BigEndianWriter, _TrueTypeGlyph, _TrueTypeMetrics, _TrueTypeReader } from "../src/pdf/core/fonts/ttf-reader";
import { _TrueTypeTableInfo } from "../src/pdf/core/fonts/ttf-table";

describe('1038504 _TrueTypeReader constructor mutations', () => {
    it('1038504 constructor initializes boolean flags and collections', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([1, 2, 3, 4]));
        expect(reader._isFont).toBe(false);
        expect(reader._isMacTtf).toBe(false);
        expect(reader._isMacFont).toBe(false);
        expect(reader._isOpenType).toBe(false);
        expect(reader._missedGlyphs).toBe(0);
        expect(reader._int32Size).toBe(4);
        expect(reader._tableNames).toBeDefined();
        expect(reader._tableNames.length).toBe(9);
        expect(reader._tableNames[0]).toBe('cvt ');
        expect(reader._tableNames[1]).toBe('fpgm');
        expect(reader._tableNames[2]).toBe('glyf');
        expect(reader._tableNames[3]).toBe('head');
        expect(reader._tableNames[4]).toBe('hhea');
        expect(reader._tableNames[5]).toBe('hmtx');
        expect(reader._tableNames[6]).toBe('loca');
        expect(reader._tableNames[7]).toBe('maxp');
        expect(reader._tableNames[8]).toBe('prep');
        expect(reader._tableNames.indexOf('cvt ')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('fpgm')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('glyf')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('head')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('hhea')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('hmtx')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('loca')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('maxp')).toBeGreaterThan(-1);
        expect(reader._tableNames.indexOf('prep')).toBeGreaterThan(-1);
        const expected: number[] = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
        expect(reader._entrySelectors).toBeDefined();
        expect(reader._entrySelectors.length).toBe(expected.length);
        for (let i: number = 0; i < expected.length; i++) {
            expect(reader._entrySelectors[i]).toBe(expected[i]);
        }
        expect(reader._fontData.length).toBe(4);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 macintosh getter creates dictionary when backing field is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._macintoshDictionary = null;
        let result: any = reader.macintosh;
        expect(result).not.toBeNull();
        reader._microsoftDictionary = null;
        result = reader._microsoft;
        expect(result).not.toBeNull();
        expect(result).toBe(reader._microsoftDictionary);
        reader._internalMacintoshGlyphs = null;
        result = reader._macintoshGlyphs;
        expect(result).not.toBeNull();
        expect(result).toBe(reader._internalMacintoshGlyphs);
        reader._internalMicrosoftGlyphs = null;
        result = reader._microsoftGlyphs;
        expect(result).not.toBeNull();
        expect(result).toBe(reader._internalMicrosoftGlyphs);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readFontDictionary reuses existing tableDirectory', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const existingDirectory: any = {sentinel: 'existing', setValue: function (_key: string, _value: any): void {}};
        reader._tableDirectory = existingDirectory;
        reader._check = function (): void {};
        let readCount: number = 0;
        reader._readInt16 = function (_offset: number): number {readCount++; return 0;};
        reader._fixOffsets = function (): void {};
        reader._readFontDictionary();
        expect(reader._tableDirectory).toBe(existingDirectory);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readFontDictionary invokes fixOffsets when not font', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._isFont = false;
        reader._check = function (): void {};
        let readCount: number = 0;
        reader._readInt16 = function (_offset: number): number {readCount++; return 0;};
        let fixOffsetsCalled: boolean = false;
        reader._fixOffsets = function (): void {fixOffsetsCalled = true;};
        reader._readFontDictionary();
        expect(fixOffsetsCalled).toBe(true);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readFontDictionary skips fixOffsets when font flag true', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._isFont = true;
        reader._check = function (): void {};
        reader._readInt16 = function (_offset: number): number {return 0;};
        let fixOffsetsCount: number = 0;
        reader._fixOffsets = function (): void {fixOffsetsCount++; };
        reader._readFontDictionary();
        expect(fixOffsetsCount).toBe(0);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _fixOffsets does not access key beyond collection length', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const values: any = {head: { _offset: 100 }};
        reader._lowestPosition = 50;
        reader._tableDirectory = {
            keys: (): string[] => ['head'],
            getValue: (key: string): any => {
                expect(key).toBe('head');
                return values[key];
            }
        };
        expect((): void => {reader._fixOffsets();}).not.toThrow();
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _fixOffsets uses smallest offset value', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const first: any = { _offset: 30 };
        const second: any = { _offset: 80 };
        reader._lowestPosition = 10;
        reader._tableDirectory = {
            keys: (): string[] => ['first', 'second'],
            getValue: (key: string): any => {
                return key === 'first' ? first : second;
            }
        };
        reader._fixOffsets();
        expect(first._offset).toBe(10);
        expect(second._offset).toBe(60);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _fixOffsets preserves equal minimum offsets', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const first: any = { _offset: 20 };
        const second: any = { _offset: 20 };
        reader._lowestPosition = 20;
        let accessCount: number = 0;
        reader._tableDirectory = {
            keys: (): string[] => ['first', 'second'],
            getValue: (key: string): any => {
                accessCount++;
                return key === 'first' ? first : second;
            }
        };
        reader._fixOffsets();
        expect(accessCount).toBeLessThan(3);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _fixOffsets breaks when minimum offset equals lowest position', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        let secondAccessed: boolean = false;
        reader._lowestPosition = 50;
        reader._tableDirectory = {
            keys: (): string[] => ['first', 'second'],
            getValue: (key: string): any => {
                if (key === 'second') {
                    secondAccessed = true;
                    return { _offset: 200 };
                }
                return { _offset: 50 };
            }
        };
        reader._fixOffsets();
        expect(secondAccessed).toBe(false);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _fixOffsets treats equal offsets as break condition', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        let secondLookup: boolean = false;
        reader._lowestPosition = 25;
        reader._tableDirectory = {
            keys: (): string[] => ['a', 'b'],
            getValue: (key: string): any => {
                if (key === 'b') {
                    secondLookup = true;
                    return { _offset: 70 };
                }
                return { _offset: 25 };
            }
        };
        reader._fixOffsets();
        expect(secondLookup).toBe(false);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
});
describe('1038504 _check TTC offset handling', () => {
    it('1038504 _check advances offset by four before reading TTC identifier', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const offsets: number[] = [];
        let int32CallCount: number = 0;
        reader._offset = 0;
        reader._readInt32 = function (offset: number): number {
            offsets.push(offset);
            int32CallCount++;
            switch (int32CallCount) {
            case 1: return 12345; // enter TTC branch
            case 2: return 1; // ttcIdentificationNumber
            case 3: return 20; // new offset
            case 4: return 0x10000; // final version
            default: return 0;
            }
        };
        reader._readString = function (_length: number): string {return 'ttcf';};
        const version: number = reader._check();
        expect(version).toBe(0x10000);
        expect(offsets.length).toBe(4);
        expect(offsets[0]).toBe(0);
        expect(offsets[1]).toBe(4);
        expect(offsets[2]).toBe(4);
        expect(offsets[3]).toBe(20);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _check accepts zero TTC identification number', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        let int32CallCount: number = 0;
        reader._offset = 0;
        reader._readInt32 = function (_offset: number): number {
            int32CallCount++;
            switch (int32CallCount) {
            case 1: return 99999; // enter TTC branch
            case 2: return 0; // boundary value
            case 3: return 12;
            case 4: return 0x10000;
            default: return 0;
            }
        };
        reader._readString = function (_length: number): string {return 'ttcf';};
        expect(() => reader._check()).not.toThrow();
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readNameTable skips offset assignment when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 25;
        reader._getTable = function (_name: string): any {
            return { _offset: null };
        };
        const offsets: number[] = [];
        reader._readUInt16 = function (offset: number): number {
            offsets.push(offset);
            return 0;
        };
        reader._readNameTable();
        expect(offsets[0]).toBe(25);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readNameTable initializes name records collection as empty', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any {return { _offset: 0 };};
        let callIndex: number = 0;
        reader._readUInt16 = function (_offset: number): number {
            callIndex++;
            switch (callIndex) {
            case 1: return 0;
            case 2: return 0;
            case 3: return 0;
            default: return 0;
            }
        };
        const table: any = reader._readNameTable();
        expect(Array.isArray(table._nameRecords)).toBe(true);
        expect(table._nameRecords.length).toBe(0);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readNameTable treats platform zero as unicode', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any {return { _offset: 10 }; };
        const values: number[] = [0, 1, 20, 0, 1, 1, 1, 4, 2 ];
        let index: number = 0;
        reader._readUInt16 = function (_offset: number): number { return values[index++]; };
        let unicodeValue: boolean;
        reader._readString = function (_length: number, unicode: boolean): string {unicodeValue = unicode; return 'Test'; };
        reader._readNameTable();
        expect(unicodeValue).toBe(true);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readNameTable treats non unicode platform as false', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any {return { _offset: 10 };};
        const values: number[] = [0, 1, 20, 1, 1, 1, 1, 4, 2];
        let index: number = 0;
        reader._readUInt16 = function (_offset: number): number {return values[index++];};
        let unicodeValue: boolean;
        reader._readString = function (_length: number, unicode: boolean): string {unicodeValue = unicode; return 'Test';};
        reader._readNameTable();
        expect(unicodeValue).toBe(false);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
});
describe('1038504 _readHeadTable offset guard', () => {
    it('1038504 _readHeadTable skips offset assignment when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 40;
        reader._getTable = function (_name: string): any { return { _offset: null }; };
        const fixedOffsets: number[] = [];
        reader._readFixed = function (offset: number): number { fixedOffsets.push(offset); return 1; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readUInt16 = function (_offset: number): number { return 0; };
        reader._readInt64 = function (_offset: number): number { return 0; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        const table: any = reader._readHeadTable();
        expect(table).toBeDefined();
        expect(fixedOffsets.length).toBe(2);
        expect(fixedOffsets[0]).toBe(40);
        expect(fixedOffsets[1]).toBe(40);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readHorizontalHeaderTable skips offset overwrite when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 75;
        reader._getTable = function (_name: string): any { return { _offset: null }; };
        const fixedOffsets: number[] = [];
        reader._readFixed = function (offset: number): number { fixedOffsets.push(offset); return 1; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt16 = function (_offset: number): number { return 0; };
        reader._readHorizontalHeaderTable();
        expect(fixedOffsets.length).toBe(1);
        expect(fixedOffsets[0]).toBe(75);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readHorizontalHeaderTable advances offset by ten bytes before metricDataFormat', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any { return { _offset: 100 }; };
        let int16CallCount: number = 0;
        let metricOffset: number;
        reader._readFixed = function (_offset: number): number {
            reader._offset = 104;
            return 1;
        };
        reader._readInt16 = function (offset: number): number {
            int16CallCount++;
            if (int16CallCount === 8) {
                metricOffset = offset;
            }
            reader._offset += 2;
            return 0;
        };
        reader._readUInt16 = function (_offset: number): number { reader._offset += 2; return 0; };
        reader._readHorizontalHeaderTable();
        expect(reader._offset).toBe(136);
        expect(metricOffset).toBeDefined();
        expect(metricOffset).toBeGreaterThan(100);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
});
describe('1038504 _readOS2Table table lookup', () => {
    it('1038504 _readOS2Table uses OS2 table name', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const requestedNames: string[] = [];
        reader._getTable = function (name: string): any { requestedNames.push(name); return { _offset: 0 }; };
        reader._readUInt16 = function (_offset: number): number { return 0; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readBytes = function (length: number): number[] { return new Array(length).fill(0); };
        reader._readOS2Table();
        expect(requestedNames.length).toBe(1);
        expect(requestedNames[0]).toBe('OS/2');
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readOS2Table uses table offset when available', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 5;
        reader._getTable = function (_name: string): any { return { _offset: 40 }; };
        const uint16Offsets: number[] = [];
        reader._readUInt16 = function (offset: number): number { uint16Offsets.push(offset); return 0; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readBytes = function (length: number): number[] { return new Array(length).fill(0); };
        reader._readOS2Table();
        expect(uint16Offsets[0]).toBe(40);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readOS2Table version one uses default values', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any { return { _offset: 0 }; };
        let uint16Count: number = 0;
        reader._readUInt16 = function (_offset: number): number {
            uint16Count++;
            if (uint16Count === 1) {
                return 1;
            }
            return 0;
        };
        reader._readInt16 = function (_offset: number): number { return 100; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readBytes = function (length: number): number[] { return new Array(length).fill(0); };
        const table: any = reader._readOS2Table();
        expect(table._sxHeight).toBe(0);
        expect(table._sCapHeight).toBe(0);
        expect(table._usDefaultChar).toBe(0);
        expect(table._usBreakChar).toBe(0);
        expect(table._usMaxContext).toBe(0);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readOS2Table version two reads extended values', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any { return { _offset: 0 }; };
        let uint16Count: number = 0;
        const extendedValues: number[] = [21, 22, 23, 24];
        reader._readUInt16 = function (_offset: number): number {
            uint16Count++;
            if (uint16Count === 1) { return 2; }
            if (extendedValues.length > 0) { return extendedValues.shift(); }
            return 0;
        };
        reader._readInt16 = function (_offset: number): number { return 20; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readBytes = function (length: number): number[] { return new Array(length).fill(0); };
        const table: any = reader._readOS2Table();
        expect(table._sxHeight).toBe(20);
        expect(table._sCapHeight).toBe(20);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readPostTable requests post table', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const requestedNames: string[] = [];
        reader._getTable = function (name: string): any { requestedNames.push(name); return { _offset: 0 }; };
        reader._readFixed = function (_offset: number): number { return 0; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readPostTable();
        expect(requestedNames.length).toBe(1);
        expect(requestedNames[0]).toBe('post');
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readPostTable requests post table', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const requestedNames: string[] = [];
        reader._getTable = function (name: string): any { requestedNames.push(name); return { _offset: 0 }; };
        reader._readFixed = function (_offset: number): number { return 0; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readPostTable();
        expect(requestedNames.length).toBe(1);
        expect(requestedNames[0]).toBe('post');
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readPostTable skips offset assignment when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 25;
        reader._getTable = function (_name: string): any { return { _offset: null }; };
        const fixedOffsets: number[] = [];
        reader._readFixed = function (offset: number): number { fixedOffsets.push(offset); return 1; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readPostTable();
        expect(fixedOffsets[0]).toBe(25);
        expect(fixedOffsets[1]).toBe(25);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readWidthTable uses hmtx table offset when available', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 10;
        reader._getTable = function (name: string): any { expect(name).toBe('hmtx'); return { _offset: 60 }; };
        const uint16Offsets: number[] = [];
        reader._readUInt16 = function (offset: number): number { uint16Offsets.push(offset); return 500; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        const result: number[] = reader._readWidthTable(1, 1000);
        expect(result.length).toBe(1);
        expect(uint16Offsets.length).toBe(1);
        expect(uint16Offsets[0]).toBe(60);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readWidthTable skips offset assignment when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 35;
        reader._getTable = function (_name: string): any { return { _offset: null }; };
        const uint16Offsets: number[] = [];
        reader._readUInt16 = function (offset: number): number { uint16Offsets.push(offset); return 500; };
        reader._readInt16 = function (_offset: number): number { return 0; };
        reader._readWidthTable(1, 1000);
        expect(uint16Offsets[0]).toBe(35);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readCmapTable uses cmap table offset when available', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 15;
        reader._getTable = function (name: string): any { expect(name).toBe('cmap'); return { _offset: 80 };};
        const uint16Offsets: number[] = [];
        let uint16CallCount: number = 0;
        reader._readUInt16 = function (offset: number): number {
            uint16Offsets.push(offset);
            uint16CallCount++;
            if (uint16CallCount === 1) {
                return 0;
            }
            if (uint16CallCount === 2) {
                return 0;
            }
            return 0;
        };
        reader._readUInt32 = function (_offset: number): number {return 0; };
        reader._readCmapSubTable = function (_subTable: any): void {};
        const result: any[] = reader._readCmapTable();
        expect(result.length).toBe(0);
        expect(uint16Offsets[0]).toBe(80);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readCmapTable skips offset assignment when table offset is null', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._offset = 45;
        reader._getTable = function (_name: string): any { return { _offset: null }; };
        const uint16Offsets: number[] = [];
        let uint16CallCount: number = 0;
        reader._readUInt16 = function (offset: number): number {
            uint16Offsets.push(offset);
            uint16CallCount++;
            if (uint16CallCount === 1) {
                return 0;
            }
            if (uint16CallCount === 2) {
                return 0;
            }
            return 0;
        };
        reader._readUInt32 = function (_offset: number): number { return 0};
        reader._readCmapSubTable = function (_subTable: any): void {};
        reader._readCmapTable();
        expect(uint16Offsets[0]).toBe(45);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readWidthTable uses hmtx table key', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const requestedKeys: string[] = [];
        reader._getTable = function (name: string): any { requestedKeys.push(name); return { _offset: 0 }; };
        reader._readUInt16 = function (_offset: number): number { return 1000; };
        reader._readInt16 = function (_offset: number): number {return 0;};
        const result: number[] = reader._readWidthTable(1, 1000);
        expect(result.length).toBe(1);
        expect(requestedKeys.length).toBe(1);
        expect(requestedKeys[0]).toBe('hmtx');
        expect(requestedKeys[0]).not.toBe('');
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readCmapTable uses cmap table key', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        const requestedKeys: string[] = [];
        reader._getTable = function (name: string): any { requestedKeys.push(name); return { _offset: 0 }; };
        let callCount: number = 0;
        reader._readUInt16 = function (_offset: number): number {
            callCount++;
            if (callCount === 1) {
                return 0;
            }
            if (callCount === 2) {
                return 0;
            }
            return 0;
        };
        reader._readUInt32 = function (_offset: number): number { return 0; };
        reader._readCmapSubTable = function (_subTable: any): void {};
        const result: any[] = reader._readCmapTable();
        expect(Array.isArray(result)).toBe(true);
        expect(requestedKeys.length).toBe(1);
        expect(requestedKeys[0]).toBe('cmap');
        expect(requestedKeys[0]).not.toBe('');
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
    it('1038504 _readWidthTable processes exact glyph count', () => {
        const originalInitialize: Function = (_TrueTypeReader as any).prototype._initialize;
        (_TrueTypeReader as any).prototype._initialize = function (): void {};
        const reader: any = new _TrueTypeReader(new Uint8Array([]));
        reader._getTable = function (_name: string): any { return { _offset: 0 }; };
        let advanceWidthReadCount: number = 0;
        let leftSideBearingReadCount: number = 0;
        reader._readUInt16 = function (_offset: number): number { advanceWidthReadCount++; return 500; };
        reader._readInt16 = function (_offset: number): number { leftSideBearingReadCount++; return 0; };
        const result: number[] = reader._readWidthTable(2, 1000);
        expect(result.length).toBe(2);
        expect(advanceWidthReadCount).toBe(2);
        expect(leftSideBearingReadCount).toBe(2);
        (_TrueTypeReader as any).prototype._initialize = originalInitialize;
    });
});
describe('1038504 _readAppleCmapTable mutations', () => {
    function createAppleCmapReader(): any {
        const reader: any = {
            _offset: 0,
            _maxMacIndex: undefined,
            _width: [100],
            _readCount: 0,
            _glyphCount: 0,
            _tableKey: '',
            _getTable(name: string): any {this._tableKey = name; return { _offset: 100 };},
            _readUInt16(offset: number): number { this._lastUInt16Offset = offset; this._offset += 2; return 1; },
            _readByte(offset: number): number { this._lastByteOffset = offset; this._readCount++; this._offset += 1; return 0; },
            _getWidth(index: number): number { return index; },
            _addGlyph(glyph: any, encoding: number): void { this._glyphCount++; }
        };
        reader._macintoshDictionary = {
            _values: {},
            setValue(key: number, value: any): void { this._values[key] = value; },
            containsKey(key: number): boolean { return typeof this._values[key] !== 'undefined'; },
            getValue(key: number): any { return this._values[key]; }
        };
        Object.defineProperty(reader, 'macintosh', { get(): any { return this._macintoshDictionary; } });
        return reader;
    }
    function createTrimmedReader(): any {
        const reader: any = {
            _offset: 0,
            _tableName: '',
            _firstOffsetRead: -1,
            _readUInt16Count: 0,
            _maxMacIndex: 0,
            _getTable(name: string): any { this._tableName = name; return { _offset: 100 }; },
            _readUInt16(offset: number): number {if (this._readUInt16Count === 0) { this._firstOffsetRead = offset; } this._readUInt16Count++; const values: number[] = [6, 12, 0, 30, 0 ]; return values[this._readUInt16Count - 1] || 0; },
            _getWidth(index: number): number { return index; },
            _addGlyph(_glyph: any, _encoding: number): void {},
            _macintoshDictionary: { setValue(_key: number, _value: any): void { } }
        };
        Object.defineProperty(reader, 'macintosh', {get(): any {return reader._macintoshDictionary;}});
        return reader;
    }
    function createCompactFontReader(): any {
        const reader: any = {
            _offset: 5,
            _tableName: '',
            _readBytesLength: -1,
            _getTable(name: string): any { this._tableName = name; return { _offset: 120, _length: 25 }; },
            _readBytes(length: number): number[] { this._readBytesLength = length; return [1, 2, 3]; }
        };
        return reader;
    }
    it('1038504 _readAppleCmapTable uses cmap table name', () => {
        const reader: any = createAppleCmapReader();
        const subTable: any = { _offset: 25 };
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader,subTable,0);
        expect(reader._tableKey).toBe('cmap');
        expect(reader._tableKey).not.toBe('');
    });
    it('1038504 _readAppleCmapTable uses addition for offset calculation', () => {
        const reader: any = createAppleCmapReader();
        const subTable: any = { _offset: 20 };
        let observedOffset: number = 0;
        reader._readUInt16 = (offset: number): number => {
            observedOffset = offset;
            reader._offset += 2;
            return 1;
        };
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader,subTable,0);
        expect(observedOffset).toBe(124);
        expect(observedOffset).not.toBe(80);
    });
    it('1038504 _readAppleCmapTable initializes maxMacIndex when undefined', () => {
        const reader: any = createAppleCmapReader();
        reader._maxMacIndex = undefined;
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader,{ _offset: 0, _platformID: 0, _encodingID: 0 },0);
        expect(reader._maxMacIndex).toBe(255);
    });
    it('1038504 _readAppleCmapTable initializes maxMacIndex when null', () => {
        const reader: any = createAppleCmapReader();
        reader._maxMacIndex = null;
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader, { _offset: 0, _platformID: 0, _encodingID: 0 }, 0);
        expect(reader._maxMacIndex).toBe(255);
    });
    it('1038504 _readAppleCmapTable preserves larger maxMacIndex value', () => {
        const reader: any = createAppleCmapReader();
        reader._maxMacIndex = 500;
        _TrueTypeReader.prototype._readAppleCmapTable.call( reader, { _offset: 0, _platformID: 0, _encodingID: 0 }, 0 );
        expect(reader._maxMacIndex).toBe(500);
        expect(reader._maxMacIndex).not.toBe(255);
    });
    it('1038504 _readAppleCmapTable processes exactly 256 glyphs', () => {
        const reader: any = createAppleCmapReader();
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader,{ _offset: 0, _platformID: 0, _encodingID: 0 },0);
        expect(reader._readCount).toBe(256);
        expect(reader._glyphCount).toBe(256);
    });
    it('1038504 _readAppleCmapTable stores first and last macintosh entries', () => {
        const reader: any = createAppleCmapReader();
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader, { _offset: 0, _platformID: 0, _encodingID: 0 }, 0);
        expect(reader.macintosh.containsKey(0)).toBe(true);
        expect(reader.macintosh.containsKey(255)).toBe(true);
    });
    it('1038504 _readAppleCmapTable does not create entry beyond 255', () => {
        const reader: any = createAppleCmapReader();
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader, { _offset: 0, _platformID: 0, _encodingID: 0 },0);
        expect(reader.macintosh.containsKey(256)).toBe(false);
    });
    it('1038504 _readAppleCmapTable updates final maxMacIndex to 255', () => {
        const reader: any = createAppleCmapReader();
        reader._maxMacIndex = 0;
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader, { _offset: 0, _platformID: 0, _encodingID: 0 }, 0 );
        expect(reader._maxMacIndex).toBe(255);
        expect(reader._maxMacIndex).not.toBe(254);
    });
    it('1038504 _readAppleCmapTable populates macintosh glyph collection', () => {
        const reader: any = createAppleCmapReader();
        _TrueTypeReader.prototype._readAppleCmapTable.call(reader,{ _offset: 0, _platformID: 0, _encodingID: 0 },0);
        expect(reader._readCount).toBe(256);
        expect(reader._glyphCount).toBe(256);
        expect(reader.macintosh.containsKey(0)).toBe(true);
        expect(reader.macintosh.containsKey(255)).toBe(true);
        expect(reader._maxMacIndex).toBe(255);
    });
    it('1038504 _readTrimmedCmapTable uses cmap table key', () => {
        const reader: any = createTrimmedReader();
        (_TrueTypeReader.prototype as any)._readTrimmedCmapTable.call(reader,{ _offset: 20 },0);
        expect(reader._tableName).toBe('cmap');
        expect(reader._tableName).not.toBe('');
        expect(reader._firstOffsetRead).toBe(120);
        expect(reader._firstOffsetRead).not.toBe(80);
    });
    it('1038504 _readCompactFontFormatTable uses CFF table key', () => {
        const reader: any = createCompactFontReader();
        const result: number[] = (_TrueTypeReader.prototype as any)._readCompactFontFormatTable.call(reader);
        expect(result).toBeDefined();
        expect(reader._tableName).toBe('CFF ');
        expect(reader._tableName).not.toBe('');
    });
    it('1038504 _readCompactFontFormatTable updates offset from table information', () => {
        const reader: any = createCompactFontReader();
        (_TrueTypeReader.prototype as any)._readCompactFontFormatTable.call(reader);
        expect(reader._offset).toBe(120);
        expect(reader._offset).not.toBe(5);
    });
    it('1038504 _readCompactFontFormatTable skips offset update when table offset undefined', () => {
        const reader: any = {
            _offset: 50,
            _getTable(_name: string): any { return { _offset: undefined, _length: 10 }; },
            _readBytes(length: number): number[] { expect(length).toBe(10); return []; }
        };
        (_TrueTypeReader.prototype as any)._readCompactFontFormatTable.call(reader);
        expect(reader._offset).toBe(50);
    });
    function createFontNameReader(): any {
        const reader: any = { _metrics: {_fontFamily: undefined,_postScriptName: undefined}};
        reader._initializeFontName = _TrueTypeReader.prototype._initializeFontName;
        return reader;
    }
    it('1038504 assigns font family when nameID is 1', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = {
            _recordsCount: 1,
            _nameRecords: [{_nameID: 1,_name: 'FontFamilyValue'}]
        };
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FontFamilyValue');
        expect(reader._metrics._postScriptName).toBeUndefined();
    });
    it('1038504 assigns post script name when nameID is 6', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = { _recordsCount: 1, _nameRecords: [{ _nameID: 6, _name: 'PostScriptValue'}]};
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBeUndefined();
        expect(reader._metrics._postScriptName).toBe('PostScriptValue');
    });
    it('1038504 does not iterate beyond records count', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = {_recordsCount: 1, _nameRecords: [ {_nameID: 1, _name: 'FamilyName'}]};
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FamilyName');
        expect(reader._metrics._postScriptName).toBeUndefined();
    });
    it('1038504 continues searching when only font family exists', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = {
            _recordsCount: 3,
            _nameRecords: [
                {_nameID: 1,_name: 'FamilyValue'},
                {_nameID: 2,_name: 'IgnoredValue'},
                {_nameID: 6,_name: 'PostScriptValue'}
            ]
        };
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FamilyValue');
        expect(reader._metrics._postScriptName).toBe('PostScriptValue');
    });
    it('1038504 continues searching when only post script name exists initially', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = {
            _recordsCount: 3,
            _nameRecords: [
                {_nameID: 6,_name: 'PostScriptValue'},
                {_nameID: 2,_name: 'IgnoredValue'},
                { _nameID: 1,_name: 'FamilyValue'}
            ]
        };
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FamilyValue');
        expect(reader._metrics._postScriptName).toBe('PostScriptValue');
    });
    it('1038504 stops processing records after both names are resolved', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = {
            _recordsCount: 4,
            _nameRecords: [
                { _nameID: 1, _name: 'FirstFamily'},
                { _nameID: 6, _name: 'FirstPostScript'},
                { _nameID: 1, _name: 'OverwrittenFamily'},
                { _nameID: 6, _name: 'OverwrittenPostScript'}
            ]};
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FirstFamily');
        expect(reader._metrics._postScriptName).toBe('FirstPostScript');
        expect(reader._metrics._fontFamily).not.toBe('OverwrittenFamily');
        expect(reader._metrics._postScriptName).not.toBe('OverwrittenPostScript');
    });
    it('1038504 resolves both names when records are adjacent', () => {
        const reader: any = createFontNameReader();
        const nameTable: any = { _recordsCount: 2, _nameRecords: [ { _nameID: 1, _name: 'FamilyValue' },{ _nameID: 6, _name: 'PostScriptValue' } ] };
        reader._initializeFontName(nameTable);
        expect(reader._metrics._fontFamily).toBe('FamilyValue');
        expect(reader._metrics._postScriptName).toBe('PostScriptValue');
    });
    it('1038504 _getTable returns empty table when key is absent', () => {
        const reader: any = {};
        reader._getTable = _TrueTypeReader.prototype._getTable;
        const tableDirectory: any = {
            containsKey: (_name: string): boolean => false,
            getValue: (_name: string): any => {
                return { _offset: 100};
            }
        };
        reader._tableDirectory = tableDirectory;
        const result: any = reader._getTable('name');
        expect(result).toBeDefined();
        expect(result._offset).toBeUndefined();
    });
    it('1038504 _getTable returns empty table when value is null', () => {
        const reader: any = {};
        reader._getTable = _TrueTypeReader.prototype._getTable;
        const tableDirectory: any = {
            containsKey: (_name: string): boolean => true,
            getValue: (_name: string): any => null
        };
        reader._tableDirectory = tableDirectory;
        const result: any = reader._getTable('name');
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        expect(result._offset).toBeUndefined();
    });
    it('1038504 _getTable returns stored table when key exists', () => {
        const reader: any = {};
        reader._getTable = _TrueTypeReader.prototype._getTable;
        const expectedTable: any = new _TrueTypeTableInfo();
        expectedTable._offset = 250;
        expectedTable._length = 500;
        const tableDirectory: any = {containsKey: (_name: string): boolean => true, getValue: (_name: string): any => expectedTable};
        reader._tableDirectory = tableDirectory;
        const result: any = reader._getTable('name');
        expect(result).toBe(expectedTable);
        expect(result._offset).toBe(250);
        expect(result._length).toBe(500);
    });
    it('1038504 _getTable does not assign undefined value', () => {
        const reader: any = {};
        reader._getTable = _TrueTypeReader.prototype._getTable;
        const tableDirectory: any = {containsKey: (_name: string): boolean => true, getValue: (_name: string): any => undefined};
        reader._tableDirectory = tableDirectory;
        const result: any = reader._getTable('name');
        expect(result).toBeDefined();
        expect(result._offset).toBeUndefined();
    });
});
describe('1038504 _getWidth boundary mutation', () => {
    it('1038504 _getWidth uses last width entry when glyph code equals width length', () => {
        const reader: any = {};
        reader._getWidth = _TrueTypeReader.prototype._getWidth;
        reader._width = [100, 200, 300];
        const result: number = reader._getWidth(3);
        expect(result).toBe(300);
        expect(result).not.toBeUndefined();
    });
    it('1038504 returns symbol only for microsoft undefined encoding', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(_TrueTypePlatformID.microsoft,_TrueTypeMicrosoftEncodingID.undefined);
        expect(result).toBe(_TrueTypeCmapEncoding.symbol);
        expect(result).not.toBe(_TrueTypeCmapEncoding.unicode);
        expect(result).not.toBe(_TrueTypeCmapEncoding.macintosh);
    });
    it('1038504 does not return symbol for non microsoft platform with undefined encoding', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(_TrueTypePlatformID.macintosh, _TrueTypeMicrosoftEncodingID.undefined);
        expect(result).toBe(_TrueTypeCmapEncoding.macintosh);
        expect(result).not.toBe(_TrueTypeCmapEncoding.symbol);
    });
    it('1038504 returns unicode for microsoft unicode encoding', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(_TrueTypePlatformID.microsoft, _TrueTypeMicrosoftEncodingID.unicode);
        expect(result).toBe(_TrueTypeCmapEncoding.unicode);
        expect(result).not.toBe(_TrueTypeCmapEncoding.symbol);
    });
    it('1038504 does not return unicode for macintosh platform using unicode encoding value', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(_TrueTypePlatformID.macintosh,_TrueTypeMicrosoftEncodingID.unicode);
        expect(result).toBe(_TrueTypeCmapEncoding.unknown);
        expect(result).not.toBe(_TrueTypeCmapEncoding.unicode);
    });
    it('1038504 returns macintosh for macintosh roman encoding', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(_TrueTypePlatformID.macintosh,_TrueTypeMacintoshEncodingID.roman);
        expect(result).toBe(_TrueTypeCmapEncoding.macintosh);
        expect(result).not.toBe(_TrueTypeCmapEncoding.symbol);
        expect(result).not.toBe(_TrueTypeCmapEncoding.unicode);
    });
    it('1038504 returns unknown for unsupported platform and encoding', () => {
        const reader: any = {};
        reader._getCmapEncoding = _TrueTypeReader.prototype._getCmapEncoding;
        const result: number = reader._getCmapEncoding(999, 999);
        expect(result).toBe(_TrueTypeCmapEncoding.unknown);
    });
});
describe('1038504 _addGlyph mutations', () => {
    function makeInitializeMetricsHarness(): {reader: any;nameTable: any;headTable: any;horizontalHeadTable: any;os2Table: any;postTable: any;cmapTables: any[];} {
        const reader: any = {
            _metrics: {},
            _tableDirectory: { containsKey: (key: string): boolean => key === 'CFF ' },
            _initializeFontName: (table: any): void => { reader._fontNameTable = table; },
            _updateWidth: (): number[] => [100, 200, 300],
            _getCmapEncoding: (platformID: number, encodingID: number): number => { if (platformID === 3 && encodingID === 0) { return _TrueTypeCmapEncoding.symbol; } return _TrueTypeCmapEncoding.unicode;}
        };
        reader._initializeMetrics = _TrueTypeReader.prototype._initializeMetrics;
        const nameTable: any = {};
        const headTable: any = {_macStyle: 3,_unitsPerEm: 1000,_xMin: -50,_xMax: 900};
        const horizontalHeadTable: any = {_ascender: 800,_descender: -200,_lineGap: 25};
        const os2Table: any = {_sTypoAscender: 700,_sTypoDescender: -300,_sTypoLineGap: 100,_sCapHeight: 600,_ySubscriptYSize: 500,_ySuperscriptYSize: 250};
        const postTable: any = {_isFixedPitch: 1,_italicAngle: -12};
        const cmapTables: any[] = [{_platformID: 3,_encodingID: 0}];
        return {reader,nameTable,headTable,horizontalHeadTable,os2Table,postTable,cmapTables};
    }
    it('1038504 _addGlyph stores glyph in microsoft collection for unicode encoding', () => {
        const storedValues: any[] = [];
        const reader: any = {
            _microsoftGlyphs: { setValue: (key: number, value: any): void => {storedValues.push(key); storedValues.push(value);}},
            _macintoshGlyphs: { setValue: (): void => undefined}
        };
        reader._addGlyph = _TrueTypeReader.prototype._addGlyph;
        const glyph: any = {_index: 25};
        reader._addGlyph(glyph,_TrueTypeCmapEncoding.unicode);
        expect(storedValues.length).toBe(2);
        expect(storedValues[0]).toBe(25);
        expect(storedValues[1]).toBe(glyph);
    });
    it('1038504 _addGlyph stores glyph in macintosh collection for symbol encoding', () => {
        let storedKey: number;
        let storedGlyph: any;
        const reader: any = {
            _microsoftGlyphs: {setValue: (): void => undefined},
            _macintoshGlyphs: {setValue: (key: number, value: any): void => {storedKey = key;storedGlyph = value;}}
        };
        reader._addGlyph = _TrueTypeReader.prototype._addGlyph;
        const glyph: any = {_index: 11};
        reader._addGlyph(glyph,_TrueTypeCmapEncoding.symbol);
        expect(storedKey).toBe(11);
        expect(storedGlyph).toBe(glyph);
    });
    it('1038504 _addGlyph skips when glyph is undefined', () => {
        let callCount: number = 0;
        const reader: any = {
            _microsoftGlyphs: {setValue: (): void => {callCount++;}},
            _macintoshGlyphs: {setValue: (): void => {callCount++;}}
        };
        reader._addGlyph = _TrueTypeReader.prototype._addGlyph;
        reader._addGlyph(undefined, _TrueTypeCmapEncoding.unicode);
        expect(callCount).toBe(0);
    });
    it('1038504 _addGlyph skips when index is undefined', () => {
        let callCount: number = 0;
        const reader: any = {
            _microsoftGlyphs: {setValue: (): void => {callCount++;}},
            _macintoshGlyphs: {setValue: (): void => {callCount++;}}
        };
        reader._addGlyph = _TrueTypeReader.prototype._addGlyph;
        const glyph: any = {};
        reader._addGlyph(glyph, _TrueTypeCmapEncoding.unicode);
        expect(callCount).toBe(0);
    });
    it('1038504 _initializeMetrics sets symbol flag when symbol cmap exists', () => {
        const {reader, nameTable, headTable,horizontalHeadTable, os2Table,postTable, cmapTables} = makeInitializeMetricsHarness();
        reader._initializeMetrics(nameTable,headTable,horizontalHeadTable,os2Table,postTable,cmapTables);
        expect(reader._metrics._isSymbol).toBe(true);
    });
    it('1038504 _initializeMetrics does not set symbol flag when symbol cmap absent', () => {
        const {reader, nameTable, headTable,horizontalHeadTable, os2Table,postTable} = makeInitializeMetricsHarness();
        const cmapTables: any[] = [{ _platformID: 1, _encodingID: 1}];
        reader._getCmapEncoding = (): number => { return _TrueTypeCmapEncoding.unicode;};
        reader._initializeMetrics(nameTable,headTable,horizontalHeadTable,os2Table,postTable,cmapTables);
        expect(reader._metrics._isSymbol).toBe(false);
    });
    it('1038504 _initializeMetrics does not set symbol flag when symbol cmap absent', () => {
        const {reader, nameTable, headTable,horizontalHeadTable, os2Table,postTable} = makeInitializeMetricsHarness();
        const cmapTables: any[] = [{ _platformID: 1,_encodingID: 1}];
        reader._getCmapEncoding = (): number => { return _TrueTypeCmapEncoding.unicode;};
        reader._initializeMetrics(nameTable,headTable,horizontalHeadTable,os2Table,postTable,cmapTables);
        expect(reader._metrics._isSymbol).toBe(false);
    });
    it('1038504 _initializeMetrics sets fixed pitch true for non zero value', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.postTable._isFixedPitch = 1;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._isFixedPitch).toBe(true);
    });
    it('1038504 _initializeMetrics sets fixed pitch true for non zero value', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.postTable._isFixedPitch = 1;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._isFixedPitch).toBe(true);
    });
    it('1038504 _initializeMetrics computes win ascent using multiplication', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.headTable._unitsPerEm = 2000;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._winAscent).toBe(350);
    });
    it('1038504 _initializeMetrics uses explicit cap height when available', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.os2Table._sCapHeight = 600;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._capHeight).toBe(600);
    });
    it('1038504 _initializeMetrics uses explicit cap height when available', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.os2Table._sCapHeight = 600;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._capHeight).toBe(600);
    });
    it('1038504 _initializeMetrics computes descent values using multiplication', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.headTable._unitsPerEm = 2000;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._winDescent).toBe(-150);
        expect(harness.reader._metrics._macDescent).toBe(-100);
    });
    it('1038504 _initializeMetrics creates font box with calculated bounds', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._fontBox.length).toBe(4);
        expect(harness.reader._metrics._fontBox[0]).toBe(-50);
        expect(harness.reader._metrics._fontBox[1]).toBe(825);
        expect(harness.reader._metrics._fontBox[2]).toBe(900);
        expect(harness.reader._metrics._fontBox[3]).toBe(-200);
    });
    it('1038504 _initializeMetrics creates font box with calculated bounds', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._fontBox.length).toBe(4);
        expect(harness.reader._metrics._fontBox[0]).toBe(-50);
        expect(harness.reader._metrics._fontBox[1]).toBe(825);
        expect(harness.reader._metrics._fontBox[2]).toBe(900);
        expect(harness.reader._metrics._fontBox[3]).toBe(-200);
    });
    it('1038504 _initializeMetrics computes script size factors using division', () => {
        const harness: any = makeInitializeMetricsHarness();
        harness.headTable._unitsPerEm = 1000;
        harness.os2Table._ySubscriptYSize = 500;
        harness.os2Table._ySuperscriptYSize = 250;
        harness.reader._initializeMetrics(harness.nameTable,harness.headTable,harness.horizontalHeadTable,harness.os2Table,harness.postTable,harness.cmapTables);
        expect(harness.reader._metrics._subScriptSizeFactor).toBe(2);
        expect(harness.reader._metrics._superscriptSizeFactor).toBe(4);
    });
    it('1038504 _updateWidth returns exactly 256 entries', () => {
        const reader: any = { _metrics: { _isSymbol: true}};
        reader._getGlyph = (_value: string): any => ({_empty: false,_width: 10});
        reader._updateWidth = _TrueTypeReader.prototype._updateWidth;
        const result: number[] = reader._updateWidth();
        expect(result.length).toBe(256);
    });
    it('1038504 _updateWidth symbol branch does not write beyond last index', () => {
        const reader: any = { _metrics: { _isSymbol: true}};
        reader._getGlyph = (_value: string): any => ({_empty: false,_width: 5});
        reader._updateWidth = _TrueTypeReader.prototype._updateWidth;
        const result: number[] = reader._updateWidth();
        expect(result[255]).toBe(5);
        expect(result.length).toBe(256);
    });
    it('1038504 _updateWidth uses single byte buffer for getString', () => {
        const observedLengths: number[] = [];
        const reader: any = {_metrics: { _isSymbol: false}};
        reader._getString = (bytes: number[],start: number,length: number): string => {observedLengths.push(length);return 'A';};
        reader._getGlyph = (_value: string): any => ({_empty: false,_width: 12});
        reader._updateWidth = _TrueTypeReader.prototype._updateWidth;
        reader._updateWidth();
        expect(observedLengths[0]).toBe(1);
    });
    it('1038504 _updateWidth non symbol branch returns 256 widths', () => {
        const reader: any = {_metrics: { _isSymbol: false}};
        reader._getString = (): string => 'A';
        reader._getGlyph = (_value: string): any => ({_empty: false,_width: 20});
        reader._updateWidth = _TrueTypeReader.prototype._updateWidth;
        const result: number[] = reader._updateWidth();
        expect(result.length).toBe(256);
        expect(result[255]).toBe(20);
    });
});
describe('1038504 _getString mutations', () => {
    function createReadFontProgramHarness(): any {
        const reader: any = { _bIsLocaShort: true, _missedGlyphs: 0};
        reader._readFontProgram = _TrueTypeReader.prototype._readFontProgram;
        reader._readLocaTable = (_value: boolean): any => {return { _offsets: [0] };};
        reader._updateGlyphChars = (_glyphChars: any, _locaTable: any): void => {};
        reader._generateGlyphTable = ( _glyphChars: any, _locaTable: any, _arg1: any, _arg2: any ): any => { return { glyphTableSize: 10, newLocaTable: [1, 2], newGlyphTable: [5, 6] }; };
        reader._updateLocaTable = ( _newLocaTable: any, _isShort: boolean ): any => { return {newLocaSize: 20,newLocaUpdated: [9, 8]};};
        reader._getFontProgram = (_newLocaUpdated: any,_newGlyphTable: any,_glyphTableSize: number,_newLocaSize: number): any => {return [100, 200];};
        return reader;
    }
    it('1038504 _getString returns expected string for single character', () => {
        const reader: any = {};
        reader._getString = _TrueTypeReader.prototype._getString;
        const result: string = reader._getString([65], 0, 1);
        expect(result).toBe('A');
        expect(result.length).toBe(1);
    });
    it('1038504 _getString returns expected string for multiple characters', () => {
        const reader: any = {};
        reader._getString = _TrueTypeReader.prototype._getString;
        const result: string = reader._getString([65, 66, 67], 0, 3);
        expect(result).toBe('ABC');
        expect(result.length).toBe(3);
    });
    it('1038504 _getString respects start offset', () => {
        const reader: any = {};
        reader._getString = _TrueTypeReader.prototype._getString;
        const result: string = reader._getString([88, 65, 66, 67], 1, 3);
        expect(result).toBe('ABC');
        expect(result).not.toBe('XAB');
    });
    it('1038504 _getString returns empty string when length is zero', () => {
        const reader: any = {};
        reader._getString = _TrueTypeReader.prototype._getString;
        const result: string = reader._getString([65, 66, 67], 0, 0);
        expect(result).toBe('');
        expect(result.length).toBe(0);
    });
    it('1038504 _setOffset updates offset value', () => {
        const reader: any = {_offset: 10};
        reader._setOffset = _TrueTypeReader.prototype._setOffset;
        reader._setOffset(250);
        expect(reader._offset).toBe(250);
        expect(reader._offset).not.toBe(10);
    });
    it('1038504 _readFontProgram returns font program', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = {_size: (): number => 1};
        reader._getGlyphChars = (_chars: any): any => glyphChars;
        const chars: any = {_size: (): number => 1};
        const result: any = reader._readFontProgram(chars);
        expect(result).toEqual([100, 200]);
    });
    it('1038504 _readFontProgram does not update missed glyphs when sizes are equal', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = {_size: (): number => 5};
        const chars: any = {_size: (): number => 5};
        reader._getGlyphChars = (): any => glyphChars;
        reader._readFontProgram(chars);
        expect(reader._missedGlyphs).toBe(0);
    });
    it('1038504 _readFontProgram updates missed glyphs when glyph count is lower', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = {_size: (): number => 2};
        const chars: any = {_size: (): number => 5};
        reader._getGlyphChars = (): any => glyphChars;
        reader._readFontProgram(chars);
        expect(reader._missedGlyphs).toBe(3);
    });
    it('1038504 _readFontProgram skips missed glyph calculation when counts match', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = {_size: (): number => 4};
        const chars: any = {_size: (): number => 4};
        reader._getGlyphChars = (): any => glyphChars;
        reader._readFontProgram(chars);
        expect(reader._missedGlyphs).toBe(0);
    });
    it('1038504 _readFontProgram does not update missed glyphs when glyph count exceeds char count', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = {_size: (): number => 6};
        const chars: any = {_size: (): number => 3};
        reader._getGlyphChars = (): any => glyphChars;
        reader._readFontProgram(chars);
        expect(reader._missedGlyphs).toBe(0);
    });
    it('1038504 _readFontProgram calculates missed glyph count using subtraction', () => {
        const reader: any = createReadFontProgramHarness();
        const glyphChars: any = { _size: (): number => 2 };
        const chars: any = { _size: (): number => 5};
        reader._getGlyphChars = (_chars: any): any => glyphChars;
        reader._readFontProgram(chars);
        expect(reader._missedGlyphs).toBe(3);
        expect(reader._missedGlyphs).not.toBe(7);
    });
});
describe('1038504 _generateGlyphTable mutation coverage', () => {
    function createGlyphTableHarness(): any {
        const reader: any = {
            _offset: 0,
            _align: (value: number): number => value,
            _getTable: (name: string): any => {return { _offset: name === 'glyf' ? 100 : 999 };},
            _read: (buffer: number[], index: number, count: number): any => {
                for (let i: number = 0; i < count; i++) {
                    buffer[index + i] = i + 1;
                }
                return { buffer, written: count };
            }
        };
        return reader;
    }
    it('1038504 initializes loca and glyph tables correctly', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [0, 4]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, ['old-value'], ['old-value']);
        expect(Array.isArray(result.newLocaTable)).toBe(true);
        expect(Array.isArray(result.newGlyphTable)).toBe(true);
        expect(result.newLocaTable.indexOf('Stryker was here')).toBe(-1);
        expect(result.newGlyphTable.indexOf('Stryker was here')).toBe(-1);
    });
    it('1038504 sorts glyphs before processing', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [2, 0]};
        const locaTable: any = {_offsets: [0, 4, 10, 18]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.glyphTableSize).toBe(12);
        expect(result.newLocaTable[0]).toBe(0);
        expect(result.newLocaTable[2]).toBe(4);
    });
    it('1038504 calculates glyph size using every active glyph', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = { keys: (): number[] => [0, 1]};
        const locaTable: any = { _offsets: [0, 4, 10]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.glyphTableSize).toBe(10);
    });
    it('1038504 skips glyph size accumulation when offsets array is empty', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: []};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.glyphTableSize).toBe(0);
        expect(result.newGlyphTable.length).toBe(0);
    });
    it('1038504 allocates glyph table using aligned glyph size', () => {
        const reader: any = createGlyphTableHarness();
        reader._align = (_value: number): number => 8;
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [0, 4]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.newGlyphTable.length).toBe(8);
    });
    it('1038504 reads glyf table using exact table name', () => {
        const requestedTables: string[] = [];
        const reader: any = createGlyphTableHarness();
        reader._getTable = (name: string): any => {
            requestedTables.push(name);
            return { _offset: 100 };
        };
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = { _offsets: [0, 4]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(requestedTables.length).toBe(1);
        expect(requestedTables[0]).toBe('glyf');
    });
    it('1038504 iterates through complete loca table', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [0, 4, 10, 18]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.newLocaTable.length).toBe(4);
    });
    it('1038504 copies glyph bytes and updates offsets', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0, 1]};
        const locaTable: any = {_offsets: [0, 4, 10]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.newLocaTable[0]).toBe(0);
        expect(result.newLocaTable[1]).toBe(4);
        expect(result.newGlyphTable[0]).toBe(1);
        expect(result.newGlyphTable[4]).toBe(1);
    });
    it('1038504 updates reader offset using glyf table offset', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [5, 9]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(reader._offset).toBe(105);
    });
    it('1038504 processes only active glyph indices', () => {
        const reader: any = createGlyphTableHarness();
        let readCount: number = 0;
        reader._read = (buffer: number[], index: number, count: number): any => {
            readCount++;
            for (let i: number = 0; i < count; i++) {
                buffer[index + i] = 9;
            }
            return { buffer, written: count };
        };
        const glyphChars: any = {keys: (): number[] => [1]};
        const locaTable: any = {_offsets: [0, 4, 8]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(readCount).toBe(1);
    });
    it('1038504 skips glyphs not present in active glyph collection', () => {
        const reader: any = createGlyphTableHarness();
        let readCount: number = 0;
        reader._read = (buffer: number[], index: number, count: number): any => { readCount++; return { buffer, written: count };};
        const glyphChars: any = {keys: (): number[] => [2]};
        const locaTable: any = {_offsets: [0, 4, 8, 12]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(readCount).toBe(1);
    });
    it('1038504 advances active glyph index after processing glyph', () => {
        const reader: any = createGlyphTableHarness();
        let readCount: number = 0;
        reader._read = (buffer: number[], index: number, count: number): any => { readCount++; return { buffer, written: count };};
        const glyphChars: any = {keys: (): number[] => [0, 1]};
        const locaTable: any = {_offsets: [0, 4, 8]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(readCount).toBe(2);
    });
    it('1038504 computes next glyph offset using following loca entry', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [1]};
        const locaTable: any = {_offsets: [0, 2, 10]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.glyphTableSize).toBe(8);
        expect(result.newLocaTable[1]).toBe(0);
    });
    it('1038504 reads glyph data only when glyph length is positive', () => {
        const reader: any = createGlyphTableHarness();
        let readCount: number = 0;
        reader._read = (buffer: number[], index: number, count: number): any => {
            readCount++;
            return { buffer, written: count };
        };
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [4, 4]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(readCount).toBe(0);
    });
    it('1038504 reads glyph data when glyph length is greater than zero', () => {
        const reader: any = createGlyphTableHarness();
        let readCount: number = 0;
        reader._read = (buffer: number[], index: number, count: number): any => {
            readCount++;
            return { buffer, written: count };
        };
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [0, 5]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(readCount).toBe(1);
    });
    it('1038504 uses table offset plus glyph offset', () => {
        const reader: any = createGlyphTableHarness();
        let recordedOffset: number = -1;
        reader._read = (buffer: number[], index: number, count: number): any => { recordedOffset = reader._offset; return { buffer, written: count };};
        const glyphChars: any = {keys: (): number[] => [0]};
        const locaTable: any = {_offsets: [5, 9]};
        _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(recordedOffset).toBe(105);
    });
    it('1038504 accumulates next glyph offset after each glyph copy', () => {
        const reader: any = createGlyphTableHarness();
        const glyphChars: any = {keys: (): number[] => [0, 1]};
        const locaTable: any = {_offsets: [0, 4, 10]};
        const result: any = _TrueTypeReader.prototype._generateGlyphTable.call( reader, glyphChars, locaTable, [], []);
        expect(result.newLocaTable[0]).toBe(0);
        expect(result.newLocaTable[1]).toBe(4);
    });
    function createReadLocaTableHarness(): any {
        return {
            _offset: 0,
            _getTable: (name: string): any => { return { _name: name, _offset: 20, _length: 4 }; },
            _readUInt16: (_offset: number): number => 5,
            _readUInt32: (_offset: number): number => 100
        };
    }
    it('1038504 uses loca table name', () => {
        const requestedNames: string[] = [];
        const reader: any = createReadLocaTableHarness();
        reader._getTable = (name: string): any => {requestedNames.push(name); return { _offset: 20, _length: 4};};
        _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(requestedNames.length).toBe(1);
        expect(requestedNames[0]).toBe('loca');
    });
    it('1038504 short format initializes offsets collection', () => {
        const reader: any = createReadLocaTableHarness();
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(Array.isArray(result._offsets)).toBe(true);
        expect(result._offsets.indexOf('Stryker was here')).toBe(-1);
    });
    it('1038504 short format reads ushort values', () => {
        const reader: any = createReadLocaTableHarness();
        reader._getTable = (_name: string): any => { return { _offset: 20, _length: 4};};
        reader._readUInt16 = (_offset: number): number => 5;
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(result._offsets.length).toBe(2);
        expect(result._offsets[0]).toBe(10);
        expect(result._offsets[1]).toBe(10);
    });
    it('1038504 short format uses length divided by two', () => {
        const reader: any = createReadLocaTableHarness();
        let readCount: number = 0;
        reader._getTable = (_name: string): any => {return { _offset: 20, _length: 6 }; };
        reader._readUInt16 = (_offset: number): number => { readCount++; return 1;};
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(readCount).toBe(3);
        expect(result._offsets.length).toBe(3);
    });
    it('1038504 short format does not execute uint32 branch', () => {
        const reader: any = createReadLocaTableHarness();
        let ushortCalls: number = 0;
        let uint32Calls: number = 0;
        reader._readUInt16 = (_offset: number): number => { ushortCalls++; return 1;};
        reader._readUInt32 = (_offset: number): number => {  uint32Calls++; return 100;};
        _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(ushortCalls).toBeGreaterThan(0);
        expect(uint32Calls).toBe(0);
    });
    it('1038504 short format multiplies ushort values by two', () => {
        const reader: any = createReadLocaTableHarness();
        reader._readUInt16 = (_offset: number): number => 8;
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(result._offsets[0]).toBe(16);
        expect(result._offsets[0]).not.toBe(4);
    });
    it('1038504 long format initializes offsets collection', () => {
        const reader: any = createReadLocaTableHarness();
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, false);
        expect(Array.isArray(result._offsets)).toBe(true);
        expect(result._offsets.indexOf('Stryker was here')).toBe(-1);
    });
    it('1038504 long format reads uint32 values', () => {
        const reader: any = createReadLocaTableHarness();
        let ushortCalls: number = 0;
        let uint32Calls: number = 0;
        reader._readUInt16 = (_offset: number): number => { ushortCalls++; return 1;};
        reader._readUInt32 = (_offset: number): number => { uint32Calls++; return 50;};
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, false);
        expect(uint32Calls).toBe(1);
        expect(ushortCalls).toBe(0);
        expect(result._offsets[0]).toBe(50);
    });
    it('1038504 long format uses length divided by four', () => {
        const reader: any = createReadLocaTableHarness();
        let uint32Calls: number = 0;
        reader._getTable = (_name: string): any => {return { _offset: 20, _length: 12 }; };
        reader._readUInt32 = (_offset: number): number => { uint32Calls++; return 100;};
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, false);
        expect(uint32Calls).toBe(3);
        expect(result._offsets.length).toBe(3);
    });
    it('1038504 assigns table offset to reader offset', () => {
        const reader: any = createReadLocaTableHarness();
        reader._getTable = (_name: string): any => { return { _offset: 123, _length: 4 }; };
        _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(reader._offset).toBe(123);
    });
    it('1038504 short format loop executes exact iteration count', () => {
        const reader: any = createReadLocaTableHarness();
        reader._getTable = (_name: string): any => { return { _offset: 20, _length: 2 }; };
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, true);
        expect(result._offsets.length).toBe(1);
    });
    it('1038504 long format loop executes exact iteration count', () => {
        const reader: any = createReadLocaTableHarness();
        reader._getTable = (_name: string): any => { return { _offset: 20, _length: 4 }; };
        const result: any = _TrueTypeReader.prototype._readLocaTable.call(reader, false);
        expect(result._offsets.length).toBe(1);
    });
    it('1038504 adds glyph zero when absent', () => {
        const glyphChars: any = {
            containsKey: (key: number): boolean => key !== 0,
            keys: (): number[] => [5],
            getValue: (_key: number): number => 10,
            setValueCalls: [] as number[][],
            setValue: function(key: number, value: number): void {
                this.setValueCalls.push([key, value]);
            }
        };
        let processedCount: number = 0;
        const reader: any = { _processCompositeGlyph: ( _glyphChars: any, _glyph: number, _locaTable: any): void => { processedCount++; } };
        const locaTable: any = {};
        _TrueTypeReader.prototype._updateGlyphChars.call( reader, glyphChars, locaTable);
        expect(glyphChars.setValueCalls.length).toBe(1);
        expect(glyphChars.setValueCalls[0][0]).toBe(0);
        expect(glyphChars.setValueCalls[0][1]).toBe(0);
        expect(processedCount).toBe(1);
    });
    it('1038504 does not add glyph zero when already present', () => {
        const glyphChars: any = {
            containsKey: (_key: number): boolean => true,
            keys: (): number[] => [0, 5],
            getValue: (_key: number): number => 10,
            setValueCalls: [] as number[][],
            setValue: function(key: number, value: number): void {
                this.setValueCalls.push([key, value]);
            }
        };
        const reader: any = { _processCompositeGlyph: ( _glyphChars: any, _glyph: number, _locaTable: any): void => { } };
        _TrueTypeReader.prototype._updateGlyphChars.call( reader, glyphChars, {});
        expect(glyphChars.setValueCalls.length).toBe(0);
    });
    it('1038504 processes every glyph key returned by keys collection', () => {
        const glyphChars: any = {
            containsKey: (_key: number): boolean => true,
            keys: (): number[] => [1, 3, 5],
            getValue: (_key: number): number => 99,
            setValue: (_key: number, _value: number): void => {}
        };
        const processedKeys: number[] = [];
        const reader: any = { _processCompositeGlyph: ( _glyphChars: any, glyph: number, _locaTable: any): void => { processedKeys.push(glyph); } };
        _TrueTypeReader.prototype._updateGlyphChars.call( reader, glyphChars, {});
        expect(processedKeys.length).toBe(3);
        expect(processedKeys[0]).toBe(1);
        expect(processedKeys[1]).toBe(3);
        expect(processedKeys[2]).toBe(5);
    });
    it('1038504 invokes composite glyph processing for each key exactly once', () => {
        const glyphChars: any = {
            containsKey: (_key: number): boolean => true,
            keys: (): number[] => [2, 4],
            getValue: (_key: number): number => 7,
            setValue: (_key: number, _value: number): void => {}
        };
        let callCount: number = 0;
        const reader: any = { _processCompositeGlyph: ( _glyphChars: any, _glyph: number, _locaTable: any): void => { callCount++; } };
        _TrueTypeReader.prototype._updateGlyphChars.call( reader, glyphChars, {});
        expect(callCount).toBe(2);
    });
});
describe('1038504 _processCompositeGlyph mutation coverage', () => {
    it('1038504 skips processing when glyph equals last offset index', () => {
        const glyphChars: any = {containsKey: (_key: number): boolean => false, setValue: (_key: number, _value: number): void => { } };
        let getTableCalled: boolean = false;
        const reader: any = { _getTable: (_name: string): any => { getTableCalled = true; return { _offset: 100 };}};
        const locaTable: any = {_offsets: [0, 10]};
        expect(() => _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 1, locaTable)).not.toThrow();
        expect(getTableCalled).toBe(false);
    });
    it('1038504 processes valid glyph index within bounds', () => {
        let getTableCalled: boolean = false;
        const glyphChars: any = {
            containsKey: (_key: number): boolean => true,
            setValue: (_key: number, _value: number): void => {}
        };
        const reader: any = {
            _getTable: (_name: string): any => { getTableCalled = true; return { _offset: 100 };},
            _readInt16: (_offset: number): number => 1
        };
        const locaTable: any = {_offsets: [0, 10] };
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(getTableCalled).toBe(true);
    });
    it('1038504 skips glyph when offsets are equal', () => {
        let getTableCalled: boolean = false;
        const reader: any = {
            _getTable: (_name: string): any => {
                getTableCalled = true;
                return { _offset: 100 };
            }
        };
        const glyphChars: any = {containsKey: (_key: number): boolean => false,setValue: (_key: number, _value: number): void => {} };
        const locaTable: any = {_offsets: [10, 10] };
        expect(() => _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable)).not.toThrow();
        expect(getTableCalled).toBe(false);
    });
    it('1038504 uses glyf table name', () => {
        const requestedNames: string[] = [];
        const reader: any = {
            _getTable: (name: string): any => { requestedNames.push(name); return { _offset: 100 };},
            _readInt16: (_offset: number): number => 1
        };
        const glyphChars: any = {containsKey: (_key: number): boolean => true, setValue: (_key: number, _value: number): void => { } };
        const locaTable: any = { _offsets: [0, 10] };
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(requestedNames[0]).toBe('glyf');
    });
    it('1038504 uses table offset plus glyph offset', () => {
        const reader: any = {
            _offset: 0,
            _getTable: (_name: string): any => { return { _offset: 100 }; },
            _readInt16: (_offset: number): number => 1
        };
        const glyphChars: any = { containsKey: (_key: number): boolean => true, setValue: (_key: number, _value: number): void => { } };
        const locaTable: any = { _offsets: [5, 10]};
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(reader._offset).toBe(105);
    });
    it('1038504 ignores simple glyph when contours are zero', () => {
        let readUInt16Called: boolean = false;
        const reader: any = {
            _offset: 0,
            _getTable: (_name: string): any => {return { _offset: 100 }; },
            _readInt16: (_offset: number): number => 0,
            _readUInt16: (_offset: number): number => { readUInt16Called = true; return 0;}
        };
        const glyphChars: any = { containsKey: (_key: number): boolean => false, setValue: (_key: number, _value: number): void => { } };
        const locaTable: any = { _offsets: [0, 10] };
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(readUInt16Called).toBe(false);
    });
    it('1038504 processes composite glyph when contours are negative', () => {
        let readUInt16Called: boolean = false;
        const reader: any = {
            _offset: 0,
            _getTable: (_name: string): any => { return { _offset: 100 }; },
            _readInt16: (_offset: number): number => -1,
            _readUInt16: (_offset: number): number => { readUInt16Called = true; return 0;}
        };
        const glyphChars: any = { containsKey: (_key: number): boolean => true, setValue: (_key: number, _value: number): void => { } };
        const locaTable: any = { _offsets: [0, 10]};
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(readUInt16Called).toBe(true);
    });
    it('1038504 adds glyph only when glyph does not exist', () => {
        const addedGlyphs: number[] = [];
        const glyphChars: any = {
            containsKey: (_key: number): boolean => false,
            setValue: (key: number, _value: number): void => { addedGlyphs.push(key);}
        };
        let readCount: number = 0;
        const reader: any = {
            _offset: 0,
            _getTable: (_name: string): any => { return { _offset: 100 };},
            _readInt16: (_offset: number): number => -1,
            _readUInt16: (_offset: number): number => { readCount++; return readCount === 1 ? 0 : 25; }
        };
        const locaTable: any = { _offsets: [0, 10] };
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(addedGlyphs.length).toBe(1);
        expect(addedGlyphs[0]).toBe(25);
    });
    it('1038504 uses two byte skip when Arg1And2AreWords flag not set', () => {
        const reader: any = { _offset: 0, _getTable: (_name: string): any => { return { _offset: 100 }; }, _readInt16: (_offset: number): number => -1};
        let callIndex: number = 0;
        reader._readUInt16 = (_offset: number): number => { callIndex++; if (callIndex === 1) { return 0; } return 33;};
        const glyphChars: any = { containsKey: (_key: number): boolean => true, setValue: (_key: number, _value: number): void => {}};
        const locaTable: any = { _offsets: [0, 10] };
        _TrueTypeReader.prototype._processCompositeGlyph.call( reader, glyphChars, 0, locaTable);
        expect(reader._offset).toBe(100);
    });
    function makeLocaTableHarness(): any {
        const reader: any = {_align: (value: number): number => { return (value + 3) & (~3); }};
        return reader;
    }
    it('1038504 short loca table writes half offsets and returns expected size', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 20, 40, 60];
        const result: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, true);
        expect(result).toBeDefined();
        expect(result.newLocaSize).toBe(8);
        expect(result.newLocaUpdated).toBeDefined();
        expect(result.newLocaUpdated.length).toBe(8);
        expect(result.newLocaUpdated[0]).toBe(0);
        expect(result.newLocaUpdated[1]).toBe(0);
        expect(result.newLocaUpdated[2]).toBe(0);
        expect(result.newLocaUpdated[3]).toBe(10);
        expect(result.newLocaUpdated[4]).toBe(0);
        expect(result.newLocaUpdated[5]).toBe(20);
        expect(result.newLocaUpdated[6]).toBe(0);
        expect(result.newLocaUpdated[7]).toBe(30);
    });
    it('1038504 long loca table writes full integer offsets and returns expected size', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 100, 200];
        const result: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, false);
        expect(result).toBeDefined();
        expect(result.newLocaSize).toBe(12);
        expect(result.newLocaUpdated.length).toBe(12);
        expect(result.newLocaUpdated[0]).toBe(0);
        expect(result.newLocaUpdated[1]).toBe(0);
        expect(result.newLocaUpdated[2]).toBe(0);
        expect(result.newLocaUpdated[3]).toBe(0);
        expect(result.newLocaUpdated[4]).toBe(0);
        expect(result.newLocaUpdated[5]).toBe(0);
        expect(result.newLocaUpdated[6]).toBe(0);
        expect(result.newLocaUpdated[7]).toBe(100);
        expect(result.newLocaUpdated[8]).toBe(0);
        expect(result.newLocaUpdated[9]).toBe(0);
        expect(result.newLocaUpdated[10]).toBe(0);
        expect(result.newLocaUpdated[11]).toBe(200);
    });
    it('1038504 short and long loca tables generate different output sizes', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 16, 32, 48];
        const shortResult: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, true);
        const longResult: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, false);
        expect(shortResult.newLocaSize).toBe(locaTable.length * 2);
        expect(longResult.newLocaSize).toBe(locaTable.length * 4);
        expect(shortResult.newLocaSize).not.toBe(longResult.newLocaSize);
    });
    it('1038504 short loca table divides values by two before writing', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 8];
        const result: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, true);
        expect(result.newLocaUpdated[0]).toBe(0);
        expect(result.newLocaUpdated[1]).toBe(0);
        expect(result.newLocaUpdated[2]).toBe(0);
        expect(result.newLocaUpdated[3]).toBe(4);
        expect(result.newLocaUpdated[3]).not.toBe(16);
    });
    it('1038504 long loca table preserves original value without short conversion', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 8];
        const result: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, false);
        expect(result.newLocaUpdated[4]).toBe(0);
        expect(result.newLocaUpdated[5]).toBe(0);
        expect(result.newLocaUpdated[6]).toBe(0);
        expect(result.newLocaUpdated[7]).toBe(8);
    });
    it('1038504 result contains populated loca data and metadata', () => {
        const reader: any = makeLocaTableHarness();
        const locaTable: number[] = [0, 24, 48];
        const result: any = (_TrueTypeReader.prototype as any)._updateLocaTable.call(reader, locaTable, true);
        expect(Object.keys(result).length).toBe(2);
        expect(result.newLocaUpdated).toBeDefined();
        expect(Array.isArray(result.newLocaUpdated)).toBe(true);
        expect(result.newLocaUpdated.length).toBeGreaterThan(0);
        expect(result.newLocaSize).toBe(6);
    });
    function makeFontProgramHarness(): any {
        return {
            _entrySelectors: [0, 0, 1, 1, 2, 2, 2, 2, 3],
            _getFontProgramLength: (_loca: any, _glyph: any, _table: number): any => {return { fontProgramLength: 64, table: 4 }; },
            _writeCheckSums: (_writer: any): void => {},
            _writeGlyphs: (_writer: any): void => {}
        };
    }
    it('1038504 _align returns four byte aligned value for non aligned input', () => {
        const result: number = (_TrueTypeReader.prototype as any)._align(5);
        expect(result).toBe(8);
        expect(result).not.toBe(0);
        expect(result).not.toBe(4);
    });
    it('1038504 _align preserves already aligned value', () => {
        const result: number = (_TrueTypeReader.prototype as any)._align(8);
        expect(result).toBe(8);
        expect(result % 4).toBe(0);
    });
    it('1038504 _align rounds value three to four', () => {
        const result: number = (_TrueTypeReader.prototype as any)._align(3);
        expect(result).toBe(4);
        expect(result).not.toBe(0);
    });
    it('1038504 _getFontProgram returns writer data', () => {
        const reader: any = makeFontProgramHarness();
        const result: number[] = (_TrueTypeReader.prototype as any)._getFontProgram.call(reader, [0], [1], 1, 1);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(64);
    });
    it('1038504 _getFontProgram writes search range using multiplication', () => {
        const reader: any = makeFontProgramHarness();
        const result: number[] = (_TrueTypeReader.prototype as any)._getFontProgram.call(reader, [0], [1], 1, 1);
        const searchRangeHigh: number = result[6];
        const searchRangeLow: number = result[7];
        expect(searchRangeHigh).toBe(0);
        expect(searchRangeLow).toBe(64);
    });
    it('1038504 _getFontProgram writes range shift using multiplication', () => {
        const reader: any = makeFontProgramHarness();
        const result: number[] = (_TrueTypeReader.prototype as any)._getFontProgram.call(reader, [0], [1], 1, 1);
        const rangeShiftHigh: number = result[10];
        const rangeShiftLow: number = result[11];
        expect(rangeShiftHigh).toBe(0);
        expect(rangeShiftLow).toBe(0);
    });
    it('1038504 _getFontProgram writes table count', () => {
        const reader: any = makeFontProgramHarness();
        const result: number[] = (_TrueTypeReader.prototype as any)._getFontProgram.call(reader, [0], [1], 1, 1);
        expect(result[4]).toBe(0);
        expect(result[5]).toBe(4);
    });
    it('1038504 _getFontProgram writes non zero range shift for table five', () => {
        const reader: any = makeFontProgramHarness();
        reader._getFontProgramLength = (): any => { return { fontProgramLength: 64, table: 5 }; };
        const result: number[] = (_TrueTypeReader.prototype as any)._getFontProgram.call(reader, [0], [1], 1, 1);
        expect(result[10]).toBe(0);
        expect(result[11]).toBe(16);
    });
});
describe('1038504 _getFontProgramLength guards', () => {
    function makeFontProgramLengthHarness(): any {
        return {
            _tableNames: ['glyf', 'loca', 'head', 'hhea'],
            _align: (value: number): number => { return (value + 3) & (~3); },
            _getTable: (name: string): any => {
                if (name === 'head') { return { _empty: false, _length: 10 }; }
                if (name === 'hhea') { return { _empty: false, _length: 20 }; }
                return { _empty: false, _length: 100 };
            }
        };
    }
    it('1038504 returns zero when loca table is empty', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [], [1, 2], 0);
        expect(result.fontProgramLength).toBe(0);
    });
    it('1038504 returns zero when glyph table is empty', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1, 2], [], 0);
        expect(result.fontProgramLength).toBe(0);
    });
    it('1038504 returns zero when both arrays are empty', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [], [], 0);
        expect(result.fontProgramLength).toBe(0);
    });
    it('1038504 counts aligned lengths from non loca tables', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1, 2], [3, 4], 0);
        expect(result.fontProgramLength).toBeGreaterThan(0);
        expect(result.table).toBe(4);
    });
    it('1038504 excludes glyf and loca tables from accumulated length', () => {
        const reader: any = makeFontProgramLengthHarness();
        reader._getTable = (name: string): any => {
            if (name === 'glyf') { return { _empty: false, _length: 1000 }; }
            if (name === 'loca') { return { _empty: false, _length: 2000 }; }
            if (name === 'head') { return { _empty: false, _length: 10 }; }
            return { _empty: false, _length: 20 };
        };
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        expect(result.table).toBe(4);
        expect(result.fontProgramLength).toBe(110);
    });
    it('1038504 ignores empty tables when calculating length', () => {
        const reader: any = makeFontProgramLengthHarness();
        reader._getTable = (name: string): any => {
            if (name === 'head') { return { _empty: true, _length: 100 }; }
            if (name === 'hhea') { return { _empty: false, _length: 20 }; }
            return { _empty: false, _length: 0 };
        };
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        expect(result.table).toBe(3);
    });
    it('1038504 increments table count for valid tables', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        expect(result.table).toBe(4);
    });
    it('1038504 adds aligned lengths to font program length', () => {
        const reader: any = makeFontProgramLengthHarness();
        reader._getTable = (name: string): any => {
            if (name === 'head') { return { _empty: false, _length: 8 }; }
            if (name === 'hhea') { return { _empty: false, _length: 12 }; }
            return { _empty: false, _length: 0 };
        };
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        expect(result.fontProgramLength).toBeGreaterThan(90);
    });
    it('1038504 includes loca and glyph lengths in final calculation', () => {
        const reader: any = makeFontProgramLengthHarness();
        const result1: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        const result2: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1, 2, 3, 4], [1, 2, 3, 4], 0);
        expect(result2.fontProgramLength).toBe(result1.fontProgramLength + 6);
    });
    it('1038504 calculates used table size using table multiplied by sixteen plus twelve', () => {
        const reader: any = makeFontProgramLengthHarness();
        reader._getTable = (name: string): any => {
            if (name === 'head') { return { _empty: false, _length: 0 }; }
            if (name === 'hhea') { return { _empty: false, _length: 0 }; }
            return { _empty: false, _length: 0 };
        };
        const result: any = (_TrueTypeReader.prototype as any)._getFontProgramLength.call(reader, [1], [1], 0);
        expect(result.table).toBe(4);
        expect(result.fontProgramLength).toBe(78);
    });
});
describe('1038504 _getGlyphChars mutations', () => {
    function makeGlyphCharsHarness(): any {
        return { _getGlyph: (character: string): any => { return { _empty: false, _index: character.charCodeAt(0) };} };
    }
    it('1038504 _getGlyphChars returns empty dictionary when chars is null', () => {
        const reader: any = makeGlyphCharsHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getGlyphChars.call(reader, null);
        expect(result).toBeDefined();
        expect(result.keys().length).toBe(0);
    });
    it('1038504 _getGlyphChars returns empty dictionary when chars undefined', () => {
        const reader: any = makeGlyphCharsHarness();
        const result: any = (_TrueTypeReader.prototype as any)._getGlyphChars.call(reader, undefined);
        expect(result).toBeDefined();
        expect(result.keys().length).toBe(0);
    });
    it('1038504 _getGlyphChars adds glyph entries for valid characters', () => {
        const reader: any = makeGlyphCharsHarness();
        const chars: any = { keys: (): string[] => ['A', 'B']};
        const result: any = (_TrueTypeReader.prototype as any)._getGlyphChars.call(reader, chars);
        expect(result.keys().length).toBe(2);
        expect(result.containsKey(65)).toBe(true);
        expect(result.containsKey(66)).toBe(true);
        expect(result.getValue(65)).toBe(65);
        expect(result.getValue(66)).toBe(66);
    });
    it('1038504 _getGlyphChars skips empty glyph entries', () => {
        const reader: any = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return { _empty: true, _index: 65};
                }
                return { _empty: false, _index: 66};
            }
        };
        const chars: any = { keys: (): string[] => ['A', 'B'] };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyphChars.call(reader, chars);
        expect(result.containsKey(65)).toBe(false);
        expect(result.containsKey(66)).toBe(true);
        expect(result.keys().length).toBe(1);
    });
    it('1038504 _getGlyphChars stores character code using charCodeAt', () => {
        const reader: any = makeGlyphCharsHarness();
        const chars: any = { keys: (): string[] => ['Z'] };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyphChars.call(reader, chars);
        expect(result.containsKey(90)).toBe(true);
        expect(result.getValue(90)).toBe(90);
    });
    function makeWriteCheckSumsHarness(): any {
        return {
            _tableNames: ['glyf', 'loca', 'head'],
            _align: (value: number): number => {
                return (value + 3) & (~3); },
            _calculateCheckSum: (data: number[]): number => {
                return data.length; },
            _getTable: (name: string): any => {
                if (name === 'head') {
                    return { _empty: false, _checksum: 50, _length: 20};
                }
                return { _empty: false, _checksum: 0, _length: 0};
            }
        };
    }
    it('1038504 skips when writer undefined', () => {
        const reader: any = makeWriteCheckSumsHarness();
        expect(() => {(_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, undefined, 3, [1], [2], 10, 10);}).not.toThrow();
    });
    it('1038504 skips when loca table is empty', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [], [2], 10, 10);
        expect(writer._position).toBe(0);
    });
    it('1038504 skips when glyph table is empty', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [], 10, 10);
        expect(writer._position).toBe(0);
    });
    it('1038504 processes every table name', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(200);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1, 2], [3, 4], 40, 24);
        expect(writer._position).toBeGreaterThan(0);
    });
    it('1038504 skips empty tables', () => {
        const reader: any = makeWriteCheckSumsHarness();
        reader._getTable = (name: string): any => {
            if (name === 'head') {
                return { _empty: true, _checksum: 50, _length: 20};
            }
            return { _empty: false, _checksum: 0, _length: 0};
        };
        const writer: any = new _BigEndianWriter(200);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [1], 10, 10);
        expect(writer._position).toBe(32);
    });
    it('1038504 uses glyph checksum and glyph size for glyf table', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(256);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [10, 20, 30, 40], 88, 44);
        const data: number[] = writer._data;
        expect(String.fromCharCode(data[0], data[1], data[2], data[3])).toBe('glyf');
    });
    it('1038504 writes loca table entry', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(256);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1, 2, 3], [4], 30, 60);
        const text: string = String.fromCharCode(...writer._data);
        expect(text.indexOf('loca')).toBeGreaterThan(-1);
    });
    it('1038504 writes checksum from regular table information', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(256);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [1], 10, 10);
        const text: string = String.fromCharCode(...writer._data);
        expect(text.indexOf('head')).toBeGreaterThan(-1);
    });
    it('1038504 uses table multiplied by sixteen plus twelve for first offset', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(256);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [1], 40, 20);
        const data: number[] = writer._data;
        expect(data[8]).toBe(0);
        expect(data[9]).toBe(0);
        expect(data[10]).toBe(0);
        expect(data[11]).toBe(60);
    });
    it('1038504 increases offsets for subsequent table records', () => {
        const reader: any = makeWriteCheckSumsHarness();
        const writer: any = new _BigEndianWriter(512);
        (_TrueTypeReader.prototype as any)._writeCheckSums.call( reader, writer, 3, [1], [1], 40, 20);
        const text: string = String.fromCharCode(...writer._data);
        const glyfIndex: number = text.indexOf('glyf');
        const locaIndex: number = text.indexOf('loca');
        expect(glyfIndex).toBeGreaterThanOrEqual(0);
        expect(locaIndex).toBeGreaterThan(glyfIndex);
    });
    it('1038504 returns zero for null bytes', () => {
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(null);
        expect(result).toBe(0);
    });
    it('1038504 returns zero for undefined bytes', () => {
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(undefined);
        expect(result).toBe(0);
    });
    it('1038504 returns zero for empty byte array', () => {
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum([]);
        expect(result).toBe(0);
    });
    it('1038504 calculates checksum for four bytes', () => {
        const bytes: number[] = [1, 2, 3, 4];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        const expected: number = 4 + (3 << 8) + (2 << 16) + (1 << 24);
        expect(result).toBe(expected);
    });
    it('1038504 uses all byte positions when calculating checksum', () => {
        const bytes: number[] = [10, 20, 30, 40];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        expect(result).toBe( 40 + (30 << 8) + (20 << 16) + (10 << 24));
    });
    it('1038504 processes single loop iteration for four byte input', () => {
        const bytes: number[] = [5, 6, 7, 8];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        expect(result).not.toBe(0);
        expect(result).toBe( 8 + (7 << 8) + (6 << 16) + (5 << 24)
        );
    });
    it('1038504 processes multiple loop iterations', () => {
        const bytes: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        const expectedByte4: number = 1 + 5;
        const expectedByte3: number = 2 + 6;
        const expectedByte2: number = 3 + 7;
        const expectedByte1: number = 4 + 8;
        const expected: number = expectedByte1 + (expectedByte2 << 8) + (expectedByte3 << 16) + (expectedByte4 << 24);
        expect(result).toBe(expected);
    });
    it('1038504 checksum changes when byte order changes', () => {
        const first: number = (_TrueTypeReader.prototype as any)._calculateCheckSum([1, 2, 3, 4]);
        const second: number = (_TrueTypeReader.prototype as any)._calculateCheckSum([4, 3, 2, 1]);
        expect(first).not.toBe(second);
    });
    it('1038504 calculates byte2 contribution using left shift eight', () => {
        const bytes: number[] = [0, 0, 1, 0];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        expect(result).toBe(256);
        expect(result).not.toBe(-256);
    });
    it('1038504 calculates byte3 contribution using left shift sixteen', () => {
        const bytes: number[] = [0, 1, 0, 0];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        expect(result).toBe(65536);
        expect(result).not.toBe(-65536);
    });
    it('1038504 calculates byte4 contribution using left shift twenty four', () => {
        const bytes: number[] = [1, 0, 0, 0];
        const result: number = (_TrueTypeReader.prototype as any)._calculateCheckSum(bytes);
        expect(result).toBe(16777216);
        expect(result).not.toBe(-16777216);
    });

    function makeWriteGlyphsHarness(): any {
        return {
            _tableNames: ['glyf', 'loca', 'head'],
            _offset: 0,
            _align: (value: number): number => {
                return (value + 3) & (~3);
            },
            _getTable: (name: string): any => {
                if (name === 'head') {
                    return { _empty: false, _offset: 0, _length: 2 };
                }
                return { _empty: false, _offset: 0, _length: 0 };
            },
            _read: (buffer: number[], _index: number, count: number): any => {
                for (let i: number = 0; i < count; i++) {
                    buffer[i] = i + 1;
                }
                return { buffer, written: count };
            }
        };
    }
    it('1038504 _writeGlyphs writes data to writer', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [11, 22], [33, 44]
        );
        expect(writer._position).toBeGreaterThan(0);
    });
    it('1038504 _writeGlyphs writes data to writer', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [11, 22], [33, 44]);
        expect(writer._position).toBeGreaterThan(0);
    });
    it('1038504 _writeGlyphs iterates through table collection', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [10], [20]);
        expect(writer._position).toBeGreaterThan(2);
    });
    it('1038504 _writeGlyphs skips empty table entries', () => {
        const reader: any = makeWriteGlyphsHarness();
        reader._getTable = (name: string): any => {
            if (name === 'head') {
                return { _empty: true, _offset: 0, _length: 20};
            }
            return { _empty: false, _offset: 0, _length: 0};
        };
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [1], [2]);
        expect(writer._position).toBe(2);
    });
    it('1038504 _writeGlyphs writes glyph table bytes', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [1], [50, 60]);
        expect(writer._data[0]).toBe(50);
        expect(writer._data[1]).toBe(60);
    });
    it('1038504 _writeGlyphs writes loca table bytes', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [70, 80], [10]);
        expect(writer._data[1]).toBe(70);
        expect(writer._data[2]).toBe(80);
    });
    it('1038504 _writeGlyphs writes bytes from non glyph tables', () => {
        const reader: any = makeWriteGlyphsHarness();
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [1], [2]);
        const data: number[] = writer._data;
        expect(data).toContain(1);
        expect(data).toContain(2);
    });
    it('1038504 _writeGlyphs creates zero initialized buffer before read', () => {
        let capturedBuffer: number[];
        const reader: any = makeWriteGlyphsHarness();
        reader._read = (buffer: number[], _index: number, count: number): any => {
            capturedBuffer = buffer.slice();
            for (let i: number = 0; i < count; i++) {
                buffer[i] = 9;
            }
            return { buffer, written: count };
        };
        const writer: any = new _BigEndianWriter(100);
        (_TrueTypeReader.prototype as any)._writeGlyphs.call( reader, writer, [1], [2]);
        expect(capturedBuffer.length).toBe(4);
        expect(capturedBuffer[0]).toBe(0);
        expect(capturedBuffer[1]).toBe(0);
        expect(capturedBuffer[2]).toBe(0);
        expect(capturedBuffer[3]).toBe(0);
    });
    function makeReadHarness(): any {
        return { _offset: 0, _fontData: [10, 20, 30, 40, 50, 60]};
    }
    it('1038504 _read returns zero written for empty buffer', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 2);
        expect(result.written).toBe(0);
        expect(result.buffer).toBe(buffer);
        expect(reader._offset).toBe(0);
    });
    it('1038504 _read copies requested bytes to buffer', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0, 0, 0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 3);
        expect(result.written).toBe(3)
        expect(result.buffer[0]).toBe(10);
        expect(result.buffer[1]).toBe(20);
        expect(result.buffer[2]).toBe(30);
    });
    it('1038504 _read advances offset by count', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0, 0];
        (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 2);
        expect(reader._offset).toBe(2);
    });
    it('1038504 _read writes exact requested count', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0, 0, 0, 0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 4);
        expect(result.written).toBe(4);
        expect(reader._offset).toBe(4);
    });
    it('1038504 _read respects destination index', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0, 0, 0, 0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 1, 2);
        expect(result.buffer[0]).toBe(0);
        expect(result.buffer[1]).toBe(10);
        expect(result.buffer[2]).toBe(20);
        expect(result.written).toBe(2);
    });
    it('1038504 _read stops at font data length boundary', () => {
        const reader: any = makeReadHarness();
        reader._offset = 4;
        const buffer: number[] = [0, 0, 0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 3);
        expect(result.buffer[0]).toBe(50);
        expect(result.buffer[1]).toBe(60);
        expect(result.buffer[2]).toBe(0);
        expect(result.written).toBe(3);
    });
    it('1038504 _read returns populated result object', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 1);
        expect(result).toBeDefined();
        expect(result.buffer).toBe(buffer);
        expect(result.written).toBe(1);
    });
    it('1038504 _read processes complete count using do while loop', () => {
        const reader: any = makeReadHarness();
        const buffer: number[] = [0, 0, 0, 0, 0];
        const result: any = (_TrueTypeReader.prototype as any)._read.call(reader, buffer, 0, 5);
        expect(result.written).toBe(5);
        expect(reader._offset).toBe(5);
        expect(result.buffer[4]).toBe(50);
    });
    it('1038504 _createInternals sets loca format false for long loca table', () => {
        const reader: any = {
            _readNameTable: (): any => { return {};},
            _readHeadTable: (): any => {
                return { _indexToLocalFormat: 1, _unitsPerEm: 1000 };
            },
            _readHorizontalHeaderTable: (): any => {
                return {
                    _numberOfHMetrics: 2
                };
            },
            _readOS2Table: (): any => { return {};},
            _readPostTable: (): any => { return {};},
            _readWidthTable: (_count: number, _unitsPerEm: number): number[] => { return [100];},
            _readCmapTable: (): any[] => { return [];},
            _initializeMetrics: ( _nameTable: any, _headTable: any, _horizontalHeadTable: any, _os2Table: any, _postTable: any, _subTables: any[]): void => {}
        };
        (_TrueTypeReader.prototype as any)._createInternals.call(reader);
        expect(reader._bIsLocaShort).toBe(false);
    });
    it('1038504 _getGlyph number returns default glyph when microsoft glyph missing', () => {
        const defaultGlyph: any = { _index: 999 };
        const reader: any = {
            _metrics: { _isSymbol: false },
            _microsoftGlyphs: {
                containsKey: (_key: number): boolean => false,
                getValue: (_key: number): any => {
                    return { _index: 10 };
                }
            },
            _getDefaultGlyph: (): any => defaultGlyph
        };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyph.call(reader, 100);
        expect(result).toBe(defaultGlyph);
    });
    it('1038504 _getGlyph non symbol ignores macintosh glyph collection', () => {
        const defaultGlyph: any = { _index: 777 };
        const reader: any = {
            _metrics: { _isSymbol: false },
            _microsoftGlyphs: null,
            _macintoshGlyphs: {
                containsKey: (_key: number): boolean => true,
                getValue: (_key: number): any => {
                    return { _index: 55 };
                }
            },
            _getDefaultGlyph: (): any => defaultGlyph
        };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyph.call(reader, 25);
        expect(result).toBe(defaultGlyph);
    });
    it('1038504 _getGlyph whitespace does not mark font present', () => {
        const glyph: any = { _index: 1 };
        const microsoft: any = {
            containsKey: (_key: number): boolean => true,
            getValue: (_key: number): any => glyph
        };
        const reader: any = {
            _metrics: { _isSymbol: false },
            _microsoft: microsoft,
            _isFontPresent: false,
            _getDefaultGlyph: (): any => ({ _index: 0 })
        };
        (_TrueTypeReader.prototype as any)._getGlyph.call(reader, ' ');
        expect(reader._isFontPresent).toBe(false);
    });
    it('1038504 _getGlyph missing whitespace glyph keeps font presence unchanged', () => {
        const microsoft: any = {
            containsKey: (_key: number): boolean => false
        };
        const reader: any = {
            _metrics: { _isSymbol: false },
            _microsoft: microsoft,
            _isFontPresent: true,
            _getDefaultGlyph: (): any => ({ _index: 0 })
        };
        (_TrueTypeReader.prototype as any)._getGlyph.call(reader, ' ');
        expect(reader._isFontPresent).toBe(true);
    });
    it('1038504 _getGlyph non symbol does not enter macintosh branch', () => {
        const defaultGlyph: any = { _index: 333 };
        const reader: any = {
            _metrics: { _isSymbol: false },
            _microsoft: null,
            _isMacFont: false,
            macintosh: {
                containsKey: (_key: number): boolean => true,
                getValue: (_key: number): any => ({ _index: 12 })
            },
            _getDefaultGlyph: (): any => defaultGlyph
        };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyph.call(reader, 'A');
        expect(result).toBe(defaultGlyph);
    });
    it('1038504 _getGlyph preserves non symbol mac code when upper byte not f000', () => {
        let capturedCode: number;
        const reader: any = {
            _metrics: { _isSymbol: true },
            _isMacFont: false,
            _maxMacIndex: 0,
            macintosh: {
                containsKey: (code: number): boolean => {
                    capturedCode = code;
                    return false;
                }
            },
            _getDefaultGlyph: (): any => ({})
        };
        (_TrueTypeReader.prototype as any)._getGlyph.call(reader, String.fromCharCode(0x1234));
        expect(capturedCode).toBe(0x1234);
    });
    it('1038504 _getGlyph symbol returns default glyph when macintosh entry missing', () => {
        const defaultGlyph: any = { _index: 600 };
        const reader: any = {
            _metrics: { _isSymbol: true },
            _isMacFont: false,
            _maxMacIndex: 0,
            macintosh: {
                containsKey: (_code: number): boolean => false,
                getValue: (_code: number): any => ({ _index: 20 })
            },
            _getDefaultGlyph: (): any => defaultGlyph
        };
        const result: any = (_TrueTypeReader.prototype as any)._getGlyph.call(reader, 'A');
        expect(result).toBe(defaultGlyph);
    });
    it('1038504 _readString treats undefined unicode flag as false', () => {
        const reader: any = { _offset: 0, _fontData: [65, 66, 67], _readString: _TrueTypeReader.prototype._readString};
        const result: string = (_TrueTypeReader.prototype as any)._readString.call(reader, 3);
        expect(result).toBe('ABC');
        expect(reader._offset).toBe(3);
    });
        it('1038504 _readString treats null unicode flag as false', () => {
        const reader: any = { _offset: 0, _fontData: [88, 89], _readString: _TrueTypeReader.prototype._readString};
        const result: string = (_TrueTypeReader.prototype as any)._readString.call(reader, 2, null);
        expect(result).toBe('XY');
        expect(reader._offset).toBe(2);
    });
        it('1038504 _readString handles undefined and null independently', () => {
        const readerUndefined: any = { _offset: 0, _fontData: [65], _readString: _TrueTypeReader.prototype._readString};
        const undefinedResult: string = (_TrueTypeReader.prototype as any)._readString.call(readerUndefined, 1);
        expect(undefinedResult).toBe('A');
        const readerNull: any = { _offset: 0, _fontData: [66], _readString: _TrueTypeReader.prototype._readString};
        const nullResult: string = (_TrueTypeReader.prototype as any)._readString.call(readerNull, 1, null);
        expect(nullResult).toBe('B');
    });
    it('1038504 _readFixed combines integer and fractional parts', () => {
        const reader: any = {
            _readInt16: (position: number): number => {
                if (position === 0) { return 2;}
                if (position === 2) { return 8192;}
                return 0;
            }
        };
        const result: number = (_TrueTypeReader.prototype as any)._readFixed.call(reader, 0);
        expect(result).toBe(2.5);
        expect(result).not.toBe(134217730);
        expect(result).not.toBe(1.5);
    });
    it('1038504 _readInt32 combines all four bytes using positive high byte contribution', () => {
        const reader: any = { _fontData: [1, 2, 3, 4], _offset: 0};
        const result: number = (_TrueTypeReader.prototype as any)._readInt32.call(reader, 0);
        const expected: number = 4 + (3 << 8) + (2 << 16) + (1 << 24);
        expect(result).toBe(expected);
        expect(reader._offset).toBe(4);
    });
    it('1038504 _readInt64 combines high and low parts when low is positive', () => {
        const reader: any = {
            _readInt32: (offset: number): number => {
                if (offset === 0) { return 2; }
                if (offset === 4) { return 10; }
                return 0;
            }
        };
        const result: number = (_TrueTypeReader.prototype as any)._readInt64.call(reader, 0);
        expect(result).toBe(8589934602);
    });
    it('1038504 _readInt64 adjusts negative low value', () => {
        const reader: any = {
            _readInt32: (offset: number): number => {
                if (offset === 0) { return 1;}
                if (offset === 4) { return -1;}
                return 0;
            }
        };
        const result: number = (_TrueTypeReader.prototype as any)._readInt64.call(reader, 0);
        expect(result).toBe(8589934591);
    });
    it('1038504 _readUShortArray returns exact ushort values', () => {
        const reader: any = { _offset: 0, _readUInt16: (offset: number): number => { return offset === 0 ? 100 : 200; }};
        const result: number[] = (_TrueTypeReader.prototype as any)._readUShortArray.call(reader, 2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(100);
        expect(result[1]).toBe(100);
    });
    it('1038504 _readBytes reads exact byte sequence and advances offset', () => {
        const reader: any = { _offset: 0, _fontData: [10, 20, 30, 40]};
        const result: number[] = (_TrueTypeReader.prototype as any)._readBytes.call(reader, 3);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(30);
        expect(reader._offset).toBe(3);
    });
    it('1038504 _readByte returns byte and increments offset', () => {
        const reader: any = { _offset: 5, _fontData: [10, 20, 30, 40]};
        const result: number = (_TrueTypeReader.prototype as any)._readByte.call(reader, 2);
        expect(result).toBe(30);
        expect(reader._offset).toBe(6);
    });
});
describe('1038504 _convertString mutations', () => {
    it('1038504 _convertString returns empty string for null text', () => {
        const reader: any = {
            _getGlyph: (_ch: string): any => {
                return { _empty: false, _index: 65 };
            }
        };
        const result: string = (_TrueTypeReader.prototype as any)._convertString.call(reader, null);
        expect(result).toBe('');
    });
    it('1038504 _convertString returns empty string for undefined text', () => {
        const reader: any = {
            _getGlyph: (_ch: string): any => {
                return { _empty: false, _index: 65 };
            }
        };
        const result: string = (_TrueTypeReader.prototype as any)._convertString.call(reader, undefined);
        expect(result).toBe('');
    });
    it('1038504 _convertString returns empty string for empty text', () => {
        const reader: any = {
            _getGlyph: (_ch: string): any => {
                return { _empty: false, _index: 65};
            }
        };
        const result: string = (_TrueTypeReader.prototype as any)._convertString.call(reader, '');
        expect(result).toBe('');
    });
    it('1038504 _convertString converts glyph indexes to string', () => {
        const reader: any = {
            _getGlyph: (ch: string): any => {
                if (ch === 'A') {
                    return { _empty: false, _index: 66
                    };
                }
                return { _empty: false, _index: 67
                };
            }
        };
        const result: string = (_TrueTypeReader.prototype as any)._convertString.call(reader, 'AB');
        expect(result).toBe('BC');
        expect(result.length).toBe(2);
    });
    it('1038504 _convertString skips empty glyph entries', () => {
        const reader: any = {
            _getGlyph: (ch: string): any => {
                if (ch === 'A') {
                    return { _empty: true, _index: 65 };
                }
                return { _empty: false, _index: 66
                };
            }
        };
        const result: string = (_TrueTypeReader.prototype as any)._convertString.call(reader, 'AB');
        expect(result).toBe('B');
        expect(result.length).toBe(1);
    });
    it('1038504 _isItalic returns true when italic bit is set', () => {
        const metrics: _TrueTypeMetrics = new _TrueTypeMetrics();
        metrics._macStyle = 2;
        expect(metrics._isItalic).toBe(true);
    });
    it('1038504 _isItalic returns false when italic bit is not set', () => {
        const metrics: _TrueTypeMetrics = new _TrueTypeMetrics();
        metrics._macStyle = 0;
        expect(metrics._isItalic).toBe(false);
    });
    it('1038504 _isBold returns true when bold bit is set', () => {
        const metrics: _TrueTypeMetrics = new _TrueTypeMetrics();
        metrics._macStyle = 1;
        expect(metrics._isBold).toBe(true);
    });
    it('1038504 _isBold returns false when bold bit is not set', () => {
        const metrics: _TrueTypeMetrics = new _TrueTypeMetrics();
        metrics._macStyle = 0;
        expect(metrics._isBold).toBe(false);
    });
    it('1038504 style flags evaluate independently', () => {
        const metrics: _TrueTypeMetrics = new _TrueTypeMetrics();
        metrics._macStyle = 2;
        expect(metrics._isItalic).toBe(true);
        expect(metrics._isBold).toBe(false);
    });
    it('1038504 _empty returns true only when all values are zero', () => {
        const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
        glyph._index = 0;
        glyph._width = 0;
        glyph._charCode = 0;
        expect(glyph._empty).toBe(true);
    });
    it('1038504 _empty returns false when all values are equal but non zero', () => {
        const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
        glyph._index = 5;
        glyph._width = 5;
        glyph._charCode = 5;
        expect(glyph._empty).toBe(false);
    });
    it('1038504 _empty returns false when char code is zero but index differs', () => {
        const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
        glyph._index = 1;
        glyph._width = 0;
        glyph._charCode = 0;
        expect(glyph._empty).toBe(false);
    });
    it('1038504 _empty returns false when index and width match but char code is non zero', () => {
        const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
        glyph._index = 10;
        glyph._width = 10;
        glyph._charCode = 20;
        expect(glyph._empty).toBe(false);
    });
    it('1038504 _empty returns false when width and char code are zero but index is non zero', () => {
        const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
        glyph._index = 25;
        glyph._width = 0;
        glyph._charCode = 0;
        expect(glyph._empty).toBe(false);
    });
    it('1038504 data getter pads buffer to configured capacity', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(5);
        writer._writeBytes([1, 2]);
        const data: number[] = writer._data;
        expect(data.length).toBe(5);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(0);
        expect(data[3]).toBe(0);
        expect(data[4]).toBe(0);
    });
    it('1038504 data getter does not append extra value when padding required', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(3);
        writer._writeBytes([10]);
        const data: number[] = writer._data;
        expect(data.length).toBe(3);
        expect(data[0]).toBe(10);
        expect(data[1]).toBe(0);
        expect(data[2]).toBe(0);
    });
    it('1038504 data getter preserves full buffer length', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(4);
        writer._writeBytes([1, 2, 3, 4]);
        const data: number[] = writer._data;
        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);
    });
    it('1038504 data getter returns exact configured length after multiple writes', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(6);
        writer._writeBytes([1, 2]);
        writer._writeBytes([3]);
        const data: number[] = writer._data;
        expect(data.length).toBe(6);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(0);
        expect(data[4]).toBe(0);
        expect(data[5]).toBe(0);
    });
    it('1038504 position getter initializes undefined value to zero', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        delete (writer as any)._internalPosition;
        const result: number = writer._position;
        expect(result).toBe(0);
        expect((writer as any)._internalPosition).toBe(0);
    });
    it('1038504 position getter initializes null value to zero', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._internalPosition = null;
        const result: number = writer._position;
        expect(result).toBe(0);
        expect((writer as any)._internalPosition).toBe(0);
    });
    it('1038504 position getter preserves existing value', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._internalPosition = 25;
        const result: number = writer._position;
        expect(result).toBe(25);
        expect((writer as any)._internalPosition).toBe(25);
    });
    it('1038504 _writeShort writes two bytes in big endian order', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(2);
        writer._writeShort(0x1234);
        const data: number[] = writer._data;
        expect(data.length).toBe(2);
        expect(data[0]).toBe(0x12);
        expect(data[1]).toBe(0x34);
    });
    it('1038504 _writeInt writes four bytes in big endian order', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(4);
        writer._writeInt(0x12345678);
        const data: number[] = writer._data;
        expect(data.length).toBe(4);
        expect(data[0]).toBe(0x12);
        expect(data[1]).toBe(0x34);
        expect(data[2]).toBe(0x56);
        expect(data[3]).toBe(0x78);
    });
    it('1038504 _writeUInt writes four bytes in big endian order', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(4);
        writer._writeUInt(0x11223344);
        const data: number[] = writer._data;
        expect(data.length).toBe(4);
        expect(data[0]).toBe(0x11);
        expect(data[1]).toBe(0x22);
        expect(data[2]).toBe(0x33);
        expect(data[3]).toBe(0x44);
    });
    it('1038504 _writeBytes writes supplied byte array', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(3);
        writer._writeBytes([7, 8, 9]);
        const data: number[] = writer._data;
        expect(data.length).toBe(3);
        expect(data[0]).toBe(7);
        expect(data[1]).toBe(8);
        expect(data[2]).toBe(9);
    });
    it('1038504 write methods update position correctly', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        writer._writeShort(0x1234);
        expect(writer._position).toBe(2);
        writer._writeInt(0x01020304);
        expect(writer._position).toBe(6);
        writer._writeBytes([5, 6]);
        expect(writer._position).toBe(8);
    });
    it('1038504 _writeString writes character bytes', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(2);
        writer._writeString('AB');
        const data: number[] = writer._data;
        expect(data.length).toBe(2);
        expect(data[0]).toBe(65);
        expect(data[1]).toBe(66);
        expect(writer._position).toBe(2);
    });
    it('1038504 _writeString writes all characters in order', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(3);
        writer._writeString('XYZ');
        const data: number[] = writer._data;
        expect(data[0]).toBe(88);
        expect(data[1]).toBe(89);
        expect(data[2]).toBe(90);
        expect(writer._position).toBe(3);
    });
    it('1038504 _writeString ignores null value', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(5);
        writer._writeString(null as any);
        expect(writer._position).toBe(0);
        expect(writer._data.length).toBe(5);
        expect(writer._data[0]).toBe(0);
    });
    it('1038504 _writeString ignores undefined value', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(5);
        writer._writeString(undefined as any);
        expect(writer._position).toBe(0);
        expect(writer._data.length).toBe(5);
        expect(writer._data[0]).toBe(0);
    });
    it('1038504 _writeString writes single character', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(1);
        writer._writeString('A');
        const data: number[] = writer._data;
        expect(data.length).toBe(1);
        expect(data[0]).toBe(65);
        expect(writer._position).toBe(1);
    });
});
describe('1038504 _flush mutations', () => {
    it('1038504 _flush writes all buffer values', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(5);
        (writer as any)._flush([10, 20, 30]);
        expect((writer as any)._buffer[0]).toBe(10);
        expect((writer as any)._buffer[1]).toBe(20);
        expect((writer as any)._buffer[2]).toBe(30);
        expect(writer._position).toBe(3);
    });
    it('1038504 _flush appends values at current position', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._flush([1, 2]);
        (writer as any)._flush([3, 4]);
        expect((writer as any)._buffer[0]).toBe(1);
        expect((writer as any)._buffer[1]).toBe(2);
        expect((writer as any)._buffer[2]).toBe(3);
        expect((writer as any)._buffer[3]).toBe(4);
        expect(writer._position).toBe(4);
    });
    it('1038504 _flush updates internal position by written count', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._flush([5, 6, 7]);
        expect(writer._position).toBe(3);
        expect((writer as any)._internalPosition).toBe(3);
    });
    it('1038504 _flush ignores null buffer', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._flush(null);
        expect(writer._position).toBe(0);
        expect((writer as any)._buffer.length).toBe(0);
    });
    it('1038504 _flush ignores undefined buffer', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._flush(undefined);
        expect(writer._position).toBe(0);
        expect((writer as any)._buffer.length).toBe(0);
    });
    it('1038504 _flush writes every item from source buffer', () => {
        const writer: _BigEndianWriter = new _BigEndianWriter(10);
        (writer as any)._flush([11, 22, 33, 44]);
        expect((writer as any)._buffer.length).toBe(4);
        expect((writer as any)._buffer[0]).toBe(11);
        expect((writer as any)._buffer[1]).toBe(22);
        expect((writer as any)._buffer[2]).toBe(33);
        expect((writer as any)._buffer[3]).toBe(44);
    });
});
