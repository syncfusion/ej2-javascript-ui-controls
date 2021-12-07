/**
 * PdfGrid.ts class for EJ2-PDF
 */
import { PdfGridColumnCollection } from './pdf-grid-column';
import { PdfGridRow } from './pdf-grid-row';
import { PdfGridCell } from './pdf-grid-cell';
import { PdfGridRowCollection, PdfGridHeaderCollection } from './pdf-grid-row';
import { RectangleF, SizeF, PointF } from './../../drawing/pdf-drawing';
import { PdfPage } from './../../pages/pdf-page';
import { PdfLayoutElement } from './../../graphics/figures/layout-element';
import { PdfLayoutResult, PdfLayoutParams, PdfLayoutFormat } from './../../graphics/figures/base/element-layouter';
import { PdfGridStyle , PdfGridCellStyle} from './styles/style';
import { PdfBorders} from './styles/pdf-borders';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { PdfGridLayouter, PdfGridLayoutResult  } from './../../structured-elements/grid/layout/grid-layouter';
import { PdfGridBeginCellDrawEventArgs, PdfGridEndCellDrawEventArgs} from '../../structured-elements/grid/layout/grid-layouter';
export class PdfGrid extends PdfLayoutElement {
    //Fields
    /**
     * @hidden
     * @private
     */
    private gridColumns : PdfGridColumnCollection;
    /**
     * @hidden
     * @private
     */
    private gridRows : PdfGridRowCollection;
    /**
     * @hidden
     * @private
     */
    private gridHeaders : PdfGridHeaderCollection;
    /**
     * @hidden
     * @private
     */
    private gridInitialWidth : number ;
    /**
     * @hidden
     * @private
     */
    public isComplete : boolean;
    /**
     * @hidden
     * @private
     */
    private gridSize : SizeF = new SizeF(0, 0);
    /**
     * @hidden
     * @private
     */
    private layoutFormat : PdfLayoutFormat;
    /**
     * @hidden
     * @private
     */
    private gridLocation : RectangleF;
    /**
     * @hidden
     * @private
     */
    private gridStyle : PdfGridStyle;
    /**
     * @hidden
     * @private
     */
    private ispageWidth : boolean;
    /**
     * Check weather it is `child grid or not`.
     * @private
     */
    private ischildGrid : boolean;
    /**
     * Check the child grid is ' split or not'
     */
    public isGridSplit : boolean = false;
    /**
     * @hidden
     * @private
     */
    public rowLayoutBoundsWidth : number;
    /**
     * @hidden
     * @private
     */
    public isRearranged : boolean = false;
    /**
     * @hidden
     * @private
     */
    private bRepeatHeader : boolean;
    /**
     * @hidden
     * @private
     */
    private pageBounds : RectangleF = new RectangleF();

