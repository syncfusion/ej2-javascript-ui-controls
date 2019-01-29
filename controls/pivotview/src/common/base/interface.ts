import { IPivotValues, IDataOptions, PivotEngine, IFieldListOptions, IFieldOptions, IAxisSet, IDataSet } from '../../base/engine';
import { Mode, SelectionMode } from '../base/enum';
import { L10n } from '@syncfusion/ej2-base';
import { Grid, ExcelStyle, CellSelectionMode, SelectionType, CheckboxSelectionType } from '@syncfusion/ej2-grids';

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

export interface BeginDrillThroughEventArgs {
    cellInfo: DrillThroughEventArgs;
    gridObj: Grid;
    type: string;
}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettings {

    /**
     * Pivot widget supports row, column, cell, and both (row and column) selection mode. 
     * @default Row
     */
    mode?: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection 
     * `mode` to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     * @default Flow
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines options for selection type. They are 
     * * `Single`: Allows selection of only a row or a column or a cell. 
     * * `Multiple`: Allows selection of multiple rows or columns or cells. 
     * @default Single 
     */
    type?: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the selection is allowed only through checkbox.
     * 
     * > To enable checkboxOnly selection, should specify the column type as`checkbox`.
     * @default false 
     */
    checkboxOnly?: boolean;

    /**
     * If 'persistSelection' set to true, then the selection is persisted on all operations.
     * For persisting selection, any one of the column should be enabled as a primary key.
     * @default false 
     */
    persistSelection?: boolean;

    /**
     * Defines options for checkbox selection Mode. They are 
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     * @default Default
     */
    checkboxMode?: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     * @default false
     */
    enableSimpleMultiRowSelection?: boolean;
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
