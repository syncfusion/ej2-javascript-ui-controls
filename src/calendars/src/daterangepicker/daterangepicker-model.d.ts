import { Property, EventHandler, Internationalization, NotifyPropertyChanges, detach, getUniqueID } from '@syncfusion/ej2-base';import { KeyboardEvents, BaseEventArgs, KeyboardEventArgs, Event, EmitType, Browser, L10n, ChildProperty } from '@syncfusion/ej2-base';import { addClass, createElement, remove, closest, select, prepend, removeClass, attributes, Collection } from '@syncfusion/ej2-base';import { isNullOrUndefined, isUndefined, formatUnit, setValue, rippleEffect, merge, extend } from '@syncfusion/ej2-base';import { CalendarView, CalendarBase, NavigatedEventArgs, RenderDayCellEventArgs } from '../calendar/calendar';import { Popup } from '@syncfusion/ej2-popups';import { Button } from '@syncfusion/ej2-buttons';import { Input, InputObject, FloatLabelType, FocusEventArgs, BlurEventArgs } from '@syncfusion/ej2-inputs';import { ListBase, cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import {DateRange,RangeEventArgs} from "./daterangepicker";
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
     * @default null
     */
    value?: Date[] | DateRange;

    /**
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. startDate
     * 2. endDate
     * 3. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies the DateRangePicker in RTL mode that displays the content in the right-to-left direction.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Gets or sets the minimum date that can be selected in the calendar-popup.
     * @default new Date(1900, 00, 01)
     */
    min?: Date;

    /**
     * Gets or sets the maximum date that can be selected in the calendar-popup.
     * @default new Date(2099, 11, 31)
     */
    max?: Date;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](./how-to.html#change-the-first-day-of-the-week) documentation.
     * @default null
     */
    firstDayOfWeek?: number;

    /**
     * Determines whether the week number of the Calendar is to be displayed or not.
     * The week number is displayed in every week row.
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](./how-to.html#render-the-calendar-with-week-numbers)documentation.
     * @default false
     */
    weekNumber?: boolean;

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
     * @default null
     */
    startDate?: Date;

    /**
     * Gets or sets the end date of the date range selection.
     * @default null
     */
    endDate?: Date;

    /**
     * Set the predefined ranges which let the user pick required range easily in a component.
     * > For more details refer to 
     * [`Preset Ranges`](./customization.html#preset-ranges) documentation.
     * @default null
     */
    presets?: PresetsModel[];

    /**
     * Specifies the width of the DateRangePicker component.
     * @default ''
     */
    width?: number | string;

    /**
     * specifies the z-index value of the dateRangePicker popup element.
     * @default 1000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Specifies whether to show or hide the clear icon
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Specifies whether the today button is to be displayed or not.
     * @default true
     * @hidden
     */
    showTodayButton?: boolean;

    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
     * @hidden
     */
    start?: CalendarView;

    /**
     * Sets the maximum level of view (month, year, decade) in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
     * @hidden
     */
    depth?: CalendarView;

    /**
     *  Sets the root CSS class to the DateRangePicker which allows you to customize the appearance.
     * @default ''    
     */
    cssClass?: string;

    /**
     * Sets or gets the string that used between the start and end date string. 
     * @default '-'
     */
    separator?: string;

    /**
     *  Specifies the minimum span of days that can be allowed in date range selection.
     * > For more details refer to 
     * [`Range Span`] (./range-restriction.html#range-span) documentation.
     * @default null    
     */
    minDays?: number;

    /**
     *  Specifies the maximum span of days that can be allowed in a date range selection.
     * > For more details refer to 
     * [`Range Span`](./range-restriction.html#range-span) documentation.
     * @default null
     */
    maxDays?: number;

    /**
     * Specifies the component to act as strict which allows entering only a valid date range in a DateRangePicker.
     * > For more details refer to 
     * [`Strict Mode`](./range-restriction.html#strict-mode)documentation.
     * @default false
     */
    strictMode?: boolean;

    /**
     * Sets or gets the required date format to the start and end date string.
     * > For more details refer to 
     * [`Format`](https://ej2.syncfusion.com/demos/#/material/daterangepicker/format.html)sample.
     * @default null
     */
    format?: string;

    /**
     * Specifies the component to be disabled which prevents the DateRangePicker from user interactions. 
     * @default true
     */
    enabled?: boolean;

    /**
     * Denies the editing the ranges in the DateRangePicker component. 
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    allowEdit?: boolean;

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
     * Specifies the placeholder text that need to be displayed in the DateRangePicker component.
     * 
     * @default null
     */
    placeholder?: string;

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