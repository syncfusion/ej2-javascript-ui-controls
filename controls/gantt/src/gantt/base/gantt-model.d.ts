import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit } from '@syncfusion/ej2-base';import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, remove } from '@syncfusion/ej2-base';import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';import { TaskProcessor } from './task-processor';import { GanttChart } from './gantt-chart';import { Timeline } from '../renderer/timeline';import { GanttTreeGrid } from './tree-grid';import { Toolbar } from '../actions/toolbar';import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs } from './interface';import { ITaskbarEditedEventArgs, IParent, ITaskData, ISplitterResizedEventArgs } from './interface';import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs } from './interface';import { ITimeSpanEventArgs } from './interface';import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel } from '../models/models';import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel } from '../models/models';import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';import { SearchSettingsModel, SearchSettings } from '../models/models';import { ItemModel } from '@syncfusion/ej2-navigations';import { DateProcessor } from './date-processor';import { ChartRows } from '../renderer/chart-rows';import { Dependency } from '../actions/dependency';import * as cls from './css-constants';import { Query, DataManager } from '@syncfusion/ej2-data';import { Column, ColumnModel } from '../models/column';import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';import { Sort } from '../actions/sort';import { CellSelectEventArgs, CellSelectingEventArgs } from '@syncfusion/ej2-grids';import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { RowDataBoundEventArgs, HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import { QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { Filter } from '../actions/filter';import { PageEventArgs, FilterEventArgs, SortEventArgs, ResizeArgs, ColumnDragEventArgs, getActualProperties } from '@syncfusion/ej2-grids';import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';import { ConnectorLine } from '../renderer/connector-line';import { ConnectorLineEdit } from '../actions/connector-line-edit';import { Edit } from '../actions/edit';import { Splitter } from './splitter';import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';import { TooltipSettingsModel } from '../models/tooltip-settings-model';import { Tooltip } from '../renderer/tooltip';import { ToolbarItem, RowPosition, DurationUnit, SortDirection, GridLine } from './enum';import { Selection } from '../actions/selection';import { DayMarkers } from '../actions/day-markers';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Gantt
 */
export interface GanttModel extends ComponentModel{

    /**
     * Enables or disables the key board interaction of Gantt.
     * @hidden
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * Enables or disables the focusing the task bar on click action
     * 
     * @default true
     */
    autoFocusTasks?: boolean;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Gantt chart rows by clicking it.
     * @default true
     */
    allowSelection?: boolean;

    /**
     * If `allowSorting` is set to true, it allows sorting of gantt chart tasks when column header is clicked.
     * @default false
     */
    allowSorting?: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     * @default false
     */
    showColumnMenu?: boolean;

    /**
     * If `collapseAllParentTasks` set to true, then root tasks are rendered with collapsed state.
     * @default false
     */
    collapseAllParentTasks?: boolean;

    /**
     * If `highlightWeekends` set to true, then all weekend days are highlighted in week - day timeline mode.
     * @default false
     */
    highlightWeekends?: boolean;

    /**
     * To define expander column index in Grid
     * @default 0
     * @aspType int
     */
    treeColumnIndex?: number;

    /**
     * It is used to render Gantt chart rows and tasks.
     * `dataSource` value was defined as array of JavaScript objects or instances of `DataManager`
     * @default []
     */
    dataSource?: Object[] | DataManager;

    /**
     * `durationUnit` Specifies the duration unit for each tasks whether day or hour or minute
     * * `day`: Sets the duration unit as day.
     * * `hour`: Sets the duration unit as hour.
     * * `minute`: Sets the duration unit as minute.
     * @default day
     */
    durationUnit?: DurationUnit;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.    
     * @default null    
     */
    query?: Query;

    /**
     * Specifies the dateFormat for Gantt, given format is displayed in tooltip and Grid cells.
     */
    dateFormat?: string;

    /**
     * Defines the height of the Gantt component container
     * @default 'auto'
     */
    height?: number | string;

    /**
     * If `renderBaseline` is set to `true`, then baselines are rendered for tasks.
     * @default false
     */
    renderBaseline?: boolean;

    /**
     * Configures the grid lines in tree grid and gantt chart
     */
    gridLines?: GridLine;

    /**
     * Defines the right, left and inner task labels in task bar.
     */
    labelSettings?: LabelSettingsModel;

    /**
     * The task bar template that renders customized child task bars from the given template.
     * @default null
     */
    taskbarTemplate?: string;

    /**
     * The parent task bar template that renders customized parent task bars from the given template.
     * @default null
     */
    parentTaskbarTemplate?: string;

    /**
     * The milestone template that renders customized milestone task from the given template.
     * @default null
     */
    milestoneTemplate?: string;

    /**
     * Defines the baseline bar color
     */
    baselineColor?: string;

    /**
     * Defines the width of the Gantt component container
     * @default 'auto'
     */
    width?: number | string;

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
    toolbar?: (ToolbarItem | string | ItemModel)[];

    /**
     * Defines workweek of project
     * @default ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
     */
    workWeek?: string[];

    /**
     * Defines weekend days are considered as working day or not.
     * @default false
     */
    includeWeekend?: boolean;

    /**
     * Enables or disables rendering of unscheduled tasks in Gantt.
     * @default false
     */
    allowUnscheduledTasks?: boolean;

    /**
     * To show notes column cell values inside the cell or in tooltip
     * @default false
     */
    showInlineNotes?: boolean;

