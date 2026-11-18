import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle } from '../pdf-document-helper';
import { PdfBarcode } from './pdf-barcode';

/**
 * Represents the common properties and drawing behavior for all supported 2D barcodes.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a PDF417 barcode with the payload and drawing bounds
 * let barcode: Pdf417Barcode = new Pdf417Barcode('Hello World');
 * barcode.draw(page, { x: 10, y: 20, width: 200, height: 100 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfBidimensionalBarcode extends PdfBarcode {
    /**
     * Gets or sets the width of one barcode module. The default value is 1.
     */
    public xDimension: number = 1;
    /**
     * Draws the barcode on a PDF page or graphics context within the
     * supplied bounds and returns the occupied bounds.
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create a PDF417 barcode with the payload and drawing bounds
     * let barcode: Pdf417Barcode = new Pdf417Barcode('Hello World');
     * barcode.draw(page, { x: 10, y: 20, width: 200, height: 100 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfPage | PdfGraphics} target - The PDF page or graphics context.
     * @param {Rectangle} bounds - The drawing bounds for the barcode.
     * @returns {Rectangle} The bounds occupied by the barcode.
     */
    public abstract draw(target: PdfPage | PdfGraphics, bounds: Rectangle): Rectangle;
}
