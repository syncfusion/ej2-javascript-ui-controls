import { RectangleF } from './../drawing/pdf-drawing';
import { PdfAction } from './../actions/action';
import { PdfLinkAnnotation } from './link-annotation';
/**
 * Represents base class for `link annotations` with associated action.
 * @private
 */
export abstract class PdfActionLinkAnnotation extends PdfLinkAnnotation {
    // Fields
    /**
     * Internal variable to store annotation's `action`.
     * @default null
     * @private
     */
    private pdfAction : PdfAction = null;
    // Properties
    /**
     * Internal variable to store annotation's `Action`.
     * @private
     */
    public abstract get action() : PdfAction;
    public abstract set action(value : PdfAction);
    // Constructors
    /**
     * Specifies the constructor for `ActionLinkAnnotation`.
     * @private
     */
    public constructor(rectangle : RectangleF) {
        super(rectangle);
    }
    //Public method
    /**
     * get and set the `action`.
     * @hidden
     */
    public getSetAction(value ?: PdfAction) : PdfAction|void {
        if (typeof value === 'undefined') {
            return this.pdfAction;
        } else {
            this.pdfAction = value;
        }
    }
}