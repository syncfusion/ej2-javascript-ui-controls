import { MouseEventArgs, Draggable, Droppable, L10n, DropEventArgs, KeyboardEventArgs, EventHandler } from '@syncfusion/ej2-base';
import { createElement, closest, remove, classList, addClass, removeClass, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend, updateCSSText } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { GroupSettingsModel, SortDescriptorModel } from '../base/grid-model';
import { parentsUntil, isActionPrevent, isGroupAdaptive, updatecloneRow, getComplexFieldID, getParsedFieldID, isComplexField, findCellIndex, resetRowIndex } from '../base/util';
import { resetCachedRowIndex, groupReorderRowObject } from '../base/util';
import { generateExpandPredicates, getPredicates, capitalizeFirstLetter } from '../base/util';
import { ReturnType } from '../base/type';
import { AggregateType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, IAction, NotifyArgs, RowDropEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
import { FocusStrategy } from '../services/focus-strategy';
import { GroupModelGenerator } from '../services/group-model-generator';
import { DataUtil, Query, Group as dmGroup, Predicate } from '@syncfusion/ej2-data';
import { AggregateColumn, AggregateRow } from '../models/aggregate';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Grid } from '../base/grid';
import { GroupLazyLoadRenderer } from '../renderer/group-lazy-load-renderer';
import * as literals from '../base/string-literals';
import { AggregateColumnModel } from '../models/aggregate-model';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';
import { RowRenderer } from '../renderer/row-renderer';

// eslint-disable-next-line valid-jsdoc, jsdoc/require-param, jsdoc/require-returns
/**
 *
 * The `Group` module is used to handle group action.
 */
