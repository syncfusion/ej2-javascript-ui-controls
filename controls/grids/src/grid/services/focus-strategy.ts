import { EventHandler, getValue, KeyboardEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, removeClass, extend, Browser } from '@syncfusion/ej2-base';
import { IGrid, IFocus, FocusInfo, FocusedContainer, IIndex, CellFocusArgs, SwapInfo, GroupEventArgs } from '../base/interface';
import { CellType } from '../base/enum';
import * as event from '../base/constant';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { NotifyArgs, EJ2Intance } from '../base/interface';
import { RowModelGenerator } from './row-model-generator';
import { parentsUntil, addRemoveEventListener, findCellIndex } from '../base/util';
import * as literals from '../base/string-literals';
import { Grid } from '../base/grid';
import { Group } from '../actions/group';

/**
 * FocusStrategy class
 *
 * @hidden
 */
export class FocusStrategy {
    public parent: IGrid;
    public currentInfo: FocusInfo = {};
    public oneTime: boolean = true;
    public swap: SwapInfo = {};
    public content: IFocus; public header: IFocus; public active: IFocus;
    /** @hidden */
    public isInfiniteScroll: boolean = false;
    private forget: boolean = false;
    private skipFocus: boolean = true;
    private focusByClick: boolean = false;
    private firstHeaderCellClick: boolean = false;
    private passiveHandler: EventListener;
    private prevIndexes: IIndex = {};
    private focusedColumnUid: string;
    private refMatrix: Function = this.refreshMatrix(true);
    private rowModelGen: RowModelGenerator;
    private activeKey: string;
    private empty: string;
    private actions: string[] = ['downArrow', 'upArrow'];
    private isVirtualScroll: boolean = false;
    private evtHandlers: { event: string, handler: Function }[];

    constructor(parent: IGrid) {
        this.parent = parent;
        this.rowModelGen = new RowModelGenerator(this.parent);
        this.addEventListener();
    }

    protected focusCheck(e: Event): void {
        const target: HTMLElement = <HTMLElement>e.target;
        this.focusByClick = true;
        this.firstHeaderCellClick = true;
        this.skipFocus = target.classList.contains('e-grid');
    }

