import { Property, ChildProperty, EmitType, Event } from '@syncfusion/ej2-base';import { ExcelHeaderQueryCellInfoEventArgs, GridLine, ClipMode, BeforeCopyEventArgs, PrintMode } from '@syncfusion/ej2-grids';import { ExcelQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-grids';import { QueryCellInfoEventArgs, HeaderCellInfoEventArgs, CellSelectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';import { CellSelectingEventArgs, CellDeselectEventArgs, ResizeArgs, PrintEventArgs, TextWrapSettings } from '@syncfusion/ej2-grids';import { ContextMenuItemModel, RowDeselectEventArgs, PdfQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { CheckboxSelectionType, SelectionType } from '@syncfusion/ej2-grids';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { ColumnRenderEventArgs, SelectionSettings } from '../../common';import { PivotTableContextMenuItem, SelectionMode, PivotCellSelectionMode } from '../../common/base/enum';

/**
 * Interface for a class PivotSelectionSettings
 */
export interface PivotSelectionSettingsModel {

    /**
      * Allow options to highlight either row wise or column wise or specific cells in the pivot table. 
      * For expample, to highlight the columns, set the property `mode` to **Column**. The modes available are:
      * * `Cell`: Allows specific cells to be highlighted in the pivot table.
      * * `Row`: Allows the rows to be highlighted in the pivot table.
      * * `Column`: Allows the columns to be highlighted in the pivot table.
      * * `Both`: Allows both rows, columns and cells to be highlighted in the pivot table.
      * @default Row
      */
    mode?: SelectionMode;

    /**
      * Allow options to customize the mode of selection to highlight either row wise or column wise or specific cell in the pivot table. 
      * For example, to apply the selection that includes in between cells of rows within the range, set the property `cellSelectionMode` to **Box**. 
      * The modes available are:
      * * `Flow`: Allows the range of cells to be selected between the start index and the end index, which also includes the other cells of the selected rows in the pivot table.
      * * `Box`: Allows you to select a range of cells within the starting and ending column indexes that are included in the range between row cells in the pivot table.
      * * `BoxWithBorder`: Allows the range of cells to be selected as the box mode, but along with the borders in the pivot table.

      * @default Flow
      */
    cellSelectionMode?: PivotCellSelectionMode;

    /**
      * Allow options to customize the selection type to highlight either row wise or column wise or specific cell in the pivot table. 
      * For example, to highlight multiple rows or columns or cells, set the property `type` to **Multiple**. 
      * The types available are:
      * * `Single`: Allows the user to select a row or cell on their own in the pivot table.
      * * `Multiple`: Allows the user to select multiple rows or columns or cells in the pivot table.
      * @blazorType PivotTableSelectionType
      * @default Single 
      * @blazorDefaultValue PivotTableSelectionType.Single
      */
    type?: SelectionType;

    /**
      * Allows the selection options to highlight the rows in the pivot table using checkbox selection on their own.
      * > To enable checkboxOnly selection, should specify the column `type` as **checkbox**.
      * @default false 
      */
    checkboxOnly?: boolean;

    /**
      * Allows you to keep selections in rows or columns or cells while performing all operations in the pivot table.
      * > For persisting selection, any one of the column should be enabled as a primary key using the `columns.isPrimaryKey` property in the grid instance.
      * @default false 
      */
    persistSelection?: boolean;

    /**
      * Allow options to customize the checkbox selection mode in the pivot table. 
      * For example, to select multiple rows one by one through simple clicking on rows, set the property `checkboxMode` to **Default**. 
      * The modes available are:
      * * `Default`: Allows multiple rows to be selected by clicking rows one by one.
      * * `ResetOnRowClick`: Allows you to reset the previously selected row while clicking on a specific row. 
      * You can also select multiple rows by clicking on rows along with the **CTRL** or **SHIFT** key in the pivot table.
      * @blazorType PivotTableCheckboxSelectionType
      * @default Default
      * @blazorDefaultValue PivotTableCheckboxSelectionType.Default
      */
    checkboxMode?: CheckboxSelectionType;

    /**
      * Allows to perform multiple selection in rows with single clicks without using **SHIFT** or **CTRL** keys.
      * @default false
      */
    enableSimpleMultiRowSelection?: boolean;

}

/**
 * Interface for a class GridSettings
 */
export interface GridSettingsModel {

    /**
      * Allow the height of the pivot table content to be set, meaning that the height given should be applied without considering the column headers in the pivot table.
      * @default 'auto'
      */
    height?: number | string;

    /**
      * Allow to set width of the pivot table. 
      * > The pivot table will not display less than 400px, as it is the minimum width to the component.
      * @default 'auto'
      */
    width?: number | string;

    /**
      * Allow the options for customizing the cell borders of each cell to be displayed in the pivot table. 
      * For example, to display a pivot table without cell borders, set the property gridLines to None. The modes available are,
      * * `Both`: Allows the cell border to be displayed both horizontally and vertically in the pivot table.
      * * `None`: Allows no cell borders to be displayed in the pivot table.
      * * `Horizontal`: Allows the cell border to be shown horizontally in the pivot table.
      * * `Vertical`: Allows the cell border to be shown vertically in the pivot table.
      * * `Default`: Allows the display of the cell borders based on the theme used in the pivot table.
      * @blazorType PivotTableGridLine
      * @default Both
      * @blazorDefaultValue PivotTableGridLine.Both
      */
    gridLines?: GridLine;

    /**
      * Allow to enable the content of the cells to be wrapped when they exceed the width of the cells in the pivot table.
      * @default false     
      */
    allowTextWrap?: boolean;

    /**
      * Allows to reorder a specific column header from one index to another index in the pivot table by drag-and-drop.
      * > Reordering allows only at the same level as the column headers in the pivot table.
      * @default false
      */
    allowReordering?: boolean;

    /**
      * Allows the columns to be resized by clicking and dragging the right edge of the column headers.
      * > In RTL mode, user can click and drag the left edge of the header cell to resize the column.
      * @default true
      */
    allowResizing?: boolean;

    /**
      * Allows the columns to be fit to the component's width.
      * @default true
      */
    allowAutoResizing?: boolean;

    /**
      * Allow to set height to the pivot table rows commonly. 
      * > By default, the rowHeight property is set as 36 pixels for desktop layout and 48 pixels for mobile layout. 
      * The height of the column headers alone may vary when grouping bar feature is enabled.
      * @default null
      */
    rowHeight?: number;

    /**
      * Allow to set width to the pivot table columns commonly. 
      * > By default, the columnWidth property is set as 110 pixels to each column except the first column. 
      * The first column always defined as row headers in the pivot table. For first column, 
      * 250 pixels and 200 pixels are set respectively with and without grouping bar.
      * @default 110
      */
    columnWidth?: number;

    /**
      * Allows the contents of the cell overflow to be displayed in the pivot table. 
      * For example, to truncate the cell content of a cell when it overflows with respect to its cell width, set the property `clipMode` to **Clip**. 
      * The modes available are:
      * * `Clip`: Allow the content of a cell to truncate when it overflows its content area.
      * * `Ellipsis`: Allows the content of a cell to be displayed as an ellipse when it overflows its content area.
      * * `EllipsisWithTooltip`: Allows the cell content to be displayed as an ellipse when its content area is overflowing. 
      * And the tooltip will also be displayed while hovering on the ellipsis applied cell.
      * @blazorType PivotTableClipMode
      * @default Ellipsis
      * @blazorDefaultValue PivotTableClipMode.Ellipsis
      */
    clipMode?: ClipMode;

    /**
      * Allows a row or column or cell to be highlighted by simply clicking or arrow key in the pivot table.
      * @default false
      */
    allowSelection?: boolean;

    /**
      * Allows to highlight specific row in the pivot table during initial rendering. 
      * For example, to highlight the pivot table's first row, set the property `selectedRowIndex` to **0**.
      * > You can get the currently selected row index of the pivot table from the `selectedRowIndex` property using pivot table instance at run-time.
      * @default -1
      */
    selectedRowIndex?: number;

    /**
      * Allows set of options to customize the selection of a row or column or cell by simply clicking on the arrow key in the pivot table. 
      * The options available are:
      * * `mode - Allow options to highlight either row wise or column wise or specific cells in the pivot table. 
      * For expample, to highlight the columns, set the property `mode` to **Column**.
      * * `cellSelectionMode`: Allow options to customize the mode of selection to highlight either row wise or column wise or specific cell in the pivot table. 
      * For example, to apply the selection that includes in between cells of rows within the range, set the property `cellSelectionMode` to **Box**.
      * * `type`: Allow options to customize the selection type to highlight either row wise or column wise or specific cell in the pivot table. 
      * For example, to highlight multiple rows or columns or cells, set the property `type` to **Multiple**.
      * * `checkboxOnly`: Allows the selection options to highlight the rows in the pivot table using checkbox selection on their own.
      * * `persistSelection`: Allows you to keep selections in rows or columns or cells while performing all operations in the pivot table.
      * * `checkboxMode`: Allow options to customize the checkbox selection mode in the pivot table. 
      * For example, to select multiple rows one by one through simple clicking on rows, set the property `checkboxMode` to **Default**.
      * * `enableSimpleMultiRowSelection`: Allows to perform multiple selection in rows with single clicks without using **SHIFT** or **CTRL** keys.
      * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
      */
    selectionSettings?: SelectionSettingsModel | SelectionSettings;

    /**
      * Allows the options for customizing the content of the cells to be wrapped in either rows and column headers or values or both headers and values in the pivot table. 
      * For example, to wrap the contents of the value cells in the pivot table, then set the property `wrapMode` to **Content** in the `textWrapSettings` class. 
      * The options available are:
      * * `Both`: Allows the content of the cells to be wrapped in both headers and values.
      * * `Header`: Allows the content of the cells to be wrapped in rows and column headers alone.
      * * `Content`: Allows the content of the cells to be packed for the value cells alone.
      * @default { wrapMode: 'Both'}
      */
    textWrapSettings?: TextWrapSettings;

    /**
      * Allow options to print either the current page shown in the pivot table on its own or the entire pivot table. 
      * The options available are:
      * * `AllPages`: Prints the entire pivot table.
      * * `CurrentPage`: Prints the current page shown in the pivot table on its own.
      * @blazorType PivotTablePrintMode
      * @default AllPages
      * @blazorDefaultValue PivotTablePrintMode.AllPages
      */
    printMode?: PrintMode;

    /**
      * Allows to show built-in context with pre-defined menu option or custom menu options by simply right clicking on the pivot table cell. 
      * The options available are:
      * * `Drillthrough`: Allows to show the drill-through dialog over the pivot table to perform drill-through operations.
      * * `Expand`: Allows to expand the collaped row or column headers in the pivot table.
      * * `Collapse`: Allows to collapse the expaned row or column headers in the pivot table.
      * * `CalculatedField`: Allows to show the calculated field dialog over the pivot table to perform calculated field operations.
      * * `Pdf Export`: Allows to export the pivot table as PDF format.
      * * `Excel Export`: Allows to export the pivot table as Excel format.
      * * `Csv Export`: Allows to export the pivot table as CSV format.
      * * `Sort Ascending`: Allows to perform ascending order with repect to the values on selected cell contained row or column in the pivot table.
      * * `Sort Descending`: Allows to perform descending order with repect to the values on selected cell contained row or column in the pivot table.
      * * `Aggregate`: Allow options to perform calculations over a group of values (exclusively for value fields bound in value axis) using the aggregation option in the pivot table.
      * @blazorType List<PivotTableContextMenuItem>       
      * @default null
      */
    contextMenuItems?: PivotTableContextMenuItem[] | ContextMenuItemModel[];

    /**
      * It triggers before copy information from the pivot table.
      * @event
      * @deprecated
      */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
      * It triggers after print action is completed.
      * @event
      * @deprecated
      */
    printComplete?: EmitType<PrintEventArgs>;

    /**
      * It triggers before the print action starts.
      * @event
      * @deprecated
      */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
      * It triggers before the PDF export starts.
      * @event
      * @deprecated
      */
    beforePdfExport?: EmitType<Object>;

    /**
      * It triggers before the Excel export starts.
      * @event
      * @deprecated
      */
    beforeExcelExport?: EmitType<Object>;

    /**
      * It triggers before context menu opens.
      * @event
      * @deprecated
      */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
      * It triggers when click on context menu.
      * @event
      * @deprecated
      */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
      * Triggered every time a request is made to access cell information, element, or data.
      * It will get triggered before the cell element is appended to the Grid element.
      * @event
      * @deprecated
      */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
      * Triggered for column header.
      * It will get triggered before the cell element is appended to the Grid element.
      * @event
      * @deprecated
      */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
      * It triggers before row selection occurs in the pivot table.
      * @event
      * @deprecated
      */
    rowSelecting?: EmitType<RowSelectEventArgs>;

    /**
      * It triggers after a row is selected in the pivot table.
      * @event
      * @deprecated
      */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
      * It triggers before deselecting the selected row from the pivot table.
      * @event
      * @deprecated
      */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
      * It triggers when a selected row is deselected from the pivot table.
      * @event
      * @deprecated
      */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
      * It triggers before any cell selection occurs in the pivot table.
      * @event
      * @deprecated
      */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
      * It triggers after a cell is selected in the pivot table.
      * @event
      * @deprecated
      */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
      * It triggers before the selected cell is deselecting from the pivot table.
      * @event
      * @deprecated
      */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
      * It triggers when a particular selected cell is deselected from the pivot table.
      * @event
      * @deprecated
      */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
      * It triggers when column resize starts in the pivot table.
      * @event
      * @deprecated
      */
    resizeStart?: EmitType<ResizeArgs>;

    /**
      * It triggers on column resizing in the pivot table.
      * @event
      * @deprecated
      */
    resizing?: EmitType<ResizeArgs>;

    /**
      * It triggers when column resize ends in the pivot table.
      * @event
      * @deprecated
      */
    resizeStop?: EmitType<ResizeArgs>;

    /**
      * It triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
      * @event
      * @deprecated
      */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
      * It triggers before exporting each cell to PDF document. You can also customize the PDF cells.
      * @event
      * @deprecated
      */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
      * It triggers before exporting each header cell to Excel file.
      * You can also customize the Excel cells.
      * @event
      * @deprecated
      */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
      * It triggers before exporting each cell to Excel file.
      * You can also customize the Excel cells.
      * @event
      * @deprecated
      */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
      * It triggers when column header element drag (move) starts. 
      * @event
      * @deprecated
      */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
      * It triggers when column header element is dragged (moved) continuously. 
      * @event
      * @deprecated
      */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
      * It triggers when a column header element is dropped on the target column. 
      * @event
      * @deprecated
      */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
      * It allows to configure the column before it renders.
      * @event
      * @deprecated
      */
    columnRender?: EmitType<ColumnRenderEventArgs>;

}