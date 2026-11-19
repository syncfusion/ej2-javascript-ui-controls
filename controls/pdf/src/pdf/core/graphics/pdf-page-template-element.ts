import { PdfTemplate } from './pdf-template';
import { PdfGraphics } from './pdf-graphics';
import { Rectangle, Size } from './../pdf-document-helper';
import { PdfPage } from './../pdf-page';
/**
 * Represents a template element for creating and rendering header and footer content in a PDF document.
 *
 * ```typescript
 * // Create a new document
 * let document: PdfDocument = new PdfDocument();
 * // Create a header template
 * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 500, height: 50 });
 * // Get the graphics of the template
 * let graphics: PdfGraphics = headerTemplate.graphics;
 * // Draw content on header
 * graphics.drawString('Document Header', font, {x: 10, y: 10, width: 550, height: 30}, brush);
 * // Assign to document
 * document.template.top = {template: headerTemplate, alignment: PdfTemplateHorizontalAlignment.center};
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPageTemplateElement {
    /**
     * Internal PdfTemplate backing storage.
     *
     * @private
     */
    _template: PdfTemplate;
    /**
     * Bounds of the template element.
     *
     * @private
     */
    _bounds: Rectangle;
    /**
     * Associated page context.
     *
     * @private
     */
    private _page: PdfPage;
    /**
     * Initializes a new instance of the page template element with the specified size.
     *
     * ```typescript
     * // Create a new document
     * let document: PdfDocument = new PdfDocument();
     * // Create a header template with size
     * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({width: 500, height: 50});
     * // Draw content on header
     * headerTemplate.graphics.drawString('Header', font, {x: 10, y: 10, width: 550, height: 30}, brush);
     * // Assign to document
     * document.template.top = {template: headerTemplate, alignment: PdfTemplateHorizontalAlignment.center };
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Size} size The size of the template element.
     */
    public constructor(size: Size) {
        this._bounds = {x: 0, y: 0 , width: size.width, height: size.height};
    }
    /**
     * Gets the graphics surface to draw template content.
     *
     * ```typescript
     * // Create a new document
     * let document: PdfDocument = new PdfDocument();
     * // Create a header template
     * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 500, height: 50 });
     * // Get the graphics of the template
     * let graphics: PdfGraphics = headerTemplate.graphics;
     * // Draw content on header
     * graphics.drawString('Document Header', font, {x: 10, y: 10, width: 550, height: 30}, brush);
     * // Assign to document
     * document.template.top = {template: headerTemplate, alignment: PdfTemplateHorizontalAlignment.center};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfGraphics} The graphics of the template.
     */
    get graphics(): PdfGraphics {
        if (!this._template) {
            this._template = new PdfTemplate(this._bounds, this._page ? this._page._crossReference : undefined);
        }
        return this._template.graphics;
    }
    /**
     * Draws the template content onto the specified page graphics at the * This method renders the internal template, if available, onto the provided * Draws the template content onto the specified page graphics at the given position.
     * graphics context using the specified coordinates and dimensions.
     *
     * @private
     * @param {PdfGraphics} pageGraphics The page graphics context to draw onto.
     * @param {number} x The x-coordinate where the template should be drawn.
     * @param {number} y The y-coordinate where the template should be drawn.
     * @param {number} width The width to use when drawing the template.
     * @param {number} height The height to use when drawing the template.
     * @returns {void} This method does not return a value.
     */
    _draw(pageGraphics: PdfGraphics, x: number, y: number, width: number, height: number): void {
        if (this._template) {
            pageGraphics.drawTemplate(this._template, {
                x,
                y,
                width: width,
                height: height
            });
        }
    }
}
