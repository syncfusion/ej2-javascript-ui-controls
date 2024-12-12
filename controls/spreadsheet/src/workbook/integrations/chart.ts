import { getRangeIndexes, ChartModel, getSwapRange, getRangeAddress } from '../common/index';
import { SheetModel, setCell, getSheetIndex, Workbook, CellModel, getCell, getSheetIndexFromId, getSheet } from '../base/index';
import { setChart, initiateChart, deleteChartColl, refreshChartSize, focusChartBorder, getChartRowIdxFromClientY, getChartColIdxFromClientX, refreshChartCellOnInit } from '../common/event';
import { closest, isNullOrUndefined, getComponent, isUndefined, getUniqueID } from '@syncfusion/ej2-base';

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
        this.parent.on(deleteChartColl, this.deleteChartColl, this);
        this.parent.on(refreshChartSize, this.refreshChartSize, this);
        this.parent.on(focusChartBorder, this.focusChartBorder, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setChart, this.setChartHandler);
            this.parent.off(deleteChartColl, this.deleteChartColl);
            this.parent.off(refreshChartSize, this.refreshChartSize);
            this.parent.off(focusChartBorder, this.focusChartBorder);
        }
    }

    private setChartHandler(args: {
        chart: ChartModel[], isInitCell?: boolean, isUndoRedo?: boolean, isCut?: boolean,
        isPaste?: boolean, dataSheetIdx?: number, range?: string, sheetId?: number
    }): void {
        let i: number = 0;
        let rangeIdx: number[] = [];
        args.isInitCell = isNullOrUndefined(args.isInitCell) ? false : args.isInitCell;
        args.isUndoRedo = isNullOrUndefined(args.isUndoRedo) ? true : args.isUndoRedo;
        args.isPaste = isNullOrUndefined(args.isPaste) ? false : args.isPaste;
        const chart: ChartModel[] = args.chart; let chartModel: ChartModel; let chartLength: number;
        if (chart.length > 0) {
            while (i < chart.length) {
                if (args.isCut === false) {
                    if (document.getElementById(args.chart[i as number].id)) {
                        chart[i as number] = {
                            range: chart[i as number].range, id: getUniqueID('e_spreadsheet_chart'), theme: chart[i as number].theme,
                            isSeriesInRows: chart[i as number].isSeriesInRows, type: chart[i as number].type,
                            markerSettings: chart[i as number].markerSettings
                        };
                    }
                }
                if (document.getElementById(args.chart[i as number].id)) {
                    return;
                }
                chartModel = chart[i as number];
                chartModel.theme = chartModel.theme || 'Material';
                chartModel.type = chartModel.type || 'Line';
                chartModel.isSeriesInRows = chartModel.isSeriesInRows || false;
                if (isNullOrUndefined(chartModel.range)) {
                    const sheet: SheetModel = this.parent.getActiveSheet();
                    chartModel.range = sheet.selectedRange;
                    rangeIdx = getSwapRange(getRangeIndexes(chartModel.range));
                    if (rangeIdx[0] === 0 && rangeIdx[2] === sheet.rowCount - 1 && rangeIdx[2] > sheet.usedRange.rowIndex) {
                        rangeIdx[2] = sheet.usedRange.rowIndex;
                    }
                    if (rangeIdx[1] === 0 && rangeIdx[3] === sheet.colCount - 1 && rangeIdx[3] > sheet.usedRange.colIndex) {
                        rangeIdx[3] = sheet.usedRange.colIndex;
                    }
                } else {
                    rangeIdx = getSwapRange(getRangeIndexes(chartModel.range));
                }
                const rangeAddress: string = getRangeAddress(rangeIdx);
                if (chartModel.range.indexOf('!') > 0) {
                    chartModel.range = chartModel.range.substring(0, chartModel.range.lastIndexOf('!')) + '!' + rangeAddress;
                }
                else {
                    chartModel.range = this.parent.getActiveSheet().name + '!' + rangeAddress;
                }
                if (isNullOrUndefined(chartModel.id)) {
                    chartModel.id = getUniqueID('e_spreadsheet_chart');
                }
                if (chartModel.markerSettings && chartModel.markerSettings.visible) {
                    if (chartModel.markerSettings.isFilled === undefined) {
                        chartModel.markerSettings.isFilled = true;
                    }
                    if (chartModel.markerSettings.shape === undefined) {
                        chartModel.markerSettings.shape = 'Circle';
                    }
                }
                chartModel.height = chartModel.height || 290;
                chartModel.width = chartModel.width || 480;
                this.parent.notify(initiateChart, {
                    option: chartModel, isInitCell: args.isInitCell, triggerEvent: args.isUndoRedo,
                    dataSheetIdx: args.dataSheetIdx, range: args.range, isPaste: args.isPaste
                });
                this.parent.chartColl.push(chartModel);
                if (!args.isInitCell || args.isPaste) {
                    const sheetIdx: number = args.sheetId === undefined ? ((chartModel.range && chartModel.range.lastIndexOf('!') > 0) ?
                        getSheetIndex(this.parent, chartModel.range.substring(0, chartModel.range.lastIndexOf('!'))) : this.parent.activeSheetIndex) :
                        getSheetIndexFromId(this.parent, args.sheetId);
                    const chartRowIdx: { clientY: number, isImage?: boolean } = { clientY: chartModel.top, isImage: true };
                    const chartColIdx: { clientX: number, isImage?: boolean } = { clientX: chartModel.left, isImage: true };
                    this.parent.notify(getChartRowIdxFromClientY, chartRowIdx); this.parent.notify(getChartColIdxFromClientX, chartColIdx);
                    const sheet: SheetModel = isUndefined(sheetIdx) ? this.parent.getActiveSheet() : this.parent.sheets[sheetIdx as number];
                    const cell: CellModel = getCell(chartRowIdx.clientY, chartColIdx.clientX, sheet);
                    if (!this.parent.isPrintingProcessing) {
                        if (cell && cell.chart) {
                            cell.chart.push(chartModel);
                        } else {
                            setCell(chartRowIdx.clientY, chartColIdx.clientX, sheet, { chart: [chartModel] }, true);
                        }
                    }
                }
                else {
                    const indexes: number[] = getRangeIndexes(args.range);
                    const chartRowIdx: { clientY: number, isImage?: boolean } = { clientY: chartModel.top, isImage: true };
                    const chartColIdx: { clientX: number, isImage?: boolean } = { clientX: chartModel.left, isImage: true };
                    this.parent.notify(getChartRowIdxFromClientY, chartRowIdx); this.parent.notify(getChartColIdxFromClientX, chartColIdx);
                    const eventArgs: Object = {
                        prevTop: chartModel.top, prevLeft: chartModel.left, prevRowIdx: indexes[0], prevColIdx: indexes[1],
                        prevHeight: chartModel.height, prevWidth: chartModel.width, currentTop: chartModel.top,
                        currentLeft: chartModel.left, currentRowIdx: chartRowIdx.clientY, currentColIdx: chartColIdx.clientX,
                        currentHeight: chartModel.height, currentWidth: chartModel.width, id: chartModel.id, requestType: 'chartRefreshOnInit'
                    };
                    if (indexes[0] !== chartRowIdx.clientY || indexes[1] !== chartColIdx.clientX) {
                        chartLength = chart.length;
                        this.parent.notify(refreshChartCellOnInit, eventArgs);
                        i -= chartLength - chart.length;
                    }
                }
                i++;
            }
        }
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
                    const chart: ChartModel = this.parent.chartColl[chartCnt as number];
                    if (!isNullOrUndefined(args.overlayEle.querySelector('#' + chart.id))) {
                        const chartObj: HTMLElement = this.parent.element.querySelector('.' + chart.id);
                        const excelFilter: { height: string, width: string } = getComponent(chartObj, 'chart') || getComponent(chartObj, 'accumulationchart');
                        if (excelFilter) {
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
            const chartEle: HTMLElement = document.getElementById(this.parent.chartColl[idx as number].id);
            if (overlayEle && chartEle && closest(chartEle, '.' + overlayEle.classList[1]) === overlayEle) {
                this.parent.notify(initiateChart, {
                    option: this.parent.chartColl[idx as number], isRefresh: true
                });
            }
        }
    }

    private deleteChartColl(args: { id: string }): void {
        for (let idx: number = 0; idx < this.parent.chartColl.length; idx++) {
            if (this.parent.chartColl[idx as number].id + '_overlay' === args.id) {
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

