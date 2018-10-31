import { isNullOrUndefined, attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ICellRenderer, QueryCellInfoEventArgs, IGrid } from '../base/interface';
import { iterateArrayOrObject } from '../base/util';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { CellType } from '../base/enum';

/**
 * `CellMergeRender` module.
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
        let cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
        let cellRenderer: ICellRenderer<T> = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
        let span: number = row.cells[i].cellSpan ? row.cells[i].cellSpan :
            (cellArgs.colSpan + i) <= row.cells.length ? cellArgs.colSpan : row.cells.length - i;
        let visible: number = 0;
        for ( let j: number = i + 1; j < i + span && j < row.cells.length; j++) {
            if (row.cells[j].visible === false) {
                visible ++;
            } else {
                row.cells[j].isSpanned = true;
            }
        }
        if (visible > 0) {
            for ( let j: number = i + span; j < i + span + visible && j < row.cells.length; j++) {
                row.cells[j].isSpanned = true;
            }
            if ( i + span + visible >= row.cells.length) {
                span -= (i + span + visible) - row.cells.length;
            }
        }
        if (row.cells[i].cellSpan) {
            row.data[cellArgs.column.field] = row.cells[i].spanText;
            td = cellRenderer.render(
                row.cells[i], row.data,
                { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' });
        }
        if (span > 1) {
            attributes(td, {'colSpan': span.toString(), 'aria-colSpan': span.toString()});
        }
        if (this.parent.enableColumnVirtualization && !row.cells[i].cellSpan &&
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
        return this.getMergeCells().hasOwnProperty(this.generteKey(fname, data));
    }

    private getMergeCells(): {[key: string]: number} {
        return this.parent.mergeCells;
    }

    private setMergeCells(key: string, span: number): void {
        this.parent.mergeCells[key] = span;
    }

    public updateVirtualCells(rows:  Row<Column>[]):  Row<Column>[] {
        let mCells: {[key: string]: number} = this.getMergeCells();
        for (let key of Object.keys(mCells)) {
            let value: number = mCells[key];
            let merge: string[] = this.splitKey(key);
            let columnIndex: number = this.getIndexFromAllColumns(merge[0]);
            let vColumnIndices: number[] = this.parent.getColumnIndexesInView();
            let span: number = value - (vColumnIndices[0] - columnIndex);
            if (columnIndex < vColumnIndices[0] && span > 1) {
                for ( let row of rows) {
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
        let index: number = iterateArrayOrObject<number, Column>(
            <Column[]>this.parent.getVisibleColumns(), (item: Column, index: number) => {
                if (item.field === field) {
                    return index;
                }
                return undefined;
            })[0];

        return index;
    }
}

