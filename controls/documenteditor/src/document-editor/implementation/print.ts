import { DocumentHelper } from './viewer';
import { Page } from './viewer/page';
import { print } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Print class
 */
export class Print {
    /**
     * 
     * Gets module name.
     */
    private getModuleName(): string {
        return 'Print';
    }

    /**
     * Prints the current viewer
     * @param viewer 
     * @param printWindow 
     * @private
     */
    public print(documentHelper: DocumentHelper, printWindow?: Window): void {
        this.printWindow(documentHelper, navigator.userAgent, printWindow);
    }
    /**
     * Opens print window and displays current page to print.
     * @private
     */
    public printWindow(documentHelper: DocumentHelper, browserUserAgent: string, printWindow?: Window): void {
        let height: number = this.getPageHeight(documentHelper.pages);
        let width: number = this.getPageWidth(documentHelper.pages);
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
            // tslint:disable-next-line:max-line-length
            printWindow.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100 %; } img { height: 100 %; width: 100 %; display: block;}img { box-sizing: border-box; }br, button { display: none; }@page{ margin: 0cm; size:' + width.toString() + 'px ' + height.toString() + 'px; }@media print{ body { margin: 0cm; }</style></head> <body><center>');
        } else {
            // Internet Explorer and Edge
            // tslint:disable-next-line:max-line-length
            printWindow.document.write('<html><head><style>@page{margin:0;size:' + width.toString() + 'px ' + height.toString() + 'px;}</style></head><body><center>');
        }
        // tslint:disable-next-line:max-line-length
        printWindow.document.write(printElement.innerHTML + '</center><script> (function() { window.ready = true; })(); </script></body></html>');
        printElement = undefined;
        printWindow.document.close();
        printWindow.focus();
        let interval: number = setInterval(
            () => {
                if ((<{ ready: Function } & Window>printWindow).ready) {
                    printWindow.print();
                    printWindow.close();
                    clearInterval(interval);
                }
            },
            500);
    }
    /**
     * Generates print content.
     * @private
     */
    public generatePrintContent(documentHelper: DocumentHelper, element: HTMLDivElement): void {
        // Rendering canvas to print
        let htmlString: string = '';
        for (let i: number = 0; i < documentHelper.pages.length; i++) {
            let page: Page = documentHelper.pages[i];
            let pageHeight: number = page.boundingRectangle.height;
            let pageWidth: number = page.boundingRectangle.width;
            documentHelper.render.isPrinting = true;
            documentHelper.render.renderWidgets(page, 0, 0, 0, 0);
            let canvasURL: string = documentHelper.render.pageCanvas.toDataURL();
            documentHelper.render.isPrinting = false;
            // tslint:disable-next-line:max-line-length
            htmlString += '<div><img src=' + canvasURL + ' style="margin:0px;display:block;width: ' + pageWidth.toString() + 'px; height:' + pageHeight.toString() + 'px; "/></div><br/>';
        }
        element.innerHTML = htmlString;
    }
    /**
     * Gets page width.
     * @param pages 
     * @private
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
     *  Gets page height.
     * @private
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
     */
    public destroy(): void {
        return;
    }
}