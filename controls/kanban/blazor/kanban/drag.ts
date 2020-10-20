import {
    Draggable, formatUnit, createElement, isNullOrUndefined, addClass, closest,
    MouseEventArgs, removeClass, classList, remove, BlazorDragEventArgs
} from '@syncfusion/ej2-base';
import { SfKanban } from './kanban';
import { DragArgs } from './interface';
import * as cls from './constant';

/**
 * Drag and Drop module
 */
export class DragAndDrop {
    private parent: SfKanban;
    private dragObj: DragArgs;
    public isDragging: Boolean;

    constructor(parent: SfKanban) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null, instance: null, targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.isDragging = false;
        this.wireDragEvents(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
    }

    private wireDragEvents(element: HTMLElement): void {
        this.dragObj.instance = new Draggable(element, {
            clone: true,
            enableTapHold: this.parent.isAdaptive as boolean,
            enableTailMode: true,
            cursorAt: { top: -10, left: -10 },
            dragArea: element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
        });
    }

    private dragHelper(e: { [key: string]: MouseEventArgs }): HTMLElement {
        this.dragObj.element = closest(e.sender.target as Element, '.' + cls.CARD_CLASS) as HTMLElement;
        if (isNullOrUndefined(this.dragObj.element)) { return null; }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        let cloneContainer: HTMLElement = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneContainer.children.item(0) as HTMLElement;
        addClass([this.dragObj.cloneElement], cls.CLONED_CARD_CLASS);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: cls.TARGET_MULTI_CLONE_CLASS });
        this.dragObj.targetClone = createElement('div', {
            className: cls.DROPPED_CLONE_CLASS,
            styles: 'width:100%;height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        this.dragObj.modifiedData = [];
        return this.dragObj.cloneElement;
    }

    private dragStart(e: MouseEvent & TouchEvent & BlazorDragEventArgs): void {
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
            let className: string = '.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS + ':not(.' + cls.CLONED_CARD_CLASS + ')';
            let closestEle: Element = closest(this.dragObj.element, '.' + cls.CONTENT_ROW_CLASS);
            this.dragObj.selectedCards = [].slice.call(closestEle.querySelectorAll(className)) as HTMLElement[];
        }
        let cardId: string[] = [];
        if (this.dragObj.selectedCards instanceof HTMLElement) {
            let card = (<HTMLElement>this.dragObj.selectedCards).getAttribute('data-id');
            cardId.push(card);
        } else {
            this.dragObj.selectedCards.forEach((element: HTMLElement) => {
                cardId.push(element.getAttribute('data-id'));
            });
        }
        this.parent.dotNetRef.invokeMethodAsync('DragStart', cardId, "DragStart");
        e.bindEvents(e.dragElement);
        if (this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
            (<HTMLElement[]>this.dragObj.selectedCards).forEach((element: HTMLElement) => { this.draggedClone(element); });
            if ((<HTMLElement[]>this.dragObj.selectedCards).length > 1) {
                this.dragObj.cloneElement.innerHTML = '';
                let drag: Element = createElement('div', {
                    className: 'e-multi-card-text',
                    innerHTML: (<HTMLElement[]>this.dragObj.selectedCards).length + ' Cards',
                });
                this.dragObj.cloneElement.appendChild(drag);
                classList(this.dragObj.cloneElement, ['e-multi-card-clone'], [cls.CARD_SELECTION_CLASS]);
                this.dragObj.cloneElement.style.width = '90px';
            }
        } else {
            this.draggedClone(this.dragObj.element);
        }
    }

    private drag(e: MouseEvent & TouchEvent): void {
        if (!e.target) {
            return;
        }
        let cardElement: HTMLElement = closest(e.target as HTMLElement, '.' + cls.CARD_CLASS) as HTMLElement;
        let target: HTMLElement = cardElement || e.target as HTMLElement;
        let selector: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS;
        let contentCell: HTMLElement = closest(target, selector) as HTMLElement;
        this.calculateArgs(e);
        if (contentCell) {
            let targetKey: string = this.getColumnKey(contentCell);
            let keys: string[] = targetKey.split(',');
            this.multiCloneRemove();
            let isDrag: boolean = (targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS)))
                ? true : false;
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(cls.CARD_CLASS) || target.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
                    let element: Element = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ?
                        (target.previousElementSibling.classList.contains(cls.DRAGGED_CARD_CLASS) ? null : target.previousElementSibling)
                        : target.previousElementSibling;
                    let insertClone: InsertPosition = 'afterend';
                    if (isNullOrUndefined(element)) {
                        let pageY: number = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? (this.dragObj.pageY / 2) :
                            this.dragObj.pageY;
                        let height: number = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? target.offsetHeight :
                            (target.offsetHeight / 2);
                        if ((pageY - (this.parent.element.getBoundingClientRect().top + target.offsetTop)) < height) {
                            insertClone = 'beforebegin';
                        }
                    }
                    target.insertAdjacentElement(insertClone, this.dragObj.targetClone);
                } else if (target.classList.contains(cls.CONTENT_CELLS_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)) {
                    target.querySelector('.' + cls.CARD_CONTAINER_CLASS).appendChild(this.dragObj.targetClone);
                } else if (target.classList.contains(cls.CARD_CONTAINER_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + cls.CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                }
            } else if (keys.length > 1) {
                this.multiCloneCreate(keys, contentCell);
            }
        }
        this.addDropping();
        let multiKeyTarget: Element = closest(target, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            let columnKeys: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS)).filter(
                (element: Element) => this.getColumnKey(element) === this.getColumnKey(multiKeyTarget));
            if (columnKeys.length > 0) {
                addClass(columnKeys, cls.MULTI_ACTIVE_CLASS);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = contentCell ? (contentCell.classList.contains('e-collapsed') ? 'not-allowed' : '') : 'not-allowed';
         if (this.parent.swimlaneSettings.keyField && !this.parent.swimlaneSettings.allowDragAndDrop) {
             let dragElement: HTMLTableRowElement = closest(this.dragObj.element, '.' + cls.CONTENT_ROW_CLASS) as HTMLTableRowElement;
             let classSelector: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
             let dropElement: HTMLTableRowElement = closest(target, classSelector) as HTMLTableRowElement;
             if (dragElement && dropElement) {
                 if (dragElement.rowIndex !== dropElement.rowIndex) {
                     document.body.style.cursor = 'not-allowed';
                 }
             }
         }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone); this.multiCloneRemove();
        }
    }
    private dragStop(e: MouseEvent): void {
        let contentCell: Element = closest(this.dragObj.targetClone, '.' + cls.CONTENT_CELLS_CLASS);
        let columnKey: Element;
        let dropIndex: number;
        if (this.dragObj.targetClone.parentElement) {
            dropIndex = [].slice.call(this.dragObj.targetClone.parentElement.children).indexOf(this.dragObj.targetClone);
        }
        if (this.parent.element.querySelector('.' + cls.TARGET_MULTI_CLONE_CLASS)) {
            columnKey = closest(e.target as HTMLElement, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        }
        if (contentCell || columnKey) {
            let cardStatus: string;
            if (contentCell) {
                cardStatus = this.getColumnKey(contentCell);
            } else {
                cardStatus = this.getColumnKey(columnKey);
                contentCell = closest(columnKey, '.' + cls.CONTENT_CELLS_CLASS);
            }
            let swimData: string;
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
                let prev: Element = closest(contentCell, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
                swimData = this.getColumnKey(prev);
            }
            let cardId: string[] = [];
            if (this.dragObj.selectedCards instanceof HTMLElement) {
                let card = (<HTMLElement>this.dragObj.selectedCards).getAttribute('data-id');
                cardId.push(card);
            } else {
                this.dragObj.selectedCards.forEach((element: HTMLElement) => {
                    cardId.push(element.getAttribute('data-id'));
                });
            }
            this.parent.dotNetRef.invokeMethodAsync('DragStop', cardId, cardStatus, swimData, dropIndex);
        }
        this.removeElement(this.dragObj.draggedClone);
        this.removeElement(this.dragObj.targetClone);
        this.removeElement(this.dragObj.cloneElement);
        let dragMultiClone: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.DRAGGED_CLONE_CLASS));
        dragMultiClone.forEach((clone: HTMLElement) => remove(clone));
        this.dragObj.element.style.removeProperty('width');
        this.multiCloneRemove();
        removeClass([this.dragObj.element], cls.DRAGGED_CARD_CLASS);
        clearInterval(this.dragObj.navigationInterval);
        this.dragObj.navigationInterval = null;
        if (document.body.style.cursor === 'not-allowed') {
            document.body.style.cursor = '';
        }
        let className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
        let cells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
        cells.forEach((cell: Element) => removeClass([cell], cls.DROPPING_CLASS));
        this.dragObj.cardDetails = this.dragObj.modifiedData = [];
        this.isDragging = false;
    }

    private draggedClone(element: HTMLElement): void {
        this.dragObj.draggedClone = createElement('div', {
            className: cls.DRAGGED_CLONE_CLASS,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], cls.DRAGGED_CARD_CLASS);
    }

    private calculateArgs(e: MouseEvent & TouchEvent): void {
        let eventArgs: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
    }

    private getPageCoordinates(e: MouseEvent & TouchEvent): (MouseEvent & TouchEvent) | Touch {
        let eventArgs: TouchEvent = (e as { [key: string]: Object } & MouseEvent & TouchEvent).event as TouchEvent;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            (<MouseEvent & TouchEvent>eventArgs) || e;
    }

    private getColumnKey(target: HTMLElement | Element): string {
        if (target && target.getAttribute('data-key')) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    }

    private multiCloneRemove(): void {
        let cloneMulti: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.TARGET_MULTI_CLONE_CLASS));
        if (cloneMulti.length > 0) {
            let columnKey: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS));
            columnKey.forEach((node: Element) => remove(node));
            cloneMulti.forEach((node: HTMLElement) => {
                let cell: HTMLElement = closest(node, '.' + cls.CONTENT_CELLS_CLASS) as HTMLElement;
                if (cell) {
                    cell.style.borderStyle = '';
                    if (cell.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
                        removeClass([cell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_CONTAINER_CLASS);
                    }
                    removeClass([cell.querySelector('.' + cls.CARD_CONTAINER_CLASS)], cls.MULTI_CARD_CONTAINER_CLASS);
                }
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    }

    private removeElement(element: HTMLElement): void {
        if (this.parent.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    }

    private multiCloneCreate(keys: string[], contentCell: HTMLElement): void {
        let offsetHeight: number = contentCell.offsetHeight;
        let limitEle: HTMLElement = contentCell.querySelector('.' + cls.LIMITS_CLASS) as HTMLElement;
        if (limitEle) {
            offsetHeight -= limitEle.offsetHeight;
        }
        this.dragObj.targetCloneMulti.style.height = formatUnit(offsetHeight);
        if (contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
            addClass([contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_CONTAINER_CLASS);
        }
        addClass([contentCell.querySelector('.' + cls.CARD_CONTAINER_CLASS)], cls.MULTI_CARD_CONTAINER_CLASS);
        (contentCell.querySelector('.' + cls.CARD_CONTAINER_CLASS) as HTMLElement).style.height = 'auto';
        contentCell.style.borderStyle = 'none';
        this.removeElement(this.dragObj.targetClone);
        for (let key of keys) {
            let colKey: HTMLElement = createElement('div', {
                className: cls.MULTI_COLUMN_KEY_CLASS,
                attrs: { 'data-key': key.trim() }
            });
            let text: HTMLElement = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    }

    private addDropping(): void {
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + '):not(.' + cls.COLLAPSED_CLASS + ')';
            let cells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
            cells.forEach((cell: Element) => addClass([cell], cls.DROPPING_CLASS));
        } else {
            let row: Element = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_ROW_CLASS);
            if (row) {
                [].slice.call(row.children).forEach((cell: Element) => addClass([cell], cls.DROPPING_CLASS));
            }
        }
        let cell: Element = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS);
        if (cell) {
            removeClass([cell], cls.DROPPING_CLASS);
        }
    }

    private unWireDragEvents(): void {
        if (this.dragObj.instance && !this.dragObj.instance.isDestroyed) {
            this.dragObj.instance.destroy();
        }
    }

    public destroy(): void {
        this.unWireDragEvents();
    }
}
