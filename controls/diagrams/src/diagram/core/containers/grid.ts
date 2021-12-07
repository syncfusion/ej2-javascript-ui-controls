/* eslint-disable no-self-assign */
import { DiagramElement } from '../elements/diagram-element';
import { Canvas } from './canvas';
import { Container } from './container';
import { Size } from '../../primitives/size';
import { ShapeStyleModel } from '../appearance-model';
import { randomId } from '../../utility/base-util';
import { TextElement } from '../elements/text-element';

/**
 * Grid panel is used to arrange the children in a table like structure
 */
export class GridPanel extends Container {

    private childTable: GridCellItem[] = [];

    /**
     * rowDefinitions method \
     *
     * @returns { RowDefinition[] } columnDefinitions method .\
     *
     * @private
     */
    public rowDefinitions(): RowDefinition[] {
        return this.rowDefns;
    }

    private rowDefns: RowDefinition[];

    /**
     * columnDefinitions method \
     *
     * @returns { ColumnDefinition[] } columnDefinitions method .\
     *
     * @private
     */
    public columnDefinitions(): ColumnDefinition[] {
        return this.colDefns;
    }

    private colDefns: ColumnDefinition[];

    /** @private */
    public rows: GridRow[];

    public cellStyle: ShapeStyleModel = {};

    private desiredRowHeight: number[] = [];

    private desiredCellWidth: number[] = [];

    public addObject(obj: DiagramElement, rowId?: number, columnId?: number, rowSpan?: number, columnSpan?: number): void {
        //check if exists
        if (this.rows.length >= rowId) {
            const row: GridRow = this.rows[rowId];
            if (row.cells.length > columnId) {
                columnSpan = columnSpan || 1;
                rowSpan = rowSpan || 1;
                const cell: GridCell = row.cells[columnId];
                cell.columnSpan = Math.max(columnSpan, cell.columnSpan);
                cell.rowSpan = Math.max(rowSpan, cell.rowSpan);
                let object: GridCellItem = new GridCellItem();
                object = obj as GridCellItem;
                object.rowId = rowId;
                object.columnId = columnId;
                object.columnSpan = columnSpan;
                this.childTable[object.id] = object as GridCellItem;
                this.addObjectToCell(object, cell);
            }
        }
    }

    // public setCellStyle(rowId: number, columnId: number, cellStyle: ShapeStyleModel): void {
    //     if (this.rows.length > rowId) {
    //         let row: GridRow = this.rows[rowId];
    //         if (row.cells.length > columnId) {
    //             let cell: GridCell = row.cells[columnId];
    //             cell.style = cellStyle;
    //         }
    //     }
    // }

    // public getRowId(obj: DiagramElement): number {
    //     return (this.childTable[obj.id] as GridCellItem).rowId;
    // }

    // public getColumnId(obj: DiagramElement): number {
    //     return (this.childTable[obj.id] as GridCellItem).columnId;
    // }

    // public getRowSpan(obj: DiagramElement): number {
    //     return (this.childTable[obj.id] as GridCellItem).rowSpan;
    // }

    // public getColumnSpan(obj: DiagramElement): number {
    //     return (this.childTable[obj.id] as GridCellItem).columnSpan;
    // }

    private addObjectToCell(obj: DiagramElement, cell: GridCell): void {
        if (!cell.children) { cell.children = []; }
        // obj.minWidth = cell.desiredCellWidth; obj.minHeight = cell.desiredCellHeight;
        obj.style.strokeColor = 'black';
        obj.style.strokeWidth = 1;
        obj.style.fill = 'white';
        cell.children.push(obj);
    }

