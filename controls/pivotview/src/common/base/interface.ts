import { IDataOptions, PivotEngine, IFieldListOptions, IFieldOptions, IAxisSet, IDataSet, ISort, IDrillOptions, FieldItemInfo, IConditionalFormatSettings, IValueSortSettings } from '../../base/engine';
import { IDrilledItem, IStringIndex, ICalculatedFields, ICalculatedFieldSettings, IFormatSettings } from '../../base/engine';
import { IFilter } from '../../base/engine';
import { Mode, SelectionMode, PdfBorderStyle, AggregateTypes, ExportView } from '../base/enum';
import { L10n } from '@syncfusion/ej2-base';
import { Grid, ExcelStyle, CellSelectionMode, SelectionType, CheckboxSelectionType, PdfExportProperties } from '@syncfusion/ej2-grids';
import { Column, ExcelExportProperties } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, ColumnModel, ExcelHAlign, ExcelVAlign } from '@syncfusion/ej2-grids';
import { PdfStandardFont, PdfTrueTypeFont, PdfGridCell, PdfPageOrientation, PdfGridColumn } from '@syncfusion/ej2-pdf-export';
import { SeriesModel, ExportType, Axis, IChartEventArgs, FontModel, Alignment } from '@syncfusion/ej2-charts';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes, Sorting } from '../../base/types';
import { DisplayOption, PivotView } from '../../pivotview/base/pivotview';
import { OlapEngine } from '../../base/olap/engine';
import { GridSettings } from '../../pivotview/model/gridsettings';
import { ChartSettings } from '../../pivotview/model/chartsettings';
import { Workbook } from '@syncfusion/ej2-excel-export';

/**
 * Interface
 */

/**
 * The load event arguments provides the necessary information to customize the pivot table before initializing the component.
 */
export interface LoadEventArgs {
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines the pivot table instance object*/
    pivotview?: PivotView;
    /** Defines the type of specific fields */
    fieldsType?: IStringIndex;
    /** Defines the default field list order */
    defaultFieldListOrder?: Sorting;
}

/**
 * The save report event arguments provides the necessary information to save the report.
 */
export interface SaveReportArgs {
    /** Defines current dataSource */
    report?: string;
    /** Defines report name to save */
    reportName?: string;
}

/**
 * The fetch report event arguments provides the necessary information to fetch reports from storage.
 */
export interface FetchReportArgs {
    /** Defines the report list from storage */
    reportName?: string[];
}

/**
 * The load report event arguments provides the necessary information to load the report.
 */
export interface LoadReportArgs {
    /** Defines current report */
    report?: string;
    /** Defines report name to load */
    reportName?: string;
}

/**
 * The rename report event arguments provides the necessary information to rename the report.
 */
export interface RenameReportArgs {
    /** Defines current report */
    report?: string;
    /** Defines rename of current report */
    rename?: string;
    /** Defines current report name to rename */
    reportName?: string;
    /** Defines whether report already exist with this name or not */
    isReportExists?: boolean;
}

/**
 * The remove report event arguments provides the necessary information to remove the report.
 */
export interface RemoveReportArgs {
    /** Defines current report */
    report?: string;
    /** Defines report name to remove the report */
    reportName?: string;
}

/**
 * The new report event arguments provides the necessary information to create a new report.
 */
export interface NewReportArgs {
    /** Defines current report */
    report?: string;
}

/**
 * The toolbar event arguments provides the necessary information to customize options of the toolbar creating.
 */
export interface ToolbarArgs {
    /**
     * Defines the collection of items used to add or remove items to create as toolbar options.
     */
    customToolbar?: ItemModel[];
}

/**
 * The engine populating event arguments provides the necessary information to customize the report before populating the pivot engine.
 */
export interface EnginePopulatingEventArgs {
    /** Defines current report. */
    dataSourceSettings?: IDataOptions;
}

/**
 * The engine populated event arguments provides the necessary information about the engine populated using updated report.
 */
export interface EnginePopulatedEventArgs {
    /** Defines the updated report to get updated pivot table cell collection and field list information. */
    dataSourceSettings?: IDataOptions;
    /** Defines the updated field list information from the populated engine to update the field list. */
    pivotFieldList?: IFieldListOptions;
    /** Defines the updated pivot table cell information from the populated engine to update the pivot table. */
    pivotValues?: IAxisSet[][];
}

/**
 * The field dropped event arguments provides the necessary information about the dropped field and its dropped axis.
 */
export interface FieldDroppedEventArgs {
    /** Defines the dropped field name */
    fieldName?: string;
    /** Defines the dropped field item */
    droppedField?: IFieldOptions;
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines the axis where the field has been dropped */
    droppedAxis?: string;
    /** Defines the position where the field has been dropped. */
    droppedPosition?: number;
}

/**
 * The field drop event arguments provides the necessary information to customize the drop field and its drop axis.
 */
export interface FieldDropEventArgs {
    /** Defines drop field name */
    fieldName?: string;
    /** Defines drop field item */
    dropField?: IFieldOptions;
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines the axis where the field will drop */
    dropAxis?: string;
    /**
     * Defines drop field position
     */
    dropPosition?: number;
    /** Defines the axis where the field has been dragged */
    draggedAxis?: string;
    /** Defines an option to restrict the field drop operation */
    cancel?: boolean;
}

