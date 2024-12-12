import { PdfGanttCellStyle, PdfGanttFontStyle } from './../../base/interface';
import { PdfTreeGrid } from '../pdf-treegrid';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfPaddings } from './index';
import {
    RectangleF, PdfTextAlignment, PdfBorderOverlapStyle, PointF, PdfDashStyle,
    PdfLineCap, PdfSolidBrush, PdfStandardFont, PdfTrueTypeFont
} from '@syncfusion/ej2-pdf-export';
import { SizeF, PdfBrush, PdfPen, PdfFontStyle, PdfFont, PdfGraphics, PdfBitmap, PdfImage, PdfTextWebLink } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfStringLayouter, PdfStringLayoutResult } from '@syncfusion/ej2-pdf-export';

/**@hidden*/

export class PdfTreeGridCell {
    /**
     * Gets or sets the parent `row`.
     *
     * @private
     */
    public row: PdfTreeGridRow;
    /**
     * Gets or sets the cell `style`.
     *
     * @private
     */
    public style: PdfGanttCellStyle;
    private cellWidth: number = 0;
    private cellHeight: number = 0;
    /**
     * Gets or sets a value that indicates the total number of rows that cell `spans` within a PdfGrid.
     *
     * @private
     */
    public rowSpan: number;
    /**
     * Gets or sets a value that indicates the total number of columns that cell `spans` within a PdfGrid.
     *
     * @private
     */
    public columnSpan: number;
    public value: Object;
    /** @private */
    public remainingString: string;
    /** @private */
    public finishedDrawingCell: boolean = true;
    /** @private */
    public isCellMergeContinue: boolean;
    /** @private */
    public isRowMergeContinue: boolean;
    /** @private */
    public isCellMergeStart: boolean;
    /** @private */
    public isRowMergeStart: boolean;
    /** @private */
    public isHeaderCell: boolean;
    /** @private */
    public image: PdfImage;
    /** @private */
    public fontStyle: PdfGanttFontStyle;
    constructor(row?: PdfTreeGridRow) {
        if (isNullOrUndefined(row)) {
            this.rowSpan = 1;
            this.columnSpan = 1;
        } else {
            this.row = row;
        }
        this.style = {};
    }
    /**
     * Gets the `height` of the PdfTreeGrid cell.[Read-Only].
     *
     * @returns {number} .
     * @private
     */
    public get height(): number {
        if (this.cellHeight === 0) {
            this.cellHeight = this.measureHeight();
        }
        return this.cellHeight;
    }
    public set height(value: number) {
        this.cellHeight = value;
    }
    /**
     * Gets the `width` of the PdfTreeGrid cell.[Read-Only].
     *
     * @returns {number} .
     * @private
     */
    public get width(): number {
        if (this.cellWidth === 0) {
            this.cellWidth = this.measureWidth();
        }
        return Math.round(this.cellWidth);
    }
    public set width(value: number) {
        this.cellWidth = value;
    }

