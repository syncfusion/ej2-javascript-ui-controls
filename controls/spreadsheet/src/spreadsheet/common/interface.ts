import { CellModel, BeforeSortEventArgs, SheetModel, ImageModel, ChartType, ConditionalFormatModel, AutoFillDirection, AutoFillType, ChartModel, MarkerSettingsModel } from './../../workbook/index';
import { ValidationType, ValidationOperator, MergeArgs, InsertDeleteEventArgs, HyperlinkModel } from './../../workbook/index';
import { Spreadsheet, RefreshType } from '../index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BaseEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { CellInfoEventArgs, CFColor, ChartTheme, RowModel, CellStyleModel, WorkbookOpen } from './../../workbook/index';
import { SortCollectionModel, ValidationModel } from './../../workbook/index';
import { PredicateModel } from '@syncfusion/ej2-grids';


/**
 * Interface for renderer module
 *
 * @hidden
 */
export interface IRenderer {
    colGroupWidth: number;
    contentPanel: HTMLElement;
    renderPanel(): void;
    getRowHeaderPanel(): Element;
    getColHeaderPanel(): Element;
    getContentPanel(): HTMLElement;
    getSelectAllContent(): HTMLElement;
    getScrollElement(): HTMLElement;
    getSelectAllTable(): HTMLTableElement;
    getContentTable(): HTMLTableElement;
    getColHeaderTable(): HTMLTableElement;
    getRowHeaderTable(): HTMLTableElement;
    renderTable(args: SheetRenderArgs): void;
    refreshRowContent(args: SheetRenderArgs): void;
    refreshColumnContent(args: SheetRenderArgs): void;
    updateRowContent(args: SheetRenderArgs): void;
    updateColContent(args: SheetRenderArgs): void;
    updateCol(sheet: SheetModel, idx: number, appendTo?: Node): Element;
    showHideHeaders(): void;
    getRowHeaderWidth(sheet: SheetModel, skipFreezeCheck?: boolean, addScaling?: boolean): number;
    getColHeaderHeight(sheet: SheetModel, skipHeader?: boolean): number
    setPanelWidth(sheet: SheetModel, rowHdr: HTMLElement, isRtlChange?: boolean): void;
    getScrollSize(addOffset?: boolean): number;
    rowHeightChanged(args: { rowIdx: number, isHideShow?: boolean }): void;
    colWidthChanged(args: { colIdx: number, isHideShow?: boolean }): void;
    toggleGridlines(): void;
    destroy(): void;
}

/** @hidden */
export interface SheetRenderArgs {
    cells: Map<string, CellModel>;
    indexes: number[];
    direction?: string;
    skipUpdateOnFirst?: boolean;
    top?: number;
    left?: number;
    initLoad?: boolean;
    prevRowColCnt?: SheetModel;
    isRefreshing?: boolean;
    insertDelete?: boolean;
    isOpen?: boolean;
    openOptions?: JsonData;
}

/** @hidden */
export interface FilterInfoArgs {
    sheetIdx: number;
    hasFilter?: boolean;
    filterRange?: number[];
    col?: number[];
    criteria?: string[];
    allowHeaderFilter?: boolean;
    isFiltered?: boolean;
}

/**
 * CellRender EventArgs
 */
export interface CellRenderEventArgs extends CellInfoEventArgs {
    /** Defines the cell element. */
    element: HTMLElement;
    needHeightCheck?: boolean;
}

export interface StyleType {
    element: Element;
    attrs: { [key: string]: Object };
}

/**
 * @hidden
 */
export interface FormulaBarEdit {
    isEdit: boolean;
}

/**
 * @hidden
 */
export interface IViewport {
    rowCount: number;
    colCount: number;
    topIndex: number;
    bottomIndex: number;
    leftIndex: number;
    rightIndex: number;
    height: number;
    width: number;
    beforeFreezeWidth: number;
    beforeFreezeHeight: number;
    scaleX: number;
    scaleY: number;
}

/**
 * @hidden
 */
export interface IOffset {
    idx: number;
    size: number;
}

/**
 * @hidden
 */
export interface IScrollArgs {
    cur: IOffset;
    prev: IOffset;
    increase: boolean;
    preventScroll: boolean;
}

/**
 * @hidden
 */
export interface IRowRenderer {
    render(index?: number, isRowHeader?: boolean, preventHiddenCls?: boolean): Element;
    refresh(index: number, pRow: Element, hRow?: Element, header?: boolean, preventHiddenCls?: boolean): Element;
}

/**
 * @hidden
 */
