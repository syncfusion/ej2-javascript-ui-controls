/**
 * `PdfGridCell.ts` class for EJ2-PDF
 */
import { PdfGridRow } from './pdf-grid-row';
import { PdfGrid } from './pdf-grid';
import { PdfGridCellStyle } from './styles/style';
import { PdfStringLayouter, PdfStringLayoutResult } from './../../graphics/fonts/string-layouter';
import { PdfDocument } from './../../document/pdf-document';
import { PdfFont } from './../../graphics/fonts/pdf-font';
import { PdfBrush } from './../../graphics/brushes/pdf-brush';
import { PdfPen } from './../../graphics/pdf-pen';
import { PdfStringFormat } from './../../graphics/fonts/pdf-string-format';
import { RectangleF, PointF, SizeF } from './../../drawing/pdf-drawing';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { PdfDashStyle, PdfLineCap } from './../../graphics/enum';
import { PdfBorderOverlapStyle } from './../tables/light-tables/enum';
import { PdfSolidBrush } from './../../graphics/brushes/pdf-solid-brush';
import { PdfColor } from './../../graphics/pdf-color';
import { PdfImage } from './../../graphics/images/pdf-image';
import { PdfBitmap } from './../../graphics/images/pdf-bitmap';
import { PdfTextWebLink } from './../../annotations/pdf-text-web-link';
import { PdfPage } from './../../pages/pdf-page';
import { PdfLayoutType } from './../../graphics/figures/enum';
import { PdfGridLayouter , PdfGridLayoutFormat } from './../../structured-elements/grid/layout/grid-layouter';
import { PdfLayoutParams, PdfLayoutResult, PdfLayoutFormat } from '../../../implementation/graphics/figures/base/element-layouter';
/**
 * `PdfGridCell` class represents the schema of a cell in a 'PdfGrid'.
 */