    /**
     * updateProperties method \
     *
     * @returns { void } updateProperties method .\
     * @param {number} offsetX - provide the Connector value.
     * @param {number} offsetY - provide the Connector value.
     * @param {number} width - provide the Connector value.
     * @param {number} height - provide the Connector value.
     *
     * @private
     */
    public updateProperties(offsetX: number, offsetY: number, width: number, height: number): void {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    /**
     * setDefinitions method \
     *
     * @returns { void } setDefinitions method .\
     * @param {RowDefinition[]} rows - provide the rows value.
     * @param {ColumnDefinition[]} columns - provide the Connector value.
     *
     * @private
     */
    public setDefinitions(rows: RowDefinition[], columns: ColumnDefinition[]): void {
        this.rowDefns = rows;
        this.colDefns = columns;
        this.children = [];
        this.rows = this.rows || [];
        for (let i: number = 0; i < rows.length; i++) {
            const rowDefn: RowDefinition = rows[i];
            const row: GridRow = new GridRow();
            row.cells = [];
            const defaultCell: ColumnDefinition = new ColumnDefinition();
            //replace this 100 with a proper property
            defaultCell.width = this.width;
            let columns: ColumnDefinition[] = this.colDefns;
            if (columns === undefined || columns.length < 1) {
                columns = [defaultCell];
            }
            this.addCellInRow(columns, rowDefn, row);
            this.rows.push(row);
        }
    }

    /**
     * addCellInRow method \
     *
     * @returns { void } addCellInRow method .\
     * @param {ColumnDefinition[]} columns - provide the rows value.
     * @param {RowDefinition} rowDefn - provide the Connector value.
     * @param {GridRow} row - provide the Connector value.
     *
     * @private
     */
    private addCellInRow(columns: ColumnDefinition[], rowDefn: RowDefinition, row: GridRow): void {
        for (let j: number = 0; j < columns.length; j++) {
            const colDefn: ColumnDefinition = columns[j];
            const cell: GridCell = new GridCell();
            cell.children = [];
            this.cellStyle.fill = 'none';
            this.cellStyle.strokeColor = 'none';
            cell.id = randomId();
            cell.style = this.cellStyle;
            cell.desiredCellWidth = cell.minWidth = colDefn.width;
            cell.desiredCellHeight = cell.minHeight = rowDefn.height;
            row.cells.push(cell);
            this.children.push(cell);
        }
    }

    /**
     * calculateSize method \
     *
     * @returns { void } calculateSize method .\
     *
     * @private
     */
    private calculateSize(): void {
        const rows: GridRow[] = this.rows || [];
        let calculateHeight: number = 0;
        let calculateWidth: number = 0;
        for (let i: number = 0; i < rows.length; i++) {
            const row: GridRow = this.rows[i]; calculateWidth = 0;
            for (let j: number = 0; j < row.cells.length; j++) {
                calculateWidth += row.cells[j].desiredCellWidth;
                if (j === row.cells.length - 1) {
                    if (this.width && this.width !== calculateWidth) {
                        row.cells[j].desiredCellWidth += (this.width - calculateWidth);
                        row.cells[j].minWidth = row.cells[j].desiredCellWidth;
                        if (row.cells[j].children && row.cells[j].children.length) {
                            row.cells[j].children[0].width = row.cells[j].desiredCellWidth;
                        }
                        this.colDefns[j].width = row.cells[j].desiredCellWidth;
                    }
                    calculateHeight += row.cells[j].desiredCellHeight;
                    if (i === rows.length - 1) {
                        if (this.height && this.height !== calculateHeight) {
                            const height: number = (this.height - calculateHeight);
                            if (height > 0) {
                                for (let k: number = 0; k < row.cells.length; k++) {
                                    row.cells[k].desiredCellHeight += height;
                                    row.cells[k].minHeight = row.cells[k].desiredCellHeight = row.cells[k].desiredCellHeight;
                                    if (row.cells[k].children && row.cells[k].children.length) {
                                        row.cells[k].children[0].height = row.cells[k].desiredCellHeight;
                                    }
                                }
                                this.rowDefns[i].height += height;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * updateRowHeight method \
     *
     * @returns { void } updateRowHeight method .\
     * @param {number} rowId - provide the rows value.
     * @param {number} height - provide the Connector value.
     * @param {boolean} isConsiderChild - provide the Connector value.
     * @param {number} padding - provide the Connector value.
     *
     * @private
     */
    public updateRowHeight(rowId: number, height: number, isConsiderChild: boolean, padding?: number): void {
        const row: GridRow = this.rows[rowId];
        this.rowDefns[rowId].height = height;
        if (this.height !== undefined) {
            this.height += height - row.cells[0].desiredCellHeight;
        }
        for (let i: number = 0; i < row.cells.length; i++) {
            row.cells[i].desiredCellHeight = row.cells[i].minHeight = height;
            if (row.cells[i].children && row.cells[i].children.length) {
                row.cells[i].children[0].height = height;
                this.setTextRefresh(row.cells[i].children[0] as Canvas);

            }

        }
        this.desiredRowHeight[rowId] = height;
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
        if (isConsiderChild) {
            const minHeight: number = (padding !== undefined) ? this.calculateCellHeightBasedOnChildren(rowId, padding) :
                this.calculateCellHeight(rowId);
            if (minHeight > height) {
                this.updateRowHeight(rowId, minHeight, false);
            }
        }
    }

    private setTextRefresh(canvas: Canvas): void {
        if (canvas.children && canvas.children.length) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const children: object[] = canvas.children;
            for (let i: number = 0; i < children.length; i++) {
                if (children[i] instanceof TextElement) {
                    (children[i] as TextElement).refreshTextElement();
                }
                if (children[i] instanceof Canvas) {
                    this.setTextRefresh(children[i] as Canvas);
                }
            }
        }
    }

    /**
     * updateColumnWidth method \
     *
     * @returns { void } updateColumnWidth method .\
     * @param {number} colId - provide the rows value.
     * @param {number} width - provide the Connector value.
     * @param {boolean} isConsiderChild - provide the Connector value.
     * @param {number} padding - provide the Connector value.
     *
     * @private
     */
    public updateColumnWidth(colId: number, width: number, isConsiderChild: boolean, padding?: number): void {
        this.colDefns[colId].width = width;
        if (this.width !== undefined) {
            this.width += width - this.rows[this.rows.length - 1].cells[colId].desiredCellWidth;
        }
        for (let i: number = 0; i < this.rows.length; i++) {
            this.setTextRefresh(this.rows[i].cells[0]);
            this.rows[i].cells[colId].desiredCellWidth = this.rows[i].cells[colId].minWidth = width;
            if (this.rows[i].cells[colId].children && this.rows[i].cells[colId].children.length) {
                this.rows[i].cells[colId].children[0].width = width;
            }
        }
        this.desiredCellWidth[colId] = width;
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
        if (isConsiderChild) {
            const minWidth: number = (padding !== undefined) ? this.calculateCellWidthBasedOnChildren(colId, padding) :
                this.calculateCellWidth(colId);
            if (minWidth > width) {
                this.updateColumnWidth(colId, minWidth, false);
            }
        }
    }

    private calculateCellWidth(colIndex: number): number {
        let maxWidth: number; let width: number; let cell: GridCell;
        for (let i: number = 0; i < this.rows.length; i++) {
            cell = this.rows[i].cells[colIndex];
            if (cell.columnSpan === 1) {
                width = (cell.outerBounds.width > cell.bounds.width &&
                    (cell.children.length === 0 || cell.children[0].maxWidth === undefined)) ? cell.outerBounds.width : cell.bounds.width;
                if (maxWidth) {
                    maxWidth = (maxWidth < width) ? width : maxWidth;
                } else {
                    maxWidth = width;
                }
            }
        }
        return maxWidth;
    }

    private calculateCellHeight(rowIndex: number): number {
        let maxHeight: number; let height: number; let cell: GridCell;
        const row: GridRow = this.rows[rowIndex];
        for (let i: number = 0; i < row.cells.length; i++) {
            cell = row.cells[i];
            height = (cell.outerBounds.height > cell.bounds.height) ? cell.outerBounds.height : cell.bounds.height;
            if (maxHeight) {
                maxHeight = (maxHeight < height) ? height : maxHeight;
            } else {
                maxHeight = height;
            }
        }
        return maxHeight;
    }

    private calculateCellSizeBasedOnChildren(cell: GridCell, option: string, padding: number, maxSize: number): number {
        let maxBounds: number;
        const canvas: Canvas = (cell && cell.children.length > 0) ? cell.children[0] as Canvas : undefined;
        if (canvas && cell.columnSpan === 1) {
            maxBounds = (option === 'Width') ? canvas.bounds.right : canvas.bounds.bottom;
            if (!maxSize) {
                maxSize = (option === 'Width') ? canvas.bounds.width : canvas.bounds.height;
            }
            for (let j: number = 0; j < canvas.children.length; j++) {
                const children: Canvas = canvas.children[j] as Canvas;
                if (children instanceof Canvas) {
                    if (children.id.indexOf('header') === -1) {
                        const bounds: number = ((option === 'Width') ? children.bounds.right : children.bounds.bottom) + padding;
                        if (bounds > maxBounds) {
                            const size: number = (bounds - maxBounds) + ((option === 'Width') ? canvas.bounds.width : canvas.bounds.height);
                            if (maxSize) {
                                maxSize = (maxSize < size) ? size : maxSize;
                            }
                        }
                    }
                }
            }
        }
        return maxSize;
    }

    private calculateCellWidthBasedOnChildren(colIndex: number, padding?: number): number {
        let maxWidth: number; //let width: number;  let maxBounds: number; let canvas: Canvas;
        let cell: GridCell;
        for (let i: number = 0; i < this.rows.length; i++) {
            cell = this.rows[i].cells[colIndex];
            maxWidth = this.calculateCellSizeBasedOnChildren(cell, 'Width', padding, maxWidth);
        }
        return maxWidth;
    }

    private calculateCellHeightBasedOnChildren(rowIndex: number, padding?: number): number {
        let maxHeight: number;
        let cell: GridCell;
        // let maxBounds: number; let canvas: Canvas;
        const row: GridRow = this.rows[rowIndex];
        for (let i: number = 0; i < row.cells.length; i++) {
            cell = row.cells[i];
            maxHeight = this.calculateCellSizeBasedOnChildren(cell, 'Height', padding, maxHeight);
        }
        return maxHeight;
    }

    /**
     * addRow method \
     *
     * @returns { void } addRow method .\
     * @param {number} rowId - provide the rowId value.
     * @param {number} rowDefn - provide the rowDefn value.
     * @param {boolean} isMeasure - provide the isMeasure value.
     *
     * @private
     */
    public addRow(rowId: number, rowDefn: RowDefinition, isMeasure: boolean): void {
        if (this.rowDefns.length > 0) {
            this.rowDefns.splice(rowId, 0, rowDefn);
        } else {
            this.rowDefns.push(rowDefn);
        }
        const row: GridRow = new GridRow();
        row.cells = [];
        const defaultCell: ColumnDefinition = new ColumnDefinition();
        defaultCell.width = this.width;
        const columns: ColumnDefinition[] = this.colDefns;
        this.addCellInRow(columns, rowDefn, row);
        if (rowId > this.rows.length - 1) {
            this.rows.push(row);
        } else {
            this.rows.splice(rowId, 0, row);
        }
        if (isMeasure) {
            this.measure(new Size(this.width, this.height));
            this.arrange(this.desiredSize);
        }
    }

    /**
     * addColumn method \
     *
     * @returns { void } addColumn method .\
     * @param {number} columnId - provide the rowId value.
     * @param {number} column - provide the rowDefn value.
     * @param {boolean} isMeasure - provide the isMeasure value.
     *
     * @private
     */
    public addColumn(columnId: number, column: ColumnDefinition, isMeasure?: boolean): void {
        let row: GridRow; let rowDefn: RowDefinition; let colDefn: ColumnDefinition; let cell: GridCell;
        const rows: GridRow[] = this.rows;
        if (this.colDefns.length > 0) {
            this.colDefns.splice(columnId, 0, column);
        } else {
            this.colDefns.push(column);
        }
        if (this.width !== undefined) {
            this.width += column.width;
        }
        for (let i: number = 0; i < rows.length; i++) {
            row = rows[i]; rowDefn = this.rowDefns[i];
            colDefn = column; cell = new GridCell();
            cell.style = this.cellStyle;
            cell.desiredCellWidth = cell.minWidth = colDefn.width;
            cell.desiredCellHeight = cell.minHeight = rowDefn.height;
            cell.children = [];
            if (columnId > row.cells.length - 1) {
                row.cells.push(cell);
            } else {
                row.cells.splice(columnId, 0, cell);
            }
            this.children.push(cell);
        }
        if (isMeasure) {
            this.measure(new Size(this.width, this.height));
            this.arrange(this.desiredSize);
        }
    }
    /**
     * removeRow method \
     *
     * @returns { void } removeRow method .\
     * @param {number} rowId - provide the rowId value.
     *
     * @private
     */
    public removeRow(rowId: number): void {
        let cell: GridCell; let element: HTMLElement;
        const rows: GridRow[] = this.rows;
        const removeRow: GridRow = rows[rowId];
        this.height -= this.rowDefns[rowId].height;
        for (let i: number = 0; i < removeRow.cells.length; i++) {
            cell = removeRow.cells[i];
            this.children.splice(this.children.indexOf(cell), 1);
            element = document.getElementById(cell.id + '_groupElement');
            if (element && element.parentElement) {
                element.parentElement.removeChild(element);
            }
        }
        this.rows.splice(rowId, 1);
        this.rowDefns.splice(rowId, 1);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /**
     * removeColumn method \
     *
     * @returns { void } removeColumn method .\
     * @param {number} columnId - provide the rowId value.
     *
     * @private
     */
    public removeColumn(columnId: number): void {
        let cell: GridCell; let element: HTMLElement;
        const rows: GridRow[] = this.rows;
        this.width -= this.colDefns[columnId].width;
        for (let i: number = 0; i < rows.length; i++) {
            cell = rows[i].cells[columnId];
            this.children.splice(this.children.indexOf(cell), 1);
            element = document.getElementById(cell.id + '_groupElement');
            if (element && element.parentElement) {
                element.parentElement.removeChild(element);
            }
            rows[i].cells.splice(columnId, 1);
        }
        this.colDefns.splice(columnId, 1);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /**
     * updateRowIndex method \
     *
     * @returns { void } updateRowIndex method .\
     * @param {number} currentIndex - provide the rowId value.
     * @param {number} newIndex - provide the rowId value.
     *
     * @private
     */
    public updateRowIndex(currentIndex: number, newIndex: number): void {
        //const rows: GridRow[] = this.rows;
        const temp: GridRow = this.rows[currentIndex];
        this.rows.splice(currentIndex, 1);
        this.rows.splice(newIndex, 0, temp);
        const tempRow: RowDefinition = this.rowDefns[currentIndex];
        this.rowDefns.splice(currentIndex, 1);
        this.rowDefns.splice(newIndex, 0, tempRow);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /**
     * updateColumnIndex method \
     *
     * @returns { void } updateColumnIndex method .\
     * @param {number} startRowIndex - provide the startRowIndex value.
     * @param {number} currentIndex - provide the currentIndex value.
     * @param {number} newIndex - provide the newIndex value.
     *
     * @private
     */
    public updateColumnIndex(startRowIndex: number, currentIndex: number, newIndex: number): void {
        let temp: GridRow; let cell: GridCell;
        for (let i: number = startRowIndex; i < this.rows.length; i++) {
            temp = this.rows[i];
            cell = this.rows[i].cells[currentIndex];
            temp.cells.splice(currentIndex, 1);
            temp.cells.splice(newIndex, 0, cell);
        }
        const tempCol: ColumnDefinition = this.colDefns[currentIndex];
        this.colDefns.splice(currentIndex, 1);
        this.colDefns.splice(newIndex, 0, tempCol);
        const tempSize: number = this.desiredCellWidth[currentIndex];
        this.desiredCellWidth.splice(currentIndex, 1);
        this.desiredCellWidth.splice(newIndex, 0, tempSize);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /**
     * measure method \
     *
     * @returns { Size } measure method .\
     * @param {Size} availableSize - provide the startRowIndex value.
     *
     * @private
     */
    public measure(availableSize: Size): Size {
        let desired: Size = undefined;
        if (this.rows !== undefined && this.rows.length > 0) {
            let i: number = 0;
            let j: number = 0;
            desired = new Size(0, 0);
            this.calculateSize();
            for (const row of this.rows) {
                j = 0;
                for (const cell of row.cells) {
                    const size: Size = cell.measure(new Size(cell.desiredCellWidth, cell.desiredCellHeight));
                    if (cell.rowSpan === 1) {
                        if (j === 0 || this.desiredRowHeight[i] === undefined) {
                            this.desiredRowHeight[i] = size.height;
                        } else {
                            this.desiredRowHeight[i] = Math.max(size.height, this.desiredRowHeight[i]);
                        }
                    }
                    if (cell.columnSpan === 1) {
                        if (i === 0 || this.desiredCellWidth[j] === undefined) {
                            this.desiredCellWidth[j] = size.width;
                        } else {
                            this.desiredCellWidth[j] = Math.max(size.width, this.desiredCellWidth[j]);
                        }

                        if (i === this.rows.length - 1) {
                            desired.width += this.desiredCellWidth[j];
                        }
                    }
                    j++;
                }
                desired.height += this.desiredRowHeight[i];
                i++;
            }
            //to-do update definitions
            i = j = 0;
            let rowIndex: number = 0;
            for (const row of this.rows) {
                j = 0;
                let cellIndex: number = 0;
                for (const cell of row.cells) {
                    if (cell.columnSpan !== 1) {
                        cell.desiredSize.width = 0;
                        for (let start: number = 0; start < cell.columnSpan; start++) {
                            if ((start + j) < row.cells.length) {
                                cell.desiredSize.width += this.desiredCellWidth[start + j];
                                cell.minWidth = cell.desiredSize.width;
                                cell.measure(cell.desiredSize);
                            }
                        }
                        j++;
                    } else {
                        cell.desiredSize.width = this.desiredCellWidth[cellIndex];
                        cell.measure(cell.desiredSize);
                    }
                    if (cell.rowSpan !== 1) {
                        cell.desiredSize.height = 0;
                        for (let start: number = 0; start < cell.rowSpan; start++) {
                            if ((start + rowIndex) < this.rows.length) {
                                cell.desiredSize.height += this.desiredRowHeight[start + rowIndex];
                                cell.minHeight = cell.desiredSize.height;
                                cell.measure(cell.desiredSize);
                            }
                        }
                    } else {
                        cell.desiredSize.height = this.desiredRowHeight[rowIndex];
                        cell.measure(cell.desiredSize);
                    }
                    i++;
                    cellIndex++;
                }
                rowIndex++;
            }
        }
        if (desired === undefined) {
            desired = super.validateDesiredSize(desired, availableSize);
        }
        super.stretchChildren(desired);
        this.desiredSize = desired;
        return desired;
    }

    /**
     * arrange method \
     *
     * @returns { Size } arrange method .\
     * @param {Size} desiredSize - provide the startRowIndex value.
     * @param {boolean} isChange - provide the startRowIndex value.
     *
     * @private
     */
    public arrange(desiredSize: Size, isChange?: boolean): Size {
        let j: number = 0; let i: number = 0;
        if (this.rows !== undefined && this.rows.length > 0) {
            const x: number = this.offsetX - desiredSize.width * this.pivot.x;
            let y: number = this.offsetY - desiredSize.height * this.pivot.y;
            let cellX: number = x;
            for (const row of this.rows) {
                cellX = x;
                j = 0;
                for (const cell of row.cells) {
                    const cellWidth: number = Math.max(this.desiredCellWidth[j], cell.desiredSize.width);
                    const cellHeight: number = Math.max(this.desiredRowHeight[i], cell.desiredSize.height);
                    cell.offsetX = cellX + cellWidth * cell.pivot.x;
                    cell.offsetY = y + cellHeight * cell.pivot.y;
                    cellX += this.desiredCellWidth[j];
                    cell.arrange(new Size(cellWidth, cellHeight));
                    j++;
                }
                y += this.desiredRowHeight[i];
                i++;
            }
            if (isChange) {
                // Need to remove the unwanted the child elements in the grid
                // Used for row span and column span.
                let cell: GridCell; let row: GridRow;
                let k: number; let z: number; let removeCell: GridCell;
                for (i = 0; i < this.rows.length; i++) {
                    row = this.rows[i];
                    for (j = 0; j < row.cells.length; j++) {
                        cell = row.cells[j];
                        if (cell.columnSpan > 1) {
                            // remove a child element when a column span is greater than 1
                            this.children.splice((this.children.indexOf(cell)) + 1, cell.columnSpan - 1);
                        }
                        if (cell.rowSpan > 1) {
                            for (k = i, z = 0; ((k + cell.rowSpan - 1) < this.rows.length && z < cell.rowSpan - 1); k++ , z++) {
                                removeCell = this.rows[k + 1].cells[j];
                                // remove a child element when a row span is greater than 1
                                this.children.splice(this.children.indexOf(removeCell), 1);
                            }
                        }
                    }
                }
            }
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        return desiredSize;
    }
}

/**
 * Defines the behavior of the RowDefinition of node
 */
export class RowDefinition {
    /** returns the height of node */
    public height: number = undefined;
}

/**
 * Defines the behavior of the ColumnDefinition of node
 */
export class ColumnDefinition {
    /** returns the width of node */
    public width: number = undefined;
}

/** @private */
export class GridRow {
    public cells: GridCell[] = null;
}

/** @private */
export class GridCell extends Canvas {
    public columnSpan: number = 1;
    public rowSpan: number = 1;
    public desiredCellWidth: number;
    public desiredCellHeight: number;
}

class GridCellItem extends DiagramElement {
    public rowId: number = 0;
    public columnId: number = 0;
    public rowSpan: number = 1;
    public columnSpan: number = 1;
}
