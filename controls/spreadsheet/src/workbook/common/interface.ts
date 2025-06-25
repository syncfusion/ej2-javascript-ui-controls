import { AxisModel, CellStyleModel, ChartModel, ConditionalFormatModel, DefineNameModel, HyperlinkModel, ImageModel, SortCollectionModel } from './class-model';
import { SaveType, SortOrder, FormatType, BorderType, ModelType, MergeType, ClearType, DataBar, ColorScale, IconSet } from './index';
import { Sheet, RangeModel, CellModel, SheetModel, ColumnModel, RowModel, UsedRangeModel, TopBottom, HighlightCell } from '../index';
import { CFColor, Workbook, PdfPageOrientation, ValidationModel } from '../index';
import { DataManager, Predicate } from '@syncfusion/ej2-data';
import { Internationalization } from '@syncfusion/ej2-base';
import { PrintType } from '../../spreadsheet';

/**
 * Represents the options used to save a document.
 * These options include the file name, file type, and the URL for the save action.
 */
export interface SaveOptions {
    /**
     * Specify the URL where the document will be sent for saving.
     */
    url?: string;
    /**
     * The name of the file to be saved. This name will be used as the default file name
     * when the document is downloaded.
     */
    fileName?: string;
    /**
     * The type of the file to be saved. By default, the file will be saved in Excel format.
     *
     * Supported file types might include formats such as Excel, CSV, or PDF.
     */
    saveType?: SaveType;
    /**
     * The layout settings to use when saving a document as a PDF.
     * These settings can control aspects like page orientation (portrait or landscape)
     * or fit-to-one-page functionality.
     */
    pdfLayoutSettings?: pdfLayoutSettings;
}

/**
 * Represents the options available for printing functionality in the spreadsheet.
 * These options allow you to customize the print settings, such as selecting specific sheets
 * or including headers and gridlines.
 */
export interface PrintOptions {
    /**
     * Determines what part of the spreadsheet should be printed.
     *
     * Values:
     * - **"Worksheet"**: Prints only the active worksheet.
     * - **"Workbook"**: Prints the entire workbook (all sheets).
     *
     */
    type?: PrintType;

    /**
     * Specifies whether to include row and column headers (like A, B, C for columns and 1, 2, 3 for rows)
     * in the printed output.
     *
     * - **true**: Includes row and column headers in the printout.
     * - **false**: Excludes row and column headers from the printout.
     *
     */
    allowRowColumnHeader?: boolean;

    /**
     * Specifies whether to include gridlines in the printed output.
     *
     * Gridlines are the light gray lines that separate cells in the spreadsheet.
     *
     * - **true**: Prints the sheet with gridlines.
     * - **false**: Prints the sheet without gridlines.
     *
     */
    allowGridLines?: boolean;
}

/**
 * Represents layout options for PDF export.
 * These options allow you to customize how the content is arranged in the PDF.
 */
export interface pdfLayoutSettings {
    /**
     * Determines whether the content should fit into a single page in the PDF.
     *
     * - **true**: Content will automatically scale to fit within one page.
     * - **false**: Content may span across multiple pages if it doesn’t fit.
     *
     */
    fitSheetOnOnePage?: boolean;
    /**
     * Specifies the page orientation for the PDF.
     *
     * Values:
     * - **"portrait"**: The PDF pages will be in vertical orientation (default).
     * - **"landscape"**: The PDF pages will be in horizontal orientation.
     *
     */
    orientation?: PdfPageOrientation;
}

/**
 * Represents the event arguments triggered before the save action is performed.
 */
export interface BeforeSaveEventArgs extends SaveOptions {
    /**
     * Specifies custom parameters that need to be included in the save request.
     * These parameters will be sent along with the save action request to the server.
     */
    customParams: Object;

    /**
     * Determines whether a full post-back is required for the save action.
     */
    isFullPost: boolean;

    /**
     * Specifies whether the spreadsheet should be generated as `blobData` or not.
     *
     * - **true**: Generates the spreadsheet data as a `Blob` object, which can be used for custom handling
     *   (e.g., downloading, uploading to a server, or storing in memory).
     * - **false**: The spreadsheet will not be generated as `blobData`.
     *
     */
    needBlobData: boolean;

