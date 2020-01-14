import { DropDownBase, SelectEventArgs, dropDownBaseClasses, PopupEventArgs, FilteringEventArgs } from '../drop-down-base/drop-down-base';import { ResultData, FocusEventArgs, BeforeOpenEventArgs, FilterType, FieldSettings } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { Popup, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { IInput, FloatLabelType } from '@syncfusion/ej2-inputs';import { attributes, setValue } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, extend } from '@syncfusion/ej2-base';import { EventHandler, Property, Event, compile, L10n, EmitType, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Animation, AnimationModel, Browser, prepend, isBlazor, Complex } from '@syncfusion/ej2-base';import { Search } from '../common/incremental-search';import { append, addClass, removeClass, closest, detach, remove, select } from '@syncfusion/ej2-base';import { getUniqueID, formatUnit, isNullOrUndefined, isUndefined, ModuleDeclaration } from '@syncfusion/ej2-base';import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';import { SortOrder } from '@syncfusion/ej2-lists';import { CheckBoxSelection } from './checkbox-selection';import { createFloatLabel, removeFloating, floatLabelFocus, floatLabelBlur } from './float-label';import { IMulitSelect } from './interface';
import {visualMode,MultiSelectChangeEventArgs,RemoveEventArgs,ISelectAllEventArgs,TaggingEventArgs,CustomValueEventArgs} from "./multi-select";
import {DropDownBaseModel} from "../drop-down-base/drop-down-base-model";

/**
 * Interface for a class MultiSelect
 */
