/// <reference path='../drop-down-list/drop-down-list-model.d.ts'/>
import { EventHandler, Property, Event, EmitType, addClass, Browser, KeyboardEventArgs, removeClass, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, NotifyPropertyChanges, getValue, setValue } from '@syncfusion/ej2-base';
import { DropDownList, dropDownListClasses } from '../drop-down-list/drop-down-list';
import { FilteringEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { ComboBoxModel } from '../combo-box/combo-box-model';
import { Search } from '../common/incremental-search';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
/* tslint:disable */
import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { SortOrder } from '@syncfusion/ej2-lists';
import { DataManager, Query } from '@syncfusion/ej2-data';
/* tslint:enable */
const SPINNER_CLASS: string = 'e-atc-spinner-icon';

dropDownListClasses.root = 'e-combobox';
let inputObject: InputObject = {
    container: null,
    buttons: []
};
/**
 * The ComboBox component allows the user to type a value or choose an option from the list of predefined options.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 *   let games:ComboBox = new ComboBox();
 *   games.appendTo("#list");
 * ```
 */
@NotifyPropertyChanges
export class ComboBox extends DropDownList {
    /**
     * Specifies whether suggest a first matched item in input when searching. No action happens when no matches found.
     * @default false
     */
    @Property(false)
    public autofill: boolean;
    /**
     * Specifies whether the component allows user defined value which does not exist in data source.    
     * @default true
     */
    @Property(true)
    public allowCustom: boolean;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src="combobox/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * When allowFiltering is set to true, show the filter bar (search box) of the component.
     * The filter action retrieves matched items through the `filtering` event based on
     * the characters typed in the search TextBox.
     * If no match is found, the value of the `noRecordsTemplate` property will be displayed.
     * 
     * {% codeBlock src="combobox/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/allow-filtering-api/index.html" %}{% endcodeBlock %}
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Accepts the external [`Query`](./api-query.html)
     * that execute along with [`data processing`](./data-binding.html).
     * 
     * {% codeBlock src="combobox/query-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/query-api/index.html" %}{% endcodeBlock %}
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Gets or sets the index of the selected item in the component.
     * 
     * {% codeBlock src="combobox/index-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/index-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     */
    @Property(null)
    public index: number;
    /**
     * Specifies whether to show or hide the clear button. 
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Triggers on set a 
     * [`custom value`](./getting-started.html#custom-values) to this component.
     * @event
     */
    @Event()
    public customValueSpecifier: EmitType<CustomValueSpecifierEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * > For more details about the filtering refer to [`Filtering`](./filtering.html) documentation.
     * @event
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     */
    @Property(null)
    public valueTemplate: string;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * 
     * {% codeBlock src="combobox/float-label-type-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/float-label-type-api/index.html" %}{% endcodeBlock %}
     * 
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Not applicable to this component.
     * @default null
     * @private
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * *Constructor for creating the component
     */
    constructor(options?: ComboBoxModel, element?: string | HTMLElement) {
        super(options, element);
    };
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        super.preRender();
    }

    protected wireEvent(): void {
        if (this.getModuleName() === 'combobox') {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur, this);
            EventHandler.add(this.inputWrapper.container, 'blur', this.onBlur, this);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick, this);
        }
        EventHandler.add(this.inputElement, 'focus', this.targetFocus, this);
        if (!this.readonly) {
            EventHandler.add(this.inputElement, 'input', this.onInput, this);
            EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
        }
        this.bindCommonEvent();
    }

    private preventBlur(e: MouseEvent): void {
        if ((!this.allowFiltering && document.activeElement !== this.inputElement &&
            !document.activeElement.classList.contains(dropDownListClasses.input) && Browser.isDevice || !Browser.isDevice)) {
            e.preventDefault();
        }
    }

    protected targetElement(): HTMLElement | HTMLInputElement {
        return this.inputElement;
    }

    protected setOldText(text: string): void {
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        this.customValue();
        this.removeSelection();
    }

    protected setOldValue(value: string | number): void {
        if (this.allowCustom) {
            this.valueMuteChange(this.value);
        } else {
            this.valueMuteChange(null);
        }
        this.removeSelection();
        this.setHiddenValue();
    }
    private valueMuteChange(value: string | number | boolean): void {
        let inputValue: string = isNullOrUndefined(value) ? null : value.toString();
        Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
        this.setProperties({ value: value, text: value, index: null }, true);
        this.activeIndex = this.index;
        let fields: FieldSettingsModel = this.fields;
        let dataItem: { [key: string]: string | Object } = {};
        dataItem[fields.text] = isNullOrUndefined(value) ? null : value.toString();
        dataItem[fields.value] = isNullOrUndefined(value) ? null : value.toString();
        this.itemData = <{ [key: string]: Object }>dataItem;
        this.item = null;
        if (this.previousValue !== this.value) {
            this.detachChangeEvent(null);
        }
    }
    protected updateValues(): void {
        if (!isNullOrUndefined(this.value)) {
            let li: Element = this.getElementByValue(this.value);
            if (li) {
                this.setSelection(li, null);
            } else if (this.allowCustom) {
                this.valueMuteChange(this.value);
            } else {
                this.valueMuteChange(null);
            }
        } else if (this.text && isNullOrUndefined(this.value)) {
            let li: Element = this.getElementByText(this.text);
            if (li) {
                this.setSelection(li, null);
            } else {
                Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
                this.customValue();
            }
        } else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    }

    protected updateIconState(): void {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            } else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        let ariaAttributes: { [key: string]: string } = {
            'aria-owns': this.element.id + '_options',
            'role': 'combobox',
            'aria-autocomplete': 'both',
            'aria-labelledby': this.hiddenElement.id,
            'aria-hasPopup': 'true',
            'aria-expanded': 'false',
            'aria-readonly': this.readonly.toString(),
            'autocomplete': 'off',
            'autocorrect': 'off',
            'autocapitalize': 'off',
            'spellcheck': 'false'
        };
        return ariaAttributes;
    }

    protected searchLists(e: KeyboardEventArgs): void {
        this.isTyped = true;
        if (this.isFiltering()) {
            super.searchLists(e);
            if (this.filterInput.value.trim() === '') {
                this.setHoverList(this.ulElement.querySelector('.' + dropDownListClasses.li));
            }
        } else {
            if (this.ulElement && this.inputElement.value === '' && this.preventAutoFill) {
                this.setHoverList(this.ulElement.querySelector('.' + dropDownListClasses.li));
            }
            this.incrementalSearch(e as KeyboardEventArgs);
        }
    }

    protected getNgDirective(): string {
        return 'EJS-COMBOBOX';
    }

    protected setSearchBox(): InputObject {
        this.filterInput = this.inputElement;
        return (this.isFiltering() ? this.inputWrapper : inputObject);
    }

    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        super.onActionComplete(ulElement, list, e);
        if (this.isSelectCustom) {
            this.removeSelection();
        }
        if (!this.preventAutoFill && this.getModuleName() === 'combobox' && this.isTyped) {
            this.inlineSearch();
        }
    }

    protected getFocusElement(): Element {
        let dataItem: { [key: string]: string } = this.isSelectCustom ? { text: '' } : this.getItemData();
        let selected: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownListClasses.selected);
        let isSelected: boolean = dataItem.text === this.inputElement.value && !isNullOrUndefined(selected);
        if (isSelected) {
            return selected;
        }
        if ((Browser.isDevice && !this.isDropDownClick || !Browser.isDevice) &&
            !isNullOrUndefined(this.liCollections) && this.liCollections.length > 0) {
            let inputValue: string = this.inputElement.value;
            let activeItem: { [key: string]: Element | number } = Search(inputValue, this.liCollections, 'StartsWith', true);
            let activeElement: Element = activeItem.item as Element;
            if (!isNullOrUndefined(activeElement)) {
                let count: number = this.getIndexByValue(activeElement.getAttribute('data-value')) - 1;
                let height: number = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
                if (!isNaN(height) && this.getModuleName() !== 'autocomplete') {
                    this.removeFocus();
                    let fixedHead: number = this.fields.groupBy ? this.liCollections[0].offsetHeight : 0;
                    this.list.scrollTop = count * height + fixedHead;
                    addClass([activeElement], dropDownListClasses.focus);
                }
            } else {
                if (this.isSelectCustom && this.inputElement.value.trim() !== '') {
                    this.removeFocus();
                    this.list.scrollTop = 0;
                }
            }
            return activeElement;
        } else {
            return null;
        }
    }

    protected setValue(e?: KeyboardEventArgs): boolean {
        if (e && e.type === 'keydown' && e.action === 'enter') {
            this.removeFillSelection();
        }
        if (this.autofill && this.getModuleName() === 'combobox' && e && e.type === 'keydown' && e.action !== 'enter') {
            this.preventAutoFill = false;
            this.inlineSearch(e);
            return false;
        } else {
            return super.setValue(e);
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    public showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = (this.getModuleName() === 'autocomplete') ? (this.inputWrapper.buttons[0] ||
                this.inputWrapper.clearButton ||
                Input.appendSpan('e-input-group-icon ' + SPINNER_CLASS, this.inputWrapper.container, this.createElement)) :
                (this.inputWrapper.buttons[0] || this.inputWrapper.clearButton);
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            createSpinner(
                {
                    target: this.spinnerElement,
                    width: Browser.isDevice ? '16px' : '14px'
                },
                this.createElement);
            showSpinner(this.spinnerElement);
        }
    }
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    public hideSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS)) {
                detach(this.spinnerElement);
            } else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    }

    protected setAutoFill(activeElement: Element, isHover?: boolean): void {
        if (!isHover) {
            this.setHoverList(activeElement);
        }
        if (this.autofill && !this.preventAutoFill) {
            let currentValue: string = <string>this.getTextByValue(activeElement.getAttribute('data-value')).toString();
            let currentFillValue: string | number | boolean = this.getFormattedValue(activeElement.getAttribute('data-value'));
            if (this.getModuleName() === 'combobox') {
                if (!this.isSelected && this.previousValue !== currentFillValue) {
                    this.updateSelectedItem(activeElement, null);
                    this.isSelected = true;
                    this.previousValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
                } else {
                    this.updateSelectedItem(activeElement, null, true);
                }
            }
            if (!this.isAndroidAutoFill(currentValue)) {
                this.setAutoFillSelection(currentValue);
            }
        }
    }

    private isAndroidAutoFill(value: string): boolean {
        if (Browser.isAndroid) {
            let currentPoints: { [key: string]: number } = this.getSelectionPoints();
            let prevEnd: number = this.prevSelectPoints.end;
            let curEnd: number = currentPoints.end;
            let prevStart: number = this.prevSelectPoints.start;
            let curStart: number = currentPoints.start;
            if (prevEnd !== 0 && ((prevEnd === value.length && prevStart === value.length) ||
                (prevStart > curStart && prevEnd > curEnd) || (prevEnd === curEnd && prevStart === curStart))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    protected clear(e?: MouseEvent | KeyboardEventArgs, property?: ComboBoxModel): void {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clear(e);
        }
    }

    protected isSelectFocusItem(element: Element): boolean {
        return !isNullOrUndefined(element);
    }

    private inlineSearch(e?: KeyboardEventArgs): void {
        let isKeyNavigate: boolean = (e && (e.action === 'down' || e.action === 'up' ||
            e.action === 'home' || e.action === 'end' || e.action === 'pageUp' || e.action === 'pageDown'));
        let activeElement: Element = isKeyNavigate ? this.liCollections[this.activeIndex] : this.getFocusElement();
        if (!isNullOrUndefined(activeElement)) {
            if (!isKeyNavigate) {
                let value: string | number | boolean = this.getFormattedValue(activeElement.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
                this.activeIndex = !isNullOrUndefined(this.activeIndex) ? this.activeIndex : null;
            }
            this.preventAutoFill = this.inputElement.value === '' ? false : this.preventAutoFill;
            this.setAutoFill(activeElement, isKeyNavigate);
        } else if (this.inputElement.value === '') {
            this.activeIndex = null;
            this.list.scrollTop = 0;
            let focusItem: Element = this.list.querySelector('.' + dropDownListClasses.li);
            this.setHoverList(focusItem);
        } else {
            this.activeIndex = null;
            this.removeSelection();
            this.removeFocus();
        }
    }

    protected incrementalSearch(e: KeyboardEventArgs): void {
        this.showPopup();
        if (!isNullOrUndefined(this.listData)) {
            this.inlineSearch(e);
            e.preventDefault();
        }
    };

    private setAutoFillSelection(currentValue: string): void {
        let selection: { [key: string]: number } = this.getSelectionPoints();
        let value: string = this.inputElement.value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            let inputValue: string = value + currentValue.substr(value.length, currentValue.length);
            Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(selection.start, this.inputElement.value.length);
        } else {
            Input.setValue(currentValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(0, this.inputElement.value.length);
        }
    };

    protected getValueByText(text: string): string | number | boolean {
        return super.getValueByText(text, true, this.ignoreAccent);
    }

    protected unWireEvent(): void {
        if (this.getModuleName() === 'combobox') {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur);
            EventHandler.remove(this.inputWrapper.container, 'blur', this.onBlur);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick);
        }
        EventHandler.remove(this.inputElement, 'focus', this.targetFocus);
        if (!this.readonly) {
            EventHandler.remove(this.inputElement, 'input', this.onInput);
            EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
            EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
        }
        this.unBindCommonEvent();
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        super.setSelection(li, e);
        if (!isNullOrUndefined(li) && !this.autofill && !this.isDropDownClick) {
            this.removeFocus();
        }
    }
    protected selectCurrentItem(e: KeyboardEventArgs): void {
        let li: Element;
        if (this.isPopupOpen) {
            li = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
        }
        if (e.action === 'enter' && this.inputElement.value.trim() === '') {
            this.clear(e);
        } else if (this.isTyped && !this.isSelected && isNullOrUndefined(li)) {
            this.customValue();
        }
        this.hidePopup();
    }

    protected setHoverList(li: Element): void {
        this.removeSelection();
        if (this.isValidLI(li) && !li.classList.contains(dropDownListClasses.selected)) {
            this.removeFocus();
            li.classList.add(dropDownListClasses.focus);
        }
    };
    private targetFocus(e: MouseEvent): void {
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = false;
        }
        this.onFocus();
    }
    protected dropDownClick(e: MouseEvent): void {
        e.preventDefault();
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        super.dropDownClick(e);
    }
    private customValue(): void {
        let value: string | number | boolean = this.getValueByText(this.inputElement.value);
        if (!this.allowCustom && this.inputElement.value !== '') {
            this.setProperties({ value: value });
            if (isNullOrUndefined(this.value)) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            }
        } else if (this.inputElement.value.trim() !== '') {
            let previousValue: string | number | boolean = this.value;
            if (isNullOrUndefined(value)) {
                let value: string | Object = this.inputElement.value === '' ? null : this.inputElement.value;
                let fields: FieldSettingsModel = this.fields;
                let eventArgs: { [key: string]: Object | string | number };
                eventArgs = <{ [key: string]: Object | string | number }>{ text: value, item: {} };
                if (!this.initial) {
                    this.trigger('customValueSpecifier', eventArgs);
                }
                let item: { [key: string]: string | Object } = <{ [key: string]: string | Object }>eventArgs.item;
                let dataItem: { [key: string]: string | Object } = {};
                if (item && getValue(fields.text, item) && getValue(fields.value, item)) {
                    dataItem = item;
                } else {
                    setValue(fields.text, value, dataItem);
                    setValue(fields.value, value, dataItem);
                }
                this.itemData = <{ [key: string]: Object }>dataItem;
                let changeData: { [key: string]: Object } = {
                    text: getValue(fields.text, this.itemData),
                    value: getValue(fields.value, this.itemData),
                    index: null
                };
                this.setProperties(changeData, true);
                this.setSelection(null, null);
                this.isSelectCustom = true;
            } else {
                this.isSelectCustom = false;
                this.setProperties({ value: value });
            }
            if (previousValue !== this.value) {
                this.onChangeEvent(null);
            }
        } else if (this.allowCustom) {
            this.isSelectCustom = true;
        }

    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: ComboBoxModel, oldProp: ComboBoxModel): void {
        if (this.getModuleName() === 'combobox') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement as HTMLInputElement);
                    if (this.readonly) {
                        EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
                        EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
                    } else {
                        EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
                        EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
                    }
                    break;
                case 'allowFiltering':
                    this.setSearchBox();
                    if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
                        super.renderList();
                    }
                    break;
                case 'allowCustom':
                    break;
                default:
                    let comboProps: { [key: string]: Object };
                    comboProps = this.getPropObject(prop, <{ [key: string]: string; }>newProp, <{ [key: string]: string; }>oldProp);
                    super.onPropertyChanged(comboProps.newProperty, comboProps.oldProperty);
                    break;
            }
        }
    }
    /**
     * To initialize the control rendering.
     * @private
     */
    public render(): void {
        super.render();
        this.setSearchBox();
        if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
            super.renderList();
        }
    };
    /**
     * Return the module name of this component.
     * @private
     */
    public getModuleName(): string {
        return 'combobox';
    }
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     */
    public hidePopup(): void {
        let inputValue: string | Object = this.inputElement.value === '' ? null : this.inputElement.value;
        if (!isNullOrUndefined(this.listData)) {
            let isEscape: boolean = this.isEscapeKey;
            if (this.isEscapeKey) {
                Input.setValue(this.typedString, this.inputElement, this.floatLabelType, this.showClearButton);
                this.isEscapeKey = false;
            }
            if (this.autofill) {
                this.removeFillSelection();
            }
            let dataItem: { [key: string]: string } = this.isSelectCustom ? { text: '' } : this.getItemData();
            let selected: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownListClasses.selected);
            if (dataItem.text === this.inputElement.value && !isNullOrUndefined(selected)) {
                if (this.isSelected) {
                    this.onChangeEvent(null);
                    this.isSelectCustom = false;
                }
                super.hidePopup();
                return;
            }
            if (this.getModuleName() === 'combobox' && this.inputElement.value.trim() !== '') {
                let searchItem: { [key: string]: number | Element } = Search(this.inputElement.value, this.liCollections, 'Equal', true);
                this.selectedLI = searchItem.item as HTMLElement;
                if (isNullOrUndefined(searchItem.index)) {
                    searchItem.index = Search(this.inputElement.value, this.liCollections, 'StartsWith', true).index as number;
                }
                this.activeIndex = searchItem.index as number;
                if (!isNullOrUndefined(this.selectedLI)) {
                    this.updateSelectedItem(this.selectedLI, null, true);
                } else if (isEscape) {
                    this.isSelectCustom = true;
                    this.removeSelection();
                }
            }
            if (!this.isEscapeKey && this.isTyped && !this.isInteracted) {
                this.customValue();
            }
        }
        if (isNullOrUndefined(this.listData) && this.allowCustom && !isNullOrUndefined(inputValue) && inputValue !== this.value) {
            this.customValue();
        }
        super.hidePopup();
    }
    /**
     * Sets the focus to the component for interaction.
     * @returns void.
     */
    public focusIn(): void {
        if (!this.enabled) {
            return;
        }
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        super.focusIn();
    }
}
export interface CustomValueSpecifierEventArgs {
    /**
     * Gets the typed custom text to make a own text format and assign it to `item` argument.
     */
    text: string;
    /**
     * Sets the text custom format data for set a `value` and `text`.
     */
    item: { [key: string]: string | Object };
}