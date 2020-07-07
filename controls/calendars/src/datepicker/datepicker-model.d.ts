import { EventHandler, Property, Internationalization, NotifyPropertyChanges, DateFormatOptions, isBlazor } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, Animation, EmitType, Event, extend, L10n, Browser, formatUnit } from '@syncfusion/ej2-base';import { createElement, detach, addClass, removeClass, closest, classList, attributes, select } from '@syncfusion/ej2-base';import { isNullOrUndefined, setValue, getUniqueID, ModuleDeclaration } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { Input, InputObject, IInput, FloatLabelType } from '@syncfusion/ej2-inputs';import { ChangedEventArgs, CalendarView, Calendar, BlurEventArgs, FocusEventArgs, ClearedEventArgs, CalendarType, DayHeaderFormats } from '../calendar/calendar';
import {FormatObject,PopupObjectArgs,PreventableEventArgs} from "./datepicker";
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
     * Gets or sets the selected date of the Calendar.
     * @default null
     * @isGenericType true
     * @deprecated
     */
    value?: Date;

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
     * [`Strict Mode`](../../datepicker/strict-mode/) documentation.
     */
    strictMode?: boolean;

    /**
     * Specifies the format of the value that to be displayed in component. By default, the format is based on the culture. You can set 
     * the format to "format:'dd/MM/yyyy hh:mm'" or "format:{skeleton:'medium'}" either in string or object.
     * > To know more about the date format standards, refer to the Internationalization Date Format 
     * [`Internationalization`](../../common/internationalization/#custom-formats) section.
     * @default null
     * @aspType string
     * @blazorType string
     */
    format?: string | FormatObject;

    /**
     * Specifies the component to be disabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='datepicker/htmlAttributes/index.md' %}{% endcodeBlock %}
     * @default {} 
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     * @private
     */
    values?: Date[];

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     * @private
     */
    isMultiSelection?: boolean;

    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * > Support for `allowEdit` has been provided from 
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#datepicker).
     * 
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit?: boolean;

    /**
     * Customizes the key actions in DatePicker.
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
     * Calendar Navigation
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
     * shiftPageUp<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageDown<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pagedown<br/></td></tr> 
     * <tr> 
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
     * {% codeBlock src='datepicker/keyConfigs/index.md' %}{% endcodeBlock %}
     * @default null
     * @blazorType object 
     * @deprecated
     */
    keyConfigs?: { [key: string]: string };

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     * @deprecated
     */
    enablePersistence?: boolean;

    /**
     * specifies the z-index value of the datePicker popup element.
     * @default 1000
     * @aspType int
     * @blazorType int
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
     * @blazorType Syncfusion.Blazor.Inputs.FloatLabelType
     * @isEnumeration true
     */
    floatLabelType?: FloatLabelType | string;

    /**
     * By default, the date value will be processed based on system time zone.
     * If you want to process the initial date value using server time zone 
     * then specify the time zone value to `serverTimezoneOffset` property.
     * @default null
     * @deprecated
     */
    serverTimezoneOffset?: number;

    /**
     * By default, the popup opens while clicking on the datepicker icon.
     * If you want to open the popup while focusing the date input then specify its value as true.
     * @default false
     */
    openOnFocus?: boolean;

    /**
     * Triggers when the popup is opened.
     * @event
     * @blazorProperty 'OnOpen'
     * @blazorType PopupObjectArgs
     */
    open?: EmitType<PreventableEventArgs | PopupObjectArgs>;

    /**
     * Triggers when datepicker value is cleared using clear button.
     * @event
     */
    cleared?: EmitType<ClearedEventArgs>;

    /**
     * Triggers when the popup is closed.
     * @event
     * @blazorProperty 'OnClose'
     * @blazorType PopupObjectArgs
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
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

}