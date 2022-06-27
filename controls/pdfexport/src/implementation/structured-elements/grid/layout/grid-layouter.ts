/**
 * PdfGridLayouter.ts class for EJ2-PDF
 */
import { PdfFont } from './../../../graphics/fonts/pdf-font';
import { PdfGrid } from '../pdf-grid';
import { PdfStringFormat } from './../../../graphics/fonts/pdf-string-format';
import { SizeF, RectangleF, PointF } from './../../../drawing/pdf-drawing';
import { PdfBorders } from '../styles/pdf-borders';
import { PdfLayoutType, PdfLayoutBreakType } from './../../../graphics/figures/enum';
import { PdfLayoutResult, PdfLayoutParams, PdfLayoutFormat, ElementLayouter } from './../../../graphics/figures/base/element-layouter';
import { PdfLayoutElement } from './../../../graphics/figures/layout-element';
import { PdfGraphics } from './../../../graphics/pdf-graphics';
import { PdfPage } from './../../../pages/pdf-page';
import { PdfPageBase } from './../../../pages/pdf-page-base';
import { PdfGridColumnCollection } from '../pdf-grid-column';
import { PdfGridCell } from '../pdf-grid-cell';
import { PdfGridRow } from '../pdf-grid-row';
import { PdfGridStyle, PdfGridCellStyle } from '../styles/style';
import { PdfGridRowCollection, PdfGridHeaderCollection } from '../pdf-grid-row';
import { PdfHorizontalOverflowType } from '../styles/style';
import { TemporaryDictionary } from './../../../collections/object-object-pair/dictionary';
import { PdfStringLayoutResult, PdfStringLayouter } from './../../../graphics/fonts/string-layouter';
import { PdfDocument } from './../../../document/pdf-document';
import { PdfSection } from './../../../pages/pdf-section';
/**
 * Class `lay outing the text`.
 * 
 */
export class PdfGridLayouter extends ElementLayouter {
    // Fields
    /**
     * `Text` data.
     * @private
     */
    private text : string;
   // private layoutElement : PdfLayoutElement;
    /**
     * Pdf `font`.
     * @private
     */
    private font : PdfFont;
    /**
     * String `format`.
     * @private
     */
    private format : PdfStringFormat;
    /**
     * `Size` of the text.
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
    private gridInitialWidth : number = 0;
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
    private parentCell : PdfGridCell;
    private parentCellIndex : number = 0;
    public  tempWidth : number = 0;
    private childheight : number = 0;
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
    public beginPageLayout : Function;
    /**
     * The event raised on `end cell lay outing`.
     * @event
     * @private
     */
    public endPageLayout : Function;

