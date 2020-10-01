import { BlazorDotnetObject, closest, EventHandler, select, selectAll, createElement, getUniqueID } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getComponent, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { Sortable } from '@syncfusion/ej2-lists';
import { getZindexPartial } from '@syncfusion/ej2-popups';

const CONTAINER: string = 'e-listbox-container';
const LIST: string = '.e-ul';
const LISTITEM: string = 'e-list-item';
const SELECTED: string = 'e-selected';
const DATAVALUE: string = 'data-value';
const DRAGEND: string = 'DragEnd';
const COMBINED: string = 'scopedListBox';
const HASH: string = '#';
const DOT: string = '.';
const PLACEHOLDER: string = 'e-placeholder';
const SPAN: string = 'span';
const BADGE: string = 'e-list-badge';
const KEYDOWN: string = 'keydown';
const SORTABLE: string = 'sortable';
const UP: number = 38;
const DOWN: number = 40;
const KEYA: number = 65;

/**
 * Client side scripts for SfListBox
 */
class SfListBox {
    private element: BlazorListBoxElement;
    private scope: string;
    private scopeElement: BlazorListBoxElement;
    private allowDragAndDrop: boolean;
    private dotnetRef: BlazorDotnetObject;

    constructor(element: BlazorListBoxElement, scopeElement: BlazorListBoxElement, allowDragDrop: boolean, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.scopeElement = scopeElement;
        this.dotnetRef = dotnetRef;
        this.allowDragAndDrop = allowDragDrop;
        this.element.blazor__instance = this;
        EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
        if (this.scopeElement && !isNullOrUndefined(this.scopeElement.blazor__instance) && !this.scopeElement.blazor__instance.scope) {
            this.scope = getUniqueID(COMBINED); this.scopeElement.blazor__instance.scope = this.scope;
            this.initializeDraggable(); this.scopeElement.blazor__instance.initializeDraggable();
        }
    }
    private initializeDraggable(): void {
        if (!this.allowDragAndDrop) { return; }
        let ul: HTMLElement = select(LIST, this.element);
        new Sortable(ul, {
            scope: this.scope,
            itemClass: LISTITEM,
            dragStart: this.triggerDragStart.bind(this),
            beforeDrop: this.dragEnd.bind(this),
            placeHolder: (): HTMLElement => createElement(SPAN, { className: PLACEHOLDER }),
            helper: (e: { sender: Element }) => {
                let element: HTMLElement = this.element.cloneNode() as HTMLElement;
                let target: HTMLElement = e.sender.cloneNode(true) as HTMLElement;
                element.appendChild(target);
                let refEle: HTMLElement = select(DOT + LISTITEM, this.element) as HTMLElement;
                element.style.width = refEle.offsetWidth + 'px';
                element.style.height = refEle.offsetHeight + 'px';
                let selectedList: HTMLElement[] = [].slice.call(selectAll(DOT + LISTITEM + DOT + SELECTED, this.element));
                if (selectedList.length && selectedList.length > 1 && selectedList.indexOf(e.sender as HTMLElement) > -1) {
                    target.appendChild(createElement(SPAN, { className: BADGE, innerHTML: selectedList.length.toString() }));
                }
                element.style.zIndex = getZindexPartial(this.element).toString();
                return element;
            }
        });
    }
    private triggerDragStart(args: BlazorDragEventArgs): void {
        args.bindEvents(args.dragElement);
    }
    private dragEnd(args: DropEventArgs): void {
        let list: Element; let scopedListBox: boolean = false; let sameListBox: boolean = false;
        if (this.scopeElement) { list = closest(args.target, HASH + this.scopeElement.id); }
        if (list) {
            scopedListBox = true;
        } else {
            list = closest(args.target, HASH + this.element.id);
            if (list) { sameListBox = true; }
        }
        args.cancel = true;
        this.dotnetRef.invokeMethodAsync(
            DRAGEND, args.droppedElement.getAttribute(DATAVALUE), sameListBox, scopedListBox, args.previousIndex, args.currentIndex);
    }
    private keyDownHandler(e: KeyboardEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (e.keyCode === UP || e.keyCode === DOWN) {
            e.preventDefault();
            if (target.classList.contains(CONTAINER)) {
                let listEle: HTMLElement = select(DOT + LISTITEM, this.element);
                if (listEle) { listEle.focus(); }
            } else {
                let list: HTMLElement[] = [].slice.call(selectAll(DOT + LISTITEM, this.element));
                let index: number = list.indexOf(target);
                if (index < 0) { return; }
                index = e.keyCode === UP ? index - 1 : index + 1;
                if (index < 0 || index > list.length - 1) {
                    index = e.keyCode === UP ? list.length - 1 : 0;
                }
                list[index].focus();
            }
        } else if (e.keyCode === KEYA && e.ctrlKey) {
            e.preventDefault();
        }
    }
    private destroyDraggable(): void {
        let sortable: Sortable = getComponent(select(LIST, this.element), SORTABLE) as Sortable;
        if (!isNullOrUndefined(sortable)) { sortable.destroy(); }
    }
    public destroy(): void {
        this.destroyDraggable();
        EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler);
    }
}

interface BlazorListBoxElement extends HTMLElement {
    blazor__instance: SfListBox;
}

interface DropEventArgs {
    previousIndex: number;
    currentIndex: number;
    droppedElement: Element;
    target: Element;
    cancel: boolean;
}

// tslint:disable-next-line:variable-name
let ListBox: object = {
    initialize(element: BlazorListBoxElement, scopeEle: BlazorListBoxElement, allowDragDrop: boolean, dotnetRef: BlazorDotnetObject): void {
        if (!isNullOrUndefined(element)) { new SfListBox(element, scopeEle, allowDragDrop, dotnetRef); }
    },
    destroy(element: BlazorListBoxElement): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    }
};

export default ListBox;