/**
 * RectangleArea.ts class for EJ2-PDF
 */
import { PdfBrush } from './../brushes/pdf-brush';
import { PdfPen } from './../pdf-pen';
import { RectangleF } from './../../drawing/pdf-drawing';
import { PdfFillElement} from './../figures/base/fill-element';
/**
 * `PdfRectangleArea` class Implements graphics rectangle area, which is a sequence of primitive graphics elements.
 * @private
 */
export abstract class PdfRectangleArea extends PdfFillElement {
    //Fields
    /**
     * public variable to store the rectangle.
     * @public
     */
    public bounds : RectangleF = new RectangleF( 0, 0, 0, 0);
    //Constructor
    /**
     * Initializes a new instance of the `PdfRectangleArea` class.
     * @protected
     */
    protected constructor ()
    /**
     * Initializes a new instance of the `PdfRectangleArea` class.
     * @protected
     */
    protected constructor (rectangle: RectangleF)
    /**
     * Initializes a new instance of the `PdfRectangleArea` class.
     * @protected
     */
    protected constructor (pen: PdfPen, brush: PdfBrush, rectangle: RectangleF)
    /**
     * Initializes a new instance of the `PdfRectangleArea` class.
     * @protected
     */
    protected constructor (x: number, y: number, width: number, height: number)
    /**
     * Initializes a new instance of the `PdfRectangleArea` class.
     * @protected
     */
    protected constructor (pen: PdfPen, brush: PdfBrush, x: number, y: number, width: number, height: number)
    /* tslint:disable-next-line:max-line-length */
    protected constructor (arg1?: PdfPen|number|RectangleF , arg2?: PdfBrush|number, arg3?: number|RectangleF, arg4?: number, arg5?: number, arg6?: number) {
        super();
        if (typeof arg1 === 'undefined') {
            //
        } else if (arg1 instanceof PdfPen) {
            super(arg1, arg2 as PdfBrush);
            if (arg3 instanceof RectangleF) {
                this.bounds = arg3;
            } else {
                this.bounds = new RectangleF(arg3, arg4, arg5, arg6);
            }
        } else if (arg1 instanceof RectangleF) {
            this.bounds = arg1;
        } else {
            this.bounds = new RectangleF(arg1 as number, arg2 as number, arg3 as number, arg4 as number);
        }
    }
    //Properties
    /**
     * Gets or sets the X co-ordinate of the upper-left corner of this the element.
     * @public
     */
    public get x(): number {
        return this.bounds.x;
    }
    public set x(value: number) {
        this.bounds.x = value;
    }
    /**
     * Gets or sets the Y co-ordinate of the upper-left corner of this the element.
     * @public
     */
    public get y(): number {
        return this.bounds.y;
    }
    public set y(value: number) {
        this.bounds.y = value;
    }
    /**
     * Gets or sets the width of this element.
     * @public
     */
    public get width(): number {
        return this.bounds.width;
    }
    public set width(value: number) {
        this.bounds.width = value;
    }
    /**
     * Gets or sets the height of this element.
     * @public
     */
    public get height(): number {
        return this.bounds.height;
    }
    public set height(value: number) {
        this.bounds.height = value;
    }
    //Implementation
    protected getBoundsInternal(): RectangleF {
        return this.bounds;
    }
}