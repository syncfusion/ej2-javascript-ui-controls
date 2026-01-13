import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit, Browser, closest } from '@syncfusion/ej2-base';import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, EventHandler } from '@syncfusion/ej2-base';import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append, remove } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';import { RowDragEventArgs, GridColumn} from '@syncfusion/ej2-grids';import { TaskProcessor } from './task-processor';import { GanttChart } from './gantt-chart';import { Timeline } from '../renderer/timeline';import { GanttTreeGrid } from './tree-grid';import { Toolbar } from '../actions/toolbar';import { CriticalPath } from '../actions/critical-path';import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs, IGanttTaskInfo, ITaskSegment } from './interface';import { DataStateChangeEventArgs } from '@syncfusion/ej2-treegrid';import { ITaskbarEditedEventArgs, IParent, ITaskData, PdfColumnHeaderQueryCellInfoEventArgs } from './interface';import { ICollapsingEventArgs, CellEditArgs, PdfQueryTimelineCellInfoEventArgs } from './interface';import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs, IKeyPressedEventArgs, IEventMarkerInfo } from './interface';import { PdfExportProperties, ISplitterResizedEventArgs } from './interface';import { ZoomEventArgs, IActionBeginEventArgs, CellSelectingEventArgs, RowDeselectEventArgs, PdfQueryCellInfoEventArgs } from './interface';import { ITimeSpanEventArgs, ZoomTimelineSettings, QueryCellInfoEventArgs, RowDataBoundEventArgs, RowSelectEventArgs } from './interface';import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel, CalendarSettingsModel, CalendarSettings, CalendarExceptionModel } from '../models/models';import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel, LoadingIndicatorModel, LoadingIndicator } from '../models/models';import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';import { SearchSettingsModel, SearchSettings, ResourceFields, ResourceFieldsModel } from '../models/models';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { DateProcessor } from './date-processor';import { ChartRows } from '../renderer/chart-rows';import { Dependency } from '../actions/dependency';import * as cls from './css-constants';import { Query, DataManager } from '@syncfusion/ej2-data';import { Column, ColumnModel } from '../models/column';import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';import { Sort } from '../actions/sort';import { CellSelectEventArgs, ISelectedCell, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellDeselectEventArgs, IIndex, FailureEventArgs } from '@syncfusion/ej2-grids';import { HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuItemModel, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { RowDD } from '../actions/rowdragdrop';import { Filter } from '../actions/filter';import { PageEventArgs, FilterEventArgs, SortEventArgs, ResizeArgs, ColumnDragEventArgs, getActualProperties } from '@syncfusion/ej2-grids';import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';import { ConnectorLine } from '../renderer/connector-line';import { ConnectorLineEdit } from '../actions/connector-line-edit';import { Edit } from '../actions/edit';import { Splitter } from './splitter';import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';import { TooltipSettingsModel } from '../models/tooltip-settings-model';import { Tooltip } from '../renderer/tooltip';import { ToolbarItem, ColumnMenuItem, RowPosition, DurationUnit, SortDirection, GanttAction, ViolationType } from './enum';import { GridLine, ContextMenuItem, ScheduleMode, ViewType } from './enum';import { Selection } from '../actions/selection';import { ExcelExport } from '../actions/excel-export';import { DayMarkers } from '../actions/day-markers';import { ContextMenu } from './../actions/context-menu';import { RowSelectingEventArgs } from './interface';import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './interface';import { ColumnMenu } from '../actions/column-menu';import { ITaskbarClickEventArgs, RecordDoubleClickEventArgs, IMouseMoveEventArgs } from './interface';import { PdfExport } from '../actions/pdf-export';import { WorkUnit, TaskType } from './enum';import { FocusModule } from '../actions/keyboard';import { VirtualScroll } from '../actions/virtual-scroll';import { isCountRequired } from './utils';import { TaskbarEdit } from '../actions/taskbar-edit';import { UndoRedo } from '../actions/undo-redo';import { WeekWorkingTimeModel } from '../models/week-working-time-model';import { WeekWorkingTime } from '../models/week-working-time';import {CellSaveArgs} from '@syncfusion/ej2-grids';import { cyclicValidator } from '../actions/validator';import { CalendarModule } from './calendar-module';import { CalendarContext } from './calendar-context';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Gantt
 */