/**
 * The field drag start event arguments provides the necessary information about the drag field and its axis.
 */
export interface FieldDragStartEventArgs {
    /** Defines drag field name */
    fieldName?: string;
    /** Defines drag field item */
    fieldItem?: IFieldOptions;
    /** Defines current report */
    dataSourceSettings?: IDataOptions;
    /** Defines the axis where the field is dragged */
    axis?: string;
    /** Defines an option to restrict the field drag operation */
    cancel?: boolean;
}

/**
 * The before export event arguments provides the necessary information to customize before exporting the file.
 */
export interface BeforeExportEventArgs {
    /** Defines exported field name */
    fileName?: string;
    /** Defines header text */
    header?: string;
    /** Defines footer text */
    footer?: string;
    /** Defines pivot table cell collections */
    dataCollections?: IAxisSet[][];
    /** Defines option to disable the repeat headers */
    allowRepeatHeader?: boolean;
    /** Defines the theme style for PDF */
    style?: PdfTheme;
    /**
     * Defines the additional settings for PDF export such as page size, orientation, header, footer, etc.
     */
    pdfExportProperties?: PdfExportProperties;
    /** Defines an option to export multiple pivot table to the same PDF file */
    isMultipleExport?: boolean;
    /** Defines current PDF file that holds the pivot table information which will be used to export */
    pdfDoc?: Object;
    /** A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system. */
    isBlob?: boolean;
    /** Defines the additional settings for excel export such as multiple export, header, footer, etc.
     */
    excelExportProperties?: ExcelExportProperties;
    /** Defines current excel work book that holds the pivot table information which will be used to export */
    workbook?: Workbook;
    /**
     * Defines the pivot chart export type
     *
     * @isEnumeration
     */
    type?: ExportType;
    /** Defines the page orientation of PDF export */
    orientation?: PdfPageOrientation;
    /**
     * Defines content width to be export
     */
    width?: number;
    /** Defines content height to be export
     */
    height?: number;
    /**
     * Determines if the table or chart will be exported to the current document.
     */
    currentExportView?: ExportView;
    /**
     * Defines the number of columns that will be exported for each PDF page.
     * > This option is applicable only when exporting the pivot table to PDF document.
     */
    columnSize?: number;
    /**
     * Specifies the margins of a PDF document when exporting a pivot table or pivot chart.
     */
    pdfMargins?: PdfMargins;
}

/**
 * Interface for defining the margins of the PDF document when exporting a pivot table or pivot chart.
 */
export interface PdfMargins {
    /**
     * Specifies the top margin of the PDF document.
     */
    top?: number;
    /**
     * Specifies the right margin of the PDF document.
     */
    right?: number;
    /**
     * Specifies the bottom margin of the PDF document.
     */
    bottom?: number;
    /**
     * Specifies the left margin of the PDF document.
     */
    left?: number;
}

/**
 * Defines the row and column page size of the pivot table to be exported while virtualization is enabled.
 *
 * @hidden
 */
export interface ExportPageSize {
    /**
     * Specifies the row page size.
     */
    rowSize?: number;
    /**
     * Specifies the column page size.
     */
    columnSize?: number;
}

/**
 * The PDF cell render event arguments provides the necessary information to customize the pivot cells while PDF exporting.
 */
export interface PdfCellRenderArgs {
    /** Defines the style of the current cell. */
    style?: PdfStyle;
    /** Defines the current PDF cell */
    cell?: PdfGridCell;
    /** Defines the current cell item */
    pivotCell?: IAxisSet;
    /** Defines the current cell's PDF column, which is used to customize the column width. */
    column?: PdfGridColumn;
}

/**
 * Defines the styles information to customize the PDF cell.
 */
