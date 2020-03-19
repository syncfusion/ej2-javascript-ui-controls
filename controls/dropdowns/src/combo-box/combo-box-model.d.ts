import { EventHandler, Property, Event, EmitType, addClass, Browser, KeyboardEventArgs, removeClass, detach } from '@syncfusion/ej2-base';import { isNullOrUndefined, NotifyPropertyChanges, getValue, setValue } from '@syncfusion/ej2-base';import { DropDownList, dropDownListClasses } from '../drop-down-list/drop-down-list';import { FilteringEventArgs } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { Search } from '../common/incremental-search';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';import { DataManager, Query } from '@syncfusion/ej2-data';
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
     * {% codeBlock src='combobox/htmlAttributes/index.md' %}{% endcodeBlock %}
     * 
     * @default {}
     * @deprecated
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
     * @deprecated
     */
    allowFiltering?: boolean;

    /**
     * Accepts the external `Query`
     * that execute along with [`data processing`](../../combo-box/data-binding).
     * 
     * {% codeBlock src='combobox/query/index.md' %}{% endcodeBlock %}
     * @default null
     * @deprecated
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
     * @deprecated
     */
    index?: number;

    /**
     * Specifies whether to show or hide the clear button. 
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     * @default true
     * @blazorOverrideType override
     */
    showClearButton?: boolean;

    /**
     * Enable or disable rendering component in right to left direction.
     * @default false
     * @deprecated
     * @blazorOverrideType override
     */
    enableRtl?: boolean;

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
    filterBarPlaceholder?: string;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     * @default null
     * @deprecated
     */
    cssClass?: string;

    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     * @default null
     * @deprecated
     */
    headerTemplate?: string;

    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     * @default null
     * @deprecated
     */
    footerTemplate?: string;

    /**
     * Specifies a short hint that describes the expected value of the DropDownList component.
     * @default null
     * @deprecated
     */
    placeholder?: string;

    /**
     * Specifies the width of the component. By default, the component width sets based on the width of 
     * its parent container. You can also set the width in pixel values.
     * @default '100%'
     * @aspType string
     * @blazorType string
     * @deprecated
     */
    width?: string | number;

    /**
     * Specifies the height of the popup list.  
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     * @default '300px'
     * @aspType string
     * @blazorType string
     * @deprecated
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of 
     * the component.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     * @default '100%'
     * @aspType string
     * @blazorType string
     * @deprecated
     */
    popupWidth?: string | number;

    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     * @deprecated
     */
    readonly?: boolean;

    /**
     * Gets or sets the display text of the selected item in the component.
     * @default null
     * @deprecated
     */
    text?: string;

    /**
     * Gets or sets the value of the selected item in the component.
     * @default null
     * @isGenericType true
     * @deprecated
     */
    value?: number | string | boolean;

}