/**
 * PdfGraphicsElement.ts class for EJ2-PDF
 */
import { PdfGraphics, PdfGraphicsState } from './../../pdf-graphics';
/**
 * Represents a base class for all page graphics elements.
 */
export abstract class PdfGraphicsElement {
    // Constructors
    protected constructor() {
        //
    }
    /**
     * `Draws` the page number field.
     * @public
     */
    public drawHelper(graphics : PdfGraphics, x : number, y : number) : void {
            let bNeedSave : boolean = (x !== 0 || y !== 0);
            let gState : PdfGraphicsState = null;
            // Translate co-ordinates.
            if (bNeedSave) {
                // Save state.
                gState = graphics.save();
                graphics.translateTransform((x as number), y);
            }
            this.drawInternal(graphics);
            if (bNeedSave) {
                // Restore state.
                graphics.restore(gState);
            }
    }
    // implementation
    protected abstract drawInternal(graphics : PdfGraphics) : void;
}