export interface GanttModel extends ComponentModel{

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
     * Specifies whether to allow dependency connection support for parent records.
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
     * Enables or disables automatic focusing on the taskbar when a task is clicked.
     *
     * @default true
     */
    autoFocusTasks?: boolean;

    /**
     * If `enableAdaptiveUI` is set to true, the pop-up UI becomes adaptive to smaller screens, enabling better usability for filtering and other features.
     *
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
     * If `allowSelection` is set to true, it enables row selection in the Gantt chart, and the selected rows are highlighted.
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
     * By default, task schedule dates are calculated with system time zone. If the Gantt chart is assigned with a specific time zone, then schedule dates are calculated based on the given time zone date value.
     * This property function properly when the timeline displays hours. To enable this, set `timelineViewMode` to 'Hour' or configure `topTier.unit` as 'Day' and `bottomTier.unit` as 'Hour'.
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
     * Defines an external [`Query`](https://ej2.syncfusion.com/documentation/api/data/query)
     * that will be executed in conjunction with data processing to filter, sort the data.
     * This allows for advanced data manipulation before binding the data to the Gantt chart.
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
     * Defines whether to enable or disable the taskbar drag and drop action in the Gantt chart.
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
     * Renders customized html elements for timeline cell from the given template.
     *
     * @default null
     * @aspType string
     */
    timelineTemplate?: string | Function;

    /**
     * Defines a custom template for rendering milestone tasks in the Gantt chart. This template allows you to customize the appearance of milestone tasks.
     *
     * @default null
     * @aspType string
     */
    milestoneTemplate?: string | Function;

    /**
     * Specifies the color of the baseline bar in the Gantt chart.
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
     * Defines workweek of project.
     *
     * @default ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
     */
    workWeek?: string[];

    /**
     * Defines whether weekend days should be considered as working days in the Gantt chart.
     * When `includeWeekend` set to true, weekends (Saturday and Sunday) are treated as regular working days.
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
     *
     * @default null
     */
    resourceIDMapping?: string;

    /**
     * Defines the mapping property to retrieve the resource name value from the resource collection.
     * This is used to map the resource name from the resource data to the Gantt chart for task allocation.
     *
     * @default null
     */
    resourceNameMapping?: string;

    /**
     * Defines the collection of resources assigned to the project.
     *
     * @default []
     */
    resources?: object[];

    /**
     * Defines the collection of segments assigned to tasks in the Gantt chart.
     *
     * @default []
     */
    segmentData?: object[];

    /**
     * Defines the background color of the dependency lines (connector lines) in the Gantt chart.
     * You can set the color as a valid CSS color string (e.g., "red", "#FF5733", "rgb(255,0,0)").
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
     * Defines the view type of the Gantt.
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
     * Defines the mapping properties to extract task-related values, such as ID, start date, end date, duration, and progress, from the data source.
     * This allows the Gantt chart to properly map the provided data to the corresponding task fields and render them accordingly.
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
     * Configure zooming levels of Gantt Timeline.
     *
     * @default []
     */
    zoomingLevels?: ZoomTimelineSettings[];

    /**
     * Configures the sort settings for the Gantt chart.
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
     * If `allowExcelExport` set to true, then it will allow the user to export Gantt chart to Excel and CSV file.
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
     * Enables or disables the undo and redo functionality in the Gantt chart.
     *
     * @default false
     */
    enableUndoRedo?: boolean;

    /**
     * Defines number of undo/redo actions that should be stored.
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
     */
    splitterSettings?: SplitterSettingsModel;

    /**
     * This will be triggered after the taskbar element is appended to the Gantt element.
     *
     * @event queryTaskbarInfo
     */
    queryTaskbarInfo?: EmitType<IQueryTaskbarInfoEventArgs>;

