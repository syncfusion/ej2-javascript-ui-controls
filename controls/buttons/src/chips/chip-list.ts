import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined } from '@syncfusion/ej2-base';
import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';
import { EventHandler, detach, EmitType, Event, addClass, isBlazor, getElement } from '@syncfusion/ej2-base';
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
};

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
}

interface ChipFields {
    text: string;
    cssClass: string;
    avatarText: string;
    avatarIconCss: string;
    leadingIconCss: string;
    trailingIconCss: string;
    enabled: boolean;
    value: string | number;
    leadingIconUrl: string;
    trailingIconUrl: string;
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

export interface ChipDataArgs {
    /**
     * It denotes the item text.
     */
    text: string;

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
     * @default []
     * @blazorType List<ChipListChip>
     */
    @Property([])
    public chips: string[] | number[] | ChipModel[];

    /**
     * Specifies the text content for the chip.
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * @default ''
     */
    @Property('')
    public avatarText: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * @default ''
     */
    @Property('')
    public avatarIconCss: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     * @default ''
     */
    @Property('')
    public leadingIconCss: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * @default ''
     */
    @Property('')
    public trailingIconCss: string;

    /**
     * Specifies the trailing icon url for the chip.
     * @default ''
     */
    @Property('')
    public leadingIconUrl: string;

    /**
     * Specifies the trailing icon url for the chip.
     * @default ''
     */
    @Property('')
    public trailingIconUrl: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Sets or gets the selected chip items in the chip list.
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
     * @default 'None'
     */
    @Property('None')
    public selection: Selection;

    /**
     * Enables or disables the delete functionality of a chip.
     * @default false
     */
    @Property(false)
    public enableDelete: boolean;

    /**
     * Triggers when the component is created successfully.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when a chip is clicked.
     * @event
     * @blazorProperty 'OnClick'
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Triggers before the click event of the chip is fired. 
     * This event can be used to prevent the further process and restrict the click action over a chip.
     * @event
     * @blazorProperty 'OnBeforeClick'
     */
    @Event()
    public beforeClick: EmitType<ClickEventArgs>;

    /**
     * Fires before removing the chip element.
     * @event
     * @blazorProperty 'OnDelete'
     */
    @Event()
    public delete: EmitType<DeleteEventArgs>;

    constructor(options?: ChipListModel, element?: string | HTMLElement) {
        super(options, element);
    }

    private rippleFunction: Function;
    private type: string;
    private innerText: string;
    public multiSelectedChip: number[] = [];

    /**
     * Initialize the event handler
     * @private
     */

    protected preRender(): void {
        //prerender
    }

    /**
     * To find the chips length.
     * @returns boolean
     * @private
     */

    protected chipType(): boolean {
        return (this.chips && this.chips.length && this.chips.length > 0);
    }

    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */

    protected render(): void {
        this.type = this.chips.length ? 'chipset' : (this.text || this.element.innerText ? 'chip' : 'chipset');
        if (!isBlazor() || !this.isServerRendered) {
            this.setAttributes();
            this.createChip();
            this.setRtl();
            this.select(this.selectedChips);
        }
        this.wireEvent(false);
        this.rippleFunction = rippleEffect(this.element, {
            selector: '.e-chip'
        });
        this.renderComplete();
    }

    private createChip(): void {
        this.innerText = this.element.innerText.trim();
        if (isBlazor()) {
            let childElement: NodeListOf<Element> = this.element.querySelectorAll('.e-chip');
            for (let i: number = 0; i < childElement.length; i++) {
                if (childElement[i] != null) {
                    detach(childElement[i]);
                }
            }
        } else {
            this.element.innerHTML = '';
        }
        this.chipCreation(this.type === 'chip' ? [this.innerText ? this.innerText : this.text] : this.chips);
    }

