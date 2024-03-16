import { _TrueTypeTableInfo, _TrueTypeHorizontalHeaderTable, _TrueTypeNameTable, _TrueTypeHeadTable, _TrueTypeOS2Table, _TrueTypePostTable, _TrueTypeCmapSubTable, _TrueTypeCmapTable, _TrueTypeAppleCmapSubTable, _TrueTypeMicrosoftCmapSubTable, _TrueTypeTrimmedCmapSubTable} from './ttf-table';
import { Dictionary } from '../pdf-primitives';
import { _StringTokenizer } from './string-layouter';
import { _TrueTypeCmapFormat, _TrueTypeCmapEncoding, _TrueTypePlatformID, _TrueTypeMicrosoftEncodingID, _TrueTypeMacintoshEncodingID, _TrueTypeCompositeGlyphFlag } from '../../core/enumerator';
export class _TrueTypeReader {
    _fontData: Uint8Array;
    readonly _int32Size: number = 4;
    _offset: number;
    _tableDirectory: Dictionary<string, _TrueTypeTableInfo>;
    _isFont: boolean = false;
    _isMacTtf: boolean = false;
    _lowestPosition: number;
    _metrics: _TrueTypeMetrics;
    _maxMacIndex: number;
    _isFontPresent: boolean;
    _isMacFont: boolean = false;
    _missedGlyphs: number = 0;
    _tableNames: string[] = ['cvt ', 'fpgm', 'glyf', 'head', 'hhea', 'hmtx', 'loca', 'maxp', 'prep'];
    _entrySelectors: number[] = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
    _width: number[];
    _bIsLocaShort: boolean;
    _macintoshDictionary: Dictionary<number, _TrueTypeGlyph>;
    _microsoftDictionary: Dictionary<number, _TrueTypeGlyph>;
    _internalMacintoshGlyphs: Dictionary<number, _TrueTypeGlyph>;
    _internalMicrosoftGlyphs: Dictionary<number, _TrueTypeGlyph>;
    get macintosh(): Dictionary<number, _TrueTypeGlyph> {
        if (this._macintoshDictionary === null || typeof this._macintoshDictionary === 'undefined') {
            this._macintoshDictionary = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._macintoshDictionary;
    }
    get _microsoft(): Dictionary<number, _TrueTypeGlyph> {
        if (this._microsoftDictionary === null || typeof this._microsoftDictionary === 'undefined') {
            this._microsoftDictionary = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._microsoftDictionary;
    }
    get _macintoshGlyphs(): Dictionary<number, _TrueTypeGlyph> {
        if (this._internalMacintoshGlyphs === null || typeof this._internalMacintoshGlyphs === 'undefined') {
            this._internalMacintoshGlyphs = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._internalMacintoshGlyphs;
    }
    get _microsoftGlyphs(): Dictionary<number, _TrueTypeGlyph> {
        if (this._internalMicrosoftGlyphs === null || typeof this._internalMicrosoftGlyphs === 'undefined') {
            this._internalMicrosoftGlyphs = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._internalMicrosoftGlyphs;
    }
    constructor(fontData: Uint8Array) {
        this._fontData = fontData;
        this._initialize();
    }
    _initialize(): void {
        if (typeof this._metrics === 'undefined' || this._metrics === null) {
            this._metrics = new _TrueTypeMetrics();
        }
        this._readFontDictionary();
        const nameTable: _TrueTypeNameTable = this._readNameTable();
        const headTable: _TrueTypeHeadTable = this._readHeadTable();
        this._initializeFontName(nameTable);
        this._metrics._macStyle = headTable._macStyle;
    }
    _readFontDictionary(): void {
        this._offset = 0;
        this._check();
        const table: number = this._readInt16(this._offset);
        this._readInt16(this._offset);
        this._readInt16(this._offset);
        this._readInt16(this._offset);
        if (typeof this._tableDirectory === 'undefined' || this._tableDirectory === null) {
            this._tableDirectory = new Dictionary<string, _TrueTypeTableInfo>();
        }
        for (let i: number = 0; i < table; ++i) {
            const table: _TrueTypeTableInfo = new _TrueTypeTableInfo();
            const tableKey: string = this._readString(this._int32Size);
            table._checksum = this._readInt32(this._offset);
            table._offset = this._readInt32(this._offset);
            table._length = this._readInt32(this._offset);
            this._tableDirectory.setValue(tableKey, table);
        }
        this._lowestPosition = this._offset;
        if (!this._isFont) {
            this._fixOffsets();
        }
    }
    _fixOffsets(): void {
        let minOffset: number = Number.MAX_VALUE;
        const tableKeys: string[] = this._tableDirectory.keys();
        for (let i: number = 0; i < tableKeys.length; i++) {
            const value: _TrueTypeTableInfo = this._tableDirectory.getValue(tableKeys[Number.parseInt(i.toString(), 10)]);
            const offset: number = value._offset;
            if (minOffset > offset) {
                minOffset = offset;
                if (minOffset <= this._lowestPosition) {
                    break;
                }
            }
        }
        const shift: number = minOffset - this._lowestPosition;
        if (shift !== 0) {
            const table: Dictionary<string, _TrueTypeTableInfo> = new Dictionary<string, _TrueTypeTableInfo>();
            for (let i: number = 0; i < tableKeys.length; i++) {
                const value: _TrueTypeTableInfo = this._tableDirectory.getValue(tableKeys[Number.parseInt(i.toString(), 10)]);
                value._offset -= shift;
                table.setValue(tableKeys[Number.parseInt(i.toString(), 10)], value);
            }
            this._tableDirectory = table;
        }
    }
    _check(): number {
        let version: number = this._readInt32(this._offset);
        this._isMacTtf = (version === 0x74727565) ? true : false;
        if (version !== 0x10000 && version !== 0x74727565 && version !== 0x4f54544f) {
            this._isFont = true;
            this._offset = 0;
            const fontTag: string = this._readString(4);
            if (fontTag !== 'ttcf') {
                throw new Error('Can not read TTF font data');
            }
            this._offset += 4;
            const ttcIdentificationNumber: number = this._readInt32(this._offset);
            if (ttcIdentificationNumber < 0) {
                throw new Error('Can not read TTF font data');
            }
            this._offset = this._readInt32(this._offset);
            version = this._readInt32(this._offset);
        }
        return version;
    }
    _readNameTable(): _TrueTypeNameTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('name');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypeNameTable = new _TrueTypeNameTable();
        table._formatSelector = this._readUInt16(this._offset);
        table._recordsCount = this._readUInt16(this._offset);
        table._offset = this._readUInt16(this._offset);
        table._nameRecords = [];
        const recordSize: number = 12;
        let position: number = this._offset;
        for (let i: number = 0; i < table._recordsCount; i++) {
            this._offset = position;
            const record: _TrueTypeNameRecord = new _TrueTypeNameRecord();
            record._platformID = this._readUInt16(this._offset);
            record._encodingID = this._readUInt16(this._offset);
            record._languageID = this._readUInt16(this._offset);
            record._nameID = this._readUInt16(this._offset);
            record._length = this._readUInt16(this._offset);
            record._offset = this._readUInt16(this._offset);
            this._offset = tableInfo._offset + table._offset + record._offset;
            const unicode: boolean = (record._platformID === 0 || record._platformID === 3);
            record._name = this._readString(record._length, unicode);
            table._nameRecords[Number.parseInt(i.toString(), 10)] = record;
            position += recordSize;
        }
        return table;
    }
    _readHeadTable(): _TrueTypeHeadTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('head');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypeHeadTable = new _TrueTypeHeadTable();
        table._version = this._readFixed(this._offset);
        table._fontRevision = this._readFixed(this._offset);
        table._checkSumAdjustment = this._readUInt32(this._offset);
        table._magicNumber = this._readUInt32(this._offset);
        table._flags = this._readUInt16(this._offset);
        table._unitsPerEm = this._readUInt16(this._offset);
        table._created = this._readInt64(this._offset);
        table._modified = this._readInt64(this._offset);
        table._xMin = this._readInt16(this._offset);
        table._yMin = this._readInt16(this._offset);
        table._xMax = this._readInt16(this._offset);
        table._yMax = this._readInt16(this._offset);
        table._macStyle = this._readUInt16(this._offset);
        table._lowestReadableSize = this._readUInt16(this._offset);
        table._fontDirectionHint = this._readInt16(this._offset);
        table._indexToLocalFormat = this._readInt16(this._offset);
        table._glyphDataFormat = this._readInt16(this._offset);
        return table;
    }
    _readHorizontalHeaderTable(): _TrueTypeHorizontalHeaderTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('hhea');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypeHorizontalHeaderTable = new _TrueTypeHorizontalHeaderTable();
        table._version = this._readFixed(this._offset);
        table._ascender = this._readInt16(this._offset);
        table._descender = this._readInt16(this._offset);
        table._lineGap = this._readInt16(this._offset);
        table._advanceWidthMax = this._readUInt16(this._offset);
        table._minLeftSideBearing = this._readInt16(this._offset);
        table._minRightSideBearing = this._readInt16(this._offset);
        table._xMaxExtent = this._readInt16(this._offset);
        table._caretSlopeRise = this._readInt16(this._offset);
        table._caretSlopeRun = this._readInt16(this._offset);
        this._offset += 10;
        table._metricDataFormat = this._readInt16(this._offset);
        table._numberOfHMetrics = this._readUInt16(this._offset);
        return table;
    }
    _readOS2Table(): _TrueTypeOS2Table {
        const tableInfo: _TrueTypeTableInfo = this._getTable('OS/2');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypeOS2Table = new _TrueTypeOS2Table();
        table._version = this._readUInt16(this._offset);
        table._xAvgCharWidth = this._readInt16(this._offset);
        table._usWeightClass = this._readUInt16(this._offset);
        table._usWidthClass = this._readUInt16(this._offset);
        table._fsType = this._readInt16(this._offset);
        table._ySubscriptXSize = this._readInt16(this._offset);
        table._ySubscriptYSize = this._readInt16(this._offset);
        table._ySubscriptXOffset = this._readInt16(this._offset);
        table._ySubscriptYOffset = this._readInt16(this._offset);
        table._ySuperscriptXSize = this._readInt16(this._offset);
        table._ySuperscriptYSize = this._readInt16(this._offset);
        table._ySuperscriptXOffset = this._readInt16(this._offset);
        table._ySuperscriptYOffset = this._readInt16(this._offset);
        table._yStrikeoutSize = this._readInt16(this._offset);
        table._yStrikeoutPosition = this._readInt16(this._offset);
        table._sFamilyClass = this._readInt16(this._offset);
        table._panose = this._readBytes(10);
        table._ulUnicodeRange1 = this._readUInt32(this._offset);
        table._ulUnicodeRange2 = this._readUInt32(this._offset);
        table._ulUnicodeRange3 = this._readUInt32(this._offset);
        table._ulUnicodeRange4 = this._readUInt32(this._offset);
        table._vendorIdentifier = this._readBytes(4);
        table._fsSelection = this._readUInt16(this._offset);
        table._usFirstCharIndex = this._readUInt16(this._offset);
        table._usLastCharIndex = this._readUInt16(this._offset);
        table._sTypoAscender = this._readInt16(this._offset);
        table._sTypoDescender = this._readInt16(this._offset);
        table._sTypoLineGap = this._readInt16(this._offset);
        table._usWinAscent = this._readUInt16(this._offset);
        table._usWinDescent = this._readUInt16(this._offset);
        table._ulCodePageRange1 = this._readUInt32(this._offset);
        table._ulCodePageRange2 = this._readUInt32(this._offset);
        if (table._version > 1) {
            table._sxHeight = this._readInt16(this._offset);
            table._sCapHeight = this._readInt16(this._offset);
            table._usDefaultChar = this._readUInt16(this._offset);
            table._usBreakChar = this._readUInt16(this._offset);
            table._usMaxContext = this._readUInt16(this._offset);
        } else {
            table._sxHeight = 0;
            table._sCapHeight = 0;
            table._usDefaultChar = 0;
            table._usBreakChar = 0;
            table._usMaxContext = 0;
        }
        return table;
    }
    _readPostTable(): _TrueTypePostTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('post');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypePostTable = new _TrueTypePostTable();
        table._formatType = this._readFixed(this._offset);
        table._italicAngle = this._readFixed(this._offset);
        table._underlinePosition = this._readInt16(this._offset);
        table._underlineThickness = this._readInt16(this._offset);
        table._isFixedPitch = this._readUInt32(this._offset);
        table._minType42 = this._readUInt32(this._offset);
        table._maxType42 = this._readUInt32(this._offset);
        table._minType1 = this._readUInt32(this._offset);
        table._maxType1 = this._readUInt32(this._offset);
        return table;
    }
    _readWidthTable(glyphCount: number, unitsPerEm: number): number[] {
        const tableInfo: _TrueTypeTableInfo = this._getTable('hmtx');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const width: number[] = [];
        for (let i: number = 0; i < glyphCount; i++) {
            const glyph: _TrueTypeLongHorMetric = new _TrueTypeLongHorMetric();
            glyph._advanceWidth = this._readUInt16(this._offset);
            glyph._lsb = this._readInt16(this._offset);
            const glyphWidth: number = glyph._advanceWidth * 1000 / unitsPerEm;
            width.push(Math.floor(glyphWidth));
        }
        return width;
    }
    _readCmapTable(): _TrueTypeCmapSubTable[] {
        const tableInfo: _TrueTypeTableInfo = this._getTable('cmap');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        const table: _TrueTypeCmapTable = new _TrueTypeCmapTable();
        table._version = this._readUInt16(this._offset);
        table._tablesCount = this._readUInt16(this._offset);
        let position: number = this._offset;
        const subTables: _TrueTypeCmapSubTable[] = [];
        for (let i: number = 0; i < table._tablesCount; i++) {
            this._offset = position;
            const subTable: _TrueTypeCmapSubTable = new _TrueTypeCmapSubTable();
            subTable._platformID = this._readUInt16(this._offset);
            subTable._encodingID = this._readUInt16(this._offset);
            subTable._offset = this._readUInt32(this._offset);
            position = this._offset;
            this._readCmapSubTable(subTable);
            subTables[Number.parseInt(i.toString(), 10)] = subTable;
        }
        return subTables;
    }
    _readCmapSubTable(subTable: _TrueTypeCmapSubTable): void {
        const tableInfo: _TrueTypeTableInfo = this._getTable('cmap');
        this._offset = tableInfo._offset + subTable._offset;
        const format: _TrueTypeCmapFormat = this._readUInt16(this._offset) as _TrueTypeCmapFormat;
        const encoding: _TrueTypeCmapEncoding = this._getCmapEncoding(subTable._platformID, subTable._encodingID);
        if (encoding !== _TrueTypeCmapEncoding.unknown) {
            switch (format) {
            case _TrueTypeCmapFormat.apple:
                this._readAppleCmapTable(subTable, encoding);
                break;
            case _TrueTypeCmapFormat.microsoft:
                this._readMicrosoftCmapTable(subTable, encoding);
                break;
            case _TrueTypeCmapFormat.trimmed:
                this._readTrimmedCmapTable(subTable, encoding);
                break;
            }
        }
    }
    _readAppleCmapTable(subTable: _TrueTypeCmapSubTable, encoding: _TrueTypeCmapEncoding): void {
        const tableInfo: _TrueTypeTableInfo = this._getTable('cmap');
        this._offset = tableInfo._offset + subTable._offset;
        const table: _TrueTypeAppleCmapSubTable = new _TrueTypeAppleCmapSubTable();
        table._format = this._readUInt16(this._offset);
        table._length = this._readUInt16(this._offset);
        table._version = this._readUInt16(this._offset);
        if (this._maxMacIndex === null || typeof this._maxMacIndex === 'undefined') {
            this._maxMacIndex = 0;
        }
        for (let i: number = 0; i < 256; ++i) {
            const glyphInfo: _TrueTypeGlyph = new _TrueTypeGlyph();
            glyphInfo._index = this._readByte(this._offset) as number;
            glyphInfo._width = this._getWidth(glyphInfo._index);
            glyphInfo._charCode = i;
            this.macintosh.setValue(i, glyphInfo);
            this._addGlyph(glyphInfo, encoding);
            this._maxMacIndex = Math.max(i, this._maxMacIndex);
        }
    }
    _readMicrosoftCmapTable(subTable: _TrueTypeCmapSubTable, encoding: _TrueTypeCmapEncoding): void {
        const tableInfo: _TrueTypeTableInfo = this._getTable('cmap');
        this._offset = tableInfo._offset + subTable._offset;
        const collection: Dictionary<number, _TrueTypeGlyph> = (encoding === _TrueTypeCmapEncoding.unicode) ? this._microsoft
            : this.macintosh;
        const table: _TrueTypeMicrosoftCmapSubTable = new _TrueTypeMicrosoftCmapSubTable();
        table._format = this._readUInt16(this._offset);
        table._length = this._readUInt16(this._offset);
        table._version = this._readUInt16(this._offset);
        table._segCountX2 = this._readUInt16(this._offset);
        table._searchRange = this._readUInt16(this._offset);
        table._entrySelector = this._readUInt16(this._offset);
        table._rangeShift = this._readUInt16(this._offset);
        const segCount: number = table._segCountX2 / 2;
        table._endCount = this._readUShortArray(segCount);
        table._reservedPad = this._readUInt16(this._offset);
        table._startCount = this._readUShortArray(segCount);
        table._idDelta = this._readUShortArray(segCount);
        table._idRangeOffset = this._readUShortArray(segCount);
        const length: number = (table._length / 2 - 8) - (segCount * 4);
        table._glyphID = this._readUShortArray(length);
        let codeOffset: number = 0;
        let index: number = 0;
        for (let j: number = 0; j < segCount; j++) {
            for (let k: number = table._startCount[Number.parseInt(j.toString(), 10)]; k <=
            table._endCount[Number.parseInt(j.toString(), 10)] && k !== 65535; k++) {
                if (table._idRangeOffset[Number.parseInt(j.toString(), 10)] === 0) {
                    codeOffset = (k + table._idDelta[Number.parseInt(j.toString(), 10)]) & 65535;
                } else {
                    index = j + table._idRangeOffset[Number.parseInt(j.toString(), 10)] / 2 - segCount +
                    k - table._startCount[Number.parseInt(j.toString(), 10)];
                    if (index >= table._glyphID.length) {
                        continue;
                    }
                    codeOffset = (table._glyphID[Number.parseInt(index.toString(), 10)] +
                    table._idDelta[Number.parseInt(j.toString(), 10)]) & 65535;
                }
                const glyph: _TrueTypeGlyph = new _TrueTypeGlyph();
                glyph._index = codeOffset;
                glyph._width = this._getWidth(glyph._index);
                const id: number = (encoding === _TrueTypeCmapEncoding.symbol) ? ((k & 0xff00) === 0xf000 ? k & 0xff : k) : k;
                glyph._charCode = id;
                collection.setValue(id, glyph);
                this._addGlyph(glyph, encoding);
            }
        }
    }
    _readTrimmedCmapTable(subTable: _TrueTypeCmapSubTable, encoding: _TrueTypeCmapEncoding): void {
        const tableInfo: _TrueTypeTableInfo = this._getTable('cmap');
        this._offset = tableInfo._offset + subTable._offset;
        const table: _TrueTypeTrimmedCmapSubTable = new _TrueTypeTrimmedCmapSubTable();
        table._format = this._readUInt16(this._offset);
        table._length = this._readUInt16(this._offset);
        table._version = this._readUInt16(this._offset);
        table._firstCode = this._readUInt16(this._offset);
        table._entryCount = this._readUInt16(this._offset);
        for (let i: number = 0; i < table._entryCount; ++i) {
            const glyphInfo: _TrueTypeGlyph = new _TrueTypeGlyph();
            glyphInfo._index = this._readUInt16(this._offset);
            glyphInfo._width = this._getWidth(glyphInfo._index);
            glyphInfo._charCode = i + table._firstCode;
            this.macintosh.setValue(i, glyphInfo);
            this._addGlyph(glyphInfo, encoding);
            this._maxMacIndex = Math.max(i, this._maxMacIndex);
        }
    }
    _initializeFontName(nameTable: _TrueTypeNameTable): void {
        for (let i: number = 0; i < nameTable._recordsCount; i++) {
            const record: _TrueTypeNameRecord = nameTable._nameRecords[Number.parseInt(i.toString(), 10)];
            if (record._nameID === 1) {
                this._metrics._fontFamily = record._name;
            } else if (record._nameID === 6) {
                this._metrics._postScriptName = record._name;
            }
            if (this._metrics._fontFamily !== null && this._metrics._fontFamily !== 'undefined' &&
                this._metrics._postScriptName !== null && this._metrics._postScriptName !== 'undefined') {
                break;
            }
        }
    }
    _getTable(name: string): _TrueTypeTableInfo {
        let table: _TrueTypeTableInfo = new _TrueTypeTableInfo();
        let obj: _TrueTypeTableInfo;
        if (this._tableDirectory.containsKey(name)) {
            obj = this._tableDirectory.getValue(name);
        }
        if (obj !== null && typeof obj !== 'undefined') {
            table = obj as _TrueTypeTableInfo;
        }
        return table;
    }
    _getWidth(glyphCode: number): number {
        glyphCode = (glyphCode < this._width.length) ? glyphCode : this._width.length - 1;
        return this._width[Number.parseInt(glyphCode.toString(), 10)];
    }
    _getCmapEncoding(platformID: number, encodingID: number): _TrueTypeCmapEncoding {
        let format: _TrueTypeCmapEncoding = _TrueTypeCmapEncoding.unknown;
        if (platformID === (_TrueTypePlatformID.microsoft as number) &&
            encodingID === (_TrueTypeMicrosoftEncodingID.undefined as number)) {
            format = _TrueTypeCmapEncoding.symbol;
        } else if (platformID === (_TrueTypePlatformID.microsoft as number)
            && encodingID === (_TrueTypeMicrosoftEncodingID.unicode as number)) {
            format = _TrueTypeCmapEncoding.unicode;
        } else if (platformID === (_TrueTypePlatformID.macintosh as number)
            && encodingID === (_TrueTypeMacintoshEncodingID.roman as number)) {
            format = _TrueTypeCmapEncoding.macintosh;
        }
        return format;
    }
    _addGlyph(glyph: _TrueTypeGlyph, encoding: _TrueTypeCmapEncoding): void {
        let collection: Dictionary<number, _TrueTypeGlyph> = null;
        switch (encoding) {
        case _TrueTypeCmapEncoding.unicode:
            collection = this._microsoftGlyphs;
            break;
        case _TrueTypeCmapEncoding.macintosh:
        case _TrueTypeCmapEncoding.symbol:
            collection = this._macintoshGlyphs;
            break;
        }
        collection.setValue(glyph._index, glyph);
    }
    _initializeMetrics(nameTable: _TrueTypeNameTable, headTable: _TrueTypeHeadTable,
                       horizontalHeadTable: _TrueTypeHorizontalHeaderTable, os2Table: _TrueTypeOS2Table,
                       postTable: _TrueTypePostTable, cmapTables: _TrueTypeCmapSubTable[]): void {
        this._initializeFontName(nameTable);
        let bSymbol: boolean = false;
        for (let i: number = 0; i < cmapTables.length; i++) {
            const subTable: _TrueTypeCmapSubTable = cmapTables[Number.parseInt(i.toString(), 10)];
            const encoding: _TrueTypeCmapEncoding = this._getCmapEncoding(subTable._platformID, subTable._encodingID);
            if (encoding === _TrueTypeCmapEncoding.symbol) {
                bSymbol = true;
                break;
            }
        }
        this._metrics._isSymbol = bSymbol;
        this._metrics._macStyle = headTable._macStyle;
        this._metrics._isFixedPitch = (postTable._isFixedPitch !== 0);
        this._metrics._italicAngle = postTable._italicAngle;
        const factor: number = 1000 / headTable._unitsPerEm;
        this._metrics._winAscent = os2Table._sTypoAscender * factor;
        this._metrics._macAscent = horizontalHeadTable._ascender * factor;
        this._metrics._capHeight = (os2Table._sCapHeight !== 0) ? os2Table._sCapHeight : 0.7 * headTable._unitsPerEm * factor;
        this._metrics._winDescent = os2Table._sTypoDescender * factor;
        this._metrics._macDescent = horizontalHeadTable._descender * factor;
        this._metrics._leading = (os2Table._sTypoAscender - os2Table._sTypoDescender + os2Table._sTypoLineGap) * factor;
        this._metrics._lineGap = Math.ceil(horizontalHeadTable._lineGap * factor);
        const left: number = headTable._xMin * factor;
        const top: number = Math.ceil(this._metrics._macAscent + this._metrics._lineGap);
        const right: number = headTable._xMax * factor;
        const bottom: number = this._metrics._macDescent;
        this._metrics._fontBox = [left, top, right, bottom];
        this._metrics._stemV = 80;
        this._metrics._widthTable = this._updateWidth();
        this._metrics._contains = this._tableDirectory.containsKey('CFF');
        this._metrics._subScriptSizeFactor = headTable._unitsPerEm / os2Table._ySubscriptYSize;
        this._metrics._superscriptSizeFactor = headTable._unitsPerEm / os2Table._ySuperscriptYSize;
    }
    _updateWidth(): number[] {
        const count: number = 256;
        const bytes: number[] = [];
        if (this._metrics._isSymbol) {
            for (let i: number = 0; i < count; i++) {
                const glyphInfo: _TrueTypeGlyph = this._getGlyph(String.fromCharCode(Number.parseInt(i.toString(), 10)));
                bytes[Number.parseInt(i.toString(), 10)] = (glyphInfo._empty) ? 0 : glyphInfo._width;
            }
        } else {
            const byteToProcess: number[] = [];
            const unknown: string = '?';
            const space: string = String.fromCharCode(32);
            for (let i: number = 0; i < count; i++) {
                byteToProcess[0] = Number.parseInt(i.toString(), 10);
                const text: string = this._getString(byteToProcess, 0, byteToProcess.length);
                const ch: string = (text.length > 0) ? text[0] : unknown;
                let glyphInfo: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyphInfo._empty) {
                    bytes[Number.parseInt(i.toString(), 10)] = glyphInfo._width;
                } else {
                    glyphInfo = this._getGlyph(space);
                    bytes[Number.parseInt(i.toString(), 10)] = (glyphInfo._empty) ? 0 : glyphInfo._width;
                }
            }
        }
        return bytes;
    }
    _getDefaultGlyph(): _TrueTypeGlyph {
        const glyph: _TrueTypeGlyph = this._getGlyph(_StringTokenizer._whiteSpace);
        return glyph;
    }
    _getString(byteToProcess: number[], start: number, length: number): string {
        let result: string = '';
        for (let index: number = 0; index < length; index++) {
            result += String.fromCharCode(byteToProcess[index + start]);
        }
        return result;
    }
    _setOffset(offset: number): void {
        this._offset = offset;
    }
    _readFontProgram(chars: Dictionary<string, string>): number[] {
        const glyphChars: Dictionary<number, number> = this._getGlyphChars(chars);
        const locaTable: _TrueTypeLocaTable = this._readLocaTable(this._bIsLocaShort);
        if (glyphChars && glyphChars._size() < chars._size()) {
            this._missedGlyphs = chars._size() - glyphChars._size();
        }
        this._updateGlyphChars(glyphChars, locaTable);
        const result1: { glyphTableSize: number, newLocaTable: number[], newGlyphTable: number[] } = this._generateGlyphTable(glyphChars,
                                                                                                                              locaTable,
                                                                                                                              null,
                                                                                                                              null);
        const glyphTableSize: number = result1.glyphTableSize;
        const newLocaTable: number[] = result1.newLocaTable;
        const newGlyphTable: number[] = result1.newGlyphTable;
        const result2: { newLocaUpdated: number[], newLocaSize: number } = this._updateLocaTable(newLocaTable, this._bIsLocaShort);
        const newLocaSize: number = result2.newLocaSize;
        const newLocaUpdated: number[] = result2.newLocaUpdated;
        const fontProgram: number[] = this._getFontProgram(newLocaUpdated, newGlyphTable, glyphTableSize, newLocaSize);
        return fontProgram;
    }
    _generateGlyphTable(glyphChars: Dictionary<number, number>, locaTable: _TrueTypeLocaTable, newLocaTable: number[], newGlyphTable:
    number[]): { glyphTableSize: number, newLocaTable: number[], newGlyphTable: number[] } {
        newLocaTable = [];
        const activeGlyphs: number[] = glyphChars.keys();
        activeGlyphs.sort((a: number, b: number) => a - b);
        let glyphSize: number = 0;
        for (let i: number = 0; i < activeGlyphs.length; i++) {
            const glyphIndex: number = activeGlyphs[Number.parseInt(i.toString(), 10)];
            if (locaTable._offsets.length > 0) {
                glyphSize += locaTable._offsets[glyphIndex + 1] - locaTable._offsets[Number.parseInt(glyphIndex.toString(), 10)];
            }
        }
        const glyphSizeAligned: number = this._align(glyphSize);
        newGlyphTable = [];
        for (let i: number = 0; i < glyphSizeAligned; i++) {
            newGlyphTable.push(0);
        }
        let nextGlyphOffset: number = 0;
        let nextGlyphIndex: number = 0;
        const table: _TrueTypeTableInfo = this._getTable('glyf');
        for (let i: number = 0; i < locaTable._offsets.length; i++) {
            newLocaTable.push(nextGlyphOffset);
            if (nextGlyphIndex < activeGlyphs.length && activeGlyphs[Number.parseInt(nextGlyphIndex.toString(), 10)] === i) {
                ++nextGlyphIndex;
                newLocaTable[Number.parseInt(i.toString(), 10)] = nextGlyphOffset;
                const oldGlyphOffset: number = locaTable._offsets[Number.parseInt(i.toString(), 10)];
                const oldNextGlyphOffset: number = locaTable._offsets[i + 1] - oldGlyphOffset;
                if (oldNextGlyphOffset > 0) {
                    this._offset = table._offset + oldGlyphOffset;
                    const result: { buffer: number[], written: number } = this._read(newGlyphTable, nextGlyphOffset, oldNextGlyphOffset);
                    newGlyphTable = result.buffer;
                    nextGlyphOffset += oldNextGlyphOffset;
                }
            }
        }
        return { glyphTableSize: glyphSize, newLocaTable: newLocaTable, newGlyphTable: newGlyphTable };
    }
    _readLocaTable(bShort: boolean): _TrueTypeLocaTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('loca');
        this._offset = tableInfo._offset;
        const table: _TrueTypeLocaTable = new _TrueTypeLocaTable();
        let buffer: number[] = [];
        if (bShort) {
            const len: number = tableInfo._length / 2;
            buffer = [];
            for (let i: number = 0; i < len; i++) {
                buffer[Number.parseInt(i.toString(), 10)] = this._readUInt16(this._offset) * 2;
            }
        } else {
            const len: number = tableInfo._length / 4;
            buffer = [];
            for (let i: number = 0; i < len; i++) {
                buffer[Number.parseInt(i.toString(), 10)] = this._readUInt32(this._offset);
            }
        }
        table._offsets = buffer;
        return table;
    }
    _updateGlyphChars(glyphChars: Dictionary<number, number>, locaTable: _TrueTypeLocaTable): void {
        if (!glyphChars.containsKey(0)) {
            glyphChars.setValue(0, 0);
        }
        const clone: Dictionary<number, number> = new Dictionary<number, number>();
        const glyphCharKeys: number[] = glyphChars.keys();
        for (let i: number = 0; i < glyphCharKeys.length; i++) {
            clone.setValue(glyphCharKeys[Number.parseInt(i.toString(), 10)],
                           glyphChars.getValue(glyphCharKeys[Number.parseInt(i.toString(), 10)]));
        }
        for (let i: number = 0; i < glyphCharKeys.length; i++) {
            const nextKey: number = glyphCharKeys[Number.parseInt(i.toString(), 10)];
            this._processCompositeGlyph(glyphChars, nextKey, locaTable);
        }
    }
    _processCompositeGlyph(glyphChars: Dictionary<number, number>, glyph: number, locaTable: _TrueTypeLocaTable): void {
        if (glyph < locaTable._offsets.length - 1) {
            const glyphOffset: number = locaTable._offsets[Number.parseInt(glyph.toString(), 10)];
            if (glyphOffset !== locaTable._offsets[glyph + 1]) {
                const tableInfo: _TrueTypeTableInfo = this._getTable('glyf');
                this._offset = tableInfo._offset + glyphOffset;
                const glyphHeader: _TrueTypeGlyphHeader = new _TrueTypeGlyphHeader();
                glyphHeader.numberOfContours = this._readInt16(this._offset);
                glyphHeader.xMin = this._readInt16(this._offset);
                glyphHeader.yMin = this._readInt16(this._offset);
                glyphHeader.xMax = this._readInt16(this._offset);
                glyphHeader.yMax = this._readInt16(this._offset);
                if (glyphHeader.numberOfContours < 0) {
                    let skipBytes: number = 0;
                    const entry: boolean = true;
                    while (entry) {
                        const flags: number = this._readUInt16(this._offset);
                        const glyphIndex: number = this._readUInt16(this._offset);
                        if (!glyphChars.containsKey(glyphIndex)) {
                            glyphChars.setValue(glyphIndex, 0);
                        }
                        if ((flags & _TrueTypeCompositeGlyphFlag.MoreComponents) === 0) {
                            break;
                        }
                        skipBytes = ((flags & _TrueTypeCompositeGlyphFlag.Arg1And2AreWords) !== 0) ? 4 : 2;
                        if ((flags & _TrueTypeCompositeGlyphFlag.WeHaveScale) !== 0) {
                            skipBytes += 2;
                        } else if ((flags & _TrueTypeCompositeGlyphFlag.WeHaveAnXyScale) !== 0) {
                            skipBytes += 4;
                        } else if ((flags & _TrueTypeCompositeGlyphFlag.WeHaveTwoByTwo) !== 0) {
                            skipBytes += 2 * 4;
                        }
                        this._offset += skipBytes;
                    }
                }
            }
        }
    }
    _updateLocaTable(newLocaTable: number[], bLocaIsShort: boolean): { newLocaUpdated: number[], newLocaSize: number } {
        const size: number = (bLocaIsShort) ? newLocaTable.length * 2 : newLocaTable.length * 4;
        const count: number = this._align(size);
        const writer: _BigEndianWriter = new _BigEndianWriter(count);
        for (let i: number = 0; i < newLocaTable.length; i++) {
            let value: number = newLocaTable[Number.parseInt(i.toString(), 10)];
            if (bLocaIsShort) {
                value /= 2;
                writer._writeShort(value);
            } else {
                writer._writeInt(value);
            }
        }
        return { newLocaUpdated: writer._data, newLocaSize: size };
    }
    _align(value: number): number {
        return (value + 3) & (~3);
    }
    _getFontProgram(newLocaTableOut: number[], newGlyphTable: number[], glyphTableSize: number, locaTableSize: number): number[] {
        const result: {fontProgramLength: number, table: number} = this._getFontProgramLength(newLocaTableOut, newGlyphTable, 0);
        const fontProgramLength: number = result.fontProgramLength;
        const table: number = result.table;
        const writer: _BigEndianWriter = new _BigEndianWriter(fontProgramLength);
        writer._writeInt(0x10000);
        writer._writeShort(table);
        const entrySelector: number = this._entrySelectors[Number.parseInt(table.toString(), 10)];
        writer._writeShort((1 << (entrySelector & 31)) * 16);
        writer._writeShort(entrySelector);
        writer._writeShort((table - (1 << (entrySelector & 31))) * 16);
        this._writeCheckSums(writer, table, newLocaTableOut, newGlyphTable, glyphTableSize, locaTableSize);
        this._writeGlyphs(writer, newLocaTableOut, newGlyphTable);
        return writer._data;
    }
    _getFontProgramLength(newLocaTableOut: number[], newGlyphTable: number[], table: number):
    {fontProgramLength: number, table: number} {
        let fontProgramLength: number = 0;
        if (newLocaTableOut !== null && typeof newLocaTableOut !== 'undefined' && newLocaTableOut.length > 0 &&
            newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            table = 2;
            const tableNames: string[] = this._tableNames;
            for (let i: number = 0; i < tableNames.length; i++) {
                const tableName: string = tableNames[Number.parseInt(i.toString(), 10)];
                if (tableName !== 'glyf' && tableName !== 'loca') {
                    const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                    if (!tableInfo._empty) {
                        ++table;
                        fontProgramLength += this._align(tableInfo._length);
                    }
                }
            }
            fontProgramLength += newLocaTableOut.length;
            fontProgramLength += newGlyphTable.length;
            const usedTablesSize: number = table * 16 + (3 * 4);
            fontProgramLength += usedTablesSize;
        }
        return { fontProgramLength: fontProgramLength, table: table};
    }
    _getGlyphChars(chars: Dictionary<string, string>): Dictionary<number, number> {
        const dictionary: Dictionary<number, number> = new Dictionary<number, number>();
        if (chars !== null && typeof chars !== 'undefined') {
            const charKeys: string[] = chars.keys();
            for (let i: number = 0; i < charKeys.length; i++) {
                const ch: string = charKeys[Number.parseInt(i.toString(), 10)];
                const glyph: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyph._empty) {
                    dictionary.setValue(glyph._index, ch.charCodeAt(0));
                }
            }
        }
        return dictionary;
    }
    _writeCheckSums(writer: _BigEndianWriter, table: number, newLocaTableOut: number[], newGlyphTable: number[], glyphTableSize: number,
                    locaTableSize: number): void {
        if (writer !== null && typeof writer !== 'undefined' && newLocaTableOut !== null && typeof newLocaTableOut !== 'undefined' &&
        newLocaTableOut.length > 0 && newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            const tableNames: string[] = this._tableNames;
            let usedTablesSize: number = table * 16 + (3 * 4);
            let nextTableSize: number = 0;
            for (let i: number = 0; i < tableNames.length; i++) {
                const tableName: string = tableNames[Number.parseInt(i.toString(), 10)];
                const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                if (tableInfo._empty) {
                    continue;
                }
                writer._writeString(tableName);
                if (tableName === 'glyf') {
                    const checksum: number = this._calculateCheckSum(newGlyphTable);
                    writer._writeInt(checksum);
                    nextTableSize = glyphTableSize;
                } else if (tableName === 'loca') {
                    const checksum: number = this._calculateCheckSum(newLocaTableOut);
                    writer._writeInt(checksum);
                    nextTableSize = locaTableSize;
                } else {
                    writer._writeInt(tableInfo._checksum);
                    nextTableSize = tableInfo._length;
                }
                writer._writeUInt(usedTablesSize);
                writer._writeUInt(nextTableSize);
                usedTablesSize += this._align(nextTableSize);
            }
        }
    }
    _calculateCheckSum(bytes: number[]): number {
        let pos: number = 0;
        let byte1: number = 0;
        let byte2: number = 0;
        let byte3: number = 0;
        let byte4: number = 0;
        let result: number = 0;
        if (bytes !== null && typeof bytes !== 'undefined' && bytes.length > 0) {
            for (let i: number = 0; i < (bytes.length + 1) / 4; i++) {
                byte4 += (bytes[pos++] & 255);
                byte3 += (bytes[pos++] & 255);
                byte2 += (bytes[pos++] & 255);
                byte1 += (bytes[pos++] & 255);
            }
            result = byte1;
            result += (byte2 << 8);
            result += (byte3 << 16);
            result += (byte4 << 24);
        }
        return result;
    }
    _writeGlyphs(writer: _BigEndianWriter, newLocaTable: number[], newGlyphTable: number[]): void {
        if (writer !== null && typeof writer !== 'undefined' && newLocaTable !== null && typeof newLocaTable !== 'undefined' &&
        newLocaTable.length > 0 && newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            const tableNames: string[] = this._tableNames;
            for (let i: number = 0; i < tableNames.length; i++) {
                const tableName: string = tableNames[Number.parseInt(i.toString(), 10)];
                const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                if (tableInfo._empty) {
                    continue;
                }
                if (tableName === 'glyf') {
                    writer._writeBytes(newGlyphTable);
                } else if (tableName === 'loca') {
                    writer._writeBytes(newLocaTable);
                } else {
                    const count: number = this._align(tableInfo._length);
                    const buff: number[] = [];
                    for (let i: number = 0; i < count; i++) {
                        buff.push(0);
                    }
                    this._offset = tableInfo._offset;
                    const result: {buffer: number[], written: number} = this._read(buff, 0, tableInfo._length);
                    writer._writeBytes(result.buffer);
                }
            }
        }
    }
    _read(buffer: number[], index: number, count: number): { buffer: number[], written: number } {
        let written: number = 0;
        if (buffer !== null && typeof buffer !== 'undefined' && buffer.length > 0) {
            let read: number = 0;
            do {
                for (let i: number = 0; (i < count - written) && (this._offset + i < this._fontData.length); i++) {
                    buffer[index + i] = this._fontData[this._offset + i];
                }
                read = count - written;
                this._offset += read;
                written += read;
            } while (written < count);
        }
        return { buffer: buffer, written: written };
    }
    _createInternals(): void {
        this._metrics = new _TrueTypeMetrics();
        const nameTable: _TrueTypeNameTable = this._readNameTable();
        const headTable: _TrueTypeHeadTable = this._readHeadTable();
        this._bIsLocaShort = (headTable._indexToLocalFormat === 0);
        const horizontalHeadTable: _TrueTypeHorizontalHeaderTable = this._readHorizontalHeaderTable();
        const os2Table: _TrueTypeOS2Table = this._readOS2Table();
        const postTable: _TrueTypePostTable = this._readPostTable();
        this._width = this._readWidthTable(horizontalHeadTable._numberOfHMetrics, headTable._unitsPerEm);
        const subTables: _TrueTypeCmapSubTable[] = this._readCmapTable();
        this._initializeMetrics(nameTable, headTable, horizontalHeadTable, os2Table, postTable, subTables);
    }
    _getGlyph(charCode: string ): _TrueTypeGlyph
    _getGlyph(charCode: number ): _TrueTypeGlyph
    _getGlyph(charCode?: string | number): _TrueTypeGlyph {
        if (typeof charCode === 'number') {
            let obj1: object = null;
            if (!this._metrics._isSymbol && this._microsoftGlyphs !== null) {
                if (this._microsoftGlyphs.containsKey(charCode)) {
                    obj1 = this._microsoftGlyphs.getValue(charCode);
                }
            } else if (this._metrics._isSymbol && this._macintoshGlyphs !== null) {
                if (this._macintoshGlyphs.containsKey(charCode)) {
                    obj1 = this._macintoshGlyphs.getValue(charCode);
                }
            }
            const glyph: _TrueTypeGlyph = (obj1 !== null) ? obj1 as _TrueTypeGlyph : this._getDefaultGlyph();
            return glyph;
        } else {
            let obj: object = null;
            let code: number = charCode.charCodeAt(0);
            if (!this._metrics._isSymbol && this._microsoft !== null) {
                if (this._microsoft.containsKey(code)) {
                    obj = this._microsoft.getValue(code);
                    if (code !== _StringTokenizer._whiteSpace.charCodeAt(0)) {
                        this._isFontPresent = true;
                    }
                } else if (code !== _StringTokenizer._whiteSpace.charCodeAt(0)) {
                    this._isFontPresent = false;
                }
            } else if (this._metrics._isSymbol && this.macintosh !== null || this._isMacFont) {
                if (this._maxMacIndex !== 0) {
                    code %= this._maxMacIndex + 1;
                } else {
                    code = ((code & 0xff00) === 0xf000 ? code & 0xff : code);
                }
                if (this.macintosh.containsKey(code)) {
                    obj = this.macintosh.getValue(code);
                    this._isFontPresent = true;
                }
            }
            if (charCode === _StringTokenizer._whiteSpace && obj === null) {
                obj = new _TrueTypeGlyph();
            }
            const glyph: _TrueTypeGlyph = (obj !== null) ? obj as _TrueTypeGlyph : this._getDefaultGlyph();
            return glyph;
        }
    }
    _readString(length: number): string
    _readString(length: number, isUnicode: boolean): string
    _readString(length: number, isUnicode?: boolean): string {
        if (typeof isUnicode === 'undefined' || isUnicode === null) {
            return this._readString(length, false);
        } else {
            let result: string = '';
            if (isUnicode) {
                for (let i: number = 0; i < length; i++) {
                    if (i % 2 !== 0) {
                        result += String.fromCharCode(this._fontData[this._offset]);
                    }
                    this._offset += 1;
                }
            } else {
                for (let i: number = 0; i < length; i++) {
                    result += String.fromCharCode(this._fontData[this._offset]);
                    this._offset += 1;
                }
            }
            return result;
        }
    }
    _readFixed(offset: number): number {
        const integer: number = this._readInt16(offset);
        const sFraction: number = this._readInt16(offset + 2);
        const fraction: number = sFraction / 16384;
        return integer + fraction;
    }
    _readInt32(offset: number): number {
        const i1: number = this._fontData[Number.parseInt(offset.toString(), 10) + 3];
        const i2: number = this._fontData[Number.parseInt(offset.toString(), 10) + 2];
        const i3: number = this._fontData[Number.parseInt(offset.toString(), 10) + 1];
        const i4: number = this._fontData[Number.parseInt(offset.toString(), 10)];
        this._offset += 4;
        return i1 + (i2 << 8) + (i3 << 16) + (i4 << 24);
    }
    _readUInt32(offset: number): number {
        const i1: number = this._fontData[Number.parseInt(offset.toString(), 10) + 3];
        const i2: number = this._fontData[Number.parseInt(offset.toString(), 10) + 2];
        const i3: number = this._fontData[Number.parseInt(offset.toString(), 10) + 1];
        const i4: number = this._fontData[Number.parseInt(offset.toString(), 10)];
        this._offset += 4;
        return (i1 | i2 << 8 | i3 << 16 | i4 << 24);
    }
    _readInt16(offset: number): number {
        let result: number = (this._fontData[Number.parseInt(offset.toString(), 10)] << 8) +
        this._fontData[Number.parseInt(offset.toString(), 10) + 1];
        result = result & (1 << 15) ? result - 0x10000 : result;
        this._offset += 2;
        return result;
    }
    _readInt64(offset: number): number {
        const low: number = this._readInt32(offset + 4);
        let n: number = this._readInt32(offset) * 4294967296.0 + low;
        if (low < 0) {
            n += 4294967296;
        }
        return n;
    }
    _readUInt16(offset: number): number {
        const result: number = (this._fontData[Number.parseInt(offset.toString(), 10)] << 8) |
        this._fontData[Number.parseInt(offset.toString(), 10) + 1];
        this._offset += 2;
        return result;
    }
    _readUShortArray(length: number): number[] {
        const buffer: number[] = [];
        for (let i: number = 0; i < length; i++) {
            buffer[Number.parseInt(i.toString(), 10)] = this._readUInt16(this._offset);
        }
        return buffer;
    }
    _readBytes(length: number): number[] {
        const result: number[] = [];
        for (let i: number = 0; i < length; i++) {
            result.push(this._fontData[Number.parseInt(this._offset.toString(), 10)]);
            this._offset += 1;
        }
        return result;
    }
    _readByte(offset: number): number {
        const result: number = this._fontData[Number.parseInt(offset.toString(), 10)];
        this._offset += 1;
        return result;
    }
    _getCharacterWidth(code: string): number {
        let glyphInfo: _TrueTypeGlyph = this._getGlyph(code);
        glyphInfo = (!glyphInfo._empty) ? glyphInfo : this._getDefaultGlyph();
        const codeWidth: number = (!glyphInfo._empty) ? glyphInfo._width : 0;
        return codeWidth;
    }
    _convertString(text: string): string {
        let glyph: string = '';
        if (text !== null && text !== undefined && text.length > 0) {
            for (let k: number = 0; k < text.length; k++) {
                const ch: string = text[Number.parseInt(k.toString(), 10)];
                const glyphInfo: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyphInfo._empty) {
                    glyph += String.fromCharCode(glyphInfo._index);
                }
            }
        }
        return glyph;
    }
}
export class _TrueTypeNameRecord {
    _platformID: number;
    _encodingID: number;
    _languageID: number;
    _nameID: number;
    _length: number;
    _offset: number;
    _name: string;
}
export class _TrueTypeMetrics {
    _lineGap: number;
    _contains: boolean;
    _isSymbol: boolean;
    _isFixedPitch: boolean;
    _italicAngle: number;
    _postScriptName: string;
    _fontFamily: string;
    _capHeight: number;
    _leading: number;
    _macAscent: number;
    _macDescent: number;
    _winDescent: number;
    _winAscent: number;
    _stemV: number;
    _widthTable: number[];
    _macStyle: number;
    _subScriptSizeFactor: number;
    _superscriptSizeFactor: number;
    _fontBox: number[];
    get _isItalic(): boolean {
        return ((this._macStyle & 2) !== 0);
    }
    get _isBold(): boolean {
        return ((this._macStyle & 1) !== 0);
    }
}
export class _TrueTypeLongHorMetric {
    _advanceWidth: number;
    _lsb: number;
}
export class _TrueTypeGlyph {
    _index: number;
    _width: number;
    _charCode: number;
    get _empty(): boolean {
        return (this._index === this._width && this._width === this._charCode && this._charCode === 0);
    }
}
export class _TrueTypeLocaTable {
    _offsets: number[];
}
export class _TrueTypeGlyphHeader {
    numberOfContours: number;
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}
export class _BigEndianWriter {
    readonly int32Size: number = 4;
    readonly int16Size: number = 2;
    readonly int64Size: number = 8;
    _buffer: number[];
    _bufferLength: number;
    _internalPosition: number;
    get _data(): number[] {
        if (this._buffer.length < this._bufferLength) {
            const length: number = this._bufferLength - this._buffer.length;
            for (let i: number = 0; i < length; i++) {
                this._buffer.push(0);
            }
        }
        return this._buffer;
    }
    get _position(): number {
        if (typeof this._internalPosition === 'undefined' || this._internalPosition === null) {
            this._internalPosition = 0;
        }
        return this._internalPosition;
    }
    constructor(capacity: number) {
        this._bufferLength = capacity;
        this._buffer = [];
    }
    _writeShort(value: number): void {
        const bytes: number[] = [((value & 0x0000ff00) >> 8), value & 0x000000ff];
        this._flush(bytes);
    }
    _writeInt(value: number): void {
        const bytes: number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff];
        this._flush(bytes);
    }
    _writeUInt(value: number): void {
        const buff: number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff];
        this._flush(buff);
    }
    _writeString(value: string): void {
        if (value !== null && typeof value !== 'undefined') {
            const bytes: number[] = [];
            for (let i: number = 0; i < value.length; i++) {
                bytes.push(value.charCodeAt(i));
            }
            this._flush(bytes);
        }
    }
    _writeBytes(value: number[]): void {
        this._flush(value);
    }
    _flush(buff: number[]): void {
        if (buff !== null && typeof buff !== 'undefined') {
            let position: number = this._position;
            for (let i: number = 0; i < buff.length; i++) {
                this._buffer[Number.parseInt(position.toString(), 10)] = buff[Number.parseInt(i.toString(), 10)];
                position++;
            }
            this._internalPosition += buff.length;
        }
    }
}
