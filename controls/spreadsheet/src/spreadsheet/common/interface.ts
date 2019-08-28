import { CellModel, CellStyleModel } from './../../workbook/index';
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
    render(isHeader: boolean, index?: number): Element;
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
export interface OpenOptions {
    file?: FileList | string;
}

export interface BeforeOpenEventArgs {
    file: FileList | string;
    cancel: boolean;
    requestData: object;
}

/**
 * MenuSelectArgs
 */
export interface MenuSelectArgs extends MenuEventArgs {
    cancel: boolean;
}
export interface OpenFailureArgs {
    status: string;
    statusText: string;
    stack?: string;
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

export interface CellEditEventArgs {
    value: string;
    oldValue: string;
    element: HTMLElement;
    address: string;
    cancel: boolean;
}

export interface CellSaveEventArgs {
    value: string;
    oldValue: string;
    element: HTMLElement;
    address: string;
}