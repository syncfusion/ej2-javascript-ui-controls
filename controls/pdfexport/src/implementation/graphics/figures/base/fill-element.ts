/**
 * PdfFillElement.ts class for EJ2-PDF
 */
import { PdfDrawElement } from './draw-element';
import { PdfPen } from './../../pdf-pen';
import { PdfBrush } from './../../brushes/pdf-brush';
import {PdfColor} from './../../pdf-color';
/**
 * Represents a base class for all page graphics elements.
 */
export abstract class PdfFillElement extends PdfDrawElement {
    // Fields
    /**
     * Internal variable to store pen.
     * @private
     */
    private mbrush : PdfBrush = null;
    // Constructor
    /**
     * Initializes a new instance of the `PdfFillElement` class.
     * @protected
     */
    protected constructor()
    /**
     * Initializes a new instance of the `PdfFillElement` class.
     * @protected
     */
    protected constructor(pen: PdfPen)
    /**
     * Initializes a new instance of the `PdfFillElement` class.
     * @protected
     */
    protected constructor(brush: PdfBrush)
    /**
     * Initializes a new instance of the `PdfFillElement` class.
     * @protected
     */
    protected constructor(pen: PdfPen, brush: PdfBrush)
    /**
     * Initializes a new instance of the `PdfFillElement` class.
     * @protected
     */
    protected constructor(arg1 ?: PdfPen|PdfBrush, arg2 ?: PdfBrush) {
        super();
        if (typeof arg1 === 'undefined') {
            //
        } else if (arg1 instanceof PdfPen) {
            super(arg1);
        } else {
            this.mbrush = arg2;
        }
    }
    // Properties
    /**
     * Gets or sets a brush of the element.
     * @public
     */
    public get brush(): PdfBrush {
        return this.mbrush;
    }
    public set brush(value: PdfBrush) {
        this.mbrush = value;
    }
    // Implementation
    /**
     * Gets the pen. If both pen and brush are not explicitly defined, default pen will be used.
     * @protected
     */
    protected obtainPen(): PdfPen {
        return ((this.mbrush == null) && (this.pen == null)) ? new PdfPen(new PdfColor(0, 0, 0)) : this.pen;
    }
}