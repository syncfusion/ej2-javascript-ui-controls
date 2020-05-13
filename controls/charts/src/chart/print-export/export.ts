import { Chart } from '../chart';
import { AccumulationChart } from '../../accumulation-chart';
import { RangeNavigator } from '../../range-navigator';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../../common/utils/enum';
import { ExportUtils } from '../../common/utils/export';
import { StockChart } from '../../stock-chart';
import { beforeExport } from '../../common/model/constants';
import { IExportEventArgs } from '../model/chart-interface';
import { IPDFArgs } from '../../common/model/interface';

/**
 * `ExportModule` module is used to print and export the rendered chart.
 */
export class Export {

    private chart: Chart | AccumulationChart | RangeNavigator;

    /**
     * Constructor for export module.
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
    }

    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation, controls?: (Chart | AccumulationChart | RangeNavigator | StockChart)[],
        width?: number, height?: number, isVertical?: boolean, header ?: IPDFArgs, footer ?: IPDFArgs
    ): void {
        let exportChart: ExportUtils = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        let argsData: IExportEventArgs = {
            cancel: false, name: beforeExport, width: width, height: height
        };
        this.chart.trigger(beforeExport, argsData);
        if (!argsData.cancel) {
            exportChart.export(
                type, fileName, orientation, controls, width = argsData.width,
                height = argsData.height, isVertical, header, footer
            );
        }
    }
    /**
     * To get data url for charts.
     */
    public getDataUrl(chart: Chart): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string} {
        let exportUtil: ExportUtils = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart as Chart);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'Export';
    }
    /**
     * To destroy the chart.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart | AccumulationChart | RangeNavigator): void {
        // Destroy method performed here
    }
}
