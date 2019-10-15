import { Workbook, SheetModel, CellModel, getCell, setCell } from '../base/index';
import { DataManager, Query, ReturnOption, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getColumnHeaderText, getSwapRange, getRangeAddress } from '../common/index';
import { SortDescriptor, SortOptions, BeforeSortEventArgs, SortEventArgs } from '../common/interface';
import { initiateSort } from '../common/event';
import { ExtendedSheet, Cell } from '../../workbook/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `WorkbookSort` module is used to handle sort action in Spreadsheet.
 */
export class WorkbookSort {
    private parent: Workbook;
    /**
     * Constructor for WorkbookSort module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module. 
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initiateSort, this.initiateSortHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateSort, this.initiateSortHandler);
        }
    }

    /**
     * Sorts range of cells in the sheet.
     * @param args - arguments for sorting.
     */
    private initiateSortHandler(eventArgs: {args: BeforeSortEventArgs, promise: Promise<SortEventArgs>}): void {
        let args: BeforeSortEventArgs = eventArgs.args;
        let deferred: Deferred = new Deferred();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = getSwapRange(getIndexesFromAddress(args.range));
        let sortOptions: SortOptions = args.sortOptions || { sortDescriptors: {}, containsHeader: true };
        let isSingleCell: boolean = false;

        eventArgs.promise = deferred.promise;
        if (range[0] > sheet.usedRange.rowIndex - 1 || range[1] > sheet.usedRange.colIndex) {
            deferred.reject('Select a cell or range inside the used range and try again.');
            return;
        }

        let containsHeader: boolean = sortOptions.containsHeader;
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
            range[0] = 0; range[1] = 0; range[2] = sheet.usedRange.rowIndex - 1; range[3] = sheet.usedRange.colIndex;
            isSingleCell = true;
            containsHeader = isNullOrUndefined(sortOptions.containsHeader) ? true : sortOptions.containsHeader;
        }
        let sRIdx: number = containsHeader ? range[0] + 1 : range[0];
        if ((isNullOrUndefined(args.sortOptions) || isNullOrUndefined(args.sortOptions.containsHeader)) && !isSingleCell) {
            if (!isNullOrUndefined(getCell(range[0], range[1], sheet)) && !isNullOrUndefined(getCell(range[0] + 1, range[1], sheet))) {
                if (typeof getCell(range[0], range[1], sheet).value === typeof getCell(range[0] + 1, range[1], sheet).value) {
                    sRIdx = range[0];
                    containsHeader = false;
                } else {
                    sRIdx = range[0] + 1;
                    containsHeader = true;
                }
            }
        }
        let sCIdx: number;
        let eCIdx: number;
        let cell: number[] = getCellIndexes(sheet.activeCell);
        let header: string = 'Column ' + getColumnHeaderText(cell[1] + 1);
        let sortDescriptors: SortDescriptor | SortDescriptor[] = sortOptions.sortDescriptors;
        this.getDataRange(range, sheet, containsHeader).then((jsonData: { [key: string]: CellModel }[]) => {
            let dataManager: DataManager = new DataManager(jsonData);
            let query: Query = new Query();
            if (Array.isArray(sortDescriptors)) { //multi-column sorting.
                if (!sortDescriptors || sortDescriptors.length === 0) {
                    sortDescriptors = [{ field: header }];
                }
                for (let length: number = sortDescriptors.length, i: number = length - 1; i > -1; i--) {
                    if (!sortDescriptors[length - 1].field) {
                        sortDescriptors[length - 1].field = header;
                    }
                    if (!sortDescriptors[i].field) { continue; }
                    let comparerFn: Function = sortDescriptors[i].sortComparer || this.sortComparer.bind(this, sortDescriptors[i]);
                    query.sortBy(sortDescriptors[i].field, comparerFn);
                }
            } else { //single column sorting.
                if (!sortDescriptors) {
                    sortDescriptors = { field: header };
                }
                if (!sortDescriptors.field) { sortDescriptors.field = header; }
                let comparerFn: Function = sortDescriptors.sortComparer || this.sortComparer.bind(this, sortDescriptors);
                query.sortBy(sortDescriptors.field, comparerFn);
            }
            dataManager.executeQuery(query).then((e: ReturnOption) => {
                let colName: string;
                let cell: CellModel = {};
                Array.prototype.forEach.call(e.result, (data: { [key: string]: CellModel }) => {
                    sCIdx = range[1];
                    eCIdx = range[3];
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                        cell = data[colName] as CellModel;
                        setCell(sRIdx, sCIdx, sheet, cell);
                    }
                    sRIdx++;
                });
                let eventArgs: SortEventArgs = { range: getRangeAddress(range), sortOptions: args.sortOptions };
                deferred.resolve(eventArgs);
            });
        });
    }

    /**
     * Compares the two cells for sorting.
     * @param sortDescriptor - protocol for sorting.
     * @param x - first cell
     * @param y - second cell
     */
    private sortComparer(sortDescriptor: SortDescriptor, x: CellModel, y: CellModel): number {
        //fix - when x and y values are empty, cells should not be swapped.
        if (!(x ? x.value : x) && !(y ? y.value : y)) {
            return -1; // Need to remove this condition once this is handled in fnSort()
        }
        let direction: string = sortDescriptor.order || '';
        let comparer: Function = DataUtil.fnSort(direction);
        return comparer(x ? x.value : x, y ? y.value : y);
    };

    /**
     * Converts the range of cells to json data.
     * @param range - range array
     * @param sheet - model of the sheet
     */
    private getDataRange(range: number[], sheet: SheetModel, containsHeader: boolean): Promise<{ [key: string]: CellModel }[]> {
        let jsonData: { [key: string]: CellModel }[] = [];
        let sRIdx: number = containsHeader ? range[0] + 1 : range[0];
        let eRIdx: number = range[2];
        let sCIdx: number;
        let eCIdx: number;
        let rowNum: number = 0;

        let sheetEx: ExtendedSheet = sheet as ExtendedSheet;
        let option: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell> } = {
            sheet: sheetEx, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise:
                new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
        };
        if (sheetEx.isLocalData && (range[0] === 0 || range[0] === 1) && range[2] === (sheet.rowCount - 1)) {
            this.parent.notify('updateSheetFromDataSource', option);
        }
        return option.promise.then(() => {
            for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                sCIdx = range[1];
                eCIdx = range[3];
                let cells: { [key: string]: CellModel } = {};
                let colName: string = '';
                for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                    colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                    cells[colName] = getCell(sRIdx, sCIdx, sheet);
                    jsonData[rowNum.toString()] = cells;
                }
                rowNum++;
            }
            return jsonData;
        });
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookSort';
    }

}

/**
 * @hidden
 */
interface ValidateRangeArgs {
    range: string;
    isValid: boolean;
}