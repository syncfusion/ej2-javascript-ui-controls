import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit, Browser, closest } from '@syncfusion/ej2-base';import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, EventHandler } from '@syncfusion/ej2-base';import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append, remove } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';import { RowDragEventArgs, GridColumn} from '@syncfusion/ej2-grids';import { TaskProcessor } from './task-processor';import { GanttChart } from './gantt-chart';import { Timeline } from '../renderer/timeline';import { GanttTreeGrid } from './tree-grid';import { Toolbar } from '../actions/toolbar';import { CriticalPath } from '../actions/critical-path';import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs, IGanttTaskInfo, ITaskSegment } from './interface';import { DataStateChangeEventArgs } from '@syncfusion/ej2-treegrid';import { ITaskbarEditedEventArgs, IParent, ITaskData, PdfColumnHeaderQueryCellInfoEventArgs } from './interface';import { ICollapsingEventArgs, CellEditArgs, PdfQueryTimelineCellInfoEventArgs } from './interface';import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs, IKeyPressedEventArgs, IEventMarkerInfo } from './interface';import { PdfExportProperties, ISplitterResizedEventArgs } from './interface';import { ZoomEventArgs, IActionBeginEventArgs, CellSelectingEventArgs, RowDeselectEventArgs, PdfQueryCellInfoEventArgs } from './interface';import { ITimeSpanEventArgs, ZoomTimelineSettings, QueryCellInfoEventArgs, RowDataBoundEventArgs, RowSelectEventArgs } from './interface';import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel, CalendarSettingsModel, CalendarSettings, CalendarExceptionModel } from '../models/models';import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel, LoadingIndicatorModel, LoadingIndicator } from '../models/models';import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';import { SearchSettingsModel, SearchSettings, ResourceFields, ResourceFieldsModel } from '../models/models';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { DateProcessor } from './date-processor';import { ChartRows } from '../renderer/chart-rows';import { Dependency } from '../task-dependency/dependency';import * as cls from './css-constants';import { Query, DataManager } from '@syncfusion/ej2-data';import { Column, ColumnModel } from '../models/column';import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';import { Sort } from '../actions/sort';import { CellSelectEventArgs, ISelectedCell, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellDeselectEventArgs, IIndex, FailureEventArgs } from '@syncfusion/ej2-grids';import { HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuItemModel, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { RowDD } from '../actions/rowdragdrop';import { Filter } from '../actions/filter';import { FilterEventArgs, SortEventArgs, ResizeArgs, ColumnDragEventArgs, getActualProperties, BeforeDataBoundArgs } from '@syncfusion/ej2-grids';import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';import { ConnectorLine } from '../task-dependency/connector-line';import { ConnectorLineEdit } from '../task-dependency/connector-line-edit';import { Edit } from '../actions/edit';import { Splitter } from './splitter';import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';import { TooltipSettingsModel } from '../models/tooltip-settings-model';import { Tooltip } from '../renderer/tooltip';import { ToolbarItem, ColumnMenuItem, RowPosition, DurationUnit, SortDirection, GanttAction, ViolationType } from './enum';import { GridLine, ContextMenuItem, ScheduleMode, ViewType } from './enum';import { Selection } from '../actions/selection';import { ExcelExport } from '../actions/excel-export';import { DayMarkers } from '../actions/day-markers';import { ContextMenu } from './../actions/context-menu';import { RowSelectingEventArgs } from './interface';import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './interface';import { ColumnMenu } from '../actions/column-menu';import { ITaskbarClickEventArgs, RecordDoubleClickEventArgs, IMouseMoveEventArgs } from './interface';import { PdfExport } from '../actions/pdf-export';import { WorkUnit, TaskType } from './enum';import { FocusModule } from '../actions/keyboard';import { VirtualScroll } from '../actions/virtual-scroll';import { isCountRequired, parentsUntil } from './utils';import { TaskbarEdit } from '../actions/taskbar-edit';import { UndoRedo } from '../actions/undo-redo';import { WeekWorkingTimeModel } from '../models/week-working-time-model';import { WeekWorkingTime } from '../models/week-working-time';import {CellSaveArgs} from '@syncfusion/ej2-grids';import { cyclicValidator } from '../actions/validator';import { CalendarModule } from './calendar-module';import { CalendarContext } from './calendar-context';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Gantt
 */
export interface GanttModel extends ComponentModel{

    /**
     * Determines whether to automatically validate and update predecessor offsets in the IPredecessor collection and columns during initial load.
     * When true, ensures data consistency with rendering validations.
     *
     * @default false
     */
    autoUpdatePredecessorOffset?: boolean;

