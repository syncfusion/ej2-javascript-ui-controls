import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { closest as closestElement, removeClass, classList, remove } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { getElementIndex, inArray, parentsUntil, getPosition, isActionPrevent } from '../base/util';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';

/**
 * 
 * The `Reorder` module is used for reordering columns.
 */
export class Reorder implements IAction {
    //Internal variable
    private element: HTMLElement;
    private upArrow: HTMLElement;
    private downArrow: HTMLElement;
    private x: number;
    private timer: number;

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid reorder module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.headerDrop, this.headerDrop, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.reorderComplete, this.onActionComplete, this);
        this.parent.on(events.columnDrag, this.drag, this);
        this.parent.on(events.columnDragStart, this.dragStart, this);
        this.parent.on(events.columnDragStop, this.dragStop, this);
        this.parent.on(events.headerDrop, this.headerDrop, this);
        this.parent.on(events.headerRefreshed, this.createReorderElement, this);
    }

    private chkDropPosition(srcElem: Element, destElem: Element): boolean {
        return (srcElem.parentElement.isEqualNode(destElem.parentElement) || (this.parent.getFrozenColumns()
            && Array.prototype.indexOf.call(closestElement(srcElem, 'thead').children, srcElem.parentElement)
            === Array.prototype.indexOf.call(closestElement(destElem, 'thead').children, destElem.parentElement)))
            && this.targetParentContainerIndex(srcElem, destElem) > -1;
    }

    private chkDropAllCols(srcElem: Element, destElem: Element): boolean {
        let isFound: boolean;
        let headers: Element[] = this.getHeaderCells();
        let header: Element;
        while (!isFound && headers.length > 0) {
            header = headers.pop();
            isFound = srcElem !== header && this.targetParentContainerIndex(srcElem, destElem) > -1;
        }
        return isFound;
    }

    private findColParent(col: Column, cols: Column[], parent: Column[]): boolean {
        parent = parent;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (col === cols[i]) {
                return true;
            } else if (cols[i].columns) {
                let cnt: number = parent.length;
                parent.push(cols[i]);
                if (!this.findColParent(col, cols[i].columns as Column[], parent)) {
                    parent.splice(cnt, parent.length - cnt);
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    private getColumnsModel(cols: Column[]): Column[] {
        let columnModel: Column[] = [];
        let subCols: Column[] = [];
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            columnModel.push(cols[i]);
            if (cols[i].columns) {
                subCols = subCols.concat(cols[i].columns as Column[]);
            }
        }
        if (subCols.length) {
            columnModel = columnModel.concat(this.getColumnsModel(subCols as Column[]));
        }
        return columnModel;
    }

    private headerDrop(e: { target: Element }): void {
        let gObj: IGrid = this.parent;
        let dropElement: Element = this.element.querySelector('.e-headercelldiv') || this.element.querySelector('.e-stackedheadercelldiv');
        let uId: string = dropElement.getAttribute('e-mappinguid');
        let column: Column = gObj.getColumnByUid(uId);
        if (!closestElement(e.target, 'th') || (!isNullOrUndefined(column) && column.allowReordering === false)) {
            return;
        }
        let destElem: Element = closestElement(e.target as Element, '.e-headercell');
        let destElemDiv : Element = destElem.querySelector('.e-headercelldiv') || destElem.querySelector('.e-stackedheadercelldiv');
        let destElemUid: string = destElemDiv.getAttribute('e-mappinguid');
        if (!isNullOrUndefined(destElemUid)) {
            let destColumn: Column = gObj.getColumnByUid(destElemUid);
            if (isNullOrUndefined(destColumn) || destColumn.allowReordering === false) {
                return;
            }
        }
        if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
            if (this.parent.enableColumnVirtualization) {
                let columns: Column[] = this.parent.columns as Column[];
                let sourceUid: string = this.element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
                let col: Column[] = this.parent.getColumns(true).filter((col: Column) => col.uid === sourceUid);
                let colMatchIndex: number = null;
                let column: Column = col[0];
                let destUid: string = destElem.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
                let bool: boolean = columns.some((col: Column, index: number) => {
                    if (col.uid === destUid) {
                        colMatchIndex = index;
                        return col.uid === destUid;
                    }
                    return false;
                });
                if (!isNullOrUndefined(colMatchIndex)) {
                    this.moveColumns(colMatchIndex, column);
                }
            } else {
                let headers: Element[] = this.getHeaderCells();
                let oldIdx: number = getElementIndex(this.element, headers);
                let columns: Column[] = this.getColumnsModel(this.parent.columns as Column[]);
                let column: Column = columns[oldIdx];
                let newIndex: number = this.targetParentContainerIndex(this.element, destElem);
                this.moveColumns(newIndex, column);
            }
        }
    }

    private isActionPrevent(gObj: IGrid): boolean {
        return isActionPrevent(gObj);
    }

    private moveColumns(destIndex: number, column: Column): void {
        let gObj: IGrid = this.parent;
        if (this.isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.moveColumns, arg1: destIndex, arg2: column });
            return;
        }
        let parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        let cols: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        let srcIdx: number = inArray(column, cols);
        if (!gObj.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
            return;
        }
        (cols as Column[]).splice(destIndex, 0, (cols as Column[]).splice(srcIdx, 1)[0] as Column);
        gObj.getColumns(true);
        gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
        gObj.notify(events.modelChanged, {
            type: events.actionBegin, requestType: 'reorder'
        });
    }

    private targetParentContainerIndex(srcElem: Element, destElem: Element): number {
        let headers: Element[] = this.getHeaderCells();
        let cols: Column[] = this.parent.columns as Column[];
        let flatColumns: Column[] = this.getColumnsModel(cols);
        let parent: Column = this.getColParent(flatColumns[getElementIndex(srcElem, headers)], cols);

        cols = parent ? parent.columns as Column[] : cols;
        return inArray(flatColumns[getElementIndex(destElem, headers)], cols);
    }

    private getHeaderCells(): Element[] {
        if (this.parent.getFrozenColumns()) {
            let fTh: HTMLElement[];
            let mTh: HTMLElement[];
            let fHeaders: Element[] = [];
            let fRows: Element[] = [].slice.call(this.parent.getHeaderTable().querySelectorAll('.e-columnheader'));
            let mRows: Element[] = [].slice.call(this.parent.getHeaderContent()
                .querySelector('.e-movableheader').querySelectorAll('.e-columnheader'));
            for (let i: number = 0; i < fRows.length; i++) {
                fTh = [].slice.call(fRows[i].getElementsByClassName('e-headercell'));
                mTh = [].slice.call(mRows[i].getElementsByClassName('e-headercell'));
                fHeaders = fHeaders.concat(fTh);
                for (let j: number = 0; j < mTh.length; j++) {
                    if (!fTh.length || j !== 0 || fTh[fTh.length - 1].innerText !== mTh[0].innerText) {
                        fHeaders.push(mTh[j]);
                    }
                }
            }
            return fHeaders;
        } else {
            return [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
        }
    }

    private getColParent(column: Column, columns: Column[]): Column {
        let parents: Column[] = [];
        this.findColParent(column, columns, parents);
        return parents[parents.length - 1];
    }

    /** 
     * Changes the position of the Grid columns by field names. 
     * @param  {string} fromFName - Defines the origin field name. 
     * @param  {string} toFName - Defines the destination field name. 
     * @return {void} 
     */
    public reorderColumns(fromFName: string, toFName: string): void {
        let fColumn: Column = this.parent.getColumnByField(fromFName);
        let toColumn: Column = this.parent.getColumnByField(toFName);
        if ((!isNullOrUndefined(fColumn) && !fColumn.allowReordering) || (!isNullOrUndefined(toColumn) && !toColumn.allowReordering)) {
            return;
        }
        let column: Column = this.parent.getColumnByField(toFName);
        let parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        let columns: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        let destIndex: number = inArray(column, columns);
        if (destIndex > -1) {
            this.moveColumns(destIndex, this.parent.getColumnByField(fromFName));
        }
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.createReorderElement();
        }
    }

    private createReorderElement(): void {
        let header: Element = (this.parent.element.querySelector('.e-headercontent') as Element);
        this.upArrow = header.appendChild(
            this.parent
            .createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow', attrs: { style: 'display:none' } }));
        this.downArrow = header.appendChild(
            this.parent
            .createElement('div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow', attrs: { style: 'display:none' } }));
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    }

    /**
     * To destroy the reorder 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) { return; }
        remove(this.upArrow);
        remove(this.downArrow);
        this.parent.off(events.headerDrop, this.headerDrop);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.reorderComplete, this.onActionComplete);
        this.parent.off(events.columnDrag, this.drag);
        this.parent.off(events.columnDragStart, this.dragStart);
        this.parent.off(events.columnDragStop, this.dragStop);
        this.parent.off(events.headerRefreshed, this.createReorderElement);
        //call ejdrag and drop destroy
    }

    private drag(e: { target: Element, column: Column, event: MouseEvent }): void {
        let gObj: IGrid = this.parent;
        let target: Element = e.target as Element;
        if (e.column.allowReordering === false) {
            return;
        }
        let closest: Element = closestElement(target, '.e-headercell:not(.e-stackedHeaderCell)');
        let cloneElement: HTMLElement = gObj.element.querySelector('.e-cloneproperties') as HTMLElement;
        let isLeft: boolean = this.x > getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
        this.setDisplay('none');
        this.stopTimer();
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        this.updateScrollPostion(e.event);
        if (closest && !closest.isEqualNode(this.element)) {
            target = closest;
            //consider stacked, detail header cell 
            if (!(!this.chkDropPosition(this.element, target) || !this.chkDropAllCols(this.element, target))) {
                this.updateArrowPosition(target, isLeft);
                classList(target, ['e-allowDrop', 'e-reorderindicate'], []);
            } else if (!(gObj.allowGrouping && parentsUntil(e.target as Element, 'e-groupdroparea'))) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        }
        gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: e.column });
    }

    private updateScrollPostion(e: MouseEvent | TouchEvent): void {
        let frzCols: number = this.parent.getFrozenColumns();
        let x: number = getPosition(e).x;
        let cliRect: ClientRect = this.parent.element.getBoundingClientRect();
        let cliRectBaseLeft: number = frzCols ? this.parent.element.querySelector('.e-movableheader')
            .getBoundingClientRect().left : cliRect.left;
        let cliRectBaseRight: number = cliRect.right;
        let scrollElem: Element = frzCols ? this.parent.getContent().querySelector('.e-movablecontent')
            : this.parent.getContent().firstElementChild;
        if (x > cliRectBaseLeft && x < cliRectBaseLeft + 35) {
            this.timer = window.setInterval(
                () => { this.setScrollLeft(scrollElem, true); }, 50);
        } else if (x < cliRectBaseRight && x > cliRectBaseRight - 35) {
            this.timer = window.setInterval(
                () => { this.setScrollLeft(scrollElem, false); }, 50);
        }
    }

    private setScrollLeft(scrollElem: Element, isLeft: boolean): void {
        let scrollLeft: number = scrollElem.scrollLeft;
        scrollElem.scrollLeft = scrollElem.scrollLeft + (isLeft ? -5 : 5);
        if (scrollLeft !== scrollElem.scrollLeft) {
            this.setDisplay('none');
        }
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private updateArrowPosition(target: Element, isLeft: boolean): void {
        let cliRect: ClientRect = target.getBoundingClientRect();
        let cliRectBase: ClientRect = this.parent.element.getBoundingClientRect();
        if ((isLeft && cliRect.left < cliRectBase.left) || (!isLeft && cliRect.right > cliRectBase.right)) {
            return;
        }
        this.upArrow.style.top = cliRect.top + cliRect.height - cliRectBase.top + 'px';
        this.downArrow.style.top = cliRect.top - cliRectBase.top - 4 + 'px';
        this.upArrow.style.left = this.downArrow.style.left = (isLeft ? cliRect.left : cliRect.right) - cliRectBase.left - 4 + 'px';
        this.setDisplay('');
    }

    private dragStart(e: { target: Element, column: Column, event: MouseEvent }): void {
        let gObj: IGrid = this.parent;
        let target: Element = e.target as Element;
        this.element = target.classList.contains('e-headercell') ? target as HTMLElement :
            parentsUntil(target, 'e-headercell') as HTMLElement;
        if (e.column.allowReordering === false) {
             return;
        }
        this.x = getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        gObj.trigger(events.columnDragStart, {
            target: target as Element, draggableType: 'headercell', column: e.column
        });
    }

    private dragStop(e: { target: Element, event: MouseEvent, column: Column, cancel: boolean }): void {
        let gObj: IGrid = this.parent;
        this.setDisplay('none');
        this.stopTimer();
        if (!e.cancel) {
            gObj.trigger(events.columnDrop, { target: e.target, draggableType: 'headercell', column: e.column });
        }
        removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
    }

    private setDisplay(display: string): void {
        this.upArrow.style.display = display;
        this.downArrow.style.display = display;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'reorder';
    }

}
