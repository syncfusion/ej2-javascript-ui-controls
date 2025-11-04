import { Chart } from '../chart';
import { AccumulationChart, AccumulationSeries, AccumulationSeriesModel } from '../../accumulation-chart';
import { RangeNavigator, RangeNavigatorSeriesModel } from '../../range-navigator';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../../common/utils/enum';
import { ExportUtils } from '../../common/utils/export';
import { StockChart, StockSeriesModel } from '../../stock-chart';
import { beforeExport } from '../../common/model/constants';
import { IPDFArgs, IExportEventArgs } from '../../common/model/interface';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { ErrorBarSettingsModel, Series, SeriesModel, AxisModel } from '../../chart';
import { getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';

/**
 * Defines the cell style in an Excel export.
 * The `ExcelCellStyle` interface specifies the styling options for cells in an Excel export.
 *
 * @private
 */
interface ExcelCellStyle {
    /**
     * Defines the horizontal alignment for the cell style.
     *
     * @private
     */
    hAlign?: string;
    /**
     * Defines the vertical alignment for the cell style.
     *
     * @private
     */
    vAlign?: string;
    /**
     * Specifies whether the font is bold.
     * The `bold` property determines if the font should be rendered in a bold style.
     *
     * @private
     */
    bold?: boolean;
    /**
     * Specifies whether to wrap text for the cell style.
     *
     * @private
     */
    wrapText?: boolean;
}
/**
 * Defines the cell in an Excel export.
 *
 * @private
 */
interface ExcelCell {
    /**
     * The `index` property specifies the position of the cell within the row or column.
     *
     * @private
     */
    index?: number;
    /**
     * Specifies the number of columns the cell spans across in the worksheet.
     *
     * @private
     */
    colSpan?: number;
    /**
     * Specifies the number of rows the cell spans across in the worksheet.
     *
     * @private
     */
    rowSpan?: number;
    /**
     * The `value` property specifies the content of the cell in the worksheet and can accept text, numbers, boolean values, or dates.
     *
     * @private
     */
    value?: string | boolean | number | Date ;
    /**
     * The `style` property specifies how the cell is visually styled in the worksheet.
     *
     * @private
     */
    style?: ExcelCellStyle;
}
/**
 * Defines the row and column position in an Excel export.
 *
 * @private
 */
export interface ExcelRowAndColumn {
    /**
     * The `index` property specifies the position of a cell within a row or column.
     *
     * @private
     */
    index?: number;
    /**
     * Defines the cells in a row and column.
     *
     * @private
     */
    cells?: ExcelCell[];
    /**
     * Defines the width of each row and column.
     *
     * @private
     */
    width?: number;
}
/**
 * The `Export` module is used to print and export the rendered chart.
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
     * Exports the chart or charts to the specified file format.
     *
     * @param {ExportType} type - The type of export (e.g., 'PNG', 'JPEG', 'PDF', etc.).
     * @param {string} fileName - The name of the file to save.
     * @param {PdfPageOrientation} [orientation] - The orientation of the PDF page. Defaults to 'Portrait'.
     * @param {(Chart | AccumulationChart | RangeNavigator | StockChart)[]} [controls] - An array of chart or chart-like components to export.
     * @param {number} [width] - The width of the exported image or PDF page.
     * @param {number} [height] - The height of the exported image or PDF page.
     * @param {boolean} [isVertical] - Specifies whether to export the chart vertically. Defaults to false.
     * @param {IPDFArgs} [header] - The header options for the PDF.
     * @param {IPDFArgs} [footer] - The footer options for the PDF.
     * @param {boolean} [exportToMultiplePage] - Specifies whether to export the charts to multiple pages in PDF. Defaults to false.
     * @returns {void}
     * @public
     */
    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation, controls?: (Chart | AccumulationChart | RangeNavigator | StockChart)[],
        width?: number, height?: number, isVertical?: boolean, header ?: IPDFArgs, footer ?: IPDFArgs, exportToMultiplePage?: boolean
    ): void {
        const exportChart: ExportUtils = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        if (type === 'CSV' || type === 'XLSX') {
            this.excelExport(controls, fileName, type, width, height);
        }
        else {
            const argsData: IExportEventArgs = {
                cancel: false, name: beforeExport, width: width, height: height, excelProperties : {
                    rows: undefined,
                    columns: undefined
                }
            };
            this.chart.trigger(beforeExport, argsData);
            if (!argsData.cancel) {
                exportChart.export(
                    type, fileName, orientation, controls, width = argsData.width,
                    height = argsData.height, isVertical, header, footer, exportToMultiplePage
                );
            }
        }
    }
    /**
     * Exports the specified chart or charts to Excel format.
     *
     * @param {(Chart | AccumulationChart | RangeNavigator | StockChart)[]} controls - An array of chart or chart-like components to export.
     * @param {string} fileName - The name of the Excel file to save.
     * @param {ExportType} type - The type of export (e.g., 'XLSX', 'CSV', etc.).
     * @param {number} [width] - The width of the exported Excel sheet.
     * @param {number} [height] - The width of the exported Excel sheet.
     * @returns {void}
     * @private
     */
    private excelExport(controls: (Chart | AccumulationChart | RangeNavigator | StockChart)[], fileName: string, type: ExportType,
                        width?: number, height?: number): void{
        this.rows = [];
        this.actualRowCount = 1;
        const workSheets: Object[] = [];
        let requiredValues: string[][] = [];
        const headerStyle: ExcelCellStyle = { bold: true, hAlign: 'Center', vAlign: 'Center', wrapText: true };
        let xValues: number[][] = [];
        for (let i: number = 0; i < controls.length; i++) {
            const isRangeNavigator: boolean = controls[i as number].getModuleName() === 'rangeNavigator';
            const isAccumulation: boolean = controls[i as number].getModuleName() === 'accumulationchart';
            this.series = isRangeNavigator ? controls[i as number].series :
                (controls[i as number] as Chart | AccumulationChart | StockChart).visibleSeries;
            if (isRangeNavigator && this.series.length === 0) {
                if (controls[i as number].dataSource) {
                    //To create an Excel sheet when the Rangenavigator series is not given.
                    this.createRangeNavigatorExcelSheet(controls[i as number] as RangeNavigator, headerStyle, type);
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
                    this.axisCollection = controls[i as number].getModuleName() === 'stockChart' ? (controls[i as number] as StockChart).chart.horizontalAxes : (controls[i as number] as Chart).isTransposed ? (controls[i as number] as Chart).verticalAxes : (controls[i as number] as Chart).horizontalAxes;
                }
                //To get the number of columns for the excel.
                requiredValues = this.getRequiredValues(isRangeNavigator);
                if (this.requiredValuesLength === 0 && this.series.length === this.histogramSeriesCount) {
                    return;
                }
                //To get all x values in the series.
                xValues = this.getXValue(requiredValues, controls[i as number], isRangeNavigator, isAccumulation);
                //To get the the chart title and series name.
                this.getTitle(requiredValues, headerStyle, controls[i as number], isRangeNavigator, isAccumulation, type,
                              xValues[0].length);
                //To create an Excel sheet.
                this.createExcelSheet(isRangeNavigator, isAccumulation, xValues, type, requiredValues, headerStyle, controls[i as number]);
            }
        }
        const columns: ExcelRowAndColumn[] = [];
        this.requiredValuesLength = this.requiredValuesLength === 0 ? 1 : this.requiredValuesLength;
        for (let columnCount: number = 0; columnCount < this.requiredValuesLength; columnCount++) {
            columns.push({ index: columnCount + 1, width: 100 });
        }
        const argsData: IExportEventArgs = {
            cancel: false, name: beforeExport, width: width, height: height, excelProperties: {
                rows: this.rows,
                columns: columns
            }
        };
        controls[0].trigger(beforeExport, argsData);
        if (!argsData.cancel) {
            workSheets.push({ columns: argsData.excelProperties.columns, rows: argsData.excelProperties.rows });
            const book: Workbook = new Workbook({ worksheets: workSheets }, type === 'XLSX' ? 'xlsx' : 'csv');
            fileName = fileName ? fileName : type === 'XLSX' ? 'XLSX' : 'CSV';
            book.save(fileName + (type === 'XLSX' ? '.xlsx' : '.csv'));
        }
    }
    /**
     * Creates an Excel sheet for exporting RangeNavigator control data.
     *
     * @param {RangeNavigator} controls - The RangeNavigator control to export.
     * @param {ExcelCellStyle} headerStyle - The style to apply to the header cells in the Excel sheet.
     * @param {ExportType} type - The type of export (e.g., 'XLSX', 'CSV', etc.).
     * @returns {void}
     * @private
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
     * Gets the number of columns for the Excel sheet.
     *
     * @param {boolean} isRangeNavigator - Specifies whether the data is for a RangeNavigator control.
     * @returns {string[][]} - An array containing the required values for the Excel sheet.
     * @private
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
     * Gets the title for the Excel sheet.
     *
     * @param {string[][]} requiredValues - The required values for the Excel sheet.
     * @param {ExcelCellStyle} headerStyle - The style for the header.
     * @param {(Chart | AccumulationChart | RangeNavigator | StockChart)[]} controls - The controls to export.
     * @param {boolean} isRangeNavigator - Specifies whether the data is for a RangeNavigator control.
     * @param {boolean} isAccumulation - Specifies whether the data is for an AccumulationChart.
     * @param {ExportType} type - The type of export.
     * @param {number} xValueLength - The length of X values.
     * @returns {void}
     * @private
     */

    private getTitle (requiredValues: string[][], headerStyle: ExcelCellStyle,
                      control: Chart | AccumulationChart | RangeNavigator | StockChart,
                      isRangeNavigator : boolean, isAccumulation: boolean, type: ExportType, xValueLength: number) : void {
        let cells: ExcelCell[] = [];
        const additionalCells: ExcelCell[] = [];
        let index: number = 1;
        let isTitle: boolean = false;
        let titlePushRowIndex: number;
        if (!isRangeNavigator && type === 'XLSX' && (control as Chart | AccumulationChart | StockChart).title) {
            this.rows.push({});
            titlePushRowIndex = this.rows.length > 0 ? this.rows.length - 1 : -1;
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
            for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                const axisName: string = this.axisCollection[axisCount as number] !== null ? (this.axisCollection[axisCount as number].name === 'primaryXAxis' || (this.axisCollection[axisCount as number].name === 'primaryYAxis' && this.series[seriesCount as number].type.indexOf('Bar') > -1)) ? null : this.axisCollection[axisCount as number].name : '';
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
                valueType = isAccumulation ? requiredValues[0][0] : isRangeNavigator ? (control as RangeNavigator).valueType :
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
            cells.push({ index: 1, value: (control as Chart | AccumulationChart | StockChart).title,
                colSpan: (index === 1 ? index : index - 1), rowSpan: 1, style: headerStyle });
            this.rows[titlePushRowIndex as number] = ({ index: titlePushRowIndex + 1, cells: cells });
        }
        this.requiredValuesLength = index - 1;
    }
    /**
     * Gets the X values for the Excel sheet.
     *
     * @param {string[][]} requiredValues - The required values for the Excel sheet.
     * @param {(Chart | AccumulationChart | RangeNavigator | StockChart)[]} controls - The controls to export.
     * @param {boolean} isRangeNavigator - Specifies whether the data is for a RangeNavigator control.
     * @param {boolean} isAccumulation - Specifies whether the data is for an AccumulationChart.
     * @returns {number[][]} - The X values.
     * @private
     */

    private getXValue(requiredValues: string[][], control: Chart | AccumulationChart | RangeNavigator | StockChart,
                      isRangeNavigator: boolean, isAccumulation: boolean): number[][] {
        const xValues: number[][] = [];
        for (let axisCount: number = 0; axisCount < this.axisCollection.length; axisCount++) {
            const xValue: number[] = [];
            const valueType: string = isAccumulation ? '' : isRangeNavigator ? (control as RangeNavigator).valueType : this.axisCollection[axisCount as number].valueType;
            for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                const axisName: string = this.axisCollection[axisCount as number] !== null ? (this.axisCollection[axisCount as number].name === 'primaryXAxis' || (this.axisCollection[axisCount as number].name === 'primaryYAxis' && this.series[seriesCount as number].type.indexOf('Bar') > -1)) ? null : this.axisCollection[axisCount as number].name : '';
                if ((!isRangeNavigator && ((!isAccumulation && (axisName !==
                    (this.series[seriesCount as number] as SeriesModel | StockSeriesModel).xAxisName)) ||
                    !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible) ||
                    (this.series[seriesCount as number] as Series).category === 'TrendLine' || (this.series[seriesCount as number] as Series).type === 'Histogram')) {
                    continue;
                }
                const dataSource: Object[] | Object = (this.series[seriesCount as number].dataSource instanceof DataManager) ?
                    (isAccumulation ? (this.series[seriesCount as number] as AccumulationSeries).resultData as Object[] :
                        (this.series[seriesCount as number] as Series).currentViewData) :
                    this.series[seriesCount as number].dataSource as Object[];
                for (let dataCount: number = 0; dataCount < (dataSource as Object[]).length;
                    dataCount++) {
                    if (isAccumulation && !(this.series[seriesCount as number] as AccumulationSeries).points[dataCount as number].visible) {
                        continue;
                    }
                    xValue.push((valueType.indexOf('DateTime') > -1) ? new Date(dataSource[dataCount as number][requiredValues[seriesCount as number][0]]).getTime() :
                        dataSource[dataCount as number][requiredValues[seriesCount as number][0]]);
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
     * Creates an Excel sheet.
     *
     * @param {boolean} isRangeNavigator - Specifies whether the data is for a RangeNavigator control.
     * @param {boolean} isAccumulation - Specifies whether the data is for an AccumulationChart.
     * @param {number[][]} xValues - The X values for the Excel sheet.
     * @param {ExportType} type - The type of export.
     * @param {string[][]} requiredValues - The required values for the Excel sheet.
     * @param {ExcelCellStyle} headerStyle - The style for the header in Excel.
     * @param {(Chart | AccumulationChart | RangeNavigator | StockChart)[]} controls - The controls to export.
     * @private
     */

    private createExcelSheet(isRangeNavigator: boolean, isAccumulation: boolean, xValues: number[][], type: ExportType,
                             requiredValues: string[][], headerStyle: ExcelCellStyle,
                             controls: Chart | AccumulationChart | RangeNavigator | StockChart): void {
        let startIndex: number = 0;
        let index: number = 0;
        for (let axisCount: number = 0; axisCount < this.axisCollection.length; axisCount++) {
            const valueType: string = isAccumulation ? '' : isRangeNavigator ? (controls[0] as RangeNavigator).valueType : this.axisCollection[axisCount as number].valueType;
            for (let seriesCount: number = 0; seriesCount < this.series.length; seriesCount++) {
                const axisName: string = this.axisCollection[axisCount as number] !== null ? (this.axisCollection[axisCount as number].name === 'primaryXAxis' || (this.axisCollection[axisCount as number].name === 'primaryYAxis' && this.series[seriesCount as number].type.indexOf('Bar') > -1)) ? null : this.axisCollection[axisCount as number].name : '';
                if ((!isRangeNavigator &&
                    ((!isAccumulation &&
                        (this.series[seriesCount as number] as SeriesModel | StockSeriesModel).xAxisName !== axisName) ||
                        !(this.series[seriesCount as number] as SeriesModel | AccumulationSeriesModel | StockSeriesModel).visible)) ||
                    (this.series[seriesCount as number] as Series).category === 'TrendLine' ||
                    (this.series[seriesCount as number] as Series).type === 'Histogram') {
                    continue;
                }
                const dataSource: Object[] | Object = (this.series[seriesCount as number].dataSource instanceof DataManager) ?
                    (isAccumulation ? (this.series[seriesCount as number] as AccumulationSeries).resultData as Object[] :
                        (this.series[seriesCount as number] as Series).currentViewData) :
                    this.series[seriesCount as number].dataSource as Object[];
                for (let dataCount: number = 0; dataCount < (dataSource as Object[]).length; dataCount++) {
                    const xValue: number = (valueType.indexOf('DateTime') > -1)
                        ? (this.series[seriesCount as number] as Series).category === 'Pareto'
                            ? new Date((this.series[seriesCount as number] as Series).
                                points[dataCount as number][requiredValues[seriesCount as number][0]]).getTime()
                            : new Date(dataSource[dataCount as number][requiredValues[seriesCount as number][0]]).getTime()
                        : (this.series[seriesCount as number] as Series).category === 'Pareto'
                            ? (this.series[seriesCount as number] as Series).
                                points[dataCount as number][requiredValues[seriesCount as number][0]]
                            : dataSource[dataCount as number][requiredValues[seriesCount as number][0]];

                    if (xValues[axisCount as number].indexOf(xValue) > -1) {
                        index = startIndex ? startIndex : 1;
                        const cells: ExcelCell[] = [];
                        const usedValueLength: number = this.series[seriesCount as number].type === 'BoxAndWhisker'
                            ? requiredValues[seriesCount as number].length - 1
                            : requiredValues[seriesCount as number].length;

                        for (let usedValueCount: number = 0; usedValueCount < usedValueLength; usedValueCount++) {
                            const cellValue: Object = (this.series[seriesCount as number] as Series).enableComplexProperty ?
                                getValue(requiredValues[seriesCount as number][usedValueCount as number], dataSource[dataCount as number]) :
                                dataSource[dataCount as number][requiredValues[seriesCount as number][usedValueCount as number]];
                            let value: string | boolean | number | Date = (usedValueCount !== 0 && (this.series[seriesCount as number].type === 'BoxAndWhisker' || (this.series[seriesCount as number] as Series).category === 'Pareto')) ? (this.series[seriesCount as number] as Series).points[dataCount as number][requiredValues[seriesCount as number][usedValueCount as number]] : cellValue;
                            if (value === null && type === 'CSV') {
                                value = '';
                            }
                            cells.push({
                                index: (usedValueCount === 0 ? (startIndex === 0 ? 1 : startIndex) : index), value: value, colSpan: 1,
                                rowSpan: 1, style: usedValueCount === 0 ? headerStyle : {}
                            });
                            index++;
                        }
                        if (this.series[seriesCount as number].type === 'BoxAndWhisker') {
                            cells.push({index: index, value: (this.series[seriesCount as number] as Series).points[dataCount as number]['outliers'][0], colSpan: 1, rowSpan: 1, style: {}});
                            index++;
                        }
                        this.rows.push({ index: this.actualRowCount, cells: cells });
                        this.actualRowCount++;
                    }
                }
            }
            startIndex = index;
        }
    }
    /**
     * Gets the data URL of the chart or accumulation chart.
     *
     * @param {Chart | AccumulationChart} chart - The chart or accumulation chart.
     * @returns {{ element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string}} - The data URL information.
     */

    public getDataUrl(chart: Chart | AccumulationChart): { element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string} {
        const exportUtil: ExportUtils = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart as Chart | AccumulationChart);
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
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