    /**
     * Enables or disables keyboard interactions in the Gantt chart.
     *
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * If `enableImmutableMode` is set to true, the Gantt Chart will reuse existing rows from previous results instead of
     * performing a full refresh when Gantt actions are executed.
     *
     * @default false
     */
    enableImmutableMode?: boolean;

    /**
     * Specifies whether dependency connections are supported for parent tasks.
     * Only allows dependencies between tasks belonging to different parents.
     * Dependencies within the same parent are not supported.
     *
     * @default true
     */
    allowParentDependency?: boolean;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the TreeGrid component.
     * If `enableHtmlSanitizer` set to true, any potentially harmful strings and scripts are sanitized before rendering.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * If `disableHtmlEncode` is set to `true`, the Gantt component disables HTML entity encoding across the Gantt content, allowing custom HTML elements to be rendered.
     *
     * @default true
     */
    disableHtmlEncode?: boolean;

    /**
     * Specifies the type of loading indicator to display during scrolling action in the virtual scrolling feature when `enableVirtualization` is enabled.
     *
     * @default {indicatorType: 'Spinner'}
     */
    loadingIndicator?: LoadingIndicatorModel;

    /**
     * Specifies whether to display a shimmer effect during scrolling in the virtual scrolling feature when `enableVirtualization` is enabled. If disabled, a spinner is shown instead of the shimmer effect.
     *
     * @default true
     */
    enableVirtualMaskRow?: boolean;

    /**
     * Gets or sets whether to load child records on demand in remote data binding. When `loadChildOnDemand` set to true, child records are loaded only when expanded, and parent records are rendered in a collapsed state initially.
     *
     * @default true
     */
    loadChildOnDemand?: boolean;

    /**
     * Specifies whether to update offset value on a task for all the predecessor edit actions.
     *
     * @default true
     */
    updateOffsetOnTaskbarEdit?: boolean;

    /**
     * Specifies whether to auto calculate the start and end dates based on factors such as working time, holidays, weekends, and task dependencies.
     *
     * @default true
     */
    autoCalculateDateScheduling?: boolean;

    /**
     *  Specifies whether to automatically scroll the corresponding taskbar into view when a task is selected.
     *
     * @default true
     */
    autoFocusTasks?: boolean;

    /**
     * Specifies whether to enable an adaptive UI mode, which optimizes the layout of pop-ups for filtering, editing, and other features on smaller screens, such as mobile devices.     *
     * @default false
     */
    enableAdaptiveUI?: boolean;

    /**
     * Enables Work Breakdown Structure (WBS) functionality in the Gantt Chart.
     * When set to true, the Gantt Chart automatically generates WBS codes based on the task hierarchy.
     * A dedicated WBS Code column will be shown to represent the task structure.
     * Additionally, if task dependencies (predecessors) are mapped in the data source, a WBS Predecessor column will also be displayed to reflect dependency information using WBS codes.
     *
     * @default false
     */
    enableWBS?: boolean;

    /**
     * Enables the automatic update of WBS codes when performing actions like sorting, filtering, row drag and drop, and other grid operations that change the task order or hierarchy.
     * When set to true, the Gantt component will refresh and regenerate the WBS codes dynamically after such actions to ensure the codes remain in sync with the current task structure.
     *
     * @default false
     */
    enableAutoWbsUpdate?: boolean;

    /**
     * Specifies whether to enable row selection in the Gantt chart. When enabled, selected rows are highlighted.
     *
     * @default true
     */
    allowSelection?: boolean;

    /**
     * If `enableHover` is set to true, it enables hover in the Gantt chart and highlights the rows, chart rows, header cells and timeline cells.
     *
     * @default false
     */
    enableHover?: boolean;

    /**
     * If `allowSorting` is set to true, it enables sorting of Gantt chart tasks when the column header is clicked.
     *
     * @default false
     */
    allowSorting?: boolean;

    /**
     * If `enablePredecessorValidation` is set to true, enables validation for predecessor links in the Gantt chart.
     *
     * @default true
     */
    enablePredecessorValidation?: boolean;

    /**
     * If `showColumnMenu` set to true, enables the column menu options for each column header in the Gantt chart.
     *
     * @default false
     */
    showColumnMenu?: boolean;

    /**
     * `columnMenuItems` defines both built-in and custom menu items for the Gantt chart column menu.
     * <br><br>
     * The available built-in items are,
     * * `ColumnChooser` - To show/hide the TreeGrid columns.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the size of the current column.
     * * `Filter` - Displays filter options based on the `filterSettings` property.
     *
     * @default null
     */
    columnMenuItems?: (ColumnMenuItem | ColumnMenuItemModel)[];

