import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, isBlazor } from '@syncfusion/ej2-base';
import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged, compile, formatUnit } from '@syncfusion/ej2-base';
import { removeClass, addClass, Event, KeyboardEventArgs, setValue, closest } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet } from '../../base/engine';
import { IPageSettings, IGroupSettings, IGridValues, IFieldListOptions, IValueSortSettings } from '../../base/engine';
import { IDrilledItem, ICustomProperties, ISort, IFilter, IFieldOptions, ICalculatedFields, IDrillOptions } from '../../base/engine';
import { IConditionalFormatSettings, IStringIndex, IField, IFormatSettings } from '../../base/engine';
import { PivotViewModel, GroupingBarSettingsModel, CellEditSettingsModel, DisplayOptionModel } from './pivotview-model';
import { HyperlinkSettingsModel, ConditionalSettingsModel } from './pivotview-model';
import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';
import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn, ChartLabelInfo, EditCompleteEventArgs } from '../../common/base/interface';
import { FetchReportArgs, LoadReportArgs, RenameReportArgs, RemoveReportArgs, ToolbarArgs } from '../../common/base/interface';
import { PdfCellRenderArgs, NewReportArgs, ChartSeriesCreatedEventArgs, AggregateEventArgs } from '../../common/base/interface';
import { ResizeInfo, ScrollInfo, ColumnRenderEventArgs, PivotCellSelectedEventArgs, SaveReportArgs } from '../../common/base/interface';
import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, CellTemplateArgs } from '../../common/base/interface';
import { BeforeExportEventArgs, EnginePopulatedEventArgs, BeginDrillThroughEventArgs, DrillArgs } from '../../common/base/interface';
import { FieldListRefreshedEventArgs, MemberFilteringEventArgs, FieldDropEventArgs } from '../../common/base/interface';
import { MemberEditorOpenEventArgs, FieldRemoveEventArgs, AggregateMenuOpenEventArgs } from '../../common/base/interface';
import { CalculatedFieldCreateEventArgs, NumberFormattingEventArgs, FieldDragStartEventArgs } from '../../common/base/interface';
import { Render } from '../renderer/render';
import { PivotCommon } from '../../common/base/pivot-common';
import { Common } from '../../common/actions/common';
import { GroupingBar } from '../../common/grouping-bar/grouping-bar';
import { DataSourceSettingsModel, DrillOptionsModel } from '../model/datasourcesettings-model';
import { DataSourceSettings } from '../model/datasourcesettings';
import { GridSettings } from '../model/gridsettings';
import { GridSettingsModel } from '../model/gridsettings-model';
import { PivotButton } from '../../common/actions/pivot-button';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Grid, Column, QueryCellInfoEventArgs, ColumnModel, Reorder, Resize, getObject } from '@syncfusion/ej2-grids';
import { SelectionType, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { CellSelectEventArgs, RowSelectEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';
import { RowDeselectEventArgs, ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { EditSettingsModel, HeaderCellInfoEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExport } from '../actions/excel-export';
import { PDFExport } from '../actions/pdf-export';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { KeyboardInteraction } from '../actions/keyboard';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';
import { VirtualScroll } from '../actions/virtualscroll';
import { DrillThrough } from '../actions/drill-through';
import { Condition, GroupType } from '../../base/types';
import { EditMode, ToolbarItems, View, Primary, AggregateTypes, ChartSeriesType } from '../../common';
import { PivotUtil } from '../../base/util';
import { Toolbar } from '../../common/popups/toolbar';
import { PivotChart } from '../../pivotchart/index';
import { ChartSettings } from '../model/chartsettings';
import { ChartSettingsModel } from '../model/chartsettings-model';
import { Chart, ITooltipRenderEventArgs, ILoadedEventArgs, IPointEventArgs, AccumulationChart } from '@syncfusion/ej2-charts';
import { IResizeEventArgs, IAxisLabelRenderEventArgs, ExportType } from '@syncfusion/ej2-charts';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ClickEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OlapEngine, IOlapCustomProperties, ITupInfo, IDrillInfo, IOlapField } from '../../base/olap/engine';
import { NumberFormatting } from '../../common/popups/formatting-dialog';
import { Grouping } from '../../common/popups/grouping';

/* tslint:disable */
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
export class GroupingBarSettings extends ChildProperty<GroupingBarSettings> {
    /** 
     * Allows you to show or hide the filter icon that used to be displayed on the pivot button of the grouping bar UI. 
     * This filter icon is used to filter the members of a particular field at runtime in the pivot table. 
     * > By default, the filter icon is enabled in the grouping bar.
     * @default true     
     */
    @Property(true)
    public showFilterIcon: boolean;

    /** 
     * Allows you to show or hide the sort icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This sort icon is used to order members of a particular fields either in ascending or descending at runtime. 
     * > By default, the sort icon is enabled in the grouping bar.
     * @default true     
     */
    @Property(true)
    public showSortIcon: boolean;

    /** 
     * Allows you to show or hide the remove icon that used to be displayed in the pivot button of the grouping bar UI. This remove icon is used to remove any field during runtime. 
     * > By default, the remove icon is enabled in the grouping bar.
     * @default true     
     */
    @Property(true)
    public showRemoveIcon: boolean;

    /** 
     * Allows you to show or hide the value type icon that used to be displayed in the pivot button of the grouping bar UI. 
     * This value type icon helps to select the appropriate aggregation type to value fields at runtime. 
     * > By default, the icon to set aggregate types is enabled in the grouping bar.
     * @default true     
     */
    @Property(true)
    public showValueTypeIcon: boolean;

    /** 
     * Allow options to show the grouping bar UI to specific view port such as either pivot table or pivot chart or both table and chart. 
     * For example, to show the grouping bar UI to pivot table on its own, set the property `displayMode` to **Table**. 
     * > By default, the grouping bar UI will be shown to both pivot table as well as pivot chart.
     * @default Both
     */
    @Property('Both')
    public displayMode: View;

    /**
     * Allows you to restrict the pivot buttons that were used to drag on runtime in the grouping bar UI. 
     * This will prevent you from modifying the current report. 
     * > By default, all fields are available for drag-and-drop operation in the grouping bar.
     * @default true     
     */
    @Property(true)
    public allowDragAndDrop: boolean;
}

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
 * 
 * > This feature is applicable only for the relational data source.
 */
export class CellEditSettings extends ChildProperty<CellEditSettings> implements EditSettingsModel {
    /**
     * Allows you to add a new record to the data grid used to update the appropriate cells in the pivot table.
     * @default false
     */
    @Property(false)
    public allowAdding: boolean;

    /**
     * Allows you to edit the existing record in the data grid that used to update the appropriate cells in the pivot table.
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * Allows you to delete the existing record from the data grid that used to  update the appropriate cells in the pivot table.
     * @default false
     */
    @Property(false)
    public allowDeleting: boolean;

    /**
     * Allows an additional column appended in the data grid layout holds the command buttons to perform the CRUD operations to 
     * edit, delete, and update the raw items to the data grid that used to update the appropriate cells in the pivot table.
     * @default false
     */
    @Property(false)
    public allowCommandColumns: boolean;

    /**
    * Allows direct editing of a value cell without opening the edit dialog. NOTE: It is applicable only if the value cell is made by a single raw data. Otherwise editing dialog will be shown. 
    * > The `allowInlineEditing` property supports all modes of editing.
    * @default false
    */
    @Property(false)
    public allowInlineEditing: boolean;

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
    @Property('Normal')
    public mode: EditMode;

    /**
     * Allows you to restrict CRUD operations by double-clicking the appropriate value cell in the pivot table.
     * @default true
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**
     * Allows you to show a confirmation dialog to save and discard CRUD operations performed in the data grid that used to update the appropriate cells in the pivot table. 
     * > To use this option, it requires the property `mode` to be **Batch**, meaning, the `showConfirmDialog` option is only applicable for batch edit mode.
     * @default true
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**
     * Allows you to show the confirmation dialog to delete any records from the data grid. 
     * > The `showDeleteConfirmDialog` property supports all modes of editing.
     * @default false
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;
}

/** 
 * Allow options for setting the visibility of hyperlink based on specific condition. The options available here are as follows:
 * * `measure`: Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
 * * `condition`: Allows you to choose the operator type such as equals, greater than, less than, etc.
 * * `value1`: Allows you to set the start value.
 * * `value2`: Allows you to set the end value. This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
 */
export class ConditionalSettings extends ChildProperty<ConditionalSettings> {

    /**
     * Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
     */
    @Property()
    public measure: string;

    /**
     * Allows you to specify the row or column header to get visibility of hyperlink option for specifc row or column header.
     */
    @Property()
    public label: string;

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
    @Property('NotEquals')
    public conditions: Condition;

    /**
     * Allows you to set the start value to get visibility of hyperlink option based on the condition applied. 
     * For example, if the start value is 500 and the condition Equals is used, the hyperlink should be enabled to the cells that hold the value of 500 alone.
     */
    @Property()
    public value1: number;

    /**
     * Allows you to set the end value to get visibility of hyperlink option based on the condition applied. 
     * For example, if the start value is 500, the end value is 1500 and the condition Between is used, the hyperlink should be enabled to the cells that holds the value between 500 to 1500.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     */
    @Property()
    public value2: number;
}

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
export class HyperlinkSettings extends ChildProperty<HyperlinkSettings> {
    /** 
     * Allows you to set the visibility of hyperlink in all cells that are currently shown in the pivot table.
     * @default false     
     */
    @Property(false)
    public showHyperlink: boolean;

    /** 
     * Allows you to set the visibility of hyperlink in row headers that are currently shown in the pivot table.
     * @default false     
     */
    @Property(false)
    public showRowHeaderHyperlink: boolean;

    /** 
     * Allows you to set the visibility of hyperlink in column headers that are currently shown in the pivot table.
     * @default false     
     */
    @Property(false)
    public showColumnHeaderHyperlink: boolean;

    /** 
     * Allows you to set the visibility of hyperlink in value cells that are currently shown in the pivot table.
     * @default false     
     */
    @Property(false)
    public showValueCellHyperlink: boolean;

    /** 
     * Allows you to set the visibility of hyperlink in summary cells that are currently shown in the pivot table.
     * @default false     
     */
    @Property(false)
    public showSummaryCellHyperlink: boolean;

    /** 
     * Allow options for setting the visibility of hyperlink based on specific condition. The options available here are as follows:
     * * `measure`: Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
     * * `condition`: Allows you to choose the operator type such as equals, greater than, less than, etc.
     * * `value1`: Allows you to set the start value.
     * * `value2`: Allows you to set the end value. This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     * @default []
     */
    @Collection<ConditionalSettingsModel[]>([], ConditionalSettings)
    public conditionalSettings: ConditionalSettingsModel[];

    /** 
     * Allows you to set the visibility of hyperlink in the cells based on specific row or column header.
     */
    @Property()
    public headerText: string;

    /** 
     * Allows you to add the CSS class name to the hyperlink options. Use this class name you can apply styles to a hyperlink easily at your end.
     * @default ''
     */
    @Property('')
    public cssClass: string;
}

/** 
 * Allow options to configure the view port as either pivot table or pivot chart or both table and chart. The options available are:
 * * `view`: Allows you to choose the view port as either pivot table or pivot chart or both table and chart. 
 * * `primary`: Allows you to set the primary view to be either pivot table or pivot chart. To use this option, it requires the property `view` to be **Both**. 
 */
export class DisplayOption extends ChildProperty<DisplayOption> {
    /** 
     * Allows you to choose the view port as either table or chart or both table and chart. The available options are:
     * * `Table`: Allows you to render the component as tabular form. 
     * * `Chart`: Allows you to render the component as graphical format.
     * * `Both`: Allows you to render the component as both table and chart.
     * > By default, **Table** is used as a default view in the component.
     * @default Table     
     */
    @Property('Table')
    public view: View;

    /** 
     * Allows you to set the primary view to be either table or chart.The available options are:
     * * `Table`: Allows you to display the pivot table as primary view.
     * * `Chart`: Allows you to display the pivot chart as primary view.
     * > To use this option, it requires the property `view` to be **Both**.
     * @default Table     
     */
    @Property('Table')
    public primary: Primary;
}
/* tslint:enable */
/**
 * Represents the PivotView component.
 * ```html
 * <div id="PivotView"></div>
 * <script>
 *  var pivotviewObj = new PivotView({ enableGroupingBar: true });
 *  pivotviewObj.appendTo("#pivotview");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class PivotView extends Component<HTMLElement> implements INotifyPropertyChanged {

    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public dataType: string;
    /** @hidden */
    public tooltip: Tooltip;
    /** @hidden */
    public grid: Grid;
    /** @hidden */
    public chart: Chart | AccumulationChart;
    /** @hidden */
    public currentView: Primary;
    /** @hidden */
    public isChartLoaded: boolean;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public isAdaptive: Boolean;
    /** @hidden */
    public isTouchMode: Boolean;
    /** @hidden */
    public fieldListSpinnerElement: HTMLElement;
    /** @hidden */
    public isRowCellHyperlink: Boolean;
    /** @hidden */
    public isColumnCellHyperlink: Boolean;
    /** @hidden */
    public isValueCellHyperlink: Boolean;
    /** @hidden */
    public isSummaryCellHyperlink: Boolean;
    /** @hidden */
    public clonedDataSet: IDataSet[];
    /** @hidden */
    public clonedReport: DataSourceSettingsModel;
    /** @hidden */
    public verticalScrollScale: number = 1;
    /** @hidden */
    public horizontalScrollScale: number = 1;
    /** @hidden */
    public scrollerBrowserLimit: number = 8000000;
    /** @hidden */
    public lastSortInfo: ISort = {};
    /** @hidden */
    public lastFilterInfo: IFilter = {};
    /** @hidden */
    public lastAggregationInfo: IFieldOptions = {};
    /** @hidden */
    public lastCalcFieldInfo: ICalculatedFields = {};
    /** @hidden */
    public lastCellClicked: Element;
    /** @hidden */
    public isScrolling: boolean = false;

    //Module Declarations
    public pivotView: PivotView;
    /** @hidden */
    public renderModule: Render;
    /** @hidden */
    public engineModule: PivotEngine;
    /** @hidden */
    public olapEngineModule: OlapEngine;
    /** @hidden */
    public pivotCommon: PivotCommon;
    /** @hidden */
    public axisFieldModule: AxisFields;
    /** @hidden */
    public groupingBarModule: GroupingBar;
    /** @hidden */
    public pivotButtonModule: PivotButton;
    /** @hidden */
    public commonModule: Common;
    /** @hidden */
    public pivotFieldListModule: PivotFieldList;
    /** @hidden */
    public excelExportModule: ExcelExport;
    /** @hidden */
    public pdfExportModule: PDFExport;
    /** @hidden */
    public virtualscrollModule: VirtualScroll;
    /** @hidden */
    public drillThroughModule: DrillThrough;
    /** @hidden */
    public calculatedFieldModule: CalculatedField;
    /** @hidden */
    public conditionalFormattingModule: ConditionalFormatting;
    /** @hidden */
    public keyboardModule: KeyboardInteraction;
    /** @hidden */
    public contextMenuModule: PivotContextMenu;
    /** @hidden */
    public toolbarModule: Toolbar;
    /** @hidden */
    public chartModule: PivotChart;
    /** @hidden */
    public numberFormattingModule: NumberFormatting;
    /** @hidden */
    public groupingModule: Grouping;
    /** @hidden */
    public notEmpty: boolean;

    private defaultLocale: Object;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;
    private isEmptyGrid: boolean;
    private shiftLockedPos: string[] = [];
    private savedSelectedCellsPos: { rowIndex: string, colIndex: string }[] = [];
    private cellSelectionPos: { rowIndex: string, colIndex: string }[] = [];
    private isPopupClicked: boolean = false;
    private isMouseDown: boolean = false;
    private isMouseUp: boolean = false;
    private lastSelectedElement: HTMLElement;
    private fieldsType: IStringIndex = {};
    private remoteData: string[][] | IDataSet[] = [];
    private defaultItems: { [key: string]: ContextMenuItemModel } = {};
    private isCellBoxMultiSelection: boolean = false;
    /** @hidden */
    public gridHeaderCellInfo: CellTemplateArgs[] = [];
    /** @hidden */
    public gridCellCollection: { [key: string]: HTMLElement } = {};
    /** @hidden */
    public rowRangeSelection: { enable: boolean, startIndex: number, endIndex: number } =
        { enable: false, startIndex: 0, endIndex: 0 };
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public virtualDiv: HTMLElement;
    /** @hidden */
    public virtualHeaderDiv: HTMLElement;
    /** @hidden */
    public resizeInfo: ResizeInfo = {};
    /** @hidden */
    public scrollPosObject: ScrollInfo =
        {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
    /** @hidden */
    public pivotColumns: PivotColumn[] = [];
    /** @hidden */
    public firstColWidth: number | string;
    /** @hidden */
    public totColWidth: number = 0;
    /** @hidden */
    public posCount: number = 0;
    /** @hidden */
    public isModified: boolean = false;
    /** @hidden */
    private isInitialRendering: boolean = false;
    /** @hidden */
    public lastGridSettings: GridSettingsModel;
    protected needsID: boolean = true;
    private cellTemplateFn: Function;
    private tooltipTemplateFn: Function;
    private pivotRefresh: Function = Component.prototype.refresh;
    private selectedRowIndex: number;
    private request: XMLHttpRequest;

    /* tslint:disable */
    //Property Declarations

    /**
     * Allows values with a specific country currency format to be displayed in the pivot table. 
     * Standard currency codes referred to as ISO 4217 can be used for the formatting of currency values. 
     * For example, to display "US Dollar($)" currency values, set the `currencyCode` to **USD**. 
     * > It is applicable ony for Relational data.
     * @private
     */
    @Property('USD')
    private currencyCode: string;

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
    @Property(false)
    public showFieldList: boolean;

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
    @Complex<GridSettingsModel>({}, GridSettings)
    public gridSettings: GridSettingsModel;

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
    @Complex<ChartSettingsModel>({}, ChartSettings)
    public chartSettings: ChartSettingsModel;

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
    @Complex<GroupingBarSettingsModel>({}, GroupingBarSettings)
    public groupingBarSettings: GroupingBarSettingsModel;

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
    @Complex<HyperlinkSettingsModel>({}, HyperlinkSettings)
    public hyperlinkSettings: HyperlinkSettingsModel;

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
    @Complex<DataSourceSettingsModel>({}, DataSourceSettings)
    public dataSourceSettings: DataSourceSettingsModel;

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
    @Complex<CellEditSettingsModel>({}, CellEditSettings)
    public editSettings: CellEditSettingsModel;

    /** 
     * Allow options to configure the view port as either pivot table or pivot chart or both table and chart. The options available are:
     * * `view`: Allows you to choose the view port as either pivot table or pivot chart or both table and chart. 
     * * `primary`: Allows you to set the primary view to be either pivot table or pivot chart. To use this option, it requires the property `view` to be **Both**. 
     */
    @Complex<DisplayOptionModel>({}, DisplayOption)
    public displayOption: DisplayOptionModel;


    /**
     * It holds the collection of cell information that has been populated from the engine on the basis of the given pivot report to render the component as table and chart.
     */
    @Property()
    public pivotValues: IPivotValues;

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
    @Property(false)
    public showGroupingBar: boolean;

    /**
     * Allows you to display the tooltip to the value cells either by mouse hovering or by touch in the pivot table. 
     * The information used to be displayed in the tooltip is:
     * * Row: Holds the row header information of a specific value cell.
     * * Column: Holds the column header information of a specific value cell.
     * * Value: Holds the value field caption along with its value of a specific value cell.

     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /** 
     * Allows you to show the toolbar UI that holds built-in toolbar options to accessing frequently used features like 
     * switching between pivot table and pivot chart, changing chart types, conditional formatting, number formatting, exporting, etc… with ease at runtime.
     * @default false     
     */
    @Property(false)
    public showToolbar: boolean;

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
     * @default []
     */
    @Property([])
    public toolbar: ToolbarItems[];

    /**
     * Allows you to create a pivot button with "Values" as a caption used to display in the grouping bar and field list UI. 
     * It helps you to plot the value fields to either column or row axis during runtime.
     * > The showValuesButton property is enabled by default for the OLAP data source. 
     * And the pivot button can be displayed with "Measures" as a caption used to display in the grouping bar and field list UI.
     * @default false
     */
    @Property(false)
    public showValuesButton: boolean;

    /**
     * Allows the built-in calculated field dialog to be displayed in the component. 
     * You can view the calculated field dialog by clicking the "Calculated Field" button in the field list UI. 
     * This dialog will helps you to create a new calculated field in the pivot table, based on available fields from the bound data source or using simple formula with basic arithmetic operators at runtime.
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * Allows you to sort individual value field and its aggregated values either in row or column axis to ascending or descending order. 
     * You can sort the values by clicking directly on the value field header positioned either in row or column axis of the pivot table.
     * @default false
     */
    @Property(false)
    public enableValueSorting: boolean;

    /** 
     * Allows you to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions. 
     * You can apply the conditioanl formatting at runtime through the built-in dialog, invoked from the toolbar. 
     * To do so, set `allowConditionalFormatting` and `showToolbar` properties to **true** to the component. 
     * Also, include the toolbar option **ConditionalFormatting** in the `toolbar` property.
     * > You can also view the conditioanl formatting dialog by clicking an external button using the `showConditionalFormattingDialog` method.
     * @default false
     */
    @Property(false)
    public allowConditionalFormatting: boolean;

    /** 
     * Allows you to apply required number formatting to the pivot table values such as number, curreny, percentage or other custom formats at runtime through a built-in dialog, invoked from the toolbar. 
     * To do so, set allowNumberFormatting and showToolbar properties to true to the component. 
     * Also, include the toolbar option NumberFormatting in the toolbar property.
     * > You can also view the number formatting dialog by clicking an external button using the ShowNumberFormattingDialog method.
     * @default false
     */
    @Property(false)
    public allowNumberFormatting: boolean;

    /** 
     * Allow the height of the pivot table to be set.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /** 
     * Allow the width of the pivot table to be set. 
     * > The pivot table will not display less than 400px, as it is the minimum width to the component.
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**    
     * Allows the pivot table data to be exported as an Excel document. Export can be done in two different file formats such as  XLSX and CSV formats. 
     * You can export pivot table using the build-in toolbar option. To do so, set `allowExcelExport` and `showToolbar` properties to true to the component. 
     * Also, include the toolbar option **Exporting** in the `toolbar` property.
     * > You can also export the pivot table data by clicking an external button using the excelExport method. Use csvExport method to export the pivot table data to CSV format.
     * @default false    
     */
    @Property(false)
    public allowExcelExport: boolean;

    /**    
     * Allows to load the large amounts of data without any performance degradation by rendering rows and columns only in the current content view port. 
     * Rest of the aggregated data will be brought into view port dynamically based on vertical or horizontal scroll position.
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**         
     * Allows to view the underlying raw data of a summarized cell in the pivot table. 
     * By double-clicking on any value cell, you can view the detailed raw data in a data grid inside a new window. 
     * In the new window, row header, column header and measure name of the clicked cell will be shown at the top. 
     * You can also include or exclude fields available in the data grid using column chooser option.
     * @default false
     */
    @Property(false)
    public allowDrillThrough: boolean;

    /**    
     * Allows the pivot table data to be exported as an PDF document. You can export pivot table using the build-in toolbar option. 
     * To do so, set `allowPdfExport` and `showToolbar` properties to true to the component. 
     * Also, include the toolbar option **Exporting** in the `toolbar` property.
     * > You can also export the pivot table data by clicking an external button using the pdfExport method.
     * @default false    
     */
    @Property(false)
    public allowPdfExport: boolean;

    /**
     * Allows the pivot table component to be updated only on demand, meaning, 
     * you can perform a variety of operations such as drag-and-drop fields between row, column, value and filter axes, 
     * apply sorting and filtering inside the Field List, resulting the field list UI would be updated on its own, but not the pivot table.
     * On clicking the “Apply” button in the Field List, the pivot table will updates the last modified report. 
     * This helps to improve the performance of the pivot table component rendering.
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

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
    @Property(false)
    public allowDataCompression: boolean;

    /**
     * Allows you to set the limit for displaying members while loading large data in the member filter dialog. 
     * Based on this limit, initial loading will be completed quickly without any performance constraint.
     * A message with remaining member count, that are not currently shown in the member filter dialog UI, will be displayed in the member editor.
     * > This property is not applicable to user-defined hierarchies in the OLAP data source.
     * @default 1000    
     */
    @Property(1000)
    public maxNodeLimitInMemberEditor: number;

    /**
     * Allows you to set the maximum number of raw data that used to view it in a data grid inside a new window while performing drill through on summarized cells in the pivot table. 
     * For example, if the value cell has a combination of more than 50,000 records, it allows only 10,000 records fetch from the cube and displayed in the data grid.
     * > This property is applicable only for the OLAP data source.
     * @default 10000 
     */
    @Property(10000)
    public maxRowsInDrillThrough: number;

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
    @Property(true)
    public loadOnDemandInMemberEditor: boolean;

    /**
     * Allows to restrict the cross-site scripting while using cell template, meaning it will remove the unwanted scripts,styles or HTML in your cell template. 
     * > In general, the cross-site scripting known as XSS is a type of computer security vulnerability typically found in web applications.
     * It attacks enable attackers to inject client-side scripts into web pages viewed by other users.
     * @default true    
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Allows the table cell elements to be customized with either an HTML string or the element’s ID, 
     * that can be used to add additional HTML elements with custom formats to the cell elements that are displayed in the pivot table.
     * @default null
     */
    @Property()
    public cellTemplate: string;

    /**
     * Allows the tooltip element to be customized with either an HTML string or the element’s ID,
     * can be used to displayed with custom formats either by mouse hovering or by touch in the pivot table.
     * @default null
     */
    @Property()
    public tooltipTemplate: string;

    /**
     * Allows the appearance of the loading indicator to be customized with either an HTML string or the element’s ID, 
     * that can be used to displayed with custom formats in the pivot table.
     * @default null
     */
    @Property()
    public spinnerTemplate: string;

    /**
     * Allows you to show the grouping UI in the pivot table that automatically groups date, time, number and string at runtime 
     * by right clicking on the pivot table’s row or column header, select **Group**. This will shows a dialog in which you can perform grouping with appropriate options to group the data. 
     * To ungroup, right click on the pivot table’s row or column header, select **Ungroup**.
     * > This property is applicable only for relational data source.
     * @default false
     */
    @Property(false)
    public allowGrouping: boolean;

    /**    
     * Allows you to export the pivot table data of all pages, i.e. the data that holds all the records given to render the pivot table will be exported as either an Excel or a PDF document.
     * 
     * To use this option, it requires the property `enableVirtualization` to be **true**.
     * @default true
     */
    @Property(true)
    public exportAllPages: boolean;

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
    @Property(['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'])
    public aggregateTypes: AggregateTypes[];

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
    @Property(['Column', 'Bar', 'Line', 'Area', 'Scatter', 'Polar', 'StackingColumn', 'StackingArea', 'StackingBar', 'StepLine', 'StepArea', 'SplineArea', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'Bubble', 'Pareto', 'Radar', 'Pie', 'Doughnut', 'Funnel', 'Pyramid'])
    public chartTypes: ChartSeriesType[];

    //Event Declarations
    /**
     * @hidden
     */
    @Event()
    protected queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected resizing: EmitType<ResizeArgs>;

    /**
     * @hidden
     */
    @Event()
    protected resizeStop: EmitType<ResizeArgs>;

    /**
     * @hidden
     */
    @Event()
    protected pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected columnDragStart: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    protected columnDrag: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    protected columnDrop: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    protected beforePdfExport: EmitType<Object>;

    /** @hidden */
    @Event()
    protected beforeExcelExport: EmitType<Object>;

    /**
     * @hidden
     */
    @Event()
    public beforeColumnsRender: EmitType<ColumnRenderEventArgs>;

    /**
     * @hidden
     */
    @Event()
    public selected: EmitType<CellSelectEventArgs>;

    /**
     * @hidden
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**
     * @hidden
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * @hidden
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected chartTooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected chartLoaded: EmitType<ILoadedEventArgs>;

    /** @hidden */
    @Event()
    protected chartLoad: EmitType<ILoadedEventArgs>;

    /**
     * @hidden
     */
    @Event()
    protected chartResized: EmitType<IResizeEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    @Event()
    protected chartAxisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /** @hidden */
    @Event()
    protected chartPointClick: EmitType<IPointEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    @Event()
    public contextMenuClick: EmitType<ContextMenuClickEventArgs>;

    /**
     * @hidden
     * @deprecated
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * It allows any customization of Pivot cell style while PDF exporting.
     * @event
     * @blazorproperty 'PdfCellRender'
     */
    @Event()
    public onPdfCellRender: EmitType<PdfCellRenderArgs>;

    /**
     * It allows you to save the report to the specified storage.
     * @event
     */
    @Event()
    public saveReport: EmitType<SaveReportArgs>;

    /**
     * It allows you to fetch the report names from specified storage.
     * @event
     * @blazorproperty 'FetchReport'
     */
    @Event()
    public fetchReport: EmitType<FetchReportArgs>;

    /**
     * It allows to load the report from specified storage.
     * @event
     * @blazorproperty 'LoadReport'
     */
    @Event()
    public loadReport: EmitType<LoadReportArgs>;

    /**
     * It allows you to rename the current report.
     * @event
     */
    @Event()
    public renameReport: EmitType<RenameReportArgs>;

    /**
     * It allows you to remove the current report from the specified storage.
     * @event
     */
    @Event()
    public removeReport: EmitType<RemoveReportArgs>;

    /**
     * It allows to set the new report.
     * @event
     */
    @Event()
    public newReport: EmitType<NewReportArgs>;

    /**
     * It allows to change the toolbar items.
     * @event
     * @blazorproperty 'ToolbarRendered'
     */
    @Event()
    public toolbarRender: EmitType<ToolbarArgs>;

    /**
     * It allows to change the toolbar items.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.Blazor.Navigations.ClickEventArgs
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;

    /**
     * It allows any customization on the pivot table component properties on initial rendering.
     * Based on the changes, pivot table will be redered.
     * @event
     * @blazorproperty 'OnLoad'
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * It triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * It triggers after the pivot engine populated and allows to customize the pivot datasource settings.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * It triggers after a field dropped into the axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /**
     * It triggers before a field drops into any axis.
     * @event
     * @blazorproperty 'FieldDrop'
     */
    @Event()
    public fieldDrop: EmitType<FieldDropEventArgs>;

    /**
     * It triggers when a field drag (move) starts.
     * @event
     * @blazorproperty 'FieldDragStart'
     */
    @Event()
    public fieldDragStart: EmitType<FieldDragStartEventArgs>;

    /** 
     * It triggers when the pivot table rendered.
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * It triggers when the pivot table component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * It triggers when pivot table component getting destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * It allows to set properties for exporting.
     * @event
     * @deprecated
     */
    @Event()
    public beforeExport: EmitType<BeforeExportEventArgs>;

    /**
     * It allows to do changes before applying the conditional formatting.
     * @event
     */
    @Event()
    public conditionalFormatting: EmitType<IConditionalFormatSettings>;

    /**
     * It triggers before the filtering applied.
     * @event
     */
    @Event()
    public memberFiltering: EmitType<MemberFilteringEventArgs>;

    /** 
     * It triggers when a cell is clicked in the pivot table.
     * @event
     */
    @Event()
    public cellClick: EmitType<CellClickEventArgs>;

    /** 
     * It triggers when a value cell is clicked in the pivot table for Drill-Through.
     * @event
     * @blazorproperty 'DrillThrough'
     */
    @Event()
    public drillThrough: EmitType<DrillThroughEventArgs>;

     /** 
     * It triggers when editing is made in the raw data of pivot table.
     * @event
     * @blazorproperty 'EditComplete'
     */
    @Event()
    public editComplete: EmitType<EditCompleteEventArgs>;

    /** 
     * It triggers when a value cell is clicked in the pivot table for Editing.
     * @event
     * @blazorproperty 'BeginDrillThrough'
     */
    @Event()
    public beginDrillThrough: EmitType<BeginDrillThroughEventArgs>;

    /** 
     * It triggers when a hyperlink cell is clicked in the pivot table.
     * @event
     * @blazorproperty 'HyperlinkCellClicked'
     */
    @Event()
    public hyperlinkCellClick: EmitType<HyperCellClickEventArgs>;

    /** 
     * It triggers before a cell selected in pivot table.
     * @event
     * @blazorproperty 'CellSelecting'
     */
    @Event()
    public cellSelecting: EmitType<PivotCellSelectedEventArgs>;

    /** 
     * It triggers before the header to be either expanded or collapsed in the pivot table.
     * @event
     */
    @Event()
    public drill: EmitType<DrillArgs>;

    /** 
     * It triggers when a cell got selected in the pivot table.
     * @event
     * @blazorproperty 'CellSelected'
     */
    @Event()
    public cellSelected: EmitType<PivotCellSelectedEventArgs>;

    /** 
     * It triggers when the pivot chart series are created.
     * @event
     * @blazorproperty 'ChartSeriesCreated'
     */
    @Event()
    public chartSeriesCreated: EmitType<ChartSeriesCreatedEventArgs>;

    /**
     * It allows to change the each cell value during engine populating.
     * @event
     * @deprecated
     */
    @Event()
    public aggregateCellInfo: EmitType<AggregateEventArgs>;

    /**
     * It allows to identify whether the field list updated or not.
     * @event
     * @blazorproperty 'FieldListRefreshed'
     */
    @Event()
    public fieldListRefreshed: EmitType<FieldListRefreshedEventArgs>;

    /**
     * It triggers before member editor dialog opens.
     * @event
     * @blazorproperty 'MemberEditorOpen'
     */
    @Event()
    public memberEditorOpen: EmitType<MemberEditorOpenEventArgs>;

    /**
     * It triggers before a calculated field created/edited during runtime.
     * @event
     * @blazorproperty 'CalculatedFieldCreate'
     */
    @Event()
    public calculatedFieldCreate: EmitType<CalculatedFieldCreateEventArgs>;

    /**
     * It triggers before number format is apllied to specific field during runtime.
     * @event
     * @blazorproperty 'NumberFormatting'
     */
    @Event()
    public numberFormatting: EmitType<NumberFormattingEventArgs>;

    /**
     * It triggers before aggregate type context menu opens.
     * @event
     * @blazorproperty 'AggregateMenuOpen'
     */
    @Event()
    public aggregateMenuOpen: EmitType<AggregateMenuOpenEventArgs>;

    /**
     * It triggers before removing the field from any axis during runtime.
     * @event
     * @blazorproperty 'FieldRemove'
     */
    @Event()
    public fieldRemove: EmitType<FieldRemoveEventArgs>;

    /* tslint:enable */
    /**
     * Constructor for creating the widget
     * @param  {PivotViewModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: PivotViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.pivotView = this;
        setValue('mergePersistData', this.mergePersistPivotData, this);
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        modules.push({ args: [this], member: 'groupingbar' });
        if (this.allowConditionalFormatting) {
            modules.push({ args: [this], member: 'conditionalformatting' });
        }
        if (this.allowNumberFormatting) {
            modules.push({ args: [this], member: 'numberformatting' });
        }
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        if (this.showToolbar && this.toolbar.length > 0) {
            modules.push({ args: [this], member: 'toolbar' });
        }
        if (this.showFieldList) {
            modules.push({ args: [this], member: 'fieldlist' });
        }
        if (this.allowExcelExport) {
            modules.push({ args: [this], member: 'excelExport' });
        }
        if (this.allowPdfExport) {
            modules.push({ args: [this], member: 'pdfExport' });
        }
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualscroll' });
        }
        if (this.allowGrouping) {
            modules.push({ args: [this], member: 'grouping' });
        }
        return modules;
    }

    /**
     * For internal use only - Initializing internal properties;
     * @private
     */
    protected preRender(): void {
        if (this.dataSourceSettings && this.dataSourceSettings.providerType === 'SSAS') {
            this.dataType = 'olap';
            this.olapEngineModule = new OlapEngine();
        } else {
            this.dataType = 'pivot';
            this.engineModule = new PivotEngine();
        }
        this.isAdaptive = Browser.isDevice;
        if (Browser.isIE || Browser.info.name === 'edge') {
            this.scrollerBrowserLimit = 1500000;
        } else if (Browser.info.name === 'chrome') {
            this.scrollerBrowserLimit = 15000000;
        }
        this.isTouchMode = closest(this.element, 'e-bigger') ? true : false;
        this.initProperties();
        this.renderToolTip();
        this.keyboardModule = new KeyboardInteraction(this);
        this.contextMenuModule = new PivotContextMenu(this);
        this.globalize = new Internationalization(this.locale);
        if (this.showFieldList || this.showGroupingBar || this.allowNumberFormatting || this.allowCalculatedField ||
            this.toolbar || this.allowGrouping || this.gridSettings.contextMenuItems) {
            this.commonModule = new Common(this);
        }
        this.defaultLocale = {
            grandTotal: 'Grand Total',
            total: 'Total',
            value: 'Value',
            noValue: 'No value',
            row: 'Row',
            column: 'Column',
            collapse: 'Collapse',
            expand: 'Expand',
            rowAxisPrompt: 'Drop row here',
            columnAxisPrompt: 'Drop column here',
            valueAxisPrompt: 'Drop value here',
            filterAxisPrompt: 'Drop filter here',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            CalculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            search: 'Search',
            drag: 'Drag',
            remove: 'Remove',
            allFields: 'All Fields',
            formula: 'Formula',
            addToRow: 'Add to Row',
            addToColumn: 'Add to Column',
            addToValue: 'Add to Value',
            addToFilter: 'Add to Filter',
            emptyData: 'No records to display',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            sortAscending: 'Sort ascending order',
            sortDescending: 'Sort descending order',
            sortNone: 'Sort data order',
            clearCalculatedField: 'Clear edited field info',
            editCalculatedField: 'Edit calculated field',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            all: 'All',
            multipleItems: 'Multiple items',
            /* tslint:disable */
            member: 'Member',
            label: 'Label',
            date: 'Date',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            MoreOption: 'More...',
            /* tslint:enable */
            NotEquals: 'Not Equals',
            AllValues: 'All Values',
            conditionalFormating: 'Conditional Formatting',
            apply: 'Apply',
            condition: 'Add Condition',
            formatLabel: 'Format',
            valueFieldSettings: 'Value field settings',
            baseField: 'Base field',
            baseItem: 'Base item',
            summarizeValuesBy: 'Summarize values by',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            details: 'Details',
            manageRecords: 'Manage Records',
            Years: 'Years',
            Quarters: 'Quarters',
            Months: 'Months',
            Days: 'Days',
            Hours: 'Hours',
            Minutes: 'Minutes',
            Seconds: 'Seconds',
            save: 'Save a report',
            new: 'Create a new report',
            load: 'Load',
            saveAs: 'Save as current report',
            rename: 'Rename a current report',
            deleteReport: 'Delete a current report',
            export: 'Export',
            subTotals: 'Sub totals',
            grandTotals: 'Grand totals',
            reportName: 'Report Name :',
            pdf: 'PDF',
            excel: 'Excel',
            csv: 'CSV',
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG',
            mdxQuery: 'MDX Query',
            showSubTotals: 'Show sub totals',
            doNotShowSubTotals: 'Do not show sub totals',
            showSubTotalsRowsOnly: 'Show sub totals rows only',
            showSubTotalsColumnsOnly: 'Show sub totals columns only',
            showGrandTotals: 'Show grand totals',
            doNotShowGrandTotals: 'Do not show grand totals',
            showGrandTotalsRowsOnly: 'Show grand totals rows only',
            showGrandTotalsColumnsOnly: 'Show grand totals columns only',
            fieldList: 'Show fieldlist',
            grid: 'Show table',
            toolbarFormatting: 'Conditional formatting',
            chart: 'Chart',
            reportMsg: 'Please enter vaild report name!!!',
            reportList: 'Report list',
            removeConfirm: 'Are you sure you want to delete this report?',
            emptyReport: 'No reports found!!',
            bar: 'Bar',
            pie: 'Pie',
            funnel: 'Funnel',
            doughnut: 'Doughnut',
            pyramid: 'Pyramid',
            stackingcolumn: 'Stacked Column',
            stackingarea: 'Stacked Area',
            stackingbar: 'Stacked Bar',
            stepline: 'Step Line',
            steparea: 'Step Area',
            splinearea: 'Spline Area',
            spline: 'Spline',
            stackingcolumn100: '100% Stacked Column',
            stackingbar100: '100% Stacked Bar',
            stackingarea100: '100% Stacked Area',
            bubble: 'Bubble',
            pareto: 'Pareto',
            radar: 'Radar',
            line: 'Line',
            area: 'Area',
            scatter: 'Scatter',
            polar: 'Polar',
            of: 'of',
            emptyFormat: 'No format found!!!',
            emptyInput: 'Enter a value',
            newReportConfirm: 'Do you want to save the changes to this report?',
            emptyReportName: 'Enter a report name',
            qtr: 'Qtr',
            null: 'null',
            undefined: 'undefined',
            groupOutOfRange: 'Out of Range',
            fieldDropErrorAction: 'The field you are moving cannot be placed in that area of the report',
            aggregate: 'Aggregate',
            drillThrough: 'Drill Through',
            ascending: 'Ascending',
            descending: 'Descending',
            number: 'Number',
            currency: 'Currency',
            percentage: 'Percentage',
            formatType: 'Format Type',
            customText: 'Currency Symbol',
            symbolPosition: 'Symbol Position',
            left: 'Left',
            right: 'Right',
            grouping: 'Grouping',
            true: 'True',
            false: 'False',
            decimalPlaces: 'Decimal Places',
            numberFormat: 'Number Formatting',
            memberType: 'Field Type',
            formatString: 'Format',
            expressionField: 'Expression',
            customFormat: 'Enter custom format string',
            numberFormatString: 'Example: C, P, 0000 %, ###0.##0#, etc.',
            selectedHierarchy: 'Parent Hierarchy',
            olapDropText: 'Example: [Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
            Percent: 'Percent',
            Currency: 'Currency',
            Custom: 'Custom',
            Measure: 'Measure',
            Dimension: 'Dimension',
            Standard: 'Standard',
            blank: '(Blank)',
            fieldTooltip: 'Drag and drop fields to create an expression. ' +
                'And, if you want to edit the existing calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            drillError: 'Cannot show the raw items of calculated fields.',
            caption: 'Field Caption',
            copy: 'Copy',
            defaultReport: 'Sample Report',
            customFormatString: 'Custom Format',
            invalidFormat: 'Invalid Format.',
            group: 'Group',
            unGroup: 'Ungroup',
            invalidSelection: 'Cannot group that selection.',
            groupName: 'Enter the caption to display in header',
            captionName: 'Enter the caption for group field',
            selectedItems: 'Selected items',
            groupFieldCaption: 'Field caption',
            groupTitle: 'Group name',
            startAt: 'Starting at',
            endAt: 'Ending at',
            groupBy: 'Interval by',
            selectGroup: 'Select groups',
            multipleAxes: 'Multiple Axes',
            showLegend: 'Show Legend',
            exit: 'Exit',
            chartTypeSettings: 'Chart Type Settings',
            ChartType: 'Chart Type',
            yes: 'Yes',
            no: 'No',
            numberFormatMenu: 'Number Formatting...',
            conditionalFormatingMenu: 'Conditional Formatting...',
            removeCalculatedField: 'Are you sure you want to delete this calculated field?',
            replaceConfirmBefore: 'A report named ',
            replaceConfirmAfter: ' already exists. Do you want to replace it?',
            invalidJSON: 'Invalid JSON data',
            invalidCSV: 'Invalid CSV data'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.renderContextMenu();
        this.isDragging = false;
        this.addInternalEvents();
        //setCurrencyCode(this.currencyCode);
    }

    private onBeforeTooltipOpen(args: TooltipEventArgs): void {
        args.element.classList.add('e-pivottooltipwrap');
    }

    private renderToolTip(): void {
        if (this.showTooltip) {
            if (this.tooltipTemplate) {
                this.tooltip = new Tooltip({
                    target: 'td.e-valuescontent',
                    cssClass: 'e-pivottooltiptemplate',
                    showTipPointer: false,
                    position: 'BottomRight',
                    mouseTrail: true,
                    enableRtl: this.enableRtl,
                    beforeRender: this.setToolTip.bind(this),
                    beforeOpen: this.onBeforeTooltipOpen,
                });
            } else {
                this.tooltip = new Tooltip({
                    target: 'td.e-valuescontent',
                    showTipPointer: false,
                    position: 'BottomRight',
                    mouseTrail: true,
                    enableRtl: this.enableRtl,
                    beforeRender: this.setToolTip.bind(this),
                    beforeOpen: this.onBeforeTooltipOpen
                });
            }
            this.tooltip.isStringTemplate = true;
            this.tooltip.appendTo(this.element);
        } else if (this.tooltip) {
            this.tooltip.destroy();
        }
    }

    /** @hidden */
    public renderContextMenu(): void {
        if (this.gridSettings.contextMenuItems || (this.allowGrouping && this.dataType === 'pivot')) {
            let conmenuItems: ContextMenuItemModel[] = [];
            let groupItems: ContextMenuItemModel[] = [];
            let customItems: ContextMenuItemModel[] = [];
            let exportItems: ContextMenuItemModel[] = [];
            let aggItems: ContextMenuItemModel[] = [];
            let expItems: ContextMenuItemModel[] = [];
            let aggregateItems: ContextMenuItemModel[] = [];
            if (this.gridSettings.contextMenuItems) {
                for (let item of this.gridSettings.contextMenuItems) {
                    if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                        if ((item as string).toString().toLowerCase().indexOf('aggregate') !== -1 && this.dataType === 'pivot') {
                            aggregateItems = [
                                { text: this.localeObj.getConstant('Sum') }
                            ];
                            let aggregateGroup: ContextMenuItemModel = this.buildDefaultItems('Aggregate');
                            aggregateGroup.items = aggregateItems;
                            aggItems.push(aggregateGroup);
                        } else if ((item as string).toString().toLowerCase().indexOf('export') !== -1) {
                            exportItems.push(this.buildDefaultItems(item));
                        } else {
                            conmenuItems.push(this.buildDefaultItems(item));
                        }
                    } else if (typeof item !== 'string') {
                        customItems.push(item);
                    }
                }
            }
            if (this.allowGrouping && this.dataType === 'pivot') {
                groupItems.push(this.buildDefaultItems('Group'));
                groupItems.push(this.buildDefaultItems('Ungroup'));
            }
            if (exportItems.length > 0) {
                let exportGroupItems: ContextMenuItemModel = this.buildDefaultItems('export');
                exportGroupItems.items = exportItems;
                expItems.push(exportGroupItems);
            }
            this.gridSettings.contextMenuItems = [];
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, aggItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, conmenuItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, groupItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, expItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, customItems);
        }
    }

    /**
     * @hidden
     */
    public getAllSummaryType(): AggregateTypes[] {
        return ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index',
            'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
            'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
            'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
    }
    private getDefaultItems(): string[] {
        return ['Drillthrough', 'Expand',
            'Collapse', 'Pdf Export', 'Excel Export', 'Csv Export', 'Sort Ascending', 'Sort Descending',
            'Aggregate', 'CalculatedField'];
    }
    private buildDefaultItems(item: string): ContextMenuItemModel {
        let menuItem: ContextMenuItemModel;
        switch (item) {
            case 'Aggregate':
                menuItem = {
                    text: this.localeObj.getConstant('aggregate'), target: 'th.e-valuesheader,td.e-valuescontent,.e-stot.e-rowsheader',
                    id: this.element.id + '_aggregate'
                };
                break;
            case 'CalculatedField':
                menuItem = {
                    text: this.localeObj.getConstant('CalculatedField'), target: 'td.e-valuescontent',
                    id: this.element.id + '_CalculatedField'
                };
                break;
            case 'Drillthrough':
                menuItem = {
                    text: this.localeObj.getConstant('drillThrough'), target: 'td.e-valuescontent',
                    id: this.element.id + '_drillthrough_menu', iconCss: cls.PIVOTVIEW_GRID + ' ' + cls.ICON
                };
                break;
            case 'export':
                menuItem = {
                    text: this.localeObj.getConstant('export'), target: 'td.e-valuescontent',
                    id: this.element.id + '_exporting', iconCss: cls.PIVOTVIEW_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Pdf Export':
                menuItem = {
                    text: this.localeObj.getConstant('pdf'), id: this.element.id + '_pdf',
                    iconCss: cls.GRID_PDF_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Excel Export':
                menuItem = {
                    text: this.localeObj.getConstant('excel'), id: this.element.id + '_excel',
                    iconCss: cls.GRID_EXCEL_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Csv Export':
                menuItem = {
                    text: this.localeObj.getConstant('csv'), id: this.element.id + '_csv',
                    iconCss: cls.GRID_CSV_EXPORT + ' ' + cls.ICON,
                };
                break;
            case 'Expand':
                menuItem = {
                    text: this.localeObj.getConstant('expand'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_expand', iconCss: cls.PIVOTVIEW_EXPAND + ' ' + cls.ICON
                };
                break;
            case 'Collapse':
                menuItem = {
                    text: this.localeObj.getConstant('collapse'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_collapse', iconCss: cls.PIVOTVIEW_COLLAPSE + ' ' + cls.ICON
                };
                break;
            case 'Sort Ascending':
                menuItem = {
                    text: this.localeObj.getConstant('ascending'), target: 'th.e-valuesheader,.e-stot',
                    id: this.element.id + '_sortasc', iconCss: cls.ICON_ASC + ' ' + cls.ICON
                };
                break;
            case 'Sort Descending':
                menuItem = {
                    text: this.localeObj.getConstant('descending'), target: 'th.e-valuesheader,.e-stot',
                    id: this.element.id + '_sortdesc', iconCss: cls.ICON_DESC + ' ' + cls.ICON
                };
                break;
            case 'Group':
                menuItem = {
                    text: this.localeObj.getConstant('group'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_custom_group', iconCss: cls.PIVOTVIEW_GROUP + ' ' + cls.ICON
                };
                break;
            case 'Ungroup':
                menuItem = {
                    text: this.localeObj.getConstant('unGroup'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_custom_ungroup', iconCss: cls.PIVOTVIEW_UN_GROUP + ' ' + cls.ICON
                };
                break;
        }
        this.defaultItems[item] = {
            text: menuItem.text, id: menuItem.id,
            target: menuItem.target, iconCss: menuItem.iconCss
        };
        return this.defaultItems[item];
    }

    private initProperties(): void {
        this.pivotRefresh = Component.prototype.refresh;
        this.isScrolling = false;
        this.allowServerDataBinding = false;
        this.setProperties({ pivotValues: [] }, true);
        /* tslint:disable-next-line:no-any */
        delete (this as any).bulkChanges.pivotValues;
        this.allowServerDataBinding = true;
        this.scrollPosObject = {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
        this.queryCellInfo = this.gridSettings.queryCellInfo ? this.gridSettings.queryCellInfo.bind(this) : undefined;
        this.headerCellInfo = this.gridSettings.headerCellInfo ? this.gridSettings.headerCellInfo.bind(this) : undefined;
        this.resizing = this.gridSettings.resizing ? this.gridSettings.resizing.bind(this) : undefined;
        this.resizeStop = this.gridSettings.resizeStop ? this.gridSettings.resizeStop.bind(this) : undefined;
        this.pdfHeaderQueryCellInfo = this.gridSettings.pdfHeaderQueryCellInfo ?
            this.gridSettings.pdfHeaderQueryCellInfo.bind(this) : undefined;
        this.pdfQueryCellInfo = this.gridSettings.pdfQueryCellInfo ? this.gridSettings.pdfQueryCellInfo.bind(this) : undefined;
        this.excelHeaderQueryCellInfo = this.gridSettings.excelHeaderQueryCellInfo ?
            this.gridSettings.excelHeaderQueryCellInfo.bind(this) : undefined;
        this.excelQueryCellInfo = this.gridSettings.excelQueryCellInfo ?
            this.gridSettings.excelQueryCellInfo.bind(this) : undefined;
        this.columnDragStart = this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined;
        this.columnDrag = this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined;
        this.columnDrop = this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined;
        this.beforeColumnsRender = this.gridSettings.columnRender ? this.gridSettings.columnRender : undefined;
        this.selected = this.gridSettings.cellSelected ? this.gridSettings.cellSelected : undefined;
        this.cellDeselected = this.gridSettings.cellDeselected ? this.gridSettings.cellDeselected : undefined;
        this.rowSelected = this.gridSettings.rowSelected ? this.gridSettings.rowSelected : undefined;
        this.rowDeselected = this.gridSettings.rowDeselected ? this.gridSettings.rowDeselected : undefined;
        this.chartTooltipRender = this.chartSettings.tooltipRender ? this.chartSettings.tooltipRender : undefined;
        this.chartLoaded = this.chartSettings.loaded ? this.chartSettings.loaded : undefined;
        this.chartLoad = this.chartSettings.load ? this.chartSettings.load : undefined;
        this.chartResized = this.chartSettings.resized ? this.chartSettings.resized : undefined;
        this.chartAxisLabelRender = this.chartSettings.axisLabelRender ? this.chartSettings.axisLabelRender : undefined;
        this.chartPointClick = this.chartSettings.pointClick ? this.chartSettings.pointClick : undefined;
        this.contextMenuClick = this.gridSettings.contextMenuClick ? this.gridSettings.contextMenuClick : undefined;
        this.contextMenuOpen = this.gridSettings.contextMenuOpen ? this.gridSettings.contextMenuOpen : undefined;
        this.beforePdfExport = this.gridSettings.beforePdfExport ? this.gridSettings.beforePdfExport.bind(this) : undefined;
        this.beforeExcelExport = this.gridSettings.beforeExcelExport ? this.gridSettings.beforeExcelExport.bind(this) : undefined;
        if (this.gridSettings.rowHeight === null) {
            if (this.isTouchMode) {
                this.setProperties({ gridSettings: { rowHeight: 36 } }, true);
            } else {
                this.setProperties({ gridSettings: { rowHeight: this.isAdaptive ? 36 : 30 } }, true);
            }

        }
        this.element.style.height = '100%';
        if (this.enableVirtualization) {
            this.updatePageSettings(true);
            if (this.allowExcelExport) {
                PivotView.Inject(ExcelExport);
            }
            if (this.allowPdfExport) {
                PivotView.Inject(PDFExport);
            }
            if (this.editSettings.allowEditing) {
                PivotView.Inject(DrillThrough);
            }
        }
        this.isCellBoxMultiSelection = this.gridSettings.allowSelection &&
            this.gridSettings.selectionSettings.cellSelectionMode === 'Box' &&
            this.gridSettings.selectionSettings.mode === 'Cell' && this.gridSettings.selectionSettings.type === 'Multiple';
        if (this.allowGrouping && !this.isCellBoxMultiSelection) {
            this.isCellBoxMultiSelection = true;
            /* tslint:disable-next-line:max-line-length */
            this.setProperties({ gridSettings: { allowSelection: true, selectionSettings: { cellSelectionMode: 'Box', mode: 'Cell', type: 'Multiple' } } }, true);
        }
        if (this.displayOption.view !== 'Table') {
            this.chartModule = new PivotChart();
        }
        this.currentView = this.currentView ? this.currentView : (this.displayOption.view === 'Both' ?
            this.displayOption.primary : this.displayOption.view);
    }

    /**
     * @hidden
     */
    public updatePageSettings(isInit: boolean): void {
        if (this.enableVirtualization) {
            let colValues: number = 1; let rowValues: number = 1;
            if (this.dataSourceSettings.values.length > 1 && this.dataType === 'pivot') {
                if (this.dataSourceSettings.valueAxis === 'row') {
                    rowValues = this.dataSourceSettings.values.length;
                } else {
                    colValues = this.dataSourceSettings.values.length;
                }
            }
            let heightAsNumber: number = this.getHeightAsNumber();
            if (isNaN(heightAsNumber)) {
                heightAsNumber = this.element.offsetHeight;
            }
            this.pageSettings = {
                columnCurrentPage: isInit ? 1 : this.pageSettings.columnCurrentPage,
                rowCurrentPage: isInit ? 1 : this.pageSettings.rowCurrentPage,
                columnSize: Math.ceil((Math.floor((this.getWidthAsNumber()) /
                    this.gridSettings.columnWidth) - 1) / colValues),
                rowSize: Math.ceil(Math.floor((heightAsNumber) / this.gridSettings.rowHeight) / rowValues),
                allowDataCompression: this.allowDataCompression
            };
        }
    }

    /* tslint:disable */
    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    public render(): void {
        this.loadData();
    }

    private loadData(): void {
        if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '') {
            this.request = new XMLHttpRequest();
            this.request.open("GET", this.dataSourceSettings.url, true);
            this.request.withCredentials = false;
            this.request.onreadystatechange = this.onReadyStateChange.bind(this);
            this.request.setRequestHeader("Content-type", "text/plain");
            this.request.send(null);
        } else {
            this.initialLoad();
        }
    }
    /* tslint:enable */

    private onReadyStateChange(): void {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            let dataSource: string[][] | IDataSet[] = [];
            if (this.dataSourceSettings.type === 'CSV') {
                let jsonObject: string[] = this.request.responseText.split(/\r?\n|\r/);
                for (let i: number = 0; i < jsonObject.length; i++) {
                    if (!isNullOrUndefined(jsonObject[i]) && jsonObject[i] !== '') {
                        (dataSource as string[][]).push(jsonObject[i].split(','));
                    }
                }
            } else {
                try {
                    dataSource = JSON.parse(this.request.responseText);
                } catch (error) {
                    dataSource = [];
                }
            }
            if (isBlazor() && dataSource.length > 0) {
                this.remoteData = dataSource;
            } else if (dataSource.length > 0) {
                this.setProperties({ dataSourceSettings: { dataSource: dataSource } }, true);
            }
            this.initialLoad();
        }
    }

    private initialLoad(): void {
        this.cellTemplateFn = this.templateParser(this.cellTemplate);
        this.tooltipTemplateFn = this.templateParser(this.tooltipTemplate);
        if (this.spinnerTemplate) {
            createSpinner({ target: this.element, template: this.spinnerTemplate }, this.createElement);
        } else {
            createSpinner({ target: this.element }, this.createElement);
        }
        let loadArgs: LoadEventArgs = {
            /* tslint:disable-next-line:max-line-length */
            dataSourceSettings: isBlazor() ? PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings) : this.dataSourceSettings as IDataOptions,
            pivotview: isBlazor() ? undefined : this,
            fieldsType: {}
        };
        this.trigger(events.load, loadArgs, (observedArgs: LoadEventArgs) => {
            if (isBlazor()) {
                observedArgs.dataSourceSettings.dataSource = this.dataSourceSettings.dataSource;
                PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            }
            else {
                this.dataSourceSettings = observedArgs.dataSourceSettings;
            }
            this.fieldsType = observedArgs.fieldsType;
            this.updateClass();
            this.notify(events.initSubComponent, {});
            this.notify(events.initialLoad, {});
            if (this.isAdaptive) {
                this.contextMenuModule.render();
            }
            this.notify(events.initToolbar, {});
        });
        if (isBlazor()) {
            this.renderComplete();
        }
    }

    /**
     * Register the internal events.
     * @returns void
     * @hidden
     */
    public addInternalEvents(): void {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.renderPivotGrid, this);
        this.on(events.contentReady, this.onContentReady, this);
    }

    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    public removeInternalEvents(): void {
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.renderPivotGrid);
        this.off(events.contentReady, this.onContentReady);
    }

    /**
     * Get the Pivot widget properties to be maintained in the persisted state.
     * @returns {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['dataSourceSettings', 'pivotValues', 'gridSettings', 'chartSettings', 'displayOption'];
        /* tslint:disable */
        this.chartSettings['tooltipRender'] = undefined;
        /* tslint:enable */
        return this.addOnPersist(keyEntity);
    }

    /**
     * Loads pivot Layout
     * @param {string} persistData - Specifies the persist data to be loaded to pivot.
     * @returns {void}
     */
    public loadPersistData(persistData: string): void {
        let pivotData: PivotView;
        /* tslint:disable */
        if (isBlazor()) {
            pivotData = persistData as any;
            pivotData.dataSourceSettings.dataSource = this.dataSourceSettings.dataSource;
        } else {
            pivotData = JSON.parse(persistData);
        }
        this.allowServerDataBinding = false;
        this.setProperties({
            gridSettings: pivotData.gridSettings,
            pivotValues: pivotData.pivotValues,
            chartSettings: pivotData.chartSettings,
            displayOption: pivotData.displayOption
        }, true);
        delete (this as any).bulkChanges.pivotValues;
        this.allowServerDataBinding = true;
        /* tslint:enable */
        this.dataSourceSettings = pivotData.dataSourceSettings;
    }

    private mergePersistPivotData(): void {
        let blazdataSource: IDataSet[] | DataManager | string[][];
        if (isBlazor()) {
            blazdataSource = this.dataSourceSettings.dataSource;
        }
        let data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            this.setProperties(JSON.parse(data), true);
        }
        if (this.dataSourceSettings.dataSource instanceof Object && isBlazor()) {
            this.setProperties({ dataSourceSettings: { dataSource: blazdataSource } }, true);
        }
    }

    /**
     * Method to open conditional formatting dialog
     */
    public showConditionalFormattingDialog(): void {
        if (this.conditionalFormattingModule) {
            this.conditionalFormattingModule.showConditionalFormattingDialog();
        }
    }

    /**
     * Method to open calculated field dialog
     */
    public createCalculatedFieldDialog(): void {
        if (this.calculatedFieldModule) {
            this.calculatedFieldModule.createCalculatedFieldDialog();
        }
    }

    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'pivotview';
    }

    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     * @hidden
     */
    public copy(withHeader?: boolean): void {
        this.grid.copy(withHeader);
    }

    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-pivotgrid.html#printmode-string).
     * @returns {void}
     * @hidden
     */
    // public print(): void {
    //     this.grid.print();
    // }

    /* tslint:disable:max-func-body-length */
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @hidden
     */
    public onPropertyChanged(newProp: PivotViewModel, oldProp: PivotViewModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSourceSettings':
                case 'hyperlinkSettings':
                case 'allowDrillThrough':
                case 'editSettings':
                case 'allowDataCompression':
                    if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).length === 1
                        && newProp.dataSourceSettings.groupSettings && this.dataType === 'pivot') {
                        this.updateGroupingReport(newProp.dataSourceSettings.groupSettings, 'Date');
                    }
                    if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).length === 1
                        && Object.keys(newProp.dataSourceSettings)[0] === 'dataSource') {
                        this.engineModule.fieldList = null;
                        this.showWaitingPopup();
                        clearTimeout(this.timeOutObj);
                        this.timeOutObj = setTimeout(this.refreshData.bind(this), 100);
                    } else {
                        if (PivotUtil.isButtonIconRefesh(prop, oldProp, newProp)) {
                            if (this.showGroupingBar && this.groupingBarModule) {
                                this.axisFieldModule.render();
                            }
                            if (this.showFieldList && this.pivotFieldListModule) {
                                let rows: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.rows);
                                let columns: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.columns);
                                let values: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.values);
                                let filters: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.filters);
                                /* tslint:disable-next-line:max-line-length */
                                this.pivotFieldListModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                                this.pivotFieldListModule.axisFieldModule.render();
                                if (this.pivotFieldListModule.treeViewModule.fieldTable && !this.isAdaptive) {
                                    this.pivotFieldListModule.notify(events.treeViewUpdate, {});
                                }
                            }
                        } else {
                            this.remoteData = [];
                            if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '' &&
                                ('type' in newProp.dataSourceSettings || 'url' in newProp.dataSourceSettings)) {
                                this.engineModule.fieldList = null;
                                this.loadData();
                            } else {
                                if (newProp.dataSourceSettings && 'dataSource' in newProp.dataSourceSettings) {
                                    this.engineModule.fieldList = null;
                                }
                                this.notify(events.initialLoad, {});
                            }
                        }
                    }
                    break;
                case 'height':
                case 'width':
                    this.layoutRefresh();
                    break;
                case 'pivotValues':
                case 'displayOption':
                    if (!this.showToolbar && newProp.displayOption && Object.keys(newProp.displayOption).length === 1 &&
                        newProp.displayOption.view) {
                        this.currentView = (newProp.displayOption.view === 'Both' ?
                            this.displayOption.primary : newProp.displayOption.view);
                        if (this.showGroupingBar || this.showFieldList) {
                            if (this.showFieldList && this.pivotFieldListModule) {
                                this.pivotFieldListModule.destroy();
                            }
                            if (this.showGroupingBar && this.groupingBarModule) {
                                this.groupingBarModule.destroy();
                            }
                            this.notify(events.initSubComponent, this);
                        }
                        if (!this.grid && newProp.displayOption.view !== 'Chart') {
                            this.renderEmptyGrid();
                            if (newProp.displayOption.view === 'Table') {
                                if (this.chartModule) {
                                    this.chartModule.destroy();
                                    this.chart = undefined;
                                    this.chartModule = undefined;
                                }
                            }
                        } else if (!this.chartModule && this.displayOption.view !== 'Table') {
                            this.chartModule = new PivotChart();
                        }
                    }
                    this.notify(events.dataReady, {});
                    break;
                case 'gridSettings':
                    this.lastGridSettings = newProp.gridSettings;
                    this.isCellBoxMultiSelection = this.gridSettings.allowSelection &&
                        this.gridSettings.selectionSettings.cellSelectionMode === 'Box' &&
                        this.gridSettings.selectionSettings.mode === 'Cell' && this.gridSettings.selectionSettings.type === 'Multiple';
                    if (this.allowGrouping && this.groupingModule && !this.isCellBoxMultiSelection) {
                        /* tslint:disable-next-line:max-line-length */
                        this.setProperties({ gridSettings: { allowSelection: true, selectionSettings: { cellSelectionMode: 'Box', mode: 'Cell', type: 'Multiple' } } }, true);
                        this.isCellBoxMultiSelection = true;
                    }
                    this.renderModule.updateGridSettings();
                    break;
                case 'chartSettings':
                    if (this.showGroupingBar &&
                        this.groupingBarModule &&
                        (Object.keys(newProp.chartSettings).indexOf('enableMultiAxis') !== -1 ||
                            (newProp.chartSettings.chartSeries && Object.keys(newProp.chartSettings.chartSeries).indexOf('type') !== -1))) {
                        this.groupingBarModule.renderLayout();
                    }
                    this.chartModule.loadChart(this, this.chartSettings);
                    this.notify(events.uiUpdate, this);
                    break;
                case 'locale':
                case 'currencyCode':
                case 'enableRtl':
                    if (this.tooltip) {
                        this.tooltip.destroy();
                    }
                    /* tslint:disable-next-line:max-line-length */
                    if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0 && this.clonedDataSet && !isBlazor()) {
                        let dataSet: IDataSet[] = PivotUtil.getClonedData(this.clonedDataSet) as IDataSet[];
                        this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
                    }
                    if (isBlazor()) {
                        this.refresh();
                    } else {
                        super.refresh();
                    }
                    this.updateClass();
                    break;
                case 'enableValueSorting':
                    this.enableValueSorting = newProp.enableValueSorting;
                    this.updateDataSource();
                    break;
                case 'showGroupingBar':
                    if (this.element.querySelector('.e-grouping-bar')) {
                        this.element.querySelector('.e-grouping-bar').remove();
                    }
                    this.renderPivotGrid();
                    break;
                case 'groupingBarSettings':
                    this.axisFieldModule.render();
                    break;
                case 'showTooltip':
                    this.renderToolTip();
                    break;
                case 'toolbar':
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshToolbar();
                    }
                    break;
                case 'chartTypes':
                    if (this.toolbarModule) {
                        this.toolbarModule.createChartMenu();
                    }
                    break;
                case 'aggregateTypes':
                    if (this.showGroupingBar) {
                        if (this.axisFieldModule) {
                            this.axisFieldModule.render();
                        }
                    }
                    if (this.showFieldList && this.pivotFieldListModule && this.pivotFieldListModule.axisFieldModule) {
                        this.pivotFieldListModule.setProperties({ aggregateTypes: newProp.aggregateTypes }, true);
                        this.pivotFieldListModule.axisFieldModule.render();
                    }
                    break;
            }
        }
    }

    /**
     * Method to parse the template string.          
     */
    public templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    /**
     * Method to get the cell template.
     */
    public getCellTemplate(): Function {
        return this.cellTemplateFn;
    }

    /**
     * @hidden
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        let tempElement: HTMLElement = document.createElement('div');
        tempElement.innerHTML = innerHtml as string;
        if (!isNullOrUndefined(tempElement.firstChild)) {
            node.appendChild(tempElement.firstChild);
        }
        return node;
    }

    /**
     * Render the UI section of PivotView.
     * @returns void
     * @hidden
     */
    public renderPivotGrid(): void {
        if (this.currentView === 'Table') {
            /* tslint:disable-next-line */
            if (this.cellTemplate && isBlazor()) {
                resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
            }
        }
        if (this.chartModule) {
            this.chartModule.engineModule = this.engineModule;
            this.chartModule.loadChart(this, this.chartSettings);
            if (this.enableRtl && this.chart) {
                addClass([this.chart.element], cls.PIVOTCHART_LTR);
            }
        }
        if (this.showFieldList || this.showGroupingBar || this.allowNumberFormatting || this.allowCalculatedField ||
            this.toolbar || this.allowGrouping || this.gridSettings.contextMenuItems) {
            this.notify(events.uiUpdate, this);
            if (this.pivotFieldListModule && this.allowDeferLayoutUpdate) {
                this.pivotFieldListModule.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
            }
        }
        if (this.enableVirtualization) {
            this.virtualscrollModule = new VirtualScroll(this);
        }
        if (this.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        if (this.displayOption.view !== 'Chart') {
            if (this.hyperlinkSettings) {
                this.isRowCellHyperlink = (this.hyperlinkSettings.showRowHeaderHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isColumnCellHyperlink = (this.hyperlinkSettings.showColumnHeaderHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isValueCellHyperlink = (this.hyperlinkSettings.showValueCellHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isSummaryCellHyperlink = (this.hyperlinkSettings.showSummaryCellHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.applyHyperlinkSettings();
            }
            this.renderModule = new Render(this);
            this.renderModule.render();
        } else if (this.grid) {
            remove(this.grid.element);
        }
        if (this.allowConditionalFormatting) {
            this.applyFormatting(this.pivotValues);
        }
        if (this.showToolbar) {
            if (this.displayOption.view === 'Both' && this.chart && this.grid) {
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.refreshUI();
                }
                if (this.toolbarModule && this.toolbarModule.toolbar) {
                    this.toolbarModule.toolbar.width = this.getGridWidthAsNumber() - 2;
                }
                this.chart.element.style.width = formatUnit(this.getGridWidthAsNumber());
                this.chart.width = formatUnit(this.getGridWidthAsNumber());
                if (this.currentView === 'Table') {
                    this.grid.element.style.display = '';
                    this.chart.element.style.display = 'none';
                    if (this.chartSettings.enableMultiAxis && this.chartSettings.enableScrollOnMultiAxis) {
                        (this.element.querySelector('.e-pivotchart') as HTMLElement).style.display = 'none';
                    }
                } else {
                    this.grid.element.style.display = 'none';
                    this.chart.element.style.display = '';
                    if (this.chartSettings.enableMultiAxis && this.chartSettings.enableScrollOnMultiAxis) {
                        (this.element.querySelector('.e-pivotchart') as HTMLElement).style.display = '';
                    }
                }
            }
        }
        if (this.toolbarModule) {
            if (this.showFieldList && this.element.querySelector('#' + this.element.id + '_PivotFieldList')) {
                (this.element.querySelector('#' + this.element.id + '_PivotFieldList') as HTMLElement).style.display = 'none';
            }
            if (this.toolbar && this.toolbar.indexOf('FieldList') !== -1 &&
                this.showToolbar && this.element.querySelector('.e-toggle-field-list')) {
                (this.element.querySelector('.e-toggle-field-list') as HTMLElement).style.display = 'none';
            }
            if (this.toolbarModule && this.toolbarModule.action !== 'New' && this.toolbarModule.action !== 'Load'
                && this.toolbarModule.action !== 'Remove') {
                this.isModified = true;
            }
            if (!this.isInitialRendering) {
                this.isModified = false;
                this.isInitialRendering = !this.isInitialRendering;
            }
            this.toolbarModule.action = '';
        }
    }

    /**
     * @hidden
     */
    public showWaitingPopup(): void {
        if (this.grid && this.grid.element && !this.spinnerTemplate && this.currentView === 'Table') {
            showSpinner(this.grid.element);
        } else {
            showSpinner(this.element);
        }
    }

    /**
     * @hidden
     */
    public hideWaitingPopup(): void {
        if (this.grid && this.grid.element && !this.spinnerTemplate && this.currentView === 'Table') {
            hideSpinner(this.grid.element);
        } else {
            hideSpinner(this.element);
        }
    }

    /* tslint:disable:max-func-body-length */
    /**
     * Updates the PivotEngine using dataSource from Pivot View component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    public updateDataSource(isRefreshGrid?: boolean): void {
        this.showWaitingPopup();
        let pivot: PivotView = this;
        //setTimeout(() => {
        let isSorted: boolean = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        let isFiltered: boolean = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        let isAggChange: boolean = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        let isCalcChange: boolean = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;

        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        pivot.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            if (!(pivot.enableVirtualization && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
            }
            pivot.updatePageSettings(false);
            if (pivot.dataType === 'pivot' && pivot.enableVirtualization && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                /* tslint:disable-next-line:no-any */
                let interopArguments: any = {};
                if (isSorted) {
                    pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                    if (isBlazor()) {
                        let sfBlazor: string = 'sfBlazor';
                        let sortInfo: ISort = {
                            name: pivot.lastSortInfo.name,
                            order: pivot.lastSortInfo.order
                        };
                        /* tslint:disable-next-line */
                        let sortArgs: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.lastSortInfo], pivot.lastSortInfo);
                        interopArguments = { 'key': 'onSort', 'arg': sortArgs };
                    } else {
                        pivot.engineModule.onSort(pivot.lastSortInfo);
                    }
                    pivot.lastSortInfo = {};
                }
                if (isAggChange) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        let sfBlazor: string = 'sfBlazor';
                        let aggregateArgs: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.lastAggregationInfo], pivot.lastAggregationInfo);
                        interopArguments = { 'key': 'onAggregation', 'arg': aggregateArgs };
                        /* tslint:enable */
                    } else {
                        pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                    }
                    pivot.lastAggregationInfo = {};
                }
                if (isCalcChange) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        let dataSourceSettings: any = (window as any)['sfBlazor'].copyWithoutCircularReferences(
                            [(pivot.dataSourceSettings as any).properties], (pivot.dataSourceSettings as any).properties);
                        interopArguments = {
                            'key': 'onCalcOperation',
                            'arg': {
                                lastCalcFieldInfo: pivot.lastCalcFieldInfo,
                                values: dataSourceSettings.values,
                                calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings
                            }
                        };
                        /* tslint:enable */
                    } else {
                        pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                    }
                    pivot.lastCalcFieldInfo = {};
                }
                if (isFiltered) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        let filterArgs: any = (window as any)['sfBlazor'].copyWithoutCircularReferences([pivot.lastFilterInfo], pivot.lastFilterInfo);
                        let filterSettings: any = (window as any)['sfBlazor'].copyWithoutCircularReferences([pivot.dataSourceSettings.filterSettings], pivot.dataSourceSettings.filterSettings);
                        interopArguments = {
                            'key': 'onFilter',
                            'arg': { 'lastFilterInfo': filterArgs, 'filterSettings': filterSettings }
                        };
                        /* tslint:enable */
                    } else {
                        pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings as IDataOptions);
                    }
                    pivot.lastFilterInfo = {};
                }
                if (isBlazor()) {
                    /* tslint:disable */
                    (pivot as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', interopArguments['key'], interopArguments['arg']
                    ).then(
                        (data: any) => {
                            pivot.updateBlazorData(data, pivot);
                            pivot.allowServerDataBinding = false;
                            pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                            delete (pivot as any).bulkChanges.pivotValues;
                            pivot.allowServerDataBinding = true;
                            pivot.enginePopulatedEventMethod('updateDataSource', pivot);
                            if (pivot.calculatedFieldModule && pivot.calculatedFieldModule.isRequireUpdate) {
                                pivot.calculatedFieldModule.endDialog();
                                pivot.calculatedFieldModule.isRequireUpdate = false;
                            }
                        });
                    /* tslint:enable */
                } else {
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (pivot as any).bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                    pivot.enginePopulatedEventMethod('updateDataSource');
                }
            } else {
                if (pivot.dataType === 'olap') {
                    /* tslint:disable:align */
                    let customProperties: IOlapCustomProperties = {
                        mode: '',
                        savedFieldList: pivot.olapEngineModule.fieldList,
                        savedFieldListData: pivot.olapEngineModule.fieldListData,
                        pageSettings: pivot.pageSettings,
                        enableValueSorting: pivot.enableValueSorting,
                        isDrillThrough: (pivot.allowDrillThrough || pivot.editSettings.allowEditing),
                        localeObj: pivot.localeObj
                    };
                    if (isCalcChange || isSorted) {
                        pivot.olapEngineModule.savedFieldList = pivot.olapEngineModule.fieldList;
                        pivot.olapEngineModule.savedFieldListData = pivot.olapEngineModule.fieldListData;
                        if (isCalcChange) {
                            pivot.olapEngineModule.updateCalcFields(pivot.dataSourceSettings as IDataOptions, pivot.lastCalcFieldInfo);
                            pivot.lastCalcFieldInfo = {};
                        } else {
                            pivot.olapEngineModule.onSort(pivot.dataSourceSettings as IDataOptions);
                            pivot.lastSortInfo = {};
                        }
                    } else {
                        pivot.olapEngineModule.renderEngine(pivot.dataSourceSettings as IDataOptions, customProperties);
                    }
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (pivot as any).bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                    pivot.enginePopulatedEventMethod('updateDataSource');
                } else {
                    let customProperties: ICustomProperties = {
                        mode: '',
                        savedFieldList: pivot.engineModule.fieldList,
                        pageSettings: pivot.pageSettings,
                        enableValueSorting: pivot.enableValueSorting,
                        isDrillThrough: (pivot.allowDrillThrough || pivot.editSettings.allowEditing),
                        localeObj: pivot.localeObj,
                        fieldsType: pivot.fieldsType
                    };
                    /* tslint:enable:align */
                    if (isBlazor() && pivot.enableVirtualization) {
                        /* tslint:disable */
                        let sfBlazor: string = 'sfBlazor';
                        let customArgs: any = (window as any)[sfBlazor].copyWithoutCircularReferences([customProperties], customProperties);
                        let datasourceSettings: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                        (pivot as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'renderEngine',
                            { 'dataSourceSettings': datasourceSettings, 'customProperties': customArgs }).then(
                                (data: any) => {
                                    pivot.updateBlazorData(data, pivot);
                                    pivot.allowServerDataBinding = false;
                                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                                    delete (pivot as any).bulkChanges.pivotValues;
                                    pivot.allowServerDataBinding = true;
                                    pivot.enginePopulatedEventMethod('updateDataSource', pivot);
                                });
                        /* tslint:enable */
                    } else {
                        pivot.engineModule.renderEngine(
                            pivot.dataSourceSettings as IDataOptions, customProperties, pivot.getValueCellInfo.bind(pivot));
                        pivot.allowServerDataBinding = false;
                        pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                        /* tslint:disable-next-line:no-any */
                        delete (pivot as any).bulkChanges.pivotValues;
                        pivot.allowServerDataBinding = true;
                        pivot.enginePopulatedEventMethod('updateDataSource');
                    }
                }
            }
        });
        //});
    }

    /**
     * Export Pivot widget data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.  
     * @returns void  
     */
    /* tslint:disable-next-line:no-any */
    public excelExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('Excel');
        } else {
            this.grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }

    /**
     * Export PivotGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.     
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    public csvExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('CSV');
        } else {
            this.grid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }

    /**
     * Export Pivot widget data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.  
     * @returns void        
     */
    public pdfExport(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.pdfExportModule.exportToPDF();
        } else {
            this.grid.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
    }

    /**
     * Export method for the chart.
     * @param type - Defines the export type.
     * @param fileName - Defines file name of export document.
     * @param orientation - Defines the page orientation on pdf export(0 for Portrait mode, 1 for Landscape mode).
     * @param width - Defines width of the export document.
     * @param height - Defines height of the export document.
     */
    public chartExport(type: ExportType, fileName: string, orientation?: PdfPageOrientation, width?: number, height?: number): void {
        if (this.chart && this.chart.enableExport) {
            this.chart.exportModule.export(type, fileName, orientation, null, width, height);
        }
    }

    /**
     * Print method for the chart.
     */
    public printChart(): void {
        if (this.chart) {
            this.chart.print();
        }
    }

    /** @hidden */
    /* tslint:disable:max-func-body-length */
    public onDrill(target: Element, chartDrillInfo?: ChartLabelInfo): void {
        let delimiter: string = (this.dataSourceSettings.drilledMembers[0] && this.dataSourceSettings.drilledMembers[0].delimiter) ?
            this.dataSourceSettings.drilledMembers[0].delimiter : '**';
        let fieldName: string = '';
        let axis: string = '';
        let action: string = '';
        if (chartDrillInfo) {
            fieldName = chartDrillInfo.fieldName;
            axis = chartDrillInfo.cell.axis;
            action = chartDrillInfo.isDrilled ? 'up' : 'down';
        } else {
            fieldName = target.parentElement.getAttribute('fieldname');
            axis = target.parentElement.classList.contains(cls.ROWSHEADER) ? 'row' : 'column';
            action = target.classList.contains(cls.COLLAPSE) ? 'up' : 'down';
        }
        if (this.dataType === 'pivot') {
            let clonedDrillMembers: IDrillOptions[] = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
            let currentCell: IAxisSet = chartDrillInfo ? chartDrillInfo.cell :
                this.engineModule.pivotValues[Number(target.parentElement.getAttribute('index'))]
                [Number(target.parentElement.getAttribute('aria-colindex'))] as IAxisSet;
            let memberName: string =
                (currentCell.valueSort.levelName as string).
                    split(this.engineModule.valueSortSettings.headerDelimiter).join(delimiter);
            let fieldAvail: boolean = false;
            if (this.dataSourceSettings.drilledMembers.length === 0) {
                /* tslint:disable-next-line:max-line-length */
                this.setProperties({ dataSourceSettings: { drilledMembers: [{ name: fieldName, items: [memberName], delimiter: delimiter }] } }, true);
            } else {
                let drillMembers: IDrillOptions[] = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
                for (let fCnt: number = 0; fCnt < drillMembers.length; fCnt++) {
                    let field: DrillOptionsModel = drillMembers[fCnt];
                    memberName = memberName.split(delimiter).join(field.delimiter ? field.delimiter : delimiter);
                    delimiter = field.delimiter = field.delimiter ? field.delimiter : delimiter;
                    if (field.name === fieldName) {
                        fieldAvail = true;
                        let memIndex: number = field.items.indexOf(memberName);
                        if (memIndex > -1) {
                            field.items.splice(memIndex, 1);
                        } else {
                            field.items.push(memberName);
                        }
                    } else {
                        continue;
                    }
                }
                this.setProperties({ dataSourceSettings: { drilledMembers: drillMembers } }, true);
                if (!fieldAvail) {
                    this.dataSourceSettings.drilledMembers.push({ name: fieldName, items: [memberName], delimiter: delimiter });
                }
            }
            this.showWaitingPopup();
            let pivot: PivotView = this;
            //setTimeout(() => {
            let drilledItem: IDrilledItem = {
                fieldName: fieldName, memberName: memberName, delimiter: delimiter,
                axis: axis,
                action: action,
                currentCell: currentCell
            };
            let drillArgs: DrillArgs = {
                drillInfo: drilledItem,
                pivotview: isBlazor() ? undefined : pivot,
                cancel: false
            };
            pivot.trigger(events.drill, drillArgs, (observedArgs: DrillArgs) => {
                if (!observedArgs.cancel) {
                    if (pivot.enableVirtualization) {
                        if (isBlazor()) {
                            /* tslint:disable */
                            let sfBlazor: string = 'sfBlazor';
                            let dataSourceSettings: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                            let drillItem: any = (window as any)[sfBlazor].copyWithoutCircularReferences([drilledItem], drilledItem);
                            let args: any = (window as any)[sfBlazor].copyWithoutCircularReferences([drillArgs], drillArgs);
                            (pivot as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'onDrill',
                                { 'dataSourceSettings': dataSourceSettings, 'drilledItem': drillItem }).then((data: any) => {
                                    pivot.updateBlazorData(data, pivot);
                                    pivot.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                                    pivot.allowServerDataBinding = false;
                                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                                    delete (pivot as any).bulkChanges.pivotValues;
                                    pivot.allowServerDataBinding = true;
                                    pivot.renderPivotGrid();
                                });
                            /* tslint:enable */
                        } else {
                            pivot.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                            pivot.engineModule.onDrill(drilledItem);
                        }
                    } else {
                        pivot.engineModule.generateGridData(pivot.dataSourceSettings as IDataOptions);
                    }
                    if (!(isBlazor() && pivot.enableVirtualization)) {
                        pivot.allowServerDataBinding = false;
                        pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                        /* tslint:disable-next-line:no-any */
                        delete (pivot as any).bulkChanges.pivotValues;
                        pivot.allowServerDataBinding = true;
                        pivot.renderPivotGrid();
                    }
                } else {
                    this.hideWaitingPopup();
                    this.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers } }, true);
                }
            });
        } else {
            this.onOlapDrill(fieldName, axis, action, delimiter, target, chartDrillInfo);
        }
    }
    /* tslint:disable */
    private onOlapDrill(fieldName: string, axis: string, action: string, delimiter: string, target: Element, chartDrillInfo?: ChartLabelInfo): void {
        let pivot: PivotView = this;
        let clonedDrillMembers: IDrillOptions[] = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
        let currentCell: IAxisSet = chartDrillInfo ? chartDrillInfo.cell :
            this.olapEngineModule.pivotValues[Number(target.parentElement.getAttribute('index'))]
            [Number(target.parentElement.getAttribute('aria-colindex'))] as IAxisSet;
        let tupInfo: ITupInfo = axis === 'row' ? this.olapEngineModule.tupRowInfo[currentCell.ordinal] :
            this.olapEngineModule.tupColumnInfo[currentCell.ordinal];
        let drillInfo: IDrilledItem = {
            axis: axis,
            action: action,
            fieldName: fieldName,
            delimiter: '~~',
            memberName: tupInfo.uNameCollection,
            currentCell: currentCell
        };
        this.showWaitingPopup();
        let drillArgs: DrillArgs = {
            drillInfo: drillInfo,
            pivotview: isBlazor() ? undefined : pivot,
            cancel: false
        };
        let fieldPos: number = tupInfo.drillInfo.map((item: IDrillInfo) => { return item.hierarchy; }).indexOf(currentCell.hierarchy.toString());
        if (drillInfo && drillInfo.action === 'down') {
            this.olapEngineModule.drilledSets[currentCell.actualText] = tupInfo.members[fieldPos] as HTMLElement;
            let fields: string[] = drillInfo.memberName.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            });
            let member: string = '';
            for (let pos: number = 0; pos <= fieldPos; pos++) {
                let field: string = fields[pos];
                let members: string[] = field.split('~~');
                member = member + (member !== '' ? '~~' : '') + members[members.length - 1];
            }
            drillInfo.memberName = member;
            let drillItem: IDrillOptions[] = [];
            for (let field of this.dataSourceSettings.drilledMembers) {
                if (field.name === drillInfo.fieldName) {
                    drillItem.push(field);
                }
            }
            if (drillItem.length > 0) {
                if (drillItem[0].delimiter) {
                    member = member.replace(/~~/g, drillItem[0].delimiter);
                }
                let index: number = PivotUtil.inArray(member, drillItem[0].items);
                if (index === -1) {
                    drillItem[0].items.push(member);
                }
            } else {
                let drilledMember: IDrillOptions = { name: drillInfo.fieldName, items: [member], delimiter: '~~' };
                if (!this.dataSourceSettings.drilledMembers) {
                    this.dataSourceSettings.drilledMembers = [drilledMember];
                } else {
                    this.dataSourceSettings.drilledMembers.push(drilledMember);
                }
            }
            drillArgs.drillInfo.memberName = member;
            pivot.trigger(events.drill, drillArgs, (observedArgs: DrillArgs) => {
                if (!observedArgs.cancel) {
                    this.olapEngineModule.updateDrilledInfo(this.dataSourceSettings as IDataOptions);
                    this.allowServerDataBinding = false;
                    this.setProperties({ pivotValues: this.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (this as any).bulkChanges.pivotValues;
                    this.allowServerDataBinding = true;
                    this.renderPivotGrid();
                } else {
                    this.hideWaitingPopup();
                    this.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers } }, true);
                }
            });
        } else {
            delete this.olapEngineModule.drilledSets[currentCell.actualText];
            let drillSets: { [key: string]: string } =
                this.olapEngineModule.getDrilledSets(drillInfo.memberName, currentCell, fieldPos, axis);
            let keys: string[] = Object.keys(drillSets);
            for (let key of keys) {
                let drillSet: string = drillSets[key];
                for (let i: number = 0, cnt: number = this.dataSourceSettings.drilledMembers.length; i < cnt; i++) {
                    let drillItem: IDrillOptions = this.dataSourceSettings.drilledMembers[i];
                    let member: string = drillSet;
                    if (drillItem.delimiter) {
                        member = drillSet.replace(/~~/g, drillItem.delimiter);
                    }
                    let items: string[] = [];
                    for (let itemPos: number = 0; itemPos < drillItem.items.length; itemPos++) {
                        if (drillItem.items[itemPos].indexOf(member) !== 0) {
                            items[items.length] = drillItem.items[itemPos];
                        }
                    }
                    drillItem.items = items;
                }
            }
            let drilledMembers: DrillOptionsModel[] = [];
            for (let fields of this.dataSourceSettings.drilledMembers) {
                if (fields.items.length > 0) {
                    drilledMembers.push(fields);
                }
            }
            pivot.trigger(events.drill, drillArgs, (observedArgs: DrillArgs) => {
                if (!observedArgs.cancel) {
                    this.setProperties({ dataSourceSettings: { drilledMembers: drilledMembers } }, true);
                    this.olapEngineModule.updateDrilledInfo(this.dataSourceSettings as IDataOptions);
                    this.allowServerDataBinding = false;
                    this.setProperties({ pivotValues: this.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (this as any).bulkChanges.pivotValues;
                    this.allowServerDataBinding = true;
                    this.renderPivotGrid();
                } else {
                    this.hideWaitingPopup();
                    this.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers } }, true);
                }
            });
        }
    }
    /* tslint:enable */

    private onContentReady(): void {
        if (this.currentView !== 'Table') {
            /* tslint:disable-next-line */
            if (this.cellTemplate && isBlazor()) {
                resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
            }
        }
        this.isPopupClicked = false;
        if (this.showFieldList) {
            hideSpinner(this.pivotFieldListModule.fieldListSpinnerElement as HTMLElement);
        } else if (this.fieldListSpinnerElement) {
            hideSpinner(this.fieldListSpinnerElement);
        }
        if (!this.isEmptyGrid) {
            this.hideWaitingPopup();
            this.trigger(events.dataBound);
        } else {
            this.isEmptyGrid = false;
            this.notEmpty = true;
        }
        if (this.grid) {
            let engine: PivotEngine | OlapEngine = this.dataType === 'pivot' ? this.engineModule : this.olapEngineModule;
            if (this.enableVirtualization && engine) {
                if (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) &&
                    !this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                    this.virtualDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV }) as HTMLElement;
                    this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).appendChild(this.virtualDiv);
                }
                if (this.element.querySelector('.' + cls.MOVABLEHEADER_DIV) &&
                    !this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                    this.virtualHeaderDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV }) as HTMLElement;
                    this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).appendChild(this.virtualHeaderDiv);
                } else {
                    this.virtualHeaderDiv =
                        this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV) as HTMLElement;
                }
                let movableTable: HTMLElement =
                    this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.e-table') as HTMLElement;
                let vHeight: number = (this.gridSettings.rowHeight * engine.rowCount + 0.1 - movableTable.clientHeight);
                if (vHeight > this.scrollerBrowserLimit) {
                    this.verticalScrollScale = vHeight / this.scrollerBrowserLimit;
                    vHeight = this.scrollerBrowserLimit;
                }
                let vWidth: number = (this.gridSettings.columnWidth * engine.columnCount
                    - ((this.grid.columns[0] as Column).width as number));
                if (vWidth > this.scrollerBrowserLimit) {
                    this.horizontalScrollScale = vWidth / this.scrollerBrowserLimit;
                    vWidth = this.scrollerBrowserLimit;
                }
                setStyleAttribute(this.virtualDiv, {
                    height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                    width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
                });
                setStyleAttribute(this.virtualHeaderDiv, {
                    height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
                });
                let mCnt: HTMLElement = this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
                let fCnt: HTMLElement = this.element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement;
                let mHdr: HTMLElement = this.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
                let verOffset: string = (mCnt.scrollTop > this.scrollerBrowserLimit) ?
                    (mCnt.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[1].trim() :
                    -(((mCnt.scrollTop * this.verticalScrollScale) - this.scrollPosObject.verticalSection - mCnt.scrollTop)) + 'px)';
                let horiOffset: string = (mCnt.scrollLeft > this.scrollerBrowserLimit) ?
                    ((mCnt.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[0].trim() + ',') :
                    'translate(' + -(((mCnt.scrollLeft * this.horizontalScrollScale) -
                        this.scrollPosObject.horizontalSection - mCnt.scrollLeft)) + 'px,';
                setStyleAttribute(fCnt.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + 0 + 'px,' + verOffset
                });
                setStyleAttribute(mCnt.querySelector('.e-table') as HTMLElement, {
                    transform: horiOffset + verOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                    transform: horiOffset + 0 + 'px)'
                });
            }
            if (this.showGroupingBar) {
                this.element.style.minWidth = '400px';
                this.grid.element.style.minWidth = '400px';
            } else {
                this.element.style.minWidth = '310px';
                this.grid.element.style.minWidth = '310px';
            }
        }
        this.unwireEvents();
        this.wireEvents();
        this.isChartLoaded = false;
        if (this.cellTemplate && isBlazor()) {
            let gridCells: string[] = Object.keys(this.gridCellCollection);
            if (gridCells.length > 0) {
                for (let cell of gridCells) {
                    /* tslint:disable-next-line */
                    let templateObject: {
                        fieldName?: string;
                        formattedText?: string;
                        axis?: string;
                        value?: Number;
                        isGrandTotal?: boolean;
                        isDrilled?: boolean;
                        hasChild?: boolean;
                        columnSpan?: number;
                        rowSpan?: number;
                        valueSortInfo?: IDataSet;
                        columnIndex?: number;
                        rowIndex?: number;
                        columnHeaders?: string | number | Date;
                        rowHeaders?: string | number | Date;
                        isTotal?: boolean;
                    } = {};
                    let tCell: HTMLElement = this.gridCellCollection[cell];
                    let colIndex: number = Number(tCell.getAttribute('aria-colindex'));
                    let rowIndex: number = Number(tCell.getAttribute('index'));
                    let pivotCell: IAxisSet = this.pivotValues[rowIndex][colIndex] as IAxisSet;
                    templateObject.axis = pivotCell.axis;
                    if (templateObject.axis === 'column' || templateObject.axis === 'row') {
                        templateObject.fieldName = (pivotCell.valueSort.axis as string);
                        templateObject.formattedText = pivotCell.formattedText;
                    } else {
                        templateObject.fieldName = (pivotCell.actualText as string);
                        templateObject.formattedText = pivotCell.formattedText;
                        templateObject.value = pivotCell.value;
                    }
                    templateObject.rowHeaders = pivotCell.rowHeaders;
                    templateObject.columnHeaders = pivotCell.columnHeaders;
                    templateObject.rowIndex = pivotCell.rowIndex;
                    templateObject.columnIndex = pivotCell.colIndex;
                    templateObject.isGrandTotal = pivotCell.isGrandSum;
                    templateObject.isTotal = pivotCell.isSum;
                    templateObject.rowSpan = pivotCell.rowSpan;
                    templateObject.columnSpan = pivotCell.colSpan;
                    templateObject.isDrilled = pivotCell.isDrilled;
                    templateObject.hasChild = pivotCell.hasChild;
                    templateObject.valueSortInfo = pivotCell.valueSort;
                    /* tslint:disable-next-line */
                    let element: any = this.getCellTemplate()(templateObject, this, 'cellTemplate', this.element.id + '_cellTemplate');
                    if (element && element !== '' && element.length > 0) {
                        if (this.enableHtmlSanitizer) {
                            this.appendHtml(tCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                        } else {
                            this.appendHtml(tCell, element[0].outerHTML);
                        }
                    }
                }
                updateBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate', this);
            }
        }
    }

    private setToolTip(args: TooltipEventArgs): void {
        let colIndex: number = Number(args.target.getAttribute('aria-colindex'));
        let rowIndex: number = Number(args.target.getAttribute('index'));
        let cell: IAxisSet = (this.pivotValues && this.pivotValues[rowIndex] && this.pivotValues[rowIndex][colIndex]) ?
            (this.pivotValues[rowIndex][colIndex] as IAxisSet) : undefined;
        this.tooltip.content = '';
        let aggregateType: string; let caption: string;
        let hasField: boolean = false;
        if (cell && this.dataType === 'olap') {
            if (this.olapEngineModule.fieldList[cell.actualText]) {
                let field: IOlapField = this.olapEngineModule.fieldList[cell.actualText];
                aggregateType = field.isCalculatedField ? field.type : field.aggregateType;
                caption = (this.olapEngineModule.dataFields[cell.actualText] &&
                    this.olapEngineModule.dataFields[cell.actualText].caption) ?
                    this.olapEngineModule.dataFields[cell.actualText].caption : field.caption;
                hasField = true;
            }
        } else {
            if (cell && this.engineModule.fieldList[cell.actualText]) {
                let field: IField = this.engineModule.fieldList[cell.actualText];
                aggregateType = field.aggregateType;
                caption = field.caption;
                hasField = true;
            }
        }
        if (cell && hasField) {
            let rowHeaders: string = this.getRowText(rowIndex, 0);
            let columnHeaders: string = this.getColText(0, colIndex, rowIndex);
            let value: string = ((cell.formattedText === '0' || cell.formattedText === '') ? this.localeObj.getConstant('noValue') :
                cell.formattedText);
            if (this.tooltipTemplate && this.getTooltipTemplate() !== undefined) {
                let rowFields: string = this.getHeaderField(rowIndex, colIndex, 'row');
                let columnFields: string = this.getHeaderField(rowIndex, colIndex, 'column');
                let templateObject: { [key: string]: string } = {
                    rowHeaders: rowHeaders,
                    columnHeaders: columnHeaders,
                    aggregateType: aggregateType,
                    valueField: caption,
                    value: value,
                    rowFields: rowFields,
                    columnFields: columnFields,
                };
                /* tslint:disable-next-line:max-line-length */
                this.tooltip.content = this.getTooltipTemplate()(templateObject, this, 'tooltipTemplate', this.element.id + 'tooltipTemplate')[0].outerHTML;
            } else {
                this.tooltip.content = '<div class=' + cls.PIVOTTOOLTIP + '><p class=' + cls.TOOLTIP_HEADER + '>' +
                    this.localeObj.getConstant('row') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                    rowHeaders + '</p></br><p class=' + cls.TOOLTIP_HEADER + '>' + this.localeObj.getConstant('column') +
                    ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' + columnHeaders + '</p></br>' +
                    (cell.actualText !== '' ? ('<p class=' + cls.TOOLTIP_HEADER + '>' + (this.dataType === 'olap' ? '' :
                        (this.localeObj.getConstant(aggregateType) + ' ' + this.localeObj.getConstant('of') + ' ')) +
                        caption + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' + value + '</p></div>') : '');
            }
        } else {
            args.cancel = true;
        }
    }

    /** @hidden */
    public getTooltipTemplate(): Function {
        return this.tooltipTemplateFn;
    }

    /** @hidden */
    public getHeaderField(rowIndex: number, colIndex: number, axis: string): string {
        let fields: string = '';
        let len: number;
        let engineModule: OlapEngine | PivotEngine = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
        let delimiter: string = engineModule.valueSortSettings.headerDelimiter;
        if (axis === 'row') {
            len = (this.pivotValues[rowIndex][0] as IAxisSet).valueSort.levelName.toString().split(delimiter).length;
            for (let i: number = 0; i < len && engineModule.rows.length > 0 && engineModule.rows[i]; i++) {
                fields += (i ? ' - ' : '') + ((engineModule.rows[i].caption) ? engineModule.rows[i].caption : engineModule.rows[i].name);
            }
        } else {
            /* tslint:disable:max-line-length */
            if (engineModule.columns.length > 0) {
                let pos: number = engineModule.values.length === 0 ? 0 : Number(Object.keys(engineModule.headerContent)[Object.keys(engineModule.headerContent).length - 1]);
                len = (this.pivotValues[pos][colIndex] as IAxisSet).valueSort.levelName.toString().split(delimiter).length;
                len = engineModule.values.length > 1 ? len - 1 : len;
            }
            for (let j: number = 0; j < len && engineModule.columns.length > 0 && engineModule.columns[j]; j++) {
                fields += (j ? ' - ' : '') + ((engineModule.columns[j].caption) ? engineModule.columns[j].caption : engineModule.columns[j].name);
            }
            /* tslint:enable:max-line-length */
        }
        return fields;
    }
    private getRowText(rowIndex: number, colIndex: number): string {
        let cell: IAxisSet = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
        let level: number = cell.level;
        let rowText: string = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (level > 0 || cell.index === undefined) {
            rowIndex--;
            cell = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
            if (cell.index !== undefined) {
                if (level > cell.level) {
                    rowText = rowText + ' - ' + cell.formattedText;
                    level = level - 1;
                }
            }
        }
        return rowText.split(' - ').reverse().join(' - ');
    }

    private getColText(rowIndex: number, colIndex: number, limit: number): string {
        let cell: IAxisSet = (this.pivotValues[0][colIndex] as IAxisSet);
        let axis: string = cell.axis;
        let colText: string = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (axis !== 'value' && limit > rowIndex) {
            rowIndex++;
            if (this.pivotValues[rowIndex]) {
                cell = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
                axis = cell.axis;
                if (cell.type !== 'sum' && cell.type !== 'grand sum' && axis !== 'value') {
                    colText = colText + ' - ' + cell.formattedText;
                }
            }
        }
        return colText;
    }

    private updateClass(): void {
        if (this.enableRtl) {
            addClass([this.element], cls.RTL);
        } else {
            removeClass([this.element], cls.RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], cls.DEVICE);
        } else {
            removeClass([this.element], cls.DEVICE);
        }
    }

    private mouseRclickHandler(e: MouseEvent): void {
        if (e.which === 3) {
            this.lastCellClicked = (e.target as Element);
        } else if (e.which === 0) {
            this.lastCellClicked = (e.target as Element);
        }
        this.lastCellClicked = (e.target as Element);
    }

    private mouseDownHandler(e: MouseEvent): void {
        if (e.which === 3) {
            this.lastCellClicked = (e.target as Element);
        }
        if (this.isCellBoxMultiSelection) {
            this.isMouseDown = true;
            this.isMouseUp = false;
            let parent: HTMLElement = this.parentAt(e.target as HTMLElement, 'TH');
            this.clearSelection(parent, e, Number(parent.getAttribute('aria-colindex')), Number(parent.getAttribute('index')));
            this.lastSelectedElement = undefined;
        }
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.isCellBoxMultiSelection) {
            e.preventDefault();
            if (this.isMouseDown && e.target) {
                let ele: HTMLElement = e.target as HTMLElement;
                let parentElement: HTMLElement = this.parentAt(ele, 'TH');
                if (this.lastSelectedElement && this.lastSelectedElement !== parentElement &&
                    parentElement.classList.contains(cls.SELECTED_BGCOLOR)) {
                    this.lastSelectedElement.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                    this.lastSelectedElement.classList.remove(cls.SELECTED_BGCOLOR);
                    this.lastSelectedElement = parentElement;
                } else {
                    this.lastSelectedElement = parentElement;
                    parentElement.classList.add(cls.CELL_ACTIVE_BGCOLOR);
                    parentElement.classList.add(cls.SELECTED_BGCOLOR);
                }
                this.renderModule.selected();
            }
        }
    }

    private mouseUpHandler(e: MouseEvent): void {
        if (this.isCellBoxMultiSelection) {
            this.isMouseDown = false;
            this.isMouseUp = true;
        }
    }

    private parentAt(target: HTMLElement, tagName: string): HTMLElement {
        while (target.tagName !== tagName) {
            if (target.parentElement) {
                target = target.parentElement;
            } else {
                break;
            }
        }
        return target;
    }

    private mouseClickHandler(e: MouseEvent): void {
        if (e.which === 3) {
            this.lastCellClicked = (e.target as Element);
        } else if (e.which === 0) {
            this.lastCellClicked = (e.target as Element);
        }
        let target: Element = (e.target as Element);
        if ((target.classList.contains('e-headercell') ||
            target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-rowsheader') ||
            target.classList.contains('e-rowcell') ||
            target.classList.contains('e-stackedheadercelldiv') ||
            target.classList.contains('e-headertext') ||
            target.classList.contains('e-ascending') ||
            target.classList.contains('e-descending')) && this.enableValueSorting && this.dataType === 'pivot') {
            let ele: Element = null;
            if (target.classList.contains('e-headercell') || target.classList.contains('e-rowsheader')
                || target.classList.contains('e-rowcell')) {
                ele = target;
            } else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-headercelldiv') ||
                target.classList.contains('e-ascending') || target.classList.contains('e-descending')) {
                ele = target.parentElement;
            } else if (target.classList.contains('e-headertext')) {
                ele = target.parentElement.parentElement;
            }
            this.CellClicked(target, e);
            if ((ele.parentElement.parentElement.parentElement.parentElement.classList.contains('e-movableheader')
                && this.dataSourceSettings.valueAxis === 'column') || (ele.parentElement.classList.contains('e-row') &&
                    this.dataSourceSettings.valueAxis === 'row') && (ele.classList.contains('e-rowsheader') ||
                        ele.classList.contains('e-stot'))) {
                /* tslint:disable */
                let colIndex: number = Number(ele.getAttribute('aria-colindex'));
                let rowIndex: number = Number(ele.getAttribute('index'));
                if (this.dataSourceSettings.valueAxis === 'row' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                    rowIndex = (this.pivotValues[rowIndex][colIndex] as IAxisSet).type === 'value' ? rowIndex : (rowIndex + 1);
                } else if (this.dataSourceSettings.valueAxis === 'column' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                    colIndex = (Number(ele.getAttribute('aria-colindex')) + Number(ele.getAttribute('aria-colspan')) - 1);
                    rowIndex = this.engineModule.headerContent.length - 1;
                }
                this.setProperties({
                    dataSourceSettings: {
                        valueSortSettings: {
                            columnIndex: (Number(ele.getAttribute('aria-colindex')) +
                                Number(ele.getAttribute('aria-colspan')) - 1),
                            sortOrder: this.dataSourceSettings.valueSortSettings.sortOrder === 'Descending' ? 'Ascending' : 'Descending',
                            headerText: (this.pivotValues[rowIndex][colIndex] as IAxisSet).valueSort.levelName,
                            headerDelimiter: this.dataSourceSettings.valueSortSettings.headerDelimiter ?
                                this.dataSourceSettings.valueSortSettings.headerDelimiter : '.'
                        }
                    }
                }, true);
                /* tslint:enable */
                this.showWaitingPopup();
                let pivot: PivotView = this;
                //setTimeout(() => {
                pivot.engineModule.enableValueSorting = true;
                if (pivot.enableVirtualization) {
                    if (pivot.dataSourceSettings.enableSorting) {
                        for (let key of Object.keys(pivot.engineModule.fieldList)) {
                            pivot.engineModule.fieldList[key].sort = 'Ascending';
                        }
                        pivot.setProperties({ dataSourceSettings: { sortSettings: [] } }, true);
                    }
                    if (isBlazor()) {
                        /* tslint:disable */
                        (pivot as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'applyValueSorting',
                            { 'valueSortSettings': (pivot.dataSourceSettings.valueSortSettings as any).properties }).then(
                                (data: any) => {
                                    pivot.updateBlazorData(data, pivot);
                                    pivot.allowServerDataBinding = false;
                                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                                    delete (pivot as any).bulkChanges.pivotValues;
                                    pivot.allowServerDataBinding = true;
                                    pivot.renderPivotGrid();
                                });
                        /* tslint:enable */
                    } else {
                        pivot.engineModule.rMembers = pivot.engineModule.headerCollection.rowHeaders;
                        pivot.engineModule.cMembers = pivot.engineModule.headerCollection.columnHeaders;
                        pivot.engineModule.applyValueSorting();
                        pivot.engineModule.updateEngine();
                    }
                } else {
                    pivot.engineModule.generateGridData(pivot.dataSourceSettings as IDataOptions);
                }
                if (!(isBlazor() && pivot.enableVirtualization)) {
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (pivot as any).bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                    pivot.renderPivotGrid();
                }
            }
        } else if (target.classList.contains(cls.COLLAPSE) || target.classList.contains(cls.EXPAND)) {
            this.onDrill(target);
        } else {
            this.CellClicked(target, e);
            return;
        }
    }

    private framePivotColumns(gridcolumns: ColumnModel[]): void {
        for (let column of gridcolumns) {
            if (column.columns && column.columns.length > 0) {
                this.framePivotColumns(column.columns as ColumnModel[]);
            } else {
                /* tslint:disable */
                let levelName: string = column.field === '0.formattedText' ? '' :
                    (column.customAttributes ? (column.customAttributes as any).cell.valueSort.levelName : '');
                let width: number = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                    levelName, Number(column.width === 'auto' ? column.minWidth : column.width));
                this.pivotColumns.push({
                    allowReordering: column.allowReordering,
                    allowResizing: column.allowResizing,
                    headerText: levelName,
                    width: width
                });
                this.totColWidth = this.totColWidth + Number(width);
                /* tslint:enable */
            }
        }
    }

    /** @hidden */
    public setGridColumns(gridcolumns: ColumnModel[]): void {
        if (!isNullOrUndefined(this.totColWidth) && this.totColWidth > 0) {
            for (let column of gridcolumns) {
                if (column.columns && column.columns.length > 0) {
                    this.setGridColumns(column.columns as ColumnModel[]);
                } else {
                    /* tslint:disable */
                    let levelName: string = column.field === '0.formattedText' ? '' :
                        (column.customAttributes ? (column.customAttributes as any).cell.valueSort.levelName : '');
                    column.allowReordering = this.pivotColumns[this.posCount].allowReordering;
                    column.allowResizing = this.pivotColumns[this.posCount].allowResizing;
                    let calcWidth = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                        levelName, Number(this.pivotColumns[this.posCount].width));
                    if (column.width !== 'auto') {
                        column.width = calcWidth;
                    } else {
                        column.minWidth = calcWidth;
                    }
                    this.posCount++;
                    if (column.allowReordering) {
                        this.gridSettings.allowReordering = true;
                    }
                    if (column.allowResizing) {
                        this.gridSettings.allowResizing = true;
                    }
                }
            }
            if (this.gridSettings.allowReordering) {
                Grid.Inject(Reorder);
            }
            if (this.gridSettings.allowResizing) {
                Grid.Inject(Resize);
            }
            /* tslint:enable */
        }
    }

    /** @hidden */
    public fillGridColumns(gridcolumns: ColumnModel[]): void {
        for (let column of gridcolumns) {
            column.allowReordering = this.gridSettings.allowReordering;
            column.allowResizing = this.gridSettings.allowResizing;
            this.posCount++;
            if (column.columns && column.columns.length > 0) {
                this.fillGridColumns(column.columns as ColumnModel[]);
            }
        }
    }

    /** @hidden */
    public triggerColumnRenderEvent(gridcolumns: ColumnModel[]): void {
        this.pivotColumns = [];
        this.totColWidth = 0;
        this.framePivotColumns(gridcolumns);
        let firstColWidth: number | string = this.pivotColumns[0].width;
        let eventArgs: ColumnRenderEventArgs = {
            columns: this.pivotColumns,
            dataSourceSettings: this.dataSourceSettings as IDataOptions
        };
        this.trigger(events.beforeColumnsRender, eventArgs);
        if (firstColWidth !== this.pivotColumns[0].width) {
            this.firstColWidth = this.pivotColumns[0].width;
            this.renderModule.resColWidth = parseInt(this.firstColWidth.toString());
            let colWidth: number = this.renderModule.calculateColWidth(this.pivotColumns ? this.pivotColumns.length : 0);
            for (let i: number = 1; i < this.pivotColumns.length; i++) {
                this.pivotColumns[i].width = colWidth;
            }
        }
        this.posCount = 0;
        this.setGridColumns(gridcolumns);
    }

    /** @hidden */
    public setCommonColumnsWidth(columns: ColumnModel[], width: number): void {
        for (let column of columns) {
            if (column.field !== '0.formattedText') {
                if (column.columns) {
                    this.setCommonColumnsWidth(column.columns as ColumnModel[], width);
                } else {
                    if (column.width !== 'auto') {
                        column.width = width;
                    } else {
                        column.minWidth = width;
                    }
                }
            } else {
                column.width = !this.firstColWidth ? column.width : this.firstColWidth;
            }
        }
    }

    /** @hidden */
    public getHeightAsNumber(): number {
        let height: number;
        if (isNaN(this.height as number)) {
            if (this.height.toString().indexOf('%') > -1) {
                height = (parseFloat(this.height.toString()) / 100) * this.element.offsetHeight;
            } else if (this.height.toString().indexOf('px') > -1) {
                height = Number(this.height.toString().split('px')[0]);
            }
        } else {
            height = Number(this.height);
        }
        if (height < 300) {
            height = 300;
        }
        return height;
    }

    /** @hidden */
    public getWidthAsNumber(): number {
        let width: number;
        if (isNaN(this.width as number)) {
            if (this.width.toString().indexOf('%') > -1) {
                width = (parseFloat(this.width.toString()) / 100) * this.element.offsetWidth;
            } else if (this.width.toString().indexOf('px') > -1) {
                width = Number(this.width.toString().split('px')[0]);
            }
            if (isNaN(width)) {
                width = this.element.offsetWidth;
            }
        } else {
            width = Number(this.width);
        }
        if (width < 400) {
            width = 400;
        }
        return width;
    }

    /** @hidden */
    public getGridWidthAsNumber(): number {
        let width: number;
        let offsetWidth: number = this.element.offsetWidth ? this.element.offsetWidth :
            this.element.getBoundingClientRect().width;
        if (isNaN(this.grid.width as number)) {
            if (this.grid.width.toString().indexOf('%') > -1) {
                width = (parseFloat(this.grid.width.toString()) / 100) * offsetWidth;
            } else if (this.grid.width.toString().indexOf('px') > -1) {
                width = Number(this.grid.width.toString().split('px')[0]);
            }
            if (isNaN(width)) {
                width = offsetWidth;
            }
        } else {
            width = Number(this.grid.width);
        }
        return width;
    }

    /** @hidden */
    public onWindowResize(): void {
        /* tslint:disable */
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.layoutRefresh.bind(this), 500);
        /* tslint:enable */
    }

    /**
     * Refreshes the Pivot Table for blazor layoutRefresh is called for other base refresh is called
     */
    public refresh(): void {
        if (isBlazor()) {
            this.layoutRefresh();
        } else {
            this.pivotRefresh();
        }
    }

    /** @hidden */
    public layoutRefresh(): void {
        if (this.element && this.element.classList.contains('e-pivotview') &&
            (this.dataType === 'olap' ? (this.olapEngineModule && this.olapEngineModule.pivotValues) :
                this.engineModule && this.engineModule.pivotValues)) {
            if (this.grid) {
                let colLength: number = (this.dataType === 'olap' && this.olapEngineModule.pivotValues.length > 0) ?
                    this.olapEngineModule.pivotValues[0].length : (this.dataSourceSettings.values.length > 0 &&
                        this.engineModule.pivotValues.length > 0 ? this.engineModule.pivotValues[0].length : 2);
                let colWidth: number = this.renderModule.resizeColWidth(colLength);
                this.grid.width = this.renderModule.calculateGridWidth();
                this.renderModule.calculateGridHeight(true);
                this.setCommonColumnsWidth(this.grid.columns as ColumnModel[], colWidth);
                this.posCount = 0;
                if (!this.showGroupingBar) {
                    this.setGridColumns(this.grid.columns as ColumnModel[]);
                }
                if (this.currentView === 'Table') {
                    /* tslint:disable-next-line */
                    if (this.cellTemplate && isBlazor()) {
                        resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
                    }
                }
                this.grid.refreshColumns();
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.setGridRowWidth();
                }
            }
            if (this.showToolbar && this.toolbarModule && this.toolbarModule.toolbar) {
                this.toolbarModule.toolbar.width = this.grid ? (this.getGridWidthAsNumber() - 2) : (this.getWidthAsNumber() - 2);
            }
            if (this.chart && ((this.showToolbar && this.currentView === 'Chart') || !this.showToolbar)) {
                this.chart.width = (this.showToolbar && this.grid) ? this.getGridWidthAsNumber().toString() :
                    this.getWidthAsNumber().toString();
                if (this.displayOption.view === 'Chart' && this.showGroupingBar && this.groupingBarModule &&
                    this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.refreshUI();
                }
            }
        }
    }

    private CellClicked(target: Element, e: MouseEvent): void {
        let ele: Element = null;
        if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        } else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        } else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        } else if (target.classList.contains(cls.ROW_SELECT)) {
            if (target.classList.contains(cls.SPAN_CLICKED)) {
                this.isPopupClicked = false;
            } else {
                this.isPopupClicked = true;
            }
        }
        /* tslint:disable */
        if (ele) {
            let colIndex: number = Number(ele.getAttribute('aria-colindex'));
            let rowIndex: number = Number(ele.getAttribute('index'));
            let colSpan: number = Number(ele.getAttribute('aria-colspan'));
            // let selectArgs: PivotCellSelectedEventArgs = { isCellClick: true, currentCell: target };
            let selectArgs: PivotCellSelectedEventArgs = {
                cancel: false,
                isCellClick: true,
                currentCell: ele,
                data: this.pivotValues[rowIndex][colIndex] as IAxisSet
            };
            this.trigger(events.cellSelecting, selectArgs, (observedArgs: PivotCellSelectedEventArgs) => {
                if (this.gridSettings.allowSelection) {
                    if (this.gridSettings.selectionSettings.mode === 'Both' ? !ele.classList.contains(cls.ROW_CELL_CLASS) :
                        this.gridSettings.selectionSettings.mode !== 'Row') {
                        this.clearSelection(ele, e, colIndex, rowIndex);
                        if (!observedArgs.cancel) {
                            this.applyColumnSelection(e, ele, colIndex, colIndex + (colSpan > 0 ? (colSpan - 1) : 0), rowIndex);
                        }
                    }
                    else {
                        this.clearSelection(ele, e, colIndex, rowIndex)
                    }
                    if (this.gridSettings.selectionSettings.mode !== 'Column' && !ele.classList.contains(cls.COLUMNSHEADER)) {
                        this.rowDeselect(ele, e, rowIndex, this.gridSettings.selectionSettings.mode, observedArgs);
                    }
                    if (this.gridSettings.selectionSettings.mode !== 'Column' && !observedArgs.cancel) {
                        if (this.gridSettings.selectionSettings.type === "Multiple" ? (!e.ctrlKey && !e.shiftKey) : true && this.selectedRowIndex !== rowIndex) {
                            this.selectedRowIndex = rowIndex;
                            this.grid.selectionModule.selectRow(rowIndex - this.renderModule.rowStartPos)
                        }
                        else {
                            this.selectedRowIndex = undefined;
                        }
                    }
                }
                if (this.cellClick && observedArgs.isCellClick) {
                    this.trigger(events.cellClick, {
                        currentCell: ele,
                        data: this.pivotValues[rowIndex][colIndex],
                        nativeEvent: e
                    });
                }
                this.getSelectedCellsPos();
            });
        }
    }

    private rowDeselect(ele: Element, e: MouseEvent | KeyboardEventArgs, rowIndex: number, mode: string, observedArgs: PivotCellSelectedEventArgs): void {
        if (!e.shiftKey && !e.ctrlKey && this.gridSettings.selectionSettings.mode !== 'Both' || this.gridSettings.selectionSettings.type === 'Single') {
            if (!ele.classList.contains(cls.CELL_SELECTED_BGCOLOR) && !ele.classList.contains(cls.SELECTED_BGCOLOR) && !ele.classList.contains(cls.CELL_ACTIVE_BGCOLOR)) {
                if (!observedArgs.cancel) {
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                    removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
                } else {
                    this.setSavedSelectedCells();
                }
            } else {
                removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
                removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
                if (!observedArgs.cancel) {
                    if ((mode === 'Cell')) {
                        addClass([ele], [cls.CELL_SELECTED_BGCOLOR]);
                    } else if (mode === 'Row' || this.gridSettings.selectionSettings.type === 'Single') {
                        let query: string = '[index="' + rowIndex + '"]';
                        addClass(this.element.querySelectorAll(query), [cls.SELECTED_BGCOLOR, cls.CELL_ACTIVE_BGCOLOR]);
                        if (mode !== 'Row') {
                            ele.classList.add(cls.CELL_SELECTED_BGCOLOR);
                        }
                    }
                } else { this.setSavedSelectedCells(); }
            }
        } else if (((e.shiftKey || e.ctrlKey) || this.gridSettings.selectionSettings.mode == 'Both') && (observedArgs.cancel)) {
            removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
            removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
            removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
            this.setSavedSelectedCells();
        }
    }
    /** @hidden */
    public clearSelection(ele: Element, e: MouseEvent | KeyboardEventArgs, colIndex: number, rowIndex: number) {
        if ((!e.shiftKey && !e.ctrlKey) || this.gridSettings.selectionSettings.type === 'Single') {
            if (this.gridSettings.selectionSettings.mode === 'Cell') {
                if (ele.classList.contains(cls.COLUMNSHEADER)) {
                    removeClass(this.element.querySelectorAll(('.' + cls.ROW_CELL_CLASS + '.') + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                } else {
                    removeClass(this.element.querySelectorAll(('.' + cls.COLUMNSHEADER + '.') + cls.CELL_ACTIVE_BGCOLOR), [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                }
            } else if (this.gridSettings.selectionSettings.mode === 'Both') {
                if (ele.classList.contains(cls.ROW_CELL_CLASS)) {
                    for (let ele of [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR + ', .' + cls.CELL_SELECTED_BGCOLOR))) {
                        // if (Number((ele as HTMLElement).getAttribute('index')) !== rowIndex) {
                        removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR, cls.CELL_SELECTED_BGCOLOR]);
                        // }
                    }
                } else {
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                }
            }
        }
    }

    /** @hidden */
    public applyRowSelection(colIndex: number, rowIndex: number, e: MouseEvent | KeyboardEvent): void {
        let pivotValue: IAxisSet = this.engineModule.pivotValues[rowIndex][colIndex] as IAxisSet;
        if (!e.ctrlKey && !e.shiftKey && pivotValue && this.selectedRowIndex !== rowIndex) {
            this.selectedRowIndex = rowIndex;
            let parentLevel: number = pivotValue.level;
            let rCount: number = rowIndex;
            do {
                rCount++;
                pivotValue = this.engineModule.pivotValues[rCount][colIndex] as IAxisSet;
            } while (pivotValue && parentLevel < pivotValue.level);
            let _this: PivotView = this;
            if (this.isAdaptive) {
                this.rowRangeSelection = {
                    enable: true,
                    startIndex: rowIndex - _this.renderModule.rowStartPos,
                    endIndex: rCount - (1 + _this.renderModule.rowStartPos)
                };
            } else {
                _this.grid.selectionModule.selectRowsByRange(rowIndex -
                    _this.renderModule.rowStartPos, rCount - (1 + _this.renderModule.rowStartPos));
            }
        } else {
            this.selectedRowIndex = undefined;
        }
    }

    /** @hidden */
    public applyColumnSelection(e: MouseEvent | KeyboardEventArgs, target: Element, colStart: number, colEnd: number, rowStart: number): void {
        if (!target.classList.contains(cls.ROWSHEADER) &&
            (this.gridSettings.selectionSettings.mode === 'Cell' ? target.classList.contains(cls.COLUMNSHEADER) : true)) {
            let isCtrl: boolean = e.ctrlKey;
            if (this.isAdaptive && this.gridSettings.selectionSettings.type === 'Multiple') {
                (this.grid.selectionModule as any).showPopup(e);
                if (this.isPopupClicked) {
                    this.element.querySelector('.' + cls.ROW_SELECT).classList.add(cls.SPAN_CLICKED);
                    isCtrl = true;
                } else {
                    this.element.querySelector('.' + cls.ROW_SELECT).classList.remove(cls.SPAN_CLICKED);
                    isCtrl = false;
                }
            }
            let queryStringArray: string[] = [];
            let type: SelectionType = this.gridSettings.selectionSettings.type;
            let isToggle: boolean = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
            let activeColumns: string[] = [];
            let actColPos: { [Key: number]: number } = {};
            for (let cCnt = colStart; cCnt <= colEnd; cCnt++) {
                activeColumns.push(cCnt.toString());
            }
            if (!isCtrl || type === 'Single') {
                for (let ele of [].slice.call(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR))) {
                    removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                    if (activeColumns.indexOf(ele.getAttribute('aria-colindex')) === -1) {
                        isToggle = false;
                    }
                    let colIndex: number = Number(ele.getAttribute('aria-colindex'));
                    actColPos[colIndex] = colIndex;
                }
                activeColumns = Object.keys(actColPos).length > 0 ? Object.keys(actColPos).sort(function (a: any, b: any) {
                    return a - b;
                }) : activeColumns;
            } else {
                isToggle = false;
            }
            if (type === 'Multiple' && e.shiftKey) {
                this.shiftLockedPos = this.shiftLockedPos.length === 0 ? activeColumns : this.shiftLockedPos;
                if (Number(this.shiftLockedPos[0]) <= colStart) {
                    colStart = Number(this.shiftLockedPos[0]);
                } else {
                    colEnd = colEnd < Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) ?
                        Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) : colEnd;
                }
            } else {
                this.shiftLockedPos = [];
            }
            let rowSelectedList: string[] = [];
            if (e.ctrlKey && this.gridSettings.selectionSettings.mode === 'Both' && type === 'Multiple' && !target.classList.contains(cls.ROWSHEADER)) {
                for (let ele of [].slice.call(this.element.querySelectorAll('.' + cls.ROWSHEADER + '.' + cls.CELL_SELECTED_BGCOLOR))) {
                    rowSelectedList.push(ele.getAttribute('index'));
                }
            }
            let count: number = colStart;
            while (count <= colEnd) {
                queryStringArray.push('[aria-colindex="' + count + '"]' + (this.gridSettings.selectionSettings.mode === 'Cell' ?
                    '[index="' + rowStart + '"]' : "") + '');
                count++;
            }
            if (!isToggle) {
                rowStart = target.classList.contains('e-headercell') ? rowStart : (this.renderModule.rowStartPos - 1);
                let isTargetSelected: boolean = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
                for (let ele of [].slice.call(this.element.querySelectorAll(queryStringArray.toString()))) {
                    if (Number(ele.getAttribute('index')) >= rowStart) {
                        if (isTargetSelected && isCtrl && (rowSelectedList.indexOf(ele.getAttribute('index')) === -1)) {
                            removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        } else {
                            addClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        }
                    }
                }
            }
            this.renderModule.selected();
        }
    }

    private getSelectedCellsPos(): void {
        let control: PivotView = this;
        control.savedSelectedCellsPos = [];
        control.cellSelectionPos = [];
        for (let ele of [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR))) {
            control.savedSelectedCellsPos.push({ rowIndex: ele.getAttribute('index'), colIndex: ele.getAttribute('aria-colindex') });
        }
        for (let ele of [].slice.call(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR))) {
            control.cellSelectionPos.push({ rowIndex: ele.getAttribute('index'), colIndex: ele.getAttribute('aria-colindex') });
        }
    }

    private setSavedSelectedCells(): void {
        let control: PivotView = this;
        for (let item of [].slice.call(this.savedSelectedCellsPos)) {
            let query: string = '[aria-colindex="' + item.colIndex + '"][index="' + item.rowIndex + '"]';
            addClass([control.element.querySelector(query)], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
        }
        for (let item of [].slice.call(this.cellSelectionPos)) {
            let query: string = '[aria-colindex="' + item.colIndex + '"][index="' + item.rowIndex + '"]';
            addClass([control.element.querySelector(query)], [cls.CELL_SELECTED_BGCOLOR]);
        }
    }
    /* tslint:enable */

    private renderEmptyGrid(): void {
        this.isEmptyGrid = true;
        this.notEmpty = false;
        this.renderModule = new Render(this);
        if (this.grid && this.grid.element && this.element.querySelector('.e-grid')) {
            /* tslint:disable */
            this.notEmpty = true;
            this.grid.setProperties({
                columns: this.renderModule.frameEmptyColumns(),
                dataSource: this.renderModule.frameEmptyData()
            }, true);
            /* tslint:enable */
            this.grid.notify('datasource-modified', {});
            this.grid.refreshColumns();
        } else {
            if (this.element.querySelector('.' + cls.GRID_CLASS)) {
                remove(this.element.querySelector('.' + cls.GRID_CLASS));
            }
            this.renderModule.bindGrid(this, true);
            /* tslint:disable:no-empty */
            this.grid.showSpinner = () => { };
            this.grid.hideSpinner = () => { };
            /* tslint:enable:no-empty */
            this.element.appendChild(createElement('div', { id: this.element.id + '_grid' }));
            this.grid.isStringTemplate = true;
            this.grid.appendTo('#' + this.element.id + '_grid');
            /* tslint:disable-next-line:no-any */
            this.grid.off('data-ready', (this.grid as any).dataReady);
            this.grid.on('data-ready', () => {
                this.grid.scrollModule.setWidth();
                this.grid.scrollModule.setHeight();
                (this.grid.element.querySelector('.e-movablecontent') as HTMLElement).style.overflowY = 'auto';
            });
        }
    }
    /* tslint:disable */
    private initEngine(): void {
        if (this.dataType === 'pivot') {
            let data: any = !isNullOrUndefined(this.dataSourceSettings.dataSource) ? (this.dataSourceSettings.dataSource as IDataSet[])[0] :
                !isNullOrUndefined(this.engineModule.data) ? (this.engineModule.data as IDataSet[])[0] : undefined;
            if (data && this.pivotCommon) {
                let isArray: boolean = Object.prototype.toString.call(data) == '[object Array]';
                if (isArray && this.dataSourceSettings.type === 'JSON') {
                    this.pivotCommon.errorDialog.createErrorDialog(
                        this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidJSON'));
                    return;
                } else if (!isArray && this.dataSourceSettings.type === 'CSV') {
                    this.pivotCommon.errorDialog.createErrorDialog(
                        this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidCSV'));
                    return;
                }
            }
        }
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        this.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            this.updatePageSettings(false);
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: this.pageSettings,
                enableValueSorting: this.enableValueSorting,
                isDrillThrough: (this.allowDrillThrough || this.editSettings.allowEditing),
                localeObj: this.localeObj,
                fieldsType: this.fieldsType
            };
            if (this.dataType === 'pivot') {
                if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0) {
                    let dataSet: IDataSet[] = this.engineModule.data as IDataSet[];
                    this.clonedDataSet = (this.clonedDataSet ? this.clonedDataSet : PivotUtil.getClonedData(dataSet)) as IDataSet[];
                    if (isBlazor()) {
                        this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as DataSourceSettings;
                    } else {
                        this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                        this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as DataSourceSettings;
                        this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
                    }

                }
                if (isBlazor() && this.enableVirtualization) {
                    let pivot: PivotView = this;
                    let sfBlazor: string = 'sfBlazor';
                    let customArgs: any = (window as any)[sfBlazor].copyWithoutCircularReferences([customProperties], customProperties);
                    let datasourceSettings: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                    (pivot as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'renderEngine',
                        { 'dataSourceSettings': datasourceSettings, 'customProperties': customArgs }).then(
                            (data: any) => {
                                if (data === 0) {
                                    this.pivotCommon.errorDialog.createErrorDialog(
                                        this.localeObj.getConstant('error'), (pivot.dataSourceSettings.type === 'CSV' ?
                                            this.localeObj.getConstant('invalidCSV') : this.localeObj.getConstant('invalidJSON')));
                                    return;
                                } else {
                                    pivot.updateBlazorData(data, pivot);
                                    PivotUtil.setPivotProperties(pivot, { pivotValues: pivot.engineModule.pivotValues });
                                    pivot.enginePopulatedEventMethod('initEngine', pivot);
                                }
                            });
                } else {
                    this.engineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties, this.getValueCellInfo.bind(this));
                    this.allowServerDataBinding = false;
                    this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (this as any).bulkChanges.pivotValues;
                    this.allowServerDataBinding = true;
                    this.enginePopulatedEventMethod('initEngine');
                }
            } else if (this.dataSourceSettings.providerType === 'SSAS' && this.dataType === 'olap') {
                customProperties.savedFieldList = this.olapEngineModule.fieldList;
                (customProperties as IOlapCustomProperties).savedFieldListData = this.olapEngineModule.fieldListData;
                this.olapEngineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties);
                this.allowServerDataBinding = false;
                this.setProperties({ pivotValues: this.olapEngineModule.pivotValues }, true);
                /* tslint:disable-next-line:no-any */
                delete (this as any).bulkChanges.pivotValues;
                this.allowServerDataBinding = true;
                this.enginePopulatedEventMethod('initEngine');
            }
        });
    }

    private enginePopulatedEventMethod(action: string, control?: PivotView): void {
        if (action === 'initEngine') {
            const this$: PivotView = control ? control : this;
            this.trigger(events.enginePopulated, { pivotValues: this.pivotValues }, (observedArgs: EnginePopulatedEventArgs) => {
                if (this$.dataType === 'olap') {
                    this$.olapEngineModule.pivotValues = isBlazor() ? this.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    this$.pivotValues = this$.olapEngineModule.pivotValues;
                } else {
                    this$.engineModule.pivotValues = isBlazor() ? this.engineModule.pivotValues : observedArgs.pivotValues;
                    this$.pivotValues = this$.engineModule.pivotValues;
                }
                this$.notify(events.dataReady, {});
                this$.notEmpty = true;
            });
        } else {
            let pivot: PivotView = control ? control : this;
            let eventArgs: EnginePopulatedEventArgs = {
                dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
                pivotValues: isBlazor() ? pivot.dataType === 'olap' ? pivot.olapEngineModule.pivotValues :
                    pivot.engineModule.pivotValues : pivot.pivotValues
            };
            pivot.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                let dataSource: IDataSet[] | DataManager | string[][] = pivot.dataSourceSettings.dataSource;
                if (isBlazor() && observedArgs.dataSourceSettings.dataSource instanceof Object) {
                    observedArgs.dataSourceSettings.dataSource = dataSource;
                }
                pivot.dataSourceSettings = observedArgs.dataSourceSettings;
                if (pivot.dataType === 'olap') {
                    pivot.olapEngineModule.pivotValues = isBlazor() ? pivot.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (pivot as any).bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                } else {
                    pivot.engineModule.pivotValues = isBlazor() ? pivot.engineModule.pivotValues : observedArgs.pivotValues;
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete (pivot as any).bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                }
                pivot.pivotCommon.engineModule = pivot.dataType === 'olap' ? pivot.olapEngineModule : pivot.engineModule;
                pivot.pivotCommon.dataSourceSettings = pivot.dataSourceSettings as IDataOptions;

                pivot.renderPivotGrid();
            });
        }
    }
    /** @hidden */
    public updateBlazorData(data: any, control?: PivotView): void {
        control.allowServerDataBinding = false;
        let pivVal: any;
        let pivotFL: IFieldListOptions;
        let pivotFields: string[];
        let valueSort: IValueSortSettings;
        let blazPivot: PivotView = control;
        let valContent: IGridValues = [];
        let headContent: IGridValues = [];
        pivotFL = JSON.parse(data["fieldList"]);
        pivVal = JSON.parse(data["pivotValue"]);
        pivotFields = JSON.parse(data["fields"]);
        valueSort = JSON.parse(data["valueSortSettings"])
        let len: number = pivVal.length;
        let pvalues: any = JSON.parse(pivVal[0]);
        let pvalLen: number = pvalues.length;
        var blazPivotValues = new Array(len);
        for (i = 0; i < len; i++) {
            blazPivotValues[i] = new Array(pvalLen);
        }
        for (var i = 0; i < len; i++) {
            if (pivVal[i] != null) {
                let values: any = JSON.parse(pivVal[i]);
                let valLen: number = values.length;
                for (let j: number = 0; j < valLen; j++) {
                    blazPivotValues[i][j] = values[j];
                }
            }
            else {
                blazPivotValues[i] = undefined;
                //headContent[i] = undefined;
            }

        }
        let pivotValues: IGridValues = blazPivotValues;
        let rowPos: number;
        for (let rCnt: number = 0; rCnt < pivotValues.length; rCnt++) {
            if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }

        blazPivot.pivotValues = blazPivotValues;
        valContent = blazPivot.frameContent(blazPivotValues, 'value', rowPos, blazPivot);
        headContent = blazPivot.frameContent(blazPivotValues, 'header', rowPos, blazPivot);
        this.engineModule.pivotValues = blazPivotValues;
        this.engineModule.fieldList = pivotFL;
        this.engineModule.fields = pivotFields;
        this.engineModule.valueSortSettings = valueSort;
        this.engineModule.valueContent = valContent;
        this.engineModule.headerContent = headContent;
        this.engineModule.isEngineUpdated = JSON.parse(data["isEngineUpdated"]);
        this.engineModule.isEmptyData = JSON.parse(data["isEmptyData"]);
        this.engineModule.rowCount = JSON.parse(data["rowCount"]);
        this.engineModule.columnCount = JSON.parse(data["columnCount"]);
        this.engineModule.rowStartPos = JSON.parse(data["rowStartPos"]);
        this.engineModule.colStartPos = JSON.parse(data["colStartPos"]);
        this.engineModule.rowFirstLvl = JSON.parse(data["rowFirstLvl"]);
        this.engineModule.colFirstLvl = JSON.parse(data["colFirstLvl"]);
        control.allowServerDataBinding = true;
    }
    /** @hidden */
    public frameContent(pivotValues: IPivotValues, type: string, rowPosition: number, control: PivotView): IGridValues {
        let dataContent: IGridValues = [];
        var pivot = control;
        if (pivot.dataSourceSettings.values.length > 0 && !pivot.engineModule.isEmptyData) {
            if ((pivot.enableValueSorting) || !pivot.engineModule.isEngineUpdated) {
                let rowCnt: number = 0;
                let start: number = type === 'value' ? rowPosition : 0;
                let end: number = type === 'value' ? pivotValues.length : rowPosition;
                for (var rCnt = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {} as IAxisSet[];
                        for (var cCnt = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
                            if (pivotValues[rCnt][cCnt]) {
                                dataContent[rowCnt][cCnt] = pivotValues[rCnt][cCnt] as IAxisSet;
                            }
                        }
                        rowCnt++;
                    }
                }
            }
        }
        return dataContent;
    }
    /* tslint:enable */
    private generateData(): void {
        if (this.displayOption.view !== 'Chart') {
            this.renderEmptyGrid();
        }
        this.showWaitingPopup();
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.refreshData.bind(this), 100);
    }

    /** @hidden */
    public refreshData(): void {
        let pivot: PivotView = this;
        if (isBlazor()) {
            if (pivot.dataType === 'olap') {
                if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({
                        dataSourceSettings: {
                            dataSource: undefined
                        }
                    }, true);
                    pivot.allowServerDataBinding = true;

                }
            }
        }
        if (pivot.dataSourceSettings && (pivot.dataSourceSettings.dataSource || pivot.dataSourceSettings.url)) {
            if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                if (isBlazor() && pivot.enableVirtualization) {
                    if (!pivot.element.querySelector('.e-spinner-pane')) {
                        this.showWaitingPopup();
                    }
                    pivot.initEngine();
                } else {
                    if (pivot.dataType === 'pivot' && pivot.remoteData.length > 0) {
                        if (!this.element.querySelector('.e-spinner-pane')) {
                            this.showWaitingPopup();
                        }
                        this.engineModule.data = pivot.remoteData;
                        this.initEngine();
                    } else {
                        setTimeout(pivot.getData.bind(pivot), 100);
                    }
                }
            } else if ((this.dataSourceSettings.url !== '' && this.dataType === 'olap') ||
                (pivot.dataSourceSettings.dataSource && (pivot.dataSourceSettings.dataSource as IDataSet[]).length > 0)) {
                if (pivot.dataType === 'pivot') {
                    this.hideWaitingPopup();
                    pivot.engineModule.data = pivot.dataSourceSettings.dataSource;
                }
                pivot.initEngine();
            } else {
                this.hideWaitingPopup();
            }
        } else if (isBlazor() && pivot.dataType === 'pivot' &&
            this.engineModule.data && this.engineModule.data.length > 0) {
            this.initEngine();
        } else {
            this.hideWaitingPopup();
        }
    }

    private getValueCellInfo(aggregateObj: AggregateEventArgs): AggregateEventArgs {
        let args: AggregateEventArgs = aggregateObj;
        this.trigger(events.aggregateCellInfo, args);
        return args;
    }

    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    public bindTriggerEvents(args?: Object): void {
        this.trigger(getObject('name', args), args);
    }

    private getData(): void {
        if (isBlazor()) {
            (this.dataSourceSettings.dataSource as DataManager).
                executeQuery(new Query().requiresCount()).then(this.executeQuery.bind(this));
        } else {
            (this.dataSourceSettings.dataSource as DataManager).executeQuery(new Query()).then(this.executeQuery.bind(this));
        }
    }

    private executeQuery(e: ReturnOption): void {
        if (!this.element.querySelector('.e-spinner-pane')) {
            this.showWaitingPopup();
        }
        let pivot: PivotView = this;
        //setTimeout(() => {
        pivot.engineModule.data = (e.result as IDataSet[]);
        if (!isNullOrUndefined(pivot.engineModule.data) && pivot.engineModule.data.length > 0) {
            pivot.initEngine();
        } else {
            this.hideWaitingPopup();
        }
        //});
    }

    /** @hidden */
    public applyFormatting(pivotValues: IPivotValues): void {
        if (pivotValues) {
            let colIndex: number[] = [];
            for (let len: number = pivotValues.length, i: number = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            for (let i: number = 0; i < pivotValues.length; i++) {
                for (let j: number = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                    if ((pivotValues[i][j] as IAxisSet).axis === 'value' && (pivotValues[i][j] as IAxisSet).formattedText !== '') {
                        (pivotValues[i][j] as IAxisSet).style = undefined;
                        (pivotValues[i][j] as IAxisSet).cssClass = undefined;
                        let format: IConditionalFormatSettings[] = this.dataSourceSettings.conditionalFormatSettings;
                        for (let k: number = 0; k < format.length; k++) {
                            if ((format[k].applyGrandTotals === true || isNullOrUndefined(format[k].applyGrandTotals)) ? true :
                                (pivotValues[i][j] as IAxisSet).rowHeaders !== '' &&
                                (pivotValues[i][j] as IAxisSet).columnHeaders !== '') {
                                if (this.checkCondition(
                                    (pivotValues[i][j] as IAxisSet).value,
                                    format[k].conditions, format[k].value1, format[k].value2)) {
                                    // let ilen: number =
                                    //     (this.dataSourceSettings.valueAxis === 'row' ? i : this.engineModule.headerContent.length - 1);
                                    // let jlen: number = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                                    if ((!format[k].measure || (pivotValues[i][j] as IAxisSet).actualText === format[k].measure) &&
                                        (format[k].measure === undefined || format[k].measure !== '') && (format[k].label === undefined ||
                                            format[k].label !== '') && ((!format[k].label ||
                                                (((pivotValues[i][0] as IAxisSet).valueSort.levelName as string)
                                                    .indexOf(format[k].label)) > -1) || (((pivotValues[i][j] as IAxisSet)
                                                        .rowHeaders as string).indexOf(format[k].label) > -1) ||
                                                (((pivotValues[i][j] as IAxisSet).columnHeaders as string)
                                                    .indexOf(format[k].label) > -1))) {
                                        if (format[k].style && format[k].style.backgroundColor) {
                                            format[k].style.backgroundColor = this.conditionalFormattingModule
                                                .isHex(format[k].style.backgroundColor.substr(1)) ? format[k].style.backgroundColor :
                                                this.conditionalFormattingModule.colourNameToHex(format[k].style.backgroundColor);
                                        }
                                        if (format[k].style && format[k].style.color) {
                                            format[k].style.color = this.conditionalFormattingModule
                                                .isHex(format[k].style.color.substr(1)) ? format[k].style.color :
                                                this.conditionalFormattingModule.colourNameToHex(format[k].style.color);
                                        }
                                        (pivotValues[i][j] as IAxisSet).style = format[k].style;
                                        (pivotValues[i][j] as IAxisSet).cssClass = 'format' + this.element.id + k;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let format: IConditionalFormatSettings[] = this.dataSourceSettings.conditionalFormatSettings;
            for (let k: number = 0; k < format.length; k++) {
                let sheet: StyleSheet = (this.createStyleSheet.bind(this))();
                let str: string = 'color: ' + format[k].style.color + '!important;background-color: ' + format[k].style.backgroundColor +
                    '!important;font-size: ' + format[k].style.fontSize + '!important;font-family: ' + format[k].style.fontFamily +
                    ' !important;';
                (sheet as CSSStyleSheet).insertRule('.format' + this.element.id + k + '{' + str + '}', 0);
            }
        }
    }

    private createStyleSheet(): StyleSheet {
        let style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    }

    private applyHyperlinkSettings(): void {
        if (this.pivotValues) {
            let pivotValues: IPivotValues = this.pivotValues;
            let colIndex: number[] = [];
            for (let len: number = pivotValues.length, i: number = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            if (this.hyperlinkSettings.conditionalSettings.length > 0) {
                for (let i: number = 0; i < pivotValues.length; i++) {
                    for (let j: number = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if ((pivotValues[i][j] as IAxisSet).axis === 'value') {
                            (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            let collection: ConditionalSettingsModel[] = this.hyperlinkSettings.conditionalSettings;
                            for (let k: number = 0; k < collection.length; k++) {
                                if (this.checkCondition(
                                    (pivotValues[i][j] as IAxisSet).value,
                                    collection[k].conditions, collection[k].value1, collection[k].value2)) {
                                    let ilen: number = (this.dataSourceSettings.valueAxis === 'row' ?
                                        i : (this.dataType === 'pivot' ?
                                            this.engineModule.headerContent.length - 1 : this.olapEngineModule.headerContent.length - 1));
                                    let jlen: number = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                                    if ((!collection[k].measure || this.dataSourceSettings.values.length === 1 ||
                                        ((pivotValues[ilen][jlen] as IAxisSet).valueSort &&
                                            ((pivotValues[ilen][jlen] as IAxisSet).actualText === collection[k].measure))) &&
                                        (!collection[k].label || ((pivotValues[colIndex[collection[k].label.split('.').length - 1]] &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet) &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet).valueSort &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet).
                                                valueSort[collection[k].label]) || (((pivotValues[i][0] as IAxisSet).
                                                    valueSort.levelName as string).indexOf(collection[k].label) > -1)))) {
                                        (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(this.hyperlinkSettings.headerText)) {
                for (let i: number = 0; i < pivotValues.length; i++) {
                    for (let j: number = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if ((pivotValues[i][j] as IAxisSet).axis === 'value') {
                            // (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            let label: string = this.hyperlinkSettings.headerText;
                            let ilen: number = (this.dataSourceSettings.valueAxis === 'row' ?
                                i : (this.dataType === 'pivot' ?
                                    this.engineModule.headerContent.length - 1 : this.olapEngineModule.headerContent.length - 1));
                            let jlen: number = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                            if ((pivotValues[colIndex[label.split('.').length - 1]] &&
                                (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet) &&
                                (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet).
                                    valueSort && (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet).
                                        valueSort[label])) {
                                for (let index of colIndex) {
                                    if ((pivotValues[index][j] as IAxisSet) &&
                                        (pivotValues[index][j] as IAxisSet).axis === 'column' &&
                                        (((pivotValues[index][j] as IAxisSet).valueSort.levelName as string).indexOf(label) > -1)) {
                                        (pivotValues[index][j] as IAxisSet).enableHyperlink = true;
                                    }
                                }
                                (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                            } else if (((pivotValues[i][0] as IAxisSet).valueSort.levelName as string).indexOf(label) > -1) {
                                (pivotValues[i][0] as IAxisSet).enableHyperlink = true;
                                (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                            }
                        }
                    }
                }
            } else {
                return;
            }
        }
    }

    private checkCondition(cellValue: number, conditions: string, conditionalValue1: number, conditionalValue2: number): boolean {
        switch (conditions) {
            case 'LessThan':
                return cellValue < conditionalValue1;
            case 'LessThanOrEqualTo':
                return cellValue <= conditionalValue1;
            case 'GreaterThan':
                return cellValue > conditionalValue1;
            case 'GreaterThanOrEqualTo':
                return cellValue >= conditionalValue1;
            case 'Equals':
                return cellValue === conditionalValue1;
            case 'NotEquals':
                return cellValue !== conditionalValue1;
            case 'Between':
                return (conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2);
            case 'NotBetween':
                return !((conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2));
            default:
                return false;
        }
    }

    /** @hidden */
    /* tslint:disable:max-func-body-length */
    public updateGroupingReport(newGroupSettings: IGroupSettings[], updateGroupType: GroupType): void {
        if (!this.clonedDataSet && !this.clonedReport) {
            let dataSet: IDataSet[] = this.engineModule.data as IDataSet[];
            this.clonedDataSet = PivotUtil.getClonedData(dataSet) as IDataSet[];
            if (isBlazor()) {
                this.clonedReport = PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings);
            } else {
                this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                this.clonedReport = PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings);
                this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
            }
        }
        /* tslint:disable-next-line:max-line-length */
        let dateGroup: RegExp = /_date_group_years|_date_group_quarters|_date_group_quarterYear|_date_group_months|_date_group_days|_date_group_hours|_date_group_minutes|_date_group_seconds/g;
        let data: IDataSet[] = PivotUtil.getClonedData(this.clonedDataSet) as IDataSet[];
        let dataSource: IDataOptions = this.dataSourceSettings;
        let clonedReport: IDataOptions = (<{ [key: string]: Object }>this.clonedReport).properties ?
            (<{ [key: string]: Object }>this.clonedReport).properties : this.clonedReport;
        let axisFields: IFieldOptions[][] = [dataSource.rows, dataSource.columns, dataSource.values, dataSource.filters];
        let fieldSettings: IFilter[][] | ISort[][] | IFormatSettings[][] | IDrillOptions[][] =
            [dataSource.filterSettings, dataSource.sortSettings, dataSource.formatSettings, dataSource.drilledMembers];
        let clonedAxisFields: IFieldOptions[] = clonedReport.rows;
        clonedAxisFields = clonedAxisFields.concat(clonedReport.columns, clonedReport.values, clonedReport.filters);
        if (newGroupSettings.length === 0 || newGroupSettings.length > 0) {
            this.engineModule.groupingFields = {};
            if (!isBlazor()) {
                /* tslint:disable-next-line:max-line-length */
                this.setProperties({ dataSourceSettings: { dataSource: data, groupSettings: newGroupSettings.length > 0 ? dataSource.groupSettings : [] } }, true);
            }
            let isDateGroupUpdated: boolean = updateGroupType === 'Date';
            let fields: string[] = [];
            for (let i: number = 0, cnt: number = axisFields.length; i < cnt; i++) {
                for (let j: number = 0, len: number = axisFields[i].length; j < len; j++) {
                    let fieldName: string = axisFields[i][j].name;
                    if (fields.indexOf(fieldName) === -1) {
                        fields.push(fieldName);
                    }
                    let index: number = fields.indexOf(fieldName);
                    let group: IGroupSettings = PivotUtil.getFieldByName(fieldName, dataSource.groupSettings) as IGroupSettings;
                    if ((!isNullOrUndefined(fieldName.match(dateGroup)) &&
                        isDateGroupUpdated) || (fieldName.indexOf('_custom_group') !== -1 &&
                            /* tslint:disable-next-line:max-line-length */
                            !PivotUtil.getFieldByName(fieldName.replace('_custom_group', ''), dataSource.groupSettings) as IGroupSettings)) {
                        axisFields[i].splice(j, 1);
                        fields.splice(index, 1);
                        j--;
                        len--;
                    } else {
                        let fieldObj: IFieldOptions = PivotUtil.getFieldByName(fieldName, clonedAxisFields) as IFieldOptions;
                        if (fieldObj) {
                            axisFields[i].splice(j, 1, fieldObj);
                        }
                    }
                }
            }
            for (let fieldName of fields) {
                let filterObj: IFilter = PivotUtil.getFilterItemByName(fieldName, clonedReport.filterSettings);
                let sortObj: ISort = PivotUtil.getFieldByName(fieldName, clonedReport.sortSettings) as ISort;
                let formatObj: IFormatSettings = PivotUtil.getFieldByName(fieldName, clonedReport.formatSettings) as IFormatSettings;
                let drillObj: IDrillOptions = PivotUtil.getFieldByName(fieldName, clonedReport.drilledMembers) as IDrillOptions;
                let settingsObj: IFilter[] | ISort[] | IFormatSettings[] | IDrillOptions[] = [filterObj, sortObj, formatObj, drillObj];
                for (let i: number = 0, cnt: number = fieldSettings.length; i < cnt; i++) {
                    let isExists: boolean = false;
                    for (let j: number = 0, len: number = fieldSettings[i].length; j < len; j++) {
                        let name: string = fieldSettings[i][j].name;
                        /* tslint:disable-next-line:max-line-length */
                        if ((!isNullOrUndefined(name.match(dateGroup)) && isDateGroupUpdated) || (name.indexOf('_custom_group') !== -1 &&
                            !PivotUtil.getFieldByName(name.replace('_custom_group', ''), dataSource.groupSettings) as IGroupSettings)) {
                            (fieldSettings[i] as IFilter[]).splice(j, 1);
                            j--;
                            len--;
                        } else if (fieldName === fieldSettings[i][j].name) {
                            isExists = true;
                            if (settingsObj[i]) {
                                (fieldSettings[i] as IFilter[]).splice(j, 1, settingsObj[i] as IFilter);
                            } else {
                                (fieldSettings[i] as IFilter[]).splice(j, 1);
                                j--;
                                len--;
                            }
                            break;
                        }
                    }
                    if (!isExists && i === 0 && filterObj) {
                        (fieldSettings[i] as IFilter[]).push(filterObj);
                    }
                    if (!isExists && i === 1 && sortObj) {
                        (fieldSettings[i] as ISort[]).push(sortObj);
                    }
                    if (!isExists && i === 2 && formatObj) {
                        (fieldSettings[i] as IFormatSettings[]).push(formatObj);
                    }
                    if (!isExists && i === 3 && drillObj) {
                        (fieldSettings[i] as IDrillOptions[]).push(drillObj);
                    }
                }
            }
            /* tslint:disable */
            if (isBlazor()) {
                this.engineModule.data = data;
                this.allowServerDataBinding = false;
                this.setProperties({
                    dataSourceSettings: {
                        rows: axisFields[0], columns: axisFields[1], values: axisFields[2], filters: axisFields[3],
                        filterSettings: fieldSettings[0], sortSettings: fieldSettings[1], formatSettings: fieldSettings[2],
                        drilledMembers: fieldSettings[3], groupSettings: newGroupSettings.length > 0 ? dataSource.groupSettings : []
                    }
                }, true);
                this.allowServerDataBinding = true;
            }
        }
    }
    private removeButtonFocus(e: MouseEvent): void {
        if (document.querySelectorAll('.e-btn-focused')) {
            removeClass(document.querySelectorAll('.e-btn-focused'), 'e-btn-focused');
        }
    }
    /* tslint:enable */
    /* tslint:enable:max-func-body-length */
    private wireEvents(): void {
        if (this.displayOption.view !== 'Chart') {
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
            EventHandler.add(this.element.querySelector('.' + cls.GRID_HEADER), 'mousemove', this.mouseMoveHandler, this);
            EventHandler.add(this.element, 'mouseup', this.mouseUpHandler, this);
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler, this);
        }
        EventHandler.add(document, this.isAdaptive ? 'touchend' : 'click', this.removeButtonFocus, this);
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
    }

    private unwireEvents(): void {
        if (this.displayOption.view !== 'Chart') {
            EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
            EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
            if (this.element.querySelector('.' + cls.GRID_HEADER)) {
                EventHandler.remove(this.element.querySelector('.' + cls.GRID_HEADER), 'mousemove', this.mouseMoveHandler);
            }
            EventHandler.remove(this.element, 'mouseup', this.mouseUpHandler);
            EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler);
        }
        EventHandler.remove(document, this.isAdaptive ? 'touchend' : 'click', this.removeButtonFocus);
        window.removeEventListener('resize', this.onWindowResize.bind(this), true);
    }

    /**
     * To destroy the PivotView elements.
     * @returns void
     */
    public destroy(): void {
        this.removeInternalEvents();
        if (this.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.destroy();
        }
        if (this.allowGrouping && this.groupingModule) {
            this.groupingModule.destroy();
        }
        if (this.showToolbar && this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        if (this.enableVirtualization && this.virtualscrollModule) {
            this.virtualscrollModule.destroy();
        }
        if (this.allowConditionalFormatting && this.conditionalFormattingModule) {
            this.conditionalFormattingModule.destroy();
        }
        if (this.allowNumberFormatting && this.numberFormattingModule) {
            this.numberFormattingModule.destroy();
        }
        if (this.isAdaptive && this.contextMenuModule) {
            this.contextMenuModule.destroy();
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        if (this.chart) {
            this.chart.destroy();
            if (this.chart.isDestroyed && this.element.querySelector('#' + this.element.id + '_chart')) {
                remove(this.element.querySelector('#' + this.element.id + '_chart'));
            }
        }
        if (this.grid) {
            this.grid.destroy();
            if (this.grid.isDestroyed && this.element.querySelector('#' + this.element.id + '_grid')) {
                remove(this.element.querySelector('#' + this.element.id + '_grid'));
            }
        }
        this.unwireEvents();
        super.destroy();
        if (!(isBlazor() && this.isServerRendered)) {
            this.element.innerHTML = '';
        } else {
            if (this.element.querySelector('.e-spinner-pane')) {
                remove(this.element.querySelector('.e-spinner-pane'));
            }
            if (this.showFieldList && document.querySelector('#' + this.element.id + '_PivotFieldList')) {
                remove(document.querySelector('#' + this.element.id + '_PivotFieldList'));
            }
        }
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
    }

    /**
     * Method to open the number formatting dialog to set the format dynamically.
     * @returns void
     */
    public showNumberFormattingDialog(): void {
        if (this.allowNumberFormatting) {
            this.numberFormattingModule.showNumberFormattingDialog();
        }
    }
}
