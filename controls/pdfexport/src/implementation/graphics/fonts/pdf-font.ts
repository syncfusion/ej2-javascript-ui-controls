/**
 * PdfFont.ts class for EJ2-PDF
 */
import { PdfFontStyle } from './enum';
import { IPdfWrapper } from './../../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { IPdfCache } from './../../../interfaces/i-pdf-cache';
import { SizeF } from './../../drawing/pdf-drawing';
import { PdfStringFormat } from './pdf-string-format';
import { PdfStringLayouter, PdfStringLayoutResult } from './string-layouter';
import { PdfFontMetrics } from './pdf-font-metrics';
import { StringTokenizer } from './string-tokenizer';
/**
 * Defines a particular format for text, including font face, size, and style attributes.
 * @private
 */
export abstract class PdfFont implements IPdfWrapper, IPdfCache {
    //Constants
    /**
     * `Multiplier` of the symbol width.
     * @default 0.001
     * @private
     */
    public static readonly charSizeMultiplier : number = 0.001;
    /**
     * `Synchronization` object.
     * @private
     */
    protected static syncObject : Object = new Object();
    //Fields
    /**
     * `Size` of the font.
     * @private
     */
    private fontSize : number;
    /**
     * `Style` of the font.
     * @private
     */
    private fontStyle : PdfFontStyle = PdfFontStyle.Regular;
    /**
     * `Metrics` of the font.
     * @private
     */
    private fontMetrics : PdfFontMetrics;
    /**
     * PDf `primitive` of the font.
     * @private
     */
    private pdfFontInternals : IPdfPrimitive;
    //Constructors
    /**
     * Initializes a new instance of the `PdfFont` class.
     * @private
     */
    protected constructor(size : number)
    /**
     * Initializes a new instance of the `PdfFont` class.
     * @private
     */
    protected constructor(size : number, style : PdfFontStyle)
    protected constructor(size ?: number, style ?: PdfFontStyle) {
        if (typeof size === 'number' && typeof style === 'undefined') {
            this.fontSize = size;
        } else {
            this.fontSize = size;
            this.setStyle(style);
        }
    }
    //Properties
    /**
     * Gets the face name of this Font.
     * @private
     */
    public get name() : string {
        return this.metrics.name;
    }
    /**
     * Gets the size of this font.
     * @private
     */
    public get size() : number {
        return this.fontSize;
    }
    /**
     * Gets the height of the font in points.
     * @private
     */
    public get height() : number {
        return this.metrics.getHeight(null);
    }
    /**
     * Gets the style information for this font.
     * @private
     */
    public get style() : PdfFontStyle {
        return this.fontStyle;
    }
    public set style(value : PdfFontStyle) {
        this.fontStyle = value;
    }
    /**
     * Gets a value indicating whether this `PdfFont` is `bold`.
     * @private
     */
    public get bold() : boolean {
        return ((this.style & PdfFontStyle.Bold) > 0);
    }
    /**
     * Gets a value indicating whether this `PdfFont` has the `italic` style applied.
     * @private
     */
    public get italic() : boolean {
        return ((this.style & PdfFontStyle.Italic) > 0);
    }
    /**
     * Gets a value indicating whether this `PdfFont` is `strikeout`.
     * @private
     */
    public get strikeout() : boolean {
        return ((this.style & PdfFontStyle.Strikeout) > 0);
    }
    /**
     * Gets a value indicating whether this `PdfFont` is `underline`.
     * @private
     */
    public get underline() : boolean {
        return ((this.style & PdfFontStyle.Underline) > 0);
    }
    /**
     * Gets or sets the `metrics` for this font.
     * @private
     */
    public get metrics() : PdfFontMetrics {
        return this.fontMetrics;
    }
    public set metrics(value : PdfFontMetrics) {
        this.fontMetrics = value;
    }
    // /**
    //  * Gets and Sets the font `internals`.
    //  * @private
    //  */
    // public get fontInternal() : IPdfPrimitive {
    //     return this.pdfFontInternals;
    // }
    // public set fontInternal(value : IPdfPrimitive) {
    //     this.pdfFontInternals = value;
    // }
    //IPdfWrapper Members
    /**
     * Gets the `element` representing the font.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.pdfFontInternals;
    }
    /* tslint:disable */
    //Public methods
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, format : PdfStringFormat) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, format : PdfStringFormat, charactersFitted : number, linesFilled : number) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, width : number) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, width : number, format : PdfStringFormat) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, width : number, format : PdfStringFormat, charactersFitted : number, linesFilled : number) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, layoutArea : SizeF) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, layoutArea : SizeF, format : PdfStringFormat) : SizeF
    /**
     * `Measures` a string by using this font.
     * @private
     */
    public measureString(text : string, layoutArea : SizeF, format : PdfStringFormat, charactersFitted : number, linesFilled : number) : SizeF
    public measureString(text : string, arg2 ?: PdfStringFormat|number|SizeF, arg3 ?: number|PdfStringFormat, arg4 ?: number, arg5 ?: number) : SizeF {
        if (typeof text === 'string' && typeof arg2 === 'undefined') {
            return this.measureString(text, null);
        } else if (typeof text === 'string' && (arg2 instanceof PdfStringFormat || arg2 == null) && typeof arg3 === 'undefined' && typeof arg4 === 'undefined') {
            let temparg2 : PdfStringFormat = arg2 as PdfStringFormat;
            let charactersFitted : number = 0;
            let linesFilled : number = 0;
            return this.measureString(text, temparg2, charactersFitted, linesFilled);
        } else if (typeof text === 'string' && (arg2 instanceof PdfStringFormat || arg2 == null) && typeof arg3 === 'number' && typeof arg4 === 'number') {
            let temparg2 : PdfStringFormat = arg2 as PdfStringFormat;
            return this.measureString(text, 0, temparg2, arg3, arg4);
        // } else if (typeof text === 'string' && typeof arg2 === 'number' && typeof arg3 === 'undefined') {
        //     return this.measureString(text, arg2, null);
        // } else if (typeof text === 'string' && typeof arg2 === 'number' && (arg3 instanceof PdfStringFormat || arg3 == null) && typeof arg4 === 'undefined' && typeof arg5 === 'undefined') {
        //     let temparg3 : PdfStringFormat = arg3 as PdfStringFormat;
        //     let charactersFitted : number = 0;
        //     let linesFilled : number = 0;
        //     return this.measureString(text, arg2, temparg3, charactersFitted, linesFilled);
        } else if (typeof text === 'string' && typeof arg2 === 'number' && (arg3 instanceof PdfStringFormat || arg3 == null) && typeof arg4 === 'number' && typeof arg5 === 'number') {
            let layoutArea : SizeF = new SizeF(arg2, 0);
            let temparg3 : PdfStringFormat = arg3 as PdfStringFormat;
            return this.measureString(text, layoutArea, temparg3, arg4, arg5);
        // } else if (typeof text === 'string' && arg2 instanceof SizeF && typeof arg3 === 'undefined') {
        //     return this.measureString(text, arg2, null);
        // } else if (typeof text === 'string' && arg2 instanceof SizeF && (arg3 instanceof PdfStringFormat || arg3 == null) && typeof arg4 === 'undefined' && typeof arg5 === 'undefined') {
        //     let temparg3 : PdfStringFormat = arg3 as PdfStringFormat;
        //     let charactersFitted : number = 0;
        //     let linesFilled : number = 0;
        //     return this.measureString(text, arg2, temparg3, charactersFitted, linesFilled);
        } else {
            if (text == null) {
                throw Error(`ArgumentNullException("text")`);
            }
            let temparg2 : SizeF = arg2 as SizeF;
            let temparg3 : PdfStringFormat = arg3 as PdfStringFormat;
            let layouter : PdfStringLayouter = new PdfStringLayouter();
            let result : PdfStringLayoutResult = layouter.layout(text, this, temparg3, temparg2, false, new SizeF(0, 0));
            // arg4 = (result.Remainder == null) ? text.length : text.length - result.Remainder.length;
            arg4 = text.length;
            arg5 = (result.empty) ? 0 : result.lines.length;
            return result.actualSize;
        }
    }
    /* tslint:enable */
    //IPdfCache Members
    /**
     * `Checks` whether the object is similar to another object.
     * @private
     */
    public equalsTo(obj : IPdfCache) : boolean {
        let result : boolean = this.equalsToFont(obj as PdfFont);
        return result;
    }
    /**
     * Returns `internals` of the object.
     * @private
     */
    public getInternals() : IPdfPrimitive {
        return this.pdfFontInternals;
    }
    /**
     * Sets `internals` to the object.
     * @private
     */
    public setInternals(internals : IPdfPrimitive) : void {
        if (internals == null) {
            throw new Error('ArgumentNullException:internals');
        }
        this.pdfFontInternals = internals;
    }
    // //Implementation
    /**
     * `Checks` whether fonts are equals.
     * @private
     */
    protected abstract equalsToFont(font : PdfFont) : boolean;
    /**
     * Returns `width` of the line.
     * @private
     */
    public abstract getLineWidth(line : string, format : PdfStringFormat) : number;
    /**
     * Sets the `style` of the font.
     * @private
     */
    protected setStyle(style : PdfFontStyle) : void {
        this.fontStyle = style;
    }
    /**
     * Applies `settings` to the default line width.
     * @private
     */
    protected applyFormatSettings(line : string, format : PdfStringFormat, width : number) : number {
        // if (line == null) {
        //     throw new Error(`ArgumentNullException:line`);
        // }
        let realWidth : number = width;
        if (format != null && width > 0) {
            // Space among characters is not default.
            if (format.characterSpacing !== 0) {
                realWidth += (line.length - 1) * format.characterSpacing;
            }
            // Space among words is not default.
            if (format.wordSpacing !== 0) {
                let symbols : string[] = StringTokenizer.spaces;
                let whitespacesCount : number = StringTokenizer.getCharsCount(line, symbols);
                realWidth += whitespacesCount * format.wordSpacing;
            }
        }
        return realWidth;
    }
}