    private measureWidth(): number {
        let width: number = 0;
        const layouter: PdfStringLayouter = new PdfStringLayouter();
        if (typeof this.value === 'string') {
            /* eslint-disable-next-line */
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, this.style.fontStyle);
            if (this.row.isParentRow) {
                font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, PdfFontStyle.Bold);
            } else {
                font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, this.style.fontStyle);
            }
            if (this.row.treegrid.ganttStyle.font) {
                font = this.row.treegrid.ganttStyle.font;
            }
            /* eslint-disable-next-line */
            const slr: PdfStringLayoutResult = layouter.layout((this.value as string), font, this.style.format, new SizeF(Number.MAX_VALUE, Number.MAX_VALUE), false, new SizeF(0, 0));
            width += slr.actualSize.width;
            width += (this.style.borders.left.width + this.style.borders.right.width) * 2;
        }
        if (typeof this.row.treegrid.style.cellPadding.left !== 'undefined' && this.row.treegrid.style.cellPadding.hasLeftPad) {
            width += this.row.treegrid.style.cellPadding.left;
        }
        if (typeof this.row.treegrid.style.cellPadding.right !== 'undefined' && this.row.treegrid.style.cellPadding.hasRightPad) {
            width += this.row.treegrid.style.cellPadding.right;
        }
        width += this.row.treegrid.style.cellSpacing;
        return width;
    }
    /**
     * @returns {number} .
     * @private
     */
    /* eslint-disable */
    public measureHeight(): number {
        const rowHeight: number = this.row.treegrid.rowHeight;
        let height = 0;
        let width: number = this.calculateWidth();
        width -= this.row.treegrid.style.cellPadding.right + this.row.treegrid.style.cellPadding.left;
        width -= this.style.borders ? this.style.borders.left.width + this.style.borders.right.width : 0;
        const layouter: PdfStringLayouter = new PdfStringLayouter();
        if (typeof this.value === 'string' || typeof this.remainingString === 'string') {
            let currentValue: string = this.value as string;
            if (!this.finishedDrawingCell) {
                currentValue = !(isNullOrUndefined(this.remainingString) || this.remainingString === '') ? this.remainingString : (this.value as string);
            }
            let font: PdfFont = null;
            if (this.row.isParentRow) {
                font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, PdfFontStyle.Bold);
            } else {
                font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, this.style.fontStyle);
            }
            if (this.row.treegrid.ganttStyle.font) {
                font = this.row.treegrid.ganttStyle.font;
            }
            /* eslint-disable */
            const slr: PdfStringLayoutResult = layouter.layout(currentValue, font, this.style.format, new SizeF(width - 10, 0), false, new SizeF(0, 0));
            const value: number = Math.max(slr.lineHeight, slr.actualSize.height)
            if (currentValue.length > 80) {
                height += value + 20;
            }
            else {
                height += value + (slr.size.height / 2);
            }        
            height += (this.style.borders.top.width + this.style.borders.bottom.width) * 2;
        }
        height += this.row.treegrid.style.cellPadding.top + this.row.treegrid.style.cellPadding.bottom;
        height += this.row.treegrid.style.cellSpacing;
        return height > rowHeight ? height : rowHeight;
    }
    /* eslint-enable */

    private calculateWidth(): number {
        const cellIndex: number = this.row.cells.indexOf(this);
        const columnSpan: number = this.columnSpan;
        let width: number = 0;
        for (let i: number = 0; i < columnSpan; i++) {
            width += this.row.treegrid.columns.getColumn(cellIndex + i) ? this.row.treegrid.columns.getColumn(cellIndex + i).width : 0;
        }
        if (this.row.treegrid.columns.getColumn(cellIndex) && this.row.treegrid.columns.getColumn(cellIndex).isTreeColumn) {
            width -= (this.row.level * 10);
        }
        return width;
    }
    /**
     * `Draws` the specified graphics.
     *
     * @param {PdfGraphics} graphics .
     * @param {RectangleF} bounds .
     * @param {boolean} cancelSubsequentSpans .
     * @param {number} leftAdjustment .
     * @returns {PdfStringLayoutResult} .
     * @private
     */
    public draw(graphics: PdfGraphics, bounds: RectangleF, cancelSubsequentSpans: boolean, leftAdjustment: number): PdfStringLayoutResult {
        let result: PdfStringLayoutResult = null; const padding: number = 10;
        // if (cancelSubsequentSpans) {
        //     // Cancel all subsequent cell spans, if no space exists.
        //     const currentCellIndex: number = this.row.cells.indexOf(this);
        //     for (let i: number = currentCellIndex + 1; i <= currentCellIndex + this.columnSpan; i++) {
        //         this.row.cells.getCell(i).isCellMergeContinue = false;
        //         this.row.cells.getCell(i).isRowMergeContinue = false;
        //     }
        //     this.columnSpan = 1;
        // }
        // Skip cells which were already covered by span map.
        // if (this.isCellMergeContinue || this.isRowMergeContinue) {
        //     if (this.isCellMergeContinue && this.row.treegrid.style.allowHorizontalOverflow) {
        //         if ((this.row.rowOverflowIndex > 0 && (this.row.cells.indexOf(this) !== this.row.rowOverflowIndex + 1)) ||
        //             (this.row.rowOverflowIndex === 0 && this.isCellMergeContinue)) {
        //             return result;
        //         } else {
        //             return result;
        //         }
        //     }
        // }
        //bounds = this.adjustContentLayoutArea(bounds);
        this.drawCellBackground(graphics, bounds);
        const textPen: PdfPen = null;
        const textBrush: PdfBrush = new PdfSolidBrush(this.style.fontColor);
        let font: PdfFont = null;
        if (this.row.isParentRow) {
            let fontStyle: PdfFontStyle = PdfFontStyle.Bold;
            if (this.style.fontStyle) {
                fontStyle = this.style.fontStyle;
            }
            font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, fontStyle);
        } else {
            font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, this.style.fontStyle);
        }
        if (this.row.treegrid.ganttStyle.font) {
            font = this.row.treegrid.ganttStyle.font;
        }
        let innerLayoutArea: RectangleF = bounds;
        if (!this.isHeaderCell) {
            /* eslint-disable-next-line */
            innerLayoutArea.x = innerLayoutArea.x;
            /* eslint-disable-next-line */
            innerLayoutArea.width = innerLayoutArea.width;
        }
        if (innerLayoutArea.height >= graphics.clientSize.height) {
            // To break row to next page
            if (this.row.treegrid.allowRowBreakAcrossPages) {
                innerLayoutArea.height -= innerLayoutArea.y;
                bounds.height -= bounds.y;
            } else {
                innerLayoutArea.height = graphics.clientSize.height;
                bounds.height = graphics.clientSize.height;
            }
        }
        innerLayoutArea = this.adjustContentLayoutArea(innerLayoutArea);
        if (this.image && this.value) {
            let imageBounds: RectangleF;
            if (this.image.width <= innerLayoutArea.width) {
                imageBounds = new RectangleF(innerLayoutArea.x, innerLayoutArea.y, this.image.width, this.image.height);
            }
            else {
                imageBounds = innerLayoutArea;
            }
            graphics.drawImage(this.image, imageBounds.x, imageBounds.y - 5, imageBounds.width, imageBounds.height);
            let temp: string = null;
            // font = new PdfStandardFont(this.row.treegrid.ganttStyle.fontFamily, this.style.fontSize, this.style.fontStyle);
            let customisedFont: PdfFont;
            let fontStyles: PdfGanttCellStyle = this.fontStyle;
            if (!fontStyles) {
                fontStyles = this.style;
            }
            const newFont: PdfStandardFont = new PdfStandardFont(
                fontStyles.fontFamily, fontStyles.fontSize, fontStyles.fontStyle);
            if (fontStyles.fontFamily) {
                customisedFont = newFont;
            }
            else {
                customisedFont = font;
            }
            let customisedBrush: PdfBrush = textBrush;
            if (this.row.treegrid.ganttStyle.cell.fontBrush) {
                customisedBrush = new PdfSolidBrush(this.row.treegrid.ganttStyle.cell.fontBrush);
            }
            if (this.row.treegrid.ganttStyle.cell.format.alignment && !this.isHeaderCell) {
                this.style.format.alignment = this.row.treegrid.ganttStyle.cell.format.alignment;
            }
            if (this.finishedDrawingCell) {
                temp = (this.remainingString === '') ? this.remainingString : this.value as string;
                /* eslint-disable-next-line */
                graphics.drawString(temp, customisedFont, textPen, customisedBrush, (innerLayoutArea.x + leftAdjustment) + (!isNullOrUndefined(this.image) ? this.image.width : 0), this.isHeaderCell ? innerLayoutArea.y - 16 : innerLayoutArea.y, (innerLayoutArea.width - leftAdjustment - padding), (innerLayoutArea.height - padding), this.style.format);
            } else {
                /* eslint-disable-next-line */
                graphics.drawString(this.remainingString, customisedFont, textPen, customisedBrush, (innerLayoutArea.x + leftAdjustment), this.isHeaderCell ? innerLayoutArea.y - 16 : innerLayoutArea.y, this.style.format);
            }
            result = graphics.stringLayoutResult;
        }
        else if (typeof this.value === 'string' || typeof this.remainingString === 'string') {
            let temp: string = null;
            let customisedFont: PdfFont;
            const newFont: PdfStandardFont = new PdfStandardFont(
                this.style.fontFamily, this.style.fontSize, this.style.fontStyle);
            if (this.style.fontFamily) {
                customisedFont = newFont;
            }
            else {
                customisedFont = font;
            }
            let customisedBrush: PdfBrush = textBrush;
            if (this.row.treegrid.ganttStyle.cell.fontBrush) {
                customisedBrush = new PdfSolidBrush(this.row.treegrid.ganttStyle.cell.fontBrush);
            }
            if (this.row.treegrid.ganttStyle.cell.format.alignment && !this.isHeaderCell) {
                this.style.format.alignment = this.row.treegrid.ganttStyle.cell.format.alignment;
            }
            if (this.finishedDrawingCell) {
                temp = (this.remainingString === '') ? this.remainingString : this.value as string;
                /* eslint-disable-next-line */
                graphics.drawString(temp, customisedFont, textPen, customisedBrush, (innerLayoutArea.x + leftAdjustment), this.isHeaderCell ? innerLayoutArea.y - 16 : innerLayoutArea.y - 3, (innerLayoutArea.width - leftAdjustment - padding), (innerLayoutArea.height - padding), this.style.format);
            } else {
                /* eslint-disable-next-line */
                graphics.drawString(this.remainingString, customisedFont, textPen, customisedBrush, (innerLayoutArea.x + leftAdjustment), this.isHeaderCell ? innerLayoutArea.y - 16 : innerLayoutArea.y, this.style.format);
            }
            result = graphics.stringLayoutResult;
        }
        else if (this.value instanceof PdfImage || this.value instanceof PdfBitmap) {
            let imageBounds: RectangleF;
            if (this.value.width <= innerLayoutArea.width) {
                imageBounds = new RectangleF(innerLayoutArea.x, innerLayoutArea.y, this.value.width, innerLayoutArea.height);
            }
            else {
                imageBounds = innerLayoutArea;
            }
            graphics.drawImage(this.value, imageBounds.x, imageBounds.y - 10, imageBounds.width, imageBounds.height);
        }
        else if (this.value instanceof PdfTextWebLink) {
            this.value.draw(graphics.currentPage, innerLayoutArea);
        }
        if (this.style.borders !== null) {
            this.drawCellBorder(graphics, bounds);
        }
        return result;
    }

    /**
     * Draw the `cell background`.
     *
     * @param {PdfGraphics} graphics .
     * @param {RectangleF} bounds .
     * @returns {void} .
     * @private
     */
    public drawCellBackground(graphics: PdfGraphics, bounds: RectangleF): void {
        const backgroundBrush: PdfBrush = new PdfSolidBrush(this.style.backgroundColor);
        if (backgroundBrush !== null) {
            graphics.save();
            graphics.drawRectangle(backgroundBrush, bounds.x, bounds.y, bounds.width, bounds.height);
            graphics.restore();
        }
        // if (this.style.backgroundImage !== null) {
        //     let image: PdfImage = this.getBackgroundImage();
        //     graphics.drawImage(this.style.backgroundImage, bounds.x, bounds.y, bounds.width, bounds.height);
        // }
    }

    /**
     * `Adjusts the text layout area`.
     *
     * @param {RectangleF} bounds .
     * @returns {RectangleF} .
     * @private
     */
    private adjustContentLayoutArea(bounds: RectangleF): RectangleF {
        //Add Padding value to its Cell Bounds
        const returnBounds: RectangleF = new RectangleF(new PointF(bounds.x, bounds.y), new SizeF(bounds.width, bounds.height));
        const cellPadding: PdfPaddings = this.style.padding;
        if (this.value instanceof PdfTreeGrid) {
            const size: SizeF = (this.value as PdfTreeGrid).size;
            if (this.style.format.alignment === PdfTextAlignment.Center) {
                returnBounds.x += cellPadding.left + (returnBounds.width - size.width) / 2;
                returnBounds.y += cellPadding.top + (returnBounds.height - size.height) / 2;
            } else if (this.style.format.alignment === PdfTextAlignment.Left) {
                returnBounds.x += cellPadding.left;
                returnBounds.y += cellPadding.top;
            } else if (this.style.format.alignment === PdfTextAlignment.Right) {
                returnBounds.x += cellPadding.left + (returnBounds.width - size.width);
                returnBounds.y += cellPadding.top;
            }
        } else {
            returnBounds.x += cellPadding.left;
            returnBounds.y += cellPadding.top;
        }
        return returnBounds;
    }

    /**
     * @param {PdfGraphics} graphics .
     * @param {RectangleF} bounds .
     * @returns {void} .
     * @private
     */
    private drawCellBorder(graphics: PdfGraphics, bounds: RectangleF): void {
        if (this.row.treegrid.style.borderOverlapStyle === PdfBorderOverlapStyle.Inside) {
            bounds.x += this.style.borders.left.width;
            bounds.y += this.style.borders.top.width;
            bounds.width -= this.style.borders.right.width;
            bounds.height -= this.style.borders.bottom.width;
        }
        if (this.style.borders.isAll && this.isHeaderCell) {
            graphics.drawRectangle(this.style.borders.left, bounds.x, bounds.y, bounds.width, bounds.height);
            graphics.restore();
            return;
        } else {
            let p1: PointF = new PointF(bounds.x, bounds.y + bounds.height);
            let p2: PointF = new PointF(bounds.x, bounds.y);
            let pen: PdfPen = this.style.borders.left;
            pen.lineCap = (this.style.borders.left.dashStyle === PdfDashStyle.Solid) ? PdfLineCap.Square : pen.lineCap;
            graphics.drawLine(pen, p1, p2);
            graphics.restore();
            p1 = new PointF(bounds.x + bounds.width, bounds.y);
            p2 = new PointF(bounds.x + bounds.width, bounds.y + bounds.height);
            pen = this.style.borders.right;
            if ((bounds.x + bounds.width) > (graphics.clientSize.width - (pen.width / 2))) {
                p1 = new PointF(graphics.clientSize.width - (pen.width / 2), bounds.y);
                p2 = new PointF(graphics.clientSize.width - (pen.width / 2), bounds.y + bounds.height);
            }
            pen.lineCap = (this.style.borders.right.dashStyle === PdfDashStyle.Solid) ? PdfLineCap.Square : pen.lineCap;
            graphics.drawLine(pen, p1, p2);
            graphics.restore();
            p1 = new PointF(bounds.x, bounds.y);
            p2 = new PointF(bounds.x + bounds.width, bounds.y);
            pen = this.style.borders.top;
            pen.lineCap = (this.style.borders.top.dashStyle === PdfDashStyle.Solid) ? PdfLineCap.Square : pen.lineCap;
            graphics.drawLine(pen, p1, p2);
            graphics.restore();
            p1 = new PointF(bounds.x + bounds.width, bounds.y + bounds.height);
            p2 = new PointF(bounds.x, bounds.y + bounds.height);
            pen = this.style.borders.bottom;
            if (bounds.y + bounds.height > graphics.clientSize.height - pen.width / 2) {
                p1 = new PointF(bounds.x + bounds.width, graphics.clientSize.height - pen.width / 2);
                p2 = new PointF(bounds.x, graphics.clientSize.height - pen.width / 2);
            }
            pen.lineCap = (this.style.borders.bottom.dashStyle === PdfDashStyle.Solid) ? PdfLineCap.Square : pen.lineCap;
            graphics.drawLine(pen, p1, p2);
            graphics.restore();
        }
    }
}
/**
 * `PdfTreeGridCellCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfTreeGridCell' objects.
 *
 * @private
 */
