import { extend, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { closest as closestElement, removeClass, classList, remove } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { getElementIndex, inArray, parentsUntil, getPosition, isActionPrevent } from '../base/util';
import { IGrid, IAction, NotifyArgs, FrozenReorderArgs, ReorderEventArgs } from '../base/interface';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';

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
    private idx: number = 0;

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid reorder module
     *
     * @param {IGrid} parent - specifies the IGrid
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
        this.parent.on(events.destroy, this.destroy, this);
    }

    private chkDropPosition(srcElem: Element, destElem: Element): boolean {
        const col: Column = this.parent.getColumnByUid(destElem.firstElementChild.getAttribute('data-mappinguid'));
        const bool: boolean = col ? !col.lockColumn : true;
        return ((srcElem.parentElement.isEqualNode(destElem.parentElement) || this.parent.enableColumnVirtualization)
            || (this.parent.isFrozenGrid()
                && Array.prototype.indexOf.call(closestElement(srcElem, 'thead').children, srcElem.parentElement)
                === Array.prototype.indexOf.call(closestElement(destElem, 'thead').children, destElem.parentElement)))
            && this.targetParentContainerIndex(srcElem, destElem) > -1 && bool;
    }

    private chkDropAllCols(srcElem: Element, destElem: Element): boolean {
        let isFound: boolean;
        const headers: Element[] = this.getHeaderCells();
        let header: Element;
        while (!isFound && headers.length > 0) {
            header = headers.pop();
            isFound = srcElem !== header && this.targetParentContainerIndex(srcElem, destElem) > -1;
        }
        return isFound;
    }

    private findColParent(col: Column, cols: Column[], parent: Column[]): boolean {
        // eslint-disable-next-line no-self-assign
        parent = parent;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (col === cols[parseInt(i.toString(), 10)]) {
                return true;
            } else if (cols[parseInt(i.toString(), 10)].columns) {
                const cnt: number = parent.length;
                parent.push(cols[parseInt(i.toString(), 10)]);
                if (!this.findColParent(col, cols[parseInt(i.toString(), 10)].columns as Column[], parent)) {
                    parent.splice(cnt, parent.length - cnt);
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    private getColumnsModel(cols: Column[], isNotStackedHeader?: boolean): Column[] {
        let columnModel: Column[] = [];
        let subCols: Column[] = [];
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (!isNullOrUndefined(cols[parseInt(i.toString(), 10)])) {
                if (cols[parseInt(i.toString(), 10)].visible) {
                    columnModel.push(cols[parseInt(i.toString(), 10)]);
                }
                else if (isNotStackedHeader) {
                    columnModel.push(cols[parseInt(i.toString(), 10)]);
                }
                if (cols[parseInt(i.toString(), 10)].columns) {
                    subCols = subCols.concat(cols[parseInt(i.toString(), 10)].columns as Column[]);
                }
            }
        }
        if (subCols.length) {
            columnModel = columnModel.concat(this.getColumnsModel(subCols as Column[]));
        }
        return columnModel;
    }

    private headerDrop(e: { target: Element }): void {
        const gObj: IGrid = this.parent;
        const dropElement: Element = this.element.querySelector('.e-headercelldiv') || this.element.querySelector('.e-stackedheadercelldiv');
        const uId: string = dropElement.getAttribute('data-mappinguid');
        const column: Column = gObj.getColumnByUid(uId);
        if (!closestElement(e.target, 'th') || (!isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn))) {
            this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), column});
            return;
        }
        const destElem: Element = closestElement(e.target as Element, '.e-headercell');
        const destElemDiv: Element = destElem.querySelector('.e-headercelldiv') || destElem.querySelector('.e-stackedheadercelldiv');
        const destElemUid: string = destElemDiv.getAttribute('data-mappinguid');
        if (!isNullOrUndefined(destElemUid)) {
            const destColumn: Column = gObj.getColumnByUid(destElemUid);
            if (isNullOrUndefined(destColumn) || !destColumn.allowReordering || destColumn.lockColumn) {
                this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), column, destColumn});
                return;
            }
        }
        if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
            if (this.parent.enableColumnVirtualization) {
                const columns: Column[] = this.parent.columns as Column[];
                const sourceUid: string = this.element.querySelector('.e-headercelldiv').getAttribute('data-mappinguid');
                const col: Column[] = (this.parent.columns as Column[]).filter((col: Column) => col.uid === sourceUid);
                let colMatchIndex: number = null;
                const column: Column = col[0];
                const destUid: string = destElem.querySelector('.e-headercelldiv').getAttribute('data-mappinguid');
                columns.some((col: Column, index: number) => {
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
                const newIndex: number = this.targetParentContainerIndex(this.element, destElem);
                const uid: string = this.element.firstElementChild.getAttribute('data-mappinguid');
                this.destElement = destElem;
                this.parent.notify(events.setReorderDestinationElement, { ele: destElem });
                if (uid) {
                    this.moveColumns(newIndex, this.parent.getColumnByUid(uid));
                } else {
                    const headers: Element[] = this.getHeaderCells();
                    const oldIdx: number = getElementIndex(this.element, headers);
                    const columns: Column[] = this.getColumnsModel(this.parent.columns as Column[]);
                    this.moveColumns(newIndex, columns[parseInt(oldIdx.toString(), 10)]);
                }
            }
        }
    }

    private isActionPrevent(gObj: IGrid): boolean {
        return isActionPrevent(gObj);
    }

    private moveColumns(destIndex: number, column: Column, reorderByColumn?: boolean, preventRefresh?: boolean): void {
        const gObj: IGrid = this.parent;
        if (this.isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.moveColumns, arg1: destIndex, arg2: column });
            return;
        }
        const parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        const cols: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        let srcIdx: number = inArray(column, cols);
        if ((parent || this.parent.lockcolPositionCount) && !reorderByColumn &&
            !this.parent.enableColumnVirtualization) {
            for (let i: number = 0; i < cols.length; i++) {
                if (cols[parseInt(i.toString(), 10)].field === column.field) {
                    srcIdx = i;
                    break;
                }
            }
            const col: Column =
            this.parent.getColumnByUid(this.destElement.firstElementChild.getAttribute('data-mappinguid'));
            if (col) {
                for (let i: number = 0; i < cols.length; i++) {
                    if (cols[parseInt(i.toString(), 10)].field === col.field) {
                        destIndex = i;
                        break;
                    }
                }
            } else {
                for (let i: number = 0; i < cols.length; i++) {
                    if (cols[parseInt(i.toString(), 10)].headerText === (this.destElement as HTMLElement).innerText.trim()) {
                        destIndex = i;
                    }
                }
            }
        }
        if (!gObj.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
            return;
        }
        (cols as Column[]).splice(destIndex, 0, (cols as Column[]).splice(srcIdx, 1)[0] as Column);
        const args: FrozenReorderArgs = { column: column, destIndex: destIndex, columns: cols, parent: parent, cancel: false };
        gObj.notify(events.refreshFrozenColumns, args);
        if (args.cancel) { return; }
        if (this.parent.isFrozenGrid()) {
            if (this.parent.frozenColumns) {
                for (let i: number = 0; i < cols.length; i++) {
                    if (cols[parseInt(i.toString(), 10)].freeze === 'Left') {
                        cols[parseInt(i.toString(), 10)].freeze = undefined;
                    }
                }
            } else if (!(parent && parent.columns)) {
                if (this.parent.getFrozenLeftCount() > destIndex) {
                    column.freeze = 'Left';
                } else if ((cols.length - this.parent.getFrozenRightColumnsCount()) <= destIndex) {
                    column.freeze = 'Right';
                } else {
                    column.freeze = column.freeze === 'Fixed' ? 'Fixed' : undefined;
                }
            }
        }
        if (preventRefresh !== false) {
            const reorderArgs: ReorderEventArgs = { type: events.actionBegin, requestType: 'reorder', fromIndex: destIndex, toIndex: srcIdx, toColumnUid: column.uid, cancel: false };
            gObj.notify(events.modelChanged, reorderArgs);
            if (reorderArgs.cancel) {
                (cols as Column[]).splice(srcIdx, 0, (cols as Column[]).splice(destIndex, 1)[0] as Column);
                return;
            }
        }
        gObj.getColumns(true);
        gObj.preventAutoFit = true;
        gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
        if (this.parent.isFrozenGrid()) {
            const cols: Column[] = this.parent.columns as Column[];
            this.idx = 0;
            this.refreshColumnIndex(cols);
            this.parent.notify(events.refreshFrozenPosition, { });
        }
    }

    private refreshColumnIndex(cols?: Column[]): void {
        for (let i: number = 0; i < cols.length; i++) {
            cols[parseInt(i.toString(), 10)].index = this.idx;
            this.idx++;
            if (cols[parseInt(i.toString(), 10)].columns && cols[parseInt(i.toString(), 10)].columns.length) {
                this.refreshColumnIndex(cols[parseInt(i.toString(), 10)].columns as Column[]);
            }
        }
    }

    private targetParentContainerIndex(srcElem: Element, destElem: Element): number {
        let cols: Column[] = this.parent.columns as Column[];
        const headers: Element[] = this.getHeaderCells();
        const stackedHdrColumn: Column[] = this.parent.getStackedColumns(cols);
        let stackedCols: Column[] = [];
        if (stackedHdrColumn.length) {
            stackedCols = this.getAllStackedheaderParentColumns(headers);
        }
        const flatColumns: Column[] = stackedHdrColumn.length && stackedCols.length ?
            this.getColumnsModel(stackedCols) : this.getColumnsModel(cols, true);
        const parent: Column = this.getColParent(flatColumns[getElementIndex(srcElem, headers)], cols);

        cols = parent ? parent.columns as Column[] : cols;
        return inArray(flatColumns[getElementIndex(destElem, headers)], cols);

    }

    private getAllStackedheaderParentColumns(headers: Element[]): Column[] {
        const stackedCols: Column[] = [];
        for (let i: number = 0; i < headers.length; i++) {
            if (headers[parseInt(i.toString(), 10)].classList.contains('e-hide')) {
                headers.splice(i, 1);
                i--;
            }
            else if (headers[parseInt(i.toString(), 10)].closest('thead').firstChild === headers[parseInt(i.toString(), 10)].parentElement) {
                stackedCols.push(this.parent.getColumnByUid(headers[parseInt(i.toString(), 10)].firstElementChild.getAttribute('data-mappinguid')));
            }
        }
        return stackedCols;
    }

    private getHeaderCells(): Element[] {
        return [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
    }

    private getColParent(column: Column, columns: Column[]): Column {
        const parents: Column[] = [];
        this.findColParent(column, columns, parents);
        return parents[parents.length - 1];
    }

    private reorderSingleColumn(fromFName: string, toFName: string): void {
        const fColumn: Column = this.parent.enableColumnVirtualization ?
            (this.parent.columns as Column[]).filter((col: Column) => col.field === fromFName)[0]
            : this.parent.getColumnByField(fromFName);
        const toColumn: Column = this.parent.enableColumnVirtualization ?
            (this.parent.columns as Column[]).filter((col: Column) => col.field === toFName)[0]
            : this.parent.getColumnByField(toFName);
        if ((!isNullOrUndefined(fColumn) && (!fColumn.allowReordering || fColumn.lockColumn)) ||
            (!isNullOrUndefined(toColumn) && (!toColumn.allowReordering || toColumn.lockColumn))) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), column: fColumn, destColumn: toColumn });
            return;
        }
        const column: Column = toColumn;
        const parent: Column = this.getColParent(column, this.parent.columns as Column[]);
        const columns: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
        const destIndex: number = inArray(column, columns);
        if (destIndex > -1) {
            this.moveColumns(destIndex, fColumn, true);
        }
    }

    private reorderMultipleColumns(fromFNames: string[], toFName: string): void {
        let toIndex: number = this.parent.getColumnIndexByField(toFName);
        const toColumn: Column = this.parent.getColumnByField(toFName);
        if (toIndex < 0 || (!isNullOrUndefined(toColumn) && (!toColumn.allowReordering || toColumn.lockColumn))) {
            return;
        }
        for (let i: number = 0; i < fromFNames.length; i++) {
            const column: Column = this.parent.getColumnByField(fromFNames[parseInt(i.toString(), 10)]);
            if (!isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn)) {
                return;
            }
        }
        for (let i: number = 0; i < fromFNames.length; i++) {
            const column: Column = this.parent.getColumnByIndex(toIndex);
            const parent: Column = this.getColParent(column, this.parent.columns as Column[]);
            const columns: Column[] = parent ? parent.columns as Column[] : this.parent.columns as Column[];
            const destIndex: number = inArray(column, columns);
            if (destIndex > -1) {
                this.moveColumns(
                    destIndex, this.parent.getColumnByField(fromFNames[parseInt(i.toString(), 10)]), true, true);
            }
            if (this.parent.getColumnIndexByField(fromFNames[i + 1]) >= destIndex) {
                toIndex++; //R to L
            }
        }
    }

    private moveTargetColumn(column: Column, toIndex: number) : void {
        if (toIndex > -1) {
            this.moveColumns(toIndex, column, true);
        }
    }

    private reorderSingleColumnByTarget(fieldName: string, toIndex: number): void {
        this.moveTargetColumn(this.parent.getColumnByField(fieldName), toIndex);
    }

    private reorderMultipleColumnByTarget(fieldName: string[], toIndex: number): void {
        for (let i: number = 0; i < fieldName.length; i++) {
            this.reorderSingleColumnByTarget(fieldName[parseInt(i.toString(), 10)], toIndex);
        }
    }

    /**
     * Changes the position of the Grid columns by field names.
     *
     * @param  {string | string[]} fromFName - Defines the origin field names.
     * @param  {string} toFName - Defines the destination field name.
     * @returns {void}
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
     * Reorders a column in the Grid using column models.
     *
     * Moves the specified column (fromColumn) before the target column (toColumn),
     * supporting both standard and stacked header columns.
     *
     * @param {Column} fromColumn - The column model to be moved.
     * @param {Column} toColumn - The target column model before which the source column will be placed.
     *
     * @returns {void}
     */
    public reorderColumnByModel(fromColumn: Column, toColumn: Column): void {
        if (!isNullOrUndefined(fromColumn) && !isNullOrUndefined(toColumn) && fromColumn instanceof Column && toColumn instanceof Column) {
            if (!fromColumn.allowReordering || fromColumn.lockColumn || !toColumn.allowReordering || toColumn.lockColumn) {
                this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), column: fromColumn, destColumn: toColumn });
                return;
            }
            const destinationIndex: number = this.targetParentContainerIndex(this.parent.getColumnHeaderByUid(fromColumn.uid),
                                                                             this.parent.getColumnHeaderByUid(toColumn.uid));
            this.moveTargetColumn(fromColumn, destinationIndex);
        }
    }

    /**
     * Changes the position of the Grid columns by field index.
     *
     * @param  {number} fromIndex - Defines the origin field index.
     * @param  {number} toIndex - Defines the destination field index.
     * @returns {void}
     */
    public reorderColumnByIndex(fromIndex: number, toIndex: number): void {
        this.moveTargetColumn(this.parent.getColumnByIndex(fromIndex), toIndex);
    }

    /**
     * Changes the position of the Grid columns by field index.
     *
     * @param  {string | string[]} fieldName - Defines the field name.
     * @param  {number} toIndex - Defines the destination field index.
     * @returns {void}
     */
    public reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void {
        if (typeof fieldName === 'string') {
            this.reorderSingleColumnByTarget(fieldName, toIndex);
        } else {
            this.reorderMultipleColumnByTarget(fieldName, toIndex);
        }
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.createReorderElement();
        }
    }

    private createReorderElement(e?: { args: { isFrozen?: boolean, isXaxis?: boolean } }): void {
        if (e && e.args && e.args.isXaxis) {
            this.setDisplay('none');
        }
        const header: Element = (this.parent.element.querySelector('.' + literals.headerContent) as Element);
        const upArrowDiv: HTMLElement = this.parent.createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow' });
        upArrowDiv.style.display = 'none';
        this.upArrow = upArrowDiv;
        header.appendChild(this.upArrow);
        const downArrowDiv: HTMLElement = this.parent
            .createElement('div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow' });
        downArrowDiv.style.display = 'none';
        this.downArrow = downArrowDiv;
        header.appendChild(this.downArrow);
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specified the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.preventAutoFit = false;
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
        const target: Element = this.fromCol && this.parent.getColumnHeaderByField(this.fromCol);
        if (target) {
            this.parent.focusModule.onClick({ target }, true);
        }
    }

    /**
     * To destroy the reorder
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.' + literals.gridHeader) &&
            !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        if (this.upArrow.parentNode) {
            remove(this.upArrow);
        }
        if (this.downArrow.parentNode) {
            remove(this.downArrow);
        }
        this.parent.off(events.headerDrop, this.headerDrop);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.reorderComplete, this.onActionComplete);
        this.parent.off(events.columnDrag, this.drag);
        this.parent.off(events.columnDragStart, this.dragStart);
        this.parent.off(events.columnDragStop, this.dragStop);
        this.parent.off(events.headerRefreshed, this.createReorderElement);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.destroy, this.destroy);
        //call ejdrag and drop destroy
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey) {
            if (e.action === 'leftArrow') {
                e.action = 'ctrlLeftArrow';
            } else if (e.action === 'rightArrow') {
                e.action = 'ctrlRightArrow';
            }
        }
        switch (e.action) {
        case 'ctrlLeftArrow':
        case 'ctrlRightArrow':
            // eslint-disable-next-line no-case-declarations
            const element: HTMLElement = gObj.focusModule.currentInfo.element;
            if (element && element.classList.contains('e-headercell')) {
                const column: Column = gObj.getColumnByUid(element.firstElementChild.getAttribute('data-mappinguid'));
                const visibleCols: Column[] = gObj.getVisibleColumns();
                const index: number = visibleCols.indexOf(column);
                const toCol: Column = e.action === 'ctrlLeftArrow' ? visibleCols[index - 1] : visibleCols[index + 1];
                if (toCol && toCol.field && column.field) {
                    this.reorderColumns(column.field, toCol.field);
                }
            }
            break;
        }
    }

    private drag(e: { target: Element, column: Column, event: MouseEvent }): void {
        const gObj: IGrid = this.parent;
        let target: Element = e.target as Element;
        const closest: Element = closestElement(target, '.e-headercell:not(.e-stackedHeaderCell)');
        const cloneElement: HTMLElement = gObj.element.querySelector('.e-cloneproperties') as HTMLElement;
        const content: Element = gObj.getContent().firstElementChild;
        const isLeft: boolean = this.x > getPosition(e.event).x + content.scrollLeft;
        removeClass([].slice.call(gObj.getHeaderTable().getElementsByClassName('e-reorderindicate')), ['e-reorderindicate']);
        this.setDisplay('none');
        this.stopTimer();
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        this.updateScrollPostion(e.event);
        if (closest && !closest.isEqualNode(this.element)) {
            target = closest;
            //consider stacked, detail header cell
            const uid: string = target.querySelector('.e-headercelldiv, .e-stackedheadercelldiv').getAttribute('data-mappinguid');
            if (!(!this.chkDropPosition(this.element, target) || !this.chkDropAllCols(this.element, target)) &&
                gObj.getColumnByUid(uid).allowReordering && e.column.allowReordering) {
                this.updateArrowPosition(target, isLeft);
                classList(target, ['e-allowDrop', 'e-reorderindicate'], []);
            } else if (!(gObj.allowGrouping && parentsUntil(e.target as Element, 'e-groupdroparea'))) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        } else {
            if (closest && closest.isEqualNode(this.element) &&
                !((gObj.allowGrouping && e.column.allowGrouping) || e.column.allowReordering)) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
            else if (!closest && !(gObj.allowGrouping && parentsUntil(e.target as Element, 'e-groupdroparea'))) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        }
        if (!e.column.allowReordering || e.column.lockColumn) {
            return;
        }
        gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: e.column });
    }

    private updateScrollPostion(e: MouseEvent | TouchEvent): void {
        const x: number = getPosition(e).x;
        const cliRect: ClientRect = this.parent.element.getBoundingClientRect();
        const cliRectBaseRight: number = cliRect.right;
        const cliRectBaseLeft: number = cliRect.left;
        const scrollElem: Element = this.parent.getContent().firstElementChild;
        if (x > cliRectBaseLeft && x < cliRectBaseLeft + 35) {
            this.timer = window.setInterval(
                () => { this.setScrollLeft(scrollElem, true); }, 50);
        } else if (x < cliRectBaseRight && x > cliRectBaseRight - 35) {
            this.timer = window.setInterval(
                () => { this.setScrollLeft(scrollElem, false); }, 50);
        }
    }

    private setScrollLeft(scrollElem: Element, isLeft: boolean): void {
        const scrollLeft: number = scrollElem.scrollLeft;
        scrollElem.scrollLeft = scrollElem.scrollLeft + (isLeft ? -5 : 5);
        if (scrollLeft !== scrollElem.scrollLeft) {
            this.setDisplay('none');
        }
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private updateArrowPosition(target: Element, isLeft: boolean): void {
        const cliRect: ClientRect = target.getBoundingClientRect();
        const cliRectBase: ClientRect = this.parent.element.getBoundingClientRect();
        if ((isLeft && cliRect.left < cliRectBase.left) || (!isLeft && cliRect.right > cliRectBase.right)) {
            return;
        }
        const isSticky: boolean = this.parent.getHeaderContent().classList.contains('e-sticky');
        this.upArrow.style.top = isSticky ? cliRect.top + cliRect.height + 'px' : cliRect.top + cliRect.height - cliRectBase.top + 'px';
        this.downArrow.style.top = isSticky ? cliRect.top - 7 + 'px' : cliRect.top - cliRectBase.top - 7 + 'px';
        this.upArrow.style.left = this.downArrow.style.left = isSticky ? (isLeft ? cliRect.left : cliRect.right) - 4 + 'px' :
            (isLeft ? cliRect.left : cliRect.right) - cliRectBase.left - 4 + 'px';
        this.setDisplay('');
    }

    private dragStart(e: { target: Element, column: Column, event: MouseEvent }): void {
        const gObj: IGrid = this.parent;
        const target: Element = e.target as Element;
        this.element = target.classList.contains('e-headercell') ? target as HTMLElement :
            parentsUntil(target, 'e-headercell') as HTMLElement;
        if (!e.column.allowReordering || e.column.lockColumn) {
            return;
        }
        const content: Element = gObj.getContent().firstElementChild;
        this.x = getPosition(e.event).x + content.scrollLeft;
        gObj.trigger(events.columnDragStart, {
            target: target, draggableType: 'headercell', column: e.column
        });
    }

    private dragStop(e: { target: Element, event: MouseEvent, column: Column, cancel: boolean }): void {
        const gObj: IGrid = this.parent;
        this.setDisplay('none');
        this.stopTimer();
        if (!e.cancel) {
            gObj.trigger(events.columnDrop, { target: e.target, draggableType: 'headercell', column: e.column });
        }
        removeClass([].slice.call(gObj.getHeaderTable().getElementsByClassName('e-reorderindicate')), ['e-reorderindicate']);
    }

    private setDisplay(display: string): void {
        this.upArrow.style.display = display;
        this.downArrow.style.display = display;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} return the module name
     * @private
     */
    protected getModuleName(): string {
        return 'reorder';
    }
}
