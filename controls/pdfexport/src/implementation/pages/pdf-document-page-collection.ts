import { PdfDocument } from './../document/pdf-document';
import { PdfPage } from './pdf-page';
import { PdfSection } from './pdf-section';
import { PdfSectionCollection } from './pdf-section-collection';
import { PageAddedEventArgs } from './../pages/page-added-event-arguments';
import { Dictionary } from './../collections/dictionary';
/**
 * Represents a virtual collection of all the pages in the document.
 * @private
 */
export class PdfDocumentPageCollection {
    /**
     * Parent `document`.
     * @private
     */
    private document : PdfDocument;
    /**
     * It holds the page collection with the `index`.
     * @private
     */
    private pdfPageCollectionIndex : Dictionary<PdfPage, number> = new Dictionary<PdfPage, number>();
    /**
     * Internal variable for `page added event`.
     * @private
     */
    public pageAdded : PageAddedEventArgs; //event
    //Property
    /**
     * Gets the total `number of the pages`.
     * @private
     */
    public get count() : number {
        return this.countPages();
    }
    /**
     * Gets a `page index` from the document.
     * @private
     */
    public get pageCollectionIndex() : Dictionary<PdfPage, number> {
        return this.pdfPageCollectionIndex;
    }
    //constructor
    /**
     * Initializes a new instance of the `PdfPageCollection` class.
     * @private
     */
    constructor(document : PdfDocument) {
        this.document = document;
    }
    /**
     * Creates a page and `adds` it to the last section in the document.
     * @private
     */
    public add() : PdfPage
    /**
     * Creates a page and `adds` it to the last section in the document.
     * @private
     */
    public add(page : PdfPage) : void
    public add(page? : PdfPage) : PdfPage|void {
        if (typeof page === 'undefined') {
            let page : PdfPage = new PdfPage();
            this.add(page);
            return page;
        } else {
            let section : PdfSection = this.getLastSection();
            section.add(page);
        }
    }
    /**
     * Returns `last section` in the document.
     * @private
     */
    private getLastSection() : PdfSection {
        let sc : PdfSectionCollection = this.document.sections;
        if (sc.section.length === 0) {
            sc.add();
        }
        let section : PdfSection = sc.section[sc.section.length - 1];
        return section;
    }
    /**
     * Called when `new page has been added`.
     * @private
     */
    public onPageAdded(args : PageAddedEventArgs) : void {
        // if (PageAdded !== null)
        // {
        //     PageAdded(this, args);
        // }
    }
    /**
     * Gets the `total number of pages`.
     * @private
     */
    private countPages() : number {
        let sc : PdfSectionCollection = this.document.sections;
        let count : number = 0;
        for (let index : number = 0; index < sc.section.length; index++) {
            count += sc.section[index].count;
        }
        return count;
    }
    /**
     * Gets the `page object` from page index.
     * @private
     */
    public getPageByIndex(index : number) : PdfPage {
        return this.getPage(index);
    }
    /**
     * Gets a page by its `index` in the document.
     * @private
     */
    private getPage(index : number) : PdfPage {
        if ((index < 0) || (index >= this.count)) {
            throw Error('ArgumentOutOfRangeException("index", "Value can not be less 0")');
        }
        let page : PdfPage = null;
        let sectionStartIndex : number = 0;
        let sectionCount : number = 0;
        let pageIndex : number = 0;
        let length : number = this.document.sections.count;
        for (let i : number = 0; i < length; i++) {
            let section : PdfSection = this.document.sections.section[i];
            sectionCount = section.count;
            pageIndex = index - sectionStartIndex;
            // We found a section containing the page.
            if ((index >= sectionStartIndex && pageIndex < sectionCount)) {
                page = section.getPages()[pageIndex] as PdfPage;
                break;
            }
            sectionStartIndex += sectionCount;
        }
        return page;
    }
    /**
     * Gets the `index of` the page in the document.
     * @private
     */
    public indexOf(page : PdfPage) : number {
        let index : number = -1;
        if (page == null) {
            throw new Error('ArgumentNullException: page');
        } else {
            let numPages : number = 0;
            for (let i : number = 0, len : number = this.document.sections.count; i < len; i++) {
                let section : PdfSection = this.document.sections.pdfSectionCollection(i);
                index = section.indexOf(page);
                if (index >= 0) {
                    index += numPages;
                    break;
                } else {
                    index = -1;
                }
                numPages += section.count;
            }
        }
        return index;
    }
    /**
     * `Removes` the specified page.
     * @private
     */
    public remove(page : PdfPage) : PdfSection {
        if (page == null) {
            throw Error('ArgumentNullException("page")');
        }
        let section : PdfSection = null;
        let len : number;
        for (let i : number = 0, len : number = this.document.sections.count; i < len; i++) {
            section = this.document.sections.pdfSectionCollection(i);
            if (section.pages.contains(page)) {
                section.pages.remove(page);
                break;
            }
        }
        return section;
    }
}