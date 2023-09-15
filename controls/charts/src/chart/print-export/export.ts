/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { Chart } from '../chart';
import { AccumulationChart, AccumulationSeries, AccumulationSeriesModel } from '../../accumulation-chart';
import { RangeNavigator, RangeNavigatorSeriesModel } from '../../range-navigator';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../../common/utils/enum';
import { ExportUtils } from '../../common/utils/export';
import { StockChart, StockSeriesModel } from '../../stock-chart';
import { beforeExport } from '../../common/model/constants';
import { IExportEventArgs } from '../model/chart-interface';
import { IPDFArgs } from '../../common/model/interface';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { ErrorBarSettingsModel, Series, SeriesModel, AxisModel } from '../../chart';

/**
 * Defines the cell style in an Excel export.
 */
interface ExcelCellStyle {
    /**
     * Defines the horizontal alignment for cell style.
     */
    hAlign?: string;
    /**
     * Defines the vertical alignment for cell style.
     */
    vAlign?: string;
    /**
     * Defines the bold style for fonts.
     */
    bold?: boolean;
    /**
     * Defines whether to wrap text for cell style.
     */
    wrapText?: boolean;
}
/**
 * Defines the cell in an Excel export.
 */
interface ExcelCell {
    /**
     * Defines the index for the cell.
     */
    index?: number;
    /**
     * Defines the column span for the cell.
     */
    colSpan?: number;
    /**
     * Defines the row span for the cell.
     */
    rowSpan?: number;
    /**
     * Defines the value of the cell.
     */
    value?: string | boolean | number | Date ;
    /**
     * Defines the style of the cell.
     */
    style?: ExcelCellStyle;
}
/**
 * Defines the row and column in an Excel export.
 */
interface ExcelRowAndColumn {
    /**
     * Defines the index for cells.
     */
    index?: number;
    /**
     * Defines the cells in a row and column.
     */
    cells?: ExcelCell[];
    /**
     * Defines the width of each row and column.
     */
    width?: number;
}
/**
 * `ExportModule` module is used to print and export the rendered chart.
 */
export class Export {