export class PdfTreeGridCellCollection {
    //Fields
    /**
     * @private
     */
    private treegridRow: PdfTreeGridRow;
    /**
     * @private
     */
    private cells: PdfTreeGridCell[];
    //Constructor
    /**
     * Initializes a new instance of the `PdfGridCellCollection` class with the row.
     *
     * @param { PdfTreeGridRow} row .
     * @private
     */
    public constructor(row: PdfTreeGridRow) {
        this.treegridRow = row;
        this.cells = [];
    }
    //Properties
    /**
     * Gets the current `cell`.
     *
     * @param {number} index .
     * @returns {PdfTreeGridCell} .
     * @private
     */
    public getCell(index: number): PdfTreeGridCell {
        if (index < 0 || index >= this.count) {
            throw new Error('IndexOutOfRangeException');
        }
        return this.cells[index as number];
    }
    /**
     * Gets the cells `count`.[Read-Only].
     *
     * @returns {number} .
     * @private
     */
    public get count(): number {
        return this.cells.length;
    }
    //Implementation
    /**
     * `Adds` this instance.
     *
     * @param {PdfTreeGridCell} cell .
     * @returns {PdfTreeGridCell | void} .
     * @private
     */
    public add(cell?: PdfTreeGridCell): PdfTreeGridCell | void {
        if (typeof cell === 'undefined') {
            const tempcell: PdfTreeGridCell = new PdfTreeGridCell();
            this.add(tempcell);
            return cell;
        } else {
            cell.row = this.treegridRow;
            this.cells.push(cell);
        }
    }
    /**
     * Returns the `index of` a particular cell in the collection.
     *
     * @param {PdfTreeGridCell} cell .
     * @returns {number} .
     * @private
     */
    public indexOf(cell: PdfTreeGridCell): number {
        return this.cells.indexOf(cell);
    }
}
/**
 *
 */
