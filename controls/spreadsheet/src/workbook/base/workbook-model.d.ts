import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType } from '@syncfusion/ej2-base';import { initSheet, getSheet, getSheetIndexFromId, getSheetIndexByName, getSheetIndex, Sheet, moveSheet, duplicateSheet } from './sheet';import { Event, ModuleDeclaration, merge, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';import { getWorkbookRequiredModules } from '../common/module';import { SheetModel, CellModel, ColumnModel, RowModel, getData, RangeModel, isHiddenRow, isHiddenCol, OpenSettingsModel } from './index';import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs, UndoRedoEventArgs } from '../../spreadsheet/common/interface';import { DefineName, CellStyle, updateRowColCount, getIndexesFromAddress, localeData, workbookLocale } from '../common/index';import { BorderType, getSheetIndexFromAddress, CalculationMode } from '../common/index';import * as events from '../common/event';import { CellStyleModel, DefineNameModel, HyperlinkModel, insertModel, InsertDeleteModelArgs, getAddressInfo } from '../common/index';import { setCellFormat, sheetCreated, deleteModel, ModelType, ProtectSettingsModel, ValidationModel, setLockCells } from '../common/index';import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, UnprotectArgs, ExtendedRange, SerializationOptions } from '../common/interface';import { SaveOptions, SetCellFormatArgs, ClearOptions, AutoFillSettings, AutoFillDirection, AutoFillType, dateToInt } from '../common/index';import { SortOptions, BeforeSortEventArgs, SortEventArgs, FindOptions, CellInfoEventArgs, ConditionalFormatModel } from '../common/index';import { FilterEventArgs, FilterOptions, BeforeFilterEventArgs, ChartModel, getCellIndexes, getCellAddress } from '../common/index';import { setMerge, MergeType, MergeArgs, ImageModel, FilterCollectionModel, SortCollectionModel, dataChanged } from '../common/index';import { getCell, skipDefaultValue, setCell, wrap as wrapText, OpenSettings } from './cell';import { DataBind, setRow, setColumn, InsertDeleteEventArgs, NumberFormatArgs, parseLocaleNumber, refreshRibbonIcons } from '../index';import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';import { WorkbookChart } from '../integrations/index';import { WorkbookNumberFormat, getFormatFromType } from '../integrations/number-format';import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookProtectSheet, WorkbookAutoFill } from '../actions/index';import { WorkbookDataValidation, WorkbookMerge, addListValidationDropdown } from '../index';import { ServiceLocator } from '../services/index';import { setLinkModel, setImage, setChart, setAutoFill, BeforeCellUpdateArgs, updateCell, isNumber } from '../common/index';import { deleteChart, formulaBarOperation } from '../../spreadsheet/common/event';import { beginAction, WorkbookFindAndReplace, getRangeIndexes, workbookEditOperation, clearCFRule, CFArgs, setCFRule } from '../index';import { WorkbookConditionalFormat } from '../actions/conditional-formatting';import { AutoFillSettingsModel } from '../..';import { CheckCellValidArgs, setVisibleMergeIndex, calculateFormula, dataSourceChanged } from '../common/index';import { IFormulaColl } from '../../calculate/common/interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Workbook
 */
export interface WorkbookModel extends ComponentModel{

    /**
     * Configures sheets and its options.
     *
     * {% codeBlock src='spreadsheet/sheets/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    sheets?: SheetModel[];

    /**
     * Specifies the active sheet index in the workbook.
     *
     * {% codeBlock src='spreadsheet/activeSheetIndex/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     * @asptype int
     */