    //GridLayouter-Fields
    /**
     * @hidden
     * @private
     */
    private currentPage :  PdfPage;
    /**
     * @hidden
     * @private
     */
    private currentPageBounds : SizeF;
    /**
     * @hidden
     * @private
     */
    private currentBounds : RectangleF;
    /**
     * @hidden
     * @private
     */
    private currentGraphics : PdfGraphics;
    /**
     * @hidden
     * @private
     */
    public listOfNavigatePages : number[] = [];
    /**
     * @hidden
     * @private
     */
    private startLocation : PointF;
    /**
     * @hidden
     * @private
     */
    public parentCellIndex : number = 0 ;
    public  tempWidth : number = 0;
    /**
     * @hidden
     * @private
     */
    private breakRow : boolean = true;
    public splitChildRowIndex : number = -1;
    private rowBreakPageHeightCellIndex : number;
    //Events
    /**
     * The event raised on `starting cell drawing`.
     * @event
     * @private
     */
    public beginCellDraw : Function;
    /**
     * The event raised on `ending cell drawing`.
     * @event
     * @private
     */
    public endCellDraw : Function;
    /**
     * The event raised on `begin cell lay outing`.
     * @event
     * @private
     */
    //public beginPageLayout : Function;
    /**
     * The event raised on `end cell lay outing`.
     * @event
     * @private
     */
    //public endPageLayout : Function;
    public hasRowSpanSpan : boolean = false;
    public hasColumnSpan : boolean = false;
    public isSingleGrid : boolean = true;
    private parentCell : PdfGridCell;
    //constructor
    /**
     * Initialize a new instance for `PdfGrid` class.
     * @private
     */
    public constructor() {
        super();
    }
    //Properties
    /**
     * Gets a value indicating whether the `start cell layout event` should be raised.
     * @private
     */
    public get raiseBeginCellDraw() : boolean {
        return (typeof this.beginCellDraw !== 'undefined' && typeof this.beginCellDraw !== null);
    }
    /**
     * Gets a value indicating whether the `end cell layout event` should be raised.
     * @private
     */
    public get raiseEndCellDraw() : boolean {
        return (typeof this.endCellDraw !== 'undefined' && typeof this.endCellDraw !== null);
    }
    /**
     * Gets or sets a value indicating whether to `repeat header`.
     * @private
     */
    public get repeatHeader() : boolean {
        if (this.bRepeatHeader == null || typeof this.bRepeatHeader === 'undefined') {
            this.bRepeatHeader = false;
        }
        return this.bRepeatHeader;
    }
    public set repeatHeader(value : boolean) {
        this.bRepeatHeader = value;
    }
    /**
     * Gets or sets a value indicating whether to split or cut rows that `overflow a page`.
     * @private
     */
    public get allowRowBreakAcrossPages() : boolean {
        return this.breakRow;
    }
    public set allowRowBreakAcrossPages(value : boolean) {
        this.breakRow = value;
    }
    /**
     * Gets the `column` collection of the PdfGrid.[Read-Only]
     * @private
     */
    public get columns() : PdfGridColumnCollection {
        if (this.gridColumns == null || typeof this.gridColumns === 'undefined') {
            this.gridColumns = new PdfGridColumnCollection(this);
        }
        return this.gridColumns;
    }
    /**
     * Gets the `row` collection from the PdfGrid.[Read-Only]
     * @private
     */
    public get rows() : PdfGridRowCollection {
        if (this.gridRows == null) {
            this.gridRows = new PdfGridRowCollection(this);
        }
        return (this.gridRows as PdfGridRowCollection);
    }
    /**
     * Gets the `headers` collection from the PdfGrid.[Read-Only]
     * @private
     */
    public get headers() : PdfGridHeaderCollection {
        if (this.gridHeaders == null || typeof this.gridHeaders === 'undefined') {
            this.gridHeaders = new PdfGridHeaderCollection(this);
        }
        return this.gridHeaders;
    }
    /**
     * Indicating `initial width` of the page.
     * @private
     */
    public get initialWidth() : number {
        return this.gridInitialWidth;
    }
    public set initialWidth(value : number) {
        this.gridInitialWidth = value;
    }
    /**
     * Gets or sets the `grid style`.
     * @private
     */
    public get style() : PdfGridStyle {
        if (this.gridStyle == null) {
            this.gridStyle = new PdfGridStyle();
        }
        return this.gridStyle;
    }
    public set style(value : PdfGridStyle) {
        if (this.gridStyle == null) {
            this.gridStyle = value;
        }
    }
    /**
     * Gets a value indicating whether the grid column width is considered to be `page width`.
     * @private
     */
    public get isPageWidth() : boolean {
        return this.ispageWidth;
    }
    public set isPageWidth(value : boolean) {
        this.ispageWidth = value;
    }
    /**
     * Gets or set if grid `is nested grid`.
     * @private
     */
    public get isChildGrid() : boolean {
        return this.ischildGrid;
    }
    public set isChildGrid(value : boolean) {
        this.ischildGrid = value;
    }
    /**
     * Gets or set if grid ' is split or not'
     * @public
     */
    // public get isGridSplit() : boolean {
    //     return this.isgridSplit;
    // }
    // public set isGridSplit(value : boolean) {
    //     this.isgridSplit = value;
    // }public get isGridSplit() : boolean {
    //     return this.isgridSplit;
    // }
    // public set isGridSplit(value : boolean) {
    //     this.isgridSplit = value;
    // }
    /**
     * Gets the `size`.
     * @private
     */
    public get size() : SizeF {
        if ((this.gridSize.width === 0 || typeof this.gridSize.width === 'undefined') && this.gridSize.height === 0) {
            this.gridSize = this.measure();
        }
        return this.gridSize;
        // } else {
        //     return this.gridSize;
        // }
    }
    public set size(value : SizeF) {
        this.gridSize = value;
    }
    public get ParentCell() : PdfGridCell{
        return this.parentCell;
     }
     public set ParentCell(value : PdfGridCell) {
        this.parentCell = value;
    }

