import { EventHandler, Property, Internationalization, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, Animation, EmitType, Event, L10n, Browser, formatUnit } from '@syncfusion/ej2-base';import { createElement, detach, addClass, removeClass, closest, classList, attributes } from '@syncfusion/ej2-base';import { isNullOrUndefined, setValue, getUniqueID } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { Input, InputObject, IInput, FloatLabelType, BlurEventArgs, FocusEventArgs } from '@syncfusion/ej2-inputs';import { ChangedEventArgs, CalendarView, Calendar } from '../calendar/calendar';
import {PopupObjectArgs,PreventableEventArgs} from "./datepicker";
import {CalendarModel} from "../calendar/calendar-model";

/**
 * Interface for a class DatePicker
 */
export interface DatePickerModel extends CalendarModel{

    /**
     * Specifies the width of the DatePicker component.
     * @default null
     */
    width?: number | string;

    /**
     * Specifies the root CSS class of the DatePicker that allows to
     * customize the appearance by overriding the styles.
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid date  value within a specified range or else it 
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range date value with highlighted error class.
     * @default false
     * > For more details refer to 
     * [`Strict Mode`](./datepicker/strict-mode.html) documentation.
     */
    strictMode?: boolean;

    /**
     * Specifies the format of the value that to be displayed in component. By default, the format is based on the culture.
     * @default null
     */
    format?: string;

    /**
     * Specifies the component to be disabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit?: boolean;

    /**
     * When set to true, enables RTL mode of the component that displays the content in the       right-to-left direction.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * specifies the z-index value of the datePicker popup element.
     * @default 1000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Specifies the component in readonly state. When the Component is readonly it does not allow user input.
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies the placeholder text that displayed in textbox.
     * @default null
     */
    placeholder?: string;

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
     * Triggers when the popup is opened.
     * @event 
     */
    open?: EmitType<PreventableEventArgs | PopupObjectArgs>;

    /**
     * Triggers when the popup is closed.
     * @event 
     */
    close?: EmitType<PreventableEventArgs | PopupObjectArgs>;

    /**
     * Triggers when the input loses the focus.
     * @event 
     */
    blur?: EmitType<BlurEventArgs>;

    /**
     *  Triggers when the input gets focus.
     * @event 
     */
    focus?: EmitType<FocusEventArgs>;

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

}