    private setAttributes(): void {
        if (this.type === 'chip') {
            this.element.tabIndex = 0;
            this.element.setAttribute('role', 'option');
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

    private chipCreation(data: string[] | number[] | ChipModel[]): void {
        let chipListArray: HTMLElement[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let fieldsData: ChipFields = this.getFieldValues(data[i]);
            let chipArray: HTMLElement[] = this.elementCreation(fieldsData);
            let className: string[] = (classNames.chip + ' ' + (fieldsData.enabled ? ' ' : classNames.disabled) + ' ' +
                (fieldsData.avatarIconCss || fieldsData.avatarText ? classNames.chipWrapper : (fieldsData.leadingIconCss ?
                    classNames.iconWrapper : ' ')) + ' ' + fieldsData.cssClass).split(' ').filter((css: string) => css);
            if (!this.chipType()) {
                chipListArray = chipArray;
                addClass([this.element], className);
                this.element.setAttribute('aria-label', fieldsData.text);
                if (fieldsData.value) {
                    this.element.setAttribute('data-value', fieldsData.value.toString());
                }
            } else {
                let wrapper: HTMLElement = this.createElement('DIV', {
                    className: className.join(' '), attrs: {
                        tabIndex: '0', role: 'option',
                        'aria-label': fieldsData.text, 'aria-selected': 'false'
                    }
                });
                if (fieldsData.value) {
                    wrapper.setAttribute('data-value', fieldsData.value.toString());
                }
                append(chipArray, wrapper);
                chipListArray.push(wrapper);
            }
        }
        append(chipListArray, this.element);
    }

    private getFieldValues(data: string | number | ChipModel): ChipFields {
        let chipEnabled: boolean = !(this.enabled.toString() === 'false');
        let fields: ChipFields = {
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
            enabled: typeof data === 'object' ? (!isNullOrUndefined(data.enabled) ? (data.enabled.toString() === 'false' ? false : true) :
                chipEnabled) : (chipEnabled),
            value: typeof data === 'object' ? ((data.value ? data.value.toString() : null)) : null,
            leadingIconUrl:  typeof data === 'object' ? (data.leadingIconUrl ? data.leadingIconUrl.toString() : this.leadingIconUrl) :
                this.leadingIconUrl,
            trailingIconUrl:  typeof data === 'object' ? (data.trailingIconUrl ? data.trailingIconUrl.toString() : this.trailingIconUrl) :
                this.trailingIconUrl
        };
        return fields;
    }

    private elementCreation(fields: ChipFields): HTMLElement[] {
        let chipArray: HTMLElement[] = [];
        if (fields.avatarText || fields.avatarIconCss) {
            let className: string = (classNames.avatar + ' ' + fields.avatarIconCss).trim();
            let chipAvatarElement: HTMLElement = this.createElement('span', { className: className });
            chipAvatarElement.innerText = fields.avatarText;
            chipArray.push(chipAvatarElement);
        } else if (fields.leadingIconCss) {
            let className: string = (classNames.icon + ' ' + fields.leadingIconCss).trim();
            let chipIconElement: HTMLElement = this.createElement('span', { className: className });
            chipArray.push(chipIconElement);
        } else if (fields.leadingIconUrl) {
            let className: string = (classNames.avatar + ' ' + 'image-url').trim();
            let chipIconElement: HTMLElement = this.createElement('span', { className: className});
            chipIconElement.style.backgroundImage = 'url(' + fields.leadingIconUrl + ')';
            chipArray.push(chipIconElement);
        }
        let chipTextElement: HTMLElement = this.createElement('span', { className: classNames.text });
        chipTextElement.innerText = fields.text;
        chipArray.push(chipTextElement);
        if (fields.trailingIconCss || (this.chipType() && this.enableDelete)) {
            let className: string = (classNames.delete + ' ' +
                (fields.trailingIconCss ? fields.trailingIconCss : classNames.deleteIcon)).trim();
            let chipdeleteElement: HTMLElement = this.createElement('span', { className: className });
            chipArray.push(chipdeleteElement);
        } else if (fields.trailingIconUrl) {
            let className: string = ('trailing-icon-url').trim();
            let chipIconsElement: HTMLElement = this.createElement('span', { className: className });
            chipIconsElement.style.backgroundImage = 'url(' + fields.trailingIconUrl + ')';
            chipArray.push(chipIconsElement);
        }
        return chipArray;
    }

    /**
     * A function that finds chip based on given input.
     * @param  {number | HTMLElement } fields - We can pass index number or element of chip.
     */
    public find(fields: number | HTMLElement): ChipDataArgs {
        let chipData: ChipDataArgs;
        let chipElement: HTMLElement = fields instanceof HTMLElement ?
            fields as HTMLElement : this.element.querySelectorAll('.' + classNames.chip)[fields as number] as HTMLElement;
        if (chipElement && this.chipType()) {
            chipData = { text: undefined, index: undefined, element: undefined, data: undefined };
            chipData.index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipElement);
            chipData.text = typeof this.chips[chipData.index] === 'object' ?
                ((this.chips[chipData.index] as ChipModel).text ?
                    (this.chips[chipData.index] as ChipModel).text.toString() : '') :
                this.chips[chipData.index].toString();
            chipData.data = this.chips[chipData.index];
            chipData.element = chipElement;
        }
        return chipData;
    }

    /**
     * Allows adding the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {string[] | number[] | ChipModel[] | string | number | ChipModel} chipsData - We can pass array of string or
     *  array of number or array of chip model or string data or number data or chip model.
     * @deprecated
     */
    public add(chipsData: string[] | number[] | ChipModel[] | string | number | ChipModel): void {
        if (this.type !== 'chip') {
            let fieldData: string[] | number[] | ChipModel[] = chipsData instanceof Array ?
                chipsData : <string[] | number[] | ChipModel[]>[chipsData as string | number | ChipModel];
            (<ChipModel[]>this.chips).push(...fieldData as ChipModel[]);
            this.chipCreation(fieldData);
        }
    }

    /**
     * Allows selecting the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    public select(fields: number | number[] | HTMLElement | HTMLElement[] | string[]): void {
        this.onSelect(fields, false);
    }

    private multiSelection(newProp: number[] | string[]): void {
        const items: NodeListOf<Element> = this.element.querySelectorAll('.' + 'e-chip');
        for (let j: number = 0; j < newProp.length; j++) {
            if (typeof newProp[j] === 'string') {
                for (let k: number = 0; k < items.length; k++) {
                    if (newProp[j] !== k) {
                        if (newProp[j] === items[k].attributes[5].value) {
                            this.multiSelectedChip.push(k);
                            break;
                        }
                    }
                }
            } else {
                this.multiSelectedChip.push(newProp[j] as number);
            }
        }
    }

    private onSelect(fields: number | number[] | HTMLElement | HTMLElement[] | string[], callFromProperty: boolean): void {
        if (this.chipType() && this.selection !== 'None') {
            if (callFromProperty) {
                let chipElements: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.chip);
                for (let i: number = 0; i < chipElements.length; i++) {
                    chipElements[i].setAttribute('aria-selected', 'false');
                    chipElements[i].classList.remove(classNames.active);
                }
            }
            let fieldData: number[] | HTMLElement[] | string[] = fields instanceof Array ? fields : <number[] | HTMLElement[]>[fields];
            for (let i: number = 0; i < fieldData.length; i++) {
                let chipElement: HTMLElement = fieldData[i] instanceof HTMLElement ? fieldData[i] as HTMLElement
                    : this.element.querySelectorAll('.' + classNames.chip)[fieldData[i] as number] as HTMLElement;
                if (chipElement instanceof HTMLElement) {
                    this.selectionHandler(chipElement);
                }
            }
        }
    }

    /**
     * Allows removing the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    public remove(fields: number | number[] | HTMLElement | HTMLElement[]): void {
        if (this.chipType()) {
            let fieldData: number[] | HTMLElement[] = fields instanceof Array ? fields : <number[] | HTMLElement[]>[fields];
            let chipElements: HTMLElement[] = [];
            let chipCollection: NodeListOf<HTMLElement> = this.element.querySelectorAll('.' + classNames.chip);
            (fieldData as HTMLElement[]).forEach((data: HTMLElement | number) => {
                let chipElement: HTMLElement = data instanceof HTMLElement ? data as HTMLElement
                    : chipCollection[data as number] as HTMLElement;
                if (chipElement instanceof HTMLElement) {
                    chipElements.push(chipElement);
                }
            });
            chipElements.forEach((element: HTMLElement) => {
                let chips: NodeListOf<HTMLElement> = this.element.querySelectorAll('.' + classNames.chip);
                let index: number = Array.prototype.slice.call(chips).indexOf(element);
                this.deleteHandler(element, index);
            });
        }
    }

    /**
     * Returns the selected chip(s) data.
     */
    public getSelectedChips(): SelectedItem | SelectedItems {
        let selectedChips: SelectedItem | SelectedItems;
        if (this.chipType() && this.selection !== 'None') {
            let selectedItems: SelectedItems = { texts: [], Indexes: [], data: [], elements: [] };
            const items: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.active);
            for (let i: number = 0; i < items.length; i++) {
                const chip: HTMLElement = items[i] as HTMLElement;
                selectedItems.elements.push(chip);
                let index: number = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chip);
                selectedItems.Indexes.push(index);
                (selectedItems.data as ChipModel[]).push((this.chips as ChipModel[])[index]);
                let text: string = typeof this.chips[index] === 'object' ?
                    (this.chips[index] as ChipModel).text ? (this.chips[index] as ChipModel).text.toString()
                        : null : this.chips[index].toString();
                selectedItems.texts.push(text);
            }
            let selectedItem: SelectedItem = {
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
                if (e.keyCode === 13) {
                    this.clickHandler(e);
                } else if (e.keyCode === 46 && this.enableDelete) {
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
        let chipWrapper: HTMLElement = <HTMLElement>closest((e.target as HTMLElement), '.' + classNames.chip);
        let focusedElement: HTMLElement = !this.chipType() ? (this.element.classList.contains(classNames.focused) ?
            this.element : null) : this.element.querySelector('.' + classNames.focused);
        if (chipWrapper && focusedElement) {
            focusedElement.classList.remove(classNames.focused);
        }
    }

    private clickHandler(e: MouseEventArgs | KeyboardEventArgs, del: boolean = false): void {
        let chipWrapper: HTMLElement = <HTMLElement>closest((e.target as HTMLElement), '.' + classNames.chip);
        if (chipWrapper) {
            let chipDataArgs: object;
            if (this.chipType()) {
                chipDataArgs = this.find(chipWrapper);
            } else {
                let index: number = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipWrapper);
                chipDataArgs = {
                    text: this.innerText ? this.innerText : this.text,
                    element: chipWrapper, data: this.text, index: index
                };
            }
            (chipDataArgs as ClickEventArgs).event = e;
            (chipDataArgs as ClickEventArgs).cancel = false;
            this.trigger('beforeClick', chipDataArgs as ClickEventArgs, (observedArgs: ClickEventArgs) => {
                if (!(observedArgs as ClickEventArgs).cancel) {
                    observedArgs.element = isBlazor() ? getElement(observedArgs.element) : observedArgs.element;
                    this.clickEventHandler(observedArgs.element, e, del);
                }
            });
        }
    }

    private clickEventHandler(chipWrapper: HTMLElement, e: MouseEventArgs | KeyboardEventArgs, del: boolean): void {
        if (this.chipType()) {
            let chipData: ChipDataArgs = this.find(chipWrapper);
            (chipData as ClickEventArgs).event = e;
            let deleteElement: HTMLElement = (e.target as HTMLElement).classList.contains(classNames.deleteIcon) ?
                e.target as HTMLElement : (del ? chipWrapper.querySelector('.' + classNames.deleteIcon) : undefined);
            if (deleteElement && this.enableDelete) {
                (chipData as DeleteEventArgs).cancel = false;
                let deletedItemArgs: DeleteEventArgs = chipData as DeleteEventArgs;
                this.trigger('delete', deletedItemArgs, (observedArgs: DeleteEventArgs) => {
                    if (!observedArgs.cancel) {
                        observedArgs.element = isBlazor() ? getElement(observedArgs.element) : observedArgs.element;
                        this.deleteHandler(observedArgs.element, observedArgs.index);
                    }
                });
            } else if (this.selection !== 'None') {
                this.selectionHandler(chipWrapper);
                (chipData as ClickEventArgs).selected = chipWrapper.classList.contains(classNames.active);
                let selectedItemArgs: ClickEventArgs = chipData as ClickEventArgs;
                this.trigger('click', selectedItemArgs);
            } else {
                this.focusInHandler(chipWrapper);
                let clickedItemArgs: ClickEventArgs = chipData as ClickEventArgs;
                this.trigger('click', clickedItemArgs);
            }
        } else {
            this.focusInHandler(chipWrapper);
            let clickedItemArgs: ClickEventArgs = {
                text: this.innerText ? this.innerText : this.text,
                element: chipWrapper, data: this.text, event: e
            } as ClickEventArgs;
            this.trigger('click', clickedItemArgs);
        }
    }

    private selectionHandler(chipWrapper: HTMLElement): void {
        if (this.selection === 'Single') {
            let activeElement: HTMLElement = this.element.querySelector('.' + classNames.active);
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
        let chipListEle: NodeListOf<Element> = this.element.querySelectorAll('.e-chip');
        let chipCollIndex: number[] = [];
        let chipCollValue: string[] = [];
        let chip: string | number = null;
        let value: string;
        for (let i: number = 0; i < chipListEle.length; i++) {
            let selectedEle: Element = this.element.querySelectorAll('.e-chip')[i];
            if (selectedEle.getAttribute('aria-selected') === 'true') {
                value = selectedEle.getAttribute('data-value');
                if (this.selection === 'Single' && selectedEle.classList.contains('e-active')) {
                    chip = value ? value : i;
                    break;
                } else {
                    value ? chipCollValue.push(value) : chipCollIndex.push(i);
                }
            }
        }
        this.setProperties({ selectedChips: this.selection === 'Single' ? chip : value ? chipCollValue : chipCollIndex }, true);
    }

    private deleteHandler(chipWrapper: HTMLElement, index: number): void {
        this.allowServerDataBinding = true;
        this.chips.splice(index, 1);
        this.setProperties({ chips: this.chips }, true);
        this.serverDataBind();
        this.allowServerDataBinding = false;
        if (!(isBlazor() && this.isServerRendered)) {
            detach(chipWrapper);
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     */
    public destroy(): void {
        removeClass([this.element], [classNames.chipSet, classNames.chip, classNames.rtl,
        classNames.multiSelection, classNames.singleSelection, classNames.disabled, classNames.chipWrapper, classNames.iconWrapper,
        classNames.active, classNames.focused].concat(this.cssClass.toString().split(' ').filter((css: string) => css)));
        this.removeMultipleAttributes(['tabindex', 'role', 'aria-label', 'aria-multiselectable'], this.element);
        this.wireEvent(true);
        this.rippleFunction();
        if (isBlazor()) {
            let chipChildElement: NodeListOf<Element> = !this.chipType() ? this.element.querySelectorAll('.e-chip-text') :
                this.element.querySelectorAll('.e-chip');
            for (let i: number = 0; i < chipChildElement.length; i++) {
                if (chipChildElement[i] != null) {
                    detach(chipChildElement[i]);
                }
            }
        } else {
            super.destroy();
            this.element.innerHTML = '';
            this.element.innerText = this.innerText;
        }
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
     * @returns void
     * @private
     */

    public onPropertyChanged(newProp: ChipList, oldProp: ChipList): void {
        for (let prop of Object.keys(newProp)) {
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
                    if (!(isBlazor() && this.isServerRendered)) {
                        this.isServerRendered = false;
                        this.refresh();
                        this.isServerRendered = true;
                    }
                    break;
                case 'cssClass':
                    if (!(isBlazor() && this.isServerRendered)) {
                        if (!this.chipType()) {
                            removeClass([this.element], oldProp.cssClass.toString().split(' ').filter((css: string) => css));
                            addClass([this.element], newProp.cssClass.toString().split(' ').filter((css: string) => css));
                        } else {
                            this.isServerRendered = false;
                            this.refresh();
                            this.isServerRendered = true;
                        }
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
            }
        }
    }
}