export interface MultiSelectModel extends DropDownBaseModel{

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
     *   let customers: MultiSelect = new MultiSelect({
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
     * Enable or disable persisting MultiSelect component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Accepts the template design and assigns it to the group headers present in the MultiSelect popup list.
     * @default null
     */
    groupTemplate?: string;

    /**
     * Accepts the template design and assigns it to popup list of MultiSelect component
     * when no data is available on the component.
     * @default 'No Records Found'
     */
    noRecordsTemplate?: string;

    /**
     * Accepts the template and assigns it to the popup list content of the MultiSelect component
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
     * Specifies a value that indicates whether the MultiSelect component is enabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Accepts the list items either through local or remote service and binds it to the MultiSelect component.
     * It can be an array of JSON Objects or an instance of
     * `DataManager`.
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

    /**
     * Accepts the external `Query`
     * which will execute along with the data processing in MultiSelect.
     * @default null
     */
    query?: Query;

    /**
     * Determines on which filter type, the MultiSelect component needs to be considered on search action. 
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

    /**
     * Specifies a Boolean value that indicates the whether the grouped list items are 
     * allowed to check by checking the group header in checkbox mode.
     * By default, there is no checkbox provided for group headers.
     * This property allows you to render checkbox for group headers and to select 
     * all the grouped items at once
     * @default false
     */
    enableGroupCheckBox?: boolean;

    /**
     * Sets the CSS classes to root element of this component which helps to customize the
     * complete styles.
     * @default null
     */
    cssClass?: string;

    /**
     * Gets or sets the width of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    width?: string | number;

    /**
     * Gets or sets the height of the popup list. By default it renders based on its list item.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '300px'
     * @aspType string
     * @blazorType string
     */
    popupHeight?: string | number;

    /**
     * Gets or sets the width of the popup list and percentage values has calculated based on input width.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    popupWidth?: string | number;

    /**
     * Gets or sets the placeholder in the component to display the given information
     * in input when no item selected. 
     * @default null
     */
    placeholder?: string;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar. 
     * @default null
     */
    filterBarPlaceholder?: string;

    /**
     * Gets or sets the additional attribute to `HtmlAttributes` property in MultiSelect,
     * which helps to add attribute like title, name etc, input should be key value pair.
     * 
     * {% codeBlock src="multiselect/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/html-attributes-api/index.html" %}{% endcodeBlock %}
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to 
     * [`Template`](../../multi-select/templates) documentation.
     * 
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    valueTemplate?: string;

    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * @default null
     */
    headerTemplate?: string;

    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * @default null
     */
    footerTemplate?: string;

    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * > For more details about the available template options refer to [`Template`](../../multi-select/templates) documentation.
     * 
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    itemTemplate?: string;

    /**
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     * 
     * {% codeBlock src="multiselect/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/allow-filtering-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     * @isBlazorNullableType true
     * @blazorDefaultValue 
     */
    allowFiltering?: boolean;

    /**
     * By default, the multiselect component fires the change event while focus out the component.
     * If you want to fires the change event on every value selection and remove, then disable the changeOnBlur property. 
     * 
     * @default true
     */
    changeOnBlur?: boolean;

    /**
     * Allows user to add a 
     * [`custom value`](../../multi-select/custom-value), the value which is not present in the suggestion list.
     * @default false
     */
    allowCustomValue?: boolean;

    /**
     * Enables close icon with the each selected item.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     * @blazorType int
     */
    maximumSelectionLength?: number;

    /**
     * Gets or sets the `readonly` to input or not. Once enabled, just you can copy or highlight 
     * the text however tab key action will perform.
     * 
     * @default false
     */
    readonly?: boolean;

    /**
     * Selects the list item which maps the data `text` field in the component.
     * @default null
     */
    text?: string;

    /**
     * Selects the list item which maps the data `value` field in the component.
     * @default null
     * @isGenericType true
     */
    value?: number[] | string[] | boolean[];

    /**
     * Hides the selected item from the list item.
     * @default true
     */
    hideSelectedItem?: boolean;

    /**
     * Based on the property, when item get select popup visibility state will changed.
     * @default true
     */
    closePopupOnSelect?: boolean;

    /**
     * configures visibility mode for component interaction.
     * 
     *   - `Box` - selected items will be visualized in chip.
     * 
     *   - `Delimiter` - selected items will be visualized in text content.
     * 
     *   - `Default` - on `focus in` component will act in `box` mode.
     *    on `blur` component will act in `delimiter` mode.
     * 
     *   - `CheckBox` - The 'checkbox' will be visualized in list item.
     * 
     * {% codeBlock src="multiselect/visual-mode-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="multiselect/visual-mode-api/index.html" %}{% endcodeBlock %}
     * 
     * @default Default
     */
    mode?: visualMode;

    /**
     * Sets the delimiter character for 'default' and 'delimiter' visibility modes.
     * @default ','
     */
    delimiterChar?: string;

    /**
     * Sets [`case sensitive`](../../multi-select/filtering/#case-sensitive-filtering)
     * option for filter operation.
     * @default true
     */
    ignoreCase?: boolean;

    /**
     * Allows you to either show or hide the DropDown button on the component
     * 
     * @default false
     */
    showDropDownIcon?: boolean;

    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * 
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     * @blazorType Syncfusion.EJ2.Inputs.FloatLabelType
     */
    floatLabelType?: FloatLabelType;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * 
     * @default false
     */
    showSelectAll?: boolean;

    /**
     * Specifies the selectAllText to be displayed on the component.
     * 
     * @default 'select All'
     */
    selectAllText?: string;

    /**
     * Specifies the UnSelectAllText to be displayed on the component.
     * 
     * @default 'select All'
     */
    unSelectAllText?: string;

    /**
     * Reorder the selected items in popup visibility state.
     * 
     * @default true
     */
    enableSelectionOrder?: boolean;

    /**
     * Whether to automatically open the popup when the control is clicked.
     * @default true
     */
    openOnClick?: boolean;

    /**
     * Fires each time when selection changes happened in list items after model and input value get affected.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<MultiSelectChangeEventArgs>;

    /**
     * Fires before the selected item removed from the widget.
     * @event
     * @blazorProperty 'OnValueRemove'
     */
    removing?: EmitType<RemoveEventArgs>;

    /**
     * Fires after the selected item removed from the widget.
     * @event
     * @blazorProperty 'ValueRemoved'
     */
    removed?: EmitType<RemoveEventArgs>;

    /**
     * Fires after select all process completion.
     * @event
     * @blazorProperty 'SelectedAll'
     */
    selectedAll?: EmitType<ISelectAllEventArgs>;

    /**
     * Fires when popup opens before animation.
     * @event
     * @blazorProperty 'OnOpen'
     * @blazorType BeforeOpenEventArgs
     */
    beforeOpen?: EmitType<Object>;

    /**
     * Fires when popup opens after animation completion.
     * @event
     * @blazorProperty 'Opened'
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Fires when popup close after animation completion.
     * @event
     * @blazorProperty 'OnClose'
     */
    close?: EmitType<PopupEventArgs>;

    /**
     * Event triggers when the input get focus-out.
     * @event
     */
    blur?: EmitType<Object>;

    /**
     * Event triggers when the input get focused.
     * @event
     */
    focus?: EmitType<Object>;

    /**
     * Event triggers when the chip selection.
     * @event
     * @blazorProperty 'ChipSelected'
     */
    chipSelection?: EmitType<Object>;

    /**
     * Triggers event,when user types a text in search box.
     * > For more details about filtering, refer to [`Filtering`](../../multi-select/filtering) documentation.
     * 
     * @event
     * @blazorProperty 'Filtering'
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Fires before set the selected item as chip in the component.
     * > For more details about chip customization refer [`Chip Customization`](../../multi-select/chip-customization)
     * 
     * @event
     * @blazorProperty 'OnChipTag'
     */
    tagging?: EmitType<TaggingEventArgs>;

    /**
     * Triggers when the [`customValue`](../../multi-select/custom-value) is selected.
     * @event
     * @blazorProperty 'CustomValueSpecifier'
     */
    customValueSelection?: EmitType<CustomValueEventArgs>;

}