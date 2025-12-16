import { PdfViewer, PdfViewerBase } from '../index';

/**
 * `DirectPrint` module is used to handle the direct print functionality of PDF Viewer.
 * @hidden
 */
export class DefaultPrint {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;


    /**
     * @param {PdfViewer} pdfViewer - The PDF Viewer instance.
     * @param {PdfViewerBase} pdfViewerBase - The PDF Viewer Base instance.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * Creates a request for direct print functionality.
     * @returns {void}
     * @private
     */
    public createRequestForDirectPrint(): void {
        this.pdfViewer.printModule.canPrint = true;
        const jsonObject: any = this.pdfViewerBase.constructJsonDownload(true);
        if (this.pdfViewerBase.jsonDocumentId) {
            jsonObject.documentId = this.pdfViewerBase.jsonDocumentId;
        }
        jsonObject.enablePrintRotation = this.pdfViewer.enablePrintRotation;
        const data: Uint8Array = this.pdfViewer.pdfRendererModule.getDocumentAsUint8Array(jsonObject);
        if (this.pdfViewer.downloadFileName && (this.pdfViewer.downloadFileName !== this.pdfViewerBase.downloadFileName)) {
            this.pdfViewerBase.downloadFileName = this.pdfViewer.downloadFileName;
        }
        this.pdfViewer.firePrintEnd(this.pdfViewer.downloadFileName);
        if (this.pdfViewer.printMode === 'Default') {
            this.printPdfDirectlySameWindow(data);
        } else {
            this.printPdfDirectlyNewWindow(data, this.pdfViewerBase.downloadFileName);
        }
        this.pdfViewerBase.updateDocumentAnnotationCollections();
        this.pdfViewer.printModule.canPrint = false;
    }

    private createPdfBlobAndUrl(fileByteArray: Uint8Array): { blobUrl: string } {
        const pdfBlob: Blob = new Blob([fileByteArray], { type: 'application/pdf' });
        const blobUrl: string = URL.createObjectURL(pdfBlob);
        return { blobUrl };
    }

    private printPdfDirectlySameWindow(fileByteArray: Uint8Array): void {
        const { blobUrl } = this.createPdfBlobAndUrl(fileByteArray);
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        let hasPrinted: boolean = false;
        const tryPrint: () => void = (): void => {
            if (hasPrinted) {
                return;
            }
            hasPrinted = true;
            try {
                const contentWindow: Window | null = iframe.contentWindow;
                if (!contentWindow) {
                    throw new Error('Unable to access iframe content');
                }
                this.pdfViewerBase.showPrintLoadingIndicator(false);
                contentWindow.focus();
                contentWindow.print();
            } catch (error) {
                console.error('Error while trying to print:', error);
            }
        };
        iframe.onload = (): void => {
            tryPrint();
        };
    }

    private printPdfDirectlyNewWindow(fileByteArray: Uint8Array, fileName: string): void {
        const { blobUrl } = this.createPdfBlobAndUrl(fileByteArray);
        const screenWidth: number = window.screen.availWidth;
        const screenHeight: number = window.screen.availHeight;
        const windowFeatures: string = `width=${screenWidth},height=${screenHeight},top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no`;
        const printWindow: Window | null = window.open('', fileName, windowFeatures);
        if (!printWindow) {
            alert('Please allow pop-ups for this site.');
            return;
        }
        printWindow.addEventListener('beforeunload', () => {
            this.pdfViewerBase.showPrintLoadingIndicator(false);
        });
        const printDocument: Document = printWindow.document;
        const html: HTMLHtmlElement = printDocument.createElement('html');
        const head: HTMLHeadElement = printDocument.createElement('head');
        const body: HTMLBodyElement = printDocument.createElement('body');
        const title: HTMLTitleElement = printDocument.createElement('title');
        title.textContent = fileName;
        head.appendChild(title);
        const style: HTMLStyleElement = printDocument.createElement('style');
        style.textContent = `
            html, body {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
                display: block;
            }`;
        head.appendChild(style);
        const iframe: HTMLIFrameElement = printDocument.createElement('iframe');
        iframe.id = 'pdfFrame';
        iframe.src = `${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`;
        body.appendChild(iframe);
        const script: HTMLScriptElement = printDocument.createElement('script');
        script.textContent = `
            const iframe = document.getElementById('pdfFrame');
            iframe.onload = function () {
                const contentWindow = iframe.contentWindow;
                if (!contentWindow) {
                    console.error("Unable to access iframe content window.");
                    return;
                }
                contentWindow.focus();
                contentWindow.print();
                let focusLost = false;
                contentWindow.onafterprint = function () {
                    window.close();
                };
                const checkFocus = setInterval(function () {
                    if (document.hasFocus() && focusLost) {
                        clearInterval(checkFocus);
                        window.close();
                    } else if (!document.hasFocus()) {
                        focusLost = true;
                    }
                }, 500);
            };`;
        body.appendChild(script);
        html.appendChild(head);
        html.appendChild(body);
        printDocument.documentElement.replaceWith(html);
    }
}
