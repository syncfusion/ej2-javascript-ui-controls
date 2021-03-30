import { Spreadsheet } from '../index';
import { Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, CellFormat, WrapText, ProtectSheet } from '../actions/index';
import { CollaborativeEditing, UndoRedo, Resize, SpreadsheetHyperlink, Insert, Delete, FindAndReplace, Merge } from '../actions/index';
import { Ribbon, FormulaBar, SheetTabs, Open, Save, NumberFormat, Formula, Sort, Filter, SpreadsheetImage } from '../integrations/index';
import { SpreadsheetChart } from '../integrations/index';
import { DataBind } from '../../workbook/integrations/index';
import { DataValidation } from '../actions/data-validation';
import { ConditionalFormatting } from '../actions/conditional-formatting';


/**
 * Spreadsheet all module.
 *
 * @private
 */
export class AllModule {
    /**
     * Constructor for Spreadsheet all module.
     *
     * @private
     */
    constructor() {
        Spreadsheet.Inject(
            Ribbon, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open,
            Save, NumberFormat, CellFormat, Formula, Sort, Resize, CollaborativeEditing, UndoRedo, Filter, SpreadsheetHyperlink, WrapText,
            Insert, Delete, DataValidation, ProtectSheet, FindAndReplace, Merge, SpreadsheetImage, ConditionalFormatting,
            SpreadsheetChart);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'all';
    }

    /**
     * Destroys the Spreadsheet all module.
     *
     * @returns {void} - Destroys the Spreadsheet all module.
     */
    public destroy(): void {
        /* code snippet */
    }
}
