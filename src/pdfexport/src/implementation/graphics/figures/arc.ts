/**
 * arc.ts class for EJ2-PDF
 */
import { PdfPen } from './../pdf-pen';
import { PdfLayoutResult, PdfLayoutFormat } from './../figures/base/element-layouter';
import { PdfGraphics } from './../pdf-graphics';
import { RectangleF, PointF } from './../../drawing/pdf-drawing';
import { PdfPage } from './../../pages/pdf-page';
import { PdfEllipsePart } from './../figures/ellipse-part';
/**
 * `PdfArc` class Implements graphics arc, which is a sequence of primitive graphics elements.
 * @private
 */
export class PdfArc extends PdfEllipsePart {
    // Constructor
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor ()
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (pen: PdfPen, rectangle: RectangleF, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (pen: PdfPen, x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (pen: PdfPen, width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfArc` class.
     * @public
     */
    public constructor (rectangle: RectangleF, startAngle: number, sweepAngle: number)
    /* tslint:disable-next-line:max-line-length */
    public constructor (arg1?: PdfPen|number|RectangleF, arg2?: number|RectangleF, arg3?: number, arg4?: number, arg5?: number, arg6?: number, arg7?: number) {
        if (typeof arg1 === 'undefined') {
            super();
        } else if (arg1 instanceof RectangleF) {
            super(arg1, arg2 as number, arg3 as number);
        } else if (arg1 instanceof PdfPen) {
            if (arg2 instanceof RectangleF) {
                super(arg1, null, arg2 , arg3, arg4);
            } else if (typeof arg6 === 'undefined' && typeof arg7 === 'undefined') {
                super(arg1, null, 0 , 0, arg2 as number, arg3 as number, arg4 as number, arg5 as number);
            } else if (typeof arg6 !== 'undefined' && typeof arg7 !== 'undefined') {
                super(arg1, null, arg2 as number, arg3 as number, arg4 as number, arg5 as number, arg6 as number, arg7 as number);
            }
        } else if (typeof arg1 !== 'undefined' && typeof arg5 === 'undefined' && typeof arg6 === 'undefined') {
            super(0, 0, arg1 as number, arg2 as number, arg3 as number, arg4 as number);
        } else if (typeof arg1 !== 'undefined' && typeof arg5 !== 'undefined' && typeof arg6 !== 'undefined') {
            super(arg1 as number, arg2 as number, arg3 as number, arg4 as number,  arg5 as number, arg6 as number);
        }
    }
    // Public methods
    /**
     * `draw` the element on the page with the specified page and 'PointF' class
     * @param page Current page where the element should be drawn.
     * @param location Start location on the page.
     */
    public draw(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page and pair of coordinates
     * @private
     */
    public draw(page : PdfPage, x : number, y : number) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page and 'RectangleF' class
     * @private
     */
    public draw(page : PdfPage, layoutRectangle : RectangleF) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page, 'PointF' class and layout format
     * @private
     */
    public draw(page : PdfPage, location : PointF, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page, pair of coordinates and layout format
     * @private
     */
    public draw(page : PdfPage, x : number, y : number, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `draw` the element on the page.
     * @private
     */
    public draw(page : PdfPage, layoutRect : RectangleF, format : PdfLayoutFormat) : PdfLayoutResult
    public draw(argu1 : PdfPage, arg2 : RectangleF|PointF|number, arg3 ?: PdfLayoutFormat|number,
                arg4 ?: PdfLayoutFormat) : PdfLayoutResult {
        if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(argu1, arg2.x, arg2.y);
        } else if (arg2 instanceof RectangleF && typeof (arg2 as RectangleF).width !== 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(argu1, arg2, null);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            return this.drawHelper(argu1, arg2, arg3, null);
        } else if (arg2 instanceof PointF && arg3 instanceof PdfLayoutFormat) {
            return this.drawHelper(argu1, arg2.x, arg2.y, arg3);
        } else if (typeof arg2 === 'number' && (arg4 instanceof PdfLayoutFormat || arg4 == null) && typeof arg3 === 'number') {
            let widthValue : number = (argu1.graphics.clientSize.width - arg2);
            let layoutRect : RectangleF = new RectangleF(arg2, arg3, widthValue, 0);
            return this.drawHelper(argu1, layoutRect, arg4);
        } else {
            return this.drawHelper(argu1, arg2 as RectangleF, arg3 as PdfLayoutFormat);
        }
    }
    // Implementation
    /**
     * `drawInternal` Draws an element on the Graphics.
     * @param graphics Graphics context where the element should be printed.
     * 
     */
    public drawInternal(graphics: PdfGraphics) : void {
        if ((graphics == null)) {
            throw new Error ('ArgumentNullException : graphics');
        }
        graphics.drawArc(this.obtainPen(), this.bounds, this.startAngle, this.sweepAngle);
    }
}