export class PdfTreeGridRow {
    private treegridCells: PdfTreeGridCellCollection;
    private pdfTreeGrid: PdfTreeGrid;
    private treegridRowOverflowIndex: number = 0;
    private treegridRowBreakHeight: number;
    private rowHeight: number = 0;
    private rowWidth: number = 0;
    /* eslint-disable-next-line */
    private _isParentRow = false;
    private intendLevel: number = 0;
    /**
     * The `Maximum span` of the row.
     *
     * @public
     */
    public maximumRowSpan: number;

    constructor(treegrid: PdfTreeGrid) {
        this.pdfTreeGrid = treegrid;
    }

    public get cells(): PdfTreeGridCellCollection {
        if (isNullOrUndefined(this.treegridCells)) {
            this.treegridCells = new PdfTreeGridCellCollection(this);
        }
        return this.treegridCells;
    }

    public get isParentRow(): boolean {
        return this._isParentRow;
    }

    public set isParentRow(value: boolean) {
        this._isParentRow = value;
    }

    public get treegrid(): PdfTreeGrid {
        return this.pdfTreeGrid;
    }
    public set treegrid(value: PdfTreeGrid) {
        this.pdfTreeGrid = value;
    }

    /**
     * `Height` of the row yet to be drawn after split.
     *
     * @returns {number} .
     * @private
     */
    public get rowBreakHeight(): number {
        if (typeof this.treegridRowBreakHeight === 'undefined') {
            this.treegridRowBreakHeight = 0;
        }
        return this.treegridRowBreakHeight;
    }
    public set rowBreakHeight(value: number) {
        this.treegridRowBreakHeight = value;
    }
    /**
     * `over flow index` of the row.
     *
     * @returns {number} .
     * @private
     */
    public get rowOverflowIndex(): number {
        return this.treegridRowOverflowIndex;
    }
    public set rowOverflowIndex(value: number) {
        this.treegridRowOverflowIndex = value;
    }
    public get level(): number {
        return this.intendLevel;
    }
    public set level(value: number) {
        this.intendLevel = value;
    }