    /**
     * @hidden
     * @private
     */
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
    private pageWidth : boolean;
    /**
     * Check weather it is `child grid or not`.
     * @private
     */
    private isChildGrid : boolean = false;
    /**
     * @hidden
     * @private
     */
    public rowLayoutBoundsWidth : number;
    /**
     * @hidden
     * @private
     */
    public hasRowSpanSpan : boolean = false;
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
    private listOfNavigatePages : number[] = [];
    /**
     * @hidden
     * @private
     */
    private startLocation : PointF;
    /**
     * @hidden
     * @private
     */
    private hType : PdfHorizontalOverflowType;
    /**
     * @hidden
     * @private
     */
    private flag : boolean = true;
    /**
     * @hidden
     * @private
     */
    private columnRanges : number[][] = [];
    /**
     * @hidden
     * @private
     */
    private cellStartIndex : number;
    /**
     * @hidden
     * @private
     */
    private cellEndIndex : number;
    /**
     * @hidden
     * @private
     */
    private currentRowIndex : number;
    /**
     * @hidden
     * @private
     */
    public static repeatRowIndex : number = -1;
    /**
     * @hidden
     * @private
     */
    private isChanged : boolean;
    /**
     * @hidden
     * @private
     */
    private currentLocation : PointF = new PointF(0, 0);
    /**
     * @hidden
     * @private
     */
    private breakRow : boolean = true;
    /**
     * @hidden
     * @private
     */
    private rowBreakPageHeightCellIndex : number;
    private slr: PdfStringLayoutResult = null;
    private remainderText: string = null;
    private isPaginate: boolean = false;
    //constructor
    /**
     * Initialize a new instance for `PdfGrid` class.
     * @private
     */
    public constructor(baseFormat : PdfGrid) {
        super(baseFormat);
    }
    //Properties
    public get Grid() : PdfGrid {
       return (this.elements as PdfGrid);
    }
    /**
     * `Bounds` of the text.
     * @private
     */
    private rectangle : RectangleF;
    /**
     * Pdf page `height`.
     * @private
     */
    private gridHeight : number;
    /**
     * Specifies if [`isTabReplaced`].
     * @private
     */
    private isTabReplaced : boolean;
    /**
     * `currentGraphics` of the text.
     * @private
     */
    private  currentGraphics : PdfGraphics;
    /**
     * Count of tab `occurance`.
     * @private
     */
    private tabOccuranceCount : number;
    /**
     * Checks whether the x co-ordinate is need to set as client size or not.
     * @hidden
     * @private
     */
    private isOverloadWithPosition : boolean = false;
    /**
     * Stores client size of the page if the layout method invoked with `PointF` overload.
     * @hidden
     * @private
     */
    private clientSize : SizeF;
    private gridLayoutFormat : PdfGridLayoutFormat;
    private isHeader: boolean;
    // Constructors
    /**
     * Initializes a new instance of the `StringLayouter` class.
     * @private
     */
    //Public methods
    /**
     * `Layouts` the text.
     * @private
     */
    /**
     * `Layouts` the specified graphics.
     * @private
     */
    /**
     * `Layouts` the specified graphics.
     * @private
     */
    /*public layout(graphics : PdfLayoutParams) : PdfLayoutResult
    public layout(graphics : PdfGraphics, bounds : RectangleF) : void
    public layout(graphics : PdfGraphics, bounds : PointF) : void
    public layout(graphics ?: PdfGraphics | PdfLayoutParams, bounds ?: PointF | RectangleF) : void | PdfLayoutResult  {
        if (graphics instanceof PdfGraphics) {
        if (bounds instanceof PointF) {
            if (bounds.x === 0) {
                bounds.x = PdfBorders.default.right.width / 2;
            }
            if (bounds.y === 0) {
                bounds.y = PdfBorders.default.top.width / 2;
            }
            let boundaries : RectangleF = new RectangleF(bounds, new SizeF(0, 0));
            this.layout(graphics, boundaries);
        } else {
            let width : number = graphics.clientSize.width;
            let parameter : PdfLayoutParams = new PdfLayoutParams();
            parameter.bounds = bounds;
            this.currentGraphics = graphics;
            if (graphics.layer != null) {
                let index : number = 0;
                if (this.currentGraphics.page instanceof PdfPage) {
                    index = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);
                } else {
                    index = (this.currentGraphics.page as PdfPageBase).defaultLayerIndex;
                }
            } else {
                this.layoutInternal(parameter);
            }
        }
    }
    }*/
    /**
     * Gets the `format`.
     * @private
     */
    private getFormat(format : PdfLayoutFormat) : PdfGridLayoutFormat {
        let f : PdfGridLayoutFormat = format as PdfGridLayoutFormat;
        return f;
    }
    /**
     * `Layouts` the element.
     * @private
     */
    protected layoutInternal(param : PdfLayoutParams) : PdfLayoutResult {
        let format : PdfGridLayoutFormat = this.getFormat(param.format);
        this.gridLayoutFormat = this.getFormat(param.format);
        this.currentPage = param.page;
        if (this.currentPage !== null) {
            let pageHeight : number = this.currentPage.getClientSize().height;
            let pageWidth : number = this.currentPage.getClientSize().width;
            this.currentPageBounds = this.currentPage.getClientSize();
        } else {
                throw Error('Can not set page as null');
            //this.currentPageBounds = this.currentGraphics.clientSize;
        }
        this.currentGraphics = this.currentPage.graphics;
        //this.currentGraphics = (this.currentPage != null ) ? this.currentPage.graphics : this.currentGraphics;
        // if (this.currentGraphics.layer !== null) {
        //     let index : number = 0;
        //     if (this.currentGraphics.page instanceof PdfPage) {
        //         index = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);
        //     } else {
        //         index = (this.currentGraphics.page as PdfPageBase).defaultLayerIndex;
        //     }
        //     this.listOfNavigatePages.push(index);
        // }
        let index : number = 0;
        index = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);
        this.listOfNavigatePages.push(index);
        if (format != null && format.break === PdfLayoutBreakType.FitColumnsToPage) {
            this.currentBounds = new RectangleF(new PointF(param.bounds.x, param.bounds.y),
                                                new SizeF(this.Grid.columns.width, this.currentGraphics.clientSize.height));
        } else {
            this.currentBounds = new RectangleF(new PointF(param.bounds.x, param.bounds.y), this.currentGraphics.clientSize);
        }
        //this.currentBounds = new RectangleF(new PointF(param.bounds.x, param.bounds.y), this.currentGraphics.clientSize);
        if (this.Grid.rows.count !== 0 ) {
            this.currentBounds.width = (param.bounds.width > 0) ? param.bounds.width :
                                       (this.currentBounds.width - this.Grid.rows.getRow(0).cells.getCell(0).style.borders.left.width / 2);
        } else if (this.Grid.headers.count !== 0) {
            // this.currentBounds.width = (param.bounds.width > 0) ? param.bounds.width : (this.currentBounds.width -
            //                                 this.Grid.headers.getHeader(0).cells.getCell(0).style.borders.left.width / 2);
            this.currentBounds.width = param.bounds.width;
        } else {
            throw Error('Please add row or header into grid');
        }
        this.startLocation = new PointF(param.bounds.x, param.bounds.y);
        // if (this.Grid.style.allowHorizontalOverflow && this.currentBounds.width > this.currentGraphics.clientSize.width) {
        //     this.currentBounds.width = this.currentGraphics.clientSize.width;
        //     this.currentBounds.width -= this.currentBounds.x;
        // }
        // if (this.Grid.isChildGrid) {
        //     this.childheight = param.bounds.height;
        // }
        // if (param.format !== null && param.format.usePaginateBounds) {
        //     if (param.format.paginateBounds.height > 0) {
        //         this.currentBounds.height = param.format.paginateBounds.height;
        //     }
        //} else 
        if (param.bounds.height > 0 && !this.Grid.isChildGrid) {
            this.currentBounds.height = param.bounds.height;
        }
        if (!this.Grid.isChildGrid) {
            this.hType = this.Grid.style.horizontalOverflowType;
        }
        if (!this.Grid.style.allowHorizontalOverflow) {
            this.columnRanges = [];
            if (typeof this.Grid.isChildGrid !== 'undefined' && typeof this.Grid.isChildGrid) {
                this.Grid.measureColumnsWidth(this.currentBounds);
            } else {
                this.Grid.measureColumnsWidth(new RectangleF(this.currentBounds.x, this.currentBounds.y, this.currentBounds.x + this.currentBounds.width, this.currentBounds.height));
            }
            this.columnRanges.push([0, this.Grid.columns.count - 1]);
        } else {
            this.Grid.measureColumnsWidth();
            this.determineColumnDrawRanges();
        }
        if (this.Grid.hasRowSpanSpan) {
            for ( let i: number = 0; i < this.Grid.rows.count; i++) {
                if (this.Grid.rows.getRow(i).height !== -1 && !this.Grid.rows.getRow(i).isRowHeightSet) {
                    this.Grid.rows.getRow(i).isRowHeightSet = true;
                }
            }
        }
        let result : PdfGridLayoutResult = this.layoutOnPage(param);
        return result;
    }
    // /* tslint:enable */
    /**
     * `Determines the column draw ranges`.
     * @private
     */
    private determineColumnDrawRanges() : void {
        let startColumn : number = 0;
        let endColumn : number = 0;
        let cellWidths : number = 0;
        let availableWidth : number = this.currentGraphics.clientSize.width - this.currentBounds.x;
        for (let i : number = 0; i < this.Grid.columns.count; i++) {
            cellWidths += this.Grid.columns.getColumn(i).width;
            if (cellWidths >= availableWidth) {
                let subWidths : number = 0;
                for (let j : number = startColumn; j <= i; j++) {
                    subWidths += this.Grid.columns.getColumn(j).width;
                    if (subWidths > availableWidth) {
                        break;
                    }
                    endColumn = j;
                }
                this.columnRanges.push([startColumn, endColumn]);
                startColumn = endColumn + 1;
                endColumn = startColumn;
                cellWidths = (endColumn <= i) ? this.Grid.columns.getColumn(i).width : 0;
            }
        }
        // if (startColumn !== this.columns.Count) {
        this.columnRanges.push([startColumn, this.Grid.columns.count - 1 ]);
         // }
     }
    /**
     * `Layouts the on page`.
     * @private
     */
    private layoutOnPage(param : PdfLayoutParams) : PdfGridLayoutResult  {
        /* tslint:disable */
        this.pageBounds.x = param.bounds.x;
        this.pageBounds.y = param.bounds.y;
        this.pageBounds.height = param.bounds.height;        
        let format : PdfGridLayoutFormat = this.getFormat(param.format);
        let endArgs : PdfGridEndPageLayoutEventArgs = null;
        let result : PdfGridLayoutResult = null;
        let layoutedPages : TemporaryDictionary<PdfPage, number[]> = new TemporaryDictionary<PdfPage, number[]>();
        let startPage : PdfPage = param.page;
        let isParentCell : boolean = false;
        let cellBounds : number[] = [];
        for (let index : number = 0; index < this.columnRanges.length; index++) {
            let range : number[] = this.columnRanges[index];
            this.cellStartIndex = range[0];
            this.cellEndIndex = range[1];
            let returnObject : {returnValue : boolean, currentBounds : RectangleF, currentRowIndex : number }
                               = this.raiseBeforePageLayout(this.currentPage, this.currentBounds, this.currentRowIndex);
            this.currentBounds = returnObject.currentBounds;
            this.currentRowIndex = returnObject.currentRowIndex;
            // if (returnObject.returnValue) {
            //     result = new PdfGridLayoutResult(this.currentPage, this.currentBounds);
            //     break;
            // }
            //Draw Headers.
            let drawHeader : boolean;
            for (let i : number = 0; i < this.Grid.headers.count; i++) {
                let row : PdfGridRow = this.Grid.headers.getHeader(i);
                let headerHeight : number = this.currentBounds.y;
                this.isHeader = true;
                if (startPage != this.currentPage) {
                    for (let k: number = this.cellStartIndex; k <= this.cellEndIndex; k++) {
                        if (row.cells.getCell(k).isCellMergeContinue) {
                            row.cells.getCell(k).isCellMergeContinue = false;
                            row.cells.getCell(k).value = "";
                        }
                    }
                }
                // RowLayoutResult
                let headerResult: RowLayoutResult = this.drawRow(row);
                if (headerHeight === this.currentBounds.y) {
                    drawHeader = true;
                    if (PdfGridLayouter.repeatRowIndex === -1) {
                        PdfGridLayouter.repeatRowIndex = i;
                    }
                } else {
                    drawHeader = false;
                }
                if (!headerResult.isFinish && startPage !== null
                    && format.layout !== PdfLayoutType.OnePage && drawHeader) {
                    this.startLocation.x = this.currentBounds.x;
                    this.currentPage = this.getNextPageformat(format);
                    this.startLocation.y = this.currentBounds.y;
                    if (typeof format.paginateBounds !== 'undefined' && format.paginateBounds.x === 0 && format.paginateBounds.y === 0 && format.paginateBounds.width === 0 && format.paginateBounds.height === 0)
                        this.currentBounds.x += this.startLocation.x;

                    this.drawRow(row);
                }
                this.isHeader = false;
            }
            let i : number = 0;
            let length : number = this.Grid.rows.count;
            let repeatRow : boolean;
            let startingHeight : number = 0;
            let flag : boolean = true;
            //Here is to draw parent Grid and Cells
            cellBounds = [];
            //Draw row by row with the specified cell range.
            for (let j : number = 0; j < this.Grid.rows.count; j++) {
                let row : PdfGridRow = this.Grid.rows.getRow(j);
                i++;
                this.currentRowIndex = i - 1;
                let originalHeight : number = this.currentBounds.y;
                startPage = this.currentPage;
                PdfGridLayouter.repeatRowIndex = -1;
                if(flag && row.grid.isChildGrid)
                {
                    startingHeight = originalHeight;
                    flag = false;
                }
                let rowResult : RowLayoutResult = null;
                ///rowResult = this.drawRow(row);
                /*if(!row.isrowFinish) {
                    if(!row.grid.isgridSplit){
                        rowResult = this.drawRow(row);
                        row.isrowFinish = true;
                        row.isrowDraw = true;
                    } else {
                        if(!row.isrowDraw){
                            rowResult = this.drawRow(row);
                            row.isrowFinish = true;
                            row.isrowDraw = true;
                            row.grid.isgridSplit = false;
                        } else {
                            rowResult =  null;
                            break;
                        }
                    }                                                              
                } 
                else {
                    //row.isrowFinish = false;
                    //rowResult = this.drawRow(row);
                    rowResult = null;
                    break;
                    
                }             */  
                if(this.Grid.splitChildRowIndex == -1){               
                    rowResult = this.drawRow(row);
                    row.isrowFinish = true;
                }
                else {
                    if(row.grid.ParentCell.row.grid.isGridSplit && this.Grid.splitChildRowIndex <= row.rowIndex){                       
                        rowResult = this.drawRow(row);
                        row.isrowFinish = true;
                    } else if(row.isrowFinish) {
                        continue;
                    }else{
                        break;
                    }
                    
                }
                //rowResult = this.drawRow(row);
                cellBounds.push(rowResult.bounds.width);
                /*if (row.isRowBreaksNextPage)
                    {
                        let x : number  = 0;
                        for (let l : number = 0; l < row.cells.count; l++)
                        {
                            let isNestedRowBreak : boolean = false;
                            if (row.height == row.cells.getCell(l).height)
                            {
                                let n : number;
                                let grid : PdfGrid = row.cells.getCell(l).value as PdfGrid;
                                for (let m : number = grid.rows.count; 0 < m; m--)
                                {
                                    if ((grid.rows.getRow(m - 1).rowBreakHeight > 0))
                                    {
                                        isNestedRowBreak = true;
                                        break;
                                    }
                                    if (grid.rows.getRow(m - 1).isRowBreaksNextPage)
                                    {
                                        row.rowBreakHeightValue = grid.rows.getRow(m - 1).rowBreakHeightValue;
                                        break;
                                    }
                                    row.rowBreakHeightValue += grid.rows.getRow(m - 1).height;
                                }
                            }
                            if (isNestedRowBreak)
                                break;
                        }
                        for (let j : number = 0; j < row.cells.count; j++)
                        {

                            if (row.height > row.cells.getCell(j).height)
                            {
                                row.cells.getCell(j).value = " ";
                                let rect : RectangleF ;
                                let page : PdfPage = this.getNextPage(this.currentPage);
                                let section : PdfSection = this.currentPage.section;
                                let index : number = section.indexOf(page);
                                for (let k : number = 0; k < (section.count - 1) - index; k++)
                                {
                                    rect = new RectangleF(x, 0, row.grid.columns.getColumn(j).width, page.getClientSize().height);
                                    PdfGridLayouter.repeatRowIndex = -1;
                                    row.cells.getCell(j).draw(page.graphics, rect, false);
                                    page = this.getNextPage(page);
                                }
                                rect = new RectangleF(x, 0, row.grid.columns.getColumn(j).width, row.rowBreakHeightValue);

                                row.cells.getCell(j).draw(page.graphics, rect, false);
                            }
                            x += row.grid.columns.getColumn(j).width;
                        }
                    }*/
                //if height remains same, it is understood that row is not drawn in the page
                if (originalHeight === this.currentBounds.y) {
                    repeatRow = true;
                    PdfGridLayouter.repeatRowIndex = this.Grid.rows.rowCollection.indexOf(row);
                } else {
                    repeatRow = false;
                    PdfGridLayouter.repeatRowIndex = -1;
                }
                while (!rowResult.isFinish && startPage != null)
                {
                    let tempResult : PdfGridLayoutResult = this.getLayoutResult();
                    /*if (startPage != this.currentPage)
                        {
                            if (row.grid.isChildGrid && row.grid.ParentCell != null)
                            {
                                let bounds : RectangleF= new RectangleF(new PointF(format.paginateBounds.x,format.paginateBounds.y), new SizeF(param.bounds.width, tempResult.bounds.height));
                                bounds.x += param.bounds.x;
                                if (row.grid.ParentCell.row.grid.style.cellPadding != null)
                                {
                                    bounds.y += row.grid.ParentCell.row.grid.style.cellPadding.top;
                                    if (bounds.height > this.currentPageBounds.height)
                                    {
                                        bounds.height = this.currentPageBounds.height - bounds.y;
                                        bounds.height -= (row.grid.ParentCell.row.grid.style.cellPadding.bottom);
                                    }
                                }
                                // Draw border for cells in the nested grid cell's row.
                                for (let c : number = 0; c < row.cells.count; c++)
                                {
                                    let cell : PdfGridCell = row.cells.getCell(c);
                                    let cellWidth :  number= 0;
                                    if (cell.columnSpan > 1)
                                    {
                                        for (; c < cell.columnSpan; c++)
                                            cellWidth += row.grid.columns.getColumn(c).width;
                                    }
                                    else
                                        cellWidth = Math.max(cell.width, row.grid.columns.getColumn(c).width);
                                    cell.drawCellBorders(this.currentGraphics, new RectangleF(new PointF(bounds.x,bounds.y), new SizeF(cellWidth, bounds.height)));
                                    bounds.x += cellWidth;
                                    c += (cell.columnSpan - 1);
                                }
                            }
                        }
                        */
                        endArgs = this.raisePageLayouted(tempResult);
                        if (endArgs.cancel || repeatRow)
                            break;
                        else if (this.Grid.allowRowBreakAcrossPages )
                        {
                            //If there is no space in the current page, add new page and then draw the remaining row.
                            this.currentPage = this.getNextPageformat(format);
                            originalHeight = this.currentBounds.y;
                            let location : PointF = new PointF(PdfBorders.default.right.width / 2, PdfBorders.default.top.width / 2);
                            if ((format.paginateBounds.x === 0  && format.paginateBounds.y === 0 && format.paginateBounds.width === 0 && 
                                    format.paginateBounds.height === 0 ) && (this.startLocation.x === location.x && this.startLocation.y === location.y)) {
                                this.currentBounds.x += this.startLocation.x;
                                this.currentBounds.y += this.startLocation.y;
                            }
                            if (this.isPaginate) {
                                this.startLocation.y = this.currentBounds.y;
                                this.isPaginate = false;
                            }
                            if (this.Grid.isChildGrid && row.grid.ParentCell != null)
                            {
                                if (this.Grid.ParentCell.row.grid.style.cellPadding != null)
                                {
                                    if (row.rowBreakHeight + this.Grid.ParentCell.row.grid.style.cellPadding.top < this.currentBounds.height)
                                    {
                                        this.currentBounds.y = this.Grid.ParentCell.row.grid.style.cellPadding.top;
                                    }
                                }
                            }

                            if (row.grid.ParentCell != null)
                            {
                                row.grid.ParentCell.row.isRowBreaksNextPage = true;
                                row.grid.ParentCell.row.rowBreakHeightValue = row.rowBreakHeight + this.Grid.ParentCell.row.grid.style.cellPadding.top + this.Grid.ParentCell.row.grid.style.cellPadding.bottom;
                                
                                for ( let i : number = row.rowIndex + 1; i<row.grid.rows.count;i++){
                                    row.grid.ParentCell.row.rowBreakHeightValue  += row.grid.rows.getRow(i).height;
                                }
                                //row.rowBreakHeight = row.grid.ParentCell.row.rowBreakHeightValue;
                            }
                            
                            /*if (row.noOfPageCount > 1)
                            {
                                let temp : number = row.rowBreakHeightValue;
                                for (let j : number = 1; j < row.noOfPageCount; j++)
                                {
                                    row.rowBreakHeightValue = 0;
                                    row.height = ((row.noOfPageCount - 1) * this.currentPage.getClientSize().height);
                                    this.drawRow(row);
                                    this.currentPage = this.getNextPageformat(format);
                                    startPage = this.currentPage;
                                }
                                row.rowBreakHeightValue = temp;
                                row.noOfPageCount = 1;
                                rowResult = this.drawRow(row);
                            } else {
                                rowResult = this.drawRow(row);
                            }
                            /*if(row.grid.isChildGrid){
                                row.isrowFinish = false;
                                row.isrowDraw = false;
                                row.grid.isgridSplit = true;
                                row.grid.ParentCell.row.grid.isgridSplit = true;
                                //rowResult.isFinish = false;
                                break;
                            }*/
                            
                            if(row.grid.isChildGrid){
                                //row.grid.isgridSplit = true;
                                row.isrowFinish = false;
                                //row.grid.ParentCell.row.grid.isgridSplit = true;
                                row.grid.splitChildRowIndex = row.rowIndex;
                                row.grid.ParentCell.row.grid.splitChildRowIndex = row.grid.ParentCell.row.rowIndex;
                                if(row.grid.ParentCell.row.grid.isGridSplit)
                                {
                                    row.grid.ParentCell.row.noOfPageCount+= 1;
                                    row.grid.ParentCell.row.grid.isGridSplit = false;
                                }
                                break;
                            }  
                            if (row.noOfPageCount <1)
                            {                                
                                if(row.grid.splitChildRowIndex != -1){
                                    row.grid.isGridSplit = true;
                                }
                                if (row.style.border != null && ((row.style.border.left != null && row.style.border.left.width !== 1)
                                            || (row.style.border.top != null && row.style.border.top.width !== 1))) {
                                    let x : number = row.style.border.left.width / 2;
                                    let y : number = row.style.border.top.width / 2;
                                    if (this.currentBounds.x === PdfBorders.default.right.width / 2 && this.currentBounds.y === PdfBorders.default.right.width / 2) {
                                        let newBound : RectangleF = new RectangleF(x, y, this.currentBounds.width, this.currentBounds.height);
                                        this.currentBounds = newBound;
                                    }
                                }
                                if (this.Grid.repeatHeader) {
                                    for (let j : number = 0; j < this.Grid.headers.count; j++) {
                                        let headerRepeat : PdfGridRow = this.Grid.headers.getHeader(j);
                                        this.drawRow(headerRepeat);
                                    }
                                }
                                rowResult = this.drawRow(row);
                                if(row.noOfPageCount >= 1){
                                    let temp : number = row.rowBreakHeightValue;
                                    for (let j : number = 0; j < row.noOfPageCount; j++)
                                    {
                                        //this.currentPage.section.add();
                                        let tempResult1 : PdfGridLayoutResult = this.getLayoutResult();
                                        endArgs = this.raisePageLayouted(tempResult1);
                                        
                                        this.currentPage = this.getNextPageformat(format);
                                        originalHeight = this.currentBounds.y;
                                        //row.rowBreakHeightValue = 0;
                                        if(row.grid.splitChildRowIndex != -1){
                                            row.grid.isGridSplit = true;
                                        }
                                        this.currentBounds.y = 0.5;
                                        if (this.Grid.repeatHeader) {
                                            for (let i : number = 0; i < this.Grid.headers.count; i++) {
                                                let header : PdfGridRow = this.Grid.headers.getHeader(i);
                                                this.drawRow(header);
                                            }
                                        }
                                        //row.height = ((row.noOfPageCount - 1) * this.currentPage.getClientSize().height);
                                        this.drawRow(row);
                                        
                                    }
                                    // row.rowBreakHeight = temp;
                                    // row.noOfPageCount = 1;
                                    // rowResult = this.drawRow(row);
                                }
                                row.grid.splitChildRowIndex = -1;
                                row.grid.isGridSplit = false;
                                rowResult.isFinish = this.checkIsFisished(row);
                                //row.NestedGridLayoutResult.bounds.height = row.rowBreakHeightValue;
                                //this.currentBounds.y = rowResult.bounds.y;
                                for(let i : number = 0; i<row.cells.count;i++){
                                    if(row.cells.getCell(i).value instanceof PdfGrid){
                                        (row.cells.getCell(i).value as PdfGrid).splitChildRowIndex = -1;                                    }
                                }                                
                            }

                        }
                        // else if (!this.Grid.allowRowBreakAcrossPages && i < length)
                        // {
                        //     this.currentPage = this.getNextPageformat(format);
                        //     break;
                        // }
                        // else if (i >= length)
                        //     break;
                }
                if (!rowResult.isFinish && startPage !== null && format.layout !== PdfLayoutType.OnePage && repeatRow) {
                    // During pagination, cell position is maintained here.
                    this.startLocation.x = this.currentBounds.x;
                    let isAddNextPage : boolean = false;
                    this.currentPage = this.getNextPageformat(format);
                   /*if (!this.Grid.isSingleGrid)
                   {
                       for ( let j : number= 0; j < this.Grid.rows.count; j++)
                       {
                           let isWidthGreaterthanParent : boolean = false;
                           for (let k : number = 0; k < this.Grid.rows.getRow(j).cells.count; k++)
                           {
                               if (this.Grid.rows.getRow(j).cells.getCell(k).width > this.currentPageBounds.width)
                                   isWidthGreaterthanParent = true;
                           }
                           if (isWidthGreaterthanParent && this.Grid.rows.getRow(j).cells.getCell(this.rowBreakPageHeightCellIndex).pageCount > 0)
                           {
                               isAddNextPage = true;
                           }
                       }
                   }
                   if (!this.Grid.isRearranged && isAddNextPage)
                        {
                            let section : PdfSection = this.currentPage.section;
                            
                            //this.currentPage = section.add();
                        
                            this.currentGraphics = this.currentPage.graphics;
                            this.currentBounds = new RectangleF(new PointF(0,0), this.currentPage.getClientSize());
                         
                            let pageindex  : number = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);                            
                        }
                        else
                        {
                            this.currentPage = this.getNextPageformat(format);
                        }
                        if (format.paginateBounds.y == 0)
                            this.currentBounds.y = PdfBorders.default.top.width/2;
                        else
                        {
                            this.currentBounds.y = format == null ? 0 : format.paginateBounds.y;
                            
                        }*/
					if (this.raiseBeforePageLayout(this.currentPage, this.currentBounds, this.currentRowIndex).returnValue) {
                        break;
                    }
                    if ((param.format !== null) && !param.format.usePaginateBounds && param.bounds !== null  &&
                         param.bounds.height > 0 && !this.Grid.isChildGrid) {
                        this.currentBounds.height = param.bounds.height;
                    }
                    if (typeof param.format !== 'undefined' && param.format != null && typeof param.format.usePaginateBounds !== 'undefined' && !param.format.usePaginateBounds && !(param.format.paginateBounds.x === 0 && param.format.paginateBounds.y === 0 && param.format.paginateBounds.width === 0 && param.format.paginateBounds.height === 0) && param.format.paginateBounds.y === 0) {
                        this.currentBounds.y = PdfBorders.default.top.width / 2;
                    } else {
                        this.currentBounds.y = format == null ? 0 : format.paginateBounds.y;
						if (format != null && (format.paginateBounds.x !== 0 || format.paginateBounds.y !== 0 || format.paginateBounds.height !== 0 || format.paginateBounds.width !== 0)) {
                            this.currentBounds.x = format.paginateBounds.x;
                            this.currentBounds.width = format.paginateBounds.width;
                            this.currentBounds.height = format.paginateBounds.height;
                        }
                    }
                    if (typeof param.format !== 'undefined' && (param.format !== null) && typeof param.format.usePaginateBounds !== 'undefined' && !param.format.usePaginateBounds && param.bounds !== null &&
                        param.bounds.y > 0 && !this.Grid.isChildGrid) {
                        this.currentBounds.y = param.bounds.y;
                    }
                    this.startLocation.y = this.currentBounds.y;
                    if ((format.paginateBounds.x === format.paginateBounds.y) &&
                        (format.paginateBounds.y === format.paginateBounds.height) &&
                        (format.paginateBounds.height === format.paginateBounds.width) && (format.paginateBounds.width === 0)) {
                        this.currentBounds.x += this.startLocation.x;
                    }
                    if (this.currentBounds.x === PdfBorders.default.left.width / 2 ) {
                        this.currentBounds.y += this.startLocation.x;
                    }
                    if (this.Grid.repeatHeader) {
                        for (let i : number = 0; i < this.Grid.headers.count; i++) {
                            let header : PdfGridRow = this.Grid.headers.getHeader(i);
                            this.drawRow(header);
                        }
                    }
                    this.drawRow(row);
                    if (this.currentPage !== null && !layoutedPages.containsKey(this.currentPage)) {
                        layoutedPages.add(this.currentPage, range);
                    }
                }
                if (row.NestedGridLayoutResult != null)
                    {
                        // Position for next row in the grid.
                        this.currentPage = row.NestedGridLayoutResult.page;
                        this.currentGraphics = this.currentPage.graphics; //If not, next row will not be drawn in the layouted page.
                        this.startLocation = new PointF(row.NestedGridLayoutResult.bounds.x,row.NestedGridLayoutResult.bounds.y);
                        let recalHeight : number = this.ReCalculateHeight(row,row.NestedGridLayoutResult.bounds.height);
                        this.currentBounds.y = recalHeight;
                        //this.currentBounds.y = row.NestedGridLayoutResult.bounds.height;
                        if (startPage != this.currentPage)
                        {
                            let secion : PdfSection= this.currentPage.section;
                            let startIndex : number = secion.indexOf(startPage) + 1;
                            let endIndex : number = secion.indexOf(this.currentPage);

                            for (let page : number = startIndex; page < endIndex + 1; page++)
                            {
                                let pageGraphics : PdfGraphics = this.currentPage.graphics;
                                let location : PointF = new PointF(format.paginateBounds.x,format.paginateBounds.y);

                                let height : number = page == endIndex ? (row.NestedGridLayoutResult.bounds.height-param.bounds.y) :
                                                                (this.currentBounds.height - location.y);
                                if (height <= pageGraphics.clientSize.height)
                                    height += param.bounds.y;
                                // if (row.grid.isChildGrid && row.grid.ParentCell != null)
                                //     location.x += param.bounds.x;
                                location.y = format == null ? 0.5 : format.paginateBounds.y;
                                
                                // Draw border for last paginated row containing nested grid.
                                for (let c : number = 0; c < row.cells.count; c++)
                                {
                                    let cell : PdfGridCell = row.cells.getCell(c);
                                    let cellWidth : number = 0;
                                    let totalwidth : number = 0;
                                    if (cell.value instanceof PdfGrid)
                                    {
                                        for(let i : number =0 ; i < cell.value.columns.count; i++)
                                        {
                                            totalwidth += cell.value.columns.getColumn(i).columnWidth;
                                        }
                                    } else {
                                        totalwidth = cell.width;
                                    }
                                    // if (cell.columnSpan > 1)
                                    // {
                                    //     for (; c < cell.columnSpan; c++)
                                    //         cellWidth += row.grid.columns.getColumn(c).width;
                                    // }
                                    // else
                                        cellWidth = Math.max(totalwidth, row.grid.columns.getColumn(c).width);

                                    cell.drawCellBorders(pageGraphics, new RectangleF(location, new SizeF(cellWidth, height)));
                                    location.x += cellWidth;
                                    c += (cell.columnSpan - 1);
                                }
                            }

                            // So, nested grid drawing is completed for the current row. Update page.
                            // Otherwise, the next nested grid of the parent will draw borders from start.
                            startPage = this.currentPage;
                        }
                    } 
            }                    
            let isPdfGrid : boolean = false;
            let maximumCellBoundsWidth : number = 0;
            if (cellBounds.length > 0) {
                maximumCellBoundsWidth = cellBounds[0];
            }
            let largeNavigatePage : number[][] = [[1, 2]];
            for ( let c:number = 0; c < this.Grid.rows.count; c++)
                {

                    if (this.cellEndIndex != -1 && this.Grid.rows.getRow(c).cells.getCell(this.cellEndIndex).value instanceof PdfGrid)
                    {
                       let grid: PdfGrid = this.Grid.rows.getRow(c).cells.getCell(this.cellEndIndex).value as PdfGrid;
                        this.rowLayoutBoundsWidth= grid.rowLayoutBoundsWidth;
                        isPdfGrid = true;
                        // if (largeNavigatePage[0][0] < grid.listOfNavigatePages.length)
                        // {
                        //     largeNavigatePage[0][0] = grid.listOfNavigatePages.length;
                        //     largeNavigatePage[0][1] = cellBounds[c];
                        // }
                        // else if ((largeNavigatePage[0][0] == grid.listOfNavigatePages.length) && (largeNavigatePage[0][1] < cellBounds[c]))
                        // {
                        //     largeNavigatePage[0][1] = cellBounds[c];
                        // }

                    }
                }    
            if (!isPdfGrid && cellBounds.length > 0) {
                for (let c : number = 0; c < i - 1; c++) {
                    if (maximumCellBoundsWidth < cellBounds[c]) {
                        maximumCellBoundsWidth = cellBounds[c];
                    }
                }
                this.rowLayoutBoundsWidth = maximumCellBoundsWidth;
            } else {
                this.rowLayoutBoundsWidth = largeNavigatePage[0][1];
            }   
            if (this.columnRanges.indexOf(range) < this.columnRanges.length - 1
            && startPage != null && format.layout != PdfLayoutType.OnePage) {
                isParentCell = this.Grid.isChildGrid;                   

                if ((largeNavigatePage[0] [0] as Number )!= 0)
                {
                    let section : PdfSection = this.currentPage.section;
                    let pageIndex : number = section.indexOf(this.currentPage);                        

                    this.currentGraphics = this.currentPage.graphics;
                    this.currentBounds = new RectangleF(new PointF(0,0), this.currentPage.getClientSize());
                    let pageindex : Number = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);                        
                }
                else
                {
                    this.currentPage = this.getNextPageformat(format);
                }

                // let locationGrid : PointF= new PointF(PdfBorders.default.right.width / 2, PdfBorders.default.top.width / 2);
                // if (format.paginateBounds == new RectangleF(0,0,0,0) && this.startLocation == locationGrid)
                // {
                //     this.currentBounds.x += this.startLocation.x;
                //     this.currentBounds.y += this.startLocation.y;
                // }
            }                     
            if (this.columnRanges.length-1 !== index && this.columnRanges.length > 1 && format.layout !== PdfLayoutType.OnePage) { 
                    this.currentPage = this.getNextPageformat(format);
                if ((format.paginateBounds.x === format.paginateBounds.y) && (format.paginateBounds.y === format.paginateBounds.height)
                     && (format.paginateBounds.height === format.paginateBounds.width) && (format.paginateBounds.width === 0)) {
                    this.currentBounds.x += this.startLocation.x;
                    this.currentBounds.y += this.startLocation.y;
                    //this.currentBounds.height = this.pageBounds.height;
                }
            }
                
        }
        result = this.getLayoutResult();
        if (this.Grid.style.allowHorizontalOverflow && this.Grid.style.horizontalOverflowType == PdfHorizontalOverflowType.NextPage) {
            this.reArrangePages(layoutedPages);
        }
        this.raisePageLayouted(result);
        return result;
    }
    private checkIsFisished(row: PdfGridRow): boolean {
        let result: boolean = true;
        for (let i: number = 0; i < row.cells.count; i++) {
            if (!row.cells.getCell(i).FinishedDrawingCell) {
                result = false;
            }
        }
        return result;
    }
    /* tslint:enable */
    /**
     * Gets the `next page`.
     * @private
     */
    public getNextPageformat(format : PdfLayoutFormat) : PdfPage {
        let section : PdfSection = this.currentPage.section;
        let nextPage : PdfPage = null;
        let index : number = section.indexOf(this.currentPage);
        this.flag = false;
        if (index === section.count - 1) {
            nextPage = (section.add() as PdfPage);
        } else {
            nextPage = (section.getPages()[index + 1] as PdfPage);
        }
        this.currentGraphics = nextPage.graphics;
        let pageindex : number = (this.currentGraphics.page as PdfPage).section.indexOf(this.currentGraphics.page as PdfPage);
        if (!(this.listOfNavigatePages.indexOf(pageindex) !== -1)) {
            this.listOfNavigatePages.push(pageindex);
        }
        this.currentBounds = new RectangleF(new PointF(0, 0), nextPage.getClientSize());
        if ((typeof format !== 'undefined') && format != null && format.usePaginateBounds && (typeof format.paginateBounds !== 'undefined') && format.paginateBounds != null && (format.paginateBounds.x !== format.paginateBounds.y) && (format.paginateBounds.y !== format.paginateBounds.height)
            && (format.paginateBounds.height !== format.paginateBounds.width) && (format.paginateBounds.width !== 0)) {
            this.currentBounds.x = format.paginateBounds.x;
            this.currentBounds.y = format.paginateBounds.y;
            this.currentBounds.height = format.paginateBounds.height;
        }
        return nextPage;
    }
    private CheckIfDefaultFormat(format : PdfStringFormat) : boolean {
        let defaultFormat : PdfStringFormat = new PdfStringFormat();
        return (format.alignment === defaultFormat.alignment && format.characterSpacing === defaultFormat.characterSpacing &&
                format.clipPath === defaultFormat.clipPath && format.firstLineIndent === defaultFormat.firstLineIndent &&
                format.horizontalScalingFactor === defaultFormat.horizontalScalingFactor &&
                format.lineAlignment === defaultFormat.lineAlignment
                && format.lineLimit === defaultFormat.lineLimit && format.lineSpacing === defaultFormat.lineSpacing &&
                format.measureTrailingSpaces === defaultFormat.measureTrailingSpaces && format.noClip === defaultFormat.noClip &&
                format.paragraphIndent === defaultFormat.paragraphIndent && format.rightToLeft === defaultFormat.rightToLeft &&
                format.subSuperScript === defaultFormat.subSuperScript && format.wordSpacing === defaultFormat.wordSpacing &&
                format.wordWrap === defaultFormat.wordWrap);
    }
    /**
     * `Raises BeforeCellDraw event`.
     * @private
     */
    private RaiseBeforeCellDraw(graphics : PdfGraphics, rowIndex : number, cellIndex : number, bounds : RectangleF,
                                value : string, style : PdfGridCellStyle ) : PdfGridCellStyle {
        let args : PdfGridBeginCellDrawEventArgs = null;
        if (this.Grid.raiseBeginCellDraw) {
            args = new PdfGridBeginCellDrawEventArgs(graphics, rowIndex, cellIndex, bounds, value, style);
            this.Grid.onBeginCellDraw(args);
            style = args.style;
        }
        return style;
    }
    /**
     * `Raises AfterCellDraw event`.
     * @private
     */
    private raiseAfterCellDraw(graphics : PdfGraphics, rowIndex : number, cellIndex : number,
                               bounds : RectangleF, value : string, cellstyle : PdfGridCellStyle) : void {
        let args : PdfGridEndCellDrawEventArgs = null;
        if (this.Grid.raiseEndCellDraw) {
            args = new PdfGridEndCellDrawEventArgs(graphics, rowIndex, cellIndex, bounds, value, cellstyle);
            this.Grid.onEndCellDraw(args);
        }
    }
    private reArrangePages(layoutedPages : TemporaryDictionary<PdfPage, number[]>) : void {
        let document : PdfDocument = this.currentPage.document;
        let pages : PdfPage[] = [];
        let keys : PdfPage[] = layoutedPages.keys();
        let values : number[][] = layoutedPages.values();
        for (let i : number = 0; i < keys.length; i++) {
            let page : PdfPage = keys[i] as PdfPage;
            page.section = null;
            pages.push(page);
            document.pages.remove(page);
        }
        /* tslint:disable */
        for (let i : number = 0; i < layoutedPages.size(); i++) {
            let count : number = 0;
            for (let j : number = i, count = (layoutedPages.size() / this.columnRanges.length); j < layoutedPages.size(); j += count) {
                let page : PdfPage = pages[j];
                if (typeof page !== 'undefined' && document.pages.indexOf(page) === -1) {
                    document.pages.add(page);
                }
            }
        }
        /* tslint:enable */
    }
    /**
     * Gets the `layout result`.
     * @private
     */
    private getLayoutResult() : PdfGridLayoutResult {
        if (this.Grid.isChildGrid && this.Grid.allowRowBreakAcrossPages) {
                for (let i : number = 0; i < this.Grid.rows.count; i++) {
                    let row : PdfGridRow = this.Grid.rows.getRow(i);
                    if (row.rowBreakHeight > 0 && row.repeatFlag) {
                        this.startLocation.y = this.currentPage.origin.y;
                    }
                }
            }
        let bounds : RectangleF;
        if (!this.isChanged) {
            bounds = new RectangleF(this.startLocation, new SizeF(this.currentBounds.width, this.currentBounds.y -
                                     this.startLocation.y));
        }
        // else {
        //     bounds = new RectangleF(this.currentLocation, new SizeF(this.currentBounds.width, this.currentBounds.y -
        //                              this.currentLocation.y));
        // }
        /* tslint:enable */
        return new PdfGridLayoutResult(this.currentPage, bounds);
    }
    /**
     * `Recalculate row height` for the split cell to be drawn.
     * @private
     */
    public ReCalculateHeight(row : PdfGridRow, height : number) : number {
        let newHeight : number = 0.0;
        for (let i : number = this.cellStartIndex; i <= this.cellEndIndex; i++) {
            if (!(row.cells.getCell(i).remainingString === null || row.cells.getCell(i).remainingString === '' ||
                   typeof row.cells.getCell(i).remainingString === 'undefined')) {
                newHeight = Math.max(newHeight, row.cells.getCell(i).measureHeight());
            }
        }
        return Math.max(height, newHeight);
    }
    /**
     * `Raises BeforePageLayout event`.
     * @private
     */
    private raiseBeforePageLayout(currentPage : PdfPage, currentBounds : RectangleF,
                                  currentRow : number) : { returnValue : boolean, currentBounds : RectangleF,
                                                          currentRowIndex : number } {
        let cancel : boolean = false;
        if (this.Grid.raiseBeginPageLayout) {
            let args : PdfGridBeginPageLayoutEventArgs = new PdfGridBeginPageLayoutEventArgs( currentBounds, currentPage, currentRow);
            this.Grid.onBeginPageLayout(args);
            // if (currentBounds !== args.Bounds) {
            //     this.isChanged = true;
            //     this.currentLocation = new PointF(args.Bounds.x, args.Bounds.y);
            //     this.measureColumnsWidth(new RectangleF(new PointF(args.Bounds.x, args.Bounds.y) ,
            //                                                  new SizeF(args.Bounds.width + args.Bounds.x ,
            //                                                                 args.Bounds.height)));
            // }
            cancel = (typeof args.cancel === 'undefined' ? false : args.cancel);
            currentBounds = args.bounds;
            currentRow = args.startRowIndex;
        }
        return {returnValue : cancel, currentBounds : currentBounds, currentRowIndex : currentRow };
    }
    /**
     * `Raises PageLayout event` if needed.
     * @private
     */
    private raisePageLayouted(result : PdfLayoutResult) : PdfGridEndPageLayoutEventArgs {
        let args : PdfGridEndPageLayoutEventArgs = new PdfGridEndPageLayoutEventArgs(result);
        if (this.Grid.raiseEndPageLayout) {
            this.Grid.onEndPageLayout(args);
        }
        return args;
    }
    private drawRow(row : PdfGridRow) : RowLayoutResult
    /**
     * `Draws row`
     * @private
     */
    private drawRow(row : PdfGridRow, result : RowLayoutResult, height : number) : void
    private drawRow(row : PdfGridRow, result ?: RowLayoutResult, height ?: number) : RowLayoutResult|void {
        if (typeof result === 'undefined') {
            //.. Check if required space available.
            //.....If the row conains spans which  falls through more than one page, then draw the row to next page.                        
            let result : RowLayoutResult = new RowLayoutResult();
            let rowHeightWithSpan : number = 0;
            let location : PointF = new PointF(0, 0);
            let size : SizeF = new SizeF(0, 0);
            let isHeader : boolean = false;
            if (row.rowSpanExists) {
                let maxSpan : number = 0;
                let currRowIndex : number = this.Grid.rows.rowCollection.indexOf(row);
                if (currRowIndex === -1) {
                    currRowIndex = this.Grid.headers.indexOf(row);
                    if (currRowIndex !== -1) {
                        isHeader = true;
                    }
                }
                for (let i : number = 0; i < row.cells.count; i++) {
                    let cell : PdfGridCell = row.cells.getCell(i);
                    maxSpan = Math.max(maxSpan, cell.rowSpan);
                }
                for (let i : number = currRowIndex; i < currRowIndex + maxSpan; i++) {
                    rowHeightWithSpan += (isHeader ? this.Grid.headers.getHeader(i).height : this.Grid.rows.getRow(i).height);
                }
                // let rowMaxHeight : number = rowHeightWithSpan;
                // for (let i : number = 0; i < row.cells.count; i++ ) {
                //     rowMaxHeight = rowMaxHeight > row.cells.getCell(i).height ? rowMaxHeight : row.cells.getCell(i).height;
                // }
                // let flag : boolean = true;
                // let nextRow : PdfGridRow = this.Grid.headers.getHeader(this.Grid.headers.indexOf(row) + 1);
                // for (let i : number = 0; i < nextRow.cells.count; i++ ) {
                //     if (nextRow.cells.getCell(i).value !== '' && nextRow.cells.getCell(i).value !== undefined) {
                //         flag = false;
                //         break;
                //     }
                // }
                // if ((rowMaxHeight > rowHeightWithSpan) && flag) {
                //     row.height += (rowMaxHeight - rowHeightWithSpan);
                // }                
            }
            let calculatedHeight : number = row.rowBreakHeight > 0.0 ? row.rowBreakHeight : row.height;
            if (typeof this.Grid.isChildGrid !== 'undefined' && this.Grid.isChildGrid && typeof this.Grid.ParentCell !== 'undefined' && this.Grid.ParentCell != null) {
                //Split row only if row height exceeds page height and AllowRowBreakAcrossPages is true.
                // if (calculatedHeight + this.Grid.ParentCell.row.grid.style.cellPadding.bottom +
                //             this.Grid.ParentCell.row.grid.style.cellPadding.top > this.currentPageBounds.height) {
                //     if (this.Grid.allowRowBreakAcrossPages) {
                //         result.isFinish = true;
                //         if ( this.Grid.isChildGrid && row.rowBreakHeight > 0 ) {
                //             if (this.Grid.ParentCell.row.grid.style.cellPadding !== null) {
                //                 this.currentBounds.y += this.Grid.ParentCell.row.grid.style.cellPadding.top;
                //             }
                //             this.currentBounds.x = this.startLocation.x;
                //         }
                //         result.bounds = this.currentBounds ;
                //         this.drawRowWithBreak(result, row, calculatedHeight);
                //     } else {
                //         //If AllowRowBreakAcrossPages is not true, draw the row till it fits the page.                       

                //         if (this.Grid.ParentCell.row.grid.style.cellPadding != null) {
                //             this.currentBounds.y += this.Grid.ParentCell.row.grid.style.cellPadding.top;
                //             calculatedHeight = this.currentBounds.height - this.currentBounds.y -
                //                     this.Grid.ParentCell.row.grid.style.cellPadding.bottom;
                //         }
                //         result.isFinish = false;
                //         this.drawRow( row, result, calculatedHeight);
                //     }
                // } else
                 if (this.currentBounds.y + this.Grid.ParentCell.row.grid.style.cellPadding.bottom + calculatedHeight >
                            this.currentPageBounds.height || this.currentBounds.y + this.Grid.ParentCell.row.grid.style.cellPadding.bottom
                            + calculatedHeight > this.currentBounds.height || this.currentBounds.y +
                            this.Grid.ParentCell.row.grid.style.cellPadding.bottom + rowHeightWithSpan > this.currentPageBounds.height) {
                   //If a row is repeated and still cannot fit in page, proceed draw.
                    if (typeof this.Grid.ParentCell.row.grid.LayoutFormat !== 'undefined' && this.Grid.ParentCell.row.grid.LayoutFormat.break === PdfLayoutBreakType.FitPage ) {
                        PdfGridLayouter.repeatRowIndex = this.Grid.rows.rowCollection.indexOf(row);
                        this.Grid.splitChildRowIndex = this.Grid.rows.rowCollection.indexOf(row);
                    }
                    if (PdfGridLayouter.repeatRowIndex > -1 && PdfGridLayouter.repeatRowIndex === row.rowIndex) {
                        if (this.Grid.allowRowBreakAcrossPages) {
                            result.isFinish = true;
                            // if (this.Grid.isChildGrid && row.rowBreakHeightValue > 0) {
                            //     // if (this.Grid.ParentCell.row.grid.style.cellPadding != null) {
                            //     //     this.currentBounds.y += this.Grid.ParentCell.row.grid.style.cellPadding.top;
                            //     // }
                            //     this.currentBounds.x = this.startLocation.x;
                            // }
                            result.bounds = this.currentBounds;
                            this.drawRowWithBreak(result, row, calculatedHeight);
                            row.repeatFlag = true;
                            row.repeatRowNumber = PdfGridLayouter.repeatRowIndex;
                        }
                        // else {
                        //     result.isFinish = false;
                        //     row.repeatFlag = false;
                        //     this.drawRow( row, result, calculatedHeight);
                        // }
                    }
                    // else {
                    //     result.isFinish = false;
                    // }
                } else {
                    result.isFinish = true;
                    if (row.grid.ParentCell.row.rowBreakHeightValue > 0 ) {
                        row.repeatFlag = true;
                    } else {
                        row.repeatFlag = false;
                        calculatedHeight = row.height;
                    }
                    if (this.Grid.isChildGrid && row.rowBreakHeight > 0) {
                        if (this.Grid.ParentCell.row.grid.style.cellPadding != null) {
                            calculatedHeight += this.Grid.ParentCell.row.grid.style.cellPadding.bottom;
                        }
                    }
                    this.drawRow( row, result, calculatedHeight);
                }
            } else {
                //Split row only if row height exceeds page height and AllowRowBreakAcrossPages is true.
                if (calculatedHeight > this.currentPageBounds.height) {
                    if (this.Grid.allowRowBreakAcrossPages) {
                        result.isFinish = true;
                        //result.bounds = this.currentBounds;
                        this.drawRowWithBreak(result, row, calculatedHeight);
                        row.isrowFinish = true;
                        row.repeatFlag = true;
                        if (row.grid.splitChildRowIndex !== -1) {
                            result.isFinish = false;
                        }
                    }
                    // else {
                    //     //If AllowRowBreakAcrossPages is not true, draw the row till it fits the page.
                    //     result.isFinish = false;
                    //     this.drawRow( row, result, calculatedHeight);
                    // }
                } else if (this.currentBounds.y + calculatedHeight > this.currentPageBounds.height ||
                    this.currentBounds.y + calculatedHeight > (this.currentBounds.height + this.startLocation.y) ||
                    this.currentBounds.y + rowHeightWithSpan > this.currentPageBounds.height) {
                    // If a row is repeated and still cannot fit in page, proceed draw.
                    let isFit: boolean = false;
                    if ((this.Grid.allowRowBreakAcrossPages && !this.Grid.repeatHeader && !row.isRowHeightSet && !row.rowMergeComplete)) {
                        if (this.Grid.LayoutFormat !== null && this.Grid.LayoutFormat.paginateBounds.height > 0) {
                            isFit = this.isFitToCell((this.currentBounds.height + this.startLocation.y) - this.currentBounds.y, this.Grid, row);
                        }
                        else
                            isFit = this.isFitToCell(this.currentPageBounds.height - this.currentBounds.y, this.Grid, row);
                        if (isFit) {
                            this.isPaginate = true;
                        }
                    }
                    else if (this.Grid.allowRowBreakAcrossPages && this.Grid.LayoutFormat != null && this.Grid.LayoutFormat.layout == PdfLayoutType.Paginate && this.Grid.LayoutFormat.break != PdfLayoutBreakType.FitElement && row.isRowHeightSet && this.currentBounds.y + height > this.currentPageBounds.height) {
                        isFit = this.isFitToCell(this.currentPageBounds.height - this.currentBounds.y, this.Grid, row);
                        if (!isFit)
                            isFit = !(this.slr !== null && this.slr.actualSize.height == 0 && this.slr.remainder != null && this.slr.remainder.length > 0 && this.remainderText == this.slr.remainder);

                        if (isFit && this.slr != null && this.slr.lineCount > 1) {
                            //It may text cutoff issue
                            isFit = false;
                        }
                        this.remainderText = null;
                    }
                    if (PdfGridLayouter.repeatRowIndex > -1 && PdfGridLayouter.repeatRowIndex === row.rowIndex || isFit) {
                        if (this.Grid.allowRowBreakAcrossPages) {
                            result.isFinish = true;
                            this.drawRowWithBreak(result, row, calculatedHeight);
                            row.repeatFlag = true;
                            row.repeatRowNumber = PdfGridLayouter.repeatRowIndex;
                            if (row.grid.splitChildRowIndex !== -1) {
                                result.isFinish = false;
                            }
                        }
                        else {
                            result.isFinish = false;
                            this.drawRow(row, result, calculatedHeight);
                        }
                    } else {
                        result.isFinish = false;
                    }
                } else {
                        result.isFinish = true;
                        this.drawRow(row, result, calculatedHeight);
                        row.repeatFlag = false;
                }
            }
            return result;
        } else {
            let skipcell : boolean = false;
            let location : PointF = new PointF(this.currentBounds.x, this.currentBounds.y);
            // if (row.grid.isChildGrid && row.grid.allowRowBreakAcrossPages && this.startLocation.x !== this.currentBounds.x && row.width <
            //                 this.currentPage.getClientSize().width) {
            //     location.x = this.startLocation.x;
            // }
            result.bounds = new RectangleF(location, new SizeF(0, 0));
            height = this.ReCalculateHeight(row, height);
            for (let i : number = this.cellStartIndex; i <= this.cellEndIndex; i++) {
                let cancelSpans : boolean = ((i > this.cellEndIndex + 1) && (row.cells.getCell(i).columnSpan > 1));
                // let cancelSpans : boolean = false;
                if (!cancelSpans) {
                    for (let j : number = 1; j < row.cells.getCell(i).columnSpan; j++) {
                        row.cells.getCell(i + j).isCellMergeContinue = true;
                    }
                }
                let size : SizeF = new SizeF(this.Grid.columns.getColumn(i).width, height);
                // if (size.width > this.currentGraphics.clientSize.width) {
                //     size.width = this.currentGraphics.clientSize.width;
                // }
                // if (this.Grid.isChildGrid && this.Grid.style.allowHorizontalOverflow) {
                //     if (size.width >= this.currentGraphics.clientSize.width) {
                //         size.width -= 2 * this.currentBounds.x;
                //     }
                // }
                /* tslint:disable */
                if (!this.CheckIfDefaultFormat(this.Grid.columns.getColumn(i).format) &&
                     this.CheckIfDefaultFormat(row.cells.getCell(i).stringFormat)) {
                    row.cells.getCell(i).stringFormat = this.Grid.columns.getColumn(i).format;
                }
                let cellstyle : PdfGridCellStyle = row.cells.getCell(i).style;
                let tempValue : string = ((typeof row.cells.getCell(i).value === 'string' &&
                row.cells.getCell(i).value !== null) ? row.cells.getCell(i).value : '') as string;

                row.cells.getCell(i).style = this.RaiseBeforeCellDraw(this.currentGraphics, this.currentRowIndex, i,
                                                                    new RectangleF(location, size), tempValue, cellstyle);
                //row.cells.getCell(i).style = cellstyle;
                if (!skipcell) {
                    if (row.cells.getCell(i).value instanceof PdfGrid)
                    {
                       let grid :PdfGrid = row.cells.getCell(i).value as PdfGrid;
                        grid.parentCellIndex = i;
                    }
                let stringResult : PdfStringLayoutResult = row.cells.getCell(i).draw(this.currentGraphics,
                                                            new RectangleF(location, size), cancelSpans);
                if (row.grid.style.allowHorizontalOverflow && (row.cells.getCell(i).columnSpan > this.cellEndIndex ||
                            i + row.cells.getCell(i).columnSpan > this.cellEndIndex + 1) && this.cellEndIndex < row.cells.count - 1) {
                    row.rowOverflowIndex = this.cellEndIndex;
                }
                if (row.grid.style.allowHorizontalOverflow && (row.rowOverflowIndex > 0 && (row.cells.getCell(i).columnSpan > 
                            this.cellEndIndex || i + row.cells.getCell(i).columnSpan > this.cellEndIndex + 1)) && 
                            row.cells.getCell(i).columnSpan - this.cellEndIndex + i - 1 > 0) {
                    row.cells.getCell(row.rowOverflowIndex + 1).value = stringResult !== null ? (stringResult.remainder !== undefined) ? 
                                        stringResult.remainder : '' : '';
                    row.cells.getCell(row.rowOverflowIndex + 1).stringFormat = row.cells.getCell(i).stringFormat;
                    row.cells.getCell(row.rowOverflowIndex + 1).style = row.cells.getCell(i).style;
                    row.cells.getCell(row.rowOverflowIndex + 1).columnSpan = row.cells.getCell(i).columnSpan - this.cellEndIndex + i - 1;
                }
            }
                /* tslint:enable */
                tempValue = ((typeof row.cells.getCell(i).value === 'string' &&
                              row.cells.getCell(i).value !== null) ? row.cells.getCell(i).value : '') as string;
                if (!cancelSpans) {
                    this.raiseAfterCellDraw(this.currentGraphics, this.currentRowIndex, i,
                                            new RectangleF(location, size), tempValue, row.cells.getCell(i).style);
                    }
                if (row.cells.getCell(i).value instanceof PdfGrid) {
                    let grid : PdfGrid = row.cells.getCell(i).value as PdfGrid;
                    if (this.Grid.columns.getColumn(i).width >= this.currentGraphics.clientSize.width) {
                        location.x = grid.rowLayoutBoundsWidth;
                        location.x += grid.style.cellSpacing;
                    } else {
                        location.x += this.Grid.columns.getColumn(i).width;
                    }
                } else {
                        location.x += this.Grid.columns.getColumn(i).width;
                }
            }
            if (!row.rowMergeComplete || row.isRowHeightSet) {
                this.currentBounds.y += height;
            }
            result.bounds = new RectangleF(new PointF(result.bounds.x, result.bounds.y), new SizeF(location.x, location.y));
        }
    }

    private isFitToCell(currentHeight: number, grid: PdfGrid, gridRow: PdfGridRow): boolean {
        let isFit: boolean = false;
        let layouter: PdfStringLayouter = new PdfStringLayouter();
        for (let i: number = 0; i < gridRow.cells.count; i++) {
            let cell: PdfGridCell = gridRow.cells.getCell(i);
            if (typeof cell.value !== 'undefined' && cell.value !== null && typeof cell.value === 'string') {
                let font: PdfFont = null;
                if (typeof cell.style.font !== 'undefined' && cell.style.font != null) {
                    font = cell.style.font;
                } else if (typeof cell.row.style.font !== 'undefined' && cell.row.style.font != null) {
                    font = cell.row.style.font;
                } else if (typeof cell.row.grid.style.font !== 'undefined' && cell.row.grid.style.font != null) {
                    font = cell.row.grid.style.font;
                } else {
                    font = PdfDocument.defaultFont;
                }
                this.remainderText = gridRow.cells.getCell(i).value as string;
                let width: number = gridRow.cells.getCell(i).width;
                if (grid.columns.getColumn(i).isCustomWidth && gridRow.cells.getCell(i).width > grid.columns.getColumn(i).width) {
                    width = grid.columns.getColumn(i).width;
                }
                this.slr = layouter.layout(gridRow.cells.getCell(i).value as string, font, gridRow.cells.getCell(i).stringFormat, new SizeF(width, currentHeight), false, this.currentPageBounds);
                let height: number = this.slr.actualSize.height;
                if (height == 0) {
                    isFit = false;
                    break;
                }
                if (gridRow.cells.getCell(i).style != null && gridRow.cells.getCell(i).style.borders != null && gridRow.cells.getCell(i).style.borders.top != null && gridRow.cells.getCell(i).style.borders.bottom != null)
                    height += (gridRow.cells.getCell(i).style.borders.top.width + gridRow.cells.getCell(i).style.borders.bottom.width) * 2;
                if (this.slr.lineCount > 1 && gridRow.cells.getCell(i).stringFormat != null && gridRow.cells.getCell(i).stringFormat.lineSpacing != 0)
                    height += (this.slr.lineCount - 1) * (gridRow.cells.getCell(i).style.stringFormat.lineSpacing);

                if (gridRow.cells.getCell(i).style.cellPadding == null) {
                    height += (grid.style.cellPadding.top + grid.style.cellPadding.bottom);
                }
                else {
                    height += (grid.style.cellPadding.top + grid.style.cellPadding.bottom);
                }
                height += grid.style.cellSpacing;
                if (currentHeight > height || (typeof this.slr.remainder !== 'undefined' && this.slr.remainder !== null)) {
                    isFit = true;
                    break;
                }
            }
        }
        return isFit;
    }
    /**
     * `Draws row`
     * @private
     */
    private drawRowWithBreak(result : RowLayoutResult, row : PdfGridRow,  calculateHeight : number) : void
    private drawRowWithBreak(result ?: RowLayoutResult, row ?: PdfGridRow, calculateHeight ?: number) : RowLayoutResult|void {
        let location : PointF = new PointF(this.currentBounds.x, this.currentBounds.y);
        if (row.grid.isChildGrid && row.grid.allowRowBreakAcrossPages && this.startLocation.x !== this.currentBounds.x) {
            location.x = this.startLocation.x;
        }
        result.bounds = new RectangleF(location, new SizeF(0, 0));
        this.gridHeight = row.rowBreakHeight > 0 ? this.currentPageBounds.height : 0;
        // Calculate the remaining height.
        if (row.grid.style.cellPadding.top + this.currentBounds.y + row.grid.style.cellPadding.bottom < this.currentPageBounds.height) {
            row.rowBreakHeight = this.currentBounds.y + calculateHeight - this.currentPageBounds.height;
        }
        // else {
        //     row.rowBreakHeight = calculateHeight;
        //     result.isFinish = false;
        //     return;
        // }
        // No need to explicit break if the row height is equal to grid height.
        for (let i : number = 0; i < row.cells.count; i++) {
            let cell : PdfGridCell = row.cells.getCell(i);
            let cellHeight : number = cell.measureHeight();
            if (cellHeight === calculateHeight && cell.value instanceof PdfGrid) {
                row.rowBreakHeight = 0;
            }
            // else if (cellHeight === calculateHeight && (cell.value as PdfGrid) === null) {
            //     row.rowBreakHeight = this.currentBounds.y + calculateHeight - this.currentPageBounds.height;
            // }
        }
        for (let i : number = this.cellStartIndex; i <= this.cellEndIndex; i++) {
            let cancelSpans : boolean = ((row.cells.getCell(i).columnSpan + i > this.cellEndIndex + 1) &&
                                        (row.cells.getCell(i).columnSpan > 1));
            // if (!cancelSpans) {
            //     for (let k : number = 1; k < row.cells.getCell(i).columnSpan; k++) {
            //         row.cells.getCell(i + k).isCellMergeContinue = true;
            //     }
            //}
            let size : SizeF = new SizeF(this.Grid.columns.getColumn(i).width, this.gridHeight > 0.0 ? this.gridHeight :
                                            this.currentPageBounds.height);
            // if (size.width === 0) {
            //     size = new SizeF(row.cells.getCell(i).width, size.height);
            // }
            // if (!this.CheckIfDefaultFormat(this.Grid.columns.getColumn(i).format) &&
            //         this.CheckIfDefaultFormat((row.cells.getCell(i).stringFormat))) {
            //     row.cells.getCell(i).stringFormat = this.Grid.columns.getColumn(i).format;
            // }
            let cellstyle1 : PdfGridCellStyle = row.cells.getCell(i).style;
            row.cells.getCell(i).style = cellstyle1;
            let skipcell : boolean = false;
            let stringResult  : PdfStringLayoutResult = null;
            if (!skipcell) {
                stringResult = row.cells.getCell(i).draw(this.currentGraphics, new RectangleF(location, size), cancelSpans);
            }
            //If still row is to be drawn, set cell finished drawing cell as false and update the text to be drawn.
            if (row.rowBreakHeight > 0.0) {
                if (stringResult != null && typeof stringResult.remainder !== 'undefined') {
                    row.cells.getCell(i).FinishedDrawingCell = false;
                    row.cells.getCell(i).remainingString = stringResult.remainder == null ? ' ' : stringResult.remainder;
                    row.rowBreakHeight = calculateHeight - stringResult.actualSize.height;
                }
            }
            result.isFinish = (!result.isFinish) ? result.isFinish : row.cells.getCell(i).FinishedDrawingCell;
           // let tempValue : string = ((typeof row.cells.getCell(i).value === 'string' &&
            //row.cells.getCell(i).value !== null) ? row.cells.getCell(i).value : '') as string;
            // if (!cancelSpans) {
            //     // this.raiseAfterCellDraw(this.currentGraphics, this.currentRowIndex, i,
            //     //           new RectangleF(location, size), tempValue, row.cells.getCell(i).style);            
            //     this.raiseAfterCellDraw(this.currentGraphics, this.currentRowIndex, i, new RectangleF(location, size),
            //                             (row.cells.getCell(i).value as string) ? row.cells.getCell(i).value.toString() : ' ',
            //                             row.cells.getCell(i).style);
            //     }                
            if (row.cells.getCell(i).value instanceof PdfGrid) {
                let grid : PdfGrid = row.cells.getCell(i).value as PdfGrid;
                this.rowBreakPageHeightCellIndex = i;
                // row.cells.getCell(i).pageCount = grid.listOfNavigatePages.length;
                // for (let j : number = 0;j<grid.listOfNavigatePages.length;j++){
                //     let pageIndex : number =grid.listOfNavigatePages.indexOf(j);
                //             this.Grid.listOfNavigatePages.push(pageIndex);
                //     }
                if (this.Grid.columns.getColumn(i).width >= this.currentGraphics.clientSize.width) {
                    location.x = this.rowLayoutBoundsWidth;
                    location.x += grid.style.cellSpacing;
                } else {
                    location.x += this.Grid.columns.getColumn(i).width;
                }
            } else {
                location.x += this.Grid.columns.getColumn(i).width;
             }
        }
        this.currentBounds.y += this.gridHeight > 0.0 ? this.gridHeight : calculateHeight;
        result.bounds = new RectangleF(new PointF(result.bounds.x, result.bounds.y), new SizeF(location.x, location.y));
    }
}
    // recalculateBounds : boolean, clientSize : SizeF
    //Implementation
    /**
     * `Initializes` internal data.
     * @private
     */
