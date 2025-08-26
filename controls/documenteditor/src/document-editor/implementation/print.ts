/* eslint-disable */
import { DocumentHelper } from './viewer';
import { Page } from './viewer/page';
import { isNullOrUndefined, updateCSSText } from '@syncfusion/ej2-base';
/**
 * Print class
 */
export class Print {

    private getModuleName(): string {
        return 'Print';
    }
    private windowPrint: Window = undefined;

    /**
     * Prints the current viewer
     *
     * @private
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @param {Window} printWindow - Specifies the print window.
     * @returns {void}
     */
    public print(documentHelper: DocumentHelper, printWindow?: Window): void {
        this.printWindow(documentHelper, navigator !== undefined ? navigator.userAgent : "", printWindow);
    }
    /**
     * Opens print window and displays current page to print.
     *
     * @private
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @param {string} browserUserAgent - Specifies the browser user agent.
     * @param {Window} printWindow - Specifies the print window.
     * @returns {void}
     */
    public printWindow(documentHelper: DocumentHelper, browserUserAgent: string, printWindow?: Window): void {
        const height: number = this.getPageHeight(documentHelper.pages);
        const width: number = this.getPageWidth(documentHelper.pages);
        let printElement: HTMLDivElement = document.createElement('div');
        printElement.style.width = '100%';
        printElement.style.height = '100%';
        printElement.style.overflow = 'scroll';
        // Rendering canvas to print
        this.generatePrintContent(documentHelper, printElement);

        if (isNullOrUndefined(printWindow)) {
            printWindow = window.open('', 'print', 'height=452,width=1024,tabbar=no');
        }
        this.windowPrint = printWindow;
        let pageSize: string = width.toString() + 'px ' + height.toString() + 'px';
        if (width > height) {
            pageSize = 'landscape';
        }
        if (browserUserAgent.indexOf('Chrome') !== -1) {
            // Chrome
            printWindow.document.write('<!DOCTYPE html>');
            printWindow.document.write('<html><head><title>' + documentHelper.owner.documentName + '</title><style>img { height: 100%; width: 100%; display: block;}img { box-sizing: border-box; }br, button { display: none; }@page{ margin: 0cm; size:' + pageSize + '; }@media print{ body { margin: 0cm; size:' + pageSize + '; }}</style></head> <body><center>');
        }
        else if (browserUserAgent.indexOf('Firefox') !== -1) {
            // Firefox
            printWindow.document.write('<!DOCTYPE html>');
            printWindow.document.write('<html moznomarginboxes mozdisallowselectionprint><head><title>' + documentHelper.owner.documentName + '</title><style>html, body { height: 100%; } img { height: 100%; width: 100%; display: block;}img { box-sizing: border-box; }br, button { display: none; }@page{ margin: 0cm; size:' + pageSize + '; }@media print{ body { margin: 0cm; size:' + pageSize + '; }}</style></head> <body><center>');
        } else {
            // Internet Explorer and Edge
            printWindow.document.write('<html><head><title>' + documentHelper.owner.documentName + '</title><style>@page{margin:0;size:' + pageSize + ';}</style></head><body><center>');
        }
        printWindow.document.write(printElement.innerHTML + '</center><script> (function() { window.ready = true; })(); </script></body></html>');
        printElement = undefined;
        printWindow.document.close();
        printWindow.focus();
        window.addEventListener('beforeunload', this.closePrintWindow);
        const interval: number = Number(setInterval(
            () => {
                // eslint-disable-next-line
                if ((<{ ready: (Function) } & Window>printWindow).ready) {
                    printWindow.print();
                    printWindow.close();
                    clearInterval(interval);
                }
            },
            500));
    }
    private closePrintWindow = (): void => {
        if (this.windowPrint && !this.windowPrint.closed) {
            this.windowPrint.close();
        }
    }
    /**
     * Generate Document Image.
     *
     * @param documentHelper
     * @param pageNumber
     * @param imageType
     * @private
     */
    public exportAsImage(documentHelper: DocumentHelper, pageNumber: number, imageType: string): HTMLImageElement {
        let image: HTMLImageElement;
        if (!isNullOrUndefined(pageNumber) && pageNumber <= documentHelper.pages.length && pageNumber >= 1) {
            const printPage: Page = documentHelper.pages[(pageNumber - 1)];
            const pgHeight: number = printPage.boundingRectangle.height;
            const pgWidth: number = printPage.boundingRectangle.width;
            documentHelper.render.isPrinting = true;
            documentHelper.render.renderWidgets(printPage, 0, 0, 0, 0);
            //get the image data from the canvas
            const imageData: string = documentHelper.render.pageCanvas.toDataURL(imageType, 1);
            documentHelper.render.isPrinting = false;
            image = new Image();
            image.src = imageData;
            // tslint:disable-next-line:max-line-length
            image.style.cssText = `margin: 0px; display: block; width: ${pgWidth}px; height: ${pgHeight}px;`;
        }
        return image;
    }

    /**
     * Generates print content.
     *
     * @private
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @param {HTMLDivElement} element - Specifies the element.
     * @returns {void}
     */
    public generatePrintContent(documentHelper: DocumentHelper, element: HTMLDivElement): void {
        // Rendering canvas to print
        element.innerHTML = '';
        for (let i: number = 0; i < documentHelper.pages.length; i++) {
            const page: Page = documentHelper.pages[i];
            const pageHeight: number = page.boundingRectangle.height;
            const pageWidth: number = page.boundingRectangle.width;
            documentHelper.render.isPrinting = true;
            documentHelper.render.renderWidgets(page, 0, 0, pageWidth, 0);
            const canvasURL: string = documentHelper.render.pageCanvas.toDataURL();
            documentHelper.render.isPrinting = false;
            const div = document.createElement('div');
            const img = document.createElement('img');
            img.src = canvasURL;
            let cssText: string = `margin:0px;display:block;width:${pageWidth}px;height:${pageHeight}px`;
            updateCSSText(img, cssText);
            div.appendChild(img);
            element.appendChild(div);
            if (i !== documentHelper.pages.length - 1) {
                element.appendChild(document.createElement('br'));
            }
        }
    }
    /**
     * Gets page width.
     *
     * @private
     * @param {Page} pages - Specifies the pages.
     * @returns {number} - Returns the page width.
     */
    public getPageWidth(pages: Page[]): number {
        let width: number = 0;
        for (let i: number = 0; i < pages.length; i++) {
            if (width < pages[i].boundingRectangle.width) {
                width = pages[i].boundingRectangle.width;
            }
        }
        return width;
    }
    /**
     * Gets page height.
     *
     * @private
     * @param {Page} pages - Specifies the pages.
     * @returns {number} - Returns the page height.
     */
    public getPageHeight(pages: Page[]): number {
        let height: number = 0;
        for (let i: number = 0; i < pages.length; i++) {
            if (height < pages[i].boundingRectangle.height) {
                height = pages[i].boundingRectangle.height;
            }
        }
        return height;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        window.removeEventListener('beforeunload', this.closePrintWindow);
        this.windowPrint = undefined;
        return;
    }
}
