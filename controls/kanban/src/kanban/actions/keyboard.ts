import { KeyboardEvents, KeyboardEventArgs, addClass, removeClass, classList, closest } from '@syncfusion/ej2-base';
import { Kanban } from '../base';
import * as cls from '../base/css-constant';

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
export class Keyboard {
    private parent: Kanban;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string } = {
        firstCardSelection: '36',
        lastCardSelection: '35',
        upArrow: '38',
        downArrow: '40',
        rightArrow: '39',
        leftArrow: '37',
        swimlaneExpandAll: 'ctrl+40',
        swimlaneCollapseAll: 'ctrl+38',
        selectedSwimlaneExpand: 'alt+40',
        selectedSwimlaneCollapse: 'alt+38',
        selectedColumnCollapse: 'ctrl+37',
        selectedColumnExpand: 'ctrl+39',
        multiSelectionByUpArrow: 'shift+38',
        multiSelectionByDownArrow: 'shift+40',
        multiSelectionByLeftArrow: 'shift+37',
        multiSelectionByRightArrow: 'shift+39',
    };
    /**
     * Constructor for keyboard module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let selectedCard: Element = this.parent.element.querySelectorAll('.e-card.e-selection').item(0);
        if (!selectedCard && e.action !== 'firstCardSelection' && e.action !== 'lastCardSelection') {
            return;
        }
        let key: string;
        switch (e.action) {
            case 'upArrow':
            case 'downArrow':
            case 'multiSelectionByUpArrow':
            case 'multiSelectionByDownArrow':
                key = closest(this.parent.actionModule.lastCardSelection, '.e-content-cells').getAttribute('data-key');
                let cardSelector: string = '.e-content-cells[data-key=' + key + '] .e-card';
                let allCards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(cardSelector));
                let curId: string = this.parent.actionModule.lastCardSelection.getAttribute('data-id');
                let curIndex: number = this.getCardId(allCards).indexOf(curId);
                let isShift: boolean = ((e.action === 'multiSelectionByUpArrow' || e.action === 'multiSelectionByDownArrow')
                    && this.parent.cardSettings.selectionType === 'Multiple');
                let index: number = (e.action === 'upArrow' || e.action === 'multiSelectionByUpArrow') ? curIndex - 1 : curIndex + 1;
                this.parent.actionModule.cardSelection(allCards[index], false, isShift);
                break;
            case 'rightArrow':
            case 'leftArrow':
            case 'multiSelectionByLeftArrow':
            case 'multiSelectionByRightArrow':
                this.moveCards(e.action, this.parent.actionModule.lastCardSelection);
                break;
            case 'firstCardSelection':
            case 'lastCardSelection':
                if (selectedCard) {
                    removeClass([selectedCard], 'e-selection');
                    let selection: string[] = this.parent.actionModule.selectionArray;
                    selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
                }
                let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS));
                let element: Element = e.action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
                this.parent.actionModule.cardSelection(element, false, false);
                break;
            case 'swimlaneExpandAll':
            case 'swimlaneCollapseAll':
            case 'selectedSwimlaneExpand':
            case 'selectedSwimlaneCollapse':
                if (this.parent.swimlaneSettings.keyField) {
                    this.swimlaneExpandCollapse(e.action);
                }
                break;
            case 'selectedColumnExpand':
            case 'selectedColumnCollapse':
                key = selectedCard.getAttribute('data-key');
                let cell: HTMLTableHeaderCellElement = this.parent.element.querySelector('.e-header-cells[data-key=' + key + ']');
                if (cell.classList.contains(cls.HEADER_ROW_TOGGLE_CLASS)) {
                    if ((cell.classList.contains('e-collapsed') && e.action === 'selectedColumnCollapse') ||
                        (!cell.classList.contains('e-collapsed') && e.action === 'selectedColumnExpand')) {
                        return;
                    } else {
                        this.parent.actionModule.columnExpandCollapse(cell);
                    }
                }
                break;
        }
    }

    private swimlaneExpandCollapse(action: string): void {
        let className: string = '.e-card.e-selection';
        if (action === 'swimlaneExpandAll' || action === 'swimlaneCollapseAll') {
            className = '.e-content-row.e-swimlane-row';
        }
        let element: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className));
        let collapseCount: number = this.parent.element.querySelectorAll(className + '.e-collapsed').length;
        if ((action === 'swimlaneCollapseAll' && element.length - collapseCount === 0) ||
            (action === 'swimlaneExpandAll' && element.length - collapseCount === element.length)) {
            return;
        }
        element.forEach((ele: Element) => {
            if (ele.classList.contains(cls.CARD_CLASS)) {
                ele = closest(ele, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
            }
            if (ele.classList.contains(cls.COLLAPSED_CLASS)) {
                removeClass([ele, ele.nextElementSibling], cls.COLLAPSED_CLASS);
                classList(ele.querySelector('.' + cls.ICON_CLASS), [cls.SWIMLANE_ROW_EXPAND], [cls.SWIMLANE_ROW_COLLAPSE]);
            } else if (!ele.classList.contains(cls.COLLAPSED_CLASS)) {
                addClass([ele, ele.nextElementSibling], cls.COLLAPSED_CLASS);
                classList(ele.querySelector('.' + cls.ICON_CLASS), [cls.SWIMLANE_ROW_COLLAPSE], [cls.SWIMLANE_ROW_EXPAND]);
            }
        });
    }

    private getCardId(cardElements: HTMLElement[]): string[] {
        let curCardId: string[] = [];
        cardElements.forEach((el: Element) => curCardId.push(el.getAttribute('data-id')));
        return curCardId;
    }

    private moveNextRow(row: Element): void {
        for (let i: number = 0; i < row.childElementCount; i++) {
            let nextCell: Element = row.children[i];
            let nextCellCards: HTMLElement[] = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
            if (nextCellCards.length > 0) {
                this.parent.actionModule.cardSelection(nextCellCards[0], false, false);
                if (row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneExpand');
                }
                break;
            }
        }
    }

    private movePreviousRow(row: Element): void {
        for (let i: number = (row.childElementCount - 1); i >= 0; i--) {
            let nextCell: Element = row.children[i];
            let nextCellCards: HTMLElement[] = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
            if (nextCellCards.length > 0) {
                if (!row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneCollapse');
                }
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, false);
                break;
            }
        }
    }

    private cardIndex(isSame: boolean, nextCellCards: HTMLElement[], curIndex: number, action: string): void {
        if (isSame) {
            let isShift: boolean = ((action === 'multiSelectionByRightArrow' || action === 'multiSelectionByLeftArrow')
                && this.parent.cardSettings.selectionType === 'Multiple');
            if (nextCellCards[curIndex]) {
                this.parent.actionModule.cardSelection(nextCellCards[curIndex], false, isShift);
            } else {
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, isShift);
            }
        }
    }

    private moveCards(action: string, card: Element): void {
        let nextCell: Element;
        let nextCellCards: HTMLElement[];
        let curCell: HTMLTableCellElement = closest(card, '.e-content-cells') as HTMLTableCellElement;
        let curCellCards: HTMLElement[] = [].slice.call(curCell.querySelectorAll('.e-card'));
        let curRow: HTMLTableRowElement = closest(curCell, '.e-content-row') as HTMLTableRowElement;
        let curIndex: number = this.getCardId(curCellCards).indexOf(card.getAttribute('data-id'));
        if (action === 'rightArrow' || action === 'multiSelectionByRightArrow') {
            if (curCell.cellIndex === (curRow.childElementCount - 1) && this.parent.swimlaneSettings.keyField
                && action !== 'multiSelectionByRightArrow') {
                if (curIndex < (this.getCardId(curCellCards).length - 1)) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.nextElementSibling, false, false);
                } else if (curRow.rowIndex !== (this.parent.element.querySelectorAll('.' + cls.CONTENT_ROW_CLASS).length - 1)) {
                    let targetRow: Element =
                        this.parent.element.querySelector('.' + cls.CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex + 3})`);
                    this.moveNextRow(targetRow);
                }
            } else {
                let isSame: boolean = false;
                for (let i: number = curCell.cellIndex + 1; i < curRow.children.length; i++) {
                    nextCell = curRow.children[i];
                    nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
                    if (nextCellCards.length > 0) {
                        isSame = true;
                        break;
                    }
                }
                this.cardIndex(isSame, nextCellCards, curIndex, action);
            }
        } else {
            if (curCell.cellIndex === 0 && this.parent.swimlaneSettings.keyField && action !== 'multiSelectionByLeftArrow') {
                if (curIndex > 0) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.previousElementSibling, false, false);
                } else if (curRow.rowIndex > 1) {
                    let className: string = '.' + cls.CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex - 1})` + ':not(.e-collapsed)';
                    let targetRow: Element = this.parent.element.querySelector(className);
                    if (targetRow) {
                        this.movePreviousRow(targetRow);
                    }
                }
            } else {
                let isSame: boolean = false;
                for (let i: number = (curCell.cellIndex - 1); i >= 0; i--) {
                    nextCell = curRow.children[i] as Element;
                    nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
                    if (nextCellCards.length > 0) {
                        isSame = true;
                        break;
                    }
                    if (i === 0 && this.parent.swimlaneSettings.keyField) {
                        let row: Element =
                            this.parent.element.querySelector('.' + cls.CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex - 1})`);
                        this.movePreviousRow(row);
                    }
                }
                this.cardIndex(isSame, nextCellCards, curIndex, action);
            }
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'keyboard';
    }

    /**
     * To destroy the keyboard module. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.keyboardModule.destroy();
    }
}
