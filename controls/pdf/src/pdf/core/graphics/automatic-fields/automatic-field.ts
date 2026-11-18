import { PdfFont, PdfFontFamily, PdfStandardFont } from '../../fonts/pdf-standard-font';
import { PdfStringFormat } from '../../fonts/pdf-string-format';
import { Point, Size } from '../../pdf-document-helper';
import { PdfBrush, PdfGraphics } from '../pdf-graphics';
import { PdfGraphicsElement } from '../pdf-graphics-element';
/**
 * Represents an abstract base class for all automatic fields.
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
 * // Create an automatic field  with the configured font and brush.
 * const dateField: PdfAutomaticField = new PdfDateTimeField({ font: font, brush: brush });
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
export abstract class PdfAutomaticField extends PdfGraphicsElement {
    /**
     * Font used to render the field's text.
     *
     * @private
     */
    _font: PdfFont;
    /**
     * Brush used to render the field text.
     *
     * @private
     */
    _brush: PdfBrush;
    /**
     * Optional string format used for measurement/rendering.
     *
     * @private
     */
    _stringFormat: PdfStringFormat;
    /**
     * Specifies the size of the automatic field when rendered.
     *
     * @private
     */
    _size: Size;
    /**
     * Initializes the base properties of the automatic field such as font, brush, and string format.
     *
     * @param {PdfFont} [font] The font used to render the field text.
     * @param {PdfBrush} [brush] The brush used to draw the field text.
     * @param {PdfStringFormat} [stringFormat] The string format used for layout and rendering.
     * @returns {void} This method does not return a value.
     * @private
     */
    _initializeBase(font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat): void {
        if (font !== null && typeof font !== 'undefined') {
            this._font = font;
        }
        if (brush !== null && typeof brush !== 'undefined') {
            this._brush = brush;
        }
        if (stringFormat !== null && typeof stringFormat !== 'undefined') {
            this._stringFormat = stringFormat;
        }
    }
    /**
     * Draws the automatic field onto the graphics context.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @returns {void} Nothing.
     */
    _draw(graphics: PdfGraphics): void;
    /**
     * Draws the automatic field at a specific location.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Point} location The position to draw at.
     * @returns {void} Nothing.
     */
    _draw(graphics: PdfGraphics, location: Point): void;
    _draw(graphics: PdfGraphics, location?: Point): void {
        this._performDraw(graphics, location);
    }
    /**
     * Performs the actual drawing with scaling support.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Point} location The drawing location.
     * @returns {void} Nothing.
     */
    _performDraw(graphics: PdfGraphics, location: Point): void { // eslint-disable-line
        if (!this._bounds || this._bounds.width === 0 || this._bounds.height === 0) {
            const value: string = this._getValue(graphics);
            const font: PdfFont = this._obtainFont();
            const format: PdfStringFormat = this._stringFormat ? this._stringFormat : new PdfStringFormat();
            const size: Size = font.measureString(value, format);
            this._size = {width: size.width, height: size.height};
        }
    }
    /**
     * Resolves the effective size of the field.
     *
     * @private
     * @returns {Size} The field size.
     */
    _obtainSize(): Size {
        let width: number = 0;
        let height: number = 0;
        if (this._bounds && typeof this._bounds.width !== 'undefined') {
            width = this._bounds.width;
        } else if (this._size && typeof this._size.width !== 'undefined') {
            width = this._size.width;
        }
        if (this._bounds && typeof this._bounds.height !== 'undefined') {
            height = this._bounds.height;
        } else if (this._size && typeof this._size.height !== 'undefined') {
            height = this._size.height;
        }
        return { width: width, height: height };
    }
    /**
     * Core rendering implementation.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @returns {void} Nothing.
     */
    _drawInternal(graphics: PdfGraphics): void {
        const value: string = this._getValue(graphics);
        const font: PdfFont = this._obtainFont();
        const brush: PdfBrush = this._obtainBrush();
        const size: Size = this._obtainSize();
        graphics.drawString(value, font, {x: this._bounds.x, y: this._bounds.y, width: size.width, height: size.height}, brush );
    }
    /**
     * Resolves the effective brush for rendering.
     *
     * @private
     * @returns {PdfBrush} The brush to use.
     */
    _obtainBrush(): PdfBrush {
        if (this._brush) {
            return this._brush;
        }
        return new PdfBrush({ r: 0, g: 0, b: 0 });
    }
    /**
     * Resolves the effective font for rendering.
     *
     * @private
     * @returns {PdfFont} The font to use.
     */
    _obtainFont(): PdfFont {
        if (this._font) {
            return this._font;
        } else {
            return new PdfStandardFont(PdfFontFamily.helvetica, 8);
        }
    }
    /**
     * Computes the field value dynamically.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context for value resolution.
     * @returns {string} The computed value.
     */
    abstract _getValue(graphics: PdfGraphics): string;
}
