import { Component, createElement, Complex, addClass, removeClass, Event, EmitType, formatUnit, Browser } from '@syncfusion/ej2-base';import { Internationalization, extend, getValue, isObjectArray, isObject, setValue, isUndefined, isBlazor } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, L10n, ModuleDeclaration, EventHandler } from '@syncfusion/ej2-base';import { isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, Collection, append, remove } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';import { RowDragEventArgs } from '@syncfusion/ej2-grids';import { TaskProcessor } from './task-processor';import { GanttChart } from './gantt-chart';import { Timeline } from '../renderer/timeline';import { GanttTreeGrid } from './tree-grid';import { Toolbar } from '../actions/toolbar';import { IGanttData, IWorkingTimeRange, IQueryTaskbarInfoEventArgs, BeforeTooltipRenderEventArgs, IDependencyEventArgs } from './interface';import { ITaskbarEditedEventArgs, IParent, ITaskData, PdfColumnHeaderQueryCellInfoEventArgs } from './interface';import { ICollapsingEventArgs, CellEditArgs, PdfQueryTimelineCellInfoEventArgs } from './interface';import { IConnectorLineObject, IValidateArgs, IValidateMode, ITaskAddedEventArgs, IKeyPressedEventArgs } from './interface';import { PdfExportProperties, ISplitterResizedEventArgs } from './interface';import { ZoomEventArgs, IActionBeginEventArgs, CellSelectingEventArgs, RowDeselectEventArgs, PdfQueryCellInfoEventArgs } from './interface';import { ITimeSpanEventArgs, ZoomTimelineSettings, QueryCellInfoEventArgs, RowDataBoundEventArgs, RowSelectEventArgs } from './interface';import { TaskFieldsModel, TimelineSettingsModel, SplitterSettingsModel, SortSettings, SortSettingsModel } from '../models/models';import { EventMarkerModel, AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, EditSettingsModel } from '../models/models';import { HolidayModel, DayWorkingTimeModel, FilterSettingsModel, SelectionSettingsModel } from '../models/models';import { TaskFields, TimelineSettings, Holiday, EventMarker, DayWorkingTime, EditSettings, SelectionSettings } from '../models/models';import { FilterSettings, SplitterSettings, TooltipSettings, LabelSettings, LabelSettingsModel } from '../models/models';import { SearchSettingsModel, SearchSettings, ResourceFields, ResourceFieldsModel } from '../models/models';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { DateProcessor } from './date-processor';import { ChartRows } from '../renderer/chart-rows';import { Dependency } from '../actions/dependency';import * as cls from './css-constants';import { Query, DataManager } from '@syncfusion/ej2-data';import { Column, ColumnModel } from '../models/column';import { TreeGrid, FilterSettingsModel as TreeGridFilterSettingModel } from '@syncfusion/ej2-treegrid';import { Sort } from '../actions/sort';import { CellSelectEventArgs, ISelectedCell, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { CellDeselectEventArgs, IIndex, FailureEventArgs } from '@syncfusion/ej2-grids';import { HeaderCellInfoEventArgs, ColumnMenuClickEventArgs, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuItemModel, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { RowDD } from '../actions/rowdragdrop';import { Filter } from '../actions/filter';import { PageEventArgs, FilterEventArgs, SortEventArgs, ResizeArgs, ColumnDragEventArgs, getActualProperties } from '@syncfusion/ej2-grids';import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';import { ConnectorLine } from '../renderer/connector-line';import { ConnectorLineEdit } from '../actions/connector-line-edit';import { Edit } from '../actions/edit';import { Splitter } from './splitter';import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';import { TooltipSettingsModel } from '../models/tooltip-settings-model';import { Tooltip } from '../renderer/tooltip';import { ToolbarItem, ColumnMenuItem, RowPosition, DurationUnit, SortDirection } from './enum';import { GridLine, ContextMenuItem, ScheduleMode, ViewType } from './enum';import { Selection } from '../actions/selection';import { ExcelExport } from '../actions/excel-export';import { DayMarkers } from '../actions/day-markers';import { ContextMenu } from './../actions/context-menu';import { RowSelectingEventArgs } from './interface';import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './interface';import { ColumnMenu } from '../actions/column-menu';import { ITaskbarClickEventArgs, RecordDoubleClickEventArgs, IMouseMoveEventArgs } from './interface';import { PdfExport } from '../actions/pdf-export';import { WorkUnit, TaskType } from './enum';import { FocusModule } from '../actions/keyboard';import { VirtualScroll } from '../actions/virtual-scroll';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Gantt
 */
