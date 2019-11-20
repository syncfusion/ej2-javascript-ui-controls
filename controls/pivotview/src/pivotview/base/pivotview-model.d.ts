import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, append, isBlazor } from '@syncfusion/ej2-base';import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged, compile, formatUnit } from '@syncfusion/ej2-base';import { removeClass, addClass, Event, KeyboardEventArgs, setValue } from '@syncfusion/ej2-base';import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings, IGroupSettings } from '../../base/engine';import { IDrilledItem, ICustomProperties, ISort, IFilter, IFieldOptions, ICalculatedFields, IDrillOptions } from '../../base/engine';import { IConditionalFormatSettings, IStringIndex, IField } from '../../base/engine';import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn, ChartLabelInfo } from '../../common/base/interface';import { FetchReportArgs, LoadReportArgs, RenameReportArgs, RemoveReportArgs, ToolbarArgs } from '../../common/base/interface';import { PdfCellRenderArgs, NewReportArgs, ChartSeriesCreatedEventArgs, AggregateEventArgs } from '../../common/base/interface';import { ResizeInfo, ScrollInfo, ColumnRenderEventArgs, PivotCellSelectedEventArgs, SaveReportArgs } from '../../common/base/interface';import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, CellTemplateArgs } from '../../common/base/interface';import { BeforeExportEventArgs, EnginePopulatedEventArgs, BeginDrillThroughEventArgs, DrillArgs } from '../../common/base/interface';import { FieldListRefreshedEventArgs, MemberFilteringEventArgs } from '../../common/base/interface';import { Render } from '../renderer/render';import { PivotCommon } from '../../common/base/pivot-common';import { Common } from '../../common/actions/common';import { GroupingBar } from '../../common/grouping-bar/grouping-bar';import { DataSourceSettingsModel, DrillOptionsModel } from '../model/datasourcesettings-model';import { DataSourceSettings } from '../model/datasourcesettings';import { GridSettings } from '../model/gridsettings';import { GridSettingsModel } from '../model/gridsettings-model';import { PivotButton } from '../../common/actions/pivot-button';import { PivotFieldList } from '../../pivotfieldlist/base/field-list';import { Grid, Column, QueryCellInfoEventArgs, ColumnModel, Reorder, Resize, getObject } from '@syncfusion/ej2-grids';import { SelectionType, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellSelectEventArgs, RowSelectEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { RowDeselectEventArgs, ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';import { EditSettingsModel, HeaderCellInfoEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExport } from '../actions/excel-export';import { PDFExport } from '../actions/pdf-export';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { KeyboardInteraction } from '../actions/keyboard';import { PivotContextMenu } from '../../common/popups/context-menu';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';import { VirtualScroll } from '../actions/virtualscroll';import { DrillThrough } from '../actions/drill-through';import { Condition } from '../../base/types';import { EditMode, ToolbarItems, View, Primary } from '../../common';import { PivotUtil } from '../../base/util';import { Toolbar } from '../../common/popups/toolbar';import { PivotChart } from '../../pivotchart/index';import { ChartSettings } from '../model/chartsettings';import { ChartSettingsModel } from '../model/chartsettings-model';import { Chart, ITooltipRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';import { IResizeEventArgs, IAxisLabelRenderEventArgs, ExportType } from '@syncfusion/ej2-charts';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { ClickEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';import { OlapEngine, IOlapCustomProperties, ITupInfo, IDrillInfo, IOlapField } from '../../base/olap/engine';import { NumberFormatting } from '../../common/popups/formatting-dialog';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class GroupingBarSettings
 */
export interface GroupingBarSettingsModel {

    /**
     * It allows to set the visibility of filter icon in GroupingBar button
     * @default true     
     */
    showFilterIcon?: boolean;

    /**
     * It allows to set the visibility of sort icon in GroupingBar button
     * @default true     
     */
    showSortIcon?: boolean;

    /**
     * It allows to set the visibility of remove icon in GroupingBar button
     * @default true     
     */
    showRemoveIcon?: boolean;

    /**
     * It allows to set the visibility of drop down icon in GroupingBar button
     * @default true     
     */
    showValueTypeIcon?: boolean;

    /**
     * It allows to set the visibility of grouping bar in desired view port
     * @default Both
     */
    displayMode?: View;

    /**
     * It allows to enable/disable the drag and drop option to GroupingBar buttons. 
     * @default true     
     */
    allowDragAndDrop?: boolean;

}

/**
 * Interface for a class CellEditSettings
 */
export interface CellEditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     * @default false
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     * @default false
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     * @default false
     */
    allowDeleting?: boolean;

    /**
     * If `allowCommandColumns` is set to true, an additional column appended to perform CRUD operations in Grid.
     * @default false
     */
    allowCommandColumns?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal
     */
    mode?: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     * @default true
     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false
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
     * @default NotEquals
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
     * @default false     
     */
    showHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in row headers
     * @default false     
     */
    showRowHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in column headers
     * @default false     
     */
    showColumnHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in value cells
     * @default false     
     */
    showValueCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in summary cells
     * @default false     
     */
    showSummaryCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink based on condition
     * @default []
     */
    conditionalSettings?: ConditionalSettingsModel[];

    /**
     * It allows to set the visibility of hyperlink based on header text
     */
    headerText?: string;

    /**
     * It allows to set the custom class name for hyperlink options
     * @default ''
     */
    cssClass?: string;

}

/**
 * Interface for a class DisplayOption
 */
export interface DisplayOptionModel {

    /**
     * It allows the user to switch the view port as table or chart or both
     * @default Table     
     */
    view?: View;

    /**
     * It allows the user to switch the primary view as table or chart
     * @default Table     
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
     * @default false
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
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, allowCommandColumns: false, 
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
     * @default false
     */
    showGroupingBar?: boolean;

    /**
     * Allows to display the Tooltip on hovering value cells in pivot grid.
     * @default true
     */
    showTooltip?: boolean;

    /**
     * It allows to enable/disable toolbar in pivot table.
     * @default false     
     */
    showToolbar?: boolean;

    /**
     * It allows to set toolbar items in pivot table.
     * @default []
     */
    toolbar?: ToolbarItems[];

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    showValuesButton?: boolean;

    /**
     * It allows to enable calculated field in PivotView.
     * @default false
     */
    allowCalculatedField?: boolean;

    /**
     * It allows to enable Value Sorting in PivotView.
     * @default false
     */
    enableValueSorting?: boolean;

    /**
     * It allows to enable Conditional Formatting in PivotView.
     * @default false
     */
    allowConditionalFormatting?: boolean;

    /**
     * It allows to enable number formatting popup in pivot table.
     * @default false
     */
    allowNumberFormatting?: boolean;

    /**
     * Pivot widget. (Note change all occurrences) 
     * @default 'auto'
     */
    height?: string | number;

    /**
     * It allows to set the width of Pivot widget. 
     * @default 'auto'
     */
    width?: string | number;

    /**
     * If `allowExcelExport` is set to true, then it will allow the user to export pivotview to Excel file.
     * @default false    
     */
    allowExcelExport?: boolean;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows and the columns visible within the view-port
     * and load subsequent rows and columns on vertical scrolling. This helps to load large dataset in Pivot Grid.
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `allowDrillThrough` set to true, then you can view the raw items that are used to create a 
     * specified value cell in the pivot grid.
     * @default false
     */
    allowDrillThrough?: boolean;

    /**
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.
     * @default false    
     */
    allowPdfExport?: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotview.
     * @default false
     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * If `allowDataCompression` is set to true when virtual scrolling is enabled, 
     * the performance of drag and drop, add/remove operations can be improved.
     * Note: It is having limitations in Drill-through, editing and some of the aggregation types.
     * @default false
     */
    allowDataCompression?: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    maxNodeLimitInMemberEditor?: number;

    /**
     * It allows to set the maximum number of rows to be return while drill through.
     * @default 10000 
     */
    maxRowsInDrillThrough?: number;

    /**
     * If `loadOnDemandInMemberEditor` is set to false, 
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube 
     * while the member editor pop-up opens for the first time alone.
     * @default true    
     */
    loadOnDemandInMemberEditor?: boolean;

    /**
     * The template option which is used to render the pivot cells on the pivotview. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the pivot cells.
     * @default null
     */
    cellTemplate?: string;

    /**
     * It allows to customize the spinner.
     * @default null
     */
    spinnerTemplate?: string;

    /**
     * @hidden
     * @blazorproperty 'QueryCellInfo'
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'HeaderCellInfo'
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'Resizing'
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * @hidden
     * @blazorproperty 'ResizeStopped'
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * @hidden
     * @blazorproperty 'PdfHeaderQueryCellInfo'
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'PdfQueryCellInfo'
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ExcelHeaderQueryCellInfo'
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ExcelQueryCellInfo'
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
     * @blazorproperty 'OnColumnsRender'
     */
    beforeColumnsRender?: EmitType<ColumnRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'Selected'
     */
    selected?: EmitType<CellSelectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'CellDeselected'
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'RowSelected'
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'RowDeselected'
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartTooltipRendered'
     */
    chartTooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartLoaded'
     */
    chartLoaded?: EmitType<ILoadedEventArgs>;

    /**
    chartLoad?: EmitType<ILoadedEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartResized'
     */
    chartResized?: EmitType<IResizeEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartAxisLabelRender'
     * @deprecated
     */
    chartAxisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ContextMenuItemClicked'
     * @deprecated
     */
    contextMenuClick?: EmitType<ContextMenuClickEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ContextMenuOpened'
     * @deprecated
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * This allows any customization of Pivot cell style while  PDF exporting.
     * @event
     * @blazorproperty 'PdfCellRender'
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
     * @blazorproperty 'FetchReport'
     */
    fetchReport?: EmitType<FetchReportArgs>;

    /**
     * This allows to load the report from storage.
     * @event
     * @blazorproperty 'LoadReport'
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
     * @blazorproperty 'ToolbarRendered'
     */
    toolbarRender?: EmitType<ToolbarArgs>;

    /**
     * This allows to change the toolbar items.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * This allows any customization of PivotView properties on initial rendering.
     * @event
     * @blazorproperty 'OnLoad'
     */
    load?: EmitType<LoadEventArgs>;

    /**
     * Triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * Triggers after the pivot engine populated and allows to customize the pivot widget.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
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
     * @blazorproperty 'OnExport'
     * @deprecated
     */
    beforeExport?: EmitType<BeforeExportEventArgs>;

    /**
     * This allows to do changes before conditional formatting apply.
     * @event
     */
    conditionalFormatting?: EmitType<IConditionalFormatSettings>;

    /**
     * This event triggers before apply filtering
     * @event
     */
    memberFiltering?: EmitType<MemberFilteringEventArgs>;

    /**
     * Triggers when cell is clicked in the Pivot widget.
     * @event
     */
    cellClick?: EmitType<CellClickEventArgs>;

    /**
     * Triggers when value cell is clicked in the Pivot widget on Drill-Through.
     * @event
     * @blazorproperty 'DrillThrough'
     */
    drillThrough?: EmitType<DrillThroughEventArgs>;

    /**
     * Triggers when value cell is clicked in the Pivot widget on Editing.
     * @event
     * @blazorproperty 'BeginDrillThrough'
     */
    beginDrillThrough?: EmitType<BeginDrillThroughEventArgs>;

    /**
     * Triggers when hyperlink cell is clicked in the Pivot widget.
     * @event
     * @blazorproperty 'HyperlinkCellClicked'
     */
    hyperlinkCellClick?: EmitType<HyperCellClickEventArgs>;

    /**
     * Triggers before cell got selected in Pivot widget.
     * @event
     * @blazorproperty 'CellSelecting'
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
     * @blazorproperty 'CellSelected'
     */
    cellSelected?: EmitType<PivotCellSelectedEventArgs>;

    /**
     * Triggers when chart series are created.
     * @event
     * @blazorproperty 'ChartSeriesCreated'
     */
    chartSeriesCreated?: EmitType<ChartSeriesCreatedEventArgs>;

    /**
     * This allows to change the cell value.
     * @event
     * @blazorproperty 'AggregateCellInfo'
     * @deprecated
     */
    aggregateCellInfo?: EmitType<AggregateEventArgs>;

    /**
     * This allows to identify each field list update.
     * @event
     * @blazorproperty 'FieldListRefreshed'
     */
    fieldListRefreshed?: EmitType<FieldListRefreshedEventArgs>;

}