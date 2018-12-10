import { DiagramElement } from '../elements/diagram-element';
import { Canvas } from './canvas';
import { Container } from './container';
import { Size } from '../../primitives/size';
import { ShapeStyleModel } from '../appearance-model';
import { randomId } from '../../utility/base-util';

/**
 * Grid panel is used to arrange the children in a table like structure
 */
export class GridPanel extends Container {

    private childTable: GridCellItem[] = [];

    // public get rowDefinitions(): RowDefinition[] {
    //     return this.rowDefns;
    // }

    private rowDefns: RowDefinition[];

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
            let row: GridRow = this.rows[rowId];
            if (row.cells.length > columnId) {
                columnSpan = columnSpan || 1;
                rowSpan = rowSpan || 1;
                let cell: GridCell = row.cells[columnId];
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

    /** @private */
    public updateProperties(offsetX: number, offsetY: number, width: number, height: number): void {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    /** @private */
    public setDefinitions(rows: RowDefinition[], columns: ColumnDefinition[]): void {
        this.rowDefns = rows;
        this.colDefns = columns;
        this.children = [];
        this.rows = this.rows || [];
        for (let i: number = 0; i < rows.length; i++) {
            let rowDefn: RowDefinition = rows[i];
            let row: GridRow = new GridRow();
            row.cells = [];
            let defaultCell: ColumnDefinition = new ColumnDefinition();
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

    /** @private */
    private addCellInRow(columns: ColumnDefinition[], rowDefn: RowDefinition, row: GridRow): void {
        for (let j: number = 0; j < columns.length; j++) {
            let colDefn: ColumnDefinition = columns[j];
            let cell: GridCell = new GridCell();
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

    /** @private */
    private calculateSize(): void {
        let rows: GridRow[] = this.rows || [];
        let calculateHeight: number = 0;
        let calculateWidth: number = 0;
        for (let i: number = 0; i < rows.length; i++) {
            let row: GridRow = this.rows[i]; calculateWidth = 0;
            for (let j: number = 0; j < row.cells.length; j++) {
                calculateWidth += row.cells[j].desiredCellWidth;
                if (j === row.cells.length - 1) {
                    if (this.width && this.width !== calculateWidth) {
                        row.cells[j].desiredCellWidth += (this.width - calculateWidth);
                        if (row.cells[j].children && row.cells[j].children.length) {
                            row.cells[j].children[0].minWidth = row.cells[j].desiredCellWidth;
                        }
                    }
                    calculateHeight += row.cells[j].desiredCellHeight;
                    if (i === rows.length - 1) {
                        if (this.height && this.height !== calculateHeight) {
                            row.cells[j].desiredCellHeight += (this.height - calculateHeight);
                            if (row.cells[j].children && row.cells[j].children.length) {
                                row.cells[j].children[0].minHeight = row.cells[j].desiredCellHeight;
                            }
                        }
                    }
                }
            }
        }
    }

    /** @private */
    public updateRowHeight(rowId: number, height: number): void {
        let row: GridRow = this.rows[rowId];
        if (this.height !== undefined) {
            this.height += height - row.cells[0].desiredCellHeight;
        }
        for (let i: number = 0; i < row.cells.length; i++) {
            row.cells[i].desiredCellHeight = row.cells[i].minHeight = height;
            if (row.cells[i].children && row.cells[i].children.length) {
                row.cells[i].children[0].minHeight = height;
            }
        }
        this.desiredRowHeight[rowId] = height;
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /** @private */
    public updateColumnWidth(colId: number, width: number): void {
        if (this.width !== undefined) {
            this.width += width - this.rows[0].cells[colId].desiredCellWidth;
        }
        for (let i: number = 0; i < this.rows.length; i++) {
            this.rows[i].cells[colId].desiredCellWidth = this.rows[i].cells[colId].minWidth = width;
            if (this.rows[i].cells[colId].children && this.rows[i].cells[colId].children.length) {
                this.rows[i].cells[colId].children[0].minWidth = width;
            }
        }
        this.desiredCellWidth[colId] = width;
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /** @private */
    public addRow(rowId: number, rows: RowDefinition[]): void {
        for (let i: number = 0; i < rows.length; i++) {
            let rowDefn: RowDefinition = rows[i];
            this.rowDefns.push(rowDefn);
            let row: GridRow = new GridRow();
            row.cells = [];
            let defaultCell: ColumnDefinition = new ColumnDefinition();
            defaultCell.width = this.width;
            let columns: ColumnDefinition[] = this.colDefns;
            this.addCellInRow(columns, rowDefn, row);
            if (rowId > this.rows.length - 1) {
                this.rows.push(row);
            } else {
                this.rows.splice(rowId, 0, row);
            }
        }
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /** @private */
    public addColumn(columnId: number, columns: ColumnDefinition[]): void {
        let rows: GridRow[] = this.rows;
        for (let i: number = 0; i < rows.length; i++) {
            let row: GridRow = rows[i];
            let rowDefn: RowDefinition = this.rowDefns[i];
            for (let j: number = 0; j < columns.length; j++) {
                let colDefn: ColumnDefinition = columns[j];
                let cell: GridCell = new GridCell();
                cell.style = this.cellStyle;
                cell.desiredCellWidth = colDefn.width;
                cell.desiredCellHeight = rowDefn.height;
                if (columnId > row.cells.length - 1) {
                    row.cells.push(cell);
                } else {
                    row.cells.splice(columnId, 0, cell);
                }
                this.children.push(cell);
            }
        }
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }
    /** @private */
    public removeRow(rowId: number): void {
        let rows: GridRow[] = this.rows;
        let removeRow: GridRow = rows[rowId];
        for (let i: number = 0; i < removeRow.cells.length; i++) {
            let cell: GridCell = removeRow.cells[i];
            this.children.splice(this.children.indexOf(cell), 1);
            let element: HTMLElement = document.getElementById(cell.id + '_groupElement');
            element.parentElement.removeChild(element);
        }
        this.rows.splice(rowId, 1);
        this.rowDefns.splice(rowId, 1);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /** @private */
    public removeColumn(columnId: number): void {
        let rows: GridRow[] = this.rows;
        for (let i: number = 0; i < rows.length; i++) {
            let cell: GridCell = rows[i].cells[columnId];
            this.children.splice(this.children.indexOf(cell), 1);
            let element: HTMLElement = document.getElementById(cell.id + '_groupElement');
            element.parentElement.removeChild(element);
            rows[i].cells.splice(columnId, 1);
        }
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }

    /** @private */
    public updateRowIndex(currentIndex: number, newIndex: number): void {
        let rows: GridRow[] = this.rows;
        let temp: GridRow = this.rows[currentIndex];
        this.rows.splice(currentIndex, 1);
        this.rows.splice(newIndex, 0, temp);
        this.measure(new Size(this.width, this.height));
        this.arrange(this.desiredSize);
    }
    /** @private */
    public measure(availableSize: Size): Size {
        let desired: Size = undefined;
        if (this.rows !== undefined && this.rows.length > 0) {
            let i: number = 0;
            let j: number = 0;
            desired = new Size(0, 0);
            this.calculateSize();
            for (let row of this.rows) {
                j = 0;
                for (let cell of row.cells) {
                    let size: Size = cell.measure(new Size(cell.desiredCellWidth, cell.desiredCellHeight));
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
            for (let row of this.rows) {
                j = 0;
                let cellIndex: number = 0;
                for (let cell of row.cells) {
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

    /** @private */
    public arrange(desiredSize: Size, isChange?: boolean): Size {
        if (this.rows !== undefined && this.rows.length > 0) {
            let x: number = this.offsetX - desiredSize.width * this.pivot.x;
            let y: number = this.offsetY - desiredSize.height * this.pivot.y;
            let cellX: number = x;
            let j: number = 0;
            let i: number = 0;
            for (let row of this.rows) {
                cellX = x;
                j = 0;
                for (let cell of row.cells) {
                    let cellWidth: number = Math.max(this.desiredCellWidth[j], cell.desiredSize.width);
                    let cellHeight: number = Math.max(this.desiredRowHeight[i], cell.desiredSize.height);
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
                for (let i: number = 0; i < this.rows.length; i++) {
                    let row: GridRow = this.rows[i];
                    for (let j: number = 0; j < row.cells.length; j++) {
                        let cell: GridCell = row.cells[j];
                        if (cell.columnSpan > 1) {
                            // remove a child element when a column span is greater than 1
                            this.children.splice((this.children.indexOf(cell)) + 1, cell.columnSpan - 1);
                        }
                        if (cell.rowSpan > 1) {
                            let k: number; let z: number;
                            for (k = i, z = 0; ((k + cell.rowSpan - 1) < this.rows.length && z < cell.rowSpan - 1); k++ , z++) {
                                let removeCelll: GridCell = this.rows[k + 1].cells[j];
                                // remove a child element when a row span is greater than 1
                                this.children.splice(this.children.indexOf(removeCelll), 1);
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

/** @private */
export class RowDefinition {
    public height: number = undefined;
}

/** @private */
export class ColumnDefinition {
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