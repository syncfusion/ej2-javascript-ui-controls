/**
 * PdfSectionPageCollection.ts class for EJ2-PDF
 */
import { PdfPage } from './pdf-page';
import { PdfSection } from './pdf-section';
/**
 * Represents the `collection of pages in a section`.
 * @private
 */
export class PdfSectionPageCollection {
    //  Fields
    /**
     * @hidden
     * @private
     */
    private pdfSection : PdfSection = null;
    // Properties
    /**
     * Gets the `PdfPage` at the specified index.
     * @private
     */
    public get section() : PdfSection {
        return this.pdfSection;
    }
    public set section(value : PdfSection) {
        this.pdfSection = value;
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfSectionPageCollection` class.
     * @private
     */
    public constructor(section : PdfSection) {
        if (section == null) {
            throw Error('ArgumentNullException("section")');
        }
        this.section = section;
    }
    // Public Methods
    /**
     * `Determines` whether the specified page is within the collection.
     * @private
     */
    public contains(page : PdfPage) : boolean {
        return this.section.contains(page);
    }
    /**
     * `Removes` the specified page from collection.
     * @private
     */
    public remove(page : PdfPage) : void {
        this.section.remove(page);
    }
    /**
     * `Adds` a new page from collection.
     * @private
     */
    public add() : PdfPage {
        return this.section.add() as PdfPage;
    }
}
