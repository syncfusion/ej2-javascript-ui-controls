import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import {
    _eanLeftPatterns, _eanRightPatterns, _eanOuterGuard, _eanCentreGuard, _eanCheckDigit, _eanPlanFromModules
} from './pdf-ean-upc-common';
/**
 * Represents a UPC-A barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfUpcABarcode = new PdfUpcABarcode('01234567890');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfUpcABarcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfUpcABarcode = new PdfUpcABarcode('01234567890');
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
     * Creates a UpcA barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfUpcABarcode = new PdfUpcABarcode('01234567890');
     * // Creates a barcode with custom options.
     * let custom: PdfUpcABarcode = new PdfUpcABarcode('01234567890', {
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
     * let barcode: PdfUpcABarcode = new PdfUpcABarcode('01234567890');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildUpcAPlan(text, show));
    }
    /**
     * Validates the text and returns the normalized 12-digit value.
     * An 11-digit text receives the calculated check digit; a 12-digit text must carry the correct one.
     *
     * @param {string} text The source text.
     * @returns {string} The 12 digits.
     * @private
     */
    private _normalizeUpcA(text: string): string {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('UPC-A text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code < 48 || code > 57) {
                throw new Error('UPC-A text contains a non-digit character at position ' + i + '.');
            }
        }
        if (text.length !== 11 && text.length !== 12) {
            throw new Error('UPC-A text must contain 11 or 12 digits.');
        }
        const check: number = _eanCheckDigit(text.substring(0, 11));
        if (text.length === 12 && text.charCodeAt(11) - 48 !== check) {
            throw new Error('UPC-A check digit is incorrect.');
        }
        return text.substring(0, 11) + check;
    }
    /**
     * Builds the 95-module string: start guard, six L digits, centre guard, six R digits and end guard.
     *
     * @param {string} digits The normalized 12 digits.
     * @returns {string} The modules, 1 = bar.
     * @private
     */
    private _upcAModules(digits: string): string {
        let out: string = _eanOuterGuard;
        for (let i: number = 0; i < 12; i++) {
            if (i === 6) {
                out += _eanCentreGuard;
            }
            const d: number = digits.charCodeAt(i) - 48;
            out += i < 6 ? _eanLeftPatterns[<number>d] : _eanRightPatterns[<number>d];
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
    private _buildUpcAPlan(text: string, show: boolean): _UniPlan {
        const digits: string = this._normalizeUpcA(text);
        return _eanPlanFromModules(this._upcAModules(digits), show ? digits : digits.substring(0, 11));
    }
}