export interface GanttModel extends ComponentModel{

    /**
     * Enables or disables the key board interaction of Gantt.
     * 
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
     * @default true
     */
    disableHtmlEncode?: boolean;

    /**
     * Enables or disables the focusing the task bar on click action.
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
     * If `enablePredecessorValidation` is set to true, it allows to validate the predecessor link.
     * @default true
     */
    enablePredecessorValidation?: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     * @default false
     */
    showColumnMenu?: boolean;

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
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * By default, task schedule dates are calculated with system time zone.If Gantt chart assigned with specific time zone, 
     * then schedule dates are calculated as given time zone date value.
     * @default null
     */
    timezone?: string;

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
     * To define expander column index in Grid.
     * @default 0
     * @aspType int
     * @blazorType int
     */
    treeColumnIndex?: number;

    /**
     * It is used to render Gantt chart rows and tasks.
     * `dataSource` value was defined as array of JavaScript objects or instances of `DataManager`.
     * {% codeBlock src='gantt/dataSource/index.md' %}{% endcodeBlock %}
     * @isGenericType true
     * @default []
     */
    dataSource?: Object[] | DataManager;

    /**
     * `durationUnit` Specifies the duration unit for each tasks whether day or hour or minute.
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
     * By default, the format is based on the culture.
     */
    dateFormat?: string;

    /**
     * Defines the height of the Gantt component container.
     * @default 'auto'
     */
    height?: number | string;

    /**
     * If `renderBaseline` is set to `true`, then baselines are rendered for tasks.
     * @default false
     */
    renderBaseline?: boolean;

    /**
     * Configures the grid lines in tree grid and gantt chart.
     */
    gridLines?: GridLine;

    /**
     * Defines the right, left and inner task labels in task bar.
     * {% codeBlock src='gantt/labelSettings/index.md' %}{% endcodeBlock %}
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
     * Defines the baseline bar color.
     */
    baselineColor?: string;

    /**
     * Defines the width of the Gantt component container.
     * @default 'auto'
     */
    width?: number | string;

    /**
   * If `enableVirtualization` set to true, then the Gantt will render only the rows visible within the view-port
   * and load subsequent rows on vertical scrolling. This helps to load large dataset in Gantt.
   * @default false
   */
    enableVirtualization?: boolean;

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
     * * ExcelExport: To export in Excel format.
     * * CsvExport : To export in CSV format.    
     * * Indent: To indent a task to one level.
     * * Outdent: To outdent a task from one level.
     * @default null
     */
    toolbar?: (ToolbarItem | string | ItemModel)[];

    /**
     * Defines workweek of project.
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
     * To show notes column cell values inside the cell or in tooltip.
     * @default false
     * @deprecated
     */
    showInlineNotes?: boolean;

    /**
     * Defines height value for grid rows and chart rows in Gantt.
     * @default 36
     * @aspType int
     * @blazorType int
     */
    rowHeight?: number;

    /**
     * Defines height of taskbar element in Gantt.
     * @aspType int?
     * @blazorType int
     * @isBlazorNullableType true
     */
    taskbarHeight?: number;

    /**
     * Defines start date of the project, if `projectStartDate` value not set then it will be calculated from data source.
     * @default null
     * @blazorType Date
     */
    projectStartDate?: Date | string;

