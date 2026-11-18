import { PdfFont, PdfStringFormat } from '../../fonts';
import { PdfDocument } from '../../pdf-document';
import { PdfDocumentInformation } from '../../pdf-document-helper';
import { PdfPage } from '../../pdf-page';
import { _padStart } from '../../utils';
import { PdfBrush, PdfGraphics } from '../pdf-graphics';
import { PdfSingleValueField } from './single-value-field';
/**
 * Represents an automatic field that displays the creation date of the document.
 *
 * ```typescript
 * // Create a new document.
 * const document: PdfDocument = new PdfDocument();
 * // Add new page to document.
 * const page = document.addPage();
 * // Define document creation date.
 * const creationDate: Date = new Date('2026-05-08T12:00:00');
 * // Set document information.
 * document.setDocumentInformation({title: 'Creation Date Sample', creationDate: creationDate});
 * // Initialize the standard font.
 * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
 * // Initialize the brush.
 * const brush: PdfBrush = new PdfBrush({ r: 255, g: 0, b: 0 });
 * // Create the creation date field.
 * const dateField: PdfCreationDateField = new PdfCreationDateField({ font: font, brush: brush });
 * // Draw the creation date field.
 * dateField.draw(page.graphics, { x: 20, y: 10 });
 * // Save the document.
 * document.save('output.pdf');
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export class PdfCreationDateField extends PdfSingleValueField {
    /**
     * Gets or sets the format string used to display the creation date.
     *
     * @private
     */
    _formatString: string = 'yyyy/MM/dd HH:mm:ss';
    /**
     * Initializes a new instance of the creation date field.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to document.
     * const page: PdfPage = document.addPage();
     * // Define document creation date.
     * const creationDate: Date = new Date('2026-05-08T12:00:00');
     * // Set document information.
     * document.setDocumentInformation({title: 'Creation Date Sample', creationDate: creationDate});
     * // Create a creation date field.
     * const field: PdfCreationDateField = new PdfCreationDateField();
     * // Assign the date string format
     * field.dateFormatString = 'yyyy/MM/dd';
     * // Draw the field on the page.
     * field.draw(page.graphics, { x: 10, y: 10 });
     * // Save the document.
     * document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     */
    public constructor();
    /**
     * Initializes a new instance of the creation date field using the specified properties.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to document.
     * const page: PdfPage = document.addPage();
     * // Define document creation date.
     * const creationDate: Date = new Date('2026-05-08T12:00:00');
     * // Set document information.
     * document.setDocumentInformation({title: 'Creation Date Sample', creationDate: creationDate});
     * // Initialize the standard font.
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
     * // Initialize the brush.
     * const brush: PdfBrush = new PdfBrush({ r: 255, g: 0, b: 0 });
     * // Initialize a string format.
     * const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Create a creation date field using the specified properties.
     * const field: PdfCreationDateField = new PdfCreationDateField({ font: font, brush: brush, stringFormat: format, dateFormat: 'yyyy/MM/dd'});
     * // Draw the field on the page.
     * field.draw(page.graphics, { x: 10, y: 10 });
     * // Save the document.
     * document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {Object} [properties] Configuration options to customize the field's appearance and formatting.
     * @param {PdfFont} [properties.font] The font used to render the text.
     * @param {PdfBrush} [properties.brush] The brush used to draw the text.
     * @param {PdfStringFormat} [properties.stringFormat] The text layout and alignment settings.
     * @param {string} [properties.dateFormat] The custom format string used to display the creation date.
     */
    public constructor(properties: {font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat,
        dateFormat?: string});
    public constructor(properties?: {font?: PdfFont, brush?: PdfBrush, stringFormat?: PdfStringFormat,
        dateFormat?: string}) {
        super();
        if (properties) {
            this._initializeBase(properties.font, properties.brush, properties.stringFormat);
            if (properties.dateFormat) {
                this._formatString = properties.dateFormat;
            }
        }
    }
    /**
     * Gets the date format string currently used to render the creation date.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to document.
     * const page: PdfPage = document.addPage();
     * // Define document creation date.
     * const creationDate: Date = new Date('2026-05-08T12:00:00');
     * // Set document information.
     * document.setDocumentInformation({title: 'Creation Date Sample', creationDate: creationDate});
     * // Create a creation date field.
     * const field: PdfCreationDateField = new PdfCreationDateField({dateFormat: 'yyyy/MM/dd'});
     * // Get the date format string
     * const stringFormat: string = field.dateFormatString;
     * // Draw the field on the page.
     * field.draw(page.graphics, { x: 10, y: 10 });
     * // Save the document.
     * document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @returns {string} The date format string.
     */
    get dateFormatString(): string {
        return this._formatString;
    }
    /**
     * Sets the date format string used to render the creation date.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to document.
     * const page: PdfPage = document.addPage();
     * // Define document creation date.
     * const creationDate: Date = new Date('2026-05-08T12:00:00');
     * // Set document information.
     * document.setDocumentInformation({title: 'Creation Date Sample', creationDate: creationDate});
     * // Create a creation date field.
     * const field: PdfCreationDateField = new PdfCreationDateField();
     * // Set the date format string.
     * field.dateFormatString = 'yyyy/MM/dd';
     * // Draw the field on the page.
     * field.draw(page.graphics, { x: 10, y: 10 });
     * // Save the document.
     * document.save('output.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {string} value The date format string to apply.
     */
    set dateFormatString(value: string) {
        this._formatString = value;
    }
    /**
     * Resolves document creation date.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @returns {string} The formatted creation date.
     */
    _getValue(graphics: PdfGraphics): string {
        const page: PdfPage = this._getPageFromGraphics(graphics);
        const doc: PdfDocument = page._crossReference._document as PdfDocument;
        if (doc) {
            const info: PdfDocumentInformation = doc.getDocumentInformation();
            if (info) {
                const date: Date = info.creationDate;
                return this._formatDate(date, this._formatString);
            }
        }
        return new Date().toISOString();
    }
    /**
     * Formats a date according to the format string.
     *
     * @private
     * @param {Date} date The date to format.
     * @param {string} format The format string.
     * @returns {string} The formatted date.
     */
    private _formatDate(date: Date, format: string): string {
        const year: number = date.getFullYear();
        const month: string = _padStart(String(date.getMonth() + 1), 2, '0');
        const day: string = _padStart(String(date.getDate()), 2, '0');
        const hours: string = _padStart(String(date.getHours()), 2, '0');
        const minutes: string = _padStart(String(date.getMinutes()), 2, '0');
        const seconds: string = _padStart(String(date.getSeconds()), 2, '0');
        return format
            .replace('yyyy', String(year))
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
}