    /**
     * Specifies whether the save action should be canceled.
     *
     * - **true**: Cancels the save action and stops further execution.
     * - **false**: Proceeds with the save action as normal.
     *
     */
    cancel: boolean;

    /**
     * Automatically detects the number format for cells, if enabled.
     */
    autoDetectFormat?: boolean;
}

/**
 * Represents the event arguments triggered after the save action completes.
 */
export interface SaveCompleteEventArgs extends SaveOptions {
    /**
     * Specifies the spreadsheet data that is saved as a `Blob`.
     * A `Blob` is a binary large object that can represent the file data in memory.
     * This can be used for operations like downloading, uploading, or storing the data.
     */
    blobData: Blob;

    /**
     * Specifies the status of the save action after it completes.
     */
    status: string;

    /**
     * Specifies the message returned after the save action completes.
     * This message provides additional information about the result of the save operation.
     * It could be a success confirmation message or an error description.
     */
    message: string;
}

/**
 * Specifies the options for performing a find and replace action in the spreadsheet.
 * These options control how and where the search operation is executed, as well as how to replace values.
 */
export interface FindOptions {
    /**
     * Specifies the value to find in the spreadsheet.
     * This is the text or number that you want to search for within the cells.
     */
    value: string;

    /**
     * Specifies whether to match the case when finding the value.
     *
     * - **true**: The search will be case-sensitive.
     * - **false**: The search will be case-insensitive.
     *
     */
    isCSen: boolean;

    /**
     * Specifies whether to match the entire cell content or a substring of the cell content.
     *
     * - **true**: The search will match only the entire content of the cell.
     * - **false**: The search will match any part of the cell content (substring search).
     *
     */
    isEMatch: boolean;

    /**
     * Specifies whether to search for the value within the current sheet or the entire workbook.
     *
     * - **"Sheet"**: Searches only within the current active sheet.
     * - **"Workbook"**: Searches across all sheets in the workbook.
     *
     */
    mode: string;

    /**
     * Specifies whether to search for the value by row or by column.
     *
     * - **"Row"**: Searches row by row (horizontally).
     * - **"Column"**: Searches column by column (vertically).
     *
     */
    searchBy: string;

    /**
     * Specifies the option to find the previous or next match of the value.
     *
     * - **"Next"**: Finds the next occurrence of the value.
     * - **"Previous"**: Finds the previous occurrence of the value.
     *
     */
    findOpt: string;

    /**
     * Specifies the index of the sheet to search for the value.
     * This refers to the sheet number (0-based index) where the search should begin.
     *
     */
    sheetIndex: number;

    /**
     * Specifies the value to replace the found value with.
     * This is used when performing the replace operation.
     *
     */
    replaceValue?: string;

    /**
     * Specifies whether to replace the first match or all matches of the found value.
     *
     * - **"First"**: Replaces only the first found value.
     * - **"All"**: Replaces all occurrences of the found value.
     *
     */
    replaceBy?: string;

    /**
     * Specifies the count of occurrences of the found value.
     * This is the number of times the search value appears in the sheet or workbook.
     *
     */
    findCount?: string;

    /**
     * Specifies whether to return the match after the find action.
     *
     * - **true**: Returns the matching value after the find operation.
     * - **false**: Does not return any match.
     *
     */
    isAction?: boolean;

    /**
     * Specifies whether to display the find and replace dialog.
     *
     * - **true**: Displays the find and replace dialog for user interaction.
     * - **false**: Does not display the dialog.
     *
     */
    showDialog?: boolean;
}

/**@hidden */
export interface FindOptionsArgs extends FindOptions {
    localeObj?: LocaleNumericSettings;
}
/**@hidden */
export interface  ReplaceAllEventArgs {
    addressCollection: string[];
    cancel?: boolean;
}
/**
 * Specifies FindAll options in arguments.
 */
export interface FindAllArgs {
    value: string;
    mode?: string;
    sheetIndex?: number;
    isCSen?: boolean;
    isEMatch?: boolean;
    findCollection?: string[];
}

export interface InvalidFormula {
    value: string;
    skip: boolean;
}

/**
 * Specifies find next arguments.
 */
