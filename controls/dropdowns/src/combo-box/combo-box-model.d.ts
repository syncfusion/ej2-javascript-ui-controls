import { EventHandler, Property, Event, EmitType, addClass, Browser, KeyboardEventArgs, removeClass, detach } from '@syncfusion/ej2-base';import { isNullOrUndefined, NotifyPropertyChanges, getValue, setValue, Complex } from '@syncfusion/ej2-base';import { DropDownList, dropDownListClasses } from '../drop-down-list/drop-down-list';import { FilteringEventArgs, FilterType, FieldSettings } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { Search } from '../common/incremental-search';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';import { SortOrder } from '@syncfusion/ej2-lists';import { DataManager, Query } from '@syncfusion/ej2-data';
import {CustomValueSpecifierEventArgs} from "./combo-box";
import {DropDownListModel} from "../drop-down-list/drop-down-list-model";

/**
 * Interface for a class ComboBox
 */
export interface ComboBoxModel extends DropDownListModel{

    /**
     * Specifies whether suggest a first matched item in input when searching. No action happens when no matches found.
     * @default false
     */
    autofill?: boolean;

    /**
     * Specifies whether the component allows user defined value which does not exist in data source.    
     * @default true
     */
    allowCustom?: boolean;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src="combobox/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

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
    allowFiltering?: boolean;

    /**
     * Accepts the external `Query`
     * that execute along with [`data processing`](../../combo-box/data-binding).
     * 
     * {% codeBlock src="combobox/query-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/query-api/index.html" %}{% endcodeBlock %}
     * @default null
     */
    query?: Query;

    /**
     * Gets or sets the index of the selected item in the component.
     * 
     * {% codeBlock src="combobox/index-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="combobox/index-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     * @blazorType int
     * @isBlazorNullableType true
     * @blazorDefaultValue 
     */
    index?: number;

    /**
     * Specifies whether to show or hide the clear button. 
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Triggers on set a 
     * [`custom value`](../../combo-box/getting-started#custom-values) to this component.
     * @event
     * @blazorProperty 'CustomValueSpecifier'
     */
    customValueSpecifier?: EmitType<CustomValueSpecifierEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * > For more details about the filtering refer to [`Filtering`](../../combo-box/filtering) documentation.
     * @event
     * @blazorProperty 'Filtering'
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     */
    valueTemplate?: string;

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
     * @blazorType Syncfusion.EJ2.Inputs.FloatLabelType
     */
    floatLabelType?: FloatLabelType;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     */
    filterBarPlaceholder?: string;

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
     *   let customers: ComboBox = new ComboBox({
     *      dataSource:new DataManager({ url:'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
     *      query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(5),
     *      fields: { text: 'ContactName', value: 'CustomerID' },
     *      placeholder: 'Select a customer'
     *   });
     *   customers.appendTo("#list");
     * ```
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    fields?: FieldSettingsModel;

    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * We have built-in `template engine`
     * 
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals. 
     * @default null
     */
    itemTemplate?: string;

    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     * @default null
     */
    groupTemplate?: string;

    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No Records Found'
     */
    noRecordsTemplate?: string;

    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     */
    actionFailureTemplate?: string;

    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     * @default None
     */
    sortOrder?: SortOrder;

    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of
     * `DataManager`.
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

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
     * @default 'StartsWith'
     */
    filterType?: FilterType;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     */
    ignoreCase?: boolean;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     */
    zIndex?: number;

    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     */
    ignoreAccent?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default 'en-US'
     */
    locale?: string;

}