    protected onFocus(e?: FocusEvent): void {
        if (this.parent.isDestroyed || Browser.isDevice || this.parent.enableVirtualization
            || this.parent.element.querySelector('.e-masked-table') || (!this.parent.isInitialLoad && e
            && e.target === this.parent.element && this.parent.element.querySelector('.e-spin-show'))) { return; }
        this.setActive(!this.parent.enableHeaderFocus && this.parent.frozenRows === 0);
        if (!this.parent.enableHeaderFocus && !this.parent.getCurrentViewRecords().length && ((this.parent.editSettings.mode !== 'Batch')
            || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule && !this.parent.editModule.getBatchChanges()[literals.addedRecords].length))) {
            this.getContent().matrix.
                generate(
                    this.rowModelGen.generateRows({ rows: [new Row<Column>({ isDataRow: true })] }),
                    this.getContent().selector, false);
        }
        const current: number[] = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus && !(e && e.target === this.parent.element)) {
            this.focus(e);
            this.skipFocus = false;
        }
    }

    protected passiveFocus(e: FocusEvent): void {
        if (this.parent.isDestroyed) { return; }
        const firstHeaderCell: Element = this.parent.getHeaderContent().querySelector('.e-headercell');
        if (e.target === firstHeaderCell && e.relatedTarget && !parentsUntil((e.relatedTarget as Element), 'e-grid')
            && !this.firstHeaderCellClick) {
            this.currentInfo.element = e.target as HTMLElement;
            this.currentInfo.elementToFocus = e.target as HTMLElement;
            addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
        this.firstHeaderCellClick = false;
        if (e.target && (<HTMLElement>e.target).classList.contains('e-detailcell')) {
            this.currentInfo.skipAction = false;
            addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
    }

    protected onBlur(e?: FocusEvent): void {
        // The below boolean condition for gantt team focus fix.
        const isGantt: boolean = parentsUntil((e.target as Element), 'e-gantt') && (e.target as Element).classList.contains('e-rowcell')
            && (!isNullOrUndefined((e.target as Element).nextElementSibling)
            && (e.target as Element).nextElementSibling.classList.contains('e-rowcell')) ? true : false;
        if ((this.parent.isEdit || e && (!e.relatedTarget || closest(<HTMLElement>e.relatedTarget, '.e-grid'))
            && !(this.parent.element.classList.contains('e-childgrid') && !this.parent.element.matches(':focus-within')))
            && !(!isGantt && isNullOrUndefined(e.relatedTarget) && parseInt((e.target as Element).getAttribute('data-colindex'), 10) === 0
            && parseInt((e.target as Element).getAttribute('index'), 10) === 0) && !(!isGantt && isNullOrUndefined(e.relatedTarget)
            && !closest(document.activeElement, '.e-grid') && !isNullOrUndefined(e['sourceCapabilities']))) { return; }
        this.removeFocus(); this.skipFocus = true; this.currentInfo.skipAction = false;
        this.setLastContentCellTabIndex();
        this.setFirstFocusableTabIndex();
        this.firstHeaderCellClick = false;
    }

    /**
     * @returns {void}
     * @hidden */
    public setFirstFocusableTabIndex(): void {
        const gObj: Grid = this.parent as Grid;
        gObj.element.tabIndex = -1;
        if (gObj.allowGrouping && gObj.groupSettings.showDropArea) {
            const groupModule: Group = gObj.groupModule;
            const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
            if (focusableGroupedItems.length > 0) {
                groupModule.element.tabIndex = -1;
                (focusableGroupedItems[0] as HTMLElement).tabIndex = 0;
            } else {
                groupModule.element.tabIndex = 0;
            }
            return;
        }
        if (gObj.toolbar || gObj.toolbarTemplate) {
            const toolbarElement: Element = gObj.toolbarModule.element;
            const focusableToolbarItems: Element[] = (this.parent as Grid).toolbarModule.getFocusableToolbarItems();
            if (focusableToolbarItems.length > 0 && focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input')) {
                (toolbarElement as HTMLElement).tabIndex = -1;
                (focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input') as HTMLElement).tabIndex = 0;
            } else {
                (toolbarElement as HTMLElement).tabIndex = 0;
            }
            return;
        }
        if (gObj.getColumns().length) {
            const firstHeaderCell: HTMLElement = gObj.getHeaderContent().querySelector('.e-headercell');
            firstHeaderCell.tabIndex = 0;
            this.setActive(false);
            if (!isNullOrUndefined(this.active) && (isNullOrUndefined(this.active.target) || !this.active.target.classList.contains('e-columnmenu'))) {
                let firstHeaderCellIndex: number[] = [0, 0];
                if (this.active.matrix.matrix[firstHeaderCellIndex[0]][firstHeaderCellIndex[1]] === 0) {
                    firstHeaderCellIndex = findCellIndex(this.active.matrix.matrix, firstHeaderCellIndex, true);
                }
                this.active.matrix.current = firstHeaderCellIndex;
            }
            return;
        }
    }

    private setLastContentCellTabIndex(): void {
        const contentTable: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
        if (contentTable.rows[contentTable.rows.length - 1]) {
            const lastCell: Element = contentTable.rows[contentTable.rows.length - 1].lastElementChild;
            (lastCell as HTMLElement).tabIndex = 0;
        }
    }

    public onClick(e: Event | { target: Element, type?: string }, force?: boolean): void {
        if (parentsUntil(e.target as HTMLElement, 'e-filterbarcell') && (parentsUntil(e.target as HTMLElement, 'e-multiselect') ||
            (e.target as HTMLElement).classList.contains('e-input-group-icon'))) {
            return;
        }
        let isContent: boolean = !isNullOrUndefined(closest(<HTMLElement>e.target,  '.' + literals.gridContent));
        const isHeader: boolean = !isNullOrUndefined(closest(<HTMLElement>e.target, '.' + literals.gridHeader));
        isContent = isContent && isHeader ? !isContent : isContent;
        if (!isContent && isNullOrUndefined(closest(<HTMLElement>e.target, '.' + literals.gridHeader)) ||
            (<Element>e.target).classList.contains(literals.content) ||
            !isNullOrUndefined(closest(<HTMLElement>e.target, '.e-unboundcell'))) { return; }
        this.setActive(isContent);
        if (!isContent && isNullOrUndefined(closest(<HTMLElement>e.target, '.' + literals.gridHeader))) { this.clearOutline(); return; }
        const beforeArgs: CellFocusArgs = { cancel: false, byKey: false, byClick: !isNullOrUndefined(e.target), clickArgs: <Event>e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel || closest(<Element>e.target, '.e-inline-edit')) { return; }
        this.setActive(isContent);
        if (this.getContent()) {
            const returnVal: boolean = this.getContent().onClick(e, force);
            if (returnVal === false) { return; }
            this.focus();
            if (this.currentInfo.element.classList.contains('e-rowcell') && e.type && e.type === 'click') {
                addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
            }
        }
    }

    protected onKeyPress(e: KeyboardEventArgs): void {
        if (this.parent.allowPaging) {
            const pagerElement: Element = this.parent.pagerModule.pagerObj.element;
            const focusablePagerElements: Element[] = this.parent.pagerModule.pagerObj.getFocusablePagerElements(pagerElement, []);
            if (this.parent.childGrid && !parentsUntil(e.target as Element, 'e-gridpager') && this.allowToPaging(e) && focusablePagerElements.length) {
                (focusablePagerElements[0] as HTMLElement).tabIndex = 0;
            }
            if (this.parent.pagerModule.pagerObj.checkPagerHasFocus()) {
                if (e.action === 'shiftTab' && focusablePagerElements.length && focusablePagerElements[0] === e.target) {
                    this.setActive(true);
                    let lastHeaderCellIndex: number[] = [this.active.matrix.matrix.length - 1,
                        this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
                    if (this.active.matrix.matrix[lastHeaderCellIndex[0]][lastHeaderCellIndex[1]] === 0) {
                        lastHeaderCellIndex = findCellIndex(this.active.matrix.matrix, lastHeaderCellIndex, false);
                    }
                    this.active.matrix.current = this.parent.editSettings.mode === 'Batch' ?
                        this.isValidBatchEditCell(lastHeaderCellIndex) ? lastHeaderCellIndex :
                            this.findBatchEditCell(lastHeaderCellIndex, false) : lastHeaderCellIndex;
                    e.preventDefault();
                    this.focus(e);
                    return;
                }
                if (!(e.action === 'tab' && this.parent.element.classList.contains('e-childgrid')
                    && ((!this.parent.pageSettings.pageSizes && focusablePagerElements.length
                    && focusablePagerElements[focusablePagerElements.length - 1] === e.target)
                    || (this.parent.pagerModule.pagerObj.getDropDownPage() === e.target)))) {
                    this.parent.pagerModule.pagerObj.changePagerFocus(e);
                    return;
                } else {
                    const parentCell: Element = parentsUntil(this.parent.element, 'e-detailcell');
                    removeClass([this.parent.element], ['e-focus']);
                    removeClass([parentCell], ['e-focused']);
                    (parentCell as HTMLElement).tabIndex = -1;
                }
            }
            if (this.parent.pagerModule.pagerObj.element.tabIndex === 0 && (e.keyCode === 38 || (e.shiftKey && e.keyCode === 9))) {
                e.preventDefault();
                this.focus(e);
                return;
            } else if (this.parent.pagerModule.pagerObj.element.tabIndex === 0 && e.keyCode === 9) {
                e.preventDefault();
                this.parent.pagerModule.pagerObj.setPagerFocus();
                return;
            }
            if (this.parent.pagerModule.pagerObj.checkFirstPagerFocus()) {
                const lastRow: number = this.getContent().matrix.rows;
                const lastColumn: number = this.getContent().matrix.columns;
                this.getContent().matrix.current = [lastRow, lastColumn];
            }
        }
        if (this.skipOn(e)) {
            return;
        }
        if (e.target && parentsUntil(e.target as Element, 'e-gridcontent')) {
            const rows: HTMLElement[] = [].slice.call((this.parent.getContentTable() as HTMLTableElement).rows);
            const lastCell: HTMLElement = rows[rows.length - 1].lastElementChild as HTMLElement;
            if (e.target === lastCell) {
                this.setActive(true);
                this.setLastContentCellActive();
            }
        }
        if (e.action === 'shiftTab' && e.target && (e.target === this.parent.element || parentsUntil(e.target as Element, 'e-toolbar')
            || parentsUntil(e.target as Element, 'e-groupdroparea'))) {
            if (e.target === this.parent.element) {
                if (this.parent.element.classList.contains('e-childgrid')) {
                    this.focusOutFromChildGrid(e);
                }
                return;
            }
            if (parentsUntil(e.target as Element, 'e-groupdroparea')) {
                if (this.parent.element.classList.contains('e-childgrid')) {
                    e.preventDefault();
                    this.parent.element.focus();
                }
                return;
            }
            if (parentsUntil(e.target as Element, 'e-toolbar')) {
                if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea) {
                    const groupModule: Group = (this.parent as Grid).groupModule;
                    const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
                    e.preventDefault();
                    if (focusableGroupedItems.length > 0) {
                        (focusableGroupedItems[focusableGroupedItems.length - 1] as HTMLElement).focus();
                    } else {
                        groupModule.element.focus();
                    }
                } else if (this.parent.element.classList.contains('e-childgrid')) {
                    e.preventDefault();
                    this.parent.element.focus();
                }
                return;
            }
        }
        let focusFirstHeaderCell: boolean = false;
        if (e.action === 'tab' && e.target && (e.target === this.parent.element || parentsUntil(e.target as Element, 'e-toolbar')
            || parentsUntil(e.target as Element, 'e-groupdroparea'))) {
            if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea
                && (e.target === this.parent.element || (e.target as HTMLElement).classList.contains('e-groupdroparea'))) {
                const groupModule: Group = (this.parent as Grid).groupModule;
                const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
                if (focusableGroupedItems.length > 0) {
                    e.preventDefault();
                    (focusableGroupedItems[0] as HTMLElement).focus();
                    return;
                }
                if (!(e.target as HTMLElement).classList.contains('e-groupdroparea')) {
                    e.preventDefault();
                    groupModule.element.focus();
                    return;
                }
            }
            if ((this.parent.toolbar || this.parent.toolbarTemplate) && (e.target === this.parent.element
                || parentsUntil(e.target as Element, 'e-groupdroparea')
                || (e.target as HTMLElement).classList.contains('e-toolbar'))) {
                const toolbarElement: Element = (this.parent as Grid).toolbarModule.element;
                const focusableToolbarItems: Element[] = (this.parent as Grid).toolbarModule.getFocusableToolbarItems();
                if (focusableToolbarItems.length > 0) {
                    e.preventDefault();
                    (focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input') as HTMLElement).focus();
                    return;
                }
                if (!(e.target as HTMLElement).classList.contains('e-toolbar')) {
                    e.preventDefault();
                    (toolbarElement as HTMLElement).focus();
                    return;
                }
            }
            if (e.target === this.parent.element || parentsUntil(e.target as Element, 'e-toolbar')
                || parentsUntil(e.target as Element, 'e-groupdroparea')) {
                focusFirstHeaderCell = true;
            }
        }
        if (focusFirstHeaderCell) {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length === this.parent.columns.length){
                this.setActive(true);
            } else {
                this.setActive(false);
            }
            this.active.matrix.current = [0, -1];
        }
        this.activeKey = e.action;
        const beforeArgs: CellFocusArgs = { cancel: false, byKey: true, byClick: false, keyArgs: e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel) { return; }
        const bValue: number[] = this.getContent().matrix.current;
        const prevBatchValue: number[] = this.active && this.active.matrix.current ?
            [this.active.matrix.current[0], this.active.matrix.current[1]] : undefined;
        this.currentInfo.outline = true;
        const swapInfo: SwapInfo = this.getContent().jump(e.action, bValue);
        this.swap = swapInfo;
        if (swapInfo.swap && !(this.parent.editSettings.mode === 'Batch'
            && (e.action === 'tab' || e.action === 'shiftTab'))) {
            this.setActive(!swapInfo.toHeader);
            this.getContent().matrix.current = this.getContent().getNextCurrent(bValue, swapInfo, this.active, e.action);
            this.prevIndexes = {};
        }
        this.setActiveByKey(e.action, this.getContent());
        let returnVal: boolean = this.content.lastIdxCell ? false : this.getContent().onKeyPress(e);
        if (e.target && parentsUntil(e.target as Element, 'e-gridheader')) {
            if (e.action === 'tab' && bValue.toString() === this.active.matrix.current.toString()) {
                const nextHeaderCellIndex: number[] = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, true);
                let lastHeaderCellIndex: number[] = [this.active.matrix.matrix.length - 1,
                    this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
                if (this.active.matrix.matrix[lastHeaderCellIndex[0]][lastHeaderCellIndex[1]] === 0) {
                    lastHeaderCellIndex = findCellIndex(this.active.matrix.matrix, lastHeaderCellIndex, false);
                }
                if (this.active.matrix.current.toString() === lastHeaderCellIndex.toString() && this.content.matrix.matrix.length) {
                    returnVal = true;
                    this.setActive(true);
                    let firstContentCellIndex: number[] = [0, 0];
                    if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                        firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                    }
                    this.active.matrix.current = this.parent.editSettings.mode === 'Batch' ?
                        this.isValidBatchEditCell(firstContentCellIndex) ? firstContentCellIndex :
                            this.findBatchEditCell(firstContentCellIndex, true) : firstContentCellIndex;
                } else if (this.active.matrix.current.toString() !== nextHeaderCellIndex.toString()) {
                    this.active.matrix.current = nextHeaderCellIndex;
                }
            }
            if (e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                const previousCellIndex: number[] = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, false);
                if (previousCellIndex.toString() === this.active.matrix.current.toString()) {
                    this.focusOutFromHeader(e);
                    return;
                }
                if (this.active.matrix.current.toString() !== previousCellIndex.toString() && !returnVal) {
                    returnVal = true;
                    this.active.matrix.current = previousCellIndex;
                }
            }
        }
        if (e.target && parentsUntil(e.target as Element, 'e-gridcontent')) {
            if (this.parent.editSettings.mode === 'Batch' && (e.action === 'tab' || e.action === 'shiftTab')) {
                this.active.matrix.current = this.findBatchEditCell(prevBatchValue, e.action === 'tab' ? true : false);
                if (e.action === 'tab' && prevBatchValue.toString() === this.active.matrix.current.toString()) {
                    this.parent.editModule.editModule.addBatchRow = true;
                }
            }
            if (e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length === this.parent.columns.length) {
                    this.focusOutFromHeader(e);
                    return;
                }
                let firstContentCellIndex: number[] = [0, 0];
                if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                    firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                }
                if (!returnVal && (firstContentCellIndex.toString() === this.active.matrix.current.toString()
                    || (this.parent.editSettings.mode === 'Batch'
                        && prevBatchValue.toString() === this.active.matrix.current.toString()))) {
                    returnVal = true;
                    this.setActive(false);
                    this.setLastContentCellActive();
                }
            }
        }
        if (returnVal === false) {
            this.clearIndicator();
            if (e.action === 'shiftTab' && bValue.toString() === [0, 0].toString()) {
                this.parent.element.tabIndex = -1;
            }
            if (this.parent.allowPaging && !this.parent.pagerModule.pagerObj.checkPagerHasFocus() && this.allowToPaging(e)
                && bValue.toString() !== [0, 0].toString()) {
                e.preventDefault();
                if (e.keyCode === 40) {
                    this.parent.pagerModule.pagerObj.setPagerContainerFocus();
                    return;
                } else if (e.keyCode === 9) {
                    this.parent.pagerModule.pagerObj.setPagerFocus();
                    return;
                }
            }
            if (this.parent.element.classList.contains('e-childgrid')) {
                this.focusOutFromChildGrid(e);
            }
            return;
        }
        e.preventDefault();
        this.focus(e);
    }

    private isValidBatchEditCell(cellIndex: number[]): boolean {
        const cell: Element = this.active.getTable().rows[cellIndex[0]].cells[cellIndex[1]];
        const tr: Element = closest(cell, 'tr');
        const cellColIndex: number = parseInt(cell.getAttribute('data-colindex'), 10);
        const cellCol: Column = this.parent.getColumns()[parseInt(cellColIndex.toString(), 10)];
        if (this.active.matrix.matrix[cellIndex[0]][cellIndex[1]] === 1
            && (!tr.classList.contains('e-row') || (tr.classList.contains('e-insertedrow') || !cellCol.isPrimaryKey) && cellCol.allowEditing)) {
            return true;
        }
        return false;
    }

    private findBatchEditCell(currentCellIndex: number[], next: boolean, limitRow?: boolean): number[] {
        let cellIndex: number[] = currentCellIndex;
        let tempCellIndex: number[] = currentCellIndex;
        let cellIndexObtain: boolean = false;
        while (!cellIndexObtain) {
            const prevTempCellIndex: number[] = tempCellIndex;
            tempCellIndex = findCellIndex(this.active.matrix.matrix, tempCellIndex, next);
            if ((prevTempCellIndex.toString() === tempCellIndex.toString())
                || (limitRow && prevTempCellIndex[0] !== tempCellIndex[0])) {
                cellIndexObtain = true;
                continue;
            }
            if (this.isValidBatchEditCell(tempCellIndex)) {
                cellIndex = tempCellIndex;
                cellIndexObtain = true;
            }
        }
        return cellIndex;
    }

    private setLastContentCellActive(): void {
        let lastContentCellIndex: number[] = [this.active.matrix.matrix.length - 1,
            this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
        if (this.active.matrix.matrix[lastContentCellIndex[0]][lastContentCellIndex[1]] === 0) {
            lastContentCellIndex = findCellIndex(this.active.matrix.matrix, lastContentCellIndex, false);
        }
        this.active.matrix.current = lastContentCellIndex;
    }

    private focusOutFromChildGrid(e: KeyboardEventArgs): void {
        const parentTable: HTMLTableElement = parentsUntil(this.parent.element, 'e-table') as HTMLTableElement;
        const parentGrid: Grid = (parentsUntil(parentTable, 'e-grid') as EJ2Intance).ej2_instances[0] as Grid;
        const parentCell: Element = parentsUntil(this.parent.element, 'e-detailcell');
        const uid: string = parentsUntil(this.parent.element, 'e-detailrow').getAttribute('data-uid');
        const parentRows: Element[] = [].slice.call((parentGrid.getContentTable() as HTMLTableElement).rows);
        const parentRowIndex: number = parentRows.map((m: HTMLTableRowElement) => m.getAttribute('data-uid')).indexOf(uid);
        if (e.action === 'tab' && parentRowIndex >= parentRows.length - 1) { return; }
        removeClass([this.parent.element], ['e-focus']);
        removeClass([parentCell], ['e-focused']);
        (parentCell as HTMLElement).tabIndex = -1;
        e.preventDefault();
        let nextFocusCell: HTMLTableCellElement;
        parentGrid.focusModule.removeFocus();
        if (e.action === 'shiftTab') {
            const previousRow: HTMLTableRowElement = parentRows[parentRowIndex - 1] as HTMLTableRowElement;
            const rowCells: HTMLCollectionOf<HTMLTableCellElement> = previousRow.cells;
            for (let i: number = rowCells.length - 1; i >= 0; i-- ) {
                nextFocusCell = rowCells[parseInt(i.toString(), 10)];
                if (!nextFocusCell.classList.contains('e-hide')) {
                    parentGrid.focusModule.active.matrix.current = [parentRowIndex - 1, i];
                    break;
                }
            }
        } else {
            nextFocusCell = (parentRows[parentRowIndex + 1] as HTMLTableRowElement).cells[0];
            parentGrid.focusModule.active.matrix.current = [parentRowIndex + 1, 0];
        }
        parentGrid.focusModule.currentInfo.element = nextFocusCell;
        parentGrid.focusModule.currentInfo.elementToFocus = nextFocusCell;
        addClass([nextFocusCell], ['e-focused', 'e-focus']);
        nextFocusCell.tabIndex = 0;
        nextFocusCell.focus();
    }

    private focusOutFromHeader(e: KeyboardEventArgs): void {
        this.removeFocus();
        if (this.parent.toolbar || this.parent.toolbarTemplate) {
            const toolbarElement: Element = (this.parent as Grid).toolbarModule.element;
            const focusableToolbarItems: Element[] = (this.parent as Grid).toolbarModule.getFocusableToolbarItems();
            e.preventDefault();
            if (focusableToolbarItems.length > 0) {
                (focusableToolbarItems[focusableToolbarItems.length - 1].querySelector('.e-toolbar-item-focus,.e-btn,.e-input') as HTMLElement).focus();
            } else {
                (toolbarElement as HTMLElement).focus();
            }
            return;
        }
        if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea) {
            const groupModule: Group = (this.parent as Grid).groupModule;
            const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
            e.preventDefault();
            if (focusableGroupedItems.length > 0) {
                (focusableGroupedItems[focusableGroupedItems.length - 1] as HTMLElement).focus();
            } else {
                groupModule.element.focus();
            }
            return;
        }
        if (this.parent.element.classList.contains('e-childgrid')) {
            e.preventDefault();
            this.parent.element.focus();
        }
    }

    private allowToPaging(e: KeyboardEventArgs): boolean {
        if (this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.allowAdding && e.keyCode !== 40) {
            return false;
        }
        return true;
    }

    private skipOn(e: KeyboardEventArgs): boolean {
        const target: HTMLElement = <HTMLElement>e.target; if (!target) { return false; }
        if (this.currentInfo.skipAction) { this.clearIndicator(); return true; }
        if (['pageUp', 'pageDown', 'altDownArrow'].indexOf(e.action) > -1) { this.clearIndicator(); return true; }
        if (this.parent.allowGrouping) {
            const focusableGroupedItems: Element[] = (this.parent as Grid).groupModule.getFocusableGroupedItems();
            if (parentsUntil(e.target as Element, 'e-groupheadercell')
                && !((e.target === focusableGroupedItems[0] && e.action === 'shiftTab')
                || (e.target === focusableGroupedItems[focusableGroupedItems.length - 1] && e.action === 'tab'))) {
                return true;
            }
        }
        if (this.parent.toolbar || this.parent.toolbarTemplate) {
            const toolbarElement: Element = (this.parent as Grid).toolbarModule.element;
            const focusableToolbarItems: NodeListOf<Element> = toolbarElement
                .querySelectorAll('.e-toolbar-item:not(.e-overlay):not(.e-hidden)');
            if (parentsUntil(e.target as Element, 'e-toolbar-item')
                && !(focusableToolbarItems.length > 0 && ((parentsUntil(e.target as Element, 'e-toolbar-item') === focusableToolbarItems[0] && e.action === 'shiftTab')
                || (parentsUntil(e.target as Element, 'e-toolbar-item') === focusableToolbarItems[focusableToolbarItems.length - 1] && e.action === 'tab')))) {
                return true;
            }
        }
        const th: boolean = closest(target, 'th') && !(closest(target, 'th') as HTMLElement).tabIndex;
        if ((e.target as HTMLElement).classList.contains('e-filterbaroperator') && (e.keyCode === 13 || e.keyCode === 27)) {
            const inputTarget: Element = closest(e.target as HTMLElement, '.e-filterbarcell');
            inputTarget.querySelector('input').focus();
        }
        if (th && closest(document.activeElement, '.e-filterbarcell') !== null) {
            this.removeFocus();
        }
        let filterCell: boolean = closest(document.activeElement, '.e-filterbarcell') !== null;
        if (this.parent.enableHeaderFocus && filterCell) {
            const matrix: Matrix = this.active.matrix;
            const current: number[] = matrix.current;
            filterCell = matrix.matrix[current[0]].lastIndexOf(1) !== current[1];
        }
        return (e.action === 'delete'
            || (this.parent.editSettings.mode !== 'Batch' && (this.parent.isEdit || ['insert', 'f2'].indexOf(e.action) > -1))
            || ((filterCell && this.parent.enableHeaderFocus) || (filterCell && e.action !== 'tab' && e.action !== 'shiftTab') ||
                closest(document.activeElement, '#' + this.parent.element.id + '_searchbar') !== null
                && ['enter', 'leftArrow', 'rightArrow',
                    'shiftLeft', 'shiftRight', 'ctrlPlusA'].indexOf(e.action) > -1)
            || (closest(target,  '.' + literals.gridContent) === null && closest(target, '.' + literals.gridHeader) === null
            && !(e.target === this.parent.element || parentsUntil(e.target as Element, 'e-toolbar')
            || parentsUntil(e.target as Element, 'e-groupdroparea')))
            || (e.action === 'space' && (!target.classList.contains(literals.gridChkBox) && closest(target, '.' + literals.gridChkBox) === null
                && closest(target, '.e-headerchkcelldiv') === null))) || closest(target, '.e-filter-popup') !== null;
    }

    private focusVirtualElement(e?: KeyboardEventArgs): void {
        if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
            const data: { virtualData: Object, isAdd: boolean, isCancel: boolean } = { virtualData: {}, isAdd: false, isCancel: false };
            this.parent.notify(event.getVirtualData, data);
            const isKeyFocus: boolean = this.actions.some((value: string) => value === this.activeKey);
            const isSelected: boolean = this.parent.contentModule ?
                (<{ selectedRowIndex?: number }>this.parent.contentModule).selectedRowIndex > -1 : false;
            if (data.isAdd || Object.keys(data.virtualData).length || isKeyFocus || data.isCancel || isSelected) {
                this.parent.notify(event.resetVirtualFocus, { isCancel: false });
                data.isCancel = false;
                (<{ selectedRowIndex?: number }>this.parent.contentModule).selectedRowIndex = -1;
                if (isKeyFocus) {
                    this.activeKey = this.empty;
                    this.parent.notify('virtaul-key-handler', e);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.currentInfo.elementToFocus as any).focus({ preventScroll: true });
            } else {
                if (this.isVirtualScroll || this.isInfiniteScroll) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.currentInfo.elementToFocus as any).focus({ preventScroll: true });
                } else {
                    this.currentInfo.elementToFocus.focus();
                }
            }
        }
        this.isVirtualScroll = this.isInfiniteScroll = false;
    }

    public getFocusedElement(): HTMLElement {
        return this.currentInfo.elementToFocus;
    }

    public getContent(): IFocus {
        return this.active || this.content;
    }

    public setActive(content: boolean): void {
        this.active = content ? this.content : this.header;
    }

    public setFocusedElement(element: HTMLElement, e?: KeyboardEventArgs): void {
        this.currentInfo.elementToFocus = element;
        setTimeout(
            () => {
                if (!isNullOrUndefined(this.currentInfo.elementToFocus)) {
                    if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
                        this.focusVirtualElement(e);
                    } else {
                        this.currentInfo.elementToFocus.focus();
                    }
                }
            },
            0);
    }

    public focus(e?: KeyboardEventArgs | FocusEvent): void {
        this.parent.notify(event.virtaulCellFocus, e);
        this.removeFocus();
        this.addFocus(this.getContent().getFocusInfo(), e);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected removeFocus(e?: FocusEvent): void {
        if (!this.currentInfo.element) { return; }
        if (this.parent.isReact && this.currentInfo.element.classList.contains('e-rowcell') && !this.currentInfo.element.parentElement) {
            const cellElem: HTMLElement = this.parent.getCellFromIndex(this.prevIndexes.rowIndex, this.prevIndexes.cellIndex) as HTMLElement;
            this.currentInfo.element = cellElem ? cellElem : this.currentInfo.element;
        }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focused', 'e-focus']);
        this.currentInfo.element.tabIndex = -1;
    }

    /**
     * @returns {void}
     * @hidden */
    public addOutline(): void {
        const info: FocusInfo = this.getContent().getFocusInfo();
        if (info.element) {
            addClass([info.element], ['e-focused']);
            addClass([info.elementToFocus], ['e-focus']);
        }
    }

    /**
     * @returns {void}
     * @hidden */
    public focusHeader(): void {
        this.setActive(false);
        this.resetFocus();
    }
    /**
     * @returns {void}
     * @hidden */
    public focusContent(): void {
        this.setActive(true);
        this.resetFocus();
    }

    private resetFocus(): void {
        const current: number[] = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        this.focus();
    }

    protected addFocus(info: FocusInfo, e?: KeyboardEventArgs | FocusEvent): void {
        this.currentInfo = info; this.currentInfo.outline = info.outline && (!isNullOrUndefined(e) || this.isVirtualScroll);
        if (this.isInfiniteScroll) { this.currentInfo.outline = true; }
        if (!info.element) { return; }
        const isFocused: boolean = info.elementToFocus.classList.contains('e-focus');
        if (isFocused) { return; }
        if (this.currentInfo.outline) {
            addClass([info.element], ['e-focused']);
        }
        addClass([info.elementToFocus], ['e-focus']);
        info.element.tabIndex = 0;
        if (!isFocused) {
            this.setFocusedElement(info.elementToFocus, e as KeyboardEventArgs);
        }
        this.parent.notify(event.cellFocused, {
            element: info.elementToFocus,
            parent: info.element,
            indexes: this.getContent().matrix.current,
            byKey: !isNullOrUndefined(e),
            byClick: isNullOrUndefined(e),
            keyArgs: e,
            isJump: this.swap.swap,
            container: this.getContent().getInfo(e as KeyboardEventArgs),
            outline: !isNullOrUndefined(e),
            swapInfo: this.swap
        });
        const [rowIndex, cellIndex]: number[] = this.getContent().matrix.current;
        this.prevIndexes = { rowIndex, cellIndex };
        this.focusedColumnUid = this.parent.getColumnByIndex(cellIndex).uid;
        this.focusByClick = false;
    }

    protected refreshMatrix(content?: boolean): Function {
        return (e: { rows: Row<Column>[], args?: NotifyArgs, name?: string }) => {
            if (content && !this.content) {
                this.content = new ContentFocus(this.parent);
            }
            if (!content && !this.header) {
                this.header = new HeaderFocus(this.parent);
            }
            const cFocus: IFocus = content ? this.content : this.header;
            let frozenRow: number = this.parent.frozenRows;
            let batchLen: number = 0;
            if (frozenRow && this.parent.editSettings.mode === 'Batch') {
                batchLen = this.parent.getHeaderContent().querySelectorAll('.e-insertedrow').length +
                    this.parent.getHeaderContent().querySelectorAll('.e-hiddenrow').length;
            }
            if (this.parent.groupSettings.columns.length && frozenRow && content) {
                frozenRow = 0;
                for (let i: number = 0; i < e.rows.length; i++) {
                    frozenRow++;
                    if (e.rows[parseInt(i.toString(), 10)].index + 1 === this.parent.frozenRows) {
                        break;
                    }
                }
            }
            let rows: Row<Column>[] = content ? e.rows.slice(frozenRow + batchLen) : e.rows;
            const updateRow: Row<Column>[] = content ? e.rows.slice(0, frozenRow + batchLen) : e.rows;
            if (this.parent.isCollapseStateEnabled() && content) {
                rows = rows.filter((x: Row<Column>) => x.visible !== false);
            }
            const isRowTemplate: boolean = !isNullOrUndefined(this.parent.rowTemplate);
            if (frozenRow && ((this.parent.editSettings.mode === 'Batch' && content && (e.name === 'batchDelete' ||  e.name === 'batchAdd' ||
                e.name === 'batchCancel' || (e.args && (e.args.requestType === 'batchsave' )))) || 
                (e.args && (e.args.requestType === 'delete' || e.args.requestType === 'save')))) {
                let matrixcs: number[][] = this.header.matrix.matrix;
                const hdrLen: number = (<{ rows?: Row<Column>[] }>this.parent.headerModule).rows.length;
                matrixcs.splice(hdrLen, matrixcs.length - hdrLen);
            }
            const matrix: number[][] = cFocus.matrix.generate(updateRow, cFocus.selector, isRowTemplate);
            cFocus.matrix.generate(rows, cFocus.selector, isRowTemplate);
            if (!(this.parent.isFrozenGrid() && (e.args && (e.args.requestType === 'sorting'
                || e.args.requestType === 'batchsave' || e.args.requestType === 'paging'))) ||
                (frozenRow && this.parent.editSettings.mode === 'Batch' && content && (e.name === 'batchDelete' ||  e.name === 'batchAdd' ||
                e.name === 'batchCancel' || e.args.requestType === 'batchsave'
                || e.name === 'batchAdd' || e.name === 'batchCancel'))) {
                cFocus.generateRows(
                    updateRow,
                    {
                        matrix, handlerInstance: this.header
                    }
                );
            }
            if (!Browser.isDevice && e && e.args) {
                if (!this.focusByClick && e.args.requestType === 'paging' && !this.parent.pagerModule.pagerObj.checkPagerHasFocus()) {
                    this.skipFocus = false; this.parent.element.focus();
                }
                if (e.args.requestType === 'grouping') {
                    this.skipFocus = true;
                }
            }
            if (e && e.args && e.args.requestType === 'virtualscroll') {
                if (this.currentInfo.uid) {
                    let index: number;
                    const bool: boolean = e.rows.some((row: Row<Column>, i: number) => {
                        index = i;
                        return row.uid === this.currentInfo.uid;
                    });
                    if (bool) {
                        this.content.matrix.current[0] = index;
                        this.content.matrix.current[1] = this.parent.getColumnIndexByUid(this.focusedColumnUid) || 0;
                        const focusElement: HTMLElement = this.getContent().getFocusInfo().elementToFocus;
                        if (focusElement) {
                            const cellPosition: ClientRect = focusElement.getBoundingClientRect();
                            const gridPosition: ClientRect = this.parent.element.getBoundingClientRect();
                            if (cellPosition.top >= 0 && cellPosition.left >= 0 &&
                                cellPosition.right <= Math.min(gridPosition.right, window.innerWidth ||
                                    document.documentElement.clientWidth) &&
                                cellPosition.bottom <= Math.min(gridPosition.bottom, window.innerHeight ||
                                    document.documentElement.clientHeight)) {
                                this.isVirtualScroll = true;
                                this.focus();
                            }
                        }
                    }
                } else if (e.args.focusElement && e.args.focusElement.classList.contains('e-filtertext')) {
                    const focusElement: HTMLElement = <HTMLElement>this.parent.element.querySelector('#' + e.args.focusElement.id);
                    if (focusElement) {
                        focusElement.focus();
                    }
                }
            }
            if (e && e.args && e.args.requestType === 'infiniteScroll') {
                this.isInfiniteScroll = true;
            }
        };
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.add(this.parent.element, 'mousedown', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'touchstart', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'focus', this.onFocus, this);
        this.parent.element.addEventListener('focus', this.passiveHandler = (e: FocusEvent) => this.passiveFocus(e), true);
        EventHandler.add(this.parent.element, 'focusout', this.onBlur, this);
        this.evtHandlers = [{ event: event.keyPressed, handler: this.onKeyPress },
            { event: event.click, handler: this.onClick },
            { event: event.contentReady, handler: this.refMatrix },
            { event: event.partialRefresh, handler: this.refMatrix },
            { event: event.refreshExpandandCollapse, handler: this.refMatrix },
            { event: event.headerRefreshed, handler: this.refreshMatrix() },
            { event: event.closeEdit, handler: this.restoreFocus },
            { event: event.restoreFocus, handler: this.restoreFocus },
            { event: 'start-edit', handler: this.clearIndicator },
            { event: 'start-add', handler: this.clearIndicator },
            { event: 'sorting-complete', handler: this.restoreFocus },
            { event: 'filtering-complete', handler: this.filterfocus },
            { event: 'grouping-complete', handler: this.restoreFocusWithAction },
            { event: 'ungrouping-complete', handler: this.restoreFocusWithAction },
            { event: event.batchAdd, handler: this.refMatrix },
            { event: event.batchCancel, handler: this.refMatrix },
            { event: event.batchDelete, handler: this.refMatrix },
            { event: event.detailDataBound, handler: this.refMatrix },
            { event: event.onEmpty, handler: this.refMatrix },
            { event: event.cellFocused, handler: this.internalCellFocus }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    public filterfocus(): void {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            this.restoreFocus();
        }
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.remove(this.parent.element, 'mousedown', this.focusCheck);
        EventHandler.remove(this.parent.element, 'touchstart', this.focusCheck);
        EventHandler.remove(this.parent.element, 'focus', this.onFocus);
        EventHandler.remove(this.parent.element, 'focusout', this.onBlur);
        this.parent.element.removeEventListener('focus', this.passiveHandler, true);
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }

    public destroy(): void {
        this.removeEventListener();
    }

    public restoreFocus(): void {
        const groupModule: Group = (this.parent as Grid).groupModule;
        if ( this.parent.allowGrouping && groupModule && (groupModule.groupSortFocus || groupModule.groupTextFocus)) {
            groupModule.groupSortFocus = false;
            groupModule.groupTextFocus = false;
            return;
        }
        this.firstHeaderCellClick = true;
        this.addFocus(this.getContent().getFocusInfo());
    }

    public restoreFocusWithAction(e: NotifyArgs): void {
        if (!this.parent.enableInfiniteScrolling) {
            const matrix: Matrix = this.getContent().matrix;
            const current: number[] = matrix.current;
            switch (e.requestType) {
            case 'grouping':
            case 'ungrouping':
                current[1] = current.length &&
                    !this.parent.groupSettings.showGroupedColumn && !isNullOrUndefined(matrix.matrix[current[0]]) ?
                    matrix.matrix[current[0]].indexOf(1) : e.requestType === 'grouping' ? current[1] + 1 : current[1] - 1;
                break;
            }
            this.getContent().matrix.current = current;
            const groupModule: Group = (this.parent as Grid).groupModule;
            if ( this.parent.allowGrouping && groupModule && groupModule.groupCancelFocus) {
                const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
                if (focusableGroupedItems.length) {
                    if (focusableGroupedItems[0].parentElement.getAttribute('ej-mappingname') === (e as GroupEventArgs).columnName) {
                        (focusableGroupedItems[3] as HTMLElement).focus();
                    } else {
                        (focusableGroupedItems[0] as HTMLElement).focus();
                    }
                } else {
                    groupModule.element.focus();
                }
                groupModule.groupCancelFocus = false;
                return;
            }
            this.addFocus(this.getContent().getFocusInfo());
        }
    }

    public clearOutline(): void {
        this.getContent().matrix.current = this.getContent().matrix.get(0, -1, [0, 1], 'downArrow', this.getContent().validator());
        this.clearIndicator();
    }

    public clearIndicator(): void {
        if (!this.currentInfo.element || !this.currentInfo.elementToFocus) { return; }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focus', 'e-focused']);
    }

    public getPrevIndexes(): IIndex {
        const forget: boolean = this.forget; this.forget = false;
        return forget || !Object.keys(this.prevIndexes).length ? { rowIndex: null, cellIndex: null } : this.prevIndexes;
    }

    public forgetPrevious(): void {
        this.forget = true;
    }

    public setActiveByKey(action: string, active: IFocus): void {
        if (this.parent.frozenRows === 0) {
            return;
        }
        // eslint-disable-next-line prefer-const
        let info: FocusedContainer;
        const actions: { [x: string]: Function } = {
            'home': () => ({ toHeader: !info.isContent, toFrozen: true }),
            'end': () => ({ toHeader: !info.isContent, toFrozen: false }),
            'ctrlHome': () => ({ toHeader: true, toFrozen: false}),
            'ctrlEnd': () => ({ toHeader: false, toFrozen: false })
        };
        if (!(action in actions)) { return; }
        info = active.getInfo();
        const swap: SwapInfo = actions[`${action}`]();
        this.setActive(!swap.toHeader);
        this.getContent().matrix.current = active.matrix.current;
    }

    public internalCellFocus(e: CellFocusArgs): void {
        if (!(e.byKey && e.container.isContent && e.keyArgs.action === 'enter'
            && (e.parent.classList.contains('e-detailcell') ||
                e.parent.classList.contains('e-unboundcell')))) {
            return;
        }
        this.clearIndicator();
        const focusEle: HTMLElement = this.getContent().getFocusable(this.getFocusedElement());
        this.setFocusedElement(focusEle);
        this.currentInfo.skipAction = true;
    }
}

/**
 * Create matrix from row collection which act as mental model for cell navigation
 *
 * @hidden
 */
export class Matrix {
    public matrix: number[][] = [];
    public current: number[] = [];
    public columns: number;
    public rows: number;

    public set(rowIndex: number, columnIndex: number, allow?: boolean): void {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.columns));
        this.matrix[parseInt(rowIndex.toString(), 10)] = this.matrix[parseInt(rowIndex.toString(), 10)] || [];
        this.matrix[parseInt(rowIndex.toString(), 10)][parseInt(columnIndex.toString(), 10)] = allow ? 1 : 0;
    }

    public get(rowIndex: number, columnIndex: number, navigator: number[], action?: string, validator?: Function): number[] {
        const tmp: number = columnIndex; if (rowIndex + navigator[0] < 0) { return [rowIndex, columnIndex]; }
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], this.rows));
        let emptyTable: boolean = true;
        if (isNullOrUndefined(this.matrix[parseInt(rowIndex.toString(), 10)])) { return null; }
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], this.matrix[parseInt(rowIndex.toString(), 10)].length - 1));
        if (tmp + navigator[1] > this.matrix[parseInt(rowIndex.toString(), 10)].length - 1
            && validator(rowIndex, columnIndex, action)) { return [rowIndex, tmp]; }
        const first: number = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
        columnIndex = first === null ? tmp : first;
        const val: number = getValue(`${rowIndex}.${columnIndex}`, this.matrix);
        if (rowIndex === this.rows && (action === 'downArrow' || action === 'enter')) {
            navigator[0] = -1;
        }
        if (first === null) {
            for (let i: number = 0; i < this.rows; i++) {
                if (this.matrix[parseInt(i.toString(), 10)].some((v: number) => { return v === 1; })) {
                    emptyTable = false;
                    break;
                }
            }
            if (emptyTable) {
                rowIndex = this.current.length ? this.current[0] : 0;
                return [rowIndex, columnIndex];
            }
        }
        return this.inValid(val) || !validator(rowIndex, columnIndex, action) ?
            this.get(rowIndex, tmp, navigator, action, validator) : [rowIndex, columnIndex];
    }

    public first(vector: number[], index: number, navigator: number[], moveTo?: boolean, action?: string): number {
        if (((index < 0 || index === vector.length) && this.inValid(vector[parseInt(index.toString(), 10)])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some((v: number) => v === 1)) {
            return null;
        }
        return !this.inValid(vector[parseInt(index.toString(), 10)]) ? index :
            this.first(
                vector,
                (['upArrow', 'downArrow', 'shiftUp', 'shiftDown'].indexOf(action) !== -1) ? moveTo ? 0 : ++index : index + navigator[1],
                navigator, false, action);
    }

    public select(rowIndex: number, columnIndex: number): void {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.matrix[parseInt(rowIndex.toString(), 10)].length - 1));
        this.current = [rowIndex, columnIndex];
    }

    public generate(rows: Row<Column>[], selector: Function, isRowTemplate?: boolean): number[][] {
        this.rows = rows.length - 1; this.matrix = [];
        for (let i: number = 0; i < rows.length; i++) {
            const cells: Cell<Column>[] = rows[parseInt(i.toString(), 10)].cells.filter((c: Cell<Column>) => c.isSpanned !== true);
            this.columns = Math.max(cells.length - 1, this.columns | 0);
            let incrementNumber: number = 0;
            for (let j: number = 0; j < cells.length; j++) {
                if (cells[parseInt(j.toString(), 10)].column && cells[parseInt(j.toString(), 10)].column.columns) {
                    incrementNumber = this.columnsCount(cells[parseInt(j.toString(), 10)].column.columns as Column[], incrementNumber);
                } else {
                    incrementNumber++;
                }
                this.set(i, j, rows[parseInt(i.toString(), 10)].visible === false ?
                    false : selector(rows[parseInt(i.toString(), 10)], cells[parseInt(j.toString(), 10)], isRowTemplate));
            }
            this.columns = Math.max(incrementNumber - 1, this.columns | 0);
        }
        return this.matrix;
    }

    public columnsCount(rowColumns: Column[], currentColumnCount: number): number {
        const columns: Column[]  = rowColumns;
        let incrementNumber: number = currentColumnCount;
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                incrementNumber = this.columnsCount(columns[parseInt(i.toString(), 10)].columns as Column[], incrementNumber);
            } else {
                incrementNumber++;
            }
        }
        return incrementNumber;
    }

    public inValid(value: number): boolean {
        return value === 0 || value === undefined;
    }
}
/**
 * @hidden
 */
