import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan, _Code11PatternMap } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
/**
 * Represents a Code 11 barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode11Barcode = new PdfCode11Barcode('123-45');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode11Barcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode11Barcode = new PdfCode11Barcode('123-45');
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
     * let barcode: PdfCode11Barcode = new PdfCode11Barcode('123-45');
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
     * Creates a Code11 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode11Barcode = new PdfCode11Barcode('123-45');
     * // Creates a barcode with custom options.
     * let custom: PdfCode11Barcode = new PdfCode11Barcode('123-45', {
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
     * let barcode: PdfCode11Barcode = new PdfCode11Barcode('123-45');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildCode11Plan(text, enable, show, startStop));
    }
    /**
     * Code 11 element widths (bar, space, bar, space, bar; 1 = narrow, 2 = wide).
     * Every symbol has five elements and the wide:narrow ratio is 2:1.
     * @private
     */
    private readonly _code11Patterns: _Code11PatternMap = Object.freeze({
        '0': '11112', '1': '21112', '2': '12112', '3': '22111', '4': '11212', '5': '21211',
        '6': '12211', '7': '11122', '8': '21121', '9': '21111', '-': '11211', '*': '11221'
    });
    /** Symbol values 0-10 in checksum order. */
    /**
     * Internal member _code11Alphabet.
     *
     * @private
     */
    private readonly _code11Alphabet: string = '0123456789-';
    /**
     * Internal member _code11StartStop.
     *
     * @private
     */
    private readonly _code11StartStop: string = '*';
    /**
     * Calculates one Code 11 check symbol using weights 1..maxWeight from the rightmost symbol.
     *
     * @param {string} symbols The symbols to weigh.
     * @param {number} maxWeight The weight after which the cycle restarts at 1.
     * @returns {string} The check symbol.
     * @private
     */
    private _code11Check(symbols: string, maxWeight: number): string {
        let sum: number = 0;
        let weight: number = 1;
        for (let i: number = symbols.length - 1; i >= 0; i--) {
            sum += this._code11Alphabet.indexOf(symbols.charAt(i)) * weight;
            weight = weight === maxWeight ? 1 : weight + 1;
        }
        return this._code11Alphabet.charAt(sum % 11);
    }
    /**
     * Validates the complete payload and builds the immutable Code 11 plan.
     *
     * @param {string} text The payload without start/stop symbols.
     * @param {boolean} enableCheck Whether the C (and K) check symbols are encoded.
     * @param {boolean} showCheck Whether enabled check symbols are shown in the caption.
     * @param {boolean} showStartStop Whether start/stop symbols are shown in the caption.
     * @returns {_UniPlan} The plan.
     * @private
     */
    private _buildCode11Plan(text: string, enableCheck: boolean, showCheck: boolean, showStartStop: boolean): _UniPlan {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 11 text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            if (this._code11Alphabet.indexOf(text.charAt(i)) < 0) {
                throw new Error('Code 11 text contains an unsupported character at position ' + i + '.');
            }
        }
        let checks: string = '';
        if (enableCheck) {
            checks = this._code11Check(text, 10);
            if (text.length >= 10) {
                checks += this._code11Check(text + checks, 9);
            }
        }
        const encoded: string = this._code11StartStop + text + checks + this._code11StartStop;
        const runs: number[] = [];
        let modules: number = 0;
        for (let i: number = 0; i < encoded.length; i++) {
            const pattern: string = this._code11Patterns[encoded.charAt(i)];
            for (let j: number = 0; j < pattern.length; j++) {
                const width: number = pattern.charCodeAt(j) - 48;
                runs.push(width);
                modules += width;
            }
            if (i < encoded.length - 1) {
                runs.push(1);
                modules += 1;
            }
        }
        let display: string = enableCheck && showCheck ? text + checks : text;
        if (showStartStop) {
            display = this._code11StartStop + display + this._code11StartStop;
        }
        return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules, displayText: display });
    }
}