    /**
     * Gets or sets the `height` of the row.
     *
     * @returns {number} .
     * @private
     */
    public get height(): number {
        if (this.rowHeight === 0) {
            this.rowHeight = this.measureHeight();
        }
        return this.rowHeight;
    }
    public set height(value: number) {
        this.rowHeight = value;
    }
    /**
     * Gets or sets the `width` of the row.
     *
     * @returns {number} .
     * @private
     */
    public get width(): number {
        if (this.rowWidth === 0) {
            this.rowWidth = this.measureWidth();
        }
        return this.rowWidth;
    }
    public get rowIndex(): number {
        return this.treegrid.rows.rowCollection.indexOf(this);
    }

    private measureWidth(): number {
        const columns: PdfTreeGridColumn[] = this.treegrid.columns.columns;
        let totalWidth: number = 0;
        for (let i: number = 0; i < columns.length; i++) {
            const column: PdfTreeGridColumn = columns[i as number];
            totalWidth += column.width;
        }
        return totalWidth;
    }

    private measureHeight(): number {
        let rowHeight: number = (this.cells.count !== 0 &&
            !isNullOrUndefined(this.cells.getCell(0).height)) ? this.cells.getCell(0).height : 33;
        for (let i: number = 0; i < this.cells.count; i++) {
            const cell: PdfTreeGridCell = this.cells.getCell(i);
            if (cell.columnSpan === 1 || cell.rowSpan === 1) {
                rowHeight = Math.max(rowHeight, cell.height);
            } else {
                rowHeight = Math.min(rowHeight, cell.height);
            }
            cell.height = rowHeight;
        }
        return rowHeight;
    }
}
/**
 * `PdfTreeGridRowCollection` class provides access to an ordered, strongly typed collection of 'PdfTreeGridRow' objects.
 *
 * @private
 */