    /**
     * Defines end date of the project, if `projectEndDate` value not set then it will be calculated from data source.
     * @default null     
     * @blazorType Date
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
     * Defines segment collection assigned for tasks.
     * @default []
     */
    segmentData?: Object[];

    /**
     * Defines background color of dependency lines.
     * @default null
     */
    connectorLineBackground?: string;

    /**
     * Defines width of dependency lines.
     * @default 1
     * @aspType int
     * @blazorType int
     */
    connectorLineWidth?: number;

    /**
     * Defines column collection displayed in grid
     * If the `columns` declaration was empty then `columns` are automatically populated from `taskSettings` value.
     * {% codeBlock src='gantt/columns/index.md' %}{% endcodeBlock %}
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Defines the tabs and fields to be included in the add dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * {% codeBlock src='gantt/addDialogFields/index.md' %}{% endcodeBlock %}
     * @default []
     */
    addDialogFields?: AddDialogFieldSettingsModel[];

    /**
     * Defines the tabs and fields to be included in the edit dialog.
     * If the value was empty, then it will be calculated from `taskSettings` and `columns` value.
     * {% codeBlock src='gantt/editDialogFields/index.md' %}{% endcodeBlock %}
     * @default []
     */
    editDialogFields?: EditDialogFieldSettingsModel[];

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering. 
     * You can also get the currently selected row index.
     * @default -1
     * @aspType int
     * @blazorType int
     */
    selectedRowIndex?: number;

    /**
     * `workUnit` Specifies the work unit for each tasks whether day or hour or minute.
     * * `day`: Sets the work unit as day.
     * * `hour`: Sets the work unit as hour.
     * * `minute`: Sets the work unit as minute.
     * @default hour
     */
    workUnit?: WorkUnit;

    /**
     * `taskType` Specifies the task type for task whether fixedUnit or fixedWork or fixedDuration.
     * * `fixedUnit`: Sets the task type as fixedUnit.
     * * `fixedWork`: Sets the task type as fixedWork.
     * * `fixedDuration`: Sets the task type as fixedDuration.
     * @default fixedUnit
     */
    taskType?: TaskType;

    /**
     * Defines the view type of the Gantt.
     */
    viewType?: ViewType;

    /**
     * Defines customized working time of project.
     * {% codeBlock src='gantt/dayWorkingTime/index.md' %}{% endcodeBlock %} 
     */
    dayWorkingTime?: DayWorkingTimeModel[];

    /**
     * Defines holidays presented in project timeline.
     * {% codeBlock src='gantt/holidays/index.md' %}{% endcodeBlock %}
     * @default []
     */
    holidays?: HolidayModel[];

    /**
     * Defines events and status of project throughout the timeline.
     * {% codeBlock src='gantt/eventMarkers/index.md' %}{% endcodeBlock %}
     * @default []
     */
    eventMarkers?: EventMarkerModel[];

    /**
     * Defines mapping properties to find task values such as id, start date, end date, duration and progress values from data source.
     * {% codeBlock src='gantt/taskFields/index.md' %}{% endcodeBlock %}
     */
    taskFields?: TaskFieldsModel;

    /**
     * Defines mapping properties to find resource values such as id, name, unit and group from resource collection.
     */
    resourceFields?: ResourceFieldsModel;

    /**
     * Configures timeline settings of Gantt.
     * Defines default timeline modes or customized top tier mode and bottom tier mode or single tier only.
     * {% codeBlock src='gantt/timelineSettings/index.md' %}{% endcodeBlock %}
     */
    timelineSettings?: TimelineSettingsModel;

    /**
     * Configures the sort settings of the Gantt.
     * {% codeBlock src='gantt/sortSettings/index.md' %}{% endcodeBlock %}
     * @default {columns:[]}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures edit settings of Gantt.
     * {% codeBlock src='gantt/editSettings/index.md' %}{% endcodeBlock %}
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Auto',
     * showDeleteConfirmDialog: false } 
     */
    editSettings?: EditSettingsModel;

