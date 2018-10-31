import { Component, EventHandler, Internationalization, } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';import { cldrData, getDefaultDateObject, rippleEffect } from '@syncfusion/ej2-base';import { createElement, removeClass, detach, closest, addClass, attributes } from '@syncfusion/ej2-base';import { getValue, getUniqueID, extend, Browser } from '@syncfusion/ej2-base';import { Property, Event, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import {CalendarView,NavigatedEventArgs,RenderDayCellEventArgs,ChangedEventArgs} from "./calendar";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CalendarBase
 * @private
 */
export interface CalendarBaseModel extends ComponentModel{

    /**
     * Gets or sets the minimum date that can be selected in the Calendar.
     * @default new Date(1900, 00, 01)
     */
    min?: Date;

    /**
     * Gets or sets the maximum date that can be selected in the Calendar.
     * @default new Date(2099, 11, 31)
     */
    max?: Date;

    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * @default 0
     * @aspType int
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](./how-to.html#change-the-first-day-of-the-week) documentation.
     */
    firstDayOfWeek?: number;

    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
     *  
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * View<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr> 
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Month<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the days of the month.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Year<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the months of the year.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Decade<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the years of the decade.<br/></td></tr>
     * </table>
     * 
     * > For more details about start refer to 
     * [`calendarView`](./calendar-views.html#view-restriction)documentation.
     */
    start?: CalendarView;

    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * view<br/></td><td colSpan=1 rowSpan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Month<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the days of the month.<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Year<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the months of the year.<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Decade<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the years of the decade.<br/></td></tr> 
     * </table> 
     * 
     * > For more details about depth refer to 
     *  [`calendarView`](./calendar-views.html#view-restriction)documentation.
     */
    depth?: CalendarView;

    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     * @default false
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](./how-to.html#render-the-calendar-with-week-numbers)documentation.
     */
    weekNumber?: boolean;

    /**
     * Specifies whether the today button is to be displayed or not.
     * @default true
     */
    showTodayButton?: boolean;

    /**
     * When set to true, enables RTL mode of the component that displays the content in the right-to-left direction.
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
     * Triggers when the Calendar is navigated to another level or within the same level of view.
     * @event
     */
    navigated?: EmitType<NavigatedEventArgs>;

    /**
     * Triggers when each day cell of the Calendar is rendered.
     * @event
     */
    renderDayCell?: EmitType<RenderDayCellEventArgs>;

}

/**
 * Interface for a class Calendar
 */
export interface CalendarModel extends CalendarBaseModel{

    /**
     * Gets or sets the selected date of the Calendar.
     * @default null
     */
    value?: Date;

    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     */
    values?: Date[];

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     */
    isMultiSelection?: boolean;

    /**
     * Triggers when the Calendar value is changed.
     * @event  
     */
    change?: EmitType<ChangedEventArgs>;

}