import { Workbook, Cell, getSheetNameFromAddress, getSheetIndex, getSheet, getRangeIndexes } from '../index';
import { getCellAddress, getIndexesFromAddress, getColumnHeaderText, updateSheetFromDataSource, checkDateFormat } from '../common/index';
import { queryCellInfo, CellInfoEventArgs, CellStyleModel } from '../common/index';
import { SheetModel, RowModel, CellModel, getRow, getCell, isHiddenRow, isHiddenCol, getMaxSheetId, getSheetNameCount } from './index';
import { isUndefined, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setCell } from './../index';

/**
 * Update data source to Sheet and returns Sheet
 *
 * @param {Workbook} context - Specifies the context.
 * @param {string} address - Specifies the address.
 * @param {boolean} columnWiseData - Specifies the bool value.
 * @param {boolean} valueOnly - Specifies the valueOnly.
 * @param {number[]} frozenIndexes - Specifies the freeze row and column start indexes, if it is scrolled.
 * @param {boolean} filterDialog - Specifies the bool value.
 * @param {string} formulaCellRef - Specifies the formulaCellRef.
 * @param {number} idx - Specifies the idx.
 * @param {boolean} skipHiddenRows - Specifies the skipHiddenRows.
 * @param {string} commonAddr - Specifies the common address for the address parameter specified with list of range separated by ','.
 * @param {number} dateValueForSpecificColIdx - Specify the dateValueForSpecificColIdx.
 * @returns {Promise<Map<string, CellModel> | Object[]>} - To get the data
 * @hidden
 */
export function getData(
    context: Workbook, address: string, columnWiseData?: boolean,
    valueOnly?: boolean, frozenIndexes?: number[],
    filterDialog?: boolean, formulaCellRef?: string, idx?: number, skipHiddenRows: boolean = true, commonAddr?: string,
    dateValueForSpecificColIdx?: number):
    Promise<Map<string, CellModel> | { [key: string]: CellModel }[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve: Function, reject: Function) => {
        resolve((() => {
            let i: number;
            let row: RowModel;
            let data: Map<string, CellModel> | { [key: string]: CellModel }[] = new Map();
            let sheetIdx: number;
            if (address.indexOf('!') > -1) {
                sheetIdx = getSheetIndex(context, getSheetNameFromAddress(address));
                address = address.slice(address.indexOf('!') + 1, address.length);
            } else {
                sheetIdx = context.activeSheetIndex;
            }
            const sheet: SheetModel = getSheet(context, sheetIdx);
            let indexes: number[] = getIndexesFromAddress(commonAddr || address);
            let sRow: number = indexes[0];
            /* eslint-disable */
            const args: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, formulaCellRef?: string, sheetIndex?: number,
                isFinite?: boolean } = { sheet: sheet, indexes: indexes, formulaCellRef: formulaCellRef, sheetIndex: idx, isFinite:
                    (<any>context).scrollSettings && (<any>context).scrollSettings.isFinite,
                    promise: new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
            };
            /* eslint-enable */
            context.notify(updateSheetFromDataSource, args);
            return args.promise.then(() => {
                const frozenRow: number = context.frozenRowCount(sheet); const frozenCol: number = context.frozenColCount(sheet);
                if (columnWiseData) {
                    if (data instanceof Map) { data = []; }
                    let index: number;
                    address.split(',').forEach((addr: string): void => {
                        indexes = getRangeIndexes(addr);
                        index = 0; sRow = indexes[0];
                        while (sRow <= indexes[2]) {
                            const cells: { [key: string]: CellModel | string | Date | number } = data[index.toString()] || {};
                            row = getRow(sheet, sRow); i = indexes[1];
                            while (i <= indexes[3]) {
                                if (skipHiddenRows && isHiddenRow(sheet, sRow) && !filterDialog) { sRow++; continue; }
                                const key: string = getColumnHeaderText(i + 1);
                                const rowKey: string = '__rowIndex';
                                if (valueOnly) {
                                    cells[key] = row ? getValueFromFormat(context, sRow, i, sheetIdx, sheet) : '';
                                    if (typeof cells[key] === 'string' && !!Number(cells[key])) {
                                        cells[key] = Number(cells[key]);
                                    }
                                } else {
                                    const cell: CellModel = row ? getCell(sRow, i, sheet) : null;
                                    if ((cell && (cell.formula || !isNullOrUndefined(cell.value))) || Object.keys(cells).length) {
                                        if (i === dateValueForSpecificColIdx) {
                                            cells[key] = extend(
                                                {}, cell, { value: getValueFromFormat(context, sRow, i, sheetIdx, sheet, true) });
                                            if (typeof (cells[key] as CellModel).value === 'string' && !!Number((cells[key] as CellModel).value)) {
                                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                (cells[key] as any).value = Number((cells[key] as CellModel).value);
                                            }
                                        } else {
                                            cells[key] = cell;
                                        }
                                    }
                                }
                                if (indexes[3] < i + 1 && Object.keys(cells).length) { cells[rowKey] = (sRow + 1).toString(); }
                                data[index.toString()] = cells;
                                i++;
                            }
                            sRow++;
                            if (Object.keys(cells).length) {
                                index++;
                            } else {
                                (data as { [key: string]: CellModel }[]).pop();
                            }
                        }
                    });
                } else {
                    const checkFrozenIdx: boolean = !!(!valueOnly && frozenIndexes && frozenIndexes.length);
                    while (sRow <= indexes[2]) {
                        if (checkFrozenIdx && sRow >= frozenRow && sRow < frozenIndexes[0]) {
                            sRow = frozenIndexes[0];
                            continue;
                        }
                        if (!valueOnly && isHiddenRow(sheet, sRow)) {
                            sRow++;
                            continue;
                        }
                        row = getRow(sheet, sRow);
                        i = indexes[1];
                        while (i <= indexes[3]) {
                            const eventArgs: CellInfoEventArgs = { cell: getCell(sRow, i, sheet), address: getCellAddress(sRow, i),
                                rowIndex: sRow, colIndex: i };
                            context.trigger(queryCellInfo, eventArgs);
                            const cellObj: CellModel = getCell(sRow, i, sheet, false, true);
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
                            if (!valueOnly && isHiddenCol(sheet, i)) {
                                i++;
                                continue;
                            }
                            if (checkFrozenIdx && i >= frozenCol && i < frozenIndexes[1]) {
                                i = frozenIndexes[1];
                                continue;
                            }
                            if (cellObj.style) {
                                const style: CellStyleModel = {}; Object.assign(style, cellObj.style); cellObj.style = style;
                            }
                            (data as Map<string, CellModel>).set(eventArgs.address, cellObj);
                            i++;
                        }
                        sRow++;
                    }
                }
                return data;
            });
        })());
    });
}

