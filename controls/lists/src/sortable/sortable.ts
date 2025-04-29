import { Base, Event, getUniqueID, NotifyPropertyChanges, INotifyPropertyChanged, Property, detach, Browser } from '@syncfusion/ej2-base';
import { closest, Draggable, DragPosition, MouseEventArgs, remove, compareElementParent } from '@syncfusion/ej2-base';
import { addClass, isNullOrUndefined, getComponent, isBlazor, BlazorDragEventArgs, EventHandler } from '@syncfusion/ej2-base';
import { SortableModel } from './sortable-model';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sortable Module provides support to enable sortable functionality in Dom Elements.
 * ```html
 * <div id="sortable">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 *   <div>Item 5</div>
 * </div>
 * ```
 * ```typescript
 *   let ele: HTMLElement = document.getElementById('sortable');
 *   let sortObj: Sortable = new Sortable(ele, {});
 * ```
 */
@NotifyPropertyChanges
export class Sortable extends Base<HTMLElement> implements INotifyPropertyChanged {
    private target: HTMLElement;
    private curTarget: HTMLElement;
    private placeHolderElement: HTMLElement;
    /**
     * It is used to enable or disable the built-in animations. The default value is `false`
     *
     * @default false
     */

    @Property(false)
    public enableAnimation: boolean;
    /**
     * Specifies the sortable item class.
     *
     * @default null
     */
    @Property(null)
    public itemClass: string;
    /**
     * Defines the scope value to group sets of sortable libraries.
     * More than one Sortable with same scope allows to transfer elements between different sortable libraries which has same scope value.
     */
    @Property(null)
    public scope: string;
    /**
     * Defines the callback function for customizing the cloned element.
     */
    @Property()
    public helper: (Element: object) => HTMLElement;
    /**
     * Defines the callback function for customizing the placeHolder element.
     */
    @Property()
    public placeHolder: (Element: object) => HTMLElement;
    /**
     * Specifies the callback function for drag event.
     *
     * @event 'object'
     */


    @Event()
    public drag: (e: any) => void;
    /**
     * Specifies the callback function for beforeDragStart event.
     *
     *  @event 'object'
     */

    @Event()
    public beforeDragStart: (e: any) => void;
    /**
     * Specifies the callback function for dragStart event.
     *
     *  @event 'object'
     */

    @Event()
    public dragStart: (e: any) => void;
    /**
     * Specifies the callback function for beforeDrop event.
     *
     *  @event 'object'
     */

    @Event()
    public beforeDrop: (e: any) => void;
    /**
     * Specifies the callback function for drop event.
     *
     *  @event 'object'
     */

