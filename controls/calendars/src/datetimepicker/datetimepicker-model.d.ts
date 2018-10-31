import { EventHandler, Internationalization, Property, NotifyPropertyChanges, Browser, RippleOptions } from '@syncfusion/ej2-base';import { Animation, EmitType, Event, AnimationModel, cldrData, getDefaultDateObject, detach } from '@syncfusion/ej2-base';import { createElement, remove, addClass, L10n, removeClass, closest, classList, append, attributes } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, isNullOrUndefined, formatUnit, getValue, rippleEffect } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { Input, BlurEventArgs } from '@syncfusion/ej2-inputs';import { DatePicker, PopupObjectArgs } from '../datepicker/datepicker';import { TimePickerBase } from '../timepicker/timepicker';import { cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import {DatePickerModel} from "../datepicker/datepicker-model";

/**
 * Interface for a class DateTimePicker
 */
export interface DateTimePickerModel extends DatePickerModel{

    /**
     * Specifies the format of the time value that to be displayed in time popup list.
     * @default null
     */
    timeFormat?: string;

    /**
     * Specifies the time interval between the two adjacent time values in the time popup list . 
     * @default 30
     */
    step?: number;

    /**
     * specifies the z-index value of the popup element.
     * @default 1000
     * @aspType int
     */
    zIndex?: number;

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
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Specifies the placeholder text that to be is displayed in textbox.
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid
     * date and time value within a specified range or else it 
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range value with highlighted error class.
     * @default false
     * > For more details refer to 
     * [`Strict Mode`](./datetimepicker/strict-mode.html) documentation.
     */
    strictMode?: boolean;

    /**
     * Triggers when popup is opened.
     * @event 
     */
    open?: EmitType<Object>;

    /**
     * Triggers when popup is closed.
     * @event 
     */
    close?: EmitType<Object>;

    /**
     * Triggers when input loses the focus.
     * @event 
     */
    blur?: EmitType<Object>;

    /**
     * Triggers when input gets focus.
     * @event 
     */
    focus?: EmitType<Object>;

    /**
     * Triggers when DateTimePicker is created.
     * @event 
     */
    created?: EmitType<Object>;

    /**
     * Triggers when DateTimePicker is destroyed.
     * @event 
     */
    destroyed?: EmitType<Object>;

}