    /**
     * `undoRedoActions` Defines action items that retain for undo and redo operation.
     *
     * @default ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'TaskbarDragAndDrop', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit']
     */
    undoRedoActions?: GanttAction[];

    /**
     * Specifies the time zone used for task date and scheduling calculations in the Gantt chart.
     * By default, the system or browser time zone is applied.
     *
     * The time zone always affects internal date calculations (e.g., task start/end times, durations, and dependencies),
     * even in non-hour views. However, visible changes in timeline and task positions only appear when the timeline
     * includes an hour-level mode.
     *
     * To see the time zone reflected in the UI, configure one of these:
     *   - `timelineViewMode: 'Hour'`
     *   - or `topTier.unit: 'Day'` + `bottomTier.unit: 'Hour'`
     *
     * Without an hour view (e.g., only Day/Week/Month views), the chart looks unchanged, but Gantt chart uses the new time zone.
     *
     * Use standard IANA time zone names (e.g., 'Asia/Kolkata', 'UTC', 'America/New_York').
     *
     * @default null
     */
    timezone?: string;

    /**
     * Defines whether all root tasks should be rendered in a collapsed state. When `collapseAllParentTasks` set to true, all parent tasks will be collapsed by default.
     *
     * @default false
     */
    collapseAllParentTasks?: boolean;

    /**
     * If `highlightWeekends` is set to true, it highlights all weekend days in the week-day timeline mode.
     * This makes weekends visually distinct in the timeline view.
     *
     * @default false
     */
    highlightWeekends?: boolean;

    /**
     * To define expander column index in Grid.
     *
     * @default 0
     * @aspType int
     */
    treeColumnIndex?: number;

    /**
     * Defines the data source for the Gantt chart, which is used to render rows and tasks.
     * The `dataSource` can be an array of JavaScript objects, an instance of `DataManager`, or a single object.
     * The array of objects should contain the task data with properties such as `TaskID`, `TaskName`, `StartDate`, `EndDate`, etc.
     * This allows dynamic binding of tasks and their relationships (e.g., dependencies, subtasks, progress) to the Gantt chart.
     * {% codeBlock src='gantt/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @isGenericType true
     * @default []
     */
    dataSource?: Object[] | DataManager | Object;

    /**
     * `durationUnit` Specifies the duration unit for each task. The available options are:
     * * `day`: Sets the duration unit to day.
     * * `hour`: Sets the duration unit to hour.
     * * `minute`: Sets the duration unit to minute.
     *
     * @default day
     */
    durationUnit?: DurationUnit;

    /**
     * Defines an external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed in conjunction with data processing to filter, sort the data.
     * This allows for advanced data manipulation before binding the data to the Gantt chart.
     * {% codeBlock src='gantt/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    query?: Query;

    /**
     * Specifies the date format for displaying dates in the Gantt chart, including in tooltips and grid cells.
     * By default, the format is determined based on the current culture/locale settings.
     */
    dateFormat?: string;

    /**
     * Defines the height of the Gantt component container.
     * The `height` property can be set to a specific value (in pixels or percentage) or set to 'auto' for automatic height adjustment based on content.
     *
     * @default 'auto'
     */
    height?: number | string;

    /**
     * If `renderBaseline` is set to `true`, baselines will be rendered for tasks in the Gantt chart.
     * Baselines provide a visual reference to track the planned vs. actual progress of tasks.
     *
     * @default false
     */
    renderBaseline?: boolean;

    /**
     * Defines the calendar configuration for the project, including working times, holidays, and task-specific calendars.
     *
     * This setting enables customization of scheduling behavior across the Gantt chart, including:
     * - Global working hours and non-working days
     * - Holiday definitions with localized labels
     * - Task-level calendar overrides via `taskFields.calendarId`
     *
     * @default {}
     */
    calendarSettings?: CalendarSettingsModel;

    /**
     * Specifies whether taskbar drag and drop is enabled in the Gantt chart.
     *
     * @default false
     */
    allowTaskbarDragAndDrop?: boolean;

    /**
     * Specifies whether taskbars can overlap in the Gantt chart. To enable overlapping behavior, use this property along with `enableMultiTaskbar`.
     *
     * @default true
     */
    allowTaskbarOverlap?: boolean;

    /**
     * Configures the grid lines displayed in the TreeGrid and Gantt chart.
     * The `gridLines` property allows customization of the type of grid lines to be shown, either horizontal, vertical, both or none.
     *
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: Hides both horizontal and vertical grid lines.
     * * `Horizontal`: Displays only horizontal grid lines.
     * * `Vertical`: Displays only vertical grid lines.
     * * `Default`: Adjusts line visibility based on the theme.
     *
     *  @default 'Horizontal'
     */
    gridLines?: GridLine;

