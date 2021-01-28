import { Workbook, SheetModel, CellModel, getCell, setCell, getData } from '../base/index';
import { DataManager, Query, ReturnOption, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getColumnHeaderText, getRangeAddress, workbookLocale } from '../common/index';
import { SortDescriptor, SortOptions, BeforeSortEventArgs, SortEventArgs, getSwapRange } from '../common/index';
import { initiateSort } from '../common/event';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';

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
    private initiateSortHandler(eventArgs: { args: BeforeSortEventArgs, promise: Promise<SortEventArgs> }): void {
        let args: BeforeSortEventArgs = eventArgs.args;
        let deferred: Deferred = new Deferred();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = getSwapRange(getIndexesFromAddress(args.range));
        let sortOptions: SortOptions = args.sortOptions || { sortDescriptors: {}, containsHeader: true };
        let isSingleCell: boolean = false;

        eventArgs.promise = deferred.promise;
        if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
            deferred.reject(this.parent.serviceLocator.getService<L10n>(workbookLocale).getConstant('SortOutOfRangeError'));
            return;
        }

        let containsHeader: boolean = sortOptions.containsHeader;
        if (range[0] === range[2]) { //if selected range is a single cell 
            range[0] = 0; range[1] = 0; range[2] = sheet.usedRange.rowIndex; range[3] = sheet.usedRange.colIndex;
            isSingleCell = true;
            containsHeader = isNullOrUndefined(sortOptions.containsHeader) ? true : sortOptions.containsHeader;
        }
        if ((isNullOrUndefined(args.sortOptions) || isNullOrUndefined(args.sortOptions.containsHeader)) && !isSingleCell) {
            if (!isNullOrUndefined(getCell(range[0], range[1], sheet)) && !isNullOrUndefined(getCell(range[0] + 1, range[1], sheet))) {
                if (typeof getCell(range[0], range[1], sheet).value === typeof getCell(range[0] + 1, range[1], sheet).value) {
                    containsHeader = false;
                } else {
                    containsHeader = true;
                }
            }
        }
        let sRIdx: number = range[0] = containsHeader ? range[0] + 1 : range[0];
        let sCIdx: number;
        let eCIdx: number;
        let cell: number[] = getCellIndexes(sheet.activeCell);
        let header: string = getColumnHeaderText(cell[1] + 1);
        let sortDescriptors: SortDescriptor | SortDescriptor[] = sortOptions.sortDescriptors;
        let address: string = getRangeAddress(range);
        getData(this.parent, `${sheet.name}!${address}`, true).then((jsonData: { [key: string]: CellModel }[]) => {
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
                    let comparerFn: Function = sortDescriptors[i].sortComparer
                        || this.sortComparer.bind(this, sortDescriptors[i], sortOptions.caseSensitive);
                    query.sortBy(sortDescriptors[i].field, comparerFn);
                }
            } else { //single column sorting.
                if (!sortDescriptors) {
                    sortDescriptors = { field: header };
                }
                if (!sortDescriptors.field) { sortDescriptors.field = header; }
                let comparerFn: Function = sortDescriptors.sortComparer
                    || this.sortComparer.bind(this, sortDescriptors, sortOptions.caseSensitive);
                query.sortBy(sortDescriptors.field, comparerFn);
            }
            dataManager.executeQuery(query).then((e: ReturnOption) => {
                let colName: string;
                let cell: CellModel = {};
                let rowKey: string = '__rowIndex';
                Array.prototype.forEach.call(e.result, (data: { [key: string]: CellModel }, index: number) => {
                    if (!data || !jsonData[index]) { return; }
                    sCIdx = range[1];
                    eCIdx = range[3];
                    sRIdx = parseInt(jsonData[index][rowKey] as string, 10) - 1;
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        colName = getColumnHeaderText(sCIdx + 1);
                        cell = data[colName] as CellModel;
                        setCell(sRIdx, sCIdx, sheet, cell);
                    }
                });
                let eventArgs: SortEventArgs = { range: `${sheet.name}!${address}`, sortOptions: args.sortOptions };
                deferred.resolve(eventArgs);
            });
        });
    }

    private getDataRange(rowIdx: number, colIdx: number, sheet: SheetModel): number[] {
        let range: number[] = [rowIdx, colIdx, rowIdx, colIdx];
        let j: number; let rIdx: number = rowIdx; let cIdx: number = colIdx;
        let loopLength: number = 0;
        let length: number = sheet.usedRange.rowIndex + sheet.usedRange.colIndex;
        for (let i: number = 1; i < length + 1; i++) {
            for (j = -loopLength; j < loopLength + 1; j++) { // start from right
                if (getCell(rIdx + j, cIdx + i, sheet)) {
                     range[2] =  range[2] > rIdx + j ?  range[2] : rIdx + j;
                     range[3] =  range[3] > cIdx + i ?  range[3] : cIdx + i;
                }
            }
            if (getCell(rIdx + i, cIdx + i, sheet)) {
                 range[2] =  range[2] > rIdx + i ?  range[2] : rIdx + i;
                 range[3] =  range[3] > cIdx + i ?  range[3] : cIdx + i;
            }
            for (j = -loopLength; j < loopLength + 1; j++) {
                if (getCell(rIdx + i, cIdx + j, sheet)) {
                     range[2] =  range[2] > rIdx + i ?  range[2] : rIdx + i;
                     range[3] =  range[3] > cIdx + j ?  range[3] : cIdx + j;
                }
            }
            if (!getCell(rIdx, cIdx, sheet)) {
                if (range[3] === colIdx && range[2] === rowIdx && range[0] === rowIdx && range[1] === colIdx) {
                    if (loopLength === 0) {
                        break;
                    }
                }
            }
            if (getCell(rIdx + i, cIdx - i, sheet)) {
                 range[2] =  range[2] > rIdx + i ?  range[2] : rIdx + i;
                 range[1] =  range[1] < cIdx - i ?  range[1] : cIdx - i;
            }
            for (j = -loopLength; j < loopLength + 1; j++) {
                if (getCell(rIdx + j, cIdx - i, sheet)) {
                     range[0] =  range[0] < rIdx + j ?  range[0] : rIdx + j;
                     range[1] =  range[1] < cIdx - i ?  range[1] : cIdx - i;
                     range[2] =  range[2] > rIdx + j ?  range[2] : rIdx + j;
                }
            }
            if (getCell(rIdx - i, cIdx - i, sheet)) {
                 range[0] =  range[0] < rIdx - i ?  range[0] : rIdx - i;
                 range[1] =  range[1] < cIdx - i ?  range[1] : cIdx - i;
            }
            for (j = -loopLength; j < loopLength + 1; j++) {
                if (getCell(rIdx - i, cIdx + j, sheet)) {
                     range[0] =  range[0] < rIdx - i ?  range[0] : rIdx - i;
                     range[1] =  range[1] < cIdx + j ?  range[1] : cIdx + j;
                     range[3] =  range[3] > cIdx + j ?  range[3] : cIdx + j;
                }
            }
            if (getCell(rIdx - i, cIdx + i, sheet)) {
                 range[0] =  range[0] < rIdx - i ?  range[0] : rIdx - i;
                 range[3] =  range[3] > cIdx + i ?  range[3] : cIdx + i;
            }
            if (range[3] === colIdx &&  range[2] === rowIdx &&  range[0] === rowIdx &&  range[1] === colIdx) {
                break;
            }
            loopLength++;
        }
        return range;
    }

    /**
     * Compares the two cells for sorting.
     * @param sortDescriptor - protocol for sorting.
     * @param caseSensitive - value for case sensitive.
     * @param x - first cell
     * @param y - second cell
     */
    private sortComparer(sortDescriptor: SortDescriptor, caseSensitive: boolean, x: CellModel, y: CellModel): number {
        let direction: string = sortDescriptor.order || '';
        let comparer: Function = DataUtil.fnSort(direction);
        let caseOptions: { [key: string]: string } = { sensitivity: caseSensitive ? 'case' : 'base' };
        if (x && y && (typeof x.value === 'string' || typeof y.value === 'string')) {
            let collator: Intl.Collator = new Intl.Collator(this.parent.locale, caseOptions);
            if (!direction || direction.toLowerCase() === 'ascending') {
                return collator.compare(x.value as string, y.value as string);
            } else {
                return collator.compare(x.value as string, y.value as string) * -1;
            }
        }
        return comparer(x ? x.value : x, y ? y.value : y);
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookSort';
    }
}