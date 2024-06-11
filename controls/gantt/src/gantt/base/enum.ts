/**
 * To define duration unit for whole project
 * ```props
 * * Minute :- To define unit value of duration as minute.
 * * Hour :- To define unit value of duration as hour.
 * * Day :- To define unit value of duration as day.
 * ```
 */
export type DurationUnit =
    'Minute' |
    'Hour' |
    'Day';

/**
 * To define grid lines in Gantt
 * ```props
 * * Horizontal :- Define horizontal lines.
 * * Vertical :- Define vertical lines.
 * * Both :- Define both horizontal and vertical lines.
 * * None :- Define no lines.
 * ```
 */
export type GridLine =
    'Horizontal' |
    'Vertical' |
    'Both' |
    'None';

/**
 * To define the day of a week
 * ```props
 * * Monday :- To define the day as Monday.
 * * Tuesday :- To define the day as Tuesday.
 * * Wednesday :- To define the day as Wednesday.
 * * Thursday :- To define the day as Thursday.
 * * Friday :- To define the day as Friday.
 * * Saturday :- To define the day as Saturday.
 * * Sunday :- To define the day as Sunday.
 * ```
 */
export type DayOfWeek =
    'Monday' |
    'Tuesday' |
    'Wednesday' |
    'Thursday' |
    'Friday' |
    'Saturday' |
    'Sunday';

/**
 * To define toolbar items in Gantt
 * ```props
 * * Add :- Add new record.
 * * Delete :- Delete selected record.
 * * Update :- Update edited record.
 * * Cancel :- Cancel the edited state.
 * * Edit :- Edit the selected record.
 * * Search :- Searches the grid records by given key.
 * * ExpandAll :- Expand all the parents.
 * * CollapseAll :- Collapse all the parents.
 * * PrevTimeSpan :- Move HScroll to prevTimeSpan.
 * * NextTimeSpan :- Move HScroll to nextTimeSpan.
 * * ZoomIn :- To perform Zoom in action on Gantt timeline.
 * * ZoomOut :- To perform zoom out action on Gantt timeline.
 * * ZoomToFit :- To show all project task in available chart width.
 * * ExcelExport :- To export Gantt in excel sheet.
 * * CsvExport :- To export Gantt in CSV.
 * * PdfExport :- To export Gantt in PDF.
 * * Indent :- To indent a selected record.
 * * Outdent :- To outdent a selected record.
 * * CriticalPath :- To enable critical path.
 * * Undo :- To enable undo action.
 * * Redo :- To enable redo action.
 * ```
 */
export type ToolbarItem =
    'Add' |
    'Delete' |
    'Update' |
    'Cancel' |
    'Edit' |
    'Search' |
    'ExpandAll' |
    'CollapseAll' |
    'PrevTimeSpan' |
    'NextTimeSpan' |
    'ZoomIn'|
    'ZoomOut'|
    'ZoomToFit' |
    'ExcelExport' |
    'CsvExport' |
    'PdfExport' |
    'Indent' |
    'Outdent' |
    'CriticalPath'|
    'Undo'|
    'Redo';

/**
 * Defines the Undo Redo actions. They are
 * ```props
 * * Sorting :- Define the sorting action in undo/redo.
 * * ColumnReorder :- Define the columnReorder action in undo/redo.
 * * ColumnResize :- Define the columnResize action in undo/redo.
 * * Delete :- Define the Delete action in undo/redo.
 * * Edit :- Define the Edit action in undo/redo.
 * * Add :- Define the Add action in undo/redo.
 * * Search :- Define the search action in undo/redo.
 * * Filtering :- Define the Filtering action in undo/redo.
 * * ZoomIn :- Define the ZoomIn action in undo/redo.
 * * ZoomOut :- Define the ZoomOut action in undo/redo.
 * * ZoomToFit :- Define the ZoomToFit action in undo/redo.
 * * ColumnState :- Define the ColumnState action in undo/redo.
 * * PreviousTimeSpan :- Define the PreviousTimeSpan action in undo/redo.
 * * NextTimeSpan :- Define the NextTimeSpan action in undo/redo.
 * * Indent :- Define the Indent action in undo/redo.
 * * Outdent :- Define the Outdent action in undo/redo.
 * * RowDragAndDrop :- Define the RowDragAndDrop action in undo/redo.
 * * TaskbarDragAndDrop :- Define the TaskbarDragAndDrop action in undo/redo.
 * ```
 */
