import { extend, isNullOrUndefined, isBlazor, KeyboardEventArgs } from '@syncfusion/ej2-base';
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
    private destElement: Element;
    private fromCol: string;

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
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
    }

    private chkDropPosition(srcElem: Element, destElem: Element): boolean {
        let col: Column = this.parent.getColumnByUid(destElem.firstElementChild.getAttribute('e-mappinguid'));
        let bool: boolean = col ? !col.lockColumn : true;
        return ((srcElem.parentElement.isEqualNode(destElem.parentElement) || this.parent.enableColumnVirtualization)
            || (this.parent.getFrozenColumns()
                && Array.prototype.indexOf.call(closestElement(srcElem, 'thead').children, srcElem.parentElement)
                === Array.prototype.indexOf.call(closestElement(destElem, 'thead').children, destElem.parentElement)))
            && this.targetParentContainerIndex(srcElem, destElem) > -1 && bool;
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
        if (!closestElement(e.target, 'th') || (!isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn))) {
            this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), column});
            return;
        }
        let destElem: Element = closestElement(e.target as Element, '.e-headercell');
        let destElemDiv: Element = destElem.querySelector('.e-headercelldiv') || destElem.querySelector('.e-stackedheadercelldiv');
        let destElemUid: string = destElemDiv.getAttribute('e-mappinguid');
        if (!isNullOrUndefined(destElemUid)) {
            let destColumn: Column = gObj.getColumnByUid(destElemUid);
            if (isNullOrUndefined(destColumn) || !destColumn.allowReordering || destColumn.lockColumn) {
                this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), column, destColumn});
                return;
            }
        }
        if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
            if (this.parent.enableColumnVirtualization) {
                let columns: Column[] = this.parent.columns as Column[];
                let sourceUid: string = this.element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
                let col: Column[] = (this.parent.columns as Column[]).filter((col: Column) => col.uid === sourceUid);
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
                let newIndex: number = this.targetParentContainerIndex(this.element, destElem);
                let uid: string = this.element.firstElementChild.getAttribute('e-mappinguid');
                this.destElement = destElem;
                if (uid) {
                    this.moveColumns(newIndex, this.parent.getColumnByUid(uid));
                } else {
                    let headers: Element[] = this.getHeaderCells();
                    let oldIdx: number = getElementIndex(this.element, headers);
                    let columns: Column[] = this.getColumnsModel(this.parent.columns as Column[]);
                    let column: Column = columns[oldIdx];
                    this.moveColumns(newIndex, column);
                }
            }
        }
    }

    private isActionPrevent(gObj: IGrid): boolean {
        return isActionPrevent(gObj);
    }

    private moveColumns(destIndex: number, column: Column, reorderByColumn?: boolean, preventRefresh?: boolean): void {
        let gObj: IGrid = this.parent;
        if (this.isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.moveColumns, arg1: destIndex, arg2: column });
            return;
        }
        let parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        let cols: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        let srcIdx: number = inArray(column, cols);
        if (((this.parent.getFrozenColumns() && parent) || this.parent.lockcolPositionCount) && !reorderByColumn) {
            for (let i: number = 0; i < cols.length; i++) {
                if (cols[i].field === column.field) {
                    srcIdx = i;
                    break;
                }
            }
            let col: Column =
            this.parent.getColumnByUid(this.destElement.firstElementChild.getAttribute('e-mappinguid'));
            if (col) {
                for (let i: number = 0; i < cols.length; i++) {
                    if (cols[i].field === col.field) {
                        destIndex = i;
                        break;
                    }
                }
            } else {
                for (let i: number = 0; i < cols.length; i++) {
                    if (cols[i].headerText === (this.destElement as HTMLElement).innerText.trim()) {
                        destIndex = i;
                    }
                }
            }
        }
        if (!gObj.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
            return;
        }
        (cols as Column[]).splice(destIndex, 0, (cols as Column[]).splice(srcIdx, 1)[0] as Column);
        gObj.getColumns(true);
        gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
        if (preventRefresh !== false) {
            gObj.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'reorder', fromIndex: destIndex, toIndex: srcIdx, toColumnUid: column.uid
            });
        }
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
        let frozenColumns: number = this.parent.getFrozenColumns();
        if (frozenColumns || this.parent.lockcolPositionCount) {
            let fTh: HTMLElement[];
            let mTh: HTMLElement[];
            let fHeaders: Element[] = [];
            let fRows: Element[] = [].slice.call(this.parent.getHeaderTable().querySelectorAll('.e-columnheader'));
            if (frozenColumns) {
                let mRows: Element[] = [].slice.call(this.parent.getHeaderContent()
                .querySelector('.e-movableheader').querySelectorAll('.e-columnheader'));
                for (let i: number = 0; i < fRows.length; i++) {
                    fTh = [].slice.call(fRows[i].getElementsByClassName('e-headercell'));
                    mTh = [].slice.call(mRows[i].getElementsByClassName('e-headercell'));
                    let isAvail: boolean;
                    for (let k: number = 0; k < fTh.length; k++) {
                        for (let j: number = 0; j < mTh.length; j++) {
                            if (mTh[j].innerText === fTh[k].innerText) {
                                isAvail = true;
                                break;
                            }
                        }
                        if (!isAvail) {
                            fHeaders = fHeaders.concat([fTh[k]]);
                        }
                    }
                    for (let j: number = 0; j < mTh.length; j++) {
                        fHeaders.push(mTh[j]);
                    }
                }
            } else {
                for (let i: number = 0; i < fRows.length; i++) {
                    mTh = [].slice.call(fRows[i].getElementsByClassName('e-headercell'));
                    for (let k: number = 0; k < mTh.length; k++) {
                        let isAvail: boolean;
                        for (let j: number = k + 1; j < mTh.length; j++) {
                            if (mTh[j].innerText === mTh[k].innerText) {
                                isAvail = true;
                                break;
                            }
                        }
                        if (!isAvail) {
                            fHeaders = fHeaders.concat([mTh[k]]);
                        }
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

    private reorderSingleColumn(fromFName: string, toFName: string): void {
        let fColumn: Column = this.parent.enableColumnVirtualization ?
            (this.parent.columns as Column[]).filter((col: Column) => col.field === fromFName)[0]
            : this.parent.getColumnByField(fromFName);
        let toColumn: Column = this.parent.enableColumnVirtualization ?
            (this.parent.columns as Column[]).filter((col: Column) => col.field === toFName)[0]
            : this.parent.getColumnByField(toFName);
        if ((!isNullOrUndefined(fColumn) && (!fColumn.allowReordering || fColumn.lockColumn)) ||
            (!isNullOrUndefined(toColumn) && (!toColumn.allowReordering || fColumn.lockColumn))) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), column: fColumn, destColumn: toColumn });
            return;
        }
        let column: Column = toColumn;
        let parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        let columns: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        let destIndex: number = inArray(column, columns);
        if (destIndex > -1) {
            this.moveColumns(destIndex, fColumn, true);
        }
    }

    private reorderMultipleColumns(fromFNames: string[], toFName: string): void {
        let toIndex: number = this.parent.getColumnIndexByField(toFName);
        let toColumn: Column = this.parent.getColumnByField(toFName);
        if (toIndex < 0 || (!isNullOrUndefined(toColumn) && (!toColumn.allowReordering || toColumn.lockColumn))) {
            return;
        }
        for (let i: number = 0; i < fromFNames.length; i++) {
            let column: Column = this.parent.getColumnByField(fromFNames[i]);
            if (!isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn)) {
                return;
            }
        }
        for (let i: number = 0; i < fromFNames.length; i++) {
            let column: Column = this.parent.getColumnByIndex(toIndex);
            let parent: Column = this.getColParent(column, this.parent.columns as Column[]);
            let columns: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
            let destIndex: number = inArray(column, columns);
            if (destIndex > -1) {
                this.moveColumns(
                    destIndex, this.parent.getColumnByField(fromFNames[i]), true, !(isBlazor() && !this.parent.isJsComponent));
            }
            if (this.parent.getColumnIndexByField(fromFNames[i + 1]) >= destIndex) {
                toIndex++; //R to L
            }
        }

        if (isBlazor() && !this.parent.isJsComponent) {
            let cols: Column[] = this.parent.getColumns();
            this.parent.notify(events.modelChanged, {
                fromColumnUid: fromFNames.map((name: string) => cols.filter((col: Column) => col.field === name)[0].uid),
                toColumnUid: toColumn.uid,
                isMultipleReorder: true,
                requestType: 'reorder',
                type: 'actionBegin'
            });
        }
    }

    private moveTargetColumn(column: Column, toIndex: number) : void {
        if (toIndex > -1) {
            this.moveColumns(toIndex, column, true);
        }
    }

    private reorderSingleColumnByTarget(fieldName: string, toIndex: number): void {
        let column: Column = this.parent.getColumnByField(fieldName);
        this.moveTargetColumn(column, toIndex);
    }

    private reorderMultipleColumnByTarget(fieldName: string[], toIndex: number): void {
        for (let i: number = 0; i < fieldName.length; i++) {
            this.reorderSingleColumnByTarget(fieldName[i], toIndex);
        }
    }

    /** 
     * Changes the position of the Grid columns by field names. 
     * @param  {string | string[]} fromFName - Defines the origin field names. 
     * @param  {string} toFName - Defines the destination field name.
     * @return {void} 
     */
    public reorderColumns(fromFName: string | string[], toFName: string): void {
        if (typeof fromFName === 'string') {
            this.reorderSingleColumn(fromFName, toFName);
            this.fromCol = fromFName;
        } else {
            this.reorderMultipleColumns(fromFName, toFName);
            this.fromCol = fromFName[0];
        }
    }

    /** 
     * Changes the position of the Grid columns by field index. 
     * @param  {number} fromIndex - Defines the origin field index. 
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void} 
     */
    public reorderColumnByIndex(fromIndex: number, toIndex: number): void {
        let column: Column = this.parent.getColumnByIndex(fromIndex);
        this.moveTargetColumn(column, toIndex);
    }

    /** 
     * Changes the position of the Grid columns by field index. 
     * @param  {string | string[]} fieldName - Defines the field name. 
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void} 
     */
    public reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void {
        typeof fieldName === 'string' ? this.reorderSingleColumnByTarget(fieldName, toIndex) :
        this.reorderMultipleColumnByTarget(fieldName, toIndex);
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.createReorderElement();
        }
    }

    private createReorderElement(e?: { args: { isFrozen?: boolean, isXaxis?: boolean } }): void {
        if (e && e.args.isXaxis) {
            this.setDisplay('none');
        }
        let header: Element = (this.parent.element.querySelector('.e-headercontent') as Element);
        this.upArrow = header.appendChild(
            this.parent
                .createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow', attrs: { style: 'display:none' } }));
        this.downArrow = header.appendChild(
            this.parent
                .createElement(
                    'div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow', attrs: { style: 'display:none' } }));
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        if (isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
        let target: Element = this.fromCol && this.parent.getColumnHeaderByField(this.fromCol);
        if (target) {
            this.parent.focusModule.onClick({ target }, true);
        }
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
        this.parent.off(events.keyPressed, this.keyPressHandler);
        //call ejdrag and drop destroy
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let gObj: IGrid = this.parent;
        switch (e.action) {
            case 'ctrlLeftArrow':
            case 'ctrlRightArrow':
                let element: HTMLElement = gObj.focusModule.currentInfo.element;
                if (element && element.classList.contains('e-headercell')) {
                    let column: Column = gObj.getColumnByUid(element.firstElementChild.getAttribute('e-mappinguid'));
                    let visibleCols: Column[] = gObj.getVisibleColumns();
                    let index: number = visibleCols.indexOf(column);
                    let toCol: Column = e.action === 'ctrlLeftArrow' ? visibleCols[index - 1] : visibleCols[index + 1];
                    if (toCol && toCol.field && column.field) {
                        this.reorderColumns(column.field, toCol.field);
                    }
                }
                break;
        }
    }

    private drag(e: { target: Element, column: Column, event: MouseEvent }): void {
        let gObj: IGrid = this.parent;
        let target: Element = e.target as Element;
        if (!e.column.allowReordering || e.column.lockColumn) {
            return;
        }
        let closest: Element = closestElement(target, '.e-headercell:not(.e-stackedHeaderCell)');
        let cloneElement: HTMLElement = gObj.element.querySelector('.e-cloneproperties') as HTMLElement;
        let content: Element = gObj.getFrozenColumns() ? gObj.getMovableVirtualContent() : gObj.getContent().firstElementChild;
        let isLeft: boolean = this.x > getPosition(e.event).x + content.scrollLeft;
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
        if (this.parent.getFrozenColumns() && target.classList.contains('e-headercell')) {
            let col: Column = this.parent.getColumnByUid(target.firstElementChild.getAttribute('e-mappinguid'));
            let fhdrWidth: number = Math.round(this.parent.getFrozenVirtualHeader().getBoundingClientRect().right);
            let mhdrRight: number = Math.round(this.parent.getMovableVirtualHeader().getBoundingClientRect().right);
            if (col && this.parent.getNormalizedColumnIndex(col.uid) >= this.parent.getFrozenColumns()
                && ((isLeft && Math.round(cliRect.left) < fhdrWidth) || (!isLeft && mhdrRight < cliRect.right))) {
                return;
            }
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
        if (!e.column.allowReordering || e.column.lockColumn) {
             return;
        }
        let content: Element = gObj.getFrozenColumns() ? gObj.getMovableVirtualContent() : gObj.getContent().firstElementChild;
        this.x = getPosition(e.event).x + content.scrollLeft;
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