export class Group implements IAction {
    //Internal variables
    private sortRequired: boolean = true;
    /** @hidden */
    public groupSettings: GroupSettingsModel;
    /** @hidden */
    public element: HTMLElement;
    /** @hidden */
    public groupSortFocus: boolean = false;
    /** @hidden */
    public groupTextFocus: boolean = false;
    /** @hidden */
    public groupCancelFocus: boolean = false;
    /** @hidden */
    public preventFocusOnGroup: boolean = false;
    private colName: string;
    private column: Column;
    private isAppliedGroup: boolean = false;
    private isAppliedUnGroup: boolean = false;
    private isAppliedCaptionRowBorder: boolean = false;
    private reorderingColumns: string[] = [];
    private groupGenerator: GroupModelGenerator;
    private visualElement: HTMLElement = createElement('div', {
        className: 'e-cloneproperties e-dragclone e-gdclone',
        attrs: { action: 'grouping' }
    });
    private helper: Function = (e: { sender: MouseEvent }) => {
        const gObj: IGrid = this.parent;
        const target: Element = (e.sender.target as Element);
        const element: HTMLElement = target.classList.contains('e-groupheadercell') ? target as HTMLElement :
            parentsUntil(target, 'e-groupheadercell') as HTMLElement;
        if (!element || (!target.classList.contains('e-drag') && this.groupSettings.allowReordering)) {
            return false;
        }
        this.column = gObj.getColumnByField(element.firstElementChild.getAttribute('data-mappingname'));
        this.visualElement.textContent = element.textContent;
        updateCSSText(this.visualElement, `width: ${element.offsetWidth + 2}px;
            height: ${element.offsetHeight + 2}px; line-height: 23px;`);
        this.visualElement.setAttribute('data-mappinguid', this.column.uid);
        gObj.element.appendChild(this.visualElement);
        return this.visualElement;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private dragStart: Function = (e: BlazorDragEventArgs): void => {
        this.parent.element.classList.add('e-ungroupdrag');
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }): void => {
        if (this.groupSettings.allowReordering) {
            this.animateDropper(e);
        }
        const target: Element = e.target;
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        this.parent.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: this.column });
        if (!this.groupSettings.allowReordering) {
            classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            if (!(parentsUntil(target as Element,  literals.gridContent) || parentsUntil(target as Element, 'e-headercell'))) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        }
    }
    private dragStop: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        this.parent.element.classList.remove('e-ungroupdrag');
        const preventDrop: boolean = !(parentsUntil(e.target,  literals.gridContent) || parentsUntil(e.target, 'e-gridheader'));
        if (this.groupSettings.allowReordering && preventDrop) {
            remove(e.helper);
            if (parentsUntil(e.target, 'e-groupdroparea')) {
                this.rearrangeGroup();
            } else if (!(parentsUntil(e.target, 'e-grid'))) {
                const field: string = this.parent.getColumnByUid(e.helper.getAttribute('data-mappinguid')).field;
                if (this.groupSettings.columns.indexOf(field) !== -1) {
                    this.ungroupColumn(field);
                }
            }
            return;
        } else if (preventDrop) {
            remove(e.helper);
            return;
        }
    }

    private animateDropper: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        const uid: string = this.parent.element.querySelector('.e-cloneproperties').getAttribute('data-mappinguid');
        const dragField: string = this.parent.getColumnByUid(uid).field;
        const parent: Element = parentsUntil(e.target, 'e-groupdroparea');
        const dropTarget: Element = parentsUntil(e.target, 'e-group-animator');
        const grouped: string[] = [].slice.call(this.element.getElementsByClassName('e-groupheadercell'))
            .map((e: Element) => e.querySelector('div').getAttribute('data-mappingname'));
        const cols: string[] = JSON.parse(JSON.stringify(grouped));
        if (dropTarget || parent) {
            if (dropTarget) {
                const dropField: string = dropTarget.querySelector('div[data-mappingname]').getAttribute('data-mappingname');
                const dropIndex: number = +(dropTarget.getAttribute('data-index'));
                if (dropField !== dragField) {
                    const dragIndex: number = cols.indexOf(dragField);
                    if (dragIndex !== -1) {
                        cols.splice(dragIndex, 1);
                    }
                    const flag: boolean = dropIndex !== -1 && dragIndex === dropIndex;
                    cols.splice(dropIndex + (flag ? 1 : 0), 0, dragField);
                }
            } else if (parent && cols.indexOf(dragField) === -1) {
                cols.push(dragField);
            }
            this.element.innerHTML = '';
            if (cols.length && !this.element.classList.contains('e-grouped')) {
                this.element.classList.add('e-grouped');
            }
            this.reorderingColumns = cols;
            for (let c: number = 0; c < cols.length; c++) {
                this.addColToGroupDrop(cols[parseInt(c.toString(), 10)]);
            }
        } else {
            this.addLabel();
            this.removeColFromGroupDrop(dragField);
        }

    }
    private addLabel(): void {
        if (!this.element.getElementsByClassName('e-group-animator').length) {
            const dragLabel: string = this.l10n.getConstant('GroupDropArea');
            this.element.innerHTML = dragLabel;
            this.element.classList.remove('e-grouped');
        }
    }
    private rearrangeGroup(): void {
        this.sortRequired = false;
        this.updateModel();
    }
    private drop: Function = (e: DropEventArgs) => {
        const gObj: IGrid = this.parent;
        const column: Column = gObj.getColumnByUid(e.droppedElement.getAttribute('data-mappinguid'));
        this.element.classList.remove('e-hover');
        remove(e.droppedElement);
        this.aria.setDropTarget(<HTMLElement>this.parent.element.querySelector('.e-groupdroparea'), false);
        this.aria.setGrabbed(<HTMLElement>this.parent.getHeaderTable().querySelector('[aria-grabbed=true]'), false);
        if (isNullOrUndefined(column) || column.allowGrouping === false ||
            parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
            gObj.element.getAttribute('id')) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), columnName: column ? column.headerText : undefined });
            return;
        }
        this.groupColumn(column.field);
    }
    //Module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private contentRefresh: boolean = true;
    private sortedColumns: string[];
    private l10n: L10n;
    private aria: AriaService = new AriaService();
    private focus: FocusStrategy;

    /**
     * Constructor for Grid group module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {GroupSettingsModel} groupSettings - specifies the GroupSettingsModel
     * @param {string[]} sortedColumns - specifies the sortedColumns
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     * @hidden
     */
    constructor(parent?: IGrid, groupSettings?: GroupSettingsModel, sortedColumns?: string[], serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.groupSettings = groupSettings;
        this.serviceLocator = serviceLocator;
        this.sortedColumns = sortedColumns;
        this.focus = serviceLocator.getService<FocusStrategy>('focus');
        this.addEventListener();
        this.groupGenerator = new GroupModelGenerator(this.parent);
    }

    private columnDrag(e: { target: Element, column: Column }): void {
        if (this.groupSettings.allowReordering && e.column.allowGrouping) {
            this.animateDropper(e);
        }
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        if (!this.parent.allowReordering) {
            classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        }
        if (!(e.column.allowGrouping && (parentsUntil(e.target as Element, 'e-groupdroparea') ||
            (parentsUntil(e.target as Element, 'e-headercell') &&
                parentsUntil(e.target as Element, 'e-headercell').isEqualNode(this.parent.getColumnHeaderByField(e.column.field))))) &&
            !(this.parent.allowReordering && parentsUntil(e.target as Element, 'e-headercell'))) {
            classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
        }
        if (e.target.classList.contains('e-groupdroparea')) {
            this.element.classList.add('e-hover');
        } else {
            this.element.classList.remove('e-hover');
        }
    }

    private columnDragStart(e: { target: Element, column: Column }): void {
        if (e.target.classList.contains('e-stackedheadercell')) {
            return;
        }
        const dropArea: HTMLElement = <HTMLElement>this.parent.element.querySelector('.e-groupdroparea');
        this.aria.setDropTarget(dropArea, e.column.allowGrouping);
        const element: Element = e.target.classList.contains('e-headercell') ? e.target : parentsUntil(e.target as Element, 'e-headercell');
        this.aria.setGrabbed(<HTMLElement>element, true, !e.column.allowGrouping);
    }

    private columnDrop(e: { target: Element, droppedElement: HTMLElement }): void {
        const gObj: IGrid = this.parent;
        if (e.droppedElement.getAttribute('action') === 'grouping') {
            const column: Column = gObj.getColumnByUid(e.droppedElement.getAttribute('data-mappinguid'));
            if (isNullOrUndefined(column) || column.allowGrouping === false ||
                parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                gObj.element.getAttribute('id')) {
                return;
            }
            this.ungroupColumn(column.field);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.groupComplete, this.onActionComplete, this);
        this.parent.on(events.ungroupComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.columnDrag, this.columnDrag, this);
        this.parent.on(events.columnDragStart, this.columnDragStart, this);
        this.parent.on(events.headerDrop, this.columnDrop, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
        this.parent.on(events.sortComplete, this.refreshSortIcons, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.onEmpty, this.initialEnd, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.groupAggregates, this.onGroupAggregates, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on('group-expand-collapse', this.updateExpand, this);
        this.parent.on('persist-data-changed', this.initialEnd, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.groupComplete, this.onActionComplete);
        this.parent.off(events.ungroupComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.columnDrag, this.columnDrag);
        this.parent.off(events.columnDragStart, this.columnDragStart);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.off(events.headerDrop, this.columnDrop);
        this.parent.off(events.headerRefreshed, this.refreshSortIcons);
        this.parent.off(events.sortComplete, this.refreshSortIcons);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.groupAggregates, this.onGroupAggregates);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off('group-expand-collapse', this.updateExpand);
    }

    private initialEnd(): void {
        const gObj: IGrid = this.parent;
        this.parent.off(events.contentReady, this.initialEnd);
        this.parent.off(events.onEmpty, this.initialEnd);
        if (this.parent.getColumns().length && this.groupSettings.columns.length) {
            this.contentRefresh = false;
            for (const col of gObj.groupSettings.columns) {
                this.preventFocusOnGroup = true;
                this.groupColumn(col);
                this.preventFocusOnGroup = false;
            }
            this.contentRefresh = true;
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        if (e.target && parentsUntil(e.target as Element, 'e-groupheadercell') && (e.action === 'tab' || e.action === 'shiftTab')) {
            const focusableGroupedItems: Element[] = this.getFocusableGroupedItems();
            if ((e.action === 'tab' && e.target === focusableGroupedItems[focusableGroupedItems.length - 1])
                || (e.action === 'shiftTab' && e.target === focusableGroupedItems[0])) {
                return;
            }
            for (let i: number = 0; i < focusableGroupedItems.length; i++) {
                if (e.target === focusableGroupedItems[parseInt(i.toString(), 10)]) {
                    e.preventDefault();
                    const index: number = e.action === 'tab' ? i + 1 : i - 1;
                    (focusableGroupedItems[parseInt(index.toString(), 10)] as HTMLElement).focus();
                    return;
                }
            }
        }
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey) {
            if (e.action === 'downArrow') {
                e.action = 'ctrlDownArrow';
            } else if (e.action === 'upArrow') {
                e.action = 'ctrlUpArrow';
            }
        }
        if ((e.action !== 'ctrlSpace' && (!this.groupSettings.columns.length ||
            ['altDownArrow', 'altUpArrow', 'ctrlDownArrow', 'ctrlUpArrow', 'enter'].indexOf(e.action) === -1))
            || (this.parent.groupSettings.enableLazyLoading && this.groupSettings.columns.length
                && (e.action === 'ctrlUpArrow' || e.action === 'ctrlDownArrow'))) {
            return;
        }
        switch (e.action) {
        case 'altDownArrow':
        case 'altUpArrow':
            // eslint-disable-next-line no-case-declarations
            const selected: number[] = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
            if (selected.length) {
                e.preventDefault();
                const rows: HTMLCollection = gObj.getContentTable().querySelector( literals.tbody).children;
                const dataRow: HTMLTableRowElement = gObj.getDataRows()[selected[selected.length - 1]] as HTMLTableRowElement;
                let grpRow: Element;
                for (let i: number = dataRow.rowIndex; i >= 0; i--) {
                    if (!rows[parseInt(i.toString(), 10)].classList.contains(literals.row) && !rows[parseInt(i.toString(), 10)].classList.contains('e-detailrow')) {
                        grpRow = rows[parseInt(i.toString(), 10)];
                        break;
                    }
                }
                this.expandCollapseRows(grpRow.querySelector(e.action === 'altUpArrow' ?
                    '.e-recordplusexpand' : '.e-recordpluscollapse'));
            }
            break;
        case 'ctrlDownArrow':
            e.preventDefault();
            this.expandAll();
            break;
        case 'ctrlUpArrow':
            e.preventDefault();
            this.collapseAll();
            break;
        case 'enter':
            if ((e.target as Element).classList.contains('e-groupsort')) {
                this.groupSortFocus = true;
                e.preventDefault();
                this.applySortFromTarget(e.target as Element);
                break;
            } else if ((e.target as Element).classList.contains('e-ungroupbutton')) {
                this.groupCancelFocus = true;
                e.preventDefault();
                this.unGroupFromTarget(e.target as Element);
                break;
            }
            if (this.parent.isEdit || (closest(e.target as Element, '#' + this.parent.element.id + '_searchbar') !== null) ||
                parentsUntil(e.target  as Element, 'e-pager') || parentsUntil(e.target  as Element, 'e-toolbar')) {
                return;
            }
            // eslint-disable-next-line no-case-declarations
            let element: HTMLElement = this.focus.getFocusedElement();
            if (element && (element.classList.contains('e-icon-grightarrow') || element.classList.contains('e-icon-gdownarrow'))) {
                element = element.parentElement;
            }
            // eslint-disable-next-line no-case-declarations
            const row: Element = element && element.parentElement ? element.parentElement.querySelector('[class^="e-record"]') : null;
            if (!row) { break; }
            if (element.children.length && (element.children[0].classList.contains('e-icon-grightarrow') ||
             element.children[0].classList.contains('e-icon-gdownarrow'))) {
                e.preventDefault();
                this.expandCollapseRows(row);
            }
            break;
        case 'ctrlSpace':
            // eslint-disable-next-line no-case-declarations
            const elem: HTMLElement = gObj.focusModule.currentInfo.element;
            if (elem && elem.classList.contains('e-headercell')) {
                e.preventDefault();
                const column: Column = gObj.getColumnByUid(elem.firstElementChild.getAttribute('data-mappinguid'));
                if (column.field && gObj.groupSettings.columns.indexOf(column.field) < 0) {
                    this.groupColumn(column.field);
                } else {
                    this.ungroupColumn(column.field);
                }
            }
            break;
        }
    }

    /**
     * @returns {Element[]} - Return the focusable grouping items
     * @hidden */
    public getFocusableGroupedItems(): Element[] {
        const focusableGroupedItems: Element[] = [];
        if (this.groupSettings.columns.length) {
            const focusableGroupedHeaderItems: NodeListOf<Element> = this.element.querySelectorAll('.e-groupheadercell');
            for (let i: number = 0; i < focusableGroupedHeaderItems.length; i++) {
                focusableGroupedItems.push(focusableGroupedHeaderItems[parseInt(i.toString(), 10)].querySelector('.e-grouptext'));
                focusableGroupedItems.push(focusableGroupedHeaderItems[parseInt(i.toString(), 10)].querySelector('.e-groupsort'));
                focusableGroupedItems.push(focusableGroupedHeaderItems[parseInt(i.toString(), 10)].querySelector('.e-ungroupbutton'));
            }
        }
        return focusableGroupedItems;
    }

    private wireEvent(): void {
        EventHandler.add(this.element, 'focusin', this.onFocusIn, this);
        EventHandler.add(this.element, 'focusout', this.onFocusOut, this);
        EventHandler.add(this.parent.element, 'auxclick', this.auxilaryclickHandler, this);
    }

    private unWireEvent(): void {
        EventHandler.remove(this.element, 'focusin', this.onFocusIn);
        EventHandler.remove(this.element, 'focusout', this.onFocusOut);
        EventHandler.remove(this.parent.element, 'auxclick', this.auxilaryclickHandler);
    }

    private onFocusIn(e: FocusEvent): void {
        if (this.parent.focusModule.currentInfo && this.parent.focusModule.currentInfo.element) {
            removeClass([this.parent.focusModule.currentInfo.element, this.parent.focusModule.currentInfo.elementToFocus],
                        ['e-focused', 'e-focus']);
            this.parent.focusModule.currentInfo.element.tabIndex = -1;
        }
        this.addOrRemoveFocus(e);
    }

    private onFocusOut(e: FocusEvent): void {
        this.addOrRemoveFocus(e);
    }

    private addOrRemoveFocus(e: FocusEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-groupdroparea') || (e.target as HTMLElement).classList.contains('e-grouptext')
            || (e.target as HTMLElement).classList.contains('e-groupsort')
            || (e.target as HTMLElement).classList.contains('e-ungroupbutton')) {
            const target: Element = (e.target as HTMLElement).classList.contains('e-grouptext') ?
                (e.target as Element).parentElement.parentElement : e.target as Element;
            if (e.type === 'focusin') {
                this.parent.focusModule.currentInfo.element = e.target as HTMLElement;
                this.parent.focusModule.currentInfo.elementToFocus = e.target as HTMLElement;
                addClass([target as Element], ['e-focused', 'e-focus']);
                (e.target as HTMLElement).tabIndex = 0;
            } else {
                removeClass([target as Element], ['e-focused', 'e-focus']);
                (e.target as HTMLElement).tabIndex = -1;
            }
        }
    }

    private clickHandler(e: MouseEventArgs): void {
        if ((e.target as Element).classList.contains('e-grouptext')) {
            this.groupTextFocus = true;
        }
        if ((e.target as Element).classList.contains('e-groupsort')) {
            this.groupSortFocus = true;
        }
        if ((e.target as Element).classList.contains('e-ungroupbutton')) {
            this.groupCancelFocus = true;
        }
        if ((e.target as Element).classList.contains('e-icon-grightarrow') || (e.target as Element).classList.contains('e-icon-gdownarrow')) {
            e.preventDefault();
        }
        const trgtEle: HTMLTableCellElement = parentsUntil((e.target as Element), 'e-recordplusexpand') as HTMLTableCellElement ||
            parentsUntil((e.target as Element), 'e-recordpluscollapse') as HTMLTableCellElement;
        if (trgtEle && (trgtEle.children[0].classList.contains('e-icon-gdownarrow') || trgtEle.children[0].classList.contains('e-icon-grightarrow'))) {
            this.expandCollapseRows(e.target as Element);
        }
        this.applySortFromTarget(e.target as Element);
        this.unGroupFromTarget(e.target as Element);
        this.toogleGroupFromHeader(e.target as Element);
    }

    private auxilaryclickHandler(e: MouseEvent): void {
        if ((e.target as Element).classList.contains('e-icon-grightarrow') || (e.target as Element).classList.contains('e-icon-gdownarrow')
            && (e.button === 1)) {
            e.preventDefault();
        }
    }

    private unGroupFromTarget(target: Element): void {
        if (target.classList.contains('e-ungroupbutton')) {
            this.ungroupColumn(target.parentElement.getAttribute('data-mappingname'));
        }
    }

    private toogleGroupFromHeader(target: Element): void {
        if (this.groupSettings.showToggleButton) {
            if (target.classList.contains('e-grptogglebtn')) {
                if (target.classList.contains('e-toggleungroup')) {
                    this.ungroupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('data-mappinguid')).field);
                } else {
                    this.groupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('data-mappinguid')).field);
                }
            } else {
                if (target.classList.contains('e-toggleungroup')) {
                    this.ungroupColumn(target.parentElement.getAttribute('data-mappingname'));
                }
            }
        }
    }

    private applySortFromTarget(target: Element): void {
        const gObj: IGrid = this.parent;
        const gHeader: Element = closest(target as Element, '.e-groupheadercell');
        if (gObj.allowSorting && gHeader && !target.classList.contains('e-ungroupbutton') &&
            !target.classList.contains('e-toggleungroup')) {
            const field: string = gHeader.firstElementChild.getAttribute('data-mappingname');
            if (gObj.getColumnHeaderByField(field).getElementsByClassName('e-ascending').length) {
                gObj.sortColumn(field, 'Descending', true);
            } else {
                gObj.sortColumn(field, 'Ascending', true);
            }
        }
    }

    /**
     * Expands or collapses grouped rows by target element.
     *
     * @param  {Element} target - Defines the target element of the grouped row.
     * @returns {void}
     */
    public expandCollapseRows(target: Element): void {
        const trgt: HTMLTableCellElement = parentsUntil(target, 'e-recordplusexpand') as HTMLTableCellElement ||
            parentsUntil(target, 'e-recordpluscollapse') as HTMLTableCellElement;
        if (trgt) {
            const rowNodes: HTMLElement[] = [].slice.call(this.parent.getContentTable().querySelector( literals.tbody).children);
            if (this.parent.editSettings.showAddNewRow) {
                if (rowNodes[0].classList.contains('e-addedrow')) {
                    rowNodes.shift();
                } else if (rowNodes[rowNodes.length - 1].classList.contains('e-addedrow')) {
                    rowNodes.pop();
                }
            }
            let isHide: boolean;
            let dataManager: Promise<Object>;
            let query: Query;
            const gObj: IGrid = this.parent;
            const indent: number = trgt.parentElement.getElementsByClassName('e-indentcell').length;
            const uid: string = trgt.parentElement.getAttribute('data-uid');
            const captionRow: Row<Column> = gObj.getRowObjectFromUID(uid);
            let expand: boolean = false;
            if (trgt.classList.contains('e-recordpluscollapse')) {
                addClass([trgt], 'e-recordplusexpand'); removeClass([trgt], 'e-recordpluscollapse');
                trgt.firstElementChild.className = 'e-icons e-gdiagonaldown e-icon-gdownarrow';
                trgt.firstElementChild.setAttribute('title', this.l10n.getConstant('Expanded'));
                expand = true; captionRow.isExpand = true;
                if (isGroupAdaptive(gObj)) {
                    this.updateVirtualRows(gObj, target, expand, query, dataManager);
                }
                if (this.parent.groupSettings.enableLazyLoading) {
                    if ((this.parent.filterSettings.columns.length || this.parent.sortSettings.columns.length ||
                        this.parent.searchSettings.key.length) && this.parent.getContent().firstElementChild.scrollTop === 0) {
                        (this.parent.contentModule as VirtualContentRenderer).isTop = true;
                    }
                    (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                        this.parent.contentModule as GroupLazyLoadRenderer).captionExpand(trgt.parentElement as HTMLTableRowElement);
                }
            } else {
                isHide = true; captionRow.isExpand = false;
                removeClass([trgt], 'e-recordplusexpand'); addClass([trgt], 'e-recordpluscollapse');
                trgt.firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                trgt.firstElementChild.setAttribute('title', this.l10n.getConstant('Collapsed'));
                if (isGroupAdaptive(gObj)) {
                    this.updateVirtualRows(gObj, target, !isHide, query, dataManager);
                }
                if (this.parent.groupSettings.enableLazyLoading) {
                    (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                        this.parent.contentModule as GroupLazyLoadRenderer).captionCollapse(trgt.parentElement as HTMLTableRowElement);
                }
            }
            this.aria.setExpand(trgt, expand);
            if (!isGroupAdaptive(gObj) && !this.parent.groupSettings.enableLazyLoading) {
                const rowObjs: Row<Column>[] = gObj.getRowsObject();
                const startIdx: number = rowObjs.indexOf(captionRow);
                const rowsState: { [x: string]: boolean } = {};
                let cacheStartIdx: number = gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings &&
                    gObj.infiniteScrollSettings.enableCache && rowObjs.length !== rowNodes.length ?
                    Array.from(rowNodes).indexOf(trgt.parentElement) : undefined;
                for (let i: number = startIdx; i < rowObjs.length; i++) {
                    if (i > startIdx && rowObjs[parseInt(i.toString(), 10)].indent === indent) {
                        break;
                    }
                    if (rowObjs[parseInt(i.toString(), 10)].isDetailRow) {
                        const visible: boolean = rowObjs[i - 1].isExpand && rowObjs[i - 1].visible;
                        if (cacheStartIdx && cacheStartIdx > 0 && cacheStartIdx < rowNodes.length) {
                            (rowNodes[parseInt(cacheStartIdx.toString(), 10)] as HTMLElement).style.display = visible ? '' : 'none';
                        }
                        else if (isNullOrUndefined(cacheStartIdx)) {
                            (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).style.display = visible ? '' : 'none';
                        }
                    } else if (rowsState[rowObjs[parseInt(i.toString(), 10)].parentUid] === false) {
                        rowObjs[parseInt(i.toString(), 10)].visible = false;
                        if (cacheStartIdx && cacheStartIdx > 0 && cacheStartIdx < rowNodes.length) {
                            (rowNodes[parseInt(cacheStartIdx.toString(), 10)] as HTMLElement).style.display = 'none';
                        }
                        else if (isNullOrUndefined(cacheStartIdx)) {
                            (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).style.display = 'none';
                        }
                    } else {
                        if (!(rowObjs[parseInt(i.toString(), 10)].isDataRow || rowObjs[parseInt(i.toString(), 10)].isCaptionRow
                            || rowObjs[parseInt(i.toString(), 10)].isDetailRow || rowObjs[parseInt(i.toString(), 10)].isAggregateRow)) {
                            const visible: boolean = rowObjs[parseInt(i.toString(), 10)].cells
                                .some((cell: Cell<AggregateColumnModel>) => cell.isDataCell && cell.visible);
                            if (visible === rowObjs[parseInt(i.toString(), 10)].visible) { continue; }
                        }
                        rowObjs[parseInt(i.toString(), 10)].visible = true;
                        if (cacheStartIdx && cacheStartIdx > 0 && cacheStartIdx < rowNodes.length) {
                            (rowNodes[parseInt(cacheStartIdx.toString(), 10)] as HTMLElement).style.display = '';
                            (rowNodes[parseInt(cacheStartIdx.toString(), 10)] as HTMLElement).classList.remove('e-hide');
                        }
                        else if (isNullOrUndefined(cacheStartIdx)) {
                            (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).style.display = '';
                            (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).classList.remove('e-hide');
                        }
                    }
                    if (rowObjs[parseInt(i.toString(), 10)].isCaptionRow) {
                        rowsState[rowObjs[parseInt(i.toString(), 10)].uid] = rowObjs[parseInt(i.toString(), 10)].isExpand
                        && rowObjs[parseInt(i.toString(), 10)].visible;
                    }
                    if (!isNullOrUndefined(cacheStartIdx)) {
                        cacheStartIdx++;
                    }
                }
                this.lastCaptionRowBorder();
                this.parent.notify(events.refreshExpandandCollapse, { rows: this.parent.getRowsObject() });
            }
            if (!this.parent.enableInfiniteScrolling || !this.parent.groupSettings.enableLazyLoading) {
                this.parent.notify(events.captionActionComplete, { isCollapse: isHide, parentUid: uid });
            }
        }
    }

    /**
     * The function is used to set border in last row
     *
     * @returns { void }
     * @hidden
     */

    public lastCaptionRowBorder(): void {
        const table: Element = this.parent.getContentTable();
        const clientHeight: number = this.parent.getContent().clientHeight;
        if ((!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) ||
            this.parent.groupSettings.enableLazyLoading) {
            if (table.scrollHeight < clientHeight || this.isAppliedCaptionRowBorder) {
                if (this.isAppliedCaptionRowBorder || table.querySelector('.e-lastrowcell')) {
                    const borderCells: NodeListOf<Element> = table.querySelectorAll('.e-lastrowcell');
                    for (let i: number = 0, len: number = borderCells.length; i < len; i++) {
                        removeClass([borderCells[parseInt(i.toString(), 10)]], 'e-lastrowcell');
                    }
                    this.isAppliedCaptionRowBorder = false;
                }
                const rowNodes: HTMLCollection = this.parent.getContentTable().querySelector( literals.tbody).children;
                const lastRow: Element = rowNodes[rowNodes.length - 1];
                if ((lastRow as HTMLTableRowElement).style.display !== 'none' && !lastRow.classList.contains('e-groupcaptionrow')) {
                    if (table.scrollHeight < clientHeight) {
                        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                        this.isAppliedCaptionRowBorder = true;
                    }
                } else {
                    for (let i: number = rowNodes.length - 1, len: number = 0; i > len; i--) {
                        if ((rowNodes[parseInt(i.toString(), 10)] as HTMLTableRowElement).style.display !== 'none'
                            && rowNodes[parseInt(i.toString(), 10)].classList.contains('e-groupcaptionrow')) {
                            if (rowNodes[parseInt(i.toString(), 10)].querySelector('.e-recordpluscollapse')) {
                                addClass(rowNodes[parseInt(i.toString(), 10)].childNodes, 'e-lastrowcell');
                                this.isAppliedCaptionRowBorder = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private updateVirtualRows(gObj: IGrid, target: Element, isExpand: boolean, query: Query, dataManager: Promise<Object>): void {
        const rObj: Row<Column> = gObj.getRowObjectFromUID(target.closest('tr').getAttribute('data-uid'));
        rObj.isExpand = isExpand;
        updatecloneRow(gObj);
        this.parent.notify(events.refreshVirtualMaxPage, {});
        query = gObj.getDataModule().generateQuery(false);
        const args: NotifyArgs = { requestType: 'virtualscroll', rowObject: rObj };
        if (gObj.contentModule) {
            args.virtualInfo = (<{ prevInfo?: object }>gObj.contentModule).prevInfo;
        }
        dataManager = gObj.getDataModule().getData(args, query.requiresCount());
        dataManager.then((e: ReturnType) => gObj.renderModule.dataManagerSuccess(e, args));
    }

    private expandCollapse(isExpand: boolean): void {
        if (!this.parent.groupSettings.columns.length) {
            return;
        }
        if (!isExpand) {
            this.parent.notify(events.initialCollapse, isExpand);
        }
        const rowNodes: HTMLCollection = this.parent.getContentTable().querySelector( literals.tbody).children;
        const rowObjs: Row<Column>[] = this.parent.getRowsObject();
        let row: Element;
        for (let i: number = 0, len: number = rowNodes.length; i < len; i++) {
            if (rowNodes[parseInt(i.toString(), 10)].querySelectorAll('.e-recordplusexpand, .e-recordpluscollapse').length) {
                row = rowNodes[parseInt(i.toString(), 10)].querySelector(isExpand ? '.e-recordpluscollapse' : '.e-recordplusexpand');
                if (row) {
                    if (isExpand) {
                        row.className = 'e-recordplusexpand';
                        row.firstElementChild.className = 'e-icons e-gdiagonaldown e-icon-gdownarrow';
                        row.setAttribute('aria-expanded', 'true');
                        row.firstElementChild.setAttribute('title', this.l10n.getConstant('Expanded'));
                    }
                    else {
                        row.className = 'e-recordpluscollapse';
                        row.firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                        row.setAttribute('aria-expanded', 'false');
                        row.firstElementChild.setAttribute('title', this.l10n.getConstant('Collapsed'));
                    }
                }
                if (!(rowNodes[parseInt(i.toString(), 10)].firstElementChild.classList.contains('e-recordplusexpand') ||
                    rowNodes[parseInt(i.toString(), 10)].firstElementChild.classList.contains('e-recordpluscollapse'))) {
                    (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).style.display = isExpand ? '' : 'none';
                }
            } else {
                (rowNodes[parseInt(i.toString(), 10)] as HTMLElement).style.display = isExpand ? '' : 'none';
            }
            if (rowObjs[parseInt(i.toString(), 10)].isCaptionRow) {
                rowObjs[parseInt(i.toString(), 10)].isExpand = isExpand ? true : false;
            }
        }
        this.parent.updateVisibleExpandCollapseRows();
        this.lastCaptionRowBorder();
        this.parent.notify(events.refreshExpandandCollapse, { rows: this.parent.getRowsObject() });
    }

    /**
     * Expands all the grouped rows of the Grid.
     *
     * @returns {void}
     */
    public expandAll(): void {
        this.expandCollapse(true);
    }

    /**
     * Collapses all the grouped rows of the Grid.
     *
     * @returns {void}
     */
    public collapseAll(): void {
        this.expandCollapse(false);
    }

    /**
     * The function is used to render grouping
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.renderGroupDropArea();
        this.initDragAndDrop();
        this.refreshToggleBtn();
        this.wireEvent();
    }

    private renderGroupDropArea(): void {
        const groupElem: Element = this.parent.element.querySelector('.e-groupdroparea');
        if (groupElem) {
            remove(groupElem);
        }
        this.element = this.parent.createElement('div', { className: 'e-groupdroparea', attrs: { 'tabindex': '-1' } });
        if (this.groupSettings.allowReordering) {
            this.element.classList.add('e-group-animate');
        }
        this.updateGroupDropArea();
        this.parent.element.insertBefore(this.element, this.parent.element.firstChild);
        if (!this.groupSettings.showDropArea || this.parent.rowRenderingMode === 'Vertical') {
            this.element.style.display = 'none';
        }
    }

    private updateGroupDropArea(clear?: boolean): void {
        if (this.groupSettings.showDropArea && !this.groupSettings.columns.length) {
            const dragLabel: string = this.l10n.getConstant('GroupDropArea');
            this.element.innerHTML = dragLabel;
            this.element.classList.remove('e-grouped');
        } else {
            if ((this.element.innerHTML === this.l10n.getConstant('GroupDropArea') && (this.groupSettings.columns.length === 1
                || !this.isAppliedGroup && !this.isAppliedUnGroup)) || clear) {
                this.element.innerHTML = '';
            }
            this.element.classList.add('e-grouped');
        }
    }

    private initDragAndDrop(): void {
        this.initializeGHeaderDrop();
        this.initializeGHeaderDrag();
    }

    private initializeGHeaderDrag(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const drag: Draggable = new Draggable(this.element as HTMLElement, {
            dragTarget: this.groupSettings.allowReordering ? '.e-drag' : '.e-groupheadercell',
            distance: this.groupSettings.allowReordering ? -10 : 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
    }

    private initializeGHeaderDrop(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const drop: Droppable = new Droppable(this.element, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }

    /**
     * Groups a column by column name.
     *
     * @param  {string} columnName - Defines the column name to group.
     * @returns {void}
     */
    public groupColumn(columnName: string): void {
        const gObj: IGrid = this.parent;
        const column: Column = gObj.getColumnByField(columnName);
        if (isNullOrUndefined(column) || column.allowGrouping === false ||
            (this.contentRefresh && this.groupSettings.columns.indexOf(columnName) > -1)) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), columnName: column.headerText });
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.groupColumn, arg1: columnName });
            return;
        }
        column.visible = gObj.groupSettings.showGroupedColumn;
        this.colName = columnName;
        this.isAppliedGroup = true;
        if (this.contentRefresh) {
            this.updateModel();
        } else {
            this.addColToGroupDrop(columnName);
        }
        this.updateGroupDropArea();
        this.isAppliedGroup = false;
    }

    /**
     * Ungroups a column by column name.
     *
     * @param  {string} columnName - Defines the column name to ungroup.
     * @returns {void}
     */
    public ungroupColumn(columnName: string): void {
        const gObj: IGrid = this.parent;
        const column: Column = this.parent.enableColumnVirtualization ?
            (<Column[]>this.parent.columns).filter((c: Column) => c.field === columnName)[0] : gObj.getColumnByField(columnName);
        if (isNullOrUndefined(column) || column.allowGrouping === false || this.groupSettings.columns.indexOf(columnName) < 0) {
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.ungroupColumn, arg1: columnName });
            return;
        }
        column.visible = true;
        this.colName = column.field;
        const columns: string[] = JSON.parse(JSON.stringify(this.groupSettings.columns));
        columns.splice(columns.indexOf(this.colName), 1);
        if (this.sortedColumns.indexOf(columnName) < 0) {
            for (let i: number = 0, len: number = gObj.sortSettings.columns.length; i < len; i++) {
                if (columnName === gObj.sortSettings.columns[parseInt(i.toString(), 10)].field) {
                    gObj.sortSettings.columns.splice(i, 1);
                    break;
                }
            }
        }
        if (this.groupSettings.allowReordering) {
            this.reorderingColumns = columns;
        }
        this.groupSettings.columns = columns;
        if (gObj.allowGrouping) {
            this.isAppliedUnGroup = true;
            this.parent.dataBind();
        }
    }

    /**
     * The function used to update groupSettings
     *
     * @returns {void}
     * @hidden
     */
    public updateModel(): void {
        let columns: string[] =  JSON.parse(JSON.stringify(this.groupSettings.columns));
        columns = this.reorderingColumns.length ? JSON.parse(JSON.stringify(this.reorderingColumns)) : columns;
        if (this.sortRequired) {
            if (columns.indexOf(this.colName) === -1) {
                columns.push(this.colName);
            }
            this.groupAddSortingQuery(this.colName);
        }
        this.sortRequired = true;
        this.parent.groupSettings.columns = columns;
        this.parent.dataBind();
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        if (e.requestType === 'grouping') {
            this.addColToGroupDrop(this.colName);
        } else {
            this.removeColFromGroupDrop(this.colName);
        }
        if (this.groupSettings.showDropArea && this.parent.height === '100%') {
            this.parent.scrollModule.refresh();
        }
        const args: Object = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
            columnName: this.colName, requestType: 'grouping', type: events.actionComplete
        } : { requestType: 'ungrouping', type: events.actionComplete };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.colName = null;
    }

    private groupAddSortingQuery(colName: string): void {
        let i: number = 0;
        while (i < this.parent.sortSettings.columns.length) {
            if (this.parent.sortSettings.columns[parseInt(i.toString(), 10)].field === colName) {
                break;
            }
            i++;
        }
        if (this.parent.sortSettings.columns.length === i) {
            this.parent.sortSettings.columns.push({ field: colName, direction: 'Ascending', isFromGroup: true });
        } else if (!this.parent.allowSorting) {
            this.parent.sortSettings.columns[parseInt(i.toString(), 10)].direction = 'Ascending';
        }
    }
    private createElement(field: string): Element {
        const gObj: IGrid = this.parent;
        let direction: string = 'Ascending';
        const animator: Element = this.parent.createElement('div', { className: 'e-grid-icon e-group-animator' });
        let groupedColumn: Element = this.parent.createElement('div', { className: 'e-grid-icon e-groupheadercell' });
        const childDiv: Element = this.parent.createElement('div', { attrs: { 'data-mappingname': field } });
        if (isComplexField(field)) {
            childDiv.setAttribute('ej-complexname', getComplexFieldID(field));
        }

        const column: Column = this.parent.getColumnByField(field);
        //Todo headerTemplateID for grouped column, disableHtmlEncode
        const headerCell: Element = gObj.getColumnHeaderByUid(column.uid);
        // if (!isNullOrUndefined(column.headerTemplate)) {
        //     if (column.headerTemplate.indexOf('#') !== -1) {
        //         childDiv.innerHTML = document.querySelector(column.headerTemplate).innerHTML.trim();
        //     } else {
        //         childDiv.innerHTML = column.headerTemplate;
        //     }
        //     childDiv.firstElementChild.classList.add('e-grouptext');
        // } else {
        if (this.groupSettings.allowReordering) {
            childDiv.appendChild(this.parent.createElement(
                'span', {
                    className: 'e-drag e-icons e-icon-drag', innerHTML: '&nbsp;',
                    attrs: { title: 'Drag', tabindex: '-1', 'aria-label': this.l10n.getConstant('GroupedDrag'), 'role': 'button' }
                }));
        }
        childDiv.appendChild(this.parent.createElement('span', {
            className: 'e-grouptext', innerHTML: column.headerText,
            attrs: { tabindex: '-1' }
        }));
        // }

        if (this.groupSettings.showToggleButton) {
            childDiv.appendChild(this.parent.createElement(
                'span', {
                    className: 'e-togglegroupbutton e-icons e-icon-ungroup e-toggleungroup', innerHTML: '&nbsp;',
                    attrs: { tabindex: '-1', 'aria-label': this.l10n.getConstant('UnGroupAria') }
                }));
        }

        if (headerCell.querySelectorAll('.e-ascending,.e-descending').length) {
            direction = headerCell.querySelector('.e-ascending') ? 'Ascending' : 'Descending';
        }
        childDiv.appendChild(this.parent.createElement(
            'span', {
                className: 'e-groupsort e-icons ' +
                ('e-' + direction.toLowerCase() + ' e-icon-' + direction.toLowerCase()), innerHTML: '&nbsp;',
                attrs: { tabindex: '-1', 'aria-label': this.l10n.getConstant('GroupedSortIcon') + column.headerText, role: 'button' }
            }));
        const ungroupButton: HTMLElement = this.parent.createElement(
            'span', {
                className: 'e-ungroupbutton e-icons e-icon-hide', innerHTML: '&nbsp;',
                attrs: { title: this.l10n.getConstant('UnGroup'),
                    tabindex: '-1', 'aria-label': this.l10n.getConstant('UnGroupIcon') + column.headerText, role: 'button' }
            });
        updateCSSText(ungroupButton, this.groupSettings.showUngroupButton ? '' : 'display: none;');
        childDiv.appendChild(ungroupButton);
        groupedColumn.appendChild(childDiv);
        if (this.groupSettings.allowReordering) {
            animator.appendChild(groupedColumn);
            animator.appendChild(this.createSeparator());
            groupedColumn = animator;
        }
        return groupedColumn;
    }

    private addColToGroupDrop(field: string): void {
        const groupElem: Element = isComplexField(field) ? this.parent.element.querySelector('.e-groupdroparea div[ej-complexname=' +
            getParsedFieldID(getComplexFieldID(field)) + ']') : this.parent.element.querySelector('.e-groupdroparea div[data-mappingname=' + getParsedFieldID(field) + ']');
        if (this.groupSettings.allowReordering && groupElem) {
            return;
        }
        const column: Column = this.parent.getColumnByField(field);
        if (isNullOrUndefined(column)) {
            return;
        }
        const groupedColumn: Element = this.createElement(field);
        if (this.groupSettings.allowReordering) {
            const index: number = this.element.getElementsByClassName('e-group-animator').length;
            groupedColumn.setAttribute('data-index', index.toString());
        }
        this.element.appendChild(groupedColumn);
        const focusModule: FocusStrategy = this.parent.focusModule;
        focusModule.setActive(true);
        let firstContentCellIndex: number[] = [0, 0];
        if (focusModule.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
            firstContentCellIndex = findCellIndex(focusModule.active.matrix.matrix, firstContentCellIndex, true);
        }
        focusModule.active.matrix.current = firstContentCellIndex;
        if (this.parent.editSettings.showAddNewRow) {
            this.parent.notify(events.showAddNewRowFocus, {});
        } else if (this.parent.isInitialLoad && !this.preventFocusOnGroup) {
            focusModule.focus();
        }
        //Todo:  rtl
    }

    private createSeparator(): Element {
        const separator: HTMLElement = this.parent.createElement('span', {
            className: 'e-nextgroup e-icons e-icon-next', innerHTML: '&nbsp;',
            attrs: { tabindex: '-1', 'aria-label': this.l10n.getConstant('GroupSeperator'), 'role': 'button' }
        });
        updateCSSText(separator, this.groupSettings.showUngroupButton ? '' : 'display: none;');
        return separator;
    }

    private refreshToggleBtn(isRemove?: boolean): void {
        if (this.groupSettings.showToggleButton) {
            const headers: Element[] = [].slice.call(this.parent.getHeaderTable().getElementsByClassName('e-headercelldiv'));
            for (let i: number = 0, len: number = headers.length; i < len; i++) {
                if (!((headers[parseInt(i.toString(), 10)].classList.contains('e-emptycell')) || (headers[parseInt(i.toString(), 10)].classList.contains('e-headerchkcelldiv')))) {
                    const column: Column = this.parent.getColumnByUid(headers[parseInt(i.toString(), 10)].getAttribute('data-mappinguid'));
                    if (!this.parent.showColumnMenu || (this.parent.showColumnMenu && !column.showColumnMenu)) {
                        if (headers[parseInt(i.toString(), 10)].getElementsByClassName('e-grptogglebtn').length) {
                            remove(headers[parseInt(i.toString(), 10)].querySelectorAll('.e-grptogglebtn')[0] as Element);
                        }
                        if (!isRemove) {
                            headers[parseInt(i.toString(), 10)].appendChild(this.parent.createElement(
                                'span', {
                                    className: 'e-grptogglebtn e-icons ' + (this.groupSettings.columns.indexOf(column.field) > -1 ?
                                        'e-toggleungroup e-icon-ungroup' : 'e-togglegroup e-icon-group'), attrs: { tabindex: '-1',
                                        'aria-label': isNullOrUndefined(this.l10n) ? this.parent.localeObj.getConstant('GroupButton')
                                            : this.l10n.getConstant('GroupButton') }
                                }));
                        }
                    }
                }
            }
        }
    }

    private removeColFromGroupDrop(field: string): void {
        if (!isNullOrUndefined(this.getGHeaderCell(field))) {
            const elem: Element = this.getGHeaderCell(field);
            if (this.groupSettings.allowReordering) {
                const parent: Element = parentsUntil(elem, 'e-group-animator');
                remove(parent);
            } else {
                remove(elem);
            }
            this.updateGroupDropArea();
            if (this.parent.editSettings.showAddNewRow) {
                this.parent.notify(events.showAddNewRowFocus, {});
            }
        }
        this.isAppliedUnGroup = false;
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (const prop of Object.keys(e.properties)) {
            switch (prop) {
            case 'columns':
                // eslint-disable-next-line no-case-declarations
                let args: Object;
                if (this.contentRefresh) {
                    if (!this.isAppliedUnGroup) {
                        if (!this.isAppliedGroup) {
                            this.updateGroupDropArea(true);
                            for (let j: number = 0; j < this.parent.sortSettings.columns.length; j++) {
                                if (this.parent.sortSettings.columns[parseInt(j.toString(), 10)].isFromGroup) {
                                    this.parent.sortSettings.columns.splice(j, 1);
                                    j--;
                                }
                            }
                            for (let i: number = 0; i < this.groupSettings.columns.length; i++) {
                                this.colName = this.groupSettings.columns[parseInt(i.toString(), 10)];
                                const col: Column = this.parent.getColumnByField(this.colName);
                                col.visible = this.parent.groupSettings.showGroupedColumn;
                                this.groupAddSortingQuery(this.colName);
                                if (i < this.groupSettings.columns.length - 1) {
                                    this.addColToGroupDrop(this.groupSettings.columns[parseInt(i.toString(), 10)]);
                                }
                            }
                        }
                        args = {
                            columnName: this.colName, requestType: e.properties[`${prop}`].length ? 'grouping' : 'ungrouping',
                            type: events.actionBegin, preventFocusOnGroup: false
                        };
                    } else {
                        args = { columnName: this.colName, requestType: 'ungrouping', type: events.actionBegin };
                    }
                    if (!this.groupSettings.showGroupedColumn) {
                        const columns: string[] = e.oldProperties[`${prop}`];
                        for (let i: number = 0; i < columns.length; i++) {
                            if (e.properties[`${prop}`].indexOf(columns[parseInt(i.toString(), 10)]) === -1) {
                                this.parent.getColumnByField(columns[parseInt(i.toString(), 10)]).visible = true;
                            }
                        }
                    }
                    this.parent.notify(events.modelChanged, args);
                }
                break;
            case 'showDropArea':
                this.updateGroupDropArea();
                if (this.groupSettings.showDropArea) {
                    this.element.style.display = '';
                    this.parent.headerModule.refreshUI();
                } else {
                    this.element.style.display = 'none';
                }
                if (this.parent.height === '100%') {
                    this.parent.scrollModule.refresh();
                }
                break;
            case 'showGroupedColumn':
                this.updateGroupedColumn(this.groupSettings.showGroupedColumn);
                this.parent.notify(events.modelChanged, { requestType: 'refresh' });
                break;
            case 'showUngroupButton':
                this.updateButtonVisibility(this.groupSettings.showUngroupButton, 'e-ungroupbutton');
                break;
            case 'showToggleButton':
                this.updateButtonVisibility(this.groupSettings.showToggleButton, 'e-togglegroupbutton ');
                this.parent.refreshHeader();
                break;
            case 'enableLazyLoading':
                (this.parent as Grid).freezeRefresh();
                break;
            }
        }
    }

    private updateGroupedColumn(isVisible: boolean): void {
        for (let i: number = 0; i < this.groupSettings.columns.length; i++) {
            this.parent.getColumnByField(this.groupSettings.columns[parseInt(i.toString(), 10)]).visible = isVisible;
        }
    }

    private updateButtonVisibility(isVisible: boolean, className: string): void {
        const gHeader: HTMLElement[] = [].slice.call(this.element.getElementsByClassName(className));
        for (let i: number = 0; i < gHeader.length; i++) {
            gHeader[parseInt(i.toString(), 10)].style.display = isVisible ? '' : 'none';
        }
    }


    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
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
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.parent.isDestroyed || !this.parent.allowGrouping) && !(<any>this.parent).refreshing) {
            this.clearGrouping();
        }
        this.unWireEvent();
        this.removeEventListener();
        this.refreshToggleBtn(true);
        if (this.element.parentNode) {
            remove(this.element);
        }
        //call ejdrag and drop destroy
    }

    /**
     * Clears all the grouped columns of the Grid.
     *
     * @returns {void}
     */
    public clearGrouping(): void {
        const cols: string[] = JSON.parse(JSON.stringify(this.groupSettings.columns));
        this.contentRefresh = false;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (i === (len - 1)) {
                this.contentRefresh = true;
            }
            this.ungroupColumn(cols[parseInt(i.toString(), 10)]);
        }
        this.contentRefresh = true;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'group';
    }

    private refreshSortIcons(): void {
        const gObj: IGrid = this.parent;
        let header: Element;
        const cols: SortDescriptorModel[] = gObj.sortSettings.columns;
        const fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        this.refreshToggleBtn();
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (fieldNames.indexOf(cols[parseInt(i.toString(), 10)].field) === -1) { continue; }
            header = gObj.getColumnHeaderByField(cols[parseInt(i.toString(), 10)].field);
            if (!gObj.allowSorting && (this.sortedColumns.indexOf(cols[parseInt(i.toString(), 10)].field) > -1 ||
                this.groupSettings.columns.indexOf(cols[parseInt(i.toString(), 10)].field) > -1)) {
                classList(header.querySelector('.e-sortfilterdiv'), ['e-ascending', 'e-icon-ascending'], []);
                if (cols.length > 1) {
                    header.querySelector('.e-headercelldiv').appendChild(this.parent.createElement(
                        'span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }));
                }
            } else if (this.getGHeaderCell(cols[parseInt(i.toString(), 10)].field) && this.getGHeaderCell(cols[parseInt(i.toString(), 10)].field).getElementsByClassName('e-groupsort').length) {
                if (cols[parseInt(i.toString(), 10)].direction === 'Ascending') {
                    classList(
                        this.getGHeaderCell(cols[parseInt(i.toString(), 10)].field).querySelector('.e-groupsort'),
                        ['e-ascending', 'e-icon-ascending'], ['e-descending', 'e-icon-descending']);
                } else {
                    classList(
                        this.getGHeaderCell(cols[parseInt(i.toString(), 10)].field).querySelector('.e-groupsort'),
                        ['e-descending', 'e-icon-descending'], ['e-ascending', 'e-icon-ascending']);
                }
            }
        }
    }

    private getGHeaderCell(field: string): Element {
        if (this.element && this.element.querySelector('[data-mappingname="' + field + '"]')) {
            return this.element.querySelector('[data-mappingname="' + field + '"]').parentElement;
        }
        return null;
    }

    private onGroupAggregates(editedData: Object[]): void {
        if (this.parent.groupSettings.enableLazyLoading) {
            if (this.parent.editSettings.mode !== 'Batch') {
                this.updateLazyLoadGroupAggregates(editedData);
            }
            return;
        }
        const aggregates: Object[] = this.iterateGroupAggregates(editedData);
        const rowData: Object[] = this.groupGenerator.generateRows(aggregates, {});
        const summaryRows: Row<Column>[] = this.parent.getRowsObject().filter((row: Row<Column>) => !row.isDataRow);
        const updateSummaryRows: Object[] = rowData.filter((data: Row<Column>) => !data.isDataRow);
        if (this.parent.isReact || this.parent.isVue) {
            this.parent.destroyTemplate(['groupFooterTemplate', 'groupCaptionTemplate', 'footerTemplate']);
        }
        for (let i: number = 0; i < updateSummaryRows.length; i++) {
            const row: Row<Column> = updateSummaryRows[parseInt(i.toString(), 10)] as Row<Column>;
            const cells: Object[] = row.cells.filter((cell: Cell<{}>) => cell.isDataCell);
            const args: Object = { cells: cells, data: row.data, dataUid: summaryRows[parseInt(i.toString(), 10)] ? summaryRows[parseInt(i.toString(), 10)].uid : '' };
            this.parent.notify(events.refreshAggregateCell, args);
        }
    }

    private updateLazyLoadGroupAggregates(data: Object[], remoteResult?: Object[]): void {
        const groupCaptionTemplates: Object[] = this.getGroupAggregateTemplates(true);
        const groupFooterTemplates: Object[] = this.getGroupAggregateTemplates(false);
        if (!groupCaptionTemplates.length && !groupFooterTemplates.length) { return; }
        const gObj: IGrid = this.parent;
        const isRemote: boolean = gObj.getDataModule().isRemote();
        const updatedData: Object = data[0];
        const editedRow: Element = (<{row?: Element}>data).row;
        const groupedCols: string[] = gObj.groupSettings.columns;
        const groupLazyLoadRenderer: GroupLazyLoadRenderer = gObj.contentModule as GroupLazyLoadRenderer;
        const groupCache: { [x: number]: Row<Column>[]; } = groupLazyLoadRenderer.getGroupCache();
        const currentPageGroupCache: Row<Column>[] = groupCache[gObj.pageSettings.currentPage];
        let result: Object[] = remoteResult ? remoteResult : [];
        for (let i: number = 0; i < groupedCols.length; i++) {
            const groupField: string = groupedCols[parseInt(i.toString(), 10)];
            const groupKey: string = updatedData[`${groupField}`];
            const groupCaptionRowObject: Row<Column> = this.getGroupCaptionRowObject(editedRow, groupedCols.length - i);
            if (isRemote && result.length) {
                if (i !== 0) {
                    const prevGroupField: string = groupedCols[i - 1];
                    const prevGroupKey: string = updatedData[`${prevGroupField}`];
                    result = (<{items: Object[]}>result.find((data: Object) => {
                        return (<{key?: string}>data).key === prevGroupKey;
                    })).items;
                }
                this.updateLazyLoadGroupAggregatesRow(result, groupKey, groupCaptionRowObject, currentPageGroupCache,
                                                      groupCaptionTemplates, groupFooterTemplates);
            } else {
                const query: Query = gObj.renderModule.data.generateQuery();
                if (i !== 0) {
                    const currentLevelCaptionRowObjects: Row<Column>[] = currentPageGroupCache.filter((data: Row<Column>) => {
                        return data.isCaptionRow && data.parentUid === groupCaptionRowObject.parentUid;
                    });
                    const index: number = currentLevelCaptionRowObjects.indexOf(groupCaptionRowObject);
                    const fields: string[] = gObj.groupSettings.columns.slice(0, i).reverse();
                    const keys: string[] = fields.map((data: string) => {
                        return updatedData[`${data}`];
                    });
                    const pred: Predicate = generateExpandPredicates(fields, keys, groupLazyLoadRenderer);
                    const predicateList: Predicate[] = getPredicates(pred);
                    const lazyLoad: Object = { level: i, skip: index, take: 1, where: predicateList };
                    query.lazyLoad.push({ key: 'onDemandGroupInfo', value: lazyLoad });
                }
                gObj.renderModule.data.getData({}, query).then((e: ReturnType) => {
                    if (isRemote) {
                        this.updateLazyLoadGroupAggregates(data, e.result);
                    } else {
                        this.updateLazyLoadGroupAggregatesRow(e.result, groupKey, groupCaptionRowObject, currentPageGroupCache,
                                                              groupCaptionTemplates, groupFooterTemplates);
                    }
                    if (i === groupedCols.length - 1 || isRemote) { this.destroyRefreshGroupCaptionFooterTemplate(); }
                }).catch((e: ReturnType) => gObj.renderModule.dataManagerFailure(e, { requestType: 'grouping' }));
                if (isRemote) { break; }
            }
        }
    }

    private destroyRefreshGroupCaptionFooterTemplate(): void {
        const gObj: IGrid = this.parent;
        if (gObj.isAngular || gObj.isReact || gObj.isVue) {
            gObj.destroyTemplate(['groupCaptionTemplate', 'groupFooterTemplate']);
        }
        gObj.refreshGroupCaptionFooterTemplate();
        gObj.removeMaskRow();
        gObj.hideSpinner();
    }

    private updateLazyLoadGroupAggregatesRow(result: Object[], groupKey: string, groupCaptionRowObject: Row<Column>,
                                             currentPageGroupCache: Row<Column>[], groupCaptionTemplates: Object[],
                                             groupFooterTemplates: Object[]): void {
        const updatedGroupCaptionData: Object = result.find((data: Object) => {
            return (<{key?: string}>data).key === groupKey;
        });
        if (groupCaptionTemplates.length) {
            this.updateLazyLoadGroupAggregatesCell(updatedGroupCaptionData, groupCaptionRowObject, groupCaptionTemplates);
        }
        if (groupFooterTemplates.length) {
            const groupFooterRowObject: Row<Column> = currentPageGroupCache.find((data: Row<Column>) => {
                return data.isAggregateRow && data.parentUid === groupCaptionRowObject.uid;
            });
            this.updateLazyLoadGroupAggregatesCell(updatedGroupCaptionData, groupFooterRowObject, groupFooterTemplates);
        }
    }

    private updateLazyLoadGroupAggregatesCell(updatedGroupCaptionData: Object, captionFooterRowObject: Row<Column>,
                                              captionFooterTemplates: Object[]): void {
        const prevCaptionFooterData: Object = captionFooterRowObject.data;
        const updatedGroupCaptionDataAggregates: Object = (<{aggregates?: Object}>updatedGroupCaptionData).aggregates;
        if (captionFooterRowObject.isCaptionRow) {
            (<{aggregates?: Object}>prevCaptionFooterData).aggregates = updatedGroupCaptionDataAggregates;
        }
        for (let i: number = 0; i < captionFooterTemplates.length; i++) {
            const template: { type: string, field: string } =
                captionFooterTemplates[parseInt(i.toString(), 10)] as { type: string, field: string };
            const key: string = template.field + ' - ' + template.type;
            const fieldData: Object = prevCaptionFooterData[template.field];
            fieldData[`${key}`] = updatedGroupCaptionDataAggregates[`${key}`];
            fieldData[capitalizeFirstLetter(template.type)] = updatedGroupCaptionDataAggregates[`${key}`];
            if (fieldData[template.type]) {
                fieldData[template.type] = updatedGroupCaptionDataAggregates[`${key}`];
            }
        }
    }

    private getGroupCaptionRowObject(element: Element, groupCaptionIndex: number): Row<Column> {
        const gObj: IGrid = this.parent;
        const uid: string = element.getAttribute('data-uid');
        let parentCaptionRowObject: Row<Column> = gObj.getRowObjectFromUID(uid);
        for (let i: number = 0; i < groupCaptionIndex; i++) {
            parentCaptionRowObject = gObj.getRowObjectFromUID(parentCaptionRowObject.parentUid);
        }
        return parentCaptionRowObject;
    }

    /**
     * @param { boolean } groupCaptionTemplate - Defines template either group caption or footer
     * @returns { Object[] } - Returns template array
     * @hidden
     */
    public getGroupAggregateTemplates(groupCaptionTemplate: boolean): Object[] {
        const aggregates: Object[] = [];
        const aggregateRows: AggregateRow | Object[] = this.parent.aggregates;
        for (let j: number = 0; j < aggregateRows.length; j++) {
            const row: AggregateRow = aggregateRows[parseInt(j.toString(), 10)] as AggregateRow;
            for (let k: number = 0; k < row.columns.length; k++) {
                if ((groupCaptionTemplate && row.columns[parseInt(k.toString(), 10)].groupCaptionTemplate)
                    || (!groupCaptionTemplate && row.columns[parseInt(k.toString(), 10)].groupFooterTemplate)) {
                    let aggr: Object = {};
                    const type: string | AggregateType[] = row.columns[parseInt(k.toString(), 10)].type.toString();
                    aggr = { type: type.toLowerCase(), field: row.columns[parseInt(k.toString(), 10)].field };
                    aggregates.push(aggr);
                }
            }
        }
        return aggregates;
    }

    /**
     * @param { Row<Column> } fromRowObj - Defines group key changed Data row object.
     * @param { Row<Column> } toRowObj - Defines group key setting reference Data row object.
     * @returns { void }
     * @hidden
     */
    public groupedRowReorder(fromRowObj: Row<Column>, toRowObj: Row<Column>): void {
        const dragRow: Element = this.parent.getRowElementByUID(fromRowObj.uid);
        const dropRow: Element = this.parent.getRowElementByUID(toRowObj.uid);
        const dropArgs: RowDropEventArgs = {
            rows: [dragRow], target: dropRow, fromIndex: fromRowObj.index, dropIndex: toRowObj.index
        };
        if (!isNullOrUndefined(fromRowObj) && !isNullOrUndefined(toRowObj) &&
            fromRowObj.parentUid !== toRowObj.parentUid) {
            if (dropRow) {
                if (dropRow['style'].display === 'none') {
                    dragRow['style'].display = 'none';
                }
                if (dropArgs.fromIndex > dropArgs.dropIndex) {
                    this.parent.getContentTable().querySelector(literals.tbody).insertBefore(dragRow, dropRow);
                }
                else {
                    this.parent.getContentTable().querySelector(literals.tbody).insertBefore(dragRow, dropRow.nextSibling);
                }
            }
            else {
                remove(dragRow);
            }
            this.groupReorderHandler(fromRowObj, toRowObj);
            const tr: HTMLTableRowElement[] = [].slice.call(this.parent.getContentTable().getElementsByClassName(literals.row));
            groupReorderRowObject(this.parent, dropArgs, tr, toRowObj);
            if (this.parent.enableVirtualization) {
                resetCachedRowIndex(this.parent);
            }
            else {
                resetRowIndex(this.parent, this.parent.getRowsObject().filter((data: Row<Column>) => data.isDataRow), tr);
            }
            this.parent.notify(events.refreshExpandandCollapse, { rows: this.parent.getRowsObject() });
        }
    }

    private groupReorderHandler(dragRowObject: Row<Column>, dropRowObject: Row<Column>): void {
        const gObj: IGrid = this.parent;
        const dragRowObjectData: Object = dragRowObject.data;
        const dropRowObjectData: Object = dropRowObject.data;
        const groupAggregateTemplate: Object[] = gObj['groupModule'].getGroupAggregateTemplates(false);
        const dropParentRowObject: Row<Column> = gObj.getRowObjectFromUID(dropRowObject.parentUid);
        const dragParentRowObject: Row<Column> = gObj.getRowObjectFromUID(dragRowObject.parentUid);
        const dropRootParentRowObjects: Row<Column>[] = [dropParentRowObject];
        const dragRootParentRowObjects: Row<Column>[] = [dragParentRowObject];
        const groupColumns: string[] = gObj.groupSettings.columns;
        for (let j: number = 0; j < groupColumns.length; j++) {
            dragRowObjectData[groupColumns[parseInt(j.toString(), 10)]] = dropRowObjectData[groupColumns[parseInt(j.toString(), 10)]];
            if (j > 0) {
                dropRootParentRowObjects.push(gObj.getRowObjectFromUID(dropRootParentRowObjects[j - 1].parentUid));
                dragRootParentRowObjects.push(gObj.getRowObjectFromUID(dragRootParentRowObjects[j - 1].parentUid));
            }
        }
        dragRowObject.parentUid = dropRowObject.parentUid;
        dragRowObject.visible = dropRowObject.visible;
        dragRowObject['parentGid'] = dropRowObject['parentGid'];
        if (dragRowObject.changes !== dragRowObjectData) {
            dragRowObject.changes = dragRowObjectData;
        }
        let updatedCurrentViewData: Object[] = this.iterateGroupAggregates([{dragRowObjects: dragRootParentRowObjects,
            dropRowObjects: dropRootParentRowObjects}]);
        const updatedDragCurrentViewData: Object = updatedCurrentViewData.filter((object: Object) =>
            (object['key'] === dragRootParentRowObjects[dragRootParentRowObjects.length - 1].data['key'] ||
            (object['key'] instanceof Date && object['key'].toString() ===
            dragRootParentRowObjects[dragRootParentRowObjects.length - 1].data['key'].toString())));
        const updatedDropCurrentViewData: Object = updatedCurrentViewData.filter((object: Object) =>
            (object['key'] === dropRootParentRowObjects[dropRootParentRowObjects.length - 1].data['key'] ||
            (object['key'] instanceof Date && object['key'].toString() ===
            dropRootParentRowObjects[dropRootParentRowObjects.length - 1].data['key'].toString())));
        updatedCurrentViewData = [];
        if (!isNullOrUndefined(updatedDragCurrentViewData[0])) {
            updatedCurrentViewData.push(updatedDragCurrentViewData[0]);
        }
        if (!isNullOrUndefined(updatedDropCurrentViewData[0])) {
            updatedCurrentViewData.push(updatedDropCurrentViewData[0]);
        }
        const currentViewData: Object[] = gObj.currentViewData;
        for (let i: number = 0; i < currentViewData.length; i++) {
            if (isNullOrUndefined(updatedDragCurrentViewData[0]) &&
                currentViewData[parseInt(i.toString(), 10)]['key'] ===
                dragRootParentRowObjects[dragRootParentRowObjects.length - 1].data['key']) {
                currentViewData.splice(i, 1);
                i--;
            }
            else if (isNullOrUndefined(updatedDropCurrentViewData[0]) &&
                currentViewData[parseInt(i.toString(), 10)]['key'] ===
                dropRootParentRowObjects[dropRootParentRowObjects.length - 1].data['key']) {
                currentViewData.splice(i, 1);
                i--;
            }
            else if (!isNullOrUndefined(updatedDragCurrentViewData[0]) &&
                currentViewData[parseInt(i.toString(), 10)]['key'] === updatedDragCurrentViewData[0]['key']) {
                currentViewData[parseInt(i.toString(), 10)] = updatedDragCurrentViewData[0];
            }
            else if (!isNullOrUndefined(updatedDropCurrentViewData[0]) &&
                currentViewData[parseInt(i.toString(), 10)]['key'] === updatedDropCurrentViewData[0]['key']) {
                currentViewData[parseInt(i.toString(), 10)] = updatedDropCurrentViewData[0];
            }
        }
        const updatedRowObject: Row<Column>[] = this.groupGenerator.generateRows(updatedCurrentViewData, {});
        const dragRootParentAggregateRowObject: Row<Column>[] = [];
        const dropRootParentAggregateRowObject: Row<Column>[] = [];
        for (let i: number = 0; i < dragRootParentRowObjects.length; i++) {
            dragRootParentAggregateRowObject
                .push(...this.getGroupParentFooterAggregateRowObject(dragRootParentRowObjects[parseInt(i.toString(), 10)].uid));
        }
        for (let i: number = 0; i < dropRootParentRowObjects.length; i++) {
            dropRootParentAggregateRowObject
                .push(...this.getGroupParentFooterAggregateRowObject(dropRootParentRowObjects[parseInt(i.toString(), 10)].uid));
        }
        dragRootParentRowObjects.push(...dragRootParentAggregateRowObject);
        dropRootParentRowObjects.push(...dropRootParentAggregateRowObject);
        this.updatedRowObjChange(dragRootParentRowObjects, updatedRowObject, groupAggregateTemplate, true);
        this.updatedRowObjChange(dropRootParentRowObjects, updatedRowObject, groupAggregateTemplate);
        this.groupReorderRefreshHandler(dragRootParentRowObjects);
        this.groupReorderRefreshHandler(dropRootParentRowObjects);
    }

    private updatedRowObjChange(rootParentRowObjects: Row<Column>[], updatedRowObjects: Row<Column>[],
                                groupAggregateTemplate: Object[], isDraggedRow?: boolean): void {
        const gObj: IGrid = this.parent;
        const rowObjects: Row<Column>[] = gObj.getRowsObject();
        let cache: Object = {};
        let virtualCacheRowObjects: Row<Column>[] = [];
        if (gObj.enableVirtualization) {
            cache = gObj.contentModule['vgenerator'].cache;
            virtualCacheRowObjects = gObj.vcRows;
        }
        for (let i: number = 0; i < rootParentRowObjects.length; i++) {
            let keyPresent: boolean = false;
            const parentRowObject: Row<Column> = rootParentRowObjects[parseInt(i.toString(), 10)];
            for (let j: number = 0; j < updatedRowObjects.length; j++) {
                const updatedRowObject: Row<Column> = updatedRowObjects[parseInt(j.toString(), 10)];
                if (!isNullOrUndefined(updatedRowObject) && !isNullOrUndefined(parentRowObject.data['key']) &&
                    !isNullOrUndefined(updatedRowObject.data['key']) && ((parentRowObject.data['key'] ===
                        updatedRowObject.data['key'] || (parentRowObject.data['key'] instanceof Date &&
                            parentRowObject.data['key'].toString() === updatedRowObject.data['key'].toString())))) {
                    let isParentKeyPresent: boolean = true;
                    const nextParentObject: Row<Column> = rootParentRowObjects[parseInt((i + 1).toString(), 10)];
                    if (isDraggedRow && nextParentObject && !nextParentObject.isAggregateRow) {
                        const key: string = nextParentObject.data['key'].toString();
                        const field: string = nextParentObject.data['field'];
                        const groupedData: Object[] = updatedRowObject.data['items'].records ?
                            updatedRowObject.data['items'].records : updatedRowObject.data['items'];
                        if (groupedData && groupedData.length && groupedData[0][`${field}`] &&
                            groupedData[0][`${field}`].toString() !== key) {
                            isParentKeyPresent = false;
                        }
                    }
                    if (!isParentKeyPresent && isDraggedRow) {
                        continue;
                    }
                    const index: number = rowObjects.indexOf(parentRowObject);
                    if (index !== -1) {
                        rowObjects[parseInt(index.toString(), 10)].data = updatedRowObject.data;
                        rowObjects[parseInt(index.toString(), 10)]['gSummary'] = updatedRowObject['gSummary'];
                    }
                    if (gObj.enableVirtualization) {
                        const vIndex: number = virtualCacheRowObjects.indexOf(parentRowObject);
                        if (vIndex !== -1) {
                            virtualCacheRowObjects[parseInt(vIndex.toString(), 10)].data = updatedRowObject.data;
                            virtualCacheRowObjects[parseInt(vIndex.toString(), 10)]['gSummary'] = updatedRowObject['gSummary'];
                        }
                    }
                    parentRowObject.data = updatedRowObject.data;
                    parentRowObject['gSummary'] = ['gSummary'];
                    updatedRowObjects.splice(j, 1);
                    j--;
                    keyPresent = true;
                    break;
                }
                else if (parentRowObject.isAggregateRow &&
                    updatedRowObject.isAggregateRow) {
                    for (let l: number = 0; l < groupAggregateTemplate.length; l++) {
                        if (this.evaluateGroupAggregateValueChange(parentRowObject, updatedRowObject,
                                                                   groupAggregateTemplate[parseInt(l.toString(), 10)])) {
                            const index: number = rowObjects.indexOf(parentRowObject);
                            if (index !== -1) {
                                rowObjects[parseInt(index.toString(), 10)].data = updatedRowObject.data;
                                rowObjects[parseInt(index.toString(), 10)]['gSummary'] = updatedRowObject['gSummary'];
                            }
                            if (gObj.enableVirtualization) {
                                const vIndex: number = virtualCacheRowObjects.indexOf(parentRowObject);
                                if (vIndex !== -1) {
                                    virtualCacheRowObjects[parseInt(vIndex.toString(), 10)].data = updatedRowObject.data;
                                    virtualCacheRowObjects[parseInt(vIndex.toString(), 10)]['gSummary'] = updatedRowObject['gSummary'];
                                }
                            }
                            parentRowObject.data = updatedRowObject.data;
                            parentRowObject['gSummary'] = updatedRowObject['gSummary'];
                            keyPresent = true;
                            break;
                        }
                    }
                    if (keyPresent) {
                        break;
                    }
                }
            }
            if (!keyPresent) {
                const removeElem: Element = gObj.getRowElementByUID(parentRowObject.uid);
                if (!isNullOrUndefined(removeElem)) {
                    remove(removeElem);
                }
                rowObjects.splice(rowObjects.indexOf(parentRowObject), 1);
                if (gObj.enableVirtualization) {
                    virtualCacheRowObjects.splice(virtualCacheRowObjects.indexOf(parentRowObject), 1);
                    for (let k: number = 1; k <= Object.keys(cache).length; k++) {
                        const vcIndex: number = cache[parseInt(k.toString(), 10)].indexOf(parentRowObject);
                        if (vcIndex !== -1) {
                            cache[parseInt(k.toString(), 10)].splice([parseInt(vcIndex.toString(), 10)], 1);
                        }
                    }
                }
                if (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache) {
                    gObj.infiniteScrollModule.resetInfiniteCache(rowObjects);
                }
            }
        }
    }

    private groupReorderRefreshHandler(parentRowObjects: Row<Column>[]): void {
        const gObj: IGrid = this.parent;
        const row: RowRenderer<Column> = new RowRenderer<Column>(gObj['serviceLocator'], null, gObj);
        const columns: Column[] = gObj.getColumns();
        for (let j: number = 0; j < parentRowObjects.length; j++) {
            const rowObject: Row<Column> = parentRowObjects[parseInt(j.toString(), 10)];
            if (!isNullOrUndefined(rowObject.uid) &&
                !isNullOrUndefined(gObj.getRowElementByUID(rowObject.uid))) {
                row.refresh(rowObject, columns, false);
            }
        }
    }

    private getGroupParentFooterAggregateRowObject(parentUid: string): Row<Column>[] {
        const rowObjects: Row<Column>[] = this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache &&
            this.parent.groupSettings.columns.length ? this.parent.contentModule['rows'] : this.parent.getRowsObject();
        const parentFooterAggregates: Row<Column>[] = [];
        for (let i: number = 0; i < rowObjects.length; i++) {
            const rowObject: Row<Column> = rowObjects[parseInt(i.toString(), 10)];
            if (rowObject.parentUid === parentUid && rowObject.isAggregateRow) {
                parentFooterAggregates.push(rowObject);
            }
        }
        return parentFooterAggregates;
    }

    private evaluateGroupAggregateValueChange(rowObjects: Row<Column>, updatedRowObject: Row<Column>,
                                              groupAggregateTemplate: Object): boolean {
        let change: boolean = false;
        if (rowObjects.data[groupAggregateTemplate['field']]['field'] === updatedRowObject.data[groupAggregateTemplate['field']]['field']
            && rowObjects.data[groupAggregateTemplate['field']]['key'] === updatedRowObject.data[groupAggregateTemplate['field']]['key'] &&
            (rowObjects.data[groupAggregateTemplate['field']] as Object)
                // eslint-disable-next-line no-prototype-builtins
                .hasOwnProperty(groupAggregateTemplate['field'] + ' - ' + groupAggregateTemplate['type']) &&
            (updatedRowObject.data[groupAggregateTemplate['field']] as Object)
                // eslint-disable-next-line no-prototype-builtins
                .hasOwnProperty(groupAggregateTemplate['field'] + ' - ' + groupAggregateTemplate['type'])) {
            change = true;
        }
        return change;
    }


    private gettingVirtualData(parentRowObjs: Row<Column>[], curViewRec: Object[], pK: string): Object[] {
        const datas: Object[] = [];
        for (let i: number = 0; i < parentRowObjs.length; i++) {
            if (curViewRec.indexOf(parentRowObjs[parseInt(i.toString(), 10)].data) === -1) {
                datas.push(parentRowObjs[parseInt(i.toString(), 10)].data);
            }
            if (parentRowObjs[parseInt(i.toString(), 10)].data['field'] === this.parent.groupSettings.columns[0]) {
                let draggedData: Object[] = parentRowObjs[parseInt(i.toString(), 10)].data['items'];
                if (!isNullOrUndefined(draggedData['records'])) {
                    draggedData = draggedData['records'];
                }
                for (let j: number = 0; j < draggedData.length; j++) {
                    if (pK && curViewRec.findIndex((data: Object) => data[pK.toString()] ===
                        draggedData[parseInt(j.toString(), 10)][pK.toString()]) === -1) {
                        datas.push(draggedData[parseInt(j.toString(), 10)]);
                    }
                }
            }
        }
        return datas;
    }

    private iterateGroupAggregates(editedData: Object[]): Object[] {
        const updatedData: Object[] = editedData instanceof Array ? editedData : [];
        const rows: Object[] = this.parent.getRowsObject();
        let initData: Object[] = this.parent.getCurrentViewRecords().slice();
        const field: string = this.parent.getPrimaryKeyFieldNames()[0];
        const dragParentRowObjects: Row<Column>[] = editedData && editedData.length ?
            editedData[0] && (editedData[0]['dragRowObjects'] as Row<Column>[]) : null;
        const dropParentRowObjects: Row<Column>[] = editedData && editedData.length ?
            editedData[0] && (editedData[0]['dropRowObjects'] as Row<Column>[]) : null;
        let dropRootKey: string | Date = null;
        let dragRootKey: string | Date = null;
        if (this.parent.enableVirtualization && this.parent.allowGrouping && this.parent.groupSettings.columns.length &&
            (!isNullOrUndefined(dragParentRowObjects) || !isNullOrUndefined(dropParentRowObjects))) {
            if (dragParentRowObjects) {
                initData.push(...this.gettingVirtualData(dragParentRowObjects, initData, field));
            }
            if (dropParentRowObjects) {
                initData.push(...this.gettingVirtualData(dropParentRowObjects, initData, field));
            }
        }
        const isInfiniteGroup: boolean = this.parent.enableInfiniteScrolling && this.parent.allowGrouping && editedData.length &&
        this.parent.groupSettings.columns.length && !isNullOrUndefined(dragParentRowObjects) &&
            !isNullOrUndefined(dropParentRowObjects);
        if (isInfiniteGroup) {
            initData = [];
            dropRootKey = dropParentRowObjects[dropParentRowObjects.length - 1].data['key'];
            dragRootKey = dragParentRowObjects[dragParentRowObjects.length - 1].data['key'];
            this.parent.getRowsObject().map((row: Row<Column>) => {
                const groupKey: string | Date = row.data[this.parent.groupSettings.columns[0]];
                if (row.isDataRow &&
                    ((groupKey === dropRootKey || groupKey === dragRootKey) || (groupKey instanceof Date &&
                        (groupKey.toString() === dropRootKey.toString() || groupKey.toString() === dragRootKey.toString())))) {
                    initData.push(row.data);
                }
            });
        }
        const deletedCols: Object[] = [];
        let changeds: Object[] = rows.map((row: Row<AggregateColumn> | Row<Column>) => {
            if (row.edit === 'delete') { deletedCols.push(row.data); }
            return row.changes instanceof Object ? row.changes : row.data;
        });
        changeds = updatedData.length === 0 ? changeds : updatedData;
        const mergeData: Object[] = initData.map((item: Object) => {
            const pKeyVal: Object = DataUtil.getObject(field, item);
            let value: Object;
            const hasVal: boolean = changeds.some((cItem: Object) => {
                value = cItem;
                return pKeyVal === DataUtil.getObject(field, cItem);
            });
            return hasVal ? value : item;
        });
        const eData: Object = editedData;
        if (!((<{ type: string }>eData).type && (<{ type: string }>eData).type === 'cancel') && deletedCols.length > 0) {
            for (let i: number = 0; i < deletedCols.length; i++) {
                const index: number = mergeData.indexOf(deletedCols[parseInt(i.toString(), 10)]);
                mergeData.splice(index, 1);
            }
        }
        const aggregates: Object[] = [];
        const aggregateRows: AggregateRow | Object[] = this.parent.aggregates;
        for (let j: number = 0; j < aggregateRows.length; j++) {
            const row: AggregateRow = aggregateRows[parseInt(j.toString(), 10)] as AggregateRow;
            for (let k: number = 0; k < row.columns.length; k++) {
                let aggr: Object = {};
                const type: string | AggregateType[] = row.columns[parseInt(k.toString(), 10)].type.toString();
                const types: string[] = type.split(',').map((t: string) => t.trim());
                for (const aggregateType of types) {
                    aggr = { type: aggregateType.toLowerCase(), field: row.columns[parseInt(k.toString(), 10)].field };
                    aggregates.push(aggr);
                }
            }
        }
        let result: Object[];
        let aggrds: Object[];
        const groupedCols: string[] = this.parent.groupSettings.columns;
        for (let l: number = 0; l < groupedCols.length; l++) {
            aggrds = result ? result : mergeData;
            result = DataUtil.group(aggrds, groupedCols[parseInt(l.toString(), 10)], aggregates, null, null);
        }
        if (isInfiniteGroup) {
            const lastGroupKey: string | Date = this.parent.currentViewData[this.parent.currentViewData.length - 1]['key'];
            if ((lastGroupKey instanceof Date && (lastGroupKey.toString() === dropRootKey.toString() ||
                lastGroupKey.toString() === dragRootKey.toString())) ||
                (lastGroupKey === dropRootKey || lastGroupKey === dragRootKey)) {
                const groups: dmGroup[] = [];
                for (let i: number = 0; i < result.length; i++) {
                    groups.push(result[parseInt(i.toString(), 10)]);
                }
                const predicate: Predicate[] = [];
                const addWhere: (query: Query) => void =
                    (input: Query) => {
                        for (let i: number = 0; i < groups.length; i++) {
                            predicate.push(new Predicate('field', '==', groups[parseInt(i.toString(), 10)].field).
                                and(this.parent.renderModule.getPredicate('key', 'equal', groups[parseInt(i.toString(), 10)].key)));
                        }
                        input.where(Predicate.or(predicate));
                    };
                const newQuery: Query = this.parent.getDataModule().generateQuery(true);
                addWhere(newQuery);
                const updatedGroupData: Object[] = this.parent.getDataModule().dataManager.executeLocal(newQuery);
                this.parent.renderModule.updateGroupInfo(result, updatedGroupData);
            }
        }
        return result;
    }

    public updateExpand(args: { uid?: string, isExpand?: boolean }): void {
        const uid: string = args.uid; const isExpand: boolean = args.isExpand;
        const rows: Row<Column>[] = this.parent.getRowsObject();
        for (let i: number = 0; i < rows.length; i++) {
            const row: Row<Column> = rows[parseInt(i.toString(), 10)];
            if (row.uid === uid || isNullOrUndefined(uid)) {
                row.isExpand = isExpand;
                for (let j: number = i + 1; j < rows.length; j++) {
                    const childRow: Row<Column> = rows[parseInt(j.toString(), 10)];
                    let closestParent: Row<Column>;

                    if (childRow.parentUid !== row.uid) {
                        closestParent = rows.filter((x: Row<Column>) => x.uid === childRow.parentUid)[0];
                    }
                    if (childRow.parentUid === row.uid) {
                        childRow.visible = row.isExpand;
                    } else if (!isNullOrUndefined(closestParent) && childRow.parentUid === closestParent.uid) {
                        if (closestParent.isExpand && closestParent.visible === true) {
                            childRow.visible = true;
                        } else if (closestParent.isExpand && closestParent.visible === false) {
                            childRow.visible = false;
                        }
                    }

                    if (isNullOrUndefined(uid)) {
                        break;
                    }
                }
            }
        }
        this.parent.notify(events.contentReady, { rows: rows, args: { isFrozen: false, rows: rows } });
    }
}
