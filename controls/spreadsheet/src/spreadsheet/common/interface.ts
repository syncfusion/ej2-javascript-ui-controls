import { CellModel, CellStyleModel, BeforeSortEventArgs } from './../../workbook/index';
import { RefreshType } from './enum';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BaseEventArgs } from '@syncfusion/ej2-base';

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
    renderTable(cells: Map<string, CellModel>, rowIdx: number, colIdx: number, lastIdx: number, top?: number, left?: number): void;
    refreshRowContent(cells: Map<string, CellModel>, startIndex: number, lastIdx: number): void;
    refreshColumnContent(cells: Map<string, CellModel>, rowIndex: number, colIndex: number, lastIdx: number): void;
    updateRowContent(cells: Map<string, CellModel>, startIndex: number, lastIdx: number, direction: string): void;
    updateColContent(cells: Map<string, CellModel>, rowIdx: number, colIdx: number, lastIdx: number, direction: string): void;
    showHideHeaders(): void;
}

/**
 * CellRenderEventArgs
 */
export interface CellRenderEventArgs {
    /** Defines the cell. */
    cell: CellModel;
    /** Defines the cell element. */
    element: HTMLElement;
    /** Defines the cell address. */
    address: string;
}

export interface StyleType {
    element: Element;
    attrs: { [key: string]: Object };
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
    height: number;
    width: number;
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
    refresh(index: number, hRow?: Element): Element;
}

/**
 * @hidden
 */
export interface ICellRenderer {
    renderColHeader(index: number): Element;
    renderRowHeader(index: number): Element;
    render(args: CellRenderArgs): Element;
    refreshRange(range: number[]): void;
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

/**
 * MenuSelectArgs
 */
export interface MenuSelectArgs extends MenuEventArgs {
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
export interface CellStyleExtendedModel extends CellStyleModel {
    properties: CellStyleModel;
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
    isHeightCheckNeeded?: boolean;
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
}

/** @hidden */
export interface CollaborativeEditArgs {
    action: string;
    eventArgs: UndoRedoEventArgs;
}

/** @hidden */
export interface HideShowEventArgs {
    hide: boolean;
    startRow: number;
    endRow: number;
    autoFit?: boolean;
    hdrRow?: HTMLElement;
    row?: HTMLElement;
    insertIdx?: number;
    skipAppend?: boolean;
}

/** @hidden */
export interface UndoRedoEventArgs extends CellSaveEventArgs, BeforeSortEventArgs, BeforePasteEventArgs {
    requestType: string;
    beforeActionData: BeforeActionData;
    sheetIndex?: number;
    oldWidth?: string;
    oldHeight?: string;
    isCol?: boolean;
    index?: number;
    width?: string;
    height?: string;
}
export interface BeforeActionData {
    cellDetails: PreviousCellDetails[];
    cutCellDetails?: PreviousCellDetails[];
}
export interface PreviousCellDetails {
    rowIndex: number;
    colIndex: number;
    style: object;
    format: string;
    value: string;
    formula: string;
}

export interface BeforePasteEventArgs {
    cancel?: boolean;
    copiedInfo: { [key: string]: Object };
    copiedRange: string;
    pastedRange: string;
    requestType: string;
    type: string;
    BeforeActionData?: BeforeActionData;
}