    private chart: Chart | AccumulationChart | RangeNavigator;
    private rows: ExcelRowAndColumn[];
    private actualRowCount: number = 0;
    private series: SeriesModel[] | AccumulationSeriesModel[] | RangeNavigatorSeriesModel[] | StockSeriesModel[] = [];
    private axisCollection: AxisModel[] = [];
    private requiredValuesLength: number = 0;
    private histogramSeriesCount: number = 0;
    /**
     * Constructor for export module.
     *
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
    }

    /**
     * Handles the export method for chart control.
     */
    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation, controls?: (Chart | AccumulationChart | RangeNavigator | StockChart)[],
        width?: number, height?: number, isVertical?: boolean, header ?: IPDFArgs, footer ?: IPDFArgs, exportToMultiplePage?: boolean
    ): void {
        const exportChart: ExportUtils = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        const argsData: IExportEventArgs = {
            cancel: false, name: beforeExport, width: width, height: height
        };
        this.chart.trigger(beforeExport, argsData);
        if (!argsData.cancel) {
            if (type === 'CSV' || type === 'XLSX') {
                this.excelExport(controls, fileName, type);
            }
            else {
                exportChart.export(
                    type, fileName, orientation, controls, width = argsData.width,
                    height = argsData.height, isVertical, header, footer, exportToMultiplePage
                );
            }
        }
    }
    /**
     * To handle the export of XLSX and CSV files.
     */
    private excelExport(controls: (Chart | AccumulationChart | RangeNavigator | StockChart)[], fileName: string, type: ExportType): void{
        this.rows = [];
        this.actualRowCount = 1;
        const workSheets: Object[] = [];
        let requiredValues: string[][] = [];
        const headerStyle: ExcelCellStyle = { bold: true, hAlign: 'Center', vAlign: 'Center', wrapText: true };
        let xValues: number[][] = [];
        const isRangeNavigator: boolean = controls[0].getModuleName() === 'rangeNavigator';
        const isAccumulation: boolean = controls[0].getModuleName() === 'accumulationchart';
        this.series = isRangeNavigator ? controls[0].series : (controls[0] as Chart | AccumulationChart | StockChart).visibleSeries;
        if (isRangeNavigator && this.series.length === 0) {
            if (controls[0].dataSource) {
                //To create an Excel sheet when the Rangenavigator series is not given.
                this.createRangeNavigatorExcelSheet(controls[0] as RangeNavigator, headerStyle, type);
            }
        }
        else {
            this.histogramSeriesCount = 0;
            this.requiredValuesLength = 0;
            this.axisCollection = [];
            if (isAccumulation || isRangeNavigator) {
                this.axisCollection.push(null);
            }
            else {
                this.axisCollection = controls[0].getModuleName() === 'stockChart' ? (controls[0] as StockChart).chart.horizontalAxes : (controls[0] as Chart).horizontalAxes;
            }
            //To get the number of columns for the excel.
            requiredValues = this.getRequiredValues(isRangeNavigator);
            if (this.requiredValuesLength === 0 && this.series.length === this.histogramSeriesCount) {
                return;
            }
            //To get all x values in the series.
            xValues = this.getXValue(requiredValues, controls, isRangeNavigator, isAccumulation);
            //To get the the chart title and series name.
            this.getTitle(requiredValues, headerStyle, controls, isRangeNavigator, isAccumulation, type, xValues[0].length);
            //To create an Excel sheet.
            this.createExcelSheet(isRangeNavigator, isAccumulation, xValues, type, requiredValues, headerStyle, controls);
        }
        const columns: ExcelRowAndColumn[] = [];
        this.requiredValuesLength = this.requiredValuesLength === 0 ? 1 : this.requiredValuesLength;
        for (let columnCount: number = 0; columnCount < this.requiredValuesLength; columnCount++) {
            columns.push({ index: columnCount + 1, width: 100 });
        }
        workSheets.push({ columns: columns, rows: this.rows });
        const book: Workbook = new Workbook({ worksheets: workSheets }, type === 'XLSX' ? 'xlsx' : 'csv');
        fileName = fileName ? fileName : type === 'XLSX' ? 'XLSX' : 'CSV';
        book.save(fileName +  (type === 'XLSX' ? '.xlsx' : '.csv'));
    }
    /**
     * To create an Excel sheet when the Rangenavigator series is not given.
     */
    private createRangeNavigatorExcelSheet(controls: RangeNavigator,
                                           headerStyle: ExcelCellStyle, type: ExportType): void {
        const xName: string = controls.xName;
        const yName: string = controls.yName;
        this.rows.push({
            index: this.actualRowCount, cells: [{ index: 1, value: controls.valueType.indexOf('DateTime') > -1 ? controls.valueType : 'Category', colSpan: 1, rowSpan: 1,
                style: headerStyle },
            { index: 2, value: yName, colSpan: 1, rowSpan: 1, style: headerStyle }]
        });
        this.actualRowCount++;
        const dataSource: Object[] = controls.dataSource as Object[];
        for (let dataCount: number = 0; dataCount < dataSource.length; dataCount++) {
            this.rows.push({ index: this.actualRowCount, cells: [{ index: 1, value: (type === 'CSV' && dataSource[dataCount as number][xName as string] === null) ? '' :
                dataSource[dataCount as number][xName as string] , colSpan: 1, rowSpan: 1, style: headerStyle },
            { index: 2, value:  (type === 'CSV' && dataSource[dataCount as number][yName as string] === null) ? '' : dataSource[dataCount as number][yName as string], colSpan: 1, rowSpan: 1, style: {} }] });
            this.actualRowCount++;
        }
        this.requiredValuesLength = 2;
    }
    /**
     * To get the number of columns for the excel.
     */
    private getRequiredValues(isRangeNavigator: boolean): string[][] {
        const requiredValues: string[][] = [];
        for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
            const seriesType: string = this.series[seriesCount as number].type;
            if ((!isRangeNavigator && !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible) || (this.series[seriesCount as number] as Series).category === 'TrendLine') {
                requiredValues.push([]);
                continue;
            }
            if (seriesType === 'Histogram') {
                requiredValues.push([]);
                this.histogramSeriesCount++;
            }
            else if ((this.series[seriesCount as number] as Series).category === 'Pareto') {
                requiredValues.push([this.series[seriesCount as number]['xName'], 'y']);
            }
            else if (seriesType.indexOf('Range') !== -1 || seriesType === 'Hilo') {
                requiredValues.push([this.series[seriesCount as number]['xName'], this.series[seriesCount as number]['high'], this.series[seriesCount as number]['low']]);
            }
            else if (seriesType === 'HiloOpenClose' || seriesType === 'Candle') {
                requiredValues.push([this.series[seriesCount as number]['xName'], this.series[seriesCount as number]['high'], this.series[seriesCount as number]['low'], this.series[seriesCount as number]['open'], this.series[seriesCount as number]['close']]);
                if (seriesType === 'Candle' && this.series[seriesCount as number]['volume'] !== '') {
                    requiredValues[seriesCount as number].push(this.series[seriesCount as number]['volume']);
                }
            }
            else if (seriesType === 'BoxAndWhisker') {
                requiredValues.push([this.series[seriesCount as number]['xName'], 'maximum', 'upperQuartile', 'median', 'lowerQuartile', 'minimum', 'outliers']);
            }
            else if (seriesType === 'Bubble') {
                requiredValues.push([this.series[seriesCount as number]['xName'], this.series[seriesCount as number]['yName']]);
                if (this.series[seriesCount as number]['size'] !== '') {
                    requiredValues[seriesCount as number].push(this.series[seriesCount as number]['size']);
                }
            }
            else if (seriesType === 'Pie') {
                requiredValues.push([this.series[seriesCount as number]['xName'], this.series[seriesCount as number]['yName']]);
                if (this.series[seriesCount as number]['radius'].match(/[a-zA-Z]/)) {
                    requiredValues[seriesCount as number].push(this.series[seriesCount as number]['radius']);
                }
            }
            else {
                requiredValues.push([this.series[seriesCount as number]['xName'], this.series[seriesCount as number]['yName']]);
            }
            if ((this.series[seriesCount as number] as SeriesModel).errorBar &&
                (this.series[seriesCount as number] as SeriesModel).errorBar.visible) {
                const errorBar: ErrorBarSettingsModel = (this.series[seriesCount as number] as SeriesModel).errorBar;
                const errorTypes: string[] = ['verticalError', 'horizontalError', 'verticalNegativeError', 'horizontalNegativeError', 'verticalPositiveError', 'horizontalPositiveError'];
                errorTypes.forEach((errorType: string) => {
                    if (typeof errorBar[errorType as string] === 'string') {
                        requiredValues[seriesCount as number].push(errorBar[errorType as string]);
                    }
                });
            }
            this.requiredValuesLength += requiredValues[seriesCount as number].length;
        }
        return requiredValues;
    }
    /**
     * To obtain the chart title and series name.
     */
    private getTitle (requiredValues: string[][], headerStyle: ExcelCellStyle,
                      controls: (Chart | AccumulationChart | RangeNavigator | StockChart)[],
                      isRangeNavigator : boolean, isAccumulation: boolean, type: ExportType, xValueLength: number) : void {
        let cells: ExcelCell[] = [];
        const additionalCells: ExcelCell[] = [];
        let index: number = 1;
        let isTitle: boolean = false;
        if (!isRangeNavigator && type === 'XLSX' && (controls[0] as Chart | AccumulationChart | StockChart).title) {
            this.rows.push({});
            this.actualRowCount++;
            isTitle = true;
        }
        for (let axisCount: number = 0; axisCount < this.axisCollection.length; axisCount++) {
            if (isAccumulation && xValueLength === 0) {
                break;
            }
            let isYName: boolean = false;
            let valueType: string = '';
            const currentIndex: number = index;
            let isXValue: boolean = false;
            const axisName: string = this.axisCollection[axisCount as number] !== null ? this.axisCollection[axisCount as number].name === 'primaryXAxis' ? null : this.axisCollection[axisCount as number].name : '';
            for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                if (!isRangeNavigator && ((!isAccumulation && (axisName !==
                    (this.series[seriesCount as number] as SeriesModel | StockSeriesModel).xAxisName)) ||
                    !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible ||
                    (this.series[seriesCount as number] as Series).category === 'TrendLine' || (this.series[seriesCount as number] as Series).type === 'Histogram')) {
                    continue;
                }
                if (!isXValue) {
                    cells.push({});
                    index++;
                }
                isXValue = true;
                const seriesName: string = (this.series[seriesCount as number] as SeriesModel |
                AccumulationSeriesModel | StockSeriesModel).name;
                const requiredValuesLength: number = this.series[seriesCount as number].type === 'BoxAndWhisker' ? requiredValues[seriesCount as number].length - 1 : requiredValues[seriesCount as number].length;
                if (requiredValues[seriesCount as number][1] === this.series[seriesCount as number].yName) {
                    for (let requiredValuesCount: number = 1 ; requiredValuesCount < requiredValuesLength;
                        requiredValuesCount++) {
                        cells.push({ index: index, value: (requiredValuesCount === 1 ? seriesName ? seriesName : 'Series-' + (seriesCount + 1) : requiredValues[seriesCount as number][requiredValuesCount as number]), colSpan: 1, rowSpan: 1, style: headerStyle });
                        index++;
                    }
                }
                else {
                    cells.push({ index: index, value: seriesName ? seriesName : 'Series-' + (seriesCount + 1), colSpan: requiredValuesLength - 1, rowSpan: 1, style: headerStyle });
                    let localIndex: number = index;
                    for (let requiredValuesCount: number = 1; requiredValuesCount < requiredValuesLength;
                        requiredValuesCount++) {
                        additionalCells.push({
                            index: localIndex, value: requiredValues[seriesCount as number][requiredValuesCount as number],
                            colSpan: 1, rowSpan: 1, style: headerStyle
                        });
                        localIndex++;
                    }
                    if (this.series[seriesCount as number].type === 'BoxAndWhisker') {
                        cells.push({ index: localIndex, value: requiredValues[seriesCount as number][requiredValuesLength as number],
                            colSpan: 1, rowSpan: 2, style: headerStyle
                        });
                        localIndex++;
                    }
                    index = localIndex;
                    isYName = true;
                }
                valueType = isAccumulation ? requiredValues[0][0] : isRangeNavigator ? (controls[0] as RangeNavigator).valueType :
                    this.axisCollection[axisCount as number].valueType;
                valueType = (isAccumulation || valueType.indexOf('DateTime') > -1) ? valueType : 'Category';
            }
            if (isXValue) {
                cells[(currentIndex - 1) as number] = { index: currentIndex, value: valueType, colSpan: 1,
                    rowSpan: isYName ? 2 : 1, style: headerStyle };
            }
        }
        if (cells.length) {
            this.rows.push({ index: this.actualRowCount, cells: cells });
            this.actualRowCount++;
        }
        if (additionalCells.length) {
            this.rows.push({ index: this.actualRowCount, cells: additionalCells });
            this.actualRowCount++;
        }
        if (isTitle) {
            cells = [];
            cells.push({ index: 1, value: (controls[0] as Chart | AccumulationChart | StockChart).title,
                colSpan: (index === 1 ? index : index - 1), rowSpan: 1, style: headerStyle });
            this.rows[0] = ({ index: 1, cells: cells });
        }
        this.requiredValuesLength = index - 1;
    }
    /**
     * To obtain all x values in the series.
     */
    private getXValue(requiredValues: string[][], controls: (Chart | AccumulationChart | RangeNavigator | StockChart)[],
                      isRangeNavigator: boolean, isAccumulation: boolean): number[][] {
        const xValues: number[][] = [];
        for (let axisCount: number = 0; axisCount < this.axisCollection.length; axisCount++) {
            const xValue: number[] = [];
            let axisName: string = this.axisCollection[axisCount as number] !== null ? this.axisCollection[axisCount as number].name === 'primaryXAxis' ? null : this.axisCollection[axisCount as number].name : '';
            const valueType: string = isAccumulation ? '' : isRangeNavigator ? (controls[0] as RangeNavigator).valueType : this.axisCollection[axisCount as number].valueType;
            for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                if ((!isRangeNavigator && ((!isAccumulation && (axisName !==
                    (this.series[seriesCount as number] as SeriesModel | StockSeriesModel).xAxisName)) ||
                    !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible) ||
                    (this.series[seriesCount as number] as Series).category === 'TrendLine' || (this.series[seriesCount as number] as Series).type === 'Histogram')) {
                    continue;
                }
                for (let dataCount: number = 0; dataCount < (this.series[seriesCount as number].dataSource as Object[]).length;
                    dataCount++) {
                    if (isAccumulation && !(this.series[seriesCount as number] as AccumulationSeries).points[dataCount as number].visible) {
                        continue;
                    }
                    xValue.push((valueType.indexOf('DateTime') > -1) ? new Date(this.series[seriesCount as number].
                        dataSource[dataCount as number][requiredValues[seriesCount as number][0]]).getTime() :
                        this.series[seriesCount as number].dataSource[dataCount as number][requiredValues[seriesCount as number][0]]);
                }
            }
            xValues.push(xValue);
        }
        for (let xValuesLength: number = 0; xValuesLength < xValues.length ; xValuesLength++) {
            xValues[xValuesLength as number] = xValues[xValuesLength as number].filter((item: number, index: number) =>
                xValues[xValuesLength as number].indexOf(item) === index);
        }
        return (xValues);
    }
    /**
     * To create an Excel sheet.
     */
    private createExcelSheet(isRangeNavigator: boolean, isAccumulation: boolean, xValues: number[][], type: ExportType,
                             requiredValues: string[][], headerStyle: ExcelCellStyle,
                             controls: (Chart | AccumulationChart | RangeNavigator | StockChart)[]): void {
        let startIndex: number = 0;
        let index: number = 0;
        for (let axisCount: number = 0; axisCount < this.axisCollection.length; axisCount++) {
            const axisName: string = this.axisCollection[axisCount as number] !== null ? this.axisCollection[axisCount as number].name === 'primaryXAxis' ? null : this.axisCollection[axisCount as number].name : '';
            const valueType: string = isAccumulation ? '' : isRangeNavigator ? (controls[0] as RangeNavigator).valueType : this.axisCollection[axisCount as number].valueType;
            for (let xValueLength: number = 0; xValueLength < xValues[axisCount as number].length; xValueLength++) {
                index = startIndex ? startIndex : 1;
                const cells: ExcelCell[] = [];
                let isXValue: boolean = true;
                for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                    if ((!isRangeNavigator && ((!isAccumulation &&
                        (this.series[seriesCount as number] as SeriesModel | StockSeriesModel).xAxisName !== axisName) ||
                        !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible) ||
                        (this.series[seriesCount as number] as Series).category === 'TrendLine' || (this.series[seriesCount as number] as Series).type === 'Histogram')) {
                        continue;
                    }
                    let isExist: boolean = false;
                    const dataSource: Object[] = this.series[seriesCount as number].dataSource as Object[];
                    for (let dataCount: number = 0; dataCount < dataSource.length; dataCount++) {
                        const xValue: number = (valueType.indexOf('DateTime') > -1) ? (this.series[seriesCount as number] as Series).category === 'Pareto' ? new Date((this.series[seriesCount as number] as Series).points[dataCount as number][requiredValues[seriesCount as number][0]]).getTime() :
                            new Date(dataSource[dataCount as number][requiredValues[seriesCount as number][0]]).getTime() :
                            (this.series[seriesCount as number] as Series).category === 'Pareto' ? (this.series[seriesCount as number] as Series).points[dataCount as number][requiredValues[seriesCount as number][0]] : dataSource[dataCount as number][requiredValues[seriesCount as number][0]];
                        if (xValues[axisCount as number][xValueLength as number] === xValue) {
                            let usedValueCount: number = isXValue ? 0 : 1;
                            const usedValueLength: number = this.series[seriesCount as number].type === 'BoxAndWhisker' ? requiredValues[seriesCount as number].length - 1 : requiredValues[seriesCount as number].length;
                            for (; usedValueCount < usedValueLength; usedValueCount++) {
                                let value: string | boolean | number | Date = (usedValueCount !== 0 && (this.series[seriesCount as number].type === 'BoxAndWhisker' || (this.series[seriesCount as number] as Series).category === 'Pareto')) ? (this.series[seriesCount as number] as Series).points[dataCount as number][requiredValues[seriesCount as number][usedValueCount as number]] : dataSource[dataCount as number][requiredValues[seriesCount as number][usedValueCount as number]];
                                if (value === null && type === 'CSV') {
                                    value = '';
                                }
                                cells.push({
                                    index: (usedValueCount === 0 ? startIndex === 0 ? 1 : startIndex : index), value: value,
                                    colSpan: 1, rowSpan: 1, style: usedValueCount === 0 ? headerStyle : {}
                                });
                                index++;
                            }
                            if (this.series[seriesCount as number].type === 'BoxAndWhisker') {
                                cells.push({ index: index, value: (this.series[seriesCount as number] as Series).points[dataCount as number]['outliers'][0], colSpan: 1, rowSpan: 1, style: {} });
                                index++;
                            }
                            isXValue = false;
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        index += (requiredValues[seriesCount as number].length - 1);
                    }
                }
                this.rows.push({ index: this.actualRowCount, cells: cells });
                this.actualRowCount++;
            }
            startIndex = index;
        }
    }
    /**
     * To get data url for charts.
     */
    public getDataUrl(chart: Chart | AccumulationChart): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string} {
        const exportUtil: ExportUtils = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart as Chart | AccumulationChart);
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
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        // Destroy method performed here
    }
}
