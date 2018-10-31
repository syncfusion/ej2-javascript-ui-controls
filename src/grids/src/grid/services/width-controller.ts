import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid } from '../base/interface';
import { formatUnit } from '@syncfusion/ej2-base';
import { columnWidthChanged } from '../base/constant';
import { Column } from '../models/column';

/**
 * ColumnWidthService
 * @hidden
 */
export class ColumnWidthService {
    private parent: IGrid;

    constructor(parent: IGrid) {
        this.parent = parent;
    }

    public setWidthToColumns(): void {
        let i: number = 0; let indexes: number[] = this.parent.getColumnIndexesInView(); let wFlag: boolean = true;
        if (this.parent.allowGrouping) {
            for (let len: number = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) { wFlag = false; continue; }
                this.setColumnWidth(new Column({ width: '30px' }), i);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            this.setColumnWidth(new Column({ width: '30px' }), i);
        }
        (<Column[]>this.parent.getColumns()).forEach((column: Column, index: number) => {
            this.setColumnWidth(column, wFlag ? undefined : index);
        });
    }

    public setColumnWidth(column: Column, index?: number, module?: string): void {
        let columnIndex: number = isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        let cWidth: string | number = this.getWidth(column);
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if ((this.parent.allowResizing && module === 'resize') || (this.parent.getFrozenColumns() && this.parent.allowResizing)) {
                this.setWidthToTable();
            }
            this.parent.notify(columnWidthChanged, { index: columnIndex, width: cWidth, column: column, module: module });
        }
    }

    private setWidth(width: string | number, index: number): void {
        let chrome: string = 'chrome';
        let webstore: string = 'webstore';
        if (typeof (width) === 'string' && width.indexOf('%') !== -1 &&
            !(Boolean(window[chrome]) && Boolean(window[chrome][webstore])) && this.parent.allowGrouping) {
            let elementWidth : number = this.parent.element.offsetWidth;
            width = parseInt(width, 10) / 100 * (elementWidth);
        }
        let header: Element = this.parent.getHeaderTable();
        let content: Element = this.parent.getContentTable();
        let fWidth: string = formatUnit(width);
        let headerCol: HTMLTableColElement;
        let frzCols: number = this.parent.getFrozenColumns();
        let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader');
        if (frzCols && index >= frzCols && mHdr && mHdr.querySelector('colgroup')) {
            headerCol = (<HTMLTableColElement>mHdr.querySelector('colgroup').children[index - frzCols]);
        } else {
            headerCol = (<HTMLTableColElement>header.querySelector('colgroup').children[index]);
        }
        if (headerCol) {
            headerCol.style.width = fWidth;
        }
        let contentCol: HTMLTableColElement;
        if (frzCols && index >= frzCols) {
            contentCol = (<HTMLTableColElement>this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup').children[index - frzCols]);
        } else {
            contentCol = (<HTMLTableColElement>content.querySelector('colgroup').children[index]);
        }
        if (contentCol) {
            contentCol.style.width = fWidth;
        }
        let edit: HTMLTableElement = <HTMLTableElement>content.querySelector('.e-table.e-inline-edit');
        if (edit) {
            if (<HTMLTableColElement>edit.querySelector('colgroup').children[index]) {
                (<HTMLTableColElement>edit.querySelector('colgroup').children[index]).style.width = fWidth;
            }
        }
    }

    public getSiblingsHeight(element: HTMLElement): number {
        let previous: number = this.getHeightFromDirection(element, 'previous');
        let next: number = this.getHeightFromDirection(element, 'next');
        return previous + next;
    }

    private getHeightFromDirection(element: HTMLElement, direction: string): number {
        let sibling: HTMLElement = element[direction + 'ElementSibling'];
        let result: number = 0;
        let classList: string[] = ['e-gridheader', 'e-gridfooter', 'e-groupdroparea', 'e-gridpager', 'e-toolbar'];

        while (sibling) {
            if (classList.some((value: string) => sibling.classList.contains(value))) {
                result += sibling.offsetHeight;
            }
            sibling = sibling[direction + 'ElementSibling'];
        }

        return result;
    }

    public getWidth(column: Column): string | number {
        if (isNullOrUndefined(column.width) && this.parent.allowResizing) {
            column.width = 200;
        }
        if (!column.width) { return null; }
        let width: number = parseInt(column.width.toString(), 10);
        if (column.minWidth && width < parseInt(column.minWidth.toString(), 10)) {
            return column.minWidth;
        } else if ((column.maxWidth && width > parseInt(column.maxWidth.toString(), 10))) {
            return column.maxWidth;
        } else {
            return column.width;
        }
    }

    public getTableWidth(columns: Column[]): number {
        let tWidth: number = 0;
        for (let column of columns) {
            let cWidth: string | number = this.getWidth(column);
            if (column.visible !== false && cWidth !== null) {
                tWidth += parseInt(cWidth.toString(), 10);
            }
        }
        return tWidth;
    }

    private setWidthToFrozenTable(): void {
        let columns: Column[] = this.parent.getColumns();
        columns.splice(this.parent.getFrozenColumns(), columns.length);
        let freezeWidth: string = formatUnit(this.getTableWidth(columns));
        (this.parent.getHeaderTable() as HTMLTableElement).style.width = freezeWidth;
        (this.parent.getContentTable() as HTMLTableElement).style.width = freezeWidth;
    }

    private setWidthToMovableTable(): void {
        let columns: Column[] = this.parent.getColumns();
        columns.splice(0, this.parent.getFrozenColumns());
        let movableWidth: string = formatUnit(this.getTableWidth(columns));
        if (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild) {
            (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild as HTMLTableElement).style.width
            = movableWidth;
        }
        (this.parent.getContent().querySelector('.e-movablecontent').firstElementChild as HTMLTableElement).style.width =
            movableWidth;
    }

    public setWidthToTable(): void {
        let tWidth: string = formatUnit(this.getTableWidth(<Column[]>this.parent.getColumns()));
        if (this.parent.getFrozenColumns()) {
            this.setWidthToFrozenTable();
            this.setWidthToMovableTable();
        } else {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.setColumnWidth(new Column({ width: '30px' }));
            }
            (this.parent.getHeaderTable() as HTMLTableElement).style.width = tWidth;
            (this.parent.getContentTable() as HTMLTableElement).style.width = tWidth;
        }
        let edit: HTMLTableElement = <HTMLTableElement>this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit) {
            edit.style.width = tWidth;
        }
    }
}