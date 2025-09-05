import { L10n, EventHandler, getValue, KeyboardEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, removeClass, extend, Browser } from '@syncfusion/ej2-base';
import { IGrid, IFocus, FocusInfo, FocusedContainer, IIndex, CellFocusArgs, SwapInfo, GroupEventArgs, VirtualSelectionInfo } from '../base/interface';
import { CellType, FocusType } from '../base/enum';
import * as event from '../base/constant';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { NotifyArgs, EJ2Intance } from '../base/interface';
import { RowModelGenerator } from './row-model-generator';
import { ServiceLocator } from '../services/service-locator';
import { parentsUntil, addRemoveEventListener, findCellIndex } from '../base/util';
import * as literals from '../base/string-literals';
import { Grid } from '../base/grid';
import { Group } from '../actions/group';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';

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
    /** @hidden */
    public virtualSelectionInfo: VirtualSelectionInfo = {};
    private forget: boolean = false;
    private skipFocus: boolean = true;
    private focusByClick: boolean = false;
    private firstHeaderCellClick: boolean = false;
    private passiveHandler: EventListener;
    /** @hidden */
    public prevIndexes: IIndex = {};
    private focusedColumnUid: string;
    private refMatrix: Function = this.refreshMatrix(true);
    private rowModelGen: RowModelGenerator;
    private activeKey: string;
    private empty: string;
    private actions: string[] = ['downArrow', 'upArrow'];
    private isVirtualScroll: boolean = false;
    private evtHandlers: { event: string, handler: Function }[];
    private groupedFrozenRow: number = 0;

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
        const current: number[] = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator(), this.active);
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus && !(e && e.target === this.parent.element)) {
            this.focus(e);
            this.skipFocus = false;
        }
    }

    protected passiveFocus(e: FocusEvent): void {
        if (this.parent.isDestroyed) { return; }
        const firstHeaderCell: Element = this.parent.getHeaderContent().querySelector('.e-headercell:not(.e-hide)');
        if (e.target === firstHeaderCell && e.relatedTarget && !parentsUntil((e.relatedTarget as Element), 'e-grid')
            && !this.firstHeaderCellClick) {
            let firstHeaderCellIndex: number[] = [0, 0];
            if (this.active.matrix.matrix[firstHeaderCellIndex[0]][firstHeaderCellIndex[1]] === 0) {
                firstHeaderCellIndex = findCellIndex(this.active.matrix.matrix, firstHeaderCellIndex, true);
            }
            this.active.matrix.current = firstHeaderCellIndex;
            this.currentInfo.element = e.target as HTMLElement;
            this.currentInfo.elementToFocus = e.target as HTMLElement;
            if (this.currentInfo.element.querySelector('.e-checkselectall')) {
                this.removeFocus();
                this.addFocus(this.getContent().getFocusInfo(), e);
            }
            else {
                addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
            }
        }
        this.firstHeaderCellClick = false;
        if (e.target && (<HTMLElement>e.target).classList.contains('e-detailcell')) {
            this.currentInfo.skipAction = false;
            addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
    }

    protected onBlur(e?: FocusEvent): void {
        if (this.parent.allowPaging && this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer')) {
            this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer').removeAttribute('aria-hidden');
        }
        // The below boolean condition for gantt team focus fix.
        const isGantt: boolean = parentsUntil((e.target as Element), 'e-gantt') && (e.target as Element).classList.contains('e-rowcell')
            && (!isNullOrUndefined((e.target as Element).nextElementSibling)
            && (e.target as Element).nextElementSibling.classList.contains('e-rowcell')) ? true : false;
        if ((this.parent.isEdit || e && (!e.relatedTarget || closest(<HTMLElement>e.relatedTarget, '.e-grid') || closest(<HTMLElement>e.relatedTarget, '.e-grid-popup'))
            && !(this.parent.element.classList.contains('e-childgrid') && !this.parent.element.matches(':focus-within')))
            && !(!isGantt && isNullOrUndefined(e.relatedTarget) && parseInt((e.target as Element).getAttribute('aria-colindex'), 10) - 1 === 0
            && parseInt((e.target as Element).getAttribute('data-index'), 10) === 0) && !(!isGantt && isNullOrUndefined(e.relatedTarget)
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
                return;
            } else if (gObj.toolbarTemplate) {
                (toolbarElement as HTMLElement).tabIndex = 0;
                return;
            }
        }
        if (gObj.getColumns().length) {
            const firstHeaderCell: HTMLElement = gObj.getHeaderContent().querySelector('.e-headercell:not(.e-hide)');
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

    public onClick(e: Event | { target: Element, type?: string }, force?: boolean, isFocusFirstCell?: boolean): void {
        if (parentsUntil(e.target as HTMLElement, 'e-filterbarcell') && (parentsUntil(e.target as HTMLElement, 'e-multiselect') ||
            (e.target as HTMLElement).classList.contains('e-input-group-icon'))) {
            return;
        }
        let isContent: boolean = !isNullOrUndefined(closest(<HTMLElement>e.target,  '.' + literals.gridContent));
        const isHeader: boolean = !isNullOrUndefined(closest(<HTMLElement>e.target, '.' + literals.gridHeader));
        isContent = isContent && isHeader ? !isContent : isContent;
        if (!isContent && isNullOrUndefined(closest(<HTMLElement>e.target, '.' + literals.gridHeader)) ||
            (<Element>e.target).classList.contains(literals.content) || (<Element>e.target).classList.contains(literals.headerContent) ||
            (!isNullOrUndefined(closest(<HTMLElement>e.target, '.e-unboundcell')) && !force)) { return; }
        this.setActive(isContent);
        const beforeArgs: CellFocusArgs = { cancel: false, byKey: false, byClick: !isNullOrUndefined(e.target), clickArgs: <Event>e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel || (closest(<Element>e.target, '.e-inline-edit') && (!this.parent.editSettings.showAddNewRow &&
            (this.parent.editSettings.showAddNewRow && !this.parent.element.querySelector('.e-editedrow'))))) { return; }
        this.setActive(isContent);
        if (this.getContent()) {
            const returnVal: boolean = this.getContent().onClick(e, force);
            if (returnVal === false) { return; }
            this.focus();
            if (this.currentInfo.element.classList.contains('e-rowcell') && e.type && e.type === 'click' && !isFocusFirstCell) {
                addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
            }
            if (isFocusFirstCell && e && e.target){
                addClass([<HTMLElement>e.target], ['e-focused', 'e-focus']);
            }
        }
    }

    private handleFilterNavigation(e: KeyboardEvent, inputSelector: string, buttonSelector: string): void {
        if ((e.target as HTMLElement) === document.querySelector(inputSelector) && e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            (document.querySelector(buttonSelector) as HTMLElement).focus();
        } else if ((e.target as HTMLElement) === document.querySelector(buttonSelector) && e.key === 'Tab' && !e.shiftKey &&
            document.activeElement === document.querySelector(buttonSelector)) {
            e.preventDefault();
            (document.querySelector(inputSelector) as HTMLElement).focus();
        }
    }

    protected onKeyPress(e: KeyboardEventArgs): void {
        if (this.content && this.content.target) {
            this.content.target = null;
        }
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
        if (this.parent.filterSettings.type === 'Excel') {
            this.handleFilterNavigation(e, '.e-excelfilter .e-menu-item:not(.e-disabled)', '.e-excelfilter .e-footer-content button:nth-child(2)');
        }
        if (this.parent.filterSettings.type === 'CheckBox') {
            const focusedColumn: Column = this.parent.getColumnByUid(this.focusedColumnUid);
            const focusTarget: string = focusedColumn && focusedColumn.filter && focusedColumn.filter.hideSearchbox ? '.e-chk-hidden' : '.e-searchinput.e-input';
            this.handleFilterNavigation(e, focusTarget, '.e-checkboxfilter .e-footer-content button:nth-child(2)');
        }
        if (this.parent.filterSettings.type === 'Menu') {
            this.handleFilterNavigation(e, '.e-flmenu .e-input-group.e-popup-flmenu', '.e-flmenu .e-footer-content button:nth-child(2)');
        }
        if (this.parent.showColumnChooser) {
            this.handleFilterNavigation(e, '.e-ccdlg .e-ccsearch.e-cc.e-input', '.e-ccdlg .e-footer-content button:nth-child(2)');
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
                if (!(e.target as HTMLElement).classList.contains('e-toolbar') && this.parent.toolbarTemplate) {
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
            if (this.parent.allowGrouping && !isNullOrUndefined(this.parent.groupSettings.columns)
                && this.parent.groupSettings.columns.length === this.parent.columns.length) {
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
            if (!isNullOrUndefined(this.active) && e.action === 'tab' && bValue.toString() === this.active.matrix.current.toString()) {
                const nextHeaderCellIndex: number[] = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, true);
                let lastHeaderCellIndex: number[] = [this.active.matrix.matrix.length - 1,
                    this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
                if (this.active.matrix.matrix[lastHeaderCellIndex[0]][lastHeaderCellIndex[1]] === 0) {
                    lastHeaderCellIndex = findCellIndex(this.active.matrix.matrix, lastHeaderCellIndex, false);
                }
                const nextCell: Element = getValue(`${nextHeaderCellIndex[0]}.cells.${nextHeaderCellIndex[1]}`, this.active.matrix.getRowsFromIndex(nextHeaderCellIndex[0], this.active));
                if (nextCell && nextCell.getBoundingClientRect().width === 0
                    && this.active.matrix.matrix.length - 1 === nextHeaderCellIndex[0]) {
                    lastHeaderCellIndex = this.active.matrix.nextVisibleCellFocus(
                        nextHeaderCellIndex[0],
                        nextHeaderCellIndex[1],
                        e.action,
                        this.active.keyActions[e.action],
                        this.active,
                        this.active.matrix.current[1]
                    );
                }
                if (this.active.matrix.current.toString() === lastHeaderCellIndex.toString() && this.content.matrix.matrix.length) {
                    returnVal = true;
                    this.setActive(true);
                    let firstContentCellIndex: number[] = [0, 0];
                    if (this.parent.allowPaging && this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer')) {
                        this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer').setAttribute('aria-hidden', 'true');
                    }
                    if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                        firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                    }
                    const firstCell: Element = getValue(`${firstContentCellIndex[0]}.cells.${firstContentCellIndex[1]}`, this.active.matrix.getRowsFromIndex(firstContentCellIndex[0], this.active));
                    if (firstCell && firstCell.getBoundingClientRect().width === 0) {
                        firstContentCellIndex = this.active.matrix.nextVisibleCellFocus(
                            firstContentCellIndex[0],
                            firstContentCellIndex[1],
                            e.action,
                            this.active.keyActions[e.action],
                            this.active,
                            this.active.matrix.current[1]
                        );
                    }
                    this.active.matrix.current = this.parent.editSettings.mode === 'Batch' ?
                        this.isValidBatchEditCell(firstContentCellIndex) ? firstContentCellIndex :
                            this.findBatchEditCell(firstContentCellIndex, true) : firstContentCellIndex;
                    if (this.parent.enableVirtualization && !this.parent.enableColumnVirtualization
                        && (this.parent.contentModule as VirtualContentRenderer).prevInfo.blockIndexes[0] !== 1) {
                        e.preventDefault();
                        this.removeFocus();
                        const virtual: VirtualContentRenderer = this.parent.contentModule as VirtualContentRenderer;
                        virtual.firstCellFocus = true;
                        virtual.content.scrollTop = 0;
                        return;
                    }
                } else if (this.active.matrix.current.toString() !== nextHeaderCellIndex.toString()) {
                    this.active.matrix.current = nextHeaderCellIndex;
                }
            }
            if (!isNullOrUndefined(this.active) && e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                let previousCellIndex: number[] = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, false);
                const prevCell: Element = getValue(`${previousCellIndex[0]}.cells.${previousCellIndex[1]}`, this.active.matrix.getRowsFromIndex(previousCellIndex[0], this.active));
                if (prevCell && prevCell.getBoundingClientRect().width === 0 && previousCellIndex[0] === 0) {
                    previousCellIndex = this.active.matrix.nextVisibleCellFocus(
                        previousCellIndex[0],
                        previousCellIndex[1],
                        e.action,
                        this.active.keyActions[e.action],
                        this.active,
                        this.active.matrix.current[1]
                    );
                }
                if (previousCellIndex.toString() === this.active.matrix.current.toString()) {
                    this.focusOutFromHeader(e);
                    return;
                }
                if (this.active.matrix.current.toString() !== previousCellIndex.toString() && !returnVal) {
                    returnVal = true;
                    const prevCell: Element = getValue(`${previousCellIndex[0]}.cells.${previousCellIndex[1]}`, this.active.matrix.getRowsFromIndex(previousCellIndex[0], this.active));
                    if (prevCell && prevCell.getBoundingClientRect().width === 0 && previousCellIndex[0] === 0) {
                        previousCellIndex = this.active.matrix.nextVisibleCellFocus(
                            previousCellIndex[0],
                            previousCellIndex[1],
                            e.action,
                            this.active.keyActions[e.action],
                            this.active,
                            this.active.matrix.current[1]
                        );
                    }
                    this.active.matrix.current = previousCellIndex;
                }
            }
        }
        if (e.target && parentsUntil(e.target as Element, 'e-gridcontent')) {
            if (this.parent.allowPaging && this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer')) {
                this.parent.pagerModule.pagerObj.element.querySelector('.e-pagercontainer').removeAttribute('aria-hidden');
            }
            if (this.parent.editSettings.mode === 'Batch' && (e.action === 'tab' || e.action === 'shiftTab')) {
                this.active.matrix.current = this.findBatchEditCell(prevBatchValue, e.action === 'tab' ? true : false);
                if (e.action === 'tab' && prevBatchValue.toString() === this.active.matrix.current.toString()) {
                    this.parent.editModule.editModule.addBatchRow = true;
                }
            }
            if (e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                if (this.parent.allowGrouping && !isNullOrUndefined(this.parent.groupSettings.columns)
                    && this.parent.groupSettings.columns.length === this.parent.columns.length) {
                    this.focusOutFromHeader(e);
                    return;
                }
                let firstContentCellIndex: number[] = [0, 0];
                if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                    firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                }
                const firstCell: Element = getValue(`${firstContentCellIndex[0]}.cells.${firstContentCellIndex[1]}`, this.active.matrix.getRowsFromIndex(firstContentCellIndex[0], this.active));
                if (firstCell && firstCell.getBoundingClientRect().width === 0) {
                    firstContentCellIndex = this.active.matrix.nextVisibleCellFocus(
                        firstContentCellIndex[0],
                        firstContentCellIndex[1],
                        e.action,
                        this.active.keyActions[e.action],
                        this.active,
                        this.active.matrix.current[1]
                    );
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
        this.header.action = e.action;
        this.header.currentTarget = null;
        this.header.focusType = 'key';
        if (e.target && parentsUntil(e.target as HTMLElement, 'e-fltrtemp') && (e.action === 'tab' || e.action === 'shiftTab')) {
            const target: HTMLElement = e.target as HTMLElement;
            const focusElement: HTMLElement[] = [].slice.call(closest(target, 'th').querySelectorAll('.e-fltrtemp-focus'));
            if (focusElement.length) {
                const elementIndex: number = focusElement.indexOf(target);
                const resetActive: boolean = ((e.action === 'tab' && elementIndex < focusElement.length - 1)
                    || (e.action === 'shiftTab' && elementIndex > 0)) ? true : false;
                if (resetActive) {
                    this.setActive(false);
                    this.active.matrix.current = bValue;
                    this.active.currentTarget = target;
                }
            }
        }
        if (focusFirstHeaderCell && parentsUntil(this.active.getTable(), 'e-gridheader')
            && e.target && (e.target as HTMLElement).id === this.parent.element.id + '_searchbar') {
            (this.parent as Grid).searchModule.headerFocus = true;
        }
        e.preventDefault();
        this.focus(e);
    }

    private isValidBatchEditCell(cellIndex: number[]): boolean {
        const cell: Element = this.active.getTable().rows[cellIndex[0]].cells[cellIndex[1]];
        const tr: Element = closest(cell, 'tr');
        const cellColIndex: number = parseInt(cell.getAttribute('aria-colindex'), 10) - 1;
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
            const tempCell: Element = getValue(`${tempCellIndex[0]}.cells.${tempCellIndex[1]}`, this.active.getTable().rows);
            if (tempCell && tempCell.getBoundingClientRect().width === 0) {
                tempCellIndex = this.active.matrix.nextVisibleCellFocus(
                    tempCellIndex[0],
                    tempCellIndex[1],
                    this.activeKey,
                    this.active.keyActions[this.activeKey],
                    this.active,
                    this.active.matrix.current[1]
                );
            }
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
        const lastCell: Element = getValue(`${lastContentCellIndex[0]}.cells.${lastContentCellIndex[1]}`, this.active.matrix.getRowsFromIndex(lastContentCellIndex[0], this.active));
        if (lastCell && lastCell.getBoundingClientRect().width === 0) {
            lastContentCellIndex = this.active.matrix.nextVisibleCellFocus(
                lastContentCellIndex[0],
                lastContentCellIndex[1],
                this.activeKey,
                this.active.keyActions[this.activeKey],
                this.active,
                this.active.matrix.current[1]
            );
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
            if (focusableToolbarItems.length > 0) {
                e.preventDefault();
                (focusableToolbarItems[focusableToolbarItems.length - 1].querySelector('.e-toolbar-item-focus,.e-btn,.e-input') as HTMLElement).focus();
                return;
            } else if (this.parent.toolbarTemplate) {
                e.preventDefault();
                (toolbarElement as HTMLElement).focus();
                return;
            }
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
        if (!this.parent.isEdit && target && target.closest('.e-unboundcell') && this.currentInfo.skipAction && ((e.action === 'shiftTab' &&
            this.commandColumnFocusElement(target.closest('.e-unboundcell') as HTMLElement, false) === target) ||
            (e.action === 'tab' &&
                this.commandColumnFocusElement(target.closest('.e-unboundcell') as HTMLElement, true) === target))) {
            return this.currentInfo.skipAction = false;
        }
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
        const addNewRow: boolean = this.parent.editSettings.showAddNewRow && closest(document.activeElement, '.e-addedrow') !== null;
        if ((th && closest(document.activeElement, '.e-filterbarcell') !== null) || addNewRow) {
            this.removeFocus();
        }
        let filterCell: boolean = closest(document.activeElement, '.e-filterbarcell') !== null;
        if (this.parent.enableHeaderFocus && filterCell) {
            const matrix: Matrix = this.active.matrix;
            const current: number[] = matrix.current;
            filterCell = matrix.matrix[current[0]].lastIndexOf(1) !== current[1];
        }
        if (this.parent.isEdit && (e.action === 'tab' || e.action === 'shiftTab') && this.parent.editSettings.mode === 'Normal'
            && !this.parent.editSettings.showAddNewRow && !isNullOrUndefined(parentsUntil(target, 'e-addedrow'))) {
            const inputElements: NodeListOf<Element> = this.parent.editModule.formObj.element.querySelectorAll(
                'input:not([type="hidden"],.e-numeric-hidden,.e-disabled), select:not([aria-hidden="true"]), button:not(.e-hide), textarea:not(.e-hide,.e-disabled,[disabled])');
            const inputTarget: HTMLElement = target.classList.contains('e-ddl') ? target.querySelector('input') : target;
            const firstEditCell: boolean = e.action === 'tab' && inputTarget === inputElements[inputElements.length - 1];
            const lastEditCell: boolean = e.action === 'shiftTab' && inputTarget === inputElements[0];
            if (firstEditCell || lastEditCell) {
                e.preventDefault();
                let focusElement: HTMLElement = inputElements[firstEditCell ? 0 : inputElements.length - 1] as HTMLElement;
                focusElement = focusElement.parentElement.classList.contains('e-ddl') ? focusElement.parentElement : focusElement;
                focusElement.focus();
            }
        }
        return (e.action === 'delete'
            || (this.parent.editSettings.mode !== 'Batch' && ((this.parent.isEdit && (!this.parent.editSettings.showAddNewRow ||
                (this.parent.editSettings.showAddNewRow && ((!isNullOrUndefined(this.parent.element.querySelector('.e-editedrow')) ||
                (!isNullOrUndefined(parentsUntil(target, 'e-addedrow')) && !isNullOrUndefined(closest((e.target as HTMLElement), 'input')) && !isNullOrUndefined(document.querySelector('.e-popup-open'))) ||
                (!isNullOrUndefined(parentsUntil(target, 'e-addedrow')) && (target && !target.querySelector('.e-cancel-icon')) &&
                !isNullOrUndefined(parentsUntil(target, 'e-unboundcell')))))))) || ['insert', 'f2'].indexOf(e.action) > -1))
            || ((filterCell && this.parent.enableHeaderFocus) || ((filterCell || addNewRow) && e.action !== 'tab' && e.action !== 'shiftTab') ||
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
                if (((this.parent.enableVirtualization && !this.parent.selectVirtualRowOnAdd) && (!e || (e && e.action !== 'ctrlHome' && e.action !== 'ctrlEnd'))) ||
                    !this.parent.enableVirtualization) {
                    (<{ selectedRowIndex?: number }>this.parent.contentModule).selectedRowIndex = -1;
                }
                this.parent.selectVirtualRowOnAdd = false;
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
                    const filterMenuElement: Element = isNullOrUndefined(this.parent.element.querySelector('.e-flmenu')) ?
                        document.querySelector('.e-grid-popup .e-flmenu') : this.parent.element.querySelector('.e-flmenu');
                    if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) && isNullOrUndefined(filterMenuElement)) {
                        this.focusVirtualElement(e);
                    } else if (isNullOrUndefined(filterMenuElement) ||
                    parentsUntil(document.activeElement, 'e-flmenu-valuediv') !== filterMenuElement.querySelector('.e-flmenu-valuediv')) {
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
        if (this.parent.isReact && !this.parent.isEdit && this.currentInfo.element.classList.contains('e-rowcell')
            && !this.currentInfo.element.parentElement && !(this.parent.allowGrouping
            && !isNullOrUndefined(this.parent.groupSettings.columns) && this.parent.groupSettings.columns.length) &&
            this.parent.getRowByIndex(this.prevIndexes.rowIndex)) {
            const cellElem: HTMLElement = this.parent.getCellFromIndex(this.prevIndexes.rowIndex, this.prevIndexes
                .cellIndex) as HTMLElement;
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
            if (!isNullOrUndefined(this.parent.groupSettings.columns) && this.parent.groupSettings.columns.length && frozenRow && content) {
                frozenRow = 0;
                for (let i: number = 0; i < e.rows.length; i++) {
                    frozenRow++;
                    if (e.rows[parseInt(i.toString(), 10)].index + 1 === this.parent.frozenRows) {
                        break;
                    }
                }
                this.groupedFrozenRow = frozenRow;
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
                const matrixcs: number[][] = this.header.matrix.matrix;
                const hdrLen: number = (<{ rows?: Row<Column>[] }>this.parent.headerModule).rows.length;
                matrixcs.splice(hdrLen, matrixcs.length - hdrLen);
            }
            const matrix: number[][] = cFocus.matrix.generate(updateRow, cFocus.selector, isRowTemplate);
            cFocus.matrix.generate(rows, cFocus.selector, isRowTemplate);
            const isScroll: boolean = this.parent.enableVirtualization || this.parent.enableInfiniteScrolling;
            if ((this.parent.editSettings.showAddNewRow && content && this.header && this.header.matrix) &&
                (!isScroll || (isScroll && this.parent.isAddNewRow))) {
                const tempMatrix: number[][] = this.header.matrix.matrix;
                const lastRowHeaderIdx: number = this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar' ? 2 : 1;
                cFocus.matrix.rows = this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top' ?
                    cFocus.matrix.rows : ++cFocus.matrix.rows;
                if (this.parent.editSettings.newRowPosition === 'Top') {
                    (this.parent.frozenRows || isScroll ?
                        matrix : cFocus.matrix.matrix).unshift(this.refreshAddNewRowMatrix(tempMatrix[tempMatrix.length -
                            lastRowHeaderIdx]));
                } else {
                    cFocus.matrix.matrix.push(this.refreshAddNewRowMatrix(tempMatrix[tempMatrix.length - lastRowHeaderIdx]));
                }
                this.parent.isAddNewRow = false;
            }
            if (!(this.parent.isFrozenGrid() && (e.args && (e.args.requestType === 'sorting'
                || e.args.requestType === 'batchsave' || e.args.requestType === 'paging'))) ||
                (frozenRow && this.parent.editSettings.mode === 'Batch' && content && (e.name === 'batchDelete' ||  e.name === 'batchAdd' ||
                e.name === 'batchCancel' || e.args.requestType === 'batchsave'))) {
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
                        const frzLeftCount: number = this.parent.getVisibleFrozenLeftCount();
                        const frzRightCount: number = this.parent.getVisibleFrozenRightCount();
                        if (this.parent.enableColumnVirtualization && !(frzLeftCount && frzRightCount) && this.parent.isFrozenGrid() &&
                            e.args.virtualInfo.direction === 'right') {
                            this.content.matrix.current[1] =  this.content.matrix.current[1] - (frzLeftCount + (
                                frzRightCount ? frzRightCount + 1 : 0));
                        }
                        const isGroup: boolean = this.parent.allowGrouping && this.parent.groupSettings.columns.length ? true : false;
                        if (isGroup) {
                            this.content.matrix.current[1] = this.prevIndexes.cellIndex;
                            if (this.virtualSelectionInfo.isPending) {
                                this.content.matrix.current[0] = this.virtualSelectionInfo.direction === 'downArrow' ? this.content.matrix.current[0] + 1
                                    : this.content.matrix.current[0] - 1;
                            }
                        }
                        const focusElement: HTMLElement = this.getContent().getFocusInfo().elementToFocus;
                        if (focusElement) {
                            const cellPosition: ClientRect = focusElement.getBoundingClientRect();
                            const gridPosition: ClientRect = this.parent.element.getBoundingClientRect();
                            let freezeLeftColWidth: number = 0;
                            let freezeRightColWidth: number = 0;
                            if (this.parent.enableColumnVirtualization && !(frzLeftCount && frzRightCount) && this.parent.isFrozenGrid() &&
                                e.args.virtualInfo.direction === 'right') {
                                if (frzLeftCount) {
                                    freezeLeftColWidth = this.parent.leftrightColumnWidth('left');
                                } else {
                                    freezeRightColWidth = this.parent.leftrightColumnWidth('right');
                                }
                            }
                            if ((cellPosition.top >= 0 && cellPosition.left >= 0 &&
                                (cellPosition.right - freezeLeftColWidth - freezeRightColWidth) <= (Math.min(
                                    gridPosition.right, window.innerWidth || document.documentElement.clientWidth) + freezeRightColWidth)
                                    && cellPosition.bottom <= Math.min(gridPosition.bottom, window.innerHeight ||
                                    document.documentElement.clientHeight)) || isGroup) {
                                this.isVirtualScroll = true;
                                this.focus(isGroup && this.virtualSelectionInfo.isPending ?
                                    this.virtualSelectionInfo.event as KeyboardEventArgs : undefined);
                            }
                        }
                    }
                } else if (e.args.focusElement && e.args.focusElement.classList.contains('e-filtertext')) {
                    const focusElement: HTMLElement = <HTMLElement>this.parent.element.querySelector('#' + e.args.focusElement.id);
                    if (focusElement) {
                        focusElement.focus();
                    }
                }
                this.virtualSelectionInfo = {};
            }
            if (e && e.args && e.args.requestType === 'infiniteScroll') {
                this.isInfiniteScroll = true;
            }
        };
    }

    private refreshAddNewRowMatrix(matrix?: number[]): number[] {
        const cols: Column[] = this.parent.getColumns();
        const indent: number = this.parent.getIndentCount();
        for (let i: number = indent; i < matrix.length - 1; i++) {
            if (cols[i - indent] && cols[i - indent].visible && cols[i - indent].allowEditing) {
                matrix[parseInt(i.toString(), 10)] = 1;
            } else {
                matrix[parseInt(i.toString(), 10)] = 0;
            }
        }
        return matrix;
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
            { event: event.showAddNewRowFocus, handler: this.showAddNewRowFocus },
            { event: event.headerRefreshed, handler: this.refreshMatrix() },
            { event: event.closeEdit, handler: this.restoreFocus },
            { event: event.restoreFocus, handler: this.restoreFocus },
            { event: 'start-edit', handler: this.clearIndicator },
            { event: 'start-add', handler: this.clearIndicator },
            { event: 'sorting-complete', handler: this.restoreFocus },
            { event: 'filtering-complete', handler: this.filterfocus },
            { event: 'custom-filter-close', handler: this.filterfocus },
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

    private showAddNewRowFocus(): void {
        if (this.parent.editSettings.showAddNewRow) {
            const startIdx: number = this.parent.editSettings.newRowPosition === 'Top' ? 0 : this.content.matrix.matrix.length - 1;
            let startCellIdx: number = this.parent.getIndentCount();
            if (this.parent.editSettings.newRowPosition === 'Top' && (this.parent.frozenRows ||
                this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                const headrIdx: number = this.header.matrix.matrix.length - (this.groupedFrozenRow ?
                    this.groupedFrozenRow : this.parent.frozenRows);
                startCellIdx = this.findNextCellFocus(
                    this.header.matrix.matrix[headrIdx - 1], startCellIdx);
                this.header.matrix.current = [headrIdx - 1, startCellIdx];
                this.active = this.header;
            } else {
                startCellIdx = this.findNextCellFocus(
                    this.content.matrix.matrix[parseInt(startIdx.toString(), 10)], startCellIdx);
                this.content.matrix.current = [startIdx, startCellIdx];
                this.active = this.content;
            }
            const addedrow: HTMLElement = this.parent.element.querySelector('.e-addedrow');
            if (addedrow && addedrow.querySelectorAll('tr') &&
                addedrow.querySelector('tr').cells[parseInt(startCellIdx.toString(), 10)].querySelector('input')) {
                (addedrow.querySelector('tr').cells[parseInt(startCellIdx.toString(), 10)].querySelector('input') as HTMLInputElement).select();
            }
        }
    }

    public findNextCellFocus(matrix?: number[], cellIndex?: number): number {
        for (let i: number = cellIndex; i < matrix.length; i++) {
            if (matrix[parseInt(i.toString(), 10)] === 1) {
                return i;
            }
        }
        return cellIndex;
    }

    public filterfocus(): void {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            this.removeFocus();
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

    public restoreFocus(arg?: NotifyArgs): void {
        if (arg && arg.requestType === 'sorting' && isNullOrUndefined(arg.target)) {
            return;
        }
        const groupModule: Group = (this.parent as Grid).groupModule;
        if ( this.parent.allowGrouping && groupModule && (groupModule.groupSortFocus || groupModule.groupTextFocus)) {
            groupModule.groupSortFocus = false;
            groupModule.groupTextFocus = false;
            return;
        }
        this.firstHeaderCellClick = true;
        this.addFocus(this.getContent().getFocusInfo());
        const requestTypes: string[] = ['add', 'save', 'delete', 'cancel', 'batchsave', 'batchDelete', 'batchCancel'];
        const focusInfo: FocusInfo = this.getContent().getFocusInfo();
        if (arg && requestTypes.indexOf(arg.requestType) > -1  && focusInfo && focusInfo.elementToFocus && focusInfo.elementToFocus.matches('.e-rowcell.e-focus')) {
            addClass([focusInfo.elementToFocus], ['e-focused', 'e-focus']);
        }
    }

    public restoreFocusWithAction(e: NotifyArgs): void {
        if (!this.parent.enableInfiniteScrolling &&
            !((this.parent as Grid).groupModule && (this.parent as Grid).groupModule.preventFocusOnGroup)) {
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
            this.prevIndexes = { rowIndex: current[0], cellIndex: current[1] };
            const groupModule: Group = (this.parent as Grid).groupModule;
            if ( this.parent.allowGrouping && groupModule && groupModule.groupCancelFocus) {
                const focusableGroupedItems: Element[] = groupModule.getFocusableGroupedItems();
                if (focusableGroupedItems.length) {
                    if (focusableGroupedItems[0].parentElement.getAttribute('data-mappingname') === (e as GroupEventArgs).columnName) {
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
        if (!(e.byKey && e.container.isContent && ((e.keyArgs.action === 'enter' && e.parent.classList.contains('e-detailcell')) ||
            ((e.keyArgs.action === 'tab' || e.keyArgs.action === 'shiftTab') && e.parent.classList.contains('e-unboundcell'))))) {
            return;
        }
        this.clearIndicator();
        let focusEle: HTMLElement;
        if (e.parent && e.parent.closest('.e-unboundcell') && e.keyArgs.action === 'shiftTab') {
            focusEle = this.commandColumnFocusElement(e.parent, true);
        } else {
            focusEle = this.getContent().getFocusable(this.getFocusedElement());
        }
        this.setFocusedElement(focusEle);
        this.currentInfo.skipAction = true;
    }

    private commandColumnFocusElement(cell: HTMLElement, isLast: boolean): HTMLElement {
        const commandButtons: NodeListOf<Element> = cell.querySelectorAll('button:not(.e-hide)');
        return isLast ? commandButtons[commandButtons.length - 1] as HTMLElement : commandButtons[0] as HTMLElement;
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

    public get(rowIndex: number, columnIndex: number, navigator: number[], action?: string, validator?: Function,
               active?: IFocus ): number[] {
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
        let cell: Element;
        if (active) {
            const rows: HTMLTableRowElement | HTMLCollectionOf<HTMLTableRowElement> = this.getRowsFromIndex(rowIndex, active);
            cell = getValue(`${rowIndex}.cells.${columnIndex}`, rows);
        }
        if (cell && cell.getBoundingClientRect().width === 0) {
            const current: number[] = this.nextVisibleCellFocus(rowIndex, columnIndex, action, navigator, active, tmp);
            rowIndex = current[0];
            columnIndex = current[1];
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

    public getRowsFromIndex(rowIndex: number, active: IFocus): HTMLTableRowElement | HTMLCollectionOf<HTMLTableRowElement> {
        return active.getTable().rows[parseInt(rowIndex.toString(), 10)].classList.contains('e-addedrow') ?
            active.getTable().rows[parseInt(rowIndex.toString(), 10)].querySelector('table').rows : active.getTable().rows;
    }

    public nextVisibleCellFocus(rowIndex: number, columnIndex: number, action: string, navigator: number[],
                                active: IFocus, tmp: number): number[] {
        let rows: HTMLTableRowElement | HTMLCollectionOf<HTMLTableRowElement> = this.getRowsFromIndex(rowIndex, active);
        let cell: HTMLTableCellElement = getValue(`${rowIndex}.cells.${columnIndex}`, rows);
        const rowMatrix: number[][] = active.matrix.matrix;
        const maxRow: number = rowMatrix.length - 1;
        const isTab: boolean = action === 'tab';
        const isShiftTab: boolean = action === 'shiftTab';
        const skipAction: boolean = action === 'enter' || action === 'shiftEnter' || action === 'downArrow' || action === 'upArrow';
        if (skipAction) {
            return [rowIndex, columnIndex];
        }
        while (cell && cell.getBoundingClientRect().width === 0) {
            if ((isTab && rowIndex === maxRow && columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].lastIndexOf(1)) ||
                (isShiftTab && rowIndex === 0 && columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].indexOf(1))) {
                columnIndex = tmp;
                return [rowIndex, columnIndex];
            }
            if (isTab) {
                if (columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].lastIndexOf(1)) {
                    rowIndex++;
                    columnIndex = rowMatrix[parseInt(rowIndex.toString(), 10)].indexOf(1);
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                    rows = this.getRowsFromIndex(rowIndex, active);
                } else {
                    columnIndex++;
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                }
            } else if (isShiftTab) {
                if (columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].indexOf(1)) {
                    rowIndex--;
                    columnIndex = rowMatrix[parseInt(rowIndex.toString(), 10)].lastIndexOf(1);
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                    rows = this.getRowsFromIndex(rowIndex, active);
                } else {
                    columnIndex--;
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                }
            } else if ((action === 'rightArrow' || action === 'shiftRight')) {
                if (columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].lastIndexOf(1)) {
                    columnIndex = tmp;
                }
                else {
                    columnIndex++;
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                }
            } else if ((action === 'leftArrow' || action === 'shiftLeft')) {
                if (columnIndex === rowMatrix[parseInt(rowIndex.toString(), 10)].indexOf(1)) {
                    columnIndex = tmp;
                } else {
                    columnIndex--;
                    columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
                }
            } else if (action === null) {
                columnIndex++;
                columnIndex = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
            }
            cell = getValue(`${rowIndex}.cells.${columnIndex}`, rows);
        }
        return [rowIndex, columnIndex];
    }

    public first(vector: number[], index: number, navigator: number[], moveTo?: boolean, action?: string): number {
        if (((index < 0 || index === vector.length) && this.inValid(vector[parseInt(index.toString(), 10)])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some((v: number) => v === 1)) {
            return null;
        }
        return !this.inValid(vector[parseInt(index.toString(), 10)]) ? index :
            this.first(
                vector,
                (['upArrow', 'downArrow', 'shiftUp', 'shiftDown', 'enter', 'shiftEnter'].indexOf(action) !== -1) ? moveTo ? 0 : ++index :
                    index + navigator[1], navigator, false, action);
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
    public focusType: FocusType;
    public currentTarget: HTMLElement;
    public action: string;
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
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey) {
            if (e.action === 'home') {
                e.action = 'ctrlHome';
            } else if (e.action === 'end') {
                e.action = 'ctrlEnd';
            } else if (['downArrow', 'upArrow', 'leftArrow', 'rightArrow'].indexOf(e.action) !== -1) {
                return;
            }
        }
        const navigators: number[] = this.keyActions[e.action];
        let current: number[] = this.getCurrentFromAction(e.action, navigators, e.action in this.keyActions, e);
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
        const row: HTMLTableRowElement = this.getTable().rows[parseInt(rowIndex.toString(), 10)];
        const cell: HTMLElement = gObj.editSettings.showAddNewRow && row.classList.contains('e-addedrow') ?
            (row.querySelectorAll<HTMLElement>('td:not(.e-editcell)'))[parseInt(cellIndex.toString(), 10)]
            : row.cells[parseInt(cellIndex.toString(), 10)];
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
        if (this.parent.allowGrouping && !isNullOrUndefined(this.parent.groupSettings.columns) && this.parent.groupSettings.columns.length && this.parent.aggregates.length && action === 'enter') {
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
        const current: number[] = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator(), this);
        return current;
    }

    private checkRowCellFocus(target: Element): boolean {
        return target.classList.contains(literals.rowCell) ? target.classList.contains('e-focused') : true;
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
        let rowIdx: number = (<HTMLTableRowElement>target.parentElement).rowIndex;
        if (this.parent.editSettings.showAddNewRow && parentsUntil(<Element>target, 'e-addedrow')) {
            rowIdx = (<HTMLTableRowElement>parentsUntil(<Element>target, 'e-addedrow')).rowIndex;
        }
        const [rowIndex, cellIndex]: number[] = [rowIdx, target.cellIndex];
        const [oRowIndex, oCellIndex]: number[] = this.matrix.current;
        const val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex && this.checkRowCellFocus(target)) ||
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
        const row: HTMLTableRowElement = this.getTable().rows[parseInt(rowIndex.toString(), 10)];
        info.element = !isNullOrUndefined(row) ? this.parent.editSettings.showAddNewRow && row.classList.contains('e-addedrow') ?
            (row.querySelectorAll<HTMLElement>('td:not(.e-editcell)'))[parseInt(cellIndex.toString(), 10)]
            : row.cells[parseInt(cellIndex.toString(), 10)] : null;
        if (!info.element) {
            return info;
        }
        info.elementToFocus = (!info.element.classList.contains('e-unboundcell') || (this.parent.editSettings.showAddNewRow &&
            info.element.classList.contains('e-unboundcell') && parentsUntil(info.element, 'e-addedrow'))) &&
            !info.element.classList.contains('e-detailcell') ? this.getFocusable(info.element) : info.element;
        info.elementToFocus = info.element.classList.contains('e-detailcell') && info.element.querySelector('.e-childgrid')
            ? info.element.querySelector('.e-childgrid') : info.elementToFocus;
        if (this.parent.editSettings.mode === 'Batch' && this.parent.isEdit && info.elementToFocus.tagName.toLowerCase() === 'input'
            && info.elementToFocus.classList.contains('e-dropdownlist')) {
            info.elementToFocus = info.elementToFocus.parentElement;
        }
        info.outline = true;
        info.uid = info.element.parentElement.getAttribute('data-uid');
        return info;
    }

    public getFocusable(element: HTMLElement): HTMLElement {
        let query: string = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        const isTemplate: boolean = !isNullOrUndefined(closest(<HTMLElement>element, '.e-templatecell'));
        if (this.parent.isEdit) {
            const commandCellQuery: string = this.parent.editSettings.showAddNewRow && parentsUntil(element, 'e-addedrow') ?
                ', button:not(.e-hide)' : '';
            query = 'input:not([type="hidden"]), select:not([aria-hidden="true"]), textarea' + commandCellQuery;
        }
        const child: HTMLElement[] = [].slice.call(element.querySelectorAll(query));
        if (element.classList.contains('e-fltrtemp')) {
            const focusElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-fltrtemp-focus'));
            if (this.focusType === 'click' && this.target && this.target.classList.contains('e-fltrtemp-focus')) {
                return this.target;
            } else if (this.focusType === 'key' && focusElement.length && (this.action === 'tab' || this.action === 'shiftTab')) {
                const elementIndex: number = focusElement.indexOf(this.currentTarget);
                return elementIndex === -1 ? focusElement[this.action === 'tab' ? 0 : focusElement.length - 1]
                    : focusElement[this.action === 'tab' ? elementIndex + 1 : elementIndex - 1];
            }
        }

        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        return child.length ? isTemplate && child.length > 1 && !(this.parent.editSettings.mode === 'Batch'
            && this.parent.isEdit && this.target) ? this.target ? this.target : element : child[0] : element;
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
        if (this.matrix.matrix[current[0]]) {
            if (action === 'tab' && this.matrix.matrix.length &&
                current[1] === this.matrix.matrix[current[0]].lastIndexOf(1) && this.matrix.matrix.length - 1 !== current[0]) {
                this.matrix.current[0] = this.nextRowFocusValidate(this.matrix.current[0] + 1);
                this.matrix.current[1] = -1;
            }
        }
        if (action === 'shiftTab' &&
            current[0] !== 0 && this.matrix.matrix[current[0]].indexOf(1) === current[1]) {
            this.matrix.current[0] = this.previousRowFocusValidate(this.matrix.current[0] - 1);
            this.matrix.current[1] = this.matrix.matrix[current[0]].length;
        }
        let isHeaderFocus: boolean = false;
        const row: Element = parentsUntil(document.activeElement, 'e-addedrow') && this.parent.editSettings.showAddNewRow ?
            parentsUntil(document.activeElement, 'e-addedrow') : document.activeElement.parentElement;
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && !isNullOrUndefined(row) && row.classList.contains(literals.row)) {
            const rowIndex: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1;
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
        let [rowIndex, cellIndex]: number[] = [Math.min(parseInt(info.element.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1, rIndex),
            Math.min(parseInt(info.element.getAttribute(literals.ariaColIndex), 10) - 1, cIndex)];
        if (this.parent.allowGrouping && this.parent.groupSettings.enableLazyLoading && isData) {
            rowIndex = this.parent.getDataRows().indexOf(info.element.parentElement);
        }
        if (this.parent.enableVirtualization && this.parent.groupSettings.columns.length) {
            rowIndex = rIndex;
            cellIndex = cIndex;
        }
        if (this.parent.editSettings.showAddNewRow && this.parent.editSettings.newRowPosition === 'Top' &&
            !this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling && e && e.action === 'downArrow') {
            rowIndex++;
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
        this.focusType = 'click';
        let target: HTMLTableCellElement = <HTMLTableCellElement>e.target;
        this.target = target;
        target = <HTMLTableCellElement>(target.classList.contains('e-headercell') ? target : closest(target, 'th'));
        if (!target && (this.parent.frozenRows !== 0 || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) &&
            this.parent.editSettings.showAddNewRow))) {
            target = <HTMLTableCellElement>((<HTMLElement>e.target).classList.contains(literals.rowCell) ? e.target :
                closest(<Element>e.target, 'td'));
        }
        if ((e.target as HTMLElement).classList.contains('e-columnheader') ||
            (e.target as HTMLElement).querySelector('.e-stackedheadercell')) {
            return false;
        }
        if (!target) { return; }
        let rowIdx: number = (<HTMLTableRowElement>target.parentElement).rowIndex;
        if (this.parent.editSettings.showAddNewRow && parentsUntil(<Element>target, 'e-addedrow')) {
            rowIdx = (<HTMLTableRowElement>parentsUntil(<Element>target, 'e-addedrow')).rowIndex;
        }
        const [rowIndex, cellIndex]: number[] = [rowIdx, target.cellIndex];
        const val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val)) { return false; }
        this.matrix.select(rowIdx, target.cellIndex);
    }

    public getFocusInfo(): FocusInfo {
        const info: FocusInfo = {}; const [rowIndex = 0, cellIndex = 0]: number[] = this.matrix.current;
        const row: HTMLTableRowElement = this.getTable().rows[parseInt(rowIndex.toString(), 10)];
        info.element = !isNullOrUndefined(row) ? this.parent.editSettings.showAddNewRow && row.classList.contains('e-addedrow') ?
            (row.querySelectorAll<HTMLElement>('td:not(.e-editcell)'))[parseInt(cellIndex.toString(), 10)]
            : row.cells[parseInt(cellIndex.toString(), 10)] : null;
        if (!isNullOrUndefined(info.element)) {
            info.elementToFocus = this.getFocusable(info.element);
            info.outline = !info.element.classList.contains('e-filterbarcell');
        }
        return info;
    }

    public selector(row: Row<Column>, cell: Cell<Column>): boolean {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate || !isNullOrUndefined(cell.column.template)
            || !isNullOrUndefined(cell.column.commands) || cell.column.type === 'checkbox')) || cell.cellType === CellType.StackedHeader;
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
    private l10n: L10n;
    protected serviceLocator: ServiceLocator;
    constructor(searchBox: HTMLElement, serviceLocator?: ServiceLocator) {
        this.searchBox = searchBox;
        this.serviceLocator = serviceLocator;
        this.l10n = this.serviceLocator.getService<L10n>('localization');
    }

    public searchFocus(args: { target: HTMLInputElement }): void {
        args.target.parentElement.classList.add('e-input-focus');
        if (args.target.classList.contains('e-input') && args.target.classList.contains('e-search') && args.target.value){
            const sIcon: HTMLElement = args.target.parentElement.querySelector('.e-sicon');
            sIcon.classList.add('e-clear-icon');
            sIcon.setAttribute('title', this.l10n.getConstant('Clear'));
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
        if ((<HTMLElement>args.target).classList.contains('e-search') && ((relatedTarget && !((<HTMLElement>relatedTarget).classList.contains('e-sicon e-clear-icon'))
        && !((<HTMLElement>relatedTarget).classList.contains('e-sicon'))) || isNullOrUndefined(relatedTarget))){
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
