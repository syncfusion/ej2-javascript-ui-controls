import {
    Draggable, formatUnit, createElement, isNullOrUndefined, addClass, closest,
    MouseEventArgs, removeClass, classList, remove, BlazorDragEventArgs
} from '@syncfusion/ej2-base';
import { SfKanban } from './kanban';
import { DragArgs, DragEdges } from './interface';
import * as cls from './constant';

/**
 * Drag and Drop module
 */
export class DragAndDrop {
    private parent: SfKanban;
    private dragObj: DragArgs;
    public isDragging: Boolean;
    private dragEdges: DragEdges;

    constructor(parent: SfKanban) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null, instance: null, targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.isDragging = false;
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
    }

    public wireDragEvents(element: HTMLElement): void {
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
        let cloneContainer: Node = this.dragObj.element.cloneNode(true);
        this.dragObj.cloneElement = cloneContainer as HTMLElement;
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
        let selector: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS
                                + '.' + cls.DROPPABLE_CLASS;
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
            } else if (keys.length > 1 && contentCell.classList.contains(cls.DROPPING_CLASS)) {
                this.multiCloneCreate(keys, contentCell);
            }
        }
        if (this.parent.element.querySelectorAll('.' + cls.DROPPING_CLASS).length === 0) {
            this.cellDropping();
        }
        let multiKeyTarget: Element = closest(target, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            let columnKeys: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS + ':not(.' +
                cls.DISABLED_CLASS + ')')).filter((element: Element) => this.getColumnKey(element) === this.getColumnKey(multiKeyTarget));
            if (columnKeys.length > 0) {
                addClass(columnKeys, cls.MULTI_ACTIVE_CLASS);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = (contentCell && contentCell.classList.contains(cls.DROPPING_CLASS)) ? '' : 'not-allowed';
        if (cardElement && !(closest(cardElement, '.' + cls.CONTENT_CELLS_CLASS)).classList.contains(cls.DROPPING_CLASS)) {
            cardElement.style.cursor = 'not-allowed';
            document.body.style.cursor = 'not-allowed';
        }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone);
            this.multiCloneRemove();
        }
        this.updateScrollPosition(e);
    }
    private dragStop(e: MouseEvent): void {
        let contentCell: Element = closest(this.dragObj.targetClone, '.' + cls.CONTENT_CELLS_CLASS);
        let columnKey: Element;
        let dropIndex: number = 0;
        if (this.dragObj.targetClone.parentElement) {
            let className: string = '.' + cls.CARD_CLASS + ':not(.' + cls.DRAGGED_CARD_CLASS + '),.' + cls.DROPPED_CLONE_CLASS;
            let element: HTMLElement[] = [].slice.call(this.dragObj.targetClone.parentElement.querySelectorAll(className));
            dropIndex = element.indexOf(this.dragObj.targetClone);
        }
        if (this.parent.element.querySelector('.' + cls.TARGET_MULTI_CLONE_CLASS)) {
            columnKey = closest(e.target as HTMLElement, '.' + cls.MULTI_COLUMN_KEY_CLASS + ':not(.' + cls.DISABLED_CLASS + ')');
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
        let styleCards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[style]'));
        styleCards.forEach((styleCard: HTMLElement) => { styleCard.style.cursor = ''; });
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
            let dragCell: HTMLTableCellElement = <HTMLTableCellElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS);
            let transition: string[] = this.parent.transition[dragCell.cellIndex].transitionColumn;
            let allowTransition: boolean = this.allowedTransition(this.dragObj.element.getAttribute('data-key'), key, transition);
            let name: string = allowTransition ? '' : ' ' + cls.DISABLED_CLASS;
            let colKey: HTMLElement = createElement('div', { className: cls.MULTI_COLUMN_KEY_CLASS + name,
                    attrs: { 'data-key': key.trim() } });
            let text: HTMLElement = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.cursor = allowTransition ? '' : 'not-allowed';
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    }

    private allowedTransition(currentCardKey: string, targetCardKey: string, allowedKey: string[]): boolean {
        let allowTransition: boolean = true;
        let targetKey: string[] = targetCardKey.split(',');
        for (let i: number = 0; i < targetKey.length; i++) {
            if (currentCardKey === targetKey[i].trim()) {
                return true;
            }
            if (allowedKey) {
                if (allowedKey.length === 1 && allowedKey[0].length === 0) {
                    return true;
                }
                for (let j: number = 0; j < allowedKey.length; j++) {
                    if (targetKey[i].trim() === allowedKey[j].trim()) {
                        return true;
                    } else {
                        allowTransition = false;
                    }
                }
            }
        }
        return allowTransition;
    }

    private cellDropping(): void {
        let dragCell: HTMLTableCellElement = (<HTMLTableCellElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS));
        let dragRow: HTMLTableRowElement = (<HTMLTableRowElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_ROW_CLASS));
        this.addDropping(dragRow, dragCell);
        if (dragCell && dragCell.classList.contains(cls.DROP_CLASS)) {
            addClass([dragCell], cls.DROPPING_CLASS);
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + '):not(.' + cls.COLLAPSED_CLASS + ')';
            let rows: HTMLTableRowElement[] = [].slice.call(this.parent.element.querySelectorAll(className));
            [].slice.call(rows).forEach((row: HTMLTableRowElement) => {
                if (dragRow !== row) {
                    this.addDropping(row, dragCell);
                }
            });
        }
    }

    private addDropping(dragRow: HTMLTableRowElement, dragCell: HTMLTableCellElement): void {
        if (dragCell && dragRow) {
            [].slice.call(dragRow.children).forEach((cell: Element) => {
                let transition: string[] = this.parent.transition[dragCell.cellIndex].transitionColumn;
                if (cell !== dragCell && cell.classList.contains(cls.DROP_CLASS) &&
                    this.allowedTransition(dragCell.getAttribute('data-key'), cell.getAttribute('data-key'), transition)) {
                        addClass([cell], cls.DROPPING_CLASS);
                }
            });
        }
    }

    private updateScrollPosition(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(() => { this.autoScroll(); }, 100);
        }
    }

    private autoScrollValidation(): void {
        let pageY: number = this.dragObj.pageY;
        let pageX: number = this.dragObj.pageX;
        let autoScrollDistance: number = 30;
        let dragEdges: DragEdges = { left: false, right: false, top: false, bottom: false };
        let viewBoundaries: ClientRect = this.parent.element.querySelector('.' + cls.CONTENT_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            dragEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            dragEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            dragEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            dragEdges.right = true;
        }
        this.dragEdges = dragEdges;
    }

    private autoScroll(): void {
        this.autoScrollValidation();
        let scrollSensitivity: number = 30;
        if (this.parent.isAdaptive) {
            let parent: HTMLElement;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent = closest(this.dragObj.targetClone as HTMLElement, '.' + cls.CARD_CONTAINER_CLASS) as HTMLElement;
                } else {
                    parent = closest(this.dragObj.draggedClone as HTMLElement, '.' + cls.CARD_CONTAINER_CLASS) as HTMLElement;
                }
            } else if (this.dragEdges.right || this.dragEdges.left) {
                parent = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            }
            if (parent) {
                let yIsScrollable: boolean = parent.offsetHeight <= parent.scrollHeight;
                let xIsScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
                let yInBounds: boolean = parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
                let xInBounds: boolean = parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
                if (yIsScrollable && yInBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                    parent.scrollTop += this.dragEdges.top ? -(scrollSensitivity + 36) : scrollSensitivity;
                }
                if (xIsScrollable && xInBounds && (this.dragEdges.left || this.dragEdges.right)) {
                    let scroll: boolean;
                    scroll = (this.getWidth() * (this.parent.element.querySelector('.' + cls.CONTENT_ROW_CLASS + ':not(.'+ cls.SWIMLANE_ROW_CLASS + ')').childElementCount - 1)) > parent.scrollLeft;
                    if (scroll || this.dragEdges.left) {
                        parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                    }
                }
            }
        } else {
            let parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            let column: HTMLElement = this.dragObj.targetClone.parentElement;
            let yScrollable: boolean = parent.offsetHeight <= parent.scrollHeight;
            let xScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
            let yBounds: boolean = yScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
            let xBounds: boolean = xScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
            if (yBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                parent.scrollTop += this.dragEdges.top ? -scrollSensitivity : scrollSensitivity;
                if (column) {
                    column.scrollTop += this.dragEdges.top ? -scrollSensitivity : scrollSensitivity;
                }
            }
            if (xBounds && (this.dragEdges.left || this.dragEdges.right)) {
                parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                if (column) {
                    column.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                }
            }
            if (this.dragObj.pageY - window.scrollY < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY - scrollSensitivity);
            } else if (window.innerHeight - (this.dragObj.pageY - window.scrollY) < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY + scrollSensitivity);
            }
        }
    }
    private getWidth(): number {
        return (window.innerWidth * 80) / 100;
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
