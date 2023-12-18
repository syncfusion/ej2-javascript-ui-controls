import { Workbook, SheetModel, CellModel, getData, getSheet } from '../base/index';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { getIndexesFromAddress, getSwapRange, getRangeAddress, getRangeIndexes, skipHiddenIdx, getSheetIndexFromAddress } from '../common/index';
import { BeforeFilterEventArgs, FilterOptions, FilterEventArgs, setRow, ExtendedRowModel, getSheetIndex } from '../index';
import { initiateFilter, hideShow } from '../common/event';

/**
 * The `WorkbookFilter` module is used to handle filter action in Spreadsheet.
 */
export class WorkbookFilter {
    private parent: Workbook;
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
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initiateFilter, this.initiateFilterHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateFilter, this.initiateFilterHandler);
        }
    }

    /**
     * Filters a range of cells in the sheet.
     *
     * @param { {args: BeforeFilterEventArgs, promise: Promise<FilterEventArgs>}} eventArgs - Specify the event args.
     * @param {BeforeFilterEventArgs} eventArgs.args - arguments for filtering..
     * @param {Promise<FilterEventArgs>} eventArgs.promise - Specify the promise.
     * @param {boolean} eventArgs.refresh - Specify the refresh.
     * @returns {void} - Filters a range of cells in the sheet.
     */
    private initiateFilterHandler(
        eventArgs: { args: BeforeFilterEventArgs, promise: Promise<FilterEventArgs>, refresh?: boolean }): void {
        const args: BeforeFilterEventArgs = eventArgs.args;
        const deferred: Deferred = new Deferred();
        const sheet: SheetModel = getSheet(this.parent, getSheetIndexFromAddress(this.parent, args.range));
        const filterOptions: FilterOptions = args.filterOptions || {};
        eventArgs.promise = deferred.promise;
        if (filterOptions.datasource) {
            this.setFilter(filterOptions.datasource, filterOptions.predicates, args.range, eventArgs.refresh);
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
                this.setFilter(dataManager, filterOptions.predicates, args.range, eventArgs.refresh);
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
     * @param {boolean} refresh - Specify the refresh.
     * @returns {void} - Hides or unhides the rows based on the filter predicates.
     */
    private setFilter(dataManager: DataManager, predicates: Predicate[], range: string, refresh: boolean): void {
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
                sheet = getSheet(this.parent, sheetIdx);
            } else {
                sheet = this.parent.getActiveSheet();
                sheetIdx = getSheetIndex(this.parent, sheet.name);
            }
            if (this.parent.getModuleName() === 'spreadsheet') {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const parent: any = this.parent;
                let hide: boolean;
                let refreshUI: boolean;
                if ((parent.scrollSettings.enableVirtualization && ((sheet.rows || jsonData).length > (parent.viewport.rowCount +
                    (parent.getThreshold('row') * 2))) || sheet.frozenRows || sheet.frozenColumns) || refresh) {
                    jsonData.forEach((data: { [key: string]: CellModel }) => {
                        hide = result.indexOf(data) < 0;
                        setRow(sheet, Number(data[`${rowKey}`]) - 1, <ExtendedRowModel>{ hidden: hide, isFiltered: hide });
                    });
                    refreshUI = sheetIdx === parent.activeSheetIndex;
                    const paneIndexes: number[] = getRangeIndexes(sheet.paneTopLeftCell);
                    this.parent.updateTopLeftCell(
                        skipHiddenIdx(sheet, paneIndexes[0], true) - this.parent.frozenRowCount(sheet), null, 'col');
                } else {
                    jsonData.forEach((data: { [key: string]: CellModel }) => {
                        hide = result.indexOf(data) < 0;
                        if (refreshUI) {
                            setRow(sheet, Number(data[`${rowKey}`]) - 1, <ExtendedRowModel>{ hidden: hide, isFiltered: hide });
                        } else {
                            const eventArgs: { [key: string]: number | boolean } = { startIndex: Number(data[`${rowKey}`]) - 1, hide: hide,
                                isFiltering: true, sheetIndex: sheetIdx };
                            eventArgs.endIndex = eventArgs.startIndex;
                            this.parent.notify(hideShow, eventArgs);
                            refreshUI = <boolean>eventArgs.refreshUI;
                        }
                    });
                }
                if (refreshUI) {
                    parent.renderModule.refreshSheet(false, false, document.activeElement.id !== `${this.parent.element.id}_SearchBox`);
                }
            } else {
                let hide: boolean;
                jsonData.forEach((data: { [key: string]: CellModel }) => {
                    hide = result.indexOf(data) < 0;
                    setRow(sheet, Number(data[`${rowKey}`]) - 1, <ExtendedRowModel>{ hidden: hide, isFiltered: hide });
                });
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
