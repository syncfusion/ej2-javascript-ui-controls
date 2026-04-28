/**
 * PdfPageNumberField.ts class for EJ2-PDF
 */
import { PdfFont } from './../../graphics/fonts/pdf-font';
import { PdfBrush } from './../../graphics/brushes/pdf-brush';
import { PdfPage } from './../../pages/pdf-page';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { PdfDocument } from './../pdf-document';
import { RectangleF } from './../../drawing/pdf-drawing';
import { PdfNumberStyle } from './../../pages/enum';
import { PdfNumbersConvertor } from './pdf-numbers-convertor';
import { PdfMultipleValueField } from './multiple-value-field';
/**
 * Represents PDF document `page number field`.
 * @public
 */
export class PdfPageNumberField extends  PdfMultipleValueField {
    // Constructors
    /**
     * Initialize a new instance for page number field.
     * @public
     */
    public constructor(font : PdfFont)
    /**
     * Initialize a new instance for page number field.
     * @public
     */
    public constructor(font : PdfFont, bounds : RectangleF)
    /**
     * Initialize a new instance for page number field.
     * @public
     */
    public constructor(font : PdfFont, brush: PdfBrush)
    public constructor(font : PdfFont, arg2 ?: RectangleF|PdfBrush) {
        super();
        if (typeof arg2 === 'undefined') {
            this.font = font;
        } else if ( arg2 instanceof PdfBrush) {
            this.font = font;
            this.brush = arg2;
        } else {
            this.font = font;
            this.bounds = arg2;
        }
    }
    // Fields
    /**
     * Stores the number style of the page number field.
     * @private
     */
    private internalNumberStyle : PdfNumberStyle = PdfNumberStyle.Numeric;
    // Properties
    /**
     * Gets and sets the number style of the page number field.
     * @private
     */
    public get numberStyle() : PdfNumberStyle {
        return this.internalNumberStyle;
    }
    public set numberStyle(value : PdfNumberStyle) {
        this.internalNumberStyle = value;
    }
    /**
     * Return the `string` value of page number field.
     * @public
     */
    public getValue(graphics : PdfGraphics) : string {
        let result : string = null;
        let page : PdfPage = this.getPageFromGraphics(graphics);
        result = this.internalGetValue(page);
        return result;
    }
    /**
     * Internal method to `get actual value of page number`.
     * @private
     */
    protected internalGetValue(page : PdfPage) : string {
        let document : PdfDocument = page.document;
        let pageIndex : number = document.pages.indexOf(page) + 1;
        return PdfNumbersConvertor.convert(pageIndex, this.numberStyle);
    }
}