import { EventHandler, Internationalization, Property, NotifyPropertyChanges, Browser, RippleOptions } from '@syncfusion/ej2-base';import { Animation, EmitType, Event, AnimationModel, cldrData, getDefaultDateObject, detach } from '@syncfusion/ej2-base';import { createElement, remove, addClass, L10n, removeClass, closest, classList, append, attributes } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, isNullOrUndefined, formatUnit, getValue, rippleEffect } from '@syncfusion/ej2-base';import { ModuleDeclaration, extend } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { Input } from '@syncfusion/ej2-inputs';import { BlurEventArgs, ClearedEventArgs } from '../calendar/calendar';import { DatePicker, PopupObjectArgs } from '../datepicker/datepicker';import { TimePickerBase } from '../timepicker/timepicker';import { cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
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
     * @blazorType int
     */
    step?: number;

    /**
     * Specifies the scroll bar position if there is no value is selected in the timepicker popup list or
     * the given value is not present in the timepicker popup list.
     * @default null
     * @isBlazorNullableType true
     */
    scrollTo?: Date;

    /**
     * specifies the z-index value of the popup element.
     * @default 1000
     * @aspType int
     * @blazorType int
     */
    zIndex?: number;

    /**
     * Customizes the key actions in DateTimePicker.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     * 
     * 
     * Input Navigation
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Key action<br/></td><td colSpan=1 rowSpan=1> 
     * Key<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altUpArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altDownArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+downarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * escape<br/></td><td colSpan=1 rowSpan=1> 
     * escape<br/></td></tr> 
     * </table> 
     * 
     * Calendar Navigation (Use the following list of keys to navigate the currently focused Calendar after the popup has opened). 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Key action<br/></td><td colSpan=1 rowSpan=1> 
     * Key<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlUp<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+38<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlDown<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+40<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveDown<br/></td><td colSpan=1 rowSpan=1> 
     * downarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveUp<br/></td><td colSpan=1 rowSpan=1> 
     * uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveLeft<br/></td><td colSpan=1 rowSpan=1> 
     * leftarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveRight<br/></td><td colSpan=1 rowSpan=1> 
     * rightarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * select<br/></td><td colSpan=1 rowSpan=1> 
     * enter<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * home<br/></td><td colSpan=1 rowSpan=1> 
     * home<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * end<br/></td><td colSpan=1 rowSpan=1> 
     * end<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * pageUp<br/></td><td colSpan=1 rowSpan=1> 
     * pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * pageDown<br/></td><td colSpan=1 rowSpan=1> 
     * pagedown<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageUp<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageDown<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pagedown<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlHome<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+home<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlEnd<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+end<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altUpArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * spacebar<br/></td><td colSpan=1 rowSpan=1> 
     * space<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altRightArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+rightarrow<br/></td></tr>  
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altLeftArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+leftarrow<br/></td></tr> 
     * </table> 
     * 
     * TimePicker Navigation (Use the below list of shortcut keys to interact with the TimePicker after the TimePicker Popup has opened).
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Key action<br/></td><td colSpan=1 rowSpan=1> 
     * Key<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * down<br/></td><td colSpan=1 rowSpan=1> 
     * downarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * up<br/></td><td colSpan=1 rowSpan=1> 
     * uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * left<br/></td><td colSpan=1 rowSpan=1> 
     * leftarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * right<br/></td><td colSpan=1 rowSpan=1> 
     * rightarrow<br/></td></tr> 
     * </table>
     * 
     * @default null
     * @blazorType object 
     */
    keyConfigs?: { [key: string]: string };

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * > Support for `allowEdit` has been provided from 
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#datetimepicker).
     * 
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit?: boolean;

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     * @private
     */
    isMultiSelection?: boolean;

    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     * @private
     */
    values?: Date[];

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
     * [`Strict Mode`](../../datetimepicker/strict-mode/) documentation.
     */
    strictMode?: boolean;

    /**
     * By default, the date value will be processed based on system time zone.
     * If you want to process the initial date value using server time zone 
     * then specify the time zone value to `serverTimezoneOffset` property.
     */
    serverTimezoneOffset?: number;

    /**
     * Triggers when popup is opened.
     * @event 
     * @blazorProperty 'OnOpen'
     * @blazorType PopupObjectArgs
     */
    open?: EmitType<Object>;

    /**
     * Triggers when popup is closed.
     * @event 
     * @blazorProperty 'OnClose'
     * @blazorType PopupObjectArgs
     */
    close?: EmitType<Object>;

    /**
     * Triggers when datetimepicker value is cleared using clear button.
     * @event
     */
    cleared?: EmitType<ClearedEventArgs>;

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
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when DateTimePicker is destroyed.
     * @event 
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

}