    /**
     * Configures the labels displayed on the right, left, and inside the taskbars in the Gantt chart.
     * {% codeBlock src='gantt/labelSettings/index.md' %}{% endcodeBlock %}
     */
    labelSettings?: LabelSettingsModel;

    /**
     * The task bar template that renders customized child task bars from the given template.
     * This property allows users to define a custom template for rendering child task bars in the Gantt chart.
     * {% codeBlock src='gantt/taskbarTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    taskbarTemplate?: string | Function;

    /**
     * Defines a custom template for rendering parent task bars in the Gantt chart. This template allows you to customize the appearance of parent task bars.
     * {% codeBlock src='gantt/parentTaskbarTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    parentTaskbarTemplate?: string | Function;

    /**
     * Specifies the template used to render custom HTML content in timeline cells.
     * {% codeBlock src='gantt/timelineTemplate/index.md' %}{% endcodeBlock %}
     * @default null
     * @aspType string
     */
    timelineTemplate?: string | Function;

    /**
     * Defines a custom template for rendering milestone tasks in the Gantt chart. This template allows you to customize the appearance of milestone tasks.
     * {% codeBlock src='gantt/milestoneTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    milestoneTemplate?: string | Function;

    /**
     * Specifies the color of the baseline bar in the Gantt chart.
     * {% codeBlock src='gantt/baselineColor/index.md' %}{% endcodeBlock %}
     *
     *  @default null
     */
    baselineColor?: string;

    /**
     * Defines the width of the Gantt component container.
     *
     * @default 'auto'
     */
    width?: number | string;

    /**
     * If `enableVirtualization` is set to true, the Gantt chart will render only the rows visible within the viewport.
     * and load subsequent rows as the user scrolls vertically. This improves performance when dealing with large datasets.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Enables better performance for projects with a large time span by initially rendering only the visible timeline cells when `enableVirtualization` is enabled.
     * Subsequent cells are loaded on horizontal scrolling.
     *
     * @default false
     */
    enableTimelineVirtualization?: boolean;

    /**
     * `toolbar` defines the toolbar items of the Gantt.
     * It contains built-in and custom toolbar items.
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Gantt's toolbar.
     * <br>
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
    toolbar?: (ToolbarItem | string | ItemModel)[];

    /**
     * Specifies the project's workweek (working days).
     * `workWeek` specifies the days of the week that are considered working days for the project.
     *
     * @default ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
     */
    workWeek?: string[];

    /**
     * Specifies whether weekend days are considered working days in the Gantt chart.
     * When `includeWeekend` is set to true, weekends (Saturday and Sunday) are treated as regular working days.
     *
     * @default false
     */
    includeWeekend?: boolean;

    /**
     * Enables or disables the rendering of unscheduled tasks in the Gantt chart.
     * When `allowUnscheduledTasks` set to true, unscheduled tasks will be displayed in the chart.
     *
     * @default false
     */
    allowUnscheduledTasks?: boolean;

    /**
     * To show notes column cell values inside the cell or in tooltip.
     *
     * @default false
     */
    showInlineNotes?: boolean;

    /**
     * Defines the height of grid and chart rows in the Gantt chart.
     * This property sets the vertical space allocated for each task or row, allowing customization of row sizes.
     *
     * @default 36
     * @aspType int
     */
    rowHeight?: number;

    /**
     * Defines height of the taskbar element in the Gantt chart.
     *
     * @default null
     * @aspType int?
     */
    taskbarHeight?: number;

    /**
     * Defines the start date of the project. If the `projectStartDate` is not set, it will be automatically calculated based on the data source.
     * The date can be provided as a `Date` object or a string in a valid date format.
     *
     * @default null
     */
    projectStartDate?: Date | string;

    /**
     * Defines the end date of the project. If the `projectEndDate` is not set, it will be automatically calculated based on the data source.
     * The date can be provided as a `Date` object or a string in a valid date format.
     *
     * @default null
     */
    projectEndDate?: Date | string;

    /**
     * Defines the mapping property to retrieve the resource ID value from the resource collection.
     * This is used to map the resource ID from the resource data to the Gantt chart for resource allocation.
     * {% codeBlock src='gantt/resources/index.md' %}{% endcodeBlock %}
     * @default null
     */
    resourceIDMapping?: string;

    /**
     * Defines the mapping property to retrieve the resource name value from the resource collection.
     * This is used to map the resource name from the resource data to the Gantt chart for task allocation.
     * {% codeBlock src='gantt/resources/index.md' %}{% endcodeBlock %}
     * @default null
     */
    resourceNameMapping?: string;

