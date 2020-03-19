import { Workbook, SheetModel } from '../base/index';
import { ProtectSettings } from '../common';
import { protectsheetHandler, protectSheetWorkBook, updateToggle } from '../common/index';
/**
 * The `WorkbookSpreadSheet` module is used to handle the Protecting functionalities in Workbook.
 */
export class WorkbookProtectSheet {
    private parent: Workbook;

    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.addEventListener();
    }
    private protectsheetHandler(args: ProtectSettings): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        sheet.protectSettings.selectCells = args.selectCells;
        sheet.protectSettings.formatCells = args.formatCells;
        sheet.protectSettings.formatColumns = args.formatColumns;
        sheet.protectSettings.formatRows = args.formatRows;
        sheet.protectSettings.insertLink = args.insertLink;
        this.parent.notify(protectSheetWorkBook, sheet.protectSettings);
        this.parent.notify(updateToggle, { props: 'Protect' });
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
        this.parent.on(protectsheetHandler, this.protectsheetHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(protectsheetHandler, this.protectsheetHandler);
        }
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'workbookProtectSheet';
    }
}