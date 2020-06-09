import { Property, EventHandler, KeyboardEventArgs, isNullOrUndefined, detach } from '@syncfusion/ej2-base';import { Event, EmitType, Complex } from '@syncfusion/ej2-base';import { removeClass, attributes, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { dropDownListClasses } from '../drop-down-list/drop-down-list';import { ComboBox } from '../combo-box/combo-box';import { highlightSearch, revertHighlightSearch } from '../common/highlight-search';import { Search } from '../common/incremental-search';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { FieldSettings, FilteringEventArgs, FilterType } from '../drop-down-base/drop-down-base';import { FloatLabelType, Input } from '@syncfusion/ej2-inputs';import { SortOrder } from '@syncfusion/ej2-lists';import { DataManager, Query } from '@syncfusion/ej2-data';
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
     * {% codeBlock src='autocomplete/fields/index.md' %}{% endcodeBlock %}
     * > For more details about the field mapping refer to [`Data binding`](../../auto-complete/data-binding) documentation.
     * @default { value: null, iconCss: null, groupBy: null}
     * @deprecated
     */
    fields?: FieldSettingsModel;

    /**
     * When set to ‘false’, consider the [`case-sensitive`](../../auto-complete/filtering/#case-sensitive-filtering)
     * on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     * @deprecated
     */
    ignoreCase?: boolean;

    /**
     * Allows you to either show or hide the popup button on the component.
     * @default false
     */
    showPopupButton?: boolean;

    /**
     * When set to ‘true’, highlight the searched characters on suggested list items.
     * > For more details about the highlight refer to [`Custom highlight search`](../../auto-complete/how-to/custom-search) documentation.
     * @default false
     */
    highlight?: boolean;

    /**
     * Supports the [`specified number`](../../auto-complete/filtering#filter-item-count)
     * of list items on the suggestion popup.
     * @default 20
     * @blazorType int
     */
    suggestionCount?: number;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src='autocomplete/htmlAttributes/index.md' %}{% endcodeBlock %}
     * @default {}
     * @deprecated
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Accepts the external `query`
     * that execute along with data processing.
     * 
     * {% codeBlock src='autocomplete/query/index.md' %}{% endcodeBlock %}
     * @default null
     * @deprecated
     */
    query?: Query;

    /**
     * Allows you to set [`the minimum search character length']
     * (../../auto-complete/filtering#limit-the-minimum-filter-character),
     * the search action will perform after typed minimum characters.
     * @default 1
     * @blazorType int
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
     * @default 'Contains'
     * @blazorOverrideType override
     */
    filterType?: FilterType;

    /**
     * Triggers on typing a character in the component.
     * @event
     * @blazorProperty 'Filtering'
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     * @blazorType int
     * @isBlazorNullableType true
     * @blazorDefaultValue 
     * @deprecated
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
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     * @blazorType Syncfusion.Blazor.Inputs.FloatLabelType
     * @deprecated
     */
    floatLabelType?: FloatLabelType;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     * @deprecated
     */
    valueTemplate?: string;

    /**
     * Not applicable to this component.
     * @default null
     * @private
     * @deprecated
     */
    filterBarPlaceholder?: string;

    /**
     * Not applicable to this component. 
     * @default false
     * @private
     * @deprecated
     */
    allowFiltering?: boolean;

    /**
     * Not applicable to this component. 
     * @default null
     * @private
     * @deprecated
     */
    text?: string;

}