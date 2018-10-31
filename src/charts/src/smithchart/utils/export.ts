import { print as smithchartPrint, createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Smithchart} from '../../index';
import { getElement } from '../utils/helper';
import { SmithchartExportType, smithchartBeforePrint } from '../utils/enum';
import { ISmithchartPrintEventArgs } from '../model/interface';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Annotation Module handles the Annotation for Maps 
 */
export class ExportUtils {
    private control: Smithchart ;
    private smithchartPrint: Window;

    /**
     * Constructor for Maps
     * @param control 
     */
    constructor(control: Smithchart) {
        this.control = control;
    }

    /**
     * To print the Maps
     * @param elements 
     */
    public print(elements?: string[] | string | Element): void {
        this.smithchartPrint = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.smithchartPrint.moveTo(0, 0);
        this.smithchartPrint.resizeTo(screen.availWidth, screen.availHeight);
        let argsData: ISmithchartPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: smithchartBeforePrint
        };
        this.control.trigger(smithchartBeforePrint, argsData);
        if (!argsData.cancel) {
            smithchartPrint(argsData.htmlContent, this.smithchartPrint);
        }
    }

    /**
     * To get the html string of the Maps 
     * @param svgElements 
     * @private
     */
    public getHTMLContent(svgElements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
        if (svgElements) {
            if (svgElements instanceof Array) {
                svgElements.forEach((value: string) => {
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                });
            } else if (svgElements instanceof Element) {
                div.appendChild(svgElements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(svgElements).cloneNode(true) as Element);
            }
        } else {
            div.appendChild(this.control.element.cloneNode(true) as Element);
        }
        return div;
    }
    /**
     * To export the file as image/svg format
     * @param type 
     * @param fileName 
     */
    public export(exportType: SmithchartExportType, fileName: string, orientation?: PdfPageOrientation): void {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        let svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            this.control.svgObject.outerHTML +
            '</svg>';
        let url: string = window.URL.createObjectURL(
            new Blob(
                exportType === 'SVG' ? [svgData] :
                    [(new XMLSerializer()).serializeToString(this.control.svgObject)],
                { type: 'image/svg+xml' }
            )
        );
        if (exportType === 'SVG') {
            this.triggerDownload(
                fileName, exportType,
                url, isDownload
            );
        } else {
            let image: HTMLImageElement = new Image();
            let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                if (exportType === 'PDF') {
                    let document: PdfDocument = new PdfDocument();
                    let imageString: string = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    document.pageSettings.orientation = orientation;
                    imageString = imageString.slice(imageString.indexOf(',') + 1);
                    document.pages.add().graphics.drawImage(
                        new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                    );
                    if (isDownload) {
                        document.save(fileName + '.pdf');
                        document.destroy();
                    }
                } else {

                    this.triggerDownload(
                        fileName, exportType,
                        canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                        isDownload
                    );
                }
            });
            image.src = url;

        }
    }
    /**
     * To trigger the download element
     * @param fileName 
     * @param type 
     * @param url 
     */
    public triggerDownload(fileName: string, exportType: SmithchartExportType, url: string, isDownload: boolean): void {
        createElement('a', {
            attrs: {
                'download': fileName + '.' + (exportType as string).toLocaleLowerCase(),
                'href': url
            }
        }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    }
}