export type GanttAction =
'Sorting' |
'ColumnReorder' |
'ColumnResize' |
'Delete' |
'Edit' |
'Add' |
'Search' |
'Filtering' |
'ZoomIn' |
'ZoomOut' |
'ZoomToFit' |
'ColumnState' |
'PreviousTimeSpan' |
'NextTimeSpan' |
'Indent' |
'Outdent' |
'RowDragAndDrop' |
'TaskbarDragAndDrop';

/**
 * Defines the schedule header mode. They are
 * ```props
 * * None :- Define the default mode header.
 * * Week :- Define the week mode header.
 * * Day :- Define the day mode header.
 * * Hour :- Define the hour mode header.
 * * Month :- Define the month mode header.
 * * Year :- Define the year mode header.
 * * Minutes :- Define the minutes mode header.
 * ```
 */
export type TimelineViewMode =
    'None' |
    'Week' |
    'Day' |
    'Hour' |
    'Month' |
    'Year' |
    'Minutes';

/**
 * Defines modes of editing.
 * ```props
 * * Auto :- Defines Cell editing in TreeGrid and dialog in chart side.
 * * Dialog :- Defines EditMode as Dialog.
 * ```
 */
export type EditMode =
    'Auto' |
    'Dialog';

/**
 * Defines the default items of Column menu
 * ```props
 * * SortAscending :- Sort the current column in ascending order.
 * * SortDescending :- Sort the current column in descending order.
 * * ColumnChooser :- show the column chooser.
 * * Filter :- show the Filter popup.
 * ```
 */
export type ColumnMenuItem =
    'SortAscending' |
    'SortDescending' |
    'ColumnChooser' |
    'Filter';

/**
 * Defines tab container type in add or edit dialog
 * ```props
 * * General :- Defines tab container type as general.
 * * Dependency :- Defines tab as dependency editor.
 * * Resources :- Defines tab as resources editor.
 * * Notes :- Defines tab as notes editor.
 * * Custom :- Defines tab as custom column editor.
 * * Segments :- Defines tab as task segments editor.
 * ```
 */
export type DialogFieldType =
    'General' |
    'Dependency' |
    'Resources' |
    'Notes' |
    'Custom' |
    'Segments';

/**
 * Defines filter type of Gantt
 * ```props
 * * Menu :- Defines filter type as menu.
 * * Excel :- Specifies the filtersetting type as excel.
 * ```
 */
export type FilterType =
    'Menu' |
    'Excel';

/**
 * To define hierarchy mode on filter action
 * ```props
 * * Parent :- Shows the filtered record with parent record.
 * * Child :- Shows the filtered record with child record.
 * * Both :- Shows the filtered record with both parent and child record.
 * * None :- Shows only filtered record.
 * ```
 */
export type FilterHierarchyMode =
    'Parent' |
    'Child' |
    'Both' |
    'None';
/**
 * To define hierarchy mode on search action
 * ```props
 * * Parent :- Shows the filtered record with parent record.
 * * Child :- Shows the filtered record with child record.
 * * Both :- Shows the filtered record with both parent and child record.
 * * None :- Shows only filtered record.
 * ```
 */
export type SearchHierarchyMode =
    'Parent' |
    'Child' |
    'Both' |
    'None';

/**
 * To define initial view of Gantt
 * ```props
 * * Default :- Shows grid side and side of Gantt.
 * * Grid :- Shows grid side alone in Gantt.
 * * Chart :- Shows chart side alone in Gantt.
 * ```
 */
export type SplitterView =
    'Default' |
    'Grid' |
    'Chart';
