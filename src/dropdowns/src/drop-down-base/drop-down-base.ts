import { Component, EventHandler, addClass, append, Property, Event, KeyboardEvents, EmitType, L10n, compile } from '@syncfusion/ej2-base';
import { setStyleAttribute, extend, removeClass, prepend, isNullOrUndefined, detach, getValue, AnimationModel } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, rippleEffect, RippleOptions, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { DataManager, Query, DataOptions, DataUtil } from '@syncfusion/ej2-data';
import { ListBase, SortOrder } from '@syncfusion/ej2-lists';
import { DropDownBaseModel, FieldSettingsModel } from './drop-down-base-model';
import { Popup } from '@syncfusion/ej2-popups';
import { remove, select, selectAll } from '@syncfusion/ej2-base';

export type FilterType = 'StartsWith' | 'EndsWith' | 'Contains';

export class FieldSettings extends ChildProperty<FieldSettings> {
    /**
     * Maps the text column from data table for each list item
     *
     * @default null
     */
    @Property()
    public text: string;
    /**
     * Maps the value column from data table for each list item
     *
     * @default null
     */
    @Property()
    public value: string;
    /**
     * Maps the icon class column from data table for each list item.
     *
     * @default null
     */
    @Property()
    public iconCss: string;
    /**
     * Group the list items with it's related items by mapping groupBy field.
     *
     * @default null
     */
    @Property()
    public groupBy: string;

    /**
     * Allows additional attributes such as title, disabled, etc., to configure the elements
     * in various ways to meet the criteria.
     *
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
    li: 'e-list-item',
    group: 'e-list-group-item',
    disabled: 'e-disabled',
    grouping: 'e-dd-group'
};

const ITEMTEMPLATE_PROPERTY: string = 'ItemTemplate';
const VALUETEMPLATE_PROPERTY: string = 'ValueTemplate';
const GROUPTEMPLATE_PROPERTY: string = 'GroupTemplate';
const HEADERTEMPLATE_PROPERTY: string = 'HeaderTemplate';
const FOOTERTEMPLATE_PROPERTY: string = 'FooterTemplate';
const NORECORDSTEMPLATE_PROPERTY: string = 'NoRecordsTemplate';
const ACTIONFAILURETEMPLATE_PROPERTY: string = 'ActionFailureTemplate';

export interface DropDownBaseClassList {
    root: string
    rtl: string
    content: string
    selected: string
    hover: string
    noData: string
    fixedHead: string
    focus: string
    li: string
    disabled: string
    group: string
    grouping: string
}

export interface SelectEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean
    /**
     * Returns the selected list item
     */
    item: HTMLLIElement
    /**
     * Returns the selected item as JSON Object from the data source.
     *
     */
    itemData: FieldSettingsModel
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean

}

export interface BeforeOpenEventArgs {
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean
}

export interface ActionBeginEventArgs {
    /**
     * Specify the query to begin the data
     *
     */
    query: Query
    /**
     * Set the data source to action begin
     *
     */
    data: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[]
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean
    /**
     * Specify the Event Name
     */
    eventName?: string
    /**
     * Return Items
     */
    items?: Object[]
}

export interface ActionCompleteEventArgs {
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean
    /**
     * Returns the selected items as JSON Object from the data source.
     *
     */
    result?: ResultData
    /**
     * Return the actual records.
     */
    actual?: object
    /**
     * Return the aggregates
     */
    aggregates?: object
    /**
     * Return the total number for records.
     */
    count?: number
    /**
     * Specify the query to complete the data
     *
     */
    query?: Query
    /**
     * Return the request type
     */
    request?: string
    /**
     * Return the virtualSelectRecords
     */
    virtualSelectRecords?: object
    /**
     * Return XMLHttpRequest
     */
    xhr: XMLHttpRequest
    /**
     * Specify the Event Name
     */
    eventName?: string
    /**
     * Return Items
     */
    items?: Object[]
}