export interface FindNext {
    rowIndex: number; colIndex: number; endRow: number; endColumn: number; startRow: number; usedRange?: UsedRangeModel; mode: string;
    loopCount: number; count: number; args?: FindOptions; val: string; stringValue: string; sheetIndex: number; startColumn: number;
    sheets: SheetModel[];
}
/**
 * Specifies find previous arguments.
 */
export interface FindPrevious {
    rowIndex: number; colIndex: number; endRow: number; endColumn: number; startRow: number;
    loopCount: number; count: number; args: FindOptions; val: string; stringValue: string; sheetIndex: number; startColumn: number;
    sheets: SheetModel[];
}
/**@hidden */
export interface ReplaceEventArgs {
    address: string;
    compareValue: string;
    replaceValue: string;
}
/**@hidden */
export interface BeforeReplaceEventArgs extends ReplaceEventArgs {
    cancel: boolean;
}
/**
 * @hidden
 */
export interface ToolbarFind {
    findOption?: string;
    countArgs?: { countOpt: string, findCount: string };
}

/** @hidden */
export interface CellFormatArgs {
    style: CellStyleModel;
    rowIdx: number;
    colIdx: number;
    td?: HTMLElement;
    pCell?: HTMLElement;
    row?: HTMLElement;
    hRow?: HTMLElement;
    pRow?: HTMLElement;
    pHRow?: HTMLElement;
    lastCell?: boolean;
    isHeightCheckNeeded?: boolean;
    manualUpdate?: boolean;
    onActionUpdate?: boolean;
    first?: string;
    checkHeight?: boolean;
    outsideViewport?: boolean;
    formatColor?: string;
    isFromAutoFillOption?: boolean;
    rowHeight?: number;
    mergeBorderRows?: number[];
    prevCell?: HTMLElement;
}

/** @hidden */
export interface SetCellFormatArgs {
    style: CellStyleModel;
    range?: string | number[];
    refreshRibbon?: boolean;
    onActionUpdate?: boolean;
    cancel?: boolean;
    borderType?: BorderType;
    isUndoRedo?: boolean;
}

/** @hidden */
export interface ExtendedRange extends RangeModel {
    info?: RangeInfo;
}

/** @hidden */
export interface ExtendedImageModel extends ImageModel {
    preservePos?: boolean;
}

/** @hidden */
export interface CellStyleExtendedModel extends CellStyleModel {
    properties?: CellStyleModel;
    bottomPriority?: boolean;
}

interface RangeInfo {
    loadedRange?: number[][];
    insertRowRange?: number[][];
    insertColumnRange?: number[][];
    deleteColumnRange?: number[][];
    count?: number;
    fldLen?: number;
    flds?: string[];
}

/** @hidden */
export interface AutoDetectInfo {
    value: string;
    sheet: SheetModel;
    cell: CellModel;
    rowIndex: number;
    colIndex: number;
    sheetIndex: number;
}

/**
 * @hidden
 */
export interface ExtendedSheet extends Sheet {
    isLocalData?: boolean;
    lastReqIdx?: number[];
    isImportProtected?: boolean;
    validations?: ValidationModel[];
}

/**
 * Specifies the event arguments triggered before applying cell formatting in the spreadsheet.
 * This allows users to customize the formatting behavior before it is applied to the selected cells.
 */
export interface BeforeCellFormatArgs {
    /**
     * Specifies the range of cells to which the cell formatting should be applied.
     * This is a string representing the range (e.g., "A1:C3", "B2", etc.).
     * The range can be a single cell or a block of cells.
     */
    range: string;

    /**
     * Specifies the type of request: whether it is a cell format or a number format.
     *
     * - **"CellFormat"**: The request is for cell formatting (e.g., font, background color).
     * - **"NumberFormat"**: The request is for number formatting (e.g., currency, date format).
     *
     */
    requestType: FormatType;

    /**
     * Specifies the format to be applied when applying number formatting.
     * This is relevant only when `requestType` is set to "Number".
     * The format could be any standard number format (e.g., "Currency", "Percentage", etc.).
     */
    format?: string;

    /**
     * Specifies the styles to be applied during cell formatting.
     * This object contains styling properties such as font, color, borders, etc.
     */
    style?: CellStyleModel;

