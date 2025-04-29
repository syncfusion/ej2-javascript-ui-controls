/**
 * PdfDrawElement.ts class for EJ2-PDF
 */
import { PdfShapeElement } from './pdf-shape-element';
import { PdfPen } from './../../pdf-pen';
import { PdfColor } from './../../pdf-color';
/**
 * Represents a base class for all page graphics elements.
 */
export abstract class PdfDrawElement extends PdfShapeElement {
    // Fields
    /**
     * Internal variable to store pen.
     * @private
     */
    private mpen: PdfPen;
    // Constructor
    /**
     * Initializes a new instance of the `PdfDrawElement` class.
     * @protected
     */
    protected constructor ()
    /**
     * Initializes a new instance of the `PdfDrawElement` class.
     * @protected
     */
    protected constructor(pen : PdfPen)
    /**
     * Initializes a new instance of the `PdfDrawElement` class.
     * @protected
     */
    protected constructor(pen ?: PdfPen) {
        super();
        if (typeof pen !== 'undefined') {
            this.mpen = pen;
        }
    }
    // Properties
    /**
     * Gets or sets a pen that will be used to draw the element.
     * @public
     */
    public get pen(): PdfPen {
        return this.mpen;
    }
    public set pen(value: PdfPen)  {
        this.mpen = value;
    }
    // Implementation
    /**
     * Gets the pen. If both pen and brush are not explicitly defined, default pen will be used.
     * @protected
     */
    /*
    protected obtainPen(): PdfPen {
        return (this.mpen == null) ? new PdfPen(new PdfColor(0, 0, 0)) : this.mpen;
    }
    */
}
