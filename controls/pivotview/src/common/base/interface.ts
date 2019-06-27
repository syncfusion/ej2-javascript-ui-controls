import { IPivotValues, IDataOptions, PivotEngine, IFieldListOptions, IFieldOptions, IAxisSet, IDataSet } from '../../base/engine';
import { IDrilledItem, IStringIndex } from '../../base/engine';
import { Mode, SelectionMode, PdfBorderStyle } from '../base/enum';
import { L10n } from '@syncfusion/ej2-base';
import { Grid, ExcelStyle, CellSelectionMode, SelectionType, CheckboxSelectionType } from '@syncfusion/ej2-grids';
import { Column } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs } from '@syncfusion/ej2-grids';
import { PdfStandardFont, PdfTrueTypeFont, PdfGridCell } from '@syncfusion/ej2-pdf-export';
import { SeriesModel } from '@syncfusion/ej2-charts';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
import { PivotView } from '../../pivotview';

/**
 * Interface
 */

export interface LoadEventArgs {
    /** Defines current dataSource */
    dataSourceSettings?: IDataOptions;
    pivotview?: PivotView;
    fieldsType?: IStringIndex;
}

export interface SaveReportArgs {
    /** Defines current dataSource */
    report?: string;
    /** Defines report name to save */
    reportName?: string;
}

export interface FetchReportArgs {
    /** returns the report names from storage */
    reportName?: string[];
}

export interface LoadReportArgs {
    /** Defines current dataSource */
    report?: string;
    /** Defines report name to save */
    reportName?: string;
}

export interface RenameReportArgs {
    /** Defines current dataSource */
    report?: string;
    /** Defines rename of report */
    rename?: string;
    /** Defines report name to save */
    reportName?: string;
}

export interface RemoveReportArgs {
    /** Defines current dataSource */
    report?: string;
    /** Defines report name to save */
    reportName?: string;
}

export interface NewReportArgs {
    /** Defines current dataSource */
    report?: string;
}

export interface ToolbarArgs {
    /** Defines current dataSource */
    customToolbar?: ItemModel[];
}

export interface EnginePopulatingEventArgs {
    /** Defines current dataSource */
    dataSourceSettings?: IDataOptions;
}

export interface EnginePopulatedEventArgs {
    /** Defines populated pivotvalues */
    dataSourceSettings?: IDataOptions;
    pivotFieldList?: IFieldListOptions;
    pivotValues?: IPivotValues;
}

export interface FieldDroppedEventArgs {
    /** Defines dropped field item */
    droppedField?: IFieldOptions;
    /** Defines current dataSource */
    dataSourceSettings?: IDataOptions;
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
    /** To disable repeat headers */
    allowRepeatHeader?: boolean;
    /** Defines style */
    style?: PdfTheme;
}

export interface PdfCellRenderArgs {
    /** Defines the style of the current cell. */
    style?: PdfStyle;
    /** Defines the current PDF cell */
    cell?: PdfGridCell;
    /** Defines the current PDF cell */
    pivotCell?: IAxisSet;
}

export interface PdfStyle {
    /** Defines the font family */
    fontFamily?: string;
    /** Defines the font size */
    fontSize?: number;
    /** Defines the brush color of font */
    textBrushColor?: string;
    /** Defines the pen color of font */
    textPenColor?: string;
    /** Defines the font bold */
    bold?: boolean;
    /** Defines the italic font */
    italic?: boolean;
    /** Defines the strike-out font */
    strikeout?: boolean;
    /** Defines the underlined font */
    underline?: boolean;
    /** Defines the grid border */
    border?: PdfBorder;
    /** Defines the background color */
    backgroundColor?: string;
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

export interface PivotCellSelectedEventArgs extends CellSelectingEventArgs {
    /** Defines the selected cells objects. */
    selectedCellsInfo?: CellSelectedObject[];
    pivotValues?: IPivotValues;
    currentTarget?: Element;
    cancel?: boolean;
    target?: Element;
    isCellClick?: boolean;
    data?: IAxisSet;
}

export interface DrillArgs {
    drillInfo?: IDrilledItem;
    pivotview?: PivotView;
}

export interface PivotColumn {
    allowReordering: boolean;
    allowResizing: boolean;
    headerText: string;
    width: string | number;
}

export interface ColumnRenderEventArgs {
    columns: PivotColumn[];
    dataSourceSettings: IDataOptions;
}

export interface BeginDrillThroughEventArgs {
    cellInfo: DrillThroughEventArgs;
    gridObj: Grid;
    type: string;
}

export interface ChartSeriesCreatedEventArgs {
    series: SeriesModel[];
    cancel: boolean;
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
    dataSourceSettings: IDataOptions;
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

/**
 * @hidden
 */
export interface RowHeaderPositionGrouping {
    [key: number]: RowHeaderLevelGrouping;
}

/**
 * @hidden
 */
export interface RowHeaderLevelGrouping {
    [key: string]: {
        text: string,
        name: string,
        level: number,
        hasChild: boolean,
        isDrilled: boolean
        levelName: string,
        fieldName: string,
        rowIndex: number,
        colIndex: number,
        span?: number,
    };
}

export interface PdfTheme {
    /** Defines the style of header content. */
    header?: PdfThemeStyle;
    /** Defines the theme style of record content. */
    record?: PdfThemeStyle;
}

export interface PdfThemeStyle {
    /** Defines the font size of theme style. */
    fontSize?: number;
    /** Defines the font of the theme. */
    font?: PdfStandardFont | PdfTrueTypeFont;
    /** Defines the italic of theme style. */
    italic?: boolean;
    /** Defines the font color of theme style. */
    fontColor?: string;
    /** Defines the font name of theme style. */
    fontName?: string;
    /** Defines the bold of theme style. */
    bold?: boolean;
    /** Defines the borders of theme style. */
    border?: PdfBorder;
    /** Defines the underline of theme style. */
    underline?: boolean;
    /** Defines the strikeout of theme style. */
    strikeout?: boolean;
}

export interface PdfBorder {
    /** Defines the border color */
    color?: string;
    /** Defines the border width */
    width?: number;
    /** Defines the border dash style */
    dashStyle?: PdfBorderStyle;
}

export interface CellTemplateArgs {
    /** Defines the cell element */
    targetCell?: HTMLElement;
}

export interface AggregateEventArgs {
    fieldName?: string;
    row?: IAxisSet;
    column?: IAxisSet;
    value?: number;
    cellSets?: IDataSet[];
    rowCellType?: string;
    columnCellType?: string;
    aggregateType?: SummaryTypes;
    skipFormatting?: boolean;
}

export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    data?: Object;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object associated with this cell. */
    column?: Column;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
    /** Defines the no. of rows to be spanned */
    rowSpan?: number;
    /** Defines the current action. */
    requestType?: string;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
    /** Define the pivot component object */
    pivotview?: PivotView;
}
