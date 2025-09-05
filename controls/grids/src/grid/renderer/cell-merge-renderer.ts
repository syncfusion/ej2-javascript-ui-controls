import { isNullOrUndefined, attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ICellRenderer, QueryCellInfoEventArgs, IGrid } from '../base/interface';
import { iterateArrayOrObject } from '../base/util';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';

/**
 * `CellMergeRender` module.
 *
 * @hidden
 */
export class CellMergeRender<T> {

    private serviceLocator: ServiceLocator;
    protected parent: IGrid;
    constructor(serviceLocator?: ServiceLocator, parent?: IGrid) {
        this.serviceLocator = serviceLocator;
        this.parent = parent;
    }

    public render(cellArgs: QueryCellInfoEventArgs, row: Row<T>, i: number, td: Element): Element {
        const cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
        const cellRenderer: ICellRenderer<T> = cellRendererFact.getCellRenderer(row.cells[parseInt(i.toString(), 10)].cellType
            || CellType.Data);
        let colSpan: number = row.cells[parseInt(i.toString(), 10)].cellSpan ? row.cells[parseInt(i.toString(), 10)].cellSpan :
            cellArgs.colSpan ? (cellArgs.colSpan + i) <= row.cells.length ? cellArgs.colSpan : row.cells.length - i : 1;
        const rowSpan: number = cellArgs.rowSpan;
        let visible: number = 0;
        let spannedCell: Cell<Column>;
        if (row.index > 0) {
            const rowsObject: Row<Column>[] = this.parent.getRowsObject().filter((row: Row<Column>) => row.isDataRow);
            const cells: Cell<Column>[] = this.parent.groupSettings.columns.length > 0 &&
                !rowsObject[row.index - 1].isDataRow ? rowsObject[row.index].cells : rowsObject[row.index - 1].cells;
            const targetCell: Cell<T> = row.cells[parseInt(i.toString(), 10)];
            const uid: string = 'uid';
            spannedCell = cells.filter((cell: Cell<Column>) => cell.column.uid === targetCell.column[`${uid}`])[0];
        }
        const colSpanLen: number = spannedCell && spannedCell.colSpanRange > 1 && spannedCell.rowSpanRange > 1 ?
            spannedCell.colSpanRange : colSpan;
        for (let j: number = i + 1; j < i + colSpanLen && j < row.cells.length; j++) {

            if (row.cells[parseInt(j.toString(), 10)].visible === false) {
                visible ++;
            } else {
                row.cells[parseInt(j.toString(), 10)].isSpanned = true;
            }
        }
        if (visible > 0) {
            for (let j: number = i + colSpan; j < i + colSpan + visible && j < row.cells.length; j++) {
                row.cells[parseInt(j.toString(), 10)].isSpanned = true;
            }
            if ( i + colSpan + visible >= row.cells.length) {
                colSpan -= (i + colSpan + visible) - row.cells.length;
            }
        }
        if (row.cells[parseInt(i.toString(), 10)].cellSpan) {
            row.data[cellArgs.column.field] = row.cells[parseInt(i.toString(), 10)].spanText;
            td = cellRenderer.render(
                row.cells[parseInt(i.toString(), 10)], row.data,
                { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' });
        }
        if (colSpan > 1) {
            attributes(td, { 'colSpan': colSpan.toString(), 'aria-colSpan': colSpan.toString() });
        }
        if (rowSpan > 1) {
            attributes(td, { 'rowspan': rowSpan.toString(), 'aria-rowspan': rowSpan.toString() });
            row.cells[parseInt(i.toString(), 10)].isRowSpanned = true;
            row.cells[parseInt(i.toString(), 10)].rowSpanRange = Number(rowSpan);
            if (colSpan > 1) { row.cells[parseInt(i.toString(), 10)].colSpanRange = Number(colSpan); }
        }
        if (row.index > 0 && (spannedCell.rowSpanRange > 1)) {
            row.cells[parseInt(i.toString(), 10)].isSpanned = true;
            row.cells[parseInt(i.toString(), 10)].rowSpanRange = Number(spannedCell.rowSpanRange - 1);
            row.cells[parseInt(i.toString(), 10)].colSpanRange = spannedCell.rowSpanRange > 0 ? spannedCell.colSpanRange : 1;

        }
        if (this.parent.enableColumnVirtualization && !row.cells[parseInt(i.toString(), 10)].cellSpan &&
            !this.containsKey(cellArgs.column.field, cellArgs.data[cellArgs.column.field]) ) {
            this.backupMergeCells(cellArgs.column.field, cellArgs.data[cellArgs.column.field], cellArgs.colSpan);
        }
        return td;
    }

    private backupMergeCells(fName: string, data: string, span: number): void {
        this.setMergeCells(this.generteKey(fName, data), span);
    }

    private generteKey(fname: string, data: string): string {
        return fname + '__' + data.toString();
    }

    private splitKey(key: string): string[] {
        return key.split('__');
    }

    private containsKey(fname: string, data: string): boolean {
        // eslint-disable-next-line no-prototype-builtins
        return this.getMergeCells().hasOwnProperty(this.generteKey(fname, data));
    }

    private getMergeCells(): {[key: string]: number} {
        return this.parent.mergeCells;
    }

    private setMergeCells(key: string, span: number): void {
        this.parent.mergeCells[`${key}`] = span;
    }

    public updateVirtualCells(rows:  Row<Column>[]):  Row<Column>[] {
        const mCells: {[key: string]: number} = this.getMergeCells();
        for (const key of Object.keys(mCells)) {
            const value: number = mCells[`${key}`];
            const merge: string[] = this.splitKey(key);
            const columnIndex: number = this.getIndexFromAllColumns(merge[0]);
            const vColumnIndices: number[] = this.parent.getColumnIndexesInView();
            const span: number = value - (vColumnIndices[0] - columnIndex);
            if (columnIndex < vColumnIndices[0] && span > 1) {
                for ( const row of rows) {
                    if (row.data[merge[0]].toString() === merge[1].toString()) {
                        row.cells[0].cellSpan = span;
                        row.cells[0].spanText = merge[1];
                        break;
                    }
                }
            }
        }
        return rows;
    }

    private getIndexFromAllColumns(field: string): number {
        const index: number = iterateArrayOrObject<number, Column>(
            <Column[]>this.parent.getVisibleColumns(), (item: Column, index: number) => {
                if (item.field === field) {
                    return index;
                }
                return undefined;
            })[0];

        return index;
    }
}

