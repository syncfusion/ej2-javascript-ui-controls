/** 
 * Defines Actions of the Grid. They are
 * * paging
 * * refresh
 * * sorting
 * * filtering
 * * selection
 * * rowdraganddrop
 * * reorder
 * * grouping
 * * ungrouping
 */
export type Action =
    /**  Defines current Action as Paging */
    'paging' |
    /**  Defines current Action as Refresh */
    'refresh' |
    /**  Defines current Action as Sorting */
    'sorting' |
    /**  Defines current Action as Selection */
    'selection' |
    /**  Defines current Action as Filtering */
    'filtering' |
    /**  Defines current Action as Searching */
    'searching' |
    /**  Defines current Action as Row Drag and Drop */
    'rowdraganddrop' |
    /**  Defines current Action as Reorder */
    'reorder' |
    /**  Defines current Action as Grouping */
    'grouping' |
    /**  Defines current Action as UnGrouping */
    'ungrouping' |
    /**  Defines current Action as Batch Save */
    'batchsave' |
    /** Defines current Action as Virtual Scroll */
    'virtualscroll' |
    /** Defines current Action as print */
    'print';


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
 * `columnQueryMode`provides options to retrive data from the datasource. They are
 * * All
 * * Schema 
 * * ExcludeHidden
 */
export type ColumnQueryModeType =
    /**  It Retrieves whole datasource */
    'All' |
    /**  Retrives data for all the defined columns in grid from the datasource.  */
    'Schema' |
    /**  Retrives data only for visible columns of grid from the dataSource. */
    'ExcludeHidden';


/** 
 * Defines types of Selection. They are
 * * Single - Allows user to select a row or cell.
 * * Multiple - Allows user to select multiple rows or cells. 
 */
export type SelectionType =
    /**  Defines Single selection in the Grid */
    'Single' |
    /**  Defines multiple selections in the Grid */
    'Multiple';

/** 
 * Defines modes of checkbox Selection. They are
 * * Default
 * * ResetOnRowClick
 */
export type CheckboxSelectionType =
    /**  Allows the user to select multiple rows by clicking rows one by one */
    'Default' |
    /**  Allows to reset the previously selected row when a row is clicked and multiple rows can be selected by using CTRL or SHIFT key */
    'ResetOnRowClick';

/** 
 * Defines alignments of text, they are
 * * Left
 * * Right
 * * Center
 * * Justify 
 */
export type TextAlign =
    /**  Defines Left alignment */
    'Left' |
    /**  Defines Right alignment */
    'Right' |
    /**  Defines Center alignment */
    'Center' |
    /**  Defines Justify alignment */
    'Justify';

/** 
 * Defines types of Cell 
 * @hidden
 */
export enum CellType {
    /**  Defines CellType as Data */
    Data,
    /**  Defines CellType as Header */
    Header,
    /**  Defines CellType as Summary */
    Summary,
    /**  Defines CellType as GroupSummary */
    GroupSummary,
    /**  Defines CellType as CaptionSummary */
    CaptionSummary,
    /**  Defines CellType as Filter */
    Filter,
    /**  Defines CellType as Indent */
    Indent,
    /**  Defines CellType as GroupCaption */
    GroupCaption,
    /**  Defines CellType as GroupCaptionEmpty */
    GroupCaptionEmpty,
    /**  Defines CellType as Expand */
    Expand,
    /**  Defines CellType as HeaderIndent */
    HeaderIndent,
    /**  Defines CellType as StackedHeader */
    StackedHeader,
    /**  Defines CellType as DetailHeader */
    DetailHeader,
    /**  Defines CellType as DetailExpand */
    DetailExpand,
    /**  Defines CellType as CommandColumn */
    CommandColumn
}

/** 
 * Defines modes of GridLine, They are 
 * * Both - Displays both the horizontal and vertical grid lines. 
 * * None - No grid lines are displayed.
 * * Horizontal - Displays the horizontal grid lines only. 
 * * Vertical - Displays the vertical grid lines only. 
 * * Default - Displays grid lines based on the theme.
 */
export type GridLine =
    /** Show both the vertical and horizontal line in the Grid  */
    'Both' |
    /** Hide both the vertical and horizontal line in the Grid  */
    'None' |
    /** Shows the horizontal line only in the Grid */
    'Horizontal' |
    /** Shows the vertical line only in the Grid  */
    'Vertical' |
    /** Shows the grid lines based on the theme  */
    'Default';

