import { createElement, isNullOrUndefined, Browser, print as printWindow } from '@syncfusion/ej2-base';
import { HeatMap} from '../../index';
import { ExportType, DrawType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { removeElement } from '../utils/helper';
import { SizeF, PdfMargins } from '@syncfusion/ej2-pdf-export';

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
    private control: HeatMap;
    private printWindow: Window;
    /**
     * Constructor for Heatmap
     *
     * @param  {HeatMap} control - specifies the control
     *
     */
    constructor(control : HeatMap) {
        this.control = control;
    }

    /**
     * To export the file as image/svg format
     *
     * @param type
     * @param fileName
     * @private
     */

    public export(
        type: ExportType, fileName: string, orientation?: PdfPageOrientation
    ): void {
        const controlValue: IControlValue = this.getControlsValue();
        const width: number = controlValue.width;
        const height: number = controlValue.height;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let element: any = this.control.svgObject;
        const isCanvas: boolean = (this.control as HeatMap). enableCanvasRendering;
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
            image = canvas.toDataURL(type);
            if (type === 'PDF') {
                this.exportPdf(canvas, orientation, width, height, isDownload, fileName);
            } else {
                this.doExport(type, image, fileName);
            }
        } else {
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    this.exportPdf(element, orientation, width, height, isDownload, fileName);
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
        if (!isCanvas) {
            const id : HTMLElement = document.getElementById(this.control.element.id);
            removeElement( id + '_canvas');
        }
    }
    /**
     * To trigger the download element
     *
     * @param fileName
     * @param type
     * @param url
     * @private
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

    private getControlsValue(): IControlValue {
        let width: number = 0;
        let height: number = 0;
        const isCanvas: boolean = (this.control as HeatMap).enableCanvasRendering;
        const svgObject: Element = new SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        const svg: Node = this.control.svgObject.cloneNode(true);
        const groupEle: Element = this.control.renderer.createGroup(
            {
                style: 'transform: translateY(' + height + 'px)'
            });
        if (!isCanvas) {
            groupEle.appendChild(svg);
        }
        width = Math.max(this.control.availableSize.width, width);
        height =  height + this.control.availableSize.height;

        if (!isCanvas) {
            svgObject.appendChild(groupEle);
        }
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
        const heatmap: HeatMap = (this.control as HeatMap);
        const renderMode: DrawType = heatmap.renderingMode;
        heatmap.renderingMode = 'Canvas';
        heatmap.refresh();
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>heatmap.svgObject;
        heatmap.renderingMode = renderMode;
        heatmap.refresh();
        return canvas;
    }

    private exportPdf(element: HTMLCanvasElement, orientation: PdfPageOrientation,
                      width: number, height: number, isDownload: boolean, fileName: string): void {
        const document: PdfDocument = new PdfDocument();
        const margin: PdfMargins = document.pageSettings.margins;
        const pdfDefaultWidth: number = document.pageSettings.width;
        const pdfDefaultHeight: number = document.pageSettings.height;
        let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        document.pageSettings.orientation = orientation;
        const exactWidth: number = (pdfDefaultWidth < width) ? (width + margin.left + margin.right) : pdfDefaultWidth;
        const exactHeight: number = (pdfDefaultHeight < height) ? (height + margin.top + margin.bottom) : pdfDefaultHeight;
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
    private doExport(
        type: ExportType, image: string, fileName: string): void {
        let images: HTMLElement | string[] = [];
        const fileType: string = type || 'JPG';
        images = [image];
        this.exportImage(images, fileName, fileType, image);
    }
    private exportImage(images:  string[] | HTMLElement, fileName: string, fileType: string, image: string): void {
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

    /**
     * To print the heatmap elements.
     *
     * @param elements
     * @private
     */

    public print(): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        if (this.control.renderingMode === 'SVG') {
            printWindow(this.getHTMLContent(), this.printWindow);
        } else {
            const element: HTMLCanvasElement = this.control.svgObject as HTMLCanvasElement;
            const dataUrl: string = element.toDataURL();
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
            });
            image.src = dataUrl;
            printWindow( image, this.printWindow);
        }
    }
    /**
     * To get the html string of the heatmap.
     *
     * @param elements
     * @private
     */

    private getHTMLContent(): Element {
        const div: Element = createElement('div');
        div.appendChild(this.control.element.cloneNode(true) as Element);
        return div;
    }
}
