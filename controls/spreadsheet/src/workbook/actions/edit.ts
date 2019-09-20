import { Workbook, SheetModel, CellModel, getCell, getSheet } from '../base/index';
import { workbookEditOperation, checkDateFormat, workbookFormulaOperation } from '../common/event';
import { getRangeIndexes } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { checkIsFormula } from '../../workbook/common/index';

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
export class WorkbookEdit {
    private parent: Workbook;

    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.addEventListener();
    }

    /**
     * To destroy the edit module. 
     * @return {void}
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
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'workbookEdit';
    }

    private performEditOperation(args: { [key: string]: Object }): void {
        let action: string = <string>args.action;
        switch (action) {
            case 'updateCellValue':
                this.updateCellValue(
                    <string>args.address, <string>args.value, <number>args.sheetIndex, <boolean>args.isValueOnly);
                break;
        }
    }

    private updateCellValue(
        address: string | number[], value: string, sheetIdx?: number, isValueOnly: boolean = false): void {
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetTab;
        }
        let range: number[];
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        } else {
            range = address;
        }
        let sheet: SheetModel = getSheet(this.parent, sheetIdx - 1);
        if (!sheet.rows[range[0]]) {
            sheet.rows[range[0]] = {};
            sheet.rows[range[0]].cells = [];
        }
        if (!sheet.rows[range[0]].cells[range[1]]) {
            sheet.rows[range[0]].cells[range[1]] = {};
        }
        let cell: CellModel = getCell(range[0], range[1], sheet);
        if (!isValueOnly) {
            let isFormula: boolean = checkIsFormula(value);
            if (!isFormula) {
                cell.formula = '';
                cell.value = value;
            }
            let eventArgs: { [key: string]: string | number | boolean } = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            if (isFormula) {
                cell.formula = <string>eventArgs.value;
                value = cell.value;
            }
            let dateEventArgs: { [key: string]: string | number } = {
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                updatedVal: ''
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (!isNullOrUndefined(dateEventArgs.updatedVal)) {
                cell.value = <string>dateEventArgs.updatedVal;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
            }
        } else {
            cell.value = value;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    }
}