/** 
 * Defines types of Render 
 * @hidden
 */
export enum RenderType {
    /**  Defines RenderType as Header */
    Header,
    /**  Defines RenderType as Content */
    Content,
    /**  Defines RenderType as Summary */
    Summary
}

/** 
 * Defines modes of Selection, They are 
 * * Row  
 * * Cell  
 * * Both 
 */
export type SelectionMode =
    /**  Defines SelectionMode as Cell */
    'Cell' |
    /**  Defines SelectionMode as Row */
    'Row' |
    /**  Defines SelectionMode as Both */
    'Both';

/** 
 * Print mode options are
 * * AllPages - Print all pages records of the Grid. 
 * * CurrentPage - Print current page records of the Grid.
 */
export type PrintMode =
    /**  Defines PrintMode as AllPages */
    'AllPages' |
    /**  Defines PrintMode as CurrentPage */
    'CurrentPage';

/** 
 * Defines types of Filter 
 * * Menu - Specifies the filter type as menu. 
 * * Excel - Specifies the filter type as excel. 
 * * FilterBar - Specifies the filter type as filter bar.  
 * * CheckBox - Specifies the filter type as check box. 
 */
export type FilterType =
    /**  Defines FilterType as filterbar */
    'FilterBar' |
    /**  Defines FilterType as excel */
    'Excel' |
    /**  Defines FilterType as menu */
    'Menu' |
    /**  Defines FilterType as checkbox */
    'CheckBox';

/** 
 * Filter bar mode options are 
 * * OnEnter - Initiate filter operation after Enter key is pressed. 
 * * Immediate -  Initiate filter operation after certain time interval. By default time interval is 1500 ms.    
 */
export type FilterBarMode =
    /**  Defines FilterBarMode as onenter */
    'OnEnter' |
    /**  Defines FilterBarMode  as immediate */
    'Immediate';

/**
 * Defines the aggregate types. 
 */
export type AggregateType =
    /** Defines sum aggregate type */
    'Sum' |
    /** Specifies average aggregate type */
    'Average' |
    /** Specifies maximum aggregate type */
    'Max' |
    /** Specifies minimum aggregate type */
    'Min' |
    /** Specifies count aggregate type */
    'Count' |
    /** Specifies true count aggregate type */
    'TrueCount' |
    /** Specifies false count aggregate type */
    'FalseCount' |
    /** Specifies custom aggregate type */
    'Custom';

/**
 * Defines the wrap mode.
 * * Both -  Wraps both header and content.
 * * Header - Wraps header alone.
 * * Content - Wraps content alone.
 */
export type WrapMode =
    /** Wraps both header and content */
    'Both' |
    /** Wraps  header alone */
    'Header' |
    /** Wraps  content alone */
    'Content';

/**
 * Defines Multiple Export Type.
 */
export type MultipleExportType =
    /**  Multiple Grids are exported to same Worksheet. */
    'AppendToSheet' |
    /**  Multiple Grids are exported to separate Worksheet. */
    'NewSheet';

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export type ToolbarItems =
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
    /** ColumnChooser used show/gird columns */
    'ColumnChooser' |
    /** Print the Grid */
    'Print' |
    /** Export the Grid to PDF format */
    'PdfExport' |
    /** Export the Grid to Excel format */
    'ExcelExport' |
    /** Export the Grid to CSV format */
    'CsvExport' |
    /** Export the Grid to word fromat */
    'WordExport';

/** 
 * Defines the cell content's overflow mode. The available modes are   
 * * `Clip` -  Truncates the cell content when it overflows its area. 
 * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
 * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
 * also it will display tooltip while hover on ellipsis applied cell.
 */
export type ClipMode =
    /**  Truncates the cell content when it overflows its area */
    'Clip' |
    /** Displays ellipsis when the cell content overflows its area */
    'Ellipsis' |
    /** Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell. */
    'EllipsisWithTooltip';

/**
 * Defines the Command Buttons type.
 * * Edit -  Edit the current record.
 * * Delete - Delete the current record.
 * * Save - Save the current edited record.
 * * Cancel - Cancel the edited state.
 */
export type CommandButtonType =
    /** Edit the current row */
    'Edit' |
    /** Delete the current row */
    'Delete' |
    /** Save the current edited row */
    'Save' |
    /**  Cancel the edited state */
    'Cancel';

/** 
 * Defines the default items of context menu.
 */
