import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import { _code39Alphabet, _code39StartStop, _createCode39Plan } from './pdf-code39-encoder';
/**
 * Represents a Code 39 barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode39Barcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the enableCheckDigit.
     * barcode.enableCheckDigit = true;
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
     * Gets or sets whether the optional check digit is calculated and encoded. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the enableCheckDigit.
     * barcode.enableCheckDigit = true;
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
    public enableCheckDigit: boolean = false;
    /**
     * Creates a Code39 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Creates a barcode with custom options.
     * let custom: PdfCode39Barcode = new PdfCode39Barcode('CODE39', {
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
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
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
        const enable: boolean = this.enableCheckDigit === true;
        const show: boolean = this.showCheckDigit === true;
        const startStop: boolean = this.encodeStartStopSymbols === true;
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildCode39Plan(text, enable, show, startStop));
    }
    /**
     * Builds the Code 39 plan.
     *
     * @param {string} text The source text.
     * @param {boolean} enableCheck True to encode the check character.
     * @param {boolean} showCheck True to show the check character.
     * @param {boolean} showStartStop True to show the start and stop characters.
     * @returns {_UniPlan} The plan.
     * @private
     */
    private _buildCode39Plan(text: string, enableCheck: boolean, showCheck: boolean, showStartStop: boolean): _UniPlan {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 39 text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            const c: string = text.charAt(i);
            if (c === _code39StartStop) {
                throw new Error('Code 39 text contains the reserved start/stop character \'*\' at position ' + i + '.');
            }
            if (_code39Alphabet.indexOf(c) < 0) {
                throw new Error('Code 39 text contains an unsupported character at position ' + i + '.');
            }
        }
        return _createCode39Plan(text, text, enableCheck, showCheck, showStartStop);
    }
}
