/**
 * Open properties.
 */
import { Spreadsheet } from '../base/index';
import { getSheetIndex, SheetModel, isHiddenRow, CellModel, getCell, setCell } from '../../workbook/base/index';
import { initiateChart, ChartModel, getRangeIndexes, isNumber, isDateTime, dateToInt, chartType } from '../../workbook/common/index';
import { Overlay } from '../services/index';
import { overlay, locale, refreshChartCellObj, getRowIdxFromClientY, getColIdxFromClientX, deleteChart } from '../common/index';
import { BeforeImageRefreshData, BeforeChartEventArgs, beginAction, completeAction, clearChartBorder, focusBorder } from '../common/index';
import { Chart, ColumnSeries, Category, ILoadedEventArgs, ChartTheme, StackingColumnSeries, BarSeries } from '@syncfusion/ej2-charts';
import { AreaSeries, StackingAreaSeries, AccumulationChart, IAccLoadedEventArgs, AccumulationTheme } from '@syncfusion/ej2-charts';
import { Legend, StackingBarSeries, SeriesModel, LineSeries, StackingLineSeries, AxisModel, ScatterSeries } from '@syncfusion/ej2-charts';
import { AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationSeriesModel } from '@syncfusion/ej2-charts';
import { L10n, isNullOrUndefined, getComponent, closest, detach } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { getTypeFromFormat } from '../../workbook/integrations/index';
import { updateChart, deleteChartColl, getFormattedCellObject, setChart, getCellAddress } from '../../workbook/common/index';
import { insertChart } from '../common/index';

Chart.Inject(ColumnSeries, LineSeries, BarSeries, AreaSeries, StackingColumnSeries, StackingLineSeries, StackingBarSeries, ScatterSeries);
Chart.Inject(StackingAreaSeries, Category, Legend, Tooltip);
AccumulationChart.Inject(PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationLegend);

/**
 * Represents Chart support for Spreadsheet.
 */
export class SpreadsheetChart {
    private parent: Spreadsheet;
    private chart: Chart | AccumulationChart;

    /**
     * Constructor for the Spreadsheet Chart module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Adding event listener for success and failure 
     */
    private addEventListener(): void {
        this.parent.on(initiateChart, this.initiateChartHandler, this);
        this.parent.on(refreshChartCellObj, this.refreshChartCellObj, this);
        this.parent.on(updateChart, this.updateChartHandler, this);
        this.parent.on(deleteChart, this.deleteChart, this);
        this.parent.on(clearChartBorder, this.clearBorder, this);
        this.parent.on(insertChart, this.insertChartHandler, this);
    }

    private insertChartHandler(args: { action: string, id: string }): void {
        let chartType: chartType = 'Column';
        switch (args.id) {
            case 'clusteredColumn':
                chartType = 'Column';
                break;
            case 'stackedColumn':
                chartType = 'StackingColumn';
                break;
            case 'stackedColumn100':
                chartType = 'StackingColumn100';
                break;
            case 'clusteredBar':
                chartType = 'Bar';
                break;
            case 'stackedBar':
                chartType = 'StackingBar';
                break;
            case 'stackedBar100':
                chartType = 'StackingBar100';
                break;
            case 'area':
                chartType = 'Area';
                break;
            case 'stackedArea':
                chartType = 'StackingArea';
                break;
            case 'stackedArea100':
                chartType = 'StackingArea100';
                break;
            case 'line':
                chartType = 'Line';
                break;
            case 'stackedLine':
                chartType = 'StackingLine';
                break;
            case 'stackedLine100':
                chartType = 'StackingLine100';
                break;
            case 'pie':
                chartType = 'Pie';
                break;
            case 'doughnut':
                chartType = 'Doughnut';
                break;
            //  case 'radar':
            //     chartType = ;
            //     break;
            //  case 'radar_markers':
            //     chartType = 'Column';
            //     break;
            case 'scatter':
                chartType = 'Scatter';
                break;
        }
        let chart: ChartModel[] = [{ type: chartType }];
        this.parent.notify(setChart, { chart: chart });
    }