export class PdfTreeGridRowCollection {
    // Fields
    /**
     * @private
     */
    private treegrid: PdfTreeGrid;
    /**
     * The row collection of the `treegrid`.
     *
     * @private
     */
    private rows: PdfTreeGridRow[];
    // Constructor
    /**
     * Initializes a new instance of the `PdfTreeGridRowCollection` class with the parent grid.
     *
     * @param {PdfTreeGrid} treegrid .
     * @private
     */
    public constructor(treegrid: PdfTreeGrid) {
        this.rows = [];
        this.treegrid = treegrid;
    }
    //Properties
    /**
     * Gets the number of header in the `PdfTreeGrid`.[Read-Only].
     *
     * @returns {number} .
     * @private
     */
    public get count(): number {
        return this.rows.length;
    }
    //Implementation
    /**
     * Return the row collection of the `treegrid`.
     *
     * @returns {PdfTreeGridRow[]} .
     * @private
     */
    public get rowCollection(): PdfTreeGridRow[] {
        return this.rows;
    }
    public addRow(): PdfTreeGridRow;
    public addRow(row: PdfTreeGridRow): void;
    public addRow(row?: PdfTreeGridRow): void | PdfTreeGridRow {
        if (typeof row === 'undefined') {
            const row: PdfTreeGridRow = new PdfTreeGridRow(this.treegrid);
            this.addRow(row);
            return row;
        } else {
            if (row.cells.count === 0) {
                for (let i: number = 0; i < this.treegrid.columns.count; i++) {
                    row.cells.add(new PdfTreeGridCell());
                }
            }
            this.rows.push(row);
        }
    }
    /**
     * Return the row by index.
     *
     * @param {number} index .
     * @returns {PdfTreeGridRow} .
     * @private
     */
    public getRow(index: number): PdfTreeGridRow {
        return this.rows[index as number];
    }
}
/**
 * `PdfTreeGridHeaderCollection` class provides customization of the settings for the header.
 *
 * @private
 */
