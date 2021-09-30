/* eslint-disable */
import { DocumentHelper } from './viewer';
import { Page } from './viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Print class
 */
export class Print {

    private getModuleName(): string {
        return 'Print';
    }

    /**
     * Prints the current viewer
     *
     * @private
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @param {Window} printWindow - Specifies the print window.
     * @returns {void}
     */
    public print(documentHelper: DocumentHelper, printWindow?: Window): void {
        this.printWindow(documentHelper, navigator.userAgent, printWindow);
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
        if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Firefox')) !== -1) {
            // Chrome and Firefox
            printWindow.document.write('<!DOCTYPE html>');
            printWindow.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100 %; } img { height: 100 %; width: 100 %; display: block;}img { box-sizing: border-box; }br, button { display: none; }@page{ margin: 0cm; size:' + width.toString() + 'px ' + height.toString() + 'px; }@media print{ body { margin: 0cm; }</style></head> <body><center>');
        } else {
            // Internet Explorer and Edge
            printWindow.document.write('<html><head><style>@page{margin:0;size:' + width.toString() + 'px ' + height.toString() + 'px;}</style></head><body><center>');
        }
        printWindow.document.write(printElement.innerHTML + '</center><script> (function() { window.ready = true; })(); </script></body></html>');
        printElement = undefined;
        printWindow.document.close();
        printWindow.focus();
        const interval: number = setInterval(
            () => {
                // eslint-disable-next-line
                if ((<{ ready: (Function) } & Window>printWindow).ready) {
                    printWindow.print();
                    printWindow.close();
                    clearInterval(interval);
                }
            },
            500);
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
            const prntPage: Page = documentHelper.pages[(pageNumber - 1)];
            const pgHeight: number = prntPage.boundingRectangle.height;
            const pgWidth: number = prntPage.boundingRectangle.width;
            documentHelper.render.isPrinting = true;
            documentHelper.render.renderWidgets(prntPage, 0, 0, 0, 0);
            //get the image data from the canvas
            const imageData: string = documentHelper.render.pageCanvas.toDataURL(imageType, 1);
            documentHelper.render.isPrinting = false;
            image = new Image();
            image.src = imageData;
            // tslint:disable-next-line:max-line-length
            image.setAttribute('style', 'margin:0px;display:block;width:' + pgWidth.toString() + 'px;height:' + pgHeight.toString() + 'px;');
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
        let htmlString: string = '';
        for (let i: number = 0; i < documentHelper.pages.length; i++) {
            const page: Page = documentHelper.pages[i];
            const pageHeight: number = page.boundingRectangle.height;
            const pageWidth: number = page.boundingRectangle.width;
            documentHelper.render.isPrinting = true;
            documentHelper.render.renderWidgets(page, 0, 0, 0, 0);
            const canvasURL: string = documentHelper.render.pageCanvas.toDataURL();
            documentHelper.render.isPrinting = false;
            htmlString += '<div><img src=' + canvasURL + ' style="margin:0px;display:block;width: ' + pageWidth.toString() + 'px; height:' + pageHeight.toString() + 'px; "/></div><br/>';
        }
        element.innerHTML = htmlString;
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
        return;
    }
}
