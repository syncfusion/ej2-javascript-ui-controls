import { Spreadsheet } from '../index';
import { Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, CellFormat } from '../actions/index';
import { Ribbon, FormulaBar, SheetTabs, Open, Save, NumberFormat, Formula, Sort } from '../integrations/index';
import { DataBind } from '../../workbook/integrations/index';

/**
 * Spreadsheet all module.
 * @private
 */
export class AllModule {
    /**
     * Constructor for Spreadsheet all module.
     * @private
     */
    constructor() {
        Spreadsheet.Inject(
            Ribbon, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open,
            Save, NumberFormat, CellFormat, Formula, Sort);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'all';
    }

    /**
     * Destroys the Spreadsheet all module.
     * @return {void}
     */
    public destroy(): void {
        /* code snippet */
    }
}