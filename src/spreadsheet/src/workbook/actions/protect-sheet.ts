import { Workbook, SheetModel, setColumn, ColumnModel, getSheet, setCell } from '../base/index';
import { ExtendedSheet, ProtectSettings, UnprotectArgs } from '../common/index';
import { protectsheetHandler, protectSheetWorkBook, updateToggle, setLockCells } from '../common/index';
import { unprotectsheetHandler } from '../common/index';
import { getSwapRange } from '../common/index';
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
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
    private protectsheetHandler(
        args: { protectSettings: ProtectSettings, password?: string, sheetIndex: number, triggerEvent: boolean}): void {
        const sheetIndex: number = isNullOrUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        this.parent.setSheetPropertyOnMute(sheet, 'isProtected', true);
        this.parent.setSheetPropertyOnMute(sheet, 'protectSettings', {
            selectCells: args.protectSettings.selectCells, formatCells: args.protectSettings.formatCells,
            formatColumns: args.protectSettings.formatColumns, formatRows: args.protectSettings.formatRows,
            insertLink: args.protectSettings.insertLink, selectUnLockedCells: args.protectSettings.selectUnLockedCells
        });
        this.parent.notify(protectSheetWorkBook, { sheetIndex: sheetIndex, triggerEvent: args.triggerEvent });
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
        if (!isNullOrUndefined(args.sheet)) {
            sheet = this.parent.sheets[args.sheet];
        }
        if ((sheet as ExtendedSheet).isImportProtected) {
            (sheet as ExtendedSheet).isImportProtected = false;
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

    private lockCells(args: {range: string, isLocked?: boolean, triggerEvent?: boolean }): void {
        const addressInfo: { sheetIndex: number,  indices: number[] } = this.parent.getAddressInfo(args.range);
        const indexes: number[] = getSwapRange(addressInfo.indices);
        const sheet: SheetModel = getSheet(this.parent, addressInfo.sheetIndex);
        const isLocked: boolean = args.isLocked ? args.isLocked : false;
        if (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1) {
            for (let i: number = indexes[1]; i <= indexes[3]; i++) {
                setColumn(sheet, i, { isLocked: args.isLocked });
            }
        }
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                setCell(i, j, sheet, { isLocked: isLocked }, true);
            }
        }
        if (args.triggerEvent) {
            this.parent.notify('actionComplete', { action: 'lockCells', eventArgs: args });
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
