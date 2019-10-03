import { Property, EventHandler, KeyboardEventArgs, isNullOrUndefined, detach } from '@syncfusion/ej2-base';import { Event, EmitType, Complex } from '@syncfusion/ej2-base';import { removeClass, attributes, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { dropDownListClasses } from '../drop-down-list/drop-down-list';import { ComboBox } from '../combo-box/combo-box';import { highlightSearch } from '../common/highlight-search';import { Search } from '../common/incremental-search';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { FieldSettings, FilteringEventArgs, FilterType } from '../drop-down-base/drop-down-base';import { FloatLabelType, Input } from '@syncfusion/ej2-inputs';import { SortOrder } from '@syncfusion/ej2-lists';import { DataManager, Query } from '@syncfusion/ej2-data';
import {ComboBoxModel} from "../combo-box/combo-box-model";

/**
 * Interface for a class AutoComplete
 */
export interface AutoCompleteModel extends ComboBoxModel{

    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item
     * * value - Maps the value column from data table for each list item
     * * iconCss - Maps the icon class column from data table for each list item
     * * groupBy - Group the list items with it's related items by mapping groupBy field
     * 
     * > For more details about the field mapping refer to [`Data binding`](../../auto-complete/data-binding) documentation.

     */
    fields?: FieldSettingsModel;

    /**
     * When set to ‘false’, consider the [`case-sensitive`](../../auto-complete/filtering/#case-sensitive-filtering)
     * on performing the search to find suggestions.
     * By default consider the casing.

     */
    ignoreCase?: boolean;

    /**
     * Allows you to either show or hide the popup button on the component.

     */
    showPopupButton?: boolean;

    /**
     * When set to ‘true’, highlight the searched characters on suggested list items.
     * > For more details about the highlight refer to [`Custom highlight search`](../../auto-complete/how-to/custom-search) documentation.

     */
    highlight?: boolean;

    /**
     * Supports the [`specified number`](../../auto-complete/filtering#filter-item-count)
     * of list items on the suggestion popup.


     */
    suggestionCount?: number;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src="autocomplete/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/html-attributes-api/index.html" %}{% endcodeBlock %}

     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Accepts the external `query`
     * that execute along with data processing.
     * 
     * {% codeBlock src="autocomplete/query-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="autocomplete/query-api/index.html" %}{% endcodeBlock %}

     */
    query?: Query;

    /**
     * Allows you to set [`the minimum search character length']
     * (../../auto-complete/filtering#limit-the-minimum-filter-character),
     * the search action will perform after typed minimum characters.


     */
    minLength?: number;

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

     */
    filterType?: FilterType;

    /**
     * Triggers on typing a character in the component.
     * @event

     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Not applicable to this component.

     * @private


     */
    index?: number;

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




     */
    floatLabelType?: FloatLabelType;

    /**
     * Not applicable to this component.

     * @private
     */
    valueTemplate?: string;

    /**
     * Not applicable to this component.

     * @private
     */
    filterBarPlaceholder?: string;

    /**
     * Not applicable to this component. 

     * @private
     */
    allowFiltering?: boolean;

    /**
     * Not applicable to this component. 

     * @private
     */
    text?: string;

}