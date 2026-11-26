import { _UnicodeTrueTypeFont } from './unicode-true-type-font';
import { PdfFont } from './pdf-standard-font';
import { _OtfScript, _OtfScriptTag } from '../enumerator';
import { _detectOtfScript, _getIndicSplitVowel, _getLegacyOtfScriptTag, _getOtfFeatures, _getOtfPositionalJoining } from '../utils';
import { _TrueTypeGlyph, _TrueTypeReader } from './ttf-reader';
/**
 * Internal shaped-glyph record produced by the shaping pipeline.
 *
 * @private
 */
export class _OtfGlyphInfo {
    /**
     * Final (shaped) glyph identifier in the font.
     *
     * @private
     */
    _index: number;
    /**
     * Original Unicode scalar value when available.
     *
     * @private
     */
    _charCode: number;
    /**
     * One or more source characters retained after substitution or ligation.
     *
     * @private
     */
    _characters: string;
    /**
     * Base glyph width in font units.
     *
     * @private
     */
    _width: number;
    /**
     * GPOS placement offset in x (font units).
     *
     * @private
     */
    _leadingX: number;
    /**
     * GPOS placement offset in y (font units).
     *
     * @private
     */
    _leadingY: number;
    /**
     * GPOS advance adjustment in x (font units).
     *
     * @private
     */
    _xAdvance: number;
    /**
     * GPOS advance adjustment in y (font units).
     *
     * @private
     */
    _yAdvance: number;
    /**
     * Placement mode flag (0 = advance only, 1 = placed).
     *
     * @private
     */
    _placement: number;
    /**
     * Indicates a missing or unsupported glyph substituted during mapping.
     *
     * @private
     */
    _unsupportedGlyph: boolean;
    /**
     * Arabic joining state (0 none, 1 isolated, 2 initial, 3 medial, 4 final).
     *
     * @private
     */
    _joining: number;
    /**
     * Initializes a shaped glyph record.
     *
     * @private
     */
    constructor() {
        this._index = 0;
        this._charCode = 0;
        this._characters = '';
        this._width = 0;
        this._leadingX = 0;
        this._leadingY = 0;
        this._xAdvance = 0;
        this._yAdvance = 0;
        this._placement = 0;
        this._unsupportedGlyph = false;
        this._joining = 0;
    }
    /**
     * Creates a copy of this glyph record preserving all positioning fields.
     *
     * @private
     * @returns {_OtfGlyphInfo} The copied record.
     */
    _clone(): _OtfGlyphInfo {
        const copy: _OtfGlyphInfo = new _OtfGlyphInfo();
        copy._index = this._index;
        copy._charCode = this._charCode;
        copy._characters = this._characters;
        copy._width = this._width;
        copy._leadingX = this._leadingX;
        copy._leadingY = this._leadingY;
        copy._xAdvance = this._xAdvance;
        copy._yAdvance = this._yAdvance;
        copy._placement = this._placement;
        copy._unsupportedGlyph = this._unsupportedGlyph;
        copy._joining = this._joining;
        return copy;
    }
}
/**
 * Ordered shaped glyph list with source-text association.
 *
 * @private
 */
export class _OtfGlyphInfoList {
    /**
     * Glyph array in writing order.
     *
     * @private
     */
    _glyphs: _OtfGlyphInfo[];
    /**
     * Start index of the current processing window.
     *
     * @private
     */
    _startIndex: number;
    /**
     * End index (exclusive) of the current processing window.
     *
     * @private
     */
    _endIndex: number;
    /**
     * Current processing index.
     *
     * @private
     */
    _currentIndex: number;
    /**
     * Source text associated with the glyph list.
     *
     * @private
     */
    _text: string;
    /**
     * Initializes a glyph list from a source string.
     *
     * @private
     * @param {string} text - Source text associated with the list.
     */
    constructor(text: string) {
        this._glyphs = [];
        this._startIndex = 0;
        this._endIndex = 0;
        this._currentIndex = 0;
        this._text = text;
    }
    /**
     * Gets the number of glyphs.
     *
     * @private
     * @returns {number} Glyph count.
     */
    get _length(): number {
        return this._glyphs.length;
    }
}
/**
 * Parses and applies OpenType GSUB/GPOS layout tables for a supported script.
 *
 * @private
 */
