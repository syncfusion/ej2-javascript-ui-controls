import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart, AccumulationChart } from '@syncfusion/ej2-charts';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { PdfPageOrientation, PdfDocument, PdfBitmap, PdfPage, SizeF, PdfSection, PdfMargins } from '@syncfusion/ej2-pdf-export';
import { BeforeExportEventArgs, ExportCompleteEventArgs } from '../../common/base/interface';
import { PivotView } from '../../pivotview/base';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
import { PdfExportProperties } from '@syncfusion/ej2-grids';

/**
 * `ChartExport` module is used to handle the Pivot Chart PDF export action.
 *
 * @hidden
 */
export class ChartExport {
    private parent: PivotView;
    /** @hidden */
    public exportProperties: BeforeExportEventArgs;
    /**
     * Constructor for chart and accumulation annotation
     *
     *  @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - string.
     * @private
     */
    protected getModuleName(): string {
        return 'chartExport';
    }

    /**
     * Method allow to export the pivot chart as PDF and image formats like PNG, JPEG, and SVG.
     *
     * @param {PdfExportProperties} pdfExportProperties - Allows to define the export properties for the chart.
     * @param {boolean} isMultipleExport - Allows to export multiple tables and charts into a single PDF document.
     * @param {Object} pdfDoc - Allows the export of an external PDF document along with current PDF document.
     * @param {boolean} isBlob - Allows the PDF document to be saved as blob data.
     * @returns {Promise<any>}
     * @hidden
     */

