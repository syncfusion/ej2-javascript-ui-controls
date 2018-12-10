import { Property, ChildProperty, EmitType, Event } from '@syncfusion/ej2-base';import { ExcelHeaderQueryCellInfoEventArgs, GridLine, ClipMode, BeforeCopyEventArgs, PrintMode } from '@syncfusion/ej2-grids';import { ExcelQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-grids';import { QueryCellInfoEventArgs, HeaderCellInfoEventArgs, CellSelectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';import { CellSelectingEventArgs, CellDeselectEventArgs, ResizeArgs, PrintEventArgs } from '@syncfusion/ej2-grids';import { ContextMenuItemModel, RowDeselectEventArgs, PdfQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { BeforeColumnRenderEventArgs } from '../../common';

/**
 * Interface for a class GridSettings
 */
export interface GridSettingsModel {

    /**
     * Defines the mode of grid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only.
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     * @default Both
     */
    gridLines?: GridLine;

    /**
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    allowTextWrap?: boolean;

    /**
     * If `allowReordering` is set to true, Grid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` is set to true, Grid columns can be resized.
     * @default true
     */
    allowResizing?: boolean;

    /**
     * Defines the height of Grid rows.
     * @default null
     */
    rowHeight?: number;

    /**
     * Defines the height of Grid rows.
     * @default 110
     */
    columnWidth?: number;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area.
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area
     * also it will display tooltip while hover on ellipsis applied cell.
     * @default Ellipsis
     */
    clipMode?: ClipMode;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.
     * @default false
     */
    allowSelection?: boolean;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     * @default -1
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection settings.
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the Grid.
     * * `CurrentPage`: Prints the current page of the Grid.
     * @default AllPages
     */
    printMode?: PrintMode;

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.         
     * @default null
     */
    contextMenuItems?: ContextMenuItemModel[];

    /**
     * Triggers before Grid copy action.
     * @event
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers after print action is completed.
     * @event
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.
     * @event
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers before context menu opens.
     * @event
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     * @event
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggered for column header.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Triggers before row selection occurs.
     * @event 
     */
    rowSelecting?: EmitType<RowSelectEventArgs>;

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
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     * @event 
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event 
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

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
     * This allows to configure the column before it renders.
     * @event 
     */
    beforeColumnsRender?: EmitType<BeforeColumnRenderEventArgs>;

}