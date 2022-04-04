/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    closest, classList, createElement, remove, addClass, removeClass, isNullOrUndefined, Base, formatUnit, createInstance, detach
} from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardClickEventArgs, ActionEventArgs } from '../base/interface';
import { ColumnsModel } from '../models';
import { Columns } from '../models/columns';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Action module is used to perform card actions.
 */
export class Action {
    private parent: Kanban;
    public columnToggleArray: string[];
    public selectionArray: string[];
    public lastCardSelection: Element;
    private lastSelectionRow: HTMLTableRowElement;
    private lastCard: Element;
    private selectedCardsElement: Element[];
    private selectedCardsData: Record<string, any>[];
    public hideColumnKeys: string[];

    /**
     * Constructor for action module
     *
     * @param {Kanban} parent Accepts the kanban instance
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
    }

    public clickHandler(e: KeyboardEvent): void {
        const elementSelector: string = '.' + cls.CARD_CLASS + ',.' + cls.HEADER_ICON_CLASS + ',.' + cls.CONTENT_ROW_CLASS + '.' +
            cls.SWIMLANE_ROW_CLASS + ',.' + cls.SHOW_ADD_BUTTON + ',.' + cls.FROZEN_SWIMLANE_ROW_CLASS + ',.' + cls.CONTENT_ROW_CLASS +
            ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS;
        const target: Element = closest(e.target as Element, elementSelector);
        if (!target) { return; }
        if (target.classList.contains(cls.CARD_CLASS)) {
            if (this.parent.allowKeyboard) {
                this.parent.keyboardModule.cardTabIndexRemove();
            }
            this.cardClick(e);
        } else if (target.classList.contains(cls.HEADER_ICON_CLASS)) {
            this.columnExpandCollapse(e);
        } else if (target.classList.contains(cls.CONTENT_ROW_CLASS) && target.classList.contains(cls.SWIMLANE_ROW_CLASS)) {
            this.rowExpandCollapse(e);
        } else if (target.classList.contains(cls.SHOW_ADD_BUTTON)) {
            this.addButtonClick(target);
        } else if (target.classList.contains(cls.FROZEN_SWIMLANE_ROW_CLASS)) {
            const swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.SWIMLANE_ROW_CLASS));
            let targetIcon: HTMLElement = this.parent.layoutModule.frozenSwimlaneRow.querySelector('.' + cls.ICON_CLASS);
            this.rowExpandCollapse(e, swimlaneRows[this.parent.layoutModule.frozenOrder]);
            const isCollapsed: boolean = targetIcon.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS) ? true : false;
            if (isCollapsed) {
                classList(targetIcon, [cls.SWIMLANE_ROW_EXPAND_CLASS], [cls.SWIMLANE_ROW_COLLAPSE_CLASS]);
            } else {
                classList(targetIcon, [cls.SWIMLANE_ROW_COLLAPSE_CLASS], [cls.SWIMLANE_ROW_EXPAND_CLASS]);
            }
        }
    }

    public addButtonClick(target: Element): void {
        const newData: { [key: string]: string | number } = {};
        if (this.parent.kanbanData.length === 0) {
            newData[this.parent.cardSettings.headerField] = 1;
        } else if (typeof (this.parent.kanbanData[0])[this.parent.cardSettings.headerField] === 'number') {
            const id: number[] = this.parent.kanbanData.map((obj: { [key: string]: string }) =>
                parseInt(obj[this.parent.cardSettings.headerField], 10));
            newData[this.parent.cardSettings.headerField] = Math.max(...id) + 1;
        }
        newData[this.parent.keyField] = closest(target, '.' + cls.CONTENT_CELLS_CLASS).getAttribute('data-key');
        if (this.parent.sortSettings.sortBy === 'Index') {
            newData[this.parent.sortSettings.field] = 1;
            if (closest(target, '.' + cls.CONTENT_CELLS_CLASS).querySelector('.' + cls.CARD_CLASS)) {
                const card: Element = this.parent.sortSettings.direction === 'Ascending' ?
                    target.nextElementSibling.lastElementChild : target.nextElementSibling.firstElementChild;
                const data: Record<string, any> = this.parent.getCardDetails(card) as Record<string, any>;
                newData[this.parent.sortSettings.field] = data[this.parent.sortSettings.field] as number + 1;
            }
        }
        if (this.parent.kanbanData.length !== 0 && this.parent.swimlaneSettings.keyField &&
            closest(target, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling) {
            newData[this.parent.swimlaneSettings.keyField] =
                closest(target, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling.getAttribute('data-key');
        }
        this.parent.openDialog('Add', newData);
    }

    public doubleClickHandler(e: MouseEvent): void {
        const target: Element = closest(e.target as Element, '.' + cls.CARD_CLASS);
        if (target) {
            this.cardDoubleClick(e);
        }
    }

    public cardClick(e: KeyboardEvent, selectedCard?: HTMLElement): void {
        const target: Element = closest((selectedCard) ? selectedCard : e.target as Element, '.' + cls.CARD_CLASS);
        const cardClickObj: Record<string, any> = this.parent.getCardDetails(target);
        if (cardClickObj) {
            this.parent.activeCardData = { data: cardClickObj, element: target };
            const args: CardClickEventArgs = { data: cardClickObj, element: target, cancel: false, event: e };
            this.parent.trigger(events.cardClick, args, (clickArgs: CardClickEventArgs) => {
                if (!clickArgs.cancel) {
                    if (target.classList.contains(cls.CARD_SELECTION_CLASS) && e.type === 'click') {
                        removeClass([target], cls.CARD_SELECTION_CLASS);
                        this.parent.layoutModule.disableAttributeSelection(target);
                    } else {
                        let isCtrlKey: boolean = e.ctrlKey;
                        if (this.parent.isAdaptive && this.parent.touchModule) {
                            isCtrlKey = (this.parent.touchModule.mobilePopup && this.parent.touchModule.tabHold) || isCtrlKey;
                        }
                        this.cardSelection(target, isCtrlKey, e.shiftKey);
                    }
                    if (this.parent.isAdaptive && this.parent.touchModule) {
                        this.parent.touchModule.updatePopupContent();
                    }
                    const cell: Element = closest(target, '.' + cls.CONTENT_CELLS_CLASS);
                    if (this.parent.allowKeyboard) {
                        const element: HTMLElement[] = [].slice.call(cell.querySelectorAll('.' + cls.CARD_CLASS));
                        element.forEach((e: HTMLElement): void => { e.setAttribute('tabindex', '0'); });
                        this.parent.keyboardModule.addRemoveTabIndex('Remove');
                    }
                }
            });
        }
    }

    private cardDoubleClick(e: Event): void {
        const target: Element = closest(e.target as Element, '.' + cls.CARD_CLASS);
        const cardDoubleClickObj: Record<string, any> = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        this.cardSelection(target, false, false);
        const args: CardClickEventArgs = { data: cardDoubleClickObj, element: target, cancel: false, event: e };
        this.parent.trigger(events.cardDoubleClick, args, (doubleClickArgs: CardClickEventArgs) => {
            if (!doubleClickArgs.cancel) {
                this.parent.dialogModule.openDialog('Edit', args.data);
            }
        });
    }

    public rowExpandCollapse(e: Event | HTMLElement, isFrozenElem?: HTMLElement): void {
        const headerTarget: HTMLElement = (e instanceof HTMLElement) ? e : e.target as HTMLElement;
        let currentSwimlaneHeader: HTMLElement = !isNullOrUndefined(isFrozenElem) ? isFrozenElem : headerTarget;
        const args: ActionEventArgs = { cancel: false, target: headerTarget, requestType: 'rowExpandCollapse' };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                const target: HTMLTableRowElement = closest(currentSwimlaneHeader as Element, '.' + cls.SWIMLANE_ROW_CLASS) as HTMLTableRowElement;
                const key: string = target.getAttribute('data-key');
                const tgtRow: Element = this.parent.element.querySelector('.' + cls.CONTENT_ROW_CLASS + `:nth-child(${target.rowIndex + 2})`);
                const targetIcon: Element = target.querySelector(`.${cls.SWIMLANE_ROW_EXPAND_CLASS},.${cls.SWIMLANE_ROW_COLLAPSE_CLASS}`);
                const isCollapsed: boolean = target.classList.contains(cls.COLLAPSED_CLASS) ? true : false;
                let tabIndex: string;
                if (isCollapsed) {
                    removeClass([tgtRow, target], cls.COLLAPSED_CLASS);
                    classList(targetIcon, [cls.SWIMLANE_ROW_EXPAND_CLASS], [cls.SWIMLANE_ROW_COLLAPSE_CLASS]);
                    this.parent.swimlaneToggleArray.splice(this.parent.swimlaneToggleArray.indexOf(key), 1);
                    tabIndex = '0';
                } else {
                    addClass([tgtRow, target], cls.COLLAPSED_CLASS);
                    classList(targetIcon, [cls.SWIMLANE_ROW_COLLAPSE_CLASS], [cls.SWIMLANE_ROW_EXPAND_CLASS]);
                    this.parent.swimlaneToggleArray.push(key);
                    tabIndex = '-1';
                }
                targetIcon.setAttribute('aria-label', isCollapsed ? key + ' Expand' : key + ' Collapse');
                target.setAttribute('aria-expanded', isCollapsed.toString());
                tgtRow.setAttribute('aria-expanded', isCollapsed.toString());
                const rows: HTMLElement[] = [].slice.call(tgtRow.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
                rows.forEach((cell: HTMLElement) => { cell.setAttribute('tabindex', tabIndex); });
                this.parent.notify(events.contentReady, {});
                this.parent.trigger(events.actionComplete, { target: headerTarget, requestType: 'rowExpandCollapse' });
            }
        });
    }

    public columnExpandCollapse(e: Event | HTMLElement): void {
        const headerTarget: HTMLElement = (e instanceof HTMLElement) ? e : e.target as HTMLElement;
        const args: ActionEventArgs = { cancel: false, target: headerTarget as HTMLElement, requestType: 'columnExpandCollapse' };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                const target: HTMLElement = closest(headerTarget, '.' + cls.HEADER_CELLS_CLASS) as HTMLElement;
                const colIndex: number = (target as HTMLTableHeaderCellElement).cellIndex;
                this.columnToggle(target as HTMLTableHeaderCellElement);
                const collapsed: number = this.parent.element.querySelectorAll(`.${cls.HEADER_CELLS_CLASS}.${cls.COLLAPSED_CLASS}`).length;
                if (collapsed === (this.parent.columns.length - this.hideColumnKeys.length)) {
                    const index: number = (colIndex + 1 === collapsed) ? 1 : colIndex + 2;
                    const headerSelector: string = `.${cls.HEADER_CELLS_CLASS}:not(.${cls.STACKED_HEADER_CELL_CLASS}):nth-child(${index})`;
                    const nextCol: Element = this.parent.element.querySelector(headerSelector);
                    addClass([nextCol], cls.COLLAPSED_CLASS);
                    this.columnToggle(nextCol as HTMLTableHeaderCellElement);
                }
                this.parent.notify(events.contentReady, {});
                this.parent.trigger(events.actionComplete, { target: headerTarget, requestType: 'columnExpandCollapse' });
            }
        });
    }

    public columnToggle(target: HTMLTableHeaderCellElement): void {
        const colIndex: number = target.cellIndex;
        const elementSelector: string = `.${cls.CONTENT_ROW_CLASS}:not(.${cls.SWIMLANE_ROW_CLASS})`;
        const targetRow: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
        const colSelector: string = `.${cls.TABLE_CLASS} col:nth-child(${colIndex + 1})`;
        const targetIcon: Element = target.querySelector(`.${cls.COLUMN_EXPAND_CLASS},.${cls.COLUMN_COLLAPSE_CLASS}`);
        const colGroup: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(cls.COLLAPSED_CLASS)) {
            removeClass(colGroup, cls.COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col: HTMLElement) => col.style.width = formatUnit(this.parent.layoutModule.getWidth()));
            }
            classList(targetIcon, [cls.COLUMN_EXPAND_CLASS], [cls.COLUMN_COLLAPSE_CLASS]);
            for (const row of targetRow) {
                const targetCol: Element = row.querySelector(`.${cls.CONTENT_CELLS_CLASS}:nth-child(${colIndex + 1})`);
                removeClass([targetCol, target], cls.COLLAPSED_CLASS);
                remove(targetCol.querySelector('.' + cls.COLLAPSE_HEADER_TEXT_CLASS));
                target.setAttribute('aria-expanded', 'true');
                targetCol.setAttribute('aria-expanded', 'true');
                const collapsedCell: HTMLElement[] = [].slice.call(targetCol.parentElement.querySelectorAll('.' + cls.COLLAPSED_CLASS));
                collapsedCell.forEach((cell: HTMLElement) => {
                    const collapasedText: HTMLElement = cell.querySelector('.' + cls.COLLAPSE_HEADER_TEXT_CLASS);
                    collapasedText.style.height = 'auto';
                    if (collapasedText && targetCol.getBoundingClientRect().height < (collapasedText.getBoundingClientRect().height + 10)) {
                        collapasedText.style.height = (targetCol.getBoundingClientRect().height - 4) + 'px';
                    }
                });
            }
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(target.getAttribute('data-key')), 1);
            (this.parent.columns[colIndex] as Base<HTMLElement>).setProperties({ isExpanded: true }, true);
            target.querySelector('.e-header-icon').setAttribute('aria-label', target.getAttribute('data-key') + ' Expand');
        } else {
            addClass(colGroup, cls.COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col: HTMLElement) => col.style.width = formatUnit(events.toggleWidth));
            }
            classList(targetIcon, [cls.COLUMN_COLLAPSE_CLASS], [cls.COLUMN_EXPAND_CLASS]);
            const key: string = target.getAttribute('data-key');
            for (const row of targetRow) {
                const targetCol: Element = row.querySelector(`.${cls.CONTENT_CELLS_CLASS}[data-key="${key}"]`);
                const index: number = (targetCol as HTMLTableCellElement).cellIndex;
                const text: string = (this.parent.columns[index].showItemCount ? '[' +
                    targetCol.querySelectorAll('.' + cls.CARD_CLASS).length + '] ' : '') + this.parent.columns[index].headerText;
                targetCol.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                addClass([targetCol, target], cls.COLLAPSED_CLASS);
                target.setAttribute('aria-expanded', 'false');
                targetCol.setAttribute('aria-expanded', 'false');
                const collapsedCell: HTMLElement[] = [].slice.call(targetCol.parentElement.querySelectorAll('.' + cls.COLLAPSED_CLASS));
                collapsedCell.forEach((cell: HTMLElement) => {
                    const collapasedText: HTMLElement = cell.querySelector('.' + cls.COLLAPSE_HEADER_TEXT_CLASS);
                    if (collapasedText && targetCol.getBoundingClientRect().height < (collapasedText.getBoundingClientRect().height + 10)) {
                        collapasedText.style.height = (targetCol.getBoundingClientRect().height - 4) + 'px';
                    }
                });
            }
            this.columnToggleArray.push(target.getAttribute('data-key'));
            (this.parent.columns[colIndex] as Base<HTMLElement>).setProperties({ isExpanded: false }, true);
            target.querySelector('.e-header-icon').setAttribute('aria-label', key + ' Collapse');
        }
    }

    public cardSelection(target: Element, isCtrl: boolean, isShift: boolean): void {
        if (!target) { return; }
        const cards: HTMLElement[] = this.parent.getSelectedCards();
        if (this.parent.cardSettings.selectionType !== 'None') {
            const contentRow: HTMLTableRowElement = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
            const index: number = !isNullOrUndefined(this.lastSelectionRow) ? this.lastSelectionRow.rowIndex : contentRow.rowIndex;
            if (index !== contentRow.rowIndex && (isCtrl || isShift) && this.parent.cardSettings.selectionType === 'Multiple') { return; }
            if (cards.length !== 0 && (!isCtrl || this.parent.cardSettings.selectionType === 'Single')) {
                removeClass(cards, cls.CARD_SELECTION_CLASS);
                this.parent.layoutModule.disableAttributeSelection(cards);
                cards.forEach((el: Element) => {
                    this.selectionArray.splice(this.selectionArray.indexOf(el.getAttribute('data-id')), 1);
                    this.selectedCardsElement.splice(this.selectedCardsElement.indexOf(el), 1);
                    this.selectedCardsData.splice(this.selectedCardsData.indexOf(this.parent.getCardDetails(el), 1));
                });
            }
            if (cards.length > 0 && isShift && this.parent.cardSettings.selectionType === 'Multiple') {
                const curCards: string[] = []; let start: number; let end: number; let i: number;
                const allCards: HTMLElement[] = [].slice.call(contentRow.querySelectorAll('.' + cls.CARD_CLASS));
                allCards.forEach((el: Element) => curCards.push(el.getAttribute('data-id')));
                const curId: string = target.getAttribute('data-id');
                const lastId: string = this.lastCard.getAttribute('data-id');
                const curIndex: number = end = curCards.indexOf(curId);
                const lastIndex: number = start = curCards.indexOf(lastId);
                const select: string = curIndex > lastIndex ? 'next' : 'prev';
                if (select === 'prev') {
                    start = curIndex; end = lastIndex;
                }
                for (i = start; i <= end; i++) {
                    const card: HTMLElement = allCards[i];
                    addClass([card], cls.CARD_SELECTION_CLASS);
                    card.setAttribute('aria-selected', 'true');
                    card.setAttribute('tabindex', '0');
                    this.selectionArray.push(card.getAttribute('data-id'));
                    this.selectedCardsElement.push(card);
                    this.selectedCardsData.push(this.parent.getCardDetails(card));
                    this.lastCardSelection = card;
                    if (select === 'prev') {
                        this.lastCardSelection = allCards[start];
                    }
                }
            } else {
                addClass([target], cls.CARD_SELECTION_CLASS);
                target.setAttribute('aria-selected', 'true');
                target.setAttribute('tabindex', '0');
                this.selectionArray.push(target.getAttribute('data-id'));
                this.selectedCardsElement.push(target);
                this.selectedCardsData.push(this.parent.getCardDetails(target));
                this.lastCard = this.lastCardSelection = target;
                this.lastSelectionRow = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
                if (this.lastSelectionRow.previousElementSibling) {
                    const elementSelector: string = `.${cls.SWIMLANE_ROW_EXPAND_CLASS},.${cls.SWIMLANE_ROW_COLLAPSE_CLASS}`;
                    const parentEle: HTMLElement = this.lastSelectionRow.previousElementSibling.querySelector(elementSelector);
                    if (parentEle && parentEle.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS)) {
                        this.rowExpandCollapse(parentEle);
                    }
                }
            }
        }
    }

    public addColumn(columnOptions: ColumnsModel, index: number): void {
        const addColumn: ColumnsModel = createInstance(Columns, [this.parent, 'columns', columnOptions, true]);
        this.parent.columns.splice(index, 0, addColumn);
        this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
    }

    public deleteColumn(index: number): void {
        const listKey: Element = this.parent.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS).item(index);
        if (listKey && listKey.classList.contains(cls.HEADER_ROW_TOGGLE_CLASS)) {
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(listKey.getAttribute('data-key'), 0));
        }
        this.parent.columns.splice(index, 1);
        if (this.parent.columns.length === 0) {
            detach(this.parent.element.querySelector('.' + cls.HEADER_CLASS));
            detach(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
        } else {
            this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
        }
    }

    public showColumn(key: string | number): void {
        const index: number = this.hideColumnKeys.indexOf(key.toString());
        if (index !== -1) {
            this.hideColumnKeys.splice(index, 1);
            this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
        }
    }

    public hideColumn(key: string | number): void {
        this.hideColumnKeys.push(key.toString());
        this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
    }

    /**
     * Maintain the single card selection
     *
     * @param {Record<string, any>} data - Specifies the selected card data.
     * @returns {void}
     * @private
     * @hidden
     */
     public SingleCardSelection(data: Record<string, any>): void {
        if (this.parent.cardSettings.selectionType !== 'None' && data[this.parent.cardSettings.headerField]) {
            let card: HTMLElement = this.parent.element.querySelector('.e-card[data-id=\"' +
                data[this.parent.cardSettings.headerField].toString() + '"\]')
            if (card) {
                addClass([card], cls.CARD_SELECTION_CLASS);
                card.setAttribute('aria-selected', 'true');
                card.setAttribute('tabindex', '0');
            }
        }
    }
}
