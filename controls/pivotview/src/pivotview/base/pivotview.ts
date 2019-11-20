import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, append, isBlazor } from '@syncfusion/ej2-base';
import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged, compile, formatUnit } from '@syncfusion/ej2-base';
import { removeClass, addClass, Event, KeyboardEventArgs, setValue } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings, IGroupSettings } from '../../base/engine';
import { IDrilledItem, ICustomProperties, ISort, IFilter, IFieldOptions, ICalculatedFields, IDrillOptions } from '../../base/engine';
import { IConditionalFormatSettings, IStringIndex, IField } from '../../base/engine';
import { PivotViewModel, GroupingBarSettingsModel, CellEditSettingsModel, DisplayOptionModel } from './pivotview-model';
import { HyperlinkSettingsModel, ConditionalSettingsModel } from './pivotview-model';
import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';
import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn, ChartLabelInfo } from '../../common/base/interface';
import { FetchReportArgs, LoadReportArgs, RenameReportArgs, RemoveReportArgs, ToolbarArgs } from '../../common/base/interface';
import { PdfCellRenderArgs, NewReportArgs, ChartSeriesCreatedEventArgs, AggregateEventArgs } from '../../common/base/interface';
import { ResizeInfo, ScrollInfo, ColumnRenderEventArgs, PivotCellSelectedEventArgs, SaveReportArgs } from '../../common/base/interface';
import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, CellTemplateArgs } from '../../common/base/interface';
import { BeforeExportEventArgs, EnginePopulatedEventArgs, BeginDrillThroughEventArgs, DrillArgs } from '../../common/base/interface';
import { FieldListRefreshedEventArgs, MemberFilteringEventArgs } from '../../common/base/interface';
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
import { Condition } from '../../base/types';
import { EditMode, ToolbarItems, View, Primary } from '../../common';
import { PivotUtil } from '../../base/util';
import { Toolbar } from '../../common/popups/toolbar';
import { PivotChart } from '../../pivotchart/index';
import { ChartSettings } from '../model/chartsettings';
import { ChartSettingsModel } from '../model/chartsettings-model';
import { Chart, ITooltipRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { IResizeEventArgs, IAxisLabelRenderEventArgs, ExportType } from '@syncfusion/ej2-charts';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ClickEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OlapEngine, IOlapCustomProperties, ITupInfo, IDrillInfo, IOlapField } from '../../base/olap/engine';
import { NumberFormatting } from '../../common/popups/formatting-dialog';

/** 
 * It holds the settings of Grouping Bar.
 */
export class GroupingBarSettings extends ChildProperty<GroupingBarSettings> {
    /** 
     * It allows to set the visibility of filter icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showFilterIcon: boolean;

    /** 
     * It allows to set the visibility of sort icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showSortIcon: boolean;

    /** 
     * It allows to set the visibility of remove icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showRemoveIcon: boolean;

    /** 
     * It allows to set the visibility of drop down icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showValueTypeIcon: boolean;

    /** 
     * It allows to set the visibility of grouping bar in desired view port
     * @default Both
     */
    @Property('Both')
    public displayMode: View;

    /**
     * It allows to enable/disable the drag and drop option to GroupingBar buttons. 
     * @default true     
     */
    @Property(true)
    public allowDragAndDrop: boolean;
}

/**
 * Configures the edit behavior of the Grid.
 */
export class CellEditSettings extends ChildProperty<CellEditSettings> implements EditSettingsModel {
    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     * @default false
     */
    @Property(false)
    public allowAdding: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     * @default false
     */
    @Property(false)
    public allowDeleting: boolean;

    /**
     * If `allowCommandColumns` is set to true, an additional column appended to perform CRUD operations in Grid.
     * @default false
     */
    @Property(false)
    public allowCommandColumns: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal
     */
    @Property('Normal')
    public mode: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     * @default true
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;
}

/**
 * Configures the conditional based hyper link settings.
 */
export class ConditionalSettings extends ChildProperty<ConditionalSettings> {

    /**
     * It allows to set the field name to get visibility of hyperlink based on condition.
     */
    @Property()
    public measure: string;

    /**
     * It allows to set the label name to get visibility of hyperlink based on condition.
     */
    @Property()
    public label: string;

    /**
     * It allows to set the filter conditions to the field.
     * @default NotEquals
     */
    @Property('NotEquals')
    public conditions: Condition;

    /**
     * It allows to set the value1 get visibility of hyperlink.
     */
    @Property()
    public value1: number;

    /**
     * It allows to set the value2 to get visibility of hyperlink.
     */
    @Property()
    public value2: number;
}

/** 
 * It holds the settings of Hyperlink.
 */
export class HyperlinkSettings extends ChildProperty<HyperlinkSettings> {
    /** 
     * It allows to set the visibility of hyperlink in all cells
     * @default false     
     */
    @Property(false)
    public showHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in row headers
     * @default false     
     */
    @Property(false)
    public showRowHeaderHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in column headers
     * @default false     
     */
    @Property(false)
    public showColumnHeaderHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in value cells
     * @default false     
     */
    @Property(false)
    public showValueCellHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in summary cells
     * @default false     
     */
    @Property(false)
    public showSummaryCellHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink based on condition
     * @default []
     */
    @Collection<ConditionalSettingsModel[]>([], ConditionalSettings)
    public conditionalSettings: ConditionalSettingsModel[];

    /** 
     * It allows to set the visibility of hyperlink based on header text
     */
    @Property()
    public headerText: string;

    /** 
     * It allows to set the custom class name for hyperlink options
     * @default ''
     */
    @Property('')
    public cssClass: string;
}

/** 
 * It holds the option for configure the chart and grid view.
 */
export class DisplayOption extends ChildProperty<DisplayOption> {
    /** 
     * It allows the user to switch the view port as table or chart or both
     * @default Table     
     */
    @Property('Table')
    public view: View;