export interface PdfStyle {
    /** Defines the font family */
    fontFamily?: string;
    /**
     * Defines the font size
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

/**
 * The cell click event arguments provides the necessary information about the cell clicked in the pivot table.
 */
export interface CellClickEventArgs {
    /** Defines the cell element that is clicked. */
    currentCell: Element;
    /** Defines the cell item that is clicked. */
    data: Object;
    /** Defines the native event properties. */
    nativeEvent: MouseEvent;
}

/**
 * The hyperlink cell click event arguments provides the necessary information about the cell clicked in the pivot table for hyperlink.
 */
export interface HyperCellClickEventArgs {
    /** Defines the cell element that is clicked. */
    currentCell: Element;
    /** Defines the cell item that is clicked. */
    data: Object;
    /** Defines an option to restrict the hyperlink cell click operation. By default, the value is in 'true' state. */
    cancel: boolean;
    /** Defines the native event properties. */
    nativeEvent: MouseEvent;
}

/**
 * The drill-through event arguments provides the necessary information about the cell clicked in the pivot table for drill-through.
 */
export interface DrillThroughEventArgs {
    /** Defines the cell element that is clicked. */
    currentTarget: Element;
    /** Defines the cell item that is clicked. */
    currentCell: IAxisSet;
    /** Defines the actual cell set information about the clicked cell. */
    rawData: IDataSet[];
    /** Defines the row header of the clicked cell. */
    rowHeaders: string;
    /** Defines the column header of the clicked cell. */
    columnHeaders: string;
    /** Defines the actual value of the clicked cell. */
    value: string;
    /**
     * Defines the grid cell information that used to render multiple header rows(stacked headers) on the Grid header in drill-through popup dialog.
     */
    gridColumns?: ColumnModel[];
    /** Defines an option to restrict the drill-through operation. */
    cancel?: boolean;
}

/**
 * The event argument which holds the information of the clicked multi-level label.
 */
export interface MultiLevelLabelClickEventArgs {
    /** Defines the chart axis. */
    axis: Axis;
    /** Defines the clicked label text. */
    text: string;
    /** Defines an option to restrict the drill up/down operation. */
    cancel?: boolean;
    /** Defines the pivot cell of the clicked label. */
    cell: IAxisSet;
}

/**
 * The event argument which holds the information of the multi-level labels that renders.
 */
export interface MultiLevelLabelRenderEventArgs extends IChartEventArgs {
    /** Defines the current axis. */
    axis: Axis;
    /** Defines axis current label text. */
    text: string;
    /** Defines font style for multi labels. */
    textStyle: FontModel;
    /** Defines text alignment for multi labels. */
    alignment: Alignment;
    /** Defines custom objects for multi labels. */
    customAttributes: object;
}

/**
 * The event argument which holds the editing information of the raw data made in corresponding aggregated cell.
 */
export interface EditCompletedEventArgs {
    /** Defines the edited raw data */
    currentData: IDataSet[];
    /** Defines the actual raw data */
    previousData: IDataSet[];
    /** Defines an option to restrict the pivot table update */
    cancel?: boolean;
    /** Defines the index position of the actual raw data */
    previousPosition: number[];
}

/**
 * The member filtering event arguments provides the necessary information about the filtering which is performing.
 */
export interface MemberFilteringEventArgs {
    /** Defines the filter settings that is currently applied. */
    filterSettings?: IFilter;
    /** Defines the current report. */
    dataSourceSettings?: IDataOptions;
    /** Defines an option to restrict the filtering operation. */
    cancel?: boolean;
}

/**
 * Defines the selected cells information on the pivot table.
 */
export interface CellSelectedObject {
    /** Defines the current cell item. */
    currentCell: IAxisSet;
    /**
     * Defines the current cell value.
     */
    value: number | string;
    /**
     * Defines the row header of the current cell.
     */
    rowHeaders: string | number | Date;
    /**
     * Defines the column header of the current cell.
     */
    columnHeaders: string | number | Date;
    /** Defines the measure of the current cell. */
    measure: string;
}

/**
 * The cell selected event arguments provide the necessary information about the pivot cells that have been selected.
 */
export interface PivotCellSelectedEventArgs extends CellSelectingEventArgs {
    /** Defines the collection of selected cells item. */
    selectedCellsInfo?: CellSelectedObject[];
    /** Defines pivot table cell collections */
    pivotValues?: IAxisSet[][];
    /** Defines the cell element that is selected. */
    currentTarget?: Element;
    /** Defines an option to restrict the cell selection operation. */
    cancel?: boolean;
    /** Defines the cell element that is selected. */
    target?: Element;
    /** Defines the whether the current cell is clicked of not. */
    isCellClick?: boolean;
    /** Defines the current cell item. */
    data?: IAxisSet;
}

/**
 * The drill event arguments provide the necessary information about the pivot cell that performing drill operation.
 */
export interface DrillArgs {
    /** Defines the current cell drill information. */
    drillInfo?: IDrilledItem;
    /** Defines the pivot table instance. */
    pivotview?: PivotView;
    /** Defines an option to restrict the drill operation. */
    cancel?: boolean;
}

/**
 * Defines the grid columns information that used to render as the pivot table header.
 */
export interface PivotColumn {
    /** Allows to enable/disable reordering of the column header. */
    allowReordering: boolean;
    /** Allows to enable/disable resizing of the column header. */
    allowResizing: boolean;
    /** Defines the header text of the column header. */
    headerText: string;
    /**
     * Defines the width of the column header.
     */
    width: string | number;
    /**
     * If `autoFit` set to true, then the column width will be
     * adjusted based on its content in the initial rendering itself.
     *
     * @default false
     */
    autoFit: boolean;
}

/**
 * The column render event arguments provide the necessary information about the pivot table column headers before rendering.
 */
export interface ColumnRenderEventArgs {
    /** Defines the collection of column headers information that used to render the pivot table column headers. */
    columns: PivotColumn[];
    /** Defines the current report. */
    dataSourceSettings: IDataOptions;
    /**
     * Defines the grid column information that used to display the column headers (stacked headers) based on its level in the Pivot Table.
     */
    stackedColumns?: ColumnModel[];
}

/**
 * The begin drill-through event arguments provide the necessary information about the cell clicked on the pivot table for drill-through and editing.
 */
export interface BeginDrillThroughEventArgs {
    /** Defines the current cell clicked information. */
    cellInfo: DrillThroughEventArgs;
    /** Defines the grid instance that used to customize the grid features such as grouping, filtering, sorting, etc., in the drill-through popup dialog. */
    gridObj: Grid;
    /** Defines the current event type. */
    type: string;
}

/**
 * The chart series created event arguments provide the necessary information about the chart series that used to create the pivot chart.
 */
export interface ChartSeriesCreatedEventArgs {
    /**
     * Defines the collection of chart series information that used to render the pivot chart.
     */
    series: SeriesModel[];
    /** Defines an option to restrict the pivot chart rendering. */
    cancel: boolean;
}

/**
 * Defines the cell selection settings
 */
export interface SelectionSettings {

