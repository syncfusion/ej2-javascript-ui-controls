import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, append, isBlazor } from '@syncfusion/ej2-base';import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged, compile, formatUnit } from '@syncfusion/ej2-base';import { removeClass, addClass, Event, KeyboardEventArgs } from '@syncfusion/ej2-base';import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings, IGroupSettings } from '../../base/engine';import { IDrilledItem, ICustomProperties, ISort, IFilter, IFieldOptions, ICalculatedFields, IDrillOptions } from '../../base/engine';import { IConditionalFormatSettings, IStringIndex, IField } from '../../base/engine';import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn, ChartLabelInfo } from '../../common/base/interface';import { FetchReportArgs, LoadReportArgs, RenameReportArgs, RemoveReportArgs, ToolbarArgs } from '../../common/base/interface';import { PdfCellRenderArgs, NewReportArgs, ChartSeriesCreatedEventArgs, AggregateEventArgs } from '../../common/base/interface';import { ResizeInfo, ScrollInfo, ColumnRenderEventArgs, PivotCellSelectedEventArgs, SaveReportArgs } from '../../common/base/interface';import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, CellTemplateArgs } from '../../common/base/interface';import { BeforeExportEventArgs, EnginePopulatedEventArgs, BeginDrillThroughEventArgs, DrillArgs } from '../../common/base/interface';import { FieldListRefreshedEventArgs } from '../../common/base/interface';import { Render } from '../renderer/render';import { PivotCommon } from '../../common/base/pivot-common';import { Common } from '../../common/actions/common';import { GroupingBar } from '../../common/grouping-bar/grouping-bar';import { DataSourceSettingsModel, DrillOptionsModel } from '../model/datasourcesettings-model';import { DataSourceSettings } from '../model/datasourcesettings';import { GridSettings } from '../model/gridsettings';import { GridSettingsModel } from '../model/gridsettings-model';import { PivotButton } from '../../common/actions/pivot-button';import { PivotFieldList } from '../../pivotfieldlist/base/field-list';import { Grid, Column, QueryCellInfoEventArgs, ColumnModel, Reorder, Resize, getObject } from '@syncfusion/ej2-grids';import { SelectionType, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellSelectEventArgs, RowSelectEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { RowDeselectEventArgs, ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';import { EditSettingsModel, HeaderCellInfoEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExport } from '../actions/excel-export';import { PDFExport } from '../actions/pdf-export';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { KeyboardInteraction } from '../actions/keyboard';import { PivotContextMenu } from '../../common/popups/context-menu';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';import { VirtualScroll } from '../actions/virtualscroll';import { DrillThrough } from '../actions/drill-through';import { Condition } from '../../base/types';import { EditMode, ToolbarItems, View, Primary } from '../../common';import { PivotUtil } from '../../base/util';import { Toolbar } from '../../common/popups/toolbar';import { PivotChart } from '../../pivotchart/index';import { ChartSettings } from '../model/chartsettings';import { ChartSettingsModel } from '../model/chartsettings-model';import { Chart, ITooltipRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';import { IResizeEventArgs, IAxisLabelRenderEventArgs, ExportType } from '@syncfusion/ej2-charts';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { ClickEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';import { OlapEngine, IOlapCustomProperties, ITupInfo, IDrillInfo, IOlapField } from '../../base/olap/engine';import { NumberFormatting } from '../../common/popups/formatting-dialog';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class GroupingBarSettings
 */
export interface GroupingBarSettingsModel {

    /**
     * It allows to set the visibility of filter icon in GroupingBar button

     */
    showFilterIcon?: boolean;

    /**
     * It allows to set the visibility of sort icon in GroupingBar button

     */
    showSortIcon?: boolean;

    /**
     * It allows to set the visibility of remove icon in GroupingBar button

     */
    showRemoveIcon?: boolean;

    /**
     * It allows to set the visibility of drop down icon in GroupingBar button

     */
    showValueTypeIcon?: boolean;

    /**
     * It allows to set the visibility of grouping bar in desired view port

     */
    displayMode?: View;

    /**
     * It allows to enable/disable the drag and drop option to GroupingBar buttons. 

     */
    allowDragAndDrop?: boolean;

}

/**
 * Interface for a class CellEditSettings
 */
export interface CellEditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.

     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.

     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.

     */
    allowDeleting?: boolean;

    /**
     * If `allowCommandColumns` is set to true, an additional column appended to perform CRUD operations in Grid.

     */
    allowCommandColumns?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch

     */
    mode?: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.

     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.

     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.

     */
    showDeleteConfirmDialog?: boolean;

}

/**
 * Interface for a class ConditionalSettings
 */
export interface ConditionalSettingsModel {

    /**
     * It allows to set the field name to get visibility of hyperlink based on condition.
     */
    measure?: string;

    /**
     * It allows to set the label name to get visibility of hyperlink based on condition.
     */
    label?: string;

    /**
     * It allows to set the filter conditions to the field.

     */
    conditions?: Condition;

    /**
     * It allows to set the value1 get visibility of hyperlink.
     */
    value1?: number;

    /**
     * It allows to set the value2 to get visibility of hyperlink.
     */
    value2?: number;

}

/**
 * Interface for a class HyperlinkSettings
 */
export interface HyperlinkSettingsModel {

    /**
     * It allows to set the visibility of hyperlink in all cells

     */
    showHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in row headers

     */
    showRowHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in column headers

     */
    showColumnHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in value cells

     */
    showValueCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in summary cells

     */
    showSummaryCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink based on condition

     */
    conditionalSettings?: ConditionalSettingsModel[];

    /**
     * It allows to set the visibility of hyperlink based on header text
     */
    headerText?: string;

    /**
     * It allows to set the custom class name for hyperlink options

     */
    cssClass?: string;

}

/**
 * Interface for a class DisplayOption
 */
export interface DisplayOptionModel {

    /**
     * It allows the user to switch the view port as table or chart or both

     */
    view?: View;

    /**
     * It allows the user to switch the primary view as table or chart

     */
    primary?: Primary;

}

/**
 * Interface for a class PivotView
 */
export interface PivotViewModel extends ComponentModel{

    /**
     * Defines the currencyCode format of the Pivot widget columns
     * @private
     */
    currencyCode?: string;

    /**
     * It allows to render pivotfieldlist.

     */
    showFieldList?: boolean;

    /**
     * Configures the features settings of Pivot widget. 
     */
    gridSettings?: GridSettingsModel;

    /**
     * Configures the features settings of Pivot widget. 
     */
    chartSettings?: ChartSettingsModel;

    /**
     * Configures the settings of GroupingBar. 
     */
    groupingBarSettings?: GroupingBarSettingsModel;

    /**
     * Configures the settings of hyperlink settings. 
     */
    hyperlinkSettings?: HyperlinkSettingsModel;

    /**
     * It allows the user to configure the pivot report as per the user need.
     */
    dataSourceSettings?: DataSourceSettingsModel;

    /**
     * Configures the edit behavior of the Pivot Grid.

     * mode:'Normal', allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    editSettings?: CellEditSettingsModel;

    /**
     * Configures the settings of displayOption. 
     */
    displayOption?: DisplayOptionModel;

    /**
     * It holds the pivot engine data which renders the Pivot widget.
     */
    pivotValues?: IPivotValues;

    /**
     * Enables the display of GroupingBar allowing you to filter, sort, and remove fields obtained from the datasource.

     */
    showGroupingBar?: boolean;

    /**
     * Allows to display the Tooltip on hovering value cells in pivot grid.

     */
    showTooltip?: boolean;

    /**
     * It allows to enable/disable toolbar in pivot table.

     */
    showToolbar?: boolean;

    /**
     * It allows to set toolbar items in pivot table.

     */
    toolbar?: ToolbarItems[];

    /**
     * It shows a common button for value fields to move together in column or row axis

     */
    showValuesButton?: boolean;

    /**
     * It allows to enable calculated field in PivotView.

     */
    allowCalculatedField?: boolean;

    /**
     * It allows to enable Value Sorting in PivotView.

     */
    enableValueSorting?: boolean;

    /**
     * It allows to enable Conditional Formatting in PivotView.

     */
    allowConditionalFormatting?: boolean;

    /**
     * It allows to enable number formatting popup in pivot table.

     */
    allowNumberFormatting?: boolean;

    /**
     * Pivot widget. (Note change all occurrences) 

     */
    height?: string | number;

    /**
     * It allows to set the width of Pivot widget. 

     */
    width?: string | number;

    /**
     * If `allowExcelExport` is set to true, then it will allow the user to export pivotview to Excel file.

     */
    allowExcelExport?: boolean;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows and the columns visible within the view-port
     * and load subsequent rows and columns on vertical scrolling. This helps to load large dataset in Pivot Grid.

     */
    enableVirtualization?: boolean;

    /**
     * If `allowDrillThrough` set to true, then you can view the raw items that are used to create a 
     * specified value cell in the pivot grid.

     */
    allowDrillThrough?: boolean;

    /**
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.

     */
    allowPdfExport?: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotview.

     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.

     */
    maxNodeLimitInMemberEditor?: number;

    /**
     * It allows to set the maximum number of rows to be return while drill through.

     */
    maxRowsInDrillThrough?: number;

    /**
     * If `loadOnDemandInMemberEditor` is set to false, 
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube 
     * while the member editor pop-up opens for the first time alone.

     */
    loadOnDemandInMemberEditor?: boolean;

    /**
     * The template option which is used to render the pivot cells on the pivotview. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the pivot cells.

     */
    cellTemplate?: string;

    /**
     * It allows to customize the spinner.

     */
    spinnerTemplate?: string;

    /**


     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**


     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**


     */
    resizing?: EmitType<ResizeArgs>;

    /**


     */
    resizeStop?: EmitType<ResizeArgs>;

    /**


     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**


     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**


     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**


     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**


     */
    beforeColumnsRender?: EmitType<ColumnRenderEventArgs>;

    /**


     */
    selected?: EmitType<CellSelectEventArgs>;

    /**


     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**


     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**


     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**


     */
    chartTooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**


     */
    chartLoaded?: EmitType<ILoadedEventArgs>;

    /**
    chartLoad?: EmitType<ILoadedEventArgs>;

    /**


     */
    chartResized?: EmitType<IResizeEventArgs>;

    /**



     */
    chartAxisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**



     */
    contextMenuClick?: EmitType<ContextMenuClickEventArgs>;

    /**



     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * This allows any customization of Pivot cell style while  PDF exporting.
     * @event

     */
    onPdfCellRender?: EmitType<PdfCellRenderArgs>;

    /**
     * This allows to save the report in any storage.
     * @event
     */
    saveReport?: EmitType<SaveReportArgs>;

    /**
     * This allows to fetch the report names from storage.
     * @event

     */
    fetchReport?: EmitType<FetchReportArgs>;

    /**
     * This allows to load the report from storage.
     * @event

     */
    loadReport?: EmitType<LoadReportArgs>;

    /**
     * This allows to rename the report.
     * @event
     */
    renameReport?: EmitType<RenameReportArgs>;

    /**
     * This allows to remove the report from storage.
     * @event
     */
    removeReport?: EmitType<RemoveReportArgs>;

    /**
     * This allows to set the new report.
     * @event
     */
    newReport?: EmitType<NewReportArgs>;

    /**
     * This allows to change the toolbar items.
     * @event

     */
    toolbarRender?: EmitType<ToolbarArgs>;

    /**
     * This allows to change the toolbar items.
     * @event


     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * This allows any customization of PivotView properties on initial rendering.
     * @event

     */
    load?: EmitType<LoadEventArgs>;

    /**
     * Triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event

     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * Triggers after the pivot engine populated and allows to customize the pivot widget.
     * @event

     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event

     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * Triggers when data source is populated in the Pivot View.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when data source is created in the Pivot View.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when data source is destroyed in the Pivot View.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * This allows to set properties for exporting.
     * @event


     */
    beforeExport?: EmitType<BeforeExportEventArgs>;

    /**
     * This allows to do changes before conditional formatting apply.
     * @event
     */
    conditionalFormatting?: EmitType<IConditionalFormatSettings>;

    /**
     * Triggers when cell is clicked in the Pivot widget.
     * @event
     */
    cellClick?: EmitType<CellClickEventArgs>;

    /**
     * Triggers when value cell is clicked in the Pivot widget on Drill-Through.
     * @event

     */
    drillThrough?: EmitType<DrillThroughEventArgs>;

    /**
     * Triggers when value cell is clicked in the Pivot widget on Editing.
     * @event

     */
    beginDrillThrough?: EmitType<BeginDrillThroughEventArgs>;

    /**
     * Triggers when hyperlink cell is clicked in the Pivot widget.
     * @event

     */
    hyperlinkCellClick?: EmitType<HyperCellClickEventArgs>;

    /**
     * Triggers before cell got selected in Pivot widget.
     * @event

     */
    cellSelecting?: EmitType<PivotCellSelectedEventArgs>;

    /**
     * Triggers before drill down/ drill up Pivot widget.
     * @event
     */
    drill?: EmitType<DrillArgs>;

    /**
     * Triggers when cell got selected in Pivot widget.
     * @event

     */
    cellSelected?: EmitType<PivotCellSelectedEventArgs>;

    /**
     * Triggers when chart series are created.
     * @event

     */
    chartSeriesCreated?: EmitType<ChartSeriesCreatedEventArgs>;

    /**
     * This allows to change the cell value.
     * @event


     */
    aggregateCellInfo?: EmitType<AggregateEventArgs>;

    /**
     * This allows to identify each field list update.
     * @event

     */
    fieldListRefreshed?: EmitType<FieldListRefreshedEventArgs>;

}