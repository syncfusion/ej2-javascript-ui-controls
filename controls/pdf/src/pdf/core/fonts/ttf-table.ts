import { _TrueTypeNameRecord } from './ttf-reader';
export class _TrueTypeTableInfo {
    _offset: number;
    _length: number;
    _checksum: number;
    get _empty(): boolean {
        const empty: boolean = (this._offset === this._length && this._length === this._checksum && this._checksum === 0);
        return empty;
    }
}
export class _TrueTypeOS2Table {
    _version: number;
    _xAvgCharWidth: number;
    _usWeightClass: number;
    _usWidthClass: number;
    _fsType: number;
    _ySubscriptXSize: number;
    _ySubscriptYSize: number;
    _ySubscriptXOffset: number;
    _ySubscriptYOffset: number;
    _ySuperscriptXSize: number;
    _ySuperscriptYSize: number;
    _ySuperscriptXOffset: number;
    _ySuperscriptYOffset: number;
    _yStrikeoutSize: number;
    _yStrikeoutPosition: number;
    _sFamilyClass: number;
    _panose: number[];
    _ulUnicodeRange1: number;
    _ulUnicodeRange2: number;
    _ulUnicodeRange3: number;
    _ulUnicodeRange4: number;
    _vendorIdentifier: number[];
    _fsSelection: number;
    _usFirstCharIndex: number;
    _usLastCharIndex: number;
    _sTypoAscender: number;
    _sTypoDescender: number;
    _sTypoLineGap: number;
    _usWinAscent: number;
    _usWinDescent: number;
    _ulCodePageRange1: number;
    _ulCodePageRange2: number;
    _sxHeight: number;
    _sCapHeight: number;
    _usDefaultChar: number;
    _usBreakChar: number;
    _usMaxContext: number;
}
export class _TrueTypePostTable {
    _formatType: number;
    _italicAngle: number;
    _underlinePosition: number;
    _underlineThickness: number;
    _isFixedPitch: number;
    _minType42: number;
    _maxType42: number;
    _minType1: number;
    _maxType1: number;
}
export class _TrueTypeNameTable {
    _formatSelector: number;
    _recordsCount: number;
    _offset: number;
    _nameRecords: _TrueTypeNameRecord[];
}
export class _TrueTypeMicrosoftCmapSubTable {
    _format: number;
    _length: number;
    _version: number;
    _segCountX2: number;
    _searchRange: number;
    _entrySelector: number;
    _rangeShift: number;
    _endCount: number[];
    _reservedPad: number;
    _startCount: number[];
    _idDelta: number[];
    _idRangeOffset: number[];
    _glyphID: number[];
}
export class _TrueTypeHorizontalHeaderTable {
    _version: number;
    _ascender: number;
    _advanceWidthMax: number;
    _descender: number;
    _numberOfHMetrics: number;
    _lineGap: number;
    _minLeftSideBearing: number;
    _minRightSideBearing: number;
    _xMaxExtent: number;
    _caretSlopeRise: number;
    _caretSlopeRun: number;
    _metricDataFormat: number;
}
export class _TrueTypeHeadTable {
    _modified: number;
    _created: number;
    _magicNumber: number;
    _checkSumAdjustment: number;
    _fontRevision: number;
    _version: number;
    _xMin: number;
    _yMin: number;
    _unitsPerEm: number;
    _yMax: number;
    _xMax: number;
    _macStyle: number;
    _flags: number;
    _lowestReadableSize: number;
    _fontDirectionHint: number;
    _indexToLocalFormat: number;
    _glyphDataFormat: number;
}
export class _TrueTypeCmapTable {
    _version: number;
    _tablesCount: number;
}
export class _TrueTypeCmapSubTable {
    _platformID: number;
    _encodingID: number;
    _offset: number;
}
export class _TrueTypeAppleCmapSubTable {
    _format: number;
    _length: number;
    _version: number;
}
export class _TrueTypeTrimmedCmapSubTable {
    _format: number;
    _length: number;
    _version: number;
    _firstCode: number;
    _entryCount: number;
}
