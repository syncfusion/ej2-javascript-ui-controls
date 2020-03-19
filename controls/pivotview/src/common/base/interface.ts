import { IPivotValues, IDataOptions, PivotEngine, IFieldListOptions, IFieldOptions, IAxisSet, IDataSet } from '../../base/engine';
import { IDrilledItem, IStringIndex, ICalculatedFields, ICalculatedFieldSettings, IFormatSettings } from '../../base/engine';
import { IFilter } from '../../base/engine';
import { Mode, SelectionMode, PdfBorderStyle, AggregateTypes } from '../base/enum';
import { L10n } from '@syncfusion/ej2-base';
import { Grid, ExcelStyle, CellSelectionMode, SelectionType, CheckboxSelectionType, PdfExportProperties } from '@syncfusion/ej2-grids';
import { Column, ExcelExportProperties } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, ColumnModel, ExcelHAlign, ExcelVAlign } from '@syncfusion/ej2-grids';
import { PdfStandardFont, PdfTrueTypeFont, PdfGridCell, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { SeriesModel, ExportType } from '@syncfusion/ej2-charts';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
import { PivotView } from '../../pivotview';
import { OlapEngine } from '../../base/olap/engine';

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
    /** Defines current dataSource
     * @blazorType List<Syncfusion.Blazor.Navigations.ItemModel>
     */
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
    /** Defines dropped field name */
    fieldName?: string;
    /** Defines dropped field item */
    droppedField?: IFieldOptions;
    /** Defines current dataSource */
    dataSourceSettings?: IDataOptions;
    /** Defines dropped axis */
    droppedAxis?: string;
    /** Defines dropped field position
     * @blazorType int
     */
    droppedPosition?: number;
}

export interface FieldDropEventArgs {
    /** Defines drop field name */
    fieldName?: string;
    /** Defines drop field item */
    dropField?: IFieldOptions;
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines drop field axis */
    dropAxis?: string;
    /** Defines drop field position
     * @blazorType int
     */
    dropPosition?: number;
    /** Defines dragged field axis */
    draggedAxis?: string;
    /** Defines an option to restrict the field drop operation */
    cancel?: boolean;
}

export interface FieldDragStartEventArgs {
    /** Defines drag field name */
    fieldName?: string;
    /** Defines drag field item */
    fieldItem?: IFieldOptions;
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines drag field axis */
    axis?: string;
    /** Defines an option to restrict the field drag operation */
    cancel?: boolean;
}

export interface BeforeExportEventArgs {
    /** Defines exported field name */
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
    /** 
     * @blazorType Syncfusion.Blazor.Grids.PdfExportProperties
     */
    pdfExportProperties?: PdfExportProperties;
    isMultipleExport?: boolean;
    pdfDoc?: Object;
    isBlob?: boolean;
    /** 
     * @blazorType Syncfusion.Blazor.Grids.ExcelExportProperties
     */
    excelExportProperties?: ExcelExportProperties;
    /* tslint:disable-next-line */
    workbook?: any;
    /** 
     * @blazorDefaultValueIgnore
     * @isEnumeration
     * @blazorType Syncfusion.Blazor.Charts.ExportType
     */
    type?: ExportType;
    orientation?: PdfPageOrientation;
    /** 
     * @blazorType int
     */
    width?: number;
    /** 
     * @blazorType int
     */
    height?: number;
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
    /** Defines the font size
     * @blazorType int
     */
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
    /** 
     * @blazorType List<Syncfusion.Blazor.Grids.ColumnModel>
     */
    gridColumns?: ColumnModel[];
}

export interface MemberFilteringEventArgs {
    filterSettings?: IFilter;
    dataSourceSettings?: IDataOptions;
    cancel?: boolean;
}

export interface CellSelectedObject {
    currentCell: IAxisSet;
    /** 
     * @blazorType string
     */
    value: number | string;
    /** 
     * @blazorType string
     */
    rowHeaders: string | number | Date;
    /** 
     * @blazorType string
     */
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
    cancel?: boolean;
}

export interface PivotColumn {
    allowReordering: boolean;
    allowResizing: boolean;
    headerText: string;
    /** 
     * @blazorType string
     */
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
    /** 
     * @blazorType List<Syncfusion.Blazor.Charts.SeriesModel>
     */
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
     * @isEnumeration
     * @blazorDefaultValue Syncfusion.Blazor.Grids.CellSelectionMode.Flow
     * @blazorType Syncfusion.Blazor.Grids.CellSelectionMode
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
     * @isEnumeration
     * @blazorDefaultValue Syncfusion.Blazor.Grids.CheckboxSelectionType.Default
     * @blazorType Syncfusion.Blazor.Grids.CheckboxSelectionType
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
    pivotEngine: PivotEngine | OlapEngine;
    dataSourceSettings: IDataOptions;
    element: HTMLElement;
    id: string;
    moduleName: string;
    enableRtl: boolean;
    isAdaptive: boolean;
    renderMode: Mode;
    localeObj: L10n;
    dataType: string;
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
    /**  Defines the index for cells
     * @blazorType int
     */
    index?: number;
    /**  Defines the cells in a row */
    cells?: ExcelCell[];

}

