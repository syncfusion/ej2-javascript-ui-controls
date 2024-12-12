import { Workbook, SheetModel, CellModel, getSheet, getColumn, ColumnModel, isHiddenRow, getCell, setCell, getSheetIndex, getSheetNameFromAddress, checkColumnValidation } from '../base/index';
import { cellValidation, applyCellFormat, isValidation, addHighlight, getCellAddress, validationHighlight, getSwapRange } from '../common/index';
import { removeHighlight, InsertDeleteEventArgs, checkIsFormula, CheckCellValidArgs, getSheetIndexFromAddress, getSplittedAddressForColumn } from '../common/index';
import { getRangeIndexes, getUpdatedFormulaOnInsertDelete, InsertDeleteModelArgs, getUpdatedFormula, getRangeFromAddress, getViewportIndexes } from '../common/index';
import { CellFormatArgs, ValidationModel, updateCell, beforeInsert, beforeDelete, addListValidationDropdown } from '../common/index';
import { getSheetIndexFromId, setColumn, refreshInsertDelete, workbookFormulaOperation } from '../index';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';


/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export class WorkbookDataValidation {
    private parent: Workbook;
    /**
     * Constructor for WorkbookSort module.
     *
     * @param {Workbook} parent - Specifies the parent element.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module.
     *
     * @returns {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(cellValidation, this.validationHandler, this);
        this.parent.on(addHighlight, this.addHighlightHandler, this);
        this.parent.on(removeHighlight, this.removeHighlightHandler, this);
        this.parent.on(beforeInsert, this.beforeInsertDeleteHandler, this);
        this.parent.on(beforeDelete, this.beforeInsertDeleteHandler, this);
        this.parent.on(refreshInsertDelete, this.beforeInsertDeleteHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(cellValidation, this.validationHandler);
            this.parent.off(addHighlight, this.addHighlightHandler);
            this.parent.off(removeHighlight, this.removeHighlightHandler);
            this.parent.off(beforeInsert, this.beforeInsertDeleteHandler);
            this.parent.off(beforeDelete, this.beforeInsertDeleteHandler);
            this.parent.off(refreshInsertDelete, this.beforeInsertDeleteHandler);
        }
    }


    private validationHandler(
        args: { range: string, rules?: ValidationModel, isRemoveValidation?: boolean, cancel?: boolean, viewport: object }): void {
        let onlyRange: string = args.range;
        let sheetName: string = '';
        const lastIndex: number = args.range.lastIndexOf('!');
        if (lastIndex > -1) {
            onlyRange = args.range.substring(lastIndex + 1);
            sheetName = args.range.substring(0, lastIndex);
        }
        let sheet: SheetModel; let isActiveSheet: boolean;
        if (sheetName) {
            const sheetIdx: number = getSheetIndex(this.parent, sheetName);
            sheet = getSheet(this.parent, sheetIdx);
            isActiveSheet = sheetIdx === this.parent.activeSheetIndex;
        } else {
            sheet = this.parent.getActiveSheet();
            isActiveSheet = true;
        }
        this.parent.dataValidationRange = (this.parent.dataValidationRange.indexOf('!') > -1 ? '' : sheet.name + '!') + this.parent.dataValidationRange + onlyRange + ',';
        const rangeInfo: { range: string, isFullCol: boolean }  = this.getRangeWhenColumnSelected(onlyRange, sheet);
        onlyRange = rangeInfo.range;
        if (!isNullOrUndefined(sheetName)) {
            args.range = sheetName + '!' + onlyRange;
        }
        args.range = args.range || sheet.selectedRange;
        const indexes: number[] = getSwapRange(getRangeIndexes(args.range));
        let cell: CellModel; let column: ColumnModel;
        let viewportIndexes: number[][];
        if (args.viewport && rangeInfo.isFullCol) {
            viewportIndexes = getViewportIndexes(this.parent, args.viewport);
        }
        if (!args.isRemoveValidation && args.rules.type === 'List' && args.rules.value1) {
            args.rules.value1 = args.rules.value1.trim();
            if (args.rules.value1[args.rules.value1.length - 1] === this.parent.listSeparator) {
                args.rules.value1 = args.rules.value1.substring(0, args.rules.value1.length - 1);
            }
        }
        const activeCellIndex: number[] = getSwapRange(getRangeIndexes(sheet.activeCell));
        let isListValidation: boolean;
        for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
            if (rangeInfo.isFullCol) {
                column = getColumn(sheet, colIdx);
                if (args.isRemoveValidation) {
                    if (column && column.validation) {
                        if (colIdx === activeCellIndex[1]) {
                            isListValidation = column.validation.type === 'List';
                        }
                        delete column.validation;
                        if (viewportIndexes) {
                            viewportIndexes.forEach((viewportIndex: number[]) => {
                                for (let rowIdx: number = viewportIndex[0]; rowIdx <= viewportIndex[2]; rowIdx++) {
                                    cell = getCell(rowIdx, colIdx, sheet);
                                    this.parent.notify(
                                        applyCellFormat, <CellFormatArgs>{ rowIdx: rowIdx, colIdx: colIdx, style:
                                            this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]) });
                                }
                            });
                        }
                    }
                } else {
                    const newValidation: ValidationModel = Object.assign({}, args.rules);
                    const currIdx: number[] = [0, colIdx, 0, colIdx];
                    const prevIdx: number[] = indexes;  // Calculate previous indexes based on the original starting point of the formula
                    const updatedVal1: string = getUpdatedFormula(currIdx, prevIdx, sheet, this.parent, { formula: args.rules.value1 });
                    newValidation.value1 = updatedVal1;
                    if (!isNullOrUndefined(args.rules.value2) && args.rules.value2 !== '') {
                        const updatedVal2: string = getUpdatedFormula(currIdx, prevIdx, sheet, this.parent, { formula: args.rules.value2 });
                        newValidation.value2 = updatedVal2;
                    } else if (args.rules.type === 'Custom') {
                        delete newValidation.value2;
                    }
                    column.validation = newValidation;
                    if (colIdx === activeCellIndex[1]) {
                        isListValidation = column.validation.type === 'List';
                    }
                    continue;
                }
            }
            for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (args.isRemoveValidation) {
                    column = getColumn(sheet, colIdx);
                    if (column && column.validation) {
                        if (rowIdx === indexes[2]) {
                            column.validation.address = getSplittedAddressForColumn(
                                column.validation.address, [indexes[0], colIdx, indexes[2], colIdx], colIdx);
                        }
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{
                            rowIdx: rowIdx, colIdx: colIdx,
                            style: this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx])
                        });
                    }
                    cell = getCell(rowIdx, colIdx, sheet);
                    if (cell && cell.validation) {
                        if (rowIdx === activeCellIndex[0] && colIdx === activeCellIndex[1]) {
                            isListValidation = cell.validation.type === 'List';
                        }
                        if (!updateCell(this.parent, sheet, { cell: { validation: {} }, rowIdx: rowIdx, colIdx: colIdx })) {
                            delete cell.validation;
                            this.parent.notify(
                                applyCellFormat, <CellFormatArgs>{
                                    rowIdx: rowIdx, colIdx: colIdx, style:
                                        this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx])
                                });
                        } else {
                            isListValidation = false;
                        }
                    }
                } else {
                    const newValidation: ValidationModel = Object.assign({}, args.rules);
                    const currIdx: number[] = [rowIdx, colIdx, rowIdx, colIdx];
                    const prevIdx: number[] = indexes;  // Calculate previous indexes based on the original starting point of the formula
                    const updatedVal: string = getUpdatedFormula(currIdx, prevIdx, sheet, this.parent, { formula: args.rules.value1 });
                    newValidation.value1 = updatedVal;
                    if (!isNullOrUndefined(args.rules.value2) && args.rules.value2 !== '') {
                        const updatedVal2: string = getUpdatedFormula(currIdx, prevIdx, sheet, this.parent, { formula: args.rules.value2 });
                        newValidation.value2 = updatedVal2;
                    } else if (args.rules.type === 'Custom') {
                        delete newValidation.value2;
                    }
                    cell = { validation: Object.assign({}, newValidation) };
                    updateCell(this.parent, sheet, { cell: cell, rowIdx: rowIdx, colIdx: colIdx });
                    if (rowIdx === activeCellIndex[0] && colIdx === activeCellIndex[1]) {
                        isListValidation = cell.validation.type === 'List';
                    }
                    if (rowIdx === indexes[2]) {
                        column = getColumn(sheet, colIdx);
                        if (column && column.validation) {
                            column.validation.address = getSplittedAddressForColumn(
                                column.validation.address, [indexes[0], colIdx, indexes[2], colIdx], colIdx);
                        }
                    }
                }
            }
        }
        if (isActiveSheet && isListValidation) {
            let validation: ValidationModel;
            const cell: CellModel = getCell(activeCellIndex[0], activeCellIndex[1], sheet, false, true);
            if (args.isRemoveValidation) {
                validation = {};
            } else {
                validation = cell.validation;
                if (!validation) {
                    column = getColumn(sheet, activeCellIndex[1]);
                    validation = (column && column.validation) || {};
                }
            }
            this.parent.notify(
                addListValidationDropdown, { validation, cell, rowIdx: activeCellIndex[0], colIdx: activeCellIndex[1], isRefresh: true });
        }
    }

    private addHighlightHandler(args: { range: string, td? : HTMLElement, isclearFormat?: boolean }): void {
        this.invalidDataHandler(args.range, false, args.td, args.isclearFormat);
    }

    private removeHighlightHandler(args: { range: string }): void {
        this.invalidDataHandler(args.range, true);
    }

    private getRange(range: string): string {
        const indexes: number[] = getRangeIndexes(range);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const maxColCount: number = sheet.colCount;
        const maxRowCount: number = sheet.rowCount;
        if (indexes[2] === maxRowCount - 1 && indexes[0] === 0) {
            range = range.replace(/[0-9]/g, '');
        } else if (indexes[3] === maxColCount - 1 && indexes[2] === 0) {
            range = range.replace(/\D/g, '');
        }
        return range;
    }

    private invalidDataHandler(range: string, isRemoveHighlightedData: boolean, td?: HTMLElement, isclearFormat?: boolean): void {
        const sheetIdx: number = range ? getSheetIndexFromAddress(this.parent, range) : this.parent.activeSheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        range = range || sheet.selectedRange;
        const sheetName: string = range.includes('!') ? getSheetNameFromAddress(range) : sheet.name;
        const rangeInfo: { range: string, isFullCol: boolean } = this.getRangeWhenColumnSelected(getRangeFromAddress(range), sheet);
        const isFullCol: boolean = rangeInfo.isFullCol;
        range = sheetName + '!' + rangeInfo.range;
        const indexes: number[] = range ? getSwapRange(getRangeIndexes(range)) : [];
        range = this.getRange(range);
        let rowIdx: number = range ? indexes[0] : 0;
        const lastRowIdx: number = range ? indexes[2] : sheet.rows.length;
        for (rowIdx; rowIdx <= lastRowIdx; rowIdx++) {
            if (sheet && sheet.rows[rowIdx as number]) {
                let colIdx: number = range ? indexes[1] : 0;
                const lastColIdx: number = range ? indexes[3] : sheet.rows[rowIdx as number].cells.length;
                for (colIdx; colIdx <= lastColIdx; colIdx++) {
                    let validation: ValidationModel;
                    if (sheet.rows[rowIdx as number].cells && sheet.rows[rowIdx as number].cells[colIdx as number]) {
                        const column: ColumnModel = getColumn(sheet, colIdx);
                        const cell: CellModel = sheet.rows[rowIdx as number].cells[colIdx as number];
                        if (cell && cell.validation) {
                            validation = cell.validation;
                            if (isclearFormat && !validation.isHighlighted) {
                                return;
                            }
                            if (isRemoveHighlightedData) {
                                if (validation.isHighlighted) {
                                    cell.validation.isHighlighted = false;
                                }
                            } else {
                                cell.validation.isHighlighted = true;
                            }
                        } else if (column && column.validation) {
                            validation = column.validation;
                            if (isclearFormat && !validation.isHighlighted) {
                                return;
                            }
                            if (validation.address && !checkColumnValidation(column, rowIdx, colIdx)) {
                                continue; // Skip validation for removed ranges in the column validation.
                            }
                            if (isRemoveHighlightedData && isFullCol) {
                                if (validation.isHighlighted) {
                                    column.validation.isHighlighted = false;
                                }
                            } else if (isFullCol) {
                                column.validation.isHighlighted = true;
                            }
                        }
                        if (validation && this.parent.allowDataValidation) {
                            const validEventArgs: CheckCellValidArgs = { value: cell.value ? cell.value : '', range: [rowIdx, colIdx], sheetIdx: sheetIdx, td: td, isValid: true };
                            this.parent.notify(isValidation, validEventArgs);
                            if (!validEventArgs.isValid) {
                                if (!isHiddenRow(sheet, rowIdx) && sheetIdx === this.parent.activeSheetIndex) {
                                    this.parent.notify(validationHighlight, {
                                        isRemoveHighlightedData: isRemoveHighlightedData, rowIdx: rowIdx, colIdx: colIdx, td: td
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    private beforeInsertDeleteHandler(args: InsertDeleteEventArgs): void {
        let isSheetAction: boolean;
        if (args.modelType === 'Sheet') {
            if (args.name !== refreshInsertDelete) {
                return;
            }
            isSheetAction = true;
        } else if (args.name === refreshInsertDelete) {
            return;
        }
        const isInsert: boolean = args.name === beforeInsert;
        let eventArgs: { insertDeleteArgs?: InsertDeleteEventArgs, cell?: CellModel, row?: number, col?: number, sheetIdx?: number,
            otherSheet?: boolean, formulaSheet?: SheetModel, sheetNames?: string[] };
        let endIdx: number; let curSheet: SheetModel; let prevIdx: number;
        if (isInsert) {
            curSheet = getSheet(this.parent, args.activeSheetIndex);
            endIdx = args.index + (args.model.length - 1);
            eventArgs = { insertDeleteArgs: { startIndex: args.index, endIndex: endIdx, modelType: args.modelType, isInsert: true,
                sheet: curSheet }, sheetIdx: args.activeSheetIndex };
            prevIdx = args.index - 1;
        } else if (isSheetAction) {
            const sheetNames: string[] = []; let sheetId: number;
            const formulaArgs: { action: string, sheetInfo: { visibleName: string, sheet: string, index: number }[] } = {
                action: 'getSheetInfo', sheetInfo: [] };
            this.parent.notify(workbookFormulaOperation, formulaArgs);
            for (let idx: number = args.startIndex; idx <= args.endIndex; idx++) {
                sheetId = this.parent.sheets[idx as number].id;
                for (let i: number = 0; i < formulaArgs.sheetInfo.length; i++) {
                    if (formulaArgs.sheetInfo[i as number].index === sheetId) {
                        sheetNames.push(formulaArgs.sheetInfo[i as number].sheet);
                        break;
                    }
                }
            }
            eventArgs = { sheetNames: sheetNames };
        } else {
            curSheet = <SheetModel>args.model;
            eventArgs = { insertDeleteArgs: { startIndex: (args as InsertDeleteModelArgs).start as number, modelType: args.modelType,
                endIndex: (args as InsertDeleteModelArgs).end, sheet: curSheet }, sheetIdx: getSheetIndexFromId(this.parent, curSheet.id) };
        }
        const updateFormula: (validation: ValidationModel) => void = (validation: ValidationModel): void => {
            if (checkIsFormula(validation.value1) && (!eventArgs.otherSheet || validation.value1.includes(curSheet.name))) {
                eventArgs.cell = { formula: validation.value1 };
                this.parent.notify(getUpdatedFormulaOnInsertDelete, eventArgs);
                validation.value1 = eventArgs.cell.formula;
            }
            if (checkIsFormula(validation.value2) && (!eventArgs.otherSheet || validation.value2.includes(curSheet.name))) {
                eventArgs.cell = { formula: validation.value2 };
                this.parent.notify(getUpdatedFormulaOnInsertDelete, eventArgs);
                validation.value2 = eventArgs.cell.formula;
            }
        };
        const isColAction: boolean = args.modelType === 'Column';
        const updateValidationToInsertedModel: (validation: ValidationModel, isColUpdate?: boolean) => void =
            (validation: ValidationModel, isColUpdate?: boolean): void => {
                if (validation) {
                    eventArgs.insertDeleteArgs.forceUpdate = true;
                    for (let insertIdx: number = args.index; insertIdx <= endIdx; insertIdx++) {
                        validation = extend({}, validation);
                        updateFormula(validation);
                        if (isColUpdate) {
                            setColumn(curSheet, insertIdx, { validation: validation });
                        } else if (isColAction) {
                            setCell(rowIdx, insertIdx, curSheet, { validation: validation }, true);
                        } else {
                            setCell(insertIdx, colIdx, curSheet, { validation: validation }, true);
                        }
                    }
                    delete eventArgs.insertDeleteArgs.forceUpdate;
                }
            };
        let cell: CellModel; let column: ColumnModel; let endRowCount: number; let endColCount: number;
        let rowIdx: number; let colIdx: number; let isInsertOnCurSheet: boolean;
        this.parent.sheets.forEach((sheet: SheetModel, sheetIdx: number): void => {
            if (isSheetAction) {
                if (sheetIdx >= args.startIndex && sheetIdx <= args.endIndex) {
                    return;
                }
            } else {
                if (sheetIdx === eventArgs.sheetIdx) {
                    isInsertOnCurSheet = isInsert;
                    delete eventArgs.otherSheet;
                    delete eventArgs.formulaSheet;
                } else {
                    eventArgs.otherSheet = true;
                    eventArgs.formulaSheet = sheet;
                    isInsertOnCurSheet = false;
                }
            }
            endRowCount = sheet.usedRange.rowIndex + 1;
            for (colIdx = 0, endColCount = sheet.usedRange.colIndex + 1; colIdx < endColCount; colIdx++) {
                if (isInsertOnCurSheet && isColAction && colIdx >= args.index && colIdx <= endIdx) {
                    continue;
                }
                column = sheet.columns && sheet.columns[colIdx as number];
                if (column && column.validation) {
                    updateFormula(column.validation);
                    if (isInsertOnCurSheet && isColAction && prevIdx === colIdx) {
                        updateValidationToInsertedModel(column.validation, true);
                    }
                }
                for (rowIdx = 0; rowIdx < endRowCount; rowIdx++) {
                    cell = getCell(rowIdx, colIdx, sheet, false, true);
                    if (cell.validation && (!isInsertOnCurSheet || isColAction || rowIdx < args.index || rowIdx > endIdx)) {
                        updateFormula(cell.validation);
                        if (isInsertOnCurSheet && prevIdx === (isColAction ? colIdx : rowIdx)) {
                            updateValidationToInsertedModel(cell.validation);
                        }
                    }
                }
            }
        });
    }

    private getRangeWhenColumnSelected(range: string, sheet: SheetModel): { range: string, isFullCol: boolean } {
        let isFullCol: boolean;
        const colNames: string[] = range.split(':');
        if (range.match(/\D/g) && !range.match(/[0-9]/g)) {
            colNames[0] += 1;
            colNames[1] += sheet.rowCount;
            range = colNames[0] + ':' + colNames[1];
            isFullCol = true;
        } else if (!range.match(/\D/g) && range.match(/[0-9]/g)) {
            colNames[0] = 'A' + colNames[0];
            colNames[1] = getCellAddress(0, sheet.colCount - 1).replace(/[0-9]/g, '') + colNames[1];
            range = colNames[0] + ':' + colNames[1];
        }
        return { range: range, isFullCol: isFullCol };
    }

    /**
     * Gets the module name.
     *
     * @returns {string} string
     */
    protected getModuleName(): string {
        return 'workbookDataValidation';
    }
}
