import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType } from '@syncfusion/ej2-base';import { initSheet, getSheet, getSheetIndexFromId, getSheetNameCount, getMaxSheetId, getSheetIndexByName, getSheetIndex } from './sheet';import { Sheet } from './sheet';import { Event, ModuleDeclaration, merge, L10n } from '@syncfusion/ej2-base';import { DefineNameModel, HyperlinkModel } from '../common/class-model';import { getWorkbookRequiredModules } from '../common/module';import { getData, clearRange } from './index';import { SheetModel } from './sheet-model';import { CellModel } from './cell-model';import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs } from '../../spreadsheet/common/interface';import { DefineName, CellStyle, updateUsedRange, getIndexesFromAddress, localeData, workbookLocale } from '../common/index';import * as events from '../common/event';import { CellStyleModel } from '../common/index';import { setCellFormat, sheetCreated } from '../common/index';import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, SaveOptions } from '../common/interface';import { SortOptions, BeforeSortEventArgs, SortEventArgs } from '../common/interface';import { FilterEventArgs, FilterOptions, BeforeFilterEventArgs } from '../common/interface';import { getCell, skipDefaultValue, setCell } from './cell';import { DataBind, setRow } from '../index';import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter } from '../integrations/index';import { WorkbookNumberFormat } from '../integrations/number-format';import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink } from '../actions/index';import { ServiceLocator } from '../services/index';import { setLinkModel } from '../common/event';import { beginAction } from '../../spreadsheet/common/event';
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
     *                  rangeSettings: [{ dataSource: data }],
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
     * @default []
     */
    sheets?: SheetModel[];

    /**
     * Specifies active sheet tab in workbook.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      activeSheetTab: 2
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default 1
     * @asptype int
     */
    activeSheetTab?: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      height: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default '100%'
     */
    height?: string | number;

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
     * @default '100%'
     */
    width?: string | number;

    /**
     * It shows or hides the ribbon in spreadsheet.
     * @default true
     */
    showRibbon?: boolean;

    /**
     * It shows or hides the formula bar and its features.
     * @default true
     */
    showFormulaBar?: boolean;

    /**
     * It shows or hides the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.
     * @default true
     */
    showSheetTabs?: boolean;

    /**
     * It allows you to add new data or update existing cell data. If it is false, it will act as read only mode.
     * @default true
     */
    allowEditing?: boolean;

    /**
     * It allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.
     * @default true
     */
    allowOpen?: boolean;

    /**
     * It allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).
     * @default true
     */
    allowSave?: boolean;

    /**
     * It allows to enable/disable sort and its functionalities.
     * @default true
     */
    allowSorting?: boolean;

    /**
     * It allows to enable/disable filter and its functionalities.
     * @default true
     */
    allowFiltering?: boolean;

    /**
     * It allows formatting a raw number into different types of formats (number, currency, accounting, percentage, short date,
     * long date, time, fraction, scientific, and text) with built-in format codes.
     * @default true
     */
    allowNumberFormatting?: boolean;

    /**
     * It allows you to apply styles (font size, font weight, font family, fill color, and more) to the spreadsheet cells. 
     * @default true
     */
    allowCellFormatting?: boolean;

    /**
     * It allows to enable/disable Hyperlink and its functionalities.
     * @default true
     */
    allowHyperlink?: boolean;

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
     * @default {}
     */
    cellStyle?: CellStyleModel;

    /**
     * Specifies the service URL to open excel file in spreadsheet.
     * @default ''
     */
    openUrl?: string;

    /**
     * Specifies the service URL to save spreadsheet as Excel file.
     * @default ''
     */
    saveUrl?: string;

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
     * @event
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
     * @event
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
     * @event
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
     * @event
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
     * @event
     */
    beforeCellFormat?: EmitType<BeforeCellFormatArgs>;

}