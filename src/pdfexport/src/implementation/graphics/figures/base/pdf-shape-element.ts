/**
 * PdfShapeElement.ts class for EJ2-PDF
 * @private
 */
import { PdfLayoutResult, PdfLayoutParams } from './element-layouter';
import { RectangleF } from './../../../drawing/pdf-drawing';
import { PdfLayoutElement } from './../layout-element';
import { ShapeLayouter } from './shape-layouter';
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
    // Implementation
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
        if (param == null) {
            throw Error('ArgumentNullException-param');
        }
        let layouter : ShapeLayouter = new ShapeLayouter(this);
        let result : PdfLayoutResult = layouter.layout(param);
        return result;
    }
}