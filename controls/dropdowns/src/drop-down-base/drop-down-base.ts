import { Component, EventHandler, addClass, append, Property, Event, KeyboardEvents, EmitType, L10n, compile } from '@syncfusion/ej2-base';
import { setStyleAttribute, extend, removeClass, prepend, isNullOrUndefined, detach, getValue, AnimationModel } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, rippleEffect, RippleOptions, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { DataManager, Query, DataOptions, DataUtil } from '@syncfusion/ej2-data';
import { ListBase, SortOrder, cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import { DropDownBaseModel, FieldSettingsModel } from './drop-down-base-model';
import { Popup } from '@syncfusion/ej2-popups';

export class FieldSettings extends ChildProperty<FieldSettings> {
    /**
     * Maps the text column from data table for each list item
     * @default null
     */
    @Property()
    public text: string;
    /**
     * Maps the value column from data table for each list item
     * @default null
     */
    @Property()
    public value: string;
    /**
     * Maps the icon class column from data table for each list item.
     * @default null
     */
    @Property()
    public iconCss: string;
    /** 
     * Group the list items with it's related items by mapping groupBy field.
     * @default null
     */
    @Property()
    public groupBy: string;

    /**
     * Allows additional attributes such as title, disabled, etc., to configure the elements 
     * in various ways to meet the criteria.
     * @default null
     */
    @Property()
    public htmlAttributes: string;
}

export const dropDownBaseClasses: DropDownBaseClassList = {
    root: 'e-dropdownbase',
    rtl: 'e-rtl',
    content: 'e-content',
    selected: 'e-active',
    hover: 'e-hover',
    noData: 'e-nodata',
    fixedHead: 'e-fixed-head',
    focus: 'e-item-focus',
    li: ListBaseClasses.li,
    group: ListBaseClasses.group,
    disabled: ListBaseClasses.disabled,
    grouping: 'e-dd-group'
};

export interface DropDownBaseClassList {
    root: string;
    rtl: string;
    content: string;
    selected: string;
    hover: string;
    noData: string;
    fixedHead: string;
    focus: string;
    li: string;
    disabled: string;
    group: string;
    grouping: string;
}

export interface SelectEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected list item
     */
    item: HTMLLIElement;
    /**
     * Returns the selected item as JSON Object from the data source.
     */
    itemData: FieldSettingsModel;
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;

}
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
@NotifyPropertyChanges
export class DropDownBase extends Component<HTMLElement> implements INotifyPropertyChanged {
    protected listData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    protected ulElement: HTMLElement;
    protected liCollections: HTMLElement[];
    private bindEvent: boolean;
    private scrollTimer: number;
    protected list: HTMLElement;
    protected fixedHeaderElement: HTMLElement;
    protected keyboardModule: KeyboardEvents;
    protected enableRtlElements: HTMLElement[];
    protected rippleFun: Function;
    protected l10n: L10n;
    protected item: HTMLLIElement;
    protected itemData: { [key: string]: Object } | string | number | boolean;
    protected isActive: boolean;
    protected isRequested: boolean;
    protected isDataFetched: boolean;
    protected queryString: string;

    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item.
     * * value - Maps the value column from data table for each list item.
     * * iconCss - Maps the icon class column from data table for each list item.
     * * groupBy - Group the list items with it's related items by mapping groupBy field.
     * ```html
     * <input type="text" tabindex="1" id="list"> </input>
     * ```
     * ```typescript  
     *   let customers: DropDownList = new DropDownList({
     *      dataSource:new DataManager({ url:'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
     *      query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(5),
     *      fields: { text: 'ContactName', value: 'CustomerID' },
     *      placeholder: 'Select a customer'
     *   });
     *   customers.appendTo("#list");
     * ```
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    @Complex<FieldSettingsModel>({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;
    /**
     * When set to true, enables RTL mode of the component that 
     * displays the content in the right-to-left direction.
     * @default false.
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * We have built-in [`template engine`](./template-engine.html)
     * 
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals. 
     * @default null.
     */
    @Property(null)
    public itemTemplate: string;
    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     * @default null.
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No Records Found'.
     */
    @Property('No Records Found')
    public noRecordsTemplate: string;
    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'.
     */
    @Property('The Request Failed')
    public actionFailureTemplate: string;
    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     * @default None.
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true.
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of
     * [`DataManager`](./api-dataManager.html).
     * @default [].
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];
    /**
     * Accepts the external [`Query`](./api-query.html)
     * which will execute along with the data processing.
     * @default null.
     */
    @Property(null)
    public query: Query;
    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     */
    @Property(1000)
    public zIndex: number;
    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     */
    @Property(false)
    public ignoreAccent: boolean;
    /**
     * Triggers before fetching data from the remote server.
     * @event
     */
    @Event()
    public actionBegin: EmitType<Object>;
    /**
     * Triggers after data is fetched successfully from the remote server.
     * @event
     */
    @Event()
    public actionComplete: EmitType<Object>;
    /**
     * Triggers when the data fetch request from the remote server fails.
     * @event
     */
    @Event()
    public actionFailure: EmitType<Object>;
    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;
    /**
     * Triggers when data source is populated in the popup list..
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;
    /** 
     * Triggers when the component is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when the component is destroyed.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * * Constructor for DropDownBase class
     */
    constructor(options?: DropDownBaseModel, element?: string | HTMLElement) {
        super(options, element);
    };
    protected getPropObject(
        prop: string, newProp: { [key: string]: string; }, oldProp: { [key: string]: string; }): { [key: string]: Object; } {
        let newProperty: { [key: string]: string; } = <{ [key: string]: string; }>new Object();
        let oldProperty: { [key: string]: string; } = <{ [key: string]: string; }>new Object();
        // tslint:disable-next-line:no-function-constructor-with-string-args
        let propName: Function = new Function('prop', 'return prop');
        newProperty[propName(prop)] = (newProp as { [key: string]: string; })[propName(prop)];
        oldProperty[propName(prop)] = (oldProp as { [key: string]: string; })[propName(prop)];
        let data: { [key: string]: Object; } = <{ [key: string]: Object; }>new Object();
        data.newProperty = newProperty;
        data.oldProperty = oldProperty;
        return data;
    }

    protected getValueByText(text: string, ignoreCase?: boolean, ignoreAccent?: boolean): string | number | boolean {
        let value: string | number | boolean = null;
        if (!isNullOrUndefined(this.listData)) {
            if (ignoreCase) {
                value = this.checkValueCase(text, true, ignoreAccent);
            } else {
                value = this.checkValueCase(text, false, ignoreAccent);
            }
        }
        return value;
    };
    private checkValueCase(text: string, ignoreCase: boolean, ignoreAccent: boolean, isTextByValue?: boolean): string | number {
        let value: string | number = null;
        if (isTextByValue) {
            value = text;
        }
        let dataSource: { [key: string]: Object }[] = this.listData as { [key: string]: Object }[];
        let fields: FieldSettingsModel = this.fields;
        let type: string = this.typeOfData(dataSource).typeof as string;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            for (let item of dataSource) {
                if (!isNullOrUndefined(item)) {
                    if (ignoreAccent) {
                        value = this.checkingAccent(String(item), text, ignoreCase);
                    } else {
                        if (ignoreCase) {
                            if (this.checkIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase);
                            }
                        } else {
                            if (this.checkNonIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase, isTextByValue);
                            }
                        }
                    }
                }
            }
        } else {
            if (ignoreCase) {
                (dataSource as { [key: string]: Object }[]).filter((item: { [key: string]: Object }) => {
                    if (this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = <string>getValue(fields.value, item);
                    }
                });
            } else {
                if (isTextByValue) {
                    dataSource.filter((item: { [key: string]: Object }) => {
                        let itemValue: string | number = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && itemValue.toString() === value.toString()) {
                            value = getValue(fields.text, item) as string;
                        }
                    });
                } else {
                    dataSource.filter((item: { [key: string]: Object }) => {
                        if (this.checkNonIgnoreCase(getValue(fields.text, item), text)) {
                            value = <string>getValue(fields.value, item);
                        }
                    });
                }
            }
        }
        return value;
    }
    private checkingAccent(item: string, text: string, ignoreCase: boolean): string {
        let dataItem: string | object = DataUtil.ignoreDiacritics(String(item));
        let textItem: string | object = DataUtil.ignoreDiacritics(text.toString());
        let value: string | number = null;
        if (ignoreCase) {
            if (this.checkIgnoreCase(dataItem as string, textItem as string)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        } else {
            if (this.checkNonIgnoreCase(String(item), text)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        }
        return (value as string);
    }
    private checkIgnoreCase(item: string, text: string): boolean {
        return String(item).toLowerCase() === text.toString().toLowerCase() ? true : false;
    }
    private checkNonIgnoreCase(item: string, text: string): boolean {
        return String(item) === text.toString() ? true : false;
    }
    private getItemValue(dataItem: string, typedText: string, ignoreCase: boolean, isTextByValue?: boolean): string {
        let value: string | number | boolean = null;
        let dataSource: { [key: string]: Object }[] = this.listData as { [key: string]: Object }[];
        let type: string = this.typeOfData(dataSource).typeof as string;
        if (isTextByValue) {
            value = dataItem.toString();
        } else {
            if (ignoreCase) {
                value = type === 'string' ? String(dataItem) : this.getFormattedValue(String(dataItem));
            } else {
                value = type === 'string' ? typedText : this.getFormattedValue(typedText);
            }
        }
        return value as string;
    }
    protected l10nUpdate(actionFailure?: boolean): void {
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template: string = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString: Function;
            this.list.innerHTML = '';
            compiledString = compile(template);
            for (let item of compiledString({})) {
                this.list.appendChild(item);
            }
        } else {
            let l10nLocale: Object = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new L10n('dropdowns', l10nLocale, this.locale);
            this.list.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    }

    protected getTextByValue(value: string | number | boolean): string {
        let text: string;
        text = this.checkValueCase(value as string, false, false, true) as string;
        return text;
    }
    protected getFormattedValue(value: string): string | number | boolean {
        if (this.listData && this.listData.length) {
            let item: { [key: string]: Object } = this.typeOfData(this.listData);
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item as { [key: string]: Object }) === 'number'
                || item.typeof === 'number') {
                return parseInt(value, 10);
            }
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item as { [key: string]: Object }) === 'boolean'
                || item.typeof === 'boolean') {
                return (value === 'true');
            }
        }
        return value;
    }
    /**
     * Sets RTL to dropdownbase wrapper
     */
    protected setEnableRtl(): void {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        this.enableRtl ? addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    };
    /**
     * Initialize the Component.
     */
    private initialize(): void {
        this.bindEvent = true;
        if (this.element.tagName === 'UL') {
            let jsonElement: { [key: string]: Object }[] = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        } else if (this.element.tagName === 'SELECT') {
            let dataSource: boolean = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) { this.renderItemsBySelect(); }
        } else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    };
    /**
     * Get the properties to be maintained in persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    };
    /**
     * Sets the enabled state to DropDownBase.
     */
    protected setEnabled(): void {
        if (this.enabled) {
            this.element.setAttribute('aria-disabled', 'false');
        } else {
            this.element.setAttribute('aria-disabled', 'true');
        }
    };

    private renderItemsBySelect(): void {
        let element: Element = this.element;
        let fields: FieldSettingsModel = { value: 'value', text: 'text' };
        let jsonElement: { [key: string]: Object }[] = [];
        let group: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>element.querySelectorAll('select>optgroup');
        let option: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (let i: number = 0; i < group.length; i++) {
                let item: HTMLOptGroupElement = group[i] as HTMLOptGroupElement;
                let optionGroup: { [key: string]: {} } = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                let child: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            let items: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>element.querySelectorAll('select>option');
        }
        this.fields.text = fields.text;
        this.fields.value = fields.value;
        this.resetList(jsonElement, fields);
    }

    private getJSONfromOption(
        items: { [key: string]: Object }[],
        options: HTMLOptionElement[],
        fields: FieldSettingsModel): void {
        for (let option of options) {
            let json: { [key: string]: {} } = {};
            json[fields.text] = option.innerText;
            json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    }
    /**
     * Execute before render the list items
     * @private
     */
    protected preRender(): void {
        // there is no event handler
        this.scrollTimer = -1;
        this.enableRtlElements = [];
        this.isRequested = false;
        this.isDataFetched = false;
    }
    /**
     * Creates the list items of DropDownBase component.
     */
    private setListData(
        dataSource: { [key: string]: Object }[] | string[] | number[] | DataManager | boolean[],
        fields: FieldSettingsModel, query: Query): void {
        fields = fields ? fields : this.fields;
        let ulElement: HTMLElement;
        this.isActive = true;
        let eventArgs: { [key: string]: Object } = { cancel: false, data: dataSource, query: query };
        this.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) { return; }
        this.showSpinner();
        if (dataSource instanceof DataManager) {
            this.isRequested = true;
            if (this.isDataFetched) {
                this.emptyDataRequest(fields);
                return;
            }
            (eventArgs.data as DataManager).executeQuery(this.getQuery(eventArgs.query as Query)).then((e: Object) => {
                this.trigger('actionComplete', e);
                if ((e as { [key: string]: Object }).cancel) { return; }
                let listItems: { [key: string]: Object }[] = (e as ResultData).result;
                if (listItems.length === 0) {
                    this.isDataFetched = true;
                }
                ulElement = this.renderItems(listItems, fields);
                this.onActionComplete(ulElement, listItems, e);
                this.isRequested = false;
                this.hideSpinner();
                this.trigger('dataBound', { items: listItems, e: e });
            }).catch((e: Object) => {
                this.isRequested = false;
                this.onActionFailure(e);
                this.hideSpinner();
            });
        } else {
            let dataManager: DataManager = new DataManager(eventArgs.data as DataOptions | JSON[]);
            let listItems: { [key: string]: Object }[];
            listItems = <{ [key: string]: Object }[]>(this.getQuery(eventArgs.query as Query)).executeLocal(dataManager);
            let localDataArgs: { [key: string]: Object } = { cancel: false, result: listItems };
            this.trigger('actionComplete', localDataArgs);
            if (localDataArgs.cancel) { return; }
            ulElement = this.renderItems(localDataArgs.result as { [key: string]: Object; }[], fields);
            this.onActionComplete(ulElement, localDataArgs.result as { [key: string]: Object; }[]);
            this.hideSpinner();
            this.trigger('dataBound', { items: localDataArgs.result as { [key: string]: Object; }[] });
        }

    }
    private emptyDataRequest(fields: FieldSettingsModel): void {
        let listItems: { [key: string]: Object }[] = [];
        this.onActionComplete(this.renderItems(listItems, fields), listItems);
        this.isRequested = false;
        this.hideSpinner();
    }
    protected showSpinner(): void {
        // Used this method in component side.
    }
    protected hideSpinner(): void {
        // Used this method in component side.
    }
    protected onActionFailure(e: Object): void {
        this.liCollections = [];
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.list], dropDownBaseClasses.noData);
    }
    protected onActionComplete(
        ulElement: HTMLElement,
        list: { [key: string]: Object }[] | boolean[] | string[] | number[],
        e?: Object): void {
        this.listData = list;
        this.list.innerHTML = '';
        this.list.appendChild(ulElement);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    }

    protected postRender(
        listElement: HTMLElement,
        list: { [key: string]: Object }[] | number[] | string[] | boolean[],
        bindEvent: boolean): void {
        let focusItem: Element = listElement.querySelector('.' + dropDownBaseClasses.li);
        let selectedItem: Element = listElement.querySelector('.' + dropDownBaseClasses.selected);
        if (focusItem && !selectedItem) {
            addClass([focusItem], dropDownBaseClasses.focus);
        }
        if (list.length <= 0) {
            this.l10nUpdate();
            addClass([listElement], dropDownBaseClasses.noData);
        } else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
        if (this.groupTemplate) { this.renderGroupTemplate(listElement); }
    }

    /**
     * Get the query to do the data operation before list item generation. 
     */
    protected getQuery(query: Query): Query {
        return query ? query : this.query ? this.query : new Query();
    }
    /**
     * To render the template content for group header element.
     */
    private renderGroupTemplate(listEle: HTMLElement): void {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            let dataSource: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.dataSource;
            let headerItems: Element[] = <NodeListOf<Element> & Element[]>listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            let tempHeaders: Element[] = ListBase.renderGroupTemplate(
                this.groupTemplate as string, <{ [key: string]: Object }[]>dataSource,
                (this.fields as FieldSettingsModel & { properties: Object }).properties,
                headerItems);
        }
    }
    /**
     * To create the ul li list items
     */
    private createListItems(dataSource: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement {
        if (dataSource && fields.groupBy || this.element.querySelector('optgroup')) {
            if (fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(
                    dataSource, (fields as FieldSettingsModel & { properties: Object }).properties, this.sortOrder);
            }
            addClass([this.list], dropDownBaseClasses.grouping);
        } else {
            dataSource = this.getSortedDataSource(dataSource);
        }
        let options: { [key: string]: Object } = <{ [key: string]: Object }>this.listOption(dataSource, fields);
        return ListBase.createList(this.createElement, dataSource, options, true);
    };

    protected listOption(dataSource: { [key: string]: Object }[], fields: FieldSettingsModel): FieldSettingsModel {
        let iconCss: boolean = isNullOrUndefined(fields.iconCss) ? false : true;
        let fieldValues: FieldSettingsModel = !isNullOrUndefined((fields as FieldSettingsModel & { properties: Object }).properties) ?
            (fields as FieldSettingsModel & { properties: Object }).properties : fields;
        let options: { [key: string]: Object } = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } as Object };
        return extend({}, options, fields, true);
    };

    protected setFloatingHeader(e: Event): void {
        if (isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = this.createElement('div', { className: dropDownBaseClasses.fixedHead });
            if (!this.list.querySelector('li').classList.contains(dropDownBaseClasses.group)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        if (!isNullOrUndefined(this.fixedHeaderElement) && this.fixedHeaderElement.style.zIndex === '0') {
            this.setFixedHeader();
        }
        this.scrollStop(e);
    }

    private scrollStop(e: Event): void {
        let target: Element = <Element>e.target;
        let liHeight: number = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        let topIndex: number = Math.round(target.scrollTop / liHeight);
        let liCollections: NodeListOf<Element> = <NodeListOf<Element>>this.ulElement.querySelectorAll('li');
        for (let i: number = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
                let currentLi: HTMLElement = liCollections[i] as HTMLElement;
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.top = (e.target as Element).scrollTop + 'px';
                this.fixedHeaderElement.style.display = 'block';
                break;
            } else {
                this.fixedHeaderElement.style.display = 'none';
                this.fixedHeaderElement.style.top = 'none';
            }
        }
    }
    /**
     * To render the list items
     */
    private renderItems(listData: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement {
        let ulElement: HTMLElement;
        if (this.itemTemplate && listData) {
            let dataSource: { [key: string]: Object }[] = listData;
            if (dataSource && fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(
                    dataSource, (fields as FieldSettingsModel & { properties: Object }).properties, this.sortOrder);
            } else {
                dataSource = this.getSortedDataSource(dataSource);
            }
            ulElement = this.templateListItem(dataSource, fields);
        } else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    };

    protected templateListItem(dataSource: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement {
        let option: { [key: string]: Object } = <{ [key: string]: Object }>this.listOption(dataSource, fields);
        return ListBase.renderContentTemplate(
            this.createElement, this.itemTemplate, dataSource, (fields as FieldSettingsModel & { properties: Object }).properties, option);
    }

    protected typeOfData(items:
        { [key: string]: Object }[] | string[] | number[] | boolean[]): { [key: string]: Object } {
        let item: { [key: string]: Object } = { typeof: null, item: null };
        for (let i: number = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                return item = { typeof: typeof items[i], item: items[i] };
            }
        }
        return item;
    }

    protected setFixedHeader(): void {
        this.list.parentElement.style.display = 'block';
        let liWidth: number = this.liCollections[0].offsetWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        let firstLi: HTMLElement = this.ulElement.querySelector('.' + dropDownBaseClasses.group) as HTMLElement;
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    }
    private getSortedDataSource(dataSource: { [key: string]: Object }[]): { [key: string]: Object }[] {
        if (dataSource && this.sortOrder !== 'None') {
            let textField: string = this.fields.text ? this.fields.text : 'text';
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    }
    /**
     * Return the index of item which matched with given value in data source
     */
    protected getIndexByValue(value: string | number | boolean): number {
        let index: number;
        let listItems: Element[] = this.getItems();
        for (let i: number = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    };
    /**
     * To dispatch the event manually 
     */
    protected dispatchEvent(element: HTMLElement, type: string): void {
        let evt: Event = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    }
    /**
     * To set the current fields
     */
    protected setFields(): void {
        let fields: FieldSettingsModel = this.fields;
        if (this.fields.value && !this.fields.text) {
            this.fields.text = this.fields.value;
        } else if (!fields.value && fields.text) {
            this.fields.value = this.fields.text;
        } else if (!this.fields.value && !this.fields.text) {
            this.fields.value = this.fields.text = 'text';
        }
    }
    /**
     * reset the items list.
     */
    protected resetList(
        dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        fields?: FieldSettingsModel, query?: Query): void {
        if (this.list) {
            this.setListData(dataSource, fields, query);
        }
    }
    protected updateSelection(): void {
        // This is for after added the item, need to update the selected index values.
    }
    protected renderList(): void {
        // This is for render the list items.
        this.render();
    }
    protected updateDataSource(props?: { [key: string]: string; }): void {
        this.resetList(this.dataSource);
    }
    protected setUpdateInitial(props: string[], newProp: { [key: string]: string; }): void {
        this.isDataFetched = false;
        let updateData: { [key: string]: string; } = {};
        for (let j: number = 0; props.length > j; j++) {
            if ((newProp as { [key: string]: string; })[props[j]] && props[j] === 'fields') {
                this.setFields();
            } else if ((newProp as { [key: string]: string; })[props[j]]) {
                (updateData as { [key: string]: string; })[props[j]] = (newProp as { [key: string]: string; })[props[j]];
            }
        }
        if (Object.keys(updateData).length > 0) {
            this.updateDataSource(updateData);
        }
    }

    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     * @private
     */
    public onPropertyChanged(newProp: DropDownBaseModel, oldProp: DropDownBaseModel): void {
        if (this.getModuleName() === 'dropdownbase') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        }
        this.setUpdateInitial(['sortOrder', 'itemTemplate'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'sortOrder':
                case 'dataSource':
                case 'itemTemplate':
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'groupTemplate':
                    this.renderGroupTemplate(this.list);
                    if (this.ulElement && this.fixedHeaderElement) {
                        let firstLi: HTMLElement = this.ulElement.querySelector('.' + dropDownBaseClasses.group) as HTMLElement;
                        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
                    }
                    break;
                case 'locale':
                    if (this.list && (!isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) { this.l10nUpdate(); }
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;

            }
        }
    };
    /**
     * Build and render the component
     * @private
     */
    public render(isEmptyData?: boolean): void {
        this.list = this.createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        let rippleModel: RippleOptions = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        let group: HTMLElement = <HTMLElement>this.element.querySelector('select>optgroup');
        if (this.fields.groupBy || !isNullOrUndefined(group)) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            let wrapperElement: HTMLElement = this.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    };
    /**
     * Return the module name of this component.
     * @private
     */
    public getModuleName(): string {
        return 'dropdownbase';
    };
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    public getItems(): Element[] {
        return <HTMLElement[] & NodeListOf<Element>>this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    };
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        if (!this.list || this.list.textContent === this.noRecordsTemplate) {
            this.renderList();
        }
        let itemsCount: number = this.getItems().length;
        let selectedItemValue: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]) as { [key: string]: Object }[] | string[] | boolean[] | number[];
        let index: number;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        let fields: FieldSettingsModel = this.fields;
        if (items && fields.groupBy) {
            items = ListBase.groupDataSource(
                (items as { [key: string]: Object }[]), (fields as FieldSettingsModel & { properties: Object }).properties);
        }
        let liCollections: HTMLElement[] = [];
        for (let i: number = 0; i < items.length; i++) {
            let item: { [key: string]: Object } | string | boolean | number = items[i];
            let isHeader: boolean = (item as { [key: string]: Object }).isHeader as boolean;
            let li: HTMLElement = this.createElement(
                'li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });

            if (isHeader) { li.innerText = getValue(fields.text, item); }
            if (this.itemTemplate && !isHeader) {
                let compiledString: Function = compile(this.itemTemplate);
                append(compiledString(item), li);
            } else if (!isHeader) {
                li.appendChild(document.createTextNode(<string>getValue(fields.text, item)));
            }
            li.setAttribute('data-value', getValue(fields.value, item));
            li.setAttribute('role', 'option');
            this.notify('addItem', { module: 'CheckBoxSelection', item: li });
            liCollections.push(li);
            (this.listData as { [key: string]: Object }[]).push(item as { [key: string]: Object });
            this.updateActionCompleteData(li, item as { [key: string]: Object });
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.appendChild(this.ulElement);
            append(liCollections, this.ulElement);
        } else {
            for (let i: number = 0; i < items.length; i++) {
                if (this.liCollections[index]) {
                    this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                } else {
                    this.ulElement.appendChild(liCollections[i]);
                }
                let tempLi: HTMLElement[] = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
            }
        }
        if (selectedItemValue || itemIndex === 0) {
            this.updateSelection();
        }
    }
    protected validationAttribute(target: HTMLElement, hidden: Element): void {
        let name: string = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        hidden.setAttribute('name', name);
        target.removeAttribute('name');
        let attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            if (!target.getAttribute(attributes[i])) { continue; }
            let attr: string = target.getAttribute(attributes[i]);
            hidden.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    }

    protected setZIndex(): void {
        // this is for component wise
    }

    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }): void {
        // this is for ComboBox custom value
    }
    /**
     * Gets the data Object that matches the given value. 
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     */
    public getDataByValue(value: string | number | boolean)
        : { [key: string]: Object } | string | number | boolean {
        if (!isNullOrUndefined(this.listData)) {
            let type: string = this.typeOfData(this.listData).typeof as string;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (let item of this.listData) {
                    if (!isNullOrUndefined(item) && item === value as Object) {
                        return item;
                    }
                }
            } else {
                for (let item of this.listData) {
                    if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        if (document.body.contains(this.list)) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            detach(this.list);
        }
        super.destroy();
    };
}
export interface ResultData {
    result: { [key: string]: Object }[];
}

export interface FilteringEventArgs {
    /**
     * To prevent the internal filtering action.
     */
    preventDefaultAction: boolean;
    /**
     * Gets the `keyup` event arguments.
     */
    baseEventArgs: Object;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
    /**
     * Search text value.
     */
    text: string;
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    updateData(dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[], query?: Query,
        fields?: FieldSettingsModel): void;
}
export interface PopupEventArgs {
    /**
     * Specifies the popup Object.
     */
    popup: Popup;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;
    /**
     * Specifies the animation Object.
     */
    animation?: AnimationModel;
}
export interface FocusEventArgs {
    /**
     * Specifies the focus interacted.
     */
    isInteracted?: boolean;
    /**
     * Specifies the event.
     */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent;
}