    /** 
     * It allows the user to switch the primary view as table or chart
     * @default Table     
     */
    @Property('Table')
    public primary: Primary;
}

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
    public chart: Chart;
    /** @hidden */
    public currentView: Primary;
    /** @hidden */
    public isChartLoaded: boolean;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public isAdaptive: Boolean;
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
    public scrollerBrowserLimit: number = 500000;
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

    private defaultLocale: Object;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;
    private isEmptyGrid: boolean;
    private shiftLockedPos: string[] = [];
    private savedSelectedCellsPos: { rowIndex: string, colIndex: string }[] = [];
    private isPopupClicked: boolean = false;
    private isMouseDown: boolean = false;
    private isMouseUp: boolean = false;
    private lastSelectedElement: HTMLElement;
    private fieldsType: IStringIndex = {};
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
    public lastGridSettings: GridSettingsModel;
    protected needsID: boolean = true;
    private cellTemplateFn: Function;
    private pivotRefresh: Function = Component.prototype.refresh;

    //Property Declarations

    /**
     * Defines the currencyCode format of the Pivot widget columns
     * @private
     */
    @Property('USD')
    private currencyCode: string;

    /**
     * It allows to render pivotfieldlist.
     * @default false
     */
    @Property(false)
    public showFieldList: boolean;

    /** 
     * Configures the features settings of Pivot widget. 
     */
    @Complex<GridSettingsModel>({}, GridSettings)
    public gridSettings: GridSettingsModel;

    /** 
     * Configures the features settings of Pivot widget. 
     */
    @Complex<ChartSettingsModel>({}, ChartSettings)
    public chartSettings: ChartSettingsModel;

    /** 
     * Configures the settings of GroupingBar. 
     */
    @Complex<GroupingBarSettingsModel>({}, GroupingBarSettings)
    public groupingBarSettings: GroupingBarSettingsModel;

    /** 
     * Configures the settings of hyperlink settings. 
     */
    @Complex<HyperlinkSettingsModel>({}, HyperlinkSettings)
    public hyperlinkSettings: HyperlinkSettingsModel;

    /** 
     * It allows the user to configure the pivot report as per the user need.
     */
    @Complex<DataSourceSettingsModel>({}, DataSourceSettings)
    public dataSourceSettings: DataSourceSettingsModel;

    /**         
     * Configures the edit behavior of the Pivot Grid.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, allowCommandColumns: false, 
     * mode:'Normal', allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    @Complex<CellEditSettingsModel>({}, CellEditSettings)
    public editSettings: CellEditSettingsModel;

    /** 
     * Configures the settings of displayOption. 
     */
    @Complex<DisplayOptionModel>({}, DisplayOption)
    public displayOption: DisplayOptionModel;


    /**
     * It holds the pivot engine data which renders the Pivot widget.
     */
    @Property()
    public pivotValues: IPivotValues;

    /**
     * Enables the display of GroupingBar allowing you to filter, sort, and remove fields obtained from the datasource.
     * @default false
     */
    @Property(false)
    public showGroupingBar: boolean;

    /**
     * Allows to display the Tooltip on hovering value cells in pivot grid.
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /** 
     * It allows to enable/disable toolbar in pivot table.
     * @default false     
     */
    @Property(false)
    public showToolbar: boolean;

    /** 
     * It allows to set toolbar items in pivot table.
     * @default []
     */
    @Property([])
    public toolbar: ToolbarItems[];

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    @Property(false)
    public showValuesButton: boolean;

    /**
     * It allows to enable calculated field in PivotView.
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * It allows to enable Value Sorting in PivotView.
     * @default false
     */
    @Property(false)
    public enableValueSorting: boolean;

    /** 
     * It allows to enable Conditional Formatting in PivotView.
     * @default false
     */
    @Property(false)
    public allowConditionalFormatting: boolean;

    /** 
     * It allows to enable number formatting popup in pivot table.
     * @default false
     */
    @Property(false)
    public allowNumberFormatting: boolean;

    /** 
     * Pivot widget. (Note change all occurrences) 
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /** 
     * It allows to set the width of Pivot widget. 
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**    
     * If `allowExcelExport` is set to true, then it will allow the user to export pivotview to Excel file.
     * @default false    
     */
    @Property(false)
    public allowExcelExport: boolean;

    /**    
     * If `enableVirtualization` set to true, then the Grid will render only the rows and the columns visible within the view-port
     * and load subsequent rows and columns on vertical scrolling. This helps to load large dataset in Pivot Grid.
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**         
     * If `allowDrillThrough` set to true, then you can view the raw items that are used to create a 
     * specified value cell in the pivot grid.
     * @default false
     */
    @Property(false)
    public allowDrillThrough: boolean;

    /**    
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.
     * @default false    
     */
    @Property(false)
    public allowPdfExport: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotview.
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

    /**
     * If `allowDataCompression` is set to true when virtual scrolling is enabled, 
     * the performance of drag and drop, add/remove operations can be improved.
     * Note: It is having limitations in Drill-through, editing and some of the aggregation types.
     * @default false
     */
    @Property(false)
    public allowDataCompression: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    @Property(1000)
    public maxNodeLimitInMemberEditor: number;

    /**
     * It allows to set the maximum number of rows to be return while drill through.
     * @default 10000 
     */
    @Property(10000)
    public maxRowsInDrillThrough: number;

    /**
     * If `loadOnDemandInMemberEditor` is set to false, 
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube 
     * while the member editor pop-up opens for the first time alone.
     * @default true    
     */
    @Property(true)
    public loadOnDemandInMemberEditor: boolean;

    /**
     * The template option which is used to render the pivot cells on the pivotview. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the pivot cells.
     * @default null
     */
    @Property()
    public cellTemplate: string;

    /**
     * It allows to customize the spinner.
     * @default null
     */
    @Property()
    public spinnerTemplate: string;

    //Event Declarations

    /**
     * @hidden
     * @blazorproperty 'QueryCellInfo'
     */
    @Event()
    protected queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'HeaderCellInfo'
     */
    @Event()
    protected headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'Resizing'
     */
    @Event()
    protected resizing: EmitType<ResizeArgs>;

    /**
     * @hidden
     * @blazorproperty 'ResizeStopped'
     */
    @Event()
    protected resizeStop: EmitType<ResizeArgs>;

    /**
     * @hidden
     * @blazorproperty 'PdfHeaderQueryCellInfo'
     */
    @Event()
    protected pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'PdfQueryCellInfo'
     */
    @Event()
    protected pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ExcelHeaderQueryCellInfo'
     */
    @Event()
    protected excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ExcelQueryCellInfo'
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
     * @blazorproperty 'OnColumnsRender'
     */
    @Event()
    public beforeColumnsRender: EmitType<ColumnRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'Selected'
     */
    @Event()
    public selected: EmitType<CellSelectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'CellDeselected'
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'RowSelected'
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'RowDeselected'
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartTooltipRendered'
     */
    @Event()
    protected chartTooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartLoaded'
     */
    @Event()
    protected chartLoaded: EmitType<ILoadedEventArgs>;

    /** @hidden */
    @Event()
    protected chartLoad: EmitType<ILoadedEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartResized'
     */
    @Event()
    protected chartResized: EmitType<IResizeEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ChartAxisLabelRender'
     * @deprecated
     */
    @Event()
    protected chartAxisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ContextMenuItemClicked'
     * @deprecated
     */
    @Event()
    public contextMenuClick: EmitType<ContextMenuClickEventArgs>;

    /**
     * @hidden
     * @blazorproperty 'ContextMenuOpened'
     * @deprecated
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * This allows any customization of Pivot cell style while  PDF exporting.
     * @event
     * @blazorproperty 'PdfCellRender'
     */
    @Event()
    public onPdfCellRender: EmitType<PdfCellRenderArgs>;

    /**
     * This allows to save the report in any storage.
     * @event
     */
    @Event()
    public saveReport: EmitType<SaveReportArgs>;

    /**
     * This allows to fetch the report names from storage.
     * @event
     * @blazorproperty 'FetchReport'
     */
    @Event()
    public fetchReport: EmitType<FetchReportArgs>;

    /**
     * This allows to load the report from storage.
     * @event
     * @blazorproperty 'LoadReport'
     */
    @Event()
    public loadReport: EmitType<LoadReportArgs>;

    /**
     * This allows to rename the report.
     * @event
     */
    @Event()
    public renameReport: EmitType<RenameReportArgs>;

    /**
     * This allows to remove the report from storage.
     * @event
     */
    @Event()
    public removeReport: EmitType<RemoveReportArgs>;

    /**
     * This allows to set the new report.
     * @event
     */
    @Event()
    public newReport: EmitType<NewReportArgs>;

    /**
     * This allows to change the toolbar items.
     * @event
     * @blazorproperty 'ToolbarRendered'
     */
    @Event()
    public toolbarRender: EmitType<ToolbarArgs>;

    /**
     * This allows to change the toolbar items.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;

    /**
     * This allows any customization of PivotView properties on initial rendering.
     * @event
     * @blazorproperty 'OnLoad'
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * Triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * Triggers after the pivot engine populated and allows to customize the pivot widget.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /** 
     * Triggers when data source is populated in the Pivot View.
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * Triggers when data source is created in the Pivot View.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * Triggers when data source is destroyed in the Pivot View.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * This allows to set properties for exporting.
     * @event
     * @blazorproperty 'OnExport'
     * @deprecated
     */
    @Event()
    public beforeExport: EmitType<BeforeExportEventArgs>;

    /**
     * This allows to do changes before conditional formatting apply.
     * @event
     */
    @Event()
    public conditionalFormatting: EmitType<IConditionalFormatSettings>;

    /**
     * This event triggers before apply filtering
     * @event
     */
    @Event()
    public memberFiltering: EmitType<MemberFilteringEventArgs>;

    /** 
     * Triggers when cell is clicked in the Pivot widget.
     * @event
     */
    @Event()
    public cellClick: EmitType<CellClickEventArgs>;

    /** 
     * Triggers when value cell is clicked in the Pivot widget on Drill-Through.
     * @event
     * @blazorproperty 'DrillThrough'
     */
    @Event()
    public drillThrough: EmitType<DrillThroughEventArgs>;

    /** 
     * Triggers when value cell is clicked in the Pivot widget on Editing.
     * @event
     * @blazorproperty 'BeginDrillThrough'
     */
    @Event()
    public beginDrillThrough: EmitType<BeginDrillThroughEventArgs>;

    /** 
     * Triggers when hyperlink cell is clicked in the Pivot widget.
     * @event
     * @blazorproperty 'HyperlinkCellClicked'
     */
    @Event()
    public hyperlinkCellClick: EmitType<HyperCellClickEventArgs>;

    /** 
     * Triggers before cell got selected in Pivot widget.
     * @event
     * @blazorproperty 'CellSelecting'
     */
    @Event()
    public cellSelecting: EmitType<PivotCellSelectedEventArgs>;

    /** 
     * Triggers before drill down/ drill up Pivot widget.
     * @event
     */
    @Event()
    public drill: EmitType<DrillArgs>;

    /** 
     * Triggers when cell got selected in Pivot widget.
     * @event
     * @blazorproperty 'CellSelected'
     */
    @Event()
    public cellSelected: EmitType<PivotCellSelectedEventArgs>;

    /** 
     * Triggers when chart series are created.
     * @event
     * @blazorproperty 'ChartSeriesCreated'
     */
    @Event()
    public chartSeriesCreated: EmitType<ChartSeriesCreatedEventArgs>;

    /**
     * This allows to change the cell value.
     * @event
     * @blazorproperty 'AggregateCellInfo'
     * @deprecated
     */
    @Event()
    public aggregateCellInfo: EmitType<AggregateEventArgs>;

    /**
     * This allows to identify each field list update.
     * @event
     * @blazorproperty 'FieldListRefreshed'
     */
    @Event()
    public fieldListRefreshed: EmitType<FieldListRefreshedEventArgs>;

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
        let isCommonRequire: boolean;
        isCommonRequire = true;
        modules.push({ args: [this], member: 'grouping' });
        if (this.allowConditionalFormatting) {
            modules.push({ args: [this], member: 'conditionalformatting' });
        }
        if (this.allowNumberFormatting) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'numberformatting' });
        }
        if (this.allowCalculatedField) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        // if (this.showGroupingBar || !this.showGroupingBar) {
        //     isCommonRequire = true;
        //     modules.push({ args: [this], member: 'grouping' });
        // }
        if (this.showToolbar && this.toolbar.length > 0) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'toolbar' });
        }
        if (this.showFieldList) {
            isCommonRequire = true;
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
        if (this.gridSettings) {
            if (this.gridSettings.contextMenuItems) {
                isCommonRequire = true;
            }
        }
        if (isCommonRequire) {
            modules.push({ args: [this], member: 'common' });
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
        this.initProperties();
        this.isAdaptive = Browser.isDevice;
        this.renderToolTip();
        this.keyboardModule = new KeyboardInteraction(this);
        this.contextMenuModule = new PivotContextMenu(this);
        this.globalize = new Internationalization(this.locale);
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
            apply: 'APPLY',
            condition: 'Add Condition',
            formatLabel: 'Format',
            valueFieldSettings: 'Value field settings',
            baseField: 'Base field :',
            baseItem: 'Base item :',
            summarizeValuesBy: 'Summarize values by :',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption :',
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
            removeConfirm: 'Are you sure want to delete this report?',
            emptyReport: 'No reports found!!',
            bar: 'Bar',
            line: 'Line',
            area: 'Area',
            scatter: 'Scatter',
            polar: 'Polar',
            of: 'of',
            emptyFormat: 'No format found!!!',
            emptyInput: 'Enter a value',
            newReportConfirm: 'Want to save changes to report?',
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
            formatString: 'Format String',
            expressionField: 'Expression',
            customFormat: 'Enter custom format string',
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
                'And, if you want to edit the existing the calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            drillError: 'Cannot show the raw items of calculated fields.',
            caption: 'Field Caption',
            copy: 'Copy',
            defaultReport: 'Default report',
            customFormatString: 'Custom Format',
            invalidFormat: 'Invalid Format.'
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
            this.tooltip = new Tooltip({
                target: 'td.e-valuescontent',
                showTipPointer: false,
                enableRtl: this.enableRtl,
                beforeRender: this.setToolTip.bind(this),
                beforeOpen: this.onBeforeTooltipOpen
            });
            this.tooltip.isStringTemplate = true;
            this.tooltip.appendTo(this.element);
        } else if (this.tooltip) {
            this.tooltip.destroy();
        }
    }

    /** @hidden */
    public renderContextMenu(): void {
        if (this.gridSettings.contextMenuItems) {
            let conmenuItems: ContextMenuItemModel[] = [];
            let customItems: ContextMenuItemModel[] = [];
            let exportItems: ContextMenuItemModel[] = [];
            let aggItems: ContextMenuItemModel[] = [];
            let expItems: ContextMenuItemModel[] = [];
            let aggregateItems: ContextMenuItemModel[] = [];
            for (let item of this.gridSettings.contextMenuItems) {
                if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                    if ((item as string).toString().toLowerCase().indexOf('aggregate') !== -1) {
                        aggregateItems = [
                            { text: this.localeObj.getConstant('Sum'), id: this.element.id + '_AggSum' },
                            { text: this.localeObj.getConstant('DistinctCount'), id: this.element.id + '_AggDistinctCount' },
                            { text: this.localeObj.getConstant('Count'), id: this.element.id + '_AggCount' },
                            { text: this.localeObj.getConstant('Product'), id: this.element.id + '_AggProduct' },
                            { text: this.localeObj.getConstant('Avg'), id: this.element.id + '_AggAvg' },
                            { text: this.localeObj.getConstant('Max'), id: this.element.id + '_AggMax' },
                            { text: this.localeObj.getConstant('Min'), id: this.element.id + '_AggMin' },
                            { text: this.localeObj.getConstant('MoreOption'), id: this.element.id + '_AggMoreOption' }
                        ];
                    } else if ((item as string).toString().toLowerCase().indexOf('export') !== -1) {
                        exportItems.push(this.buildDefaultItems(item));
                    } else {
                        conmenuItems.push(this.buildDefaultItems(item));
                    }
                } else if (typeof item !== 'string') {
                    customItems.push(item);
                }
            }
            if (aggregateItems.length > 0) {
                let aggregateGroup: ContextMenuItemModel = this.buildDefaultItems('Aggregate');
                aggregateGroup.items = aggregateItems;
                aggItems.push(aggregateGroup);
            }
            if (exportItems.length > 0) {
                let exportGroupItems: ContextMenuItemModel = this.buildDefaultItems('export');
                exportGroupItems.items = exportItems;
                expItems.push(exportGroupItems);
            }
            this.gridSettings.contextMenuItems = [];
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, aggItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, conmenuItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, expItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, customItems);
        }
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
                    text: this.localeObj.getConstant('aggregate'), target: 'th.e-valuesheader,td.e-valuescontent,.e-stot',
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
        }
        this.defaultItems[item] = {
            text: menuItem.text, id: menuItem.id,
            target: menuItem.target, iconCss: menuItem.iconCss
        };
        return this.defaultItems[item];
    }
    /* tslint:disable:align */
    private initProperties(): void {
        this.pivotRefresh = Component.prototype.refresh;
        this.isScrolling = false;
        this.setProperties({ pivotValues: [] }, true);
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
        this.contextMenuClick = this.gridSettings.contextMenuClick ? this.gridSettings.contextMenuClick : undefined;
        this.contextMenuOpen = this.gridSettings.contextMenuOpen ? this.gridSettings.contextMenuOpen : undefined;
        this.beforePdfExport = this.gridSettings.beforePdfExport ? this.gridSettings.beforePdfExport.bind(this) : undefined;
        this.beforeExcelExport = this.gridSettings.beforeExcelExport ? this.gridSettings.beforeExcelExport.bind(this) : undefined;
        if (this.gridSettings.rowHeight === null) {
            this.setProperties({ gridSettings: { rowHeight: this.isAdaptive ? 48 : 36 } }, true);
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

    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    public render(): void {
        this.cellTemplateFn = this.templateParser(this.cellTemplate);
        if (this.spinnerTemplate) {
            createSpinner({ target: this.element, template: this.spinnerTemplate }, this.createElement);
        } else {
            createSpinner({ target: this.element }, this.createElement);
        }
        let loadArgs: LoadEventArgs = {
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            pivotview: isBlazor() ? undefined : this,
            fieldsType: {}
        };
        this.trigger(events.load, loadArgs, (observedArgs: LoadEventArgs) => {
            if (isBlazor()) {
                observedArgs.dataSourceSettings.dataSource = this.dataSourceSettings.dataSource;
            }
            this.dataSourceSettings = observedArgs.dataSourceSettings;
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
        // tslint:disable-next-line
        this.chartSettings['tooltipRender'] = undefined;
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
        this.setProperties({
            gridSettings: pivotData.gridSettings,
            pivotValues: pivotData.pivotValues,
            chartSettings: pivotData.chartSettings,
            displayOption: pivotData.displayOption
        }, true);
        /* tslint:enable */
        this.dataSourceSettings = pivotData.dataSourceSettings;
    }

    private mergePersistPivotData(): void {
        let blazdataSource: IDataSet[] | DataManager;
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
                        && newProp.dataSourceSettings.groupSettings) {
                        let groupSettings: IGroupSettings[] =
                            extend([], this.dataSourceSettings.groupSettings, null, true) as IGroupSettings[];
                        let data: IDataSet[] = PivotUtil.getClonedData(this.clonedDataSet) as IDataSet[];
                        let dataSource: IDataOptions = extend({}, this.clonedReport, null, true);
                        dataSource.dataSource = data;
                        if (newProp.dataSourceSettings.groupSettings.length === 0 ||
                            newProp.dataSourceSettings.groupSettings.length > 0) {
                            dataSource.groupSettings =
                                newProp.dataSourceSettings.groupSettings.length > 0 ? groupSettings : [];
                            this.setProperties({ dataSourceSettings: dataSource }, true);
                        }
                    }
                    if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).length === 1
                        && Object.keys(newProp.dataSourceSettings)[0] === 'dataSource') {
                        this.engineModule.fieldList = null;
                    }
                    this.notify(events.initialLoad, {});
                    break;
                case 'pivotValues':
                case 'displayOption':
                case 'height':
                case 'width':
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
                    this.renderModule.updateGridSettings();
                    this.isCellBoxMultiSelection = this.gridSettings.allowSelection &&
                        this.gridSettings.selectionSettings.cellSelectionMode === 'Box' &&
                        this.gridSettings.selectionSettings.mode === 'Cell' && this.gridSettings.selectionSettings.type === 'Multiple';
                    break;
                case 'chartSettings':
                    this.chartModule.loadChart(this, this.chartSettings);
                    break;
                case 'locale':
                case 'currencyCode':
                case 'enableRtl':
                    if (this.tooltip) {
                        this.tooltip.destroy();
                    }
                    super.refresh();
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
            }
        }
    }

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

    public getCellTemplate(): Function {
        return this.cellTemplateFn;
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
        if (this.showFieldList || this.showGroupingBar) {
            this.notify(events.uiUpdate, this);
            if (this.pivotFieldListModule && this.allowDeferLayoutUpdate) {
                this.pivotFieldListModule.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
            }
        }
        if (this.enableVirtualization) {
            this.virtualscrollModule = new VirtualScroll(this);
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
            if (this.allowDrillThrough || this.editSettings.allowEditing) {
                this.drillThroughModule = new DrillThrough(this);
            }
            this.renderModule = new Render(this);
            this.renderModule.render();
        } else if (this.grid) {
            remove(this.grid.element);
        }
        this.trigger(events.dataBound);
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
                } else {
                    this.grid.element.style.display = 'none';
                    this.chart.element.style.display = '';
                }
            }
        }
        if (this.toolbarModule) {
            if (this.showFieldList && this.element.querySelector('#' + this.element.id + '_PivotFieldList')) {
                (this.element.querySelector('#' + this.element.id + '_PivotFieldList') as HTMLElement).style.display = 'none';
            }
            if (this.toolbarModule && this.toolbarModule.action !== 'New' && this.toolbarModule.action !== 'Load'
                && this.toolbarModule.action !== 'Remove') {
                this.isModified = true;
            } else {
                this.toolbarModule.action = '';
            }
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
        showSpinner(this.element);
        let pivot: PivotView = this;
        //setTimeout(() => {
        /* tslint:disable:align */
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
                if (isSorted) {
                    pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                    pivot.engineModule.onSort(pivot.lastSortInfo);
                    pivot.lastSortInfo = {};
                }
                if (isAggChange) {
                    pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                    pivot.lastAggregationInfo = {};
                }
                if (isCalcChange) {
                    pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                    pivot.lastCalcFieldInfo = {};
                }
                if (isFiltered) {
                    pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings as IDataOptions);
                    pivot.lastFilterInfo = {};
                }
                pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
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
                    pivot.setProperties({ pivotValues: pivot.olapEngineModule.pivotValues }, true);
                } else {
                    /* tslint:disable:align */
                    let customProperties: ICustomProperties = {
                        mode: '',
                        savedFieldList: pivot.engineModule.fieldList,
                        pageSettings: pivot.pageSettings,
                        enableValueSorting: pivot.enableValueSorting,
                        isDrillThrough: (pivot.allowDrillThrough || pivot.editSettings.allowEditing),
                        localeObj: pivot.localeObj,
                        fieldsType: pivot.fieldsType
                    };
                    pivot.engineModule.renderEngine(
                        pivot.dataSourceSettings as IDataOptions, customProperties, pivot.getValueCellInfo.bind(pivot));
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                }
            }
            let eventArgs: EnginePopulatedEventArgs = {
                dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
                pivotValues: isBlazor() ? pivot.dataType === 'olap' ? pivot.olapEngineModule.pivotValues :
                    pivot.engineModule.pivotValues : pivot.pivotValues
            };
            pivot.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                let dataSource: IDataSet[] | DataManager = pivot.dataSourceSettings.dataSource;
                if (isBlazor() && observedArgs.dataSourceSettings.dataSource instanceof Object) {
                    observedArgs.dataSourceSettings.dataSource = dataSource;
                }
                pivot.dataSourceSettings = observedArgs.dataSourceSettings;
                if (pivot.dataType === 'olap') {
                    pivot.olapEngineModule.pivotValues = isBlazor() ? pivot.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    pivot.setProperties({ pivotValues: pivot.olapEngineModule.pivotValues }, true);
                } else {
                    pivot.engineModule.pivotValues = isBlazor() ? pivot.engineModule.pivotValues : observedArgs.pivotValues;
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                }
                pivot.pivotCommon.engineModule = pivot.dataType === 'olap' ? pivot.olapEngineModule : pivot.engineModule;
                pivot.pivotCommon.dataSourceSettings = pivot.dataSourceSettings as IDataOptions;

                pivot.renderPivotGrid();
            });
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
                for (let fCnt: number = 0; fCnt < this.dataSourceSettings.drilledMembers.length; fCnt++) {
                    let field: DrillOptionsModel = this.dataSourceSettings.drilledMembers[fCnt];
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
                if (!fieldAvail) {
                    this.dataSourceSettings.drilledMembers.push({ name: fieldName, items: [memberName], delimiter: delimiter });
                }
            }
            showSpinner(this.element);
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
                pivotview: isBlazor() ? undefined : pivot
            }
            pivot.trigger(events.drill, drillArgs, (observedArgs: DrillArgs) => {
                if (pivot.enableVirtualization) {
                    pivot.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                    pivot.engineModule.onDrill(drilledItem);
                } else {
                    pivot.engineModule.generateGridData(pivot.dataSourceSettings as IDataOptions);
                }
                pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                pivot.renderPivotGrid();
            });
            
            //});
        } else {
            this.onOlapDrill(fieldName, axis, action, delimiter, target, chartDrillInfo);
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private onOlapDrill(fieldName: string, axis: string, action: string, delimiter: string, target: Element, chartDrillInfo?: ChartLabelInfo): void {
        let currentCell: IAxisSet = chartDrillInfo ? chartDrillInfo.cell :
            this.olapEngineModule.pivotValues[Number(target.parentElement.getAttribute('index'))]
            [Number(target.parentElement.getAttribute('aria-colindex'))] as IAxisSet;
        let tupInfo: ITupInfo = axis === 'row' ? this.olapEngineModule.tupRowInfo[currentCell.ordinal] :
            this.olapEngineModule.tupColumnInfo[currentCell.ordinal];
        let drillInfo: IDrilledItem = {
            axis: axis,
            action: action,
            fieldName: fieldName,
            delimiter: delimiter,
            memberName: tupInfo.uNameCollection,
            currentCell: currentCell
        };
        /* tslint:disable-next-line:max-line-length */
        let fieldPos: number = tupInfo.drillInfo.map((item: IDrillInfo) => { return item.hierarchy; }).indexOf(currentCell.hierarchy.toString());
        if (drillInfo && drillInfo.action === 'down') {
            this.olapEngineModule.drilledSets[currentCell.actualText] = tupInfo.members[fieldPos] as HTMLElement;
            let fields: string[] = drillInfo.memberName.split('::');
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
            this.olapEngineModule.updateDrilledInfo(this.dataSourceSettings as IDataOptions);
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
            this.setProperties({ dataSourceSettings: { drilledMembers: drilledMembers } }, true);
            this.olapEngineModule.updateDrilledInfo(this.dataSourceSettings as IDataOptions);
        }
        this.setProperties({ pivotValues: this.olapEngineModule.pivotValues }, true);
        this.renderPivotGrid();
    }

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
            hideSpinner(this.element);
            this.trigger(events.dataBound);
        } else {
            this.isEmptyGrid = false;
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
        /* tslint:disable-next-line */
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
                    /* tslint:disable-next-line */
                    append([].slice.call(this.getCellTemplate()(templateObject, this, 'cellTemplate', this.element.id + '_cellTemplate')), tCell);
                }
                updateBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate', this);
            }
        }
    }

    private setToolTip(args: TooltipEventArgs): void {
        let colIndex: number = Number(args.target.getAttribute('aria-colindex'));
        let rowIndex: number = Number(args.target.getAttribute('index'));
        let cell: IAxisSet = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
        this.tooltip.content = '';
        let aggregateType: string; let caption: string;
        let hasField: boolean = false;
        if (cell && this.dataType === 'olap') {
            if (this.olapEngineModule.fieldList[cell.actualText]) {
                let field: IOlapField = this.olapEngineModule.fieldList[cell.actualText];
                aggregateType = field.isCalculatedField ? field.type : field.aggregateType;
                caption = field.caption;
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
            this.tooltip.content = '<div class=' + cls.PIVOTTOOLTIP + '><p class=' + cls.TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('row') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                this.getRowText(rowIndex, 0) +
                '</p></br><p class=' + cls.TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('column') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                this.getColText(0, colIndex, rowIndex) + '</p></br>' + (cell.actualText !== '' ? ('<p class=' + cls.TOOLTIP_HEADER + '>' +
                    (this.dataType === 'olap' ? '' :
                        (this.localeObj.getConstant(aggregateType) + ' ' + this.localeObj.getConstant('of') + ' ')) +
                    caption + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                    (((cell.formattedText === '0' || cell.formattedText === '') ?
                        this.localeObj.getConstant('noValue') : cell.formattedText)) + '</p></div>') : '');
        } else {
            args.cancel = true;
        }
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
                showSpinner(this.element);
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
                    pivot.engineModule.rMembers = pivot.engineModule.headerCollection.rowHeaders;
                    pivot.engineModule.cMembers = pivot.engineModule.headerCollection.columnHeaders;
                    pivot.engineModule.applyValueSorting();
                    pivot.engineModule.updateEngine();
                } else {
                    pivot.engineModule.generateGridData(pivot.dataSourceSettings as IDataOptions);
                }
                pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                pivot.renderPivotGrid();
                //});
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
        if (this.element.offsetWidth < this.totColWidth) {
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
        if (firstColWidth !== this.pivotColumns[0].width && this.element.offsetWidth < this.totColWidth) {
            this.firstColWidth = this.pivotColumns[0].width;
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
        if (height < this.gridSettings.rowHeight) {
            height = this.gridSettings.rowHeight;
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
        if (isNaN(this.grid.width as number)) {
            if (this.grid.width.toString().indexOf('%') > -1) {
                width = (parseFloat(this.grid.width.toString()) / 100) * this.element.offsetWidth;
            } else if (this.grid.width.toString().indexOf('px') > -1) {
                width = Number(this.grid.width.toString().split('px')[0]);
            }
            if (isNaN(width)) {
                width = this.element.offsetWidth;
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
            if (this.chart) {
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
                    } else {
                        this.clearSelection(ele, e, colIndex, rowIndex);
                    }
                    if (this.gridSettings.selectionSettings.type === 'Multiple' &&
                        (this.gridSettings.selectionSettings.mode === 'Row' || this.gridSettings.selectionSettings.mode === 'Both')) {
                        this.applyRowSelection(0, rowIndex, e);
                    }
                }
                if (this.cellClick && observedArgs.isCellClick) {
                    this.trigger(events.cellClick, {
                        currentCell: ele,
                        data: this.pivotValues[rowIndex][colIndex]
                    });
                }
            });
        }
    }

    /** @hidden */
    public clearSelection(ele: Element, e: MouseEvent | KeyboardEventArgs, colIndex: number, rowIndex: number) {
        if ((!e.shiftKey && !e.ctrlKey) || this.gridSettings.selectionSettings.type === 'Single') {
            if (this.gridSettings.selectionSettings.mode === 'Cell') {
                if (ele.classList.contains(cls.COLUMNSHEADER)) {
                    [].slice.call(this.element.querySelectorAll(('.' + cls.ROW_CELL_CLASS + '.') + cls.CELL_SELECTED_BGCOLOR)).forEach(function
                        (ele: HTMLElement) {
                        ele.classList.remove(cls.CELL_SELECTED_BGCOLOR);
                    });
                } else {
                    [].slice.call(this.element.querySelectorAll(('.' + cls.COLUMNSHEADER + '.') + cls.CELL_ACTIVE_BGCOLOR)).forEach(function
                        (ele: HTMLElement) {
                        ele.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                        ele.classList.remove(cls.SELECTED_BGCOLOR);
                    });
                }
            } else if (this.gridSettings.selectionSettings.mode === 'Both') {
                if (ele.classList.contains(cls.ROW_CELL_CLASS)) {
                    [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR)).forEach(function
                        (ele: HTMLElement) {
                        if (Number((ele as HTMLElement).getAttribute('index')) !== rowIndex) {
                            ele.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                            ele.classList.remove(cls.SELECTED_BGCOLOR);
                        }
                    })
                } else {
                    [].slice.call(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR)).forEach(function
                        (ele: HTMLElement) {
                        ele.classList.remove(cls.CELL_SELECTED_BGCOLOR);
                    })
                }
            }
        }
    }

    /** @hidden */
    public applyRowSelection(colIndex: number, rowIndex: number, e: MouseEvent): void {
        let pivotValue: IAxisSet = this.engineModule.pivotValues[rowIndex][colIndex] as IAxisSet;
        if (!e.ctrlKey && !e.shiftKey && pivotValue && pivotValue.members && pivotValue.members.length > 0) {
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
                }
            } else {
                _this.grid.selectionModule.selectRowsByRange(rowIndex -
                    _this.renderModule.rowStartPos, rCount - (1 + _this.renderModule.rowStartPos));
            }
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
                [].slice.call(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR)).forEach(function (ele: HTMLElement) {
                    ele.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                    ele.classList.remove(cls.SELECTED_BGCOLOR);
                    if (activeColumns.indexOf(ele.getAttribute('aria-colindex')) === -1) {
                        isToggle = false;
                    }
                    let colIndex: number = Number(ele.getAttribute('aria-colindex'));
                    actColPos[colIndex] = colIndex;
                });
                /* tslint:disable-next-line:no-any */
                activeColumns = Object.keys(actColPos).length > 0 ? Object.keys(actColPos).sort(function (a: any, b: any) {
                    return a - b
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
                [].slice.call(this.element.querySelectorAll('.' + cls.ROWSHEADER + '.' + cls.CELL_SELECTED_BGCOLOR)).forEach(function
                    (ele: HTMLElement) {
                    rowSelectedList.push(ele.getAttribute('index'));
                })
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
                [].slice.call(this.element.querySelectorAll(queryStringArray.toString())).forEach(function (ele: HTMLElement) {
                    if (Number(ele.getAttribute('index')) >= rowStart) {
                        if (isTargetSelected && isCtrl && (rowSelectedList.indexOf(ele.getAttribute('index')) === -1)) {
                            ele.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                            ele.classList.remove(cls.SELECTED_BGCOLOR);
                        } else {
                            ele.classList.add(cls.CELL_ACTIVE_BGCOLOR);
                            ele.classList.add(cls.SELECTED_BGCOLOR);
                        }
                    }
                });
            }
            this.renderModule.selected();
        }
    }

    private getSelectedCellsPos(): void {
        let control: PivotView = this;
        control.savedSelectedCellsPos = [];
        [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR)).forEach(function (ele: HTMLElement) {
            control.savedSelectedCellsPos.push({ rowIndex: ele.getAttribute('index'), colIndex: ele.getAttribute('aria-colindex') });
        })
    }

    private setSavedSelectedCells(): void {
        let control: PivotView = this;
        [].slice.call(this.savedSelectedCellsPos).forEach(function (item: { rowIndex: string, colIndex: string }) {
            let query: string = '[aria-colindex="' + item.colIndex + '"][index="' + item.rowIndex + '"]';
            control.element.querySelector(query).classList.add(cls.CELL_ACTIVE_BGCOLOR);
            control.element.querySelector(query).classList.add(cls.SELECTED_BGCOLOR);
        });
    }
    /* tslint:enable */

    private renderEmptyGrid(): void {
        this.isEmptyGrid = true;
        this.renderModule = new Render(this);
        if (this.grid && this.grid.element && this.element.querySelector('.e-grid')) {
            /* tslint:disable */
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
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        this.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            this.updatePageSettings(false);
            /* tslint:disable:align */
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
                    this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                    this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as DataSourceSettings;
                    this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
                }
                this.engineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties, this.getValueCellInfo.bind(this));
                this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
            } else if (this.dataSourceSettings.providerType === 'SSAS' && this.dataType === 'olap') {
                customProperties.savedFieldList = this.olapEngineModule.fieldList;
                (customProperties as IOlapCustomProperties).savedFieldListData = this.olapEngineModule.fieldListData;
                this.olapEngineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties);
                this.setProperties({ pivotValues: this.olapEngineModule.pivotValues }, true);
            }
            const this$: PivotView = this;
            this.trigger(events.enginePopulated, { pivotValues: this.pivotValues }, (observedArgs: EnginePopulatedEventArgs) => {
                if (this$.dataType === 'olap') {
                    this$.olapEngineModule.pivotValues = isBlazor() ? this.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    this$.pivotValues = this$.olapEngineModule.pivotValues;
                } else {
                    this$.engineModule.pivotValues = isBlazor() ? this.engineModule.pivotValues : observedArgs.pivotValues;
                    this$.pivotValues = this$.engineModule.pivotValues;
                }
                this$.notify(events.dataReady, {});
                this$.isEmptyGrid = false;
            });
        });
    }
    /* tslint:enable */
    private generateData(): void {
        if (this.displayOption.view !== 'Chart') {
            this.renderEmptyGrid();
        }
        showSpinner(this.element);
        let pivot: PivotView = this;
        //setTimeout(() => {
        /* tslint:disable */
        if (isBlazor()) {
            if (pivot.dataType === 'olap') {
                if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                    pivot.dataSourceSettings.dataSource = undefined;
                }
            }
        }
        if (pivot.dataSourceSettings && (pivot.dataSourceSettings.dataSource || pivot.dataSourceSettings.url)) {
            if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                setTimeout(pivot.getData.bind(pivot), 100);
            } else if ((this.dataSourceSettings.url !== '' && this.dataType === 'olap') ||
                (pivot.dataSourceSettings.dataSource as IDataSet[]).length > 0) {
                if (pivot.dataType === 'pivot') {
                    pivot.engineModule.data = pivot.dataSourceSettings.dataSource;
                }
                pivot.initEngine();
            } else {
                hideSpinner(pivot.element);
            }
        } else {
            hideSpinner(pivot.element);
        }
        /* tslint:enable */
        //});
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
        (this.dataSourceSettings.dataSource as DataManager).executeQuery(new Query()).then(this.executeQuery.bind(this));
    }

    private executeQuery(e: ReturnOption): void {
        if (!this.element.querySelector('.e-spinner-pane')) {
            showSpinner(this.element);
        }
        let pivot: PivotView = this;
        //setTimeout(() => {
        pivot.engineModule.data = (e.result as IDataSet[]);
        pivot.initEngine();
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
                    if ((pivotValues[i][j] as IAxisSet).axis === 'value') {
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

    private wireEvents(): void {
        if (this.displayOption.view !== 'Chart') {
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
            EventHandler.add(this.element.querySelector('.' + cls.GRID_HEADER), 'mousemove', this.mouseMoveHandler, this);
            EventHandler.add(this.element, 'mouseup', this.mouseUpHandler, this);
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler, this);
        }
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
        }
        this.unwireEvents();
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
        this.element.innerHTML = '';
        super.destroy();
    }
}
