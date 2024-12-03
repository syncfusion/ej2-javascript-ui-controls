import { PdfViewerBase, PdfViewer } from '../index';

/**
 * Navigation module
 */
export class Navigation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private pageNumber: number;

    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewer base
     * @private
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * Navigate to Next page of the PDF document
     *
     * @returns {void}
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
     *
     * @returns {void}
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
     *
     * @param  {number} pageNumber - Defines the page number to navigate
     * @returns {void}
     */
    public goToPage(pageNumber: number): void {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
            if (this.pdfViewer.enableThumbnail) {
                this.pdfViewer.thumbnailViewModule.updateScrollTopForThumbnail(pageNumber - 1);
            }
        }
        if (this.pdfViewer.magnificationModule)
        {
            this.pdfViewer.magnificationModule.resizeCanvas(pageNumber);
        }
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 1));
        if (textLayer) {
            textLayer.style.display = 'block';
        }
    }

    /**
     * Navigate to First page of the PDF document
     *
     * @returns {void}
     */
    public goToFirstPage(): void {
        this.pageNumber = 0;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }

    /**
     * Navigate to Last page of the PDF document
     *
     * @returns {void}
     */
    public goToLastPage(): void {
        this.pageNumber = this.pdfViewerBase.pageCount - 1;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.pageNumber = 0;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'Navigation';
    }
}