export interface ICellRenderer {
    renderColHeader(index: number, row: Element, refChild?: Element): void;
    renderRowHeader(index: number, row: Element, refChild?: Element): void;
    render(args: CellRenderArgs): Element;
    refreshRange(
        range: number[], refreshing?: boolean, checkWrap?: boolean, checkHeight?: boolean, checkCF?: boolean,
        skipFormatCheck?: boolean, checkFormulaAdded?: boolean, isFromAutoFillOption?: boolean,
        isHeightCheckNeeded?: boolean, isSortAction?: boolean): void;
    refresh(
        rowIdx: number, colIdx: number, lastCell?: boolean, element?: Element, checkCF?: boolean, checkWrap?: boolean,
        skipFormatCheck?: boolean): void;
}

/**
 * @hidden
 */
export interface RefreshArgs {
    rowIndex?: number;
    colIndex?: number;
    direction?: string;
    top?: number;
    left?: number;
    refresh: RefreshType;
    skipUpdateOnFirst?: boolean;
    frozenIndexes?: number[];
    skipTranslate?: boolean;
    insertDelete?: boolean;
}

/**
 * OpenOptions
 */
export interface OpenOptions {
    /** Defines the file. */
    file?: FileList | string | File;
    /** Defines the password. */
    password?: string;
    /** Defines the sheet password. */
    sheetPassword?: string;
    /** Defines the sheetIndex. */
    sheetIndex?: number;
}
/** @hidden */
export interface OpenArgs extends OpenOptions {
    guid?: string;
    orginalFile?: File;
    triggerEvent?: boolean;
    jsonObject?: string;
}

/** @hidden */
export interface JsonData {
    data: string;
    eventArgs: OpenArgs;
    isOpenFromJson: boolean;
    guid?: string;
    context: WorkbookOpen;
}

/**
 * BeforeOpenEventArgs
 */
export interface BeforeOpenEventArgs {
    /** Defines the file. */
    file: FileList | string | File;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Defines the request data. */
    requestData: object;
    /** Defines the password. */
    password?: string;
}

export interface DialogBeforeOpenEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the element of the dialog.
     */
    element: Element;
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement | string;
    /**
     * Returns the name of the dialog.
     */
    dialogName: string;
    /**
     * Defines the value that can be displayed in dialog’s content area, you can override it with your own custom message.
     */
    content?: string;
    /**
     * Defines the cell address.
     */
    cellAddress?: string;
}

/**
 * MenuSelectEventArgs
 */
export interface MenuSelectEventArgs extends MenuEventArgs {
    /** Defines the cancel option. */
    cancel: boolean;
}

/**
 * OpenFailureArgs
 */
export interface OpenFailureArgs {
    /** Defines the status. */
    status: string;
    /** Defines the status text. */
    statusText: string;
    /** Defines the stack. */
    stack?: string;
    /** Defines the message. */
    message?: string;
}

/**
 * BeforeSelectEventArgs
 */
export interface BeforeSelectEventArgs extends BaseEventArgs {
    range: string;
    cancel: boolean;
}

/**
 * SelectEventArgs
 */
export interface SelectEventArgs extends BaseEventArgs {
    range: string;
}

/** @hidden */
export interface CellRenderArgs {
    colIdx: number;
    rowIdx?: number;
    cell?: CellModel;
    address?: string;
    lastCell?: boolean;
    row?: HTMLElement;
    hRow?: HTMLElement;
    pRow?: HTMLElement;
    pHRow?: HTMLElement;
    isHeightCheckNeeded?: boolean;
    checkNextBorder?: string;
    first?: string;
    isRefresh?: boolean;
    td?: HTMLTableCellElement;
    manualUpdate?: boolean;
    isRow?: boolean;
    isFreezePane?: boolean;
    insideFreezePane?: boolean;
    isRefreshing?: boolean;
    sheetIndex?: number;
    onActionUpdate?: boolean;
    refChild?: Element;
    formulaRefresh?: boolean;
    checkCF?: boolean;
    skipFormatCheck?: boolean;
    isDependentRefresh?: boolean;
    isMerged?: boolean;
    colSpan?: number;
    rowSpan?: number;
    isRandomFormula?: boolean;
    style?: CellStyleModel;
    validation?: ValidationModel;
    isFromAutoFillOption?: boolean;
    fillType?: string;
    isSortAction?: boolean;
    action?: string;
}
/** @hidden */
export interface IAriaOptions<T> {
    role?: string;
    selected?: T;
    multiselectable?: T;
    busy?: T;
    colcount?: string;
}

/**
 * CellEditEventArgs
 */