export class ContentFocus implements IFocus {
    public matrix: Matrix = new Matrix();
    public parent: IGrid;
    public keyActions: { [x: string]: number[] };
    public lastIdxCell: boolean = false;
    public target: HTMLElement;
    public indexesByKey: (action: string) => number[];
    constructor(parent: IGrid) {
        this.parent = parent;
        this.keyActions = {
            'rightArrow': [0, 1],
            'tab': [0, 1],
            'leftArrow': [0, -1],
            'shiftTab': [0, -1],
            'upArrow': [-1, 0],
            'downArrow': [1, 0],
            'shiftUp': [-1, 0],
            'shiftDown': [1, 0],
            'shiftRight': [0, 1],
            'shiftLeft': [0, -1],
            'enter': [1, 0],
            'shiftEnter': [-1, 0]
        };
        this.indexesByKey = (action: string) => {
            const opt: Object = {
                'home': [this.matrix.current[0], -1, 0, 1],
                'end': [this.matrix.current[0], this.matrix.columns + 1, 0, -1],
                'ctrlHome': [0, -1, 0, 1],
                'ctrlEnd': [this.matrix.rows, this.matrix.columns + 1, 0, -1]
            };
            return opt[`${action}`] || null;
        };
    }

    public getTable(): HTMLTableElement {
        return <HTMLTableElement>(this.parent.getContentTable());
    }

