import { Workbook, DataBind } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter } from '../integrations/index';
import { WorkbookNumberFormat } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink } from '../actions/index';
/**
 * Workbook basic module.
 * @private
 */
export class WorkbookBasicModule {
    /**
     * Constructor for Workbook basic module.
     * @private
     */
    constructor() {
        Workbook.Inject(
            DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula,
            WorkbookSort, WorkbookHyperlink, WorkbookFilter);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'workbookBasic';
    }

    /**
     * Destroys the Workbook basic module.
     * @return {void}
     */
    public destroy(): void {
        /* code snippet */
    }
}