export class PdfTreeGridHeaderCollection {
    /**
     * The `treegrid`.
     *
     * @returns {PdfTreeGrid} .
     * @private
     */
    private treegrid: PdfTreeGrid;
    /**
     * The array to store the `rows` of the grid header.
     *
     * @returns {PdfTreeGridRow[]} .
     * @private
     */
    private rows: PdfTreeGridRow[] = [];
    //constructor
    /**
     * Initializes a new instance of the `PdfTreeGridHeaderCollection` class with the parent grid.
     *
     * @param {PdfTreeGrid} treegrid .
     * @private
     */
    public constructor(treegrid: PdfTreeGrid) {
        this.treegrid = treegrid;
        this.rows = [];
    }
    //Properties
    /**
     * Gets a 'PdfTreeGridRow' object that represents the `header` row in a 'PdfGridHeaderCollection' control.[Read-Only].
     *
     * @param {number} index .
     * @returns {PdfTreeGridRow} .
     * @private
     */
    public getHeader(index: number): PdfTreeGridRow {
        return (this.rows[index as number]);
    }
    /**
     * Gets the `number of header` in the 'PdfGrid'.[Read-Only]
     *
     * @returns {number} .
     * @private
     */
    public get count(): number {
        return this.rows.length;
    }
    //Implementation
    /**
     * `Adds` the specified row.
     *
     * @param {PdfTreeGridRow} row .
     * @returns {void} .
     * @private
     */
    public add(row: PdfTreeGridRow): void {
        this.rows.push(row);
    }
    public indexOf(row: PdfTreeGridRow): number {
        return this.rows.indexOf(row);
    }
}

export class PdfTreeGridColumn {
    private treegrid: PdfTreeGrid;
    private columnWidth: number = 0;
    private stringFormat: PdfStringFormat;
    private treeColumnIndex: boolean = false;
    private _headerText: string = '';
    private _field: string = '';
    constructor(treegrid: PdfTreeGrid) {
        this.treegrid = treegrid;
    }
    public get headerText(): string {
        return this._headerText;
    }
    public set headerText(value: string) {
        this._headerText = value;
    }
    public get field(): string {
        return this._field;
    }
    public set field(value: string) {
        this._field = value;
    }
    public get width(): number {
        return this.columnWidth;
    }
    public set width(value: number) {
        this.columnWidth = value;
    }
    public get isTreeColumn(): boolean {
        return this.treeColumnIndex;
    }
    public set isTreeColumn(value: boolean) {
        this.treeColumnIndex = value;
    }
    /**
     * Gets or sets the information about the text `formatting`.
     *
     * @returns {PdfStringFormat} .
     * @private
     */
    public get format(): PdfStringFormat {
        if (isNullOrUndefined(this.stringFormat)) {
            this.stringFormat = new PdfStringFormat(); //GetDefaultFormat();
        }
        return this.stringFormat;
    }
    public set format(value: PdfStringFormat) {
        this.stringFormat = value;
    }
}
/**
 * `PdfTreeGridColumnCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfTreeGridColumn' objects.
 *
 * @private
 */
