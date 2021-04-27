import { Workbook, SheetModel, CellModel, getCell, getSheet } from '../base/index';
import { workbookEditOperation, checkDateFormat, workbookFormulaOperation, refreshChart } from '../common/event';
import { getRangeIndexes, parseIntValue } from '../common/index';
import { isNullOrUndefined, getNumericObject } from '@syncfusion/ej2-base';
import { checkIsFormula } from '../../workbook/common/index';
import { getTypeFromFormat } from '../integrations/index';

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
export class WorkbookEdit {
    private parent: Workbook;
    private localeObj: Object;
    private decimalSep: string;

    /**
     * Constructor for edit module in Workbook.
     *
     * @private
     * @param {Workbook} workbook - Specifies the workbook.
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.localeObj = getNumericObject(this.parent.locale);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        this.decimalSep = (<any>this.localeObj).decimal;
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
            this.updateCellValue(
                <string>args.address, <string>args.value, <number>args.sheetIndex, <boolean>args.isValueOnly);
            break;
        }
    }

    private checkDecimalPoint(value: string): string {
        if (Number(value)) {
            const decIndex: number = value.toString().indexOf(this.decimalSep) + 1;
            const checkDec: boolean = value.toString().substr(decIndex).length <= 6;
            value = checkDec ? decIndex < 7 ? value : (parseFloat(value)).toFixed(0) : decIndex > 7 ? (parseFloat(value)).toFixed(0) :
                (parseFloat(value)).toFixed(6 - decIndex + 2);
        }
        return value;
    }

    private updateCellValue(
        address: string | number[], value: string, sheetIdx?: number, isValueOnly: boolean = false): void {
        if (sheetIdx === undefined) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        let range: number[];
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
            const isFormula: boolean = checkIsFormula(value);
            if (!isFormula) {
                cell.formula = '';
                cell.value = <string>parseIntValue(value);
            }
            const eventArgs: { [key: string]: string | number | boolean } = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula
            };
            if (getTypeFromFormat(cell.format) !== 'Text') {
                const dateEventArgs: { [key: string]: string | number } = {
                    value: value,
                    rowIndex: range[0],
                    colIndex: range[1],
                    sheetIndex: sheetIdx,
                    updatedVal: ''
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (!isNullOrUndefined(dateEventArgs.updatedVal) && (dateEventArgs.updatedVal as string).length > 0) {
                    cell.value = <string>dateEventArgs.updatedVal;
                }
            }
            this.parent.notify(workbookFormulaOperation, eventArgs);
            if (isFormula) {
                cell.formula = <string>eventArgs.value;
                value = cell.value;
            }
        } else {
            if (value && value.toString().indexOf(this.decimalSep) > -1) {
                value = this.checkDecimalPoint(value);
            }
            cell.value = value;
        }
        this.parent.setUsedRange(range[0], range[1], sheet);
        if (this.parent.allowChart) {
            this.parent.notify(refreshChart, {cell: cell, rIdx: range[0], cIdx: range[1], sheetIdx: sheetIdx });
        }
    }
}