export interface ExcelColumn {
    /**  Defines the index for cells
     * @blazorType int
     */
    index?: number;
    /**  Defines the width of each column
     * @blazorType int
     */
    width: number;

}

export interface ExcelStyles extends ExcelStyle {
    /** Defines the horizontal alignment for cell style
     * @blazorDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Grids.ExcelHAlign
     */
    hAlign?: ExcelHAlign;
    /** Defines the vertical alignment for cell style
     * @blazorDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Grids.ExcelVAlign
     */
    vAlign?: ExcelVAlign;
    /** Defines the cell number format */
    numberFormat?: string;
}

export interface ExcelCell {
    /** Defines the index for the cell
     * @blazorType int
     */
    index?: number;
    /** Defines the column span for the cell
     * @blazorType int
     */
    colSpan?: number;
    /** Defines the column span for the cell
     * @blazorType int
     */
    rowSpan?: number;
    /** Defines the value of the cell
     * @blazorType string
     */
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
    [key: string]: ChartLabelInfo;
}

/**
 * @hidden
 */
export interface ChartLabelInfo {
    text: string;
    name: string;
    level: number;
    hasChild: boolean;
    isDrilled: boolean;
    levelName: string;
    fieldName: string;
    rowIndex: number;
    colIndex: number;
    span?: number;
    cell?: IAxisSet;
}

export interface PdfTheme {
    /** Defines the style of header content. */
    header?: PdfThemeStyle;
    /** Defines the theme style of record content. */
    record?: PdfThemeStyle;
}

export interface PdfThemeStyle {
    /** Defines the font size of theme style.
     * @blazorType int
     */
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
    /** Defines the border width
     * @blazorType int
     */
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
    /** 
     * @blazorType Nullable<double>
     */
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
    /** Defines the column object associated with this cell.
     * @blazorDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Grids.ColumnModel
     */
    column?: Column;
    /** Defines the no. of columns to be spanned
     * @blazorType int
     */
    colSpan?: number;
    /** Defines the no. of rows to be spanned
     * @blazorType int
     */
    rowSpan?: number;
    /** Defines the current action. */
    requestType?: string;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
    /** Define the pivot component object */
    pivotview?: PivotView;
}

export interface FieldListRefreshedEventArgs {
    dataSourceSettings?: IDataOptions;
    pivotValues?: IPivotValues;
}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
     * x value of the marker position
     * @default 0
     * @blazorType int
     */
    x?: number;

    /**
     * y value of the marker position
     * @default 0
     * @blazorType int
     */
    y?: number;

}

export interface MemberEditorOpenEventArgs {
    /** Defines the selected filter field name */
    fieldName?: string;
    /**
     * @blazorType Dictionary<string,object>
     */
    /** Defines the filter members of the field */
    fieldMembers?: { [key: string]: Object; }[];
    /** Defines current filter settings */
    filterSetting?: IFilter;
    /** Defines an option to restrict the member editor dialog open */
    cancel?: boolean;
}

export interface FieldRemoveEventArgs {
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines removed field name */
    fieldName?: string;
    /** Defines removed field item */
    fieldItem?: IFieldOptions;
    /** Defines removed field axis */
    axis?: string;
    /** Defines an option to restrict the field remove operation */
    cancel?: boolean;
}

export interface CalculatedFieldCreateEventArgs {
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines calculated field name */
    fieldName?: string;
    /** Defines calcualted field item */
    calculatedField?: ICalculatedFields;
    /** 
     * @blazorType List<ICalculatedFieldSettings>
     */
    /** Defines current calculated field settings */
    calculatedFieldSettings?: ICalculatedFieldSettings[];
    /** Defines an option to restrict the calculated field create operation */
    cancel?: boolean;
}

export interface NumberFormattingEventArgs {
    /** 
     * @blazorType List<IFormatSettings>
     */
    /** Defines current format settings */
    formatSettings?: IFormatSettings[];
    /** Defines format name */
    formatName?: string;
    /** Defines an option to restrict the format field create operation */
    cancel?: boolean;
}

export interface AggregateMenuOpenEventArgs {
    /** 
     * @blazorType List<SummaryTypes>
     */
    /** Defines summary types to show in context menu */
    aggregateTypes?: AggregateTypes[];
    /** Defines selected field name */
    fieldName?: string;
    /** Defines an option to restrict the conext menu open */
    cancel?: boolean;
}

/**
 * @hidden
 */
export interface TreeDataInfo {
    index: number;
    isSelected: boolean;
}