/**
 * PdfShapeElement.ts class for EJ2-PDF
 * @private
 */
import { PdfLayoutResult, PdfLayoutParams } from './element-layouter';
import { RectangleF, PointF } from './../../../drawing/pdf-drawing';
import { PdfLayoutElement } from './../layout-element';
import { ShapeLayouter } from './shape-layouter';
import { PdfGraphics, PdfGraphicsState } from './../../pdf-graphics';
/**
 * Base class for the main shapes.
 * @private
 */
export abstract class PdfShapeElement extends PdfLayoutElement {
    // methods
    /**
     * Gets the bounds.
     * @private
     */
    public getBounds() : RectangleF {
        let rect : RectangleF = this.getBoundsInternal();
        return rect;
    }
    /**
     * `drawGraphicsHelper` the graphics.
     * @public
     */
    public drawGraphicsHelper(graphics: PdfGraphics, location: PointF) : void {
        if ((graphics == null)) {
            throw new Error('ArgumentNullException :graphics');
        }
        this.drawShapeHelper(graphics, location.x, location.y);
    }
    /**
     * `drawShapeHelper` the graphics.
     * @private
     */
    private drawShapeHelper(graphics : PdfGraphics, x : number, y : number) : void {
        let bNeedSave : boolean = (x !== 0.5 || y !== 0.5);
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
    // Implementation
    protected abstract drawInternal(graphics : PdfGraphics) : void;
    /**
     * Returns a rectangle that bounds this element.
     * @private
     */
    protected abstract getBoundsInternal() : RectangleF;
    /**
     * Layouts the element.
     * @private
     */
    protected layout(param : PdfLayoutParams) : PdfLayoutResult {
        let layouter : ShapeLayouter = new ShapeLayouter(this);
        let result : PdfLayoutResult = layouter.layout(param);
        return result;
    }
}