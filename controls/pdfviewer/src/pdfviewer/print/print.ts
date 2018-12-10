import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement} from '@syncfusion/ej2-base';
/**
 * Print module
 */
export class Print {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private printViewerContainer: HTMLElement;
    // tslint:disable-next-line
    private frameDoc: any;
    // tslint:disable-next-line
    private iframe: any;
    /**
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    public print(): void {
        let pageIndex: number;
        if (this.pdfViewerBase.pageCount > 0) {
            // tslint:disable-next-line:max-line-length
            this.printViewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_print_viewer_container',
            className: 'e-pv-print-viewer-container'});
            this.pdfViewerBase.showPrintLoadingIndicator(true);
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'iframeprint';
            this.iframe.id = 'iframePrint';
            this.iframe.style.position = 'absolute';
            this.iframe.style.top = '-100000000px';
            document.body.appendChild(this.iframe);
            this.frameDoc = this.iframe.contentWindow ? this.iframe.contentWindow : this.iframe.contentDocument;
            this.frameDoc.document.open();
            setTimeout (
            () => {
            for (pageIndex = 0; pageIndex <= this.pdfViewerBase.pageCount; pageIndex++) {
                if (pageIndex < this.pdfViewerBase.pageCount) {
                let pageWidth: number = this.pdfViewerBase.getPageWidth(pageIndex);
                let pageHeight: number = this.pdfViewerBase.getPageHeight(pageIndex);
                this.pdfViewer.printModule.createRequestForPrint (pageIndex, pageWidth, pageHeight, this.pdfViewerBase.pageCount);
                } else {
                    this.printWindowOpen();
                }
            }
            },
            100);
        }
    }

    private createRequestForPrint(pageIndex: number, pageWidth: number, pageHeight: number, pageCount: number): void {
        let  proxy: Print = this;
        let request: XMLHttpRequest = new XMLHttpRequest();
        // tslint: disable-next-line:max-line-length
        let jsonObject: object = {pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
        hashId: this.pdfViewerBase.hashId, zoomFactor: this.pdfViewerBase.getZoomFactor() };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/PrintImages', false);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(jsonObject));
        let printImage: string = request.responseText;
        // tslint:disable-next-line
        let pageImage: any = new Image();
        pageImage.src = printImage;
        pageImage.height = pageHeight;
        pageImage.width = pageWidth;
        this.printViewerContainer.appendChild(pageImage);
    }

    private printWindowOpen(): void {
        let browserUserAgent: string = navigator.userAgent;
        // tslint: disable-next-line:max-line-length
        if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Safari') !== -1) ||
         (browserUserAgent.indexOf('Firefox')) !== -1) {
            //chrome and firefox
            this.frameDoc.document.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            this.frameDoc.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; }'
            + ' img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br,'
            + ' button { display: none; }} @page{margin:0mm; size:auto;}</style></head><body><center class="loader">');
        } else {
            //ie
            this.frameDoc.document.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            this.frameDoc.document.write('<html><head>'
            + '<style>html, body { height: 99%; } img { height: 99%; width: 100%; }@media print { body { margin: 0cm; }'
            + 'img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0mm; size:auto;}</style></head><body><center>');
        }
        this.frameDoc.document.write(this.printViewerContainer.outerHTML);
        this.pdfViewerBase.showPrintLoadingIndicator(false);
        setTimeout (
        () => {
                this.iframe.contentWindow.print();
                this.iframe.contentWindow.focus();
                document.body.removeChild(this.iframe);
        },
        200);
    }
    /**
     * @private
     */
    public destroy(): void {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Print';
    }

}
