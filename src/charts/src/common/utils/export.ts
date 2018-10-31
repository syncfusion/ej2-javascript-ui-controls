import { print as printWindow, createElement, isNullOrUndefined, Browser, SvgRenderer } from '@syncfusion/ej2-base';
import { Chart } from '../../chart/chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { getElement } from '../utils/helper';
import { ExportType } from '../utils/enum';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';
import { PdfPageOrientation, PdfDocument, PdfBitmap, SizeF, PdfMargins } from '@syncfusion/ej2-pdf-export';
import { RangeNavigator } from '../..';
/**
 * Export Functionalities
 */
/** @private */
interface IControlValue {
    width: number;
    height: number;
    svg: Element;
}
export class ExportUtils {
    private control: Chart | AccumulationChart | RangeNavigator;
    private printWindow: Window;

    /**
     * Constructor for chart and accumulation annotation
     * @param control 
     */
    constructor(control: Chart | AccumulationChart | RangeNavigator) {
        this.control = control;
    }

    /**
     * To print the accumulation and chart elements
     * @param elements 
     */
    public print(elements?: string[] | string | Element): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        let argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger(beforePrint, argsData);
        if (!argsData.cancel) {
            printWindow(argsData.htmlContent, this.printWindow);
        }
    }

    /**
     * To get the html string of the chart and accumulation
     * @param elements 
     * @private
     */
    public getHTMLContent(elements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                elements.forEach((value: string) => {
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                });
            } else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(elements).cloneNode(true) as Element);
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
    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator)[],
        width?: number, height?: number
    ): void {
        let controlValue: IControlValue = this.getControlsValue(controls);
        width = width ? width : controlValue.width;
        height = height ? height : controlValue.height;
        let element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': width.toString(),
                'height': height.toString()
            }
        });
        let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        let svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            controlValue.svg.outerHTML +
            '</svg>';
        let url: string = window.URL.createObjectURL(
            new Blob(
                type === 'SVG' ? [svgData] :
                    [(new XMLSerializer()).serializeToString(controlValue.svg)],
                { type: 'image/svg+xml' }
            )
        );
        if (type === 'SVG') {
            this.triggerDownload(
                fileName, type,
                url, isDownload
            );
        } else {
            let image: HTMLImageElement = new Image();
            let ctx: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    let document: PdfDocument = new PdfDocument();
                    let margin: PdfMargins = document.pageSettings.margins;
                    let pdfDefaultWidth: number = document.pageSettings.width;
                    let pdfDefaultHeight: number = document.pageSettings.height;
                    let exactWidth: number; let exactHeight: number;
                    let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    document.pageSettings.orientation = orientation;
                    exactWidth = (pdfDefaultWidth < width) ? (width + margin.left + margin.right) : pdfDefaultWidth;
                    exactHeight = (pdfDefaultHeight < height) ? (height + margin.top + margin.bottom) : pdfDefaultHeight;
                    document.pageSettings.size = new SizeF(exactWidth, exactHeight);
                    imageString = imageString.slice(imageString.indexOf(',') + 1);
                    document.pages.add().graphics.drawImage(
                        new PdfBitmap(imageString), 0, 0, width, height
                    );
                    if (isDownload) {
                        document.save(fileName + '.pdf');
                        document.destroy();
                    }
                } else {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(element.msToBlob(), fileName + '.' + (type as string).toLocaleLowerCase());
                    } else {
                        this.triggerDownload(
                            fileName, type,
                            element.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                            isDownload
                        );
                    }
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
    public triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
        createElement('a', {
            attrs: {
                'download': fileName + '.' + (type as string).toLocaleLowerCase(),
                'href': url
            }
        }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    }
    /**
     * To get the maximum size value
     * @param controls 
     * @param name 
     */
    private getControlsValue(controls: (Chart | RangeNavigator | AccumulationChart)[]): IControlValue {
        let width: number = 0;
        let height: number = 0;
        let content: string = '';
        let svgObject: Element = new SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        controls.map((control: Chart | RangeNavigator | AccumulationChart) => {
            let svg: Node = control.svgObject.cloneNode(true);
            let groupEle: Element = control.renderer.createGroup({
                style: 'transform: translateY(' + height + 'px)'
            });
            groupEle.appendChild(svg);
            width = Math.max(control.availableSize.width, width);
            height += control.availableSize.height;
            content += control.svgObject.outerHTML;
            svgObject.appendChild(groupEle);
        });
        svgObject.setAttribute('width', width + '');
        svgObject.setAttribute('height', height + '');
        return {
            'width': width,
            'height': height,
            'svg': svgObject
        };
    }
}