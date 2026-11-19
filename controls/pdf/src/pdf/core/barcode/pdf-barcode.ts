import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { PdfBarcodeQuietZone, PdfBarcodeOptionsBase, PdfColor, Rectangle } from '../pdf-document-helper';
/**
 * Abstract base class that provides the common payload, color, quiet-zone, and drawing contract for supported barcodes.
 * It cannot be instantiated directly; create one of the concrete barcode classes (for example `PdfCode39Barcode`, `PdfEan13Barcode`)
 * and use the shared `text`, `foreColor`, `backColor` and `quietZone` members and the `draw` method inherited from this class.
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
export abstract class PdfBarcode {
    /**
     * Gets or sets the barcode payload text. The default value is an empty string.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('ABC');
     * // Sets the text.
     * barcode.text = 'ABC-123';
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default ''
     */
    public text: string = '';
    /**
     * Gets or sets the barcode foreground color. The default value is black.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the foreColor.
     * barcode.foreColor = { r: 0, g: 0, b: 128 };
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default { r: 0, g: 0, b: 0 }
     */
    public foreColor: PdfColor = { r: 0, g: 0, b: 0 };
    /**
     * Gets or sets the barcode background color. The default value is white.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the backColor.
     * barcode.backColor = { r: 255, g: 255, b: 224 };
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default { r: 255, g: 255, b: 255 }
     */
    public backColor: PdfColor = { r: 255, g: 255, b: 255 };
    /**
     * Gets or sets the quiet-zone margins around the barcode. The default value is 0 on every side.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the quietZone.
     * barcode.quietZone = { all: 5, left: 10 };
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default { all: 0 }
     */
    public quietZone: PdfBarcodeQuietZone = { all: 0 };
    /**
     * Creates a barcode with payload text and optional settings.
     *
     * @param {string} text The barcode payload.
     * @param {PdfBarcodeOptionsBase} options Optional settings.
     */
    protected constructor(text: string, options?: PdfBarcodeOptionsBase) {
        this.text = typeof text === 'string' ? text : '';
        if (options) {
            if (options.foreColor) {
                this.foreColor = this._copyColor(options.foreColor);
            }
            if (options.backColor) {
                this.backColor = this._copyColor(options.backColor);
            }
            if (options.quietZone) {
                this.quietZone = this._copyQuietZone(options.quietZone);
            }
        }
    }
    /**
     * Draws the barcode within the supplied bounds and returns the occupied rectangle.
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
     * @param {Rectangle} locationOrBounds The drawing bounds. Width and height 0 select the natural size; otherwise both must be positive.
     * @returns {Rectangle} The rectangle occupied by the barcode, including quiet zones and text.
     * @throws {Error} When the text, bounds or a property value is invalid; nothing is drawn in that case.
     */
    public abstract draw(target: PdfPage | PdfGraphics, locationOrBounds: Rectangle): Rectangle;
    /**
     * Copies a color so caller-owned objects are never aliased.
     *
     * @param {PdfColor} color The source color.
     * @returns {PdfColor} The copy.
     * @private
     */
    protected _copyColor(color: PdfColor): PdfColor {
        const copy: PdfColor = { r: color.r, g: color.g, b: color.b };
        if (color.isTransparent !== undefined) {
            copy.isTransparent = color.isTransparent;
        }
        return copy;
    }
    /**
     * Copies a quiet-zone object so caller-owned objects are never aliased.
     *
     * @param {PdfBarcodeQuietZone} zone The source quiet zone.
     * @returns {PdfBarcodeQuietZone} The copy.
     * @private
     */
    protected _copyQuietZone(zone: PdfBarcodeQuietZone): PdfBarcodeQuietZone {
        const copy: PdfBarcodeQuietZone = {};
        if (zone.all !== undefined) {
            copy.all = zone.all;
        }
        if (zone.left !== undefined) {
            copy.left = zone.left;
        }
        if (zone.right !== undefined) {
            copy.right = zone.right;
        }
        if (zone.top !== undefined) {
            copy.top = zone.top;
        }
        if (zone.bottom !== undefined) {
            copy.bottom = zone.bottom;
        }
        return copy;
    }
}

