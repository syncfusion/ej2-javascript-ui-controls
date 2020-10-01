import { KeyboardEvents, KeyboardEventArgs, addClass, removeClass, closest } from '@syncfusion/ej2-base';
import { SfKanban } from './kanban';
import * as cls from './constant';

/**
 * Keyboard interaction module
 */
export class Keyboard {
    private parent: SfKanban;
    private keyboardModule: KeyboardEvents;
    private multiSelection: boolean;
    private keyConfigs: { [key: string]: string } = {
        firstCardSelection: '36',
        lastCardSelection: '35',
        upArrow: '38',
        downArrow: '40',
        rightArrow: '39',
        leftArrow: '37',
        multiSelectionEnter: 'ctrl+13',
        multiSelectionSpace: 'ctrl+32',
        multiSelectionByUpArrow: 'shift+38',
        multiSelectionByDownArrow: 'shift+40',
        shiftTab: 'shift+tab',
        enter: '13',
        tab: 'tab',
        delete: '46',
        escape: '27',
        space: '32'
    };

    constructor(parent: SfKanban) {
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        this.multiSelection = false;
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
                this.processLeftRightArrow(e);
                break;
            case 'firstCardSelection':
            case 'lastCardSelection':
                this.processCardSelection(e.action, selectedCard);
                break;
            case 'multiSelectionEnter':
            case 'multiSelectionSpace':
                if (document.activeElement) {
                    this.parent.cardSelection(document.activeElement, true, false);
                }
                break;
            case 'space':
            case 'enter':
                this.processEnter(e, selectedCard);
                break;
            case 'escape':
                if (document.activeElement.classList.contains(cls.CARD_CLASS) ||
                    document.activeElement.classList.contains(cls.SHOW_ADD_BUTTON)) {
                    if (document.activeElement.classList.contains(cls.CARD_SELECTION_CLASS)) {
                        removeClass([document.activeElement], cls.CARD_SELECTION_CLASS);
                        (document.activeElement as HTMLElement).focus();
                    } else {
                        let ele: Element = closest(document.activeElement, '.' + cls.CONTENT_CELLS_CLASS);
                        let cards: HTMLElement[] = [].slice.call(ele.querySelectorAll('.' + cls.CARD_CLASS));
                        removeClass(cards, cls.CARD_SELECTION_CLASS);
                        (ele as HTMLElement).focus();
                        this.cardTabIndexRemove();
                        this.addRemoveTabIndex('Add');
                    }
                }
                break;
            case 'tab':
            case 'shiftTab':
                let contentCell: Element = closest(document.activeElement, '.' + cls.CONTENT_CELLS_CLASS);
                if (document.activeElement.classList.contains(cls.CARD_CLASS)) {
                    if (!document.activeElement.nextElementSibling && e.action === 'tab') {
                        e.preventDefault();
                    }
                    if (!document.activeElement.previousElementSibling && contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)
                        && e.action === 'tab') {
                        addClass([contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.SHOW_ADD_FOCUS);
                    }
                }
                if (document.activeElement.classList.contains(cls.SHOW_ADD_BUTTON)) {
                    if ((!contentCell.querySelector('.' + cls.CARD_CLASS) && e.action === 'tab') || e.action === 'shiftTab') {
                        e.preventDefault();
                    }
                }
                if (document.activeElement.classList.contains(cls.ROOT_CLASS)) {
                    this.cardTabIndexRemove();
                    this.addRemoveTabIndex('Add');
                }
                break;
            case 'delete':
                break;
        }
    }

    private processCardSelection(action: string, selectedCard: Element): void {
        if (selectedCard) {
            removeClass([selectedCard], cls.CARD_SELECTION_CLASS);
            this.parent.disableAttributeSelection(selectedCard);
            let selection: string[] = this.parent.selectionArray;
            selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
        }
        this.cardTabIndexRemove();
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS));
        let element: Element = action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
        this.parent.cardSelection(element, false, false);
        this.addRemoveTabIndex('Remove');
        (element as HTMLElement).focus();
        let card: HTMLElement[] = [].slice.call(closest(element, '.' + cls.CONTENT_CELLS_CLASS).querySelectorAll('.' + cls.CARD_CLASS));
        card.forEach((element: HTMLElement) => { element.setAttribute('tabindex', '0'); });
    }

    private processLeftRightArrow(e: KeyboardEventArgs): void {
        if (document.activeElement.classList.contains(cls.CONTENT_CELLS_CLASS)) {
            if (e.action === 'rightArrow' && document.activeElement.nextElementSibling) {
                (document.activeElement.nextElementSibling as HTMLElement).focus();
            } else if (e.action === 'leftArrow' && document.activeElement.previousElementSibling) {
                (document.activeElement.previousElementSibling as HTMLElement).focus();
            }
        }
    }

    private processUpDownArrow(action: string, selectedCard: Element): void {
        if (action === 'upArrow' && document.activeElement) {
            if (document.activeElement.classList.contains(cls.CARD_CLASS) && document.activeElement.previousElementSibling) {
                (document.activeElement.previousElementSibling as HTMLElement).focus();
            } else if (document.activeElement.classList.contains(cls.SHOW_ADD_BUTTON)) {
                document.activeElement.setAttribute('tabindex', '-1');
                removeClass([document.activeElement], cls.SHOW_ADD_FOCUS);
                let cell: Element = closest(document.activeElement, '.' + cls.CONTENT_CELLS_CLASS);
                if (cell.querySelectorAll('.' + cls.CARD_CLASS).length > 0) {
                    ([].slice.call(cell.querySelectorAll('.' + cls.CARD_CLASS)) as HTMLElement[]).slice(-1)[0].focus();
                }
            }
            this.removeSelection();
        } else if (action === 'downArrow' && document.activeElement &&
            document.activeElement.classList.contains(cls.CARD_CLASS)) {
            if (document.activeElement.nextElementSibling) {
                (document.activeElement.nextElementSibling as HTMLElement).focus();
            } else if (closest(document.activeElement, '.' + cls.CARD_CONTAINER_CLASS).nextElementSibling) {
                let ele: Element = closest(document.activeElement, '.' + cls.CARD_CONTAINER_CLASS).nextElementSibling;
                ele.setAttribute('tabindex', '0');
                addClass([ele], cls.SHOW_ADD_FOCUS);
                (ele as HTMLElement).focus();
            }
            this.removeSelection();
        }
        if ((action === 'multiSelectionByUpArrow' || action === 'multiSelectionByDownArrow')
            && selectedCard && this.parent.cardSettings.selectionType === 'Multiple') {
            let card: Element;
            if (action === 'multiSelectionByUpArrow') {
                card = document.activeElement.previousElementSibling;
            } else {
                card = document.activeElement.nextElementSibling;
            }
            if (card) {
                this.parent.cardSelection(card, false, true);
                (card as HTMLElement).focus();
                this.multiSelection = true;
            }
        }
    }

    private removeSelection(): void {
        if (this.multiSelection) {
            let cards: HTMLElement[] = this.parent.getSelectedCards();
            if (cards.length > 0) {
                removeClass(cards, cls.CARD_SELECTION_CLASS);
                this.parent.disableAttributeSelection(cards);
            }
            this.multiSelection = false;
        }
    }

    public cardTabIndexRemove(): void {
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS));
        cards.forEach((card: HTMLElement) => { card.setAttribute('tabindex', '-1'); });
        let addButton: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.SHOW_ADD_BUTTON));
        addButton.forEach((add: HTMLElement) => {
            add.setAttribute('tabindex', '-1');
            removeClass([add], cls.SHOW_ADD_FOCUS);
        });
    }

    private processEnter(e: Event, selectedCard: Element): void {
        let element: HTMLElement = (e.target) as HTMLElement;
        if (element.classList.contains(cls.HEADER_ICON_CLASS)) {
            element.click();
        }
        if (element.classList.contains(cls.SWIMLANE_ROW_EXPAND_CLASS) || element.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS)) {
            element.click();
        }
        if (document.activeElement.classList.contains(cls.CARD_CLASS)) {
            this.parent.cardSelection(document.activeElement, false, false);
        }
        if (document.activeElement.classList.contains(cls.SHOW_ADD_BUTTON)) {
            (document.activeElement as HTMLElement).focus();
        }
        if (element.classList.contains(cls.CONTENT_CELLS_CLASS)) {
            let cards: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + cls.CARD_CLASS));
            this.addRemoveTabIndex('Remove');
            if (cards.length > 0) {
                (element.querySelector('.' + cls.CARD_CLASS) as HTMLElement).focus();
                cards.forEach((element: HTMLElement) => { element.setAttribute('tabindex', '0'); });
            }
            if (element.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
                element.querySelector('.' + cls.SHOW_ADD_BUTTON).setAttribute('tabindex', '0');
                (element.querySelector('.' + cls.SHOW_ADD_BUTTON) as HTMLElement).focus();
            }
        }
        if (selectedCard === document.activeElement && this.parent.element.querySelectorAll('.' + cls.CARD_SELECTION_CLASS).length === 1) {
            (selectedCard as HTMLElement).focus();
        }
    }

    public addRemoveTabIndex(action: string): void {
        let attribute: string = action === 'Add' ? '0' : '-1';
        let headerIcon: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.HEADER_ICON_CLASS));
        if (headerIcon.length > 0) {
            headerIcon.forEach((element: HTMLElement) => { element.setAttribute('tabindex', attribute); });
        }
        let swimlaneIcon: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.SWIMLANE_ROW_EXPAND_CLASS));
        if (swimlaneIcon.length > 0) {
            swimlaneIcon.forEach((element: HTMLElement) => { element.setAttribute('tabindex', attribute); });
        }
        let className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS;
        let contentCell: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className));
        contentCell.forEach((element: HTMLElement) => { element.setAttribute('tabindex', attribute); });
    }

    public destroy(): void {
        this.keyboardModule.destroy();
    }
}