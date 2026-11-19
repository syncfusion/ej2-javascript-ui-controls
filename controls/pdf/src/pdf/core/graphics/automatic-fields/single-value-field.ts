import { PdfFont, PdfStringFormat } from '../../fonts';
import { PdfDocument } from '../../pdf-document';
import { PdfPage } from '../../pdf-page';
import { Point, Size, Rectangle } from '../../pdf-document-helper';
import { PdfBrush, PdfGraphics } from '../pdf-graphics';
import { PdfTemplate } from '../pdf-template';
import { PdfDynamicField } from './dynamic-field';
/**
 * Represents an internal dynamic field that maintains a single cached value for rendering.
 *
 * @private
 */
export class PdfSingleValueField extends PdfDynamicField {
    /**
     * Holds the template used for rendering the field value.
     *
     * @private
     */
    _template: PdfTemplate;
    /**
     * Stores the cached string value of the field.
     *
     * @private
     */
    _cachedValue: string;
    /**
     * Keeps a reference to the document associated with the cached value.
     *
     * @private
     */
    _cachedDocument: PdfDocument;
    /**
     * Initializes the base dynamic field with optional font, brush, and string format settings.
     *
     * @private
     *
     * @param {PdfFont} [font] - The font used for rendering the field text.
     * @param {PdfBrush} [brush] - The brush used to define the text color.
     * @param {PdfStringFormat} [stringFormat] - The format used for text layout and alignment.
     * @returns {void} Does not return a value.
     */
    _initializeBase(font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat): void {
        super._initializeBase(font, brush, stringFormat);
    }
    /**
     * Performs single-value rendering with caching.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Point} location The drawing location.
     * @returns {void} Nothing.
     */
    _performDraw(graphics: PdfGraphics, location: Point): void {
        super._performDraw(graphics, location);
        const value: string = this._getValue(graphics);
        const page: PdfPage = this._getPageFromGraphics(graphics);
        const doc: PdfDocument = (page && page._crossReference) ? page._crossReference._document as PdfDocument : null;
        if (!this._template || this._cachedValue !== value || this._cachedDocument !== doc) {
            const font: PdfFont = this._obtainFont();
            const brush: PdfBrush = this._obtainBrush();
            const templateSize: Size = this._obtainSize();
            const template: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: templateSize.width, height: templateSize.height });
            template.graphics.drawString(value, font, {x: 0, y: 0, width: templateSize.width, height: templateSize.height}, brush);
            this._template = template;
            this._cachedValue = value;
            this._cachedDocument = doc;
        }
        const size: Size = this._obtainSize();
        const bounds: Rectangle = { x: location.x, y: location.y, width: size.width, height: size.height };
        graphics.drawTemplate(this._template, bounds);
    }
    /**
     * Gets the string value produced by this field.
     *
     * @private
     * @param {PdfGraphics} graphics
     * The graphics context used during rendering.
     *
     * @returns {string} The resolved string value for the field.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _getValue(graphics: PdfGraphics): string {
        return '';
    }
}