    /**
     * Pivot widget supports row, column, cell, and both (row and column) selection mode.
     *
     * @default Row
     */
    mode?: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection
     * `mode` to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     *
     * @default Flow
     * @isEnumeration
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * * `Single`: Allows selection of only a row or a column or a cell.
     * * `Multiple`: Allows selection of multiple rows or columns or cells.
     *
     * @default Single
     */
    type?: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the selection is allowed only through checkbox.
     *
     * Note: To enable 'checkboxOnly' selection, should specify the column type as`checkbox`.
     *
     * @default false
     */
    checkboxOnly?: boolean;

    /**
     * If 'persistSelection' set to true, then the selection is persisted on all operations.
     * For persisting selection, any one of the column should be enabled as a primary key.
     *
     * @default false
     */
    persistSelection?: boolean;

    /**
     * Defines options for checkbox selection Mode. They are
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     *
     * @default Default
     * @isEnumeration
     */
    checkboxMode?: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     *
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
    cssClass: string;
    enableHtmlSanitizer: boolean;
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
 *
 * @hidden
 */
export interface IAction {
    updateModel?(): void;
    onActionBegin?(args?: Object, type?: string): void;
    onActionComplete?(args?: Object, type?: string): void;
    addEventListener?(): void;
    removeEventListener?(): void;
}

/**
 * Defines the row on excel export
 */
export interface ExcelRow {
    /**
     * Defines the index for cells
     */
    index?: number;
    /**  Defines the cells in a row */
    cells?: ExcelCell[];

}

/**
 * Defines the column on excel export
 */
export interface ExcelColumn {
    /**
     * Defines the index for cells
     */
    index?: number;
    /**
     * Defines the width of each column
     */
    width: number;

}

/**
 * Defines the style options for excel export
 */
export interface ExcelStyles extends ExcelStyle {
    /**
     * Defines the horizontal alignment for cell style
     */
    hAlign?: ExcelHAlign;
    /**
     * Defines the vertical alignment for cell style
     */
    vAlign?: ExcelVAlign;
    /** Defines the cell number format */
    numberFormat?: string;
}

/**
 * Defines the cell information for excel export
 */
export interface ExcelCell {
    /**
     * Defines the index for the cell
     */
    index?: number;
    /**
     * Defines the column span for the cell
     */
    colSpan?: number;
    /**
     * Defines the column span for the cell
     */
    rowSpan?: number;
    /**
     * Defines the value of the cell
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
    top: number; left: number; scrollDirection: { direction: string; position: number };
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

/**
 * Defines the theme options for PDF export
 */
export interface PdfTheme {
    /** Defines the style of header content. */
    header?: PdfThemeStyle;
    /** Defines the theme style of record content. */
    record?: PdfThemeStyle;
}

/**
 * Defines the theme options for PDF export
 */
export interface PdfThemeStyle {
    /**
     * Defines the font size of theme style.
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

/**
 * Defines the border options for PDF export
 */
export interface PdfBorder {
    /** Defines the border color */
    color?: string;
    /**
     * Defines the border width
     */
    width?: number;
    /** Defines the border dash style */
    dashStyle?: PdfBorderStyle;
}

/**
 * Defines the cell template information
 */
export interface CellTemplateArgs {
    /** Defines the cell element */
    targetCell?: HTMLElement;
    /** Defines the cell Information */
    cellInfo?: IAxisSet;
}

/**
 * The aggregate event arguments provide the necessary information on each pivot value cell framing in the pivot engine for pivot table render.
 */
export interface AggregateEventArgs {
    /** Defines the field name of the value cell. */
    fieldName?: string;
    /** Defines the row header information of the value cell. */
    row?: IAxisSet;
    /** Defines the column header information of the value cell. */
    column?: IAxisSet;
    /**
     * Defines the aggregate cell value of the current cell.
     */
    value?: number;
    /** Defines the actual data source collection that used to aggregate the value of the current cell. */
    cellSets?: IDataSet[];
    /** Defines whether the row header cell type is header or sub-total or grand-total. */
    rowCellType?: string;
    /** Defines whether the column header cell type is header or sub-total or grand-total. */
    columnCellType?: string;
    /** Defines the current aggregate type of the value cell. */
    aggregateType?: SummaryTypes;
    /** Defines an option to restrict the number formating of the current value cell. */
    skipFormatting?: boolean;
}

/**
 * The query cell event arguments provide the necessary information on each pivot cell rendering in the pivot table.
 */
export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with the current cell. */
    data?: Object;
    /** Defines the cell element. */
    cell?: Element;
    /**
     * Defines the column information associated with the current cell.
     */
    column?: Column;
    /**
     * Defines the number of columns used to span the current cell at column wise.
     */
    colSpan?: number;
    /**
     * Defines the number of rows used to span the current cell at row wise.
     */
    rowSpan?: number;
    /** Defines the current action. */
    requestType?: string;
    /** Define the foreign key row data associated with the current cell. */
    foreignKeyData?: Object;
    /** Define the pivot table instance object. */
    pivotview?: PivotView;
}

/**
 * The field list refreshed event arguments provide the necessary information to render the pivot table.
 */
export interface FieldListRefreshedEventArgs {
    /** Defines the current report. */
    dataSourceSettings?: IDataOptions;
    /** Defines the updated pivot table cell collections to update the pivot table. */
    pivotValues?: IAxisSet[][];
}

/**
 * Defines the offset position of the marker in the pivot chart.
 */
export interface OffsetModel {