export class PdfGridCell {
    //Fields
    /**
     * The `row span`.
     * @private
     */
    private gridRowSpan : number;
    /**
     * The `column span`.
     * @private
     */
    private colSpan : number;
    /**
     * Specifies the current `row`.
     * @private
     */
    private gridRow : PdfGridRow;
    /**
     * The actual `value` of the cell.
     * @private
     */
    private objectValue : Object;
    /**
     * Current cell `style`.
     * @private
     */
    private cellStyle : PdfGridCellStyle;
    /**
     * `Width` of the cell.
     * @default 0
     * @private
     */
    private cellWidth : number = 0;
    /**
     * `Height` of the cell.
     * @default 0
     * @private
     */
    private cellHeight : number = 0;
    /**
     * `tempval`to stores current width .
     * @default 0
     * @private
     */
    private tempval : number = 0;
    private fontSpilt : boolean = false;
    /**
     * The `remaining string`.
     * @private
     */
    private remaining : string;
    /**
     * Specifies weather the `cell is drawn`.
     * @default true
     * @private
     */
    private finsh : boolean = true;
    /**
     * 'parent ' of the grid cell.
     * @private
     */
    private parent : PdfGridCell ;
    /**
     * `StringFormat` of the cell.
     * @private
     */
    private format : PdfStringFormat;
    /**
     * The `remaining height` of row span.
     * @default 0
     * @private
     */
    public rowSpanRemainingHeight : number = 0;
    private internalIsCellMergeContinue : boolean;
    private internalIsRowMergeContinue : boolean;
    private internalIsCellMergeStart : boolean;
    private internalIsRowMergeStart : boolean;
    public hasRowSpan : boolean = false;
    public hasColSpan : boolean = false;
    /**
     * the 'isFinish' is set to page finish
     */
    private  isFinish : boolean = true;
    /**
     * The `present' to store the current cell.
     * @default false     
     * @private
     */
    public present : boolean = false;
    /**
     * The `Count` of the page.     
     * @private
     */
    public pageCount : number ;
    //constructor
    /**
     * Initializes a new instance of the `PdfGridCell` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfGridCell` class.
     * @private
     */
    public constructor(row : PdfGridRow)
    public constructor(row ?: PdfGridRow) {
        this.gridRowSpan = 1;
        this.colSpan = 1;
        if (typeof row !== 'undefined') {
            this.gridRow = row;
        }
    }
    //Properties
    public get isCellMergeContinue() : boolean {
        return this.internalIsCellMergeContinue;
    }
    public set isCellMergeContinue(value : boolean) {
        this.internalIsCellMergeContinue = value;
    }
    public get isRowMergeContinue() : boolean {
        return this.internalIsRowMergeContinue;
    }
    public set isRowMergeContinue(value : boolean) {
        this.internalIsRowMergeContinue = value;
    }
    public get isCellMergeStart() : boolean {
        return this.internalIsCellMergeStart;
    }
    public set isCellMergeStart(value : boolean) {
        this.internalIsCellMergeStart = value;
    }
    public get isRowMergeStart() : boolean {
        return this.internalIsRowMergeStart;
    }
    public set isRowMergeStart(value : boolean) {
        this.internalIsRowMergeStart = value;
    }
    /**
     * Gets or sets the `remaining string` after the row split between pages.
     * @private
     */
    public get remainingString() : string {
        return this.remaining;
    }
    public set remainingString(value : string) {
        this.remaining = value;
    }
    /**
     * Gets or sets the `FinishedDrawingCell` .
     * @private
     */
    public get FinishedDrawingCell() : boolean {
        return this.isFinish;
    }
    public set FinishedDrawingCell(value : boolean) {
        this.isFinish = value;
    }
    /**
     * Gets or sets the `string format`.
     * @private
     */
    public get stringFormat() : PdfStringFormat {
        if (this.format == null) {
            this.format = new PdfStringFormat();
        }
        return this.format;
    }
    public set stringFormat(value : PdfStringFormat) {
        this.format = value;
    }
    /**
     * Gets or sets the parent `row`.
     * @private
     */
    public get row() : PdfGridRow {
        return this.gridRow;
    }
    public set row(value : PdfGridRow) {
        this.gridRow = value;
    }
    /**
     * Gets or sets the `value` of the cell.
     * @private
     */
    public get value() : Object {
        return this.objectValue;
    }
    public set value(value : Object) {
        this.objectValue = value;
        if (this.objectValue instanceof PdfGrid) {
            this.row.grid.isSingleGrid = false;
            let grid : PdfGrid = this.objectValue as PdfGrid;
            grid.ParentCell = this;
            (this.objectValue as PdfGrid).isChildGrid = true;
            let rowCount : number = this.row.grid.rows.count;
            for (let i : number = 0; i < rowCount; i++) {
                let row : PdfGridRow = this.row.grid.rows.getRow(i);
                let colCount : number = row.cells.count;
                for (let j : number = 0; j < colCount; j++) {
                    let cell : PdfGridCell = row.cells.getCell(j);
                    cell.parent = this;
                }
            }
        }
    }
    /**
     * Gets or sets a value that indicates the total number of rows that cell `spans` within a PdfGrid.
     * @private
     */
    public get rowSpan() : number {
        return this.gridRowSpan;
    }
    public set rowSpan(value : number) {
        if (value < 1) {
            throw new Error('ArgumentException : Invalid span specified, must be greater than or equal to 1');
        } else {
            this.gridRowSpan = value;
            this.row.rowSpanExists = true;
            this.row.grid.hasRowSpanSpan = true;
        }
    }
    /**
     * Gets or sets the cell `style`.
     * @private
     */
    public get style() : PdfGridCellStyle {
        if (this.cellStyle == null) {
            this.cellStyle = new PdfGridCellStyle();
        }
        return this.cellStyle;
    }
    public set style(value : PdfGridCellStyle) {
        this.cellStyle = value;
    }
    /**
     * Gets the `height` of the PdfGrid cell.[Read-Only].
     * @private
     */
    public get height() : number {
        if (this.cellHeight === 0) {
            this.cellHeight = this.measureHeight();
        }
        return this.cellHeight;
    }
    public set height(value : number) {
        this.cellHeight = value;
    }
    /**
     * Gets or sets a value that indicates the total number of columns that cell `spans` within a PdfGrid.
     * @private
     */
    public get columnSpan() : number {
        return this.colSpan;
    }
    public set columnSpan(value : number) {
        if (value < 1) {
            throw Error('Invalid span specified, must be greater than or equal to 1');
        } else {
            this.colSpan = value;
            this.row.columnSpanExists = true;
        }
    }
    /**
     * Gets the `width` of the PdfGrid cell.[Read-Only].
     * @private
     */
    public get width() : number {
        if (this.cellWidth === 0 || this.row.grid.isComplete) {
            this.cellWidth = this.measureWidth();
        }
        return Math.round(this.cellWidth);
    }
    public set width(value : number) {
        this.cellWidth = value;
    }
    //Implementation
    /**
     * `Calculates the width`.
     * @private
     */
    private measureWidth() : number {
        // .. Calculate the cell text width.
        // .....Add border widths, cell spacings and paddings to the width.
        let width : number = 0;
        let layouter : PdfStringLayouter = new PdfStringLayouter();
        if (typeof this.objectValue === 'string') {
            /* tslint:disable */
            let slr : PdfStringLayoutResult = layouter.layout((this.objectValue as string), this.getTextFont(), this.stringFormat, new SizeF(Number.MAX_VALUE, Number.MAX_VALUE), false, new SizeF(0, 0));
            width += slr.actualSize.width;
            width += (this.style.borders.left.width + this.style.borders.right.width) * 2;
        } else if (this.objectValue instanceof PdfGrid) {
            width = (this.objectValue as PdfGrid).size.width;
            //width += this.objectValue.style.cellSpacing;
        } else if (this.objectValue instanceof PdfImage || this.objectValue instanceof PdfBitmap) {
            width += (this.objectValue as PdfImage).width;
        } else if (this.objectValue instanceof PdfTextWebLink) {
            let webLink : PdfTextWebLink = this.objectValue as PdfTextWebLink;
            let result : PdfStringLayoutResult = layouter.layout(webLink.text, webLink.font, webLink.stringFormat, new SizeF(0, 0), false, new SizeF(0, 0));
            /* tslint:enable */
            width += result.actualSize.width;
            width += (this.style.borders.left.width + this.style.borders.right.width) * 2;
        }
        if (!(this.objectValue instanceof PdfGrid)) {
            if (this.style.cellPadding != null) {
                width += (this.style.cellPadding.left + this.style.cellPadding.right);
            } else {
                width += (this.row.grid.style.cellPadding.left + this.row.grid.style.cellPadding.right);
            }
        } else {
            if (this.style.cellPadding != null || typeof this.style.cellPadding !== 'undefined') {
                if (typeof this.style.cellPadding.left !== 'undefined' && this.style.cellPadding.hasLeftPad) {
                    width += this.style.cellPadding.left;
                }
                if (typeof this.style.cellPadding.right !== 'undefined' && this.style.cellPadding.hasRightPad) {
                    width += this.style.cellPadding.right;
                }
            } else {
                if (typeof this.row.grid.style.cellPadding.left !== 'undefined' && this.row.grid.style.cellPadding.hasLeftPad) {
                    width += this.row.grid.style.cellPadding.left;
                }
                if (typeof this.row.grid.style.cellPadding.right !== 'undefined' && this.row.grid.style.cellPadding.hasRightPad) {
                    width += this.row.grid.style.cellPadding.right;
                }
            }
        }
        width += this.row.grid.style.cellSpacing;
        return width;
    }
    /**
     * Draw the `cell background`.
     * @private
     */
    public drawCellBackground(graphics : PdfGraphics, bounds : RectangleF) : void {
        let backgroundBrush : PdfBrush = this.getBackgroundBrush();
        //graphics.isTemplateGraphics = true;
        if (backgroundBrush != null) {
            graphics.save();
            graphics.drawRectangle(backgroundBrush, bounds.x, bounds.y, bounds.width, bounds.height);
            graphics.restore();
        }
        if (this.style.backgroundImage != null) {
                let image : PdfImage = this.getBackgroundImage();
                graphics.drawImage(this.style.backgroundImage, bounds.x, bounds.y, bounds.width, bounds.height);
            }
    }
    /**
     * `Adjusts the text layout area`.
     * @private
     */
    /* tslint:disable */
    private adjustContentLayoutArea(bounds : RectangleF) : RectangleF {
        //Add Padding value to its Cell Bounds
        let returnBounds : RectangleF = new RectangleF(bounds.x, bounds.y, bounds.width, bounds.height);
        if (!(this.objectValue instanceof PdfGrid))
        {
            if (typeof this.style.cellPadding === 'undefined' || this.style.cellPadding == null) {                        
                returnBounds.x += this.gridRow.grid.style.cellPadding.left + this.cellStyle.borders.left.width;
                returnBounds.y += this.gridRow.grid.style.cellPadding.top + this.cellStyle.borders.top.width;
                returnBounds.width -= (this.gridRow.grid.style.cellPadding.right + this.gridRow.grid.style.cellPadding.left);
                returnBounds.height -= (this.gridRow.grid.style.cellPadding.bottom + this.gridRow.grid.style.cellPadding.top);
                returnBounds.height -= (this.cellStyle.borders.top.width + this.cellStyle.borders.bottom.width);
            } else {
                returnBounds.x += this.style.cellPadding.left + this.cellStyle.borders.left.width;
                returnBounds.y += this.style.cellPadding.top + this.cellStyle.borders.top.width;
                returnBounds.width -= (this.style.cellPadding.right + this.style.cellPadding.left);
                returnBounds.width -= (this.cellStyle.borders.left.width + this.cellStyle.borders.right.width);
                returnBounds.height -= (this.style.cellPadding.bottom + this.style.cellPadding.top);
                returnBounds.height -= (this.cellStyle.borders.top.width + this.cellStyle.borders.bottom.width);
                if (this.rowSpan === 1) {
                    returnBounds.width -= (this.style.borders.left.width);
                }
            }
        }
        else{
            if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined')
            {
                if(typeof this.gridRow.grid.style.cellPadding.left !== 'undefined' && this.gridRow.grid.style.cellPadding.hasLeftPad){
                    returnBounds.x += this.gridRow.grid.style.cellPadding.left + this.cellStyle.borders.left.width;
                    returnBounds.width -= this.gridRow.grid.style.cellPadding.left;
                }
                if(typeof this.gridRow.grid.style.cellPadding.top !== 'undefined' && this.gridRow.grid.style.cellPadding.hasTopPad){
                    returnBounds.y += this.gridRow.grid.style.cellPadding.top + this.cellStyle.borders.top.width;
                    returnBounds.height -= this.gridRow.grid.style.cellPadding.top;
                }
                if(typeof this.gridRow.grid.style.cellPadding.right !== 'undefined' && this.gridRow.grid.style.cellPadding.hasRightPad){
                    returnBounds.width -= this.gridRow.grid.style.cellPadding.right;
                }
                if(typeof this.gridRow.grid.style.cellPadding.bottom !== 'undefined' && this.gridRow.grid.style.cellPadding.hasBottomPad){
                    returnBounds.height -= this.gridRow.grid.style.cellPadding.bottom;
                }
            }
            else
            {        
                if(typeof this.style.cellPadding.left !== 'undefined' && this.style.cellPadding.hasLeftPad) {
                    returnBounds.x += this.style.cellPadding.left + this.cellStyle.borders.left.width;
                    returnBounds.width -= this.style.cellPadding.left;
                }
                if(typeof this.style.cellPadding.top !== 'undefined' && this.style.cellPadding.hasTopPad) {
                    returnBounds.y += this.style.cellPadding.top +  this.cellStyle.borders.top.width;
                    returnBounds.height -= this.style.cellPadding.top;
                }
                if(typeof this.style.cellPadding.right !== 'undefined' && this.style.cellPadding.hasRightPad){
                    returnBounds.width -= this.style.cellPadding.right;
                }
                if(typeof this.style.cellPadding.bottom !== 'undefined' && this.style.cellPadding.hasBottomPad){
                    returnBounds.height -= this.style.cellPadding.bottom;
                }
            }
            returnBounds.width -= (this.cellStyle.borders.left.width + this.cellStyle.borders.right.width);
            returnBounds.height -= (this.cellStyle.borders.top.width + this.cellStyle.borders.bottom.width);
        }
        return returnBounds;
    }
    /**
     * `Draws` the specified graphics.
     * @private
     */
    public draw(graphics : PdfGraphics, bounds : RectangleF, cancelSubsequentSpans : boolean) : PdfStringLayoutResult {
        let isrowbreak : boolean = false;
            /*if (!this.row.grid.isSingleGrid)
            {
                //Check whether the Grid Span to Nextpage
                if ((this.remainingString != null) || (PdfGridLayouter.repeatRowIndex != -1))
                {
                    this.DrawParentCells(graphics, bounds, true);
                }
                else if (this.row.grid.rows.count > 1)
                {
                    for (let i : number  = 0; i < this.row.grid.rows.count; i++)
                    {
                        if (this.row == this.row.grid.rows.getRow(i))
                        {
                            if (this.row.grid.rows.getRow(i).rowBreakHeight > 0)
                                isrowbreak = true;
                            if ((i > 0) && (isrowbreak))
                                this.DrawParentCells(graphics, bounds, false);
                        }
                    }
                }
            } */  
        let result : PdfStringLayoutResult = null;
        /*if (cancelSubsequentSpans)
        {
            //..Cancel all subsequent cell spans, if no space exists.
            let currentCellIndex : number = this.row.cells.indexOf(this);
            for (let i : number = currentCellIndex + 1; i <= currentCellIndex + this.colSpan; i++)
            {
                this.row.cells.getCell(i).isCellMergeContinue = false;
                this.row.cells.getCell(i).isRowMergeContinue = false;
            }
            this.colSpan = 1;
        }*/
        //..Skip cells which were already covered by spanmap.
        if (this.internalIsCellMergeContinue || this.internalIsRowMergeContinue) {
            if (this.internalIsCellMergeContinue && this.row.grid.style.allowHorizontalOverflow) {
                if ((this.row.rowOverflowIndex > 0 && (this.row.cells.indexOf(this) != this.row.rowOverflowIndex + 1)) || (this.row.rowOverflowIndex == 0 && this.internalIsCellMergeContinue)) {
                    return result;
                }
            }
            else {
                return result;
            }
        }
        //Adjust bounds with Row and Column Spacing
        bounds = this.adjustOuterLayoutArea(bounds, graphics);
        this.drawCellBackground(graphics, bounds);
        let textPen : PdfPen = this.getTextPen();
        let textBrush : PdfBrush = this.getTextBrush();
        if (typeof textPen === 'undefined' && typeof textBrush === 'undefined') {
            textBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        let font : PdfFont = this.getTextFont();
        let strFormat : PdfStringFormat = this.getStringFormat();    
        let innerLayoutArea : RectangleF = bounds;
        if (innerLayoutArea.height >= graphics.clientSize.height)
        {
            // If to break row to next page.
            if (this.row.grid.allowRowBreakAcrossPages)
            {
                innerLayoutArea.height -= innerLayoutArea.y;
                //bounds.height -= bounds.y;
                // if(this.row.grid.isChildGrid)
                // {
                //     innerLayoutArea.height -= this.row.grid.ParentCell.row.grid.style.cellPadding.bottom;
                // }
            }
            // if user choose to cut the row whose height is more than page height.
            // else
            // {
            //     innerLayoutArea.height = graphics.clientSize.height;
            //     bounds.height = graphics.clientSize.height;
            // }
        }
        innerLayoutArea = this.adjustContentLayoutArea(innerLayoutArea);
        if (typeof this.objectValue === 'string' || typeof this.remaining === 'string') {
            let temp : string;
            let layoutRectangle : RectangleF;           
            if (innerLayoutArea.height < font.height)
                    layoutRectangle = new RectangleF(innerLayoutArea.x, innerLayoutArea.y, innerLayoutArea.width, font.height);                    
            else
                    layoutRectangle = innerLayoutArea;                    
            if (innerLayoutArea.height < font.height && this.row.grid.isChildGrid && this.row.grid.ParentCell != null)
                {
                        let height : number = layoutRectangle.height - this.row.grid.ParentCell.row.grid.style.cellPadding.bottom - this.row.grid.style.cellPadding.bottom;
                        if(this.row.grid.splitChildRowIndex != -1){
                            this.fontSpilt = true;
                            this.row.rowFontSplit = true;
                        }
                        if (height > 0 && height < font.height)
                            layoutRectangle.height = height;
                        // else if (height + this.row.grid.style.cellPadding.bottom > 0 && height + this.row.grid.style.cellPadding.bottom < font.height)
                        //     layoutRectangle.height = height + this.row.grid.style.cellPadding.bottom;
                        // else if (bounds.height < font.height)
                        //     layoutRectangle.height = bounds.height;
                        // else if (bounds.height - this.row.grid.ParentCell.row.grid.style.cellPadding.bottom < font.height)
                        //     layoutRectangle.height = bounds.height - this.row.grid.ParentCell.row.grid.style.cellPadding.bottom;                        
                }          
            
            if(this.gridRow.grid.style.cellSpacing != 0) {
                    layoutRectangle.width -= this.gridRow.grid.style.cellSpacing;
                    bounds.width -= this.gridRow.grid.style.cellSpacing;
            }
            
            if (this.isFinish) {
                // if (this.row.grid.splitChildRowIndex != -1 && !this.row.grid.isChildGrid && typeof this.remaining === 'undefined'){
                //     this.remaining = '';
                //     graphics.drawString(this.remaining, font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);
                // } else {
                    temp = this.remaining === '' ? this.remaining : (this.objectValue as string);
                    graphics.drawString(temp, font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);
                    if (this.row.grid.splitChildRowIndex != -1 && !this.row.grid.isChildGrid && typeof this.remaining === 'undefined'){
                            this.remaining = '';
                            //graphics.drawString(this.remaining, font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);
                        }
            }
             else {
                if(typeof this.remaining == 'undefined' ||this.remaining === null){
                    this.remaining = '';
                }
                 if (this.row.repeatFlag) {
                   graphics.drawString((this.remaining as string), font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);                
                 }
                //  else {
                //     if(this.row.grid.ParentCell.row.repeatFlag) {
                //         graphics.drawString((this.remaining as string), font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);                    
                //     } else {
                //         layoutRectangle.height = this.row.height;
                //         graphics.drawString((this.objectValue as string), font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);
                //         bounds.height = this.row.height;
                      
                //     }
                
                //  }
                 this.isFinish = true;
                //graphics.drawString((this.remaining as string), font, textPen, textBrush, layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height, strFormat);
                }
            result = graphics.stringLayoutResult;
            // if(this.row.grid.isChildGrid && this.row.rowBreakHeight > 0 && result !=null) {
            //     bounds.height -= this.row.grid.ParentCell.row.grid.style.cellPadding.bottom;
            // }
        } else if (this.objectValue instanceof PdfGrid ) {
            let childGrid : PdfGrid = this.objectValue as PdfGrid;
            childGrid.isChildGrid = true;
            childGrid.ParentCell = this;
            let layoutRect : RectangleF;
            layoutRect = innerLayoutArea;
            
            if(this.gridRow.grid.style.cellSpacing != 0){
                bounds.width -= this.gridRow.grid.style.cellSpacing;
            }
            // layoutRect = bounds;
            // if (this.style.cellPadding != null){
            //     layoutRect = bounds;            
            // } else if((this.row.grid.style.cellPadding != null) && (childGrid.style.cellPadding.bottom === 0.5) && (childGrid.style.cellPadding.top === 0.5)
            //                               && (childGrid.style.cellPadding.left === 5.76) && (childGrid.style.cellPadding.right === 5.76)
            //                               && (this.gridRow.grid.style.cellSpacing === 0) && (childGrid.style.cellSpacing === 0)) {
            //     layoutRect = innerLayoutArea;
            // }
            // if(this.objectValue.style.cellPadding != null && typeof this.objectValue.style.cellPadding !== 'undefined'){
            //     layoutRect = bounds;
            // }           
            let layouter : PdfGridLayouter= new PdfGridLayouter(childGrid);
            let format : PdfLayoutFormat = new PdfGridLayoutFormat();
            if (this.row.grid.LayoutFormat != null)
                format = this.row.grid.LayoutFormat;
            else
                format.layout = PdfLayoutType.Paginate;
            
            let param : PdfLayoutParams = new PdfLayoutParams();
            if (graphics.layer != null)
            {
                // Define layout parameters.
                param.page = graphics.page as PdfPage;
                param.bounds = layoutRect;
                param.format = format;
                //Set the span 
                childGrid.setSpan();
                childGrid.checkSpan();
                // Draw the child grid.
                let childGridResult : PdfLayoutResult = layouter.Layouter(param);
                
                //let childGridResult : PdfLayoutResult = layouter.innerLayout(param);
                this.value = childGrid;
                if(this.row.grid.splitChildRowIndex !== -1){
                    this.height = this.row.rowBreakHeightValue;
                }
                   if (param.page != childGridResult.page) //&& (isWidthGreaterthanParent != true))
                    {
                        childGridResult.bounds.height = this.row.rowBreakHeightValue;                        
                        if(this.row.rowBreakHeight == 0)
                            this.row.NestedGridLayoutResult = childGridResult;
                        else
                            this.row.rowBreakHeight = this.row.rowBreakHeightValue;
                            //bounds.height = this.row.rowBreakHeight;
                                                                 
                        
                        //After drawing paginated nested grid, the bounds of the parent grid in start page should be corrected for borders.
                        //bounds.height = graphics.clientSize.height - bounds.y;
                    
                    }
            }
            
        } else if (this.objectValue instanceof PdfImage || this.objectValue instanceof PdfBitmap) {
            let imageBounds : RectangleF;
            if ((this.objectValue as PdfImage).width <= innerLayoutArea.width) {
                imageBounds = new RectangleF(innerLayoutArea.x, innerLayoutArea.y, (this.objectValue as PdfImage).width, innerLayoutArea.height);
            } else {
                imageBounds = innerLayoutArea;
            }
            graphics.drawImage(this.objectValue as PdfImage, imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height);
        } else if (this.objectValue instanceof PdfTextWebLink) {            
            (this.objectValue as PdfTextWebLink).draw(graphics.currentPage, innerLayoutArea);
        } else if (typeof this.objectValue === 'undefined') {
            this.objectValue = "";
            graphics.drawString(this.objectValue as string, font, textPen, textBrush, innerLayoutArea.x, innerLayoutArea.y,innerLayoutArea.width, innerLayoutArea.height,strFormat);
            if (this.style.cellPadding != null && this.style.cellPadding.bottom == 0 && this.style.cellPadding.left == 0 && this.style.cellPadding.right == 0 && this.style.cellPadding.top == 0) {
                bounds.width -= (this.style.borders.left.width + this.style.borders.right.width);
            }
            if (this.gridRow.grid.style.cellSpacing != 0) {
                bounds.width -= this.gridRow.grid.style.cellSpacing;
        } 
        }
        if (this.style.borders != null) {
            if(!this.fontSpilt)
                this.drawCellBorders(graphics, bounds);
            else {
                if(this.row.grid.ParentCell.row.grid.splitChildRowIndex != -1){
                    this.row.rowFontSplit = false;
                    this.drawCellBorders(graphics, bounds);
                }               
            }
        }
        return result;
    }    
    /* tslint:enable */
    /**
     * Draws the `cell border` constructed by drawing lines.
     * @private
     */
    public drawCellBorders(graphics : PdfGraphics, bounds : RectangleF) : void {
        if (this.row.grid.style.borderOverlapStyle === PdfBorderOverlapStyle.Inside) {
            bounds.x += this.style.borders.left.width;
            bounds.y += this.style.borders.top.width;
            bounds.width -= this.style.borders.right.width;
            bounds.height -= this.style.borders.bottom.width;
        }
        let p1 : PointF = new PointF(bounds.x, bounds.y + bounds.height);
        let p2 : PointF = new PointF(bounds.x, bounds.y);
        let pen : PdfPen = this.cellStyle.borders.left;
        if (this.cellStyle.borders.left.dashStyle === PdfDashStyle.Solid) {
            pen.lineCap = PdfLineCap.Square;
        }
        // SetTransparency(ref graphics, pen);
        if (pen.width !== 0) {
            graphics.drawLine(pen, p1, p2);
        }
        p1 = new PointF(bounds.x + bounds.width, bounds.y);
        p2 = new PointF(bounds.x + bounds.width, bounds.y + bounds.height);
        pen = this.cellStyle.borders.right;
        if ((bounds.x + bounds.width) > (graphics.clientSize.width - (pen.width / 2))) {
            p1 = new PointF(graphics.clientSize.width - (pen.width / 2), bounds.y);
            p2 = new PointF(graphics.clientSize.width - (pen.width / 2), bounds.y + bounds.height);
        }
        if (this.cellStyle.borders.right.dashStyle === PdfDashStyle.Solid) {
            pen.lineCap = PdfLineCap.Square;
        }
        if (pen.width !== 0) {
            graphics.drawLine(pen, p1, p2);
        }
        p1 = new PointF(bounds.x, bounds.y);
        p2 = new PointF(bounds.x + bounds.width, bounds.y);
        pen = this.cellStyle.borders.top;
        if (this.cellStyle.borders.top.dashStyle === PdfDashStyle.Solid) {
            pen.lineCap = PdfLineCap.Square;
        }
        if (pen.width !== 0) {
            graphics.drawLine(pen, p1, p2);
        }
        p1 = new PointF(bounds.x + bounds.width, bounds.y + bounds.height);
        p2 = new PointF(bounds.x, bounds.y + bounds.height);
        pen = this.cellStyle.borders.bottom;
        if ((bounds.y + bounds.height) > (graphics.clientSize.height - (pen.width / 2))) {
            p1 = new PointF((bounds.x + bounds.width), (graphics.clientSize.height - (pen.width / 2)));
            p2 = new PointF(bounds.x, (graphics.clientSize.height - (pen.width / 2)));
        }
        if (this.cellStyle.borders.bottom.dashStyle === PdfDashStyle.Solid) {
            pen.lineCap = PdfLineCap.Square;
        }
        if (pen.width !== 0) {
            graphics.drawLine(pen, p1, p2);
        }
    }
    // private setTransparency(graphics : PdfGraphics, pen : PdfPen) : void {
    //     let alpha : number = (pen.color.a / 255) as number;
    //     graphics.save();
    //     graphics.setTransparency(alpha);
    // }
    /**
     * `Adjusts the outer layout area`.
     * @private
     */
    /* tslint:disable */
    private adjustOuterLayoutArea(bounds : RectangleF, g : PdfGraphics) : RectangleF {
        let isHeader : boolean = false;
        let cellSpacing : number = this.row.grid.style.cellSpacing;
        if (cellSpacing > 0) {
            bounds = new RectangleF(bounds.x + cellSpacing, bounds.y + cellSpacing,
                                         bounds.width - cellSpacing, bounds.height - cellSpacing);
        }
        let currentColIndex : number = this.row.cells.indexOf(this);
        if (this.columnSpan > 1|| (this.row.rowOverflowIndex > 0 && (currentColIndex == this.row.rowOverflowIndex + 1) && this.isCellMergeContinue)) {
            let span : number = this.columnSpan;
            if (span == 1 && this.isCellMergeContinue) {
                    for (let j : number = currentColIndex + 1; j < this.row.grid.columns.count; j++)
                    {
                        if (this.row.cells.getCell(j).isCellMergeContinue)
                            span++;
                        else
                            break;
                    }
            }
            let totalWidth : number = 0;
            for (let i : number = currentColIndex; i < currentColIndex + span; i++) {
                if (this.row.grid.style.allowHorizontalOverflow) {
                    let width : number;
                    let compWidth : number = this.row.grid.size.width < g.clientSize.width ? this.row.grid.size.width : g.clientSize.width;
                    if(this.row.grid.size.width > g.clientSize.width) {
                        width = bounds.x + totalWidth + this.row.grid.columns.getColumn(i).width;
                    } else {
                        width = totalWidth + this.row.grid.columns.getColumn(i).width;
                    }
                    if (width > compWidth) {
                        break;
                    }
                }
                totalWidth += this.row.grid.columns.getColumn(i).width;
            }
            totalWidth -= this.row.grid.style.cellSpacing;
            bounds.width = totalWidth;
        }
        if (this.rowSpan > 1 || this.row.rowSpanExists) {
            let span : number = this.rowSpan;
            let currentRowIndex : number = this.row.grid.rows.rowCollection.indexOf(this.row);
            if (currentRowIndex == -1) {
                currentRowIndex = this.row.grid.headers.indexOf(this.row);
                if (currentRowIndex != -1) {
                    isHeader = true;
                }
            }
            // if (span == 1 && this.isCellMergeContinue) {
            //         for (let j : number = currentRowIndex + 1; j < this.row.grid.rows.count; j++)
            //         {
            //             let flag : boolean = (isHeader ? this.row.grid.headers.getHeader(j).cells.getCell(currentColIndex).isCellMergeContinue : this.row.grid.rows.getRow(j).cells.getCell(currentColIndex).isCellMergeContinue);
            //             if (flag)
            //                 span++;
            //             else
            //                 break;
            //         }
            // }
            let totalHeight : number = 0;
            let max : number = 0;
            for (let i : number = currentRowIndex; i < currentRowIndex + span; i++) {
                totalHeight += (isHeader ? this.row.grid.headers.getHeader(i).height : this.row.grid.rows.getRow(i).height);
                let row : PdfGridRow = this.row.grid.rows.getRow(i);
                let rowIndex : number = this.row.grid.rows.rowCollection.indexOf(row);
                /*if (this.rowSpan > 1)
                    {                       
                        for (let k : number = 0; k < this.row.cells.count; k++) {
                            let cell : PdfGridCell = this.row.cells.getCell(k);
                            if(cell.rowSpan>1)
                            {
                                let tempHeight : number =0;
                                
                                for (let j :number = i; j < i +cell.rowSpan; j++)
                                {
                                    if (!this.row.grid.rows.getRow(j).isRowSpanRowHeightSet)
                                        this.row.grid.rows.getRow(j).isRowHeightSet = false;
                                    tempHeight += this.row.grid.rows.getRow(j).height;
                                    if (!this.row.grid.rows.getRow(j).isRowSpanRowHeightSet)
                                        this.row.grid.rows.getRow(j).isRowHeightSet = true;                                     
                                }    
                                //To check the Row spanned cell height is greater than the total spanned row height.
                                if(cell.height>tempHeight)
                                {
                                    if (max < (cell.height - tempHeight))
                                    {
                                        max = cell.height - tempHeight;
                                        if (this.rowSpanRemainingHeight != 0 && max > this.rowSpanRemainingHeight)
                                        {
                                            max += this.rowSpanRemainingHeight;
                                        }
                                        let index :number = row.cells.indexOf(cell);
                                        //set the m_rowspanRemainingHeight to last rowspanned row.
                                        this.row.grid.rows.getRow((rowIndex +cell.rowSpan) - 1).cells.getCell(index).rowSpanRemainingHeight = max;
                                        this.rowSpanRemainingHeight = this.row.grid.rows.getRow((rowIndex + cell.rowSpan) - 1).cells.getCell(index).rowSpanRemainingHeight;
                                    }
                                }
                            }
                        }
                    }
                    if (!this.row.grid.rows.getRow(i).isRowSpanRowHeightSet)
                    this.row.grid.rows.getRow(i).isRowHeightSet = true;*/
            }
            let cellIndex = this.row.cells.indexOf(this);            
            totalHeight -= this.row.grid.style.cellSpacing;
            // if (this.row.cells.getCell(cellIndex).height > totalHeight && (!this.row.grid.rows.getRow((currentRowIndex + span) - 1).isRowHeightSet)) {
            //      this.row.grid.rows.getRow((currentRowIndex + span) - 1).cells.getCell(cellIndex).rowSpanRemainingHeight = this.row.cells.getCell(cellIndex).height - totalHeight;
            //      totalHeight = this.row.cells.getCell(cellIndex).height;
            //      bounds.height = totalHeight;
            // } else {
                bounds.height = totalHeight;
               //  }
                if (!this.row.rowMergeComplete) {
                bounds.height = totalHeight;
            }
        }
        return bounds;
    }
    /* tslint:enable */
    /**
     * Gets the `text font`.
     * @private
     */
    private getTextFont() : PdfFont {
        if (typeof this.style.font !== 'undefined' && this.style.font != null) {
            return this.style.font;
        } else if (typeof this.row.style.font !== 'undefined' && this.row.style.font != null) {
            return this.row.style.font;
        } else if (typeof this.row.grid.style.font !== 'undefined' && this.row.grid.style.font != null) {
            return this.row.grid.style.font;
        } else {
            return PdfDocument.defaultFont;
        }
    }
    /**
     * Gets the `text brush`.
     * @private
     */
    private getTextBrush() : PdfBrush {
        if (typeof this.style.textBrush !== 'undefined' && this.style.textBrush != null) {
            return this.style.textBrush;
        } else if (typeof this.row.style.textBrush !== 'undefined' && this.row.style.textBrush != null) {
            return this.row.style.textBrush;
        } else {
            return this.row.grid.style.textBrush;
        }
    }
    /**
     * Gets the `text pen`.
     * @private
     */
    private getTextPen() : PdfPen {
        if (typeof this.style.textPen !== 'undefined' && this.style.textPen != null) {
            return this.style.textPen;
        } else if (typeof this.row.style.textPen !== 'undefined' && this.row.style.textPen != null) {
            return this.row.style.textPen;
        } else {
            return this.row.grid.style.textPen;
        }
    }
    /**
     * Gets the `background brush`.
     * @private
     */
    private getBackgroundBrush() : PdfBrush {
        if (typeof this.style.backgroundBrush !== 'undefined' && this.style.backgroundBrush != null) {
            return this.style.backgroundBrush;
        } else if (typeof this.row.style.backgroundBrush !== 'undefined' && this.row.style.backgroundBrush != null) {
            return this.row.style.backgroundBrush;
        } else {
            return this.row.grid.style.backgroundBrush;
        }
    }
    /**
     * Gets the `background image`.
     * @private
     */
    private getBackgroundImage() : PdfImage {
        if (typeof this.style.backgroundImage !== 'undefined' && this.style.backgroundImage != null) {
            return this.style.backgroundImage;
        } else if (typeof this.row.style.backgroundImage !== 'undefined' && this.row.style.backgroundImage != null) {
            return this.row.style.backgroundImage;
        } else {
            return this.row.grid.style.backgroundImage;
        }
    }
    /**
     * Gets the current `StringFormat`.
     * @private
     */
    private getStringFormat() : PdfStringFormat {
        if (typeof this.style.stringFormat !== 'undefined' && this.style.stringFormat != null) {
            return this.style.stringFormat;
        } else {
            return this.stringFormat;
        }
    }
    /**
     * Calculates the `height`.
     * @private
     */
    public measureHeight() : number {
        // .. Calculate the cell text height.
        // .....Add border widths, cell spacings and paddings to the height.
        let width : number = this.calculateWidth();
        // //check whether the Current PdfGridCell has padding
        if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined') {
            width -= (this.gridRow.grid.style.cellPadding.right + this.gridRow.grid.style.cellPadding.left);
            //width -= (this.style.borders.left.width + this.style.borders.right.width);
        } else {
            width -= (this.style.cellPadding.right + this.style.cellPadding.left);
            width -= (this.style.borders.left.width + this.style.borders.right.width);
        }
        let height : number = 0;
        let layouter : PdfStringLayouter = new PdfStringLayouter();
        if (typeof this.objectValue === 'string' || typeof this.remaining === 'string') {
            let currentValue : string = this.objectValue as string;
            /* tslint:disable */
            if (!this.isFinish)
                currentValue = !(this.remaining === null || this.remaining === '' ||
                                typeof this.remaining === 'undefined') ? this.remaining : (this.objectValue as string);
            let slr : PdfStringLayoutResult = null;
            let cellIndex : number = this.row.cells.indexOf(this);
            
            if (this.gridRow.grid.style.cellSpacing != 0){
                width -= this.gridRow.grid.style.cellSpacing * 2;
            }
            if(!this.row.cells.getCell(cellIndex).hasColSpan && !this.row.cells.getCell(cellIndex).hasRowSpan) {
                if(this.gridRow.grid.isChildGrid) {
                    if (width < 0) {
                        this.tempval = width;
                        if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined') {
                            this.tempval += (this.gridRow.grid.style.cellPadding.right + this.gridRow.grid.style.cellPadding.left);
                        } else {
                            this.tempval += (this.style.cellPadding.right + this.style.cellPadding.left);
                            this.tempval += (this.style.borders.left.width + this.style.borders.right.width);
                        }
                    } else {
                        this.tempval = width;
                    }
                    slr = layouter.layout(currentValue, this.getTextFont(), this.stringFormat, new SizeF(this.tempval, 0), false, new SizeF(0, 0));                
                    height += slr.actualSize.height;
                    } else {
                        slr = layouter.layout(currentValue, this.getTextFont(), this.stringFormat, new SizeF(width, 0), false, new SizeF(0, 0));
                        height += slr.actualSize.height;
                    }
                }
                /* tslint:enable */
            height += (this.style.borders.top.width + this.style.borders.bottom.width) * 2;
        } else if (this.objectValue instanceof PdfGrid) {
            let cellIndex : number = this.row.cells.indexOf(this);
            let internalWidth : number = 0;
            if ((this.style.cellPadding != null || typeof this.style.cellPadding !== 'undefined' )) {
                internalWidth = this.calculateWidth();
                if (typeof this.style.cellPadding.left !== 'undefined' && this.style.cellPadding.hasLeftPad) {
                    internalWidth -= this.style.cellPadding.left;
                }
                if (typeof this.style.cellPadding.right !== 'undefined' && this.style.cellPadding.hasRightPad) {
                    internalWidth -= this.style.cellPadding.right;
                }
            } else if ((this.row.grid.style.cellPadding != null || typeof this.row.grid.style.cellPadding !== 'undefined')) {
                internalWidth = this.calculateWidth();
                if (typeof this.row.grid.style.cellPadding.left !== 'undefined' && this.row.grid.style.cellPadding.hasLeftPad) {
                    internalWidth -= this.row.grid.style.cellPadding.left;
                }
                if (typeof this.row.grid.style.cellPadding.right !== 'undefined' && this.row.grid.style.cellPadding.hasRightPad) {
                    internalWidth -= this.row.grid.style.cellPadding.right;
                }
            } else {
                internalWidth = this.calculateWidth();
            }
            (this.objectValue as PdfGrid).tempWidth = internalWidth;
            if (!this.row.cells.getCell(cellIndex).hasColSpan && !this.row.cells.getCell(cellIndex).hasRowSpan) {
                height = (this.objectValue as PdfGrid).size.height;
            } else {
                height += (this.style.borders.top.width + this.style.borders.bottom.width) * 2;
            }
            if (this.gridRow.grid.style.cellSpacing !== 0 ) {
                width -= this.gridRow.grid.style.cellSpacing * 2;
                //height += (this.row.grid.style.cellPadding.top + this.row.grid.style.cellPadding.bottom);
            }
            if (this.style.cellPadding != null || typeof this.style.cellPadding !== 'undefined') {
                if (typeof this.row.grid.style.cellPadding.top !== 'undefined' && this.row.grid.style.cellPadding.hasTopPad) {
                    height += this.row.grid.style.cellPadding.top;
                }
                if (this.row.grid.style.cellPadding.hasBottomPad && typeof this.row.grid.style.cellPadding.bottom !== 'undefined') {
                    height += this.row.grid.style.cellPadding.bottom;
                }
            }
            height += this.objectValue.style.cellSpacing;
        } else if (this.objectValue instanceof PdfImage || this.objectValue instanceof PdfBitmap) {
            height += (this.objectValue as PdfImage).height;
        } else if (this.objectValue instanceof PdfTextWebLink) {
            let webLink : PdfTextWebLink = this.objectValue as PdfTextWebLink;
            /* tslint:disable */
            let slr : PdfStringLayoutResult = layouter.layout(webLink.text, webLink.font, webLink.stringFormat, new SizeF(width, 0), false, new SizeF(0, 0));
            /* tslint:enable */
            height += slr.actualSize.height;
            height += (this.style.borders.top.width + this.style.borders.bottom.width) * 2;
        } else if (typeof this.objectValue === 'undefined') {
            if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined') {
                width -= (this.gridRow.grid.style.cellPadding.right + this.gridRow.grid.style.cellPadding.left);
            } else {
                width -= (this.style.cellPadding.right + this.style.cellPadding.left);
                width -= (this.style.borders.left.width + this.style.borders.right.width);
            }
            height += (this.style.borders.top.width + this.style.borders.bottom.width) * 2;
        }
        //Add padding top and bottom value to height
        if (!(this.objectValue instanceof PdfGrid)) {
            if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined') {
                height += (this.row.grid.style.cellPadding.top + this.row.grid.style.cellPadding.bottom);
            } else {
                height += (this.style.cellPadding.top + this.style.cellPadding.bottom);
            }
        } else {
            if (this.style.cellPadding == null || typeof this.style.cellPadding === 'undefined') {
                if (typeof this.row.grid.style.cellPadding.top !== 'undefined' && this.row.grid.style.cellPadding.hasTopPad) {
                    height += this.row.grid.style.cellPadding.top;
                }
                if (typeof this.row.grid.style.cellPadding.bottom !== 'undefined' && this.row.grid.style.cellPadding.hasBottomPad) {
                    height += this.row.grid.style.cellPadding.bottom;
                }
            } else {
                if (typeof this.style.cellPadding.top !== 'undefined' && this.style.cellPadding.hasTopPad) {
                    height += this.style.cellPadding.top;
                }
                if (typeof this.style.cellPadding.bottom !== 'undefined' && this.style.cellPadding.hasBottomPad) {
                    height += this.style.cellPadding.bottom;
                }
            }
        }
        height += this.row.grid.style.cellSpacing;
        return height;
    }
    /**
     * return the calculated `width` of the cell.
     * @private
     */
    private calculateWidth() : number {
        let cellIndex : number = this.row.cells.indexOf(this);
        let rowindex : number = this.row.grid.rows.rowCollection.indexOf(this.row);
        let columnSpan : number = this.columnSpan;
        let width : number = 0;
        if (columnSpan === 1) {
            for (let i : number = 0; i < columnSpan; i++) {
                width += this.row.grid.columns.getColumn(cellIndex + i).width;
            }
        } else if (columnSpan > 1) {
            for (let i : number = 0; i < columnSpan; i++) {
                width += this.row.grid.columns.getColumn(cellIndex + i).width;
                if ( (i + 1) < columnSpan) {
                    this.row.cells.getCell(cellIndex + i + 1).hasColSpan = true;
                }
            }
        }

        if (this.parent != null && this.parent.row.width > 0) {
            if ((this.row.grid.isChildGrid) && this.parent != null && (this.row.width > this.parent.row.width)) {
                width = 0;
                for (let j : number = 0; j < this.parent.columnSpan; j++) {
                        width += this.parent.row.grid.columns.getColumn(j).width;
                }
                width = width / this.row.cells.count;
            }
        }
        return width;
    }
}
/**
 * `PdfGridCellCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfGridCell' objects.
 * @private
 */