    public get LayoutFormat() : PdfLayoutFormat {
        return this.layoutFormat;
    }
    //Implementation
    /**
     * `Draws` the element on the page with the specified page and 'PointF' class
     * @private
     */
    public draw(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and pair of coordinates
     * @private
     */
    public draw(page : PdfPage, x : number, y : number) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and 'RectangleF' class
     * @private
     */
    public draw(page : PdfPage, layoutRectangle : RectangleF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, 'PointF' class and layout format
     * @private
     */
    public draw(page : PdfPage, location : PointF, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, pair of coordinates and layout format
     * @private
     */
    public draw(page : PdfPage, x : number, y : number, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page.
     * @private
     */
    public draw(page : PdfPage, layoutRectangle : RectangleF, embedFonts : boolean) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, 'RectangleF' class and layout format
     * @private
     */
    public draw(page : PdfPage, layoutRectangle : RectangleF, format : PdfLayoutFormat) : PdfLayoutResult
    public draw(arg1 : PdfPage, arg2 : RectangleF|PointF|number, arg3 ?: PdfLayoutFormat|number|boolean,
                arg4 ?: PdfLayoutFormat) : PdfLayoutResult {
        if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2.x, arg2.y);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            return this.drawHelper(arg1, arg2, arg3, null);
        } else if (arg2 instanceof RectangleF && typeof (arg2 as RectangleF).width !== 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2, null);
        } else if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && arg3 instanceof PdfLayoutFormat) {
            return this.drawHelper(arg1, arg2.x, arg2.y, arg3);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && (arg4 instanceof PdfLayoutFormat || arg4 == null)) {
            let width : number = (arg1.graphics.clientSize.width - arg2);
            let layoutRectangle : RectangleF = new RectangleF(arg2, arg3, width, 0);
            return this.drawHelper(arg1, layoutRectangle, arg4);
        } else if (arg2 instanceof RectangleF && typeof (arg2 as RectangleF).width !== 'undefined' && typeof arg3 === 'boolean') {
            return this.drawHelper(arg1, arg2, null);
        } else {
            return this.drawHelper(arg1, (arg2 as RectangleF), arg3 as PdfLayoutFormat);
        }
    }
    /**
     * `measures` this instance.
     * @private
     */
    private measure() : SizeF {
        let height : number = 0;
        let width : number = this.columns.width;
        for (let i : number = 0; i < this.headers.count; i++) {
            let row : PdfGridRow = this.headers.getHeader(i);
            height += row.height;
        }
        for (let i : number = 0; i < this.rows.count; i++) {
            let row : PdfGridRow = this.rows.getRow(i);
            height += row.height;
        }
        return new SizeF(width, height);
    }

