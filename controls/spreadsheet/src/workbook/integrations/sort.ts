import { Workbook, SheetModel, CellModel, getCell, setCell, getData } from '../base/index';
import { DataManager, Query, ReturnOption, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getColumnHeaderText, getRangeAddress, workbookLocale } from '../common/index';
import { SortDescriptor, SortOptions, BeforeSortEventArgs, SortEventArgs, getSwapRange, CellStyleModel } from '../common/index';
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
            range = this.getSortDataRange(range[0], range[1], sheet);
            isSingleCell = true;
            if (isNullOrUndefined(sortOptions.containsHeader)) {
                if (typeof getCell(range[0], range[1], sheet, null, true).value ===
                    typeof getCell(range[0] + 1, range[1], sheet, null, true).value) {
                    containsHeader = this.isSameStyle(
                        getCell(range[0], range[1], sheet, null, true).style,
                        getCell(range[0] + 1, range[1], sheet, null, true).style) ? false : true;
                } else {
                    containsHeader = true;
                }
            }
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
                    if (!data) { return; }
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

    private isSameStyle(firstCellStyle: CellStyleModel = {}, secondCellStyle: CellStyleModel = {}): boolean {
        let sameStyle: boolean = true;
        let keys: string[] = Object.keys(firstCellStyle);
        for (let i: number = 0; i < keys.length; i++) {
            if (firstCellStyle[keys[i]] === secondCellStyle[keys[i]] || this.parent.cellStyle[keys[i]] === firstCellStyle[keys[i]]) {
                sameStyle = true;
            } else {
                sameStyle = false;
                break;
            }
        }
        return sameStyle;
    }

    private getSortDataRange(rowIdx: number, colIdx: number, sheet: SheetModel): number[] {
        let topIdx: number = rowIdx; let btmIdx: number = rowIdx;
        let leftIdx: number = colIdx; let prevleftIdx: number;
        let rightIdx: number = colIdx; let prevrightIdx: number;
        let topReached: boolean; let btmReached: boolean;
        let leftReached: boolean; let rightReached: boolean;
        for (let i: number = 1; ; i++) {
            if (!btmReached && getCell(rowIdx + i, colIdx, sheet, null, true).value) {
                btmIdx = rowIdx + i;
            } else {
                btmReached = true;
            }
            if (!topReached && getCell(rowIdx - i, colIdx, sheet, null, true).value) {
                topIdx = rowIdx - i;
            } else {
                topReached = true;
            }
            if (topReached && btmReached) {
                break;
            }
        }
        for (let j: number = 1; ; j++) {
            prevleftIdx = leftIdx;
            prevrightIdx = rightIdx;
            for (let i: number = topIdx; i <= btmIdx; i++) {
                if (!leftReached && getCell(i, leftIdx - 1, sheet, null, true).value) {
                    leftIdx = prevleftIdx - 1;
                }
                if (!rightReached && getCell(i, rightIdx + 1, sheet, null, true).value) {
                    rightIdx = prevrightIdx + 1;
                }
                if (i === btmIdx) {
                    if (leftIdx === prevleftIdx) {
                        leftReached = true;
                    }
                    if (rightIdx === prevrightIdx) {
                        rightReached = true;
                    }
                }
                if (rightReached && leftReached) {
                    return [topIdx, leftIdx, btmIdx, rightIdx];
                }
            }
        }
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
        if ((x === null || isNullOrUndefined(x.value)) && (y === null || isNullOrUndefined(y.value))) {
            return -1;
        }
        if (x === null || isNullOrUndefined(x.value)) {
            return 1;
        }
        if (y === null || isNullOrUndefined(y.value)) {
            return -1;
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