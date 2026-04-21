import { _TrueTypeNameRecord } from './ttf-reader';
/**
 * Holds basic table information including offset length and checksum.
 *
 * @private
 */
export class _TrueTypeTableInfo {
    /**
     * Byte offset of the table from the start of the font file.
     *
     * @private
     */
    _offset: number;
    /**
     * Length of the table in bytes.
     *
     * @private
     */
    _length: number;
    /**
     * Checksum value of the table.
     *
     * @private
     */
    _checksum: number;
    /**
     * Indicates whether the table entry has zero offset length and checksum.
     *
     * @private
     * @returns {boolean} returns whether true or false.
     */
    get _empty(): boolean {
        const empty: boolean = (this._offset === this._length && this._length === this._checksum && this._checksum === 0);
        return empty;
    }
}
/**
 * Represents the OS two table containing weight width metrics and unicode ranges.
 *
 * @private
 */
export class _TrueTypeOS2Table {
    /**
     * Version of the OS/2 table.
     *
     * @private
     */
    _version: number;
    /**
     * Average character width.
     *
     * @private
     */
    _xAvgCharWidth: number;
    /**
     * Weight class (thickness) of the font.
     *
     * @private
     */
    _usWeightClass: number;
    /**
     * Width class (stretch) of the font.
     *
     * @private
     */
    _usWidthClass: number;
    /**
     * Embedding license rights flags.
     *
     * @private
     */
    _fsType: number;
    /**
     * Subscript x size.
     *
     * @private
     */
    _ySubscriptXSize: number;
    /**
     * Subscript y size.
     *
     * @private
     */
    _ySubscriptYSize: number;
    /**
     * Subscript x offset.
     *
     * @private
     */
    _ySubscriptXOffset: number;
    /**
     * Subscript y offset.
     *
     * @private
     */
    _ySubscriptYOffset: number;
    /**
     * Superscript x size.
     *
     * @private
     */
    _ySuperscriptXSize: number;
    /**
     * Superscript y size.
     *
     * @private
     */
    _ySuperscriptYSize: number;
    /**
     * Superscript x offset.
     *
     * @private
     */
    _ySuperscriptXOffset: number;
    /**
     * Superscript y offset.
     *
     * @private
     */
    _ySuperscriptYOffset: number;
    /**
     * Strikeout thickness.
     *
     * @private
     */
    _yStrikeoutSize: number;
    /**
     * Strikeout position.
     *
     * @private
     */
    _yStrikeoutPosition: number;
    /**
     * IBM font class and subclass.
     *
     * @private
     */
    _sFamilyClass: number;
    /**
     * PANOSE classification numbers.
     *
     * @private
     */
    _panose: number[];
    /**
     * Unicode range bits.
     *
     * @private
     */
    _ulUnicodeRange1: number;
    /**
     * Unicode range bits.
     *
     * @private
     */
    _ulUnicodeRange2: number;
    /**
     * Unicode range bits.
     *
     * @private
     */
    _ulUnicodeRange3: number;
    /**
     * Unicode range bits.
     *
     * @private
     */
    _ulUnicodeRange4: number;
    /**
     * Vendor identifier (four bytes).
     *
     * @private
     */
    _vendorIdentifier: number[];
    /**
     * Selection flags.
     *
     * @private
     */
    _fsSelection: number;
    /**
     * First character index covered by the font.
     *
     * @private
     */
    _usFirstCharIndex: number;
    /**
     * Last character index covered by the font.
     *
     * @private
     */
    _usLastCharIndex: number;
    /**
     * Typographic ascender.
     *
     * @private
     */
    _sTypoAscender: number;
    /**
     * Typographic descender.
     *
     * @private
     */
    _sTypoDescender: number;
    /**
     * Typographic line gap.
     *
     * @private
     */
    _sTypoLineGap: number;
    /**
     * Windows ascent.
     *
     * @private
     */
    _usWinAscent: number;
    /**
     * Windows descent.
     *
     * @private
     */
    _usWinDescent: number;
    /**
     * Code page range bits.
     *
     * @private
     */
    _ulCodePageRange1: number;
    /**
     * Code page range bits.
     *
     * @private
     */
    _ulCodePageRange2: number;
    /**
     * x height of the font.
     *
     * @private
     */
    _sxHeight: number;
    /**
     * Cap height of the font.
     *
     * @private
     */
    _sCapHeight: number;
    /**
     * Default character code (used for missing glyphs).
     *
     * @private
     */
    _usDefaultChar: number;
    /**
     * Break character code.
     *
     * @private
     */
    _usBreakChar: number;
    /**
     * Maximum context length for justification.
     *
     * @private
     */
    _usMaxContext: number;
}
/**
 * Represents the post table containing italic angle fixed pitch and type metrics.
 *
 * @private
 */
