import { Workbook, SheetModel, CellModel, getSheet, ColumnModel, isHiddenRow, getCell, setCell } from '../base/index';
import { cellValidation, addHighlight, getCellAddress, updateHighlight, getSwapRange, getUpdatedRange } from '../common/index';
import { removeHighlight, InsertDeleteEventArgs, checkIsFormula, getSheetIndexFromAddress, getRangeFromAddress } from '../common/index';
import { getRangeIndexes, getUpdatedFormulaOnInsertDelete, InsertDeleteModelArgs, getUpdatedFormula } from '../common/index';
import { ValidationModel, updateCell, beforeInsert, beforeDelete, addListValidationDropdown } from '../common/index';
import { getSplittedAddressForColumn } from '../common/index';
import { getSheetIndexFromId, setColumn, refreshInsertDelete, workbookFormulaOperation, ExtendedWorkbook, isHiddenCol } from '../index';
import { getSheetIndex, RowModel, getRow, checkColumnValidation } from '../base/index';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';


/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export class WorkbookDataValidation {
    private parent: Workbook;
    private highlightInvalidData: boolean;
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
        this.highlightInvalidData = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(cellValidation, this.updateValidationHandler, this);
        this.parent.on(addHighlight, this.addHighlightHandler, this);
        this.parent.on(removeHighlight, this.removeHighlightHandler, this);
        this.parent.on(beforeInsert, this.beforeInsertDeleteHandler, this);
        this.parent.on(beforeDelete, this.beforeInsertDeleteHandler, this);
        this.parent.on(refreshInsertDelete, this.beforeInsertDeleteHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(cellValidation, this.updateValidationHandler);
            this.parent.off(addHighlight, this.addHighlightHandler);
            this.parent.off(removeHighlight, this.removeHighlightHandler);
            this.parent.off(beforeInsert, this.beforeInsertDeleteHandler);
            this.parent.off(beforeDelete, this.beforeInsertDeleteHandler);
            this.parent.off(refreshInsertDelete, this.beforeInsertDeleteHandler);
        }
    }

    private updateValidationHandler(
        args: { range: string, rules?: ValidationModel, isRemoveValidation?: boolean, isAction?: boolean }): void {
        let sheetName: string;
        const lastIndex: number = args.range.lastIndexOf('!');
        let sheet: SheetModel; let isActiveSheet: boolean;
        if (lastIndex > -1) {
            sheetName = args.range.substring(0, lastIndex);
            args.range = args.range.substring(lastIndex + 1);
            const sheetIdx: number = getSheetIndex(this.parent, sheetName);
            sheet = getSheet(this.parent, sheetIdx);
            isActiveSheet = sheetIdx === this.parent.activeSheetIndex;
        } else {
            sheet = this.parent.getActiveSheet();
            isActiveSheet = true;
        }
        const rangeInfo: { range: string, isFullCol: boolean }  = this.getRangeWhenColumnSelected(args.range, sheet);
        if (sheetName) {
            args.range = sheetName + '!' + rangeInfo.range;
        }
        const indexes: number[] = getSwapRange(getRangeIndexes(rangeInfo.range));
        let column: ColumnModel; let cell: CellModel; let frozenRow: number; let uiRefresh: boolean; let viewport: number[];
        let updateCellHighlightOnUI: (validation: ValidationModel) => void;
        let updateColHighlightOnUI: (validation: ValidationModel) => void;
        const options: { colIdx: number, rowIdx?: number, cell?: CellModel, validation?: ValidationModel,
            isRemoveValidation?: boolean, isRemoveHighlightedData?: boolean, removeOnValidData?: boolean } = { colIdx: indexes[1] };
        if (isActiveSheet) {
            frozenRow = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            const parent: ExtendedWorkbook = this.parent as ExtendedWorkbook;
            const viewOffset: { topIndex?: number, bottomIndex?: number, leftIndex?: number, rightIndex?: number } = parent.viewport || {};
            viewport = parent.scrollSettings && parent.scrollSettings.enableVirtualization ? [frozenRow + viewOffset.topIndex, frozenCol +
                viewOffset.leftIndex, viewOffset.bottomIndex, viewOffset.rightIndex] : [0, 0, sheet.rowCount - 1, sheet.colCount - 1];
            if (rangeInfo.isFullCol) {
                const viewportRowIndexes: number[][] = [[viewport[0], viewport[2]]];
                if (frozenRow) {
                    viewportRowIndexes.push([getRangeIndexes(sheet.topLeftCell)[0], frozenRow - 1]);
                }
                updateColHighlightOnUI = (validation: ValidationModel): void => {
                    if (validation.isHighlighted && ((options.colIdx >= viewport[1] && options.colIdx <= viewport[3]) ||
                        options.colIdx < frozenCol) && !isHiddenCol(sheet, options.colIdx)) {
                        viewportRowIndexes.forEach((indexes: number[]): void => {
                            for (options.rowIdx = indexes[0]; options.rowIdx <= indexes[1]; options.rowIdx++) {
                                if (!isHiddenRow(sheet, options.rowIdx)) {
                                    options.cell = getCell(options.rowIdx, options.colIdx, sheet, false, true);
                                    options.validation = options.cell.validation ? options.cell.validation : validation;
                                    this.parent.notify(updateHighlight, options);
                                }
                            }
                        });
                    }
                };
            }
            updateCellHighlightOnUI = (validation: ValidationModel): void => {
                if (validation.isHighlighted && uiRefresh && ((options.colIdx >= viewport[1] && options.colIdx <= viewport[3]) ||
                    options.colIdx < frozenCol) && !isHiddenCol(sheet, options.colIdx)) {
                    this.parent.notify(updateHighlight, options);
                }
            };
        }
        let highlightObj: ValidationModel; let isListType: boolean; let activeIdx: number[]; let updateFormula: (rowIdx: number) => void;
        if (args.isRemoveValidation) {
            if (isActiveSheet) {
                activeIdx = getRangeIndexes(sheet.activeCell);
                if (activeIdx[0] >= indexes[0] && activeIdx[1] >= indexes[1] && activeIdx[0] <= indexes[2] && activeIdx[1] <= indexes[3]) {
                    const validation: ValidationModel = getCell(activeIdx[0], activeIdx[1], sheet, false, true).validation ||
                        (checkColumnValidation(sheet.columns[indexes[1]], activeIdx[0], activeIdx[1]) &&
                        sheet.columns[activeIdx[1]].validation);
                    isListType = validation && validation.type === 'List';
                }
                options.isRemoveValidation = true;
                options.isRemoveHighlightedData = true;
            }
        } else {
            if (args.isAction && this.highlightInvalidData) {
                highlightObj = { isHighlighted: this.highlightInvalidData };
            }
            if (args.rules.type === 'List') {
                activeIdx = getRangeIndexes(sheet.activeCell);
                isListType = isActiveSheet && activeIdx[0] >= indexes[0] && activeIdx[1] >= indexes[1] && activeIdx[0] <= indexes[2] &&
                    activeIdx[1] <= indexes[3];
                if (args.rules.value1) {
                    args.rules.value1 = args.rules.value1.trim();
                    if (args.rules.value1[args.rules.value1.length - 1] === this.parent.listSeparator) {
                        args.rules.value1 = args.rules.value1.substring(0, args.rules.value1.length - 1);
                    }
                }
            } else if (args.rules.type === 'Custom' && !isNullOrUndefined(args.rules.value2)) {
                delete args.rules.value2;
            }
            if (isActiveSheet) {
                options.removeOnValidData = true;
            }
            const isFormulaVal1: boolean = checkIsFormula(args.rules.value1);
            const isFormulaVal2: boolean = checkIsFormula(args.rules.value2);
            updateFormula = (rowIdx: number): void => {
                // Calculate previous indexes based on the original starting point of the formula
                if (isFormulaVal1) {
                    options.validation.value1 = getUpdatedFormula(
                        [rowIdx, options.colIdx, rowIdx, options.colIdx], indexes, sheet, this.parent, { formula: args.rules.value1 });
                }
                if (isFormulaVal2) {
                    options.validation.value2 = getUpdatedFormula(
                        [rowIdx, options.colIdx, rowIdx, options.colIdx], indexes, sheet, this.parent, { formula: args.rules.value2 });
                }
            };
        }
        for (options.colIdx; options.colIdx <= indexes[3]; options.colIdx++) {
            if (rangeInfo.isFullCol) {
                if (args.isRemoveValidation) {
                    column = sheet.columns[options.colIdx];
                    if (column && column.validation) {
                        if (isActiveSheet) {
                            updateColHighlightOnUI(column.validation);
                        }
                        delete column.validation;
                    }
                } else {
                    options.validation = Object.assign({}, args.rules, highlightObj);
                    updateFormula(0);
                    if (!sheet.columns[options.colIdx]) {
                        sheet.columns[options.colIdx] = {};
                    }
                    sheet.columns[options.colIdx].validation = options.validation;
                    if (isActiveSheet) {
                        updateColHighlightOnUI(options.validation);
                    }
                    continue;
                }
            }
            for (options.rowIdx = indexes[0]; options.rowIdx <= indexes[2]; options.rowIdx++) {
                uiRefresh = isActiveSheet && ((options.rowIdx >= viewport[0] && options.rowIdx <= viewport[2]) ||
                    options.rowIdx < frozenRow) && !isHiddenRow(sheet, options.rowIdx);
                if (args.isRemoveValidation) {
                    column = sheet.columns[options.colIdx];
                    if (column && column.validation) {
                        if (options.rowIdx === indexes[2]) {
                            column.validation.address = getSplittedAddressForColumn(
                                column.validation.address, [indexes[0], options.colIdx, indexes[2], options.colIdx], options.colIdx);
                        }
                        if (isActiveSheet) {
                            updateCellHighlightOnUI(column.validation);
                        }
                    }
                    cell = getCell(options.rowIdx, options.colIdx, sheet);
                    if (cell && cell.validation && !updateCell(
                        this.parent, sheet, { cell: { validation: {} }, rowIdx: options.rowIdx, colIdx: options.colIdx })) {
                        if (isActiveSheet) {
                            updateCellHighlightOnUI(cell.validation);
                        }
                        delete cell.validation;
                    }
                } else {
                    options.validation = Object.assign({}, args.rules, highlightObj);
                    updateFormula(options.rowIdx);
                    if (!updateCell(
                        this.parent, sheet, { cell: { validation: options.validation }, rowIdx: options.rowIdx, colIdx: options.colIdx })) {
                        if (isActiveSheet) {
                            options.cell = getCell(options.rowIdx, options.colIdx, sheet);
                            updateCellHighlightOnUI(options.validation);
                        }
                    }
                }
            }
        }
        if (isListType) {
            cell = getCell(activeIdx[0], activeIdx[1], sheet, false, true);
            let validation: ValidationModel = cell.validation;
            if (!validation) {
                validation = checkColumnValidation(sheet.columns[activeIdx[1]], activeIdx[0], activeIdx[1]) ?
                    sheet.columns[activeIdx[1]].validation : {};
            }
            this.parent.notify(
                addListValidationDropdown, { validation, cell, rowIdx: activeIdx[0], colIdx: activeIdx[1], isRefresh: true });
        }
    }

    private addHighlightHandler(args: { range?: string, isAction?: boolean }): void {
        if (args.isAction) {
            this.highlightInvalidData = true;
        }
        this.invalidDataHandler(args.range);
    }

    private removeHighlightHandler(args: { range?: string, isAction?: boolean }): void {
        if (args.isAction) {
            this.highlightInvalidData = null;
        }
        this.invalidDataHandler(args.range, true);
    }

    private invalidDataHandler(range?: string, isRemoveHighlightedData?: boolean): void {
        let cell: CellModel; let col: ColumnModel; let rowIdx: number; let colIdx: number; let indexes: number[];
        let uiRefresh: boolean; let isActiveSheet: boolean; let isFullRange: boolean; let lastColIdx: number; let row: RowModel;
        const parent: ExtendedWorkbook = this.parent as ExtendedWorkbook;
        let sheet: SheetModel = this.parent.getActiveSheet();
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        const viewport: number[] = parent.scrollSettings && parent.scrollSettings.enableVirtualization ? (parent.viewport ?
            [frozenRow + parent.viewport.topIndex, frozenCol + parent.viewport.leftIndex, parent.viewport.bottomIndex,
                parent.viewport.rightIndex] : []) : [0, 0, sheet.rowCount - 1, sheet.colCount - 1];
        const updateHighlightOnUI: (validation: ValidationModel, col?: ColumnModel) => void =
            (validation: ValidationModel, col?: ColumnModel): void => {
                if (uiRefresh && ((colIdx >= viewport[1] && colIdx <= viewport[3]) || colIdx < frozenCol) && !isHiddenCol(sheet, colIdx)) {
                    this.parent.notify(
                        updateHighlight, {
                            isRemoveHighlightedData: isRemoveHighlightedData, rowIdx: rowIdx, colIdx: colIdx, cell: cell,
                            validation: validation, removeOnValidData: true, col: col
                        });
                }
            };
        let updateHighlightProp: (validation: ValidationModel, updateHighlight: boolean, col?: ColumnModel) => void;
        if (isRemoveHighlightedData) {
            updateHighlightProp = (validation: ValidationModel, updateHighlight: boolean): void => {
                if (validation.isHighlighted) {
                    if (updateHighlight) {
                        delete validation.isHighlighted;
                    }
                    updateHighlightOnUI(validation);
                }
            };
        } else {
            updateHighlightProp = (validation: ValidationModel, updateHighlight: boolean, col?: ColumnModel): void => {
                if (updateHighlight) {
                    validation.isHighlighted = true;
                }
                updateHighlightOnUI(validation, col);
            };
        }
        const updateValidationHighlight: Function = (): void => {
            for (rowIdx = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                uiRefresh = isActiveSheet && ((rowIdx >= viewport[0] && rowIdx <= viewport[2]) || rowIdx < frozenRow) &&
                    !isHiddenRow(sheet, rowIdx);
                if (isFullRange) {
                    row = getRow(sheet, rowIdx);
                    lastColIdx = Math.max(row && row.cells ? row.cells.length - 1 : null, sheet.columns.length - 1, indexes[3]);
                }
                for (colIdx = indexes[1]; colIdx <= lastColIdx; colIdx++) {
                    cell = getCell(rowIdx, colIdx, sheet, false, true);
                    col = sheet.columns[colIdx as number];
                    if (cell.validation) {
                        updateHighlightProp(cell.validation, true, col);
                    } else {
                        if (checkColumnValidation(col, rowIdx, colIdx)) {
                            updateHighlightProp(col.validation, rowIdx === indexes[2]);
                        }
                    }
                }
            }
        };
        if (range) {
            if (range.includes('!')) {
                const sheetIdx: number = getSheetIndexFromAddress(this.parent, range);
                sheet = getSheet(this.parent, sheetIdx);
                range = getRangeFromAddress(range);
                isActiveSheet = sheetIdx === this.parent.activeSheetIndex;
            } else {
                isActiveSheet = true;
            }
            indexes = getSwapRange(getRangeIndexes(this.getRangeWhenColumnSelected(getUpdatedRange(sheet, range), sheet).range));
            lastColIdx = indexes[3];
            updateValidationHighlight();
        } else {
            isFullRange = true;
            this.parent.sheets.forEach((model: SheetModel, sheetIdx: number): void => {
                sheet = model;
                indexes = [0, 0, Math.max(sheet.rows.length - 1, viewport[2]), Math.max(sheet.usedRange.colIndex, viewport[3])];
                isActiveSheet = sheetIdx === this.parent.activeSheetIndex;
                updateValidationHighlight();
            });
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
