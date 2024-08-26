/**
 * TextLayouter.ts class for EJ2-PDF
 */
import { ElementLayouter, PdfLayoutParams, PdfLayoutResult } from './element-layouter';
import { PdfStringFormat } from './../../fonts/pdf-string-format';
import { PdfTextElement } from './../text-element';
import { PdfPage } from './../../../pages/pdf-page';
import { RectangleF, SizeF } from './../../../drawing/pdf-drawing';
import { LineInfo, PdfStringLayoutResult, PdfStringLayouter } from './../../fonts/string-layouter';
import { PdfLayoutBreakType } from './../../figures/enum';
import { PdfGraphics } from './../../pdf-graphics';
import { PdfColor } from './../../pdf-color';
import { PdfSolidBrush } from './../../brushes/pdf-solid-brush';
import { PdfTextWebLink } from './../../../annotations/pdf-text-web-link';
/**
 * Class that `layouts the text`.
 * @private
 */
export class TextLayouter extends ElementLayouter {
    // Fields
    /**
     * String `format`.
     * @private
     */
    private format : PdfStringFormat;
    /**
     * Gets the layout `element`.
     * @private
     */
    public get element() : PdfTextElement {
        return (super.getElement() as PdfTextElement);
    }
    // Constructors
    /**
     * Initializes a new instance of the `TextLayouter` class.
     * @private
     */
    public constructor(element : PdfTextElement) {
        super(element);
    }
    // Implementation
    /**
     * `Layouts` the element.
     * @private
     */
    protected layoutInternal(param : PdfLayoutParams) : PdfLayoutResult {
        /* tslint:disable */
        this.format = (this.element.stringFormat !== null && typeof this.element.stringFormat !== 'undefined') ? this.element.stringFormat : null;
        let currentPage : PdfPage = param.page;
        let currentBounds : RectangleF = param.bounds;
        let text : string = this.element.value;
        let result : PdfTextLayoutResult = null;
        let pageResult : TextPageLayoutResult = new TextPageLayoutResult();
        pageResult.page = currentPage;
        pageResult.remainder = text;
        for ( ; ; ) {
            pageResult = this.layoutOnPage(text, currentPage, currentBounds, param);
            result = this.getLayoutResult(pageResult);
            break;
        }
        /* tslint:enable */
        return result;
    }
    /**
     * Raises `PageLayout` event if needed.
     * @private
     */
    private getLayoutResult(pageResult : TextPageLayoutResult) : PdfTextLayoutResult {
        let result : PdfTextLayoutResult = new PdfTextLayoutResult(pageResult.page, pageResult.bounds, pageResult.remainder,
                                                                   pageResult.lastLineBounds);
        return result;
    }
    /* tslint:disable */
    /**
     * `Layouts` the text on the page.
     * @private
     */
    private layoutOnPage(text : string, currentPage : PdfPage, currentBounds : RectangleF,
                         param : PdfLayoutParams) : TextPageLayoutResult {
        let result : TextPageLayoutResult = new TextPageLayoutResult();
        result.remainder = text;
        result.page = currentPage;
        currentBounds = this.checkCorrectBounds(currentPage, currentBounds);
        let layouter : PdfStringLayouter = new PdfStringLayouter();
        let stringResult : PdfStringLayoutResult = layouter.layout(text, this.element.font, this.format, currentBounds, currentPage.getClientSize().height, false, new SizeF(0, 0));
        let textFinished : boolean = (stringResult.remainder == null);
        let doesntFit : boolean = (param.format.break === PdfLayoutBreakType.FitElement);
        let canDraw : boolean = !(doesntFit || stringResult.empty);
        // Draw the text.
        let graphics : PdfGraphics = currentPage.graphics;
        let brush : PdfSolidBrush = this.element.getBrush() as PdfSolidBrush;
        if (this.element instanceof PdfTextWebLink) {
            brush.color = new PdfColor(0, 0, 255);
        }
        graphics.drawStringLayoutResult(stringResult, this.element.font, this.element.pen, brush,
                                        currentBounds, this.format);
        let lineInfo : LineInfo = stringResult.lines[stringResult.lineCount - 1];
        result.lastLineBounds = graphics.getLineBounds(stringResult.lineCount - 1, stringResult, this.element.font,
                                                        currentBounds, this.format);
        result.bounds = this.getTextPageBounds(currentPage, currentBounds, stringResult);
        result.remainder = stringResult.remainder;
        result.end = (textFinished);
        return result;
    }
    /* tslint:enable */
    /**
     * `Corrects current bounds` on the page.
     * @private
     */
    private checkCorrectBounds(currentPage : PdfPage, currentBounds : RectangleF) : RectangleF {
        let pageSize : SizeF = currentPage.graphics.clientSize;
        currentBounds.height = (currentBounds.height > 0) ? currentBounds.height : pageSize.height - currentBounds.y;
        return currentBounds;
    }
    /**
     * Returns a `rectangle` where the text was printed on the page.
     * @private
     */
    /* tslint:disable */
    private getTextPageBounds(currentPage : PdfPage, currentBounds : RectangleF,
                              stringResult : PdfStringLayoutResult) : RectangleF {
        let textSize : SizeF = stringResult.actualSize;
        let x : number = currentBounds.x;
        let y : number = currentBounds.y;
        let width : number = (currentBounds.width > 0) ? currentBounds.width : textSize.width;
        let height : number = textSize.height;
        let shiftedRect : RectangleF = currentPage.graphics.checkCorrectLayoutRectangle(textSize,
                                                                                             currentBounds.x,
                                                                                             currentBounds.y,
                                                                                             this.format);
        // if (currentBounds.width <= 0) {
        x = shiftedRect.x;
        // }
        let verticalShift : number = currentPage.graphics.getTextVerticalAlignShift(textSize.height, currentBounds.height, this.format);
        y += verticalShift;
        let bounds : RectangleF = new RectangleF(x, y, width, height);
        return bounds;
    }
    /* tslint:enable */
}
export class TextPageLayoutResult {
    /**
     * The last `page` where the text was drawn.
     * @private
     */
    public page : PdfPage;
    /**
     * The `bounds` of the element on the last page where it was drawn.
     * @private
     */
    public bounds : RectangleF;
    /**
     * Indicates whether the lay outing has been finished [`end`].
     * @private
     */
    public end : boolean;
    /**
     * The `text` that was not printed.
     * @private
     */
    public remainder : string;
    /**
     * Gets or sets a `bounds` of the last text line that was printed.
     * @private
     */
    public lastLineBounds : RectangleF;
}
export class PdfTextLayoutResult extends PdfLayoutResult {
    // Fields
    /**
     * The `text` that was not printed.
     * @private
     */
    private remainderText : string;
    /**
     * The `bounds` of the last line that was printed.
     * @private
     */
    private lastLineTextBounds : RectangleF;
    // Properties
    /**
     * Gets a value that contains the `text` that was not printed.
     * @private
     */
    public get remainder() : string {
        return this.remainderText;
    }
    /**
     * Gets a value that indicates the `bounds` of the last line that was printed on the page.
     * @private
     */
    public get lastLineBounds() : RectangleF {
        return this.lastLineTextBounds;
    }
    // Constructors
    /**
     * Initializes the new instance of `PdfTextLayoutResult` class.
     * @private
     */
    public constructor(page : PdfPage, bounds : RectangleF, remainder : string, lastLineBounds : RectangleF) {
        super(page, bounds);
        this.remainderText = remainder;
        this.lastLineTextBounds = lastLineBounds;
    }
}