/**
 * To define new position for add action
 * ```props
 * * Top :- Defines new row position as top of all rows.
 * * Bottom :- Defines new row position as bottom of all rows.
 * * Above :- Defines new row position as above the selected row.
 * * Below :- Defines new row position as below the selected row.
 * * Child :- Defines new row position as child to the selected row.
 * ```
 */
export type RowPosition =
    'Top' |
    'Bottom' |
    'Above' |
    'Below' |
    'Child';

/**
 * Defines directions of Sorting. They are
 * ```props
 * * Ascending :- Defines SortDirection as Ascending.
 * * Descending :- Defines SortDirection as Descending.
 * ```
 */
export type SortDirection =
    'Ascending' |
    'Descending';

/**
 * Defines predefined contextmenu items.
 *
 * ```props
 * * AutoFitAll :- Defines Auto fit the size of all columns.
 * * AutoFit :- Defines Auto fit the current column.
 * * SortAscending :- Defines SortDirection as Ascending.
 * * SortDescending :- Defines SortDirection as Descending.
 * * TaskInformation :- Defines the Task details.
 * * Add :- Defines the new record on add action.
 * * Save :- Defines the save the modified values.
 * * Cancel :- Defines the cancel the modified values.
 * * DeleteTask :- Defines the delete task.
 * * DeleteDependency :- Defines the delete dependency task.
 * * Convert :- Defines the convert to task or milestone.
 * * Split Task :- Defines the split a task or segment into two segmentse.
 * * Merge Task :- Defines the merge two segments into one segment.
 * ```
 *
 * @hidden
 */

export type ContextMenuItem =
    'AutoFitAll' |
    'AutoFit' |
    'SortAscending' |
    'SortDescending' |
    'TaskInformation' |
    'Add' |
    'Save' |
    'Cancel' |
    'DeleteTask' |
    'DeleteDependency' |
    'Convert' |
    'Split Task' |
    'Merge Task';

/**
 * Defines contextmenu types.
 *
 * ```props
 * * Header :- Defines the header type context menu.
 * * Content :- Defines the content type context menu.
 * ```
 *
 * @hidden
 */

export type ContextMenuType =
    'Header' |
    'Content';

/**
 * To define work unit for whole project
 * ```props
 * * Minute :- To define unit value of work as minute.
 * * Hour :- To define unit value of work as hour.
 * * Day :- To define unit value of work as day.
 * ```
 */
export type WorkUnit =
    'Minute' |
    'Hour' |
    'Day';

/**
 * To define task type for task
 * ```props
 * * FixedUnit :- To define task type as fixedUnit.
 * * FixedWork :- To define task type as fixedWork.
 * * FixedDuration :- To define task type as fixedDuration.
 * ```
 */
export type TaskType =
    'FixedUnit' |
    'FixedWork' |
    'FixedDuration';

/**
 * Defines PDF page Size.
 * ```props
 * * Letter :- Letter size
 * * Note :- Note size
 * * Legal :- Legal size
 * * A0 :- A0 size
 * * A1 :- A1 size
 * * A2 :- A2 size
 * * A3 :- A3 size
 * * A4 :- A4 size
 * * A5 :- A5 size
 * * A6 :- A6 size
 * * A7 :- A7 size
 * * A8 :- A8 size
 * * A9 :- A9 size
 * * B0 :- B0 size
 * * B1 :- B1 size
 * * B2 :- B2 size
 * * B3 :- B3 size
 * * B4 :- B4 size
 * * B5 :- B5 size
 * * Archa :- Arch A size
 * * Archb :- Arch B size
 * * Archc :- Arch C size
 * * Archd :- Arch D size
 * * Arche :- Arch E size
 * * Flsa :- Flsa size
 * * HalfLetter :- HalfLetter size
 * * Letter11x17 :- Letter11x17 size
 * * Ledger :- Ledger size
 * ```
 */