    /**
     * Defines height value for grid rows and chart rows in Gantt
     * @default 36
     * @aspType int
     */
    rowHeight?: number;

    /**
     * Defines height of taskbar element in Gantt
     * @aspType int?
     */
    taskbarHeight?: number;

    /**
     * Defines start date of the project, if `projectStartDate` value not set then it will be calculated from data source.
     * @default null
     */
    projectStartDate?: Date | string;

    /**
     * Defines end date of the project, if `projectEndDate` value not set then it will be calculated from data source.
     * @default null     
     */
    projectEndDate?: Date | string;

    /**
     * Defines mapping property to get resource id value from resource collection.
     * @default null
     */
    resourceIDMapping?: string;

    /**
     * Defines mapping property to get resource name value from resource collection.
     * @default null
     */
    resourceNameMapping?: string;

    /**
     * Defines resource collection assigned for projects.
     * @default []
     */
    resources?: Object[];

    /**
     * Defines background color of dependency lines.
     * @default null
     */
    connectorLineBackground?: string;

    /**
     * Defines width of dependency lines.
     * @default 1
     * @aspType int
     */
    connectorLineWidth?: number;

    /**
     * Defines column collection displayed in grid
     * If the `columns` declaration was empty then `columns` are automatically populated from `taskSettings` value.
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Defines the tabs and fields to be included in the add dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * @default []
     */
    addDialogFields?: AddDialogFieldSettingsModel[];

    /**
     * Defines the tabs and fields to be included in the edit dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * @default []
     */
    editDialogFields?: EditDialogFieldSettingsModel[];

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering. 
     * You can also get the currently selected row index.
     * @default -1
     * @aspType int
     */
    selectedRowIndex?: number;

    /**
     * Defines customized working time of project
     */
    dayWorkingTime?: DayWorkingTimeModel[];

    /**
     * Defines holidays presented in project timeline.
     * @default []
     */
    holidays?: HolidayModel[];

    /**
     * Defines events and status of project throughout the timeline.
     * @default []
     */
    eventMarkers?: EventMarkerModel[];

    /**
     * Defines mapping properties to find task values such as id, start date, end date, duration and progress values from data source.
     */
    taskFields?: TaskFieldsModel;

    /**
     * Configures timeline settings of Gantt.
     * Defines default timeline modes or customized top tier mode and bottom tier mode or single tier only.
     */
    timelineSettings?: TimelineSettingsModel;

    /**
     * Configures the sort settings of the Gantt.
     * @default {columns:[]}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures edit settings of Gantt.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Auto',
     * showDeleteConfirmDialog: false } 
     */
    editSettings?: EditSettingsModel;

    /**
     * Enables or disables default tooltip of Gantt element and defines customized tooltip for Gantt elements.
     * @default { showTooltip: true } 
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Configures the selection settings.
     * @default {mode: 'Row', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Enables or disables filtering support in Gantt
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * If `allowReordering` is set to true, Gantt columns can be reordered. 
     * Reordering can be done by drag and drop of a particular column from one index to another index.  
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` is set to true, Gantt columns can be resized.      
     * @default false
     */
    allowResizing?: boolean;

    /**
     * Configures the filter settings for Gantt.
     * @default {columns: [], type: 'Menu' }
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Configures the search settings for Gantt
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Configures the splitter settings for Gantt.
     */
    splitterSettings?: SplitterSettingsModel;

    /**
     * This will be triggered after the taskbar element is appended to the Gantt element.
     * @event 
     */
    queryTaskbarInfo?: EmitType<IQueryTaskbarInfoEventArgs>;

    /**
     * This will be triggered before the row getting collapsed.
     * @event 
     */
    collapsing?: EmitType<object>;

    /**
     * This will be triggered after the row getting collapsed.
     * @event 
     */
    collapsed?: EmitType<object>;

    /**
     * This will be triggered before the row getting expanded.
     * @event 
     */
    expanding?: EmitType<object>;

    /**
     * This will be triggered after the row getting expanded.
     * @event 
     */
    expanded?: EmitType<object>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     * @event
     */
    /* tslint:disable-next-line */
    actionBegin?: EmitType<object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     * @event
     */
    actionComplete?: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs>;

    /**
     * Triggers when actions are failed.
     * @event
     */
    actionFailure?: EmitType<FilterEventArgs | SortEventArgs>;

    /**
     * This will be triggered taskbar was dragged and dropped on new position
     * @event 
     */
    taskbarEdited?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Triggered before the Gantt control gets rendered.
     * @event 
     */
    load?: EmitType<object>;

    /**
     * This event will be triggered when taskbar was in dragging state.
     * @event 
     */
    taskbarEditing?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     * @event 
     */
    dataBound?: EmitType<object>;

    /**
     * Triggers when column resize starts.
     * @event
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     * @event
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     * @event
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts
     * @event
     */
    splitterResizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging
     * @event
     */
    splitterResizing?: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed
     * @event
     */
    splitterResized?: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts. 
     * @event
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously. 
     * @event
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column. 
     * @event
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers before tooltip get rendered
     * @event 
     */
    beforeTooltipRender?: EmitType<BeforeTooltipRenderEventArgs>;

    /**
     * Triggers before row selection occurs.
     * @event
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     * @event 
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @event 
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     * @event 
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     * @event 
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     * @event 
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers before column menu opens.
     * @event 
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event 
     */
    columnMenuClick?: EmitType<ColumnMenuClickEventArgs>;

}