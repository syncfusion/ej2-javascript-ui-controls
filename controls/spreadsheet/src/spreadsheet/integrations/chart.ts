/**
 * Open properties.
 */
import { Spreadsheet } from '../base/index';
import { getSheetIndex, SheetModel, isHiddenRow, CellModel, getCell, setCell, Workbook, getSheet } from '../../workbook/index';
import { initiateChart, ChartModel, getRangeIndexes, isNumber, LegendPosition, getSheetIndexFromAddress, DateFormatCheckArgs, checkDateFormat, refreshChartCellOnInit, workbookFormulaOperation, checkIsFormula } from '../../workbook/common/index';
import { Overlay, Dialog } from '../services/index';
import { overlay, locale, refreshChartCellObj, getRowIdxFromClientY, getColIdxFromClientX, deleteChart, dialog, overlayEleSize, undoRedoForChartDesign, BeforeActionData, addDPRValue, refreshChartCellModel } from '../common/index';
import { BeforeImageRefreshData, BeforeChartEventArgs, completeAction, clearChartBorder, focusBorder } from '../common/index';
import { Chart, ColumnSeries, Category, ILoadedEventArgs, StackingColumnSeries, BarSeries, ChartSeriesType, AccumulationLabelPosition, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-charts';
import { AreaSeries, StackingAreaSeries, AccumulationChart, IAccLoadedEventArgs, Tooltip } from '@syncfusion/ej2-charts';
import { Legend, StackingBarSeries, SeriesModel, LineSeries, StackingLineSeries, AxisModel, ScatterSeries } from '@syncfusion/ej2-charts';
import { AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationSeriesModel } from '@syncfusion/ej2-charts';
import { L10n, isNullOrUndefined, getComponent, closest, detach, isUndefined, getUniqueID } from '@syncfusion/ej2-base';
import { isCustomDateTime } from '../../workbook/index';
import { updateChart, deleteChartColl, getFormattedCellObject, setChart, getCellAddress, ChartTheme } from '../../workbook/common/index';
import { insertChart, chartRangeSelection, addChartEle, chartDesignTab, removeDesignChart, insertDesignChart, getUpdateUsingRaf, focus } from '../common/index';
import { DataLabel, DataLabelSettingsModel, IBeforeResizeEventArgs } from '@syncfusion/ej2-charts';
import { LegendSettingsModel, LabelPosition, ChartType, isHiddenCol, beginAction, NumberFormatArgs } from '../../workbook/index';

Chart.Inject(ColumnSeries, LineSeries, BarSeries, AreaSeries, StackingColumnSeries, StackingLineSeries, StackingBarSeries, ScatterSeries);
Chart.Inject(StackingAreaSeries, Category, Legend, Tooltip, DataLabel);
AccumulationChart.Inject(PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationLegend);

/**
 * Represents Chart support for Spreadsheet.
 */
export class SpreadsheetChart {
    private parent: Spreadsheet;
    private chart: Chart | AccumulationChart;

    /**
     * Constructor for the Spreadsheet Chart module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet Chart module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Adding event listener for success and failure
     *
     * @returns {void} - Adding event listener for success and failure
     */
    private addEventListener(): void {
        this.parent.on(initiateChart, this.initiateChartHandler, this);
        this.parent.on(refreshChartCellObj, this.refreshChartCellObj, this);
        this.parent.on(refreshChartCellModel, this.refreshChartCellModel, this);
        this.parent.on(refreshChartCellOnInit, this.refreshChartCellObj, this);
        this.parent.on(updateChart, this.updateChartHandler, this);
        this.parent.on(deleteChart, this.deleteChart, this);
        this.parent.on(clearChartBorder, this.clearBorder, this);
        this.parent.on(insertChart, this.insertChartHandler, this);
        this.parent.on(chartRangeSelection, this.chartRangeHandler, this);
        this.parent.on(chartDesignTab, this.chartDesignTabHandler, this);
        this.parent.on(addChartEle, this.updateChartElement, this);
        this.parent.on(undoRedoForChartDesign, this.undoRedoForChartDesign, this);
    }

    private insertChartHandler(args: { action: string, id: string, isChart?: boolean }): void {
        let chartType: ChartType = 'Column';
        let markerVisible: boolean = false;
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
        case 'lineMarker':
            chartType = 'Line';
            markerVisible = true;
            break;
        case 'stackedLine':
            chartType = 'StackingLine';
            break;
        case 'stackedLineMarker':
            chartType = 'StackingLine';
            markerVisible = true;
            break;
        case 'stackedLine100':
            chartType = 'StackingLine100';
            break;
        case 'stackedLine100Marker':
            chartType = 'StackingLine100';
            markerVisible = true;
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
        const chart: ChartModel[] = [{ type: chartType, markerSettings : { visible : markerVisible, isFilled: true } }];
        if (args.isChart) {
            this.parent.notify(setChart, { chart: chart });
            getUpdateUsingRaf((): void => focus(this.parent.element));
        } else {
            this.parent.notify(chartDesignTab, { chartType: chartType, triggerEvent: true, markerVisible: markerVisible  });
        }
    }

    private chartRangeHandler(): void {
        const overlayEle: HTMLElement = document.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
        if (overlayEle) {
            const chartId: string = overlayEle.getElementsByClassName('e-control')[0].id;
            const chartColl: ChartModel[] = this.parent.chartColl;
            const chartCollLen: number = chartColl.length;
            for (let idx: number = 0; idx < chartCollLen; idx++) {
                const chartEle: HTMLElement = document.getElementById(chartColl[idx as number].id);
                if (overlayEle && chartEle && chartColl[idx as number].id === chartId) {
                    this.parent.notify(initiateChart, {
                        option: chartColl[idx as number], isRefresh: true
                    });
                }
            }
        }
    }

    private updateChartHandler(args: { chart: ChartModel }): void {
        const series: SeriesModel[] = this.initiateChartHandler({ option: args.chart, isRefresh: true }) as SeriesModel[];
        const chartObj: HTMLElement = this.parent.element.querySelector('.' + args.chart.id);
        if (chartObj) {
            let chartComp: Chart = getComponent(chartObj, 'chart');
            if (isNullOrUndefined(chartComp)) {
                chartComp = getComponent(chartObj, 'accumulationchart');
            }
            chartComp.series = series;
            chartComp.refresh();
        }
    }

    private refreshChartCellModel(args: {
        prevChartIndexes: { chart: ChartModel, chartRowIdx: number, chartColIdx: number }[],
        currentChartIndexes: { chart: ChartModel, chartRowIdx: number, chartColIdx: number }[]
    }): void {
        for (let i: number = 0, len: number = args.prevChartIndexes.length; i < len; i++) {
            const chart: ChartModel = args.prevChartIndexes[i as number].chart;
            const prevRowIdx: number = args.prevChartIndexes[i as number].chartRowIdx;
            const prevColIdx: number = args.prevChartIndexes[i as number].chartColIdx;
            const currentRowIdx: number = args.currentChartIndexes[i as number].chartRowIdx;
            const currentColIdx: number = args.currentChartIndexes[i as number].chartColIdx;
            const eventArgs: BeforeImageRefreshData = {
                prevTop: chart.top, prevLeft: chart.left, prevRowIdx: prevRowIdx, prevColIdx: prevColIdx,
                prevHeight: chart.height, prevWidth: chart.width, currentTop: chart.top, currentLeft: chart.left,
                currentRowIdx: currentRowIdx, currentColIdx: currentColIdx, currentHeight: chart.height,
                currentWidth: chart.width, id: chart.id, requestType: 'chartRefreshOnFilter'
            };
            this.parent.notify(refreshChartCellObj, eventArgs);
        }
    }

    private refreshChartCellObj(args: BeforeImageRefreshData): void {
        const sheetIndex: number = isUndefined(args.sheetIdx) ? this.parent.activeSheetIndex : args.sheetIdx;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const prevCellObj: CellModel = getCell(args.prevRowIdx, args.prevColIdx, sheet);
        const currCellObj: CellModel = getCell(args.currentRowIdx, args.currentColIdx, sheet);
        const prevCellChart: object[] = prevCellObj ? prevCellObj.chart : [];
        let prevChartObj: ChartModel;
        let currChartObj: ChartModel[];
        let prevCellChartLen: number = (prevCellChart && prevCellChart.length) ? prevCellChart.length : 0;
        if (prevCellChartLen) {
            for (let i: number = 0; i < prevCellChartLen; i++) {
                if ((prevCellChart[i as number] as ChartModel).id === args.id.split('_overlay')[0]) {
                    prevChartObj = prevCellChart[i as number];
                    prevChartObj.height = args.currentHeight;
                    prevChartObj.width = args.currentWidth;
                    prevChartObj.top = args.currentTop;
                    prevChartObj.left = args.currentLeft;
                    prevCellChart.splice(i, 1);
                    i--; prevCellChartLen--;
                    for (let idx: number = 0, chartCollLen: number = this.parent.chartColl.length; idx < chartCollLen; idx++) {
                        if (prevChartObj.id === this.parent.chartColl[idx as number].id) {
                            prevChartObj.height = args.currentHeight;
                            this.parent.chartColl[idx as number].width = args.currentWidth;
                            this.parent.chartColl[idx as number].top = args.currentTop;
                            this.parent.chartColl[idx as number].left = args.currentLeft;
                        }
                    }
                }
            }
            if (currCellObj && currCellObj.chart) {
                currChartObj = currCellObj.chart;
                if (prevChartObj) {
                    currChartObj.push(prevChartObj);
                }
            }
            if (currChartObj) {
                setCell(args.currentRowIdx, args.currentColIdx, sheet, { chart: currChartObj }, true);
            } else {
                setCell(args.currentRowIdx, args.currentColIdx, sheet, { chart: [prevChartObj] }, true);
            }
            if (args.requestType === 'chartRefresh' && !args.isUndoRedo) {
                const eventArgs: BeforeImageRefreshData = {
                    requestType: 'chartRefresh', currentRowIdx: args.currentRowIdx, currentColIdx: args.currentColIdx,
                    currentWidth: args.currentWidth, prevHeight: args.prevHeight, prevWidth: args.prevWidth,
                    prevRowIdx: args.prevRowIdx, prevColIdx: args.prevColIdx, prevTop: args.prevTop, prevLeft: args.prevLeft,
                    currentTop: args.currentTop, currentLeft: args.currentLeft, currentHeight: args.currentHeight,
                    id: args.id, sheetIdx: sheetIndex
                };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'chartRefresh' });
            }
        }
    }

    private processChartRange(range: number[], dataSheetIdx: number, opt: ChartModel): {
        xRange: number[], yRange: number[], lRange: number[], isStringSeries: boolean } {
        let xRange: number[];
        let yRange: number[];
        let lRange: number[];
        const minr: number = range[0];
        const minc: number = range[1]; let isStringSeries: boolean = false;
        const maxr: number = range[2]; const maxc: number = range[3]; const isSingleRow: boolean = minr === maxr;
        const isSingleCol: boolean = minc === maxc; let isDateTimeFormat: boolean;
        const getPropertyValue: Function = (rIdx: number, cIdx: number, sheetIndex: number, checkDateTime?: boolean): string | number => {
            const cell: CellModel = getCell(rIdx, cIdx, getSheet(this.parent, sheetIndex));
            if (cell) {
                let value: string | number;
                if (cell.formula && isNullOrUndefined(cell.value)) {
                    this.parent.notify(workbookFormulaOperation, {
                        action: 'refreshCalculate', value: cell.formula, rowIndex:
                            rIdx, colIndex: cIdx, isFormula: checkIsFormula(cell.formula), sheetIndex: sheetIndex
                    });
                    value = cell.value || (<unknown>cell.value === 0 ? 0 : null);
                }
                if (cell.format) {
                    const formatObj: NumberFormatArgs = { value: cell.value, format: cell.format, formattedText: cell.value, cell: cell,
                        rowIndex: rIdx, colIndex: cIdx };
                    this.parent.notify(getFormattedCellObject, formatObj);
                    const isNum: boolean = isNumber(cell.value);
                    if (isNum && !isCustomDateTime(cell.format, true, null, true)) {
                        // eslint-disable-next-line no-useless-escape
                        const escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,{}|\":<>~_-]', 'g');
                        formatObj.formattedText = (formatObj.formattedText.toString()).replace(escapeRegx, '');
                        value = parseInt(formatObj.formattedText.toString(), 10);
                    } else {
                        if (checkDateTime && isNum) {
                            isDateTimeFormat = true;
                        }
                        value = formatObj.formattedText && formatObj.formattedText.toString();
                    }
                } else {
                    value = cell.value;
                }
                return isNullOrUndefined(value) ? '' : value;
            } else {
                return '';
            }
        };
        const trVal: number | string = getPropertyValue(minr, maxc, dataSheetIdx, true);
        const blVal: number | string = getPropertyValue(maxr, minc, dataSheetIdx);
        const tlVal: number | string = getPropertyValue(minr, minc, dataSheetIdx);
        if (!isNumber(blVal) || !tlVal) {
            isStringSeries = true;
        }
        if ((isNullOrUndefined(tlVal) || (opt.type === 'Scatter' && !opt.isSeriesInRows)) && !isSingleRow && !isSingleCol) {
            xRange = [minr + 1, minc, maxr, minc];
            yRange = [minr + 1, minc + 1, maxr, maxc];
            lRange = [minr, minc + 1, minr, maxc];
        } else if (!isNullOrUndefined(blVal) && isStringSeries && !isSingleRow && !isSingleCol && !isDateTimeFormat) {
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
            if ((!isNullOrUndefined(trVal) && !isNumber(trVal) && !isDateTimeFormat)) {
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
        return { xRange: xRange, yRange: yRange, lRange: lRange, isStringSeries: isStringSeries };
    }

    private toIntrnlRange(range: number[], sheetIdx: number): number[] {
        if (!range) {
            range = getRangeIndexes[this.parent.sheets[sheetIdx as number].selectedRange];
        } else if (typeof (range) === 'string') {
            range = getRangeIndexes[`${range}`];
        }
        return range;
    }

    private getRangeData(options: { range: number[], sheetIdx: number, skipFormula: boolean, isYvalue: boolean }): { value: number }[] {
        options.range = this.toIntrnlRange(options.range, options.sheetIdx);
        const rowIdx: number[] = []; const arr: { value: number }[] = [];
        this.pushRowData(
            options, options.range[0], options.range[1], options.range[2], options.range[3], arr, rowIdx, true, options.isYvalue);
        return arr;
    }

    private pushRowData(
        options: { range: number[], sheetIdx: number, skipFormula: boolean }, minr: number,
        minc: number, maxr: number, maxc: number, arr: object[], rowIdx: number[], isDataSrcEnsured: boolean, isYvalue: boolean): void {
        const minCol: number = minc; const sheet: SheetModel = this.parent.sheets[options.sheetIdx]; let value: string | number;
        while (minr <= maxr) {
            if (isHiddenRow(sheet, minr)) { minr++; continue; }
            minc = minCol;
            while (minc <= maxc) {
                if (isHiddenCol(sheet, minc)) { minc++; continue; }
                const cell: CellModel = getCell(minr, minc, sheet, false, true);
                if (cell.formula && isNullOrUndefined(cell.value)) {
                    this.parent.notify(workbookFormulaOperation, {
                        action: 'refreshCalculate', value: cell.formula, rowIndex:
                            minr, colIndex: minc, isFormula: checkIsFormula(cell.formula), sheetIndex: options.sheetIdx
                    });
                    value = cell.value || (<unknown>cell.value === 0 ? 0 : null);
                }
                if (cell.format && !isYvalue) {
                    const forArgs: NumberFormatArgs = { value: cell.value, format: cell.format, formattedText: cell.value, rowIndex: minr,
                        colIndex: minc, cell: cell };
                    this.parent.notify(getFormattedCellObject, forArgs);
                    value = forArgs.formattedText ? forArgs.formattedText.toString() : null;
                } else {
                    value = cell.value || (<unknown>cell.value === 0 ? 0 : null);
                }
                arr.push({ value });
                minc++;
            }
            minr++;
        }
        rowIdx.push(minr);
    }

    private toArrayData(args: { value: number }[]): string[] {
        const prop: string = 'value'; let obj: object; let i: number = 0;
        const temp: string[] = []; const len: number = args.length;
        while (i < len) {
            obj = args[i as number];
            if (Object.keys(obj).length) {
                if (prop in obj) {
                    temp.push(obj[`${prop}`]);
                }
            } else {
                temp.push('');
            }
            i++;
        }
        return temp;
    }

    private getVirtualXValues(limit: number): string[] {
        let i: number = 1; const arr: string[] = [];
        while (i < limit) {
            arr.push(i.toString());
            i++;
        }
        return arr;
    }

    private processChartSeries(
        options: ChartModel, sheetIndex: number, xRange: number[], yRange: number[],
        lRange: number[]): { series: SeriesModel[] | AccumulationSeriesModel[], xRange: number[], yRange: number[], lRange: number[] } {
        options = options || {};
        let seriesName: string = '';
        const dataLabel: DataLabelSettingsModel = {};
        let val: number | string; let xValue: string[];
        let lValue: string[]; let diff: number;
        let pArr: object[];
        let pObj: object = {};
        let j: number;
        let i: number = 0; let yInc: number = 0;
        const isPrint: boolean = this.parent.isPrintingProcessing;
        const sArr: SeriesModel[] = [];
        sheetIndex = isNullOrUndefined(sheetIndex) ? this.parent.getActiveSheet().index : sheetIndex;
        const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
        const yValue: { value: number }[] = this.getRangeData({ range: yRange, sheetIdx: sheetIndex, skipFormula: true, isYvalue: true });
        const rDiff: number = ((yRange[2] - yRange[0]) + 1) - this.parent.hiddenCount(yRange[0], yRange[2], 'rows', sheet);
        const cDiff: number = ((yRange[3] - yRange[1]) + 1) - this.parent.hiddenCount(yRange[1], yRange[3], 'columns', sheet);
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
        const len: number = xValue.length;
        const inc: number = options.isSeriesInRows ? 1 : diff;
        if (!isNullOrUndefined(options.dataLabelSettings)) {
            dataLabel.visible = options.dataLabelSettings.visible;
            dataLabel.position = options.dataLabelSettings.position;
        }
        while (i < diff) {
            j = 0;
            pArr = [];
            yInc = options.isSeriesInRows ? yInc : i;
            while (j < len) {
                if (yValue[yInc as number]) {
                    val = yValue[yInc as number].value;
                    if (isNumber(val)) {
                        val = Number(val);
                    } else {
                        const dateCheck: DateFormatCheckArgs = { value: isNullOrUndefined(val) ? '' : val.toString(), sheetIndex: sheetIndex, updatedVal: '' };
                        this.parent.notify(checkDateFormat, dateCheck);
                        if (dateCheck.isDate || dateCheck.isTime) {
                            val = dateCheck.updatedVal;
                        } else {
                            val = 0;
                        }
                    }
                    if (isNullOrUndefined(xValue[j as number]) && !isNullOrUndefined(val)) {
                        xValue[j as number] = getUniqueID('spread-chart-empty-label-');
                    }
                    pArr.push({ x: xValue[j as number], y: val });
                }
                yInc += inc;
                j++;
            }
            if (lValue && lValue.length > 0) {
                seriesName = lValue[i as number] as string;
            } else {
                seriesName = options.type === 'Scatter' ? ('series' + (i + 1)) : ('series' + i);
            }
            if (isNullOrUndefined(seriesName)) {
                seriesName = '';
            }
            if (options.type) {
                const type: ChartType = options.type;
                if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), animation: { enable: !isPrint },
                        marker: options.markerSettings ? { visible: options.markerSettings.visible, width: options.markerSettings.size,
                            height: options.markerSettings.size, shape: options.markerSettings.shape, dataLabel: dataLabel,
                            isFilled: options.markerSettings.isFilled, border: options.markerSettings.border,
                            fill: options.markerSettings.isFilled ? options.markerSettings.fill : null } : { dataLabel: dataLabel }
                    };
                } else if (type === 'Scatter') {
                    pObj = { dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), animation: { enable: !isPrint },
                        marker: { visible: false, width: 12, height: 12, shape: 'Circle', dataLabel: dataLabel } };
                } else if (type === 'Pie' || type === 'Doughnut') {
                    const innerRadius: string = options.type === 'Pie' ? '0%' : '40%';
                    const visible: boolean = dataLabel.visible;
                    const position: AccumulationLabelPosition =  isNullOrUndefined(dataLabel.position) ? 'Inside' : dataLabel.position === 'Outer' ? 'Outside' : 'Inside';
                    pObj = {
                        dataSource: pArr,
                        dataLabel: {
                            visible: !isNullOrUndefined(visible) ? visible : false, position: position, name: 'text', font: { fontWeight: '600' }
                        }, animation: { enable: !isPrint },
                        radius: '100%', xName: 'x', yName: 'y', innerRadius: innerRadius
                    };
                } else {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', animation: { enable: !isPrint },
                        name: seriesName.toString(), marker: { dataLabel: dataLabel }
                    };
                }
            }
            sArr.push(pObj);
            i++;
        }
        let retVal: { series: SeriesModel[], xRange: number[], yRange: number[], lRange: number[] };
        if (options.type) {
            retVal = {
                series: sArr, xRange: options.isSeriesInRows ? lRange : xRange,
                yRange: yRange, lRange: options.isSeriesInRows ? xRange : lRange
            };
        }
        return retVal;
    }

    private primaryYAxisFormat(yRange: number[]): string {
        let format: string = '';
        if (!isNullOrUndefined(yRange)) {
            const cell: CellModel = getCell(yRange[0], yRange[1], this.parent.getActiveSheet());
            if (cell && cell.format) {
                format = cell.format;
            }
        }
        return format;
    }

    private focusChartRange(xRange: number[], yRange: number[], lRange: number[]): void {
        const border: string[] =
            ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        this.clearBorder();
        let range: number[]; const sheet: SheetModel = this.parent.getActiveSheet();
        const isFreezePane: boolean = !!(sheet.frozenRows || sheet.frozenColumns);
        if (lRange) {
            if (isFreezePane) {
                range = lRange;
            } else {
                this.parent.notify(focusBorder, {
                    startcell: { rowIndex: lRange[0], colIndex: lRange[1] },
                    endcell: { rowIndex: lRange[2], colIndex: lRange[3] }, classes: [border[0], border[1]]
                });
            }
        }
        if (xRange) {
            if (isFreezePane) {
                if (range) {
                    range[0] = Math.min(lRange[0], xRange[0]); range[1] = Math.min(lRange[1], xRange[1]);
                    range[2] = Math.max(lRange[2], xRange[2]); range[3] = Math.max(lRange[3], xRange[3]);
                } else {
                    range = xRange;
                }
            } else {
                this.parent.notify(focusBorder, {
                    startcell: { rowIndex: xRange[0], colIndex: xRange[1] },
                    endcell: { rowIndex: xRange[2], colIndex: xRange[3] }, classes: [border[2], border[3]]
                });
            }
        }
        if (isFreezePane && range) {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: Math.min(range[0], yRange[0]), colIndex: Math.min(range[1], yRange[1]) },
                endcell: {
                    rowIndex: Math.max(range[2], yRange[2]), colIndex: Math.max(range[3],
                                                                                yRange[3])
                }, classes: [border[4], border[5]]
            });
        } else {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: yRange[0], colIndex: yRange[1] },
                endcell: { rowIndex: yRange[2], colIndex: yRange[3] }, classes: [border[4], border[5]]
            });
        }
    }

    private clearBorder(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenColumns || sheet.frozenRows) {
            const chartIndicator: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-chart-range'));
            chartIndicator.forEach((indicator: Element): void => { detach(indicator); });
            return;
        }
        const mainCont: Element = this.parent.getMainContent();
        const border: string[] =
            ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        for (let borderIdx: number = 0, borderLen: number = border.length; borderIdx < borderLen; borderIdx++) {
            const eleColl: NodeListOf<Element> = mainCont.querySelectorAll('.' + border[borderIdx as number]);
            for (let tdIdx: number = 0, eleCollLen: number = eleColl.length; tdIdx < eleCollLen; tdIdx++) {
                const td: HTMLElement = eleColl[tdIdx as number] as HTMLElement;
                td.classList.remove(border[borderIdx as number]);
            }
        }
    }

    private initiateChartHandler(argsOpt: {
        option: ChartModel, isRefresh?: boolean, isInitCell?: boolean,
        triggerEvent?: boolean, dataSheetIdx?: number, range?: string, isPaste?: boolean, isSwitchRowColumn?: boolean
    }): SeriesModel[] | AccumulationSeriesModel[] {
        const chart: ChartModel = argsOpt.option;
        let isRangeSelect: boolean = true;
        isRangeSelect = isNullOrUndefined(argsOpt.isInitCell) ? true : !argsOpt.isInitCell;
        argsOpt.triggerEvent = isNullOrUndefined(argsOpt.triggerEvent) ? true : argsOpt.triggerEvent;
        let seriesModel: SeriesModel[];
        argsOpt.isRefresh = isNullOrUndefined(argsOpt.isRefresh) ? false : argsOpt.isRefresh;
        const sheetIdx: number = (chart.range && chart.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent as Workbook, chart.range.split('!')[0]) : this.parent.activeSheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        let range: string = chart.range ? chart.range : this.parent.getActiveSheet().selectedRange;
        const rangeIdx: number[] = getRangeIndexes(range);
        let options: ChartModel = {};
        let isRowLesser: boolean;
        let eventArgs: BeforeChartEventArgs;
        if (!this.parent.allowChart && sheet.isProtected) {
            return seriesModel;
        }
        const args: {
            sheetIndex: number, reqType: string, type: string, shapeType: string, action: string,
            options: ChartModel, range: string, operation: string
        } = {
            sheetIndex: sheetIdx, reqType: 'shape', type: 'actionBegin', shapeType: 'chart',
            action: 'create', options: chart, range: range, operation: 'create'
        };
        options = args.options;
        range = args.range;
        options = options || {};
        if (rangeIdx.length > 0) {
            const rDiff: number = rangeIdx[2] - rangeIdx[0];
            const cDiff: number = rangeIdx[3] - rangeIdx[1];
            if (rDiff < cDiff) {
                isRowLesser = true;
            }
        }
        options.isSeriesInRows = isRowLesser ? true : options.isSeriesInRows ? options.isSeriesInRows : false;
        argsOpt.dataSheetIdx = isNullOrUndefined(argsOpt.dataSheetIdx) ? sheetIdx : argsOpt.dataSheetIdx;
        const chartRange: { xRange: number[], yRange: number[], lRange: number[], isStringSeries: boolean } =
            this.processChartRange(rangeIdx, argsOpt.dataSheetIdx, options);
        const xRange: number[] = chartRange.xRange;
        const yRange: number[] = chartRange.yRange;
        const lRange: number[] = chartRange.lRange;
        if (sheetIdx === this.parent.activeSheetIndex && isRangeSelect) {
            this.focusChartRange(xRange, yRange, lRange);
        }
        if (argsOpt.triggerEvent && !argsOpt.isRefresh) {
            eventArgs = {
                type: chart.type, theme: chart.theme, isSeriesInRows: chart.isSeriesInRows, range: chart.range,
                markerSettings: options.markerSettings, id: chart.id, height: chart.height, width: chart.width, posRange: argsOpt.range,
                isInitCell: argsOpt.isInitCell, cancel: false, top: chart.top, left: chart.left
            };
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeInsertChart' });
            if (eventArgs.cancel) { return []; }
            chart.type = eventArgs.type;
            chart.theme = eventArgs.theme;
            chart.isSeriesInRows = eventArgs.isSeriesInRows;
            chart.markerSettings = eventArgs.markerSettings;
            chart.range = eventArgs.range;
            chart.id = eventArgs.id;
            chart.height = eventArgs.height;
            chart.width = eventArgs.width;
        }
        const chartOptions: { series: SeriesModel[] | AccumulationSeriesModel[], xRange: number[], yRange: number[], lRange: number[] } =
            this.processChartSeries(options, argsOpt.dataSheetIdx, xRange, yRange, lRange);
        const primaryXAxis: AxisModel = {
            majorGridLines: chart.primaryXAxis && chart.primaryXAxis.majorGridLines &&
                !isNullOrUndefined(chart.primaryXAxis.majorGridLines.width) ?
                { width: chart.primaryXAxis.majorGridLines.width } : { width: 0 },
            minorGridLines: chart.primaryXAxis && chart.primaryXAxis.minorGridLines &&
                !isNullOrUndefined(chart.primaryXAxis.minorGridLines.width) ?
                { width: chart.primaryXAxis.minorGridLines.width } : { width: 0 },
            minorTicksPerInterval: chart.primaryXAxis && chart.primaryXAxis.minorGridLines && chart.primaryXAxis.minorGridLines.width > 0 ?
                5 : 0,
            lineStyle: { width: 0 },
            valueType: chart.type === 'Scatter' && !chartRange.isStringSeries && !chart.isSeriesInRows ? 'Double' : 'Category',
            rangePadding: chart.type === 'Scatter' && !chartRange.isStringSeries && !chart.isSeriesInRows ? 'Round' : 'Auto',
            visible: chart.primaryXAxis ? chart.primaryXAxis.visible : true,
            title: chart.primaryXAxis ? chart.primaryXAxis.title : '',
            edgeLabelPlacement: 'Shift'
        };
        const primaryYAxis: AxisModel = {
            lineStyle: { width: 0 },
            majorGridLines: chart.primaryYAxis && chart.primaryYAxis.majorGridLines &&
                !isNullOrUndefined(chart.primaryYAxis.majorGridLines.width) ?
                { width: chart.primaryYAxis.majorGridLines.width } : { width: 1 },
            minorGridLines: chart.primaryYAxis && chart.primaryYAxis.minorGridLines &&
                !isNullOrUndefined(chart.primaryYAxis.minorGridLines.width) ?
                { width: chart.primaryYAxis.minorGridLines.width } : { width: 0 },
            minorTicksPerInterval: chart.primaryYAxis && chart.primaryYAxis.minorGridLines && chart.primaryYAxis.minorGridLines.width > 0 ?
                5 : 0,
            visible: chart.primaryYAxis ? chart.primaryYAxis.visible : true,
            title: chart.primaryYAxis ? chart.primaryYAxis.title : '',
            edgeLabelPlacement: 'Shift'
        };
        if (argsOpt.isRefresh) {
            if (argsOpt.isSwitchRowColumn && chart.type === 'Scatter' ) {
                const chartObj: HTMLElement = this.parent.element.querySelector('.' + chart.id);
                if (chartObj) {
                    const chartComp: Chart = getComponent(chartObj, 'chart');
                    chartComp.primaryXAxis.valueType = !chartRange.isStringSeries && !chart.isSeriesInRows ? 'Double' : 'Category';
                }
            }
            return chartOptions.series;
        }
        const id: string = chart.id + '_overlay';
        const overlayObj: Overlay = this.parent.serviceLocator.getService(overlay) as Overlay;
        const eleRange: string = !isNullOrUndefined(argsOpt.isInitCell) && argsOpt.isInitCell ? argsOpt.range : range;
        const overlayProps: { element: HTMLElement, top: number, left: number } =
            overlayObj.insertOverlayElement(id, eleRange, getSheetIndexFromAddress(this.parent, eleRange));
        overlayProps.element.classList.add('e-datavisualization-chart');
        overlayProps.element.style.width = chart.width + 'px';
        overlayProps.element.style.height = chart.height + 'px';
        if (sheet.frozenRows || sheet.frozenColumns) {
            overlayObj.adjustFreezePaneSize(chart, overlayProps.element, eleRange);
        } else {
            if (isNullOrUndefined(chart.top)) {
                chart.top = overlayProps.top;
            } else {
                overlayProps.element.style.top = Number(addDPRValue(chart.top).toFixed(2)) + 'px';
            }
            if (isNullOrUndefined(chart.left)) {
                chart.left = overlayProps.left;
            } else {
                overlayProps.element.style.left = Number(addDPRValue(chart.left).toFixed(2)) + 'px';
            }
        }
        this.parent.notify(overlayEleSize, { height: chart.height, width: chart.width });
        const legendSettings: LegendSettingsModel =
            (chart.type === 'Pie' || chart.type === 'Doughnut') ? { position: 'Bottom', visible: true } : {};
        if (!isNullOrUndefined(chart.legendSettings)) {
            legendSettings.visible = chart.legendSettings.visible;
            legendSettings.position = chart.legendSettings.position;
        }
        const chartContent: HTMLElement =
            this.parent.createElement('div', {
                id: chart.id, className: chart.id
            });
        const theme: ChartTheme = chart.theme || 'Material';
        const format: string = this.primaryYAxisFormat(yRange);
        const borderWidth: number = Math.round(parseFloat(getComputedStyle(overlayProps.element).borderWidth)) * 2;
        const height: string = (parseFloat(overlayProps.element.style.height) - (isNaN(borderWidth) ? 0 : borderWidth)) + 'px';
        if (chart.type !== 'Pie' && chart.type !== 'Doughnut') {
            this.chart = new Chart({
                primaryXAxis: primaryXAxis,
                primaryYAxis: primaryYAxis,
                background: this.getThemeBgColor(theme),
                chartArea: {
                    border: {
                        width: 0
                    }
                },
                title: chart.title,
                legendSettings: legendSettings,
                theme: theme,
                series: chartOptions.series as SeriesModel[],
                tooltip: {
                    enable: true
                },
                width: overlayProps.element.style.width,
                height: height,
                enableRtl: this.parent.enableRtl,
                load: (args: ILoadedEventArgs) => {
                    args.chart.theme = chart.theme || 'Material';
                },
                beforeResize: (args: IBeforeResizeEventArgs) => {
                    args.cancelResizedEvent = true; // This is for cancel the resized event.
                },
                axisLabelRender: (args: IAxisLabelRenderEventArgs) => {
                    if (args.axis.name === 'primaryYAxis' && format && !isNullOrUndefined(args.value) && this.parent) {
                        args.text = this.parent.getDisplayText({ format: format, value: args.value.toString()});
                    } else if (args.axis.name === 'primaryXAxis' && args.text.startsWith('spread-chart-empty-label-')) {
                        args.text = '';
                    }
                    if (args.axis.name === 'primaryXAxis' && chart.type === 'Scatter' && args.axis.labels.length > 0) {
                        args.text = !isNumber(args.text) ? (args.axis.labels.indexOf(args.text) + 1).toString() : args.text;
                    }
                }
            });
            this.chart.appendTo(chartContent);
        } else {
            this.chart = new AccumulationChart({
                title: chart.title,
                legendSettings: legendSettings,
                theme: theme,
                background: this.getThemeBgColor(theme),
                series: chartOptions.series as AccumulationSeriesModel[],
                width: overlayProps.element.style.width,
                height: height,
                center: { x: '50%', y: '50%' },
                enableSmartLabels: true,
                enableAnimation: true,
                enableRtl: this.parent.enableRtl,
                load: (args: IAccLoadedEventArgs) => {
                    args.chart.theme = chart.theme || 'Material';
                },
                beforeResize: (args: IBeforeResizeEventArgs) => {
                    args.cancelResizedEvent = true; // This is for cancel the resized event.
                }
            });
            this.chart.appendTo(chartContent);
        }
        overlayProps.element.appendChild(chartContent);
        if (overlayProps.element.classList.contains('e-ss-overlay-active') && !this.parent.isPrintingProcessing) {
            this.parent.notify(insertDesignChart, { id: overlayProps.element.id });
        }
        if (argsOpt.triggerEvent) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'insertChart' });
        }
        return seriesModel;
    }

    public deleteChart(args: { id: string, range?: string, isUndoRedo?: boolean }): void {
        this.clearBorder();
        let chartElements: HTMLElement = null;
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isNullOrUndefined(args.id)) {
            chartElements = document.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
            args.id = chartElements ? chartElements.getElementsByClassName('e-control')[0].id : null;
        } else {
            args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
            chartElements = document.getElementById(args.id);
        }
        if (isNullOrUndefined(args.id)) {
            return;
        } else {
            args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
        }
        let rowIdx: number; let colIdx: number;
        let prevCellChart: ChartModel[];
        let isRemoveEle: boolean = false;
        let chartObj: ChartModel;
        for (let i: number = 0, chartCollLen: number = this.parent.chartColl.length; i < chartCollLen; i++) {
            if (this.parent.chartColl[i as number].id === args.id.split('_overlay')[0]) {
                chartObj = this.parent.chartColl[i as number];
                break;
            }
        }
        const eventArgs: BeforeChartEventArgs = {
            id: chartObj.id, range: chartObj.range, type: chartObj.type, markerSettings: chartObj.markerSettings,
            theme: chartObj.theme, height: chartObj.height, width: chartObj.width, isSeriesInRows: chartObj.isSeriesInRows,
            isInitCell: true, posRange: null, top: chartObj.top, left: chartObj.left, cancel: false
        };
        if (chartElements) {
            let chartTop: { clientY: number, isImage?: boolean, target?: Element };
            let chartleft: { clientX: number, isImage?: boolean, target?: Element };
            if (sheet.frozenRows || sheet.frozenColumns) {
                const clientRect: ClientRect = chartElements.getBoundingClientRect();
                chartTop = { clientY: clientRect.top }; chartleft = { clientX: clientRect.left };
                if (clientRect.top < this.parent.getColumnHeaderContent().getBoundingClientRect().bottom) {
                    chartTop.target = this.parent.getColumnHeaderContent();
                }
                if (clientRect.left < this.parent.getRowHeaderContent().getBoundingClientRect().right) {
                    chartleft.target = this.parent.getRowHeaderTable();
                }
            } else {
                chartTop = { clientY: parseFloat(chartElements.style.top), isImage: true };
                chartleft = { clientX: parseFloat(chartElements.style.left), isImage: true };
            }
            this.parent.notify(deleteChartColl, { id: args.id });
            this.parent.notify(getRowIdxFromClientY, chartTop); this.parent.notify(getColIdxFromClientX, chartleft);
            isRemoveEle = true;
            rowIdx = chartTop.clientY; colIdx = chartleft.clientX;
            sheet = this.parent.sheets[this.parent.activeSheetIndex];
        } else {
            this.parent.notify(deleteChartColl, { id: args.id });
            const sheetIndex: number = args.range && args.range.indexOf('!') > 0 ? getSheetIndex(this.parent as Workbook, args.range.split('!')[0]) :
                this.parent.activeSheetIndex;
            const rangeVal: string = args.range ? args.range.indexOf('!') > 0 ? args.range.split('!')[1] : args.range.split('!')[0] :
                this.parent.getActiveSheet().selectedRange;
            const index: number[] = getRangeIndexes(rangeVal);
            rowIdx = index[0]; colIdx = index[1];
            sheet = this.parent.sheets[sheetIndex as number];
        }
        const cellObj: CellModel = getCell(rowIdx, colIdx, sheet);
        if (cellObj) {
            prevCellChart = cellObj.chart;
        }
        let chartLength: number = prevCellChart ? prevCellChart.length : null;
        for (let i: number = 0; i < chartLength; i++) {
            if (args.id === prevCellChart[i as number].id + '_overlay') {
                prevCellChart.splice(i, 1);
                chartLength = prevCellChart.length;
            }
        }
        if (isRemoveEle) {
            document.getElementById(args.id).remove();
            this.parent.notify(removeDesignChart, {});
        }
        setCell(rowIdx, colIdx, sheet, { chart: prevCellChart }, true);
        eventArgs.posRange = getCellAddress(rowIdx, colIdx);
        if (!args.isUndoRedo) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteChart' });
        }
    }

    private updateChartModel(
        eleId: string, chartComp: Chart | AccumulationChart, currCellObj: CellModel, chartCollId: number,
        isAccumulationChart?: boolean): void {
        const accumulationChartComp: AccumulationChart = chartComp as AccumulationChart;
        chartComp = chartComp as Chart;
        const chartId: string = this.parent.chartColl[chartCollId as number].id;
        if (isAccumulationChart &&
            ['PHAxes', 'PVAxes', 'PHAxisTitle', 'PVAxisTitle', 'GLMajorHorizontal',
                'GLMajorVertical', 'GLMinorHorizontal', 'GLMinorVertical'].indexOf(eleId) > -1) { return; }
        for (let idx: number = 0, chartsCount: number = currCellObj.chart.length; idx < chartsCount; idx++) {
            if (currCellObj.chart[idx as number].id === chartId) {
                switch (eleId) {
                case 'PHAxes': case 'PHAxisTitle':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryXAxis)) {
                        currCellObj.chart[idx as number].primaryXAxis = {}; this.parent.chartColl[chartCollId as number].primaryXAxis = {};
                    }
                    if (eleId === 'PHAxes') {
                        currCellObj.chart[idx as number].primaryXAxis.visible = chartComp.primaryXAxis.visible;
                        this.parent.chartColl[chartCollId as number].primaryXAxis.visible = chartComp.primaryXAxis.visible;
                    } else if (eleId === 'PHAxisTitle') {
                        currCellObj.chart[idx as number].primaryXAxis.title = chartComp.primaryXAxis.title;
                        this.parent.chartColl[chartCollId as number].primaryXAxis.title = chartComp.primaryXAxis.title;
                    } break;
                case 'PVAxes': case 'PVAxisTitle':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryYAxis)) {
                        currCellObj.chart[idx as number].primaryYAxis = {}; this.parent.chartColl[chartCollId as number].primaryYAxis = {};
                    }
                    if (eleId === 'PVAxes') {
                        currCellObj.chart[idx as number].primaryYAxis.visible = chartComp.primaryYAxis.visible;
                        this.parent.chartColl[chartCollId as number].primaryYAxis.visible = chartComp.primaryYAxis.visible;
                    } else if (eleId === 'PVAxisTitle') {
                        currCellObj.chart[idx as number].primaryYAxis.title = chartComp.primaryYAxis.title;
                        this.parent.chartColl[chartCollId as number].primaryYAxis.title = chartComp.primaryYAxis.title;
                    } break;
                case 'ChartTitleNone': case 'ChartTitleAbove':
                    currCellObj.chart[idx as number].title = chartComp.title;
                    this.parent.chartColl[chartCollId as number].title = chartComp.title;
                    break;
                case 'DLNone': case 'DLCenter': case 'DLInsideend': case 'DLInsidebase': case 'DLOutsideend':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].dataLabelSettings)) {
                        currCellObj.chart[idx as number].dataLabelSettings = {};
                        this.parent.chartColl[chartCollId as number].dataLabelSettings = {};
                    }
                    if (eleId === 'DLNone') {
                        currCellObj.chart[idx as number].dataLabelSettings.visible = false;
                        this.parent.chartColl[chartCollId as number].dataLabelSettings.visible = false;
                    } else {
                        currCellObj.chart[idx as number].dataLabelSettings.visible = true;
                        this.parent.chartColl[chartCollId as number].dataLabelSettings.visible = true;
                        let position: LabelPosition;
                        if (isAccumulationChart) {
                            position = accumulationChartComp.series[0].dataLabel.position === 'Outside' ? 'Outer' : 'Middle';
                        } else {
                            position = chartComp.series[0].marker.dataLabel.position;
                        }
                        currCellObj.chart[idx as number].dataLabelSettings.position = position;
                        this.parent.chartColl[chartCollId as number].dataLabelSettings.position = position;
                    } break;
                case 'GLMajorHorizontal':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryYAxis)) {
                        currCellObj.chart[idx as number].primaryYAxis = {}; this.parent.chartColl[chartCollId as number].primaryYAxis = {};
                    }
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryYAxis.majorGridLines)) {
                        currCellObj.chart[idx as number].primaryYAxis.majorGridLines = {};
                        this.parent.chartColl[chartCollId as number].primaryYAxis.majorGridLines = {};
                    }
                    currCellObj.chart[idx as number].primaryYAxis.majorGridLines.width = chartComp.primaryYAxis.majorGridLines.width;
                    this.parent.chartColl[chartCollId as number].primaryYAxis.majorGridLines.width =
                        chartComp.primaryYAxis.majorGridLines.width;
                    break;
                case 'GLMajorVertical':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryXAxis)) {
                        currCellObj.chart[idx as number].primaryXAxis = {}; this.parent.chartColl[chartCollId as number].primaryXAxis = {};
                    }
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryXAxis.majorGridLines)) {
                        currCellObj.chart[idx as number].primaryXAxis.majorGridLines = {};
                        this.parent.chartColl[chartCollId as number].primaryXAxis.majorGridLines = {};
                    }
                    currCellObj.chart[idx as number].primaryXAxis.majorGridLines.width = chartComp.primaryXAxis.majorGridLines.width;
                    this.parent.chartColl[chartCollId as number].primaryXAxis.majorGridLines.width =
                        chartComp.primaryXAxis.majorGridLines.width;
                    break;
                case 'GLMinorHorizontal':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryYAxis)) {
                        currCellObj.chart[idx as number].primaryYAxis = {}; this.parent.chartColl[chartCollId as number].primaryYAxis = {};
                    }
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryYAxis.minorGridLines)) {
                        currCellObj.chart[idx as number].primaryYAxis.minorGridLines = {};
                        this.parent.chartColl[chartCollId as number].primaryYAxis.minorGridLines = {};
                    }
                    currCellObj.chart[idx as number].primaryYAxis.minorGridLines.width = chartComp.primaryYAxis.minorGridLines.width;
                    this.parent.chartColl[chartCollId as number].primaryYAxis.minorGridLines.width =
                        chartComp.primaryYAxis.minorGridLines.width;
                    break;
                case 'GLMinorVertical':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryXAxis)) {
                        currCellObj.chart[idx as number].primaryXAxis = {}; this.parent.chartColl[chartCollId as number].primaryXAxis = {};
                    }
                    if (isNullOrUndefined(currCellObj.chart[idx as number].primaryXAxis.minorGridLines)) {
                        currCellObj.chart[idx as number].primaryXAxis.minorGridLines = {};
                        this.parent.chartColl[chartCollId as number].primaryXAxis.minorGridLines = {};
                    }
                    currCellObj.chart[idx as number].primaryXAxis.minorGridLines.width = chartComp.primaryXAxis.minorGridLines.width;
                    this.parent.chartColl[chartCollId as number].primaryXAxis.minorGridLines.width =
                        chartComp.primaryXAxis.minorGridLines.width;
                    break;
                case 'LegendNone': case 'LegendsRight': case 'LegendsLeft': case 'LegendsBottom': case 'LegendsTop':
                    if (isNullOrUndefined(currCellObj.chart[idx as number].legendSettings)) {
                        currCellObj.chart[idx as number].legendSettings = {};
                        this.parent.chartColl[chartCollId as number].legendSettings = {};
                    }
                    currCellObj.chart[idx as number].legendSettings.visible = chartComp.legendSettings.visible;
                    this.parent.chartColl[chartCollId as number].legendSettings.visible = chartComp.legendSettings.visible;
                    if (eleId !== 'LegendNone') {
                        currCellObj.chart[idx as number].legendSettings.position = chartComp.legendSettings.position as LegendPosition;
                        this.parent.chartColl[chartCollId as number].legendSettings.position =
                            chartComp.legendSettings.position as LegendPosition; break;
                    }
                }
            }
        }
    }

    private updateChartElement(
        value: string, chartComp: Chart | AccumulationChart, currCellObj: CellModel, chartCollId: number, title: string,
        isAccumulationChart?: boolean, address?: string, triggerEvent?: boolean): void {
        if (isAccumulationChart &&
            ['PHAxes', 'PVAxes', 'PHAxisTitle', 'PVAxisTitle', 'GLMajorHorizontal',
                'GLMajorVertical', 'GLMinorHorizontal', 'GLMinorVertical'].indexOf(value) > -1) { return; }
        let chartSeries: SeriesModel[] | AccumulationSeriesModel[];
        switch (value) {
        case 'PHAxes':
            chartComp = chartComp as Chart;
            chartComp.primaryXAxis.visible = !chartComp.primaryXAxis.visible;
            break;
        case 'PVAxes':
            chartComp = chartComp as Chart;
            chartComp.primaryYAxis.visible = !chartComp.primaryYAxis.visible;
            break;
        case 'PHAxisTitle':
            chartComp = chartComp as Chart;
            chartComp.primaryXAxis.title = title;
            break;
        case 'PVAxisTitle':
            chartComp = chartComp as Chart;
            chartComp.primaryYAxis.title = title;
            break;
        case 'ChartTitleNone':
            chartComp.title = '';
            break;
        case 'ChartTitleAbove':
            chartComp.title = title;
            break;
        case 'DLNone':
        case 'DLCenter':
        case 'DLInsideend':
        case 'DLInsidebase':
        case 'DLOutsideend':
            chartComp = isAccumulationChart ? chartComp as AccumulationChart : chartComp as Chart;
            chartSeries = chartComp.series;
            if (value === 'DLNone') {
                for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                    if (isAccumulationChart) {
                        (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.visible = false;
                    } else {
                        (chartSeries[idx as number] as SeriesModel).marker.dataLabel.visible = false;
                    }
                }
            } else {
                for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                    if (isAccumulationChart) {
                        const position: AccumulationLabelPosition = value === 'DLOutsideend' ? 'Outside' : 'Inside';
                        (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.visible = true;
                        (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.position = position;
                    } else {
                        const position: LabelPosition =
                                value === 'DLCenter' ? 'Middle' : value === 'DLInsideend' ? 'Top' : value === 'DLInsidebase' ?
                                    'Bottom' : value === 'DLOutsideend' ? 'Outer' : (chartSeries[0] as SeriesModel).marker.dataLabel.position;
                        (chartSeries[idx as number] as SeriesModel).marker.dataLabel.visible = true;
                        (chartSeries[idx as number] as SeriesModel).marker.dataLabel.position = position;
                    }
                }
            }
            chartComp.series = chartSeries;
            if (isAccumulationChart) {
                chartComp.refresh();
            }
            break;
        case 'GLMajorHorizontal':
            chartComp = chartComp as Chart;
            chartComp.primaryYAxis.majorGridLines.width = chartComp.primaryYAxis.majorGridLines.width === 0 ? 1 : 0;
            break;
        case 'GLMajorVertical':
            chartComp = chartComp as Chart;
            chartComp.primaryXAxis.majorGridLines.width = chartComp.primaryXAxis.majorGridLines.width === 0 ? 1 : 0;
            break;
        case 'GLMinorHorizontal':
            chartComp = chartComp as Chart;
            chartComp.primaryYAxis.minorTicksPerInterval = chartComp.primaryYAxis.minorGridLines.width === 0 ? 5 : 0;
            chartComp.primaryYAxis.minorGridLines.width = chartComp.primaryYAxis.minorGridLines.width === 0 ? 1 : 0;
            break;
        case 'GLMinorVertical':
            chartComp = chartComp as Chart;
            chartComp.primaryXAxis.minorTicksPerInterval = chartComp.primaryXAxis.minorGridLines.width === 0 ? 5 : 0;
            chartComp.primaryXAxis.minorGridLines.width = chartComp.primaryXAxis.minorGridLines.width === 0 ? 1 : 0;
            break;
        case 'LegendNone':
            chartComp.legendSettings.visible = false;
            break;
        case 'LegendsRight':
        case 'LegendsLeft':
        case 'LegendsBottom':
        case 'LegendsTop':
            chartComp.legendSettings.visible = true;
            chartComp.legendSettings.position = value === 'LegendsRight' ? 'Right' : value === 'LegendsLeft' ? 'Left' : value ===
                    'LegendsBottom' ? 'Bottom' : value === 'LegendsTop' ? 'Top' : chartComp.legendSettings.position;
            break;
        }
        this.updateChartModel(value, chartComp, currCellObj, chartCollId, isAccumulationChart);
        if (triggerEvent) {
            const eventArgs: {
                addChartEle: string, id: string, title: string, address: string;
            } = { addChartEle: value, id: chartComp.element.id + '_overlay', title: title, address: address };
            this.parent.notify(completeAction, { action: 'chartDesign', eventArgs: eventArgs });
        }
    }

    private undoRedoForChartDesign(
        args: { addChartEle: string, switchRowColumn: boolean, chartTheme: ChartTheme, chartType: ChartType, chartMarker: boolean,
            beforeActionData: BeforeActionData, address: string, id: string, title: string, isUndo: boolean }): void {
        const overlayElem: HTMLElement = document.getElementById(args.id);
        if (!overlayElem) {
            return;
        }
        const chartElem: HTMLElement = this.getChartElement(overlayElem);
        let chartComp: Chart = getComponent(chartElem, 'chart');
        if (isNullOrUndefined(chartComp)) {
            chartComp = getComponent(chartElem, 'accumulationchart');
        }
        const addressInfo: { indices: number[], sheetIndex: number } = this.parent.getAddressInfo(args.address);
        const cell: CellModel = getCell(addressInfo.indices[0], addressInfo.indices[1], getSheet(this.parent, addressInfo.sheetIndex));
        const chartCollectionId: number = this.getChartCollectionId(chartElem.id);
        let chart: ChartModel;
        let property: string = args.addChartEle;
        let title: string = args.title;
        for (let i: number = 0; i < args.beforeActionData.cellDetails[0].chart.length; i++) {
            if (chartElem.id === args.beforeActionData.cellDetails[0].chart[i as number].id) {
                chart = args.beforeActionData.cellDetails[0].chart[i as number];
                break;
            }
        }
        const isMarkerEnabled: boolean = isNullOrUndefined(chart.markerSettings) ? false : chart.markerSettings.visible;
        if (args.switchRowColumn) {
            this.switchRowColumn(chartCollectionId, chartElem.id, chartComp, cell);
        } else if (args.chartTheme) {
            this.switchChartTheme(chartCollectionId, chartElem.id, args.isUndo ? chart.theme : args.chartTheme, chartComp, cell);
        } else if (args.chartType) {
            this.switchChartType(chartCollectionId, chartElem.id, args.isUndo ? chart.type : args.chartType, chartComp, cell,  false, args.isUndo ? isMarkerEnabled : args.chartMarker, 'undoRedo');
        } else if (args.addChartEle) {
            if (args.isUndo) {
                let position: string;
                switch (property) {
                case 'DLNone':
                case 'DLCenter':
                case 'DLInsideend':
                case 'DLInsidebase':
                case 'DLOutsideend':
                    position = chart.dataLabelSettings && chart.dataLabelSettings.position;
                    property = position === 'Middle' ? 'DLCenter' : position === 'Top' ? 'DLInsideend' : position === 'Bottom' ?
                        'DLInsidebase' : position === 'Outer' ? 'DLOutsideend' : 'DLNone';
                    break;
                case 'LegendNone':
                case 'LegendsRight':
                case 'LegendsLeft':
                case 'LegendsBottom':
                case 'LegendsTop':
                    if (chart.legendSettings && !chart.legendSettings.visible) {
                        position = 'LegendNone';
                    } else {
                        position = chart.legendSettings && chart.legendSettings.position;
                        property = position === 'Right' ? 'LegendsRight' : position === 'Left' ? 'LegendsLeft' : position ===
                            'Bottom' ? 'LegendsBottom' : position === 'Top' ? 'LegendsTop' : 'LegendsBottom';
                    }
                    break;
                case 'PVAxisTitle':
                    title = chart.primaryYAxis && chart.primaryYAxis.title;
                    break;
                case 'PHAxisTitle':
                    title = chart.primaryXAxis && chart.primaryXAxis.title;
                    break;
                case 'ChartTitleNone':
                case 'ChartTitleAbove':
                    title = chart.title;
                    break;
                }
            }
            this.updateChartElement(property, chartComp, cell, chartCollectionId, title, null, args.address);
        }
    }

    private chartDesignTabHandler(
        args: {
            switchRowColumn?: boolean, chartType?: ChartType, chartTheme?: ChartTheme, addChartEle?: string,
            id?: string, title?: string, triggerEvent?: boolean, markerVisible?: boolean
        }): void {
        let isAccumulationChart: boolean = false;
        const sheet: SheetModel = this.parent.sheets[this.parent.activeSheetIndex];
        const switchRowColumn: boolean = args.switchRowColumn;
        const chartType: ChartType = args.chartType;
        const chartTheme: ChartTheme = args.chartTheme;
        const addChartEle: string = args.addChartEle;
        let chartComp: Chart | AccumulationChart = null;
        const overlayElem: HTMLElement = args.id ? document.getElementById(args.id) : document.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
        if (!overlayElem) {
            return;
        }
        const opensTitleDialog: boolean = addChartEle === 'ChartTitleAbove' || addChartEle === 'PHAxisTitle' || addChartEle === 'PVAxisTitle';
        let chartTop: { clientY: number, isImage?: boolean, target?: Element };
        let chartleft: { clientX: number, isImage?: boolean, target?: Element };
        if (sheet.frozenRows || sheet.frozenColumns) {
            const clientRect: ClientRect = overlayElem.getBoundingClientRect();
            chartTop = { clientY: clientRect.top }; chartleft = { clientX: clientRect.left };
            if (clientRect.top < this.parent.getColumnHeaderContent().getBoundingClientRect().bottom) {
                chartTop.target = this.parent.getColumnHeaderContent();
            }
            if (clientRect.left < this.parent.getRowHeaderContent().getBoundingClientRect().right) {
                chartleft.target = this.parent.getRowHeaderTable();
            }
        } else {
            chartTop = { clientY: overlayElem.offsetTop, isImage: true };
            chartleft = { clientX: overlayElem.offsetLeft, isImage: true };
        }
        this.parent.notify(getRowIdxFromClientY, chartTop);
        this.parent.notify(getColIdxFromClientX, chartleft);
        const currCellObj: CellModel = getCell(chartTop.clientY, chartleft.clientX, sheet);
        const address: string = sheet.name + '!' + getCellAddress(chartTop.clientY, chartleft.clientX);
        if (args.triggerEvent) {
            const eventArgs: {
                switchRowColumn: boolean, chartType: ChartType, chartTheme: ChartTheme,
                addChartEle: string, id: string, address: string, cancel: boolean
            } = {
                switchRowColumn: args.switchRowColumn, chartType: args.chartType, chartTheme: args.chartTheme,
                addChartEle: args.addChartEle, id: overlayElem.id, address: address, cancel: false
            };
            this.parent.notify(beginAction, { action: 'chartDesign', eventArgs: eventArgs });
            if (eventArgs.cancel) {
                return;
            }
        }
        const chartObj: HTMLElement = this.getChartElement(overlayElem);
        const chartId: string = chartObj.getAttribute('id');
        const chartCollId: number = this.getChartCollectionId(chartId);
        if (chartObj) {
            chartComp = getComponent(chartObj, 'chart');
            if (isNullOrUndefined(chartComp)) {
                chartComp = getComponent(chartObj, 'accumulationchart');
                isAccumulationChart = true;
            }
        }
        if (switchRowColumn && !isAccumulationChart) {
            this.switchRowColumn(chartCollId, chartId, chartComp, currCellObj);
        }
        if (chartType) {
            this.switchChartType(chartCollId, chartId, chartType, chartComp, currCellObj, args.markerVisible);
        }
        if (chartTheme) {
            this.switchChartTheme(chartCollId, chartId, chartTheme, chartComp, currCellObj);
        }
        if (addChartEle) {
            if (opensTitleDialog && !args.title) {
                if (this.parent.element.getElementsByClassName('e-title-dlg').length > 0) {
                    return;
                }
                else {
                    this.titleDlgHandler(
                        addChartEle, chartComp as Chart, currCellObj, chartCollId, isAccumulationChart, address, args.triggerEvent);
                }
            } else {
                this.updateChartElement(addChartEle, chartComp, currCellObj, chartCollId, args.title, isAccumulationChart);
            }
        }
        if (args.triggerEvent && !opensTitleDialog) {
            const eventArgs: {
                switchRowColumn: boolean, chartType: ChartType, chartMarker: boolean, chartTheme: ChartTheme,
                addChartEle: string, id: string, address: string;
            } = {
                switchRowColumn: args.switchRowColumn, chartType: args.chartType, chartMarker: args.markerVisible,
                chartTheme: args.chartTheme, addChartEle: args.addChartEle, id: overlayElem.id, address: address
            };
            this.parent.notify(completeAction, { action: 'chartDesign', eventArgs: eventArgs });
        }
    }

    private switchRowColumn(chartCollId: number, chartId: string, chartComp: Chart | AccumulationChart, cell: CellModel): void {
        this.parent.chartColl[chartCollId as number].isSeriesInRows =
            isNullOrUndefined(this.parent.chartColl[chartCollId as number].isSeriesInRows) ?
                true : !this.parent.chartColl[chartCollId as number].isSeriesInRows;
        for (let idx: number = 0, chartCount: number = cell.chart.length; idx < chartCount; idx++) {
            if (cell.chart[idx as number].id === chartId) {
                cell.chart[idx as number].isSeriesInRows = this.parent.chartColl[chartCollId as number].isSeriesInRows;
            }
        }
        const chartSeries: SeriesModel[] =
            this.initiateChartHandler({ option: this.parent.chartColl[chartCollId as number],
                isRefresh: true, isSwitchRowColumn: true }) as SeriesModel[];
        chartComp.series = chartSeries;
    }

    private switchChartTheme(
        chartCollId: number, chartId: string, theme: ChartTheme, chartComp: Chart | AccumulationChart, cell: CellModel): void {
        this.parent.chartColl[chartCollId as number].theme = theme;
        for (let idx: number = 0, chartCount: number = cell.chart.length; idx < chartCount; idx++) {
            if (cell.chart[idx as number].id === chartId) {
                cell.chart[idx as number].theme = theme;
            }
        }
        chartComp.setProperties({ theme: theme, background: this.getThemeBgColor(theme) }, true);
        chartComp.refresh();
    }

    private getThemeBgColor(theme: ChartTheme): string {
        let bg: string;
        if (theme.includes('Dark')) {
            switch (theme) {
            case 'MaterialDark':
                bg = '#383838';
                break;
            case 'FabricDark':
                bg = '#242424';
                break;
            case 'BootstrapDark':
                bg = '#1b1b1b';
                break;
            case 'Bootstrap5Dark':
                bg = '#212529';
                break;
            case 'TailwindDark':
                bg = '#1f2937';
                break;
            case 'FluentDark':
                bg = '#1b1a19';
                break;
            case 'Fluent2Dark':
                bg = '#292929';
                break;
            case 'Material3Dark':
                bg = '#1C1B1F';
                break;
            }
        } else if (theme.includes('HighContrast')) {
            bg = '#000000';
        } else {
            bg = '#FFFFFF';
        }
        return bg;
    }

    private switchChartType(
        chartCollId: number, chartId: string, chartType: ChartType, chartComp: Chart | AccumulationChart, cell: CellModel,
        markerVisible?: boolean, enableMarker?: boolean, action?: string): void {
        const type: ChartType = this.parent.chartColl[chartCollId as number].type;
        this.parent.chartColl[chartCollId as number].type = chartType;
        for (let idx: number = 0, chartCount: number = cell.chart.length; idx < chartCount; idx++) {
            if (cell.chart[idx as number].id === chartId) {
                cell.chart[idx as number].type = chartType;
                if (!isNullOrUndefined(cell.chart[idx as number].markerSettings)) {
                    cell.chart[idx as number].markerSettings.visible = markerVisible;
                }
            }
        }
        if (chartType !== 'Pie' && chartType !== 'Doughnut') {
            if (type === 'Pie' || type === 'Doughnut') {
                this.changeCharType(chartCollId);
            } else {
                if (type !== chartType) {
                    if (chartType === 'Scatter') {
                        const labels: string[] = (chartComp as Chart).primaryXAxis['labels'];
                        if (labels && labels.length > 0 && isNumber(labels[labels.length - 1])) {
                            (chartComp as Chart).primaryXAxis.valueType = 'Double';
                        }
                    } else if ((chartComp as Chart).primaryXAxis.valueType === 'Double') {
                        (chartComp as Chart).primaryXAxis.valueType = 'Category';
                    }
                }
                const chartSeries: SeriesModel[] = chartComp.series as SeriesModel[];
                const isLineChart: boolean = chartType === 'Line' || chartType === 'StackingLine' || chartType === 'StackingLine100';
                for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                    chartSeries[idx as number].type = chartType as ChartSeriesType;
                    if (isLineChart) {
                        chartSeries[idx as number].marker.visible = markerVisible;
                        chartSeries[idx as number].marker.shape = isNullOrUndefined(chartSeries[idx as number].marker.shape) ? 'Circle' : chartSeries[idx as number].marker.shape;
                        if (action === 'undoRedo') {
                            chartSeries[idx as number].marker.visible = enableMarker;
                        }
                    } else {
                        chartSeries[idx as number].marker.visible = false;
                    }
                }
                chartComp.series = chartSeries;
                chartComp.refresh();
            }
        } else {
            if (type === 'Pie' || type === 'Doughnut') {
                const chartSeries: AccumulationSeriesModel[] = chartComp.series as AccumulationSeriesModel[];
                for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                    chartSeries[idx as number].innerRadius = chartType === 'Pie' ? '0%' : '40%';
                }
                chartComp.series = chartSeries;
                chartComp.refresh();
            } else {
                this.changeCharType(chartCollId);
            }
        }
    }

    private getChartElement(overlayElem: Element): HTMLElement {
        let chartObj: HTMLElement = overlayElem.querySelector('.e-chart');
        if (isNullOrUndefined(chartObj)) {
            chartObj = overlayElem.querySelector('.e-accumulationchart');
        }
        return chartObj;
    }

    private getChartCollectionId(id: string): number {
        let chartCollectionId: number;
        for (let i: number = 0, len: number = this.parent.chartColl.length; i < len; i++) {
            if (id === this.parent.chartColl[i as number].id) {
                chartCollectionId = i;
            }
        }
        return chartCollectionId;
    }

    private changeCharType(chartCollId: number): void {
        let chartEle: HTMLElement = document.getElementById(this.parent.chartColl[chartCollId as number].id);
        let chartParEle: Element = closest(chartEle, '.e-datavisualization-chart');
        chartParEle.remove();
        this.parent.notify(initiateChart, {
            option: this.parent.chartColl[chartCollId as number], isInitCell: false, triggerEvent: false,
            isPaste: false
        });
        chartEle = document.getElementById(this.parent.chartColl[chartCollId as number].id);
        chartParEle = closest(chartEle, '.e-datavisualization-chart');
        if (!chartParEle.classList.contains('e-ss-overlay-active')) {
            chartParEle.classList.add('e-ss-overlay-active');
        }
    }

    private titleDlgHandler(
        addChartEle: string, chartComp: Chart, currCellObj: CellModel, chartCollId: number, isAccumulationChart?: boolean,
        address?: string, triggerEvent?: boolean): void {
        let title: string = '';
        if (isAccumulationChart && (addChartEle === 'PHAxisTitle' || addChartEle === 'PVAxisTitle')) {
            return;
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-title-dlg',
            header: addChartEle === 'chart_abovechart' ? l10n.getConstant('ChartTitle') : addChartEle ===
                'PHAxisTitle' ? l10n.getConstant('HorizontalAxisTitle') : l10n.getConstant('VerticalAxisTitle'),
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.titleDlgContent(addChartEle, chartComp);
                dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'),
                    isPrimary: true,
                    cssClass: 'e-btn e-clearall-btn e-flat'
                },
                click: (): void => {
                    const dlgCont: HTMLElement = this.parent.element.querySelector('.e-title-dlg').
                        getElementsByClassName('e-title-dlg-content')[0] as HTMLElement;
                    title = dlgCont.getElementsByTagName('input')[0].value;
                    dialogInst.hide();
                    this.updateChartElement(addChartEle, chartComp, currCellObj, chartCollId, title, null, address, triggerEvent);
                }
            }]
        });
        dialogInst.dialogInstance.refresh();
    }

    private titleDlgContent(addChartEle: string, chartComp: Chart): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dlgContent: HTMLElement = this.parent.createElement('div', { className: 'e-title-dlg-content' });
        const value1Text: HTMLElement = this.parent.createElement('span', { className: 'e-header e-top-header' });
        value1Text.innerText = l10n.getConstant('EnterTitle');
        const value1Inp: HTMLInputElement =
            this.parent.createElement('input', { className: 'e-input', id: 'titleInput', attrs: { type: 'text' } });
        dlgContent.appendChild(value1Text);
        dlgContent.appendChild(value1Inp);
        if (chartComp) {
            if (addChartEle === 'PHAxisTitle') {
                value1Inp.value = chartComp.primaryXAxis.title ? chartComp.primaryXAxis.title : value1Inp.value;

            } else if (addChartEle === 'PVAxisTitle') {
                value1Inp.value = chartComp.primaryYAxis.title ? chartComp.primaryYAxis.title : value1Inp.value;
            } else {
                value1Inp.value = chartComp.title ? chartComp.title : value1Inp.value;
            }
        }
        return dlgContent;
    }

    /**
     * Removing event listener for success and failure
     *
     * @returns {void} - Removing event listener for success and failure
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateChart, this.initiateChartHandler);
            this.parent.off(refreshChartCellObj, this.refreshChartCellObj);
            this.parent.off(refreshChartCellOnInit, this.refreshChartCellModel);
            this.parent.off(refreshChartCellModel, this.refreshChartCellModel);
            this.parent.off(updateChart, this.updateChartHandler);
            this.parent.off(deleteChart, this.deleteChart);
            this.parent.off(clearChartBorder, this.clearBorder);
            this.parent.off(insertChart, this.insertChartHandler);
            this.parent.off(chartRangeSelection, this.chartRangeHandler);
            this.parent.off(chartDesignTab, this.chartDesignTabHandler);
            this.parent.off(addChartEle, this.updateChartElement);
            this.parent.off(undoRedoForChartDesign, this.undoRedoForChartDesign);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
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
     *
     * @returns {string} - Get the module name.
     */
    public getModuleName(): string {
        return 'spreadsheetChart';
    }
}
