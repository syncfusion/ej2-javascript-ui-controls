/**
 * `PdfGridColumn.ts` class for EJ2-PDF
 */
import { PdfGrid } from './pdf-grid';
import { PdfGridRow } from './pdf-grid-row';
import { PdfGridCell } from './pdf-grid-cell';
import { PdfStringFormat } from './../../graphics/fonts/pdf-string-format';
/**
 * `PdfGridColumn` class represents the schema of a column in a 'PdfGrid'.
 */
export class PdfGridColumn {
    //Fields
    /**
     * The current `grid`.
     * @private
     */
    private grid : PdfGrid;
    /**
     * The `width` of the column.
     * @default 0
     * @private
     */
    public columnWidth : number = 0;
    /**
     * Represent the `custom width` of the column.
     * @private
     */
    public isCustomWidth : boolean;
    /**
     * The `string format` of the column.
     * @private
     */
    private stringFormat : PdfStringFormat;
    //Constructors
    /**
     * Initializes a new instance of the `PdfGridColumn` class with the parent grid.
     * @private
     */
    public constructor(grid : PdfGrid) {
        this.grid = grid;
    }
    /**
     * Gets or sets the `width` of the 'PdfGridColumn'.
     * @private
     */
    public get width() : number {
        return this.columnWidth;
    }
    public set width(value : number) {
        this.isCustomWidth = true;
        this.columnWidth = value;
    }
    /**
     * Gets or sets the information about the text `formatting`.
     * @private
     */
    public get format() : PdfStringFormat {
        if (this.stringFormat == null) {
            this.stringFormat = new PdfStringFormat(); //GetDefaultFormat();
        }
        return this.stringFormat;
    }
    public set format(value : PdfStringFormat) {
        this.stringFormat = value;
    }
}
/**
 * `PdfGridColumnCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfGridColumn' objects.
 * @private
 */
export class PdfGridColumnCollection {
    //Fields
    /**
     * @hidden
     * @private
     */
    private grid : PdfGrid;
    /**
     * @hidden
     * @private
     */
    private internalColumns : PdfGridColumn[] = [];
    /**
     * @hidden
     * @private
     */
    private columnWidth : number = 0;
    //properties

    //Constructors
    /**
     * Initializes a new instance of the `PdfGridColumnCollection` class with the parent grid.
     * @private
     */
    public constructor(grid : PdfGrid) {
        this.grid = grid;
        this.internalColumns = [];
    }
    //Iplementation
    /**
     * `Add` a new column to the 'PdfGrid'.
     * @private
     */
    public add(count : number) : void {
    // public add(column : PdfGridColumn) : void
    // public add(arg : number|PdfGridColumn) : void {
        // if (typeof arg === 'number') {
        for (let i : number = 0; i < count; i++) {
            this.internalColumns.push(new PdfGridColumn(this.grid));
            for (let index : number = 0; index < this.grid.rows.count; index++) {
                let row : PdfGridRow = this.grid.rows.getRow(index);
                let cell : PdfGridCell = new PdfGridCell();
                cell.value = '';
                row.cells.add(cell);
            }
        }
        // } else {
        //     let column : PdfGridColumn = new PdfGridColumn(this.grid);
        //     this.columns.push(column);
        //     return column;
        // }
    }
    /**
     * Gets the `number of columns` in the 'PdfGrid'.[Read-Only].
     * @private
     */
    public get count() : number {
        return this.internalColumns.length;
    }
    /**
     * Gets the `widths`.
     * @private
     */
    public get width() : number {
        if (this.columnWidth === 0 ) {
            this.columnWidth = this.measureColumnsWidth();
        }
        if (this.grid.initialWidth !== 0 && this.columnWidth !== this.grid.initialWidth && !this.grid.style.allowHorizontalOverflow) {
            this.columnWidth = this.grid.initialWidth;
            this.grid.isPageWidth = true;
        }
        return this.columnWidth;
    }
    /**
     * Gets the `array of PdfGridColumn`.[Read-Only]
     * @private
     */
    public get columns() : PdfGridColumn[] {
        return this.internalColumns;
    }
    /**
     * Gets the `PdfGridColumn` from the specified index.[Read-Only]
     * @private
     */
    public getColumn(index : number) : PdfGridColumn {
        if (index >= 0 && index <= this.columns.length) {
            return this.columns[index];
        } else {
            throw Error('can not get the column from the index: ' + index);
        }
    }

    //Implementation
    /**
     * `Calculates the column widths`.
     * @private
     */
    public measureColumnsWidth() : number {
        let totalWidth : number = 0;
        this.grid.measureColumnsWidth();
        for (let i : number = 0, count : number = this.internalColumns.length; i < count; i++) {
            totalWidth += this.internalColumns[i].width;
        }
        return totalWidth;
    }
    /**
     * Gets the `widths of the columns`.
     * @private
     */
    public getDefaultWidths(totalWidth : number) : number[] {
        let widths : number[] = [];
        let summ : number = 0.0;
        let subFactor : number = this.count;
        for (let i : number = 0; i < this.count; i++) {
            if (this.grid.isPageWidth && totalWidth >= 0 && !this.internalColumns[i].isCustomWidth) {
                this.internalColumns[i].width = 0;
            } else {
                widths[i] = this.internalColumns[i].width;
                if (this.internalColumns[i].width > 0 && this. internalColumns[i].isCustomWidth) {
                    totalWidth -= this.internalColumns[i].width;
                    subFactor--;
                } else {
                    widths[i] = 0;
                }
            }
        }
        for (let i : number = 0; i < this.count; i++) {
            let width : number = totalWidth / subFactor;
            if (widths[i] <= 0) {
                widths[i] = width;
            }
        }
        return widths;
    }
}