    @Event()
    public drop: (e: any) => void;
    constructor(element: HTMLElement, options?: SortableModel) {
        super(options, element);
        this.bind();
    }
    protected bind(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('sortable');
        }
        if (!this.itemClass) {
            this.itemClass = 'e-sort-item';
            this.dataBind();
        }
        this.initializeDraggable();
    }
    private initializeDraggable(): void {
        new Draggable(this.element, {
            helper: this.getHelper,
            dragStart: this.onDragStart,
            drag: this.onDrag,
            dragStop: this.onDragStop,
            dragTarget: `.${this.itemClass}`,
            enableTapHold: true,
            tapHoldThreshold: 200,
            queryPositionInfo: this.queryPositionInfo,
            distance: 1
        });
        this.wireEvents();
    }
    private wireEvents(): void {
        const wrapper: Element = this.element;
        EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
    }
    private unwireEvents(): void {
        const wrapper: Element = this.element;
        EventHandler.remove(wrapper, 'keydown', this.keyDownHandler);
    }
    private keyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 27) {
            const dragStop: Draggable = getComponent(this.element, 'draggable');
            if (dragStop) {
                dragStop.intDestroy(null);
            }
            const dragWrapper: Element = document.getElementsByClassName('e-sortableclone')[0];
            if (dragWrapper) {
                dragWrapper.remove();
            }
            const dragPlaceholder: Element = document.getElementsByClassName('e-sortable-placeholder')[0];
            if (dragPlaceholder) {
                dragPlaceholder.remove();
            }
        }
    }

    private getPlaceHolder(target: HTMLElement, instance: Sortable): HTMLElement {
        if (instance.placeHolder) {
            const placeHolderElement: HTMLElement = instance.placeHolder(
                { element: instance.element, grabbedElement: this.target, target: target });
            placeHolderElement.classList.add('e-sortable-placeholder');
            return placeHolderElement;
        }
        return null;
    }

    private getHelper: Function = (e: { sender: MouseEventArgs, element: HTMLElement }) => {
        const target: HTMLElement = this.getSortableElement(e.sender.target as HTMLElement);
        if (!this.isValidTarget(target as Element, this)) {
            return false;
        }
        let element: HTMLElement;
        if (this.helper) {
            element = this.helper({ sender: target, element: e.element });
        } else {
            element = target.cloneNode(true) as HTMLElement;
            element.style.width = `${target.offsetWidth}px`; element.style.height = `${target.offsetHeight}px`;
        }
        addClass([element], ['e-sortableclone']);
        document.body.appendChild(element);
        return element;
    }
    private isValidTarget(target: Element, instance: Sortable): boolean {
        return target && compareElementParent(target, instance.element) && target.classList.contains(instance.itemClass) &&
            !target.classList.contains('e-disabled');
    }
    private onDrag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        if (!e.target) { return; }
        this.trigger('drag', { event: e.event, element: this.element, target: e.target });
        let newInst: Sortable = this.getSortableInstance(e.target); let target: HTMLElement = this.getSortableElement(e.target, newInst);
        if ((this.isValidTarget(target, newInst) || (e.target && typeof e.target.className === 'string' && e.target.className.indexOf('e-list-group-item') > -1)) && (this.curTarget !== target ||
            !isNullOrUndefined(newInst.placeHolder)) && (newInst.placeHolderElement ? newInst.placeHolderElement !== e.target : true)) {
            if (e.target.classList.contains('e-list-group-item')) {
                target = e.target;
            }
            this.curTarget = target;
            if (this.target === target) { return; }
            let oldIdx: number = this.getIndex(newInst.placeHolderElement, newInst);
            const placeHolder: HTMLElement = this.getPlaceHolder(target, newInst);
            let newIdx: number;
            if (placeHolder) {
                oldIdx = isNullOrUndefined(oldIdx) ? this.getIndex(this.target) : oldIdx;
                newIdx = this.getIndex(target, newInst, e.event);
                const isPlaceHolderPresent: boolean = this.isPlaceHolderPresent(newInst);
                if (isPlaceHolderPresent && oldIdx === newIdx) { return; }
                if (isPlaceHolderPresent) { this.removePlaceHolder(newInst); }
                newInst.placeHolderElement = placeHolder;
                if (e.target && typeof e.target.className === 'string' && e.target.className.indexOf('e-list-group-item') > -1) {
                    newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[newIdx as number]);
                } else if (newInst.element !== this.element && newIdx === newInst.element.childElementCount) {
                    newInst.element.appendChild(newInst.placeHolderElement);
                } else {
                    newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[newIdx as number]);
                }
            } else {
                oldIdx = isNullOrUndefined(oldIdx) ? this.getIndex(this.target) :
                    this.getIndex(target, newInst) < oldIdx || !oldIdx ? oldIdx : oldIdx - 1;
                newIdx = this.getIndex(target, newInst);
                const idx: number = newInst.element !== this.element ? newIdx : oldIdx < newIdx ? newIdx + 1 : newIdx;
                this.updateItemClass(newInst);
                newInst.element.insertBefore(this.target, newInst.element.children[idx as number]);
                this.curTarget = this.target;
                this.trigger('drop', {
                    droppedElement: this.target, element: newInst.element, previousIndex: oldIdx, currentIndex: newIdx,
                    target: e.target, helper: document.getElementsByClassName('e-sortableclone')[0], event: e.event, scope: this.scope
                });
            }
        } else if (this.curTarget !== this.target && this.scope && this.curTarget !== target && !isNullOrUndefined(newInst.placeHolder)) {
            this.removePlaceHolder(this.getSortableInstance(this.curTarget));
            this.curTarget = this.target;
        }
        newInst = this.getSortableInstance(this.curTarget);
        if (isNullOrUndefined(target) && e.target !== newInst.placeHolderElement) {
            if (this.isPlaceHolderPresent(newInst)) { this.removePlaceHolder(newInst); }
        } else {
            const placeHolders: Element[] = [].slice.call(document.getElementsByClassName('e-sortable-placeholder')); let inst: Sortable;
            placeHolders.forEach((placeHolder: Element) => {
                inst = this.getSortableInstance(placeHolder);
                if (inst.element && inst !== newInst) { this.removePlaceHolder(inst); }
            });
        }
    }
    private removePlaceHolder(instance: Sortable): void {
        remove(instance.placeHolderElement);
        instance.placeHolderElement = null;
    }
    private updateItemClass(instance: Sortable): void {
        if (this !== instance) {
            this.target.classList.remove(this.itemClass);
            this.target.classList.add(instance.itemClass);
        }
    }
    private getSortableInstance(element: Element): Sortable {
        element = closest(element, `.e-${this.getModuleName()}`);
        if (element) {
            const inst: Sortable = getComponent(element as HTMLElement, Sortable) as Sortable;
            return inst.scope && this.scope && inst.scope === this.scope ? inst : this;
        } else {
            return this;
        }
    }
    private getIndex(target: Element, instance: Sortable = this, e?: MouseEventArgs): number {
        let idx: number; let placeHolderPresent: boolean;
        [].slice.call(instance.element.children).forEach((element: HTMLElement, index: number): void => {
            if (element.classList.contains('e-sortable-placeholder')) { placeHolderPresent = true; }
            if (element === target) {
                idx = index;
                if (!isNullOrUndefined(e)) {
                    if (placeHolderPresent) { idx -= 1; }
                    const offset: ClientRect = target.getBoundingClientRect();
                    const clientY: number = offset.bottom - ((offset.bottom - offset.top) / 2);
                    const cltY: number = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
                    idx = cltY <= clientY ? idx : idx + 1;
                }
                return;
            }
        });
        return idx;
    }
    private getSortableElement(element: HTMLElement, instance: Sortable = this): HTMLElement {
        return closest(element, `.${instance.itemClass}`) as HTMLElement;
    }

    private onDragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element } & BlazorDragEventArgs) => {
        this.target = this.getSortableElement(e.target);
        if (isNullOrUndefined(this.target) && closest(this.element, '.e-listbox-container') && Browser.isDevice) {
            detach(e.dragElement);
            (getComponent(this.element, 'draggable') as any).intDestroy(e.event);
            return;
        }
        let cancelDrag: boolean = false;
        this.target.classList.add('e-grabbed');
        this.curTarget = this.target;
        e.helper = document.getElementsByClassName('e-sortableclone')[0];
        const args: object = { cancel: false, element: this.element, target: this.target };
        this.trigger('beforeDragStart', args, (observedArgs: BeforeDragEventArgs) => {
            if (observedArgs.cancel) {
                cancelDrag = observedArgs.cancel;
                this.onDragStop(e);
            }
        });
        if (cancelDrag) {
            return;
        }
        if (isBlazor) {
            this.trigger('dragStart', {
                event: e.event, element: this.element, target: this.target,
                bindEvents: e.bindEvents, dragElement: e.dragElement
            });
        } else {
            this.trigger('dragStart', { event: e.event, element: this.element, target: this.target });
        }
    }
    private queryPositionInfo(value: DragPosition): DragPosition {
        value.left = scrollX ? `${parseFloat(value.left) - scrollX}px` : value.left;
        value.top = scrollY ? `${parseFloat(value.top) - scrollY}px` : value.top;
        return value;
    }
    private isPlaceHolderPresent(instance: Sortable): boolean {
        return instance.placeHolderElement && !!closest(instance.placeHolderElement, `#${instance.element.id}`);
    }

    private onDragStop: Function = (e: { target: HTMLElement, event: MouseEvent & TouchEvent, helper: Element }) => {
        let dropInst: Sortable = this.getSortableInstance(this.curTarget); let prevIdx: number; let curIdx: number; let handled: boolean;
        prevIdx = this.getIndex(this.target);
        const isPlaceHolderPresent: boolean = this.isPlaceHolderPresent(dropInst);
        if (isPlaceHolderPresent) {
            const curIdx: number = this.getIndex(dropInst.placeHolderElement, dropInst);
            prevIdx = this === dropInst && (prevIdx - curIdx) >= 1 ? prevIdx - 1 : prevIdx;
            const args: DropEventArgs = {
                previousIndex: prevIdx, currentIndex: curIdx, target: e.target, droppedElement: this.target,
                helper: e.helper, cancel: false, handled: false
            };
            this.trigger('beforeDrop', args, (observedArgs: DropEventArgs) => {
                if (!observedArgs.cancel) {
                    handled = observedArgs.handled;
                    this.updateItemClass(dropInst);
                    if (observedArgs.handled) {
                        const ele: Node = this.target.cloneNode(true);
                        this.target.classList.remove('e-grabbed');
                        this.target = ele as HTMLElement;
                    }
                    dropInst.element.insertBefore(this.target, dropInst.placeHolderElement);
                    const curIdx: number = this.getIndex(this.target, dropInst);
                    if (observedArgs.currentIndex > observedArgs.previousIndex) {
                        prevIdx = this === dropInst && (prevIdx - curIdx) >= 1 ? prevIdx - 1 : prevIdx;
                    }
                    this.trigger('drop', {
                        event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: curIdx,
                        target: e.target, helper: e.helper, droppedElement: this.target, scopeName: this.scope, handled: handled
                    });
                }
                this.removePlaceHolder(dropInst);
            });
        }
        dropInst = this.getSortableInstance(e.target);
        curIdx = dropInst.element.childElementCount;
        prevIdx = this.getIndex(this.target);
        if (dropInst.element.querySelector('.e-list-nrt')) {
            curIdx = curIdx - 1;
        }
        if (this.curTarget === this.target && e.target === this.curTarget) {
            curIdx = prevIdx;
        }
        if (dropInst.element === e.target || (!isPlaceHolderPresent && this.curTarget === this.target)) {
            const beforeDropArgs: DropEventArgs = {
                previousIndex: prevIdx, currentIndex: curIdx,
                target: e.target, droppedElement: this.target, helper: e.helper, cancel: false
            };
            this.trigger('beforeDrop', beforeDropArgs, (observedArgs: DropEventArgs) => {
                if ((dropInst.element === e.target || (typeof e.target.className === 'string' && e.target.className.indexOf('e-list-nrt') > -1) || (typeof e.target.className === 'string' && e.target.className.indexOf('e-list-nr-template') > -1)
                    || e.target.closest('.e-list-nr-template')) && !observedArgs.cancel) {
                    this.updateItemClass(dropInst);
                    dropInst.element.appendChild(this.target);
                    this.trigger('drop', {
                        event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: curIdx,
                        target: e.target, helper: e.helper, droppedElement: this.target, scopeName: this.scope
                    });
                }
            });
        }
        this.target.classList.remove('e-grabbed');
        this.target = null;
        this.curTarget = null;
        remove(e.helper);
        (getComponent(this.element, 'draggable') as Draggable).intDestroy(e.event);
    }
    /**
     * It is used to sort array of elements from source element to destination element.
     *
     * @param destination - Defines the destination element to which the sortable elements needs to be appended.
     *
     * If it is null, then the Sortable library element will be considered as destination.
     * @param targetIndexes - Specifies the sortable elements indexes which needs to be sorted.
     * @param insertBefore - Specifies the index before which the sortable elements needs to be appended.
     * If it is null, elements will be appended as last child.
     * @function moveTo
     * @returns {void}
     */

    public moveTo(destination?: HTMLElement, targetIndexes?: number[], insertBefore?: number): void {
        moveTo(this.element, destination, targetIndexes, insertBefore);
    }

    /**
     * It is used to destroy the Sortable library.
     */

    public destroy(): void {
        this.unwireEvents();
        if (this.itemClass === 'e-sort-item') { this.itemClass = null; this.dataBind(); }
        (getComponent(this.element, Draggable) as Draggable).destroy();
        super.destroy();
    }
    public getModuleName(): string {
        return 'sortable';
    }
    public onPropertyChanged(newProp: SortableModel, oldProp: SortableModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'itemClass':
                [].slice.call(this.element.children).forEach((element: HTMLElement): void => {
                    if (element.classList.contains(oldProp.itemClass)) {
                        element.classList.remove(oldProp.itemClass);
                    }
                    if (newProp.itemClass) {
                        element.classList.add(newProp.itemClass);
                    }
                });
                break;
            }
        }
    }
}

