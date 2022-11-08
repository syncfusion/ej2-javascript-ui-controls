import { getRangeIndexes, ChartModel, inRange, checkRange } from '../common/index';
import { SheetModel, setCell, getSheetIndex, Workbook, CellModel, getCell } from '../base/index';
import { setChart, initiateChart, refreshChart, updateChart, deleteChartColl, refreshChartSize, focusChartBorder } from '../common/event';
import { closest, isNullOrUndefined, getComponent, isUndefined, getUniqueID } from '@syncfusion/ej2-base';
import { Chart } from '@syncfusion/ej2-charts';

/**
 * The `WorkbookChart` module is used to handle chart action in Spreadsheet.
 */
export class WorkbookChart {
    private parent: Workbook;

    /**
     * Constructor for WorkbookChart module.
     *
     * @param {Workbook} parent - Constructor for WorkbookChart module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(setChart, this.setChartHandler, this);
        this.parent.on(refreshChart, this.refreshChartData, this);
        this.parent.on(deleteChartColl, this.deleteChartColl, this);
        this.parent.on(refreshChartSize, this.refreshChartSize, this);
        this.parent.on(focusChartBorder, this.focusChartBorder, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setChart, this.setChartHandler);
            this.parent.off(refreshChart, this.refreshChartData);
            this.parent.off(deleteChartColl, this.deleteChartColl);
            this.parent.off(refreshChartSize, this.refreshChartSize);
            this.parent.off(focusChartBorder, this.focusChartBorder);
        }
    }

    private setChartHandler(args: {
        chart: ChartModel[], isInitCell?: boolean, isUndoRedo?: boolean, isCut?: boolean,
        isPaste?: boolean, dataSheetIdx?: number, range?: string
    }): void {
        let i: number = 0;
        args.isInitCell = isNullOrUndefined(args.isInitCell) ? false : args.isInitCell;
        args.isUndoRedo = isNullOrUndefined(args.isUndoRedo) ? true : args.isUndoRedo;
        args.isPaste = isNullOrUndefined(args.isPaste) ? false : args.isPaste;
        const chart: ChartModel[] = args.chart;
        if (chart.length > 0) {
            while (i < chart.length) {
                if (args.isCut === false) {
                    if (document.getElementById(args.chart[i].id)) {
                        chart[i] = {
                            range: chart[i].range, id: getUniqueID('e_spreadsheet_chart'),
                            isSeriesInRows: chart[i].isSeriesInRows, theme: chart[i].theme, type: chart[i].type
                        };
                    }
                }
                if (document.getElementById(args.chart[i].id)) {
                    return;
                }
                chart[i].theme = chart[i].theme || 'Material';
                chart[i].type = chart[i].type || 'Line';
                chart[i].isSeriesInRows = chart[i].isSeriesInRows || false;
                chart[i].range = chart[i].range || this.parent.getActiveSheet().selectedRange;
                if (chart[i].range.indexOf('!') < 0) {
                    chart[i].range = this.parent.getActiveSheet().name + '!' + chart[i].range;
                }
                if (isNullOrUndefined(chart[i].id)) {
                    chart[i].id = getUniqueID('e_spreadsheet_chart');
                }
                chart[i].height = chart[i].height || 290;
                chart[i].width = chart[i].width || 480;
                this.parent.notify(initiateChart, {
                    option: chart[i], isInitCell: args.isInitCell, triggerEvent: args.isUndoRedo,
                    dataSheetIdx: args.dataSheetIdx, range: args.range, isPaste: args.isPaste
                });
                this.parent.chartColl.push(chart[i]);
                if (!args.isInitCell || args.isPaste) {
                    const sheetIdx: number = (chart[i].range && chart[i].range.indexOf('!') > 0) ?
                        getSheetIndex(this.parent, chart[i].range.split('!')[0]) : this.parent.activeSheetIndex;
                    const indexes: number[] = args.isPaste ? getRangeIndexes(args.range) : getRangeIndexes(chart[i].range);
                    const sheet: SheetModel = isUndefined(sheetIdx) ? this.parent.getActiveSheet() : this.parent.sheets[sheetIdx];
                    const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
                    if (cell && cell.chart) {
                        cell.chart.push(chart[i]);
                    } else {
                        setCell(indexes[0], indexes[1], sheet, { chart: [chart[i]] }, true);
                    }
                }
                i++;
            }
        }
    }

    private refreshChartData(args: { cell: CellModel, rIdx: number, cIdx: number, range?: number[], showHide?: string, viewportIndexes?: number[][] }): void {
        if (!this.parent.chartColl || !this.parent.chartColl.length) {
            return;
        }
        let chart: ChartModel; let rangeArr: string[]; let range: string; let insideRange: boolean;
        for (let i: number = 0, len: number = this.parent.chartColl.length; i < len; i++) {
            chart = this.parent.chartColl[i];
            if (chart.range.includes('!')) {
                rangeArr = chart.range.split('!');
                if (this.parent.activeSheetIndex !== getSheetIndex(this.parent, rangeArr[0])) {
                    continue;
                }
                range = rangeArr[1];
            } else {
                range = chart.range;
            }
            if (args.viewportIndexes) {
                for (let idx: number = 0; idx < args.viewportIndexes.length; idx++) {
                    if (checkRange([args.viewportIndexes[idx]], range)) {
                        insideRange = true;
                        break;
                    }
                }
            } else {
                insideRange = args.range ? checkRange([args.range], range) : (args.showHide ? this.inRowColumnRange(
                    getRangeIndexes(range), args.rIdx, args.showHide) : inRange(getRangeIndexes(range), args.rIdx, args.cIdx));
            }
            if (insideRange) {
                this.parent.notify(updateChart, { chart: chart });
            }
        }
    }

    private inRowColumnRange(range: number[], index: number, showHide: string): boolean {
        return showHide === 'rows' ? index >= range[0] && index <= range[2] : index >= range[1] && index <= range[3];
    }

    private refreshChartSize(args: { height: string, width: string, overlayEle: HTMLElement }): void {
        let chartCnt: number;
        let j: number = 1;
        const sheetCnt: number = this.parent.sheets.length + 1;
        while (j < sheetCnt) {
            const charts: ChartModel[] = this.parent.chartColl;
            chartCnt = charts ? charts.length : 0;
            if (chartCnt) {
                while (chartCnt--) {
                    const chart: ChartModel = this.parent.chartColl[chartCnt];
                    if (!isNullOrUndefined(args.overlayEle.querySelector('#' + chart.id))) {
                        const chartObj: HTMLElement = this.parent.element.querySelector('.' + chart.id);
                        const excelFilter: Chart = getComponent(chartObj, 'chart');
                        if (excelFilter){
                            excelFilter.height = args.height;
                            excelFilter.width = args.width;
                        }
                    }
                }
            }
            j++;
        }
    }

    private focusChartBorder(args: { id: string }): void {
        for (let idx: number = 0; idx < this.parent.chartColl.length; idx++) {
            const overlayEle: HTMLElement = document.getElementById(args.id);
            const chartEle: HTMLElement = document.getElementById(this.parent.chartColl[idx].id);
            if (overlayEle && chartEle && closest(chartEle, '.' + overlayEle.classList[1]) === overlayEle) {
                this.parent.notify(initiateChart, {
                    option: this.parent.chartColl[idx], isRefresh: true
                });
            }
        }
    }

    private deleteChartColl(args: { id: string }): void {
        for (let idx: number = 0; idx < this.parent.chartColl.length; idx++) {
            if (this.parent.chartColl[idx].id + '_overlay' === args.id) {
                this.parent.chartColl.splice(idx, 1);
            }
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
    }

    /**
     * Get the workbook chart module name.
     *
     * @returns {string} - Get the workbook chart module name.
     */
    public getModuleName(): string {
        return 'workbookChart';
    }
}