export interface CellEditEventArgs {
    /** Defines the value. */
    value: string;
    /** Defines the old value. */
    oldValue: string;
    /** Defines the display text of the cell */
    displayText: string;
    /** Defines the element. */
    element: HTMLElement;
    /** Defines the address. */
    address: string;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Apply the number format and display the formatted value in the editor. */
    showFormattedText?: boolean;
}

/**
 * CellSaveEventArgs
 */
export interface CellSaveEventArgs {
    /** Defines the value. */
    value: string;
    /** Defines the old value. */
    oldValue: string;
    /** Defines the element. */
    element: HTMLElement;
    /** Defines the address. */
    address: string;
    /** Defines the formula. */
    formula?: string;
    /** Defines the display text of the cell */
    displayText?: string;
    /** Defines the type of Event. */
    originalEvent?: MouseEvent & TouchEvent | KeyboardEventArgs;
    isSpill?: boolean;
    /**
     * Defines the old display text value.
     * > Only applicable for Manual calculation
     */
    previousFormulaValue?: string | number;
}

/**
 * NoteSaveEventArgs
 */
export interface NoteSaveEventArgs {
    /** Defines the note text. */
    notes: string;
    /** Defines the address. */
    address: string;
    /** Defines the type of Event. */
    originalEvent?: MouseEvent & TouchEvent | KeyboardEventArgs;
}

/**
 * CellSaveEventArgs
 */
export interface ConditionalFormatEventArgs {
    /** Defines the applied conditional format. */
    conditionalFormat: ConditionalFormatModel;
    /** Defines the cell element. */
    element: HTMLElement;
    /** Defines the cell model */
    cell: CellModel;
    /** Defines the address. */
    address: string;
    /** Defines whether the formatting is applied to a cell or not. */
    apply: boolean;
}

/** @hidden */
export interface CollaborativeEditArgs {
    action: string;
    eventArgs: UndoRedoEventArgs;
    cancel?: boolean;
}

/** @hidden */
export interface HideShowEventArgs {
    hide: boolean;
    startIndex: number;
    endIndex: number;
    autoFit?: boolean;
    hdrRow?: HTMLElement;
    row?: HTMLElement;
    insertIdx?: number;
    skipAppend?: boolean;
    isCol?: boolean;
    actionUpdate?: boolean;
    mergeCollection?: MergeArgs[];
    isFiltering?: true;
    cancel?: boolean;
    freezePane?: boolean;
    isUndo?: boolean;
    isRedo?: boolean;
    refreshUI?: boolean;
    sheetIndex?: number;
    hiddenIndexes?: number[];
}

/** @hidden */
export interface UndoRedoEventArgs extends CellSaveEventArgs, BeforeSortEventArgs, BeforePasteEventArgs, WrapEventArgs,
    InsertDeleteEventArgs {
    requestType: string;
    beforeActionData: BeforeActionData;
    sheetIndex?: number;
    oldWidth?: string;
    oldHeight?: string;
    notes?: string;
    isCol?: boolean;
    hide?: boolean;
    index?: number;
    width?: string;
    height?: string;
    merge?: boolean;
    mergeCollection?: MergeArgs[];
    id?: string;
    imageData?: string;
    imageHeight?: number;
    imageWidth?: number;
    prevHeight?: number;
    prevWidth?: number;
    currentHeight?: number;
    currentWidth?: number;
    prevLeft?: number;
    prevTop?: number;
    currentLeft?: number;
    currentTop?: number;
    prevRowIdx?: number;
    prevColIdx?: number;
    currentRowIdx?: number;
    currentColIdx?: number;
    isUndoRedo?: boolean;
    pasteSheetIndex: number;
    pastedPictureElement: HTMLElement;
    fillRange?: string;
    dataRange?: string;
    direction?: AutoFillDirection;
    fillType?: AutoFillType;
    selectedRange?: string;
    cFColor?: CFColor;
    sheetIdx?: number;
    validation?: CellValidationEventArgs;
    previousSort?: SortCollectionModel;
    conditionalFormats: ConditionalFormatModel[];
    /** Specifies the previous sorted cells. */
    cellDetails?: PreviousCellDetails[];
    /** Specifies the sorted cells. */
    sortedCellDetails?: object[];
    cfClearActionArgs?: object;
    cfActionArgs?: { cfModel: ConditionalFormatModel[], sheetIdx: number };
    isColSelected?: boolean;
    style?: CellStyleModel;
}
export interface BeforeActionData {
    cellDetails: PreviousCellDetails[];
    cutCellDetails?: PreviousCellDetails[];
}
export interface BeforeImageData {
    imageHeight?: number;
    imageWidth?: number;
    imageLeft?: number;
    imageTop?: number;
    imageData?: string;
    requestType: string;
    range?: string;
    cancel?: boolean;
    id?: string;
    sheetIndex?: number;
}