    private getPropertyValue(rIdx: number, cIdx: number, sheetIndex: number): string | number {
        let sheets: SheetModel[] = this.parent.sheets;
        if (sheets[sheetIndex] && sheets[sheetIndex].rows[rIdx] && sheets[sheetIndex].rows[rIdx].cells[cIdx]) {
            let cell: CellModel = getCell(rIdx, cIdx, this.parent.sheets[sheetIndex]);
            let value: string | number = '';
            if (cell.format) {
                let formatObj: { [key: string]: string | boolean | CellModel } = {
                    type: getTypeFromFormat(cell.format),
                    value: cell && cell.value, format: cell && cell.format ?
                        cell.format : 'General', formattedText: cell && cell.value,
                    onLoad: true, isRightAlign: false, cell: cell,
                    rowIdx: rIdx.toString(), colIdx: cIdx.toString()
                };
                if (cell) {
                    this.parent.notify(getFormattedCellObject, formatObj);
                    if (typeof (formatObj.value) === 'number') {
                        let escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,{}|\":<>~_-]', 'g');
                        formatObj.formattedText = (formatObj.formattedText.toString()).replace(escapeRegx, '');
                        value = parseInt(formatObj.formattedText.toString(), 10);
                    } else {
                        value = formatObj.formattedText.toString(); parseFloat('');
                    }
                }
            } else {
                value = this.parent.sheets[sheetIndex].rows[rIdx].cells[cIdx].value;
            }
            return value;
        } else {
            return '';
        }
    }

    private updateChartHandler(args: { chart: ChartModel }): void {
        let series: SeriesModel[] = this.initiateChartHandler({ option: args.chart, isRefresh: true }) as SeriesModel[];
        let chartObj: HTMLElement = this.parent.element.querySelector('.' + args.chart.id);
        let excelFilter: Chart = getComponent(chartObj, 'chart');
        excelFilter.series = series;
    }

