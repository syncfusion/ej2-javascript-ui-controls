import { Workbook, SheetModel, CellModel, getData } from '../base/index';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getSwapRange, getRangeAddress, getRangeIndexes, getCellAddress } from '../common/index';
import { BeforeFilterEventArgs, FilterOptions, FilterEventArgs, setRow, ExtendedRowModel, getSheetIndex } from '../index';
import { initiateFilter, clearAllFilter, dataRefresh, hideShow } from '../common/event';

/**
 * The `WorkbookFilter` module is used to handle filter action in Spreadsheet.
 */
export class WorkbookFilter {
    private parent: Workbook;
    private filterRange: string;
    /**
     * Constructor for WorkbookFilter module.
     *
     * @param {Workbook} parent - Constructor for WorkbookFilter module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the filter module.
     *
     * @returns {void} - To destroy the filter module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.filterRange = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initiateFilter, this.initiateFilterHandler, this);
        this.parent.on(clearAllFilter, this.clearAllFilterHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateFilter, this.initiateFilterHandler);
            this.parent.off(clearAllFilter, this.clearAllFilterHandler);
        }
    }

    /**
     * Filters a range of cells in the sheet.
     *
     * @param { {args: BeforeFilterEventArgs, promise: Promise<FilterEventArgs>}} eventArgs - Specify the event args.
     * @param {BeforeFilterEventArgs} eventArgs.args - arguments for filtering..
     * @param {Promise<FilterEventArgs>} eventArgs.promise - Specify the promise.
     * @returns {void} - Filters a range of cells in the sheet.
     */
    private initiateFilterHandler(eventArgs: {args: BeforeFilterEventArgs, promise: Promise<FilterEventArgs>}): void {
        const args: BeforeFilterEventArgs = eventArgs.args;
        const deferred: Deferred = new Deferred();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const filterOptions: FilterOptions = args.filterOptions || {};
        eventArgs.promise = deferred.promise;
        this.filterRange = args.range;
        if (filterOptions.datasource) {
            this.setFilter(filterOptions.datasource, filterOptions.predicates, args.range);
            const filterEventArgs: FilterEventArgs = { range: args.range, filterOptions: filterOptions };
            deferred.resolve(filterEventArgs);
        } else {
            const range: number[] = getSwapRange(getIndexesFromAddress(args.range));

            if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
                deferred.reject('Select a cell or range inside the used range and try again.');
                return;
            }
            if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell
                range[0] = 0; range[1] = 0; range[3] = sheet.usedRange.colIndex;
            }

            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
            range[0] = range[0] + 1; //ignore first row
            const address: string = getRangeAddress(range);
            getData(this.parent, `${sheet.name}!${address}`, true, true, null, null, null, null, false).then((jsonData: {[key: string]: CellModel}[]) => {
                const dataManager: DataManager = new DataManager(jsonData);
                this.setFilter(dataManager, filterOptions.predicates, args.range);
                const filterEventArgs: FilterEventArgs = { range: address, filterOptions: filterOptions };
                deferred.resolve(filterEventArgs);
            });
        }
    }

    /**
     * Hides or unhides the rows based on the filter predicates.
     *
     * @param {DataManager} dataManager - Specify the dataManager.
     * @param {Predicate[]} predicates - Specify the predicates.
     * @param {string} range - Specify the range.
     * @returns {void} - Hides or unhides the rows based on the filter predicates.
     */
    private setFilter(dataManager: DataManager, predicates: Predicate[], range: string): void {
        if (dataManager && predicates) {
            const jsonData: {[key: string]: CellModel}[] = dataManager.dataSource.json as {[key: string]: CellModel}[];
            const query: Query = new Query();
            if (predicates.length) {
                query.where(Predicate.and(predicates));
            }
            const result: { [key: string]: CellModel }[] = dataManager.executeLocal(query) as { [key: string]: CellModel }[];
            const rowKey: string = '__rowIndex';
            let sheet: SheetModel;
            let sheetIdx: number;
            if (range.indexOf('!') > -1) {
                 sheetIdx = getSheetIndex(this.parent, range.split('!')[0]);
                 sheet = this.parent.sheets[sheetIdx];
            } else {
                sheet = this.parent.getActiveSheet();
                sheetIdx = getSheetIndex(this.parent, sheet.name);
            }
            if (this.parent.getModuleName() === 'spreadsheet') {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const parent: any = this.parent;
                if ((parent.scrollSettings.enableVirtualization && (jsonData.length > parent.viewport.rowCount +
                    (parent.getThreshold('row') * 2))) || !!sheet.frozenColumns || !!sheet.frozenRows) {
                    let hide: boolean;
                    jsonData.forEach((data: { [key: string]: CellModel }) => {
                        hide = result.indexOf(data) < 0;
                        setRow(sheet, Number(data[rowKey]) - 1, <ExtendedRowModel>{ hidden: hide, isFiltered: hide });
                    });
                    if (sheetIdx !== parent.activeSheetIndex) {
                        return;
                    }
                    this.parent.notify(dataRefresh, null);
                } else {
                    let aboveViewport: boolean;
                    jsonData.forEach((data: { [key: string]: CellModel }) => {
                        const eventArgs: { [key: string]: number | boolean } = {
                            startIndex: Number(data[rowKey]) - 1, hide: result.indexOf(data) < 0, isFiltering: true, aboveViewport: false
                        };
                        eventArgs.endIndex = eventArgs.startIndex;
                        this.parent.notify(hideShow, eventArgs);
                        if (!aboveViewport) { aboveViewport = <boolean>eventArgs.aboveViewport; }
                    });
                    if (aboveViewport && range) {
                        const index: number[] = getRangeIndexes(range);
                        this.parent.goTo(getCellAddress(index[0], index[1]));
                    }
                }
            } else {
                jsonData.forEach((data: { [key: string]: CellModel }) => {
                    this.parent.hideRow(Number(data[rowKey]) - 1, undefined, result.indexOf(data) < 0);
                });
            }
        }
    }

    /**
     * Clears all the filters in the sheet.
     *
     * @returns {void} - Clears all the filters in the sheet.
     */
    private clearAllFilterHandler(): void {
        if (this.filterRange) {
            const range: number[] =  getCellIndexes(this.filterRange);
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (this.parent.getModuleName() === 'workbook') {
                this.parent.hideRow(range[0], sheet.usedRange.rowIndex, false);
                return;
            }
            const len: number = (sheet.usedRange.rowIndex - range[0]) + 1;
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const parent: any = this.parent;
            if ((parent.scrollSettings.enableVirtualization && (len > parent.viewport.rowCount + (parent.getThreshold('row') * 2))) ||
                !!sheet.frozenColumns || !!sheet.frozenRows) {
                for (let i: number = 0; i <= sheet.usedRange.rowIndex; i++) {
                    setRow(sheet, i, <ExtendedRowModel>{ hidden: false, isFiltered: false });
                }
                this.parent.notify(dataRefresh, null);
            } else {
                this.parent.notify(hideShow, { startIndex: range[0], endIndex: sheet.usedRange.rowIndex, hide: false, isFiltering: true });
            }
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'workbookFilter';
    }
}
