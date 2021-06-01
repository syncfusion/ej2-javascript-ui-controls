import { getRangeIndexes, ChartModel, inRange } from '../common/index';
import { SheetModel, setCell, getSheetIndex, Workbook, CellModel, getCell, getSheetNameFromAddress } from '../base/index';
import { setChart, initiateChart, refreshChart, updateChart, deleteChartColl, refreshChartSize, focusChartBorder } from '../common/event';
import { closest, isNullOrUndefined, getComponent } from '@syncfusion/ej2-base';
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
        chart: ChartModel[], isInitCell?: boolean, isUndoRedo?: boolean, isIdAvailabe?: boolean, isCut?: boolean,
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
                            range: chart[i].range, id: 'e_spreadsheet_chart_' + this.parent.chartCount,
                            isSeriesInRows: chart[i].isSeriesInRows, theme: chart[i].theme, type: chart[i].type
                        };
                        chart[i].id = 'e_spreadsheet_chart_' + this.parent.chartCount;
                        args.isIdAvailabe = false;
                    }
                }
                if (document.getElementById(args.chart[i].id)) {
                    return;
                }
                let idAvailable: boolean = isNullOrUndefined(args.isIdAvailabe) ? true : args.isIdAvailabe;
                chart[i].theme = chart[i].theme || 'Material';
                chart[i].type = chart[i].type || 'Line';
                chart[i].isSeriesInRows = chart[i].isSeriesInRows || false;
                chart[i].range = chart[i].range || this.parent.getActiveSheet().selectedRange;
                if (chart[i].range.indexOf('!') < 0) {
                    chart[i].range = this.parent.getActiveSheet().name + '!' + chart[i].range;
                }
                if (isNullOrUndefined(chart[i].id)) {
                    chart[i].id = 'e_spreadsheet_chart_' + this.parent.chartCount;
                    idAvailable = false;
                }
                chart[i].height = chart[i].height || 290;
                chart[i].width = chart[i].width || 480;
                this.parent.notify(initiateChart, {
                    option: chart[i], chartCount: this.parent.chartCount, isInitCell: args.isInitCell, isUndoRedo: args.isUndoRedo,
                    dataSheetIdx: args.dataSheetIdx, range: args.range, isPaste: args.isPaste
                });
                this.parent.chartColl.push(chart[i]);
                if (!idAvailable) {
                    this.parent.chartCount++;
                }
                if (!args.isInitCell || args.isPaste) {
                    const sheetIdx: number = (chart[i].range && chart[i].range.indexOf('!') > 0) ?
                        getSheetIndex(this.parent, chart[i].range.split('!')[0]) : this.parent.activeSheetIndex;
                    const indexes: number[] = args.isPaste ? getRangeIndexes(args.range) : getRangeIndexes(chart[i].range);
                    const sheet: SheetModel = sheetIdx ? this.parent.sheets[sheetIdx] : this.parent.getActiveSheet();
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

    private refreshChartData(args: { cell: CellModel, rIdx: number, cIdx: number, sheetIdx: number, showHide?: string }): void {
        let i: number;
        let j: number = 1;
        const cnt: number = this.parent.sheets.length + 1;
        while (j < cnt) {
            const charts: ChartModel[] = this.parent.chartColl;
            i = charts ? charts.length : 0;
            if (i) {
                while (i--) {
                    const chart: ChartModel = this.parent.chartColl[i];
                    const isRange: boolean = isNullOrUndefined(args.showHide) ? inRange(getRangeIndexes(chart.range), args.rIdx, args.cIdx)
                        : this.inRowColumnRange(getRangeIndexes(chart.range), args.rIdx, args.showHide);
                    const rangeSheetIdx: number = chart.range.indexOf('!') > -1 ?
                        getSheetIndex(this.parent, getSheetNameFromAddress(chart.range)) : this.parent.activeSheetIndex;
                    if (isRange && rangeSheetIdx === this.parent.activeSheetIndex) {
                        this.parent.notify(updateChart, { chart: chart });
                    }
                }
            }
            j++;
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
                        excelFilter.height = args.height;
                        excelFilter.width = args.width;
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
                    option: this.parent.chartColl[idx], chartCount: this.parent.chartCount, isRefresh: true
                });
            }
        }
    }

    private deleteChartColl(args: { id: string }): void {
        for (let idx: number = 0; idx < this.parent.chartColl.length; idx++) {
            const chartElement: HTMLElement = document.getElementById(this.parent.chartColl[idx].id);
            const overlayElement: HTMLElement = document.getElementById(args.id);
            if (overlayElement && chartElement && closest(chartElement, '.' + overlayElement.classList[1]) === overlayElement) {
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

