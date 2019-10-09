/**
 * To define duration unit for whole project
 */
export type DurationUnit =
    /** To define unit value of duration as minute */
    'Minute' |
    /** To define unit value of duration as hour */
    'Hour' |
    /** To define unit value of duration as day */
    'Day';

/**
 * To define grid lines in Gantt
 */
export type GridLine =
    /** Define horizontal lines */
    'Horizontal' |
    /** Define vertical lines */
    'Vertical' |
    /** Define both horizontal and vertical lines */
    'Both' |
    /** Define no lines */
    'None';

/**
 * To define toolbar items in Gantt
 */
export type ToolbarItem =
    /** Add new record */
    'Add' |
    /** Delete selected record */
    'Delete' |
    /** Update edited record */
    'Update' |
    /** Cancel the edited state */
    'Cancel' |
    /** Edit the selected record */
    'Edit' |
    /** Searches the grid records by given key */
    'Search' |
    /** Expand all the parents */
    'ExpandAll' |
    /** Collapse all the parents */
    'CollapseAll' |
    /** Move HScroll to PrevTimeSpan */
    'PrevTimeSpan' |
    /** Move HScroll to nextTimeSpan */
    'NextTimeSpan' |
     /** To perform Zoom in action on Gantt timeline */
    'ZoomIn'|
     /** To perform zoom out action on Gantt timeline */
    'ZoomOut'|
     /** To show all project task in available chart width */
    'ZoomToFit' |
     /** To export Gantt in excel sheet */
    'ExcelExport' |
     /** To export Gantt is CSV */
    'CsvExport';

/** 
 * Defines the schedule header mode. They are
 * * none - Define the default mode header.
 * * week - Define the week mode header.
 * * day - Define the day mode header.
 * * hours - Define the hours mode header.
 * * minute - Define the minutes mode header.
 */
export type TimelineViewMode =
    /** Default. */
    'None' |
    /** Define the week mode header. */
    'Week' |
    /** Define the day mode header. */
    'Day' |
    /** Define the hour mode header. */
    'Hour' |
    /** Define the month mode header. */
    'Month' |
    /** Define the year mode header. */
    'Year' |
    /** Define the minutes mode header. */
    'Minutes';

/** 
 * Defines modes of editing.
 * * Auto
 * * Dialog 
 */
export type EditMode =
    /**  Defines Cell editing in TreeGrid and dialog in chart side */
    'Auto' |
    /**  Defines EditMode as Dialog */
    'Dialog';

/**
 * Defines the default items of Column menu
 */
export type ColumnMenuItem =
    /**  Sort the current column in ascending order */
    'SortAscending' |
    /**  Sort the current column in descending order */
    'SortDescending' |
    /**  show the column chooser */
    'ColumnChooser' |
    /**  show the Filter popup */
    'Filter';

/**
 * Defines tab container type in add or edit dialog
 */
export type DialogFieldType =
    /** Defines tab container type as general  */
    'General' |
    /**  Defines tab as dependency editor */
    'Dependency' |
    /** Defines tab as resources editor */
    'Resources' |
    /** Defines tab as notes editor */
    'Notes' |
    /** Defines tab as custom column editor */
    'Custom';

/**
 * Defines filter type of Gantt
 */
export type FilterType =
    /** Defines filter type as menu */
    'Menu';

/**
 * To define hierarchy mode on filter action
 */
export type FilterHierarchyMode =
    /** Shows the filtered record with parent record */
    'Parent' |
    /** Shows the filtered record with child record */
    'Child' |
    /** Shows the filtered record with both parent and child record */
    'Both' |
    /** Shows only filtered record */
    'None';
/**
 * To define hierarchy mode on search action
 */
export type SearchHierarchyMode =
    /** Shows the filtered record with parent record */
    'Parent' |
    /** Shows the filtered record with child record */
    'Child' |
    /** Shows the filtered record with both parent and child record */
    'Both' |
    /** Shows only filtered record */
    'None';

/**
 * To define initial view of Gantt
 */
export type SplitterView =
    /** Shows grid side and side of Gantt */
    'Default' |
    /** Shows grid side alone in Gantt */
    'Grid' |
    /** Shows chart side alone in Gantt */
    'Chart';
/**
 * To define new position for add action
 */
export type RowPosition = /**  Defines new row position as top of all rows */
    'Top' |
    /**  Defines new row position as bottom of all rows */
    'Bottom' |
    /**  Defines new row position as above the selected row */
    'Above' |
    /**  Defines new row position as below the selected row */
    'Below' |
    /**  Defines new row position as child to the selected row */
    'Child';

/** 
 * Defines directions of Sorting. They are
 * * Ascending
 * * Descending 
 */
export type SortDirection =
    /**  Defines SortDirection as Ascending */
    'Ascending' |
    /**  Defines SortDirection as Descending */
    'Descending';

/**
 * Defines predefined contextmenu items.
 * @hidden
 */
export type ContextMenuItem =
    /** Defines Auto fit the size of all columns. */
    'AutoFitAll' |
    /** Defines Auto fit the current column. */
    'AutoFit' |
    /** Defines SortDirection as Ascending  */
    'SortAscending' |
    /** Defines SortDirection as Descending */
    'SortDescending' |
    /** Defines the Task details */
    'TaskInformation' |
    /** Defines the new record on add action */
    'Add' |
    /** Defines the save the modified values */
    'Save' |
    /** Defines the cancel the modified values */
    'Cancel' |
    /** Defines the delete task */
    'DeleteTask' |
    /** Defines the delete dependency task */
    'DeleteDependency' |
    /** Defines the convert to task or milestone */
    'Convert';

/**
 * Defines contextmenu types.
 * @hidden
 */
export type ContextMenuType =
    /** Defines the header type context menu */
    'Header' |
    /** Defines the content type context menu */
    'Content';

/**
 * @hidden
 */
export type CObject =
    { [key: string]: Object; };