export class _TrueTypePostTable {
    /**
     * Post table format type.
     *
     * @private
     */
    _formatType: number;
    /**
     * Italic angle of the font.
     *
     * @private
     */
    _italicAngle: number;
    /**
     * Underline position.
     *
     * @private
     */
    _underlinePosition: number;
    /**
     * Underline thickness.
     *
     * @private
     */
    _underlineThickness: number;
    /**
     * Indicates whether the font is fixed pitch.
     *
     * @private
     */
    _isFixedPitch: number;
    /**
     * Minimum Type42 value.
     *
     * @private
     */
    _minType42: number;
    /**
     * Maximum Type42 value.
     *
     * @private
     */
    _maxType42: number;
    /**
     * Minimum Type1 value.
     *
     * @private
     */
    _minType1: number;
    /**
     * Maximum Type1 value.
     *
     * @private
     */
    _maxType1: number;
}

/**
 * Contains name table records including format count and string offsets.
 *
 * @private
 */
export class _TrueTypeNameTable {
    /**
     * Format selector of the name table.
     *
     * @private
     */
    _formatSelector: number;
    /**
     * Number of name records present.
     *
     * @private
     */
    _recordsCount: number;
    /**
     * Offset to the string storage area.
     *
     * @private
     */
    _offset: number;
    /**
     * Array of name records.
     *
     * @private
     */
    _nameRecords: _TrueTypeNameRecord[];
}
/**
 * Stores microsoft cmap subtable fields including segment arrays and glyph mappings.
 *
 * @private
 */
export class _TrueTypeMicrosoftCmapSubTable {
    /**
     * Format of the cmap subtable.
     *
     * @private
     */
    _format: number;
    /**
     * Length of the subtable in bytes.
     *
     * @private
     */
    _length: number;
    /**
     * Subtable version.
     *
     * @private
     */
    _version: number;
    /**
     * Segment count multiplied by two.
     *
     * @private
     */
    _segCountX2: number;
    /**
     * Search range value used in binary search.
     *
     * @private
     */
    _searchRange: number;
    /**
     * Entry selector value used in binary search.
     *
     * @private
     */
    _entrySelector: number;
    /**
     * Range shift value used in binary search.
     *
     * @private
     */
    _rangeShift: number;
    /**
     * Array of end character codes for each segment.
     *
     * @private
     */
    _endCount: number[];
    /**
     * Reserved padding (must be zero).
     *
     * @private
     */
    _reservedPad: number;
    /**
     * Array of start character codes for each segment.
     *
     * @private
     */
    _startCount: number[];
    /**
     * Delta values applied to character codes.
     *
     * @private
     */
    _idDelta: number[];
    /**
     * Offsets into glyph ID array.
     *
     * @private
     */
    _idRangeOffset: number[];
    /**
     * Glyph ID array for direct mappings.
     *
     * @private
     */
    _glyphID: number[];
}
/**
 * Represents the horizontal header table including ascender descender and metric counts.
 *
 * @private
 */
