import { IPivotValues, IDataOptions, PivotEngine, IFieldListOptions, IFieldOptions, IAxisSet, IDataSet } from '../../base/engine';
import { Mode } from '../base/enum';
import { L10n } from '@syncfusion/ej2-base';
import { ExcelStyle } from '@syncfusion/ej2-grids';

/**
 * Interface
 */

export interface LoadEventArgs {
    /** Defines current dataSource */
    dataSource?: IDataOptions;
}

export interface EnginePopulatingEventArgs {
    /** Defines current dataSource */
    dataSource?: IDataOptions;
}

export interface EnginePopulatedEventArgs {
    /** Defines populated pivotvalues */
    dataSource?: IDataOptions;
    pivotFieldList?: IFieldListOptions;
    pivotValues?: IPivotValues;
}

export interface FieldDroppedEventArgs {
    /** Defines dropped field item */
    droppedField?: IFieldOptions;
    /** Defines current dataSource */
    dataSource?: IDataOptions;
    /** Defines dropped axis */
    droppedAxis?: string;
}

export interface BeforeExportEventArgs {
    /** Defines exported file name */
    fileName?: string;
    /** Defines header text */
    header?: string;
    /** Defines footer text */
    footer?: string;
    /** Defines pivotValues collections */
    dataCollections?: IPivotValues[];
}

export interface CellClickEventArgs {
    currentCell: Element;
    data: Object;
}

export interface HyperCellClickEventArgs {
    currentCell: Element;
    data: Object;
    cancel: boolean;
}

export interface DrillThroughEventArgs {
    currentTarget: Element;
    currentCell: IAxisSet;
    rawData: IDataSet[];
    rowHeaders: string;
    columnHeaders: string;
    value: string;
}

export interface CellSelectedObject {
    currentCell: IAxisSet;
    value: number | string;
    rowHeaders: string | number | Date;
    columnHeaders: string | number | Date;
    measure: string;
}

export interface PivotCellSelectedEventArgs {
    /** Defines the selected cells objects. */
    selectedCellsInfo?: CellSelectedObject[];
    pivotValues?: IPivotValues;
}

export interface PivotColumn {
    allowReordering: boolean;
    allowResizing: boolean;
    headerText: string;
    width: string | number;
}

export interface BeforeColumnRenderEventArgs {
    columns: PivotColumn[];
    dataSource: IDataOptions;
}

/**
 * @hidden
 */
export interface CommonArgs {
    pivotEngine: PivotEngine;
    dataSource: IDataOptions;
    element: HTMLElement;
    id: string;
    moduleName: string;
    enableRtl: boolean;
    isAdaptive: boolean;
    renderMode: Mode;
    localeObj: L10n;
}
/**
 * @hidden
 */
export interface PivotButtonArgs {
    field: IFieldOptions[];
    axis: string;
}

/**
 * IAction interface
 * @hidden
 */
export interface IAction {
    updateModel?(): void;
    onActionBegin?(args?: Object, type?: string): void;
    onActionComplete?(args?: Object, type?: string): void;
    addEventListener?(): void;
    removeEventListener?(): void;
}

export interface ExcelRow {
    /**  Defines the index for cells */
    index?: number;
    /**  Defines the cells in a row */
    cells?: ExcelCell[];

}

export interface ExcelColumn {
    /**  Defines the index for cells */
    index?: number;
    /**  Defines the width of each column */
    width: number;

}

export interface ExcelStyles extends ExcelStyle {
    /** Defines the cell number format */
    numberFormat?: string;
}
/* tslint:enable */

export interface ExcelCell {
    /** Defines the index for the cell */
    index?: number;
    /** Defines the column span for the cell  */
    colSpan?: number;
    /** Defines the column span for the cell  */
    rowSpan?: number;
    /** Defines the value of the cell */
    value?: string | boolean | number | Date;
    /** Defines the style of the cell */
    style?: ExcelStyles;
}

/**
 * @hidden
 */
export interface ResizeInfo {
    [key: string]: number;
}

/**
 * @hidden
 */
export interface ScrollInfo {
    vertical: number; horizontal: number; verticalSection: number; horizontalSection: number;
    top: number; left: number; scrollDirection: { direction: string, position: number };
}

/**
 * @hidden
 */
export interface HeaderCollection {
    rowHeaders: IAxisSet[];
    rowHeadersCount: number;
    columnHeaders: IAxisSet[];
    columnHeadersCount: number;
}