export class PdfGridCellCollection {
    //Fields
    /**
     * @hidden
     * @private
     */
    private gridRow : PdfGridRow;
    /**
     * @hidden
     * @private
     */
    private cells : PdfGridCell[] = [];
    //Constructor
    /**
     * Initializes a new instance of the `PdfGridCellCollection` class with the row.
     * @private
     */
    public constructor(row : PdfGridRow) {
        this.gridRow = row;
    }
    //Properties
    /**
     * Gets the current `cell`.
     * @private
     */
    public getCell(index : number) : PdfGridCell {
        if (index < 0 || index >= this.count) {
            throw new Error('IndexOutOfRangeException');
        }
        return this.cells[index];
    }
    /**
     * Gets the cells `count`.[Read-Only].
     * @private
     */
    public get count() : number {
        return this.cells.length;
    }
    //Implementation
    /**
     * `Adds` this instance.
     * @private
     */
    public add() : PdfGridCell
    /**
     * `Adds` this instance.
     * @private
     */
    public add(cell : PdfGridCell) : void
    public add(cell ?: PdfGridCell) : PdfGridCell|void {
        if (typeof cell === 'undefined') {
            let tempcell : PdfGridCell = new PdfGridCell();
            this.add(tempcell);
            return cell;
        } else {
            cell.row = this.gridRow;
            this.cells.push(cell);
        }
    }
    /**
     * Returns the `index of` a particular cell in the collection.
     * @private
     */
    public indexOf(cell : PdfGridCell) : number {
        return this.cells.indexOf(cell);
    }
}