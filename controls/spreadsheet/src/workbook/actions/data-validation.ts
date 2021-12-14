import { Workbook, setCell, SheetModel, setRow, CellModel, getSheet, getColumn, ColumnModel, isHiddenRow } from '../base/index';
import { setValidation, applyCellFormat, isValidation, removeValidation, addHighlight, CellStyleModel, getCellAddress, validationHighlight } from '../common/index';
import { removeHighlight } from '../common/index';
import { getRangeIndexes } from '../common/index';
import { CellFormatArgs, ValidationType, ValidationOperator, ValidationModel } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';


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
        this.parent.on(setValidation, this.addValidationHandler, this);
        this.parent.on(removeValidation, this.removeValidationHandler, this);
        this.parent.on(addHighlight, this.addHighlightHandler, this);
        this.parent.on(removeHighlight, this.removeHighlightHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setValidation, this.addValidationHandler);
            this.parent.off(removeValidation, this.removeValidationHandler);
            this.parent.off(addHighlight, this.addHighlightHandler);
            this.parent.off(removeHighlight, this.removeHighlightHandler);
        }
    }

    private addValidationHandler(args: { rules: ValidationModel, range: string }): void {
        this.ValidationHandler(args.rules, args.range, false);
    }


    private removeValidationHandler(args: { rules: ValidationModel, range: string }): void {
        this.ValidationHandler(args.rules, args.range, true);
    }


    private ValidationHandler(rules: ValidationModel, range: string, isRemoveValidation: boolean): void {
        let cell: CellModel;
        let onlyRange: string = range;
        let sheetName: string = '';
        let column: ColumnModel;
        if (range.indexOf('!') > -1) {
            onlyRange = range.split('!')[1];
            sheetName = range.split('!')[0];
        }
        const sheet: SheetModel = getSheet(this.parent, this.parent.getAddressInfo(sheetName + 'A1:A1').sheetIndex);
        let isfullCol: boolean = false;
        const maxRowCount: number = sheet.rowCount;
        const rangeArr: string[] = onlyRange.split(':');
        if (onlyRange.match(/\D/g) && !onlyRange.match(/[0-9]/g)) {
            rangeArr[0] += 1;
            rangeArr[1] += maxRowCount;
            onlyRange = rangeArr[0] + ':' + rangeArr[1];
            isfullCol = true;
        } else if (!onlyRange.match(/\D/g) && onlyRange.match(/[0-9]/g)) {
            rangeArr[0] = 'A' + rangeArr[0];
            rangeArr[1] = getCellAddress(0, sheet.colCount - 1).replace(/[0-9]/g, '') + rangeArr[1];
            onlyRange = rangeArr[0] + ':' + rangeArr[1];
        }
        if (!isNullOrUndefined(sheetName)) {
            range = sheetName + '!' + onlyRange;
        }
        range = range || sheet.selectedRange;
        const indexes: number[] = getRangeIndexes(range);
        if (isfullCol) {
            for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                column = getColumn(sheet, colIdx);
                isfullCol = isfullCol && isRemoveValidation && column && !column.validation ? false : true;
            }
        }
        if (isfullCol) {
            for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                column = getColumn(sheet, colIdx);
                if (isRemoveValidation && column && column.validation) {
                    delete (sheet.columns[colIdx].validation);
                } else {
                    if (!isRemoveValidation) {
                        if (isNullOrUndefined(column)) {
                            sheet.columns[colIdx] = getColumn(sheet, colIdx);
                        }
                        sheet.columns[colIdx].validation = {
                            operator: rules.operator as ValidationOperator,
                            type: rules.type as ValidationType,
                            value1: (rules.type === 'List' && rules.value1.length > 256) ?
                                (rules.value1 as string).substring(0, 255) : rules.value1 as string,
                            value2: rules.value2 as string,
                            inCellDropDown: rules.inCellDropDown,
                            ignoreBlank: rules.ignoreBlank
                        };
                    }
                }
            }
        } else {
            for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (!sheet.rows[rowIdx]) { setRow(sheet, rowIdx, {}); }
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (!sheet.rows[rowIdx].cells || !sheet.rows[rowIdx].cells[colIdx]) { setCell(rowIdx, colIdx, sheet, {}); }
                    cell = sheet.rows[rowIdx].cells[colIdx];
                    if (isRemoveValidation) {
                        if (cell.validation) {
                            delete (cell.validation);
                            const style: CellStyleModel =
                            this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]);
                            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                                style: style, rowIdx: rowIdx, colIdx: colIdx
                            });
                        }
                    } else {
                        cell.validation = {
                            type: rules.type as ValidationType,
                            operator: rules.operator as ValidationOperator,
                            value1: (rules.type === 'List' && rules.value1.length > 256) ?
                                (rules.value1 as string).substring(0, 255) : rules.value1 as string,
                            value2: rules.value2 as string,
                            ignoreBlank: rules.ignoreBlank,
                            inCellDropDown: rules.inCellDropDown
                        };
                    }
                }
            }
        }
    }

    private addHighlightHandler(args: { range: string, td? : HTMLElement, isclearFormat?: boolean }): void {
        this.InvalidDataHandler(args.range, false, args.td, args.isclearFormat);
    }

    private removeHighlightHandler(args: { range: string }): void {
        this.InvalidDataHandler(args.range, true);
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

    private InvalidDataHandler(range: string, isRemoveHighlightedData: boolean, td?: HTMLElement, isclearFormat?: boolean): void {
        const isCell: boolean = false;
        let cell: CellModel;
        let value: string;
        const sheet: SheetModel = this.parent.getActiveSheet();
        range = range ||  sheet.selectedRange;
        const indexes: number[] = range ? getRangeIndexes(range) : [];
        range = this.getRange(range);
        let isfullCol: boolean = false;
        if (range.match(/\D/g) && !range.match(/[0-9]/g)) {
            isfullCol = true;
        }
        let rowIdx: number = range ? indexes[0] : 0;
        const lastRowIdx: number = range ? indexes[2] : sheet.rows.length;
        for (rowIdx; rowIdx <= lastRowIdx; rowIdx++) {
            if (sheet.rows[rowIdx]) {
                let colIdx: number = range ? indexes[1] : 0;
                const lastColIdx: number = range ? indexes[3] : sheet.rows[rowIdx].cells.length;
                for (colIdx; colIdx <= lastColIdx; colIdx++) {
                    let validation: ValidationModel;
                    if (sheet.rows[rowIdx].cells[colIdx]) {
                        const column: ColumnModel = getColumn(sheet, colIdx);
                        cell = sheet.rows[rowIdx].cells[colIdx];
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
                            if (isRemoveHighlightedData && isfullCol) {
                                if (validation.isHighlighted) {
                                    column.validation.isHighlighted = false;
                                }
                            } else if (isfullCol) {
                                column.validation.isHighlighted = true;
                            }
                        }
                        value = cell.value ? cell.value : '';
                        const range: number[] = [rowIdx, colIdx];
                        const sheetIdx: number = this.parent.activeSheetIndex;
                        if (validation && this.parent.allowDataValidation) {
                            this.parent.notify(isValidation, { value, range, sheetIdx, isCell });
                            const isValid: boolean = this.parent.allowDataValidation;
                            this.parent.allowDataValidation = true;
                            if (!isValid) {
                                if (!isHiddenRow(sheet, rowIdx)){
                                    this.parent.notify(validationHighlight, {
                                        isRemoveHighlightedData: isRemoveHighlightedData, rowIdx: rowIdx, colIdx: colIdx, td: td
                                    });
                                }}
                        }
                    }
                }
            }
        }

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