    public onKeyPress(e: KeyboardEventArgs): void | boolean {
        const navigator: number[] = this.keyActions[e.action];
        let current: number[] = this.getCurrentFromAction(e.action, navigator, e.action in this.keyActions, e);
        if (!current) { return; }
        if (((['tab', 'shiftTab'].indexOf(e.action) > -1 && this.matrix.current || []).toString() === current.toString())
            || (this.parent.allowPaging && !this.parent.pagerModule.pagerObj.checkPagerHasFocus()
            && this.matrix.current[0] === this.matrix.rows && ((this.parent.editSettings.mode === 'Batch'
            && this.parent.editSettings.allowAdding && e.keyCode === 40) || (e.keyCode === 40)))) {
            if (current.toString() === [this.matrix.rows, this.matrix.columns].toString() ||
                current.toString() === [0, 0].toString() || (this.matrix.current[0] === this.matrix.rows &&
                     this.matrix.current.toString() === current.toString()) || (this.parent.allowGrouping &&
                         this.parent.infiniteScrollSettings.enableCache && current.toString() === [0, 1].toString())) {
                return false;
            } else {
                current = this.editNextRow(current[0], current[1], e.action);
            }
        }
        this.matrix.select(current[0], current[1]);
    }

    private editNextRow(rowIndex: number, cellIndex: number, action: string): number[] {
        const gObj: IGrid = this.parent;
        const editNextRow: boolean = gObj.editSettings.allowNextRowEdit && (gObj.isEdit || gObj.isLastCellPrimaryKey);
        const visibleIndex: number = gObj.getColumnIndexByField(gObj.getVisibleColumns()[0].field);
        const cell: HTMLElement = this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
        if (action === 'tab' && editNextRow) {
            rowIndex++;
            const index: number = (this.getTable().rows[parseInt(rowIndex.toString(), 10)].getElementsByClassName('e-indentcell').length +
                this.getTable().rows[parseInt(rowIndex.toString(), 10)].getElementsByClassName('e-detailrowcollapse').length);
            cellIndex = visibleIndex + index;
        }
        if (action === 'shiftTab' && editNextRow) {
            rowIndex--;
            cellIndex = gObj.getColumnIndexByField(gObj.getVisibleColumns()[gObj.getVisibleColumns().length - 1].field);
        }
        return !cell.classList.contains(literals.rowCell) && !cell.classList.contains('e-headercell') &&
        !cell.classList.contains('e-groupcaption') && !cell.classList.contains('e-filterbarcell') ?
            this.editNextRow(rowIndex, cellIndex, action) : [rowIndex, cellIndex];
    }