//Internal declaration
export class PdfGridLayoutResult extends PdfLayoutResult {
    /**
     * Constructor
     * @private
     */
    public constructor(page : PdfPage, bounds : RectangleF) {
        super(page, bounds);
    }
}
/**
 * `PdfGridLayoutFormat` class represents a flexible grid that consists of columns and rows.
 */
export class PdfGridLayoutFormat extends PdfLayoutFormat {
    // Constructors
    /**
     * Initializes a new instance of the `PdfGridLayoutFormat` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfGridLayoutFormat` class.
     * @private
     */
    public constructor(baseFormat : PdfLayoutFormat)
    /**
     * Initializes a new instance of the `PdfGridLayoutFormat` class.
     * @private
     */
    public constructor(baseFormat ?: PdfLayoutFormat) {
        super(baseFormat);
    }
}
export abstract class GridCellEventArgs {
    // Fields
    /**
     * @hidden
     * @private
     */
    private gridRowIndex : number;
    /**
     * @hidden
     * @private
     */
    private gridCellIndex : number;
    /**
     * @hidden
     * @private
     */
    private internalValue : string;
    /**
     * @hidden
     * @private
     */
    private gridBounds : RectangleF;
    /**
     * @hidden
     * @private
     */
    private pdfGraphics : PdfGraphics;
    // Properties
    /**
     * Gets the value of current `row index`.
     * @private
     */
    public get rowIndex() : number {
        return this.gridRowIndex;
    }
    /**
     * Gets the value of current `cell index`.
     * @private
     */
    public get cellIndex() : number {
        return this.gridCellIndex;
    }
    /**
     * Gets the actual `value` of current cell.
     * @private
     */
    public get value() : string {
        return this.internalValue;
    }
    /**
     * Gets the `bounds` of current cell.
     * @private
     */
    public get bounds() : RectangleF {
        return this.gridBounds;
    }
    /**
     * Gets the instance of `current graphics`.
     * @private
     */
    public get graphics() : PdfGraphics {
        return this.pdfGraphics;
    }
    // Constructors
    /**
     * Initialize a new instance for `GridCellEventArgs` class.
     * @private
     */
    public constructor(graphics : PdfGraphics, rowIndex : number, cellIndex : number, bounds : RectangleF, value : string) {
        this.gridRowIndex = rowIndex;
        this.gridCellIndex = cellIndex;
        this.internalValue = value;
        this.gridBounds = bounds;
        this.pdfGraphics = graphics;
    }
}
export class PdfGridBeginCellDrawEventArgs extends GridCellEventArgs {
    // Fields
    /**
     * @hidden
     * @private
     */
    private bSkip : boolean;
    /**
     * @hidden
     * @private
     */
    private cellStyle : PdfGridCellStyle;
    // Properties
    /**
     * Gets or sets a value indicating whether the value of this cell should be `skipped`.
     * @private
     */
    public get skip() : boolean {
        return this.bSkip;
    }
    public set skip(value : boolean) {
        this.bSkip = value;
    }
    /**
     * Gets or sets a `style` value of the cell.
     * @private
     */
    public get style() : PdfGridCellStyle {
        return this.cellStyle;
    }
    public set style(value : PdfGridCellStyle) {
        this.cellStyle = value;
    }
    // Constructors
    /**
     * Initializes a new instance of the `StartCellLayoutEventArgs` class.
     * @private
     */
    public constructor(graphics : PdfGraphics, rowIndex : number, cellIndex : number, bounds : RectangleF,
                       value : string, style : PdfGridCellStyle) {
        super(graphics, rowIndex, cellIndex, bounds, value);
        this.style = style;
    }
}
export class PdfGridEndCellDrawEventArgs extends GridCellEventArgs {
    // Field
    /**
     * @hidden
     * @private
     */
    private cellStyle : PdfGridCellStyle;
    // Propertise
    /**
     * Get the `PdfGridCellStyle`.
     * @private
     */
    public get style() : PdfGridCellStyle {
        return this.cellStyle;
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfGridEndCellLayoutEventArgs` class.
     * @private
     */
    public constructor(graphics : PdfGraphics, rowIndex : number, cellIndex : number, bounds : RectangleF,
                       value : string, style : PdfGridCellStyle) {
        super(graphics, rowIndex, cellIndex, bounds, value);
        this.cellStyle = style;
    }
}

export class PdfCancelEventArgs {
    // Fields
    /**
     * @hidden
     * @private
     */
    private isCancel : boolean;
    // Properties
    /**
     * Gets and Sets the value of `cancel`.
     * @private
     */
    public get cancel() : boolean {
        return this.isCancel;
    }
    public set cancel(value : boolean) {
        this.isCancel = value;
    }
}
export class BeginPageLayoutEventArgs extends PdfCancelEventArgs {
    // Fields
    /**
     * The `bounds` of the lay outing on the page.
     * @private
     */
    private cellBounds : RectangleF;
    /**
     * `Page` where the lay outing should start.
     * @private
     */
    private pdfPage : PdfPage;
    // Properties
    /**
     * Gets or sets value that indicates the lay outing `bounds` on the page.
     * @private
     */
    public get bounds() : RectangleF {
        return this.cellBounds;
    }
    public set bounds(value : RectangleF) {
        this.cellBounds = value;
    }
    /**
     * Gets the `page` where the lay outing should start.
     * @private
     */
    public get page() : PdfPage {
        return this.pdfPage;
    }
    // Constructors
    /**
     * Initializes a new instance of the `BeginPageLayoutEventArgs` class with the specified rectangle and page.
     * @private
     */
    public constructor(bounds : RectangleF, page : PdfPage) {
        super();
        this.bounds = bounds;
        this.pdfPage = page;
    }
}
/**
 * `EndPageLayoutEventArgs` class is alternate for end page layout events. 
 */

export class EndPageLayoutEventArgs extends PdfCancelEventArgs {
    // Fields
    /**
     * `Layout result`.
     * @private
     */
    private layoutResult : PdfLayoutResult;
    /**
     * The `next page` for lay outing.
     * @private
     */
    private nextPdfPage : PdfPage;
    // Properties
    /**
     * Gets the lay outing `result` of the page.
     * @private
     */
    public get result() : PdfLayoutResult {
        return this.layoutResult;
    }
    /**
     * Gets or sets a value indicating the `next page` where the element should be layout.
     * @private
     */
    public get nextPage() : PdfPage {
        return this.nextPdfPage;
    }
    public set nextPage(value : PdfPage) {
        this.nextPdfPage = value;
    }
    // Constructors
    /**
     * Initializes a new instance of the `EndPageLayoutEventArgs` class. with the specified 'PdfLayoutResult'.
     * @private
     */
    public constructor(result : PdfLayoutResult) {
        super();
        this.layoutResult = result;
    }
}
/**
 * `PdfGridBeginPageLayoutEventArgs` class is alternate for begin page layout events. 
 */
export class PdfGridBeginPageLayoutEventArgs extends BeginPageLayoutEventArgs {
    // Fields
    /**
     * @hidden
     * @private
     */
    private startRow : number;
    // Properties
    /**
     * Gets the `start row index`.
     * @private
     */
    public get startRowIndex() : number {
        return this.startRow;
    }
    // Constructors
    /**
     * Initialize a new instance of `PdfGridBeginPageLayoutEventArgs` class.
     * @private
     */
    public constructor(bounds : RectangleF, page : PdfPage, startRow : number) {
        super(bounds, page);
        this.startRow = startRow;
    }
}
/**
 * `PdfGridEndPageLayoutEventArgs` class is alternate for begin page layout events. 
 */
export class PdfGridEndPageLayoutEventArgs extends EndPageLayoutEventArgs {
    // Constructors
    /**
     * Initialize a new instance of `PdfGridEndPageLayoutEventArgs` class.
     * @private
     */
    public constructor(result : PdfLayoutResult) {
        super(result);
    }
}
export class RowLayoutResult {
    /**
     * @hidden
     * @private
     */
    private bIsFinished : boolean;
    /**
     * @hidden
     * @private
     */
    private layoutedBounds : RectangleF;
    /**
     * Gets or sets a value indicating whether this instance `is finish`.
     * @private
     */
    public get isFinish() : boolean {
        return this.bIsFinished;
    }
    public set isFinish(value : boolean) {
        this.bIsFinished = value;
    }
    /**
     * Gets or sets the `bounds`.
     * @private
     */
    public get bounds() : RectangleF {
        return this.layoutedBounds;
    }
    public set bounds(value : RectangleF) {
        this.layoutedBounds = value;
    }
    //Constructors
    /**
     * Initializes a new instance of the `RowLayoutResult` class.
     * @private
     */
    public constructor() {
        this.layoutedBounds = new RectangleF(0, 0, 0, 0);
    }
}