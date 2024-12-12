import { _TrueTypeReader, _TrueTypeMetrics } from './ttf-reader';
import { _PdfDictionary, _PdfName, Dictionary } from './../pdf-primitives';
import { _PdfFontMetrics } from './pdf-font-metrics';
import { _StandardWidthTable } from './pdf-font-metrics';
import { _FontDescriptorFlag } from '../enumerator';
import { _decode } from '../utils';
import { _TrueTypeGlyph } from './../fonts/ttf-reader';
import { _PdfStream } from './../base-stream';
export class _UnicodeTrueTypeFont {
    readonly _nameString: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    _subsetName: string;
    _fontSize: number;
    _fontString: string;
    _fontData: Uint8Array;
    _ttfReader: _TrueTypeReader;
    _ttfMetrics: _TrueTypeMetrics;
    _isEmbed: boolean;
    _fontDictionary: _PdfDictionary;
    _descendantFont: _PdfDictionary;
    _fontDescriptor: _PdfDictionary;
    _metrics: _PdfFontMetrics;
    _usedChars: Dictionary<string, string>;
    _isEmbedFont: boolean = false;
    _cmap: _PdfStream;
    _fontProgram: _PdfStream;
    _cmapPrefix: string = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap' + '\r\n' + '/CIDSystemInfo << /Registry (Adobe)/Ordering (UCS)/Supplement 0>> def\n/CMapName ' + '/Adobe-Identity-UCS def\n/CMapType 2 def\n1 beginCodeSpacerange' + '\r\n';
    _cmapEndCodeSpaceRange: string = 'endCodeSpacerange' + '\r\n';
    _cmapBeginRange: string = 'beginbfrange' + '\r\n';
    _cmapEndRange: string = 'endbfrange' + '\r\n';
    _cmapSuffix: string = 'endbfrange\nendcmap\nCMapName currentdict ' + '/CMap defineresource pop\nend end' + '\r\n';
    constructor(base64String: string, size: number) {
        if (base64String === null || typeof base64String === 'undefined') {
            throw new Error('ArgumentNullException:base64String');
        }
        this._fontSize = size;
        this._fontString = base64String;
        this._Initialize();
    }
    _beginSave(): void {
        this._descendantFontBeginSave();
        this._cmapBeginSave();
        this._fontDictionaryBeginSave();
        this._fontProgramBeginSave();
        if (this._fontDescriptor){
            this._fontDescriptor.update('FontFile2', this._fontProgram);
            this._fontDescriptor._updated = true;
            this._fontDescriptor._isFont = true;
        }
    }
    _descendantFontBeginSave(): void {
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            let width: Array<any> = this._getDescendantWidth(); // eslint-disable-line
            if (width !== null) {
                this._descendantFont.set('W', width);
            }
        }
    }
    _fontDictionaryBeginSave(): void {
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            this._fontDictionary.update('ToUnicode', this._cmap);
        }
    }
    _Initialize(): void {
        const byteArray: Uint8Array = _decode(this._fontString) as Uint8Array;
        this._fontData = byteArray;
        this._ttfReader = new _TrueTypeReader(this._fontData);
        this._ttfMetrics = this._ttfReader._metrics;
    }
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
    _getInternals(): _PdfDictionary {
        return this._fontDictionary;
    }
    _initializeMetrics(): void {
        const ttfMetrics: _TrueTypeMetrics = this._ttfReader._metrics;
        this._metrics._ascent = ttfMetrics._macAscent;
        this._metrics._descent = ttfMetrics._macDescent;
        this._metrics._height = ttfMetrics._macAscent - ttfMetrics._macDescent + ttfMetrics._lineGap;
        this._metrics._name = ttfMetrics._fontFamily;
        this._metrics._postScriptName = ttfMetrics._postScriptName;
        this._metrics._size = this._fontSize;
        this._metrics._widthTable = new _StandardWidthTable(ttfMetrics._widthTable);
        this._metrics._lineGap = ttfMetrics._lineGap;
        this._metrics._subScriptSizeFactor = ttfMetrics._subScriptSizeFactor;
        this._metrics._superscriptSizeFactor = ttfMetrics._superscriptSizeFactor;
        this._metrics._isBold = ttfMetrics._isBold;
    }
    _getFontName(): string {
        let builder: string = '';
        for (let i: number = 0; i < 6; i++) {
            const index: number = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
            builder += this._nameString[Number.parseInt(index.toString(), 10)];
        }
        builder += '+';
        builder += this._ttfReader._metrics._postScriptName;
        return builder.toString();
    }
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
    _generateFontProgram(): void {
        let fontProgram: number[] = [];
        this._usedChars = (this._usedChars === null || typeof this._usedChars === 'undefined') ? new Dictionary<string, string>()
            : this._usedChars;
        this._ttfReader._setOffset(0);
        fontProgram = this._ttfReader._readFontProgram(this._usedChars);
        this._fontProgram._clearStream();
        this._fontProgram._writeBytes(fontProgram);
    }
    _getBoundBox(): number[] {
        const rect: number[] = this._ttfReader._metrics._fontBox;
        const width: number = Math.abs(rect[2] - rect[0]);
        const height: number = Math.abs(rect[1] - rect[3]);
        const rectangle: number[] = [rect[0], rect[3], width, height];
        return rectangle;
    }
    _cmapBeginSave(): void {
        this._generateCmap();
    }
    _fontProgramBeginSave(): void {
        this._generateFontProgram();
    }
    _toHexString(n: number, isCaseChange: boolean): string {
        let s: string = n.toString(16);
        if (isCaseChange) {
            s = s.toUpperCase();
        }
        return '<0000'.substring(0, 5 - s.length) + s + '>';
    }
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
                for (let i: number = 0; i < keys.length; i++) {
                    if (nextRange === 0) {
                        if (i !== 0) {
                            builder += this._cmapEndRange;
                        }
                        nextRange = Math.min(100, keys.length - i);
                        builder += nextRange;
                        builder += ' ';
                        builder += this._cmapBeginRange;
                    }
                    nextRange -= 1;
                    const key: number = keys[Number.parseInt(i.toString(), 10)];
                    builder += this._toHexString(key, true) + this._toHexString(key, true);
                    builder += this._toHexString(glyphChars.getValue(key), true) + '\n';
                }
                builder += this._cmapSuffix;
                this._cmap._clearStream();
                this._cmap._write(builder);
            }
        }
    }
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
    _createSystemInfo(): _PdfDictionary {
        const systemInfo: _PdfDictionary = new _PdfDictionary();
        systemInfo._updated = true;
        systemInfo.set('Registry', 'Adobe');
        systemInfo.set('Ordering', 'Identity');
        systemInfo.set('Supplement', 0);
        return systemInfo;
    }
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
    _getCharacterWidth(charCode: string): number {
        const codeWidth: number = this._ttfReader._getCharacterWidth(charCode);
        return codeWidth;
    }
    _setSymbols(text: string): void {
        if (text !== null && typeof text !== 'undefined') {
            if (this._usedChars === null || typeof this._usedChars === 'undefined') {
                this._usedChars = new Dictionary<string, string>();
            }
            for (let i: number = 0; i < text.length; i++) {
                const ch: string = text[Number.parseInt(i.toString(), 10)];
                this._usedChars.setValue(ch, String.fromCharCode(0));
            }
        }
    }
    _getDescendantWidth(): Array<any> { // eslint-disable-line
        let array: Array<any> = new Array<any>(); // eslint-disable-line
        if (this._usedChars !== null && typeof this._usedChars !== 'undefined' && this._usedChars._size() > 0) {
            const glyphInfo: _TrueTypeGlyph[] = [];
            const keys: string[] = this._usedChars.keys();
            for (let i: number = 0; i < keys.length; i++) {
                const chLen: string = keys[Number.parseInt(i.toString(), 10)];
                const glyph: _TrueTypeGlyph = this._ttfReader._getGlyph(chLen);
                glyphInfo.push(glyph);
            }
            glyphInfo.sort((a: _TrueTypeGlyph, b: _TrueTypeGlyph) => a._index - b._index);
            let firstGlyphIndex: number = 0;
            let lastGlyphIndex: number = 0;
            let firstGlyphIndexWasSet: boolean = false;
            let widthDetails: Array<any> = new Array<any>(); // eslint-disable-line
            for (let i: number = 0; i < glyphInfo.length; i++) {
                const glyph: _TrueTypeGlyph = glyphInfo[Number.parseInt(i.toString(), 10)];
                if (!firstGlyphIndexWasSet) {
                    firstGlyphIndexWasSet = true;
                    firstGlyphIndex = glyph._index;
                    lastGlyphIndex = glyph._index - 1;
                }
                if ((lastGlyphIndex + 1 !== glyph._index || (i + 1 === glyphInfo.length)) && glyphInfo.length > 1) {
                    array.push(Number(firstGlyphIndex));
                    if (i !== 0) {
                        array.push(widthDetails);
                    }
                    firstGlyphIndex = glyph._index;
                    widthDetails = new Array<any>(); // eslint-disable-line
                }
                widthDetails.push(Number(glyph._width));
                if ((i + 1) === glyphInfo.length) {
                    array.push(Number(firstGlyphIndex));
                    array.push(widthDetails);
                }
                lastGlyphIndex = glyph._index;
            }
        }
        return array;
    }
}
