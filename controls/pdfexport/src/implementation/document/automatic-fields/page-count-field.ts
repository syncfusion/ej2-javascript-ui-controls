/**
 * PdfPageCountField.ts class for EJ2-PDF
 */
import { PdfSingleValueField } from './single-value-field';
import { PdfNumberStyle } from './../../pages/enum';
import { PdfFont } from './../../graphics/fonts/pdf-font';
import { PdfBrush } from './../../graphics/brushes/pdf-brush';
import { RectangleF } from './../../drawing/pdf-drawing';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { PdfPage } from './../../pages/pdf-page';
import { PdfDocument } from './../pdf-document';
import { PdfNumbersConvertor } from './pdf-numbers-convertor';
/**
 * Represents total PDF document page count automatic field.
 */
export class PdfPageCountField extends PdfSingleValueField {
    // Fields
    /**
     * Stores the number style of the field.
     * @private
     */
    private  internalNumberStyle : PdfNumberStyle = PdfNumberStyle.Numeric;
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
    // Properties
    /**
     * Gets and sets the number style of the field.
     * @public
     */
    public get numberStyle() : PdfNumberStyle {
        return this.internalNumberStyle;
    }
    public set numberStyle(value : PdfNumberStyle) {
        this.internalNumberStyle = value;
    }
    // Implementation
    /**
     * Return the actual value of the content to drawn.
     * @public
     */
    public getValue(graphics : PdfGraphics) : string {
        let result : string = null;
        let page : PdfPage = this.getPageFromGraphics(graphics);
        let document : PdfDocument = page.section.parent.document;
        let count : number = document.pages.count;
        result = PdfNumbersConvertor.convert(count, this.numberStyle);
        return result;
    }
}