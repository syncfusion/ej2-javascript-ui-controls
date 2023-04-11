/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable, formatUnit, createElement, isNullOrUndefined, addClass, closest, MouseEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { removeClass, classList, remove, EventHandler, extend } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { DragArgs, EJ2Instance, DragEdges, DragEventArgs } from '../base/interface';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';

/**
 * Drag and Drop module is used to perform card actions.
 */
export class DragAndDrop {
    private parent: Kanban;
    public dragObj: DragArgs;
    private dragEdges: DragEdges;
    public isDragging: boolean;
    private kanbanObj: Kanban;
    private isExternalDrop: boolean;
    private borderElm: NodeListOf<HTMLElement>;
    private insertClone: InsertPosition = 'afterend';

    /**
     * Constructor for drag and drop module
     *
     * @param {Kanban} parent Accepts the kanban instance
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null, instance: null, targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
        this.isDragging = false;
        this.isExternalDrop = false;
    }

    public wireDragEvents(element: HTMLElement): void {
        let dragContainment: HTMLElement;
        if (!this.parent.element != null && this.parent.externalDropId.length === 0) {
            dragContainment = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        }
        this.dragObj.instance = new Draggable(element, {
            clone: true,
            enableTapHold: this.parent.isAdaptive as boolean,
            enableTailMode: true,
            cursorAt: { top: -10, left: -10 },
            dragArea: dragContainment,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this)
        });
    }

    private dragHelper(e: { [key: string]: MouseEventArgs }): HTMLElement {
        if (this.parent.isAdaptive && this.parent.touchModule.mobilePopup &&
            this.parent.touchModule.mobilePopup.element.classList.contains(cls.POPUP_OPEN_CLASS)) {
            this.parent.touchModule.mobilePopup.hide();
        }
        this.dragObj.element = closest(e.sender.target as Element, '.' + cls.CARD_CLASS) as HTMLElement;
        if (isNullOrUndefined(this.dragObj.element)) { return null; }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        const cloneWrapper: HTMLElement = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.children.item(0) as HTMLElement;
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

    private dragStart(e: MouseEvent & TouchEvent): void {
        this.dragObj.selectedCards = this.dragObj.element;
        this.borderElm = this.parent.element.querySelectorAll('.' + cls.BORDER_CLASS);
        if (this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
            const className: string = '.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS + ':not(.' + cls.CLONED_CARD_CLASS + ')';
            const closestEle: Element = closest(this.dragObj.element, '.' + cls.CONTENT_ROW_CLASS);
            this.dragObj.selectedCards = [].slice.call(closestEle.querySelectorAll(className)) as HTMLElement[];
            (<HTMLElement[]>this.dragObj.selectedCards).forEach((element: HTMLElement) => {
                this.dragObj.cardDetails.push(this.parent.getCardDetails(element));
            });
        } else {
            this.dragObj.cardDetails = [this.parent.getCardDetails(this.dragObj.element)];
        }
        const dragArgs: DragEventArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(events.dragStart, dragArgs, (dragEventArgs: DragEventArgs) => {
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
            if (this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
                (<HTMLElement[]>this.dragObj.selectedCards).forEach((element: HTMLElement) => { this.draggedClone(element); });
                if ((<HTMLElement[]>this.dragObj.selectedCards).length > 1) {
                    this.dragObj.cloneElement.innerHTML = '';
                    const drag: Element = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: (<HTMLElement[]>this.dragObj.selectedCards).length + ' Cards'
                    });
                    this.dragObj.cloneElement.appendChild(drag);
                    classList(this.dragObj.cloneElement, ['e-multi-card-clone'], [cls.CARD_SELECTION_CLASS]);
                    this.parent.layoutModule.disableAttributeSelection(this.dragObj.cloneElement);
                    this.dragObj.cloneElement.style.width = '90px';
                }
            } else {
                this.draggedClone(this.dragObj.element);
            }
            EventHandler.add(document.body, 'keydown', this.keydownHandler, this);
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
        const cardElement: HTMLElement = closest(e.target as HTMLElement,  '.' + cls.ROOT_CLASS + ' .' + cls.CARD_CLASS) as HTMLElement;
        const target: HTMLElement = cardElement || e.target as HTMLElement;
        const selector: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS
            + '.' + cls.DROPPABLE_CLASS;
        const contentCell: HTMLElement = closest(target, selector) as HTMLElement;
        let cellDimension : ClientRect;
        let borderElem : HTMLElement;
        let dropElement : Element;
        if (target.nextElementSibling && target.nextElementSibling.lastChild) {
            dropElement = (target.nextElementSibling.lastChild as HTMLElement).previousElementSibling;
        }
        this.externalDrop(target);
        this.kanbanObj = this.parent.isExternalKanbanDrop ? this.parent.externalDropObj : this.parent;
        this.calculateArgs(e);
        if (contentCell && document.body.style.cursor !== 'not-allowed') {
            const targetKey: string = this.getColumnKey(contentCell);
            const keys: string[] = targetKey.split(',');
            this.multiCloneRemove();
            const isDrag: boolean = (targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS)))
                ? true : false;
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
                    this.removeElement(this.dragObj.targetClone, this.kanbanObj);
                }
                if (target.classList.contains(cls.CARD_CLASS) || this.insertClone === 'beforebegin') {
                    const element: Element = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ?
                        (target.previousElementSibling.classList.contains(cls.DRAGGED_CARD_CLASS) ? null : target.previousElementSibling)
                        : target.previousElementSibling;
                    this.insertClone = 'afterend';
                    if (isNullOrUndefined(element)) {
                        const pageY: number = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? (this.dragObj.pageY / 2) :
                            this.dragObj.pageY;
                        const height: number = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? target.offsetHeight :
                            (target.offsetHeight / 2);
                        if ((pageY - (this.kanbanObj.element.getBoundingClientRect().top + target.offsetTop)) < height) {
                            this.insertClone = 'beforebegin';
                        }
                    }
                    if (target.classList.contains(cls.CARD_CLASS)) {
                        target.insertAdjacentElement(this.insertClone, this.dragObj.targetClone);
                    }
                } else if (target.classList.contains(cls.CONTENT_CELLS_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)) {
                    if (target.querySelectorAll('.' + cls.DRAGGED_CARD_CLASS).length !== 0 &&
                        target.querySelectorAll('.' + cls.CARD_CLASS + ':not(.e-kanban-dragged-card):not(.e-cloned-card)').length === 0) {
                        return;
                    } else {
                        target.querySelector('.' + cls.CARD_WRAPPER_CLASS).appendChild(this.dragObj.targetClone);
                    }
                } else if (target.classList.contains(cls.CARD_WRAPPER_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + cls.CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                } else if (target.classList.contains(cls.BORDER_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)
                    && (target.nextElementSibling && target.nextElementSibling.classList.contains(cls.CARD_WRAPPER_CLASS))
                    && this.dragObj.targetClone && (!dropElement || !dropElement.classList.contains(cls.DROPPED_CLONE_CLASS))) {
                    target.nextElementSibling.appendChild(this.dragObj.targetClone);
                }
            } else if (keys.length > 1 && (contentCell.classList.contains(cls.DROPPING_CLASS)  ||
            contentCell.firstChild && (contentCell.firstChild as HTMLElement).classList.contains(cls.DROPPING_CLASS))) {
                this.multiCloneCreate(keys, contentCell);
            }
            this.kanbanObj.notify(events.contentReady, {});
        }
        if (this.kanbanObj.element.querySelectorAll('.' + cls.DROPPING_CLASS).length === 0) {
            this.cellDropping();
        }
        let isCollapsed: boolean = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(cls.COLLAPSED_CLASS) && contentCell.classList.contains(cls.DROPPING_CLASS);
            if (contentCell.getAttribute('aria-expanded') === 'true' || !contentCell.parentElement.hasAttribute('aria-expanded')) {
                cellDimension  = contentCell.getBoundingClientRect();
                this.updateDimension(cellDimension);
            }
            borderElem = contentCell.querySelector('.' + cls.BORDER_CLASS) as HTMLElement;
        }
        if (target && target.tagName === 'TABLE' && !isNullOrUndefined(target.querySelector('.' + cls.CONTENT_ROW_CLASS))) {
            cellDimension = target.querySelector('.' + cls.CONTENT_ROW_CLASS).getBoundingClientRect();
            this.updateDimension(cellDimension, target);
        }
        if (isCollapsed) {
            this.toggleVisible(target); addClass([contentCell], cls.TOGGLE_VISIBLE_CLASS);
        }
        const tColumn: HTMLElement[] = [].slice.call(this.kanbanObj.element.querySelectorAll('.' + cls.TOGGLE_VISIBLE_CLASS));
        if (tColumn.length > 0 && !target.classList.contains(cls.TOGGLE_VISIBLE_CLASS)
            && !closest(target, '.' + cls.TOGGLE_VISIBLE_CLASS)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, cls.TOGGLE_VISIBLE_CLASS);
        }
        this.kanbanObj.notify(events.contentReady, {});
        const multiKeyTarget: Element = closest(target, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            const columnKeys: Element[] = [].slice.call(this.kanbanObj.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS + ':not(.' +
                cls.DISABLED_CLASS + ')')).filter((element: Element) => this.getColumnKey(element) === this.getColumnKey(multiKeyTarget));
            if (columnKeys.length > 0) {
                addClass(columnKeys, cls.MULTI_ACTIVE_CLASS);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = (contentCell && contentCell.classList.contains(cls.DROPPING_CLASS) ||
        (contentCell && borderElem && borderElem.classList.contains(cls.DROPPING_CLASS))) ? '' : 'not-allowed';
        if (cardElement && !(closest(cardElement, '.' + cls.CONTENT_CELLS_CLASS)).classList.contains(cls.DROPPING_CLASS) &&
        !(contentCell && borderElem && borderElem.classList.contains(cls.DROPPING_CLASS))) {
            cardElement.style.cursor = 'not-allowed';
            document.body.style.cursor = 'not-allowed';
        }
        if (this.isExternalDrop && document.body.style.cursor === 'not-allowed') {
            document.body.style.cursor = '';
        }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone, this.kanbanObj);
            this.multiCloneRemove();
        }
        this.updateScrollPosition();
        const dragArgs: DragEventArgs = { data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.kanbanObj.trigger(events.drag, dragArgs);
        this.parent.isExternalKanbanDrop = false;
        this.isExternalDrop = false;
    }

    private removeElement(element: HTMLElement, kanbanObj?: Kanban): void {
        kanbanObj = kanbanObj ? kanbanObj : this.parent;
        if (kanbanObj.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    }

    private externalDrop(target: HTMLElement): void {
        this.parent.externalDropId.forEach((externalDropId: string) => {
            const targetRootElement: HTMLElement = <HTMLElement>closest(target, externalDropId);
            if (targetRootElement) {
                if (targetRootElement.classList.contains('e-kanban')) {
                    this.parent.externalDropObj = (document.querySelector(externalDropId) as EJ2Instance).ej2_instances[0] as Kanban;
                    this.parent.isExternalKanbanDrop = true;
                    const className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS +
                        '):not(.' + cls.COLLAPSED_CLASS + ') .' + cls.CONTENT_CELLS_CLASS;
                    const cells: HTMLTableRowElement[] = [].slice.call(this.parent.externalDropObj.element.querySelectorAll(className));
                    addClass(cells, cls.DROPPING_CLASS);
                } else {
                    this.isExternalDrop = true;
                }
            }
        });
    }

    private multiCloneCreate(keys: string[], contentCell: HTMLElement): void {
        let offsetHeight: number = contentCell.offsetHeight;
        const limitEle: HTMLElement = contentCell.querySelector('.' + cls.LIMITS_CLASS) as HTMLElement;
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
        for (const key of keys) {
            const dragCell: HTMLTableCellElement = <HTMLTableCellElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS);
            const transition: string[] = this.kanbanObj.columns[dragCell.cellIndex].transitionColumns;
            const allowTransition: boolean = this.allowedTransition(this.dragObj.element.getAttribute('data-key'), key, transition);
            const name: string = allowTransition ? '' : ' ' + cls.DISABLED_CLASS;
            const colKey: HTMLElement = createElement('div', {
                className: cls.MULTI_COLUMN_KEY_CLASS + name,
                attrs: { 'data-key': key.trim() }
            });
            const text: HTMLElement = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.cursor = allowTransition ? '' : 'not-allowed';
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    }

    private allowedTransition(currentCardKey: string, targetCardKey: string, allowedKey: string[]): boolean {
        let allowTransition: boolean = true;
        const targetKey: string[] = targetCardKey.split(',');
        for (let i: number = 0; i < targetKey.length; i++) {
            if (currentCardKey === targetKey[i as number].trim()) {
                return true;
            }
            if (allowedKey) {
                if (allowedKey.length === 1 && allowedKey[0].length === 0) {
                    return true;
                }
                for (let j: number = 0; j < allowedKey.length; j++) {
                    if (targetKey[i as number].trim() === allowedKey[j as number].trim()) {
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
        const dragCell: HTMLTableCellElement = (<HTMLTableCellElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS));
        const dragRow: HTMLTableRowElement = (<HTMLTableRowElement>closest(this.dragObj.draggedClone, '.' + cls.CONTENT_ROW_CLASS));
        if (dragCell && dragCell.classList.contains(cls.DROP_CLASS)) {
            addClass([dragCell], cls.DROPPING_CLASS);
        }
        this.addDropping(dragRow, dragCell);
        if (this.kanbanObj.swimlaneSettings.keyField && this.kanbanObj.swimlaneSettings.allowDragAndDrop) {
            const className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + '):not(.' + cls.COLLAPSED_CLASS + ')';
            const rows: HTMLTableRowElement[] = [].slice.call(this.kanbanObj.element.querySelectorAll(className));
            [].slice.call(rows).forEach((row: HTMLTableRowElement) => {
                if (dragRow !== row) {
                    this.addDropping(row, dragCell);
                }
            });
        }
    }

    private addDropping(dragRow: HTMLTableRowElement, dragCell: HTMLTableCellElement): void {
        if (dragCell && this.borderElm && this.borderElm.length !== 0) {
            if (dragCell.classList.contains(cls.DROPPING_CLASS)) {
                removeClass([dragCell], cls.DROPPING_CLASS);
            }
            const cellDimension : ClientRect  = dragCell.getBoundingClientRect();
            this.updateDimension(cellDimension);
        } else if (dragCell && dragRow) {
            [].slice.call(dragRow.children).forEach((cell: Element) => {
                const transition: string[] = this.kanbanObj.columns[dragCell.cellIndex].transitionColumns;
                if (cell !== dragCell && cell.classList.contains(cls.DROP_CLASS) &&
                    this.allowedTransition(dragCell.getAttribute('data-key'), cell.getAttribute('data-key'), transition)) {
                    addClass([cell], cls.DROPPING_CLASS);
                }
            });
        }
    }

    private updateDimension(dimensions: ClientRect, target?: HTMLElement): void {
        [].slice.call(this.borderElm).forEach((element: HTMLElement) => {
            if (element.parentElement && (element.parentElement.getAttribute('aria-expanded') === 'true' || !element.parentElement.hasAttribute('aria-expanded'))) {
                addClass([element], cls.DROPPING_CLASS);
            }
            const hasAddButton : HTMLElement = (element.previousElementSibling as HTMLElement);
            element.style.height = parseInt(dimensions.height.toString(), 10) - (hasAddButton &&
                hasAddButton.classList.contains(cls.SHOW_ADD_BUTTON) ? hasAddButton.offsetHeight + hasAddButton.offsetTop : 0) + 'px';
            if (!target || target.tagName !== 'TABLE') {
                element.style.width = parseInt(dimensions.width.toString(), 10) + 'px';
            }
            element.style.left = (element.parentElement.getBoundingClientRect().left - closest(element, '.e-kanban').getBoundingClientRect().left) + 'px';
        });
    }

    private keydownHandler(e: KeyboardEventArgs): void {
        if (e.code === 'Escape' && this.dragObj.cloneElement) {
            EventHandler.remove(this.dragObj.cloneElement, 'keydown', this.keydownHandler);
            this.dragObj.element.removeAttribute('aria-grabbed');
            this.dragStopClear();
            this.dragStopPostClear();
        }
    }

    private dragStop(e: MouseEvent): void {
        let contentCell: Element = closest(this.dragObj.targetClone, '.' + cls.CONTENT_CELLS_CLASS);
        let columnKey: Element;
        let dropIndex: number;
        EventHandler.remove(document.body, 'keydown', this.keydownHandler);
        [].slice.call(this.borderElm).forEach((element: HTMLElement) => {
            element.classList.remove(cls.DROPPING_CLASS);
        });
        if (this.dragObj.targetClone.parentElement) {
            const isMultipleDrag: boolean = (this.dragObj.selectedCards && (this.dragObj.selectedCards as  Record<string, any>[]).length > 1
             && this.parent.sortSettings.sortBy === 'Index');
            const className: string = !isMultipleDrag ? '.' + cls.CARD_CLASS + ':not(.' + cls.DRAGGED_CARD_CLASS + '),.' + cls.DROPPED_CLONE_CLASS :
                '.' + cls.CARD_CLASS + ',.' + cls.DROPPED_CLONE_CLASS;
            const element: HTMLElement[] = [].slice.call(this.dragObj.targetClone.parentElement.querySelectorAll(className));
            dropIndex = !isMultipleDrag ? element.indexOf(this.dragObj.targetClone) : element.indexOf(this.dragObj.targetClone) - 1;
        }
        if (!isNullOrUndefined(this.kanbanObj) && this.kanbanObj.element.querySelector('.' + cls.TARGET_MULTI_CLONE_CLASS)) {
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
            if (this.dragObj.selectedCards instanceof HTMLElement) {
                this.updateDroppedData(this.dragObj.selectedCards, cardStatus, contentCell);
            } else {
                this.dragObj.selectedCards.forEach((element: HTMLElement) => { this.updateDroppedData(element, cardStatus, contentCell); });
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                this.changeOrder(this.dragObj.modifiedData, (e as any).helper as Element);
            }
        }
        if (this.dragObj.modifiedData.length === 0) {
            this.dragObj.modifiedData = this.dragObj.cardDetails;
        }
        const dragArgs: DragEventArgs = {
            cancel: false, data: this.dragObj.modifiedData, event: e, element: this.dragObj.selectedCards,
            dropIndex: dropIndex
        };
        this.parent.trigger(events.dragStop, dragArgs, (dragEventArgs: DragEventArgs) => {
            this.dragStopClear();
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    const updateCard: Record<string, any>[] | Record<string, any> = dragEventArgs.data instanceof Array &&
                        dragEventArgs.data.length > 1 ? dragEventArgs.data as Record<string, any>[] :
                        dragEventArgs.data[0] as Record<string, any>;
                    this.parent.crudModule.updateCard(updateCard, dragEventArgs.dropIndex);
                }
            }
            this.dragStopPostClear();
        });
    }

    private dragStopClear(): void {
        this.removeElement(this.dragObj.draggedClone);
        this.removeElement(this.dragObj.targetClone, this.kanbanObj);
        this.removeElement(this.dragObj.cloneElement);
        const dragMultiClone: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.DRAGGED_CLONE_CLASS));
        dragMultiClone.forEach((clone: HTMLElement) => { remove(clone); });
        this.dragObj.element.style.removeProperty('width');
        this.multiCloneRemove();
        if (this.dragObj.selectedCards instanceof HTMLElement) {
            removeClass([this.dragObj.selectedCards as HTMLElement], cls.DRAGGED_CARD_CLASS);
        } else {
            removeClass(this.dragObj.selectedCards as HTMLElement[], cls.DRAGGED_CARD_CLASS);
        }
        clearInterval(this.dragObj.navigationInterval);
        this.dragObj.navigationInterval = null;
        if (document.body.style.cursor === 'not-allowed') {
            document.body.style.cursor = '';
        }
        const styleCards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[style]'));
        styleCards.forEach((styleCard: HTMLElement) => { styleCard.style.cursor = ''; });
        const className: string = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
        const cells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
        cells.forEach((cell: Element) => removeClass([cell], cls.DROPPING_CLASS));
        if (this.parent.externalDropObj) {
            const externalCells: HTMLElement[] = [].slice.call(this.parent.externalDropObj.element.querySelectorAll(className + ' .' +
                cls.CONTENT_CELLS_CLASS));
            externalCells.forEach((externalCell: Element) => removeClass([externalCell], cls.DROPPING_CLASS));
        }
    }

    private dragStopPostClear(): void {
        if (this.parent.isAdaptive) {
            this.parent.touchModule.tabHold = false;
        }
        this.dragObj.cardDetails = this.dragObj.modifiedData = [];
        this.isDragging = false;
        this.parent.isExternalKanbanDrop = false;
        this.parent.externalDropObj = null;
    }

    private updateDroppedData(element: HTMLElement, cardStatus: string, contentCell: Element): void {
        const crudObj: Record<string, any> = this.parent.getCardDetails(element);
        const crudData: Record<string, any> = extend({}, crudObj, null, true) as Record<string, any>;
        if (cardStatus.split(',').length === 1) {
            crudData[this.parent.keyField] = cardStatus;
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            const prev: Element = closest(contentCell, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
            if (this.parent.isAdaptive) {
                const keyField: string = this.parent.layoutModule.kanbanRows[this.parent.layoutModule.swimlaneIndex].keyField as string;
                crudData[this.parent.swimlaneSettings.keyField] = keyField;
            } else {
                crudData[this.parent.swimlaneSettings.keyField] = this.getColumnKey(prev);
            }
        }
        this.dragObj.modifiedData.push(crudData);
    }

    private changeOrder(modifieddata: Record<string, any>[], draggedCard: Element): void {
        let prevele: boolean = false;
        let element: Element;
        if (this.kanbanObj.sortSettings.direction === 'Ascending') {
            element = (draggedCard === this.dragObj.targetClone.previousElementSibling) && (this.dragObj.targetClone.previousElementSibling &&
                this.dragObj.targetClone.previousElementSibling.previousElementSibling) ?
                this.dragObj.targetClone.previousElementSibling.previousElementSibling : this.dragObj.targetClone.previousElementSibling;
        } else {
            element = this.dragObj.targetClone.nextElementSibling;
        }
        if (element && !element.classList.contains(cls.DRAGGED_CARD_CLASS) && !element.classList.contains(cls.CLONED_CARD_CLASS)
            && !element.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
            prevele = true;
        } else if (this.dragObj.targetClone.nextElementSibling && this.kanbanObj.sortSettings.direction === 'Ascending') {
            element = this.dragObj.targetClone.nextElementSibling;
        } else if (this.dragObj.targetClone.previousElementSibling && this.kanbanObj.sortSettings.direction === 'Descending') {
            element = this.dragObj.targetClone.previousElementSibling;
        } else {
            return;
        }
        if (element.classList.contains(cls.CARD_CLASS)) {
            const obj: Record<string, any> = this.kanbanObj.getCardDetails(element);
            let keyIndex: number = obj[this.kanbanObj.sortSettings.field] as number;
            if (modifieddata.length > 1 && this.kanbanObj.sortSettings.direction === 'Descending') {
                modifieddata = modifieddata.reverse();
            }
            modifieddata.forEach((data: Record<string, number>, index: number): void => {
                if (prevele) {
                    data[this.kanbanObj.sortSettings.field] = ++keyIndex;
                } else if (keyIndex !== 1 && index <= data[this.kanbanObj.sortSettings.field]) {
                    data[this.kanbanObj.sortSettings.field] = --keyIndex;
                } else if (keyIndex === 1) {
                    data[this.kanbanObj.sortSettings.field] = index + 1;
                }
            });
        }
    }

    private toggleVisible(target: HTMLElement, tColumn?: HTMLElement): void {
        const headerCells: string = '.' + cls.HEADER_CELLS_CLASS + ':not(.' + cls.STACKED_HEADER_CELL_CLASS + ')';
        const lists: HTMLTableHeaderCellElement[] = [].slice.call(this.kanbanObj.element.querySelectorAll(headerCells));
        lists.forEach((list: HTMLTableHeaderCellElement) => {
            if (this.getColumnKey(list) === this.getColumnKey(tColumn || target)) {
                this.kanbanObj.actionModule.columnToggle(list);
            }
        });
        const cloneTarget: HTMLElement = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS) as HTMLElement;
        if (cloneTarget) {
            const width: string = formatUnit(cloneTarget.offsetWidth - events.cardSpace);
            this.dragObj.draggedClone.style.width = width;
            this.dragObj.cloneElement.style.width = width;
        }
    }

    private multiCloneRemove(): void {
        const cloneMulti: HTMLElement[] = !isNullOrUndefined(this.kanbanObj) ? [].slice.call(this.kanbanObj.element.querySelectorAll('.' + cls.TARGET_MULTI_CLONE_CLASS)) : [];
        if (cloneMulti.length > 0) {
            const columnKey: HTMLElement[] = [].slice.call(this.kanbanObj.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS));
            columnKey.forEach((node: Element) => remove(node));
            cloneMulti.forEach((node: HTMLElement) => {
                const cell: HTMLElement = closest(node, '.' + cls.CONTENT_CELLS_CLASS) as HTMLElement;
                if (cell) {
                    cell.style.borderStyle = '';
                    if (cell.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
                        removeClass([cell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_WRAPPER_CLASS);
                    }
                    removeClass([cell.querySelector('.' + cls.CARD_WRAPPER_CLASS)], cls.MULTI_CARD_WRAPPER_CLASS);
                }
            });
            this.removeElement(this.dragObj.targetCloneMulti, this.kanbanObj);
        }
    }

    private calculateArgs(e: MouseEvent & TouchEvent): void {
        const eventArgs: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
        if (this.kanbanObj.isAdaptive && this.kanbanObj.tooltipModule) {
            this.kanbanObj.tooltipModule.tooltipObj.close();
        }
    }

    private getPageCoordinates(e: MouseEvent & TouchEvent): (MouseEvent & TouchEvent) | Touch {
        const eventArgs: TouchEvent = (e as Record<string, any> & MouseEvent & TouchEvent).event as TouchEvent;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            (<MouseEvent & TouchEvent>eventArgs) || e;
    }

    private getColumnKey(target: HTMLElement | Element): string {
        if (target && target.getAttribute('data-key')) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    }

    private updateScrollPosition(): void {
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(() => { this.autoScroll(); }, 100);
        }
    }

    private autoScrollValidation(): void {
        const pageY: number = this.dragObj.pageY;
        const pageX: number = this.dragObj.pageX;
        const autoScrollDistance: number = 30;
        const dragEdges: DragEdges = { left: false, right: false, top: false, bottom: false };
        const viewBoundaries: ClientRect = this.kanbanObj.element.querySelector('.' + cls.CONTENT_CLASS).getBoundingClientRect();
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
        const scrollSensitivity: number = 30;
        if (this.kanbanObj.isAdaptive) {
            let parent: HTMLElement;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent = closest(this.dragObj.targetClone as HTMLElement, '.' + cls.CARD_WRAPPER_CLASS) as HTMLElement;
                } else {
                    parent = closest(this.dragObj.draggedClone as HTMLElement, '.' + cls.CARD_WRAPPER_CLASS) as HTMLElement;
                }
            } else if (this.dragEdges.right || this.dragEdges.left) {
                parent = this.kanbanObj.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            }
            if (parent) {
                const yIsScrollable: boolean = parent.offsetHeight <= parent.scrollHeight;
                const xIsScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
                const yInBounds: boolean = parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
                const xInBounds: boolean = parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
                if (yIsScrollable && yInBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                    parent.scrollTop += this.dragEdges.top ? -(scrollSensitivity + 36) : scrollSensitivity;
                }
                if (xIsScrollable && xInBounds && (this.dragEdges.left || this.dragEdges.right)) {
                    const scroll: boolean = (this.kanbanObj.layoutModule.getWidth() * (this.kanbanObj.columns.length - 1)) >
                        parent.scrollLeft;
                    if (scroll || this.dragEdges.left) {
                        parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                    }
                }
            }
        } else {
            const parent: HTMLElement = this.kanbanObj.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            const column: HTMLElement = this.dragObj.targetClone.parentElement;
            const yScrollable: boolean = parent.offsetHeight <= parent.scrollHeight;
            const xScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
            const yBounds: boolean = yScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
            const xBounds: boolean = xScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
            if (yBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                parent.scrollTop += this.dragEdges.top ? -scrollSensitivity : scrollSensitivity;
                if (this.parent.swimlaneSettings.enableFrozenRows) {
                    this.dragObj.cloneElement.style.top = !this.dragEdges.top ? (parseInt(this.dragObj.cloneElement.style.top, 10) + scrollSensitivity) + 'px' : (parseInt(this.dragObj.cloneElement.style.top, 10) - scrollSensitivity) + 'px';
                }
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

    public unWireDragEvents(element: HTMLElement): void {
        const dragInstance: Draggable = (element as EJ2Instance).ej2_instances[0] as Draggable;
        if (dragInstance && !dragInstance.isDestroyed) {
            dragInstance.destroy();
        }
    }

}
