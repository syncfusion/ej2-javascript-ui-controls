import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import {
    _eanLeftPatterns, _eanRightPatterns, _eanOuterGuard, _eanCentreGuard, _eanCheckDigit, _eanPlanFromModules
} from './pdf-ean-upc-common';
/**
 * Represents a EAN-8 barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfEan8Barcode = new PdfEan8Barcode('1234567');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfEan8Barcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfEan8Barcode = new PdfEan8Barcode('1234567');
     * // Sets the showCheckDigit.
     * barcode.showCheckDigit = true;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default false
     */
    public showCheckDigit: boolean = false;
    /**
     * Creates a Ean8 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfEan8Barcode = new PdfEan8Barcode('1234567');
     * // Creates a barcode with custom options.
     * let custom: PdfEan8Barcode = new PdfEan8Barcode('1234567', {
     *     foreColor: { r: 0, g: 0, b: 128 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     quietZone: { all: 5 },
     *     narrowBarWidth: 1.5,
     *     barHeight: 60,
     *     textGap: 4,
     *     textAlignment: PdfBarcodeTextAlignment.Center,
     *     textLocation: PdfBarcodeTextLocation.Bottom
     * });
     * // Draws the barcode at the specified point.
     * custom.draw(page, { x: 20, y: 20 });
     * // Draws the barcode at specified bounds.
     * barcode.draw(page, { x: 20, y: 20, width: 100, height: 100 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @param {string} text The barcode payload.
     * @param {PdfUnidimensionalBarcodeOptions} options Optional settings. Omitted members keep their default values.
     */
    constructor(text: string, options?: PdfUnidimensionalBarcodeOptions) {
        super(text, options);
    }
    /**
     * Draws the barcode on a `PdfPage` or `PdfGraphics` at the specified point or bounds.
     *
     * A point or zero-sized bounds use the natural size. Positive bounds scale the barcode to fit the specified size and ignore
     * `narrowBarWidth` and `barHeight`.
     *
     * Throws if only one of `width` or `height` is 0.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfEan8Barcode = new PdfEan8Barcode('1234567');
     * // Draws the barcode at the specified point.
     * let natural: Rectangle = barcode.draw(page, { x: 20, y: 20 });
     * // Draws the barcode within the specified bounds.
     * barcode.draw(page.graphics, { x: 20, y: natural.y + natural.height + 20, width: 250, height: 100 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @param {PdfPage | PdfGraphics} target The page or graphics context to draw on.
     * @param {Point | Rectangle} locationOrBounds The point or bounds to draw at. A point or bounds with width and height 0 select the natural size.
     * @returns {Rectangle} The rectangle occupied by the barcode, including quiet zones and text.
     * @throws {Error} When the text, point, bounds or a property value is invalid; nothing is drawn in that case.
     */
    public draw(target: PdfPage | PdfGraphics, locationOrBounds: Point | Rectangle): Rectangle {
        const text: string = this.text;
        const show: boolean = this.showCheckDigit === true;
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildEan8Plan(text, show));
    }
    /**
     * Validates the text and returns the normalized 8-digit value.
     * An 7-digit text receives the calculated check digit; a 8-digit text must carry the correct one.
     *
     * @param {string} text The source text.
     * @returns {string} The 8 digits.
     * @private
     */
    private _normalizeEan8(text: string): string {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('EAN-8 text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code < 48 || code > 57) {
                throw new Error('EAN-8 text contains a non-digit character at position ' + i + '.');
            }
        }
        if (text.length !== 7 && text.length !== 8) {
            throw new Error('EAN-8 text must contain 7 or 8 digits.');
        }
        const check: number = _eanCheckDigit(text.substring(0, 7));
        if (text.length === 8 && text.charCodeAt(7) - 48 !== check) {
            throw new Error('EAN-8 check digit is incorrect.');
        }
        return text.substring(0, 7) + check;
    }
    /**
     * Builds the 67-module string: start guard, four L digits, centre guard, four R digits and end guard.
     *
     * @param {string} digits The normalized 8 digits.
     * @returns {string} The modules, 1 = bar.
     * @private
     */
    private _ean8Modules(digits: string): string {
        let out: string = _eanOuterGuard;
        for (let i: number = 0; i < 8; i++) {
            if (i === 4) {
                out += _eanCentreGuard;
            }
            const d: number = digits.charCodeAt(i) - 48;
            out += i < 4 ? _eanLeftPatterns[<number>d] : _eanRightPatterns[<number>d];
        }
        return out + _eanOuterGuard;
    }
    /**
     * Builds the immutable plan.
     *
     * @param {string} text The source text.
     * @param {boolean} show True to include the check digit in the caption.
     * @returns {_UniPlan} The plan.
     * @private
     */
    private _buildEan8Plan(text: string, show: boolean): _UniPlan {
        const digits: string = this._normalizeEan8(text);
        return _eanPlanFromModules(this._ean8Modules(digits), show ? digits : digits.substring(0, 7));
    }
}
