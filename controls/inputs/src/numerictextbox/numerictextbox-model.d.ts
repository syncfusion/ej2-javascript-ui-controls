import { Component, EventHandler, Property, Event, Browser, L10n, EmitType, getUniqueID } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, BaseEventArgs } from '@syncfusion/ej2-base';import { attributes, addClass, removeClass, detach, closest } from '@syncfusion/ej2-base';import { isNullOrUndefined, getValue, formatUnit, setValue, merge } from '@syncfusion/ej2-base';import { Internationalization, NumberFormatOptions, getNumericObject } from '@syncfusion/ej2-base';import { Input, InputObject, FloatLabelType } from '../input/input';
import {ChangeEventArgs,NumericFocusEventArgs,NumericBlurEventArgs} from "./numerictextbox";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class NumericTextBox
 */
export interface NumericTextBoxModel extends ComponentModel{

    /**
     * Gets or Sets the CSS classes to root element of the NumericTextBox which helps to customize the
     * complete UI styles for the NumericTextBox component.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Sets the value of the NumericTextBox.
     *
     * @default null
     * @aspType object
     * @isGenericType true
     */
    value?: number;

    /**
     * Specifies a minimum value that is allowed a user can enter.
     * For more information on min, refer to
     * [min](../../numerictextbox/getting-started/#range-validation).
     *
     * @default null
     * @aspType object
     * @isGenericType true
     * @deprecated
     */
    min?: number;

    /**
     * Specifies a maximum value that is allowed a user can enter.
     * For more information on max, refer to
     * [max](../../numerictextbox/getting-started/#range-validation).
     *
     * @default null
     * @aspType object
     * @isGenericType true
     * @deprecated
     */
    max?: number;

    /**
     * Specifies the incremental or decremental step size for the NumericTextBox.
     * For more information on step, refer to
     * [step](../../numerictextbox/getting-started/#range-validation).
     *
     * @default 1
     * @isGenericType true
     */
    step?: number;

    /**
     * Specifies the width of the NumericTextBox.
     *
     * @default null
     */
    width?: number | string;

    /**
     * Gets or sets the string shown as a hint/placeholder when the NumericTextBox is empty.
     * It acts as a label and floats above the NumericTextBox based on the
     * <b><a href="#floatlabeltype" target="_blank">floatLabelType.</a></b>
     *
     * @default null
     */
    placeholder?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='numerictextbox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies whether the up and down spin buttons should be displayed in NumericTextBox.
     *
     * @default true
     */
    showSpinButton?: boolean;

    /**
     * Sets a value that enables or disables the readonly state on the NumericTextBox. If it is true,
     * NumericTextBox will not allow your input.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Sets a value that enables or disables the NumericTextBox control.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     *
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Enable or disable persisting NumericTextBox state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies the number format that indicates the display format for the value of the NumericTextBox.
     * For more information on formats, refer to
     * [formats](../../numerictextbox/formats/#standard-formats).
     *
     * @default 'n2'
     */
    format?: string;

    /**
     * Specifies the number precision applied to the textbox value when the NumericTextBox is focused.
     * For more information on decimals, refer to
     * [decimals](../../numerictextbox/formats/#precision-of-numbers).
     *
     * @default null
     */
    decimals?: number;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     *
     * @default null
     */
    currency?: string;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     *
     * @default null
     * @private
     */
    currencyCode?: string;

    /**
     * Specifies a value that indicates whether the NumericTextBox control allows the value for the specified range.
     * If it is true, the input value will be restricted between the min and max range.
     * The typed value gets modified to fit the range on focused out state.
     * Else, it allows any value even out of range value,
     * At that time of wrong value entered, the error class will be added to the component to highlight the error.
     * {% codeBlock src='numerictextbox/strictMode/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    strictMode?: boolean;

    /**
     * Specifies whether the decimals length should be restricted during typing.
     *
     * @default false
     */
    validateDecimalOnType?: boolean;

    /**
     * The <b><a href="#placeholder" target="_blank">placeholder</a></b> acts as a label
     * and floats above the NumericTextBox based on the below values.
     * Possible values are:
     * * `Never` - Never floats the label in the NumericTextBox when the placeholder is available.
     * * `Always` - The floating label always floats above the NumericTextBox.
     * * `Auto` - The floating label floats above the NumericTextBox after focusing it or when enters the value in it.
     *
     * @default Never
     */
    floatLabelType?: FloatLabelType;

    /**
     * Triggers when the NumericTextBox component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the NumericTextBox component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the value of the NumericTextBox changes.
     * The change event of the NumericTextBox component will be triggered in the following scenarios:
     * * Changing the previous value using keyboard interaction and then focusing out of the component.
     * * Focusing on the component and scrolling within the input.
     * * Changing the value using the spin buttons.
     * * Programmatically changing the value using the value property.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus in.
     *
     * @event focus
     */
    focus?: EmitType<NumericFocusEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus out.
     *
     * @event blur
     */
    blur?: EmitType<NumericBlurEventArgs>;

}