export class _OtfShaper {
    /**
     * Reader providing raw font bytes and glyph metrics.
     *
     * @private
     */
    private _reader: _TrueTypeReader;
    /**
     * Raw font bytes.
     *
     * @private
     */
    private _data: Uint8Array;
    /**
     * GSUB table byte offset; -1 when absent.
     *
     * @private
     */
    private _gsubOffset: number = -1;
    /**
     * GPOS table byte offset; -1 when absent.
     *
     * @private
     */
    private _gposOffset: number = -1;
    /**
     * GDEF table byte offset; -1 when absent.
     *
     * @private
     */
    private _gdefOffset: number = -1;
    /**
     * Joining state the lookup being applied is restricted to (0 = unrestricted).
     *
     * @private
     */
    private _requiredJoining: number = 0;
    /**
     * Initializes the shaper over a Unicode TrueType font.
     *
     * @private
     * @param {_UnicodeTrueTypeFont} internal - Unicode TrueType font internals.
     */
    constructor(internal: _UnicodeTrueTypeFont) {
        this._reader = internal._ttfReader;
        this._data = this._reader._fontData;
        this._gsubOffset = this._tableOffset('GSUB');
        this._gposOffset = this._tableOffset('GPOS');
        this._gdefOffset = this._tableOffset('GDEF');
    }
    /**
     * Returns whether the font carries all three layout tables required by the
     * eligibility gate (implementation specification section 5).
     *
     * @private
     * @returns {boolean} True when GDEF, GSUB and GPOS are present.
     */
    _hasLayoutTables(): boolean {
        return this._gsubOffset >= 0 && this._gposOffset >= 0 && this._gdefOffset >= 0;
    }
    /**
     * Returns the byte offset of a TrueType table or -1 when missing or corrupt.
     *
     * @private
     * @param {string} tag - Four-character table tag.
     * @returns {number} Table byte offset or -1.
     */
    private _tableOffset(tag: string): number {
        try {
            const directory: any = this._reader._tableDirectory; // eslint-disable-line
            if (!directory || !directory.containsKey || !directory.containsKey(tag)) {
                return -1;
            }
            const table: any = directory.getValue(tag); // eslint-disable-line
            if (!table || typeof table._offset !== 'number' || typeof table._length !== 'number' ||
                table._length <= 0) {
                return -1;
            }
            if (table._offset < 0 || table._offset + table._length > this._data.length) {
                return -1;
            }
            return table._offset;
        } catch (e) {
            return -1;
        }
    }
    /**
     * Shapes the supplied text for the detected script and returns the glyph list.
     *
     * @private
     * @param {string} text - Source text (logical order).
     * @param {string} scriptTag - OpenType script tag for lookup selection.
     * @returns {_OtfGlyphInfoList} Shaped glyph list.
     */
    _shape(text: string, scriptTag: string): _OtfGlyphInfoList {
        const list: _OtfGlyphInfoList = new _OtfGlyphInfoList(text);
        for (let i: number = 0; i < text.length; i++) {
            let code: number = text.charCodeAt(i);
            let unit: string = text.charAt(i);
            if (code >= 0xD800 && code <= 0xDBFF && i + 1 < text.length) {
                const low: number = text.charCodeAt(i + 1);
                if (low >= 0xDC00 && low <= 0xDFFF) {
                    code = 0x10000 + ((code - 0xD800) << 10) + (low - 0xDC00);
                    unit = text.substr(i, 2);
                    i++;
                }
            }
            const split: number[] = _getIndicSplitVowel(code);
            if (split !== null) {
                for (let s: number = 0; s < split.length; s++) {
                    const subCode: number = split[<number>s];
                    const subUnit: string = String.fromCharCode(subCode);
                    const glyph: _TrueTypeGlyph = this._glyphOf(subCode, subUnit);
                    const info: _OtfGlyphInfo = new _OtfGlyphInfo();
                    info._charCode = subCode;
                    info._characters = subUnit;
                    info._index = (glyph !== null && typeof glyph !== 'undefined') ? glyph._index : 0;
                    info._width = (glyph !== null && typeof glyph !== 'undefined') ? glyph._width : 0;
                    info._unsupportedGlyph = glyph === null || typeof glyph === 'undefined' || glyph._index === 0;
                    list._glyphs.push(info);
                }
                continue;
            }
            const glyph: _TrueTypeGlyph = this._glyphOf(code, unit);
            const info: _OtfGlyphInfo = new _OtfGlyphInfo();
            info._charCode = code;
            info._characters = unit;
            info._index = (glyph !== null && typeof glyph !== 'undefined') ? glyph._index : 0;
            info._width = (glyph !== null && typeof glyph !== 'undefined') ? glyph._width : 0;
            info._unsupportedGlyph = glyph === null || typeof glyph === 'undefined' || glyph._index === 0;
            list._glyphs.push(info);
        }
        if (scriptTag === _OtfScriptTag.arabic) {
            this._assignJoining(list);
        } else if (_getLegacyOtfScriptTag(scriptTag) !== null) {
            this._reorderIndic(list);
        }
        const nominal: _OtfGlyphInfo[] = list._glyphs.map((g: _OtfGlyphInfo) => g._clone());
        if (this._gsubOffset >= 0) {
            const initial: number[] = list._glyphs.map((g: _OtfGlyphInfo) => g._index);
            if (this._applyGsub(list, scriptTag)) {
                this._refreshSubstitutedWidths(list, initial);
            } else {
                list._glyphs = nominal.map((g: _OtfGlyphInfo) => g._clone());
            }
        }
        if (this._gposOffset >= 0 && !this._applyGpos(list, scriptTag)) {
            list._glyphs = nominal;
        }
        list._endIndex = list._glyphs.length;
        return list;
    }
    /**
     * Moves pre-base vowel signs in front of their consonant cluster (consonant + virama chain).
     * Reph and other reordering are not performed here.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list in logical order.
     * @returns {void} nothing.
     */
    private _reorderIndic(list: _OtfGlyphInfoList): void {
        const glyphs: _OtfGlyphInfo[] = list._glyphs;
        const isVirama: (c: number) => boolean = (c: number): boolean =>
            [0x94D, 0x9CD, 0xA4D, 0xACD, 0xB4D, 0xBCD, 0xC4D, 0xCCD, 0xD4D].indexOf(c) >= 0;
        const isPreBase: (c: number) => boolean = (c: number): boolean =>
            c === 0x93F || c === 0x9BF || c === 0x9C7 || c === 0x9C8 || c === 0xA3F || c === 0xABF || c === 0xB47 ||
            (c >= 0xBC6 && c <= 0xBC8) || (c >= 0xD46 && c <= 0xD48);
        const isTamil: (c: number) => boolean = (c: number): boolean => c >= 0x0B80 && c <= 0x0BFF;
        const isJoiner: (c: number) => boolean = (c: number): boolean => c === 0x200C || c === 0x200D;
        for (let i: number = 1; i < glyphs.length; i++) {
            if (!isPreBase(glyphs[<number>i]._charCode)) {
                continue;
            }
            let start: number = i - 1;
            while (start > 0 && glyphs[<number>start]._charCode === 0x93C) {
                start--;
            }
            if (!isTamil(glyphs[<number>i]._charCode)) {
                for (;;) {
                    let v: number = start - 1;
                    while (v >= 0 && isJoiner(glyphs[<number>v]._charCode)) {
                        v--;
                    }
                    if (v >= 1 && isVirama(glyphs[<number>v]._charCode)) {
                        start = v - 1;
                    } else {
                        break;
                    }
                }
            }
            const matra: _OtfGlyphInfo = glyphs.splice(i, 1)[0];
            glyphs.splice(start, 0, matra);
        }
    }
    /**
     * Maps a Unicode scalar value to a glyph; supplementary-plane scalars are looked up whole.
     *
     * @private
     * @param {number} code - Unicode scalar value.
     * @param {string} unit - The source UTF-16 unit(s) of the scalar.
     * @returns {_TrueTypeGlyph} Mapped glyph, or the default glyph.
     */
    private _glyphOf(code: number, unit: string): _TrueTypeGlyph {
        if (code > 0xFFFF) {
            const map: any = this._reader._microsoft; // eslint-disable-line
            if (map && map.containsKey(code)) {
                return map.getValue(code);
            }
            return this._reader._getDefaultGlyph();
        }
        return this._reader._getGlyph(unit);
    }
    /**
     * Replaces the advance width of substituted glyphs with the width of the final glyph.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Shaped glyph list.
     * @param {number[]} initial - Glyph identifiers before substitution (same order, pre-ligature).
     * @returns {void} nothing.
     */
    private _refreshSubstitutedWidths(list: _OtfGlyphInfoList, initial: number[]): void {
        const widths: number[] = this._reader._width;
        if (!widths || widths.length === 0) {
            return;
        }
        const unchanged: boolean = initial.length === list._glyphs.length;
        for (let i: number = 0; i < list._glyphs.length; i++) {
            const glyph: _OtfGlyphInfo = list._glyphs[<number>i];
            if (!unchanged || glyph._index !== initial[<number>i]) {
                glyph._width = glyph._index >= 0 && glyph._index < widths.length ? widths[glyph._index] : widths[0];
            }
        }
    }
    /**
     * Resolves the ordered lookups to apply for a script: Script table (preferred, legacy, DFLT),
     * default LangSys, required feature, then the enabled features in the supplied order.
     *
     * @private
     * @param {number} tableOffset - GSUB or GPOS table offset.
     * @param {string} scriptTag - Preferred script tag.
     * @param {string[]} featureOrder - Enabled feature tags in application order.
     * @returns {Array<{ tag: string, lookup: number }>} Lookup indexes with the feature that enabled them, or null.
     */
    private _resolveLookups(tableOffset: number, scriptTag: string, featureOrder: string[]): Array<{ tag: string, lookup: number }> {
        if (tableOffset < 0 || tableOffset + 10 > this._data.length || this._readU32(tableOffset) !== 0x00010000) {
            return null;
        }
        const scriptList: number = tableOffset + this._readU16(tableOffset + 4);
        const featureList: number = tableOffset + this._readU16(tableOffset + 6);
        if (scriptList + 2 > this._data.length || featureList + 2 > this._data.length) {
            return null;
        }
        const candidates: string[] = [scriptTag];
        if (_getLegacyOtfScriptTag(scriptTag) !== null) {
            candidates.push(_getLegacyOtfScriptTag(scriptTag));
        }
        candidates.push('DFLT');
        const scriptCount: number = this._readU16(scriptList);
        let scriptTable: number = -1;
        for (let c: number = 0; c < candidates.length && scriptTable < 0; c++) {
            for (let i: number = 0; i < scriptCount; i++) {
                const record: number = scriptList + 2 + i * 6;
                if (record + 6 > this._data.length) {
                    break;
                }
                if (this._readTag(record) === candidates[<number>c]) {
                    scriptTable = scriptList + this._readU16(record + 4);
                    break;
                }
            }
        }
        if (scriptTable < 0 || scriptTable + 4 > this._data.length) {
            return null;
        }
        const defaultLangSys: number = this._readU16(scriptTable);
        if (defaultLangSys === 0) {
            return null;
        }
        const langSys: number = scriptTable + defaultLangSys;
        if (langSys + 6 > this._data.length) {
            return null;
        }
        const required: number = this._readU16(langSys + 2);
        const featureIndexCount: number = this._readU16(langSys + 4);
        if (langSys + 6 + featureIndexCount * 2 > this._data.length) {
            return null;
        }
        const featureCount: number = this._readU16(featureList);
        const enabled: number[] = [];
        for (let i: number = 0; i < featureIndexCount; i++) {
            enabled.push(this._readU16(langSys + 6 + i * 2));
        }
        const result: Array<{ tag: string, lookup: number }> = [];
        const collect: (featureIndex: number, tag: string) => void = (featureIndex: number, tag: string): void => {
            const record: number = featureList + 2 + featureIndex * 6;
            if (record + 6 > this._data.length) {
                return;
            }
            const feature: number = featureList + this._readU16(record + 4);
            if (feature + 4 > this._data.length) {
                return;
            }
            const count: number = this._readU16(feature + 2);
            if (feature + 4 + count * 2 > this._data.length) {
                return;
            }
            const indexes: number[] = [];
            for (let l: number = 0; l < count; l++) {
                indexes.push(this._readU16(feature + 4 + l * 2));
            }
            indexes.sort((x: number, y: number) => x - y);
            for (let l: number = 0; l < indexes.length; l++) {
                result.push({ tag: tag, lookup: indexes[<number>l] });
            }
        };
        if (required !== 0xFFFF && required < featureCount) {
            collect(required, this._readTag(featureList + 2 + required * 6));
        }
        for (let f: number = 0; f < featureOrder.length; f++) {
            const wanted: string = featureOrder[<number>f];
            for (let i: number = 0; i < enabled.length; i++) {
                const index: number = enabled[<number>i];
                const record: number = featureList + 2 + index * 6;
                if (index < featureCount && record + 6 <= this._data.length && this._readTag(record) === wanted) {
                    collect(index, wanted);
                }
            }
        }
        return result;
    }
    /**
     * Gets the lookup subtable offsets of a lookup in a layout table.
     *
     * @private
     * @param {number} tableOffset - GSUB or GPOS table offset.
     * @param {number} lookupIndex - Lookup index.
     * @returns {number[]} Absolute lookup type followed by subtable offsets, or null.
     */
    private _lookupSubTables(tableOffset: number, lookupIndex: number): number[] {
        const lookupList: number = tableOffset + this._readU16(tableOffset + 8);
        if (lookupList + 2 > this._data.length || lookupIndex >= this._readU16(lookupList)) {
            return null;
        }
        const lookup: number = lookupList + this._readU16(lookupList + 2 + lookupIndex * 2);
        if (lookup + 6 > this._data.length) {
            return null;
        }
        const count: number = this._readU16(lookup + 4);
        if (lookup + 6 + count * 2 > this._data.length) {
            return null;
        }
        const result: number[] = [this._readU16(lookup)];
        for (let i: number = 0; i < count; i++) {
            const sub: number = lookup + this._readU16(lookup + 6 + i * 2);
            if (sub + 6 <= this._data.length) {
                result.push(sub);
            }
        }
        return result;
    }
    /**
     * Reads an unsigned 16-bit big-endian value from the font data.
     *
     * @private
     * @param {number} offset - Byte offset.
     * @returns {number} Parsed value.
     */
    private _readU16(offset: number): number {
        return (this._data[<number>offset] << 8) | this._data[offset + 1];
    }
    /**
     * Reads an unsigned 32-bit big-endian value from the font data.
     *
     * @private
     * @param {number} offset - Byte offset.
     * @returns {number} Parsed value.
     */
    private _readU32(offset: number): number {
        return ((this._data[<number>offset] << 24) | (this._data[offset + 1] << 16) |
            (this._data[offset + 2] << 8) | (this._data[offset + 3]) as number) >>> 0;
    }
    /**
     * Reads a 4-character ASCII tag from the font data.
     *
     * @private
     * @param {number} offset - Byte offset.
     * @returns {string} Parsed tag.
     */
    private _readTag(offset: number): string {
        return String.fromCharCode(
            this._data[<number>offset], this._data[offset + 1], this._data[offset + 2], this._data[offset + 3]);
    }
    /**
     * Reads a signed 16-bit big-endian value from the font data.
     *
     * @private
     * @param {number} offset - Byte offset.
     * @returns {number} Parsed value.
     */
    private _readS16(offset: number): number {
        const value: number = this._readU16(offset);
        return (value & 0x8000) ? value - 0x10000 : value;
    }
    /**
     * Assigns Arabic joining states (isolated, initial, medial, final) before substitution.
     * Transparent marks do not break joining; ZWJ joins and ZWNJ breaks.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list in logical order.
     * @returns {void} nothing.
     */
    private _assignJoining(list: _OtfGlyphInfoList): void {
        const glyphs: _OtfGlyphInfo[] = list._glyphs;
        const types: number[] = glyphs.map((g: _OtfGlyphInfo) => this._joiningType(g._charCode));
        for (let i: number = 0; i < glyphs.length; i++) {
            const type: number = types[<number>i];
            if (type === 0 || type === 3) {
                continue;
            }
            let p: number = i - 1;
            while (p >= 0 && types[<number>p] === 3) {
                p--;
            }
            let n: number = i + 1;
            while (n < glyphs.length && types[<number>n] === 3) {
                n++;
            }
            const joinPrev: boolean = p >= 0 && types[<number>p] === 2;
            const joinNext: boolean = type === 2 && n < glyphs.length && types[<number>n] >= 1 && types[<number>n] <= 2;
            glyphs[<number>i]._joining = joinPrev ? (joinNext ? 3 : 4) : (joinNext ? 2 : 1);
        }
    }
    /**
     * Classifies a code point by Arabic joining type.
     *
     * @private
     * @param {number} code - Unicode scalar value.
     * @returns {number} 0 non-joining, 1 right-joining, 2 dual-joining, 3 transparent.
     */
    private _joiningType(code: number): number {
        if ((code >= 0x0610 && code <= 0x061A) || (code >= 0x064B && code <= 0x065F) || code === 0x0670 ||
            (code >= 0x06D6 && code <= 0x06DC) || (code >= 0x06DF && code <= 0x06E4) ||
            code === 0x06E7 || code === 0x06E8 || (code >= 0x06EA && code <= 0x06ED)) {
            return 3;
        }
        if (code === 0x200D || code === 0x0640) {
            return 2;
        }
        if ((code >= 0x0622 && code <= 0x0625) || code === 0x0627 || code === 0x0629 ||
            (code >= 0x062F && code <= 0x0632) || code === 0x0648 || (code >= 0x0671 && code <= 0x0673) ||
            (code >= 0x0675 && code <= 0x0677) || (code >= 0x0688 && code <= 0x0699) || code === 0x06C0 ||
            (code >= 0x06C2 && code <= 0x06CB) || code === 0x06CD || code === 0x06CF ||
            code === 0x06D2 || code === 0x06D3 || code === 0x06D5) {
            return 1;
        }
        if ((code >= 0x0620 && code <= 0x064A && code !== 0x0621) || (code >= 0x066E && code <= 0x06D5 && code !== 0x06D4) ||
            (code >= 0x06FA && code <= 0x06FF)) {
            return 2;
        }
        return 0;
    }
    /**
     * Returns whether a glyph satisfies the positional (joining) restriction of the active feature.
     *
     * @private
     * @param {_OtfGlyphInfo} glyph - Glyph to test.
     * @returns {boolean} True when the feature may apply to the glyph.
     */
    private _joiningMatches(glyph: _OtfGlyphInfo): boolean {
        return this._requiredJoining === 0 || glyph._joining === this._requiredJoining;
    }
    /**
     * Resolves the coverage index of a glyph (OpenType Coverage formats 1 and 2).
     *
     * @private
     * @param {number} coverage - Absolute byte offset of the Coverage table.
     * @param {number} glyphIndex - Glyph identifier to look up.
     * @returns {number} Coverage index, or -1 when the glyph is not covered.
     */
    private _coverageIndex(coverage: number, glyphIndex: number): number {
        if (coverage < 0 || coverage + 4 > this._data.length) {
            return -1;
        }
        const format: number = this._readU16(coverage);
        const count: number = this._readU16(coverage + 2);
        if (format === 1) {
            if (coverage + 4 + count * 2 > this._data.length) {
                return -1;
            }
            for (let g: number = 0; g < count; g++) {
                if (this._readU16(coverage + 4 + g * 2) === glyphIndex) {
                    return g;
                }
            }
        } else if (format === 2) {
            if (coverage + 4 + count * 6 > this._data.length) {
                return -1;
            }
            for (let r: number = 0; r < count; r++) {
                const record: number = coverage + 4 + r * 6;
                const start: number = this._readU16(record);
                if (glyphIndex >= start && glyphIndex <= this._readU16(record + 2)) {
                    return this._readU16(record + 4) + glyphIndex - start;
                }
            }
        }
        return -1;
    }
    /**
     * Applies GSUB single-substitution and ligature lookups for the script tag.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to substitute in place.
     * @param {string} scriptTag - OpenType script tag.
     * @returns {boolean} False when a malformed lookup was met and the caller must restore nominal glyphs.
     */
    private _applyGsub(list: _OtfGlyphInfoList, scriptTag: string): boolean {
        try {
            const features: string[] = _getOtfFeatures(scriptTag, true);
            const lookups: Array<{ tag: string, lookup: number }> = this._resolveLookups(this._gsubOffset, scriptTag, features);
            if (lookups === null) {
                return true;
            }
            for (let n: number = 0; n < lookups.length; n++) {
                const entry: { tag: string, lookup: number } = lookups[<number>n];
                const subs: number[] = this._lookupSubTables(this._gsubOffset, entry.lookup);
                if (subs === null) {
                    continue;
                }
                this._requiredJoining = _getOtfPositionalJoining(entry.tag);
                for (let sub: number = 1; sub < subs.length; sub++) {
                    const subTable: number = subs[<number>sub];
                    if (subs[0] === 1) {
                        this._applyGsubSingle(list, subTable);
                    } else if (subs[0] === 2) {
                        this._applyGsubMultiple(list, subTable);
                    } else if (subs[0] === 4) {
                        this._applyGsubLigature(list, subTable);
                    }
                }
            }
            this._requiredJoining = 0;
            return true;
        } catch (e) {
            this._requiredJoining = 0;
            return false;
        }
    }
    /**
     * Applies a GSUB lookup type 1 (single substitution) subtable.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to substitute in place.
     * @param {number} subTable - Subtable byte offset within GSUB.
     * @returns {void} nothing.
     */
    private _applyGsubSingle(list: _OtfGlyphInfoList, subTable: number): void {
        const format: number = this._readU16(subTable);
        if (format !== 1 && format !== 2) {
            return;
        }
        const coverage: number = subTable + this._readU16(subTable + 2);
        for (let i: number = 0; i < list._glyphs.length; i++) {
            const glyphIndex: number = list._glyphs[<number>i]._index;
            const covIndex: number = this._coverageIndex(coverage, glyphIndex);
            if (covIndex < 0 || !this._joiningMatches(list._glyphs[<number>i])) {
                continue;
            }
            let substitute: number = -1;
            if (format === 1) {
                substitute = (glyphIndex + this._readS16(subTable + 4)) & 0xFFFF;
            } else if (covIndex < this._readU16(subTable + 4) &&
                subTable + 6 + covIndex * 2 + 2 <= this._data.length) {
                substitute = this._readU16(subTable + 6 + covIndex * 2);
            }
            if (substitute >= 0) {
                list._glyphs[<number>i]._index = substitute;
            }
        }
    }
    /**
     * Applies a GSUB lookup type 2 (multiple substitution) subtable.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to substitute in place.
     * @param {number} subTable - Subtable byte offset within GSUB.
     * @returns {void} nothing.
     */
    private _applyGsubMultiple(list: _OtfGlyphInfoList, subTable: number): void {
        if (this._readU16(subTable) !== 1) {
            return;
        }
        const coverage: number = subTable + this._readU16(subTable + 2);
        const sequenceCount: number = this._readU16(subTable + 4);
        for (let i: number = 0; i < list._glyphs.length; i++) {
            const glyph: _OtfGlyphInfo = list._glyphs[<number>i];
            const sequenceIndex: number = this._coverageIndex(coverage, glyph._index);
            if (sequenceIndex < 0 || sequenceIndex >= sequenceCount || !this._joiningMatches(glyph)) {
                continue;
            }
            const sequence: number = subTable + this._readU16(subTable + 6 + sequenceIndex * 2);
            if (sequence + 2 > this._data.length) {
                continue;
            }
            const substituteCount: number = this._readU16(sequence);
            if (substituteCount === 0 || sequence + 2 + substituteCount * 2 > this._data.length) {
                continue;
            }
            glyph._index = this._readU16(sequence + 2);
            for (let j: number = 1; j < substituteCount; j++) {
                const substitute: _OtfGlyphInfo = glyph._clone();
                substitute._index = this._readU16(sequence + 2 + j * 2);
                substitute._characters = '';
                substitute._charCode = 0;
                list._glyphs.splice(i + j, 0, substitute);
            }
            i += substituteCount - 1;
        }
    }
    /**
     * Applies a GSUB lookup type 4 (ligature) subtable, combining consumed source
     * characters into the surviving glyph record (implementation specification 8.2).
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to substitute in place.
     * @param {number} subTable - Subtable byte offset within GSUB.
     * @returns {void} nothing.
     */
    private _applyGsubLigature(list: _OtfGlyphInfoList, subTable: number): void {
        const format: number = this._readU16(subTable);
        if (format !== 1) {
            return;
        }
        const coverage: number = subTable + this._readU16(subTable + 2);
        const ligSetCount: number = this._readU16(subTable + 4);
        for (let i: number = 0; i < list._glyphs.length; i++) {
            const first: _OtfGlyphInfo = list._glyphs[<number>i];
            const setIndex: number = this._coverageIndex(coverage, first._index);
            if (setIndex < 0 || setIndex >= ligSetCount) {
                continue;
            }
            const ligSetTable: number = subTable + this._readU16(subTable + 6 + setIndex * 2);
            if (ligSetTable + 2 > this._data.length) {
                continue;
            }
            const ligatureCount: number = this._readU16(ligSetTable);
            for (let l: number = 0; l < ligatureCount; l++) {
                const ligatureTable: number = ligSetTable + this._readU16(ligSetTable + 2 + l * 2);
                if (ligatureTable + 4 > this._data.length) {
                    continue;
                }
                const ligGlyph: number = this._readU16(ligatureTable);
                const componentCount: number = this._readU16(ligatureTable + 2);
                if (i + componentCount - 1 >= list._glyphs.length) {
                    continue;
                }
                let matched: boolean = true;
                for (let c: number = 1; c < componentCount; c++) {
                    const componentGlyph: number = this._readU16(ligatureTable + 2 + c * 2);
                    if (list._glyphs[i + c]._index !== componentGlyph) {
                        matched = false;
                        break;
                    }
                }
                if (matched) {
                    for (let c: number = 1; c < componentCount; c++) {
                        first._characters += list._glyphs[i + c]._characters;
                    }
                    first._index = ligGlyph;
                    list._glyphs.splice(i + 1, componentCount - 1);
                    break;
                }
            }
        }
    }
    /**
     * Applies GPOS single-glyph (type 1) and pair-adjustment (type 2) lookups.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to position in place.
     * @param {string} scriptTag - OpenType script tag.
     * @returns {boolean} False when a malformed lookup was met and the caller must restore nominal glyphs.
     */
    private _applyGpos(list: _OtfGlyphInfoList, scriptTag: string): boolean {
        try {
            const features: string[] = _getOtfFeatures(scriptTag, false);
            const lookups: Array<{ tag: string, lookup: number }> = this._resolveLookups(this._gposOffset, scriptTag, features);
            if (lookups === null) {
                return true;
            }
            for (let n: number = 0; n < lookups.length; n++) {
                const subs: number[] = this._lookupSubTables(this._gposOffset, lookups[<number>n].lookup);
                if (subs === null) {
                    continue;
                }
                for (let sub: number = 1; sub < subs.length; sub++) {
                    const subTable: number = subs[<number>sub];
                    if (subs[0] === 1) {
                        this._applyGposSingle(list, subTable);
                    } else if (subs[0] === 2) {
                        this._applyGposPair(list, subTable);
                    }
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Applies a GPOS lookup type 1 (single adjustment) subtable.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to position in place.
     * @param {number} subTable - Subtable byte offset within GPOS.
     * @returns {void} nothing.
     */
    private _applyGposSingle(list: _OtfGlyphInfoList, subTable: number): void {
        const format: number = this._readU16(subTable);
        if (format !== 1) {
            return;
        }
        const coverage: number = subTable + this._readU16(subTable + 2);
        for (let i: number = 0; i < list._glyphs.length; i++) {
            const covered: boolean = this._coverageIndex(coverage, list._glyphs[<number>i]._index) >= 0;
            if (!covered) {
                continue;
            }
            const valueFormat: number = this._readU16(subTable + 4);
            if (valueFormat & 0x0001) {
                list._glyphs[<number>i]._leadingX += this._readS16(subTable + 6);
            }
            if (valueFormat & 0x0002) {
                list._glyphs[<number>i]._leadingY += this._readS16(subTable + 6 + 2);
            }
            if (valueFormat & 0x0004) {
                list._glyphs[<number>i]._xAdvance += this._readS16(subTable + 6 + 4);
            }
            if (valueFormat & 0x0008) {
                list._glyphs[<number>i]._yAdvance += this._readS16(subTable + 6 + 6);
            }
        }
    }
    /**
     * Applies a GPOS lookup type 2 (pair adjustment) subtable, format 1 only.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Glyph list to position in place.
     * @param {number} subTable - Subtable byte offset within GPOS.
     * @returns {void} nothing.
     */
    private _applyGposPair(list: _OtfGlyphInfoList, subTable: number): void {
        const format: number = this._readU16(subTable);
        if (format !== 1) {
            return;
        }
        const coverage: number = subTable + this._readU16(subTable + 2);
        const valueFormat1: number = this._readU16(subTable + 4);
        const valueFormat2: number = this._readU16(subTable + 6);
        const pairSetCount: number = this._readU16(subTable + 8);
        const valueSize1: number = this._valueSize(valueFormat1);
        const valueSize2: number = this._valueSize(valueFormat2);
        for (let i: number = 0; i < list._glyphs.length - 1; i++) {
            const setIndex: number = this._coverageIndex(coverage, list._glyphs[<number>i]._index);
            if (setIndex < 0 || setIndex >= pairSetCount) {
                continue;
            }
            const pairSetTable: number = subTable + this._readU16(subTable + 10 + setIndex * 2);
            if (pairSetTable + 2 > this._data.length) {
                continue;
            }
            const pairValueCount: number = this._readU16(pairSetTable);
            const secondGlyph: number = list._glyphs[i + 1]._index;
            for (let p: number = 0; p < pairValueCount; p++) {
                const pairValue: number = pairSetTable + 2 + p * (2 + valueSize1 + valueSize2);
                if (pairValue + 2 > this._data.length) {
                    break;
                }
                if (this._readU16(pairValue) !== secondGlyph) {
                    continue;
                }
                const value1: number = pairValue + 2;
                if (valueFormat1 & 0x0001) {
                    list._glyphs[<number>i]._leadingX += this._readS16(value1);
                }
                if (valueFormat1 & 0x0004) {
                    list._glyphs[<number>i]._xAdvance += this._readS16(value1 + 4);
                }
                const value2: number = value1 + valueSize1;
                if (valueFormat2 & 0x0001) {
                    list._glyphs[i + 1]._leadingX += this._readS16(value2);
                }
                if (valueFormat2 & 0x0004) {
                    list._glyphs[i + 1]._xAdvance += this._readS16(value2 + 4);
                }
                break;
            }
        }
    }
    /**
     * Computes the byte size of a GPOS value record for the given format mask.
     *
     * @private
     * @param {number} valueFormat - GPOS value format bit mask.
     * @returns {number} Value record size in bytes.
     */
    private _valueSize(valueFormat: number): number {
        let size: number = 0;
        for (let bit: number = 0; bit < 8; bit++) {
            if (valueFormat & (1 << bit)) {
                size += 2;
            }
        }
        return size;
    }
}
/**
 * Entry point of the shaping pipeline; evaluates eligibility and shapes text.
 *
 * @private
 */
export class _OtfLayoutEngine {
    /**
     * Shapes text for a Unicode TrueType font when eligible, returning null when
     * any eligibility condition fails so the caller falls back to the legacy path.
     *
     * @private
     * @param {string} text - Source text.
     * @param {_UnicodeTrueTypeFont} internal - Unicode TrueType font internals.
     * @returns {_OtfGlyphInfoList} Shaped glyph list, or null when ineligible.
     */
    _shapeText(text: string, internal: _UnicodeTrueTypeFont): _OtfGlyphInfoList {
        if (text === null || typeof text === 'undefined' || text.length === 0) {
            return null;
        }
        if (internal === null || typeof internal === 'undefined' || internal._ttfReader === null ||
            typeof internal._ttfReader === 'undefined') {
            return null;
        }
        let shaper: _OtfShaper;
        try {
            shaper = new _OtfShaper(internal);
        } catch (e) {
            return null;
        }
        if (!shaper._hasLayoutTables()) {
            return null;
        }
        const script: _OtfScript = _detectOtfScript(text);
        if (script === _OtfScript.unknown) {
            return null;
        }
        const scriptTag: string = this._scriptTagOf(script);
        if (scriptTag === null) {
            return null;
        }
        try {
            const list: _OtfGlyphInfoList = shaper._shape(text, scriptTag);
            return (list !== null && typeof list !== 'undefined' && list._length > 0) ? list : null;
        } catch (e) {
            return null;
        }
    }
    /**
     * Shapes text for a `PdfTrueTypeFont`, retaining the result on the font.
     *
     * @private
     * @param {string} text - Source text.
     * @param {PdfFont} font - Font instance that retains the shaped result.
     * @param {_UnicodeTrueTypeFont} internal - Unicode TrueType font internals.
     * @returns {_OtfGlyphInfoList} Shaped glyph list, or null when ineligible.
     */
    _shapeTextForFont(text: string, font: PdfFont, internal: _UnicodeTrueTypeFont): _OtfGlyphInfoList {
        const cached: _OtfGlyphInfoList = (font !== null && typeof font !== 'undefined') ?
            font._retainedShapedList(text) as _OtfGlyphInfoList : null;
        if (cached !== null && typeof cached !== 'undefined' && cached._length > 0) {
            return cached;
        }
        const list: _OtfGlyphInfoList = this._shapeText(text, internal);
        if (list !== null && font !== null && typeof font !== 'undefined') {
            if (font._shapedGlyphs === null || typeof font._shapedGlyphs === 'undefined') {
                font._shapedGlyphs = new Map<string, any>(); // eslint-disable-line
            }
            font._shapedGlyphs.set(text, list);
        }
        return list;
    }
    /**
     * Maps a detected script to its OpenType layout script tag.
     *
     * @private
     * @param {_OtfScript} script - Detected script.
     * @returns {string} OpenType script tag, or null when unsupported.
     */
    private _scriptTagOf(script: _OtfScript): string {
        switch (script) {
        case _OtfScript.arabic:
            return _OtfScriptTag.arabic;
        case _OtfScript.bengali:
            return _OtfScriptTag.bengali2;
        case _OtfScript.devanagari:
            return _OtfScriptTag.devanagari2;
        case _OtfScript.gujarati:
            return _OtfScriptTag.gujarati2;
        case _OtfScript.gurmukhi:
            return _OtfScriptTag.gurmukhi2;
        case _OtfScript.kannada:
            return _OtfScriptTag.kannada2;
        case _OtfScript.malayalam:
            return _OtfScriptTag.malayalam2;
        case _OtfScript.oriya:
            return _OtfScriptTag.oriya2;
        case _OtfScript.tamil:
            return _OtfScriptTag.tamil2;
        case _OtfScript.telugu:
            return _OtfScriptTag.telugu2;
        case _OtfScript.thai:
            return _OtfScriptTag.thai;
        case _OtfScript.khmer:
            return _OtfScriptTag.khmer;
        default:
            return null;
        }
    }
}
