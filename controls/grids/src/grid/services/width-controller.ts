import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs } from '../base/interface';
import { formatUnit } from '@syncfusion/ej2-base';
import { columnWidthChanged, preventFrozenScrollRefresh } from '../base/constant';
import { Column } from '../models/column';
import { parentsUntil, ispercentageWidth, getScrollBarWidth } from '../base/util';
import { freezeMode } from '../base/enum';

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
        let totalColumnsWidth: number = 0;
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
        let columns: Column[] = (<Column[]>this.parent.getColumns());
        for (let j: number = 0; j < columns.length; j++) {
            this.setColumnWidth(columns[j], wFlag && this.parent.enableColumnVirtualization ? undefined : j + i);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            this.setColumnWidth(new Column({ width: '30px' }), columns.length);
        }
        totalColumnsWidth = this.getTableWidth(this.parent.getColumns());
        if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1) {
            this.setMinwidthBycalculation(totalColumnsWidth);
        }
    }

    public setMinwidthBycalculation(tWidth?: number): void {
        let difference: number = 0;
        let collection: Column[] = this.parent.getColumns().filter((a: Column) => {
            return isNullOrUndefined(a.width) || a.width === 'auto';
        });
        if (collection.length) {
            if (!isNullOrUndefined(this.parent.width) && this.parent.width !== 'auto' &&
                typeof (this.parent.width) === 'string' && this.parent.width.indexOf('%') === -1) {
                difference = (typeof this.parent.width === 'string' ? parseInt(this.parent.width, 10) : this.parent.width) - tWidth;
            } else {
                difference = this.parent.element.getBoundingClientRect().width - tWidth;
            }
            let tmWidth: number = 0;
            for (let cols of collection) {

                tmWidth += !isNullOrUndefined(cols.minWidth) ?
                    ((typeof cols.minWidth === 'string' ? parseInt(cols.minWidth, 10) : cols.minWidth)) : 0;
            }
            for (let i: number = 0; i < collection.length; i++) {
                if (tWidth === 0 && this.parent.allowResizing && this.isWidthUndefined() && (i !== collection.length - 1)) {
                    this.setUndefinedColumnWidth(collection);
                }
                if (tWidth !== 0 && difference < tmWidth) {
                    this.setWidth(collection[i].minWidth, this.parent.getColumnIndexByField(collection[i].field));
                } else if (tWidth !== 0 && difference > tmWidth) {
                    this.setWidth('', this.parent.getColumnIndexByField(collection[i].field) + this.parent.getIndentCount(), true);
                }
            }
        }
    }

    public setUndefinedColumnWidth(collection?: Column[]): void {
        for (let k: number = 0; k < collection.length; k++) {
            if (k !== collection.length - 1) {
                collection[k].width = 200;
                this.setWidth(200, this.parent.getColumnIndexByField(collection[k].field));
            }
        }
    }

    public setColumnWidth(column: Column, index?: number, module?: string): void {
        if (this.parent.getColumns().length < 1) {
            return;
        }
        let columnIndex: number = isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        let cWidth: string | number = this.getWidth(column);
        let tgridWidth: number = this.getTableWidth(this.parent.getColumns());
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1) {
                this.setMinwidthBycalculation(tgridWidth);
            }
            if ((this.parent.allowResizing && module === 'resize') || (this.parent.getFrozenColumns() && this.parent.allowResizing)) {
                this.setWidthToTable();
            }
            this.parent.notify(columnWidthChanged, { index: columnIndex, width: cWidth, column: column, module: module });
        }
    }

    private setWidth(width: string | number, index: number, clear?: boolean): void {
        if (this.parent.groupSettings.columns.length > index && ispercentageWidth(this.parent)) {
            let elementWidth: number = this.parent.element.offsetWidth;
            width = (30 / elementWidth * 100).toFixed(1) + '%';
        }
        let header: Element = this.parent.getHeaderTable();
        let content: Element = this.parent.getContentTable();
        let fWidth: string = formatUnit(width);
        let headerCol: HTMLTableColElement;
        let frzCols: number = this.parent.getFrozenColumns();
        let isDraggable: boolean = this.parent.isRowDragable();
        frzCols = frzCols && isDraggable ? frzCols + 1 : frzCols;
        let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader');
        let mCont: HTMLElement = <HTMLTableColElement>this.parent.getContent().querySelector('.e-movablecontent');
        let freezeLeft: number = this.parent.getFrozenLeftColumnsCount();
        let freezeRight: number = this.parent.getFrozenRightColumnsCount();
        let movableCount: number = this.parent.getMovableColumnsCount();
        let isColFrozen: boolean = freezeLeft !== 0 || freezeRight !== 0;
        if (frzCols && index >= frzCols && mHdr && mHdr.querySelector('colgroup')) {
            headerCol = (<HTMLTableColElement>mHdr.querySelector('colgroup').children[index - frzCols]);
        } else if (this.parent.enableColumnVirtualization && frzCols && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()
            && mHdr.scrollLeft > 0) {
            let colGroup: HTMLElement = mHdr.querySelector('colgroup');
            headerCol = (<HTMLTableColElement>colGroup.children[(colGroup.children.length - 1) - index]);
        } else if (isColFrozen) {
            let target: Element;
            if (freezeLeft && !freezeRight) {
                index = isDraggable ? index - 1 : index;
                target = index < freezeLeft ? header : mHdr;
            } else if (!freezeLeft && freezeRight) {
                target = index >= movableCount ? header : mHdr;
            } else if (freezeLeft && freezeRight) {
                index = isDraggable ? index - 1 : index;
                let frHdr: Element = this.parent.getFrozenRightHeader();
                target = index < freezeLeft ? header : index < (freezeLeft + movableCount) ? mHdr : frHdr;
            }
            headerCol = this.getColumnLevelFrozenColgroup(index, freezeLeft, movableCount, target);
            if (!headerCol) { return; }
        } else {
            headerCol = (<HTMLTableColElement>header.querySelector('colgroup').children[index]);
        }
        if (headerCol && !clear) {
            headerCol.style.width = fWidth;
        } else if (headerCol && clear) {
            headerCol.style.width = '';
        }
        let contentCol: HTMLTableColElement;
        if (frzCols && index >= frzCols) {
            contentCol = (<HTMLTableColElement>this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup').children[index - frzCols]);
        } else if (this.parent.enableColumnVirtualization && frzCols && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()
            && mCont.scrollLeft > 0) {
            let colGroup: HTMLElement = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup');
            contentCol = (<HTMLTableColElement>colGroup.children[(colGroup.children.length - 1) - index]);
        } else if (isColFrozen) {
            let target: Element;
            if (freezeLeft && !freezeRight) {
                target = index < freezeLeft ? content : mCont;
            }
            if (!freezeLeft && freezeRight) {
                target = index >= movableCount ? content : mCont;
            }
            if (freezeLeft && freezeRight) {
                let frCont: HTMLElement = <HTMLTableColElement>this.parent.getContent().querySelector('.e-frozen-right-content');
                target = index < freezeLeft ? content : index < (freezeLeft + movableCount) ? mCont : frCont;
            }
            contentCol = this.getColumnLevelFrozenColgroup(index, freezeLeft, movableCount, target);
        } else {
            contentCol = (<HTMLTableColElement>content.querySelector('colgroup').children[index]);
        }
        if (contentCol && !clear) {
            contentCol.style.width = fWidth;
        } else if (contentCol && clear) {
            contentCol.style.width = '';
        }
        let edit: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-table.e-inline-edit');
        let editTableCol: HTMLTableColElement[] = [];
        for (let i: number = 0; i < edit.length; i++) {
            if (parentsUntil(edit[i], 'e-grid').id === this.parent.element.id) {
                for (let j: number = 0; j < edit[i].querySelector('colgroup').children.length; j++) {
                    editTableCol.push((<HTMLTableColElement>edit[i].querySelector('colgroup').children[j]));
                }
            }
        }
        if (edit.length && editTableCol.length) {
            editTableCol[index].style.width = fWidth;
        }
        if (this.parent.isFrozenGrid()) {
            this.refreshFrozenScrollbar();
        }
    }

    private getColumnLevelFrozenColgroup(index: number, left: number, movable: number, ele: Element): HTMLTableColElement {
        if (!ele || !ele.querySelector('colgroup')) {
            return null;
        }
        let columns: Column[] = this.parent.getColumns();
        let isDrag: boolean = this.parent.isRowDragable();
        let frzMode: freezeMode = this.parent.getFrozenMode();
        let headerCol: HTMLTableColElement;
        let colGroup: Element[] = [].slice.call(ele.querySelector('colgroup').children);
        if (frzMode === 'Right' && isDrag && index === (movable + this.parent.getFrozenRightColumnsCount())) {
            headerCol = colGroup[colGroup.length - 1] as HTMLTableColElement;
        } else if (isDrag && index === -1) {
            headerCol = colGroup[0] as HTMLTableColElement;
        } else if (columns[index].freeze === 'Left') {
            headerCol = colGroup[isDrag ? (index + 1) : index] as HTMLTableColElement;
        } else if (columns[index].freeze === 'Right') {
            headerCol = colGroup[index - (left + movable)] as HTMLTableColElement;
        } else {
            headerCol = colGroup[index - left] as HTMLTableColElement;
        }
        return headerCol;
    }

    /** @hidden */
    public refreshFrozenScrollbar(): void {
        let args: NotifyArgs = { cancel: false };
        this.parent.notify(preventFrozenScrollRefresh, args);
        if (args.cancel) {
            return;
        }
        let scrollWidth: number = getScrollBarWidth();
        let frozenScrollbar: HTMLElement = this.parent.element.querySelector('.e-frozenscrollbar');
        let movableScrollbar: HTMLElement = this.parent.element.querySelector('.e-movablescrollbar');
        let frozencontent: HTMLElement = this.parent.getContent().querySelector('.e-frozencontent');
        let movableContent: HTMLElement = this.parent.getContent().querySelector('.e-movablecontent');
        let frozenWidth: number = frozencontent.firstElementChild.getBoundingClientRect().width;
        let movableWidth: number = movableContent.firstElementChild.getBoundingClientRect().width;
        if (this.parent.getFrozenMode() === 'Right') {
            frozenWidth = frozenWidth + scrollWidth;
        }
        frozenScrollbar.style.width = frozenWidth + 'px';
        if (this.parent.getFrozenMode() === 'Left-Right') {
            let frozenRightScrollbar: HTMLElement = this.parent.element.querySelector('.e-frozen-right-scrollbar');
            let frozenRightWidth: number = this.parent.getContent().querySelector('.e-frozen-right-content')
                .firstElementChild.getBoundingClientRect().width;
            if (this.parent.height !== 'auto') {
                frozenRightWidth = frozenRightWidth + scrollWidth;
            }
            frozenRightScrollbar.style.width = frozenRightWidth + 'px';
        } else {
            if (this.parent.enableColumnVirtualization) {
                let placeHolder: HTMLElement = this.parent.getMovableVirtualContent().querySelector('.e-virtualtrack');
                if (placeHolder) {
                    movableWidth = placeHolder.scrollWidth;
                }
            }
            if (this.parent.getFrozenMode() !== 'Right' && this.parent.height !== 'auto') {
                movableWidth = movableWidth + scrollWidth;
            }
        }
        (movableScrollbar.firstElementChild as HTMLElement).style.width = movableWidth + 'px';
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
    public isWidthUndefined(): boolean {
        let isWidUndefCount: number = this.parent.getColumns().filter((col: Column) => {
            return isNullOrUndefined(col.width) && isNullOrUndefined(col.minWidth);
        }).length;
        return (this.parent.getColumns().length === isWidUndefCount);
    }

    public getWidth(column: Column): string | number {
        if (isNullOrUndefined(column.width) && this.parent.allowResizing
            && isNullOrUndefined(column.minWidth) && !this.isWidthUndefined()) {
            column.width = 200;
        }
        if (this.parent.isFrozenGrid() && isNullOrUndefined(column.width) &&
            (column.getFreezeTableName() === 'frozen-left' || column.getFreezeTableName() === 'frozen-right')) {
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
            if (column.width === 'auto') {
                cWidth = 0;
            }
            if (column.visible !== false && cWidth !== null) {
                tWidth += parseInt(cWidth.toString(), 10);
            }
        }
        return tWidth;
    }

    private calcMovableOrFreezeColWidth(tableType: String): string {
        let columns: Column[] = this.parent.getColumns().slice();
        let left: number = this.parent.getFrozenLeftColumnsCount() || this.parent.getFrozenColumns();
        let movable: number = this.parent.getMovableColumnsCount();
        let right: number = this.parent.getFrozenRightColumnsCount();
        if (tableType === 'movable') {
            if (right) {
                columns.splice(left + movable, columns.length);
            }
            if (left) {
                columns.splice(0, left);
            }
        } else if (tableType === 'freeze-left') {
            columns.splice(left, columns.length);
        } else if (tableType === 'freeze-right') {
            columns.splice(0, left + movable);
        }
        return formatUnit(this.getTableWidth(columns));
    }

    private setWidthToFrozenRightTable(): void {
        let freezeWidth: string = this.calcMovableOrFreezeColWidth('freeze-right');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        let headerTbl: HTMLElement = this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('.e-table');
        let cntTbl: HTMLElement = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.e-table');
        headerTbl.style.width = freezeWidth;
        cntTbl.style.width = freezeWidth;
    }

    private setWidthToFrozenLeftTable(): void {
        let freezeWidth: string = this.calcMovableOrFreezeColWidth('freeze-left');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        (this.parent.getHeaderTable() as HTMLTableElement).style.width = freezeWidth;
        (this.parent.getContentTable() as HTMLTableElement).style.width = freezeWidth;
    }

    private setWidthToMovableTable(): void {
        let movableWidth: string = '';
        let isColUndefined: boolean = this.parent.getColumns().filter((a: Column) => { return isNullOrUndefined(a.width); }).length >= 1;
        let isWidthAuto: boolean = this.parent.getColumns().filter((a: Column) => { return (a.width === 'auto'); }).length >= 1;
        if (typeof this.parent.width === 'number' && !isColUndefined && !isWidthAuto) {
            movableWidth = formatUnit(this.parent.width - parseInt(this.calcMovableOrFreezeColWidth('freeze').split('px')[0], 10) - 5);
        } else if (!isColUndefined && !isWidthAuto) {
            movableWidth = this.calcMovableOrFreezeColWidth('movable');
        }
        movableWidth = this.isAutoResize() ? '100%' : movableWidth;
        if (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild) {
            (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild as HTMLTableElement).style.width
                = movableWidth;
        }
        (this.parent.getContent().querySelector('.e-movablecontent').firstElementChild as HTMLTableElement).style.width =
            movableWidth;
    }
    private setWidthToFrozenEditTable(): void {
        let freezeWidth: string = this.calcMovableOrFreezeColWidth('freeze');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        (this.parent.element.querySelectorAll('.e-table.e-inline-edit')[0] as HTMLTableElement).style.width = freezeWidth;
    }
    private setWidthToMovableEditTable(): void {
        let movableWidth: string = this.calcMovableOrFreezeColWidth('movable');
        movableWidth = this.isAutoResize() ? '100%' : movableWidth;
        (this.parent.element.querySelectorAll('.e-table.e-inline-edit')[1] as HTMLTableElement).style.width = movableWidth;
    }
    public setWidthToTable(): void {
        let tWidth: string = formatUnit(this.getTableWidth(<Column[]>this.parent.getColumns()));
        if (this.parent.isFrozenGrid()) {
            if (this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount()) {
                this.setWidthToFrozenLeftTable();
            }
            this.setWidthToMovableTable();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.setWidthToFrozenRightTable();
            }
        } else {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.setColumnWidth(new Column({ width: '30px' }));
            }
            tWidth = this.isAutoResize() ? '100%' : tWidth;
            (this.parent.getHeaderTable() as HTMLTableElement).style.width = tWidth;
            (this.parent.getContentTable() as HTMLTableElement).style.width = tWidth;
        }
        let edit: HTMLTableElement = <HTMLTableElement>this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit && this.parent.getFrozenColumns()) {
            this.setWidthToFrozenEditTable();
            this.setWidthToMovableEditTable();
        } else if (edit) {
            edit.style.width = tWidth;
        }
    }
    private isAutoResize(): boolean {
        return this.parent.allowResizing && this.parent.resizeSettings.mode === 'Auto';
    }
}