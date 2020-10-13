import { CellModel, BeforeSortEventArgs, SheetModel, InsertDeleteEventArgs, ImageModel } from './../../workbook/index';
import { ValidationType, ValidationOperator, MergeArgs, HyperlinkModel, TopBottom } from './../../workbook/index';
import { RefreshType } from './index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BaseEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { DataBar, ColorScale, IconSet, CellInfoEventArgs, CFColor, HighlightCell } from './../../workbook/index';


/**
 * Interface for renderer module
 * @hidden
 */
export interface IRenderer {
    colGroupWidth: number;
    renderPanel(): void;
    getRowHeaderPanel(): Element;
    getColHeaderPanel(): Element;
    getContentPanel(): Element;
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
}

/**
 * CellRender EventArgs
 */
export interface CellRenderEventArgs extends CellInfoEventArgs {
    /** Defines the cell element. */
    element: HTMLElement;
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
}
export interface ReplaceAllEventArgs {
    replaceValue: string;
    addressCollection: string[];
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
    render(index?: number, isRowHeader?: boolean, skipHidden?: boolean): Element;
    refresh(index: number, pRow: Element, hRow?: Element, header?: boolean): Element;
}

/**
 * @hidden
 */
export interface ICellRenderer {
    renderColHeader(index: number): Element;
    renderRowHeader(index: number): Element;
    render(args: CellRenderArgs): Element;
    refreshRange(range: number[]): void;
    refresh(rowIdx: number, colIdx: number, lastCell?: boolean, element?: Element): void;
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
}

/**
 * OpenOptions
 */
export interface OpenOptions {
    /** Defines the file. */
    file?: FileList | string;
}

/**
 * BeforeOpenEventArgs
 */
export interface BeforeOpenEventArgs {
    /** Defines the file. */
    file: FileList | string;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Defines the request data. */
    requestData: object;
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
    target: HTMLElement | String;
    /**
     * Returns the name of the dialog.
     */
    dialogName: String;

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
    /** Defines the element. */
    element: HTMLElement;
    /** Defines the address. */
    address: string;
    /** Defines the cancel option. */
    cancel: boolean;
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
    /** Defines the formula. */
    originalEvent?: MouseEvent & TouchEvent | KeyboardEventArgs;
}

/** @hidden */
export interface CollaborativeEditArgs {
    action: string;
    eventArgs: UndoRedoEventArgs;
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
}

/** @hidden */
export interface UndoRedoEventArgs extends CellSaveEventArgs, BeforeSortEventArgs, BeforePasteEventArgs, WrapEventArgs,
    InsertDeleteEventArgs {
    requestType: string;
    beforeActionData: BeforeActionData;
    sheetIndex?: number;
    oldWidth?: string;
    oldHeight?: string;
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
    rowIndex: number;
    colIndex: number;
    style: object;
    format: string;
    value: string;
    formula: string;
    wrap: boolean;
    rowSpan: number;
    colSpan: number;
    hyperlink: string | HyperlinkModel;
    image: ImageModel[];
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
export interface BeforeReplaceEventArgs {
    address: string;
    compareVal: string;
    cancel: boolean;
}
export interface ReplaceEventArgs {
    address: string;
    compareVal: string;
    action?: string;
}

/**
 * CellValidationEventArgs
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
    cancel: boolean;
}

/**
 * CFormattingEventArgs
 * @hidden
 */
export interface CFormattingEventArgs {
    range?: string;
    type?: HighlightCell | TopBottom | DataBar | ColorScale | IconSet;
    cFColor?: CFColor;
    value?: string;
    cancel: boolean;
}