export interface DataBoundEventArgs {
    /**
     * Returns the selected items as JSON Object from the data source.
     *
     */
    items: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[]
    /**
     * Return the bounded objects
     */
    e?: object
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
    protected selectData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    protected queryString: string;
    protected sortedData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    protected isGroupChecking: boolean;
    protected itemTemplateId: string;
    protected valueTemplateId: string;
    protected groupTemplateId: string;
    protected headerTemplateId: string;
    protected footerTemplateId: string;
    protected noRecordsTemplateId: string;
    protected actionFailureTemplateId: string;
    protected preventChange: boolean = false;
    protected isAngular: boolean = false;
    protected isPreventChange: boolean = false;
    protected isDynamicDataChange: boolean = false;
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
     *
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     * @deprecated
     */
    @Complex<FieldSettingsModel>({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * We have built-in `template engine`
     *
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public itemTemplate: string;
    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     *
     * @default 'No records found'
     * @deprecated
     */
    @Property('No records found')
    public noRecordsTemplate: string;
    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     *
     * @default 'Request failed'
     * @deprecated
     */
    @Property('Request failed')
    public actionFailureTemplate: string;
    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     *
     * @default null
     * @asptype object
     * @aspjsonconverterignore
     * @deprecated
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of
     * `DataManager`.
     *
     * @default []
     * @deprecated
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];
    /**
     * Accepts the external `Query`
     * which will execute along with the data processing.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public query: Query;
    /**
     * Determines on which filter type, the component needs to be considered on search action.
     * The `FilterType` and its supported data types are
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
     * The default value set to `StartsWith`, all the suggestion items which contain typed characters to listed in the suggestion popup.
     *
     * @default 'StartsWith'
     * @deprecated
     */
    @Property('StartsWith')
    public filterType: FilterType;
    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * specifies the z-index value of the component popup element.
     *
     * @default 1000
     * @deprecated
     */
    @Property(1000)
    public zIndex: number;
    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     *
     * @deprecated
     */
    @Property(false)
    public ignoreAccent: boolean;
    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default 'en-US'
     * @deprecated
     */
    @Property()
    public locale: string;
    /**
     * Triggers before fetching data from the remote server.
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<Object>;
    /**
     * Triggers after data is fetched successfully from the remote server.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<Object>;
    /**
     * Triggers when the data fetch request from the remote server fails.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<Object>;
    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     *
     * @event select
     */
    @Event()
    public select: EmitType<SelectEventArgs>;
    /**
     * Triggers when data source is populated in the popup list..
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;
    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * * Constructor for DropDownBase class
     *
     * @param {DropDownBaseModel} options - Specifies the DropDownBase model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: DropDownBaseModel, element?: string | HTMLElement) {
        super(options, element);
    }
    protected getPropObject(
        prop: string, newProp: { [key: string]: string }, oldProp: { [key: string]: string }): { [key: string]: Object } {
        const newProperty: { [key: string]: string } = <{ [key: string]: string }>new Object();
        const oldProperty: { [key: string]: string } = <{ [key: string]: string }>new Object();
        const propName: Function = (prop: string) => {
            return prop;
        };
        newProperty[propName(prop)] = (newProp as { [key: string]: string })[propName(prop)];
        oldProperty[propName(prop)] = (oldProp as { [key: string]: string })[propName(prop)];
        const data: { [key: string]: Object } = <{ [key: string]: Object }>new Object();
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
    }
    private checkValueCase(text: string, ignoreCase: boolean, ignoreAccent: boolean, isTextByValue?: boolean): string | number {
        let value: string | number = null;
        if (isTextByValue) {
            value = text;
        }
        const dataSource: { [key: string]: Object }[] = this.listData as { [key: string]: Object }[];
        const fields: FieldSettingsModel = this.fields;
        const type: string = this.typeOfData(dataSource).typeof as string;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            for (const item of dataSource) {
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
                    const itemValue: string | number = getValue(fields.value, item);
                    if (!isNullOrUndefined(itemValue) && this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = <string>getValue(fields.value, item);
                    }
                });
            } else {
                if (isTextByValue) {
                    let compareValue: string | number = null;
                    compareValue = value;
                    dataSource.filter((item: { [key: string]: Object }) => {
                        const itemValue: string | number = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && !isNullOrUndefined(value) && itemValue.toString() === compareValue.toString()) {
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
        const dataItem: string | object = DataUtil.ignoreDiacritics(String(item));
        const textItem: string | object = DataUtil.ignoreDiacritics(text.toString());
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
        const dataSource: { [key: string]: Object }[] = this.listData as { [key: string]: Object }[];
        const type: string = this.typeOfData(dataSource).typeof as string;
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
    private templateCompiler(baseTemplate: string): boolean {
        let checkTemplate: boolean = false;
        if (baseTemplate) {
            try {
                checkTemplate = (selectAll(baseTemplate, document).length) ? true : false;
            } catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    }
    protected l10nUpdate(actionFailure?: boolean): void {
        const ele: Element = this.getModuleName() === 'listbox' ? this.ulElement : this.list;
        if (this.noRecordsTemplate !== 'No records found' || this.actionFailureTemplate !== 'Request failed') {
            const template: string = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString: Function;
            const templateId: string = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            ele.innerHTML = '';
            const tempaltecheck: boolean = this.templateCompiler(template);
            if (tempaltecheck) {
                compiledString = compile(select(template, document).innerHTML.trim());
            } else {
                compiledString = compile(template);
            }
            const templateName: string = actionFailure ? 'actionFailureTemplate' : 'noRecordsTemplate';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const noDataCompTemp: any = compiledString({}, this, templateName, templateId, this.isStringTemplate, null, ele);
            if (noDataCompTemp && noDataCompTemp.length > 0) {
                for (let i: number = 0; i < noDataCompTemp.length; i++) {
                    ele.appendChild(noDataCompTemp[i]);
                }
            }
            this.renderReactTemplates();
        } else {
            const l10nLocale: Object = { noRecordsTemplate: 'No records found', actionFailureTemplate: 'Request failed'};
            const componentLocale: L10n = new L10n(this.getLocaleName(), {}, this.locale);
            if (componentLocale.getConstant('actionFailureTemplate') !== '') {
                this.l10n = componentLocale;
            } else {
                this.l10n = new L10n(this.getModuleName() === 'listbox' ? 'listbox' : 'dropdowns', l10nLocale, this.locale);
            }
            const content: string = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
            if (this.getModuleName() === 'listbox') {
                const liElem: Element = this.createElement('li');
                liElem.textContent = content;
                ele.appendChild(liElem);
                liElem.classList.add('e-list-nrt');
            } else {
                ele.innerHTML = content;
            }
        }
    }

    protected getLocaleName(): string {
        return 'drop-down-base';
    }

    protected getTextByValue(value: string | number | boolean): string {
        const text: string = this.checkValueCase(value as string, false, false, true) as string;
        return text;
    }
    protected getFormattedValue(value: string): string | number | boolean {
        if (this.listData && this.listData.length) {
            const item: { [key: string]: Object } = this.typeOfData(this.listData);
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item as { [key: string]: Object }) === 'number'
                || item.typeof === 'number') {
                return parseFloat(value);
            }
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item as { [key: string]: Object }) === 'boolean'
                || item.typeof === 'boolean') {
                return ((value === 'true') || ('' + value === 'true'));
            }
        }
        return value;
    }
    /**
     * Sets RTL to dropdownbase wrapper
     *
     * @returns {void}
     */
    protected setEnableRtl(): void {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        if (this.enableRtl) {
            addClass(this.enableRtlElements, dropDownBaseClasses.rtl);
        } else {
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
        }
    }
    /**
     * Initialize the Component.
     *
     * @returns {void}
     */
    private initialize(): void {
        this.bindEvent = true;
        this.actionFailureTemplateId = `${this.element.id}${ACTIONFAILURETEMPLATE_PROPERTY}`;
        if (this.element.tagName === 'UL') {
            const jsonElement: { [key: string]: Object }[] = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        } else if (this.element.tagName === 'SELECT') {
            const dataSource: boolean = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) {
                this.renderItemsBySelect();
            } else if (this.isDynamicDataChange) {
                this.setListData(this.dataSource, this.fields, this.query);
            }
        } else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    }
    /**
     * Get the properties to be maintained in persisted state.
     *
     * @returns {string} Returns the persisted data of the component.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * Sets the enabled state to DropDownBase.
     *
     * @returns {void}
     */
    protected setEnabled(): void {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
    }
    /**
     * Sets the enabled state to DropDownBase.
     *
     * @param {string} value - Specifies the attribute values to add on the input element.
     * @returns {void}
     */
    protected updateDataAttribute(value: { [key: string]: string }) : void {
        const invalidAttr: string[] = ['class', 'style', 'id', 'type'];
        const attr: { [key: string]: string } = {};
        for (let a: number = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
            !( this.getModuleName() === 'dropdownlist' &&  this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    }

    private renderItemsBySelect(): void {
        const element: Element = this.element;
        const fields: FieldSettingsModel = { value: 'value', text: 'text' };
        const jsonElement: { [key: string]: Object }[] = [];
        const group: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>element.querySelectorAll('select>optgroup');
        const option: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (let i: number = 0; i < group.length; i++) {
                const item: HTMLOptGroupElement = group[i] as HTMLOptGroupElement;
                const optionGroup: { [key: string]: {} } = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                const child: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            element.querySelectorAll('select>option');
        }
        this.updateFields(fields.text, fields.value, this.fields.groupBy, this.fields.htmlAttributes, this.fields.iconCss);
        this.resetList(jsonElement, fields);
    }

    private updateFields(text?: string, value?: string, groupBy?: string, htmlAttributes?: string, iconCss?: string): void {
        const field: Object = {
            'fields': {
                text: text,
                value: value,
                groupBy: !isNullOrUndefined(groupBy) ? groupBy : this.fields && this.fields.groupBy,
                htmlAttributes: !isNullOrUndefined(htmlAttributes) ? htmlAttributes : this.fields && this.fields.htmlAttributes,
                iconCss: !isNullOrUndefined(iconCss) ? iconCss : this.fields && this.fields.iconCss
            }
        };
        this.setProperties(field, true);
    }

    private getJSONfromOption(
        items: { [key: string]: Object }[],
        options: HTMLOptionElement[],
        fields: FieldSettingsModel): void {
        for (const option of options) {
            const json: { [key: string]: {} } = {};
            json[fields.text] = option.innerText;
            json[fields.value] = !isNullOrUndefined(option.getAttribute(fields.value)) ?
                option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    }
    /**
     * Execute before render the list items
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        // there is no event handler
        this.scrollTimer = -1;
        this.enableRtlElements = [];
        this.isRequested = false;
        this.isDataFetched = false;
        this.itemTemplateId = `${this.element.id}${ITEMTEMPLATE_PROPERTY}`;
        this.valueTemplateId = `${this.element.id}${VALUETEMPLATE_PROPERTY}`;
        this.groupTemplateId = `${this.element.id}${GROUPTEMPLATE_PROPERTY}`;
        this.headerTemplateId = `${this.element.id}${HEADERTEMPLATE_PROPERTY}`;
        this.footerTemplateId = `${this.element.id}${FOOTERTEMPLATE_PROPERTY}`;
        this.noRecordsTemplateId = `${this.element.id}${NORECORDSTEMPLATE_PROPERTY}`;
    }
    /**
     * Creates the list items of DropDownBase component.
     *
     * @param {Object[] | string[] | number[] | DataManager | boolean[]} dataSource - Specifies the data to generate the list.
     * @param {FieldSettingsModel} fields - Maps the columns of the data table and binds the data to the component.
     * @param {Query} query - Accepts the external Query that execute along with data processing.
     * @returns {void}
     */
    private setListData(
        dataSource: { [key: string]: Object }[] | string[] | number[] | DataManager | boolean[],
        fields: FieldSettingsModel, query: Query): void {
        fields = fields ? fields : this.fields;
        let ulElement: HTMLElement;
        this.isActive = true;
        const eventArgs: ActionBeginEventArgs = { cancel: false, data: dataSource, query: query };
        this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
        this.trigger('actionBegin', eventArgs, (eventArgs: ActionBeginEventArgs) => {
            if (!eventArgs.cancel) {
                this.showSpinner();
                if (dataSource instanceof DataManager) {
                    this.isRequested = true;
                    if (this.isDataFetched) {
                        this.emptyDataRequest(fields);
                        return;
                    }
                    (eventArgs.data as DataManager).executeQuery(this.getQuery(eventArgs.query as Query)).then((e: Object) => {
                        this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
                        this.trigger('actionComplete', e, (e: Object) => {
                            if (!(e as { [key: string]: object }).cancel) {
                                const listItems: { [key: string]: Object }[] = (e as ResultData).result;
                                if (listItems.length === 0) {
                                    this.isDataFetched = true;
                                }
                                ulElement = this.renderItems(listItems, fields);
                                this.onActionComplete(ulElement, listItems, e);
                                if (this.groupTemplate) {
                                    this.renderGroupTemplate(ulElement);
                                }
                                this.isRequested = false;
                                this.bindChildItems(listItems, ulElement, fields, e);
                            }
                        });
                    }).catch((e: Object) => {
                        this.isRequested = false;
                        this.onActionFailure(e);
                        this.hideSpinner();
                    });
                } else {
                    const dataManager: DataManager = new DataManager(eventArgs.data as DataOptions | JSON[]);
                    const listItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>(
                        this.getQuery(eventArgs.query as Query)).executeLocal(dataManager);
                    const localDataArgs: { [key: string]: Object } = { cancel: false, result: listItems };
                    this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
                    this.trigger('actionComplete', localDataArgs, (localDataArgs: { [key: string]: object }) => {
                        if (!localDataArgs.cancel) {
                            ulElement = this.renderItems(localDataArgs.result as { [key: string]: Object }[], fields);
                            this.onActionComplete(ulElement, localDataArgs.result as { [key: string]: Object }[]);
                            if (this.groupTemplate) {
                                this.renderGroupTemplate(ulElement);
                            }
                            this.bindChildItems(localDataArgs.result as { [key: string]: Object }[], ulElement, fields);
                        }
                    });
                }
            }
        });
    }
    private bindChildItems(
        listItems: { [key: string]: Object }[],
        ulElement: HTMLElement,
        fields: FieldSettingsModel,
        e?: object): void {
        if (listItems.length >= 100 && this.getModuleName() === 'autocomplete') {
            setTimeout(
                () => {
                    const childNode: HTMLElement[] = this.remainingItems(this.sortedData, fields);
                    append(childNode, ulElement);
                    this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + dropDownBaseClasses.li);
                    this.updateListValues();
                    this.raiseDataBound(listItems, e);
                },
                0);
        } else {
            this.raiseDataBound(listItems, e);
        }
    }
    protected updateListValues(): void {
        // Used this method in component side.
    }
    protected findListElement(list: HTMLElement, findNode: string, attribute: string, value: string | boolean | number ): HTMLElement {
        let liElement: HTMLElement = null;
        if (list) {
            const listArr: HTMLElement[] = [].slice.call(list.querySelectorAll(findNode));
            for (let index: number = 0; index < listArr.length; index++) {
                if (listArr[index].getAttribute(attribute) === (value + '')) {
                    liElement = listArr[index];
                    break;
                }
            }
        }
        return liElement;
    }
    private raiseDataBound(
        listItems: { [key: string]: Object }[] | string[] | boolean[] | number[],
        e?: object): void {
        this.hideSpinner();
        const dataBoundEventArgs: DataBoundEventArgs = {
            items: listItems,
            e: e
        };
        this.trigger('dataBound', dataBoundEventArgs);
    }
    private remainingItems(
        dataSource: { [key: string]: Object }[] | string[] | number[] | boolean[],
        fields: FieldSettingsModel): HTMLElement[] {
        const spliceData: { [key: string]: Object }[] | string[] | number[] | boolean[] =
            <{ [key: string]: Object }[] | string[] | number[] | boolean[]>new DataManager(
                dataSource as DataOptions | JSON[]).executeLocal(new Query().skip(100));
        if (this.itemTemplate) {
            const listElements: HTMLElement = this.templateListItem(spliceData as { [key: string]: Object }[], fields);
            return [].slice.call(listElements.childNodes);
        }
        const type: string = this.typeOfData(spliceData).typeof as string;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return ListBase.createListItemFromArray(
                this.createElement, <string[] | number[]>spliceData,
                true,
                <{ [key: string]: Object }>this.listOption(spliceData, fields), this);
        }
        return ListBase.createListItemFromJson(
            this.createElement,
            <{ [key: string]: Object }[]>spliceData,
            <{ [key: string]: Object }>this.listOption(spliceData, fields),
            1,
            true, this);
    }
    private emptyDataRequest(fields: FieldSettingsModel): void {
        const listItems: { [key: string]: Object }[] = [];
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
    /* eslint-disable @typescript-eslint/no-unused-vars */
    protected onActionComplete(
        ulElement: HTMLElement,
        list: { [key: string]: Object }[] | boolean[] | string[] | number[],
        e?: Object): void {
    /* eslint-enable @typescript-eslint/no-unused-vars */
        this.listData = list;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.clearTemplate(['itemTemplate', 'groupTemplate', 'actionFailureTemplate', 'noRecordsTemplate']);
        }
        this.list.innerHTML = '';
        this.fixedHeaderElement = isNullOrUndefined(this.fixedHeaderElement) ? this.fixedHeaderElement : null;
        this.list.appendChild(ulElement);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    protected postRender(
        listElement: HTMLElement,
        list: { [key: string]: Object }[] | number[] | string[] | boolean[],
        bindEvent: boolean): void {
        /* eslint-enable @typescript-eslint/no-unused-vars */
        const focusItem: Element = listElement.querySelector('.' + dropDownBaseClasses.li);
        const selectedItem: Element = listElement.querySelector('.' + dropDownBaseClasses.selected);
        if (focusItem && !selectedItem) {
            focusItem.classList.add(dropDownBaseClasses.focus);
        }
        if (list.length <= 0) {
            this.l10nUpdate();
            addClass([listElement], dropDownBaseClasses.noData);
        } else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
    }

    /**
     * Get the query to do the data operation before list item generation.
     *
     * @param {Query} query - Accepts the external Query that execute along with data processing.
     * @returns {Query} Returns the query to do the data query operation.
     */
    protected getQuery(query: Query): Query {
        return query ? query : this.query ? this.query : new Query();
    }
    /**
     * To render the template content for group header element.
     *
     * @param {HTMLElement} listEle - Specifies the group list elements.
     * @returns {void}
     */
    private renderGroupTemplate(listEle: HTMLElement): void {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            const dataSource: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.dataSource;
            const option: { [key: string]: Object } = { groupTemplateID: this.groupTemplateId, isStringTemplate: this.isStringTemplate };
            const headerItems: Element[] = <NodeListOf<Element> & Element[]>listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            const groupcheck: boolean = this.templateCompiler(this.groupTemplate);
            if (groupcheck) {
                const groupValue: string = select(this.groupTemplate, document).innerHTML.trim();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const tempHeaders: Element[] = ListBase.renderGroupTemplate(
                    groupValue as string, <{ [key: string]: Object }[]>dataSource,
                    (this.fields as FieldSettingsModel & { properties: Object }).properties,
                    headerItems, option, this);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const tempHeaders: Element[] = ListBase.renderGroupTemplate(
                    this.groupTemplate as string, <{ [key: string]: Object }[]>dataSource,
                    (this.fields as FieldSettingsModel & { properties: Object }).properties,
                    headerItems, option, this);
            }
            this.renderReactTemplates();
        }
    }
    /**
     * To create the ul li list items
     *
     * @param {object []} dataSource - Specifies the data to generate the list.
     * @param {FieldSettingsModel} fields - Maps the columns of the data table and binds the data to the component.
     * @returns {HTMLElement} Return the ul li list items.
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
        const options: { [key: string]: Object } = <{ [key: string]: Object }>this.listOption(dataSource, fields);
        const spliceData: { [key: string]: Object }[] = (dataSource.length > 100) ?
            <{ [key: string]: Object }[]>new DataManager(dataSource as DataOptions | JSON[]).executeLocal(new Query().take(100))
            : dataSource;
        this.sortedData = dataSource;
        return ListBase.createList(
            this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true, this);
    }

    protected listOption(
        dataSource: { [key: string]: Object }[] | string[] | number[] | boolean[],
        fields: FieldSettingsModel): FieldSettingsModel {
        const iconCss: boolean = isNullOrUndefined(fields.iconCss) ? false : true;
        const fieldValues: FieldSettingsModel = !isNullOrUndefined((fields as FieldSettingsModel & { properties: Object }).properties) ?
            (fields as FieldSettingsModel & { properties: Object }).properties : fields;
        const options: { [key: string]: Object } = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } as Object };
        return extend({}, options, fields, true);
    }

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

    protected scrollStop(e?: Event): void {
        let target: Element = !isNullOrUndefined(e) ? <Element>e.target : this.list;
        let liHeight: number = parseInt(getComputedStyle(this.getValidLi(), null).getPropertyValue('height'), 10);
        const topIndex: number = Math.round(target.scrollTop / liHeight);
        const liCollections: NodeListOf<Element> = <NodeListOf<Element>>this.list.querySelectorAll('li' + ':not(.e-hide-listitem)');
        for (let i: number = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
                const currentLi: HTMLElement = liCollections[i] as HTMLElement;
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.top = target.scrollTop + 'px';
                this.fixedHeaderElement.style.display = 'block';
                break;
            } else {
                this.fixedHeaderElement.style.display = 'none';
                this.fixedHeaderElement.style.top = 'none';
            }
        }
    }

    protected getValidLi() : HTMLElement {
        return this.liCollections[0];
    }

    /**
     * To render the list items
     *
     * @param {object[]} listData - Specifies the list of array of data.
     * @param {FieldSettingsModel} fields - Maps the columns of the data table and binds the data to the component.
     * @returns {HTMLElement} Return the list items.
     */
    protected renderItems(listData: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement {
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
            this.sortedData = dataSource;
            const spliceData: { [key: string]: Object }[] = (dataSource.length > 100) ?
                <{ [key: string]: Object }[]>new DataManager(dataSource as DataOptions | JSON[]).executeLocal(new Query().take(100))
                : dataSource;
            ulElement = this.templateListItem((this.getModuleName() === 'autocomplete') ? spliceData : dataSource, fields);
        } else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    }

    protected templateListItem(dataSource: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement {
        const option: { [key: string]: Object } = <{ [key: string]: Object }>this.listOption(dataSource, fields);
        option.templateID = this.itemTemplateId;
        option.isStringTemplate = this.isStringTemplate;
        const itemcheck: boolean = this.templateCompiler(this.itemTemplate);
        if (itemcheck) {
            const itemValue: string = select(this.itemTemplate, document).innerHTML.trim();
            return ListBase.renderContentTemplate(
                this.createElement, itemValue, dataSource,
                (fields as FieldSettingsModel & { properties: Object }).properties, option, this);
        } else {
            return ListBase.renderContentTemplate(
                this.createElement, this.itemTemplate, dataSource,
                (fields as FieldSettingsModel & { properties: Object }).properties, option, this);
        }
    }

    protected typeOfData(items:
    { [key: string]: Object }[] | string[] | number[] | boolean[]): { [key: string]: Object } {
        let item: { [key: string]: Object } = { typeof: null, item: null };
        for (let i: number = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                const listDataType: boolean = typeof (items[i]) === 'string' ||
                    typeof (items[i]) === 'number' || typeof (items[i]) === 'boolean';
                const isNullData: boolean = listDataType ? isNullOrUndefined(items[i]) :
                    isNullOrUndefined(getValue((this.fields.value ? this.fields.value : 'value'), items[i]));
                if (!isNullData) {
                    return item = { typeof: typeof items[i], item: items[i] };
                }
            }
        }
        return item;
    }

    protected setFixedHeader(): void {
        this.list.parentElement.style.display = 'block';
        let borderWidth: number = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(
                document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10
            );
            /*Shorthand property not working in Firefox for getComputedStyle method.
            Refer bug report https://bugzilla.mozilla.org/show_bug.cgi?id=137688
            Refer alternate solution https://stackoverflow.com/a/41696234/9133493*/
            if (isNaN(borderWidth)) {
                let borderTopWidth: number = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-top-width'), 10);
                let borderBottomWidth: number = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-bottom-width'), 10);
                let borderLeftWidth: number = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-left-width'), 10);
                let borderRightWidth: number = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-right-width'), 10);
                borderWidth = (borderTopWidth + borderBottomWidth + borderLeftWidth + borderRightWidth);
            }
        }
        const liWidth: number = this.getValidLi().offsetWidth - borderWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        const firstLi: HTMLElement = this.ulElement.querySelector('.' + dropDownBaseClasses.group + ':not(.e-hide-listitem)') as HTMLElement;
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    }
    private getSortedDataSource(dataSource: { [key: string]: Object }[]): { [key: string]: Object }[] {
        if (dataSource && this.sortOrder !== 'None') {
            let textField: string = this.fields.text ? this.fields.text : 'text';
            if (this.typeOfData(dataSource).typeof === 'string' || this.typeOfData(dataSource).typeof === 'number'
            || this.typeOfData(dataSource).typeof === 'boolean') {
                textField = '';
            }
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    }
    /**
     * Return the index of item which matched with given value in data source
     *
     * @param {string | number | boolean} value - Specifies given value.
     * @returns {number} Returns the index of the item.
     */
    protected getIndexByValue(value: string | number | boolean): number {
        let index: number;
        const listItems: Element[] = this.getItems();
        for (let i: number = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    }
    /**
     * To dispatch the event manually
     *
     * @param {HTMLElement} element - Specifies the element to dispatch the event.
     * @param {string} type - Specifies the name of the event.
     * @returns {void}
     */
    protected dispatchEvent(element: HTMLElement, type: string): void {
        const evt: Event = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    }
    /**
     * To set the current fields
     *
     * @returns {void}
     */
    protected setFields(): void {
        if (this.fields.value && !this.fields.text) {
            this.updateFields(this.fields.value, this.fields.value);
        } else if (!this.fields.value && this.fields.text) {
            this.updateFields(this.fields.text, this.fields.text);
        } else if (!this.fields.value && !this.fields.text) {
            this.updateFields('text', 'text');
        }
    }
    /**
     * reset the items list.
     *
     * @param {Object[] | string[] | number[] | DataManager | boolean[]} dataSource - Specifies the data to generate the list.
     * @param {FieldSettingsModel} fields - Maps the columns of the data table and binds the data to the component.
     * @param {Query} query - Accepts the external Query that execute along with data processing.
     * @returns {void}
     */
    protected resetList(
        dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        fields?: FieldSettingsModel, query?: Query): void {
        if (this.list) {
            if ((this.element.tagName === 'SELECT' && (<HTMLSelectElement>this.element).options.length > 0)
                || (this.element.tagName === 'UL' && (<HTMLUListElement>this.element).childNodes.length > 0)) {
                const data: boolean = dataSource instanceof Array ? (dataSource.length > 0)
                    : !isNullOrUndefined(dataSource);
                if (!data && this.selectData && this.selectData.length > 0) {
                    dataSource = this.selectData;
                }
            }
            this.setListData(dataSource, fields, query);
        }
    }

    protected updateSelectElementData(isFiltering: boolean): void {
        if (isFiltering && isNullOrUndefined(this.selectData) && this.listData && this.listData.length > 0) {
            this.selectData = this.listData;
        }
    }

    protected updateSelection(): void {
        // This is for after added the item, need to update the selected index values.
    }
    protected renderList(): void {
        // This is for render the list items.
        this.render();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected updateDataSource(props?: DropDownBaseModel): void {
        this.resetList(this.dataSource);
    }
    protected setUpdateInitial(props: string[], newProp: { [key: string]: string }): void {
        this.isDataFetched = false;
        const updateData: { [key: string]: string | { [key: string]: Object }[] } = {};
        for (let j: number = 0; props.length > j; j++) {
            if ((newProp as { [key: string]: string })[props[j]] && props[j] === 'fields') {
                this.setFields();
                (updateData as { [key: string]: string })[props[j]] = (newProp as { [key: string]: string })[props[j]];
            } else if ((newProp as { [key: string]: string })[props[j]]) {
                (updateData as { [key: string]: string })[props[j]] = (newProp as { [key: string]: string })[props[j]];
            }
        }
        if (Object.keys(updateData).length > 0) {
            if (Object.keys(updateData).indexOf('dataSource') === -1) {
                (updateData as { [key: string]: { [key: string]: Object }[] }).dataSource = this.dataSource as
                    { [key: string]: Object }[];
            }
            this.updateDataSource(updateData);
        }
    }

    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     *
     * @param {DropDownBaseModel} newProp - Returns the dynamic property value of the component.
     * @param {DropDownBaseModel} oldProp - Returns the previous property value of the component.
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: DropDownBaseModel, oldProp: DropDownBaseModel): void {
        if (this.getModuleName() === 'dropdownbase') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string });
        }
        this.setUpdateInitial(['sortOrder', 'itemTemplate'], newProp as { [key: string]: string });
        for (const prop of Object.keys(newProp)) {
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
                    const firstLi: HTMLElement = this.ulElement.querySelector('.' + dropDownBaseClasses.group) as HTMLElement;
                    this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
                }
                break;
            case 'locale':
                if (this.list && (!isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) {
                    this.l10nUpdate();
                }
                break;
            case 'zIndex':
                this.setProperties({ zIndex: newProp.zIndex }, true);
                this.setZIndex();
                break;
            }
        }
    }
    /**
     * Build and render the component
     *
     * @param {boolean} isEmptyData - Specifies the component to initialize with list data or not.
     * @private
     * @returns {void}
     */
    public render(isEmptyData?: boolean): void {
        this.list = this.createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        const rippleModel: RippleOptions = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        const group: HTMLElement = <HTMLElement>this.element.querySelector('select>optgroup');
        if ((this.fields.groupBy || !isNullOrUndefined(group)) && !this.isGroupChecking) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            const wrapperElement: HTMLElement = this.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    }
    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    public getModuleName(): string {
        return 'dropdownbase';
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets all the list items bound on this component.
     *
     * @returns {Element[]}
     */
    public getItems(): Element[] {
        return <HTMLElement[] & NodeListOf<Element>>this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     *
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @returns {void}
     * @deprecated
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        if (!this.list || (this.list.textContent === this.noRecordsTemplate && this.getModuleName() !== 'listbox')) {
            this.renderList();
        }
        if (this.sortOrder !== 'None' && isNullOrUndefined(itemIndex)) {
            let newList: { [key: string]: Object }[] = [].slice.call(this.listData as { [key: string]: Object }[]);
            newList.push(items as { [key: string]: Object });
            newList = this.getSortedDataSource(newList);
            if (this.fields.groupBy) {
                newList = ListBase.groupDataSource(
                    newList, (this.fields as FieldSettingsModel & { properties: Object }).properties, this.sortOrder);
                itemIndex = newList.indexOf(items as { [key: string]: Object });
            } else {
                itemIndex = newList.indexOf(items as { [key: string]: Object });
            }
        }
        const itemsCount: number = this.getItems().length;
        const selectedItemValue: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]) as { [key: string]: Object }[] | string[] | boolean[] | number[];
        let index: number;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        const fields: FieldSettingsModel = this.fields;
        if (items && fields.groupBy) {
            items = ListBase.groupDataSource(
                (items as { [key: string]: Object }[]), (fields as FieldSettingsModel & { properties: Object }).properties);
        }
        const liCollections: HTMLElement[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const item: { [key: string]: Object } | string | boolean | number = items[i];
            const isHeader: boolean = (item as { [key: string]: Object }).isHeader as boolean;
            const li: HTMLElement = this.createElement(
                'li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });

            const itemText: string = item instanceof Object ? getValue(fields.text, item) : item;
            if (isHeader) {
                li.innerText = itemText;
            }
            if (this.itemTemplate && !isHeader) {
                const compiledString: Function = compile(this.itemTemplate);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const addItemTemplate: any = compiledString(
                    item, this, 'itemTemplate', this.itemTemplateId, this.isStringTemplate, null, li);
                if (addItemTemplate) {
                    append(addItemTemplate, li);
                }
            } else if (!isHeader) {
                li.appendChild(document.createTextNode(itemText));
            }
            li.setAttribute('data-value', item instanceof Object ? getValue(fields.value, item) : item);
            li.setAttribute('role', 'option');
            this.notify('addItem', { module: 'CheckBoxSelection', item: li });
            liCollections.push(li);
            (this.listData as { [key: string]: Object }[]).push(item as { [key: string]: Object });
            if (this.sortOrder === 'None' && isNullOrUndefined(itemIndex) && index === 0 ) {
                index = null;
            }
            this.updateActionCompleteData(li, item as { [key: string]: Object }, index);
            //Listbox event
            this.trigger('beforeItemRender', {element: li, item: item});
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.classList.remove(dropDownBaseClasses.noData);
            this.list.appendChild(this.ulElement);
            this.liCollections = liCollections;
            append(liCollections, this.ulElement);
            this.updateAddItemList(this.list, itemsCount);
        } else {
            if (this.getModuleName() === 'listbox' && itemsCount === 0) {
                this.ulElement.innerHTML = '';
            }
            const attr: string[] = [];
            for (let i: number = 0; i < items.length; i++) {
                const listGroupItem: NodeList = this.ulElement.querySelectorAll('.e-list-group-item');
                for (let j: number = 0; j < listGroupItem.length; j++) {
                    attr[j] = (listGroupItem[j] as HTMLElement).innerText;
                }
                if (attr.indexOf(liCollections[i].innerText) > -1 && fields.groupBy) {
                    for (let j: number = 0; j < listGroupItem.length; j++) {
                        if (attr[j] === liCollections[i].innerText ) {
                            if (this.sortOrder === 'None') {
                                this.ulElement.insertBefore(liCollections[i + 1], listGroupItem[j + 1]);
                            } else {
                                this.ulElement.insertBefore(liCollections[i + 1], this.ulElement.childNodes[itemIndex]);
                            }
                            i = i + 1;
                            break;
                        }
                    }
                } else {
                    if (this.liCollections[index]) {
                        this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                    } else {
                        this.ulElement.appendChild(liCollections[i]);
                    }
                }
                const tempLi: HTMLElement[] = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
                if (this.getModuleName() === 'multiselect') {
                    this.updateDataList();
                }
            }
        }
        if (selectedItemValue || itemIndex === 0) {
            this.updateSelection();
        }
    }
    protected validationAttribute(target: HTMLElement, hidden: Element): void {
        const name: string = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        hidden.setAttribute('name', name);
        target.removeAttribute('name');
        const attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            if (!target.getAttribute(attributes[i])) {
                continue;
            }
            const attr: string = target.getAttribute(attributes[i]);
            hidden.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    }

    protected setZIndex(): void {
        // this is for component wise
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }, index?: number): void {
        // this is for ComboBox custom value
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected updateAddItemList(list: HTMLElement, itemCount: number): void {
        // this is for multiselect add item
    }
    protected updateDataList(): void {
        // this is for multiselect update list items
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the data Object that matches the given value.
     *
     * @param { string | number } value - Specifies the value of the list item.
     * @returns {Object}
     */
    public getDataByValue(value: string | number | boolean)
        : { [key: string]: Object } | string | number | boolean {
        if (!isNullOrUndefined(this.listData)) {
            const type: string = this.typeOfData(this.listData).typeof as string;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (const item of this.listData) {
                    if (!isNullOrUndefined(item) && item === value as Object) {
                        return item;
                    }
                }
            } else {
                for (const item of this.listData) {
                    if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     *
     * @method destroy
     * @returns {void}
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
    }
}
export interface ResultData {
    /**
     * To return the JSON result.
     */
    result: { [key: string]: Object }[]
}

export interface FilteringEventArgs {
    /**
     * To prevent the internal filtering action.
     */
    preventDefaultAction: boolean
    /**
     * Gets the `keyup` event arguments.
     */
    baseEventArgs: Object
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean
    /**
     * Search text value.
     */
    text: string
    /**
     * To filter the data from given data source by using query
     *
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}
     */
    updateData(dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[], query?: Query,
        fields?: FieldSettingsModel): void
}
export interface PopupEventArgs {
    /**
     * Specifies the popup Object.
     *
     * @deprecated
     */
    popup: Popup
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean
    /**
     * Specifies the animation Object.
     */
    animation?: AnimationModel
}
export interface FocusEventArgs {
    /**
     * Specifies the focus interacted.
     */
    isInteracted?: boolean
    /**
     * Specifies the event.
     */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
}
