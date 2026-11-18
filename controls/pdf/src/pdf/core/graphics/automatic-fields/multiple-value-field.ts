import { PdfStringFormat } from '../../fonts';
import { PdfFont } from '../../fonts/pdf-standard-font';
import { _PdfTemplateValuePair, Point, Size, Rectangle } from '../../pdf-document-helper';
import { PdfGraphics, PdfBrush } from '../pdf-graphics';
import { PdfTemplate } from '../pdf-template';
import { PdfDynamicField } from './dynamic-field';
/**
 * Represents an internal field that maintains multiple rendered values across different PdfGraphics contexts.
 *
 * @private
 */
export class PdfMultipleValueField extends PdfDynamicField {
    /**
     * Stores a mapping between PdfGraphics instances and their corresponding template value pairs.
     *
     * @private
     */
    _templateValueMap: Map<PdfGraphics, _PdfTemplateValuePair> = new Map();
    /**
     * Initializes the base dynamic field with optional font, brush, and string format settings.
     *
     * @param {PdfFont} [font] - The font used for rendering the field text.
     * @param {PdfBrush} [brush] - The brush used to define the text color.
     * @param {PdfStringFormat} [stringFormat] - The format used for text layout and alignment.
     * @returns {void}
     * @private
     */
    _initializeBase(font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat): void {
        super._initializeBase(font, brush, stringFormat);
    }
    /**
     * Performs rendering with value reuse logic.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Point} location The drawing location.
     * @returns {void} Nothing.
     */
    _performDraw(graphics: PdfGraphics, location: Point): void {
        super._performDraw(graphics, location);
        const value: string = this._getValue(graphics);
        let cached: any = this._templateValueMap.get(graphics);  // eslint-disable-line
        if (!cached || cached.value !== value) {
            const font: PdfFont = this._obtainFont();
            const brush: PdfBrush = this._obtainBrush();
            const size: Size = this._obtainSize();
            const template: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: size.width, height: size.height });
            if (value) {
                template.graphics.drawString(value, font, { x: 0, y: 0, width: size.width, height: size.height }, brush);
            }
            cached = { template, value };
            this._templateValueMap.set(graphics, cached);
        }
        const size: Size = this._obtainSize();
        const bounds: Rectangle = { x: location.x, y: location.y, width: size.width, height: size.height };
        graphics.drawTemplate(cached.template, bounds);
    }
    /**
     * Default value resolver for multiple-value fields.
     * Derived classes should override to provide actual values.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @returns {string} The computed value (default empty string).
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _getValue(graphics: PdfGraphics): string {
        return '';
    }
}
