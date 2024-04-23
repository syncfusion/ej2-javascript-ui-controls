// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../combo-box/combo-box-model.d.ts'/>
import { Property, EventHandler, KeyboardEventArgs, isNullOrUndefined, detach, getValue } from '@syncfusion/ej2-base';
import { Event, EmitType, Complex } from '@syncfusion/ej2-base';
import { removeClass, attributes, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { dropDownListClasses } from '../drop-down-list/drop-down-list';
import { ComboBox } from '../combo-box/combo-box';
import { AutoCompleteModel } from '../auto-complete/auto-complete-model';
import { highlightSearch, revertHighlightSearch } from '../common/highlight-search';
import { Search } from '../common/incremental-search';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { FieldSettings, FilteringEventArgs, FilterType, ResultData } from '../drop-down-base/drop-down-base';
import { FloatLabelType, Input } from '@syncfusion/ej2-inputs';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';

dropDownListClasses.root = 'e-autocomplete';
dropDownListClasses.icon = 'e-input-group-icon e-ddl-icon e-search-icon';

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
    private searchList: boolean = false;
    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item
     * * value - Maps the value column from data table for each list item
     * * iconCss - Maps the icon class column from data table for each list item
     * * groupBy - Group the list items with it's related items by mapping groupBy field
     *
     * {% codeBlock src='autocomplete/fields/index.md' %}{% endcodeBlock %}
     *
     * > For more details about the field mapping refer to [`Data binding`](../../auto-complete/data-binding) documentation.
     *
     * @default { value: null, iconCss: null, groupBy: null}
     * @deprecated
     */
    @Complex<FieldSettingsModel>({ value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;
    /**
     * When set to ‘false’, consider the [`case-sensitive`](../../auto-complete/filtering/#case-sensitive-filtering)
     * on performing the search to find suggestions.
     * By default consider the casing.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * Allows you to either show or hide the popup button on the component.
     *
     * @default false
     */
    @Property(false)
    public showPopupButton: boolean;
    /**
     * When set to ‘true’, highlight the searched characters on suggested list items.
     * > For more details about the highlight refer to [`Custom highlight search`](../../auto-complete/how-to/custom-search) documentation.
     *
     * @default false
     */
    @Property(false)
    public highlight: boolean;
    /**
     * Supports the [`specified number`](../../auto-complete/filtering#filter-item-count)
     * of list items on the suggestion popup.
     *
     * @default 20
     */
    @Property(20)
    public suggestionCount: number;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='autocomplete/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     * @deprecated
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Accepts the external `query`
     * that execute along with data processing.
     *
     * {% codeBlock src='autocomplete/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public query: Query;
    /**
     * Allows you to set [`the minimum search character length']
     * (../../auto-complete/filtering#limit-the-minimum-filter-character),
     * the search action will perform after typed minimum characters.
     *
     * @default 1
     */
    @Property(1)
    public minLength: number;
    /**
     * Determines on which filter type, the component needs to be considered on search action.
     * The available [`FilterType`](../../auto-complete/filtering/#change-the-filter-type)
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
     *
     * @default 'Contains'
     */
    @Property('Contains')
    public filterType: FilterType;
    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;
    /**
     * Not applicable to this component.
     *
     * @default null
     * @aspType double
     * @private
     * @deprecated
     */
    @Property(null)
    public index: number | null;
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
     * @deprecated
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Not applicable to this component.
     *
     * @default null
     * @aspType string
     * @private
     * @deprecated
     */
    @Property(null)
    public valueTemplate: string | Function;
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
     * Not applicable to this component.
     *
     * @default false
     * @private
     * @deprecated
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Not applicable to this component.
     *
     * @default null
     * @aspType string
     * @private
     * @deprecated
     */
    @Property(null)
    public text: string | null;
    /**
     * * Constructor for creating the widget
     *
     * @param {AutoCompleteModel} options - Specifies the AutoComplete model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: AutoCompleteModel, element?: string | HTMLElement) {
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
        return 'auto-complete';
    }

    protected getNgDirective(): string {
        return 'EJS-AUTOCOMPLETE';
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        let value: string | number | boolean = this.allowObjectBinding && !isNullOrUndefined(this.value) ? getValue((this.fields.value) ? this.fields.value : '', this.value) : this.value;
        const filterType: string = (this.queryString === '' && !isNullOrUndefined(value)) ? 'equal' : this.filterType;
        const queryString: string = (this.queryString === '' && !isNullOrUndefined(value)) ? value as string : this.queryString;
        if (this.isFiltered) {
            if ((this.enableVirtualization && !isNullOrUndefined(this.customFilterQuery))) {
                filterQuery = this.customFilterQuery.clone() as Query;
            }
            else if(!this.enableVirtualization){
                return filterQuery;
            }
        }
        if (this.queryString !== null && this.queryString !== '') {
            const dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            } else {
                const mapping: string = !isNullOrUndefined(this.fields.value) ? this.fields.value : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount) && !this.enableVirtualization) {
            // Since defualt value of suggestioncount is 20, checked the condition
            if (this.suggestionCount !== 20) {
                for (let queryElements: number = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements as number].fn === 'onTake') {
                        filterQuery.queries.splice(queryElements, 1);
                    }
                }
            }
            filterQuery.take(this.suggestionCount);
        }
        if (this.enableVirtualization) {
            let queryTakeValue = 0;
            let querySkipValue = 0;
            var takeValue = this.getTakeValue();
            if(filterQuery && filterQuery.queries.length > 0){
                for (let queryElements: number = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements as number].fn === 'onSkip') {
                        querySkipValue = filterQuery.queries[queryElements as number].e.nos;
                    }
                    if (filterQuery.queries[queryElements as number].fn === 'onTake') {
                        queryTakeValue = takeValue <= filterQuery.queries[queryElements as number].e.nos ? filterQuery.queries[queryElements as number].e.nos : takeValue;
                    }
                }
            }
            if(queryTakeValue <= 0 && this.query && this.query.queries.length > 0){
                for (let queryElements: number = 0; queryElements < this.query.queries.length; queryElements++) {
                    if (this.query.queries[queryElements as number].fn === 'onTake') {
                        queryTakeValue = takeValue <= this.query.queries[queryElements as number].e.nos ? this.query.queries[queryElements as number].e.nos : takeValue;
                    }
                }
            }
            if (filterQuery && filterQuery.queries.length > 0) {
                for (let queryElements: number = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements as number].fn === 'onSkip') {   
                        querySkipValue = filterQuery.queries[queryElements as number].e.nos;
                        filterQuery.queries.splice(queryElements,1);
                        --queryElements;
                        continue;
                    }
                    if (filterQuery.queries[queryElements as number].fn === 'onTake') {
                        queryTakeValue = filterQuery.queries[queryElements as number].e.nos <= queryTakeValue  ? queryTakeValue : filterQuery.queries[queryElements as number].e.nos;
                        filterQuery.queries.splice(queryElements,1);
                        --queryElements;
                    }
                }
            }
            if(querySkipValue > 0 && this.virtualItemStartIndex <= querySkipValue){
                filterQuery.skip(querySkipValue);
            }
            else{
                filterQuery.skip(this.virtualItemStartIndex);
            }
            if(queryTakeValue > 0 && takeValue <= queryTakeValue){
                filterQuery.take(queryTakeValue);
            }
            else{
                filterQuery.take(takeValue);
            }
            filterQuery.requiresCount();
        }
        return filterQuery;
    }
    protected searchLists(e: KeyboardEventArgs | MouseEvent): void {
        this.isTyped = true;
        this.isDataFetched = this.isSelectCustom = false;
        this.firstItem = this.dataSource && (this.dataSource as any).length > 0 ? (this.dataSource as any)[0] : null;
        this.checkAndResetCache();
        if (isNullOrUndefined(this.list)) {
            super.renderList(e, true);
        }
        this.queryString = this.filterInput.value;
        if (e.type !== 'mousedown' && ((<KeyboardEventArgs>e).keyCode === 40 || (<KeyboardEventArgs>e).keyCode === 38)) {
            this.queryString = this.queryString === '' ? null : this.queryString;
            this.beforePopupOpen = true;
            this.resetList(this.dataSource, this.fields, null, e);
            return;
        }
        this.isSelected = false;
        this.activeIndex = null;
        const eventArgs: { [key: string]: Object } = {
            preventDefaultAction: false,
            text: this.filterInput.value,
            updateData: (
                dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query,
                fields?: FieldSettingsModel) => {
                if (eventArgs.cancel) {
                    return;
                }
                this.isFiltered = true;
                this.customFilterQuery = query;
                this.filterAction(dataSource, query, fields);
            },
            cancel: false
        };
        this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
            if (!eventArgs.cancel && !this.isFiltered && !eventArgs.preventDefaultAction) {
                this.searchList = true;
                this.filterAction(this.dataSource, null, this.fields, e);
            }
        });
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
        this.isFiltered = true;
        this.filterAction(dataSource, query, fields);
    }

    private filterAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel, e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        this.beforePopupOpen = true;
        let isNoDataElement  = this.list.classList.contains('e-nodata');
        if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
            if(this.enableVirtualization && this.isFiltering() && this.isTyped) {
                this.isPreventScrollAction = true;
                this.list.scrollTop = 0;
                this.previousStartIndex = 0;
                this.virtualListInfo  = null;
            }
            this.resetList(dataSource, fields, query, e);
            if(this.enableVirtualization && isNoDataElement && !this.list.classList.contains('e-nodata')) {
                if (!this.list.querySelector('.e-virtual-ddl-content')) {
                    this.list.appendChild(this.createElement('div', {
                        className: 'e-virtual-ddl-content',
                        styles: this.getTransformValues()
                    })).appendChild(this.list.querySelector('.e-list-parent'));
                }
                if(!this.list.querySelector('.e-virtual-ddl')){
                    var virualElement = this.createElement('div', {
                        id: this.element.id + '_popup', className: 'e-virtual-ddl', styles: this.GetVirtualTrackHeight()});
                    document.getElementsByClassName('e-popup')[0].querySelector('.e-dropdownbase').appendChild(virualElement);
                }
            }
            if ((this.getModuleName() === 'autocomplete' && !(this.dataSource instanceof DataManager)) ||  (this.getModuleName() === 'autocomplete' && (this.dataSource instanceof DataManager) && this.totalItemCount !=0 )) {
                this.getFilteringSkeletonCount();
            }
        } else {
            this.hidePopup(e);
            this.beforePopupOpen = false;
        }
        this.renderReactTemplates();
    }

    protected clearAll(e?: MouseEvent, property?: AutoCompleteModel): void {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clearAll(e);
            this.checkAndResetCache();
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        if(!this.enableVirtualization){
            this.fixedHeaderElement = null;
        }
        if ((this.getModuleName() === 'autocomplete' && !(this.dataSource instanceof DataManager)) || (this.getModuleName() === 'autocomplete' && (this.dataSource instanceof DataManager) && this.totalItemCount != 0)) {
            this.getFilteringSkeletonCount();
        }
        super.onActionComplete(ulElement, list, e);
        const item: Element = this.list.querySelector('.' + dropDownListClasses.li);
        if (!isNullOrUndefined(item)) {
            removeClass([item], dropDownListClasses.focus);
        }
        this.postBackAction();
    }

    private postBackAction(): void {
        if (this.autofill && !isNullOrUndefined(this.liCollections[0]) && this.searchList) {
            const items: HTMLElement[] = [this.liCollections[0]];
            const dataSource: { [key: string]: Object }[] = this.listData as { [key: string]: Object }[];
            const type: string = this.typeOfData(dataSource).typeof as string;
            const searchItem: { [key: string]: number | Element } = Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase, dataSource, this.fields, type);
            this.searchList = false;
            if (!isNullOrUndefined(searchItem.item)) {
                super.setAutoFill(this.liCollections[0], true);
            }
        }
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (!this.isValidLI(li)) {
            this.selectedLI = <HTMLElement>li;
            return;
        }
        if (!isNullOrUndefined(e) && e.type === 'keydown' && (e as KeyboardEventArgs).action !== 'enter'
        && (e as KeyboardEventArgs).action !== 'tab' && this.isValidLI(li)) {
            const value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            this.setHoverList(li);
            this.selectedLI = <HTMLElement>li;
            this.setScrollPosition(e as KeyboardEventArgs);
            if (this.autofill && this.isPopupOpen) {
                this.preventAutoFill = false;
                const isKeyNavigate: boolean = (e && (e as KeyboardEventArgs).action === 'down' || (e as KeyboardEventArgs).action === 'up' ||
                (e as KeyboardEventArgs).action === 'home' || (e as KeyboardEventArgs).action === 'end' || (e as KeyboardEventArgs).action === 'pageUp' || (e as KeyboardEventArgs).action === 'pageDown');
                super.setAutoFill(li, isKeyNavigate);
            }
        } else {
            super.setSelection(li, e);
        }
    }

    protected listOption(dataSource: { [key: string]: Object }[], fieldsSettings: FieldSettingsModel): FieldSettingsModel {
        const fields: { [key: string]: Object } = <{ [key: string]: Object }>super.listOption(dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    if (this.element.tagName === this.getNgDirective() && this.itemTemplate) {
                        setTimeout((): void => {
                            highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                        }, 0);
                    } else {
                        highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                    }
                }
            };
        } else {
            const itemCreated: Function = <Function>fields.itemCreated;
            fields.itemCreated = (e: { [key: string]: HTMLElement }) => {
                if (this.highlight) {
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                }
                itemCreated.apply(this, [e]);
            };
        }
        return fields;
    }

    protected isFiltering(): boolean {
        return true;
    }

    protected renderPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if(!this.enableVirtualization){
            this.list.scrollTop = 0;
        }
        super.renderPopup(e);
    }

    protected isEditTextBox(): boolean {
        return false;
    }

    protected isPopupButton(): boolean {
        return this.showPopupButton;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected isSelectFocusItem(element: Element): boolean {
        return false;
    }

    protected setInputValue(newProp?: any, oldProp?: any): void {
        let oldValue = oldProp && oldProp.text ? oldProp.text : oldProp ? oldProp.value : oldProp;
        let value = newProp && newProp.text ? newProp.text : newProp && newProp.value ? newProp.value : this.value;
        if(this.allowObjectBinding){
            oldValue = !isNullOrUndefined(oldValue) ? getValue((this.fields.value) ? this.fields.value : '', oldValue) : oldValue;
            value = !isNullOrUndefined(value) ? getValue((this.fields.value) ? this.fields.value : '', value) : value;
        }
        if (value && this.typedString === '' && !this.allowCustom && !(this.dataSource instanceof DataManager)) {
             let checkFields_1: string = this.typeOfData(this.dataSource).typeof === 'string' ? '' : this.fields.value;
             const listLength: number = this.getItems().length;
             let query: Query = new Query();
             let _this = this;
             new DataManager(this.dataSource).executeQuery(query.where(new Predicate(checkFields_1, 'equal', value)))
                 .then(function (e: Object) {
                 if ((e as ResultData).result.length > 0) {
                     _this.value = checkFields_1 !== '' ? _this.allowObjectBinding ? (e as ResultData).result[0] : (e as ResultData).result[0][_this.fields.value].toString() : (e as ResultData).result[0].toString();
                     _this.addItem((e as ResultData).result, listLength);
                     _this.updateValues();
                 }
                 else {
                     newProp && newProp.text ? _this.setOldText(oldValue) : newProp && newProp.value ? _this.setOldValue(oldValue) : _this.updateValues();
                 }
             });
        }
         else if (newProp) {
             newProp.text ? this.setOldText(oldValue) : this.setOldValue(oldValue);
         }
     }
     
    /**
     * Search the entered text and show it in the suggestion list if available.
     *
     * @returns {void}
     * @deprecated
     */
    public showPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
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
            this.renderList(e);
        } else {
            this.resetList(this.dataSource, this.fields, null, e);
        }
    }
    /**
     * Hides the popup if it is in open state.
     *
     * @returns {void}
     */
    public hidePopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        super.hidePopup(e);
        this.activeIndex = null;
        this.virtualListInfo = this.viewPortInfo;
        this.previousStartIndex = this.viewPortInfo.startIndex;
        this.startIndex = this.viewPortInfo.startIndex;
        this.previousEndIndex = this.viewPortInfo.endIndex;
    }
    /**
     * Dynamically change the value of properties.
     *
     * @param {AutoCompleteModel} newProp - Returns the dynamic property value of the component.
     * @param {AutoCompleteModel} oldProp - Returns the previous property value of the component.
     * @private
     * @returns {void}
     */
    public onPropertyChanged(newProp: AutoCompleteModel, oldProp: AutoCompleteModel): void {
        if (this.getModuleName() === 'autocomplete') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string });
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'showPopupButton':
                if (this.showPopupButton) {
                    const button: HTMLElement = Input.appendSpan(
                        dropDownListClasses.icon,
                        this.inputWrapper.container,
                        this.createElement);
                    this.inputWrapper.buttons[0] = button;
                    Input.calculateWidth(this.inputElement, this.inputWrapper.container);
                    if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                        this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                    }
                    if (this.inputWrapper && this.inputWrapper.buttons && this.inputWrapper.buttons[0]) {
                        EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                    }
                } else {
                    detach(this.inputWrapper.buttons[0]);
                    this.inputWrapper.buttons[0] = null;
                }
                break;
            default: {
                // eslint-disable-next-line max-len
                const atcProps: { [key: string]: Object } = this.getPropObject(prop, <{ [key: string]: string }>newProp, <{ [key: string]: string }>oldProp);
                super.onPropertyChanged(atcProps.newProperty, atcProps.oldProperty);
                break;
            }
            }
        }
    }
    protected renderHightSearch(): void {
        if (this.highlight) {
            for (let i: number = 0; i < this.liCollections.length; i++) {
                let isHighlight: HTMLElement = this.ulElement.querySelector('.e-active');
                if (!isHighlight) {
                    revertHighlightSearch(this.liCollections[i as number]);
                    highlightSearch(this.liCollections[i as number], this.queryString, this.ignoreCase, this.filterType);
                }
                isHighlight = null;
            }
        }
    }
    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    public getModuleName(): string {
        return 'autocomplete';
    }
    /**
     * To initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    public render(): void {
        super.render();
    }
}
