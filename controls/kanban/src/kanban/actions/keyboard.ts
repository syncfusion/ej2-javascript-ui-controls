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
    private prevAction: string;
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
        shiftTab: 'shift+tab',
        enter: '13',
        tab: 'tab'
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
        this.prevAction = '';
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let selectedCard: Element = this.parent.element.querySelectorAll(`.${cls.CARD_CLASS}.${cls.CARD_SELECTION_CLASS}`).item(0);
        if (!selectedCard && !closest(document.activeElement, `.${cls.ROOT_CLASS}`)) {
            return;
        }
        switch (e.action) {
            case 'upArrow':
            case 'downArrow':
            case 'multiSelectionByUpArrow':
            case 'multiSelectionByDownArrow':
                this.processUpDownArrow(e.action, selectedCard);
                break;
            case 'rightArrow':
            case 'leftArrow':
            case 'multiSelectionByLeftArrow':
            case 'multiSelectionByRightArrow':
                this.processLeftRightArrow(e, selectedCard);
                break;
            case 'firstCardSelection':
            case 'lastCardSelection':
                this.processCardSelection(e.action, selectedCard);
                break;
            case 'swimlaneExpandAll':
            case 'swimlaneCollapseAll':
            case 'selectedSwimlaneExpand':
            case 'selectedSwimlaneCollapse':
                this.processSwimlaneExpandCollapse(e.action);
                break;
            case 'selectedColumnExpand':
            case 'selectedColumnCollapse':
                this.processColumnExpandcollapse(e.action, selectedCard);
                break;
            case 'enter':
                this.processEnter(e, selectedCard);
                break;
            case 'tab':
            case 'shiftTab':
                this.processTab(e.action, selectedCard);
                break;
        }
    }

    private processCardSelection(action: string, selectedCard: Element): void {
        if (selectedCard) {
            removeClass([selectedCard], cls.CARD_SELECTION_CLASS);
            this.parent.layoutModule.disableAttributeSelection(selectedCard);
            let selection: string[] = this.parent.actionModule.selectionArray;
            selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
        }
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS));
        let element: Element = action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
        this.parent.actionModule.cardSelection(element, false, false);
    }

    private processLeftRightArrow(e: KeyboardEventArgs, selectedCard: Element): void {
        let activeElement: HTMLElement = document.activeElement as HTMLElement;
        if (!selectedCard && activeElement) {
            if (activeElement.classList.contains(cls.COLUMN_EXPAND_CLASS) || activeElement.classList.contains(cls.COLUMN_COLLAPSE_CLASS)) {
                this.parent.actionModule.columnExpandCollapse(activeElement);
            } else if (activeElement.classList.contains(cls.SWIMLANE_ROW_EXPAND_CLASS) ||
                activeElement.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS)) {
                this.parent.actionModule.rowExpandCollapse(e);
            }
        }
        if (selectedCard) {
            this.processMoveCards(e.action, this.parent.actionModule.lastCardSelection);
        }
    }

    private processUpDownArrow(action: string, selectedCard: Element): void {
        let card: HTMLElement;
        let isShift: boolean = false;
        if (selectedCard) {
            let key: string = closest(this.parent.actionModule.lastCardSelection, '.' + cls.CONTENT_CELLS_CLASS).getAttribute('data-key');
            let cardSelector: string = `.${cls.CONTENT_CELLS_CLASS}[data-key="${key}"] .${cls.CARD_CLASS}`;
            let allCards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(cardSelector));
            let curId: string = this.parent.actionModule.lastCardSelection.getAttribute('data-id');
            let curIndex: number = this.getCardId(allCards).indexOf(curId);
            isShift = ((action === 'multiSelectionByUpArrow' || action === 'multiSelectionByDownArrow')
                && this.parent.cardSettings.selectionType === 'Multiple');
            let index: number = (action === 'upArrow' || action === 'multiSelectionByUpArrow') ? curIndex - 1 : curIndex + 1;
            card = allCards[index];
        } else if (action === 'downArrow' && document.activeElement) {
            if (document.activeElement.classList.contains(cls.SWIMLANE_ROW_EXPAND_CLASS)) {
                let parentEle: Element = closest(document.activeElement, '.' + cls.SWIMLANE_ROW_CLASS);
                card = parentEle.nextElementSibling.querySelector('.' + cls.CARD_CLASS);
            } else if (document.activeElement.classList.contains(cls.ROOT_CLASS) && !this.parent.swimlaneSettings.keyField) {
                card = this.parent.element.querySelector('.' + cls.CARD_CLASS);
            }
        } else if (action === 'upArrow' && document.activeElement &&
        document.activeElement.classList.contains(cls.SWIMLANE_ROW_EXPAND_CLASS)) {
            let parentEle: Element = closest(document.activeElement, '.' + cls.SWIMLANE_ROW_CLASS);
            let allCards: HTMLElement[] = [].slice.call(parentEle.previousElementSibling.querySelectorAll('.' + cls.CARD_CLASS));
            card = (allCards).slice(-1)[0];
        }
        this.parent.actionModule.cardSelection(card, false, isShift);
        this.parent.element.focus();
    }

    private processColumnExpandcollapse(action: string, selectedCard: Element): void {
        let key: string = selectedCard.getAttribute('data-key');
        let cell: HTMLTableHeaderCellElement = this.parent.element.querySelector(`.${cls.HEADER_CELLS_CLASS}[data-key="${key}"]`);
        if (cell.classList.contains(cls.HEADER_ROW_TOGGLE_CLASS)) {
            if ((cell.classList.contains(cls.COLLAPSED_CLASS) && action === 'selectedColumnCollapse') ||
                (!cell.classList.contains(cls.COLLAPSED_CLASS) && action === 'selectedColumnExpand')) {
                return;
            } else {
                this.parent.actionModule.columnExpandCollapse(cell);
            }
        }
    }

    private processSwimlaneExpandCollapse(action: string): void {
        if (!this.parent.swimlaneSettings.keyField) {
            return;
        }
        let className: string = `.${cls.CARD_CLASS}.${cls.CARD_SELECTION_CLASS}`;
        if (action === 'swimlaneExpandAll' || action === 'swimlaneCollapseAll') {
            className = `.${cls.CONTENT_ROW_CLASS}.${cls.SWIMLANE_ROW_CLASS}`;
        }
        let element: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className));
        if (this.prevAction === action) {
            return;
        }
        this.prevAction = action;
        element.forEach((ele: Element) => {
            if (ele.classList.contains(cls.CARD_CLASS)) {
                ele = closest(ele, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
            }
            if (ele.classList.contains(cls.COLLAPSED_CLASS)) {
                removeClass([ele, ele.nextElementSibling], cls.COLLAPSED_CLASS);
                classList(ele.querySelector('.' + cls.ICON_CLASS), [cls.SWIMLANE_ROW_EXPAND_CLASS], [cls.SWIMLANE_ROW_COLLAPSE_CLASS]);
                ele.querySelector('.' + cls.ICON_CLASS).setAttribute('aria-label', ele.getAttribute('data-key') + ' Expand');
            } else if (!ele.classList.contains(cls.COLLAPSED_CLASS)) {
                addClass([ele, ele.nextElementSibling], cls.COLLAPSED_CLASS);
                classList(ele.querySelector('.' + cls.ICON_CLASS), [cls.SWIMLANE_ROW_COLLAPSE_CLASS], [cls.SWIMLANE_ROW_EXPAND_CLASS]);
                ele.querySelector('.' + cls.ICON_CLASS).setAttribute('aria-label', ele.getAttribute('data-key') + ' Collapse');
            }
        });
    }

    private getCardId(cardElements: HTMLElement[]): string[] {
        let curCardId: string[] = [];
        cardElements.forEach((el: Element) => curCardId.push(el.getAttribute('data-id')));
        return curCardId;
    }

    private processNextRow(row: Element): void {
        for (let i: number = 0; i < row.childElementCount; i++) {
            let nextCell: Element = row.children[i];
            let nextCellCards: HTMLElement[] = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
            if (nextCellCards.length > 0) {
                this.parent.actionModule.cardSelection(nextCellCards[0], false, false);
                break;
            }
        }
    }

    private processPreviousRow(row: Element): void {
        for (let i: number = (row.childElementCount - 1); i >= 0; i--) {
            let nextCell: Element = row.children[i];
            let nextCellCards: HTMLElement[] = [].slice.call(nextCell.querySelectorAll('.' + cls.CARD_CLASS));
            if (nextCellCards.length > 0) {
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, false);
                break;
            }
        }
    }

    private processCards(isSame: boolean, nextCellCards: HTMLElement[], curIndex: number, action: string): void {
        if (isSame) {
            let isShift: boolean = ((action === 'multiSelectionByRightArrow' || action === 'multiSelectionByLeftArrow')
                && this.parent.cardSettings.selectionType === 'Multiple');
            let processCard: HTMLElement = nextCellCards[curIndex] || nextCellCards.slice(-1)[0];
            this.parent.actionModule.cardSelection(processCard, false, isShift);
        }
    }

    private processEnter(e: Event, selectedCard: Element): void {
        let element: Element = (e.target) as HTMLElement;
        if (element.classList.contains(cls.HEADER_ICON_CLASS)) {
            this.parent.actionModule.columnExpandCollapse(e);
        }
        if (element.classList.contains(cls.SWIMLANE_ROW_EXPAND_CLASS) || element.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS)) {
            this.parent.actionModule.rowExpandCollapse(e);
        }
        if (selectedCard) {
            this.parent.actionModule.cardClick(e as KeyboardEvent, selectedCard as HTMLElement);
        }
    }

    private processTab(action: string, selectedCard: Element): void {
        if (selectedCard) {
            let target: HTMLElement = closest(selectedCard, '.' + cls.CONTENT_ROW_CLASS) as HTMLElement;
            let tabTarget: Element = action === 'tab' ? target.previousElementSibling : target.nextElementSibling;
            if (tabTarget) {
                (tabTarget.querySelector(`.${cls.SWIMLANE_ROW_COLLAPSE_CLASS},.${cls.SWIMLANE_ROW_EXPAND_CLASS}`) as HTMLElement).focus();
            }
            removeClass([selectedCard], cls.CARD_SELECTION_CLASS);
            this.parent.layoutModule.disableAttributeSelection(selectedCard);
        }
    }

    private processMoveCards(action: string, card: Element): void {
        let nextCell: Element;
        let nextCellCards: HTMLElement[];
        let curCell: HTMLTableCellElement = closest(card, '.' + cls.CONTENT_CELLS_CLASS) as HTMLTableCellElement;
        let curCellCards: HTMLElement[] = [].slice.call(curCell.querySelectorAll('.' + cls.CARD_CLASS));
        let curRow: HTMLTableRowElement = closest(curCell, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
        let curIndex: number = this.getCardId(curCellCards).indexOf(card.getAttribute('data-id'));
        if (action === 'rightArrow' || action === 'multiSelectionByRightArrow') {
            if (curCell.cellIndex === (curRow.childElementCount - 1) && this.parent.swimlaneSettings.keyField
                && action !== 'multiSelectionByRightArrow') {
                if (curIndex < (this.getCardId(curCellCards).length - 1)) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.nextElementSibling, false, false);
                } else if (curRow.rowIndex !== (this.parent.element.querySelectorAll('.' + cls.CONTENT_ROW_CLASS).length - 1)) {
                    let row: Element = this.parent.element.querySelector(`.${cls.CONTENT_ROW_CLASS}:nth-child(${curRow.rowIndex + 3})`);
                    this.processNextRow(row);
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
                this.processCards(isSame, nextCellCards, curIndex, action);
            }
        } else {
            if (curCell.cellIndex === 0 && this.parent.swimlaneSettings.keyField && action !== 'multiSelectionByLeftArrow') {
                if (curIndex > 0) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.previousElementSibling, false, false);
                } else if (curRow.rowIndex > 1) {
                    let className: string = `.${cls.CONTENT_ROW_CLASS}:nth-child(${curRow.rowIndex - 1}):not(.${cls.COLLAPSED_CLASS})`;
                    let targetRow: Element = this.parent.element.querySelector(className);
                    if (targetRow) {
                        this.processPreviousRow(targetRow);
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
                        let row: Element = this.parent.element.querySelector(`.${cls.CONTENT_ROW_CLASS}:nth-child(${curRow.rowIndex - 1})`);
                        this.processPreviousRow(row);
                    }
                }
                this.processCards(isSame, nextCellCards, curIndex, action);
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