    public getCurrentFromAction(action: string, navigator: number[] = [0, 0], isPresent?: boolean, e?: KeyboardEventArgs): number[] {
        if (!isPresent && !this.indexesByKey(action) || (this.matrix.current.length === 0)) { return null; }
        if (!this.shouldFocusChange(e)) { return this.matrix.current; }
        // eslint-disable-next-line
        let [rowIndex, cellIndex, rN, cN]: number[] = this.indexesByKey(action) || [...this.matrix.current, ...navigator];
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && this.parent.aggregates.length && action === 'enter') {
            for (let i: number = rowIndex; i < this.matrix.matrix.length; i++) {
                const row: HTMLTableRowElement = this.getTable().rows[i + 1];
                if (row && row.cells[parseInt(cellIndex.toString(), 10)] &&  row.cells[parseInt(cellIndex.toString(), 10)].classList.contains('e-rowcell')) {
                    return [i + 1, cellIndex];
                }
                if (i === this.matrix.matrix.length - 1) {
                    return [rowIndex, cellIndex];
                }
            }
        }
        if (action === 'ctrlEnd' || action === 'end') {
            let lastContentCellIndex: number[] = [this.matrix.matrix.length - 1,
                this.matrix.matrix[this.matrix.matrix.length - 1].length - 1];
            if (action === 'end') {
                lastContentCellIndex = [rowIndex, this.matrix.matrix[parseInt(rowIndex.toString(), 10)].length - 1];
            }
            if (this.matrix.matrix[lastContentCellIndex[0]][lastContentCellIndex[1]] === 0) {
                lastContentCellIndex = findCellIndex(this.matrix.matrix, lastContentCellIndex, false);
            }
            rowIndex = lastContentCellIndex[0];
            cellIndex = lastContentCellIndex[1] + 1;
        }
        const current: number[] = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator());
        return current;
    }

    public onClick(e: Event, force?: boolean): void | boolean {
        let target: HTMLTableCellElement = <HTMLTableCellElement>e.target;
        this.target = target;
        target = <HTMLTableCellElement>(target.classList.contains(literals.rowCell) ? target : closest(target, 'td'));
        target = target ? target : <HTMLTableCellElement>closest(<Element>e.target, 'td.e-detailrowcollapse')
            || <HTMLTableCellElement>closest(<Element>e.target, 'td.e-detailrowexpand');
        target = <HTMLTableCellElement>closest(<Element>e.target, 'td.e-detailcell') ?
            isNullOrUndefined(closest(closest(<Element>e.target, '.e-grid'), 'td.e-detailcell')) ? null : target : target;
        target = target && closest(target, 'table').classList.contains(literals.table) ? target : null;
        if (!target) { return false; }
        const [rowIndex, cellIndex]: number[] = [(<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex];
        const [oRowIndex, oCellIndex]: number[] = this.matrix.current;
        const val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex) ||
            (!parentsUntil(e.target as Element, literals.rowCell) && !parentsUntil(e.target as Element, 'e-groupcaption')
            && !parentsUntil(e.target as Element, 'e-recordpluscollapse') && !parentsUntil(e.target as Element, 'e-recordplusexpand')
            && !parentsUntil(e.target as Element, 'e-detailrowcollapse') && !parentsUntil(e.target as Element, 'e-detailrowexpand')
            && !parentsUntil(e.target as Element, 'e-templatecell'))) {
            return false;
        }
        this.matrix.select(rowIndex, cellIndex);
    }

    public getFocusInfo(): FocusInfo {
        const info: FocusInfo = {}; const [rowIndex = 0, cellIndex = 0]: number[] = this.matrix.current;
        this.matrix.current = [rowIndex, cellIndex];
        info.element = !isNullOrUndefined(this.getTable().rows[parseInt(rowIndex.toString(), 10)]) ?
            this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)] : null;
        if (!info.element) {
            return info;
        }
        info.elementToFocus = !info.element.classList.contains('e-unboundcell') && !info.element.classList.contains('e-detailcell')
            ? this.getFocusable(info.element) : info.element;
        info.elementToFocus = info.element.classList.contains('e-detailcell') && info.element.querySelector('.e-childgrid')
            ? info.element.querySelector('.e-childgrid') : info.elementToFocus;
        info.outline = true;
        info.uid = info.element.parentElement.getAttribute('data-uid');
        return info;
    }

    public getFocusable(element: HTMLElement): HTMLElement {
        let query: string = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        const isTemplate: boolean = !isNullOrUndefined(closest(<HTMLElement>element, '.e-templatecell'));
        if (this.parent.isEdit) {
            query = 'input:not([type="hidden"]), select:not([aria-hidden="true"]), textarea';
        }
        const child: HTMLElement[] = [].slice.call(element.querySelectorAll(query));

        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        return child.length ? isTemplate && child.length > 1 ? this.target ? this.target : element : child[0] : element;
    }

    public selector(row: Row<Column>, cell: Cell<Column>, isRowTemplate?: boolean): boolean {
        const types: CellType[] = [CellType.Expand, CellType.GroupCaption, CellType.CaptionSummary, CellType.GroupSummary];
        return ((row.isDataRow && cell.visible && (cell.isDataCell || cell.isTemplate))
            || (row.isDataRow && cell.cellType === CellType.DetailExpand && isNullOrUndefined(cell.visible))
            || (!row.isDataRow && types.indexOf(cell.cellType) > -1
            && !((cell.cellType === CellType.GroupSummary || cell.cellType === CellType.CaptionSummary)
            && !(cell.isDataCell && cell.visible)))
            || (cell.column && cell.visible && cell.column.type === 'checkbox')
            || (cell.cellType === CellType.CommandColumn)
            || (row.isDataRow && isRowTemplate))
            && !(row.edit === 'delete' && row.isDirty);
    }

    public nextRowFocusValidate(index: number): number {
        const lastIndex: number = index;
        for (let i: number = index, len: number = this.matrix.rows; i <= len; i++) {
            if (this.matrix.matrix[parseInt(index.toString(), 10)].indexOf(1) === -1) {
                index = index + 1;
            } else {
                return index;
            }
        }
        this.lastIdxCell = true;
        return lastIndex;
    }

    public previousRowFocusValidate(index: number): number {
        const firstIndex: number = index;
        for (let i: number = index, len: number = 0; i >= len; i--) {
            if (this.matrix.matrix[parseInt(index.toString(), 10)].indexOf(1) === -1) {
                index = index - 1;
                if (index < 0) {
                    this.lastIdxCell = true;
                    return firstIndex;
                }
            } else {
                return index;
            }
        }
        return firstIndex;
    }

    public jump(action: string, current: number[]): SwapInfo {
        this.lastIdxCell = false;
        const enterFrozen: boolean = this.parent.frozenRows !== 0 && action === 'shiftEnter';
        const headerSwap: boolean = (action === 'upArrow' || enterFrozen) && current[0] === 0;
        if (action === 'tab' && this.matrix.matrix.length &&
            current[1] === this.matrix.matrix[current[0]].lastIndexOf(1) && this.matrix.matrix.length - 1 !== current[0]) {
            this.matrix.current[0] = this.nextRowFocusValidate(this.matrix.current[0] + 1);
            this.matrix.current[1] = -1;
        }
        if (action === 'shiftTab' &&
            current[0] !== 0 && this.matrix.matrix[current[0]].indexOf(1) === current[1]) {
            this.matrix.current[0] = this.previousRowFocusValidate(this.matrix.current[0] - 1);
            this.matrix.current[1] = this.matrix.matrix[current[0]].length;
        }
        let isHeaderFocus: boolean = false;
        const row: Element = document.activeElement.parentElement;
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && row.classList.contains(literals.row)) {
            const rowIndex: number = parseInt(row.getAttribute(literals.dataRowIndex), 10);
            isHeaderFocus = rowIndex > 0;
        }
        const info: SwapInfo = {
            swap: !isHeaderFocus ? ((action === 'upArrow' || enterFrozen) && current[0] === 0) : false,
            toHeader: headerSwap
        };
        return info;
    }

    public getNextCurrent(previous: number[] = [], swap?: SwapInfo, active?: IFocus, action?: string): number[] {
        const current: number[] = [];
        if (action === 'rightArrow' || action === 'tab') {
            current[0] = previous[0];
            current[1] = -1;
        }
        if (action === 'downArrow' || action === 'enter') {
            current[0] = -1;
            current[1] = previous[1];
        }
        return current;
    }

    public generateRows(rows?: Row<Column>[], optionals?: Object): void {
        const { matrix, handlerInstance }: { matrix?: number[][], handlerInstance?: IFocus } = optionals;
        const len: number = handlerInstance.matrix.matrix.length;
        const defaultLen: number = this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar' ? len + 1 : len;
        handlerInstance.matrix.matrix = handlerInstance.matrix.matrix.slice(0, defaultLen); //Header matrix update.
        handlerInstance.matrix.rows = defaultLen;
        handlerInstance.matrix.matrix.push(...matrix);
        handlerInstance.matrix.rows += matrix.length;
    }

    public getInfo(e?: KeyboardEventArgs): FocusedContainer {
        const info: FocusInfo = this.getFocusInfo(); const [rIndex, cIndex]: number[] = this.matrix.current;
        const isData: boolean = info.element.classList.contains(literals.rowCell);
        const isSelectable: boolean = isData || (e && e.action !== 'enter' && (info.element.classList.contains('e-detailrowcollapse')
            || info.element.classList.contains('e-detailrowexpand')));
        // eslint-disable-next-line
        let [rowIndex, cellIndex]: number[] = [Math.min(parseInt(info.element.parentElement.getAttribute(literals.dataRowIndex), 10), rIndex),
            Math.min(parseInt(info.element.getAttribute(literals.dataColIndex), 10), cIndex)];
        if (this.parent.allowGrouping && this.parent.groupSettings.enableLazyLoading && isData) {
            rowIndex = this.parent.getDataRows().indexOf(info.element.parentElement);
        }
        return { isContent: true, isDataCell: isData, indexes: [rowIndex, cellIndex], isSelectable: isSelectable };
    }

    public validator(): Function {
        const table: HTMLTableElement = this.getTable();
        return (rowIndex: number, cellIndex: number, action?: string) => {
            if (!isNullOrUndefined(table.rows[parseInt(rowIndex.toString(), 10)])) {
                let cell: HTMLElement;
                cellIndex = table.querySelector('.e-emptyrow') ? 0 : cellIndex;
                if (table.rows[parseInt(rowIndex.toString(), 10)].cells[0].classList.contains('e-editcell')) {
                    cell = table.rows[parseInt(rowIndex.toString(), 10)].cells[0].querySelectorAll('td')[parseInt(cellIndex.toString(), 10)];
                } else {
                    cell = table.rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
                }
                const isCellWidth: boolean = cell.getBoundingClientRect().width !== 0;
                if (action === 'enter' || action === 'shiftEnter') {
                    return isCellWidth && cell.classList.contains(literals.rowCell);
                }
                if ((action === 'shiftUp' || action === 'shiftDown') && cell.classList.contains(literals.rowCell)) {
                    return isCellWidth;
                } else if (action !== 'shiftUp' && action !== 'shiftDown') {
                    return isCellWidth;
                }
            }
            return false;
        };
    }

    protected shouldFocusChange(e: KeyboardEventArgs): boolean {
        const [rIndex = -1, cIndex = -1]: number[] = this.matrix.current;
        if (rIndex < 0 || cIndex < 0) { return true; }
        const cell: Element = getValue(`${rIndex}.cells.${cIndex}`, this.getTable().rows);
        if (!cell) { return true; }
        return e.action === 'enter' || e.action === 'shiftEnter' ?
            cell.classList.contains(literals.rowCell) && !cell.classList.contains('e-unboundcell')
            || cell.classList.contains('e-editedbatchcell') && !cell.classList.contains('e-detailcell') : true;
    }
    protected getGridSeletion(): boolean {
        return this.parent.allowSelection && this.parent.selectionSettings.allowColumnSelection;
    }
}
/**
 * @hidden
 */
