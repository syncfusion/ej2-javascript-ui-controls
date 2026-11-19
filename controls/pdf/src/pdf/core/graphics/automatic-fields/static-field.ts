import { PdfFont, PdfStringFormat } from '../../fonts';
import { Point, Size, Rectangle } from '../../pdf-document-helper';
import { PdfBrush, PdfGraphics } from '../pdf-graphics';
import { PdfTemplate } from '../pdf-template';
import { PdfAutomaticField } from './automatic-field';
/**
 * Represents an abstract class for static field.
 *
 * ```typescript
 * // Create a new document.
 * const document: PdfDocument = new PdfDocument();
 * // Add new page to document.
 * const page: PdfPage = document.addPage();
 * // Initialize standard font.
 * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
 * // Initialize solid brush.
 * const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
 * // Create a static date-time field.
 * const dateField: PdfStaticField = new PdfDateTimeField({ font: font, brush: brush });
 * // Render the static field inside the template.
 * dateField.draw(page.graphics, { x: 20, y: 20 });
 * // Save the document.
 * document.save('Output.pdf');
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export class PdfStaticField extends PdfAutomaticField {
    /**
     * Represents an internal static field that renders its content once using a template.
     *
     * @private
     */
    _template: PdfTemplate;
    /**
     * Indicates whether the field has already been rendered.
     *
     * @private
     */
    _hasRendered: boolean = false;
    /**
     * Initializes the base static field with optional font, brush, and string format settings.
     *
     * @private
     * @param {PdfFont} [font] - The font used for rendering the field text.
     * @param {PdfBrush} [brush] - The brush used to define the text color.
     * @param {PdfStringFormat} [stringFormat] - The format used for text layout and alignment.
     * @returns {void} Does not return a value
     */
    _initializeBase(font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat): void {
        super._initializeBase(font, brush, stringFormat);
    }
    /**
     * Performs static field rendering with global caching.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Point} location The drawing location.
     * @returns {void} Nothing.
     */
    _performDraw(graphics: PdfGraphics, location: Point): void {
        super._performDraw(graphics, location);
        if (!this._template) {
            const value: string = this._getValue(graphics);
            const font: PdfFont = this._obtainFont();
            const brush: PdfBrush = this._obtainBrush();
            const size: Size = this._obtainSize();
            const template: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: size.width, height: size.height });
            template.graphics.drawString(value, font, {x: 0, y: 0, width: size.width, height: size.height}, brush);
            this._template = template;
        }
        const size: Size = this._obtainSize();
        const bounds: Rectangle = { x: location.x, y: location.y, width: size.width, height: size.height };
        graphics.drawTemplate(this._template, bounds);
    }
    /**
     * Returns the string representation of the field’s value used during rendering.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context used for rendering.
     * @returns {string} The formatted value to be rendered.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _getValue(graphics: PdfGraphics): string {
        return '';
    }
}