    /**
     * Specifies the collection of resources assigned to the project.
     *
     * @default []
     */
    resources?: object[];

    /**
     * Specifies the array of segment objects assigned to tasks in the Gantt chart.
     * Each segment represents a portion of the taskbar, allowing for visual representation of different phases or sub-tasks within a single task.
     *
     * @default []
     */
    segmentData?: object[];

    /**
     * Specifies the background color of dependency (connector) lines in the Gantt chart.
     * Accepts any valid CSS color value (for example: "red", "#FF5733", "rgb(255, 0, 0)").
     *
     * @default null
     */
    connectorLineBackground?: string;

    /**
     * Defines the width of the dependency lines in the Gantt chart.
     * The value should be a positive integer, representing the thickness of the lines.
     *
     * @default 1
     * @aspType int
     */
    connectorLineWidth?: number;

    /**
     * Defines the collection of columns displayed in the Gantt chart grid.
     * If the `columns` declaration is empty, the columns are automatically populated based on the `taskSettings` values.
     * {% codeBlock src='gantt/columns/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Defines the tabs and fields to be displayed in the add dialog.
     * If not specified, the fields will be derived from the `taskSettings` and `columns` values.
     * {% codeBlock src='gantt/addDialogFields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    addDialogFields?: AddDialogFieldSettingsModel[];

    /**
     * Defines the tabs and fields to be displayed in the edit dialog.
     * If not specified, the fields will be derived from the `taskSettings` and `columns` values.
     * {% codeBlock src='gantt/editDialogFields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    editDialogFields?: EditDialogFieldSettingsModel[];

    /**
     * The `selectedRowIndex` allows you to specify the index of the row to be selected at the time of initial rendering.
     * It can also be used to get the currently selected row index after selection.
     * A value of `-1` indicates no row is selected.
     *
     * @default -1
     * @aspType int
     */
    selectedRowIndex?: number;

    /**
     * `workUnit` Specifies the work unit for each tasks whether day or hour or minute.
     * * `day`: Sets the work unit as day.
     * * `hour`: Sets the work unit as hour.
     * * `minute`: Sets the work unit as minute.
     *
     * @default hour
     */
    workUnit?: WorkUnit;

    /**
     * `taskType` Specifies the task type for task whether fixedUnit or fixedWork or fixedDuration.
     * * `fixedUnit`: Sets the task type as fixedUnit.
     * * `fixedWork`: Sets the task type as fixedWork.
     * * `fixedDuration`: Sets the task type as fixedDuration.
     *
     * @default fixedUnit
     */
    taskType?: TaskType;

    /**
     * Specifies the view type of the Gantt chart.
     *
     *  @default 'ProjectView'
     */
    viewType?: ViewType;

    /**
     * Defines the customized working time for the project to ensure accurate task scheduling, and works only when the timeline is configured with topTier.unit as 'Day' and bottomTier.unit as 'Hour' or when `timelineViewMode` is set to 'Hour' or 'Day'.
     *
     * {% codeBlock src='gantt/dayWorkingTime/index.md' %}{% endcodeBlock %}
     */
    dayWorkingTime?: DayWorkingTimeModel[];

    /**
     * Specifies the working days in a week for accurate planning, and works only when the timeline is configured with topTier.unit as 'Day' and bottomTier.unit as 'Hour' or when `timelineViewMode` is set to 'Hour' or 'Day'.
     */
    weekWorkingTime?: WeekWorkingTimeModel[];

    /**
     * Defines holidays within the project timeline, allowing you to mark specific dates as holidays.
     * This helps in accounting for non-working days in scheduling and task planning.
     * {% codeBlock src='gantt/holidays/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    holidays?: HolidayModel[];

    /**
     * Defines the events and milestones along the project timeline.
     * These event markers indicate significant events or milestones throughout the project's duration.
     * {% codeBlock src='gantt/eventMarkers/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    eventMarkers?: EventMarkerModel[];

    /**
     * Defines the mapping properties used to extract task-related values—such as ID, start date, end date, duration, and progress—from the data source.
     * This ensures that the Gantt chart correctly maps the provided data to the corresponding task fields and renders them accurately.
     * {% codeBlock src='gantt/taskFields/index.md' %}{% endcodeBlock %}
     */
    taskFields?: TaskFieldsModel;

    /**
     * Defines the mapping properties to extract resource values, such as `id`, `name`, `unit`, and `group` from the resource collection in the Gantt chart.
     * This helps to map data from a custom resource collection to the appropriate fields for resource allocation.
     */
    resourceFields?: ResourceFieldsModel;

