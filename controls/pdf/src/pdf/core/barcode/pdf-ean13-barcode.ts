import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import {
    _eanLeftPatterns, _eanRightPatterns, _eanOuterGuard, _eanCentreGuard, _eanCheckDigit, _eanPlanFromModules
} from './pdf-ean-upc-common';
/**
 * Represents an EAN-13 barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfEan13Barcode = new PdfEan13Barcode('123456789012');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfEan13Barcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfEan13Barcode = new PdfEan13Barcode('123456789012');
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
     * Creates an Ean13 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfEan13Barcode = new PdfEan13Barcode('123456789012');
     * // Creates a barcode with custom options.
     * let custom: PdfEan13Barcode = new PdfEan13Barcode('123456789012', {
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
     * let barcode: PdfEan13Barcode = new PdfEan13Barcode('123456789012');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildEan13Plan(text, show));
    }
    /** G-code (even parity) 7-module digit patterns: the R-codes reversed. */
    /**
     * Internal member _ean13EvenPatterns.
     *
     * @private
     */
    private readonly _ean13EvenPatterns: ReadonlyArray<string> = Object.freeze(_eanRightPatterns.map((p: string): string => {
        return p.split('').reverse().join('');
    }));
    /** Parity (L or G) of the six left-hand digits, selected by the first digit. */
    /**
     * Internal member _ean13ParityTable.
     *
     * @private
     */
    private readonly _ean13ParityTable: ReadonlyArray<string> = Object.freeze([
        'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
    ]);
    /**
     * Validates the text and returns the normalized 13-digit value.
     * A 12-digit text receives the calculated check digit; a 13-digit text must carry the correct one.
     *
     * @param {string} text The source text.
     * @returns {string} The 13 digits.
     * @private
     */
    private _normalizeEan13(text: string): string {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('EAN-13 text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code < 48 || code > 57) {
                throw new Error('EAN-13 text contains a non-digit character at position ' + i + '.');
            }
        }
        if (text.length !== 12 && text.length !== 13) {
            throw new Error('EAN-13 text must contain 12 or 13 digits.');
        }
        const check: number = _eanCheckDigit(text.substring(0, 12));
        if (text.length === 13 && text.charCodeAt(12) - 48 !== check) {
            throw new Error('EAN-13 check digit is incorrect.');
        }
        return text.substring(0, 12) + check;
    }
    /**
     * Returns the L/G parity sequence selected by the first digit.
     *
     * @param {string} digits The normalized 13 digits.
     * @returns {string} Six characters, each L or G.
     * @private
     */
    private _ean13Parity(digits: string): string {
        return this._ean13ParityTable[digits.charCodeAt(0) - 48];
    }
    /**
     * Builds the 95-module string: start guard, six L/G digits (digits 2-7), centre guard, six R digits (digits 8-13) and end guard.
     * The first digit is never encoded as a pattern; it only selects the parity.
     *
     * @param {string} digits The normalized 13 digits.
     * @returns {string} The modules, 1 = bar.
     * @private
     */
    private _ean13Modules(digits: string): string {
        const parity: string = this._ean13Parity(digits);
        let out: string = _eanOuterGuard;
        for (let i: number = 1; i < 13; i++) {
            if (i === 7) {
                out += _eanCentreGuard;
            }
            const d: number = digits.charCodeAt(i) - 48;
            if (i < 7) {
                out += parity.charAt(i - 1) === 'L' ? _eanLeftPatterns[<number>d] : this._ean13EvenPatterns[<number>d];
            } else {
                out += _eanRightPatterns[<number>d];
            }
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
    private _buildEan13Plan(text: string, show: boolean): _UniPlan {
        const digits: string = this._normalizeEan13(text);
        return _eanPlanFromModules(this._ean13Modules(digits), show ? digits : digits.substring(0, 12));
    }
}
