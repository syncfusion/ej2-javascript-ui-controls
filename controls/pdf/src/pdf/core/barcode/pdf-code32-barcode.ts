import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import { _code39Alphabet, _createCode39Plan } from './pdf-code39-encoder';
/** Every stage of the Code 32 encoding, kept separate from one another. */
export type _Code32Encoding = {
    readonly source: string;
    readonly digits: string;
    readonly checkDigit: string;
    readonly normalized: string;
    readonly symbols: string;
};
/**
 * Represents a Code 32 barcode, also known as Italian Pharmacode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode32Barcode = new PdfCode32Barcode('12345678');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode32Barcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode32Barcode = new PdfCode32Barcode('12345678');
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
     * Creates a Code32 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode32Barcode = new PdfCode32Barcode('12345678');
     * // Creates a barcode with custom options.
     * let custom: PdfCode32Barcode = new PdfCode32Barcode('12345678', {
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
     * let barcode: PdfCode32Barcode = new PdfCode32Barcode('12345678');
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
        const startStop: boolean = this.encodeStartStopSymbols === true;
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => {
            const encoding: _Code32Encoding = this._encodeCode32(text);
            return _createCode39Plan(encoding.symbols, show ? encoding.source + encoding.checkDigit : encoding.source,
                                     false, false, startStop);
        });
    }
    /**
     * Calculates the Code 32 decimal check digit: the sum of the digits at odd positions plus the digit sum of
     * twice each digit at even positions, modulo 10.
     *
     * @param {string} digits The eight data digits.
     * @returns {string} The check digit.
     * @private
     */
    private _code32CheckDigit(digits: string): string {
        let sum: number = 0;
        for (let i: number = 0; i < digits.length; i++) {
            const d: number = digits.charCodeAt(i) - 48;
            if (i % 2 === 0) {
                sum += d;
            } else {
                const doubled: number = d * 2;
                sum += Math.floor(doubled / 10) + doubled % 10;
            }
        }
        return String(sum % 10);
    }
    /**
     * Validates the source text and derives every encoding stage in local values.
     *
     * @param {string} text The source text: eight digits with an optional leading 'A'.
     * @returns {_Code32Encoding} The encoding stages.
     * @private
     */
    private _encodeCode32(text: string): _Code32Encoding {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 32 text cannot be null or empty.');
        }
        const offset: number = text.charAt(0) === 'A' ? 1 : 0;
        const digits: string = text.substring(offset);
        if (digits.length !== 8) {
            throw new Error('Code 32 text must contain exactly 8 digits after the optional \'A\' prefix.');
        }
        for (let i: number = 0; i < digits.length; i++) {
            const code: number = digits.charCodeAt(i);
            if (code < 48 || code > 57) {
                throw new Error('Code 32 text contains a non-digit character at position ' + (i + offset) + '.');
            }
        }
        const checkDigit: string = this._code32CheckDigit(digits);
        const normalized: string = digits + checkDigit;
        let value: number = parseInt(normalized, 10);
        let symbols: string = '';
        while (value > 0) {
            symbols = _code39Alphabet.charAt(value % 32) + symbols;
            value = Math.floor(value / 32);
        }
        while (symbols.length < 6) {
            symbols = '0' + symbols;
        }
        if (symbols.length !== 6) {
            throw new Error('Code 32 conversion produced an invalid symbol count.');
        }
        return Object.freeze({ source: text, digits: digits, checkDigit: checkDigit, normalized: normalized, symbols: symbols });
    }
}