    /**
     * Specifies the sheet index where the cell formatting is to be applied.
     * The index corresponds to the position of the sheet in the workbook (0-based index).
     */
    sheetIndex?: number;

    /**
     * Specifies the border type to be applied during the cell formatting.
     * This can be one of the following types:
     * - **"Inner"**: Applies the border inside the selected range.
     * - **"Outer"**: Applies the border outside the selected range.
     * - **"Vertical"**: Applies the border vertically between columns.
     * - **"Horizontal"**: Applies the border horizontally between rows.
     *
     */
    borderType?: BorderType;

    /**
     * Specifies whether to cancel the cell or number formatting.
     * If set to `true`, the formatting action is canceled and not applied to the selected range.
     * If set to `false`, the formatting is applied as requested.
     */
    cancel?: boolean;
}

/** @hidden */
export interface AggregateArgs {
    Count: number;
    Sum?: string;
    Avg?: string;
    Min?: string;
    Max?: string;
    countOnly?: boolean;
}

/**
 * Specifies the criteria for sorting in a spreadsheet.
 */
export interface SortDescriptor {
    /**
     * Specifies the column by which to sort.
     * This is the name of the column or field on which sorting should be applied.
     */
    field?: string;

    /**
     * Specifies the sort order.
     * - **Ascending**: Sorts the data from smallest to largest (A-Z, 1-10).
     * - **Descending**: Sorts the data from largest to smallest (Z-A, 10-1).
     */
    order?: SortOrder;

    /**
     * Specifies a function used to customize the sorting logic.
     * You can use this function to define custom sorting rules beyond basic ascending or descending order.
     */
    sortComparer?: Function;
}

/**
 * Specifies the event arguments after sorting completes.
 */
export interface SortEventArgs {
    /**
     * Specifies the range of cells that were sorted.
     * This defines the area in the spreadsheet that was affected by the sorting operation.
     */
    range?: string;

    /**
     * Specifies the sorting options that were used.
     * This could include which columns were sorted, the sort order, and whether headers were considered.
     */
    sortOptions?: SortOptions;

    /**
     * Specifies the previous sort collection model.
     * This is used to track the previous sorting state before the current operation.
     */
    previousSort?: SortCollectionModel | SortCollectionModel[];
}

/**
 * Specifies the options for sorting in a spreadsheet.
 */
export interface SortOptions {
    /**
     * Specifies the descriptors (criteria) for sorting.
     * This can be a single descriptor or an array of descriptors if multiple columns need to be sorted.
     */
    sortDescriptors?: SortDescriptor | SortDescriptor[];

    /**
     * Specifies whether the range being sorted contains headers.
     * If set to `true`, the first row of the range is considered as headers and will not be sorted.
     */
    containsHeader?: boolean;

    /**
     * Specifies whether the sorting operation should be case-sensitive.
     * ```
     */
    caseSensitive?: boolean;
}

/**
 * Specifies the event arguments before the sorting operation begins.
 */
export interface BeforeSortEventArgs extends SortEventArgs {
    /**
     * Specifies whether the sorting operation should be prevented.
     * If set to `true`, the sorting will not proceed.
     */
    cancel?: boolean;
}

/**
 * Specifies arguments before a hyperlink is created or clicked.
 */
export interface BeforeHyperlinkArgs {
    /**
     * Specifies the hyperlink reference.
     * This can either be a URL string (e.g., "https://example.com") or a `HyperlinkModel` object for more advanced configurations.
     */
    hyperlink?: string | HyperlinkModel;

    /**
     * Specifies the range of cells where the hyperlink should be added.
     */
    address?: string;

    /**
     * Specifies the text to be displayed for the hyperlink.
     * If no text is provided, the current value of the cell is displayed by default.
     */
    displayText?: string;

    /**
     * Specifies the target window or frame where the hyperlink will open.
     * Common values:
     * - `_blank`: Opens in a new tab or window.
     * - `_self`: Opens in the same tab or window.
     * - `_parent`: Opens in the parent frame.
     * - `_top`: Opens in the topmost frame.
     * - Custom frame name.
     */
    target?: string;

    /**
     * Specifies whether the action of opening the hyperlink should be canceled.
     * If set to `true`, the action will be stopped.
     */
    cancel?: boolean;
}

