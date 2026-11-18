import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import { _createCode93Plan } from './pdf-code93-common';
/**
 * Represents a Code 93 Extended barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode93ExtendedBarcode = new PdfCode93ExtendedBarcode('Code93 Ext');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode93ExtendedBarcode extends PdfUnidimensionalBarcode {
    /**
     * Gets or sets whether an encoded check digit is included in the human-readable data representation. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode93ExtendedBarcode = new PdfCode93ExtendedBarcode('Code93 Ext');
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
     * Creates a Code93Extended barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode93ExtendedBarcode = new PdfCode93ExtendedBarcode('Code93 Ext');
     * // Creates a barcode with custom options.
     * let custom: PdfCode93ExtendedBarcode = new PdfCode93ExtendedBarcode('Code93 Ext', {
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
     * let barcode: PdfCode93ExtendedBarcode = new PdfCode93ExtendedBarcode('Code93 Ext');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildCode93ExtendedPlan(text, show, startStop));
    }
    /**
     * Full ASCII expansion table indexed by character code 0-127.
     * The letters a, b, c and d are the internal names of the shift symbols ($), (%), (/) and (+).
     * @private
     */
    private readonly _code93ExtendedTable: ReadonlyArray<string> = Object.freeze([
        'bU', 'aA', 'aB', 'aC', 'aD', 'aE', 'aF', 'aG', 'aH', 'aI', 'aJ', 'aK', 'aL', 'aM', 'aN', 'aO',
        'aP', 'aQ', 'aR', 'aS', 'aT', 'aU', 'aV', 'aW', 'aX', 'aY', 'aZ', 'bA', 'bB', 'bC', 'bD', 'bE',
        ' ', 'cA', 'cB', 'cC', '$', '%', 'cF', 'cG', 'cH', 'cI', 'cJ', '+', 'cL', '-', '.', '/',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'cZ', 'bF', 'bG', 'bH', 'bI', 'bJ',
        'bV', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bK', 'bL', 'bM', 'bN', 'bO',
        'bW', 'dA', 'dB', 'dC', 'dD', 'dE', 'dF', 'dG', 'dH', 'dI', 'dJ', 'dK', 'dL', 'dM', 'dN', 'dO',
        'dP', 'dQ', 'dR', 'dS', 'dT', 'dU', 'dV', 'dW', 'dX', 'dY', 'dZ', 'bP', 'bQ', 'bR', 'bS', 'bT'
    ]);
    /**
     * Builds the Code 93 Extended plan.
     *
     * @param {string} text The source text.
     * @param {boolean} showCheck True to show the check characters.
     * @param {boolean} showStartStop True to show the start and stop characters.
     * @returns {_UniPlan} The plan.
     * @private
     */
    private _buildCode93ExtendedPlan(text: string, showCheck: boolean, showStartStop: boolean): _UniPlan {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 93 Extended text cannot be null or empty.');
        }
        let expanded: string = '';
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code > 127) {
                throw new Error('Code 93 Extended text contains a non-ASCII character at position ' + i + '.');
            }
            expanded += this._code93ExtendedTable[<number>code];
        }
        return _createCode93Plan(expanded, text, showCheck, showStartStop);
    }
}
