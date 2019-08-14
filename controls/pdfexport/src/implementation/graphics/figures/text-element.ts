/**
 * PdfTextElement.ts class for EJ2-PDF
 */
import { PdfLayoutElement } from './../figures/layout-element';
import { PdfBrush } from './../brushes/pdf-brush';
import { PdfFont } from './../fonts/pdf-font';
import { PdfStandardFont } from './../fonts/pdf-standard-font';
import { PdfPen } from './../pdf-pen';
import { PdfStringFormat } from './../fonts/pdf-string-format';
import { PdfLayoutParams, PdfLayoutResult } from './../figures/base/element-layouter';
import { PdfGraphics } from './../pdf-graphics';
import { PdfTextLayoutResult, TextLayouter } from './base/text-layouter';
import { PdfSolidBrush } from './../brushes/pdf-solid-brush';
import { PdfColor } from './../pdf-color';
import { RectangleF, SizeF, PointF } from './../../drawing/pdf-drawing';
import { PdfPage } from './../../pages/pdf-page';
import { PdfLayoutFormat } from './base/element-layouter';
import { PdfStringLayoutResult, PdfStringLayouter } from './../fonts/string-layouter';
import { PdfTextAlignment } from './../enum';
/**
 * `PdfTextElement` class represents the text area with the ability to span several pages
 * and inherited from the 'PdfLayoutElement' class.
 * @private
 */
