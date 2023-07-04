import { CellStyleModel, ConditionalFormatModel, DefineNameModel, HyperlinkModel } from './class-model';
import { SaveType, SortOrder, FormatType, BorderType, ModelType, MergeType, ClearType, DataBar, ColorScale, IconSet } from './index';
import { Sheet, RangeModel, CellModel, SheetModel, ColumnModel, RowModel, UsedRangeModel, TopBottom, HighlightCell } from '../index';
import { CFColor, Workbook, PdfPageOrientation } from '../index';
import { DataManager, Predicate } from '@syncfusion/ej2-data';
import { Internationalization } from '@syncfusion/ej2-base';

export interface SaveOptions {
    url?: string;
    fileName?: string;
    saveType?: SaveType;
    //passWord?: string;
    pdfLayoutSettings?: pdfLayoutSettings;
}

/**
 * Specifies the PDF layout options.
 */
export interface pdfLayoutSettings {
    /** Renders the sheet data on one page. */
    fitSheetOnOnePage?: boolean;
    /** Specify the orientation for PDF exporting. By default, PDF is created in Portrait orientation. */
    orientation?: PdfPageOrientation;
}

export interface BeforeSaveEventArgs extends SaveOptions {
    customParams: Object;
    isFullPost: boolean;
    needBlobData: boolean;
    cancel: boolean;
}

export interface SaveCompleteEventArgs extends SaveOptions {
    blobData: Blob;
    status: string;
    message: string;
}
/**
 * Specifies Before second Sheet create and click arguments.
 */
export interface FindOptions {
    value: string;
    isCSen: boolean;
    isEMatch: boolean;
    mode: string;
    searchBy: string;
    findOpt: string;
    sheetIndex: number;
    replaceValue?: string;
    replaceBy?: string;
    findCount?: string;
    isAction?: boolean;
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
    cell?: HTMLElement;
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
}

/** @hidden */
export interface SetCellFormatArgs {
    style: CellStyleModel;
    range?: string | number[];
    refreshRibbon?: boolean;
    onActionUpdate?: boolean;
    cancel?: boolean;
    borderType?: BorderType;
}

/** @hidden */
export interface ExtendedRange extends RangeModel {
    info?: RangeInfo;
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
    args: { sheet: Sheet, indexes: number[] };
    cell: CellModel;
    rowIndex: number;
    colIndex: number;
    i: number;
    j: number;
    k: number;
    sRanges: number[];
    range: ExtendedRange;
    sheetIndex?: number;
}

/**
 * @hidden
 */
export interface ExtendedSheet extends Sheet {
    isLocalData?: boolean;
    lastReqIdx?: number[];
}

/**
 * Specifies before cell formatting arguments.
 */
export interface BeforeCellFormatArgs {
    range: string;
    requestType: FormatType;
    format?: string;
    style?: CellStyleModel;
    sheetIndex?: number;
    borderType?: BorderType;
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
 * Specifies the procedure for sorting.
 */
export interface SortDescriptor {
    field?: string;
    order?: SortOrder;
    sortComparer?: Function;
}

/**
 * Specifies the arguments for sorting.
 */
export interface SortEventArgs {
    range?: string;
    sortOptions?: SortOptions;
}

/**
 * Specifies the options for sorting.
 */
export interface SortOptions {
    sortDescriptors?: SortDescriptor | SortDescriptor[];
    containsHeader?: boolean;
    caseSensitive?: boolean;
}

/**
 * Specifies before sorting arguments.
 */
export interface BeforeSortEventArgs extends SortEventArgs {
    cancel?: boolean;
}

/**
 * Specifies before hyperlink create and click arguments.
 */
export interface BeforeHyperlinkArgs {
    hyperlink?: string | HyperlinkModel;

    address?: string;

    displayText?: string;

    target?: string;

    cancel?: boolean;
}

/**
 * Specifies after hyperlink create and click arguments.
 */
export interface AfterHyperlinkArgs {
    hyperlink?: string | HyperlinkModel;

    address?: string;

    displayText?: string;
}

/**
 * Specifies after cell formatting arguments.
 *
 * @hidden
 */
export interface CellFormatCompleteEvents {
    completeAction(eventArgs: BeforeCellFormatArgs, action: string): void;

}

/**
 * Specifies the arguments for filtering.
 */
export interface FilterEventArgs {
    range?: string;
    filterOptions?: FilterOptions;
}

/**
 * Specifies the options for filtering.
 */
export interface FilterOptions {
    datasource?: DataManager;
    predicates?: Predicate[];
}

/**
 * Specifies before filtering arguments.
 */
export interface BeforeFilterEventArgs extends FilterEventArgs {
    cancel?: boolean;
}

/**
 * Specifies the border options.
 */
export interface BorderOptions {
    /** Specifies the border property value to set border */
    border: string;
    /** Specifies the custom border type. */
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
}

/**
 * QueryCellInfo EventArgs
 */
export interface CellInfoEventArgs {
    /** Defines the cell model. */
    cell: CellModel;
    /** Defines the cell address. */
    address: string;
    /** Defines the row index of the cell. */
    rowIndex: number;
    /** Defines the column index of the cell. */
    colIndex: number;
    /** Defines the row element. */
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
}

/**
 * ClearOptions
 */
export interface ClearOptions {
    type?: ClearType;
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
 * Data source changed event options.
 */
export interface DataSourceChangedEventArgs {
    data?: Object[];
    action?: string;
    rangeIndex?: number;
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
 * Before cell update event properties
 */
export interface BeforeCellUpdateArgs {
    cell: CellModel;
    rowIndex: number;
    colIndex: number;
    sheet: string;
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
    isFormulaDependent?: boolean;
    skipFormatCheck?: boolean;
    isRandomFormula?: boolean;
}
/** @hidden */
export interface NumberFormatArgs {
    value: string | number;
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
}
/** @hidden */
export interface DateFormatCheckArgs {
    value: string;
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
}
/** @hidden */
export interface checkCellValid {
    value?: string;
    range?: number[];
    isCell?: boolean;
    sheetIdx?: number;
    td?: HTMLElement;
    isValid?: boolean;
}
/** @hidden */
export interface ExtendedWorkbook extends Workbook {
    viewport: { topIndex: number, bottomIndex: number, leftIndex: number, rightIndex: number };
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
 * @hidden
 */
export interface VisibleMergeIndexArgs {
    sheet: SheetModel;
    cell: CellModel;
    rowIdx: number;
    colIdx: number;
    isMergedHiddenCell?: boolean;
}