export class HeaderFocus extends ContentFocus implements IFocus {
    constructor(parent: IGrid) {
        super(parent);
    }

    public getTable(): HTMLTableElement {
        return <HTMLTableElement>(this.parent.getHeaderTable());
    }

    public onClick(e: Event): void | boolean {
        let target: HTMLTableCellElement = <HTMLTableCellElement>e.target;
        this.target = target;
        target = <HTMLTableCellElement>(target.classList.contains('e-headercell') ? target : closest(target, 'th'));
        if (!target && this.parent.frozenRows !== 0) {
            target = <HTMLTableCellElement>((<HTMLElement>e.target).classList.contains(literals.rowCell) ? e.target :
                closest(<Element>e.target, 'td'));
        }
        if ((e.target as HTMLElement).classList.contains('e-columnheader') ||
            (e.target as HTMLElement).querySelector('.e-stackedheadercell')) {
            return false;
        }
        if (!target) { return; }
        const [rowIndex, cellIndex]: number[] = [(<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex];
        const val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val)) { return false; }
        this.matrix.select((<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex);
    }

    public getFocusInfo(): FocusInfo {
        const info: FocusInfo = {}; const [rowIndex = 0, cellIndex = 0]: number[] = this.matrix.current;
        info.element = this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
        if (!isNullOrUndefined(info.element)) {
            info.elementToFocus = this.getFocusable(info.element);
            info.outline = !info.element.classList.contains('e-filterbarcell');
        }
        return info;
    }

