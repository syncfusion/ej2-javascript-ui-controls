import { _TrueTypeTableInfo, _TrueTypeHorizontalHeaderTable, _TrueTypeNameTable, _TrueTypeHeadTable, _TrueTypeOS2Table, _TrueTypePostTable, _TrueTypeCmapSubTable, _TrueTypeCmapTable, _TrueTypeAppleCmapSubTable, _TrueTypeMicrosoftCmapSubTable, _TrueTypeTrimmedCmapSubTable } from './ttf-table';
import { Dictionary } from '../pdf-primitives';
import { _StringTokenizer } from './string-layouter';
import { _TrueTypeCmapFormat, _TrueTypeCmapEncoding, _TrueTypePlatformID, _TrueTypeMicrosoftEncodingID, _TrueTypeMacintoshEncodingID, _TrueTypeCompositeGlyphFlag } from '../../core/enumerator';
/**
 * Reads and parses truetype and opentype font data into accessible tables and metrics.
 *
 * @private
 */
export class _TrueTypeReader {
    /**
     * Raw TrueType font data.
     *
     * @private
     */
    _fontData: Uint8Array;
    /**
     * Size (in bytes) of a 32-bit integer.
     *
     * @private
     */
    readonly _int32Size: number = 4;
    /**
     * Current offset within the font data.
     *
     * @private
     */
    _offset: number;
    /**
     * Table directory mapping table names to offsets and sizes.
     *
     * @private
     */
    _tableDirectory: Dictionary<string, _TrueTypeTableInfo>;
    /**
     * Indicates whether the provided data represents a TrueType font.
     *
     * @private
     */
    _isFont: boolean = false;
    /**
     * Indicates whether the font uses Macintosh-specific structures.
     *
     * @private
     */
    _isMacTtf: boolean = false;
    /**
     * Lowest encountered table position used for validation.
     *
     * @private
     */
    _lowestPosition: number;
    /**
     * Extracted TrueType metrics.
     *
     * @private
     */
    _metrics: _TrueTypeMetrics;
    /**
     * Maximum glyph index used for Macintosh cmap.
     *
     * @private
     */
    _maxMacIndex: number;
    /**
     * Indicates whether the font resource is present.
     *
     * @private
     */
    _isFontPresent: boolean;
    /**
     * Indicates whether the font is a Macintosh font.
     *
     * @private
     */
    _isMacFont: boolean = false;
    /**
     * Tracks the lowest code point missing from the glyph set.
     *
     * @private
     */
    _missedGlyphs: number = 0;
    /**
     * List of required TrueType table names.
     *
     * @private
     */
    _tableNames: string[] = ['cvt ', 'fpgm', 'glyf', 'head', 'hhea', 'hmtx', 'loca', 'maxp', 'prep'];
    /**
     * Entry selector values used to build the search tree.
     *
     * @private
     */
    _entrySelectors: number[] = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
    /**
     * Glyph advance width array indexed by glyph ID.
     *
     * @private
     */
    _width: number[];
    /**
     * Indicates whether the 'loca' table uses short format.
     *
     * @private
     */
    _bIsLocaShort: boolean;
    /**
     * Dictionary of glyphs for Macintosh encoding.
     *
     * @private
     */
    _macintoshDictionary: Dictionary<number, _TrueTypeGlyph>;
    /**
     * Dictionary of glyphs for Microsoft encoding.
     *
     * @private
     */
    _microsoftDictionary: Dictionary<number, _TrueTypeGlyph>;
    /**
     * Internal cache of Macintosh glyphs.
     *
     * @private
     */
    _internalMacintoshGlyphs: Dictionary<number, _TrueTypeGlyph>;
    /**
     * Internal cache of Microsoft glyphs.
     *
     * @private
     */
    _internalMicrosoftGlyphs: Dictionary<number, _TrueTypeGlyph>;
    /**
     * Indicates whether the font is OpenType flavored.
     *
     * @private
     */
    _isOpenType: boolean = false;
    get macintosh(): Dictionary<number, _TrueTypeGlyph> {
        if (this._macintoshDictionary === null || typeof this._macintoshDictionary === 'undefined') {
            this._macintoshDictionary = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._macintoshDictionary;
    }
    /**
     * Gets the internal microsoft glyph index mapping used for unicode mode.
     *
     * @private
     * @returns {Dictionary<number, _TrueTypeGlyph>} Microsoft glyph dictionary.
     */
    get _microsoft(): Dictionary<number, _TrueTypeGlyph> {
        if (this._microsoftDictionary === null || typeof this._microsoftDictionary === 'undefined') {
            this._microsoftDictionary = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._microsoftDictionary;
    }
    /**
     * Gets the internal subset glyph map for macintosh indices.
     *
     * @private
     * @returns {Dictionary<number, _TrueTypeGlyph>} Microsoft glyph dictionary.
     */
    get _macintoshGlyphs(): Dictionary<number, _TrueTypeGlyph> {
        if (this._internalMacintoshGlyphs === null || typeof this._internalMacintoshGlyphs === 'undefined') {
            this._internalMacintoshGlyphs = new Dictionary<number, _TrueTypeGlyph>();
        }
        return this._internalMacintoshGlyphs;
    }
    /**
     * Gets the internal subset glyph map for microsoft indices.
     *
     * @private
     * @returns {Dictionary<number, _TrueTypeGlyph>} Internal microsoft glyphs map.
     */
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
    /**
     * Initializes internal metrics, reads core tables, and sets basic font properties.
     *
     * @private
     * @returns {void} nothing.
     */
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
    /**
     * Reads the table directory and builds the internal table map from the font data.
     *
     * @private
     * @returns {void} nothing.
     */
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
    /**
     * Normalizes table offsets when the directory is not at the expected position.
     *
     * @private
     * @returns {void} nothing.
     */
    _fixOffsets(): void {
        let minOffset: number = Number.MAX_VALUE;
        const tableKeys: string[] = this._tableDirectory.keys();
        for (let i: number = 0; i < tableKeys.length; i++) {
            const value: _TrueTypeTableInfo = this._tableDirectory.getValue(tableKeys[<number>i]);
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
            tableKeys.forEach((key: string) => {
                const value: _TrueTypeTableInfo = this._tableDirectory.getValue(key);
                value._offset -= shift;
                table.setValue(key, value);
            });
            this._tableDirectory = table;
        }
    }
    /**
     * Checks the font container header and detects truetype collection and opentype signatures.
     *
     * @private
     * @returns {number} The sfnt version value.
     * @throws {Error} When the data is not a valid TTC/TTF.
     */
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
        if (version === 0x4f54544f) {
            this._isOpenType = true;
        }
        return version;
    }
    /**
     * Reads the name table and collects naming records for the font.
     *
     * @private
     * @returns {_TrueTypeNameTable} The parsed name table.
     */
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
            table._nameRecords[<number>i] = record;
            position += recordSize;
        }
        return table;
    }
    /**
     * Reads the head table and extracts global font header values.
     *
     * @private
     * @returns {_TrueTypeHeadTable} The parsed head table.
     */
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
    /**
     * Reads the horizontal header table and extracts ascender descender and metrics info.
     *
     * @private
     * @returns {_TrueTypeHorizontalHeaderTable} The parsed horizontal header table.
     */
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
    /**
     * Reads the os two table and extracts typographic and character range data.
     *
     * @private
     * @returns {_TrueTypeOS2Table} The parsed OS/2 table.
     */
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
    /**
     * Reads the post table and extracts italic angle fixed pitch and related fields.
     *
     * @private
     * @returns {_TrueTypePostTable} The parsed post table.
     */
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
    /**
     * Reads the horizontal metrics table and computes glyph advance widths in font units.
     * Reads the horizontal metrics table and computes glyph advance widths in font units.
     *
     * @private
     * @param {number} glyphCount - Number of horizontal metrics (hMetrics) to read.
     * @param {number} unitsPerEm - Units per em from the head table.
     * @returns {number[]} An array of glyph widths in 1000 UPM space.
     */
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
    /**
     * Reads the cmap table and loads subtable descriptors for character to glyph mapping.
     *
     * @private
     * @returns {_TrueTypeCmapSubTable[]} An array of parsed cmap subtables.
     */
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
            subTables[<number>i] = subTable;
        }
        return subTables;
    }
    /**
     * Reads a cmap subtable and dispatches to the specific format handler based on encoding.
     *
     * @private
     * @param {_TrueTypeCmapSubTable} subTable - The subtable descriptor to populate.
     * @returns {void} nothing.
     */
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
    /**
     * Parses the apple cmap format and registers macintosh glyph mappings and widths.
     *
     * @private
     * @param {_TrueTypeCmapSubTable} subTable - The cmap subtable descriptor.
     * @param {_TrueTypeCmapEncoding} encoding - Resolved cmap encoding.
     * @returns {void} nothing.
     */
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
    /**
     * Parses the microsoft cmap format and registers unicode or symbol glyph mappings and widths.
     *
     * @private
     * @param {_TrueTypeCmapSubTable} subTable - The cmap subtable descriptor.
     * @param {_TrueTypeCmapEncoding} encoding - Resolved cmap encoding.
     * @returns {void} nothing.
     */
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
            for (let k: number = table._startCount[<number>j]; k <=
                table._endCount[<number>j] && k !== 65535; k++) {
                if (table._idRangeOffset[<number>j] === 0) {
                    codeOffset = (k + table._idDelta[<number>j]) & 65535;
                } else {
                    index = j + table._idRangeOffset[<number>j] / 2 - segCount +
                        k - table._startCount[<number>j];
                    if (index >= table._glyphID.length) {
                        continue;
                    }
                    codeOffset = (table._glyphID[<number>index] +
                        table._idDelta[<number>j]) & 65535;
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
    /**
     * Parses the trimmed cmap format and registers a compact range of macintosh glyphs.
     *
     * @private
     * @param {_TrueTypeCmapSubTable} subTable - The cmap subtable descriptor.
     * @param {_TrueTypeCmapEncoding} encoding - Resolved cmap encoding.
     * @returns {void} nothing.
     */
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
    /**
     * Reads the compact font format raw bytes when present in the font.
     *
     * @private
     * @returns {number[]} Raw CFF bytes.
     */
    _readCompactFontFormatTable(): number[] {
        const tableInfo: _TrueTypeTableInfo = this._getTable('CFF ');
        if (typeof tableInfo._offset !== 'undefined' && tableInfo._offset !== null) {
            this._offset = tableInfo._offset;
        }
        return this._readBytes(tableInfo._length);
    }
    /**
     * Initializes human readable font names from the name table records.
     *
     * @private
     * @param {_TrueTypeNameTable} nameTable - The name table to extract names from.
     * @returns {void} nothing.
     */
    _initializeFontName(nameTable: _TrueTypeNameTable): void {
        for (let i: number = 0; i < nameTable._recordsCount; i++) {
            const record: _TrueTypeNameRecord = nameTable._nameRecords[<number>i];
            if (record._nameID === 1) {
                this._metrics._fontFamily = record._name;
            } else if (record._nameID === 6) {
                this._metrics._postScriptName = record._name;
            }
            if (this._metrics._fontFamily !== null && typeof this._metrics._fontFamily !== 'undefined' &&
                this._metrics._postScriptName !== null && typeof this._metrics._postScriptName !== 'undefined') {
                break;
            }
        }
    }
    /**
     * Retrieves table information by name from the directory.
     *
     * @private
     * @param {string} name - The sfnt table tag (e.g., 'head', 'cmap').
     * @returns {_TrueTypeTableInfo} The table info entry.
     */
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
    /**
     * Gets the width value for the specified glyph index with bounds protection.
     *
     * @private
     * @param {number} glyphCode - Glyph index.
     * @returns {number} The width for the glyph index.
     */
    _getWidth(glyphCode: number): number {
        glyphCode = (glyphCode < this._width.length) ? glyphCode : this._width.length - 1;
        return this._width[<number>glyphCode];
    }
    /**
     * Resolves the cmap encoding type from platform and encoding identifiers.
     *
     * @private
     * @param {number} platformID - Platform ID (e.g., Microsoft/Macintosh).
     * @param {number} encodingID - Encoding ID based on platform.
     * @returns {_TrueTypeCmapEncoding} The resolved cmap encoding.
     */
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
    /**
     * Adds a glyph mapping to the internal collection for the active encoding.
     *
     * @private
     * @param {_TrueTypeGlyph} glyph - Glyph data to add.
     * @param {_TrueTypeCmapEncoding} encoding - Encoding bucket to target.
     * @returns {void} nothing.
     */
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
        if (glyph && typeof glyph._index !== 'undefined') {
            collection.setValue(glyph._index, glyph);
        }
    }
    /**
     * Populates metrics values using multiple tables and computes scaled dimensions.
     *
     * @private
     * @param {_TrueTypeNameTable} nameTable - Name table.
     * @param {_TrueTypeHeadTable} headTable - Head table.
     * @param {_TrueTypeHorizontalHeaderTable} horizontalHeadTable - Horizontal header.
     * @param {_TrueTypeOS2Table} os2Table - OS/2 table.
     * @param {_TrueTypePostTable} postTable - Post table.
     * @param {_TrueTypeCmapSubTable[]} cmapTables - Parsed cmap subtables.
     * @returns {void} nothing.
     */
    _initializeMetrics(nameTable: _TrueTypeNameTable, headTable: _TrueTypeHeadTable,
                       horizontalHeadTable: _TrueTypeHorizontalHeaderTable, os2Table: _TrueTypeOS2Table,
                       postTable: _TrueTypePostTable, cmapTables: _TrueTypeCmapSubTable[]): void {
        this._initializeFontName(nameTable);
        let bSymbol: boolean = false;
        bSymbol = cmapTables.some((subTable: _TrueTypeCmapSubTable) => {
            const encoding: _TrueTypeCmapEncoding = this._getCmapEncoding(subTable._platformID, subTable._encodingID);
            return encoding === _TrueTypeCmapEncoding.symbol;
        });
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
        this._metrics._contains = this._tableDirectory.containsKey('CFF ');
        this._metrics._subScriptSizeFactor = headTable._unitsPerEm / os2Table._ySubscriptYSize;
        this._metrics._superscriptSizeFactor = headTable._unitsPerEm / os2Table._ySuperscriptYSize;
    }
    /**
     * Builds a width table for the first two hundred and fifty six codes using glyph lookup.
     *
     * @private
     * @returns {number[]} The width table for codes 0–255.
     */
    _updateWidth(): number[] {
        const count: number = 256;
        const bytes: number[] = [];
        if (this._metrics._isSymbol) {
            for (let i: number = 0; i < count; i++) {
                const glyphInfo: _TrueTypeGlyph = this._getGlyph(String.fromCharCode(<number>i));
                bytes[<number>i] = (glyphInfo._empty) ? 0 : glyphInfo._width;
            }
        } else {
            const byteToProcess: number[] = [];
            const unknown: string = '?';
            const space: string = String.fromCharCode(32);
            for (let i: number = 0; i < count; i++) {
                byteToProcess[0] = <number>i;
                const text: string = this._getString(byteToProcess, 0, byteToProcess.length);
                const ch: string = (text.length > 0) ? text[0] : unknown;
                let glyphInfo: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyphInfo._empty) {
                    bytes[<number>i] = glyphInfo._width;
                } else {
                    glyphInfo = this._getGlyph(space);
                    bytes[<number>i] = (glyphInfo._empty) ? 0 : glyphInfo._width;
                }
            }
        }
        return bytes;
    }
    /**
     * Returns the default glyph used when a mapping is missing.
     *
     * @private
     * @returns {_TrueTypeGlyph} The default (whitespace) glyph entry.
     */
    _getDefaultGlyph(): _TrueTypeGlyph {
        const glyph: _TrueTypeGlyph = this._getGlyph(_StringTokenizer._whiteSpace);
        return glyph;
    }
    /**
     * Converts a sequence of bytes to a string using simple code point mapping.
     *
     * @private
     * @param {number[]} byteToProcess - Bytes to convert.
     * @param {number} start - Start index within the array.
     * @param {number} length - Number of bytes to process.
     * @returns {string} The resulting string.
     */
    _getString(byteToProcess: number[], start: number, length: number): string {
        let result: string = '';
        for (let index: number = 0; index < length; index++) {
            result += String.fromCharCode(byteToProcess[index + start]);
        }
        return result;
    }
    /**
     * Sets the current read offset within the font data stream.
     *
     * @private
     * @param {number} offset - New absolute offset.
     * @returns {void} nothing.
     */
    _setOffset(offset: number): void {
        this._offset = offset;
    }
    /**
     * Produces a subset font program for the provided characters and returns raw bytes.
     *
     * @private
     * @param {Dictionary<string, string>} chars - Set of characters to include in subset.
     * @returns {number[]} The raw subset font program bytes.
     */
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
    /**
     * Assembles a new glyf table and a new loca table for the subset glyph set.
     *
     * @private
     * @param {Dictionary<number, number>} glyphChars - Glyph indices to include.
     * @param {_TrueTypeLocaTable} locaTable - Source loca table.
     * @param {number[]} newLocaTable - Output loca table buffer (ignored on input).
     * @param {number[]} newGlyphTable - Output glyf table buffer (ignored on input).
     * @returns {{ glyphTableSize: number, newLocaTable: number[], newGlyphTable: number[] }} Sizes and buffers.
     */
    _generateGlyphTable(glyphChars: Dictionary<number, number>, locaTable: _TrueTypeLocaTable, newLocaTable: number[], newGlyphTable:
    number[]): { glyphTableSize: number, newLocaTable: number[], newGlyphTable: number[] } {
        newLocaTable = [];
        const activeGlyphs: number[] = glyphChars.keys();
        activeGlyphs.sort((a: number, b: number) => a - b);
        let glyphSize: number = 0;
        activeGlyphs.forEach((glyphIndex: number) => {
            if (locaTable._offsets.length > 0) {
                glyphSize += locaTable._offsets[glyphIndex + 1] - locaTable._offsets[<number>glyphIndex];
            }
        });
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
            if (nextGlyphIndex < activeGlyphs.length && activeGlyphs[<number>nextGlyphIndex] === i) {
                ++nextGlyphIndex;
                newLocaTable[<number>i] = nextGlyphOffset;
                const oldGlyphOffset: number = locaTable._offsets[<number>i];
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
    /**
     * Reads the loca table and returns glyph offsets in long or short form.
     *
     * @private
     * @param {boolean} bShort - When `true`, read short (uint16*2) offsets; otherwise long (uint32).
     * @returns {_TrueTypeLocaTable} The parsed loca table.
     */
    _readLocaTable(bShort: boolean): _TrueTypeLocaTable {
        const tableInfo: _TrueTypeTableInfo = this._getTable('loca');
        this._offset = tableInfo._offset;
        const table: _TrueTypeLocaTable = new _TrueTypeLocaTable();
        let buffer: number[] = [];
        if (bShort) {
            const len: number = tableInfo._length / 2;
            buffer = [];
            for (let i: number = 0; i < len; i++) {
                buffer[<number>i] = this._readUInt16(this._offset) * 2;
            }
        } else {
            const len: number = tableInfo._length / 4;
            buffer = [];
            for (let i: number = 0; i < len; i++) {
                buffer[<number>i] = this._readUInt32(this._offset);
            }
        }
        table._offsets = buffer;
        return table;
    }
    /**
     * Ensures the subset includes required composite glyph components.
     *
     * @private
     * @param {Dictionary<number, number>} glyphChars - The current glyph set for subsetting.
     * @param {_TrueTypeLocaTable} locaTable - The source loca table.
     * @returns {void} nothing.
     */
    _updateGlyphChars(glyphChars: Dictionary<number, number>, locaTable: _TrueTypeLocaTable): void {
        if (!glyphChars.containsKey(0)) {
            glyphChars.setValue(0, 0);
        }
        const clone: Dictionary<number, number> = new Dictionary<number, number>();
        const glyphCharKeys: number[] = glyphChars.keys();
        glyphCharKeys.forEach((key: number) => {
            clone.setValue(key, glyphChars.getValue(key));
        });
        glyphCharKeys.forEach((nextKey: number) => {
            this._processCompositeGlyph(glyphChars, nextKey, locaTable);
        });
    }
    /**
     * Processes a composite glyph and adds referenced child glyphs to the subset list.
     *
     * @private
     * @param {Dictionary<number, number>} glyphChars - The glyph set being built.
     * @param {number} glyph - The glyph index to process.
     * @param {_TrueTypeLocaTable} locaTable - Source loca table.
     * @returns {void} nothing.
     */
    _processCompositeGlyph(glyphChars: Dictionary<number, number>, glyph: number, locaTable: _TrueTypeLocaTable): void {
        if (glyph < locaTable._offsets.length - 1) {
            const glyphOffset: number = locaTable._offsets[<number>glyph];
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
    /**
     * Encodes the new loca table in short or long form and returns the byte array.
     *
     * @private
     * @param {number[]} newLocaTable - Raw absolute offsets to encode.
     * @param {boolean} bLocaIsShort - Whether to write short form.
     * @returns {{ newLocaUpdated: number[], newLocaSize: number }} Encoded table bytes and logical size.
     */
    _updateLocaTable(newLocaTable: number[], bLocaIsShort: boolean): { newLocaUpdated: number[], newLocaSize: number } {
        const size: number = (bLocaIsShort) ? newLocaTable.length * 2 : newLocaTable.length * 4;
        const count: number = this._align(size);
        const writer: _BigEndianWriter = new _BigEndianWriter(count);
        newLocaTable.forEach((value: number) => {
            if (bLocaIsShort) {
                value /= 2;
                writer._writeShort(value);
            } else {
                writer._writeInt(value);
            }
        });
        return { newLocaUpdated: writer._data, newLocaSize: size };
    }
    /**
     * Aligns a byte count to a four byte boundary.
     *
     * @private
     * @param {number} value - Byte count to align.
     * @returns {number} The aligned byte count.
     */
    _align(value: number): number {
        return (value + 3) & (~3);
    }
    /**
     * Builds the final font program header, tables, checksums and data sections.
     *
     * @private
     * @param {number[]} newLocaTableOut - Encoded loca table bytes.
     * @param {number[]} newGlyphTable - Encoded glyf table bytes.
     * @param {number} glyphTableSize - Logical glyf table size.
     * @param {number} locaTableSize - Logical loca table size.
     * @returns {number[]} The final subset font program bytes.
     */
    _getFontProgram(newLocaTableOut: number[], newGlyphTable: number[], glyphTableSize: number, locaTableSize: number): number[] {
        const result: { fontProgramLength: number, table: number } = this._getFontProgramLength(newLocaTableOut, newGlyphTable, 0);
        const fontProgramLength: number = result.fontProgramLength;
        const table: number = result.table;
        const writer: _BigEndianWriter = new _BigEndianWriter(fontProgramLength);
        writer._writeInt(0x10000);
        writer._writeShort(table);
        const entrySelector: number = this._entrySelectors[<number>table];
        writer._writeShort((1 << (entrySelector & 31)) * 16);
        writer._writeShort(entrySelector);
        writer._writeShort((table - (1 << (entrySelector & 31))) * 16);
        this._writeCheckSums(writer, table, newLocaTableOut, newGlyphTable, glyphTableSize, locaTableSize);
        this._writeGlyphs(writer, newLocaTableOut, newGlyphTable);
        return writer._data;
    }
    /**
     * Computes the total font program length and the number of included tables.
     *
     * @private
     * @param {number[]} newLocaTableOut - Encoded loca table.
     * @param {number[]} newGlyphTable - Encoded glyf table.
     * @param {number} table - Initial table count (ignored).
     * @returns {{ fontProgramLength: number, table: number }} Total length and table count.
     */
    _getFontProgramLength(newLocaTableOut: number[], newGlyphTable: number[], table: number): { fontProgramLength: number, table: number } {
        let fontProgramLength: number = 0;
        if (newLocaTableOut !== null && typeof newLocaTableOut !== 'undefined' && newLocaTableOut.length > 0 &&
            newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            table = 2;
            const tableNames: string[] = this._tableNames;
            tableNames.forEach((tableName: string) => {
                if (tableName !== 'glyf' && tableName !== 'loca') {
                    const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                    if (!tableInfo._empty) {
                        ++table;
                        fontProgramLength += this._align(tableInfo._length);
                    }
                }
            });
            fontProgramLength += newLocaTableOut.length;
            fontProgramLength += newGlyphTable.length;
            const usedTablesSize: number = table * 16 + (3 * 4);
            fontProgramLength += usedTablesSize;
        }
        return { fontProgramLength: fontProgramLength, table: table };
    }
    /**
     * Creates a mapping from glyph indices to source characters for subsetting.
     *
     * @private
     * @param {Dictionary<string, string>} chars - Character set to map.
     * @returns {Dictionary<number, number>} Map of glyph index to Unicode code point.
     */
    _getGlyphChars(chars: Dictionary<string, string>): Dictionary<number, number> {
        const dictionary: Dictionary<number, number> = new Dictionary<number, number>();
        if (chars !== null && typeof chars !== 'undefined') {
            const charKeys: string[] = chars.keys();
            charKeys.forEach((ch: string) => {
                const glyph: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyph._empty) {
                    dictionary.setValue(glyph._index, ch.charCodeAt(0));
                }
            });
        }
        return dictionary;
    }
    /**
     * Writes table directory entries with checksums, offsets and lengths.
     *
     * @private
     * @param {_BigEndianWriter} writer - Writer to receive table directory.
     * @param {number} table - Total table count.
     * @param {number[]} newLocaTableOut - Encoded loca table bytes.
     * @param {number[]} newGlyphTable - Encoded glyf table bytes.
     * @param {number} glyphTableSize - Logical glyf table size.
     * @param {number} locaTableSize - Logical loca table size.
     * @returns {void} nothing.
     */
    _writeCheckSums(writer: _BigEndianWriter, table: number, newLocaTableOut: number[], newGlyphTable: number[], glyphTableSize: number,
                    locaTableSize: number): void {
        if (writer !== null && typeof writer !== 'undefined' && newLocaTableOut !== null && typeof newLocaTableOut !== 'undefined' &&
            newLocaTableOut.length > 0 && newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            const tableNames: string[] = this._tableNames;
            let usedTablesSize: number = table * 16 + (3 * 4);
            let nextTableSize: number = 0;
            tableNames.forEach((tableName: string) => {
                const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                if (tableInfo._empty) {
                    return;
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
            });
        }
    }
    /**
     * Calculates a big endian checksum for a byte array.
     *
     * @private
     * @param {number[]} bytes - Bytes for checksum.
     * @returns {number} The checksum value.
     */
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
    /**
     * Writes all included tables into the output font program in canonical order.
     *
     * @private
     * @param {_BigEndianWriter} writer - Destination writer.
     * @param {number[]} newLocaTable - Encoded loca table bytes.
     * @param {number[]} newGlyphTable - Encoded glyf table bytes.
     * @returns {void} nothing.
     */
    _writeGlyphs(writer: _BigEndianWriter, newLocaTable: number[], newGlyphTable: number[]): void {
        if (writer !== null && typeof writer !== 'undefined' && newLocaTable !== null && typeof newLocaTable !== 'undefined' &&
            newLocaTable.length > 0 && newGlyphTable !== null && typeof newGlyphTable !== 'undefined' && newGlyphTable.length > 0) {
            const tableNames: string[] = this._tableNames;
            tableNames.forEach((tableName: string) => {
                const tableInfo: _TrueTypeTableInfo = this._getTable(tableName);
                if (tableInfo._empty) {
                    return;
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
                    const result: { buffer: number[], written: number } = this._read(buff, 0, tableInfo._length);
                    writer._writeBytes(result.buffer);
                }
            });
        }
    }
    /**
     * Reads a range of bytes from the font data into the provided buffer.
     *
     * @private
     * @param {number[]} buffer - Destination buffer to fill.
     * @param {number} index - Start index in destination buffer.
     * @param {number} count - Number of bytes to read.
     * @returns {{ buffer: number[], written: number }} The buffer and bytes written.
     */
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
    /**
     * Creates all reader internals by loading required tables and computing metrics.
     *
     * @private
     * @returns {void} nothing.
     */
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
    /**
     * Resolves a glyph either by numeric code or by character using active encodings.
     *
     * @private
     * @param {string} charCode - Character to resolve (overload).
     * @returns {_TrueTypeGlyph} The glyph entry.
     */
    _getGlyph(charCode: string): _TrueTypeGlyph
    _getGlyph(charCode: number): _TrueTypeGlyph
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
    /**
     * Reads a string as latin or as unicode by stepping over high bytes.
     *
     * @private
     * @param {number} length - Number of bytes to read.
     * @returns {string} The decoded string.
     */
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
    /**
     * Reads a fixed number value with integer and fractional parts.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The fixed-point value.
     */
    _readFixed(offset: number): number {
        const integer: number = this._readInt16(offset);
        const sFraction: number = this._readInt16(offset + 2);
        const fraction: number = sFraction / 16384;
        return integer + fraction;
    }
    /**
     * Reads a signed thirty two bit integer in big endian order.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The signed 32-bit value.
     */
    _readInt32(offset: number): number {
        const i1: number = this._fontData[<number>offset + 3];
        const i2: number = this._fontData[<number>offset + 2];
        const i3: number = this._fontData[<number>offset + 1];
        const i4: number = this._fontData[<number>offset];
        this._offset += 4;
        return i1 + (i2 << 8) + (i3 << 16) + (i4 << 24);
    }
    /**
     * Reads an unsigned thirty two bit integer in big endian order.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The unsigned 32-bit value.
     */
    _readUInt32(offset: number): number {
        const i1: number = this._fontData[<number>offset + 3];
        const i2: number = this._fontData[<number>offset + 2];
        const i3: number = this._fontData[<number>offset + 1];
        const i4: number = this._fontData[<number>offset];
        this._offset += 4;
        return (i1 | i2 << 8 | i3 << 16 | i4 << 24);
    }
    /**
     * Reads a signed sixteen bit integer in big endian order with sign correction.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The signed 16-bit value.
     */
    _readInt16(offset: number): number {
        let result: number = (this._fontData[<number>offset] << 8) +
            this._fontData[<number>offset + 1];
        result = result & (1 << 15) ? result - 0x10000 : result;
        this._offset += 2;
        return result;
    }
    /**
     * Reads a signed sixty four bit integer composed from two big endian words.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The signed 64-bit value (as JS number).
     */
    _readInt64(offset: number): number {
        const low: number = this._readInt32(offset + 4);
        let n: number = this._readInt32(offset) * 4294967296.0 + low;
        if (low < 0) {
            n += 4294967296;
        }
        return n;
    }
    /**
     * Reads an unsigned sixteen bit integer in big endian order.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The unsigned 16-bit value.
     */
    _readUInt16(offset: number): number {
        const result: number = (this._fontData[<number>offset] << 8) |
            this._fontData[<number>offset + 1];
        this._offset += 2;
        return result;
    }
    /**
     * Reads an array of unsigned sixteen bit integers of the given length.
     *
     * @private
     * @param {number} length - Number of entries to read.
     * @returns {number[]} The array of uint16 values.
     */
    _readUShortArray(length: number): number[] {
        const buffer: number[] = [];
        for (let i: number = 0; i < length; i++) {
            buffer[<number>i] = this._readUInt16(this._offset);
        }
        return buffer;
    }
    /**
     * Reads a sequence of bytes from the current offset and advances the cursor.
     *
     * @private
     * @param {number} length - Number of bytes to read.
     * @returns {number[]} The array of bytes read.
     */
    _readBytes(length: number): number[] {
        const result: number[] = [];
        for (let i: number = 0; i < length; i++) {
            result.push(this._fontData[<number>this._offset]);
            this._offset += 1;
        }
        return result;
    }
    /**
     * Reads a single byte at the given offset and advances the cursor by one.
     *
     * @private
     * @param {number} offset - Offset to read from.
     * @returns {number} The byte value.
     */
    _readByte(offset: number): number {
        const result: number = this._fontData[<number>offset];
        this._offset += 1;
        return result;
    }
    /**
     * Returns the width for a character using glyph mapping and default fallback.
     *
     * @private
     * @param {string} code - Character whose width is requested.
     * @returns {number} The character width.
     */
    _getCharacterWidth(code: string): number {
        let glyphInfo: _TrueTypeGlyph = this._getGlyph(code);
        glyphInfo = (!glyphInfo._empty) ? glyphInfo : this._getDefaultGlyph();
        const codeWidth: number = (!glyphInfo._empty) ? glyphInfo._width : 0;
        return codeWidth;
    }
    /**
     * Converts a text string to a glyph index string using current mappings.
     *
     * @private
     * @param {string} text - Text to convert.
     * @returns {string} A string where each char is the mapped glyph index.
     */
    _convertString(text: string): string {
        let glyph: string = '';
        if (text !== null && text !== undefined && text.length > 0) {
            for (let k: number = 0; k < text.length; k++) {
                const ch: string = text[<number>k];
                const glyphInfo: _TrueTypeGlyph = this._getGlyph(ch);
                if (!glyphInfo._empty) {
                    glyph += String.fromCharCode(glyphInfo._index);
                }
            }
        }
        return glyph;
    }
}
/**
 * Holds a single name record entry from the name table.
 *
 * @private
 */
export class _TrueTypeNameRecord {
    /**
     * Platform identifier (e.g., Macintosh, Microsoft).
     *
     * @private
     */
    _platformID: number;
    /**
     * Platform-specific encoding identifier.
     *
     * @private
     */
    _encodingID: number;
    /**
     * Language identifier code.
     *
     * @private
     */
    _languageID: number;
    /**
     * Name record identifier.
     *
     * @private
     */
    _nameID: number;
    /**
     * Length of the name string in bytes.
     *
     * @private
     */
    _length: number;
    /**
     * Offset to the name string within the storage area.
     *
     * @private
     */
    _offset: number;
    /**
     * Decoded name string value.
     *
     * @private
     */
    _name: string;
}
/**
 * Stores computed truetype metrics including ascents descents widths and box data.
 *
 * @private
 */
export class _TrueTypeMetrics {
    /**
     * Gap between lines added to ascent and descent.
     *
     * @private
     */
    _lineGap: number;
    /**
     * Indicates whether the font contains the requested character.
     *
     * @private
     */
    _contains: boolean;
    /**
     * Indicates whether the font is a symbol font.
     *
     * @private
     */
    _isSymbol: boolean;
    /**
     * Indicates whether the font is fixed pitch.
     *
     * @private
     */
    _isFixedPitch: boolean;
    /**
     * Italic angle of the font in degrees.
     *
     * @private
     */
    _italicAngle: number;
    /**
     * PostScript name of the font.
     *
     * @private
     */
    _postScriptName: string;
    /**
     * Font family name.
     *
     * @private
     */
    _fontFamily: string;
    /**
     * Cap height value of the font.
     *
     * @private
     */
    _capHeight: number;
    /**
     * Leading (line spacing) value.
     *
     * @private
     */
    _leading: number;
    /**
     * Macintosh ascent metric.
     *
     * @private
     */
    _macAscent: number;
    /**
     * Macintosh descent metric.
     *
     * @private
     */
    _macDescent: number;
    /**
     * Windows descent metric.
     *
     * @private
     */
    _winDescent: number;
    /**
     * Windows ascent metric.
     *
     * @private
     */
    _winAscent: number;
    /**
     * Stem thickness value (vertical).
     *
     * @private
     */
    _stemV: number;
    /**
     * Table of glyph advance widths.
     *
     * @private
     */
    _widthTable: number[];
    /**
     * Macintosh style flags.
     *
     * @private
     */
    _macStyle: number;
    /**
     * Subscript size scale factor.
     *
     * @private
     */
    _subScriptSizeFactor: number;
    /**
     * Superscript size scale factor.
     *
     * @private
     */
    _superscriptSizeFactor: number;
    /**
     * Font bounding box values [xMin, yMin, xMax, yMax].
     *
     * @private
     */
    _fontBox: number[];
    /**
     * Indicates whether the font style includes italic according to mac style flags.
     *
     * @private
     * @returns {boolean} `true` if italic; otherwise `false`.
     */
    get _isItalic(): boolean {
        return ((this._macStyle & 2) !== 0);
    }
    /**
     * Indicates whether the font style includes bold according to mac style flags.
     *
     * @private
     * @returns {boolean} `true` if bold; otherwise `false`
     */
    get _isBold(): boolean {
        return ((this._macStyle & 1) !== 0);
    }
}
/**
 * Represents an entry of the horizontal metrics table with advance width and side bearing.
 *
 * @private
 */
export class _TrueTypeLongHorMetric {
    /**
     * Advance width for the glyph.
     *
     * @private
     */
    _advanceWidth: number;
    /**
     * Left side bearing value.
     *
     * @private
     */
    _lsb: number;
}
/**
 * Represents a glyph mapping with index width and source character code.
 *
 * @private
 */
export class _TrueTypeGlyph {
    /**
     * Glyph index in the font.
     *
     * @private
     */
    _index: number;
    /**
     * Advance width of the glyph.
     *
     * @private
     */
    _width: number;
    /**
     * Source character code mapped to this glyph.
     *
     * @private
     */
    _charCode: number;
    /**
     * Indicates whether the glyph entry is empty with zero index width and code.
     *
     * @private
     * @returns {boolean} `true` if empty; otherwise `false`.
     */
    get _empty(): boolean {
        return (this._index === this._width && this._width === this._charCode && this._charCode === 0);
    }
}
/**
 * Holds the glyph location offsets used to address entries in the glyf table.
 *
 * @private
 */
export class _TrueTypeLocaTable {
    /**
     * Offsets to glyph data within the 'glyf' table.
     *
     * @private
     */
    _offsets: number[];
}
/**
 * Represents the glyph header fields for contour count and bounds.
 *
 * @private
 */
export class _TrueTypeGlyphHeader {
    numberOfContours: number;
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}
/**
 * Writes big endian values into an internal buffer with position tracking.
 *
 * @private
 */
export class _BigEndianWriter {
    readonly int32Size: number = 4;
    readonly int16Size: number = 2;
    readonly int64Size: number = 8;
    /**
     * Internal byte buffer for assembled output.
     *
     * @private
     */
    _buffer: number[];
    /**
     * Current length of the internal buffer.
     *
     * @private
     */
    _bufferLength: number;
    /**
     * Current write position within the buffer.
     *
     * @private
     */
    _internalPosition: number;
    /**
     * Gets the internal buffer extended to the reserved capacity with zero padding.
     *
     * @private
     * @returns {number[]} The internal byte buffer.
     */
    get _data(): number[] {
        if (this._buffer.length < this._bufferLength) {
            const length: number = this._bufferLength - this._buffer.length;
            for (let i: number = 0; i < length; i++) {
                this._buffer.push(0);
            }
        }
        return this._buffer;
    }
    /**
     * Gets the current write position within the internal buffer with lazy init.
     *
     * @private
     * @returns {number} The current write position.
     */
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
    /**
     * Writes a sixteen bit signed value in big endian order to the buffer.
     *
     * @private
     * @param {number} value - Value to write.
     * @returns {void} nothing.
     */
    _writeShort(value: number): void {
        const bytes: number[] = [((value & 0x0000ff00) >> 8), value & 0x000000ff];
        this._flush(bytes);
    }
    /**
     * Writes a thirty two bit signed value in big endian order to the buffer.
     *
     * @private
     * @param {number} value - Value to write.
     * @returns {void} nothing.
     */
    _writeInt(value: number): void {
        const bytes: number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff];
        this._flush(bytes);
    }
    /**
     * Writes a thirty two bit unsigned value in big endian order to the buffer.
     *
     * @private
     * @param {number} value - Unsigned value to write.
     * @returns {void} nothing.
     */
    _writeUInt(value: number): void {
        const buff: number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff];
        this._flush(buff);
    }
    /**
     * Writes an ascii string as raw bytes to the buffer.
     *
     * @private
     * @param {string} value - ASCII string.
     * @returns {void} nothing.
     */
    _writeString(value: string): void {
        if (value !== null && typeof value !== 'undefined') {
            const bytes: number[] = [];
            for (let i: number = 0; i < value.length; i++) {
                bytes.push(value.charCodeAt(i));
            }
            this._flush(bytes);
        }
    }
    /**
     * Writes a sequence of bytes to the buffer.
     *
     * @private
     * @param {number[]} value - Bytes to write.
     * @returns {void} nothing.
     */
    _writeBytes(value: number[]): void {
        this._flush(value);
    }
    /**
     * Flushes the provided bytes into the internal buffer and advances the position.
     *
     * @private
     * @param {number[]} buff - Bytes to flush.
     * @returns {void} nothing.
     */
    _flush(buff: number[]): void {
        if (buff !== null && typeof buff !== 'undefined') {
            let position: number = this._position;
            for (let i: number = 0; i < buff.length; i++) {
                this._buffer[<number>position] = buff[<number>i];
                position++;
            }
            this._internalPosition += buff.length;
        }
    }
}