export class _TrueTypeHorizontalHeaderTable {
    /**
     * Table version.
     *
     * @private
     */
    _version: number;
    /**
     * Typographic ascender.
     *
     * @private
     */
    _ascender: number;
    /**
     * Maximum advance width value.
     *
     * @private
     */
    _advanceWidthMax: number;
    /**
     * Typographic descender.
     *
     * @private
     */
    _descender: number;
    /**
     * Number of long horizontal metrics.
     *
     * @private
     */
    _numberOfHMetrics: number;
    /**
     * Line gap for horizontal metrics.
     *
     * @private
     */
    _lineGap: number;
    /**
     * Minimum left side bearing.
     *
     * @private
     */
    _minLeftSideBearing: number;
    /**
     * Minimum right side bearing.
     *
     * @private
     */
    _minRightSideBearing: number;
    /**
     * Maximum extent (xMaxExtent).
     *
     * @private
     */
    _xMaxExtent: number;
    /**
     * Caret slope rise.
     *
     * @private
     */
    _caretSlopeRise: number;
    /**
     * Caret slope run.
     *
     * @private
     */
    _caretSlopeRun: number;
    /**
     * Metric data format.
     *
     * @private
     */
    _metricDataFormat: number;
}
/**
 * Represents the head table containing global font properties and bounding box data.
 *
 * @private
 */
export class _TrueTypeHeadTable {
    /**
     * Last modification time.
     *
     * @private
     */
    _modified: number;
    /**
     * Creation time.
     *
     * @private
     */
    _created: number;
    /**
     * Magic number to validate the head table.
     *
     * @private
     */
    _magicNumber: number;
    /**
     * Checksum adjustment value.
     *
     * @private
     */
    _checkSumAdjustment: number;
    /**
     * Font revision.
     *
     * @private
     */
    _fontRevision: number;
    /**
     * Table version.
     *
     * @private
     */
    _version: number;
    /**
     * Minimum x coordinate of the font bounding box.
     *
     * @private
     */
    _xMin: number;
    /**
     * Minimum y coordinate of the font bounding box.
     *
     * @private
     */
    _yMin: number;
    /**
     * Units per em.
     *
     * @private
     */
    _unitsPerEm: number;
    /**
     * Maximum y coordinate of the font bounding box.
     *
     * @private
     */
    _yMax: number;
    /**
     * Maximum x coordinate of the font bounding box.
     *
     * @private
     */
    _xMax: number;
    /**
     * Macintosh style flags.
     *
     * @private
     */
    _macStyle: number;
    /**
     * Global font flags.
     *
     * @private
     */
    _flags: number;
    /**
     * Lowest recommended pixel size.
     *
     * @private
     */
    _lowestReadableSize: number;
    /**
     * Direction hint for glyph rendering.
     *
     * @private
     */
    _fontDirectionHint: number;
    /**
     * Index to location format .
     *
     * @private
     */
    _indexToLocalFormat: number;
    /**
     * Glyph data format.
     *
     * @private
     */
    _glyphDataFormat: number;
}
/**
 * Defines the cmap table header including version and subtable count.
 *
 * @private
 */
export class _TrueTypeCmapTable {
    /**
     * cmap table version.
     *
     * @private
     */
    _version: number;
    /**
     * Number of encoding subtables.
     *
     * @private
     */
    _tablesCount: number;
}
/**
 * Holds platform and encoding identifiers and the offset to a cmap subtable.
 *
 * @private
 */
export class _TrueTypeCmapSubTable {
    /**
     * Platform identifier.
     *
     * @private
     */
    _platformID: number;
    /**
     * Encoding identifier.
     *
     * @private
     */
    _encodingID: number;
    /**
     * Byte offset to the cmap subtable.
     *
     * @private
     */
    _offset: number;
}
/**
 * Represents an apple cmap subtable with format length and version.
 *
 * @private
 */
export class _TrueTypeAppleCmapSubTable {
    /**
     * Subtable format.
     *
     * @private
     */
    _format: number;
    /**
     * Subtable length in bytes.
     *
     * @private
     */
    _length: number;
    /**
     * Subtable version.
     *
     * @private
     */
    _version: number;
}
/**
 * Represents a trimmed cmap subtable with base code and entry count.
 *
 * @private
 */
export class _TrueTypeTrimmedCmapSubTable {
    /**
     * Subtable format.
     *
     * @private
     */
    _format: number;
    /**
     * Subtable length.
     *
     * @private
     */
    _length: number;
    /**
     * Subtable version.
     *
     * @private
     */
    _version: number;
    /**
     * First character code covered by the table.
     *
     * @private
     */
    _firstCode: number;
    /**
     * Number of entries following the first code.
     *
     * @private
     */
    _entryCount: number;
}
