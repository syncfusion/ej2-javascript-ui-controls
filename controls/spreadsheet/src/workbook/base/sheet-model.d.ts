import { Workbook } from './workbook';import { Query, DataManager } from '@syncfusion/ej2-data';import { RowModel } from './row-model';import { ColumnModel } from './column-model';import { processIdx } from './data';import { SheetState, ProtectSettingsModel, ConditionalFormat, ConditionalFormatModel, ExtendedRange, getCellIndexes, moveOrDuplicateSheet, workbookFormulaOperation, duplicateSheetFilterHandler } from '../common/index';import { ProtectSettings, getCellAddress } from '../common/index';import { isUndefined, ChildProperty, Property, Complex, Collection, extend } from '@syncfusion/ej2-base';import { WorkbookModel } from './workbook-model';

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Specifies the data as JSON / Data manager to the sheet.
     *
     * @default null
     */
    dataSource?: Object[] | DataManager;

    /**
     * Specifies the start cell from which the datasource will be populated.
     *
     * @default 'A1'
     */
    startCell?: string;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     *
     * @default null
     */
    query?: Query;

    /**
     * Show/Hide the field of the datasource as header.
     *
     * @default true
     */
    showFieldAsHeader?: boolean;

    /**
     * Template helps to compiles the given HTML String (or HTML Element ID) into HtML Element and append to the Cell.
     *
     *  @default ''
     *  @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the address for updating the dataSource or template.
     *
     * @default 'A1'
     */
    address?: string;

}

/**
 * Interface for a class UsedRange
 */
export interface UsedRangeModel {

    /**
     * Specifies the last used row index of the sheet.
     *
     * @default 0
     * @asptype int
     */
    rowIndex?: number;

    /**
     * Specifies the last used column index of the sheet.
     *
     * @default 0
     * @asptype int
     */
    colIndex?: number;

}

/**
 * Interface for a class Sheet
 */
export interface SheetModel {

    /**
     * Represents sheet unique id.
     *
     * @default 0
     * @hidden
     */
    id?: number;

    /**
     * Configures row and its properties for the sheet.
     *
     * @default null
     */
    rows?: RowModel[];

    /**
     * Configures column and its properties for the sheet.
     *
     * @default null
     */
    columns?: ColumnModel[];

    /**
     * Configures protect and its options.
     *
     * @default { selectCells: false, formatCells: false, formatRows: false, formatColumns: false, insertLink: false  }
     */
    protectSettings?: ProtectSettingsModel;

    /**
     * Specifies the collection of range for the sheet.
     *
     * @default []
     */
    ranges?: RangeModel[];

    /**
     * Specifies the conditional formatting for the sheet.
     *
     * @default []
     */
    conditionalFormats?: ConditionalFormatModel[];

    /**
     * Specifies index of the sheet. Based on the index, sheet properties are applied.
     *
     * @default 0
     * @asptype int
     */
    index?: number;

    /**
     * Specifies the name of the sheet, the name will show in the sheet tabs.
     *
     * @default ''
     */
    name?: string;

    /**
     * Defines the number of rows to be rendered in the sheet.
     *
     * @default 100
     * @asptype int
     */
    rowCount?: number;

    /**
     * Defines the number of columns to be rendered in the sheet.
     *
     * @default 100
     * @asptype int
     */
    colCount?: number;

    /**
     * Specifies selected range in the sheet.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet: Spreadsheet = new Spreadsheet({
     *      sheets: [{
     *                selectedRange: 'A1:B5'
     *          }],
     *      ...
     * });
     * spreadsheet.appendTo('#Spreadsheet');
     * ```
     *
     * @default 'A1:A1'
     */
    selectedRange?: string;

    /**
     * Specifies active cell within `selectedRange` in the sheet.
     *
     * @default 'A1'
     */
    activeCell?: string;

    /**
     * Defines the used range of the sheet.
     *
     * @default { rowIndex: 0, colIndex: 0 }
     */
    usedRange?: UsedRangeModel;

    /**
     * Specified cell will be positioned at the upper-left corner of the sheet.
     *
     * @default 'A1'
     */
    topLeftCell?: string;

    /**
     * Specifies to show / hide column and row headers in the sheet.
     *
     * @default true
     */
    showHeaders?: boolean;

    /**
     * Specifies to show / hide grid lines in the sheet.
     *
     * @default true
     */
    showGridLines?: boolean;

    /**
     * Specifies to  protect the cells in the sheet.
     *
     * @default false
     */
    isProtected?: boolean;

    /**
     * Specifies the sheet visibility state. There must be at least one visible sheet in Spreadsheet.
     *
     * @default 'Visible'
     */
    state?: SheetState;

    /**
     * Gets or sets the number of frozen rows.
     *
     * @default 0
     * @asptype int
     */
    frozenRows?: number;

    /**
     * Gets or sets the number of frozen columns.
     *
     * @default 0
     * @asptype int
     */
    frozenColumns?: number;

    /**
     * Represents the maximum row height collection.
     *
     * @default []
     * @hidden
     */
    maxHgts?: object[];

    /**
     * Represents the freeze pane top left cell. Its default value would be based on the number of freeze rows and columns.
     *
     * @default 'A1'
     */
    paneTopLeftCell?: string;

    /**
     * Specifies the password.
     *
     * @default ''
     */
    password?: string;

}