    /**
     * Configures timeline settings of Gantt.
     * Defines default timeline modes or customized top tier mode and bottom tier mode or single tier only.
     * {% codeBlock src='gantt/timelineSettings/index.md' %}{% endcodeBlock %}
     */
    timelineSettings?: TimelineSettingsModel;

    /**
     * Defines the available zoom levels for the Gantt timeline.
     * Provide an array of ZoomTimelineSettings to control the scale and intervals used when zooming.
     *
     * @default []
     */
    zoomingLevels?: ZoomTimelineSettings[];

    /**
     * Configures the sorting options for the Gantt chart.
     * When set, it defines how tasks are sorted based on the specified columns.
     * {% codeBlock src='gantt/sortSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns:[]}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures the edit settings for the Gantt chart, such as enabling or disabling task modifications.
     * {% codeBlock src='gantt/editSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Auto',
     * showDeleteConfirmDialog: false }
     */
    editSettings?: EditSettingsModel;

    /**
     * Enables or disables default tooltip of Gantt element and defines customized tooltip for Gantt elements.
     * {% codeBlock src='gantt/tooltipSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { showTooltip: true }
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Configures the settings for selection in the Gantt chart.
     * {% codeBlock src='gantt/selectionSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {mode: 'Row', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Enables or disables filtering functionality in the Gantt chart.
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Enables exporting the Gantt chart to Excel (.xlsx) and CSV formats.
     * When set to true, users can export the chart data.
     *
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * If `allowRowDragAndDrop` set to true, then it will allow the user to perform row drag and drop action in Gantt chart.
     *
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * If `allowReordering` is set to true, Gantt chart columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     *
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `readOnly` is set to true, the Gantt chart becomes read-only, meaning tasks and other elements cannot be edited.
     * This setting disables all editing features, including task updates, dependency management, and any editing acions.
     *
     * @default false
     */
    readOnly?: boolean;

    /**
     * Enables column resizing in the Gantt chart when `allowResizing` is set to true.
     * When enabled, users can adjust the width of columns by dragging the column borders.
     *
     * @default false
     */
    allowResizing?: boolean;

    /**
     * If `enableContextMenu` is set to true, enables the context menu in the Gantt chart.
     * The context menu provides additional actions that can be accessed by right-clicking on Gantt chart elements
     *
     * @default false
     */
    enableContextMenu?: boolean;

    /**
     * Enables the highlighting of critical tasks in the Gantt Chart that directly affect the project's end date.
     * When enabled, tasks that are critical to the project timeline will be visually distinguished by colours.
     *
     * @default false
     */
    enableCriticalPath?: boolean;

    /**
     * `enableUndoRedo` enables or disables the undo/redo functionality in the Gantt chart.
     * Enables undo and redo in the Gantt chart. When set to true, users can
     * revert or reapply recent changes.
     *
     * @default false
     */
    enableUndoRedo?: boolean;

    /**
     * Specifies the number of undo and redo actions to retain in history.
     *
     * @default 10
     */
    undoRedoStepsCount?: number;

    /**
     * Defines the built-in and custom items that appear in the context menu of the Gantt chart.
     * You can use this property to control the content and functionality of the right-click context menu.
     * {% codeBlock src='gantt/contextMenuItems/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export Gantt chart to PDF file.
     *
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * If `validateManualTasksOnLinking` is set to true,
     * it enables date validation while connecting manually scheduled tasks with predecessor.
     *
     * @default false
     */

    validateManualTasksOnLinking?: boolean;

    /**
     * Enables the rendering of child taskbars on the parent row when it is in a collapsed state in the Gantt chart.
     *
     * @default false
     */
    enableMultiTaskbar?: boolean;

    /**
     * If `showOverAllocation` set to `true`, enables the rendering of the overallocation container in the Gantt chart.
     *
     * @default false
     */
    showOverAllocation?: boolean;

    /**
     * Specifies task schedule mode for a project.
     *
     * @default 'Auto'
     */
    taskMode?: ScheduleMode;

    /**
     * Specifies the number of columns that should remain visible and fixed on the left side of the Gantt during horizontal scrolling.
     * This feature ensures key columns, such as identifiers, stay visible while users scroll through data.
     *
     * @default 0
     */
    frozenColumns?: number;

    /**
     * Defines a custom template to display when the Gantt chart has no records.
     *
     * This template replaces the default empty record message and can include text, HTML elements, or images.
     * Accepts either a template string or an HTML element ID.
     *
     * @default null
     * @aspType string
     */
    emptyRecordTemplate?: string | Function;