export type ContextMenuItem =
    /**  Auto fit the size of all columns */
    'AutoFitAll' |
    /**  Auto fit the current column */
    'AutoFit' |
    /**  Group by current column */
    'Group' |
    /**  Ungroup by current column */
    'Ungroup' |
    /**  Edit the current record */
    'Edit' |
    /**  Delete the current record */
    'Delete' |
    /**  Save the edited record */
    'Save' |
    /**  Cancel the edited state */
    'Cancel' |
    /**  Copy the selected records */
    'Copy' |
    /**  Export the grid as Pdf format */
    'PdfExport' |
    /**  Export the grid as Excel format */
    'ExcelExport' |
    /**  Export the grid as CSV format */
    'CsvExport' |
    /**  Sort the current column in ascending order */
    'SortAscending' |
    /**  Sort the current column in descending order */
    'SortDescending' |
    /**  Go to the first page */
    'FirstPage' |
    /**  Go to the previous page */
    'PrevPage' |
    /**  Go to the last page */
    'LastPage' |
    /**  Go to the next page */
    'NextPage';

/** 
 * Defines the default items of Column menu.
 */
export type ColumnMenuItem =
    /**  Auto fit the size of all columns */
    'AutoFitAll' |
    /**  Auto fit the current column */
    'AutoFit' |
    /**  Group by current column */
    'Group' |
    /**  Ungroup by current column */
    'Ungroup' |
    /**  Sort the current column in ascending order */
    'SortAscending' |
    /**  Sort the current column in descending order */
    'SortDescending' |
    /**  show the column chooser */
    'ColumnChooser' |
    /**  show the Filter popup */
    'Filter';

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export enum ToolbarItem {
    Add,
    Edit,
    Update,
    Delete,
    Cancel,
    Print,
    Search,
    ColumnChooser,
    PdfExport,
    ExcelExport,
    CsvExport,
    WordExport
}

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

export type PageOrientation =
    'Landscape' |
    'Portrait';

export type ContentType =
    'Image' |
    'Line' |
    'PageNumber' |
    'Text';

export type PdfPageNumberType =
    'LowerLatin' |
    'LowerRoman' |
    'UpperLatin' |
    'UpperRoman' |
    'Numeric' |
    'Arabic';

export type PdfDashStyle =
    'Solid' |
    'Dash' |
    'Dot' |
    'DashDot' |
    'DashDotDot';

/**
 * Defines PDF horizontal alignment.
 */
export type PdfHAlign =
    /** left alignment */
    'Left' |
    /** right alignment */
    'Right' |
    /** center alignment */
    'Center' |
    /** justify alignment */
    'Justify';

/**
 * Defines PDF vertical alignment.
 */
export type PdfVAlign =
    /** top alignment */
    'Top' |
    /** bottom alignment */
    'Bottom' |
    /** middle alignment */
    'Middle';


/**
 * Defines Export Type.
 */
export type ExportType =
    /** Current page in grid is exported. */
    'CurrentPage' |
    /** All pages of the grid is exported. */
    'AllPages';

/**
 * Defines Excel horizontal alignment.
 */
export type ExcelHAlign =
    /** left alignment  */
    'Left' |
    /** right alignment  */
    'Right' |
    /** center alignment  */
    'Center' |
    /** fill alignment  */
    'Fill';

/**
 * Defines Excel vertical alignment.
 */
export type ExcelVAlign =
    /** top alignment  */
    'Top' |
    /** bottom alignment  */
    'Bottom' |
    /** center alignment  */
    'Center' |
    /** justify alignment  */
    'Justify';

/**
 * Defines border line style.
 */
export type BorderLineStyle =
    /** thin line style  */
    'Thin' |
    /** thick line style  */
    'Thick';

export type CheckState = 'Check' | 'Uncheck' | 'Intermediate' | 'None';

/** 
 * Defines mode of cell selection.
 * * Ascending
 * * Descending 
 */
export type CellSelectionMode =
    /**  Defines CellSelectionMode as Flow */
    'Flow' |
    /**  Defines CellSelectionMode as Box */
    'Box';


/** 
 * Defines modes of editing.
 * * Ascending
 * * Descending 
 */
export type EditMode =
    /**  Defines EditMode as Normal */
    'Normal' |
    /**  Defines EditMode as Dialog */
    'Dialog' |
    /**  Defines EditMode as Batch */
    'Batch';