/**
 * Specifies arguments after a hyperlink is created or clicked.
 */
export interface AfterHyperlinkArgs {
    /**
     * Specifies the hyperlink reference.
     * This can either be a URL string (e.g., "https://example.com") or a `HyperlinkModel` object.
     */
    hyperlink?: string | HyperlinkModel;

    /**
     * Specifies the range of cells where the hyperlink was added.
     */
    address?: string;

    /**
     * Specifies the text displayed for the hyperlink.
     * If no text is provided, the current value of the cell is displayed by default.
     */
    displayText?: string;
}

/**
 * Specifies the event triggered after cell formatting is completed.
 *
 * @hidden
 */
export interface CellFormatCompleteEvents {
    completeAction(eventArgs: BeforeCellFormatArgs, action: string): void;

}

/**
 * Specifies the arguments used for filtering operations.
 */
export interface FilterEventArgs {
    /**
     * Specifies the range of cells where filtering is applied.
     */
    range?: string;

    /**
     * Specifies the options for filtering, such as the data source and filter conditions.
     */
    filterOptions?: FilterOptions;
}

/**
 * Specifies the options available for filtering data.
 */
export interface FilterOptions {
    /**
     * Specifies the data source to be filtered.
     * This can be an external data source managed by a `DataManager` object.
     */
    datasource?: DataManager;

    /**
     * Specifies the filter conditions (predicates) for filtering data.
     */
    predicates?: Predicate[];

    /**
     * Specifies groups of predicates that are combined using OR logic.
     * This allows filtering based on multiple sets of conditions.
     */
    equalOrPredicates?: Predicate[][];
}

/**
 * Specifies the arguments before a filtering operation starts.
 */
export interface BeforeFilterEventArgs extends FilterEventArgs {
    /**
     * Specifies whether the filtering operation should be canceled.
     * If set to `true`, the filtering will not proceed.
     */
    cancel?: boolean;
}

/**
 * Specifies the options for applying borders to cells.
 */
export interface BorderOptions {
    /**
     * Specifies the CSS-style border value to apply.
     */
    border: string;

    /**
     * Specifies the type of border to apply.
     * Common types:
     * - `Inner`: Applies borders to the inside edges of the range.
     * - `Outer`: Applies borders to the outer edges of the range.
     * - `Horizontal`: Applies borders between rows.
     * - `Vertical`: Applies borders between columns.
     */
    type: BorderType;
}

/** @hidden */
export interface InsertDeleteModelArgs {
    model: SheetModel;
    start?: number | RowModel[] | ColumnModel[] | SheetModel[];
    end?: number;
    isAction?: boolean;
    modelType: ModelType;
    insertType?: string;
    columnCellsModel?: RowModel[];
    activeSheetIndex?: number;
    checkCount?: number;
    definedNames?: DefineNameModel[];
    isUndoRedo?: boolean;
    refreshSheet?: boolean;
    conditionalFormats?: ConditionalFormatModel[];
    prevAction?: string;
    freezePane?: boolean;
    isRedo?: boolean;
}

/**
 * Specifies the arguments for querying cell information in the spreadsheet.
 */
export interface CellInfoEventArgs {
    /**
     * Defines the cell model object.
     * The `CellModel` contains information about the cell's properties, such as value, formatting, formula, and more.
     * ```
     */
    cell: CellModel;

    /**
     * Defines the address of the cell.
     * The address represents the location of the cell in the spreadsheet in "A1" notation.
     */
    address: string;

    /**
     * Defines the row index of the cell.
     * This is a zero-based index, meaning the first row starts at `0`.
     * ```
     */
    rowIndex: number;

    /**
     * Defines the column index of the cell.
     * This is a zero-based index, meaning the first column starts at `0`.
     */
    colIndex: number;

    /**
     * Defines the HTML element for the row in which the cell exists.
     * This is optional and is useful when working with the rendered DOM elements of the spreadsheet.
     */
    row?: HTMLElement;
}

