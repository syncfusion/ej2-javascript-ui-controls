import { _TrueTypeReader, _TrueTypeMetrics } from './ttf-reader';
import { _PdfDictionary, _PdfName, Dictionary } from './../pdf-primitives';
import { _PdfFontMetrics } from './pdf-font-metrics';
import { _StandardWidthTable } from './pdf-font-metrics';
import { _FontDescriptorFlag } from '../enumerator';
import { _decode } from '../utils';
import { _TrueTypeGlyph } from './../fonts/ttf-reader';
import { _PdfStream } from './../base-stream';
/**
 * Handles embedding and subsetting of unicode truetype fonts for PDF output.
 *
 * @private
 */
export class _UnicodeTrueTypeFont {
    /**
     * Stores the alphabet used to generate random subset font names.
     *
     * @private
     */
    readonly _nameString: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    /**
     * Random subset font name prefix.
     *
     * @private
     */
    _subsetName: string;
    /**
     * Current font size used for measurements.
     *
     * @private
     */
    _fontSize: number;
    /**
     * Raw TrueType font program bytes.
     *
     * @private
     */
    _fontData: Uint8Array;
    /**
     * Reader used to parse TrueType tables.
     *
     * @private
     */
    _ttfReader: _TrueTypeReader;
    /**
     * Parsed TrueType metrics used by the subsetter.
     *
     * @private
     */
    _ttfMetrics: _TrueTypeMetrics;
    /**
     * Indicates whether the font should be embedded.
     *
     * @private
     */
    _isEmbed: boolean;
    /**
     * Font dictionary object created in the PDF.
     *
     * @private
     */
    _fontDictionary: _PdfDictionary;
    /**
     * Descendant CID font dictionary.
     *
     * @private
     */
    _descendantFont: _PdfDictionary;
    /**
     * Font descriptor dictionary containing metrics and program references.
     *
     * @private
     */
    _fontDescriptor: _PdfDictionary;
    /**
     * Public font metrics exposed to consumers.
     *
     * @private
     */
    _metrics: _PdfFontMetrics;
    /**
     * Tracks used characters for building the subset cmap.
     *
     * @private
     */
    _usedChars: Dictionary<string, string>;
    /**
     * Indicates whether the embedded font program has been written.
     *
     * @private
     */
    _isEmbedFont: boolean = false;
    /**
     * Stream containing the generated CID-to-Unicode CMap.
     *
     * @private
     */
    _cmap: _PdfStream;
    /**
     * Stream containing the subset font program.
     *
     * @private
     */
    _fontProgram: _PdfStream;
    /**
     * Prefix content for the generated CMap stream.
     *
     * @private
     */
    _cmapPrefix: string = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap' + '\r\n' + '/CIDSystemInfo << /Registry (Adobe)/Ordering (UCS)/Supplement 0>> def\n/CMapName ' + '/Adobe-Identity-UCS def\n/CMapType 2 def\n1 beginCodeSpacerange' + '\r\n';
    /**
     * Terminator for the CMap code space range section.
     *
     * @private
     */
    _cmapEndCodeSpaceRange: string = 'endCodeSpacerange' + '\r\n';
    /**
     * Marker that begins a bf range block.
     *
     * @private
     */
    _cmapBeginRange: string = 'beginbfrange' + '\r\n';
    /**
     * Marker that ends a bf range block.
     *
     * @private
     */
    _cmapEndRange: string = 'endbfrange' + '\r\n';
    /**
     * Suffix content that finalizes the CMap stream.
     *
     * @private
     */
    _cmapSuffix: string = 'endbfrange\nendcmap\nCMapName currentdict ' + '/CMap defineresource pop\nend end' + '\r\n';
    constructor(data: string | Uint8Array, size?: number) {
        if (data === null || typeof data === 'undefined') {
            throw new Error('ArgumentNullException:base64String');
        }
        if (size !== null && typeof size !== 'undefined') {
            this._fontSize = size;
        }
        if (typeof data === 'string') {
            this._fontData = _decode(data) as Uint8Array;
        } else {
            this._fontData = data;
        }
        this._ttfReader = new _TrueTypeReader(this._fontData);
        this._ttfMetrics = this._ttfReader._metrics;
    }
    /**
     * Prepares internal dictionaries and streams before writing to the PDF.
     *
     * @private
     * @returns {void} nothing.
     */
    _beginSave(): void {
        this._descendantFontBeginSave();
        this._cmapBeginSave();
        this._fontDictionaryBeginSave();
        this._fontProgramBeginSave();
        if (this._fontDescriptor) {
            this._fontDescriptor.update(this._ttfMetrics._contains ? 'FontFile3' : 'FontFile2', this._fontProgram);
            this._fontDescriptor._updated = true;
            this._fontDescriptor._isFont = true;
        }
    }
    /**
     * Updates descendant font width information before saving.
     *
     * @private
     * @returns {void} nothing.
     */
    _descendantFontBeginSave(): void {
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            let width: Array<any> = this._getDescendantWidth(); // eslint-disable-line
            if (width !== null) {
                this._descendantFont.set('W', width);
            }
        }
    }
    /**
     * Adds the to unicode mapping stream to the font dictionary when required.
     *
     * @private
     * @returns {void} nothing.
     */
    _fontDictionaryBeginSave(): void {
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            if (this._fontDictionary && !this._fontDictionary.has('ToUnicode')) {
                this._fontDictionary.update('ToUnicode', this._cmap);
            }
        }
    }
    /**
     * Creates all internal dictionaries streams and metrics required for pdf embedding.
     *
     * @private
     * @returns {void} nothing.
     */
    _createInternals(): void {
        this._fontDictionary = new _PdfDictionary();
        this._descendantFont = new _PdfDictionary();
        this._metrics = new _PdfFontMetrics();
        this._ttfReader._createInternals();
        this._usedChars = null;
        const data: any = []; // eslint-disable-line
        this._fontProgram = new _PdfStream(data, new _PdfDictionary());
        this._cmap = new _PdfStream(data, new _PdfDictionary());
        this._ttfMetrics = this._ttfReader._metrics;
        this._initializeMetrics();
        this._subsetName = this._getFontName();
        this._createDescendantFont();
        this._createFontDictionary();
    }
    /**
     * Returns the root font dictionary used by the pdf writer.
     *
     * @private
     * @returns {_PdfDictionary} The generated font dictionary.
     */
    _getInternals(): _PdfDictionary {
        return this._fontDictionary;
    }
    /**
     * Maps truetype metrics into pdf font metric structures.
     *
     * @private
     * @returns {void} nothing.
     */
    _initializeMetrics(): void {
        const ttfMetrics: _TrueTypeMetrics = this._ttfReader._metrics;
        this._metrics._name = ttfMetrics._fontFamily;
        this._metrics._postScriptName = ttfMetrics._postScriptName;
        this._metrics._widthTable = new _StandardWidthTable(ttfMetrics._widthTable);
        this._metrics._subScriptSizeFactor = ttfMetrics._subScriptSizeFactor;
        this._metrics._superscriptSizeFactor = ttfMetrics._superscriptSizeFactor;
        this._metrics._isBold = ttfMetrics._isBold;
    }
    /**
     * Generates a random subset prefix combined with the postscript font name.
     *
     * @private
     * @returns {string} A random 6 character subset prefix.
     */
    _getFontName(): string {
        let builder: string = '';
        for (let i: number = 0; i < 6; i++) {
            const index: number = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
            builder += this._nameString[<number>index];
        }
        builder += '+';
        builder += this._ttfReader._metrics._postScriptName;
        return builder.toString();
    }
    /**
     * Creates the cid descendant font dictionary including system info and descriptor.
     *
     * @private
     * @returns {void} nothing.
     */
    _createDescendantFont(): void {
        this._descendantFont = new _PdfDictionary();
        this._descendantFont._updated = true;
        this._descendantFont.set('Type', new _PdfName('Font'));
        this._descendantFont.set('Subtype', new _PdfName('CIDFontType2'));
        this._descendantFont.set('BaseFont', new _PdfName(this._subsetName));
        this._descendantFont.set('CIDToGIDMap', new _PdfName('Identity'));
        this._descendantFont.set('DW', 1000);
        this._fontDescriptor = this._createFontDescriptor();
        this._descendantFont.set('FontDescriptor', this._fontDescriptor);
        const systemInfo: _PdfDictionary = this._createSystemInfo();
        this._descendantFont.set('CIDSystemInfo', systemInfo);
        this._descendantFont._isFont = true;
    }
    /**
     * Constructs the font descriptor containing bounding box style and metric fields.
     *
     * @private
     * @returns {_PdfDictionary} The font descriptor dictionary.
     */
    _createFontDescriptor(): _PdfDictionary {
        const descriptor: _PdfDictionary = new _PdfDictionary();
        const metrics: _TrueTypeMetrics = this._ttfReader._metrics;
        descriptor.set('Type', new _PdfName('FontDescriptor'));
        descriptor.set('FontName', new _PdfName(this._subsetName));
        descriptor.set('Flags', this._getDescriptorFlags());
        descriptor.set('FontBBox', this._getBoundBox());
        descriptor.set('MissingWidth', metrics._widthTable[32]);
        descriptor.set('StemV', metrics._stemV);
        descriptor.set('ItalicAngle', metrics._italicAngle);
        descriptor.set('CapHeight', metrics._capHeight);
        descriptor.set('Ascent', metrics._winAscent);
        descriptor.set('Descent', metrics._winDescent);
        descriptor.set('Leading', metrics._leading);
        descriptor.set('AvgWidth', metrics._widthTable[32]);
        descriptor.set('MaxWidth', metrics._widthTable[32]);
        descriptor.set('XHeight', 0);
        descriptor.set('StemH', 0);
        descriptor._updated = true;
        return descriptor;
    }
    /**
     * Builds the embedded or subsetted font program using truetype reader output.
     *
     * @private
     * @returns {void} nothing.
     */
    _generateFontProgram(): void {
        let fontProgram: number[] = [];
        this._usedChars = (this._usedChars === null || typeof this._usedChars === 'undefined') ? new Dictionary<string, string>()
            : this._usedChars;
        this._ttfReader._setOffset(0);
        if (this._ttfReader._isOpenType && this._ttfMetrics._contains) {
            fontProgram = this._ttfReader._readCompactFontFormatTable();
            this._fontProgram.dictionary.update('Subtype', _PdfName.get('CIDFontType0C'));
        } else {
            fontProgram = this._ttfReader._readFontProgram(this._usedChars);
        }
        this._fontProgram._clearStream();
        this._fontProgram._writeBytes(fontProgram);
    }
    /**
     * Returns the bounding box transformed into pdf descriptor format.
     *
     * @private
     * @returns {number[]} Bounding box array `[xMin, yMin, width, height]`.
     */
    _getBoundBox(): number[] {
        const rect: number[] = this._ttfReader._metrics._fontBox;
        const width: number = Math.abs(rect[2] - rect[0]);
        const height: number = Math.abs(rect[1] - rect[3]);
        const rectangle: number[] = [rect[0], rect[3], width, height];
        return rectangle;
    }
    /**
     * Triggers cmap generation prior to saving the font.
     *
     * @private
     * @returns {void} nothing.
     */
    _cmapBeginSave(): void {
        this._generateCmap();
    }
    /**
     * Prepares the font program stream at the start of the save process.
     *
     * @private
     * @returns {void} nothing.
     */
    _fontProgramBeginSave(): void {
        this._generateFontProgram();
    }
    /**
     * Converts a number into a hexadecimal string formatted for CMap entries.
     *
     * @private
     * @param {number} n - Number to convert.
     * @param {boolean} isCaseChange - Whether to uppercase the hex string.
     * @returns {string} Hexadecimal string wrapped in `<>`.
     */
    _toHexString(n: number, isCaseChange: boolean): string {
        let s: string = n.toString(16);
        if (isCaseChange) {
            s = s.toUpperCase();
        }
        return '<0000'.substring(0, 5 - s.length) + s + '>';
    }
    /**
     * Builds the to unicode cmap stream using subset glyph mappings.
     *
     * @private
     * @returns {void} nothing.
     */
    _generateCmap(): void {
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            const glyphChars: Dictionary<number, number> = this._ttfReader._getGlyphChars(this._usedChars);
            if (glyphChars._size() > 0) {
                const keys: number[] = glyphChars.keys().sort();
                const first: number = keys[0];
                const last: number = keys[keys.length - 1];
                const middlePart: string = this._toHexString(first, false) + this._toHexString(last, false) + '\r\n';
                let builder: string = '';
                builder += this._cmapPrefix;
                builder += middlePart;
                builder += this._cmapEndCodeSpaceRange;
                let nextRange: number = 0;
                keys.forEach((key: number, index: number) => {
                    if (nextRange === 0) {
                        if (index !== 0) {
                            builder += this._cmapEndRange;
                        }
                        nextRange = Math.min(100, keys.length - index);
                        builder += nextRange;
                        builder += ' ';
                        builder += this._cmapBeginRange;
                    }
                    nextRange -= 1;
                    builder += this._toHexString(key, true) + this._toHexString(key, true);
                    builder += this._toHexString(glyphChars.getValue(key), true) + '\n';
                });
                builder += this._cmapSuffix;
                this._cmap._clearStream();
                this._cmap._write(builder);
            }
        }
    }
    /**
     * Creates the top level type zero font dictionary used in the pdf.
     *
     * @private
     * @returns {void} nothing.
     */
    _createFontDictionary(): void {
        this._fontDictionary._updated = true;
        this._fontDictionary.set('Type', _PdfName.get('Font'));
        this._fontDictionary.set('Subtype', _PdfName.get('Type0'));
        this._fontDictionary.set('BaseFont', new _PdfName(this._subsetName));
        this._fontDictionary.set('Encoding', _PdfName.get('Identity-H'));
        this._fontDictionary.set('DescendantFonts', this._descendantFont);
        this._fontDictionary._isFont = true;
        this._fontDictionary._currentObj = this;
    }
    /**
     * Creates the cid system information dictionary for the descendant font.
     *
     * @private
     * @returns {void} nothing.
     */
    _createSystemInfo(): _PdfDictionary {
        const systemInfo: _PdfDictionary = new _PdfDictionary();
        systemInfo._updated = true;
        systemInfo.set('Registry', 'Adobe');
        systemInfo.set('Ordering', 'Identity');
        systemInfo.set('Supplement', 0);
        return systemInfo;
    }
    /**
     * Computes the font descriptor flags based on truetype style metrics.
     *
     * @private
     * @returns {number} The descriptor flag value.
     */
    _getDescriptorFlags(): number {
        let flags: number = 0;
        const metrics: _TrueTypeMetrics = this._ttfReader._metrics;
        if (metrics._isFixedPitch) {
            flags |= _FontDescriptorFlag.fixedPitch;
        }
        if (metrics._isSymbol) {
            flags |= _FontDescriptorFlag.symbolic;
        } else {
            flags |= _FontDescriptorFlag.nonSymbolic;
        }
        if (metrics._isItalic) {
            flags |= _FontDescriptorFlag.italic;
        }
        if (metrics._isBold) {
            flags |= _FontDescriptorFlag.forceBold;
        }
        return flags;
    }
    /**
     * Returns the width of a character based on truetype glyph metrics.
     *
     * @private
     * @param {string} charCode to get the width.
     * @returns {number} The character width.
     */
    _getCharacterWidth(charCode: string): number {
        const codeWidth: number = this._ttfReader._getCharacterWidth(charCode);
        return codeWidth;
    }
    /**
     * Registers characters for inclusion in the subsetted font program.
     *
     * @private
     * @param {string} text to set the symbols.
     * @returns {void} nothing.
     */
    _setSymbols(text: string): void {
        if (text !== null && typeof text !== 'undefined') {
            if (this._usedChars === null || typeof this._usedChars === 'undefined') {
                this._usedChars = new Dictionary<string, string>();
            }
            text.split('').forEach((ch: string) => {
                this._usedChars.setValue(ch, String.fromCharCode(0));
            });
        }
    }
    /**
     * Generates the cid width array for the descendant font using glyph metrics.
     *
     * @private
     * @returns {Array<any>} The width array structure.
     */
    _getDescendantWidth(): Array<any> { // eslint-disable-line
        let array: Array<any> = new Array<any>(); // eslint-disable-line
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            const glyphInfo: _TrueTypeGlyph[] = [];
            const keys: string[] = this._usedChars.keys();
            keys.forEach((chLen: string) => {
                const glyph: _TrueTypeGlyph = this._ttfReader._getGlyph(chLen);
                glyphInfo.push(glyph);
            });
            glyphInfo.sort((a: _TrueTypeGlyph, b: _TrueTypeGlyph) => a._index - b._index);
            let firstGlyphIndex: number = 0;
            let lastGlyphIndex: number = 0;
            let firstGlyphIndexWasSet: boolean = false;
            let widthDetails: Array<any> = new Array<any>(); // eslint-disable-line
            glyphInfo.forEach((glyph: _TrueTypeGlyph, index: number) => {
                if (!firstGlyphIndexWasSet) {
                    firstGlyphIndexWasSet = true;
                    firstGlyphIndex = glyph._index;
                    lastGlyphIndex = glyph._index - 1;
                }
                if ((lastGlyphIndex + 1 !== glyph._index || (index + 1 === glyphInfo.length)) && glyphInfo.length > 1) {
                    array.push(Number(firstGlyphIndex));
                    if (index !== 0) {
                        array.push(widthDetails);
                    }
                    firstGlyphIndex = glyph._index;
                    widthDetails = new Array<any>(); // eslint-disable-line
                }
                widthDetails.push(Number(glyph._width));
                if ((index + 1) === glyphInfo.length) {
                    array.push(Number(firstGlyphIndex));
                    array.push(widthDetails);
                }
                lastGlyphIndex = glyph._index;
            });
        }
        return array;
    }
}