export class PdfTextElement extends PdfLayoutElement {
    // Fields
    /**
     * `Text` data.
     * @private
     */
    private content : string = '';
    /**
     * `Value` of text data.
     * @private
     */
    private elementValue : string = '';
    /**
     * `Pen` for text drawing.
     * @private
     */
    private pdfPen : PdfPen;
    /**
     * `Brush` for text drawing.
     * @private
     */
    private pdfBrush : PdfBrush;
    /**
     * `Font` for text drawing.
     * @private
     */
    private pdfFont : PdfFont;
    /**
     * Text `format`.
     * @private
     */
    private format : PdfStringFormat;
    /**
     * indicate whether the drawText with PointF overload is called or not.
     * @default false
     * @private
     */
    private hasPointOverload : boolean = false;
    /**
     * indicate whether the PdfGridCell value is `PdfTextElement`
     * @default false
     * @private
     */
    public isPdfTextElement : boolean = false;
    // Constructors
    /**
     * Initializes a new instance of the `PdfTextElement` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfTextElement` class with text to draw into the PDF.
     * @private
     */
    public constructor(text : string)
    /**
     * Initializes a new instance of the `PdfTextElement` class with the text and `PdfFont`.
     * @private
     */
    public constructor(text : string, font : PdfFont)
    /**
     * Initializes a new instance of the `PdfTextElement` class with text,`PdfFont` and `PdfPen`.
     * @private
     */
    public constructor(text : string, font : PdfFont, pen : PdfPen)
    /**
     * Initializes a new instance of the `PdfTextElement` class with text,`PdfFont` and `PdfBrush`.
     * @private
     */
    public constructor(text : string, font : PdfFont, brush : PdfBrush)
    /**
     * Initializes a new instance of the `PdfTextElement` class with text,`PdfFont`,`PdfPen`,`PdfBrush` and `PdfStringFormat`.
     * @private
     */
    public constructor(text : string, font : PdfFont, pen : PdfPen, brush : PdfBrush, format : PdfStringFormat)
    public constructor(arg1 ?: string, arg2 ?: PdfFont, arg3 ?: PdfPen|PdfBrush, arg4 ?: PdfBrush, arg5 ?: PdfStringFormat) {
        super();
        if (typeof arg1 === 'undefined') {
            //
        } else if (typeof arg1 === 'string' && typeof arg2 === 'undefined') {
            this.content = arg1;
            this.elementValue = arg1;
        } else if (typeof arg1 === 'string' && arg2 instanceof PdfFont && typeof arg3 === 'undefined') {
            this.content = arg1;
            this.elementValue = arg1;
            this.pdfFont = arg2;
        } else if (typeof arg1 === 'string' && arg2 instanceof PdfFont && arg3 instanceof PdfPen && typeof arg4 === 'undefined') {
            this.content = arg1;
            this.elementValue = arg1;
            this.pdfFont = arg2;
            this.pdfPen = arg3;
        } else if (typeof arg1 === 'string' && arg2 instanceof PdfFont && arg3 instanceof PdfBrush && typeof arg4 === 'undefined') {
            this.content = arg1;
            this.elementValue = arg1;
            this.pdfFont = arg2;
            this.pdfBrush = arg3;
        } else {
            this.content = arg1;
            this.elementValue = arg1;
            this.pdfFont = arg2;
            this.pdfPen = arg3 as PdfPen;
            this.pdfBrush = arg4;
            this.format = arg5;
        }
    }
    // Properties
    /**
     * Gets or sets a value indicating the `text` that should be printed.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // create the font
     * let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
     * // create the Text Web Link
     * let textLink : PdfTextWebLink = new PdfTextWebLink();
     * // set the hyperlink
     * textLink.url = 'http://www.google.com';
     * //
     * // set the link text
     * textLink.text = 'Google';
     * //
     * // set the font
     * textLink.font = font;
     * // draw the hyperlink in PDF page
     * textLink.draw(page1, new PointF(10, 40));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get text() : string {
        return this.content;
    }
    public set text(value : string) {
        this.elementValue = value;
        this.content = value;
    }
    //get value
    /**
     * Gets or sets a `value` indicating the text that should be printed.
     * @private
     */
    public get value() : string {
        return this.elementValue;
    }
    //get pen
    /**
     * Gets or sets a `PdfPen` that determines the color, width, and style of the text
     * @private
     */
    public get pen() : PdfPen {
        return this.pdfPen;
    }
    //Set pen value
    public set pen(value : PdfPen) {
        this.pdfPen = value;
    }
    //get brush
    /**
     * Gets or sets the `PdfBrush` that will be used to draw the text with color and texture.
     * @private
     */
    public get brush() : PdfBrush {
        return this.pdfBrush;
    }
    //Set brush value
    public set brush(value : PdfBrush) {
        this.pdfBrush = value;
    }
    //get font
    /**
     * Gets or sets a `PdfFont` that defines the text format.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // create the font
     * let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
     * // create the Text Web Link
     * let textLink : PdfTextWebLink = new PdfTextWebLink();
     * // set the hyperlink
     * textLink.url = 'http://www.google.com';
     * // set the link text
     * textLink.text = 'Google';
     * //
     * // set the font
     * textLink.font = font;
     * //
     * // draw the hyperlink in PDF page
     * textLink.draw(page1, new PointF(10, 40));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get font() : PdfFont {
        return this.pdfFont;
    }
    public set font(value : PdfFont) {
        this.pdfFont = value;
        if (this.pdfFont instanceof PdfStandardFont && this.content != null) {
            this.elementValue = PdfStandardFont.convert(this.content);
        } else {
            this.elementValue = this.content;
        }
    }
    /**
     * Gets or sets the `PdfStringFormat` that will be used to set the string format
     * @private
     */
    public get stringFormat() : PdfStringFormat {
        return this.format;
    }
    public set stringFormat(value : PdfStringFormat) {
        this.format = value;
    }
    // Implementation
    /**
     * Gets a `brush` for drawing.
     * @private
     */
    public getBrush() : PdfBrush {
        return (this.pdfBrush == null || typeof this.pdfBrush === 'undefined') ? new PdfSolidBrush(new PdfColor(0, 0, 0)) : this.pdfBrush;
    }
    // /**
    //  * `Draws` an element on the Graphics.
    //  * @private
    //  */
    // public drawInternal(graphics : PdfGraphics) : void {
    //     graphics.drawString(this.elementValue, this.pdfFont, this.pdfPen, this.getBrush(), 0, 0, this.stringFormat);
    // }
    /**
     * `Layouts` the element.
     * @private
     */
    protected layout(param : PdfLayoutParams) : PdfLayoutResult {
        let layouter : TextLayouter = new TextLayouter(this);
        let result : PdfTextLayoutResult = layouter.layout(param) as PdfTextLayoutResult;
        return result;
    }
    /* tslint:disable */
    /**
     * `Draws` the element on the page with the specified page and "PointF" class
     * @private
     */
    public drawText(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and pair of coordinates
     * @private
     */
    public drawText(page : PdfPage, x : number, y : number) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and "RectangleF" class
     * @private
     */
    public drawText(page : PdfPage, layoutRectangle : RectangleF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, "PointF" class and layout format
     * @private
     */
    public drawText(page : PdfPage, location : PointF, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, pair of coordinates and layout format
     * @private
     */
    public drawText(page : PdfPage, x : number, y : number, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page.
     * @private
     */
    public drawText(page : PdfPage, layoutRectangle : RectangleF, embedFonts : boolean) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, "RectangleF" class and layout format
     * @private
     */
    public drawText(page : PdfPage, layoutRectangle : RectangleF, format : PdfLayoutFormat) : PdfLayoutResult
    public drawText(arg2 : PdfPage, arg3 : RectangleF | PointF | number, arg4 ?: PdfLayoutFormat | number | boolean, arg5 ?: PdfLayoutFormat) : PdfLayoutResult {
        if (arg3 instanceof PointF && typeof (arg3 as RectangleF).width === 'undefined' && typeof arg4 === 'undefined') {
            this.hasPointOverload = true;
            return this.drawText(arg2, arg3.x, arg3.y);
        } else if (typeof arg3 === 'number' && typeof arg4 === 'number' && typeof arg5 === 'undefined') {
            this.hasPointOverload = true;
            return this.drawText(arg2, arg3, arg4, null);
        } else if (arg3 instanceof RectangleF && typeof (arg3 as RectangleF).width !== 'undefined' && typeof arg4 === 'undefined') {
            return this.drawText(arg2, arg3, null);
        } else if (arg3 instanceof PointF && typeof (arg3 as RectangleF).width === 'undefined' && arg4 instanceof PdfLayoutFormat) {
            this.hasPointOverload = true;
            return this.drawText(arg2, arg3.x, arg3.y, arg4);
        } else if (typeof arg3 === 'number' && typeof arg4 === 'number' && (arg5 instanceof PdfLayoutFormat || arg5 == null)) {
            this.hasPointOverload = true;
            let width : number = (arg2.graphics.clientSize.width - arg3);
            let layoutRectangle : RectangleF = new RectangleF(arg3, arg4, width, 0);
            return this.drawText(arg2, layoutRectangle, arg5);
        } else if (arg3 instanceof RectangleF && typeof (arg3 as RectangleF).width !== 'undefined' && typeof arg4 === 'boolean') {
            return this.drawText(arg2, arg3, null);
        } else {
            let layout : PdfStringLayouter = new PdfStringLayouter();
            if (this.hasPointOverload) {
                let stringLayoutResult : PdfStringLayoutResult = layout.layout(this.value, this.font, this.stringFormat, new SizeF((arg2.graphics.clientSize.width - (arg3 as RectangleF).x), 0), true, arg2.graphics.clientSize);
                let layoutResult : PdfLayoutResult;
                let param : PdfLayoutParams = new PdfLayoutParams();
                let temparg3 : RectangleF = arg3 as RectangleF;
                let temparg4 : PdfLayoutFormat = arg4 as PdfLayoutFormat;
                param.page = arg2;
                let previousPage : PdfPage = arg2;
                param.bounds = temparg3;
                param.format = (temparg4 != null) ? temparg4 : new PdfLayoutFormat();
                if (stringLayoutResult.lines.length > 1) {
                    this.text = stringLayoutResult.layoutLines[0].text;
                    if (param.bounds.y <= param.page.graphics.clientSize.height) {
                        let previousPosition : PointF = new PointF(param.bounds.x, param.bounds.y);
                        layoutResult = this.layout(param);
                        let bounds : RectangleF = new RectangleF(0, layoutResult.bounds.y + stringLayoutResult.lineHeight, arg2.graphics.clientSize.width, stringLayoutResult.lineHeight);
                        let isPaginate : boolean = false;
                        for (let i : number = 1; i < stringLayoutResult.lines.length; i++) {
                            param.page = layoutResult.page;
                            param.bounds = new RectangleF(new PointF(bounds.x, bounds.y), new SizeF(bounds.width, bounds.height));
                            this.text = stringLayoutResult.layoutLines[i].text;
                            if (bounds.y + stringLayoutResult.lineHeight > layoutResult.page.graphics.clientSize.height) {
                                isPaginate = true;
                                param.page = param.page.graphics.getNextPage();
                                if (previousPosition.y > (layoutResult.page.graphics.clientSize.height - layoutResult.bounds.height)) {
                                    bounds = new RectangleF(0, layoutResult.bounds.height, layoutResult.page.graphics.clientSize.width, stringLayoutResult.lineHeight);   
                                } else {
                                    bounds = new RectangleF(0, 0, layoutResult.page.graphics.clientSize.width, stringLayoutResult.lineHeight);
                                }
                                param.bounds = bounds;
                            }
                            layoutResult = this.layout(param);
                            if (i !== (stringLayoutResult.lines.length - 1)) {
                                bounds = new RectangleF(0, layoutResult.bounds.y + stringLayoutResult.lineHeight, layoutResult.page.graphics.clientSize.width, stringLayoutResult.lineHeight);
                            } else {
                                let lineWidth : number = this.font.measureString(this.text, this.format).width;
                                layoutResult = this.calculateResultBounds(layoutResult, lineWidth, layoutResult.page.graphics.clientSize.width, 0);
                            }
                        }
                    }
                    return layoutResult;
                } else {
                    let lineSize : SizeF = this.font.measureString(this.text, this.format);
                    if (param.bounds.y <= param.page.graphics.clientSize.height) {
                        layoutResult = this.layout(param);
                        layoutResult = this.calculateResultBounds(layoutResult, lineSize.width, layoutResult.page.graphics.clientSize.width, 0);
                    }
                    return layoutResult;
                }
            } else {
                let layoutResult : PdfStringLayoutResult = layout.layout(this.value, this.font, this.stringFormat, new SizeF((arg3 as RectangleF).width, 0), false, arg2.graphics.clientSize);
                let result : PdfLayoutResult;
                let param : PdfLayoutParams = new PdfLayoutParams();
                let temparg3 : RectangleF = arg3 as RectangleF;
                let temparg4 : PdfLayoutFormat = arg4 as PdfLayoutFormat;
                param.page = arg2;
                param.bounds = temparg3;
                param.format = (temparg4 != null) ? temparg4 : new PdfLayoutFormat();
                if (layoutResult.lines.length > 1) {
                    this.text = layoutResult.layoutLines[0].text;
                    if (param.bounds.y <= param.page.graphics.clientSize.height) {
                        let previousPosition : PointF = new PointF(param.bounds.x, param.bounds.y);
                        result = this.layout(param);
                        let bounds : RectangleF = new RectangleF(temparg3.x, result.bounds.y + layoutResult.lineHeight, temparg3.width, layoutResult.lineHeight);
                        let isPaginate : boolean = false;
                        for (let i : number = 1; i < layoutResult.lines.length; i++) {
                            param.page = result.page;
                            param.bounds = new RectangleF(bounds.x, bounds.y, bounds.width, bounds.height);
                            this.text = layoutResult.layoutLines[i].text;
                            if (bounds.y + layoutResult.lineHeight > result.page.graphics.clientSize.height) {
                                isPaginate = true;
                                param.page = param.page.graphics.getNextPage();
                                if (previousPosition.y > (result.page.graphics.clientSize.height - result.bounds.height)) {
                                    bounds = new RectangleF(temparg3.x, layoutResult.lineHeight, temparg3.width, layoutResult.lineHeight);
                                } else {
                                    bounds = new RectangleF(temparg3.x, 0, temparg3.width, layoutResult.lineHeight);
                                }
                                param.bounds = bounds;
                            }
                            result = this.layout(param);
                            if (i !== (layoutResult.lines.length - 1)) {
                                bounds = new RectangleF(temparg3.x, result.bounds.y + layoutResult.lineHeight, temparg3.width, layoutResult.lineHeight);
                            } else {
                                let lineWidth : number = this.font.measureString(this.text, this.format).width;
                                result =  this.calculateResultBounds(result, lineWidth, temparg3.width, temparg3.x);
                            }
                        }
                    }
                    return result;
                } else {
                    let lineSize : SizeF = this.font.measureString(this.text, this.format);
                    if (param.bounds.y <= param.page.graphics.clientSize.height) {
                        result = this.layout(param);
                        result =  this.calculateResultBounds(result, lineSize.width, temparg3.width, temparg3.x);
                    }
                    return result;
                }
            }
        }
    }
    private calculateResultBounds(result : PdfLayoutResult, lineWidth : number, maximumWidth : number, startPosition : number) : PdfLayoutResult {
        let shift : number = 0;
        if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Center) {
            result.bounds.x = startPosition + (maximumWidth - lineWidth) / 2;
            result.bounds.width = lineWidth;
        } else if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Right) {
            result.bounds.x = startPosition + (maximumWidth - lineWidth);
            result.bounds.width = lineWidth;
        } else if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Justify) {
            result.bounds.x = startPosition;
            result.bounds.width = maximumWidth;
        } else {
            result.bounds.width = startPosition;
            result.bounds.width = lineWidth;
        }
        return result;
    }
    /* tslint:enable */
}