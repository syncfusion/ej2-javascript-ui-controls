import { Draggable, formatUnit, createElement, isNullOrUndefined, addClass, closest, MouseEventArgs } from '@syncfusion/ej2-base';
import { removeClass, classList, remove, BlazorDragEventArgs, Browser, EventHandler } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { DragArgs, EJ2Instance, DragEdges, DragEventArgs } from '../base/interface';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
export class DragAndDrop {
    private parent: Kanban;
    private dragObj: DragArgs;
    private dragEdges: DragEdges;
    public isDragging: Boolean;
    /**
     * Constructor for drag and drop module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null, instance: null,
            targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
        this.isDragging = false;
    }

    public wireDragEvents(element: HTMLElement): void {
        this.dragObj.instance = new Draggable(element, {
            clone: true,
            enableTapHold: this.parent.isAdaptive as boolean,
            enableTailMode: true,
            cursorAt: { top: -10, left: -10 },
            dragArea: this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
        });
        if (!(this.dragObj.instance.enableTapHold && Browser.isDevice && Browser.isTouch)) {
            // tslint:disable-next-line:no-any
            EventHandler.remove(element, 'touchstart', (this.dragObj.instance as any).initialize);
        }
    }

    private dragHelper(e: { [key: string]: MouseEventArgs }): HTMLElement {
        if (this.parent.isAdaptive && this.parent.touchModule.mobilePopup &&
            this.parent.touchModule.mobilePopup.element.classList.contains(cls.POPUP_OPEN_CLASS)) {
            this.parent.touchModule.mobilePopup.hide();
        }
        this.dragObj.element = closest(e.sender.target as Element, '.' + cls.CARD_CLASS) as HTMLElement;
        if (isNullOrUndefined(this.dragObj.element)) { return null; }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        let cloneWrapper: HTMLElement = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.children.item(0) as HTMLElement;
        addClass([this.dragObj.cloneElement], cls.CLONED_CARD_CLASS);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: cls.TARGET_MULTI_CLONE_CLASS });
        this.dragObj.targetClone = createElement('div', {
            className: cls.DROPPED_CLONE_CLASS,
            styles: 'width:' + formatUnit(this.dragObj.element.offsetWidth) + ';height:' + formatUnit(this.dragObj.element.offsetHeight)
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
            (<HTMLElement[]>this.dragObj.selectedCards).forEach((element: HTMLElement) => {
                this.dragObj.cardDetails.push(this.parent.getCardDetails(element));
            });
        } else {
            this.dragObj.cardDetails = [this.parent.getCardDetails(this.dragObj.element)];
        }
        let dragArgs: DragEventArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(events.dragStart, dragArgs, (dragEventArgs: DragEventArgs & BlazorDragEventArgs) => {
            if (dragEventArgs.cancel) {
                this.removeElement(this.dragObj.cloneElement);
                this.dragObj.instance.intDestroy(e);
                this.dragObj.element = null;
                this.dragObj.targetClone = null;
                this.dragObj.draggedClone = null;
                this.dragObj.cloneElement = null;
                this.dragObj.targetCloneMulti = null;
                return;
            }
            if (this.parent.isBlazorRender()) {
                e.bindEvents(e.dragElement);
            }
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
                    this.parent.layoutModule.disableAttributeSelection(this.dragObj.cloneElement);
                    this.dragObj.cloneElement.style.width = '90px';
                }
            } else {
                this.draggedClone(this.dragObj.element);
            }
            this.parent.notify(events.contentReady, {});
        });
    }

    private draggedClone(element: HTMLElement): void {
        this.dragObj.draggedClone = createElement('div', {
            className: cls.DRAGGED_CLONE_CLASS,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], cls.DRAGGED_CARD_CLASS);
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
                    target.querySelector('.' + cls.CARD_WRAPPER_CLASS).appendChild(this.dragObj.targetClone);
                } else if (target.classList.contains(cls.CARD_WRAPPER_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + cls.CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                }
            } else if (keys.length > 1) {
                this.multiCloneCreate(keys, contentCell);
            }
            this.parent.notify(events.contentReady, {});
        }
        this.addDropping();
        let isCollapsed: boolean = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(cls.COLLAPSED_CLASS) && contentCell.classList.contains(cls.DROPPING_CLASS);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined); addClass([contentCell], cls.TOGGLE_VISIBLE_CLASS);
        }
        let tColumn: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.TOGGLE_VISIBLE_CLASS));
        if (tColumn.length > 0 && !target.classList.contains(cls.TOGGLE_VISIBLE_CLASS)
            && !closest(target, '.' + cls.TOGGLE_VISIBLE_CLASS)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, cls.TOGGLE_VISIBLE_CLASS);
        }
        this.parent.notify(events.contentReady, {});
        let cloneCell: HTMLElement = closest(target, '.' + cls.CONTENT_CELLS_CLASS + ':not(.' + cls.COLLAPSED_CLASS + ')') as HTMLElement;
        if (cloneCell) {
            this.dragObj.targetClone.style.width = formatUnit((cloneCell.offsetWidth - 2) - events.cardSpace);
        }
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
        document.body.style.cursor = contentCell ? '' : 'not-allowed';
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
        this.updateScrollPosition(e);
        let dragArgs: DragEventArgs = {
            data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards
        };
        this.parent.trigger(events.drag, dragArgs);
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
            addClass([contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_WRAPPER_CLASS);
        }
        addClass([contentCell.querySelector('.' + cls.CARD_WRAPPER_CLASS)], cls.MULTI_CARD_WRAPPER_CLASS);
        (contentCell.querySelector('.' + cls.CARD_WRAPPER_CLASS) as HTMLElement).style.height = 'auto';
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

    private dragStop(e: MouseEvent): void {
        let contentCell: Element = closest(this.dragObj.targetClone, '.' + cls.CONTENT_CELLS_CLASS);
        let columnKey: Element;
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
            if (this.dragObj.selectedCards instanceof HTMLElement) {
                this.updateDroppedData(this.dragObj.selectedCards, cardStatus, contentCell);
            } else {
                this.dragObj.selectedCards.forEach((element: HTMLElement) => {
                    this.updateDroppedData(element, cardStatus, contentCell);
                });
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                this.changeOrder(this.dragObj.modifiedData);
            }
        }
        let dragArgs: DragEventArgs = { cancel: false, data: this.dragObj.modifiedData, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(events.dragStop, dragArgs, (dragEventArgs: DragEventArgs) => {
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    this.parent.crudModule.updateCard(dragEventArgs.data);
                }
            }
            this.removeElement(this.dragObj.draggedClone);
            this.removeElement(this.dragObj.targetClone);
            this.removeElement(this.dragObj.cloneElement);
            let dragMultiClone: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.DRAGGED_CLONE_CLASS));
            dragMultiClone.forEach((clone: HTMLElement) => remove(clone));
            if (this.parent.isBlazorRender()) {
                this.dragObj.element.style.removeProperty('width');
                this.multiCloneRemove();
            }
            removeClass([this.dragObj.element], cls.DRAGGED_CARD_CLASS);
            clearInterval(this.dragObj.navigationInterval);
            this.dragObj.navigationInterval = null;
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            let className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
            let cells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
            cells.forEach((cell: Element) => removeClass([cell], cls.DROPPING_CLASS));
            if (this.parent.isAdaptive) {
                this.parent.touchModule.tabHold = false;
            }
            this.dragObj.cardDetails = this.dragObj.modifiedData = [];
            this.isDragging = false;
        });
    }

    private updateDroppedData(element: HTMLElement, cardStatus: string, contentCell: Element): void {
        let crudData: { [key: string]: Object } = this.parent.getCardDetails(element);
        if (cardStatus.split(',').length === 1) {
            crudData[this.parent.keyField] = cardStatus;
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let prev: Element = closest(contentCell, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
            if (this.parent.isAdaptive) {
                let keyField: string = this.parent.layoutModule.kanbanRows[this.parent.layoutModule.swimlaneIndex].keyField;
                crudData[this.parent.swimlaneSettings.keyField] = keyField;
            } else {
                crudData[this.parent.swimlaneSettings.keyField] = this.getColumnKey(prev);
            }
        }
        this.dragObj.modifiedData.push(crudData);
    }

    private changeOrder(modifieddata: { [key: string]: object }[]): void {
        let prevele: boolean = false;
        let element: Element = this.parent.sortSettings.direction === 'Ascending' ?
            this.dragObj.targetClone.previousElementSibling : this.dragObj.targetClone.nextElementSibling;
        if (element && !element.classList.contains(cls.DRAGGED_CARD_CLASS) && !element.classList.contains(cls.CLONED_CARD_CLASS)
            && !element.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
            prevele = true;
        } else if (this.dragObj.targetClone.nextElementSibling && this.parent.sortSettings.direction === 'Ascending') {
            element = this.dragObj.targetClone.nextElementSibling;
        } else if (this.dragObj.targetClone.previousElementSibling && this.parent.sortSettings.direction === 'Descending') {
            element = this.dragObj.targetClone.previousElementSibling;
        } else {
            return;
        }
        let obj: { [key: string]: Object } = this.parent.getCardDetails(element);
        let keyIndex: number = (obj as { [key: string]: Object })[this.parent.sortSettings.field] as number;
        if (modifieddata.length > 1 && this.parent.sortSettings.direction === 'Descending') {
            modifieddata = modifieddata.reverse();
        }
        modifieddata.forEach((data: { [key: string]: Object }, index: number): void => {
            if (prevele) {
                data[this.parent.sortSettings.field] = ++keyIndex;
            } else if (keyIndex !== 1 && index <= data[this.parent.sortSettings.field]) {
                data[this.parent.sortSettings.field] = --keyIndex;
            } else if (keyIndex === 1) {
                data[this.parent.sortSettings.field] = index + 1;
            }
        });
    }

    private toggleVisible(target: HTMLElement, tColumn?: HTMLElement): void {
        let headerCells: string = '.' + cls.HEADER_CELLS_CLASS + ':not(.' + cls.STACKED_HEADER_CELL_CLASS + ')';
        let lists: HTMLTableHeaderCellElement[] = [].slice.call(this.parent.element.querySelectorAll(headerCells));
        lists.forEach((list: HTMLTableHeaderCellElement) => {
            if (this.getColumnKey(list) === this.getColumnKey(tColumn || target)) {
                this.parent.actionModule.columnToggle(list);
            }
        });
        let cloneTarget: HTMLElement = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS) as HTMLElement;
        if (cloneTarget) {
            let width: string = formatUnit(cloneTarget.offsetWidth - events.cardSpace);
            this.dragObj.draggedClone.style.width = width;
            this.dragObj.cloneElement.style.width = width;
        }
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
                        removeClass([cell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_WRAPPER_CLASS);
                    }
                    removeClass([cell.querySelector('.' + cls.CARD_WRAPPER_CLASS)], cls.MULTI_CARD_WRAPPER_CLASS);
                }
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    }

    private calculateArgs(e: MouseEvent & TouchEvent): void {
        let eventArgs: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
        if (this.parent.isAdaptive && this.parent.tooltipModule) {
            this.parent.tooltipModule.tooltipObj.close();
        }
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

    private updateScrollPosition(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(
                () => {
                    if (this.autoScrollValidation(e)) {
                        this.autoScroll();
                    }
                },
                100);
        }
    }

    private autoScrollValidation(e: MouseEvent & TouchEvent): boolean {
        let pageY: number = this.dragObj.pageY;
        let pageX: number = this.dragObj.pageX;
        let autoScrollDistance: number = 30;
        let dragEdges: DragEdges = { left: false, right: false, top: false, bottom: false };
        if (this.dragObj.pageY - window.scrollY < (autoScrollDistance + 36)) {
            dragEdges.top = true;
        }
        if ((pageY > (window.innerHeight - autoScrollDistance) + window.pageYOffset) &&
            (pageY < window.innerHeight + window.pageYOffset)) {
            dragEdges.bottom = true;
        }
        if ((pageX < 0 + autoScrollDistance + window.pageXOffset) && (pageX > 0 + window.pageXOffset)) {
            dragEdges.left = true;
        }
        if ((pageX > (window.innerWidth - autoScrollDistance) + window.pageXOffset) &&
            (pageX < window.innerWidth + window.pageXOffset)) {
            dragEdges.right = true;
        }
        this.dragEdges = dragEdges;
        return dragEdges.bottom || dragEdges.top || dragEdges.left || dragEdges.right;
    }

    private autoScroll(): void {
        let scrollSensitivity: number = 30;
        if (this.parent.isAdaptive) {
            let parent: HTMLElement;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent = closest(this.dragObj.targetClone as HTMLElement, '.' + cls.CARD_WRAPPER_CLASS) as HTMLElement;
                } else {
                    parent = closest(this.dragObj.draggedClone as HTMLElement, '.' + cls.CARD_WRAPPER_CLASS) as HTMLElement;
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
                    scroll = (this.parent.layoutModule.getWidth() * (this.parent.columns.length - 1)) > parent.scrollLeft;
                    if (scroll || this.dragEdges.left) {
                        parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                    }
                }
            }
        } else {
            if (this.dragObj.pageY - window.scrollY < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY - scrollSensitivity);
            } else if (window.innerHeight - (this.dragObj.pageY - window.scrollY) < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY + scrollSensitivity);
            }
        }
    }

    public unWireDragEvents(element: HTMLElement): void {
        let dragInstance: Draggable = (element as EJ2Instance).ej2_instances[0] as Draggable;
        if (dragInstance && !dragInstance.isDestroyed) {
            dragInstance.destroy();
        }
    }
}
