/// <reference path='../combo-box/combo-box-model.d.ts'/>
import { Property, EventHandler, KeyboardEventArgs, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { Event, EmitType, Complex } from '@syncfusion/ej2-base';
import { removeClass, attributes, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { dropDownListClasses } from '../drop-down-list/drop-down-list';
import { ComboBox } from '../combo-box/combo-box';
import { AutoCompleteModel } from '../auto-complete/auto-complete-model';
import { highlightSearch } from '../common/highlight-search';
import { Search } from '../common/incremental-search';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { FieldSettings, FilteringEventArgs } from '../drop-down-base/drop-down-base';

/* tslint:disable */
import { FloatLabelType, Input } from '@syncfusion/ej2-inputs';
import { SortOrder } from '@syncfusion/ej2-lists';
import { DataManager, Query } from '@syncfusion/ej2-data';
/* tslint:enable */

dropDownListClasses.root = 'e-autocomplete';
dropDownListClasses.icon = 'e-input-group-icon e-ddl-icon e-search-icon';

export type FilterType = 'Contains' | 'StartsWith' | 'EndsWith';

/**
 * The AutoComplete component provides the matched suggestion list when type into the input,
 * from which the user can select one.
 * ```html
 * <input id="list" type="text"/>
 * ```
 * ```typescript
 *   let atcObj:AutoComplete = new AutoComplete();
 *   atcObj.appendTo("#list");
 * ```
 */
@NotifyPropertyChanges
export class AutoComplete extends ComboBox {
    private isFiltered: boolean = false;
    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item
     * * value - Maps the value column from data table for each list item
     * * iconCss - Maps the icon class column from data table for each list item
     * * groupBy - Group the list items with it's related items by mapping groupBy field
     * 
     * > For more details about the field mapping refer to [`Data binding`](./data-binding.html) documentation.
     * @default { value: null, iconCss: null, groupBy: null}
     */
    @Complex<FieldSettingsModel>({ value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;
    /**
     * When set to ‘false’, consider the [`case-sensitive`](./filtering.html#case-sensitive-filtering) 
     * on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * Allows you to either show or hide the popup button on the component.
     * @default false
     */
    @Property(false)
    public showPopupButton: boolean;
    /**
     * When set to ‘true’, highlight the searched characters on suggested list items.
     * > For more details about the highlight refer to [`Custom highlight search`](./how-to.html#custom-highlight-search) documentation. 
     * @default false
     */
    @Property(false)
    public highlight: boolean;
    /**
     * Supports the [`specified number`](./filtering.html#filter-item-count) 
     * of list items on the suggestion popup.
     * @default 20
     */
    @Property(20)
    public suggestionCount: number;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src="autocomplete/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Accepts the external [`query`](./api-query.html)
     * that execute along with data processing.
     * 
     * {% codeBlock src="autocomplete/query-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/query-api/index.html" %}{% endcodeBlock %}
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Allows you to set [`the minimum search character length']
     * (./filtering.html#limit-the-minimum-filter-character),
     * the search action will perform after typed minimum characters.
     * @default 1
     */
    @Property(1)
    public minLength: number;
    /**   
     * Determines on which filter type, the component needs to be considered on search action. 
     * The available [`FilterType`](./filtering.html#change-the-filter-type) 
     * and its supported data types are 
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * FilterType<br/></td><td colSpan=1 rowSpan=1> 
     * Description<br/></td><td colSpan=1 rowSpan=1> 
     * Supported Types<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * StartsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * EndsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value ends with specified value.<br/><br/></td><td colSpan=1 rowSpan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Contains<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value contains with specified value.<br/><br/></td><td colSpan=1 rowSpan=1> 
     * <br/>String<br/></td></tr> 
     * </table> 
     * 
     * {% codeBlock src="autocomplete/filter-type-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/filter-type-api/index.html" %}{% endcodeBlock %}
     * 
     * The default value set to `Contains`, all the suggestion items which contain typed characters to listed in the suggestion popup.
     * @default 'Contains'
     */
    @Property('Contains')
    public filterType: FilterType;
    /**
     * Triggers on typing a character in the component.
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
    public index: number;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * 
     * {% codeBlock src="autocomplete/float-label-type-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/float-label-type-api/index.html" %}{% endcodeBlock %}
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
    public valueTemplate: string;
    /**
     * Not applicable to this component.
     * @default null
     * @private
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Not applicable to this component. 
     * @default false
     * @private
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Not applicable to this component. 
     * @default null
     * @private
     */
    @Property(null)
    public text: string;
    /**
     * * Constructor for creating the widget
     */
    constructor(options?: AutoCompleteModel, element?: string | HTMLElement) {
        super(options, element);
    };
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        super.preRender();
    }

    protected getNgDirective(): string {
        return 'EJS-AUTOCOMPLETE';
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        let filterType: string = (this.queryString === '' && !isNullOrUndefined(this.value)) ? 'equal' : this.filterType;
        let queryString: string = (this.queryString === '' && !isNullOrUndefined(this.value)) ? this.value as string : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null) {
            let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            } else {
                let mapping: string = !isNullOrUndefined(this.fields.value) ? this.fields.value : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    }
    protected searchLists(e: KeyboardEventArgs): void {
        this.isTyped = true;
        this.isSelectCustom = false;
        this.isDataFetched = false;
        if (isNullOrUndefined(this.list)) {
            super.renderList(true);
        }
        let isDownUpKey: boolean = e.keyCode === 40 || e.keyCode === 38;
        this.queryString = this.filterInput.value;
        if (isDownUpKey) {
            this.queryString = this.queryString === '' ? null : this.queryString;
            this.beforePopupOpen = true;
            this.resetList(this.dataSource, this.fields);
            return;
        }
        this.isSelected = false;
        this.activeIndex = null;
        let eventArgs: { [key: string]: Object } = {
            preventDefaultAction: false,
            text: this.filterInput.value,
            updateData: (
                dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query,
                fields?: FieldSettingsModel) => {
                if (eventArgs.cancel) { return; }
                this.isFiltered = true;
                this.filterAction(dataSource, query, fields);
            },
            cancel: false
        };
        this.trigger('filtering', eventArgs);
        if (eventArgs.cancel) { return; }
        if (!this.isFiltered && !eventArgs.preventDefaultAction) {
            this.filterAction(this.dataSource, null, this.fields);
        }
    }

    private filterAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.beforePopupOpen = true;
        if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
            this.resetList(dataSource, fields, query);
        } else {
            this.hidePopup();
        }
    }

    protected clear(e?: MouseEvent, property?: AutoCompleteModel): void {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clear(e);
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    }

    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        this.fixedHeaderElement = null;
        super.onActionComplete(ulElement, list, e);
        let item: Element = this.list.querySelector('.' + dropDownListClasses.li);
        if (!isNullOrUndefined(item)) {
            removeClass([item], dropDownListClasses.focus);
        }
        this.postBackAction();
    }

    private postBackAction(): void {
        if (this.autofill && !isNullOrUndefined(this.liCollections[0])) {
            let items: HTMLElement[] = [this.liCollections[0]];
            let searchItem: { [key: string]: number | Element } = Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase);
            if (!isNullOrUndefined(searchItem.item)) {
                super.setAutoFill(this.liCollections[0], true);
            }
        }
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (!this.isValidLI(li)) {
            return;
        }
        if (!isNullOrUndefined(e) && e.type === 'keydown' && (e as KeyboardEventArgs).action !== 'enter' && this.isValidLI(li)) {
            let value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            this.setHoverList(li);
            this.selectedLI = <HTMLElement>li;
            this.setScrollPosition(e as KeyboardEventArgs);
            if (this.autofill) {
                this.preventAutoFill = false;
                super.setAutoFill(li);
            }
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        } else {
            super.setSelection(li, e);
        }
    }

    protected listOption(dataSource: { [key: string]: Object }[], fieldsSettings: FieldSettingsModel): FieldSettingsModel {
        let fields: { [key: string]: Object } = <{ [key: string]: Object }>super.listOption(dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                }
            };
        } else {
            let itemCreated: Function = <Function>fields.itemCreated;
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                }
                itemCreated.apply(this, [e]);
            };
        }
        return fields;
    };

    protected isFiltering(): boolean {
        return true;
    }

    protected renderPopup(): void {
        this.list.scrollTop = 0;
        super.renderPopup();
    }

    protected isEditTextBox(): boolean {
        return true && this.inputElement.value.trim() !== '';
    }

    protected isPopupButton(): boolean {
        return this.showPopupButton;
    }

    protected isSelectFocusItem(element: Element): boolean {
        return false;
    }
    /**
     * Search the entered text and show it in the suggestion list if available.
     * @returns void.
     */
    public showPopup(): void {
        if (!this.enabled) {
            return;
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        this.preventAutoFill = true;
        if (isNullOrUndefined(this.list)) {
            this.renderList();
        } else {
            this.resetList(this.dataSource, this.fields);
        }
    }
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     */
    public hidePopup(): void {
        super.hidePopup();
        this.activeIndex = -1;
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: AutoCompleteModel, oldProp: AutoCompleteModel): void {
        if (this.getModuleName() === 'autocomplete') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showPopupButton':
                    if (this.showPopupButton) {
                        let button: HTMLElement = Input.appendSpan(
                            dropDownListClasses.icon,
                            this.inputWrapper.container,
                            this.createElement);
                        this.inputWrapper.buttons[0] = button;
                        EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                    } else {
                        detach(this.inputWrapper.buttons[0]);
                        this.inputWrapper.buttons[0] = null;
                    }
                    break;
                default:
                    let atcProps: { [key: string]: Object };
                    atcProps = this.getPropObject(prop, <{ [key: string]: string; }>newProp, <{ [key: string]: string; }>oldProp);
                    super.onPropertyChanged(atcProps.newProperty, atcProps.oldProperty);
                    break;
            }
        }
    }
    /**
     * Return the module name of this component.
     * @private
     */
    public getModuleName(): string {
        return 'autocomplete';
    }
    /**
     * To initialize the control rendering
     * @private
     */
    public render(): void {
        super.render();
    };
}