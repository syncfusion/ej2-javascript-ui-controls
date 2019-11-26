import { Base, Event, getUniqueID, NotifyPropertyChanges, INotifyPropertyChanged, Property  } from '@syncfusion/ej2-base';
import { closest, Draggable, DragPosition, MouseEventArgs, remove, compareElementParent } from '@syncfusion/ej2-base';
import { addClass, isNullOrUndefined, getComponent, isBlazor, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { SortableModel } from './sortable-model';

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
export class Sortable extends Base<HTMLElement>  implements INotifyPropertyChanged {
    private target: HTMLElement;
    private curTarget: HTMLElement;
    private placeHolderElement: HTMLElement;
    /**
     * It is used to enable or disable the built-in animations. The default value is `false`
     * @default false
     */
    @Property(false)
    public enableAnimation: boolean;
    /**
     * Specifies the sortable item class.
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
    public helper: Function;
    /**
     * Defines the callback function for customizing the placeHolder element.
     */
    @Property()
    public placeHolder: Function;
    /**
     * Specifies the callback function for drag event.
     * @event
     */
    @Event()
    public drag: Function;
    /**
     * Specifies the callback function for dragStart event.
     * @event
     */
    @Event()
    public dragStart: Function;
    /**
     * Specifies the callback function for drop event.
     * @event
     */
    @Event()
    public drop: Function;
    constructor(element: HTMLElement, options?: SortableModel) {
        super(options, element);
        this.bind();
    }
    protected bind(): void {
        if (!this.element.id) {
            this.element.id  = getUniqueID('sortable');
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
            queryPositionInfo: this.queryPositionInfo
        });
    }
    private getPlaceHolder(target: HTMLElement, instance: Sortable): HTMLElement {
        if (instance.placeHolder) {
            if (this.isPlaceHolderPresent(instance)) { remove(instance.placeHolderElement); }
            instance.placeHolderElement = instance.placeHolder(
                { element: instance.element, grabbedElement: this.target, target: target });
            instance.placeHolderElement.classList.add('e-sortable-placeholder');
            return instance.placeHolderElement;
        }
        return null;
    }
    private getHelper: Function = (e: { sender: MouseEventArgs, element: HTMLElement }) => {
        let target: HTMLElement = this.getSortableElement(e.sender.target as HTMLElement);
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
        this.element.appendChild(element);
        return element;
    }
    private isValidTarget(target: Element, instance: Sortable): boolean {
        return target && compareElementParent(target, instance.element) && target.classList.contains(instance.itemClass) &&
            !target.classList.contains('e-disabled');
    }
    private onDrag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        this.trigger('drag', { event: e.event, element: this.element, target: e.target });
        let newInst: Sortable = this.getSortableInstance(e.target); let target: HTMLElement = this.getSortableElement(e.target, newInst);
        if (this.isValidTarget(target, newInst) && this.curTarget !== target &&
            (newInst.placeHolderElement ? newInst.placeHolderElement !== e.target : true )) {
            this.curTarget = target;
            let oldIdx: number = this.getIndex(newInst.placeHolderElement, newInst);
            oldIdx = isNullOrUndefined(oldIdx) ? this.getIndex(this.target) :
                this.getIndex(target, newInst) < oldIdx || !oldIdx ? oldIdx : oldIdx - 1;
            newInst.placeHolderElement = this.getPlaceHolder(target, newInst);
            let newIdx: number = this.getIndex(target, newInst);
            let idx: number = newInst.element !== this.element ? newIdx : oldIdx < newIdx ? newIdx + 1 : newIdx;
            if (newInst.placeHolderElement) {
                if (newInst.element !== this.element && idx === newInst.element.childElementCount - 1) {
                    newInst.element.appendChild(newInst.placeHolderElement);
                } else {
                    newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[idx]);
                }
                this.refreshDisabled(oldIdx, newIdx, newInst);
            } else {
                this.updateItemClass(newInst);
                newInst.element.insertBefore(this.target, newInst.element.children[idx]);
                this.refreshDisabled(oldIdx, newIdx, newInst);
                this.curTarget = this.target;
                this.trigger('drop', { event: e.event, element: newInst.element, previousIndex: oldIdx, currentIndex: newIdx,
                    target: e.target, helper: newInst.element.lastChild as HTMLElement, droppedElement: this.target, scope: this.scope });
            }
        }
        newInst = this.getSortableInstance(this.curTarget);
        if (isNullOrUndefined(target) &&  e.target !== newInst.placeHolderElement) {
            if (this.isPlaceHolderPresent(newInst)) { this.removePlaceHolder(newInst); }
        } else {
            let placeHolders: Element[] = [].slice.call(document.getElementsByClassName('e-sortable-placeholder')); let inst: Sortable;
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
            let inst: Sortable = getComponent(element as HTMLElement, Sortable) as Sortable;
            return inst.scope && this.scope && inst.scope === this.scope ? inst : this;
        } else {
            return this;
        }
    }
    private refreshDisabled(oldIdx: number, newIdx: number, instance: Sortable): void {
        if (instance === this) {
            let element: Element; let increased: boolean = oldIdx < newIdx; let disabledIdx: number;
            let start: number = increased ? oldIdx : newIdx; let end: number = increased ? newIdx : oldIdx;
            while (start <= end) {
                element = this.element.children[start];
                if (element.classList.contains('e-disabled')) {
                    disabledIdx = this.getIndex(element);
                    this.element.insertBefore(element, this.element.children[increased ? disabledIdx + 2 : disabledIdx - 1]);
                    start = increased ? disabledIdx + 2 : disabledIdx + 1;
                } else {
                    start++;
                }
            }
        }
    }
    private getIndex(target: Element, instance: Sortable = this): number {
        let idx: number;
        [].slice.call(instance.element.children).forEach((element: HTMLElement, index: number): void => {
            if (element === target) {
                idx =  index;
            }
        });
        return idx;
    }
    private getSortableElement(element: HTMLElement, instance: Sortable = this): HTMLElement {
        return closest(element, `.${instance.itemClass}`) as HTMLElement;
    }
    private onDragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs } & BlazorDragEventArgs) => {
        this.target = this.getSortableElement(e.target);
        this.target.classList.add('e-grabbed');
        this.curTarget =  this.target;
        if (isBlazor) {
            this.trigger('dragStart', { event: e.event, element: this.element, target: this.target,
                bindEvents: e.bindEvents, dragElement: e.dragElement });
        } else {
            this.trigger('dragStart', { event: e.event, element: this.element, target: this.target });
        }
    }
    private queryPositionInfo(value: DragPosition): DragPosition {
        value.left = pageXOffset ? `${parseFloat(value.left) - pageXOffset}px` : value.left;
        value.top = pageYOffset ? `${parseFloat(value.top) - pageYOffset}px` : value.top;
        return value;
    }
    private isPlaceHolderPresent(instance: Sortable): boolean {
        return instance.placeHolderElement && !!closest(instance.placeHolderElement, `#${instance.element.id}`);
    }
    private onDragStop: Function = (e: { target: HTMLElement, event: MouseEvent & TouchEvent, helper: Element }) => {
        let dropInst: Sortable = this.getSortableInstance(this.curTarget); let prevIdx: number;
        if (this.isPlaceHolderPresent(dropInst)) {
            prevIdx = this.getIndex(this.target); this.updateItemClass(dropInst);
            dropInst.element.insertBefore(this.target, dropInst.placeHolderElement);
            let curIdx: number = this.getIndex(this.target, dropInst);
            prevIdx = this === dropInst && (prevIdx - curIdx) > 1 ? prevIdx - 1 : prevIdx;
            this.trigger('drop', { event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: curIdx,
                target: e.target, helper: e.helper, droppedElement: this.target, scopeName: this.scope });
            remove(dropInst.placeHolderElement);
        }
        dropInst = this.getSortableInstance(e.target);
        if (dropInst.element === e.target) {
            prevIdx = this.getIndex(this.target); this.updateItemClass(dropInst);
            dropInst.element.appendChild(this.target);
            this.trigger('drop', { event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: 0,
                target: e.target, helper: e.helper, droppedElement: this.target, scopeName: this.scope });
        }
        this.target.classList.remove('e-grabbed');
        this.target = null;
        this.curTarget = null;
        remove(e.helper);
        (getComponent(this.element, Draggable) as Draggable).intDestroy(e.event);
    }
    /**
     * It is used to sort array of elements from source element to destination element.
     * @param destination - Defines the destination element to which the sortable elements needs to be appended.
     * If it is null, then the Sortable library element will be considered as destination.
     * @param targetIndexes - Specifies the sortable elements indexes which needs to be sorted.
     * @param insertBefore - Specifies the index before which the sortable elements needs to be appended.
     * If it is null, elements will be appended as last child.
     * @method moveTo
     * @return {void}
     */
    public moveTo(destination?: HTMLElement, targetIndexes?: number[], insertBefore?: number): void {
        moveTo(this.element, destination, targetIndexes, insertBefore);
    }
    /**
     * It is used to destroy the Sortable library.
     */
    public destroy(): void {
        if (this.itemClass === 'e-sort-item') { this.itemClass = null; this.dataBind(); }
        (getComponent(this.element, Draggable) as Draggable).destroy();
        super.destroy();
    }
    public getModuleName(): string {
        return 'sortable';
    }
    public onPropertyChanged(newProp: SortableModel, oldProp: SortableModel): void {
        for (let prop of Object.keys(newProp)) {
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
 * @private
 */
export function moveTo(from: HTMLElement, to?: HTMLElement, targetIndexes?: number[], insertBefore?: number): void {
    let targetElements: Element[] = [];
    if (!to) { to = from; }
    if (targetIndexes && targetIndexes.length) {
        targetIndexes.forEach((index: number): void => {
             targetElements.push(from.children[index]);
        });
    } else {
        targetElements = [].slice.call(from.children);
    }
    if (isNullOrUndefined(insertBefore)) {
        targetElements.forEach((target: Element): void => {
            to.appendChild(target);
        });
    } else {
        let insertElement: HTMLElement = to.children[insertBefore] as HTMLElement;
        targetElements.forEach((target: Element): void => {
            to.insertBefore(target, insertElement);
        });
    }
}
