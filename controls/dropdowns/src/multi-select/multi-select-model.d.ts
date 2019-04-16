import { DropDownBase, SelectEventArgs, dropDownBaseClasses, PopupEventArgs, FilteringEventArgs } from '../drop-down-base/drop-down-base';import { ResultData, FocusEventArgs } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { Popup, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { IInput, FloatLabelType } from '@syncfusion/ej2-inputs';import { attributes, setValue } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, extend } from '@syncfusion/ej2-base';import { EventHandler, Property, Event, compile, L10n, EmitType, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Animation, AnimationModel, Browser, prepend } from '@syncfusion/ej2-base';import { MultiSelectModel } from '../multi-select';import { Search } from '../common/incremental-search';import { append, addClass, removeClass, setStyleAttribute, closest, detach, remove, select } from '@syncfusion/ej2-base';import { getUniqueID, formatUnit, isNullOrUndefined, isUndefined, ModuleDeclaration } from '@syncfusion/ej2-base';import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';import { SortOrder } from '@syncfusion/ej2-lists';import { CheckBoxSelection } from './checkbox-selection';import { createFloatLabel, removeFloating, floatLabelFocus, floatLabelBlur } from './float-label';import { IMulitSelect } from './interface';
import {visualMode,MultiSelectChangeEventArgs,RemoveEventArgs,ISelectAllEventArgs,TaggingEventArgs,CustomValueEventArgs} from "./multi-select";
import {DropDownBaseModel} from "../drop-down-base/drop-down-base-model";

/**
 * Interface for a class MultiSelect
 */
export interface MultiSelectModel extends DropDownBaseModel{

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
     */
    width?: string | number;

    /**
     * Gets or sets the height of the popup list. By default it renders based on its list item.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '300px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Gets or sets the width of the popup list and percentage values has calculated based on input width.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../multi-select/getting-started/#configure-the-popup-list) documentation.
     * 
     * @default '100%'
     * @aspType string
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
     */
    allowFiltering?: boolean;

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
     */
    change?: EmitType<MultiSelectChangeEventArgs>;

    /**
     * Fires before the selected item removed from the widget.
     * @event
     */
    removing?: EmitType<RemoveEventArgs>;

    /**
     * Fires after the selected item removed from the widget.
     * @event
     */
    removed?: EmitType<RemoveEventArgs>;

    /**
     * Fires after select all process completion.
     * @event
     */
    selectedAll?: EmitType<ISelectAllEventArgs>;

    /**
     * Fires when popup opens before animation.
     * @event
     */
    beforeOpen?: EmitType<Object>;

    /**
     * Fires when popup opens after animation completion.
     * @event
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Fires when popup close after animation completion.
     * @event
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
     */
    chipSelection?: EmitType<Object>;

    /**
     * Triggers event,when user types a text in search box.
     * > For more details about filtering, refer to [`Filtering`](../../multi-select/filtering) documentation.
     * 
     * @event
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Fires before set the selected item as chip in the component.
     * > For more details about chip customization refer [`Chip Customization`](../../multi-select/chip-customization)
     * 
     * @event
     */
    tagging?: EmitType<TaggingEventArgs>;

    /**
     * Triggers when the [`customValue`](../../multi-select/custom-value) is selected.
     * @event
     */
    customValueSelection?: EmitType<CustomValueEventArgs>;

}