    /**
     * Triggers before Gantt data is exported to Excel file.
     *
     * @event beforeExcelExport
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after Gantt data is exported to Excel file.
     *
     * @event excelExportComplete
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelQueryCellInfo
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelHeaderQueryCellInfo
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s drag(move) starts.
     *
     * @event rowDragStart
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s before drag(move).
     *
     * @event rowDragStartHelper
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * This will be triggered before the row getting collapsed.
     *
     * @event collapsing
     */
    collapsing?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting collapsed.
     *
     * @event collapsed
     */
    collapsed?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered before the row getting expanded.
     *
     * @event expanding
     */
    expanding?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting expanded.
     *
     * @event expanded
     */
    expanded?: EmitType<ICollapsingEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<Object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs | ZoomEventArgs>;  // eslint-disable-line

    /**
     * Triggers before a cell's value is saved in the Gantt chart.
     *
     * This event allows cancellation of the save action.
     *
     * @event cellSave
     * @param args - Arguments related to the cell save event, including data and cancellation options.
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs | IKeyPressedEventArgs | ZoomEventArgs>;

    /**
     * Triggers when actions are failed.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when the Gantt actions such as Sorting, Editing etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggered when a taskbar is dragged and dropped into a new position on the Gantt chart.
     *
     * @event taskbarEdited
     */
    taskbarEdited?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered when a task get saved by cell edit.
     *
     * @event endEdit
     */
    endEdit?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered a cell get begins to edit.
     *
     * @event cellEdit
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggered before the Gantt control gets rendered.
     *
     * @event load
     */
    load?: EmitType<Object>;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggered when a taskbar is in the dragging state on the Gantt chart.
     *
     * @event taskbarEditing
     */
    taskbarEditing?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     *
     * @event dataBound
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers before the data is bound to the TreeGrid in the Gantt component.
     * This event is triggered before any visual elements (taskbars, rows, timelines) are rendered in the DOM.
     *
     * @event beforeDataBound
     */
    beforeDataBound?: EmitType<Object>;

    /**
     * Triggers when column resize starts.
     *
     * @event resizeStart
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @event resizing
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @event resizeStop
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts.
     *
     * @event splitterResizeStart
     */
    splitterResizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging.
     *
     * @event splitterResizing
     */
    splitterResizing?: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed.
     *
     * @event splitterResized
     */
    splitterResized?: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @event columnDragStart
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @event columnDrag
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @event columnDrop
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers before tooltip get rendered.
     *
     * @event beforeTooltipRender
     */
    beforeTooltipRender?: EmitType<BeforeTooltipRenderEventArgs>;

    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after row selection occurs.
     *
     * @event rowSelected
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     *
     * @event rowDeselecting
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     *
     * @event cellDeselecting
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @event cellDeselected
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     *
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * This will be triggered before the header cell element is appended to the Grid element.
     *
     * @event headerCellInfo
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * This will be triggered before the row element is appended to the Grid element.
     *
     * @event rowDataBound
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers before column menu opens.
     *
     * @event columnMenuOpen
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when toolbar item was clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers when click on column menu.
     *
     * @event columnMenuClick
     */
    columnMenuClick?: EmitType<ColumnMenuClickEventArgs>;

    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     */
    contextMenuOpen?: EmitType<CMenuOpenEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    contextMenuClick?: EmitType<CMenuClickEventArgs>;

    /**
     * This event will be triggered when click on taskbar element.
     *
     * @event onTaskbarClick
     */
    onTaskbarClick?: EmitType<ITaskbarClickEventArgs>;

    /**
     * This event will be triggered when double click on record.
     *
     * @event recordDoubleClick
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * This event will be triggered when mouse move on Gantt.
     *
     * @event onMouseMove
     */
    onMouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers before Gantt data is exported to PDF document.
     *
     * @event beforePdfExport
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to PDF document.
     *
     * @event pdfExportComplete
     */
    pdfExportComplete?: EmitType<Object>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each taskbar to PDF document. You can also customize the taskbar.
     *
     * @event pdfQueryTaskbarInfo
     */
    pdfQueryTaskbarInfo?: EmitType<Object>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryTimelineCellInfo
     */
    pdfQueryTimelineCellInfo?: EmitType<PdfQueryTimelineCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfColumnHeaderQueryCellInfo
     */
    pdfColumnHeaderQueryCellInfo?: EmitType<PdfColumnHeaderQueryCellInfoEventArgs>;

}