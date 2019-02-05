/**
 * PdfGridRow.ts class for EJ2-PDF
 */
import { PdfGrid } from './pdf-grid';
import { PdfGridCell, PdfGridCellCollection } from './pdf-grid-cell';
import { PdfGridRowStyle } from './styles/style';
import { PdfLayoutResult  } from '../../graphics/figures/base/element-layouter';
import { PdfGridColumn } from './../../structured-elements/grid/pdf-grid-column';
/**
 * `PdfGridRow` class provides customization of the settings for the particular row.
 */
export class PdfGridRow {
    //Fields
    /**
     * `Cell collecton` of the current row..
     * @private
     */
    private gridCells : PdfGridCellCollection;
    /**
     * Stores the current `grid`.
     * @private
     */
    private pdfGrid : PdfGrid;
    /**
     * The grid row `style`.
     * @private
     */
    private rowStyle : PdfGridRowStyle;
    /**
     * Stores the row `break height`.
     * @private
     */
    private gridRowBreakHeight : number;
    /**
     * Stores the index of the overflowing row.
     * @private
     */
    private gridRowOverflowIndex : number = 0;
    /**
     * The `height` of the row.
     * @private
     */
    private rowHeight : number = 0;
    /**
     * The `width` of the row.
     * @private
     */
    private rowWidth : number = 0;
    /**
     * The `isFinish` of the row.
     * @private
     */
    public isrowFinish : boolean = false;
    /**
     * Check whether the Row span row height `is set explicitly`.
     * @default false
     * @public
     */
    public isRowSpanRowHeightSet : boolean = false;
    /**
     * The grid row `Layout Result`.
     * @private
     */
    private gridResult : PdfLayoutResult ;
    /**
     * The `Maximum span` of the row.
     * @public
     */
    public maximumRowSpan : number;
    /**
     * The `page count` of the row.
     * @public
     */
    public noOfPageCount : number = 0 ;
    /**
     * Check whether the row height `is set explicitly`.
     * @default false
     * @private
     */
    public isRowHeightSet : boolean = false;
    public isRowBreaksNextPage : boolean ;
    public rowBreakHeightValue : number;
    public isPageBreakRowSpanApplied : boolean = false;
    /**
     * Checks whether the `columns span is exist or not`.
     * @private
     */
    private bColumnSpanExists : boolean;
    /**
     * Check weather the row merge `is completed` or not.
     * @default true
     * @private
     */
    private isRowMergeComplete : boolean = true;
    /**
     * Checks whether the `row span is exist or not`.
     * @private
     */
    private bRowSpanExists : boolean;
    public repeatFlag : boolean = false;
    public repeatRowNumber : number;
    public rowFontSplit : boolean = false;
    //Constructor
    /**
     * Initializes a new instance of the `PdfGridRow` class with the parent grid.
     * @private
     */
    public constructor(grid : PdfGrid) {
        this.pdfGrid = grid;
    }
    //Properties
    /**
     * Gets or sets a value indicating [`row span exists`].
     * @private
     */
    public get rowSpanExists() : boolean {
        return this.bRowSpanExists;
    }
    public set rowSpanExists(value : boolean) {
        this.bRowSpanExists = value;
    }
    /**
     * Gets the `cells` from the selected row.[Read-Only].
     * @private
     */
    public get cells() : PdfGridCellCollection {
        if (this.gridCells == null) {
            this.gridCells = new PdfGridCellCollection(this);
        }
        return this.gridCells;
    }
    /**
     * Gets or sets the parent `grid`.
     * @private
     */
    public get grid() : PdfGrid {
        return this.pdfGrid;
    }
    public set grid(value : PdfGrid) {
        this.pdfGrid = value;
    }
    /**
     * Gets or sets the row `style`.
     * @private
     */
    public get style() : PdfGridRowStyle {
        if (typeof this.rowStyle === 'undefined') {
            this.rowStyle = new PdfGridRowStyle();
            this.rowStyle.setParent(this);
        }
        return this.rowStyle;
    }
    public set style(value : PdfGridRowStyle) {
        this.rowStyle = value;
        for (let i : number = 0; i < this.cells.count; i++) {
            this.cells.getCell(i).style.borders = value.border;
            if (typeof value.font !== 'undefined') {
                this.cells.getCell(i).style.font = value.font;
            }
            if (typeof value.backgroundBrush !== 'undefined') {
                this.cells.getCell(i).style.backgroundBrush = value.backgroundBrush;
            }
            if (typeof value.backgroundImage !== 'undefined') {
                this.cells.getCell(i).style.backgroundImage = value.backgroundImage;
            }
            if (typeof value.textBrush !== 'undefined') {
                this.cells.getCell(i).style.textBrush = value.textBrush;
            }
            if (typeof value.textPen !== 'undefined') {
                this.cells.getCell(i).style.textPen = value.textPen;
            }
        }
    }
    /**
     * `Height` of the row yet to be drawn after split.
     * @private
     */
    public get rowBreakHeight() : number {
        if (typeof this.gridRowBreakHeight === 'undefined') {
            this.gridRowBreakHeight = 0;
        }
        return this.gridRowBreakHeight;
    }
    public set rowBreakHeight(value : number) {
        this.gridRowBreakHeight = value;
    }
    /**
     * `over flow index` of the row.
     * @private
     */
    public get rowOverflowIndex() : number {
        return this.gridRowOverflowIndex;
    }
    public set rowOverflowIndex(value : number) {
        this.gridRowOverflowIndex = value;
    }
    /**
     * Gets or sets the `height` of the row.
     * @private
     */
    public get height() : number {
        if (!this.isRowHeightSet) {
            this.rowHeight = this.measureHeight();
        }
        return this.rowHeight;
    }
    public set height(value : number) {
        this.rowHeight = value;
        this.isRowHeightSet = true;
    }
    /**
     * Gets or sets the `width` of the row.
     * @private
     */
    public get width() : number {
        if (this.rowWidth === 0 || typeof this.rowWidth === 'undefined') {
           this.rowWidth = this.measureWidth();
       }
        return this.rowWidth;
   }
    /**
     * Gets or sets the row `Nested grid Layout Result`.
     * @private
     */
    public get NestedGridLayoutResult() : PdfLayoutResult{
        return this.gridResult;
    }
    public set NestedGridLayoutResult(value : PdfLayoutResult ) {
        this.gridResult = value;
    }
    /**
     * Gets or sets a value indicating [`column span exists`].
     * @private
     */
    public get columnSpanExists() : boolean {
        return this.bColumnSpanExists;
    }
    public set columnSpanExists(value : boolean) {
        this.bColumnSpanExists = value;
    }
    /**
     * Check whether the Row `has row span or row merge continue`.
     * @private
     */
    public get rowMergeComplete() : boolean {
        return this.isRowMergeComplete;
    }
    public set rowMergeComplete(value : boolean) {
        this.isRowMergeComplete = value;
    }
    /**
     * Returns `index` of the row.
     * @private
     */
    public get rowIndex() : number {
        return this.grid.rows.rowCollection.indexOf(this);
    }
    //Implementation
    /**
     * `Calculates the height`.
     * @private
     */
    private measureHeight() : number {
        let rowSpanRemainingHeight : number = 0;
        let rowHeight : number;
        let maxHeight : number = 0;
        if (this.cells.getCell(0).rowSpan > 1) {
            rowHeight = 0;
        } else {
            rowHeight = this.cells.getCell(0).height;
        }
        for (let i : number = 0; i < this.cells.count; i++) {
            let cell : PdfGridCell = this.cells.getCell(i);
            //get the maximum rowspan remaining height.
            if (cell.rowSpanRemainingHeight > rowSpanRemainingHeight) {
                rowSpanRemainingHeight = cell.rowSpanRemainingHeight;
            }
            //skip the cell if row spanned.
            // if (cell.isRowMergeContinue) {
            //     continue;
            // }
            // if (!cell.isRowMergeContinue) {
            //     this.rowMergeComplete = false;
            // }
            this.rowMergeComplete = false;
            if (cell.rowSpan > 1) {
                let cellIn : number = i;
                let rowin : number = this.grid.rows.rowCollection.indexOf(this);
                for (let j : number = 0; j < cell.rowSpan; j++ ) {
                    if ( (j + 1) < cell.rowSpan) {
                        this.grid.rows.getRow(rowin + j + 1).cells.getCell(cellIn).hasRowSpan = true;
                    }
                }
                if (maxHeight < cell.height) {
                    maxHeight = cell.height;
                }
                continue;
            }
            rowHeight = Math.max(rowHeight, cell.height);
        }
        if (maxHeight > rowHeight) {
            rowHeight = maxHeight;
        }
        if (rowHeight === 0) {
            rowHeight = maxHeight;
        } else if (rowSpanRemainingHeight > 0) {
            rowHeight += rowSpanRemainingHeight;
        }
        return rowHeight;
    }
    private measureWidth() : number {
        let rowWid : number = 0;
        for (let i : number = 0; i < this.grid.columns.count; i++) {
            let column : PdfGridColumn = this.grid.columns.getColumn(i);
            rowWid += column.width;
        }
        return rowWid;
    }
}
/**
 * `PdfGridRowCollection` class provides access to an ordered, strongly typed collection of 'PdfGridRow' objects.
 * @private
 */
