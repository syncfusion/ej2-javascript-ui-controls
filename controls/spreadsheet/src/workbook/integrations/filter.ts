import { Workbook, SheetModel, CellModel, getData } from '../base/index';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getSwapRange, getRangeAddress } from '../common/index';
import { BeforeFilterEventArgs, FilterOptions, FilterEventArgs } from '../common/interface';
import { initiateFilter, clearAllFilter, dataRefresh } from '../common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

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
            this.setFilter(filterOptions.datasource, filterOptions.predicates);
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
            getData(this.parent, `${sheet.name}!${address}`, true, true).then((jsonData: {[key: string]: CellModel}[]) => {
                const dataManager: DataManager = new DataManager(jsonData);
                this.setFilter(dataManager, filterOptions.predicates);
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
     * @returns {void} - Hides or unhides the rows based on the filter predicates.
     */
    private setFilter(dataManager: DataManager, predicates: Predicate[]): void {
        if (dataManager && predicates) {
            const jsonData: {[key: string]: CellModel}[] = dataManager.dataSource.json as {[key: string]: CellModel}[];
            const query: Query = new Query();
            if (predicates.length) {
                query.where(Predicate.and(predicates));
            }
            const result: { [key: string]: CellModel }[] = dataManager.executeLocal(query) as { [key: string]: CellModel }[];
            const rowKey: string = '__rowIndex';
            jsonData.forEach((data: { [key: string]: CellModel }) => {
                if (!data) { return; }
                const rowIdx: number = parseInt(data[rowKey] as string, 10);
                this.parent.hideRow(rowIdx - 1, undefined, result.indexOf(data) < 0);
                if (isNullOrUndefined(this.parent.filteredRows)) {
                    this.parent.filteredRows = {};
                    this.parent.filteredRows.rowIdxColl = [];
                    this.parent.filteredRows.sheetIdxColl = [];
                }
                const filterRows: number[] = this.parent.filteredRows.rowIdxColl;
                const filterSheet: number[] = this.parent.filteredRows.sheetIdxColl;
                if (result.indexOf(data) < 0) {
                    if (filterRows && filterSheet) {
                        for (let i: number = 0, len: number = filterSheet.length; i < len; i++) {
                            if (this.parent.activeSheetIndex === filterSheet[i] && filterRows[i] === rowIdx - 1) {
                                filterRows.splice(i, 1);
                                filterSheet.splice(i, 1);
                            }
                        }
                    }
                    filterRows.push(rowIdx - 1);
                    filterSheet.push(this.parent.activeSheetIndex);
                } else {
                    if (filterRows && filterSheet) {
                        for (let i: number = 0, length: number = filterSheet.length; i < length; i++) {
                            if (this.parent.activeSheetIndex === filterSheet[i] && filterRows[i] === rowIdx - 1) {
                                filterRows.splice(i, 1);
                                filterSheet.splice(i, 1);
                            }
                        }
                    }
                }
            });
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.frozenColumns || sheet.frozenRows) { this.parent.notify(dataRefresh, null); }
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
            this.parent.hideRow(range[0], sheet.usedRange.rowIndex - 1, false);
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