    /**
     * Defines offset left position of the marker.
     *
     * @default 0
     */
    x?: number;

    /**
     * Defines offset top position of the marker.
     *
     * @default 0
     */
    y?: number;

}

/**
 * The member editor open event arguments provide the necessary information about the selected field and its filter settings on before filter popup opens.
 */
export interface MemberEditorOpenEventArgs {
    /** Defines the selected field name to perform filtering */
    fieldName?: string;
    /**
     * Defines the filter members of the selected field.
     */
    fieldMembers?: { [key: string]: Object }[];
    /** Defines selected field's filter settings */
    filterSetting?: IFilter;
    /** Defines an option to restrict the member editor popup from open. */
    cancel?: boolean;
}

/**
 * The field remove event arguments provide the necessary information about the selected field information before it removes.
 */
export interface FieldRemoveEventArgs {
    /** Defines the current pivot report. */
    dataSourceSettings?: IDataOptions;
    /** Defines the selected field name to remove from the current pivot report. */
    fieldName?: string;
    /** Defines the selected field information. */
    fieldItem?: IFieldOptions;
    /** Defines the axis name where the selected field would be removed. */
    axis?: string;
    /** Defines an option to restrict the field remove operation. */
    cancel?: boolean;
}

/**
 * The calculated field create event arguments provide the necessary information about the calculated field settings before it creates to update the pivot table.
 */
export interface CalculatedFieldCreateEventArgs {
    /** Defines current pivot report */
    dataSourceSettings?: IDataOptions;
    /** Defines the field name to create/update the calculated field settings. */
    fieldName?: string;
    /** Defines current calculated field's information that used to modify and update. */
    calculatedField?: ICalculatedFields;
    /**
     * Defines current calculated fields collection in the current pivot report.
     */
    calculatedFieldSettings?: ICalculatedFieldSettings[];
    /** Defines an option to restrict the calculated field create operation */
    cancel?: boolean;
}

/**
 * The number formatting event arguments provide the necessary information about the format settings of the selected field before it creates to update the pivot table.
 */
export interface NumberFormattingEventArgs {
    /**
     * Defines the current format settings collection
     */
    formatSettings?: IFormatSettings[];
    /** Defines the selected field name that used to apply the number formatting. */
    formatName?: string;
    /** Defines an option to restrict the format field create operation */
    cancel?: boolean;
}

/**
 * The aggregate menu open event arguments provide the necessary information to customize the aggregate menu options before it opens.
 */
export interface AggregateMenuOpenEventArgs {
    /**
     * Defines aggregate types collection that used to show it in the aggregate menu when it opens.
     */
    aggregateTypes?: AggregateTypes[];
    /** Defines the selected field name to open the aggregate menu. */
    fieldName?: string;
    /** Defines an option to restrict the context menu from open. */
    cancel?: boolean;
    /** Defines the menu count to be displayed initially. */
    displayMenuCount?: number;
}

/**
 * Defines the filter members information that used to render member filter dialog.
 */
export interface MemberItems {
    /** Defines whether the specific filter member has child(inner level) members or not. */
    hasChildren?: boolean;
    /**
     * Defines the custom HTML atttribute informations that used to add it specific filter member's DOM element in UI.
     */
    htmlAttributes?: { [key: string]: Object };
    /** Defines whether the specific filter member is include or not that used to be display in the pivot table. */
    isSelected?: boolean;
    /** Defines the unique name of a specific filter member. */
    id?: string;
    /** Defines the parent member's unique name of a specific filter member. */
    pid?: string;
    /** Defines the unique caption to a specific member that used to display in the filter dialog. */
    name?: string;
    /** Defines the filter member's caption. */
    caption?: string;
    /** Defines the unique tag name to a specific member. */
    tag?: string;
}

/**
 * @hidden
 */
export interface TreeDataInfo {
    index: number;
    isSelected: boolean;
}

/**
 * The before service invoke event arguments provide the necessary information about the service before it get invoked.
 */
export interface BeforeServiceInvokeEventArgs {
    /** Defines XML HTTP Request. */
    request?: XMLHttpRequest;
    /** Defines the data source settings. */
    dataSourceSettings?: IDataOptions;
    /** Defines the action which is being performed. */
    action?: string;
    /** Defines the custom properties which needs to pass to server side. */
    customProperties?: Object;
    /** Defines the drill item. */
    drillItem?: IDrilledItem;
    /** Defines the sort item. */
    sortItem?: ISort;
    /** Defines the aggregate item. */
    aggregatedItem?: IFieldOptions;
    /** Defines the calculated item. */
    calculatedItem?: ICalculatedFields;
    /** Defines the filter item. */
    filterItem?: IFilter;
    /** Defines the member name. */
    memberName?: string;
    /** Defines the raw data needs to be fetched. */
    fetchRawDataArgs?: FetchRawDataArgs;
    /** Defines the raw data needs to be updated. */
    editArgs?: UpdateRawDataArgs;
    /** Defines the hash string. */
    hash?: string;
    /** Defines the internal properties. */
    internalProperties?: Object;
    /** Defines the options for customizing the excel document during export. */
    excelExportProperties?: ExcelExportProperties;
    /** Allows you to export the pivot table data of all pages. */
    exportAllPages?: boolean;
    /** Defines whether the pivot table's group settings are modified or not. */
    isGroupingUpdated?: boolean;
}

/**
 * Represents the arguments that provide necessary information about the service after it has been invoked.
 */
export interface AfterServiceInvokeEventArgs {
    /**
     * Defines the response received from the service.
     */
    response?: string;

