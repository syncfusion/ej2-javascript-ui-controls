/**
 * Defines modes of Filter Hierarchy
 * ```props
 * * Parent :- Shows filtered records with its Parent records.
 * * Child :- Shows filtered records with its Child records.
 * * Both :- Shows filtered records with its Parent and Child records.
 * * None :- Shows only the filetred records.
 * ```
 */
export type FilterHierarchyMode =
      'Parent' |
      'Child' |
      'Both' |
      'None';

/**
 * Defines Predefined toolbar items.
 * ```props
 * * Add :- Add new record.
 * * Edit :- Edit the selected record.
 * * Update :- Update the edited record.
 * * Delete :- Delete the selected record.
 * * Cancel :- Cancel the edited state.
 * * Search :- Searches the TreeGrid records by given key.
 * * ExpandAll :- Expands all the rows in TreeGrid.
 * * CollapseAll :- Collapses all the rows in TreeGrid.
 * * ExcelExport :- Export the TreeGrid to Excel.
 * * PdfExport :- Export the TreeGrid to Pdf.
 * * CsvExport :- Export the TreeGrid to Csv.
 * * Print :- Print the TreeGrid.
 * ```
 *
 * @hidden
 */
export type ToolbarItems =
    'Add' |
    'Delete' |
    'Update' |
    'Cancel' |
    'Edit' |
    'Search' |
    'ExpandAll' |
    'CollapseAll' |
    'ExcelExport' |
    'PdfExport' |
    'CsvExport' |
    'Print';
/**
 * Defines Predefined toolbar items.
 *
 * @hidden
 */
export enum ToolbarItem {
    Add,
    Edit,
    Update,
    Delete,
    Cancel,
    Search,
    ExpandAll,
    CollapseAll,
    ExcelExport,
    PdfExport,
    CsvExport,
    Print,
    RowIndent,
    RowOutdent
}

/**
 * Defines different PageSizeMode
 * ```props
 * * All :- Defines the pageSizeMode as All
 * * Root :- Defines the pageSizeMode as Root
 * ```
 */
export type PageSizeMode =
    'All' |
    'Root';

/**
 * Defines predefined contextmenu items.
 * ```props
 * * AutoFitAll :- Auto fit the size of all columns.
 * * AutoFit :- Auto fit the current column.
 * * SortAscending :- Sort the current column in ascending order.
 * * SortDescending :- Sort the current column in descending order.
 * * Edit :- Edit the current record.
 * * Delete :- Delete the current record.
 * * Save :- Save the edited record.
 * * Cancel :- Cancel the edited state.
 * * PdfExport :- Export the TreeGrid as Pdf format.
 * * ExcelExport :- Export the TreeGrid as Excel format.
 * * CsvExport :- Export the TreeGrid as CSV format.
 * * FirstPage :- Go to the first page.
 * * PrevPage :- Go to the previous page.
 * * LastPage :- Go to the last page.
 * * NextPage :- Go to the next page.
 * ```
 *
 * @hidden
 */
export type ContextMenuItem =
    'AutoFitAll' |
    'AutoFit' |
    'SortAscending' |
    'SortDescending' |
    'Edit' |
    'Delete' |
    'Save' |
    'Cancel' |
    'PdfExport' |
    'ExcelExport' |
    'CsvExport' |
    'FirstPage' |
    'PrevPage' |
    'LastPage' |
    'NextPage' |
    'AddRow'|
    'Indent'|
    'Outdent';


/**
 * Defines predefined contextmenu items.
 *
 * @hidden
 */
export enum ContextMenuItems {
    AutoFit,
    AutoFitAll,
    SortAscending,
    SortDescending,
    Edit,
    Delete,
    Save,
    Cancel,
    PdfExport,
    ExcelExport,
    CsvExport,
    FirstPage,
    PrevPage,
    LastPage,
    NextPage,
    AddRow,
    RowIndent,
    RowOutdent
}
/**
 * Defines modes of editing.
 * ```props
 * * Cell :- Defines the editing mode as Cell.
 * * Row :- Defines the editing mode as Row.
 * * Dialog :- Defines the editing mode as Dialog.
 * * Batch :- Defines the editing mode as Batch.
 * ```
 */
export type EditMode =
'Cell' |
'Row' |
'Dialog' |
'Batch' ;

/**
 * Defines the position where the new row has to be added.
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
'Child' ;

/**
 * Defines types of Filter
 * ```props
 * * Menu :- Defines the filter type as Menu.
 * * Excel :- Defines the filter type as Excel.
 * * FilterBar :- Defines the filter type as FilterBar.
 * ```
 */
export type FilterType =
    'FilterBar' |
    'Excel' |
    'Menu' ;

/**
 * Defines the wrap mode.
 * ```props
 * * Both :-  Wraps both header and content.
 * * Header :- Wraps header alone.
 * * Content :- Wraps content alone.
 */
export type WrapMode =
    'Both' |
    'Header' |
    'Content';

/**
 * Defines types of CopyHierarchyMode. They are
 * ```props
 * * Parent :- Defines CopyHiearchyMode as Parent.
 * * Child :- Defines CopyHiearchyMode as Child.
 * * Both :- Defines CopyHiearchyMode as Both.
 * * None :- Defines CopyHiearchyMode as None.
 * ```
 */
export declare type CopyHierarchyType =
'Parent' |
'Child' |
'Both' |
'None' ;
