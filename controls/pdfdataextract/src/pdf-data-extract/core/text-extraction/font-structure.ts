import { _fontTables } from './font-tables';
import { _getFontEncodedString, _fontFlags, _getUnicodeForGlyph } from './font-utils';
import { _PdfMetrics } from './metrics';
import { _getDingbatsGlyphsUnicode, _getEncoding, _getFontBasicMetrics, _getFontNameToFileMap, _getGlyphMapForStandardFonts, _getGlyphsUnicode, _getNonStdFontMap, _getSerifFonts, _getStdFontMap, _getSupplementalGlyphMapForArialBlack, _getFontGlyphMap, _getSymbolsFonts, _macRomanEncoding, _standardEncoding, _symbolSetEncoding, _winAnsiEncoding, _zapfDingbatsEncoding } from './encoding-utils';
import { _PdfCharacterMapFactory, _PdfIdentityCharacterMap } from './cmap';
import { _PdfGlyphTable } from './glyph';
import { _PdfCompactFont } from './compact-font-parser';
import { _bytesToString, _PdfBaseStream, _PdfCrossReference, _PdfDictionary, _PdfName, _PdfNullStream, _PdfReference, _PdfStream, FormatError, PdfFontStyle } from '@syncfusion/ej2-pdf';
/**
 * Represents the font structure containing metrics, encodings and glyph mappings
 * used during text extraction.
 *
 * @private
 */
export class _FontStructure {
    /** Font ascent value.
     *
     * @private
     */
    _ascent: number;
    /** Font bounding box array.
     *
     * @private
     */
    _boundingBox: number[];
    /** Character map.
     *
     * @private
     */
    _characterMap: any;  //eslint-disable-line
    /** Font style flags.
     *
     * @private
     */
    _fontStyle: PdfFontStyle;
    /** Built in encoding map.
     *
     * @private
     */
    _builtInEncoding: any; //eslint-disable-line
    /** Unicode fallback mapping.
     *
     * @private
     */
    _fallBackToUnicodeMap: any; //eslint-disable-line
    /** Capital height.
     *
     * @private
     */
    _capHeight: number;
    /** encoding name.
     *
     * @private
     */
    _encoding: string = '';
    /** True if composite font.
     *
     * @private
     */
    _composite: boolean = false;
    /** CSS font info.
     *
     * @private
     */
    _cssFontInfo: any = null; //eslint-disable-line
    /** Raw font data streams.
     *
     * @private
     */
    _data: Uint8Array[];
    /** default encoding values.
     *
     * @private
     */
    _defaultEncoding: any[]; //eslint-disable-line
    /** Default glyph width.
     *
     * @private
     */
    _defaultWidth: number;
    /** Font descent.
     *
     * @private
     */
    _descent: number;
    /** Differences array for type1 encodings
     *
     * @private
     */
    _differences: any[]; //eslint-disable-line
    /** True to disable.
     *
     * @private
     */
    _disableFontFace: boolean;
    /** CIDSystemInfo for CID fonts.
     *
     * @private
     */
    _characterSystemInfo: any; //eslint-disable-line
    /** Font matrix transform array.
     *
     * @private
     */
    _fontMatrix: number[];
    /** Character cache.
     *
     * @private
     */
    _charsCache: any = Object.create(null); //eslint-disable-line
    /** Glyph cache.
     *
     * @private
     */
    _glyphCache: any = Object.create(null); //eslint-disable-line
    /** Width of array glyphs.
     *
     * @private
     */
    _widths: number[];
    /** True if vertical writing mode.
     *
     * @private
     */
    _vertical: boolean;
    /** Font type string.
     *
     * @private
     */
    _type: string;
    /** toUnicode Map objec.
     *
     * @private
     */
    _toUnicode: any; //eslint-disable-line
    /** Mapping from font char codes to Unicode or font glyph indices.
     *
     * @private
     */
    _toFontChar: any; //eslint-disable-line
    /** True when the font is considered a serif face.
     *
     * @private
     */
    _isSerifFont: boolean = false;
    /** True when the font is symbolic (Symbol/ZapfDingbats-like).
     *
     * @private
     */
    _isSymbolicFont: boolean = false;
    /** True when the font represents Type3 glyphs.
     *
     * @private
     */
    _isType3Font: boolean = false;
    /** True when the font was loaded from an internal/embedded resource.
     *
     * @private
     */
    _isInternalFont: boolean = false;
    /** Computed line height for the font in font units.
     *
     * @private
     */
    _lineHeight: number;
    /** MIME type string for detected embedded font data.
     *
     * @private
     */
    _mimeType: any; //eslint-disable-line
    /** True when the original font file is missing.
     *
     * @private
     */
    _missingFile: boolean;
    /** Resolved font name.
     *
     * @private
     */
    _name: string;
    /** Internal font flags bitfield.
     *
     * @private
     */
    _flags: number;
    /** PostScript name if available.
     *
     * @private
     */
    _psName: string;
    /** Font subtype string (e.g., 'Type1C').
     *
     * @private
     */
    _subtype: string;
    /** System font metadata object when available.
     *
     * @private
     */
    _systemFontInfo: any; //eslint-disable-line
    /** Original PDF font dictionary.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /** Cross reference table for indirect object resolution.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /** True when underlying font file is OpenType/TTF.
     *
     * @private
     */
    _isOpenType: boolean;
    /** Line gap metric extracted from font tables.
     *
     * @private
     */
    _lineGap: any; //eslint-disable-line
    /** Internal markers used for fallback/format heuristics (bold/italic).
     *
     * @private
     */
    _bold: any; //eslint-disable-line
    _italic: any; //eslint-disable-line
    _black: any; //eslint-disable-line
    /** Length fields from embedded font streams (Type1/CFF).
     *
     * @private
     */
    _length1: number;
    _length2: number;
    _length3: number;
    constructor();
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference);
    /**
     * Create a `_FontStructure` instance.
     *
     * @param {_PdfDictionary} dictionary - Optional PDF font dictionary used to initialize the structure.
     * @param {_PdfCrossReference} crossReference - Optional cross reference used to resolve indirect objects.
     *
     * @private
     */
    constructor(dictionary?: _PdfDictionary, crossReference?: _PdfCrossReference) {
        if (dictionary) {
            this._dictionary = dictionary;
            this._crossReference = crossReference;
            this._initialize();
        }
    }
    /**
     * Initialize internal structures and pre-evaluate font information.
     *
     * @private
     * @returns {void} nothing.
     */
    _initialize(): void {
        const font: _FontHelper = new _FontHelper(this, this._crossReference);
        font._preEvaluateFont(this._dictionary);
    }
    /**
     * Convert a sequence of characters into glyph objects for this font.
     *
     * @param {string} chars - String containing one or more characters to convert.
     * @returns {_Glyph} Array of `_Glyph` instances representing the characters.
     * @private
     */
    _charsToGlyphs(chars: string): _Glyph[] {
        let glyphs: any; //eslint-disable-line
        const font: _FontHelper = new _FontHelper(this, this._crossReference);
        if (this._charsCache) {
            glyphs = this._charsCache[chars]; //eslint-disable-line
        }
        if (glyphs) {
            return glyphs;
        }
        glyphs = [];
        if (this._characterMap) {
            const c: any = Object.create(null); //eslint-disable-line
            const ii: number = chars.length;
            let i: number = 0;
            while (i < ii) {
                this._characterMap._readCharacterCodeFromString(chars, i, c);
                const { charcode, length } = c;
                const char: string = chars.substring(i, i + length);
                i += length;
                const glyph: _Glyph = font._charToGlyph(charcode, length === 1 && chars.charCodeAt(i - 1) === 0x20);
                glyph._fontCharacter = char;
                glyphs.push(glyph);
            }
        } else {
            for (let i: number = 0, ii: number = chars.length; i < ii; ++i) {
                const charcode: any = chars.charCodeAt(i); //eslint-disable-line
                const glyph: _Glyph = font._charToGlyph(charcode, charcode === 0x20);
                glyph._fontCharacter = chars[Number.parseInt(i.toString(), 10)];
                glyphs.push(glyph);
            }
        }
        return (this._charsCache[chars] = glyphs); //eslint-disable-line
    }
}
/**
 * Helper that parses font dictionaries, reads font files and resolves glyph
 * and encoding information required by `_FontStructure`.
 *
 * @private
 */
