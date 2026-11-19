import { PdfFont, PdfStringFormat } from '../../fonts';
import { PdfDocument } from '../../pdf-document';
import { PdfDocumentInformation } from '../../pdf-document-helper';
import { PdfPage } from '../../pdf-page';
import { PdfBrush, PdfGraphics } from '../pdf-graphics';
import { PdfSingleValueField } from './single-value-field';
/**
 * Represents an automatic field that displays the document's author.
 *
 * ```typescript
 * // Create a new PDF document.
 * const document: PdfDocument = new PdfDocument();
 * // Create a new page.
 * const page: PdfPage = document.addPage();
 * // Set document information including author.
 * const info: PdfDocumentInformation = { author: 'Syncfusion' };
 * document.setDocumentInformation(info);
 * // Initialize standard font.
 * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
 * // Initialize solid brush.
 * const brush: PdfBrush = new PdfBrush({r: 0, g: 0, b: 0});
 * // Create the document author field.
 * const authorField: PdfDocumentAuthorField = new PdfDocumentAuthorField({ font: font, brush: brush});
 * // Draw the author field.
 * authorField.draw(page.graphics, { x: 20, y: 30 });
 * // Save the document.
 * document.save('output.pdf');
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export class PdfDocumentAuthorField extends PdfSingleValueField {
    /**
     * Initializes a new instance of the document author field.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Create a new page.
     * const page: PdfPage = document.addPage();
     * // Set document information including author.
     * const info: PdfDocumentInformation = { author: 'Syncfusion' };
     * document.setDocumentInformation(info);
     * // Initialize standard font.
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
     * // Initialize solid brush.
     * const brush: PdfBrush = new PdfBrush({r: 0, g: 0, b: 0});
     * // Create the document author field.
     * const authorField: PdfDocumentAuthorField = new PdfDocumentAuthorField();
     * // Draw the author field.
     * authorField.draw(page.graphics, { x: 20, y: 30 });
     * // Save the document.
      document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     */
    public constructor();
    /**
     * Initializes a new instance of the document author field using the specified properties.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Create a new page.
     * const page: PdfPage = document.addPage();
     * // Set document information including author.
     * const info: PdfDocumentInformation = { author: 'Syncfusion' };
     * document.setDocumentInformation(info);
     * // Initialize standard font.
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
     * // Initialize solid brush.
     * const brush: PdfBrush = new PdfBrush({r: 0, g: 0, b: 0});
     * // Initialize a string format.
     * const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Create the document author field with specified properties.
     * const authorField: PdfDocumentAuthorField = new PdfDocumentAuthorField({font: font, brush: brush, stringFormat: format});
     * // Draw the author field.
     * authorField.draw(page.graphics, { x: 20, y: 30 });
     * // Save the document.
      document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {Object} [properties] Optional configuration properties for the field.
     * @param {PdfFont} [properties.font] The font used to render the author text.
     * @param {PdfBrush} [properties.brush] The brush used to draw the text.
     * @param {PdfStringFormat} [properties.stringFormat] The text layout and alignment settings.
     */
    public constructor(properties: {font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat});
    public constructor(properties?: {font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat}) {
        super();
        if (properties) {
            this._initializeBase(properties.font, properties.brush, properties.stringFormat);
        }
    }
    /**
     * Resolves document author metadata.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @returns {string} The document author.
     */
    _getValue(graphics: PdfGraphics): string {
        const page: PdfPage = this._getPageFromGraphics(graphics);
        if (page && page._crossReference && page._crossReference._document) {
            const doc: PdfDocument = page._crossReference._document;
            const info: PdfDocumentInformation = doc.getDocumentInformation();
            if (info && info.author) {
                return info.author;
            }
        }
        return '';
    }
}
