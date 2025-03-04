import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Chart } from '../../chart/chart';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { removeElement } from '../utils/helper';
import { ExportType } from '../utils/enum';
import { IAfterExportEventArgs } from '../../common/model/interface';
import { afterExport } from '../model/constants';
import {
    PdfPageOrientation, PdfDocument, PdfBitmap, SizeF, PdfMargins, PdfStandardFont, PdfPageTemplateElement,
    PdfSolidBrush, PdfColor
} from '@syncfusion/ej2-pdf-export';
import { RangeNavigator } from '../..';
import { StockChart } from '../../stock-chart/stock-chart';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { IPDFArgs } from '../../common/model/interface';
import { Chart3D } from '../../chart3d';
import { CircularChart3D } from '../../circularchart3d';

/**
 * Export Functionalities
 */
/** @private */
interface IControlValue {
    width: number;
    height: number;
    svg: Element;
}
/** @private */
export class ExportUtils {
    private control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart | Chart3D | CircularChart3D;

    /**
     * Constructor for chart and accumulation annotation
     *
     * @param control
     */

    constructor(control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart | Chart3D | CircularChart3D) {
        this.control = control;
    }

    /**
     * To export the file as image/svg format.
     *
     * @param type
     * @param fileName
     */

    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart | Chart3D | CircularChart3D)[],
        width?: number, height?: number, isVertical?: boolean,
        header?: IPDFArgs, footer?: IPDFArgs, exportToMultiplePage?: boolean
    ): void {
        const controlValue: IControlValue[] = this.getControlsValue(controls, isVertical, (exportToMultiplePage && type === 'PDF'), type);
        const canvasElements: HTMLCanvasElement[] = [];
        const controlWidth: number[] = [];
        const controlHeight: number[] = [];
        const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        for (let i: number = 0; i < controlValue.length; i++) {
            controlWidth.push(width ? width : controlValue[i as number].width);
            controlHeight.push(height ? height : controlValue[i as number].height);
            let element: HTMLCanvasElement = controls[i as number].svgObject as HTMLCanvasElement;
            const isCanvas: boolean = (controls[i as number] as Chart).enableCanvas;
            let image: string;
            if (!isCanvas) {
                element = <HTMLCanvasElement>createElement('canvas', {
                    id: 'ej2-canvas',
                    attrs: {
                        'width': controlWidth[i as number].toString(),
                        'height': controlHeight[i as number].toString()
                    }
                });
            }
            const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                controlValue[i as number].svg.outerHTML +
                '</svg>';
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(controlValue[i as number].svg)],
                    { type: 'image/svg+xml' }
                )
            );
            if (type === 'SVG') {
                if (Browser.info.name === 'msie') {
                    const svg: Blob = new Blob([(new XMLSerializer()).serializeToString(controlValue[i as number].svg)], { type: 'application/octet-stream' });
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
                canvasElements.push(element);
                if (type === 'PDF') {
                    if (canvasElements.length === controlValue.length) {
                        this.exportPdf(canvasElements, orientation, controlWidth, controlHeight, isDownload, fileName, header, footer);
                    }
                } else {
                    this.doexport(type, image, fileName);
                }
            } else {
                const image: HTMLImageElement = new Image();
                const ctx: CanvasRenderingContext2D = element.getContext('2d');
                image.onload = (() => {
                    ctx.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    canvasElements.push(element);
                    if (type === 'PDF') {
                        if (canvasElements.length === controlValue.length) {
                            this.exportPdf(canvasElements, orientation, controlWidth, controlHeight, isDownload, fileName, header, footer);
                        }
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
                removeElement(document.getElementById(controls[i as number].element.id + '_canvas'));
            }
        }
    }
    /**
     * To get data url for charts.
     *
     * @param chart
     */

    public getDataUrl(
        chart: Chart | AccumulationChart | Chart3D | CircularChart3D ): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string } {
        const controlValue: IControlValue[] = this.getControlsValue([chart]);
        let element: HTMLCanvasElement = this.control.svgObject as HTMLCanvasElement;
        const isCanvas: boolean = (this.control as Chart).enableCanvas;
        if (!isCanvas) {
            element = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': controlValue[0].width.toString(),
                    'height': controlValue[0].height.toString()
                }
            });
        }
        const url: string = window.URL.createObjectURL(
            new Blob(
                [(new XMLSerializer()).serializeToString(controlValue[0].svg)],
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
     * To trigger the download element.
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
     * To get the maximum size value.
     *
     * @param {(Chart | RangeNavigator | AccumulationChart | StockChart | BulletChart | Chart3D | CircularChart3D)[]} controls - The array of controls to retrieve the maximum size value.
     * @param {boolean} isVertical - Indicates whether the orientation is vertical.
     * @param {boolean} isMultiPages - Indicates whether multiple pages are used.
     * @param {ExportType} type - The type of export.
     * @returns {IControlValue[]} - An array of control values.
     */
    private getControlsValue(controls: (Chart | RangeNavigator | AccumulationChart | StockChart | BulletChart | Chart3D |
    CircularChart3D)[], isVertical?: boolean, isMultiPages?: boolean, type?: ExportType): IControlValue[] {
        let width: number = 0;
        let height: number = 0;
        let svgObject: Element = new SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        const controlValues: IControlValue[] = [];
        let backgroundColor: string;
        for (let i: number = 0; i < controls.length; i++) {
            const control: Chart | RangeNavigator | AccumulationChart | StockChart | BulletChart | Chart3D |
            CircularChart3D = controls[i as number];
            if (control.enableRtl) { svgObject.setAttribute('direction', 'rtl'); }
            const isCanvas: boolean = (control as Chart).enableCanvas;
            const svg: Node = control.svgObject.cloneNode(true);
            const groupEle: Element = control.renderer.createGroup({
                style: (isNullOrUndefined(isVertical) || isVertical) ? 'transform: translateY(' + height + 'px)' :
                    'transform: translateX(' + width + 'px)'
            });
            backgroundColor = (svg.childNodes[0] as HTMLElement) ? (svg.childNodes[0] as HTMLElement).getAttribute('fill') : 'transparent';
            if (backgroundColor === 'transparent') {
                if (control.theme.indexOf('Dark') > -1 || control.theme.indexOf('HighContrast') > -1) {
                    backgroundColor = 'rgba(0, 0, 0, 1)';
                } else {
                    backgroundColor = 'rgba(255, 255, 255, 1)';
                }
            }
            if (!isCanvas) {
                if (control.getModuleName() === 'stockChart') {
                    (svg.childNodes[0].firstChild as HTMLElement).setAttribute('fill', backgroundColor);
                    for (let index: number = 1; index < svg.childNodes.length; index++) {
                        (svg.childNodes[index as number].childNodes[0] as HTMLElement).setAttribute('fill', backgroundColor);
                    }
                }
                else if (type === 'SVG') {
                    (svg.childNodes[0] as HTMLElement).setAttribute('fill', backgroundColor);
                }
                groupEle.appendChild(svg);
            }
            let top: number = 0;
            let left: number = 0;
            if ((control as StockChart).stockLegendModule && (control as StockChart).legendSettings.visible) {
                if ((control as StockChart).legendSettings.position === 'Bottom' || (control as StockChart).legendSettings.position === 'Top'
                || (control as StockChart).legendSettings.position === 'Auto') {
                    top += (control as StockChart).stockLegendModule.legendBounds.height;
                } else if ((control as StockChart).legendSettings.position === 'Left' || (control as StockChart).legendSettings.position === 'Right') {
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
            if (isMultiPages || i === controls.length - 1) {
                if ((!isMultiPages && !((this.control as Chart).enableCanvas)) || (isMultiPages && !isCanvas)) {
                    svgObject.setAttribute('width', width + '');
                    svgObject.setAttribute('height', height + '');
                    svgObject.setAttribute('style', 'background-color: ' + backgroundColor + ';');
                }
                controlValues.push({
                    'width': width,
                    'height': height,
                    'svg': svgObject
                });
            }
            if (isMultiPages && (i < controls.length)) {
                width = 0;
                height = 0;
                svgObject = new SvgRenderer('').createSvg({
                    id: 'Svg_Export_Element',
                    width: 200, height: 200
                });
            }
        }
        return controlValues;
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
    private exportPdf(element: HTMLCanvasElement[], orientation: PdfPageOrientation, width: number[], height: number[],
                      isDownload: boolean, fileName: string, header?: IPDFArgs, footer?: IPDFArgs): void {
        const document: PdfDocument = new PdfDocument();
        const margin: PdfMargins = document.pageSettings.margins;
        const pdfDefaultWidth: number = document.pageSettings.width;
        const pdfDefaultHeight: number = document.pageSettings.height;
        for (let i: number = 0; element.length > i; i++) {
            let imageString: string = element[i as number].toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
            document.pageSettings.orientation = orientation;
            const exactWidth: number = (pdfDefaultWidth < width[i as number]) ? (width[i as number] + margin.left + margin.right) :
                pdfDefaultWidth;
            const exactHeight: number = (orientation === 0 && pdfDefaultHeight > height[i as number]) ?
                (width[i as number] + margin.left + margin.right) : (pdfDefaultHeight < height[i as number]) ?
                    (height[i as number] + margin.top + margin.bottom) : pdfDefaultHeight;
            if (header !== undefined) {
                const font: PdfStandardFont = new PdfStandardFont(1, header.fontSize || 15);
                const pdfHeader: PdfPageTemplateElement = new PdfPageTemplateElement(exactWidth, 30);
                pdfHeader.graphics.drawString(header.content + '', font, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), header.x, header.y, null);
                document.template.top = pdfHeader;
            }
            if (footer !== undefined) {
                const font: PdfStandardFont = new PdfStandardFont(1, footer.fontSize || 15);
                const pdfFooter: PdfPageTemplateElement = new PdfPageTemplateElement(exactWidth, 30);
                pdfFooter.graphics.drawString(footer.content + '', font, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), footer.x, footer.y, null);
                document.template.bottom = pdfFooter;
            }
            document.pageSettings.size = new SizeF(exactWidth, exactHeight);
            imageString = imageString.slice(imageString.indexOf(',') + 1);
            document.pages.add().graphics.drawImage(
                new PdfBitmap(imageString), 0, 0, width[i as number], height[i as number]
            );
        }
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
    /**
     * Exports the given images as a file with the specified name and type.
     *
     * @param {string[] | HTMLElement} images - The images to be exported. Can be an array of image URLs or an HTML element containing the image.
     * @param {string} fileName - The name of the exported file.
     * @param {string} fileType - The type of the exported file (e.g., 'png', 'jpeg').
     * @param {string} image - The image data to be used for export.
     * @returns {void}
     * @private
     */
    public exportImage(images: string[] | HTMLElement, fileName: string, fileType: string, image: string): void {
        const buffers: ArrayBuffer[] = [];
        const length: number = (!(images instanceof HTMLElement)) ? images.length : 0;
        for (let g: number = 0; g < length; g++) {
            image = images[g as number];
            image = image.replace(/^data:[a-z]*;,/, '');
            const image1: string[] = image.split(',');
            const byteString: string = atob(image1[1]);
            const buffer: ArrayBuffer = new ArrayBuffer(byteString.length);
            const intArray: Uint8Array = new Uint8Array(buffer);
            for (let i: number = 0; i < byteString.length; i++) {
                intArray[i as number] = byteString.charCodeAt(i);
            }
            buffers.push(buffer);
        }
        for (let j: number = 0; j < buffers.length; j++) {
            const b: Blob = new Blob([buffers[j as number]], { type: 'application/octet-stream' });
            if (Browser.info.name === 'msie') {
                window.navigator.msSaveOrOpenBlob(b, fileName + '.' + fileType.toLocaleLowerCase());
            }
        }
    }
}
