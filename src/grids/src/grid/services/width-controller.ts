import { isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs } from '../base/interface';
import { formatUnit } from '@syncfusion/ej2-base';
import { columnWidthChanged, preventFrozenScrollRefresh } from '../base/constant';
import { Column } from '../models/column';
import { parentsUntil, ispercentageWidth, getScrollBarWidth } from '../base/util';
import * as literals from '../base/string-literals';

/**
 * ColumnWidthService
 *
 * @hidden
 */
export class ColumnWidthService {
    private parent: IGrid;

    constructor(parent: IGrid) {
        this.parent = parent;
    }

    public setWidthToColumns(): void {
        let i: number = 0; const indexes: number[] = this.parent.getColumnIndexesInView(); let wFlag: boolean = true;
        let totalColumnsWidth: number | string = 0;
        if (this.parent.allowGrouping) {
            for (let len: number = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) { wFlag = false; continue; }
                this.setColumnWidth(new Column({ width: '30px' }), i);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            this.setColumnWidth(new Column({ width: '30px' }), i);
            i++;
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            this.setColumnWidth(new Column({ width: '30px' }), i);
            i++;
        }
        const columns: Column[] = (<Column[]>this.parent.getColumns());
        for (let j: number = 0; j < columns.length; j++) {
            this.setColumnWidth(columns[parseInt(j.toString(), 10)], wFlag && this.parent.enableColumnVirtualization ? undefined : j + i);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            this.setColumnWidth(new Column({ width: '30px' }), this.parent.groupSettings.columns.length + columns.length);
        }
        totalColumnsWidth = this.getTableWidth(this.parent.getColumns());
        if (totalColumnsWidth !== 'auto') {
            if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1) {
                this.setMinwidthBycalculation(totalColumnsWidth as number);
            }
            const maxWidthColumns: Column[] = columns.filter((a: Column) => {
                return !isNullOrUndefined(a.maxWidth);
            });
            const header: Element = this.parent.getHeaderTable();
            const content: Element = this.parent.getContentTable();
            if (this.parent.allowResizing && this.parent.element.getBoundingClientRect().width > (totalColumnsWidth as number) &&
                maxWidthColumns.length === columns.length && header && content) {
                addClass([header, content], ['e-tableborder']);
            }
        }
    }

    public setMinwidthBycalculation(tWidth?: number): void {
        let difference: number = 0;
        const collection: Column[] = this.parent.getColumns().filter((a: Column) => {
            if (this.parent.allowResizing) {
                return (isNullOrUndefined(a.width) || a.width === 'auto') && isNullOrUndefined(a.maxWidth);
            } else {
                return isNullOrUndefined(a.width) || a.width === 'auto';
            }
        });
        if (collection.length) {
            if (!isNullOrUndefined(this.parent.width) && this.parent.width !== 'auto' &&
                typeof (this.parent.width) === 'string' && this.parent.width.indexOf('%') === -1) {
                difference = parseInt(this.parent.width, 10) - tWidth;
            } else {
                difference = this.parent.element.getBoundingClientRect().width - tWidth;
            }
            let tmWidth: number = 0;
            for (const cols of collection) {

                tmWidth += !isNullOrUndefined(cols.minWidth) ?
                    ((typeof cols.minWidth === 'string' ? parseInt(cols.minWidth, 10) : cols.minWidth)) : 0;
            }
            for (let i: number = 0; i < collection.length; i++) {
                if (tWidth === 0 && this.parent.allowResizing && this.isWidthUndefined() && (i !== collection.length - 1)) {
                    this.setUndefinedColumnWidth(collection);
                }
                const index: number = this.parent.getColumnIndexByField(
                    collection[parseInt(i.toString(), 10)].field) + this.parent.getIndentCount();
                if (tWidth !== 0 && difference < tmWidth) {
                    this.setWidth(collection[parseInt(i.toString(), 10)].minWidth, index);
                } else if (tWidth !== 0 && difference > tmWidth) {
                    this.setWidth('', index, true);
                }
            }
        }
    }

    public setUndefinedColumnWidth(collection?: Column[]): void {
        for (let k: number = 0; k < collection.length; k++) {
            if (k !== collection.length - 1) {
                collection[parseInt(k.toString(), 10)].width = 200;
                this.setWidth(200, this.parent.getColumnIndexByField(collection[parseInt(k.toString(), 10)].field));
            }
        }
    }

    public setColumnWidth(column: Column, index?: number, module?: string): void {
        if (this.parent.getColumns().length < 1) {
            return;
        }
        const columnIndex: number = isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        const cWidth: string | number = this.getWidth(column);
        const tgridWidth: number | string = this.getTableWidth(this.parent.getColumns());
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1 && tgridWidth !== 'auto') {
                this.setMinwidthBycalculation(tgridWidth as number);
            }
            if (this.parent.allowResizing && (module === 'resize' || this.parent.getFrozenColumns())) {
                const contentTable: HTMLElement = this.parent.getContentTable() as HTMLElement;
                this.setWidthToTable(this.parent.getFrozenColumns() && contentTable.style.width.indexOf('px') === -1 && (tgridWidth as number) < contentTable.clientWidth);
            }
            this.parent.notify(columnWidthChanged, { index: columnIndex, width: cWidth, column: column, module: module });
        }
    }

    private setWidth(width: string | number, index: number, clear?: boolean): void {
        if (this.parent.groupSettings.columns.length > index && ispercentageWidth(this.parent) &&
            !(this.parent.resizeModule && this.parent.resizeModule.resizeProcess)) {
            const elementWidth: number = this.parent.element.offsetWidth;
            width = (30 / elementWidth * 100).toFixed(1) + '%';
        }
        const header: Element = this.parent.getHeaderTable();
        const content: Element = this.parent.getContentTable();
        const fWidth: string = formatUnit(width);
        const headerCol: HTMLTableColElement = (<HTMLTableColElement>header.querySelector(literals.colGroup)
            .children[parseInt(index.toString(), 10)]);
        if (headerCol && !clear) {
            headerCol.style.width = fWidth;
        } else if (headerCol && clear) {
            headerCol.style.width = '';
        }
        const contentCol: HTMLTableColElement = (<HTMLTableColElement>content.querySelector(
            literals.colGroup).children[parseInt(index.toString(), 10)]);
        if (contentCol && !clear) {
            contentCol.style.width = fWidth;
        } else if (contentCol && clear) {
            contentCol.style.width = '';
        }
        if (!this.parent.enableColumnVirtualization && this.parent.isEdit) {
            const edit: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-table.e-inline-edit');
            const editTableCol: HTMLTableColElement[] = [];
            for (let i: number = 0; i < edit.length; i++) {
                if (parentsUntil(edit[parseInt(i.toString(), 10)], 'e-grid').id === this.parent.element.id) {
                    for (let j: number = 0; j < edit[parseInt(i.toString(), 10)].querySelector('colgroup').children.length; j++) {
                        editTableCol.push((<HTMLTableColElement>edit[parseInt(i.toString(), 10)].querySelector('colgroup').children[parseInt(j.toString(), 10)]));
                    }
                }
            }
            if (edit.length && editTableCol.length && editTableCol[parseInt(index.toString(), 10)]) {
                editTableCol[parseInt(index.toString(), 10)].style.width = fWidth;
            }
        }
        if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization) {
            this.refreshFrozenScrollbar();
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public refreshFrozenScrollbar(): void {
        const args: NotifyArgs = { cancel: false };
        this.parent.notify(preventFrozenScrollRefresh, args);
        if (args.cancel) {
            return;
        }
        const scrollWidth: number = getScrollBarWidth();
        const movableScrollbar: HTMLElement = this.parent.element.querySelector('.e-movablescrollbar');
        let movableWidth: number = this.parent.getContent().firstElementChild.getBoundingClientRect().width;
        if (this.parent.enableColumnVirtualization) {
            const placeHolder: HTMLElement = this.parent.getContent().querySelector('.e-virtualtrack');
            if (placeHolder) {
                movableWidth = placeHolder.scrollWidth;
            }
        }
        if (this.parent.height !== 'auto') {
            movableWidth = movableWidth + scrollWidth;
        }
        (movableScrollbar.firstElementChild as HTMLElement).style.width = movableWidth + 'px';
    }

    public getSiblingsHeight(element: HTMLElement): number {
        const previous: number = this.getHeightFromDirection(element, 'previous');
        const next: number = this.getHeightFromDirection(element, 'next');
        return previous + next;
    }

    private getHeightFromDirection(element: HTMLElement, direction: string): number {
        let sibling: HTMLElement = element[direction + 'ElementSibling'];
        let result: number = 0;
        const classList: string[] = [literals.gridHeader, literals.gridFooter, 'e-groupdroparea', 'e-gridpager', 'e-toolbar', 'e-temp-toolbar'];

        while (sibling) {
            if (classList.some((value: string) => sibling.classList.contains(value))) {
                result += sibling.offsetHeight;
            }
            sibling = sibling[direction + 'ElementSibling'];
        }

        return result;
    }
    public isWidthUndefined(): boolean {
        const isWidUndefCount: number = this.parent.getColumns().filter((col: Column) => {
            return isNullOrUndefined(col.width) && isNullOrUndefined(col.minWidth);
        }).length;
        return (this.parent.getColumns().length === isWidUndefCount);
    }

    public getWidth(column: Column): string | number {
        if (this.parent.allowResizing && isNullOrUndefined(column.width)) {
            if (isNullOrUndefined(column.minWidth) && isNullOrUndefined(column.maxWidth)
                && !this.isWidthUndefined()) {
                column.width = 200;
            } else if (column.maxWidth) {
                column.width = column.maxWidth;
            }
        }
        if (!column.width) { return null; }
        const width: number = parseInt(column.width.toString(), 10);
        if (column.minWidth && width < parseInt(column.minWidth.toString(), 10)) {
            return column.minWidth;
        } else if (column.maxWidth && width > parseInt(column.maxWidth.toString(), 10)) {
            return column.maxWidth;
        } else {
            return column.width;
        }
    }

    public getTableWidth(columns: Column[], resetIndentWidth?: boolean): number | string {
        let tWidth: number | string = 0;
        let isAutoColumn: boolean = false;
        for (const column of columns) {
            if (column.visible !== false) {
                let cWidth: string | number = this.getWidth(column);
                if (column.width === 'auto' || !column.width) {
                    if (this.parent.allowResizing && !resetIndentWidth) {
                        if (!column.maxWidth) {
                            isAutoColumn = true;
                        }
                    } else {
                        cWidth = 0;
                    }
                }
                if (cWidth !== null) {
                    tWidth += parseInt(cWidth.toString(), 10);
                }
            }
        }
        tWidth = isAutoColumn ? 'auto' : tWidth;
        return tWidth;
    }

    public setWidthToTable(isMaxWidth?: boolean): void {
        let tWidth: string = formatUnit(this.getTableWidth(<Column[]>this.parent.getColumns()));
        if (this.parent.detailTemplate || this.parent.childGrid) {
            this.setColumnWidth(new Column({ width: '30px' }));
        }
        tWidth = (this.isAutoResize() || tWidth === 'auto' || isMaxWidth) ? '100%' : tWidth;
        (this.parent.getHeaderTable() as HTMLTableElement).style.width = tWidth;
        (this.parent.getContentTable() as HTMLTableElement).style.width = tWidth;
        const edit: HTMLTableElement = <HTMLTableElement>this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit) {
            edit.style.width = tWidth;
        }
    }
    private isAutoResize(): boolean {
        return this.parent.allowResizing && this.parent.resizeSettings.mode === 'Auto';
    }
}