/** @hidden */
export interface MergeArgs {
    range: string | number[];
    merge?: boolean;
    isAction?: boolean;
    type?: MergeType;
    isActiveCell?: boolean;
    activeCell?: number[];
    selectedRange?: number[];
    skipChecking?: boolean;
    model?: RowModel[];
    insertCount?: number;
    deleteCount?: number;
    insertModel?: ModelType;
    preventRefresh?: boolean;
    refreshRibbon?: boolean;
    sheetIndex?: number;
    mergeCollection?: number[][]
}

/**
 * Specifies the options to clear contents, formats, and hyperlinks in the spreadsheet.
 */
export interface ClearOptions {
    /**
     * Specifies the type of clearing action to be performed.
     *
     * The `type` property can take one of the following values:
     * - `Clear Contents` - Clears only the data or content within the cells.
     * - `Clear Formats` - Clears only the formatting (e.g., font styles, colors, borders) applied to the cells.
     * - `Clear Hyperlinks` - Removes only the hyperlinks in the cells while retaining their content and formatting.
     * - `Clear All` - Clears all content, formatting, and hyperlinks from the specified range.
     *
     */
    type?: ClearType;

    /**
     * Specifies the range of cells to be cleared in the spreadsheet.
     */
    range?: string;
}

/** @hidden */
export interface UnprotectArgs {
    sheet?: number;
}

/**
 * Insert event options.
 *
 * @hidden
 */
export interface InsertDeleteEventArgs {
    model?: RowModel[] | ColumnModel[] | CellModel[];
    sheet?: SheetModel;
    index?: number;
    modelType?: ModelType;
    insertType?: string;
    isAction?: boolean;
    startIndex?: number;
    endIndex?: number;
    deletedModel?: RowModel[] | ColumnModel[] | CellModel[] | SheetModel[];
    deletedCellsModel?: RowModel[];
    activeSheetIndex?: number;
    sheetCount?: number;
    isInsert?: boolean;
    freezePane?: boolean;
    definedNames?: DefineNameModel[];
    isMethod?: boolean;
    isUndoRedo?: boolean;
    refreshSheet?: boolean;
    cancel?: boolean;
    name?: string;
    isDelete?: boolean;
    forceUpdate?: boolean;
}

/**
 * Action begin event options.
 *
 * @hidden
 */
export interface ActionEventArgs {
    eventArgs: object;
    action: string;
    isUndo?: boolean;
    isRedo?: boolean;
    preventAction?: boolean
}

/**
 * CFormattingEventArgs
 *
 * @hidden
 */
export interface CFormattingEventArgs {
    range?: string;
    type?: HighlightCell | TopBottom | DataBar | ColorScale | IconSet;
    cFColor?: CFColor;
    value?: string;
    sheetIdx?: number;
    cancel: boolean;
}

/**
 * Specifies event arguments when the datasource changes.
 */
export interface DataSourceChangedEventArgs {
    /**
     * Specifies the changed data from the datasource after an add, edit, or delete action.
     */
    data?: Object[];

    /**
     * Specifies the action performed to change the datasource, such as add, edit, or delete.
     */
    action?: string;

    /**
     * Specifies the range index of the changed datasource.
     * The `rangeIndex` represents the index of the data range in the spreadsheet that corresponds to the modified data.
     */
    rangeIndex?: number;

    /**
     * Specifies the index of the sheet where the datasource change occurred.
     */
    sheetIndex?: number;
}

/**
 * Specifies the defineName arguments.
 *
 * @hidden
 */
export interface DefinedNameEventArgs {
    name?: string;
    scope?: string;
    comment?: string;
    refersTo?: string;
    cancel: boolean;
}

/** @hidden */
export interface ExtendedRowModel extends RowModel {
    isFiltered?: boolean;
}

/** @hidden */
export interface ExtendedCellModel extends CellModel {
    template?: string;
}

/**
 * Specifies the event arguments for before cell update event.
 */
export interface BeforeCellUpdateArgs {
    /**
     * Specifies the cell to be updated.
     * This property holds the cell's model object, which contains all the properties and data associated with the cell being updated.
     */
    cell: CellModel;

    /**
     * Specifies the row index of the cell.
     */
    rowIndex: number;

    /**
     * Specifies the column index of the cell.
     * This property represents the zero-based index of the column where the cell is located.
     */
    colIndex: number;

    /**
     * Specifies the name of the sheet.
     * This property indicates the name of the sheet where the cell is located.
     */
    sheet: string;