    private refreshChartCellObj(args: BeforeImageRefreshData): void {
        let currRowIdx: { clientY: number, isImage: boolean } = { clientY: args.currentTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, currRowIdx);
        let prevRowIdx: { clientY: number, isImage: boolean } = { clientY: args.prevTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, prevRowIdx);
        let currColIdx: { clientX: number, isImage: boolean } = { clientX: args.currentLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, currColIdx);
        let prevColIdx: { clientX: number, isImage: boolean } = { clientX: args.prevLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, prevColIdx);
        let sheet: SheetModel = this.parent.sheets[this.parent.activeSheetIndex];
        let prevCellObj: CellModel = getCell(prevRowIdx.clientY, prevColIdx.clientX, sheet);
        let currCellObj: CellModel = getCell(currRowIdx.clientY, currColIdx.clientX, sheet);
        let prevCellChart: object[] = prevCellObj ? prevCellObj.chart : [];
        let prevChartObj: ChartModel;
        let currChartObj: ChartModel[];
        let prevCellImgLen: number = (prevCellChart && prevCellChart.length) ? prevCellChart.length : 0;
        if (prevCellObj && prevCellObj.chart) {
            for (let i: number = 0; i < prevCellImgLen; i++) {
                let overlayEle: HTMLElement = document.getElementById(args.id);
                let chartEleClassName: HTMLElement = document.getElementById((prevCellChart[i] as ChartModel).id);
                if (closest(chartEleClassName, '.' + overlayEle.classList[1]) === overlayEle) {
                    prevChartObj = prevCellChart[i];
                    prevCellChart.splice(i, 1);
                }
            }
            if (currCellObj && currCellObj.chart) {
                currChartObj = currCellObj.chart;
                if (prevChartObj) {
                    currChartObj.push(prevChartObj);
                }
            }
            (currChartObj) ? setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { chart: currChartObj }, true) :
                setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { chart: [prevChartObj] }, true);
            if (args.requestType === 'chartRefresh' && !args.isUndoRedo) {
                let eventArgs: BeforeImageRefreshData = {
                    requestType: 'chartRefresh', currentRowIdx: currRowIdx.clientY, currentColIdx: currColIdx.clientX,
                    currentWidth: args.currentWidth, prevHeight: args.prevHeight, prevWidth: args.prevWidth,
                    prevRowIdx: prevRowIdx.clientY, prevColIdx: prevColIdx.clientX, prevTop: args.prevTop, prevLeft: args.prevLeft,
                    currentTop: args.currentTop, currentLeft: args.currentLeft, currentHeight: args.currentHeight,
                    id: args.id, sheetIdx: this.parent.activeSheetIndex
                };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'chartRefresh' });
            }
        }
    }

    private processChartRange(
        range: number[], dataSheetIdx: number, opt: ChartModel): { xRange: number[], yRange: number[], lRange: number[] } {
        let xRange: number[];
        let yRange: number[];
        let lRange: number[];
        let trVal: number | string; let blVal: number | string; let tlVal: number | string; let minr: number = range[0];
        let minc: number = range[1]; let isStringSeries: boolean = false;
        let maxr: number = range[2]; let maxc: number = range[3]; let isSingleRow: boolean = minr === maxr;
        let isSingleCol: boolean = minc === maxc;
        trVal = this.getPropertyValue(minr, maxc, dataSheetIdx);
        // trVal = this.getParseValue(trVal);
        blVal = this.getPropertyValue(maxr, minc, dataSheetIdx);
        // blVal = this.getParseValue(blVal);
        tlVal = this.getPropertyValue(minr, minc, dataSheetIdx);
        // tlVal = this.getParseValue(tlVal);
        if (!isNumber(blVal) || !tlVal) {
            isStringSeries = true;
        }
        if (isNullOrUndefined(tlVal) && !isSingleRow && !isSingleCol || (opt.type === 'Scatter' && range[3] - range[1] === 1)) {
            xRange = [minr + 1, minc, maxr, minc];
            yRange = [minr + 1, minc + 1, maxr, maxc];
            lRange = [minr, minc + 1, minr, maxc];
        } else if ((!isNullOrUndefined(blVal) && isStringSeries && !isSingleRow && !isSingleCol)) {
            if (!isNullOrUndefined(trVal) && (!isNumber(trVal) || !tlVal)) {
                xRange = [minr + 1, minc, maxr, minc];
                yRange = [minr + 1, minc + 1, maxr, maxc];
                lRange = [minr, minc + 1, minr, maxc];
            } else {
                xRange = [minr, minc, maxr, minc];
                yRange = [minr, minc + 1, maxr, maxc];
            }
        } else {
            yRange = [minr, minc, maxr, maxc];
            if ((!isNullOrUndefined(trVal) && !isNumber(trVal) && !isDateTime(trVal))) {
                lRange = [minr, minc, minr, maxc];
                yRange[0] = yRange[0] + 1;
            } else if (isNullOrUndefined(tlVal) && (isSingleRow || isSingleCol)) {
                lRange = [minr, minc, minr, maxc];
                if (isSingleRow) {
                    yRange[1] = yRange[1] + 1;
                    lRange[3] = lRange[1];
                } else {
                    yRange[0] = yRange[0] + 1;
                }
            }
        }
        return { xRange: xRange, yRange: yRange, lRange: lRange };
    }

    private toIntrnlRange(range: number[], sheetIdx: number): number[] {
        if (!range) {
            range = getRangeIndexes[this.parent.sheets[sheetIdx].selectedRange];
        } else if (typeof (range) === 'string') {
            range = getRangeIndexes[range];
        }
        return range;
    }

    private getRangeData(options: { range: number[], sheetIdx: number, skipFormula: boolean, isYvalue: boolean }): { value: number }[] {
        options.sheetIdx = isNullOrUndefined(options.sheetIdx) ? this.parent.getActiveSheet().index : options.sheetIdx;
        let sheet: SheetModel = this.parent.sheets[options.sheetIdx];
        options.range = this.toIntrnlRange(options.range, options.sheetIdx);
        let minc: number; let minr: number; let maxr: number; let maxc: number; let skipVirtualHiddenRow: boolean;
        let isRowHidden: boolean;
        let rowIdx: number[] = []; let arr: { value: number }[] = [];
        skipVirtualHiddenRow = false;
        minr = options.range[0];
        maxr = options.range[2];
        maxc = options.range[3];
        isRowHidden = isHiddenRow(sheet, minr);
        if (skipVirtualHiddenRow && isRowHidden) {
            maxr++;
        } else if (!isRowHidden) {
            minc = skipVirtualHiddenRow ? 0 : options.range[1];
            this.pushRowData(options, minr, minc, maxr, maxc, arr, rowIdx, true, options.isYvalue);
        }
        return arr;
    }

    private pushRowData(
        options: { range: number[], sheetIdx: number, skipFormula: boolean }, minr: number,
        minc: number, maxr: number, maxc: number, arr: object[], rowIdx: number[], isDataSrcEnsured: boolean, isYvalue: boolean): void {
        let minCol: number = minc;
        while (minr <= maxr) {
            minc = minCol;
            while (minc <= maxc) {
                let value: string | number = '';
                let cell: CellModel = getCell(minr, minc, this.parent.getActiveSheet());
                if (cell && cell.format && !isYvalue) {
                    let forArgs: { [key: string]: string | boolean | CellModel } = {
                        value: cell && cell.value, format: cell && cell.format ? cell.format : 'General',
                        formattedText: cell && cell.value, onLoad: true,
                        type: cell && getTypeFromFormat(cell.format),
                        rowIdx: minr.toString(), colIdx: minc.toString(),
                        isRightAlign: false, cell: cell,
                    };
                    this.parent.notify(getFormattedCellObject, forArgs);
                    value = forArgs.formattedText.toString();
                } else {
                    value = this.parent.getValueRowCol(options.sheetIdx, minr + 1, minc + 1);
                }
                // = this.parent.getValueRowCol(options.sheetIdx, minr + 1, minc + 1);
                arr.push({ value });
                minc++;
            }
            minr++;
        }
        rowIdx.push(minr);
    }

    private toArrayData(args: { value: number }[]): string[] {
        let prop: string = 'value'; let obj: object; let i: number = 0;
        let temp: string[] = []; let len: number = args.length;
        while (i < len) {
            obj = args[i];
            if (Object.keys(obj).length) {
                if (prop in obj) {
                    temp.push(obj[prop]);
                }
            } else {
                temp.push('');
            }
            i++;
        }
        return temp;
    }

    private getVirtualXValues(limit: number): string[] {
        let i: number = 1; let arr: string[] = [];
        while (i < limit) {
            arr.push(i.toString());
            i++;
        }
        return arr;
    }

    // tslint:disable-next-line:max-func-body-length
    private processChartSeries(
        options: ChartModel, sheetIndex: number, xRange: number[], yRange: number[],
        lRange: number[]): { series: SeriesModel[] | AccumulationSeriesModel[], xRange: number[], yRange: number[], lRange: number[] } {
        options = options || {};
        let seriesName: string = '';
        let val: number | string; let len: number; let xValue: string[];
        let yValue: { value: number }[]; let lValue: string[]; let diff: number;
        let pArr: object[];
        let pObj: object = {};
        let j: number;
        let inc: number; let i: number = 0; let yInc: number = 0;
        let sArr: SeriesModel[] = []; let tArr: string[] = ['value2']; let dtVal: number;
        yValue = this.getRangeData({ range: yRange, sheetIdx: sheetIndex, skipFormula: true, isYvalue: true });
        let rDiff: number = (yRange[2] - yRange[0]) + 1;
        let cDiff: number = (yRange[3] - yRange[1]) + 1;
        if (options.isSeriesInRows) {
            xValue = lRange ? this.toArrayData(
                this.getRangeData({ range: lRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false })) :
                this.getVirtualXValues(cDiff + 1);
            if (xRange) {
                lValue = this.toArrayData(this.getRangeData(
                    { range: xRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false }));
            }
            diff = rDiff;
        } else {
            xValue = xRange ? this.toArrayData(this.getRangeData(
                { range: xRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false })) :
                this.getVirtualXValues(rDiff + 1);
            if (lRange) {
                lValue = this.toArrayData(this.getRangeData(
                    { range: lRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false }));
            }
            diff = cDiff;
        }
        len = xValue.length;
        inc = options.isSeriesInRows ? 1 : diff;
        while (i < diff) {
            j = 0;
            pArr = [];
            yInc = options.isSeriesInRows ? yInc : i;
            while (j < len) {
                if (yValue[yInc]) {
                    val = yValue[yInc].value;
                    if (isNumber(val)) {
                        val = Number(val);
                    } else {
                        dtVal = dateToInt(val);
                        val = isNaN(dtVal) ? 0 : dtVal;
                    }
                    pArr.push({ x: xValue[j], y: val });
                }
                yInc += inc;
                j++;
            }
            if (lValue && lValue.length > 0) {
                seriesName = lValue[i] as string;
            } else {
                seriesName = 'series' + i;
            }
            if (options.type) {
                let type: chartType = options.type;
                if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        }
                    };
                } else if (type === 'Scatter') {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), marker: {
                            visible: false,
                            width: 12,
                            height: 12,
                            shape: 'Circle'
                        }
                    };
                } else if (type === 'Pie' || type === 'Doughnut') {
                    let innerRadius: string = options.type === 'Pie' ? '0%' : '40%';
                    pObj = {
                        dataSource: pArr,
                        dataLabel: {
                            visible: true, position: 'Inside', name: 'text', font: { fontWeight: '600' }
                        },
                        radius: '100%', xName: 'x', yName: 'y', startAngle: 0, endAngle: 360, innerRadius: innerRadius, explode: true,
                        explodeOffset: '10%', explodeIndex: 0, name: 'Browser'
                    };
                } else {
                    pObj = { dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString() };

                }
            }
            sArr.push(pObj);
            i++;
        }
        let retVal: { series: SeriesModel[], xRange: number[], yRange: number[], lRange: number[] };
        if (options.type) {
            let type: chartType = options.type;
            retVal = {
                series: sArr, xRange: options.isSeriesInRows ? lRange : xRange,
                yRange: yRange, lRange: options.isSeriesInRows ? xRange : lRange
            };
        }
        return retVal;
    }

    private primaryYAxisFormat(yRange: number[]): string {
        if (isNullOrUndefined(yRange)) {
            return '{value}';
        }
        let type: string;
        let cell: CellModel = getCell(yRange[0], yRange[1], this.parent.getActiveSheet());
        if (cell && cell.format) {
            type = getTypeFromFormat(cell.format);
            if (type === 'Accounting') {
                return '${value}';
            } else if (type === 'Currency') {
                return '${value}';
            } else if (type === 'Percentage') {
                return '{value}%';
            }
        }
        return '{value}';
    }

    private focusChartRange(xRange: number[], yRange: number[], lRange: number[]): void {
        let border: string[] =
            ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        this.clearBorder();
        if (lRange) {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: lRange[0], colIndex: lRange[1] },
                endcell: { rowIndex: lRange[2], colIndex: lRange[3] }, classes: [border[0], border[1]]
            });
        }
        if (xRange) {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: xRange[0], colIndex: xRange[1] },
                endcell: { rowIndex: xRange[2], colIndex: xRange[3] }, classes: [border[2], border[3]]
            });
        }
        this.parent.notify(focusBorder, {
            startcell: { rowIndex: yRange[0], colIndex: yRange[1] },
            endcell: { rowIndex: yRange[2], colIndex: yRange[3] }, classes: [border[4], border[5]]
        });
    }

    private clearBorder(): void {
        let mainCont: Element = this.parent.getMainContent();
        let border: string[] =
            ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        for (let borderIdx: number = 0; borderIdx < border.length; borderIdx++) {
            let eleColl: NodeListOf<Element> = mainCont.querySelectorAll('.' + border[borderIdx]);
            for (let tdIdx: number = 0; tdIdx < eleColl.length; tdIdx++) {
                let td: HTMLElement = eleColl[tdIdx] as HTMLElement;
                td.classList.remove(border[borderIdx]);
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private initiateChartHandler(argsOpt: {
        option: ChartModel, chartCount?: number, isRefresh?: boolean, isInitCell?: boolean,
        isUndoRedo?: boolean, dataSheetIdx?: number, range?: string
    }): SeriesModel[] | AccumulationSeriesModel[] {
        let isRangeSelect: boolean = true;
        isRangeSelect = isNullOrUndefined(argsOpt.isInitCell) ? true : !argsOpt.isInitCell;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        argsOpt.isUndoRedo = isNullOrUndefined(argsOpt.isUndoRedo) ? true : argsOpt.isUndoRedo;
        let seriesModel: SeriesModel[];
        argsOpt.isRefresh = isNullOrUndefined(argsOpt.isRefresh) ? false : argsOpt.isRefresh;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: string = argsOpt.option.range ? (argsOpt.option.range.indexOf('!') > 0) ?
            argsOpt.option.range.split('!')[1] : argsOpt.option.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        let rangeIdx: number[] = getRangeIndexes(range);
        let top: number;
        let left: number;
        let position: object;
        let options: ChartModel = {};
        let isRowLesser: boolean;
        let xRange: number[];
        let yRange: number[];
        let lRange: number[];
        let eventArgs: BeforeChartEventArgs;
        if (!this.parent.allowChart && sheet.isProtected) {
            return seriesModel;
        }
        let sheetIdx: number = (argsOpt.option.range && argsOpt.option.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, argsOpt.option.range.split('!')[0]) : this.parent.activeSheetIndex;
        let args: {
            sheetIndex: number, reqType: string, type: string, shapeType: string, action: string,
            options: ChartModel, range: string, operation: string
        } = {
            sheetIndex: sheetIdx, reqType: 'shape', type: 'actionBegin', shapeType: 'chart',
            action: 'create', options: argsOpt.option, range: range, operation: 'create',
        };
        options = args.options;
        range = args.range;
        options = options || {};
        let chartOptions: { series: SeriesModel[] | AccumulationSeriesModel[], xRange: number[], yRange: number[], lRange: number[] };
        let chartRange: { xRange: number[], yRange: number[], lRange: number[] }; let type: string = 'chart';
        if (rangeIdx.length > 0) {
            let rDiff: number = rangeIdx[2] - rangeIdx[0];
            let cDiff: number = rangeIdx[3] - rangeIdx[1];
            if (rDiff < cDiff) {
                isRowLesser = true;
            }
        }
        options.isSeriesInRows = isRowLesser ? true : options.isSeriesInRows ? options.isSeriesInRows : false;
        argsOpt.dataSheetIdx = isNullOrUndefined(argsOpt.dataSheetIdx) ? sheetIdx : argsOpt.dataSheetIdx;
        chartRange = this.processChartRange(rangeIdx, argsOpt.dataSheetIdx, options);
        xRange = chartRange.xRange;
        yRange = chartRange.yRange;
        lRange = chartRange.lRange;
        if (sheetIdx === this.parent.activeSheetIndex && isRangeSelect) {
            this.focusChartRange(xRange, yRange, lRange);
        }
        chartOptions = this.processChartSeries(options, argsOpt.dataSheetIdx, xRange, yRange, lRange);
        let primaryXAxis: AxisModel = {
            majorGridLines: { width: 0 },
            minorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 },
            lineStyle: { width: 0 },
            valueType: 'Category'
        };
        let primaryYAxis: AxisModel = {
            lineStyle: { width: 0 },
            majorTickLines: { width: 0 },
            majorGridLines: { width: 1 },
            minorGridLines: { width: 1 },
            minorTickLines: { width: 0 },
            labelFormat: this.primaryYAxisFormat(yRange)
        };
        if (argsOpt.isRefresh) {
            return chartOptions.series;
        }
        if (argsOpt.isUndoRedo) {
        eventArgs = {
            type: argsOpt.option.type, theme: argsOpt.option.theme, isSeriesInRows: argsOpt.option.isSeriesInRows,
            range: argsOpt.option.range, id: argsOpt.option.id, posRange: argsOpt.range, isInitCell: argsOpt.isInitCell, cancel: false
        };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeInsertChart' });
        if (eventArgs.cancel) { return []; }
        argsOpt.option.type = eventArgs.type;
        argsOpt.option.theme = eventArgs.theme;
        argsOpt.option.isSeriesInRows = eventArgs.isSeriesInRows;
        argsOpt.option.range = eventArgs.range;
        argsOpt.option.id = eventArgs.id;
        }
        let id: string = argsOpt.option.id + '_overlay';
        let sheetIndex: number = (argsOpt.option.range && argsOpt.option.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, argsOpt.option.range.split('!')[0]) : this.parent.activeSheetIndex;
        let overlayObj: Overlay = this.parent.serviceLocator.getService(overlay) as Overlay;
        let eleRange: string = !isNullOrUndefined(argsOpt.isInitCell) && argsOpt.isInitCell ? argsOpt.range : range;
        let element: HTMLElement = overlayObj.insertOverlayElement(id, eleRange, sheetIndex);
        element.classList.add('e-datavisualization-chart');
        element.style.width = '482px';
        element.style.height = '290px';
        let chartContent: HTMLElement =
            this.parent.createElement('div', {
                id: argsOpt.option.id, className: argsOpt.option.id
            });
        if (argsOpt.option.type !== 'Pie' && argsOpt.option.type !== 'Doughnut') {
            this.chart = new Chart({
                primaryXAxis: primaryXAxis,
                primaryYAxis: primaryYAxis,
                chartArea: {
                    border: {
                        width: 0
                    }
                },
                series: chartOptions.series as SeriesModel[],
                tooltip: {
                    enable: true
                },
                width: element.style.width,
                height: element.style.height,
                load: (args: ILoadedEventArgs) => {
                    let selectedTheme: string = argsOpt.option.theme;
                    selectedTheme = selectedTheme ? selectedTheme : 'Material';
                    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
                        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
                }
            });
            this.chart.appendTo(chartContent);
        } else {
            this.chart = new AccumulationChart({
                series: chartOptions.series as AccumulationSeriesModel[],
                width: element.style.width,
                height: element.style.height,
                center: { x: '50%', y: '50%' },
                enableSmartLabels: true,
                enableAnimation: true,
                legendSettings: { visible: true, position: 'Bottom' },
                load: (args: IAccLoadedEventArgs) => {
                    let selectedTheme: string = location.hash.split('/')[1];
                    selectedTheme = selectedTheme ? selectedTheme : 'Material';
                    args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() +
                        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
                }
            });
            this.chart.appendTo(chartContent);
        }
        element.appendChild(chartContent);
        if (argsOpt.isUndoRedo) {
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'insertChart' });
        }
        return seriesModel;
    }

    public deleteChart(args: { id: string, range?: string }): void {
        this.clearBorder();
        let chartElements: HTMLElement = null;
        let sheet: SheetModel;
        if (isNullOrUndefined(args.id)) {
            chartElements = document.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
            args.id = chartElements ? chartElements.getElementsByClassName('e-control')[0].id : null;
        } else {
        args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
        chartElements = document.getElementById(args.id);
        }
        if (isNullOrUndefined(args.id) || isNullOrUndefined(chartElements)) {
            return;
        } else {
            args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
        }
        let rowIdx: number; let colIdx: number;
        let cellObj: CellModel;
        let prevCellChart: object[];
        let chartLength: number;
        let isRemoveEle: boolean = false;
        let chartObj: ChartModel;
        for (let i: number = 0; i < this.parent.chartColl.length; i++) {
            if (this.parent.chartColl[i].id === args.id.split('_overlay')[0]) {
                chartObj = this.parent.chartColl[i];
                break;
            }
        }
        let eventArgs: BeforeChartEventArgs = {
            id: chartObj.id, range: chartObj.range, type: chartObj.type, theme: chartObj.theme,
            isSeriesInRows: chartObj.isSeriesInRows, isInitCell: true, posRange: null, cancel: false
        };
        if (chartElements) {
            this.parent.notify(deleteChartColl, { id: args.id });
            let imgTop: { clientY: number, isImage: boolean } = { clientY: chartElements.offsetTop, isImage: true };
            this.parent.notify(getRowIdxFromClientY, imgTop);
            let imgleft: { clientX: number, isImage: boolean } = { clientX: chartElements.offsetLeft, isImage: true };
            this.parent.notify(getColIdxFromClientX, imgleft);
            isRemoveEle = true;
            rowIdx = imgTop.clientY; colIdx = imgleft.clientX;
            sheet = this.parent.sheets[this.parent.activeSheetIndex];
        } else {
            this.parent.notify(deleteChartColl, { id: args.id });
            let sheetIndex: number = args.range && args.range.indexOf('!') > 0 ? getSheetIndex(this.parent, args.range.split('!')[0]) :
                this.parent.activeSheetIndex;
            let rangeVal: string = args.range ? args.range.indexOf('!') > 0 ? args.range.split('!')[1] : args.range.split('!')[0] :
                this.parent.getActiveSheet().selectedRange;
            let index: number[] = getRangeIndexes(rangeVal);
            rowIdx = index[0]; colIdx = index[1];
            sheet = this.parent.sheets[sheetIndex];
        }
        cellObj = getCell(rowIdx, colIdx, sheet);
        if (cellObj) {
            prevCellChart = cellObj.chart;
        }
        chartLength = prevCellChart ? prevCellChart.length : chartLength;
        for (let i: number = 0; i < chartLength; i++) {
            let overlayEle: HTMLElement = document.getElementById(args.id);
            let chartEleClassName: HTMLElement = document.getElementById((prevCellChart[i] as ChartModel).id);
            if (closest(chartEleClassName, '.' + overlayEle.classList[1]) === overlayEle) {
                prevCellChart.splice(i, 1);
            }
        }
        if (isRemoveEle) {
            document.getElementById(args.id).remove();
        }
        setCell(rowIdx, colIdx, sheet, { chart: prevCellChart }, true);
        eventArgs.posRange = getCellAddress(rowIdx, colIdx);
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteChart' });
    }

    /**
     * Removing event listener for success and failure 
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateChart, this.initiateChartHandler);
            this.parent.off(refreshChartCellObj, this.refreshChartCellObj);
            this.parent.off(updateChart, this.updateChartHandler);
            this.parent.off(deleteChart, this.deleteChart);
            this.parent.off(clearChartBorder, this.clearBorder);
            this.parent.off(insertChart, this.insertChartHandler);
        }
    }

    /**
     * To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
        let chartEle: HTMLElement = null;
        if (this.chart) {
            chartEle = this.chart.element;
            this.chart.destroy();
        }
        if (chartEle) { detach(chartEle); } this.chart = null;
    }

    /**
     * Get the sheet chart module name.
     */
    public getModuleName(): string {
        return 'spreadsheetChart';
    }
}