import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType } from '@syncfusion/ej2-base';import { initSheet, getSheet, getSheetIndexFromId, getSheetIndexByName, getSheetIndex, Sheet, moveSheet, duplicateSheet } from './sheet';import { Event, ModuleDeclaration, merge, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';import { getWorkbookRequiredModules } from '../common/module';import { SheetModel, CellModel, ColumnModel, RowModel, getData, clearRange } from './index';import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs, CellValidationEventArgs } from '../../spreadsheet/common/interface';import { DefineName, CellStyle, updateUsedRange, getIndexesFromAddress, localeData, workbookLocale, BorderType } from '../common/index';import * as events from '../common/event';import { CellStyleModel, DefineNameModel, HyperlinkModel, insertModel, InsertDeleteModelArgs, getAddressInfo } from '../common/index';import { setCellFormat, sheetCreated, deleteModel, ModelType, ProtectSettingsModel, ValidationModel, setLockCells } from '../common/index';import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, UnprotectArgs, ExtendedRange } from '../common/interface';import { SaveOptions, SetCellFormatArgs, ClearOptions } from '../common/interface';import { SortOptions, BeforeSortEventArgs, SortEventArgs, FindOptions, CellInfoEventArgs, ConditionalFormatModel } from '../common/index';import { FilterEventArgs, FilterOptions, BeforeFilterEventArgs, ChartModel, getCellIndexes, getCellAddress } from '../common/index';import { setMerge, MergeType, MergeArgs, ImageModel, FilterCollectionModel, SortCollectionModel, dataChanged } from '../common/index';import { getCell, skipDefaultValue, setCell, wrap as wrapText } from './cell';import { DataBind, setRow, setColumn } from '../index';import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';import { WorkbookChart } from '../integrations/index';import { WorkbookNumberFormat } from '../integrations/number-format';import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookProtectSheet } from '../actions/index';import { WorkbookDataValidation, WorkbookMerge } from '../actions/index';import { ServiceLocator } from '../services/index';import { setLinkModel, setImage, setChart, updateView } from '../common/event';import { beginAction, completeAction, deleteChart } from '../../spreadsheet/common/event';import { WorkbookFindAndReplace } from '../actions/find-and-replace';import { WorkbookConditionalFormat } from '../actions/conditional-formatting';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Workbook
 */
export interface WorkbookModel extends ComponentModel{

    /**
     * Configures sheets and its options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      sheets: [{
     *                  name: 'First Sheet',
     *                  range: [{ dataSource: data }],
     *                  rows: [{
     *                          index: 5,
     *                          cells: [{ index: 4, value: 'Total Amount:' },
     *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
     *                  }]
     *              }, {
     *                  name: 'Second Sheet',
     *                  columns: [{ width: 180 }, { index: 4, width: 130 }]
     *              }]
     * ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @default []
     */
    sheets?: SheetModel[];

    /**
     * Specifies active sheet index in workbook.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      activeSheetIndex: 2
     * ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @default 0
     * @asptype int
     */
    activeSheetIndex?: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      height: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * It allows to enable/disable find & replace with its functionalities.
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
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      width: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
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
     * It allows you to insert rows, columns and sheets in to the spreadsheet.
     *
     * @default true
     */
    allowInsert?: boolean;

    /**
     * It allows you to delete rows, columns and sheets from spreadsheet.
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
     * It allows you to apply validation to the spreadsheet cells.
     *
     * @default true
     */
    allowDataValidation?: boolean;

    /**
     * It allows you to insert the image in spreadsheet.
     *
     * @default true
     */
    allowImage?: boolean;

    /**
     * It allows you to insert the chart in spreadsheet.
     *
     * @default true
     */
    allowChart?: boolean;

    /**
     * It allows you to apply conditional formatting to the sheet.
     *
     * @default true
     */
    allowConditionalFormat?: boolean;

    /**
     * Specifies the cell style options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *          cellStyle: { fontWeight: 'bold', fontSize: 12,
     *              fontStyle: 'italic', textIndent: '2pt'
     *              backgroundColor: '#4b5366', color: '#ffffff'
     *      },
     *      ...
     *  }, '#Spreadsheet');
     * ```
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
     * Specifies the name for a range and uses it in formula for calculation.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *      definedNames: [{ name: 'namedRange1', refersTo: 'Sheet1!A1:B5' }],
     *      ...
     *  }, '#Spreadsheet');
     * ```
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

}