    public pdfChartExport(
        pdfExportProperties?: PdfExportProperties, pdfDoc?: Object, isMultipleExport?: boolean, isBlob?: boolean
    ): Promise<any> {   // eslint-disable-line @typescript-eslint/no-explicit-any
        const controls: (Chart | AccumulationChart)[] = [this.parent.chart];
        const chartInfo: IChartInfo = this.getChartInfo(controls);
        const width: number = chartInfo.width;
        const height: number = chartInfo.height;
        let element: HTMLCanvasElement = this.parent.chart.svgObject as HTMLCanvasElement;
        const isCanvas: boolean = (this.parent.chart as Chart).enableCanvas;
        if (!isCanvas) {
            element = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': width.toString(),
                    'height': height.toString()
                }
            });
        }
        const url: string = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(chartInfo.svg)], { type: 'image/svg+xml' }));
        const image: HTMLImageElement = new Image();
        const ctx: CanvasRenderingContext2D = element.getContext('2d');
        image.src = url;
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return new Promise((resolve) => {
            image.onload = (() => {
                let pdfDocument: PdfDocument;
                if (!isNullOrUndefined(pdfDoc)) {
                    pdfDocument = <PdfDocument>pdfDoc;
                } else {
                    pdfDocument = new PdfDocument();
                }
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                this.exportPdf(element, pdfDocument, isMultipleExport, isBlob, width, height, pdfExportProperties);
                resolve(pdfDocument);
            });
        });
    }

    private getChartInfo(controls: (Chart | AccumulationChart)[], isVertical?: boolean): IChartInfo {
        let width: number = 0;
        let height: number = 0;
        const isCanvas: boolean = (this.parent.chart as Chart).enableCanvas;
        const svgObject: Element = new SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        let backgroundColor: string;
        controls.map((control: Chart | AccumulationChart) => {
            const svg: Node = control.svgObject.cloneNode(true);
            const groupEle: Element = control.renderer.createGroup({
                style: (isNullOrUndefined(isVertical) || isVertical) ? 'transform: translateY(' + height + 'px)' :
                    'transform: translateX(' + width + 'px)'
            });
            backgroundColor = (svg.childNodes[0] as HTMLElement) ? (svg.childNodes[0] as HTMLElement).getAttribute('fill') : 'transparent';
            if (backgroundColor === 'transparent') {
                if (control.theme.indexOf('Dark') > -1 || control.theme === 'HighContrast') {
                    backgroundColor = 'rgba(0, 0, 0, 1)';
                } else {
                    backgroundColor = 'rgba(255, 255, 255, 1)';
                }
            }
            if (!isCanvas) {
                groupEle.appendChild(svg);
            }
            width = control.availableSize.width;
            height = control.availableSize.height;
            if (!isCanvas) {
                svgObject.appendChild(groupEle);
            }
        });
        if (!isCanvas) {
            svgObject.setAttribute('width', width + '');
            svgObject.setAttribute('height', height + '');
            svgObject.setAttribute('style', 'background-color: ' + backgroundColor + ';');
        }
        return {
            'width': width,
            'height': height,
            'svg': svgObject
        };
    }

    private exportPdf(
        element: HTMLCanvasElement, pdfDocument: PdfDocument, isMultipleExport?: boolean, isBlob?: boolean, width?: number,
        height?: number, pdfExportProperties?: PdfExportProperties
    ): Promise<any> {   // eslint-disable-line @typescript-eslint/no-explicit-any
        const documentSection: PdfSection = pdfDocument.sections.add() as PdfSection;
        const documentWidth: number = pdfDocument.pageSettings.width;
        let documentHeight: number = pdfDocument.pageSettings.height;
        const margin: PdfMargins = pdfDocument.pageSettings.margins;
        const chartWidth: number = (width + margin.left + margin.right);
        pdfDocument.pageSettings.size = new SizeF(chartWidth, documentHeight);
        const fileName: string = this.exportProperties.fileName ? this.exportProperties.fileName :
            (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.fileName)) ?
                pdfExportProperties.fileName : 'default';
        if (this.exportProperties.width || this.exportProperties.height) {
            pdfDocument.pageSettings.orientation = ((this.exportProperties.width > this.exportProperties.height) ||
                (!this.exportProperties.height && (this.exportProperties.width > documentHeight)) || (!this.exportProperties.width &&
                    (documentWidth > this.exportProperties.height))) ? PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
            pdfDocument.pageSettings.size = new SizeF(this.exportProperties.width ? this.exportProperties.width
                : documentWidth, this.exportProperties.height ? this.exportProperties.height : documentHeight);
        } else {
            pdfDocument.pageSettings.orientation = (this.exportProperties.orientation === 0 || this.exportProperties.orientation)
                ? this.exportProperties.orientation : (!isNullOrUndefined(pdfExportProperties) &&
                    !isNullOrUndefined(pdfExportProperties.pageOrientation)) ? (pdfExportProperties.pageOrientation === 'Landscape' ?
                        PdfPageOrientation.Landscape : PdfPageOrientation.Portrait) : PdfPageOrientation.Landscape;
            if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.pageSize)) {
                pdfDocument.pageSettings.size = PivotUtil.getPageSize(pdfExportProperties.pageSize);
            }
        }
        if (!isNullOrUndefined(this.exportProperties.pdfMargins)) {
            const margins: PdfMargins = pdfDocument.pageSettings.margins;
            margins.top = !isNullOrUndefined(this.exportProperties.pdfMargins.top) ? this.exportProperties.pdfMargins.top : margins.top;
            margins.bottom = !isNullOrUndefined(this.exportProperties.pdfMargins.bottom) ? this.exportProperties.pdfMargins.bottom :
                margins.bottom;
            margins.left = !isNullOrUndefined(this.exportProperties.pdfMargins.left) ? this.exportProperties.pdfMargins.left : margins.left;
            margins.right = !isNullOrUndefined(this.exportProperties.pdfMargins.right) ? this.exportProperties.pdfMargins.right :
                margins.right;
        }
        documentSection.setPageSettings(pdfDocument.pageSettings);
        documentHeight = pdfDocument.pageSettings.height;
        let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        imageString = imageString.slice(imageString.indexOf(',') + 1);
        const image: PdfBitmap = new PdfBitmap(imageString);
        const pdfPage: PdfPage = documentSection.pages.add();
        pdfPage.graphics.drawImage(image, 0, 0, (documentHeight < height || this.exportProperties.width
            || pdfDocument.pageSettings.size) ? pdfPage.getClientSize().width : chartWidth, documentHeight < height
            ? pdfPage.getClientSize().height : height);
        let blobPromise: Promise<{ blobData: Blob }>;
        if (isBlob || isMultipleExport) {
            if (isBlob) {
                blobPromise = pdfDocument.save();
            }
        } else {
            pdfDocument.save(fileName + '.pdf');
            pdfDocument.destroy();
        }
        const exportCompleteEventArgs: ExportCompleteEventArgs = {
            type: 'PDF',
            promise: isBlob ? blobPromise : null
        };
        this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
        return new Promise(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            pdfDocument;
        });
    }

    /**
     * To destroy the pdf export module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.exportProperties) {
            this.exportProperties = null;
        }
    }
}

/**
 * @hidden
 */
interface IChartInfo {
    width: number;
    height: number;
    svg: Element;
}
