import { Workbook, DataBind } from '../../workbook/index';
import { WorkbookSave, WorkbookNumberFormat, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter } from '../integrations/index';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookDelete } from '../actions/index';
import { WorkbookFindAndReplace, WorkbookProtectSheet, WorkbookDataValidation } from '../actions/index';
/**
 * Workbook all module.
 * @private
 */
export class WorkbookAllModule {
    /**
     * Constructor for Workbook all module.
     * @private
     */
    constructor() {
        Workbook.Inject(
            DataBind, WorkbookSave, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit,
            WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookHyperlink, WorkbookFilter, WorkbookInsert, WorkbookDelete,
            WorkbookFindAndReplace, WorkbookProtectSheet, WorkbookDataValidation);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'workbook-all';
    }

    /**
     * Destroys the Workbook all module.
     * @return {void}
     */
    public destroy(): void {
        /* code snippet */
    }
}