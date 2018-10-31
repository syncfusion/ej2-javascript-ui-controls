import { EventHandler, Property, Internationalization, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, Animation, AnimationModel, Browser, BaseEventArgs } from '@syncfusion/ej2-base';import { EmitType, cldrData, L10n, Component, getDefaultDateObject, rippleEffect, RippleOptions, Event } from '@syncfusion/ej2-base';import { createElement, remove, addClass, removeClass, closest, append, attributes, setStyleAttribute } from '@syncfusion/ej2-base';import { isNullOrUndefined, formatUnit, getValue, setValue, getUniqueID } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { Input, InputObject, IInput, FloatLabelType, FocusEventArgs, BlurEventArgs } from '@syncfusion/ej2-inputs';import { ListBase, cssClass as ListBaseClasses, ListBaseOptions, createElementParams } from '@syncfusion/ej2-lists';
import {ChangeEventArgs,PopupEventArgs,ItemEventArgs} from "./timepicker";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TimePicker
 */
export interface TimePickerModel extends ComponentModel{

    /**
     * Gets or sets the width of the TimePicker component. The width of the popup is based on the width of the component.
     * @default null
     */
    width?: string | number;

    /**
     * Specifies the root CSS class of the TimePicker that allows to
     * customize the appearance by overriding the styles.
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the component to act as strict so that, it allows to enter only a valid time value within a specified range or else 
     * resets to previous value. By default, strictMode is in false.
     * > For more details refer to 
     * [`Strict Mode`] (https://ej2.syncfusion.com/documentation/timepicker/strict-mode.html?lang=typescript) documentation.
     * @default false
     */
    strictMode?: boolean;

    /**
     * Specifies the format of value that is to be displayed in component. By default, the format is
     * based on the culture. 
     * > For more details refer to 
     * [`Format`](./getting-started.html#setting-the-time-format) documentation.
     * @default null
     */
    format?: string;

    /**
     * Specifies whether the component to be disabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the component in readonly state. 
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    floatLabelType?: FloatLabelType | string;

    /**
     * Specifies the placeholder text that is displayed in textbox.
     * @default null
     */
    placeholder?: string;

    /**
     * specifies the z-index value of the timePicker popup element.
     * @default 1000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. Value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Specifies the time interval between the two adjacent time values in the popup list. 
     * > For more details refer to 
     * [`Format`](./getting-started.html#setting-the-time-format)documentation.
     * @default 30
     * 
     */
    step?: number;

    /**
     * Specifies the scroll bar position if there is no value is selected in the popup list or
     *  the given value is not present in the popup list.
     * > For more details refer to 
     * [`Time Duration`](https://ej2.syncfusion.com/demos/#/material/timepicker/list-formatting.html) sample. 
     * @default null
     */
    scrollTo?: Date;

    /**
     * Gets or sets the value of the component. The value is parsed based on the culture specific time format.
     * @default null
     */
    value?: Date;

    /**
     * Gets or sets the minimum time value that can be allowed to select in TimePicker.
     * > For more details refer to 
     * [`Time Range`](https://ej2.syncfusion.com/documentation/timepicker/time-range.html?lang=typescript) documentation.
     * @default 00:00
     */
    min?: Date;

    /**
     * Gets or sets the maximum time value that can be allowed to select in TimePicker.
     * > For more details refer to 
     * [`Time Range`](https://ej2.syncfusion.com/documentation/timepicker/time-range.html?lang=typescript) documentation.
     * @default 00:00
     */
    max?: Date;

    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit?: boolean;

    /**
     * Specifies the TimePicker in RTL mode that displays the content in the right-to-left direction.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Triggers when the value is changed.
     * @event  
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the popup is opened.
     * @event
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Triggers while rendering the each popup list item.
     * @event
     */
    itemRender?: EmitType<ItemEventArgs>;

    /**
     * Triggers when the popup is closed.
     * @event
     */
    close?: EmitType<PopupEventArgs>;

    /**
     * Triggers when the control loses the focus.
     * @event
     */
    blur?: EmitType<BlurEventArgs>;

    /**
     * Triggers when the control gets focused.
     * @event
     */
    focus?: EmitType<FocusEventArgs>;

}