    /**
     * Enables or disables default tooltip of Gantt element and defines customized tooltip for Gantt elements.
     * {% codeBlock src='gantt/tooltipSettings/index.md' %}{% endcodeBlock %}
     * @default { showTooltip: true } 
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Configures the selection settings.
     * {% codeBlock src='gantt/selectionSettings/index.md' %}{% endcodeBlock %}
     * @default {mode: 'Row', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Enables or disables filtering support in Gantt.
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export Gantt to Excel and CSV file.
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * If `allowRowDragAndDrop` set to true, then it will allow the user to perform drag and drop action in Gantt.
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * If `allowReordering` is set to true, Gantt columns can be reordered. 
     * Reordering can be done by drag and drop of a particular column from one index to another index.  
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `readOnly` is set to true, Gantt cannot be edited.      
     * @default false
     */
    readOnly?: boolean;

    /**
     * If `allowResizing` is set to true, Gantt columns can be resized.      
     * @default false
     */
    allowResizing?: boolean;

    /**
     * If `enableContextMenu` is set to true, Enable context menu in Gantt.
     * @default false
     */
    enableContextMenu?: boolean;

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * {% codeBlock src='gantt/contextMenuItems/index.md' %}{% endcodeBlock %}
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export Gantt to PDF file.
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * If `validateManualTasksOnLinking` is set to true, 
     * it enables date validation while connecting manually scheduled tasks with predecessor
     * @default false
     */

    validateManualTasksOnLinking?: boolean;

    /**
     * It enables to render the child taskbar on parent row for resource view Gantt.
     * @default false
     */
    enableMultiTaskbar?: boolean;

    /**
     * It enables to render the overallocation container for resource view Gantt.
     * @default false
     */
    showOverAllocation?: boolean;

    /**
     * Specifies task schedule mode for a project.
     */
    taskMode?: ScheduleMode;

    /**
     * Configures the filter settings for Gantt.
     * {% codeBlock src='gantt/filterSettings/index.md' %}{% endcodeBlock %}
     * @default {columns: [], type: 'Menu' }
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Configures the search settings for Gantt.
     * {% codeBlock src='gantt/searchSettings/index.md' %}{% endcodeBlock %}
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Configures the splitter settings for Gantt.
     * {% codeBlock src='gantt/splitterSettings/index.md' %}{% endcodeBlock %}
     */
    splitterSettings?: SplitterSettingsModel;

    /**
     * This will be triggered after the taskbar element is appended to the Gantt element.
     * @event 
     */
    queryTaskbarInfo?: EmitType<IQueryTaskbarInfoEventArgs>;

    /**
     * Triggers before Gantt data is exported to Excel file.
     * @deprecated
     * @event
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after Gantt data is exported to Excel file.
     * @deprecated
     * @event
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @deprecated
     * @event
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @deprecated
     * @event
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously.
     * @event
     * @deprecated
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s drag(move) starts.
     * @event
     * @deprecated
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s before drag(move).
     * @event
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row.
     * @event
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * This will be triggered before the row getting collapsed.
     * @event
     */
    collapsing?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting collapsed.
     * @event
     */
    collapsed?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered before the row getting expanded.
     * @event 
     */
    expanding?: EmitType<ICollapsingEventArgs>;

    /**
     * This will be triggered after the row getting expanded.
     * @event
     */
    expanded?: EmitType<ICollapsingEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc., starts.
     * @blazorproperty 'OnActionBegin'
     * @blazorType Syncfusion.EJ2.Blazor.Gantt.ActionBeginArgs<TValue>
     * @event
     */
    /* tslint:disable-next-line */
    actionBegin?: EmitType<object | PageEventArgs | FilterEventArgs | SortEventArgs | ITimeSpanEventArgs | IDependencyEventArgs | ITaskAddedEventArgs | ZoomEventArgs>;