    public onBeginCellDraw(args : PdfGridBeginCellDrawEventArgs ): void {
        if (this.raiseBeginCellDraw) {
            this.beginCellDraw(this, args);
        }
    }
    public onEndCellDraw(args : PdfGridEndCellDrawEventArgs ): void {
        if (this.raiseEndCellDraw) {
            this.endCellDraw(this, args);
        }
    }
    /**
     * `Layouts` the specified graphics.
     * @private
     */
    protected layout(param : PdfLayoutParams) : PdfLayoutResult {
        if (this.rows.count !== 0) {
            let currentRow : PdfGridCellStyle = this.rows.getRow(0).cells.getCell(0).style;
            if (currentRow.borders != null && (( currentRow.borders.left != null && currentRow.borders.left.width !== 1) ||
                   (currentRow.borders.top != null && currentRow.borders.top.width !== 1))) {
                let x : number = currentRow.borders.left.width / 2;
                let y : number = currentRow.borders.top.width / 2;
                if (param.bounds.x === PdfBorders.default.right.width / 2 && param.bounds.y === PdfBorders.default.right.width / 2) {
                    let newBound : RectangleF = new RectangleF(x, y, this.gridSize.width, this.gridSize.height);
                    param.bounds = newBound;
                }
            }
        }
        this.setSpan();
        this.checkSpan();
        this.layoutFormat = param.format;
        this.gridLocation = param.bounds;
        let layouter : PdfGridLayouter = new PdfGridLayouter(this);
        let result : PdfGridLayoutResult = (layouter.Layouter(param)) as PdfGridLayoutResult;

        return result;
    }
    public setSpan() : void {
        let colSpan : number = 1;
        let rowSpan : number = 1;
        let currentCellIndex : number = 0;
        let currentRowIndex : number = 0;
        let maxSpan : number = 0;
        let rowCount : number = this.headers.count;
        for (let i : number = 0; i < rowCount; i++) {
            let row : PdfGridRow = this.headers.getHeader(i);
            maxSpan = 0;
            let colCount : number = row.cells.count;
            for (let j : number = 0; j < colCount; j++) {
                let cell : PdfGridCell = row.cells.getCell(j);
                maxSpan = Math.max(maxSpan, cell.rowSpan);
                //Skip setting span map for already coverted rows/columns.
                if (!cell.isCellMergeContinue && !cell.isRowMergeContinue && (cell.columnSpan > 1 || cell.rowSpan > 1)) {
                    if (cell.columnSpan + j > row.cells.count) {
                        throw new Error('Invalid span specified at row ' + j.toString() + ' column ' + i.toString());
                    }
                    if (cell.rowSpan + i > this.headers.count) {
                        throw new Error('Invalid span specified at Header ' + j.toString() + ' column ' + i.toString());
                    }
                    // if (this.rows.count !== 0 && cell.rowSpan + i > this.rows.count) {
                    //     throw new Error('Invalid span specified at row ' + j.toString() + ' column ' + i.toString());
                    // }
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
    }
    public checkSpan() : void {
        let cellcolSpan : number;
        let cellrowSpan : number = 1;
        let cellmaxSpan : number = 0;
        let currentCellIndex : number;
        let currentRowIndex : number = 0;
        cellcolSpan = cellrowSpan = 1;
        currentCellIndex = currentRowIndex = 0;
        if (this.hasRowSpanSpan || this.hasColumnSpan) {
            let rowCount : number = this.rows.count;
            for (let i : number = 0; i < rowCount; i++) {
                let row : PdfGridRow = this.rows.getRow(i);
                cellmaxSpan = 0;
                let colCount : number = row.cells.count;
                for (let j : number = 0; j < colCount; j++) {
                    let cell : PdfGridCell = row.cells.getCell(j);
                    cellmaxSpan = Math.max(cellmaxSpan, cell.rowSpan);
                    //Skip setting span map for already coverted rows/columns.
                    if (!cell.isCellMergeContinue && !cell.isRowMergeContinue
                        && (cell.columnSpan > 1 || cell.rowSpan > 1)) {
                        if (cell.columnSpan + j > row.cells.count) {
                            throw new Error('Invalid span specified at row  ' + j.toString() + ' column ' + i.toString());
                        }
                        if (cell.rowSpan + i > this.rows.count) {
                            throw new Error('Invalid span specified at row  ' + j.toString() + ' column ' + i.toString());
                        }
                        if (cell.columnSpan > 1 && cell.rowSpan > 1) {
                            cellcolSpan = cell.columnSpan;
                            cellrowSpan = cell.rowSpan;

                            currentCellIndex = j;
                            currentRowIndex = i;

                            cell.isCellMergeStart = true;
                            cell.isRowMergeStart = true;

                            //Set Column merges for first row
                            while (cellcolSpan > 1) {
                                currentCellIndex++;
                                row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                                row.cells.getCell(currentCellIndex).isRowMergeContinue = true;
                                cellcolSpan--;
                            }
                            currentCellIndex = j;
                            cellcolSpan = cell.columnSpan;

                            //Set Row Merges and column merges foreach subsequent rows.
                            while (cellrowSpan > 1) {
                                currentRowIndex++;
                                this.rows.getRow(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                                this.rows.getRow(currentRowIndex).cells.getCell(currentCellIndex).isRowMergeContinue = true;
                                cellrowSpan--;

                                while (cellcolSpan > 1) {
                                    currentCellIndex++;
                                    this.rows.getRow(currentRowIndex).cells.getCell(currentCellIndex).isCellMergeContinue = true;
                                    this.rows.getRow(currentRowIndex).cells.getCell(currentCellIndex).isRowMergeContinue = true;
                                    cellcolSpan--;
                                }
                                cellcolSpan = cell.columnSpan;
                                currentCellIndex = j;
                            }
                        } else if (cell.columnSpan > 1 && cell.rowSpan === 1) {
                            cellcolSpan = cell.columnSpan;
                            currentCellIndex = j;
                            cell.isCellMergeStart = true;

                            //Set Column merges.
                            while (cellcolSpan > 1) {
                                currentCellIndex++;
                                row.cells.getCell(currentCellIndex).isCellMergeContinue = true;
                                cellcolSpan--;
                            }
                        } else if (cell.columnSpan === 1 && cell.rowSpan > 1) {
                            cellrowSpan = cell.rowSpan;
                            currentRowIndex = i;

                            //Set row Merges.
                            while (cellrowSpan > 1) {
                                currentRowIndex++;
                                this.rows.getRow(currentRowIndex).cells.getCell(j).isRowMergeContinue = true;
                                cellrowSpan--;
                            }
                        }
                    }
                }
                row.maximumRowSpan = cellmaxSpan;
            }
        }
    }
    /* tslint:disable */
    /**
     * Calculates the `width` of the columns.
     * @private
     */
    public measureColumnsWidth() : void
    /**
     * Calculates the `width` of the columns.
     * @private
     */
    public measureColumnsWidth(bounds : RectangleF) : void
    public measureColumnsWidth(bounds ?: RectangleF) : void {
        if (typeof bounds !== 'undefined') {
            this.isPageWidth = false;
            let widths : number[] = this.columns.getDefaultWidths(bounds.width - bounds.x);
            //let tempWidth : number = this.columns.getColumn(0).width;
            for (let i : number = 0, count : number = this.columns.count; i < count; i++) {                                
                // if (this.columns.getColumn(i).width < 0)
                //     this.columns.getColumn(i).columnWidth = widths[i];
                // else if (this.columns.getColumn(i).width > 0 && !this.columns.getColumn(i).isCustomWidth && widths[i]>0 && this.isComplete)
                this.columns.getColumn(i).columnWidth = widths[i];
                this.tempWidth = widths[i]; 
            }            
            if (this.ParentCell != null && this.style.allowHorizontalOverflow == false && this.ParentCell.row.grid.style.allowHorizontalOverflow == false)
            {
                let padding : number = 0;
                let columnWidth : number = 0;
                let columnCount : number = this.columns.count;
                let childGridColumnWidth : number = 0;
                if (this.ParentCell.style.cellPadding != null || typeof this.ParentCell.style.cellPadding !== 'undefined') {
                    if(typeof this.ParentCell.style.cellPadding.left != 'undefined' && this.ParentCell.style.cellPadding.hasLeftPad){
                        padding += this.ParentCell.style.cellPadding.left;
                    }
                    if(typeof this.ParentCell.style.cellPadding.right != 'undefined' && this.ParentCell.style.cellPadding.hasRightPad){
                        padding += this.ParentCell.style.cellPadding.right;
                    }
                   
                }
                for (let i : number = 0; i < this.ParentCell.columnSpan; i++)
                {
                    columnWidth += this.ParentCell.row.grid.columns.getColumn(this.parentCellIndex + i).width;
                }
                for (let j : number = 0; j < this.columns.count; j++)
                {
                    if (this.gridColumns.getColumn(j).width > 0 && this.gridColumns.getColumn(j).isCustomWidth)
                    {
                        columnWidth -= this.gridColumns.getColumn(j).width;
                        columnCount--;
                    }
                }
                if((this.ParentCell.row.grid.style.cellPadding != null || typeof this.ParentCell.row.grid.style.cellPadding != 'undefined'))
                {
                    if(typeof this.ParentCell.row.grid.style.cellPadding.top != 'undefined' && this.ParentCell.row.grid.style.cellPadding.hasTopPad){
                        padding += this.ParentCell.row.grid.style.cellPadding.top;
                    }
                    if(typeof this.ParentCell.row.grid.style.cellPadding.bottom != 'undefined' && this.ParentCell.row.grid.style.cellPadding.hasBottomPad){
                        padding += this.ParentCell.row.grid.style.cellPadding.bottom;
                    }
                }
                if (this.ParentCell.row.grid.style.cellSpacing != 0){
                    columnWidth -= this.ParentCell.row.grid.style.cellSpacing * 2;
                }
                if (columnWidth > padding)
                {
                    childGridColumnWidth = (columnWidth - padding) / columnCount;
                    this.tempWidth=childGridColumnWidth;
                if (this.ParentCell != null )
                {
                    for (let j : number = 0; j < this.columns.count; j++)
                    {
                        if (!this.columns.getColumn(j).isCustomWidth)
                            this.columns.getColumn(j).columnWidth = childGridColumnWidth;                                           
                    }
                }
                }
            }
            // if (this.ParentCell != null && this.ParentCell.row.width > 0)
            // {
            //     if (this.isChildGrid && this.gridSize.width > this.ParentCell.row.width)
            //     {
            //         widths = this.columns.getDefaultWidths(bounds.width);
            //         for (let i : number = 0; i < this.columns.count; i++)
            //         {
            //             this.columns.getColumn(i).width = widths[i];
            //         }
            //     }
            // }
        } else {
            let widths : number[] = [this.columns.count];
            for(let n : number = 0; n < this.columns.count;n++)
            {
                widths[n] = 0;
            }
            let cellWidth : number = 0;
            let cellWidths : number = 0;
            if((typeof this.isChildGrid === 'undefined' && typeof this.gridLocation !== 'undefined' ) || (this.isChildGrid === null && typeof this.gridLocation !== 'undefined')){
                this.initialWidth = this.gridLocation.width;
            }
            if (this.headers.count > 0) {
                let colCount : number = this.headers.getHeader(0).cells.count;
                let rowCount : number = this.headers.count;
                for (let i : number = 0; i < colCount; i++) {
                    cellWidth = 0;
                    for (let j : number = 0; j < rowCount; j++) {
                        let rowWidth : number = Math.min(this.initialWidth, this.headers.getHeader(j).cells.getCell(i).width);
                        cellWidth = Math.max(cellWidth, rowWidth);
                    }
                    widths[i] = cellWidth;
                }
            } 
            // else {
            //     let colCount : number = this.rows.getRow(0).cells.count;
            //     let rowCount : number = this.rows.count;
            //     for (let i : number = 0; i < colCount; i++) {
            //         cellWidth = 0;
            //         for (let j : number = 0; j < rowCount; j++) {
            //             let rowWidth : number = Math.min(this.initialWidth, this.rows.getRow(j).cells.getCell(i).width);
            //             cellWidth = Math.max(cellWidth, rowWidth);
            //         }
            //         widths[i] = cellWidth;
            //     }
            // }
            cellWidth = 0;
            for (let i : number = 0, colCount : number = this.columns.count; i < colCount; i++) {
                for (let j : number = 0, rowCount : number = this.rows.count; j < rowCount; j++) {
                    if ((this.rows.getRow(j).cells.getCell(i).columnSpan == 1 &&  !this.rows.getRow(j).cells.getCell(i).isCellMergeContinue) || (this.rows.getRow(j).cells.getCell(i).value as PdfGrid) != null ) {
                        if ((this.rows.getRow(j).cells.getCell(i).value as PdfGrid) != null && !this.rows.getRow(j).grid.style.allowHorizontalOverflow) {
                            let value : number = this.rows.getRow(j).grid.style.cellPadding.right +
                                                    this.rows.getRow(j).grid.style.cellPadding.left
                                                    + this.rows.getRow(j).cells.getCell(i).style.borders.left.width / 2 ;
                            //  if (this.initialWidth != 0 )
                            //         (this.rows.getRow(j).cells.getCell(i).value as PdfGrid).initialWidth = this.initialWidth - value;
                        }
                        let rowWidth : number = 0;
                        rowWidth = this.initialWidth > 0.0 ? Math.min(this.initialWidth, this.rows.getRow(j).cells.getCell(i).width) : this.rows.getRow(j).cells.getCell(i).width;
                                        // let internalWidth : number = this.rows.getRow(j).cells.getCell(i).width;
                        // internalWidth += this.rows.getRow(j).cells.getCell(i).style.borders.left.width;
                        // internalWidth += this.rows.getRow(j).cells.getCell(i).style.borders.right.width;
                        // let internalHeight : number = this.rows.getRow(j).cells.getCell(i).height;
                        // internalHeight += (this.rows.getRow(j).cells.getCell(i).style.borders.top.width);
                        // internalHeight += (this.rows.getRow(j).cells.getCell(i).style.borders.bottom.width);
                        // let isCorrectWidth : boolean = (internalWidth + this.gridLocation.x) > this.currentGraphics.clientSize.width;
                        // let isCorrectHeight : boolean = (internalHeight + this.gridLocation.y) > this.currentGraphics.clientSize.height;
                        // if (isCorrectWidth || isCorrectHeight) {
                        //     throw Error('Image size exceeds client size of the page. Can not insert this image');
                        // }
                        // rowWidth = Math.min(this.initialWidth, this.rows.getRow(j).cells.getCell(i).width);
                        cellWidth = Math.max(widths[i], Math.max(cellWidth, rowWidth));
                        cellWidth = Math.max(this.columns.getColumn(i).width, cellWidth);                     
                    }
                }
                if(this.rows.count != 0)
                    widths[i] = cellWidth;
                cellWidth = 0;
            }
            for (let i : number = 0, RowCount = this.rows.count; i < RowCount; i++)
            {
                for (let j : number = 0, ColCount = this.columns.count; j < ColCount; j++)
                {
                    if (this.rows.getRow(i).cells.getCell(j).columnSpan > 1)
                    {
                        let total : number = widths[j];
                        for (let k : number = 1; k < this.rows.getRow(i).cells.getCell(j).columnSpan; k++)
                        {
                            total += widths[j + k];
                        }
                        // if (this.rows.getRow(i).cells.getCell(j).width > total)
                        // {
                        //     let extendedWidth : number = this.rows.getRow(i).cells.getCell(j).width - total;
                        //     extendedWidth = extendedWidth / this.rows.getRow(i).cells.getCell(j).columnSpan;

                        //     for (let k : number = j; k < j + this.rows.getRow(i).cells.getCell(j).columnSpan; k++)
                        //         widths[k] += extendedWidth;
                        // }
                    }
                }
            }
            // if (this.isChildGrid && this.initialWidth != 0)
            // {
            //     widths = this.columns.getDefaultWidths(this.initialWidth);
            // }
            for (let i : number = 0, count : number = this.columns.count; i < count; i++) {                
                if (this.columns.getColumn(i).width <= 0)
                    this.columns.getColumn(i).columnWidth = widths[i];
                else if (this.columns.getColumn(i).width > 0 && !this.columns.getColumn(i).isCustomWidth)
                    this.columns.getColumn(i).columnWidth = widths[i];
            }
            let padding : number = 0;
            let colWidth : number = 0;
            let colCount : number = this.columns.count;
            let childGridColWidth : number = 0;
            colWidth = this.tempWidth;
               for (let j : number = 0; j < this.columns.count; j++)
                {
                    if (this.gridColumns.getColumn(j).width > 0 && this.gridColumns.getColumn(j).isCustomWidth)
                    {
                        colWidth -= this.gridColumns.getColumn(j).width;
                        colCount--;
                    }
                }
                // if (this.style.cellSpacing != 0){
                //     colWidth -= this.style.cellSpacing * 2;
                // }
                if (colWidth > 0) {
                    if (this.ParentCell.row.grid.style.cellSpacing != 0){
                        colWidth -= this.ParentCell.row.grid.style.cellSpacing * 2;
                    }
                }
                if (colWidth > padding)
                {
                    childGridColWidth = (colWidth) / colCount;
                if (this.ParentCell != null)
                {
                    for (let j : number = 0; j < this.columns.count; j++)
                    {
                        if (!this.columns.getColumn(j).isCustomWidth)
                            this.columns.getColumn(j).columnWidth = childGridColWidth;
                    }
                }
            }
        }
    }
    
 }