export class _FontHelper {
    /** Parent `_FontStructure` instance being populated.
     *
     * @private
     */
    _fontStructure: _FontStructure;
    /** Optional per-glyph scale factors read from font tables.
     *
     * @private
     */
    _scaleFactors: any; //eslint-disable-line
    /** True when a ToUnicode map was included in the font resources.
     *
     * @private
     */
    _hasIncludedToUnicodeMap: boolean = false;
    /** Cross-reference table used for indirect object resolution.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /** First character code used by widths arrays.
     *
     * @private
     */
    _firstChar: number;
    /** Last character code used by widths arrays.
     *
     * @private
     */
    _lastChar: number;
    /** Local font table helper instance.
     *
     * @private
     */
    _table: _fontTables = new _fontTables(); //option
    /** Flag indicating whether re-measurement of fallback metrics is required.
     *
     * @private
     */
    _remeasure: any; //eslint-disable-line
    /** Standard character overrides map (used for accented character heuristics).
     *
     * @private
     */
    _standardCharacter: any; //eslint-disable-line
    /** Raw font file bytes or stream data.
     *
     * @private
     */
    _data: any; //eslint-disable-line
    /** Internal flags bitfield.
     *
     * @private
     */
    _flags: number;
    /** True when font writing direction is vertical.
     *
     * @private
     */
    _vertical: boolean;
    /** Underlying file-like object for embedded font data.
     *
     * @private
     */
    _file: any; //eslint-disable-line
    /** Detected font file type string.
     *
     * @private
     */
    _fileType: string;
    /** Detected font file subtype (e.g., 'Type1C').
     *
     * @private
     */
    _fileSubtype: string;
    /** Italic angle metric extracted from font descriptor.
     *
     * @private
     */
    _italicAngle: number;
    /** x-height metric for the font.
     *
     * @private
     */
    _xHeight: number;
    /** Name of base encoding declared in the font dictionary.
     *
     * @private
     */
    _baseEncodingName: any; //eslint-disable-line
    /** Identity transform used when normalizing font units.
     *
     * @private
     */
    _fontIdentityMatrix: number[] = [0.001, 0, 0, 0.001, 0, 0];
    /** Fallback mapping used when building ToUnicode maps.
     *
     * @private
     */
    _fallBackToUnicodeMap: any; //eslint-disable-line
    /** Mapping from character id to glyph id when present.
     *
     * @private
     */
    _characterIdToGlyphMap: any; //eslint-disable-line
    /** True when an explicit encoding is present on the font dictionary.
     *
     * @private
     */
    _hasEncoding: any; //eslint-disable-line
    /** True when the underlying file indicates OpenType-specific layouts.
     *
     * @private
     */
    _isOpenType: boolean = false;
    /** Cache for standard font binary blobs.
     *
     * @private
     */
    _standardFontDataCache: Map<any, any> = new Map<any, any>(); //eslint-disable-line
    /** Internal table of font flag constants.
     *
     * @private
     */
    _fontFlags: any = { FixedPitch: 1, Serif: 2, Symbolic: 4, Script: 8, NonSymbolic: 32, Italic: 64, AllCap: 65536, SmallCap: 131072, ForceBold: 262144}; //eslint-disable-line
    /** List of TrueType/OpenType tables we accept and parse.
     *
     * @private
     */
    _validTables: any = ['OS/2', 'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'post', 'loca', 'glyf', 'fpgm', 'prep', 'cvt', 'compactFont']; //eslint-disable-line
    /**
     * @private
     */
    _ttOpsStackDeltas: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 0, 0, -2, -5,
        -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, -1, -1,
        1, -1, -999, 0, 1, 0, -1, -2, 0, -1, -2, -1, -1, 0, -1, -1,
        0, 0, -999, -999, -1, -1, -1, -1, -2, -999, -2, -2, -999, 0, -2, -2,
        0, 0, -2, 0, -2, 0, 0, 0, -2, -1, -1, 1, 1, 0, 0, -1,
        -1, -1, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, 0, -999, -1, -1,
        -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        -2, -999, -999, -999, -999, -999, -1, -1, -2, -2, 0, 0, 0, 0, -1, -1,
        -999, -2, -2, 0, 0, -1, -2, -2, 0, 0, 0, -1, -1, -1, -2];
    constructor(fontStructure: _FontStructure, crossReference: _PdfCrossReference) {
        this._fontStructure = fontStructure;
        this._crossReference = crossReference;
    }
    /* eslint-disable */
    /**
     * Pre-evaluate the PDF font dictionary and prepare font properties.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The PDF font dictionary to inspect.
     * @returns {any} internal parsing result (implementation specific).
     */
    _preEvaluateFont(dictionary: _PdfDictionary): any {
        const baseDictionary: _PdfDictionary = dictionary;
        let type: any = dictionary.get('Subtype');
        this._fontStructure._composite = false;
        let firstChar: number;
        let lastChar: number;
        let descendantFonts: any;
        const fontStyle: PdfFontStyle = this._getFontStyle(dictionary);
        this._fontStructure._fontStyle = fontStyle;
        if (type.name === 'Type0') {
            descendantFonts = dictionary.get('DescendantFonts');
            dictionary = Array.isArray(descendantFonts) ? (descendantFonts[0] instanceof _PdfReference ?
                this._crossReference._fetch(descendantFonts[0]) : descendantFonts[0]) : descendantFonts;
            type = dictionary.get('Subtype');
            this._fontStructure._composite = true;
        }
        if (dictionary.has('FirstChar')) {
            firstChar = dictionary.get('FirstChar');
        } else {
            firstChar = 0;
        }
        if (dictionary.has('LastChar')) {
            lastChar = dictionary.get('LastChar');
        } else {
            lastChar = this._fontStructure._composite ? 0xffff : 0xff;
        }
        this._fontStructure._type = type.name;
        let descriptor: any;
        let toUnicode: any;
        if (dictionary.has('FontDescriptor')) {
            descriptor = dictionary.get('FontDescriptor');
        }
        if (dictionary.has('ToUnicode')) {
            toUnicode = dictionary.get('ToUnicode');
        }
        if (baseDictionary.has('ToUnicode')) {
            toUnicode = baseDictionary.get('ToUnicode');
        }
        this._translateFont(descriptor, dictionary, baseDictionary, firstChar, lastChar, toUnicode);
    }
    /* eslint-enable */
    /**
     * Determine the font style (bold/italic) from the font dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The PDF font dictionary.
     * @returns {PdfFontStyle} Computed `PdfFontStyle` flags.
     */
    _getFontStyle(dictionary: _PdfDictionary): PdfFontStyle {
        let fontStyle: PdfFontStyle = PdfFontStyle.regular;
        if (typeof (dictionary) !== 'undefined' && dictionary.has('BaseFont')) {
            const baseFont: string = dictionary.get('BaseFont').name;
            if (baseFont.indexOf('-') !== -1 || baseFont.indexOf(',') !== -1) {
                let style: string = '';
                if (baseFont.indexOf('-') !== -1) {
                    style = baseFont.split('-')[1];
                } else if (baseFont.indexOf(',') !== -1) {
                    style = baseFont.split(',')[1];
                }
                style = style.replace('MT', '');
                switch (style) {
                case 'Italic':
                case 'Oblique':
                    fontStyle = PdfFontStyle.italic;
                    break;
                case 'Bold':
                case 'BoldMT':
                    fontStyle = PdfFontStyle.bold;
                    break;
                case 'BoldItalic':
                case 'BoldOblique':
                    fontStyle = PdfFontStyle.italic | PdfFontStyle.bold;
                    break;
                }
            } else {
                if (baseFont.indexOf('Bold') !== -1) {
                    fontStyle = PdfFontStyle.bold;
                }
                if (baseFont.indexOf('BoldItalic') !== -1 || baseFont.indexOf('BoldOblique') !== -1) {
                    fontStyle = PdfFontStyle.italic | PdfFontStyle.bold;
                }
                if (baseFont.indexOf('Italic') !== -1 || baseFont.indexOf('Oblique') !== -1) {
                    fontStyle = PdfFontStyle.italic;
                }
            }
        }
        return fontStyle;
    }
    /* eslint-disable */
    /**
     * Translate and extract font-related structures from font descriptor and
     * dictionaries into the `_FontStructure`.
     *
     * @private
     * @param {any} descriptor - Font descriptor dictionary.
     * @param {any} dictionary - The font dictionary used for parsing.
     * @param {any} baseDictionary - Base dictionary that may contain overrides.
     * @param {number} firstChar - First character code in widths array.
     * @param {number} lastChar - Last character code in widths array.
     * @param {any} unicode - Optional ToUnicode mapping or stream.
     * @returns {any} Implementation specific result.
     */
    _translateFont(descriptor: any, dictionary: any, baseDictionary: any, firstChar: number, lastChar: number, unicode: any): any {
        const isType3Font: boolean = this._fontStructure._type === 'Type3';
        this._fontStructure._isType3Font = isType3Font;
        if (!descriptor) {
            if (isType3Font) {
                const bbox: number[] = this._lookupNormalRect(dictionary.getArray('FontBBox'), [0, 0, 0, 0]);
                descriptor = new _PdfDictionary();
                descriptor.set('FontName', _PdfName.get(this._fontStructure._type));
                descriptor.set('FontBBox', bbox);
            } else {
                let baseFontName: any = dictionary.get('BaseFont');
                if (!(baseFontName instanceof _PdfName)) {
                    throw new FormatError('Base font is not specified');
                }
                baseFontName = baseFontName.name.replace(/[,_]/g, '-');
                const metrics: any = this._getBaseFontMetrics(baseFontName);
                const fontNameWoStyle: any = baseFontName.split('-', 1)[0];
                const flags: number = (this._isSerifFont(fontNameWoStyle) ? _fontFlags.Serif : 0) | (metrics.monospace ?
                    _fontFlags.FixedPitch : 0) |
                                       (_getSymbolsFonts()[fontNameWoStyle] ? _fontFlags.Symbolic
                                           : _fontFlags.NonSymbolic);
                this._fontStructure._name = baseFontName;
                this._fontStructure._widths = metrics.widths;
                this._fontStructure._defaultWidth = metrics.defaultWidth;
                this._fontStructure._isType3Font = isType3Font;
                this._fontStructure._flags = flags;
                const widths: any = dictionary.get('Widths');
                const standardFontName: any = this._getStandardFontName(baseFontName);
                let file: any = null;
                if (standardFontName) {
                    file = this._fetchStandardFontData(standardFontName);
                    this._fontStructure._isInternalFont = !!file;
                }
                this._extractDataStructures(dictionary, unicode);
                if (Array.isArray(widths)) {
                    const glyphWidths: any = [];
                    let j: number = firstChar;
                    for (const w of widths) {
                        if (w instanceof _PdfReference) {
                            const width: any = this._crossReference._fetch(w);
                            if (typeof width === 'number') {
                                glyphWidths[Number.parseInt(j.toString(), 10)] = width;
                            }
                        } else if (typeof(w) === 'number') {
                            glyphWidths[Number.parseInt(j.toString(), 10)] = w;
                        }
                        j++;
                    }
                    this._fontStructure._widths = glyphWidths;
                } else {
                    this._fontStructure._widths = this._buildCharCodeToWidth(metrics.widths);
                }
                this._setFontData();
                return;
            }
        }
        let fontName: any;
        if (descriptor.has('FontName')) {
            fontName = descriptor.get('FontName');
            this._fontStructure._name = fontName.name;
        }
        let baseFont: any = dictionary.get('BaseFont');
        if (typeof fontName === 'string') {
            fontName = _PdfName.get(fontName);
        }
        if (typeof baseFont === 'string') {
            baseFont = _PdfName.get(baseFont);
        }
        if (!fontName) {
            fontName = baseFont;
        }
        if (!(fontName instanceof _PdfName)) {
            throw new FormatError('invalid font name');
        }
        let fontFile: any;
        let length1: number;
        let length2: number;
        let length3: number;
        try {
            if (descriptor.has('FontFile')) {
                fontFile = descriptor.get('FontFile');
            } else if (descriptor.has('FontFile2')) {
                fontFile = descriptor.get('FontFile2');
            } else if (descriptor.has('FontFile3')) {
                fontFile = descriptor.get('FontFile3');
            }
        } catch (ex) {
            fontFile = new _PdfNullStream();
        }
        if (fontFile) {
            if (fontFile.dictionary) {
                const subtypeEntry: any = fontFile.dictionary.get('Subtype');
                if (subtypeEntry instanceof _PdfName) {
                    this._fontStructure._subtype = subtypeEntry.name;
                }
                length1 = fontFile.dictionary.get('Length1');
                length2 = fontFile.dictionary.get('Length2');
                length3 = fontFile.dictionary.get('Length3');
                this._fontStructure._length1 = length1;
                this._fontStructure._length2 = length2;
                this._fontStructure._length3 = length3;
                this._file = fontFile;
            }
        }  else if (!isType3Font) {
            const standardFontName: any = this._getStandardFontName(fontName.name);
            if (standardFontName) {
                fontFile = this._fetchStandardFontData(standardFontName);
                this._fontStructure._isInternalFont = !!fontFile;
                this._file = fontFile;
            }
        }
        const fontMatrix: number[] = this._lookupMatrix(dictionary.getArray('FontMatrix'), this._fontIdentityMatrix);
        const bbox: number[] = this._lookupNormalRect(descriptor.getArray('FontBBox') || dictionary.getArray('FontBBox'), undefined);
        let ascent: number;
        let descent: number;
        let capHeight: number;
        let flags: number;
        if (descriptor.has('Ascent')) {
            ascent = descriptor.get('Ascent');
        }
        if (descriptor.has('Descent')) {
            descent = descriptor.get('Descent');
        }
        if (descriptor.has('CapHeight')) {
            capHeight = descriptor.get('CapHeight');
        }
        if (descriptor.has('FontName')) {
            this._fontStructure._name = descriptor.get('FontName').name;
        }
        if (descriptor.has('Flags')) {
            flags = descriptor.get('Flags');
        }
        const glyphSpaceUnits: number = 1000;
        this._fontStructure._fontMatrix = fontMatrix;
        this._fontStructure._boundingBox = bbox;
        this._firstChar = firstChar;
        this._lastChar = lastChar;
        this._fontStructure._ascent = ascent / glyphSpaceUnits;
        this._fontStructure._descent = descent / glyphSpaceUnits;
        this._fontStructure._lineHeight = this._fontStructure._ascent - this._fontStructure._descent;
        this._fontStructure._flags = flags;
        let encoding: _PdfName;
        if (baseDictionary.has('Encoding')) {
            const cidEncoding: any = baseDictionary.get('Encoding');
            if (cidEncoding instanceof _PdfName) {
                encoding = cidEncoding;
                this._fontStructure._encoding = encoding.name;
            } else if (cidEncoding instanceof _PdfDictionary && cidEncoding.has('Type')) {
                this._fontStructure._encoding = cidEncoding.get('Type').name;
            }
        }
        if (this._fontStructure._composite) {
            const map: _PdfCharacterMapFactory = new _PdfCharacterMapFactory();
            const cMap: any = map._create(encoding, null, null);
            this._fontStructure._characterMap = cMap;
            this._fontStructure._vertical = this._fontStructure._characterMap._vertical;
        }
        this._extractDataStructures(dictionary, unicode);
        this._extractWidths(dictionary, flags, firstChar, descriptor);
        this._setFontData();
        this._fontStructure._capHeight = capHeight / glyphSpaceUnits;
    }
    /* eslint-enable */
    /**
     * Build a mapping from character codes to glyph widths.
     *
     * @private
     * @param {any} widthsByGlyphName - Mapping of glyph names to widths.
     * @returns {any} Map of character code -> width.
     */
    _buildCharCodeToWidth(widthsByGlyphName: any): any { //eslint-disable-line
        const widths: any = Object.create(null); //eslint-disable-line
        const differences: any = this._fontStructure._differences; //eslint-disable-line
        const encoding: any = this._fontStructure._defaultEncoding; //eslint-disable-line
        for (let charCode = 0; charCode < 256; charCode++) { //eslint-disable-line
            if (charCode in differences && widthsByGlyphName[differences[charCode]]) { //eslint-disable-line
                widths[charCode] = widthsByGlyphName[differences[charCode]]; //eslint-disable-line
                continue;
            }
            if (charCode in encoding && widthsByGlyphName[encoding[charCode]]) { //eslint-disable-line
                widths[charCode] = widthsByGlyphName[encoding[charCode]]; //eslint-disable-line
                continue;
            }
        }
        return widths;
    }
    /**
     * Fetch embedded standard font data by name, if available.
     *
     * @private
     * @param {string} name - Standard font name.
     * @returns {any} A `_PdfStream` containing font bytes or null when not found.
     */
    _fetchStandardFontData(name: string): any { //eslint-disable-line
        const cachedData: any = this._standardFontDataCache.get(name); //eslint-disable-line
        if (cachedData) {
            return new _PdfStream(cachedData);
        }
        if (name !== 'Symbol' && name !== 'ZapfDingbats') {
            return null;
        }
        const standardFontNameToFileName: any = _getFontNameToFileMap; //eslint-disable-line
        const filename: string = standardFontNameToFileName[name]; //eslint-disable-line
        const cleanBase64: string = _getFontEncodedString(filename).replace(/^data:.+;base64,/, '');
        const binaryString: string = atob(cleanBase64);
        const len: number = binaryString.length;
        const bytes: Uint8Array = new Uint8Array(len);
        for (let i: number = 0; i < len; i++) {
            bytes[Number.parseInt(i.toString(), 10)] = binaryString.charCodeAt(i);
        }
        this._file = new _PdfStream(bytes);
        return this._file;
    }
    /* eslint-disable */
    /**
     * Inspect font file data and initialize internal font tables and encodings.
     *
     * @private
     * @returns {any} Implementation specific result.
     */
    _setFontData(): any {
        if (this._fontStructure._type === 'Type3') {
            this._fontStructure._toFontChar = [];
            for (let charCode: number = 0; charCode < 256; charCode++) {
                this._fontStructure._toFontChar[Number.parseInt(charCode.toString(), 10)] =
                this._fontStructure._differences[Number.parseInt(charCode.toString(), 10)] ||
                this._fontStructure._defaultEncoding[Number.parseInt(charCode.toString(), 10)];
            }
            return;
        }
        if (!this._file) {
            this._setFallBackSystemFont(this);
            return;
        }
        this._getFontFileType();
        let compactFont: any;
        try {
            switch (this._fileType) {
            case 'MMType1':
            case 'Type1':
            case 'CIDFontType0':
                this._fontStructure._mimeType = 'font/opentype';
                if (this._fileSubtype === 'Type1C' || this._fileSubtype === 'CIDFontType0C') {
                    compactFont = new _PdfCompactFont(this._file, this);
                    if (compactFont._builtInEncoding) {
                        this._fontStructure._builtInEncoding = compactFont._builtInEncoding;
                    }
                }
                this._adjustWidths();
                if (this._fontStructure._builtInEncoding) {
                    this._adjustType1ToUnicode();
                }
                break;
            case 'OpenType':
            case 'TrueType':
            case 'CIDFontType2':
                this._fontStructure._mimeType = 'font/opentype';
                this._checkAndRepair(this._file);
                if (this._isOpenType) {
                    this._adjustWidths();
                    this._fontStructure._type = 'OpenType';
                }
                break;
            default:
                throw new FormatError('Font  is not supported');
            }
        } catch (e) {
            this._setFallBackSystemFont(this);
            return;
        }
        this._amendFallBackToUnicodeMap(this);
        this._fontStructure._subtype = this._fileSubtype;
    }
    /* eslint-enable */
    /**
     * Check whether the provided file is a TrueType font.
     *
     * @private
     * @param {any} file - File-like object with `peekBytes`.
     * @returns {boolean} True when the file header matches a TrueType signature.
     */
    _isTrueTypeFile(file: any): boolean { //eslint-disable-line
        const header: any = file.peekBytes(4); //eslint-disable-line
        return (
            this._readUnsignedInt32(header, 0) === 0x00010000 || _bytesToString(header) === 'true'
        );
    }
    /**
     * Read a big-endian unsigned 32-bit integer from a byte array.
     *
     * @private
     * @param {any} data - Source byte array.
     * @param {any} offset - Offset within `data`.
     * @returns {any} The unsigned 32-bit integer value.
     */
    _readUnsignedInt32(data: any, offset: any): any { //eslint-disable-line
        return (((data[Number.parseInt(offset.toString(), 10)] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8)
         |      data[offset + 3]) >>> 0);
    }
    /**
     * Check whether the file is an OpenType font .
     *
     * @private
     * @param {any} file - File-like object with `peekBytes`.
     * @returns {boolean} True when header equals 'OTTO'.
     */
    _isOpenTypeFile(file: any): boolean { //eslint-disable-line
        const header: any = file.peekBytes(4); //eslint-disable-line
        return _bytesToString(header) === 'OTTO';
    }
    /**
     * Check whether the file appears to be a Type1 font.
     *
     * @private
     * @param {any} file - File-like object with `peekBytes`.
     * @returns {boolean} True when known Type1 signatures are found.
     */
    _isType1File(file: any): boolean { //eslint-disable-line
        const header : any= file.peekBytes(2); //eslint-disable-line
        if (header[0] === 0x25 && header[1] === 0x21) {
            return true;
        }
        if (header[0] === 0x80 && header[1] === 0x01) {
            return true;
        }
        return false;
    }
    /**
     * Determine whether the file represents a Compact Font Format.
     *
     * @private
     * @param {any} file - File-like object with `peekBytes`.
     * @returns {boolean} True for CFF-like headers.
     */
    _isCompactFontFile(file: any): boolean { //eslint-disable-line
        const header: any = file.peekBytes(4); //eslint-disable-line
        if (header[0] >= 1 && header[3] >= 1 && header[3] <= 4) {
            return true;
        }
        return false;
    }
    /**
     * Determine the font file type (TrueType, OpenType, Type1, etc.) and
     * set internal fileType/fileSubtype accordingly.
     *
     * @private
     * @returns {void} nothing.
     */
    _getFontFileType(): void {
        const composite: boolean = this._fontStructure._composite;
        const type: string = this._fontStructure._type;
        const subtype: string = this._fontStructure._subtype;
        if (this._isTrueTypeFile(this._file) || this._isTrueTypeCollectionFile(this._file)) {
            this._fileType = composite ? 'CIDFontType2' : 'TrueType';
        } else if (this._isOpenTypeFile(this._file)) {
            this._fileType = composite ? 'CIDFontType2' : 'OpenType';
        } else if (this._isType1File(this._file)) {
            if (composite) {
                this._fileType = 'CIDFontType0';
            } else {
                this._fileType = type === 'MMType1' ? 'MMType1' : 'Type1';
            }
        } else if (this._isCompactFontFile(this._file)) {
            if (composite) {
                this._fileType = 'CIDFontType0';
                this._fileSubtype = 'CIDFontType0C';
            } else {
                this._fileType = type === 'MMType1' ? 'MMType1' : 'Type1';
                this._fileSubtype = 'Type1C';
            }
        } else {
            this._fileType = type;
            this._fileSubtype = subtype;
        }
    }
    /**
     * Extract glyph widths and vertical metrics from font descriptor and
     * populate internal width tables.
     *
     * @private
     * @param {_PdfDictionary} descriptor - Font descriptor dictionary.
     * @param {number} flags - Font flags controlling symbolic/monospace behavior.
     * @param {number} firstChar - First character code.
     * @param {_PdfDictionary} dictionary - Font dictionary used when extracting widths.
     * @returns {void} nothing.
     */
    _extractWidths(descriptor: _PdfDictionary, flags: number, firstChar: number, dictionary: _PdfDictionary): void {
        let glyphsWidths: any = []; //eslint-disable-line
        let defaultWidth: number = 0;
        const glyphsVMetrics: any = []; //eslint-disable-line
        let defaultVMetrics: any; //eslint-disable-line
        if (this._fontStructure._composite) {
            const dw: any = descriptor.get('DW'); //eslint-disable-line
            defaultWidth = typeof dw === 'number' ? Math.ceil(dw) : 1000;
            const widths: any = descriptor.get('W'); //eslint-disable-line
            if (Array.isArray(widths)) {
                for (let i: number = 0, ii: number = widths.length; i < ii; i++) {
                    let start: any; //eslint-disable-line
                    if (widths[Number.parseInt(i.toString(), 10)] instanceof _PdfReference) {
                        start = this._crossReference._fetch(widths[i++]);
                    } else {
                        start = widths[i++];
                    }
                    if (!Number.isInteger(start)) {
                        break;
                    }
                    let code: any = widths[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
                    if (code instanceof _PdfReference) {
                        code = this._crossReference._fetch(widths[Number.parseInt(i.toString(), 10)]);
                    }
                    if (Array.isArray(code)) {
                        for (const c of code) {
                            let width: any; //eslint-disable-line
                            if (c instanceof _PdfReference) {
                                width = this._crossReference._fetch(c);
                            } else {
                                width = c;
                            }
                            if (typeof width === 'number') {
                                glyphsWidths[Number.parseInt(start.toString(), 10)] = width;
                            }
                            start++;
                        }
                    } else if (Number.isInteger(code)) {
                        let width: any; //eslint-disable-line
                        const widthValue: any = widths[++i]; //eslint-disable-line
                        if (widthValue instanceof _PdfReference) {
                            width = this._crossReference._fetch(widthValue);
                        } else {
                            width = widthValue;
                        }
                        if (typeof width !== 'number') {
                            continue;
                        }
                        for (let j: number = start; j <= code; j++) {
                            glyphsWidths[Number.parseInt(j.toString(), 10)] = width;
                        }
                    } else {
                        break;
                    }
                }
            }
            if (this._vertical) {
                const dw2: any = descriptor.getArray('DW2'); //eslint-disable-line
                let vmetrics: any = this._isNumberArray(dw2, 2) ? dw2 : [880, -1000]; //eslint-disable-line
                vmetrics = descriptor.get('W2');
                if (Array.isArray(vmetrics)) {
                    for (let i: number = 0, ii: number = vmetrics.length; i < ii; i++) {
                        let start: any = this._crossReference._fetch(vmetrics[i++]); //eslint-disable-line
                        if (!Number.isInteger(start)) {
                            break;
                        }
                        const code: number = this._crossReference._fetch(vmetrics[Number.parseInt(i.toString(), 10)]);
                        if (Array.isArray(code)) {
                            for (let j: number = 0, jj: number = code.length; j < jj; j++) {
                                const vmetric: any = [this._crossReference._fetch(code[j++]), this._crossReference._fetch(code[j++]), //eslint-disable-line
                                    this._crossReference._fetch(code[Number.parseInt(j.toString(), 10)])];
                                if (this._isNumberArray(vmetric, null)) {
                                    glyphsVMetrics[Number.parseInt(start.toString(), 10)] = vmetric;
                                }
                                start++;
                            }
                        } else if (Number.isInteger(code)) {
                            const vmetric: any = [this._crossReference._fetch(vmetrics[++i]),this._crossReference._fetch(vmetrics[++i]), //eslint-disable-line
                                this._crossReference._fetch(vmetrics[++i])];
                            if (!this._isNumberArray(vmetric, null)) {
                                continue;
                            }
                            for (let j: number = start; j <= code; j++) {
                                glyphsVMetrics[Number.parseInt(j.toString(), 10)] = vmetric;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        } else {
            const widths: any = descriptor.get('Widths'); //eslint-disable-line
            if (Array.isArray(widths)) {
                let j: number = firstChar;
                for (const w of widths) {
                    let width: any; //eslint-disable-line 
                    if (w instanceof _PdfReference) {
                        width = this._crossReference._fetch(w);
                    } else {
                        width = w;
                    }
                    if (typeof width === 'number') {
                        glyphsWidths[Number.parseInt(j.toString(), 10)] = width;
                    }
                    j++;
                }
                const missingWidth: any = dictionary.get('MissingWidth'); //eslint-disable-line
                defaultWidth = typeof missingWidth === 'number' ? missingWidth : 0;
            }
        }
        let isMonospace: boolean = true;
        let firstWidth: any = defaultWidth; //eslint-disable-line
        const keys: any = Object.keys(glyphsWidths); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const glyph: any = keys[i]; //eslint-disable-line
            const glyphWidth: any = glyphsWidths[glyph]; //eslint-disable-line
            if (!glyphWidth) {
                continue;
            }
            if (!firstWidth) {
                firstWidth = glyphWidth;
                continue;
            }
            if (firstWidth !== glyphWidth) {
                isMonospace = false;
                break;
            }
        }
        if (isMonospace) {
            flags |= this._fontFlags.FixedPitch;
        } else {
            flags &= ~this._fontFlags.FixedPitch;
        }
        this._fontStructure._defaultWidth = defaultWidth;
        this._fontStructure._widths = glyphsWidths;
        this._flags = flags;
    }
    /**
     * Normalize rectangle coordinates so that left <= right and top <= bottom.
     *
     * @private
     * @param  {number} rect - Rectangle array [left, top, right, bottom].
     * @returns {number} Normalized rectangle array.
     */
    _normalizeRect(rect: number[]): number[] {
        const r: number[] = rect.slice(0); // clone rect
        if (rect[0] > rect[2]) {
            r[0] = rect[2];
            r[2] = rect[0];
        }
        if (rect[1] > rect[3]) {
            r[1] = rect[3];
            r[3] = rect[1];
        }
        return r;
    }
    /**
     * Check whether a value is a numeric array of an expected length.
     *
     * @private
     * @param {any} arr - Value to test.
     * @param {number} len - Required length or `null` to ignore length.
     * @returns {boolean} True when `arr` is an array of numbers matching `len`.
     */
    private _isNumberArray(arr: any, len: number): boolean { //eslint-disable-line
        if (!Array.isArray(arr)) {
            return false;
        }
        if (len !== null && arr.length !== len) {
            return false;
        }
        for (let i: number = 0; i < arr.length; i++) {
            if (typeof arr[Number.parseInt(i.toString(), 10)] !== 'number') {
                return false;
            }
        }
        return true;
    }
    /**
     * Return `arr` when it is a 6-element numeric matrix, otherwise the fallback.
     *
     * @private
     * @param {any} arr - Candidate matrix.
     * @param {number} fallBack - Fallback matrix.
     * @returns {any} Either `arr` or `fallBack`.
     */
    _lookupMatrix(arr: any, fallBack: number[]): any { //eslint-disable-line
        return this._isNumberArray(arr, 6) ? arr : fallBack;
    }
    /**
     * Return `arr` when it is a 4-element numeric rect, otherwise the fallback.
     *
     * @private
     * @param {any} arr - Candidate rect.
     * @param {number} fallBack - Fallback rect.
     * @returns {any} Either `arr` or `fallBack`.
     */
    _lookupRect(arr: any, fallBack: number[]): any { //eslint-disable-line
        return this._isNumberArray(arr, 4) ? arr : fallBack;
    }
    /**
     * Return a normalized rect when `arr` is a numeric rect, otherwise the fallback.
     *
     * @private
     * @param {any} arr - Candidate rect.
     * @param {number} fallBack - Fallback rect.
     * @returns {any} Normalized rect or fallback.
     */
    _lookupNormalRect(arr: any, fallBack: number[]): any { //eslint-disable-line
        return this._isNumberArray(arr, 4) ? this._normalizeRect(arr) : fallBack;
    }
    /**
     * Extract encoding, differences and ToUnicode mappings from the font
     * dictionary into the `_FontStructure`.
     *
     * @private
     * @param {_PdfDictionary} dictionary - PDF font dictionary.
     * @param {any} unicode - Optional ToUnicode mapping or stream.
     * @returns {void} nothing.
     */
    _extractDataStructures(dictionary: _PdfDictionary, unicode?: any): void { //eslint-disable-line
        const differences: any = []; //eslint-disable-line
        let baseEncodingName: any = null; //eslint-disable-line
        let encoding: any; //eslint-disable-line
        if (this._fontStructure._composite) {
            const cidSystemInfo: any = dictionary.get('CIDSystemInfo'); //eslint-disable-line
            if (cidSystemInfo instanceof _PdfDictionary) {
                this._fontStructure._characterSystemInfo = {
                    registry: this._stringToPdfString(cidSystemInfo.get('Registry')),
                    ordering: this._stringToPdfString(cidSystemInfo.get('Ordering')),
                    supplement: cidSystemInfo.get('Supplement')
                };
            }
        }
        if (dictionary.has('Encoding')) {
            encoding = dictionary.get('Encoding');
            if (encoding instanceof _PdfDictionary) {
                baseEncodingName = encoding.get('BaseEncoding');
                baseEncodingName = baseEncodingName instanceof _PdfName ? baseEncodingName.name : null;
                if (encoding.has('Differences')) {
                    const diffEncoding: any = encoding.get('Differences'); //eslint-disable-line
                    let index: number = 0;
                    for (const entry of diffEncoding) {
                        let data: any; //eslint-disable-line
                        if (entry instanceof _PdfReference) {
                            data = this._crossReference._fetch(entry);
                        } else {
                            data = entry;
                        }
                        if (typeof data === 'number') {
                            index = data;
                        } else if (data instanceof _PdfName) {
                            differences[index++] = data.name;
                        } else {
                            throw new FormatError(`Invalid entry in 'Differences' array: ${data}`);
                        }
                    }
                }
            } else if (encoding instanceof _PdfName) {
                baseEncodingName = encoding.name;
            }
            if (baseEncodingName !== 'MacRomanEncoding' && baseEncodingName !== 'MacExpertEncoding' && baseEncodingName !== 'WinAnsiEncoding') {
                baseEncodingName = null;
            }
        }
        const nonEmbeddedFont: any = !this._file || this._fontStructure._isInternalFont; //eslint-disable-line
        let isSymbolsFontName: any = _getSymbolsFonts()[this._fontStructure._name]; //eslint-disable-line
        if (baseEncodingName && nonEmbeddedFont && isSymbolsFontName) {
            baseEncodingName = null;
        }
        if (baseEncodingName) {
            this._fontStructure._defaultEncoding = _getEncoding(baseEncodingName);
        } else {
            const isSymbolicFont: boolean = !!(this._fontStructure._flags & this._fontFlags.Symbolic);
            const isNonSymbolicFont: boolean = !!(this._fontStructure._flags & this._fontFlags.NonSymbolic);
            encoding = _standardEncoding;
            if (this._fontStructure._type === 'TrueType' && !isNonSymbolicFont) {
                encoding = _winAnsiEncoding;
            }
            if (isSymbolicFont) {
                encoding = _macRomanEncoding;
                if (nonEmbeddedFont) {
                    if (/Symbol/i.test(this._fontStructure._name)) {
                        encoding = _symbolSetEncoding;
                    } else if (/Dingbats/i.test(this._fontStructure._name)) {
                        encoding = _zapfDingbatsEncoding;
                    } else if (/Wingdings/i.test(this._fontStructure._name)) {
                        encoding = _winAnsiEncoding;
                    }
                }
            }
            this._fontStructure._defaultEncoding = encoding;
        }
        this._fontStructure._differences = differences;
        this._baseEncodingName = baseEncodingName;
        this._fontStructure._toUnicode = this._readToUnicode(unicode);
        this._hasEncoding = !!baseEncodingName || differences.length > 0;
        this._fontStructure._toUnicode = this._buildToUnicode(baseEncodingName, this._hasEncoding, this._fontStructure._toUnicode);
    }
    /**
     * Convert a PDF string to a JavaScript string.
     *
     * @private
     * @param {any} text - Input PDF string buffer.
     * @returns {any} Decoded JavaScript string.
     */
    _stringToPdfString(text: any): any { //eslint-disable-line
        if (text[0] >= '\xEF') {
            let encoding: any; //eslint-disable-line
            if (text[0] === '\xFE' && text[1] === '\xFF') {
                encoding = 'utf-16be';
                if (text.length % 2 === 1) {
                    text = text.slice(0, -1);
                }
            } else if (text[0] === '\xFF' && text[1] === '\xFE') {
                encoding = 'utf-16le';
                if (text.length % 2 === 1) {
                    text = text.slice(0, -1);
                }
            } else if (text[0] === '\xEF' && text[1] === '\xBB' && text[2] === '\xBF') {
                encoding = 'utf-8';
            }
            if (encoding) {
                try {
                    const decoder: TextDecoder = new TextDecoder(encoding, { fatal: true });
                    const buffer : Uint8Array = this._stringToBytes(text);
                    const decoded: string = decoder.decode(buffer);
                    if (!decoded.includes('\x1b')) {
                        return decoded;
                    }
                    return decoded.replace(/[\x1b][^\x1b]*(?:[\x1b]|$)/g, ''); //eslint-disable-line
                } catch (ex) {
                    throw new FormatError(ex.toString());
                }
            }
        }
        const strBuf: any = []; //eslint-disable-line
        const stringTranslateTable: any = [ //eslint-disable-line
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2d8,
            0x2c7, 0x2c6, 0x2d9, 0x2dd, 0x2db, 0x2da, 0x2dc, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192,
            0x2044, 0x2039, 0x203a, 0x2212, 0x2030, 0x201e, 0x201c, 0x201d, 0x2018,
            0x2019, 0x201a, 0x2122, 0xfb01, 0xfb02, 0x141, 0x152, 0x160, 0x178, 0x17d,
            0x131, 0x142, 0x153, 0x161, 0x17e, 0, 0x20ac
        ];
        for (let i: number = 0, ii: number = text.length; i < ii; i++) {
            const charCode: any = text.charCodeAt(i); //eslint-disable-line
            const code: any = stringTranslateTable[charCode]; //eslint-disable-line
            strBuf.push(code ? String.fromCharCode(code) : text.charAt(i));
        }
        return strBuf.join('');
    }
    /**
     * Read and build a to-unicode map from a CMap name or stream.
     *
     * @private
     * @param {any} cmapObj - CMap name or stream object.
     * @returns {any} A unicode mapping object or null.
     */
    _readToUnicode(cmapObj: any): any { //eslint-disable-line
        const cMap: _PdfCharacterMapFactory = new _PdfCharacterMapFactory();
        if (!cmapObj) {
            return null;
        }
        if (cmapObj instanceof _PdfName) {
            const cmap : any = cMap._create(cmapObj, null, null); //eslint-disable-line
            if (cmap instanceof _PdfIdentityCharacterMap) {
                return new _PdfIdentityToUnicodeMap(0, 0xffff);
            }
            return new _UnicodeMap(cmap.getMap());
        }
        if (cmapObj instanceof _PdfBaseStream) {
            const cmap : any = cMap._create(cmapObj, null, null); //eslint-disable-line
            if (cmap) {
                try {
                    if (cmap instanceof _PdfIdentityCharacterMap) {
                        return new _PdfIdentityToUnicodeMap(0, 0xffff);
                    }
                    const map: any = new Array(cmap._map.length); //eslint-disable-line
                    cmap._forEach((charCode: any, token: any) => { //eslint-disable-line
                        if (typeof token === 'number') {
                            map[Number.parseInt(charCode.toString(), 10)] = String.fromCodePoint(token);
                            return;
                        }
                        if (token.length % 2 !== 0) {
                            token = '\u0000' + token;
                        }
                        const str: number[] = [];
                        for (let k: number = 0; k < token.length; k += 2) {
                            const w1: number = (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1);
                            if ((w1 & 0xf800) !== 0xd800) {
                                str.push(w1);
                                continue;
                            }
                            k += 2;
                            const w2: any = (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1); //eslint-disable-line
                            str.push(((w1 & 0x3ff) << 10) + (w2 & 0x3ff) + 0x10000);
                        }
                        map[charCode] = String.fromCodePoint.apply(String, str); //eslint-disable-line
                    });
                    return new _UnicodeMap(map);
                } catch (reason) {
                    throw new FormatError(reason.toString());
                }
            }
        }
        return null;
    }
    /**
     * Build a ToUnicode mapping taking into account base encodings and CMaps.
     *
     * @private
     * @param {any} baseEncodingName - Name of the base encoding if present.
     * @param {boolean} isEncoding - True when an explicit encoding is present.
     * @param {any} toUnicode - Existing toUnicode structure if any.
     * @returns {any} A mapping object representing character -> unicode.
     */
    _buildToUnicode(baseEncodingName: any, isEncoding: boolean, toUnicode: any): any { //eslint-disable-line
        this._hasIncludedToUnicodeMap = toUnicode && toUnicode._length > 0;
        if (this._hasIncludedToUnicodeMap) {
            if (!this._fontStructure._composite && isEncoding) {
                this._fallBackToUnicodeMap = this._simpleFontToUnicode(baseEncodingName);
            }
            return toUnicode;
        }
        if (!this._fontStructure._composite) {
            return new _UnicodeMap(this._simpleFontToUnicode(this._baseEncodingName));
        }
        if (this._fontStructure._composite && ((this._fontStructure._characterMap.builtInCMap &&
            !(this._fontStructure._characterMap instanceof _PdfIdentityCharacterMap)) ||
            (this._fontStructure._characterSystemInfo && this._fontStructure._characterSystemInfo.registry === 'Adobe' &&
            (this._fontStructure._characterSystemInfo.ordering === 'GB1' || this._fontStructure._characterSystemInfo.ordering === 'CNS1' ||
            this._fontStructure._characterSystemInfo.ordering === 'Japan1' || this._fontStructure._characterSystemInfo.ordering === 'Korea1')))) {
            const { registry, ordering } = this._fontStructure._characterSystemInfo;
            const ucs2CMapName: any = _PdfName.get(`${registry}-${ordering}-UCS2`); //eslint-disable-line
            const map: _PdfCharacterMapFactory = new _PdfCharacterMapFactory();
            const ucs2CMap: any = map._create(ucs2CMapName, null, null); //eslint-disable-line
            const toUnicode: any = [];  //eslint-disable-line
            let buf: any = [];  //eslint-disable-line
            this._fontStructure._characterMap._forEach((charcode: any, cid: any) => { //eslint-disable-line
                if (cid > 0xffff) {
                    throw new FormatError('Max size of Character identifier is 65,535');
                }
                const ucs2: any = ucs2CMap._lookup(cid); //eslint-disable-line
                if (ucs2) {
                    buf.length = 0;
                    for (let i: number = 0, ii: number = ucs2.length; i < ii; i += 2) {
                        buf.push((ucs2.charCodeAt(i) << 8) + ucs2.charCodeAt(i + 1));
                    }
                    toUnicode[charcode] = String.fromCharCode(...buf); //eslint-disable-line
                }
            });
            return new _UnicodeMap(toUnicode);
        }
        return new _PdfIdentityToUnicodeMap(this._firstChar, this._lastChar);
    }
    /**
     * Build a simple ToUnicode map for non-composite fonts using a base encoding.
     *
     * @private
     * @param {any} baseEncodingName - Base encoding name to use.
     * @param {boolean} forceGlyphs - When true forces glyph numeric parsing.
     * @returns {void} Array mapping character codes to unicode strings.
     */
    _simpleFontToUnicode(baseEncodingName: any, forceGlyphs: boolean = false): void { //eslint-disable-line  
        const toUnicode: any = []; //eslint-disable-line
        const encoding: any = this._fontStructure._defaultEncoding.slice(); //eslint-disable-line
        const differences: any = this._fontStructure._differences; //eslint-disable-line
        let keys: any = Object.keys(differences); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[i]; //eslint-disable-line
            const glyphName: string = differences[Number.parseInt(charCode.toString(), 10)];
            if (glyphName === '.notdef') {
                continue;
            }
            encoding[Number.parseInt(charCode.toString(), 10)] = glyphName;
        }
        const glyphsUnicodeMap: any = _getGlyphsUnicode(); //eslint-disable-line
        keys = Object.keys(encoding);
        for (let i: number = 0; i < keys.length; i++) {
            const charcode: any = keys[i]; //eslint-disable-line
            let glyphName: any = encoding[Number.parseInt(charcode.toString(), 10)]; //eslint-disable-line
            if (glyphName === '') {
                continue;
            }
            let unicode: any = glyphsUnicodeMap[glyphName]; //eslint-disable-line 
            if (unicode !== undefined) {
                toUnicode[Number.parseInt(charcode.toString(), 10)] = String.fromCharCode(unicode);
                continue;
            }
            let code: number = 0;
            switch (glyphName[0]) {
            case 'G':
                if (glyphName.length === 3) {
                    code = parseInt(glyphName.substring(1), 16);
                }
                break;
            case 'g':
                if (glyphName.length === 5) {
                    code = parseInt(glyphName.substring(1), 16);
                }
                break;
            case 'C':
            case 'c':
                if (glyphName.length >= 3 && glyphName.length <= 4) {
                    const codeStr: any = glyphName.substring(1); //eslint-disable-line
                    if (forceGlyphs) {
                        code = parseInt(codeStr, 16);
                        break;
                    }
                    code = +codeStr;
                    if (Number.isNaN(code) && Number.isInteger(parseInt(codeStr, 16))) {
                        return this._simpleFontToUnicode(true);
                    }
                }
                break;
            case 'u':
                unicode = _getUnicodeForGlyph(glyphName, glyphsUnicodeMap);
                if (unicode !== -1) {
                    code = unicode;
                }
                break;
            default:
                switch (glyphName) {
                case 'f_h':
                case 'f_t':
                case 'T_h':
                    toUnicode[Number.parseInt(charcode.toString(), 10)] = glyphName.replace('_', '');
                    continue;
                }
                break;
            }
            if (code > 0 && code <= 0x10ffff && Number.isInteger(code)) {
                if (baseEncodingName && code === +charcode) {
                    const baseEncoding: any = _getEncoding(baseEncodingName); //eslint-disable-line
                    glyphName = baseEncoding[Number.parseInt(charcode.toString(), 10)];
                    if (baseEncoding && glyphName) {
                        toUnicode[Number.parseInt(charcode.toString(), 10)] =
                                String.fromCharCode(glyphsUnicodeMap[Number.parseInt(glyphName.toString(), 10)]);
                        continue;
                    }
                }
                toUnicode[Number.parseInt(charcode.toString(), 10)] = String.fromCodePoint(code);
            }
        }
        return toUnicode;
    }
    /**
     * Convert a 32-bit integer to a 4-character string.
     *
     * @private
     * @param {any} value - 32-bit integer value.
     * @returns {any} The 4-character string representation.
     */
    _string32(value: any) { //eslint-disable-line
        return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
    }
    /**
     * Build mapping from character codes to font character unicode values.
     *
     * @private
     * @param {any} encoding - Encoding array.
     * @param {any} glyphsUnicodeMap - Glyph-to-unicode lookup map.
     * @param {any} differences - Differences array from encoding.
     * @returns {any} Mapping array from charCode to unicode.
     */
    _buildToFontChar(encoding: any, glyphsUnicodeMap: any, differences: any): any { //eslint-disable-line
        const toFontChar: any = []; //eslint-disable-line
        let unicode: any; //eslint-disable-line
        for (let i: number = 0, ii: number = encoding.length; i < ii; i++) {
            unicode = this._getUnicodeForGlyph(encoding[Number.parseInt(i.toString(), 10)], glyphsUnicodeMap);
            if (unicode !== -1) {
                toFontChar[Number.parseInt(i.toString(), 10)] = unicode;
            }
        }
        const keys: any = Object.keys(differences); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode = keys[i]; //eslint-disable-line
            unicode = this._getUnicodeForGlyph(differences[Number.parseInt(charCode.toString(), 10)], glyphsUnicodeMap);
            if (unicode !== -1) {
                toFontChar[+charCode] = unicode;
            }
        }
        return toFontChar;
    }
    /**
     * Resolve a glyph name into a unicode code point using known mapping rules.
     *
     * @private
     * @param {any} name - Glyph name (e.g. 'A', 'uniXXXX', 'uXXXX').
     * @param {any} glyphsUnicodeMap - Known glyph->unicode mapping table.
     * @returns {any} Unicode code point or -1 when unknown.
     */
    _getUnicodeForGlyph(name: any, glyphsUnicodeMap: any): any { //eslint-disable-line
        let unicode: any = glyphsUnicodeMap[Number.parseInt(name.toString(), 10)]; //eslint-disable-line
        if (unicode !== undefined) {
            return unicode;
        }
        if (!name) {
            return -1;
        }
        if (name[0] === 'u') {
            const nameLen: number = name.length;
            let hexStr: string;
            if (nameLen === 7 && name[1] === 'n' && name[2] === 'i') {
                hexStr = name.substring(3);
            } else if (nameLen >= 5 && nameLen <= 7) {
                hexStr = name.substring(1);
            } else {
                return -1;
            }
            if (hexStr === hexStr.toUpperCase()) {
                unicode = parseInt(hexStr, 16);
                if (unicode >= 0) {
                    return unicode;
                }
            }
        }
        return -1;
    }
    /**
     * Write an unsigned 32-bit value into a byte array.
     *
     * @private
     * @param {number} bytes - Destination byte array.
     * @param {number} index - Starting index in `bytes`.
     * @param {number} value - Unsigned 32-bit value to write.
     * @returns {void} nothing.
     */
    _writeUnSignedInt32(bytes: number[], index: number, value: number): void {
        bytes[index + 3] = value & 0xff;
        bytes[index + 2] = value >>> 8;
        bytes[index + 1] = value >>> 16;
        bytes[Number.parseInt(index.toString(), 10)] = value >>> 24;
    }
    /**
     * Convert a JavaScript string to a `Uint8Array` of character codes.
     *
     * @private
     * @param {any} value - Input string.
     * @returns {Uint8Array} The resulting `Uint8Array`.
     */
    _stringToBytes(value: any): Uint8Array { //eslint-disable-line
        if (typeof value !== 'string') {
            //unreachable('Invalid argument for stringToBytes');
        }
        const length: number = value.length;
        const bytes: Uint8Array = new Uint8Array(length);
        for (let i: number = 0; i < length; ++i) {
            bytes[Number.parseInt(i.toString(), 10)] = value.charCodeAt(i) & 0xff;
        }
        return bytes;
    }
    /**
     * Write a signed 16-bit integer into a byte array.
     *
     * @private
     * @param {number} bytes - Destination byte array.
     * @param {number} index - Index to write to.
     * @param {number} value - Signed 16-bit integer value.
     * @returns {void} nothing.
     */
    _writeSignedInt16(bytes: number[], index: number, value: number): void {
        bytes[index + 1] = value;
        bytes[Number.parseInt(index.toString(), 10)] = value >>> 8;
    }
    /**
     * Combine two bytes into a signed 16-bit integer.
     *
     * @private
     * @param {number} b0 - High byte.
     * @param {number} b1 - Low byte.
     * @returns {number} Signed 16-bit integer.
     */
    _signedInt16(b0: number, b1: number): number {
        const value: number = (b0 << 8) + b1;
        return value & (1 << 15) ? value - 0x10000 : value;
    }
    /**
     * Determine whether the font name is considered a serif font.
     *
     * @private
     * @param {string} baseFontName - Base font name to check.
     * @returns {boolean} True when font is a serif font.
     */
    _isSerifFont(baseFontName: string): boolean {
        const fontNameWoStyle: any = baseFontName.split('-', 1)[0]; //eslint-disable-line
        return (fontNameWoStyle in _getSerifFonts() || /serif/gi.test(fontNameWoStyle));
    }
    /* eslint-disable */
    /**
     * Adjust stored glyph widths according to the font matrix scale.
     *
     * @private
     * @returns {any} nothing.
     */
    _adjustWidths(): any {
        if (!this._fontStructure._fontMatrix[0]) {
            return;
        }
        if (this._fontStructure._fontMatrix[0] === this._fontIdentityMatrix[0]) {
            return;
        }
        const scale: number = 0.001 / this._fontStructure._fontMatrix[0];
        const glyphsWidths: any = this._fontStructure._widths;
        const keys: any = Object.keys(glyphsWidths);
        for (let i: number = 0; i < keys.length; i++) {
            const glyph = keys[i];
            glyphsWidths[Number.parseInt(glyph.toString(), 10)] *= scale;
        }
        this._fontStructure._defaultWidth *= scale;
    }
    /* eslint-enable */
    /**
     * Retrieve basic font metrics for a given base font name.
     *
     * @private
     * @param {string} name - Font name to query.
     * @returns {any} Object containing `defaultWidth`, `monospace` and `widths`.
     */
    _getBaseFontMetrics(name: string): any { //eslint-disable-line
        let defaultWidth: number = 0;
        let widths: any = Object.create(null); //eslint-disable-line
        let monospace: boolean = false;
        const stdFontMap: any = _getStdFontMap(); //eslint-disable-line
        let lookupName: string = stdFontMap[Number.parseInt(name.toString(), 10)] || name;
        const metrices: any = this._getMetrics(); //eslint-disable-line
        if (metrices.indexOf(lookupName) === -1) {
            lookupName = this._isSerifFont(name) ? 'Times-Roman' : 'Helvetica';
        }
        const metrics: _PdfMetrics = new _PdfMetrics();
        let glyphWidths: any; //eslint-disable-line
        switch (lookupName) {
        case 'Courier':
            glyphWidths = metrics._courier;
            break;
        case 'Courier-Bold':
            glyphWidths = metrics._courierBold;
            break;
        case 'Courier-BoldOblique':
            glyphWidths = metrics._courierBoldOblique;
            break;
        case 'Courier-Oblique':
            glyphWidths = metrics._courierOblique;
            break;
        case 'Helvetica':
            glyphWidths = metrics._helveticaWidths;
            break;
        case 'Helvetica-Bold':
            glyphWidths = metrics._helveticaBold;
            break;
        case 'Helvetica-BoldOblique':
            glyphWidths = metrics._helveticaBoldOblique;
            break;
        case 'Helvetica-Oblique':
            glyphWidths = metrics._helveticaOblique;
            break;
        case 'Symbol':
            glyphWidths = metrics._symbol;
            break;
        case 'Times-Roman':
            glyphWidths = metrics._timesRoman;
            break;
        case 'Times-Bold':
            glyphWidths = metrics._timesBold;
            break;
        case 'Times-BoldItalic':
            glyphWidths = metrics._timesBoldItalic;
            break;
        case 'Times-Italic':
            glyphWidths = metrics._timesItalic;
            break;
        case 'ZapfDingbats':
            glyphWidths = metrics._zapfDingbats;
            break;
        }
        if (typeof glyphWidths === 'number') {
            defaultWidth = glyphWidths;
            monospace = true;
        } else {
            widths = glyphWidths;
        }
        return {defaultWidth, monospace, widths};
    }
    /**
     * Return the list of supported standard font names used for metric lookup.
     *
     * @private
     * @returns {any} Array of standard font names.
     */
    _getMetrics(): any { //eslint-disable-line
        const fontNames: any = ['Courier', 'Courier-Bold', 'Courier-BoldOblique', 'Courier-Oblique', 'Helvetica', 'Helvetica-Bold', 'Helvetica-BoldOblique',  'Helvetica-Oblique', 'Symbol', 'Times-Bold', 'Times-Roman', 'Times-BoldItalic', 'Times-Italic', 'ZapfDingbats']; //eslint-disable-line
        return fontNames;
    }
    /**
     * Normalize and map an input font name to a standard font key where possible.
     *
     * @private
     * @param {name} name - Input font name.
     * @returns {any} Standard font key or undefined when not found.
     */
    _getStandardFontName(name: string): any { //eslint-disable-line
        const fontName: string = this._normalizeFontName(name);
        const stdFontMap: any = _getStdFontMap(); //eslint-disable-line
        return stdFontMap[fontName]; //eslint-disable-line
    }
    /**
     * Normalize a font name by replacing commas/underscores and removing spaces.
     *
     * @private
     * @param {string} name - Font name to normalize.
     * @returns {string} Normalized font name.
     */
    _normalizeFontName(name: string): string {
        return name.replace(/[,_]/g, '-').replace(/\s/g, '');
    }
    /**
     * Amend the font's ToUnicode map with fallback mappings when necessary.
     *
     * @private
     * @param {any} properties - Helper properties containing fallback maps.
     * @returns {void} nothing.
     */
    _amendFallBackToUnicodeMap(properties: any): void { //eslint-disable-line
        if (!properties._fallBackToUnicodeMap) {
            return;
        }
        if (properties._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap) {
            return;
        }
        const toUnicode: any = []; //eslint-disable-line
        for (const charCode in properties._fallBackToUnicodeMap) {
            if (properties._fontStructure._toUnicode._has(charCode)) {
                continue;
            }
            toUnicode[Number.parseInt(charCode.toString(), 10)] = properties._fallBackToUnicodeMap[
                Number.parseInt(charCode.toString(), 10)];
        }
        if (toUnicode.length > 0) {
            properties._fontStructure._toUnicode._amend(toUnicode);
        }
    }
    /* eslint-disable */
    /**
     * Apply a standard glyph map to an existing mapping array.
     *
     * @private
     * @param {any} map - Destination map to modify.
     * @param {any} glyphMap - Source glyph mapping object.
     * @returns {any} nothing.
     */
    _applyStandardFontGlyphMap(map: any, glyphMap: any): any {
        const keys: any = Object.keys(glyphMap);
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)];
            map[+charCode] = glyphMap[Number.parseInt(charCode.toString(), 10)];
        }
    }
    /**
     * Set a fallback system font and populate default metrics when a font
     * file is missing or unsupported.
     *
     * @private
     * @param  {any} properties - Helper properties used during fallback.
     * @returns {any} nothing.
     */
    _setFallBackSystemFont(properties: any): any {
        this._fontStructure._missingFile = true;
        const name: string = this._fontStructure._name;
        const type: string = this._fontStructure._type;
        let fontName: string = this._normalizeFontName(name);
        const stdFontMap: any = _getStdFontMap();
        const nonStdFontMap: any = _getNonStdFontMap();
        const isStandardFont: boolean = !!stdFontMap[fontName];
        const isMappedToStandardFont: any = !!(nonStdFontMap[fontName] && stdFontMap
                                            [nonStdFontMap[fontName]]);
        fontName = stdFontMap[fontName] || nonStdFontMap[fontName]
                   || fontName;
        const fontBasicMetricsMap: any = _getFontBasicMetrics();
        const metrics: any = fontBasicMetricsMap[fontName];
        if (metrics) {
            if (isNaN(this._fontStructure._ascent)) {
                this._fontStructure._ascent = metrics.ascent / 1000;
            }
            if (isNaN(this._fontStructure._descent)) {
                this._fontStructure._descent = metrics.descent / 1000;
            }
            if (isNaN(this._fontStructure._capHeight)) {
                this._fontStructure._capHeight = metrics.capHeight / 1000;
            }
        }
        this._fontStructure._bold = /bold/gi.test(fontName);
        this._fontStructure._italic = /oblique|italic/gi.test(fontName);
        this._fontStructure._black = /Black/g.test(name);
        const isNarrow: boolean = /Narrow/g.test(name);
        this._remeasure = (!isStandardFont || isNarrow) && Object.keys(this._fontStructure._widths).length > 0;
        if ((isStandardFont || isMappedToStandardFont) && type === 'CIDFontType2' && this._fontStructure._encoding.startsWith('Identity-')) {
            const cidToGidMap: any = properties.cidToGidMap;
            const map: any= [];
            this._applyStandardFontGlyphMap(map, _getGlyphMapForStandardFonts());
            if (/Arial-?Black/i.test(name)) {
                this._applyStandardFontGlyphMap(map, _getSupplementalGlyphMapForArialBlack());
            } else if (/Calibri/i.test(name)) {
                this._applyStandardFontGlyphMap(map, _getFontGlyphMap());
            }
            if (cidToGidMap) {
                const keys: any = Object.keys(map);
                for (let i: number = 0; i < keys.length; i++) {
                    const charCode: any = keys[Number.parseInt(i.toString(), 10)];
                    const cid: any = map[Number.parseInt(charCode.toString(), 10)];
                    if (cidToGidMap[Number.parseInt(cid.toString(), 10)] !== undefined) {
                        map[+charCode] = cidToGidMap[Number.parseInt(cid.toString(), 10)];
                    }
                }
                if (cidToGidMap.length !== this._fontStructure._toUnicode.length && properties.hasIncludedToUnicodeMap &&
                    this._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap) {
                    this._fontStructure._toUnicode._forEach((charCode: any, unicodeCharCode: any) => {
                        const cid: any = map[Number.parseInt(charCode.toString(), 10)];
                        if (cidToGidMap[Number.parseInt(cid.toString(), 10)] === undefined) {
                            map[+charCode] = unicodeCharCode;
                        }
                    });
                }
            }
            if (!(this._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap)) {
                this._fontStructure._toUnicode._forEach((charCode: any, unicodeCharCode: any) => {
                    map[+charCode] = unicodeCharCode;
                });
            }
            this._fontStructure._toFontChar = map;
            this._fontStructure._toUnicode = new _UnicodeMap(map);
        } else if (/Symbol/i.test(fontName)) {
            this._fontStructure._toFontChar = this._buildToFontChar(_symbolSetEncoding, _getGlyphsUnicode(),
                                                                    this._fontStructure._differences);
        } else if (/Dingbats/i.test(fontName)) {
            this._fontStructure._toFontChar = this._buildToFontChar(_zapfDingbatsEncoding, _getDingbatsGlyphsUnicode(),
                                                                    this._fontStructure._differences);
        } else if (isStandardFont) {
            const map: any = this._buildToFontChar(this._fontStructure._defaultEncoding, _getGlyphsUnicode(), this._fontStructure._differences);
            if (type === 'CIDFontType2' && !this._fontStructure._encoding.startsWith('Identity-') && !(this._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap)) {
                this._fontStructure._toUnicode._forEach((charCode: any, unicodeCharCode:any) => {
                    map[+charCode] = unicodeCharCode;
                });
            }
            this._fontStructure._toFontChar = map;
        } else {
            const glyphsUnicodeMap: any = _getGlyphsUnicode();
            const map: any = [];
            this._fontStructure._toUnicode._forEach((charCode: any, unicodeCharCode: any) => {
                if (!this._fontStructure._composite) {
                    const glyphName: any = this._fontStructure._differences[charCode] || this._fontStructure._defaultEncoding[charCode];
                    const unicode: any = _getUnicodeForGlyph(glyphName, glyphsUnicodeMap);
                    if (unicode !== -1) {
                        unicodeCharCode = unicode;
                    }
                }
                map[+charCode] = unicodeCharCode;
            });
            if (this._fontStructure._composite && this._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap) {
                if (/Tahoma|Verdana/i.test(name)) {
                    this._applyStandardFontGlyphMap(map, _getGlyphMapForStandardFonts());
                }
            }
            this._fontStructure._toFontChar = map;
        }
        this._amendFallBackToUnicodeMap(properties);
    }
    /* eslint-enable */
    /**
     * Compute a reasonable width to use for the space character when the
     * actual space glyph is missing.
     *
     * @private
     * @returns {number} Width in font units for the space glyph.
     */
    get _spaceWidth(): number{
        const possibleSpaceReplacements: string[] = ['space', 'minus', 'one', 'i', 'I'];
        let width: number;
        for (let i: number = 0; i < possibleSpaceReplacements.length ; i++) {
            const glyphName: any = possibleSpaceReplacements[i]; //eslint-disable-line
            if (glyphName in this._fontStructure._widths) {
                width = this._fontStructure._widths[glyphName]; //eslint-disable-line
                break;
            }
            const glyphsUnicodeMap: any = _getGlyphsUnicode(); //eslint-disable-line
            const glyphUnicode = glyphsUnicodeMap[glyphName]; //eslint-disable-line  
            let charcode: number = 0;
            if (this._fontStructure._composite && this._fontStructure._characterMap._contains(glyphUnicode)) {
                charcode = this._fontStructure._characterMap._lookup(glyphUnicode);
                if (typeof charcode === 'string') {
                    charcode = this._convertCidString(glyphUnicode, charcode);
                }
            }
            if (!charcode && this._fontStructure._toUnicode) {
                charcode = this._fontStructure._toUnicode._charCodeOf(glyphUnicode);
            }
            if (charcode <= 0) {
                charcode = glyphUnicode;
            }
            width = this._fontStructure._widths[charcode]; //eslint-disable-line
            if (width) {
                break;
            }
        }
        return width;
    }
    /**
     * Convert a single character code into a `_Glyph` object.
     *
     * @private
     * @param  {any} charCode - Character or CID code to convert.
     * @param {boolean} isSpace - True when the character should be treated as whitespace.
     * @returns {_Glyph} A `_Glyph` instance representing the input code.
     */
    _charToGlyph(charCode: any, isSpace: boolean = false): _Glyph { //eslint-disable-line
        let vmetrics: any; //eslint-disable-line
        let glyph; //eslint-disable-line
        if (this._fontStructure._glyphCache) {
            glyph = this._fontStructure._glyphCache[Number.parseInt(charCode.toString(), 10)
            ];
        }
        if (typeof(glyph) !== 'undefined' && glyph !== null && glyph.isSpace === isSpace) {
            return glyph;
        }
        let fontCharCode: any; //eslint-disable-line
        let width: number;
        let widthCode: any = charCode; //eslint-disable-line
        const cMap: any = this._fontStructure._characterMap; //eslint-disable-line
        if (cMap && cMap._contains(charCode)) {
            widthCode = this._fontStructure._characterMap._lookup(charCode);
            if (typeof widthCode === 'string') {
                widthCode = this._convertCidString(charCode, widthCode);
            }
        }
        width = this._fontStructure._widths[Number.parseInt(widthCode.toString(), 10)];
        if (typeof width !== 'number') {
            width = this._fontStructure._defaultWidth;
        }
        let vmetric: any; //eslint-disable-line
        if (vmetrics) {
            vmetric = vmetrics[Number.parseInt(widthCode.toString(), 10)];
        }
        let unicode: any = this._fontStructure._toUnicode._get(charCode) || charCode; //eslint-disable-line
        if (typeof unicode === 'number') {
            unicode = String.fromCharCode(unicode);
        }
        let isInFont: boolean = false;
        if (this._fontStructure._missingFile) {
            const glyphName: any = this._fontStructure._differences[Number.parseInt(charCode.toString(), 10)] || this._fontStructure._defaultEncoding[Number.parseInt(charCode.toString(), 10)]; //eslint-disable-line
            if ((glyphName === '.notdef' || glyphName === '') && this._fontStructure._type === 'Type1') {
                fontCharCode = 0x20;
                if (glyphName === '') {
                    if (!width) {
                        width = this._spaceWidth;
                    }
                    unicode = String.fromCharCode(fontCharCode);
                }
            }
        }
        let accent: any; //eslint-disable-line
        if (this._standardCharacter && this._standardCharacter[Number.parseInt(charCode.toString(), 10)]) {
            isInFont = true;
            const accentedCharcter: any = this._standardCharacter[Number.parseInt(charCode.toString(), 10)]; //eslint-disable-line
            accent = {fontChar: String.fromCodePoint(accentedCharcter.accentFontCharCode), offset: accentedCharcter.accentOffset};
        }
        glyph = new _Glyph(unicode, accent, width, vmetric, isSpace, isInFont);
        return (this._fontStructure._glyphCache[Number.parseInt(charCode.toString(), 10)] = glyph);
    }
    /**
     * Convert a character identifier string (CID) into a numeric code.
     *
     * @private
     * @param {any} characterCode - Original character code.
     * @param {any} characterIdentifier - CID string to convert.
     * @param {boolean} shouldThrow - When true throw on unsupported formats.
     * @returns {any} Numeric code or the original identifier on unsupported lengths.
     */
    _convertCidString(characterCode: any, characterIdentifier: any, shouldThrow: boolean = false): any { //eslint-disable-line
        switch (characterIdentifier.length) {
        case 1:
            return characterIdentifier.charCodeAt(0);
        case 2:
            return (characterIdentifier.charCodeAt(0) << 8) | characterIdentifier.charCodeAt(1);
        }
        const msg: string = `Unsupported CID string (charCode ${characterCode}): '${characterIdentifier}'.`;
        if (shouldThrow) {
            throw new FormatError(msg);
        }
        return characterIdentifier;
    }
    /**
     * Check whether the file is a TrueType Collection (ttcf).
     *
     * @private
     * @param {any} file - File-like object with `peekBytes`.
     * @returns {any} True when tag equals 'ttcf'.
     */
    _isTrueTypeCollectionFile(file: any) { //eslint-disable-line
        const header: any = file.peekBytes(4); //eslint-disable-line
        return _bytesToString(header) === 'ttcf';
    }
    /**
     * Read the header of a TrueType Collection.
     *
     * @private
     * @param {any} data - File-like data object positioned at the TTC header.
     * @returns {any} Parsed TTC header object.
     */
    _readTrueTypeCollectionHeader(data: any) { //eslint-disable-line
        const ttcTag: any = data.getString(4); //eslint-disable-line
        const majorVersion: number = data.getUnsignedInteger16();
        const minorVersion: number = data.getUnsignedInteger16();
        const numFonts: number = data.getInt32() >>> 0;
        const offsetTable: any = []; //eslint-disable-line
        for (let i: number = 0; i < numFonts; i++) {
            offsetTable.push(data.getInt32() >>> 0);
        }
        const header: any = {ttcTag, majorVersion, minorVersion, numFonts, offsetTable}; //eslint-disable-line
        switch (majorVersion) {
        case 1:
            return header;
        case 2:
            // header.dsigTag = ttc.getInt32() >>> 0;
            // header.dsigLength = ttc.getInt32() >>> 0;
            // header.dsigOffset = ttc.getInt32() >>> 0;
            return header;
        }
        throw new FormatError(`Invalid TrueType Collection majorVersion: ${majorVersion}.`);
    }
    /**
     * Read a string of given length from a file-like object.
     *
     * @private
     * @param {number} length - Number of bytes to read.
     * @param {any} file - File-like object with `getBytes`.
     * @returns {any} The decoded string.
     */
    _getString(length: number, file: any) { //eslint-disable-line
        return _bytesToString(file.getBytes(length));
    }
    /**
     * Read an OpenType/TrueType header from a font file.
     *
     * @private
     * @param {any} ttf - File-like object positioned at the header.
     * @returns {any} Header fields including `version` and `numTables`.
     */
    _readOpenTypeHeader(ttf: any) { //eslint-disable-line
        return {version: this._getString(4, ttf), numTables: ttf.getUnsignedInteger16(), searchRange: ttf.getUnsignedInteger16(),
            entrySelector: ttf.getUnsignedInteger16(), rangeShift: ttf.getUnsignedInteger16()};
    }
    /**
     * Read font table directory entries and collect supported tables.
     *
     * @private
     * @param {any} file - File-like object to read from.
     * @param {any} numberOfTables - Number of table entries in the header.
     * @returns {any} Object with discovered table entries.
     */
    _readTables(file: any, numberOfTables: any) { //eslint-disable-line
        const tables: any = Object.create(null); //eslint-disable-line
        tables['OS/2'] = null;
        tables.cmap = null;
        tables.head = null;
        tables.hhea = null;
        tables.hmtx = null;
        tables.maxp = null;
        tables.name = null;
        tables.post = null;
        for (let i: number = 0; i < numberOfTables; i++) {
            const table: any = this._readTableEntry(file); //eslint-disable-line
            if (!this._validTables.includes(table.tag)) {
                continue;
            }
            if (table.length === 0) {
                continue;
            }
            tables[table.tag] = table;
        }
        return tables;
    }
    /**
     * Read a single font table entry and extract its data bytes.
     *
     * @private
     * @param {any} file - File-like object positioned at the table entry.
     * @returns {any} Object describing the table (tag, checksum, offset, length, data).
     */
    _readTableEntry(file: any) { //eslint-disable-line
        const tag: string = this._getString(4, file);
        const checksum: number = file.getInt32() >>> 0;
        const offset: number = file.getInt32() >>> 0;
        const length: number = file.getInt32() >>> 0;
        const previousPosition: number = file.position;
        file.pos = file.start || 0;
        file.position = file.pos;
        file.skip(offset);
        const data: any = file.getBytes(length); //eslint-disable-line
        file.pos = previousPosition;
        file.position = file.pos;
        if (tag === 'head') {
            data[8] = data[9] = data[10] = data[11] = 0;
            data[17] |= 0x20;
        }
        return {tag, checksum, length, offset, data};
    }
    /**
     * Determine whether a name table record represents a Mac name record.
     *
     * @private
     * @param {any} r - Name table record.
     * @returns {boolean} True when the record is a Mac name record.
     */
    _isMacNameRecord(r: any) { //eslint-disable-line
        return r.platform === 1 && r.encoding === 0 && r.language === 0;
    }
    /**
     * Determine whether a name table record represents a Windows name record.
     *
     * @private
     * @param {any} r - Name table record.
     * @returns {any} returns whether record represents window name record.
     */
    _isWinNameRecord(r: any) { //eslint-disable-line
        return r.platform === 3 && r.encoding === 1 && r.language === 0x409;
    }
    /**
     * Read the 'name' table and extract localized name strings.
     *
     * @private
     * @param {any} nameTable - Table descriptor for the name table.
     * @param {any} font - File-like font object.
     * @returns {any} returns the name string.
     */
    _readNameTable(nameTable: any, font: any) { //eslint-disable-line
        const start: number = (font.start || 0) + nameTable.offset;
        font.pos = start;
        const names: any = [[], []], records: any = []; //eslint-disable-line
        const length: number = nameTable.length;
        const end: number = start + length;
        const format: number = font.getUnsignedInteger16();
        const FORMAT_0_HEADER_LENGTH: number = 6;
        if (format !== 0 || length < FORMAT_0_HEADER_LENGTH) {
            return [names, records];
        }
        const numRecords: number = font.getUnsignedInteger16();
        const stringsStart: number = font.getUnsignedInteger16();
        const NAME_RECORD_LENGTH: number = 12;
        let i: number;
        let ii: number;
        for (i = 0; i < numRecords && font.pos + NAME_RECORD_LENGTH <= end; i++) {
            const r: any = {platform: font.getUnsignedInteger16(), encoding : font.getUnsignedInteger16(), language: font.getUnsignedInteger16(), name: font.getUnsignedInteger16(), //eslint-disable-line
                length: font.getUnsignedInteger16(), offset: font.getUnsignedInteger16()};
            if (this._isMacNameRecord(r) || this._isWinNameRecord(r)) {
                records.push(r);
            }
        }
        for (i = 0, ii = records.length; i < ii; i++) {
            const record: any = records[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            if (record.length <= 0) {
                continue;
            }
            const pos: number = start + stringsStart + record.offset;
            if (pos + record.length > end) {
                continue;
            }
            font.pos = pos;
            const nameIndex: any = record.name; //eslint-disable-line
            if (record.encoding) {
                let str: string = '';
                for (let j: number = 0, jj: number = record.length; j < jj; j += 2) {
                    str += String.fromCharCode(font.getUnsignedInteger16());
                }
                names[1][Number.parseInt(nameIndex.toString(), 10)] = str;
            } else {
                names[0][Number.parseInt(nameIndex.toString(), 10)] = font.getString(record.length);
            }
        }
        return [names, records];
    }
    /**
     * Read and locate font data inside a TrueType Collection for the requested
     * font name.
     *
     * @private
     * @param {any} data - TTC data object.
     * @param {any} fontName - Font name to locate.
     * @param {any} font - File-like object representing the TTC.
     * @returns {void} nothing.
     */
    _readTrueTypeCollectionData(data: any, fontName: any, font: any) { //eslint-disable-line
        const { numFonts, offsetTable }: any = this._readTrueTypeCollectionHeader(data); //eslint-disable-line
        const fontNameParts: any = fontName.split('+'); //eslint-disable-line
        let fallbackData: any; //eslint-disable-line
        for (let i: number = 0; i < numFonts; i++) {
            data.pos = (data.start || 0) + offsetTable[Number.parseInt(i.toString(), 10)];
            const potentialHeader: any = this._readOpenTypeHeader(data); //eslint-disable-line
            const potentialTables: any = this._readTables(data, potentialHeader.numTables); //eslint-disable-line   
            if (!potentialTables.name) {
                throw new FormatError('TrueType Collection font must contain a name table.');
            }
            const [nameTable] = this._readNameTable(potentialTables.name, font);
            for (let j: number = 0, jj: number = nameTable.length; j < jj; j++) {
                for (let k: number = 0, kk: number = nameTable[Number.parseInt(j.toString(), 10)].length; k < kk; k++) {
                    const nameEntry: any = nameTable[Number.parseInt(j.toString(), 10)][Number.parseInt(k.toString(), 10)] && nameTable[Number.parseInt(j.toString(), 10)][Number.parseInt(k.toString(), 10)].replaceAll(/\s/g, ''); //eslint-disable-line  
                    if (!nameEntry) {
                        continue;
                    }
                    if (nameEntry === fontName) {
                        return {header: potentialHeader, tables: potentialTables};
                    }
                    if (fontNameParts.length < 2) {
                        continue;
                    }
                    for (const part of fontNameParts) {
                        if (nameEntry === part) {
                            fallbackData = {name: part, header: potentialHeader, tables: potentialTables};
                        }
                    }
                }
            }
        }
        if (fallbackData) {
            return {header: fallbackData.header, tables: fallbackData.tables};
        }
        throw new FormatError(`TrueType Collection does not contain '${fontName}' font.`);
    }
    /**
     * Combine two bytes into a 16-bit integer.
     *
     * @private
     * @param {any} b0 - High byte.
     * @param {any} b1 - Low byte.
     * @returns {any} 16-bit integer value.
     */
    _int16(b0: any, b1: any) { //eslint-disable-line
        return (b0 << 8) + b1;
    }
    /**
     * Check font tables and attempt repair/normalization for known issues.
     *
     * @private
     * @param {any} font - File-like font object to inspect and possibly repair.
     * @returns {void} nothing.
     */
    _checkAndRepair(font: any) : void { //eslint-disable-line
        font = new _PdfStream(new Uint8Array(font.getBytes()));
        let header: any; //eslint-disable-line
        let tables: any; //eslint-disable-line
        if (this._isTrueTypeCollectionFile(font)) {
            const ttcData: any = this._readTrueTypeCollectionData(font, this._fontStructure._name, font); //eslint-disable-line
            header = ttcData.header;
            tables = ttcData.tables;
        } else {
            header = this._readOpenTypeHeader(font);
            tables = this._readTables(font, header.numTables);
        }
        const isTrueType: boolean = !tables['compactFont '];
        if (!isTrueType) {
            const isComposite: boolean = this._fontStructure._composite && (this._characterIdToGlyphMap &&
                                                                          this._characterIdToGlyphMap.length > 0 || !(
                this._fontStructure._characterMap instanceof _PdfIdentityCharacterMap));
            if ((header.version === 'OTTO' && !isComposite) || !tables.head || !tables.hhea || !tables.maxp || !tables.post) {
                this._adjustWidths();
            }
            delete tables.glyf;
            delete tables.loca;
            delete tables.fpgm;
            delete tables.prep;
            delete tables['cvt '];
            this._isOpenType = true;
        } else {
            if (!tables.loca) {
                throw new FormatError('Required loca table is not found');
            }
            if (!tables.glyf) {
                tables.glyf = {tag: 'glyf', data: new Uint8Array(0)};
            }
            this._isOpenType = false;
        }
        if (!tables.maxp) {
            throw new FormatError('Required maxp table is not found');
        }
        font.pos = (font.start || 0) + tables.maxp.offset;
        font.position = font.pos;
        let version: number = font.getInt32();
        font.pos = font.position;
        const numGlyphs: number = font.getUnsignedInteger16();
        font.pos = font.position;
        if (version !== 0x00010000 && version !== 0x00005000) {
            if (tables.maxp.length === 6) {
                version = 0x0005000;
            } else if (tables.maxp.length >= 32) {
                version = 0x00010000;
            } else {
                throw new FormatError('maxp table has a wrong version number');
            }
            this._writeUnSignedInt32(tables.maxp.data, 0, version);
        }
        if (this._scaleFactors && this._scaleFactors.length === numGlyphs && isTrueType) {
            const { _scaleFactors } = this;
            const isGlyphLocationsLong: boolean  = this._int16(tables.head.data[50], tables.head.data[51]);
            const glyphs: _PdfGlyphTable = new _PdfGlyphTable({glyfTable: tables.glyf.data, isGlyphLocationsLong, locaTable:
                                                            tables.loca.data, numGlyphs});
            glyphs.scale(_scaleFactors);
            const { data, loca, isLocationLong } = glyphs._write();
            tables.glyf.data = data;
            tables.loca.data = loca;
            if (isLocationLong !== !!isGlyphLocationsLong) {
                tables.head.data[50] = 0;
                tables.head.data[51] = isLocationLong ? 1 : 0;
            }
        }
        if (!tables.hhea) {
            throw new FormatError('Required hhea table is not found');
        }
        if (tables.hhea.data[10] === 0 && tables.hhea.data[11] === 0) {
            tables.hhea.data[10] = 0xff;
            tables.hhea.data[11] = 0xff;
        }
        const metricsOverride: any = {unitsPerEm: this._int16(tables.head.data[18], tables.head.data[19]), //eslint-disable-line
            yMax: this._signedInt16(tables.head.data[42], tables.head.data[43]),
            yMin: this._signedInt16(tables.head.data[38], tables.head.data[39]),
            ascent: this._signedInt16(tables.hhea.data[4], tables.hhea.data[5]),
            descent: this._signedInt16(tables.hhea.data[6], tables.hhea.data[7]),
            lineGap: this._signedInt16(tables.hhea.data[8], tables.hhea.data[9])
        };
        this._fontStructure._ascent = metricsOverride.ascent / metricsOverride.unitsPerEm;
        this._fontStructure._descent = metricsOverride.descent / metricsOverride.unitsPerEm;
        this._fontStructure._lineGap = metricsOverride.lineGap / metricsOverride.unitsPerEm;
        if (this._fontStructure._cssFontInfo && this._fontStructure._cssFontInfo.lineHeight) {
            this._fontStructure._lineHeight = this._fontStructure._cssFontInfo.metrics.lineHeight;
            this._fontStructure._lineGap = this._fontStructure._cssFontInfo.metrics.lineGap;
        } else {
            this._fontStructure._lineHeight = this._fontStructure._ascent - this._fontStructure._descent + this._fontStructure._lineGap;
        }
        if (tables.name) {
            const [namePrototype, nameRecords] = this._readNameTable(tables.name, font);
            this._fontStructure._psName = namePrototype[0][6] || null;
            if (!this._fontStructure._composite) {
                this._adjustTrueTypeToUnicode(this._fontStructure, this._fontStructure._isSymbolicFont, nameRecords);
            }
        }
    }
    /**
     * Adjust the ToUnicode map for Type1 fonts using built-in encodings.
     *
     * @private
     * @returns {void} nothing.
     */
    _adjustType1ToUnicode() { //eslint-disable-line
        if (this._fontStructure._isInternalFont) {
            return;
        }
        if (this._hasIncludedToUnicodeMap) {
            return;
        }
        if (this._fontStructure._builtInEncoding === this._fontStructure._defaultEncoding) {
            return;
        }
        if (this._fontStructure._toUnicode instanceof _PdfIdentityToUnicodeMap) {
            return;
        }
        const toUnicode: any = []; //eslint-disable-line
        const glyphsUnicodeMap: any = _getGlyphsUnicode(); //eslint-disable-line
        const keys: any = Object.keys(this._fontStructure._builtInEncoding); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            if (this._hasEncoding) {
                if (this._baseEncodingName || this._fontStructure._differences[Number.parseInt(charCode.toString(), 10)] !== undefined) {
                    continue;
                }
            }
            const glyphName: any = this._fontStructure._builtInEncoding[Number.parseInt(charCode.toString(), 10)]; //eslint-disable-line
            const unicode: any = _getUnicodeForGlyph(glyphName, glyphsUnicodeMap); //eslint-disable-line
            if (unicode !== -1) {
                toUnicode[Number.parseInt(charCode.toString(), 10)] = String.fromCharCode(unicode);
            }
        }
        if (toUnicode.length > 0) {
            this._fontStructure._toUnicode._amend(toUnicode);
        }
    }
    /* eslint-disable */
    /**
     * Attempt to build a ToUnicode map for TrueType symbolic fonts using name
     * table heuristics.
     *
     * @private
     * @param {any} properties - Font properties used to build the map.
     * @param {any} isSymbolicFont - True when font is symbolic.
     * @param {any} nameRecords - Parsed name table records.
     * @returns {any} nothing .
     */
    _adjustTrueTypeToUnicode(properties: any, isSymbolicFont: any, nameRecords: any) {
        if (properties._isInternalFont) {
            return;
        }
        if (this._hasIncludedToUnicodeMap) {
            return;
        }
        if (this._hasEncoding) {
            return;
        }
        if (properties._toUnicode instanceof _PdfIdentityToUnicodeMap) {
            return;
        }
        if (!isSymbolicFont) {
            return;
        }
        if (nameRecords.length === 0) {
            return;
        }
        if (properties._defaultEncoding === _winAnsiEncoding) {
            return;
        }
        for (const r of nameRecords) {
            if (!this._isWinNameRecord(r)) {
                return;
            }
        }
        const encoding: string[] = _winAnsiEncoding;
        const toUnicode: any= [];
        const glyphsUnicodeMap: any = _getGlyphsUnicode();
        const keys: any = Object.keys(encoding);
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)];
            const glyphName: any = encoding[Number.parseInt(charCode.toString(), 10)];
            if (glyphName === '') {
                continue;
            }
            const unicode: any = glyphsUnicodeMap[Number.parseInt(glyphName.toString(), 10)];
            if (unicode === undefined) {
                continue;
            }
            toUnicode[Number.parseInt(charCode.toString(), 10)] = String.fromCharCode(unicode);
        }
        if (toUnicode.length > 0) {
            properties._toUnicode._amend(toUnicode);
        }
    }
    /* eslint-enable */
}
export class _Glyph {
    /** Unicode character (string) represented by this glyph.
     *
     * @private
     */
    _unicode: string;
    /** Accent information used for composed characters (if any).
     *
     * @private
     */
    _accent: number;
    /** Advance width of the glyph in font units.
     *
     * @private
     */
    _width: number;
    /** Original font character (single character string) when available.
     *
     * @private
     */
    _fontCharacter: string;
    /** Vertical metrics (vmtx) for the glyph when available.
     *
     * @private
     */
    _verticalMetrics: any; //eslint-disable-line
    /** True when this glyph should be treated as whitespace.
     *
     * @private
     */
    _isSpace: boolean;
    /** True when the glyph is known to be present in the font file.
     *
     * @private
     */
    _isInFont: boolean;
    constructor(unicode: string, accent: any, width: number, _verticalMetrics: any, //eslint-disable-line
                isSpace: boolean, isInFont: boolean) {
        this._unicode = unicode;
        this._accent = accent;
        this._width = width;
        this._verticalMetrics = _verticalMetrics;
        this._isSpace = isSpace;
        this._isInFont = isInFont;
    }
}
class _UnicodeMap {
    /** Internal array mapping character codes to Unicode strings or code points.
     *
     * @private
     */
    _map: (number | string)[];
    constructor(cmap: any) { //eslint-disable-line
        this._map = cmap;
    }
    get _length(): number {
        return this._map.length;
    }
    _forEach(): { characterCode: number; unicode: number }[] {
        const results: { characterCode: number; unicode: number }[] = [];
        const keys: any = Object.keys(this._map); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            const unicodeValue: any = this._map[Number.parseInt(charCode, 10)]; //eslint-disable-line
            if (unicodeValue) {
                results.push({
                    characterCode: Number.parseInt(charCode, 10),
                    unicode: (unicodeValue as string).charCodeAt(0)
                });
            }
        }
        return results;
    }
    _has(i: number): boolean {
        return typeof(this._map[Number.parseInt(i.toString(), 10)]) !== 'undefined';
    }
    _get(i: number): any { //eslint-disable-line
        return this._map[Number.parseInt(i.toString(), 10)];
    }
    _charCodeOf(value: string | number): number {
        const map: any = this._map; //eslint-disable-line
        if (map.length <= 0x10000) {
            return map.indexOf(value);
        }
        const keys: any = Object.keys(map); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            if (map[Number.parseInt(charCode.toString(), 10)] === value) {
                return Number.parseInt(charCode.toString(), 10);
            }
        }
        return -1;
    }
    _amend(map: { [key: number]: string | number }): void {
        const keys: any = Object.keys(map); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            this._map[Number.parseInt(charCode.toString(), 10)] = map[Number.parseInt(charCode.toString(), 10)];
        }
    }
}
class _PdfIdentityToUnicodeMap {
    /** First character code included in the identity mapping.
     *
     * @private
     */
    _firstChar: number;
    /** Last character code included in the identity mapping.
     *
     * @private
     */
    _lastChar: number;
    constructor(firstChar: number, lastChar: number) {
        this._firstChar = firstChar;
        this._lastChar = lastChar;
    }
    get _length(): number {
        return this._lastChar + 1 - this._firstChar;
    }
    _forEach(callback: (charCode: number, unicode: number) => void): void {
        for (let i: number = this._firstChar, ii: number = this._lastChar; i <= ii; i++) {
            callback(i, i);
        }
    }
    _has(index: number): boolean {
        return this._firstChar <= index && index <= this._lastChar;
    }
    _get(index: number): string | undefined {
        if (this._firstChar <= index && index <= this._lastChar) {
            return String.fromCharCode(index);
        }
        return undefined;
    }
    _charCodeOf(v: number): number {
        return Number.isInteger(v) && v >= this._firstChar && v <= this._lastChar ? v : -1;
    }
    _amend(): void {
        throw new Error('Should not call amend()');
    }
}
