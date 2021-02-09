import { PdfViewerBase, PdfViewer } from '../index';

/**
 * Navigation module
 */
export class Navigation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private pageNumber: number;

    /**
     * @private
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * Navigate to Next page of the PDF document
     * @returns void
     */
    public goToNextPage(): void {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber++;
        if (this.pageNumber <= this.pdfViewerBase.pageCount) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    }

    /**
     * Navigate to Previous page of the PDF document
     * @returns void
     */
    public goToPreviousPage(): void {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber--;
        if (this.pageNumber > 0) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    }

    /**
     * Navigate to given Page number
     * Note : In case if we have provided incorrect page number as argument it will retain the existing page
     * @param  {number} pageNumber - Defines the page number to navigate
     * @returns void
     */
    public goToPage(pageNumber: number): void {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        }
        this.pdfViewer.magnificationModule.resizeCanvas(pageNumber);
    }

    /**
     * Navigate to First page of the PDF document
     * @returns void
     */
    public goToFirstPage(): void {
        this.pageNumber = 0;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }

    /**
     * Navigate to Last page of the PDF document
     * @returns void
     */
    public goToLastPage(): void {
        this.pageNumber = this.pdfViewerBase.pageCount - 1;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }
    /**
     * @private
     */
    public destroy(): void {
        this.pageNumber = 0;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Navigation';
    }
}