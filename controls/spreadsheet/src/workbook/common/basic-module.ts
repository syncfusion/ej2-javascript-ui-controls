import { Workbook, DataBind } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';
import { WorkbookNumberFormat } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookDelete } from '../actions/index';
import { WorkbookFindAndReplace, WorkbookProtectSheet, WorkbookDataValidation, WorkbookMerge } from '../actions/index';
import { WorkbookConditionalFormat } from '../actions/conditional-formatting';
import { WorkbookChart } from '../integrations/index';
/**
 * Workbook basic module.
 *
 * @private
 */
export class WorkbookBasicModule {
    /**
     * Constructor for Workbook basic module.
     *
     * @private
     */
    constructor() {
        Workbook.Inject(
            DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula,
            WorkbookSort, WorkbookHyperlink, WorkbookFilter, WorkbookInsert, WorkbookDelete, WorkbookFindAndReplace, WorkbookProtectSheet,
            WorkbookDataValidation, WorkbookMerge, WorkbookConditionalFormat, WorkbookImage, WorkbookChart);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'workbookBasic';
    }

    /**
     * Destroys the Workbook basic module.
     *
     * @returns {void} - Destroys the Workbook basic module.
     */
    public destroy(): void {
        /* code snippet */
    }
}
