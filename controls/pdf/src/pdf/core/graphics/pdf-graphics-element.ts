import { Point, Rectangle } from '../pdf-document-helper';
import { PdfGraphics, PdfGraphicsState } from './pdf-graphics';
/**
 * Represents an abstract class for elements that can be rendered graphically.
 *
 * ```typescript
 * // Create a new document.
 * const document: PdfDocument = new PdfDocument();
 * // Add a new page to document
 * const page: PdfPage = document.addPage();
 * // Create a page template with specified size.
 * const template: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 100, height: 50 });
 * // Initialize a standard font.
 * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
 * // Create a solid brush for drawing text.
 * const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
 * // Create a graphic element field with the configured font and brush.
 * const dateField: PdfGraphicsElement = new PdfDateTimeField({ font: font, brush: brush });
 * // Render the date field onto the template at an offset.
 * dateField.draw(template.graphics, { x: 20, y: 20 });
 * // Assign the template to the document bottom with center alignment.
 * document.template.bottom = {template: template, alignment: PdfTemplateHorizontalAlignment.center};
 * // Save the document.
 * document.save('output.pdf');
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export abstract class PdfGraphicsElement {
    /**
     * The bounds that define the layout area for this graphics element.
     *
     * @private
     */
    _bounds: Rectangle;
    /**
     * Renders the element at the specified location on the given `PdfGraphics` surface.
     *
     * ```typescript
     * // Create a new document.
     * const document: PdfDocument = new PdfDocument();
     * // Add a new page to document
     * const page: PdfPage = document.addPage();
     * // Create a page template with specified size.
     * const template: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 100, height: 50 });
     * // Initialize a standard font.
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
     * // Create a solid brush for drawing text.
     * const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
     * // Create a date-time field with the configured font and brush.
     * const dateField: PdfGraphicsElement = new PdfDateTimeField({ font: font, brush: brush });
     * // Render the date field onto the template at an offset.
     * dateField.draw(template.graphics, { x: 20, y: 20 });
     * // Assign the template to the document bottom with center alignment.
     * document.template.bottom = {template: template, alignment: PdfTemplateHorizontalAlignment.center};
     * // Save the document.
     * document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {PdfGraphics} graphics The graphics surface to render on.
     * @param {Point} location The position for rendering.
     * @returns {void} This method does not return a value.
     */
    public draw(graphics: PdfGraphics, location: Point): void {
        this._draw(graphics, location);
    }
    /**
     * Draws the element using the provided graphics context and location.
     *
     * This method is intended for internal use and should not be called directly.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context used for rendering.
     * @param {Point} location The location at which the element should be drawn.
     * @returns {void} This method does not return a value.
     */
    _draw(graphics: PdfGraphics, location: Point): void {
        this._bounds.x = location.x;
        this._bounds.y = location.y;
        const state: PdfGraphicsState = graphics.save();
        try {
            if (location) {
                graphics.translateTransform(location);
            }
            this._drawInternal(graphics);
        } finally {
            graphics.restore(state);
        }
    }
    /**
     * Renders the element's visual content into the provided `PdfGraphics`.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context to draw into.
     * @returns {void}
     */
    abstract _drawInternal(graphics: PdfGraphics): void;
}
