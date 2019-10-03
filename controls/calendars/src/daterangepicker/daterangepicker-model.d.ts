import { Property, EventHandler, Internationalization, NotifyPropertyChanges, detach, getUniqueID } from '@syncfusion/ej2-base';import { KeyboardEvents, BaseEventArgs, KeyboardEventArgs, Event, EmitType, Browser, L10n, ChildProperty } from '@syncfusion/ej2-base';import { addClass, createElement, remove, closest, select, prepend, removeClass, attributes, Collection } from '@syncfusion/ej2-base';import { isNullOrUndefined, isUndefined, formatUnit, setValue, rippleEffect, merge, extend } from '@syncfusion/ej2-base';import { CalendarView, CalendarBase, NavigatedEventArgs, RenderDayCellEventArgs, CalendarType } from '../calendar/calendar';import { Popup } from '@syncfusion/ej2-popups';import { Button } from '@syncfusion/ej2-buttons';import { BlurEventArgs, FocusEventArgs } from '../calendar/calendar';import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';import { ListBase, cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import {DateRange,RangeEventArgs,RangeFormatObject} from "./daterangepicker";
import {CalendarBaseModel} from "../calendar/calendar-model";

/**
 * Interface for a class Presets
 */
export interface PresetsModel {

    /**
     * Defines the label string of the preset range. 
     */
    label?: string;

    /**
     * Defines the start date of the preset range.
     */
    start?: Date;

    /**
     * Defines the end date of the preset range 
     */
    end?: Date;

}

/**
 * Interface for a class DateRangePicker
 */
export interface DateRangePickerModel extends CalendarBaseModel{

    /**
     * Gets or sets the start and end date of the Calendar.

     */
    value?: Date[] | DateRange;

    /**
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. startDate
     * 2. endDate
     * 3. value

     */
    enablePersistence?: boolean;

    /**
     * Gets or sets the minimum date that can be selected in the calendar-popup.


     */
    min?: Date;

    /**
     * Gets or sets the maximum date that can be selected in the calendar-popup.


     */
    max?: Date;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.

     */
    locale?: string;

    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](../../daterangepicker/customization#first-day-of-week) documentation.

     */
    firstDayOfWeek?: number;

    /**
     * Determines whether the week number of the Calendar is to be displayed or not.
     * The week number is displayed in every week row.
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](../../calendar/how-to/week-number#render-the-calendar-with-week-numbers)documentation.

     */
    weekNumber?: boolean;

    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.

     * @private
     */
    calendarMode?: CalendarType;

    /**
     * Triggers when Calendar is created.
     * @event

     */
    created?: EmitType<Object>;

    /**
     * Triggers when Calendar is destroyed.
     * @event

     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the Calendar value is changed.
     * @event  

     */
    change?: EmitType<RangeEventArgs>;

    /**
     * Triggers when the Calendar is navigated to another view or within the same level of view.
     * @event

     */
    navigated?: EmitType<NavigatedEventArgs>;

    /**
     * Triggers when each day cell of the Calendar is rendered.
     * @event

     */
    renderDayCell?: EmitType<RenderDayCellEventArgs>;

    /**
     * Gets or sets the start date of the date range selection.


     */
    startDate?: Date;

    /**
     * Gets or sets the end date of the date range selection.


     */
    endDate?: Date;

    /**
     * Set the predefined ranges which let the user pick required range easily in a component.
     * > For more details refer to 
     * [`Preset Ranges`](../../daterangepicker/customization#preset-ranges) documentation.

     */
    presets?: PresetsModel[];

    /**
     * Specifies the width of the DateRangePicker component.

     */
    width?: number | string;

    /**
     * specifies the z-index value of the dateRangePicker popup element.



     */
    zIndex?: number;

    /**
     * Specifies whether to show or hide the clear icon

     */
    showClearButton?: boolean;

    /**
     * Specifies whether the today button is to be displayed or not.


     */
    showTodayButton?: boolean;

    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.

     */
    start?: CalendarView;

    /**
     * Sets the maximum level of view (month, year, decade) in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.

     */
    depth?: CalendarView;

    /**
     *  Sets the root CSS class to the DateRangePicker which allows you to customize the appearance.

     */
    cssClass?: string;

    /**
     * Sets or gets the string that used between the start and end date string. 

     */
    separator?: string;

    /**
     *  Specifies the minimum span of days that can be allowed in date range selection.
     * > For more details refer to 
     * [`Range Span`](../../daterangepicker/range-restriction/#range-span) documentation.



     */
    minDays?: number;

    /**
     *  Specifies the maximum span of days that can be allowed in a date range selection.
     * > For more details refer to 
     * [`Range Span`](../../daterangepicker/range-restriction/#range-span) documentation.




     */
    maxDays?: number;

    /**
     * Specifies the component to act as strict which allows entering only a valid date range in a DateRangePicker.
     * > For more details refer to 
     * [`Strict Mode`](../../daterangepicker/range-restriction#strict-mode)documentation.

     */
    strictMode?: boolean;

    /**
     * Customizes the key actions in DateRangePicker.
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
     * enter<br/></td><td colSpan=1 rowSpan=1> 
     * enter<br/></td></tr> 
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


     */
    keyConfigs?: { [key: string]: string };

    /**
     * Sets or gets the required date format to the start and end date string.
     * > For more details refer to 
     * [`Format`](https://ej2.syncfusion.com/demos/#/material/daterangepicker/format.html)sample.



     */
    format?: string | RangeFormatObject;

    /**
     * Specifies the component to be disabled which prevents the DateRangePicker from user interactions. 

     */
    enabled?: boolean;

    /**
     * Denies the editing the ranges in the DateRangePicker component. 

     */
    readonly?: boolean;

    /**
     * > Support for `allowEdit` has been provided from 
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#daterangepicker).
     * 
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.

     */
    allowEdit?: boolean;

    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.




     */
    floatLabelType?: FloatLabelType | string;

    /**
     * Specifies the placeholder text that need to be displayed in the DateRangePicker component.
     * 

     */
    placeholder?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.

     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Triggers when the DateRangePicker is opened.
     * @event 


     */
    open?: EmitType<Object>;

    /**
     * Triggers when the DateRangePicker is closed.
     * @event


     */
    close?: EmitType<Object>;

    /**
     * Triggers on selecting the start and end date.
     * @event 


     */
    select?: EmitType<Object>;

    /**
     *  Triggers when the control gets focus.
     * @event
     */
    focus?: EmitType<FocusEventArgs>;

    /**
     * Triggers when the control loses the focus.
     * @event
     */
    blur?: EmitType<BlurEventArgs>;

}