    /**
     * Configures the filter settings for the Gantt chart, enabling users to filter tasks based on specific columns or criteria.
     * The `filterSettings` property allows customization of filter behavior, such as which columns to filter and the filter type.
     * {% codeBlock src='gantt/filterSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns: [], type: 'Menu' }
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Configures the search functionality within the Gantt chart.
     * {% codeBlock src='gantt/searchSettings/index.md' %}{% endcodeBlock %}
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Configures the splitter settings for the Gantt chart.
     * {% codeBlock src='gantt/splitterSettings/index.md' %}{% endcodeBlock %}
     *
     * The `position` takes precedence over `columnIndex` when both defined.
     */
    splitterSettings?: SplitterSettingsModel;

    /**
     * Event triggered per taskbar before rendering in the Gantt chart.
     * Used to customize taskbar styles and properties dynamically.
     *
     * @event queryTaskbarInfo
     */
    queryTaskbarInfo?: EmitType<IQueryTaskbarInfoEventArgs>;

    /**
     * Event triggered before Gantt data is exported to Excel.
     * Allows modification or cancellation of the export process.
     * @event beforeExcelExport
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Event triggered after Gantt data has been successfully exported to Excel.
     * Provides access to the generated workbook.
     * @event excelExportComplete
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Event triggered before each cell (header or data) is exported to Excel.
     * Allows customization of cell content, style, or value.
     * @event excelQueryCellInfo
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Event triggered before each header cell is exported to Excel.
     * Allows customization of header cell content or styling.
     * @event excelHeaderQueryCellInfo
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Event triggered continuously while row elements are being dragged.
     * Provides current drag position and target information.
     * @event rowDrag
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Event triggered when a row drag operation starts.
     * Provides initial drag source details.
     * @event rowDragStart
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Event triggered before the row drag operation officially begins.
     * Allows preparation or cancellation of the drag action.
     * @event rowDragStartHelper
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Event triggered when dragged row elements are dropped onto a target row.
     * Provides source and target row information for reordering/indent/outdent.
     * @event rowDrop
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * Event triggered before a row is collapsed.
     * Allows cancellation of the collapse action.
     * @event collapsing
     */
    collapsing?: EmitType<ICollapsingEventArgs>;

    /**
     * Event triggered after a row has been collapsed.
     * Indicates the collapse action has completed.
     * @event collapsed
     */
    collapsed?: EmitType<ICollapsingEventArgs>;

    /**
     * Event triggered before a row is expanded.
     * Allows cancellation of the expand action.
     * @event expanding
     */
    expanding?: EmitType<ICollapsingEventArgs>;

    /**
     * Event triggered after a row has been expanded.
     * Indicates the expand action has completed.
     * @event expanded
     */
    expanded?: EmitType<ICollapsingEventArgs>;

    /**
     * Event triggered when a Gantt action (sorting, filtering, searching, etc.) begins.
     * Allows cancellation or modification of the action.
     * @event actionBegin
     */
    actionBegin?: EmitType<Object | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs | ZoomEventArgs>; // eslint-disable-line

    /**
     * Event triggered before a cell value is saved during editing.
     * Allows cancellation or modification of the save operation.
     * @event cellSave
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Event triggered after a Gantt action (sorting, filtering, etc.) has completed.
     * Provides updated state after the action.
     * @event actionComplete
     */
    actionComplete?: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs | IKeyPressedEventArgs | ZoomEventArgs>;

    /**
     * Event triggered when a Gantt action fails during execution.
     * Provides error details.
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Event triggered after actions like sorting, filtering complete.
     * Used to update the dataSource with current view data and record count.
     * @event dataStateChange
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Event triggered after a taskbar has been dragged and dropped to a new position.
     * Indicates editing via taskbar has completed.
     * @event taskbarEdited
     */
    taskbarEdited?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Event triggered when a task is saved through cell editing.
     * Provides updated task data after save.
     * @event endEdit
     */
    endEdit?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Event triggered when a cell enters edit mode in the Gantt chart.
     * Allows customization or cancellation of editing.
     * @event cellEdit
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Event triggered when the Gantt component begins loading data.
     * Occurs before any rendering starts.
     * @event load
     */
    load?: EmitType<Object>;

    /**
     * Event triggered after the Gantt component is fully created and initialized.
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Event triggered when the Gantt component is being destroyed.
     * Allows cleanup operations.
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Event triggered while a taskbar is being dragged.
     * Provides current drag progress and position.
     * @event taskbarEditing
     */
    taskbarEditing?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Event triggered after the data source is bound to the TreeGrid part of Gantt.
     * Indicates data binding is complete.
     * @event dataBound
     */
    dataBound?: EmitType<Object>;