    /**
     * Defines the current action performed during the service invocation.
     */
    action?: string;
}

/**
 * Defines the raw data needs to be fetched.
 */
export interface UpdateRawDataArgs {
    /** Defines the raw data needs to be added. */
    addedData: IDataSet[];
    /** Defines the raw data needs to be removed. */
    removedData: object[];
    /** Defines the raw data needs to be updated. */
    updatedData: IDataSet[];
    /** Defines the index object. */
    indexObject: object[];
}

/**
 * Defines the raw data needs to be updated.
 */
export interface FetchRawDataArgs {
    /** Defines the column index. */
    columnIndex: number;
    /** Defines the row index. */
    rowIndex: number;
}

/**
 * The action begins event arguments provide information about the current UI action, such as the action name, current datasource settings,
 * and the selected field information which are configured based on the UI actions like
 * [`drill down/up`](../../pivotview/drill-down/#drill-down-and-drill-up),
 * [`value sorting`](../../pivotview/sorting/#value-sorting),
 * built-in [`toolbar`](../../pivotview/tool-bar/#built-in-toolbar-options) options,
 * [`grouping bar`](../../pivotview/grouping-bar/) and
 * [`field list`](../../pivotview/field-list/) buttons actions such as
 * [`sorting`](../../pivotview/sorting/), [`filtering`](../../pivotview/filtering/),
 * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
 * [`aggregate type`](../../pivotview/aggregation/#modifying-aggregation-type-for-value-fields-at-runtime) change and so on,
 * CRUD operation in [`editing`](../../pivotview/editing/) in the Pivot Table.
 */
export interface PivotActionBeginEventArgs {
    /** Defines the current data source settings information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list. */
    dataSourceSettings?: IDataOptions;
    /** Defines name of the current UI action when it begins. The following are the UI actions and their names:
     *
     * **Pivot Table**
     * * **Drill down** and **drill up** - Drill down/up.
     * * **Value sorting** - Sort value.
     *
     * **Toolbar**
     * * **New report** - Add new report.
     * * **Save report** - Save current report.
     * * **Save as report** - Save as current report.
     * * **Rename report** - Rename current report.
     * * **Remove report** - Remove current report.
     * * **Load report** - Load report.
     * * **Conditional Formatting** - Open conditional formatting dialog.
     * * **Number Formatting** - Open number formatting dialog.
     * * **Show Fieldlist** - Open field list.
     * * **Show Table** - Show table view.
     * * **Chart menu** - Show chart view.
     * * **Export menu** - PDF/Excel/CSV export.
     * * **Sub-totals menu** - Show/hide sub-totals.
     * * **Grand totals menu** - Show/hide grand totals.
     * * **MDX** - Open MDX dialog.
     *
     * **Grouping bar** and **Field List** buttons
     * * **Editing** - Edit calculated field.
     * * **Remove** - Remove field.
     * * **Sorting** - Sort field.
     * * **Filtering** - Filter field.
     * * **Aggregation** - Aggregate field.
     *
     * **Field List UI**
     * * **Field list tree** - Sort field tree.
     * * **Calculated field button** - Open calculated field dialog.
     *
     * **Editing**
     * * **Edit** - Edit record.
     * * **Save** - Save edited records.
     * * **Add** - Add new record.
     * * **Delete** - Remove record.
     */
    actionName?: string;
    /**
     * Defines the current field information on which field the action takes.
     * > This option is applicable only when the field-based UI actions are performed such as filtering, sorting, field remove, editing and aggregation change.
     */
    fieldInfo?: FieldItemInfo;
    /** Allow to restrict the current UI action. */
    cancel?: boolean;
}

/**
 * The action complete event arguments provide information about the current UI action, such as the current action name, current datasource settings, selected field information, and the current action information
 * which are configured based on the UI actions like
 * [`drill down/up`](../../pivotview/drill-down/#drill-down-and-drill-up),
 * [`value sorting`](../../pivotview/sorting/#value-sorting),
 * built-in [`toolbar`](../../pivotview/tool-bar/#built-in-toolbar-options) options,
 * [`grouping bar`](../../pivotview/grouping-bar/) and
 * [`field list`](../../pivotview/field-list/) buttons actions such as
 * [`sorting`](../../pivotview/sorting/), [`filtering`](../../pivotview/filtering/),
 * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
 * [`aggregate type`](../../pivotview/aggregation/#modifying-aggregation-type-for-value-fields-at-runtime) change and so on,
 * CRUD operation in [`editing`](../../pivotview/editing/) in the Pivot Table.
 */
export interface PivotActionCompleteEventArgs {
    /** Defines the current data source settings information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list. */
    dataSourceSettings?: IDataOptions;
    /** Defines name of the current UI action completed. The following are the UI actions and their names:
     *
     * **Pivot Table**
     * * **Drill down** and **drill up** - Drill down/up.
     * * **Value sorting** - Value sorted.
     *
     * **Toolbar**
     * * **New report** - New report added.
     * * **Save report** - Report saved.
     * * **Save as report** - Report re-saved.
     * * **Rename report** - Report renamed.
     * * **Remove report** - Report removed.
     * * **Load report** - Report loaded.
     * * **Conditional Formatting** - Conditional formatting applied.
     * * **Number Formatting** - Number formatting applied.
     * * **Show Fieldlist** - Field list closed.
     * * **Show Table** - Table view shown.
     * * **Chart menu** - Chart view shown.
     * * **Export menu** - PDF/Excel/CSV exported.
     * * **Sub-totals menu** - Sub-totals shown/hidden.
     * * **Grand totals menu** - Grand totals shown/hidden.
     * * **MDX** - MDX dialog closed.
     *
     * **Grouping bar** and **Field List** buttons
     * * **Editing** - Calculated field edited.
     * * **Remove** - Field removed.
     * * **Sorting** - Field sorted.
     * * **Filtering** - Field filtered.
     * * **Aggregation** - Field aggregated.
     *
     * **Field List UI**
     * * **Field list tree** - Field tree sorted.
     * * **Calculated field button** - Calculated field applied.
     *
     * **Editing**
     * * **Save** - Edited records saved.
     * * **Add** - New record added.
     * * **Delete** - Record removed.
     * * **Update** - Edited records updated.
     */
    actionName?: string;
    /** Defines the current field information on which field the action takes.
     * > This option is applicable only when the field-based UI actions are performed such as filtering, sorting, field remove, editing and aggregation change.
     */
    fieldInfo?: FieldItemInfo;
    /** Defines the unique information of the current UI action performed. */
    actionInfo?: PivotActionInfo;
}

/**
 * When the current UI action fails to achieve the desired result, the action failure event arguments provide necessary information about the current UI action, such as the current action name and failure information
 * which are configured based on the UI actions like
 * [`drill down/up`](../../pivotview/drill-down/#drill-down-and-drill-up),
 * [`value sorting`](../../pivotview/sorting/#value-sorting),
 * built-in [`toolbar`](../../pivotview/tool-bar/#built-in-toolbar-options) options,
 * [`grouping bar`](../../pivotview/grouping-bar/) and
 * [`field list`](../../pivotview/field-list/) buttons actions such as
 * [`sorting`](../../pivotview/sorting/), [`filtering`](../../pivotview/filtering/),
 * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
 * [`aggregate type`](../../pivotview/aggregation/#modifying-aggregation-type-for-value-fields-at-runtime) change and so on,
 * CRUD operation in [`editing`](../../pivotview/editing/) in the Pivot Table.
 */
export interface PivotActionFailureEventArgs {
    /** Defines the error information of the current action. */
    errorInfo?: Error;
    /** Defines the name of the current action before it is completed. The following are the UI actions and their names:
     *
     * **Pivot Table**
     * * **Drill down** and **drill up** - Drill down/up.
     * * **Value sorting** - Sort value.
     *
     * **Toolbar**
     * * **New report** - Add new report.
     * * **Save report** - Save current report.
     * * **Save as report** - Save as current report.
     * * **Rename report** - Rename current report.
     * * **Remove report** - Remove current report.
     * * **Load report** - Load report.
     * * **Conditional Formatting** - Open conditional formatting dialog.
     * * **Number Formatting** - Open number formatting dialog.
     * * **Show Fieldlist** - Open field list.
     * * **Show Table** - Show table view.
     * * **Chart menu** - Show chart view.
     * * **Export menu** - PDF/Excel/CSV export.
     * * **Sub-totals menu** - Show/hide sub-totals.
     * * **Grand totals menu** - Show/hide grand totals.
     * * **MDX** - Open MDX dialog.
     *
     * **Grouping bar** and **Field List** buttons
     * * **Editing** - Edit calculated field.
     * * **Remove** - Remove field.
     * * **Sorting** - Sort field.
     * * **Filtering** - Filter field.
     * * **Aggregation** - Aggregate field.
     *
     * **Field List UI**
     * * **Field list tree** - Sort field tree.
     * * **Calculated field button** - Open calculated field dialog.
     *
     * **Editing**
     * * **Edit** - Edit record.
     * * **Save** - Save edited records.
     * * **Add** - Add new record.
     * * **Delete** - Remove record.
     */
    actionName?: string;
}

/**
 * Defines the unique information of the current UI action performed such as sorting, filtering, drill, editing, report manipulation, summarization, etc.
 */
export interface PivotActionInfo {
    /** Defines the selected field’s sort settings to order their members either in ascending or descending that used to be displayed in the pivot table. */
    sortInfo?: ISort;
    /** Defines the selected field’s filter settings with either selective or conditional-based filter members that used to be displayed in the pivot table. */
    filterInfo?: IFilter;
    /** Defines the selected field’s drilled members settings that used to display the headers to be either expanded or collapsed in the pivot table. */
    drillInfo?: IDrillOptions;
    /** Defines the selected calculated field’s settings that used to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table. */
    calculatedFieldInfo?: ICalculatedFieldSettings;
    /** Defines the report name that used to create, load, rename save and save as current report. */
    reportName?: string | PivotReportInfo;
    /** Defines the export information such as current export type and its additional settings such as page size, orientation, header, footer, etc. */
    exportInfo?: PivotExportInfo;
    /**
     * Defines the edited information such as current edit type, action and its edited record information such as edited data, previous data and index positions of before editing performed.
     */
    editInfo?: PivotEditInfo;
    /** Defines the current condition formatting settings that used to change the appearance of the pivot table value cells with different style properties such as background color,
     * font color, font family, and font size based on specific conditions.
     */
    conditionalFormattingInfo?: IConditionalFormatSettings[];
    /** Defines the current format settings that used to display the values with specific format that used to be displayed in the pivot table. */
    numberFormattingInfo?: IFormatSettings[];
    /** Defines the current toolbar information such as current display options and its settings such as chart settings, grid settings, etc. */
    toolbarInfo?: PivotToolbarInfo;
    /** Defines the current value sort settings from current pivot report. */
    valueSortInfo?: IValueSortSettings;
}

/**
 * Defines the report name that used to create, load, rename save and save as current report.
 */
export interface PivotReportInfo {
    /** Defines the report name that used to be renamed. */
    oldName?: string;
    /** Defines the current report name after renamed. */
    newName?: string;
}

/**
 * Defines the export information such as current export type and its additional settings such as page size, orientation, header, footer, etc.
 */
export interface PivotExportInfo {
    /** Defines the current export type such as PDF, Excel, and CSV. */
    type?: string;
    /** Defines the additional settings for PDF, Excel, and CSV export such as page size, orientation, header, footer, etc. */
    info?: PdfExportProperties | ExcelExportProperties | string;
}

/**
 * Defines the edited information such as current edit type, action and its edited record information such as edited data, previous data and index positions of before editing performed.
 */
export interface PivotEditInfo {
    /** Defines the current edit type such as batch, inline, dialog and command columns. */
    type?: string;
    /** Defines the current edit action such as add, edit, save and delete. */
    action?: string;
    /** Defines the data that used to update the pivot table. */
    data?: IDataSet[];
    /** Defines the edited raw data */
    currentData?: IDataSet[];
    /** Defines the actual raw data */
    previousData?: IDataSet[];
    /** Defines the index position of the actual raw data */
    previousPosition?: number[];
}

/**
 * Defines the current toolbar information such as current display options and its settings such as chart settings, grid settings, etc.
 */
export interface PivotToolbarInfo {
    /** Defines the current display settings such as current view port as either pivot table or pivot chart or both table and chart. */
    displayOption?: DisplayOption;
    /** Defines the pivot table settings such as column width, row height, grid lines, text wrap settings, selection settings, etc. */
    gridSettings?: GridSettings;
    /** Defines the pivot chart settings such as chart series, chart area, axis labels, legends, border, crosshairs, theme, title, tooltip, zooming, etc. */
    chartSettings?: ChartSettings;
}

/**
 * Defines the current sorting information such as field name, sort order and members which is to be sorted.
 */
export interface HeadersSortEventArgs {
    /** Defines the name of the field to be sorted. */
    fieldName?: string;
    /** Defines the hierarchy. `Note`: It is applicable only for OLAP data. */
    levelName?: string;
    /** Defines the sort order for the members to be sorted. */
    sortOrder?: Sorting;
    /** Defines the members to be sorted. */
    members?: string[] | number[];
    /** Defines an option to restrict the unwanted custom sorting operation. By default, the value is in 'false' state. */
    IsOrderChanged?: boolean;
}

/**
 * The export complete event arguments provide the necessary information about the exported data after completing the file export.
 */
export interface ExportCompleteEventArgs {
    /** Defines the current export type such as PDF, Excel, and CSV. */
    type?: string;
    /** Defines the promise object for blob data. */
    promise?: Promise<{
        blobData: Blob;
    }>;
}
