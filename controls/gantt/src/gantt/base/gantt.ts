import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit, Browser, closest } from '@syncfusion/ej2-base';
import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, EventHandler } from '@syncfusion/ej2-base';
import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append, remove } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';
import { RowDragEventArgs, GridColumn} from '@syncfusion/ej2-grids';
import { GanttModel } from './gantt-model';
import { TaskProcessor } from './task-processor';
import { GanttChart } from './gantt-chart';
import { Timeline } from '../renderer/timeline';
import { GanttTreeGrid } from './tree-grid';
import { Toolbar } from '../actions/toolbar';
import { CriticalPath } from '../actions/critical-path';
import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs } from './interface';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-treegrid';
import { ITaskbarEditedEventArgs, IParent, ITaskData, PdfColumnHeaderQueryCellInfoEventArgs } from './interface';
import { ICollapsingEventArgs, CellEditArgs, PdfQueryTimelineCellInfoEventArgs } from './interface';
import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs, IKeyPressedEventArgs, IEventMarkerInfo } from './interface';
import { PdfExportProperties, ISplitterResizedEventArgs } from './interface';
import { ZoomEventArgs, IActionBeginEventArgs, CellSelectingEventArgs, RowDeselectEventArgs, PdfQueryCellInfoEventArgs } from './interface';
import { ITimeSpanEventArgs, ZoomTimelineSettings, QueryCellInfoEventArgs, RowDataBoundEventArgs, RowSelectEventArgs } from './interface';
import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel } from '../models/models';
import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';
import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel,LoadingIndicatorModel, LoadingIndicator } from '../models/models';
import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';
import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';
import { SearchSettingsModel, SearchSettings, ResourceFields, ResourceFieldsModel } from '../models/models';
import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DateProcessor } from './date-processor';
import { ChartRows } from '../renderer/chart-rows';
import { Dependency } from '../actions/dependency';
import * as cls from './css-constants';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column, ColumnModel } from '../models/column';
import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';
import { Sort } from '../actions/sort';
import { CellSelectEventArgs, ISelectedCell, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, IIndex, FailureEventArgs } from '@syncfusion/ej2-grids';
import { HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuItemModel, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExportProperties, ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { RowDD } from '../actions/rowdragdrop';
import { Filter } from '../actions/filter';
import { PageEventArgs, FilterEventArgs, SortEventArgs, ResizeArgs, ColumnDragEventArgs, getActualProperties } from '@syncfusion/ej2-grids';
import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';
import { ConnectorLine } from '../renderer/connector-line';
import { ConnectorLineEdit } from '../actions/connector-line-edit';
import { Edit } from '../actions/edit';
import { Splitter } from './splitter';
import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';
import { TooltipSettingsModel } from '../models/tooltip-settings-model';
import { Tooltip } from '../renderer/tooltip';
import { ToolbarItem, ColumnMenuItem, RowPosition, DurationUnit, SortDirection } from './enum';
import { GridLine, ContextMenuItem, ScheduleMode, ViewType } from './enum';
import { Selection } from '../actions/selection';
import { ExcelExport } from '../actions/excel-export';
import { DayMarkers } from '../actions/day-markers';
import { ContextMenu } from './../actions/context-menu';
import { RowSelectingEventArgs } from './interface';
import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './interface';
import { ColumnMenu } from '../actions/column-menu';
import { ITaskbarClickEventArgs, RecordDoubleClickEventArgs, IMouseMoveEventArgs } from './interface';
import { PdfExport } from '../actions/pdf-export';
import { WorkUnit, TaskType } from './enum';
import { FocusModule } from '../actions/keyboard';
import { VirtualScroll } from '../actions/virtual-scroll';
import { isCountRequired } from './utils';
import { TaskbarEdit } from '../actions/taskbar-edit';
/**
 *
 * Represents the Gantt chart component.
 * ```html
 * <div id='gantt'></div>
 * <script>
 *  var ganttObject = new Gantt({
 *      taskFields: { id: 'taskId', name: 'taskName', startDate: 'startDate', duration: 'duration' }
 *  });
 *  ganttObject.appendTo('#gantt');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Gantt extends Component<HTMLElement>
    implements INotifyPropertyChanged {
    /** @hidden */
    public chartPane: HTMLElement;
    /** @hidden */
    public treeGridPane: HTMLElement;
     /** @hidden */
     private contentMaskTable: Element;
     /** @hidden */
    private headerMaskTable: Element;
    /** @hidden */
    private isProjectDateUpdated: boolean;
    public currentSelection: any ;
    public columnLoop: any;
    private isRowSelected: boolean = false;
    public showIndicator: boolean = true;
    public singleTier: number = 0;
    public isVirtualScroll: boolean;
    public scrollLeftValue: any;
    public isToolBarClick: any;
    public isLocaleChanged: boolean = false;
    public initialLoadData: Object;
    public previousGanttColumns: ColumnModel[];
    /** @hidden */
    public topBottomHeader: any;
    /** @hidden */
    public splitterElement: HTMLElement;
    /** @hidden */
    public toolbarModule: Toolbar;
    /** @hidden */
    public focusModule: FocusModule;
    /** @hidden */
    public ganttChartModule: GanttChart;
    /** @hidden */
    public treeGridModule: GanttTreeGrid;
    /** @hidden */
    public chartRowsModule: ChartRows;
    /** @hidden */
    public connectorLineModule: ConnectorLine;
    public taskbarEditModule: TaskbarEdit;
    /** @hidden */
    public connectorLineEditModule: ConnectorLineEdit;
    /** @hidden */
    public splitterModule: Splitter;
    /** @hidden */
    public isCancelled: boolean = false;
    /** @hidden */
    public treeGrid: TreeGrid;
    /** @hidden */
    public controlId: string;
    /** @hidden */
    public ganttHeight: number;
    /** @hidden */
    public initialChartRowElements: NodeListOf<Element>;
    /** @hidden */
    public ganttWidth: number;
    /** @hidden */
    public predecessorModule: Dependency;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public dataOperation: TaskProcessor;
    /** @hidden */
    public flatData: IGanttData[];
    /** @hidden */
    public currentViewData: IGanttData[];
    /** @hidden */
    public updatedRecords: IGanttData[];
    /** @hidden */
    public ids: string[];
    /** resource-task Ids */
    /** @hidden */
    public taskIds: string[];
    /** @hidden */
    public previousRecords: object = {};
    /** @hidden */
    public editedRecords: IGanttData[] = [];
    /** @hidden */
    public modifiedRecords: IGanttData[] = [];
    /** @hidden */
    public isOnEdit: boolean = false;
    /** @hidden */
    public isOnDelete: boolean = false;
    /** @hidden */
    public secondsPerDay: number;
    /** @hidden */
    public nonWorkingHours: number[];
    /** @hidden */
    public workingTimeRanges: IWorkingTimeRange[];
    /** @hidden */
    public nonWorkingTimeRanges: IWorkingTimeRange[];
    /** @hidden */
    public defaultStartTime?: number;
    /** @hidden */
    public defaultEndTime?: number;
    /** @hidden */
    public nonWorkingDayIndex?: number[];
    /** @hidden */
    public durationUnitTexts?: Object;
    /** @hidden */
    public durationUnitEditText?: Object;
    /** @hidden */
    public isMileStoneEdited?: Object;
    /** @hidden */
    public chartVerticalLineContainer?: HTMLElement;
    /** @hidden */
    public updatedConnectorLineCollection?: IConnectorLineObject[];
    /** @hidden */
    public connectorLineIds?: string[];
    /** @hidden */
    public predecessorsCollection?: IGanttData[];
    /** @hidden */
    public isInPredecessorValidation?: boolean;
    /** @hidden */
    public isValidationEnabled?: boolean;
    /** @hidden */
    public isLoad?: boolean;
    /** @hidden */
    public editedTaskBarItem?: IGanttData;
    /** @hidden */
    public validationDialogElement?: Dialog;
    /** @hidden */
    public currentEditedArgs?: IValidateArgs;
    /** @hidden */
    public dialogValidateMode?: IValidateMode;
    /** @hidden */
    public perDayWidth?: number;
    /** @hidden */
    public zoomingProjectStartDate?: Date;
    /** @hidden */
    public zoomingProjectEndDate?: Date;
    /** @hidden */
    public cloneProjectStartDate?: Date;
    /** @hidden */
    public cloneProjectEndDate?: Date;
    /** @hidden */
    public totalHolidayDates?: number[];
    /** @hidden */
    public columnMapping?: { [key: string]: string; };
    /** @hidden */
    public ganttColumns: ColumnModel[];
    /** @hidden */
    public isExpandCollapseLevelMethod: boolean = false;
    /** @hidden */
    public isDynamicData: boolean = false;
    /** @hidden */
    public contentHeight: number;
    /** @hidden */
    // eslint-disable-next-line
    public isAdaptive: Boolean;
    /**
     * The `sortModule` is used to manipulate sorting operation in Gantt.
     */
    public sortModule: Sort;
    /**
     * The `filterModule` is used to manipulate filtering operation in Gantt.
     */
    public filterModule: Filter;
    /** @hidden */
    public scrollBarLeft: number;
    /** @hidden */
    public isTimelineRoundOff: boolean;
    /** @hidden */
    public columnByField: Object;
    /** @hidden */
    public customColumns: string[];
    /**
     * The `editModule` is used to handle Gantt record manipulation.
     */
    public editModule: Edit;
    /**
     * The `selectionModule` is used to manipulate selection operation in Gantt.
     */
    public selectionModule: Selection;
    /**
     * The `virtualScrollModule` is used to handle virtual scroll in Gantt.
     */
    public virtualScrollModule: VirtualScroll;
    /**
     * The `excelExportModule` is used to exporting Gantt data in excel format.
     */
    public excelExportModule: ExcelExport;
    /**
     * The `rowDragandDrop` is used to manipulate Row Reordering in Gantt.
     */
    public rowDragAndDropModule: RowDD;
    /**
     * The `dayMarkersModule` is used to manipulate event markers operation in Gantt.
     */
    public dayMarkersModule: DayMarkers;
    /**
     * The `criticalPathModule` is used to determine the critical path  in Gantt.
     */
    public criticalPathModule: CriticalPath;
    /** @hidden */
    public isConnectorLineUpdate: boolean = false;
    /** @hidden */
    public tooltipModule: Tooltip;
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public keyConfig: { [key: string]: string };
    /**
     * The `keyboardModule` is used to manipulate keyboard interactions in Gantt.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * The `contextMenuModule` is used to invoke context menu in Gantt.
     */
    public contextMenuModule: ContextMenu;
    /**
     * The `columnMenuModule` is used to manipulate column menu items in Gantt.
     */
    public columnMenuModule: ColumnMenu;
    /**
     * The `pdfExportModule` is used to exporting Gantt data in PDF format.
     */
    public pdfExportModule: PdfExport;
    /** @hidden */
    public staticSelectedRowIndex: number = -1;
    protected needsID: boolean = true;
    /** @hidden */
    public showActiveElement: boolean = true;
    /** @hidden */
    public addDeleteRecord: boolean = false;
    /** @hidden */
    public enableHeaderFocus: boolean = true;
    /** @hidden */
    public enableValidation: boolean = true;
    /**
     * Enables or disables the key board interaction of Gantt.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;
    /**
     * If `enableImmutableMode`  is set to true, the Gantt Chart will reuse old rows if it exists in the new result instead of
     * full refresh while performing the Gantt actions.
     *
     * @default false
     */
    @Property(false)
    public enableImmutableMode: boolean;

    /**
     * Specifies whether to allow dependency connection support for parent records.
     *
     * @default true
     */
    @Property(true)
    public allowParentDependency: boolean;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the TreeGrid component.
     * If `enableHtmlSanitizer` set to true, then it will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
     *
     * @default true
     */
    @Property(true)
    public disableHtmlEncode: boolean;
    /**
     * Configures the loading indicator of the Gantt Chart. Specifies whether to display spinner or shimmer effect during the waiting time on any actions performed in Gantt Chart.
     *
     * @default {indicatorType: 'Spinner'}
     */
    @Complex<LoadingIndicatorModel>({}, LoadingIndicator)
    public loadingIndicator: LoadingIndicatorModel;
    /**
     * Specifies whether to display shimmer effect during scrolling action in virtual scrolling feature. If disabled, spinner is shown instead of shimmer effect.
     *
     * @default true
     */
     @Property(true)
    public enableVirtualMaskRow: boolean;
        
    /**
     * Gets or sets whether to load child record on demand in remote data binding. Initially parent records are rendered in collapsed state.  
     *
     * @default false
     */
    @Property(false)
    public loadChildOnDemand: boolean;
        
    /**
     * Specifies whether to update offset value on a task for all the predecessor edit actions.
     *
     * @default true
     */
     @Property(true)
    public UpdateOffsetOnTaskbarEdit: boolean;
    /**
     * Specifies whether to auto calculate start and end-date  based on various factors such as working time, holidays, weekends, and predecessors.
     *
     * @default true
     */
     @Property(true)
    public autoCalculateDateScheduling: boolean;
    /**
     * Enables or disables the focusing the task bar on click action.
     *
     * @default true
     */
    @Property(true)
    public autoFocusTasks: boolean;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Gantt chart rows by clicking it.
     *
     * @default true
     */
    @Property(true)
    public allowSelection: boolean;

    /**
     * If `allowSorting` is set to true, it allows sorting of gantt chart tasks when column header is clicked.
     *
     * @default false
     */
    @Property(false)
    public allowSorting: boolean;

    /**
     * If `enablePredecessorValidation` is set to true, it allows to validate the predecessor link.
     *
     * @default true
     */
    @Property(true)
    public enablePredecessorValidation: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * @default false
     */
    @Property(false)
    public showColumnMenu: boolean;

    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br>
     * The available built-in items are,
     * * `ColumnChooser` - To show/hide the TreeGrid columns.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property.
     *
     * @default null
     */
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * By default, task schedule dates are calculated with system time zone.If Gantt chart assigned with specific time zone,
     * then schedule dates are calculated as given time zone date value.
     *
     * @default null
     */
    @Property()
    public timezone: string;
    /**
     * If `collapseAllParentTasks` set to true, then root tasks are rendered with collapsed state.
     *
     * @default false
     */
    @Property(false)
    public collapseAllParentTasks: boolean;
    /**
     * If `highlightWeekends` set to true, then all weekend days are highlighted in week - day timeline mode.
     *
     * @default false
     */
    @Property(false)
    public highlightWeekends: boolean;
    /**
     * To define expander column index in Grid.
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public treeColumnIndex: number;
    /**
     * It is used to render Gantt chart rows and tasks.
     * `dataSource` value was defined as array of JavaScript objects or instances of `DataManager`.
     * {% codeBlock src='gantt/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @isGenericType true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager | Object;
    /**
     * `durationUnit` Specifies the duration unit for each tasks whether day or hour or minute.
     * * `day`: Sets the duration unit as day.
     * * `hour`: Sets the duration unit as hour.
     * * `minute`: Sets the duration unit as minute.
     *
     * @default day
     */
    @Property('day')
    public durationUnit: DurationUnit;
    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     *
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Specifies the dateFormat for Gantt, given format is displayed in tooltip and Grid cells.
     * By default, the format is based on the culture.
     */
    @Property(null)
    public dateFormat: string;
    /**
     * Defines the height of the Gantt component container.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: number | string;

    /**
     * If `renderBaseline` is set to `true`, then baselines are rendered for tasks.
     *
     * @default false
     */
    @Property(false)
    public renderBaseline: boolean;

    /**
     * Defines whether to enable or disable taskbar drag and drop.
     *
     * @default false
     */
    @Property(false)
    public allowTaskbarDragAndDrop: boolean;

    /**
     * Defines whether taskbar to get overlapped or not.
     *
     * @default true
     */
    @Property(true)
    public allowTaskbarOverlap: boolean;

    /**
     * Configures the grid lines in tree grid and gantt chart.
     * 
     *  @default 'Horizontal'
     */
    @Property('Horizontal')
    public gridLines: GridLine;

    /**
     * Defines the right, left and inner task labels in task bar.
     * {% codeBlock src='gantt/labelSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<LabelSettingsModel>({}, LabelSettings)
    public labelSettings: LabelSettingsModel;

    /**
     * The task bar template that renders customized child task bars from the given template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public taskbarTemplate: string | Function;

    /**
     * The parent task bar template that renders customized parent task bars from the given template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public parentTaskbarTemplate: string | Function;

    /**
     * The milestone template that renders customized milestone task from the given template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public milestoneTemplate: string | Function;

    /**
     * Defines the baseline bar color.
     * 
     *  @default null
     */
    @Property()
    public baselineColor: string;

    /**
     * Defines the width of the Gantt component container.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: number | string;

    /**
     * If `enableVirtualization` set to true, then the Gantt will render only the rows visible within the view-port.
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Gantt.
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**
    * Loads project with large time span with better performance by initially rendering the timeline cells that are 
    * visible only within the current view and load subsequent timeline cells on horizontal scrolling.
    *
    * @default false
    */
    @Property(false)
    public enableTimelineVirtualization: boolean;

    /**
     * `toolbar` defines the toolbar items of the Gantt.
     * It contains built-in and custom toolbar items
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Gantt's toolbar.
     * <br><br>
     * The available built-in toolbar items are:
     * * Add: Adds a new record.
     * * Edit: Edits the selected task.
     * * Update: Updates the edited task.
     * * Delete: Deletes the selected task.
     * * Cancel: Cancels the edit state.
     * * Search: Searches tasks by the given key.
     * * ExpandAll: Expands all the task of Gantt.
     * * CollapseAll: Collapses all the task of Gantt.
     * * PrevTimeSpan: Extends timeline with one unit before the timeline start date.
     * * NextTimeSpan: Extends timeline with one unit after the timeline finish date.
     * * ZoomIn: ZoomIn the Gantt control.
     * * ZoomOut: ZoomOut the Gantt control.
     * * ZoomToFit: Display the all tasks within the viewable Gantt chart.
     * * ExcelExport: To export in Excel format.
     * * CsvExport : To export in CSV format.
     * * Indent: To indent a task to one level.
     * * Outdent: To outdent a task from one level.
     *
     * @default null
     */
    @Property()
    public toolbar: (ToolbarItem | string | ItemModel)[];

    /**
     * Defines workweek of project.
     *
     * @default ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
     */
    @Property(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    public workWeek: string[];
    /**
     * Defines weekend days are considered as working day or not.
     *
     * @default false
     */
    @Property(false)
    public includeWeekend: boolean;
    /**
     * Enables or disables rendering of unscheduled tasks in Gantt.
     *
     * @default false
     */
    @Property(false)
    public allowUnscheduledTasks: boolean;
    /**
     * To show notes column cell values inside the cell or in tooltip.
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public showInlineNotes: boolean;
    /**
     * Defines height value for grid rows and chart rows in Gantt.
     *
     * @default 36
     * @aspType int
     */
    @Property(36)
    public rowHeight: number;
    /**
     * Defines height of taskbar element in Gantt.
     * 
     * @default null
     * @aspType int?
     */
    @Property(null)
    public taskbarHeight: number;

    /**
     * Defines start date of the project, if `projectStartDate` value not set then it will be calculated from data source.
     *
     * @default null
     */
    @Property(null)
    public projectStartDate: Date | string;

    /**
     * Defines end date of the project, if `projectEndDate` value not set then it will be calculated from data source.
     *
     * @default null
     */
    @Property(null)
    public projectEndDate: Date | string;
    /**
     * Defines mapping property to get resource id value from resource collection.
     *
     * @default null
     */
    @Property(null)
    public resourceIDMapping: string;
    /**
     * Defines mapping property to get resource name value from resource collection.
     *
     * @default null
     */
    @Property(null)
    public resourceNameMapping: string;
    /**
     * Defines resource collection assigned for projects.
     *
     * @default []
     */
    @Property([])
    public resources: object[];
    /**
     * Defines segment collection assigned for tasks.
     *
     * @default []
     */
    @Property([])
    public segmentData: object[];
    /**
     * Defines background color of dependency lines.
     *
     * @default null
     */
    @Property(null)
    public connectorLineBackground: string;
    /**
     * Defines width of dependency lines.
     *
     * @default 1
     * @aspType int
     */
    @Property(1)
    public connectorLineWidth: number;
    /**
     * Defines column collection displayed in grid
     * If the `columns` declaration was empty then `columns` are automatically populated from `taskSettings` value.
     * {% codeBlock src='gantt/columns/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public columns: Column[] | string[] | ColumnModel[];
    /**
     * Defines the tabs and fields to be included in the add dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * {% codeBlock src='gantt/addDialogFields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public addDialogFields: AddDialogFieldSettingsModel[];
    /**
     * Defines the tabs and fields to be included in the edit dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * {% codeBlock src='gantt/editDialogFields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public editDialogFields: EditDialogFieldSettingsModel[];
    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     *
     * @default -1
     * @aspType int
     */
    @Property(-1)
    public selectedRowIndex: number;
    /**
     * `workUnit` Specifies the work unit for each tasks whether day or hour or minute.
     * * `day`: Sets the work unit as day.
     * * `hour`: Sets the work unit as hour.
     * * `minute`: Sets the work unit as minute.
     *
     * @default hour
     */
    @Property('hour')
    public workUnit: WorkUnit;
    /**
     * `taskType` Specifies the task type for task whether fixedUnit or fixedWork or fixedDuration.
     * * `fixedUnit`: Sets the task type as fixedUnit.
     * * `fixedWork`: Sets the task type as fixedWork.
     * * `fixedDuration`: Sets the task type as fixedDuration.
     *
     * @default fixedUnit
     */
    @Property('FixedUnit')
    public taskType: TaskType;
    /**
     * Defines the view type of the Gantt.
     * 
     *  @default 'ProjectView'
     */
    @Property('ProjectView')
    public viewType: ViewType;
    /**
     * Defines customized working time of project.
     * {% codeBlock src='gantt/dayWorkingTime/index.md' %}{% endcodeBlock %}
     */
    @Collection<DayWorkingTimeModel>([{ from: 8, to: 12 }, { from: 13, to: 17 }], DayWorkingTime)
    public dayWorkingTime: DayWorkingTimeModel[];
    /**
     * Defines holidays presented in project timeline.
     * {% codeBlock src='gantt/holidays/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<HolidayModel>([], Holiday)
    public holidays: HolidayModel[];
    /**
     * Defines events and status of project throughout the timeline.
     * {% codeBlock src='gantt/eventMarkers/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<EventMarkerModel>([], EventMarker)
    public eventMarkers: EventMarkerModel[];
    /**
     * Defines mapping properties to find task values such as id, start date, end date, duration and progress values from data source.
     * {% codeBlock src='gantt/taskFields/index.md' %}{% endcodeBlock %}
     */
    @Complex<TaskFieldsModel>({}, TaskFields)
    public taskFields: TaskFieldsModel;
    /**
     * Defines mapping properties to find resource values such as id, name, unit and group from resource collection.
     */
    @Complex<ResourceFieldsModel>({}, ResourceFields)
    public resourceFields: ResourceFieldsModel;

    /**
     * Configures timeline settings of Gantt.
     * Defines default timeline modes or customized top tier mode and bottom tier mode or single tier only.
     * {% codeBlock src='gantt/timelineSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<TimelineSettingsModel>({}, TimelineSettings)
    public timelineSettings: TimelineSettingsModel;
    /**
     * Configure zooming levels of Gantt Timeline
     * @default []
     */
    @Property([])
    public zoomingLevels: ZoomTimelineSettings[];
        
    /**
     * Configures current zooming level of Gantt.
     */
    public currentZoomingLevel: ZoomTimelineSettings;

    /**
     * Configures the sort settings of the Gantt.
     * {% codeBlock src='gantt/sortSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns:[]}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**
     * Configures edit settings of Gantt.
     * {% codeBlock src='gantt/editSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Auto',
     * showDeleteConfirmDialog: false }
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;
    /**
     * Enables or disables default tooltip of Gantt element and defines customized tooltip for Gantt elements.
     * {% codeBlock src='gantt/tooltipSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { showTooltip: true }
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Configures the selection settings.
     * {% codeBlock src='gantt/selectionSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {mode: 'Row', type: 'Single'}
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Enables or disables filtering support in Gantt.
     *
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export Gantt to Excel and CSV file.
     *
     * @default false
     */
    @Property(false)
    public allowExcelExport: boolean;

    /**
     * If `allowRowDragAndDrop` set to true, then it will allow the user to perform drag and drop action in Gantt.
     *
     * @default false
     */
    @Property(false)
    public allowRowDragAndDrop: boolean;
    /**
     * If `allowReordering` is set to true, Gantt columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     *
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;

    /**
     * If `readOnly` is set to true, Gantt cannot be edited.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * If `allowResizing` is set to true, Gantt columns can be resized.
     *
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;

    /**
     * If `enableContextMenu` is set to true, Enable context menu in Gantt.
     *
     * @default false
     */
    @Property(false)
    public enableContextMenu: boolean;

    /**
     * It highlights the critical tasks in the Gantt Chart that affect the project’s end date.
     *
     * @default false
     */
     @Property(false)
     public enableCriticalPath: boolean;
    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * {% codeBlock src='gantt/contextMenuItems/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];
    /**
     * If `allowPdfExport` set to true, then it will allow the user to export Gantt to PDF file.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * If `validateManualTasksOnLinking` is set to true,
     * it enables date validation while connecting manually scheduled tasks with predecessor
     *
     * @default false
     */

    @Property(false)
    public validateManualTasksOnLinking: boolean;
    /**
     * It enables to render the child taskbar on parent row for resource view Gantt.
     *
     * @default false
     */
    @Property(false)
    public enableMultiTaskbar: boolean;
    /**
     * It enables to render the overallocation container for resource view Gantt.
     *
     * @default false
     */
    @Property(false)
    public showOverAllocation: boolean;
    /**
     * Specifies task schedule mode for a project.
     * 
     * @default 'Auto'
     */
    @Property('Auto')
    public taskMode: ScheduleMode;

    /**
     * Configures the filter settings for Gantt.
     * {% codeBlock src='gantt/filterSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns: [], type: 'Menu' }
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**
     * Configures the search settings for Gantt.
     * {% codeBlock src='gantt/searchSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**
     * Configures the splitter settings for Gantt.
     * {% codeBlock src='gantt/splitterSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<SplitterSettingsModel>({}, SplitterSettings)
    public splitterSettings: SplitterSettingsModel;

    /**
     * @private
     */
    public timelineModule: Timeline;

    /**
     * @private
     */
    public dateValidationModule: DateProcessor;

    /**
     * @private
     */
    public isTreeGridRendered: boolean = false;

    /**
     * @private
     */
    public isFromOnPropertyChange: boolean = false;
        
    /**
     * @private
     */
    public isFromRenderBaseline: boolean = false;

    /**
     * @private
     */
    public isGanttChartRendered: boolean = false;

    /**
     * @private
     */
    public isEdit: boolean = false;

    /**
     * This will be triggered after the taskbar element is appended to the Gantt element.
     *
     * @event queryTaskbarInfo
     */
    @Event()
    public queryTaskbarInfo: EmitType<IQueryTaskbarInfoEventArgs>;

    /**
     * Triggers before Gantt data is exported to Excel file.
     *
     * @deprecated
     * @event beforeExcelExport
     */
    @Event()
    public beforeExcelExport: EmitType<Object>;
    /**
     * Triggers after Gantt data is exported to Excel file.
     *
     * @deprecated
     * @event excelExportComplete
     */
    @Event()
    public excelExportComplete: EmitType<ExcelExportCompleteArgs>;
    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @deprecated
     * @event excelQueryCellInfo
     */
    @Event()
    public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @deprecated
     * @event excelHeaderQueryCellInfo
     */
    @Event()
    public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;
    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     * @deprecated
     */
    @Event()
    public rowDrag: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row element’s drag(move) starts.
     *
     * @event rowDragStart
     * @deprecated
     */
    @Event()
    public rowDragStart: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s before drag(move).
     *
     * @event rowDragStartHelper
     */
    @Event()
    public rowDragStartHelper: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     */
    @Event()
    public rowDrop: EmitType<RowDragEventArgs>;

    /**
     * This will be triggered before the row getting collapsed.
     *
     * @event collapsing
     */
    @Event()
    public collapsing: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting collapsed.
     *
     * @event collapsed
     */
    @Event()
    public collapsed: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered before the row getting expanded.
     *
     * @event expanding
     */
    @Event()
    public expanding: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting expanded.
     *
     * @event expanded
     */
    @Event()
    public expanded: EmitType<ICollapsingEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<Object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs | ZoomEventArgs>;  // eslint-disable-line

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs | IKeyPressedEventArgs | ZoomEventArgs>;

    /**
     * Triggers when actions are failed.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /**
     * Triggers when the Gantt actions such as Sorting, Editing etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    @Event()
    public dataStateChange: EmitType<DataStateChangeEventArgs>;

    /**
     * This will be triggered taskbar was dragged and dropped on new position.
     *
     * @event taskbarEdited
     */
    @Event()
    public taskbarEdited: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered when a task get saved by cell edit.
     *
     * @event endEdit
     */
    @Event()
    public endEdit: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered a cell get begins to edit.
     *
     * @event cellEdit
     */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;

    /**
     * Triggered before the Gantt control gets rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<Object>;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * This event will be triggered when taskbar was in dragging state.
     *
     * @event taskbarEditing
     */
    @Event()
    public taskbarEditing: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Triggers when column resize starts.
     *
     * @deprecated
     * @event resizeStart
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @deprecated
     * @event resizing
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @deprecated
     * @event resizeStop
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts.
     *
     * @event splitterResizeStart
     */
    @Event()
    public splitterResizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging.
     *
     * @event splitterResizing
     */
    @Event()
    public splitterResizing: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed.
     *
     * @event splitterResized
     */
    @Event()
    public splitterResized: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @deprecated
     * @event columnDragStart
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @deprecated
     * @event columnDrag
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @deprecated
     * @event columnDrop
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers before tooltip get rendered.
     *
     * @event beforeTooltipRender
     */
    @Event()
    public beforeTooltipRender: EmitType<BeforeTooltipRenderEventArgs>;

    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after row selection occurs.
     *
     * @event rowSelected
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     *
     * @deprecated
     * @event rowDeselecting
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;


    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     *
     * @deprecated
     * @event cellDeselecting
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @deprecated
     * @event cellDeselected
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     *
     * @event queryCellInfo
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     *
     * @event headerCellInfo
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /**
     * This will be triggered before the row element is appended to the Grid element.
     *
     * @event rowDataBound
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers before column menu opens.
     *
     * @deprecated
     * @event columnMenuOpen
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when toolbar item was clicked.
     *
     * @event toolbarClick
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;
    /**
     * Triggers when click on column menu.
     *
     * @event columnMenuClick
     */
    @Event()
    public columnMenuClick: EmitType<ColumnMenuClickEventArgs>;
    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     */
    @Event()
    public contextMenuOpen: EmitType<CMenuOpenEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    @Event()
    public contextMenuClick: EmitType<CMenuClickEventArgs>;

    constructor(options?: GanttModel, element?: string | HTMLElement) {
        super(options, element);
        setValue('mergePersistData', this.mergePersistGanttData, this);
    }
    
    /**
     * This event will be triggered when click on taskbar element.
     *
     * @deprecated
     * @event onTaskbarClick
     */
    @Event()
    public onTaskbarClick: EmitType<ITaskbarClickEventArgs>;

    /**
     * This event will be triggered when double click on record.
     *
     * @deprecated
     * @event recordDoubleClick
     */
    @Event()
    public recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;

    /**
     * This event will be triggered when mouse move on Gantt.
     *
     * @deprecated
     * @event onMouseMove
     */
    @Event()
    public onMouseMove: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers before Gantt data is exported to PDF document.
     *
     * @event beforePdfExport
     * @deprecated
     */
    @Event()
    public beforePdfExport: EmitType<Object>;
    /**
     * Triggers after TreeGrid data is exported to PDF document.
     *
     * @event pdfExportComplete
     * @deprecated
     */
    @Event()
    public pdfExportComplete: EmitType<Object>;
    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     * @deprecated
     */
    @Event()
    public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;
    /**
     * Triggers before exporting each taskbar to PDF document. You can also customize the taskbar.
     *
     * @event pdfQueryTaskbarInfo
     * @deprecated
     */
    @Event()
    public pdfQueryTaskbarInfo: EmitType<Object>;
    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryTimelineCellInfo
     * @deprecated
     */
    @Event()
    public pdfQueryTimelineCellInfo: EmitType<PdfQueryTimelineCellInfoEventArgs>;
    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfColumnHeaderQueryCellInfo
     * @deprecated
     */
    @Event()
    public pdfColumnHeaderQueryCellInfo: EmitType<PdfColumnHeaderQueryCellInfoEventArgs>;
    /**
     * To get the module name
     *
     * @returns {string} .
     * @private
     */
    
    public eventMarkerColloction :IEventMarkerInfo[]=[]
    public getModuleName(): string {
        return 'gantt';
    }
    /**
     * For internal use only - Initialize the event handler
     *
     * @returns {void} .
     * @private
     */
    protected preRender(): void {
        this.initProperties();
    }
    private initProperties(): void {
        this.globalize = new Internationalization(this.locale);
        this.isAdaptive = Browser.isDevice;
        this.flatData = [];
        this.currentViewData = [];
        this.updatedRecords = [];
        this.ids = [];
        this.ganttColumns = [];
        this.localeObj = new L10n(this.getModuleName(), this.getDefaultLocale(), this.locale);
        this.dataOperation = new TaskProcessor(this);
        this.nonWorkingHours = [];
        this.nonWorkingTimeRanges = [];
        this.workingTimeRanges = [];
        this.defaultEndTime = null;
        this.defaultStartTime = null;
        this.durationUnitTexts = {
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            day: 'day',
            hour: 'hour',
            minute: 'minute'
        };
        this.durationUnitEditText = {
            minute: ['m', 'min', 'minute', 'minutes'],
            hour: ['h', 'hr', 'hour', 'hours'],
            day: ['d', 'dy', 'day', 'days']
        };
        this.perDayWidth = null;
        this.isMileStoneEdited = false;
        this.chartVerticalLineContainer = null;
        this.updatedConnectorLineCollection = [];
        this.connectorLineIds = [];
        this.predecessorsCollection = [];
        this.isInPredecessorValidation = this.enablePredecessorValidation;
        this.isValidationEnabled = true;
        this.isLoad = true;
        this.editedTaskBarItem = null;
        this.validationDialogElement = null;
        this.currentEditedArgs = {};
        this.dialogValidateMode = {
            respectLink: false,
            removeLink: false,
            preserveLinkWithEditing: true
        };
        this.secondsPerDay = this.dataOperation.getSecondsPerDay();
        this.nonWorkingDayIndex = [];
        this.dataOperation.getNonWorkingDayIndex();
        this.columnMapping = {};
        this.controlId = this.element.id;
        this.cloneProjectStartDate = this.enablePersistence && this.cloneProjectStartDate ?
         this.cloneProjectStartDate : null;
        this.cloneProjectEndDate = this.enablePersistence && this.cloneProjectEndDate ?
         this.cloneProjectEndDate : null;
        this.totalHolidayDates = this.dataOperation.getHolidayDates();
        this.ganttChartModule = new GanttChart(this);
        this.timelineModule = new Timeline(this);
        this.chartRowsModule = new ChartRows(this);
        this.treeGridModule = new GanttTreeGrid(this);
        this.dateValidationModule = new DateProcessor(this);
        this.predecessorModule = new Dependency(this);
        this.connectorLineModule = new ConnectorLine(this);
        this.splitterModule = new Splitter(this);
        this.tooltipModule = new Tooltip(this);
        this.keyConfig = {
            home: 'home',
            end: 'end',
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            collapseAll: 'ctrl+uparrow',
            expandAll: 'ctrl+downarrow',
            collapseRow: 'ctrl+shift+uparrow',
            expandRow: 'ctrl+shift+downarrow',
            saveRequest: '13', // enter
            cancelRequest: '27', //Esc
            addRow: 'insert', // insert key
            addRowDialog: 'ctrl+insert',
            editRowDialog: 'ctrl+f2',
            delete: 'delete',
            tab: 'tab',
            shiftTab: 'shift+tab',
            focusTask: 'shift+f5',
            indentLevel: 'shift+leftarrow',
            outdentLevel: 'shift+rightarrow',
            focusSearch: 'ctrl+shift+70', //F Key
            contextMenu: 'shift+F10' //F Key
        };
        this.focusModule = new FocusModule(this);
        if (this.zoomingLevels.length === 0) {
           this.setProperties({ zoomingLevels: this.getZoomingLevels() }, true)
        }
        this.resourceFieldsMapping();
        if (isNullOrUndefined(this.resourceFields.unit)) { //set resourceUnit as unit if not mapping
          this.setProperties({ resourceFields: { unit: 'unit' } }, true)
        }
        this.taskIds = [];
    }
    /**
     * @returns {string} .
     * @private
     */
    public getDateFormat(): string {
        if (!isNullOrUndefined(this.dateFormat)) {
            return this.dateFormat;
        } else {
            const ganttDateFormat: string = this.globalize.getDatePattern({ skeleton: 'yMd' });
            return ganttDateFormat;
        }
    }

    /**
     * To get timezone offset.
     *
     * @returns {number} .
     * @private
     */
     private getDefaultTZOffset(): number {
        const janMonth: Date = new Date(new Date().getFullYear(), 0, 1);
        const julMonth: Date = new Date(new Date().getFullYear(), 6, 1); //Because there is no reagions DST inbetwwen this range
        return Math.max(janMonth.getTimezoneOffset(), julMonth.getTimezoneOffset());
    }

    /**
     * To check whether the date is in DST.
     *
     * @param {Date} date - Defines the date to check whether it is DST.
     * @returns {boolean} .
     * @private
     */
    public isInDst(date: Date): boolean {
        return date.getTimezoneOffset() < this.getDefaultTZOffset();
    }

    /**
     * Method to map resource fields.
     *
     * @returns {void} .
     */
    private resourceFieldsMapping(): void {
        const resourceSettings: ResourceFieldsModel = this.resourceFields;
        resourceSettings.id = !isNullOrUndefined(resourceSettings.id) ? resourceSettings.id : this.resourceIDMapping;
        resourceSettings.name = !isNullOrUndefined(resourceSettings.name) ? resourceSettings.name : this.resourceNameMapping;
    }
    /**
     * To validate height and width
     *
     * @param {string | number} value .
     * @returns {string} .
     */
    private validateDimentionValue(value: string | number): string {
        if (!isNullOrUndefined(value)) {
            if (typeof (value) === 'string' && value !== 'auto' && value.indexOf('%') === -1) {
                return value.indexOf('px') === -1 ? value + 'px' : value;
            } else if (typeof (value) === 'number') {
                return value + 'px';
            } else {
                return value.toString();
            }
        } else {
            return null;
        }
    }

    /**
     * To calculate dimensions of Gantt control
     *
     * @returns {void} .
     */
    private calculateDimensions(): void {
        let settingsHeight: string = this.validateDimentionValue(this.height);
        let settingsWidth: string = this.validateDimentionValue(this.width);
        if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
            settingsWidth = this.width;
        }
        const elementStyleHeight: string = this.element.style.height;
        const elementStyleWidth: string = this.element.style.width;
        if (settingsWidth) {
            this.element.style.width = settingsWidth;
        }
        if (settingsHeight) {
            this.element.style.height = settingsHeight;
        }
        if (!settingsHeight && !elementStyleHeight) {
            this.element.style.height = 'auto'; // old 450px
        }
        if (!settingsWidth && !elementStyleWidth) {
            this.element.style.width = 'auto';
        }
        this.ganttHeight = this.element.offsetHeight;
        this.ganttWidth = this.element.offsetWidth;
    }
    /**
     * @returns {void} .
     * @private
     */
    protected render(): void {
        if ((<{ isReact?: boolean }>this).isReact) {
            (<{ isReact?: boolean }>this.treeGrid).isReact = true;
            (<{ isReact?: boolean }>this.treeGrid.grid).isReact = true;
        }
        if ((<{ isVue?: boolean }>this).isVue) {
            (<{ isVue?: boolean }>this.treeGrid).isVue = true;
            (<{ isVue?: boolean }>this.treeGrid.grid).isVue = true;
            (<{ vueInstance?: any }>this.treeGrid).vueInstance = (<{ vueInstance?: any }>this).vueInstance;
            (<{ vueInstance?: any }>this.treeGrid.grid).vueInstance = (<{ vueInstance?: any }>this).vueInstance;
        }
        this.element.setAttribute('role', 'application');
        createSpinner({ target: this.element }, this.createElement);
        this.trigger('load', {});
        this.element.classList.add(cls.root);
        this.rowHeight = (!isNullOrUndefined( document.body.className) && document.body.className.includes("e-bigger")) ? (this.rowHeight === 36) ? 46 : this.rowHeight : this.rowHeight
        if (this.isAdaptive) {
            this.element.classList.add(cls.adaptive);
        } else {
            this.element.classList.remove(cls.adaptive);
        }
        this.calculateDimensions();
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.renderToolbar();
        }
        this.splitterModule.renderSplitter();
        this.notify('renderPanels', null);
        if (!isNullOrUndefined(this.loadingIndicator) && this.loadingIndicator.indicatorType === "Shimmer"){
            this.showMaskRow();
        } else {
            this.showSpinner();
        }
        this.dataOperation.checkDataBinding();
    }
    public hideMaskRow () {
        let isTablePresent:any = this.element.querySelectorAll('.e-masked-table').length
        if (!isNullOrUndefined(this.contentMaskTable) && (isTablePresent != 0 || this.contentMaskTable)) {
            const maskTable: Element = this.contentMaskTable;
            remove(maskTable);
            this.contentMaskTable = null
        }
        isTablePresent = this.element.querySelectorAll('.e-masked-table').length
        if (!isNullOrUndefined(this.headerMaskTable) && (isTablePresent != 0 || this.headerMaskTable)) {
            const maskTable: Element = this.headerMaskTable;
            remove(maskTable);
            this.headerMaskTable = null
        }
        while ((this.element.querySelectorAll('.e-table-background')).length != 0) {
            this.element.querySelectorAll('.e-table-background')[0].remove()
        }
        while ((this.element.querySelectorAll('.e-temp-timeline')).length != 0) {
            this.element.querySelectorAll('.e-temp-timeline')[0].remove()
        }
        if (this.element.querySelectorAll('.' + cls.timelineHeaderTableContainer).length != 0) {
            for (var i = 0; i < this.singleTier; i++) {
                if (!isNullOrUndefined(this.element.querySelectorAll('.' + cls.timelineHeaderTableContainer)[parseInt(i.toString(), 10)])) {
                    this.element.querySelectorAll('.' + cls.timelineHeaderTableContainer)[parseInt(i.toString(), 10)]['style'].visibility = "visible";
                }
            }
        }
        if (!isNullOrUndefined(this.element.querySelector('.' + cls.timelineHeaderContainer))) {
            this.element.querySelector('.' + cls.timelineHeaderContainer)['style'].position = "relative";
        }
        if (!isNullOrUndefined(this.element.getElementsByClassName(cls.chartBodyContent)[0])) {
            this.element.getElementsByClassName(cls.chartBodyContent)[0]['style'].visibility  = "visible";
        }
    }
    public showMaskRow (){
        const ganttHeader: Element = this.chartPane.childNodes[0].childNodes[0] as Element;
        this.scrollLeftValue = this.chartPane.childNodes[0].childNodes[0]['scrollLeft']
        const ganttContent: Element = this.chartPane.childNodes[0].childNodes[1] as Element;
        if (this.treeGrid.element) {
            this.ganttChartModule['setVirtualHeight']();
        }
        if (!this.contentMaskTable) {
            if (ganttContent) {
                let content: Element = ganttContent;
                this.renderBackGround(content);
                if (this.element.querySelectorAll('.' + cls.timelineHeaderTableContainer).length != 0) {
                    this.singleTier = this.timelineModule.isSingleTier ? 1:2;
                    for (var i = 0; i < this.singleTier; i++) {
                        this.element.querySelectorAll('.' + cls.timelineHeaderTableContainer)[parseInt(i.toString(), 10)]['style'].visibility = "hidden";
                    }
                }
                if (this.singleTier === 0) {
                    this.singleTier = 2;
                }
                this.element.getElementsByClassName(cls.chartBodyContent)[0]['style'].visibility  = "hidden"
                this.contentMaskTable = this.contentMaskTable = this.createMaskTable(content)
            }
            if (ganttHeader) {
                this.element.querySelector('.' + cls.timelineHeaderContainer)['style'].position = "static";
                let content: Element = ganttHeader;
                this.renderHeaderBackground(content);
                this.headerMaskTable = this.headerMaskTable = this.createMaskTable(content)
            }
        }
    }
    private renderHeaderBackground (element:any):any {
        const parentElement: Element = element;
        const timelineHeight: any = element.getBoundingClientRect().height;
        const header: boolean = closest(parentElement,'.' + cls.timelineHeaderContainer) ? true : false;
        if (header) {
            const div:Element = this.createElement('div', { className: 'e-table-background'});
            const tempRow:Element = this.createElement('tr', { className: 'e-masked-row e-row', attrs: {
                style: 'height: ' + timelineHeight  + 'px;'
            } });
            let backgroundLines:number = 0;
            let containerWidth = Math.round(element.getBoundingClientRect().width);
            for (let i:number = 0; i < 3; i++) {
                if (this.enableRtl) {
                    div.appendChild(this.createElement('div', { className: 'e-div-background', attrs: {
                        style: 'left: ' + (containerWidth -= (
                            (160))) + 'px; top:0px;'
                    }}));
                } else {
                    div.appendChild(this.createElement('div', { className: 'e-div-background', attrs: {
                        style: 'left: ' + (backgroundLines += (
                            (160))) + 'px; top:0px;'
                    }}));
                }
                
            }
            parentElement.insertBefore(div, parentElement.firstChild);
        }
    }
    private renderBackGround (element:any):any {
        const parentElement: Element = element;
        const timelineHeight: any = element.getBoundingClientRect().height;
        const content: boolean = closest(parentElement, '.' + cls.chartBodyContainer) ? true : false;
        if (content) {
            const div:Element = this.createElement('div', { className: 'e-table-background'});
            const tempRow:Element = this.createElement('tr', { className: 'e-masked-row e-row', attrs: {
                style: 'height: ' + timelineHeight  + 'px;'
            } });
            let backgroundLines:number = 0;
            let containerWidth = Math.round(element.getBoundingClientRect().width);
            for (let i:number = 0; i < 3; i++) {
                if (this.enableRtl) {
                    div.appendChild(this.createElement('div', { className: 'e-div-background', attrs: {
                        style: 'left: ' + (containerWidth -= (160)) + 'px;z-index:1;'
                    }}));
                } else {
                    div.appendChild(this.createElement('div', { className: 'e-div-background', attrs: {
                        style: 'left: ' + (backgroundLines += (160)) + 'px;z-index:1;'
                    }}));
                }
            }
            parentElement.insertBefore(div, parentElement.firstChild);
        }
    }
    private createMaskTable(element: Element): any {
        const parentElement: Element = element;
        const shimmerContainerHeight: any = element.getBoundingClientRect().height;
        const header: boolean = closest(parentElement, '.' + cls.timelineHeaderContainer) ? true : false;
        let maskTable:any;
        if (header) {
            maskTable = this.createEmptyTimeLineTable(shimmerContainerHeight);
            maskTable.style.position = 'sticky';
            maskTable.style.left = 0 + 'px';
            if (this.enableRtl) {
               maskTable.style.removeProperty('left');
            }
        } else {
            maskTable = this.createEmptyMaskTable(shimmerContainerHeight);
            maskTable.style.position = 'absolute';
            maskTable.style.zIndex = 1;
        }
        if (!header) {
            maskTable.style.height = element.getBoundingClientRect().height + 'px';
            parentElement.insertBefore(maskTable,parentElement.firstChild)
        } else {
                maskTable.style.height = element.getBoundingClientRect().height + 'px';
                let div:any = this.createElement('div', { className: 'e-temp-timeline' });
                div.style.width = this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetWidth'] + 'px';
                div.style.position = 'sticky';
                if (this.enableRtl) {
                    div.style['margin-right'] = Math.abs(this.scrollLeftValue) + 'px';
                } else {
                    div.style['margin-left'] = this.scrollLeftValue + 'px';
                }
                div.appendChild(maskTable);
                parentElement.insertBefore(div, parentElement.firstChild);
        }
        return maskTable;
    }
    private createEmptyTimeLineTable (timelineHeight:any):any {
        const table: Element = this.createElement('table', { className: 'e-table e-masked-table'});
        const tbody: Element = this.createElement('tbody', { className: 'e-masked-tbody'});
        let row:any =[];
        const duplicateRow: Element = this.createElement('tr', { className: 'e-masked-row e-row', attrs: {
            style: 'height: ' + timelineHeight/2 + 'px;'
        }});
        for (let i: number = 0; i < this.singleTier; i++) {
            row.push(duplicateRow.cloneNode(true))
        }
        this.topBottomHeader = 0;
        for (let i: number = 0; i < row.length; i++) {
            tbody.appendChild(this.applyTimelineMaskRow(row[parseInt(i.toString(), 10)]));
            this.topBottomHeader = this.topBottomHeader + 1;
        }
        table.appendChild(tbody);
        (table as HTMLElement).style.width = 100 +'%';
        return table
    }
    private applyTimelineMaskRow (row: Element):any {
        const maskRow: Element = row;
        let num: number = 4;
        if (this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetWidth']/166 > 4) {
          num = this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetWidth']/166;
        }
        for (let i: number = 0; i < num; i++) {
            maskRow.appendChild(this.createElement('td', { className: 'e-timeline-masked-top-header-cell'}));
        }
        for (let i:number = 0; i < maskRow.childNodes.length-1; i++) {
            maskRow.childNodes[parseInt(i.toString(), 10)]['style']['width'] = 166 + 'px'
        }
        const maskCells: Element[] = [].slice.call(maskRow.childNodes);
        for (let i: number = 0; i < maskCells.length; i++) {
            const maskCell: Element = maskCells[parseInt(i.toString(), 10)];
            switch (this.topBottomHeader) {
                case 0 :
                    if (this.enableRtl) {
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-timelineHeader"></span>';
                        maskCell.children[0]['style'].left = -20 + 'px';
                    } else {
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-timelineHeader"></span>';
                    }
                    break;
                case 1 :
                    maskCell.appendChild(this.createElement('td', { className: 'e-timeline-masked-top-header-cell'}))
                    maskCell.appendChild(this.createElement('td', { className: 'e-timeline-masked-top-header-cell'}))
                    maskCell.appendChild(this.createElement('td', { className: 'e-timeline-masked-top-header-cell'}))
                    const innerMaskCells: Element[] = [].slice.call(maskCell.childNodes);
                    for (let i: number = 0; i < innerMaskCells.length; i++) {
                        const htmlInner: Element = innerMaskCells[parseInt(i.toString(), 10)];
                        if (i === 0) {
                            if (this.enableRtl) {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML"></span>';
                                htmlInner.children[0]['style'].left = -14 + 'px';
                            } else {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML"></span>';
                            } 
                        } else if (i === 1) {
                            if (this.enableRtl) {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML1"></span>';
                                htmlInner.children[0]['style'].left = -30 + 'px';
                            } else {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML1"></span>';
                            }
                        } else {
                            if (this.enableRtl) {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML2"></span>';
                                htmlInner.children[0]['style'].left = -60 + 'px';
                            } else {
                                htmlInner.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-innerHTML2"></span>';
                            } 
                        }
                    }
                    break;
            }
        }
        return maskRow;
    }
    private createEmptyMaskTable (timelineHeight:any):any {
        const table: Element = this.createElement('table', { className: 'e-table e-masked-table'});
        const tbody: Element = this.createElement('tbody', { className: 'e-masked-tbody'});
        let row:any =[];
        const duplicateRow: Element = this.createElement('tr', { className: 'e-masked-row e-row', attrs: {
            style: 'height: ' + timelineHeight/7 + 'px;'
        } });
        this.columnLoop = 0;
        for (let i: number = 0; i < 6; i++) {
            row.push(duplicateRow.cloneNode(true))
        }
        for (let j: number = 0; j < row.length; j++) {
            if (this.columnLoop < 4) {
                this.columnLoop = this.columnLoop + 1;
            }
            else if (this.columnLoop === 4) {
                this.columnLoop = 1;
            }
            tbody.appendChild(this.applyMaskRow(row[parseInt(j.toString(), 10)]));
        }
        table.appendChild(tbody);
        (table as HTMLElement).style.width = 100 +'%';
        let div:any = this.createElement('div', { className: 'e-temp-container' });
        div.style.width = 'calc(100% - ' + 17 + 'px)';
        div.style.overflow = 'hidden';
        div.appendChild(table);
        return div;
    }
    private applyMaskRow(row: Element): Element {
        const maskRow: Element = row;
        if (this.columnLoop < 4){
            let num: number = 2;
            if (this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetWidth']/300 > 2) {
              num = this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetWidth']/300;
            }
            for (let i: number = 0; i < num; i++) {
                maskRow.appendChild(this.createElement('td', { className: 'e-masked-cell e-rowcell' }))
            }
        } else {
            maskRow.appendChild(this.createElement('td', { className: 'e-masked-cell e-rowcell' }))
        }
        const maskCells: Element[] = [].slice.call(maskRow.childNodes);
        for (let i: number = 0; i < maskCells.length; i++) {
            const maskCell: Element = maskCells[parseInt(i.toString(), 10)];
            switch (this.columnLoop) {
                case 1:
                    if (i === 0) {
                        if (this.enableRtl) {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell01"></span>';
                            maskCell.children[0]['style'].left = -14 + 'px';
                        } else {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell01"></span>';
                        }
                    }
                    else {
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell02"></span>';
                    }
                    break;
                case 2:
                    if (i === 0) {
                        if (this.enableRtl) {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell03"></span>';
                            maskCell.children[0]['style'].left = -14 + 'px';
                        } else {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell03"></span>';
                        }
                    }
                    else { 
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell04"></span>';
                    }
                    break;
                case 3:
                    if (i === 0) {
                        if (this.enableRtl) {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell05"></span>';
                            maskCell.children[0]['style'].left = -64 + 'px';
                        } else {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell05"></span>';
                        }
                    }
                    else {
                        if (this.enableRtl) {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell06"></span>';
                            maskCell.children[0]['style'].left = -192 + 'px';
                        } else {
                            maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell06"></span>'; 
                        }
                    }
                    break;
                case 4:
                    if (this.enableRtl) {
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell07"></span>';
                        maskCell.children[0]['style'].left = -388 + 'px';
                    } else {
                        maskCell.innerHTML = '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave e-maskcell07"></span>';
                    }
                    break;
            }
        }
        return maskRow;
    }
    /**
     * Method used to show spinner.
     *
     * @returns {void} .
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * Method used to hide spinner.
     *
     * @returns {void} .
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }
    /**
     * @returns {void} .
     * @private
     */
    public processTimeline(): void {
        this.timelineModule.processTimelineUnit();
        this.timelineModule.calculateZoomingLevelsPerDayWidth(); // To calculate the perDaywidth
    }
    /**
     * @param {boolean} isChange -Defines whether task data is changed.
     * @returns {void} .
     * @private
     */
    public renderGantt(isChange?: boolean): void {
        if (isChange) {
            this.isFromOnPropertyChange = isChange;
        }
        // predecessor calculation
        if (this.predecessorModule && this.taskFields.dependency) {
            this.predecessorModule['parentIds'] = [];
            this.predecessorModule['parentRecord'] = [];
            this.predecessorModule.updatePredecessors();
            if (this.isInPredecessorValidation && this.enableValidation && this.autoCalculateDateScheduling) {
                this.predecessorModule.updatedRecordsDateByPredecessor();
            }
        }
        if (this.enableValidation) {
            this.dataOperation.calculateProjectDates();
            this.timelineModule.validateTimelineProp();
        }
        if (isChange) {
            if (this.enableValidation) {
                this.dataOperation.updateGanttData();
            }
            if (this.allowParentDependency) {
               this.predecessorModule.updateParentPredecessor();
            }
            if (this.dataSource instanceof Object && isCountRequired(this)) {
                const count: number = getValue('count', this.dataSource);
                this.treeGrid.dataSource = {result: this.flatData, count: count};
            } else {
                this.treeGrid.setProperties({ dataSource: this.flatData }, false);
            }
        } else {
            if (this.enableValidation) {
                this.dataOperation.updateGanttData();
            }
            if (this.allowParentDependency) {
               this.predecessorModule.updateParentPredecessor();
            }
            this.treeGridPane.classList.remove('e-temp-content');
            remove(this.treeGridPane.querySelector('.e-gantt-temp-header'));
            this.notify('dataReady', {});
            if (this.enableContextMenu) {
                this.notify('initiate-contextMenu', {});
            }
            this.renderTreeGrid();
            this.wireEvents();
            this.notify('initPredessorDialog', {});
        }
        if (!this.isFromOnPropertyChange) {
            this.splitterModule.updateSplitterPosition();
        }
        if ((this.gridLines === 'Vertical' || this.gridLines === 'Both') && (!this.dayMarkersModule)) {
            this.renderChartVerticalLines();
        }
    }
    public removeCriticalPathStyles(): void {
        const ganttChartElement: HTMLElement = this.ganttChartModule.chartElement;
        removeClass(ganttChartElement.querySelectorAll('.e-gantt-child-taskbar-inner-div'), cls.criticalChildTaskBarInnerDiv);
        removeClass(ganttChartElement.querySelectorAll('.e-gantt-child-progressbar-inner-div'), cls.criticalChildProgressBarInnerDiv);
        removeClass(ganttChartElement.querySelectorAll('.e-critical-milestone'), cls.criticalMilestone);
        removeClass(this.element.querySelectorAll('.e-connector-line'), cls.criticalConnectorLineSVG);
        removeClass(this.element.querySelectorAll('.e-connector-line-arrow'), cls.criticalConnectorArrowSVG);
    }
    private wireEvents(): void {
        if (this.allowKeyboard) {
            this.keyboardModule = new KeyboardEvents(
                this.element,
                {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfig,
                    eventName: 'keydown'
                });
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        EventHandler.add(window as any, 'resize', this.windowResize, this);
        EventHandler.add(document.body, 'keydown', this.keyDownHandler, this);
    }
    
    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.altKey) {
            if (e.keyCode === 74) {//alt j
                this.ganttChartModule.manageFocus(this.treeGrid.element.childNodes[1] as HTMLElement, 'remove', false);
                this.ganttChartModule.manageFocus(this.element, 'add', false);
            }
        }
    }
    /**
     * Method trigger while user perform window resize.
     *
     * @returns {void} .
     * @private
     */
    public windowResize(): void {
        if (!isNullOrUndefined(this.element)) {
            this.updateContentHeight();
            this.ganttChartModule.updateWidthAndHeight(); // Updating chart scroll conatiner height for row mismatch
            this.treeGridModule.ensureScrollBar();
            if (this.predecessorModule && this.taskFields.dependency) {
                this.updateRowHeightInConnectorLine(this.updatedConnectorLineCollection);
                this.connectorLineModule.renderConnectorLines(this.updatedConnectorLineCollection);
            }
            let criticalModule: CriticalPath = this.criticalPathModule;
            if (this.enableCriticalPath && criticalModule && criticalModule.criticalPathCollection) {
                this.criticalPathModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true, criticalModule.predecessorCollectionTaskIds);
            }
            this.calculateDimensions();
            const pane1: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[0] as HTMLElement;
            const pane2: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[1] as HTMLElement;
            this.splitterModule.splitterPreviousPositionGrid = pane1.scrollWidth + 1 + 'px';
            this.splitterModule.splitterPreviousPositionChart = pane2.scrollWidth + 1 + 'px';
            this.splitterModule.splitterObject.paneSettings[1].size = (this.ganttWidth - parseInt(this.splitterModule.splitterPreviousPositionGrid) - 4) + 'px';
            let proxy = this;
            if (this.timelineModule.isZoomToFit) {
                setTimeout(() => {
                    proxy.timelineModule.processZoomToFit();
                }, 0);
            }
        }
    }
    public keyActionHandler(e: KeyboardEventArgs): void {
        if (this.enableContextMenu && this.contextMenuModule && (e.action === 'downArrow' || e.action === 'upArrow') && document.getElementById(this.element.id +'_contextmenu') && this['args']) {
            const firstMenuItem: HTMLElement = this['args'];
            if (!isNullOrUndefined(firstMenuItem)) {
                (firstMenuItem).focus();
            }
        }
        if (e.target && (e.action === 'downArrow' || e.action === 'upArrow') && e.target === this.element.querySelector('.e-rowcell')) {
            this.treeGrid.grid.notify('key-pressed', e);
        }
        else {
            this.focusModule.onKeyPress(e);
        }
    }
    /**
     * Method for updating row height value in connector line collections
     *
     * @param {IConnectorLineObject[]} collection  -Defines the CollectorLine collection.
     * @returns {void} .
     * @private
     */
    private updateRowHeightInConnectorLine(collection: IConnectorLineObject[]): void {
        if (collection && collection.length) {
            const rowHeight: number = this.ganttChartModule.getChartRows()[0]
                && this.ganttChartModule.getChartRows()[0].getBoundingClientRect().height;
            if (rowHeight && !isNaN(rowHeight)) {
                for (let count: number = 0; count < collection.length; count++) {
                    collection[count as number].rowHeight = rowHeight;
                }
            }
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    protected renderToolbar(): void {
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.toolbarModule.renderToolbar();
            this.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    protected renderTreeGrid(): void {
        this.treeGridModule.renderTreeGrid();
    }
    private updateCurrentViewData(): void {
        this.currentViewData = this.treeGrid.getCurrentViewRecords().slice();
        if (!this.loadChildOnDemand && this.taskFields.hasChildMapping && this.currentViewData.length > 0) {
            this.autoCalculateDateScheduling = false;
            this.flatData = [];
            this.dataOperation.taskIds = [];
            this.ids = [];
            this.dataOperation.recordIndex = 0;
            this.dataOperation.dataArray = this.currentViewData;
            this.dataOperation.cloneDataSource();
            if (this.predecessorModule && this.taskFields.dependency) {
                this.predecessorModule['parentIds'] = [];
                this.predecessorModule['parentRecord'] = [];
                this.predecessorModule.updatePredecessors();
            }
            let gridData = this.treeGrid.grid.contentModule['rows'];
                const data: object = gridData.filter((x: any) => {
                    if (x['data'][this.taskFields.id] === this.flatData[0].ganttProperties.taskId) {
                        return x;
                    }
                })[0];
                let index = data['index'];
            for (let i: number =0;i < this.flatData.length;i++) {
                this.flatData[i as number].index = index;
                index++;
            }
            this.currentViewData = this.flatData;
            this.treeGrid.grid.currentViewData = this.flatData;
            if (!isNullOrUndefined(this.treeGrid['virtualScrollModule'])) {
                this.treeGrid['virtualScrollModule'].visualData = this.flatData;
                this.updatedRecords = this.flatData;
            }
        }
    }
    /**
     * @param {IGanttData} records -Defines the delete record collections.
     * @returns {IGanttData} .
     * @private
     */
    public getRecordFromFlatdata(records: IGanttData[]): IGanttData[] {
        const updatedRecord: IGanttData[] = [];
        for (let i: number = 0; i < records.length; i++) {
            updatedRecord.push(this.getTaskByUniqueID(records[i as number].uniqueID));
        }
        return updatedRecord;
    }
    /**
     * @param {object} args -Update the gantt element content height.
     * @returns {void} .
     * @private
     */
    public updateContentHeight(args?: object): void {
        if ((!this.allowTaskbarOverlap && !this.ganttChartModule.isCollapseAll && !this.ganttChartModule.isExpandAll) && this.viewType === 'ResourceView' && !this.isLoad) {
            return
        }
        else {
            if (this.virtualScrollModule && this.enableVirtualization && !isNullOrUndefined(args)) {
                const length: number = getValue('result.length', args);
                this.contentHeight = length * this.rowHeight;
            } else {
                const expandedRecords: IGanttData[] = this.virtualScrollModule && this.enableVirtualization ?
                    this.currentViewData : this.getExpandedRecords(this.currentViewData);
                let height: number;
                const chartRow: Element = !isNullOrUndefined(this.ganttChartModule.getChartRows()) ? this.ganttChartModule.getChartRows()[0] : null;
                if (!isNullOrUndefined(chartRow) && chartRow.getBoundingClientRect().height > 0) {
                    height = chartRow.getBoundingClientRect().height;
                } else {
                    height = this.rowHeight;
                }
                this.contentHeight = expandedRecords.length * height;
            }
        }
    }
    /**
     * To get expand status.
     *
     * @param {IGanttData} data .
     * @returns {boolean} .
     * @private
     */
    public getExpandStatus(data: IGanttData): boolean {
        const parentRecord: IGanttData = this.getParentTask(data.parentItem);
        if (!isNullOrUndefined(parentRecord)) {
            if (parentRecord.expanded === false) {
                return false;
            } else if (parentRecord.parentItem) {
                const parentData: IGanttData = this.getParentTask(parentRecord.parentItem);
                if (parentData.expanded === false) {
                    return false;
                } else {
                    return this.getExpandStatus(this.getParentTask(parentRecord.parentItem));
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    /**
     * Get expanded records from given record collection.
     *
     * @param {IGanttData[]} records - Defines record collection.
     * @returns {IGanttData[]} .
     * @deprecated
     */
    public getExpandedRecords(records: IGanttData[]): IGanttData[] {
        if (isNullOrUndefined(records)) {
            return [];
        }
        const expandedRecords: IGanttData[] = records.filter((record: IGanttData) => {
            return this.getExpandStatus(record) === true;
        });
        return expandedRecords;
    }
    /**
     * Getting the Zooming collections of the Gantt control
     *
     * @returns {ZoomTimelineSettings} .
     * @private
     */
    public getZoomingLevels(): ZoomTimelineSettings[] {
        const _WeekStartDay :number = this.timelineSettings.weekStartDay;
        const zoomingLevels: ZoomTimelineSettings[] = [
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 50 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 10 }, timelineUnitSize: 99, level: 0,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 20 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 5 }, timelineUnitSize: 99, level: 1,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 5 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 1 }, timelineUnitSize: 99, level: 2,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayHalfValue, count: 6
                }, timelineUnitSize: 66, level: 3,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayHalfValue, count: 6
                }, timelineUnitSize: 99, level: 4,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayQuarterValue, count: 3
                }, timelineUnitSize: 66, level: 5,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayQuarterValue, count: 3
                }, timelineUnitSize: 99, level: 6,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 1 },
                bottomTier: { unit: 'Month', format: 'MMM yyyy', count: 1 }, timelineUnitSize: 99, level: 7,
                timelineViewMode: 'Year', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 8,
                timelineViewMode: 'Month', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 9,
                timelineViewMode: 'Month', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 10,
                timelineViewMode: 'Month', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 11,
                timelineViewMode: 'Week', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 12,
                timelineViewMode: 'Week', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 99, level: 13,
                timelineViewMode: 'Week', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 14,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 99, level: 15,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 66, level: 16,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 17,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 2 }, timelineUnitSize: 66, level: 18,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 2 }, timelineUnitSize: 99, level: 19,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 1 }, timelineUnitSize: 66, level: 20,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 1 }, timelineUnitSize: 99, level: 21,
                timelineViewMode: 'Day', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 30 }, timelineUnitSize: 66, level: 22,
                timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 15 }, timelineUnitSize: 66, level: 23,
                timelineViewMode: 'Hour', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 1 }, timelineUnitSize: 66, level: 24,
                timelineViewMode: 'Hour', weekStartDay: _WeekStartDay, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            }

        ];
        return zoomingLevels;
    }
    private displayQuarterValue(date: Date): string {
        const month: number = date.getMonth();
        if (month >= 0 && month <= 2) {
            return 'Q1';
        } else if (month >= 3 && month <= 5) {
            return 'Q2';
        } else if (month >= 6 && month <= 8) {
            return 'Q3';
        } else {
            return 'Q4';
        }
    }
    private displayHalfValue(date: Date): string {
        const month: number = date.getMonth();
        if (month >= 0 && month <= 5) {
            return 'H1';
        } else {
            return 'H2';
        }
    }

    /**
     *
     * @param {Date} date .
     * @param {string} format .
     * @returns {string} .
     */
    public getFormatedDate(date: Date, format?: string): string {
        if (isNullOrUndefined(date)) {
            return null;
        }
        if (isNullOrUndefined(format)) {
            format = this.getDateFormat();
        }
        return this.globalize.formatDate(date, { format: format });
    }
    /**
     * Get duration value as string combined with duration and unit values.
     *
     * @param {number} duration - Defines the duration.
     * @param {string} durationUnit - Defines the duration unit.
     * @returns {string} .
     */
    public getDurationString(duration: number, durationUnit: string): string {
        const value: string = this.dateValidationModule.getDurationString(duration, durationUnit);
        return value;
    }
    /**
     * Get work value as string combined with work and unit values.
     *
     * @param {number} work - Defines the work value.
     * @param {string} workUnit - Defines the work unit.
     * @returns {string} .
     */
    public getWorkString(work: number, workUnit: string): string {
        const value: string = this.dateValidationModule.getWorkString(work, workUnit);
        return value;
    }
    private updateTreeColumns(): void {
        let temp: string;
        var field: string;
        let gridColumns: GridColumn[] = this.treeGrid.grid.getColumns();
        if (this.treeColumnIndex !== -1 && this.columns[this.treeColumnIndex] &&
            !isNullOrUndefined(this.columns[this.treeColumnIndex]['template'])) {
            temp = this.columns[this.treeColumnIndex]['template'];
            field = this.columns[this.treeColumnIndex]['field'];
        }
        let gridColumn: ColumnModel;
        for (let i: number = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (let j = 0; j < this.columns.length; j++) {
                if (this.columns[j as number]['field'] == gridColumns[i as number].field) {
                    for (const prop of Object.keys(this.columns[j as number])) {
                        if (!isUndefined(this.columns[j as number][prop as string])) {
                            gridColumn[prop as string] = gridColumns[i as number][prop as string];
                        }
                        gridColumn.visible = gridColumns[i as number].visible;
                        gridColumn.width = gridColumns[i as number].width;
                    }
                    this.columns[j as number] = (gridColumn);
                    if (this.columns[j as number]['type'] !== 'checkbox' && (!isNullOrUndefined(temp) && temp !== '')) {
                        this.columns[j as number]['template'] = temp;
                    }
                }
            }
        }
        if (this.columns.length > 0) {
            this.treeGrid.setProperties({ columns: this.columns }, true);
        }
    }  
    /**
     *
     * @param {object} args .
     * @returns {void} .
     * @private
     */
    public treeDataBound(args: object): void {
        this.element.getElementsByClassName('e-chart-root-container')[0]['style'].height = '100%';
        let gridHeight: string = this.element.getElementsByClassName('e-gridcontent')[0]['style'].height;
        var gridContent = this.element.getElementsByClassName('e-gridcontent')[0].childNodes[0] as HTMLElement;
        gridContent.setAttribute('tabindex', '0');
        var treeGridrole = this.element.getElementsByClassName('e-gridcontent')[0].childNodes[0].childNodes[0] as HTMLElement;
        treeGridrole.setAttribute('role', 'treegrid');
        let timelineContainer: number = this.element.getElementsByClassName('e-timeline-header-container')[0]['offsetHeight'];
        gridHeight = 'calc(100% - ' + timelineContainer + 'px)';
        // eslint-disable-next-line
        // this.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
        const scrollContainer = this.element.getElementsByClassName('e-chart-scroll-container e-content')[0];
        scrollContainer['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
        scrollContainer.setAttribute('tabindex', '0');
        if (!isNullOrUndefined(this.toolbarModule) && !isNullOrUndefined(this.toolbarModule.element)) {
            this.splitterElement.style.height = 'calc(100% - ' + this.toolbarModule.element.offsetHeight + 'px)';
        } else {
            this.splitterElement.style.height = '100%';
        }
        if (this.isLoad) {
            if (this.enablePersistence) {
                this.updateTreeColumns();
            }
            this.updateCurrentViewData();
            if (!this.enableVirtualization) {
                this.updateContentHeight();
            }
            if (!this.isTreeGridRendered) {
                this.isTreeGridRendered = true;
                let toolbarHeight: number = 0;
                if (!isNullOrUndefined(this.toolbarModule) && !isNullOrUndefined(this.toolbarModule.element)) {
                    toolbarHeight = this.toolbarModule.element.offsetHeight;
                }
                if (this.timelineModule.isSingleTier) {
                    addClass(this.treeGrid.element.querySelectorAll('.e-headercell'), cls.timelineSingleHeaderOuterDiv);
                    addClass(this.treeGrid.element.querySelectorAll('.e-columnheader'), cls.timelineSingleHeaderOuterDiv);
                } else {
                    removeClass(this.treeGrid.element.querySelectorAll('.e-headercell'), cls.timelineSingleHeaderOuterDiv);
                    removeClass(this.treeGrid.element.querySelectorAll('.e-columnheader'), cls.timelineSingleHeaderOuterDiv);
                }
                this.treeGrid.height = '100%';
                this.notify('tree-grid-created', {});
                this.createGanttPopUpElement();
                if (!isNullOrUndefined(this.loadingIndicator) && this.loadingIndicator.indicatorType === "Shimmer") {
                    this.hideMaskRow();
                } else {
                    this.hideSpinner();
                }
                setValue('isGanttCreated', true, args);
                this.renderComplete();
            }
        } else {
            this.getCurrentRecords(args);
        }
        if (!this.loadChildOnDemand && this.taskFields.hasChildMapping) {
            this.updateContentHeight();
        }
        if (this.enableCriticalPath && this.criticalPathModule) {
            this.criticalPathModule.showCriticalPath(this.enableCriticalPath);
        }
        this.notify('recordsUpdated', {});
        for (let i: number = 0; i<document.getElementsByClassName('e-timeline-header-table-container').length ; i++) {
            for (let j: number = 0; j<document.getElementsByClassName('e-timeline-header-table-container')[i as number].children[0].children[0].children.length; j++) {
                (<HTMLElement>document.getElementsByClassName('e-timeline-header-table-container')[i as number].children[0].children[0].children[j as number].children[0]).setAttribute('tabindex', '-1');
            }
        }
        let criticalModule: CriticalPath = this.criticalPathModule;
        if (this.enableCriticalPath && criticalModule && criticalModule.criticalPathCollection) {
            this.criticalPathModule.criticalConnectorLine(criticalModule.criticalPathCollection,criticalModule.detailPredecessorCollection,true, criticalModule.predecessorCollectionTaskIds);
        }
        this.initialChartRowElements = this.ganttChartModule.getChartRows();
        this.isLoad = false;
        if (!this.loadChildOnDemand && this.taskFields.hasChildMapping) {
           this.autoCalculateDateScheduling = true;
        }
        this.trigger('dataBound', args);
    }
    /**
     * @param {object} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private getCurrentRecords(args: object): void {
        if (this.predecessorModule && this.taskFields.dependency) {
            this.connectorLineModule.removePreviousConnectorLines(this.currentViewData);
        }
        this.updateCurrentViewData();
        if (!this.enableVirtualization) {
            this.updateContentHeight();
        }
        // this.chartRowsModule.refreshGanttRows();
        if (this.virtualScrollModule && this.enableVirtualization) {
            this.ganttChartModule.virtualRender.adjustTable();
            this.ganttChartModule.scrollObject.updateTopPosition();
        }
    }

    /**
     * Called internally, if any of the property value changed.
     *
     * @param {GanttModel} newProp - Defines the New GanttModel.
     * @param {GanttModel} oldProp - Defines the old GanttModel.
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public onPropertyChanged(newProp: GanttModel, oldProp: GanttModel): void {
        let isRefresh: boolean = false;
        // eslint-disable-next-line
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
            case 'allowSelection':
            case 'allowRowDragAndDrop':
            case 'allowFiltering':
            case 'showColumnMenu':
            case 'allowResizing':
            case 'allowReordering':
            case 'enableImmutableMode':
                this.treeGrid[prop as string] = this[prop as string];
                this.treeGrid.dataBind();
                break;
            case 'workWeek':
                this.dataOperation.getNonWorkingDayIndex();
                this.dataOperation.reUpdateGanttData();
                this.chartRowsModule.initiateTemplates();
                if (this.taskFields.dependency) {
                    this.predecessorModule.updatedRecordsDateByPredecessor();
                }
                this.chartRowsModule.refreshGanttRows();
                this.treeGrid.refreshColumns();
                this.timelineModule.refreshTimeline();
                break;
            case 'toolbar':
                this.notify('ui-toolbarupdate', { module: 'toolbar', properties: newProp });
                break;
            case 'columnMenuItems':
                this.treeGrid.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
                break;
            case 'eventMarkers':
            case 'highlightWeekends':
                this.notify('ui-update', { module: 'day-markers', properties: newProp });
                break;
            case 'sortSettings':
                this.treeGrid.sortSettings = getActualProperties(this.sortSettings);
                this.treeGrid.dataBind();
                break;
            case 'timelineSettings':
                this.timelineModule.refreshTimeline();
                break;
            case 'rowHeight':
            case 'taskbarHeight':
                this.treeGrid.rowHeight = this.rowHeight;
                this.treeGrid.dataBind();
                this.chartRowsModule.initiateTemplates();
                this.timelineModule.updateChartByNewTimeline();
                if (this.taskFields.dependency) {
                    this.ganttChartModule.reRenderConnectorLines();
                }
                break;
            case 'timezone':
                this.dataOperation.checkDataBinding(true);
                break;
            case 'enableCriticalPath':
                if (!isNullOrUndefined(this.loadingIndicator) && this.loadingIndicator.indicatorType === "Shimmer") {
                    this.hideMaskRow();
                } else {
                    this.hideSpinner();
                }
                if (this.enableCriticalPath && this.criticalPathModule) {
                    this.criticalPathModule.showCriticalPath(this.enableCriticalPath);
                    let criticalModule: CriticalPath = this.criticalPathModule;
                    if (criticalModule.criticalPathCollection) {
                       this.criticalPathModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true, criticalModule.predecessorCollectionTaskIds);
                    }
                 }
                 else {
                     this.removeCriticalPathStyles();
                 }
                 break;
            case 'filterSettings':
                this.treeGrid.filterSettings = getActualProperties(this.filterSettings) as TreeGridFilterSettingModel;
                this.treeGrid.dataBind();
                break;
            case 'gridLines':
                this.treeGrid.gridLines = this.gridLines;
                this.treeGrid.dataBind();
                this.renderChartGridLines();
                break;
            case 'tooltipSettings':
                if (this.tooltipModule.toolTipObj) {
                    this.tooltipModule.toolTipObj.destroy();
                }
                this.tooltipModule.createTooltip();
                break;
            case 'splitterSettings':
                this.splitterModule.updateSplitterPosition();
                break;
            case 'selectionSettings':
                this.treeGrid.selectionSettings = getActualProperties(this.selectionSettings);
                this.treeGrid.grid.selectionSettings.enableToggle = this.selectionSettings.enableToggle;
                this.treeGrid.dataBind();
                break;
            case 'searchSettings':
                if (newProp.searchSettings.key !== ("" || undefined)) {
                    this.treeGrid.grid.searchSettings = getActualProperties(this.searchSettings);
                    this.treeGrid.grid.dataBind();
                }
                this.treeGrid.searchSettings = getActualProperties(this.searchSettings);
                this.treeGrid.dataBind();
                if (this.toolbarModule) {
                    this.toolbarModule.updateSearchTextBox();
                }
                break;
            case 'labelSettings':
            case 'renderBaseline':
            case 'baselineColor':
                this.isFromRenderBaseline = true;
                this.chartRowsModule.initiateTemplates();
                this.chartRowsModule.refreshGanttRows();
                this.isFromRenderBaseline = false;
                break;
            case 'resourceIDMapping':
            case 'resourceNameMapping':
            case 'resources':
                this.dataOperation.reUpdateResources();
                this.treeGrid.refreshColumns();
                this.chartRowsModule.initiateTemplates();
                this.chartRowsModule.refreshGanttRows();
                break;
            case 'includeWeekend':
            case 'allowUnscheduledTasks':
            case 'holidays':
                this.isLoad=true;
                if (prop === 'holidays') {
                    this.totalHolidayDates = this.dataOperation.getHolidayDates();
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                }
                this.dataOperation.reUpdateGanttData();
                this.treeGrid.refreshColumns();
                this.chartRowsModule.initiateTemplates();
                this.chartRowsModule.refreshGanttRows();
                this.isLoad=false;
                break;
            case 'dayWorkingTime':
                this.isLoad=true;
                this.dataOperation.reUpdateGanttData();
                this.treeGrid.refreshColumns();
                this.chartRowsModule.initiateTemplates();
                this.chartRowsModule.refreshGanttRows();
                this.isLoad=false;
                break;                      
            case 'addDialogFields':
            case 'editDialogFields':
                if (this.editModule && this.editModule.dialogModule) {
                    this.editModule.dialogModule.processDialogFields();
                }
                break;
            case 'columns':
                this.treeGridModule.treeGridColumns = [];
                this.treeGridModule.validateGanttColumns();
                this.treeGrid.columns = this.treeGridModule.treeGridColumns;
                (this.treeGrid.grid.columns as any) = this.treeGridModule.treeGridColumns;
                this.chartRowsModule.initiateTemplates();
                this.timelineModule.updateChartByNewTimeline();
                break;
            case 'width':
            case 'height':
                this.reUpdateDimention();
                break;
            case 'editSettings':
                this.treeGrid.editSettings.allowAdding = this.editSettings.allowAdding;
                this.treeGrid.editSettings.allowDeleting = this.editSettings.allowDeleting;
                this.treeGrid.editSettings.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
                this.treeGrid.editSettings.allowEditing = this.editSettings.allowEditing;
                this.treeGrid.editSettings.allowNextRowEdit = this.editSettings.allowNextRowEdit;
                if (!isNullOrUndefined(this.editModule)) {
                    this.editModule.reUpdateEditModules();
                }
                if (!isNullOrUndefined(this.toolbarModule)) {
                    this.toolbarModule.refreshToolbarItems();
                }
                break;
            case 'connectorLineBackground':
            case 'connectorLineWidth':
                if (this.taskFields.dependency) {
                    this.connectorLineModule.initPublicProp();
                    this.ganttChartModule.reRenderConnectorLines();
                }
                break;
            case 'treeColumnIndex':
                this.treeGrid.treeColumnIndex = this.treeColumnIndex;
                break;
            case 'projectStartDate':
            case 'projectEndDate':
                this.timelineModule.isZoomToFit = false;
                this.dataOperation.calculateProjectDates();
                this.updateProjectDates(
                    this.cloneProjectStartDate, this.cloneProjectEndDate, this.isTimelineRoundOff);
                break;
            case 'selectedRowIndex':
                if (!isNullOrUndefined(this.selectionModule)) {
                    this.selectionModule.selectRowByIndex();
                }
                break;
            case 'dataSource':
                this.closeGanttActions();
                if (this.dataSource instanceof Object && isCountRequired(this)) {
                    // In order to bind the observable data at load time, hasChildMapping is necessary to be mapped.
                    this.treeGrid.hasChildMapping = 'isParent';
                    const count: number = getValue('count', this.dataSource);
                    this.treeGrid.dataSource = {result: this.flatData, count: count};
                } else {
                    this.treeGrid.hasChildMapping = null;
                }
                this.dataOperation.checkDataBinding(true);
                break;
            case 'enableContextMenu':
            case 'contextMenuItems':
                if (this.enableContextMenu || prop === 'contextMenuItems') {
                    this.notify('reRender-contextMenu', { module: 'contextMenu', enable: this.contextMenuItems });
                } else {
                    this.treeGrid.contextMenuItems = [];
                }
                this.treeGrid.dataBind();
                break;
            case 'currencyCode':
            case 'locale':
            case 'enableRtl':
            case 'readOnly':
            case 'viewType':
            case 'taskFields':
            case 'allowTaskbarDragAndDrop':
            case 'allowTaskbarOverlap':
            case 'allowParentDependency':
                if (prop === 'locale') {
                   this.isLocaleChanged = true;
                }
                if (prop === 'taskFields') {
                    if (!isNullOrUndefined(newProp.taskFields.child)) {
                        return;
                    }
                }
                if (prop !== 'allowTaskbarDragAndDrop') {
                   isRefresh = true;
                }
                break;
            case 'validateManualTasksOnLinking':
                this.validateManualTasksOnLinking = newProp.validateManualTasksOnLinking;
                break;
            case 'showOverAllocation':
                this.updateOverAllocationCotainer();
                break;
            }
        }
        if (isRefresh) {
            if (this.isLoad && this.contentMaskTable) {
                this.contentMaskTable = null
            }
            this.refresh();
        }
    }

    private updateOverAllocationCotainer(): void {
        if (this.showOverAllocation && this.viewType === 'ResourceView') {
            this.ganttChartModule.renderOverAllocationContainer();
        } else {
            const rangeContainer: HTMLElement = this.element.querySelector('.' + cls.rangeContainer);
            if (rangeContainer) {
                rangeContainer.innerHTML = '';
            }
        }
    }

    /**
     * Returns the properties to be maintained in persisted state.
     *
     * @returns {string} .
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex', 'treeColumnIndex', 'currentZoomingLevel', 'cloneProjectStartDate', 'cloneProjectEndDate'];
        const ignoreOnPersist: { [x: string]: string[] } = {
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        const ignoreOnColumn: string[] = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        for (let i: number = 0; i < keyEntity.length; i++) {
            const currentObject: Object = this[keyEntity[i as number]];
            for (let k: number = 0, val: string[] = ignoreOnPersist[keyEntity[i as number]]; (!isNullOrUndefined(val) && k < val.length); k++) {
                const objVal: string = val[k as number];
                delete currentObject[objVal as string];
            }
        }
        this.ignoreInArrays(ignoreOnColumn, <Column[]>this.columns);
        return this.addOnPersist(keyEntity);
    }
    private ignoreInArrays(ignoreOnColumn: string[], columns: Column[]): void {
        for (let i: number = 0; i < columns.length; i++) {
            this.ignoreInColumn(ignoreOnColumn, columns[i as number]);
        }
    }

    private ignoreInColumn(ignoreOnColumn: string[], column: Column): void {
        for (let i: number = 0; i < ignoreOnColumn.length; i++) {
            delete column[ignoreOnColumn[i as number]];
            column.filter = {};
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.notify('destroy', {});
        if (!isNullOrUndefined(this.validationDialogElement) && !this.validationDialogElement.isDestroyed) {
            this.validationDialogElement.destroy();
        }
        const modules: string[] = ['ganttChartModule', 'timelineModule', 'chartRowsModule',
            'treeGridModule', 'ganttDataUpdatesModule', 'dateValidationModule', 'tooltipModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[i as number]]) {
                this[modules[i as number]] = null;
            }
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if(this.editModule && this.editModule.dialogModule){

            this.editModule.dialogModule.destroy();
        }
        super.destroy();
        this.chartVerticalLineContainer = null;
        this.element.innerHTML = '';
        removeClass([this.element], cls.root);
        this.element.innerHTML = '';
        this.isTreeGridRendered = false;
        this.resetTemplates();
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        EventHandler.remove(window as any, 'resize', this.windowResize);
    }
    /**
     * Method to get taskbarHeight.
     *
     * @returns {number} .
     * @public
     */
    public getTaskbarHeight(): number {
        return this.chartRowsModule.taskBarHeight;
    }

    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} .
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.isDestroyed) { return modules; }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this]
            });
        }
        if (this.allowFiltering || (this.toolbar && this.toolbar.indexOf('Search') !== -1)) {
            modules.push({
                member: 'filter',
                args: [this]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'excelExport',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop || this.allowTaskbarDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.enableCriticalPath) {
            modules.push({
                member: 'criticalPath',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        if (this.toolbar && this.toolbar.length > 0) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowEditing || this.editSettings.allowDeleting
            || this.editSettings.allowTaskbarEditing || this.allowRowDragAndDrop) {
            modules.push({
                member: 'edit',
                args: [this]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this]
            });
        }
        if (this.tooltipSettings.showTooltip) {
            modules.push({
                member: 'tooltip',
                args: [this]
            });
        }
        if (this.highlightWeekends || (this.holidays && this.holidays.length > 0)
            || (this.eventMarkers && this.eventMarkers.length > 0)) {
            modules.push({
                member: 'dayMarkers',
                args: [this]
            });
        }
        if (this.enableContextMenu) {
            modules.push({
                member: 'contextMenu',
                args: [this]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'pdfExport',
                args: [this]
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualScroll',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * Sorts a column with the given options.
     *
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @returns {void} .
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        if (this.sortModule && this.allowSorting) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        }
    }

    private mergePersistGanttData(): void {
        if(!this.treeGrid) {
            this.treeGrid = new TreeGrid();
        }
        const persist1: string = 'mergePersistGridData';
        this.treeGrid.grid[persist1 as string].apply(this);
    }

    private mergeColumns(storedColumn: Column[], columns: Column[]): void {
        const persist2: string = 'mergeColumns';
        this.treeGrid.grid[persist2 as string].apply(this, [storedColumn, columns]);
    }
    /**
     * Clears all the sorted columns of the Gantt.
     *
     * @returns {void} .
     */
    public clearSorting(): void {
        this.sortModule.clearSorting();
    }

    /**
     * To validate and render chart horizontal and vertical lines in the Gantt
     *
     * @returns {void} .
     * @hidden
     */
    public renderChartGridLines(): void {
        const className: string = 'e-chart-row-border';
        const verticalLines: HTMLElement = this.chartVerticalLineContainer;
        const chartRowsTD: NodeListOf<HTMLTableDataCellElement> =
            document.getElementById(this.element.id + 'GanttTaskTableBody').querySelectorAll('td');
        if (this.gridLines === 'Vertical') {
            if (isNullOrUndefined(verticalLines)) {
                this.renderChartVerticalLines();
            } else {
                if (verticalLines.style.display === 'none') {
                    verticalLines.style.display = 'block';
                }
            }
            if (chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    removeClass([chartRowsTD[c as number]], className);
                }
            }
        } else if (this.gridLines === 'Horizontal') {
            if (!isNullOrUndefined(verticalLines)) {
                verticalLines.style.display = 'none';
            }
            if (!chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    addClass([chartRowsTD[c as number]], className);
                }
            }
        } else if (this.gridLines === 'Both') {
            if (isNullOrUndefined(verticalLines)) {
                this.renderChartVerticalLines();
            } else {
                if (verticalLines.style.display === 'none') {
                    verticalLines.style.display = 'block';
                }
            }
            if (!chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    addClass([chartRowsTD[c as number]], className);
                }
            }
        } else if (this.gridLines === 'None') {
            if (!isNullOrUndefined(verticalLines) && verticalLines.style.display !== 'none') {
                verticalLines.style.display = 'none';
            }
            if (chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    removeClass([chartRowsTD[c as number]], className);
                }
            }
        }
    }

    /**
     * To update height of the Grid lines in the Gantt chart side.
     *
     * @returns {void} .
     * @private
     */
    public updateGridLineContainerHeight(): void {
        if (this.chartVerticalLineContainer) {
            this.chartVerticalLineContainer.style.height = formatUnit(this.getContentHeight());
        }
    }

    /**
     * To get actual height of grid lines, holidays, weekend and event markers.
     *
     * @returns {number} .
     * @private
     */
    public getContentHeight(): number {
        const scrollHeight: number = this.ganttChartModule.scrollElement.offsetHeight - 16; //16 is horizontal scrollbar height
        const contentHeight: number = this.ganttChartModule.chartBodyContent.offsetHeight;
        const height: number = contentHeight < scrollHeight ? contentHeight : scrollHeight;
        return height;
    }

    /**
     * To update height of the Grid lines in the Gantt chart side.
     *
     * @returns {void} .
     * @private
     */
    public reUpdateDimention(): void {
        let toolbarHeight: number = 0;
        this.calculateDimensions();
        if (!isNullOrUndefined(this.toolbarModule) && !isNullOrUndefined(this.toolbarModule.element)) {
            this.toolbarModule.toolbar.refresh();
            this.toolbarModule.refreshToolbarItems();
            toolbarHeight = this.toolbarModule.element.offsetHeight;
        }
        this.treeGrid.height = this.ganttHeight - toolbarHeight -
            (this.treeGrid.grid.getHeaderContent() as HTMLElement).offsetHeight;
        this.splitterModule.splitterObject.height = (this.ganttHeight - toolbarHeight).toString();
        if (!isNullOrUndefined( this.chartVerticalLineContainer)) {
            this.chartVerticalLineContainer.style.height = this.ganttHeight + 'px';
        }
        if (!isNullOrUndefined(this.dayMarkersModule)) {
            const holidayContainer: HTMLElement = getValue('nonworkingDayRender.holidayContainer', this.dayMarkersModule);
            const weekendContainer: HTMLElement = getValue('nonworkingDayRender.weekendContainer', this.dayMarkersModule);
            const eventMarkersContainer: HTMLElement = getValue('eventMarkerRender.eventMarkersContainer', this.dayMarkersModule);
            if (holidayContainer) {
                holidayContainer.style.height = this.ganttHeight + 'px';
            }
            if (weekendContainer) {
                weekendContainer.style.height =  this.ganttHeight + 'px';
            }
            if (eventMarkersContainer) {
                eventMarkersContainer.style.height =  this.ganttHeight + 'px';
            }
        }
        this.splitterModule.splitterObject.width = this.ganttWidth.toString();
        this.ganttChartModule.scrollObject.
            setHeight(this.ganttHeight - this.ganttChartModule.chartTimelineContainer.offsetHeight - toolbarHeight);
    }

    /**
     * To render vertical lines in the Gantt chart side.
     *
     * @returns {void} .
     */
    private renderChartVerticalLines(): void {
        if (!this.element.contains(this.chartVerticalLineContainer)) {
            this.chartVerticalLineContainer = createElement('div', {
                id: this.element.id + 'line-container',
                styles: 'position:absolute;height:100%;'
            });
            this.ganttChartModule.chartBodyContent.insertBefore(this.chartVerticalLineContainer, this.ganttChartModule.chartBodyContent.lastChild);
        }
        this.chartVerticalLineContainer.innerHTML = '';
        let headerTable: Element = this.element.getElementsByClassName('e-timeline-header-table-container')[1];
        if (isNullOrUndefined(headerTable)) {
            headerTable = this.element.getElementsByClassName('e-timeline-header-table-container')[0];
        }
        const thElements: HTMLCollectionOf<HTMLTableHeaderCellElement> =
            headerTable.getElementsByTagName('th') as HTMLCollectionOf<HTMLTableHeaderCellElement>;
        const thLength: number = thElements.length;
        let thWidth: string;
        let leftPos: number = 0;
        const containerDiv: HTMLElement = createElement('div');
        for (let n: number = 0; n < thLength; n++) {
            leftPos = n === 0 ? -1 : (leftPos + parseFloat(thWidth));
            thWidth = (thElements[n as number] as HTMLElement).style.width;
            const divElement: HTMLElement = createElement('div', {
                className: 'e-line-container-cell',
                styles: (this.enableRtl?'right:' + (leftPos + 1) : 'left:' + leftPos) + 'px'
            });
            containerDiv.appendChild(divElement);
        }
        this.chartVerticalLineContainer.innerHTML = containerDiv.innerHTML;
    }

    /**
     * Method to get default localized text of the Gantt.
     *
     * @returns {void} .
     * @hidden
     */
    public getDefaultLocale(): Object {
        const ganttLocale: Object = {
            emptyRecord: 'No records to display',
            id: 'ID',
            name: 'Name',
            startDate: 'Start Date',
            endDate: 'End Date',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Dependency',
            notes: 'Notes',
            criticalPath: 'Critical Path',
            baselineStartDate: 'Baseline Start Date',
            baselineEndDate: 'Baseline End Date',
            taskMode: 'Task Mode',
            changeScheduleMode: 'Change Schedule Mode',
            subTasksStartDate: 'SubTasks Start Date',
            subTasksEndDate: 'SubTasks End Date',
            scheduleStartDate: 'Schedule Start Date',
            scheduleEndDate: 'Schedule End Date',
            auto: 'Auto',
            manual: 'Manual',
            type: 'Type',
            offset: 'Offset',
            resourceName: 'Resources',
            resourceID: 'Resource ID',
            day: 'day',
            hour: 'hour',
            minute: 'minute',
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            generalTab: 'General',
            customTab: 'Custom Columns',
            writeNotes: 'Write Notes',
            addDialogTitle: 'New Task',
            editDialogTitle: 'Task Information',
            add: 'Add',
            edit: 'Edit',
            update: 'Update',
            delete: 'Delete',
            cancel: 'Cancel',
            search: 'Search',
            task: ' task',
            tasks: ' tasks',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            zoomToFit: 'Zoom to fit',
            excelExport: 'Excel export',
            csvExport: 'CSV export',
            pdfExport: 'Pdf export',
            expandAll: 'Expand all',
            collapseAll: 'Collapse all',
            nextTimeSpan: 'Next timespan',
            prevTimeSpan: 'Previous timespan',
            saveButton: 'Save',
            taskBeforePredecessorFS: 'You moved "{0}" to start before "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessorFS: 'You moved "{0}" away from "{1}" and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessorSS: 'You moved "{0}" to start before "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessorSS: 'You moved "{0}" to start after "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessorFF: 'You moved "{0}" to finish before "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessorFF: 'You moved "{0}" to finish after "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessorSF: 'You moved "{0}" away from "{1}" to starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessorSF: 'You moved "{0}" to finish after "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            okText: 'Ok',
            confirmDelete: 'Are you sure you want to Delete Record?',
            from: 'From',
            to: 'To',
            taskLink: 'Task Link',
            lag: 'Lag',
            start: 'Start',
            finish: 'Finish',
            enterValue: 'Enter the value',
            taskInformation: 'Task Information',
            deleteTask: 'Delete Task',
            deleteDependency: 'Delete Dependency',
            convert: 'Convert',
            save: 'Save',
            above: 'Above',
            below: 'Below',
            child: 'Child',
            milestone: 'Milestone',
            toTask: 'To Task',
            toMilestone: 'To Milestone',
            eventMarkers: 'Event markers',
            leftTaskLabel: 'Left task label',
            rightTaskLabel: 'Right task label',
            timelineCell: 'Timeline cell',
            confirmPredecessorDelete: 'Are you sure you want to remove dependency link?',
            unit: 'Unit',
            work: 'Work',
            taskType: 'Task Type',
            unassignedTask: 'Unassigned Task',
            group: 'Group',
            indent: 'Indent',
            outdent: 'Outdent',
            segments: 'Segments',
            splitTask: 'Split Task',
            mergeTask: 'Merge Task',
            left: 'Left',
            right: 'Right'
        };
        return ganttLocale;
    }
    /**
     * To remove sorted records of particular column.
     *
     * @param {string} columnName - Defines the sorted column name.
     * @returns {void} .
     */
    public removeSortColumn(columnName: string): void {
        this.sortModule.removeSortColumn(columnName);
    }
    /**
     *
     * @param {object} args -Defines the edited event args.
     * @returns {void} .
     * @private
     */
    public actionBeginTask(args: object): boolean | void {
        this.trigger('actionBegin', args);
        if (!isNullOrUndefined(this.loadingIndicator) &&  this.loadingIndicator.indicatorType === "Shimmer") {
            this.showMaskRow();
        } else {
            this.showSpinner();
        }
    }

    /**
     * To move horizontal scroll bar of Gantt to specific date.
     *
     * @param  {string} date - Defines the task date of data.
     * @returns {void} .
     */
    public scrollToDate(date: string): void {
        const tempDate: Date = this.dateValidationModule.getDateFromFormat(date);
        const left: number = this.dataOperation.getTaskLeft(tempDate, false);
        this.ganttChartModule.updateScrollLeft(left);

    }
    /**
     * To move horizontal scroll bar of Gantt to specific task id.
     *
     * @param  {string} taskId - Defines the task id of data.
     * @returns {void} .
     */
    public scrollToTask(taskId: string): void {
        if (this.ids.indexOf(taskId) !== -1) {
            const left: number = this.flatData[this.ids.indexOf(taskId)].ganttProperties.left;
            this.ganttChartModule.updateScrollLeft(left);
        }
    }
    /**
     * To set scroll left and top in chart side.
     *
     * @param  {number} left - Defines the scroll left value of chart side.
     * @param  {number} top - Defines the scroll top value of chart side.
     * @returns {void} .
     */
    public updateChartScrollOffset(left: number, top: number): void {
        if (!isNullOrUndefined(left)) {
            left = this.ganttChartModule.scrollElement.scrollWidth <= left ?
                this.ganttChartModule.scrollElement.scrollWidth : left;
            this.ganttChartModule.scrollObject.setScrollLeft(left, this.enableRtl? -1: 0);
        }
        if (!isNullOrUndefined(top)) {
            top = this.ganttChartModule.scrollElement.scrollHeight <= top ? this.ganttChartModule.scrollElement.scrollHeight : top;
            this.ganttChartModule.scrollObject.setScrollTop(top);
        }
    }
    /**
     * Get parent task by clone parent item.
     *
     * @param {IParent} cloneParent - Defines the clone parent item.
     * @returns {IGanttData} .
     * @hidden
     */
    public getParentTask(cloneParent: IParent): IGanttData {
        if (!isNullOrUndefined(cloneParent)) {
            const parent: IGanttData[] = this.flatData.filter((val: IGanttData) => {
                return cloneParent.uniqueID === val.uniqueID;
            });
            if (parent.length > 0) {
                return parent[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Get parent task by clone parent item.
     *
     * @param {IGanttData} ganttRecord -Defines the Gantt record.
     * @param {number} level -Defines the selected record level.
     * @returns {IGanttData} .
     * @hidden
     */
    public getRootParent(ganttRecord: IGanttData, level: number): IGanttData {
        if (ganttRecord.level === level) {
            return ganttRecord;
        }
        return this.getRootParent(this.getParentTask(ganttRecord.parentItem), level);
    }
    /**
     * Filters TreeGrid row by column name with the given options.
     *
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean | number[] | string[] | Date[] | boolean[]} filterValue - Defines the value
     *  used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match.if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @returns {void} .
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean | number[] | string[] | Date[] | boolean[],
        predicate?: string, matchCase?: boolean, ignoreAccent?: boolean): void {
        this.treeGrid.filterByColumn(
            fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent
        );
    }

    /**
     * Export Gantt data to Excel file(.xlsx).
     *
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Gantt.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} .
     */
    public excelExport(
        excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
        /* eslint-disable-next-line */
        workbook?: any, isBlob?: boolean): Promise<any> {
        return this.excelExportModule ? this.treeGrid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob) : null;
    }

    /**
     * Export Gantt data to CSV file.
     *
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Gantt.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} .
     */
    public csvExport(
        excelExportProperties?: ExcelExportProperties,
        /* eslint-disable-next-line */
        isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any> {
        return this.excelExportModule ? this.treeGrid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob) : null;
    }
    /**
     * Export Gantt data to PDF document.
     *
     * @param  {PdfExportProperties} pdfExportProperties - Defines the export properties of the Gantt.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If the 'isBlob' parameter is set to true, the method returns PDF data as a blob instead of exporting it as a down-loadable PDF file. The default value is false.  
     * @returns {Promise<any>} .
     */
    public pdfExport(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        if (pdfExportProperties && pdfExportProperties.fitToWidthSettings && pdfExportProperties.fitToWidthSettings.isFitToWidth) {
            pdfExportProperties.pageOrientation == 'Landscape';
        }
        return this.pdfExportModule ? this.pdfExportModule.export(pdfExportProperties, isMultipleExport, pdfDoc, isBlob)
            : null;
    }
    /**
     * Clears the filtered columns in Gantt.
     *
     * Can also be used to clear filtering of a specific column in Gantt.
     *
     * @param {string[]} fields - Defines the specific column to remove filter.
     * @returns {void} .
     */
    public clearFiltering(fields?: string[]): void {
        this.treeGrid.grid.clearFiltering(fields);
    }
    /**
     * Removes filtered column by field name.
     *
     * @param  {string} field - Defines column field name to remove filter.
     * @returns {void} .
     * @hidden
     */
    public removeFilteredColsByField(field: string): void {
        this.treeGrid.removeFilteredColsByField(field, false);
    }
    /**
     * Method to set holidays and non working days in date time and date picker controls
     *
     * @param {RenderDayCellEventArgs} args .
     * @returns {void} .
     * @private
     */
    public renderWorkingDayCell(args: RenderDayCellEventArgs): void {
        const includeWeekend: boolean = this.taskMode !== 'Auto' ? true : (this.includeWeekend || !this.autoCalculateDateScheduling) ? true : false;
        const nonWorkingDays: number[] = !includeWeekend ? this.nonWorkingDayIndex : [];
        const holidays: number[] = this.totalHolidayDates;
        if (nonWorkingDays.length > 0 && nonWorkingDays.indexOf(args.date.getDay()) !== -1) {
            args.isDisabled = true;
        } else if (holidays.length > 0) {
            const tempDate: Date = new Date(args.date.getTime());
            tempDate.setHours(0, 0, 0);
            if (holidays.indexOf(tempDate.getTime()) !== -1) {
                if (!this.autoCalculateDateScheduling) {
                    args.isDisabled = false;
                } else {
                    args.isDisabled = true;
                }
            }
        }
    }
    /**
     * To update timeline at start point with one unit.
     *
     * @param {string} mode - Render previous span of Timeline.
     * @returns {void} .
     * @public
     */
    public previousTimeSpan(mode?: string): void {
        this.timelineModule.performTimeSpanAction(
            'prevTimeSpan', 'publicMethod',
            new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }
    /**
     * To update timeline at end point with one unit.
     *
     * @param {string} mode - Render next span of Timeline.
     * @returns {void} .
     * @public
     */
    public nextTimeSpan(mode?: string): void {
        this.timelineModule.performTimeSpanAction(
            'nextTimeSpan', 'publicMethod',
            new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }

    /**
     * To validate project start date and end date.
     *
     * @param  {Date} startDate - Defines start date of project.
     * @param  {Date} endDate - Defines end date of project.
     * @param  {boolean} isTimelineRoundOff - Defines project start date and end date need to be round off or not.
     * @param {string} isFrom .
     * @returns {void} .
     * @public
     */
    public updateProjectDates(startDate: Date, endDate: Date, isTimelineRoundOff: boolean, isFrom?: string): void {
        this.timelineModule.totalTimelineWidth = 0;
        this.cloneProjectStartDate = startDate;
        this.cloneProjectEndDate = endDate;
        this.isTimelineRoundOff = isTimelineRoundOff;
        this.timelineModule.refreshTimelineByTimeSpan();
        this.dataOperation.reUpdateGanttDataPosition();
        if (!this.pdfExportModule || (this.pdfExportModule && !this.pdfExportModule.isPdfExport) || (this.pdfExportModule && this.pdfExportModule.isPdfExport && this.pdfExportModule.helper.exportProps &&
            this.pdfExportModule.helper.exportProps.fitToWidthSettings && !this.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth)) {
            this.timelineModule.updateChartByNewTimeline();
            this.ganttChartModule.chartBodyContent.style.width = formatUnit(this.timelineModule.totalTimelineWidth);
            this.ganttChartModule.updateLastRowBottomWidth();

            if (this.taskFields.dependency) {
                this.ganttChartModule.reRenderConnectorLines();
            }
            if (isFrom !== 'beforeAdd') {
                this.notify('selectRowByIndex', {});
            }
        }
    }

    /**
     * Split the taskbar into segment by the given date
     *
     * @param  {string} taskId - Defines the id of a task to be split.
     * @param  {string} splitDate - Defines in which date the taskbar must be split up.
     * @returns {void} .
     * @public
     */

    public splitTask(taskId: number | string, splitDate: Date | Date[]): void {
        this.isEdit = true;
        this.chartRowsModule.splitTask(taskId, splitDate);
    }

    /**
     * merge the split taskbar with the given segment indexes.
     *
     * @param  {string} taskId - Defines the id of a task to be split.
     * @param  {string} segmentIndexes - Defines the object array of indexes which must be merged.
     * @returns {void} .
     * @public
     */
    public mergeTask(taskId: number | string, segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[]): void {
        this.chartRowsModule.mergeTask(taskId, segmentIndexes);
    }

    /**
     * Changes the TreeGrid column positions by field names.
     *
     * @param  {string} fromFName - Defines origin field name.
     * @param  {string} toFName - Defines destination field name.
     * @returns {void} .
     * @public
     */
    public reorderColumns(fromFName: string | string[], toFName: string): void {
        this.treeGrid.reorderColumns(fromFName, toFName);
    }
    /**
     * Method to clear edited collections in gantt set edit flag value
     *
     * @param {boolean} isStart -Defines whether to initiate edit action.
     * @returns {void} .
     * @private
     */
    public initiateEditAction(isStart: boolean): void {
        this.isOnEdit = isStart;
        this.previousRecords = {};
        this.editedRecords = [];
    }
    /**
     *
     * @param {string} field Method to update value in Gantt record and make clone record for this
     * @param {IGanttData | ITaskData} record .
     * @param {boolean} isTaskData .
     * @returns {void} .
     * @private
     */
    /* eslint-disable-next-line */
    public setRecordValue(field: string, value: any, record: IGanttData | ITaskData, isTaskData?: boolean): void {
        value = isUndefined(value) ? null : value;
        if (this.isOnEdit || this.isOnDelete) {
            this.makeCloneData(field, record, isTaskData);
            const ganttData: ITaskData = isTaskData ? (record as ITaskData) : (record as IGanttData).ganttProperties;
            const id: string  = ganttData.rowUniqueID;
            const task: IGanttData = this.getRecordByID(id);
            let isValid: boolean = false;
            if (isNullOrUndefined(value) || (!isNullOrUndefined(value) && !isNullOrUndefined(record[`${field}`]) && (value instanceof Date ? value.getTime() !==
               record[`${field}`].getTime() : record[`${field}`] !== value))) {
                isValid = true;
            }
            if (task && ((this.editedRecords.indexOf(task) === -1 && isValid) || this.editedRecords.length === 0)) {
                if (this.editModule['draggedRecord'] && this.editModule['draggedRecord'].ganttProperties.taskId === ganttData.taskId) {
                    this.editedRecords.splice(0, 0, task);
                }
                else {
                    this.editedRecords.push(task);
                }
                if (this.enableImmutableMode) {
                    this.modifiedRecords.push(task);
                }
            }
        }
        setValue(field, value, record);
    }
    private makeCloneData(field: string, record: IGanttData | ITaskData, isTaskData?: boolean): void {
        let cloneData: IGanttData;
        /* eslint-disable-next-line */
        const value: any = getValue(field, record);
        /* eslint-disable-next-line */
        let prevValue: any;
        /* eslint-disable-next-line */
        let clonedValue: any;
        if (isTaskData) {
            field = 'ganttProperties.' + field;
        }
        if (isNullOrUndefined(this.previousRecords[record.uniqueID])) {
            const tempData: IGanttData = {} as IGanttData;
            this.previousRecords[record.uniqueID] = tempData;
        }
        /* eslint-disable-next-line */
        cloneData = this.previousRecords[record.uniqueID];
        /* eslint-disable-next-line */
        prevValue = getValue(field, cloneData);
        if (isUndefined(prevValue)) {
            if (value instanceof Date) {
                clonedValue = new Date(value.getTime());
            } else if (isObjectArray(value)) {
                clonedValue = extend([], value, [], true);
            } else if (isObject(value)) {
                clonedValue = extend({}, {}, value, true);
            } else {
                clonedValue = value;
            }
            if (!isUndefined(clonedValue)) {
                setValue(field, clonedValue, cloneData);
            } else {
                setValue(field, null, cloneData);
            }
        }
    }
    private closeGanttActions(): void {
        if (this.editModule) {
            if (this.editModule.cellEditModule && this.editModule.cellEditModule.isCellEdit) {
                this.treeGrid.closeEdit();
                this.editModule.cellEditModule.isCellEdit = false;
                if (!isNullOrUndefined(this.toolbarModule)) {
                    this.toolbarModule.refreshToolbarItems();
                }
            } else if (this.editModule.dialogModule && this.editModule.dialogModule.dialogObj &&
                this.editModule.dialogModule.dialogObj.visible) {
                this.editModule.dialogModule.dialogObj.hide();
                this.editModule.dialogModule.dialogClose();
            }
        }
    }
    /**
     * Method to get task by uniqueId value.
     *
     * @param {string} id - Defines the task id.
     * @returns {IGanttData} .
     * @isGenericType true
     */
    public getTaskByUniqueID(id: string): IGanttData {
        const value: IGanttData[] = this.flatData.filter((val: IGanttData) => {
            return val.uniqueID === id;
        });
        if (value.length > 0) {
            return value[0];
        } else {
            return null;
        }
    }
    /**
     * Method to get record by id value.
     *
     * @param {string} id - Defines the id of record.
     * @returns {IGanttData} .
     * @isGenericType true
     */
    public getRecordByID(id: string): IGanttData {
        if (isNullOrUndefined(id)) {
            return null;
        }
        return this.flatData[this.ids.indexOf(id.toString())];
    }
    /**
     * Method to set splitter position.
     *
     * @param {string|number} value - Define value to splitter settings property.
     * @param {string} type - Defines name of internal splitter settings property.
     * @returns {void} .
     */
    public setSplitterPosition(value: string | number, type: string): void {
        const tempSplitterSettings: Object = {};
        tempSplitterSettings[type as string] = value;
        const splitterPosition: string = this.splitterModule.calculateSplitterPosition(
            tempSplitterSettings);
        const pane1: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[0] as HTMLElement;
        const pane2: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[1] as HTMLElement;
        this.splitterModule.splitterPreviousPositionGrid = pane1.scrollWidth + 1 + 'px';
        this.splitterModule.splitterPreviousPositionChart = pane2.scrollWidth + 1 + 'px';
        this.splitterModule.splitterObject.paneSettings[0].size = splitterPosition;
        this.splitterModule.splitterObject.paneSettings[1].size = (parseFloat('99.75%') - parseFloat(splitterPosition)) + '%';
        this.splitterModule.triggerCustomResizedEvent();
    }
    /**
     * Expand the records by index value.
     *
     * @param {number[] | number} index - Defines the index of rows to be expand.
     * @returns {void} .
     * @public
     */
    public expandByIndex(index: number[] | number): void {
        if (typeof index === 'number') {
            const args: object = this.contructExpandCollapseArgs(null, index);
            this.ganttChartModule.isExpandCollapseFromChart = true;
            this.ganttChartModule.expandGanttRow(args);
        } else {
            for (let i: number = 0; i < index.length; i++) {
                if (typeof index[i as number] === 'number') {
                    const ind: number = index[i as number];
                    const args: object = this.contructExpandCollapseArgs(null, ind);
                    this.ganttChartModule.isExpandCollapseFromChart = true;
                    this.ganttChartModule.expandGanttRow(args);
                }
            }
        }
    }
    /**
     * Expand the record by task id.
     *
     * @param {number} id - Defines the id of task.
     * @returns {void} .
     * @public
     */
    public expandByID(id: number | string): void {
        const args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Collapse the record by index value.
     *
     * @param {number} index - Defines the index of row.
     * @returns {void} .
     * @public
     */
    public collapseByIndex(index: number): void {
        const args: object = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }
    /**
     * Collapse the record by id value.
     *
     * @param {number} id - Defines the id of task.
     * @returns {void} .
     * @public
     */
    public collapseByID(id: number | string): void {
        const args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }

    /**
     * Method to add record.
     *
     * @param {Object[] | IGanttData | Object} data - Defines record to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @returns {void} .
     * @public
     */
    public addRecord(data?: Object[] | IGanttData | Object, rowPosition?: RowPosition, rowIndex?: number): void {
        if (this.editModule && this.editSettings.allowAdding) {
            if (this.viewType === 'ResourceView') {
                this.editModule.addRowPosition = rowPosition;
                this.editModule.addRowIndex = rowIndex;
                let resources: Object[];
                if (!isNullOrUndefined(data)) {
                     resources = data[this.taskFields.resourceInfo];
                }
                let id: string;
                let parentTask: IGanttData;
                if (!isNullOrUndefined(resources) && resources.length) {
                    for (let i: number = 0; i < resources.length; i++) {
                        id = (typeof resources[i as number] === 'object') ? resources[i as number][this.resourceFields.id] :
                            resources[0];
                        parentTask = this.flatData[this.getTaskIds().indexOf('R' + id)];
                        if (parentTask) {
                            break;
                        }
                    }
                    if (parentTask && parentTask.childRecords.length || parentTask.level === 0) {
                        const dropChildRecord: IGanttData = parentTask.childRecords[rowIndex as number];
                        if (dropChildRecord) {
                            const position: RowPosition = rowPosition === 'Above' || rowPosition === 'Below' ? rowPosition :
                                'Child';
                            if (position === 'Child') {
                                this.editModule.addRecord(data, position, this.getTaskIds().indexOf('R' + id));
                            } else {
                                this.editModule.addRecord(data, position, this.flatData.indexOf(dropChildRecord));
                            }
                        } else {
                            this.editModule.addRecord(data, 'Child', this.getTaskIds().indexOf('R' + id));
                        }
                    } else {
                        this.editModule.addRecord(data, 'Bottom');
                    }
                } else {
                    this.editModule.addRecord(data, 'Bottom');
                }
                this.editModule.addRowPosition = null;
                this.editModule.addRowIndex = null;
            } else {
                this.editModule.addRecord(data, rowPosition, rowIndex);
                if (rowPosition === 'Bottom') {
                    this.selectedRowIndex = rowIndex;
                }
                if (rowPosition === 'Above' || rowPosition === 'Below' || rowPosition === 'Child') {
                    this.currentSelection = !isNullOrUndefined(data) ? data : this.currentSelection;
                }
            }
        }
    }

    /**
     * Method to update record by ID.
     *
     * @param  {Object} data - Defines the data to modify.
     * @returns {void} .
     * @public
     * > In order to update the custom columns using `updateRecordByID`, it is necessary to define the respective fieldName in the column settings.
     */
    public updateRecordByID(data: Object): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.updateRecordByID(data);
        }
    }
    /**
     * To update existing taskId with new unique Id.
     *
     * @param {number | string} currentId - Defines the current Id of the record.
     * @param {number | string} newId - Defines the new Id of the record.
     * @returns {void} .
     */
    public updateTaskId(currentId: number | string, newId: number | string): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.updateTaskId(currentId, newId);
        }
    }
    /**
     * Public method to expand particular level of rows.
     *
     * @returns {void} .
     * @param {number} level .
     * @private
     */
    public expandAtLevel(level: number): void {
        if(this.enableVirtualization) {
            this.isExpandCollapseLevelMethod = true;
        }
        this.ganttChartModule.expandAtLevel(level);
    }
    /**
     * To indent the level of selected task to the hierarchical Gantt task.
     *
     * @returns {void} .
     * @public
     */
    public indent(): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.indent();
        }
    }
    /**
     * To outdent the level of selected task from the hierarchical Gantt task.
     *
     * @returns {void} .
     * @public
     */
    public outdent(): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.outdent();
        }
    }
    /**
     * To render the critical path tasks in Gantt.
     *
     * @returns {void} .
     * @param {boolean} isCritical- whether to render critical path or not .
     * @public
     */
     private showCriticalPath(isCritical: boolean): void {
        if (this.criticalPathModule) {
            this.criticalPathModule.showCriticalPath(isCritical);
            let criticalModule : CriticalPath = this.criticalPathModule;
            this.criticalPathModule.criticalConnectorLine(criticalModule.criticalPathCollection,criticalModule.detailPredecessorCollection,true,criticalModule.predecessorCollectionTaskIds);
        }
    }
    /**
     * To get all the critical tasks in Gantt.
     *
     * @returns {IGanttData[]} .
     * @public
     */
     public getCriticalTasks(): IGanttData[] {
        if (!isNullOrUndefined(this.criticalPathModule) && this.enableCriticalPath) {
            return this.criticalPathModule.getCriticalTasks();
        }
        else {
            return null
        }
    }
    /**
     * To perform Zoom in action on Gantt timeline.
     *
     * @returns {void} .
     * @public
     */
    public zoomIn(): void {
        this.timelineModule.processZooming(true);
    }
    /**
     * To perform zoom out action on Gantt timeline.
     *
     * @returns {void} .
     * @public
     */
    public zoomOut(): void {
        this.timelineModule.processZooming(false);
    }
    /**
     * To show all project task in available chart width
     *
     * @returns {void} .
     * @public
     */
    public fitToProject(): void {
        this.timelineModule.processZoomToFit();
        this.ganttChartModule.updateScrollLeft(0);
    }
    /**
     * Reorder the rows based on given indexes and position
     *
     * @param {number[]} fromIndexes - Defines the Dragged record index.
     * @param {number} toIndex - Defines the Dropped record index.
     * @param {string} position -Defines the position of the dropped row.
     * @returns {void} .
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
    }
    /**
     * Method to update record by Index.
     *
     * @param  {number} index - Defines the index of data to modify.
     * @param  {object} data - Defines the data to modify.
     * @returns {void} .
     * @public
     */
    public updateRecordByIndex(index: number, data: Object): void {
        if (this.editModule && this.editSettings.allowEditing) {
            const tasks: TaskFieldsModel = this.taskFields;
            const record: IGanttData = this.updatedRecords.length > 0 ?
                !isNullOrUndefined(this.updatedRecords[index as number]) ? this.updatedRecords[index as number] : null : null;
            if (!isNullOrUndefined(record)) {
                data[tasks.id] = record[tasks.id];
                this.editModule.updateRecordByID(data);
            }
        }
    }

    /**
     * To add dependency for Task.
     *
     * @param  {number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to add.
     * @returns {void} .
     * @public
     */
    public addPredecessor(id: number | string, predecessorString: string): void {
        const ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord) && this.editSettings.allowTaskbarEditing) {
            this.connectorLineEditModule.addPredecessor(ganttRecord, predecessorString);
        }
    }
    /**
     * To remove dependency from task.
     *
     * @param  {number} id - Defines the ID of task to modify.
     * @returns {void} .
     * @public
     */
    public removePredecessor(id: number | string): void {
        const ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord) && this.editSettings.allowTaskbarEditing) {
            this.connectorLineEditModule.removePredecessor(ganttRecord);
        }
    }
    /**
     * To modify current dependency values of Task by task id.
     *
     * @param  {number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to update.
     * @returns {void} .
     * @public
     */
    public updatePredecessor(id: number | string, predecessorString: string): void {
        const ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord) && this.editSettings.allowTaskbarEditing) {
            this.connectorLineEditModule.updatePredecessor(ganttRecord, predecessorString);
        }
    }

    /**
     * Method to open Add dialog.
     *
     * @returns {void} .
     * @public
     */
    public openAddDialog(): void {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowAdding) {
            this.editModule.dialogModule.openAddDialog();
        }
    }

    /**
     * Method to open Edit dialog.
     *
     * @param {number } taskId - Defines the id of task.
     * @returns {void} .
     * @public
     */
    public openEditDialog(taskId?: number | string): void {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowEditing) {
            this.editModule.dialogModule.openEditDialog(taskId);
        }
    }

    /**
     * Changes the TreeGrid column positions by field names.
     *
     * @param {string | number} id .
     * @param {number} index .
     * @returns {void} .
     * @private
     */
    private contructExpandCollapseArgs(id: string | number, index?: number): object {
        let chartRow: Element;
        let record: IGanttData;
        let rowIndex: number;
        if (isNullOrUndefined(index)) {
            record = this.getRecordByID(id.toString());
            chartRow = this.getRowByID(id);
            if (!isNullOrUndefined(chartRow)) {
                rowIndex = getValue('rowIndex', chartRow);
            }
        } else if (!isNullOrUndefined(index)) {
            chartRow = this.getRowByIndex(index);
            rowIndex = getValue('rowIndex', chartRow);
            record = this.currentViewData[rowIndex as number];
        }
        const gridRow: Node = this.treeGrid.getRows()[rowIndex as number];
        return { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
    }

    /**
     * Method to get chart row value by index.
     *
     * @param {number} index - Defines the index of row.
     * @returns {HTMLElement} .
     */
    public getRowByIndex(index: number): HTMLElement {
        try {
            const gridRows: NodeList = this.element.querySelectorAll('.e-chart-row');
            if (!isNullOrUndefined(index)) {
                return gridRows[index as number] as HTMLElement;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
    /**
     * Method to get the row element by task id.
     *
     * @param {string | number} id - Defines the id of task.
     * @returns {HTMLElement} .
     */
    public getRowByID(id: string | number): HTMLElement {
        const record: IGanttData = this.getRecordByID(id.toString());
        let index: number;
        if (!this.loadChildOnDemand && this.taskFields.hasChildMapping) {
            index = this.updatedRecords.map(item => item[this.taskFields.id]).indexOf(record.ganttProperties.taskId);
        }
        else {
            index = this.updatedRecords.indexOf(record);
        }
        if (index !== -1) {
            return this.getRowByIndex(index);
        } else {
            return null;
        }
    }
    /**
     * Method to get class name for unscheduled tasks
     *
     * @param {ITaskData} ganttProp .
     * @returns {string} .
     * @private
     */
    public getUnscheduledTaskClass(ganttProp: ITaskData): string {
        if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.endDate) &&
            isNullOrUndefined(ganttProp.duration)) {
            return ' ' + cls.traceUnscheduledTask;
        } else if (isNullOrUndefined(ganttProp.startDate) || isNullOrUndefined(ganttProp.endDate) ||
            isNullOrUndefined(ganttProp.duration)) {
            return ' ' + cls.traceUnscheduledTask;
        } else {
            return '';
        }
    }
    /**
     * Method to get class name for unscheduled tasks
     *
     * @param {ITaskData} ganttProp -Defines the Gantt propertie.
     * @returns {boolean} .
     * @private
     */
    public isUnscheduledTask(ganttProp: ITaskData): boolean {
        if (isNullOrUndefined(ganttProp.startDate) || isNullOrUndefined(ganttProp.endDate) ||
            isNullOrUndefined(ganttProp.duration)) {
            return true;
        } else {
            return false;
        }
    }
    private createGanttPopUpElement(): void {
        const popup: Element = this.createElement('div', { className: 'e-ganttpopup', styles: 'display:none;' });
        const content: Element = this.createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        document.getElementById(this.element.id + 'GanttChart').appendChild(popup);
    }
    /**
     * Method to get predecessor value as string.
     *
     * @param {string} type .
     * @returns {HTMLElement} .
     * @private
     */
    public getPredecessorTextValue(type: string): string {
        let textValue: string;
        switch (type) {
        case 'SS':
            textValue = this.localeObj.getConstant('start') + '-' + this.localeObj.getConstant('start');
            break;
        case 'FF':
            textValue = this.localeObj.getConstant('finish') + '-' + this.localeObj.getConstant('finish');
            break;
        case 'SF':
            textValue = this.localeObj.getConstant('start') + '-' + this.localeObj.getConstant('finish');
            break;
        case 'FS':
            textValue = this.localeObj.getConstant('finish') + '-' + this.localeObj.getConstant('start');
            break;
        }
        return textValue;
    }
    /**
     * Method to perform search action in Gantt.
     *
     * @param {string} keyVal - Defines key value to search.
     * @returns {void} .
     */
    public search(keyVal: string): void {
        if (this.filterModule) {
            this.searchSettings.key = keyVal;
            this.dataBind();
        }
    }

    /**
     * Method to get offset rect value
     *
     * @param {HTMLElement} element .
     * @returns {number} .
     * @hidden
     */
    public getOffsetRect(element: HTMLElement): { top: number, left: number, width?: number, height?: number } {
        const box: ClientRect = element.getBoundingClientRect();
        const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
            || document.body.scrollTop;
        const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft ||
            document.body.scrollLeft;
        const clientTop: number = document.documentElement.clientTop || document.body.clientTop || 0;
        const clientLeft: number = document.documentElement.clientLeft || document.body.clientLeft || 0;
        const top: number = box.top + scrollTop - clientTop;
        const left: number = this.enableRtl ? box.right + scrollLeft - clientLeft : box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left), width: box.width, height: box.height };
    }

    /**
     * Method to expand all the rows of Gantt.
     *
     * @returns {void} .
     * @public
     */
    public expandAll(): void {
        this.ganttChartModule.expandCollapseAll('expand');
    }
    /**
     * Method to update data source.
     *
     * @returns {void} .
     * @param {object[]} dataSource - Defines a collection of data.
     * @param {object} args - Defines the projectStartDate and projectEndDate values.
     * @public
     */
    public updateDataSource(dataSource: Object[], args: object): void {
        this.isDynamicData = true;
        if (!isNullOrUndefined(args)) {
            for (let prop of Object.keys(args)) { // eslint-disable-line
                switch (prop) {
                case 'projectStartDate':
                    this.setProperties({ projectStartDate: args[prop as string] }, true);
                    break;
                case 'projectEndDate':
                    this.setProperties({ projectEndDate: args[prop as string] }, true);
                    break;
                }
            }
        }
        this.dataSource = dataSource;
    }

    /**
     * Method to collapse all the rows of Gantt.
     *
     * @returns {void} .
     * @public
     */
    public collapseAll(): void {
        this.ganttChartModule.expandCollapseAll('collapse');
    }

    /**
     * Gets the columns from the TreeGrid.
     *
     * @returns {Column[]} .
     * @public
     */
    public getGridColumns(): Column[] {
        return this.treeGrid.getColumns();
    }

    /**
     * Method to column from given column collection based on field value
     *
     * @param {string} field .
     * @param {ColumnModel[]} columns .
     * @returns {ColumnModel} .
     * @private
     */
    public getColumnByField(field: string, columns: ColumnModel[]): ColumnModel {
        const column: ColumnModel[] = columns.filter((value: ColumnModel) => {
            return value.field === field;
        });
        return column.length > 0 ? column[0] : null;
    }

    /**
     * Gets the Gantt columns.
     *
     * @returns {ColumnModel[]} .
     * @public
     */
    public getGanttColumns(): ColumnModel[] {
        return this.ganttColumns;
    }

    /**
     * Shows a column by its column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @returns {void} .
     * @public
     */
    public showColumn(keys: string | string[], showBy?: string): void {
        this.treeGrid.showColumns(keys, showBy);
        this.updateTreeColumns()
    }

    /**
     * Hides a column by column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @returns {void} .
     * @public
     */
    public hideColumn(keys: string | string[], hideBy?: string): void {
        this.treeGrid.hideColumns(keys, hideBy);
        this.updateTreeColumns()

    }

    /**
     * To set scroll top for chart scroll container.
     *
     * @param {number} scrollTop - Defines scroll top value for scroll container.
     * @returns {void} .
     * @public
     */
    public setScrollTop(scrollTop: number): void {
        this.ganttChartModule.scrollObject.setScrollTop(scrollTop);
    }

    /**
     * Cancels edited state.
     *
     * @returns {void} .
     * @public
     */
    public cancelEdit(): void {
        this.isCancelled = true;
        this.closeGanttActions();
    }

    /**
     * Selects a cell by the given index.
     *
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void} .
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    }

    /**
     * Selects a collection of cells by row and column indexes.
     *
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @returns {void} .
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectCells(rowCellIndexes);
        }
    }
    /**
     * Selects a row by given index.
     *
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void} .
     */
    public selectRow(index: number, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectRow(index, isToggle);
        }
    }

    /**
     * Selects a collection of rows by indexes.
     *
     * @param  {number[]} records - Defines the collection of row indexes.
     * @returns {void} .
     */
    public selectRows(records: number[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectRows(records);
        }
    }
    /**
     * Method to delete record.
     *
     * @param {number | string } taskDetail - Defines the details of data to delete.
     * @returns {void} .
     * @public
     */
    public deleteRecord(taskDetail: number | string | number[] | string[] | IGanttData | IGanttData[]): void {
        if (this.editModule) {
            this.editModule.deleteRecord(taskDetail);
        }
    }
    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @returns {void} .
     */
    public enableItems(items: string[], isEnable: boolean): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableItems(items, isEnable);
        }
    }
    /**
     * Deselects the current selected rows and cells.
     *
     * @returns {void} .
     */
    public clearSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearSelection();
        }
    }
    /**
     * @param {ITaskAddedEventArgs | IActionBeginEventArgs} args .
     * @returns {ITaskAddedEventArgs | IActionBeginEventArgs} .
     * @hidden
     */
    public updateDataArgs(args: ITaskAddedEventArgs | IActionBeginEventArgs): ITaskAddedEventArgs | IActionBeginEventArgs {
        if (!Array.isArray(args.data)) {
            const customData: IGanttData[] = [];
            customData.push(args.data);
            setValue('data', customData, args);
        }
        return args;
    }
    /**
     * Method to convert task data to milestone data.
     *
     * @param {string} id - Defines id of record.
     * @returns {void} .
     * @public
     */
    public convertToMilestone(id: string): void {
        const rowData: IGanttData = this.getRecordByID(id);
        if (!isNullOrUndefined(rowData)) {
            const data: Object = extend({}, {}, rowData.taskData, true);
            const taskfields: TaskFieldsModel = this.taskFields;
            if (data[taskfields.startDate]) {
                this.setRecordValue(taskfields.startDate, rowData.ganttProperties.startDate, data, true);
            }
            if (!isNullOrUndefined(taskfields.duration)) {
                data[taskfields.duration] = 0;
            } else {
                data[taskfields.startDate] = new Date(rowData.ganttProperties.startDate);
                data[taskfields.endDate] = new Date(rowData.ganttProperties.endDate);
            }
            if (!isNullOrUndefined(taskfields.milestone)) {
                if (data[taskfields.milestone] === false) {
                    data[taskfields.milestone] = true;
                }
            }
            if (!isNullOrUndefined(taskfields.progress)) {
                data[taskfields.progress] = 0;
            }
            if (!isNullOrUndefined(taskfields.child) && data[taskfields.child]) {
                data[taskfields.child] = [];
            }
            if (!isNullOrUndefined(taskfields.parentID) && data[taskfields.parentID]) {
                data[taskfields.parentID] = null;
            }
            if (!isNullOrUndefined(taskfields.segments)) {
                data[taskfields.segments] = null;
            }
            if (!isNullOrUndefined(this.contextMenuModule) &&
                this.contextMenuModule.isOpen &&
                this.contextMenuModule.item === 'Milestone') {
                if (!isNullOrUndefined(taskfields.dependency)) {
                    data[taskfields.dependency] = null;
                }
                const position: RowPosition = this.editSettings.newRowPosition;
                this.addRecord(data, position, this.selectedRowIndex);
            } else {
                if (!rowData.hasChildRecords && !rowData.ganttProperties.isMilestone) {
                    this.updateRecordByID(data);
                }
            }
        }
    }
    /**
     * To change the mode of a record.
     *
     * @param {object} data - Use to change the TaskMode either manual, auto or custom.
     * @returns {void} .
     */
    public changeTaskMode(data: Object): void {
        const tasks: TaskFieldsModel = this.taskFields;
        const ganttData: IGanttData = this.getRecordByID(data[tasks.id]);
        const ganttProp: ITaskData = ganttData.ganttProperties;
        this.isOnEdit = true;
        this.setRecordValue('isAutoSchedule', !ganttProp.isAutoSchedule, ganttProp, true);
        if (!isNullOrUndefined(this.taskFields.manual)) {
            this.setRecordValue('taskData.' + tasks.manual, !ganttProp.isAutoSchedule, ganttData);
            this.setRecordValue(tasks.manual, !ganttProp.isAutoSchedule, ganttData);
        }
        this.editModule.updateTaskScheduleModes(ganttData);
        const args: ITaskbarEditedEventArgs = {
            data: ganttData
        };
        this.editModule.initiateUpdateAction(args);
    }
    /**
     * @returns {string[]} .
     * @private
     */
    public getTaskIds(): string[] {
        return this.taskIds;
    }
    /**
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public setTaskIds(data: IGanttData): void {
        if (this.viewType !== 'ProjectView') {
            let id: string = data.ganttProperties.taskId;
            id = data.level === 0 ? 'R' + id : 'T' + id;
            this.taskIds.push(id);
        }
    }
    /**
     * To render the react templates
     *
     * @returns {void} .
     *  @hidden
     */
    public renderTemplates(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * To reset the react templates
     *
     * @returns {void} .
     *  @hidden
     */
    public resetTemplates(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate();
        }
    }
}
