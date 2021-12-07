import { PdfGanttCellStyle, IGanttStyle } from './../base/interface';
import {
    PdfTreeGridColumnCollection, PdfTreeGridCell, PdfTreeGridRow, PdfTreeGridHeaderCollection, PdfTreeGridRowCollection
} from './pdf-base/index';
import { PdfTreeGridStyle, PdfBorders, PdfTreeGridLayouter, PdfTreeGridLayoutResult, PdfTreeGridLayoutFormat
} from './pdf-base/index';
import {
    PdfLayoutElement, PdfLayoutParams, RectangleF, PdfLayoutFormat, PdfPage, PointF, PdfLayoutResult,
    SizeF, PdfGridBeginCellDrawEventArgs, PdfGridEndCellDrawEventArgs
} from '@syncfusion/ej2-pdf-export';

/**
 * PdfTreeGrid Class for EJ2-PDF
 */
export class PdfTreeGrid extends PdfLayoutElement {
    public columns: PdfTreeGridColumnCollection;
    public rows: PdfTreeGridRowCollection;
    public style: PdfTreeGridStyle;
    private initialWidth: number;
    private treeGridSize: SizeF = new SizeF(0, 0);
    public layouter: PdfTreeGridLayouter;
    public headers: PdfTreeGridHeaderCollection;
    private layoutFormat: PdfLayoutFormat;
    public beginCellDraw: Function;
    public endCellDraw: Function;
    private treegridLocation: RectangleF;
    public treeColumnIndex: number = 0;
    public rowHeight: number;
    public allowRowBreakAcrossPages: boolean = true;
    public enableHeader: boolean = true;
    public isFitToWidth: boolean = false;
    public ganttStyle: IGanttStyle;

    constructor() {
        super();
        this.columns = new PdfTreeGridColumnCollection(this);
        this.rows = new PdfTreeGridRowCollection(this);
        this.headers = new PdfTreeGridHeaderCollection(this);
        this.style = new PdfTreeGridStyle();
        this.rowHeight = 0;
    }

    //Properties
    /**
     * Gets a value indicating whether the `start cell layout event` should be raised.
     *
     * @returns {boolean} .
     * @private
     */
    public get raiseBeginCellDraw(): boolean {
        // eslint-disable-next-line
        return (typeof this.beginCellDraw !== 'undefined' && typeof this.beginCellDraw !== null);
    }
    /**
     * Gets a value indicating whether the `end cell layout event` should be raised.
     *
     * @returns {boolean} .
     * @private
     */
    public get raiseEndCellDraw(): boolean {
        // eslint-disable-next-line
        return (typeof this.endCellDraw !== 'undefined' && typeof this.endCellDraw !== null);
    }
    public get size(): SizeF {
        if ((this.treeGridSize.width === 0 && this.treeGridSize.height === 0)) {
            this.treeGridSize = this.calculateTreeGridSize();
        }
        return this.treeGridSize;
    }
    public set size(value: SizeF) {
        this.treeGridSize = value;
    }

