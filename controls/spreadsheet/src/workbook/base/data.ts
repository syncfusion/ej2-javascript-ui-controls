import { Workbook, Cell, getSheetNameFromAddress, getSheetIndex, getSheet } from '../base/index';
import { getCellAddress, getIndexesFromAddress, getColumnHeaderText, updateSheetFromDataSource, checkDateFormat } from '../common/index';
import { SheetModel } from './sheet-model';
import { RowModel } from './row-model';
import { CellModel } from './cell-model';
import { getRow, isHiddenRow } from './row';
import { getCell } from './cell';
import { isUndefined, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getMaxSheetId, getSheetNameCount } from './sheet';

/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
export function getData(
    context: Workbook, address: string,
    columnWiseData?: boolean, valueOnly?: boolean): Promise<Map<string, CellModel> | { [key: string]: CellModel }[]> {
    return new Promise((resolve: Function, reject: Function) => {
        resolve((() => {
            let i: number;
            let row: RowModel;
            let data: Map<string, CellModel> | { [key: string]: CellModel }[] = new Map();
            let sheetIdx: number = getSheetIndex(context, getSheetNameFromAddress(address));
            let sheet: SheetModel = getSheet(context, sheetIdx);
            let indexes: number[] = getIndexesFromAddress(address);
            let sRow: number = indexes[0];
            let index: number = 0;
            let args: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell> } = {
                sheet: sheet, indexes: indexes, promise:
                    new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
            };
            context.notify(updateSheetFromDataSource, args);
            return args.promise.then(() => {
                while (sRow <= indexes[2]) {
                    if (!valueOnly && isHiddenRow(sheet, sRow)) { sRow++; continue; }
                    let cells: { [key: string]: CellModel | string | Date } = {};
                    row = getRow(sheet, sRow);
                    i = indexes[1];
                    while (i <= indexes[3]) {
                        if (columnWiseData) {
                            if (data instanceof Map) { data = []; }
                            let key: string = getColumnHeaderText(i + 1);
                            let rowKey: string = '__rowIndex';
                            if (valueOnly) {
                                cells[key] = row ? getValueFromFormat(context, sRow, i, sheetIdx, sheet) : '';
                            } else {
                                cells[key] = row ? getCell(sRow, i, sheet) : null;
                            }
                            if (indexes[3] < i + 1) { cells[rowKey] = (sRow + 1).toString(); }
                            data[index.toString()] = cells;
                        } else {
                            (data as Map<string, CellModel>).set(getCellAddress(sRow, i), row ? getCell(sRow, i, sheet) : null);
                        }
                        i++;
                    }
                    sRow++; index++;
                }
                return data;
            });
        })());
    });
}

function getValueFromFormat(context: Workbook, rowIndex: number, colIndex: number, sheetIdx: number, sheet: SheetModel): string | Date {
    let cell: CellModel = getCell(rowIndex, colIndex, sheet);
    if (cell) {
        if (cell.format) {
            let args: { [key: string]: string | number | boolean | Date } = {
                value: context.getDisplayText(cell), rowIndex: rowIndex, colIndex: colIndex,
                sheetIndex: sheetIdx, dateObj: '', isDate: false, isTime: false
            };
            context.notify(checkDateFormat, args);
            if (args.isDate) {
                return args.dateObj as Date;
            } else { return cell.value; }
        } else { return cell.value; }
    } else { return ''; }
}

/**
 * @hidden
 */
export function getModel(model: (SheetModel | RowModel | CellModel)[], idx: number): SheetModel | RowModel | CellModel {
    let diff: number;
    let j: number;
    let prevIdx: number;
    if (isUndefined(model[idx]) || !(model[idx] && model[idx].index === idx)) {
        for (let i: number = 0; i <= idx; i++) {
            if (model && model[i]) {
                diff = model[i].index - i;
                if (diff > 0) {
                    model.forEach((value: SheetModel | RowModel | CellModel, index: number) => {
                        if (value && value.index) {
                            prevIdx = value.index;
                            j = 1;
                        }
                        if (value && !value.index && index !== 0) {
                            value.index = prevIdx + j;
                        }
                        j++;
                    });
                    while (diff--) {
                        model.splice(i, 0, null);
                    }
                    i += diff;
                }
            } else if (model) {
                model[i] = null;
            } else {
                model = [];
            }
        }
    }
    return model[idx];
}


/**
 * @hidden
 */
export function processIdx(model: (SheetModel | RowModel | CellModel)[], isSheet?: true, context?: Workbook): void {
    let j: number;
    let diff: number;
    let cnt: number;
    let len: number = model.length;
    for (let i: number = 0; i < len; i++) {
        cnt = diff = model[i].index - i;
        model[i].index = null;
        if (diff > 0) {
            j = 0;
            while (diff--) {
                if (isSheet) {
                    context.createSheet(i + j);
                    j++;
                } else {
                    model.splice(i, 0, null);
                }
            }
            i += cnt;
            len += cnt;
        }
        if (isSheet) {
            (model[i] as SheetModel).id = getMaxSheetId(context.sheets);
            if (!(model[i] as SheetModel).name) {
                (model[i] as SheetModel).name = 'Sheet' + getSheetNameCount(context);
            }
        }
    }
    if (isSheet) {
        context.setProperties({ 'sheets': context.sheets }, true);
    }
}

/**
 * @hidden
 */
export function clearRange(context: Workbook, address: string, sheetIdx: number, valueOnly: boolean): void {
    let sheet: SheetModel = getSheet(context, sheetIdx - 1);
    let range: number[] = getIndexesFromAddress(address);
    let sRIdx: number = range[0];
    let eRIdx: number = range[2];
    let sCIdx: number;
    let eCIdx: number;
    for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
        sCIdx = range[1];
        eCIdx = range[3];
        for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
            let cell: CellModel = getCell(sRIdx, sCIdx, sheet);
            if (!isNullOrUndefined(cell) && valueOnly) {
                delete cell.value;
                if (!isNullOrUndefined(cell.formula)) {
                    delete cell.formula;
                }
            }
        }
    }
}