export interface BeforeImageRefreshData {
    prevHeight?: number;
    prevWidth?: number;
    currentHeight?: number;
    currentWidth?: number;
    prevLeft?: number;
    prevTop?: number;
    currentLeft?: number;
    currentTop?: number;
    requestType: string;
    prevRowIdx?: number;
    prevColIdx?: number;
    currentRowIdx?: number;
    currentColIdx?: number;
    id?: string;
    sheetIdx?: number;
    isUndoRedo?: boolean;
}

export interface PreviousCellDetails {
    rowIndex?: number;
    colIndex?: number;
    style?: object;
    format?: string;
    value?: string;
    notes?: string;
    formula?: string;
    wrap?: boolean;
    rowSpan?: number;
    colSpan?: number;
    hyperlink?: string | HyperlinkModel;
    image?: ImageModel[];
    chart?: ChartModel[];
    isLocked?: boolean;
    validation?: CellValidationEventArgs;
    isReadOnly?: boolean;
    formattedText?: string;
    copyCellValue?: string | number;
    autoFillText?: string | number;
}

export interface BeforePasteEventArgs {
    cancel?: boolean;
    copiedInfo: { [key: string]: Object };
    copiedShapeInfo?: { [key: string]: Object };
    copiedRange: string;
    pastedRange: string;
    requestType: string;
    type: string;
    BeforeActionData?: BeforeActionData;
}

export interface BeforeWrapEventArgs {
    address: string;
    wrap: boolean;
    cancel: boolean;
    //action: string;
}

export interface WrapEventArgs {
    address: string;
    wrap: boolean;
    action: string;
}

/**
 * CellValidationEventArgs
 *
 * @hidden
 */
export interface CellValidationEventArgs {
    range?: string;
    type?: ValidationType;
    operator?: ValidationOperator;
    value1?: string;
    value2?: string;
    ignoreBlank?: boolean;
    inCellDropDown?: boolean;
    cancel?: boolean;
}

/**
 * BeforeChartEventArgs
 *
 * @hidden
 */
export interface BeforeChartEventArgs {
    type?: ChartType;
    theme?: ChartTheme;
    isSeriesInRows?: boolean;
    markerSettings?: MarkerSettingsModel
    range?: string;
    id?: string;
    height?: number;
    width?: number;
    top?: number;
    left?: number;
    posRange?: string;
    isInitCell?: boolean;
    cancel: boolean;
}

/** @hidden */
export interface ScrollEventArgs {
    scrollTop?: number;
    scrollLeft?: number;
    preventScroll?: boolean;
    skipHidden?: boolean;
    skipRowVirualScroll?: boolean;
    skipColVirualScroll?: boolean;
}

/**
 * Interface for AutoFillEventArgs.
 */
export interface AutoFillEventArgs {
    /** Defines the range of the data which is used to perform autofill. */
    dataRange: string;
    /** Defines the range in which autofill will be performed. */
    fillRange: string;
    /** Defines the autofill performing direction. */
    direction: AutoFillDirection;
    /** Defines the fill type options. */
    fillType: AutoFillType;
    /** Set `true` if autofill needs to be cancel in `actionBegin` event. By default, it will be `false`. */
    cancel?: boolean;
}

/** @hidden */
export interface duplicateSheetOption {
    sheetIndex: number;
    newSheetIndex: number;
}

/** @hidden */
export interface FilterCheckboxArgs {
    element: Element;
    isCheckboxFilterTemplate: boolean;
    column: { field: string };
    dataSource: { [key: string]: Object }[];
    btnObj: { element: HTMLElement };
    type: string;
}
/** @hidden */
export interface BeforeActionDataInternal extends BeforeActionData {
    /** Specifies the sorted cells. */
    sortedCellDetails?: object[];
}
/** @hidden */
export interface FillRangeInfo {
    startCell?: { colIndex: number, rowIndex: number },
    endCell?: { colIndex: number, rowIndex: number },
    fillRange?: number[],
    direction?: AutoFillDirection
}

/**
 * Cell model and its count details on external copy/paste.
 *
 * @hidden
 */
export interface PasteModelArgs {
    model?: RowModel[];
    usedRowIndex?: number;
    usedColIndex?: number;
    colCount?: number;
    rowCount?: number;
    selection?: string;
}

/**
 * @hidden
 */
export interface ExtendedPredicateModel extends PredicateModel {
    isFilterByMenu?: boolean;
}

/**
 * @hidden
 */
export interface ExtendedSpreadsheet extends Spreadsheet {
    renderTemplates?: (callback: Function) => void;
    filterModule?: { filterRange: Map<number, { range: number[] }>; };
}
