/**
 * PdfTrueTypeFont.ts class for EJ2-PDF
 */
import { UnicodeTrueTypeFont } from './unicode-true-type-font';
import { PdfFont } from './pdf-font';
import { PdfStringFormat } from './pdf-string-format';
import { PdfFontStyle } from './enum';
import { IPdfCache } from './../../../interfaces/i-pdf-cache';
import { PdfDocument } from './../../document/pdf-document';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { PdfFontMetrics } from './pdf-font-metrics';
import { PdfTextDirection } from './../enum';
import { RtlRenderer} from './rtl-renderer';
import { TtfReader } from './ttf-reader';
import { TtfGlyphInfo } from './ttf-glyph-info';
//https://www.giftofspeed.com/base64-encoder/
export class PdfTrueTypeFont extends PdfFont {
    // Fields
    /**
     * Internal font object.
     * @private
     */
    public fontInternal : UnicodeTrueTypeFont;
    /**
     * Indicates whether the font is embedded or not.
     * @private
     */
    public isEmbedFont : boolean = false;
    /**
     * Indicates whether the font is unicoded or not.
     * @private
     */
    public isUnicode : boolean = true;
    //Constructors
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     * @private
     */
    public constructor(base64String : string, size : number)
    public constructor(base64String : string, size : number, style : PdfFontStyle)
    public constructor(base64String : string, size : number, style ?: PdfFontStyle) {
        super(size);
        if (style !== undefined) {
            this.createFontInternal(base64String, style);
        } else {
            this.createFontInternal(base64String, PdfFontStyle.Regular);
        }
    }
    protected equalsToFont(font : PdfFont) : boolean {
        let result : boolean = false;
        //let result : boolean = this.fontInternal.equalsToFont(font);
        return result;
    }
    public getLineWidth(line : string, format : PdfStringFormat) : number {
        let width : number = 0;
        if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None) {
            let returnValue : {success : boolean , width : number } = this.getUnicodeLineWidth(line, /*out*/ width, format);
            width = returnValue.width;
        } else {
        width = this.fontInternal.getLineWidth(line);
        }
        let size : number = this.metrics.getSize(format);
        width *= (PdfFont.charSizeMultiplier * size);
        width = this.applyFormatSettings(line, format, width);
        return width;
    }
    /**
     * Returns width of the char.
     */
    public getCharWidth(charCode : string, format : PdfStringFormat) : number {
        let codeWidth : number = this.fontInternal.getCharWidth(charCode);
        let size : number = this.metrics.getSize(format);
        codeWidth *= (0.001 * size);

        return codeWidth;
    }
    //Implementation
    public createFontInternal(base64String : string, style : PdfFontStyle) : void {
        this.fontInternal  = new UnicodeTrueTypeFont(base64String, this.size);
        this.calculateStyle(style);
        this.initializeInternals();
    }
    private calculateStyle(style : PdfFontStyle) : void {
        let iStyle : number = this.fontInternal.ttfMetrics.macStyle;
        if ((style & PdfFontStyle.Underline) !== 0) {
            iStyle |= PdfFontStyle.Underline;
        }
        if ((style & PdfFontStyle.Strikeout) !== 0) {
            iStyle |= PdfFontStyle.Strikeout;
        }
        this.setStyle(iStyle);
    }
    private initializeInternals() : void {
        let equalFont : IPdfCache = null;
        if (PdfDocument.enableCache) {
            // Search for the similar fonts.
            equalFont = PdfDocument.cache.search(this);
        }
        let internals : IPdfPrimitive = null;
        // There is not equal font in the cache.
        if (equalFont !== null && equalFont !== undefined) {
            // Get the settings from the cached font.
            internals = (equalFont as IPdfCache).getInternals();
            let metrics : PdfFontMetrics = (equalFont as PdfFont).metrics;
            metrics = (metrics as PdfFontMetrics).clone();
            metrics.size = this.size;
            this.metrics = metrics;
            this.fontInternal = (equalFont as PdfTrueTypeFont).fontInternal;
        } else {
            if (equalFont == null) {
                if (this.fontInternal instanceof UnicodeTrueTypeFont) {
                    (this.fontInternal as UnicodeTrueTypeFont).isEmbed = this.isEmbedFont;
                }
                this.fontInternal.createInternals();
                internals = this.fontInternal.getInternals();
                this.metrics = this.fontInternal.metrics;
            }
        }
        this.metrics.isUnicodeFont = true;
        this.setInternals(internals);
        //this.ttfReader = (this.fontInternal as UnicodeTrueTypeFont).ttfReader;
    }
    /**
     * Stores used symbols.
     */
    public setSymbols(text : string) : void {
        let internalFont : UnicodeTrueTypeFont = this.fontInternal as UnicodeTrueTypeFont;
        if (internalFont != null) {
            internalFont.setSymbols(text);
        }
    }
    /**
     * Property
     * 
     */
    public get Unicode() : boolean {
        return this.isUnicode;
    }
    // public get Font() : UnicodeTrueTypeFont {
    //     return this.fontInternal as UnicodeTrueTypeFont;
    // }
    private getUnicodeLineWidth(line : string, /*out*/ width : number , format : PdfStringFormat) : { success : boolean, width : number } {
        // if (line == null) {
        //     throw new Error('ArgumentNullException : line');
        // }
        width = 0;
        let glyphIndices : Uint16Array = null;
        let rtlRender : RtlRenderer = new RtlRenderer();
        /* tslint:disable-next-line:max-line-length */
        let result : { success : boolean, glyphs : Uint16Array } = rtlRender.getGlyphIndex(line, this, (format.textDirection === PdfTextDirection.RightToLeft) ? true : false, /*out*/ glyphIndices, true);
        let resultGlyph : boolean = result.success;
        glyphIndices = result.glyphs;
        if (resultGlyph && glyphIndices !== null) {
            let ttfReader : TtfReader = (this.fontInternal as UnicodeTrueTypeFont).ttfReader;
            for (let i : number = 0, len : number = glyphIndices.length; i < len; i++) {
                let glyphIndex : number = glyphIndices[i];
                let glyph : TtfGlyphInfo = ttfReader.getGlyph(glyphIndex);
                if (glyph !== null && typeof glyph !== 'undefined') {
                    width += glyph.width;
                }
            }
        }
        return { success : resultGlyph, width : width };
    }
}