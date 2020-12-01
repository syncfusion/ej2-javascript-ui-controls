import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, isBlazor } from '@syncfusion/ej2-base';import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged, compile, formatUnit } from '@syncfusion/ej2-base';import { removeClass, addClass, Event, KeyboardEventArgs, setValue, closest, select } from '@syncfusion/ej2-base';import { updateBlazorTemplate, resetBlazorTemplate, SanitizeHtmlHelper, MouseEventArgs } from '@syncfusion/ej2-base';import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet } from '../../base/engine';import { IPageSettings, IGroupSettings, IGridValues, IFieldListOptions, IValueSortSettings } from '../../base/engine';import { IDrilledItem, ICustomProperties, ISort, IFilter, IFieldOptions, ICalculatedFields, IDrillOptions } from '../../base/engine';import { IConditionalFormatSettings, IStringIndex, IField, IFormatSettings } from '../../base/engine';import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn, ChartLabelInfo, EditCompletedEventArgs, MultiLevelLabelClickEventArgs } from '../../common/base/interface';import { FetchReportArgs, LoadReportArgs, RenameReportArgs, RemoveReportArgs, ToolbarArgs } from '../../common/base/interface';import { PdfCellRenderArgs, NewReportArgs, ChartSeriesCreatedEventArgs, AggregateEventArgs } from '../../common/base/interface';import { ResizeInfo, ScrollInfo, ColumnRenderEventArgs, PivotCellSelectedEventArgs, SaveReportArgs } from '../../common/base/interface';import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, CellTemplateArgs } from '../../common/base/interface';import { BeforeExportEventArgs, EnginePopulatedEventArgs, BeginDrillThroughEventArgs, DrillArgs } from '../../common/base/interface';import { FieldListRefreshedEventArgs, MemberFilteringEventArgs, FieldDropEventArgs } from '../../common/base/interface';import { MemberEditorOpenEventArgs, FieldRemoveEventArgs, AggregateMenuOpenEventArgs } from '../../common/base/interface';import { CalculatedFieldCreateEventArgs, NumberFormattingEventArgs, FieldDragStartEventArgs } from '../../common/base/interface';import { Render } from '../renderer/render';import { PivotCommon } from '../../common/base/pivot-common';import { Common } from '../../common/actions/common';import { GroupingBar } from '../../common/grouping-bar/grouping-bar';import { DataSourceSettingsModel, DrillOptionsModel } from '../model/datasourcesettings-model';import { DataSourceSettings } from '../model/datasourcesettings';import { GridSettings } from '../model/gridsettings';import { GridSettingsModel } from '../model/gridsettings-model';import { PivotButton } from '../../common/actions/pivot-button';import { PivotFieldList } from '../../pivotfieldlist/base/field-list';import { Grid, Column, QueryCellInfoEventArgs, ColumnModel, Reorder, Resize, getObject } from '@syncfusion/ej2-grids';import { SelectionType, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellSelectEventArgs, RowSelectEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { RowDeselectEventArgs, ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';import { EditSettingsModel, HeaderCellInfoEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExport } from '../actions/excel-export';import { PDFExport } from '../actions/pdf-export';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { KeyboardInteraction } from '../actions/keyboard';import { PivotContextMenu } from '../../common/popups/context-menu';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';import { VirtualScroll } from '../actions/virtualscroll';import { DrillThrough } from '../actions/drill-through';import { Condition, GroupType } from '../../base/types';import { EditMode, ToolbarItems, View, Primary, AggregateTypes, ChartSeriesType } from '../../common';import { PivotUtil } from '../../base/util';import { Toolbar } from '../../common/popups/toolbar';import { PivotChart } from '../../pivotchart/index';import { ChartSettings } from '../model/chartsettings';import { ChartSettingsModel } from '../model/chartsettings-model';import { Chart, ITooltipRenderEventArgs, ILoadedEventArgs, IPointEventArgs, AccumulationChart } from '@syncfusion/ej2-charts';import { IResizeEventArgs, IAxisLabelRenderEventArgs, ExportType } from '@syncfusion/ej2-charts';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { ClickEventArgs, BeforeOpenCloseMenuEventArgs, ItemModel } from '@syncfusion/ej2-navigations';import { OlapEngine, IOlapCustomProperties, ITupInfo, IDrillInfo, IOlapField } from '../../base/olap/engine';import { NumberFormatting } from '../../common/popups/formatting-dialog';import { Grouping } from '../../common/popups/grouping';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class GroupingBarSettings
 */
export interface GroupingBarSettingsModel {

    /**
     * Allows you to show or hide the filter icon that used to be displayed on the pivot button of the grouping bar UI. 
     * This filter icon is used to filter the members of a particular field at runtime in the pivot table. 
     * > By default, the filter icon is enabled in the grouping bar.
     * @default true     
     */
    showFilterIcon?: boolean;

    /**
     * Allows you to show or hide the sort icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This sort icon is used to order members of a particular fields either in ascending or descending at runtime. 
     * > By default, the sort icon is enabled in the grouping bar.
     * @default true     
     */
    showSortIcon?: boolean;

    /**
     * Allows you to show or hide the remove icon that used to be displayed in the pivot button of the grouping bar UI. This remove icon is used to remove any field during runtime. 
     * > By default, the remove icon is enabled in the grouping bar.
     * @default true     
     */
    showRemoveIcon?: boolean;

    /**
     * Allows you to show or hide the value type icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This value type icon helps to select the appropriate aggregation type to value fields at runtime. 
     * > By default, the icon to set aggregate types is enabled in the grouping bar.
     * @default true     
     */
    showValueTypeIcon?: boolean;

    /**
     * Allow options to show the grouping bar UI to specific view port such as either pivot table or pivot chart or both table and chart. 
     * For example, to show the grouping bar UI to pivot table on its own, set the property `displayMode` to **Table**. 
     * > By default, the grouping bar UI will be shown to both pivot table as well as pivot chart.
     * @default Both
     */
    displayMode?: View;

    /**
     * Allows you to restrict the pivot buttons that were used to drag on runtime in the grouping bar UI. 
     * This will prevent you from modifying the current report. 
     * > By default, all fields are available for drag-and-drop operation in the grouping bar.
     * @default true     
     */
    allowDragAndDrop?: boolean;

}

/**
 * Interface for a class CellEditSettings
 */
export interface CellEditSettingsModel {

    /**
     * Allows you to add a new record to the data grid used to update the appropriate cells in the pivot table.
     * @default false
     */
    allowAdding?: boolean;

    /**
     * Allows you to edit the existing record in the data grid that used to update the appropriate cells in the pivot table.
     * @default false
     */
    allowEditing?: boolean;

    /**
     * Allows you to delete the existing record from the data grid that used to  update the appropriate cells in the pivot table.
     * @default false
     */
    allowDeleting?: boolean;

    /**
     * Allows an additional column appended in the data grid layout holds the command buttons to perform the CRUD operations to 
     * edit, delete, and update the raw items to the data grid that used to update the appropriate cells in the pivot table.
     * @default false
     */
    allowCommandColumns?: boolean;

    /**
    * Allows direct editing of a value cell without opening the edit dialog. NOTE: It is applicable only if the value cell is made by a single raw data. Otherwise editing dialog will be shown. 
    * > The `allowInlineEditing` property supports all modes of editing.
    * @default false
    */
    allowInlineEditing?: boolean;

    /**
     * Allow options for performing CRUD operations with different modes in the data grid that used to update the appropriate cells in the pivot table. 
     * The available modes are as follows: 
     * * `Normal`: Allows the currently selected row alone will be completely changed to edit state. You can change the cell values and save it to the data source by clicking “Update” toolbar button.
     * * `Dialog`: Allows the currently selected row data will be shown in an exclusive dialog. You can change the cell values and save it to the data source by clicking “Save” button in the dialog.
     * * `Batch`: Allows you to perform double-click on any data specific cell in the data grid, the state of that selected cell will be changed to edit state. 
     * You can perform bulk changes like add, edit and delete data of the cells and finally save to the data source by clicking “Update” toolbar button.
     * 
     * > Normal mode is enabled for CRUD operations in the data grid by default.
     * @default Normal
     */
    mode?: EditMode;

    /**
     * Allows you to restrict CRUD operations by double-clicking the appropriate value cell in the pivot table.
     * @default true
     */
    allowEditOnDblClick?: boolean;

    /**
     * Allows you to show a confirmation dialog to save and discard CRUD operations performed in the data grid that used to update the appropriate cells in the pivot table. 
     * > To use this option, it requires the property `mode` to be **Batch**, meaning, the `showConfirmDialog` option is only applicable for batch edit mode.
     * @default true
     */
    showConfirmDialog?: boolean;

    /**
     * Allows you to show the confirmation dialog to delete any records from the data grid. 
     * > The `showDeleteConfirmDialog` property supports all modes of editing.
     * @default false
     */
    showDeleteConfirmDialog?: boolean;

}

/**
 * Interface for a class ConditionalSettings
 */
export interface ConditionalSettingsModel {

    /**
     * Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
     */
    measure?: string;

    /**
     * Allows you to specify the row or column header to get visibility of hyperlink option for specifc row or column header.
     */
    label?: string;

    /**
     * Allows you to choose the operator type such as equals, greater than, less than, etc. The available operators are as follows:
     * * `LessThan`: Allows you to get the cells that have a value that is less than the start value.
     * * `GreaterThan`: Allows you to get the cells that have a value that is greater than the start value.
     * * `LessThanOrEqualTo`: Allows you to get the cells that have a value that is lesser than or equal to the start value.
     * * `GreaterThanOrEqualTo`: Allows you to get the cells that have a value that is greater than or equal to the start value.
     * * `Equals`:  Allows you to get the cells that have a value that matches with the start value.
     * * `NotEquals`: Allows you to get the cells that have a value that does not match with the start value.
     * * `Between`: Allows you to get the cells that have a value that between the start and end value.
     * * NotBetween: Allows you to get the cells that have a value that is not between the start and end value.
     * @default NotEquals
     */
    conditions?: Condition;

    /**
     * Allows you to set the start value to get visibility of hyperlink option based on the condition applied. 
     * For example, if the start value is 500 and the condition Equals is used, the hyperlink should be enabled to the cells that hold the value of 500 alone.
     */
    value1?: number;

    /**
     * Allows you to set the end value to get visibility of hyperlink option based on the condition applied. 
     * For example, if the start value is 500, the end value is 1500 and the condition Between is used, the hyperlink should be enabled to the cells that holds the value between 500 to 1500.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     */
    value2?: number;

}

/**
 * Interface for a class HyperlinkSettings
 */
export interface HyperlinkSettingsModel {

    /**
     * Allows you to set the visibility of hyperlink in all cells that are currently shown in the pivot table.
     * @default false     
     */
    showHyperlink?: boolean;

    /**
     * Allows you to set the visibility of hyperlink in row headers that are currently shown in the pivot table.
     * @default false     
     */
    showRowHeaderHyperlink?: boolean;

    /**
     * Allows you to set the visibility of hyperlink in column headers that are currently shown in the pivot table.
     * @default false     
     */
    showColumnHeaderHyperlink?: boolean;

    /**
     * Allows you to set the visibility of hyperlink in value cells that are currently shown in the pivot table.
     * @default false     
     */
    showValueCellHyperlink?: boolean;

    /**
     * Allows you to set the visibility of hyperlink in summary cells that are currently shown in the pivot table.
     * @default false     
     */
    showSummaryCellHyperlink?: boolean;

    /**
     * Allow options for setting the visibility of hyperlink based on specific condition. The options available here are as follows:
     * * `measure`: Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
     * * `condition`: Allows you to choose the operator type such as equals, greater than, less than, etc.
     * * `value1`: Allows you to set the start value.
     * * `value2`: Allows you to set the end value. This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     * @default []
     */
    conditionalSettings?: ConditionalSettingsModel[];

    /**
     * Allows you to set the visibility of hyperlink in the cells based on specific row or column header.
     */
    headerText?: string;

    /**
     * Allows you to add the CSS class name to the hyperlink options. Use this class name you can apply styles to a hyperlink easily at your end.
     * @default ''
     */
    cssClass?: string;

}

/**
 * Interface for a class DisplayOption
 */
export interface DisplayOptionModel {

    /**
     * Allows you to choose the view port as either table or chart or both table and chart. The available options are:
     * * `Table`: Allows you to render the component as tabular form. 
     * * `Chart`: Allows you to render the component as graphical format.
     * * `Both`: Allows you to render the component as both table and chart.
     * > By default, **Table** is used as a default view in the component.
     * @default Table     
     */
    view?: View;

    /**
     * Allows you to set the primary view to be either table or chart.The available options are:
     * * `Table`: Allows you to display the pivot table as primary view.
     * * `Chart`: Allows you to display the pivot chart as primary view.
     * > To use this option, it requires the property `view` to be **Both**.
     * @default Table     
     */
    primary?: Primary;

}

/**
 * Interface for a class PivotView
 */
export interface PivotViewModel extends ComponentModel{

    /**
     * Allows values with a specific country currency format to be displayed in the pivot table. 
     * Standard currency codes referred to as ISO 4217 can be used for the formatting of currency values. 
     * For example, to display "US Dollar($)" currency values, set the `currencyCode` to **USD**. 
     * > It is applicable ony for Relational data.
     * @private
     */
    currencyCode?: string;

    /**
     * Allows built-in popup field list to be enabled in the pivot table UI. 
     * The popup field list will be displayed over the pivot table UI without affecting any form of UI shrink, 
     * and allows to manipulate the pivot report through different ways such as add or remove fields and 
     * also rearrange them between different axes, including column, row, value, and filter along with sort and 
     * filter options dynamically at runtime to update the pivot table. 
     * > By default, the icon used to display the field list will be positioned at the top left corner of the pivot table UI. 
     * When groupingBar is enabled, the icon will be placed at the top right corner of the pivot table.
     * @default false
     */
    showFieldList?: boolean;

    /**
     * Allows the set of options to customize rows, columns, values cell and its content in the pivot table. The following options to customize the pivot table are:
     * * `height`: Allow the height of the pivot table content to be set, 
     * meaning that the height given should be applied without considering the column headers in the pivot table.
     * * `width`: Allow to set width of the pivot table. **Note: The pivot table will not display less than 400px, 
     * as it is the minimum width to the component.** 
     * * `gridLines`: Allow the options for customizing the cell borders of each cell to be displayed in the pivot table. 
     * For example, to display a pivot table without cell borders, set the property `gridLines` to **None**.
     * * `allowTextWrap`: Allow the contents of the cells to be wrapped when they exceed the width of the cells in the pivot table.
     * * `textWrapSettings`: Allows options to wrap either column and row header or value or both header and cell content. 
     * For example, to allow the wrap option to value cells alone, then set the property `wrapMode` to **Content** in the `textWrapSettings` class.
     * * `allowReordering`: Allows to reorder a specific column header from one index to another index in the pivot table by drag-and-drop.
     * * `allowResizing`: Allows the columns to be resized by clicking and dragging the right edge of the column headers.
     * * `rowHeight`: Allow to set height to the pivot table rows commonly.
     * * `columnWidth`: Allow to set width to the pivot table columns commonly.
     * * `clipMode`: Allows the contents of the cell overflow to be displayed in the pivot table. 
     * For example, to truncate the cell content of a cell when it overflows with respect to its cell width, set the property `clipMode` to **Clip**.
     * * `allowSelection`: Allows a row or column or cell to be highlighted by simply clicking or arrow key in the pivot table.
     * * `selectionSettings`: Allow set of options to customize the selection of a row or column or cell by simply clicking on the arrow key in the pivot table. 
     * For example, to highlight both rows and columns with multiple selection, set the properties `mode` to **Both** and `type` to **Multiple** in `selectionSettings` class.
     * * `selectedRowIndex`: Allows to highlight specific row in the pivot table during initial rendering. For example, to highlight the pivot table's first row, set the property `selectedRowIndex` to **0**.
     * * `contextMenuItems`: Allows to show built-in context with pre-defined menu option or custom menu options by simply right clicking on the pivot table cell.
     */
    gridSettings?: GridSettingsModel;

    /**
     * Allows a set of options to customize a pivot chart with a variety of settings, such as chart series, chart area, axis labels, legends, border, crosshairs, theme, title, tooltip, zooming, etc. 
     * The following options are available to customize the pivot chart.
     * * `background`: Allows you to change the background color of the chart series in the pivot chart. 
     * For example, to display the chart series with background color as red, set the property `background` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"**.
     * * `border`: Allow options to customize the border of the chart series such as color and border size in the pivot chart. 
     * For example, to display the chart series border color as red, set the properties `color` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
     * * `chartArea`: Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart. 
     * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
     * * `chartSeries`: Allow options to customize the chart series with different settings such as fill color, animation of the series, 
     * series width, border, visibility of the series, opacity, chart series types, marker, tooltip, trendlines, etc., in the pivot chart. 
     * For example, to display the line type pivot chart, set the property `type` to **Line**.
     * * `crosshair`: Allow options to customize the crosshair line with different settings such as color and width of the line, 
     * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
     * * `description`: Allows you to add a description of the pivot chart.
     * * `enableAnimation`: Allows you to enable/disable the tooltip animation while performing the mouse move from one point to another in the pivot chart.
     * * `enableExport`: Allows the pivot chart to be exported to either **PDF** or **PNG** or **JPEG** or **SVG** filter formats.
     * * `enableMultiAxis`: Allows you to draw the pivot chart with multiple value fields as separate chart area.
     * * `enableSideBySidePlacement`: Allows you to draw points of the column type pivot chart series as side by side.
     * * `isMultiSelect`: Allows you to perform multiple selection in the pivot chart. To enable this option, it requires the property `selectionMode` to be **Point** or **Series** or **Cluster**.
     * * `isTransposed`: Allows you to render the pivot chart in a transposed manner or not.
     * * `legendSettings`: Allow options for customizing legends with different properties such as legend visibility, 
     * height, width, position, legend padding, alignment, textStyle, border, margin, background, opacity, description, tabIndex in the pivot chart.
     * * `margin`: Allow options to customize the left, right, top and bottom margins of the pivot chart.
     * * `palettes`: Allows you to draw the chart series points with custom color in the pivot chart.
     * * `primaryXAxis`: Allow options to customize the horzontal(row) axis with different properties such as labelIntersectAction, labelStyle, title, 
     * description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and 
     * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
     * * `primaryYAxis`: Allow options to customize the vertical(value) axis with different properties such as labelIntersectAction, labelStyle, 
     * title, description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and 
     * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
     * * `selectedDataIndexes`: Allows you to highlight a specific point of the series while rendering the pivot chart. 
     * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
     * * `selectionMode`: Allow options for customizing the selection mode to be done either by a specific series or point or cluster or by dragging it to the pivot chart. 
     * For example, to highlight a specific point in a specific series of the pivot chart, set the property `selectionMode` to **Point**.
     * * `showMultiLevelLabels`: Allows you to display the multi-level label feature in the pivot chart. This multi-level labels used to perform drill operation in the pivot chart.
     * * `subTitle`: Allows you to add the subtitle to the pivot chart.
     * * `subTitleStyle`: Allow options to customize the subtitle in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
     * * `tabIndex`: Allows you to highlight specific legends by clicking the mouse or by interacting with the keyboard in the pivot chart.
     * * `theme`: Allows you to draw a pivot chart with either material, fabric, bootstrap, highcontrast light, material dark, fabric dark, highcontrast, bootstrap dark, bootstrap4 theme.
     * * `title`: Allows you to add title to the pivot chart.
     * * `titleStyle`: Allow options to customize the title in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
     * * `tooltip`: Allow options to customize the tooltip of the pivot chart with different properties such as visibility of the tooltip, enableMarker, fill color, opacity, header for tooltip, 
     * format, textStyle, template, border, enableAnimation.
     * * `useGroupingSeparator`: Allows the group separator to be shown to the values in the pivot chart.
     * * `value`: Allows you to draw a pivot chart with a specific value field during initial loading.
     * * `zoomSettings`: Allow options to customize the pivot chart zooming with different properties such as enablePinchZooming, enableSelectionZooming, 
     * enableDeferredZooming, enableMouseWheelZooming, zoom modes, toolbarItems, enableScrollbar and enablePan.
     */
    chartSettings?: ChartSettingsModel;

    /**
     * Allows a set of options for customizing the grouping bar UI with a variety of settings such as UI visibility to a specific view port, 
     * customizing the pivot button features such as filtering, sorting, changing aggregate types, removing any fields. 
     * The options available to customize the grouping bar UI are:
     * * `showFilterIcon`: Allows you to show or hide the filter icon that used to be displayed on the pivot button of the grouping bar UI. 
     * This filter icon is used to filter the members of a particular field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This sort icon is used to order members of a particular fields either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This remove icon is used to remove any field during runtime.
     * * `showValueTypeIcon`: Allows you to show or hide the value type icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This value type icon helps to select the appropriate aggregation type to value fields at runtime.
     * * `displayMode`: Allow options to show the grouping bar UI to specific view port such as either pivot table or pivot chart or both table and chart. 
     * For example, to show the grouping bar UI to pivot table on its own, set the property `displayMode` to **Table**.
     * * `allowDragAndDrop`: Allows you to restrict the pivot buttons that were used to drag on runtime in the grouping bar UI. This will prevent you from modifying the current report.
     */
    groupingBarSettings?: GroupingBarSettingsModel;

    /**
     * Allow a set of options to display a hyperlink to link data for individual cells that are shown in the pivot table. 
     * These options allow you to enable a separate hyperlink for row headers, column headers, value cells, and summary cells in the `hyperlinkSettings` class. 
     * The options available are:
     * * `showHyperlink`: Allows you to set the visibility of hyperlink in all cells.
     * * `showRowHeaderHyperlink`: Allows you to set the visibility of hyperlink in row headers.
     * * `showColumnHeaderHyperlink`: Allows you to set the visibility of hyperlink in column headers.
     * * `showValueCellHyperlink`: Allows you to set the visibility of hyperlink in value cells.
     * * `showSummaryCellHyperlink`: Allows you to set the visibility of hyperlink in summary cells.
     * * `headerText`: Allows you to set the visibility of hyperlink based on header text.
     * * `conditionalSettings`: Allows you to set the visibility of hyperlink based on specific condition.
     * * `cssClass`: Allows you to add CSS class name to the hyperlink options.
     * 
     * > By default, the hyperlink options are disabled for all cells in the pivot table.
     */
    hyperlinkSettings?: HyperlinkSettingsModel;

    /**
     * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
     * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
     * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
     * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list.
     * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization. 
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicale only for OLAP data source.**
     * * `dataSource`: Allows you to set the data source as JSON collection to the pivot report either from local or from remote server to the render the pivot that and field list. 
     * You can fetch JSON data from remote server by using DataManager. **Note: It is applicable only for relational data source.**
     * * `rows`: Allows specific fields associated with field information that needs to be displayed in row axis of pivot table.
     * * `columns`: Allows specific fields associated with field information that needs to be displayed in column axis of pivot table.
     * * `values`: Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table.
     * * `filters`: Allows to filter the values in other axis based on the collection of filter fields in pivot table.
     * * `excludeFields`: Allows you to restrict the specific field(s) from displaying it in the field list UI. 
     * You may also be unable to render the pivot table with this field(s) by doing so. **Note: It is applicable only for relational data source.**
     * * `expandAll`: Allows you to either expand or collapse all the headers that are displayed in the pivot table. 
     * By default, all the headers are collapsed in the pivot table. **Note: It is applicable only for Relational data.**
     * * `valueAxis`: Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
     * * `filterSettings`: Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
     * * `sortSettings`: Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table. 
     * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
     * * `enableSorting`: Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
     * * `formatSettings`: Allows specific fields used to display the values with specific format that used to be displayed in the pivot table. 
     * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
     * * `drilledMembers`: Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
     * * `valueSortSettings`: Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
     * * `calculatedFieldSettings`: Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * * `allowMemberFilter`: Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
     * * `allowLabelFilter`: Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
     * * `allowValueFilter`: Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
     * * `showSubTotals`: Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
     * * `showRowSubTotals`: Allows to show or hide sub-totals in row axis of the pivot table.
     * * `showColumnSubTotals`: Allows to show or hide sub-totals in column axis of the pivot table.
     * * `showGrandTotals`: Allows to show or hide grand totals in both rows and columns axis of the pivot table.
     * * `showRowGrandTotals`: Allows to show or hide grand totals in row axis of the pivot table.
     * * `showColumnGrandTotals`: Allows to show or hide grand totals in column axis of the pivot table.
     * * `showHeaderWhenEmpty`: Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data. 
     * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
     * * `alwaysShowValueHeader`: Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
     * * `conditionalFormatSettings`: Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
     * * `emptyCellsTextContent`: Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
     * * `groupSettings`: Allows specific fields to group their data on the basis of their type. 
     * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc. 
     * You can perform custom group to the string type fields that used to displayed in the pivot table.
     * * `showAggregationOnValueField`: Allows the pivot button with specific value field caption along with the aggregation type, to be displayed in the grouping bar and field list UI. 
     * For example, if the value field "Sold Amount" is aggregated with Sum, it will be displayed with caption "Sum of Sold Amount" in its pivot button.
     * * `authentication`: Allows you to set the credential information to access the specified SSAS cube. **Note: It is applicable only for OLAP data source**.
     */
    dataSourceSettings?: DataSourceSettingsModel;

    /**
     * Allow options for performing CRUD operations, such as add, edit, delete, and update the raw items of any cell from the pivot table. 
     * The raw items can be viewed in a data grid that used to be displayed as a dialog by double-clicking the appropriate value cell in the pivot table. 
     * CRUD operations can be performed in this data grid either by double-clicking the cells or using toolbar options. 
     * The options available are as follows:
     * * `allowAdding`: Allows you to add a new record to the data grid used to update the appropriate cells in the pivot table.
     * * `allowEditing`: Allows you to edit the existing record in the data grid that used to update the appropriate cells in the pivot table.
     * * `allowDeleting`: Allows you to delete the existing record from the data grid that used to  update the appropriate cells in the pivot table.
     * * `allowCommandColumns`: Allows an additional column appended in the data grid layout holds the command buttons to perform the CRUD operations to edit, 
     * delete, and update the raw items to the data grid that used to update the appropriate cells in the pivot table.
     * * `mode`: Allow options for performing CRUD operations with different modes in the data grid that used to update the appropriate cells in the pivot table. 
     * The available modes are normal, batch and dialog. **Normal** mode is enabled for CRUD operations in the data grid by default.
     * * `allowEditOnDblClick`: Allows you to restrict CRUD operations by double-clicking the appropriate value cell in the pivot table.
     * * `showConfirmDialog`: Allows you to show the confirmation dialog to save and discard CRUD operations performed in the data grid that used to update the appropriate cells in the pivot table.
     * * `showDeleteConfirmDialog`: Allows you to show the confirmation dialog to delete any records from the data grid.
     * * `allowInlineEditing`: Allows direct editing of a value cell without opening the edit dialog. NOTE: It is applicable only if the value cell is made by a single raw data. Otherwise editing dialog will be shown.
     * 
     * > This feature is applicable only for the relational data source.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, allowCommandColumns: false, 
     * mode:'Normal', allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false, allowInlineEditing: false }
     */
    editSettings?: CellEditSettingsModel;

    /**
     * Allow options to configure the view port as either pivot table or pivot chart or both table and chart. The options available are:
     * * `view`: Allows you to choose the view port as either pivot table or pivot chart or both table and chart. 
     * * `primary`: Allows you to set the primary view to be either pivot table or pivot chart. To use this option, it requires the property `view` to be **Both**. 
     */
    displayOption?: DisplayOptionModel;

    /**
     * It holds the collection of cell information that has been populated from the engine on the basis of the given pivot report to render the component as table and chart.
     */
    pivotValues?: IPivotValues;

    /**
     * Allows you to show the grouping bar UI in the pivot table that automatically populates fields from the bound report. 
     * It also allows you to modify the report with a variety of actions using the pivot buttons to update the pivot table during runtime. 
     * The following are: 
     * * Re-arranging fields through drag-and-drop operation between row, column, value and filter axes.
     * * Remove fields from the existing report using remove icon.
     * * Filtering members of specific fields using filter icon.
     * * Sorting members of specific fields using sort icon.
     * * Editing the calculated fields using edit icon.
     * * Selecting required aggregate types to value field using dropdown icon.
     * @default false
     */
    showGroupingBar?: boolean;

    /**
     * Allows you to display the tooltip to the value cells either by mouse hovering or by touch in the pivot table. 
     * The information used to be displayed in the tooltip is:
     * * Row: Holds the row header information of a specific value cell.
     * * Column: Holds the column header information of a specific value cell.
     * * Value: Holds the value field caption along with its value of a specific value cell.

     * @default true
     */
    showTooltip?: boolean;

    /**
     * Allows you to show the toolbar UI that holds built-in toolbar options to accessing frequently used features like 
     * switching between pivot table and pivot chart, changing chart types, conditional formatting, number formatting, exporting, etc… with ease at runtime.
     * @default false     
     */
    showToolbar?: boolean;

    /**
     * Allows the built-in toolbar options that used to access features like switching between pivot table and pivot chart, changing chart types, conditional formatting, number formatting, exporting, etc… with ease at runtime. 
     * The available toolbar options are:
     * * `New`: Allows to create a new report.
     * * `Save`: Allows to save the current report.
     * * `Save As`: Allows to perform save as the current report.
     * * `Rename`: Allows to rename the current report.
     * * `Remove`: Allows to delete the current report.
     * * `Load`: Allows to load any report from the report list.
     * * `Grid`: Allows to show the pivot table.
     * * `Chart`: Allows to show the pivot chart with specific type from the built-in list. 
     * It also has the option to show the chart with multiple axes based on the value fields bound to the report. 
     * You can do this by selecting the checkbox at the bottom of the list.
     * * `Exporting`: Allow set of options to export the pivot table as PDF/Excel/CSV and the pivot chart as PDF and image format such as PNG, JPEG, SVG.
     * * `Sub-total`: Allow set of options to show or hide the sub totals in the pivot table. The subtotals will not be displayed in the pivot chart by default.
     * * `Grand Total`: Allow set of options to show or hides the grand totals in the pivot table. By default, the grand totals will not be displayed in the pivot chart.
     * * `Conditional Formatting`: Allows to show the conditional formatting pop-up to apply formatting to the values.
     * * `Number Formatting`: Allows to show the number formatting pop-up to apply number formatting to the values.
     * * `Formatting`: Allow options to show the conditional formatting and the number formatting pop-up that used to apply formatting to the values in the component.
     * * `Field List`: Allows you to show the field list pop-up. It allows you to modify the report with a variety of actions such as re-arrange the fields between axes by drag-and-drop, 
     * add new fields to report, remove any fields from report, filtering and sorting a specific field members, etc., that are used to update the pivot table during runtime.
     * * `MDX`: Allows ro show the MDX query that was run to retrieve data from the OLAP data source. **Note: It is applicable only for OLAP data source.**
     * 
     * > The toolbar option can be displayed based on the order you provided in the toolbar collection.
     * @default null
     */
    toolbar?: (ToolbarItems | ItemModel)[];

    /**
     * Allows you to create a pivot button with "Values" as a caption used to display in the grouping bar and field list UI. 
     * It helps you to plot the value fields to either column or row axis during runtime.
     * > The showValuesButton property is enabled by default for the OLAP data source. 
     * And the pivot button can be displayed with "Measures" as a caption used to display in the grouping bar and field list UI.
     * @default false
     */
    showValuesButton?: boolean;

    /**
     * Allows the built-in calculated field dialog to be displayed in the component. 
     * You can view the calculated field dialog by clicking the "Calculated Field" button in the field list UI. 
     * This dialog will helps you to create a new calculated field in the pivot table, based on available fields from the bound data source or using simple formula with basic arithmetic operators at runtime.
     * @default false
     */
    allowCalculatedField?: boolean;

    /**
     * Allows you to sort individual value field and its aggregated values either in row or column axis to ascending or descending order. 
     * You can sort the values by clicking directly on the value field header positioned either in row or column axis of the pivot table.
     * @default false
     */
    enableValueSorting?: boolean;

    /**
     * Allows you to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions. 
     * You can apply the conditioanl formatting at runtime through the built-in dialog, invoked from the toolbar. 
     * To do so, set `allowConditionalFormatting` and `showToolbar` properties to **true** to the component. 
     * Also, include the toolbar option **ConditionalFormatting** in the `toolbar` property.
     * > You can also view the conditioanl formatting dialog by clicking an external button using the `showConditionalFormattingDialog` method.
     * @default false
     */
    allowConditionalFormatting?: boolean;

    /**
     * Allows you to apply required number formatting to the pivot table values such as number, curreny, percentage or other custom formats at runtime through a built-in dialog, invoked from the toolbar. 
     * To do so, set allowNumberFormatting and showToolbar properties to true to the component. 
     * Also, include the toolbar option NumberFormatting in the toolbar property.
     * > You can also view the number formatting dialog by clicking an external button using the ShowNumberFormattingDialog method.
     * @default false
     */
    allowNumberFormatting?: boolean;

    /**
     * Allow the height of the pivot table to be set.
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Allow the width of the pivot table to be set. 
     * > The pivot table will not display less than 400px, as it is the minimum width to the component.
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Allows the pivot table data to be exported as an Excel document. Export can be done in two different file formats such as  XLSX and CSV formats. 
     * You can export pivot table using the build-in toolbar option. To do so, set `allowExcelExport` and `showToolbar` properties to true to the component. 
     * Also, include the toolbar option **Exporting** in the `toolbar` property.
     * > You can also export the pivot table data by clicking an external button using the excelExport method. Use csvExport method to export the pivot table data to CSV format.
     * @default false    
     */
    allowExcelExport?: boolean;

    /**
     * Allows to load the large amounts of data without any performance degradation by rendering rows and columns only in the current content view port. 
     * Rest of the aggregated data will be brought into view port dynamically based on vertical or horizontal scroll position.
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Allows to view the underlying raw data of a summarized cell in the pivot table. 
     * By double-clicking on any value cell, you can view the detailed raw data in a data grid inside a new window. 
     * In the new window, row header, column header and measure name of the clicked cell will be shown at the top. 
     * You can also include or exclude fields available in the data grid using column chooser option.
     * @default false
     */
    allowDrillThrough?: boolean;

    /**
     * Allows the pivot table data to be exported as an PDF document. You can export pivot table using the build-in toolbar option. 
     * To do so, set `allowPdfExport` and `showToolbar` properties to true to the component. 
     * Also, include the toolbar option **Exporting** in the `toolbar` property.
     * > You can also export the pivot table data by clicking an external button using the pdfExport method.
     * @default false    
     */
    allowPdfExport?: boolean;

    /**
     * Allows the pivot table component to be updated only on demand, meaning, 
     * you can perform a variety of operations such as drag-and-drop fields between row, column, value and filter axes, 
     * apply sorting and filtering inside the Field List, resulting the field list UI would be updated on its own, but not the pivot table.
     * On clicking the “Apply” button in the Field List, the pivot table will updates the last modified report. 
     * This helps to improve the performance of the pivot table component rendering.
     * @default false
     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * Allows large amounts of data to be loaded without any degradation of performance by compressing raw data on the basis of its uniqueness. 
     * These unique records will be provided as input to render the pivot table. 
     * 
     * For example, if the pivot table is connected to a million raw data with a combination of 1,000 unique data, it will be compressed to 1,000 unique data. 
     * By doing so, the time taken to render the pivot table will be drastically reduced, i.e. the pivot table will takes a maximum of 3 seconds instead of 10 seconds to complete its rendering.
     * These compressed data will also be used for further operations at all times to reduce the looping complexity and improves pivot table's performance while updating during runtime.
     * 
     * To use this option, it requires the property `enableVirtualization` to be **true**.
     * > This property is applicable only for relational data source.
     * @default false
     */
    allowDataCompression?: boolean;

    /**
     * Allows you to set the limit for displaying members while loading large data in the member filter dialog. 
     * Based on this limit, initial loading will be completed quickly without any performance constraint.
     * A message with remaining member count, that are not currently shown in the member filter dialog UI, will be displayed in the member editor.
     * > This property is not applicable to user-defined hierarchies in the OLAP data source.
     * @default 1000    
     */
    maxNodeLimitInMemberEditor?: number;

    /**
     * Allows you to set the maximum number of raw data that used to view it in a data grid inside a new window while performing drill through on summarized cells in the pivot table. 
     * For example, if the value cell has a combination of more than 50,000 records, it allows only 10,000 records fetch from the cube and displayed in the data grid.
     * > This property is applicable only for the OLAP data source.
     * @default 10000 
     */
    maxRowsInDrillThrough?: number;

    /**
     * Allows to load members inside the member filter dialog on-demand. 
     * The first level members will be loaded from the OLAP cube to display the member editor by default. 
     * As a result, the member editor will be opened quickly, without any performance constraints.
     * You can use either of the following actions to load  your next level members. The actions are: 
     * * By clicking on the respective member's expander button. By doing so, only the child members of the respective member will be loaded. 
     * * Choose the level from the drop-down button. By doing so, all the members up to the level chosen will be loaded from the cube.
     * 
     * Also, searching members will only be considered for the level members that are loaded.
     * > This property is applicable only for OLAP data source.
     * @default true    
     */
    loadOnDemandInMemberEditor?: boolean;

    /**
     * Allows to restrict the cross-site scripting while using cell template, meaning it will remove the unwanted scripts,styles or HTML in your cell template. 
     * > In general, the cross-site scripting known as XSS is a type of computer security vulnerability typically found in web applications.
     * It attacks enable attackers to inject client-side scripts into web pages viewed by other users.
     * @default true    
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Allows the table cell elements to be customized with either an HTML string or the element’s ID, 
     * that can be used to add additional HTML elements with custom formats to the cell elements that are displayed in the pivot table.
     * @default null
     */
    cellTemplate?: string;

    /**
     * It allows to define the "ID" of div which is used as template in toolbar panel.
     * @default null
     */
    toolbarTemplate?: string;

    /**
     * Allows the tooltip element to be customized with either an HTML string or the element’s ID,
     * can be used to displayed with custom formats either by mouse hovering or by touch in the pivot table.
     * @default null
     */
    tooltipTemplate?: string;

    /**
     * Allows the appearance of the loading indicator to be customized with either an HTML string or the element’s ID, 
     * that can be used to displayed with custom formats in the pivot table.
     * @default null
     */
    spinnerTemplate?: string;

    /**
     * Allows you to show the grouping UI in the pivot table that automatically groups date, time, number and string at runtime 
     * by right clicking on the pivot table’s row or column header, select **Group**. This will shows a dialog in which you can perform grouping with appropriate options to group the data. 
     * To ungroup, right click on the pivot table’s row or column header, select **Ungroup**.
     * > This property is applicable only for relational data source.
     * @default false
     */
    allowGrouping?: boolean;

    /**
     * Allows you to export the pivot table data of all pages, i.e. the data that holds all the records given to render the pivot table will be exported as either an Excel or a PDF document.
     * 
     * To use this option, it requires the property `enableVirtualization` to be **true**.
     * @default true
     */
    exportAllPages?: boolean;

    /**
     * Allows you to show a menu with built-in aggregate options displayed in the pivot button's dropdown icon of field list and groupingBar UI. 
     * These aggregate options helps to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… easily at runtime. 
     * The available aggregate options are:
     * * `Sum`: Allows to display the pivot table values with sum.
     * * `Product`: Allows to display the pivot table values with product.
     * * `Count`: Allows to display the pivot table values with count.
     * * `DistinctCount`: Allows to display the pivot table values with distinct count.
     * * `Min`: Allows to display the pivot table with minimum value.
     * * `Max`: Allows to display the pivot table with maximum value.
     * * `Avg`: Allows to display the pivot table values with average.
     * * `Index`: Allows to display the pivot table values with index.
     * * `PopulationStDev`: Allows to display the pivot table values with population standard deviation.
     * * `SampleStDev`: Allows to display the pivot table values with sample standard deviation.
     * * `PopulationVar`: Allows to display the pivot table values with population variance.
     * * `SampleVar`: Allows to display the pivot table values with sample variance.
     * * `RunningTotals`: Allows to display the pivot table values with running totals.
     * * `DifferenceFrom`: Allows to display the pivot table values with difference from the value of the base item in the base field.
     * * `PercentageOfDifferenceFrom`: Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
     * * `PercentageOfGrandTotal`: Allows to display the pivot table values with percentage of grand total of all values.
     * * `PercentageOfColumnTotal`: Allows to display the pivot table values in each column with percentage of total values for the column.
     * * `PercentageOfRowTotal`: Allows to display the pivot table values in each row with percentage of total values for the row.
     * * `PercentageOfParentTotal`: Allows to display the pivot table values with percentage of total of all values based on selected field.
     * * `PercentageOfParentColumnTotal`: Allows to display the pivot table values with percentage of its parent total in each column.
     * * `PercentageOfParentRowTotal`: Allows to display the pivot table values with percentage of its parent total in each row.
     * 
     * > It is applicable ony for Relational data.
     * @default ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar',
     * 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
     * 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom',
     * 'PercentageOfParentTotal']
     */
    /* tslint:disable-next-line:max-line-length */
    aggregateTypes?: AggregateTypes[];

    /**
     * Allows you to display the pivot chart with specific chart types from built-in chart options, invoked from the toolbar. 
     * The available chart types are: 
     * * `Line`: Allows to display the pivot chart with line series.
     * * `Column`: Allows to display the pivot chart with column series.
     * * `Area`: Allows to display the pivot chart with area series.
     * * `Bar`: Allows to display the pivot chart with bar series.
     * * `StackingColumn`: Allows to display the pivot chart with stacked column series.
     * * `StackingArea`: Allows to display the pivot chart with stacked area series.
     * * `StackingBar`: Allows to display the pivot chart with stacked bar series.
     * * `StepLine`: Allows to display the pivot chart with step line series.
     * * `StepArea`: Allows to display the pivot chart with step area series.
     * * `SplineArea`: Allows to display the pivot chart with spline area series.
     * * `Scatter`: Allows to display the pivot chart with scatter series.
     * * `Spline`: Allows to display the pivot chart with spline series.
     * * `StackingColumn100`: Allows to display the pivot chart with 100% stacked column series.
     * * `StackingBar100`: Allows to display the pivot chart with 100% stacked bar series.
     * * `StackingArea100`: Allows to display the pivot chart with 100% stacked area series.
     * * `Bubble`: Allows to display the pivot chart with bubble series.
     * * `Pareto`: Allows to display the pivot chart with pareto series.
     * * `Polar`: Allows to display the pivot chart with polar series.
     * * `Radar`: Allows to display the pivot chart with radar series.
     * * `Pie`: Allows to display the pivot chart with pie series.
     * * `Doughnut`: Allows to display the pivot chart with doughnut series.
     * * `Funnel`: Allows to display the pivot chart with funnel series.
     * * `Pyramid`: Allows to display the pivot chart with pyramid series.
     * 
     * To use this option, the `showToolbar` property must be **true** along with toolbar option **Chart**
     * to be set to the `toolbar` property.
     * @default ['Line', 'Column', 'Area', 'Bar', 'StackingColumn', 'StackingArea', 'StackingBar', 'StepLine', 'StepArea',
     * 'SplineArea', 'Scatter', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'Bubble', 'Pareto', 'Polar',
     * 'Radar', 'Pie', 'Doughnut', 'Funnel', 'Pyramid' ])
     */
    /* tslint:disable-next-line:max-line-length */
    chartTypes?: ChartSeriesType[];

    /**
     * @hidden
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * @hidden
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * @hidden
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * @hidden
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
    beforePdfExport?: EmitType<Object>;

    /**
    beforeExcelExport?: EmitType<Object>;

    /**
     * @hidden
     */
    beforeColumnsRender?: EmitType<ColumnRenderEventArgs>;

    /**
     * @hidden
     */
    selected?: EmitType<CellSelectEventArgs>;

    /**
     * @hidden
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * @hidden
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * @hidden
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * @hidden
     */
    chartTooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * @hidden
     */
    chartLoaded?: EmitType<ILoadedEventArgs>;

    /**
    chartLoad?: EmitType<ILoadedEventArgs>;

    /**
     * @hidden
     */
    chartResized?: EmitType<IResizeEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    chartAxisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    multiLevelLabelClick?: EmitType<MultiLevelLabelClickEventArgs>;

    /**
    chartPointClick?: EmitType<IPointEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    contextMenuClick?: EmitType<ContextMenuClickEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * It allows any customization of Pivot cell style while PDF exporting.
     * @event
     * @blazorproperty 'PdfCellRender'
     */
    onPdfCellRender?: EmitType<PdfCellRenderArgs>;

    /**
     * It allows you to save the report to the specified storage.
     * @event
     */
    saveReport?: EmitType<SaveReportArgs>;

    /**
     * It allows you to fetch the report names from specified storage.
     * @event
     * @blazorproperty 'FetchReport'
     */
    fetchReport?: EmitType<FetchReportArgs>;

    /**
     * It allows to load the report from specified storage.
     * @event
     * @blazorproperty 'LoadReport'
     */
    loadReport?: EmitType<LoadReportArgs>;

    /**
     * It allows you to rename the current report.
     * @event
     */
    renameReport?: EmitType<RenameReportArgs>;

    /**
     * It allows you to remove the current report from the specified storage.
     * @event
     */
    removeReport?: EmitType<RemoveReportArgs>;

    /**
     * It allows to set the new report.
     * @event
     */
    newReport?: EmitType<NewReportArgs>;

    /**
     * It allows to change the toolbar items.
     * @event
     * @blazorproperty 'ToolbarRendered'
     */
    toolbarRender?: EmitType<ToolbarArgs>;

    /**
     * It allows to change the toolbar items.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * It allows any customization on the pivot table component properties on initial rendering.
     * Based on the changes, pivot table will be redered.
     * @event
     * @blazorproperty 'OnLoad'
     */
    load?: EmitType<LoadEventArgs>;

    /**
     * It triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * It triggers after the pivot engine populated and allows to customize the pivot datasource settings.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * It triggers after a field dropped into the axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * It triggers before a field drops into any axis.
     * @event
     * @blazorproperty 'FieldDrop'
     */
    fieldDrop?: EmitType<FieldDropEventArgs>;

    /**
     * It triggers when a field drag (move) starts.
     * @event
     * @blazorproperty 'FieldDragStart'
     */
    fieldDragStart?: EmitType<FieldDragStartEventArgs>;

    /**
     * It triggers when the pivot table rendered.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * It triggers when the pivot table component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * It triggers when pivot table component getting destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * It allows to set properties for exporting.
     * @event
     * @deprecated
     */
    beforeExport?: EmitType<BeforeExportEventArgs>;

    /**
     * It allows to do changes before applying the conditional formatting.
     * @event
     */
    conditionalFormatting?: EmitType<IConditionalFormatSettings>;

    /**
     * It triggers before the filtering applied.
     * @event
     */
    memberFiltering?: EmitType<MemberFilteringEventArgs>;

    /**
     * It triggers when a cell is clicked in the pivot table.
     * @event
     */
    cellClick?: EmitType<CellClickEventArgs>;

    /**
     * It triggers when a value cell is clicked in the pivot table for Drill-Through.
     * @event
     * @blazorproperty 'DrillThrough'
     */
    drillThrough?: EmitType<DrillThroughEventArgs>;

    /**
    * It triggers when editing is made in the raw data of pivot table.
    * @event
    * @blazorproperty 'EditCompleted'
    */
    editCompleted?: EmitType<EditCompletedEventArgs>;

    /**
     * It triggers when a value cell is clicked in the pivot table for Editing.
     * @event
     * @blazorproperty 'BeginDrillThrough'
     */
    beginDrillThrough?: EmitType<BeginDrillThroughEventArgs>;

    /**
     * It triggers when a hyperlink cell is clicked in the pivot table.
     * @event
     * @blazorproperty 'HyperlinkCellClicked'
     */
    hyperlinkCellClick?: EmitType<HyperCellClickEventArgs>;

    /**
     * It triggers before a cell selected in pivot table.
     * @event
     * @blazorproperty 'CellSelecting'
     */
    cellSelecting?: EmitType<PivotCellSelectedEventArgs>;

    /**
     * It triggers before the header to be either expanded or collapsed in the pivot table.
     * @event
     */
    drill?: EmitType<DrillArgs>;

    /**
     * It triggers when a cell got selected in the pivot table.
     * @event
     * @blazorproperty 'CellSelected'
     */
    cellSelected?: EmitType<PivotCellSelectedEventArgs>;

    /**
     * It triggers when the pivot chart series are created.
     * @event
     * @blazorproperty 'ChartSeriesCreated'
     */
    chartSeriesCreated?: EmitType<ChartSeriesCreatedEventArgs>;

    /**
     * It allows to change the each cell value during engine populating.
     * @event
     * @deprecated
     */
    aggregateCellInfo?: EmitType<AggregateEventArgs>;

    /**
     * It allows to identify whether the field list updated or not.
     * @event
     * @blazorproperty 'FieldListRefreshed'
     */
    fieldListRefreshed?: EmitType<FieldListRefreshedEventArgs>;

    /**
     * It triggers before member editor dialog opens.
     * @event
     * @blazorproperty 'MemberEditorOpen'
     */
    memberEditorOpen?: EmitType<MemberEditorOpenEventArgs>;

    /**
     * It triggers before a calculated field created/edited during runtime.
     * @event
     * @blazorproperty 'CalculatedFieldCreate'
     */
    calculatedFieldCreate?: EmitType<CalculatedFieldCreateEventArgs>;

    /**
     * It triggers before number format is apllied to specific field during runtime.
     * @event
     * @blazorproperty 'NumberFormatting'
     */
    numberFormatting?: EmitType<NumberFormattingEventArgs>;

    /**
     * It triggers before aggregate type context menu opens.
     * @event
     * @blazorproperty 'AggregateMenuOpen'
     */
    aggregateMenuOpen?: EmitType<AggregateMenuOpenEventArgs>;

    /**
     * It triggers before removing the field from any axis during runtime.
     * @event
     * @blazorproperty 'FieldRemove'
     */
    fieldRemove?: EmitType<FieldRemoveEventArgs>;

}