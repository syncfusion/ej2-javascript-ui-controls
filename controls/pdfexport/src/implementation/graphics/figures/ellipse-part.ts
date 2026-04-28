/**
 * ellipse-part.ts class for EJ2-PDF
 */
import { PdfBrush } from './../brushes/pdf-brush';
import { PdfPen } from './../pdf-pen';
import { RectangleF } from './../../drawing/pdf-drawing';
import { PdfRectangleArea } from './rectangle-area';
/**
 * `PdfEllipsePart` class Implements graphics ellipse part, which is a sequence of primitive graphics elements.
 * @private
 */
export abstract class PdfEllipsePart extends PdfRectangleArea {
    // Fields
    /**
     * public variable to store the start angle.
     * @public
     */
    public startAngle: number = 0;
    /**
     * public variable to store the sweep angle.
     * @public
     */
    public sweepAngle: number = 0;
    // Constructor
    /**
     * Initializes a new instance of the `PdfEllipsePart` class.
     * @protected
     */
    protected constructor ()
    /**
     * Initializes a new instance of the `PdfEllipsePart` class.
     * @protected
     */
    protected constructor (x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfEllipsePart` class.
     * @protected
     */
    protected constructor (rectangle: RectangleF, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfEllipsePart` class.
     * @protected
     */
    /* tslint:disable-next-line:max-line-length */
    protected constructor (pen: PdfPen, brush: PdfBrush, x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number)
    /**
     * Initializes a new instance of the `PdfEllipsePart` class.
     * @protected
     */
    protected constructor (pen: PdfPen, brush: PdfBrush, rectangle: RectangleF, startAngle: number, sweepAngle: number)
    /* tslint:disable-next-line:max-line-length */
    protected constructor (arg1?: PdfPen|RectangleF|number, arg2?: PdfBrush|number, arg3?: number|RectangleF, arg4?: number, arg5?: number, arg6?: number, arg7?: number, arg8?: number) {
    super();
    if ( typeof arg1 === 'undefined') {
    //
    } else if (arg1 instanceof RectangleF && typeof arg2 !== 'undefined' && typeof arg3 !== 'undefined') {
        super(arg1);
        this.startAngle = arg2 as number;
        this.sweepAngle = arg3 as number;
    } else if (arg1 instanceof PdfPen) {
        if (arg3 instanceof RectangleF) {
            super(arg1, arg2 as PdfBrush, arg3);
            this.startAngle = arg4 as number;
            this.sweepAngle = arg5 as number;
        } else {
            super(arg1, arg2 as PdfBrush, arg3, arg4, arg5, arg6);
            this.startAngle = arg7 as number;
            this.sweepAngle = arg8 as number;
        }
    } else {
        super(arg1 as number, arg2 as number, arg3 as number, arg4 as number);
        this.startAngle = arg5 as number;
        this.sweepAngle = arg6 as number;
    }
}
}