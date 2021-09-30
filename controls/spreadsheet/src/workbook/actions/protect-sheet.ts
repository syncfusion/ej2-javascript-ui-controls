import { Workbook, SheetModel, setColumn, ColumnModel } from '../base/index';
import { ProtectSettings, applyLockCells, UnprotectArgs } from '../common/index';
import { protectsheetHandler, protectSheetWorkBook, updateToggle, setLockCells } from '../common/index';
import { unprotectsheetHandler } from '../common/index';
import { getRangeIndexes,  getSwapRange } from '../common/index';
import { isUndefined } from '@syncfusion/ej2-base';
/**
 * The `WorkbookSpreadSheet` module is used to handle the Protecting functionalities in Workbook.
 */
export class WorkbookProtectSheet {
    private parent: Workbook;

    /**
     * Constructor for edit module in Workbook.
     *
     * @param {Workbook} workbook - Specifies the workbook.
     * @private
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.addEventListener();
    }
    private protectsheetHandler(args: {protectSettings: ProtectSettings, password?: string}): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.parent.setSheetPropertyOnMute(sheet, 'protectSettings', {
            selectCells: args.protectSettings.selectCells, formatCells: args.protectSettings.formatCells,
            formatColumns: args.protectSettings.formatColumns, formatRows: args.protectSettings.formatRows, insertLink: args.protectSettings.insertLink
        });
        this.parent.notify(protectSheetWorkBook, sheet.protectSettings);
        this.parent.notify(updateToggle, { props: 'Protect' });
        sheet.password = args.password ? args.password : '';
        sheet.columns.forEach((column: ColumnModel) => {
            if (column && isUndefined(column.isLocked)) {
                column.isLocked = true;
            }
        });
    }

    private unprotectsheetHandler(args: UnprotectArgs): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.sheet) {
            sheet = this.parent.sheets[args.sheet];
        }
        sheet.protectSettings.formatCells = sheet.protectSettings.formatColumns = false;
        sheet.protectSettings.formatRows = sheet.protectSettings.selectCells = false;
        this.parent.setSheetPropertyOnMute(sheet, 'isProtected', false);
        this.parent.notify(protectSheetWorkBook, sheet.protectSettings);
        this.parent.notify(updateToggle, { props: 'Protect' });
    }

    /**
     * To destroy the edit module.
     *
     * @returns {void} - To destroy the edit module.
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(protectsheetHandler, this.protectsheetHandler, this);
        this.parent.on(unprotectsheetHandler, this.unprotectsheetHandler, this);
        this.parent.on(setLockCells, this.lockCells, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(protectsheetHandler, this.protectsheetHandler);
            this.parent.off(setLockCells, this.lockCells);
            this.parent.off(protectsheetHandler, this.unprotectsheetHandler);

        }
    }

    private lockCells(args?: {range: string | number[], isLocked?: boolean}): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let range: string | number[];
        if (args) {
            range = args.range;
        } else {range = sheet.selectedRange; }
        const indexes: number[] = typeof (range) === 'object' ? <number[]>range :
            getSwapRange(getRangeIndexes(<string>range));
        if (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1) {
            for (let i: number = indexes[1]; i <= indexes[3]; i++) {
                setColumn(sheet, i, { isLocked: args.isLocked });
            }
        }
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                if (this.parent.getActiveSheet().id === sheet.id) {
                    this.parent.notify(applyLockCells, {  rowIdx: i, colIdx: j, isLocked: args.isLocked
                    });
                }
            }
        }
    }
    /**
     * Get the module name.
     *
     * @returns {string} - Return the string.
     * @private
     */
    public getModuleName(): string {
        return 'workbookProtectSheet';
    }
}
