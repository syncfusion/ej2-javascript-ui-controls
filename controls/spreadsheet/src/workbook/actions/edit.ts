import { Workbook, SheetModel, CellModel, getCell, getSheet } from '../base/index';
import { workbookEditOperation, checkDateFormat, workbookFormulaOperation, refreshChart, checkUniqueRange } from '../common/event';
import { getRangeIndexes, parseIntValue, setLinkModel, getCellAddress } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { checkIsFormula } from '../../workbook/common/index';
import { getTypeFromFormat } from '../integrations/index';

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
export class WorkbookEdit {
    private parent: Workbook;

    /**
     * Constructor for edit module in Workbook.
     *
     * @private
     * @param {Workbook} workbook - Specifies the workbook.
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.addEventListener();
    }

    /**
     * To destroy the edit module.
     *
     * @returns {void} - destroy the edit module
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(workbookEditOperation, this.performEditOperation, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookEditOperation, this.performEditOperation);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - string
     * @private
     */
    public getModuleName(): string {
        return 'workbookEdit';
    }

    private performEditOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        switch (action) {
        case 'updateCellValue':
            args.isFormulaDependent = this.updateCellValue(
                <string>args.address, <string>args.value, <number>args.sheetIndex, <boolean>args.isValueOnly,
                <boolean>args.skipFormatCheck, <boolean>args.isRandomFormula);
            break;
        }
    }

    private updateCellValue(
        address: string | number[], value: string, sheetIdx?: number, isValueOnly?: boolean, skipFormatCheck?: boolean,
        isRandomFormula?: boolean): boolean {
        if (sheetIdx === undefined) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        let range: number[]; let isFormulaDependent: boolean;
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        } else {
            range = address;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        let cell: CellModel = getCell(range[0], range[1], sheet, true);
        if (!cell) {
            cell = sheet.rows[range[0]].cells[range[1]] = {};
        }
        if (!isValueOnly) {
            let isFormula: boolean = checkIsFormula(value);
            isFormula = value === '#SPILL!' ? true : isFormula;
            let skipFormula: boolean = false; // for unique formula
            if (cell.formula && cell.formula.indexOf('UNIQUE') > - 1 && value === '') {
                skipFormula = true;
            }
            const isNotTextFormat: boolean = getTypeFromFormat(cell.format) !== 'Text' && (!isFormula ||
                !value.toLowerCase().startsWith('=text('));
            if (!isFormula && !skipFormula) {
                if (cell.formula) {
                    cell.formula = '';
                }
                cell.value = isNotTextFormat ? <string>parseIntValue(value) : value;
            }
            const eventArgs: { [key: string]: string | number | boolean } = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula,
                isRandomFormula: isRandomFormula
            };
            if (isNotTextFormat && !skipFormatCheck) {
                const dateEventArgs: { [key: string]: string | number } = {
                    value: value,
                    rowIndex: range[0],
                    colIndex: range[1],
                    sheetIndex: sheetIdx,
                    updatedVal: ''
                };
                if (!isFormula) {
                    this.parent.notify(checkDateFormat, dateEventArgs);
                } else if (value.toLowerCase().includes('unique(')) {
                    dateEventArgs.updatedVal = value;
                }
                if (!isNullOrUndefined(dateEventArgs.updatedVal) && (dateEventArgs.updatedVal as string).length > 0) {
                    cell.value = <string>dateEventArgs.updatedVal;
                }
            }
            if (value === '#SPILL!') {
                cell.value = value;
            } else {
                const args: { cellIdx: number[], isUnique: boolean } = { cellIdx: range, isUnique: false };
                this.parent.notify(checkUniqueRange, args);
                if (!skipFormula) {
                    this.parent.notify(workbookFormulaOperation, eventArgs);
                    isFormulaDependent = <boolean>eventArgs.isFormulaDependent;
                } else {
                    value = cell.value;
                }
                if (isFormula) {
                    cell.formula = <string>eventArgs.value;
                    value = cell.value;
                    const formula: string = cell.formula.toLowerCase();
                    if (formula === '=now()' && !cell.format) {
                        cell.format = 'M/d/yyyy h:mm';
                    } else if (formula.includes('=time(') && !cell.format) {
                        cell.format = 'h:mm AM/PM';
                    }
                } else if (cell.value && typeof cell.value === 'string' && (cell.value.indexOf('www.') === 0 ||
                    cell.value.indexOf('https://') === 0 || cell.value.indexOf('http://') === 0 || cell.value.indexOf('ftp://') === 0)) {
                    this.parent.notify(
                        setLinkModel, { hyperlink: cell.value, cell: `${sheet.name}!${getCellAddress(range[0], range[1])}` });
                }
            }
        } else {
            cell.value = value;
        }
        this.parent.setUsedRange(range[0], range[1], sheet);
        if (this.parent.chartColl.length && !this.parent.isEdit && !isRandomFormula) {
            this.parent.notify(refreshChart, {cell: cell, rIdx: range[0], cIdx: range[1], sheetIdx: sheetIdx });
        }
        return isFormulaDependent;
    }
}