export class PdfTreeGridColumnCollection {
    //Fields
    /**
     * @private
     */
    private treegrid: PdfTreeGrid;
    /**
     * @private
     */
    private internalColumns: PdfTreeGridColumn[] = [];
    /**
     * @private
     */
    public columnWidth: number = 0;
    //properties
    //Constructors
    /**
     * Initializes a new instance of the `PdfTreeGridColumnCollection` class with the parent grid.
     *
     * @param { PdfTreeGrid} treegrid .
     * @private
     */
    public constructor(treegrid: PdfTreeGrid) {
        this.treegrid = treegrid;
        this.internalColumns = [];
    }
    //Implementation
    /**
     * `Add` a new column to the 'PdfGrid'.
     *
     * @param {number} count .
     * @returns {void} .
     * @private
     */
    public add(count: number): void {
        // public add(column : PdfGridColumn) : void
        // public add(arg : number|PdfGridColumn) : void {
        // if (typeof arg === 'number') {
        for (let i: number = 0; i < count; i++) {
            this.internalColumns.push(new PdfTreeGridColumn(this.treegrid));
            for (let index: number = 0; index < this.treegrid.rows.count; index++) {
                const row: PdfTreeGridRow = this.treegrid.rows.getRow(index);
                const cell: PdfTreeGridCell = new PdfTreeGridCell();
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
     *
     * @returns {number} .
     * @private
     */
    public get count(): number {
        return this.internalColumns.length;
    }
    /**
     * Gets the `widths`.
     *
     * @returns {number} .
     * @private
     */
    public get width(): number {
        if (this.columnWidth === 0) {
            this.columnWidth = this.measureColumnsWidth();
        }
        return this.columnWidth;
    }
    /**
     * Gets the `array of PdfGridColumn`.[Read-Only]
     *
     * @returns {PdfTreeGridColumn[]} .
     * @private
     */
    public get columns(): PdfTreeGridColumn[] {
        return this.internalColumns;
    }
    /**
     * Gets the `PdfTreeGridColumn` from the specified index.[Read-Only]
     *
     * @param {number} index .
     * @returns {PdfTreeGridColumn} .
     * @private
     */
    public getColumn(index: number): PdfTreeGridColumn {
        if (index >= 0 && index <= this.columns.length) {
            return this.columns[index as number];
        } else {
            throw Error('can not get the column from the index: ' + index);
        }
    }
    //Implementation
    /**
     * `Calculates the column widths`.
     *
     * @returns {number} .
     * @private
     */
    public measureColumnsWidth(): number {
        let totalWidth: number = 0;
        this.treegrid.measureColumnsWidth();
        for (let i: number = 0, count: number = this.internalColumns.length; i < count; i++) {
            totalWidth += this.internalColumns[i as number].width;
        }
        return totalWidth;
    }
    /**
     * Gets the `widths of the columns`.
     *
     * @param {number} totalWidth .
     * @returns {number} .
     * @private
     */
    public getDefaultWidths(totalWidth: number): number[] {
        const widths: number[] = [];
        let subFactor: number = this.count;
        for (let i: number = 0; i < this.count; i++) {
            widths[i as number] = this.internalColumns[i as number].width;
            if (this.internalColumns[i as number].width > 0) {
                totalWidth -= this.internalColumns[i as number].width;
                subFactor--;
            } else {
                widths[i as number] = 0;
            }
        }
        for (let i: number = 0; i < this.count; i++) {
            const width: number = totalWidth / subFactor;
            if (widths[i as number] <= 0) {
                widths[i as number] = width;
            }
        }
        return widths;
    }
}