/**
 * It is used to sort array of elements from source element to destination element.
 *
 * @param {HTMLElement} from - The source element from which to move elements.
 * @param {HTMLElement} [to=from] - The destination element to which to move elements. Defaults to the source element.
 * @param {number[]} [targetIndexes] - The indexes of elements to move. If not provided, all children of the source element will be moved.
 * @param {number} [insertBefore] - The index before which to insert the moved elements in the destination element. If not provided, elements will be appended to the end of the destination element.
 * @returns {void}
 * @private
 */
export function moveTo(from: HTMLElement, to?: HTMLElement, targetIndexes?: number[], insertBefore?: number): void {
    let targetElements: Element[] = [];
    if (!to) { to = from; }
    if (targetIndexes && targetIndexes.length) {
        targetIndexes.forEach((index: number): void => {
            targetElements.push(from.children[index as number]);
        });
    } else {
        targetElements = [].slice.call(from.children);
    }
    if (isNullOrUndefined(insertBefore)) {
        targetElements.forEach((target: Element): void => {
            to.appendChild(target);
        });
    } else {
        const insertElement: HTMLElement = to.children[insertBefore as number] as HTMLElement;
        targetElements.forEach((target: Element): void => {
            to.insertBefore(target, insertElement);
        });
    }
}

/**
 * An interface that holds item drop event arguments
 */
export interface DropEventArgs {
    previousIndex: number;
    currentIndex: number;
    droppedElement: Element;
    target: Element;
    helper: Element;
    cancel?: boolean;
    handled?: boolean;
}

/**
 * An interface that holds item before drag event arguments
 */
export interface BeforeDragEventArgs {
    cancel?: boolean;
    target: Element;
}
