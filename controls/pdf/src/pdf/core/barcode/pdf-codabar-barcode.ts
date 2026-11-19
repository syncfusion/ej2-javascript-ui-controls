import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan, _CodabarPatternMap } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
/**
 * Represents a Codabar barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCodabarBarcode = new PdfCodabarBarcode('123456');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCodabarBarcode extends PdfUnidimensionalBarcode {
    /**
     * Creates a Codabar barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCodabarBarcode = new PdfCodabarBarcode('123456');
     * // Creates a barcode with custom options.
     * let custom: PdfCodabarBarcode = new PdfCodabarBarcode('123456', {
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
     * let barcode: PdfCodabarBarcode = new PdfCodabarBarcode('123456');
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
        const startStop: boolean = this.encodeStartStopSymbols === true;
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => this._buildCodabarPlan(text, startStop));
    }
    /**
     * Codabar element widths (bar, space, bar, space, bar, space, bar; 1 = narrow, 2 = wide).
     * Every symbol has seven elements and the wide:narrow ratio is 2:1.
     * @private
     */
    private readonly _codabarPatterns: _CodabarPatternMap = Object.freeze({
        '0': '1111122', '1': '1111221', '2': '1112112', '3': '2211111', '4': '1121121',
        '5': '2111121', '6': '1211112', '7': '1211211', '8': '1221111', '9': '2112111',
        '-': '1112211', '$': '1122111', ':': '2111212', '/': '2121112', '.': '2121211', '+': '1121212',
        'A': '1122121', 'B': '1112122', 'C': '1212112', 'D': '1112221'
    });
    /** Characters accepted in the payload. The start/stop symbols A-D are not payload characters. */
    /**
     * Internal member _codabarDataCharacters.
     *
     * @private
     */
    private readonly _codabarDataCharacters: string = '0123456789-$:/.+';
    /**
     * Internal member _codabarStart.
     *
     * @private
     */
    private readonly _codabarStart: string = 'A';
    /**
     * Internal member _codabarStop.
     *
     * @private
     */
    private readonly _codabarStop: string = 'B';
    /**
     * Validates the complete payload and builds the immutable Codabar plan.
     *
     * @param {string} text The payload without start/stop symbols.
     * @param {boolean} showStartStop Whether start/stop symbols are shown in the caption.
     * @returns {_UniPlan} The plan.
     * @private
     */
    private _buildCodabarPlan(text: string, showStartStop: boolean): _UniPlan {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Codabar text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            if (this._codabarDataCharacters.indexOf(text.charAt(i)) < 0) {
                throw new Error('Codabar text contains an unsupported character at position ' + i + '.');
            }
        }
        const encoded: string = this._codabarStart + text + this._codabarStop;
        const runs: number[] = [];
        let modules: number = 0;
        for (let i: number = 0; i < encoded.length; i++) {
            const pattern: string = this._codabarPatterns[encoded.charAt(i)];
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
        const display: string = showStartStop ? encoded : text;
        return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules, displayText: display });
    }
}