export type PdfPageSize =
    'Letter' |
    'Note' |
    'Legal' |
    'A0' |
    'A1' |
    'A2' |
    'A3' |
    'A4' |
    'A5' |
    'A6' |
    'A7' |
    'A8' |
    'A9' |
    'B0' |
    'B1' |
    'B2' |
    'B3' |
    'B4' |
    'B5' |
    'Archa' |
    'Archb' |
    'Archc' |
    'Archd' |
    'Arche' |
    'Flsa' |
    'HalfLetter' |
    'Letter11x17' |
    'Ledger';

/**
 * Defines PDF page orientation.
 * ```props
 * * Landscape :- Landscape Orientation.
 * * Portrait :- Portrait Orientation.
 * ```
 */
export type PageOrientation =
    'Landscape' |
    'Portrait';

/**
 * Defines the PDF dash style.
 * ```props
 * * Solid :- Solid DashStyle
 * * Dash :- Dash DashStyle
 * * Dot :- Dot DashStyle
 * * DashDot :- DashDot DashStyle
 * * DashDotDot :- DashDotDot DashStyle
 * ```
 */
export type PdfDashStyle =
    'Solid' |
    'Dash' |
    'Dot' |
    'DashDot' |
    'DashDotDot';

/**
 * Defines PDF horizontal alignment.
 * ```props
 * * Left :- Aligns PDF content to left.
 * * Right :- Aligns PDF content to right.
 * * Center :- Aligns PDF content to center.
 * * Justify :- Aligns PDF content to justify.
 * ```
 */
export type PdfHAlign =
    'Left' |
    'Right' |
    'Center' |
    'Justify';

/**
 * Defines PDF vertical alignment.
 * ```props
 * * Top :- Aligns PDF content to top.
 * * Bottom :- Aligns PDF content to bottom.
 * * Middle :- Aligns PDF content to middle.
 * ```
 */
export type PdfVAlign =
    'Top' |
    'Bottom' |
    'Middle';


/**
 * Defines Export Type.
 * ```props
 * * CurrentViewData :- Current view data in gantt is exported.
 * * AllData :- All data of the gantt is exported.
 * ```
 */
export type ExportType =
    'CurrentViewData' |
    'AllData';

/**
 * Defines the exporting theme
 * ```props
 * * Material :- Material theme.
 * * Fabric :- Fabric theme.
 * * Bootstrap :- Bootstrap theme.
 * * Bootstrap 4 :- Bootstrap 4 theme.
 * ```
 */
export type PdfTheme =
    'Material' |
    'Fabric' |
    'Bootstrap' |
    'Bootstrap 4';

/**
 * @hidden
 */
export type CObject =
    { [key: string]: Object; };
/**
 * To define schedule mode of Gantt
 * ```props
 * * Auto :- Tasks are displayed in auto scheduled mode.
 * * Manual :- Tasks are displayed in manual scheduled mode.
 * * Custom :- Tasks are displayed in custom scheduled mode.
 * ```
 */
export type ScheduleMode =
'Auto' |
'Manual' |
'Custom';
/*
* To define view type of the Gantt
* ```props
 * * ProjectView :- Define project view type Gantt.
 * * ResourceView :- Define resource view type Gantt.
 * ```
*/
export type ViewType =
   'ProjectView' |
   'ResourceView';

/**
 * Defines PDF ContentType.
 * ```props
 * * Image :- PDF content is Image type
 * * Line :- PDF content is Line type
 * * PageNumber :- PDF content is PageNumber type
 * * Text :- PDF content is Text type
 * ```
 */
export type ContentType =
'Image' |
'Line' |
'PageNumber' |
'Text';

/**
 * Defines PDF PageNumber Type.
 * ```props
 * * LowerLatin :- LowerCase Latin pageNumber
 * * LowerRoman :- LowerCase Roman pageNumber
 * * UpperLatin :- UpperCase Latin pageNumber
 * * UpperRoman :- UpperCase Roman pageNumber
 * * Numeric :- Numeric pageNumber
 * * Arabic :- Arabic pageNumber
 * ```
 */
export type PdfPageNumberType =
    'LowerLatin' |
    'LowerRoman' |
    'UpperLatin' |
    'UpperRoman' |
    'Numeric' |
    'Arabic';
