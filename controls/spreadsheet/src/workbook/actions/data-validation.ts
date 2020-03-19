import { Workbook, setCell, SheetModel, setRow, CellModel } from '../base/index';
import { setValidation, applyCellFormat, isValidation, removeValidation, addHighlight } from '../common/index';
import { removeHighlight } from '../common/index';
import { getRangeIndexes } from '../common/index';
import { CellFormatArgs, ValidationType, ValidationOperator, ValidationModel } from '../common/index';


/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export class WorkbookDataValidation {
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getRangeIndexes(range);
        for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
            if (!sheet.rows[rowIdx]) { setRow(sheet, rowIdx, {}); }
            for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                if (!sheet.rows[rowIdx].cells || !sheet.rows[rowIdx].cells[colIdx]) { setCell(rowIdx, colIdx, sheet, {}); }
                cell = sheet.rows[rowIdx].cells[colIdx];
                if (isRemoveValidation && cell.validation) {
                    delete (cell.validation);
                } else {
                    cell.validation = {
                        type: rules.type as ValidationType,
                        operator: rules.operator as ValidationOperator,
                        value1: rules.value1 as string,
                        value2: rules.value2 as string,
                        ignoreBlank: rules.ignoreBlank,
                        inCellDropDown: rules.inCellDropDown,
                    };
                }
            }
        }
    }

    private addHighlightHandler(args: { range: string }): void {
        this.InvalidDataHandler(args.range, false);
    }

    private removeHighlightHandler(args: { range: string }): void {
        this.InvalidDataHandler(args.range, true);
    }

    private InvalidDataHandler(range: string, isRemoveHighlightedData: boolean): void {
        let isCell: boolean = false;
        let cell: CellModel;
        let value: string;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = range ? getRangeIndexes(range) : [];
        let rowIdx: number = range ? indexes[0] : 0;
        let lastRowIdx: number = range ? indexes[2] : sheet.rows.length;
        for (rowIdx; rowIdx <= lastRowIdx; rowIdx++) {
            if (sheet.rows[rowIdx]) {
                let colIdx: number = range ? indexes[1] : 0;
                let lastColIdx: number = range ? indexes[3] : sheet.rows[rowIdx].cells.length;
                for (colIdx; colIdx <= lastColIdx; colIdx++) {
                    if (sheet.rows[rowIdx].cells[colIdx]) {
                        cell = sheet.rows[rowIdx].cells[colIdx];
                        value = cell.value ? cell.value : '';
                        let range: number[] = [rowIdx, colIdx];
                        let sheetIdx: number = this.parent.activeSheetTab;
                        if (cell.validation && this.parent.allowDataValidation) {
                            this.parent.notify(isValidation, { value, range, sheetIdx, isCell });
                            let isValid: boolean = this.parent.allowDataValidation;
                            this.parent.allowDataValidation = true;
                            if (!isValid) {
                                if (!isRemoveHighlightedData) {
                                    setCell(rowIdx, colIdx, sheet, { style: { backgroundColor: '#ffff00', color: '#ff0000' } }, true);
                                    this.parent.notify(applyCellFormat, <CellFormatArgs>{
                                        style: { backgroundColor: '#ffff00', color: '#ff0000' }, rowIdx: rowIdx, colIdx: colIdx,
                                        isHeightCheckNeeded: true, manualUpdate: true,
                                        onActionUpdate: true
                                    });
                                } else if (isRemoveHighlightedData) {
                                    if (cell.style && cell.style.backgroundColor === '#ffff00' && cell.style.color === '#ff0000') {
                                        cell.style.backgroundColor = ''; cell.style.color = '';
                                        this.parent.notify(applyCellFormat, <CellFormatArgs>{
                                            style: { backgroundColor: '', color: '' }, rowIdx: rowIdx, colIdx: colIdx,
                                            isHeightCheckNeeded: true, manualUpdate: true,
                                            onActionUpdate: true
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookDataValidation';
    }
}