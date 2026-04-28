import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../../common/utils/enum';
import { ExportUtils } from '../../common/utils/export';
import { beforeExport } from '../../common/model/constants';
import { IPDFArgs } from '../../common/model/interface';
import { Sankey } from '../sankey';
import { SankeyExportEventArgs, SankeyPrintEventArgs } from '../model/sankey-interface';

/**
 * The `SankeyExportModule` module is used to print and export the rendered chart.
 */
export class SankeyExport {

    private chart: Sankey;
    /**
     * Constructor for export module.
     *
     * @private
     */

    constructor(chart: Sankey) {
        this.chart = chart;
    }

    /**
     * Export the chart on the page to PNG, JPEG, or SVG format.
     *
     * @param {number} type - The format in which the chart will be exported.
     * @param {string} fileName - The name of the exported file.
     * @returns {void}
     *
     * @private
     */
    public export(type: ExportType, fileName: string): void {
        const exportChart: ExportUtils = new ExportUtils(this.chart);
        const exportEventArgs: SankeyExportEventArgs = {
            cancel: false, width: null, height: null
        };
        this.chart.trigger(beforeExport, exportEventArgs);
        if (!exportEventArgs.cancel) {
            exportChart.export(type, fileName, undefined, [this.chart]);
            this.chart.trigger('afterExport', exportEventArgs);
        }
    }
    /**
     * Export the chart on the page to a PDF document.
     *
     * @param {string} fileName - The name of the exported file.
     * @param {PdfPageOrientation} orientation - Page orientation (portrait or landscape).
     * @param {Sankey[]} controls - Array of controls to be exported.
     * @param {number} width - The width of the exported chart.
     * @param {number} height - The height of the exported chart.
     * @param {boolean} isVertical - Export the chart vertically or horizontally.
     * @param {string} header - Text to appear at the top of the exported PDF document.
     * @param {string} footer - Text to appear at the bottom of the exported PDF document.
     * @param {boolean} exportToMultiplePages - Export the chart to multiple PDF pages.
     * @returns {void}
     *
     * @private
     */
    public pdfExport(
        fileName: string,
        orientation?: PdfPageOrientation, controls?: (Sankey)[],
        width?: number, height?: number, isVertical?: boolean, header?: IPDFArgs, footer?: IPDFArgs, exportToMultiplePages?: boolean
    ): void {
        const exportChart: ExportUtils = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        const exportEventArgs: SankeyExportEventArgs = {
            cancel: false, width: width, height: height
        };
        this.chart.trigger(beforeExport, exportEventArgs);
        if (!exportEventArgs.cancel) {
            exportChart.export(
                'PDF', fileName, orientation, controls, width = exportEventArgs.width,
                height = exportEventArgs.height, isVertical, header, footer, exportToMultiplePages
            );
            this.chart.trigger('afterExport', exportEventArgs);
        }
    }
    /**
     * Gets a data URL for the rendered sankey chart as an HTML canvas element, including data URL and blob URL if available.
     *
     * @param {Sankey} chart - The sankey chart for which the data URL is requested.
     * @returns {{ element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string }} An object containing the HTML canvas element, data URL, and blob URL.
     *
     * @private
     */

    public getDataUrl(chart: Sankey): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string} {
        const exportUtil: ExportUtils = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart as Sankey);
    }
    /**
     * Triggers the beforePrint event before the chart is printed.
     *
     * @param {Element} htmlContent - The HTML content to be printed.
     * @returns {void}
     *
     * @private
     */
    public triggerBeforePrint(htmlContent: Element): void {
        const exportEventArgs: SankeyPrintEventArgs = {
            cancel: false, htmlContent: htmlContent
        };
        this.chart.trigger('beforePrint', exportEventArgs);
    }

    /**
     * Gets the module name for the current component.
     *
     * @returns {string} The module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'SankeyExport';
    }

    /**
     * To destroy the export modules.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}
