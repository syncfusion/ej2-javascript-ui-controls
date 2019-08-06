import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit, Browser } from '@syncfusion/ej2-base';
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
import { ITaskbarEditedEventArgs, IParent, ITaskData, ISplitterResizedEventArgs, ICollapsingEventArgs } from './interface';
import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs, IKeyPressedEventArgs, ZoomEventArgs } from './interface';
import { ITimeSpanEventArgs, ZoomTimelineSettings, QueryCellInfoEventArgs, RowDataBoundEventArgs, RowSelectEventArgs } from './interface';
import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel } from '../models/models';
import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';
import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel } from '../models/models';
import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';
import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';
import { SearchSettingsModel, SearchSettings } from '../models/models';
import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DateProcessor } from './date-processor';
import { ChartRows } from '../renderer/chart-rows';
import { Dependency } from '../actions/dependency';
import * as cls from './css-constants';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column, ColumnModel } from '../models/column';
import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';
import { Sort } from '../actions/sort';
import { CellSelectEventArgs, CellSelectingEventArgs, CellEditArgs, ISelectedCell, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { RowDeselectEventArgs, CellDeselectEventArgs, IIndex } from '@syncfusion/ej2-grids';
import { HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuItemModel } from '@syncfusion/ej2-grids';
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
import { ToolbarItem, ColumnMenuItem, RowPosition, DurationUnit, SortDirection, GridLine, ContextMenuItem } from './enum';
import { Selection } from '../actions/selection';
import { DayMarkers } from '../actions/day-markers';
import { ContextMenu } from './../actions/context-menu';
import { RowSelectingEventArgs } from './interface';
import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './interface';

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
    public contentHeight: number;
    /** @hidden */
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
     * The `dayMarkersModule` is used to manipulate event markers operation in Gantt.
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
     * The `keyboardModule` is used to manipulate keyboard interactions in Gantt.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * The `contextMenuModule` is used to invoke context menu in Gantt.
     */
    public contextMenuModule: ContextMenu;
    /** @hidden */
    public staticSelectedRowIndex: number = -1;
    protected needsID: boolean = true;
    /**
     * Enables or disables the key board interaction of Gantt.
     * @hidden
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;
    /**
     * Enables or disables the focusing the task bar on click action.
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
     * If `enablePredecessorValidation` is set to true, it allows to validate the predecessor link.
     * @default true
     */
    @Property(true)
    public enablePredecessorValidation: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
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
     * @default null
     */
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];

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
     * To define expander column index in Grid.
     * @default 0
     * @aspType int
     * @blazorType int
     */
    @Property(0)
    public treeColumnIndex: number;
    /**
     * It is used to render Gantt chart rows and tasks.
     * `dataSource` value was defined as array of JavaScript objects or instances of `DataManager`.
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;
    /**
     * `durationUnit` Specifies the duration unit for each tasks whether day or hour or minute.
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
     * Defines the height of the Gantt component container.
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
     * Configures the grid lines in tree grid and gantt chart.
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
     * Defines the baseline bar color.
     */
    @Property()
    public baselineColor: string;

    /**
     * Defines the width of the Gantt component container.
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
     * * ZoomIn: ZoomIn the Gantt control.
     * * ZoomOut: ZoomOut the Gantt control.
     * * ZoomToFit: Display the all tasks within the viewable Gantt chart.
     * @default null
     */
    @Property()
    public toolbar: (ToolbarItem | string | ItemModel)[];

    /**
     * Defines workweek of project.
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
     * To show notes column cell values inside the cell or in tooltip.
     * @default false
     */
    @Property(false)
    public showInlineNotes: boolean;
    /**
     * Defines height value for grid rows and chart rows in Gantt.
     * @default 36
     * @aspType int
     * @blazorType int
     */
    @Property(36)
    public rowHeight: number;
    /**
     * Defines height of taskbar element in Gantt.
     * @aspType int?
     * @blazorType int
     * @isBlazorNullableType true
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
     * @blazorType int
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
     * @blazorType int
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**
     * Defines customized working time of project.
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
     * Configure zooming levels of Gantt Timeline
     */
    public zoomingLevels: ZoomTimelineSettings[];
    /**
     * Configures current zooming level of Gantt.
     */
    public currentZoomingLevel: ZoomTimelineSettings;

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
     * Enables or disables filtering support in Gantt.
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
     * If `enableContextMenu` is set to true, Enable context menu in Gantt.
     * @default false
     */
    @Property(false)
    public enableContextMenu: boolean;
    /**
     * If `contextMenuItems` are array collection of menu items in Context Menu.
     * @default null
     */
    @Property()
    public contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];
    /**
     * Configures the filter settings for Gantt.
     * @default {columns: [], type: 'Menu' }
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**
     * Configures the search settings for Gantt.
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
     * @deprecated
     * @event 
     */
    @Event()
    public queryTaskbarInfo: EmitType<IQueryTaskbarInfoEventArgs>;

    /** 
     * This will be triggered before the row getting collapsed.
     * @event
     */
    @Event()
    public collapsing: EmitType<ICollapsingEventArgs>;

    /** 
     * This will be triggered after the row getting collapsed.
     * @event
     */
    @Event()
    public collapsed: EmitType<ICollapsingEventArgs>;

    /** 
     * This will be triggered before the row getting expanded.
     * @event 
     */
    @Event()
    public expanding: EmitType<ICollapsingEventArgs>;

    /** 
     * This will be triggered after the row getting expanded.
     * @event
     */
    @Event()
    public expanded: EmitType<ICollapsingEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     * @deprecated
     * @event
     */
    /* tslint:disable-next-line */
    @Event()
    public actionBegin: EmitType<object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs | ZoomEventArgs>;
    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     * @event
     * @deprecated
     */
    @Event()
    public actionComplete: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs | IKeyPressedEventArgs | ZoomEventArgs>;

    /**
     * Triggers when actions are failed.
     * @deprecated
     * @event
     */
    @Event()
    public actionFailure: EmitType<FilterEventArgs | SortEventArgs>;

    /** 
     * This will be triggered taskbar was dragged and dropped on new position.
     * @deprecated
     * @event 
     */
    @Event()
    public taskbarEdited: EmitType<ITaskbarEditedEventArgs>;

    /** 
     * This will be triggered when a task get saved by cell edit.
     * @event 
     */
    @Event()
    public endEdit: EmitType<ITaskbarEditedEventArgs>;

    /** 
     * This will be triggered a cell get begins to edit.
     * @deprecated
     * @event 
     */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;

    /** 
     * Triggered before the Gantt control gets rendered.
     * @event
     * @blazorProperty 'OnLoad'
     */
    @Event()
    public load: EmitType<Object>;

    /** 
     * This event will be triggered when taskbar was in dragging state.
     * @deprecated
     * @event 
     */
    @Event()
    public taskbarEditing: EmitType<ITaskbarEditedEventArgs>;

    /** 
     * Triggers when data source is populated in the Grid.
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Triggers when column resize starts.
     * @deprecated
     * @event
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     * @deprecated
     * @event
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     * @deprecated
     * @event
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts.
     * @deprecated
     * @event
     */
    @Event()
    public splitterResizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging.
     * @deprecated
     * @event
     */
    @Event()
    public splitterResizing: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed.
     * @deprecated
     * @event
     */
    @Event()
    public splitterResized: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     * @deprecated 
     * @event
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     * @deprecated 
     * @event
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     * @deprecated 
     * @event
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /** 
     * Triggers before tooltip get rendered.
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
     * @deprecated
     * @event
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @deprecated
     * @event
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;


    /**
     * Triggers before any cell selection occurs.
     * @deprecated
     * @event 
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @deprecated
     * @event 
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @deprecated
     * @event 
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     * @deprecated
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
     * @blazorType Syncfusion.EJ2.Blazor.Grids.HeaderCellInfoEventArgs 
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
     * @deprecated
     * @event 
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when toolbar item was clicked.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;
    /** 
     * Triggers when click on column menu.
     * @event
     * @blazorproperty 'ColumnMenuClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnMenuClickEventArgs
     */
    @Event()
    public columnMenuClick: EmitType<ColumnMenuClickEventArgs>;
    /** 
     * Triggers before context menu opens.
     * @deprecated
     * @event
     */
    @Event()
    public contextMenuOpen: EmitType<CMenuOpenEventArgs>;

    /** 
     * Triggers when click on context menu.
     * @deprecated
     * @event
     */
    @Event()
    public contextMenuClick: EmitType<CMenuClickEventArgs>;

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
    /* tslint:disable-next-line:max-func-body-length */
    public onKeyPress(e: KeyboardEventArgs): void | boolean {
        let expandedRecords: IGanttData[] = this.getExpandedRecords(this.currentViewData);
        if (e.action === 'home' || e.action === 'end' || e.action === 'downArrow' || e.action === 'upArrow' || e.action === 'delete' ||
            e.action === 'rightArrow' || e.action === 'leftArrow' || e.action === 'focusTask' || e.action === 'focusSearch' ||
            e.action === 'expandAll' || e.action === 'collapseAll') {
            if (!isNullOrUndefined(this.editModule) && !isNullOrUndefined(this.editModule.cellEditModule) &&
                this.editModule.cellEditModule.isCellEdit === true) {
                return;
            }
        }
        if (this.isAdaptive) {
            if (e.action === 'addRowDialog' || e.action === 'editRowDialog' || e.action === 'delete'
                || e.action === 'addRow') {
                if (this.selectionModule && this.selectionSettings.type === 'Multiple') {
                    this.selectionModule.hidePopUp();
                    (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
                }
            }
        }
        switch (e.action) {
            case 'home':
                if (this.selectionModule && this.selectionSettings.mode !== 'Cell') {
                    if (this.selectedRowIndex === 0) {
                        return;
                    }
                    this.selectionModule.selectRow(0);
                }
                break;
            case 'end':
                if (this.selectionModule && this.selectionSettings.mode !== 'Cell') {
                    let currentSelectingRecord: IGanttData = expandedRecords[expandedRecords.length - 1];
                    if (this.selectedRowIndex === this.currentViewData.indexOf(currentSelectingRecord)) {
                        return;
                    }
                    this.selectionModule.selectRow(this.currentViewData.indexOf(currentSelectingRecord));
                }
                break;
            case 'downArrow':
            case 'upArrow':
                this.upDownKeyNavigate(e);
                break;
            case 'expandAll':
                this.ganttChartModule.expandCollapseAll('expand');
                break;
            case 'collapseAll':
                this.ganttChartModule.expandCollapseAll('collapse');
                break;
            case 'expandRow':
            case 'collapseRow':
                this.expandCollapseKey(e);
                break;
            case 'saveRequest':
                if (!isNullOrUndefined(this.editModule) && !isNullOrUndefined(this.editModule.cellEditModule) &&
                    this.editModule.cellEditModule.isCellEdit === true) {
                    this.editModule.cellEditModule.isCellEdit = false;
                    this.treeGrid.endEdit();
                    let focussedElement: HTMLElement = <HTMLElement>this.element.querySelector('.e-treegrid');
                    focussedElement.focus();
                }
                break;
            case 'cancelRequest':
                if (!isNullOrUndefined(this.editModule) && !isNullOrUndefined(this.editModule.cellEditModule)) {
                    this.editModule.cellEditModule.isCellEdit = false;
                    if (!isNullOrUndefined(this.toolbarModule)) {
                        this.toolbarModule.refreshToolbarItems();
                    }
                }
                break;
            case 'addRow':
                e.preventDefault();
                let focussedElement: HTMLElement = <HTMLElement>this.element.querySelector('.e-gantt-chart');
                focussedElement.focus();
                this.addRecord();
                break;
            case 'addRowDialog':
                e.preventDefault();
                if (this.editModule && this.editModule.dialogModule && this.editSettings.allowAdding) {
                    if (this.editModule.dialogModule.dialogObj && getValue('dialogOpen', this.editModule.dialogModule.dialogObj)) {
                        return;
                    }
                    this.editModule.dialogModule.openAddDialog();
                }
                break;
            case 'editRowDialog':
                e.preventDefault();
                let focussedTreeElement: HTMLElement = <HTMLElement>this.element.querySelector('.e-treegrid');
                focussedTreeElement.focus();
                if (this.editModule && this.editModule.dialogModule && this.editSettings.allowEditing) {
                    if (this.editModule.dialogModule.dialogObj && getValue('dialogOpen', this.editModule.dialogModule.dialogObj)) {
                        return;
                    }
                    this.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case 'delete':
                if (this.selectionModule && this.editModule && (!this.editSettings.allowTaskbarEditing
                    || (this.editSettings.allowTaskbarEditing && !this.editModule.taskbarEditModule.touchEdit))) {
                    if ((this.selectionSettings.mode !== 'Cell' && this.selectionModule.selectedRowIndexes.length)
                        || (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length)) {
                        this.editModule.startDeleteAction();
                    }
                }
                break;
            case 'focusTask':
                e.preventDefault();
                let selectedId: string;
                if (this.selectionModule) {
                    if (this.selectionSettings.mode !== 'Cell' &&
                        !isNullOrUndefined(this.currentViewData[this.selectedRowIndex])) {
                        selectedId = this.currentViewData[this.selectedRowIndex].ganttProperties.taskId;
                    } else if (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length > 0) {
                        let selectCellIndex: ISelectedCell[] = this.selectionModule.getSelectedRowCellIndexes();
                        selectedId = this.currentViewData[selectCellIndex[selectCellIndex.length - 1].rowIndex].ganttProperties.taskId;
                    }
                }
                if (selectedId) {
                    this.scrollToTask(selectedId.toString());
                }
                break;
            case 'focusSearch':
                if (<HTMLInputElement>this.element.querySelector('#' + this.element.id + '_searchbar')) {
                    let searchElement: HTMLInputElement =
                        <HTMLInputElement>this.element.querySelector('#' + this.element.id + '_searchbar');
                    searchElement.setAttribute('tabIndex', '-1');
                    searchElement.focus();
                }
                break;
            default:
                let eventArgs: IKeyPressedEventArgs = {
                    requestType: 'keyPressed',
                    action: e.action,
                    keyEvent: e
                };
                this.trigger('actionComplete', eventArgs);
                break;
        }
    }
    private expandCollapseKey(e: KeyboardEventArgs): void {
        if (this.selectionModule && this.selectedRowIndex !== -1) {
            let selectedRowIndex: number;
            if (this.selectionSettings.mode !== 'Cell') {
                selectedRowIndex = this.selectedRowIndex;
            } else if (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length > 0) {
                let selectCellIndex: ISelectedCell[] = this.selectionModule.getSelectedRowCellIndexes();
                selectedRowIndex = selectCellIndex[selectCellIndex.length - 1].rowIndex;
            }
            if (e.action === 'expandRow') {
                this.expandByIndex(selectedRowIndex);
            } else {
                this.collapseByIndex(selectedRowIndex);
            }
        }
    }
    private upDownKeyNavigate(e: KeyboardEventArgs): void {
        e.preventDefault();
        let expandedRecords: IGanttData[] = this.getExpandedRecords(this.currentViewData);
        if (this.selectionModule) {
            if (this.selectionSettings.mode !== 'Cell' && this.selectedRowIndex !== -1) {
                let selectedItem: IGanttData = this.currentViewData[this.selectedRowIndex];
                let selectingRowIndex: number = expandedRecords.indexOf(selectedItem);
                let currentSelectingRecord: IGanttData = e.action === 'downArrow' ? expandedRecords[selectingRowIndex + 1] :
                    expandedRecords[selectingRowIndex - 1];
                this.selectionModule.selectRow(this.currentViewData.indexOf(currentSelectingRecord));
            } else if (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length > 0) {
                let selectCellIndex: ISelectedCell[] = this.selectionModule.getSelectedRowCellIndexes();
                let selectedCellItem: ISelectedCell = selectCellIndex[selectCellIndex.length - 1];
                let currentCellIndex: number = selectedCellItem.cellIndexes[selectedCellItem.cellIndexes.length - 1];
                let selectedItem: IGanttData = this.currentViewData[selectedCellItem.rowIndex];
                let selectingRowIndex: number = expandedRecords.indexOf(selectedItem);
                let currentSelectingRecord: IGanttData = e.action === 'downArrow' ? expandedRecords[selectingRowIndex + 1] :
                    expandedRecords[selectingRowIndex - 1];
                let cellInfo: IIndex = {
                    rowIndex: this.currentViewData.indexOf(currentSelectingRecord),
                    cellIndex: currentCellIndex
                };
                this.selectionModule.selectCell(cellInfo);
            }
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
        this.isAdaptive = Browser.isDevice;
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
            focusTask: 'shift+f5',
            indentLevel: 'shift+leftarrow',
            outdentLevel: 'shift+rightarrow',
            focusSearch: 'ctrl+shift+70' //F Key
        };
        this.zoomingLevels = this.getZoomingLevels();
    }
    /**
     * To validate height and width
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
     */
    private calculateDimensions(): void {
        let settingsHeight: string = this.validateDimentionValue(this.height);
        let settingsWidth: string = this.validateDimentionValue(this.width);
        if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
            settingsWidth = this.width;
        }
        let elementStyleHeight: string = this.element.style.height;
        let elementStyleWidth: string = this.element.style.width;
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
     * @private
     */
    protected render(): void {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger('load', {});
        this.element.classList.add(cls.root);
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
        this.showSpinner();
        this.dataOperation.checkDataBinding();
    }
    /**
     * Method used to show spinner.
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * Method used to hide spinner.
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }
    /**
     * @private
     */
    public renderGantt(isChange?: boolean): void {
        this.timelineModule.processTimelineUnit();
        this.timelineModule.calculateZoomingLevelsPerDayWidth(); // To calculate the perDaywidth
        // predecessor calculation
        if (this.taskFields.dependency) {
            this.predecessorModule.updatePredecessors();
            if (this.isInPredecessorValidation) {
                this.predecessorModule.updatedRecordsDateByPredecessor();
            }
        }
        this.dataOperation.calculateProjectDates();
        this.timelineModule.validateTimelineProp();
        if (isChange) {
            this.updateProjectDates(
                this.cloneProjectStartDate, this.cloneProjectEndDate, this.isTimelineRoundOff);
            this.dataOperation.updateGanttData();
            this.treeGrid.dataSource = this.flatData;
        } else {
            this.dataOperation.updateGanttData();
            this.treeGridPane.classList.remove('e-temp-content');
            remove(this.treeGridPane.querySelector('.e-gantt-temp-header'));
            this.notify('dataReady', {});
            if (this.enableContextMenu) {
                this.notify('initiate-contextMenu', {});
            }
            this.renderTreeGrid();
            this.wireEvents();
            if (this.taskFields.dependency && this.isInPredecessorValidation) {
                let dialogElement: HTMLElement = createElement('div', {
                    id: this.element.id + '_dialogValidationRule',
                });
                this.element.appendChild(dialogElement);
                this.predecessorModule.renderValidationDialog();
            }
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
     * Get expanded records from given record collection.
     * @param {IGanttData[]} records - Defines record collection.
     */
    public getExpandedRecords(records: IGanttData[]): IGanttData[] {
        let expandedRecords: IGanttData[] = records.filter((record: IGanttData) => {
            return this.getExpandStatus(record) === true;
        });
        return expandedRecords;
    }
    /**
     * Getting the Zooming collections of the Gantt control
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    public getZoomingLevels(): ZoomTimelineSettings[] {
        let zoomingLevels: ZoomTimelineSettings[] = [
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 50 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 10 }, timelineUnitSize: 99, level: 0,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 20 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 5 }, timelineUnitSize: 99, level: 1,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 5 },
                bottomTier: { unit: 'Year', format: 'yyyy', count: 1 }, timelineUnitSize: 99, level: 2,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayHalfValue, count: 6
                }, timelineUnitSize: 66, level: 3,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayHalfValue, count: 6
                }, timelineUnitSize: 99, level: 4,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'MMM, yy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayQuarterValue, count: 3
                }, timelineUnitSize: 66, level: 5,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 1 },
                bottomTier: {
                    unit: 'Month', formatter: this.displayQuarterValue, count: 3
                }, timelineUnitSize: 99, level: 6,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Year', format: 'yyyy', count: 1 },
                bottomTier: { unit: 'Month', format: 'MMM yyyy', count: 1 }, timelineUnitSize: 99, level: 7,
                timelineViewMode: 'Year', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 8,
                timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 9,
                timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
                bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 10,
                timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 11,
                timelineViewMode: 'Week', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 12,
                timelineViewMode: 'Week', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
                bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 99, level: 13,
                timelineViewMode: 'Week', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 14,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 99, level: 15,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 66, level: 16,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 17,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 2 }, timelineUnitSize: 66, level: 18,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 2 }, timelineUnitSize: 99, level: 19,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 1 }, timelineUnitSize: 66, level: 20,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 1 }, timelineUnitSize: 99, level: 21,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 30 }, timelineUnitSize: 66, level: 22,
                timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 15 }, timelineUnitSize: 66, level: 23,
                timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 1 }, timelineUnitSize: 66, level: 24,
                timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },

        ];
        return zoomingLevels;
    }
    private displayQuarterValue(date: Date): string {
        let month: number = date.getMonth();
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
        let month: number = date.getMonth();
        if (month >= 0 && month <= 6) {
            return 'H1';
        } else {
            return 'H2';
        }
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
     * Get duration value as string combined with duration and unit values.
     * @param {number} duration - Defines the duration.
     * @param {string} durationUnit - Defines the duration unit.
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
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: GanttModel, oldProp: GanttModel): void {
        let isRefresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowSelection':
                    this.treeGrid.allowSelection = this.allowSelection;
                    this.treeGrid.dataBind();
                    break;
                case 'allowFiltering':
                    this.treeGrid.allowFiltering = this.allowFiltering;
                    this.treeGrid.dataBind();
                    break;
                case 'workWeek':
                    this.dataOperation.getNonWorkingDayIndex();
                    this.dataOperation.reUpdateGanttData();
                    this.chartRowsModule.initiateTemplates();
                    this.chartRowsModule.refreshGanttRows();
                    this.treeGrid.refreshColumns();
                    this.timelineModule.refreshTimeline();
                    break;
                case 'toolbar':
                    this.notify('ui-toolbarupdate', { module: 'toolbar', properties: newProp });
                    break;
                case 'showColumnMenu':
                    this.treeGrid.showColumnMenu = this.showColumnMenu;
                    this.treeGrid.dataBind();
                    break;
                case 'columnMenuItems':
                    this.treeGrid.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
                    break;
                case 'eventMarkers':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
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
                case 'labelSettings':
                case 'renderBaseline':
                case 'baselineColor':
                    this.chartRowsModule.initiateTemplates();
                    this.chartRowsModule.refreshGanttRows();
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
                case 'dayWorkingTime':
                case 'allowUnscheduledTasks':
                case 'holidays':
                    if (prop === 'holidays') {
                        this.totalHolidayDates = this.dataOperation.getHolidayDates();
                        this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    }
                    this.dataOperation.reUpdateGanttData();
                    this.treeGrid.refreshColumns();
                    this.chartRowsModule.initiateTemplates();
                    this.chartRowsModule.refreshGanttRows();
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
                    isRefresh = true;
                    break;
            }
        }
        if (isRefresh) {
            this.refresh();
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
        this.isTreeGridRendered = false;
    }
    /**
     * Method to get taskbarHeight.
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
        if (this.enableContextMenu) {
            modules.push({
                member: 'contextMenu',
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
     * To update height of the Grid lines in the Gantt chart side.  
     * @return {void} 
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
        this.splitterModule.splitterObject.width = this.ganttWidth.toString();
        this.ganttChartModule.scrollObject.
            setHeight(this.ganttHeight - this.ganttChartModule.chartTimelineContainer.offsetHeight - toolbarHeight);
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
            leftPos = n === 0 ? -1 : (leftPos + parseFloat(thWidth));
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
     * Method to get default localized text of the Gantt.
     * @return {void} 
     * @hidden
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
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            zoomToFit: 'Zoom to fit',
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
            confirmPredecessorDelete: 'Are you sure you want to remove dependency link?'
        };
        return ganttLocale;
    }
    /**
     * To remove sorted records of particular column.
     * @param {string} columnName - Defines the sorted column name.  
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
     * To move horizontal scroll bar of Gantt to specific date.
     * @param  {string} date - Defines the task date of data.
     */
    public scrollToDate(date: string): void {
        let tempDate: Date = this.dateValidationModule.getDateFromFormat(date);
        let left: number = this.dataOperation.getTaskLeft(tempDate, false);
        this.ganttChartModule.updateScrollLeft(left);

    }
    /**
     * To move horizontal scroll bar of Gantt to specific task id.
     * @param  {string} taskId - Defines the task id of data.
     */
    public scrollToTask(taskId: string): void {
        if (this.ids.indexOf(taskId) !== -1) {
            let left: number = this.flatData[this.ids.indexOf(taskId)].ganttProperties.left;
            this.ganttChartModule.updateScrollLeft(left);
        }
    }
    /**
     * To set scroll left and top in chart side.
     * @param  {number} left - Defines the scroll left value of chart side.
     * @param  {number} top - Defines the scroll top value of chart side.
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
     * Get parent task by clone parent item.
     * @param {IParent} cloneParent - Defines the clone parent item.
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
     * @param  {Date} startDate - Defines start date of project.
     * @param  {Date} endDate - Defines end date of project.
     * @param  {boolean} isTimelineRoundOff - Defines project start date and end date need to be round off or not.
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
        this.notify('selectRowByIndex', {});
    }

    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines origin field name.
     * @param  {string} toFName - Defines destination field name.
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
     * @param {string} id - Defines the task id.
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
     * Method to get record by id value.
     * @param {string} id - Defines the id of record.
     */
    public getRecordByID(id: string): IGanttData {
        if (isNullOrUndefined(id)) {
            return null;
        }
        return this.flatData[this.ids.indexOf(id.toString())];
    }
    /**
     * Method to set splitter position.
     * @param {string|number} value - Define value to splitter settings property.
     * @param {string} type - Defines name of internal splitter settings property.
     */
    public setSplitterPosition(value: string | number, type: string): void {
        let tempSplitterSettings: Object = {};
        tempSplitterSettings[type] = value;
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
     * @param {number} index - Defines the index of row.
     * @return {void}
     * @public
     */
    public expandByIndex(index: number): void {
        let args: object = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Expand the record by task id.
     * @param {string | number} id - Defines the id of task.
     * @return {void}
     * @public
     */
    public expandByID(id: string | number): void {
        let args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Collapse the record by index value.
     * @param {number} index - Defines the index of row.
     * @return {void}
     * @public
     */
    public collapseByIndex(index: number): void {
        let args: object = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }
    /**
     * Collapse the record by id value.
     * @param {string | number} id - Defines the id of task.
     * @return {void}
     * @public
     */
    public collapseByID(id: string | number): void {
        let args: object = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }

    /**
     * Method to add record.
     * @param {Object | IGanttData} data - Defines record to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @return {void}
     * @public
     */
    public addRecord(data?: Object | IGanttData, rowPosition?: RowPosition, rowIndex?: number): void {
        if (this.editModule && this.editSettings.allowAdding) {
            this.editModule.addRecord(data, rowPosition, rowIndex);
        }
    }

    /**
     * Method to update record by ID.
     * @param  {Object} data - Defines the data to modify.
     * @return {void}
     * @public
     */
    public updateRecordByID(data: Object): void {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.updateRecordByID(data);
        }
    }
    /**
     * To perform Zoom in action on Gantt timeline.
     * @return {void}
     * @public
     */
    public zoomIn(): void {
        this.timelineModule.processZooming(true);
    }
    /**
     * To perform zoom out action on Gantt timeline.
     * @return {void}
     * @public
     */
    public zoomOut(): void {
        this.timelineModule.processZooming(false);
    }
    /**
     * To show all project task in available chart width 
     * @return {void}
     * @public
     */
    public fitToProject(): void {
        this.timelineModule.processZoomToFit();
        this.ganttChartModule.updateScrollLeft(0);
    }
    /**
     * Method to update record by Index.
     * @param  {number} index - Defines the index of data to modify.
     * @param  {object} data - Defines the data to modify.
     * @return {void}
     * @public
     */
    public updateRecordByIndex(index: number, data: Object): void {
        if (this.editModule && this.editSettings.allowEditing) {
            let record: IGanttData;
            let tasks: TaskFieldsModel = this.taskFields;
            record = this.currentViewData.length > 0 ?
                !isNullOrUndefined(this.currentViewData[index]) ? this.currentViewData[index] : null : null;
            if (!isNullOrUndefined(record)) {
                data[tasks.id] = record[tasks.id];
                this.editModule.updateRecordByID(data);
            }
        }
    }

    /**
     * To add dependency for Task.
     * @param  {String|number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to add.
     * @return {void}
     * @public
     */
    public addPredecessor(id: String | number, predecessorString: string): void {
        let ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.addPredecessor(ganttRecord, predecessorString);
        }
    }
    /**
     * To remove dependency from task.
     * @param  {String|number} id - Defines the ID of task to modify.
     * @return {void}
     * @public
     */
    public removePredecessor(id: String | number): void {
        let ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.removePredecessor(ganttRecord);
        }
    }
    /**
     * To modify current dependency values of Task by task id.
     * @param  {String|number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to update.
     * @return {void}
     * @public
     */
    public updatePredecessor(id: String | number, predecessorString: string): void {
        let ganttRecord: IGanttData = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.updatePredecessor(ganttRecord, predecessorString);
        }
    }

    /**
     * Method to open Add dialog.
     * @return {void}
     * @public
     */
    public openAddDialog(): void {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowAdding) {
            this.editModule.dialogModule.openAddDialog();
        }
    }

    /**
     * Method to open Edit dialog.
     * @param {number | string | Object} taskId - Defines the id of task.
     * @return {void}
     * @public
     */
    public openEditDialog(taskId: number | string | Object): void {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowEditing) {
            this.editModule.dialogModule.openEditDialog(taskId);
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
        if (isNullOrUndefined(index)) {
            record = this.getRecordByID(id.toString());
            chartRow = this.getRowByID(id);
            rowIndex = getValue('rowIndex', chartRow);
        } else if (!isNullOrUndefined(index)) {
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
     * @param {number} index - Defines the index of row.
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
     * @param {string | number} id - Defines the id of task.
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
     * Method to perform search action in Gantt.
     * @param {string} keyVal - Defines key value to search.
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

    /**
     * Method to expand all the rows of Gantt.
     * @return {void}
     * @public
     */
    public expandAll(): void {
        this.ganttChartModule.expandCollapseAll('expand');
    }
    /**
     * Method to update data source.
     * @return {void}
     * @public
     */
    public updateDataSource(dataSource: object[], args: object): void {
        for (let prop of Object.keys(args)) {
            switch (prop) {
                case 'projectStartDate':
                    this.setProperties({ projectStartDate: args[prop] }, true);
                    break;
                case 'projectEndDate':
                    this.setProperties({ projectEndDate: args[prop] }, true);
                    break;
            }
        }
        this.dataSource = dataSource;
    }

    /**
     * Method to collapse all the rows of Gantt.
     * @return {void}
     * @public
     */
    public collapseAll(): void {
        this.ganttChartModule.expandCollapseAll('collapse');
    }

    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     * @public
     */
    public getGridColumns(): Column[] {
        return this.treeGrid.getColumns();
    }

    /**
     * Gets the Gantt columns.
     * @return {ColumnModel[]}
     * @public
     */
    public getGanttColumns(): ColumnModel[] {
        return this.ganttColumns;
    }

    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     * @public
     */
    public ShowColumn(keys: string | string[], showBy?: string): void {
        this.treeGrid.showColumns(keys, showBy);
    }

    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     * @public
     */
    public hideColumn(keys: string | string[], hideBy?: string): void {
        this.treeGrid.hideColumns(keys, hideBy);
    }

    /**
     * To set scroll top for chart scroll container.
     * @param {number} scrollTop - Defines scroll top value for scroll container.
     * @return {void}
     * @public
     */
    public setScrollTop(scrollTop: number): void {
        this.ganttChartModule.scrollObject.setScrollTop(scrollTop);
    }

    /**
     * Cancels edited state.
     * @return {void}
     * @public
     */
    public cancelEdit(): void {
        this.closeGanttActions();
    }

    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectCells(cellIndex: IIndex, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    }
}