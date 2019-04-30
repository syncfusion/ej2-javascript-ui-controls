import { PdfPage } from './../pages/pdf-page';
import { PdfGraphics } from './../graphics/pdf-graphics';
import { PointF, RectangleF, SizeF } from './../drawing/pdf-drawing';
import { PdfTextElement } from './../graphics/figures/text-element';
import { PdfUriAnnotation } from './uri-annotation';
import { PdfStringLayouter, PdfStringLayoutResult } from './../graphics/fonts/string-layouter';
import { PdfFontStyle } from './../graphics/fonts/enum';
import { PdfLayoutResult } from './../graphics/figures/base/element-layouter';
import { PdfTextAlignment } from './../graphics/enum';
import { PdfArray } from './../primitives/pdf-array';
import { PdfNumber } from './../primitives/pdf-number';
/**
 * `PdfTextWebLink` class represents the class for text web link annotation.
 * ```typescript
 * // create a new PDF document.
 * let document : PdfDocument = new PdfDocument();
 * // add a page to the document.
 * let page1 : PdfPage = document.pages.add();
 * // create the font
 * let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
 * //
 * // create the Text Web Link
 * let textLink : PdfTextWebLink = new PdfTextWebLink();
 * // set the hyperlink
 * textLink.url = 'http://www.google.com';
 * // set the link text
 * textLink.text = 'Google';
 * // set the font
 * textLink.font = font;
 * // draw the hyperlink in PDF page
 * textLink.draw(page1, new PointF(10, 40));
 * //
 * // save the document.
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfTextWebLink extends PdfTextElement {
    // Fields
    /**
     * Internal variable to store `Url`.
     * @default ''
     * @private
     */
    private uniformResourceLocator : string = '';
    /**
     * Internal variable to store `Uri Annotation` object. 
     * @default null
     * @private
     */
    private uriAnnotation : PdfUriAnnotation = null;
    /**
     * Checks whether the drawTextWebLink method with `PointF` overload is called or not.
     * If it set as true, then the start position of each lines excluding firest line is changed as (0, Y).
     * @private
     * @hidden
     */
    private recalculateBounds : boolean = false;
    private defaultBorder : PdfArray = new PdfArray();
    // Properties
    /**
     * Gets or sets the `Uri address`.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // create the font
     * let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
     * // create the Text Web Link
     * let textLink : PdfTextWebLink = new PdfTextWebLink();
     * //
     * // set the hyperlink
     * textLink.url = 'http://www.google.com';
     * //
     * // set the link text
     * textLink.text = 'Google';
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
    public get url() : string {
        return this.uniformResourceLocator;
    }
    public set url(value : string) {
        if (value.length === 0) {
            throw new Error('ArgumentException : Url - string can not be empty');
        }
        this.uniformResourceLocator = value;
    }

    // Constructors
    /**
     * Initializes a new instance of the `PdfTextWebLink` class.
     * @private
     */
    public constructor() {
        super();
        for (let i : number = 0; i < 3; i++) {
            this.defaultBorder.add(new PdfNumber(0));
        }
    }

    // Implementation
    /* tslint:disable */
    /**
     * `Draws` a Text Web Link on the Page with the specified location.
     * @private
     */
    public draw(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `Draws` a Text Web Link on the Page with the specified bounds.
     * @private
     */
    public draw(page : PdfPage, bounds : RectangleF) : PdfLayoutResult
    /**
     * `Draw` a Text Web Link on the Graphics with the specified location.
     * @private
     */
    public draw(graphics : PdfGraphics, location : PointF) : PdfLayoutResult
    /**
     * `Draw` a Text Web Link on the Graphics with the specified bounds.
     * @private
     */
    public draw(graphics : PdfGraphics, bounds : RectangleF) : PdfLayoutResult
    public draw(arg1 : PdfGraphics|PdfPage, arg2 : PointF|RectangleF) : PdfLayoutResult {
        if (arg1 instanceof PdfPage) {
            let layout : PdfStringLayouter = new PdfStringLayouter();
            let previousFontStyle : PdfFontStyle = this.font.style;
            if (arg2 instanceof PointF) {
                this.recalculateBounds = true;
                this.font.style = PdfFontStyle.Underline;
                let layoutResult : PdfStringLayoutResult = layout.layout(this.value, this.font, this.stringFormat, new SizeF((arg1.graphics.clientSize.width - arg2.x), 0), true, arg1.graphics.clientSize);
                if (layoutResult.lines.length === 1) {
                    let textSize : SizeF = this.font.measureString(this.value);
                    let rect : RectangleF = new RectangleF(arg2, textSize);
                    rect = this.calculateBounds(rect, textSize.width, arg1.graphics.clientSize.width, arg2.x);
                    this.uriAnnotation = new PdfUriAnnotation(rect, this.url);
                    this.uriAnnotation.dictionary.items.setValue('Border', this.defaultBorder);
                    arg1.annotations.add(this.uriAnnotation);
                    let result : PdfLayoutResult =  this.drawText(arg1, arg2);
                    this.font.style = previousFontStyle;
                    return result;
                } else {
                    let result : PdfLayoutResult =  this.drawMultipleLineWithPoint(layoutResult, arg1, arg2);
                    this.font.style = previousFontStyle;
                    return result;
                }
            } else {
                let layoutResult : PdfStringLayoutResult = layout.layout(this.value, this.font, this.stringFormat, new SizeF((arg2 as RectangleF).width, 0), false, new SizeF(0, 0));
                this.font.style = PdfFontStyle.Underline;
                if (layoutResult.lines.length === 1) {
                    let textSize : SizeF = this.font.measureString(this.value);
                    let rect : RectangleF = new RectangleF(new PointF((arg2 as RectangleF).x, (arg2 as RectangleF).y), textSize);
                    rect = this.calculateBounds(rect, textSize.width, (arg2 as RectangleF).width, (arg2 as RectangleF).x);
                    this.uriAnnotation = new PdfUriAnnotation(rect, this.url);
                    this.uriAnnotation.dictionary.items.setValue('Border', this.defaultBorder);
                    arg1.annotations.add(this.uriAnnotation);
                    let returnValue : PdfLayoutResult = this.drawText(arg1, arg2 as RectangleF);
                    this.font.style = previousFontStyle;
                    return returnValue;
                } else {
                    let returnValue : PdfLayoutResult = this.drawMultipleLineWithBounds(layoutResult, arg1, arg2 as RectangleF);
                    this.font.style = previousFontStyle;
                    return returnValue;
                }
            }
        } else {
            let page : PdfPage = new PdfPage();
            page = arg1.page as PdfPage;
            return this.draw(page, arg2);
        }
    }
    /* tslint:enable */
    //Private methods
    /**
     * Helper method `Draw` a Multiple Line Text Web Link on the Graphics with the specified location.
     * @private
     */
    private drawMultipleLineWithPoint(result : PdfStringLayoutResult, page : PdfPage, location : PointF) : PdfLayoutResult {
        let layoutResult : PdfLayoutResult;
        for (let i : number = 0; i < result.layoutLines.length; i++) {
            let size : SizeF = this.font.measureString(result.lines[i].text);
            let bounds : RectangleF = new RectangleF(location, size);
            if (i !== 0) {
                bounds.x = 0;
            }
            this.text = result.lines[i].text;
            if (bounds.y + size.height > page.graphics.clientSize.height) {
                if (i !== 0) {
                    page = page.graphics.getNextPage();
                    bounds = new RectangleF(0, 0, page.graphics.clientSize.width, size.height);
                    location.y = 0;
                } else {
                    break;
                }
            }
            bounds = this.calculateBounds(bounds, size.width, page.graphics.clientSize.width, bounds.x);
            this.uriAnnotation = new PdfUriAnnotation(bounds, this.url);
            this.uriAnnotation.dictionary.items.setValue('Border', this.defaultBorder);
            page.annotations.add(this.uriAnnotation);
            if (i !== 0) {
                layoutResult = this.drawText(page, new PointF(0, bounds.y));
            } else {
                layoutResult = this.drawText(page, bounds.x, bounds.y);
            }
            location.y += size.height;
        }
        return layoutResult;
    }
    /**
     * Helper method `Draw` a Multiple Line Text Web Link on the Graphics with the specified bounds.
     * @private
     */
    private drawMultipleLineWithBounds(result : PdfStringLayoutResult, page : PdfPage, bounds : RectangleF) : PdfLayoutResult {
        let layoutResult : PdfLayoutResult;
        for (let i : number = 0; i < result.layoutLines.length; i++) {
            let size : SizeF = this.font.measureString(result.lines[i].text);
            let internalBounds : RectangleF = new RectangleF(new PointF(bounds.x, bounds.y), size);
            internalBounds = this.calculateBounds(internalBounds, size.width, bounds.width, bounds.x);
            this.text = result.lines[i].text;
            if (bounds.y + size.height > page.graphics.clientSize.height) {
                if (i !== 0) {
                    page = page.graphics.getNextPage();
                    bounds = new RectangleF(bounds.x, 0, bounds.width, size.height);
                    internalBounds.y = 0;
                } else {
                    break;
                }
            }
            this.uriAnnotation = new PdfUriAnnotation(internalBounds, this.url);
            this.uriAnnotation.dictionary.items.setValue('Border', this.defaultBorder);
            page.annotations.add(this.uriAnnotation);
            layoutResult = this.drawText(page, bounds);
            bounds.y += size.height;
        }
        return layoutResult;
    }
    /* tslint:disable */
    private calculateBounds(currentBounds : RectangleF, lineWidth : number, maximumWidth : number, startPosition : number) : RectangleF {
        let shift : number = 0;
        if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Center) {
            currentBounds.x = startPosition + (maximumWidth - lineWidth) / 2;
            currentBounds.width = lineWidth;
        } else if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Right) {
            currentBounds.x = startPosition + (maximumWidth - lineWidth);
            currentBounds.width = lineWidth;
        } else if (this.stringFormat != null && typeof this.stringFormat !== 'undefined' && this.stringFormat.alignment === PdfTextAlignment.Justify) {
            currentBounds.x = startPosition;
            currentBounds.width = maximumWidth;
        } else {
            currentBounds.width = startPosition;
            currentBounds.width = lineWidth;
        }
        return currentBounds;
    }
    /* tslint:enable */
}