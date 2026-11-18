import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import { _code128StartC, _createCode128Plan } from './pdf-code128-common';
/**
 * Represents a Code 128C barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode128CBarcode = new PdfCode128CBarcode('12345678');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode128CBarcode extends PdfUnidimensionalBarcode {
    /**
     * Creates a Code128C barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode128CBarcode = new PdfCode128CBarcode('12345678');
     * // Creates a barcode with custom options.
     * let custom: PdfCode128CBarcode = new PdfCode128CBarcode('12345678', {
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
     * let barcode: PdfCode128CBarcode = new PdfCode128CBarcode('12345678');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => _createCode128Plan(this._code128CSymbols(text), text));
    }
    /**
     * Validates the complete text and maps it to Code Set C digit-pair values, starting with Start C.
     * An odd-length text is left-padded with a zero for encoding only; the caption keeps the original text.
     *
     * @param {string} text The source text.
     * @returns {number[]} The start symbol followed by the pair values.
     * @private
     */
    private _code128CSymbols(text: string): number[] {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 128C text cannot be null or empty.');
        }
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code < 48 || code > 57) {
                throw new Error('Code 128C text contains a non-digit character at position ' + i + '.');
            }
        }
        const padded: string = text.length % 2 === 1 ? '0' + text : text;
        const symbols: number[] = [_code128StartC];
        for (let i: number = 0; i < padded.length; i += 2) {
            symbols.push((padded.charCodeAt(i) - 48) * 10 + padded.charCodeAt(i + 1) - 48);
        }
        return symbols;
    }
}
