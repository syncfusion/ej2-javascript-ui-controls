import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit } from '@syncfusion/ej2-base';
import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';
import { GanttModel } from './gantt-model';
import { TaskProcessor } from './task-processor';
import { GanttChart } from './gantt-chart';
import { Timeline } from '../renderer/timeline';
import { GanttTreeGrid } from './tree-grid';
import { Toolbar } from '../actions/toolbar';
import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs } from './interface';
import { ITaskbarEditedEventArgs, IParent, ITaskData, ISplitterResizedEventArgs } from './interface';
import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs } from './interface';
import { ITimeSpanEventArgs } from './interface';
import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel } from '../models/models';
import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';
import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel } from '../models/models';
import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';
import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';
import { SearchSettingsModel, SearchSettings } from '../models/models';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { DateProcessor } from './date-processor';
import { ChartRows } from '../renderer/chart-rows';
import { Dependency } from '../actions/dependency';
import * as cls from './css-constants';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column, ColumnModel } from '../models/column';
import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';
import { Sort } from '../actions/sort';
import { CellSelectEventArgs, CellSelectingEventArgs } from '@syncfusion/ej2-grids';
import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { RowDataBoundEventArgs, HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
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
import { ToolbarItem, RowPosition, DurationUnit, SortDirection, GridLine } from './enum';
import { Selection } from '../actions/selection';
import { DayMarkers } from '../actions/day-markers';

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
    public splitterElement: HTMLElement;
    /** @hidden */
    public toolbarModule: Toolbar;
    /** @hidden */
    public ganttChartModule: GanttChart;
    /** @hidden */
    public treeGridModule: GanttTreeGrid;
    /** @hidden */
    public chartRowsModule: ChartRows;
    /** @hidden */
    public connectorLineModule: ConnectorLine;
    /** @hidden */
    public connectorLineEditModule: ConnectorLineEdit;
    /** @hidden */
    public splitterModule: Splitter;
    /** @hidden */
    public treeGrid: TreeGrid;
    /** @hidden */
    public controlId: string;
    /** @hidden */
    public ganttHeight: number;
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
    public ids: string[];
    /** @hidden */
    public previousRecords: object = {};
    /** @hidden */
    public editedRecords: IGanttData[] = [];
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
    public enablePredecessorValidation?: boolean;
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
    public contentHeight: number;
    /**
     * The `sortModule` is used to manipulate sorting operation in Gantt.
     */
    public sortModule: Sort;
    /**
     * The `filterModule` is used to manipulate sorting operation in Gantt.
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
     * The `editModule` is used to manipulate sorting operation in Gantt.
     */
    public editModule: Edit;
    /**
     * The `selectionModule` is used to manipulate sorting operation in Gantt.
     */
    public selectionModule: Selection;
    /**
     * The `dayMarkersModule` is used to manipulate sorting operation in Gantt.
     */
    public dayMarkersModule: DayMarkers;
    /** @hidden */
    public isConnectorLineUpdate: boolean = false;
    /** @hidden */
    public tooltipModule: Tooltip;
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public keyConfig: { [key: string]: string };
    /** 
     * The `keyboardModule` is used to manipulate sorting operation in Gantt.
     */
    public keyboardModule: KeyboardEvents;
    /** @hidden */
    public staticSelectedRowIndex: number = -1;
    /**
     * Enables or disables the key board interaction of Gantt.
     * @hidden
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;
    /**
     * Enables or disables the focusing the task bar on click action
     * 
     * @default true
     */
    @Property(true)
    public autoFocusTasks: boolean;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Gantt chart rows by clicking it.
     * @default true
     */
    @Property(true)
    public allowSelection: boolean;

    /**
     * If `allowSorting` is set to true, it allows sorting of gantt chart tasks when column header is clicked.
     * @default false
     */
    @Property(false)
    public allowSorting: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     * @default false
     */
    @Property(false)
    public showColumnMenu: boolean;

    /**
     * If `collapseAllParentTasks` set to true, then root tasks are rendered with collapsed state.
     * @default false
     */
    @Property(false)
    public collapseAllParentTasks: boolean;
    /**
     * If `highlightWeekends` set to true, then all weekend days are highlighted in week - day timeline mode.
     * @default false
     */
    @Property(false)
    public highlightWeekends: boolean;
    /**
     * To define expander column index in Grid
     * @default 0
     * @aspType int
     */
    @Property(0)
    public treeColumnIndex: number;
    /**
     * It is used to render Gantt chart rows and tasks.
     * `dataSource` value was defined as array of JavaScript objects or instances of `DataManager`
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;
    /**
     * `durationUnit` Specifies the duration unit for each tasks whether day or hour or minute
     * * `day`: Sets the duration unit as day.
     * * `hour`: Sets the duration unit as hour.
     * * `minute`: Sets the duration unit as minute.
     * @default day
     */
    @Property('day')
    public durationUnit: DurationUnit;
    /**   
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.    
     * @default null    
     */
    @Property(null)
    public query: Query;
    /**
     * Specifies the dateFormat for Gantt, given format is displayed in tooltip and Grid cells.
     */
    @Property('MM/dd/yyyy')
    public dateFormat: string;
    /**
     * Defines the height of the Gantt component container
     * @default 'auto'
     */
    @Property('auto')
    public height: number | string;

    /**
     * If `renderBaseline` is set to `true`, then baselines are rendered for tasks.
     * @default false
     */
    @Property(false)
    public renderBaseline: boolean;

    /**
     * Configures the grid lines in tree grid and gantt chart
     */
    @Property('Horizontal')
    public gridLines: GridLine;

    /**
     * Defines the right, left and inner task labels in task bar.
     */
    @Complex<LabelSettingsModel>({}, LabelSettings)
    public labelSettings: LabelSettingsModel;

    /**
     * The task bar template that renders customized child task bars from the given template.
     * @default null
     */
    @Property(null)
    public taskbarTemplate: string;

    /**
     * The parent task bar template that renders customized parent task bars from the given template.
     * @default null
     */
    @Property(null)
    public parentTaskbarTemplate: string;

    /**
     * The milestone template that renders customized milestone task from the given template.
     * @default null
     */
    @Property(null)
    public milestoneTemplate: string;

    /**
     * Defines the baseline bar color
     */
    @Property()
    public baselineColor: string;

    /**
     * Defines the width of the Gantt component container
     * @default 'auto'
     */
    @Property('auto')
    public width: number | string;

    /**    
     * `toolbar` defines the toolbar items of the Gantt. 
     * It contains built-in and custom toolbar items.
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
     * @default null
     */
    @Property()
    public toolbar: (ToolbarItem | string | ItemModel)[];

    /**
     * Defines workweek of project
     * @default ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
     */
    @Property(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    public workWeek: string[];
    /**
     * Defines weekend days are considered as working day or not.
     * @default false
     */
    @Property(false)
    public includeWeekend: boolean;
    /**
     * Enables or disables rendering of unscheduled tasks in Gantt.
     * @default false
     */
    @Property(false)
    public allowUnscheduledTasks: boolean;
    /**
     * To show notes column cell values inside the cell or in tooltip
     * @default false
     */
    @Property(false)
    public showInlineNotes: boolean;
    /**
     * Defines height value for grid rows and chart rows in Gantt
     * @default 36
     * @aspType int
     */
    @Property(36)
    public rowHeight: number;
    /**
     * Defines height of taskbar element in Gantt
     * @aspType int?
     */
    @Property(null)
    public taskbarHeight: number;

    /**
     * Defines start date of the project, if `projectStartDate` value not set then it will be calculated from data source.
     * @default null
     */
    @Property(null)
    public projectStartDate: Date | string;

    /** 
     * Defines end date of the project, if `projectEndDate` value not set then it will be calculated from data source.
     * @default null     
     */
    @Property(null)
    public projectEndDate: Date | string;
    /**
     * Defines mapping property to get resource id value from resource collection.
     * @default null
     */
    @Property(null)
    public resourceIDMapping: string;
    /**
     * Defines mapping property to get resource name value from resource collection.
     * @default null
     */
    @Property(null)
    public resourceNameMapping: string;
    /**
     * Defines resource collection assigned for projects.
     * @default []
     */
    @Property([])
    public resources: Object[];
    /**
     * Defines background color of dependency lines.
     * @default null
     */
    @Property(null)
    public connectorLineBackground: string;
    /**
     * Defines width of dependency lines.
     * @default 1
     * @aspType int
     */
    @Property(1)
    public connectorLineWidth: number;
    /**
     * Defines column collection displayed in grid
     * If the `columns` declaration was empty then `columns` are automatically populated from `taskSettings` value.
     * @default []
     */
    @Property([])
    public columns: Column[] | string[] | ColumnModel[];
    /**
     * Defines the tabs and fields to be included in the add dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * @default []
     */
    @Property([])
    public addDialogFields: AddDialogFieldSettingsModel[];
    /**
     * Defines the tabs and fields to be included in the edit dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * @default []
     */
    @Property([])
    public editDialogFields: EditDialogFieldSettingsModel[];
    /**    
     * The `selectedRowIndex` allows you to select a row at initial rendering. 
     * You can also get the currently selected row index.
     * @default -1
     * @aspType int
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**
     * Defines customized working time of project
     */
    @Collection<DayWorkingTimeModel>([{ from: 8, to: 12 }, { from: 13, to: 17 }], DayWorkingTime)
    public dayWorkingTime: DayWorkingTimeModel[];
    /**
     * Defines holidays presented in project timeline.
     * @default []
     */
    @Collection<HolidayModel>([], Holiday)
    public holidays: HolidayModel[];
    /**
     * Defines events and status of project throughout the timeline.
     * @default []
     */
    @Collection<EventMarkerModel>([], EventMarker)
    public eventMarkers: EventMarkerModel[];
    /**
     * Defines mapping properties to find task values such as id, start date, end date, duration and progress values from data source.
     */
    @Complex<TaskFieldsModel>({}, TaskFields)
    public taskFields: TaskFieldsModel;

    /**
     * Configures timeline settings of Gantt.
     * Defines default timeline modes or customized top tier mode and bottom tier mode or single tier only.
     */
    @Complex<TimelineSettingsModel>({}, TimelineSettings)
    public timelineSettings: TimelineSettingsModel;

    /**
     * Configures the sort settings of the Gantt.
     * @default {columns:[]}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**
     * Configures edit settings of Gantt.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Auto',
     * showDeleteConfirmDialog: false } 
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;
    /**
     * Enables or disables default tooltip of Gantt element and defines customized tooltip for Gantt elements.
     * @default { showTooltip: true } 
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Configures the selection settings.
     * @default {mode: 'Row', type: 'Single'}
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Enables or disables filtering support in Gantt
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * If `allowReordering` is set to true, Gantt columns can be reordered. 
     * Reordering can be done by drag and drop of a particular column from one index to another index.  
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;
    /**
     * If `allowResizing` is set to true, Gantt columns can be resized.      
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;

    /**
     * Configures the filter settings for Gantt.
     * @default {columns: [], type: 'Menu' }
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**
     * Configures the search settings for Gantt
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**
     * Configures the splitter settings for Gantt.
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
    public isGanttChartRendered: boolean = false;

    /** 
     * This will be triggered after the taskbar element is appended to the Gantt element.
     * @event 
     */
    @Event()
    public queryTaskbarInfo: EmitType<IQueryTaskbarInfoEventArgs>;

    /** 
     * This will be triggered before the row getting collapsed.
     * @event 
     */
    @Event()
    public collapsing: EmitType<object>;

    /** 
     * This will be triggered after the row getting collapsed.
     * @event 
     */
    @Event()
    public collapsed: EmitType<object>;

    /** 
     * This will be triggered before the row getting expanded.
     * @event 
     */
    @Event()
    public expanding: EmitType<object>;

    /** 
     * This will be triggered after the row getting expanded.
     * @event 
     */
    @Event()
    public expanded: EmitType<object>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     * @event
     */
    /* tslint:disable-next-line */
    @Event()
    public actionBegin: EmitType<object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs>;
    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     * @event
     */
    @Event()
    public actionComplete: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs>;

    /**
     * Triggers when actions are failed.
     * @event
     */
    @Event()
    public actionFailure: EmitType<FilterEventArgs | SortEventArgs>;

    /** 
     * This will be triggered taskbar was dragged and dropped on new position
     * @event 
     */
    @Event()
    public taskbarEdited: EmitType<ITaskbarEditedEventArgs>;

    /** 
     * Triggered before the Gantt control gets rendered.
     * @event 
     */
    @Event()
    public load: EmitType<object>;

    /** 
     * This event will be triggered when taskbar was in dragging state.
     * @event 
     */
    @Event()
    public taskbarEditing: EmitType<ITaskbarEditedEventArgs>;

    /** 
     * Triggers when data source is populated in the Grid.
     * @event 
     */
    @Event()
    public dataBound: EmitType<object>;

    /**
     * Triggers when column resize starts.
     * @event
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     * @event
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     * @event
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts
     * @event
     */
    @Event()
    public splitterResizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging
     * @event
     */
    @Event()
    public splitterResizing: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed
     * @event
     */
    @Event()
    public splitterResized: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts. 
     * @event
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously. 
     * @event
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column. 
     * @event
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /** 
     * Triggers before tooltip get rendered
     * @event 
     */
    @Event()
    public beforeTooltipRender: EmitType<BeforeTooltipRenderEventArgs>;

    /**
     * Triggers before row selection occurs.
     * @event
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;


    /**
     * Triggers before any cell selection occurs.
     * @event 
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @event 
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     * @event 
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /** 
     * This will be triggered before the header cell element is appended to the Grid element.
     * @event 
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /** 
     * This will be triggered before the header cell element is appended to the Grid element.
     * @event 
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /** 
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;

    /** 
     * Triggers before column menu opens.
     * @event 
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;

    /** 
     * Triggers when click on column menu.
     * @event 
     */
    @Event()
    public columnMenuClick: EmitType<ColumnMenuClickEventArgs>;

    constructor(options?: GanttModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * To get the module name
     * @private
     */
    public getModuleName(): string {
        return 'gantt';
    }

    /**
     * To perform key interaction in Gantt
     * @private
     */
    public onKeyPress(e: KeyboardEventArgs): void | boolean {
        switch (e.action) {
            case 'focusGanttChart':
                // console.log("Focus the Gantt Chart");
                break;
            case 'home':
                // console.log("Focus first row");
                break;
            case 'end':
                // console.log("Focus last row");
                break;
            case 'editCell':
                // console.log("edit the focused cell");
                break;
            case 'downArrow':
                // console.log("select next row");
                break;
            case 'upArrow':
                // console.log("select previous row");
                break;
            case 'ctrlDownArrow':
                // console.log("select multiple rows downwards");
                break;
            case 'ctrlUpArrow':
                // console.log("select multiple rows upwards");
                break;
            case 'rightArrow':
                // console.log("expand the record");
                break;
            case 'leftArrow':
                // console.log("collapse the record");
                break;
            case 'totalRowExpand':
                // console.log("expand all the parent");
                break;
            case 'totalRowCollapse':
                // console.log("collapse all the parent");
                break;
            case 'saveRequest':
                // console.log("Save edited cell");
                break;
            case 'cancelRequest':
                // console.log("Cancel edited cell");
                break;
            case 'addRow':
                // console.log(" an empty row at the top row if the rows are not selected. If a row is selected," +
                //     "then add an empty row based on the addRowPosition API");
                if (this.editModule && this.editSettings.allowAdding) {
                    e.preventDefault();
                    this.editModule.addRecord();
                }
                break;
            case 'addRowDialog':
                // console.log("add row through dialog");
                if (this.editModule && this.editSettings.allowAdding) {
                    e.preventDefault();
                    this.editModule.dialogModule.openAddDialog();
                }
                break;
            case 'editRowDialog':
                // console.log("add row through dialog");
                if (this.editModule && this.editSettings.allowEditing) {
                    e.preventDefault();
                    this.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case 'delete':
                // console.log("delete selected record");
                if (this.selectionModule && this.editModule) {
                    if ((this.selectionSettings.mode === 'Row' && this.selectionModule.selectedRowIndexes.length)
                        || (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length)) {
                        this.editModule.startDeleteAction();
                    }
                }
                break;
            case 'navigateEditors':
                // console.log("Navigate between navigateEditors");
                break;
            case 'focusTask':
                // console.log("	Focus the selected task");
                break;
        }
    }

    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.initProperties();
    }
    private initProperties(): void {
        this.globalize = new Internationalization(this.locale);
        this.flatData = [];
        this.currentViewData = [];
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
            minute: 'minute',
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
        this.enablePredecessorValidation = true;
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
        this.cloneProjectStartDate = null;
        this.cloneProjectEndDate = null;
        this.totalHolidayDates = this.dataOperation.getHolidayDates();
        this.ganttChartModule = new GanttChart(this);
        this.timelineModule = new Timeline(this);
        this.chartRowsModule = new ChartRows(this);
        this.treeGridModule = new GanttTreeGrid(this);
        this.dateValidationModule = new DateProcessor(this);
        this.predecessorModule = new Dependency(this);
        this.connectorLineModule = new ConnectorLine(this);
        this.connectorLineEditModule = new ConnectorLineEdit(this);
        this.splitterModule = new Splitter(this);
        this.tooltipModule = new Tooltip(this);
        this.keyConfig = {
            focusGanttChart: 'alt+74', // j key
            home: 'home',
            end: 'end',
            editCell: 'f2',
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            totalRowExpand: 'ctrl+rightarrow',
            totalRowCollapse: 'ctrl+leftarrow',
            saveRequest: '13', // enter
            cancelRequest: '27', //Esc 
            addRow: 'ctrl+187', // + key 
            addRowDialog: 'ctrl+shift+65', // + Key
            editRowDialog: 'ctrl+shift+69', // + Key
            delete: 'delete',
            navigateEditors: 'tab',
            focusTask: 'ctrl+shift+f5',
            indentLevel: 'shift+leftarrow',
            outdentLevel: 'shift+rightarrow',
        };
    }
    /**
     * To calculate dimensions of Gantt control
     */
    private calculateDimensions(): void {
        let settingsHeight: number | string = this.height;
        let settingsWidth: number | string = this.width;
        let elementStyleHeight: string = this.element.style.height;
        let elementStyleWidth: string = this.element.style.width;
        if (settingsWidth) {
            this.element.style.width = settingsWidth.toString();
        }
        if (settingsHeight) {
            this.element.style.height = settingsHeight.toString();
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
     * @private
     */
    protected render(): void {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger('load', {});
        this.element.classList.add(cls.root);
        this.calculateDimensions();
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.renderToolbar();
        }
        this.splitterModule.renderSplitter();
        this.notify('renderPanels', null);
        this.showSpinner();
        this.dataOperation.checkDataBinding();
    }
    /**
     * To show spinner
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * To hide spinner
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }
    /**
     * @private
     */
    public renderGantt(): void {
        this.timelineModule.processTimelineUnit();
        // predecessor calculation
        if (this.taskFields.dependency) {
            this.predecessorModule.updatePredecessors();
            if (this.enablePredecessorValidation) {
                this.predecessorModule.updatedRecordsDateByPredecessor();
            }
        }
        this.dataOperation.calculateProjectDates();
        this.timelineModule.validateTimelineProp();
        this.dataOperation.updateGanttData();
        this.treeGridPane.classList.remove('e-temp-content');
        remove(this.treeGridPane.querySelector('.e-gantt-temp-header'));
        this.notify('dataReady', {});
        this.renderTreeGrid();
        this.wireEvents();
        if (this.taskFields.dependency && this.enablePredecessorValidation) {
            let dialogElement: HTMLElement = createElement('div', {
                id: this.element.id + '_dialogValidationRule',
            });
            this.element.appendChild(dialogElement);
            this.predecessorModule.renderValidationDialog();
        }
        this.splitterModule.updateSplitterPosition();
        if (this.gridLines === 'Vertical' || this.gridLines === 'Both') {
            this.renderChartVerticalLines();
        }
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
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        this.onKeyPress(e);
    }
    /**
     * @private
     */
    protected renderToolbar(): void {
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.toolbarModule.renderToolbar();
            this.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * @private
     */
    protected renderTreeGrid(): void {
        this.treeGridModule.renderTreeGrid();
    }
    private updateCurrentViewData(): void {
        this.currentViewData = this.treeGrid.getCurrentViewRecords().slice();
    }
    /**
     * @private
     */
    public updateContentHeight(): void {
        let expandedRecords: IGanttData[] = this.getExpandedRecords(this.currentViewData);
        this.contentHeight = expandedRecords.length * this.rowHeight;
    }
    /**
     * To get expand status.
     * @return {boolean}
     * @private
     */
    public getExpandStatus(data: IGanttData): boolean {
        let parentRecord: IGanttData = this.getParentTask(data.parentItem);
        if (!isNullOrUndefined(parentRecord)) {
            if (parentRecord.expanded === false) {
                return false;
            } else if (parentRecord.parentItem) {
                let parentData: IGanttData = this.getParentTask(parentRecord.parentItem);
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
     * Get expanded records from given record collection
     * @param records 
     */
    public getExpandedRecords(records: IGanttData[]): IGanttData[] {
        let expandedRecords: IGanttData[] = records.filter((record: IGanttData) => {
            return this.getExpandStatus(record) === true;
        });
        return expandedRecords;
    }
    /**
     * 
     * @param date 
     * @param format 
     */
    public getFormatedDate(date: Date, format?: string): string {
        if (isNullOrUndefined(date)) {
            return null;
        }
        if (isNullOrUndefined(format)) {
            format = this.dateFormat;
        }
        return this.globalize.formatDate(date, { format: format });
    }
    /**
     * Get duration value as string combined with duration and unit values
     */
    public getDurationString(duration: number, durationUnit: string): string {
        let value: string = this.dateValidationModule.getDurationString(duration, durationUnit);
        return value;
    }
    /**
     * 
     * @param args 
     * @private
     */
    public treeDataBound(args: object): void {
        this.updateCurrentViewData();
        this.updateContentHeight();
        if (!this.isTreeGridRendered) {
            this.isTreeGridRendered = true;
            this.isLoad = false;
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
            this.treeGrid.height = this.ganttHeight - toolbarHeight -
                (this.treeGrid.grid.getHeaderContent() as HTMLElement).offsetHeight;
            this.notify('tree-grid-created', {});
            this.createGanttPopUpElement();
            this.hideSpinner();
        }
        if (this.taskFields.dependency) {
            this.connectorLineIds = [];
            this.updatedConnectorLineCollection = [];
            this.predecessorModule.createConnectorLinesCollection(this.currentViewData);
        }
        this.notify('recordsUpdated', {});
        this.trigger('dataBound', args);
    }

    /**
     * Called internally, if any of the property value changed.
     * @param newProp 
     * @param oldProp 
     * @private
     */
    public onPropertyChanged(newProp: GanttModel, oldProp: GanttModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowSelection':
                    this.treeGrid.allowSelection = this.allowSelection;
                    this.treeGrid.dataBind();
                    break;
                case 'eventMarkers':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
                case 'highlightWeekends':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
                case 'holidays':
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
                case 'filterSettings':
                    this.treeGrid.filterSettings = getActualProperties(this.filterSettings) as TreeGridFilterSettingModel;
                    this.treeGrid.dataBind();
                    break;
                case 'allowResizing':
                    this.treeGrid.allowResizing = this.allowResizing;
                    this.treeGrid.dataBind();
                    break;
                case 'allowReordering':
                    this.treeGrid.allowReordering = this.allowReordering;
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
                    this.treeGrid.dataBind();
                    break;
                case 'searchSettings':
                    this.treeGrid.grid.searchSettings = getActualProperties(this.searchSettings);
                    this.treeGrid.grid.dataBind();
                    if (this.toolbarModule) {
                        this.toolbarModule.updateSearchTextBox();
                    }
                    break;
            }
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @private
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['allowSelection'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * @private
     */
    public destroy(): void {
        this.notify('destroy', {});
        if (!isNullOrUndefined(this.validationDialogElement) && !this.validationDialogElement.isDestroyed) {
            this.validationDialogElement.destroy();
        }
        let modules: string[] = ['ganttChartModule', 'timelineModule', 'chartRowsModule',
            'treeGridModule', 'ganttDataUpdatesModule', 'dateValidationModule', 'tooltipModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        super.destroy();
        this.chartVerticalLineContainer = null;
        this.element.innerHTML = '';
        removeClass([this.element], cls.root);
        this.element.innerHTML = '';
    }
    /**
     * public method to get taskbarHeight.
     * @return {number}
     * @public
     */
    public getTaskbarHeight(): number {
        return this.chartRowsModule.taskBarHeight;
    }

    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        if (this.toolbar) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowEditing || this.editSettings.allowDeleting
            || this.editSettings.allowTaskbarEditing) {
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
        return modules;
    }
    /** 
     * Sorts a column with the given options. 
     * @param {string} columnName - Defines the column name to be sorted.  
     * @param {SortDirection} direction - Defines the direction of sorting field.  
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained. 
     * @return {void} 
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    }

    /**  
     * Clears all the sorted columns of the Gantt.  
     * @return {void} 
     */
    public clearSorting(): void {
        this.sortModule.clearSorting();
    }

    /**  
     * To validate and render chart horizontal and vertical lines in the Gantt 
     * @return {void}
     * @hidden
     */
    public renderChartGridLines(): void {
        let className: string = 'e-chart-row-border';
        let verticalLines: HTMLElement = this.chartVerticalLineContainer;
        let chartRowsTD: NodeListOf<HTMLTableDataCellElement> =
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
                    removeClass([chartRowsTD[c]], className);
                }
            }
        } else if (this.gridLines === 'Horizontal') {
            if (!isNullOrUndefined(verticalLines)) {
                verticalLines.style.display = 'none';
            }
            if (!chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    addClass([chartRowsTD[c]], className);
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
                    addClass([chartRowsTD[c]], className);
                }
            }
        } else if (this.gridLines === 'None') {
            if (!isNullOrUndefined(verticalLines) && verticalLines.style.display !== 'none') {
                verticalLines.style.display = 'none';
            }
            if (chartRowsTD[0].classList.contains(className)) {
                for (let c: number = 0; c < chartRowsTD.length; c++) {
                    removeClass([chartRowsTD[c]], className);
                }
            }
        }
    }

    /**  
     * To update height of the Grid lines in the Gantt chart side.  
     * @return {void} 
     * @private
     */
    public updateGridLineContainerHeight(): void {
        if (this.chartVerticalLineContainer) {
            this.chartVerticalLineContainer.style.height = formatUnit(this.contentHeight);
        }
    }

    /**  
     * To render vertical lines in the Gantt chart side.  
     * @return {void} 
     */
    private renderChartVerticalLines(): void {
        if (!this.element.contains(this.chartVerticalLineContainer)) {
            this.chartVerticalLineContainer = createElement('div', {
                id: this.element.id + 'line-container',
                styles: 'position:absolute;height:100%;z-index:1'
            });
            this.element.getElementsByClassName('e-chart-rows-container')[0].appendChild(this.chartVerticalLineContainer);
        }
        this.chartVerticalLineContainer.innerHTML = '';
        let headerTable: Element = this.element.getElementsByClassName('e-timeline-header-table-container')[1];
        if (isNullOrUndefined(headerTable)) {
            headerTable = this.element.getElementsByClassName('e-timeline-header-table-container')[0];
        }
        let thElements: HTMLCollectionOf<HTMLTableHeaderCellElement> =
            headerTable.getElementsByTagName('th') as HTMLCollectionOf<HTMLTableHeaderCellElement>;
        let thLength: number = thElements.length;
        let thWidth: string;
        let leftPos: number = 0;
        let containerDiv: HTMLElement = createElement('div');
        for (let n: number = 0; n < thLength; n++) {
            leftPos = n === 0 ? -1 : (leftPos + parseInt(thWidth, 10));
            thWidth = (thElements[n] as HTMLElement).style.width;
            let divElement: HTMLElement = createElement('div', {
                className: 'e-line-container-cell',
                styles: 'left:' + leftPos + 'px'
            });
            containerDiv.appendChild(divElement);
        }
        this.chartVerticalLineContainer.innerHTML = containerDiv.innerHTML;
    }

    /**  
     * Remove sorted columns of the Gantt.  
     * @return {void} 
     */
    public getDefaultLocale(): Object {
        let ganttLocale: Object = {
            emptyRecord: 'No records to display',
            id: 'ID',
            name: 'Name',
            startDate: 'Start Date',
            endDate: 'End Date',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Dependency',
            notes: 'Notes',
            baselineStartDate: 'Baseline Start Date',
            baselineEndDate: 'Baseline End Date',
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
            expandAll: 'Expand all',
            collapseAll: 'Collapse all',
            nextTimeSpan: 'Next timespan',
            prevTimeSpan: 'Previous timespan',
            saveButton: 'Save',
            taskBeforePredecessor_FS: 'You moved "{0}" to start before "{1}" finishes and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_FS: 'You moved "{0}" away from "{1}" and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_SS: 'You moved "{0}" to start before "{1}" starts and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_SS: 'You moved "{0}" to start after "{1}" starts and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_FF: 'You moved "{0}" to finish before "{1}" finishes and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_FF: 'You moved "{0}" to finish after "{1}" finishes and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_SF: 'You moved "{0}" away from "{1}" to starts and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_SF: 'You moved "{0}" to finish after "{1}" starts and the two tasks are linked.'
            + 'As the result, the links cannot be honored. Select one action below to perform',
            okText: 'Ok',
            confirmDelete: 'Are you sure you want to Delete Record?',
            from: 'From',
            to: 'To',
            taskLink: 'Task Link',
            lag: 'Lag',
            start: 'Start',
            finish: 'Finish',
            enterValue: 'Enter the value'
        };
        return ganttLocale;
    }
    /**
     * To clear sorted records with specific to particular column
     * @param columnName 
     */
    public removeSortColumn(columnName: string): void {
        this.sortModule.removeSortColumn(columnName);
    }
    /**
     * 
     * @param args 
     * @private
     */
    public actionBeginTask(args: object): boolean | void {
        this.trigger('actionBegin', args);
    }

    /**
     * To move horizontal scroll bar of Gantt to specific date
     */
    public scrollToDate(date: string): void {
        let tempDate: Date = this.dateValidationModule.getDateFromFormat(date);
        let left: number = this.dataOperation.getTaskLeft(tempDate, false);
        this.ganttChartModule.updateScrollLeft(left);

    }
    /**
     * To move horizontal scroll bar of Gantt to specific date
     */
    public scrollToTask(taskId: string): void {
        if (this.ids.indexOf(taskId) !== -1) {
            let left: number = this.flatData[this.ids.indexOf(taskId)].ganttProperties.left;
            this.ganttChartModule.updateScrollLeft(left);
        }
    }
    /**
     * To set scroll left and top in chart side
     * @param left 
     * @param top 
     */
    public updateChartScrollOffset(left: number, top: number): void {
        if (!isNullOrUndefined(left)) {
            left = this.ganttChartModule.scrollElement.scrollWidth <= left ?
                this.ganttChartModule.scrollElement.scrollWidth : left;
            this.ganttChartModule.scrollObject.setScrollLeft(left);
        }
        if (!isNullOrUndefined(top)) {
            top = this.ganttChartModule.scrollElement.scrollHeight <= top ? this.ganttChartModule.scrollElement.scrollHeight : top;
            this.ganttChartModule.scrollObject.setScrollTop(top);
        }
    }
    /**
     * Get parent task by clone parent item
     * @param cloneParent 
     */
    public getParentTask(cloneParent: IParent): IGanttData {
        if (!isNullOrUndefined(cloneParent)) {
            let parent: IGanttData[] = this.flatData.filter((val: IGanttData) => {
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
     * Filters TreeGrid row by column name with the given options. 
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.   
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match.if false, it filters case 
     * insensitive records (uppercase and lowercase letters treated the same).  
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true, 
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column. 
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column. 
     * @return {void} 
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean, predicate?: string, matchCase?: boolean,
        ignoreAccent?: boolean): void {
        this.treeGrid.filterByColumn(
            fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent
        );
    }

    /** 
     * Clears all the filtered columns in Gantt.
     * @return {void} 
     */
    public clearFiltering(): void {
        this.treeGrid.clearFiltering();
    }
    /** 
     * Removes filtered column by field name. 
     * @param  {string} field - Defines column field name to remove filter.
     * @return {void} 
     * @hidden
     */
    public removeFilteredColsByField(field: string): void {
        this.treeGrid.removeFilteredColsByField(field, false);
    }
    /**
     * Method to set holidays and non working days in date time and date picker controls
     * @return {void}
     * @private
     */
    public renderWorkingDayCell(args: RenderDayCellEventArgs): void {
        let nonWorkingDays: number[] = this.nonWorkingDayIndex;
        let holidays: number[] = this.totalHolidayDates;
        if (nonWorkingDays.length > 0 && nonWorkingDays.indexOf(args.date.getDay()) !== -1) {
            args.isDisabled = true;
        } else if (holidays.length > 0) {
            let tempDate: Date = new Date(args.date.getTime());
            tempDate.setHours(0, 0, 0);
            if (holidays.indexOf(tempDate.getTime()) !== -1) {
                args.isDisabled = true;
            }
        }
    }
    /**
     * To update timeline at start point with one unit.
     * @return {void}
     * @public
     */
    public previousTimeSpan(mode?: string): void {
        this.timelineModule.performTimeSpanAction(
            'prevTimeSpan', 'publicMethod',
            new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }
    /**
     * To update timeline at end point with one unit.
     * @return {void}
     * @public
     */
    public nextTimeSpan(mode?: string): void {
        this.timelineModule.performTimeSpanAction(
            'nextTimeSpan', 'publicMethod',
            new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }

    /**
     * To validate project start date and end date.
     * @return {void}
     * @public
     */
    public updateProjectDates(startDate: Date, endDate: Date, isTimelineRoundOff: boolean): void {
        this.timelineModule.totalTimelineWidth = 0;
        this.cloneProjectStartDate = startDate;
        this.cloneProjectEndDate = endDate;
        this.isTimelineRoundOff = isTimelineRoundOff;
        this.timelineModule.refreshTimelineByTimeSpan();
        this.dataOperation.reUpdateGanttDataPosition();
        this.timelineModule.updateChartByNewTimeline();
        this.ganttChartModule.chartBodyContent.style.width = formatUnit(this.timelineModule.totalTimelineWidth);
        this.ganttChartModule.updateLastRowBottomWidth();
        if (this.gridLines === 'Vertical' || this.gridLines === 'Both') {
            this.renderChartVerticalLines();
        }
        if (this.taskFields.dependency) {
            this.ganttChartModule.reRenderConnectorLines();
        }
    }

    /**
     * Changes the TreeGrid column positions by field names.
     * @return {void}
     * @public
     */
    public reorderColumns(fromFName: string, toFName: string): void {
        this.treeGrid.reorderColumns(fromFName, toFName);
    }
    /**
     * Method to clear edited collections in gantt set edit flag value
     * @private
     */
    public initiateEditAction(isStart: boolean): void {
        this.isOnEdit = isStart;
        this.previousRecords = {};
        this.editedRecords = [];
    }
    /**
     * 
     * @param field Method to update value in Gantt record and make clone record for this
     * @param record 
     * @private
     */
    /* tslint:disable-next-line */
    public setRecordValue(field: string, value: any, record: IGanttData | ITaskData, isTaskData?: boolean): void {
        if (this.isOnEdit || this.isOnDelete) {
            this.makeCloneData(field, record, isTaskData);
            let id: string = isTaskData ? (record as ITaskData).taskId : (record as IGanttData).ganttProperties.taskId;
            let task: IGanttData = this.getRecordByID(id);
            if (task && this.editedRecords.indexOf(task) === -1) {
                this.editedRecords.push(task);
            }
        }
        value = isUndefined(value) ? null : value;
        setValue(field, value, record);
    }
    private makeCloneData(field: string, record: IGanttData | ITaskData, isTaskData?: boolean): void {
        let cloneData: IGanttData;
        /* tslint:disable-next-line */
        let value: any = getValue(field, record);
        /* tslint:disable-next-line */
        let prevValue: any;
        /* tslint:disable-next-line */
        let clonedValue: any;
        if (isTaskData) {
            field = 'ganttProperties.' + field;
        }
        if (isNullOrUndefined(this.previousRecords[record.uniqueID])) {
            let tempData: IGanttData = {} as IGanttData;
            this.previousRecords[record.uniqueID] = tempData;
        }
        cloneData = this.previousRecords[record.uniqueID];
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
    /**
     * Method to get task by uniqueId value
     * @param id 
     */
    public getTaskByUniqueID(id: string): IGanttData {
        let value: IGanttData[] = this.flatData.filter((val: IGanttData) => {
            return val.uniqueID === id;
        });
        if (value.length > 0) {
            return value[0];
        } else {
            return null;
        }
    }
    /**
     * Method to get task by id value
     * @param id 
     */
    public getRecordByID(id: string): IGanttData {
        if (isNullOrUndefined(id)) {
            return null;
        }
        return this.flatData[this.ids.indexOf(id.toString())];
    }
    /**
     * Method to set splitter position
     * @param value 
     * @param valueType 
     */
    public setSplitterPosition(value: string | number, valueType: string): void {
        let tempSplitterSettings: Object = {};
        tempSplitterSettings[valueType] = value;
        let splitterPosition: string = this.splitterModule.calculateSplitterPosition(
            tempSplitterSettings, true);
        let pane1: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[0] as HTMLElement;
        let pane2: HTMLElement = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[1] as HTMLElement;
        this.splitterModule.splitterPreviousPositionGrid = pane1.scrollWidth + 1 + 'px';
        this.splitterModule.splitterPreviousPositionChart = pane2.scrollWidth + 1 + 'px';
        this.splitterModule.splitterObject.paneSettings[0].size = splitterPosition;
        this.splitterModule.triggerCustomResizedEvent();
    }
    /**
     * Expand the record by index value.
     * @return {void}
     * @public
     */
    public expandByIndex(index: number): void {
        let args: object = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Expand the record by task id.
     * @return {void}
     * @public
     */
    public expandByID(id: string | number): void {
        let args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Collapse the record by index value.
     * @return {void}
     * @public
     */
    public collapseByIndex(index: number): void {
        let args: object = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.collapseGanttRow(args);
    }
    /**
     * Collapse the record by ud value.
     * @return {void}
     * @public
     */
    public collapseByID(id: string | number): void {
        let args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.collapseGanttRow(args);
    }

    /**
     * Add record public method.
     * @return {void}
     * @public
     */
    public addRecord(data?: Object | IGanttData, rowPosition?: RowPosition, rowIndex?: number): void {
        if (this.editModule && this.editSettings.allowAdding) {
            this.editModule.addRecord(data, rowPosition, rowIndex);
        }
    }

    /**
     * Add record public method.
     * @return {void}
     * @public
     */
    public updateRecordByID(data: Object): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.updateRecordByID(data);
        }
    }

    /**
     * To add dependency for Task
     * @return {void}
     * @public
     */
    public addPredecessor(ganttRecord: IGanttData, predecessorString: string): void {
        if (this.editModule) {
            this.connectorLineEditModule.addPredecessor(ganttRecord, predecessorString);
        }
    }
    /**
     * To remove dependency from task
     * @return {void}
     * @public
     */
    public removePredecessor(ganttRecord: IGanttData): void {
        if (this.editModule) {
            this.connectorLineEditModule.removePredecessor(ganttRecord);
        }
    }
    /**
     * To modify current dependency values of Task
     * @return {void}
     * @public
     */
    public updatePredecessor(ganttRecord: IGanttData, predecessorString: string): void {
        if (this.editModule) {
            this.connectorLineEditModule.updatePredecessor(ganttRecord, predecessorString);
        }
    }

    /**
     * Changes the TreeGrid column positions by field names.
     * @return {void}
     * @private
     */
    private contructExpandCollapseArgs(id: string | number, index?: number): object {
        let chartRow: Element;
        let record: IGanttData;
        let rowIndex: number;
        if (!index) {
            record = this.getRecordByID(id.toString());
            chartRow = this.getRowByID(id);
            rowIndex = getValue('rowIndex', chartRow);
        } else if (index) {
            chartRow = this.getRowByIndex(index);
            rowIndex = getValue('rowIndex', chartRow);
            record = this.currentViewData[rowIndex];
        }
        let gridRow: Node = this.treeGrid.getRows()[rowIndex];
        let args: object;
        return args = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
    }

    /**
     * Method to get chart row value by index.
     * @return {HTMLElement}
     */
    public getRowByIndex(index: number): HTMLElement {
        try {
            let gridRows: NodeList = this.element.querySelectorAll('.e-chart-row');
            if (!isNullOrUndefined(index)) {
                return gridRows[index] as HTMLElement;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
    /**
     * Method to get the row element by task id.
     * @return {HTMLElement}
     */
    public getRowByID(id: string | number): HTMLElement {
        let record: IGanttData = this.getRecordByID(id.toString());
        let index: number = this.currentViewData.indexOf(record);
        if (index !== -1) {
            return this.getRowByIndex(index);
        } else {
            return null;
        }
    }
    /**
     * Method to get class name for unscheduled tasks
     * @param ganttProp 
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

    private createGanttPopUpElement(): void {
        let popup: Element = this.createElement('div', { className: 'e-ganttpopup', styles: 'display:none;' });
        let content: Element = this.createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        document.getElementById(this.element.id + 'GanttChart').appendChild(popup);
    }
    /**
     * Method to get predecessor value as string.
     * @return {HTMLElement}
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
     * Method to perform search action in Gantt
     * @param keyVal  - Search key string
     */
    public search(keyVal: string): void {
        this.searchSettings.key = keyVal;
        this.dataBind();
    }

    /**
     * Method to get offset rect value
     * @param element 
     * @hidden
     */
    public getOffsetRect(element: HTMLElement): { top: number, left: number } {
        let box: ClientRect = element.getBoundingClientRect();
        let scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
            || document.body.scrollTop;
        let scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft ||
            document.body.scrollLeft;
        let clientTop: number = document.documentElement.clientTop || document.body.clientTop || 0;
        let clientLeft: number = document.documentElement.clientLeft || document.body.clientLeft || 0;
        let top: number = box.top + scrollTop - clientTop;
        let left: number = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }
}