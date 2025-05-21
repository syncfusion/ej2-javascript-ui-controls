// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../drop-down-list/drop-down-list-model.d.ts'/>
import { EventHandler, Property, Event, EmitType, addClass, Browser, KeyboardEventArgs, removeClass, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, NotifyPropertyChanges, getValue, setValue } from '@syncfusion/ej2-base';
import { DropDownList, dropDownListClasses } from '../drop-down-list/drop-down-list';
import { FilteringEventArgs, ResultData } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { ComboBoxModel } from '../combo-box/combo-box-model';
import { Search } from '../common/incremental-search';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { DataManager, DataOptions, Predicate, Query } from '@syncfusion/ej2-data';

const SPINNER_CLASS: string = 'e-atc-spinner-icon';

dropDownListClasses.root = 'e-combobox';
const inputObject: InputObject = {
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
     *
     * @default false
     */
    @Property(false)
    public autofill: boolean;
    /**
     * Specifies whether the component allows user defined value which does not exist in data source.
     *
     * @default true
     */
    @Property(true)
    public allowCustom: boolean;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='combobox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     * @deprecated
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * When allowFiltering is set to true, show the filter bar (search box) of the component.
     * The filter action retrieves matched items through the `filtering` event based on
     * the characters typed in the search TextBox.
     * If no match is found, the value of the `noRecordsTemplate` property will be displayed.
     *
     * {% codeBlock src="combobox/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="combobox/allow-filtering-api/index.html" %}{% endcodeBlock %}
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Defines whether the popup opens in fullscreen mode on mobile devices when filtering is enabled. When set to false, the popup will display similarly on both mobile and desktop devices.
     *
     * @default true
     */
    @Property(true)
    public isDeviceFullScreen: boolean;
    /**
     * Accepts the external `Query`
     * that execute along with [`data processing`](../../combo-box/data-binding).
     *
     * {% codeBlock src='combobox/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @deprecated
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
     * @aspType double
     * @deprecated
     */
    @Property(null)
    public index: number | null;
    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     *
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Triggers on set a
     * [`custom value`](../../combo-box/getting-started#custom-values) to this component.
     *
     * @event customValueSpecifier
     */
    @Event()
    public customValueSpecifier: EmitType<CustomValueSpecifierEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * > For more details about the filtering refer to [`Filtering`](../../combo-box/filtering) documentation.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Not applicable to this component.
     *
     * @default null
     * @aspType string
     * @private
     */
    @Property(null)
    public valueTemplate: string | Function;
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
     * @deprecated
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Not applicable to this component.
     *
     * @default null
     * @private
     * @deprecated
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public cssClass: string;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     * @deprecated
     */
    @Property(null)
    public headerTemplate: string | Function;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     * @deprecated
     */
    @Property(null)
    public footerTemplate: string | Function;
    /**
     * Specifies a short hint that describes the expected value of the DropDownList component.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public placeholder: string;
    /**
     * Specifies the width of the component. By default, the component width sets based on the width of
     * its parent container. You can also set the width in pixel values.
     *
     * @default '100%'
     * @aspType string
     * @deprecated
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the popup list.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '300px'
     * @aspType string
     * @deprecated
     */
    @Property('300px')
    public popupHeight: string | number;
    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of
     * the component.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '100%'
     * @aspType string
     * @deprecated
     */
    @Property('100%')
    public popupWidth: string | number;
    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Gets or sets the display text of the selected item in the component.
     *
     * @default null
     * @aspType string
     * @deprecated
     */
    @Property(null)
    public text: string | null;
    /**
     * Gets or sets the value of the selected item in the component.
     *
     * @default null
     * @isGenericType true
     * @deprecated
     */
    @Property(null)
    public value: number | string | boolean | object | null;
    /**
     * Defines whether the object binding is allowed or not in the component.
     *
     * @default false
     */
    @Property(false)
    public allowObjectBinding: boolean;
    /**
     * *Constructor for creating the component
     *
     * @param {ComboBoxModel} options - Specifies the ComboBox model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: ComboBoxModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        super.preRender();
    }

    protected getLocaleName(): string {
        return 'combo-box';
    }

    protected wireEvent(): void {
        if (this.getModuleName() === 'combobox') {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur, this);
            EventHandler.add(this.inputWrapper.container, 'blur', this.onBlurHandler, this);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick, this);
        }
        EventHandler.add(this.inputElement, 'focus', this.targetFocus, this);
        if (!this.readonly) {
            EventHandler.add(this.inputElement, 'input', this.onInput, this);
            EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.inputElement, 'paste', this.pasteHandler, this);
            EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.windowResize, this);
        }
        this.bindCommonEvent();
    }

    private preventBlur(e: MouseEvent): void {
        if ((!this.allowFiltering && document.activeElement !== this.inputElement &&
            !document.activeElement.classList.contains(dropDownListClasses.input) && Browser.isDevice || !Browser.isDevice)) {
            e.preventDefault();
        }
    }

    protected onBlurHandler(e: MouseEvent): void {
        const inputValue: string = this.inputElement && this.inputElement.value === '' ?
            null : this.inputElement && this.inputElement.value;
        const text: string = !isNullOrUndefined(this.text) ? this.text.replace(/\r\n|\n|\r/g, '') : this.text;
        if (!isNullOrUndefined(this.listData) && !isNullOrUndefined(inputValue) && inputValue !== text) {
            this.customValue(e);
        }
        super.onBlurHandler(e);
    }

    protected targetElement(): HTMLElement | HTMLInputElement {
        return this.inputElement;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected setOldText(text: string): void {
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        this.customValue();
        this.removeSelection();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected setOldValue(value: string | number | object): void {
        if (this.allowCustom) {
            this.selectedLI = this.getElementByValue(this.value) as HTMLElement;
            this.valueMuteChange(this.value);
        } else {
            this.valueMuteChange(null);
        }
        this.removeSelection();
        this.setHiddenValue();
    }
    private valueMuteChange(value: string | number | boolean | object): void {
        value = this.allowObjectBinding && !isNullOrUndefined(value) ? getValue((this.fields.value) ? this.fields.value : '', value) : value;
        const inputValue: string = isNullOrUndefined(value) ? null : value.toString();
        Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
        let changeData: { [key: string]: Object } = {};
        if (this.allowObjectBinding) {
            value = this.getDataByValue(value as string | number | boolean);
            if (isNullOrUndefined(value)) {
                const fields: FieldSettingsModel = this.fields;
                let isvalidTextField: boolean = false;
                let isValidValue: boolean = false;
                if (this.allowObjectBinding) {
                    const keys: string[] = Object.keys(this.value);
                    keys.forEach((key: string) => {
                        if (key === fields.value) {
                            isValidValue = true;
                            return;
                        }
                    });
                    keys.forEach((key: string) => {
                        if (key === fields.text) {
                            isvalidTextField = true;
                            return;
                        }
                    });
                }
                changeData = {
                    text: isValidValue ?  isvalidTextField ? getValue(fields.text, this.value) : getValue(fields.value, this.value) : null,
                    value: isValidValue ? this.value : null,
                    index: null
                };
            }
        }
        if (this.allowObjectBinding) {
            this.setProperties(changeData, true);
        }
        else {
            this.setProperties({ value: value, text: value ? value.toString() : value, index: null }, true);
        }
        this.activeIndex = this.index;
        const fields: FieldSettingsModel = this.fields;
        const dataItem: { [key: string]: string | Object } = {};
        dataItem[fields.text] = isNullOrUndefined(value) ? null : value.toString();
        dataItem[fields.value] = isNullOrUndefined(value) ? null : value.toString();
        this.itemData = <{ [key: string]: Object }>dataItem;
        this.item = null;
        if ((!this.allowObjectBinding && (this.previousValue !== this.value)) ||
            (this.allowObjectBinding && this.previousValue && this.value &&
                !this.isObjectInArray(this.previousValue, [this.value]))) {
            this.detachChangeEvent(null);
        }
    }
    protected updateValues(): void {
        if (this.fields.disabled) {
            if (this.value != null) {
                this.value = !this.isDisableItemValue(this.value) ? this.value : null;
            }
            if (this.text != null) {
                this.text = !this.isDisabledItemByIndex(this.getIndexByValue(this.getValueByText(this.text))) ? this.text : null;
            }
            if (this.index != null) {
                this.index = !this.isDisabledItemByIndex(this.index) ? this.index : null;
                this.activeIndex = this.index;
            }
        }
        if (!isNullOrUndefined(this.value)) {
            const currentValue: string | number | boolean = this.allowObjectBinding && !isNullOrUndefined(this.value) ? getValue((this.fields.value) ? this.fields.value : '', this.value) : this.value;
            const li: Element = this.getElementByValue(currentValue);
            let doesItemExist: boolean = !isNullOrUndefined(li) ? true : false;
            if (this.enableVirtualization && this.value) {
                const fields: string = (this.fields.value) ? this.fields.value : '';
                const currentValue: string | number | boolean = this.allowObjectBinding && !isNullOrUndefined(this.value) ? getValue((this.fields.value) ? this.fields.value : '', this.value) : this.value;
                if (this.dataSource instanceof DataManager) {
                    this.dataSource.executeQuery(new Query().where(new Predicate(fields, 'equal', currentValue)))
                        .then((e: Object) => {
                            if ((e as ResultData).result.length > 0) {
                                this.itemData = (e as ResultData).result[0];
                                const dataItem: { [key: string]: string } = this.getItemData();
                                const value: string | number | boolean | Object = this.allowObjectBinding ?
                                    this.getDataByValue(dataItem.value) : dataItem.value;
                                if ((this.value === dataItem.value && this.text !== dataItem.text) ||
                                    (this.value !== dataItem.value && this.text === dataItem.text)) {
                                    this.setProperties({ 'text': dataItem.text ? dataItem.text.toString() : dataItem.text, 'value': value });
                                }
                            }
                            else{
                                this.valueMuteChange(null);
                            }
                        });
                }
                else{
                    const getItem: any = <{ [key: string]: Object }[] | string[] | number[] | boolean[]>new DataManager(
                        this.dataSource as DataOptions | JSON[]).executeLocal(new Query().where(new Predicate(fields, 'equal', currentValue)));
                    if (getItem && getItem.length > 0) {
                        this.itemData = getItem[0];
                        doesItemExist = true;
                        const dataItem: { [key: string]: string } = this.getItemData();
                        const value: string | number | boolean | Object = this.allowObjectBinding
                            ? this.getDataByValue(dataItem.value)
                            : dataItem.value;
                        if ((this.value === dataItem.value && this.text !== dataItem.text)
                            || (this.value !== dataItem.value && this.text === dataItem.text)) {
                            this.setProperties({ 'text': dataItem.text ? dataItem.text.toString() : dataItem.text, 'value': value });
                            if (isNullOrUndefined(li)) {
                                this.previousValue = this.value;
                            }
                        }
                    }
                }
            }
            if (li) {
                this.setSelection(li, null);
            } else if (
                (!this.enableVirtualization && this.allowCustom) ||
                (this.allowCustom && this.enableVirtualization && !doesItemExist)
            ) {
                this.valueMuteChange(this.value);
            } else if (!this.enableVirtualization || (this.enableVirtualization && !(this.dataSource instanceof DataManager)
                && !doesItemExist )) {
                this.valueMuteChange(null);
            }
        } else if (this.text && isNullOrUndefined(this.value)) {
            const li: Element = this.getElementByText(this.text);
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
            if (this.inputElement && this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            } else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        const ariaAttributes: { [key: string]: string } = {
            'role': 'combobox',
            'aria-autocomplete': 'both',
            'aria-labelledby': this.hiddenElement.id,
            'aria-expanded': 'false',
            'aria-readonly': this.readonly ? this.readonly.toString() : 'false',
            'autocomplete': 'off',
            'autocapitalize': 'off',
            'spellcheck': 'false'
        };
        return ariaAttributes;
    }

    protected searchLists(e: KeyboardEventArgs | MouseEvent): void {
        this.isTyped = true;
        if (this.isFiltering()) {
            super.searchLists(e);
            if (this.ulElement && this.filterInput.value.trim() === '') {
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
        const searchBoxContainer: InputObject = (this.isFiltering() || ((this as any).isReact && this.getModuleName() === 'combobox')) ? this.inputWrapper : inputObject;
        return searchBoxContainer;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        super.onActionComplete(ulElement, list, e);
        if (this.isSelectCustom) {
            this.removeSelection();
        }
        if (!this.preventAutoFill && this.getModuleName() === 'combobox' && this.isTyped && !this.enableVirtualization) {
            setTimeout(() => {
                this.inlineSearch();
            });
        }
    }

    protected getFocusElement(): Element {
        const dataItem: { [key: string]: string } = this.isSelectCustom ? { text: '' } : this.getItemData();
        const selected: HTMLElement = !isNullOrUndefined(this.list) ? <HTMLElement>this.list.querySelector('.' + dropDownListClasses.selected) : this.list;
        const isSelected: boolean = dataItem.text && dataItem.text.toString() === this.inputElement.value && !isNullOrUndefined(selected);
        if (isSelected) {
            return selected;
        }
        if ((Browser.isDevice && !this.isDropDownClick || !Browser.isDevice) &&
            !isNullOrUndefined(this.liCollections) && this.liCollections.length > 0) {
            const inputValue: string = this.inputElement.value;
            const dataSource: { [key: string]: Object }[] = this.sortedData as { [key: string]: Object }[];
            const type: string = this.typeOfData(dataSource).typeof as string;
            let activeItem: { [key: string]: Element | number } =
                Search(inputValue, this.liCollections, this.filterType, true, dataSource, this.fields, type, this.ignoreAccent);
            if (this.enableVirtualization && inputValue !== '' && this.getModuleName() !== 'autocomplete' && this.isTyped && !this.allowFiltering) {
                let updatingincrementalindex: boolean = false;
                const isEndIndexValid: boolean =
                    this.viewPortInfo.endIndex >= this.incrementalEndIndex &&
                    this.incrementalEndIndex <= this.totalItemCount;

                const isIncrementalEndIndexZero: boolean = this.incrementalEndIndex === 0;

                if (isEndIndexValid || isIncrementalEndIndexZero) {
                    updatingincrementalindex = true;
                    this.incrementalStartIndex = this.incrementalEndIndex;
                    if (isIncrementalEndIndexZero) {
                        this.incrementalEndIndex = Math.min(100, this.totalItemCount);
                    } else {
                        this.incrementalEndIndex = Math.min(this.incrementalEndIndex + 100, this.totalItemCount);
                    }
                    this.updateIncrementalInfo(this.incrementalStartIndex, this.incrementalEndIndex);
                    updatingincrementalindex = true;
                }
                if (this.viewPortInfo.startIndex !== 0 || updatingincrementalindex) {
                    this.updateIncrementalView(0, this.itemCount);
                }
                activeItem = Search(inputValue, this.incrementalLiCollections, this.filterType, true, dataSource, this.fields, type);
                while (isNullOrUndefined(activeItem.item) && this.incrementalEndIndex < this.totalItemCount) {
                    this.incrementalStartIndex = this.incrementalEndIndex;
                    this.incrementalEndIndex = this.incrementalEndIndex + 100 > this.totalItemCount
                        ? this.totalItemCount
                        : this.incrementalEndIndex + 100;
                    this.updateIncrementalInfo(this.incrementalStartIndex, this.incrementalEndIndex);
                    updatingincrementalindex = true;
                    if (this.viewPortInfo.startIndex !== 0 || updatingincrementalindex) {
                        this.updateIncrementalView(0, this.itemCount);
                    }
                    activeItem = Search(inputValue, this.incrementalLiCollections, this.filterType, true, dataSource, this.fields, type);
                    if (!isNullOrUndefined(activeItem)) {
                        activeItem.index = (activeItem.index as number) + this.incrementalStartIndex;
                        break;
                    }
                    if (isNullOrUndefined(activeItem) && this.incrementalEndIndex >= this.totalItemCount) {
                        this.incrementalStartIndex = 0;
                        this.incrementalEndIndex = 100 > this.totalItemCount ? this.totalItemCount : 100;
                        break;
                    }
                }
                const startIndex: number =
                    (activeItem.index as number) - ((this.itemCount / 2) - 2) > 0
                        ? (activeItem.index as number) - ((this.itemCount / 2) - 2)
                        : 0;
                const endIndex: number =
                    this.viewPortInfo.startIndex + this.itemCount > this.totalItemCount
                        ? this.totalItemCount
                        : this.viewPortInfo.startIndex + this.itemCount;
                if (startIndex !== this.viewPortInfo.startIndex) {
                    this.updateIncrementalView(startIndex, endIndex);
                }
                if (!isNullOrUndefined(activeItem.item)) {
                    const startIndex: number = this.viewPortInfo.startIndex + ((this.itemCount / 2) - 2) < this.totalItemCount
                        ? this.viewPortInfo.startIndex + ((this.itemCount / 2) - 2)
                        : this.totalItemCount;
                    const endIndex: number = this.viewPortInfo.startIndex + this.itemCount > this.totalItemCount
                        ? this.totalItemCount
                        : this.viewPortInfo.startIndex + this.itemCount;
                    this.updateIncrementalView(startIndex, endIndex);
                    activeItem.item = this.getElementByValue((activeItem.item as Element).getAttribute('data-value'));
                } else {
                    this.updateIncrementalView(0, this.itemCount);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.list.getElementsByClassName('e-virtual-ddl-content')[0] as any).style = this.getTransformValues();
                    this.list.scrollTop = 0;
                }
                if (activeItem && activeItem.item){
                    activeItem.item = this.getElementByValue((activeItem.item as Element).getAttribute('data-value'));
                }
            }
            const activeElement: Element = activeItem.item as Element;
            const dataItem: { [key: string]: string } = this.getItemData();
            if ((!isNullOrUndefined(activeElement) && !this.enableVirtualization) || (this.enableVirtualization &&
                this.isTyped && isNullOrUndefined(dataItem) && isNullOrUndefined(dataItem.value) &&
                dataItem.value.toString() === activeElement.getAttribute('data-value').toString())) {
                const count: number = this.getIndexByValue(activeElement.getAttribute('data-value')) - 1;
                const height: number = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
                if (!isNaN(height) && this.getModuleName() !== 'autocomplete') {
                    this.removeFocus();
                    const fixedHead: number = this.fields.groupBy ? this.liCollections[0].offsetHeight : 0;
                    if (!this.enableVirtualization) {
                        this.list.scrollTop = count * height + fixedHead;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const virtualContent: any = this.list.getElementsByClassName('e-virtual-ddl-content')[0];
                        virtualContent.style = this.getTransformValues();
                        if (this.enableVirtualization && !this.fields.groupBy) {
                            const selectedLiOffsetTop: number = (activeElement as HTMLElement).offsetTop;
                            const virtualListInfoStartIndex: number = this.virtualListInfo && this.virtualListInfo.startIndex
                                ? this.virtualListInfo.startIndex
                                : 0;
                            const virtualListHeight: number = (activeElement as HTMLElement).offsetHeight;
                            const selectedLiOffsetTopWithStartIndex: number = selectedLiOffsetTop +
                                (virtualListInfoStartIndex * virtualListHeight);
                            const virtualListLength: number = this.list.querySelectorAll('.e-virtual-list').length;
                            const scrollTopOffset: number = virtualListLength * virtualListHeight;
                            this.list.scrollTop = selectedLiOffsetTopWithStartIndex - scrollTopOffset;
                        }
                    }
                    addClass([activeElement], dropDownListClasses.focus);
                }
            } else {
                if (this.isSelectCustom && this.inputElement.value.trim() !== '') {
                    this.removeFocus();
                    if (!this.enableVirtualization) {
                        this.list.scrollTop = 0;
                    }
                }
            }
            return activeElement;
        } else {
            return null;
        }
    }

    protected setValue(e?: KeyboardEventArgs): boolean {
        if ((e && e.type === 'keydown' && e.action === 'enter') || (e && e.type === 'click')) {
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
    protected checkCustomValue(): void {
        const value: string | number | boolean = this.allowObjectBinding && !isNullOrUndefined(this.value) ? getValue((this.fields.value) ? this.fields.value : '', this.value) : this.value;
        this.itemData = this.getDataByValue(value);
        const dataItem: { [key: string]: string } = this.getItemData();
        const setValue: string | number | boolean | Object = this.allowObjectBinding ? this.itemData : dataItem.value;
        if (!(this.allowCustom && isNullOrUndefined(dataItem.value) && isNullOrUndefined(dataItem.text))) {
            this.setProperties({ 'value': setValue }, !this.allowCustom);
        }
    }
    /**
     * Shows the spinner loader.
     *
     * @returns {void}
     * @deprecated
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
     *
     * @returns {void}
     * @deprecated
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
            const currentValue: string = <string>this.getTextByValue(activeElement.getAttribute('data-value')).toString();
            const currentFillValue: string | number | boolean = this.getFormattedValue(activeElement.getAttribute('data-value'));

            if (this.getModuleName() === 'combobox') {
                if (!this.isSelected && ((!this.allowObjectBinding && this.previousValue !== currentFillValue)) ||
                    (this.allowObjectBinding && this.previousValue && currentFillValue &&
                    !this.isObjectInArray(this.previousValue, [this.getDataByValue(currentFillValue)]))) {
                    this.updateSelectedItem(activeElement, null);
                    this.isSelected = true;
                    this.previousValue = this.allowObjectBinding ?
                        this.getDataByValue(this.getFormattedValue(activeElement.getAttribute('data-value'))) :
                        this.getFormattedValue(activeElement.getAttribute('data-value'));
                } else {
                    this.updateSelectedItem(activeElement, null, true);
                }
            }

            if (!this.isAndroidAutoFill(currentValue)) {
                this.setAutoFillSelection(currentValue, isHover);
            }
        }
    }

    private isAndroidAutoFill(value: string): boolean {
        if (Browser.isAndroid) {
            const currentPoints: { [key: string]: number } = this.getSelectionPoints();
            const prevEnd: number = this.prevSelectPoints.end;
            const curEnd: number = currentPoints.end;
            const prevStart: number = this.prevSelectPoints.start;
            const curStart: number = currentPoints.start;
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

    protected clearAll(e?: MouseEvent | KeyboardEventArgs, property?: ComboBoxModel): void {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clearAll(e);
        }
        if (this.isFiltering() && !isNullOrUndefined(e) && e.target === this.inputWrapper.clearButton) {
            this.typedString = this.filterInput.value;
            this.searchLists(e);
        }
    }

    protected isSelectFocusItem(element: Element): boolean {
        return !isNullOrUndefined(element);
    }

    private inlineSearch(e?: KeyboardEventArgs): void {
        const isKeyNavigate: boolean = (e && (e.action === 'down' || e.action === 'up' ||
            e.action === 'home' || e.action === 'end' || e.action === 'pageUp' || e.action === 'pageDown'));
        const activeElement: Element = isKeyNavigate ? this.liCollections[this.activeIndex] : this.getFocusElement();
        if (!isNullOrUndefined(activeElement)) {
            if (!isKeyNavigate) {
                const value: string | number | boolean = this.getFormattedValue(activeElement.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
                this.activeIndex = !isNullOrUndefined(this.activeIndex) ? this.activeIndex : null;
            }
            this.preventAutoFill = this.inputElement.value === '' ? false : this.preventAutoFill;
            this.setAutoFill(activeElement, isKeyNavigate);
        } else if (!isNullOrUndefined(this.inputElement) && this.inputElement.value === '') {
            this.activeIndex = null;
            if (!isNullOrUndefined(this.list)) {
                if (!this.enableVirtualization) {
                    this.list.scrollTop = 0;
                }
                const focusItem: Element = this.list.querySelector('.' + dropDownListClasses.li);
                this.setHoverList(focusItem);
            }
        } else {
            this.activeIndex = null;
            this.removeSelection();
            if (this.liCollections && this.liCollections.length > 0 && !this.isCustomFilter) {
                this.removeFocus();
            }
        }
    }

    protected incrementalSearch(e: KeyboardEventArgs): void {
        this.showPopup(e);
        if (!isNullOrUndefined(this.listData)) {
            this.inlineSearch(e);
            e.preventDefault();
        }
    }

    private setAutoFillSelection(currentValue: string, isKeyNavigate: boolean = false): void {
        const selection: { [key: string]: number } = this.getSelectionPoints();
        const value: string = this.inputElement.value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            const inputValue: string = value + currentValue.substr(value.length, currentValue.length);
            Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(selection.start, this.inputElement.value.length);
        } else if (isKeyNavigate) {
            Input.setValue(currentValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(0, this.inputElement.value.length);
        }
    }

    protected getValueByText(text: string): string | number | boolean {
        return super.getValueByText(text, true, this.ignoreAccent);
    }

    protected unWireEvent(): void {
        if (this.getModuleName() === 'combobox') {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur);
            EventHandler.remove(this.inputWrapper.container, 'blur', this.onBlurHandler);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick);
        }
        if (this.inputElement) {
            EventHandler.remove(this.inputElement, 'focus', this.targetFocus);
            if (!this.readonly) {
                EventHandler.remove(this.inputElement, 'input', this.onInput);
                EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
                EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
                EventHandler.remove(this.inputElement, 'paste', this.pasteHandler);
                EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.windowResize);
            }
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
            if (this.isSelected) {
                li = this.list.querySelector('.' + dropDownListClasses.selected);
            } else {
                li = this.list.querySelector('.' + dropDownListClasses.focus);
            }
            if (this.isDisabledElement(li as HTMLElement)) {
                return;
            }
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
        }
        if (e.action === 'enter' && this.inputElement.value === '') {
            this.clearAll(e);
        } else if (this.isTyped && !this.isSelected && isNullOrUndefined(li)) {
            this.customValue(e);
        }
        this.hidePopup(e);
    }

    protected setHoverList(li: Element): void {
        this.removeSelection();
        if (this.isValidLI(li) && !li.classList.contains(dropDownListClasses.selected)) {
            this.removeFocus();
            li.classList.add(dropDownListClasses.focus);
        }
    }
    private targetFocus(e: MouseEvent): void {
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = false;
        }
        this.onFocus(e);
        Input.calculateWidth(this.inputElement, this.inputWrapper.container);
    }
    protected dropDownClick(e: MouseEvent): void {
        e.preventDefault();
        if (Browser.isDevice && !this.isFiltering()) {
            this.preventFocus = true;
        }
        super.dropDownClick(e);
    }
    private customValue(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        let value: string | number | boolean | object = this.getValueByText(this.inputElement.value);
        if (!this.allowCustom && this.inputElement.value !== '') {
            const previousValue: string | number | boolean | object = this.previousValue;
            const currentValue: string | number | boolean | object = this.value;
            value = this.allowObjectBinding ? this.getDataByValue(value) : value;
            this.setProperties({ value: value });
            if (isNullOrUndefined(this.value)) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            }
            if (this.autofill && (
                (!this.allowObjectBinding && previousValue === this.value) ||
                (this.allowObjectBinding && previousValue && this.isObjectInArray(previousValue, [this.value]))
            ) && (
                (!this.allowObjectBinding && currentValue !== this.value) ||
                (this.allowObjectBinding && currentValue && !this.isObjectInArray(currentValue, [this.value]))
            )) {
                this.onChangeEvent(null);
            }
        } else if (this.inputElement.value !== '') {
            const previousValue: string | number | boolean | object = this.value;
            if (isNullOrUndefined(value)) {
                const value: string | Object = this.inputElement.value === '' ? null : this.inputElement.value;
                // eslint-disable-next-line max-len
                const eventArgs: { [key: string]: Object | string | number } = <{ [key: string]: Object | string | number }>{ text: value, item: {} };
                this.isObjectCustomValue = true;
                if (!this.initial) {
                    this.trigger('customValueSpecifier', eventArgs, (eventArgs: { [key: string]: Object | string | number }) => {
                        this.updateCustomValueCallback(value, eventArgs, previousValue, e);
                    });
                } else {
                    this.updateCustomValueCallback(value, eventArgs, previousValue);
                }
            } else {
                this.isSelectCustom = false;
                value = this.allowObjectBinding ? this.getDataByValue(value) : value;
                this.setProperties({ value: value });
                if ((!this.allowObjectBinding && previousValue !== this.value) ||
                    (this.allowObjectBinding && previousValue && this.value && !this.isObjectInArray(previousValue, [this.value]))
                ) {
                    this.onChangeEvent(e);
                }
            }
        } else if (this.allowCustom && this.isFocused) {
            this.isSelectCustom = true;
        }
    }
    private updateCustomValueCallback(
        value: string | Object,
        eventArgs: { [key: string]: Object | string | number },
        previousValue: string | number | boolean | object,
        e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        const fields: FieldSettingsModel = this.fields;
        const item: { [key: string]: string | Object } = <{ [key: string]: string | Object }>eventArgs.item;
        let dataItem: { [key: string]: string | Object } = {};
        if (item && getValue(fields.text, item) && getValue(fields.value, item)) {
            dataItem = item;
        } else {
            setValue(fields.text, value, dataItem);
            setValue(fields.value, value, dataItem);
        }
        this.itemData = <{ [key: string]: Object }>dataItem;
        const emptyObject: { [key: string]: any } = {};
        if (this.allowObjectBinding) {
            let keys: string[] = this.listData && this.listData.length > 0 ? Object.keys(this.listData[0]) : Object.keys(this.itemData);
            if ((!(this.listData && this.listData.length > 0)) && (this.getModuleName() === 'autocomplete' || (this.getModuleName() === 'combobox' && this.allowFiltering))){
                keys = this.firstItem ? Object.keys(this.firstItem) : Object.keys(this.itemData);
            }
            // Create an empty object with predefined keys
            keys.forEach((key: string) => {
                emptyObject[key as any] = ((key === fields.value) || (key === fields.text)) ? getValue(fields.value, this.itemData) : null;
            });
        }
        const changeData: { [key: string]: Object } = {
            text: getValue(fields.text, this.itemData),
            value: this.allowObjectBinding ? emptyObject : getValue(fields.value, this.itemData),
            index: null
        };
        this.setProperties(changeData, true);
        this.setSelection(null, null);
        this.isSelectCustom = true;
        this.isObjectCustomValue = false;
        if ((!this.allowObjectBinding && (previousValue !== this.value)) ||
            (this.allowObjectBinding && ((previousValue == null && this.value !== null) ||
            (previousValue && !this.isObjectInArray(previousValue, [this.value]))))) {
            this.onChangeEvent(e, true);
        }
    }
    /**
     * Dynamically change the value of properties.
     *
     * @param {ComboBoxModel} newProp - Returns the dynamic property value of the component.
     * @param {ComboBoxModel} oldProp - Returns the previous property value of the component.
     * @private
     * @returns {void}
     */
    public onPropertyChanged(newProp: ComboBoxModel, oldProp: ComboBoxModel): void {
        if (this.getModuleName() === 'combobox') {
            this.checkData(newProp);
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string }, oldProp as { [key: string]: string });
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'readonly':
                Input.setReadonly(this.readonly, this.inputElement as HTMLInputElement);
                if (this.readonly) {
                    EventHandler.remove(this.inputElement, 'input', this.onInput);
                    EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
                    EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
                } else {
                    EventHandler.add(this.inputElement, 'input', this.onInput, this);
                    EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
                    EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
                }
                this.setReadOnly();
                break;
            case 'allowFiltering':
                this.setSearchBox();
                if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
                    super.renderList();
                }
                break;
            case 'allowCustom':
                break;
            default: {
                // eslint-disable-next-line max-len
                const comboProps: { [key: string]: Object } = this.getPropObject(prop, <{ [key: string]: string }>newProp, <{ [key: string]: string }>oldProp);
                super.onPropertyChanged(comboProps.newProperty, comboProps.oldProperty);
                if (this.isFiltering() && prop === 'dataSource' && isNullOrUndefined(this.list) && this.itemTemplate &&
                        this.getModuleName() === 'combobox') {
                    super.renderList();
                }
                break;
            }
            }
        }
    }
    /**
     * To initialize the control rendering.
     *
     * @private
     * @returns {void}
     */
    public render(): void {
        super.render();
        this.setSearchBox();
        this.renderComplete();
        this.autoFill = this.autofill;
    }
    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    public getModuleName(): string {
        return 'combobox';
    }
    /**
     * Adds a new item to the combobox popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     *
     * @param { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @returns {void}
     * @deprecated
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }
    /**
     * To filter the data from given data source by using query
     *
     * @param {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param {Query} query - Specify the query to filter the data.
     * @param {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}
     * @deprecated
     */
    public filter(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        super.filter(dataSource, query, fields);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Opens the popup that displays the list of items.
     *
     * @returns {void}
     * @deprecated
     */
    public showPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        super.showPopup(e);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Hides the popup if it is in open state.
     *
     * @returns {void}
     * @deprecated
     */
    public hidePopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        const inputValue: string | Object = this.inputElement && this.inputElement.value === '' ? null
            : this.inputElement && this.inputElement.value;
        if (!isNullOrUndefined(this.listData)) {
            const isEscape: boolean = this.isEscapeKey;
            if (this.isEscapeKey) {
                Input.setValue(this.typedString, this.inputElement, this.floatLabelType, this.showClearButton);
                this.isEscapeKey = false;
            }
            if (this.autofill) {
                this.removeFillSelection();
            }
            const dataItem: { [key: string]: string } = this.isSelectCustom ? { text: '' } : this.getItemData();
            const text: string = !isNullOrUndefined(dataItem.text) ? dataItem.text.replace(/\r\n|\n|\r/g, '') : dataItem.text;
            const selected: HTMLElement = !isNullOrUndefined(this.list) ? <HTMLElement>this.list.querySelector('.' + dropDownListClasses.selected) : null;
            if (this.inputElement && text === this.inputElement.value && !isNullOrUndefined(selected)) {
                if (this.isSelected) {
                    this.onChangeEvent(e);
                    this.isSelectCustom = false;
                }
                super.hidePopup(e);
                return;
            }
            if (this.getModuleName() === 'combobox' && this.inputElement.value.trim() !== '') {
                const dataSource: { [key: string]: Object }[] = this.sortedData as { [key: string]: Object }[];
                const type: string = this.typeOfData(dataSource).typeof as string;
                const searchItem: { [key: string]: number | Element } = Search(this.inputElement.value, this.liCollections, 'Equal', true, dataSource, this.fields, type);
                this.selectedLI = searchItem.item as HTMLElement;
                if (isNullOrUndefined(searchItem.index)) {
                    searchItem.index = Search(this.inputElement.value, this.liCollections, 'StartsWith', true, dataSource, this.fields, type).index as number;
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
                this.customValue(e);
            }
        }
        const value: string | number | boolean = this.allowObjectBinding && !isNullOrUndefined(this.value) ? getValue((this.fields.value) ? this.fields.value : '', this.value) : this.value;
        if (isNullOrUndefined(this.listData) && this.allowCustom && !isNullOrUndefined(inputValue) && inputValue !== value) {
            this.customValue();
        }
        super.hidePopup(e);
    }
    /**
     * Sets the focus to the component for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (!this.enabled) {
            return;
        }
        if (Browser.isDevice && !this.isFiltering()) {
            this.preventFocus = true;
        }
        super.focusIn();
    }
    /**
     * Allows you to clear the selected values from the component.
     *
     * @returns {void}
     * @deprecated
     */
    public clear(): void {
        this.value = null;
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Moves the focus from the component if the component is already focused.
     *
     * @returns {void}
     * @deprecated
     */
    public focusOut(e?: MouseEvent | KeyboardEventArgs): void {
        /* eslint-enable valid-jsdoc, jsdoc/require-param */
        super.focusOut(e);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets all the list items bound on this component.
     *
     * @returns {Element[]}
     * @deprecated
     */
    public getItems(): Element[] {
        return super.getItems();
    }
    /**
     * Gets the data Object that matches the given value.
     *
     * @param { string | number } value - Specifies the value of the list item.
     * @returns {Object}
     * @deprecated
     */
    public getDataByValue(value: string | number | boolean)
        : { [key: string]: Object } | string | number | boolean {
        return super.getDataByValue(value);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    protected renderHightSearch(): void {
        // update high light search
    }
}
export interface CustomValueSpecifierEventArgs {
    /**
     * Gets the typed custom text to make a own text format and assign it to `item` argument.
     */
    text: string
    /**
     * Sets the text custom format data for set a `value` and `text`.
     *
     */
    item: { [key: string]: string | Object }
}