    public selector(row: Row<Column>, cell: Cell<Column>): boolean {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate || !isNullOrUndefined(cell.column.template)
            || !isNullOrUndefined(cell.column.commands))) || cell.column.type === 'checkbox' || cell.cellType === CellType.StackedHeader;
    }

    public jump(action: string, current: number[]): SwapInfo {
        const enterFrozen: boolean = this.parent.frozenRows !== 0 && action === 'enter';
        let isLastCell: boolean;
        let lastRow: boolean;
        if (this.parent.enableHeaderFocus && action === 'tab') {
            lastRow = this.matrix.matrix.length - 1 === current[0];
            isLastCell = current[1] === this.matrix.matrix[current[0]].lastIndexOf(1);
            if (isLastCell) {
                if (!lastRow) {
                    this.matrix.current[0] = this.matrix.current[0] + 1;
                } else {
                    this.matrix.current[0] = 0;
                }
                this.matrix.current[1] = -1;
            }
        }
        return {
            swap: ((action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1) ||
                  (action === 'tab' && lastRow && isLastCell)
        };
    }

    public getNextCurrent(previous: number[] = [], swap?: SwapInfo, active?: IFocus, action?: string): number[] {
        const current1: number[] = [];
        if (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') {
            current1[0] = previous[0];
            current1[1] = -1;
        }
        if (action === 'upArrow' || action === 'shiftEnter') {
            current1[0] = this.matrix.matrix.length;
            current1[1] = previous[1];
        }
        return current1;
    }

    public generateRows(rows?: Row<Column>[]): void {
        const length: number = this.matrix.matrix.length;
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar') {
            this.matrix.rows = ++this.matrix.rows;
            const cells: Cell<Column>[] = rows[0].cells;
            let incrementNumber: number = 0;
            for (let i: number = 0; i < cells.length; i++) {
                if (cells[parseInt(i.toString(), 10)].column && cells[parseInt(i.toString(), 10)].column.columns) {
                    incrementNumber = this.checkFilterColumn(
                        cells[parseInt(i.toString(), 10)].column.columns as Column[], length, incrementNumber);
                } else {
                    this.matrix.set(
                        length, incrementNumber,
                        cells[parseInt(i.toString(), 10)].visible && cells[parseInt(i.toString(), 10)].column.allowFiltering !== false);
                    incrementNumber++;
                }
            }
        }
    }

    private checkFilterColumn(rowColumns: Column[], rowIndex: number, columnIndex: number): number {
        const columns: Column[]  = rowColumns;
        let incrementNumber: number = columnIndex;
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                incrementNumber = this.checkFilterColumn(
                    columns[parseInt(i.toString(), 10)].columns as Column[], rowIndex, incrementNumber);
            } else {
                this.matrix.set(
                    rowIndex, incrementNumber,
                    columns[parseInt(i.toString(), 10)].visible && columns[parseInt(i.toString(), 10)].allowFiltering !== false);
                incrementNumber++;
            }
        }
        return incrementNumber;
    }

    public getInfo(e?: KeyboardEventArgs): FocusedContainer {
        return extend(super.getInfo(e), { isContent: false, isHeader: true });
    }

    public validator(): Function {
        return () => true;
    }
    protected shouldFocusChange(e: KeyboardEventArgs): boolean {
        const [rowIndex, columnIndex]: number[] = this.matrix.current;
        if (rowIndex < 0 || columnIndex < 0) { return true; }
        const cell: Element = getValue(`${rowIndex}.cells.${columnIndex}`, this.getTable().rows);
        if (!cell) {
            return true;
        }
        return e.action === 'enter' || e.action === 'altDownArrow' ? !cell.classList.contains('e-headercell') : true;
    }

    public getHeaderType(): string {
        return 'HeaderFocus';
    }
}

