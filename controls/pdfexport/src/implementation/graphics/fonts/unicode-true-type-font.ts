/**
 * TrueTypeFont.ts class for EJ2-PDF
 */
import { ByteArray } from './../../graphics/images/index';
import { TtfReader } from './ttf-reader';
import { TtfMetrics } from './ttf-metrics';
import { PdfDictionary, SaveDescendantFontEventHandler, SaveFontDictionaryEventHandler } from './../../primitives/pdf-dictionary';
import { SaveFontProgramEventHandler, SaveCmapEventHandler } from './../../primitives/pdf-stream';
import { PdfStream } from './../../primitives/pdf-stream';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfName } from './../../primitives/pdf-name';
import { PdfNumber } from './../../primitives/pdf-number';
import { PdfString } from './../../primitives/pdf-string';
import { PdfReferenceHolder } from './../../primitives/pdf-reference';
import { PdfFontMetrics } from './pdf-font-metrics';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { StandardWidthTable } from './pdf-font-metrics';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { Dictionary } from './../../collections/dictionary';
import { FontDescriptorFlags } from './enum';
import { RectangleF, Rectangle } from './../../drawing/pdf-drawing';
import { TtfGlyphInfo } from './ttf-glyph-info';
import { Operators } from './../../input-output/pdf-operators';
export class UnicodeTrueTypeFont {
    // Fields
    private readonly nameString : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    /**
     * Name of the font subset.
     */
    private subsetName : string;
    /**
     * `Size` of the true type font.
     * @private
     */
    private fontSize : number;
    /**
     * `Base64 string` of the true type font.
     * @private
     */
    private fontString : string;
    /**
     * `font data` of the true type font.
     * @private
     */
    private fontData : Uint8Array;
    /**
     * `true type font` reader object.
     * @private
     */
    public ttfReader : TtfReader;
    /**
     * metrics of true type font.
     * @private
     */
    public ttfMetrics : TtfMetrics;
    /**
     * Indicates whether the font is embedded or not.
     * @private
     */
    public isEmbed : boolean;
    /**
     * Pdf primitive describing the font.
     */
    private fontDictionary : PdfDictionary;
    /**
     * Descendant font.
     */
    private descendantFont : PdfDictionary;
    /**
     * font descripter.
     */
    private fontDescriptor : PdfDictionary;
    /**
     * Font program.
     */
    private fontProgram : PdfStream;
    /**
     * Cmap stream.
     */
    private cmap : PdfStream;
    /**
     * C i d stream.
     */
    private cidStream : PdfStream;
    /**
     * Font metrics.
     */
    public metrics : PdfFontMetrics;
    /**
     * Specifies the Internal variable to store fields of `PdfDictionaryProperties`.
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Array of used chars.
     * @private
     */
    private usedChars : Dictionary<string, string>;
    /**
     * Indicates whether the font program is compressed or not.
     * @private
     */
    private isCompress : boolean = false;
    /**
     * Indicates whether the font is embedded or not.
     */
    private isEmbedFont : boolean = false;
    /**
     * Cmap table's start prefix.
     */
    /* tslint:disable */
    private readonly cmapPrefix : string = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap' + Operators.newLine + '/CIDSystemInfo << /Registry (Adobe)/Ordering (UCS)/Supplement 0>> def\n/CMapName ' + '/Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange' + Operators.newLine;
    /* tslint:enable */
    /**
     * Cmap table's start suffix.
     */
    private readonly cmapEndCodespaceRange : string = 'endcodespacerange' + Operators.newLine;
    /**
     * Cmap's begin range marker.
     */
    private readonly cmapBeginRange : string = 'beginbfrange' + Operators.newLine;
    /**
     * Cmap's end range marker.
     */
    private readonly cmapEndRange : string = 'endbfrange' + Operators.newLine;
    /**
     * Cmap table's end
     */
    /* tslint:disable */
    private readonly cmapSuffix : string = 'endbfrange\nendcmap\nCMapName currentdict ' + '/CMap defineresource pop\nend end' + Operators.newLine;
    /* tslint:enable */
    //Constructors
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     * @private
     */
    public constructor(base64String : string, size : number) {
        if (base64String === null || base64String === undefined) {
            throw new Error('ArgumentNullException:base64String');
        }
        this.fontSize = size;
        this.fontString = base64String;
        this.Initialize();
    }
    //Implementation
    /**
     * Returns width of the char symbol.
     */
    public getCharWidth(charCode : string) : number {
        let codeWidth : number = this.ttfReader.getCharWidth(charCode);
        return codeWidth;
    }
    /**
     * Returns width of the text line.
     */
    public getLineWidth( line : string) : number {
        // if (line == null) {
        //     throw new Error('ArgumentNullException : line');
        // }
        let width : number = 0;
        for (let i : number = 0, len : number = line.length; i < len; i++) {
            let ch : string = line[i];
            let charWidth : number = this.getCharWidth(ch);
            width += charWidth;
        }
        return width;
    }
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     * @private
     */
    private Initialize() : void {
        let byteArray : ByteArray = new ByteArray(this.fontString.length);
        byteArray.writeFromBase64String(this.fontString);
        this.fontData = byteArray.internalBuffer;
        this.ttfReader = new TtfReader(this.fontData);
        this.ttfMetrics = this.ttfReader.metrics;
    }
    public createInternals() : void {
        this.fontDictionary = new PdfDictionary();
        this.fontProgram = new PdfStream();
        this.cmap = new PdfStream();
        this.descendantFont = new PdfDictionary();
        this.metrics = new PdfFontMetrics();
        this.ttfReader.createInternals();
        this.ttfMetrics = this.ttfReader.metrics;
        this.initializeMetrics();
        // Create all the dictionaries of the font.
        this.subsetName = this.getFontName();
        this.createDescendantFont();
        this.createCmap();
        this.createFontDictionary();
        this.createFontProgram();
    }
    public getInternals() : IPdfPrimitive {
        return this.fontDictionary;
    }
    /**
     * Initializes metrics.
     */
    private initializeMetrics() : void {
        let ttfMetrics : TtfMetrics = this.ttfReader.metrics;
        this.metrics.ascent = ttfMetrics.macAscent;
        this.metrics.descent = ttfMetrics.macDescent;
        this.metrics.height = ttfMetrics.macAscent - ttfMetrics.macDescent + ttfMetrics.lineGap;
        this.metrics.name = ttfMetrics.fontFamily;
        this.metrics.postScriptName = ttfMetrics.postScriptName;
        this.metrics.size = this.fontSize;
        this.metrics.widthTable = new StandardWidthTable(ttfMetrics.widthTable);
        this.metrics.lineGap = ttfMetrics.lineGap;
        this.metrics.subScriptSizeFactor = ttfMetrics.subScriptSizeFactor;
        this.metrics.superscriptSizeFactor = ttfMetrics.superscriptSizeFactor;
        this.metrics.isBold = ttfMetrics.isBold;
    }
    /**
     * Gets random string.
     */
    private getFontName() : string {
        let builder : string = '';
        let name : string;
        // if (this.isEmbed === false) {
        for (let i : number = 0; i < 6; i++) {
            let index : number = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
            builder += this.nameString[index];
        }
        builder += '+';
        // }
        builder += this.ttfReader.metrics.postScriptName;
        name = builder.toString();
        // if (name === '') {
        //     name = this.ttfReader.metrics.fontFamily;
        // }
        name = this.formatName(name);
        return name;
    }
    /**
     * Generates name of the font.
     */
    private formatName(fontName : string) : string {
        // if (fontName === null) {
        //     throw new Error('ArgumentNullException : fontName');
        // }
        // if (fontName === '') {
        //     throw new Error('ArgumentOutOfRangeException : fontName, Parameter can not be empty');
        // }
        let ret : string = fontName.replace('(', '#28');
        ret = ret.replace(')', '#29');
        ret = ret.replace('[', '#5B');
        ret = ret.replace(']', '#5D');
        ret = ret.replace('<', '#3C');
        ret = ret.replace('>', '#3E');
        ret = ret.replace('{', '#7B');
        ret = ret.replace('}', '#7D');
        ret = ret.replace('/', '#2F');
        ret = ret.replace('%', '#25');
        return ret.replace(' ', '#20');
    }
    /**
     * Creates descendant font.
     */
    private createDescendantFont() : void {
        // Set property used to clone Font every time
        this.descendantFont.isFont = true;
        this.descendantFont.descendantFontBeginSave = new SaveDescendantFontEventHandler(this);
        this.descendantFont.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.font));
        this.descendantFont.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.cIDFontType2));
        this.descendantFont.items.setValue(this.dictionaryProperties.baseFont, new PdfName(this.subsetName));
        this.descendantFont.items.setValue(this.dictionaryProperties.cIDToGIDMap, new PdfName(this.dictionaryProperties.identity));
        this.descendantFont.items.setValue(this.dictionaryProperties.dw, new PdfNumber(1000));
        this.fontDescriptor = this.createFontDescriptor();
        this.descendantFont.items.setValue(this.dictionaryProperties.fontDescriptor, new PdfReferenceHolder(this.fontDescriptor));
        let systemInfo : IPdfPrimitive = this.createSystemInfo();
        this.descendantFont.items.setValue(this.dictionaryProperties.cIDSystemInfo, systemInfo);
    }
    /**
     * Creates font descriptor.
     */
    private createFontDescriptor() : PdfDictionary {
        let descriptor : PdfDictionary = new PdfDictionary();
        let metrics : TtfMetrics = this.ttfReader.metrics;
        // Set property used to clone Font every time
        descriptor.isFont = true;
        descriptor.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.fontDescriptor));
        descriptor.items.setValue(this.dictionaryProperties.fontName, new PdfName(this.subsetName));
        descriptor.items.setValue(this.dictionaryProperties.flags, new PdfNumber(this.getDescriptorFlags()));
        descriptor.items.setValue(this.dictionaryProperties.fontBBox, PdfArray.fromRectangle(this.getBoundBox()));
        descriptor.items.setValue(this.dictionaryProperties.missingWidth, new PdfNumber(metrics.widthTable[32]));
        descriptor.items.setValue(this.dictionaryProperties.stemV, new PdfNumber(metrics.stemV));
        descriptor.items.setValue(this.dictionaryProperties.italicAngle, new PdfNumber(metrics.italicAngle));
        descriptor.items.setValue(this.dictionaryProperties.capHeight, new PdfNumber(metrics.capHeight));
        descriptor.items.setValue(this.dictionaryProperties.ascent, new PdfNumber(metrics.winAscent));
        descriptor.items.setValue(this.dictionaryProperties.descent, new PdfNumber(metrics.winDescent));
        descriptor.items.setValue(this.dictionaryProperties.leading, new PdfNumber(metrics.leading));
        descriptor.items.setValue(this.dictionaryProperties.avgWidth, new PdfNumber(metrics.widthTable[32]));
        descriptor.items.setValue(this.dictionaryProperties.fontFile2, new PdfReferenceHolder(this.fontProgram));
        descriptor.items.setValue(this.dictionaryProperties.maxWidth, new PdfNumber(metrics.widthTable[32]));
        descriptor.items.setValue(this.dictionaryProperties.xHeight, new PdfNumber(0));
        descriptor.items.setValue(this.dictionaryProperties.stemH, new PdfNumber(0));
        return descriptor;
    }
    /**
     * Generates cmap.
     * @private
     */
    private createCmap() : void {
        this.cmap.cmapBeginSave = new SaveCmapEventHandler(this);
    }
    /**
     * Generates font dictionary.
     */
    private createFontDictionary() : void {
        // Set property used to clone Font every time
        this.fontDictionary.isFont = true;
        this.fontDictionary.fontDictionaryBeginSave = new SaveFontDictionaryEventHandler(this);
        this.fontDictionary.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.font));
        this.fontDictionary.items.setValue(this.dictionaryProperties.baseFont, new PdfName(this.subsetName));
        this.fontDictionary.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.type0));
        this.fontDictionary.items.setValue(this.dictionaryProperties.encoding, new PdfName(this.dictionaryProperties.identityH));
        let descFonts : PdfArray = new PdfArray();
        let reference : PdfReferenceHolder = new PdfReferenceHolder(this.descendantFont);
        // Set property used to clone Font every time
        descFonts.isFont = true;
        descFonts.add(reference);
        this.fontDictionary.items.setValue(this.dictionaryProperties.descendantFonts, descFonts);
    }
    /**
     * Creates font program.
     */
    private createFontProgram() : void {
        this.fontProgram.fontProgramBeginSave = new SaveFontProgramEventHandler(this);
    }
    /**
     * Creates system info dictionary for CID font.
     * @private
     */
    private createSystemInfo() : IPdfPrimitive {
        let systemInfo : PdfDictionary = new PdfDictionary();
        systemInfo.items.setValue(this.dictionaryProperties.registry, new PdfString('Adobe'));
        systemInfo.items.setValue(this.dictionaryProperties.ordering, new PdfString(this.dictionaryProperties.identity));
        systemInfo.items.setValue(this.dictionaryProperties.supplement, new PdfNumber(0));
        return systemInfo;
    }
    /**
     * Runs before font Dictionary will be saved.
     */
    public descendantFontBeginSave() : void {
        if (this.usedChars !== null && this.usedChars !== undefined && this.usedChars.size() > 0) {
            let width : PdfArray = this.getDescendantWidth();
            if (width !== null) {
                this.descendantFont.items.setValue(this.dictionaryProperties.w, width);
            }
        }
    }
    /**
     * Runs before font Dictionary will be saved.
     */
    public cmapBeginSave() : void {
        this.generateCmap();
    }
    /**
     * Runs before font Dictionary will be saved.
     */
    /* tslint:disable */
    public fontDictionaryBeginSave() : void {
        if (this.usedChars !== null && this.usedChars !== undefined && this.usedChars.size() > 0 && !this.fontDictionary.containsKey(this.dictionaryProperties.toUnicode)) {
            this.fontDictionary.items.setValue(this.dictionaryProperties.toUnicode, new PdfReferenceHolder(this.cmap));
        }
    }
    /* tslint:enable */
    /**
     * Runs before font program stream save.
     */
    public fontProgramBeginSave() : void {
        this.isCompress = true;
        this.generateFontProgram();
    }
    /**
     * Gets width description pad array for c i d font.
     */
    public getDescendantWidth() : PdfArray {
        let array : PdfArray = new PdfArray();
        if (this.usedChars !== null && this.usedChars !== undefined && this.usedChars.size() > 0) {
            let glyphInfo : TtfGlyphInfo[] = [];
            // if (!this.isEmbedFont) {
            let keys : string[] = this.usedChars.keys();
            for (let i : number = 0; i < keys.length; i++) {
                let chLen : string = keys[i];
                let glyph : TtfGlyphInfo = this.ttfReader.getGlyph(chLen);
                if (glyph.empty) {
                    continue;
                }
                glyphInfo.push(glyph);
            }
            // } else {
            //     glyphInfo = this.ttfReader.getAllGlyphs();
            // }
            glyphInfo.sort((a : TtfGlyphInfo, b : TtfGlyphInfo) => a.index - b.index);
            let firstGlyphIndex : number = 0;
            let lastGlyphIndex : number = 0;
            let firstGlyphIndexWasSet : boolean = false;
            let widthDetails : PdfArray = new PdfArray();
            // if (!this.isEmbedFont) {
            for (let i : number = 0; i < glyphInfo.length; i++) {
                let glyph : TtfGlyphInfo = glyphInfo[i];
                if (!firstGlyphIndexWasSet) {
                    firstGlyphIndexWasSet = true;
                    firstGlyphIndex = glyph.index;
                    lastGlyphIndex = glyph.index - 1;
                }
                if ((lastGlyphIndex + 1 !== glyph.index || (i + 1 === glyphInfo.length)) && glyphInfo.length > 1) {
                    // Add glyph index / width.
                    array.add(new PdfNumber(firstGlyphIndex));
                    if (i !== 0) {
                        array.add(widthDetails);
                    }
                    firstGlyphIndex = glyph.index;
                    widthDetails = new PdfArray();
                }
                widthDetails.add(new PdfNumber(glyph.width));
                if (i + 1 === glyphInfo.length) {
                    array.add(new PdfNumber(firstGlyphIndex));
                    array.add(widthDetails);
                }
                lastGlyphIndex = glyph.index;
            }
            // } else {
            //     for (let i : number = 0; i < glyphInfo.length; i++) {
            //         let glyph : TtfGlyphInfo = glyphInfo[i];
            //         if (!firstGlyphIndexWasSet) {
            //             firstGlyphIndexWasSet = true;
            //             lastGlyphIndex = glyph.index - 1;
            //         }
            //         firstGlyphIndex = glyph.index;
            //         if ((lastGlyphIndex + 1 === glyph.index || (i + 1 === glyphInfo.length)) && glyphInfo.length > 1) {
            //             // Add glyph index / width.
            //             widthDetails.add(new PdfNumber(glyph.width));
            //             array.add(new PdfNumber(firstGlyphIndex));
            //             array.add(widthDetails);
            //             widthDetails = new PdfArray();
            //         }
            //         lastGlyphIndex = glyph.index;
            //     }
            // }
        }
        return array;
    }
    /**
     * Creates cmap.
     */
    private generateCmap() : void {
        if (this.usedChars !== null && this.usedChars !== undefined && this.usedChars.size() > 0) {
            let glyphChars : Dictionary<number, number> = this.ttfReader.getGlyphChars(this.usedChars);
            if (glyphChars.size() > 0) {
                let keys : number[] = glyphChars.keys().sort();
                // add first and last glyph indexes
                let first : number = keys[0];
                let last : number = keys[keys.length - 1];
                let middlePart : string = this.toHexString(first, false) + this.toHexString(last, false) + Operators.newLine;
                let builder : string = '';
                builder += this.cmapPrefix;
                builder += middlePart;
                builder += this.cmapEndCodespaceRange;
                let nextRange : number = 0;
                for (let i : number = 0; i < keys.length; i++) {
                    if (nextRange === 0) {
                        if (i !== 0) {
                            builder += this.cmapEndRange;
                        }
                        nextRange = Math.min(100, keys.length - i);
                        builder += nextRange;
                        builder += Operators.whiteSpace;
                        builder += this.cmapBeginRange;
                    }
                    nextRange -= 1;
                    let key : number = keys[i];
                    /* tslint:disable */
                    builder += this.toHexString(key, true) + this.toHexString(key, true) + this.toHexString(glyphChars.getValue(key), true) + '\n';
                    /* tslint:enable */
                }
                builder += this.cmapSuffix;
                this.cmap.clearStream();
                this.cmap.isFont = true;
                this.cmap.write(builder);
            }
        }
    }
    /**
     * Generates font program.
     */
    private generateFontProgram() : void {
        let fontProgram : number[] = null;
        this.usedChars = (this.usedChars === null || this.usedChars === undefined) ? new Dictionary<string, string>() : this.usedChars;
        this.ttfReader.setOffset(0);
        fontProgram = this.ttfReader.readFontProgram(this.usedChars);
        this.fontProgram.clearStream();
        this.fontProgram.isFont = true;
        this.fontProgram.writeBytes(fontProgram);
    }
    /**
     * Calculates flags for the font descriptor.
     * @private
     */
    public getDescriptorFlags() : number {
        let flags : number = 0;
        let metrics : TtfMetrics = this.ttfReader.metrics;
        if (metrics.isFixedPitch) {
            flags |= FontDescriptorFlags.FixedPitch;
        }
        if (metrics.isSymbol) {
            flags |= FontDescriptorFlags.Symbolic;
        } else {
            flags |= FontDescriptorFlags.Nonsymbolic;
        }
        if (metrics.isItalic) {
            flags |= FontDescriptorFlags.Italic;
        }
        if (metrics.isBold) {
            flags |= FontDescriptorFlags.ForceBold;
        }
        return flags;
    }
    /**
     * Calculates BoundBox of the descriptor.
     * @private
     */
    private getBoundBox() : RectangleF {
        let rect : Rectangle = this.ttfReader.metrics.fontBox;
        let width : number = Math.abs(rect.right - rect.left);
        let height : number = Math.abs(rect.top - rect.bottom);
        let rectangle : RectangleF = new RectangleF(rect.left, rect.bottom, width, height);
        return rectangle;
    }
    /**
     * Converts integer of decimal system to hex integer.
     */
    private toHexString(n : number, isCaseChange : boolean) : string {
        let s : string = n.toString(16);
        if (isCaseChange) {
            s = s.toUpperCase();
        }
        return '<0000'.substring(0, 5 - s.length) + s + '>';
    }
    /**
     * Stores used symbols.
     */
    public setSymbols(text : string) : void {
        if (text === null) {
            throw new Error('Argument Null Exception : text');
        }
        if (this.usedChars === null || this.usedChars === undefined) {
                this.usedChars = new Dictionary<string, string>();
        }
        for (let i : number = 0; i < text.length; i++) {
            let ch : string = text[i];
            this.usedChars.setValue(ch, String.fromCharCode(0));
        }
        // else {
        //     if (text === null) {
        //         throw new Error('Argument Null Exception : glyphs');
        //     }
        //     if (this.usedChars === null || this.usedChars === undefined) {
        //             this.usedChars = new Dictionary<string, string>();
        //     }
        //     for (let i : number = 0; i < text.length; i++) {
        //         let glyphIndex : number = text[i];
        //         let glyph : TtfGlyphInfo =  this.ttfReader.getGlyph(glyphIndex);
        //         if (!glyph == null) {
        //             let c : string = glyph.charCode.toLocaleString();
        //             this.usedChars.setValue(c, String.fromCharCode(0));
        //         }
        //     }
        // }
        if (this.isEmbedFont === false) {
            this.getDescendantWidth();
        }
    }
}