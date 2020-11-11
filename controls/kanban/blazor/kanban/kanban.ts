import {
    BlazorDotnetObject, extend, addClass, closest, setStyleAttribute, isNullOrUndefined, removeClass, formatUnit, EventHandler, Browser, MouseEventArgs
} from '@syncfusion/ej2-base';
import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { DragAndDrop } from './drag';
import { Keyboard } from './keyboard';
import { KanbanTouch } from './touch';
import { BlazorKanbanElement, ScrollPosition, ScrollOffset } from './interface';
import * as cls from './constant';

/**
 * kanban base
 */

export class SfKanban {
    public element: BlazorKanbanElement;
    public dotNetRef: BlazorDotnetObject;
    public kanbanObj: { [key: string]: Object };
    public isAdaptive: Boolean;
    public dragAndDropModule: DragAndDrop;
    public keyboardModule: Keyboard;
    public columnToggleArray: string[];
    public selectionArray: string[];
    public lastCardSelection: Element;
    private lastSelectionRow: HTMLTableRowElement;
    private lastCard: Element;
    private selectedCardsElement: Element[];
    private selectedCardsData: Object[];
    public hideColumnKeys: string[];
    private touchModule: KanbanTouch;
    public scrollPosition: ScrollPosition;
    private allowDragAndDrop: boolean;
    private allowKeyboard: boolean;
    private enableRtl: boolean;
    private height: string;
    private width: string;
    public popupOverlay: HTMLElement;
    public treePopup: Popup;
    public swimlaneSettings: { [key: string]: Object };
    public cardSettings: { [key: string]: Object };

    constructor(element: BlazorKanbanElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
        this.scrollPosition = { content: {}, column: {} };
        this.initializeModules();
        this.scrollUiUpdate();
        this.wireEvents();
        if (this.element) {
            this.element.blazor__instance = this;
        }
    }