    /**
     * Triggers when Gantt actions such as sorting, filtering, searching etc. are completed.
     * @event
     * @blazorproperty 'OnActionComplete'
     * @blazorType Syncfusion.EJ2.Blazor.Gantt.ActionCompleteArgs<TValue>
     */
    actionComplete?: EmitType<FilterEventArgs | SortEventArgs | ITaskAddedEventArgs | IKeyPressedEventArgs | ZoomEventArgs>;

    /**
     * Triggers when actions are failed.
     * @event
     * @blazorproperty 'OnActionFailure'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.FailureEventArgs
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * This will be triggered taskbar was dragged and dropped on new position.
     * @event
     */
    taskbarEdited?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered when a task get saved by cell edit.
     * @event 
     */
    endEdit?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * This will be triggered a cell get begins to edit.
     * @event
     * @blazorproperty 'OnCellEdit'
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggered before the Gantt control gets rendered.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<Object>;

    /**
     * Triggers when the component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * This event will be triggered when taskbar was in dragging state.
     * @event 
     */
    taskbarEditing?: EmitType<ITaskbarEditedEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when column resize starts.
     * @deprecated
     * @event
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     * @deprecated
     * @event
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     * @deprecated
     * @event
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when splitter resizing starts.
     * @event
     * @blazorType Syncfusion.EJ2.Blazor.Layouts.ResizeEventArgs
     */
    splitterResizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when splitter bar was dragging.
     * @event
     * @blazorType Syncfusion.EJ2.Blazor.Layouts.ResizingEventArgs
     */
    splitterResizing?: EmitType<ResizingEventArgs>;

    /**
     * Triggers when splitter resizing action completed.
     * @event
     */
    splitterResized?: EmitType<ISplitterResizedEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     * @deprecated 
     * @event
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     * @deprecated 
     * @event
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     * @deprecated 
     * @event
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers before tooltip get rendered.
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
     * @deprecated
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
     * @blazorType Syncfusion.EJ2.Blazor.Grids.CellSelectEventArgs<TValue>
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @deprecated
     * @event 
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     * @deprecated
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
     * @blazorType Syncfusion.EJ2.Blazor.Grids.HeaderCellInfoEventArgs 
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * This will be triggered before the row element is appended to the Grid element.
     * @event
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers before column menu opens.
     * @deprecated
     * @event 
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when toolbar item was clicked.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event
     * @blazorproperty 'ColumnMenuClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnMenuClickEventArgs
     */
    columnMenuClick?: EmitType<ColumnMenuClickEventArgs>;

    /**
     * Triggers before context menu opens.
     * @event
     * @blazorType Syncfusion.EJ2.Blazor.Gantt.ContextMenuOpenEventArgs<TValue>
     */
    contextMenuOpen?: EmitType<CMenuOpenEventArgs>;

    /**
     * Triggers when click on context menu.
     * @event
     * @blazorproperty 'ContextMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Gantt.ContextMenuClickEventArgs<TValue>
     */
    contextMenuClick?: EmitType<CMenuClickEventArgs>;

    /**
     * This event will be triggered when click on taskbar element.
     * @deprecated
     * @event 
     */
    onTaskbarClick?: EmitType<ITaskbarClickEventArgs>;

    /**
     * This event will be triggered when double click on record.
     * @deprecated
     * @event 
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * This event will be triggered when mouse move on Gantt.
     * @deprecated
     * @event 
     */
    onMouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers before Gantt data is exported to PDF document.
     * @event
     * @deprecated
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to PDF document.
     * @event
     * @deprecated
     */
    pdfExportComplete?: EmitType<Object>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each taskbar to PDF document. You can also customize the taskbar.
     * @event
     * @deprecated
     */
    pdfQueryTaskbarInfo?: EmitType<Object>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated
     */
    pdfQueryTimelineCellInfo?: EmitType<PdfQueryTimelineCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated 
     */
    pdfColumnHeaderQueryCellInfo?: EmitType<PdfColumnHeaderQueryCellInfoEventArgs>;

}