import { EventHandler, Property, Event, compile, EmitType, KeyboardEvents, append, select, ModuleDeclaration } from '@syncfusion/ej2-base';import { attributes, isNullOrUndefined, getUniqueID, formatUnit, isUndefined, getValue } from '@syncfusion/ej2-base';import { Animation, AnimationModel, Browser, KeyboardEventArgs, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { addClass, removeClass, closest, prepend, detach, classList } from '@syncfusion/ej2-base';import { Popup, isCollide, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { IInput, Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';import { incrementalSearch, resetIncrementalSearchValues } from '../common/incremental-search';import { DropDownBase, dropDownBaseClasses, SelectEventArgs, FilteringEventArgs, PopupEventArgs } from '../drop-down-base/drop-down-base';import { FocusEventArgs, ResultData, BeforeOpenEventArgs } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { DataManager, Query, Predicate, DataOptions } from '@syncfusion/ej2-data';import {Offsets, SentinelType} from '../common/virtual-scroll';
import {ChangeEventArgs} from "./drop-down-list";
import {DropDownBaseModel} from "../drop-down-base/drop-down-base-model";

/**
 * Interface for a class DropDownList
 */
export interface DropDownListModel extends DropDownBaseModel{

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the width of the component. By default, the component width sets based on the width of
     * its parent container. You can also set the width in pixel values.
     *
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies a value that indicates whether the component is enabled or not.
     *
     * @default true
     * @deprecated
     */
    enabled?: boolean;

    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     * @deprecated
     */
    enablePersistence?: boolean;

    /**
     * Specifies the height of the popup list.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '300px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of
     * the component.
     * > For more details about the popup configuration refer to
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     *
     * @default '100%'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies a short hint that describes the expected value of the DropDownList component.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     *
     * @default null
     */
    filterBarPlaceholder?: string;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='dropdownlist/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Accepts the external `Query`
     * that execute along with data processing.
     *
     * {% codeBlock src='dropdownlist/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @deprecated
     */
    query?: Query;

    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to
     * [`Template`](../../drop-down-list/templates) documentation.
     *
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     *
     * @default null
     * @aspType string
     */
    valueTemplate?: string | Function;

    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     *
     * @default null
     * @aspType string
     */
    footerTemplate?: string | Function;

    /**
     * When allowFiltering is set to true, show the filter bar (search box) of the component.
     * The filter action retrieves matched items through the `filtering` event based on
     * the characters typed in the search TextBox.
     *
     * If no match is found, the value of the `noRecordsTemplate` property will be displayed.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     *
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.html" %}{% endcodeBlock %}
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Defines whether the popup opens in fullscreen mode on mobile devices when filtering is enabled. When set to false, the popup will display similarly on both mobile and desktop devices.
     *
     * @default true
     */
    isDeviceFullScreen?: boolean;

    /**
     * When set to true, the user interactions on the component are disabled.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Defines whether to enable virtual scrolling in the component.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Gets or sets a value that indicates whether the DropDownList popup can be resized.
     * When set to `true`, a resize handle appears in the bottom-right corner of the popup,
     * allowing the user to resize the width and height of the popup.
     *
     * @default false
     */
    allowResize?: boolean;

    /**
     * Gets or sets the display text of the selected item in the component.
     *
     * @default null
     * @aspType string
     */
    text?: string | null;

    /**
     * Gets or sets the value of the selected item in the component.
     *
     * @default null
     * @isGenericType true
     */
    value?: number | string | boolean | object | null;

    /**
     * Defines whether the object binding is allowed or not in the component.
     *
     * @default false
     */
    allowObjectBinding?: boolean;

    /**
     * Gets or sets the index of the selected item in the component.
     *
     * {% codeBlock src="dropdownlist/index-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/index-api/index.html" %}{% endcodeBlock %}
     *
     * @default null
     * @aspType double
     */
    index?: number | null;

    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     *
     * {% codeBlock src="dropdownlist/float-label-type-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dropdownlist/float-label-type-api/index.html" %}{% endcodeBlock %}
     *
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    floatLabelType?: FloatLabelType;

    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     *
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Triggers on typing a character in the filter bar when the
     * [`allowFiltering`](./#allowfiltering)
     * is enabled.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     *
     * @event filtering
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by user.
     * Use change event to
     * [`Configure the Cascading DropDownList`](../../drop-down-list/how-to/cascading)
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the popup before opens.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<Object>;

    /**
     * Triggers when the popup opens.
     *
     * @event open
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Triggers when the popup is closed.
     *
     * @event close
     */
    close?: EmitType<PopupEventArgs>;

    /**
     * Triggers when focus moves out from the component.
     *
     * @event blur
     */
    blur?: EmitType<Object>;

    /**
     * Triggers when the component is focused.
     *
     * @event focus
     */
    focus?: EmitType<Object>;

    /**
     * Triggers when the user finishes resizing the DropDown popup.
     *
     * @event resizeStop
     */
    resizeStop?: EmitType<Object>;

    /**
     * Triggers continuously while the DropDown popup is being resized by the user.
     * This event provides live updates on the width and height of the popup.
     *
     * @event resizing
     */
    resizing?: EmitType<Object>;

    /**
     * Triggers when the user starts resizing the DropDown popup.
     *
     * @event resizeStart
     */
    resizeStart?: EmitType<Object>;

}