    //Implementation
    /**
     * `Draws` the element on the page with the specified page and 'PointF' class
     *
     * @param {PdfPage} page .
     * @param {PointF} location .
     * @returns {PdfLayoutResult} .
     * @private
     */
    public draw(page: PdfPage, location: PointF): PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and pair of coordinates
     *
     * @param {PdfPage} page .
     * @param {number} x .
     * @param {number} y .
     * @returns {PdfLayoutResult} .
     * @private
     */
    public draw(page: PdfPage, x: number, y: number): PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and 'RectangleF' class
     *
     * @param {PdfPage} page .
     * @param {RectangleF} layoutRectangle .
     * @returns {PdfLayoutResult} .
     * @private
     */
    public draw(page: PdfPage, layoutRectangle: RectangleF): PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, 'PointF' class and layout format
     *
     * @param {PdfPage} page .
     * @param {PointF} location .
     * @param {PdfTreeGridLayoutFormat} format .
     * @returns {PdfLayoutResult} .
     * @private
     */
    public draw(page: PdfPage, location: PointF, format: PdfLayoutFormat): PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, pair of coordinates and layout format
     *
     * @param {PdfPage} page .
     * @param {number} x .
     * @param {number} y .
     * @param {PdfLayoutFormat} format .
     * @returns {PdfLayoutResult}
     * @private
     */
    public draw(page: PdfPage, x: number, y: number, format: PdfLayoutFormat): PdfLayoutResult
    /**
     * `Draws` the element on the page.
     *
     * @private
     */
    public draw(page: PdfPage, layoutRectangle: RectangleF, embedFonts: boolean): PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, 'RectangleF' class and layout format
     *
     * @private
     */
    /* eslint-disable-next-line */
    public draw(arg1: PdfPage, arg2: RectangleF | PointF | number, arg3?: PdfLayoutFormat | number | boolean, arg4?: PdfLayoutFormat): PdfLayoutResult {
        if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2.x, arg2.y);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            return this.drawHelper(arg1, arg2, arg3, null);
        } else if (arg2 instanceof RectangleF && typeof arg2.width !== 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2, null);
        } else if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && arg3 instanceof PdfLayoutFormat) {
            return this.drawHelper(arg1, arg2.x, arg2.y, arg3);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && (arg4 instanceof PdfLayoutFormat || arg4 == null)) {
            const width: number = (arg1.graphics.clientSize.width - arg2);
            const layoutRectangle: RectangleF = new RectangleF(arg2, arg3, width, 0);
            return this.drawHelper(arg1, layoutRectangle, arg4);
        } else if (arg2 instanceof RectangleF && typeof arg2.width !== 'undefined' && typeof arg3 === 'boolean') {
            return this.drawHelper(arg1, arg2, null);
        } else {
            return this.drawHelper(arg1, (arg2 as RectangleF), arg3 as PdfLayoutFormat);
        }
    }

    public measureColumnsWidth(bounds?: RectangleF): void {
        if (typeof bounds !== 'undefined') {
            const widths: number[] = this.columns.getDefaultWidths(bounds.width - bounds.x);
            for (let i: number = 0; i < this.columns.count; i++) {
                if (this.columns.getColumn(i).width < 0) {
                    this.columns.getColumn(i).width = widths[i];
                }
            }
        } else {
            const widths: number[] = [];
            let cellWidth: number = 0;
            let totalWidth: number = 0;
            let rowLevel: number = 0;
            // if(this.headers.count > 0){
            //     let colCount: number = this.headers.getHeader(0).cells.count;
            //     for(let i: number = 0; i < colCount; i++){
            //         let rowCount: number = this.headers.count;
            //         for(let j: number = 0; j < rowCount; j++){
            //             let tempWidth: number = this.headers.getHeader(j).cells.getCell(i).width;
            //             let rowWidth: number = this.initialWidth > 0 ? Math.min(this.initialWidth, tempWidth) :
            //                 tempWidth;
            //             cellWidth = Math.max(cellWidth, rowWidth);
            //         }
            //         widths.push(cellWidth);
            //     }
            // }
            const colCount: number = this.columns.count;
            for (let i: number = 0; i < colCount; i++) {
                const rowCount: number = this.rows.count;
                for (let j: number = 0; j < rowCount; j++) {
                    const tempWidth: number = this.rows.getRow(j).cells.getCell(i).width;
                    const rowWidth: number = this.initialWidth > 0 ? Math.min(this.initialWidth, tempWidth) : tempWidth;
                    cellWidth = Math.max(cellWidth, rowWidth);
                    cellWidth = Math.max(this.columns.getColumn(i).width, cellWidth);
                    if (this.columns.getColumn(i).isTreeColumn) {
                        rowLevel = Math.max(rowLevel, this.rows.getRow(j).level);
                    }
                }
                if (this.columns.getColumn(i).isTreeColumn) {
                    widths.push(cellWidth + (rowLevel * 10));
                } else {
                    widths.push(cellWidth);
                }
                // eslint-disable-next-line
                totalWidth += cellWidth;
                cellWidth = 0;
            }
            for (let i: number = 0; i < this.columns.count; i++) {
                if (this.columns.getColumn(i).width < 0) {
                    this.columns.getColumn(i).width = widths[i];
                }
            }
        }
    }

    private calculateTreeGridSize(): SizeF {
        let height: number = 0;
        const width: number = this.columns.width;
        for (let i: number = 0; i < this.headers.count; i++) {
            const row: PdfTreeGridRow = this.headers.getHeader(i);
            height += row.height;
        }
        for (let i: number = 0; i < this.rows.count; i++) {
            const row: PdfTreeGridRow = this.rows.getRow(i);
            height += row.height;
        }
        return new SizeF(width, height);
    }
    public drawGrid(page: PdfPage, x: number, y: number, format: PdfTreeGridLayoutFormat): PdfTreeGridLayoutResult {
        this.initialWidth = page.graphics.clientSize.width;
        const layout: RectangleF = new RectangleF(0, 0, page.getClientSize().height, 0);
        return this.draw(page, layout, format);
    }

    protected layout(param: PdfLayoutParams): PdfLayoutResult {
        if (this.rows.count !== 0) {
            const style: PdfGanttCellStyle = this.rows.getRow(0).cells.getCell(0).style;
            if (style.borders.left.width !== 1) {
                const x: number = style.borders.left.width / 2;
                const y: number = style.borders.top.width / 2;
                if (param.bounds.x === PdfBorders.default.right.width / 2 &&
                    param.bounds.y === PdfBorders.default.right.width / 2) {
                    const newBound: RectangleF = new RectangleF(new PointF(x, y), new SizeF(this.size.width, this.size.height));
                    param.bounds = newBound;
                }
            }
        }
        this.setSpan();
        this.layouter = new PdfTreeGridLayouter(this);
        const result: PdfTreeGridLayoutResult = this.layouter.layoutInternal(param);
        return result;
    }

    public onBeginCellDraw(args: PdfGridBeginCellDrawEventArgs): void {
        if (this.raiseBeginCellDraw) {
            this.beginCellDraw(this, args);
        }
    }
    public onEndCellDraw(args: PdfGridEndCellDrawEventArgs): void {
        if (this.raiseEndCellDraw) {
            this.endCellDraw(this, args);
        }
    }
    public setSpan(): void {
        let colSpan: number = 1;
        let rowSpan: number = 1;
        let currentCellIndex: number = 0;
        let currentRowIndex: number = 0;
        let maxSpan: number = 0;
        let rowCount: number = this.headers.count;
        for (let i: number = 0; i < rowCount; i++) {
            const row: PdfTreeGridRow = this.headers.getHeader(i);
            maxSpan = 0;
            const colCount: number = row.cells.count;
            for (let j: number = 0; j < colCount; j++) {
                const cell: PdfTreeGridCell = row.cells.getCell(j);
                maxSpan = Math.max(maxSpan, cell.rowSpan);
                //Skip setting span map for already coverted rows/columns.
                if (!cell.isCellMergeContinue && !cell.isRowMergeContinue && (cell.columnSpan > 1 || cell.rowSpan > 1)) {
                    if (cell.columnSpan + j > row.cells.count) {
                        throw new Error('Invalid span specified at row ' + j.toString() + ' column ' + i.toString());
                    }
                    if (cell.rowSpan + i > this.headers.count) {
                        throw new Error('Invalid span specified at Header ' + j.toString() + ' column ' + i.toString());
                    }

                    if (cell.columnSpan > 1 && cell.rowSpan > 1) {
                        colSpan = cell.columnSpan;
                        rowSpan = cell.rowSpan;
                        currentCellIndex = j;
                        currentRowIndex = i;
                        cell.isCellMergeStart = true;
                        cell.isRowMergeStart = true;
                        //Set Column merges for first row
                        while (colSpan > 1) {
                            currentCellIndex++;
                            row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                            row.cells.getCell(currentCellIndex).isRowMergeContinue = true;
                            row.cells.getCell(currentCellIndex).rowSpan = rowSpan;
                            colSpan--;
                        }
                        currentCellIndex = j;
                        colSpan = cell.columnSpan;
                        //Set Row Merges and column merges foreach subsequent rows.
                        while (rowSpan > 1) {
                            currentRowIndex++;
                            this.headers.getHeader(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                            this.headers.getHeader(currentRowIndex).cells.getCell(currentCellIndex).isRowMergeContinue = true;
                            rowSpan--;
                            while (colSpan > 1) {
                                currentCellIndex++;
                                this.headers.getHeader(currentRowIndex).cells.getCell(currentCellIndex).isCellMergeContinue = true;
                                this.headers.getHeader(currentRowIndex).cells.getCell(currentCellIndex).isRowMergeContinue = true;
                                colSpan--;
                            }
                            colSpan = cell.columnSpan;
                            currentCellIndex = j;
                        }
                    } else if (cell.columnSpan > 1 && cell.rowSpan === 1) {
                        colSpan = cell.columnSpan;
                        currentCellIndex = j;
                        cell.isCellMergeStart = true;
                        //Set Column merges.
                        while (colSpan > 1) {
                            currentCellIndex++;
                            row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                            colSpan--;
                        }
                    } else if (cell.columnSpan === 1 && cell.rowSpan > 1) {
                        rowSpan = cell.rowSpan;
                        currentRowIndex = i;
                        //Set row Merges.
                        while (rowSpan > 1) {
                            currentRowIndex++;
                            this.headers.getHeader(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                            rowSpan--;
                        }
                    }
                }
            }
            row.maximumRowSpan = maxSpan;
        }
        colSpan = rowSpan = 1;
        currentCellIndex = currentRowIndex = 0;
        rowCount = this.rows.count;
        for (let i: number = 0; i < rowCount; i++) {
            const row: PdfTreeGridRow = this.rows.getRow(i);
            const colcount: number = row.cells.count;
            for (let j: number = 0; j < colcount; j++) {
                const cell: PdfTreeGridCell = row.cells.getCell(j);
                //Skip setting span map for already coverted rows/columns.
                if (!cell.isCellMergeContinue && !cell.isRowMergeContinue && (cell.columnSpan > 1 || cell.rowSpan > 1)) {
                    if (cell.columnSpan + j > row.cells.count) {
                        throw new Error('Invalid span specified at row {0} column {1} ' + j.toString());
                    }
                    if (cell.rowSpan + i > this.rows.count) {
                        throw new Error('Invalid span specified at row {0} column {1} ' + j.toString());
                    }
                    if (cell.columnSpan > 1 && cell.rowSpan > 1) {
                        colSpan = cell.columnSpan;
                        rowSpan = cell.rowSpan;
                        currentCellIndex = j;
                        currentRowIndex = i;
                        cell.isCellMergeStart = true;
                        cell.isRowMergeStart = true;
                        //set Column merges for first row.
                        while (colSpan > 1) {
                            currentCellIndex++;
                            row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                            colSpan--;
                        }
                        currentCellIndex = j;
                        colSpan = cell.columnSpan;
                        // Set row merges and column merges for each subsequentt rows.
                        while (rowSpan > 1) {
                            currentRowIndex++;
                            this.rows.getRow(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                            rowSpan--;
                            while (colSpan > 1) {
                                currentCellIndex++;
                                this.rows.getRow(currentRowIndex).cells.getCell(currentCellIndex).isCellMergeContinue = true;
                                colSpan--;
                            }
                            colSpan = cell.columnSpan;
                            currentCellIndex = j;
                        }
                    } else if (cell.columnSpan > 1 && cell.rowSpan === 1) {
                        colSpan = cell.columnSpan;
                        currentCellIndex = j;
                        cell.isCellMergeStart = true;
                        //set Column merges.
                        while (colSpan > 1) {
                            currentCellIndex++;
                            row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                            colSpan--;
                        }
                    } else if (cell.columnSpan === 1 && cell.rowSpan > 1) {
                        rowSpan = cell.rowSpan;
                        currentRowIndex = i;
                        //set row merges.
                        while (rowSpan > 1) {
                            currentRowIndex++;
                            this.rows.getRow(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                            rowSpan--;
                        }
                    }
                }
            }
        }
    }
}
