import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';
import { Draggable, DragEventArgs } from '@syncfusion/ej2-base';
import { EventHandler, detach, EmitType, Event, addClass, compile} from '@syncfusion/ej2-base';
import { ChipListModel } from './chip-list-model';
import { ChipModel } from './chip';

export const classNames: ClassNames = {
    chipSet: 'e-chip-set',
    chip: 'e-chip',
    avatar: 'e-chip-avatar',
    text: 'e-chip-text',
    icon: 'e-chip-icon',
    delete: 'e-chip-delete',
    deleteIcon: 'e-dlt-btn',
    multiSelection: 'e-multi-selection',
    singleSelection: 'e-selection',
    active: 'e-active',
    chipWrapper: 'e-chip-avatar-wrap',
    iconWrapper: 'e-chip-icon-wrap',
    focused: 'e-focused',
    disabled: 'e-disabled',
    rtl: 'e-rtl',
    template: 'e-chip-template',
    chipList: 'e-chip-list',
    customIcon: 'e-icons',
    chipDrag: 'e-chip-drag',
    dragAndDrop: 'e-drag-and-drop',
    dropRestricted: 'e-error-treeview',
    cloneChip: 'e-clone-chip',
    dragIndicator: 'e-drag-indicator'
};

/**
 * ```props
 * index :- Refers to the position of the selected chip in the list of chips
 * value :- Refers to the underlying data value associated with the selected chip.
 * text :-Refers to the displayed text on the selected chip.
 * ```
 */
export type selectionType = 'index' | 'value' | 'text';

/**
 * ```props
 * Single :- Allows the user to select single chip at the same time.
 * Multiple :- Allows the user to select multiple chips at the same time.
 * None :- Chips are displayed as read-only.
 * ```
 */
export type Selection = 'Single' | 'Multiple' | 'None';

export interface ClassNames {
    chipSet: string;
    chip: string;
    avatar: string;
    text: string;
    icon: string;
    delete: string;
    deleteIcon: string;
    multiSelection: string;
    singleSelection: string;
    active: string;
    chipWrapper: string;
    iconWrapper: string;
    focused: string;
    disabled: string;
    rtl: string;
    template: string;
    chipList: string;
    customIcon: string;
    chipDrag: string;
    dragAndDrop: string;
    dropRestricted: string;
    cloneChip: string;
    dragIndicator: string;
}

interface ChipFields {
    text: string;
    cssClass: string;
    avatarText: string;
    avatarIconCss: string;
    htmlAttributes: { [key: string]: string };
    leadingIconCss: string;
    trailingIconCss: string;
    enabled: boolean;
    value: string | number | null;
    leadingIconUrl: string;
    trailingIconUrl: string;
    template: string | Function;
}

interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line
    ej2_instances: Object[];
}

export interface SelectedItems {
    /**
     * It denotes the selected items text.
     */
    texts: string[];

    /**
     * It denotes the selected items index.
     */
    Indexes: number[];

    /**
     * It denotes the selected items data.
     */
    data: string[] | number[] | ChipModel[];

    /**
     * It denotes the selected items element.
     */
    elements: HTMLElement[];
}

export interface SelectedItem {
    /**
     * It denotes the selected item text.
     */
    text: string;

    /**
     * It denotes the selected item index.
     */
    index: number;

    /**
     * It denotes the selected item data.
     */
    data: string | number | ChipModel;

    /**
     * It denotes the selected item element.
     */
    element: HTMLElement;
}

export interface ClickEventArgs {
    /**
     * It denotes the clicked item text.
     */
    text: string;

    /**
     * It denotes the clicked item index.
     */
    index?: number;

    /**
     * It denotes the clicked item data.
     */
    data: string | number | ChipModel;

    /**
     * It denotes the clicked item element.
     */
    element: HTMLElement;

    /**
     * It denotes whether the clicked item is selected or not.
     */
    selected?: boolean;

    /**
     * It denotes whether the item can be clicked or not.
     */
    cancel: boolean;

    /**
     * It denotes the event.
     */
    event: MouseEventArgs | KeyboardEventArgs;
}

export interface DeleteEventArgs {
    /**
     * It denotes the deleted item text.
     */
    text: string;

    /**
     * It denotes the deleted item index.
     */
    index: number;

    /**
     * It denotes the deleted item data.
     */
    data: string | number | ChipModel;

    /**
     * It denotes the deleted Item element.
     */
    element: HTMLElement;

    /**
     * It denotes whether the item can be deleted or not.
     */
    cancel: boolean;

    /**
     * It denotes the event.
     */
    event: MouseEventArgs | KeyboardEventArgs;
}

export interface ChipDeletedEventArgs {
    /**
     * Specifies the text value of the deleted chip item.
     */
    text: string;

    /**
     * Specifies the index value of the deleted chip item.
     */
    index: number;

    /**
     * Specifies the data of the deleted chip item.
     */
    data: string | number | ChipModel;
}

export interface DragAndDropEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     *
     * @default false
     */
    cancel?: boolean;

    /** Return the actual event. */
    event: MouseEvent & TouchEvent;

    /** Return the currently dragged chip item. */
    draggedItem: HTMLElement;

    /** Return the currently dragged chip item details as array of JSON object */
    draggedItemData: { [key: string]: Object };

    /** Return the dragged element destination target. */
    dropTarget: HTMLElement;
}

export interface ChipDataArgs {
    /**
     * It denotes the item text.
     */
    text: string | undefined;

    /**
     * It denotes the Item index.
     */
    index: number;

    /**
     * It denotes the item data.
     */
    data: string | number | ChipModel;

    /**
     * It denotes the item element.
     */
    element: HTMLElement;
}