export class PdfGridRowCollection {
    // Fields
    /**
     * @hidden
     * @private
     */
    private grid : PdfGrid;
    /**
     * The row collection of the `grid`.
     * @private
     */
    private rows : PdfGridRow[];
    // Constructor
    /**
     * Initializes a new instance of the `PdfGridRowCollection` class with the parent grid.
     * @private
     */
    public constructor(grid : PdfGrid) {
        this.rows = [];
        this.grid = grid;
    }
    //Properties
    /**
     * Gets the number of header in the `PdfGrid`.[Read-Only].
     * @private
     */
    public get count() : number {
        return this.rows.length;
    }
    //Implementation
    /**
     * Return the row collection of the `grid`.
     * @private
     */
    public get rowCollection() : PdfGridRow[] {
        return this.rows;
    }
    /**
     * `Adds` the specified row.
     * @private
     */
    public addRow() : PdfGridRow
    /**
     * `Adds` the specified row.
     * @private
     */
    public addRow(row : PdfGridRow) : void
    public addRow(arg ?: PdfGridRow) : void | PdfGridRow {
        if (typeof arg === 'undefined') {
            let temprow : PdfGridRow = new PdfGridRow(this.grid);
            this.addRow(temprow);
            return temprow;
        } else {
            arg.style.setBackgroundBrush(this.grid.style.backgroundBrush);
            arg.style.setFont(this.grid.style.font);
            arg.style.setTextBrush(this.grid.style.textBrush);
            arg.style.setTextPen(this.grid.style.textPen);
            if (arg.cells.count === 0) {
                for (let i : number = 0; i < this.grid.columns.count; i++) {
                    arg.cells.add(new PdfGridCell());
                }
            }
            this.rows.push(arg);
        }
    }
    /**
     * Return the row by index.
     * @private
     */
    public getRow(index : number) : PdfGridRow {
        return this.rows[index];
    }
}
/**
 * `PdfGridHeaderCollection` class provides customization of the settings for the header.
 * @private
 */
