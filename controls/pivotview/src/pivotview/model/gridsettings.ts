import { Property, ChildProperty, EmitType, Event } from '@syncfusion/ej2-base';
import { ExcelHeaderQueryCellInfoEventArgs, GridLine, ClipMode, BeforeCopyEventArgs, PrintMode } from '@syncfusion/ej2-grids';
import { ExcelQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-grids';
import { QueryCellInfoEventArgs, HeaderCellInfoEventArgs, CellSelectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, CellDeselectEventArgs, ResizeArgs, PrintEventArgs } from '@syncfusion/ej2-grids';
import { ContextMenuItemModel, RowDeselectEventArgs, PdfQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';

/** 
 *  Represents Pivot widget model class.
 */
export class GridSettings extends ChildProperty<GridSettings> {

    /**
     * Defines the mode of grid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only.
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     * @default Both
     */
    @Property('Both')
    public gridLines: GridLine;

    /**
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**
     * If `allowReordering` is set to true, Grid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;

    /**
     * If `allowResizing` is set to true, Grid columns can be resized.
     * @default true
     */
    @Property(true)
    public allowResizing: boolean;

    /**
     * Defines the height of Grid rows.
     * @default null
     */
    @Property(null)
    public rowHeight: number;

    /**
     * Defines the height of Grid rows.
     * @default 110
     */
    @Property(110)
    public columnWidth: number;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area.
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area
     * also it will display tooltip while hover on ellipsis applied cell.
     * @default Ellipsis
     */
    @Property('Ellipsis')
    public clipMode: ClipMode;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.
     * @default false
     */
    @Property(false)
    public allowSelection: boolean;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     * @default -1
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**
     * Configures the selection settings.
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    @Property({ mode: 'Row', cellSelectionMode: 'Flow', type: 'Single' })
    public selectionSettings: SelectionSettingsModel;

    /**
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the Grid.
     * * `CurrentPage`: Prints the current page of the Grid.
     * @default AllPages
     */
    @Property('AllPages')
    public printMode: PrintMode;

    /**    
     * `contextMenuItems` defines both built-in and custom context menu items.         
     * @default null
     */
    @Property()
    public contextMenuItems: ContextMenuItemModel[];

    /**
     * Triggers before Grid copy action.
     * @event
     */
    @Event()
    public beforeCopy: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers after print action is completed.
     * @event
     */
    @Event()
    public printComplete: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.
     * @event
     */
    @Event()
    public beforePrint: EmitType<PrintEventArgs>;

    /** 
     * Triggers before context menu opens.
     * @event
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /** 
     * Triggers when click on context menu.
     * @event
     */
    @Event()
    public contextMenuClick: EmitType<MenuEventArgs>;

    /** 
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /** 
     * Triggered for column header.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /** 
     * Triggers before row selection occurs.
     * @event 
     */
    @Event()
    public rowSelecting: EmitType<RowSelectEventArgs>;

    /** 
     * Triggers after a row is selected.
     * @event 
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /** 
     * Triggers before deselecting the selected row.
     * @event 
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers when a selected row is deselected.
     * @event 
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers before any cell selection occurs.
     * @event 
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /** 
     * Triggers after a cell is selected.
     * @event 
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /** 
     * Triggers before the selected cell is deselecting.
     * @event 
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /** 
     * Triggers when a particular selected cell is deselected.
     * @event 
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /** 
     * Triggers when column resize starts.
     * @event
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /** 
     * Triggers on column resizing.
     * @event
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /** 
     * Triggers when column resize ends.
     * @event
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /** 
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     * @event 
     */
    @Event()
    public pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event 
     */
    @Event()
    public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     */
    @Event()
    public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     */
    @Event()
    public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /**  
     * Triggers when column header element drag (move) starts. 
     * @event  
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when column header element is dragged (moved) continuously. 
     * @event  
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when a column header element is dropped on the target column. 
     * @event  
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;
}