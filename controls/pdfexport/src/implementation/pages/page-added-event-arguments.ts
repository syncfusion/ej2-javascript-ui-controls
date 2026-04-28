/**
 * PageAddedEventArguments.ts class for EJ2-PDF
 */
import { PdfPage } from './pdf-page';
/**
 * Provides data for `PageAddedEventHandler` event.
 * This event raises when adding the new PDF page to the PDF document.
 */
export class PageAddedEventArgs {
    /**
     * Represents added `page`.
     * @private
     */
    private pdfPage : PdfPage;
    /**
     * Gets the `newly added page`.
     * @private
     */
    public get page() : PdfPage {
        return this.pdfPage;
    }
    /**
     * Initializes a new instance of the `PageAddedEventArgs` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PageAddedEventArgs` class with 'PdfPage'.
     * @private
     */
    public constructor(page : PdfPage)
    public constructor(page? : PdfPage) {
        if (typeof page !== 'undefined') {
            this.pdfPage = page;
        } else {
            this.pdfPage = null;
        }
    }
}