export class PdfGridHeaderCollection {
    /**
     * The `grid`.
     * @private
     */
    private grid : PdfGrid;
    /**
     * The array to store the `rows` of the grid header.
     * @private
     */
    private rows : PdfGridRow[] = [];
    //constructor
    /**
     * Initializes a new instance of the `PdfGridHeaderCollection` class with the parent grid.
     * @private
     */
    public constructor(grid : PdfGrid) {
        this.grid = grid;
        this.rows = [];
    }
    //Properties
    /**
     * Gets a 'PdfGridRow' object that represents the `header` row in a 'PdfGridHeaderCollection' control.[Read-Only].
     * @private
     */
    public getHeader(index : number) : PdfGridRow {
        // if (index < 0 || index >= Count) {
        //     throw new IndexOutOfRangeException();
        // }
        return (this.rows[index]);
    }
    /**
     * Gets the `number of header` in the 'PdfGrid'.[Read-Only]
     * @private
     */
    public get count() : number {
        return this.rows.length;
    }
    //Implementation
    /**
     * `Adds` the specified row.
     * @private
     */
    public add(row : PdfGridRow) : void
    /**
     * `Adds` the specified row.
     * @private
     */
    public add(count : number) : PdfGridRow[]
    public add(arg : number|PdfGridRow) : void|PdfGridRow[] {
        if (typeof arg === 'number') {
            let row : PdfGridRow;
            for (let i : number = 0; i < arg; i++) {
                row = new PdfGridRow(this.grid);
                for (let j : number = 0; j < this.grid.columns.count; j++) {
                    row.cells.add(new PdfGridCell());
                }
                this.rows.push(row);
            }
            return this.rows;
        } else {
            this.rows.push(arg);
        }
    }
    public indexOf(row : PdfGridRow) : number {
        return this.rows.indexOf(row);
    }
}