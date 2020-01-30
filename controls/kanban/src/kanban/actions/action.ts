import { closest, classList, createElement, remove, addClass, removeClass,
         isNullOrUndefined, Base, formatUnit } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardClickEventArgs, ActionEventArgs } from '../base/interface';
import { ColumnsModel } from '../models';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Action module is used to perform card actions.
 * @hidden
 */
export class Action {
    private parent: Kanban;
    public swimlaneToggleArray: string[];
    public columnToggleArray: string[];
    public selectionArray: string[];
    public lastCardSelection: Element;
    private lastSelectionRow: HTMLTableRowElement;
    private lastCard: Element;
    private selectedCardsElement: Element[];
    private selectedCardsData: object[];
    public hideColumnKeys: string[];
    /**
     * Constructor for action module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.swimlaneToggleArray = [];
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
    }

    public cardClick(e: KeyboardEvent): void {
        let target: Element = closest(e.target as Element, '.' + cls.CARD_CLASS);
        let cardClickObj: { [key: string]: Object } = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardClickObj, element: target };
        let args: CardClickEventArgs = { data: cardClickObj, element: target, cancel: false };
        this.parent.trigger(events.cardClick, args, (clickArgs: CardClickEventArgs) => {
            if (!clickArgs.cancel) {
                this.cardSelection(target, e.ctrlKey, e.shiftKey);
            }
        });
    }

    public cardDoubleClick(e: Event): void {
        let target: Element = closest(e.target as Element, '.' + cls.CARD_CLASS);
        let cardDoubleClickObj: { [key: string]: Object } = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        let args: CardClickEventArgs = { data: cardDoubleClickObj, element: target, cancel: false };
        this.parent.trigger(events.cardDoubleClick, args);
    }

    public rowExpandCollapse(e: Event): void {
        let args: ActionEventArgs = { cancel: false, target: e.target as HTMLElement, requestType: 'rowExpandCollapse' };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                let target: HTMLTableRowElement = closest(e.target as Element, '.' + cls.SWIMLANE_ROW_CLASS) as HTMLTableRowElement;
                let tgtRow: Element = this.parent.element.querySelector('.' + cls.CONTENT_ROW_CLASS + `:nth-child(${target.rowIndex + 2})`);
                let targetIcon: Element = target.querySelector('.' + cls.SWIMLANE_ROW_EXPAND + ',.' + cls.SWIMLANE_ROW_COLLAPSE);
                if (target.classList.contains(cls.COLLAPSED_CLASS)) {
                    removeClass([tgtRow, target], cls.COLLAPSED_CLASS);
                    classList(targetIcon, [cls.SWIMLANE_ROW_EXPAND], [cls.SWIMLANE_ROW_COLLAPSE]);
                    this.swimlaneToggleArray.splice(this.swimlaneToggleArray.indexOf(target.getAttribute('data-key')), 1);
                } else {
                    addClass([tgtRow, target], cls.COLLAPSED_CLASS);
                    classList(targetIcon, [cls.SWIMLANE_ROW_COLLAPSE], [cls.SWIMLANE_ROW_EXPAND]);
                    this.swimlaneToggleArray.push(target.getAttribute('data-key'));
                }
                this.parent.notify(events.contentReady, {});
                this.parent.trigger(events.actionComplete, { target: e.target as HTMLElement, requestType: 'rowExpandCollapse' });
            }
        });
    }

    public columnExpandCollapse(e: Event | HTMLElement): void {
        let headerTarget: HTMLElement = (e instanceof HTMLElement) ? e : e.target as HTMLElement;
        let args: ActionEventArgs = { cancel: false, target: headerTarget as HTMLElement, requestType: 'columnExpandCollapse' };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                let target: HTMLElement = closest(headerTarget, '.' + cls.HEADER_CELLS_CLASS) as HTMLElement;
                let colIndex: number = (target as HTMLTableHeaderCellElement).cellIndex;
                this.columnToggle(target as HTMLTableHeaderCellElement);
                let collapsed: number = this.parent.element.querySelectorAll(`.${cls.HEADER_CELLS_CLASS}.${cls.COLLAPSED_CLASS}`).length;
                if (collapsed === (this.parent.columns.length - this.hideColumnKeys.length)) {
                    let nextColIndex: number = (colIndex + 1 === collapsed) ? 0 : colIndex + 1;
                    let headerSelector: string = `.${cls.HEADER_CELLS_CLASS}:not(.e-stacked-header-cell):nth-child(${nextColIndex + 1})`;
                    let nextCol: Element = this.parent.element.querySelector(headerSelector);
                    addClass([nextCol], cls.COLLAPSED_CLASS);
                    this.columnToggle(nextCol as HTMLTableHeaderCellElement);
                }
                this.parent.notify(events.contentReady, {});
                this.parent.trigger(events.actionComplete, { target: headerTarget, requestType: 'columnExpandCollapse' });
            }
        });
    }

    public columnToggle(target: HTMLTableHeaderCellElement): void {
        let colIndex: number = target.cellIndex;
        let headerLimits: HTMLElement = target.querySelector('.' + cls.LIMITS_CLASS);
        let targetRow: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        let colSelector: string = `.e-header-table col:nth-child(${colIndex + 1}),.e-content-table col:nth-child(${colIndex + 1})`;
        let targetIcon: Element = target.querySelector('.' + cls.COLUMN_EXPAND + ',.' + cls.COLUMN_COLLAPSE);
        let colGroup: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(cls.COLLAPSED_CLASS)) {
            removeClass(colGroup, cls.COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col: HTMLElement) => {
                    col.style.width = formatUnit(this.parent.layoutModule.getWidth());
                });
            }
            classList(targetIcon, [cls.COLUMN_EXPAND], [cls.COLUMN_COLLAPSE]);
            for (let row of targetRow) {
                let targetCol: Element = row.querySelector(`.${cls.CONTENT_CELLS_CLASS}:nth-child(${colIndex + 1})`);
                removeClass([targetCol, target], cls.COLLAPSED_CLASS);
                remove(targetCol.querySelector('.' + cls.COLLAPSE_HEADER_TEXT));
                let limitEle: Element = targetCol.querySelector('.' + cls.LIMITS_CLASS);
                if (limitEle) {
                    removeClass([limitEle], cls.HIDE_LIMITS);
                }
            }
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(target.getAttribute('data-key')), 1);
            if (headerLimits) {
                removeClass([headerLimits], cls.HIDE_LIMITS);
            }
            (this.parent.columns[colIndex] as Base<HTMLElement>).setProperties({ isExpanded: true }, true);
        } else {
            addClass(colGroup, cls.COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col: HTMLElement) => {
                    col.style.width = formatUnit(events.toggleWidth);
                });
            }
            classList(targetIcon, [cls.COLUMN_COLLAPSE], [cls.COLUMN_EXPAND]);
            for (let row of targetRow) {
                let key: string = target.getAttribute('data-key');
                let targetCol: Element = row.querySelector('.' + cls.CONTENT_CELLS_CLASS + '[data-key="' + key + '"]');
                let index: number = (targetCol as HTMLTableCellElement).cellIndex;
                targetCol.appendChild(createElement('div', {
                    className: cls.COLLAPSE_HEADER_TEXT,
                    innerHTML: this.parent.columns[index].headerText
                }));
                addClass([targetCol, target], cls.COLLAPSED_CLASS);
                let limitEle: Element = targetCol.querySelector('.' + cls.LIMITS_CLASS);
                if (limitEle) {
                    addClass([limitEle], cls.HIDE_LIMITS);
                }
            }
            if (headerLimits) {
                addClass([headerLimits], cls.HIDE_LIMITS);
            }
            this.columnToggleArray.push(target.getAttribute('data-key'));
            (this.parent.columns[colIndex] as Base<HTMLElement>).setProperties({ isExpanded: false }, true);
        }
    }

    public cardSelection(target: Element, isCtrl: boolean, isShift: boolean): void {
        if (!target) {
            return;
        }
        let cards: HTMLElement[] = this.parent.getSelectedCards();
        if (this.parent.cardSettings.selectionType !== 'None') {
            let contentRow: HTMLTableRowElement = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
            let index: number = !isNullOrUndefined(this.lastSelectionRow) ? this.lastSelectionRow.rowIndex : contentRow.rowIndex;
            if (index !== contentRow.rowIndex && (isCtrl || isShift) && this.parent.cardSettings.selectionType === 'Multiple') {
                return;
            }
            if (cards.length !== 0 && (!isCtrl || this.parent.cardSettings.selectionType === 'Single')) {
                removeClass(cards, cls.CARD_SELECTION);
                cards.forEach((el: Element) => {
                    this.selectionArray.splice(this.selectionArray.indexOf(el.getAttribute('data-id')), 1);
                    this.selectedCardsElement.splice(this.selectedCardsElement.indexOf(el), 1);
                    this.selectedCardsData.splice(this.selectedCardsData.indexOf(this.parent.getCardDetails(el), 1));
                });
            }
            if (cards.length > 0 && isShift && this.parent.cardSettings.selectionType === 'Multiple') {
                let curCards: string[] = []; let start: number; let end: number; let i: number;
                let allCards: HTMLElement[] = [].slice.call(contentRow.querySelectorAll('.' + cls.CARD_CLASS));
                allCards.forEach((el: Element) => curCards.push(el.getAttribute('data-id')));
                let curId: string = target.getAttribute('data-id');
                let lastId: string = this.lastCard.getAttribute('data-id');
                let curIndex: number = end = curCards.indexOf(curId);
                let lastIndex: number = start = curCards.indexOf(lastId);
                let select: string = curIndex > lastIndex ? 'next' : 'prev';
                if (select === 'prev') {
                    start = curIndex; end = lastIndex;
                }
                for (i = start; i <= end; i++) {
                    let card: HTMLElement = allCards[i];
                    addClass([card], cls.CARD_SELECTION);
                    this.selectionArray.push(card.getAttribute('data-id'));
                    this.selectedCardsElement.push(card);
                    this.selectedCardsData.push(this.parent.getCardDetails(card));
                    this.lastCardSelection = card;
                    if (select === 'prev') {
                        this.lastCardSelection = allCards[start];
                    }
                }
            } else {
                addClass([target], cls.CARD_SELECTION);
                this.selectionArray.push(target.getAttribute('data-id'));
                this.selectedCardsElement.push(target);
                this.selectedCardsData.push(this.parent.getCardDetails(target));
                this.lastCard = this.lastCardSelection = target;
                this.lastSelectionRow = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
            }
        }
    }

    public addColumn(columnOptions: ColumnsModel, index: number): void {
        this.parent.columns.splice(index, 0, columnOptions);
        this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
    }

    public deleteColumn(index: number): void {
        let listKey: Element = this.parent.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS).item(index);
        if (listKey && listKey.classList.contains(cls.HEADER_ROW_TOGGLE_CLASS)) {
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(listKey.getAttribute('data-key'), 0));
        }
        this.parent.columns.splice(index, 1);
        if (this.parent.columns.length === 0) {
            this.parent.destroy();
        } else {
            this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
        }
    }

    public showColumn(key: string): void {
        let index: number = this.hideColumnKeys.indexOf(key);
        if (index !== -1) {
            this.hideColumnKeys.splice(index, 1);
            this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
        }
    }

    public hideColumn(key: string): void {
        this.hideColumnKeys.push(key);
        this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
    }

}