    /**
     * Specifies whether to cancel the cell update.
     * If this property is set to `true`, the update to the cell will be canceled, and no changes will be applied.
     */
    cancel: boolean;
}

/** @hidden */
export interface CellUpdateArgs {
    cell: CellModel;
    rowIdx: number;
    colIdx: number;
    preventEvt?: boolean;
    pvtExtend?: boolean;
    valChange?: boolean;
    uiRefresh?: boolean;
    td?: HTMLElement;
    lastCell?: boolean;
    checkCF?: boolean;
    checkWrap?: boolean;
    eventOnly?: boolean;
    requestType?: string;
    cellDelete?: boolean;
    mergedCells?: boolean;
    isFormulaDependent?: boolean;
    skipFormatCheck?: boolean;
    isRandomFormula?: boolean;
    isDelete?: boolean;
    deletedRange?: number[];
    fillType?: string;
}
/** @hidden */
export interface NumberFormatArgs {
    value?: string | number;
    format?: string;
    type?: string;
    rowIndex?: number;
    colIndex?: number,
    cell?: CellModel;
    sheetIndex?: number;
    result?: string;
    isRightAlign?: boolean;
    isRowFill?: boolean;
    formattedText?: string;
    curSymbol?: string;
    td?: HTMLElement;
    checkDate?: boolean;
    dateObj?: Date;
    color?: string;
    dataUpdate?: boolean;
    formatApplied?: boolean;
    skipFormatCheck?: boolean;
    refresh?: boolean;
    isEdit?: boolean;
    onLoad?: boolean;
}
/** @hidden */
export interface DateFormatCheckArgs {
    value?: string | number;
    cell?: CellModel;
    rowIndex?: number;
    colIndex?: number;
    sheetIndex?: number;
    isDate?: boolean;
    isTime?: boolean;
    dateObj?: Date;
    updatedVal?: string;
    isEdit?: boolean;
    intl?: Internationalization;
    skipCellFormat?: boolean;
    updateValue?: boolean;
    curSymbol?: string;
    format?: string;
}
/** @hidden */
export interface AutoDetectGeneralFormatArgs {
    args?: NumberFormatArgs & DateFormatCheckArgs;
    fResult?: string;
    intl?: Internationalization;
    isRightAlign?: boolean;
    cell?: CellModel;
    rowIdx?: number;
    colIdx?: number;
    sheet?: SheetModel;
    cellVal?: string;
    prevVal?: string;
}
/** @hidden */
export interface CheckCellValidArgs {
    value?: string;
    range?: number[];
    isEdit?: boolean;
    sheetIdx?: number;
    td?: HTMLElement;
    isValid?: boolean;
    cell?: CellModel;
}
/** @hidden */
export interface ExtendedWorkbook extends Workbook {
    viewport?: { topIndex: number, bottomIndex: number, leftIndex: number, rightIndex: number };
    workbookOpenModule?: { preventFormatCheck: boolean };
    scrollSettings?: { isFinite: boolean, enableVirtualization: boolean };
    allowWrap?: boolean;
}
/** @hidden */
export interface ApplyCFArgs {
    indexes?: number[];
    cell?: CellModel;
    ele?: HTMLElement;
    cfModel?: ConditionalFormatModel[];
    isAction?: boolean;
    prevVal?: string;
    isRender?: boolean;
    refreshAll?: boolean;
    isEdit?: boolean;
    resizedRowHeight?: number;
    mergeArgs?: { range: number[] };
}
/** @hidden */
export interface CFArgs {
    range?: string | number[];
    sheetIdx?: number;
    isFromUpdateAction?: boolean;
    isAction?: boolean;
    isClear?: boolean;
    isUndo?: boolean;
    isUndoRedo?: boolean;
    cfModel?: ConditionalFormatModel;
    oldCFModel?: ConditionalFormatModel[];
    updatedCFModel?: ConditionalFormatModel[];
    cfClearActionArgs?: object;
}
/**@hidden */
export interface FindArgs {
    startRow: number;
    startCol: number;
    endRow?: number;
    endCol?: number;
    findVal: string;
    sheet?: SheetModel;
    activeCell: number[];
    sheetIdx?: number;
    sheets?: SheetModel[];
}
/**
 * Specifies the arguments for `setVisibleMergeIndex` method.
 *
 * @hidden
 */
