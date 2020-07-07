import { Workbook, Cell, getSheetNameFromAddress, getSheetIndex, getSheet } from '../base/index';
import { getCellAddress, getIndexesFromAddress, getColumnHeaderText, updateSheetFromDataSource, checkDateFormat } from '../common/index';
import { queryCellInfo, CellInfoEventArgs, CellStyleModel, cFDelete } from '../common/index';
import { SheetModel, RowModel, CellModel, getRow, getCell, isHiddenRow, isHiddenCol, getMaxSheetId, getSheetNameCount } from './index';
import { isUndefined, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setCell } from './cell';

/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
export function getData(
    context: Workbook, address: string,
    columnWiseData?: boolean, valueOnly?: boolean): Promise<Map<string, CellModel> | { [key: string]: CellModel }[]> {
    return new Promise((resolve: Function, reject: Function) => {
        resolve((() => {
            let i: number; let cell: CellModel;
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
                            let cellObj: CellModel = {}; Object.assign(cellObj, row ? getCell(sRow, i, sheet) : null);
                            if (cellObj.colSpan > 1 && cellObj.rowSpan > 1) {
                                let cell: CellModel;
                                for (let j: number = sRow, len: number = sRow + cellObj.rowSpan; j < len; j++) {
                                    for (let k: number = i, len: number = i + cellObj.colSpan; k < len; k++) {
                                        if (j === sRow && k === i) { continue; }
                                        cell = new Object();
                                        if (j !== sRow) { cell.rowSpan = sRow - j; }
                                        if (k !== i) { cell.colSpan = i - k; }
                                        if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[k]) {
                                            delete sheet.rows[j].cells[k].value; delete sheet.rows[j].cells[k].formula;
                                        }
                                        setCell(j, k, sheet, cell, true);
                                    }
                                }
                            } else if (cellObj.colSpan > 1) {
                                for (let j: number = i + 1, len: number = i + cellObj.colSpan; j < len; j++) {
                                    setCell(sRow, j, sheet, { colSpan: i - j }, true);
                                    if (sheet.rows[sRow] && sheet.rows[sRow].cells && sheet.rows[sRow].cells[j]) {
                                        delete sheet.rows[sRow].cells[j].value; delete sheet.rows[sRow].cells[j].formula;
                                    }
                                }
                            } else if (cellObj.rowSpan > 1) {
                                for (let j: number = sRow + 1, len: number = sRow + cellObj.rowSpan; j < len; j++) {
                                    setCell(j, i, sheet, { rowSpan: sRow - j }, true);
                                    if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[i]) {
                                        delete sheet.rows[j].cells[i].value; delete sheet.rows[j].cells[i].formula;
                                    }
                                }
                            }
                            if (!valueOnly && isHiddenRow(sheet, sRow)) { sRow++; continue; }
                            if (!valueOnly && isHiddenCol(sheet, i)) { i++; continue; }
                            if (cellObj.style) {
                                let style: CellStyleModel = {}; Object.assign(style, cellObj.style); cellObj.style = style;
                            }
                            let eventArgs: CellInfoEventArgs = { cell: cellObj, address: getCellAddress(sRow, i) };
                            context.trigger(queryCellInfo, eventArgs);
                            (data as Map<string, CellModel>).set(eventArgs.address, eventArgs.cell);
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
    let diff: number = 0;
    let cnt: number;
    let len: number = model.length;
    for (let i: number = 0; i < len; i++) {
        if (!isNullOrUndefined(model[i]) && !isUndefined(model[i].index)) {
            cnt = diff = model[i].index - i;
            delete model[i].index;
        }
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
            if ((model[i] as SheetModel).id < 1) {
                (model[i] as SheetModel).id = getMaxSheetId(context.sheets);
            }
            if (!(model[i] as SheetModel).name) {
                (model[i] as SheetModel).name = 'Sheet' + getSheetNameCount(context);
            }
            let cellCnt: number = 0;
            (model[i] as SheetModel).rows.forEach((row: RowModel) => {
                cellCnt = Math.max(cellCnt, (row && row.cells && row.cells.length - 1) || 0);
            });
            (model[i] as SheetModel).usedRange = { rowIndex: (model[i] as SheetModel).rows.length - 1, colIndex: cellCnt };
        }
    }
}

/**
 * @hidden
 */
export function clearRange(context: Workbook, address: string, sheetIdx: number, valueOnly: boolean): void {
    let sheet: SheetModel = getSheet(context, sheetIdx);
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
            context.notify( cFDelete, { rowIdx: sRIdx, colIdx: sCIdx } );
            if (!isNullOrUndefined(cell) && valueOnly) {
                delete cell.value;
                if (!isNullOrUndefined(cell.formula)) {
                    delete cell.formula;
                }
            }
        }
    }
}