/**
 * A chip component is a small block of essential information, mostly used on contacts or filter tags.
 * ```html
 * <div id="chip"></div>
 * ```
 * ```typescript
 * <script>
 * var chipObj = new ChipList();
 * chipObj.appendTo("#chip");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class ChipList extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * This chips property helps to render ChipList component.
     * {% codeBlock src='chips/chips/index.md' %}{% endcodeBlock %}
     *
     * @default []
     *
     */
    @Property([])
    public chips: string[] | number[] | ChipModel[];

    /**
     * Specifies the text content for the chip.
     * {% codeBlock src='chips/text/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * {% codeBlock src='chips/avatarText/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public avatarText: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * {% codeBlock src='chips/avatarIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public avatarIconCss: string;

    /**
     * Allows additional HTML attributes such as aria labels, title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * {% codeBlock src='chiplist/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property('')
    public htmlAttributes: { [key: string]: string };

    /**
     * Specifies the leading icon CSS class for the chip.
     * {% codeBlock src='chips/leadingIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public leadingIconCss: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * {% codeBlock src='chips/trailingIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public trailingIconCss: string;

    /**
     * Specifies the leading icon url for the chip.
     *
     * @default ''
     */
    @Property('')
    public leadingIconUrl: string;

    /**
     * Specifies the trailing icon url for the chip.
     *
     * @default ''
     */
    @Property('')
    public trailingIconUrl: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * {% codeBlock src='chips/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Sets or gets the selected chip items in the chip list.
     * {% codeBlock src='chips/selectedChips/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public selectedChips: string[] | number[] | number;

    /**
     * Defines the selection type of the chip. The available types are:
     *   1. Input chip
     *   2. Choice chip
     *   3. Filter chip
     *   4. Action chip
     *
     * @default 'None'
     */
    @Property('None')
    public selection: Selection;

    /**
     * Enables or disables the delete functionality of a chip.
     * {% codeBlock src='chips/enableDelete/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableDelete: boolean;

    /**
     * Specifies a boolean value that indicates whether the chip item can be dragged and reordered.
     * This enables drag-and-drop functionality within a single container or across multiple containers of chips when dragging is enabled.
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Specifies the target in which the draggable element can be moved and dropped.
     * By default, the draggable element movement occurs in the page.
     *
     * @default null
     */
    @Property(null)
    public dragArea: HTMLElement | string;

    /**
     * Triggers when the component is created successfully.
     * {% codeBlock src='chips/created/index.md' %}{% endcodeBlock %}
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when a chip is clicked.
     * {% codeBlock src='chips/click/index.md' %}{% endcodeBlock %}
     *
     * @event click
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Triggers before the click event of the chip is fired.
     * This event can be used to prevent the further process and restrict the click action over a chip.
     *
     * {% codeBlock src='chips/beforeClick/index.md' %}{% endcodeBlock %}
     *
     * @event beforeClick
     */
    @Event()
    public beforeClick: EmitType<ClickEventArgs>;

    /**
     * Fires before removing the chip element.
     * {% codeBlock src='chips/delete/index.md' %}{% endcodeBlock %}
     *
     * @event delete
     */
    @Event()
    public delete: EmitType<DeleteEventArgs>;

    /**
     * Triggers when the chip item is removed.
     * {% codeBlock src='chips/deleted/index.md' %}{% endcodeBlock %}
     *
     * @event deleted
     */
    @Event()
    public deleted: EmitType<ChipDeletedEventArgs>;

    /**
     * Fires when a chip item starts moving due to a drag action.
     *
     * @event dragStart
     */
    @Event()
    public dragStart: EmitType<DragAndDropEventArgs>;

    /**
     * Fires while a chip item is being dragged.
     *
     * @event dragging
     */
    @Event()
    public dragging: EmitType<DragAndDropEventArgs>;

    /**
     * Fires when a chip item is reordered after completing a drag action.
     *
     * @event dragStop
     */
    @Event()
    public dragStop: EmitType<DragAndDropEventArgs>;

    constructor(options?: ChipListModel, element?: string | HTMLElement) {
        super(options, element);
    }

    private rippleFunction: Function;
    private type: string;
    private innerText: string;
    public multiSelectedChip: number[] = [];
    private dragObj: Draggable;
    private dragCollection: Draggable[];
    private dragIndicator: HTMLElement;
    private updatedInstance: HTMLElement;

    /**
     * Initialize the event handler
     *
     * @private
     */

    protected preRender(): void {
        //prerender
    }

    /**
     * To find the chips length.
     *
     * @returns boolean
     * @private
     */

    protected chipType(): boolean {
        return (this.chips && this.chips.length && this.chips.length > 0) as boolean;
    }

    /**
     * To Initialize the control rendering.
     *
     * @returns void
     * @private
     */

    protected render(): void {
        this.type = (!isNullOrUndefined(this.chips) && this.chips.length) ? 'chipset' : (this.text || this.element.innerText ? 'chip' : 'chipset');
        this.setAttributes();
        this.createChip();
        this.setRtl();
        this.select(this.selectedChips);
        this.wireEvent(false);
        this.rippleFunction = rippleEffect(this.element, {
            selector: '.' + classNames.chip
        });
        this.renderComplete();
        this.dragCollection = [];
        if (this.allowDragAndDrop) {
            this.enableDraggingChips();
        }
    }

    private enableDraggingChips(): void {
        let clonedChipElement: HTMLElement;
        const chipElements: NodeListOf<HTMLElement> = this.element.querySelectorAll('.' + classNames.chip);
        chipElements.forEach((chip: HTMLElement, index: number) => {
            this.dragObj = new Draggable(chip, {
                preventDefault: false,
                clone: true,
                dragArea: this.dragArea,
                helper: () => {
                    clonedChipElement = chip.cloneNode(true) as HTMLElement;
                    clonedChipElement.classList.add(classNames.cloneChip);
                    this.element.appendChild(clonedChipElement);
                    return clonedChipElement;
                },
                dragStart: (args: DragEventArgs) => {
                    this.dragIndicator = this.createElement('div', { className: classNames.dragIndicator });
                    document.body.appendChild(this.dragIndicator);
                    const chipData: ChipDataArgs = this.find(args.element);
                    const dragStartArgs: DragAndDropEventArgs = {
                        cancel: false,
                        event: args.event,
                        draggedItem: args.element,
                        draggedItemData: chipData as any,
                        dropTarget: null
                    };
                    this.trigger('dragStart', dragStartArgs, () => {
                        if (isNullOrUndefined(dragStartArgs.cancel)) {
                            dragStartArgs.cancel = false;
                        }
                    });
                    if (!dragStartArgs.cancel) {
                        clonedChipElement.setAttribute('drag-indicator-index', index.toString());
                    } else {
                        this.dragObj.intDestroy(args.event);
                    }
                },
                drag: (args: DragEventArgs) => {
                    const chipData: ChipDataArgs = this.find(args.element);
                    const draggingArgs: DragAndDropEventArgs = {
                        event: args.event,
                        draggedItem: args.element,
                        draggedItemData: chipData as any,
                        dropTarget: null
                    };
                    this.trigger('dragging', draggingArgs);
                    let draggingIconEle: HTMLElement | null = clonedChipElement.querySelector('.' + classNames.chipDrag);
                    if (isNullOrUndefined(draggingIconEle)) {
                        draggingIconEle = this.createElement('span', { className: `${classNames.customIcon} ${classNames.dragAndDrop} ${classNames.chipDrag}` }) as HTMLElement;
                        clonedChipElement.prepend(draggingIconEle);
                    }
                    this.allowExternalDragging(args, clonedChipElement, draggingIconEle);
                },
                dragStop: (args: DragEventArgs) => {
                    const chipData: ChipDataArgs = this.find(args.element);
                    const dragStopArgs: DragAndDropEventArgs = {
                        cancel: false,
                        event: args.event,
                        draggedItem: args.element,
                        draggedItemData: chipData as any,
                        dropTarget: args.target
                    };
                    this.trigger('dragStop', dragStopArgs, () => {
                        if (isNullOrUndefined(dragStopArgs.cancel)) {
                            dragStopArgs.cancel = false;
                        }
                    });
                    if (!dragStopArgs.cancel) {
                        this.allowExternalDrop(args, clonedChipElement);
                    }
                    if (!isNullOrUndefined(this.dragIndicator)) {
                        remove(this.dragIndicator);
                    }
                    if (!isNullOrUndefined(clonedChipElement)) {
                        clonedChipElement.remove();
                    }
                }
            });
            if (this.dragCollection.indexOf(this.dragObj) === -1) {
                this.dragCollection.push(this.dragObj);
            }
        });
    }

    private checkInstance(args: DragEventArgs, context: ChipList): boolean {
        const isInstanceMatched: boolean = !isNullOrUndefined(args.target.closest('.' + classNames.chipList)) &&
        args.target.closest('.' + classNames.chipList).id !== context.element.id;
        if (isInstanceMatched) {
            this.updatedInstance = args.target.closest('.' + classNames.chipList) as HTMLElement;
        }
        return isInstanceMatched;
    }

    private setIcons(currentInstance: ChipList, draggingIconEle: HTMLElement, target: HTMLElement,
                     indicatorEle: HTMLElement, outOfDragArea: boolean): void {
        const isTargetInside: boolean = currentInstance.element.contains(target);
        const isDroppable: Element = target.closest('.e-droppable');
        if ((isTargetInside || isDroppable) && !outOfDragArea) {
            draggingIconEle.classList.add(classNames.dragAndDrop);
            draggingIconEle.classList.remove(classNames.dropRestricted);
            if (isDroppable) {
                indicatorEle.style.display = 'none';
            }
        } else {
            draggingIconEle.classList.remove(classNames.dragAndDrop);
            draggingIconEle.classList.add(classNames.dropRestricted);
            indicatorEle.style.display = 'none';
        }
    }

    private allowExternalDragging(args: DragEventArgs, clonedChipElement: HTMLElement, draggingIconEle: HTMLElement): void {
        let currentInstance: ChipList;
        let closestChip: Element | null = null;
        let closestDistance: number = Infinity;
        let newIndex: number = -1;
        let outOfDragArea: boolean = false;
        if (this.checkInstance(args, this)) {
            this.dragIndicator.style.display = 'none';
            currentInstance = this.getCurrentInstance(args);
            currentInstance.dragIndicator = this.dragIndicator;
            if (!currentInstance.allowDragAndDrop) { return; }
        } else {
            currentInstance = this as ChipList;
        }
        const indicatorEle: HTMLElement = currentInstance.dragIndicator;
        indicatorEle.style.display = 'inline';
        outOfDragArea = this.dragAreaCheck(this.dragArea, args.target, outOfDragArea, draggingIconEle, indicatorEle);
        this.setIcons(currentInstance, draggingIconEle, args.target, indicatorEle, outOfDragArea);
        currentInstance.element.appendChild(clonedChipElement);
        const droppedRect: DOMRect = clonedChipElement.getBoundingClientRect() as DOMRect;
        const allChips: Element[] = Array.from(currentInstance.element.querySelectorAll('.' + classNames.chip));
        allChips.forEach((chip: Element, i: number) => {
            if (chip !== clonedChipElement) {
                const rect: DOMRect = chip.getBoundingClientRect() as DOMRect;
                const distance: number = Math.sqrt(Math.pow(droppedRect.left - rect.left, 2) + Math.pow(droppedRect.top - rect.top, 2));
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestChip = chip;
                    newIndex = i;
                }
            }
        });
        if (newIndex === -1) {
            newIndex = allChips.length;
        }
        const chipsDistance: number = this.getChipsDistance(currentInstance);
        const cloneRect: DOMRect = clonedChipElement.getBoundingClientRect() as DOMRect;
        let rect: DOMRect;
        if (closestChip || allChips.length > 0) {
            const targetChip: Element = closestChip || allChips[allChips.length - 1];
            rect = targetChip.getBoundingClientRect() as DOMRect;
            indicatorEle.style.top = rect.top + window.scrollY + 'px';
            indicatorEle.style.left = currentInstance.enableRtl ? (rect.right + chipsDistance + 'px') :
                (rect.left - chipsDistance + window.scrollX + 'px');
        }
        if (currentInstance.enableRtl) {
            if (cloneRect.left < rect.left - rect.width / 2 && cloneRect.top > rect.top) {
                indicatorEle.style.left = rect.left - chipsDistance + window.scrollX + 'px';
            }
        } else if (cloneRect.left > rect.left + rect.width / 2 && cloneRect.top > rect.top) {
            indicatorEle.style.left = rect.left + rect.width + chipsDistance + window.scrollX + 'px';
        }
    }

    private dragAreaCheck(dragArea: string | HTMLElement, target: HTMLElement, outOfDragArea: boolean,
                          draggingIconEle: HTMLElement, indicatorEle: HTMLElement): boolean {
        if (isNullOrUndefined(dragArea)) {
            return false;
        }
        const isString: boolean = typeof dragArea === 'string';
        const isHtmlElement: boolean = dragArea instanceof HTMLElement;
        const dragAreaElement: string | Element = isString ? document.querySelector(dragArea as string) : dragArea;
        if (!isNullOrUndefined(dragAreaElement)) {
            if ((isString || isHtmlElement) && !(dragAreaElement as HTMLElement).contains(target)) {
                outOfDragArea = true;
                indicatorEle.style.display = 'none';
                draggingIconEle.classList.add(classNames.dropRestricted);
                draggingIconEle.classList.remove(classNames.dragAndDrop);
            }
        }
        return outOfDragArea;
    }

    private getChipsDistance(currentInstance: ChipList): number {
        const constValue: number = 4;
        if (currentInstance.chips.length <= 1) {
            return constValue;
        }
        let constantDistance: number;
        const firstChipClientRect: DOMRect = currentInstance.find(0).element.getBoundingClientRect() as DOMRect;
        const secondChipClientRect: DOMRect = currentInstance.find(1).element.getBoundingClientRect() as DOMRect;
        const firstChipLeft: number = firstChipClientRect.left;
        if (currentInstance.enableRtl) {
            const secondChipRight: number = secondChipClientRect.right;
            constantDistance = firstChipLeft < secondChipRight ? constValue : ((firstChipLeft - secondChipRight) / 2);
            return constantDistance;
        } else {
            const firstChipWidth: number = firstChipClientRect.width;
            const secondChipLeft: number = secondChipClientRect.left;
            constantDistance = secondChipLeft < (firstChipLeft + firstChipWidth) ?
                constValue : (secondChipLeft - (firstChipLeft + firstChipWidth)) / 2;
            return constantDistance;
        }
    }

    private getCurrentInstance(args: DragEventArgs): ChipList {
        const chipContainer: HTMLElement = args.target.closest('.' + classNames.chipList) as HTMLElement;
        if (!isNullOrUndefined(chipContainer) && !isNullOrUndefined((chipContainer as EJ2Instance).ej2_instances)) {
            for (let i: number = 0; i < (chipContainer as EJ2Instance).ej2_instances.length; i++) {
                if ((chipContainer as EJ2Instance).ej2_instances[parseInt(i.toString(), 10)] instanceof ChipList) {
                    return (chipContainer as EJ2Instance).ej2_instances[i as number] as ChipList;
                }
            }
        }
        return null;
    }

    private allowExternalDrop(args: DragEventArgs, clonedChipElement: HTMLElement): void {
        const originalIndex: number = parseInt(clonedChipElement.getAttribute('drag-indicator-index') as string, 10);
        let currentInstance: ChipList;
        let outOfDragArea: boolean = false;
        let isInstanceChanged: boolean = false;
        if (this.checkInstance(args, this)) {
            isInstanceChanged = true;
            currentInstance = this.getCurrentInstance(args);
            if (!currentInstance.allowDragAndDrop) { return; }
        } else {
            currentInstance = this as ChipList;
        }
        const indicatorEle: HTMLElement = currentInstance.dragIndicator;
        indicatorEle.style.display = 'inline';
        if (!currentInstance.element.contains(args.target)) {
            return;
        }
        outOfDragArea = this.dragAreaCheck(this.dragArea, args.target, outOfDragArea, clonedChipElement.querySelector('.' + classNames.chipDrag), indicatorEle);
        if (outOfDragArea) { return; }
        const indicatorRect: DOMRect = indicatorEle.getBoundingClientRect() as DOMRect;
        const allChips: Element[] = Array.from(currentInstance.element.querySelectorAll('.' + classNames.chip));
        let newIndex: number = -1;
        let topOffset: boolean = false;
        let leftOffset: boolean = false;
        let rightOffset: boolean = false;
        for (let i: number = 0; i < allChips.length; i++) {
            if (allChips[i as number] !== clonedChipElement) {
                const chipRect: DOMRect = allChips[i as number].getBoundingClientRect() as DOMRect;
                topOffset = indicatorRect.top < chipRect.top + chipRect.height / 2;
                leftOffset = indicatorRect.left < chipRect.left + chipRect.width / 2;
                rightOffset = indicatorRect.left > chipRect.left + chipRect.width / 2;
                if ((!currentInstance.enableRtl && topOffset && leftOffset) || (currentInstance.enableRtl && topOffset && rightOffset)) {
                    newIndex = i;
                    if (i > originalIndex && !isInstanceChanged) {
                        newIndex = i - 1;
                    }
                    break;
                }
            }
        }
        if (newIndex === -1) {
            let nextChipIndex: number;
            for (let i: number = 0; i < allChips.length; i++) {
                const chipRect: DOMRect = allChips[i as number].getBoundingClientRect() as DOMRect;
                if ((chipRect.top > indicatorRect.top) || (chipRect.top === indicatorRect.top && chipRect.left > indicatorRect.left)) {
                    nextChipIndex = i as number;
                    break;
                }
            }
            if (nextChipIndex !== allChips.length) {
                newIndex = nextChipIndex;
            } else {
                newIndex = allChips.length;
            }
        }
        const currentChipList: string[] = Array.from(this.chips as string[]);
        if (isInstanceChanged) {
            this.dropChip(currentChipList, originalIndex, currentInstance, newIndex, true);
        } else if (newIndex !== originalIndex) {
            this.dropChip(currentChipList, originalIndex, currentInstance, newIndex, false);
        }
    }

    private dropChip(currentChipList: string[], originalIndex: number, currentInstance: ChipList,
                     newIndex: number, instanceChanged: boolean): void {
        const draggedChip: string = currentChipList.splice(originalIndex, 1)[0];
        if (!instanceChanged) {
            currentChipList.splice(newIndex, 0, draggedChip);
            currentInstance.chips = currentChipList;
        } else {
            const newChips: string[] = Array.from(currentInstance.chips as string[]);
            newChips.splice(newIndex, 0, draggedChip);
            currentInstance.chips = newChips;
        }
        this.chips = currentChipList;
        currentInstance.dataBind();
        this.dataBind();
        currentInstance.enableDraggingChips();
    }

    private createChip(): void {
        this.innerText = (this.element.innerText && this.element.innerText.length !== 0)
            ? this.element.innerText.trim() : this.element.innerText;
        this.element.innerHTML = '';
        this.chipCreation(this.type === 'chip' ? [this.innerText ? this.innerText : this.text] : this.chips);
    }

    private setAttributes(): void {
        if (this.type === 'chip') {
            if (this.enabled)  {this.element.tabIndex = 0; }
            this.element.setAttribute('role', 'button');
        } else {
            this.element.classList.add(classNames.chipSet);
            this.element.setAttribute('role', 'listbox');
            if (this.selection === 'Multiple') {
                this.element.classList.add(classNames.multiSelection);
                this.element.setAttribute('aria-multiselectable', 'true');
            } else if (this.selection === 'Single') {
                this.element.classList.add(classNames.singleSelection);
                this.element.setAttribute('aria-multiselectable', 'false');
            } else {
                this.element.setAttribute('aria-multiselectable', 'false');
            }
        }
    }

    private setRtl(): void {
        this.element.classList[this.enableRtl ? 'add' : 'remove'](classNames.rtl);
    }

    private renderTemplates(): void {
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    private templateParser(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    private chipCreation(data: string[] | number[] | ChipModel[]): void {
        if (isNullOrUndefined(data)) { return; }
        let chipListArray: HTMLElement[] = [];
        const attributeArray: { [key: string]: string; }[] = [];
        for (let i: number = 0; i < data.length; i++) {
            const fieldsData: ChipFields = this.getFieldValues(data[i as number]);
            const attributesValue: { [key: string]: string; } = fieldsData.htmlAttributes;
            attributeArray.push(attributesValue);
            const chipArray: HTMLElement[] = this.elementCreation(fieldsData);
            const className: string[] = (classNames.chip + ' ' + (fieldsData.enabled ? ' ' : classNames.disabled) + ' ' +
                (fieldsData.avatarIconCss || fieldsData.avatarText ? classNames.chipWrapper : (fieldsData.leadingIconCss ?
                    classNames.iconWrapper : ' ')) + ' ' + fieldsData.cssClass).split(' ').filter((css: string) => css);
            if (!this.chipType() || this.type === 'chip') {
                chipListArray = chipArray;
                addClass([this.element], className);
                this.element.setAttribute('aria-label', fieldsData.text);
                if (fieldsData.value) {
                    this.element.setAttribute('data-value', fieldsData.value.toString());
                }
            } else {
                const wrapper: HTMLElement = this.createElement('DIV', {
                    className: className.join(' '), attrs: {
                        tabIndex: '0', role: 'option',
                        'aria-label': fieldsData.text, 'aria-selected': 'false'
                    }
                });
                if (this.enableDelete) { wrapper.setAttribute('aria-keyshortcuts', 'Press delete or backspace key to delete'); }
                if (fieldsData.value) {
                    wrapper.setAttribute('data-value', fieldsData.value.toString());
                }
                if (fieldsData.enabled) { wrapper.setAttribute('aria-disabled', 'false'); }
                else {
                    wrapper.removeAttribute('tabindex');
                    wrapper.setAttribute('aria-disabled', 'true');
                }
                if (!isNullOrUndefined(attributeArray[i as number])) {
                    if (attributeArray.length > i && Object.keys(attributeArray[i as number]).length) {
                        let htmlAttr: string[] = [];
                        htmlAttr = (Object.keys(attributeArray[i as number]));
                        for (let j: number = 0; j < htmlAttr.length; j++) {
                            wrapper.setAttribute(htmlAttr[j as number], attributeArray[i as number][htmlAttr[j as number]]);
                        }
                    }
                }
                append(chipArray, wrapper);
                chipListArray.push(wrapper);
            }
        }
        append(chipListArray, this.element);
    }

    private getFieldValues(data: string | number | ChipModel): ChipFields {
        const chipEnabled: boolean = !(this.enabled.toString() === 'false');
        const fields: ChipFields = {
            text: typeof data === 'object' ? (data.text ? data.text.toString() : this.text.toString()) :
                (!this.chipType() ? (this.innerText ? this.innerText : this.text.toString()) : data.toString()),
            cssClass: typeof data === 'object' ? (data.cssClass ? data.cssClass.toString() : this.cssClass.toString()) :
                (this.cssClass.toString()),
            leadingIconCss: typeof data === 'object' ? (data.leadingIconCss ? data.leadingIconCss.toString() :
                this.leadingIconCss.toString()) : (this.leadingIconCss.toString()),
            avatarIconCss: typeof data === 'object' ? (data.avatarIconCss ? data.avatarIconCss.toString() :
                this.avatarIconCss.toString()) : (this.avatarIconCss.toString()),
            avatarText: typeof data === 'object' ? (data.avatarText ? data.avatarText.toString() : this.avatarText.toString()) :
                (this.avatarText.toString()),
            trailingIconCss: typeof data === 'object' ? (data.trailingIconCss ? data.trailingIconCss.toString() :
                this.trailingIconCss.toString()) : (this.trailingIconCss.toString()),
            enabled: typeof data === 'object' ? (data.enabled !== undefined ? (data.enabled.toString() === 'false' ? false : true) :
                chipEnabled) : (chipEnabled),
            value: typeof data === 'object' ? ((data.value ? data.value.toString() : null)) : null,
            leadingIconUrl: typeof data === 'object' ? (data.leadingIconUrl ? data.leadingIconUrl.toString() : this.leadingIconUrl) :
                this.leadingIconUrl,
            trailingIconUrl: typeof data === 'object' ? (data.trailingIconUrl ? data.trailingIconUrl.toString() : this.trailingIconUrl) :
                this.trailingIconUrl,
            htmlAttributes: typeof data === 'object' ? (data.htmlAttributes ? data.htmlAttributes : this.htmlAttributes) : this.htmlAttributes,
            template: typeof data === 'object' ? (data.template ? data.template : null) : null
        };
        return fields;
    }

    private elementCreation(fields: ChipFields): HTMLElement[] {
        const chipArray: HTMLElement[] = [];
        if (fields.avatarText || fields.avatarIconCss) {
            const className: string = (classNames.avatar + ' ' + fields.avatarIconCss).trim();
            const chipAvatarElement: HTMLElement = this.createElement('span', { className: className });
            chipAvatarElement.innerText = fields.avatarText;
            chipArray.push(chipAvatarElement);
        } else if (fields.leadingIconCss) {
            const className: string = (classNames.icon + ' ' + fields.leadingIconCss).trim();
            const chipIconElement: HTMLElement = this.createElement('span', { className: className });
            chipArray.push(chipIconElement);
        } else if (fields.leadingIconUrl) {
            const className: string = (classNames.avatar + ' ' + 'image-url').trim();
            const chipIconElement: HTMLElement = this.createElement('span', { className: className});
            chipIconElement.style.backgroundImage = 'url(' + fields.leadingIconUrl + ')';
            chipArray.push(chipIconElement);
        }
        const chipTextElement: HTMLElement = this.createElement('span', { className: classNames.text });
        chipTextElement.innerText = fields.text;
        chipArray.push(chipTextElement);

        if (fields.template) {
            const templateWrapper: HTMLElement = this.createElement('div', { className: classNames.template });
            const templateContent: HTMLElement[] = this.templateParser(fields.template)(fields, this, 'template', this.element.id + '_template', false);
            append(templateContent, templateWrapper);
            chipArray.push(templateWrapper);
            this.renderTemplates();
        }

        if (fields.trailingIconCss || (this.chipType() && this.enableDelete)) {
            const className: string = (classNames.delete + ' ' +
                (fields.trailingIconCss ? fields.trailingIconCss : classNames.deleteIcon)).trim();
            const chipdeleteElement: HTMLElement = this.createElement('span', { className: className });
            chipArray.push(chipdeleteElement);
        } else if (fields.trailingIconUrl) {
            const className: string = ('trailing-icon-url').trim();
            const chipIconsElement: HTMLElement = this.createElement('span', { className: className });
            chipIconsElement.style.backgroundImage = 'url(' + fields.trailingIconUrl + ')';
            chipArray.push(chipIconsElement);
        }
        return chipArray;
    }

    /**
     * A function that finds chip based on given input.
     *
     * @param  {number | HTMLElement } fields - We can pass index number or element of chip.
     * {% codeBlock src='chips/find/index.md' %}{% endcodeBlock %}
     *
     *  @returns {void}
     */

    public find(fields: number | HTMLElement): ChipDataArgs {
        const chipData : ChipDataArgs = {text: '', index: -1, element: this.element, data: ''};
        const chipElement: HTMLElement = fields instanceof HTMLElement ?
            fields as HTMLElement : this.element.querySelectorAll('.' + classNames.chip)[fields as number] as HTMLElement;
        if (chipElement && this.chipType()) {
            chipData.index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipElement);
            const chip: string | number | ChipModel = this.chips[chipData.index as number];
            if (typeof chip === 'object' && chip !== null) {
                const chipModel: ChipModel = chip as ChipModel;
                if (chipModel.text !== undefined) {
                    chipData.text = chipModel.text.toString();
                }
            } else if (chip !== undefined) {
                chipData.text = chip.toString();
            }
            chipData.data = chip;
            chipData.element = chipElement;
        }
        return chipData;
    }

    /**
     * Allows adding the chip item(s) by passing a single or array of string, number, or ChipModel values.
     *
     * @param  {string[] | number[] | ChipModel[] | string | number | ChipModel} chipsData - We can pass array of string or
     *  array of number or array of chip model or string data or number data or chip model.
     * {% codeBlock src='chips/add/index.md' %}{% endcodeBlock %}
     *
     * @returns {void}
     * @deprecated
     */

    public add(chipsData: string[] | number[] | ChipModel[] | string | number | ChipModel): void {
        if (this.type !== 'chip') {
            const fieldData: string[] | number[] | ChipModel[] = chipsData instanceof Array ?
                chipsData : <string[] | number[] | ChipModel[]>[chipsData as string | number | ChipModel];
            this.chips = [].slice.call(this.chips).concat(...fieldData as ChipModel[]);
            this.chipCreation(fieldData);
        }
    }

    /**
     * Allows selecting the chip item(s) by passing a single or array of string, number, or ChipModel values.
     *
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     * {% codeBlock src='chips/select/index.md' %}{% endcodeBlock %}
     *
     *  @returns {void}
     */

    public select(fields: number | number[] | HTMLElement | HTMLElement[] | string[], selectionType?: selectionType): void {
        this.onSelect(fields, false, selectionType);
    }

    private multiSelection(newProp: number[] | string[]): void {
        const items: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.chip);
        for (let j: number = 0; j < newProp.length; j++) {
            if (typeof newProp[j as number] === 'string') {
                for (let k: number = 0; k < items.length; k++) {
                    if (newProp[j as number] !== k) {
                        if (newProp[j as number] === items[k as number].attributes[5].value) {
                            this.multiSelectedChip.push(k);
                            break;
                        }
                    }
                }
            } else {
                this.multiSelectedChip.push(newProp[j as number] as number);
            }
        }
    }

    private onSelect(fields: number | number[] | HTMLElement | HTMLElement[] | string[],
                     callFromProperty: boolean, selectionType?: selectionType): void {
        let index: number;
        let chipNodes: HTMLElement;
        let chipValue: string | number | null = null;
        if (this.chipType() && this.selection !== 'None') {
            if (callFromProperty) {
                const chipElements: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.chip);
                for (let i: number = 0; i < chipElements.length; i++) {
                    chipElements[i as number].setAttribute('aria-selected', 'false');
                    chipElements[i as number].classList.remove(classNames.active);
                }
            }
            const fieldData: number[] | HTMLElement[] | string[] = fields instanceof Array ? fields : <number[] | HTMLElement[]>[fields];
            for (let i: number = 0; i < fieldData.length; i++) {
                let chipElement: HTMLElement = fieldData[i as number] instanceof HTMLElement ? fieldData[i as number] as HTMLElement
                    : this.element.querySelectorAll('.' + classNames.chip)[fieldData[i as number] as number] as HTMLElement;
                if (selectionType !== 'index') {
                    for (let j: number = 0; j < this.chips.length; j++) {
                        chipNodes = this.element.querySelectorAll('.' + classNames.chip)[j as number] as HTMLElement;
                        const fieldsData: ChipFields = this.getFieldValues(this.chips[j as number]);
                        if (selectionType === 'value') {
                            if (fieldsData.value !== null) {
                                chipValue = chipNodes.dataset.value as string | number;
                            }
                        } else if (selectionType === 'text') {
                            chipValue = chipNodes.innerText;
                        }
                        if (chipValue === fieldData[i as number].toString()) {
                            index = j;
                            chipElement = this.element.querySelectorAll('.' + classNames.chip)[index as number] as HTMLElement;
                        }
                    }
                }
                if (chipElement instanceof HTMLElement) {
                    this.selectionHandler(chipElement);
                }
            }
        }
    }

    /**
     * Allows removing the chip item(s) by passing a single or array of string, number, or ChipModel values.
     *
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     * {% codeBlock src='chips/remove/index.md' %}{% endcodeBlock %}
     *
     *  @returns {void}
     */

    public remove(fields: number | number[] | HTMLElement | HTMLElement[]): void {
        if (this.chipType()) {
            const fieldData: number[] | HTMLElement[] = fields instanceof Array ? fields : <number[] | HTMLElement[]>[fields];
            const chipElements: HTMLElement[] = [];
            const chipCollection: NodeListOf<HTMLElement> = this.element.querySelectorAll('.' + classNames.chip);
            (fieldData as HTMLElement[]).forEach((data: HTMLElement | number) => {
                const chipElement: HTMLElement = data instanceof HTMLElement ? data as HTMLElement
                    : chipCollection[data as number] as HTMLElement;
                if (chipElement instanceof HTMLElement) {
                    chipElements.push(chipElement);
                }
            });
            chipElements.forEach((element: HTMLElement) => {
                const chips: NodeListOf<HTMLElement> = this.element.querySelectorAll('.' + classNames.chip);
                const index: number = Array.prototype.slice.call(chips).indexOf(element);
                this.deleteHandler(element, index);
            });
        }
    }

    /**
     * Returns the selected chip(s) data.
     * {% codeBlock src='chips/getSelectedChips/index.md' %}{% endcodeBlock %}
     *
     *  @returns {void}
     */

    public getSelectedChips(): SelectedItem | SelectedItems | undefined{
        let selectedChips: SelectedItem | SelectedItems | undefined;
        if (this.chipType() && this.selection !== 'None') {
            const selectedItems: SelectedItems = { texts: [], Indexes: [], data: [], elements: [] };
            const items: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.active);
            for (let i: number = 0; i < items.length; i++) {
                const chip: HTMLElement = items[i as number] as HTMLElement;
                selectedItems.elements.push(chip);
                const index: number = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chip);
                selectedItems.Indexes.push(index);
                (selectedItems.data as ChipModel[]).push((this.chips as ChipModel[])[index as number]);
                const text: string | null | undefined = typeof this.chips[index as number] === 'object' ?
                    (this.chips[index as number] as ChipModel).text ? (this.chips[index as number] as ChipModel).text
                        : null : this.chips[index as number].toString();
                selectedItems.texts.push(text as string);
            }
            const selectedItem: SelectedItem = {
                text: selectedItems.texts[0], index: selectedItems.Indexes[0],
                data: selectedItems.data[0], element: selectedItems.elements[0]
            };
            selectedChips = !isNullOrUndefined(selectedItem.index) ?
                (this.selection === 'Multiple' ? selectedItems : selectedItem) : undefined;
        }
        return selectedChips;
    }

    private wireEvent(unWireEvent: boolean): void {
        if (!unWireEvent) {
            EventHandler.add(this.element, 'click', this.clickHandler, this);
            EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
            EventHandler.add(this.element, 'keydown', this.keyHandler, this);
            EventHandler.add(this.element, 'keyup', this.keyHandler, this);
        } else {
            EventHandler.remove(this.element, 'click', this.clickHandler);
            EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
            EventHandler.remove(this.element, 'keydown', this.keyHandler);
            EventHandler.remove(this.element, 'keyup', this.keyHandler);
        }
    }
    private keyHandler(e: KeyboardEventArgs): void {
        if ((e.target as HTMLElement).classList.contains(classNames.chip)) {
            if (e.type === 'keydown') {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    this.clickHandler(e);
                } else if ((e.keyCode === 46 || e.keyCode === 8) && this.enableDelete) {
                    this.clickHandler(e, true);
                }
            } else if (e.keyCode === 9) {
                this.focusInHandler(e.target as HTMLElement);
            }
        }
    }

    private focusInHandler(chipWrapper: HTMLElement): void {
        if (!chipWrapper.classList.contains(classNames.focused)) {
            chipWrapper.classList.add(classNames.focused);
        }
    }

    private focusOutHandler(e: MouseEventArgs): void {
        const chipWrapper: HTMLElement = <HTMLElement>closest((e.target as HTMLElement), '.' + classNames.chip);
        const focusedElement: HTMLElement | null = !this.chipType() ? (this.element.classList.contains(classNames.focused) ?
            this.element : null) : this.element.querySelector('.' + classNames.focused);
        if (chipWrapper && focusedElement) {
            focusedElement.classList.remove(classNames.focused);
        }
    }

    private clickHandler(e: MouseEventArgs | KeyboardEventArgs, del: boolean = false): void {
        const chipWrapper: HTMLElement = <HTMLElement>closest((e.target as HTMLElement), '.' + classNames.chip);
        if (chipWrapper) {
            let chipDataArgs: object;
            if (this.chipType()) {
                chipDataArgs = this.find(chipWrapper);
            } else {
                const index: number = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipWrapper);
                chipDataArgs = {
                    text: this.innerText ? this.innerText : this.text,
                    element: chipWrapper, data: this.text, index: index
                };
            }
            (chipDataArgs as ClickEventArgs).event = e;
            (chipDataArgs as ClickEventArgs).cancel = false;
            this.trigger('beforeClick', chipDataArgs as ClickEventArgs, (observedArgs: ClickEventArgs) => {
                if (!(observedArgs as ClickEventArgs).cancel) {
                    this.clickEventHandler(observedArgs.element, e, del);
                }
            });
        }
    }

    private clickEventHandler(chipWrapper: HTMLElement, e: MouseEventArgs | KeyboardEventArgs, del: boolean): void {
        if (this.chipType()) {
            const chipData: ChipDataArgs = this.find(chipWrapper);
            (chipData as ClickEventArgs).event = e;
            const deleteElement: HTMLElement | undefined = (e.target as HTMLElement).classList.contains(classNames.deleteIcon) ?
                e.target as HTMLElement : (del ? chipWrapper.querySelector('.' + classNames.deleteIcon) as HTMLElement : undefined);
            if (deleteElement && this.enableDelete) {
                (chipData as DeleteEventArgs).cancel = false;
                const deletedItemArgs: DeleteEventArgs = chipData as DeleteEventArgs;
                this.trigger('delete', deletedItemArgs, (observedArgs: DeleteEventArgs) => {
                    if (!observedArgs.cancel) {
                        this.deleteHandler(observedArgs.element, observedArgs.index);
                        this.selectionHandler(chipWrapper);
                        (chipData as ClickEventArgs).selected = observedArgs.element.classList.contains(classNames.active);
                        const selectedItemArgs: ClickEventArgs = chipData as ClickEventArgs;
                        this.trigger('click', selectedItemArgs);
                        const chipElement: HTMLElement = this.element.querySelectorAll('.' + classNames.chip)[observedArgs.index] as HTMLElement;
                        if (chipElement) {
                            chipElement.focus();
                            this.focusInHandler(chipElement);
                        }
                    }
                });
            } else if (this.selection !== 'None') {
                this.selectionHandler(chipWrapper);
                (chipData as ClickEventArgs).selected = chipWrapper.classList.contains(classNames.active);
                const selectedItemArgs: ClickEventArgs = chipData as ClickEventArgs;
                this.trigger('click', selectedItemArgs);
            } else {
                this.focusInHandler(chipWrapper);
                const clickedItemArgs: ClickEventArgs = chipData as ClickEventArgs;
                this.trigger('click', clickedItemArgs);
            }
        } else {
            this.focusInHandler(chipWrapper);
            const clickedItemArgs: ClickEventArgs = {
                text: this.innerText ? this.innerText : this.text,
                element: chipWrapper, data: this.text, event: e
            } as ClickEventArgs;
            this.trigger('click', clickedItemArgs);
        }
    }

    private selectionHandler(chipWrapper: HTMLElement): void {
        if (this.selection === 'Single') {
            const activeElement: HTMLElement = this.element.querySelector('.' + classNames.active) as HTMLElement;
            if (activeElement && activeElement !== chipWrapper) {
                activeElement.classList.remove(classNames.active);
                activeElement.setAttribute('aria-selected', 'false');
            }
            this.setProperties({ selectedChips: null }, true);
        } else {
            this.setProperties({ selectedChips: [] }, true);
        }
        if (chipWrapper.classList.contains(classNames.active)) {
            chipWrapper.classList.remove(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'false');
        } else {
            chipWrapper.classList.add(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'true');
        }
        this.updateSelectedChips();
    }

    private updateSelectedChips(): void {
        const chipListEle: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.chip);
        const chipCollIndex: number[] = [];
        const chipCollValue: string[] = [];
        let chip: string | number | null = null;
        let value: string | null = null;
        for (let i: number = 0; i < chipListEle.length; i++) {
            const selectedEle: Element = this.element.querySelectorAll('.' + classNames.chip)[i as number];
            if (selectedEle.getAttribute('aria-selected') === 'true') {
                value = selectedEle.getAttribute('data-value');
                if (this.selection === 'Single' && selectedEle.classList.contains('e-active')) {
                    chip = value ? value : i;
                    break;
                } else {
                    chip = value ? chipCollValue.push(value) : chipCollIndex.push(i);
                }
            }
        }
        this.setProperties({ selectedChips: this.selection === 'Single' ? chip : value ? chipCollValue : chipCollIndex }, true);
    }

    private deleteHandler(chipWrapper: HTMLElement, index: number): void {
        // Used to store the deleted chip item details.
        const deletedChipData: ChipDataArgs = this.find(chipWrapper);
        this.chips.splice(index, 1);
        this.setProperties({ chips: this.chips }, true);
        detach(chipWrapper);
        this.trigger('deleted', deletedChipData as ChipDeletedEventArgs);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * {% codeBlock src='chips/destroy/index.md' %}{% endcodeBlock %}
     *
     *  @returns {void}
     */

    public destroy(): void {
        for (let i: number = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i as number].destroy();
        }
        this.dragCollection = [];
        this.clearTemplate();
        removeClass([this.element], [classNames.chipSet, classNames.chip, classNames.rtl,
            classNames.multiSelection, classNames.singleSelection, classNames.disabled, classNames.chipWrapper, classNames.iconWrapper,
            classNames.active, classNames.focused].concat(this.cssClass ? this.cssClass.toString().split(' ').filter((css: string) => css) : []));
        this.removeMultipleAttributes(['tabindex', 'role', 'aria-label', 'aria-multiselectable'], this.element);
        this.wireEvent(true);
        this.rippleFunction();
        super.destroy();
        this.element.innerHTML = '';
        this.element.innerText = this.innerText;
    }

    private removeMultipleAttributes(attributes: string[], element: HTMLElement): void {
        attributes.forEach((attr: string) => {
            element.removeAttribute(attr);
        });
    }
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    public getModuleName(): string {
        return 'chip-list';
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @returns void
     * @private
     */

    public onPropertyChanged(newProp: ChipList, oldProp: ChipList): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'chips':
            case 'text':
            case 'avatarText':
            case 'avatarIconCss':
            case 'leadingIconCss':
            case 'trailingIconCss':
            case 'selection':
            case 'enableDelete':
            case 'enabled':
                this.refresh();
                break;
            case 'cssClass':
                if (!this.chipType()) {
                    removeClass([this.element], oldProp.cssClass.toString().split(' ').filter((css: string) => css));
                    addClass([this.element], newProp.cssClass.toString().split(' ').filter((css: string) => css));
                } else {
                    this.refresh();
                }
                break;
            case 'selectedChips':
                removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
                if (this.selection === 'Multiple') {
                    this.multiSelectedChip = [];
                    this.multiSelection(newProp.selectedChips as number[] | string[]);
                    this.onSelect(this.multiSelectedChip, true);
                    this.updateSelectedChips();
                } else {
                    this.onSelect(newProp.selectedChips, true);
                }
                break;
            case 'enableRtl':
                this.setRtl();
                break;
            case 'allowDragAndDrop':
                for (let i: number = 0; i < this.dragCollection.length; i++) {
                    this.dragCollection[i as number].destroy();
                }
                this.dragCollection = [];
                if (this.allowDragAndDrop) {
                    this.enableDraggingChips();
                }
                break;
            case 'dragArea':
                if (this.allowDragAndDrop) {
                    for (let i: number = 0; i < this.dragCollection.length; i++) {
                        this.dragCollection[i as number].dragArea = this.dragArea;
                    }
                }
                break;
            }
        }
    }
}