/** @hidden */
export class SearchBox {
    public searchBox: HTMLElement;

    constructor(searchBox: HTMLElement) {
        this.searchBox = searchBox;
    }

    public searchFocus(args: { target: HTMLInputElement }): void {
        args.target.parentElement.classList.add('e-input-focus');
        if (args.target.classList.contains('e-input') && args.target.classList.contains('e-search') && args.target.value){
            const sIcon: HTMLElement = args.target.parentElement.querySelector('.e-sicon');
            sIcon.classList.add('e-clear-icon');
            sIcon.setAttribute('title', 'Clear');
            (sIcon).style.cursor = 'pointer';
        }
    }

    protected searchBlur(args: Event & FocusEvent): void {
        const relatedTarget: EventTarget = args.relatedTarget ? args.relatedTarget : null;
        if ((<HTMLElement>relatedTarget) && (<HTMLElement>relatedTarget).classList.contains('e-sicon')) {
            if ((<HTMLElement>relatedTarget).classList.contains('e-clear-icon')) {
                (<HTMLElement>args.target).parentElement.classList.remove('e-input-focus');
            }
        }
        else {
            (<HTMLInputElement>args.target).parentElement.classList.remove('e-input-focus');
        }
        if ((<HTMLElement>args.target).classList.contains('e-search') && relatedTarget && !((<HTMLElement>relatedTarget).classList.contains('e-sicon e-clear-icon'))
        && !((<HTMLElement>relatedTarget).classList.contains('e-sicon'))){
            const sIcon: HTMLInputElement = (<HTMLInputElement>args.target).parentElement.querySelector('.e-sicon');
            sIcon.classList.remove('e-clear-icon');
            sIcon.removeAttribute('title');
            sIcon.style.cursor = 'default';
        }
    }

    public wireEvent(): void {
        if (this.searchBox) {
            EventHandler.add(this.searchBox, 'focus', this.searchFocus, this);
            EventHandler.add(this.searchBox, 'blur', this.searchBlur, this);
        }
    }

    public unWireEvent(): void {
        if (this.searchBox) {
            EventHandler.remove(this.searchBox, 'focus', this.searchFocus);
            EventHandler.remove(this.searchBox, 'blur', this.searchBlur);
        }
    }
}