export interface VisibleMergeIndexArgs {
    sheet: SheetModel;
    cell: CellModel;
    rowIdx: number;
    colIdx: number;
    isMergedHiddenCell?: boolean;
}

/**@hidden */
export interface LocaleNumericSettings {
    decimal: string;
    group: string;
    timeSeparator: string;
    dateSeparator: string;
    am?: string;
    pm?: string;
    percentSign?: string;
    timeFormat?: string;
}

/**@hidden */
export interface FilterPredicateOptions {
    predicates: Predicate[];
    equalOrPredicates: Predicate[][];
}

/**@hidden */
export interface LocalizedFormatActionArgs {
    action?: string;
    format?: string;
    defaultFormats?: string[];
    localizedFormats?: string[];
    curSym?: string,
    decimalGroupSepsChanged?: boolean;
    curChanged?: boolean;
    defaultFormat?: string;
}

/**
 * Defines options to exclude specific features from the JSON data during loading or saving.
 */
export interface SerializationOptions {
    /**
     * Specifies whether to include only values when loading or saving JSON data.
     */
    onlyValues?: boolean;
    /**
     * Specifies whether to exclude styles when loading or saving JSON data.
     */
    ignoreStyle?: boolean;
    /**
     * Specifies whether to exclude formulwhen loading or saving JSON data.
     */
    ignoreFormula?: boolean;
    /**
     * Specifies whether to exclude number formats when loading or saving JSON data.
     */
    ignoreFormat?: boolean;
    /**
     * Specifies whether to exclude conditional formatting when loading or saving JSON data.
     */
    ignoreConditionalFormat?: boolean;
    /**
     * Specifies whether to exclude data validation rules when loading or saving JSON data.
     */
    ignoreValidation?: boolean;
    /**
     * Specifies whether to exclude freeze panes when loading or saving JSON data.
     */
    ignoreFreezePane?: boolean;
    /**
     * Specifies whether to exclude text wrap settings when loading or saving JSON data.
     */
    ignoreWrap?: boolean;
    /**
     * Specifies whether to exclude charts when loading or saving JSON data.
     */
    ignoreChart?: boolean;
    /**
     * Specifies whether to exclude images when loading or saving JSON data.
     */
    ignoreImage?: boolean;
    /**
     * Specifies whether to exclude notes when loading or saving JSON data.
     */
    ignoreNote?: boolean;
}

/**
 * Provides options to control how an Excel file is parsed and loaded into the Spreadsheet during open operations.
 * These settings help improve performance and customize the import behavior.
 */
export interface WorkbookParseOptions {
    /**
     * Indicates whether to ignore cell styles (fonts, colors, borders, etc.) during file open.
     * Improves performance by skipping style parsing.
     */
    ignoreStyle?: boolean;

    /**
     * Indicates whether to ignore number and date/time formats.
     * If true, raw values are loaded without applying display formatting.
     */
    ignoreFormat?: boolean;
}

/** @hidden */
export interface ExtendedChartModel extends ChartModel {
    enableCanvas?: boolean;
}

/** @hidden */
interface MajorTickLinesModel {
    /**
     * Specifies the width of the major tick lines, in pixels.
     *
     * @default 1
     */
    width?: number;
}

/** @hidden */
interface LabelStyleModel {
    /**
     * Specifies the font size of the axis labels.
     *
     * @default '16px'
     */
    size?: string;
}


/** @hidden */
export interface ExtendedAxisModel extends AxisModel {
    majorTickLines?: MajorTickLinesModel;
    labelStyle?: LabelStyleModel;
}

/** @hidden */
export interface FormulaCalculateArgs {
    rowIndex?: number;
    colIndex?: number;
    value?: string;
    isFormula?: boolean;
    sheetIndex?: number;
    isRefreshing?: boolean;
    isDependentRefresh?: boolean;
    isRandomFormula?: boolean;
    isClipboard?: boolean
    isFormulaDependent?: boolean;
    sheet?: SheetModel;
    isDelete?: boolean;
    deletedRange?: number[];
    fillType?: string;
    action?: string;
}