    activeSheetIndex?: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *
     * {% codeBlock src='spreadsheet/height/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * It allows to enable/disable find and replace with its functionalities.
     *
     * @default true
     */
    allowFindAndReplace?: boolean;

    /**
     * It stores the filtered range collection.
     *
     * @hidden
     */
    filterCollection?: FilterCollectionModel[];

    /**
     * It stores the filtered range collection.
     *
     * @hidden
     */
    sortCollection?: SortCollectionModel[];

    /**
     * Defines the width of the Spreadsheet. It accepts width as pixels, number, and percentage.
     *
     * {% codeBlock src='spreadsheet/width/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * It shows or hides the ribbon in spreadsheet.
     *
     * @default true
     */
    showRibbon?: boolean;

    /**
     * It shows or hides the formula bar and its features.
     *
     * @default true
     */
    showFormulaBar?: boolean;

    /**
     * It shows or hides the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.
     *
     * @default true
     */
    showSheetTabs?: boolean;

    /**
     * It allows you to add new data or update existing cell data. If it is false, it will act as read only mode.
     *
     * @default true
     */
    allowEditing?: boolean;

    /**
     * It allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.
     *
     * @default true
     */
    allowOpen?: boolean;

    /**
     * It allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).
     *
     * @default true
     */
    allowSave?: boolean;

    /**
     * It allows to enable/disable sort and its functionalities.
     *
     * @default true
     */
    allowSorting?: boolean;

    /**
     * It allows to enable/disable filter and its functionalities.
     *
     * @default true
     */
    allowFiltering?: boolean;

    /**
     * It allows formatting a raw number into different types of formats (number, currency, accounting, percentage, short date,
     * long date, time, fraction, scientific, and text) with built-in format codes.
     *
     * @default true
     */
    allowNumberFormatting?: boolean;

    /**
     * It allows you to apply styles (font size, font weight, font family, fill color, and more) to the spreadsheet cells.
     *
     * @default true
     */
    allowCellFormatting?: boolean;

    /**
     * It allows to enable/disable Hyperlink and its functionalities.
     *
     * @default true
     */
    allowHyperlink?: boolean;

    /**
     * Enables or disables the ability to add or show notes in the Spreadsheet. If the property is set to false, the Spreadsheet will not add notes in the cells and the notes in the existing cells will not be visible.
     *
     * @default true
     */
    enableNotes?: boolean;

    /**
     * It allows you to insert rows, columns, and sheets into the spreadsheet.
     *
     * @default true
     */
    allowInsert?: boolean;

    /**
     * It allows you to delete rows, columns, and sheets from a spreadsheet.
     *
     * @default true
     */
    allowDelete?: boolean;

    /**
     * It allows you to merge the range of cells.
     *
     * @default true
     */
    allowMerge?: boolean;

    /**
     * It allows you to apply data validation to the spreadsheet cells.
     *
     * @default true
     */
    allowDataValidation?: boolean;

    /**
     * It allows you to insert the image in a spreadsheet.
     *
     * @default true
     */
    allowImage?: boolean;

    /**
     * It allows you to insert the chart in a spreadsheet.
     *
     * @default true
     */
    allowChart?: boolean;

    /**
     * It allows to enable/disable AutoFill functionalities.
     *
     * @default true
     */
    allowAutoFill?: boolean;

    /**
     * Enables or disables the printing functionality in the spreadsheet.
     *
     * @default true
     */
    allowPrint?: boolean;

    /**
     * Specifies the mode of calculation within the spreadsheet.
     * Setting the calculation mode to `Manual` can enhance performance,
     * particularly when working with multiple sheets at the same time.
     *
     * * `Automatic`: Calculations are performed automatically whenever a cell value changes.
     * * `Manual`: Calculations are performed only when explicitly triggered, improving performance
     *   when loading or working with large spreadsheets.
     *
     * @default 'Automatic'
     */
    calculationMode?: CalculationMode;

    /**
     * Configures the auto fill settings.
     *
     * The autoFillSettings `fillType` property has FOUR types and it is described below:
     *
     * * CopyCells: To update the copied cells for the selected range.
     * * FillSeries: To update the filled series for the selected range.
     * * FillFormattingOnly: To fill the formats only for the selected range.
     * * FillWithoutFormatting: To fill without the format for the selected range.
     *
     * {% codeBlock src='spreadsheet/autoFillSettings/index.md' %}{% endcodeBlock %}
     *
     * > The `allowAutoFill` property should be `true`.
     *
     * @default { fillType: 'FillSeries', showFillOptions: true }
     */

    autoFillSettings?: AutoFillSettingsModel;

    /**
     * It allows you to apply conditional formatting to the sheet.
     *
     * @default true
     */
    allowConditionalFormat?: boolean;

    /**
     * Specifies the cell style options.
     *
     * {% codeBlock src='spreadsheet/cellStyle/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    cellStyle?: CellStyleModel;

    /**
     * Specifies the service URL to open excel file in spreadsheet.
     *
     * @default ''
     */
    openUrl?: string;

    /**
     * Specifies the options for configuration when opening a document.
     *
     * {% codeBlock src='spreadsheet/openSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    openSettings?: OpenSettingsModel;

    /**
     * Specifies the service URL to save spreadsheet as Excel file.
     *
     * @default ''
     */
    saveUrl?: string;

    /**
     * Specifies the password.
     *
     * @default ''
     */
    password?: string;

    /**
     * Specifies to  protect the workbook.
     *
     * @default false
     */
    isProtected?: boolean;

    /**
     * Specifies the name of a range and uses it in a formula for calculation.
     *
     * {% codeBlock src='spreadsheet/definedNames/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    definedNames?: DefineNameModel[];

    /**
     * Triggers before opening an Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeOpen: (args: BeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<BeforeOpenEventArgs>;

    /**
     * Triggers when the opened Excel file fails to load.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openFailure: (args: OpenFailureArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event openFailure
     */
    openFailure?: EmitType<OpenFailureArgs>;

    /**
     * Triggers before saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSave: (args: BeforeSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event beforeSave
     */
    beforeSave?: EmitType<BeforeSaveEventArgs>;

    /**
     * Triggers after saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       saveComplete: (args: SaveCompleteEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event saveComplete
     */
    saveComplete?: EmitType<SaveCompleteEventArgs>;

    /**
     * Triggers before the cell format applied to the cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellFormat: (args: BeforeCellFormatArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event beforeCellFormat
     */
    beforeCellFormat?: EmitType<BeforeCellFormatArgs>;

    /**
     * Triggered every time a request is made to access cell information.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      queryCellInfo: (args: CellInfoEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<CellInfoEventArgs>;

    /**
     * Triggers before changing any cell properties.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     *  new Spreadsheet({
     *      beforeCellUpdate: (args: BeforeCellUpdateArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event beforeCellUpdate
     */
    beforeCellUpdate?: EmitType<BeforeCellUpdateArgs>;

    /**
     * It allows to enable/disable freeze pane functionality in spreadsheet.
     *
     * @default true
     */
    allowFreezePane?: boolean;

    /**
     * Specifies the list separator which is used as the formula argument separator.
     *
     * @default ','
     */
    listSeparator?: string;

}