    /**
     * Event triggered before data is bound to the TreeGrid.
     * Allows modification of data before rendering begins.
     * @event beforeDataBound
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Event triggered when column resizing starts in the Grid.
     * @event resizeStart
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Event triggered continuously while a column is being resized.
     * @event resizing
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Event triggered when column resizing completes.
     * @event resizeStop
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Event triggered when splitter resizing begins in the Gantt component.
     * @event splitterResizeStart
     */
    splitterResizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Event triggered continuously while the splitter bar is being dragged.
     * @event splitterResizing
     */
    splitterResizing?: EmitType<ResizingEventArgs>;

    /**
     * Event triggered when splitter resizing action completes.
     * @event splitterResized
     */
    splitterResized?: EmitType<ISplitterResizedEventArgs>;

    /**
     * Event triggered when column header drag starts.
     * @event columnDragStart
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Event triggered continuously while a column header is being dragged.
     * @event columnDrag
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Event triggered when a dragged column header is dropped.
     * @event columnDrop
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Event triggered before a tooltip is rendered.
     * Allows customization of tooltip content or cancellation.
     * @event beforeTooltipRender
     */
    beforeTooltipRender?: EmitType<BeforeTooltipRenderEventArgs>;

    /**
     * Event triggered before a row is selected.
     * Allows cancellation of selection.
     * @event rowSelecting
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Event triggered after a row has been selected.
     * @event rowSelected
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Event triggered before a selected row is deselected.
     * Allows cancellation of deselection.
     * @event rowDeselecting
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Event triggered after a row has been deselected.
     * @event rowDeselected
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Event triggered before a cell is selected.
     * Allows cancellation of cell selection.
     * @event cellSelecting
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Event triggered after a cell has been selected.
     * @event cellSelected
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Event triggered before a selected cell is deselected.
     * Allows cancellation of cell deselection.
     * @event cellDeselecting
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Event triggered after a cell has been deselected.
     * @event cellDeselected
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Event triggered before each cell element is rendered.
     * Allows customization of cell content or style.
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Event triggered before each header cell element is rendered.
     * Allows customization of header cell content or style.
     * @event headerCellInfo
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Event triggered before each row element is rendered.
     * Allows customization of row appearance.
     * @event rowDataBound
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Event triggered before the column menu is opened.
     * Allows customization or cancellation of menu display.
     * @event columnMenuOpen
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Event triggered when a toolbar item is clicked.
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Event triggered when an item in the column menu is clicked.
     * @event columnMenuClick
     */
    columnMenuClick?: EmitType<ColumnMenuClickEventArgs>;

    /**
     * Event triggered before the context menu is opened.
     * Allows customization or cancellation.
     * @event contextMenuOpen
     */
    contextMenuOpen?: EmitType<CMenuOpenEventArgs>;

    /**
     * Event triggered when an item in the context menu is clicked.
     * @event contextMenuClick
     */
    contextMenuClick?: EmitType<CMenuClickEventArgs>;

    /**
     * Event triggered when a taskbar element is clicked.
     * Provides task and click details.
     * @event onTaskbarClick
     */
    onTaskbarClick?: EmitType<ITaskbarClickEventArgs>;

    /**
     * Event triggered when a record is double-clicked.
     * @event recordDoubleClick
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Event triggered on mouse move over the Gantt component.
     * Provides mouse position and target information.
     * @event onMouseMove
     */
    onMouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Event triggered before Gantt data is exported to PDF.
     * Allows modification or cancellation of PDF export.
     * @event beforePdfExport
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Event triggered after Gantt data has been exported to PDF.
     * Provides access to the generated document.
     * @event pdfExportComplete
     */
    pdfExportComplete?: EmitType<Object>;

    /**
     * Event triggered before each cell is exported to PDF.
     * Allows customization of cell content or style.
     * @event pdfQueryCellInfo
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Event triggered before each taskbar is exported to PDF.
     * Allows customization of taskbar appearance in PDF.
     * @event pdfQueryTaskbarInfo
     */
    pdfQueryTaskbarInfo?: EmitType<Object>;

    /**
     * Event triggered before each timeline cell is exported to PDF.
     * Allows customization of timeline cell content or style.
     * @event pdfQueryTimelineCellInfo
     */
    pdfQueryTimelineCellInfo?: EmitType<PdfQueryTimelineCellInfoEventArgs>;

    /**
     * Event triggered before each column header cell is exported to PDF.
     * Allows customization of header cell content or style.
     * @event pdfColumnHeaderQueryCellInfo
     */
    pdfColumnHeaderQueryCellInfo?: EmitType<PdfColumnHeaderQueryCellInfoEventArgs>;

}