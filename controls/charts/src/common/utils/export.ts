/* eslint-disable @typescript-eslint/no-inferrable-types */
import { print as printWindow, createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Chart } from '../../chart/chart';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { getElement, removeElement } from '../utils/helper';
import { ExportType } from '../utils/enum';
import { IPrintEventArgs, IAfterExportEventArgs } from '../../chart/model/chart-interface';
import { beforePrint, afterExport } from '../model/constants';
import {
    PdfPageOrientation, PdfDocument, PdfBitmap, SizeF, PdfMargins, PdfStandardFont, PdfPageTemplateElement,
    PdfSolidBrush, PdfColor
} from '@syncfusion/ej2-pdf-export';
import { RangeNavigator } from '../..';
import { StockChart } from '../../stock-chart/stock-chart';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { IPDFArgs } from '../../common/model/interface';

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
    private control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart;
    private printWindow: Window;

    /**
     * Constructor for chart and accumulation annotation
     *
     * @param control
     */

    constructor(control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart) {
        this.control = control;
    }

    /**
     * To print the accumulation and chart elements
     *
     * @param elements
     */

    public print(elements?: string[] | string | Element): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger(beforePrint, argsData);
        if (!argsData.cancel) {
            printWindow(argsData.htmlContent, this.printWindow);
        }
    }

    /**
     * To get the html string of the chart and accumulation
     *
     * @param elements
     * @private
     */

    public getHTMLContent(elements?: string[] | string | Element): Element {
        const div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                for (let j: number = 0; j < elements.length; j++) {
                    const value: string = elements[j];
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                }
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
     *
     * @param type
     * @param fileName
     */

    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart)[],
        width?: number, height?: number, isVertical?: boolean,
        header?: IPDFArgs, footer?: IPDFArgs
    ): void {
        const controlValue: IControlValue = this.getControlsValue(controls, isVertical);
        width = width ? width : controlValue.width;
        height = height ? height : controlValue.height;
        let element: HTMLCanvasElement = this.control.svgObject as HTMLCanvasElement;
        const isCanvas: boolean = (this.control as Chart).enableCanvas;
        let image: string;
        if (!isCanvas) {
            element = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': width.toString(),
                    'height': height.toString()
                }
            });
        }
        const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            controlValue.svg.outerHTML +
            '</svg>';
        const url: string = window.URL.createObjectURL(
            new Blob(
                type === 'SVG' ? [svgData] :
                    [(new XMLSerializer()).serializeToString(controlValue.svg)],
                { type: 'image/svg+xml' }
            )
        );
        if (type === 'SVG') {
            if (Browser.info.name === 'msie') {
                const svg: Blob = new Blob([(new XMLSerializer()).serializeToString(controlValue.svg)], { type: 'application/octet-stream' });
                window.navigator.msSaveOrOpenBlob(svg, fileName + '.' + type.toLocaleLowerCase());
            } else {
                this.triggerDownload(fileName, type, url, isDownload);
            }
        } else if (Browser.info.name === 'msie') {
            let canvas: HTMLCanvasElement = element;
            if (!isCanvas) {
                canvas = this.createCanvas();
            }
            image = canvas.toDataURL();
            if (type === 'PDF') {
                this.exportPdf(canvas, orientation, width, height, isDownload, fileName, header, footer);
            } else {
                this.doexport(type, image, fileName);
            }
        } else {
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    this.exportPdf(element, orientation, width, height, isDownload, fileName, header, footer);
                } else {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(element.toBlob(null), fileName + '.' + (type as string).toLocaleLowerCase());
                    } else {
                        this.triggerDownload(
                            fileName, type,
                            element.toDataURL('image/' + type.toLowerCase()),
                            isDownload
                        );
                    }
                }
            });
            image.src = url;

        }
        if (!isCanvas) {
            removeElement(document.getElementById(this.control.element.id + '_canvas'));
        }
    }
    /**
     * To get data url for charts.
     *
     * @param chart
     */

    public getDataUrl(chart: Chart | AccumulationChart): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string } {
        const controlValue: IControlValue = this.getControlsValue([chart]);
        let element: HTMLCanvasElement = this.control.svgObject as HTMLCanvasElement;
        const isCanvas: boolean = (this.control as Chart).enableCanvas;
        if (!isCanvas) {
            element = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': controlValue.width.toString(),
                    'height': controlValue.height.toString()
                }
            });
        }
        const url: string = window.URL.createObjectURL(
            new Blob(
                [(new XMLSerializer()).serializeToString(controlValue.svg)],
                { type: 'image/svg+xml' }
            )
        );
        if (Browser.info.name === 'msie') {
            let canvas: HTMLCanvasElement = element;
            if (!isCanvas) {
                canvas = this.createCanvas();
            }
            const argsData: IAfterExportEventArgs = {
                name: afterExport, cancel: false, dataUrl: element.toDataURL('image/png')
            };
            chart.trigger(afterExport, argsData);
            return { element: canvas, dataUrl: canvas.toDataURL() };
        } else {
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                const argsData: IAfterExportEventArgs = {
                    name: afterExport, cancel: false, dataUrl: element.toDataURL('image/png')
                };
                chart.trigger(afterExport, argsData);
                return argsData.dataUrl;
            });
            image.src = url;
            return { element: element, blobUrl: url };
        }
    }

    /**
     * To trigger the download element
     *
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
     *
     * @param controls
     * @param name
     */

    // eslint-disable-next-line max-len
    private getControlsValue(controls: (Chart | RangeNavigator | AccumulationChart | StockChart | BulletChart)[], isVertical?: boolean): IControlValue {
        let width: number = 0;
        let height: number = 0;
        const isCanvas: boolean = (this.control as Chart).enableCanvas;
        const svgObject: Element = new SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        controls.map((control: Chart | RangeNavigator | AccumulationChart | BulletChart | StockChart) => {
            const svg: Node = control.svgObject.cloneNode(true);
            const groupEle: Element = control.renderer.createGroup({
                style: (isNullOrUndefined(isVertical) || isVertical) ? 'transform: translateY(' + height + 'px)' :
                    'transform: translateX(' + width + 'px)'

            });
            const backgroundColor: string = (svg.childNodes[0] as HTMLElement).getAttribute('fill');
            if ((control.theme === 'Tailwind' || control.theme === 'TailwindDark')
                && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (svg.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            }
            if (!isCanvas) {
                groupEle.appendChild(svg);
            }
            let top: number = 0;
            let left: number = 0;
            if ((control as StockChart).stockLegendModule && (control as StockChart).legendSettings.visible) {
                if ((control as StockChart).legendSettings.position === "Bottom" || (control as StockChart).legendSettings.position === "Top" 
                || (control as StockChart).legendSettings.position === "Auto") {
                    top += (control as StockChart).stockLegendModule.legendBounds.height;
                } else if ((control as StockChart).legendSettings.position === "Left" || (control as StockChart).legendSettings.position === "Right") {
                    left += (control as StockChart).stockLegendModule.legendBounds.width;
                }
            }
            width = (isNullOrUndefined(isVertical) || isVertical) ? Math.max(control.availableSize.width + left, width) :
                width + control.availableSize.width + left;
            height = (isNullOrUndefined(isVertical) || isVertical) ? height + control.availableSize.height + top :
                Math.max(control.availableSize.height + top, height);

            if (!isCanvas) {
                svgObject.appendChild(groupEle);
            }
        });
        if (!isCanvas) {
            svgObject.setAttribute('width', width + '');
            svgObject.setAttribute('height', height + '');
        }
        return {
            'width': width,
            'height': height,
            'svg': svgObject
        };
    }
    private createCanvas(): HTMLCanvasElement {
        const chart: Chart = (this.control as Chart);
        this.canvasRender(true, chart);
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>chart.svgObject;
        this.canvasRender(false, chart);
        return canvas;
    }
    /**
     * To convert svg chart into canvas chart to fix export issue in IE
     * We cant export svg to other formats in IE
     *
     * @param enableCanvas
     * @param chart
     * @param enableCanvas
     * @param chart
     */

    private canvasRender(enableCanvas: boolean, chart: Chart): void {
        chart.enableCanvas = enableCanvas;
        chart['preRender']();
        chart['render']();
    }

    // eslint-disable-next-line max-len
    private exportPdf(element: HTMLCanvasElement, orientation: PdfPageOrientation, width: number, height: number, isDownload: boolean, fileName: string, header?: IPDFArgs, footer?: IPDFArgs): void {
        const document: PdfDocument = new PdfDocument();
        const margin: PdfMargins = document.pageSettings.margins;
        const pdfDefaultWidth: number = document.pageSettings.width;
        const pdfDefaultHeight: number = document.pageSettings.height;
        let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        document.pageSettings.orientation = orientation;
        const exactWidth: number = (pdfDefaultWidth < width) ? (width + margin.left + margin.right) : pdfDefaultWidth;
        const exactHeight: number = (pdfDefaultHeight < height) ? (height + margin.top + margin.bottom) : pdfDefaultHeight;
        if (header !== undefined) {
            const font: PdfStandardFont = new PdfStandardFont(1, header.fontSize || 15);
            const pdfHeader: PdfPageTemplateElement = new PdfPageTemplateElement(exactWidth, 40);
            pdfHeader.graphics.drawString(header.content + '', font, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), header.x, header.y, null);
            document.template.top = pdfHeader;
        }
        if (footer !== undefined) {
            const font: PdfStandardFont = new PdfStandardFont(1, footer.fontSize || 15);
            const pdfFooter: PdfPageTemplateElement = new PdfPageTemplateElement(exactWidth, 40);
            pdfFooter.graphics.drawString(footer.content + '', font, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), footer.x, footer.y, null);
            document.template.bottom = pdfFooter;
        }
        document.pageSettings.size = new SizeF(exactWidth, exactHeight);
        imageString = imageString.slice(imageString.indexOf(',') + 1);
        document.pages.add().graphics.drawImage(
            new PdfBitmap(imageString), 0, 0, width, height
        );
        if (isDownload) {
            document.save(fileName + '.pdf');
            document.destroy();
        }
    }
    private doexport(
        type: ExportType, image: string, fileName: string): void {
        let images: HTMLElement | string[] = [];
        const fileType: string = type || 'JPG';
        images = [image];
        this.exportImage(images, fileName, fileType, image);
    }
    private exportImage(images: string[] | HTMLElement, fileName: string, fileType: string, image: string): void {
        const buffers: ArrayBuffer[] = [];
        const length: number = (!(images instanceof HTMLElement)) ? images.length : 0;
        for (let g: number = 0; g < length; g++) {
            image = images[g];
            image = image.replace(/^data:[a-z]*;,/, '');
            const image1: string[] = image.split(',');
            const byteString: string = atob(image1[1]);
            const buffer: ArrayBuffer = new ArrayBuffer(byteString.length);
            const intArray: Uint8Array = new Uint8Array(buffer);
            for (let i: number = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            buffers.push(buffer);
        }
        for (let j: number = 0; j < buffers.length; j++) {
            const b: Blob = new Blob([buffers[j]], { type: 'application/octet-stream' });
            if (Browser.info.name === 'msie') {
                window.navigator.msSaveOrOpenBlob(b, fileName + '.' + fileType.toLocaleLowerCase());
            }
        }
    }
}
