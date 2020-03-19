import { Workbook, SheetModel, CellModel, getData } from '../base/index';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getSwapRange, getRangeAddress } from '../common/index';
import { BeforeFilterEventArgs, FilterOptions, FilterEventArgs } from '../common/interface';
import { initiateFilter, clearAllFilter } from '../common/event';

/**
 * The `WorkbookFilter` module is used to handle filter action in Spreadsheet.
 */
export class WorkbookFilter {
    private parent: Workbook;
    private filterRange: string;
    /**
     * Constructor for WorkbookFilter module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the filter module. 
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
     * @param args - arguments for filtering.
     */
    private initiateFilterHandler(eventArgs: {args: BeforeFilterEventArgs, promise: Promise<FilterEventArgs>}): void {
        let args: BeforeFilterEventArgs = eventArgs.args;
        let deferred: Deferred = new Deferred();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let filterOptions: FilterOptions = args.filterOptions || {};
        eventArgs.promise = deferred.promise;
        this.filterRange = args.range;
        if (filterOptions.datasource) {
            this.setFilter(filterOptions.datasource, filterOptions.predicates);
            let filterEventArgs: FilterEventArgs = { range: args.range, filterOptions: filterOptions };
            deferred.resolve(filterEventArgs);
        } else {
            let range: number[] = getSwapRange(getIndexesFromAddress(args.range));

            if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
                deferred.reject('Select a cell or range inside the used range and try again.');
                return;
            }
            if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
                range[0] = 0; range[1] = 0; range[3] = sheet.usedRange.colIndex;
            }

            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
            range[0] = range[0] + 1; //ignore first row        
            let address: string = getRangeAddress(range);
            getData(this.parent, `${sheet.name}!${address}`, true, true).then((jsonData: {[key: string]: CellModel}[]) => {
                let dataManager: DataManager = new DataManager(jsonData);
                this.setFilter(dataManager, filterOptions.predicates);
                let filterEventArgs: FilterEventArgs = { range: address, filterOptions: filterOptions };
                deferred.resolve(filterEventArgs);
            });
        }
    }

    /**
     * Hides or unhides the rows based on the filter predicates. 
     */
    private setFilter(dataManager: DataManager, predicates: Predicate[]): void {
        if (dataManager && predicates) {
            let jsonData: {[key: string]: CellModel}[] = dataManager.dataSource.json as {[key: string]: CellModel}[];
            let query: Query = new Query();
            if (predicates.length) {
                query.where(Predicate.and(predicates));
            }
            let result: {[key: string]: CellModel}[] = dataManager.executeLocal(query) as {[key: string]: CellModel}[];
            let rowKey: string = '__rowIndex';
            jsonData.forEach((data: {[key: string]: CellModel}, index: number) => {
                if (!data) { return; }
                this.parent.hideRow(parseInt(data[rowKey] as string, 10) - 1, undefined, result.indexOf(data) < 0);
            });
        }
    }

    /**
     * Clears all the filters in the sheet.
     */
    private clearAllFilterHandler(): void {
        if (this.filterRange) {
            let range: number[] =  getCellIndexes(this.filterRange);
            let sheet: SheetModel = this.parent.getActiveSheet();
            this.parent.hideRow(range[0], sheet.usedRange.rowIndex - 1, false);
        }
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookFilter';
    }
}