/**
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {number} colIndex - Specifies the colIndex.
 * @param {number} sheetIdx - Specifies the sheetIdx.
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {boolean} getIntValueFromDate - Specify the getIntValueFromDate.
 * @returns {string | Date} - To get the value format.
 */
 export function getValueFromFormat(context: Workbook, rowIndex: number, colIndex: number, sheetIdx: number,
                            sheet: SheetModel, getIntValueFromDate?: boolean): string | Date {
    const cell: CellModel = getCell(rowIndex, colIndex, sheet);
    if (cell) {
        if (cell.format) {
            const args: { [key: string]: string | number | boolean | Date } = {
                value: context.getDisplayText(cell), rowIndex: rowIndex, colIndex: colIndex,
                sheetIndex: sheetIdx, dateObj: '', isDate: false, isTime: false
            };
            context.notify(checkDateFormat, args);
            if (args.isDate) {
                if (getIntValueFromDate) {
                    return <string>args.updatedVal;
                }
                return args.dateObj as Date;
            } else { return cell.value; }
        } else { return cell.value; }
    } else { return ''; }
}

/**
 * @hidden
 * @param {SheetModel | RowModel | CellModel} model - Specifies the sheet model.
 * @param {number} idx - Specifies the index value.
 * @returns {SheetModel | RowModel | CellModel} - To process the index
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
 * @param {SheetModel | RowModel | CellModel} model - Specifies the sheet model.
 * @param {boolean} isSheet - Specifies the bool value.
 * @param {Workbook} context - Specifies the Workbook.
 * @returns {void} - To process the index
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
                if ((model[i] as { properties: {} }).properties) {
                    (model[i] as { properties: { id: number } }).properties.id = (model[i] as SheetModel).id;
                }
            }
            if (!(model[i] as SheetModel).name) {
                context.setSheetPropertyOnMute(model[i], 'name', 'Sheet' + getSheetNameCount(context));
            }
            let cellCnt: number = 0;
            (model[i] as SheetModel).rows.forEach((row: RowModel) => {
                cellCnt = Math.max(cellCnt, (row && row.cells && row.cells.length - 1) || 0);
            });
            context.setSheetPropertyOnMute(
                model[i], 'usedRange',
                { rowIndex: (model[i] as SheetModel).rows.length ? (model[i] as SheetModel).rows.length - 1 : 0, colIndex: cellCnt }
            );
        }
    }
}