    private initializeModules(): void {
        if (this.isAdaptive || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
        if (this.allowDragAndDrop) {
            this.dragAndDropModule = new DragAndDrop(this);
        }
        if (this.allowKeyboard) {
            this.keyboardModule = new Keyboard(this);
        }
        this.scrollPosition.content = { left: 0, top: 0 };
        this.initializeSwimlaneTree();
    }

    private updateContext(kanbanObj: { [key: string]: Object }): void {
        extend(this, this, kanbanObj);
    }

    public getSelectedCards(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS));
    }

    public disableAttributeSelection(cards: HTMLElement[] | Element): void {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        } else {
            cards.forEach((card: HTMLElement) => { card.setAttribute('aria-selected', 'false'); });
        }
    }

    private initializeSwimlaneTree(): void {
        if (this.swimlaneSettings.keyField && this.isAdaptive) {
            let treeWrapper: HTMLElement;
            let height: number = (this.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS) as HTMLElement).offsetHeight;
            let treeHeight: number = window.innerHeight - height;
            this.popupOverlay = this.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS + ' .' + cls.SWIMLANE_OVERLAY_CLASS);
            setStyleAttribute(this.element.querySelector('.' + cls.SWIMLANE_OVERLAY_CLASS), { 'height': treeHeight + 'px' });
            setStyleAttribute(this.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS), { 'top': height + 'px' });
            treeWrapper = this.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS);
            setStyleAttribute(treeWrapper, { 'height': treeHeight + 'px' });
            let popupObj: PopupModel = {
                targetType: 'relative',
                actionOnScroll: 'none',
                enableRtl: this.enableRtl,
                zIndex: 10,
                hideAnimation: { name: 'SlideLeftOut', duration: 500 },
                showAnimation: { name: 'SlideLeftIn', duration: 500 },
                viewPortElement: this.element.querySelector('.' + cls.CONTENT_CLASS)
            };
            this.treePopup = new Popup(treeWrapper, popupObj);
        }
    }

    public cardSelection(target: Element, isCtrl: boolean, isShift: boolean): void {
        if (!target) {
            return;
        }
        let cards: HTMLElement[] = this.getSelectedCards();
        if (this.cardSettings.selectionType !== 'None') {
            let contentRow: HTMLTableRowElement = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
            let index: number = !isNullOrUndefined(this.lastSelectionRow) ? this.lastSelectionRow.rowIndex : contentRow.rowIndex;
            if (index !== contentRow.rowIndex && (isCtrl || isShift) && this.cardSettings.selectionType === 'Multiple') {
                return;
            }
            if (cards.length !== 0 && (!isCtrl || this.cardSettings.selectionType === 'Single')) {
                removeClass(cards, cls.CARD_SELECTION_CLASS);
                this.disableAttributeSelection(cards);
                cards.forEach((el: Element) => {
                    this.selectionArray.splice(this.selectionArray.indexOf(el.getAttribute('data-id')), 1);
                    this.selectedCardsElement.splice(this.selectedCardsElement.indexOf(el), 1);
                });
            }
            if (cards.length > 0 && isShift && this.cardSettings.selectionType === 'Multiple') {
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
                    addClass([card], cls.CARD_SELECTION_CLASS);
                    card.setAttribute('aria-selected', 'true');
                    card.setAttribute('tabindex', '0');
                    this.selectionArray.push(card.getAttribute('data-id'));
                    this.selectedCardsElement.push(card);
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
                this.lastCard = this.lastCardSelection = target;
                this.lastSelectionRow = closest(target, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
                if (this.lastSelectionRow.previousElementSibling) {
                    let elementSelector: string = `.${cls.SWIMLANE_ROW_EXPAND_CLASS},.${cls.SWIMLANE_ROW_COLLAPSE_CLASS}`;
                    let parentEle: HTMLElement = this.lastSelectionRow.previousElementSibling.querySelector(elementSelector);
                    if (parentEle && parentEle.classList.contains(cls.SWIMLANE_ROW_COLLAPSE_CLASS)) {
                        parentEle.click();
                    }
                }
            }
        }
    }

    private scrollUiUpdate(): void {
        let header: HTMLElement = this.element.querySelector('.' + cls.HEADER_CLASS);
        let content: HTMLElement = this.element.querySelector('.' + cls.CONTENT_CLASS);
        let height: number = this.element.offsetHeight - header.offsetHeight;
        if (this.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + cls.bottomSpace);
            let swimlaneToolbar: HTMLElement = this.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS) as HTMLElement;
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            let cardContainers: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardContainers.forEach((cell: HTMLElement) => {
                let cardContainer: HTMLElement = cell.querySelector('.' + cls.CARD_CONTAINER_CLASS);
                if (!cardContainer.classList.contains(cls.MULTI_CARD_CONTAINER_CLASS)) {
                    cardContainer.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', this.onAdaptiveScroll, this);
                }
            });
        }
        if (this.height !== 'auto' && this.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.children).forEach((node: HTMLElement) => {
            let paddingValue: number = 0;
            if ((content.offsetWidth - content.clientWidth) > 0) {
                paddingValue = 17;
                if ((content.offsetHeight - content.clientHeight) > 0) {
                    node.style.width = formatUnit(content.clientWidth);
                }
            }
            if (this.enableRtl) {
                node.style.paddingLeft = formatUnit(paddingValue);
            } else {
                node.style.paddingRight = formatUnit(paddingValue);
            }
        });
    }

    private onContentScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        let header: HTMLElement = this.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((node: HTMLElement) => { node.scrollLeft = target.scrollLeft; });
        this.scrollPosition.content = { left: target.scrollLeft, top: target.scrollTop };
    }

    private onColumnScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (target.offsetParent) {
            let columnKey: string = target.offsetParent.getAttribute('data-key');
            this.scrollPosition.column[columnKey] = { left: target.scrollLeft, top: target.scrollTop };
        }
    }

    private onAdaptiveScroll(e: Event): void {
        if (this.touchModule.tabHold && !this.touchModule.mobilePopup) {
            e.preventDefault();
        }
    }

    public updateScrollPosition(): void {
        let content: HTMLElement = this.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            content.scrollTo(this.scrollPosition.content.left, this.scrollPosition.content.top);
        }
        let cardContainer: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CONTAINER_CLASS));
        cardContainer.forEach((container: HTMLElement) => {
            if (container.offsetParent) {
                let scrollData: ScrollOffset = this.scrollPosition.column[container.offsetParent.getAttribute('data-key')];
                if (scrollData) {
                    container.scrollTo(scrollData.left, scrollData.top);
                }
            }
        });
    }

    private wireEvents(): void {
        let content: HTMLElement = this.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        let cardContainer: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CONTAINER_CLASS));
        cardContainer.forEach((container: HTMLElement) => {
            if (container.offsetParent) {
                this.scrollPosition.column[container.offsetParent.getAttribute('data-key')] = { left: 0, top: 0 };
            }
            EventHandler.add(container, 'scroll', this.onColumnScroll, this);
        });
    }

    private unWireEvents(): void {
        let content: HTMLElement = this.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.remove(content, 'scroll', this.onContentScroll);
        let cardContainer: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CONTAINER_CLASS));
        cardContainer.forEach((container: HTMLElement) => { EventHandler.remove(container, 'scroll', this.onColumnScroll); });
        if (this.isAdaptive) {
            let cardContainers: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardContainers.forEach((cell: HTMLElement) => { EventHandler.remove(cell, 'touchmove', this.onAdaptiveScroll); });
        }
    }
    public onCardClick(target: Element, e: MouseEventArgs): void {
        if (target.classList.contains(cls.CARD_SELECTION_CLASS)) {
            removeClass([target], cls.CARD_SELECTION_CLASS);
            this.disableAttributeSelection(target);
        } else {
            let isCtrlKey: boolean = e.ctrlKey;
            if (this.isAdaptive && this.touchModule) {
                isCtrlKey = (this.touchModule.mobilePopup && this.touchModule.tabHold) || isCtrlKey;
            }
            this.cardSelection(target, isCtrlKey, e.shiftKey);
        }
        if (this.isAdaptive && this.touchModule) {
            this.touchModule.updatePopupContent();
        }
        let cell: Element = closest(target, '.' + cls.CONTENT_CELLS_CLASS);
        if (this.allowKeyboard) {
            let element: HTMLElement[] = [].slice.call(cell.querySelectorAll('.' + cls.CARD_CLASS));
            element.forEach((e: HTMLElement): void => {
                e.setAttribute('tabindex', '0');
            });
            this.keyboardModule.addRemoveTabIndex('Remove');
        }
    }
    public onMenuClick(): void {
        if (this.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        } else {
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    }
    public onListViewClick(): void {
        this.treePopup.hide();
        removeClass([this.popupOverlay], 'e-enable');
    }
    public onPropertyChanged(props: string[]): void {
        for (let key of props) {
            switch (key) {
                case 'width':
                    this.setWidth();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'enableRtl':
                    this.enableRtl ? addClass([this.element], cls.CLS_RTL) : removeClass([this.element], cls.CLS_RTL);               
                    break;
            }
        }
    }

    public onSwimlaneProperties(isDrag: boolean, keyField: string): void {
        this.swimlaneSettings.allowDragAndDrop = isDrag;
        this.swimlaneSettings.keyField = keyField;
    }
    
    public setWidth(): void {
        if (this.width === '100%') {
            this.element.style.width = '';
        } else { setStyleAttribute(this.element, { 'width': formatUnit(this.width) }); }
    }
    public setHeight(): void {
        setStyleAttribute(this.element, { 'height': formatUnit(this.height) });
    }

    public destroy(): void {
        if (this.touchModule) {
            this.touchModule.destroy();
        }
        if (this.dragAndDropModule) {
            this.dragAndDropModule.destroy();
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        this.unWireEvents();
    }
}