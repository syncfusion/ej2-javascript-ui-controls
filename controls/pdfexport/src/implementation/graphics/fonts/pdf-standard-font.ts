import { PdfFontFamily, PdfFontStyle, FontEncoding } from './enum';
import { PdfFont } from './pdf-font';
import { PdfDocument } from './../../document/pdf-document';
import { IPdfCache } from './../../../interfaces/i-pdf-cache';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { PdfStandardFontMetricsFactory } from './pdf-standard-font-metrics-factory';
import { PdfStringFormat } from './pdf-string-format';
import { PdfFontMetrics, WidthTable } from './pdf-font-metrics';
import { PdfDictionary } from './../../primitives/pdf-dictionary';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfName } from './../../primitives/pdf-name';
/**
 * Represents one of the 14 standard fonts.
 * It's used to create a standard PDF font to draw the text in to the PDF.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a new page to the document
 * let page1 : PdfPage = document.pages.add();
 * //
 * // create new standard font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * //
 * // create black brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
 * // draw the text
 * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfStandardFont extends PdfFont {
    //Constants
    /**
     * First character `position`.
     * @private
     */
    private static readonly charOffset : number = 32;
    //Fields
    /**
     * `FontFamily` of the font.
     * @private
     */
    private pdfFontFamily : PdfFontFamily;
    /**
     * Gets `ascent` of the font.
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Gets `encodings` for internal class use.
     * @hidden
     * @private
     */
    private encodings : string[] = ['Unknown', 'StandardEncoding', 'MacRomanEncoding', 'MacExpertEncoding',
                                         'WinAnsiEncoding', 'PDFDocEncoding', 'IdentityH'];
    //Constructors
    /* tslint:disable */
    /**
     * Initializes a new instance of the `PdfStandardFont` class with font family and it`s size.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a new page to the document
     * let page1 : PdfPage = document.pages.add();
     * // create black brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // set the font with the font family and font size
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param fontFamily Represents the font family to be used.
     * @param size Represents the size of the font.
     */
    public constructor(fontFamily : PdfFontFamily, size : number)
    /**
     * Initializes a new instance of the `PdfStandardFont` class with font family, size and font style.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20, PdfFontStyle.Bold);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10));
     * // save the document
     * document.save('output.pdf'); 
     * // destroy the document
     * document.destroy();
     * ```
     * @param fontFamily Represents the font family to be used.
     * @param size Represents the size of the font.
     * @param style Represents the font style.
     */
    public constructor(fontFamily : PdfFontFamily, size : number, style : PdfFontStyle)
    /**
     * Initializes a new instance of the `PdfStandardFont` class with `PdfStandardFont` as prototype and font size.
     * @private
     */
    public constructor(prototype : PdfStandardFont, size : number)
    /**
     * Initializes a new instance of the `PdfStandardFont` class with `PdfStandardFont` as prototype,font size and font style.
     * @private
     */
    public constructor(prototype : PdfStandardFont, size : number, style : PdfFontStyle)
    public constructor(fontFamilyPrototype : PdfFontFamily|PdfStandardFont, size : number, style? : PdfFontStyle) {
        super(size, (typeof style === 'undefined') ? ((fontFamilyPrototype instanceof PdfStandardFont) ? fontFamilyPrototype.style : PdfFontStyle.Regular) : style);
        if (typeof fontFamilyPrototype === 'undefined') {
            this.pdfFontFamily = PdfFontFamily.Helvetica;
        } else if ((fontFamilyPrototype instanceof PdfStandardFont)) {
            this.pdfFontFamily = fontFamilyPrototype.fontFamily;
        } else {
            this.pdfFontFamily = fontFamilyPrototype;
        }
        this.checkStyle();
        this.initializeInternals();
    }
    /* tslint:enable */
    //Properties
    /**
     * Gets the `FontFamily`.
     * @private
     */
    public get fontFamily() : PdfFontFamily {
        return this.pdfFontFamily;
    }
    //methods
    /**
     * Checks font `style` of the font.
     * @private
     */
    private checkStyle() : void {
        if (this.fontFamily === PdfFontFamily.Symbol || this.fontFamily === PdfFontFamily.ZapfDingbats) {
            let style : PdfFontStyle = this.style;
            style &= ~(PdfFontStyle.Bold |  PdfFontStyle.Italic);
            this.setStyle(style);
        }
    }
    /**
     * Returns `width` of the line.
     * @public
     */
    public getLineWidth(line : string, format : PdfStringFormat) : number {
        if (line == null) {
            throw new Error('ArgumentNullException:line');
        }
        let width : number = 0;
        let name : string = this.name;
        line = PdfStandardFont.convert(line);
        for (let i : number = 0, len : number = line.length; i < len; i++) {
            let ch : string = line[i];
            let charWidth : number = this.getCharWidthInternal(ch, format);
            width += charWidth;
        }
        let size : number = this.metrics.getSize(format);
        width *= (PdfFont.charSizeMultiplier * size);
        width = this.applyFormatSettings(line, format, width);
        return width;
    }
    /**
     * Checks whether fonts are `equals`.
     * @private
     */
    protected equalsToFont(font : PdfFont) : boolean {
        let equal : boolean = false;
        let stFont : PdfStandardFont = font as PdfStandardFont;
        if (stFont != null) {
            let fontFamilyEqual : boolean = (this.fontFamily === stFont.fontFamily);
            let lineReducer : number = (~(PdfFontStyle.Underline | PdfFontStyle.Strikeout));
            let styleEqual : boolean = (this.style & lineReducer) === (stFont.style & lineReducer);
            equal = (fontFamilyEqual && styleEqual);
        }
        return equal;
    }
    /**
     * `Initializes` font internals..
     * @private
     */
    private initializeInternals() : void {
        let equalFont : IPdfCache = null;
        // if (PdfDocument.EnableCache) {
        equalFont = PdfDocument.cache.search(this);
        // }
        let internals : IPdfPrimitive = null;
        // if (equalFont == null) {
        // Create font metrics.
        let metrics : PdfFontMetrics = PdfStandardFontMetricsFactory.getMetrics(this.pdfFontFamily, this.style, this.size);
        this.metrics = metrics;
        internals = this.createInternals();
        (this as IPdfCache).setInternals(internals);
    }
    /**
     * `Creates` font`s dictionary.
     * @private
     */
    private createInternals() : PdfDictionary {
        let dictionary : PdfDictionary = new PdfDictionary();
        dictionary.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.font));
        dictionary.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.type1));
        dictionary.items.setValue(this.dictionaryProperties.baseFont, new PdfName(this.metrics.postScriptName));
        if (this.fontFamily !== PdfFontFamily.Symbol && this.fontFamily !== PdfFontFamily.ZapfDingbats) {
            let encoding : string = this.encodings[FontEncoding.WinAnsiEncoding];
            dictionary.items.setValue(this.dictionaryProperties.encoding, new PdfName(encoding));
        }
        return dictionary;
    }
    /**
     * Returns `width` of the char. This methods doesn`t takes into consideration font`s size.
     * @private
     */
    private getCharWidthInternal(charCode : string, format : PdfStringFormat) : number {
        let width : number = 0;
        let code : number = 0;
        code = charCode.charCodeAt(0);
        if (this.name === '0' || this.name === '1' || this.name === '2' ||
            this.name === '3' || this.name === '4') {
            code = code - PdfStandardFont.charOffset;
        }
        code = (code >= 0 && code !== 128) ? code : 0;
        let metrics : PdfFontMetrics = this.metrics;
        let widthTable : WidthTable = metrics.widthTable;
        width = widthTable.items(code);
        return width;
    }
    /**
     * `Converts` the specified text.
     * @private
     */
    public static convert(text : string) : string {
        return text;
    }
}
    